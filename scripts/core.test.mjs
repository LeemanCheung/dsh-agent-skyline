import assert from 'node:assert/strict'
import test from 'node:test'
import {
  THEMES,
  buildShareCaption,
  buildSkyline,
  buildSkylineFromMetrics,
  copyTextWithFallback,
  createEmptyHistory,
  createSessionSnapshot,
  escapeXml,
  generateBuildings,
  getFocusableElements,
  getFocusTrapTarget,
  normalizeSessionNodes,
  parseHistory,
  renderSkylineSvg,
  summarizeEvents,
  summarizeHistory,
  upsertHistory,
} from '../src/core.js'

const SECRET_PROMPT = 'SYNTHETIC_SECRET_PROMPT: never-use-in-production'
const SECRET_PATH = '/Users/example/private/acquisition/target-list.xlsx'
const SECRET_COMMAND = 'curl -H "Authorization: Bearer synthetic-test-token" internal.example'

function fixtureNodes() {
  const base = Date.UTC(2026, 7, 26, 8, 0, 0)
  return [
    { kind: 'user-message', createdAt: base, text: SECRET_PROMPT },
    { kind: 'assistant-thinking', createdAt: base + 1_000, content: `Reading ${SECRET_PATH}` },
    { kind: 'tool-call', toolName: 'read_file', createdAt: base + 2_000, args: { path: SECRET_PATH }, status: 'completed', durationMs: 210 },
    { kind: 'tool-call', toolName: 'apply_patch', createdAt: base + 4_000, args: { patch: SECRET_PROMPT }, status: 'completed', durationMs: 540 },
    { kind: 'tool-call', toolName: 'bash', createdAt: base + 6_000, args: { command: SECRET_COMMAND }, status: 'failed', durationMs: 900, error: SECRET_PROMPT },
    { kind: 'tool-call', toolName: 'bash', createdAt: base + 8_000, args: { command: 'npm test' }, status: 'completed', durationMs: 1_200 },
    { kind: 'tool-call', toolName: 'playwright_test', createdAt: base + 11_000, status: 'passed', durationMs: 2_500 },
    { kind: 'tool-call', toolName: 'web_search', createdAt: base + 15_000, status: 'completed', durationMs: 320 },
    { kind: 'workflow-run', name: 'delegate_agent', createdAt: base + 18_000, status: 'completed', durationMs: 3_200 },
    { kind: 'image-render', name: 'screenshot', createdAt: base + 22_000, status: 'completed', durationMs: 280 },
    { kind: 'assistant-message', createdAt: base + 24_000, text: `Done: ${SECRET_PATH}` },
  ]
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(value => Number.parseInt(value, 16) / 255)
  const linear = channels.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722
}

function oneBuildingModel(overrides = {}) {
  const city = buildSkyline({ nodes: [{ kind: 'tool-call', toolName: 'read_file', createdAt: 1, status: 'completed' }], sessionKey: 'structure-test' })
  return {
    ...city,
    buildings: [{ ...city.buildings[0], tierCount: 1, setbacks: [], ...overrides }],
    landmarks: [],
  }
}

test('normalization is deliberately lossy and categorizes coarse activity', () => {
  const events = normalizeSessionNodes(fixtureNodes())
  assert.equal(events.length, 11)
  assert.deepEqual([...new Set(events.map(event => event.category))].sort(),
    ['agent', 'conversation', 'file', 'reasoning', 'shell', 'test', 'vision', 'web'].sort())
  const serialized = JSON.stringify(events)
  assert.equal(serialized.includes(SECRET_PROMPT), false)
  assert.equal(serialized.includes(SECRET_PATH), false)
  assert.equal(serialized.includes(SECRET_COMMAND), false)
  assert.equal(Object.keys(events[0]).sort().join(','), 'category,durationMs,id,index,outcome,timestamp,toolLike')
})

test('metrics identify recovery without exposing the failing command', () => {
  const metrics = summarizeEvents(normalizeSessionNodes(fixtureNodes()))
  assert.equal(metrics.totalEvents, 11)
  assert.equal(metrics.recoveries, 1)
  assert.equal(metrics.categoryCounts.file, 2)
  assert.equal(metrics.categoryCounts.shell, 2)
  assert.ok(metrics.toolEvents >= 7)
  assert.ok(metrics.complexity > metrics.totalEvents)
})

test('city generation is deterministic and bounded', () => {
  const events = normalizeSessionNodes(fixtureNodes())
  const left = buildSkyline({ events, sessionKey: 'alpha' })
  const right = buildSkyline({ events, sessionKey: 'alpha' })
  assert.deepEqual(left.buildings, right.buildings)
  assert.deepEqual(left.identity, right.identity)
  assert.ok(left.buildings.length >= 8)
  assert.ok(left.buildings.length <= 48)
  assert.equal(new Set(left.buildings.map(building => `${building.gridX},${building.gridY}`)).size, left.buildings.length)
  for (const building of left.buildings) {
    assert.ok(Math.max(Math.abs(building.gridX), Math.abs(building.gridY)) > 2,
      'buildings must leave the central civic plaza and buffer open')
    assert.notEqual(building.gridX, 0, 'buildings must leave the north-south civic road open')
    assert.notEqual(building.gridY, 0, 'buildings must leave the east-west civic road open')
    assert.equal(['-4,-2', '4,2', '-2,4', '3,-3'].includes(`${building.gridX},${building.gridY}`), false,
      'buildings must not occupy reserved pocket parks')
  }
})

test('legacy theme IDs remain compatible while every palette is daylight', () => {
  assert.deepEqual(Object.keys(THEMES), ['midnight', 'aurora', 'sunset', 'paper'])
  assert.deepEqual(Object.values(THEMES).map(theme => theme.name), ['Blueprint', 'Garden', 'Terracotta', 'Paper'])
  for (const theme of Object.values(THEMES)) {
    assert.ok(relativeLuminance(theme.background) > .78, `${theme.id} background must remain bright`)
    assert.ok(relativeLuminance(theme.background2) > .72, `${theme.id} secondary background must remain bright`)
    assert.ok(relativeLuminance(theme.ground) > .72, `${theme.id} ground must remain bright`)
    assert.ok(relativeLuminance(theme.panel) > .88, `${theme.id} panel must remain bright`)
  }
  const model = oneBuildingModel()
  assert.match(renderSkylineSvg(model), /data-theme="paper"/)
  assert.match(renderSkylineSvg(model, { theme: 'removed-theme' }), /data-theme="paper"/)
})

test('generated architectural fields are deterministic, complete, and bounded', () => {
  const metrics = summarizeEvents(normalizeSessionNodes(fixtureNodes()))
  const left = generateBuildings(metrics, 715)
  const right = generateBuildings(metrics, 715)
  assert.deepEqual(left, right)
  for (const building of left) {
    for (const field of ['archetype', 'tierCount', 'setbacks', 'roofType', 'facadeRhythm', 'bayCount', 'material', 'podiumHeight']) {
      assert.ok(Object.hasOwn(building, field), `${field} must be generated`)
    }
    assert.ok(building.tierCount >= 1 && building.tierCount <= 3)
    assert.equal(building.setbacks.length, building.tierCount - 1)
    assert.ok(building.bayCount >= 2 && building.bayCount <= 6)
    assert.ok(building.podiumHeight >= 8 && building.podiumHeight <= 24)
  }
})

test('architectural structure fields drive rendered geometry and details', () => {
  const base = {
    archetype: 'stacked', material: 'porcelain', facadeRhythm: 'regular', bayCount: 3,
    roofType: 'flat', tierCount: 1, setbacks: [], podiumHeight: 9,
  }
  const threeTiers = renderSkylineSvg(oneBuildingModel({ ...base, tierCount: 3, setbacks: [3, 5] }))
  assert.equal((threeTiers.match(/class="building-tier"/g) || []).length, 3)
  const shallowSetback = renderSkylineSvg(oneBuildingModel({ ...base, tierCount: 3, setbacks: [2, 2] }))
  const deepSetback = renderSkylineSvg(oneBuildingModel({ ...base, tierCount: 3, setbacks: [9, 9] }))
  assert.notEqual(shallowSetback, deepSetback)

  for (const roofType of ['flat', 'garden', 'equipment', 'lantern', 'spire']) {
    const svg = renderSkylineSvg(oneBuildingModel({ ...base, roofType }))
    assert.match(svg, new RegExp(`class="building-roof roof-${roofType}"`))
  }
  for (const facadeRhythm of ['regular', 'paired', 'vertical', 'ribbon']) {
    const svg = renderSkylineSvg(oneBuildingModel({ ...base, facadeRhythm }))
    assert.match(svg, new RegExp(`class="facade facade-${facadeRhythm}"`))
  }
  const twoBays = renderSkylineSvg(oneBuildingModel({ ...base, bayCount: 2 }))
  const sixBays = renderSkylineSvg(oneBuildingModel({ ...base, bayCount: 6 }))
  assert.equal((twoBays.match(/class="facade-bay"/g) || []).length, 2)
  assert.equal((sixBays.match(/class="facade-bay"/g) || []).length, 10)

  const porcelain = renderSkylineSvg(oneBuildingModel({ ...base, material: 'porcelain' }))
  const glass = renderSkylineSvg(oneBuildingModel({ ...base, material: 'glass' }))
  assert.notEqual(porcelain, glass)
  const lowPodium = renderSkylineSvg(oneBuildingModel({ ...base, podiumHeight: 7 }))
  const highPodium = renderSkylineSvg(oneBuildingModel({ ...base, podiumHeight: 20 }))
  assert.notEqual(lowPodium, highPodium)
  const slab = renderSkylineSvg(oneBuildingModel({ ...base, archetype: 'slab' }))
  const needle = renderSkylineSvg(oneBuildingModel({ ...base, archetype: 'needle' }))
  assert.notEqual(slab, needle)
  assert.match(slab, /class="archetype-detail archetype-slab"/)
  assert.match(needle, /class="archetype-detail archetype-needle"/)
})

test('city scene includes civic fabric and one southeast shadow per building', () => {
  const model = buildSkyline({ nodes: fixtureNodes(), sessionKey: 'civic-fabric' })
  const svg = renderSkylineSvg(model, { theme: 'midnight' })
  assert.match(svg, /class="city-road"/)
  assert.match(svg, /class="civic-plaza"/)
  assert.match(svg, /class="pocket-park"/)
  assert.equal((svg.match(/class="building-shadow"/g) || []).length, model.buildings.length)
  assert.equal(svg.includes('#070A12'), false)
  assert.equal(svg.includes('#000000'), false)
})

test('one thousand dense city seeds stay inside the shared scene/card envelope', () => {
  const nodes = Array.from({ length: 200 }, (_, index) => ({
    kind: 'tool-call', toolName: 'exec_command', createdAt: index + 1, status: 'completed',
  }))
  for (let seed = 0; seed < 1_000; seed += 1) {
    const model = buildSkyline({ nodes, sessionKey: `s-${seed}` })
    assert.equal(model.buildings.length, 48)
    for (const building of model.buildings) {
      const roofReserve = building.roofType === 'spire' ? 42
        : building.roofType === 'lantern' ? 22
          : building.roofType === 'equipment' ? 14 : 9
      const baseX = 820 + (building.gridX - building.gridY) * 34
      const baseY = 296 + (building.gridX + building.gridY) * 18
      const podiumWidth = building.footprint * 1.24 + 8
      const podiumDepth = building.depth * 1.12 + 7
      const envelope = {
        top: baseY - building.height - roofReserve,
        bottom: baseY + (podiumWidth + podiumDepth) * .48 + 18,
        left: baseX - podiumWidth - 3,
        right: baseX + podiumDepth + 18,
      }
      assert.ok(envelope.top >= 20, `seed ${seed} ${building.id} top ${envelope.top} must remain in the scene viewBox`)
      assert.ok(envelope.bottom <= 560, `seed ${seed} ${building.id} bottom ${envelope.bottom} must remain in the scene viewBox`)
      assert.ok(envelope.left >= 350, `seed ${seed} ${building.id} left ${envelope.left} must remain in the scene viewBox`)
      assert.ok(envelope.right <= 1_200, `seed ${seed} ${building.id} right ${envelope.right} must remain in the card viewBox`)
    }
  }
  const model = buildSkyline({ nodes, sessionKey: 's-13' })
  assert.match(renderSkylineSvg(model, { layout: 'scene' }), /data-layout="scene"/)
  assert.match(renderSkylineSvg(model, { layout: 'card' }), /data-layout="card"/)
})

test('monolith detail spans the tower consistently across tier counts', () => {
  const spans = [1, 2, 3].map(tierCount => {
    const model = oneBuildingModel({
      archetype: 'monolith', roofType: 'flat', height: 176, podiumHeight: 9,
      tierCount, setbacks: Array.from({ length: tierCount - 1 }, () => 4),
    })
    const svg = renderSkylineSvg(model, { layout: 'scene' })
    const match = svg.match(/class="archetype-detail archetype-monolith" d="M[\d.-]+ ([\d.-]+)(?:V([\d.-]+)|L[\d.-]+ ([\d.-]+))"/)
    assert.ok(match, 'monolith detail path must be rendered')
    const startY = Number(match[1])
    const endY = Number(match[2] ?? match[3])
    assert.ok(startY >= 20, `monolith roof start ${startY} must remain inside the scene`)
    assert.ok(endY > startY, 'monolith detail must descend from the roof')
    return endY - startY
  })
  for (const [index, span] of spans.entries()) {
    assert.ok(span >= (176 - 9) * .6, `${index + 1}-tier monolith span ${span} must cover the tower rather than one tier`)
  }
  assert.ok(Math.max(...spans) - Math.min(...spans) <= 4, `monolith spans must remain stable across tier counts: ${spans.join(', ')}`)
})

test('scene layout is city-focused while card remains the compatible default', () => {
  const model = buildSkyline({ nodes: fixtureNodes(), sessionKey: 'layout-contract' })
  const scene = renderSkylineSvg(model, { layout: 'scene' })
  assert.match(scene, /width="1200" height="720" viewBox="350 20 900 540"/)
  assert.match(scene, /data-layout="scene"/)
  assert.match(scene, /class="city-road"/)
  assert.match(scene, /class="sky-building"/)
  assert.doesNotMatch(scene, /CITY BLOCKS/)
  assert.doesNotMatch(scene, />AGENT SKYLINE</)
  assert.doesNotMatch(scene, /class="card-footer"/)
  assert.doesNotMatch(scene, /class="card-border"/)

  const card = renderSkylineSvg(model)
  assert.equal(card, renderSkylineSvg(model, { layout: 'card' }))
  assert.match(card, /viewBox="0 0 1200 720"/)
  assert.match(card, /data-layout="card"/)
  assert.match(card, /CITY BLOCKS/)
  assert.match(card, />AGENT SKYLINE</)
  assert.match(card, /class="card-footer"/)
  assert.match(card, /class="card-border"/)
  for (const svg of [scene, card]) {
    assert.equal(svg.includes('<linearGradient'), false)
    assert.equal(svg.includes('!important'), false)
  }
})

test('small sessions grow one visual building per signal before compression', () => {
  const one = buildSkyline({ nodes: [{ kind: 'user-message', createdAt: 1 }], sessionKey: 'one' })
  const four = buildSkyline({ nodes: Array.from({ length: 4 }, (_, index) => ({ kind: 'assistant-thinking', createdAt: index + 1 })), sessionKey: 'four' })
  assert.equal(one.buildings.length, 1)
  assert.equal(four.buildings.length, 4)
})

test('rendered SVG is self-contained, escaped, and privacy-safe', () => {
  const model = buildSkyline({ nodes: fixtureNodes(), sessionKey: 'secure', projectLabel: '<Public & Safe>' })
  const svg = renderSkylineSvg(model, { theme: 'aurora', projectLabel: '<Public & Safe>' })
  assert.match(svg, /^<svg xmlns=/)
  assert.match(svg, /&lt;PUBLIC &amp; SAFE&gt;/)
  assert.match(svg, /No prompts · no paths · no cloud/)
  for (const secret of [SECRET_PROMPT, SECRET_PATH, SECRET_COMMAND]) assert.equal(svg.includes(secret), false)
  assert.equal(svg.includes('<script'), false)
})

test('history upsert is idempotent by sanitized session key', () => {
  const first = createSessionSnapshot(fixtureNodes(), { sessionKey: 'session-a', capturedAt: Date.UTC(2026, 7, 26, 9) })
  const changed = createSessionSnapshot([...fixtureNodes(), { kind: 'tool-call', toolName: 'read_file', status: 'completed' }], {
    sessionKey: 'session-a', capturedAt: Date.UTC(2026, 7, 26, 10),
  })
  let history = upsertHistory(createEmptyHistory(), first)
  history = upsertHistory(history, changed)
  assert.equal(Object.keys(history.sessions).length, 1)
  assert.equal(Object.values(history.sessions)[0].metrics.totalEvents, 12)
})

test('history ranges aggregate sanitized snapshots only', () => {
  const now = Date.UTC(2026, 7, 26, 18)
  let history = createEmptyHistory()
  history = upsertHistory(history, createSessionSnapshot(fixtureNodes(), { sessionKey: 'today', capturedAt: now - 3_600_000 }))
  history = upsertHistory(history, createSessionSnapshot(fixtureNodes(), { sessionKey: 'old', capturedAt: now - 12 * 86_400_000 }))
  const today = summarizeHistory(history, { range: 'today', now })
  const all = summarizeHistory(history, { range: 'all', now })
  assert.equal(today.snapshotCount, 1)
  assert.equal(all.snapshotCount, 2)
  assert.equal(all.metrics.totalEvents, today.metrics.totalEvents * 2)
})

test('malformed history is repaired rather than trusted', () => {
  assert.deepEqual(parseHistory('{bad json'), createEmptyHistory())
  const parsed = parseHistory({ sessions: { unsafe: { sessionKey: SECRET_PATH, capturedAt: 1, metrics: { categoryCounts: { file: 4 } } } } })
  assert.equal(Object.values(parsed.sessions)[0].metrics.totalEvents, 4)
  assert.equal(JSON.stringify(parsed).includes(SECRET_PATH), false)
})

test('aggregate metrics can produce a city with no raw events', () => {
  const metrics = summarizeEvents(normalizeSessionNodes(fixtureNodes()))
  const city = buildSkylineFromMetrics(metrics, { seed: 'aggregate' })
  assert.equal(city.events.length, 0)
  assert.equal(city.metrics.totalEvents, metrics.totalEvents)
  assert.ok(generateBuildings(city.metrics, city.seed).length > 0)
})

test('empty activity produces an empty ground rather than a fake building', () => {
  const city = buildSkyline({ nodes: [], sessionKey: 'empty' })
  assert.equal(city.metrics.totalEvents, 0)
  assert.equal(city.metrics.dominantCategory, 'other')
  assert.equal(city.identity.archetype, 'The Polymath')
  assert.equal(city.buildings.length, 0)
  const svg = renderSkylineSvg(city)
  assert.match(svg, /0\/0 TOWERS ONLINE/)
})

test('replay marks only the newest visible building for rise animation', () => {
  const model = buildSkyline({ nodes: fixtureNodes(), sessionKey: 'animated' })
  const svg = renderSkylineSvg(model, { visibleCount: 4, animateReveal: true })
  assert.equal((svg.match(/<g class="sky-building"[^>]*data-reveal="true"/g) || []).length, 1)
  assert.equal((svg.match(/<g class="sky-building"[^>]*data-reveal="false"/g) || []).length, model.buildings.length - 1)
  assert.match(svg, /@keyframes sky-rise/)
  assert.match(svg, /\.sky-building\[data-reveal="true"\]\{animation:sky-rise/)
  assert.match(svg, /@media \(prefers-reduced-motion:reduce\)\{\.sky-building\[data-reveal="true"\]\{animation:none\}\}/)
  assert.doesNotMatch(svg, /style="[^"]*animation:/)
})

test('caption is concise and never includes raw session content', () => {
  const model = buildSkyline({ nodes: fixtureNodes(), sessionKey: 'caption' })
  const caption = buildShareCaption(model, { rangeLabel: 'This session' })
  assert.match(caption, /Agent Skyline/)
  assert.match(caption, /no prompts or file paths/i)
  for (const secret of [SECRET_PROMPT, SECRET_PATH, SECRET_COMMAND]) assert.equal(caption.includes(secret), false)
})

test('XML escaping covers all markup-significant characters', () => {
  assert.equal(escapeXml(`<>&"'`), '&lt;&gt;&amp;&quot;&apos;')
})

test('clipboard fallback cleans temporary DOM and restores focus for every legacy outcome', async () => {
  const apiDocument = { body: {}, activeElement: null, createElement() { throw new Error('legacy fallback should not run') } }
  assert.equal(await copyTextWithFallback('caption', {
    navigatorRef: { clipboard: { writeText: async () => undefined } },
    documentRef: apiDocument,
  }), true)

  for (const outcome of [true, false, 'throw']) {
    const children = []
    const documentRef = {
      activeElement: null,
      body: {
        appendChild(element) {
          children.push(element)
          documentRef.activeElement = element
        },
      },
      createElement() {
        const area = {
          style: {},
          setAttribute() {},
          select() { documentRef.activeElement = area },
          remove() {
            const index = children.indexOf(area)
            if (index >= 0) children.splice(index, 1)
            documentRef.activeElement = documentRef.body
          },
        }
        return area
      },
      execCommand() {
        if (outcome === 'throw') throw new Error('copy denied')
        return outcome
      },
    }
    const button = {
      focusCalls: 0,
      focus() {
        this.focusCalls += 1
        documentRef.activeElement = this
      },
    }
    documentRef.activeElement = button
    const copied = await copyTextWithFallback('caption', {
      navigatorRef: { clipboard: { writeText: async () => { throw new Error('clipboard denied') } } },
      documentRef,
    })
    assert.equal(copied, outcome === true)
    assert.equal(children.length, 0, `legacy outcome ${outcome} must remove its textarea`)
    assert.equal(documentRef.activeElement, button, `legacy outcome ${outcome} must restore prior focus`)
    assert.equal(button.focusCalls, 1)
  }
})

test('modal focus trap handles initial Shift+Tab and wraps in both directions', () => {
  const first = { getClientRects: () => [1] }
  const middle = { getClientRects: () => [1] }
  const last = { getClientRects: () => [1] }
  const outside = { getClientRects: () => [1] }
  const root = {
    querySelectorAll: () => [first, middle, last],
    contains: element => [first, middle, last].includes(element),
  }

  assert.equal(getFocusTrapTarget(root, outside, true), last)
  assert.equal(getFocusTrapTarget(root, root, true), last)
  assert.equal(getFocusTrapTarget(root, outside, false), first)
  assert.equal(getFocusTrapTarget(root, first, true), last)
  assert.equal(getFocusTrapTarget(root, last, false), first)
  assert.equal(getFocusTrapTarget(root, middle, false), null)
})

test('modal focus targets exclude hidden controls and retain an empty-root fallback', () => {
  const hidden = { getClientRects: () => [] }
  const visible = { getClientRects: () => [1] }
  const root = {
    querySelectorAll: () => [hidden, visible],
    contains: element => element === visible,
  }
  const emptyRoot = {
    querySelectorAll: () => [],
    contains: () => false,
  }

  assert.deepEqual(getFocusableElements(root), [visible])
  assert.equal(getFocusTrapTarget(emptyRoot, null, true), emptyRoot)
})

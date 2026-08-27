import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildShareCaption,
  buildSkyline,
  buildSkylineFromMetrics,
  createEmptyHistory,
  createSessionSnapshot,
  escapeXml,
  generateBuildings,
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
  assert.equal((svg.match(/data-reveal="true"/g) || []).length, 1)
  assert.equal((svg.match(/data-reveal="false"/g) || []).length, model.buildings.length - 1)
  assert.match(svg, /@keyframes sky-rise/)
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

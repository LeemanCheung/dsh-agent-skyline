import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createCitySeed,
  parseCitySeed,
  normalizeTaskDagSnapshot,
  normalizeTokenUsageSnapshot,
  readSanitizedEcosystem,
  selectSeasonalLandmarks,
  renderReadmeBadge,
  createSharePreset,
} from '../src/ecosystem.js'

test('city seeds round-trip sanitized aggregates and reject tampering', () => {
  const secret = 'TOP-SECRET-PROMPT'
  const seed = createCitySeed({
    cityId: 'CITY-ALPHA',
    theme: 'aurora',
    publicLabel: 'Public demo',
    secret,
    metrics: {
      totalEvents: 42,
      recoveries: 2,
      categoryCounts: { file: 9 },
      prompt: secret,
    },
    ecosystem: {
      taskDag: { nodes: 7, title: secret },
      tokenUsage: { totalTokens: 123456, command: secret },
    },
  })
  assert.match(seed, /^sky1\./)
  assert.equal(seed.includes(secret), false)
  const parsed = parseCitySeed(seed)
  assert.equal(parsed.cityId, 'CITY-ALPHA')
  assert.equal(parsed.metrics.totalEvents, 42)
  assert.equal(parsed.ecosystem.taskDag.nodes, 7)
  assert.equal(parsed.ecosystem.tokenUsage.totalTokens, 123456)
  assert.throws(() => parseCitySeed(`${seed.slice(0, -1)}x`), /checksum|Invalid/)
})

test('ecosystem adapters retain numeric aggregates only', () => {
  const task = normalizeTaskDagSnapshot({
    nested: { nodeCount: 8, workflowRuns: 3, messages: 'private' },
  })
  const usage = normalizeTokenUsageSnapshot({
    summary: { input_tokens: 100, output_tokens: 40, requestCount: 2, apiKey: 'secret' },
  })
  assert.deepEqual(task, {
    nodes: 8,
    edges: 0,
    channels: 0,
    workflows: 3,
    agents: 0,
    tasks: 0,
    completed: 0,
    failed: 0,
  })
  assert.equal(usage.totalTokens, 140)
  assert.equal(usage.requests, 2)
  assert.equal(JSON.stringify({ task, usage }).includes('private'), false)
  assert.equal(JSON.stringify({ task, usage }).includes('secret'), false)
})

test('local ecosystem discovery is bounded and ignores unrelated storage', () => {
  const storage = new Map([
    ['unrelated', JSON.stringify({ totalTokens: 999999999 })],
    ['dsh-task-dag:snapshot', JSON.stringify({ nodeCount: 4, edgeCount: 5 })],
    ['dsh-token-usage:summary', JSON.stringify({ total_tokens: 9876, calls: 3 })],
  ])
  const scope = {
    localStorage: {
      length: storage.size,
      key: index => [...storage.keys()][index],
      getItem: key => storage.get(key),
    },
  }
  const result = readSanitizedEcosystem(scope)
  assert.equal(result.taskDag.nodes, 4)
  assert.equal(result.taskDag.edges, 5)
  assert.equal(result.tokenUsage.totalTokens, 9876)
  assert.equal(result.tokenUsage.requests, 3)
})

test('share presets, landmarks, and README badge are deterministic and escaped', () => {
  assert.deepEqual(createSharePreset('vertical'), {
    id: 'vertical',
    width: 1080,
    height: 1920,
    label: 'Vertical 9:16',
  })
  const options = {
    date: new Date('2026-07-10T00:00:00Z'),
    cityId: 'fixed',
    metrics: { recoveries: 1 },
    ecosystem: {
      taskDag: { workflows: 2 },
      tokenUsage: { totalTokens: 120000 },
    },
  }
  assert.deepEqual(selectSeasonalLandmarks(options), selectSeasonalLandmarks(options))
  const badge = renderReadmeBadge({
    cityName: '<unsafe>',
    cityId: 'ID&1',
    metrics: { totalEvents: 8 },
  })
  assert.match(badge, /&lt;unsafe&gt;/)
  assert.doesNotMatch(badge, /<unsafe>/)
  assert.match(badge, /AGENT SKYLINE · V1\.1/)
})

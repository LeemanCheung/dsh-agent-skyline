/**
 * Privacy-safe, dependency-free ecosystem helpers for Agent Skyline v1.1.
 *
 * This module accepts aggregate numeric snapshots only. Textual task content,
 * prompts, commands, paths, model replies, and identifiers from other plugins
 * are never copied into seeds, badges, share cards, or the bridge snapshot.
 */

export const SKYLINE_ECOSYSTEM_VERSION = 1
export const CITY_SEED_PREFIX = 'sky1'
export const ECOSYSTEM_EVENT = 'dsh-agent-skyline:ecosystem'

const TASK_KEYS = Object.freeze({
  nodes: ['nodes', 'nodeCount', 'topologyNodes'],
  edges: ['edges', 'edgeCount', 'structuralEdges'],
  channels: ['channels', 'channelCount', 'communicationChannels'],
  workflows: ['workflows', 'workflowCount', 'workflowRuns'],
  agents: ['agents', 'agentCount', 'subagents', 'teammates'],
  tasks: ['tasks', 'taskCount', 'sharedTasks'],
  completed: ['completed', 'completedCount', 'passed'],
  failed: ['failed', 'failureCount', 'errors'],
})

const TOKEN_KEYS = Object.freeze({
  inputTokens: ['inputTokens', 'input_tokens', 'promptTokens'],
  outputTokens: ['outputTokens', 'output_tokens', 'completionTokens'],
  cachedTokens: ['cachedTokens', 'cacheTokens', 'cache_read_input_tokens'],
  totalTokens: ['totalTokens', 'total_tokens', 'tokens'],
  requests: ['requests', 'requestCount', 'calls'],
  estimatedCostUsd: ['estimatedCostUsd', 'estimated_cost_usd', 'costUsd', 'cost'],
})

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function finite(value, fallback = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return clamp(parsed, 0, maximum)
}

export function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function hashString(value) {
  let hash = 0x811c9dc5
  for (const character of String(value ?? '')) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableValue(value[key])]))
}

export function stableStringify(value) {
  return JSON.stringify(stableValue(value))
}

function encodeUtf8(value) {
  const text = String(value)
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64')
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function decodeUtf8(value) {
  if (typeof Buffer !== 'undefined') return Buffer.from(value, 'base64').toString('utf8')
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function toBase64Url(value) {
  return encodeUtf8(value).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

function fromBase64Url(value) {
  const normalized = String(value).replaceAll('-', '+').replaceAll('_', '/')
  return decodeUtf8(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
}

function firstNumber(object, aliases) {
  if (!object || typeof object !== 'object') return 0
  for (const alias of aliases) {
    if (!Object.hasOwn(object, alias)) continue
    const value = Number(object[alias])
    if (Number.isFinite(value)) return value
  }
  return 0
}

function findAggregateCandidate(value, depth = 0, seen = new Set()) {
  if (!value || typeof value !== 'object' || depth > 5 || seen.has(value)) return []
  seen.add(value)
  const candidates = [value]
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') candidates.push(...findAggregateCandidate(child, depth + 1, seen))
  }
  return candidates
}

function bestAggregate(source, keyMap) {
  const candidates = findAggregateCandidate(source)
  let best = null
  let score = -1
  for (const candidate of candidates) {
    const current = Object.values(keyMap)
      .reduce((sum, aliases) => sum + Number(aliases.some(alias => Object.hasOwn(candidate, alias))), 0)
    if (current > score) {
      best = candidate
      score = current
    }
  }
  return score > 0 ? best : null
}

export function normalizeTaskDagSnapshot(source) {
  const aggregate = bestAggregate(source, TASK_KEYS) || {}
  return Object.freeze(Object.fromEntries(Object.entries(TASK_KEYS).map(([key, aliases]) => [
    key,
    Math.round(finite(firstNumber(aggregate, aliases), 0, 100_000)),
  ])))
}

export function normalizeTokenUsageSnapshot(source) {
  const aggregate = bestAggregate(source, TOKEN_KEYS) || {}
  const result = Object.fromEntries(Object.entries(TOKEN_KEYS).map(([key, aliases]) => [
    key,
    finite(firstNumber(aggregate, aliases), 0, key === 'estimatedCostUsd' ? 1_000_000 : 10_000_000_000),
  ]))
  if (!result.totalTokens) result.totalTokens = result.inputTokens + result.outputTokens + result.cachedTokens
  for (const key of ['inputTokens', 'outputTokens', 'cachedTokens', 'totalTokens', 'requests']) result[key] = Math.round(result[key])
  result.estimatedCostUsd = Math.round(result.estimatedCostUsd * 1_000_000) / 1_000_000
  return Object.freeze(result)
}

function safeParse(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2_000_000) return null
  try { return JSON.parse(value) } catch { return null }
}

function readStorageCandidates(scope, pattern) {
  const results = []
  try {
    const storage = scope?.localStorage
    if (!storage) return results
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (!key || !pattern.test(key)) continue
      const parsed = safeParse(storage.getItem(key))
      if (parsed) results.push(parsed)
    }
  } catch {}
  return results
}

function bestByMagnitude(values, normalizer, fields) {
  let best = normalizer(null)
  let magnitude = 0
  for (const value of values) {
    const normalized = normalizer(value)
    const current = fields.reduce((sum, field) => sum + finite(normalized[field]), 0)
    if (current > magnitude) {
      magnitude = current
      best = normalized
    }
  }
  return best
}

export function readSanitizedEcosystem(scope = globalThis) {
  const taskSources = [
    scope?.__DSH_TASK_DAG_SNAPSHOT__,
    scope?.__DSH_TASK_DAG__,
    scope?.dshTaskDag?.snapshot,
    ...readStorageCandidates(scope, /(?:^|:)dsh-task-dag(?::|$)/iu),
  ].filter(Boolean)
  const tokenSources = [
    scope?.__DSH_TOKEN_USAGE_SNAPSHOT__,
    scope?.__DSH_TOKEN_USAGE__,
    scope?.dshTokenUsage?.snapshot,
    ...readStorageCandidates(scope, /(?:^|:)dsh-token-usage(?::|$)/iu),
  ].filter(Boolean)
  return Object.freeze({
    version: SKYLINE_ECOSYSTEM_VERSION,
    taskDag: bestByMagnitude(taskSources, normalizeTaskDagSnapshot, ['nodes', 'edges', 'channels', 'workflows', 'agents', 'tasks']),
    tokenUsage: bestByMagnitude(tokenSources, normalizeTokenUsageSnapshot, ['totalTokens', 'requests']),
  })
}

function normalizeCounts(value, allowedKeys, maximum = 100_000) {
  const source = value && typeof value === 'object' ? value : {}
  return Object.fromEntries(allowedKeys.map(key => [key, Math.round(finite(source[key], 0, maximum))]))
}

export function sanitizeSeedSnapshot(snapshot = {}) {
  const metrics = snapshot.metrics && typeof snapshot.metrics === 'object' ? snapshot.metrics : snapshot
  const categoryKeys = ['file', 'shell', 'test', 'web', 'agent', 'vision', 'reasoning', 'conversation', 'other']
  const outcomeKeys = ['success', 'failure', 'running', 'neutral']
  const publicLabel = typeof snapshot.publicLabel === 'string' ? snapshot.publicLabel.trim().slice(0, 48) : ''
  return Object.freeze({
    v: SKYLINE_ECOSYSTEM_VERSION,
    cityId: typeof snapshot.cityId === 'string' ? snapshot.cityId.replace(/[^a-z0-9-]/giu, '').slice(0, 32) : '',
    theme: ['midnight', 'aurora', 'sunset', 'paper'].includes(snapshot.theme) ? snapshot.theme : 'midnight',
    publicLabel,
    metrics: Object.freeze({
      totalEvents: Math.round(finite(metrics.totalEvents, 0, 100_000)),
      toolEvents: Math.round(finite(metrics.toolEvents, 0, 100_000)),
      activeMinutes: Math.round(finite(metrics.activeMinutes, 0, 10_000_000)),
      recoveries: Math.round(finite(metrics.recoveries, 0, 100_000)),
      complexity: Math.round(finite(metrics.complexity, 0, 999)),
      categoryCounts: Object.freeze(normalizeCounts(metrics.categoryCounts, categoryKeys)),
      outcomeCounts: Object.freeze(normalizeCounts(metrics.outcomeCounts, outcomeKeys)),
    }),
    ecosystem: Object.freeze({
      taskDag: normalizeTaskDagSnapshot(snapshot.ecosystem?.taskDag),
      tokenUsage: normalizeTokenUsageSnapshot(snapshot.ecosystem?.tokenUsage),
    }),
  })
}

export function createCitySeed(snapshot) {
  const payload = stableStringify(sanitizeSeedSnapshot(snapshot))
  const encoded = toBase64Url(payload)
  const checksum = hashString(`${CITY_SEED_PREFIX}.${encoded}`).toString(36).padStart(7, '0')
  return `${CITY_SEED_PREFIX}.${encoded}.${checksum}`
}

export function parseCitySeed(seed) {
  const parts = String(seed ?? '').trim().split('.')
  if (parts.length !== 3 || parts[0] !== CITY_SEED_PREFIX || parts[1].length > 16_000) {
    throw new Error('Invalid Agent Skyline city seed')
  }
  const expected = hashString(`${parts[0]}.${parts[1]}`).toString(36).padStart(7, '0')
  if (parts[2] !== expected) throw new Error('Agent Skyline city seed checksum mismatch')
  const parsed = JSON.parse(fromBase64Url(parts[1]))
  if (parsed?.v !== SKYLINE_ECOSYSTEM_VERSION) throw new Error('Unsupported Agent Skyline city seed version')
  return sanitizeSeedSnapshot(parsed)
}

export const SHARE_PRESETS = Object.freeze({
  wide: Object.freeze({ id: 'wide', width: 1280, height: 640, label: 'Wide 2:1' }),
  square: Object.freeze({ id: 'square', width: 1080, height: 1080, label: 'Square 1:1' }),
  vertical: Object.freeze({ id: 'vertical', width: 1080, height: 1920, label: 'Vertical 9:16' }),
  badge: Object.freeze({ id: 'badge', width: 600, height: 160, label: 'README badge' }),
})

export function createSharePreset(format = 'wide') {
  return SHARE_PRESETS[format] || SHARE_PRESETS.wide
}

export function selectSeasonalLandmarks({ date = new Date(), cityId = '', metrics = {}, ecosystem = {} } = {}) {
  const current = date instanceof Date ? date : new Date(date)
  const month = Number.isFinite(current.getTime()) ? current.getUTCMonth() + 1 : 1
  const season = month <= 2 || month === 12
    ? 'winter-aurora'
    : month <= 5
      ? 'spring-bloom'
      : month <= 8
        ? 'summer-meteor'
        : 'harvest-lights'
  const result = [season]
  const seed = hashString(`${cityId}|${month}|${metrics.totalEvents || 0}|${metrics.recoveries || 0}`)
  if (finite(metrics.recoveries) > 0) result.push('phoenix-tower')
  if (finite(ecosystem?.taskDag?.workflows) >= 2 || finite(ecosystem?.taskDag?.agents) >= 4) result.push('constellation-gate')
  if (finite(ecosystem?.tokenUsage?.totalTokens) >= 100_000) result.push('memory-archive')
  if (seed % 97 === 0) result.push('zero-day-obelisk')
  else if (seed % 29 === 0) result.push('comet-observatory')
  return Object.freeze([...new Set(result)])
}

export function mergeEcosystemMetrics(metrics = {}, ecosystem = {}) {
  const source = sanitizeSeedSnapshot({ metrics, ecosystem })
  const categoryCounts = { ...source.metrics.categoryCounts }
  categoryCounts.agent += Math.min(24, source.ecosystem.taskDag.agents + source.ecosystem.taskDag.workflows)
  categoryCounts.reasoning += Math.min(24, Math.ceil(source.ecosystem.tokenUsage.totalTokens / 50_000))
  categoryCounts.test += Math.min(12, source.ecosystem.taskDag.completed)
  return Object.freeze({
    ...source.metrics,
    totalEvents: source.metrics.totalEvents + Math.min(60, source.ecosystem.taskDag.nodes + source.ecosystem.tokenUsage.requests),
    categoryCounts: Object.freeze(categoryCounts),
  })
}

export function renderReadmeBadge({ cityName = 'Agent Skyline', cityId = 'PRIVATE', theme = 'midnight', metrics = {}, ecosystem = {} } = {}) {
  const safeName = escapeXml(String(cityName).slice(0, 42))
  const safeId = escapeXml(String(cityId).slice(0, 24))
  const palette = theme === 'paper'
    ? { bg: '#f5f0e6', panel: '#ffffff', text: '#171a1f', muted: '#666a72', accent: '#315beb' }
    : { bg: '#080b13', panel: '#111827', text: '#f5f7ff', muted: '#9aa8c2', accent: '#7c9dff' }
  const total = Math.round(finite(metrics.totalEvents))
  const workflows = Math.round(finite(ecosystem?.taskDag?.workflows))
  const tokens = Math.round(finite(ecosystem?.tokenUsage?.totalTokens))
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160" viewBox="0 0 600 160" role="img" aria-label="${safeName} Agent Skyline badge">
  <rect width="600" height="160" rx="24" fill="${palette.bg}"/>
  <rect x="12" y="12" width="576" height="136" rx="18" fill="${palette.panel}" stroke="${palette.accent}" stroke-opacity=".28"/>
  <g transform="translate(30 31)">
    <path d="M0 72V43l18-10 17 8 22-22 22 20 19-9 22 13v29H0Z" fill="${palette.accent}" opacity=".16"/>
    <path d="M0 72h120M18 62V33m17 29V41m22 21V19m22 43V39m19 23V30" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="178" y="48" fill="${palette.accent}" font-family="Inter,Segoe UI,sans-serif" font-size="13" font-weight="800" letter-spacing="2">AGENT SKYLINE · V1.1</text>
  <text x="178" y="83" fill="${palette.text}" font-family="Inter,Segoe UI,sans-serif" font-size="26" font-weight="800">${safeName}</text>
  <text x="178" y="112" fill="${palette.muted}" font-family="Inter,Segoe UI,sans-serif" font-size="14">CITY ${safeId} · ${total} signals · ${workflows} workflows · ${tokens.toLocaleString('en-US')} tokens</text>
</svg>`
}

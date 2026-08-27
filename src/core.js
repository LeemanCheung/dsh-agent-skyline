/**
 * Pure, dependency-free data and rendering core for dsh-agent-skyline.
 *
 * Privacy contract: normalized events and rendered assets never retain prompt
 * text, tool arguments, file paths, command text, model output, or workspace
 * names. Only coarse categories, outcomes, durations, and timestamps survive.
 */

export const SKYLINE_SCHEMA_VERSION = 1
export const HISTORY_STORAGE_KEY = 'dsh-agent-skyline:history:v1'

export const CATEGORY_ORDER = [
  'file', 'shell', 'test', 'web', 'agent', 'vision', 'reasoning', 'conversation', 'other',
]

export const CATEGORY_META = {
  file: { label: 'Build', short: 'BLD', icon: '▦' },
  shell: { label: 'Run', short: 'RUN', icon: '⌁' },
  test: { label: 'Verify', short: 'TST', icon: '✓' },
  web: { label: 'Explore', short: 'WEB', icon: '⌕' },
  agent: { label: 'Orchestrate', short: 'AGT', icon: '◇' },
  vision: { label: 'See', short: 'VIS', icon: '◉' },
  reasoning: { label: 'Think', short: 'RSN', icon: '◌' },
  conversation: { label: 'Direct', short: 'DIR', icon: '↗' },
  other: { label: 'Other', short: 'ETC', icon: '·' },
}

export const THEMES = {
  midnight: {
    id: 'midnight', name: 'Midnight',
    background: '#070A12', background2: '#10172A', ground: '#111B2D', grid: '#20304A',
    text: '#F4F7FF', muted: '#8D9BB4', accent: '#7C9DFF', accent2: '#9B7CFF', glow: '#6F8CFF',
    success: '#65E6B4', danger: '#FF6F91', panel: '#0C1220',
    category: {
      file: '#78A6FF', shell: '#A889FF', test: '#59DFB0', web: '#57C7FF', agent: '#FFB86B',
      vision: '#FF7CD8', reasoning: '#B8C4DF', conversation: '#89F0E1', other: '#78869F',
    },
  },
  aurora: {
    id: 'aurora', name: 'Aurora',
    background: '#071713', background2: '#12233A', ground: '#102723', grid: '#24423C',
    text: '#F1FFF9', muted: '#8EB6AA', accent: '#5DE4B7', accent2: '#68A9FF', glow: '#53D9B0',
    success: '#80F0BE', danger: '#FF7890', panel: '#0A1D19',
    category: {
      file: '#6AB4FF', shell: '#A68BFF', test: '#63E7AE', web: '#5DE0E6', agent: '#FFC66D',
      vision: '#FF80CC', reasoning: '#B6D8D0', conversation: '#86F5D7', other: '#789A91',
    },
  },
  sunset: {
    id: 'sunset', name: 'Sunset',
    background: '#160A16', background2: '#3B1836', ground: '#261529', grid: '#51304D',
    text: '#FFF7F2', muted: '#C5A0AF', accent: '#FF8F70', accent2: '#D77BFF', glow: '#FF846A',
    success: '#8FE2B0', danger: '#FF6685', panel: '#211020',
    category: {
      file: '#FF9A76', shell: '#C98DFF', test: '#83D9A9', web: '#6EC9FF', agent: '#FFD073',
      vision: '#FF80BF', reasoning: '#D6B7C8', conversation: '#A4E8D8', other: '#A38696',
    },
  },
  paper: {
    id: 'paper', name: 'Paper',
    background: '#EEE9DF', background2: '#DCD6C9', ground: '#D7D0C3', grid: '#BEB5A7',
    text: '#171A1F', muted: '#64666A', accent: '#315BEB', accent2: '#6E49B8', glow: '#315BEB',
    success: '#167C5A', danger: '#C3415D', panel: '#F7F3EA',
    category: {
      file: '#356CE2', shell: '#7955B7', test: '#248066', web: '#2589A3', agent: '#B46A1F',
      vision: '#B54886', reasoning: '#68717C', conversation: '#257E75', other: '#747474',
    },
  },
}

const TOOL_PATTERNS = {
  test: /(?:^|[\s._:/-])(test|tests|pytest|jest|vitest|playwright|cypress|spec|check|lint|typecheck|verify|validation|build)(?:$|[\s._:/-])/i,
  agent: /(?:^|[\s._:/-])(agent|subagent|delegate|workflow|team|teammate|spawn|orchestr|handoff)(?:$|[\s._:/-])/i,
  vision: /(?:^|[\s._:/-])(image|vision|screenshot|canvas|ocr|render|photo|video)(?:$|[\s._:/-])/i,
  web: /(?:^|[\s._:/-])(web|search|browser|fetch|http|crawl|scrape|url|open_page|click|navigate)(?:$|[\s._:/-])/i,
  file: /(?:^|[\s._:/-])(file|read|write|edit|patch|grep|glob|find|list_dir|directory|filesystem|repo|git_diff)(?:$|[\s._:/-])/i,
  shell: /(?:^|[\s._:/-])(shell|bash|terminal|exec|command|process|powershell|cmd|run)(?:$|[\s._:/-])/i,
}

const STATUS_FAILURE = /fail|error|reject|cancel|abort|timeout|invalid|blocked/i
const STATUS_SUCCESS = /success|complete|completed|done|pass|passed|resolved|closed|finish/i
const STATUS_RUNNING = /run|running|pending|stream|active|progress|start/i

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function numberOr(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function firstNumber(...values) {
  for (const value of values) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim().slice(0, 160)
  }
  return ''
}

function dateMs(value) {
  if (value == null) return null
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 10_000_000_000 ? value * 1000 : value
  }
  const parsed = Date.parse(String(value))
  return Number.isFinite(parsed) ? parsed : null
}

export function hashString(value) {
  let hash = 0x811c9dc5
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function mulberry32(seed) {
  let value = seed >>> 0
  return () => {
    value += 0x6D2B79F5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

export function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toHex(value) {
  return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')
}

function mixHex(hex, target, ratio) {
  const source = hex.replace('#', '')
  const destination = target.replace('#', '')
  if (source.length !== 6 || destination.length !== 6) return hex
  const amount = clamp(ratio, 0, 1)
  const components = [0, 2, 4].map(offset => {
    const from = Number.parseInt(source.slice(offset, offset + 2), 16)
    const to = Number.parseInt(destination.slice(offset, offset + 2), 16)
    return toHex(from + (to - from) * amount)
  })
  return `#${components.join('')}`
}

function normalizeToolName(node) {
  return firstString(
    node?.toolName,
    node?.tool_name,
    node?.tool?.name,
    node?.call?.name,
    node?.action?.name,
    node?.data?.toolName,
    node?.data?.tool_name,
    node?.meta?.toolName,
    node?.name,
  ).toLowerCase()
}

function normalizeKind(node) {
  return firstString(node?.kind, node?.type, node?.role, node?.event, node?.data?.kind).toLowerCase()
}

function classifyEvent(kind, toolName) {
  const signal = `${kind} ${toolName}`
  for (const category of ['test', 'agent', 'vision', 'web', 'file', 'shell']) {
    if (TOOL_PATTERNS[category].test(signal)) return category
  }
  if (/reason|thinking|analysis|assistant|model|llm|step/.test(kind)) return 'reasoning'
  if (/user|message|turn|prompt|conversation/.test(kind)) return 'conversation'
  return 'other'
}

function eventOutcome(node) {
  const status = firstString(
    node?.status,
    node?.state,
    node?.phase,
    node?.result?.status,
    node?.data?.status,
    node?.meta?.status,
  ).toLowerCase()
  const hasError = Boolean(node?.error || node?.result?.error || node?.data?.error)
  if (hasError || STATUS_FAILURE.test(status)) return 'failure'
  if (STATUS_SUCCESS.test(status)) return 'success'
  if (STATUS_RUNNING.test(status)) return 'running'
  return 'neutral'
}

function eventDuration(node) {
  const direct = firstNumber(node?.durationMs, node?.duration_ms, node?.elapsedMs, node?.data?.durationMs)
  if (direct != null) return clamp(Math.round(direct), 0, 86_400_000)
  const started = dateMs(node?.startedAt ?? node?.startTime ?? node?.createdAt ?? node?.timestamp)
  const ended = dateMs(node?.endedAt ?? node?.endTime ?? node?.updatedAt)
  if (started != null && ended != null && ended >= started) return clamp(Math.round(ended - started), 0, 86_400_000)
  return 0
}

function eventTimestamp(node, index, baseTime) {
  const value = dateMs(
    node?.timestamp ?? node?.createdAt ?? node?.startedAt ?? node?.time
      ?? node?.data?.timestamp ?? node?.meta?.timestamp,
  )
  return value == null ? baseTime + index * 1000 : value
}

/**
 * Convert arbitrary DSH chat/projection nodes into a deliberately lossy event
 * stream. Raw text and arguments are never copied into the result.
 */
export function normalizeSessionNodes(nodes, options = {}) {
  const list = Array.isArray(nodes) ? nodes : []
  const baseTime = numberOr(options.baseTime, Date.UTC(2026, 0, 1))
  return list.map((node, index) => {
    const kind = normalizeKind(node)
    const toolName = normalizeToolName(node)
    const category = classifyEvent(kind, toolName)
    const outcome = eventOutcome(node)
    const timestamp = eventTimestamp(node, index, baseTime)
    const durationMs = eventDuration(node)
    const toolLike = Boolean(toolName) || ['file', 'shell', 'test', 'web', 'agent', 'vision'].includes(category)
    const fingerprint = `${category}|${outcome}|${Math.floor(timestamp / 1000)}|${durationMs}|${index}`
    return Object.freeze({
      id: `evt_${hashString(fingerprint).toString(36)}`,
      index,
      timestamp,
      durationMs,
      category,
      outcome,
      toolLike,
    })
  })
}

function emptyCategoryCounts() {
  return Object.fromEntries(CATEGORY_ORDER.map(category => [category, 0]))
}

function calculateRecoveries(events) {
  let recoveries = 0
  const lastFailure = new Map()
  for (const event of events) {
    if (event.outcome === 'failure') lastFailure.set(event.category, event.index)
    if (event.outcome === 'success' && lastFailure.has(event.category)) {
      const failureIndex = lastFailure.get(event.category)
      if (event.index - failureIndex <= 8) {
        recoveries += 1
        lastFailure.delete(event.category)
      }
    }
  }
  return recoveries
}

function calculateActiveMinutes(events) {
  if (!events.length) return 0
  const sorted = [...events].sort((left, right) => left.timestamp - right.timestamp)
  let activeMs = sorted.reduce((sum, event) => sum + event.durationMs, 0)
  for (let index = 1; index < sorted.length; index += 1) {
    const gap = sorted[index].timestamp - sorted[index - 1].timestamp
    activeMs += clamp(gap, 0, 120_000)
  }
  return Math.max(1, Math.round(activeMs / 60_000))
}

export function summarizeEvents(events) {
  const safeEvents = Array.isArray(events) ? events : []
  const categoryCounts = emptyCategoryCounts()
  const outcomeCounts = { success: 0, failure: 0, running: 0, neutral: 0 }
  let toolEvents = 0
  let durationMs = 0
  for (const event of safeEvents) {
    const category = CATEGORY_ORDER.includes(event.category) ? event.category : 'other'
    categoryCounts[category] += 1
    const outcome = Object.hasOwn(outcomeCounts, event.outcome) ? event.outcome : 'neutral'
    outcomeCounts[outcome] += 1
    if (event.toolLike) toolEvents += 1
    durationMs += clamp(numberOr(event.durationMs), 0, 86_400_000)
  }
  const usedCategories = CATEGORY_ORDER.filter(category => categoryCounts[category] > 0)
  const dominantCategory = safeEvents.length
    ? [...CATEGORY_ORDER].sort((left, right) => categoryCounts[right] - categoryCounts[left] || CATEGORY_ORDER.indexOf(left) - CATEGORY_ORDER.indexOf(right))[0]
    : 'other'
  const recoveries = calculateRecoveries(safeEvents)
  const activeMinutes = calculateActiveMinutes(safeEvents)
  const completionRate = safeEvents.length
    ? Math.round((outcomeCounts.success / Math.max(1, outcomeCounts.success + outcomeCounts.failure)) * 100)
    : 0
  const complexity = clamp(Math.round(
    safeEvents.length * 0.8
      + toolEvents * 1.25
      + usedCategories.length * 6
      + categoryCounts.agent * 4
      + recoveries * 5,
  ), 0, 999)
  return Object.freeze({
    totalEvents: safeEvents.length,
    toolEvents,
    categoryCounts: Object.freeze(categoryCounts),
    outcomeCounts: Object.freeze(outcomeCounts),
    uniqueCategories: usedCategories.length,
    dominantCategory,
    recoveries,
    activeMinutes,
    durationMs,
    completionRate,
    complexity,
    startedAt: safeEvents.length ? Math.min(...safeEvents.map(event => event.timestamp)) : null,
    endedAt: safeEvents.length ? Math.max(...safeEvents.map(event => event.timestamp)) : null,
  })
}

export function createSessionSnapshot(nodes, options = {}) {
  const events = normalizeSessionNodes(nodes, options)
  const metrics = summarizeEvents(events)
  const sessionKey = firstString(options.sessionKey) || `session-${hashString(events.map(event => event.id).join('|')).toString(36)}`
  return Object.freeze({
    schemaVersion: SKYLINE_SCHEMA_VERSION,
    sessionKey: `s_${hashString(sessionKey).toString(36)}`,
    capturedAt: numberOr(options.capturedAt, Date.now()),
    metrics,
  })
}

function opaqueSessionKey(value, fallback) {
  const candidate = firstString(value)
  if (/^s_[a-z0-9]+$/i.test(candidate)) return candidate
  return `s_${hashString(candidate || String(fallback)).toString(36)}`
}

function sanitizeSnapshot(snapshot) {
  const counts = emptyCategoryCounts()
  for (const category of CATEGORY_ORDER) counts[category] = clamp(Math.round(numberOr(snapshot?.metrics?.categoryCounts?.[category])), 0, 1_000_000)
  const totalEvents = Object.values(counts).reduce((sum, value) => sum + value, 0)
  return {
    schemaVersion: SKYLINE_SCHEMA_VERSION,
    sessionKey: opaqueSessionKey(snapshot?.sessionKey, snapshot?.capturedAt),
    capturedAt: numberOr(snapshot?.capturedAt, Date.now()),
    metrics: {
      totalEvents,
      toolEvents: clamp(Math.round(numberOr(snapshot?.metrics?.toolEvents)), 0, totalEvents),
      categoryCounts: counts,
      outcomeCounts: {
        success: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.success)), 0, totalEvents),
        failure: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.failure)), 0, totalEvents),
        running: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.running)), 0, totalEvents),
        neutral: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.neutral)), 0, totalEvents),
      },
      uniqueCategories: CATEGORY_ORDER.filter(category => counts[category] > 0).length,
      dominantCategory: CATEGORY_ORDER.includes(snapshot?.metrics?.dominantCategory) ? snapshot.metrics.dominantCategory : 'other',
      recoveries: clamp(Math.round(numberOr(snapshot?.metrics?.recoveries)), 0, totalEvents),
      activeMinutes: clamp(Math.round(numberOr(snapshot?.metrics?.activeMinutes)), 0, 1_000_000),
      durationMs: clamp(Math.round(numberOr(snapshot?.metrics?.durationMs)), 0, 31_536_000_000),
      completionRate: clamp(Math.round(numberOr(snapshot?.metrics?.completionRate)), 0, 100),
      complexity: clamp(Math.round(numberOr(snapshot?.metrics?.complexity)), 0, 1_000_000),
      startedAt: snapshot?.metrics?.startedAt == null ? null : numberOr(snapshot.metrics.startedAt),
      endedAt: snapshot?.metrics?.endedAt == null ? null : numberOr(snapshot.metrics.endedAt),
    },
  }
}

export function createEmptyHistory() {
  return { schemaVersion: SKYLINE_SCHEMA_VERSION, sessions: {} }
}

export function parseHistory(value) {
  if (!value) return createEmptyHistory()
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    if (!parsed || typeof parsed !== 'object') return createEmptyHistory()
    const sessions = {}
    for (const [key, snapshot] of Object.entries(parsed.sessions || {}).slice(-500)) {
      const safe = sanitizeSnapshot(snapshot)
      sessions[safe.sessionKey] = safe
    }
    return { schemaVersion: SKYLINE_SCHEMA_VERSION, sessions }
  } catch {
    return createEmptyHistory()
  }
}

export function upsertHistory(history, snapshot, options = {}) {
  const current = parseHistory(history)
  const safe = sanitizeSnapshot(snapshot)
  const sessions = { ...current.sessions, [safe.sessionKey]: safe }
  const maxSessions = clamp(Math.round(numberOr(options.maxSessions, 180)), 1, 500)
  const ordered = Object.entries(sessions).sort(([, left], [, right]) => left.capturedAt - right.capturedAt)
  while (ordered.length > maxSessions) ordered.shift()
  return {
    schemaVersion: SKYLINE_SCHEMA_VERSION,
    sessions: Object.fromEntries(ordered),
  }
}

export function summarizeHistory(history, options = {}) {
  const parsed = parseHistory(history)
  const now = numberOr(options.now, Date.now())
  const range = options.range || 'all'
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  const threshold = range === 'today' ? startOfDay.getTime()
    : range === 'week' ? now - 7 * 86_400_000
      : Number.NEGATIVE_INFINITY
  const snapshots = Object.values(parsed.sessions).filter(snapshot => snapshot.capturedAt >= threshold)
  const categoryCounts = emptyCategoryCounts()
  const outcomeCounts = { success: 0, failure: 0, running: 0, neutral: 0 }
  let toolEvents = 0
  let recoveries = 0
  let activeMinutes = 0
  let durationMs = 0
  for (const snapshot of snapshots) {
    for (const category of CATEGORY_ORDER) categoryCounts[category] += numberOr(snapshot.metrics.categoryCounts[category])
    for (const outcome of Object.keys(outcomeCounts)) outcomeCounts[outcome] += numberOr(snapshot.metrics.outcomeCounts[outcome])
    toolEvents += numberOr(snapshot.metrics.toolEvents)
    recoveries += numberOr(snapshot.metrics.recoveries)
    activeMinutes += numberOr(snapshot.metrics.activeMinutes)
    durationMs += numberOr(snapshot.metrics.durationMs)
  }
  const totalEvents = Object.values(categoryCounts).reduce((sum, value) => sum + value, 0)
  const uniqueCategories = CATEGORY_ORDER.filter(category => categoryCounts[category] > 0).length
  const dominantCategory = totalEvents > 0
    ? [...CATEGORY_ORDER].sort((left, right) => categoryCounts[right] - categoryCounts[left] || CATEGORY_ORDER.indexOf(left) - CATEGORY_ORDER.indexOf(right))[0]
    : 'other'
  const completionRate = Math.round((outcomeCounts.success / Math.max(1, outcomeCounts.success + outcomeCounts.failure)) * 100)
  const complexity = clamp(Math.round(totalEvents * 0.8 + toolEvents * 1.25 + uniqueCategories * 6 + categoryCounts.agent * 4 + recoveries * 5), 0, 1_000_000)
  return {
    snapshotCount: snapshots.length,
    metrics: {
      totalEvents, toolEvents, categoryCounts, outcomeCounts, uniqueCategories, dominantCategory,
      recoveries, activeMinutes, durationMs, completionRate, complexity,
      startedAt: snapshots.length ? Math.min(...snapshots.map(snapshot => snapshot.capturedAt)) : null,
      endedAt: snapshots.length ? Math.max(...snapshots.map(snapshot => snapshot.capturedAt)) : null,
    },
  }
}

function spiralCells(limit) {
  const cells = [{ x: 0, y: 0 }]
  for (let radius = 1; cells.length < limit; radius += 1) {
    for (let x = -radius; x <= radius && cells.length < limit; x += 1) cells.push({ x, y: -radius })
    for (let y = -radius + 1; y <= radius && cells.length < limit; y += 1) cells.push({ x: radius, y })
    for (let x = radius - 1; x >= -radius && cells.length < limit; x -= 1) cells.push({ x, y: radius })
    for (let y = radius - 1; y >= -radius + 1 && cells.length < limit; y -= 1) cells.push({ x: -radius, y })
  }
  return cells
}

function allocateBuildingCounts(metrics, limit) {
  const weighted = CATEGORY_ORDER
    .map(category => ({ category, count: numberOr(metrics.categoryCounts?.[category]) }))
    .filter(item => item.count > 0)
  if (!weighted.length) return [{ category: 'reasoning', count: 1, sourceCount: 0 }]
  const total = weighted.reduce((sum, item) => sum + Math.sqrt(item.count), 0)
  const allocations = weighted.map(item => ({
    category: item.category,
    count: Math.max(1, Math.floor((Math.sqrt(item.count) / total) * limit)),
    sourceCount: item.count,
  }))
  let allocated = allocations.reduce((sum, item) => sum + item.count, 0)
  let cursor = 0
  while (allocated < limit) {
    allocations[cursor % allocations.length].count += 1
    allocated += 1
    cursor += 1
  }
  while (allocated > limit) {
    const candidate = [...allocations].sort((left, right) => right.count - left.count)[0]
    if (candidate.count <= 1) break
    candidate.count -= 1
    allocated -= 1
  }
  return allocations
}

function identityFor(metrics, seed) {
  const dominant = metrics.dominantCategory || 'reasoning'
  const base = {
    file: ['The Builder', 'Code Foundry'],
    shell: ['The Operator', 'Runtime Quarter'],
    test: ['The Verifier', 'Proof District'],
    web: ['The Explorer', 'Horizon Port'],
    agent: ['The Conductor', 'Constellation Hub'],
    vision: ['The Observer', 'Prism Ward'],
    reasoning: ['The Architect', 'Thought Spire'],
    conversation: ['The Director', 'Signal Plaza'],
    other: ['The Polymath', 'Open Quarter'],
  }[dominant] || ['The Polymath', 'Open Quarter']
  const adjectives = ['Luminous', 'Quiet', 'Infinite', 'Electric', 'Resilient', 'Lucid', 'Midnight', 'Kinetic']
  const nouns = ['Arcology', 'Harbor', 'Citadel', 'Metropolis', 'Grid', 'District', 'Skyline', 'Nexus']
  const rand = mulberry32(seed ^ 0xA53C91)
  return {
    archetype: metrics.uniqueCategories >= 6 ? 'The Polymath' : base[0],
    district: base[1],
    cityName: `${adjectives[Math.floor(rand() * adjectives.length)]} ${nouns[Math.floor(rand() * nouns.length)]}`,
    code: seed.toString(36).toUpperCase().padStart(7, '0').slice(-7),
  }
}

function landmarkList(metrics) {
  const landmarks = []
  if (metrics.totalEvents >= 12) landmarks.push({ id: 'signal-spire', label: 'Signal Spire' })
  if (metrics.toolEvents >= 20) landmarks.push({ id: 'tool-exchange', label: 'Tool Exchange' })
  if (numberOr(metrics.categoryCounts?.agent) >= 2) landmarks.push({ id: 'agent-hub', label: 'Agent Hub' })
  if (metrics.recoveries >= 1) landmarks.push({ id: 'phoenix-tower', label: 'Phoenix Tower' })
  if (metrics.uniqueCategories >= 6) landmarks.push({ id: 'polymath-plaza', label: 'Polymath Plaza' })
  if (metrics.completionRate >= 90 && metrics.totalEvents >= 10) landmarks.push({ id: 'green-beacon', label: 'Green Beacon' })
  return landmarks
}

export function generateBuildings(metrics, seedInput = 1, options = {}) {
  if (numberOr(metrics?.totalEvents) <= 0) return []
  const seed = hashString(`${seedInput}|${metrics.totalEvents}|${metrics.complexity}|${metrics.dominantCategory}`)
  const rand = mulberry32(seed)
  const maxBuildings = clamp(Math.round(numberOr(options.maxBuildings, 48)), 8, 72)
  const eventCount = Math.max(1, Math.round(numberOr(metrics.totalEvents)))
  const growthCurve = Math.max(1, Math.round(1 + Math.sqrt(Math.max(0, eventCount - 1)) * 5))
  const desired = Math.min(eventCount, maxBuildings, growthCurve)
  const allocations = allocateBuildingCounts(metrics, desired)
  const categoryPool = allocations.flatMap(item => Array.from({ length: item.count }, () => item))
  for (let index = categoryPool.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rand() * (index + 1))
    ;[categoryPool[index], categoryPool[target]] = [categoryPool[target], categoryPool[index]]
  }
  const cells = spiralCells(categoryPool.length + 1).slice(1)
  const buildings = categoryPool.map((allocation, index) => {
    const cell = cells[index]
    const sourceStrength = Math.log2(allocation.sourceCount + 1)
    const centerBonus = Math.max(0, 4 - Math.max(Math.abs(cell.x), Math.abs(cell.y))) * 8
    const height = Math.round(clamp(34 + sourceStrength * 13 + centerBonus + rand() * 42, 36, 176))
    const footprint = 28 + Math.round(rand() * 12)
    const depth = 18 + Math.round(rand() * 10)
    const statusBias = metrics.outcomeCounts?.failure > 0 && rand() < Math.min(0.3, metrics.outcomeCounts.failure / Math.max(1, metrics.totalEvents))
    return {
      id: `b_${index}_${hashString(`${seed}:${index}:${allocation.category}`).toString(36)}`,
      index,
      category: allocation.category,
      gridX: cell.x,
      gridY: cell.y,
      height,
      footprint,
      depth,
      windows: clamp(Math.round(height / 16), 2, 10),
      status: statusBias ? 'failure' : 'success',
      crown: rand() > 0.72,
      antenna: ['web', 'agent', 'reasoning'].includes(allocation.category) && rand() > 0.52,
      seed: Math.floor(rand() * 1_000_000),
    }
  })
  return buildings.sort((left, right) => (left.gridX + left.gridY) - (right.gridX + right.gridY) || left.index - right.index)
}

export function buildSkyline(input = {}) {
  const events = input.events || normalizeSessionNodes(input.nodes || [], { baseTime: input.baseTime })
  const metrics = input.metrics || summarizeEvents(events)
  const seedSource = firstString(input.seed, input.sessionKey) || events.map(event => event.id).join('|') || 'empty-city'
  const seed = hashString(seedSource)
  const identity = identityFor(metrics, seed)
  const buildings = generateBuildings(metrics, seed, input)
  return Object.freeze({
    schemaVersion: SKYLINE_SCHEMA_VERSION,
    seed,
    events,
    metrics,
    identity,
    buildings,
    landmarks: landmarkList(metrics),
    projectLabel: firstString(input.projectLabel).slice(0, 42) || 'PRIVATE PROJECT',
    rangeLabel: firstString(input.rangeLabel).slice(0, 30) || 'SESSION CITY',
  })
}

export function buildSkylineFromMetrics(metrics, input = {}) {
  return buildSkyline({ ...input, metrics: sanitizeSnapshot({ metrics }).metrics, events: [] })
}

function isoPoint(gridX, gridY, centerX = 820, originY = 296) {
  return {
    x: centerX + (gridX - gridY) * 34,
    y: originY + (gridX + gridY) * 18,
  }
}

function polygon(points, attributes = '') {
  return `<polygon points="${points.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')}" ${attributes}/>`
}

function buildingSvg(building, theme, ordinal, visible, animateReveal) {
  const base = isoPoint(building.gridX, building.gridY)
  const width = building.footprint
  const depth = building.depth
  const height = building.height
  const top = { x: base.x, y: base.y - height }
  const topLeft = { x: top.x - width, y: top.y + width * 0.48 }
  const topRight = { x: top.x + depth, y: top.y + depth * 0.48 }
  const topFar = { x: top.x - width + depth, y: top.y + (width + depth) * 0.48 }
  const bottomLeft = { x: base.x - width, y: base.y + width * 0.48 }
  const bottomRight = { x: base.x + depth, y: base.y + depth * 0.48 }
  const bottomFar = { x: base.x - width + depth, y: base.y + (width + depth) * 0.48 }
  const color = theme.category[building.category] || theme.category.other
  const leftColor = mixHex(color, theme.background, 0.34)
  const rightColor = mixHex(color, theme.background, 0.5)
  const topColor = mixHex(color, '#FFFFFF', theme.id === 'paper' ? 0.08 : 0.22)
  const opacity = visible ? 1 : 0
  const transform = visible ? 'translate(0 0)' : 'translate(0 18px)'
  const revealStyle = animateReveal ? 'animation:sky-rise .42s cubic-bezier(.2,.8,.2,1) both' : ''
  let result = `<g class="sky-building" data-category="${building.category}" data-reveal="${animateReveal ? 'true' : 'false'}" style="opacity:${opacity};transform:${transform};transform-origin:${base.x}px ${base.y}px;${revealStyle}">`
  result += polygon([topLeft, topFar, bottomFar, bottomLeft], `fill="${leftColor}"`)
  result += polygon([topFar, topRight, bottomRight, bottomFar], `fill="${rightColor}"`)
  result += polygon([top, topRight, topFar, topLeft], `fill="${topColor}"`)
  const windowColor = building.status === 'failure' ? theme.danger : theme.success
  const rows = building.windows
  for (let row = 0; row < rows; row += 1) {
    const progress = (row + 1) / (rows + 1)
    const yLeft = topLeft.y + (bottomLeft.y - topLeft.y) * progress
    const xLeft = topLeft.x + 6
    const yRight = topRight.y + (bottomRight.y - topRight.y) * progress
    const xRight = topRight.x - 5
    const lit = hashString(`${building.seed}:${row}`) % 4 !== 0
    result += `<path d="M${xLeft} ${yLeft}l${Math.max(5, width - 12)} ${Math.max(2, width * .07)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="2" opacity="${lit ? .72 : .32}"/>`
    result += `<path d="M${xRight} ${yRight}l${-Math.max(4, depth - 10)} ${Math.max(2, depth * .07)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="2" opacity="${lit ? .58 : .28}"/>`
  }
  if (building.crown) {
    result += polygon([
      { x: top.x - width * .48, y: top.y + width * .25 },
      { x: top.x + depth * .52, y: top.y + depth * .25 },
      { x: top.x - width * .48 + depth, y: top.y + (width + depth) * .25 },
    ], `fill="none" stroke="${mixHex(color, '#FFFFFF', .34)}" stroke-width="2" opacity=".82"`)
  }
  if (building.antenna) {
    result += `<path d="M${top.x - width * .34 + depth * .34} ${top.y + (width + depth) * .17}v-${18 + (building.seed % 18)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`
    result += `<circle cx="${top.x - width * .34 + depth * .34}" cy="${top.y + (width + depth) * .17 - 20 - (building.seed % 18)}" r="2.5" fill="${theme.text}"/>`
  }
  result += '</g>'
  return result
}

function formatCompact(value) {
  return new Intl.NumberFormat('en', { notation: value >= 10_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value)
}

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

function metricBlock(x, y, label, value, theme, width = 126) {
  return `<g transform="translate(${x} ${y})">
    <rect width="${width}" height="78" rx="16" fill="${theme.panel}" fill-opacity=".72" stroke="${theme.grid}"/>
    <text x="16" y="27" fill="${theme.muted}" font-size="11" font-weight="700" letter-spacing="1.4">${escapeXml(label)}</text>
    <text x="16" y="58" fill="${theme.text}" font-size="25" font-weight="760">${escapeXml(value)}</text>
  </g>`
}

function renderGround(theme) {
  const points = [isoPoint(-5, -5), isoPoint(6, -5), isoPoint(6, 6), isoPoint(-5, 6)]
  let svg = polygon(points, `fill="${theme.ground}" stroke="${theme.grid}" stroke-width="1.5"`)
  for (let index = -5; index <= 6; index += 1) {
    const fromA = isoPoint(index, -5)
    const toA = isoPoint(index, 6)
    const fromB = isoPoint(-5, index)
    const toB = isoPoint(6, index)
    svg += `<path d="M${fromA.x} ${fromA.y}L${toA.x} ${toA.y}M${fromB.x} ${fromB.y}L${toB.x} ${toB.y}" stroke="${theme.grid}" stroke-width="1" opacity=".48"/>`
  }
  return svg
}

function renderStars(seed, theme) {
  const rand = mulberry32(seed ^ 0xA1B2C3)
  let stars = ''
  for (let index = 0; index < 42; index += 1) {
    const x = 430 + rand() * 740
    const y = 32 + rand() * 260
    const radius = .5 + rand() * 1.8
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${theme.text}" opacity="${(.15 + rand() * .55).toFixed(2)}"/>`
  }
  return stars
}

function renderLegend(metrics, theme) {
  const used = CATEGORY_ORDER.filter(category => numberOr(metrics.categoryCounts?.[category]) > 0).slice(0, 6)
  return used.map((category, index) => {
    const x = 58 + (index % 3) * 112
    const y = 565 + Math.floor(index / 3) * 28
    const count = numberOr(metrics.categoryCounts?.[category])
    return `<g transform="translate(${x} ${y})">
      <rect width="9" height="9" rx="3" y="-8" fill="${theme.category[category]}"/>
      <text x="16" y="0" fill="${theme.muted}" font-size="11" font-weight="650">${escapeXml(CATEGORY_META[category].short)} ${formatCompact(count)}</text>
    </g>`
  }).join('')
}

/** Render a self-contained, screenshot-ready SVG. */
export function renderSkylineSvg(model, options = {}) {
  const theme = THEMES[options.theme] || THEMES.midnight
  const width = 1200
  const height = 720
  const visibleCount = clamp(Math.round(numberOr(options.visibleCount, model.buildings.length)), 0, model.buildings.length)
  const metrics = model.metrics
  const title = firstString(options.title) || model.identity.cityName
  const projectLabel = firstString(options.projectLabel, model.projectLabel).slice(0, 42) || 'PRIVATE PROJECT'
  const rangeLabel = firstString(options.rangeLabel, model.rangeLabel).slice(0, 30) || 'SESSION CITY'
  const subtitle = firstString(options.subtitle) || `${model.identity.archetype} · ${model.identity.district}`
  const buildingLayer = model.buildings.map((building, index) => buildingSvg(
    building,
    theme,
    index,
    index < visibleCount,
    Boolean(options.animateReveal) && visibleCount > 0 && index === visibleCount - 1,
  )).join('')
  const landmarkText = model.landmarks.slice(0, 3).map(item => item.label).join(' · ') || 'First block established'
  const paper = theme.id === 'paper'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="sky-title sky-desc">
  <title id="sky-title">${escapeXml(title)} — Agent Skyline</title>
  <desc id="sky-desc">A privacy-safe procedural city generated from coarse Agent activity counts.</desc>
  <defs>
    <style>@keyframes sky-rise{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}@media (prefers-reduced-motion:reduce){.sky-building{animation:none!important}}</style>
    <linearGradient id="sky-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.background}"/><stop offset="1" stop-color="${theme.background2}"/></linearGradient>
    <radialGradient id="sky-halo" cx="70%" cy="42%" r="48%"><stop offset="0" stop-color="${theme.glow}" stop-opacity="${paper ? .13 : .24}"/><stop offset="1" stop-color="${theme.glow}" stop-opacity="0"/></radialGradient>
    <filter id="sky-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="${theme.background}" flood-opacity=".48"/></filter>
    <filter id="sky-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="32"/></filter>
    <clipPath id="sky-round"><rect x="0" y="0" width="1200" height="720" rx="30"/></clipPath>
  </defs>
  <g clip-path="url(#sky-round)">
    <rect width="1200" height="720" fill="url(#sky-bg)"/>
    <rect width="1200" height="720" fill="url(#sky-halo)"/>
    ${paper ? '' : renderStars(model.seed, theme)}
    <circle cx="865" cy="258" r="176" fill="${theme.glow}" opacity="${paper ? .06 : .09}" filter="url(#sky-soft)"/>
    <g opacity=".9" filter="url(#sky-shadow)">${renderGround(theme)}</g>
    <g>${buildingLayer}</g>
    <rect x="30" y="30" width="358" height="660" rx="24" fill="${theme.panel}" fill-opacity="${paper ? .82 : .7}" stroke="${theme.grid}"/>
    <g transform="translate(58 58)">
      <g transform="translate(0 0)">
        <rect width="34" height="34" rx="11" fill="${theme.accent}" fill-opacity=".18" stroke="${theme.accent}"/>
        <path d="M8 24V14l6-4 5 3 7-6v17M8 20h18" fill="none" stroke="${theme.accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="48" y="14" fill="${theme.muted}" font-size="10" font-weight="760" letter-spacing="1.8">AGENT SKYLINE</text>
      <text x="48" y="32" fill="${theme.text}" font-size="12" font-weight="650">${escapeXml(rangeLabel)}</text>
    </g>
    <text x="58" y="142" fill="${theme.text}" font-size="38" font-weight="790" letter-spacing="-.8">${escapeXml(title)}</text>
    <text x="58" y="171" fill="${theme.accent}" font-size="14" font-weight="720">${escapeXml(subtitle)}</text>
    <text x="58" y="204" fill="${theme.muted}" font-size="11" font-weight="680" letter-spacing="1.2">${escapeXml(projectLabel.toUpperCase())}</text>
    ${metricBlock(58, 237, 'CITY BLOCKS', formatCompact(metrics.totalEvents), theme)}
    ${metricBlock(197, 237, 'ACTIVE TIME', formatMinutes(metrics.activeMinutes), theme)}
    ${metricBlock(58, 329, 'TOOL MOVES', formatCompact(metrics.toolEvents), theme)}
    ${metricBlock(197, 329, 'RECOVERIES', formatCompact(metrics.recoveries), theme)}
    <g transform="translate(58 437)">
      <text fill="${theme.muted}" font-size="10" font-weight="760" letter-spacing="1.5">CITY IDENTITY</text>
      <text y="28" fill="${theme.text}" font-size="17" font-weight="730">${escapeXml(model.identity.code)}</text>
      <rect x="0" y="45" width="302" height="1" fill="${theme.grid}"/>
      <text y="72" fill="${theme.muted}" font-size="10" font-weight="760" letter-spacing="1.5">UNLOCKED LANDMARKS</text>
      <text y="96" fill="${theme.text}" font-size="11.5" font-weight="620">${escapeXml(landmarkText)}</text>
    </g>
    ${renderLegend(metrics, theme)}
    <g transform="translate(58 626)">
      <rect width="302" height="1" fill="${theme.grid}"/>
      <text y="25" fill="${theme.muted}" font-size="10.5" font-weight="620">No prompts · no paths · no cloud</text>
      <text y="46" fill="${theme.text}" font-size="10.5" font-weight="700">github:LeemanCheung/dsh-agent-skyline</text>
    </g>
    <g transform="translate(1015 656)">
      <text text-anchor="end" fill="${theme.muted}" font-size="10" font-weight="700" letter-spacing="1">BUILT FROM SIGNALS, NOT CONTENT</text>
      <text x="124" text-anchor="end" y="22" fill="${theme.text}" font-size="12" font-weight="720">${visibleCount}/${model.buildings.length} TOWERS ONLINE</text>
    </g>
  </g>
  <rect x=".75" y=".75" width="1198.5" height="718.5" rx="29.25" fill="none" stroke="${theme.grid}" stroke-width="1.5"/>
</svg>`
}

export function buildShareCaption(model, options = {}) {
  const range = firstString(options.rangeLabel, model.rangeLabel) || 'session'
  return [
    `🏙️ ${model.identity.cityName} — my ${range.toLowerCase()} in DeepSeek Harness`,
    `${model.metrics.totalEvents} blocks · ${model.metrics.toolEvents} tool moves · ${model.metrics.recoveries} recoveries`,
    `${model.identity.archetype} · City ${model.identity.code}`,
    'Built locally with Agent Skyline (dsh-agent-skyline) — no prompts or file paths exported.',
  ].join('\n')
}

export function dataUrlForSvg(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(svg))}`
}

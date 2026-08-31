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
    id: 'midnight', name: 'Blueprint',
    background: '#F3F7FB', background2: '#E7EFF6', ground: '#E8EDF1', grid: '#B9C8D3',
    text: '#21384A', muted: '#647989', accent: '#2D6FA4', accent2: '#6A98B8', glow: '#B8D3E7',
    success: '#37785C', danger: '#B65B55', panel: '#FBFDFE', road: '#A9B7C1', roadLine: '#F4F7F8',
    planting: '#6F966F', water: '#86B9D0', shadow: '#7D91A0',
    material: { porcelain: '#F4F3EE', limestone: '#DDD7C9', glass: '#8EB9D0', stone: '#BCC5C8' },
    category: {
      file: '#3F78A8', shell: '#687DA0', test: '#4F8066', web: '#3E8297', agent: '#B4783C',
      vision: '#8B6685', reasoning: '#647584', conversation: '#527E77', other: '#7A858C',
    },
  },
  aurora: {
    id: 'aurora', name: 'Garden',
    background: '#F4F8F2', background2: '#E8F1E7', ground: '#E9EFE5', grid: '#C0CDBA',
    text: '#293B30', muted: '#687A6B', accent: '#3E785B', accent2: '#7A9666', glow: '#C7DDC6',
    success: '#347557', danger: '#B65D55', panel: '#FCFDF9', road: '#ADB8AA', roadLine: '#F5F7F1',
    planting: '#6E9562', water: '#8BBBC1', shadow: '#849286',
    material: { porcelain: '#F5F3EA', limestone: '#DED8C8', glass: '#94BEC5', stone: '#BEC7BD' },
    category: {
      file: '#527FA3', shell: '#727B9A', test: '#4E7F5D', web: '#4D8390', agent: '#A97943',
      vision: '#8D6F84', reasoning: '#687B73', conversation: '#5B8171', other: '#7D887B',
    },
  },
  sunset: {
    id: 'sunset', name: 'Terracotta',
    background: '#FBF3ED', background2: '#F1E3D8', ground: '#EFE5DC', grid: '#D5BFAF',
    text: '#443229', muted: '#7E6B60', accent: '#B65F3E', accent2: '#C98A5E', glow: '#E7C2AD',
    success: '#4C7958', danger: '#A94D45', panel: '#FFFDF9', road: '#BDAFA5', roadLine: '#FAF5F0',
    planting: '#789061', water: '#89B3C0', shadow: '#9B887E',
    material: { porcelain: '#F5F0E7', limestone: '#DFD1BF', glass: '#91B4BF', stone: '#C7BDB5' },
    category: {
      file: '#5C7FA0', shell: '#7E7090', test: '#5F7F5F', web: '#54828D', agent: '#B26A3E',
      vision: '#9B6478', reasoning: '#7D716E', conversation: '#647F71', other: '#887A73',
    },
  },
  paper: {
    id: 'paper', name: 'Paper',
    background: '#F8F6F1', background2: '#EEEAE1', ground: '#ECE8DE', grid: '#CDC6B8',
    text: '#29333B', muted: '#6C716F', accent: '#315F91', accent2: '#718E9D', glow: '#D4E0E7',
    success: '#39765B', danger: '#B25550', panel: '#FFFDF8', road: '#B8B7B0', roadLine: '#F9F7F1',
    planting: '#76936A', water: '#8DB8C7', shadow: '#90989A',
    material: { porcelain: '#F5F2E9', limestone: '#DED6C6', glass: '#91B7C7', stone: '#C3C5C1' },
    category: {
      file: '#416F9B', shell: '#716F91', test: '#4C7A5E', web: '#4B7F8E', agent: '#A87542',
      vision: '#8A687E', reasoning: '#6B747A', conversation: '#587D72', other: '#7B7E7D',
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

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/** Return visible focus targets owned by a modal root. */
export function getFocusableElements(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return []
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    element => typeof element?.getClientRects === 'function' && element.getClientRects().length > 0,
  )
}

/** Resolve the target needed to keep Tab/Shift+Tab inside a modal root. */
export function getFocusTrapTarget(root, activeElement, shiftKey = false) {
  const focusable = getFocusableElements(root)
  if (!focusable.length) return root || null
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (activeElement === root || !root?.contains?.(activeElement)) {
    return shiftKey ? last : first
  }
  if (shiftKey && activeElement === first) return last
  if (!shiftKey && activeElement === last) return first
  return null
}

/** Copy text without leaking a temporary textarea or losing keyboard focus. */
export async function copyTextWithFallback(text, dependencies = {}) {
  const navigatorRef = dependencies.navigatorRef ?? globalThis.navigator
  const documentRef = dependencies.documentRef ?? globalThis.document
  const writeText = navigatorRef?.clipboard?.writeText
  if (typeof writeText === 'function') {
    try {
      await writeText.call(navigatorRef.clipboard, String(text))
      return true
    } catch {
      // Continue to the local legacy fallback.
    }
  }
  if (!documentRef?.body || typeof documentRef.createElement !== 'function') return false
  const previousFocus = documentRef.activeElement
  let area = null
  let restoreFocus = false
  try {
    area = documentRef.createElement('textarea')
    area.value = String(text)
    area.setAttribute('aria-hidden', 'true')
    area.setAttribute('readonly', '')
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    documentRef.body.appendChild(area)
    area.select()
    restoreFocus = documentRef.activeElement === area
    return Boolean(documentRef.execCommand?.('copy'))
  } catch {
    return false
  } finally {
    area?.remove()
    if (restoreFocus && typeof previousFocus?.focus === 'function') {
      try {
        previousFocus.focus({ preventScroll: true })
      } catch {
        previousFocus.focus()
      }
    }
  }
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

const RESERVED_PARK_CELLS = new Set(['-4,-2', '4,2', '-2,4', '3,-3'])

function urbanCells(limit) {
  return spiralCells(Math.max(64, limit * 3))
    .filter(cell => Math.max(Math.abs(cell.x), Math.abs(cell.y)) > 2)
    .filter(cell => cell.x !== 0 && cell.y !== 0)
    .filter(cell => !RESERVED_PARK_CELLS.has(`${cell.x},${cell.y}`))
    .slice(0, limit)
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

const ARCHITECTURE_BIASES = {
  file: { archetypes: ['workshop', 'slab', 'stacked'], roofs: ['garden', 'equipment', 'flat'], materials: ['porcelain', 'limestone', 'glass'] },
  shell: { archetypes: ['monolith', 'slab', 'stacked'], roofs: ['equipment', 'spire', 'flat'], materials: ['stone', 'glass', 'porcelain'] },
  test: { archetypes: ['terraced', 'courtyard', 'stacked'], roofs: ['garden', 'lantern', 'flat'], materials: ['limestone', 'porcelain', 'glass'] },
  web: { archetypes: ['lantern', 'needle', 'stacked'], roofs: ['lantern', 'spire', 'garden'], materials: ['glass', 'porcelain', 'limestone'] },
  agent: { archetypes: ['arcology', 'terraced', 'lantern'], roofs: ['lantern', 'garden', 'spire'], materials: ['porcelain', 'glass', 'stone'] },
  vision: { archetypes: ['gallery', 'lantern', 'terraced'], roofs: ['lantern', 'garden', 'flat'], materials: ['glass', 'limestone', 'porcelain'] },
  reasoning: { archetypes: ['needle', 'monolith', 'terraced'], roofs: ['spire', 'lantern', 'garden'], materials: ['porcelain', 'stone', 'glass'] },
  conversation: { archetypes: ['courtyard', 'gallery', 'terraced'], roofs: ['garden', 'lantern', 'flat'], materials: ['limestone', 'porcelain', 'glass'] },
  other: { archetypes: ['slab', 'terraced', 'workshop'], roofs: ['flat', 'garden', 'equipment'], materials: ['stone', 'limestone', 'porcelain'] },
}

function addressedRandom(seed, index, property) {
  return mulberry32(hashString(`${seed}:${index}:${property}`))()
}

function addressedPick(values, seed, index, property) {
  return values[Math.min(values.length - 1, Math.floor(addressedRandom(seed, index, property) * values.length))]
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
  const cells = urbanCells(categoryPool.length)
  const buildings = categoryPool.map((allocation, index) => {
    const cell = cells[index]
    const bias = ARCHITECTURE_BIASES[allocation.category] || ARCHITECTURE_BIASES.other
    const sourceStrength = Math.log2(allocation.sourceCount + 1)
    const roofType = addressedPick(bias.roofs, seed, index, 'roofType')
    const civicDistance = Math.max(Math.abs(cell.x), Math.abs(cell.y))
    const civicSetback = Math.max(0, 5 - civicDistance) * 7
    const outerLift = Math.max(0, civicDistance - 3) * 5
    const requestedHeight = 42 + sourceStrength * 13 - civicSetback + outerLift + addressedRandom(seed, index, 'height') * 38
    const roofReserve = roofType === 'spire' ? 42 : roofType === 'lantern' ? 22 : roofType === 'equipment' ? 14 : 9
    const baseY = 296 + (cell.x + cell.y) * 18
    const visibleHeight = Math.max(36, baseY - 20 - roofReserve)
    const height = Math.round(clamp(Math.min(requestedHeight, visibleHeight), 36, 176))
    const footprint = 22 + Math.round(addressedRandom(seed, index, 'footprint') * 10)
    const depth = 15 + Math.round(addressedRandom(seed, index, 'depth') * 8)
    const tierCount = clamp(1 + Math.floor(addressedRandom(seed, index, 'tierCount') * (height > 105 ? 3 : 2)), 1, 3)
    const setbacks = Array.from({ length: tierCount - 1 }, (_, tier) =>
      Math.round(3 + addressedRandom(seed, index, `setback:${tier}`) * 5))
    const podiumHeight = Math.round(clamp(8 + addressedRandom(seed, index, 'podiumHeight') * Math.min(18, height * .18), 8, 24))
    const failureChance = Math.min(.3, numberOr(metrics.outcomeCounts?.failure) / Math.max(1, metrics.totalEvents))
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
      status: addressedRandom(seed, index, 'status') < failureChance ? 'failure' : 'success',
      crown: ['lantern', 'garden'].includes(roofType),
      antenna: roofType === 'spire',
      seed: Math.floor(addressedRandom(seed, index, 'seed') * 1_000_000),
      archetype: addressedPick(bias.archetypes, seed, index, 'archetype'),
      tierCount,
      setbacks,
      roofType,
      facadeRhythm: addressedPick(['regular', 'paired', 'vertical', 'ribbon'], seed, index, 'facadeRhythm'),
      bayCount: clamp(2 + Math.floor(addressedRandom(seed, index, 'bayCount') * 5), 2, 6),
      material: addressedPick(bias.materials, seed, index, 'material'),
      podiumHeight,
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

function interpolatePoint(from, to, progress) {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  }
}

function footprintPoints(anchor, width, depth) {
  return [
    anchor,
    { x: anchor.x + depth, y: anchor.y + depth * .48 },
    { x: anchor.x - width + depth, y: anchor.y + (width + depth) * .48 },
    { x: anchor.x - width, y: anchor.y + width * .48 },
  ]
}

function insetAnchor(anchor, widthDifference, depthDifference) {
  return {
    x: anchor.x - widthDifference * .5 + depthDifference * .5,
    y: anchor.y + (widthDifference + depthDifference) * .24,
  }
}

function prismGeometry(anchor, width, depth, height) {
  const top = { x: anchor.x, y: anchor.y - height }
  const [topFront, topRight, topFar, topLeft] = footprintPoints(top, width, depth)
  const [bottomFront, bottomRight, bottomFar, bottomLeft] = footprintPoints(anchor, width, depth)
  return {
    anchor, width, depth, height, top,
    topFront, topRight, topFar, topLeft,
    bottomFront, bottomRight, bottomFar, bottomLeft,
  }
}

function prismSvg(geometry, colors, className, attributes = '') {
  return `<g class="${className}"${attributes ? ` ${attributes}` : ''}>
    ${polygon([geometry.topLeft, geometry.topFar, geometry.bottomFar, geometry.bottomLeft], `fill="${colors.left}" stroke="${colors.edge}" stroke-width=".7"`)}
    ${polygon([geometry.topFar, geometry.topRight, geometry.bottomRight, geometry.bottomFar], `fill="${colors.right}" stroke="${colors.edge}" stroke-width=".7"`)}
    ${polygon([geometry.topFront, geometry.topRight, geometry.topFar, geometry.topLeft], `fill="${colors.top}" stroke="${colors.edge}" stroke-width=".7"`)}
  </g>`
}

const ARCHETYPE_PROFILES = {
  workshop: { width: 1.2, depth: 1.08, setback: .55, tierBias: .9 },
  slab: { width: 1.24, depth: .78, setback: .68, tierBias: 1 },
  stacked: { width: 1, depth: 1, setback: 1, tierBias: 1 },
  monolith: { width: .9, depth: .94, setback: .42, tierBias: 1.08 },
  terraced: { width: 1.12, depth: 1.04, setback: 1.38, tierBias: .86 },
  courtyard: { width: 1.24, depth: 1.12, setback: .8, tierBias: .9 },
  lantern: { width: .84, depth: .86, setback: .72, tierBias: 1.08 },
  needle: { width: .66, depth: .72, setback: .5, tierBias: 1.18 },
  arcology: { width: 1.06, depth: .96, setback: 1.14, tierBias: .98 },
  gallery: { width: 1.18, depth: .88, setback: .72, tierBias: .88 },
}

const MATERIAL_NAMES = ['porcelain', 'limestone', 'glass', 'stone']
const ROOF_TYPES = ['flat', 'garden', 'equipment', 'lantern', 'spire']
const FACADE_RHYTHMS = ['regular', 'paired', 'vertical', 'ribbon']

function materialFaces(theme, material, lightness = 0) {
  const base = theme.material[material] || theme.material.porcelain
  return {
    left: mixHex(base, theme.text, .09 + lightness),
    right: mixHex(base, theme.text, .19 + lightness),
    top: mixHex(base, theme.panel, .52),
    edge: mixHex(base, theme.text, .28),
  }
}

function facadeSvg(geometry, building, theme, category, rhythm, bayCount, tierIndex) {
  const accent = theme.category[category] || theme.category.other
  const windowColor = building.status === 'failure' ? theme.danger : mixHex(theme.material.glass, accent, .32)
  const targetRows = rhythm === 'ribbon'
    ? Math.round(geometry.height / 22)
    : rhythm === 'vertical'
      ? Math.round(geometry.height / 28)
      : Math.round(geometry.height / 16)
  const rows = clamp(Math.min(numberOr(building.windows, 10), targetRows), 1, 7)
  const rowWidth = rhythm === 'ribbon' ? 3 : rhythm === 'paired' ? 1.7 : 1.15
  const dash = rhythm === 'paired' ? ' stroke-dasharray="5 3"' : rhythm === 'ribbon' ? ` stroke-dasharray="${Math.max(3, 9 - bayCount)} 1.5"` : ''
  let svg = `<g class="facade facade-${rhythm}" data-tier="${tierIndex}">`
  for (let row = 0; row < rows; row += 1) {
    const progress = (row + 1) / (rows + 1)
    const leftStart = interpolatePoint(geometry.topLeft, geometry.bottomLeft, progress)
    const leftEnd = interpolatePoint(geometry.topFar, geometry.bottomFar, progress)
    const rightStart = interpolatePoint(geometry.topFar, geometry.bottomFar, progress)
    const rightEnd = interpolatePoint(geometry.topRight, geometry.bottomRight, progress)
    const lit = hashString(`${building.seed}:${tierIndex}:${row}`) % 5 !== 0
    const opacity = lit ? (rhythm === 'ribbon' ? .72 : .58) : .24
    svg += `<path class="facade-row" d="M${leftStart.x.toFixed(1)} ${leftStart.y.toFixed(1)}L${leftEnd.x.toFixed(1)} ${leftEnd.y.toFixed(1)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="${rowWidth}" opacity="${opacity}"${dash}/>`
    svg += `<path class="facade-row" d="M${rightStart.x.toFixed(1)} ${rightStart.y.toFixed(1)}L${rightEnd.x.toFixed(1)} ${rightEnd.y.toFixed(1)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="${rowWidth}" opacity="${Math.max(.18, opacity - .1)}"${dash}/>`
  }
  for (let bay = 1; bay < bayCount; bay += 1) {
    const progress = bay / bayCount
    const leftTop = interpolatePoint(geometry.topLeft, geometry.topFar, progress)
    const leftBottom = interpolatePoint(geometry.bottomLeft, geometry.bottomFar, progress)
    const rightTop = interpolatePoint(geometry.topFar, geometry.topRight, progress)
    const rightBottom = interpolatePoint(geometry.bottomFar, geometry.bottomRight, progress)
    const pairedOpacity = rhythm === 'paired' ? (bay % 2 ? .68 : .28) : rhythm === 'ribbon' ? .22 : .48
    const bayWidth = rhythm === 'vertical' ? 1.45 : .72
    svg += `<path class="facade-bay" d="M${leftTop.x.toFixed(1)} ${(leftTop.y + 2).toFixed(1)}L${leftBottom.x.toFixed(1)} ${(leftBottom.y - 2).toFixed(1)}" stroke="${accent}" stroke-width="${bayWidth}" opacity="${pairedOpacity}"/>`
    svg += `<path class="facade-bay" d="M${rightTop.x.toFixed(1)} ${(rightTop.y + 2).toFixed(1)}L${rightBottom.x.toFixed(1)} ${(rightBottom.y - 2).toFixed(1)}" stroke="${accent}" stroke-width="${bayWidth}" opacity="${Math.max(.18, pairedOpacity - .08)}"/>`
  }
  svg += `<path class="category-spine" d="M${geometry.topRight.x.toFixed(1)} ${geometry.topRight.y.toFixed(1)}L${geometry.bottomRight.x.toFixed(1)} ${geometry.bottomRight.y.toFixed(1)}" stroke="${accent}" stroke-width="1.6" opacity=".74"/>`
  svg += '</g>'
  return svg
}

function footprintCenter(anchor, width, depth) {
  return {
    x: anchor.x + (-width + depth) * .5,
    y: anchor.y + (width + depth) * .24,
  }
}

function roofCenter(geometry) {
  return footprintCenter(geometry.top, geometry.width, geometry.depth)
}

function roofSvg(roofType, geometry, theme, accent, seed) {
  const center = roofCenter(geometry)
  const insetWidth = geometry.width * .26
  const insetDepth = geometry.depth * .26
  const roofWidth = Math.max(6, geometry.width - insetWidth)
  const roofDepth = Math.max(5, geometry.depth - insetDepth)
  const roofAnchor = insetAnchor(geometry.top, insetWidth, insetDepth)
  const roofPlot = footprintPoints(roofAnchor, roofWidth, roofDepth)
  if (roofType === 'garden') {
    const treeOffset = 3 + (seed % 4)
    return `<g class="building-roof roof-garden" data-roof-type="garden">
      ${polygon(roofPlot, `fill="${theme.planting}" fill-opacity=".72" stroke="${mixHex(theme.planting, theme.text, .26)}" stroke-width="1"`)}
      <circle cx="${(center.x - treeOffset).toFixed(1)}" cy="${(center.y - 4).toFixed(1)}" r="3.2" fill="${mixHex(theme.planting, theme.panel, .12)}"/>
      <circle cx="${(center.x + treeOffset).toFixed(1)}" cy="${(center.y + 1).toFixed(1)}" r="2.4" fill="${mixHex(theme.planting, theme.text, .08)}"/>
    </g>`
  }
  if (roofType === 'equipment') {
    const unitWidth = Math.max(5, roofWidth * .34)
    const unitDepth = Math.max(4, roofDepth * .36)
    const unitAnchor = insetAnchor(geometry.top, geometry.width - unitWidth, geometry.depth - unitDepth)
    const unit = prismGeometry(unitAnchor, unitWidth, unitDepth, 7 + (seed % 4))
    const colors = materialFaces(theme, 'stone', .02)
    return `<g class="building-roof roof-equipment" data-roof-type="equipment">
      ${prismSvg(unit, colors, 'roof-equipment-unit')}
      <circle cx="${center.x.toFixed(1)}" cy="${(center.y - 5).toFixed(1)}" r="2.5" fill="none" stroke="${accent}" stroke-width="1.2"/>
    </g>`
  }
  if (roofType === 'lantern') {
    const lanternWidth = Math.max(7, roofWidth * .46)
    const lanternDepth = Math.max(6, roofDepth * .5)
    const lanternAnchor = insetAnchor(geometry.top, geometry.width - lanternWidth, geometry.depth - lanternDepth)
    const lantern = prismGeometry(lanternAnchor, lanternWidth, lanternDepth, 12 + (seed % 7))
    const colors = materialFaces(theme, 'glass', 0)
    return `<g class="building-roof roof-lantern" data-roof-type="lantern">${prismSvg(lantern, colors, 'roof-lantern-house', `stroke="${accent}"`)}</g>`
  }
  if (roofType === 'spire') {
    const spireHeight = 22 + (seed % 18)
    return `<g class="building-roof roof-spire" data-roof-type="spire">
      <path d="M${(center.x - 5).toFixed(1)} ${center.y.toFixed(1)}L${center.x.toFixed(1)} ${(center.y - spireHeight * .62).toFixed(1)}L${(center.x + 5).toFixed(1)} ${center.y.toFixed(1)}Z" fill="${mixHex(accent, theme.panel, .28)}" stroke="${accent}" stroke-width="1"/>
      <path d="M${center.x.toFixed(1)} ${(center.y - spireHeight * .58).toFixed(1)}V${(center.y - spireHeight).toFixed(1)}" stroke="${accent}" stroke-width="1.7" stroke-linecap="round"/>
      <circle cx="${center.x.toFixed(1)}" cy="${(center.y - spireHeight).toFixed(1)}" r="2" fill="${theme.danger}"/>
    </g>`
  }
  return `<g class="building-roof roof-flat" data-roof-type="flat">${polygon(roofPlot, `fill="none" stroke="${accent}" stroke-width="1.2" opacity=".72"`)}</g>`
}

function archetypeDetailSvg(archetype, podium, tiers, theme, accent) {
  const first = tiers[0]
  const last = tiers[tiers.length - 1]
  if (!first || !last) return ''
  if (archetype === 'courtyard') {
    const width = Math.max(7, last.width * .42)
    const depth = Math.max(6, last.depth * .42)
    const anchor = insetAnchor(last.top, last.width - width, last.depth - depth)
    return `<g class="archetype-detail archetype-courtyard">${polygon(footprintPoints(anchor, width, depth), `fill="${theme.ground}" stroke="${theme.planting}" stroke-width="1.3"`)}</g>`
  }
  if (archetype === 'terraced') {
    return `<g class="archetype-detail archetype-terraced">${tiers.map(tier => {
      const width = Math.max(5, tier.width * .3)
      const depth = Math.max(4, tier.depth * .22)
      const anchor = insetAnchor(tier.top, tier.width - width, tier.depth - depth)
      return polygon(footprintPoints(anchor, width, depth), `fill="${theme.planting}" fill-opacity=".54" stroke="${theme.planting}" stroke-width=".7"`)
    }).join('')}</g>`
  }
  if (archetype === 'arcology') {
    return `<g class="archetype-detail archetype-arcology" fill="none" stroke="${accent}" stroke-width="1" opacity=".62">
      <path d="M${first.topFar.x.toFixed(1)} ${first.topFar.y.toFixed(1)}L${first.bottomRight.x.toFixed(1)} ${first.bottomRight.y.toFixed(1)}M${first.topRight.x.toFixed(1)} ${first.topRight.y.toFixed(1)}L${first.bottomFar.x.toFixed(1)} ${first.bottomFar.y.toFixed(1)}"/>
    </g>`
  }
  if (archetype === 'gallery') {
    return `<g class="archetype-detail archetype-gallery">${polygon([podium.topLeft, podium.topFar, first.bottomFar, first.bottomLeft], `fill="${theme.material.glass}" fill-opacity=".48" stroke="${accent}" stroke-width="1"`)}</g>`
  }
  if (archetype === 'workshop') {
    const start = last.topLeft
    const end = last.topFar
    const one = interpolatePoint(start, end, .33)
    const two = interpolatePoint(start, end, .66)
    return `<path class="archetype-detail archetype-workshop" d="M${start.x.toFixed(1)} ${start.y.toFixed(1)}L${one.x.toFixed(1)} ${(one.y - 5).toFixed(1)}L${two.x.toFixed(1)} ${two.y.toFixed(1)}L${end.x.toFixed(1)} ${(end.y - 5).toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1.2"/>`
  }
  if (archetype === 'needle') {
    return `<g class="archetype-detail archetype-needle" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".7"><path d="M${podium.topLeft.x.toFixed(1)} ${podium.topLeft.y.toFixed(1)}L${first.topLeft.x.toFixed(1)} ${first.topLeft.y.toFixed(1)}M${podium.topRight.x.toFixed(1)} ${podium.topRight.y.toFixed(1)}L${first.topRight.x.toFixed(1)} ${first.topRight.y.toFixed(1)}"/></g>`
  }
  if (archetype === 'lantern') {
    return `<path class="archetype-detail archetype-lantern" d="M${last.topFar.x.toFixed(1)} ${last.topFar.y.toFixed(1)}L${last.bottomFar.x.toFixed(1)} ${last.bottomFar.y.toFixed(1)}" stroke="${accent}" stroke-width="2.4" opacity=".76"/>`
  }
  if (archetype === 'monolith') {
    const roof = roofCenter(last)
    const base = footprintCenter(first.anchor, first.width, first.depth)
    const end = interpolatePoint(roof, base, .68)
    return `<path class="archetype-detail archetype-monolith" d="M${roof.x.toFixed(1)} ${roof.y.toFixed(1)}L${end.x.toFixed(1)} ${end.y.toFixed(1)}" stroke="${accent}" stroke-width="1.6" opacity=".62"/>`
  }
  if (archetype === 'slab') {
    return `<path class="archetype-detail archetype-slab" d="M${podium.topLeft.x.toFixed(1)} ${podium.topLeft.y.toFixed(1)}L${podium.topFar.x.toFixed(1)} ${podium.topFar.y.toFixed(1)}" stroke="${accent}" stroke-width="3" opacity=".52"/>`
  }
  return `<g class="archetype-detail archetype-stacked">${tiers.map(tier => polygon(
    [tier.topFront, tier.topRight, tier.topFar, tier.topLeft],
    `fill="none" stroke="${accent}" stroke-width=".6" opacity=".36"`,
  )).join('')}</g>`
}

function buildingSvg(building, theme, ordinal, visible, animateReveal) {
  const base = isoPoint(building.gridX, building.gridY)
  const category = CATEGORY_ORDER.includes(building.category) ? building.category : 'other'
  const archetype = ARCHETYPE_PROFILES[building.archetype] ? building.archetype : 'stacked'
  const profile = ARCHETYPE_PROFILES[archetype]
  const material = MATERIAL_NAMES.includes(building.material) ? building.material : 'porcelain'
  const rhythm = FACADE_RHYTHMS.includes(building.facadeRhythm) ? building.facadeRhythm : 'regular'
  const roofType = ROOF_TYPES.includes(building.roofType)
    ? building.roofType
    : building.antenna
      ? 'spire'
      : building.crown
        ? 'lantern'
        : 'flat'
  const height = clamp(numberOr(building.height, 48), 24, 220)
  const podiumHeight = clamp(numberOr(building.podiumHeight, 9), 6, Math.max(6, height - 14))
  const towerHeight = Math.max(14, height - podiumHeight)
  const tierCount = clamp(Math.round(numberOr(building.tierCount, 1)), 1, 4)
  const bayCount = clamp(Math.round(numberOr(building.bayCount, 3)), 2, 8)
  const sourceWidth = clamp(numberOr(building.footprint, 30), 18, 54)
  const sourceDepth = clamp(numberOr(building.depth, 22), 14, 42)
  const towerWidth = sourceWidth * profile.width
  const towerDepth = sourceDepth * profile.depth
  const podiumWidth = towerWidth + 8
  const podiumDepth = towerDepth + 7
  const accent = theme.category[category] || theme.category.other
  const opacity = visible ? 1 : 0
  const transform = visible ? 'translate(0 0)' : 'translate(0 18px)'
  const shadowAnchor = { x: base.x + 13, y: base.y + 9 }
  let result = `<g class="sky-building" data-category="${category}" data-archetype="${archetype}" data-material="${material}" data-facade-rhythm="${rhythm}" data-bay-count="${bayCount}" data-tier-count="${tierCount}" data-roof-type="${roofType}" data-order="${ordinal}" data-visible="${visible ? 'true' : 'false'}" data-reveal="${animateReveal ? 'true' : 'false'}" style="opacity:${opacity};transform:${transform};transform-origin:${base.x}px ${base.y}px">`
  result += polygon(footprintPoints(shadowAnchor, podiumWidth, podiumDepth), `class="building-shadow" fill="${theme.shadow}" fill-opacity=".2"`)
  const podium = prismGeometry(base, podiumWidth, podiumDepth, podiumHeight)
  result += prismSvg(podium, materialFaces(theme, material, .02), 'building-podium', `data-height="${podiumHeight.toFixed(1)}"`)
  let tierAnchor = insetAnchor(podium.top, podiumWidth - towerWidth, podiumDepth - towerDepth)
  let tierWidth = towerWidth
  let tierDepth = towerDepth
  const weights = Array.from({ length: tierCount }, (_, index) => Math.pow(profile.tierBias, index))
  const totalWeight = weights.reduce((sum, value) => sum + value, 0)
  const tiers = []
  let usedHeight = 0
  for (let tierIndex = 0; tierIndex < tierCount; tierIndex += 1) {
    const tierHeight = tierIndex === tierCount - 1
      ? towerHeight - usedHeight
      : towerHeight * weights[tierIndex] / totalWeight
    const tier = prismGeometry(tierAnchor, tierWidth, tierDepth, tierHeight)
    tiers.push(tier)
    result += prismSvg(tier, materialFaces(theme, material, tierIndex * .012), 'building-tier', `data-tier="${tierIndex}"`)
    result += facadeSvg(tier, building, theme, category, rhythm, bayCount, tierIndex)
    usedHeight += tierHeight
    if (tierIndex < tierCount - 1) {
      const requested = clamp(numberOr(building.setbacks?.[tierIndex], 4), 1, 12) * profile.setback
      const nextWidth = Math.max(12, tierWidth - requested * 2)
      const nextDepth = Math.max(10, tierDepth - requested * 1.45)
      tierAnchor = insetAnchor(tier.top, tierWidth - nextWidth, tierDepth - nextDepth)
      tierWidth = nextWidth
      tierDepth = nextDepth
    }
  }
  result += archetypeDetailSvg(archetype, podium, tiers, theme, accent)
  result += roofSvg(roofType, tiers[tiers.length - 1], theme, accent, numberOr(building.seed))
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
  let svg = `<g class="city-ground">${polygon(points, `fill="${theme.ground}" stroke="${theme.grid}" stroke-width="1.5"`)}`
  for (let index = -5; index <= 6; index += 1) {
    const fromA = isoPoint(index, -5)
    const toA = isoPoint(index, 6)
    const fromB = isoPoint(-5, index)
    const toB = isoPoint(6, index)
    svg += `<path class="plot-grid" d="M${fromA.x} ${fromA.y}L${toA.x} ${toA.y}M${fromB.x} ${fromB.y}L${toB.x} ${toB.y}" stroke="${theme.grid}" stroke-width=".8" opacity=".34"/>`
  }
  const roadAxes = [
    [isoPoint(-5, -.55), isoPoint(6, -.55)],
    [isoPoint(-5, .55), isoPoint(6, .55)],
    [isoPoint(-.55, -5), isoPoint(-.55, 6)],
    [isoPoint(.55, -5), isoPoint(.55, 6)],
  ]
  for (const [from, to] of roadAxes) {
    svg += `<path class="city-road" d="M${from.x} ${from.y}L${to.x} ${to.y}" stroke="${theme.road}" stroke-width="10" stroke-linecap="square"/>`
    svg += `<path class="road-centerline" d="M${from.x} ${from.y}L${to.x} ${to.y}" stroke="${theme.roadLine}" stroke-width="1" stroke-dasharray="7 6" opacity=".82"/>`
  }
  for (const [gridX, gridY] of [[-4, -2], [4, 2], [-2, 4], [3, -3]]) {
    const anchor = isoPoint(gridX, gridY)
    const park = footprintPoints(anchor, 20, 15)
    const center = { x: anchor.x - 2.5, y: anchor.y + 8.4 }
    svg += `<g class="pocket-park">${polygon(park, `fill="${mixHex(theme.planting, theme.panel, .36)}" stroke="${theme.planting}" stroke-width="1"`)}<circle cx="${center.x}" cy="${center.y - 5}" r="4" fill="${theme.planting}"/><path d="M${center.x} ${center.y - 2}v6" stroke="${mixHex(theme.planting, theme.text, .28)}" stroke-width="1.2"/></g>`
  }
  const plaza = isoPoint(0, 0)
  svg += `<g class="civic-plaza">
    <ellipse cx="${plaza.x}" cy="${plaza.y + 8}" rx="46" ry="23" fill="${theme.panel}" stroke="${theme.grid}" stroke-width="2"/>
    <ellipse cx="${plaza.x}" cy="${plaza.y + 8}" rx="29" ry="14" fill="none" stroke="${theme.accent2}" stroke-width="1.4"/>
    <ellipse cx="${plaza.x}" cy="${plaza.y + 8}" rx="11" ry="5.5" fill="${theme.water}" stroke="${theme.accent}" stroke-width="1"/>
    <path d="M${plaza.x} ${plaza.y + 7}v-18" stroke="${theme.accent}" stroke-width="1.5"/><circle cx="${plaza.x}" cy="${plaza.y - 12}" r="2" fill="${theme.accent}"/>
  </g>`
  return `${svg}</g>`
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
  const theme = THEMES[options.theme] || THEMES.paper
  const width = 1200
  const height = 720
  const layout = options.layout === 'scene' ? 'scene' : 'card'
  const scene = layout === 'scene'
  const viewBox = scene ? '350 20 900 540' : `0 0 ${width} ${height}`
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
  const metadataPanel = scene ? '' : `
    <rect x="30" y="30" width="358" height="660" rx="24" fill="${theme.panel}" fill-opacity=".92" stroke="${theme.grid}"/>
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
    </g>`
  const cardFooter = scene ? '' : `
    <g class="card-footer" transform="translate(1015 656)">
      <text text-anchor="end" fill="${theme.muted}" font-size="10" font-weight="700" letter-spacing="1">BUILT FROM SIGNALS, NOT CONTENT</text>
      <text x="124" text-anchor="end" y="22" fill="${theme.text}" font-size="12" font-weight="720">${visibleCount}/${model.buildings.length} TOWERS ONLINE</text>
    </g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" role="img" aria-labelledby="sky-title sky-desc" data-theme="${theme.id}" data-layout="${layout}">
  <title id="sky-title">${escapeXml(title)} — Agent Skyline</title>
  <desc id="sky-desc">A privacy-safe procedural city generated from coarse Agent activity counts.</desc>
  <defs>
    <style>@keyframes sky-rise{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}.sky-building[data-reveal="true"]{animation:sky-rise .42s cubic-bezier(.2,.8,.2,1) both}@media (prefers-reduced-motion:reduce){.sky-building[data-reveal="true"]{animation:none}}</style>
    <pattern id="sky-drafting-grid" width="34" height="18" patternUnits="userSpaceOnUse"><path d="M0 18L34 0M0 0L34 18" fill="none" stroke="${theme.grid}" stroke-width=".55" opacity=".3"/></pattern>
    <clipPath id="sky-round"><rect x="0" y="0" width="1200" height="720" rx="30"/></clipPath>
  </defs>
  <g${scene ? '' : ' clip-path="url(#sky-round)"'}>
    <rect x="${scene ? 350 : 0}" y="${scene ? 20 : 0}" width="${scene ? 900 : 1200}" height="${scene ? 540 : 720}" fill="${theme.background}"/>
    <rect x="${scene ? 350 : 402}" y="${scene ? 20 : 0}" width="${scene ? 900 : 798}" height="${scene ? 540 : 720}" fill="url(#sky-drafting-grid)" opacity=".72"/>
    <g opacity=".98">${renderGround(theme)}</g>
    <g>${buildingLayer}</g>
${metadataPanel}
${cardFooter}
  </g>
${scene ? '' : `<rect class="card-border" x=".75" y=".75" width="1198.5" height="718.5" rx="29.25" fill="none" stroke="${theme.grid}" stroke-width="1.5"/>`}
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

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const target = (...parts) => path.join(root, ...parts)
const read = file => readFile(target(file), 'utf8')
const write = async (file, content) => {
  await mkdir(path.dirname(target(file)), { recursive: true })
  await writeFile(target(file), content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}

const ecosystemSource = String.raw`/**
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
    if (Object.hasOwn(object, alias)) {
      const value = Number(object[alias])
      if (Number.isFinite(value)) return value
    }
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
    const current = Object.values(keyMap).reduce((sum, aliases) => sum + Number(aliases.some(alias => Object.hasOwn(candidate, alias))), 0)
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
  if (parts.length !== 3 || parts[0] !== CITY_SEED_PREFIX || parts[1].length > 16_000) throw new Error('Invalid Agent Skyline city seed')
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
  const season = month <= 2 || month === 12 ? 'winter-aurora' : month <= 5 ? 'spring-bloom' : month <= 8 ? 'summer-meteor' : 'harvest-lights'
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
`

const sidecarSource = String.raw`const core = AgentSkylineV11Core
const VERSION = '1.1.0'
const STYLE_ID = 'agent-skyline-v11-style'
const ENHANCED = 'data-agent-skyline-v11'
const liveSnapshots = { taskDag: null, tokenUsage: null }

if (typeof window === 'undefined' || typeof document === 'undefined') return

function installStyle() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = __SKYLINE_V11_CSS__
  document.head.append(style)
}

function formatNumber(value) {
  const number = Number(value) || 0
  return number >= 1_000_000 ? `${(number / 1_000_000).toFixed(1)}M` : number >= 1_000 ? `${(number / 1_000).toFixed(1)}K` : String(Math.round(number))
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2_000)
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value)
  const input = document.createElement('textarea')
  input.value = value
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.append(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

function toast(panel, message, tone = 'normal') {
  let element = panel.querySelector('.sky-v11-toast')
  if (!element) {
    element = document.createElement('div')
    element.className = 'sky-v11-toast'
    panel.append(element)
  }
  element.dataset.tone = tone
  element.textContent = message
  element.classList.add('is-visible')
  clearTimeout(element.__skyTimer)
  element.__skyTimer = setTimeout(() => element.classList.remove('is-visible'), 2_400)
}

function parseMetric(text, labels) {
  for (const label of labels) {
    const expression = new RegExp(`${label}\\s*[:·]?\\s*([\\d,.]+)`, 'iu')
    const match = text.match(expression)
    if (match) return Number(match[1].replaceAll(',', '')) || 0
  }
  return 0
}

function selectedTheme(panel) {
  const selected = [...panel.querySelectorAll('button,[role="button"],[aria-pressed="true"]')]
    .find(element => /midnight|aurora|sunset|paper/iu.test(element.textContent || '') && (element.getAttribute('aria-pressed') === 'true' || /active|selected|current/iu.test(element.className || '')))
  const value = selected?.textContent?.toLowerCase() || ''
  return ['midnight', 'aurora', 'sunset', 'paper'].find(theme => value.includes(theme)) || 'midnight'
}

function currentSnapshot(panel) {
  const text = panel.textContent || ''
  const cityId = text.match(/(?:city\s*id|城市\s*id)[^a-z0-9]*([a-z0-9-]{4,32})/iu)?.[1] || `local-${core.hashString(text.slice(0, 400)).toString(36)}`
  const title = panel.querySelector('h1,h2,h3,[class*="title"]')?.textContent?.trim().slice(0, 48) || 'Agent Skyline'
  const ecosystem = readEcosystem()
  const totalEvents = parseMetric(text, ['signals?', 'events?', '活动', '信号']) || panel.querySelectorAll('svg [data-building],svg g[class*="building"]').length
  const metrics = {
    totalEvents,
    toolEvents: parseMetric(text, ['tools?', '工具']),
    activeMinutes: parseMetric(text, ['minutes?', 'active', '分钟']),
    recoveries: parseMetric(text, ['recoveries?', 'recovery', '恢复']),
    complexity: parseMetric(text, ['complexity', '复杂度']),
    categoryCounts: {},
    outcomeCounts: {
      success: parseMetric(text, ['success', 'passed', '成功']),
      failure: parseMetric(text, ['failures?', 'failed', '失败']),
      running: parseMetric(text, ['running', '运行中']),
      neutral: 0,
    },
  }
  return { cityId, publicLabel: title, theme: selectedTheme(panel), metrics, ecosystem }
}

function readEcosystem() {
  const discovered = core.readSanitizedEcosystem(window)
  return {
    version: core.SKYLINE_ECOSYSTEM_VERSION,
    taskDag: core.normalizeTaskDagSnapshot(liveSnapshots.taskDag || discovered.taskDag),
    tokenUsage: core.normalizeTokenUsageSnapshot(liveSnapshots.tokenUsage || discovered.tokenUsage),
  }
}

function renderEcosystemChips(container, ecosystem) {
  const chips = []
  if (ecosystem.taskDag.nodes || ecosystem.taskDag.workflows || ecosystem.taskDag.agents) {
    chips.push(`<span class="sky-v11-chip"><b>Task DAG</b>${ecosystem.taskDag.nodes} nodes · ${ecosystem.taskDag.workflows} workflows</span>`)
  }
  if (ecosystem.tokenUsage.totalTokens || ecosystem.tokenUsage.requests) {
    chips.push(`<span class="sky-v11-chip"><b>Token</b>${formatNumber(ecosystem.tokenUsage.totalTokens)} · ${ecosystem.tokenUsage.requests} calls</span>`)
  }
  if (!chips.length) chips.push('<span class="sky-v11-chip is-muted"><b>Local bridge</b>waiting for aggregate snapshots</span>')
  container.innerHTML = chips.join('')
}

function createButton(label, action, className = '') {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `sky-v11-action ${className}`.trim()
  button.textContent = label
  button.addEventListener('click', action)
  return button
}

function serializeSvg(svg) {
  const clone = svg.cloneNode(true)
  if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return new XMLSerializer().serializeToString(clone)
}

function verticalSvg(panel) {
  const source = panel.querySelector('svg')
  if (!source) throw new Error('No city SVG is visible')
  const snapshot = currentSnapshot(panel)
  const ecosystem = snapshot.ecosystem
  const landmarks = core.selectSeasonalLandmarks({ cityId: snapshot.cityId, metrics: snapshot.metrics, ecosystem })
  const sourceMarkup = serializeSvg(source)
  const data = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(sourceMarkup)))}`
  const title = core.escapeXml(snapshot.publicLabel || 'Agent Skyline')
  const cityId = core.escapeXml(snapshot.cityId)
  const task = ecosystem.taskDag
  const usage = ecosystem.tokenUsage
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <defs>
      <linearGradient id="skyBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#060912"/><stop offset=".52" stop-color="#101a32"/><stop offset="1" stop-color="#11101f"/></linearGradient>
      <radialGradient id="skyGlow"><stop stop-color="#7899ff" stop-opacity=".34"/><stop offset="1" stop-color="#7899ff" stop-opacity="0"/></radialGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="32" stdDeviation="30" flood-opacity=".42"/></filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#skyBg)"/>
    <circle cx="212" cy="130" r="420" fill="url(#skyGlow)"/>
    <text x="74" y="105" fill="#89a5ff" font-family="Inter,Segoe UI,sans-serif" font-size="22" font-weight="800" letter-spacing="4">DEEPSEEK HARNESS · AGENT SKYLINE V1.1</text>
    <text x="74" y="188" fill="#f7f9ff" font-family="Inter,Segoe UI,sans-serif" font-size="64" font-weight="850">${title}</text>
    <text x="74" y="238" fill="#9daac3" font-family="Inter,Segoe UI,sans-serif" font-size="25">CITY ${cityId} · LOCAL-FIRST · ZERO EXTRA TOKENS</text>
    <g transform="translate(74 282)">
      <rect width="932" height="82" rx="24" fill="#111a2c" stroke="#7694ff" stroke-opacity=".24"/>
      <text x="26" y="34" fill="#8ca5ff" font-family="Inter,Segoe UI,sans-serif" font-size="18" font-weight="800">LOCAL ECOSYSTEM</text>
      <text x="26" y="62" fill="#dfe6f8" font-family="Inter,Segoe UI,sans-serif" font-size="22">${task.nodes} DAG nodes · ${task.workflows} workflows · ${formatNumber(usage.totalTokens)} tokens · ${usage.requests} calls</text>
    </g>
    <g filter="url(#shadow)"><rect x="54" y="414" width="972" height="1040" rx="42" fill="#070b14" stroke="#90a5ef" stroke-opacity=".24"/><image href="${data}" x="78" y="438" width="924" height="992" preserveAspectRatio="xMidYMid meet"/></g>
    <text x="74" y="1536" fill="#8ca5ff" font-family="Inter,Segoe UI,sans-serif" font-size="18" font-weight="800" letter-spacing="2">SEASONAL LANDMARKS</text>
    <text x="74" y="1580" fill="#f3f6ff" font-family="Inter,Segoe UI,sans-serif" font-size="30">${landmarks.map(core.escapeXml).join(' · ')}</text>
    <rect x="74" y="1642" width="932" height="160" rx="34" fill="#0d1425" stroke="#7899ff" stroke-opacity=".22"/>
    <text x="104" y="1695" fill="#94a6c7" font-family="Inter,Segoe UI,sans-serif" font-size="22">Private prompts, commands, replies and paths are never exported.</text>
    <text x="104" y="1742" fill="#f5f7ff" font-family="Inter,Segoe UI,sans-serif" font-size="28" font-weight="750">Share the city. Keep the work private.</text>
    <text x="74" y="1860" fill="#71809e" font-family="Inter,Segoe UI,sans-serif" font-size="20">github.com/LeemanCheung/dsh-agent-skyline</text>
  </svg>`
}

async function exportVertical(panel) {
  try {
    const markup = verticalSvg(panel)
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1080
        canvas.height = 1920
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, 1080, 1920)
        canvas.toBlob(png => {
          if (png) downloadBlob(png, 'agent-skyline-vertical.png')
          else downloadBlob(blob, 'agent-skyline-vertical.svg')
          URL.revokeObjectURL(url)
        }, 'image/png')
      } catch {
        downloadBlob(blob, 'agent-skyline-vertical.svg')
        URL.revokeObjectURL(url)
      }
    }
    image.onerror = () => {
      downloadBlob(blob, 'agent-skyline-vertical.svg')
      URL.revokeObjectURL(url)
    }
    image.src = url
    toast(panel, '9:16 share card exported')
  } catch (error) {
    toast(panel, error.message || 'Unable to export share card', 'error')
  }
}

async function exportSeed(panel) {
  try {
    const seed = core.createCitySeed(currentSnapshot(panel))
    await copyText(seed)
    toast(panel, `City seed copied · ${seed.length} chars`)
  } catch (error) {
    toast(panel, error.message || 'Unable to export city seed', 'error')
  }
}

function importedPreview(panel, snapshot) {
  panel.querySelector('.sky-v11-seed-preview')?.remove()
  const element = document.createElement('section')
  element.className = 'sky-v11-seed-preview'
  const landmarks = core.selectSeasonalLandmarks({ cityId: snapshot.cityId, metrics: snapshot.metrics, ecosystem: snapshot.ecosystem })
  element.innerHTML = `<div><span>IMPORTED CITY SEED</span><strong>${core.escapeXml(snapshot.cityId || 'anonymous-city')}</strong><small>${snapshot.metrics.totalEvents} signals · ${snapshot.metrics.recoveries} recoveries · ${landmarks.map(core.escapeXml).join(' / ')}</small></div><button type="button" aria-label="Close imported seed preview">×</button>`
  element.querySelector('button').addEventListener('click', () => element.remove())
  panel.querySelector('.sky-v11')?.after(element)
}

function importSeed(panel) {
  const value = window.prompt('Paste a privacy-safe Agent Skyline city seed')
  if (!value) return
  try {
    const snapshot = core.parseCitySeed(value)
    try { localStorage.setItem('dsh-agent-skyline:imported-seed:v1', value.trim()) } catch {}
    importedPreview(panel, snapshot)
    window.dispatchEvent(new CustomEvent('dsh-agent-skyline:seed-imported', { detail: snapshot }))
    toast(panel, 'City seed verified and imported')
  } catch (error) {
    toast(panel, error.message || 'Invalid city seed', 'error')
  }
}

function exportBadge(panel) {
  const snapshot = currentSnapshot(panel)
  const svg = core.renderReadmeBadge({
    cityName: snapshot.publicLabel,
    cityId: snapshot.cityId,
    theme: snapshot.theme,
    metrics: snapshot.metrics,
    ecosystem: snapshot.ecosystem,
  })
  downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), 'agent-skyline-readme-badge.svg')
  toast(panel, 'README badge exported')
}

function refreshSection(section, panel) {
  const ecosystem = readEcosystem()
  renderEcosystemChips(section.querySelector('.sky-v11-chips'), ecosystem)
  const landmarks = core.selectSeasonalLandmarks({ ...currentSnapshot(panel), ecosystem })
  section.querySelector('.sky-v11-landmark').textContent = landmarks.join(' · ')
}

function enhance(panel) {
  if (!panel || panel.getAttribute(ENHANCED) === VERSION) return
  panel.setAttribute(ENHANCED, VERSION)
  const section = document.createElement('section')
  section.className = 'sky-v11'
  section.innerHTML = `<div class="sky-v11-heading"><div><span>V1.1 · LOCAL ECOSYSTEM</span><strong>Share wider. Reveal less.</strong></div><div class="sky-v11-landmark" aria-label="Seasonal landmarks"></div></div><div class="sky-v11-chips"></div><div class="sky-v11-actions"></div>`
  const actions = section.querySelector('.sky-v11-actions')
  actions.append(
    createButton('9:16 PNG', () => exportVertical(panel), 'is-primary'),
    createButton('Copy city seed', () => exportSeed(panel)),
    createButton('Import seed', () => importSeed(panel)),
    createButton('README badge', () => exportBadge(panel)),
  )
  const header = panel.querySelector('header,[class*="header"],[class*="toolbar"]')
  if (header?.parentNode) header.insertAdjacentElement('afterend', section)
  else panel.prepend(section)
  refreshSection(section, panel)
}

function looksLikeSkyline(element) {
  if (!element) return false
  const text = (element.textContent || '').slice(0, 2_000)
  const classes = String(element.className || '')
  return /agent\s*skyline|agent\s*天际线/iu.test(text) || /(?:^|[-_])skyline(?:[-_]|$)/iu.test(classes)
}

function scan() {
  installStyle()
  const candidates = [
    ...document.querySelectorAll('[role="dialog"],[class*="skyline"],[data-testid*="skyline"]'),
  ]
  if (/agent\s*skyline/iu.test(document.title) || looksLikeSkyline(document.body)) candidates.push(document.body)
  for (const candidate of candidates) if (looksLikeSkyline(candidate)) enhance(candidate)
}

let queued = false
function scheduleScan() {
  if (queued) return
  queued = true
  requestAnimationFrame(() => {
    queued = false
    scan()
  })
}

window.addEventListener('dsh-task-dag:snapshot', event => {
  liveSnapshots.taskDag = core.normalizeTaskDagSnapshot(event.detail)
  scheduleScan()
})
window.addEventListener('dsh-token-usage:snapshot', event => {
  liveSnapshots.tokenUsage = core.normalizeTokenUsageSnapshot(event.detail)
  scheduleScan()
})

Object.defineProperty(window, 'AgentSkylineV11', {
  configurable: true,
  value: Object.freeze({
    version: VERSION,
    privacy: 'aggregate-only',
    createCitySeed: core.createCitySeed,
    parseCitySeed: core.parseCitySeed,
    readEcosystem,
    refresh: scan,
  }),
})

new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true })
window.addEventListener('storage', scheduleScan)
window.addEventListener('load', scheduleScan, { once: true })
scheduleScan()
`

const styleSource = String.raw`.sky-v11{position:relative;display:grid;gap:12px;margin:10px 18px 14px;padding:15px 16px;border:1px solid color-mix(in srgb,var(--sky-accent,#7c9dff) 25%,transparent);border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--sky-accent,#7c9dff) 8%,transparent),rgba(8,12,22,.72));box-shadow:0 18px 42px rgba(0,0,0,.16);isolation:isolate}.sky-v11:before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 8% 0%,rgba(124,157,255,.14),transparent 38%);pointer-events:none;z-index:-1}.sky-v11-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.sky-v11-heading>div:first-child{display:grid;gap:3px}.sky-v11-heading span{font-size:10px;font-weight:850;letter-spacing:.14em;color:#8da7ff}.sky-v11-heading strong{font-size:15px;letter-spacing:-.015em;color:inherit}.sky-v11-landmark{max-width:46%;font-size:10px;line-height:1.45;text-align:right;color:color-mix(in srgb,currentColor 56%,transparent);text-transform:uppercase;letter-spacing:.06em}.sky-v11-chips{display:flex;flex-wrap:wrap;gap:7px}.sky-v11-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid rgba(137,165,255,.18);border-radius:999px;background:rgba(124,157,255,.07);font-size:11px;color:color-mix(in srgb,currentColor 72%,transparent)}.sky-v11-chip b{color:#9bb0ff;font-size:9px;letter-spacing:.08em;text-transform:uppercase}.sky-v11-chip.is-muted{opacity:.62}.sky-v11-actions{display:flex;flex-wrap:wrap;gap:8px}.sky-v11-action{appearance:none;border:1px solid rgba(145,164,212,.22);border-radius:11px;padding:8px 11px;background:rgba(255,255,255,.045);color:inherit;font:inherit;font-size:11px;font-weight:720;cursor:pointer;transition:transform .16s ease,border-color .16s ease,background .16s ease}.sky-v11-action:hover{transform:translateY(-1px);border-color:rgba(141,167,255,.55);background:rgba(124,157,255,.11)}.sky-v11-action:focus-visible{outline:2px solid #8da7ff;outline-offset:2px}.sky-v11-action.is-primary{border-color:rgba(124,157,255,.5);background:linear-gradient(135deg,rgba(82,112,220,.92),rgba(113,82,203,.92));color:#fff;box-shadow:0 8px 20px rgba(74,92,184,.22)}.sky-v11-toast{position:absolute;right:16px;bottom:-7px;z-index:20;max-width:min(360px,80%);padding:9px 12px;border:1px solid rgba(133,158,235,.3);border-radius:11px;background:#111827;color:#f4f7ff;font-size:11px;box-shadow:0 16px 48px rgba(0,0,0,.38);opacity:0;transform:translateY(8px);pointer-events:none;transition:.2s ease}.sky-v11-toast.is-visible{opacity:1;transform:translateY(0)}.sky-v11-toast[data-tone="error"]{border-color:rgba(255,111,145,.48);color:#ffd6df}.sky-v11-seed-preview{display:flex;align-items:center;justify-content:space-between;gap:18px;margin:0 18px 14px;padding:14px 16px;border:1px solid rgba(101,230,180,.24);border-radius:16px;background:rgba(101,230,180,.07)}.sky-v11-seed-preview>div{display:grid;gap:3px}.sky-v11-seed-preview span{font-size:9px;font-weight:850;letter-spacing:.13em;color:#65e6b4}.sky-v11-seed-preview strong{font-size:14px}.sky-v11-seed-preview small{font-size:11px;opacity:.62}.sky-v11-seed-preview button{border:0;background:transparent;color:inherit;font-size:20px;cursor:pointer;opacity:.6}@media(max-width:680px){.sky-v11{margin:8px 10px 12px;padding:13px}.sky-v11-heading{display:grid}.sky-v11-landmark{max-width:none;text-align:left}.sky-v11-actions{display:grid;grid-template-columns:1fr 1fr}.sky-v11-action{width:100%}.sky-v11-seed-preview{margin-inline:10px}}@media(prefers-reduced-motion:reduce){.sky-v11-action,.sky-v11-toast{transition:none}.sky-v11-action:hover{transform:none}}`

const injectorSource = String.raw`import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const start = '/*__AGENT_SKYLINE_V11_START__*/'
const end = '/*__AGENT_SKYLINE_V11_END__*/'
const ecosystem = (await readFile(path.join(root, 'src/ecosystem.js'), 'utf8')).replace(/\bexport\s+/gu, '')
const sidecar = await readFile(path.join(root, 'src/v11-sidecar.js'), 'utf8')
const css = await readFile(path.join(root, 'src/v11.css'), 'utf8')
const api = `const AgentSkylineV11Core = Object.freeze({ SKYLINE_ECOSYSTEM_VERSION, CITY_SEED_PREFIX, ECOSYSTEM_EVENT, SHARE_PRESETS, escapeXml, hashString, stableStringify, normalizeTaskDagSnapshot, normalizeTokenUsageSnapshot, readSanitizedEcosystem, sanitizeSeedSnapshot, createCitySeed, parseCitySeed, createSharePreset, selectSeasonalLandmarks, mergeEcosystemMetrics, renderReadmeBadge })`
const block = `${start}\n;(() => {\n${ecosystem}\n${api}\n${sidecar.replace('__SKYLINE_V11_CSS__', JSON.stringify(css))}\n})()\n${end}`
const blockPattern = new RegExp(`${start.replaceAll('*', '\\*')}[\\s\\S]*?${end.replaceAll('*', '\\*')}`, 'gu')
const targets = process.argv.includes('--demo') ? ['demo/app.js'] : ['lib/client.js']
for (const relative of targets) {
  const file = path.join(root, relative)
  const current = await readFile(file, 'utf8')
  const stripped = current.replace(blockPattern, '').trimEnd()
  await writeFile(file, `${stripped}\n\n${block}\n`, 'utf8')
  console.log(`v1.1 sidecar injected: ${relative}`)
}
`

const testSource = String.raw`import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createCitySeed, parseCitySeed, normalizeTaskDagSnapshot, normalizeTokenUsageSnapshot,
  readSanitizedEcosystem, selectSeasonalLandmarks, renderReadmeBadge, createSharePreset,
} from '../src/ecosystem.js'

test('city seeds round-trip sanitized aggregates and reject tampering', () => {
  const secret = 'TOP-SECRET-PROMPT'
  const seed = createCitySeed({
    cityId: 'CITY-ALPHA', theme: 'aurora', publicLabel: 'Public demo', secret,
    metrics: { totalEvents: 42, recoveries: 2, categoryCounts: { file: 9 }, prompt: secret },
    ecosystem: { taskDag: { nodes: 7, title: secret }, tokenUsage: { totalTokens: 123456, command: secret } },
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
  const task = normalizeTaskDagSnapshot({ nested: { nodeCount: 8, workflowRuns: 3, messages: 'private' } })
  const usage = normalizeTokenUsageSnapshot({ summary: { input_tokens: 100, output_tokens: 40, requestCount: 2, apiKey: 'secret' } })
  assert.deepEqual(task, { nodes: 8, edges: 0, channels: 0, workflows: 3, agents: 0, tasks: 0, completed: 0, failed: 0 })
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
  const scope = { localStorage: { length: storage.size, key: index => [...storage.keys()][index], getItem: key => storage.get(key) } }
  const result = readSanitizedEcosystem(scope)
  assert.equal(result.taskDag.nodes, 4)
  assert.equal(result.taskDag.edges, 5)
  assert.equal(result.tokenUsage.totalTokens, 9876)
  assert.equal(result.tokenUsage.requests, 3)
})

test('share presets, landmarks, and README badge are deterministic and escaped', () => {
  assert.deepEqual(createSharePreset('vertical'), { id: 'vertical', width: 1080, height: 1920, label: 'Vertical 9:16' })
  const options = { date: new Date('2026-07-10T00:00:00Z'), cityId: 'fixed', metrics: { recoveries: 1 }, ecosystem: { taskDag: { workflows: 2 }, tokenUsage: { totalTokens: 120000 } } }
  assert.deepEqual(selectSeasonalLandmarks(options), selectSeasonalLandmarks(options))
  const badge = renderReadmeBadge({ cityName: '<unsafe>', cityId: 'ID&1', metrics: { totalEvents: 8 } })
  assert.match(badge, /&lt;unsafe&gt;/)
  assert.doesNotMatch(badge, /<unsafe>/)
  assert.match(badge, /AGENT SKYLINE · V1\.1/)
})
`

const smokeSource = String.raw`import { readFile } from 'node:fs/promises'

const files = await Promise.all(['lib/client.js', 'demo/app.js'].map(file => readFile(file, 'utf8')))
for (const [index, source] of files.entries()) {
  const label = index ? 'demo/app.js' : 'lib/client.js'
  if (!source.includes('/*__AGENT_SKYLINE_V11_START__*/')) throw new Error(`${label}: v1.1 marker missing`)
  if (!source.includes('9:16 PNG')) throw new Error(`${label}: vertical share control missing`)
  if (!source.includes('Copy city seed')) throw new Error(`${label}: seed control missing`)
  if (!source.includes('README badge')) throw new Error(`${label}: badge control missing`)
  if (!source.includes('dsh-task-dag:snapshot') || !source.includes('dsh-token-usage:snapshot')) throw new Error(`${label}: ecosystem adapters missing`)
  if ((source.match(/__AGENT_SKYLINE_V11_START__/gu) || []).length !== 1) throw new Error(`${label}: v1.1 injection is not idempotent`)
}
console.log('v1.1 smoke: vertical cards, city seeds, badges, seasonal landmarks, and local ecosystem bridge OK')
`

const protocolDoc = String.raw`# Agent Skyline Local Ecosystem Protocol v1

Agent Skyline v1.1 can enrich a city with **aggregate-only**, local browser snapshots from `dsh-task-dag` and `dsh-token-usage`. The bridge is optional, dependency-free, and never sends data over the network.

## Privacy boundary

Accepted values are bounded numbers such as node count, workflow count, request count, and token totals. Task names, messages, prompts, commands, paths, model replies, credentials, repository names, and user identifiers are discarded.

## Producers

A compatible plugin may dispatch either event:

```js
window.dispatchEvent(new CustomEvent('dsh-task-dag:snapshot', {
  detail: { nodes: 12, edges: 18, workflows: 3, agents: 5, completed: 9, failed: 1 },
}))

window.dispatchEvent(new CustomEvent('dsh-token-usage:snapshot', {
  detail: { inputTokens: 120000, outputTokens: 28000, cachedTokens: 45000, requests: 38 },
}))
```

Agent Skyline also performs a read-only lookup of explicitly named globals and `localStorage` keys prefixed with `dsh-task-dag` or `dsh-token-usage`. Unrelated keys are ignored.

## Consumer API

When the browser client loads, it exposes:

```js
window.AgentSkylineV11.readEcosystem()
window.AgentSkylineV11.createCitySeed(snapshot)
window.AgentSkylineV11.parseCitySeed(seed)
window.AgentSkylineV11.refresh()
```

The returned object contains sanitized aggregate fields only. City seeds are checksum-protected and use the same privacy reducer before encoding.
`

const releaseNotes = String.raw`# v1.1.0 — Local ecosystem, portable cities, vertical sharing

Agent Skyline v1.1 turns the city into a portable, privacy-safe creative asset while keeping every integration local.

## New

- 9:16 PNG/SVG share cards designed for Xiaohongshu, Douyin, and mobile feeds
- Checksum-protected anonymous city seed export/import
- README and GitHub Profile SVG badge export
- Seasonal landmarks plus deterministic rare landmarks
- Aggregate-only local bridge for `dsh-task-dag` and `dsh-token-usage`
- Read-only browser API at `window.AgentSkylineV11`
- Desktop and mobile v1.1 preview assets

## Privacy

The ecosystem bridge accepts bounded numeric aggregates only. Prompts, replies, commands, tool arguments, paths, task text, messages, credentials, repository names, and user identifiers are never copied into the city, seed, badge, or share card.

## Install

```bash
dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.1.0"
```
`

const previewSvg = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070a12"/><stop offset="1" stop-color="#17203a"/></linearGradient><radialGradient id="g"><stop stop-color="#7c9dff" stop-opacity=".34"/><stop offset="1" stop-color="#7c9dff" stop-opacity="0"/></radialGradient></defs>
<rect width="1280" height="720" fill="url(#bg)"/><circle cx="180" cy="70" r="440" fill="url(#g)"/>
<text x="72" y="78" fill="#8da7ff" font-family="Inter,Segoe UI,sans-serif" font-size="17" font-weight="800" letter-spacing="3">AGENT SKYLINE · V1.1</text>
<text x="72" y="146" fill="#f5f7ff" font-family="Inter,Segoe UI,sans-serif" font-size="56" font-weight="850">Local ecosystem.</text><text x="72" y="206" fill="#f5f7ff" font-family="Inter,Segoe UI,sans-serif" font-size="56" font-weight="850">Portable cities.</text>
<text x="72" y="250" fill="#9daac4" font-family="Inter,Segoe UI,sans-serif" font-size="20">9:16 cards · city seeds · README badges · seasonal landmarks</text>
<g transform="translate(72 310)"><rect width="470" height="286" rx="30" fill="#0c1220" stroke="#7c9dff" stroke-opacity=".28"/><text x="26" y="42" fill="#8da7ff" font-family="Inter,Segoe UI,sans-serif" font-size="13" font-weight="800">LOCAL ECOSYSTEM</text><g fill="#15213a" stroke="#7c9dff" stroke-opacity=".18"><rect x="26" y="66" width="202" height="48" rx="24"/><rect x="240" y="66" width="202" height="48" rx="24"/></g><text x="45" y="96" fill="#dce4ff" font-family="Inter,Segoe UI,sans-serif" font-size="14">Task DAG · 18 nodes</text><text x="260" y="96" fill="#dce4ff" font-family="Inter,Segoe UI,sans-serif" font-size="14">Token · 186K</text><path d="M42 238V174l54-34 52 28 68-88 74 80 56-35 72 49v64H42Z" fill="#7c9dff" opacity=".12"/><path d="M42 238h376M96 214v-74m52 74v-46m68 46V80m74 134v-54m56 54v-89" fill="none" stroke="#7c9dff" stroke-width="11" stroke-linecap="round"/></g>
<g transform="translate(602 58)"><rect width="590" height="604" rx="34" fill="#0a0f1b" stroke="#91a7ef" stroke-opacity=".25"/><rect x="24" y="24" width="542" height="110" rx="22" fill="#111a2c"/><text x="49" y="59" fill="#8da7ff" font-family="Inter,Segoe UI,sans-serif" font-size="12" font-weight="800" letter-spacing="2">V1.1 · LOCAL ECOSYSTEM</text><text x="49" y="91" fill="#f5f7ff" font-family="Inter,Segoe UI,sans-serif" font-size="21" font-weight="750">Share wider. Reveal less.</text><g transform="translate(49 105)" fill="#19243c"><rect width="140" height="22" rx="11"/><rect x="150" width="142" height="22" rx="11"/></g><g transform="translate(24 154)"><rect width="542" height="330" rx="24" fill="#080c16"/><path d="M48 280V205l65-35 58 26 76-112 82 105 66-42 92 58v75H48Z" fill="#7c9dff" opacity=".14"/><g fill="#7c9dff"><rect x="86" y="166" width="42" height="114" rx="7"/><rect x="155" y="196" width="52" height="84" rx="7"/><rect x="237" y="84" width="58" height="196" rx="8"/><rect x="329" y="181" width="48" height="99" rx="7"/><rect x="413" y="147" width="52" height="133" rx="7"/></g></g><g transform="translate(24 505)" fill="#141e34" stroke="#8da7ff" stroke-opacity=".28"><rect width="124" height="46" rx="13"/><rect x="136" width="124" height="46" rx="13"/><rect x="272" width="124" height="46" rx="13"/><rect x="408" width="134" height="46" rx="13"/></g><g fill="#dce4ff" font-family="Inter,Segoe UI,sans-serif" font-size="12" text-anchor="middle"><text x="86" y="534">9:16 PNG</text><text x="222" y="534">CITY SEED</text><text x="358" y="534">IMPORT</text><text x="499" y="534">README BADGE</text></g></g>
<text x="72" y="670" fill="#71809e" font-family="Inter,Segoe UI,sans-serif" font-size="16">Private by construction · no server · no telemetry · zero extra model calls</text>
</svg>`

await write('src/ecosystem.js', ecosystemSource)
await write('src/v11-sidecar.js', sidecarSource)
await write('src/v11.css', styleSource)
await write('scripts/inject-v11.mjs', injectorSource)
await write('scripts/ecosystem.test.mjs', testSource)
await write('scripts/v11-smoke.mjs', smokeSource)
await write('docs/ecosystem-protocol.md', protocolDoc)
await write('docs/release-notes-v1.1.0.md', releaseNotes)
await write('docs/v11-preview.svg', previewSvg)

const packageFile = JSON.parse(await read('package.json'))
packageFile.version = '1.1.0'
packageFile.exports ||= {}
packageFile.exports['./ecosystem'] = './src/ecosystem.js'
packageFile.scripts.build = 'node scripts/build.mjs && node scripts/inject-v11.mjs'
packageFile.scripts.demo = 'node scripts/render-demo.mjs && node scripts/inject-v11.mjs --demo'
packageFile.scripts.check = 'node --check src/client.js && node --check src/core.js && node --check src/ecosystem.js && node --check src/v11-sidecar.js && node --check scripts/inject-v11.mjs && node --check demo/app.js && npm test && npm run build && node --check lib/client.js && node --check demo/core.js && node scripts/smoke.mjs && npm run demo && node --check demo/app.js && node scripts/v11-smoke.mjs'
packageFile.keywords = [...new Set([...(packageFile.keywords || []), 'city-seed', 'vertical-share-card', 'ecosystem-bridge', 'readme-badge'])]
await write('package.json', JSON.stringify(packageFile, null, 2))

if (existsSync(target('package-lock.json'))) {
  const lock = JSON.parse(await read('package-lock.json'))
  lock.version = '1.1.0'
  if (lock.packages?.['']) lock.packages[''].version = '1.1.0'
  await write('package-lock.json', JSON.stringify(lock, null, 2))
}

const englishSection = String.raw`## v1.1 local ecosystem

Agent Skyline now adds a polished, non-invasive enhancement strip to both the DSH panel and the standalone demo:

- **9:16 PNG / SVG cards** for mobile-first sharing;
- **checksum-protected city seeds** that contain sanitized aggregates only;
- **README badge export** for repositories and GitHub Profiles;
- **seasonal and deterministic rare landmarks**;
- an optional, aggregate-only local bridge for [`dsh-task-dag`](https://github.com/LeemanCheung/dsh-task-dag) and [`dsh-token-usage`](https://github.com/LeemanCheung/dsh-token-usage).

The bridge is read-only. It accepts bounded counts and token totals, never task text, messages, prompts, commands, paths, credentials, or model replies. See [`docs/ecosystem-protocol.md`](docs/ecosystem-protocol.md).

![Agent Skyline v1.1 local ecosystem](docs/v11-preview.png)
`
const chineseSection = String.raw`## v1.1 本地生态联动

Agent Skyline 现在会在 DSH 面板与独立 Demo 中增加一条克制、非侵入式的增强工具栏：

- 面向小红书、抖音等移动内容平台的 **9:16 PNG / SVG 分享卡**；
- 只包含脱敏聚合指标、带校验码的 **匿名城市种子**；
- 面向仓库 README 与 GitHub Profile 的 **SVG 城市徽章**；
- 随季节变化且可确定复现的稀有地标；
- 与 [`dsh-task-dag`](https://github.com/LeemanCheung/dsh-task-dag)、[`dsh-token-usage`](https://github.com/LeemanCheung/dsh-token-usage) 的可选本地只读联动。

联动协议只接受经过范围约束的数量与 Token 汇总，不读取任务文本、通信内容、提示词、命令、路径、凭据或模型回复。协议说明见 [`docs/ecosystem-protocol.md`](docs/ecosystem-protocol.md)。

![Agent Skyline v1.1 本地生态联动](docs/v11-preview.png)
`

async function updateReadme(file, section, anchor) {
  let content = await read(file)
  content = content.replaceAll('#v1.0.0', '#v1.1.0')
  if (!content.includes(section.split('\n')[0])) content = content.replace(anchor, `${section}\n${anchor}`)
  await write(file, content)
}
await updateReadme('README.md', englishSection, '## Four visual climates')
await updateReadme('README.zh-CN.md', chineseSection, '## 四套城市气候')

let changelog = await read('CHANGELOG.md')
if (!changelog.includes('## [1.1.0]')) {
  const entry = String.raw`## [1.1.0] - 2026-08-27

### Added

- Mobile-first 9:16 PNG/SVG share card export.
- Privacy-safe, checksum-protected city seed import/export.
- README/GitHub Profile badge export.
- Seasonal and rare deterministic landmarks.
- Aggregate-only local bridge for dsh-task-dag and dsh-token-usage.
- Four additional ecosystem/privacy tests and built-bundle smoke coverage.

`
  changelog = changelog.replace(/^(# .*?\n+)/u, `$1\n${entry}`)
}
await write('CHANGELOG.md', changelog)

let validation = await read('docs/validation-report.md')
if (!validation.includes('v1.1 validation extension')) validation += String.raw`

## v1.1 validation extension

- City seed round-trip, tamper rejection, and privacy reduction.
- Task DAG and token usage aggregate adapter bounds.
- Unrelated localStorage exclusion.
- Seasonal landmark determinism and XML escaping.
- Idempotent sidecar injection into the production bundle and browser demo.
- Desktop and 390 px mobile browser screenshots with the real generated demo.
`
await write('docs/validation-report.md', validation)

console.log('Agent Skyline v1.1 source, tests, documentation, and build injection prepared')

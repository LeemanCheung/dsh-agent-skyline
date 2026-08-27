const core = AgentSkylineV11Core
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
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`
  if (number >= 1_000) return `${(number / 1_000).toFixed(1)}K`
  return String(Math.round(number))
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
    .find(element => /midnight|aurora|sunset|paper/iu.test(element.textContent || '')
      && (element.getAttribute('aria-pressed') === 'true' || /active|selected|current/iu.test(String(element.className || ''))))
  const value = selected?.textContent?.toLowerCase() || ''
  return ['midnight', 'aurora', 'sunset', 'paper'].find(theme => value.includes(theme)) || 'midnight'
}

function readEcosystem() {
  const discovered = core.readSanitizedEcosystem(window)
  return {
    version: core.SKYLINE_ECOSYSTEM_VERSION,
    taskDag: core.normalizeTaskDagSnapshot(liveSnapshots.taskDag || discovered.taskDag),
    tokenUsage: core.normalizeTokenUsageSnapshot(liveSnapshots.tokenUsage || discovered.tokenUsage),
  }
}

function currentSnapshot(panel) {
  const text = panel.textContent || ''
  const cityId = text.match(/(?:city\s*id|城市\s*id)[^a-z0-9]*([a-z0-9-]{4,32})/iu)?.[1]
    || `local-${core.hashString(text.slice(0, 400)).toString(36)}`
  const title = panel.querySelector('h1,h2,h3,[class*="title"]')?.textContent?.trim().slice(0, 48) || 'Agent Skyline'
  const totalEvents = parseMetric(text, ['signals?', 'events?', '活动', '信号'])
    || panel.querySelectorAll('svg [data-building],svg g[class*="building"]').length
  return {
    cityId,
    publicLabel: title,
    theme: selectedTheme(panel),
    metrics: {
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
    },
    ecosystem: readEcosystem(),
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
  const snapshot = currentSnapshot(panel)
  const landmarks = core.selectSeasonalLandmarks({ cityId: snapshot.cityId, metrics: snapshot.metrics, ecosystem })
  section.querySelector('.sky-v11-landmark').textContent = landmarks.join(' · ')
}

function enhance(panel) {
  if (!panel || panel.getAttribute(ENHANCED) === VERSION) return
  panel.setAttribute(ENHANCED, VERSION)
  const section = document.createElement('section')
  section.className = 'sky-v11'
  section.innerHTML = '<div class="sky-v11-heading"><div><span>V1.1 · LOCAL ECOSYSTEM</span><strong>Share wider. Reveal less.</strong></div><div class="sky-v11-landmark" aria-label="Seasonal landmarks"></div></div><div class="sky-v11-chips"></div><div class="sky-v11-actions"></div>'
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
  const candidates = [...document.querySelectorAll('[role="dialog"],[class*="skyline"],[data-testid*="skyline"]')]
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

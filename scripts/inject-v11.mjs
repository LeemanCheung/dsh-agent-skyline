import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const start = '/*__AGENT_SKYLINE_V11_START__*/'
const end = '/*__AGENT_SKYLINE_V11_END__*/'
const ecosystem = (await readFile(path.join(root, 'src/ecosystem.js'), 'utf8')).replace(/\bexport\s+/gu, '')
const sidecar = await readFile(path.join(root, 'src/v11-sidecar.js'), 'utf8')
const css = await readFile(path.join(root, 'src/v11.css'), 'utf8')
const api = 'const AgentSkylineV11Core = Object.freeze({ SKYLINE_ECOSYSTEM_VERSION, CITY_SEED_PREFIX, ECOSYSTEM_EVENT, SHARE_PRESETS, escapeXml, hashString, stableStringify, normalizeTaskDagSnapshot, normalizeTokenUsageSnapshot, readSanitizedEcosystem, sanitizeSeedSnapshot, createCitySeed, parseCitySeed, createSharePreset, selectSeasonalLandmarks, mergeEcosystemMetrics, renderReadmeBadge })'
const browserSource = sidecar.replace('__SKYLINE_V11_CSS__', JSON.stringify(css))
const block = `${start}\n;(() => {\n${ecosystem}\n${api}\n${browserSource}\n})()\n${end}`
const targets = process.argv.includes('--demo') ? ['demo/app.js'] : ['lib/client.js']

function removeExisting(source) {
  const startIndex = source.indexOf(start)
  if (startIndex < 0) return source.trimEnd()
  const endIndex = source.indexOf(end, startIndex)
  if (endIndex < 0) throw new Error('Agent Skyline v1.1 injection start marker exists without an end marker')
  return `${source.slice(0, startIndex)}${source.slice(endIndex + end.length)}`.trimEnd()
}

for (const relative of targets) {
  const file = path.join(root, relative)
  const current = await readFile(file, 'utf8')
  const stripped = removeExisting(current)
  await writeFile(file, `${stripped}\n\n${block}\n`, 'utf8')
  console.log(`v1.1 sidecar injected: ${relative}`)
}

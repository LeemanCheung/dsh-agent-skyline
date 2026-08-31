import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [source, css, coreSource] = await Promise.all([
  readFile(resolve(root, 'src/client.js'), 'utf8'),
  readFile(resolve(root, 'src/style.css'), 'utf8'),
  readFile(resolve(root, 'src/core.js'), 'utf8'),
])

const id = 'dsh-agent-skyline'
const indent = text => text.split('\n').map(line => (line ? `    ${line}` : '')).join('\n')
const embeddedCore = coreSource.replace(/^export /gm, '')
const coreExports = [
  'SKYLINE_SCHEMA_VERSION', 'HISTORY_STORAGE_KEY', 'CATEGORY_ORDER', 'CATEGORY_META', 'THEMES',
  'hashString', 'escapeXml', 'getFocusableElements', 'getFocusTrapTarget', 'copyTextWithFallback', 'normalizeSessionNodes', 'summarizeEvents', 'createSessionSnapshot',
  'createEmptyHistory', 'parseHistory', 'upsertHistory', 'summarizeHistory', 'generateBuildings',
  'buildSkyline', 'buildSkylineFromMetrics', 'renderSkylineSvg', 'buildShareCaption', 'dataUrlForSvg',
]

const bundle = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(id)},\n  factory: (require) => {\n    var module = { exports: {} };\n    var exports = module.exports;\n    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n    const STYLE_TEXT = ${JSON.stringify(css)};\n    const CORE = (() => {\n${indent(embeddedCore)}\n      return { ${coreExports.join(', ')} };\n    })();\n${indent(source)}\n    return module.exports;\n  },\n});\n`

const demoCore = `window.AgentSkylineCore = (() => {\n${indent(embeddedCore)}\n  return { ${coreExports.join(', ')} };\n})();\n`

await mkdir(resolve(root, 'lib'), { recursive: true })
await mkdir(resolve(root, 'demo'), { recursive: true })
await writeFile(resolve(root, 'lib/client.js'), bundle, 'utf8')
await copyFile(resolve(root, 'src/index.js'), resolve(root, 'lib/index.js'))
await writeFile(resolve(root, 'demo/core.js'), demoCore, 'utf8')
console.log(`built ${id}: ${bundle.length} bytes`)

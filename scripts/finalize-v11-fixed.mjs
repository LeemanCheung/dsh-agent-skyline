import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const read = file => readFile(file, 'utf8')
const write = (file, value) => writeFile(file, value.endsWith('\n') ? value : `${value}\n`, 'utf8')

const packageFile = JSON.parse(await read('package.json'))
packageFile.version = '1.1.0'
packageFile.homepage = 'https://github.com/LeemanCheung/dsh-agent-skyline#readme'
packageFile.exports ||= {}
packageFile.exports['./ecosystem'] = './src/ecosystem.js'
packageFile.scripts.build = 'node scripts/build.mjs && node scripts/inject-v11.mjs'
packageFile.scripts.demo = 'node scripts/render-demo.mjs && node scripts/inject-v11.mjs --demo'
packageFile.scripts['demo:serve'] = 'python3 -m http.server 4173 --directory demo'
packageFile.scripts.check = [
  'node --check src/client.js',
  'node --check src/core.js',
  'node --check src/ecosystem.js',
  'node --check src/v11-sidecar.js',
  'node --check scripts/inject-v11.mjs',
  'node --check demo/app.js',
  'npm test',
  'npm run build',
  'node --check lib/client.js',
  'node --check demo/core.js',
  'node scripts/smoke.mjs',
  'npm run demo',
  'node --check demo/app.js',
  'node scripts/v11-smoke.mjs',
].join(' && ')
packageFile.keywords = [...new Set([
  ...(packageFile.keywords || []),
  'city-seed',
  'vertical-share-card',
  'ecosystem-bridge',
  'readme-badge',
])]
await write('package.json', JSON.stringify(packageFile, null, 2))

if (existsSync('package-lock.json')) {
  const lock = JSON.parse(await read('package-lock.json'))
  lock.version = '1.1.0'
  if (lock.packages?.['']) lock.packages[''].version = '1.1.0'
  await write('package-lock.json', JSON.stringify(lock, null, 2))
}

const englishSection = [
  '## v1.1 local ecosystem',
  '',
  'Agent Skyline now adds a polished, non-invasive enhancement strip to both the DSH panel and the standalone demo:',
  '',
  '- **9:16 PNG / SVG cards** for mobile-first sharing;',
  '- **checksum-protected city seeds** that contain sanitized aggregates only;',
  '- **README badge export** for repositories and GitHub Profiles;',
  '- **seasonal and deterministic rare landmarks**;',
  '- an optional, aggregate-only local bridge for [`dsh-task-dag`](https://github.com/LeemanCheung/dsh-task-dag) and [`dsh-token-usage`](https://github.com/LeemanCheung/dsh-token-usage).',
  '',
  'The bridge is read-only. It accepts bounded counts and token totals, never task text, messages, prompts, commands, paths, credentials, or model replies. See [`docs/ecosystem-protocol.md`](docs/ecosystem-protocol.md).',
  '',
  '![Agent Skyline v1.1 local ecosystem](docs/v11-preview.png)',
  '',
].join('\n')

const chineseSection = [
  '## v1.1 本地生态联动',
  '',
  'Agent Skyline 现在会在 DSH 面板与独立 Demo 中增加一条克制、非侵入式的增强工具栏：',
  '',
  '- 面向小红书、抖音等移动内容平台的 **9:16 PNG / SVG 分享卡**；',
  '- 只包含脱敏聚合指标、带校验码的 **匿名城市种子**；',
  '- 面向仓库 README 与 GitHub Profile 的 **SVG 城市徽章**；',
  '- 随季节变化且可确定复现的稀有地标；',
  '- 与 [`dsh-task-dag`](https://github.com/LeemanCheung/dsh-task-dag)、[`dsh-token-usage`](https://github.com/LeemanCheung/dsh-token-usage) 的可选本地只读联动。',
  '',
  '联动协议只接受经过范围约束的数量与 Token 汇总，不读取任务文本、通信内容、提示词、命令、路径、凭据或模型回复。协议说明见 [`docs/ecosystem-protocol.md`](docs/ecosystem-protocol.md)。',
  '',
  '![Agent Skyline v1.1 本地生态联动](docs/v11-preview.png)',
  '',
].join('\n')

async function updateReadme(file, section, anchor) {
  let content = await read(file)
  content = content.replaceAll('#v1.0.0', '#v1.1.0')
  content = content.replaceAll('https://leemancheung.github.io/dsh-agent-skyline/', 'demo/')
  if (!content.includes(section.split('\n')[0])) {
    if (!content.includes(anchor)) throw new Error(`${file}: insertion anchor not found`)
    content = content.replace(anchor, `${section}${anchor}`)
  }
  await write(file, content)
}

await updateReadme('README.md', englishSection, '## Four visual climates')
await updateReadme('README.zh-CN.md', chineseSection, '## 四套城市气候')

let changelog = await read('CHANGELOG.md')
if (!changelog.includes('## [1.1.0]')) {
  const entry = [
    '## [1.1.0] - 2026-08-27',
    '',
    '### Added',
    '',
    '- Mobile-first 9:16 PNG/SVG share card export.',
    '- Privacy-safe, checksum-protected city seed import/export.',
    '- README/GitHub Profile badge export.',
    '- Seasonal and rare deterministic landmarks.',
    '- Aggregate-only local bridge for dsh-task-dag and dsh-token-usage.',
    '- Four additional ecosystem/privacy tests and built-bundle smoke coverage.',
    '',
  ].join('\n')
  const firstBreak = changelog.indexOf('\n')
  changelog = `${changelog.slice(0, firstBreak + 1)}\n${entry}${changelog.slice(firstBreak + 1)}`
}
await write('CHANGELOG.md', changelog)

let validation = await read('docs/validation-report.md')
if (!validation.includes('## v1.1 validation extension')) {
  validation += [
    '',
    '## v1.1 validation extension',
    '',
    '- City seed round-trip, tamper rejection, and privacy reduction.',
    '- Task DAG and token usage aggregate adapter bounds.',
    '- Unrelated localStorage exclusion.',
    '- Seasonal landmark determinism and XML escaping.',
    '- Idempotent sidecar injection into the production bundle and browser demo.',
    '- Desktop and 390 px mobile browser screenshots with the real generated demo.',
    '',
  ].join('\n')
}
await write('docs/validation-report.md', validation)

await write('scripts/finalize-v11.mjs', "import './finalize-v11-fixed.mjs'\n")
console.log('Agent Skyline v1.1 metadata, documentation, and build configuration finalized')

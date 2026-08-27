import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderSkylineSvg, THEMES } from '../src/core.js'
import { createDemoModel } from './demo-fixture.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, '.tmp', 'theme-frames')
const model = createDemoModel()

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
for (const theme of Object.keys(THEMES)) {
  const svg = renderSkylineSvg(model, {
    theme,
    projectLabel: 'NORTHSTAR / LOCAL',
    rangeLabel: `${theme.toUpperCase()} CLIMATE`,
  })
  await writeFile(resolve(output, `${theme}.svg`), svg, 'utf8')
}
console.log(`themes: ${Object.keys(THEMES).join(', ')}`)

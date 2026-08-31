import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderSkylineSvg } from '../src/core.js'
import { createDemoModel } from './demo-fixture.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, '.tmp', 'construction-frames')
const model = createDemoModel()
const total = model.buildings.length
const stops = [0, 1, 3, 6, 10, 14, 18, 22, 26, 30, 34, Math.max(0, total - 1), total]
  .filter((value, index, list) => value <= total && list.indexOf(value) === index)

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
for (const [index, visibleCount] of stops.entries()) {
  const svg = renderSkylineSvg(model, {
    theme: 'paper',
    layout: 'scene',
    projectLabel: 'NORTHSTAR / LOCAL',
    rangeLabel: 'CONSTRUCTION REPLAY',
    visibleCount,
  })
  await writeFile(resolve(output, `${String(index).padStart(2, '0')}-${String(visibleCount).padStart(2, '0')}.svg`), svg, 'utf8')
}
console.log(JSON.stringify({ output, frames: stops.length, stops, total }))

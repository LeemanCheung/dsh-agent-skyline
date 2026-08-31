import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const generatedFiles = [
  'lib/client.js',
  'demo/core.js',
  'docs/preview.svg',
  'docs/architecture.svg',
]
const sourceOwnedDemo = ['demo/index.html', 'demo/app.js']

function run(script) {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts', script)], {
    cwd: root,
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '')
    process.stderr.write(result.stderr || '')
    throw new Error(`${script} failed with exit code ${result.status}`)
  }
}

async function hashes(paths) {
  const entries = await Promise.all(paths.map(async path => {
    const buffer = await readFile(resolve(root, path))
    return [path, createHash('sha256').update(buffer).digest('hex')]
  }))
  return Object.fromEntries(entries)
}

async function frameFiles(directory) {
  const absolute = resolve(root, directory)
  return (await readdir(absolute, { withFileTypes: true }))
    .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
    .map(entry => relative(root, resolve(absolute, entry.name)).replaceAll('\\', '/'))
    .sort()
}

async function renderSnapshot() {
  run('build.mjs')
  run('render-demo.mjs')
  run('render-themes.mjs')
  run('render-animation.mjs')
  const themeFrames = await frameFiles('.tmp/theme-frames')
  const constructionFrames = await frameFiles('.tmp/construction-frames')
  assert.equal(themeFrames.length, 4, 'expected four deterministic theme frames')
  assert.equal(constructionFrames.length, 13, 'expected thirteen deterministic construction frames')
  return hashes([...generatedFiles, ...themeFrames, ...constructionFrames])
}

const demoBefore = await hashes(sourceOwnedDemo)
const first = await renderSnapshot()
const second = await renderSnapshot()
const demoAfter = await hashes(sourceOwnedDemo)

assert.deepEqual(second, first, 'generated source artifacts are not bit-for-bit deterministic')
assert.deepEqual(demoAfter, demoBefore, 'source-owned demo files were overwritten')
console.log(`determinism verified for ${Object.keys(first).length} generated source artifacts`)

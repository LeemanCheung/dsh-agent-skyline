import { readFile, writeFile } from 'node:fs/promises'

const file = 'src/v11-sidecar.js'
const source = await readFile(file, 'utf8')
const pattern = /function scan\(\) \{[\s\S]*?\n\}\n\nlet queued/u
const replacement = `function scan() {
  installStyle()
  const candidates = [
    ...document.querySelectorAll('[role="dialog"],[data-testid*="skyline"],[class*="skyline"]'),
  ].filter(candidate => looksLikeSkyline(candidate))
  const withCity = candidates.filter(candidate => candidate.querySelector('svg'))
  const pool = withCity.length ? withCity : candidates
  pool.sort((left, right) => left.querySelectorAll('*').length - right.querySelectorAll('*').length)
  const panel = pool[0] || ((/agent\\s*skyline/iu.test(document.title) || looksLikeSkyline(document.body)) ? document.body : null)
  if (panel) enhance(panel)
}

let queued`
if (!pattern.test(source)) throw new Error('v1.1 scan function anchor not found')
await writeFile(file, `${source.replace(pattern, replacement).trimEnd()}\n`, 'utf8')
console.log('v1.1 sidecar mounting normalized to one active city panel')

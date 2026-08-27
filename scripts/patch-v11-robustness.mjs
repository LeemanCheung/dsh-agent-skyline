import { readFile, writeFile } from 'node:fs/promises'

async function patchSidecar() {
  const file = 'src/v11-sidecar.js'
  let source = await readFile(file, 'utf8')

  if (!source.includes("const existing = panel.querySelector('.sky-v11')")) {
    const pattern = /function enhance\(panel\) \{\n\s*if \(!panel \|\| panel\.getAttribute\(ENHANCED\) === VERSION\) return/u
    const replacement = `function enhance(panel) {
  if (!panel) return
  if (panel.getAttribute(ENHANCED) === VERSION) {
    const existing = panel.querySelector('.sky-v11')
    if (existing) refreshSection(existing, panel)
    return
  }`
    if (!pattern.test(source)) throw new Error('v1.1 enhance function anchor not found')
    source = source.replace(pattern, replacement)
  }

  if (!source.includes('right.box.width * right.box.height')) {
    const pattern = /function verticalSvg\(panel\) \{\n\s*const source = panel\.querySelector\('svg'\)\n\s*if \(!source\) throw new Error\('No city SVG is visible'\)/u
    const replacement = `function verticalSvg(panel) {
  const source = [...panel.querySelectorAll('svg')]
    .map(element => ({ element, box: element.getBoundingClientRect() }))
    .sort((left, right) => (right.box.width * right.box.height) - (left.box.width * left.box.height))[0]?.element
  if (!source) throw new Error('No city SVG is visible')`
    if (!pattern.test(source)) throw new Error('v1.1 vertical SVG selection anchor not found')
    source = source.replace(pattern, replacement)
  }

  const scanPattern = /function scan\(\) \{[\s\S]*?\n\}\n\nlet queued/u
  const scanReplacement = `function scan() {
  installStyle()
  const candidates = [
    ...document.querySelectorAll('[role="dialog"],[data-testid*="skyline"],[class*="skyline"]'),
  ].filter(candidate => looksLikeSkyline(candidate) && candidate.querySelector('svg'))
  const panel = candidates.find(candidate => candidate.matches('[role="dialog"]'))
    || candidates.find(candidate => /(?:skyline).*(?:app|panel|modal|shell)|(?:app|panel|modal|shell).*(?:skyline)/iu.test(String(candidate.className || '')))
    || candidates.sort((left, right) => right.querySelectorAll('*').length - left.querySelectorAll('*').length)[0]
    || ((/agent\\s*skyline/iu.test(document.title) || looksLikeSkyline(document.body)) ? document.body : null)
  if (panel) enhance(panel)
}

let queued`
  if (!scanPattern.test(source)) throw new Error('v1.1 scan function anchor not found')
  source = source.replace(scanPattern, scanReplacement)

  await writeFile(file, `${source.trimEnd()}\n`, 'utf8')
}

async function patchTests() {
  const file = 'scripts/ecosystem.test.mjs'
  let source = await readFile(file, 'utf8')
  const fragile = "assert.throws(() => parseCitySeed(`${seed.slice(0, -1)}x`), /checksum|Invalid/)"
  if (source.includes(fragile)) {
    source = source.replace(fragile, "const tampered = `${seed.slice(0, -1)}${seed.endsWith('x') ? 'y' : 'x'}`\n  assert.throws(() => parseCitySeed(tampered), /checksum|Invalid/)")
  }
  await writeFile(file, `${source.trimEnd()}\n`, 'utf8')
}

await patchSidecar()
await patchTests()
console.log('v1.1 source and tests normalized idempotently')

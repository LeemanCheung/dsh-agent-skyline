import { readFile, writeFile } from 'node:fs/promises'

const file = 'src/v11-sidecar.js'
let source = await readFile(file, 'utf8')

const enhancePattern = /function enhance\(panel\) \{\n\s*if \(!panel \|\| panel\.getAttribute\(ENHANCED\) === VERSION\) return/u
const enhanceReplacement = `function enhance(panel) {
  if (!panel) return
  if (panel.getAttribute(ENHANCED) === VERSION) {
    const existing = panel.querySelector('.sky-v11')
    if (existing) refreshSection(existing, panel)
    return
  }`
if (!enhancePattern.test(source)) throw new Error('v1.1 enhance function anchor not found')
source = source.replace(enhancePattern, enhanceReplacement)

const svgPattern = /function verticalSvg\(panel\) \{\n\s*const source = panel\.querySelector\('svg'\)\n\s*if \(!source\) throw new Error\('No city SVG is visible'\)/u
const svgReplacement = `function verticalSvg(panel) {
  const source = [...panel.querySelectorAll('svg')]
    .map(element => ({ element, box: element.getBoundingClientRect() }))
    .sort((left, right) => (right.box.width * right.box.height) - (left.box.width * left.box.height))[0]?.element
  if (!source) throw new Error('No city SVG is visible')`
if (!svgPattern.test(source)) throw new Error('v1.1 vertical SVG selection anchor not found')
source = source.replace(svgPattern, svgReplacement)

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
console.log('v1.1 live refresh, largest-city export, and singular panel mounting finalized')

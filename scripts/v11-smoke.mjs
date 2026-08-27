import { readFile } from 'node:fs/promises'

const files = await Promise.all([
  readFile('lib/client.js', 'utf8'),
  readFile('demo/app.js', 'utf8'),
])

for (const [index, source] of files.entries()) {
  const label = index ? 'demo/app.js' : 'lib/client.js'
  if (!source.includes('/*__AGENT_SKYLINE_V11_START__*/')) throw new Error(`${label}: v1.1 marker missing`)
  if (!source.includes('9:16 PNG')) throw new Error(`${label}: vertical share control missing`)
  if (!source.includes('Copy city seed')) throw new Error(`${label}: seed control missing`)
  if (!source.includes('README badge')) throw new Error(`${label}: badge control missing`)
  if (!source.includes('dsh-task-dag:snapshot') || !source.includes('dsh-token-usage:snapshot')) {
    throw new Error(`${label}: ecosystem adapters missing`)
  }
  if ((source.match(/__AGENT_SKYLINE_V11_START__/gu) || []).length !== 1) {
    throw new Error(`${label}: v1.1 injection is not idempotent`)
  }
}

console.log('v1.1 smoke: vertical cards, city seeds, badges, seasonal landmarks, and local ecosystem bridge OK')

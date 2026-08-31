import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workflowDir = resolve(root, '.github', 'workflows')
const workflowNames = (await readdir(workflowDir))
  .filter(name => /\.ya?ml$/i.test(name))
  .sort()
const workflows = await Promise.all(workflowNames.map(async name => ({
  name,
  text: await readFile(resolve(workflowDir, name), 'utf8'),
})))

assert.ok(workflows.some(({ name }) => name === 'ci.yml'), 'ci.yml must remain present')
assert.ok(workflows.some(({ name }) => name === 'release.yml'), 'release.yml must remain present')

const forbiddenMutations = [
  /git\s+push[^\n]*HEAD:main/i,
  /git\s+push[^\n]*--force/i,
  /git\s+checkout\s+-B\s+main/i,
  /gh\s+release\s+delete/i,
  /git\s+tag\s+--delete/i,
]

for (const { name, text } of workflows) {
  for (const pattern of forbiddenMutations) {
    assert.doesNotMatch(text, pattern, `${name} contains a forbidden branch, tag, or release mutation`)
  }
}

const writeWorkflows = workflows.filter(({ text }) => /permissions:\s*\n\s+contents:\s*write\b/m.test(text))
assert.deepEqual(
  writeWorkflows.map(({ name }) => name),
  ['release.yml'],
  'only release.yml may request contents: write',
)

const publishers = workflows.filter(({ text }) => /gh\s+release\s+create\b/.test(text))
assert.deepEqual(
  publishers.map(({ name }) => name),
  ['release.yml'],
  'only release.yml may publish a GitHub Release',
)

const release = workflows.find(({ name }) => name === 'release.yml').text
assert.match(release, /tags:\s*\n\s+- ['"]v\*\.\*\.\*['"]/m)
assert.match(release, /Existing immutable release tag/)
assert.match(release, /version="\$\(node -p .*package\.json.*\.version.*\)"/)
assert.match(release, /expected_tag="v\$\{version\}"/)
assert.match(release, /if \[ "\$tag" != "\$expected_tag" \]/)
assert.match(release, /git rev-parse "refs\/tags\/\$TAG\^\{commit\}"/)
assert.match(release, /Release \$TAG already exists; refusing to overwrite it/)
assert.doesNotMatch(release, /branches:\s*\[?main\]?/)

console.log(`Workflow policy passed for ${workflows.length} workflows: one read-only CI path and one immutable-tag release path.`)

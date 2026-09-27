import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const generatedPaths = ['lib', 'demo/core.js', 'docs/preview.svg', 'docs/architecture.svg']
const bash = process.platform === 'win32'
  ? resolve(execFileSync('git', ['--exec-path'], { encoding: 'utf8' }).trim(), '../../../bin/bash.exe')
  : 'bash'

function readGate(workflow) {
  const lines = readFileSync(join(root, '.github/workflows', workflow), 'utf8').split(/\r?\n/)
  const step = lines.findIndex(line => line.trim() === '- name: Verify committed generated artifacts')
  assert.notEqual(step, -1, `${workflow}: generated-artifact gate is missing`)
  const stepIndentation = lines[step].match(/^\s*/)[0].length
  const stepLines = []
  for (const line of lines.slice(step + 1)) {
    if (line.trim() && line.match(/^\s*/)[0].length <= stepIndentation) break
    stepLines.push(line)
  }
  const run = stepLines.findIndex(line => line.trim() === 'run: |')
  assert.notEqual(run, -1, `${workflow}: gate must contain a run block`)
  const indentation = stepLines[run + 1].match(/^\s*/)[0].length
  const commands = []
  for (const line of stepLines.slice(run + 1)) {
    if (line.trim() && !line.startsWith(' '.repeat(indentation))) break
    commands.push(line.slice(indentation))
  }
  return commands.join('\n')
}

const gates = ['ci.yml', 'release.yml'].map(workflow => ({ workflow, command: readGate(workflow) }))

function execute(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 30_000 })
  assert.ifError(result.error)
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed:\n${result.stderr}`)
  return result.stdout
}

function withFixture(run) {
  const temporaryRoot = resolve(tmpdir())
  const fixture = mkdtempSync(join(temporaryRoot, 'dsh-skyline-gate-'))
  const git = (...args) => execute('git', [
    '-c', `core.hooksPath=${join(fixture, 'empty-hooks')}`,
    '-c', 'core.autocrlf=false',
    '-c', 'commit.gpgsign=false',
    '-c', 'user.name=Skyline CI Fixture',
    '-c', 'user.email=skyline-ci@example.invalid',
    ...args,
  ], fixture)
  const build = () => {
    execute(process.execPath, ['scripts/build.mjs'], fixture)
    execute(process.execPath, ['scripts/render-demo.mjs'], fixture)
  }
  try {
    mkdirSync(join(fixture, 'scripts'))
    mkdirSync(join(fixture, 'empty-hooks'))
    cpSync(join(root, 'src'), join(fixture, 'src'), { recursive: true })
    copyFileSync(join(root, '.gitattributes'), join(fixture, '.gitattributes'))
    writeFileSync(join(fixture, 'package.json'), '{"type":"module"}\n')
    for (const file of ['build.mjs', 'render-demo.mjs', 'demo-fixture.mjs']) {
      copyFileSync(join(root, 'scripts', file), join(fixture, 'scripts', file))
    }
    build()
    git('init', '--quiet')
    git('add', '--', '.gitattributes', 'package.json', 'src', 'scripts', ...generatedPaths)
    git('commit', '--quiet', '-m', 'Record generated fixture')
    run({ fixture, git, build })
  } finally {
    assert.equal(dirname(fixture), temporaryRoot)
    assert.ok(basename(fixture).startsWith('dsh-skyline-gate-'))
    rmSync(fixture, { recursive: true, force: true })
  }
}

function assertGateResult(fixture, expectedPass, description) {
  for (const { workflow, command } of gates) {
    const result = spawnSync(bash, ['--noprofile', '--norc', '-eo', 'pipefail', '-c', command], {
      cwd: fixture, encoding: 'utf8', timeout: 30_000,
    })
    assert.ifError(result.error)
    assert.equal(result.status === 0, expectedPass, `${workflow}: ${description}\n${result.stdout}\n${result.stderr}`)
  }
}

test('both workflow gates accept a committed generated snapshot', () => {
  withFixture(({ fixture }) => assertGateResult(fixture, true, 'committed fixture should pass'))
})

test('both workflow gates reject stale staging after the worktree is rebuilt', () => {
  withFixture(({ fixture, git, build }) => {
    writeFileSync(join(fixture, 'lib/client.js'), 'export const stale = true\n')
    git('add', '--', 'lib/client.js')
    build()
    git('diff', '--exit-code', 'HEAD', '--', ...generatedPaths)
    assertGateResult(fixture, false, 'a rebuilt worktree must not hide a stale index')
  })
})

test('both workflow gates reject a staged addition removed from the worktree', () => {
  withFixture(({ fixture, git }) => {
    const path = join(fixture, 'lib/stale.js')
    writeFileSync(path, 'export const stale = true\n')
    git('add', '--', 'lib/stale.js')
    rmSync(path)
    git('diff', '--exit-code', 'HEAD', '--', ...generatedPaths)
    assertGateResult(fixture, false, 'a removed worktree copy must not hide a staged addition')
  })
})

for (const path of generatedPaths.slice(1)) {
  test(`both workflow gates reject ${path} rebuilt after a committed deletion`, () => {
    withFixture(({ fixture, git, build }) => {
      git('rm', '--', path)
      git('commit', '--quiet', '-m', `Delete generated ${path}`)
      assert.equal(git('ls-tree', '--name-only', 'HEAD', '--', path).trim(), '')
      build()
      assert.ok(readFileSync(join(fixture, path)).length > 0)
      // Recreated files are invisible to a tracked-file diff against HEAD.
      git('diff', '--exit-code', 'HEAD', '--', ...generatedPaths)
      assertGateResult(fixture, false, `rebuilt untracked ${path} must fail`)

      writeFileSync(join(fixture, '.git/info/exclude'), `/${path}\n`)
      git('check-ignore', '--quiet', '--', path)
      assertGateResult(fixture, false, `rebuilt ignored ${path} must also fail`)
    })
  })
}

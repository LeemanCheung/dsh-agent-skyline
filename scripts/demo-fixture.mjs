import { buildSkyline } from '../src/core.js'

/** Stable synthetic fixture used by the README preview and launch assets. */
export function createDemoModel() {
  const base = Date.UTC(2026, 7, 26, 7, 30)
  const nodes = []
  const push = (toolName, status = 'completed', durationMs = 400, offset = nodes.length * 2_000, extra = {}) => {
    nodes.push({ kind: 'tool-call', toolName, status, durationMs, createdAt: base + offset, ...extra })
  }

  nodes.push({ kind: 'user-message', createdAt: base })
  nodes.push({ kind: 'assistant-thinking', createdAt: base + 900 })
  for (let index = 0; index < 10; index += 1) push(index % 3 ? 'read_file' : 'grep', 'completed', 180 + index * 17)
  for (let index = 0; index < 9; index += 1) push(index % 2 ? 'apply_patch' : 'write_file', 'completed', 420 + index * 31)
  for (let index = 0; index < 6; index += 1) {
    push(
      index % 2 ? 'bash' : 'terminal_exec',
      index === 2 ? 'failed' : 'completed',
      650 + index * 74,
      undefined,
      index === 2 ? { error: 'redacted' } : {},
    )
  }
  push('bash', 'completed', 720)
  for (let index = 0; index < 8; index += 1) {
    push(
      index % 2 ? 'vitest' : 'playwright_test',
      index === 1 ? 'failed' : 'passed',
      900 + index * 105,
      undefined,
      index === 1 ? { error: 'redacted' } : {},
    )
  }
  push('playwright_test', 'passed', 1800)
  for (let index = 0; index < 6; index += 1) push(index % 2 ? 'web_search' : 'browser_open', 'completed', 330 + index * 29)
  for (let index = 0; index < 5; index += 1) push(index % 2 ? 'delegate_agent' : 'workflow_run', 'completed', 2200 + index * 340)
  for (let index = 0; index < 4; index += 1) push(index % 2 ? 'screenshot' : 'image_render', 'completed', 460 + index * 66)
  for (let index = 0; index < 5; index += 1) nodes.push({ kind: 'assistant-message', createdAt: base + (nodes.length + index) * 2_000 })

  return buildSkyline({
    nodes,
    sessionKey: 'demo-northstar-session',
    projectLabel: 'NORTHSTAR / LOCAL',
    rangeLabel: 'SESSION CITY',
  })
}

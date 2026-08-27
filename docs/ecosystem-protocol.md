# Agent Skyline Local Ecosystem Protocol v1

Agent Skyline v1.1 can enrich a city with **aggregate-only**, local browser snapshots from `dsh-task-dag` and `dsh-token-usage`. The bridge is optional, dependency-free, and never sends data over the network.

## Privacy boundary

Accepted values are bounded numbers such as node count, workflow count, request count, and token totals. Task names, messages, prompts, commands, paths, model replies, credentials, repository names, and user identifiers are discarded.

## Producers

A compatible plugin may dispatch either event:

```js
window.dispatchEvent(new CustomEvent('dsh-task-dag:snapshot', {
  detail: { nodes: 12, edges: 18, workflows: 3, agents: 5, completed: 9, failed: 1 },
}))

window.dispatchEvent(new CustomEvent('dsh-token-usage:snapshot', {
  detail: { inputTokens: 120000, outputTokens: 28000, cachedTokens: 45000, requests: 38 },
}))
```

Agent Skyline also performs a read-only lookup of explicitly named globals and `localStorage` keys prefixed with `dsh-task-dag` or `dsh-token-usage`. Unrelated keys are ignored.

## Consumer API

When the browser client loads, it exposes:

```js
window.AgentSkylineV11.readEcosystem()
window.AgentSkylineV11.createCitySeed(snapshot)
window.AgentSkylineV11.parseCitySeed(seed)
window.AgentSkylineV11.refresh()
```

The returned object contains sanitized aggregate fields only. City seeds are checksum-protected and use the same privacy reducer before encoding.

## Compatibility rules

1. Producers should publish counts and totals, never raw arrays of messages, tasks, prompts, or calls.
2. Consumers must tolerate absent fields and unknown future fields.
3. All numbers are clamped before use, preventing pathological storage values from creating oversized cities.
4. No network transport, identity correlation, or global leaderboard is part of this protocol.

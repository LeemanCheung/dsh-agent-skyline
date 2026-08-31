# v1.1.0 — A daylight civic workspace for Agent sessions

Agent Skyline v1.1 rebuilds the session city as a DSH-native daylight workspace. The procedural city remains deterministic and privacy-safe, while the interface, architecture, exports, accessibility, and release evidence now ship as one coherent product.

## Highlights

- Four daylight climates: Blueprint, Garden, Terracotta, and Paper, with persisted theme IDs preserved for compatibility
- A city-first scene with civic roads, a central plaza, parks, low-rise buffers, richer architectural families, tiered setbacks, facades, podiums, and roof details
- Separate in-app scene and self-contained export-card SVG layouts
- Accessible modal focus containment, app-owned local-history confirmation, reduced-motion handling, and durable manual-copy recovery
- Truthful PNG-to-SVG fallback and stale-safe copy/export feedback
- Regenerated desktop, mobile, export, theme, construction, social, and architecture assets with recorded provenance
- 27 automated tests, deterministic double-render checks, package/asset manifest validation, and guarded immutable-tag release automation

## Privacy

The reducer still discards prompts, replies, commands, tool arguments, paths, workspace names, credentials, and raw model output before city generation. Only coarse category, outcome, duration, and timestamp signals can reach browser-local history or exports.

## Install

```bash
dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.1.0"
```

The install is pinned to the immutable `v1.1.0` tag. The release workflow refuses a tag that differs from `package.json`, points at another commit, or already has a GitHub Release.

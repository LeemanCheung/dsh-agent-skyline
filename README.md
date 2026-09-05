# dsh-agent-skyline

> Turn every DeepSeek Harness Agent session into a private, animated, shareable developer city.

![Agent Skyline interface](docs/ui-preview.png)

`dsh-agent-skyline` is a local-first DSH Web plugin that converts coarse session activity into a deterministic procedural city. File operations become buildings, tests become verification labs, search becomes observatories, subagents become collaboration hubs, and successful recovery after a failure unlocks the Phoenix Tower.

It is designed as a visual product with a built-in sharing loop rather than another disposable stats panel.

- Session, today, last 7 days, and all-history cities
- Construction replay with play, pause, restart, and scrubbing
- PNG / SVG export plus a ready-to-post caption
- Blueprint, Garden, Terracotta, and Paper daylight visual systems
- Stable city identity, archetype, district, City ID, and unlockable landmarks
- Browser-only persistence with no server, telemetry, database, or extra model call

![Construction replay](docs/construction.gif)

[Interactive demo source](demo/) · [中文说明](README.zh-CN.md) · [Market analysis](docs/market-analysis.zh-CN.md) · [Launch playbook](docs/launch-playbook.zh-CN.md)

> **Release target:** this branch and its screenshots are the reviewed `v1.1.0` daylight redesign. The install command is pinned to the immutable `v1.1.0` tag and becomes available when that tag is published.

## Install

```bash
npx @deepseek-ai/dsh web
dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.1.0"
```

Confirm the plugin in **Settings → Plugins**, then open any Session and select **Agent Skyline** in the conversation header.

To preview the standalone browser demo locally:

```bash
npm run demo
python3 -m http.server 4173 --directory demo
```

Then open `http://127.0.0.1:4173/`.

## Four visual climates

The same city can be rendered as Blueprint, Garden, Terracotta, or Paper without changing its data identity. The persisted `midnight`, `aurora`, and `sunset` IDs remain compatible with existing browser state.

![Four Agent Skyline visual climates](docs/themes.png)

## Privacy by construction

The reducer intentionally discards prompts, replies, tool arguments, commands, file paths, workspace names, and raw model output. Only category, outcome, duration, and timestamp survive. Those coarse signals feed the in-memory model, local browser history, and exported assets.

![Local-first architecture](docs/architecture.svg)

The plugin:

- sends no data to a server;
- makes no additional model request and consumes no extra tokens;
- never derives a project label from a repository or filesystem path;
- stores sanitized per-session snapshots plus the selected theme and any explicitly entered public label in `localStorage`;
- lets the user clear that history without touching DSH Sessions.

## Signal-to-city mapping

| Agent signal                 | City representation       |
| ---------------------------- | ------------------------- |
| Read, edit, patch, write     | Build District towers     |
| Shell, terminal, process     | Runtime industrial blocks |
| Test, lint, check, build     | Verification Labs         |
| Search, browser, fetch       | Horizon Observatories     |
| Agent, workflow, delegate    | Constellation Hubs        |
| Vision, screenshot, render   | Prism Towers              |
| Reasoning and model steps    | Thought Spires            |
| User and conversation turns  | Signal Plazas             |
| Failure followed by recovery | Phoenix Tower landmark    |

## Development

No runtime dependency is bundled. The build and test pipeline uses Node.js built-ins.

```bash
npm run check
```

This runs syntax checks, 27 unit tests, the DSH client build, bundle validation, manifest/slot smoke tests, privacy leak assertions, deterministic documentation-asset generation, and committed-asset manifest verification.

```bash
npm test
npm run build
npm run demo
npm run determinism
npm run assets:verify
npm run pack
```

The privacy suite injects a secret prompt, a private filesystem path, and an authorization-bearing command, then verifies that none can appear in normalized events, SVG exports, or share captions.

## Architecture

```text
src/core.js
  lossy normalizer → metrics → local history → city generator → SVG renderer

src/client.js
  DSH conversation header slot → responsive UI → replay/themes → PNG/SVG export

scripts/build.mjs
  embeds the pure core and scoped CSS in a DSH ModuleLoader client bundle
```

## Launch assets

- [`demo/`](demo/) — interactive browser demo source backed by the production city core
- [`docs/ui-preview.png`](docs/ui-preview.png) — complete desktop interface
- [`docs/mobile-preview.png`](docs/mobile-preview.png) — 390 px responsive interface
- [`docs/preview.png`](docs/preview.png) — full export card
- [`docs/social-preview.png`](docs/social-preview.png) — 1280 × 640 repository social preview
- [`docs/construction.gif`](docs/construction.gif) — construction replay
- [`docs/themes.png`](docs/themes.png) — four-theme visual matrix
- [`docs/architecture.svg`](docs/architecture.svg) — privacy architecture
- [`docs/assets-manifest.json`](docs/assets-manifest.json) — dimensions, hashes, and producer lineage
- [`docs/ASSET_REPRODUCTION.md`](docs/ASSET_REPRODUCTION.md) — loopback-only reproduction workflow
- [`docs/launch-playbook.zh-CN.md`](docs/launch-playbook.zh-CN.md) — launch sequence and growth loop
- [`docs/validation-report.md`](docs/validation-report.md) — automated, visual, and packaging evidence

## Compatibility

- DSH Web Profile
- The `1.1.1` source targets DSH `0.1.2-rc.1`; the manifest keeps that exact release `unknown` until the isolated Web Profile lifecycle and daylight-theme visual checks are complete
- DSH is currently a developer preview; pin the plugin release tag and rerun the host checklist after DSH upgrades
- Node.js `>= 20` for development
- React 18 host runtime
- Modern browser support for SVG, Canvas, Blob, and `localStorage`
- SVG fallback when browser PNG encoding is unavailable
- `prefers-reduced-motion` support

## Roadmap

Future releases will focus on portable sharing and local-only ecosystem links: vertical social cards, anonymous city-seed exchange, more rare and seasonal landmarks, aggregate-only bridges to `dsh-task-dag` and `dsh-token-usage`, and README / GitHub Profile city badges.

## License

MIT © 2026 Leeman Cheung

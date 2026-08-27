# v1.0.0 — Your Agent session is now a city

Every DeepSeek Harness Agent session can now become a deterministic developer city.

## Highlights

- Session, today, last 7 days, and all-history cities
- True construction replay with scrubbing and reduced-motion support
- Four complete visual systems: Midnight, Aurora, Sunset, and Paper
- PNG and SVG export plus a ready-to-post share caption
- Stable city identity, City ID, archetype, district, and unlockable landmarks
- Phoenix Tower for successful recovery after failure
- Local-only persistence with no server, telemetry, database, or extra model call
- Interactive browser demo source powered by the same production city core
- Responsive desktop/mobile UI and a lean 45.8 KB install package

## Privacy boundary

Prompts, replies, commands, arguments, file paths, workspace names, credentials, and raw model output are discarded before the city model is built. Exports use coarse category, outcome, duration, timestamp, and aggregate counts only. An optional public project label is exported only when the user types it explicitly.

## Install

```bash
dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.0.0"
```

Confirm the plugin in **Settings → Plugins** and open **Agent Skyline** from a Session header. To preview the standalone browser demo, run `npm run demo`, serve the `demo/` directory locally, and open it in a modern browser.

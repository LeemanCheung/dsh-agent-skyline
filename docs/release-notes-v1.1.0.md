# v1.1.0 — Local ecosystem, portable cities, vertical sharing

Agent Skyline v1.1 turns the city into a portable, privacy-safe creative asset while keeping every integration local.

## New

- 9:16 PNG/SVG share cards designed for Xiaohongshu, Douyin, and mobile feeds
- Checksum-protected anonymous city seed export/import
- README and GitHub Profile SVG badge export
- Seasonal landmarks plus deterministic rare landmarks
- Aggregate-only local bridge for `dsh-task-dag` and `dsh-token-usage`
- Read-only browser API at `window.AgentSkylineV11`
- Desktop and mobile v1.1 preview assets

## Privacy

The ecosystem bridge accepts bounded numeric aggregates only. Prompts, replies, commands, tool arguments, paths, task text, messages, credentials, repository names, and user identifiers are never copied into the city, seed, badge, or share card.

## Install

```bash
dsh plugin --profile web add "github:LeemanCheung/dsh-agent-skyline#v1.1.0"
```

The existing v1.0 city model, four visual climates, replay, local history, PNG/SVG export, and privacy reducer remain intact.

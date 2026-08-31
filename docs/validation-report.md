# Validation report

Date: 2026-08-30 21:55 Asia/Taipei

Branch under test: `redesign/light-city`

## Result boundary

The source, generated bundle, independent demo, exports, responsive layouts, reduced-motion behavior, and documentation assets passed the checks below. The user DSH service on `127.0.0.1:3080` still links the original Skyline worktree and was not changed. A separate credential-free QA home loaded this redesign through the real DSH rc.2 Web Shell on `127.0.0.1:3081`; that isolated Shell UAT passed the modal, focus, theme, export, clipboard, network, and light/dark contrast checks described below.

The real header was exposed with a browser-blocked prompt harness: Playwright fulfilled one `/api/session.prompt` attempt before it reached the Host. The isolated persisted session remains blank with 0 turns, 0 steps, 0 tokens, no user/assistant/tool events, and no credentials. This proves real Shell integration without claiming provider/model or real Agent-turn UAT.

No push, release, tag movement, DSH profile change, or service restart was performed.

The local release target is `1.1.0`. The immutable-tag workflow derives `v1.1.0` from `package.json`, requires that existing tag to resolve to the checked-out commit, and refuses to overwrite an existing GitHub Release.

## Automated verification

`npm run check` passed and performed:

- JavaScript syntax checks for source, demo, and generated bundles;
- 27/27 Node.js tests;
- deterministic city generation and replay checks;
- daylight-palette checks for all four persisted theme IDs;
- verification that architecture, tiers, setbacks, roof type, facade rhythm, bay count, material, and podium height affect rendered geometry;
- reserved civic roads, central plaza buffer, pocket parks, and one southeast shadow per building;
- separate `scene` and compatible `card` SVG layouts;
- XML escaping and synthetic prompt/path/authorization privacy fixtures;
- history repair/aggregation, ecosystem adapters, city-seed integrity, and caption checks;
- DSH ModuleLoader build plus manifest, header-slot, locale, CSS, and privacy smoke checks;
- deterministic demo assets;
- release-workflow policy: only `ci.yml` and `release.yml` remain, only the release workflow receives `contents: write`, and no workflow may push to `main`, force-push, delete a release, or delete a tag.
- 1,000 dense-city seeds against the shared scene/card envelope, plus monolith detail stability across one, two, and three tiers;
- Clipboard API and legacy fallback tests covering success, `false`, and thrown-error outcomes, with temporary-node cleanup and keyboard-focus restoration.

Generated `lib/client.js`: 128,892 bytes, SHA-256 `c4e19c1ae7eb42a38076e84397056b99bd8d809ac05871e97fcdfa51b947b5ea`. A second build produced the identical hash. The smoke check also confirms the source-owned demo is not overwritten by `npm run demo`.

Additional `npm run determinism` verification rendered the bundle, generated SVGs, four theme frames, and thirteen construction frames twice and confirmed bit-for-bit equality across 21 artifacts.

Release-workflow checks additionally passed:

- both remaining workflow files parse as YAML;
- manual release recovery accepts only an existing immutable tag and checks out that tag;
- the package version, requested tag, checked-out commit, and tag target must agree before publication;
- an existing GitHub Release is never deleted or overwritten;
- `scripts/check-workflows.mjs`, JavaScript syntax checks, and `git diff --check` pass.

Additional design gates:

- `designmd lint DESIGN.md`: 0 errors, 0 warnings;
- `frontend-design-premium` strict project audit: 0 findings;
- `git diff --check`: clean.

## Browser and interaction verification

A real Chromium session loaded the local demo from `127.0.0.1`. The request log contained only loopback resources and browser-local Blob downloads; no external HTTP request occurred.

Verified without console errors or warnings:

- desktop layout at 1440 × 1000;
- responsive layout at 390 × 844 with reachable below-fold controls and no horizontal clipping;
- Session / Today range switching and metric/model changes;
- Paper → Garden theme switching, with `aria-pressed` and SVG `data-theme` updated;
- scene SVG contract: `data-layout="scene"`, `viewBox="350 20 900 540"`;
- construction replay: 350 ms after restart, progress advanced to `3 / 48` while the control announced Pause;
- keyboard Tab order through range, replay, scrubber, and project-label controls;
- reduced-motion emulation: shell and building animation `none`, control transition duration `0s`;
- native SVG download;
- Canvas PNG download at 2400 × 1440, 32-bit alpha;
- share-caption copy feedback (`Copied`);
- zero favicon and runtime console errors.
- final-SVG Chromium bounds audit over 1,000 dense seeds: 0 clipped seeds / 0 clipped buildings, worst building `minY=32.6` against scene top `20`, and worst right edge `1135` against shared card limit `1200`;
- Demo Clipboard API denial plus throwing legacy fallback: zero temporary textareas and a durable 214-character manual-copy textarea focused with its full value selected. A two-operation deferred fixture also proved that an older failed copy cannot overwrite the newer success label/fallback state; the original label restored once after the final 1.2-second feedback window.

## Isolated DSH Shell UAT

An isolated `DSH_HOME` at `dsh-qa-home` loaded DSH base, DSH Web, this redesign link, the whale-animation recovery link, and the separately validated Whale Companion recovery link. The launcher removed provider/API/OAuth/token/proxy environment variables, disabled telemetry, used an empty workspace, and bound only to `127.0.0.1:3081`.

Verified in the real rc.2 Shell:

- both plugin style bundles loaded from their exact local Junction targets; Skyline CSS hot-reloaded from 23,051 to 23,214 characters after the contrast fix;
- one browser-blocked prompt attempt exposed the real `conversation.session.header.actions` slot while never reaching the Host;
- dialog semantics, accessible label, body scroll lock, initial focus, Shift+Tab containment, Escape dismissal, and trigger focus restoration;
- all four persisted theme IDs, with Garden represented by `aurora` consistently in the pressed button, stage SVG, and localStorage;
- SVG export: 1200 × 720 card layout, only the standard W3C namespace URL, no external href/CSS URL, prompt, command, or local path;
- PNG export: 2400 × 1440 RGBA; copy feedback announced `分享文案已复制`;
- real DSH dark-theme primary-button contrast initially failed at 1.0:1, was fixed using the Host's paired contrast-fill/inverted-label tokens, and then passed at 11.57:1; real light-theme contrast passed at 5.8:1;
- 82 observed browser resources remained loopback-only; final Console contained 0 errors and 0 warnings;
- Host history contains only `permission/preset`, `sandbox/mode`, and `approval/policy`; no `user/message`, `turn/start`, `assistant/message`, or `tool/call` exists;
- the QA process tree had zero established non-loopback connections and `.credentials.yaml` was never created.
- post-review focus regression: initial panel `Shift+Tab` reached the last enabled control and wrapped to Close; reset alertdialog wrapped Cancel/Confirm in both directions; both Cancel and Escape restored focus to `清除本地历史`;
- final replay computed style: normal `animation-name: sky-rise`, duration `0.42s`; reduced-motion `animation-name: none`, duration `0s`, with no inline animation declaration;
- legacy-copy success removed the temporary textarea and restored focus to `复制分享文案`; double failure left zero temporary textareas and focused/selected the durable manual-copy textarea;
- authoritative QA session state after two browser-blocked prompt attempts: `blank=true`, 0 turns, 0 steps, 0 tokens, and no user/assistant/tool events.

The temporary 3081 server and Playwright browser were stopped after UAT. The user 3080 listener remained available throughout.

## Visual verification

The current visual system was compared against the generated architectural module board and whole-city concept under `garden-gpt-image-2/reference/`.

Current artifacts:

| Artifact                  | Current evidence                                    |
| ------------------------- | --------------------------------------------------- |
| `docs/ui-preview.png`     | 1440 × 1000 light desktop workspace                 |
| `docs/mobile-preview.png` | 390 × 844 responsive viewport                       |
| `docs/preview.png`        | 2400 × 1440 Paper field-sheet export                |
| `docs/social-preview.png` | 1280 × 640 social crop                              |
| `docs/themes.png`         | 1400 × 900 Blueprint/Garden/Terracotta/Paper matrix |
| `docs/construction.gif`   | 720 × 432, 13-frame Paper scene replay              |
| `docs/preview.svg`        | deterministic Paper export card                     |
| `docs/architecture.svg`   | light local-first architecture diagram              |

Visual review confirmed:

- no black/night theme, neon treatment, or purple-blue gradient;
- city-first hierarchy with a visible civic plaza, cross roads, park lots, and daylight ground;
- varied mineral/glass materials, setbacks, facades, roof gardens, equipment, lanterns, and spires;
- theme identity conveyed through restrained structural and roof accents rather than saturated blocks;
- exported project label remains explicit user input, not an inferred workspace name.

## Packaging verification

`npm pack --dry-run --json` passed:

- package identity: `dsh-agent-skyline@1.1.0`;
- packed size: 76,942 bytes;
- unpacked size: 305,220 bytes;
- package entries: 16;
- no bundled dependencies.

The npm allowlist excludes demo media, browser evidence, ImageGen references, and local temporary frames. Runtime/source files, manifests, policy, license, changelog, and bilingual READMEs remain included.

## Residual checks before release

1. Run one later real Agent turn in the isolated QA home to verify live-dot, non-zero metrics/history aggregation, replay, and real Whale TurnStatus lifecycle; that step requires explicit provider authorization and is not claimed here.
2. Keep all DSH services loopback-only; the RPC surface is not an authentication boundary.
3. Review the final Git diff and commit only an explicit allowlist. Do not publish from the current dirty branch automatically.

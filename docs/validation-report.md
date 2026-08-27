# Validation report

Date: 2026-08-26

## Automated verification

`npm run check` passes from a dependency-free source tree and performs:

- JavaScript syntax validation for source and generated client bundles;
- 13 Node.js unit tests covering classification, deterministic generation, recovery detection, empty-state behavior, small/large session scaling, history repair and aggregation, XML escaping, captions, and replay reveal state;
- explicit privacy fixtures containing a synthetic secret prompt, private path, and authorization-bearing command;
- assertion that those strings cannot enter normalized events, sanitized history, SVG output, or share captions;
- deterministic DSH ModuleLoader bundle generation;
- execution of the built bundle in a DSH-shaped VM host;
- verification of the exact `conversation.session.header.actions` registration, locale dictionaries, scoped CSS injection, package manifest, and Cordis patch.

The generated browser bundle is 83,720 UTF-8 bytes on disk, unminified.

## Browser and interaction verification

System Chromium 144 executed the generated interactive demo with the real `src/core.js` logic inlined. The following interactions passed without page errors:

- Session / Today / Last 7 days / All history range switching;
- Midnight / Aurora / Sunset / Paper theme switching;
- public-label editing with escaped SVG output;
- construction restart, incremental reveal, pause, and timeline scrubbing;
- declared and actively running `sky-rise` reveal animation on the newest visible building;
- native SVG download;
- Canvas PNG download validated as a 2400 × 1440 PNG;
- share-caption copying;
- direct GitHub install/discovery call-to-action.

A 390 px viewport produced no horizontal overflow. The responsive page height was 1,294 px and all controls remained reachable.

## Visual verification

Chromium and Pillow rebuilt and visually checked:

- `docs/preview.png`: 1200 × 720 export card;
- `docs/ui-preview.png`: 1500 × 950 desktop interface;
- `docs/mobile-preview.png`: 390 × 1,238 responsive interface;
- `docs/construction.gif`: 13-frame, 640 × 384 construction replay;
- `docs/themes.png`: four-theme visual matrix;
- `docs/social-preview.png`: 1280 × 640 repository social preview.

Generated card typography, city depth order, landmark layout, legend, privacy footer, interactive control states, and dark/light theme contrast were inspected after final regeneration.

## Packaging verification

`npm pack --dry-run --json` reports:

- packed size: 46,134 bytes;
- unpacked size: 181,730 bytes;
- runtime/source package files: 13.

The published package allowlist contains only `lib`, `src`, manifests, license, security policy, changelog, and READMEs. Heavy launch media, the GitHub Pages demo, temporary frames, logs, coverage, and local runtime state are deliberately excluded from the install package while remaining in the source repository.

CI runs `npm run check` and `npm pack --dry-run` on Node.js 22. A separate Pages workflow validates the same source before deploying `demo/`.

## Residual host check

The current execution environment does not contain the live DeepSeek Harness Web runtime, so this report does **not** claim a real DSH boot. Host integration is validated against the same Web package declaration, ModuleLoader bundle format, Cordis patch, and conversation-header slot pattern used by the existing working plugins, plus executable VM contract tests.

DeepSeek Harness is currently a developer preview and may introduce compatibility-breaking changes. The final live installation, composed-config, locale, and export checklist is documented in `PUSH_TO_GITHUB.md` and should be run immediately after the repository is published.

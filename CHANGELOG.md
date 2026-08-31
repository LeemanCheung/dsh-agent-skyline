# Changelog

All notable changes to this project are documented here.

## [1.1.0] - 2026-08-31

### Changed

- Replaced the dark modal and visual climates with a DSH-native light workspace and four daylight palettes while preserving persisted theme IDs.
- Upgraded procedural buildings with category-biased archetypes, tiered setbacks, material faces, facade rhythms, bay counts, podiums, and five roof families.
- Reserved a central civic plaza, cross roads, park lots, and a low-rise buffer so urban structure remains visible at high activity counts.
- Split the city-focused in-app `scene` SVG from the self-contained export `card` layout.
- Added modal focus containment, body scroll locking, bilingual visible theme labels, app-owned clear-history confirmation, truthful PNG fallback, and copy-failure feedback.
- Made the standalone demo source-owned so deterministic asset generation cannot overwrite it with an obsolete template.
- Regenerated the desktop, mobile, export, social, theme-matrix, construction, and architecture assets in the daylight system.
- Expanded the automated suite to 27 tests and added strict design-context and static UI audits.
- Replaced six competing main-writing/tag-forcing delivery workflows with one read-only CI path and one immutable-tag release path, guarded by a repository-local workflow policy check.
- Paired DSH contrast-fill and inverted-label tokens for primary actions so export controls remain readable in the real Host dark theme.

## [1.0.0] - 2026-08-26

### Added

- Deterministic procedural Agent cities generated from coarse DSH session signals.
- Session, today, last-7-days, and all-history ranges.
- Browser-local, idempotent, sanitized history aggregation.
- Construction replay with play, pause, restart, and timeline scrubbing.
- Midnight, Aurora, Sunset, and Paper visual systems.
- Agent archetype, district, stable City ID, and unlockable landmarks.
- Privacy-safe PNG, SVG, and share-caption export.
- Chinese and English UI and documentation.
- Responsive layout and `prefers-reduced-motion` support.
- Thirteen unit tests, executable DSH-shaped host contract smoke tests, deterministic rendering checks, XML escaping, malformed-history repair, and explicit secret-leak assertions.
- Interactive GitHub Pages demo powered by the same city core, with a direct repository call-to-action.
- Dedicated desktop, mobile, construction, four-theme, export-card, and 1280×640 social assets.
- Lean 46.1 KB install tarball that excludes launch media and demo files.
- CI, Pages deployment, security policy, contribution guide, market analysis, and launch playbook.

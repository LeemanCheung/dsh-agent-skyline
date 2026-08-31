# Skyline visual references

These images are design references for the deterministic SVG renderer. They are not loaded by the runtime bundle and do not change the plugin's local-first or zero-network behavior.

- `skyline-architecture-modules-20260830.png` — 4×4 reference board for architectural families, roofs, landscape, roads, and landmarks.
- `skyline-city-concept-20260830.png` — whole-district reference for civic layout, material balance, daylight, and consistent isometric depth.

The normalized generation prompts are kept in `../prompt/`. Runtime implementation must translate the references into deterministic vector geometry rather than embedding these bitmaps.

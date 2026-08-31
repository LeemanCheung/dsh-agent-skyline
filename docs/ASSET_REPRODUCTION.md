# Launch asset reproduction

The source of truth is `src/` plus the stable synthetic fixture in `scripts/demo-fixture.mjs`. Never edit generated SVGs, bundle files, or launch screenshots to change product behavior.

## Prerequisites

- Node.js 20 or newer
- the Playwright CLI, Chromium user agent, device scale factor, Python, Pillow, and font fingerprints recorded in `docs/assets-manifest.json` under `captureEnvironment`
- loopback-only HTTP servers; no external site or credential is required

## Deterministic source artifacts

```powershell
npm run check
npm run determinism
npm run assets:verify
npm run pack
```

`npm run determinism` renders every source artifact twice and requires bit-for-bit equality. It regenerates:

- `lib/client.js`
- `demo/core.js`
- `docs/preview.svg`
- `docs/architecture.svg`
- `.tmp/theme-frames/*.svg`
- `.tmp/construction-frames/*.svg`

`demo/index.html` and `demo/app.js` are source-owned and must remain unchanged after `npm run demo`.

## Browser captures

Serve the demo and repository root in two local terminals:

```powershell
py -m http.server 4173 --bind 127.0.0.1 --directory demo
py -m http.server 4174 --bind 127.0.0.1 --directory .
```

Use the recorded Playwright/Chromium build to capture:

| Output | URL | Viewport |
| --- | --- | --- |
| `docs/ui-preview.png` | `http://127.0.0.1:4173/` | 1440 × 1000 |
| `docs/mobile-preview.png` | `http://127.0.0.1:4173/` | 390 × 844 |
| `docs/themes.png` | `/scripts/doc-assets/themes-board.html` on port 4174 | 1400 × 900 |
| `docs/social-preview.png` | `/scripts/doc-assets/social-preview.html` on port 4174 | 1280 × 640 |

Set `deviceScaleFactor: 1` and use Playwright's `page.setViewportSize()` plus `page.screenshot({ path })` with the exact viewport/path pairs above. For `preview.png`, wait for the demo's PNG download and save that download directly to `docs/preview.png`. The manifest records the approved Windows font file fingerprints; verify them before expecting byte-identical text rasterization.

The full Paper field-sheet PNG is produced by the demo's **Export PNG** action at 2400 × 1440 and saved as `docs/preview.png`. Verify the matching SVG reports `data-layout="card"` and contains no synthetic privacy fixture.

The bundle, generated SVGs, and SVG frame sources are bit-for-bit deterministic across the double render. Browser PNGs and the Pillow-assembled GIF are approved capture evidence: their committed SHA-256 values are reproducible only with the recorded browser, OS font files, pixel ratio, and Pillow toolchain. On a different machine, require matching dimensions/content and visual approval before deliberately updating `docs/assets-manifest.json`; do not describe a cross-toolchain hash mismatch as a renderer failure.

## Construction GIF

Open `/scripts/doc-assets/construction-frame.html` on port 4174 at 960 × 576. For each sorted `.tmp/construction-frames/*.svg`, set `#frame.src`, await `img.decode()`, and take a PNG screenshot. Assemble the screenshots with Pillow:

```python
from pathlib import Path
from PIL import Image

source = Path("output/playwright/construction-frames")
files = sorted(source.glob("*.png"))
frames = [
    Image.open(path)
    .convert("RGB")
    .resize((720, 432), Image.Resampling.LANCZOS)
    .quantize(colors=128, method=Image.Quantize.MEDIANCUT)
    for path in files
]
frames[0].save(
    "docs/construction.gif",
    save_all=True,
    append_images=frames[1:],
    duration=[180] * (len(frames) - 1) + [1000],
    loop=0,
    optimize=True,
    disposal=2,
)
```

The expected output is 720 × 432 with 13 frames. Do not add alpha-only pixels or duplicated fake frames to satisfy validation.

## Acceptance

1. Run `npm run check`, `npm run determinism`, `npm run assets:verify`, `npm run pack`, `designmd lint DESIGN.md`, and the strict premium UI audit.
2. Confirm the browser console has zero errors and the request log contains only loopback and Blob URLs.
3. Exercise range/theme switching, replay, reduced motion, keyboard focus, SVG/PNG export, and copy feedback.
4. Compare dimensions and SHA-256 values with `docs/assets-manifest.json`.
5. Update the manifest only after visually approving every regenerated asset.

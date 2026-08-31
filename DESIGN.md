---
version: alpha
name: "Agent Skyline"
description: "A DSH-native light workspace that turns privacy-safe Agent activity into a replayable axonometric civic field drawing."
colors:
  primary: "#246BCE"
  primary-soft: "#E8F1FC"
  canvas: "#FAF9F5"
  city-ground: "#F3F1EA"
  surface: "#FFFEFA"
  ink: "#24303D"
  muted: "#66717D"
  border: "#D8DDE2"
  success: "#2E7D5B"
  warning: "#93550B"
  danger: "#B74D4D"
typography:
  sans:
    fontFamily: "var(--dsw-font-family, 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif)"
  mono:
    fontFamily: "ui-monospace, 'Cascadia Code', monospace"
rounded:
  DEFAULT: "0.5rem"
  sm: "0.375rem"
  md: "0.5rem"
  lg: "1rem"
spacing:
  control-gap: "0.5rem"
  section-gap: "1.25rem"
  panel-padding: "1.5rem"
components:
  trigger:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  city-canvas:
    backgroundColor: "{colors.city-ground}"
    textColor: "{colors.ink}"
  replay-ledger:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
  inspector:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
  action-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  divider:
    backgroundColor: "{colors.border}"
  status-success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
  status-warning:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warning}"
  status-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
---

# Agent Skyline Design System

## Overview

### Creative North Star

Agent Skyline should feel like a contemporary municipal model room: a pale cadastral drawing comes alive as Agent work becomes foundations, frames, facades, roof marks, streets, parks, and civic landmarks. The product is a working instrument inside DSH first and a collectible field sheet when exported second.

### Product context and register

- **Audience and primary job:** DeepSeek Harness developers inspect how an Agent session evolved, replay construction, and export a privacy-safe visual summary without exposing prompts, replies, commands, paths, or workspace names.
- **Target market and evidence:** Global DSH users. The repository ships English and Simplified Chinese dictionaries and makes no country-specific business claim.
- **Locales and language policy:** English and Simplified Chinese are first-class. Labels stay compact enough for both; host locale and typography are inherited.
- **Usage scene:** Primarily desktop DSH Web, opened as an occasional session-inspection dialog. The exported SVG/PNG must remain legible when shared or viewed independently.
- **Register:** Hybrid. Dialog chrome is restrained product UI; the generated city and field-sheet export carry the expressive identity.
- **Memorable signature:** A deterministic axonometric civic district whose architectural families and roof details encode categories of Agent work.
- **Restraint:** DSH shell surfaces, navigation, inputs, focus, feedback, and action hierarchy stay familiar and quiet.
- **Anti-references:** No black cyberpunk modal, neon cyan-on-dark blocks, purple-blue gradients, decorative glow, glass-card stacks, or generic analytics tiles. These obscure the city and clash with DSH's light workspace.
- **Token ownership/runtime mapping:** Existing DSH semantic CSS variables remain canonical for dialog chrome (Model B). `src/style.css` adapts those host tokens. Exported-city palettes remain canonical in `src/core.js`; this file mirrors their accepted roles and intent. `npm run check`, rendered demo screenshots, and browser inspection are the drift gates.

## Colors

The light baseline uses warm paper rather than pure white. `canvas` frames the product, `city-ground` carries plots and roads, and `surface` supports controls. `ink`, `muted`, and `border` form the information hierarchy. `primary` is reserved for selection, focus, active construction, and primary actions; it is not decorative wash. Success, warning, and danger appear as small semantic marks, roof caps, or recovery landmarks rather than full saturated buildings.

All four persisted city theme IDs remain supported for storage compatibility, but every theme is a daylight climate. Theme changes may alter mineral warmth, planting, and annotation accents; they must not invert the UI into a black or night scene. Forced-colors mode yields to system colors.

## Typography

The dialog inherits DSH's active font stack so Chinese and English remain native to the host. City titles use 20–24 px at 600–650 weight; controls use 13–14 px; metadata and drawing references use 11–12 px. Counts, City IDs, coordinates, and replay progress use tabular numerals. Monospace is limited to identifiers and drawing references, never used as a blanket shorthand for a developer aesthetic. Avoid italic text.

## Layout

Desktop uses a city-first asymmetric split: the city and replay ledger dominate roughly two thirds of the dialog; identity, project label, legend, theme climate, landmarks, and export actions form a compact inspector. Metrics are one factual line rather than four competing cards. At narrow widths the inspector follows the city, primary actions remain reachable, and the city keeps a stable aspect ratio. Scroll ownership belongs to the dialog body; the header and action hierarchy may remain visible without clipping content.

## Elevation & Depth

The city creates depth through one consistent southeast shadow, facade values, setbacks, and roof details. Product chrome uses tonal layers, hairline borders, and one restrained elevation shadow. Backdrop blur, halos, glowing borders, and nested raised cards are forbidden. The exported field sheet is self-contained and uses drawn depth, not browser effects.

## Shapes

Controls use 6–8 px radii. The main dialog may use a 16 px radius to distinguish it from the host page. City geometry favors precise orthogonal/isometric edges; circles are reserved for civic plazas, observatory domes, status dots, and deliberate infrastructure details. Pills are not a default container.

## Components

### Foundational visual states

Every enabled action has default, hover, focus-visible, active, and disabled states. Focus uses the host's business-primary token with a visible two-pixel ring. Selected tabs and themes expose semantic state as well as color. Busy/export feedback occupies stable geometry and is announced through an accessible status region.

### Buttons and actions

Export PNG is the single primary action. SVG export and caption copy are secondary. Clear-history is visually separated and never masquerades as a routine primary action. Icon-only controls require accessible labels. Buttons preserve their dimensions while feedback is active.

### Navigation and data display

Range tabs keep native button semantics and an accessible tab state. Replay combines one labeled play/pause action, a range input, a concise current-step/progress label, and category ticks when available. Metrics read as one line of facts.

### Forms and overlays

The project-label field uses a real label and hint. The modal owns focus entry, Escape dismissal, background isolation, scroll lock, and focus restoration. Destructive history clearing uses an app-owned confirmation surface; browser `confirm()` is not permitted. Toast/status feedback is deduplicated and never the only location for recoverable errors.

### Iconography

Use the repository's compact, stroke-based inline marks with consistent optical weight. Icons support labels; they do not replace unfamiliar actions.

### Motion

Construction replay communicates foundations-to-roof progression. UI feedback uses short ease-out transitions. No bounce, ambient glow, or decorative drifting. `prefers-reduced-motion` disables non-essential reveal and transition motion while preserving control and state clarity.

### Content and data visualization

Copy is direct and local-first. The city encodes coarse category, outcome, duration, and timestamp only. Category color is a secondary channel reinforced by architectural form, roof detail, legend text, and construction order. Exported artifacts retain readable labels and a local-only privacy provenance note.

## Do's and Don'ts

- **Do:** Let architecture, roads, parks, and construction phases explain the Agent session.
- **Do:** Trace dialog colors to DSH semantic tokens and exported colors to `src/core.js` theme constants.
- **Do:** Keep the runtime deterministic, dependency-free, and self-contained.
- **Don't:** Restore a black/night theme under any persisted theme ID.
- **Don't:** use full-building candy colors, neon glow, gradients, or repeated generic block towers.
- **Don't:** claim visual completion without current demo assets and real browser screenshots.

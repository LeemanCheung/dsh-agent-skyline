window.__ModuleLoader__.load({
  id: "dsh-agent-skyline",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    const STYLE_TEXT = ".dsh-skyline-root {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n}\n\n.dsh-skyline-trigger {\n  --sky-accent: #7c9dff;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  min-height: 30px;\n  padding: 5px 9px;\n  border: 1px solid color-mix(in srgb, currentColor 13%, transparent);\n  border-radius: 9px;\n  background: color-mix(in srgb, var(--sky-accent) 6%, transparent);\n  color: inherit;\n  font: inherit;\n  font-size: 12px;\n  line-height: 1;\n  cursor: pointer;\n  transition: border-color .18s ease, background .18s ease, transform .18s ease, box-shadow .18s ease;\n}\n\n.dsh-skyline-trigger:hover {\n  border-color: color-mix(in srgb, var(--sky-accent) 45%, transparent);\n  background: color-mix(in srgb, var(--sky-accent) 11%, transparent);\n  box-shadow: 0 8px 24px color-mix(in srgb, var(--sky-accent) 13%, transparent);\n  transform: translateY(-1px);\n}\n\n.dsh-skyline-trigger:focus-visible,\n.dsh-skyline-panel button:focus-visible,\n.dsh-skyline-panel input:focus-visible {\n  outline: 2px solid #8ea7ff;\n  outline-offset: 2px;\n}\n\n.dsh-skyline-trigger-mark {\n  width: 16px;\n  height: 16px;\n  color: var(--sky-accent);\n  flex: 0 0 auto;\n}\n\n.dsh-skyline-trigger-label {\n  font-weight: 640;\n  letter-spacing: -.01em;\n}\n\n.dsh-skyline-trigger-count {\n  display: inline-flex;\n  min-width: 18px;\n  height: 17px;\n  padding: 0 5px;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--sky-accent) 17%, transparent);\n  color: color-mix(in srgb, var(--sky-accent) 78%, currentColor);\n  font-size: 10px;\n  font-weight: 750;\n}\n\n.dsh-skyline-live-dot {\n  width: 6px;\n  height: 6px;\n  margin-left: -3px;\n  border-radius: 50%;\n  background: #63e4ac;\n  box-shadow: 0 0 0 4px rgba(99, 228, 172, .12), 0 0 12px rgba(99, 228, 172, .65);\n  animation: dsh-skyline-pulse 1.8s ease-in-out infinite;\n}\n\n@keyframes dsh-skyline-pulse {\n  0%, 100% { opacity: .65; transform: scale(.9); }\n  50% { opacity: 1; transform: scale(1.08); }\n}\n\n.dsh-skyline-backdrop {\n  --sky-bg: #070a12;\n  --sky-panel: #0d1220;\n  --sky-panel-2: #111827;\n  --sky-border: rgba(150, 168, 202, .16);\n  --sky-border-strong: rgba(151, 170, 212, .28);\n  --sky-text: #f5f7ff;\n  --sky-muted: #8e9bb4;\n  --sky-accent: #7c9dff;\n  --sky-accent-2: #9c7cff;\n  --sky-good: #65e6b4;\n  position: fixed;\n  inset: 0;\n  z-index: 2147483000;\n  display: grid;\n  place-items: center;\n  padding: 22px;\n  background:\n    radial-gradient(circle at 50% 10%, rgba(84, 104, 173, .18), transparent 42%),\n    rgba(3, 5, 11, .76);\n  backdrop-filter: blur(18px) saturate(115%);\n  -webkit-backdrop-filter: blur(18px) saturate(115%);\n  color: var(--sky-text);\n  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif;\n  animation: dsh-skyline-backdrop-in .18s ease-out both;\n}\n\n@keyframes dsh-skyline-backdrop-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.dsh-skyline-panel {\n  position: relative;\n  display: grid;\n  grid-template-rows: auto auto minmax(0, 1fr) auto;\n  width: min(1480px, 96vw);\n  height: min(940px, 94vh);\n  min-height: 640px;\n  overflow: hidden;\n  border: 1px solid var(--sky-border-strong);\n  border-radius: 24px;\n  background:\n    linear-gradient(180deg, rgba(255,255,255,.025), transparent 14%),\n    var(--sky-bg);\n  box-shadow:\n    0 48px 140px rgba(0, 0, 0, .62),\n    0 8px 32px rgba(0, 0, 0, .42),\n    inset 0 1px 0 rgba(255,255,255,.05);\n  animation: dsh-skyline-panel-in .3s cubic-bezier(.18,.85,.25,1) both;\n}\n\n@keyframes dsh-skyline-panel-in {\n  from { opacity: 0; transform: translateY(14px) scale(.985); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n\n.dsh-skyline-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 72px;\n  padding: 14px 18px 13px 20px;\n  border-bottom: 1px solid var(--sky-border);\n  background: rgba(10, 14, 24, .8);\n}\n\n.dsh-skyline-brand,\n.dsh-skyline-header-right {\n  display: flex;\n  align-items: center;\n}\n\n.dsh-skyline-brand { gap: 12px; }\n.dsh-skyline-header-right { gap: 12px; }\n\n.dsh-skyline-brand-mark {\n  display: grid;\n  place-items: center;\n  width: 38px;\n  height: 38px;\n  border: 1px solid rgba(124, 157, 255, .35);\n  border-radius: 12px;\n  color: var(--sky-accent);\n  background: linear-gradient(145deg, rgba(124,157,255,.18), rgba(156,124,255,.07));\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 8px 24px rgba(69,89,169,.13);\n}\n\n.dsh-skyline-brand-mark svg { width: 22px; height: 22px; }\n\n.dsh-skyline-brand h2 {\n  margin: 0;\n  color: var(--sky-text);\n  font-size: 15px;\n  font-weight: 750;\n  letter-spacing: -.015em;\n}\n\n.dsh-skyline-brand p {\n  margin: 4px 0 0;\n  color: var(--sky-muted);\n  font-size: 11px;\n  font-weight: 560;\n}\n\n.dsh-skyline-privacy {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  padding: 7px 10px;\n  border: 1px solid rgba(101, 230, 180, .2);\n  border-radius: 999px;\n  background: rgba(101, 230, 180, .06);\n  color: #a9f0d2;\n  font-size: 10.5px;\n  font-weight: 650;\n  white-space: nowrap;\n}\n\n.dsh-skyline-privacy > span {\n  color: var(--sky-good);\n  font-size: 7px;\n  filter: drop-shadow(0 0 5px rgba(101,230,180,.65));\n}\n\n.dsh-skyline-icon-button {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  padding: 0;\n  border: 1px solid var(--sky-border);\n  border-radius: 10px;\n  background: rgba(255,255,255,.025);\n  color: var(--sky-muted);\n  cursor: pointer;\n  transition: .18s ease;\n}\n\n.dsh-skyline-icon-button:hover {\n  border-color: var(--sky-border-strong);\n  background: rgba(255,255,255,.06);\n  color: var(--sky-text);\n}\n\n.dsh-skyline-icon-button svg { width: 17px; height: 17px; }\n\n.dsh-skyline-tabs {\n  display: flex;\n  gap: 3px;\n  min-height: 47px;\n  padding: 8px 18px;\n  align-items: center;\n  border-bottom: 1px solid var(--sky-border);\n  background: rgba(9, 13, 22, .76);\n}\n\n.dsh-skyline-tab {\n  position: relative;\n  padding: 8px 13px;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--sky-muted);\n  font: inherit;\n  font-size: 11px;\n  font-weight: 640;\n  cursor: pointer;\n  transition: .18s ease;\n}\n\n.dsh-skyline-tab:hover { color: var(--sky-text); background: rgba(255,255,255,.035); }\n.dsh-skyline-tab[data-active=\"true\"] { color: var(--sky-text); background: rgba(124,157,255,.11); }\n.dsh-skyline-tab[data-active=\"true\"]::after {\n  content: \"\";\n  position: absolute;\n  left: 12px;\n  right: 12px;\n  bottom: -9px;\n  height: 2px;\n  border-radius: 2px;\n  background: linear-gradient(90deg, var(--sky-accent), var(--sky-accent-2));\n  box-shadow: 0 0 12px rgba(124,157,255,.6);\n}\n\n.dsh-skyline-body {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 300px;\n  min-height: 0;\n  overflow: hidden;\n}\n\n.dsh-skyline-stage-column {\n  display: grid;\n  grid-template-rows: minmax(0, 1fr) auto auto;\n  gap: 12px;\n  min-width: 0;\n  min-height: 0;\n  padding: 16px;\n  overflow: auto;\n  background:\n    radial-gradient(circle at 70% 18%, rgba(94, 117, 198, .08), transparent 35%),\n    #080c15;\n}\n\n.dsh-skyline-stage {\n  position: relative;\n  min-height: 340px;\n  overflow: hidden;\n  border: 1px solid var(--sky-border);\n  border-radius: 18px;\n  background: #070a12;\n  box-shadow: 0 18px 50px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.025);\n}\n\n.dsh-skyline-stage::after {\n  content: \"\";\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,.02);\n}\n\n.dsh-skyline-stage-art {\n  width: 100%;\n  height: 100%;\n}\n\n.dsh-skyline-stage-art svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 340px;\n  object-fit: contain;\n}\n\n.dsh-skyline-empty {\n  pointer-events: none;\n  position: absolute;\n  margin: 0;\n  inset: 50% auto auto 50%;\n  width: min(320px, 72%);\n  transform: translate(-50%, -50%);\n  color: var(--sky-muted);\n  font-size: 12px;\n  line-height: 1.65;\n  text-align: center;\n}\n\n.dsh-skyline-player {\n  display: grid;\n  grid-template-columns: auto minmax(180px, 1fr) auto;\n  align-items: center;\n  gap: 14px;\n  min-height: 50px;\n  padding: 9px 12px;\n  border: 1px solid var(--sky-border);\n  border-radius: 13px;\n  background: rgba(15, 21, 35, .72);\n}\n\n.dsh-skyline-play {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  min-height: 32px;\n  padding: 7px 11px;\n  border: 1px solid rgba(124,157,255,.28);\n  border-radius: 9px;\n  background: rgba(124,157,255,.1);\n  color: #dce4ff;\n  font: inherit;\n  font-size: 10.5px;\n  font-weight: 680;\n  cursor: pointer;\n}\n\n.dsh-skyline-play:hover:not(:disabled) { background: rgba(124,157,255,.16); border-color: rgba(124,157,255,.5); }\n.dsh-skyline-play:disabled { opacity: .42; cursor: not-allowed; }\n.dsh-skyline-play svg { width: 16px; height: 16px; }\n\n.dsh-skyline-scrubber {\n  display: grid;\n  grid-template-columns: auto minmax(100px, 1fr);\n  align-items: center;\n  gap: 11px;\n  color: var(--sky-muted);\n  font-size: 10px;\n  font-weight: 620;\n}\n\n.dsh-skyline-scrubber input {\n  width: 100%;\n  accent-color: var(--sky-accent);\n  cursor: pointer;\n}\n\n.dsh-skyline-progress {\n  min-width: 50px;\n  color: var(--sky-muted);\n  font-variant-numeric: tabular-nums;\n  font-size: 10px;\n  font-weight: 660;\n  text-align: right;\n}\n\n.dsh-skyline-metrics-row {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.dsh-skyline-metric {\n  min-width: 0;\n  padding: 10px 12px;\n  border: 1px solid var(--sky-border);\n  border-radius: 12px;\n  background: rgba(15, 21, 35, .62);\n}\n\n.dsh-skyline-metric-value,\n.dsh-skyline-metric-label { display: block; }\n.dsh-skyline-metric-value { color: var(--sky-text); font-size: 18px; font-weight: 750; letter-spacing: -.025em; }\n.dsh-skyline-metric-label { margin-top: 3px; overflow: hidden; color: var(--sky-muted); font-size: 9.5px; font-weight: 620; text-overflow: ellipsis; white-space: nowrap; }\n\n.dsh-skyline-controls {\n  min-height: 0;\n  padding: 16px;\n  overflow: auto;\n  border-left: 1px solid var(--sky-border);\n  background:\n    linear-gradient(180deg, rgba(124,157,255,.035), transparent 160px),\n    #0b101b;\n}\n\n.dsh-skyline-control-section + .dsh-skyline-control-section { margin-top: 17px; }\n.dsh-skyline-section-kicker,\n.dsh-skyline-field-label {\n  display: block;\n  margin-bottom: 8px;\n  color: var(--sky-muted);\n  font-size: 9px;\n  font-weight: 760;\n  letter-spacing: .12em;\n  text-transform: uppercase;\n}\n\n.dsh-skyline-identity-card {\n  display: grid;\n  gap: 4px;\n  padding: 13px;\n  border: 1px solid rgba(124,157,255,.2);\n  border-radius: 13px;\n  background:\n    radial-gradient(circle at 90% 10%, rgba(156,124,255,.12), transparent 42%),\n    rgba(124,157,255,.055);\n}\n\n.dsh-skyline-city-code {\n  color: var(--sky-accent);\n  font-size: 9px;\n  font-weight: 760;\n  letter-spacing: .14em;\n}\n\n.dsh-skyline-identity-card strong { color: var(--sky-text); font-size: 14px; font-weight: 720; }\n.dsh-skyline-identity-card > span:last-child { color: var(--sky-muted); font-size: 10px; line-height: 1.45; }\n\n.dsh-skyline-input {\n  box-sizing: border-box;\n  width: 100%;\n  height: 36px;\n  padding: 0 11px;\n  border: 1px solid var(--sky-border);\n  border-radius: 10px;\n  background: rgba(255,255,255,.035);\n  color: var(--sky-text);\n  font: inherit;\n  font-size: 11px;\n  transition: .18s ease;\n}\n\n.dsh-skyline-input:hover { border-color: var(--sky-border-strong); }\n.dsh-skyline-input::placeholder { color: #647086; }\n.dsh-skyline-field-hint { margin: 7px 1px 0; color: #68768f; font-size: 9px; line-height: 1.5; }\n\n.dsh-skyline-theme-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }\n.dsh-skyline-theme {\n  position: relative;\n  display: flex;\n  height: 35px;\n  padding: 5px;\n  gap: 2px;\n  align-items: flex-end;\n  justify-content: center;\n  overflow: hidden;\n  border: 1px solid var(--sky-border);\n  border-radius: 9px;\n  background: #080c15;\n  cursor: pointer;\n  transition: .18s ease;\n}\n\n.dsh-skyline-theme:hover { transform: translateY(-1px); border-color: var(--sky-border-strong); }\n.dsh-skyline-theme[data-active=\"true\"] { border-color: var(--sky-accent); box-shadow: 0 0 0 2px rgba(124,157,255,.12); }\n.dsh-skyline-theme span { display: block; width: 5px; border-radius: 1.5px 1.5px 0 0; }\n.dsh-skyline-theme span:nth-child(1) { height: 12px; }\n.dsh-skyline-theme span:nth-child(2) { height: 20px; }\n.dsh-skyline-theme span:nth-child(3) { height: 16px; }\n.dsh-skyline-theme[data-theme=\"midnight\"] { background: linear-gradient(#10172a,#070a12); }\n.dsh-skyline-theme[data-theme=\"midnight\"] span { background: #7c9dff; }\n.dsh-skyline-theme[data-theme=\"aurora\"] { background: linear-gradient(#12233a,#071713); }\n.dsh-skyline-theme[data-theme=\"aurora\"] span { background: #5de4b7; }\n.dsh-skyline-theme[data-theme=\"sunset\"] { background: linear-gradient(#3b1836,#160a16); }\n.dsh-skyline-theme[data-theme=\"sunset\"] span { background: #ff8f70; }\n.dsh-skyline-theme[data-theme=\"paper\"] { background: linear-gradient(#eee9df,#d6d0c4); }\n.dsh-skyline-theme[data-theme=\"paper\"] span { background: #315beb; }\n\n.dsh-skyline-landmarks { display: flex; flex-wrap: wrap; gap: 5px; }\n.dsh-skyline-landmarks > span {\n  padding: 5px 7px;\n  border: 1px solid rgba(255,184,107,.17);\n  border-radius: 7px;\n  background: rgba(255,184,107,.055);\n  color: #e6c49d;\n  font-size: 8.5px;\n  font-weight: 620;\n}\n.dsh-skyline-landmarks > .dsh-skyline-landmark-locked { color: #657086; border-color: var(--sky-border); background: transparent; letter-spacing: .3em; }\n\n.dsh-skyline-export-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 7px;\n  margin-top: 20px;\n}\n\n.dsh-skyline-primary-button,\n.dsh-skyline-secondary-button {\n  display: inline-flex;\n  min-height: 36px;\n  padding: 8px 10px;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  border-radius: 10px;\n  color: var(--sky-text);\n  font: inherit;\n  font-size: 10px;\n  font-weight: 680;\n  cursor: pointer;\n  transition: .18s ease;\n}\n\n.dsh-skyline-primary-button {\n  border: 1px solid rgba(124,157,255,.6);\n  background: linear-gradient(135deg, #607fdf, #765bd2);\n  box-shadow: 0 10px 24px rgba(75, 93, 185, .22);\n}\n.dsh-skyline-primary-button:hover { filter: brightness(1.08); transform: translateY(-1px); }\n.dsh-skyline-secondary-button { border: 1px solid var(--sky-border); background: rgba(255,255,255,.035); }\n.dsh-skyline-secondary-button:hover { border-color: var(--sky-border-strong); background: rgba(255,255,255,.06); }\n.dsh-skyline-primary-button svg,\n.dsh-skyline-secondary-button svg { width: 15px; height: 15px; }\n.dsh-skyline-copy-button { grid-column: 1 / -1; }\n\n.dsh-skyline-reset {\n  width: 100%;\n  margin-top: 10px;\n  padding: 7px 8px;\n  border: 0;\n  background: transparent;\n  color: #67738b;\n  font: inherit;\n  font-size: 9px;\n  cursor: pointer;\n}\n.dsh-skyline-reset:hover:not(:disabled) { color: #b8c2d6; }\n.dsh-skyline-reset:disabled { opacity: .36; cursor: default; }\n\n.dsh-skyline-footer {\n  display: flex;\n  min-height: 44px;\n  padding: 10px 18px;\n  align-items: center;\n  gap: 9px;\n  border-top: 1px solid var(--sky-border);\n  background: #090d16;\n  color: #69768f;\n  font-size: 9.5px;\n  line-height: 1.45;\n}\n.dsh-skyline-footer-shield { color: #65e6b4; font-size: 9px; }\n\n.dsh-skyline-toast {\n  position: absolute;\n  left: 50%;\n  bottom: 56px;\n  z-index: 3;\n  padding: 9px 13px;\n  border: 1px solid rgba(124,157,255,.3);\n  border-radius: 10px;\n  background: rgba(18, 25, 42, .95);\n  color: var(--sky-text);\n  box-shadow: 0 14px 44px rgba(0,0,0,.38);\n  font-size: 10px;\n  font-weight: 650;\n  transform: translateX(-50%);\n  animation: dsh-skyline-toast-in .22s ease both;\n}\n@keyframes dsh-skyline-toast-in { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 1; transform: translate(-50%, 0); } }\n\n@keyframes sky-rise {\n  from { opacity: 0; transform: translateY(18px) scale(.96); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n.dsh-skyline-stage-art [data-reveal=\"true\"] {\n  transform-box: fill-box;\n  transform-origin: center bottom;\n  animation: sky-rise .42s cubic-bezier(.2,.8,.2,1) both;\n}\n\n@media (max-width: 1080px) {\n  .dsh-skyline-panel { height: min(960px, 96vh); }\n  .dsh-skyline-body { grid-template-columns: minmax(0, 1fr) 270px; }\n  .dsh-skyline-stage-column { padding: 12px; }\n  .dsh-skyline-controls { padding: 13px; }\n  .dsh-skyline-metrics-row { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (max-width: 760px) {\n  .dsh-skyline-backdrop { padding: 0; }\n  .dsh-skyline-panel { width: 100vw; height: 100dvh; min-height: 0; border: 0; border-radius: 0; }\n  .dsh-skyline-header { min-height: 62px; padding: 10px 12px; }\n  .dsh-skyline-brand-mark { width: 34px; height: 34px; }\n  .dsh-skyline-brand p { display: none; }\n  .dsh-skyline-privacy { display: none; }\n  .dsh-skyline-tabs { overflow-x: auto; padding-inline: 10px; }\n  .dsh-skyline-tab { white-space: nowrap; }\n  .dsh-skyline-body { display: block; overflow: auto; }\n  .dsh-skyline-stage-column { min-height: auto; overflow: visible; }\n  .dsh-skyline-stage { min-height: 240px; border-radius: 13px; }\n  .dsh-skyline-stage-art svg { min-height: 240px; }\n  .dsh-skyline-player { grid-template-columns: auto 1fr; }\n  .dsh-skyline-scrubber { grid-template-columns: 1fr; gap: 4px; }\n  .dsh-skyline-progress { display: none; }\n  .dsh-skyline-controls { overflow: visible; border-top: 1px solid var(--sky-border); border-left: 0; }\n  .dsh-skyline-footer { position: sticky; bottom: 0; z-index: 2; }\n  .dsh-skyline-trigger-label { display: none; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dsh-skyline-backdrop,\n  .dsh-skyline-panel,\n  .dsh-skyline-toast,\n  .dsh-skyline-live-dot,\n  .dsh-skyline-stage .sky-building {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n";
    const CORE = (() => {
    /**
     * Pure, dependency-free data and rendering core for dsh-agent-skyline.
     *
     * Privacy contract: normalized events and rendered assets never retain prompt
     * text, tool arguments, file paths, command text, model output, or workspace
     * names. Only coarse categories, outcomes, durations, and timestamps survive.
     */

    const SKYLINE_SCHEMA_VERSION = 1
    const HISTORY_STORAGE_KEY = 'dsh-agent-skyline:history:v1'

    const CATEGORY_ORDER = [
      'file', 'shell', 'test', 'web', 'agent', 'vision', 'reasoning', 'conversation', 'other',
    ]

    const CATEGORY_META = {
      file: { label: 'Build', short: 'BLD', icon: '▦' },
      shell: { label: 'Run', short: 'RUN', icon: '⌁' },
      test: { label: 'Verify', short: 'TST', icon: '✓' },
      web: { label: 'Explore', short: 'WEB', icon: '⌕' },
      agent: { label: 'Orchestrate', short: 'AGT', icon: '◇' },
      vision: { label: 'See', short: 'VIS', icon: '◉' },
      reasoning: { label: 'Think', short: 'RSN', icon: '◌' },
      conversation: { label: 'Direct', short: 'DIR', icon: '↗' },
      other: { label: 'Other', short: 'ETC', icon: '·' },
    }

    const THEMES = {
      midnight: {
        id: 'midnight', name: 'Midnight',
        background: '#070A12', background2: '#10172A', ground: '#111B2D', grid: '#20304A',
        text: '#F4F7FF', muted: '#8D9BB4', accent: '#7C9DFF', accent2: '#9B7CFF', glow: '#6F8CFF',
        success: '#65E6B4', danger: '#FF6F91', panel: '#0C1220',
        category: {
          file: '#78A6FF', shell: '#A889FF', test: '#59DFB0', web: '#57C7FF', agent: '#FFB86B',
          vision: '#FF7CD8', reasoning: '#B8C4DF', conversation: '#89F0E1', other: '#78869F',
        },
      },
      aurora: {
        id: 'aurora', name: 'Aurora',
        background: '#071713', background2: '#12233A', ground: '#102723', grid: '#24423C',
        text: '#F1FFF9', muted: '#8EB6AA', accent: '#5DE4B7', accent2: '#68A9FF', glow: '#53D9B0',
        success: '#80F0BE', danger: '#FF7890', panel: '#0A1D19',
        category: {
          file: '#6AB4FF', shell: '#A68BFF', test: '#63E7AE', web: '#5DE0E6', agent: '#FFC66D',
          vision: '#FF80CC', reasoning: '#B6D8D0', conversation: '#86F5D7', other: '#789A91',
        },
      },
      sunset: {
        id: 'sunset', name: 'Sunset',
        background: '#160A16', background2: '#3B1836', ground: '#261529', grid: '#51304D',
        text: '#FFF7F2', muted: '#C5A0AF', accent: '#FF8F70', accent2: '#D77BFF', glow: '#FF846A',
        success: '#8FE2B0', danger: '#FF6685', panel: '#211020',
        category: {
          file: '#FF9A76', shell: '#C98DFF', test: '#83D9A9', web: '#6EC9FF', agent: '#FFD073',
          vision: '#FF80BF', reasoning: '#D6B7C8', conversation: '#A4E8D8', other: '#A38696',
        },
      },
      paper: {
        id: 'paper', name: 'Paper',
        background: '#EEE9DF', background2: '#DCD6C9', ground: '#D7D0C3', grid: '#BEB5A7',
        text: '#171A1F', muted: '#64666A', accent: '#315BEB', accent2: '#6E49B8', glow: '#315BEB',
        success: '#167C5A', danger: '#C3415D', panel: '#F7F3EA',
        category: {
          file: '#356CE2', shell: '#7955B7', test: '#248066', web: '#2589A3', agent: '#B46A1F',
          vision: '#B54886', reasoning: '#68717C', conversation: '#257E75', other: '#747474',
        },
      },
    }

    const TOOL_PATTERNS = {
      test: /(?:^|[\s._:/-])(test|tests|pytest|jest|vitest|playwright|cypress|spec|check|lint|typecheck|verify|validation|build)(?:$|[\s._:/-])/i,
      agent: /(?:^|[\s._:/-])(agent|subagent|delegate|workflow|team|teammate|spawn|orchestr|handoff)(?:$|[\s._:/-])/i,
      vision: /(?:^|[\s._:/-])(image|vision|screenshot|canvas|ocr|render|photo|video)(?:$|[\s._:/-])/i,
      web: /(?:^|[\s._:/-])(web|search|browser|fetch|http|crawl|scrape|url|open_page|click|navigate)(?:$|[\s._:/-])/i,
      file: /(?:^|[\s._:/-])(file|read|write|edit|patch|grep|glob|find|list_dir|directory|filesystem|repo|git_diff)(?:$|[\s._:/-])/i,
      shell: /(?:^|[\s._:/-])(shell|bash|terminal|exec|command|process|powershell|cmd|run)(?:$|[\s._:/-])/i,
    }

    const STATUS_FAILURE = /fail|error|reject|cancel|abort|timeout|invalid|blocked/i
    const STATUS_SUCCESS = /success|complete|completed|done|pass|passed|resolved|closed|finish/i
    const STATUS_RUNNING = /run|running|pending|stream|active|progress|start/i

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value))
    }

    function numberOr(value, fallback = 0) {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }

    function firstNumber(...values) {
      for (const value of values) {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
      }
      return null
    }

    function firstString(...values) {
      for (const value of values) {
        if (typeof value === 'string' && value.trim()) return value.trim().slice(0, 160)
      }
      return ''
    }

    function dateMs(value) {
      if (value == null) return null
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value < 10_000_000_000 ? value * 1000 : value
      }
      const parsed = Date.parse(String(value))
      return Number.isFinite(parsed) ? parsed : null
    }

    function hashString(value) {
      let hash = 0x811c9dc5
      const text = String(value)
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index)
        hash = Math.imul(hash, 0x01000193)
      }
      return hash >>> 0
    }

    function mulberry32(seed) {
      let value = seed >>> 0
      return () => {
        value += 0x6D2B79F5
        let result = value
        result = Math.imul(result ^ (result >>> 15), result | 1)
        result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
        return ((result ^ (result >>> 14)) >>> 0) / 4294967296
      }
    }

    function escapeXml(value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
    }

    function toHex(value) {
      return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')
    }

    function mixHex(hex, target, ratio) {
      const source = hex.replace('#', '')
      const destination = target.replace('#', '')
      if (source.length !== 6 || destination.length !== 6) return hex
      const amount = clamp(ratio, 0, 1)
      const components = [0, 2, 4].map(offset => {
        const from = Number.parseInt(source.slice(offset, offset + 2), 16)
        const to = Number.parseInt(destination.slice(offset, offset + 2), 16)
        return toHex(from + (to - from) * amount)
      })
      return `#${components.join('')}`
    }

    function normalizeToolName(node) {
      return firstString(
        node?.toolName,
        node?.tool_name,
        node?.tool?.name,
        node?.call?.name,
        node?.action?.name,
        node?.data?.toolName,
        node?.data?.tool_name,
        node?.meta?.toolName,
        node?.name,
      ).toLowerCase()
    }

    function normalizeKind(node) {
      return firstString(node?.kind, node?.type, node?.role, node?.event, node?.data?.kind).toLowerCase()
    }

    function classifyEvent(kind, toolName) {
      const signal = `${kind} ${toolName}`
      for (const category of ['test', 'agent', 'vision', 'web', 'file', 'shell']) {
        if (TOOL_PATTERNS[category].test(signal)) return category
      }
      if (/reason|thinking|analysis|assistant|model|llm|step/.test(kind)) return 'reasoning'
      if (/user|message|turn|prompt|conversation/.test(kind)) return 'conversation'
      return 'other'
    }

    function eventOutcome(node) {
      const status = firstString(
        node?.status,
        node?.state,
        node?.phase,
        node?.result?.status,
        node?.data?.status,
        node?.meta?.status,
      ).toLowerCase()
      const hasError = Boolean(node?.error || node?.result?.error || node?.data?.error)
      if (hasError || STATUS_FAILURE.test(status)) return 'failure'
      if (STATUS_SUCCESS.test(status)) return 'success'
      if (STATUS_RUNNING.test(status)) return 'running'
      return 'neutral'
    }

    function eventDuration(node) {
      const direct = firstNumber(node?.durationMs, node?.duration_ms, node?.elapsedMs, node?.data?.durationMs)
      if (direct != null) return clamp(Math.round(direct), 0, 86_400_000)
      const started = dateMs(node?.startedAt ?? node?.startTime ?? node?.createdAt ?? node?.timestamp)
      const ended = dateMs(node?.endedAt ?? node?.endTime ?? node?.updatedAt)
      if (started != null && ended != null && ended >= started) return clamp(Math.round(ended - started), 0, 86_400_000)
      return 0
    }

    function eventTimestamp(node, index, baseTime) {
      const value = dateMs(
        node?.timestamp ?? node?.createdAt ?? node?.startedAt ?? node?.time
          ?? node?.data?.timestamp ?? node?.meta?.timestamp,
      )
      return value == null ? baseTime + index * 1000 : value
    }

    /**
     * Convert arbitrary DSH chat/projection nodes into a deliberately lossy event
     * stream. Raw text and arguments are never copied into the result.
     */
    function normalizeSessionNodes(nodes, options = {}) {
      const list = Array.isArray(nodes) ? nodes : []
      const baseTime = numberOr(options.baseTime, Date.UTC(2026, 0, 1))
      return list.map((node, index) => {
        const kind = normalizeKind(node)
        const toolName = normalizeToolName(node)
        const category = classifyEvent(kind, toolName)
        const outcome = eventOutcome(node)
        const timestamp = eventTimestamp(node, index, baseTime)
        const durationMs = eventDuration(node)
        const toolLike = Boolean(toolName) || ['file', 'shell', 'test', 'web', 'agent', 'vision'].includes(category)
        const fingerprint = `${category}|${outcome}|${Math.floor(timestamp / 1000)}|${durationMs}|${index}`
        return Object.freeze({
          id: `evt_${hashString(fingerprint).toString(36)}`,
          index,
          timestamp,
          durationMs,
          category,
          outcome,
          toolLike,
        })
      })
    }

    function emptyCategoryCounts() {
      return Object.fromEntries(CATEGORY_ORDER.map(category => [category, 0]))
    }

    function calculateRecoveries(events) {
      let recoveries = 0
      const lastFailure = new Map()
      for (const event of events) {
        if (event.outcome === 'failure') lastFailure.set(event.category, event.index)
        if (event.outcome === 'success' && lastFailure.has(event.category)) {
          const failureIndex = lastFailure.get(event.category)
          if (event.index - failureIndex <= 8) {
            recoveries += 1
            lastFailure.delete(event.category)
          }
        }
      }
      return recoveries
    }

    function calculateActiveMinutes(events) {
      if (!events.length) return 0
      const sorted = [...events].sort((left, right) => left.timestamp - right.timestamp)
      let activeMs = sorted.reduce((sum, event) => sum + event.durationMs, 0)
      for (let index = 1; index < sorted.length; index += 1) {
        const gap = sorted[index].timestamp - sorted[index - 1].timestamp
        activeMs += clamp(gap, 0, 120_000)
      }
      return Math.max(1, Math.round(activeMs / 60_000))
    }

    function summarizeEvents(events) {
      const safeEvents = Array.isArray(events) ? events : []
      const categoryCounts = emptyCategoryCounts()
      const outcomeCounts = { success: 0, failure: 0, running: 0, neutral: 0 }
      let toolEvents = 0
      let durationMs = 0
      for (const event of safeEvents) {
        const category = CATEGORY_ORDER.includes(event.category) ? event.category : 'other'
        categoryCounts[category] += 1
        const outcome = Object.hasOwn(outcomeCounts, event.outcome) ? event.outcome : 'neutral'
        outcomeCounts[outcome] += 1
        if (event.toolLike) toolEvents += 1
        durationMs += clamp(numberOr(event.durationMs), 0, 86_400_000)
      }
      const usedCategories = CATEGORY_ORDER.filter(category => categoryCounts[category] > 0)
      const dominantCategory = safeEvents.length
        ? [...CATEGORY_ORDER].sort((left, right) => categoryCounts[right] - categoryCounts[left] || CATEGORY_ORDER.indexOf(left) - CATEGORY_ORDER.indexOf(right))[0]
        : 'other'
      const recoveries = calculateRecoveries(safeEvents)
      const activeMinutes = calculateActiveMinutes(safeEvents)
      const completionRate = safeEvents.length
        ? Math.round((outcomeCounts.success / Math.max(1, outcomeCounts.success + outcomeCounts.failure)) * 100)
        : 0
      const complexity = clamp(Math.round(
        safeEvents.length * 0.8
          + toolEvents * 1.25
          + usedCategories.length * 6
          + categoryCounts.agent * 4
          + recoveries * 5,
      ), 0, 999)
      return Object.freeze({
        totalEvents: safeEvents.length,
        toolEvents,
        categoryCounts: Object.freeze(categoryCounts),
        outcomeCounts: Object.freeze(outcomeCounts),
        uniqueCategories: usedCategories.length,
        dominantCategory,
        recoveries,
        activeMinutes,
        durationMs,
        completionRate,
        complexity,
        startedAt: safeEvents.length ? Math.min(...safeEvents.map(event => event.timestamp)) : null,
        endedAt: safeEvents.length ? Math.max(...safeEvents.map(event => event.timestamp)) : null,
      })
    }

    function createSessionSnapshot(nodes, options = {}) {
      const events = normalizeSessionNodes(nodes, options)
      const metrics = summarizeEvents(events)
      const sessionKey = firstString(options.sessionKey) || `session-${hashString(events.map(event => event.id).join('|')).toString(36)}`
      return Object.freeze({
        schemaVersion: SKYLINE_SCHEMA_VERSION,
        sessionKey: `s_${hashString(sessionKey).toString(36)}`,
        capturedAt: numberOr(options.capturedAt, Date.now()),
        metrics,
      })
    }

    function opaqueSessionKey(value, fallback) {
      const candidate = firstString(value)
      if (/^s_[a-z0-9]+$/i.test(candidate)) return candidate
      return `s_${hashString(candidate || String(fallback)).toString(36)}`
    }

    function sanitizeSnapshot(snapshot) {
      const counts = emptyCategoryCounts()
      for (const category of CATEGORY_ORDER) counts[category] = clamp(Math.round(numberOr(snapshot?.metrics?.categoryCounts?.[category])), 0, 1_000_000)
      const totalEvents = Object.values(counts).reduce((sum, value) => sum + value, 0)
      return {
        schemaVersion: SKYLINE_SCHEMA_VERSION,
        sessionKey: opaqueSessionKey(snapshot?.sessionKey, snapshot?.capturedAt),
        capturedAt: numberOr(snapshot?.capturedAt, Date.now()),
        metrics: {
          totalEvents,
          toolEvents: clamp(Math.round(numberOr(snapshot?.metrics?.toolEvents)), 0, totalEvents),
          categoryCounts: counts,
          outcomeCounts: {
            success: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.success)), 0, totalEvents),
            failure: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.failure)), 0, totalEvents),
            running: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.running)), 0, totalEvents),
            neutral: clamp(Math.round(numberOr(snapshot?.metrics?.outcomeCounts?.neutral)), 0, totalEvents),
          },
          uniqueCategories: CATEGORY_ORDER.filter(category => counts[category] > 0).length,
          dominantCategory: CATEGORY_ORDER.includes(snapshot?.metrics?.dominantCategory) ? snapshot.metrics.dominantCategory : 'other',
          recoveries: clamp(Math.round(numberOr(snapshot?.metrics?.recoveries)), 0, totalEvents),
          activeMinutes: clamp(Math.round(numberOr(snapshot?.metrics?.activeMinutes)), 0, 1_000_000),
          durationMs: clamp(Math.round(numberOr(snapshot?.metrics?.durationMs)), 0, 31_536_000_000),
          completionRate: clamp(Math.round(numberOr(snapshot?.metrics?.completionRate)), 0, 100),
          complexity: clamp(Math.round(numberOr(snapshot?.metrics?.complexity)), 0, 1_000_000),
          startedAt: snapshot?.metrics?.startedAt == null ? null : numberOr(snapshot.metrics.startedAt),
          endedAt: snapshot?.metrics?.endedAt == null ? null : numberOr(snapshot.metrics.endedAt),
        },
      }
    }

    function createEmptyHistory() {
      return { schemaVersion: SKYLINE_SCHEMA_VERSION, sessions: {} }
    }

    function parseHistory(value) {
      if (!value) return createEmptyHistory()
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value
        if (!parsed || typeof parsed !== 'object') return createEmptyHistory()
        const sessions = {}
        for (const [key, snapshot] of Object.entries(parsed.sessions || {}).slice(-500)) {
          const safe = sanitizeSnapshot(snapshot)
          sessions[safe.sessionKey] = safe
        }
        return { schemaVersion: SKYLINE_SCHEMA_VERSION, sessions }
      } catch {
        return createEmptyHistory()
      }
    }

    function upsertHistory(history, snapshot, options = {}) {
      const current = parseHistory(history)
      const safe = sanitizeSnapshot(snapshot)
      const sessions = { ...current.sessions, [safe.sessionKey]: safe }
      const maxSessions = clamp(Math.round(numberOr(options.maxSessions, 180)), 1, 500)
      const ordered = Object.entries(sessions).sort(([, left], [, right]) => left.capturedAt - right.capturedAt)
      while (ordered.length > maxSessions) ordered.shift()
      return {
        schemaVersion: SKYLINE_SCHEMA_VERSION,
        sessions: Object.fromEntries(ordered),
      }
    }

    function summarizeHistory(history, options = {}) {
      const parsed = parseHistory(history)
      const now = numberOr(options.now, Date.now())
      const range = options.range || 'all'
      const startOfDay = new Date(now)
      startOfDay.setHours(0, 0, 0, 0)
      const threshold = range === 'today' ? startOfDay.getTime()
        : range === 'week' ? now - 7 * 86_400_000
          : Number.NEGATIVE_INFINITY
      const snapshots = Object.values(parsed.sessions).filter(snapshot => snapshot.capturedAt >= threshold)
      const categoryCounts = emptyCategoryCounts()
      const outcomeCounts = { success: 0, failure: 0, running: 0, neutral: 0 }
      let toolEvents = 0
      let recoveries = 0
      let activeMinutes = 0
      let durationMs = 0
      for (const snapshot of snapshots) {
        for (const category of CATEGORY_ORDER) categoryCounts[category] += numberOr(snapshot.metrics.categoryCounts[category])
        for (const outcome of Object.keys(outcomeCounts)) outcomeCounts[outcome] += numberOr(snapshot.metrics.outcomeCounts[outcome])
        toolEvents += numberOr(snapshot.metrics.toolEvents)
        recoveries += numberOr(snapshot.metrics.recoveries)
        activeMinutes += numberOr(snapshot.metrics.activeMinutes)
        durationMs += numberOr(snapshot.metrics.durationMs)
      }
      const totalEvents = Object.values(categoryCounts).reduce((sum, value) => sum + value, 0)
      const uniqueCategories = CATEGORY_ORDER.filter(category => categoryCounts[category] > 0).length
      const dominantCategory = totalEvents > 0
        ? [...CATEGORY_ORDER].sort((left, right) => categoryCounts[right] - categoryCounts[left] || CATEGORY_ORDER.indexOf(left) - CATEGORY_ORDER.indexOf(right))[0]
        : 'other'
      const completionRate = Math.round((outcomeCounts.success / Math.max(1, outcomeCounts.success + outcomeCounts.failure)) * 100)
      const complexity = clamp(Math.round(totalEvents * 0.8 + toolEvents * 1.25 + uniqueCategories * 6 + categoryCounts.agent * 4 + recoveries * 5), 0, 1_000_000)
      return {
        snapshotCount: snapshots.length,
        metrics: {
          totalEvents, toolEvents, categoryCounts, outcomeCounts, uniqueCategories, dominantCategory,
          recoveries, activeMinutes, durationMs, completionRate, complexity,
          startedAt: snapshots.length ? Math.min(...snapshots.map(snapshot => snapshot.capturedAt)) : null,
          endedAt: snapshots.length ? Math.max(...snapshots.map(snapshot => snapshot.capturedAt)) : null,
        },
      }
    }

    function spiralCells(limit) {
      const cells = [{ x: 0, y: 0 }]
      for (let radius = 1; cells.length < limit; radius += 1) {
        for (let x = -radius; x <= radius && cells.length < limit; x += 1) cells.push({ x, y: -radius })
        for (let y = -radius + 1; y <= radius && cells.length < limit; y += 1) cells.push({ x: radius, y })
        for (let x = radius - 1; x >= -radius && cells.length < limit; x -= 1) cells.push({ x, y: radius })
        for (let y = radius - 1; y >= -radius + 1 && cells.length < limit; y -= 1) cells.push({ x: -radius, y })
      }
      return cells
    }

    function allocateBuildingCounts(metrics, limit) {
      const weighted = CATEGORY_ORDER
        .map(category => ({ category, count: numberOr(metrics.categoryCounts?.[category]) }))
        .filter(item => item.count > 0)
      if (!weighted.length) return [{ category: 'reasoning', count: 1, sourceCount: 0 }]
      const total = weighted.reduce((sum, item) => sum + Math.sqrt(item.count), 0)
      const allocations = weighted.map(item => ({
        category: item.category,
        count: Math.max(1, Math.floor((Math.sqrt(item.count) / total) * limit)),
        sourceCount: item.count,
      }))
      let allocated = allocations.reduce((sum, item) => sum + item.count, 0)
      let cursor = 0
      while (allocated < limit) {
        allocations[cursor % allocations.length].count += 1
        allocated += 1
        cursor += 1
      }
      while (allocated > limit) {
        const candidate = [...allocations].sort((left, right) => right.count - left.count)[0]
        if (candidate.count <= 1) break
        candidate.count -= 1
        allocated -= 1
      }
      return allocations
    }

    function identityFor(metrics, seed) {
      const dominant = metrics.dominantCategory || 'reasoning'
      const base = {
        file: ['The Builder', 'Code Foundry'],
        shell: ['The Operator', 'Runtime Quarter'],
        test: ['The Verifier', 'Proof District'],
        web: ['The Explorer', 'Horizon Port'],
        agent: ['The Conductor', 'Constellation Hub'],
        vision: ['The Observer', 'Prism Ward'],
        reasoning: ['The Architect', 'Thought Spire'],
        conversation: ['The Director', 'Signal Plaza'],
        other: ['The Polymath', 'Open Quarter'],
      }[dominant] || ['The Polymath', 'Open Quarter']
      const adjectives = ['Luminous', 'Quiet', 'Infinite', 'Electric', 'Resilient', 'Lucid', 'Midnight', 'Kinetic']
      const nouns = ['Arcology', 'Harbor', 'Citadel', 'Metropolis', 'Grid', 'District', 'Skyline', 'Nexus']
      const rand = mulberry32(seed ^ 0xA53C91)
      return {
        archetype: metrics.uniqueCategories >= 6 ? 'The Polymath' : base[0],
        district: base[1],
        cityName: `${adjectives[Math.floor(rand() * adjectives.length)]} ${nouns[Math.floor(rand() * nouns.length)]}`,
        code: seed.toString(36).toUpperCase().padStart(7, '0').slice(-7),
      }
    }

    function landmarkList(metrics) {
      const landmarks = []
      if (metrics.totalEvents >= 12) landmarks.push({ id: 'signal-spire', label: 'Signal Spire' })
      if (metrics.toolEvents >= 20) landmarks.push({ id: 'tool-exchange', label: 'Tool Exchange' })
      if (numberOr(metrics.categoryCounts?.agent) >= 2) landmarks.push({ id: 'agent-hub', label: 'Agent Hub' })
      if (metrics.recoveries >= 1) landmarks.push({ id: 'phoenix-tower', label: 'Phoenix Tower' })
      if (metrics.uniqueCategories >= 6) landmarks.push({ id: 'polymath-plaza', label: 'Polymath Plaza' })
      if (metrics.completionRate >= 90 && metrics.totalEvents >= 10) landmarks.push({ id: 'green-beacon', label: 'Green Beacon' })
      return landmarks
    }

    function generateBuildings(metrics, seedInput = 1, options = {}) {
      if (numberOr(metrics?.totalEvents) <= 0) return []
      const seed = hashString(`${seedInput}|${metrics.totalEvents}|${metrics.complexity}|${metrics.dominantCategory}`)
      const rand = mulberry32(seed)
      const maxBuildings = clamp(Math.round(numberOr(options.maxBuildings, 48)), 8, 72)
      const eventCount = Math.max(1, Math.round(numberOr(metrics.totalEvents)))
      const growthCurve = Math.max(1, Math.round(1 + Math.sqrt(Math.max(0, eventCount - 1)) * 5))
      const desired = Math.min(eventCount, maxBuildings, growthCurve)
      const allocations = allocateBuildingCounts(metrics, desired)
      const categoryPool = allocations.flatMap(item => Array.from({ length: item.count }, () => item))
      for (let index = categoryPool.length - 1; index > 0; index -= 1) {
        const target = Math.floor(rand() * (index + 1))
        ;[categoryPool[index], categoryPool[target]] = [categoryPool[target], categoryPool[index]]
      }
      const cells = spiralCells(categoryPool.length + 1).slice(1)
      const buildings = categoryPool.map((allocation, index) => {
        const cell = cells[index]
        const sourceStrength = Math.log2(allocation.sourceCount + 1)
        const centerBonus = Math.max(0, 4 - Math.max(Math.abs(cell.x), Math.abs(cell.y))) * 8
        const height = Math.round(clamp(34 + sourceStrength * 13 + centerBonus + rand() * 42, 36, 176))
        const footprint = 28 + Math.round(rand() * 12)
        const depth = 18 + Math.round(rand() * 10)
        const statusBias = metrics.outcomeCounts?.failure > 0 && rand() < Math.min(0.3, metrics.outcomeCounts.failure / Math.max(1, metrics.totalEvents))
        return {
          id: `b_${index}_${hashString(`${seed}:${index}:${allocation.category}`).toString(36)}`,
          index,
          category: allocation.category,
          gridX: cell.x,
          gridY: cell.y,
          height,
          footprint,
          depth,
          windows: clamp(Math.round(height / 16), 2, 10),
          status: statusBias ? 'failure' : 'success',
          crown: rand() > 0.72,
          antenna: ['web', 'agent', 'reasoning'].includes(allocation.category) && rand() > 0.52,
          seed: Math.floor(rand() * 1_000_000),
        }
      })
      return buildings.sort((left, right) => (left.gridX + left.gridY) - (right.gridX + right.gridY) || left.index - right.index)
    }

    function buildSkyline(input = {}) {
      const events = input.events || normalizeSessionNodes(input.nodes || [], { baseTime: input.baseTime })
      const metrics = input.metrics || summarizeEvents(events)
      const seedSource = firstString(input.seed, input.sessionKey) || events.map(event => event.id).join('|') || 'empty-city'
      const seed = hashString(seedSource)
      const identity = identityFor(metrics, seed)
      const buildings = generateBuildings(metrics, seed, input)
      return Object.freeze({
        schemaVersion: SKYLINE_SCHEMA_VERSION,
        seed,
        events,
        metrics,
        identity,
        buildings,
        landmarks: landmarkList(metrics),
        projectLabel: firstString(input.projectLabel).slice(0, 42) || 'PRIVATE PROJECT',
        rangeLabel: firstString(input.rangeLabel).slice(0, 30) || 'SESSION CITY',
      })
    }

    function buildSkylineFromMetrics(metrics, input = {}) {
      return buildSkyline({ ...input, metrics: sanitizeSnapshot({ metrics }).metrics, events: [] })
    }

    function isoPoint(gridX, gridY, centerX = 820, originY = 296) {
      return {
        x: centerX + (gridX - gridY) * 34,
        y: originY + (gridX + gridY) * 18,
      }
    }

    function polygon(points, attributes = '') {
      return `<polygon points="${points.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')}" ${attributes}/>`
    }

    function buildingSvg(building, theme, ordinal, visible, animateReveal) {
      const base = isoPoint(building.gridX, building.gridY)
      const width = building.footprint
      const depth = building.depth
      const height = building.height
      const top = { x: base.x, y: base.y - height }
      const topLeft = { x: top.x - width, y: top.y + width * 0.48 }
      const topRight = { x: top.x + depth, y: top.y + depth * 0.48 }
      const topFar = { x: top.x - width + depth, y: top.y + (width + depth) * 0.48 }
      const bottomLeft = { x: base.x - width, y: base.y + width * 0.48 }
      const bottomRight = { x: base.x + depth, y: base.y + depth * 0.48 }
      const bottomFar = { x: base.x - width + depth, y: base.y + (width + depth) * 0.48 }
      const color = theme.category[building.category] || theme.category.other
      const leftColor = mixHex(color, theme.background, 0.34)
      const rightColor = mixHex(color, theme.background, 0.5)
      const topColor = mixHex(color, '#FFFFFF', theme.id === 'paper' ? 0.08 : 0.22)
      const opacity = visible ? 1 : 0
      const transform = visible ? 'translate(0 0)' : 'translate(0 18px)'
      const revealStyle = animateReveal ? 'animation:sky-rise .42s cubic-bezier(.2,.8,.2,1) both' : ''
      let result = `<g class="sky-building" data-category="${building.category}" data-reveal="${animateReveal ? 'true' : 'false'}" style="opacity:${opacity};transform:${transform};transform-origin:${base.x}px ${base.y}px;${revealStyle}">`
      result += polygon([topLeft, topFar, bottomFar, bottomLeft], `fill="${leftColor}"`)
      result += polygon([topFar, topRight, bottomRight, bottomFar], `fill="${rightColor}"`)
      result += polygon([top, topRight, topFar, topLeft], `fill="${topColor}"`)
      const windowColor = building.status === 'failure' ? theme.danger : theme.success
      const rows = building.windows
      for (let row = 0; row < rows; row += 1) {
        const progress = (row + 1) / (rows + 1)
        const yLeft = topLeft.y + (bottomLeft.y - topLeft.y) * progress
        const xLeft = topLeft.x + 6
        const yRight = topRight.y + (bottomRight.y - topRight.y) * progress
        const xRight = topRight.x - 5
        const lit = hashString(`${building.seed}:${row}`) % 4 !== 0
        result += `<path d="M${xLeft} ${yLeft}l${Math.max(5, width - 12)} ${Math.max(2, width * .07)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="2" opacity="${lit ? .72 : .32}"/>`
        result += `<path d="M${xRight} ${yRight}l${-Math.max(4, depth - 10)} ${Math.max(2, depth * .07)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="2" opacity="${lit ? .58 : .28}"/>`
      }
      if (building.crown) {
        result += polygon([
          { x: top.x - width * .48, y: top.y + width * .25 },
          { x: top.x + depth * .52, y: top.y + depth * .25 },
          { x: top.x - width * .48 + depth, y: top.y + (width + depth) * .25 },
        ], `fill="none" stroke="${mixHex(color, '#FFFFFF', .34)}" stroke-width="2" opacity=".82"`)
      }
      if (building.antenna) {
        result += `<path d="M${top.x - width * .34 + depth * .34} ${top.y + (width + depth) * .17}v-${18 + (building.seed % 18)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`
        result += `<circle cx="${top.x - width * .34 + depth * .34}" cy="${top.y + (width + depth) * .17 - 20 - (building.seed % 18)}" r="2.5" fill="${theme.text}"/>`
      }
      result += '</g>'
      return result
    }

    function formatCompact(value) {
      return new Intl.NumberFormat('en', { notation: value >= 10_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value)
    }

    function formatMinutes(minutes) {
      if (minutes < 60) return `${minutes}m`
      const hours = Math.floor(minutes / 60)
      const rest = minutes % 60
      return rest ? `${hours}h ${rest}m` : `${hours}h`
    }

    function metricBlock(x, y, label, value, theme, width = 126) {
      return `<g transform="translate(${x} ${y})">
        <rect width="${width}" height="78" rx="16" fill="${theme.panel}" fill-opacity=".72" stroke="${theme.grid}"/>
        <text x="16" y="27" fill="${theme.muted}" font-size="11" font-weight="700" letter-spacing="1.4">${escapeXml(label)}</text>
        <text x="16" y="58" fill="${theme.text}" font-size="25" font-weight="760">${escapeXml(value)}</text>
      </g>`
    }

    function renderGround(theme) {
      const points = [isoPoint(-5, -5), isoPoint(6, -5), isoPoint(6, 6), isoPoint(-5, 6)]
      let svg = polygon(points, `fill="${theme.ground}" stroke="${theme.grid}" stroke-width="1.5"`)
      for (let index = -5; index <= 6; index += 1) {
        const fromA = isoPoint(index, -5)
        const toA = isoPoint(index, 6)
        const fromB = isoPoint(-5, index)
        const toB = isoPoint(6, index)
        svg += `<path d="M${fromA.x} ${fromA.y}L${toA.x} ${toA.y}M${fromB.x} ${fromB.y}L${toB.x} ${toB.y}" stroke="${theme.grid}" stroke-width="1" opacity=".48"/>`
      }
      return svg
    }

    function renderStars(seed, theme) {
      const rand = mulberry32(seed ^ 0xA1B2C3)
      let stars = ''
      for (let index = 0; index < 42; index += 1) {
        const x = 430 + rand() * 740
        const y = 32 + rand() * 260
        const radius = .5 + rand() * 1.8
        stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${theme.text}" opacity="${(.15 + rand() * .55).toFixed(2)}"/>`
      }
      return stars
    }

    function renderLegend(metrics, theme) {
      const used = CATEGORY_ORDER.filter(category => numberOr(metrics.categoryCounts?.[category]) > 0).slice(0, 6)
      return used.map((category, index) => {
        const x = 58 + (index % 3) * 112
        const y = 565 + Math.floor(index / 3) * 28
        const count = numberOr(metrics.categoryCounts?.[category])
        return `<g transform="translate(${x} ${y})">
          <rect width="9" height="9" rx="3" y="-8" fill="${theme.category[category]}"/>
          <text x="16" y="0" fill="${theme.muted}" font-size="11" font-weight="650">${escapeXml(CATEGORY_META[category].short)} ${formatCompact(count)}</text>
        </g>`
      }).join('')
    }

    /** Render a self-contained, screenshot-ready SVG. */
    function renderSkylineSvg(model, options = {}) {
      const theme = THEMES[options.theme] || THEMES.midnight
      const width = 1200
      const height = 720
      const visibleCount = clamp(Math.round(numberOr(options.visibleCount, model.buildings.length)), 0, model.buildings.length)
      const metrics = model.metrics
      const title = firstString(options.title) || model.identity.cityName
      const projectLabel = firstString(options.projectLabel, model.projectLabel).slice(0, 42) || 'PRIVATE PROJECT'
      const rangeLabel = firstString(options.rangeLabel, model.rangeLabel).slice(0, 30) || 'SESSION CITY'
      const subtitle = firstString(options.subtitle) || `${model.identity.archetype} · ${model.identity.district}`
      const buildingLayer = model.buildings.map((building, index) => buildingSvg(
        building,
        theme,
        index,
        index < visibleCount,
        Boolean(options.animateReveal) && visibleCount > 0 && index === visibleCount - 1,
      )).join('')
      const landmarkText = model.landmarks.slice(0, 3).map(item => item.label).join(' · ') || 'First block established'
      const paper = theme.id === 'paper'
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="sky-title sky-desc">
      <title id="sky-title">${escapeXml(title)} — Agent Skyline</title>
      <desc id="sky-desc">A privacy-safe procedural city generated from coarse Agent activity counts.</desc>
      <defs>
        <style>@keyframes sky-rise{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}@media (prefers-reduced-motion:reduce){.sky-building{animation:none!important}}</style>
        <linearGradient id="sky-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.background}"/><stop offset="1" stop-color="${theme.background2}"/></linearGradient>
        <radialGradient id="sky-halo" cx="70%" cy="42%" r="48%"><stop offset="0" stop-color="${theme.glow}" stop-opacity="${paper ? .13 : .24}"/><stop offset="1" stop-color="${theme.glow}" stop-opacity="0"/></radialGradient>
        <filter id="sky-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="${theme.background}" flood-opacity=".48"/></filter>
        <filter id="sky-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="32"/></filter>
        <clipPath id="sky-round"><rect x="0" y="0" width="1200" height="720" rx="30"/></clipPath>
      </defs>
      <g clip-path="url(#sky-round)">
        <rect width="1200" height="720" fill="url(#sky-bg)"/>
        <rect width="1200" height="720" fill="url(#sky-halo)"/>
        ${paper ? '' : renderStars(model.seed, theme)}
        <circle cx="865" cy="258" r="176" fill="${theme.glow}" opacity="${paper ? .06 : .09}" filter="url(#sky-soft)"/>
        <g opacity=".9" filter="url(#sky-shadow)">${renderGround(theme)}</g>
        <g>${buildingLayer}</g>
        <rect x="30" y="30" width="358" height="660" rx="24" fill="${theme.panel}" fill-opacity="${paper ? .82 : .7}" stroke="${theme.grid}"/>
        <g transform="translate(58 58)">
          <g transform="translate(0 0)">
            <rect width="34" height="34" rx="11" fill="${theme.accent}" fill-opacity=".18" stroke="${theme.accent}"/>
            <path d="M8 24V14l6-4 5 3 7-6v17M8 20h18" fill="none" stroke="${theme.accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <text x="48" y="14" fill="${theme.muted}" font-size="10" font-weight="760" letter-spacing="1.8">AGENT SKYLINE</text>
          <text x="48" y="32" fill="${theme.text}" font-size="12" font-weight="650">${escapeXml(rangeLabel)}</text>
        </g>
        <text x="58" y="142" fill="${theme.text}" font-size="38" font-weight="790" letter-spacing="-.8">${escapeXml(title)}</text>
        <text x="58" y="171" fill="${theme.accent}" font-size="14" font-weight="720">${escapeXml(subtitle)}</text>
        <text x="58" y="204" fill="${theme.muted}" font-size="11" font-weight="680" letter-spacing="1.2">${escapeXml(projectLabel.toUpperCase())}</text>
        ${metricBlock(58, 237, 'CITY BLOCKS', formatCompact(metrics.totalEvents), theme)}
        ${metricBlock(197, 237, 'ACTIVE TIME', formatMinutes(metrics.activeMinutes), theme)}
        ${metricBlock(58, 329, 'TOOL MOVES', formatCompact(metrics.toolEvents), theme)}
        ${metricBlock(197, 329, 'RECOVERIES', formatCompact(metrics.recoveries), theme)}
        <g transform="translate(58 437)">
          <text fill="${theme.muted}" font-size="10" font-weight="760" letter-spacing="1.5">CITY IDENTITY</text>
          <text y="28" fill="${theme.text}" font-size="17" font-weight="730">${escapeXml(model.identity.code)}</text>
          <rect x="0" y="45" width="302" height="1" fill="${theme.grid}"/>
          <text y="72" fill="${theme.muted}" font-size="10" font-weight="760" letter-spacing="1.5">UNLOCKED LANDMARKS</text>
          <text y="96" fill="${theme.text}" font-size="11.5" font-weight="620">${escapeXml(landmarkText)}</text>
        </g>
        ${renderLegend(metrics, theme)}
        <g transform="translate(58 626)">
          <rect width="302" height="1" fill="${theme.grid}"/>
          <text y="25" fill="${theme.muted}" font-size="10.5" font-weight="620">No prompts · no paths · no cloud</text>
          <text y="46" fill="${theme.text}" font-size="10.5" font-weight="700">github:LeemanCheung/dsh-agent-skyline</text>
        </g>
        <g transform="translate(1015 656)">
          <text text-anchor="end" fill="${theme.muted}" font-size="10" font-weight="700" letter-spacing="1">BUILT FROM SIGNALS, NOT CONTENT</text>
          <text x="124" text-anchor="end" y="22" fill="${theme.text}" font-size="12" font-weight="720">${visibleCount}/${model.buildings.length} TOWERS ONLINE</text>
        </g>
      </g>
      <rect x=".75" y=".75" width="1198.5" height="718.5" rx="29.25" fill="none" stroke="${theme.grid}" stroke-width="1.5"/>
    </svg>`
    }

    function buildShareCaption(model, options = {}) {
      const range = firstString(options.rangeLabel, model.rangeLabel) || 'session'
      return [
        `🏙️ ${model.identity.cityName} — my ${range.toLowerCase()} in DeepSeek Harness`,
        `${model.metrics.totalEvents} blocks · ${model.metrics.toolEvents} tool moves · ${model.metrics.recoveries} recoveries`,
        `${model.identity.archetype} · City ${model.identity.code}`,
        'Built locally with Agent Skyline (dsh-agent-skyline) — no prompts or file paths exported.',
      ].join('\n')
    }

    function dataUrlForSvg(svg) {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(svg))}`
    }

      return { SKYLINE_SCHEMA_VERSION, HISTORY_STORAGE_KEY, CATEGORY_ORDER, CATEGORY_META, THEMES, hashString, escapeXml, normalizeSessionNodes, summarizeEvents, createSessionSnapshot, createEmptyHistory, parseHistory, upsertHistory, summarizeHistory, generateBuildings, buildSkyline, buildSkylineFromMetrics, renderSkylineSvg, buildShareCaption, dataUrlForSvg };
    })();
    'use strict';

    const React = require('react');
    const ReactDOM = require('react-dom');
    const {
      createElement: h, useCallback, useEffect, useMemo, useRef, useState,
    } = React;

    const PACKAGE_ID = 'dsh-agent-skyline';
    const NS = 'agentSkyline';
    const HISTORY_KEY = CORE.HISTORY_STORAGE_KEY;
    const LABEL_KEY = 'dsh-agent-skyline:project-label';
    const THEME_KEY = 'dsh-agent-skyline:theme';
    const RANGE_OPTIONS = ['session', 'today', 'week', 'all'];
    const THEME_OPTIONS = ['midnight', 'aurora', 'sunset', 'paper'];

    const zh = {
      'title': 'Agent 天际线',
      'trigger.aria': '打开 Agent 天际线，共 {count} 个城市街区',
      'privacy': '本地生成 · 内容零外传',
      'status.live': '城市正在生长',
      'status.ready': '城市快照已就绪',
      'range.session': '本次会话',
      'range.today': '今天',
      'range.week': '近 7 天',
      'range.all': '全部历史',
      'range.session.short': 'SESSION CITY',
      'range.today.short': 'TODAY CITY',
      'range.week.short': '7-DAY CITY',
      'range.all.short': 'LEGACY CITY',
      'control.play': '播放建城',
      'control.pause': '暂停',
      'control.restart': '重新播放',
      'control.exportSvg': '导出 SVG',
      'control.exportPng': '导出 PNG',
      'control.copy': '复制分享文案',
      'control.copied': '分享文案已复制',
      'control.exported': '城市卡片已导出',
      'control.close': '关闭 Agent 天际线',
      'control.reset': '清除本地历史',
      'control.resetDone': '本地历史已清除',
      'control.resetConfirm': '清除 Agent 天际线保存在此浏览器中的全部历史？此操作不会影响 DSH 会话。',
      'label.title': '项目署名',
      'label.hint': '默认不读取项目名或路径，可自行填写公开名称。',
      'label.placeholder': 'PRIVATE PROJECT',
      'theme.title': '城市气候',
      'timeline.title': '建城进度',
      'metrics.blocks': '城市街区',
      'metrics.tools': '工具动作',
      'metrics.recoveries': '失败恢复',
      'metrics.time': '活跃分钟',
      'identity': '城市身份',
      'landmarks': '已解锁地标',
      'empty': '完成第一轮 Agent 工作后，这里会长出第一栋建筑。',
      'footer': '只使用类别、次数、状态与时间；不会导出提示词、回复、命令、文件路径或参数。',
    };

    const en = {
      'title': 'Agent Skyline',
      'trigger.aria': 'Open Agent Skyline with {count} city blocks',
      'privacy': 'Local-only · zero content export',
      'status.live': 'The city is growing',
      'status.ready': 'City snapshot ready',
      'range.session': 'This session',
      'range.today': 'Today',
      'range.week': 'Last 7 days',
      'range.all': 'All history',
      'range.session.short': 'SESSION CITY',
      'range.today.short': 'TODAY CITY',
      'range.week.short': '7-DAY CITY',
      'range.all.short': 'LEGACY CITY',
      'control.play': 'Play construction',
      'control.pause': 'Pause',
      'control.restart': 'Replay',
      'control.exportSvg': 'Export SVG',
      'control.exportPng': 'Export PNG',
      'control.copy': 'Copy share caption',
      'control.copied': 'Share caption copied',
      'control.exported': 'City card exported',
      'control.close': 'Close Agent Skyline',
      'control.reset': 'Clear local history',
      'control.resetDone': 'Local history cleared',
      'control.resetConfirm': 'Clear all Agent Skyline history stored in this browser? DSH sessions are not affected.',
      'label.title': 'Public project label',
      'label.hint': 'Project names and paths are never read automatically. Add a public label only when safe.',
      'label.placeholder': 'PRIVATE PROJECT',
      'theme.title': 'City climate',
      'timeline.title': 'Construction progress',
      'metrics.blocks': 'City blocks',
      'metrics.tools': 'Tool moves',
      'metrics.recoveries': 'Recoveries',
      'metrics.time': 'Active minutes',
      'identity': 'City identity',
      'landmarks': 'Unlocked landmarks',
      'empty': 'Complete the first Agent turn and your first building will appear here.',
      'footer': 'Only categories, counts, states, and timing are used. Prompts, replies, commands, paths, and arguments never enter exports.',
    };

    function sameArray(left, right) {
      if (left === right) return true;
      if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
      for (let index = 0; index < left.length; index += 1) if (left[index] !== right[index]) return false;
      return true;
    }

    function safeStorageGet(key, fallback = '') {
      try { return window.localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    }

    function safeStorageSet(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch { return false; }
    }

    function safeStorageRemove(key) {
      try { window.localStorage.removeItem(key); return true; } catch { return false; }
    }

    function formatCount(value) {
      try { return new Intl.NumberFormat().format(Number(value) || 0); } catch { return String(value || 0); }
    }

    function SkylineMark({ className }) {
      return h('svg', { className, viewBox: '0 0 22 22', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M2.5 18.5h17M4.5 18.5V10l4-2.5v11M10 18.5V5.5l4-2.5v15.5M15.5 18.5V9l3-1.7v11.2', stroke: 'currentColor', strokeWidth: 1.55, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { d: 'M6.2 12.2h.1M6.2 15h.1M12.2 8.3h.1M12.2 11.3h.1M12.2 14.3h.1M17.2 11.2h.1M17.2 14h.1', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' }));
    }

    function CloseMark() {
      return h('svg', { viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'm4 4 10 10M14 4 4 14', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }));
    }

    function PlayMark({ playing }) {
      return h('svg', { viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
        playing
          ? h(React.Fragment, null,
            h('rect', { x: 4.5, y: 3.5, width: 3.2, height: 11, rx: 1, fill: 'currentColor' }),
            h('rect', { x: 10.3, y: 3.5, width: 3.2, height: 11, rx: 1, fill: 'currentColor' }))
          : h('path', { d: 'm6 4 8 5-8 5z', fill: 'currentColor' }));
    }

    function DownloadMark() {
      return h('svg', { viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M9 2.8v8.4m0 0 3-3m-3 3-3-3M3.2 13v2h11.6v-2', stroke: 'currentColor', strokeWidth: 1.55, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function CopyMark() {
      return h('svg', { viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 5.8, y: 5.8, width: 8.4, height: 8.4, rx: 1.7, stroke: 'currentColor', strokeWidth: 1.45 }),
        h('path', { d: 'M11.7 5.8V3.6H3.6v8.1h2.2', stroke: 'currentColor', strokeWidth: 1.45, strokeLinecap: 'round' }));
    }

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    }

    function exportSvg(svg, filename) {
      downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename);
    }

    function exportPng(svg, filename) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 2400;
            canvas.height = 1440;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob((png) => {
              if (!png) { reject(new Error('PNG encoding failed')); return; }
              downloadBlob(png, filename);
              resolve();
            }, 'image/png', 0.96);
          } catch (error) {
            URL.revokeObjectURL(url);
            reject(error);
          }
        };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG rasterization failed')); };
        image.src = url;
      });
    }

    function MetricPill({ label, value }) {
      return h('div', { className: 'dsh-skyline-metric' },
        h('span', { className: 'dsh-skyline-metric-value' }, formatCount(value)),
        h('span', { className: 'dsh-skyline-metric-label' }, label));
    }

    function SkylineDialog({ close, model, setRange, range, theme, setTheme, label, setLabel, history, clearHistory, running, t }) {
      const [visibleCount, setVisibleCount] = useState(model.buildings.length);
      const [playing, setPlaying] = useState(false);
      const [notice, setNotice] = useState('');
      const panelRef = useRef(null);
      const noticeTimerRef = useRef(null);

      useEffect(() => {
        setVisibleCount(model.buildings.length);
        setPlaying(false);
      }, [model.seed, model.buildings.length]);

      useEffect(() => {
        if (!playing || model.buildings.length === 0) return undefined;
        const timer = window.setInterval(() => {
          setVisibleCount(current => {
            if (current >= model.buildings.length - 1) {
              window.clearInterval(timer);
              setPlaying(false);
              return model.buildings.length;
            }
            return current + 1;
          });
        }, 115);
        return () => window.clearInterval(timer);
      }, [playing, model.buildings.length]);

      useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          close();
        };
        document.addEventListener('keydown', onKeyDown);
        queueMicrotask(() => panelRef.current?.focus());
        return () => document.removeEventListener('keydown', onKeyDown);
      }, [close]);

      useEffect(() => () => { if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current); }, []);

      const showNotice = (message) => {
        setNotice(message);
        if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = window.setTimeout(() => setNotice(''), 2200);
      };

      const renderOptions = {
        theme,
        projectLabel: label || t('label.placeholder'),
        rangeLabel: t(`range.${range}.short`),
      };
      const svg = useMemo(() => CORE.renderSkylineSvg(model, {
        ...renderOptions,
        visibleCount,
        animateReveal: playing,
      }), [model, theme, visibleCount, playing, label, range, t]);
      const exportSvgText = useMemo(() => CORE.renderSkylineSvg(model, {
        ...renderOptions,
        visibleCount: model.buildings.length,
        animateReveal: false,
      }), [model, theme, label, range, t]);

      const filenameBase = `agent-skyline-${range}-${model.identity.code.toLowerCase()}`;
      const startPlayback = () => {
        if (model.buildings.length === 0) return;
        if (playing) { setPlaying(false); return; }
        if (visibleCount >= model.buildings.length) setVisibleCount(0);
        setPlaying(true);
      };
      const saveSvg = () => { exportSvg(exportSvgText, `${filenameBase}.svg`); showNotice(t('control.exported')); };
      const savePng = async () => {
        try { await exportPng(exportSvgText, `${filenameBase}.png`); showNotice(t('control.exported')); }
        catch { exportSvg(exportSvgText, `${filenameBase}.svg`); showNotice(t('control.exported')); }
      };
      const copyCaption = async () => {
        const caption = CORE.buildShareCaption(model, { rangeLabel: t(`range.${range}`) });
        try { await navigator.clipboard.writeText(caption); }
        catch {
          const area = document.createElement('textarea'); area.value = caption; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
        }
        showNotice(t('control.copied'));
      };
      const resetHistory = () => {
        if (!window.confirm(t('control.resetConfirm'))) return;
        clearHistory();
        showNotice(t('control.resetDone'));
      };

      return h('div', { className: 'dsh-skyline-backdrop', onPointerDown: event => { if (event.currentTarget === event.target) close(); } },
        h('section', { ref: panelRef, className: 'dsh-skyline-panel', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'dsh-skyline-title', tabIndex: -1 },
          h('header', { className: 'dsh-skyline-header' },
            h('div', { className: 'dsh-skyline-brand' },
              h('span', { className: 'dsh-skyline-brand-mark' }, h(SkylineMark)),
              h('div', null,
                h('h2', { id: 'dsh-skyline-title' }, t('title')),
                h('p', null, running ? t('status.live') : t('status.ready')))),
            h('div', { className: 'dsh-skyline-header-right' },
              h('span', { className: 'dsh-skyline-privacy' }, h('span', { 'aria-hidden': true }, '●'), t('privacy')),
              h('button', { type: 'button', className: 'dsh-skyline-icon-button', onClick: close, title: t('control.close'), 'aria-label': t('control.close') }, h(CloseMark)))),
          h('div', { className: 'dsh-skyline-tabs', role: 'tablist', 'aria-label': t('title') },
            RANGE_OPTIONS.map(option => h('button', {
              key: option, type: 'button', role: 'tab', 'aria-selected': range === option,
              className: 'dsh-skyline-tab', 'data-active': range === option ? 'true' : undefined,
              onClick: () => setRange(option),
            }, t(`range.${option}`)))),
          h('div', { className: 'dsh-skyline-body' },
            h('main', { className: 'dsh-skyline-stage-column' },
              h('div', { className: 'dsh-skyline-stage', 'data-theme': theme },
                h('div', { className: 'dsh-skyline-stage-art', dangerouslySetInnerHTML: { __html: svg } }),
                model.metrics.totalEvents === 0 ? h('p', { className: 'dsh-skyline-empty' }, t('empty')) : null),
              h('div', { className: 'dsh-skyline-player' },
                h('button', { type: 'button', className: 'dsh-skyline-play', onClick: startPlayback, disabled: model.buildings.length === 0 },
                  h(PlayMark, { playing }), h('span', null, playing ? t('control.pause') : visibleCount >= model.buildings.length ? t('control.restart') : t('control.play'))),
                h('label', { className: 'dsh-skyline-scrubber' },
                  h('span', null, t('timeline.title')),
                  h('input', {
                    type: 'range', min: 0, max: model.buildings.length, value: visibleCount,
                    disabled: model.buildings.length === 0,
                    onChange: event => { setPlaying(false); setVisibleCount(Number(event.target.value)); },
                    'aria-label': t('timeline.title'),
                  })),
                h('span', { className: 'dsh-skyline-progress' }, `${visibleCount}/${model.buildings.length}`)),
              h('div', { className: 'dsh-skyline-metrics-row' },
                h(MetricPill, { label: t('metrics.blocks'), value: model.metrics.totalEvents }),
                h(MetricPill, { label: t('metrics.tools'), value: model.metrics.toolEvents }),
                h(MetricPill, { label: t('metrics.recoveries'), value: model.metrics.recoveries }),
                h(MetricPill, { label: t('metrics.time'), value: model.metrics.activeMinutes }))),
            h('aside', { className: 'dsh-skyline-controls' },
              h('section', { className: 'dsh-skyline-control-section' },
                h('div', { className: 'dsh-skyline-section-kicker' }, t('identity')),
                h('div', { className: 'dsh-skyline-identity-card' },
                  h('span', { className: 'dsh-skyline-city-code' }, model.identity.code),
                  h('strong', null, model.identity.cityName),
                  h('span', null, `${model.identity.archetype} · ${model.identity.district}`))),
              h('section', { className: 'dsh-skyline-control-section' },
                h('label', { className: 'dsh-skyline-field-label', htmlFor: 'dsh-skyline-label' }, t('label.title')),
                h('input', {
                  id: 'dsh-skyline-label', className: 'dsh-skyline-input', value: label,
                  placeholder: t('label.placeholder'), maxLength: 42,
                  onChange: event => setLabel(event.target.value),
                }),
                h('p', { className: 'dsh-skyline-field-hint' }, t('label.hint'))),
              h('section', { className: 'dsh-skyline-control-section' },
                h('div', { className: 'dsh-skyline-section-kicker' }, t('theme.title')),
                h('div', { className: 'dsh-skyline-theme-grid' }, THEME_OPTIONS.map(option => h('button', {
                  key: option, type: 'button', className: 'dsh-skyline-theme',
                  'data-active': theme === option ? 'true' : undefined,
                  'data-theme': option, onClick: () => setTheme(option),
                  'aria-label': CORE.THEMES[option].name, title: CORE.THEMES[option].name,
                }, h('span', null), h('span', null), h('span', null))))),
              h('section', { className: 'dsh-skyline-control-section' },
                h('div', { className: 'dsh-skyline-section-kicker' }, t('landmarks')),
                h('div', { className: 'dsh-skyline-landmarks' },
                  model.landmarks.length
                    ? model.landmarks.map(item => h('span', { key: item.id }, item.label))
                    : h('span', { className: 'dsh-skyline-landmark-locked' }, '···'))),
              h('section', { className: 'dsh-skyline-export-grid' },
                h('button', { type: 'button', className: 'dsh-skyline-primary-button', onClick: savePng }, h(DownloadMark), t('control.exportPng')),
                h('button', { type: 'button', className: 'dsh-skyline-secondary-button', onClick: saveSvg }, h(DownloadMark), t('control.exportSvg')),
                h('button', { type: 'button', className: 'dsh-skyline-secondary-button dsh-skyline-copy-button', onClick: copyCaption }, h(CopyMark), t('control.copy'))),
              h('button', { type: 'button', className: 'dsh-skyline-reset', onClick: resetHistory, disabled: Object.keys(history.sessions || {}).length === 0 }, t('control.reset')))),
          h('footer', { className: 'dsh-skyline-footer' },
            h('span', { className: 'dsh-skyline-footer-shield', 'aria-hidden': true }, '◆'),
            h('span', null, t('footer'))),
          notice ? h('div', { className: 'dsh-skyline-toast', role: 'status' }, notice) : null));
    }

    function AgentSkylineAction({ sessionId, useSession, t }) {
      const chatNodes = useSession(state => state?.chat?.nodes?.values?.() || [], sameArray);
      const running = Boolean(useSession(state => state?.running));
      const [open, setOpen] = useState(false);
      const [range, setRange] = useState('session');
      const [theme, setThemeState] = useState(() => {
        const saved = safeStorageGet(THEME_KEY, 'midnight');
        return THEME_OPTIONS.includes(saved) ? saved : 'midnight';
      });
      const [label, setLabelState] = useState(() => safeStorageGet(LABEL_KEY, ''));
      const [history, setHistory] = useState(() => CORE.parseHistory(safeStorageGet(HISTORY_KEY, '')));
      const triggerRef = useRef(null);

      const events = useMemo(() => CORE.normalizeSessionNodes(chatNodes), [chatNodes]);
      const sessionSnapshot = useMemo(() => CORE.createSessionSnapshot(chatNodes, {
        sessionKey: sessionId,
        capturedAt: Date.now(),
      }), [chatNodes, sessionId]);

      useEffect(() => {
        if (!chatNodes.length) return;
        setHistory(current => {
          const next = CORE.upsertHistory(current, sessionSnapshot);
          safeStorageSet(HISTORY_KEY, JSON.stringify(next));
          return next;
        });
      }, [chatNodes.length, sessionSnapshot]);

      useEffect(() => { setRange('session'); }, [sessionId]);

      const currentModel = useMemo(() => {
        if (range === 'session') return CORE.buildSkyline({
          events,
          sessionKey: sessionId,
          projectLabel: label,
          rangeLabel: t('range.session.short'),
        });
        const summary = CORE.summarizeHistory(history, { range, now: Date.now() });
        const metricSignature = CORE.CATEGORY_ORDER.map(category => summary.metrics.categoryCounts[category] || 0).join(':');
        return CORE.buildSkylineFromMetrics(summary.metrics, {
          seed: `${range}:${summary.snapshotCount}:${metricSignature}:${summary.metrics.recoveries}:${summary.metrics.completionRate}`,
          projectLabel: label,
          rangeLabel: t(`range.${range}.short`),
        });
      }, [range, events, history, sessionId, label, t]);

      const setTheme = (value) => { setThemeState(value); safeStorageSet(THEME_KEY, value); };
      const setLabel = (value) => { setLabelState(value); safeStorageSet(LABEL_KEY, value); };
      const clearHistory = () => {
        const empty = CORE.createEmptyHistory();
        setHistory(empty);
        safeStorageRemove(HISTORY_KEY);
        setRange('session');
      };
      const close = useCallback(() => {
        setOpen(false);
        queueMicrotask(() => triggerRef.current?.focus());
      }, []);
      const count = events.length;

      return h('div', { className: 'dsh-skyline-root' },
        h('button', {
          ref: triggerRef, type: 'button', className: 'dsh-skyline-trigger',
          'aria-expanded': open, 'aria-label': t('trigger.aria', { count }),
          onClick: () => setOpen(value => !value),
        },
        h(SkylineMark, { className: 'dsh-skyline-trigger-mark' }),
        h('span', { className: 'dsh-skyline-trigger-label' }, t('title')),
        running ? h('span', { className: 'dsh-skyline-live-dot', 'aria-hidden': true }) : null,
        count > 0 ? h('span', { className: 'dsh-skyline-trigger-count', 'aria-hidden': true }, count > 999 ? '999+' : count) : null),
        open ? ReactDOM.createPortal(h(SkylineDialog, {
          close, model: currentModel, range, setRange, theme, setTheme, label, setLabel,
          history, clearHistory, running, t,
        }), document.body) : null);
    }

    const inject = ['sessions', 'slots', 'locale'];

    function apply(ctx) {
      ctx.effect(() => {
        const tag = document.createElement('style');
        tag.dataset.plugin = PACKAGE_ID;
        tag.dataset.pluginCss = `${PACKAGE_ID}/main`;
        tag.textContent = STYLE_TEXT;
        document.head.appendChild(tag);
        return () => tag.remove();
      }, 'agent-skyline: styles');
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'agent-skyline: dictionaries');
      ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
        name: 'conversation.session.header.actions',
        id: 'agent-skyline',
        order: 16,
        locale: NS,
        inject: () => ({}),
      }, AgentSkylineAction));
    }

    exports.inject = inject;
    exports.apply = apply;

    return module.exports;
  },
});

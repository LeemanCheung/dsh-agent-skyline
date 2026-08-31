window.__ModuleLoader__.load({
  id: "dsh-agent-skyline",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    const STYLE_TEXT = ".dsh-skyline-root {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n}\n.dsh-skyline-trigger {\n  --sky-accent: var(--dsw-static-deepseek-500, #4d6bfe);\n  position: relative;\n  display: inline-flex;\n  min-height: 32px;\n  padding: 6px 10px;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid color-mix(in srgb, var(--sky-accent) 18%, transparent);\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--sky-accent) 7%, transparent);\n  color: inherit;\n  font: inherit;\n  font-size: 12px;\n  line-height: 1;\n  cursor: pointer;\n  transition:\n    border-color 0.16s ease,\n    background-color 0.16s ease,\n    box-shadow 0.16s ease,\n    transform 0.16s ease;\n}\n.dsh-skyline-trigger:hover {\n  border-color: color-mix(in srgb, var(--sky-accent) 36%, transparent);\n  background: color-mix(in srgb, var(--sky-accent) 11%, transparent);\n  box-shadow: 0 5px 16px color-mix(in srgb, var(--sky-accent) 11%, transparent);\n  transform: translateY(-1px);\n}\n.dsh-skyline-trigger:focus-visible,\n.dsh-skyline-panel button:focus-visible,\n.dsh-skyline-panel input:focus-visible,\n.dsh-skyline-panel textarea:focus-visible {\n  outline: 2px solid var(--sky-accent, #4d6bfe);\n  outline-offset: 2px;\n}\n.dsh-skyline-trigger-mark {\n  width: 16px;\n  height: 16px;\n  flex: 0 0 auto;\n  color: var(--sky-accent);\n}\n.dsh-skyline-trigger-label {\n  font-weight: 650;\n  letter-spacing: -0.01em;\n}\n.dsh-skyline-trigger-count {\n  display: inline-flex;\n  min-width: 18px;\n  height: 17px;\n  padding: 0 5px;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--sky-accent) 14%, transparent);\n  color: color-mix(in srgb, var(--sky-accent) 82%, currentColor);\n  font-size: 10px;\n  font-weight: 750;\n}\n.dsh-skyline-live-dot {\n  width: 6px;\n  height: 6px;\n  margin-left: -3px;\n  border-radius: 50%;\n  background: var(--dsw-static-green-500, #27a66c);\n  box-shadow: 0 0 0 4px\n    color-mix(in srgb, var(--dsw-static-green-500, #27a66c) 13%, transparent);\n  animation: dsh-skyline-pulse 1.8s ease-in-out infinite;\n}\n@keyframes dsh-skyline-pulse {\n  0%,\n  100% {\n    opacity: 0.64;\n    transform: scale(0.92);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(1.08);\n  }\n}\n.dsh-skyline-backdrop {\n  --sky-bg: var(--dsw-alias-bg-base, #f4f7fb);\n  --sky-panel: var(--dsw-alias-bg-layer-1, #fbfcfe);\n  --sky-panel-2: var(--dsw-alias-bg-layer-2, #eef3f9);\n  --sky-overlay: var(--dsw-alias-bg-layer-3, #fffefa);\n  --sky-border: var(--dsw-alias-border-l1, rgba(61, 77, 101, 0.12));\n  --sky-border-strong: var(--dsw-alias-border-l2, rgba(61, 77, 101, 0.2));\n  --sky-text: var(--dsw-alias-label-primary, #202836);\n  --sky-muted: var(--dsw-alias-label-secondary, #667286);\n  --sky-faint: var(--dsw-alias-label-tertiary, #8490a2);\n  --sky-accent: var(--dsw-alias-state-business-primary, #4d6bfe);\n  --sky-accent-hover: var(--dsw-alias-button-primary-hover, #3f5ce0);\n  --sky-primary-fill: var(--dsw-alias-button-contrast-fill, #0f1115);\n  --sky-primary-label: var(--dsw-alias-label-primary-inverted, #f8faff);\n  --sky-good: var(--dsw-alias-state-success-primary, #27a66c);\n  --sky-warn: var(--dsw-alias-state-warn-primary, #d89a32);\n  --sky-danger: var(--dsw-alias-state-error-primary, #d86062);\n  position: fixed;\n  inset: 0;\n  z-index: 2147483000;\n  display: grid;\n  place-items: center;\n  padding: 22px;\n  background: var(--dsw-alias-bg-mask-1, rgba(58, 70, 88, 0.22));\n  color: var(--sky-text);\n  font-family: inherit;\n  animation: dsh-skyline-backdrop-in 0.16s ease-out both;\n}\n@keyframes dsh-skyline-backdrop-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.dsh-skyline-panel {\n  position: relative;\n  display: grid;\n  grid-template-rows: auto auto minmax(0, 1fr) auto;\n  width: min(1520px, 96vw);\n  height: min(920px, 94vh);\n  min-height: 640px;\n  overflow: hidden;\n  border: 1px solid var(--sky-border-strong);\n  border-radius: 16px;\n  background: var(--sky-panel);\n  scrollbar-color: color-mix(in srgb, var(--sky-muted) 42%, transparent)\n    transparent;\n  scrollbar-width: thin;\n  box-shadow:\n    0 28px 80px rgba(33, 44, 63, 0.2),\n    0 4px 16px rgba(33, 44, 63, 0.08);\n  animation: dsh-skyline-panel-in 0.26s cubic-bezier(0.22, 0.8, 0.24, 1) both;\n}\n.dsh-skyline-panel * {\n  scrollbar-color: color-mix(in srgb, var(--sky-muted) 42%, transparent)\n    transparent;\n  scrollbar-width: thin;\n}\n.dsh-skyline-panel *::-webkit-scrollbar {\n  width: 9px;\n  height: 9px;\n}\n.dsh-skyline-panel *::-webkit-scrollbar-track {\n  background: transparent;\n}\n.dsh-skyline-panel *::-webkit-scrollbar-thumb {\n  border: 3px solid transparent;\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--sky-muted) 42%, transparent);\n  background-clip: padding-box;\n}\n.dsh-skyline-panel *::-webkit-scrollbar-thumb:hover {\n  background: color-mix(in srgb, var(--sky-muted) 62%, transparent);\n  background-clip: padding-box;\n}\n@keyframes dsh-skyline-panel-in {\n  from {\n    opacity: 0;\n    transform: translateY(10px) scale(0.99);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n.dsh-skyline-header {\n  display: flex;\n  min-height: 64px;\n  padding: 11px 14px 10px 18px;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 1px solid var(--sky-border);\n  background: var(--sky-panel);\n}\n.dsh-skyline-brand,\n.dsh-skyline-header-right {\n  display: flex;\n  align-items: center;\n}\n.dsh-skyline-brand {\n  gap: 11px;\n}\n.dsh-skyline-header-right {\n  gap: 10px;\n}\n.dsh-skyline-brand-mark {\n  display: grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  border: 1px solid color-mix(in srgb, var(--sky-accent) 25%, transparent);\n  border-radius: 10px;\n  color: var(--sky-accent);\n  background: color-mix(in srgb, var(--sky-accent) 8%, var(--sky-panel));\n}\n.dsh-skyline-brand-mark svg {\n  width: 21px;\n  height: 21px;\n}\n.dsh-skyline-brand h2 {\n  margin: 0;\n  color: var(--sky-text);\n  font-size: 15px;\n  font-weight: 720;\n  letter-spacing: -0.015em;\n}\n.dsh-skyline-brand p {\n  margin: 3px 0 0;\n  color: var(--sky-muted);\n  font-size: 11px;\n  font-weight: 540;\n}\n.dsh-skyline-privacy {\n  display: inline-flex;\n  padding: 6px 9px;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid color-mix(in srgb, var(--sky-good) 22%, transparent);\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--sky-good) 7%, var(--sky-panel));\n  color: color-mix(in srgb, var(--sky-good) 78%, var(--sky-text));\n  font-size: 10.5px;\n  font-weight: 650;\n  white-space: nowrap;\n}\n.dsh-skyline-privacy > span {\n  color: var(--sky-good);\n  font-size: 7px;\n}\n.dsh-skyline-icon-button {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  padding: 0;\n  border: 1px solid var(--sky-border);\n  border-radius: 8px;\n  background: transparent;\n  color: var(--sky-muted);\n  cursor: pointer;\n  transition:\n    border-color 0.16s ease,\n    background-color 0.16s ease,\n    color 0.16s ease;\n}\n.dsh-skyline-icon-button:hover {\n  border-color: var(--sky-border-strong);\n  background: var(--sky-panel-2);\n  color: var(--sky-text);\n}\n.dsh-skyline-icon-button svg {\n  width: 17px;\n  height: 17px;\n}\n.dsh-skyline-tabs {\n  display: flex;\n  min-height: 44px;\n  padding: 5px 14px;\n  align-items: center;\n  gap: 2px;\n  border-bottom: 1px solid var(--sky-border);\n  background: var(--sky-panel);\n}\n.dsh-skyline-tab {\n  position: relative;\n  min-height: 32px;\n  padding: 7px 12px;\n  border: 0;\n  border-radius: 7px;\n  background: transparent;\n  color: var(--sky-muted);\n  font: inherit;\n  font-size: 11px;\n  font-weight: 620;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    color 0.16s ease;\n}\n.dsh-skyline-tab:hover {\n  color: var(--sky-text);\n  background: var(--sky-panel-2);\n}\n.dsh-skyline-tab[data-active=\"true\"] {\n  color: var(--sky-accent);\n  background: color-mix(in srgb, var(--sky-accent) 8%, var(--sky-panel));\n}\n.dsh-skyline-tab[data-active=\"true\"]::after {\n  content: \"\";\n  position: absolute;\n  left: 12px;\n  right: 12px;\n  bottom: -6px;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--sky-accent);\n}\n.dsh-skyline-body {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 286px;\n  min-height: 0;\n  overflow: hidden;\n  background: var(--sky-bg);\n}\n.dsh-skyline-stage-column {\n  display: grid;\n  grid-template-rows: minmax(0, 1fr) auto auto;\n  min-width: 0;\n  min-height: 0;\n  padding: 16px 18px 14px;\n  overflow: auto;\n  background: var(--sky-bg);\n}\n.dsh-skyline-stage {\n  position: relative;\n  min-height: 360px;\n  overflow: hidden;\n  border: 1px solid var(--sky-border);\n  border-radius: 12px;\n  background: var(--sky-panel-2);\n  box-shadow: 0 12px 32px rgba(65, 83, 111, 0.09);\n}\n.dsh-skyline-stage::after {\n  content: \"\";\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);\n}\n.dsh-skyline-stage-art {\n  width: 100%;\n  height: 100%;\n  aspect-ratio: 16/9;\n}\n.dsh-skyline-stage-art svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 360px;\n  object-fit: contain;\n}\n.dsh-skyline-empty {\n  pointer-events: none;\n  position: absolute;\n  inset: 50% auto auto 50%;\n  width: min(340px, 76%);\n  margin: 0;\n  color: var(--sky-muted);\n  font-size: 12px;\n  line-height: 1.65;\n  text-align: center;\n  transform: translate(-50%, -50%);\n}\n.dsh-skyline-player {\n  display: grid;\n  grid-template-columns: auto minmax(180px, 1fr) auto;\n  min-height: 50px;\n  padding: 11px 2px 8px;\n  align-items: center;\n  gap: 14px;\n  border-bottom: 1px solid var(--sky-border);\n  background: transparent;\n}\n.dsh-skyline-play {\n  display: inline-flex;\n  min-height: 32px;\n  padding: 7px 11px;\n  align-items: center;\n  gap: 7px;\n  border: 1px solid color-mix(in srgb, var(--sky-accent) 24%, transparent);\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--sky-accent) 7%, transparent);\n  color: var(--sky-accent);\n  font: inherit;\n  font-size: 10.5px;\n  font-weight: 680;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease;\n}\n.dsh-skyline-play:hover:not(:disabled) {\n  background: color-mix(in srgb, var(--sky-accent) 12%, transparent);\n  border-color: color-mix(in srgb, var(--sky-accent) 42%, transparent);\n}\n.dsh-skyline-play:disabled {\n  opacity: 0.42;\n  cursor: not-allowed;\n}\n.dsh-skyline-play svg {\n  width: 16px;\n  height: 16px;\n}\n.dsh-skyline-scrubber {\n  display: grid;\n  grid-template-columns: auto minmax(100px, 1fr);\n  align-items: center;\n  gap: 11px;\n  color: var(--sky-muted);\n  font-size: 10px;\n  font-weight: 620;\n}\n.dsh-skyline-scrubber input {\n  width: 100%;\n  accent-color: var(--sky-accent);\n  cursor: pointer;\n}\n.dsh-skyline-progress {\n  min-width: 50px;\n  color: var(--sky-muted);\n  font-variant-numeric: tabular-nums;\n  font-size: 10px;\n  font-weight: 660;\n  text-align: right;\n}\n.dsh-skyline-metrics-row {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  min-height: 58px;\n  padding-top: 8px;\n}\n.dsh-skyline-metric {\n  min-width: 0;\n  padding: 7px 12px 4px;\n}\n.dsh-skyline-metric + .dsh-skyline-metric {\n  border-left: 1px solid var(--sky-border);\n}\n.dsh-skyline-metric-value,\n.dsh-skyline-metric-label {\n  display: block;\n}\n.dsh-skyline-metric-value {\n  color: var(--sky-text);\n  font-size: 18px;\n  font-weight: 730;\n  letter-spacing: -0.025em;\n}\n.dsh-skyline-metric-label {\n  margin-top: 3px;\n  overflow: hidden;\n  color: var(--sky-muted);\n  font-size: 9.5px;\n  font-weight: 600;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dsh-skyline-controls {\n  min-height: 0;\n  padding: 18px 16px;\n  overflow: auto;\n  border-left: 1px solid var(--sky-border);\n  background: var(--sky-panel);\n}\n.dsh-skyline-control-section + .dsh-skyline-control-section {\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid var(--sky-border);\n}\n.dsh-skyline-section-kicker,\n.dsh-skyline-field-label {\n  display: block;\n  margin-bottom: 8px;\n  color: var(--sky-muted);\n  font-size: 9px;\n  font-weight: 730;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n.dsh-skyline-identity-card {\n  display: grid;\n  gap: 4px;\n  padding: 0 1px 2px;\n  background: transparent;\n}\n.dsh-skyline-city-code {\n  color: var(--sky-accent);\n  font-size: 9px;\n  font-weight: 760;\n  letter-spacing: 0.14em;\n}\n.dsh-skyline-identity-card strong {\n  color: var(--sky-text);\n  font-size: 15px;\n  font-weight: 710;\n}\n.dsh-skyline-identity-card > span:last-child {\n  color: var(--sky-muted);\n  font-size: 10px;\n  line-height: 1.45;\n}\n.dsh-skyline-input {\n  box-sizing: border-box;\n  width: 100%;\n  height: 36px;\n  padding: 0 10px;\n  border: 1px solid var(--sky-border-strong);\n  border-radius: 8px;\n  background: var(--sky-panel);\n  color: var(--sky-text);\n  font: inherit;\n  font-size: 11px;\n  transition:\n    border-color 0.16s ease,\n    box-shadow 0.16s ease;\n}\n.dsh-skyline-input:hover {\n  border-color: color-mix(\n    in srgb,\n    var(--sky-accent) 34%,\n    var(--sky-border-strong)\n  );\n}\n.dsh-skyline-input::placeholder {\n  color: var(--sky-faint);\n}\n.dsh-skyline-field-hint {\n  margin: 7px 1px 0;\n  color: var(--sky-faint);\n  font-size: 9px;\n  line-height: 1.5;\n}\n.dsh-skyline-theme-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 6px;\n}\n.dsh-skyline-theme {\n  position: relative;\n  display: grid;\n  min-height: 42px;\n  padding: 6px 8px;\n  grid-template-columns: 28px minmax(0, 1fr);\n  gap: 7px;\n  align-items: center;\n  overflow: hidden;\n  border: 1px solid var(--sky-border);\n  border-radius: 8px;\n  background: var(--sky-panel-2);\n  cursor: pointer;\n  transition:\n    border-color 0.16s ease,\n    box-shadow 0.16s ease,\n    transform 0.16s ease;\n}\n.dsh-skyline-theme:hover {\n  border-color: var(--sky-border-strong);\n  transform: translateY(-1px);\n}\n.dsh-skyline-theme[data-active=\"true\"] {\n  border-color: var(--sky-accent);\n  box-shadow: 0 0 0 2px color-mix(in srgb, var(--sky-accent) 12%, transparent);\n}\n.dsh-skyline-theme-bars {\n  display: flex;\n  height: 24px;\n  align-items: flex-end;\n  justify-content: center;\n  gap: 2px;\n}\n.dsh-skyline-theme-bars > span {\n  display: block;\n  width: 5px;\n  border-radius: 1px 1px 0 0;\n}\n.dsh-skyline-theme-bars > span:nth-child(1) {\n  height: 12px;\n}\n.dsh-skyline-theme-bars > span:nth-child(2) {\n  height: 20px;\n}\n.dsh-skyline-theme-bars > span:nth-child(3) {\n  height: 16px;\n}\n.dsh-skyline-theme-name {\n  overflow: hidden;\n  color: var(--sky-muted);\n  font-size: 9px;\n  font-weight: 650;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dsh-skyline-theme[data-active=\"true\"] .dsh-skyline-theme-name {\n  color: var(--sky-accent);\n}\n.dsh-skyline-theme[data-theme=\"midnight\"] {\n  background: #eaf1fb;\n}\n.dsh-skyline-theme[data-theme=\"midnight\"] .dsh-skyline-theme-bars > span {\n  background: #4d6bfe;\n}\n.dsh-skyline-theme[data-theme=\"aurora\"] {\n  background: #e9f5ee;\n}\n.dsh-skyline-theme[data-theme=\"aurora\"] .dsh-skyline-theme-bars > span {\n  background: #27a66c;\n}\n.dsh-skyline-theme[data-theme=\"sunset\"] {\n  background: #f8ece5;\n}\n.dsh-skyline-theme[data-theme=\"sunset\"] .dsh-skyline-theme-bars > span {\n  background: #d86d4d;\n}\n.dsh-skyline-theme[data-theme=\"paper\"] {\n  background: #f4f1e9;\n}\n.dsh-skyline-theme[data-theme=\"paper\"] .dsh-skyline-theme-bars > span {\n  background: #315beb;\n}\n.dsh-skyline-landmarks {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n}\n.dsh-skyline-landmarks > span {\n  padding: 5px 7px;\n  border: 1px solid color-mix(in srgb, var(--sky-warn) 20%, transparent);\n  border-radius: 6px;\n  background: color-mix(in srgb, var(--sky-warn) 7%, transparent);\n  color: color-mix(in srgb, var(--sky-warn) 72%, var(--sky-text));\n  font-size: 8.5px;\n  font-weight: 630;\n}\n.dsh-skyline-landmarks > .dsh-skyline-landmark-locked {\n  color: var(--sky-faint);\n  border-color: var(--sky-border);\n  background: transparent;\n  letter-spacing: 0.3em;\n}\n.dsh-skyline-export-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 7px;\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px solid var(--sky-border);\n}\n.dsh-skyline-primary-button,\n.dsh-skyline-secondary-button {\n  display: inline-flex;\n  min-height: 36px;\n  padding: 8px 10px;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  border-radius: 8px;\n  font: inherit;\n  font-size: 10px;\n  font-weight: 680;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n}\n.dsh-skyline-primary-button {\n  border: 1px solid var(--sky-accent);\n  background: var(--sky-primary-fill);\n  color: var(--sky-primary-label);\n  box-shadow: 0 8px 18px color-mix(in srgb, var(--sky-accent) 18%, transparent);\n}\n.dsh-skyline-primary-button:hover {\n  background: var(--sky-accent-hover);\n  border-color: var(--sky-accent-hover);\n  color: var(--sky-primary-label);\n  transform: translateY(-1px);\n}\n.dsh-skyline-secondary-button {\n  border: 1px solid var(--sky-border-strong);\n  background: var(--sky-panel);\n  color: var(--sky-text);\n}\n.dsh-skyline-secondary-button:hover {\n  border-color: color-mix(\n    in srgb,\n    var(--sky-accent) 28%,\n    var(--sky-border-strong)\n  );\n  background: var(--sky-panel-2);\n}\n.dsh-skyline-primary-button svg,\n.dsh-skyline-secondary-button svg {\n  width: 15px;\n  height: 15px;\n}\n.dsh-skyline-copy-button {\n  grid-column: 1/-1;\n}\n.dsh-skyline-copy-fallback {\n  margin-top: 9px;\n  padding: 10px;\n  border: 1px solid color-mix(in srgb, var(--sky-accent) 22%, var(--sky-border));\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--sky-accent) 4%, var(--sky-panel));\n}\n.dsh-skyline-copy-textarea {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 92px;\n  padding: 8px;\n  resize: none;\n  border: 1px solid var(--sky-border-strong);\n  border-radius: 7px;\n  background: var(--sky-panel);\n  color: var(--sky-text);\n  font: inherit;\n  font-size: 9px;\n  line-height: 1.5;\n}\n.dsh-skyline-copy-dismiss {\n  display: block;\n  min-height: 30px;\n  margin: 7px 0 0 auto;\n  padding: 6px 9px;\n  border: 1px solid var(--sky-border-strong);\n  border-radius: 7px;\n  background: var(--sky-panel);\n  color: var(--sky-text);\n  font: inherit;\n  font-size: 9px;\n  font-weight: 680;\n  cursor: pointer;\n}\n.dsh-skyline-copy-dismiss:hover {\n  background: var(--sky-panel-2);\n}\n.dsh-skyline-reset {\n  width: 100%;\n  margin-top: 9px;\n  padding: 7px 8px;\n  border: 0;\n  background: transparent;\n  color: var(--sky-faint);\n  font: inherit;\n  font-size: 9px;\n  cursor: pointer;\n}\n.dsh-skyline-reset:hover:not(:disabled) {\n  color: var(--sky-danger);\n}\n.dsh-skyline-reset:disabled {\n  opacity: 0.36;\n  cursor: default;\n}\n.dsh-skyline-reset-layer {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: color-mix(in srgb, var(--sky-bg) 62%, transparent);\n}\n.dsh-skyline-reset-confirmation {\n  box-sizing: border-box;\n  width: min(360px, 100%);\n  padding: 18px;\n  border: 1px solid color-mix(in srgb, var(--sky-danger) 28%, var(--sky-border));\n  border-radius: 12px;\n  background: color-mix(in srgb, var(--sky-danger) 5%, var(--sky-overlay));\n  box-shadow: 0 22px 60px rgba(33, 44, 63, 0.22);\n}\n.dsh-skyline-reset-confirmation strong {\n  display: block;\n  color: var(--sky-text);\n  font-size: 10.5px;\n  font-weight: 700;\n}\n.dsh-skyline-reset-confirmation p {\n  margin: 5px 0 0;\n  color: var(--sky-muted);\n  font-size: 9px;\n  line-height: 1.5;\n}\n.dsh-skyline-reset-actions {\n  display: flex;\n  margin-top: 10px;\n  justify-content: flex-end;\n  gap: 6px;\n}\n.dsh-skyline-reset-cancel,\n.dsh-skyline-reset-confirm {\n  min-height: 30px;\n  padding: 6px 9px;\n  border-radius: 7px;\n  font: inherit;\n  font-size: 9px;\n  font-weight: 680;\n  cursor: pointer;\n}\n.dsh-skyline-reset-cancel {\n  border: 1px solid var(--sky-border-strong);\n  background: var(--sky-panel);\n  color: var(--sky-text);\n}\n.dsh-skyline-reset-confirm {\n  border: 1px solid var(--sky-danger);\n  background: var(--sky-danger);\n  color: #fff9f8;\n}\n.dsh-skyline-reset-cancel:hover {\n  background: var(--sky-panel-2);\n}\n.dsh-skyline-reset-confirm:hover {\n  background: color-mix(in srgb, var(--sky-danger) 88%, #7e2434);\n}\n.dsh-skyline-footer {\n  display: flex;\n  min-height: 40px;\n  padding: 9px 18px;\n  align-items: center;\n  gap: 9px;\n  border-top: 1px solid var(--sky-border);\n  background: var(--sky-panel);\n  color: var(--sky-muted);\n  font-size: 9.5px;\n  line-height: 1.45;\n}\n.dsh-skyline-footer-shield {\n  color: var(--sky-good);\n  font-size: 9px;\n}\n.dsh-skyline-toast {\n  position: absolute;\n  left: 50%;\n  bottom: 52px;\n  z-index: 3;\n  padding: 9px 13px;\n  border: 1px solid var(--sky-border-strong);\n  border-radius: 8px;\n  background: var(--sky-overlay);\n  color: var(--sky-text);\n  box-shadow: 0 12px 34px rgba(39, 51, 70, 0.16);\n  font-size: 10px;\n  font-weight: 650;\n  transform: translateX(-50%);\n  animation: dsh-skyline-toast-in 0.2s ease both;\n}\n@keyframes dsh-skyline-toast-in {\n  from {\n    opacity: 0;\n    transform: translate(-50%, 6px);\n  }\n  to {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n}\n@keyframes sky-rise {\n  from {\n    opacity: 0;\n    transform: translateY(18px) scale(0.96);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n.dsh-skyline-stage-art [data-reveal=\"true\"] {\n  transform-box: fill-box;\n  transform-origin: center bottom;\n  animation: sky-rise 0.42s cubic-bezier(0.2, 0.8, 0.2, 1) both;\n}\n@media (max-width: 1080px) {\n  .dsh-skyline-panel {\n    height: min(960px, 96vh);\n  }\n  .dsh-skyline-body {\n    grid-template-columns: minmax(0, 1fr) 260px;\n  }\n  .dsh-skyline-stage-column {\n    padding: 12px 14px;\n  }\n  .dsh-skyline-controls {\n    padding: 15px 13px;\n  }\n  .dsh-skyline-metrics-row {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .dsh-skyline-metric:nth-child(3) {\n    border-left: 0;\n  }\n  .dsh-skyline-metric:nth-child(n + 3) {\n    border-top: 1px solid var(--sky-border);\n  }\n}\n@media (max-width: 760px) {\n  .dsh-skyline-backdrop {\n    padding: 0;\n  }\n  .dsh-skyline-panel {\n    width: 100vw;\n    height: 100dvh;\n    min-height: 0;\n    border: 0;\n    border-radius: 0;\n  }\n  .dsh-skyline-header {\n    min-height: 60px;\n    padding: 10px 12px;\n  }\n  .dsh-skyline-brand-mark {\n    width: 34px;\n    height: 34px;\n  }\n  .dsh-skyline-brand p,\n  .dsh-skyline-privacy {\n    display: none;\n  }\n  .dsh-skyline-tabs {\n    overflow-x: auto;\n    padding-inline: 9px;\n  }\n  .dsh-skyline-tab {\n    white-space: nowrap;\n  }\n  .dsh-skyline-body {\n    display: block;\n    overflow: auto;\n  }\n  .dsh-skyline-stage-column {\n    min-height: auto;\n    padding: 10px;\n    overflow: visible;\n  }\n  .dsh-skyline-stage {\n    min-height: 250px;\n    border-radius: 10px;\n  }\n  .dsh-skyline-stage-art {\n    aspect-ratio: 4/3;\n  }\n  .dsh-skyline-stage-art svg {\n    min-height: 250px;\n  }\n  .dsh-skyline-player {\n    grid-template-columns: auto 1fr;\n  }\n  .dsh-skyline-scrubber {\n    grid-template-columns: 1fr;\n    gap: 4px;\n  }\n  .dsh-skyline-progress {\n    display: none;\n  }\n  .dsh-skyline-controls {\n    overflow: visible;\n    border-top: 1px solid var(--sky-border);\n    border-left: 0;\n  }\n  .dsh-skyline-footer {\n    position: sticky;\n    bottom: 0;\n    z-index: 2;\n    background: var(--sky-panel);\n  }\n  .dsh-skyline-trigger-label {\n    display: none;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .dsh-skyline-backdrop,\n  .dsh-skyline-panel,\n  .dsh-skyline-toast,\n  .dsh-skyline-live-dot,\n  .dsh-skyline-reset-layer,\n  .dsh-skyline-stage-art .sky-building[data-reveal=\"true\"] {\n    animation: none;\n    transition: none;\n  }\n}\n\n@media (forced-colors: active) {\n  .dsh-skyline-backdrop {\n    forced-color-adjust: auto;\n  }\n  .dsh-skyline-panel,\n  .dsh-skyline-stage,\n  .dsh-skyline-theme,\n  .dsh-skyline-reset-confirmation {\n    border-color: CanvasText;\n  }\n}\n";
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
        id: 'midnight', name: 'Blueprint',
        background: '#F3F7FB', background2: '#E7EFF6', ground: '#E8EDF1', grid: '#B9C8D3',
        text: '#21384A', muted: '#647989', accent: '#2D6FA4', accent2: '#6A98B8', glow: '#B8D3E7',
        success: '#37785C', danger: '#B65B55', panel: '#FBFDFE', road: '#A9B7C1', roadLine: '#F4F7F8',
        planting: '#6F966F', water: '#86B9D0', shadow: '#7D91A0',
        material: { porcelain: '#F4F3EE', limestone: '#DDD7C9', glass: '#8EB9D0', stone: '#BCC5C8' },
        category: {
          file: '#3F78A8', shell: '#687DA0', test: '#4F8066', web: '#3E8297', agent: '#B4783C',
          vision: '#8B6685', reasoning: '#647584', conversation: '#527E77', other: '#7A858C',
        },
      },
      aurora: {
        id: 'aurora', name: 'Garden',
        background: '#F4F8F2', background2: '#E8F1E7', ground: '#E9EFE5', grid: '#C0CDBA',
        text: '#293B30', muted: '#687A6B', accent: '#3E785B', accent2: '#7A9666', glow: '#C7DDC6',
        success: '#347557', danger: '#B65D55', panel: '#FCFDF9', road: '#ADB8AA', roadLine: '#F5F7F1',
        planting: '#6E9562', water: '#8BBBC1', shadow: '#849286',
        material: { porcelain: '#F5F3EA', limestone: '#DED8C8', glass: '#94BEC5', stone: '#BEC7BD' },
        category: {
          file: '#527FA3', shell: '#727B9A', test: '#4E7F5D', web: '#4D8390', agent: '#A97943',
          vision: '#8D6F84', reasoning: '#687B73', conversation: '#5B8171', other: '#7D887B',
        },
      },
      sunset: {
        id: 'sunset', name: 'Terracotta',
        background: '#FBF3ED', background2: '#F1E3D8', ground: '#EFE5DC', grid: '#D5BFAF',
        text: '#443229', muted: '#7E6B60', accent: '#B65F3E', accent2: '#C98A5E', glow: '#E7C2AD',
        success: '#4C7958', danger: '#A94D45', panel: '#FFFDF9', road: '#BDAFA5', roadLine: '#FAF5F0',
        planting: '#789061', water: '#89B3C0', shadow: '#9B887E',
        material: { porcelain: '#F5F0E7', limestone: '#DFD1BF', glass: '#91B4BF', stone: '#C7BDB5' },
        category: {
          file: '#5C7FA0', shell: '#7E7090', test: '#5F7F5F', web: '#54828D', agent: '#B26A3E',
          vision: '#9B6478', reasoning: '#7D716E', conversation: '#647F71', other: '#887A73',
        },
      },
      paper: {
        id: 'paper', name: 'Paper',
        background: '#F8F6F1', background2: '#EEEAE1', ground: '#ECE8DE', grid: '#CDC6B8',
        text: '#29333B', muted: '#6C716F', accent: '#315F91', accent2: '#718E9D', glow: '#D4E0E7',
        success: '#39765B', danger: '#B25550', panel: '#FFFDF8', road: '#B8B7B0', roadLine: '#F9F7F1',
        planting: '#76936A', water: '#8DB8C7', shadow: '#90989A',
        material: { porcelain: '#F5F2E9', limestone: '#DED6C6', glass: '#91B7C7', stone: '#C3C5C1' },
        category: {
          file: '#416F9B', shell: '#716F91', test: '#4C7A5E', web: '#4B7F8E', agent: '#A87542',
          vision: '#8A687E', reasoning: '#6B747A', conversation: '#587D72', other: '#7B7E7D',
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

    const FOCUSABLE_SELECTOR =
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

    /** Return visible focus targets owned by a modal root. */
    function getFocusableElements(root) {
      if (!root || typeof root.querySelectorAll !== 'function') return []
      return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        element => typeof element?.getClientRects === 'function' && element.getClientRects().length > 0,
      )
    }

    /** Resolve the target needed to keep Tab/Shift+Tab inside a modal root. */
    function getFocusTrapTarget(root, activeElement, shiftKey = false) {
      const focusable = getFocusableElements(root)
      if (!focusable.length) return root || null
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (activeElement === root || !root?.contains?.(activeElement)) {
        return shiftKey ? last : first
      }
      if (shiftKey && activeElement === first) return last
      if (!shiftKey && activeElement === last) return first
      return null
    }

    /** Copy text without leaking a temporary textarea or losing keyboard focus. */
    async function copyTextWithFallback(text, dependencies = {}) {
      const navigatorRef = dependencies.navigatorRef ?? globalThis.navigator
      const documentRef = dependencies.documentRef ?? globalThis.document
      const writeText = navigatorRef?.clipboard?.writeText
      if (typeof writeText === 'function') {
        try {
          await writeText.call(navigatorRef.clipboard, String(text))
          return true
        } catch {
          // Continue to the local legacy fallback.
        }
      }
      if (!documentRef?.body || typeof documentRef.createElement !== 'function') return false
      const previousFocus = documentRef.activeElement
      let area = null
      let restoreFocus = false
      try {
        area = documentRef.createElement('textarea')
        area.value = String(text)
        area.setAttribute('aria-hidden', 'true')
        area.setAttribute('readonly', '')
        area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
        documentRef.body.appendChild(area)
        area.select()
        restoreFocus = documentRef.activeElement === area
        return Boolean(documentRef.execCommand?.('copy'))
      } catch {
        return false
      } finally {
        area?.remove()
        if (restoreFocus && typeof previousFocus?.focus === 'function') {
          try {
            previousFocus.focus({ preventScroll: true })
          } catch {
            previousFocus.focus()
          }
        }
      }
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

    const RESERVED_PARK_CELLS = new Set(['-4,-2', '4,2', '-2,4', '3,-3'])

    function urbanCells(limit) {
      return spiralCells(Math.max(64, limit * 3))
        .filter(cell => Math.max(Math.abs(cell.x), Math.abs(cell.y)) > 2)
        .filter(cell => cell.x !== 0 && cell.y !== 0)
        .filter(cell => !RESERVED_PARK_CELLS.has(`${cell.x},${cell.y}`))
        .slice(0, limit)
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

    const ARCHITECTURE_BIASES = {
      file: { archetypes: ['workshop', 'slab', 'stacked'], roofs: ['garden', 'equipment', 'flat'], materials: ['porcelain', 'limestone', 'glass'] },
      shell: { archetypes: ['monolith', 'slab', 'stacked'], roofs: ['equipment', 'spire', 'flat'], materials: ['stone', 'glass', 'porcelain'] },
      test: { archetypes: ['terraced', 'courtyard', 'stacked'], roofs: ['garden', 'lantern', 'flat'], materials: ['limestone', 'porcelain', 'glass'] },
      web: { archetypes: ['lantern', 'needle', 'stacked'], roofs: ['lantern', 'spire', 'garden'], materials: ['glass', 'porcelain', 'limestone'] },
      agent: { archetypes: ['arcology', 'terraced', 'lantern'], roofs: ['lantern', 'garden', 'spire'], materials: ['porcelain', 'glass', 'stone'] },
      vision: { archetypes: ['gallery', 'lantern', 'terraced'], roofs: ['lantern', 'garden', 'flat'], materials: ['glass', 'limestone', 'porcelain'] },
      reasoning: { archetypes: ['needle', 'monolith', 'terraced'], roofs: ['spire', 'lantern', 'garden'], materials: ['porcelain', 'stone', 'glass'] },
      conversation: { archetypes: ['courtyard', 'gallery', 'terraced'], roofs: ['garden', 'lantern', 'flat'], materials: ['limestone', 'porcelain', 'glass'] },
      other: { archetypes: ['slab', 'terraced', 'workshop'], roofs: ['flat', 'garden', 'equipment'], materials: ['stone', 'limestone', 'porcelain'] },
    }

    function addressedRandom(seed, index, property) {
      return mulberry32(hashString(`${seed}:${index}:${property}`))()
    }

    function addressedPick(values, seed, index, property) {
      return values[Math.min(values.length - 1, Math.floor(addressedRandom(seed, index, property) * values.length))]
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
      const cells = urbanCells(categoryPool.length)
      const buildings = categoryPool.map((allocation, index) => {
        const cell = cells[index]
        const bias = ARCHITECTURE_BIASES[allocation.category] || ARCHITECTURE_BIASES.other
        const sourceStrength = Math.log2(allocation.sourceCount + 1)
        const roofType = addressedPick(bias.roofs, seed, index, 'roofType')
        const civicDistance = Math.max(Math.abs(cell.x), Math.abs(cell.y))
        const civicSetback = Math.max(0, 5 - civicDistance) * 7
        const outerLift = Math.max(0, civicDistance - 3) * 5
        const requestedHeight = 42 + sourceStrength * 13 - civicSetback + outerLift + addressedRandom(seed, index, 'height') * 38
        const roofReserve = roofType === 'spire' ? 42 : roofType === 'lantern' ? 22 : roofType === 'equipment' ? 14 : 9
        const baseY = 296 + (cell.x + cell.y) * 18
        const visibleHeight = Math.max(36, baseY - 20 - roofReserve)
        const height = Math.round(clamp(Math.min(requestedHeight, visibleHeight), 36, 176))
        const footprint = 22 + Math.round(addressedRandom(seed, index, 'footprint') * 10)
        const depth = 15 + Math.round(addressedRandom(seed, index, 'depth') * 8)
        const tierCount = clamp(1 + Math.floor(addressedRandom(seed, index, 'tierCount') * (height > 105 ? 3 : 2)), 1, 3)
        const setbacks = Array.from({ length: tierCount - 1 }, (_, tier) =>
          Math.round(3 + addressedRandom(seed, index, `setback:${tier}`) * 5))
        const podiumHeight = Math.round(clamp(8 + addressedRandom(seed, index, 'podiumHeight') * Math.min(18, height * .18), 8, 24))
        const failureChance = Math.min(.3, numberOr(metrics.outcomeCounts?.failure) / Math.max(1, metrics.totalEvents))
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
          status: addressedRandom(seed, index, 'status') < failureChance ? 'failure' : 'success',
          crown: ['lantern', 'garden'].includes(roofType),
          antenna: roofType === 'spire',
          seed: Math.floor(addressedRandom(seed, index, 'seed') * 1_000_000),
          archetype: addressedPick(bias.archetypes, seed, index, 'archetype'),
          tierCount,
          setbacks,
          roofType,
          facadeRhythm: addressedPick(['regular', 'paired', 'vertical', 'ribbon'], seed, index, 'facadeRhythm'),
          bayCount: clamp(2 + Math.floor(addressedRandom(seed, index, 'bayCount') * 5), 2, 6),
          material: addressedPick(bias.materials, seed, index, 'material'),
          podiumHeight,
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

    function interpolatePoint(from, to, progress) {
      return {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      }
    }

    function footprintPoints(anchor, width, depth) {
      return [
        anchor,
        { x: anchor.x + depth, y: anchor.y + depth * .48 },
        { x: anchor.x - width + depth, y: anchor.y + (width + depth) * .48 },
        { x: anchor.x - width, y: anchor.y + width * .48 },
      ]
    }

    function insetAnchor(anchor, widthDifference, depthDifference) {
      return {
        x: anchor.x - widthDifference * .5 + depthDifference * .5,
        y: anchor.y + (widthDifference + depthDifference) * .24,
      }
    }

    function prismGeometry(anchor, width, depth, height) {
      const top = { x: anchor.x, y: anchor.y - height }
      const [topFront, topRight, topFar, topLeft] = footprintPoints(top, width, depth)
      const [bottomFront, bottomRight, bottomFar, bottomLeft] = footprintPoints(anchor, width, depth)
      return {
        anchor, width, depth, height, top,
        topFront, topRight, topFar, topLeft,
        bottomFront, bottomRight, bottomFar, bottomLeft,
      }
    }

    function prismSvg(geometry, colors, className, attributes = '') {
      return `<g class="${className}"${attributes ? ` ${attributes}` : ''}>
        ${polygon([geometry.topLeft, geometry.topFar, geometry.bottomFar, geometry.bottomLeft], `fill="${colors.left}" stroke="${colors.edge}" stroke-width=".7"`)}
        ${polygon([geometry.topFar, geometry.topRight, geometry.bottomRight, geometry.bottomFar], `fill="${colors.right}" stroke="${colors.edge}" stroke-width=".7"`)}
        ${polygon([geometry.topFront, geometry.topRight, geometry.topFar, geometry.topLeft], `fill="${colors.top}" stroke="${colors.edge}" stroke-width=".7"`)}
      </g>`
    }

    const ARCHETYPE_PROFILES = {
      workshop: { width: 1.2, depth: 1.08, setback: .55, tierBias: .9 },
      slab: { width: 1.24, depth: .78, setback: .68, tierBias: 1 },
      stacked: { width: 1, depth: 1, setback: 1, tierBias: 1 },
      monolith: { width: .9, depth: .94, setback: .42, tierBias: 1.08 },
      terraced: { width: 1.12, depth: 1.04, setback: 1.38, tierBias: .86 },
      courtyard: { width: 1.24, depth: 1.12, setback: .8, tierBias: .9 },
      lantern: { width: .84, depth: .86, setback: .72, tierBias: 1.08 },
      needle: { width: .66, depth: .72, setback: .5, tierBias: 1.18 },
      arcology: { width: 1.06, depth: .96, setback: 1.14, tierBias: .98 },
      gallery: { width: 1.18, depth: .88, setback: .72, tierBias: .88 },
    }

    const MATERIAL_NAMES = ['porcelain', 'limestone', 'glass', 'stone']
    const ROOF_TYPES = ['flat', 'garden', 'equipment', 'lantern', 'spire']
    const FACADE_RHYTHMS = ['regular', 'paired', 'vertical', 'ribbon']

    function materialFaces(theme, material, lightness = 0) {
      const base = theme.material[material] || theme.material.porcelain
      return {
        left: mixHex(base, theme.text, .09 + lightness),
        right: mixHex(base, theme.text, .19 + lightness),
        top: mixHex(base, theme.panel, .52),
        edge: mixHex(base, theme.text, .28),
      }
    }

    function facadeSvg(geometry, building, theme, category, rhythm, bayCount, tierIndex) {
      const accent = theme.category[category] || theme.category.other
      const windowColor = building.status === 'failure' ? theme.danger : mixHex(theme.material.glass, accent, .32)
      const targetRows = rhythm === 'ribbon'
        ? Math.round(geometry.height / 22)
        : rhythm === 'vertical'
          ? Math.round(geometry.height / 28)
          : Math.round(geometry.height / 16)
      const rows = clamp(Math.min(numberOr(building.windows, 10), targetRows), 1, 7)
      const rowWidth = rhythm === 'ribbon' ? 3 : rhythm === 'paired' ? 1.7 : 1.15
      const dash = rhythm === 'paired' ? ' stroke-dasharray="5 3"' : rhythm === 'ribbon' ? ` stroke-dasharray="${Math.max(3, 9 - bayCount)} 1.5"` : ''
      let svg = `<g class="facade facade-${rhythm}" data-tier="${tierIndex}">`
      for (let row = 0; row < rows; row += 1) {
        const progress = (row + 1) / (rows + 1)
        const leftStart = interpolatePoint(geometry.topLeft, geometry.bottomLeft, progress)
        const leftEnd = interpolatePoint(geometry.topFar, geometry.bottomFar, progress)
        const rightStart = interpolatePoint(geometry.topFar, geometry.bottomFar, progress)
        const rightEnd = interpolatePoint(geometry.topRight, geometry.bottomRight, progress)
        const lit = hashString(`${building.seed}:${tierIndex}:${row}`) % 5 !== 0
        const opacity = lit ? (rhythm === 'ribbon' ? .72 : .58) : .24
        svg += `<path class="facade-row" d="M${leftStart.x.toFixed(1)} ${leftStart.y.toFixed(1)}L${leftEnd.x.toFixed(1)} ${leftEnd.y.toFixed(1)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="${rowWidth}" opacity="${opacity}"${dash}/>`
        svg += `<path class="facade-row" d="M${rightStart.x.toFixed(1)} ${rightStart.y.toFixed(1)}L${rightEnd.x.toFixed(1)} ${rightEnd.y.toFixed(1)}" stroke="${lit ? windowColor : theme.grid}" stroke-width="${rowWidth}" opacity="${Math.max(.18, opacity - .1)}"${dash}/>`
      }
      for (let bay = 1; bay < bayCount; bay += 1) {
        const progress = bay / bayCount
        const leftTop = interpolatePoint(geometry.topLeft, geometry.topFar, progress)
        const leftBottom = interpolatePoint(geometry.bottomLeft, geometry.bottomFar, progress)
        const rightTop = interpolatePoint(geometry.topFar, geometry.topRight, progress)
        const rightBottom = interpolatePoint(geometry.bottomFar, geometry.bottomRight, progress)
        const pairedOpacity = rhythm === 'paired' ? (bay % 2 ? .68 : .28) : rhythm === 'ribbon' ? .22 : .48
        const bayWidth = rhythm === 'vertical' ? 1.45 : .72
        svg += `<path class="facade-bay" d="M${leftTop.x.toFixed(1)} ${(leftTop.y + 2).toFixed(1)}L${leftBottom.x.toFixed(1)} ${(leftBottom.y - 2).toFixed(1)}" stroke="${accent}" stroke-width="${bayWidth}" opacity="${pairedOpacity}"/>`
        svg += `<path class="facade-bay" d="M${rightTop.x.toFixed(1)} ${(rightTop.y + 2).toFixed(1)}L${rightBottom.x.toFixed(1)} ${(rightBottom.y - 2).toFixed(1)}" stroke="${accent}" stroke-width="${bayWidth}" opacity="${Math.max(.18, pairedOpacity - .08)}"/>`
      }
      svg += `<path class="category-spine" d="M${geometry.topRight.x.toFixed(1)} ${geometry.topRight.y.toFixed(1)}L${geometry.bottomRight.x.toFixed(1)} ${geometry.bottomRight.y.toFixed(1)}" stroke="${accent}" stroke-width="1.6" opacity=".74"/>`
      svg += '</g>'
      return svg
    }

    function footprintCenter(anchor, width, depth) {
      return {
        x: anchor.x + (-width + depth) * .5,
        y: anchor.y + (width + depth) * .24,
      }
    }

    function roofCenter(geometry) {
      return footprintCenter(geometry.top, geometry.width, geometry.depth)
    }

    function roofSvg(roofType, geometry, theme, accent, seed) {
      const center = roofCenter(geometry)
      const insetWidth = geometry.width * .26
      const insetDepth = geometry.depth * .26
      const roofWidth = Math.max(6, geometry.width - insetWidth)
      const roofDepth = Math.max(5, geometry.depth - insetDepth)
      const roofAnchor = insetAnchor(geometry.top, insetWidth, insetDepth)
      const roofPlot = footprintPoints(roofAnchor, roofWidth, roofDepth)
      if (roofType === 'garden') {
        const treeOffset = 3 + (seed % 4)
        return `<g class="building-roof roof-garden" data-roof-type="garden">
          ${polygon(roofPlot, `fill="${theme.planting}" fill-opacity=".72" stroke="${mixHex(theme.planting, theme.text, .26)}" stroke-width="1"`)}
          <circle cx="${(center.x - treeOffset).toFixed(1)}" cy="${(center.y - 4).toFixed(1)}" r="3.2" fill="${mixHex(theme.planting, theme.panel, .12)}"/>
          <circle cx="${(center.x + treeOffset).toFixed(1)}" cy="${(center.y + 1).toFixed(1)}" r="2.4" fill="${mixHex(theme.planting, theme.text, .08)}"/>
        </g>`
      }
      if (roofType === 'equipment') {
        const unitWidth = Math.max(5, roofWidth * .34)
        const unitDepth = Math.max(4, roofDepth * .36)
        const unitAnchor = insetAnchor(geometry.top, geometry.width - unitWidth, geometry.depth - unitDepth)
        const unit = prismGeometry(unitAnchor, unitWidth, unitDepth, 7 + (seed % 4))
        const colors = materialFaces(theme, 'stone', .02)
        return `<g class="building-roof roof-equipment" data-roof-type="equipment">
          ${prismSvg(unit, colors, 'roof-equipment-unit')}
          <circle cx="${center.x.toFixed(1)}" cy="${(center.y - 5).toFixed(1)}" r="2.5" fill="none" stroke="${accent}" stroke-width="1.2"/>
        </g>`
      }
      if (roofType === 'lantern') {
        const lanternWidth = Math.max(7, roofWidth * .46)
        const lanternDepth = Math.max(6, roofDepth * .5)
        const lanternAnchor = insetAnchor(geometry.top, geometry.width - lanternWidth, geometry.depth - lanternDepth)
        const lantern = prismGeometry(lanternAnchor, lanternWidth, lanternDepth, 12 + (seed % 7))
        const colors = materialFaces(theme, 'glass', 0)
        return `<g class="building-roof roof-lantern" data-roof-type="lantern">${prismSvg(lantern, colors, 'roof-lantern-house', `stroke="${accent}"`)}</g>`
      }
      if (roofType === 'spire') {
        const spireHeight = 22 + (seed % 18)
        return `<g class="building-roof roof-spire" data-roof-type="spire">
          <path d="M${(center.x - 5).toFixed(1)} ${center.y.toFixed(1)}L${center.x.toFixed(1)} ${(center.y - spireHeight * .62).toFixed(1)}L${(center.x + 5).toFixed(1)} ${center.y.toFixed(1)}Z" fill="${mixHex(accent, theme.panel, .28)}" stroke="${accent}" stroke-width="1"/>
          <path d="M${center.x.toFixed(1)} ${(center.y - spireHeight * .58).toFixed(1)}V${(center.y - spireHeight).toFixed(1)}" stroke="${accent}" stroke-width="1.7" stroke-linecap="round"/>
          <circle cx="${center.x.toFixed(1)}" cy="${(center.y - spireHeight).toFixed(1)}" r="2" fill="${theme.danger}"/>
        </g>`
      }
      return `<g class="building-roof roof-flat" data-roof-type="flat">${polygon(roofPlot, `fill="none" stroke="${accent}" stroke-width="1.2" opacity=".72"`)}</g>`
    }

    function archetypeDetailSvg(archetype, podium, tiers, theme, accent) {
      const first = tiers[0]
      const last = tiers[tiers.length - 1]
      if (!first || !last) return ''
      if (archetype === 'courtyard') {
        const width = Math.max(7, last.width * .42)
        const depth = Math.max(6, last.depth * .42)
        const anchor = insetAnchor(last.top, last.width - width, last.depth - depth)
        return `<g class="archetype-detail archetype-courtyard">${polygon(footprintPoints(anchor, width, depth), `fill="${theme.ground}" stroke="${theme.planting}" stroke-width="1.3"`)}</g>`
      }
      if (archetype === 'terraced') {
        return `<g class="archetype-detail archetype-terraced">${tiers.map(tier => {
          const width = Math.max(5, tier.width * .3)
          const depth = Math.max(4, tier.depth * .22)
          const anchor = insetAnchor(tier.top, tier.width - width, tier.depth - depth)
          return polygon(footprintPoints(anchor, width, depth), `fill="${theme.planting}" fill-opacity=".54" stroke="${theme.planting}" stroke-width=".7"`)
        }).join('')}</g>`
      }
      if (archetype === 'arcology') {
        return `<g class="archetype-detail archetype-arcology" fill="none" stroke="${accent}" stroke-width="1" opacity=".62">
          <path d="M${first.topFar.x.toFixed(1)} ${first.topFar.y.toFixed(1)}L${first.bottomRight.x.toFixed(1)} ${first.bottomRight.y.toFixed(1)}M${first.topRight.x.toFixed(1)} ${first.topRight.y.toFixed(1)}L${first.bottomFar.x.toFixed(1)} ${first.bottomFar.y.toFixed(1)}"/>
        </g>`
      }
      if (archetype === 'gallery') {
        return `<g class="archetype-detail archetype-gallery">${polygon([podium.topLeft, podium.topFar, first.bottomFar, first.bottomLeft], `fill="${theme.material.glass}" fill-opacity=".48" stroke="${accent}" stroke-width="1"`)}</g>`
      }
      if (archetype === 'workshop') {
        const start = last.topLeft
        const end = last.topFar
        const one = interpolatePoint(start, end, .33)
        const two = interpolatePoint(start, end, .66)
        return `<path class="archetype-detail archetype-workshop" d="M${start.x.toFixed(1)} ${start.y.toFixed(1)}L${one.x.toFixed(1)} ${(one.y - 5).toFixed(1)}L${two.x.toFixed(1)} ${two.y.toFixed(1)}L${end.x.toFixed(1)} ${(end.y - 5).toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1.2"/>`
      }
      if (archetype === 'needle') {
        return `<g class="archetype-detail archetype-needle" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".7"><path d="M${podium.topLeft.x.toFixed(1)} ${podium.topLeft.y.toFixed(1)}L${first.topLeft.x.toFixed(1)} ${first.topLeft.y.toFixed(1)}M${podium.topRight.x.toFixed(1)} ${podium.topRight.y.toFixed(1)}L${first.topRight.x.toFixed(1)} ${first.topRight.y.toFixed(1)}"/></g>`
      }
      if (archetype === 'lantern') {
        return `<path class="archetype-detail archetype-lantern" d="M${last.topFar.x.toFixed(1)} ${last.topFar.y.toFixed(1)}L${last.bottomFar.x.toFixed(1)} ${last.bottomFar.y.toFixed(1)}" stroke="${accent}" stroke-width="2.4" opacity=".76"/>`
      }
      if (archetype === 'monolith') {
        const roof = roofCenter(last)
        const base = footprintCenter(first.anchor, first.width, first.depth)
        const end = interpolatePoint(roof, base, .68)
        return `<path class="archetype-detail archetype-monolith" d="M${roof.x.toFixed(1)} ${roof.y.toFixed(1)}L${end.x.toFixed(1)} ${end.y.toFixed(1)}" stroke="${accent}" stroke-width="1.6" opacity=".62"/>`
      }
      if (archetype === 'slab') {
        return `<path class="archetype-detail archetype-slab" d="M${podium.topLeft.x.toFixed(1)} ${podium.topLeft.y.toFixed(1)}L${podium.topFar.x.toFixed(1)} ${podium.topFar.y.toFixed(1)}" stroke="${accent}" stroke-width="3" opacity=".52"/>`
      }
      return `<g class="archetype-detail archetype-stacked">${tiers.map(tier => polygon(
        [tier.topFront, tier.topRight, tier.topFar, tier.topLeft],
        `fill="none" stroke="${accent}" stroke-width=".6" opacity=".36"`,
      )).join('')}</g>`
    }

    function buildingSvg(building, theme, ordinal, visible, animateReveal) {
      const base = isoPoint(building.gridX, building.gridY)
      const category = CATEGORY_ORDER.includes(building.category) ? building.category : 'other'
      const archetype = ARCHETYPE_PROFILES[building.archetype] ? building.archetype : 'stacked'
      const profile = ARCHETYPE_PROFILES[archetype]
      const material = MATERIAL_NAMES.includes(building.material) ? building.material : 'porcelain'
      const rhythm = FACADE_RHYTHMS.includes(building.facadeRhythm) ? building.facadeRhythm : 'regular'
      const roofType = ROOF_TYPES.includes(building.roofType)
        ? building.roofType
        : building.antenna
          ? 'spire'
          : building.crown
            ? 'lantern'
            : 'flat'
      const height = clamp(numberOr(building.height, 48), 24, 220)
      const podiumHeight = clamp(numberOr(building.podiumHeight, 9), 6, Math.max(6, height - 14))
      const towerHeight = Math.max(14, height - podiumHeight)
      const tierCount = clamp(Math.round(numberOr(building.tierCount, 1)), 1, 4)
      const bayCount = clamp(Math.round(numberOr(building.bayCount, 3)), 2, 8)
      const sourceWidth = clamp(numberOr(building.footprint, 30), 18, 54)
      const sourceDepth = clamp(numberOr(building.depth, 22), 14, 42)
      const towerWidth = sourceWidth * profile.width
      const towerDepth = sourceDepth * profile.depth
      const podiumWidth = towerWidth + 8
      const podiumDepth = towerDepth + 7
      const accent = theme.category[category] || theme.category.other
      const opacity = visible ? 1 : 0
      const transform = visible ? 'translate(0 0)' : 'translate(0 18px)'
      const shadowAnchor = { x: base.x + 13, y: base.y + 9 }
      let result = `<g class="sky-building" data-category="${category}" data-archetype="${archetype}" data-material="${material}" data-facade-rhythm="${rhythm}" data-bay-count="${bayCount}" data-tier-count="${tierCount}" data-roof-type="${roofType}" data-order="${ordinal}" data-visible="${visible ? 'true' : 'false'}" data-reveal="${animateReveal ? 'true' : 'false'}" style="opacity:${opacity};transform:${transform};transform-origin:${base.x}px ${base.y}px">`
      result += polygon(footprintPoints(shadowAnchor, podiumWidth, podiumDepth), `class="building-shadow" fill="${theme.shadow}" fill-opacity=".2"`)
      const podium = prismGeometry(base, podiumWidth, podiumDepth, podiumHeight)
      result += prismSvg(podium, materialFaces(theme, material, .02), 'building-podium', `data-height="${podiumHeight.toFixed(1)}"`)
      let tierAnchor = insetAnchor(podium.top, podiumWidth - towerWidth, podiumDepth - towerDepth)
      let tierWidth = towerWidth
      let tierDepth = towerDepth
      const weights = Array.from({ length: tierCount }, (_, index) => Math.pow(profile.tierBias, index))
      const totalWeight = weights.reduce((sum, value) => sum + value, 0)
      const tiers = []
      let usedHeight = 0
      for (let tierIndex = 0; tierIndex < tierCount; tierIndex += 1) {
        const tierHeight = tierIndex === tierCount - 1
          ? towerHeight - usedHeight
          : towerHeight * weights[tierIndex] / totalWeight
        const tier = prismGeometry(tierAnchor, tierWidth, tierDepth, tierHeight)
        tiers.push(tier)
        result += prismSvg(tier, materialFaces(theme, material, tierIndex * .012), 'building-tier', `data-tier="${tierIndex}"`)
        result += facadeSvg(tier, building, theme, category, rhythm, bayCount, tierIndex)
        usedHeight += tierHeight
        if (tierIndex < tierCount - 1) {
          const requested = clamp(numberOr(building.setbacks?.[tierIndex], 4), 1, 12) * profile.setback
          const nextWidth = Math.max(12, tierWidth - requested * 2)
          const nextDepth = Math.max(10, tierDepth - requested * 1.45)
          tierAnchor = insetAnchor(tier.top, tierWidth - nextWidth, tierDepth - nextDepth)
          tierWidth = nextWidth
          tierDepth = nextDepth
        }
      }
      result += archetypeDetailSvg(archetype, podium, tiers, theme, accent)
      result += roofSvg(roofType, tiers[tiers.length - 1], theme, accent, numberOr(building.seed))
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
      let svg = `<g class="city-ground">${polygon(points, `fill="${theme.ground}" stroke="${theme.grid}" stroke-width="1.5"`)}`
      for (let index = -5; index <= 6; index += 1) {
        const fromA = isoPoint(index, -5)
        const toA = isoPoint(index, 6)
        const fromB = isoPoint(-5, index)
        const toB = isoPoint(6, index)
        svg += `<path class="plot-grid" d="M${fromA.x} ${fromA.y}L${toA.x} ${toA.y}M${fromB.x} ${fromB.y}L${toB.x} ${toB.y}" stroke="${theme.grid}" stroke-width=".8" opacity=".34"/>`
      }
      const roadAxes = [
        [isoPoint(-5, -.55), isoPoint(6, -.55)],
        [isoPoint(-5, .55), isoPoint(6, .55)],
        [isoPoint(-.55, -5), isoPoint(-.55, 6)],
        [isoPoint(.55, -5), isoPoint(.55, 6)],
      ]
      for (const [from, to] of roadAxes) {
        svg += `<path class="city-road" d="M${from.x} ${from.y}L${to.x} ${to.y}" stroke="${theme.road}" stroke-width="10" stroke-linecap="square"/>`
        svg += `<path class="road-centerline" d="M${from.x} ${from.y}L${to.x} ${to.y}" stroke="${theme.roadLine}" stroke-width="1" stroke-dasharray="7 6" opacity=".82"/>`
      }
      for (const [gridX, gridY] of [[-4, -2], [4, 2], [-2, 4], [3, -3]]) {
        const anchor = isoPoint(gridX, gridY)
        const park = footprintPoints(anchor, 20, 15)
        const center = { x: anchor.x - 2.5, y: anchor.y + 8.4 }
        svg += `<g class="pocket-park">${polygon(park, `fill="${mixHex(theme.planting, theme.panel, .36)}" stroke="${theme.planting}" stroke-width="1"`)}<circle cx="${center.x}" cy="${center.y - 5}" r="4" fill="${theme.planting}"/><path d="M${center.x} ${center.y - 2}v6" stroke="${mixHex(theme.planting, theme.text, .28)}" stroke-width="1.2"/></g>`
      }
      const plaza = isoPoint(0, 0)
      svg += `<g class="civic-plaza">
        <ellipse cx="${plaza.x}" cy="${plaza.y + 8}" rx="46" ry="23" fill="${theme.panel}" stroke="${theme.grid}" stroke-width="2"/>
        <ellipse cx="${plaza.x}" cy="${plaza.y + 8}" rx="29" ry="14" fill="none" stroke="${theme.accent2}" stroke-width="1.4"/>
        <ellipse cx="${plaza.x}" cy="${plaza.y + 8}" rx="11" ry="5.5" fill="${theme.water}" stroke="${theme.accent}" stroke-width="1"/>
        <path d="M${plaza.x} ${plaza.y + 7}v-18" stroke="${theme.accent}" stroke-width="1.5"/><circle cx="${plaza.x}" cy="${plaza.y - 12}" r="2" fill="${theme.accent}"/>
      </g>`
      return `${svg}</g>`
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
      const theme = THEMES[options.theme] || THEMES.paper
      const width = 1200
      const height = 720
      const layout = options.layout === 'scene' ? 'scene' : 'card'
      const scene = layout === 'scene'
      const viewBox = scene ? '350 20 900 540' : `0 0 ${width} ${height}`
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
      const metadataPanel = scene ? '' : `
        <rect x="30" y="30" width="358" height="660" rx="24" fill="${theme.panel}" fill-opacity=".92" stroke="${theme.grid}"/>
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
        </g>`
      const cardFooter = scene ? '' : `
        <g class="card-footer" transform="translate(1015 656)">
          <text text-anchor="end" fill="${theme.muted}" font-size="10" font-weight="700" letter-spacing="1">BUILT FROM SIGNALS, NOT CONTENT</text>
          <text x="124" text-anchor="end" y="22" fill="${theme.text}" font-size="12" font-weight="720">${visibleCount}/${model.buildings.length} TOWERS ONLINE</text>
        </g>`
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" role="img" aria-labelledby="sky-title sky-desc" data-theme="${theme.id}" data-layout="${layout}">
      <title id="sky-title">${escapeXml(title)} — Agent Skyline</title>
      <desc id="sky-desc">A privacy-safe procedural city generated from coarse Agent activity counts.</desc>
      <defs>
        <style>@keyframes sky-rise{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}.sky-building[data-reveal="true"]{animation:sky-rise .42s cubic-bezier(.2,.8,.2,1) both}@media (prefers-reduced-motion:reduce){.sky-building[data-reveal="true"]{animation:none}}</style>
        <pattern id="sky-drafting-grid" width="34" height="18" patternUnits="userSpaceOnUse"><path d="M0 18L34 0M0 0L34 18" fill="none" stroke="${theme.grid}" stroke-width=".55" opacity=".3"/></pattern>
        <clipPath id="sky-round"><rect x="0" y="0" width="1200" height="720" rx="30"/></clipPath>
      </defs>
      <g${scene ? '' : ' clip-path="url(#sky-round)"'}>
        <rect x="${scene ? 350 : 0}" y="${scene ? 20 : 0}" width="${scene ? 900 : 1200}" height="${scene ? 540 : 720}" fill="${theme.background}"/>
        <rect x="${scene ? 350 : 402}" y="${scene ? 20 : 0}" width="${scene ? 900 : 798}" height="${scene ? 540 : 720}" fill="url(#sky-drafting-grid)" opacity=".72"/>
        <g opacity=".98">${renderGround(theme)}</g>
        <g>${buildingLayer}</g>
    ${metadataPanel}
    ${cardFooter}
      </g>
    ${scene ? '' : `<rect class="card-border" x=".75" y=".75" width="1198.5" height="718.5" rx="29.25" fill="none" stroke="${theme.grid}" stroke-width="1.5"/>`}
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

      return { SKYLINE_SCHEMA_VERSION, HISTORY_STORAGE_KEY, CATEGORY_ORDER, CATEGORY_META, THEMES, hashString, escapeXml, getFocusableElements, getFocusTrapTarget, copyTextWithFallback, normalizeSessionNodes, summarizeEvents, createSessionSnapshot, createEmptyHistory, parseHistory, upsertHistory, summarizeHistory, generateBuildings, buildSkyline, buildSkylineFromMetrics, renderSkylineSvg, buildShareCaption, dataUrlForSvg };
    })();
    "use strict";

    const React = require("react");
    const ReactDOM = require("react-dom");
    const {
      createElement: h,
      useCallback,
      useEffect,
      useLayoutEffect,
      useMemo,
      useRef,
      useState,
    } = React;

    const PACKAGE_ID = "dsh-agent-skyline";
    const NS = "agentSkyline";
    const HISTORY_KEY = CORE.HISTORY_STORAGE_KEY;
    const LABEL_KEY = "dsh-agent-skyline:project-label";
    const THEME_KEY = "dsh-agent-skyline:theme";
    const RANGE_OPTIONS = ["session", "today", "week", "all"];
    const THEME_OPTIONS = ["midnight", "aurora", "sunset", "paper"];

    const zh = {
      title: "Agent 天际线",
      "trigger.aria": "打开 Agent 天际线，共 {count} 个城市街区",
      privacy: "本地生成 · 内容零外传",
      "status.live": "城市正在生长",
      "status.ready": "城市快照已就绪",
      "range.session": "本次会话",
      "range.today": "今天",
      "range.week": "近 7 天",
      "range.all": "全部历史",
      "range.session.short": "SESSION CITY",
      "range.today.short": "TODAY CITY",
      "range.week.short": "7-DAY CITY",
      "range.all.short": "LEGACY CITY",
      "control.play": "播放建城",
      "control.pause": "暂停",
      "control.restart": "重新播放",
      "control.exportSvg": "导出 SVG",
      "control.exportPng": "导出 PNG",
      "control.copy": "复制分享文案",
      "control.copied": "分享文案已复制",
      "control.copyFailed": "自动复制失败，文案已显示在侧栏",
      "control.copyManual": "手动复制分享文案",
      "control.dismiss": "关闭",
      "control.exported": "城市卡片已导出",
      "control.exportFallback": "PNG 生成失败，已改为导出 SVG",
      "control.close": "关闭 Agent 天际线",
      "control.reset": "清除本地历史",
      "control.resetDone": "本地历史已清除",
      "control.resetTitle": "清除本地历史？",
      "control.resetCancel": "取消",
      "control.resetAction": "确认清除",
      "control.resetConfirm":
        "清除 Agent 天际线保存在此浏览器中的全部历史？此操作不会影响 DSH 会话。",
      "label.title": "项目署名",
      "label.hint": "默认不读取项目名或路径，可自行填写公开名称。",
      "label.placeholder": "PRIVATE PROJECT",
      "theme.title": "城市气候",
      "theme.midnight": "蓝图",
      "theme.aurora": "花园",
      "theme.sunset": "陶土",
      "theme.paper": "纸面",
      "timeline.title": "建城进度",
      "metrics.blocks": "城市街区",
      "metrics.tools": "工具动作",
      "metrics.recoveries": "失败恢复",
      "metrics.time": "活跃分钟",
      identity: "城市身份",
      landmarks: "已解锁地标",
      empty: "完成第一轮 Agent 工作后，这里会长出第一栋建筑。",
      footer:
        "只使用类别、次数、状态与时间；不会导出提示词、回复、命令、文件路径或参数。",
    };

    const en = {
      title: "Agent Skyline",
      "trigger.aria": "Open Agent Skyline with {count} city blocks",
      privacy: "Local-only · zero content export",
      "status.live": "The city is growing",
      "status.ready": "City snapshot ready",
      "range.session": "This session",
      "range.today": "Today",
      "range.week": "Last 7 days",
      "range.all": "All history",
      "range.session.short": "SESSION CITY",
      "range.today.short": "TODAY CITY",
      "range.week.short": "7-DAY CITY",
      "range.all.short": "LEGACY CITY",
      "control.play": "Play construction",
      "control.pause": "Pause",
      "control.restart": "Replay",
      "control.exportSvg": "Export SVG",
      "control.exportPng": "Export PNG",
      "control.copy": "Copy share caption",
      "control.copied": "Share caption copied",
      "control.copyFailed": "Copy failed; the caption is shown for manual copy.",
      "control.copyManual": "Copy caption manually",
      "control.dismiss": "Dismiss",
      "control.exported": "City card exported",
      "control.exportFallback": "PNG failed; exported SVG instead",
      "control.close": "Close Agent Skyline",
      "control.reset": "Clear local history",
      "control.resetDone": "Local history cleared",
      "control.resetTitle": "Clear local history?",
      "control.resetCancel": "Cancel",
      "control.resetAction": "Clear history",
      "control.resetConfirm":
        "Clear all Agent Skyline history stored in this browser? DSH sessions are not affected.",
      "label.title": "Public project label",
      "label.hint":
        "Project names and paths are never read automatically. Add a public label only when safe.",
      "label.placeholder": "PRIVATE PROJECT",
      "theme.title": "City climate",
      "theme.midnight": "Blueprint",
      "theme.aurora": "Garden",
      "theme.sunset": "Terracotta",
      "theme.paper": "Paper",
      "timeline.title": "Construction progress",
      "metrics.blocks": "City blocks",
      "metrics.tools": "Tool moves",
      "metrics.recoveries": "Recoveries",
      "metrics.time": "Active minutes",
      identity: "City identity",
      landmarks: "Unlocked landmarks",
      empty:
        "Complete the first Agent turn and your first building will appear here.",
      footer:
        "Only categories, counts, states, and timing are used. Prompts, replies, commands, paths, and arguments never enter exports.",
    };

    function sameArray(left, right) {
      if (left === right) return true;
      if (
        !Array.isArray(left) ||
        !Array.isArray(right) ||
        left.length !== right.length
      )
        return false;
      for (let index = 0; index < left.length; index += 1)
        if (left[index] !== right[index]) return false;
      return true;
    }

    function safeStorageGet(key, fallback = "") {
      try {
        return window.localStorage.getItem(key) ?? fallback;
      } catch {
        return fallback;
      }
    }

    function safeStorageSet(key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    }

    function safeStorageRemove(key) {
      try {
        window.localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }

    function formatCount(value) {
      try {
        return new Intl.NumberFormat().format(Number(value) || 0);
      } catch {
        return String(value || 0);
      }
    }

    function SkylineMark({ className }) {
      return h(
        "svg",
        { className, viewBox: "0 0 22 22", fill: "none", "aria-hidden": true },
        h("path", {
          d: "M2.5 18.5h17M4.5 18.5V10l4-2.5v11M10 18.5V5.5l4-2.5v15.5M15.5 18.5V9l3-1.7v11.2",
          stroke: "currentColor",
          strokeWidth: 1.55,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        h("path", {
          d: "M6.2 12.2h.1M6.2 15h.1M12.2 8.3h.1M12.2 11.3h.1M12.2 14.3h.1M17.2 11.2h.1M17.2 14h.1",
          stroke: "currentColor",
          strokeWidth: 2.2,
          strokeLinecap: "round",
        }),
      );
    }

    function CloseMark() {
      return h(
        "svg",
        { viewBox: "0 0 18 18", fill: "none", "aria-hidden": true },
        h("path", {
          d: "m4 4 10 10M14 4 4 14",
          stroke: "currentColor",
          strokeWidth: 1.7,
          strokeLinecap: "round",
        }),
      );
    }

    function PlayMark({ playing }) {
      return h(
        "svg",
        { viewBox: "0 0 18 18", fill: "none", "aria-hidden": true },
        playing
          ? h(
              React.Fragment,
              null,
              h("rect", {
                x: 4.5,
                y: 3.5,
                width: 3.2,
                height: 11,
                rx: 1,
                fill: "currentColor",
              }),
              h("rect", {
                x: 10.3,
                y: 3.5,
                width: 3.2,
                height: 11,
                rx: 1,
                fill: "currentColor",
              }),
            )
          : h("path", { d: "m6 4 8 5-8 5z", fill: "currentColor" }),
      );
    }

    function DownloadMark() {
      return h(
        "svg",
        { viewBox: "0 0 18 18", fill: "none", "aria-hidden": true },
        h("path", {
          d: "M9 2.8v8.4m0 0 3-3m-3 3-3-3M3.2 13v2h11.6v-2",
          stroke: "currentColor",
          strokeWidth: 1.55,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
      );
    }

    function CopyMark() {
      return h(
        "svg",
        { viewBox: "0 0 18 18", fill: "none", "aria-hidden": true },
        h("rect", {
          x: 5.8,
          y: 5.8,
          width: 8.4,
          height: 8.4,
          rx: 1.7,
          stroke: "currentColor",
          strokeWidth: 1.45,
        }),
        h("path", {
          d: "M11.7 5.8V3.6H3.6v8.1h2.2",
          stroke: "currentColor",
          strokeWidth: 1.45,
          strokeLinecap: "round",
        }),
      );
    }

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    }

    function exportSvg(svg, filename) {
      downloadBlob(
        new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
        filename,
      );
    }

    function exportPng(svg, filename) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 2400;
            canvas.height = 1440;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob(
              (png) => {
                if (!png) {
                  reject(new Error("PNG encoding failed"));
                  return;
                }
                downloadBlob(png, filename);
                resolve();
              },
              "image/png",
              0.96,
            );
          } catch (error) {
            URL.revokeObjectURL(url);
            reject(error);
          }
        };
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("SVG rasterization failed"));
        };
        image.src = url;
      });
    }

    function MetricPill({ label, value }) {
      return h(
        "div",
        { className: "dsh-skyline-metric" },
        h("span", { className: "dsh-skyline-metric-value" }, formatCount(value)),
        h("span", { className: "dsh-skyline-metric-label" }, label),
      );
    }

    function SkylineDialog({
      close,
      model,
      setRange,
      range,
      theme,
      setTheme,
      label,
      setLabel,
      history,
      clearHistory,
      running,
      t,
    }) {
      const [visibleCount, setVisibleCount] = useState(model.buildings.length);
      const [playing, setPlaying] = useState(false);
      const [notice, setNotice] = useState("");
      const [confirmingReset, setConfirmingReset] = useState(false);
      const [manualCaption, setManualCaption] = useState("");
      const panelRef = useRef(null);
      const confirmingResetRef = useRef(false);
      const resetButtonRef = useRef(null);
      const resetCancelRef = useRef(null);
      const resetConfirmationRef = useRef(null);
      const resetFocusOutcomeRef = useRef(null);
      const copyButtonRef = useRef(null);
      const manualCaptionRef = useRef(null);
      const noticeTimerRef = useRef(null);
      const copyOperationRef = useRef(0);
      const pngOperationRef = useRef(0);

      useEffect(() => {
        setVisibleCount(model.buildings.length);
        setPlaying(false);
      }, [model.seed, model.buildings.length]);

      useEffect(() => {
        if (!playing || model.buildings.length === 0) return undefined;
        const timer = window.setInterval(() => {
          setVisibleCount((current) => {
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

      useLayoutEffect(() => {
        const onKeyDown = (event) => {
          const panel = panelRef.current;
          if (!panel) return;
          if (event.key === "Escape") {
            event.preventDefault();
            if (confirmingResetRef.current) {
              confirmingResetRef.current = false;
              resetFocusOutcomeRef.current = "trigger";
              setConfirmingReset(false);
            } else {
              close();
            }
            return;
          }
          if (event.key !== "Tab") return;
          const focusRoot = confirmingResetRef.current
            ? resetConfirmationRef.current
            : panel;
          if (!focusRoot) return;
          const target = CORE.getFocusTrapTarget(
            focusRoot,
            document.activeElement,
            event.shiftKey,
          );
          if (target) {
            event.preventDefault();
            target.focus();
          }
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        queueMicrotask(() => panelRef.current?.focus());
        return () => {
          document.removeEventListener("keydown", onKeyDown);
          document.body.style.overflow = previousOverflow;
        };
      }, [close]);

      useLayoutEffect(() => {
        confirmingResetRef.current = confirmingReset;
        if (confirmingReset) {
          resetCancelRef.current?.focus();
          return;
        }
        const outcome = resetFocusOutcomeRef.current;
        resetFocusOutcomeRef.current = null;
        if (outcome === "trigger") resetButtonRef.current?.focus();
        if (outcome === "panel") panelRef.current?.focus();
      }, [confirmingReset]);

      useLayoutEffect(() => {
        if (!manualCaption) return;
        manualCaptionRef.current?.focus();
        manualCaptionRef.current?.select();
      }, [manualCaption]);

      useEffect(
        () => () => {
          if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
        },
        [],
      );

      const showNotice = (message) => {
        setNotice(message);
        if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2200);
      };

      const renderOptions = {
        theme,
        projectLabel: label || t("label.placeholder"),
        rangeLabel: t(`range.${range}.short`),
      };
      const svg = useMemo(
        () =>
          CORE.renderSkylineSvg(model, {
            ...renderOptions,
            layout: "scene",
            visibleCount,
            animateReveal: playing,
          }),
        [model, theme, visibleCount, playing, label, range, t],
      );
      const exportSvgText = useMemo(
        () =>
          CORE.renderSkylineSvg(model, {
            ...renderOptions,
            layout: "card",
            visibleCount: model.buildings.length,
            animateReveal: false,
          }),
        [model, theme, label, range, t],
      );

      const filenameBase = `agent-skyline-${range}-${model.identity.code.toLowerCase()}`;
      const startPlayback = () => {
        if (model.buildings.length === 0) return;
        if (playing) {
          setPlaying(false);
          return;
        }
        if (visibleCount >= model.buildings.length) setVisibleCount(0);
        setPlaying(true);
      };
      const saveSvg = () => {
        exportSvg(exportSvgText, `${filenameBase}.svg`);
        showNotice(t("control.exported"));
      };
      const savePng = async () => {
        const operation = ++pngOperationRef.current;
        try {
          await exportPng(exportSvgText, `${filenameBase}.png`);
          if (operation === pngOperationRef.current)
            showNotice(t("control.exported"));
        } catch {
          exportSvg(exportSvgText, `${filenameBase}.svg`);
          if (operation === pngOperationRef.current)
            showNotice(t("control.exportFallback"));
        }
      };
      const copyCaption = async () => {
        const operation = ++copyOperationRef.current;
        const caption = CORE.buildShareCaption(model, {
          rangeLabel: t(`range.${range}`),
        });
        const copied = await CORE.copyTextWithFallback(caption);
        if (operation !== copyOperationRef.current) return;
        if (copied) {
          setManualCaption("");
          showNotice(t("control.copied"));
          queueMicrotask(() => copyButtonRef.current?.focus());
        } else {
          setManualCaption(caption);
          showNotice(t("control.copyFailed"));
        }
      };
      const openResetConfirmation = () => {
        confirmingResetRef.current = true;
        resetFocusOutcomeRef.current = null;
        setConfirmingReset(true);
      };
      const closeResetConfirmation = () => {
        confirmingResetRef.current = false;
        resetFocusOutcomeRef.current = "trigger";
        setConfirmingReset(false);
      };
      const resetHistory = () => {
        clearHistory();
        confirmingResetRef.current = false;
        resetFocusOutcomeRef.current = "panel";
        setConfirmingReset(false);
        showNotice(t("control.resetDone"));
      };

      return h(
        "div",
        {
          className: "dsh-skyline-backdrop",
          onPointerDown: (event) => {
            if (
              event.currentTarget === event.target &&
              !confirmingResetRef.current
            )
              close();
          },
        },
        h(
          "section",
          {
            ref: panelRef,
            className: "dsh-skyline-panel",
            role: "dialog",
            "aria-modal": true,
            "aria-labelledby": "dsh-skyline-title",
            tabIndex: -1,
          },
          h(
            "header",
            {
              className: "dsh-skyline-header",
              inert: confirmingReset ? "" : undefined,
              "aria-hidden": confirmingReset || undefined,
            },
            h(
              "div",
              { className: "dsh-skyline-brand" },
              h("span", { className: "dsh-skyline-brand-mark" }, h(SkylineMark)),
              h(
                "div",
                null,
                h("h2", { id: "dsh-skyline-title" }, t("title")),
                h("p", null, running ? t("status.live") : t("status.ready")),
              ),
            ),
            h(
              "div",
              { className: "dsh-skyline-header-right" },
              h(
                "span",
                { className: "dsh-skyline-privacy" },
                h("span", { "aria-hidden": true }, "●"),
                t("privacy"),
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "dsh-skyline-icon-button",
                  onClick: close,
                  title: t("control.close"),
                  "aria-label": t("control.close"),
                },
                h(CloseMark),
              ),
            ),
          ),
          h(
            "div",
            {
              className: "dsh-skyline-tabs",
              "aria-label": t("title"),
              inert: confirmingReset ? "" : undefined,
              "aria-hidden": confirmingReset || undefined,
            },
            RANGE_OPTIONS.map((option) =>
              h(
                "button",
                {
                  key: option,
                  type: "button",
                  "aria-pressed": range === option,
                  className: "dsh-skyline-tab",
                  "data-active": range === option ? "true" : undefined,
                  onClick: () => setRange(option),
                },
                t(`range.${option}`),
              ),
            ),
          ),
          h(
            "div",
            {
              className: "dsh-skyline-body",
              inert: confirmingReset ? "" : undefined,
              "aria-hidden": confirmingReset || undefined,
            },
            h(
              "main",
              { className: "dsh-skyline-stage-column" },
              h(
                "div",
                { className: "dsh-skyline-stage", "data-theme": theme },
                h("div", {
                  className: "dsh-skyline-stage-art",
                  // CORE emits a self-contained SVG and XML-escapes every user-facing string.
                  // Privacy and injection regression tests guard this trusted renderer boundary.
                  dangerouslySetInnerHTML: { __html: svg },
                }),
                model.metrics.totalEvents === 0
                  ? h("p", { className: "dsh-skyline-empty" }, t("empty"))
                  : null,
              ),
              h(
                "div",
                { className: "dsh-skyline-player" },
                h(
                  "button",
                  {
                    type: "button",
                    className: "dsh-skyline-play",
                    onClick: startPlayback,
                    disabled: model.buildings.length === 0,
                  },
                  h(PlayMark, { playing }),
                  h(
                    "span",
                    null,
                    playing
                      ? t("control.pause")
                      : visibleCount >= model.buildings.length
                        ? t("control.restart")
                        : t("control.play"),
                  ),
                ),
                h(
                  "label",
                  { className: "dsh-skyline-scrubber" },
                  h("span", null, t("timeline.title")),
                  h("input", {
                    type: "range",
                    min: 0,
                    max: model.buildings.length,
                    value: visibleCount,
                    disabled: model.buildings.length === 0,
                    onChange: (event) => {
                      setPlaying(false);
                      setVisibleCount(Number(event.target.value));
                    },
                    "aria-label": t("timeline.title"),
                  }),
                ),
                h(
                  "span",
                  { className: "dsh-skyline-progress" },
                  `${visibleCount}/${model.buildings.length}`,
                ),
              ),
              h(
                "div",
                { className: "dsh-skyline-metrics-row" },
                h(MetricPill, {
                  label: t("metrics.blocks"),
                  value: model.metrics.totalEvents,
                }),
                h(MetricPill, {
                  label: t("metrics.tools"),
                  value: model.metrics.toolEvents,
                }),
                h(MetricPill, {
                  label: t("metrics.recoveries"),
                  value: model.metrics.recoveries,
                }),
                h(MetricPill, {
                  label: t("metrics.time"),
                  value: model.metrics.activeMinutes,
                }),
              ),
            ),
            h(
              "aside",
              { className: "dsh-skyline-controls" },
              h(
                "section",
                { className: "dsh-skyline-control-section" },
                h(
                  "div",
                  { className: "dsh-skyline-section-kicker" },
                  t("identity"),
                ),
                h(
                  "div",
                  { className: "dsh-skyline-identity-card" },
                  h(
                    "span",
                    { className: "dsh-skyline-city-code" },
                    model.identity.code,
                  ),
                  h("strong", null, model.identity.cityName),
                  h(
                    "span",
                    null,
                    `${model.identity.archetype} · ${model.identity.district}`,
                  ),
                ),
              ),
              h(
                "section",
                { className: "dsh-skyline-control-section" },
                h(
                  "label",
                  {
                    className: "dsh-skyline-field-label",
                    htmlFor: "dsh-skyline-label",
                  },
                  t("label.title"),
                ),
                h("input", {
                  id: "dsh-skyline-label",
                  className: "dsh-skyline-input",
                  value: label,
                  placeholder: t("label.placeholder"),
                  maxLength: 42,
                  onChange: (event) => setLabel(event.target.value),
                }),
                h("p", { className: "dsh-skyline-field-hint" }, t("label.hint")),
              ),
              h(
                "section",
                { className: "dsh-skyline-control-section" },
                h(
                  "div",
                  { className: "dsh-skyline-section-kicker" },
                  t("theme.title"),
                ),
                h(
                  "div",
                  { className: "dsh-skyline-theme-grid" },
                  THEME_OPTIONS.map((option) =>
                    h(
                      "button",
                      {
                        key: option,
                        type: "button",
                        className: "dsh-skyline-theme",
                        "data-active": theme === option ? "true" : undefined,
                        "data-theme": option,
                        onClick: () => setTheme(option),
                        "aria-pressed": theme === option,
                        "aria-label": t(`theme.${option}`),
                        title: t(`theme.${option}`),
                      },
                      h(
                        "span",
                        {
                          className: "dsh-skyline-theme-bars",
                          "aria-hidden": true,
                        },
                        h("span", null),
                        h("span", null),
                        h("span", null),
                      ),
                      h(
                        "span",
                        { className: "dsh-skyline-theme-name" },
                        t(`theme.${option}`),
                      ),
                    ),
                  ),
                ),
              ),
              h(
                "section",
                { className: "dsh-skyline-control-section" },
                h(
                  "div",
                  { className: "dsh-skyline-section-kicker" },
                  t("landmarks"),
                ),
                h(
                  "div",
                  { className: "dsh-skyline-landmarks" },
                  model.landmarks.length
                    ? model.landmarks.map((item) =>
                        h("span", { key: item.id }, item.label),
                      )
                    : h(
                        "span",
                        { className: "dsh-skyline-landmark-locked" },
                        "···",
                      ),
                ),
              ),
              h(
                "section",
                { className: "dsh-skyline-export-grid" },
                h(
                  "button",
                  {
                    type: "button",
                    className: "dsh-skyline-primary-button",
                    onClick: savePng,
                  },
                  h(DownloadMark),
                  t("control.exportPng"),
                ),
                h(
                  "button",
                  {
                    type: "button",
                    className: "dsh-skyline-secondary-button",
                    onClick: saveSvg,
                  },
                  h(DownloadMark),
                  t("control.exportSvg"),
                ),
                h(
                  "button",
                  {
                    ref: copyButtonRef,
                    type: "button",
                    className:
                      "dsh-skyline-secondary-button dsh-skyline-copy-button",
                    onClick: copyCaption,
                  },
                  h(CopyMark),
                  t("control.copy"),
                ),
              ),
              manualCaption
                ? h(
                    "section",
                    { className: "dsh-skyline-copy-fallback" },
                    h(
                      "label",
                      {
                        className: "dsh-skyline-field-label",
                        htmlFor: "dsh-skyline-manual-caption",
                      },
                      t("control.copyManual"),
                    ),
                    h("textarea", {
                      ref: manualCaptionRef,
                      id: "dsh-skyline-manual-caption",
                      className: "dsh-skyline-copy-textarea",
                      readOnly: true,
                      rows: 5,
                      value: manualCaption,
                      onFocus: (event) => event.currentTarget.select(),
                    }),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "dsh-skyline-copy-dismiss",
                        onClick: () => {
                          setManualCaption("");
                          queueMicrotask(() => copyButtonRef.current?.focus());
                        },
                      },
                      t("control.dismiss"),
                    ),
                  )
                : null,
              h(
                "button",
                {
                  ref: resetButtonRef,
                  type: "button",
                  className: "dsh-skyline-reset",
                  onClick: openResetConfirmation,
                  disabled: Object.keys(history.sessions || {}).length === 0,
                  "aria-expanded": confirmingReset,
                  "aria-controls": "dsh-skyline-reset-confirmation",
                },
                t("control.reset"),
              ),
            ),
          ),
          h(
            "footer",
            {
              className: "dsh-skyline-footer",
              inert: confirmingReset ? "" : undefined,
              "aria-hidden": confirmingReset || undefined,
            },
            h(
              "span",
              { className: "dsh-skyline-footer-shield", "aria-hidden": true },
              "◆",
            ),
            h("span", null, t("footer")),
          ),
          confirmingReset
            ? h(
                "div",
                { className: "dsh-skyline-reset-layer" },
                h(
                  "div",
                  {
                    ref: resetConfirmationRef,
                    id: "dsh-skyline-reset-confirmation",
                    className: "dsh-skyline-reset-confirmation",
                    role: "alertdialog",
                    "aria-modal": true,
                    "aria-labelledby": "dsh-skyline-reset-title",
                    "aria-describedby": "dsh-skyline-reset-description",
                  },
                  h(
                    "strong",
                    { id: "dsh-skyline-reset-title" },
                    t("control.resetTitle"),
                  ),
                  h(
                    "p",
                    { id: "dsh-skyline-reset-description" },
                    t("control.resetConfirm"),
                  ),
                  h(
                    "div",
                    { className: "dsh-skyline-reset-actions" },
                    h(
                      "button",
                      {
                        ref: resetCancelRef,
                        type: "button",
                        className: "dsh-skyline-reset-cancel",
                        onClick: closeResetConfirmation,
                      },
                      t("control.resetCancel"),
                    ),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "dsh-skyline-reset-confirm",
                        onClick: resetHistory,
                      },
                      t("control.resetAction"),
                    ),
                  ),
                ),
              )
            : null,
          notice
            ? h("div", { className: "dsh-skyline-toast", role: "status" }, notice)
            : null,
        ),
      );
    }

    function AgentSkylineAction({ sessionId, useSession, t }) {
      const chatNodes = useSession(
        (state) => state?.chat?.nodes?.values?.() || [],
        sameArray,
      );
      const running = Boolean(useSession((state) => state?.running));
      const [open, setOpen] = useState(false);
      const [range, setRange] = useState("session");
      const [theme, setThemeState] = useState(() => {
        const saved = safeStorageGet(THEME_KEY, "paper");
        return THEME_OPTIONS.includes(saved) ? saved : "paper";
      });
      const [label, setLabelState] = useState(() => safeStorageGet(LABEL_KEY, ""));
      const [history, setHistory] = useState(() =>
        CORE.parseHistory(safeStorageGet(HISTORY_KEY, "")),
      );
      const triggerRef = useRef(null);

      const events = useMemo(
        () => CORE.normalizeSessionNodes(chatNodes),
        [chatNodes],
      );
      const sessionSnapshot = useMemo(
        () =>
          CORE.createSessionSnapshot(chatNodes, {
            sessionKey: sessionId,
            capturedAt: Date.now(),
          }),
        [chatNodes, sessionId],
      );

      useEffect(() => {
        if (!chatNodes.length) return;
        setHistory((current) => {
          const next = CORE.upsertHistory(current, sessionSnapshot);
          safeStorageSet(HISTORY_KEY, JSON.stringify(next));
          return next;
        });
      }, [chatNodes.length, sessionSnapshot]);

      useEffect(() => {
        setRange("session");
      }, [sessionId]);

      const currentModel = useMemo(() => {
        if (range === "session")
          return CORE.buildSkyline({
            events,
            sessionKey: sessionId,
            projectLabel: label,
            rangeLabel: t("range.session.short"),
          });
        const summary = CORE.summarizeHistory(history, { range, now: Date.now() });
        const metricSignature = CORE.CATEGORY_ORDER.map(
          (category) => summary.metrics.categoryCounts[category] || 0,
        ).join(":");
        return CORE.buildSkylineFromMetrics(summary.metrics, {
          seed: `${range}:${summary.snapshotCount}:${metricSignature}:${summary.metrics.recoveries}:${summary.metrics.completionRate}`,
          projectLabel: label,
          rangeLabel: t(`range.${range}.short`),
        });
      }, [range, events, history, sessionId, label, t]);

      const setTheme = (value) => {
        setThemeState(value);
        safeStorageSet(THEME_KEY, value);
      };
      const setLabel = (value) => {
        setLabelState(value);
        safeStorageSet(LABEL_KEY, value);
      };
      const clearHistory = () => {
        const empty = CORE.createEmptyHistory();
        setHistory(empty);
        safeStorageRemove(HISTORY_KEY);
        setRange("session");
      };
      const close = useCallback(() => {
        setOpen(false);
        queueMicrotask(() => triggerRef.current?.focus());
      }, []);
      const count = events.length;

      return h(
        "div",
        { className: "dsh-skyline-root" },
        h(
          "button",
          {
            ref: triggerRef,
            type: "button",
            className: "dsh-skyline-trigger",
            "aria-expanded": open,
            "aria-label": t("trigger.aria", { count }),
            onClick: () => setOpen((value) => !value),
          },
          h(SkylineMark, { className: "dsh-skyline-trigger-mark" }),
          h("span", { className: "dsh-skyline-trigger-label" }, t("title")),
          running
            ? h("span", { className: "dsh-skyline-live-dot", "aria-hidden": true })
            : null,
          count > 0
            ? h(
                "span",
                { className: "dsh-skyline-trigger-count", "aria-hidden": true },
                count > 999 ? "999+" : count,
              )
            : null,
        ),
        open
          ? ReactDOM.createPortal(
              h(SkylineDialog, {
                close,
                model: currentModel,
                range,
                setRange,
                theme,
                setTheme,
                label,
                setLabel,
                history,
                clearHistory,
                running,
                t,
              }),
              document.body,
            )
          : null,
      );
    }

    const inject = ["sessions", "slots", "locale"];

    function apply(ctx) {
      ctx.effect(() => {
        const tag = document.createElement("style");
        tag.dataset.plugin = PACKAGE_ID;
        tag.dataset.pluginCss = `${PACKAGE_ID}/main`;
        tag.textContent = STYLE_TEXT;
        document.head.appendChild(tag);
        return () => tag.remove();
      }, "agent-skyline: styles");
      ctx.effect(
        () => ctx.locale.register(NS, { zh, en }),
        "agent-skyline: dictionaries",
      );
      ctx.slots.inject("conversation.session.header.actions", () =>
        ctx.slots.register(
          {
            name: "conversation.session.header.actions",
            id: "agent-skyline",
            order: 16,
            locale: NS,
            inject: () => ({}),
          },
          AgentSkylineAction,
        ),
      );
    }

    exports.inject = inject;
    exports.apply = apply;

    return module.exports;
  },
});

'use strict';

(() => {
  const core = window.AgentSkylineCore;
  if (!core) throw new Error('AgentSkylineCore was not loaded');

  const base = Date.UTC(2026, 7, 26, 7, 30);
  const createSessionNodes = () => {
    const nodes = [];
    const push = (toolName, status = 'completed', durationMs = 400, offset = nodes.length * 2_000, extra = {}) => {
      nodes.push({ kind: 'tool-call', toolName, status, durationMs, createdAt: base + offset, ...extra });
    };
    nodes.push({ kind: 'user-message', createdAt: base });
    nodes.push({ kind: 'assistant-thinking', createdAt: base + 900 });
    for (let index = 0; index < 10; index += 1) push(index % 3 ? 'read_file' : 'grep', 'completed', 180 + index * 17);
    for (let index = 0; index < 9; index += 1) push(index % 2 ? 'apply_patch' : 'write_file', 'completed', 420 + index * 31);
    for (let index = 0; index < 6; index += 1) push(index % 2 ? 'bash' : 'terminal_exec', index === 2 ? 'failed' : 'completed', 650 + index * 74, undefined, index === 2 ? { error: 'synthetic' } : {});
    push('bash', 'completed', 720);
    for (let index = 0; index < 8; index += 1) push(index % 2 ? 'vitest' : 'playwright_test', index === 1 ? 'failed' : 'passed', 900 + index * 105, undefined, index === 1 ? { error: 'synthetic' } : {});
    push('playwright_test', 'passed', 1800);
    for (let index = 0; index < 6; index += 1) push(index % 2 ? 'web_search' : 'browser_open', 'completed', 330 + index * 29);
    for (let index = 0; index < 5; index += 1) push(index % 2 ? 'delegate_agent' : 'workflow_run', 'completed', 2200 + index * 340);
    for (let index = 0; index < 4; index += 1) push(index % 2 ? 'screenshot' : 'image_render', 'completed', 460 + index * 66);
    for (let index = 0; index < 5; index += 1) nodes.push({ kind: 'assistant-message', createdAt: base + (nodes.length + index) * 2_000 });
    return nodes;
  };

  const duplicateNodes = (source, copies) => Array.from({ length: copies }, (_, copyIndex) => source.map((node, nodeIndex) => ({
    ...node,
    createdAt: Number(node.createdAt || base) + copyIndex * 3_600_000 + nodeIndex * 13,
  }))).flat();

  const source = createSessionNodes();
  const definitions = {
    session: { label: 'SESSION CITY', copies: 1, seed: 'demo-northstar-session' },
    today: { label: 'TODAY CITY', copies: 2, seed: 'demo-northstar-today' },
    week: { label: '7-DAY CITY', copies: 4, seed: 'demo-northstar-week' },
    all: { label: 'LEGACY CITY', copies: 7, seed: 'demo-northstar-legacy' },
  };
  const models = Object.fromEntries(Object.entries(definitions).map(([range, definition]) => [range, core.buildSkyline({
    nodes: duplicateNodes(source, definition.copies),
    sessionKey: definition.seed,
    projectLabel: 'NORTHSTAR / LOCAL',
    rangeLabel: definition.label,
  })]));

  const elements = {
    canvas: document.querySelector('#skyline-canvas'),
    replay: document.querySelector('#replay-button'),
    scrubber: document.querySelector('#construction-scrubber'),
    progress: document.querySelector('#construction-progress'),
    projectLabel: document.querySelector('#project-label'),
    cityCode: document.querySelector('#city-code'),
    cityName: document.querySelector('#city-name'),
    cityMeta: document.querySelector('#city-meta'),
    landmarks: document.querySelector('#landmarks'),
    blocks: document.querySelector('#metric-blocks'),
    tools: document.querySelector('#metric-tools'),
    recoveries: document.querySelector('#metric-recoveries'),
    minutes: document.querySelector('#metric-minutes'),
    exportPng: document.querySelector('#export-png'),
    exportSvg: document.querySelector('#export-svg'),
    copy: document.querySelector('#copy-caption'),
  };

  let range = 'session';
  let theme = 'midnight';
  let visibleCount = models[range].buildings.length;
  let playing = false;
  let timer = null;

  const currentModel = () => models[range];
  const publicLabel = () => elements.projectLabel.value.trim().slice(0, 42) || 'PRIVATE PROJECT';
  const renderOptions = (full = false) => ({
    theme,
    projectLabel: publicLabel(),
    rangeLabel: definitions[range].label,
    visibleCount: full ? currentModel().buildings.length : visibleCount,
    animateReveal: !full && playing,
  });

  function stopPlayback() {
    if (timer) window.clearInterval(timer);
    timer = null;
    playing = false;
  }

  function render() {
    const model = currentModel();
    elements.canvas.innerHTML = core.renderSkylineSvg(model, renderOptions());
    elements.cityCode.textContent = model.identity.code;
    elements.cityName.textContent = model.identity.cityName;
    elements.cityMeta.textContent = `${model.identity.archetype} · ${model.identity.district}`;
    elements.blocks.textContent = model.metrics.totalEvents;
    elements.tools.textContent = model.metrics.toolEvents;
    elements.recoveries.textContent = model.metrics.recoveries;
    elements.minutes.textContent = model.metrics.activeMinutes;
    elements.landmarks.innerHTML = model.landmarks.slice(0, 6).map(item => `<span>${core.escapeXml(item.label)}</span>`).join('') || '<span>First block pending</span>';
    elements.scrubber.max = model.buildings.length;
    elements.scrubber.value = visibleCount;
    elements.progress.textContent = `${visibleCount} / ${model.buildings.length}`;
    elements.replay.disabled = model.buildings.length === 0;
    elements.replay.textContent = playing ? 'Ⅱ  Pause construction' : visibleCount >= model.buildings.length ? '▶  Replay construction' : '▶  Continue construction';
    document.querySelectorAll('[data-range]').forEach(button => button.classList.toggle('active', button.dataset.range === range));
    document.querySelectorAll('[data-theme]').forEach(button => button.classList.toggle('active', button.dataset.theme === theme));
  }

  function play() {
    const total = currentModel().buildings.length;
    if (!total) return;
    if (playing) { stopPlayback(); render(); return; }
    if (visibleCount >= total) visibleCount = 0;
    playing = true;
    render();
    timer = window.setInterval(() => {
      visibleCount += 1;
      if (visibleCount >= total) {
        visibleCount = total;
        render();
        stopPlayback();
        window.setTimeout(render, 430);
        return;
      }
      render();
    }, 115);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function fullSvg() {
    return core.renderSkylineSvg(currentModel(), renderOptions(true));
  }

  function flash(button, label) {
    const original = button.textContent;
    button.textContent = label;
    window.setTimeout(() => { button.textContent = original; }, 1200);
  }

  elements.replay.addEventListener('click', play);
  elements.scrubber.addEventListener('input', event => {
    stopPlayback();
    visibleCount = Number(event.target.value);
    render();
  });
  elements.projectLabel.addEventListener('input', render);
  document.querySelectorAll('[data-range]').forEach(button => button.addEventListener('click', () => {
    stopPlayback();
    range = button.dataset.range;
    visibleCount = currentModel().buildings.length;
    render();
  }));
  document.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    theme = button.dataset.theme;
    render();
  }));
  elements.exportSvg.addEventListener('click', () => {
    downloadBlob(new Blob([fullSvg()], { type: 'image/svg+xml;charset=utf-8' }), `agent-skyline-${range}.svg`);
    flash(elements.exportSvg, 'Exported');
  });
  elements.exportPng.addEventListener('click', () => {
    const svg = fullSvg();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2400;
      canvas.height = 1440;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        if (blob) downloadBlob(blob, `agent-skyline-${range}.png`);
        flash(elements.exportPng, blob ? 'Exported' : 'SVG fallback');
      }, 'image/png', .96);
    };
    image.onerror = () => { URL.revokeObjectURL(url); flash(elements.exportPng, 'Use SVG'); };
    image.src = url;
  });
  elements.copy.addEventListener('click', async () => {
    const caption = core.buildShareCaption(currentModel(), { rangeLabel: definitions[range].label });
    try { await navigator.clipboard.writeText(caption); }
    catch {
      const area = document.createElement('textarea');
      area.value = caption;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    flash(elements.copy, 'Copied');
  });

  window.AgentSkylineDemo = {
    getState: () => ({ range, theme, visibleCount, playing, model: currentModel() }),
    render,
  };
  render();
  document.body.dataset.ready = 'true';
})();

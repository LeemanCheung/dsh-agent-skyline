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

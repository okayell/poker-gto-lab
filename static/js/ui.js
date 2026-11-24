/* GTO 撲克學院 — ui.js
 * 共用 UI 基礎層：
 *   1. 內容整合（補充術語併入辭典、既有課程補上 stage / 一句話重點 / 白話比喻 / 參考來源、課程排序）
 *   2. 學習階段（新手村 → 實戰進階）與推薦下一課
 *   3. 頁首元件、彈窗、內容 hydrate（撲克牌、範圍小圖、互動元件、術語提示）
 *   4. 術語自動連結 + 滑過提示卡（Term Tooltip）
 *   4-1. 中英術語對照：中文撲克術語後自動加英文小標籤（資料 en_terms.js，右上角 EN 開關）
 *   5. 全站搜尋（Ctrl / ⌘ + K 或 /）
 *   6. 新手引導（第一次造訪選擇程度）
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const ui = (GTO.ui = GTO.ui || {});

  // ===========================================================================
  // 1. 學習階段與課程順序
  // ===========================================================================
  const STAGES = [
    { id: 'beginner', no: 0, icon: '🐣', title: '新手村', sub: '零基礎入門：規則、牌型、一手牌怎麼打', color: '#34a173', ink: '#7cd4a6', soft: 'rgba(52, 161, 115, 0.16)' },
    { id: 'basics', no: 1, icon: '🧱', title: '基礎功', sub: '位置、組合數、底池賠率與 Outs', color: '#2b94b8', ink: '#7ad3ee', soft: 'rgba(43, 148, 184, 0.16)' },
    { id: 'gto', no: 2, icon: '♟️', title: 'GTO 核心', sub: '均衡、MDF、範圍思維、阻擋牌', color: '#9c7ce8', ink: '#c8b6f7', soft: 'rgba(156, 124, 232, 0.16)' },
    { id: 'preflop', no: 3, icon: '🃏', title: '翻前系統', sub: '開池、3-Bet、盲注防守、4-Bet', color: '#d95b6a', ink: '#f5a3ad', soft: 'rgba(217, 91, 106, 0.16)' },
    { id: 'postflop', no: 4, icon: '🎯', title: '翻後系統', sub: 'C-Bet、下注尺度、讀牌、河牌決策', color: '#d49440', ink: '#f2c985', soft: 'rgba(212, 148, 64, 0.16)' },
    { id: 'advanced', no: 5, icon: '🚀', title: '實戰進階', sub: '剝削、心態、錦標賽、Solver', color: '#c9a259', ink: '#ead39c', soft: 'rgba(201, 162, 89, 0.16)' },
  ];
  const STAGE_MAP = {};
  STAGES.forEach((s) => { STAGE_MAP[s.id] = s; });
  // 階段配色 CSS 變數：--c 主色（色條、邊框）、--cs 淺底、--ct 文字用深色（在淺底上對比 ≥ 4.5:1，符合 WCAG AA）
  function stageVars(st) {
    return '--c:' + st.color + ';--cs:' + st.soft + ';--ct:' + (st.ink || st.color);
  }
  const PART_TO_STAGE = {
    '〇、新手村': 'beginner', '一、基礎篇': 'basics', '二、GTO 核心觀念': 'gto',
    '三、翻前策略': 'preflop', '四、翻後策略': 'postflop', '五、實戰與進階': 'advanced',
  };
  const LESSON_ORDER = [
    'welcome', 'hand-rankings', 'hand-flow', 'betting-actions', 'reading-board', 'starting-hands-101',
    'beginner-strategy', 'beginner-mistakes', 'etiquette',
    'rules', 'positions', 'hands-combos', 'poker-math', 'outs-odds',
    'gto-intro', 'mdf-alpha', 'value-bluff', 'range-thinking', 'equity-realization', 'fold-equity', 'blockers',
    'preflop-rfi', 'preflop-vs-open', 'blind-defense', 'preflop-3bet', 'squeeze-coldcall', 'preflop-vs-3bet',
    'preflop-4bet', 'limped-pots',
    'board-texture', 'cbet', 'postflop-bet-types', 'bet-sizing', 'spr', 'defense-postflop', 'oop-play',
    'draws-play', 'hand-reading', '3bet-pots', 'turn-river', 'river-decisions',
    'exploit', 'player-types', 'multiway', 'live-tells', 'mental-game', 'bankroll-mindset', 'game-formats',
    'mtt-basics', 'icm-pushfold', 'solver-basics', 'game-selection', 'hand-review', 'study-plan',
  ];
  const LEVEL_START = { newbie: 'beginner', casual: 'basics', gto: 'gto' };

  let prepared = false;
  function prepareContent() {
    if (prepared) return;
    prepared = true;

    // 1-1. 補充術語併入辭典
    GTO.GLOSSARY = GTO.GLOSSARY || [];
    GTO.GLOSSARY_MAP = GTO.GLOSSARY_MAP || {};
    (GTO.GLOSSARY_EXTRA || []).forEach((g) => {
      if (!g || !g.id || GTO.GLOSSARY_MAP[g.id]) return;
      const item = {
        id: g.id, term: g.term, zh: g.zh, aka: g.aka || [], cat: g.cat, imp: g.imp || 1,
        short: g.short || '', def: g.def || '', ex: g.ex || '', rel: g.rel || [], extra: true,
      };
      GTO.GLOSSARY.push(item);
      GTO.GLOSSARY_MAP[g.id] = item;
    });

    // 1-2. 課程補上 stage / meta，並依學習地圖排序
    const meta = GTO.LESSON_META || {};
    const lessons = (GTO.THEORY || []).filter((l) => l && l.id);
    const seen = new Set();
    const uniq = [];
    lessons.forEach((l) => { if (!seen.has(l.id)) { seen.add(l.id); uniq.push(l); } });
    uniq.forEach((l) => {
      if (!l.stage || !STAGE_MAP[l.stage]) l.stage = PART_TO_STAGE[l.part] || 'advanced';
      const m = meta[l.id];
      if (m) {
        if (!l.tldr && m.tldr) l.tldr = m.tldr;
        if (!l.plain && m.plain) l.plain = m.plain;
        if ((!l.sources || !l.sources.length) && m.sources) l.sources = m.sources;
      }
    });
    const orderIdx = {};
    LESSON_ORDER.forEach((id, i) => { orderIdx[id] = i; });
    const stageNo = (l) => (STAGE_MAP[l.stage] ? STAGE_MAP[l.stage].no : 9);
    uniq.sort((a, b) => {
      const sa = stageNo(a), sb = stageNo(b);
      if (sa !== sb) return sa - sb;
      const ia = orderIdx[a.id] !== undefined ? orderIdx[a.id] : 999;
      const ib = orderIdx[b.id] !== undefined ? orderIdx[b.id] : 999;
      return ia - ib;
    });
    GTO.THEORY = uniq;
    GTO.LESSON_MAP = {};
    uniq.forEach((l, i) => { l._idx = i; GTO.LESSON_MAP[l.id] = l; });
  }

  function getLesson(id) { return (GTO.LESSON_MAP || {})[id] || null; }
  function lessonsOfStage(stageId) { return (GTO.THEORY || []).filter((l) => l.stage === stageId); }
  function isDone(id) { return !!(GTO.progress.lessonsRead || {})[id]; }
  function markDone(id, done) {
    const p = GTO.progress;
    p.lessonsRead = p.lessonsRead || {};
    if (done === false) delete p.lessonsRead[id];
    else p.lessonsRead[id] = Date.now();
    GTO.saveProgress();
  }
  function stageProgress(stageId) {
    const ls = lessonsOfStage(stageId);
    const done = ls.filter((l) => isDone(l.id)).length;
    return { done, total: ls.length, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
  }
  function overallProgress() {
    const ls = GTO.THEORY || [];
    const done = ls.filter((l) => isDone(l.id)).length;
    return { done, total: ls.length, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
  }
  /** 推薦下一課：從使用者程度對應的階段開始，找第一個還沒完成的課程。 */
  function nextLesson() {
    const ls = GTO.THEORY || [];
    const level = (GTO.progress.settings || {}).level;
    const startStage = STAGE_MAP[LEVEL_START[level] || 'beginner'];
    const fromStart = ls.filter((l) => STAGE_MAP[l.stage].no >= startStage.no);
    return fromStart.find((l) => !isDone(l.id)) || ls.find((l) => !isDone(l.id)) || null;
  }
  function neighborLessons(id) {
    const ls = GTO.THEORY || [];
    const i = ls.findIndex((l) => l.id === id);
    return { prev: i > 0 ? ls[i - 1] : null, next: i >= 0 && i < ls.length - 1 ? ls[i + 1] : null };
  }

  // ===========================================================================
  // 2. 共用小元件
  // ===========================================================================
  function pageHead(o) {
    return '<header class="page-head">' +
      '<div class="ph-main">' +
        (o.icon ? '<div class="ph-icon">' + o.icon + '</div>' : '') +
        '<div><h1>' + o.title + '</h1>' + (o.sub ? '<p class="sub">' + o.sub + '</p>' : '') + '</div>' +
      '</div>' +
      (o.actions ? '<div class="ph-actions">' + o.actions + '</div>' : '') +
    '</header>';
  }

  function levelStars(lv) {
    lv = lv || 1;
    return '<span class="lv-stars" title="難度 ' + lv + ' / 3">' + '●'.repeat(lv) + '<i>' + '●'.repeat(3 - lv) + '</i></span>';
  }

  function progressRing(pct, size, label) {
    size = size || 64;
    const r = (size - 8) / 2, c = 2 * Math.PI * r;
    const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return '<span class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-fg" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>' +
      '<span class="ring-txt">' + (label != null ? label : pct + '%') + '</span></span>';
  }

  function openModal(html, opts) {
    opts = opts || {};
    closeModal();
    const ov = document.createElement('div');
    ov.className = 'modal-overlay';
    ov.id = 'appModal';
    ov.innerHTML = '<div class="modal-box ' + (opts.cls || '') + '" role="dialog" aria-modal="true">' +
      (opts.noClose ? '' : '<button type="button" class="modal-x" aria-label="關閉">✕</button>') + html + '</div>';
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('show'));
    if (!opts.noClose) {
      ov.addEventListener('click', (e) => { if (e.target === ov) closeModal(); });
      ov.querySelector('.modal-x').addEventListener('click', closeModal);
    }
    return ov;
  }
  function closeModal() {
    const ov = document.getElementById('appModal');
    if (ov) ov.remove();
  }

  /** 對任何內容區塊做完整 hydrate：撲克牌、範圍小圖、互動元件、術語提示。 */
  function hydrate(root, opts) {
    opts = opts || {};
    if (!root) return;
    root.querySelectorAll('table.tbl').forEach((t) => {
      if (t.parentElement && t.parentElement.classList.contains('tbl-wrap')) return;
      const w = document.createElement('div');
      w.className = 'tbl-wrap';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
    if (GTO.hydrateWidgets) GTO.hydrateWidgets(root);
    if (GTO.hydrateEmbedCharts) GTO.hydrateEmbedCharts(root);
    if (opts.terms) linkTerms(root, opts.terms === true ? {} : opts.terms);
    GTO.hydrateCards(root);
  }

  // ===========================================================================
  // 3. 術語自動連結 + 提示卡
  // ===========================================================================
  const TERM_STOP = new Set(['底池', '範圍', '手牌', '牌面', '籌碼', '位置', '對子', '下注', '跟注', '加注', '棄牌', '過牌',
    '翻牌', '轉牌', '河牌', '翻前', '翻後', '攤牌', '玩家', '對手', '牌型', '同花', '順子', '一對', '高牌', 'Bet', 'Call', 'Raise', 'Fold', 'Check',
    '代表', '一輪', '同花色', '看牌']); // 最後四個是日常用語（代表＝意思是、一輪＝一回合、同花色、看牌面），不要連到 Represent / Orbit / Flush / Check
  const TERM_ALIAS = { '三條街': 'street', '兩條街': 'street', '四條街': 'street', '每條街': 'street' };
  let termIndex = null;
  function buildTermIndex() {
    const keys = [];
    const seenKey = new Set();
    const add = (k, id, imp) => {
      k = (k || '').trim();
      if (!k || TERM_STOP.has(k) || seenKey.has(k)) return;
      const ascii = /^[\x20-\x7e]+$/.test(k);
      if (ascii ? k.length < 2 : k.length < 2) return;
      if (ascii && k.length < 3 && !/^[A-Z0-9$]{2}$/.test(k)) return;
      seenKey.add(k);
      keys.push({ k, id, imp, ascii });
    };
    (GTO.GLOSSARY || []).forEach((g) => {
      const termParts = String(g.term || '').split(/\s+vs\.?\s+|\s*\/\s*|\s*（|\s*\(/i);
      add(termParts[0], g.id, g.imp);
      const inParen = /\(([^)]+)\)/.exec(g.term || '');
      if (inParen && inParen[1].length >= 6) add(inParen[1], g.id, g.imp);
      String(g.zh || '').split(/（|\(|\s+vs\.?\s+|\/|、/i).forEach((z, i) => { if (i === 0 || z.length >= 3) add(z.replace(/[）)]/g, ''), g.id, g.imp); });
      (g.aka || []).forEach((a) => add(a, g.id, g.imp));
    });
    // 「三條街」等複合詞整個連到「街 Street」，避免被拆成「三條（Trips）」+「街」
    Object.keys(TERM_ALIAS).forEach((k) => {
      const g = (GTO.GLOSSARY_MAP || {})[TERM_ALIAS[k]];
      if (g) add(k, g.id, g.imp);
    });
    keys.sort((a, b) => b.k.length - a.k.length);
    const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = keys.map((x) => (x.ascii ? '(?<![A-Za-z0-9-])' + escRe(x.k) + '(?![A-Za-z0-9])' : escRe(x.k)));
    const byKey = {};
    keys.forEach((x) => { byKey[x.k] = x; });
    termIndex = { re: parts.length ? new RegExp(parts.join('|'), 'g') : null, byKey };
    return termIndex;
  }

  const TERM_SKIP_SEL = 'a, h1, h2, h3, h4, th, button, code, .hand, .cards, .pcard, .formula, .term, .embed-chart, .widget, .hh-street, .no-terms';
  function linkTerms(root, opts) {
    opts = opts || {};
    if (!GTO.GLOSSARY || !GTO.GLOSSARY.length) return;
    const idx = termIndex || buildTermIndex();
    if (!idx.re) return;
    const limit = opts.limit || 20;
    const used = new Set();
    let count = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.trim().length < 2) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || p.closest(TERM_SKIP_SEL)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (count >= limit) break;
      const text = node.nodeValue;
      idx.re.lastIndex = 0;
      let m, last = 0;
      const frag = document.createDocumentFragment();
      let changed = false;
      while ((m = idx.re.exec(text)) && count < limit) {
        const info = idx.byKey[m[0]];
        if (!info || used.has(info.id) || (opts.exclude && opts.exclude.includes(info.id))) continue;
        if ((info.imp || 1) < (opts.minImp || 2)) continue;
        used.add(info.id);
        count++;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const span = document.createElement('span');
        span.className = 'term';
        span.setAttribute('data-term', info.id);
        span.setAttribute('tabindex', '0');
        span.textContent = m[0];
        frag.appendChild(span);
        last = m.index + m[0].length;
        changed = true;
      }
      if (changed) {
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    }
  }

  let popEl = null, popTimer = null, popFor = null;
  function ensurePop() {
    if (popEl) return popEl;
    popEl = document.createElement('div');
    popEl.className = 'term-pop';
    popEl.setAttribute('role', 'tooltip');
    document.body.appendChild(popEl);
    popEl.addEventListener('mouseenter', () => clearTimeout(popTimer));
    popEl.addEventListener('mouseleave', () => hidePop(150));
    return popEl;
  }
  function showPop(el) {
    const g = (GTO.GLOSSARY_MAP || {})[el.getAttribute('data-term')];
    if (!g) return;
    clearTimeout(popTimer);
    const pop = ensurePop();
    popFor = el;
    pop.innerHTML =
      '<div class="tp-head"><strong>' + GTO.esc(g.term) + '</strong><span>' + GTO.esc(g.zh) + '</span></div>' +
      '<div class="tp-body">' + GTO.esc(g.short || GTO.stripTags(g.def).slice(0, 90)) + '</div>' +
      '<a class="tp-link" href="#/wiki/glossary/' + g.id + '">看完整解釋與例子 →</a>';
    pop.classList.add('show');
    const r = el.getBoundingClientRect();
    const pw = Math.min(320, window.innerWidth - 24);
    pop.style.width = pw + 'px';
    let left = r.left + r.width / 2 - pw / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
    const ph = pop.offsetHeight;
    let top = r.bottom + 8;
    if (top + ph > window.innerHeight - 8) top = r.top - ph - 8;
    pop.style.left = left + 'px';
    pop.style.top = Math.max(8, top) + 'px';
  }
  function hidePop(delay) {
    clearTimeout(popTimer);
    popTimer = setTimeout(() => { if (popEl) popEl.classList.remove('show'); popFor = null; }, delay || 0);
  }
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t) { clearTimeout(popTimer); popTimer = setTimeout(() => showPop(t), 120); }
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t) hidePop(180);
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t) { e.preventDefault(); if (popFor === t && popEl && popEl.classList.contains('show')) hidePop(0); else showPop(t); return; }
    if (popEl && !e.target.closest('.term-pop')) hidePop(0);
  });
  document.addEventListener('focusin', (e) => { const t = e.target.closest && e.target.closest('.term'); if (t) showPop(t); });
  window.addEventListener('scroll', () => { if (popEl && popEl.classList.contains('show')) hidePop(0); }, { passive: true });
  window.addEventListener('hashchange', () => hidePop(0));
  if (GTO.on) GTO.on('visibility', (hidden) => { if (hidden) hidePop(0); });

  // ===========================================================================
  // 3-2. 中英術語對照：中文撲克術語後面自動加英文小標籤（字典在 en_terms.js）
  //   - MutationObserver 監看 #appMain：課程、百科、練習情境 / 詳解、互動元件說明一渲染就自動標示
  //   - 同一小節（課文 h3）或同一張卡片 / 牌例 / 提示框裡，同一術語只標第一次
  //   - 作者已寫「中文（English）」或同一段已出現該英文時不重複標；標題、按鈕、選項、連結、牌圖、公式不標
  // ===========================================================================
  const HAN_RE = /[\u3400-\u9fff]/;
  // 術語後面接這些字時多半是複合詞（下注額、棄牌率、範圍表、位置圖…），不標以免把詞拆開
  const EN_GUARD_NEXT = new Set(Array.from('表額者率量數圈站方線型面值尺度比權範頻牌組池圖位置法輪次手子聽注'));
  const EN_GUARD_PREV = new Set(['最']);
  const EN_SKIP_SEL = [
    'a', 'button', 'select', 'option', 'input', 'textarea', 'label', 'code', 'kbd', 'pre', 'svg', 'summary',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'th', 'nav', '.en-t', '.no-en', '.hand', '.cards', '.pcard', '.formula',
    '.embed-chart', '.rgrid', '.mt-wrap', '.poker-table-wrap', '.chip', '.lv-chip', '.tier-tag', '.stage-chip', '.kbd',
    '.freq-bar', '.pos-pills', '.page-head', '.crumbs', '.tabs', '.toc', '.lesson-side', '.lesson-nav', '.hh-street',
    '.seg', '.stat-tile', '.lbl', '.cm-lbl', '.pi-title', '.pi-stats', '.tier-legend', '.dc-top', '.g-head', '.g-aka',
    '.g-rel', '.fc-front', '.lq-q', '.mcq-q', '.maxim', '.home-hero', '.home-foot', '.stage-head', '.stage-stepper',
    '.badge-grid', '.eq-bar-wrap', '.drill-head', '.filter-bar', '.session-scoreboard', '.kbd-hint', '.hub-top',
    '.hub-sec-head', '.qp-meta', '.pd-head', '.pw-head',
    '.arena-table', '.arena-topbar', '.arena-action-bar', '.replay-topbar', '.replay-sidebar', '.rv-head', '.dd-math-tiles', '.dd-compare-row',
    '.clc-tier-badge', '.clc-badge-pill', '.concept-badge', '.hco-head',
  ].join(', ');
  // 互動元件與練習圖像區：只標說明文字
  const EN_ZONES = [
    ['.dr-stage', '.spot-history'],
    ['.w-card', '.walk-body, .pos-info, .rk-detail, .w-note, .tier-info, .sd-feedback'],
  ];
  // 「同一術語只標一次」的範圍：課文以 h3 小節為範圍（小節內的牌例、提示框、表格共用）、課程開頭三個重點框共用一個範圍；
  // 其他頁面以卡片、牌例、提示框、表格為範圍；互動元件（.w-card）會重繪，各自獨立計算
  const EN_SCOPE_SEL = '.hh, .callout, table, .compare > div, .faq-item, .tip-card, .leak-card, .g-card, .fc-back, ' +
    '.mcq-feedback, .lq-item, .qprompt-box, .qfb-head, .daily-tip, .tip-hero, .term-hero, .w-card, .rs-sec, .help-box, ' +
    '.continue-card, .plan-day, .cs-sec, .tool-card, .spot-history';
  const EN_BLOCK_SEL = 'p, li, td, dd, dt, blockquote, div';
  const EN_SKIP_PAGES = ['page-stats'];
  const EN_PAREN_RE = /^\s?[（(]\s*[A-Za-z0-9]/;
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const enWordRe = (w, caseSensitive) => new RegExp('(^|[^A-Za-z0-9-])' + reEsc(w) + '(?![A-Za-z0-9-])', caseSensitive ? '' : 'i');

  let enIdx = null;
  function buildEnIndex() {
    const byKey = Object.create(null);
    const keys = [];
    (GTO.EN_TERMS || []).forEach((t) => {
      if (!t || !t.en || !Array.isArray(t.zh)) return;
      const ent = {
        id: t.en, en: t.en, abbr: t.abbr || '', nb: t.nb || '', na: t.na || '', alt: t.alt || null,
        enRe: enWordRe(t.en), abbrRe: t.abbr ? enWordRe(t.abbr, true) : null, altRe: t.alt ? enWordRe(t.alt.en) : null,
      };
      t.zh.forEach((z) => { if (z && !byKey[z]) { byKey[z] = ent; keys.push(z); } });
    });
    keys.sort((a, b) => b.length - a.length);
    enIdx = { re: keys.length ? new RegExp(keys.map(reEsc).join('|'), 'g') : null, byKey };
    return enIdx;
  }

  function enScope(el) {
    const widget = el.closest('.w-card');
    const body = el.closest('.lesson-body');
    if (body && (!widget || !body.contains(widget))) {
      let h = null;
      if (el !== body) {
        let top = el;
        while (top.parentElement && top.parentElement !== body) top = top.parentElement;
        h = top;
        while (h && h.tagName !== 'H3') h = h.previousElementSibling;
      }
      return { el: h || body, section: true };
    }
    const head = el.closest('.tldr, .plain-box, .keypoints');
    if (head) return { el: head.closest('.lesson-article') || head, section: true };
    const comp = el.closest(EN_SCOPE_SEL);
    return { el: comp || el.closest(EN_BLOCK_SEL) || el, section: false };
  }
  function enSeen(scope, id, ctx) {
    if (scope.section) return !!(scope.el.__enSeen && scope.el.__enSeen.has(id));
    const marks = ctx.marks.get(scope.el);
    if (marks && marks.has(id)) return true;
    return !!scope.el.querySelector('.en-t[data-k="' + id.replace(/["\\]/g, '\\$&') + '"]');
  }
  function enMark(scope, id, ctx) {
    if (scope.section) { (scope.el.__enSeen || (scope.el.__enSeen = new Set())).add(id); return; }
    let s = ctx.marks.get(scope.el);
    if (!s) ctx.marks.set(scope.el, (s = new Set()));
    s.add(id);
  }
  /** 同一段落的純文字（不含已加上的英文標籤），用來判斷作者是否已經寫了英文。 */
  function enBlockText(el, ctx) {
    const b = el.closest(EN_BLOCK_SEL) || el;
    let t = ctx.text.get(b);
    if (t === undefined) {
      t = '';
      const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode;
        if (!(n.parentElement && n.parentElement.closest('.en-t'))) t += n.nodeValue;
      }
      ctx.text.set(b, t);
    }
    return t;
  }
  /** 節點後 / 前緊鄰的文字（跨過 </strong> 等行內標籤，不跨段落）。 */
  function enTextAfter(n) {
    let cur = n;
    while (cur && !cur.nextSibling) {
      cur = cur.parentNode;
      if (!cur || cur.nodeType !== 1 || cur.matches(EN_BLOCK_SEL)) return '';
    }
    const sib = cur && cur.nextSibling;
    return sib ? String(sib.textContent || '').slice(0, 8) : '';
  }
  function enTextBefore(n) {
    let cur = n;
    while (cur && !cur.previousSibling) {
      cur = cur.parentNode;
      if (!cur || cur.nodeType !== 1 || cur.matches(EN_BLOCK_SEL)) return '';
    }
    const sib = cur && cur.previousSibling;
    return sib ? String(sib.textContent || '').slice(-8) : '';
  }
  function enPill(label, id) {
    const s = document.createElement('span');
    s.className = 'en-t';
    s.lang = 'en';
    s.setAttribute('data-k', id);
    s.textContent = label;
    return s;
  }
  /** 依段落內容決定要顯示的英文：alt（例如 bb/100 → Win Rate）與縮寫（段落已有 BTN 就不重複）。 */
  function enResolve(ent, btxt) {
    if (ent.alt && btxt.indexOf(ent.alt.near) >= 0) return { id: ent.alt.en, label: ent.alt.en, re: ent.altRe };
    const label = ent.abbr && !ent.abbrRe.test(btxt) ? ent.en + ' (' + ent.abbr + ')' : ent.en;
    return { id: ent.id, label, re: ent.enRe };
  }
  function enAnnotateText(node, idx, ctx) {
    const p = node.parentElement;
    const text = node.nodeValue;
    const re = idx.re;
    re.lastIndex = 0;
    let m, last = 0, frag = null, scope = null, btxt = '';
    while ((m = re.exec(text))) {
      const ent = idx.byKey[m[0]];
      const s = m.index, e = s + m[0].length;
      const prev = s > 0 ? text.charAt(s - 1) : enTextBefore(node).slice(-1);
      const next = e < text.length ? text.charAt(e) : enTextAfter(node).charAt(0);
      if (EN_GUARD_NEXT.has(next) || EN_GUARD_PREV.has(prev)) continue;
      if ((ent.na && next && ent.na.indexOf(next) >= 0) || (ent.nb && prev && ent.nb.indexOf(prev) >= 0)) continue;
      if (!scope) { scope = enScope(p); btxt = enBlockText(p, ctx); }
      const r = enResolve(ent, btxt);
      const after = e + 4 <= text.length ? text.slice(e, e + 8) : text.slice(e) + enTextAfter(node);
      if (EN_PAREN_RE.test(after) || r.re.test(btxt)) { enMark(scope, r.id, ctx); continue; }
      if (enSeen(scope, r.id, ctx)) continue;
      if (!frag) frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(last, e)));
      frag.appendChild(enPill(r.label, r.id));
      last = e;
      enMark(scope, r.id, ctx);
    }
    if (frag) {
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      p.replaceChild(frag, node);
    }
  }
  function enAnnotateTerm(span, idx, ctx) {
    if (span.hasAttribute('data-en')) return;
    span.setAttribute('data-en', '1');
    const text = (span.textContent || '').trim();
    if (!HAN_RE.test(text)) return;
    const prev = enTextBefore(span).slice(-1), after = enTextAfter(span), next = after.charAt(0);
    if (EN_GUARD_NEXT.has(next) || EN_GUARD_PREV.has(prev)) return;
    // 術語連結只框到複合詞的後半（例如「必要勝率」只框「勝率」）時，改用整個複合詞的英文
    const before = enTextBefore(span);
    let ent = null;
    for (let k = Math.min(4, before.length); k >= 1 && !ent; k--) ent = idx.byKey[before.slice(-k) + text] || null;
    if (!ent) ent = idx.byKey[text];
    if (ent && ((ent.na && next && ent.na.indexOf(next) >= 0) || (ent.nb && prev && ent.nb.indexOf(prev) >= 0))) return;
    if (!ent) return; // 只標 en_terms.js 收錄的術語（術語辭典的英文名稱常是組合詞，提示卡裡看得到）
    const btxt = enBlockText(span, ctx);
    const r = enResolve(ent, btxt);
    const scope = enScope(span);
    if (EN_PAREN_RE.test(after) || r.re.test(btxt)) { enMark(scope, r.id, ctx); return; }
    if (enSeen(scope, r.id, ctx)) return;
    span.parentNode.insertBefore(enPill(r.label, r.id), span.nextSibling);
    enMark(scope, r.id, ctx);
  }
  /** 牌例左側小標籤（翻前 / 翻牌 / 結果…）下方加英文。 */
  function enAnnotateLabels(root) {
    const labels = GTO.EN_LABELS || {};
    const list = root.matches('.hh-street') ? [root] : root.querySelectorAll('.hh-street');
    Array.prototype.forEach.call(list, (el) => {
      if (el.hasAttribute('data-en')) return;
      el.setAttribute('data-en', '1');
      const m = /^([^\sA-Za-z0-9]+)(\s*[A-Za-z0-9]+)?$/.exec((el.textContent || '').trim());
      const en = m && labels[m[1]];
      if (!en) return;
      const s = document.createElement('small');
      s.className = 'en-t en-sub';
      s.lang = 'en';
      s.textContent = en + (m[2] ? ' ' + m[2].trim() : '');
      el.appendChild(s);
    });
  }
  /** 對任一區塊加上英文術語標籤（可重複呼叫，已標過的不會重複）。 */
  function annotateEn(root) {
    if (!root || root.nodeType !== 1 || !(GTO.EN_TERMS || []).length) return;
    const main = document.getElementById('appMain');
    if (main && EN_SKIP_PAGES.some((c) => main.classList.contains(c))) return;
    const idx = enIdx || buildEnIndex();
    if (!idx.re) return;
    enAnnotateLabels(root);
    const ctx = { text: new Map(), marks: new Map() };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!HAN_RE.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || p.closest(EN_SKIP_SEL)) return NodeFilter.FILTER_REJECT;
        for (let i = 0; i < EN_ZONES.length; i++) {
          if (p.closest(EN_ZONES[i][0]) && !p.closest(EN_ZONES[i][1])) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      if (!n.parentNode) return;
      const term = n.parentElement.closest('.term');
      if (term) enAnnotateTerm(term, idx, ctx);
      else enAnnotateText(n, idx, ctx);
    });
  }

  (function initEn() {
    document.documentElement.classList.remove('no-en');
    const main = document.getElementById('appMain');
    if (!main || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver((recs) => {
      const seen = new Set();
      recs.forEach((r) => r.addedNodes.forEach((n) => {
        const el = n.nodeType === 1 ? n : n.parentElement;
        if (el && el.isConnected && !(el.closest && el.closest('.rgrid'))) seen.add(el);
      }));
      if (!seen.size) return;
      const roots = Array.from(seen);
      try {
        roots.filter((el) => !roots.some((o) => o !== el && o.contains(el))).forEach(annotateEn);
      } catch (e) { console.warn('[en-terms]', e); }
      mo.takeRecords(); // 丟掉自己加標籤造成的變動，避免重複觸發
    });
    mo.observe(main, { childList: true, subtree: true });
  })();

  // ===========================================================================
  // 4. 全站搜尋
  // ===========================================================================
  let searchIdx = null;
  const QUIZ_PAGES = [
    ['showdown', '🏆', '誰贏了？比牌練習'], ['handname', '🃏', '牌型辨識練習'], ['outs', '🎲', '數 Outs 練習'],
    ['position', '🧭', '位置與行動順序練習'], ['preflop', '♠️', '翻前決策練習'], ['paint', '🎨', '範圍默寫練習'],
    ['theory', '📚', 'GTO 理論測驗'], ['math', '🧮', '撲克數學練習'], ['terms', '🔤', '術語快問快答'],
    ['equity', '📊', '勝率直覺練習'], ['mix', '⚡', '綜合隨機練習'],
  ];
  function buildSearchIndex() {
    const items = [];
    const push = (o) => { o.hay = (o.title + ' ' + (o.sub || '') + ' ' + (o.extra || '')).toLowerCase(); items.push(o); };
    [
      ['🏠', '首頁', '#/home'], ['⚔️', '6 人擬真實戰桌', '#/play'], ['🧠', '雙軌牌局覆盤室', '#/replay'],
      ['🎓', '學習地圖（全部課程）', '#/learn'], ['📊', '翻前範圍表', '#/ranges'],
      ['🎯', '練習中心', '#/quiz'], ['🧮', '計算工具', '#/tools'], ['📖', '撲克百科', '#/wiki'],
      ['🔤', '術語辭典', '#/wiki/glossary'], ['💡', '技巧錦囊', '#/wiki/tips'], ['🩹', '常見漏洞', '#/wiki/leaks'],
      ['❓', '新手常見問題 FAQ', '#/wiki/faq'], ['📋', '速查表', '#/wiki/cheatsheet'], ['📚', '推薦資源與書單', '#/wiki/resources'], ['📈', '我的進度', '#/stats'],
    ].forEach(([icon, title, href]) => push({ type: '頁面', icon, title, href, w: 3 }));
    QUIZ_PAGES.forEach(([id, icon, title]) => push({ type: '練習', icon, title, href: '#/quiz/' + id, w: 2 }));
    (GTO.THEORY || []).forEach((l) => {
      const st = STAGE_MAP[l.stage] || {};
      push({
        type: '課程', icon: l.icon || '📘', title: l.title, sub: (st.title ? st.title + ' · ' : '') + (l.tldr || l.summary || ''),
        extra: (l.keyPoints || []).join(' ') + ' ' + l.id, href: '#/learn/' + l.id, w: 4,
      });
    });
    (GTO.GLOSSARY || []).forEach((g) => push({
      type: '術語', icon: '🔤', title: g.term + '｜' + g.zh, sub: g.short, extra: (g.aka || []).join(' '), href: '#/wiki/glossary/' + g.id, w: 3,
    }));
    (GTO.SCENARIO_LIST || []).forEach((s) => push({ type: '範圍表', icon: '📊', title: s.title, sub: s.targetPct + ' · ' + s.openSize, extra: s.shortTitle, href: '#/ranges/' + s.id, w: 2 }));
    (GTO.TIPS || []).forEach((t) => push({ type: '技巧', icon: '💡', title: t.title, sub: GTO.stripTags(t.text), href: '#/wiki/tips?focus=' + t.id, w: 1 }));
    (GTO.FAQ || []).forEach((f) => push({ type: '問答', icon: '❓', title: f.q, sub: GTO.stripTags(f.a), href: '#/wiki/faq?focus=' + f.id, w: 2 }));
    (GTO.LEAKS || []).forEach((t) => push({ type: '漏洞', icon: t.icon || '🩹', title: t.title, sub: GTO.stripTags(t.symptom), href: '#/wiki/leaks?focus=' + t.id, w: 1 }));
    searchIdx = items;
    return items;
  }
  function runSearch(q) {
    const items = searchIdx || buildSearchIndex();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const res = [];
    for (const it of items) {
      let ok = true, score = it.w;
      for (const t of terms) {
        const pos = it.hay.indexOf(t);
        if (pos < 0) { ok = false; break; }
        if (it.title.toLowerCase().includes(t)) score += 10 + (it.title.toLowerCase().startsWith(t) ? 6 : 0);
        else score += 2;
      }
      if (ok) res.push({ it, score });
    }
    res.sort((a, b) => b.score - a.score);
    // 依類型分組（類型順序 = 該類型最佳結果的分數），組內維持分數排序
    const groups = new Map();
    res.slice(0, 48).forEach((r) => {
      if (!groups.has(r.it.type)) groups.set(r.it.type, []);
      groups.get(r.it.type).push(r.it);
    });
    return Array.from(groups.values()).reduce((acc, g) => acc.concat(g.slice(0, 8)), []);
  }
  let searchSel = 0, searchList = [], searchRaf = 0;
  function openSearch(initial) {
    let ov = document.getElementById('searchOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'searchOverlay';
      ov.className = 'search-overlay';
      ov.innerHTML =
        '<div class="search-box" role="dialog" aria-label="全站搜尋">' +
          '<div class="search-inp-row"><span class="si-ic">🔍</span>' +
            '<input id="searchInput" type="search" autocomplete="off" placeholder="搜尋課程、術語、技巧、範圍表…（例如：C-Bet、MDF、按鈕位、聽牌）">' +
            '<kbd>Esc</kbd></div>' +
          '<div class="search-results" id="searchResults"></div>' +
          '<div class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> 選擇</span><span><kbd>Enter</kbd> 開啟</span><span><kbd>Esc</kbd> 關閉</span></div>' +
        '</div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', (e) => {
        if (e.target === ov) { closeSearch(); return; }
        if (e.target && e.target.closest && e.target.closest('.sr-item')) closeSearch();
      });
      const inp = ov.querySelector('#searchInput');
      const scheduleSearch = () => {
        if (searchRaf) cancelAnimationFrame(searchRaf);
        searchRaf = requestAnimationFrame(() => { searchRaf = 0; renderSearch(inp.value); });
      };
      inp.addEventListener('input', (e) => {
        if (e.isComposing || e.keyCode === 229) return;
        scheduleSearch();
      });
      inp.addEventListener('compositionend', scheduleSearch);
      inp.addEventListener('keydown', (e) => {
        if (e.isComposing || e.keyCode === 229) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
        else if (e.key === 'Enter') { e.preventDefault(); const it = searchList[searchSel]; if (it) { closeSearch(); location.hash = it.href; } }
        else if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
      });
    }
    ov.classList.add('show');
    const inp = ov.querySelector('#searchInput');
    inp.value = initial || '';
    renderSearch(inp.value);
    setTimeout(() => inp.focus(), 20);
  }
  function closeSearch() {
    if (searchRaf) { cancelAnimationFrame(searchRaf); searchRaf = 0; }
    const ov = document.getElementById('searchOverlay');
    if (ov) ov.classList.remove('show');
  }
  function moveSel(d) {
    if (!searchList.length) return;
    searchSel = (searchSel + d + searchList.length) % searchList.length;
    const box = document.getElementById('searchResults');
    box.querySelectorAll('.sr-item').forEach((el, i) => el.classList.toggle('sel', i === searchSel));
    const cur = box.querySelector('.sr-item.sel');
    if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function renderSearch(q) {
    const box = document.getElementById('searchResults');
    searchSel = 0;
    if (!q.trim()) {
      const nl = nextLesson();
      searchList = [
        nl ? { type: '推薦', icon: nl.icon, title: '繼續學習：' + nl.title, sub: nl.tldr || nl.summary, href: '#/learn/' + nl.id } : null,
        { type: '推薦', icon: '🏆', title: '誰贏了？比牌練習（新手必練）', href: '#/quiz/showdown' },
        { type: '推薦', icon: '📊', title: '翻前範圍表', href: '#/ranges' },
        { type: '推薦', icon: '🔤', title: '術語辭典', href: '#/wiki/glossary' },
        { type: '推薦', icon: '📋', title: '速查表（牌型、Outs、MDF、開池範圍）', href: '#/wiki/cheatsheet' },
      ].filter(Boolean);
    } else {
      searchList = runSearch(q);
    }
    if (!searchList.length) {
      box.innerHTML = '<div class="sr-empty">找不到「' + GTO.esc(q) + '」相關內容，試試其他關鍵字（例如：3-Bet、阻擋牌、SPR）。</div>';
      return;
    }
    let lastType = '';
    box.innerHTML = searchList.map((it, i) => {
      const head = it.type !== lastType ? '<div class="sr-group">' + it.type + '</div>' : '';
      lastType = it.type;
      return head + '<a class="sr-item ' + (i === 0 ? 'sel' : '') + '" href="' + it.href + '" data-i="' + i + '">' +
        '<span class="sr-ic">' + it.icon + '</span><span class="sr-txt"><strong>' + GTO.esc(it.title) + '</strong>' +
        (it.sub ? '<small>' + GTO.esc(String(it.sub).slice(0, 80)) + '</small>' : '') + '</span></a>';
    }).join('');
  }
  document.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openSearch(); return; }
    if (!typing && e.key === '/') { e.preventDefault(); openSearch(); return; }
    if (e.key === 'Escape') { closeSearch(); closeModal(); }
  });

  // ===========================================================================
  // 5. 新手引導
  // ===========================================================================
  function maybeOnboard(force) {
    const s = GTO.progress.settings || {};
    if (!force && /[?&](shot|nomodal)=1/.test(location.search)) return; // 截圖 / 自動化測試時略過
    const hash = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    if (!force && hash !== '' && hash !== 'home') return; // 僅在首頁自動彈出，直達 #/play 或 #/replay 等頁面不彈窗擋路
    if (!force && (s.onboarded || (GTO.progress.totals && GTO.progress.totals.a > 0))) return;
    const ov = openModal(
      '<div class="onb">' +
        '<div class="onb-hero">♠️</div>' +
        '<h2>歡迎來到 GTO 撲克學院</h2>' +
        '<p class="muted">從「完全不會」到「用 GTO 思考」，每天 15 分鐘就能進步。先告訴我你的程度，我幫你安排學習路線：</p>' +
        '<div class="onb-opts">' +
          '<button type="button" class="onb-opt" data-lv="newbie"><span class="oo-ic">🐣</span><span><strong>完全新手</strong><small>牌型大小、規則都還不熟</small></span></button>' +
          '<button type="button" class="onb-opt" data-lv="casual"><span class="oo-ic">🙂</span><span><strong>會玩，但沒系統學過</strong><small>想知道該玩哪些牌、怎麼算賠率</small></span></button>' +
          '<button type="button" class="onb-opt" data-lv="gto"><span class="oo-ic">🎓</span><span><strong>想深入學 GTO</strong><small>直接進入範圍、MDF、3-Bet 策略</small></span></button>' +
        '</div>' +
        '<button type="button" class="btn ghost onb-skip">先隨便逛逛</button>' +
      '</div>', { cls: 'modal-onb', noClose: true });
    ov.querySelectorAll('.onb-opt').forEach((b) => b.addEventListener('click', () => {
      const lv = b.getAttribute('data-lv');
      GTO.progress.settings.level = lv;
      GTO.progress.settings.onboarded = true;
      GTO.saveProgress(true);
      closeModal();
      const nl = nextLesson();
      location.hash = nl ? '#/learn/' + nl.id : '#/learn';
    }));
    ov.querySelector('.onb-skip').addEventListener('click', () => {
      GTO.progress.settings.onboarded = true;
      GTO.saveProgress(true);
      closeModal();
    });
  }

  Object.assign(ui, {
    STAGES, STAGE_MAP, stageVars,
    prepareContent, getLesson, lessonsOfStage, isDone, markDone, stageProgress, overallProgress, nextLesson, neighborLessons,
    pageHead, levelStars, progressRing, hydrate,
    openSearch, maybeOnboard,
  });
})();

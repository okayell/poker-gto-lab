/* GTO 撲克學院 — wiki.js
 * 撲克百科（#/wiki/<tab>）：
 *   glossary  術語辭典（搜尋 / 分類 / 重要度 / 閃卡）
 *   tips      技巧錦囊（分類 / 難度 / 搜尋）
 *   leaks     常見漏洞自我檢查（症狀 → 原因 → 修正）
 *   cheatsheet 速查表（牌型、開池範圍、Outs、尺度、位置、公式、HUD）
 *   resources 推薦書單、網站、工具與 Solver
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const ui = GTO.ui;
  const esc = (s) => GTO.esc(s);

  const TABS = [
    { id: 'glossary', icon: '🔤', label: '術語辭典', count: () => (GTO.GLOSSARY || []).length },
    { id: 'faq', icon: '❓', label: '新手 FAQ', count: () => (GTO.FAQ || []).length },
    { id: 'tips', icon: '💡', label: '技巧錦囊', count: () => (GTO.TIPS || []).length },
    { id: 'leaks', icon: '🩹', label: '常見漏洞', count: () => (GTO.LEAKS || []).length },
    { id: 'cheatsheet', icon: '📋', label: '速查表', count: () => 0 },
    { id: 'resources', icon: '📚', label: '推薦資源', count: () => (GTO.RESOURCES || []).length },
  ];
  const LV_LABEL = { 1: '新手', 2: '進階', 3: '高手' };

  const wikiCleanups = [];
  function teardownWiki() {
    while (wikiCleanups.length) {
      try { wikiCleanups.pop()(); } catch (_) {}
    }
  }
  function scheduleFocus(fn) {
    const id = setTimeout(fn, 60);
    wikiCleanups.push(() => clearTimeout(id));
  }
  function bindSearchInput(inp, onValue) {
    if (!inp) return;
    let timer = 0, raf = 0;
    const flush = () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { raf = 0; onValue(inp.value); });
    };
    inp.addEventListener('input', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      clearTimeout(timer);
      timer = setTimeout(flush, 60);
    });
    inp.addEventListener('compositionend', flush);
    wikiCleanups.push(() => { clearTimeout(timer); if (raf) cancelAnimationFrame(raf); });
  }

  let glossIndexed = false, glossCatCnt = null;
  function ensureGlossIndex() {
    const list = GTO.GLOSSARY || [];
    if (glossIndexed && glossCatCnt && glossCatCnt._len === list.length) return;
    glossCatCnt = { _len: list.length, all: list.length };
    for (let i = 0; i < list.length; i++) {
      const g = list[i];
      if (!g._hay) {
        g._hay = (g.term + ' ' + g.zh + ' ' + (g.aka || []).join(' ') + ' ' + g.short + ' ' + GTO.stripTags(g.def)).toLowerCase();
      }
      glossCatCnt[g.cat] = (glossCatCnt[g.cat] || 0) + 1;
    }
    glossIndexed = true;
  }

  let faqCatCnt = null;
  function ensureFaqIndex() {
    const list = GTO.FAQ || [];
    if (faqCatCnt && faqCatCnt._len === list.length) return;
    faqCatCnt = { _len: list.length, all: list.length };
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f._hay) f._hay = (f.q + ' ' + GTO.stripTags(f.a)).toLowerCase();
      faqCatCnt[f.cat] = (faqCatCnt[f.cat] || 0) + 1;
    }
  }

  let tipCatCnt = null;
  function ensureTipsIndex() {
    const list = GTO.TIPS || [];
    if (tipCatCnt && tipCatCnt._len === list.length) return;
    tipCatCnt = { _len: list.length, all: list.length };
    for (let i = 0; i < list.length; i++) {
      const t = list[i];
      if (!t._hay) t._hay = (t.title + ' ' + GTO.stripTags(t.text)).toLowerCase();
      tipCatCnt[t.cat] = (tipCatCnt[t.cat] || 0) + 1;
    }
  }

  let resCatCnt = null;
  function ensureResIndex() {
    const list = GTO.RESOURCES || [];
    if (resCatCnt && resCatCnt._len === list.length) return;
    resCatCnt = { _len: list.length, all: list.length };
    for (let i = 0; i < list.length; i++) {
      resCatCnt[list[i].cat] = (resCatCnt[list[i].cat] || 0) + 1;
    }
  }

  function renderWikiPage(root, sub, query, extra) {
    teardownWiki();
    const tab = TABS.some((t) => t.id === sub) ? sub : 'glossary';
    root.innerHTML =
      ui.pageHead({ icon: '📖', title: '撲克百科', sub: '術語、技巧、常見漏洞、速查表與推薦資源——遇到不懂的，來這裡查。' }) +
      '<nav class="tabs">' + TABS.map((t) => {
        const n = t.count();
        return '<a class="tab ' + (t.id === tab ? 'on' : '') + '" href="#/wiki/' + t.id + '">' + t.icon + ' ' + t.label + (n ? ' <small>' + n + '</small>' : '') + '</a>';
      }).join('') + '</nav>' +
      '<div id="wikiBody"></div>';
    const body = root.querySelector('#wikiBody');
    if (tab === 'glossary') renderGlossary(body, extra);
    else if (tab === 'faq') renderFaq(body, query);
    else if (tab === 'tips') renderTips(body, query);
    else if (tab === 'leaks') renderLeaks(body, query);
    else if (tab === 'cheatsheet') renderCheatsheet(body);
    else renderResources(body);
  }

  // ===========================================================================
  // 術語辭典
  // ===========================================================================
  const gState = { q: '', cat: 'all', imp: 0, flash: false, fi: 0, flip: false, shuffled: null };
  function glossFiltered() {
    ensureGlossIndex();
    const kw = gState.q.trim().toLowerCase();
    return (GTO.GLOSSARY || []).filter((g) => {
      if (gState.cat !== 'all' && g.cat !== gState.cat) return false;
      if (gState.imp && g.imp < gState.imp) return false;
      if (!kw) return true;
      return g._hay.includes(kw);
    });
  }
  function renderGlossary(box, focusId) {
    ensureGlossIndex();
    const focus = focusId && GTO.GLOSSARY_MAP[focusId] ? GTO.GLOSSARY_MAP[focusId] : null;
    if (focus) { gState.q = ''; gState.cat = 'all'; gState.imp = 0; gState.flash = false; gState.shuffled = null; }
    const cats = (GTO.GLOSSARY_CATS || [{ id: 'all', label: '全部', icon: '📚' }]);
    box.innerHTML =
      '<div class="toolbar">' +
        '<div class="search-field"><span>🔍</span><input type="search" id="gSearch" placeholder="搜尋術語（中英文都可以，例如：C-Bet、聽牌、阻擋牌、SPR）" value="' + esc(gState.q) + '"></div>' +
        '<div class="seg">' + [[0, '全部'], [3, '必學 ★★★'], [2, '重要 ★★+']].map(([v, l]) =>
          '<button type="button" class="' + (gState.imp === v ? 'on' : '') + '" data-imp="' + v + '">' + l + '</button>').join('') + '</div>' +
        '<button type="button" class="btn ' + (gState.flash ? 'accent' : '') + '" id="gFlash">🗂 ' + (gState.flash ? '回到列表' : '閃卡模式') + '</button>' +
        '<a class="btn primary" href="#/quiz/terms">🎯 術語測驗</a>' +
      '</div>' +
      '<div class="chips-row">' + cats.map((c) => {
        const n = glossCatCnt[c.id] || 0;
        if (!n) return '';
        return '<button type="button" class="chip-btn ' + (gState.cat === c.id ? 'on' : '') + '" data-cat="' + c.id + '">' + c.icon + ' ' + c.label + ' <small>' + n + '</small></button>';
      }).join('') + '</div>' +
      '<div id="gList"></div>';
    const list = box.querySelector('#gList');
    list.addEventListener('click', (e) => {
      if (gState.flash) return;
      if (e.target && e.target.closest && e.target.closest('a')) return;
      const trg = e.target && e.target.closest ? e.target.closest('.g-head, .g-short') : null;
      if (!trg) return;
      const card = trg.closest('.g-card');
      if (card) card.classList.toggle('open');
    });
    const draw = () => (gState.flash ? drawFlash(list) : drawGlossList(list, focus && focus.id));
    draw();
    bindSearchInput(box.querySelector('#gSearch'), (val) => {
      if (gState.q === val) return;
      gState.q = val; gState.fi = 0; gState.shuffled = null; draw();
    });
    box.addEventListener('click', (e) => {
      const impBtn = e.target && e.target.closest ? e.target.closest('[data-imp]') : null;
      if (impBtn) {
        gState.imp = Number(impBtn.getAttribute('data-imp')); gState.fi = 0; gState.shuffled = null;
        box.querySelectorAll('[data-imp]').forEach((x) => x.classList.toggle('on', x === impBtn));
        draw();
        return;
      }
      const catBtn = e.target && e.target.closest ? e.target.closest('[data-cat]') : null;
      if (catBtn) {
        gState.cat = catBtn.getAttribute('data-cat'); gState.fi = 0; gState.shuffled = null;
        box.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('on', x === catBtn));
        draw();
      }
    });
    box.querySelector('#gFlash').addEventListener('click', () => {
      gState.flash = !gState.flash; gState.fi = 0; gState.flip = false; gState.shuffled = null;
      renderGlossary(box);
    });
    if (focus) {
      scheduleFocus(() => {
        const el = box.querySelector('[data-gid="' + focus.id + '"]');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('pulse'); }
      });
    }
  }
  function glossCard(g, open) {
    const rel = (g.rel || []).map((r) => GTO.GLOSSARY_MAP[r]).filter(Boolean);
    return '<div class="g-card ' + (open ? 'open' : '') + '" data-gid="' + g.id + '">' +
      '<button type="button" class="g-head">' +
        '<span class="g-term"><b>' + esc(g.term) + '</b><span>' + esc(g.zh) + '</span></span>' +
        '<span class="g-imp imp' + g.imp + '">' + '★'.repeat(g.imp) + '</span>' +
      '</button>' +
      '<p class="g-short">' + esc(g.short) + '</p>' +
      '<div class="g-more">' +
        '<div class="g-def">' + g.def + '</div>' +
        (g.ex ? '<div class="g-ex"><b>例子</b>' + g.ex + '</div>' : '') +
        (g.aka && g.aka.length ? '<div class="g-aka">又稱：' + g.aka.map(esc).join('、') + '</div>' : '') +
        (rel.length ? '<div class="g-rel">相關：' + rel.map((r) => '<a href="#/wiki/glossary/' + r.id + '">' + esc(r.zh.split('（')[0]) + '</a>').join('') + '</div>' : '') +
      '</div>' +
    '</div>';
  }
  function drawGlossList(list, focusId) {
    const items = glossFiltered();
    if (!items.length) { list.innerHTML = '<div class="empty">找不到符合的術語，換個關鍵字試試。</div>'; return; }
    list.innerHTML = '<div class="g-count muted">共 ' + items.length + ' 個術語 · 點卡片展開完整解釋</div><div class="g-grid">' + items.map((g) => glossCard(g, g.id === focusId)).join('') + '</div>';
    GTO.hydrateCards(list);
  }
  function drawFlash(list) {
    const items = gState.shuffled || glossFiltered();
    if (!items.length) { list.innerHTML = '<div class="empty">沒有可練習的術語。</div>'; return; }
    if (gState.fi >= items.length) gState.fi = 0;
    const g = items[gState.fi];
    list.innerHTML =
      '<div class="flash-wrap">' +
        '<div class="flash-card ' + (gState.flip ? 'flip' : '') + '" id="fCard" tabindex="0">' +
          '<div class="fc-front"><small>' + (gState.fi + 1) + ' / ' + items.length + '</small><h2>' + esc(g.term) + '</h2><p>' + esc(g.zh) + '</p><span class="muted">點一下或按空白鍵翻面</span></div>' +
          '<div class="fc-back"><b>' + esc(g.zh) + '</b><p class="fc-short">' + esc(g.short) + '</p><div class="fc-def">' + g.def + '</div>' + (g.ex ? '<div class="g-ex"><b>例子</b>' + g.ex + '</div>' : '') + '</div>' +
        '</div>' +
        '<div class="flash-btns"><button type="button" class="btn" id="fPrev">← 上一張</button><button type="button" class="btn primary" id="fFlip">翻面（Space）</button><button type="button" class="btn" id="fNext">下一張 →</button><button type="button" class="btn ghost" id="fShuf">🔀 打亂</button></div>' +
      '</div>';
    GTO.hydrateCards(list);
    const flip = () => { gState.flip = !gState.flip; list.querySelector('#fCard').classList.toggle('flip', gState.flip); };
    const go = (d) => { gState.fi = (gState.fi + d + items.length) % items.length; gState.flip = false; drawFlash(list); };
    list.querySelector('#fCard').addEventListener('click', flip);
    list.querySelector('#fFlip').addEventListener('click', flip);
    list.querySelector('#fPrev').addEventListener('click', () => go(-1));
    list.querySelector('#fNext').addEventListener('click', () => go(1));
    list.querySelector('#fShuf').addEventListener('click', () => { gState.shuffled = GTO.shuffle(glossFiltered()); gState.fi = 0; gState.flip = false; drawFlash(list); });
    list.onkeydown = null;
  }
  document.addEventListener('keydown', (e) => {
    if (!location.hash.startsWith('#/wiki/glossary') || !gState.flash) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const card = document.getElementById('fCard');
    if (!card) return;
    if (e.key === ' ') { e.preventDefault(); document.getElementById('fFlip').click(); }
    else if (e.key === 'ArrowRight') document.getElementById('fNext').click();
    else if (e.key === 'ArrowLeft') document.getElementById('fPrev').click();
  });

  // ===========================================================================
  // 新手 FAQ
  // ===========================================================================
  const fState = { cat: 'all', q: '' };
  function renderFaq(box, query) {
    const items = GTO.FAQ || [];
    if (!items.length) { box.innerHTML = '<div class="empty">新手 FAQ 整理中…</div>'; return; }
    ensureFaqIndex();
    const cats = [{ id: 'all', label: '全部', icon: '✨' }].concat(GTO.FAQ_CATS || []);
    const focus = query && query.focus;
    if (focus) { fState.cat = 'all'; fState.q = ''; }
    box.innerHTML =
      '<div class="toolbar"><div class="search-field"><span>🔍</span><input type="search" id="fSearch" placeholder="搜尋問題（例如：平手、要準備多少錢、GTO 適合新手嗎）" value="' + esc(fState.q) + '"></div></div>' +
      '<div class="chips-row">' + cats.map((c) => {
        const n = faqCatCnt[c.id] || 0;
        return n ? '<button type="button" class="chip-btn ' + (fState.cat === c.id ? 'on' : '') + '" data-cat="' + c.id + '">' + c.icon + ' ' + c.label + ' <small>' + n + '</small></button>' : '';
      }).join('') + '</div><div id="fList"></div>';
    const catMap = {};
    (GTO.FAQ_CATS || []).forEach((c) => { catMap[c.id] = c; });
    const el = box.querySelector('#fList');
    const draw = () => {
      const kw = fState.q.trim().toLowerCase();
      const list = items.filter((f) => (fState.cat === 'all' || f.cat === fState.cat) && (!kw || f._hay.includes(kw)));
      if (!list.length) { el.innerHTML = '<div class="empty">找不到相關問題，試試其他關鍵字，或按 <kbd>/</kbd> 搜尋全站。</div>'; return; }
      let last = '';
      el.innerHTML = '<div class="faq-list">' + list.map((f) => {
        const c = catMap[f.cat] || {};
        const head = fState.cat === 'all' && f.cat !== last ? '<div class="faq-group">' + (c.icon || '') + ' ' + esc(c.label || f.cat) + '</div>' : '';
        last = f.cat;
        const l = f.lesson && ui.getLesson(f.lesson);
        return head + '<details class="faq-item" data-fid="' + f.id + '"' + (f.id === focus ? ' open' : '') + '><summary><span class="faq-q">Q</span>' + esc(f.q) + '</summary>' +
          '<div class="faq-a">' + f.a + (l ? '<a class="faq-more" href="#/learn/' + l.id + '">📖 延伸閱讀：' + esc(l.title) + '</a>' : '') + '</div></details>';
      }).join('') + '</div>';
      GTO.hydrateCards(el);
    };
    draw();
    bindSearchInput(box.querySelector('#fSearch'), (val) => {
      if (fState.q === val) return;
      fState.q = val; draw();
    });
    box.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest('[data-cat]') : null;
      if (!b) return;
      fState.cat = b.getAttribute('data-cat');
      box.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('on', x === b));
      draw();
    });
    if (focus) scheduleFocus(() => { const t = box.querySelector('[data-fid="' + focus + '"]'); if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); t.classList.add('pulse'); } });
  }

  // ===========================================================================
  // 技巧錦囊
  // ===========================================================================
  const tState = { cat: 'all', lv: 0, q: '' };
  function renderTips(box, query) {
    const tips = GTO.TIPS || [];
    if (!tips.length) { box.innerHTML = '<div class="empty">技巧錦囊整理中…</div>'; return; }
    ensureTipsIndex();
    const cats = [{ id: 'all', label: '全部', icon: '✨' }].concat(GTO.TIP_CATS || []);
    const focus = query && query.focus;
    if (focus) { tState.cat = 'all'; tState.lv = 0; tState.q = ''; }
    const daily = tips[Math.floor(Date.now() / 86400000) % tips.length];
    box.innerHTML =
      '<div class="daily-tip"><span class="dt-ic">🌟</span><div><small>今日一招</small><b>' + esc(daily.title) + '</b><p>' + daily.text + '</p></div></div>' +
      '<div class="toolbar">' +
        '<div class="search-field"><span>🔍</span><input type="search" id="tSearch" placeholder="搜尋技巧（例如：河牌、3-Bet、現場、Tilt）" value="' + esc(tState.q) + '"></div>' +
        '<div class="seg">' + [[0, '全部'], [1, '新手'], [2, '進階'], [3, '高手']].map(([v, l]) => '<button type="button" class="' + (tState.lv === v ? 'on' : '') + '" data-lv="' + v + '">' + l + '</button>').join('') + '</div>' +
      '</div>' +
      '<div class="chips-row">' + cats.map((c) => {
        const n = tipCatCnt[c.id] || 0;
        return n ? '<button type="button" class="chip-btn ' + (tState.cat === c.id ? 'on' : '') + '" data-cat="' + c.id + '">' + c.icon + ' ' + c.label + ' <small>' + n + '</small></button>' : '';
      }).join('') + '</div>' +
      '<div id="tList"></div>';
    const catMap = {};
    (GTO.TIP_CATS || []).forEach((c) => { catMap[c.id] = c; });
    const listEl = box.querySelector('#tList');
    const draw = () => {
      const kw = tState.q.trim().toLowerCase();
      const items = tips.filter((t) => (tState.cat === 'all' || t.cat === tState.cat) && (!tState.lv || t.level === tState.lv) &&
        (!kw || t._hay.includes(kw)));
      if (!items.length) { listEl.innerHTML = '<div class="empty">沒有符合的技巧。</div>'; return; }
      listEl.innerHTML = '<div class="tip-grid">' + items.map((t) => {
        const c = catMap[t.cat] || {};
        const l = t.lesson && ui.getLesson(t.lesson);
        return '<div class="tip-card" data-tid="' + t.id + '">' +
          '<div class="tc-top"><span class="tc-cat">' + (c.icon || '💡') + ' ' + esc(c.label || t.cat) + '</span><span class="lv-chip lv' + t.level + '">' + LV_LABEL[t.level] + '</span></div>' +
          '<h4>' + esc(t.title) + '</h4><p>' + t.text + '</p>' +
          (l ? '<a class="tc-link" href="#/learn/' + l.id + '">📖 ' + esc(l.title) + '</a>' : '') +
        '</div>';
      }).join('') + '</div>';
      GTO.hydrateCards(listEl);
    };
    draw();
    bindSearchInput(box.querySelector('#tSearch'), (val) => {
      if (tState.q === val) return;
      tState.q = val; draw();
    });
    box.addEventListener('click', (e) => {
      const lvBtn = e.target && e.target.closest ? e.target.closest('[data-lv]') : null;
      if (lvBtn) {
        tState.lv = Number(lvBtn.getAttribute('data-lv'));
        box.querySelectorAll('[data-lv]').forEach((x) => x.classList.toggle('on', x === lvBtn));
        draw();
        return;
      }
      const catBtn = e.target && e.target.closest ? e.target.closest('[data-cat]') : null;
      if (catBtn) {
        tState.cat = catBtn.getAttribute('data-cat');
        box.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('on', x === catBtn));
        draw();
      }
    });
    GTO.hydrateCards(box.querySelector('.daily-tip'));
    if (focus) scheduleFocus(() => { const el = box.querySelector('[data-tid="' + focus + '"]'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('pulse'); } });
  }

  // ===========================================================================
  // 常見漏洞
  // ===========================================================================
  const lState = { lv: 0, mine: false };
  function renderLeaks(box, query) {
    const leaks = GTO.LEAKS || [];
    if (!leaks.length) { box.innerHTML = '<div class="empty">常見漏洞整理中…</div>'; return; }
    const p = GTO.progress;
    p.leaks = p.leaks || {};
    const focus = query && query.focus;
    const draw = () => {
      const mineCnt = Object.keys(p.leaks).filter((k) => p.leaks[k]).length;
      const items = leaks.filter((x) => (!lState.lv || x.level === lState.lv) && (!lState.mine || p.leaks[x.id]));
      box.innerHTML =
        '<div class="leak-intro"><div><b>🩺 漏洞健檢</b><p>這些是最常讓人「默默漏錢」的習慣。逐一對照，勾選你也有的，之後就能集中練習。</p></div>' +
          '<div class="leak-count">' + ui.progressRing(Math.round(mineCnt / leaks.length * 100), 58, mineCnt) + '<small>你勾選的漏洞</small></div></div>' +
        '<div class="toolbar">' +
          '<div class="seg">' + [[0, '全部'], [1, '新手'], [2, '進階'], [3, '高手']].map(([v, l]) => '<button type="button" class="' + (lState.lv === v ? 'on' : '') + '" data-lv="' + v + '">' + l + '</button>').join('') + '</div>' +
          '<button type="button" class="btn ' + (lState.mine ? 'accent' : '') + '" id="lMine">☑ 只看我勾選的</button>' +
        '</div>' +
        '<div class="leak-list">' + (items.length ? items.map((x) => {
          const l = x.lesson && ui.getLesson(x.lesson);
          return '<div class="leak-card ' + (p.leaks[x.id] ? 'mine' : '') + '" data-lid="' + x.id + '">' +
            '<div class="lk-head"><span class="lk-ic">' + (x.icon || '🩹') + '</span><h4>' + esc(x.title) + '</h4><span class="lv-chip lv' + x.level + '">' + LV_LABEL[x.level] + '</span>' +
              '<label class="lk-mine"><input type="checkbox" data-mine="' + x.id + '"' + (p.leaks[x.id] ? ' checked' : '') + '> 我也有</label></div>' +
            '<div class="lk-rows">' +
              '<div><span class="lk-lbl">😟 症狀</span><p>' + x.symptom + '</p></div>' +
              '<div><span class="lk-lbl">💸 為什麼虧</span><p>' + x.why + '</p></div>' +
              '<div class="fix"><span class="lk-lbl">🔧 怎麼改</span><p>' + x.fix + '</p></div>' +
            '</div>' +
            '<div class="lk-foot">' + (l ? '<a class="btn sm" href="#/learn/' + l.id + '">📖 ' + esc(l.title) + '</a>' : '') + (x.drill ? '<a class="btn sm primary" href="' + esc(x.drill) + '">🎯 對症練習</a>' : '') + '</div>' +
          '</div>';
        }).join('') : '<div class="empty">目前沒有勾選的漏洞 👍</div>') + '</div>';
      GTO.hydrateCards(box);
    };
    box.addEventListener('click', (e) => {
      const lvBtn = e.target && e.target.closest ? e.target.closest('[data-lv]') : null;
      if (lvBtn) { lState.lv = Number(lvBtn.getAttribute('data-lv')); draw(); return; }
      if (e.target && e.target.closest && e.target.closest('#lMine')) { lState.mine = !lState.mine; draw(); }
    });
    box.addEventListener('change', (e) => {
      const cb = e.target && e.target.matches && e.target.matches('[data-mine]') ? e.target : null;
      if (!cb) return;
      p.leaks[cb.getAttribute('data-mine')] = cb.checked;
      GTO.saveProgress();
      draw();
    });
    draw();
    if (focus) scheduleFocus(() => { const el = box.querySelector('[data-lid="' + focus + '"]'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('pulse'); } });
  }

  // ===========================================================================
  // 速查表
  // ===========================================================================
  const FORMULAS = [
    ['必要勝率（底池賠率）', '跟注額 ÷（底池 + 對手下注 + 跟注額）', '底池 10、對手下 5 → 5 ÷ 20 = 25%'],
    ['MDF 最小防守頻率', '底池 ÷（底池 + 下注額）', '對手下注 1/2 池 → 至少防守 66.7%'],
    ['Alpha 詐唬需成功率', '下注額 ÷（底池 + 下注額）', '下注 1/2 池的純詐唬，對手要棄牌 33% 以上才賺'],
    ['河牌詐唬比例', '下注額 ÷（底池 + 2 × 下注額）', '滿池下注 → 下注範圍約 1/3 是詐唬'],
    ['二四法則', '翻牌看兩張 ≈ outs × 4；只看一張 ≈ outs × 2', '同花聽 9 outs → 翻牌到河牌約 35%'],
    ['SPR 籌碼底池比', '有效籌碼 ÷ 翻牌底池', 'SPR < 4：頂對常可全下；SPR > 10：要更強的牌'],
    ['組合數', '對子 6、同花 4、不同花 12', '你拿一張 A 時，對手 AA 只剩 3 組'],
    ['EV 期望值', 'Σ（機率 × 損益）', '40% 贏 30bb、60% 輸 10bb → EV = +6bb'],
  ];
  const HUD_ROWS = [
    ['VPIP', '主動投錢入池比例', '22–28%', '> 40% 多半是魚'],
    ['PFR', '翻前加注比例', '17–23%', 'VPIP 與 PFR 差距大 = 太被動'],
    ['3-Bet', '翻前再加注比例', '7–10%', '< 4% 很緊，> 12% 很兇'],
    ['Fold to 3-Bet', '開池後被 3-Bet 棄牌率', '45–60%', '> 65% 可以多 3-Bet 詐唬'],
    ['C-Bet（翻牌）', '翻前加注者翻牌下注率', '50–65%', '> 80% 可以多過牌加注 / 漂浮'],
    ['WTSD', '看到翻牌後走到攤牌的比例', '27–32%', '> 35% 是跟注站，少詐唬多價值'],
    ['W$SD', '攤牌時贏錢比例', '49–55%', '< 45% 代表跟太鬆'],
  ];
  function renderCheatsheet(box) {
    const secs = [
      ['cs-rank', '🏆 牌型大小', GTO.widgetHtml('hand-rankings')],
      ['cs-rfi', '📋 開池範圍', GTO.widgetHtml('preflop-cheatsheet')],
      ['cs-tier', '✋ 起手牌分級', GTO.widgetHtml('hand-tiers')],
      ['cs-pos', '🧭 位置與行動順序', GTO.widgetHtml('position-table')],
      ['cs-draw', '🌊 常見聽牌', GTO.widgetHtml('draw-outs-examples')],
      ['cs-outs', '🎲 Outs 機率', GTO.widgetHtml('outs-table')],
      ['cs-bet', '📏 下注尺度', GTO.widgetHtml('bet-size-table')],
      ['cs-formula', '🧮 核心公式', '<div class="w-card"><div class="formula-grid">' + FORMULAS.map((f) =>
        '<div class="fm-card"><b>' + f[0] + '</b><div class="formula">' + f[1] + '</div><small>例：' + f[2] + '</small></div>').join('') + '</div></div>'],
      ['cs-hud', '👥 HUD 數據參考（6 人桌常規玩家）', '<div class="w-card"><div class="tbl-wrap"><table class="tbl compact-tbl"><thead><tr><th>數據</th><th>意思</th><th>常規玩家約</th><th>怎麼解讀</th></tr></thead><tbody>' +
        HUD_ROWS.map((r) => '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td class="muted">' + r[3] + '</td></tr>').join('') +
        '</tbody></table></div><p class="w-note">數值為線上 6 人桌常見參考區間，會因級別與玩家池不同；樣本至少數百到上千手才可信。</p></div>'],
    ];
    box.innerHTML =
      '<div class="cs-nav">' + secs.map((s) => '<a href="#" data-cs="' + s[0] + '">' + s[1] + '</a>').join('') +
        '<button type="button" class="btn sm" id="csPrint">🖨 列印</button></div>' +
      secs.map((s) => '<section class="cs-sec" id="' + s[0] + '"><h2>' + s[1] + '</h2>' + s[2] + '</section>').join('');
    ui.hydrate(box);
    box.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('[data-cs]') : null;
      if (a) {
        e.preventDefault();
        const t = document.getElementById(a.getAttribute('data-cs'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (e.target && e.target.closest && e.target.closest('#csPrint')) window.print();
    });
  }

  // ===========================================================================
  // 推薦資源
  // ===========================================================================
  const RES_CATS = [
    ['all', '✨ 全部'], ['book', '📕 書籍'], ['site', '🌐 網站'], ['blog', '📰 文章'], ['video', '🎬 影片'], ['course', '🎓 課程'],
    ['tool', '🛠 工具'], ['solver', '🖥 Solver'], ['community', '💬 社群'], ['zh', '🀄 中文資源'],
  ];
  const rState = { cat: 'all', free: false };
  function renderResources(box) {
    const res = GTO.RESOURCES || [];
    const maxims = GTO.MAXIMS || [];
    ensureResIndex();
    const draw = () => {
      const items = res.filter((r) => (rState.cat === 'all' || r.cat === rState.cat) && (!rState.free || r.free));
      const m = maxims.length ? maxims[Math.floor(Math.random() * maxims.length)] : null;
      box.innerHTML =
        (m ? '<blockquote class="maxim"><p>「' + esc(m.text) + '」</p>' + (m.en ? '<small>' + esc(m.en) + '</small>' : '') + (m.who ? '<cite>— ' + esc(m.who) + '</cite>' : '') + (m.note ? '<div class="mx-note">💬 ' + esc(m.note) + '</div>' : '') + '<button type="button" class="btn ghost sm" id="mxNext">換一句 ↻</button></blockquote>' : '') +
        '<div class="toolbar"><div class="chips-row tight">' + RES_CATS.map(([id, l]) => {
          const n = resCatCnt[id] || 0;
          return n ? '<button type="button" class="chip-btn ' + (rState.cat === id ? 'on' : '') + '" data-cat="' + id + '">' + l + ' <small>' + n + '</small></button>' : '';
        }).join('') + '</div>' +
        '<label class="check"><input type="checkbox" id="rFree"' + (rState.free ? ' checked' : '') + '> 只看免費</label></div>' +
        (items.length ? '<div class="res-grid">' + items.map((r) =>
          '<a class="res-card" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
            '<div class="rc-top"><span class="rc-cat">' + (RES_CATS.find((c) => c[0] === r.cat) || ['', r.cat])[1] + '</span>' +
              '<span class="lv-chip lv' + r.level + '">' + LV_LABEL[r.level] + '</span>' + (r.free ? '<span class="chip ok">免費</span>' : '') + (r.lang === 'zh' ? '<span class="chip info">中文</span>' : '') + '</div>' +
            '<h4>' + esc(r.title) + ' <span class="ext">↗</span></h4>' + (r.author ? '<small class="muted">' + esc(r.author) + '</small>' : '') +
            '<p>' + esc(r.desc) + '</p>' +
          '</a>').join('') + '</div>' : '<div class="empty">' + (res.length ? '沒有符合的資源。' : '推薦資源整理中…') + '</div>') +
        '<p class="muted small">外部連結會在新分頁開啟。請遵守當地法律，理性看待撲克的娛樂與競技性質。</p>';
    };
    box.addEventListener('click', (e) => {
      const catBtn = e.target && e.target.closest ? e.target.closest('[data-cat]') : null;
      if (catBtn) { rState.cat = catBtn.getAttribute('data-cat'); draw(); return; }
      if (e.target && e.target.closest && e.target.closest('#mxNext')) draw();
    });
    box.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'rFree') { rState.free = e.target.checked; draw(); }
    });
    draw();
  }

  Object.assign(GTO, { renderWikiPage, teardownWiki });
})();

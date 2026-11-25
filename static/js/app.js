/* GTO 撲克學院 — app.js
 * 主程式：導覽列、Hash 路由與各頁面：
 *   #/home              首頁（學習路線、繼續學習、今日練習、今日一招）
 *   #/learn[/<id>]      學習地圖與課程（learn.js）
 *   #/ranges[/<id>]     6 人桌 40 組翻前範圍表（三步驟選情境、簡易 / GTO 混合、手牌解析、雙表對比）
 *   #/quiz[/<mode>]     練習中心與 11 種無限隨機練習（quiz.js + drills.js）
 *   #/tools             計算工具（勝率、MDF / Alpha、底池賠率 / EV、SPR）
 *   #/wiki[/<tab>]      撲克百科：術語、技巧、漏洞、速查表、資源（wiki.js）
 *   #/stats             我的進度：課程完成度、練習統計、弱點熱力圖、錯題本
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const ui = GTO.ui;
  const esc = (s) => GTO.esc(s);

  // ---------------------------------------------------------------------------
  // 導覽列與路由解析
  // ---------------------------------------------------------------------------
  const NAV_ITEMS = [
    { id: 'home', href: '#/home', icon: '🏠', label: '首頁', mobile: true },
    { id: 'play', href: '#/play', icon: '♠️', label: '實戰桌', mLabel: '實戰', mobile: true },
    { id: 'replay', href: '#/replay', icon: '📜', label: '覆盤', mobile: true },
    { id: 'learn', href: '#/learn', icon: '🎓', label: '學習', mobile: true },
    { id: 'ranges', href: '#/ranges', icon: '📊', label: '範圍表', mobile: true },
    { id: 'quiz', href: '#/quiz', icon: '🎯', label: '練習', mobile: true },
    { id: 'tools', href: '#/tools', icon: '🧮', label: '工具' },
    { id: 'wiki', href: '#/wiki', icon: '📖', label: '百科' },
    { id: 'stats', href: '#/stats', icon: '📈', label: '進度', mobile: true },
    { id: 'resources', href: '#/resources', icon: '⚡', label: '進階資源', mLabel: '資源', mobile: true },
    { id: 'feedback', href: '#/feedback', icon: '💬', label: '意見回饋', mLabel: '回饋' },
  ];
  const NAV_ALIAS = { theory: 'learn', glossary: 'wiki' };

  function parseHash() {
    const raw = (location.hash || '#/home').replace(/^#\/?/, '');
    const [pathPart, queryPart] = raw.split('?');
    const segs = pathPart.split('/').filter(Boolean).map((s) => decodeURIComponent(s));
    const query = {};
    if (queryPart) new URLSearchParams(queryPart).forEach((v, k) => { query[k] = v; });
    return { page: segs[0] || 'home', sub: segs[1] || '', extra: segs[2] || '', query };
  }

  function renderHeader(activePage) {
    const act = NAV_ALIAS[activePage] || activePage;
    const navEl = document.getElementById('mainNav');
    if (navEl) {
      if (!navEl.__built) {
        navEl.innerHTML = NAV_ITEMS.map((it) =>
          '<a class="nav-link" data-nav="' + it.id + '" href="' + it.href + '"><span class="nav-ic">' + it.icon + '</span><span>' + it.label + '</span></a>'
        ).join('');
        navEl.__built = true;
      }
      const links = navEl.children;
      for (let i = 0; i < links.length; i++) {
        links[i].classList.toggle('active', links[i].getAttribute('data-nav') === act);
      }
    }
    const mob = document.getElementById('mobileNav');
    if (mob) {
      if (!mob.__built) {
        mob.innerHTML = NAV_ITEMS.filter((it) => it.mobile).map((it) =>
          '<a class="mnav-link" data-nav="' + it.id + '" href="' + it.href + '"><span>' + it.icon + '</span><small>' + (it.mLabel || it.label) + '</small></a>'
        ).join('');
        mob.__built = true;
      }
      const mLinks = mob.children;
      for (let i = 0; i < mLinks.length; i++) {
        mLinks[i].classList.toggle('active', mLinks[i].getAttribute('data-nav') === act);
      }
    }
    updateHeaderStats();
  }

  let lastHdrSig = '';
  function updateHeaderStats() {
    const el = document.getElementById('headerStats');
    if (!el) return;
    const p = GTO.progress;
    const todayCnt = p.daily[GTO.todayKey()] || 0;
    const days = GTO.studyDays();
    if (!el.__built) {
      el.innerHTML =
        '<button type="button" class="search-btn" id="openSearchBtn" title="搜尋全站（快捷鍵 / 或 Ctrl+K）"><span>🔍</span><span class="sb-txt">搜尋</span><kbd>/</kbd></button>' +
        '<a class="hstat-pill" href="#/stats" title="我的學習進度"><span id="hdrDays">🔥 ' + days + ' 天</span><span class="sep">·</span><span>今日 <strong id="hdrToday">' + todayCnt + '</strong> 題</span></a>';
      el.querySelector('#openSearchBtn').addEventListener('click', () => ui.openSearch());
      el.__built = true;
      lastHdrSig = days + ':' + todayCnt;
      return;
    }
    const sig = days + ':' + todayCnt;
    if (sig === lastHdrSig) return;
    lastHdrSig = sig;
    const dEl = document.getElementById('hdrDays');
    const tEl = document.getElementById('hdrToday');
    if (dEl) dEl.textContent = '🔥 ' + days + ' 天';
    if (tEl) tEl.textContent = String(todayCnt);
  }

  // ===========================================================================
  // 1. 首頁
  // ===========================================================================
  let cachedImp3 = null;
  function renderHomePage(root) {
    const p = GTO.progress;
    const ov = ui.overallProgress();
    const nl = ui.nextLesson();
    const todayCnt = p.daily[GTO.todayKey()] || 0;
    const goal = (p.settings && p.settings.dailyGoal) || 30;
    const started = ov.done > 0 || (p.totals && p.totals.a > 0);
    const lessonsN = (GTO.THEORY || []).length;
    const termsN = (GTO.GLOSSARY || []).length;
    const tips = GTO.TIPS || [];
    const tip = tips.length ? tips[Math.floor(Date.now() / 86400000) % tips.length] : null;
    if (!cachedImp3) cachedImp3 = (GTO.GLOSSARY || []).filter((g) => g.imp >= 3);
    const term = cachedImp3.length ? cachedImp3[Math.floor(Date.now() / 86400000) % cachedImp3.length] : null;

    const heroCtas = '<a class="btn primary xl" href="#/play">🃏 進入 6 人實戰桌</a>' +
      (started && nl
        ? '<a class="btn xl" href="#/learn/' + nl.id + '">▶ 繼續學習：' + esc(nl.title) + '</a>'
        : '<a class="btn xl" href="#/learn/' + ((ui.getLesson('welcome') || nl || { id: '' }).id) + '">🐣 新手第一課</a>') +
      '<a class="btn xl" href="#/replay">📜 覆盤分析室</a>';

    const stageCards = ui.STAGES.map((st) => {
      const sp = ui.stageProgress(st.id);
      if (!sp.total) return '';
      const first = ui.lessonsOfStage(st.id).find((l) => !ui.isDone(l.id)) || ui.lessonsOfStage(st.id)[0];
      return '<a class="path-card ' + (sp.done === sp.total ? 'done' : '') + '" href="#/learn/' + first.id + '" style="' + ui.stageVars(st) + '">' +
        '<div class="pc-top"><span class="pc-ic">' + st.icon + '</span><small>STAGE ' + st.no + '</small></div>' +
        '<b>' + st.title + '</b><p>' + st.sub + '</p>' +
        '<div class="pc-bar"><i style="width:' + sp.pct + '%"></i></div><small class="pc-cnt">' + sp.done + ' / ' + sp.total + ' 課</small>' +
      '</a>';
    }).join('<span class="path-arrow">›</span>');

    const quick = [
      ['🃏', '6 人 AI 實戰桌', '擬真 6 席對戰，即時 HUD 與個性 AI', '#/play'],
      ['📜', '牌局覆盤教練', '雙軌 GTO 與剝削解析，漏洞雷達', '#/replay'],
      ['📊', '翻前範圍表', '40 組 6-Max 範圍矩陣', '#/ranges'],
      ['🏆', '牌型大小', '10 種牌型一張圖看懂', '#/learn/hand-rankings'],
      ['🎬', '一手牌怎麼打', '逐步動畫從發牌到攤牌', '#/learn/hand-flow'],
      ['📋', '速查表', '牌型、Outs、MDF 一頁搞定', '#/wiki/cheatsheet'],
    ].filter((q) => !q[3].startsWith('#/learn/') || ui.getLesson(q[3].split('/')[2]));

    const todayPlan = GTO.todayPlanDay ? GTO.todayPlanDay() : null;
    const drillPick = ['showdown', 'outs', 'preflop'].map((id) => (GTO.QUIZ_MODES || []).find((m) => m.id === id)).filter(Boolean);

    root.innerHTML =
      '<section class="home-hero">' +
        '<div class="hh-main">' +
          '<span class="hero-badge">♠ 免費 · 繁體中文 · 從零學到 GTO</span>' +
          '<h1>學會德州撲克，<br>從這裡開始。</h1>' +
          '<p class="hero-sub">' + lessonsN + ' 堂圖解課程、' + (GTO.QUIZ_MODES || []).length + ' 種無限隨機練習、40 張 6 人桌 GTO 範圍表與 ' + termsN + ' 個術語解釋。<br>完全新手也能一步一步學會，每天 15 分鐘就有感。</p>' +
          '<div class="hero-ctas">' + heroCtas + '</div>' +
          '<div class="hero-meta"><span>🔍 按 <kbd>/</kbd> 搜尋任何術語</span><span>💾 進度自動儲存</span><span>📱 手機也能練</span></div>' +
        '</div>' +
        '<div class="hh-side">' +
          GTO.pk.miniTable({
            cls: 'hero-table',
            seats: { BTN: { cards: ['As', 'Ks'], hero: true, label: 'BTN', sub: '你', hl: true }, SB: { cards: 'back' }, BB: { cards: 'back', bet: 1 }, UTG: { folded: true }, HJ: { folded: true }, CO: { folded: true } },
            board: ['Ah', 'Kd', '7s'], pot: 6.5,
          }) +
          '<div class="today-card">' +
            '<div class="tc-item">' + ui.progressRing(ov.pct, 58) + '<div><small>課程進度</small><b>' + ov.done + ' / ' + ov.total + ' 課</b></div></div>' +
            '<div class="tc-item">' + ui.progressRing(Math.min(100, Math.round(todayCnt / goal * 100)), 58, todayCnt) + '<div><small>今日練習</small><b>目標 ' + goal + ' 題</b></div></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="home-sec">' +
        '<div class="sec-head"><h2>🗺️ 學習路線</h2><a href="#/learn">看全部課程 →</a></div>' +
        '<div class="path-row">' + stageCards + '</div>' +
      '</section>' +

      '<section class="home-sec">' +
        '<div class="sec-head"><h2>⚡ 新手快速入口</h2></div>' +
        '<div class="quick-grid">' + quick.map((q) => '<a class="quick-card" href="' + q[3] + '"><span>' + q[0] + '</span><b>' + q[1] + '</b><small>' + q[2] + '</small></a>').join('') + '</div>' +
      '</section>' +

      '<section class="home-sec home-two">' +
        '<div class="home-col">' +
          '<div class="sec-head"><h2>🎯 今日練習</h2><a href="#/quiz">練習中心 →</a></div>' +
          '<div class="mini-modes">' + drillPick.map((m) => '<a class="mini-mode" href="#/quiz/' + m.id + '"><span>' + m.icon + '</span><div><b>' + m.title + '</b><small>' + m.sub + '</small></div><em>→</em></a>').join('') + '</div>' +
        '</div>' +
        '<div class="home-col">' +
          (todayPlan ? '<a class="plan-hero" href="#/learn?view=plan"><span>📅</span><div><small>30 天計畫 · Day ' + todayPlan.day + '</small><b>' + esc(todayPlan.title) + '</b><em>🎯 ' + esc(todayPlan.goal) + '</em></div><i>→</i></a>' : '') +
          (tip ? '<div class="sec-head"><h2>💡 今日一招</h2><a href="#/wiki/tips">更多技巧 →</a></div><div class="tip-hero"><b>' + esc(tip.title) + '</b><p>' + tip.text + '</p></div>' : '') +
          (term ? '<div class="term-hero"><small>今日術語</small><b>' + esc(term.term) + '｜' + esc(term.zh) + '</b><p>' + esc(term.short) + '</p><a href="#/wiki/glossary/' + term.id + '">看解釋 →</a></div>' : '') +
        '</div>' +
      '</section>' +

      (GTO.Monetize ? GTO.Monetize.bannerHtml('home') : '');
    GTO.hydrateCards(root);
  }

  // ===========================================================================
  // 2. 翻前範圍表（三步驟選情境）
  // ===========================================================================
  const CAT_INFO = {
    rfi: { icon: '🚀', label: '開池', desc: '前面的人都棄牌，你要不要第一個加注？', heroLbl: '② 你的位置', villLbl: '' },
    vsrfi: { icon: '⚔️', label: '面對加注', desc: '有人先加注了，你要 3-Bet、跟注還是棄牌？', heroLbl: '② 你的位置', villLbl: '③ 誰先加注？' },
    vs3bet: { icon: '🛡️', label: '被 3-Bet', desc: '你開池後被再加注，要 4-Bet、跟注還是棄牌？', heroLbl: '② 你在哪開池？', villLbl: '③ 誰 3-Bet 你？' },
    vs4bet: { icon: '💥', label: '被 4-Bet', desc: '你 3-Bet 後被 4-Bet，要全下、跟注還是棄牌？', heroLbl: '② 你在哪 3-Bet？', villLbl: '③ 誰 4-Bet 你？' },
  };
  const rangeState = { scId: 'rfi_utg', simple: true, compare: false, compareId: 'rfi_btn', hand: 'AKs' };

  function renderRangesPage(root, subScId) {
    if (subScId && GTO.SCENARIOS[subScId]) rangeState.scId = subScId;
    const list = GTO.SCENARIO_LIST;
    const pct = (x) => (x * 100).toFixed(1) + '%';

    let wrap = root.querySelector('#rangePageWrap');
    if (!wrap) {

    root.innerHTML =
        '<div id="rangePageWrap">' +
          ui.pageHead({
            icon: '📊', title: '翻前範圍表',
            sub: '6 人桌、100bb 的 GTO 簡化範圍。三步驟選好情境，就能看到每一手牌該怎麼打。',
            actions:
              '<div class="seg big"><button type="button" data-simple="1">✨ 簡易版（好記）</button>' +
              '<button type="button" data-simple="0">♟️ GTO 混合頻率</button></div>' +
              '<button type="button" class="btn" id="cmpBtn"></button>',
          }) +
          '<details class="help-box"><summary>❓ 第一次看範圍表？30 秒看懂</summary><div class="help-body">' +
            '<div><b>表格怎麼排</b><p>13×13 = 169 種起手牌。<b>對角線</b>是口袋對子（AA、KK…）；<b>右上半</b>是同花（s）；<b>左下半</b>是不同花（o）。越靠左上越強。</p></div>' +
            '<div><b>顏色代表動作</b><p><span class="sw-dot act-raise"></span>紅＝加注 <span class="sw-dot act-3bet"></span>玫瑰＝3-Bet <span class="sw-dot act-4bet"></span>紫＝4-Bet <span class="sw-dot act-call"></span>綠＝跟注 <span class="sw-dot act-fold"></span>灰＝棄牌。</p></div>' +
            '<div><b>兩種模式</b><p><b>簡易版</b>把混合頻率簡化成單一動作，適合背；<b>GTO 混合</b>用色條顯示 Solver 會用的頻率（例如一半加注、一半棄牌）。</p></div>' +
          '</div></details>' +
          '<div class="picker card" id="rangePicker"></div>' +
          '<div class="range-layout" id="rangeLayout">' +
            '<div class="card range-card">' +
              '<div class="rc-head" id="rcHead"></div>' +
              '<div class="freq-bar" id="freqBar"></div>' +
              '<div id="mainGrid"></div>' +
              '<div class="embed-legend" id="embedLegend"></div>' +
            '</div>' +
            '<div class="card range-card" id="cmpCard" hidden>' +
              '<div class="rc-head"><div><h2>對比</h2><select class="inp" id="cmpSel">' + list.map((s) => '<option value="' + s.id + '">' + esc(s.title) + '</option>').join('') + '</select></div></div>' +
              '<div id="cmpGrid"></div>' +
            '</div>' +
            '<div class="card range-side">' +
              '<div class="rs-sec" id="rangeSummary"></div>' +
              '<div class="rs-sec" id="handInspector"></div>' +
            '</div>' +
          '</div>' +
        '</div>';
      wrap = root.querySelector('#rangePageWrap');

      wrap.addEventListener('click', (e) => {
        const simpleBtn = e.target.closest('[data-simple]');
        if (simpleBtn) {
          rangeState.simple = simpleBtn.getAttribute('data-simple') === '1';
          renderRangesPage(root);
          return;
        }
        if (e.target.closest('#cmpBtn')) {
          rangeState.compare = !rangeState.compare;
          renderRangesPage(root);
          return;
        }
        const curSc = GTO.getScenario(rangeState.scId);
        const catBtn = e.target.closest('[data-cat]');
        if (catBtn) {
          const k = catBtn.getAttribute('data-cat');
          const first = list.find((s) => s.cat === k && s.hero === curSc.hero) || list.find((s) => s.cat === k);
          if (first) location.hash = '#/ranges/' + first.id;
          return;
        }
        const heroBtn = e.target.closest('[data-hero]');
        if (heroBtn) {
          const h = heroBtn.getAttribute('data-hero');
          const s = list.find((x) => x.cat === curSc.cat && x.hero === h && x.villain === curSc.villain) || list.find((x) => x.cat === curSc.cat && x.hero === h);
          if (s) location.hash = '#/ranges/' + s.id;
          return;
        }
        const villBtn = e.target.closest('[data-vill]');
        if (villBtn) {
          const v = villBtn.getAttribute('data-vill');
          const s = list.find((x) => x.cat === curSc.cat && x.hero === curSc.hero && x.villain === v);
          if (s) location.hash = '#/ranges/' + s.id;
        }
      });

      wrap.querySelector('#cmpSel').addEventListener('change', (e) => {
        rangeState.compareId = e.target.value;
        renderRangesPage(root);
      });
    }

    const sc = GTO.getScenario(rangeState.scId);
    const cat = sc.cat;
    const ci = CAT_INFO[cat];
    const heroes = GTO.POSITIONS.filter((pos) => list.some((s) => s.cat === cat && s.hero === pos));
    const villains = sc.villain ? GTO.POSITIONS.filter((pos) => list.some((s) => s.cat === cat && s.hero === sc.hero && s.villain === pos)) : [];
    const pAct = sc.primaryAction, st = sc.stats, isSub = !!sc.baseScenario;

    wrap.querySelectorAll('[data-simple]').forEach((b) => b.classList.toggle('on', (b.getAttribute('data-simple') === '1') === rangeState.simple));
    const cmpBtn = wrap.querySelector('#cmpBtn');
    cmpBtn.className = 'btn' + (rangeState.compare ? ' accent' : '');
    cmpBtn.textContent = '⚖️ ' + (rangeState.compare ? '關閉對比' : '雙表對比');

    wrap.querySelector('#rangePicker').innerHTML =
      '<div class="pk-row"><span class="pk-lbl">① 情境</span><div class="pk-cats">' + Object.keys(CAT_INFO).map((k) =>
        '<button type="button" class="pk-cat ' + (k === cat ? 'on' : '') + '" data-cat="' + k + '"><span>' + CAT_INFO[k].icon + '</span><b>' + CAT_INFO[k].label + '</b><small>' + CAT_INFO[k].desc + '</small></button>').join('') + '</div></div>' +
      '<div class="pk-row"><span class="pk-lbl">' + ci.heroLbl + '</span><div class="pk-pos">' + heroes.map((pos) =>
        '<button type="button" class="pos-btn ' + (pos === sc.hero ? 'on' : '') + '" data-hero="' + pos + '"><b>' + pos + '</b><small>' + GTO.POS_ZH[pos] + '</small></button>').join('') + '</div></div>' +
      (villains.length ? '<div class="pk-row"><span class="pk-lbl">' + ci.villLbl + '</span><div class="pk-pos">' + villains.map((pos) =>
        '<button type="button" class="pos-btn vill ' + (pos === sc.villain ? 'on' : '') + '" data-vill="' + pos + '"><b>' + pos + '</b><small>' + GTO.POS_ZH[pos] + '</small></button>').join('') + '</div></div>' : '');

    wrap.querySelector('#rangeLayout').classList.toggle('cmp', rangeState.compare);
    wrap.querySelector('#rcHead').innerHTML =
      '<div><h2>' + esc(sc.title) + '</h2><div class="rc-chips"><span class="chip">尺度 ' + esc(sc.openSize) + '</span><span class="chip info">範圍 ' + esc(sc.targetPct) + '</span></div></div>' +
      '<div class="rc-actions"><a class="btn primary" href="#/quiz/preflop?scenario=' + sc.id + '">🎯 測驗這張表</a><a class="btn" href="#/quiz/paint?scenario=' + sc.id + '">🎨 默寫</a></div>';

    wrap.querySelector('#freqBar').innerHTML =
      '<div class="fq act-' + pAct + '"><small>' + GTO.ACTIONS[pAct].label + '</small><b>' + Math.round(st.primaryCombos) + ' 組</b><em>' + (isSub ? '佔開池 ' + pct(st.primaryPctBase) : '全部 ' + pct(st.primaryPctAll)) + '</em></div>' +
      (sc.secondaryAction ? '<div class="fq act-call"><small>跟注</small><b>' + Math.round(st.callCombos) + ' 組</b><em>' + (isSub ? '佔開池 ' + pct(st.callPctBase) : '全部 ' + pct(st.callPctAll)) + '</em></div>' : '') +
      '<div class="fq act-fold"><small>棄牌</small><b>' + (isSub ? pct(st.foldPctBase) : pct(1 - st.continuePctAll)) + '</b><em>' + (isSub ? '的開池牌' : '的手牌') + '</em></div>';

    wrap.querySelector('#embedLegend').innerHTML =
      '<span class="lg-item"><i class="sw act-' + pAct + '"></i>' + GTO.ACTIONS[pAct].label + '</span>' +
      (sc.secondaryAction ? '<span class="lg-item"><i class="sw act-call"></i>跟注</span>' : '') +
      (!rangeState.simple ? '<span class="lg-item"><i class="sw act-mix"></i>混合頻率（色條比例）</span>' : '') +
      '<span class="lg-item"><i class="sw act-fold"></i>棄牌</span>' + (isSub ? '<span class="lg-item"><i class="sw not-base"></i>不在原本開池範圍</span>' : '');

    wrap.querySelector('#rangeSummary').innerHTML =
      '<h3>💡 這張表的重點</h3><p>' + esc(sc.summary) + '</p><ul class="tips-list">' + (sc.tips || []).map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';

    const onSel = (h) => {
      rangeState.hand = h;
      const cur = GTO.getScenario(rangeState.scId);
      renderHandInspector(wrap.querySelector('#handInspector'), cur, h);
    };
    GTO.renderGrid(wrap.querySelector('#mainGrid'), sc, { simple: rangeState.simple, selectedHand: rangeState.hand, onSelect: onSel });

    const cmpCard = wrap.querySelector('#cmpCard');
    cmpCard.hidden = !rangeState.compare;
    if (rangeState.compare) {
      wrap.querySelector('#cmpSel').value = rangeState.compareId;
      GTO.renderGrid(wrap.querySelector('#cmpGrid'), GTO.getScenario(rangeState.compareId), { simple: rangeState.simple, selectedHand: rangeState.hand, onSelect: onSel });
    }
    renderHandInspector(wrap.querySelector('#handInspector'), sc, rangeState.hand);
  }

  function renderHandInspector(box, sc, hand) {
    if (!box) return;
    hand = hand || 'AKs';
    const info = GTO.HAND_INFO[hand];
    const typeLabel = info.type === 'pair' ? '口袋對子 · 6 種組合' : info.type === 'suited' ? '同花 · 4 種組合' : '不同花 · 12 種組合';
    const rows = ['rfi_utg', 'rfi_hj', 'rfi_co', 'rfi_btn', 'rfi_sb'].map((id) => {
      const s = GTO.SCENARIOS[id];
      const c = s.cells[hand];
      const lbl = c.primary === 1 ? '開池' : c.primary > 0 ? '混合' : '棄牌';
      const cls = c.primary === 1 ? 'ok' : c.primary > 0 ? 'warn' : 'bad';
      return '<span class="pos-pill ' + cls + '"><b>' + s.hero + '</b>' + lbl + '</span>';
    }).join('');
    const tier = GTO.tierMap ? GTO.HAND_TIERS[GTO.tierMap()[hand] - 1] : null;
    box.innerHTML =
      '<h3>🔍 手牌解析 <span class="hand lg">' + hand + '</span></h3>' +
      '<div class="muted small">' + typeLabel + (tier ? ' · 新手分級：<span class="tier-tag" style="background:' + tier.color + ';color:' + tier.fg + '">' + tier.name + '</span>' : '') + ' · 點表格任一格切換</div>' +
      '<div class="callout key">' + GTO.explainHand(sc, hand) + '</div>' +
      '<div class="pos-pills-title">這手牌在各位置的開池建議</div><div class="pos-pills">' + rows + '</div>';
  }

  // ===========================================================================
  // 成就徽章
  // ===========================================================================
  function badgesHtml() {
    const p = GTO.progress;
    const ov = ui.overallProgress();
    const bg = ui.stageProgress('beginner');
    const m = (id) => (p.modes && p.modes[id]) || { a: 0, c: 0 };
    const days = GTO.studyDays();
    const list = [
      ['🌱', '踏出第一步', '完成第 1 堂課', ov.done, 1],
      ['🐣', '新手村畢業', '完成新手村全部課程', bg.done, Math.max(1, bg.total)],
      ['📚', '勤學不倦', '完成 10 堂課', ov.done, 10],
      ['🎓', 'GTO 學士', '完成全部課程', ov.done, Math.max(1, ov.total)],
      ['🎯', '百題斬', '累計練習 100 題', p.totals.a, 100],
      ['⚔️', '千題戰士', '累計練習 1000 題', p.totals.a, 1000],
      ['⚡', '手感火燙', '連續答對 10 題', p.streak.best || 0, 10],
      ['🔥', '無懈可擊', '連續答對 25 題', p.streak.best || 0, 25],
      ['📅', '三日不懈', '連續學習 3 天', days, 3],
      ['🗓️', '一週不間斷', '連續學習 7 天', days, 7],
      ['🏆', '比牌高手', '「誰贏了？」答對 50 題', m('showdown').c, 50],
      ['♠️', '翻前達人', '翻前決策答對 200 題', m('preflop').c, 200],
    ];
    const got = list.filter((b) => b[3] >= b[4]).length;
    return '<div class="card badge-card"><div class="spc-head"><h2>🏅 成就徽章</h2><span class="chip ok">' + got + ' / ' + list.length + '</span></div>' +
      '<div class="badge-grid">' + list.map((b) => {
        const ok = b[3] >= b[4];
        const pct = Math.min(100, Math.round((b[3] / b[4]) * 100));
        return '<div class="badge ' + (ok ? 'ok' : '') + '" title="' + esc(b[2]) + '"><span class="bd-ic">' + b[0] + '</span><b>' + b[1] + '</b><small>' + b[2] + '</small>' +
          (ok ? '<em>已解鎖</em>' : '<div class="bd-bar"><i style="width:' + pct + '%"></i></div><em>' + Math.min(b[3], b[4]) + ' / ' + b[4] + '</em>') + '</div>';
      }).join('') + '</div></div>';
  }

  // ===========================================================================
  // 5. GTO 計算機工具箱視圖 (#/tools)
  // ===========================================================================
  function renderToolsPage(root) {

    root.innerHTML =
      ui.pageHead({ icon: '🧮', title: '計算工具', sub: '勝率、底池賠率、MDF / Alpha、EV 與 SPR，全部在瀏覽器即時計算。不知道怎麼用？每個工具下方都有說明與一鍵範例。' }) +
      '<div class="tools-mini one">' + GTO.widgetHtml('pot-odds-mini') + '</div>' +

      '<div class="tools-grid">' +
        // 工具 1：Monte Carlo 勝率計算機
        '<section class="card tool-card">' +
          '<h2>🎲 1. 勝率計算機（Monte Carlo Equity Calculator）</h2>' +
          '<p class="muted">支援輸入具體兩張牌（如 <code>AsKh</code>）或範圍語法（如 <code>QQ+, AKs, AQs</code>），並可指定翻牌/轉牌公共牌！</p>' +
          '<div class="tool-presets">' +
            '<span class="muted">經典對決一鍵帶入：</span>' +
            '<button type="button" class="btn-xs" data-eqp="AsAd|KsKd|">AA vs KK</button>' +
            '<button type="button" class="btn-xs" data-eqp="QsQd|AsKs|">QQ vs AKs (跑馬)</button>' +
            '<button type="button" class="btn-xs" data-eqp="AsKd|AhQd|">AKo vs AQo (壓制)</button>' +
            '<button type="button" class="btn-xs" data-eqp="JhTh|As9d|9h8h2c">15 Outs 怪獸聽牌 vs 頂對</button>' +
            '<button type="button" class="btn-xs" data-eqp="QQ+,AKs,AKo|TT+,AQs+,AKo|">3B 範圍 vs 4B 範圍</button>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="fcol"><label class="lbl">玩家 1（手牌或範圍）</label><input id="eqP1Inp" class="inp" value="QsQd"></div>' +
            '<div class="fcol"><label class="lbl">玩家 2（手牌或範圍）</label><input id="eqP2Inp" class="inp" value="AsKs"></div>' +
            '<div class="fcol"><label class="lbl">公共牌（選填 0/3/4/5 張，如 Ks7d2c）</label><input id="eqBoardInp" class="inp" placeholder="留空代表翻牌前" value=""></div>' +
          '</div>' +
          '<button type="button" class="btn primary" id="runEquityBtn" style="margin-top:10px">⚡ 執行 20,000 次 Monte Carlo 勝率模擬</button>' +
          '<div id="eqResultBox" style="margin-top:12px"></div>' +
        '</section>' +

        // 工具 2：MDF / Alpha / 河牌最佳詐唬比計算機
        '<section class="card tool-card">' +
          '<h2>🛡️ 2. MDF 最小防守頻率 · Alpha · 價值詐唬比計算機</h2>' +
          '<p class="muted">輸入底池與對手下注金額（或點選常用底池比例），即時算出 MDF、Alpha、跟注必要勝率與河牌最佳價值詐唬比。</p>' +
          '<div class="tool-presets">' +
            '<span class="muted">快速尺度：</span>' +
            [25, 33, 50, 66, 75, 100, 150, 200].map((pctVal) =>
              '<button type="button" class="btn-xs" data-mdf-pct="' + pctVal + '">' + pctVal + '% 底池</button>'
            ).join('') +
          '</div>' +
          '<div class="form-row">' +
            '<div class="fcol"><label class="lbl">目前底池大小 (Pot)</label><input type="number" id="mdfPotInp" class="inp" value="100" min="1"></div>' +
            '<div class="fcol"><label class="lbl">對手下注金額 (Bet)</label><input type="number" id="mdfBetInp" class="inp" value="50" min="1"></div>' +
          '</div>' +
          '<div id="mdfResultBox" style="margin-top:12px"></div>' +
        '</section>' +

        // 工具 3：Outs 二四法則 & 跟注 EV 期望值計算機
        '<section class="card tool-card">' +
          '<h2>💰 3. 聽牌 Outs 成牌率 & 跟注期望值 (EV) 計算機</h2>' +
          '<p class="muted">輸入你的補牌數（Outs）或估計勝率，搭配上方底池與下注額，立即判斷跟注是否為 +EV！</p>' +
          '<div class="tool-presets">' +
            '<span class="muted">常見聽牌：</span>' +
            [['暗三條 2 Outs', 2], ['卡順 4 Outs', 4], ['兩高牌 6 Outs', 6], ['兩頭順 8 Outs', 8], ['同花聽 9 Outs', 9], ['花順複合 15 Outs', 15]].map(([lbl, o]) =>
              '<button type="button" class="btn-xs" data-outs="' + o + '">' + lbl + '</button>'
            ).join('') +
          '</div>' +
          '<div class="form-row">' +
            '<div class="fcol"><label class="lbl">補牌數 (Outs, 1–20)</label><input type="number" id="evOutsInp" class="inp" value="9" min="1" max="20"></div>' +
            '<div class="fcol"><label class="lbl">或直接輸入你的估計勝率 (%)</label><input type="number" id="evEqInp" class="inp" value="35" min="0" max="100"></div>' +
          '</div>' +
          '<div id="evResultBox" style="margin-top:12px"></div>' +
        '</section>' +

        // 工具 4：SPR 與幾何下注尺度 (Geometric Sizing) 計算機
        '<section class="card tool-card">' +
          '<h2>📐 4. SPR 籌碼底池比 & 幾何下注尺度 (e-sizing) 計算機</h2>' +
          '<p class="muted">計算進入翻牌圈時的 SPR，以及若想在 2 條街或 3 條街用等比例下注剛好打光籌碼（All-in），每一條街應下幾 % 底池與多少 bb。</p>' +
          '<div class="tool-presets">' +
            '<span class="muted">標準 100bb 底池帶入：</span>' +
            '<button type="button" class="btn-xs" data-spr="5.5|97.5">單次加注池 SRP (5.5bb / 97.5bb)</button>' +
            '<button type="button" class="btn-xs" data-spr="16.5|92.5">IP 3-Bet 池 (16.5bb / 92.5bb)</button>' +
            '<button type="button" class="btn-xs" data-spr="22.5|89">OOP 3-Bet 池 (22.5bb / 89bb)</button>' +
            '<button type="button" class="btn-xs" data-spr="43.5|79">4-Bet 池 (43.5bb / 79bb)</button>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="fcol"><label class="lbl">當前底池大小 (bb)</label><input type="number" id="sprPotInp" class="inp" value="16.5" step="0.5"></div>' +
            '<div class="fcol"><label class="lbl">剩餘有效籌碼 (bb)</label><input type="number" id="sprStackInp" class="inp" value="92.5" step="0.5"></div>' +
          '</div>' +
          '<div id="sprResultBox" style="margin-top:12px"></div>' +
        '</section>' +
      '</div>';

    const toolsGrid = root.querySelector('.tools-grid');
    const eqP1Inp = root.querySelector('#eqP1Inp');
    const eqP2Inp = root.querySelector('#eqP2Inp');
    const eqBoardInp = root.querySelector('#eqBoardInp');
    const eqResultBox = root.querySelector('#eqResultBox');
    const mdfPotInp = root.querySelector('#mdfPotInp');
    const mdfBetInp = root.querySelector('#mdfBetInp');
    const mdfResultBox = root.querySelector('#mdfResultBox');
    const evOutsInp = root.querySelector('#evOutsInp');
    const evEqInp = root.querySelector('#evEqInp');
    const evResultBox = root.querySelector('#evResultBox');
    const sprPotInp = root.querySelector('#sprPotInp');
    const sprStackInp = root.querySelector('#sprStackInp');
    const sprResultBox = root.querySelector('#sprResultBox');

    // 1. 勝率模擬邏輯
    const runEq = () => {
      try {
        const s1 = eqP1Inp.value.trim();
        const s2 = eqP2Inp.value.trim();
        const bStr = eqBoardInp.value.trim();
        const bdCards = bStr ? GTO.parseCards(bStr) : [];
        if (bStr && (!bdCards || ![0, 3, 4, 5].includes(bdCards.length))) {
          throw new Error('公共牌請輸入 0、3、4 或 5 張牌（例如 Ks7d2c）');
        }
        const bdInts = (bdCards || []).map(GTO.cardToInt);
        const c1 = GTO.toCombos(s1).combos;
        const c2 = GTO.toCombos(s2).combos;
        const res = GTO.simulate([c1, c2], bdInts, 20000);
        const e1 = (res.equity[0] * 100).toFixed(1);
        const e2 = (res.equity[1] * 100).toFixed(1);
        eqResultBox.innerHTML =
          '<div class="calc-res-box">' +
            '<div class="eq-bar-wrap">' +
              '<div class="eq-bar-p1" style="width:' + e1 + '%">玩家 1：' + e1 + '%</div>' +
              '<div class="eq-bar-p2" style="width:' + e2 + '%">玩家 2：' + e2 + '%</div>' +
            '</div>' +
            '<div class="calc-metrics">' +
              '<div>玩家 1 獨贏：<strong>' + (res.win[0] * 100).toFixed(1) + '%</strong>（可用 ' + c1.length + ' 組）</div>' +
              '<div>平分底池 (Tie)：<strong>' + (res.tie[0] * 100).toFixed(1) + '%</strong></div>' +
              '<div>玩家 2 獨贏：<strong>' + (res.win[1] * 100).toFixed(1) + '%</strong>（可用 ' + c2.length + ' 組）</div>' +
            '</div>' +
          '</div>';
      } catch (err) {
        eqResultBox.innerHTML = '<div class="callout warn">' + GTO.esc(err.message || String(err)) + '</div>';
      }
    };
    runEq();

    // 2 & 3. MDF + EV 同步計算
    let mdfRaf = 0;
    const updateMdfAndEv = () => {
      mdfRaf = 0;
      const pot = Math.max(0.1, parseFloat(mdfPotInp.value) || 100);
      const bet = Math.max(0.1, parseFloat(mdfBetInp.value) || 50);
      const pctPot = (bet / pot) * 100;
      const reqEq = (bet / (pot + 2 * bet)) * 100;
      const alpha = (bet / (pot + bet)) * 100;
      const mdf = (pot / (pot + bet)) * 100;
      const valRatio = (pot + bet) / bet;

      mdfResultBox.innerHTML =
        '<div class="calc-grid-4">' +
          '<div class="cmetric"><div class="cm-val">' + mdf.toFixed(1) + '%</div><div class="cm-lbl">MDF 最小防守頻率</div></div>' +
          '<div class="cmetric"><div class="cm-val">' + alpha.toFixed(1) + '%</div><div class="cm-lbl">Alpha 詐唬回本棄牌率</div></div>' +
          '<div class="cmetric"><div class="cm-val">' + reqEq.toFixed(1) + '%</div><div class="cm-lbl">跟注所需最低勝率</div></div>' +
          '<div class="cmetric"><div class="cm-val">' + valRatio.toFixed(2).replace(/\.00$/, '') + ' : 1</div><div class="cm-lbl">河牌最佳 價值:詐唬 (' + reqEq.toFixed(1) + '% 詐唬)</div></div>' +
        '</div>' +
        '<div class="muted" style="margin-top:6px">當前下注尺度為 <strong>' + pctPot.toFixed(1) + '% 底池</strong>，防守方最多只能棄牌 <strong>' + alpha.toFixed(1) + '%</strong>。</div>';

      const outs = Math.max(0, Math.min(25, parseInt(evOutsInp.value, 10) || 0));
      const eqUser = Math.max(0, Math.min(100, parseFloat(evEqInp.value) || 0));
      const turnHit = (outs / 47) * 100;
      const river2Hit = (1 - ((47 - outs) / 47) * ((46 - outs) / 46)) * 100;
      const evCall = (eqUser / 100) * (pot + bet) - (1 - eqUser / 100) * bet;

      evResultBox.innerHTML =
        '<div class="calc-grid-3">' +
          '<div class="cmetric"><div class="cm-val">' + turnHit.toFixed(1) + '%</div><div class="cm-lbl">' + outs + ' Outs 轉牌一張命中率</div></div>' +
          '<div class="cmetric"><div class="cm-val">' + river2Hit.toFixed(1) + '%</div><div class="cm-lbl">' + outs + ' Outs 翻到河兩張命中率</div></div>' +
          '<div class="cmetric ' + (evCall >= 0 ? 'good' : 'bad') + '"><div class="cm-val">' + (evCall >= 0 ? '+' : '') + evCall.toFixed(1) + '</div><div class="cm-lbl">以 ' + eqUser + '% 勝率跟注之 EV</div></div>' +
        '</div>';
    };
    updateMdfAndEv();

    // 4. SPR 與幾何尺度計算
    let sprRaf = 0;
    const updateSpr = () => {
      sprRaf = 0;
      const p = Math.max(0.5, parseFloat(sprPotInp.value) || 16.5);
      const s = Math.max(0.5, parseFloat(sprStackInp.value) || 92.5);
      const spr = s / p;
      const g2 = (Math.pow(1 + 2 * spr, 1 / 2) - 1) / 2;
      const g3 = (Math.pow(1 + 2 * spr, 1 / 3) - 1) / 2;
      const b1_3 = p * g3;
      const p2_3 = p + 2 * b1_3;
      const b2_3 = p2_3 * g3;
      const p3_3 = p2_3 + 2 * b2_3;
      const b3_3 = p3_3 * g3;

      sprResultBox.innerHTML =
        '<div class="calc-grid-3">' +
          '<div class="cmetric"><div class="cm-val">SPR = ' + spr.toFixed(2) + '</div><div class="cm-lbl">' + (spr <= 2.5 ? '極低 SPR（頂對即全下）' : spr <= 6.5 ? '中低 SPR（超對/TPTK 可打光）' : '高 SPR（需兩對/暗三條以上打光）') + '</div></div>' +
          '<div class="cmetric"><div class="cm-val">' + (g2 * 100).toFixed(0) + '% 底池</div><div class="cm-lbl">2 條街幾何全下每街比例 (首街 ' + (p * g2).toFixed(1) + 'bb)</div></div>' +
          '<div class="cmetric"><div class="cm-val">' + (g3 * 100).toFixed(0) + '% 底池</div><div class="cm-lbl">3 條街幾何全下每街比例</div></div>' +
        '</div>' +
        '<div class="muted" style="margin-top:8px">📏 <strong>三條街等比打光路線：</strong>翻牌下 <strong>' + b1_3.toFixed(1) + 'bb</strong>（底池變 ' + p2_3.toFixed(1) + 'bb）→ 轉牌下 <strong>' + b2_3.toFixed(1) + 'bb</strong>（底池變 ' + p3_3.toFixed(1) + 'bb）→ 河牌全下剩餘 <strong>' + b3_3.toFixed(1) + 'bb</strong>！</div>';
    };
    updateSpr();

    toolsGrid.addEventListener('click', (e) => {
      if (e.target.closest('#runEquityBtn')) { runEq(); return; }
      const eqp = e.target.closest('[data-eqp]');
      if (eqp) {
        const [p1, p2, bd] = eqp.getAttribute('data-eqp').split('|');
        eqP1Inp.value = p1;
        eqP2Inp.value = p2;
        eqBoardInp.value = bd || '';
        runEq();
        return;
      }
      const mdfBtn = e.target.closest('[data-mdf-pct]');
      if (mdfBtn) {
        const pot = parseFloat(mdfPotInp.value) || 100;
        const pctVal = parseFloat(mdfBtn.getAttribute('data-mdf-pct'));
        mdfBetInp.value = Math.round((pot * pctVal) / 100);
        updateMdfAndEv();
        return;
      }
      const outsBtn = e.target.closest('[data-outs]');
      if (outsBtn) {
        const o = parseInt(outsBtn.getAttribute('data-outs'), 10);
        evOutsInp.value = o;
        evEqInp.value = ((1 - ((47 - o) / 47) * ((46 - o) / 46)) * 100).toFixed(1);
        updateMdfAndEv();
        return;
      }
      const sprBtn = e.target.closest('[data-spr]');
      if (sprBtn) {
        const [p, s] = sprBtn.getAttribute('data-spr').split('|');
        sprPotInp.value = p;
        sprStackInp.value = s;
        updateSpr();
      }
    });

    toolsGrid.addEventListener('input', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      const t = e.target;
      if (t === evOutsInp) {
        const outs = Math.max(0, Math.min(25, parseInt(t.value, 10) || 0));
        evEqInp.value = ((1 - ((47 - outs) / 47) * ((46 - outs) / 46)) * 100).toFixed(1);
        if (!mdfRaf) mdfRaf = requestAnimationFrame(updateMdfAndEv);
      } else if (t === mdfPotInp || t === mdfBetInp || t === evEqInp) {
        if (!mdfRaf) mdfRaf = requestAnimationFrame(updateMdfAndEv);
      } else if (t === sprPotInp || t === sprStackInp) {
        if (!sprRaf) sprRaf = requestAnimationFrame(updateSpr);
      }
    });
  }

  // ===========================================================================
  // 6. 學習統計與錯題本視圖 (#/stats)
  // ===========================================================================
  function renderStatsPage(root) {
    const p = GTO.progress;
    const totalA = p.totals.a || 0;
    const totalAcc = totalA ? Math.round((p.totals.c / totalA) * 100) : 0;

    const modeRows = GTO.QUIZ_MODES.map((m) => {
      const st = (p.modes && p.modes[m.id]) || { a: 0, c: 0 };
      const acc = st.a ? Math.round((st.c / st.a) * 100) + '%' : '尚未作答';
      return '<tr><td>' + m.icon + ' <strong>' + m.title + '</strong></td><td>' + st.a + ' 題</td><td>' + st.c + ' 題</td><td><strong>' + acc + '</strong></td><td><a class="btn-xs primary" href="#/quiz/' + m.id + '">繼續練習</a></td></tr>';
    }).join('');

    const posRows = GTO.POSITIONS.map((pos) => {
      const st = (p.preflop && p.preflop.byPos && p.preflop.byPos[pos]) || { a: 0, c: 0 };
      const acc = st.a ? Math.round((st.c / st.a) * 100) + '%' : '—';
      return '<tr><td><strong>' + pos + '</strong> (' + GTO.POS_ZH[pos] + ')</td><td>' + st.a + ' 題</td><td><strong>' + acc + '</strong></td></tr>';
    }).join('');

    // 計算 169 手牌累計答錯次數熱力圖
    const handMissCnt = {};
    const missedMap = (p.preflop && p.preflop.missed) || {};
    for (const k in missedMap) {
      const h = k.split(':')[1];
      if (h) handMissCnt[h] = (handMissCnt[h] || 0) + missedMap[k];
    }

    const heatmapCells = GTO.HANDS.map((h) => {
      const cnt = handMissCnt[h] || 0;
      const cls = cnt >= 3 ? 'hm-high' : cnt === 2 ? 'hm-mid' : cnt === 1 ? 'hm-low' : '';
      return '<div class="rcell ' + cls + '" title="' + h + ' 累計答錯 ' + cnt + ' 次"><span class="rh">' + h + '</span>' + (cnt ? '<span class="rmix-dot">' + cnt + '</span>' : '') + '</div>';
    }).join('');

    const mistakes = p.mistakes || [];
    const mistakeHtml = mistakes.length ? mistakes.slice(0, 40).map((m, idx) => {
      if (m.kind === 'preflop') {
        return (
          '<div class="mistake-item">' +
            '<div>' +
              '<span class="chip warn">翻前實戰</span> ' +
              '<strong>' + GTO.esc(m.title) + '</strong> · 手牌 <span class="hand">' + GTO.esc(m.hand) + '</span>：' +
              '你選了「' + GTO.esc((GTO.ACTIONS[m.chosen] || {}).label || m.chosen) + '」，標準動作為「<strong>' + GTO.esc((GTO.ACTIONS[m.best] || {}).label || m.best) + '</strong>」' +
            '</div>' +
            '<div class="mi-btns">' +
              '<a class="btn-xs" href="#/ranges/' + m.scId + '">查看範圍表</a>' +
              '<button type="button" class="btn-xs primary" data-retest-pf="' + m.scId + ':' + m.hand + '">🔁 重練此手牌</button>' +
            '</div>' +
          '</div>'
        );
      }
      return (
        '<div class="mistake-item">' +
          '<div>' +
            '<span class="chip info">' + GTO.esc(m.badge || '選擇題') + '</span> ' +
            '<strong>' + GTO.esc(m.q) + '</strong><br>' +
            '<span class="muted">你的答案：' + GTO.esc(m.chosen) + ' ｜ 正確答案：<strong>' + GTO.esc(m.best) + '</strong></span>' +
          '</div>' +
          '<button type="button" class="btn-xs" data-del-mistake="' + idx + '">移除</button>' +
        '</div>'
      );
    }).join('') : '<div class="muted" style="padding:18px 0">🎉 目前沒有錯題紀錄！快去「隨機測驗練習」挑戰幾題吧！</div>';

    const canDownloadDist = GTO.isLocalServer ? GTO.isLocalServer() : false;
    const distCardHtml = canDownloadDist ? (
      '<div class="card" style="margin-top:18px" id="share-export">' +
        '<h3>📦 外部電腦離線版下載 ＆ 30 秒免費公開架站（分享給非 Google 朋友）</h3>' +
        '<p class="muted" style="margin:6px 0 14px">本工具為 100% 純前端架構（零內部套件依賴），已為您打包好兩種外部版本，朋友無須安裝任何環境即可使用：</p>' +
        '<div class="stats-grid">' +
          '<div style="background:var(--surface-sub);border:1px solid var(--border-strong);border-radius:12px;padding:16px">' +
            '<strong>📄 方式一：單一 HTML 檔免安裝離線版（最簡單）</strong>' +
            '<p class="muted" style="margin:6px 0 12px">將全部 54 堂課、40 張範圍表與 14 種練習模式濃縮成<strong>單一 `.html` 檔（約 1.5 MB）</strong>。直接傳 LINE / Email 給朋友，電腦或手機<strong>點兩下就能離線打開</strong>！</p>' +
            '<a class="btn primary" href="/download/single" download="GTO_Poker_Academy_Standalone.html">⬇️ 下載單一 HTML 免安裝版 (.html)</a>' +
          '</div>' +
          '<div style="background:var(--surface-sub);border:1px solid var(--border-strong);border-radius:12px;padding:16px">' +
            '<strong>🌐 方式二：完整網站與 PWA 部署包（30 秒免費架成公開網站）</strong>' +
            '<p class="muted" style="margin:6px 0 12px">內含完整靜態網站、手機「加入主畫面」PWA 設定與 Windows/Mac 啟動腳本。將此 ZIP 直接拖進 <strong>Cloudflare Pages</strong> 或 <strong>Netlify Drop</strong> 即可免費獲得永久公開 `https://` 網址！</p>' +
            '<a class="btn" href="/download/zip" download="GTO_Poker_Academy_Web_Package.zip">📦 下載網站部署與離線安裝包 (.zip)</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    ) : '';

    const arenaStats = p.arenaStats || { handsPlayed: 0, totalProfitBb: 0, totalDecisions: 0, goodDecisions: 0, leaks: {} };
    const leakList = Object.values(arenaStats.leaks || {}).sort((a, b) => b.evLossBb - a.evLossBb);
    const leakRows = leakList.length ? leakList.map((item, idx) => {
      const def = (GTO.CoachEngine && GTO.CoachEngine.LEAK_DEFINITIONS && GTO.CoachEngine.LEAK_DEFINITIONS[item.code]) || {};
      const theoryList = GTO.THEORY || [];
      const lessonCards = (item.lessons || []).map((lid) => {
        const f = theoryList.find((l) => l.id === lid);
        return f ? '<a href="#/learn/' + f.id + '" class="leak-lesson-pill">📖 <b>' + GTO.esc(f.title) + '</b></a>' : '';
      }).join(' ');
      return '<tr><td><span class="lc-rank">TOP ' + (idx + 1) + '</span> <strong>' + GTO.esc(def.title || item.title || item.code) + '</strong></td>' +
        '<td>' + item.count + ' 次</td>' +
        '<td><strong class="minus">-' + item.evLossBb + 'bb</strong></td>' +
        '<td>' + lessonCards + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted">目前尚未在 6 人實戰桌累積顯著失誤，表現優異！</td></tr>';

    const arenaStatsCard =
      '<div class="card" style="margin-top:18px">' +
        '<div class="sec-head"><h3>♠️ 6 人實戰桌戰績與個人漏洞雷達（Leak Finder）</h3><a href="#/replay" class="btn-xs">前往覆盤室 →</a></div>' +
        '<div class="stats-kpi-row" style="margin-bottom:14px">' +
          '<div class="card skpi"><span>實戰手數</span><strong>' + arenaStats.handsPlayed + ' 手</strong></div>' +
          '<div class="card skpi"><span>總盈虧 (bb)</span><strong class="' + (arenaStats.totalProfitBb >= 0 ? 'plus' : 'minus') + '">' + (arenaStats.totalProfitBb >= 0 ? '+' : '') + arenaStats.totalProfitBb + ' bb</strong></div>' +
          '<div class="card skpi"><span>決策標準率</span><strong>' + (arenaStats.totalDecisions ? Math.round((arenaStats.goodDecisions / arenaStats.totalDecisions) * 100) : 0) + '%</strong></div>' +
          '<div class="card skpi"><span>待改善漏洞</span><strong>' + leakList.length + ' 項</strong></div>' +
        '</div>' +
        '<table class="tbl"><thead><tr><th>常犯漏洞觀念</th><th>發生次數</th><th>累計損耗 EV</th><th>推薦補課指引</th></tr></thead><tbody>' + leakRows + '</tbody></table>' +
      '</div>';

    root.innerHTML =
      ui.pageHead({ icon: '📈', title: '我的進度', sub: '課程完成度、練習正確率、翻前弱點熱力圖與錯題本——紀錄自動儲存在瀏覽器與本機伺服器。',
        actions: '<button type="button" class="btn" id="exportProgressBtn">📥 匯出進度</button>' +
          '<label class="btn" style="cursor:pointer;margin:0">📤 匯入進度<input type="file" id="importProgressInp" accept=".json,application/json" style="display:none"></label>' +
          '<button type="button" class="btn" id="resetProgressBtn">🗑️ 重置紀錄</button>' }) +
      '<div class="card stage-progress-card"><div class="spc-head"><h2>🎓 課程進度</h2>' + ui.progressRing(ui.overallProgress().pct, 64) + '</div>' +
        '<div class="sp-rows">' + ui.STAGES.map((st) => {
          const sp = ui.stageProgress(st.id);
          if (!sp.total) return '';
          return '<a class="sp-row" href="#/learn?stage=' + st.id + '"><span>' + st.icon + ' ' + st.title + '</span><div class="sp-bar"><i style="width:' + sp.pct + '%;background:' + st.color + '"></i></div><b>' + sp.done + ' / ' + sp.total + '</b></a>';
        }).join('') + '</div></div>' +
      badgesHtml() +

      arenaStatsCard +

      '<div class="stats-kpi-row">' +
        '<div class="card skpi"><span>總練習題數</span><strong>' + totalA + ' 題</strong></div>' +
        '<div class="card skpi"><span>總平均正確率</span><strong>' + totalAcc + '%</strong></div>' +
        '<div class="card skpi"><span>最高連勝紀錄</span><strong>🔥 ' + (p.streak.best || 0) + ' 連勝</strong></div>' +
        '<div class="card skpi"><span>連續學習天數</span><strong>📅 ' + GTO.studyDays() + ' 天</strong></div>' +
      '</div>' +

      '<div class="stats-grid">' +
        '<div class="card">' +
          '<h3>🎯 各練習模式成績統計</h3>' +
          '<table class="tbl"><thead><tr><th>測驗模式</th><th>作答題數</th><th>答對題數</th><th>正確率</th><th>操作</th></tr></thead><tbody>' + modeRows + '</tbody></table>' +
          '<h3 style="margin-top:20px">🧭 6 人桌各位置翻前決策準確率</h3>' +
          '<table class="tbl"><thead><tr><th>位置</th><th>作答題數</th><th>正確率</th></tr></thead><tbody>' + posRows + '</tbody></table>' +
        '</div>' +

        '<div class="card">' +
          '<h3>🔥 13×13 翻前弱點手牌熱力圖（數字代表累計答錯次數）</h3>' +
          '<p class="muted">越紅的手牌代表你在實戰測驗中越常猶豫或答錯，點擊「隨機測驗」開啟邊緣牌強化即可優先複習這些手牌！</p>' +
          '<div class="rgrid heatmap-grid">' + heatmapCells + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="card" style="margin-top:18px">' +
        '<div class="sec-head">' +
          '<h3>📓 最近錯題本（共 ' + mistakes.length + ' 筆）</h3>' +
          (mistakes.length ? '<button type="button" class="btn-xs" id="clearMistakesBtn">清空錯題本</button>' : '') +
        '</div>' +
        '<div class="mistake-list">' + mistakeHtml + '</div>' +
      '</div>' +
      distCardHtml;

    const expBtn = root.querySelector('#exportProgressBtn');
    if (expBtn) {
      expBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(GTO.progress, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'poker_gto_progress_' + GTO.todayKey() + '.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        GTO.toast('✅ 已匯出學習進度 JSON', 'ok');
      });
    }
    const impInp = root.querySelector('#importProgressInp');
    if (impInp) {
      impInp.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(String(reader.result || '{}'));
            if (!data || typeof data !== 'object') throw new Error('bad json');
            Object.assign(GTO.progress, data);
            GTO.saveProgress(true);
            renderStatsPage(root);
            updateHeaderStats();
            GTO.toast('🎉 學習進度匯入成功！', 'ok');
          } catch (err) {
            GTO.toast('匯入失敗：請選擇有效的進度 JSON 檔案', 'bad');
          }
        };
        reader.readAsText(file);
      });
    }

    root.querySelector('#resetProgressBtn').addEventListener('click', () => {
      if (confirm('確定要重置所有練習統計與錯題紀錄嗎？')) {
        GTO.resetProgress();
        renderStatsPage(root);
        updateHeaderStats();
      }
    });
    const clrBtn = root.querySelector('#clearMistakesBtn');
    if (clrBtn) {
      clrBtn.addEventListener('click', () => {
        GTO.progress.mistakes = [];
        GTO.saveProgress();
        renderStatsPage(root);
      });
    }
    const mistakeList = root.querySelector('.mistake-list');
    if (mistakeList) {
      mistakeList.addEventListener('click', (e) => {
        const delBtn = e.target.closest('[data-del-mistake]');
        if (delBtn && mistakeList.contains(delBtn)) {
          const i = Number(delBtn.getAttribute('data-del-mistake'));
          GTO.progress.mistakes.splice(i, 1);
          GTO.saveProgress();
          renderStatsPage(root);
          return;
        }
        const retestBtn = e.target.closest('[data-retest-pf]');
        if (retestBtn && mistakeList.contains(retestBtn)) {
          const [scId, hand] = retestBtn.getAttribute('data-retest-pf').split(':');
          location.hash = '#/quiz/preflop?scenario=' + scId + '&hand=' + hand;
        }
      });
    }
  }

  // ===========================================================================
  // 路由器啟動
  // ===========================================================================
  let prevPage = '';
  function route() {
    const { page, sub, extra, query } = parseHash();
    const main = document.getElementById('appMain');
    if (!main) return;
    if (page === 'theory') { location.replace('#/learn' + (sub ? '/' + sub : '')); return; }
    if (page === 'glossary') { location.replace('#/wiki/glossary' + (sub ? '/' + sub : '')); return; }
    if (GTO.teardownLearn) GTO.teardownLearn();
    if (GTO.teardownWiki) GTO.teardownWiki();
    if (GTO.teardownQuiz) GTO.teardownQuiz();
    if (GTO.ArenaUI && GTO.ArenaUI.teardownPlay) GTO.ArenaUI.teardownPlay();
    if (GTO.ReplayUI && GTO.ReplayUI.teardownReplay) GTO.ReplayUI.teardownReplay();
    renderHeader(page);
    main.className = 'app-main page-' + page;
    try {
      if (page === 'play') { if (GTO.ArenaUI) GTO.ArenaUI.renderPlayPage(main, sub, query); }
      else if (page === 'replay') { if (GTO.ReplayUI) GTO.ReplayUI.renderReplayPage(main, sub); }
      else if (page === 'learn') GTO.renderLearnPage(main, sub, query);
      else if (page === 'ranges') renderRangesPage(main, sub);
      else if (page === 'quiz') {
        if (!sub && !query.topic && !query.scenario) GTO.renderPracticeHub(main);
        else if (query.topic) GTO.renderQuizPage(main, 'theory', query);
        else {
          GTO.renderQuizPage(main, sub || 'preflop', query);
          if (query.scenario && query.hand && GTO.SCENARIOS[query.scenario]) {
            GTO.nextQuestion(GTO.generatePreflopQuestion(GTO.SCENARIOS[query.scenario], query.hand));
          }
        }
      } else if (page === 'wiki') GTO.renderWikiPage(main, sub || 'glossary', query, extra);
      else if (page === 'tools') renderToolsPage(main);
      else if (page === 'stats') renderStatsPage(main);
      else if (page === 'resources') { if (GTO.Monetize) GTO.Monetize.renderResourcesPage(main); }
      else if (page === 'legal') { if (GTO.Legal) GTO.Legal.renderLegalPage(main, sub); }
      else if (page === 'feedback') GTO.renderFeedbackPage(main);
      else renderHomePage(main);
      if (GTO.hydrateWidgets) GTO.hydrateWidgets(main);
      if (GTO.Monetize) GTO.Monetize.trackPageView(page, sub);
    } catch (e) {
      console.error(e);
      main.innerHTML = '<div class="empty">頁面載入失敗：' + esc(e.message) + '　<a href="#/home">回首頁</a></div>';
    }
    if (GTO.Legal) GTO.Legal.renderFooter(page);
    const keepRangeScroll = prevPage === 'ranges' && page === 'ranges';
    prevPage = page;
    const skipScrollTop = keepRangeScroll || (page === 'learn' && query && query.sec);
    if (!skipScrollTop) window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.addEventListener('hashchange', route);
  GTO.on('progress', updateHeaderStats);
  GTO.on('progress-replaced', () => {
    updateHeaderStats();
    const { page } = parseHash();
    if (['home', 'learn', 'stats'].includes(page)) route();
  });

  document.addEventListener('DOMContentLoaded', () => {
    ui.prepareContent();
    route();
    Promise.resolve(GTO.syncFromServer()).catch(() => {}).then(() => {
      const p = parseHash().page;
      if (!p || p === 'home') ui.maybeOnboard();
    });
    // 截圖 / 自動化測試用：?shot=1&open=search:關鍵字 或 ?shot=1&open=onboard
    const open = /[?&]open=([^&]+)/.exec(location.search);
    if (open) {
      const v = decodeURIComponent(open[1]);
      if (v.startsWith('search')) ui.openSearch(v.split(':')[1] || '');
      else if (v === 'onboard') ui.maybeOnboard(true);
    }
  });
})();

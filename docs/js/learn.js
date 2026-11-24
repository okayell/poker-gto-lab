/* GTO 撲克學院 — learn.js
 * 學習地圖（#/learn）與課程閱讀頁（#/learn/<lessonId>）：
 *   - 6 階段學習路線（新手村 → 實戰進階），顯示進度與推薦下一課
 *   - 課程頁：一句話重點、白話比喻、本課重點、內文（互動元件 / 範圍小圖 / 術語提示）、
 *     目錄跟隨、課後小測驗、參考來源、上一課 / 下一課
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const ui = GTO.ui;
  const esc = (s) => GTO.esc(s);

  let qByTopic = null;
  function questionsForLesson(topicId) {
    if (!qByTopic) {
      qByTopic = Object.create(null);
      (GTO.QUESTIONS || []).forEach((q) => {
        if (q && q.topic) (qByTopic[q.topic] || (qByTopic[q.topic] = [])).push(q);
      });
    }
    return qByTopic[topicId] || [];
  }

  let tocObserver = null;
  let scrollCleanup = null;
  let jumpTimer = 0;
  function teardownLearn() {
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    if (scrollCleanup) { scrollCleanup(); scrollCleanup = null; }
    if (jumpTimer) { clearTimeout(jumpTimer); jumpTimer = 0; }
  }

  // ===========================================================================
  // 學習地圖
  // ===========================================================================
  function renderLearnMap(root) {
    const all = GTO.THEORY || [];
    const ov = ui.overallProgress();
    const nl = ui.nextLesson();
    const totalMin = all.reduce((s, l) => s + (l.minutes || 0), 0);

    const stepper = ui.STAGES.map((st) => {
      const sp = ui.stageProgress(st.id);
      if (!sp.total) return '';
      return '<a class="stage-step ' + (sp.done === sp.total ? 'done' : '') + '" href="#/learn?stage=' + st.id + '" data-jump="' + st.id + '" style="' + ui.stageVars(st) + '">' +
        '<span class="ss-ic">' + st.icon + '</span>' +
        '<span class="ss-txt"><small>STAGE ' + st.no + '</small><b>' + st.title + '</b></span>' +
        '<span class="ss-bar"><i style="width:' + sp.pct + '%"></i></span>' +
        '<span class="ss-cnt">' + sp.done + '/' + sp.total + '</span>' +
      '</a>';
    }).join('');

    const sections = ui.STAGES.map((st) => {
      const ls = ui.lessonsOfStage(st.id);
      if (!ls.length) return '';
      const sp = ui.stageProgress(st.id);
      return '<section class="stage-sec" id="stage-' + st.id + '" style="' + ui.stageVars(st) + '">' +
        '<div class="stage-head">' +
          '<span class="sh-ic">' + st.icon + '</span>' +
          '<div class="sh-txt"><small>STAGE ' + st.no + '</small><h2>' + st.title + '</h2><p>' + st.sub + '</p></div>' +
          '<div class="sh-prog">' + ui.progressRing(sp.pct, 54, sp.done + '/' + sp.total) + '</div>' +
        '</div>' +
        '<div class="lesson-grid">' + ls.map((l, i) => lessonCard(l, i + 1, nl && nl.id === l.id)).join('') + '</div>' +
      '</section>';
    }).join('');

    root.innerHTML =
      ui.pageHead({
        icon: '🎓', title: '學習地圖',
        sub: all.length + ' 堂課、約 ' + Math.round(totalMin / 60) + ' 小時，從「完全不會」一路學到 GTO。照順序走最輕鬆，也可以直接點有興趣的課。',
        actions: '<button type="button" class="btn" id="relevelBtn">🧭 重新選擇程度</button>',
      }) +
      learnTabs('map') +
      (nl ? (
        '<div class="continue-card">' +
          '<div class="cc-ring">' + ui.progressRing(ov.pct, 76) + '</div>' +
          '<div class="cc-txt"><small>' + (ov.done ? '下一課推薦' : '從這裡開始') + ' · ' + (ui.STAGE_MAP[nl.stage].icon + ' ' + ui.STAGE_MAP[nl.stage].title) + '</small>' +
            '<h3>' + nl.icon + ' ' + esc(nl.title) + '</h3><p>' + esc(nl.tldr || nl.summary || '') + '</p></div>' +
          '<a class="btn primary lg" href="#/learn/' + nl.id + '">▶ ' + (ov.done ? '繼續學習' : '開始第一課') + '</a>' +
        '</div>'
      ) : '<div class="continue-card done"><div class="cc-txt"><h3>🎉 全部課程都完成了！</h3><p>到練習中心保持手感，或用範圍表複習。</p></div><a class="btn primary lg" href="#/quiz">前往練習</a></div>') +
      '<nav class="stage-stepper">' + stepper + '</nav>' +
      sections;

    const stepperEl = root.querySelector('.stage-stepper');
    if (stepperEl) {
      stepperEl.addEventListener('click', (e) => {
        const a = e.target && e.target.closest ? e.target.closest('[data-jump]') : null;
        if (!a) return;
        e.preventDefault();
        const sec = document.getElementById('stage-' + a.getAttribute('data-jump'));
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    const rb = root.querySelector('#relevelBtn');
    if (rb) rb.addEventListener('click', () => ui.maybeOnboard(true));
  }

  function lessonCard(l, no, isNext) {
    const done = ui.isDone(l.id);
    return '<a class="lesson-card ' + (done ? 'done' : '') + (isNext ? ' next' : '') + '" href="#/learn/' + l.id + '">' +
      '<div class="lc-top"><span class="lc-ic">' + (l.icon || '📘') + '</span><span class="lc-no">' + (done ? '✓ 已完成' : isNext ? '👉 下一課' : '第 ' + no + ' 課') + '</span></div>' +
      '<h3>' + esc(l.title) + '</h3>' +
      '<p>' + esc(l.tldr || l.summary || '') + '</p>' +
      '<div class="lc-meta"><span>⏱ ' + (l.minutes || 5) + ' 分鐘</span>' + ui.levelStars(l.level) + '</div>' +
    '</a>';
  }

  function learnTabs(cur) {
    if (!(GTO.STUDY_PLAN || []).length) return '';
    return '<nav class="tabs"><a class="tab ' + (cur === 'map' ? 'on' : '') + '" href="#/learn">🗺️ 學習地圖</a>' +
      '<a class="tab ' + (cur === 'plan' ? 'on' : '') + '" href="#/learn?view=plan">📅 30 天計畫 <small>' + GTO.STUDY_PLAN.length + ' 天</small></a></nav>';
  }

  // ===========================================================================
  // 30 天學習計畫
  // ===========================================================================
  function planDone(day) { return !!((GTO.progress.plan || {})[day]); }
  function todayPlanDay() {
    const plan = (GTO.STUDY_PLAN || []).slice().sort((a, b) => a.day - b.day);
    return plan.find((d) => !planDone(d.day)) || null;
  }
  function drillLink(x) {
    const m = (GTO.QUIZ_MODES || []).find((q) => q.id === x.mode) || { icon: '🎯', title: x.mode };
    const href = x.topic ? '#/quiz/theory?topic=' + x.topic : '#/quiz/' + x.mode;
    const l = x.topic && ui.getLesson(x.topic);
    return '<a class="pd-item drill" href="' + href + '"><span>' + m.icon + '</span>' + esc(m.title) + (l ? '：' + esc(l.title) : '') + ' <em>× ' + x.count + ' 題</em></a>';
  }
  function renderStudyPlan(root) {
    const plan = (GTO.STUDY_PLAN || []).slice().sort((a, b) => a.day - b.day);
    const weeks = GTO.STUDY_PLAN_WEEKS || [];
    const doneN = plan.filter((d) => planDone(d.day)).length;
    const today = todayPlanDay();
    root.innerHTML =
      ui.pageHead({ icon: '🎓', title: '學習地圖', sub: '不知道從哪開始？照著 30 天計畫，每天 20–40 分鐘：讀課、做練習、打勾，一個月就能從零走到 GTO 入門。' }) +
      learnTabs('plan') +
      '<div class="continue-card plan-card">' +
        '<div class="cc-ring">' + ui.progressRing(Math.round(doneN / Math.max(1, plan.length) * 100), 76, doneN + '/' + plan.length) + '</div>' +
        (today
          ? '<div class="cc-txt"><small>今天的進度 · Day ' + today.day + ' · 約 ' + today.minutes + ' 分鐘</small><h3>' + esc(today.title) + '</h3><p>🎯 ' + esc(today.goal) + '</p></div>' +
            '<a class="btn primary lg" href="#" data-jump-day="' + today.day + '">▶ 前往 Day ' + today.day + '</a>'
          : '<div class="cc-txt"><h3>🎉 30 天計畫全部完成！</h3><p>接下來用練習中心維持手感，並用範圍表與覆盤課程持續進步。</p></div><a class="btn primary lg" href="#/quiz">前往練習</a>') +
      '</div>' +
      weeks.map((w) => {
        const ds = plan.filter((d) => d.week === w.week);
        if (!ds.length) return '';
        const wd = ds.filter((d) => planDone(d.day)).length;
        return '<section class="plan-week"><div class="pw-head"><span class="pw-no">W' + w.week + '</span><div><h2>' + esc(w.title) + '</h2><p>' + esc(w.desc || '') + '</p></div><span class="chip ' + (wd === ds.length ? 'ok' : '') + '">' + wd + ' / ' + ds.length + ' 天</span></div>' +
          '<div class="plan-days">' + ds.map((d) => {
            const done = planDone(d.day);
            const isToday = today && today.day === d.day;
            return '<div class="plan-day ' + (done ? 'done' : '') + (isToday ? ' today' : '') + '" id="day-' + d.day + '">' +
              '<div class="pd-head"><span class="pd-no">' + (done ? '✓' : d.day) + '</span><div class="pd-title"><b>Day ' + d.day + '｜' + esc(d.title) + '</b><small>⏱ ' + d.minutes + ' 分鐘 · 🎯 ' + esc(d.goal) + '</small></div>' +
                '<label class="pd-check"><input type="checkbox" data-day="' + d.day + '"' + (done ? ' checked' : '') + '> 完成</label></div>' +
              '<div class="pd-items">' +
                (d.lessons || []).map((id) => { const l = ui.getLesson(id); if (!l) return ''; return '<a class="pd-item lesson ' + (ui.isDone(id) ? 'ok' : '') + '" href="#/learn/' + id + '"><span>' + (ui.isDone(id) ? '✅' : l.icon) + '</span>' + esc(l.title) + ' <em>' + (l.minutes || 5) + ' 分</em></a>'; }).join('') +
                (d.drills || []).map(drillLink).join('') +
              '</div>' +
              (d.tip ? '<div class="pd-tip">💡 ' + esc(d.tip) + '</div>' : '') +
            '</div>';
          }).join('') + '</div></section>';
      }).join('');
    if (!root.__planBound) {
      root.__planBound = true;
      root.addEventListener('change', (e) => {
        const cb = e.target && e.target.matches && e.target.matches('[data-day]') ? e.target : null;
        if (!cb) return;
        const p = GTO.progress;
        p.plan = p.plan || {};
        const day = cb.getAttribute('data-day');
        if (cb.checked) { p.plan[day] = Date.now(); GTO.toast('🎉 Day ' + day + ' 完成！', 'ok'); }
        else delete p.plan[day];
        GTO.saveProgress();
        const y = window.scrollY;
        renderStudyPlan(root);
        window.scrollTo({ top: y, behavior: 'instant' });
      });
    }
    const jd = root.querySelector('[data-jump-day]');
    if (jd) jd.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.getElementById('day-' + jd.getAttribute('data-jump-day'));
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('pulse'); }
    });
  }

  // ===========================================================================
  // 課程頁
  // ===========================================================================
  function renderLesson(root, id, query) {
    const l = ui.getLesson(id);
    if (!l) { renderLearnMap(root); return; }
    const st = ui.STAGE_MAP[l.stage] || ui.STAGES[0];
    const stageLessons = ui.lessonsOfStage(l.stage);
    const no = stageLessons.findIndex((x) => x.id === l.id) + 1;
    const nb = ui.neighborLessons(l.id);
    const done = ui.isDone(l.id);
    const qs = questionsForLesson(l.id);

    root.innerHTML =
      '<div class="read-progress"><i id="readBar"></i></div>' +
      '<nav class="crumbs"><a href="#/learn">🎓 學習地圖</a><span>›</span><a href="#/learn?stage=' + st.id + '" data-jump-stage="' + st.id + '">' + st.icon + ' ' + st.title + '</a><span>›</span><span>第 ' + no + ' 課</span></nav>' +
      '<div class="lesson-layout" style="' + ui.stageVars(st) + '">' +
        '<article class="lesson-article">' +
          '<header class="lesson-hero">' +
            '<div class="lh-ic">' + (l.icon || '📘') + '</div>' +
            '<div><div class="lh-meta"><span class="stage-chip">' + st.icon + ' ' + st.title + ' · 第 ' + no + ' 課</span><span>⏱ ' + (l.minutes || 5) + ' 分鐘</span>' + ui.levelStars(l.level) + '</div>' +
            '<h1>' + esc(l.title) + '</h1></div>' +
          '</header>' +
          (l.tldr ? '<div class="tldr"><span class="tldr-lbl">一句話重點</span><p>' + esc(l.tldr) + '</p></div>' : '') +
          (l.plain ? '<div class="plain-box"><span class="pb-ic">🐣</span><div><b>白話說</b><p>' + esc(l.plain) + '</p></div></div>' : '') +
          (l.keyPoints && l.keyPoints.length ? (
            '<div class="keypoints"><div class="kp-title">📌 本課你會學到</div><ul>' + l.keyPoints.map((k) => '<li>' + esc(k) + '</li>').join('') + '</ul></div>'
          ) : '') +
          '<details class="toc-inline" id="lessonTocInline" hidden><summary>📑 本課目錄</summary><ol class="toc"></ol></details>' +
          '<div class="lesson-body" id="lessonBody">' + l.html + extraWidgetsHtml(l) + '</div>' +
          (qs.length ? '<section class="lesson-quiz" id="lessonQuiz"></section>' : '') +
          (l.sources && l.sources.length ? (
            '<section class="sources"><h4>📚 參考資料與延伸閱讀</h4><ul>' + l.sources.map((s) =>
              '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + '</a><small>' + esc(hostOf(s.url)) + '</small></li>').join('') + '</ul>' +
              '<p class="muted small">本課內容參考以上公開資料整理改寫，並統一為本站 6 人桌 100bb 基準。</p></section>'
          ) : '') +
          '<div class="lesson-done-bar">' +
            '<button type="button" class="btn ' + (done ? 'ok' : 'primary') + ' lg" id="doneBtn">' + (done ? '✓ 已完成本課' : '✅ 我學會了，標記完成') + '</button>' +
            (qs.length ? '<a class="btn lg" href="#/quiz/theory?topic=' + l.id + '">🎯 刷這課的題目（' + qs.length + ' 題）</a>' : '') +
          '</div>' +
          '<nav class="lesson-nav">' +
            (nb.prev ? '<a class="ln-card prev" href="#/learn/' + nb.prev.id + '"><small>← 上一課</small><b>' + nb.prev.icon + ' ' + esc(nb.prev.title) + '</b></a>' : '<span></span>') +
            (nb.next ? '<a class="ln-card next" href="#/learn/' + nb.next.id + '" id="nextLessonLink"><small>下一課 →</small><b>' + nb.next.icon + ' ' + esc(nb.next.title) + '</b></a>' : '<a class="ln-card next" href="#/quiz"><small>全部完成 →</small><b>🎯 前往練習中心</b></a>') +
          '</nav>' +
        '</article>' +
        '<aside class="lesson-side">' +
          '<div class="side-card toc-card"><div class="side-title">本課目錄</div><ol class="toc" id="lessonToc"></ol></div>' +
          '<div class="side-card"><div class="side-title">' + st.icon + ' ' + st.title + '（' + ui.stageProgress(st.id).done + '/' + stageLessons.length + '）</div>' +
            '<ol class="stage-list">' + stageLessons.map((x) =>
              '<li class="' + (x.id === l.id ? 'cur' : '') + (ui.isDone(x.id) ? ' done' : '') + '"><a href="#/learn/' + x.id + '"><span class="sl-dot"></span>' + esc(x.title) + '</a></li>').join('') + '</ol>' +
          '</div>' +
          '<div class="side-card tip-card"><div class="side-title">💡 小提示</div><p>內文中<span class="term-demo">虛線底線</span>的字是撲克術語，滑過或點一下就能看解釋；術語旁的灰色小字（例如 按鈕<span class="en-demo">Button (BTN)</span>）是對應的英文說法。按 <kbd>/</kbd> 可搜尋全站。</p></div>' +
        '</aside>' +
      '</div>';

    const body = root.querySelector('#lessonBody');
    // 目錄
    const heads = Array.from(body.querySelectorAll('h3'));
    heads.forEach((h, i) => { h.id = 'sec-' + (i + 1); });
    const toc = root.querySelector('#lessonToc');
    toc.innerHTML = heads.map((h) => '<li><a href="#" data-sec="' + h.id + '">' + esc(h.textContent.replace(/^\s*\d+[.、]\s*/, '')) + '</a></li>').join('') ||
      '<li class="muted">（本課沒有小節）</li>';
    // 手機 / 平板（≤1080px 側欄隱藏）改在課文上方顯示可展開的目錄
    const tocInline = root.querySelector('#lessonTocInline');
    if (heads.length >= 2) {
      tocInline.hidden = false;
      tocInline.querySelector('summary').textContent = '📑 本課目錄（' + heads.length + ' 節）';
      tocInline.querySelector('.toc').innerHTML = toc.innerHTML;
    }
    const onTocClick = (e) => {
      const a = e.target && e.target.closest ? e.target.closest('.toc [data-sec]') : null;
      if (!a) return;
      e.preventDefault();
      const t = document.getElementById(a.getAttribute('data-sec'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    toc.addEventListener('click', onTocClick);
    if (tocInline && !tocInline.hidden) tocInline.addEventListener('click', onTocClick);
    const tocLinks = Array.from(toc.querySelectorAll('a'));
    if ('IntersectionObserver' in window && heads.length) {
      tocObserver = new IntersectionObserver((entries) => {
        if (document.hidden) return;
        entries.forEach((en) => {
          if (en.isIntersecting) {
            for (let i = 0; i < tocLinks.length; i++) {
              tocLinks[i].classList.toggle('on', tocLinks[i].getAttribute('data-sec') === en.target.id);
            }
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      heads.forEach((h) => tocObserver.observe(h));
    }

    // 內容 hydrate（互動元件、範圍小圖、撲克牌、術語提示）
    ui.hydrate(body, { terms: { limit: 20, minImp: 2 } });
    const kpEl = root.querySelector('.keypoints');
    if (kpEl) ui.hydrate(kpEl);

    // 小小節指定跳轉與高光定位（#/learn/<id>?sec=sec-N）
    if (query && query.sec) {
      const target = body.querySelector('#' + query.sec);
      if (target) {
        body.querySelectorAll('.sec-target-highlight').forEach((el) => el.classList.remove('sec-target-highlight'));
        target.classList.add('sec-target-highlight');
        jumpTimer = setTimeout(() => {
          if (target && document.body.contains(target)) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
        const matchingLink = toc.querySelector('a[data-sec="' + query.sec + '"]');
        if (matchingLink) {
          toc.querySelectorAll('a').forEach((a) => a.classList.remove('on'));
          matchingLink.classList.add('on');
        }
        if (tocInline && !tocInline.hidden) {
          const matchingInline = tocInline.querySelector('a[data-sec="' + query.sec + '"]');
          if (matchingInline) {
            tocInline.querySelectorAll('a').forEach((a) => a.classList.remove('on'));
            matchingInline.classList.add('on');
          }
        }
      }
    }

    // 小測驗
    if (qs.length) renderLessonQuiz(root.querySelector('#lessonQuiz'), l, qs);

    // 完成按鈕
    root.querySelector('#doneBtn').addEventListener('click', (e) => {
      const now = !ui.isDone(l.id);
      ui.markDone(l.id, now);
      if (now) GTO.toast('🎉 完成「' + l.title + '」！', 'ok');
      e.currentTarget.className = 'btn ' + (now ? 'ok' : 'primary') + ' lg';
      e.currentTarget.textContent = now ? '✓ 已完成本課' : '✅ 我學會了，標記完成';
      const cur = root.querySelector('.stage-list li.cur');
      if (cur) cur.classList.toggle('done', now);
    });
    const nextLink = root.querySelector('#nextLessonLink');
    if (nextLink) nextLink.addEventListener('click', () => { if (!ui.isDone(l.id)) ui.markDone(l.id, true); });
    const js = root.querySelector('[data-jump-stage]');
    if (js) js.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '#/learn';
      jumpTimer = setTimeout(() => { const s = document.getElementById('stage-' + st.id); if (s) s.scrollIntoView({ block: 'start' }); }, 30);
    });

    // 閱讀進度條（rAF 節流 + 快取座標 + GPU scaleX 零重排）
    const bar = root.querySelector('#readBar');
    const art = root.querySelector('.lesson-article');
    let artTop = 0, artSpan = 1, rafId = 0;
    const measureArt = () => {
      if (!art || !document.body.contains(art)) return;
      const r = art.getBoundingClientRect();
      artTop = r.top + window.scrollY;
      artSpan = Math.max(1, art.offsetHeight - window.innerHeight * 0.6);
    };
    const updateBar = () => {
      rafId = 0;
      if (document.hidden || !bar || !document.body.contains(bar)) return;
      const p = Math.max(0, Math.min(1, (window.scrollY - artTop) / artSpan));
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    const onScroll = () => {
      if (!rafId && !document.hidden) rafId = requestAnimationFrame(updateBar);
    };
    const onResize = () => { measureArt(); onScroll(); };
    measureArt();
    updateBar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    scrollCleanup = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }

  // 既有課程補上互動元件（不改動原始課文）
  const EXTRA_WIDGETS = {
    rules: ['hand-rankings', 'showdown-game'],
    positions: ['position-table'],
    'hands-combos': ['hand-tiers'],
    'poker-math': ['pot-odds-mini', 'outs-table'],
    'mdf-alpha': ['bet-size-table'],
    'value-bluff': ['bet-size-table'],
    'bet-sizing': ['bet-size-table'],
    'preflop-rfi': ['preflop-cheatsheet'],
    'board-texture': ['draw-outs-examples'],
  };
  function extraWidgetsHtml(l) {
    const list = (EXTRA_WIDGETS[l.id] || []).filter((w) => (l.html || '').indexOf('data-widget="' + w + '"') < 0);
    if (!list.length) return '';
    return '<h3>🧪 動手玩：互動工具</h3><p>把這課的觀念直接拿來操作看看：</p>' + list.map((w) => GTO.widgetHtml(w)).join('');
  }

  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

  // ---------------------------------------------------------------------------
  // 課後小測驗（3 題）
  // ---------------------------------------------------------------------------
  function renderLessonQuiz(box, lesson, pool) {
    const picked = GTO.shuffle(pool).slice(0, Math.min(3, pool.length)).map((q) => {
      const correct = q.opts[q.ans];
      const opts = GTO.shuffle(q.opts);
      return { src: q, opts, ans: opts.indexOf(correct), chosen: -1 };
    });
    const render = () => {
      const answered = picked.filter((p) => p.chosen >= 0).length;
      const right = picked.filter((p) => p.chosen === p.ans).length;
      box.innerHTML =
        '<div class="lq-head"><h3>✍️ 課後小測驗</h3><span class="chip ' + (answered === picked.length ? (right === picked.length ? 'ok' : 'warn') : 'info') + '">' +
          (answered === picked.length ? '答對 ' + right + ' / ' + picked.length : '共 ' + picked.length + ' 題') + '</span></div>' +
        picked.map((p, qi) => {
          const done = p.chosen >= 0;
          return '<div class="lq-item ' + (done ? (p.chosen === p.ans ? 'ok' : 'bad') : '') + '">' +
            '<div class="lq-q"><span class="lq-no">Q' + (qi + 1) + '</span>' + esc(p.src.q) + '</div>' +
            '<div class="lq-opts">' + p.opts.map((o, oi) => {
              let cls = 'lq-opt';
              if (done && oi === p.ans) cls += ' ans-correct';
              else if (done && oi === p.chosen) cls += ' ans-wrong';
              return '<button type="button" class="' + cls + '" data-q="' + qi + '" data-o="' + oi + '"' + (done ? ' disabled' : '') + '><span class="kbd">' + 'ABCD'[oi] + '</span>' + esc(o) + '</button>';
            }).join('') + '</div>' +
            (done ? '<div class="lq-exp"><b>' + (p.chosen === p.ans ? '✅ 正確！' : '❌ 正確答案：' + esc(p.opts[p.ans])) + '</b> ' + esc(p.src.exp) + '</div>' : '') +
          '</div>';
        }).join('') +
        (answered === picked.length ? (
          '<div class="lq-foot">' + (right >= Math.ceil(picked.length * 0.66) ? '🎉 很棒！這課已幫你標記完成。' : '再讀一次重點段落，然後重新測驗看看～') +
            ' <button type="button" class="btn sm" id="lqRetry">↺ 換一組題目</button> <a class="btn sm primary" href="#/quiz/theory?topic=' + lesson.id + '">更多題目 →</a></div>'
        ) : '');
      if (!box.__lqBound) {
        box.__lqBound = true;
        box.addEventListener('click', (e) => {
          const st = box.__lqState;
          if (!st) return;
          if (e.target && e.target.closest && e.target.closest('#lqRetry')) {
            renderLessonQuiz(box, st.lesson, st.pool);
            return;
          }
          const b = e.target && e.target.closest ? e.target.closest('.lq-opt:not([disabled])') : null;
          if (!b) return;
          const p = st.picked[Number(b.getAttribute('data-q'))];
          if (!p || p.chosen >= 0) return;
          p.chosen = Number(b.getAttribute('data-o'));
          const ok = p.chosen === p.ans;
          GTO.bump(GTO.progress.qstats, p.src.id, ok);
          GTO.recordAnswer('theory', ok, { mistake: { kind: 'mcq', mode: 'theory', badge: st.lesson.title, q: p.src.q, chosen: p.opts[p.chosen], best: p.opts[p.ans], exp: p.src.exp } });
          const all = st.picked.every((x) => x.chosen >= 0);
          if (all && st.picked.filter((x) => x.chosen === x.ans).length >= Math.ceil(st.picked.length * 0.66) && !ui.isDone(st.lesson.id)) {
            ui.markDone(st.lesson.id, true);
            const db = document.getElementById('doneBtn');
            if (db) { db.className = 'btn ok lg'; db.textContent = '✓ 已完成本課'; }
          }
          st.render();
        });
      }
    };
    box.__lqState = { picked, lesson, pool, render };
    render();
  }

  // ===========================================================================
  // 路由入口
  // ===========================================================================
  function renderLearnPage(root, sub, query) {
    teardownLearn();
    root.__planBound = false;
    if (sub) renderLesson(root, sub, query);
    else if (query && query.view === 'plan' && (GTO.STUDY_PLAN || []).length) renderStudyPlan(root);
    else {
      renderLearnMap(root);
      if (query && query.stage) {
        jumpTimer = setTimeout(() => { const s = document.getElementById('stage-' + query.stage); if (s) s.scrollIntoView({ block: 'start' }); }, 30);
      }
    }
  }

  Object.assign(GTO, { renderLearnPage, todayPlanDay, teardownLearn });
})();

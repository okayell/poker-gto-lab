/* GTO 撲克學院 — replay_ui.js
 * 雙軌教練牌局覆盤分析室（#/replay）
 * 支援牌譜篩選、逐步回放、上帝視角（揭曉 AI 性格與底牌）、雙軌教練講評、
 * 13×13 範圍透視、實戰漏洞雷達（Leak Finder）與一鍵重打（Retry Spot）。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  let activeHand = null;
  let currentStepIdx = 0;
  let playTimer = null;
  let godMode = true; // 覆盤室預設開啟上帝視角
  let currentTab = 'replay'; // replay | leaks
  let filterMode = 'all'; // all | mistake | starred | bigpot

  const HANDS_KEY = 'gto_poker_arena_hands_v1';

  function teardownReplay() {
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    window.removeEventListener('keydown', handleReplayKeydown);
  }

  function getHandsList() {
    let list = [];
    try {
      const raw = localStorage.getItem(HANDS_KEY);
      list = raw ? JSON.parse(raw) : [];
    } catch (_) {}

    // 若尚無任何手牌，產生 2 局真實示範手牌（包含失誤示範與 GTO 獲勝），讓覆盤室立即可用
    if (!list.length) {
      list = generateDemoHands();
      try {
        localStorage.setItem(HANDS_KEY, JSON.stringify(list));
      } catch (_) {}
    }
    list.forEach((h) => ensureHandAnalysis(h));
    return list;
  }

  /**
   * 自動升級與補齊既有牌局的章節對應與整手牌觀念總覽（Backfill）
   */
  function ensureHandAnalysis(hand) {
    if (!hand) return;
    if (GTO.CoachEngine && GTO.CoachEngine.analyzeHandConcepts) {
      if (!hand._concepts || !hand._concepts.length) {
        hand._concepts = GTO.CoachEngine.analyzeHandConcepts(hand);
      }
    }
    const decisions = hand.heroDecisions || [];
    decisions.forEach((dec) => {
      const an = dec.analysis;
      const needsBackfill = !an || !an.lessons || !an.lessons.length || !an.lessons[0].secTitle;
      if (needsBackfill && GTO.CoachEngine && GTO.CoachEngine.analyzeDecision) {
        const snap = dec.snap || {
          street: dec.street,
          pot: dec.pot || 1.5,
          toCall: dec.toCall || 0,
          heroStack: dec.heroStack || 100,
          effectiveStack: dec.effectiveStack || 100,
          heroCards: dec.heroCards || (hand.holeCards ? hand.holeCards[0] : []),
          heroPosition: dec.heroPosition || (hand.positions ? hand.positions[0] : 'BTN'),
          heroAction: dec.heroAction,
          heroAmount: dec.heroAmount || 0,
          board: dec.board || hand.board || [],
          villainPersona: dec.villainPersona || (hand.seatPersonas ? hand.seatPersonas[1] : 'mixed'),
          villainHands: dec.villainHands || 10,
        };
        dec.analysis = GTO.CoachEngine.analyzeDecision(snap);
      }
    });
  }

  function generateDemoHands() {
    return [
      {
        handId: 'demo-hand-01',
        handNumber: 1,
        timestamp: Date.now() - 360000,
        dealerSeat: 3,
        hasMistake: true,
        starred: true,
        startingStacks: [100.0, 52.0, 78.0, 110.0, 95.0, 100.0],
        seatNames: ['你 (Hero)', '阿哲', '信義區散步', 'Kevin_TW', '夜貓阿翔', 'Mia_88'],
        seatPersonas: ['human', 'station', 'maniac', 'nit', 'shark', 'gto'],
        holeCards: [['Ah', '9d'], ['7c', '7d'], ['Kh', '4c'], ['As', 'Qd'], ['Jc', 'Ts'], ['8h', '8d']],
        positions: { 0: 'BTN', 1: 'SB', 2: 'BB', 3: 'UTG', 4: 'HJ', 5: 'CO' },
        board: ['Ks', '7d', '2c', '4d', '9s'],
        actions: [
          { street: 'preflop', seat: 3, position: 'UTG', action: 'fold', amount: 0, name: 'Kevin_TW' },
          { street: 'preflop', seat: 4, position: 'HJ', action: 'fold', amount: 0, name: '夜貓阿翔' },
          { street: 'preflop', seat: 5, position: 'CO', action: 'call', amount: 1.0, name: 'Mia_88', tell: '' },
          { street: 'preflop', seat: 0, position: 'BTN', isHero: true, action: 'call', amount: 1.0, name: '你 (Hero)' },
          { street: 'preflop', seat: 1, position: 'SB', action: 'call', amount: 0.5, name: '阿哲' },
          { street: 'preflop', seat: 2, position: 'BB', action: 'check', amount: 0, name: '信義區散步' },
          { street: 'flop', seat: 1, position: 'SB', action: 'check', amount: 0, name: '阿哲' },
          { street: 'flop', seat: 2, position: 'BB', action: 'check', amount: 0, name: '信義區散步' },
          { street: 'flop', seat: 5, position: 'CO', action: 'check', amount: 0, name: 'Mia_88' },
          { street: 'flop', seat: 0, position: 'BTN', isHero: true, action: 'check', amount: 0, name: '你 (Hero)' },
          { street: 'turn', seat: 1, position: 'SB', action: 'bet', amount: 2.0, name: '阿哲', tell: '⚡ 秒跟' },
          { street: 'turn', seat: 2, position: 'BB', action: 'fold', amount: 0, name: '信義區散步' },
          { street: 'turn', seat: 5, position: 'CO', action: 'fold', amount: 0, name: 'Mia_88' },
          { street: 'turn', seat: 0, position: 'BTN', isHero: true, action: 'call', amount: 2.0, name: '你 (Hero)' },
          { street: 'river', seat: 1, position: 'SB', action: 'bet', amount: 4.0, name: '阿哲' },
          { street: 'river', seat: 0, position: 'BTN', isHero: true, action: 'call', amount: 4.0, name: '你 (Hero)' },
        ],
        heroDecisions: [
          {
            street: 'preflop',
            heroAction: 'call',
            heroAmount: 1.0,
            pot: 2.5,
            toCall: 1.0,
            heroPosition: 'BTN',
            heroCards: ['Ah', '9d'],
            board: [],
            snap: {
              street: 'preflop',
              heroAction: 'call',
              heroAmount: 1.0,
              pot: 2.5,
              toCall: 1.0,
              heroPosition: 'BTN',
              heroCards: ['Ah', '9d'],
              limpersCount: 1,
              villainPersona: 'station',
            },
          },
        ],
        winners: [{ seat: 1, name: '阿哲', amount: 16.0, handDesc: '暗三條（777）' }],
        netProfit: { 0: -7.0, 1: +9.0, 2: -1.0, 3: 0, 4: 0, 5: -1.0 },
      },
      {
        handId: 'demo-hand-02',
        handNumber: 2,
        timestamp: Date.now() - 180000,
        dealerSeat: 0,
        hasMistake: false,
        starred: true,
        startingStacks: [100.0, 98.0, 102.0, 100.0, 95.0, 105.0],
        seatNames: ['你 (Hero)', '阿哲', '信義區散步', 'Kevin_TW', '夜貓阿翔', 'Mia_88'],
        seatPersonas: ['human', 'station', 'maniac', 'nit', 'shark', 'gto'],
        holeCards: [['As', 'Ks'], ['Kc', 'Jd'], ['8c', '7c'], ['2s', '2h'], ['Qd', 'Ts'], ['5h', '5d']],
        positions: { 0: 'BTN', 1: 'SB', 2: 'BB', 3: 'UTG', 4: 'HJ', 5: 'CO' },
        board: ['Kd', '7s', '2c', '4h', '9s'],
        actions: [
          { street: 'preflop', seat: 3, position: 'UTG', action: 'fold', amount: 0, name: 'Kevin_TW' },
          { street: 'preflop', seat: 4, position: 'HJ', action: 'fold', amount: 0, name: '夜貓阿翔' },
          { street: 'preflop', seat: 5, position: 'CO', action: 'fold', amount: 0, name: 'Mia_88' },
          { street: 'preflop', seat: 0, position: 'BTN', isHero: true, action: 'raise', amount: 2.5, name: '你 (Hero)' },
          { street: 'preflop', seat: 1, position: 'SB', action: 'fold', amount: 0, name: '阿哲' },
          { street: 'preflop', seat: 2, position: 'BB', action: 'call', amount: 1.5, name: '信義區散步' },
          { street: 'flop', seat: 2, position: 'BB', action: 'check', amount: 0, name: '信義區散步' },
          { street: 'flop', seat: 0, position: 'BTN', isHero: true, action: 'bet', amount: 1.8, name: '你 (Hero)' },
          { street: 'flop', seat: 2, position: 'BB', action: 'call', amount: 1.8, name: '信義區散步' },
          { street: 'turn', seat: 2, position: 'BB', action: 'check', amount: 0, name: '信義區散步' },
          { street: 'turn', seat: 0, position: 'BTN', isHero: true, action: 'bet', amount: 5.5, name: '你 (Hero)' },
          { street: 'turn', seat: 2, position: 'BB', action: 'call', amount: 5.5, name: '信義區散步' },
          { street: 'river', seat: 2, position: 'BB', action: 'check', amount: 0, name: '信義區散步' },
          { street: 'river', seat: 0, position: 'BTN', isHero: true, action: 'bet', amount: 12.0, name: '你 (Hero)' },
          { street: 'river', seat: 2, position: 'BB', action: 'call', amount: 12.0, name: '信義區散步' },
        ],
        heroDecisions: [
          {
            street: 'preflop',
            heroAction: 'raise',
            heroAmount: 2.5,
            pot: 1.5,
            toCall: 0,
            heroPosition: 'BTN',
            heroCards: ['As', 'Ks'],
            board: [],
            snap: {
              street: 'preflop',
              heroAction: 'raise',
              heroAmount: 2.5,
              pot: 1.5,
              toCall: 0,
              heroPosition: 'BTN',
              heroCards: ['As', 'Ks'],
              isUnopened: true,
              preflopRaiseCount: 0,
            },
          },
          {
            street: 'flop',
            heroAction: 'bet',
            heroAmount: 1.8,
            pot: 5.5,
            toCall: 0,
            heroPosition: 'BTN',
            heroCards: ['As', 'Ks'],
            board: ['Kd', '7s', '2c'],
            snap: {
              street: 'flop',
              heroAction: 'bet',
              heroAmount: 1.8,
              pot: 5.5,
              toCall: 0,
              heroPosition: 'BTN',
              heroCards: ['As', 'Ks'],
              board: ['Kd', '7s', '2c'],
            },
          },
          {
            street: 'river',
            heroAction: 'bet',
            heroAmount: 12.0,
            pot: 20.1,
            toCall: 0,
            heroPosition: 'BTN',
            heroCards: ['As', 'Ks'],
            board: ['Kd', '7s', '2c', '4h', '9s'],
            snap: {
              street: 'river',
              heroAction: 'bet',
              heroAmount: 12.0,
              pot: 20.1,
              toCall: 0,
              heroPosition: 'BTN',
              heroCards: ['As', 'Ks'],
              board: ['Kd', '7s', '2c', '4h', '9s'],
              villainPersona: 'station',
            },
          },
        ],
        winners: [{ seat: 0, name: '你 (Hero)', amount: 44.1, handDesc: '一對 K（頂對頂踢腳 AK）' }],
        netProfit: { 0: +22.3, 1: -0.5, 2: -21.8, 3: 0, 4: 0, 5: 0 },
      },
    ];
  }

  function renderReplayPage(root, sub) {
    teardownReplay();
    const hands = getHandsList();
    activeHand = (sub && hands.find((h) => h.handId === sub)) || hands[0] || null;
    currentStepIdx = activeHand && activeHand.actions ? activeHand.actions.length : 0;

    buildReplayShell(root, hands);
    window.addEventListener('keydown', handleReplayKeydown);
  }

  function buildReplayShell(root, hands) {
    const st = (GTO.progress && GTO.progress.arenaStats) || { leaks: {} };
    const leakKeys = Object.keys(st.leaks || {});

    root.innerHTML =
      '<div class="replay-page-wrap">' +
        // 頂部導覽列
        '<div class="replay-topbar card">' +
          '<div class="rt-left">' +
            '<h2>📜 牌局覆盤分析室</h2>' +
            '<div class="rt-tabs">' +
              '<button type="button" class="btn-xs rt-tab ' + (currentTab === 'replay' ? 'active' : '') + '" id="tabReplayView">🎬 牌譜逐步回放</button>' +
              '<button type="button" class="btn-xs rt-tab ' + (currentTab === 'leaks' ? 'active' : '') + '" id="tabLeaksView">📉 實戰漏洞雷達 (' + leakKeys.length + ')</button>' +
            '</div>' +
          '</div>' +
          '<div class="rt-right">' +
            '<label class="at-chk" title="全開6人底牌與AI隱藏性格"><input type="checkbox" id="chkGodMode" ' + (godMode ? 'checked' : '') + '> 👁️ 上帝視角</label>' +
            '<button type="button" class="btn-xs" id="btnCopyPgn">📋 複製文字牌譜</button>' +
            '<button type="button" class="btn-xs" id="btnImportJson">📥 匯入牌譜</button>' +
            '<a href="#/play" class="btn-xs primary">♠️ 返回實戰桌</a>' +
          '</div>' +
        '</div>' +

        '<div class="replay-body" id="replayBody">' +
          (currentTab === 'replay' ? renderReplayWorkspace(hands) : renderLeaksWorkspace()) +
        '</div>' +
      '</div>' +
      '<div id="replayModalWrap"></div>';

    bindReplayEvents(root, hands);
  }

  function renderReplayWorkspace(hands) {
    if (!activeHand) {
      return '<div class="card empty">目前尚無儲存的牌局紀錄。<a href="#/play">前往實戰桌打一手</a></div>';
    }

    // 篩選手牌清單
    const filteredHands = hands.filter((h) => {
      if (filterMode === 'mistake') return h.hasMistake;
      if (filterMode === 'starred') return h.starred;
      if (filterMode === 'bigpot') {
        const totalP = Math.abs(h.netProfit ? h.netProfit[0] || 0 : 0);
        return totalP >= 15;
      }
      return true;
    });

    const h = activeHand;
    const heroProfit = h.netProfit ? h.netProfit[0] || 0 : 0;
    const isHeroWin = heroProfit >= 0;

    return '<div class="replay-layout">' +
      // 左側手牌清單
      '<aside class="replay-sidebar card">' +
        '<div class="rs-head">' +
          '<b>手牌清單 (' + filteredHands.length + '/' + hands.length + ')</b>' +
          '<select class="inp sm-inp" id="replayFilterSel">' +
            '<option value="all" ' + (filterMode === 'all' ? 'selected' : '') + '>全部手牌</option>' +
            '<option value="mistake" ' + (filterMode === 'mistake' ? 'selected' : '') + '>⚠️ 待檢討/有失誤</option>' +
            '<option value="starred" ' + (filterMode === 'starred' ? 'selected' : '') + '>⭐ 已收藏手牌</option>' +
            '<option value="bigpot" ' + (filterMode === 'bigpot' ? 'selected' : '') + '>🏆 大底池 (≥15bb)</option>' +
          '</select>' +
        '</div>' +
        '<div class="rs-list">' +
          filteredHands.map((item) => {
            const isCur = item.handId === h.handId;
            const p = item.netProfit ? item.netProfit[0] || 0 : 0;
            const heroCards = item.holeCards && item.holeCards[0] ? item.holeCards[0] : [];
            const pos = item.positions ? item.positions[0] || 'BTN' : 'BTN';
            return '<div class="rs-item ' + (isCur ? 'active' : '') + '" data-hid="' + item.handId + '">' +
              '<div class="rsi-top">' +
                '<span><b>#' + item.handNumber + '</b> (' + pos + ')</span>' +
                '<span class="' + (p >= 0 ? 'plus' : 'minus') + '">' + (p >= 0 ? '+' : '') + p + 'bb</span>' +
              '</div>' +
              '<div class="rsi-bot">' +
                '<span class="rsi-cards">' + GTO.cardsHtml(heroCards, 'mini') + '</span>' +
                '<span class="rsi-tags">' +
                  (item.hasMistake ? '<i class="tag-err" title="教練發現可優化點">⚠️ 待檢討</i>' : '<i class="tag-ok">✅ 標準</i>') +
                  (item.starred ? ' ⭐' : '') +
                '</span>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</aside>' +

      // 右側回放與雙軌教練分析
      '<main class="replay-main">' +
        // 牌桌步數檢視
        '<div class="card replay-viewer-card">' +
          '<div class="rv-head">' +
            '<div class="rv-title">' +
              '<h3>第 #' + h.handNumber + ' 手覆盤</h3>' +
              '<span class="rv-profit ' + (isHeroWin ? 'plus' : 'minus') + '">你的損益：' + (isHeroWin ? '+' : '') + heroProfit + 'bb</span>' +
            '</div>' +
            '<div class="rv-actions">' +
              '<button type="button" class="btn-xs ' + (h.starred ? 'primary' : '') + '" id="btnReplayStar">' + (h.starred ? '⭐ 已收藏' : '☆ 收藏') + '</button>' +
            '</div>' +
          '</div>' +

          // 街程快速跳轉按鈕
          '<div class="rv-streets-nav" id="rvStreetsNav">' +
            '<button type="button" class="btn-xs snav-btn" data-street="preflop">翻牌前</button>' +
            '<button type="button" class="btn-xs snav-btn" data-street="flop">翻牌</button>' +
            '<button type="button" class="btn-xs snav-btn" data-street="turn">轉牌</button>' +
            '<button type="button" class="btn-xs snav-btn" data-street="river">河牌</button>' +
            '<button type="button" class="btn-xs snav-btn" data-street="end">攤牌結算</button>' +
          '</div>' +

          // 模擬迷你牌桌畫面
          '<div class="replay-table-wrap" id="replayTableWrap"></div>' +

          // 播放步數控制列
          '<div class="replay-controls">' +
            '<div class="rc-btns">' +
              '<button type="button" class="btn-xs" id="rcFirst" title="回到最初步">⏮</button>' +
              '<button type="button" class="btn-xs" id="rcPrev" title="上一步 (←)">◀ 上一步</button>' +
              '<button type="button" class="btn-xs primary" id="rcPlay">▶ 自動播放</button>' +
              '<button type="button" class="btn-xs" id="rcNext" title="下一步 (→)">下一步 ▶</button>' +
              '<button type="button" class="btn-xs" id="rcLast" title="跳至攤牌">⏭</button>' +
            '</div>' +
            '<div class="rc-scrubber-row">' +
              '<input type="range" class="rc-slider" id="rcSlider" min="0" max="' + (h.actions.length) + '" value="' + currentStepIdx + '">' +
              '<span class="rc-step-lbl" id="rcStepLbl">' + currentStepIdx + ' / ' + h.actions.length + ' 步</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 雙軌教練解析與決策時間軸
        '<div class="card replay-coach-card" id="replayCoachBox"></div>' +
      '</main>' +
    '</div>';
  }

  function renderLeaksWorkspace() {
    const st = (GTO.progress && GTO.progress.arenaStats) || { leaks: {} };
    const leakList = Object.values(st.leaks || {}).sort((a, b) => b.evLossBb - a.evLossBb);

    return '<div class="card leaks-dashboard">' +
      '<div class="ld-head">' +
        '<h3>📉 個人實戰漏洞雷達（Leak Finder）</h3>' +
        '<p class="muted">教練從你在 6 人實戰桌的決策歷程中，自動歸納出最常失誤、損耗籌碼最多的觀念 TOP 清單：</p>' +
      '</div>' +
      (!leakList.length ?
        '<div class="empty">目前尚未偵測到常態失誤，打得非常扎實！請繼續保持。</div>' :
        '<div class="leaks-grid">' +
          leakList.map((item, idx) => {
            const def = GTO.CoachEngine.LEAK_DEFINITIONS[item.code] || {};
            const theoryList = GTO.THEORY || [];
            const lessonCards = (item.lessons || []).map((lid) => {
              const f = theoryList.find((l) => l.id === lid);
              if (!f) return '';
              return '<a href="#/learn/' + f.id + '" class="leak-lesson-pill">📖 <b>' + GTO.esc(f.title) + '</b>（' + f.minutes + '分）</a>';
            }).join('');

            return '<div class="leak-card">' +
              '<div class="lc-top">' +
                '<span class="lc-rank">TOP ' + (idx + 1) + '</span>' +
                '<h4>' + GTO.esc(def.title || item.title || item.code) + '</h4>' +
                '<span class="lc-loss">累計損耗 <strong>-' + item.evLossBb + 'bb</strong></span>' +
              '</div>' +
              '<p class="lc-desc">' + GTO.esc(def.desc || '') + '</p>' +
              '<div class="lc-meta">發生次數：' + item.count + ' 次 · 專屬補課教材：</div>' +
              '<div class="lc-lessons">' + lessonCards + '</div>' +
            '</div>';
          }).join('') +
        '</div>'
      ) +
    '</div>';
  }

  function bindReplayEvents(root, hands) {
    const tabReplay = root.querySelector('#tabReplayView');
    const tabLeaks = root.querySelector('#tabLeaksView');
    const chkGod = root.querySelector('#chkGodMode');
    const btnCopy = root.querySelector('#btnCopyPgn');
    const btnImport = root.querySelector('#btnImportJson');
    const selFilter = root.querySelector('#replayFilterSel');
    const btnStar = root.querySelector('#btnReplayStar');

    if (tabReplay) tabReplay.addEventListener('click', () => { currentTab = 'replay'; buildReplayShell(root, hands); });
    if (tabLeaks) tabLeaks.addEventListener('click', () => { currentTab = 'leaks'; buildReplayShell(root, hands); });

    if (chkGod) chkGod.addEventListener('change', () => {
      godMode = chkGod.checked;
      refreshReplayDisplay();
    });

    if (selFilter) selFilter.addEventListener('change', () => {
      filterMode = selFilter.value;
      buildReplayShell(root, hands);
    });

    if (btnStar && activeHand) {
      btnStar.addEventListener('click', () => {
        activeHand.starred = !activeHand.starred;
        const allHands = getHandsList();
        const found = allHands.find((h) => h.handId === activeHand.handId);
        if (found) found.starred = activeHand.starred;
        try { localStorage.setItem(HANDS_KEY, JSON.stringify(allHands)); } catch (_) {}
        btnStar.textContent = activeHand.starred ? '⭐ 已收藏' : '☆ 收藏';
        btnStar.classList.toggle('primary', activeHand.starred);
      });
    }

    if (btnCopy && activeHand) {
      btnCopy.addEventListener('click', () => copyHandNotation(activeHand));
    }

    if (btnImport) {
      btnImport.addEventListener('click', openImportModal);
    }

    // 左側點選手牌切換
    root.querySelectorAll('.rs-item').forEach((item) => {
      item.addEventListener('click', () => {
        const hid = item.getAttribute('data-hid');
        activeHand = hands.find((h) => h.handId === hid) || activeHand;
        currentStepIdx = activeHand.actions ? activeHand.actions.length : 0;
        buildReplayShell(root, hands);
      });
    });

    // 步進控制
    const rcFirst = root.querySelector('#rcFirst');
    const rcPrev = root.querySelector('#rcPrev');
    const rcNext = root.querySelector('#rcNext');
    const rcLast = root.querySelector('#rcLast');
    const rcPlay = root.querySelector('#rcPlay');
    const rcSlider = root.querySelector('#rcSlider');

    if (rcFirst) rcFirst.addEventListener('click', () => jumpToStep(0));
    if (rcPrev) rcPrev.addEventListener('click', () => jumpToStep(currentStepIdx - 1));
    if (rcNext) rcNext.addEventListener('click', () => jumpToStep(currentStepIdx + 1));
    if (rcLast) rcLast.addEventListener('click', () => jumpToStep(activeHand.actions.length));

    if (rcPlay) {
      rcPlay.addEventListener('click', () => {
        if (playTimer) {
          clearInterval(playTimer);
          playTimer = null;
          rcPlay.textContent = '▶ 自動播放';
        } else {
          rcPlay.textContent = '⏸ 暫停播放';
          playTimer = setInterval(() => {
            if (currentStepIdx >= activeHand.actions.length) {
              clearInterval(playTimer);
              playTimer = null;
              rcPlay.textContent = '▶ 自動播放';
            } else {
              jumpToStep(currentStepIdx + 1);
            }
          }, 1200);
        }
      });
    }

    if (rcSlider) {
      rcSlider.addEventListener('input', () => {
        jumpToStep(parseInt(rcSlider.value, 10));
      });
    }

    // 街程導覽按鈕
    root.querySelectorAll('.snav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const st = btn.getAttribute('data-street');
        jumpToStreet(st);
      });
    });

    refreshReplayDisplay();
  }

  function handleReplayKeydown(e) {
    if (currentTab !== 'replay' || !activeHand) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      jumpToStep(currentStepIdx - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      jumpToStep(currentStepIdx + 1);
    }
  }

  function jumpToStep(idx) {
    if (!activeHand || !activeHand.actions) return;
    currentStepIdx = Math.max(0, Math.min(activeHand.actions.length, idx));
    refreshReplayDisplay();
  }

  function jumpToStreet(streetKey) {
    if (!activeHand || !activeHand.actions) return;
    const actions = activeHand.actions;
    if (streetKey === 'preflop') {
      jumpToStep(0);
    } else if (streetKey === 'end') {
      jumpToStep(actions.length);
    } else {
      const idx = actions.findIndex((a) => a.street === streetKey);
      jumpToStep(idx >= 0 ? idx : actions.length);
    }
  }

  function refreshReplayDisplay() {
    if (!activeHand) return;
    const rcSlider = document.getElementById('rcSlider');
    const rcStepLbl = document.getElementById('rcStepLbl');
    if (rcSlider) rcSlider.value = currentStepIdx;
    if (rcStepLbl) rcStepLbl.textContent = currentStepIdx + ' / ' + activeHand.actions.length + ' 步';

    renderReplayTable();
    renderCoachAnalysisBox();
  }

  function computeReplayStepState(h, step) {
    const roundBb = (x) => Math.round(x * 10) / 10;
    const startStacks = h.startingStacks ? h.startingStacks.slice() : [100, 100, 100, 100, 100, 100];
    const stacks = startStacks.slice();
    const currentBets = [0, 0, 0, 0, 0, 0];
    const folded = [false, false, false, false, false, false];
    const lastActions = ['', '', '', '', '', '', ''];
    let currentPot = 0.0;
    let street = 'preflop';

    // Blinds
    const posMap = h.positions || {};
    const activePositions = Object.keys(posMap).map(Number);
    let sbSeat = activePositions.find((id) => posMap[id] === 'SB');
    let bbSeat = activePositions.find((id) => posMap[id] === 'BB');
    if (sbSeat === undefined) sbSeat = activePositions[0] !== undefined ? activePositions[0] : 1;
    if (bbSeat === undefined) bbSeat = activePositions[1] !== undefined ? activePositions[1] : 2;

    const sbPost = Math.min(stacks[sbSeat] || 0.5, 0.5);
    stacks[sbSeat] = roundBb((stacks[sbSeat] || 0.5) - sbPost);
    currentBets[sbSeat] = sbPost;
    currentPot = roundBb(currentPot + sbPost);

    const bbPost = Math.min(stacks[bbSeat] || 1.0, 1.0);
    stacks[bbSeat] = roundBb((stacks[bbSeat] || 1.0) - bbPost);
    currentBets[bbSeat] = bbPost;
    currentPot = roundBb(currentPot + bbPost);

    const actions = (h.actions || []).slice(0, step);
    const lastAction = actions[actions.length - 1] || null;

    for (let i = 0; i < actions.length; i++) {
      const a = actions[i];
      if (a.street !== street) {
        street = a.street;
        for (let s = 0; s < 6; s++) currentBets[s] = 0.0;
      }
      const sId = a.seat;
      if (a.action === 'fold') {
        folded[sId] = true;
        lastActions[sId] = '棄牌';
      } else if (a.action === 'check') {
        lastActions[sId] = '過牌';
      } else if (a.action === 'call') {
        const pay = a.amount;
        stacks[sId] = roundBb(stacks[sId] - pay);
        currentBets[sId] = roundBb(currentBets[sId] + pay);
        currentPot = roundBb(currentPot + pay);
        lastActions[sId] = (street === 'preflop' && currentBets[sId] === 1.0) ? '平跟 1bb' : '跟注 ' + pay + 'bb';
      } else if (a.action === 'bet' || a.action === 'raise') {
        const to = a.amount;
        const pay = roundBb(to - currentBets[sId]);
        stacks[sId] = roundBb(stacks[sId] - pay);
        currentBets[sId] = to;
        currentPot = roundBb(currentPot + pay);
        lastActions[sId] = (a.action === 'bet' ? '下注 ' : '加注至 ') + to + 'bb';
      }
    }

    let boardCount = 0;
    if (street === 'flop') boardCount = 3;
    else if (street === 'turn') boardCount = 4;
    else if (street === 'river' || street === 'showdown') boardCount = 5;
    if (step === (h.actions || []).length && (h.board || []).length > boardCount) {
      boardCount = (h.board || []).length;
    }
    const board = (h.board || []).slice(0, boardCount);

    return {
      stacks,
      currentBets,
      folded,
      lastActions,
      currentPot,
      street,
      board,
      lastAction,
    };
  }

  function replayActionTone(txt) {
    if (!txt) return 'act-blind';
    const s = String(txt);
    if (s.includes('全下') || /all-?in/i.test(s)) return 'act-allin';
    if (s.includes('加注') || /raise/i.test(s)) return 'act-raise';
    if (s.includes('下注') || /\bbet\b/i.test(s)) return 'act-bet';
    if (s.includes('跟注') || s.includes('平跟') || /call/i.test(s)) return 'act-call';
    if (s.includes('過牌') || /check/i.test(s)) return 'act-check';
    if (s.includes('棄牌') || /fold/i.test(s)) return 'act-fold';
    return 'act-blind';
  }

  function renderReplayTable() {
    const wrap = document.getElementById('replayTableWrap');
    if (!wrap || !activeHand) return;

    const h = activeHand;
    const step = currentStepIdx;
    const st = computeReplayStepState(h, step);
    const lastAction = st.lastAction;
    const notes = GTO.AIPersonas.loadPlayerNotes();

    const boardSlots = [];
    for (let i = 0; i < 5; i++) {
      if (i < st.board.length) {
        boardSlots.push(GTO.cardsHtml([st.board[i]], 'md'));
      } else {
        boardSlots.push('<span class="board-slot-empty" aria-hidden="true"></span>');
      }
    }

    const streetMap = { preflop: 'PREFLOP · 翻牌前', flop: 'FLOP · 翻牌圈', turn: 'TURN · 轉牌圈', river: 'RIVER · 河牌圈', showdown: 'SHOWDOWN · 攤牌' };

    wrap.innerHTML =
      '<div class="arena-table-container replay-table-stage">' +
        '<div class="arena-table replay-mini-table">' +
          '<div class="arena-rail">' +
            '<div class="arena-felt">' +
              '<div class="felt-inner-ring"></div>' +
              '<div class="arena-center">' +
                '<div class="arena-pot"><span class="pot-chip-stack" aria-hidden="true"></span><span class="pot-lbl">POT</span><strong class="pot-val">' + st.currentPot + ' BB</strong></div>' +
                '<div class="arena-board">' + boardSlots.join('') + '</div>' +
                '<div class="arena-street-lbl">' + (streetMap[st.street] || st.street.toUpperCase()) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="arena-seats">' +
            (h.seatNames || []).map((name, idx) => {
              const isHero = idx === 0;
              const pos = h.positions ? h.positions[idx] || '' : '';
              const isD = h.dealerSeat === idx;
              const cards = h.holeCards ? h.holeCards[idx] || [] : [];
              const personaKey = h.seatPersonas ? h.seatPersonas[idx] || '' : '';
              const persona = GTO.AIPersonas.AI_PERSONAS[personaKey] || {};
              const isActing = lastAction && lastAction.seat === idx;
              const isFolded = st.folded[idx];
              const stack = st.stacks[idx] != null ? st.stacks[idx] : 100;
              const curBet = st.currentBets[idx] || 0;
              const lastAct = isActing ? (lastAction.action === 'fold' ? '棄牌' : lastAction.action === 'check' ? '過牌' : (lastAction.action === 'bet' ? '下注 ' : lastAction.action === 'raise' ? '加注至 ' : '跟注 ') + lastAction.amount + 'bb') : st.lastActions[idx];
              const tell = isActing && lastAction ? lastAction.tell : '';

              const customNote = notes[name] || {};
              let matchHtml = '';
              if (godMode && customNote && customNote.tag) {
                const isMatch = customNote.tag === personaKey;
                matchHtml = '<span class="asb-match-pill ' + (isMatch ? 'match' : 'miss') + '">' + (isMatch ? '🎯 識人命中' : '❌ 看走眼') + '</span>';
              }

              let cardsHtml = '';
              if (cards.length === 2 && !isFolded) {
                if (isHero || godMode || step === (h.actions || []).length) {
                  cardsHtml = GTO.cardsHtml(cards, 'hole');
                } else {
                  cardsHtml = '<span class="pcards">' + GTO.cardBackHtml('hole') + GTO.cardBackHtml('hole') + '</span>';
                }
              }

              const cls = [
                'arena-seat',
                'seat-' + idx,
                isHero ? 'hero-seat is-hero' : 'ai-seat',
                isActing ? 'active-turn is-active' : '',
                isFolded ? 'folded is-folded' : '',
              ].filter(Boolean).join(' ');

              const actTone = replayActionTone(lastAct);

              return '<div class="' + cls + '">' +
                (cardsHtml ? '<div class="arena-seat-cards">' + cardsHtml + '</div>' : '') +
                '<div class="arena-seat-badge">' +
                  '<div class="asb-top">' +
                    (pos ? '<span class="asb-pos' + (isHero ? ' hero-pos' : '') + '">' + pos + '</span>' : '') +
                    '<span class="asb-name">' + GTO.esc(name) + '</span>' +
                  '</div>' +
                  (godMode && persona.name ? '<div class="asb-persona-badge" title="真實性格：' + GTO.esc(persona.name) + '">' + persona.tagIcon + ' ' + GTO.esc(persona.name) + matchHtml + '</div>' : '') +
                  '<div class="asb-stack"><strong>' + stack + '</strong> BB</div>' +
                '</div>' +
                (lastAct ? '<div class="arena-action-bubble ' + actTone + '">' + (tell ? '<span class="tell">' + tell + '</span> ' : '') + GTO.esc(lastAct) + '</div>' : '') +
                (isD ? '<div class="arena-dealer-btn" title="莊家按鈕 (BTN)">D</div>' : '') +
                (curBet > 0 ? '<div class="arena-bet-chip">' + curBet + ' BB</div>' : '') +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderCoachAnalysisBox() {
    const box = document.getElementById('replayCoachBox');
    if (!box || !activeHand) return;
    ensureHandAnalysis(activeHand);

    const concepts = activeHand._concepts || [];
    const conceptsHtml =
      '<div class="hand-concepts-card card">' +
        '<div class="hco-head">' +
          '<h4>🗺️ 本手牌涵蓋觀念 ＆ 課程章節總覽</h4>' +
          '<span class="muted small">本手牌涉及之翻前／翻後／數學／剝削實戰重點，點擊直達課內指定小節</span>' +
        '</div>' +
        '<div class="hco-grid">' +
          (concepts.length ? concepts.map((c) => {
            const ch = c.chapter || {};
            return '<div class="concept-item">' +
              '<div class="ci-top">' +
                '<span class="concept-badge">' + GTO.esc(c.badge) + '</span>' +
                '<span class="concept-spot">' + GTO.esc(c.spotText) + '</span>' +
              '</div>' +
              '<div class="ci-chapter">' +
                '<div class="clc-tier-badge">' +
                  '<span class="clc-badge-pill stage">STAGE ' + (ch.stageNo !== undefined ? ch.stageNo : '') + ' · ' + (ch.stageIcon || '📘') + ' ' + (ch.stageTitle || '課程') + '</span>' +
                  '<span class="clc-badge-sep">›</span>' +
                  '<span class="clc-badge-pill lesson">第 ' + (ch.lessonNo || 1) + ' 課 · ' + GTO.esc(ch.title || '') + '</span>' +
                  '<span class="clc-badge-sep">›</span>' +
                  '<span class="clc-badge-pill sec">📑 §' + (ch.secNo || 1) + ' ' + GTO.esc(ch.secTitle || '') + '</span>' +
                '</div>' +
                '<div class="ci-actions">' +
                  '<a class="btn-xs primary" href="' + (ch.href || '#/learn/' + ch.id) + '">📖 直達此章節 →</a>' +
                  (ch.quizHref ? '<a class="btn-xs" href="' + ch.quizHref + '">🎯 課後題</a>' : '') +
                '</div>' +
              '</div>' +
            '</div>';
          }).join('') : '<div class="empty">本手牌觀念分析中...</div>') +
        '</div>' +
      '</div>';

    const decisions = activeHand.heroDecisions || [];
    let timelineHtml = '';

    if (!decisions.length) {
      timelineHtml = '<div class="card empty"><p>本手牌無 Hero 主動決策點（例如 Hero 翻前棄牌觀戰）。你可藉由上方觀念總覽檢視本手牌的戰術與理論要點！</p></div>';
    } else {
      timelineHtml =
        '<div class="coach-decisions-timeline card">' +
          '<h4>🧠 雙軌教練逐步決策解析（Hero 決策時間軸）</h4>' +
          '<div class="cd-chips">' +
            decisions.map((d, i) => {
              const an = d.analysis || {};
              const gradeCls = an.grade === 'best' || an.grade === 'good' ? 'green' : 'red';
              return '<button type="button" class="btn-xs cd-chip ' + gradeCls + '" data-dec-idx="' + i + '">' +
                '決策 ' + (i + 1) + ' (' + d.street + ') · ' + (an.gradeLabel || '標準') +
              '</button>';
            }).join('') +
          '</div>' +
          '<div class="cd-card-body" id="cdCardBody"></div>' +
        '</div>';
    }

    box.innerHTML = conceptsHtml + timelineHtml;

    if (decisions.length) {
      box.querySelectorAll('.cd-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          box.querySelectorAll('.cd-chip').forEach((x) => x.classList.remove('active'));
          chip.classList.add('active');
          const idx = parseInt(chip.getAttribute('data-dec-idx'), 10);
          renderDecisionCard(decisions[idx], idx);
        });
      });

      // 預設展開第 1 個決策（若有失誤則優先展開第 1 個失誤）
      const firstMistakeIdx = decisions.findIndex((d) => d.analysis && (d.analysis.grade === 'mistake' || d.analysis.grade === 'blunder'));
      const pickIdx = firstMistakeIdx >= 0 ? firstMistakeIdx : 0;
      const chips = box.querySelectorAll('.cd-chip');
      if (chips[pickIdx]) chips[pickIdx].click();
    }
  }

  function renderDecisionCard(dec, decIdx) {
    const body = document.getElementById('cdCardBody');
    if (!body || !dec) return;
    const an = dec.analysis || {};

    const isMistake = an.grade === 'mistake' || an.grade === 'blunder' || an.grade === 'inaccuracy';
    const lessonsSectionTitle = isMistake
      ? '🔧 失誤對應補強章節（看懂這一步為什麼錯、該怎麼改）'
      : '✨ 本步運用到的課程觀念與章節（點擊直達課內對應小節）';

    const lessonCardsHtml = (an.lessons || []).map((l) =>
      '<div class="coach-lesson-card">' +
        '<div class="clc-top">' +
          '<div class="clc-tier-badge">' +
            '<span class="clc-badge-pill stage">STAGE ' + (l.stageNo !== undefined ? l.stageNo : '') + ' · ' + (l.stageIcon || '📘') + ' ' + (l.stageTitle || '課程') + '</span>' +
            '<span class="clc-badge-sep">›</span>' +
            '<span class="clc-badge-pill lesson">第 ' + (l.lessonNo || 1) + ' 課 · ' + GTO.esc(l.title) + '</span>' +
            '<span class="clc-badge-sep">›</span>' +
            '<span class="clc-badge-pill sec">📑 §' + (l.secNo || 1) + ' ' + GTO.esc(l.secTitle || '重要小節') + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="clc-why-note">' + GTO.esc(l.whyHere || l.tldr || '') + '</p>' +
        '<div class="clc-foot-actions">' +
          '<a href="' + (l.href || ('#/learn/' + l.id)) + '" class="btn-xs primary clc-btn">📖 直達此章節 →</a>' +
          (l.quizHref ? '<a href="' + l.quizHref + '" class="btn-xs clc-btn">🎯 課後題</a>' : '') +
        '</div>' +
      '</div>'
    ).join('');

    body.innerHTML =
      '<div class="decision-detail card">' +
        // 評級抬頭
        '<div class="dd-head">' +
          '<div class="dd-grade-pill ' + (an.grade === 'best' || an.grade === 'good' ? 'good' : 'bad') + '">' +
            an.gradeLabel + (an.evLossBb > 0 ? ' (損失約 -' + an.evLossBb + 'bb EV)' : '') +
          '</div>' +
          '<div class="dd-actions">' +
            '<a href="#/play?retry=' + activeHand.handId + ':' + decIdx + '" class="btn-xs primary">🔄 從此點重打一次 (Retry Spot)</a>' +
          '</div>' +
        '</div>' +

        // 你的行動 vs 建議行動
        '<div class="dd-compare-row">' +
          '<div class="dd-comp-box">' +
            '<span class="lbl">你的動作</span>' +
            '<strong>' + GTO.esc(an.heroAction) + ' ' + (an.heroAmount ? an.heroAmount + 'bb' : '') + '</strong>' +
          '</div>' +
          '<div class="dd-comp-box rec">' +
            '<span class="lbl">建議動作</span>' +
            '<strong>' + GTO.esc(an.recommendedAction) + ' ' + (an.recommendedAmount ? an.recommendedAmount + 'bb' : '') + '</strong>' +
          '</div>' +
        '</div>' +

        // 雙軌建議對照（GTO 基準 vs 實戰剝削）
        '<div class="dd-dual-track">' +
          '<div class="track-card gto">' +
            '<h4>♟️ 標準 GTO 基準解</h4>' +
            '<div class="tc-action"><b>建議：' + GTO.esc(an.gtoAdvice ? an.gtoAdvice.action : '') + '</b></div>' +
            '<p>' + GTO.esc(an.gtoAdvice ? an.gtoAdvice.reason : '') + '</p>' +
          '</div>' +
          '<div class="track-card exploit">' +
            '<h4>🎯 針對對手實戰剝削解</h4>' +
            '<div class="tc-action"><b>建議：' + GTO.esc(an.exploitAdvice ? an.exploitAdvice.action : '') + '</b></div>' +
            '<p>' + GTO.esc(an.exploitAdvice ? an.exploitAdvice.reason : '') + '</p>' +
          '</div>' +
        '</div>' +

        // 數學透視指標
        '<div class="dd-math-tiles">' +
          '<div class="mt-tile"><span>估算勝率 (Equity)</span><b>' + (an.equityPct != null ? an.equityPct : '--') + '%</b></div>' +
          '<div class="mt-tile"><span>底池賠率 (Pot Odds)</span><b>' + an.potOddsPct + '%</b></div>' +
          '<div class="mt-tile"><span>防守頻率 (MDF)</span><b>' + an.mdfPct + '%</b></div>' +
          '<div class="mt-tile"><span>籌碼底池比 (SPR)</span><b>' + an.spr + '</b></div>' +
          '<div class="mt-tile"><span>補牌數 (Outs)</span><b>' + an.outs + ' 張</b></div>' +
        '</div>' +

        // 13x13 翻前範圍表透視（若適用）
        (an.matchedScenarioId && GTO.SCENARIOS && GTO.SCENARIOS[an.matchedScenarioId] ?
          '<div class="dd-range-peek" id="ddRangePeek">' +
            '<h5>📊 翻前 13×13 GTO 範圍透視：' + GTO.esc(GTO.SCENARIOS[an.matchedScenarioId].title) + '</h5>' +
            '<div class="embed-grid-Slot" id="ddRangeSlot"></div>' +
          '</div>' : '') +

        // 推薦關聯教材
        (lessonCardsHtml ?
          '<div class="dd-lessons-section">' +
            '<h5>' + lessonsSectionTitle + '</h5>' +
            '<div class="coach-lessons-list">' + lessonCardsHtml + '</div>' +
          '</div>' : '') +
      '</div>';

    // 若有範圍表，動態繪製迷你網格並高亮 Hero 手牌
    if (an.matchedScenarioId && GTO.SCENARIOS && GTO.SCENARIOS[an.matchedScenarioId] && GTO.renderGrid) {
      const slot = body.querySelector('#ddRangeSlot');
      if (slot) {
        const sc = GTO.SCENARIOS[an.matchedScenarioId];
        const heroHandKey = (dec.heroCards && GTO.AIPersonas && GTO.AIPersonas.cardsToHandKey)
      ? GTO.AIPersonas.cardsToHandKey(dec.heroCards)
      : (dec.heroCards && dec.heroCards.length === 2 ? dec.heroCards[0][0] + dec.heroCards[1][0] : '');
        GTO.renderGrid(slot, sc, { compact: true, simple: false, selectedHand: heroHandKey });
      }
    }
  }

  /** 一鍵複製文字記譜 */
  function copyHandNotation(hand) {
    if (!hand) return;
    ensureHandAnalysis(hand);
    const lines = [];
    lines.push('=== GTO 撲克學院 · 第 #' + hand.handNumber + ' 手覆盤牌譜 ===');
    lines.push('時間：' + new Date(hand.timestamp).toLocaleString());
    lines.push('莊家：' + (hand.seatNames ? hand.seatNames[hand.dealerSeat] : '') + ' (Seat ' + hand.dealerSeat + ')');
    lines.push('Hero 底牌：' + (hand.holeCards && hand.holeCards[0] ? hand.holeCards[0].join(' ') : ''));
    lines.push('公共牌：' + (hand.board ? hand.board.join(' ') : '無'));
    lines.push('');
    lines.push('--- 行動歷程 ---');
    (hand.actions || []).forEach((a) => {
      lines.push('[' + a.street + '] ' + a.name + ' (' + a.position + '): ' + a.action + (a.amount ? ' ' + a.amount + 'bb' : ''));
    });
    lines.push('');
    lines.push('獲勝：' + (hand.winners ? hand.winners.map((w) => w.name + ' (+' + w.amount + 'bb)').join('、') : ''));

    if (hand.heroDecisions && hand.heroDecisions.length > 0) {
      lines.push('');
      lines.push('--- 雙軌教練覆盤摘要 ---');
      hand.heroDecisions.forEach((d, idx) => {
        const an = d.analysis || {};
        lines.push('【決策 ' + (idx + 1) + ' · ' + d.street + '】評級：' + (an.gradeLabel || '標準') + (an.evLossBb > 0 ? ' (損失約 -' + an.evLossBb + 'bb EV)' : ''));
        lines.push('  你的動作：' + an.heroAction + (an.heroAmount ? ' ' + an.heroAmount + 'bb' : ''));
        lines.push('  建議動作：' + an.recommendedAction + (an.recommendedAmount ? ' ' + an.recommendedAmount + 'bb' : ''));
        if (an.gtoAdvice) {
          lines.push('  [GTO基準] ' + an.gtoAdvice.action + '：' + an.gtoAdvice.reason);
        }
        if (an.exploitAdvice) {
          lines.push('  [實戰剝削] ' + an.exploitAdvice.action + '：' + an.exploitAdvice.reason);
        }
        if (an.lessons && an.lessons.length > 0) {
          lines.push('  [對應章節] ' + an.lessons.map((l) =>
            (l.stageTitle ? l.stageTitle + ' › ' : '') + '第 ' + (l.lessonNo || 1) + ' 課 ' + l.title + (l.secTitle ? ' › §' + (l.secNo || 1) + ' ' + l.secTitle : '')
          ).join(' | '));
        }
      });
    }

    if (hand._concepts && hand._concepts.length > 0) {
      lines.push('');
      lines.push('--- 本手牌涵蓋觀念 ＆ 課程章節總覽 ---');
      hand._concepts.forEach((c) => {
        lines.push('• [' + c.badge + '] ' + c.spotText);
        if (c.chapter) {
          lines.push('  對應：' + c.chapter.stageTitle + ' › 第 ' + c.chapter.lessonNo + ' 課 ' + c.chapter.title + ' › §' + c.chapter.secNo + ' ' + c.chapter.secTitle);
        }
      });
    }

    const text = lines.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => GTO.toast('已成功複製文字牌譜至剪貼簿！'));
    } else {
      GTO.toast('牌譜內容：\n' + text.slice(0, 100) + '...');
    }
  }

  function openImportModal() {
    const wrap = document.getElementById('replayModalWrap');
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="modal-backdrop">' +
        '<div class="modal-card">' +
          '<div class="modal-head"><h3>📥 匯入 JSON 牌譜</h3><button type="button" class="close-btn" id="closeImportModal">✕</button></div>' +
          '<div class="modal-body">' +
            '<textarea class="inp" id="importJsonText" rows="6" placeholder="貼上牌局 JSON 內容..."></textarea>' +
          '</div>' +
          '<div class="modal-foot">' +
            '<button type="button" class="btn" id="cancelImportModal">取消</button>' +
            '<button type="button" class="btn primary" id="confirmImportModal">匯入並開啟</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    const close = () => { wrap.innerHTML = ''; };
    wrap.querySelector('#closeImportModal').addEventListener('click', close);
    wrap.querySelector('#cancelImportModal').addEventListener('click', close);
    wrap.querySelector('#confirmImportModal').addEventListener('click', () => {
      const txt = wrap.querySelector('#importJsonText').value.trim();
      try {
        const obj = JSON.parse(txt);
        if (obj && obj.handId) {
          const list = getHandsList();
          list.unshift(obj);
          localStorage.setItem(HANDS_KEY, JSON.stringify(list));
          close();
          renderReplayPage(document.getElementById('appMain'), obj.handId);
          GTO.toast('成功匯入牌譜！');
        } else {
          alert('格式錯誤：缺少 handId 欄位');
        }
      } catch (err) {
        alert('JSON 解析失敗：' + err.message);
      }
    });
  }

  GTO.ReplayUI = {
    renderReplayPage,
    teardownReplay,
    getHandsList,
  };
})();

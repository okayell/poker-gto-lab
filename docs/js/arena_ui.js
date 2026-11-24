/* GTO 撲克學院 — arena_ui.js
 * 6 人擬真 AI 實戰桌（#/play）互動介面
 * 擬真 6 席牌桌視覺、全自由下注控制列、智慧快捷尺度、棄牌 3 倍速快轉、
 * 即時 HUD、上頭與時間馬腳、覆盤快照重打（Retry Spot）與結算報告。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  let table = null;
  let aiTimer = null;
  let countdownTimer = null;
  let remainingSeconds = 30;
  let isAiThinking = false;
  let retryMode = false;
  let currentRetryInfo = null;

  // 使用者設定（存於 localStorage）
  const SETTINGS_KEY = 'gto_poker_arena_settings_v1';
  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return Object.assign({
        preset: 'mixed',
        stackMode: 'realistic',
        showHud: true,
        useTimer: false,
        coachHint: false,
        autoSkipFolded: false,
        autoRebuy: false,
      }, raw ? JSON.parse(raw) : {});
    } catch (_) {
      return { preset: 'mixed', stackMode: 'realistic', showHud: true, useTimer: false, coachHint: false, autoSkipFolded: false, autoRebuy: false };
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch (_) {}
  }

  let settings = loadSettings();

  // 牌譜儲存（localStorage，最多 80 手近期 ＋ 星號收藏永久保留）
  const HANDS_STORAGE_KEY = 'gto_poker_arena_hands_v1';
  function loadSavedHands() {
    try {
      const raw = localStorage.getItem(HANDS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHandRecord(record) {
    if (!record) return;
    const hands = loadSavedHands();
    // 檢查本手是否有失誤
    let hasMistake = false;
    (record.heroDecisions || []).forEach((d) => {
      if (d.analysis && (d.analysis.grade === 'mistake' || d.analysis.grade === 'blunder' || d.analysis.grade === 'inaccuracy')) {
        hasMistake = true;
      }
    });
    record.hasMistake = hasMistake;
    record.starred = false;

    hands.unshift(record);

    // 分離收藏手牌與近期手牌
    const starred = hands.filter((h) => h.starred).slice(0, 100);
    const regular = hands.filter((h) => !h.starred).slice(0, 80);
    const combined = starred.concat(regular);

    try {
      localStorage.setItem(HANDS_STORAGE_KEY, JSON.stringify(combined));
    } catch (_) {}

    // 累積戰績至 GTO.progress.arenaStats
    if (GTO.CoachEngine && GTO.CoachEngine.recordArenaHandSummary) {
      GTO.CoachEngine.recordArenaHandSummary(record);
    }
  }

  function updateStarredHand(handId, isStarred) {
    const hands = loadSavedHands();
    const h = hands.find((x) => x.handId === handId);
    if (h) {
      h.starred = isStarred;
      try {
        localStorage.setItem(HANDS_STORAGE_KEY, JSON.stringify(hands));
      } catch (_) {}
    }
  }

  function teardownPlay() {
    if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    isAiThinking = false;
    window.removeEventListener('keydown', handleGlobalKeydown);
  }

  /** 渲染主要對戰桌頁面 */
  function renderPlayPage(root, sub, query) {
    teardownPlay();
    query = query || {};
    settings = loadSettings();

    // 檢查是否為重打模式
    retryMode = false;
    currentRetryInfo = null;
    if (query.retry) {
      const parts = query.retry.split(':');
      const handId = parts[0];
      const decIdx = parseInt(parts[1] || '0', 10);
      const hands = loadSavedHands();
      const targetHand = hands.find((h) => h.handId === handId);
      if (targetHand && targetHand.heroDecisions && targetHand.heroDecisions[decIdx]) {
        retryMode = true;
        currentRetryInfo = {
          hand: targetHand,
          decisionIdx: decIdx,
          decision: targetHand.heroDecisions[decIdx],
        };
      }
    }

    if (!table || retryMode) {
      table = GTO.TableEngine.createTable({ stackMode: settings.stackMode });
      if (retryMode && currentRetryInfo && currentRetryInfo.decision.tableSnapshot) {
        table.restoreTableState(currentRetryInfo.decision.tableSnapshot);
      } else {
        GTO.AIPersonas.populateTableRoster(table, settings.preset, settings.stackMode);
        table.startHand();
      }
    }

    buildPlayShell(root);
    updateTableView();
    window.addEventListener('keydown', handleGlobalKeydown);

    // 若當前行動者為 AI，啟動 AI 思考排程
    if (table.actionSeat > 0 && table.street !== 'ended') {
      scheduleAiTurn();
    }
  }

  function buildPlayShell(root) {
    const hands = loadSavedHands();
    const reviewCount = hands.filter((h) => h.hasMistake).length;

    root.innerHTML =
      '<div class="arena-wrap no-terms">' +
        // 頂部控制與狀態列
        '<div class="arena-topbar card">' +
          '<div class="at-left">' +
            '<span class="at-brand">♠️ 6人實戰桌</span>' +
            '<select id="arenaPresetSel" class="inp sm-inp" title="選擇場次生態">' +
              Object.keys(GTO.AIPersonas.ECOLOGY_PRESETS).map((k) => {
                const p = GTO.AIPersonas.ECOLOGY_PRESETS[k];
                return '<option value="' + k + '" ' + (settings.preset === k ? 'selected' : '') + '>' + p.title + '</option>';
              }).join('') +
            '</select>' +
            '<select id="arenaStackSel" class="inp sm-inp" title="籌碼模式">' +
              '<option value="realistic" ' + (settings.stackMode === 'realistic' ? 'selected' : '') + '>擬真混編籌碼 (40-150bb)</option>' +
              '<option value="100bb" ' + (settings.stackMode === '100bb' ? 'selected' : '') + '>全員標準 100bb</option>' +
            '</select>' +
            '<button type="button" class="btn-xs" id="arenaCustomSeatBtn" title="自訂 5 位 AI 性格與籌碼">⚙️ 座位配置</button>' +
          '</div>' +
          '<div class="at-toggles">' +
            '<label class="at-chk" title="顯示對手在桌上的真實 VPIP / PFR / 3B 統計"><input type="checkbox" id="arenaHudChk" ' + (settings.showHud ? 'checked' : '') + '> 📊 HUD</label>' +
            '<label class="at-chk" title="啟用 30 秒思考倒數（超時自動過牌/棄牌）"><input type="checkbox" id="arenaTimerChk" ' + (settings.useTimer ? 'checked' : '') + '> ⏱️ 30s限時</label>' +
            '<label class="at-chk" title="輪到自己時顯示 GTO 基準解錦囊"><input type="checkbox" id="arenaHintChk" ' + (settings.coachHint ? 'checked' : '') + '> 💡 陪練提示</label>' +
            '<label class="at-chk" title="自己棄牌後一律 3 倍速自動略過剩餘行動"><input type="checkbox" id="arenaAutoSkipChk" ' + (settings.autoSkipFolded ? 'checked' : '') + '> ⚡ 棄牌自動略過</label>' +
          '</div>' +
          '<div class="at-right">' +
            '<button type="button" class="btn-xs" id="arenaRebuyBtn">💰 補滿100bb</button>' +
            '<a class="btn-xs primary" href="#/replay" id="arenaReplayBtn">📜 前往覆盤' + (reviewCount > 0 ? ' <span class="arena-cnt-badge">' + reviewCount + '</span>' : '') + '</a>' +
            '<button type="button" class="btn-xs" id="arenaSummaryBtn">🚪 本場結算</button>' +
          '</div>' +
        '</div>' +

        (retryMode ?
          '<div class="arena-retry-banner card">' +
            '<span>🔄 <b>失誤點重打練習模式</b>：你正在第 #' + currentRetryInfo.hand.handNumber + ' 手重打第 ' + (currentRetryInfo.decisionIdx + 1) + ' 個決策！</span>' +
            '<a href="#/play" class="btn-xs">退出重打回常規桌</a>' +
          '</div>' : '') +

        // 牌桌視覺核心
        '<div class="arena-table-container">' +
          '<div class="arena-table" id="arenaTable">' +
            '<div class="arena-rail">' +
              '<div class="arena-felt">' +
                '<div class="felt-inner-ring"></div>' +
                '<div class="arena-center">' +
                  '<div class="arena-pot" id="arenaPot"><span class="pot-chip-stack" aria-hidden="true"></span><span class="pot-lbl">POT</span><strong class="pot-val">0 BB</strong></div>' +
                  '<div class="arena-board" id="arenaBoard"></div>' +
                  '<div class="arena-street-lbl" id="arenaStreetLbl">PREFLOP</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="arena-seats" id="arenaSeats"></div>' +
          '</div>' +
        '</div>' +

        // 思考計時進度條
        '<div class="arena-timer-bar-wrap" id="arenaTimerWrap" style="display:none">' +
          '<div class="arena-timer-bar" id="arenaTimerBar"></div>' +
        '</div>' +

        // 陪練即時錦囊提示框（可選開關）
        '<div class="arena-hint-box card" id="arenaHintBox" style="display:none"></div>' +

        // 玩家全自由操作列
        '<div class="arena-action-bar card" id="arenaActionBar">' +
          '<div class="aab-wait" id="aabWait">等待其他牌手行動中...</div>' +
          '<div class="aab-controls" id="aabControls" style="display:none">' +
            '<div class="aab-quick-sizes" id="aabQuickSizes"></div>' +
            '<div class="aab-slider-row">' +
              '<input type="range" class="aab-slider" id="aabSlider" min="1" max="100" step="0.5" value="2.5">' +
              '<div class="aab-input-wrap">' +
                '<input type="number" class="inp aab-inp" id="aabInp" step="0.1" value="2.5">' +
                '<span class="aab-unit">bb</span>' +
              '</div>' +
            '</div>' +
            '<div class="aab-buttons">' +
              '<button type="button" class="btn aab-btn act-fold" id="actFoldBtn">棄牌 (F)</button>' +
              '<button type="button" class="btn aab-btn act-check" id="actCheckBtn">過牌 (C)</button>' +
              '<button type="button" class="btn aab-btn act-call" id="actCallBtn">跟注 0bb (C)</button>' +
              '<button type="button" class="btn aab-btn act-raise primary" id="actRaiseBtn">加注至 0bb (R)</button>' +
              '<button type="button" class="btn aab-btn act-allin" id="actAllinBtn">全下 All-in</button>' +
            '</div>' +
          '</div>' +
          '<div class="aab-fast-forward" id="aabFastForward" style="display:none">' +
            '<span>你已棄牌，AI 正在對戰中...</span>' +
            '<button type="button" class="btn primary sm" id="btnSkipToNext">⚡ 立即下一手</button>' +
          '</div>' +
          '<div class="aab-ended" id="aabEnded" style="display:none">' +
            '<div class="aab-result-text" id="aabResultText"></div>' +
            '<div class="aab-result-btns">' +
              '<button type="button" class="btn sm" id="btnStarHand">⭐ 收藏本手</button>' +
              '<button type="button" class="btn sm" id="btnReviewNow">🔍 立即覆盤此手</button>' +
              '<button type="button" class="btn primary" id="btnNextHand">▶ 下一手 (Space)</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // 玩家筆記/標籤彈跳視窗容器
      '<div id="playerNoteModalWrap"></div>' +
      '<div id="customSeatModalWrap"></div>';

    bindTopBarEvents(root);
    bindActionBarEvents(root);
  }

  function bindTopBarEvents(root) {
    const selPreset = root.querySelector('#arenaPresetSel');
    const selStack = root.querySelector('#arenaStackSel');
    const chkHud = root.querySelector('#arenaHudChk');
    const chkTimer = root.querySelector('#arenaTimerChk');
    const chkHint = root.querySelector('#arenaHintChk');
    const chkAutoSkip = root.querySelector('#arenaAutoSkipChk');
    const btnRebuy = root.querySelector('#arenaRebuyBtn');
    const btnSummary = root.querySelector('#arenaSummaryBtn');

    if (selPreset) {
      selPreset.addEventListener('change', () => {
        settings.preset = selPreset.value;
        saveSettings(settings);
        GTO.AIPersonas.populateTableRoster(table, settings.preset, settings.stackMode);
        table.startHand();
        updateTableView();
        scheduleAiTurn();
      });
    }

    if (selStack) {
      selStack.addEventListener('change', () => {
        settings.stackMode = selStack.value;
        saveSettings(settings);
        table = GTO.TableEngine.createTable({ stackMode: settings.stackMode });
        GTO.AIPersonas.populateTableRoster(table, settings.preset, settings.stackMode);
        table.startHand();
        updateTableView();
        scheduleAiTurn();
      });
    }

    if (chkHud) {
      chkHud.addEventListener('change', () => {
        settings.showHud = chkHud.checked;
        saveSettings(settings);
        updateTableView();
      });
    }

    if (chkTimer) {
      chkTimer.addEventListener('change', () => {
        settings.useTimer = chkTimer.checked;
        saveSettings(settings);
      });
    }

    if (chkHint) {
      chkHint.addEventListener('change', () => {
        settings.coachHint = chkHint.checked;
        saveSettings(settings);
        updateCoachHintBox();
      });
    }

    if (chkAutoSkip) {
      chkAutoSkip.addEventListener('change', () => {
        settings.autoSkipFolded = chkAutoSkip.checked;
        saveSettings(settings);
      });
    }

    const btnCustomSeat = root.querySelector('#arenaCustomSeatBtn');
    if (btnCustomSeat) {
      btnCustomSeat.addEventListener('click', openCustomSeatModal);
    }

    if (btnRebuy) {
      btnRebuy.addEventListener('click', () => {
        const added = table.rebuyHero();
        if (added > 0) {
          GTO.toast('已成功為你補滿至 100bb！');
        } else {
          GTO.toast('目前籌碼已有 ' + table.seats[0].stack + 'bb，無須補滿。');
        }
        updateTableView();
      });
    }

    if (btnSummary) {
      btnSummary.addEventListener('click', showSessionSummaryModal);
    }
  }

  function bindActionBarEvents(root) {
    const actFoldBtn = root.querySelector('#actFoldBtn');
    const actCheckBtn = root.querySelector('#actCheckBtn');
    const actCallBtn = root.querySelector('#actCallBtn');
    const actRaiseBtn = root.querySelector('#actRaiseBtn');
    const actAllinBtn = root.querySelector('#actAllinBtn');
    const aabSlider = root.querySelector('#aabSlider');
    const aabInp = root.querySelector('#aabInp');
    const btnSkipToNext = root.querySelector('#btnSkipToNext');
    const btnNextHand = root.querySelector('#btnNextHand');
    const btnStarHand = root.querySelector('#btnStarHand');
    const btnReviewNow = root.querySelector('#btnReviewNow');

    if (actFoldBtn) actFoldBtn.addEventListener('click', () => handleHeroAction('fold'));
    if (actCheckBtn) actCheckBtn.addEventListener('click', () => handleHeroAction('check'));
    if (actCallBtn) actCallBtn.addEventListener('click', () => handleHeroAction('call'));
    if (actRaiseBtn) actRaiseBtn.addEventListener('click', () => handleHeroAction('raise', parseFloat(aabInp.value)));
    if (actAllinBtn) actAllinBtn.addEventListener('click', () => handleHeroAction('allin'));

    if (aabSlider && aabInp) {
      aabSlider.addEventListener('input', () => {
        aabInp.value = aabSlider.value;
        updateRaiseBtnLabel();
      });
      aabInp.addEventListener('input', () => {
        aabSlider.value = aabInp.value;
        updateRaiseBtnLabel();
      });
      aabInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          handleHeroAction('raise', parseFloat(aabInp.value));
        }
      });
    }

    if (btnSkipToNext) {
      btnSkipToNext.addEventListener('click', () => {
        // 背景跑完該手
        runRestOfHandInstantly();
      });
    }

    if (btnNextHand) {
      btnNextHand.addEventListener('click', () => {
        startNextHand();
      });
    }

    if (btnStarHand) {
      btnStarHand.addEventListener('click', () => {
        if (!table.currentHandRecord) return;
        const cur = !table.currentHandRecord.starred;
        table.currentHandRecord.starred = cur;
        updateStarredHand(table.currentHandRecord.handId, cur);
        btnStarHand.textContent = cur ? '⭐ 已收藏本手' : '☆ 收藏本手';
        btnStarHand.classList.toggle('primary', cur);
      });
    }

    if (btnReviewNow) {
      btnReviewNow.addEventListener('click', () => {
        if (table.currentHandRecord) {
          location.hash = '#/replay/' + table.currentHandRecord.handId;
        }
      });
    }
  }

  function updateRaiseBtnLabel() {
    const actRaiseBtn = document.getElementById('actRaiseBtn');
    const aabInp = document.getElementById('aabInp');
    if (actRaiseBtn && aabInp) {
      const isBet = table.currentBet === 0;
      actRaiseBtn.textContent = (isBet ? '下注 ' : '加注至 ') + aabInp.value + 'bb (R)';
    }
  }

  function handleGlobalKeydown(e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (table.street === 'ended') {
      if (e.code === 'Space') {
        e.preventDefault();
        startNextHand();
      }
      return;
    }
    if (table.actionSeat !== 0) return;

    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      handleHeroAction('fold');
    } else if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      const legal = table.getLegalActions(0);
      handleHeroAction(legal.canCheck ? 'check' : 'fold');
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      const aabInp = document.getElementById('aabInp');
      handleHeroAction('raise', aabInp ? parseFloat(aabInp.value) : 0);
    }
  }

  /** 記錄 Hero 的決策快照並應用動作 */
  function handleHeroAction(action, amount) {
    if (table.actionSeat !== 0 || table.street === 'ended') return;
    stopCountdown();

    const heroSeat = table.seats[0];
    const legal = table.getLegalActions(0);
    const toCall = GTO.TableEngine.roundBb(table.currentBet - heroSeat.currentBet);

    // 計算有效籌碼與未蓋牌人數
    const unfoldedSeats = table.seats.filter((s) => !s.folded && !s.sittingOut);
    const multiwayCount = unfoldedSeats.length;
    const oppStacks = unfoldedSeats.filter((s) => !s.isHero).map((s) => s.stack);
    const maxOppStack = oppStacks.length > 0 ? Math.max(...oppStacks) : heroSeat.stack;
    const effectiveStack = Math.min(heroSeat.stack, maxOppStack);

    // 決定主要對手（最後下注者或活躍對手）
    let vSeatId = table.lastAggressor;
    if (vSeatId <= 0 || !table.seats[vSeatId] || table.seats[vSeatId].folded) {
      const otherActives = unfoldedSeats.filter((s) => !s.isHero);
      vSeatId = otherActives.length > 0 ? otherActives[0].id : 1;
    }
    const vSeat = table.seats[vSeatId] || {};

    // 儲存決策快照
    const snap = {
      street: table.street,
      pot: table.pot,
      toCall: toCall,
      currentBet: table.currentBet,
      heroStack: heroSeat.stack,
      effectiveStack: effectiveStack,
      heroCards: heroSeat.holeCards.slice(),
      heroPosition: heroSeat.position,
      board: table.board.slice(),
      heroAction: action,
      heroAmount: amount || (action === 'call' ? legal.callAmount : 0),
      limpersCount: table.limpersCount || 0,
      preflopRaiseCount: table.preflopRaiseCount || 0,
      openerPos: table.openerPos || '',
      threeBettorPos: table.threeBettorPos || '',
      fourBettorPos: table.fourBettorPos || '',
      multiwayCount: multiwayCount,
      villainSeat: vSeatId,
      villainName: vSeat.name || '對手',
      villainPos: vSeat.position || '',
      villainPersona: vSeat.persona || 'mixed',
      villainHands: vSeat.stats ? vSeat.stats.hands : 0,
      villainVpipPct: (vSeat.stats && vSeat.stats.hands > 0) ? Math.round((vSeat.stats.vpipHands / vSeat.stats.hands) * 100) : 0,
      villainPfrPct: (vSeat.stats && vSeat.stats.hands > 0) ? Math.round((vSeat.stats.pfrHands / vSeat.stats.hands) * 100) : 0,
      villainTimingTell: vSeat.timingTell || '',
      villainTilted: Boolean(vSeat.isTilted),
      tableSnapshot: table.cloneTableState(),
    };

    // 進行雙軌覆盤評估
    const analysis = GTO.CoachEngine.analyzeDecision(snap, table);
    snap.analysis = analysis;

    if (table.currentHandRecord) {
      table.currentHandRecord.heroDecisions = table.currentHandRecord.heroDecisions || [];
      table.currentHandRecord.heroDecisions.push(snap);
    }

    try {
      table.applyAction(0, action, amount);
    } catch (err) {
      console.warn('Hero 動作執行失敗：', err);
    }

    updateTableView();

    if (table.street === 'ended') {
      onHandFinished();
    } else if (table.actionSeat > 0) {
      scheduleAiTurn();
    }
  }

  /** 排程 AI 對手行動 */
  function scheduleAiTurn() {
    if (aiTimer) clearTimeout(aiTimer);
    if (table.actionSeat <= 0 || table.street === 'ended') return;

    isAiThinking = true;
    const seatId = table.actionSeat;
    const decision = GTO.AIPersonas.decideAiAction(table, seatId);

    // 若 Hero 已蓋牌且啟用快轉，大幅壓縮延遲
    const heroFolded = table.seats[0].folded;
    const delay = heroFolded ? 320 : Math.max(300, decision.delayMs || 650);

    aiTimer = setTimeout(() => {
      try {
        table.applyAction(seatId, decision.action, decision.targetAmount);
      } catch (e) {
        console.warn('AI 行動執行異常：', e);
      }
      isAiThinking = false;
      updateTableView();

      if (table.street === 'ended') {
        onHandFinished();
      } else if (table.actionSeat > 0) {
        scheduleAiTurn();
      } else if (table.actionSeat === 0) {
        startCountdown();
      }
    }, delay);
  }

  /** 一鍵立即快轉跑完該手 */
  function runRestOfHandInstantly() {
    if (aiTimer) clearTimeout(aiTimer);
    while (table.street !== 'ended') {
      if (table.actionSeat > 0) {
        const dec = GTO.AIPersonas.decideAiAction(table, table.actionSeat);
        try {
          table.applyAction(table.actionSeat, dec.action, dec.targetAmount);
        } catch (_) {
          break;
        }
      } else {
        break;
      }
    }
    updateTableView();
    onHandFinished();
  }

  /** 思考計時器 */
  function startCountdown() {
    stopCountdown();
    if (!settings.useTimer) return;
    remainingSeconds = 30;
    const timerWrap = document.getElementById('arenaTimerWrap');
    const timerBar = document.getElementById('arenaTimerBar');
    if (timerWrap) timerWrap.style.display = 'block';
    if (timerBar) timerBar.style.width = '100%';

    countdownTimer = setInterval(() => {
      remainingSeconds--;
      if (timerBar) {
        const pct = Math.max(0, (remainingSeconds / 30) * 100);
        timerBar.style.width = pct + '%';
        timerBar.classList.toggle('danger', remainingSeconds <= 5);
      }
      if (remainingSeconds <= 0) {
        stopCountdown();
        // 超時強制過牌或棄牌
        const legal = table.getLegalActions(0);
        handleHeroAction(legal.canCheck ? 'check' : 'call');
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    const timerWrap = document.getElementById('arenaTimerWrap');
    if (timerWrap) timerWrap.style.display = 'none';
  }

  /** 單手結束處理 */
  function onHandFinished() {
    stopCountdown();
    if (table.currentHandRecord) {
      saveHandRecord(table.currentHandRecord);
    }
    updateTableView();

    // 更新覆盤按鈕上的失誤紅徽章
    const hands = loadSavedHands();
    const reviewCount = hands.filter((h) => h.hasMistake).length;
    const repBtn = document.getElementById('arenaReplayBtn');
    if (repBtn) {
      repBtn.innerHTML = '📜 前往覆盤' + (reviewCount > 0 ? ' <span class="arena-cnt-badge">' + reviewCount + '</span>' : '');
    }
  }

  /** 開始下一手 */
  function startNextHand() {
    if (retryMode) {
      location.hash = '#/play';
      return;
    }
    // 檢查 Hero 是否破產
    if (table.seats[0].stack <= 0.1) {
      table.rebuyHero();
      GTO.toast('已為你自動補滿 100bb 繼續實戰！');
    }
    // 檢查 AI 籌碼並適當輪轉人員
    for (let i = 1; i < 6; i++) {
      if (table.seats[i].stack < 1.0 || (Math.random() < 0.05 && table.handNumber % 20 === 0)) {
        const pKey = Object.keys(GTO.AIPersonas.AI_PERSONAS)[Math.floor(Math.random() * 6)];
        const persona = GTO.AIPersonas.AI_PERSONAS[pKey];
        table.seats[i].persona = pKey;
        table.seats[i].personaBadge = persona.badge;
        table.seats[i].stack = GTO.TableEngine.roundBb(persona.stackRange[0] + Math.random() * (persona.stackRange[1] - persona.stackRange[0]));
      }
    }
    if (settings.stackMode === '100bb') {
      table.rebuyHero();
      for (let i = 1; i < 6; i++) {
        if (table.seats[i]) table.seats[i].stack = 100.0;
      }
    }
    table.startHand();
    updateTableView();
    if (table.actionSeat > 0) scheduleAiTurn();
    else if (table.actionSeat === 0) startCountdown();
  }

  /** 更新牌桌完整 DOM 畫面 */
  function updateTableView() {
    const potEl = document.getElementById('arenaPot');
    const boardEl = document.getElementById('arenaBoard');
    const streetLbl = document.getElementById('arenaStreetLbl');
    const seatsEl = document.getElementById('arenaSeats');

    if (!potEl || !boardEl || !seatsEl) return;

    // 底池與街道標籤
    const streetZh = { preflop: 'PREFLOP · 翻牌前', flop: 'FLOP · 翻牌圈', turn: 'TURN · 轉牌圈', river: 'RIVER · 河牌圈', showdown: 'SHOWDOWN · 攤牌', ended: 'HAND COMPLETE' };
    streetLbl.textContent = streetZh[table.street] || table.street;
    potEl.innerHTML = '<span class="pot-chip-stack" aria-hidden="true"></span><span class="pot-lbl">POT</span><strong class="pot-val">' + table.pot + ' BB</strong>';

    // 公共牌（固定 5 格，未發出顯示虛線卡槽）
    const boardSlots = [];
    for (let i = 0; i < 5; i++) {
      if (i < table.board.length) {
        boardSlots.push(GTO.cardsHtml([table.board[i]], 'md'));
      } else {
        boardSlots.push('<span class="board-slot-empty" aria-hidden="true"></span>');
      }
    }
    boardEl.innerHTML = boardSlots.join('');

    // 6 席座位渲染
    renderSeats(seatsEl);

    // 操作列狀態更新
    updateActionBar();
    updateCoachHintBox();
  }

  function actionPillTone(txt) {
    if (!txt) return 'act-blind';
    const s = String(txt);
    if (s.includes('全下') || /all-?in/i.test(s)) return 'act-allin';
    if (s.includes('加注') || /raise|3-?bet|4-?bet/i.test(s)) return 'act-raise';
    if (s.includes('下注') || /\bbet\b/i.test(s)) return 'act-bet';
    if (s.includes('跟注') || s.includes('平跟') || /call/i.test(s)) return 'act-call';
    if (s.includes('過牌') || /check/i.test(s)) return 'act-check';
    if (s.includes('棄牌') || /fold/i.test(s)) return 'act-fold';
    return 'act-blind';
  }

  function renderSeats(container) {
    const isShowdown = table.street === 'ended' || table.street === 'showdown';
    const notes = GTO.AIPersonas.loadPlayerNotes();

    container.innerHTML = table.seats.map((s, idx) => {
      const isTurn = table.actionSeat === idx && table.street !== 'ended';
      const isHero = s.isHero;
      const isD = table.dealerSeat === idx;
      const pos = s.position || '';
      const customNote = notes[s.name] || {};
      const tagObj = GTO.AIPersonas.USER_TAGS.find((t) => t.key === customNote.tag) || GTO.AIPersonas.USER_TAGS[0];

      // 底牌呈現：Hero 或走到攤牌的玩家顯示明牌，其餘蓋牌顯示精裝牌背
      let cardsHtml = '';
      if (s.holeCards && s.holeCards.length === 2 && !s.folded) {
        if (isHero || (isShowdown && !s.folded)) {
          cardsHtml = GTO.cardsHtml(s.holeCards, 'hole');
        } else {
          cardsHtml = '<span class="pcards">' + GTO.cardBackHtml('hole') + GTO.cardBackHtml('hole') + '</span>';
        }
      }

      // HUD 數據卡
      let hudHtml = '';
      if (settings.showHud && !isHero && s.stats.hands > 0) {
        const vpip = Math.round((s.stats.vpipHands / s.stats.hands) * 100);
        const pfr = Math.round((s.stats.pfrHands / s.stats.hands) * 100);
        const threeB = Math.round((s.stats.threeBetHands / Math.max(1, s.stats.hands)) * 100);
        hudHtml = '<div class="arena-hud-pill" title="即時牌桌真實統計：VPIP% / PFR% / 3B% (樣本手數)">' +
          '<span>V:' + vpip + '%</span>' +
          '<span>P:' + pfr + '%</span>' +
          '<span>3B:' + threeB + '%</span>' +
          '<small>(' + s.stats.hands + ')</small>' +
        '</div>';
      }

      const cls = [
        'arena-seat',
        'seat-' + idx,
        isHero ? 'hero-seat is-hero' : 'ai-seat',
        isTurn ? 'active-turn is-active' : '',
        s.folded ? 'folded is-folded' : '',
        s.allin ? 'allin' : '',
      ].filter(Boolean).join(' ');

      const actTone = actionPillTone(s.lastAction);

      return '<div class="' + cls + '" data-seat="' + idx + '">' +
        // 扇形底牌（從座位名牌後方探出）
        (cardsHtml ? '<div class="arena-seat-cards">' + cardsHtml + '</div>' : '') +
        // 玩家資訊名牌
        '<div class="arena-seat-badge" ' + (!isHero ? 'data-edit-note="' + GTO.esc(s.name) + '" title="點擊貼標籤或記錄對手馬腳筆記"' : '') + '>' +
          '<div class="asb-top">' +
            (pos ? '<span class="asb-pos' + (isHero ? ' hero-pos' : '') + '">' + pos + '</span>' : '') +
            '<span class="asb-name">' + GTO.esc(s.name) + (customNote.tag ? ' <span class="asb-tag" title="' + GTO.esc(customNote.note || '') + '">' + tagObj.icon + '</span>' : '') + '</span>' +
          '</div>' +
          '<div class="asb-stack"><strong>' + s.stack + '</strong> BB</div>' +
        '</div>' +
        // 行動膠囊
        (s.lastAction ? '<div class="arena-action-bubble ' + actTone + '">' + (s.timingTell ? '<span class="tell">' + s.timingTell + '</span> ' : '') + GTO.esc(s.lastAction) + '</div>' : '') +
        // 象牙白 3D 莊家鈕
        (isD ? '<div class="arena-dealer-btn" title="莊家按鈕 (BTN)">D</div>' : '') +
        // 本街投入下注籌碼
        (s.currentBet > 0 ? '<div class="arena-bet-chip">' + s.currentBet + ' BB</div>' : '') +
        hudHtml +
      '</div>';
    }).join('');

    // 綁定點擊 AI 座位開啟筆記彈窗
    container.querySelectorAll('[data-edit-note]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openPlayerNoteModal(el.getAttribute('data-edit-note'));
      });
    });
  }

  function updateActionBar() {
    const aabWait = document.getElementById('aabWait');
    const aabControls = document.getElementById('aabControls');
    const aabFastForward = document.getElementById('aabFastForward');
    const aabEnded = document.getElementById('aabEnded');

    if (!aabWait || !aabControls || !aabFastForward || !aabEnded) return;

    const heroSeat = table.seats[0];
    const isHeroTurn = table.actionSeat === 0 && table.street !== 'ended';
    const isEnded = table.street === 'ended';
    const isHeroFolded = heroSeat.folded && !isEnded;

    aabWait.style.display = 'none';
    aabControls.style.display = 'none';
    aabFastForward.style.display = 'none';
    aabEnded.style.display = 'none';

    if (isEnded) {
      aabEnded.style.display = 'flex';
      const resultText = document.getElementById('aabResultText');
      const rec = table.currentHandRecord;
      if (resultText && rec && rec.winners) {
        const heroProfit = rec.netProfit ? rec.netProfit[0] || 0 : 0;
        const winStr = rec.winners.map((w) => w.name + '（+' + w.amount + 'bb）' + (w.handDesc ? ' · ' + w.handDesc : '')).join('、');
        let feedbackHtml = '';
        if (rec.heroDecisions && rec.heroDecisions.length > 0) {
          const lastDec = rec.heroDecisions[rec.heroDecisions.length - 1];
          if (lastDec.analysis) {
            feedbackHtml = ' <span class="badge ' + (lastDec.analysis.grade === 'best' || lastDec.analysis.grade === 'good' ? 'green' : 'red') + '">' +
              lastDec.analysis.gradeLabel + (lastDec.analysis.evLossBb > 0 ? ' (-' + lastDec.analysis.evLossBb + 'bb EV)' : '') + '</span>';
          }
        }
        resultText.innerHTML = '<b>🏆 獲勝：' + winStr + '</b> | 你的損益：<span class="' + (heroProfit >= 0 ? 'plus' : 'minus') + '">' +
          (heroProfit >= 0 ? '+' : '') + heroProfit + 'bb</span>' + feedbackHtml;
      }
    } else if (isHeroFolded) {
      if (settings.autoSkipFolded) {
        runRestOfHandInstantly();
      } else {
        aabFastForward.style.display = 'flex';
      }
    } else if (isHeroTurn) {
      aabControls.style.display = 'block';
      updateLegalButtons();
    } else {
      aabWait.style.display = 'block';
      const actorName = table.seats[table.actionSeat] ? table.seats[table.actionSeat].name : 'AI';
      aabWait.textContent = '輪到 ' + actorName + ' 思考行動中...';
    }
  }

  function updateLegalButtons() {
    const legal = table.getLegalActions(0);
    const actFoldBtn = document.getElementById('actFoldBtn');
    const actCheckBtn = document.getElementById('actCheckBtn');
    const actCallBtn = document.getElementById('actCallBtn');
    const actRaiseBtn = document.getElementById('actRaiseBtn');
    const actAllinBtn = document.getElementById('actAllinBtn');
    const aabSlider = document.getElementById('aabSlider');
    const aabInp = document.getElementById('aabInp');
    const quickSizesEl = document.getElementById('aabQuickSizes');

    if (!actFoldBtn || !actCheckBtn || !actCallBtn || !actRaiseBtn || !actAllinBtn) return;

    actFoldBtn.style.display = legal.canFold ? 'inline-flex' : 'none';
    actCheckBtn.style.display = legal.canCheck ? 'inline-flex' : 'none';
    actCallBtn.style.display = legal.canCall ? 'inline-flex' : 'none';
    actRaiseBtn.style.display = (legal.canBet || legal.canRaise) ? 'inline-flex' : 'none';
    actAllinBtn.style.display = legal.maxRaiseTo > 0 ? 'inline-flex' : 'none';

    if (legal.canCall) {
      const isLimp = table.currentBet === 1.0 && table.street === 'preflop' && legal.callAmount === 1.0;
      actCallBtn.textContent = (isLimp ? '平跟 1bb (C)' : '跟注 ' + legal.callAmount + 'bb (C)');
    }

    // 快捷尺度按鈕與滑桿上下界
    if (legal.canBet || legal.canRaise) {
      const isBet = table.currentBet === 0;
      const minTo = legal.minRaiseTo;
      const maxTo = legal.maxRaiseTo;

      aabSlider.min = minTo;
      aabSlider.max = maxTo;
      aabSlider.step = 0.5;

      // 建議起始加注尺度
      let defaultTo = minTo;
      if (table.street === 'preflop') {
        defaultTo = isBet ? 2.5 : GTO.TableEngine.roundBb(table.currentBet * 3.0);
      } else {
        defaultTo = isBet ? GTO.TableEngine.roundBb(table.pot * 0.33) : GTO.TableEngine.roundBb(table.currentBet * 2.5);
      }
      defaultTo = Math.max(minTo, Math.min(maxTo, defaultTo));
      aabSlider.value = defaultTo;
      aabInp.value = defaultTo;
      aabInp.min = minTo;
      aabInp.max = maxTo;

      updateRaiseBtnLabel();

      // 產生智慧快捷尺度鈕
      if (quickSizesEl) {
        const quicks = [];
        if (table.street === 'preflop') {
          if (isBet) {
            quicks.push({ label: '2.5bb (標準)', val: 2.5 });
            quicks.push({ label: '3.0bb (大盲防守)', val: 3.0 });
            quicks.push({ label: '4.0bb (隔離)', val: 4.0 });
          } else {
            quicks.push({ label: '2.5x 小加注', val: GTO.TableEngine.roundBb(table.currentBet * 2.5) });
            quicks.push({ label: '3.0x 標準 3B', val: GTO.TableEngine.roundBb(table.currentBet * 3.0) });
            quicks.push({ label: '4.0x OOP 3B', val: GTO.TableEngine.roundBb(table.currentBet * 4.0) });
          }
        } else {
          quicks.push({ label: '1bb 最小注', val: isBet ? 1.0 : minTo });
          quicks.push({ label: '33% 小注', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 0.33) });
          quicks.push({ label: '50% 半池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 0.5) });
          quicks.push({ label: '75% 價值注', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 0.75) });
          quicks.push({ label: '100% 滿池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 1.0) });
          quicks.push({ label: '150% 超池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 1.5) });
        }
        quicks.push({ label: 'All-in 全下', val: maxTo });

        quickSizesEl.innerHTML = quicks.map((q) => {
          const clamped = Math.max(minTo, Math.min(maxTo, q.val));
          return '<button type="button" class="btn-xs quick-size-btn" data-val="' + clamped + '">' + q.label + '</button>';
        }).join('');

        quickSizesEl.querySelectorAll('.quick-size-btn').forEach((b) => {
          b.addEventListener('click', () => {
            const v = parseFloat(b.getAttribute('data-val'));
            aabSlider.value = v;
            aabInp.value = v;
            updateRaiseBtnLabel();
          });
        });
      }
    }
  }

  function updateCoachHintBox() {
    const hintBox = document.getElementById('arenaHintBox');
    if (!hintBox) return;
    if (!settings.coachHint || table.actionSeat !== 0 || table.street === 'ended') {
      hintBox.style.display = 'none';
      return;
    }

    const heroSeat = table.seats[0];
    const snap = {
      street: table.street,
      pot: table.pot,
      toCall: GTO.TableEngine.roundBb(table.currentBet - heroSeat.currentBet),
      currentBet: table.currentBet,
      heroStack: heroSeat.stack,
      heroCards: heroSeat.holeCards.slice(),
      heroPosition: heroSeat.position,
      board: table.board.slice(),
    };
    const analysis = GTO.CoachEngine.analyzeDecision(snap, table);

    hintBox.style.display = 'block';
    hintBox.innerHTML =
      '<div class="ah-head"><b>💡 教練即時錦囊</b><span>底池賠率：' + analysis.potOddsPct + '% · SPR：' + analysis.spr + '</span></div>' +
      '<div class="ah-body">' +
        '<div><strong>♟️ GTO 建議：</strong>' + analysis.gtoAdvice.action + '（' + analysis.gtoAdvice.reason + '）</div>' +
        (analysis.exploitAdvice && analysis.exploitAdvice.reason ? '<div><strong>🎯 實戰剝削：</strong>' + analysis.exploitAdvice.action + '（' + analysis.exploitAdvice.reason + '）</div>' : '') +
      '</div>';
  }

  /** 玩家自訂對手標籤與筆記彈窗 */
  function openPlayerNoteModal(playerName) {
    const wrap = document.getElementById('playerNoteModalWrap');
    if (!wrap) return;
    const notes = GTO.AIPersonas.loadPlayerNotes();
    const cur = notes[playerName] || { tag: '', note: '' };

    wrap.innerHTML =
      '<div class="modal-backdrop">' +
        '<div class="modal-card note-modal">' +
          '<div class="modal-head"><h3>📝 對手觀察筆記：' + GTO.esc(playerName) + '</h3><button type="button" class="close-btn" id="closeNoteModal">✕</button></div>' +
          '<div class="modal-body">' +
            '<p class="muted small">貼上你的個人標籤與馬腳紀錄，覆盤時可對照猜得準不準：</p>' +
            '<div class="note-tags-grid">' +
              GTO.AIPersonas.USER_TAGS.map((t) =>
                '<button type="button" class="btn-xs tag-choice-btn ' + (cur.tag === t.key ? 'active' : '') + '" data-tag="' + t.key + '">' +
                  t.icon + ' ' + t.label +
                '</button>'
              ).join('') +
            '</div>' +
            '<div class="form-group" style="margin-top:14px">' +
              '<label class="lbl">馬腳備忘（如：秒推常詐唬、轉牌大注必有兩對）：</label>' +
              '<textarea class="inp" id="playerNoteText" rows="3" placeholder="記錄你對該牌手的行動觀察...">' + GTO.esc(cur.note || '') + '</textarea>' +
            '</div>' +
          '</div>' +
          '<div class="modal-foot">' +
            '<button type="button" class="btn" id="cancelNoteModal">取消</button>' +
            '<button type="button" class="btn primary" id="saveNoteModal">儲存筆記</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    let selectedTag = cur.tag;
    wrap.querySelectorAll('.tag-choice-btn').forEach((b) => {
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.tag-choice-btn').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        selectedTag = b.getAttribute('data-tag');
      });
    });

    const close = () => { wrap.innerHTML = ''; };
    wrap.querySelector('#closeNoteModal').addEventListener('click', close);
    wrap.querySelector('#cancelNoteModal').addEventListener('click', close);
    wrap.querySelector('#saveNoteModal').addEventListener('click', () => {
      const text = wrap.querySelector('#playerNoteText').value;
      GTO.AIPersonas.savePlayerNote(playerName, selectedTag, text);
      close();
      updateTableView();
      GTO.toast('已成功儲存牌手「' + playerName + '」的觀察筆記！');
    });
  }

  /** 本場結算彈窗 */
  function showSessionSummaryModal() {
    const wrap = document.getElementById('playerNoteModalWrap');
    if (!wrap) return;
    const hands = loadSavedHands();
    const st = (GTO.progress && GTO.progress.arenaStats) || { handsPlayed: hands.length, totalProfitBb: 0, totalDecisions: 0, goodDecisions: 0, leaks: {} };
    const goodPct = st.totalDecisions > 0 ? Math.round((st.goodDecisions / st.totalDecisions) * 100) : 0;

    wrap.innerHTML =
      '<div class="modal-backdrop">' +
        '<div class="modal-card">' +
          '<div class="modal-head"><h3>🚪 6人實戰桌 · 本場結算報告</h3><button type="button" class="close-btn" id="closeSummaryModal">✕</button></div>' +
          '<div class="modal-body">' +
            '<div class="session-stat-tiles">' +
              '<div class="stat-tile"><span>總手數</span><strong>' + st.handsPlayed + '</strong></div>' +
              '<div class="stat-tile"><span>淨損益 (bb)</span><strong class="' + (st.totalProfitBb >= 0 ? 'plus' : 'minus') + '">' + (st.totalProfitBb >= 0 ? '+' : '') + st.totalProfitBb + '</strong></div>' +
              '<div class="stat-tile"><span>決策標準率</span><strong>' + goodPct + '%</strong></div>' +
            '</div>' +
            '<p class="muted small" style="margin-top:14px">最近已儲存 ' + hands.length + ' 手牌局，凡是有瑕疵或失誤的手牌皆已為你自動打上 ⚠️ 待檢討標籤。</p>' +
          '</div>' +
          '<div class="modal-foot">' +
            '<button type="button" class="btn" id="btnStayTable">繼續留在牌桌</button>' +
            '<a href="#/replay" class="btn primary">前往覆盤室分析</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    wrap.querySelector('#closeSummaryModal').addEventListener('click', () => { wrap.innerHTML = ''; });
    wrap.querySelector('#btnStayTable').addEventListener('click', () => { wrap.innerHTML = ''; });
  }

  GTO.ArenaUI = {
    renderPlayPage,
    teardownPlay,
    loadSavedHands,
    saveHandRecord,
  };
})();

  function openCustomSeatModal() {
    const wrap = document.getElementById('customSeatModalWrap');
    if (!wrap || !table) return;
    const personas = GTO.AIPersonas.AI_PERSONAS;

    let rowsHtml = '';
    for (let i = 1; i < 6; i++) {
      const s = table.seats[i];
      rowsHtml += '<div class="csm-row" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<b style="font-size:13px">座位 ' + i + ' (' + GTO.esc(s.name) + ')</b>' +
        '<select class="inp sm-inp csm-persona" data-seat="' + i + '" style="font-size:12px">' +
          Object.keys(personas).map((k) => '<option value="' + k + '" ' + (s.persona === k ? 'selected' : '') + '>' + personas[k].badge + ' ' + personas[k].title + '</option>').join('') +
        '</select>' +
        '<label style="display:flex;align-items:center;gap:3px;font-size:12px">' +
          '<input type="number" class="inp sm-inp csm-stack" data-seat="' + i + '" value="' + s.stack + '" min="30" max="250" step="5" style="width:65px"> bb' +
        '</label>' +
      '</div>';
    }

    wrap.innerHTML =
      '<div class="modal-mask">' +
        '<div class="player-note-modal">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="margin:0">⚙️ 自訂 5 位 AI 座位性格與籌碼</h3>' +
            '<button type="button" class="btn-xs" id="closeCustomSeatTopBtn">✕</button>' +
          '</div>' +
          '<div style="max-height:360px;overflow-y:auto">' + rowsHtml + '</div>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">' +
            '<button type="button" class="btn-xs" id="closeCustomSeatBtn">取消</button>' +
            '<button type="button" class="btn-xs primary" id="saveCustomSeatBtn">套用設定</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    wrap.style.display = 'block';

    const hide = () => { wrap.style.display = 'none'; };
    const closeBtn = wrap.querySelector('#closeCustomSeatBtn');
    if (closeBtn) closeBtn.addEventListener('click', hide);
    const closeTopBtn = wrap.querySelector('#closeCustomSeatTopBtn');
    if (closeTopBtn) closeTopBtn.addEventListener('click', hide);

    const saveBtn = wrap.querySelector('#saveCustomSeatBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        wrap.querySelectorAll('.csm-persona').forEach((sel) => {
          const seatId = parseInt(sel.dataset.seat, 10);
          const pKey = sel.value;
          table.seats[seatId].persona = pKey;
          table.seats[seatId].personaBadge = personas[pKey].badge;
        });
        wrap.querySelectorAll('.csm-stack').forEach((inp) => {
          const seatId = parseInt(inp.dataset.seat, 10);
          const val = parseFloat(inp.value) || 100.0;
          table.seats[seatId].stack = GTO.TableEngine.roundBb(val);
        });
        settings.preset = 'custom';
        const selPreset = document.getElementById('arenaPresetSel');
        if (selPreset) selPreset.value = 'custom';
        hide();
        updateTableView();
        GTO.toast('已成功套用自訂座位性格與籌碼量！');
      });
    }
  }

/* GTO 撲克學院 — arena_ui.js
 * 6 人擬真 AI 實戰桌（#/play）互動介面
 * 擬真 6 席牌桌視覺、差量 DOM 零閃爍渲染、手機單屏摺疊設定列、全自由下注控制列、
 * 智慧快捷尺度、棄牌快轉、即時 HUD、上頭與時間馬腳、覆盤快照重打（Retry Spot）與結算報告。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  let table = null;
  let aiTimer = null;
  let countdownTimer = null;
  let persistTimer = null;
  let remainingSeconds = 30;
  let isAiThinking = false;
  let retryMode = false;
  let currentRetryInfo = null;
  let lastSavedHandId = '';

  // 渲染快取（避免每步重建整張牌桌 DOM 與反覆解析 localStorage）
  let cachedNotes = null;
  let cachedHands = null;
  let prevPotSig = '';
  let prevStreetSig = '';
  let prevBoardSigs = ['', '', '', '', ''];
  let prevSeatSigs = ['', '', '', '', '', ''];
  let prevTurnSig = '';
  let prevHintSig = '';

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

  function getNotesCached(forceReload) {
    if (!cachedNotes || forceReload) {
      cachedNotes = GTO.AIPersonas ? GTO.AIPersonas.loadPlayerNotes() : {};
    }
    return cachedNotes;
  }

  // 牌譜儲存（localStorage，最多 80 手近期 ＋ 星號收藏永久保留；非同步寫入不卡主執行緒）
  const HANDS_STORAGE_KEY = 'gto_poker_arena_hands_v1';
  function loadSavedHands(forceReload) {
    if (cachedHands && !forceReload) return cachedHands;
    try {
      const raw = localStorage.getItem(HANDS_STORAGE_KEY);
      cachedHands = raw ? JSON.parse(raw) : [];
    } catch (_) {
      cachedHands = [];
    }
    return cachedHands;
  }

  function persistHandsAsync(hands) {
    cachedHands = hands;
    if (persistTimer) clearTimeout(persistTimer);
    const write = () => {
      persistTimer = null;
      try {
        localStorage.setItem(HANDS_STORAGE_KEY, JSON.stringify(hands));
      } catch (_) {
        // 若儲存空間將滿，裁切舊手牌快照後重試
        try {
          const slim = hands.slice(0, 50).map((h, i) => {
            if (i < 10 || h.starred) return h;
            const copy = Object.assign({}, h);
            if (Array.isArray(copy.heroDecisions)) {
              copy.heroDecisions = copy.heroDecisions.map((d) => {
                const dc = Object.assign({}, d);
                delete dc.tableSnapshot;
                return dc;
              });
            }
            return copy;
          });
          cachedHands = slim;
          localStorage.setItem(HANDS_STORAGE_KEY, JSON.stringify(slim));
        } catch (__) {}
      }
    };
    if (typeof requestIdleCallback === 'function') {
      persistTimer = setTimeout(() => requestIdleCallback(write, { timeout: 600 }), 0);
    } else {
      persistTimer = setTimeout(write, 0);
    }
  }

  function saveHandRecord(record) {
    if (!record) return;
    if (record.handId && record.handId === lastSavedHandId) return;
    lastSavedHandId = record.handId || '';

    const hands = loadSavedHands(true).slice();
    // 檢查本手是否有失誤
    let hasMistake = false;
    (record.heroDecisions || []).forEach((d) => {
      if (d.analysis && (d.analysis.grade === 'mistake' || d.analysis.grade === 'blunder' || d.analysis.grade === 'inaccuracy')) {
        hasMistake = true;
      }
    });
    record.hasMistake = hasMistake;
    if (typeof record.starred !== 'boolean') record.starred = false;

    // 去除同 ID 舊紀錄並把最新打完的牌局放最前面
    const dedup = hands.filter((h) => !h || h.handId !== record.handId);
    dedup.unshift(record);

    // 保留所有收藏（上限 100）與最近 80 手一般紀錄，並維持真實最新手牌置頂、示範手牌不搶位
    let starCnt = 0;
    let regCnt = 0;
    const kept = [];
    for (let i = 0; i < dedup.length; i++) {
      const h = dedup[i];
      if (!h) continue;
      if (h.starred) {
        if (starCnt < 100) { starCnt++; kept.push(h); }
      } else {
        if (regCnt < 80) {
          regCnt++;
          // 第 20 手以後的未收藏舊紀錄移除大型 tableSnapshot，大幅縮減 localStorage 體積
          if (regCnt > 20 && Array.isArray(h.heroDecisions)) {
            h.heroDecisions.forEach((d) => { if (d && d.tableSnapshot) delete d.tableSnapshot; });
          }
          kept.push(h);
        }
      }
    }

    persistHandsAsync(kept);

    // 累積戰績至 GTO.progress.arenaStats
    if (GTO.CoachEngine && GTO.CoachEngine.recordArenaHandSummary) {
      GTO.CoachEngine.recordArenaHandSummary(record);
    }
  }

  function updateStarredHand(handId, isStarred) {
    const hands = loadSavedHands().slice();
    const h = hands.find((x) => x.handId === handId);
    if (h) {
      h.starred = isStarred;
      persistHandsAsync(hands);
    }
  }

  function resetRenderCaches() {
    prevPotSig = '';
    prevStreetSig = '';
    prevBoardSigs = ['', '', '', '', ''];
    prevSeatSigs = ['', '', '', '', '', ''];
    prevTurnSig = '';
    prevHintSig = '';
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
    resetRenderCaches();
    query = query || {};
    settings = loadSettings();
    getNotesCached(true);
    loadSavedHands(true);

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

    // 若當前行動者為 AI，啟動 AI 思考排程；若已輪到 Hero 則啟動計時
    if (table.actionSeat > 0 && table.street !== 'ended') {
      scheduleAiTurn();
    } else if (table.actionSeat === 0 && table.street !== 'ended') {
      startCountdown();
    }
  }

  function buildPlayShell(root) {
    const hands = loadSavedHands();
    const reviewCount = hands.filter((h) => h.hasMistake).length;
    const presetMeta = GTO.AIPersonas.ECOLOGY_PRESETS[settings.preset] || { title: '自訂座位' };

    const initialSeatsHtml = [];
    for (let i = 0; i < 6; i++) {
      initialSeatsHtml.push('<div class="arena-seat seat-' + i + '" data-seat="' + i + '"></div>');
    }
    const initialBoardHtml = [];
    for (let i = 0; i < 5; i++) {
      initialBoardHtml.push('<span class="board-slot" data-slot="' + i + '"><span class="board-slot-empty" aria-hidden="true"></span></span>');
    }

    root.innerHTML =
      '<div class="arena-wrap no-terms no-en">' +
        // 頂部控制與狀態列（手機版可收合，確保第一屏同時看到全桌＋下注按鈕）
        '<div class="arena-topbar card" id="arenaTopbar">' +
          '<div class="at-main-row">' +
            '<span class="at-brand">♠️ 6人實戰桌</span>' +
            '<span class="at-mob-preset" id="arenaMobPreset">' + GTO.esc(presetMeta.title) + '</span>' +
            '<div class="at-right">' +
              '<button type="button" class="btn-xs at-settings-toggle" id="arenaSettingsToggle" aria-expanded="false" title="展開／收合牌桌設定">⚙️ 設定</button>' +
              '<button type="button" class="btn-xs" id="arenaRebuyBtn" title="補滿 100bb">💰 <span class="at-btn-lbl">補滿100bb</span><span class="at-btn-short">補滿</span></button>' +
              '<a class="btn-xs primary" href="#/replay" id="arenaReplayBtn">📜 <span class="at-btn-lbl">前往覆盤</span><span class="at-btn-short">覆盤</span>' + (reviewCount > 0 ? ' <span class="arena-cnt-badge">' + reviewCount + '</span>' : '') + '</a>' +
              '<button type="button" class="btn-xs" id="arenaSummaryBtn" title="本場結算">🚪 <span class="at-btn-lbl">本場結算</span><span class="at-btn-short">結算</span></button>' +
            '</div>' +
          '</div>' +
          '<div class="at-settings-panel" id="arenaSettingsPanel">' +
            '<div class="at-left">' +
              '<select id="arenaPresetSel" class="inp sm-inp" title="選擇場次生態">' +
                Object.keys(GTO.AIPersonas.ECOLOGY_PRESETS).map((k) => {
                  const p = GTO.AIPersonas.ECOLOGY_PRESETS[k];
                  return '<option value="' + k + '" ' + (settings.preset === k ? 'selected' : '') + '>' + p.title + '</option>';
                }).join('') +
                '<option value="custom" ' + (settings.preset === 'custom' ? 'selected' : '') + '>⚙️ 自訂座位配置</option>' +
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
              '<label class="at-chk" title="自己棄牌後一律快速結算進入下一手"><input type="checkbox" id="arenaAutoSkipChk" ' + (settings.autoSkipFolded ? 'checked' : '') + '> ⚡ 棄牌自動略過</label>' +
            '</div>' +
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
                  '<div class="arena-pot" id="arenaPot"><span class="pot-chip-stack" aria-hidden="true"></span><span class="pot-lbl">POT</span><strong class="pot-val" id="arenaPotVal">0 BB</strong></div>' +
                  '<div class="arena-board" id="arenaBoard">' + initialBoardHtml.join('') + '</div>' +
                  '<div class="arena-street-lbl" id="arenaStreetLbl">PREFLOP</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="arena-seats" id="arenaSeats">' + initialSeatsHtml.join('') + '</div>' +
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
                '<input type="number" class="inp aab-inp" id="aabInp" step="0.1" inputmode="decimal" value="2.5">' +
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
            '<button type="button" class="btn primary sm" id="btnSkipToNext">⚡ 立即結算</button>' +
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

      // 玩家筆記/標籤與自訂座位彈跳視窗容器
      '<div id="playerNoteModalWrap"></div>' +
      '<div id="customSeatModalWrap"></div>';

    // 單一事件委派處理點擊 AI 名牌開啟筆記彈窗（避免每步重綁）
    const seatsEl = root.querySelector('#arenaSeats');
    if (seatsEl) {
      seatsEl.addEventListener('click', (e) => {
        const badge = e.target && e.target.closest ? e.target.closest('[data-edit-note]') : null;
        if (badge && seatsEl.contains(badge)) {
          e.stopPropagation();
          openPlayerNoteModal(badge.getAttribute('data-edit-note'));
        }
      });
    }

    bindTopBarEvents(root);
    bindActionBarEvents(root);
  }

  function bindTopBarEvents(root) {
    const topbar = root.querySelector('#arenaTopbar');
    const toggleBtn = root.querySelector('#arenaSettingsToggle');
    const mobPreset = root.querySelector('#arenaMobPreset');
    const selPreset = root.querySelector('#arenaPresetSel');
    const selStack = root.querySelector('#arenaStackSel');
    const chkHud = root.querySelector('#arenaHudChk');
    const chkTimer = root.querySelector('#arenaTimerChk');
    const chkHint = root.querySelector('#arenaHintChk');
    const chkAutoSkip = root.querySelector('#arenaAutoSkipChk');
    const btnRebuy = root.querySelector('#arenaRebuyBtn');
    const btnSummary = root.querySelector('#arenaSummaryBtn');
    const btnCustomSeat = root.querySelector('#arenaCustomSeatBtn');

    if (toggleBtn && topbar) {
      toggleBtn.addEventListener('click', () => {
        const open = topbar.classList.toggle('settings-open');
        toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggleBtn.classList.toggle('active', open);
      });
    }

    if (selPreset) {
      selPreset.addEventListener('change', () => {
        if (selPreset.value === 'custom') {
          openCustomSeatModal();
          return;
        }
        settings.preset = selPreset.value;
        saveSettings(settings);
        if (mobPreset && GTO.AIPersonas.ECOLOGY_PRESETS[settings.preset]) {
          mobPreset.textContent = GTO.AIPersonas.ECOLOGY_PRESETS[settings.preset].title;
        }
        if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
        stopCountdown();
        GTO.AIPersonas.populateTableRoster(table, settings.preset, settings.stackMode);
        table.startHand();
        resetRenderCaches();
        updateTableView();
        if (table.actionSeat > 0) scheduleAiTurn();
        else if (table.actionSeat === 0) startCountdown();
      });
    }

    if (selStack) {
      selStack.addEventListener('change', () => {
        settings.stackMode = selStack.value;
        saveSettings(settings);
        if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
        stopCountdown();
        table = GTO.TableEngine.createTable({ stackMode: settings.stackMode });
        GTO.AIPersonas.populateTableRoster(table, settings.preset === 'custom' ? 'mixed' : settings.preset, settings.stackMode);
        table.startHand();
        resetRenderCaches();
        updateTableView();
        if (table.actionSeat > 0) scheduleAiTurn();
        else if (table.actionSeat === 0) startCountdown();
      });
    }

    if (chkHud) {
      chkHud.addEventListener('change', () => {
        settings.showHud = chkHud.checked;
        saveSettings(settings);
        prevSeatSigs = ['', '', '', '', '', ''];
        updateTableView();
      });
    }

    if (chkTimer) {
      chkTimer.addEventListener('change', () => {
        settings.useTimer = chkTimer.checked;
        saveSettings(settings);
        if (!settings.useTimer) stopCountdown();
        else if (table && table.actionSeat === 0 && table.street !== 'ended') startCountdown();
      });
    }

    if (chkHint) {
      chkHint.addEventListener('change', () => {
        settings.coachHint = chkHint.checked;
        saveSettings(settings);
        prevHintSig = '';
        updateCoachHintBox();
      });
    }

    if (chkAutoSkip) {
      chkAutoSkip.addEventListener('change', () => {
        settings.autoSkipFolded = chkAutoSkip.checked;
        saveSettings(settings);
      });
    }

    if (btnCustomSeat) {
      btnCustomSeat.addEventListener('click', openCustomSeatModal);
    }

    if (btnRebuy) {
      btnRebuy.addEventListener('click', () => {
        const added = table.rebuyHero();
        if (added > 0) {
          GTO.toast('已成功為你補滿至 100bb！', 'ok');
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
    const quickSizesEl = root.querySelector('#aabQuickSizes');
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

    if (quickSizesEl && aabSlider && aabInp) {
      quickSizesEl.addEventListener('click', (e) => {
        const b = e.target && e.target.closest ? e.target.closest('.quick-size-btn') : null;
        if (!b) return;
        const v = parseFloat(b.getAttribute('data-val'));
        aabSlider.value = v;
        aabInp.value = v;
        updateRaiseBtnLabel();
      });
    }

    if (btnSkipToNext) {
      btnSkipToNext.addEventListener('click', () => {
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
    if (!table) return;
    if (e.key === 'Escape') {
      const nWrap = document.getElementById('playerNoteModalWrap');
      const cWrap = document.getElementById('customSeatModalWrap');
      if (nWrap && nWrap.innerHTML) { nWrap.innerHTML = ''; return; }
      if (cWrap && cWrap.innerHTML) { cWrap.innerHTML = ''; return; }
    }
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    if (document.getElementById('searchOverlay')?.classList.contains('show')) return;
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
      handleHeroAction(legal.canCheck ? 'check' : (legal.canCall ? 'call' : 'fold'));
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      const legal = table.getLegalActions(0);
      if (legal.canBet || legal.canRaise) {
        const aabInp = document.getElementById('aabInp');
        handleHeroAction('raise', aabInp ? parseFloat(aabInp.value) : legal.minRaiseTo);
      }
    }
  }

  /** 記錄 Hero 的決策快照並應用動作 */
  function handleHeroAction(action, amount) {
    if (!table || table.actionSeat !== 0 || table.street === 'ended') return;
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

    // 若啟用「棄牌自動略過」且 Hero 剛蓋牌，直接無延遲跑完剩餘街道，不重複觸發更新與存檔
    if (action === 'fold' && settings.autoSkipFolded && table.street !== 'ended') {
      runRestOfHandInstantly();
      return;
    }

    if (table.street === 'ended') {
      onHandFinished();
    } else {
      updateTableView();
      if (table.actionSeat > 0) {
        scheduleAiTurn();
      } else if (table.actionSeat === 0) {
        startCountdown();
      }
    }
  }

  /** 排程 AI 對手行動 */
  function scheduleAiTurn() {
    if (aiTimer) clearTimeout(aiTimer);
    if (!table || table.actionSeat <= 0 || table.street === 'ended') return;

    isAiThinking = true;
    const seatId = table.actionSeat;
    const decision = GTO.AIPersonas.decideAiAction(table, seatId);

    // 若 Hero 已蓋牌，大幅壓縮延遲讓對戰更明快
    const heroFolded = table.seats[0].folded;
    const delay = heroFolded ? 220 : Math.max(240, Math.min(720, decision.delayMs || 520));

    aiTimer = setTimeout(() => {
      aiTimer = null;
      if (!table || table.street === 'ended') return;
      try {
        table.applyAction(seatId, decision.action, decision.targetAmount);
      } catch (e) {
        console.warn('AI 行動執行異常：', e);
      }
      isAiThinking = false;

      if (table.street === 'ended') {
        onHandFinished();
      } else {
        updateTableView();
        if (table.actionSeat > 0) {
          scheduleAiTurn();
        } else if (table.actionSeat === 0) {
          startCountdown();
        }
      }
    }, delay);
  }

  /** 一鍵立即快轉跑完該手 */
  function runRestOfHandInstantly() {
    if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
    let guard = 0;
    while (table && table.street !== 'ended' && guard < 120) {
      guard++;
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
    if (timerBar) {
      timerBar.style.width = '100%';
      timerBar.classList.remove('danger');
    }

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
        handleHeroAction(legal.canCheck ? 'check' : 'fold');
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    const timerWrap = document.getElementById('arenaTimerWrap');
    if (timerWrap) timerWrap.style.display = 'none';
  }

  /** 單手結束處理（單次渲染＋去重存檔） */
  function onHandFinished() {
    stopCountdown();
    if (table && table.currentHandRecord) {
      saveHandRecord(table.currentHandRecord);
    }
    updateTableView();

    // 更新覆盤按鈕上的失誤紅徽章
    const hands = loadSavedHands();
    const reviewCount = hands.filter((h) => h.hasMistake).length;
    const repBtn = document.getElementById('arenaReplayBtn');
    if (repBtn) {
      repBtn.innerHTML = '📜 <span class="at-btn-lbl">前往覆盤</span><span class="at-btn-short">覆盤</span>' +
        (reviewCount > 0 ? ' <span class="arena-cnt-badge">' + reviewCount + '</span>' : '');
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
      GTO.toast('已為你自動補滿 100bb 繼續實戰！', 'ok');
    }
    // 檢查 AI 籌碼並適當輪轉人員
    for (let i = 1; i < 6; i++) {
      if (table.seats[i].stack < 1.0 || (Math.random() < 0.05 && table.handNumber % 20 === 0)) {
        const keys = Object.keys(GTO.AIPersonas.AI_PERSONAS);
        const pKey = keys[Math.floor(Math.random() * keys.length)];
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
    prevTurnSig = '';
    prevHintSig = '';
    updateTableView();
    if (table.actionSeat > 0) scheduleAiTurn();
    else if (table.actionSeat === 0) startCountdown();
  }

  /** 差量更新牌桌 DOM 畫面（僅異動變更節點，完全不閃爍） */
  function updateTableView() {
    const potValEl = document.getElementById('arenaPotVal');
    const boardEl = document.getElementById('arenaBoard');
    const streetLbl = document.getElementById('arenaStreetLbl');
    const seatsEl = document.getElementById('arenaSeats');

    if (!potValEl || !boardEl || !seatsEl || !table) return;

    // 1. 街道標籤（僅變更時寫入）
    const streetZh = {
      preflop: 'PREFLOP · 翻牌前',
      flop: 'FLOP · 翻牌圈',
      turn: 'TURN · 轉牌圈',
      river: 'RIVER · 河牌圈',
      showdown: 'SHOWDOWN · 攤牌',
      ended: 'HAND COMPLETE',
    };
    const nextStreet = streetZh[table.street] || table.street;
    if (nextStreet !== prevStreetSig) {
      streetLbl.textContent = nextStreet;
      prevStreetSig = nextStreet;
    }

    // 2. 底池金額（僅變更時寫入）
    const nextPot = table.pot + ' BB';
    if (nextPot !== prevPotSig) {
      potValEl.textContent = nextPot;
      prevPotSig = nextPot;
    }

    // 3. 公共牌（固定 5 格，僅新發出的張數才更新該格 DOM）
    const slotEls = boardEl.children;
    for (let i = 0; i < 5; i++) {
      const cardCode = i < table.board.length ? table.board[i] : '';
      if (cardCode !== prevBoardSigs[i] && slotEls[i]) {
        prevBoardSigs[i] = cardCode;
        slotEls[i].innerHTML = cardCode
          ? GTO.cardsHtml([cardCode], 'md')
          : '<span class="board-slot-empty" aria-hidden="true"></span>';
      }
    }

    // 4. 6 席座位差量更新
    renderSeatsDiff(seatsEl);

    // 5. 操作列與教練提示更新
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

  function renderSeatsDiff(container) {
    const isShowdown = table.street === 'ended' || table.street === 'showdown';
    const notes = getNotesCached();
    const seatNodes = container.children;

    for (let idx = 0; idx < table.seats.length; idx++) {
      const s = table.seats[idx];
      const node = seatNodes[idx];
      if (!node) continue;

      const isTurn = table.actionSeat === idx && table.street !== 'ended';
      const isHero = s.isHero;
      const isD = table.dealerSeat === idx;
      const pos = s.position || '';
      const customNote = notes[s.name] || {};
      const tagKey = customNote.tag || '';
      const showFace = isHero || (isShowdown && !s.folded);
      const cardsKey = (!s.folded && s.holeCards && s.holeCards.length === 2)
        ? (showFace ? s.holeCards.join('') : 'back')
        : 'none';
      const vpip = (settings.showHud && !isHero && s.stats.hands > 0) ? Math.round((s.stats.vpipHands / s.stats.hands) * 100) : -1;
      const pfr = (vpip >= 0) ? Math.round((s.stats.pfrHands / s.stats.hands) * 100) : -1;
      const threeB = (vpip >= 0) ? Math.round((s.stats.threeBetHands / Math.max(1, s.stats.hands)) * 100) : -1;

      const sig = [
        isTurn ? 1 : 0, s.folded ? 1 : 0, s.allin ? 1 : 0, isD ? 1 : 0,
        pos, s.name, tagKey, customNote.note || '', s.stack,
        s.lastAction || '', s.timingTell || '', s.currentBet,
        cardsKey, vpip, pfr, threeB, s.stats.hands
      ].join('|');

      if (sig === prevSeatSigs[idx]) continue;
      prevSeatSigs[idx] = sig;

      const cls = [
        'arena-seat',
        'seat-' + idx,
        isHero ? 'hero-seat is-hero' : 'ai-seat',
        isTurn ? 'active-turn is-active' : '',
        s.folded ? 'folded is-folded' : '',
        s.allin ? 'allin' : '',
      ].filter(Boolean).join(' ');
      if (node.className !== cls) node.className = cls;

      const tagObj = GTO.AIPersonas.USER_TAGS.find((t) => t.key === tagKey) || GTO.AIPersonas.USER_TAGS[0];
      let cardsHtml = '';
      if (cardsKey !== 'none') {
        cardsHtml = cardsKey === 'back'
          ? '<span class="pcards">' + GTO.cardBackHtml('hole') + GTO.cardBackHtml('hole') + '</span>'
          : GTO.cardsHtml(s.holeCards, 'hole');
      }

      let hudHtml = '';
      if (vpip >= 0) {
        hudHtml = '<div class="arena-hud-pill" title="即時牌桌真實統計：VPIP% / PFR% / 3B% (樣本手數)">' +
          '<span>V:' + vpip + '%</span>' +
          '<span>P:' + pfr + '%</span>' +
          '<span class="hud-3b">3B:' + threeB + '%</span>' +
          '<small>(' + s.stats.hands + ')</small>' +
        '</div>';
      }

      const actTone = actionPillTone(s.lastAction);

      node.innerHTML =
        (cardsHtml ? '<div class="arena-seat-cards">' + cardsHtml + '</div>' : '') +
        '<div class="arena-seat-badge" ' + (!isHero ? 'data-edit-note="' + GTO.esc(s.name) + '" title="點擊貼標籤或記錄對手馬腳筆記"' : '') + '>' +
          '<div class="asb-top">' +
            (pos ? '<span class="asb-pos' + (isHero ? ' hero-pos' : '') + '">' + pos + '</span>' : '') +
            '<span class="asb-name">' + GTO.esc(s.name) + (tagKey ? ' <span class="asb-tag" title="' + GTO.esc(customNote.note || '') + '">' + tagObj.icon + '</span>' : '') + '</span>' +
          '</div>' +
          '<div class="asb-stack"><strong>' + s.stack + '</strong> BB</div>' +
        '</div>' +
        (s.lastAction ? '<div class="arena-action-bubble ' + actTone + '">' + (s.timingTell ? '<span class="tell">' + s.timingTell + '</span> ' : '') + GTO.esc(s.lastAction) + '</div>' : '') +
        (isD ? '<div class="arena-dealer-btn" title="莊家按鈕 (BTN)">D</div>' : '') +
        (s.currentBet > 0 ? '<div class="arena-bet-chip">' + s.currentBet + ' BB</div>' : '') +
        hudHtml;
    }
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
      const btnStarHand = document.getElementById('btnStarHand');
      const rec = table.currentHandRecord;
      if (btnStarHand && rec) {
        btnStarHand.textContent = rec.starred ? '⭐ 已收藏本手' : '☆ 收藏本手';
        btnStarHand.classList.toggle('primary', !!rec.starred);
      }
      if (resultText && rec && rec.winners) {
        const heroProfit = rec.netProfit ? rec.netProfit[0] || 0 : 0;
        const winStr = rec.winners.map((w) => GTO.esc(w.name) + '（+' + w.amount + 'bb）' + (w.handDesc ? ' · ' + GTO.esc(w.handDesc) : '')).join('、');
        let feedbackHtml = '';
        if (rec.heroDecisions && rec.heroDecisions.length > 0) {
          const lastDec = rec.heroDecisions[rec.heroDecisions.length - 1];
          if (lastDec.analysis) {
            feedbackHtml = ' <span class="badge ' + (lastDec.analysis.grade === 'best' || lastDec.analysis.grade === 'good' ? 'green' : 'red') + '">' +
              GTO.esc(lastDec.analysis.gradeLabel) + (lastDec.analysis.evLossBb > 0 ? ' (-' + lastDec.analysis.evLossBb + 'bb EV)' : '') + '</span>';
          }
        }
        resultText.innerHTML = '<b>🏆 獲勝：' + winStr + '</b> | 你的損益：<span class="' + (heroProfit >= 0 ? 'plus' : 'minus') + '">' +
          (heroProfit >= 0 ? '+' : '') + heroProfit + 'bb</span>' + feedbackHtml;
      }
    } else if (isHeroFolded) {
      aabFastForward.style.display = 'flex';
    } else if (isHeroTurn) {
      aabControls.style.display = 'flex';
      updateLegalButtons();
    } else {
      aabWait.style.display = 'block';
      const actorName = table.seats[table.actionSeat] ? table.seats[table.actionSeat].name : 'AI';
      aabWait.textContent = '輪到 ' + actorName + ' 思考行動中...';
    }
  }

  function updateLegalButtons() {
    const heroSeat = table.seats[0];
    const turnSig = [table.handNumber, table.street, table.currentBet, table.pot, heroSeat.stack, heroSeat.currentBet].join('|');
    if (turnSig === prevTurnSig) return;
    prevTurnSig = turnSig;

    const legal = table.getLegalActions(0);
    const actFoldBtn = document.getElementById('actFoldBtn');
    const actCheckBtn = document.getElementById('actCheckBtn');
    const actCallBtn = document.getElementById('actCallBtn');
    const actRaiseBtn = document.getElementById('actRaiseBtn');
    const actAllinBtn = document.getElementById('actAllinBtn');
    const aabSlider = document.getElementById('aabSlider');
    const aabInp = document.getElementById('aabInp');
    const quickSizesEl = document.getElementById('aabQuickSizes');
    const sliderRow = aabSlider ? aabSlider.closest('.aab-slider-row') : null;

    if (!actFoldBtn || !actCheckBtn || !actCallBtn || !actRaiseBtn || !actAllinBtn) return;

    const canRaiseOrBet = !!(legal.canBet || legal.canRaise);
    actFoldBtn.style.display = legal.canFold ? 'inline-flex' : 'none';
    actCheckBtn.style.display = legal.canCheck ? 'inline-flex' : 'none';
    actCallBtn.style.display = legal.canCall ? 'inline-flex' : 'none';
    actRaiseBtn.style.display = canRaiseOrBet ? 'inline-flex' : 'none';
    actAllinBtn.style.display = legal.maxRaiseTo > 0 ? 'inline-flex' : 'none';
    if (sliderRow) sliderRow.style.display = canRaiseOrBet ? 'flex' : 'none';
    if (quickSizesEl) quickSizesEl.style.display = canRaiseOrBet ? 'flex' : 'none';

    if (legal.canCall) {
      const isLimp = table.currentBet === 1.0 && table.street === 'preflop' && legal.callAmount === 1.0;
      actCallBtn.textContent = (isLimp ? '平跟 1bb (C)' : '跟注 ' + legal.callAmount + 'bb (C)');
    }

    // 快捷尺度按鈕與滑桿上下界
    if (canRaiseOrBet) {
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

      // 產生智慧快捷尺度鈕（事件已在 bindActionBarEvents 委派）
      if (quickSizesEl) {
        const quicks = [];
        if (table.street === 'preflop') {
          if (isBet) {
            quicks.push({ label: '2.5bb 標準', val: 2.5 });
            quicks.push({ label: '3.0bb 加大', val: 3.0 });
            quicks.push({ label: '4.0bb 隔離', val: 4.0 });
          } else {
            quicks.push({ label: '2.5x 小加', val: GTO.TableEngine.roundBb(table.currentBet * 2.5) });
            quicks.push({ label: '3.0x 標準3B', val: GTO.TableEngine.roundBb(table.currentBet * 3.0) });
            quicks.push({ label: '4.0x OOP3B', val: GTO.TableEngine.roundBb(table.currentBet * 4.0) });
          }
        } else {
          quicks.push({ label: '最小注', val: isBet ? 1.0 : minTo });
          quicks.push({ label: '33% 底池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 0.33) });
          quicks.push({ label: '50% 半池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 0.5) });
          quicks.push({ label: '75% 重注', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 0.75) });
          quicks.push({ label: '100% 滿池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 1.0) });
          quicks.push({ label: '150% 超池', val: GTO.TableEngine.roundBb(table.currentBet + table.pot * 1.5) });
        }
        quicks.push({ label: 'All-in', val: maxTo });

        quickSizesEl.innerHTML = quicks.map((q) => {
          const clamped = Math.max(minTo, Math.min(maxTo, q.val));
          return '<button type="button" class="btn-xs quick-size-btn" data-val="' + clamped + '">' + q.label + '</button>';
        }).join('');
      }
    }
  }

  function updateCoachHintBox() {
    const hintBox = document.getElementById('arenaHintBox');
    if (!hintBox) return;
    if (!settings.coachHint || table.actionSeat !== 0 || table.street === 'ended') {
      if (hintBox.style.display !== 'none') hintBox.style.display = 'none';
      prevHintSig = '';
      return;
    }

    const heroSeat = table.seats[0];
    const hintSig = [table.handNumber, table.street, table.pot, table.currentBet, heroSeat.currentBet, table.board.join('')].join('|');
    if (hintSig === prevHintSig) return;
    prevHintSig = hintSig;

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
        '<div><strong>♟️ GTO 建議：</strong>' + GTO.esc(analysis.gtoAdvice.action) + '（' + GTO.esc(analysis.gtoAdvice.reason) + '）</div>' +
        (analysis.exploitAdvice && analysis.exploitAdvice.reason ? '<div><strong>🎯 實戰剝削：</strong>' + GTO.esc(analysis.exploitAdvice.action) + '（' + GTO.esc(analysis.exploitAdvice.reason) + '）</div>' : '') +
      '</div>';
  }

  /** 玩家自訂對手標籤與筆記彈窗 */
  function openPlayerNoteModal(playerName) {
    const wrap = document.getElementById('playerNoteModalWrap');
    if (!wrap) return;
    const notes = getNotesCached();
    const cur = notes[playerName] || { tag: '', note: '' };

    wrap.innerHTML =
      '<div class="modal-backdrop" id="noteModalBackdrop">' +
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
    wrap.querySelector('#noteModalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'noteModalBackdrop') close(); });
    wrap.querySelector('#closeNoteModal').addEventListener('click', close);
    wrap.querySelector('#cancelNoteModal').addEventListener('click', close);
    wrap.querySelector('#saveNoteModal').addEventListener('click', () => {
      const text = wrap.querySelector('#playerNoteText').value;
      GTO.AIPersonas.savePlayerNote(playerName, selectedTag, text);
      getNotesCached(true);
      close();
      updateTableView();
      GTO.toast('已成功儲存牌手「' + playerName + '」的觀察筆記！', 'ok');
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
      '<div class="modal-backdrop" id="summaryModalBackdrop">' +
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

    const close = () => { wrap.innerHTML = ''; };
    wrap.querySelector('#summaryModalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'summaryModalBackdrop') close(); });
    wrap.querySelector('#closeSummaryModal').addEventListener('click', close);
    wrap.querySelector('#btnStayTable').addEventListener('click', close);
  }

  /** 自訂 5 位 AI 座位性格與籌碼彈窗 */
  function openCustomSeatModal() {
    const wrap = document.getElementById('customSeatModalWrap');
    if (!wrap || !table) return;
    const personas = GTO.AIPersonas.AI_PERSONAS;

    let rowsHtml = '';
    for (let i = 1; i < 6; i++) {
      const s = table.seats[i];
      rowsHtml += '<div class="csm-row">' +
        '<b class="csm-seat-lbl">座位 ' + i + ' · ' + GTO.esc(s.name) + '</b>' +
        '<div class="csm-controls">' +
          '<select class="inp sm-inp csm-persona" data-seat="' + i + '">' +
            Object.keys(personas).map((k) => '<option value="' + k + '" ' + (s.persona === k ? 'selected' : '') + '>' + personas[k].tagIcon + ' ' + personas[k].name + '</option>').join('') +
          '</select>' +
          '<label class="csm-stack-lbl">' +
            '<input type="number" class="inp sm-inp csm-stack" data-seat="' + i + '" value="' + s.stack + '" min="30" max="250" step="5" inputmode="numeric"><span>bb</span>' +
          '</label>' +
        '</div>' +
      '</div>';
    }

    wrap.innerHTML =
      '<div class="modal-backdrop" id="customSeatBackdrop">' +
        '<div class="modal-card custom-seat-modal">' +
          '<div class="modal-head">' +
            '<h3>⚙️ 自訂 5 位 AI 座位性格與籌碼</h3>' +
            '<button type="button" class="close-btn" id="closeCustomSeatTopBtn" aria-label="關閉">✕</button>' +
          '</div>' +
          '<div class="modal-body csm-body">' + rowsHtml + '</div>' +
          '<div class="modal-foot">' +
            '<button type="button" class="btn" id="closeCustomSeatBtn">取消</button>' +
            '<button type="button" class="btn primary" id="saveCustomSeatBtn">套用設定</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    const close = () => { wrap.innerHTML = ''; };
    wrap.querySelector('#customSeatBackdrop').addEventListener('click', (e) => { if (e.target.id === 'customSeatBackdrop') close(); });
    const closeBtn = wrap.querySelector('#closeCustomSeatBtn');
    if (closeBtn) closeBtn.addEventListener('click', close);
    const closeTopBtn = wrap.querySelector('#closeCustomSeatTopBtn');
    if (closeTopBtn) closeTopBtn.addEventListener('click', close);

    const saveBtn = wrap.querySelector('#saveCustomSeatBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        wrap.querySelectorAll('.csm-persona').forEach((sel) => {
          const seatId = parseInt(sel.dataset.seat, 10);
          const pKey = sel.value;
          table.seats[seatId].persona = pKey;
          table.seats[seatId].personaBadge = personas[pKey].badge || (personas[pKey].tagIcon + ' ' + personas[pKey].name);
        });
        wrap.querySelectorAll('.csm-stack').forEach((inp) => {
          const seatId = parseInt(inp.dataset.seat, 10);
          const val = Math.max(10, Math.min(500, parseFloat(inp.value) || 100.0));
          table.seats[seatId].stack = GTO.TableEngine.roundBb(val);
        });
        settings.preset = 'custom';
        saveSettings(settings);
        const selPreset = document.getElementById('arenaPresetSel');
        if (selPreset) selPreset.value = 'custom';
        const mobPreset = document.getElementById('arenaMobPreset');
        if (mobPreset) mobPreset.textContent = '⚙️ 自訂座位';
        close();
        prevSeatSigs = ['', '', '', '', '', ''];
        updateTableView();
        GTO.toast('已成功套用自訂座位性格與籌碼量！', 'ok');
      });
    }
  }

  GTO.ArenaUI = {
    renderPlayPage,
    teardownPlay,
    loadSavedHands,
    saveHandRecord,
  };
})();

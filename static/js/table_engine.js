/* GTO 撲克學院 — table_engine.js
 * 6-Max 無限注德州撲克（NLHE）常規桌完整規則狀態機
 * 支援 6 人座位（Hero 固定 seat 0）、莊家輪轉、盲注（0.5/1.0bb）、下注加注邊界、
 * 主邊池切分、籌碼守恆斷言、攤牌評估與快照還原（供覆盤室重打）。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  function roundBb(val) {
    return Math.round((Number(val) || 0) * 10) / 10;
  }

  const POSITION_NAMES_6MAX = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];

  /** 依在座未離席玩家數（2～6人）與莊家座位，計算各座位的標準位置名稱 */
  function assignPositions(seats, dealerSeat) {
    const active = [];
    for (let i = 0; i < 6; i++) {
      const idx = (dealerSeat + i) % 6;
      if (seats[idx] && !seats[idx].sittingOut && seats[idx].stack > 0) {
        active.push(idx);
      }
    }
    const posMap = {};
    const n = active.length;
    if (n === 2) {
      // 單挑（Heads-up）：BTN 同時為小盲 SB（翻前先動、翻後後動），另一位為大盲 BB
      posMap[active[0]] = 'BTN';
      posMap[active[1]] = 'BB';
    } else if (n === 3) {
      posMap[active[0]] = 'BTN';
      posMap[active[1]] = 'SB';
      posMap[active[2]] = 'BB';
    } else if (n === 4) {
      posMap[active[0]] = 'BTN';
      posMap[active[1]] = 'SB';
      posMap[active[2]] = 'BB';
      posMap[active[3]] = 'CO';
    } else if (n === 5) {
      posMap[active[0]] = 'BTN';
      posMap[active[1]] = 'SB';
      posMap[active[2]] = 'BB';
      posMap[active[3]] = 'UTG';
      posMap[active[4]] = 'CO';
    } else {
      // 6人標準
      const labels = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
      for (let i = 0; i < n; i++) {
        posMap[active[i]] = labels[i];
      }
    }
    return posMap;
  }

  /** 建立一張全新的 6-Max 撲克桌 */
  function createTable(options) {
    options = options || {};
    const stackMode = options.stackMode || 'realistic'; // realistic | 100bb
    const sbAmount = 0.5;
    const bbAmount = 1.0;

    const seats = [];
    for (let i = 0; i < 6; i++) {
      seats.push({
        id: i,
        name: i === 0 ? '你 (Hero)' : '牌手 ' + i,
        persona: i === 0 ? 'human' : 'mixed',
        personaBadge: i === 0 ? '👤 你' : '🤖 AI',
        isHero: i === 0,
        stack: 100.0,
        currentBet: 0.0,
        totalInvested: 0.0,
        holeCards: [],
        folded: false,
        allin: false,
        sittingOut: false,
        position: '',
        tilt: 0,
        timingTell: '',
        lastAction: '',
        lastActionDetails: null,
        userTag: '',
        userNote: '',
        stats: {
          hands: 0,
          vpipHands: 0,
          pfrHands: 0,
          threeBetHands: 0,
          threeBetOpps: 0,
          bets: 0,
          raises: 0,
          calls: 0,
        },
      });
    }

    let dealerSeat = 0;
    let street = 'ended'; // preflop | flop | turn | river | showdown | ended
    let board = [];
    let deck = [];
    let pot = 0.0;
    let currentBet = 0.0;
    let minRaiseIncrement = 1.0;
    let minRaiseTo = 2.0;
    let actionSeat = -1;
    let lastAggressor = -1;
    let totalTableChips = 600.0;
    let handNumber = 0;
    let currentHandRecord = null;
    let actedThisRound = new Set();
    let reopensAction = true;
    let preflopRaiseCount = 0;
    let limpersCount = 0;
    let openerPos = '';
    let threeBettorPos = '';
    let fourBettorPos = '';

    function resetBetsForStreet() {
      currentBet = 0.0;
      minRaiseIncrement = 1.0;
      minRaiseTo = 1.0;
      actedThisRound.clear();
      reopensAction = true;
      lastAggressor = -1;
      for (let i = 0; i < 6; i++) {
        if (seats[i]) {
          seats[i].currentBet = 0.0;
        }
      }
    }

    /** 找出下一個在座、未蓋牌、未全下的玩家 */
    function nextActiveSeat(fromSeat) {
      for (let i = 1; i <= 6; i++) {
        const s = (fromSeat + i) % 6;
        const seat = seats[s];
        if (seat && !seat.sittingOut && !seat.folded && !seat.allin && seat.stack > 0) {
          return s;
        }
      }
      return -1;
    }

    /** 計算尚未蓋牌的玩家數（包含 All-in） */
    function countUnfolded() {
      let cnt = 0;
      for (let i = 0; i < 6; i++) {
        if (seats[i] && !seats[i].sittingOut && !seats[i].folded) cnt++;
      }
      return cnt;
    }

    /** 計算尚未蓋牌且仍能行動（非 All-in、stack > 0）的玩家數 */
    function countCanAct() {
      let cnt = 0;
      for (let i = 0; i < 6; i++) {
        if (seats[i] && !seats[i].sittingOut && !seats[i].folded && !seats[i].allin && seats[i].stack > 0) {
          cnt++;
        }
      }
      return cnt;
    }

    /** 精確主池與邊池切分（依各玩家本手總投入 totalInvested） */
    function computeSidePots() {
      const active = seats.filter((s) => !s.sittingOut && s.totalInvested > 0);
      if (!active.length) return [];

      // 找出所有投入金額層級（由小到大排序）
      const levels = Array.from(new Set(active.map((s) => s.totalInvested))).sort((a, b) => a - b);
      const pots = [];
      let prevLevel = 0.0;

      for (let i = 0; i < levels.length; i++) {
        const curLevel = levels[i];
        const step = roundBb(curLevel - prevLevel);
        if (step <= 0) continue;

        let tierAmount = 0.0;
        const eligible = [];

        for (let j = 0; j < active.length; j++) {
          const s = active[j];
          if (s.totalInvested > prevLevel) {
            const contrib = Math.min(step, roundBb(s.totalInvested - prevLevel));
            tierAmount = roundBb(tierAmount + contrib);
            if (!s.folded) {
              eligible.push(s.id);
            }
          }
        }

        if (tierAmount > 0 && eligible.length > 0) {
          pots.push({
            amount: tierAmount,
            eligible: eligible,
          });
        }
        prevLevel = curLevel;
      }

      // 合併合格玩家名單完全相同的相鄰池
      const merged = [];
      for (let i = 0; i < pots.length; i++) {
        const p = pots[i];
        if (merged.length > 0) {
          const last = merged[merged.length - 1];
          const sameEligible = last.eligible.length === p.eligible.length &&
            last.eligible.every((id, idx) => id === p.eligible[idx]);
          if (sameEligible) {
            last.amount = roundBb(last.amount + p.amount);
            continue;
          }
        }
        merged.push(p);
      }
      return merged;
    }

    /** 斷言桌上籌碼守恆（誤差 <= 0.05bb） */
    function assertChipConservation() {
      let currentTotal = roundBb(pot);
      for (let i = 0; i < 6; i++) {
        currentTotal = roundBb(currentTotal + (seats[i] ? seats[i].stack : 0));
      }
      const diff = Math.abs(currentTotal - totalTableChips);
      if (diff > 0.08) {
        console.warn('籌碼守恆警告：開局=' + totalTableChips + '，當前總和=' + currentTotal + '（差額=' + diff + 'bb）');
      }
      return diff <= 0.08;
    }

    /** 開始全新一手牌 */
    function startHand() {
      handNumber++;
      // 輪轉莊家位
      let nextD = (dealerSeat + 1) % 6;
      while (seats[nextD].sittingOut || seats[nextD].stack < 1.0) {
        nextD = (nextD + 1) % 6;
        if (nextD === dealerSeat) break;
      }
      dealerSeat = nextD;

      // 指派位置
      const posMap = assignPositions(seats, dealerSeat);
      for (let i = 0; i < 6; i++) {
        seats[i].position = posMap[i] || '';
        seats[i].currentBet = 0.0;
        seats[i].totalInvested = 0.0;
        seats[i].holeCards = [];
        seats[i].folded = seats[i].sittingOut || seats[i].stack < 0.1;
        seats[i].allin = false;
        seats[i].timingTell = '';
        seats[i].lastAction = '';
        seats[i].lastActionDetails = null;
      }

      // 洗牌
      deck = GTO.shuffle ? GTO.shuffle(GTO.pk.fullDeck()) : GTO.pk.fullDeck();
      board = [];
      pot = 0.0;

      // 發底牌
      for (let i = 0; i < 6; i++) {
        if (!seats[i].folded) {
          seats[i].holeCards = [deck.pop(), deck.pop()];
          seats[i].stats.hands++;
        }
      }

      street = 'preflop';
      preflopRaiseCount = 0;
      limpersCount = 0;
      openerPos = '';
      threeBettorPos = '';
      fourBettorPos = '';
      for (let i = 0; i < 6; i++) {
        seats[i]._vpipThisHand = false;
        seats[i]._pfrThisHand = false;
        seats[i]._threeBetThisHand = false;
      }
      resetBetsForStreet();

      // 下小盲與大盲
      const activePositions = Object.keys(posMap).map(Number);
      let sbSeat = activePositions.find((id) => posMap[id] === 'SB');
      let bbSeat = activePositions.find((id) => posMap[id] === 'BB');

      if (sbSeat === undefined) sbSeat = activePositions[0];
      if (bbSeat === undefined) bbSeat = activePositions[1] !== undefined ? activePositions[1] : activePositions[0];

      // SB 投入
      const sbPost = Math.min(seats[sbSeat].stack, sbAmount);
      seats[sbSeat].stack = roundBb(seats[sbSeat].stack - sbPost);
      seats[sbSeat].currentBet = sbPost;
      seats[sbSeat].totalInvested = sbPost;
      if (seats[sbSeat].stack <= 0) seats[sbSeat].allin = true;
      pot = roundBb(pot + sbPost);

      // BB 投入
      const bbPost = Math.min(seats[bbSeat].stack, bbAmount);
      seats[bbSeat].stack = roundBb(seats[bbSeat].stack - bbPost);
      seats[bbSeat].currentBet = bbPost;
      seats[bbSeat].totalInvested = bbPost;
      if (seats[bbSeat].stack <= 0) seats[bbSeat].allin = true;
      pot = roundBb(pot + bbPost);

      currentBet = bbAmount;
      minRaiseIncrement = bbAmount;
      minRaiseTo = roundBb(currentBet + minRaiseIncrement);

      // 翻前起始行動位：BB 之後的下一位（6人桌為 UTG；單挑時 BTN 先動）
      actionSeat = nextActiveSeat(bbSeat);
      if (activePositions.length === 2) {
        actionSeat = sbSeat; // 單挑翻前 BTN/SB 先動
      }

      // 記錄起始總籌碼
      let sumChips = roundBb(pot);
      for (let i = 0; i < 6; i++) {
        sumChips = roundBb(sumChips + seats[i].stack);
      }
      totalTableChips = sumChips;

      // 初始化牌局紀錄
      currentHandRecord = {
        handId: 'hand-' + Date.now() + '-' + handNumber,
        handNumber: handNumber,
        timestamp: Date.now(),
        dealerSeat: dealerSeat,
        startingStacks: seats.map((s) => s.stack + s.totalInvested),
        seatPersonas: seats.map((s) => s.persona),
        seatNames: seats.map((s) => s.name),
        holeCards: seats.map((s) => s.holeCards ? s.holeCards.slice() : []),
        positions: Object.assign({}, posMap),
        actions: [],
        heroDecisions: [],
        board: [],
        pots: [],
        winners: [],
        netProfit: {},
      };

      assertChipConservation();
      return currentHandRecord;
    }

    /** 取得指定座位的合法動作清單 */
    function getLegalActions(seatId) {
      const s = seats[seatId];
      if (!s || s.folded || s.allin || s.stack <= 0 || seatId !== actionSeat) {
        return {
          canFold: false,
          canCheck: false,
          canCall: false,
          callAmount: 0,
          canBet: false,
          canRaise: false,
          minRaiseTo: 0,
          maxRaiseTo: 0,
          isAllin: s ? s.allin : false,
        };
      }

      const toCall = roundBb(currentBet - s.currentBet);
      const canCheck = toCall === 0;
      const canFold = toCall > 0;
      const canCall = toCall > 0 && s.stack > 0;
      const callAmount = Math.min(s.stack, toCall);

      // 下注（若當前街無人下注）或加注（若有人下注）
      const canBet = currentBet === 0 && s.stack > 0;
      const canRaise = currentBet > 0 && s.stack > toCall && !(actedThisRound.has(seatId) && !reopensAction);

      let minTo = 0;
      let maxTo = roundBb(s.stack + s.currentBet);

      if (canBet) {
        minTo = Math.min(maxTo, Math.max(1.0, minRaiseIncrement));
      } else if (canRaise) {
        minTo = Math.min(maxTo, roundBb(currentBet + minRaiseIncrement));
      }

      return {
        canFold,
        canCheck,
        canCall,
        callAmount,
        canBet,
        canRaise,
        minRaiseTo: minTo,
        maxRaiseTo: maxTo,
        isAllin: false,
      };
    }

    /** 執行指定動作 */
    function applyAction(seatId, action, targetAmount) {
      if (seatId !== actionSeat) {
        throw new Error('未輪到座位 ' + seatId + ' 行動（目前應由 ' + actionSeat + ' 行動）');
      }
      const s = seats[seatId];
      const legal = getLegalActions(seatId);
      targetAmount = roundBb(targetAmount || 0);

      const actionEv = {
        street,
        seat: seatId,
        position: s.position,
        isHero: s.isHero,
        name: s.name,
        action,
        amount: 0,
        potBefore: pot,
        stackBefore: s.stack,
        tell: s.timingTell || '',
      };

      if (action === 'fold') {
        s.folded = true;
        s.lastAction = '棄牌';
        actionEv.amount = 0;
      } else if (action === 'check') {
        if (!legal.canCheck) {
          // 不合法的過牌自動轉為跟注或棄牌保護
          return applyAction(seatId, legal.canCall ? 'call' : 'fold');
        }
        s.lastAction = '過牌';
        actionEv.amount = 0;
      } else if (action === 'call') {
        const pay = legal.callAmount;
        s.stack = roundBb(s.stack - pay);
        s.currentBet = roundBb(s.currentBet + pay);
        s.totalInvested = roundBb(s.totalInvested + pay);
        pot = roundBb(pot + pay);
        if (s.stack <= 0) s.allin = true;

        s.lastAction = (currentBet === 1.0 && street === 'preflop' && pay === 1.0) ? '平跟 1bb' : '跟注 ' + pay + 'bb';
        actionEv.amount = pay;

        // 統計 VPIP 與溜入
        if (street === 'preflop') {
          if (!s._vpipThisHand) {
            s.stats.vpipHands++;
            s._vpipThisHand = true;
          }
          if (preflopRaiseCount === 0 && s.position !== 'BB') {
            limpersCount++;
          }
        }
        s.stats.calls++;
      } else if (action === 'bet' || action === 'raise') {
        // 加注額必須符合範圍 [minRaiseTo, maxRaiseTo]
        let to = Math.max(legal.minRaiseTo, Math.min(legal.maxRaiseTo, targetAmount));
        to = roundBb(to);
        const pay = roundBb(to - s.currentBet);

        s.stack = roundBb(s.stack - pay);
        s.currentBet = to;
        s.totalInvested = roundBb(s.totalInvested + pay);
        pot = roundBb(pot + pay);
        if (s.stack <= 0) s.allin = true;

        const inc = roundBb(to - currentBet);
        if (inc >= minRaiseIncrement) {
          minRaiseIncrement = inc;
          reopensAction = true; // 完整加注重新開啟所有人之加注權
          actedThisRound.clear();
        } else {
          reopensAction = false; // 短碼 All-in 小加注不重新開啟已行動者
        }

        currentBet = to;
        minRaiseTo = roundBb(currentBet + minRaiseIncrement);
        lastAggressor = seatId;

        s.lastAction = (action === 'bet' ? '下注 ' : '加注至 ') + to + 'bb';
        actionEv.amount = to;

        if (street === 'preflop') {
          if (!s._vpipThisHand) {
            s.stats.vpipHands++;
            s._vpipThisHand = true;
          }
          if (!s._pfrThisHand) {
            s.stats.pfrHands++;
            s._pfrThisHand = true;
          }
          preflopRaiseCount++;
          if (preflopRaiseCount === 1) {
            openerPos = s.position || '';
          } else if (preflopRaiseCount === 2) {
            threeBettorPos = s.position || '';
            if (!s._threeBetThisHand) {
              s.stats.threeBetHands++;
              s._threeBetThisHand = true;
            }
          } else if (preflopRaiseCount === 3) {
            fourBettorPos = s.position || '';
          }
        }
        if (action === 'bet') s.stats.bets++; else s.stats.raises++;
      } else if (action === 'allin') {
        const to = legal.maxRaiseTo;
        return applyAction(seatId, currentBet === 0 ? 'bet' : 'raise', to);
      }

      s.lastActionDetails = actionEv;
      actedThisRound.add(seatId);
      if (currentHandRecord) currentHandRecord.actions.push(actionEv);

      assertChipConservation();

      // 檢查是否只剩一人未蓋牌（直接獲勝）
      if (countUnfolded() <= 1) {
        concludeHandEarly();
        return;
      }

      // 檢查當前街是否下注完成
      if (isStreetBettingComplete()) {
        advanceStreet();
      } else {
        actionSeat = nextActiveSeat(actionSeat);
      }
    }

    /** 判斷當前回合（街）的下注是否已完全結束 */
    function isStreetBettingComplete() {
      // 能行動的人少於 2 人，且未蓋牌的人投入金額皆已齊平
      let maxBet = 0.0;
      for (let i = 0; i < 6; i++) {
        if (seats[i] && !seats[i].sittingOut && !seats[i].folded) {
          if (seats[i].currentBet > maxBet) maxBet = seats[i].currentBet;
        }
      }

      for (let i = 0; i < 6; i++) {
        const s = seats[i];
        if (s && !s.sittingOut && !s.folded && !s.allin && s.stack > 0) {
          // 若還沒在本街行動過，或者跟注額未齊平，表示尚未結束
          if (!actedThisRound.has(i) || s.currentBet < maxBet) {
            return false;
          }
        }
      }
      return true;
    }

    /** 推進到下一街（Flop → Turn → River → Showdown） */
    function advanceStreet() {
      resetBetsForStreet();

      if (street === 'preflop') {
        street = 'flop';
        // 發 3 張翻牌
        board.push(deck.pop(), deck.pop(), deck.pop());
      } else if (street === 'flop') {
        street = 'turn';
        // 發 1 張轉牌
        board.push(deck.pop());
      } else if (street === 'turn') {
        street = 'river';
        // 發 1 張河牌
        board.push(deck.pop());
      } else if (street === 'river') {
        street = 'showdown';
        resolveShowdown();
        return;
      }

      if (currentHandRecord) currentHandRecord.board = board.slice();

      // 若所有仍未蓋牌的玩家都已 All-in，或只剩 1 人未 All-in（無人能加注），自動開完後面的牌
      if (countCanAct() <= 1) {
        while (street !== 'river' && street !== 'showdown') {
          advanceStreet();
        }
        if (street === 'river') {
          advanceStreet(); // 進入 showdown
        }
        return;
      }

      // 翻後行動順序：莊家按鈕後的第一位在座、未蓋牌、未全下玩家（通常為 SB / BB）
      actionSeat = nextActiveSeat(dealerSeat);
    }

    /** 僅剩一人未蓋牌時提前結算底池 */
    function concludeHandEarly() {
      const winner = seats.find((s) => !s.sittingOut && !s.folded);
      if (!winner) return;

      street = 'ended';
      actionSeat = -1;

      // 將底池全數給予唯一的贏家
      winner.stack = roundBb(winner.stack + pot);
      const wonAmount = pot;
      pot = 0.0;

      if (currentHandRecord) {
        currentHandRecord.board = board.slice();
        currentHandRecord.winners = [{
          seat: winner.id,
          name: winner.name,
          amount: wonAmount,
          handDesc: '對手全數棄牌獲勝',
          bestFive: null,
        }];
        for (let i = 0; i < 6; i++) {
          const s = seats[i];
          const starting = currentHandRecord.startingStacks[i];
          currentHandRecord.netProfit[i] = roundBb(s.stack - starting);
        }
      }
      // 動態上頭 (Tilt) 更新
      updateAITilts();
      assertChipConservation();
    }

    /** 攤牌比牌與切分邊池 */
    function resolveShowdown() {
      street = 'ended';
      actionSeat = -1;
      const pots = computeSidePots();
      const results = {};

      // 評估所有走到攤牌的玩家手牌
      for (let i = 0; i < 6; i++) {
        const s = seats[i];
        if (s && !s.sittingOut && !s.folded && s.holeCards.length === 2 && board.length === 5) {
          const evalRes = GTO.pk.bestFive(s.holeCards.concat(board));
          results[i] = evalRes;
        }
      }

      const winnersSummary = [];

      // 逐個主/邊池分錢
      for (let pIdx = 0; pIdx < pots.length; pIdx++) {
        const p = pots[pIdx];
        // 若僅一人具備資格，代表為未跟注超額籌碼退回，不列入獲勝摘要
        if (p.eligible.length === 1) {
          const refundSeat = seats[p.eligible[0]];
          refundSeat.stack = roundBb(refundSeat.stack + p.amount);
          continue;
        }
        let bestScore = -1;
        let potWinners = [];

        for (let i = 0; i < p.eligible.length; i++) {
          const seatId = p.eligible[i];
          const res = results[seatId];
          if (!res) continue;
          if (res.score > bestScore) {
            bestScore = res.score;
            potWinners = [seatId];
          } else if (res.score === bestScore) {
            potWinners.push(seatId);
          }
        }

        if (potWinners.length > 0) {
          const splitAmount = roundBb(p.amount / potWinners.length);
          for (let w = 0; w < potWinners.length; w++) {
            const wSeat = seats[potWinners[w]];
            wSeat.stack = roundBb(wSeat.stack + splitAmount);
            winnersSummary.push({
              seat: wSeat.id,
              name: wSeat.name,
              amount: splitAmount,
              potIndex: pIdx,
              handDesc: results[wSeat.id] ? results[wSeat.id].desc : '',
              bestFive: results[wSeat.id] ? results[wSeat.id].five : null,
            });
          }
        }
      }

      pot = 0.0;

      if (currentHandRecord) {
        currentHandRecord.board = board.slice();
        currentHandRecord.pots = pots;
        currentHandRecord.winners = winnersSummary;
        for (let i = 0; i < 6; i++) {
          const s = seats[i];
          const starting = currentHandRecord.startingStacks[i];
          currentHandRecord.netProfit[i] = roundBb(s.stack - starting);
        }
      }

      // 動態上頭 (Tilt) 更新
      updateAITilts();
      assertChipConservation();
    }

    /** 每手結束更新 AI 上頭情緒 */
    function updateAITilts() {
      for (let i = 0; i < 6; i++) {
        const s = seats[i];
        if (!s || s.isHero) continue;
        const pKey = s.persona || 'station';
        const pDef = (GTO.AIPersonas && GTO.AIPersonas.AI_PERSONAS && GTO.AIPersonas.AI_PERSONAS[pKey]) || {};
        const susc = pDef.tiltSusceptibility !== undefined ? pDef.tiltSusceptibility : 0.6;

        // 自然衰減
        s.tilt = Math.max(0, Math.round((s.tilt || 0) * 0.8));

        // 淨虧損大於等於 15bb 激發上頭
        if (currentHandRecord && currentHandRecord.netProfit) {
          const net = currentHandRecord.netProfit[i] || 0;
          if (net <= -15.0) {
            const added = Math.round(Math.abs(net) * susc * 0.85);
            s.tilt = Math.min(100, (s.tilt || 0) + added);
          }
        }
        s.isTilted = (s.tilt >= 35);
      }
    }

    /** 建立可序列化的完整牌桌快照（供覆盤室重打） */
    function cloneTableState() {
      return {
        stackMode,
        dealerSeat,
        street,
        board: board.slice(),
        deck: deck.slice(),
        pot,
        currentBet,
        minRaiseIncrement,
        minRaiseTo,
        actionSeat,
        lastAggressor,
        totalTableChips,
        handNumber,
        preflopRaiseCount,
        limpersCount,
        openerPos,
        threeBettorPos,
        fourBettorPos,
        actedThisRound: Array.from(actedThisRound),
        seats: seats.map((s) => ({
          id: s.id,
          name: s.name,
          persona: s.persona,
          personaBadge: s.personaBadge,
          isHero: s.isHero,
          stack: s.stack,
          currentBet: s.currentBet,
          totalInvested: s.totalInvested,
          holeCards: s.holeCards.slice(),
          folded: s.folded,
          allin: s.allin,
          sittingOut: s.sittingOut,
          position: s.position,
          tilt: s.tilt,
          timingTell: s.timingTell,
          lastAction: s.lastAction,
          userTag: s.userTag,
          userNote: s.userNote,
          stats: Object.assign({}, s.stats),
        })),
        handRecord: JSON.parse(JSON.stringify(currentHandRecord || {})),
      };
    }

    /** 從快照還原牌桌狀態（供覆盤室重打） */
    function restoreTableState(snap) {
      if (!snap) return;
      dealerSeat = snap.dealerSeat;
      street = snap.street;
      board = (snap.board || []).slice();
      deck = (snap.deck || []).slice();
      pot = snap.pot || 0.0;
      currentBet = snap.currentBet || 0.0;
      minRaiseIncrement = snap.minRaiseIncrement || 1.0;
      minRaiseTo = snap.minRaiseTo || 2.0;
      actionSeat = snap.actionSeat !== undefined ? snap.actionSeat : -1;
      lastAggressor = snap.lastAggressor !== undefined ? snap.lastAggressor : -1;
      totalTableChips = snap.totalTableChips || 600.0;
      handNumber = snap.handNumber || 1;
      preflopRaiseCount = snap.preflopRaiseCount || 0;
      limpersCount = snap.limpersCount || 0;
      openerPos = snap.openerPos || '';
      threeBettorPos = snap.threeBettorPos || '';
      fourBettorPos = snap.fourBettorPos || '';
      actedThisRound = new Set(snap.actedThisRound || []);

      if (Array.isArray(snap.seats)) {
        for (let i = 0; i < 6; i++) {
          if (snap.seats[i]) {
            Object.assign(seats[i], snap.seats[i]);
            seats[i].holeCards = (snap.seats[i].holeCards || []).slice();
          }
        }
      }
      currentHandRecord = snap.handRecord ? JSON.parse(JSON.stringify(snap.handRecord)) : null;
      assertChipConservation();
    }

    /** 補滿 Hero 籌碼至 100bb */
    function rebuyHero() {
      if (seats[0] && seats[0].stack < 100.0) {
        const added = roundBb(100.0 - seats[0].stack);
        seats[0].stack = 100.0;
        totalTableChips = roundBb(totalTableChips + added);
        return added;
      }
      return 0;
    }

    return {
      seats,
      get dealerSeat() { return dealerSeat; },
      get street() { return street; },
      get board() { return board; },
      get pot() { return pot; },
      get currentBet() { return currentBet; },
      get minRaiseTo() { return minRaiseTo; },
      get minRaiseIncrement() { return minRaiseIncrement; },
      get actionSeat() { return actionSeat; },
      get handNumber() { return handNumber; },
      get totalTableChips() { return totalTableChips; },
      get currentHandRecord() { return currentHandRecord; },
      get preflopRaiseCount() { return preflopRaiseCount; },
      get limpersCount() { return limpersCount; },
      get openerPos() { return openerPos; },
      get threeBettorPos() { return threeBettorPos; },
      get fourBettorPos() { return fourBettorPos; },
      startHand,
      getLegalActions,
      applyAction,
      computeSidePots,
      cloneTableState,
      restoreTableState,
      rebuyHero,
      assertChipConservation,
    };
  }

  GTO.TableEngine = {
    createTable,
    roundBb,
    assignPositions,
    POSITION_NAMES_6MAX,
  };
})();

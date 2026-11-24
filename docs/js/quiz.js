/* GTO 撲克學院 — quiz.js
 * 七大無限隨機測驗練習引擎：
 *   1. preflop — 6-Max 翻前牌桌實戰模擬（RFI / 面對開池 / 被 3-Bet / 面對 4-Bet）
 *   2. paint   — 13×13 範圍記憶填色挑戰（支援滑鼠拖曳塗色與即時批改）
 *   3. theory  — GTO 理論觀念隨機測驗（24 主題題庫 + 動態策略比較題）
 *   4. math    — 撲克數學即時隨機計算題（底池賠率 / MDF / Alpha / 詐唬比 / Outs / EV / SPR / 組合數）
 *   5. terms   — 撲克術語隨機快問快答（中英術語 ↔ 定義雙向隨機抽考）
 *   6. equity  — 翻前/翻後勝率直覺訓練（即時 Monte Carlo 模擬對決）
 *   7. mix     — 綜合隨機特訓（全題型混合無限刷題）
 *   + drills.js 新手入門練習：showdown 誰贏了 / handname 牌型辨識 / outs 數 Outs / position 位置與順序
 *   #/quiz（無子路由）為練習中心首頁 renderPracticeHub。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  const QUIZ_GROUPS = [
    { id: 'beginner', icon: '🐣', title: '新手入門', sub: '先把牌型、比牌、位置和 Outs 練到直覺反應' },
    { id: 'preflop', icon: '🃏', title: '翻前範圍', sub: '6 人桌各位置該加注、跟注還是棄牌' },
    { id: 'postflop', icon: '🎯', title: '翻後決策', sub: '真實情境：C-Bet、防守、轉牌開火、河牌價值與抓詐' },
    { id: 'gto', icon: '♟️', title: 'GTO 觀念與數學', sub: '理論、賠率計算、勝率直覺與術語' },
    { id: 'mix', icon: '⚡', title: '綜合挑戰', sub: '所有題型混在一起，無限刷題' },
  ];
  const QUIZ_MODES = Object.keys(GTO.DRILLS || {}).map((id) => ({
    id, icon: GTO.DRILLS[id].icon, title: GTO.DRILLS[id].title, sub: GTO.DRILLS[id].sub, group: GTO.DRILLS[id].group || 'beginner',
  })).concat([
    { id: 'preflop', icon: '♠️', title: '翻前決策', sub: '看位置與前面動作，選加注 / 跟注 / 棄牌', group: 'preflop' },
    { id: 'paint', icon: '🎨', title: '範圍默寫', sub: '在 13×13 表上塗出正確的開池範圍', group: 'preflop' },
    { id: 'theory', icon: '📚', title: 'GTO 理論測驗', sub: '各課觀念題隨機抽考', group: 'gto' },
    { id: 'math', icon: '🧮', title: '撲克數學', sub: '底池賠率、MDF、Alpha、EV 動態計算', group: 'gto' },
    { id: 'equity', icon: '📊', title: '勝率直覺', sub: '猜猜這手牌對決的勝率是多少', group: 'gto' },
    { id: 'terms', icon: '🔤', title: '術語快問', sub: '撲克術語與定義隨機配對', group: 'gto' },
    { id: 'mix', icon: '⚡', title: '綜合隨機', sub: '新手題、翻前、理論、數學全混合', group: 'mix' },
  ]);

  // 當前練習階段統計（不影響全域持久化統計，方便隨時看本次手感）
  const session = {
    mode: 'preflop',
    catFilter: 'all',     // all | rfi | vsrfi | vs3bet | vs4bet
    heroFilter: 'all',    // all | UTG | HJ | CO | BTN | SB | BB
    scenarioFilter: '',   // 指定單一 scenario id
    sampling: 'focus',    // focus（邊緣牌強化） | random（完全隨機）
    simpleJudge: false,   // true = 簡易純策略判定；false = GTO 混合寬容判定
    topicFilter: 'all',
    lvFilter: 0,
    mathFilter: 'all',
    streak: 0,
    total: 0,
    correct: 0,
    currentQ: null,
    answered: false,
    recentIds: [],
  };

  function rememberId(id, maxLen) {
    session.recentIds.push(id);
    if (session.recentIds.length > (maxLen || 25)) session.recentIds.shift();
  }

  // ===========================================================================
  // 輔助：從 169 手牌中依「邊緣牌強化」或「純隨機」抽出一手牌（快取每個情境的鄰格邊界權重）
  // ===========================================================================
  function ensureScenarioSampleCache(sc) {
    if (sc._inBaseHands) return;
    sc._inBaseHands = GTO.HANDS.filter((h) => sc.cells[h].inBase);
    const edgeW = Object.create(null);
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const h of sc._inBaseHands) {
      const cell = sc.cells[h];
      if (cell.primary === 0.5 || cell.call === 0.5) {
        edgeW[h] = 6.0;
      } else {
        const info = GTO.HAND_INFO[h];
        let diffNeighbor = false;
        for (const [dr, dc] of dirs) {
          const nr = info.r + dr, nc = info.c + dc;
          if (nr >= 0 && nr < 13 && nc >= 0 && nc < 13) {
            const nh = GTO.HANDS[nr * 13 + nc];
            if (sc.cells[nh].inBase && sc.cells[nh].simple !== cell.simple) {
              diffNeighbor = true;
              break;
            }
          }
        }
        edgeW[h] = diffNeighbor ? 3.5 : 0.45;
      }
    }
    sc._edgeW = edgeW;
  }

  function sampleHandForScenario(sc, samplingMode) {
    ensureScenarioSampleCache(sc);
    const candidates = sc._inBaseHands;
    if (samplingMode === 'random') {
      return GTO.weightedPick(candidates, (h) => GTO.HAND_INFO[h].combos);
    }
    const missedMap = (GTO.progress.preflop && GTO.progress.preflop.missed) || {};
    const edgeW = sc._edgeW;
    return GTO.weightedPick(candidates, (h) => {
      let w = edgeW[h];
      const missCnt = missedMap[sc.id + ':' + h] || 0;
      if (missCnt > 0) w += Math.min(8, missCnt * 2.5);
      return w;
    });
  }

  function pickPreflopScenario() {
    if (session.scenarioFilter && GTO.SCENARIOS[session.scenarioFilter]) {
      return GTO.SCENARIOS[session.scenarioFilter];
    }
    let list = GTO.SCENARIO_LIST.filter((s) => {
      if (session.catFilter !== 'all' && s.cat !== session.catFilter) return false;
      if (session.heroFilter !== 'all' && s.hero !== session.heroFilter) return false;
      return true;
    });
    if (!list.length) list = GTO.SCENARIO_LIST;
    return GTO.pick(list);
  }

  // ===========================================================================
  // 產生一題「翻前牌桌實戰題」
  // ===========================================================================
  function generatePreflopQuestion(forcedScenario, forcedHand) {
    const sc = forcedScenario || pickPreflopScenario();
    const hand = forcedHand || sampleHandForScenario(sc, session.sampling);
    const cards = GTO.randomCombo(hand);

    // 決定可用的行動按鈕
    const actions = [sc.primaryAction];
    if (sc.secondaryAction) actions.push(sc.secondaryAction);
    actions.push('fold');

    // 描述桌面行動歷史
    let situationDesc = '';
    if (sc.cat === 'rfi') {
      situationDesc = '前面所有玩家棄牌到你（<strong>' + sc.hero + ' ' + GTO.POS_ZH[sc.hero] + '</strong>），輪到你決定是否開池加注（標準尺度 <strong>' + sc.openSize + '</strong>）：';
    } else if (sc.cat === 'vsrfi') {
      situationDesc = '<strong>' + sc.villain + '（' + GTO.POS_ZH[sc.villain] + '）</strong>率先開池加注到 <strong>' + (sc.villain === 'SB' ? '3.0bb' : '2.5bb') + '</strong>，中間玩家棄牌，輪到你在 <strong>' + sc.hero + '（' + GTO.POS_ZH[sc.hero] + '）</strong>行動：';
    } else if (sc.cat === 'vs3bet') {
      const myOpen = sc.hero === 'SB' ? '3.0bb' : '2.5bb';
      const v3b = sc.openSize.match(/面臨\s*([\d.]+bb)/) ? RegExp.$1 : '7.5bb';
      situationDesc = '你在 <strong>' + sc.hero + '（' + GTO.POS_ZH[sc.hero] + '）</strong>開池 <strong>' + myOpen + '</strong>，遭到 <strong>' + sc.villain + '（' + GTO.POS_ZH[sc.villain] + '）3-Bet 到 ' + v3b + '</strong>，其他人棄牌，輪到你應對：';
    } else {
      const v4b = sc.openSize.match(/面臨\s*([\d.]+bb)/) ? RegExp.$1 : '21bb';
      situationDesc = '你在 <strong>' + sc.hero + '（' + GTO.POS_ZH[sc.hero] + '）</strong>進行 3-Bet 後，遭到開池者 <strong>' + sc.villain + '（' + GTO.POS_ZH[sc.villain] + '）4-Bet 到 ' + v4b + '</strong>，輪到你應對：';
    }

    return {
      kind: 'preflop',
      sc,
      hand,
      cards,
      actions,
      situationDesc,
    };
  }

  // ===========================================================================
  // 產生一題「撲克數學動態隨機計算題」（7 種題型，每次隨機數字）
  // ===========================================================================
  function makeNumericOptions(correctVal, unit, stepCandidates, minVal, maxVal, decimals) {
    const d = decimals == null ? 1 : decimals;
    const fmt = (v) => GTO.fmtNum(v, d) + (unit || '');
    const correctStr = fmt(correctVal);
    const set = new Set([correctStr]);
    const pool = GTO.shuffle(stepCandidates);
    for (const delta of pool) {
      if (set.size >= 4) break;
      const cand = correctVal + delta;
      if (cand <= (minVal == null ? 0 : minVal) || (maxVal != null && cand >= maxVal)) continue;
      set.add(fmt(cand));
    }
    while (set.size < 4) {
      const cand = Math.max(minVal || 1, Math.min(maxVal || 95, correctVal + (GTO.randInt(11) - 5) * 3.5));
      set.add(fmt(cand));
    }
    const opts = GTO.shuffle(Array.from(set));
    return { opts, ans: opts.indexOf(correctStr) };
  }

  function generateMathQuestion() {
    const types = ['pot-odds', 'mdf', 'alpha', 'bluff-ratio', 'outs', 'ev', 'combos-spr'];
    const sub = session.mathFilter !== 'all' ? session.mathFilter : GTO.pick(types);

    if (sub === 'pot-odds') {
      const cases = [
        { pot: 60, bet: 20 }, { pot: 60, bet: 30 }, { pot: 80, bet: 40 },
        { pot: 90, bet: 30 }, { pot: 100, bet: 25 }, { pot: 100, bet: 50 },
        { pot: 100, bet: 75 }, { pot: 100, bet: 100 }, { pot: 100, bet: 150 },
        { pot: 100, bet: 200 }, { pot: 50, bet: 25 }, { pot: 120, bet: 60 },
        { pot: 40, bet: 40 }, { pot: 80, bet: 120 }
      ];
      const c = GTO.pick(cases);
      const totalPot = c.pot + c.bet + c.bet;
      const req = (c.bet / totalPot) * 100;
      const { opts, ans } = makeNumericOptions(req, '%', [-8.3, -5, 5, 6.7, 8.3, 10, 12.5, -10], 5, 75, 1);
      return {
        kind: 'mcq',
        mode: 'math',
        badge: '🧮 底池賠率計算',
        q: '目前底池為 ' + c.pot + 'bb，對手下注 ' + c.bet + 'bb（約 ' + Math.round((c.bet / c.pot) * 100) + '% 底池）。請問你跟注 ' + c.bet + 'bb 所需的最低必要勝率（Required Equity）是多少？',
        opts,
        ans,
        exp: '公式：必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）= ' + c.bet + ' ÷ (' + c.pot + ' + ' + c.bet + ' + ' + c.bet + ') = ' + c.bet + ' ÷ ' + totalPot + ' = ' + GTO.fmtNum(req, 1) + '%。'
      };
    }

    if (sub === 'mdf') {
      const sizings = [
        { label: '25% 底池（1/4 Pot）', p: 100, b: 25 },
        { label: '33.3% 底池（1/3 Pot）', p: 90, b: 30 },
        { label: '50% 底池（1/2 Pot）', p: 80, b: 40 },
        { label: '66.7% 底池（2/3 Pot）', p: 90, b: 60 },
        { label: '75% 底池（3/4 Pot）', p: 80, b: 60 },
        { label: '100% 底池（1 倍滿池）', p: 100, b: 100 },
        { label: '150% 底池（1.5 倍超池）', p: 100, b: 150 },
        { label: '200% 底池（2 倍超池）', p: 100, b: 200 },
      ];
      const s = GTO.pick(sizings);
      const mdf = (s.p / (s.p + s.b)) * 100;
      const { opts, ans } = makeNumericOptions(mdf, '%', [-16.7, -10, -7.5, 6.7, 10, 13.3, 16.7], 15, 92, 1);
      return {
        kind: 'mcq',
        mode: 'math',
        badge: '🛡️ MDF 最小防守頻率',
        q: '底池 ' + s.p + 'bb，對手下注 ' + s.b + 'bb（' + s.label + '）。為阻止對手用任意空氣牌無腦詐唬獲利，你的最小防守頻率（MDF）是多少？',
        opts,
        ans,
        exp: '公式：MDF = 原底池 ÷（原底池 + 下注額）= ' + s.p + ' ÷ (' + s.p + ' + ' + s.b + ') = ' + GTO.fmtNum(mdf, 1) + '%（對手純詐唬的 Alpha 則為 ' + GTO.fmtNum(100 - mdf, 1) + '%）。'
      };
    }

    if (sub === 'alpha') {
      const sizings = [
        { p: 100, b: 25 }, { p: 90, b: 30 }, { p: 100, b: 50 }, { p: 90, b: 60 },
        { p: 100, b: 75 }, { p: 100, b: 100 }, { p: 80, b: 120 }, { p: 100, b: 200 }
      ];
      const s = GTO.pick(sizings);
      const alpha = (s.b / (s.p + s.b)) * 100;
      const { opts, ans } = makeNumericOptions(alpha, '%', [-12.5, -8.3, 6.7, 10, 12.5, 16.7], 10, 88, 1);
      return {
        kind: 'mcq',
        mode: 'math',
        badge: '🎯 Alpha 詐唬成功率',
        q: '河牌底池 ' + s.p + 'bb，你拿一手 0% 攤牌勝率的空氣牌準備下注 ' + s.b + 'bb 純詐唬。請問對手至少要棄牌幾 %（Alpha），這筆純詐唬才會直接回本（0 EV）？',
        opts,
        ans,
        exp: '公式：Alpha (α) = 下注額 ÷（原底池 + 下注額）= ' + s.b + ' ÷ (' + s.p + ' + ' + s.b + ') = ' + GTO.fmtNum(alpha, 1) + '%。只要對手棄牌率高於 ' + GTO.fmtNum(alpha, 1) + '%，這筆純詐唬就是正 EV！'
      };
    }

    if (sub === 'bluff-ratio') {
      const sizings = [
        { label: '25% 底池（1/4 Pot）', b: 0.25, ratio: '5 : 1' },
        { label: '33.3% 底池（1/3 Pot）', b: 1 / 3, ratio: '4 : 1' },
        { label: '50% 底池（1/2 Pot）', b: 0.5, ratio: '3 : 1' },
        { label: '66.7% 底池（2/3 Pot）', b: 2 / 3, ratio: '2.5 : 1' },
        { label: '75% 底池（3/4 Pot）', b: 0.75, ratio: '2.33 : 1' },
        { label: '100% 底池（1 倍滿池）', b: 1.0, ratio: '2 : 1' },
        { label: '150% 底池（1.5 倍超池）', b: 1.5, ratio: '1.67 : 1' },
        { label: '200% 底池（2 倍超池）', b: 2.0, ratio: '1.5 : 1' },
      ];
      const s = GTO.pick(sizings);
      const bluffPct = (s.b / (1 + 2 * s.b)) * 100;
      const { opts, ans } = makeNumericOptions(bluffPct, '%', [-10, -5, 5, 8.3, 12.5, 16.7], 10, 65, 1);
      return {
        kind: 'mcq',
        mode: 'math',
        badge: '⚖️ 河牌最佳詐唬比例',
        q: '你在河牌圈使用極化範圍下注「' + s.label + '」。為了讓對手的抓詐牌無差異，你的下注範圍中「詐唬牌應佔總下注範圍的幾 %」？',
        opts,
        ans,
        exp: '河牌詐唬佔比 = 對手的必要勝率 = B ÷ (P + 2B) = ' + GTO.fmtNum(bluffPct, 1) + '%，對應的「價值 : 詐唬」組合比為 ' + s.ratio + '。'
      };
    }

    if (sub === 'outs') {
      const draws = [
        { name: '口袋對子抽暗三條（Set）', outs: 2, exactTurn: 4.3, exactRiver: 8.4 },
        { name: '內聽順 / 卡順（Gutshot）', outs: 4, exactTurn: 8.7, exactRiver: 16.5 },
        { name: '兩張高牌抽頂對（Overcards）', outs: 6, exactTurn: 13.0, exactRiver: 24.1 },
        { name: '兩頭順聽牌（OESD）', outs: 8, exactTurn: 17.4, exactRiver: 31.5 },
        { name: '同花聽牌（Flush Draw）', outs: 9, exactTurn: 19.6, exactRiver: 35.0 },
        { name: '同花聽牌 + 卡順（Combo Draw）', outs: 12, exactTurn: 26.1, exactRiver: 45.0 },
        { name: '同花聽牌 + 兩頭順（Monster Draw）', outs: 15, exactTurn: 32.6, exactRiver: 54.1 },
      ];
      const d = GTO.pick(draws);
      const twoCards = Math.random() < 0.55;
      const target = twoCards ? d.exactRiver : d.exactTurn;
      const streetStr = twoCards ? '翻牌圈到河牌（看轉牌+河牌共 2 張牌）' : '轉牌圈到河牌（只看河牌最後 1 張牌）';
      const { opts, ans } = makeNumericOptions(target, '%', [-12, -7.5, 6.5, 9, 14, -15], 3, 75, 1);
      return {
        kind: 'mcq',
        mode: 'math',
        badge: '🎲 Outs 與二四法則',
        q: '你目前持有「' + d.name + '（共 ' + d.outs + ' 張 Outs）」。請問在「' + streetStr + '」成功命中補牌的機率約為多少？',
        opts,
        ans,
        exp: d.name + '共有 ' + d.outs + ' 張 Outs。' + streetStr + '的精確命中率為 ' + GTO.fmtNum(target, 1) + '%（' + (twoCards ? '1 − 兩張都沒中 = 1 − (' + (47 - d.outs) + '/47 × ' + (46 - d.outs) + '/46)；二四法則估算 ' + d.outs + ' × 4' + (d.outs > 8 ? ' − (' + d.outs + ' − 8)' : '') + ' ≈ ' + (d.outs > 8 ? d.outs * 3 + 8 : d.outs * 4) + '%' : d.outs + ' ÷ 46 張未知牌；二四法則估算 ' + d.outs + ' × 2 ≈ ' + d.outs * 2 + '%') + '）。'
      };
    }

    if (sub === 'ev') {
      const scenarios = [
        { pot: 100, bet: 50, winPct: 30 },
        { pot: 100, bet: 50, winPct: 20 },
        { pot: 80, bet: 40, winPct: 35 },
        { pot: 100, bet: 100, winPct: 40 },
        { pot: 100, bet: 100, winPct: 25 },
        { pot: 60, bet: 30, winPct: 30 },
      ];
      const sc = GTO.pick(scenarios);
      const winGain = sc.pot + sc.bet;
      const ev = (sc.winPct / 100) * winGain - (1 - sc.winPct / 100) * sc.bet;
      const signFmt = (v) => (v > 0 ? '+' : '') + GTO.fmtNum(v, 1) + 'bb';
      const correctStr = signFmt(ev);
      const set = new Set([correctStr, signFmt(-ev), signFmt(ev + 10), signFmt(ev - 12), '0bb']);
      set.delete(correctStr);
      const distractors = GTO.shuffle(Array.from(set)).slice(0, 3);
      const opts = GTO.shuffle([correctStr, ...distractors]);
      return {
        kind: 'mcq',
        mode: 'math',
        badge: '💰 EV 期望值計算',
        q: '河牌底池 ' + sc.pot + 'bb，對手全下 ' + sc.bet + 'bb。你評估跟注後自己有 ' + sc.winPct + '% 的機率獲勝（贏走底池 + 對手下注共 ' + winGain + 'bb），' + (100 - sc.winPct) + '% 的機率輸掉跟注的 ' + sc.bet + 'bb。請問你「跟注」的期望值（EV）是多少？',
        opts,
        ans: opts.indexOf(correctStr),
        exp: 'EV = (勝率 × 淨贏額) − (敗率 × 跟注成本) = ' + (sc.winPct / 100) + ' × ' + winGain + 'bb − ' + ((100 - sc.winPct) / 100) + ' × ' + sc.bet + 'bb = ' + correctStr + '（' + (ev >= 0 ? '正期望值，應該跟注！' : '負期望值，應該棄牌！') + '）。'
      };
    }

    // combos-spr
    const stack = GTO.pick([100, 120, 80, 150]);
    const pot = GTO.pick([6, 16, 20, 25, 40]);
    const eff = stack - Math.round(pot / 2);
    const spr = eff / pot;
    const { opts, ans } = makeNumericOptions(spr, '', [-2.5, -1.2, 1.3, 2.4, 3.8], 0.5, 30, 1);
    return {
      kind: 'mcq',
      mode: 'math',
      badge: '🪙 SPR 籌碼底池比',
      q: '進入翻牌圈時，底池大小為 ' + pot + 'bb，雙方剩餘有效籌碼為 ' + eff + 'bb。請問此時的 SPR（籌碼底池比）約為多少？',
      opts,
      ans,
      exp: '公式：SPR = 剩餘有效籌碼 ÷ 翻牌圈底池 = ' + eff + ' ÷ ' + pot + ' ≈ ' + GTO.fmtNum(spr, 1) + '。'
    };
  }

  // ===========================================================================
  // 產生一題「GTO 理論觀念題」（從題庫 + 動態策略比較題抽題）
  // ===========================================================================
  function generateTheoryQuestion() {
    let pool = GTO.QUESTIONS.filter((q) => {
      if (session.topicFilter !== 'all' && q.topic !== session.topicFilter) return false;
      if (session.lvFilter && q.lv !== session.lvFilter) return false;
      return true;
    });
    if (!pool.length) pool = GTO.QUESTIONS;
    const fresh = pool.filter((q) => !session.recentIds.includes(q.id));
    const chosen = GTO.pick(fresh.length ? fresh : pool);
    rememberId(chosen.id, 30);

    const correctText = chosen.opts[chosen.ans];
    const shuffledOpts = GTO.shuffle(chosen.opts);
    const lesson = (GTO.LESSON_MAP && GTO.LESSON_MAP[chosen.topic]) || (GTO.THEORY || []).find((l) => l.id === chosen.topic);
    return {
      kind: 'mcq',
      mode: 'theory',
      qid: chosen.id,
      topic: chosen.topic,
      badge: (lesson ? lesson.icon + ' ' + lesson.title : '📚 GTO 理論') + ' · ' + '★'.repeat(chosen.lv || 1),
      q: chosen.q,
      opts: shuffledOpts,
      ans: shuffledOpts.indexOf(correctText),
      exp: chosen.exp,
      lessonLink: lesson ? '#/theory/' + lesson.id : '#/theory',
    };
  }

  // ===========================================================================
  // 產生一題「撲克術語快問快答」
  // ===========================================================================
  function generateTermsQuestion() {
    const list = GTO.GLOSSARY;
    const fresh = list.filter((g) => !session.recentIds.includes('term:' + g.id));
    const item = GTO.pick(fresh.length ? fresh : list);
    rememberId('term:' + item.id, 35);

    // 優先從同分類或鄰近分類挑 3 個干擾項
    const sameCat = list.filter((g) => g.id !== item.id && g.cat === item.cat);
    const otherCat = list.filter((g) => g.id !== item.id && g.cat !== item.cat);
    const distractors = GTO.shuffle(sameCat).concat(GTO.shuffle(otherCat)).slice(0, 3);

    const askDef = Math.random() < 0.55;
    if (askDef) {
      const correctText = item.short;
      const opts = GTO.shuffle([correctText, ...distractors.map((d) => d.short)]);
      return {
        kind: 'mcq',
        mode: 'terms',
        badge: '🔤 術語定義辨析',
        q: '撲克術語「' + item.term + '（' + item.zh + '）」的核心定義為何？',
        opts,
        ans: opts.indexOf(correctText),
        exp: '【' + item.term + ' · ' + item.zh + '】' + GTO.stripTags(item.def) + (item.ex ? ' 範例：' + GTO.stripTags(item.ex) : ''),
        glossaryId: item.id,
      };
    } else {
      const labelOf = (g) => g.term + '（' + g.zh + '）';
      const correctText = labelOf(item);
      const opts = GTO.shuffle([correctText, ...distractors.map(labelOf)]);
      return {
        kind: 'mcq',
        mode: 'terms',
        badge: '🔤 看描述猜術語',
        q: '請問下列哪一個撲克術語指的是：「' + item.short + '」？',
        opts,
        ans: opts.indexOf(correctText),
        exp: '正確答案為【' + item.term + ' · ' + item.zh + '】。' + GTO.stripTags(item.def),
        glossaryId: item.id,
      };
    }
  }

  // ===========================================================================
  // 產生一題「勝率直覺訓練題（Monte Carlo 即時對決）」
  // ===========================================================================
  const EQUITY_MATCHUPS = [
    { title: '口袋大對 vs 口袋小對（Overpair vs Underpair）', h1: 'AA', h2: 'KK', hasFlop: false },
    { title: '經典翻前跑馬（口袋對 vs 同花大牌）', h1: 'QQ', h2: 'AKs', hasFlop: false },
    { title: '經典翻前跑馬（中對子 vs 非同花大牌）', h1: '88', h2: 'AKo', hasFlop: false },
    { title: '踢腳壓制對決（Dominated Kicker）', h1: 'AKo', h2: 'AQo', hasFlop: false },
    { title: '同花百老匯壓制對決', h1: 'KQs', h2: 'KJs', hasFlop: false },
    { title: '口袋對子 vs 一高一低', h1: 'JJ', h2: 'A9s', hasFlop: false },
    { title: '兩張高牌 vs 無交集同花連張', h1: 'AKo', h2: '87s', hasFlop: false },
    { title: '口袋王牌 vs 同花連張', h1: 'AA', h2: 'T9s', hasFlop: false },
    { title: '兩高牌 vs 兩低牌（未成對）', h1: 'KQo', h2: '98s', hasFlop: false },
    { title: '翻牌圈：怪獸聽牌（同花+兩頭順 15 outs）vs 頂對頂踢腳', c1: ['Jh', 'Th'], c2: ['As', '9d'], board: ['9h', '8h', '2c'] },
    { title: '翻牌圈：同花聽牌（9 outs）vs 頂對頂踢腳', c1: ['Ah', '5h'], c2: ['As', 'Kd'], board: ['Kh', '8h', '3c'] },
    { title: '翻牌圈：暗三條（Set）vs 同花加順子聽牌', c1: ['7s', '7d'], c2: ['9h', '8h'], board: ['Th', '7h', '2c'] },
    { title: '翻牌圈：超對（Overpair）vs 兩頭順聽牌（8 outs）', c1: ['Qs', 'Qd'], c2: ['9s', '8s'], board: ['7d', '6c', '2h'] }
  ];

  function generateEquityQuestion() {
    const m = GTO.pick(EQUITY_MATCHUPS);
    let c1, c2, board = [];
    if (m.c1) {
      c1 = m.c1; c2 = m.c2; board = m.board || [];
    } else {
      c1 = GTO.randomCombo(m.h1);
      // 確保不撞牌
      do { c2 = GTO.randomCombo(m.h2); } while (c1.includes(c2[0]) || c1.includes(c2[1]));
    }
    const sim = GTO.handVsHand(c1, c2, 12000, board);
    const eq1 = sim.equity[0] * 100;
    const { opts, ans } = makeNumericOptions(eq1, '%', [-22, -13, 12, 21, -17, 16], 8, 92, 0);

    return {
      kind: 'equity',
      mode: 'equity',
      badge: '🎲 勝率直覺訓練 · ' + m.title,
      c1, c2, board,
      eq1, eq2: sim.equity[1] * 100,
      win1: sim.win[0] * 100,
      tie: sim.tie[0] * 100,
      opts,
      ans,
      exp: '經 12,000 次 Monte Carlo 模擬，玩家 A 的真實勝率（含平分底池權益）約為 ' + GTO.fmtNum(eq1, 1) + '%，玩家 B 約為 ' + GTO.fmtNum(sim.equity[1] * 100, 1) + '%。'
    };
  }

  // ===========================================================================
  // 繪製 6 人桌視覺化牌桌
  // ===========================================================================
  function renderSixMaxTable(q) {
    const sc = q.sc;
    const order = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    const heroIdx = order.indexOf(sc.hero);
    // 讓 Hero 永遠坐在畫面正下方（seat-0），其餘順時針排列
    const seatHtml = [];
    for (let i = 0; i < 6; i++) {
      const pos = order[(heroIdx + i) % 6];
      const isHero = pos === sc.hero;
      const isVillain = pos === sc.villain;
      let status = '待行動', chip = '', cls = 'tseat seat-' + i;
      if (pos === 'SB') chip = '0.5bb';
      if (pos === 'BB') chip = '1.0bb';

      const posOrderIdx = order.indexOf(pos);
      const heroOrderIdx = order.indexOf(sc.hero);
      const vilOrderIdx = sc.villain ? order.indexOf(sc.villain) : -1;

      if (sc.cat === 'rfi') {
        if (posOrderIdx < heroOrderIdx) { status = '棄牌'; cls += ' folded'; chip = ''; }
        else if (isHero) { status = '輪到你行動'; cls += ' hero active'; }
      } else if (sc.cat === 'vsrfi') {
        if (posOrderIdx < vilOrderIdx) { status = '棄牌'; cls += ' folded'; chip = ''; }
        else if (isVillain) {
          status = '開池加注';
          chip = pos === 'SB' ? '3.0bb' : '2.5bb';
          cls += ' villain';
        } else if (posOrderIdx > vilOrderIdx && posOrderIdx < heroOrderIdx) {
          status = '棄牌'; cls += ' folded'; chip = '';
        } else if (isHero) { status = '輪到你行動'; cls += ' hero active'; }
      } else if (sc.cat === 'vs3bet') {
        if (isHero) {
          status = '你開池 → 面臨 3B';
          chip = pos === 'SB' ? '3.0bb' : '2.5bb';
          cls += ' hero active';
        } else if (isVillain) {
          const m = sc.openSize.match(/面臨\s*([\d.]+bb)/);
          status = '3-Bet 加注!';
          chip = m ? m[1] : '7.5bb';
          cls += ' villain';
        } else {
          status = '棄牌'; cls += ' folded'; chip = '';
        }
      } else if (sc.cat === 'vs4bet') {
        if (isHero) {
          const m3 = sc.openSize.match(/^([\d.]+bb)/);
          status = '你 3B → 面臨 4B';
          chip = m3 ? m3[1] : '7.5bb';
          cls += ' hero active';
        } else if (isVillain) {
          const m4 = sc.openSize.match(/面臨\s*([\d.]+bb)/);
          status = '4-Bet 再加注!';
          chip = m4 ? m4[1] : '21bb';
          cls += ' villain';
        } else {
          status = '棄牌'; cls += ' folded'; chip = '';
        }
      }

      const dBtn = pos === 'BTN' ? '<span class="dealer-btn" title="莊位按鈕">D</span>' : '';
      const cardsPart = isHero
        ? '<div class="seat-cards">' + GTO.cardsHtml(q.cards, 'lg') + '</div>'
        : (cls.includes('folded') ? '' : '<div class="seat-cards">' + GTO.cardBackHtml('sm') + GTO.cardBackHtml('sm') + '</div>');

      seatHtml.push(
        '<div class="' + cls + '">' +
          '<div class="seat-box">' +
            '<div class="seat-top"><span class="seat-pos">' + pos + '</span><span class="seat-zh">' + GTO.POS_ZH[pos] + '</span>' + dBtn + '</div>' +
            cardsPart +
            '<div class="seat-status">' + status + '</div>' +
          '</div>' +
          (chip ? '<div class="seat-chip">🪙 ' + chip + '</div>' : '') +
        '</div>'
      );
    }

    return (
      '<div class="poker-table-wrap">' +
        '<div class="poker-felt">' +
          '<div class="felt-center">' +
            '<div class="felt-tag">6-Max Cash · 100bb · 無前注</div>' +
            '<div class="felt-title">' + GTO.esc(sc.title) + '</div>' +
            '<div class="felt-hand-pill">你的手牌：<strong>' + q.hand + '</strong>（' + GTO.HAND_INFO[q.hand].combos + ' 組）</div>' +
          '</div>' +
          seatHtml.join('') +
        '</div>' +
      '</div>'
    );
  }

  // ===========================================================================
  // 範圍填色挑戰（Paint Mode）獨立渲染與互動邏輯
  // ===========================================================================
  let paintState = {
    scId: 'rfi_utg',
    brush: 'raise',
    userCells: {},
    submitted: false,
    showAnswer: false,
    isMouseDown: false,
  };
  let lastDragBtn = null;
  let paintQuickCache = null;
  function getPaintQuickHands() {
    if (!paintQuickCache) {
      paintQuickCache = {
        pairs: Object.keys(GTO.parseRange('22+')),
        axs: Object.keys(GTO.parseRange('A2s+')),
        bways: Object.keys(GTO.parseRange('ATs+, KTs+, QTs+, JTs')),
      };
    }
    return paintQuickCache;
  }
  const stopPaintDrag = () => { paintState.isMouseDown = false; lastDragBtn = null; };
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('mouseup', stopPaintDrag);
    window.addEventListener('blur', stopPaintDrag);
  }
  if (GTO.on) GTO.on('visibility', (hidden) => { if (hidden) stopPaintDrag(); });

  function initPaintScenario(scId) {
    const sc = GTO.getScenario(scId || paintState.scId);
    paintState.scId = sc.id;
    paintState.brush = sc.primaryAction;
    paintState.userCells = {};
    paintState.submitted = false;
    paintState.showAnswer = false;
    for (const h of GTO.HANDS) paintState.userCells[h] = 'fold';
  }

  function renderPaintMode(container) {
    const sc = GTO.getScenario(paintState.scId);
    if (!paintState.userCells || Object.keys(paintState.userCells).length !== 169) {
      initPaintScenario(sc.id);
    }
    const pAct = sc.primaryAction;
    const pLabel = GTO.ACTIONS[pAct].label;
    const bestScore = (GTO.progress.paint && GTO.progress.paint.best && GTO.progress.paint.best[sc.id]) || null;

    const scOptions = GTO.SCENARIO_LIST.map((s) =>
      '<option value="' + s.id + '"' + (s.id === sc.id ? ' selected' : '') + '>' +
      '[' + (s.cat === 'rfi' ? '開池' : s.cat === 'vsrfi' ? '面對開池' : s.cat === 'vs3bet' ? '被3-Bet' : '面對4-Bet') + '] ' +
      GTO.esc(s.title) + ' (' + GTO.esc(s.targetPct) + ')</option>'
    ).join('');

    container.innerHTML =
      '<div class="card paint-wrap">' +
        '<div class="paint-toolbar">' +
          '<div class="paint-select-group">' +
            '<label class="lbl">選擇要默寫的範圍：</label>' +
            '<select id="paintScSelect" class="inp">' + scOptions + '</select>' +
            '<button type="button" class="btn" id="paintRandScBtn">🎲 隨機抽一題範圍</button>' +
          '</div>' +
          '<div class="paint-brushes">' +
            '<span class="lbl">畫筆：</span>' +
            '<button type="button" class="brush-btn ' + (paintState.brush === pAct ? 'active' : '') + '" data-brush="' + pAct + '">' +
              '<i class="sw act-' + pAct + '"></i>' + pLabel + '</button>' +
            (sc.secondaryAction ? (
              '<button type="button" class="brush-btn ' + (paintState.brush === 'call' ? 'active' : '') + '" data-brush="call">' +
                '<i class="sw act-call"></i>跟注 (Call)</button>'
            ) : '') +
            '<button type="button" class="brush-btn ' + (paintState.brush === 'fold' ? 'active' : '') + '" data-brush="fold">' +
              '<i class="sw act-fold"></i>橡皮擦 (棄牌)</button>' +
          '</div>' +
        '</div>' +
        '<div class="paint-quick-bar">' +
          '<span class="muted">快速填色小幫手（也支援按住滑鼠拖曳塗色）：</span>' +
          '<button type="button" class="btn-xs" id="fillAllPairsBtn">+ 全部對子 (22+)</button>' +
          '<button type="button" class="btn-xs" id="fillAllAxsBtn">+ 全部同花 A (A2s+)</button>' +
          '<button type="button" class="btn-xs" id="fillSuitedBroadwaysBtn">+ 同花百老匯</button>' +
          '<button type="button" class="btn-xs" id="clearPaintBtn">🗑️ 清空重填</button>' +
          (bestScore != null ? '<span class="chip info">🏆 本題最高紀錄：' + bestScore + '%</span>' : '') +
        '</div>' +
        '<div class="paint-body">' +
          '<div id="paintGridHolder"></div>' +
          '<div class="paint-side" id="paintSidePanel"></div>' +
        '</div>' +
      '</div>';

    drawPaintGrid(container, sc);

    // 綁定事件
    container.querySelector('#paintScSelect').addEventListener('change', (e) => {
      initPaintScenario(e.target.value);
      renderPaintMode(container);
    });
    container.querySelector('#paintRandScBtn').addEventListener('click', () => {
      const next = GTO.pick(GTO.SCENARIO_LIST);
      initPaintScenario(next.id);
      renderPaintMode(container);
    });
    container.querySelectorAll('.brush-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        paintState.brush = btn.getAttribute('data-brush');
        container.querySelectorAll('.brush-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    container.querySelector('#fillAllPairsBtn').addEventListener('click', () => {
      for (const h of getPaintQuickHands().pairs) {
        if (sc.cells[h].inBase) paintState.userCells[h] = paintState.brush;
      }
      drawPaintGrid(container, sc);
    });
    container.querySelector('#fillAllAxsBtn').addEventListener('click', () => {
      for (const h of getPaintQuickHands().axs) {
        if (sc.cells[h].inBase) paintState.userCells[h] = paintState.brush;
      }
      drawPaintGrid(container, sc);
    });
    container.querySelector('#fillSuitedBroadwaysBtn').addEventListener('click', () => {
      for (const h of getPaintQuickHands().bways) {
        if (sc.cells[h].inBase) paintState.userCells[h] = paintState.brush;
      }
      drawPaintGrid(container, sc);
    });
    container.querySelector('#clearPaintBtn').addEventListener('click', () => {
      initPaintScenario(sc.id);
      drawPaintGrid(container, sc);
    });
  }

  function drawPaintGrid(container, sc) {
    const gridHolder = container.querySelector('#paintGridHolder');
    const side = container.querySelector('#paintSidePanel');
    gridHolder.__paintCtx = { container, sc, side };

    // 容器事件委派：1 組 mousedown + mouseover 取代 338 個逐格監聽器
    if (!gridHolder.__paintBound) {
      gridHolder.__paintBound = true;
      const applyDrag = (btn) => {
        const ctx = gridHolder.__paintCtx;
        if (!ctx || paintState.submitted) return;
        const h = btn.getAttribute('data-hand');
        if (!h || !ctx.sc.cells[h].inBase) return;
        if (paintState.userCells[h] === paintState.brush) return;
        paintState.userCells[h] = paintState.brush;
        btn.className = 'rcell type-' + GTO.HAND_INFO[h].type + ' act-' + paintState.brush;
        updatePaintStatsOnly(ctx.side, ctx.sc);
      };
      gridHolder.addEventListener('mousedown', (e) => {
        const ctx = gridHolder.__paintCtx;
        if (!ctx || paintState.submitted) return;
        const btn = e.target && e.target.closest ? e.target.closest('.rcell') : null;
        if (!btn) return;
        e.preventDefault();
        paintState.isMouseDown = true;
        lastDragBtn = btn;
        const h = btn.getAttribute('data-hand');
        if (!h || !ctx.sc.cells[h].inBase) return;
        paintState.userCells[h] = (paintState.userCells[h] === paintState.brush) ? 'fold' : paintState.brush;
        btn.className = 'rcell type-' + GTO.HAND_INFO[h].type + ' act-' + paintState.userCells[h];
        updatePaintStatsOnly(ctx.side, ctx.sc);
      });
      gridHolder.addEventListener('mouseover', (e) => {
        if (!paintState.isMouseDown || paintState.submitted) return;
        const btn = e.target && e.target.closest ? e.target.closest('.rcell') : null;
        if (!btn || btn === lastDragBtn) return;
        lastDragBtn = btn;
        applyDrag(btn);
      });
    }

    let hit = 0, totalInBase = 0;
    const missedHands = [];
    const existingCells = gridHolder.__paintCells;

    if (existingCells && existingCells.length === 169 && gridHolder.firstElementChild && gridHolder.firstElementChild.classList.contains('paint-grid')) {
      for (let i = 0; i < 169; i++) {
        const h = GTO.HANDS[i];
        const btn = existingCells[i];
        const targetCell = sc.cells[h];
        const uAct = paintState.userCells[h] || 'fold';
        const ansAct = targetCell.simple;
        let cls = 'rcell type-' + GTO.HAND_INFO[h].type;
        let wantDot = null;
        if (!targetCell.inBase) {
          cls += ' not-in-base act-fold';
        } else {
          totalInBase++;
          const showAct = paintState.showAnswer ? ansAct : uAct;
          cls += ' act-' + showAct;
          if (paintState.submitted) {
            const isOk = uAct === ansAct || (targetCell.primary === 0.5 && (uAct === sc.primaryAction || uAct === 'fold')) || (targetCell.call === 0.5 && (uAct === 'call' || uAct === 'fold'));
            if (isOk) {
              hit++;
            } else {
              cls += ' paint-wrong';
              wantDot = '標準答案：' + GTO.ACTIONS[ansAct].label;
              missedHands.push({ h, uAct, ansAct });
            }
          }
        }
        if (btn.className !== cls) btn.className = cls;
        const curDot = btn.lastElementChild && btn.lastElementChild.classList.contains('pw-dot') ? btn.lastElementChild : null;
        if (wantDot) {
          if (curDot) curDot.title = wantDot;
          else {
            const sp = document.createElement('span');
            sp.className = 'pw-dot';
            sp.title = wantDot;
            sp.textContent = '!';
            btn.appendChild(sp);
          }
        } else if (curDot) {
          curDot.remove();
        }
      }
    } else {
      const html = ['<div class="rgrid paint-grid">'];
      for (const h of GTO.HANDS) {
        const targetCell = sc.cells[h];
        const uAct = paintState.userCells[h] || 'fold';
        const ansAct = targetCell.simple;
        let cls = 'rcell type-' + GTO.HAND_INFO[h].type;
        let mark = '';

        if (!targetCell.inBase) {
          cls += ' not-in-base act-fold';
        } else {
          totalInBase++;
          const showAct = paintState.showAnswer ? ansAct : uAct;
          cls += ' act-' + showAct;
          if (paintState.submitted) {
            const isOk = uAct === ansAct || (targetCell.primary === 0.5 && (uAct === sc.primaryAction || uAct === 'fold')) || (targetCell.call === 0.5 && (uAct === 'call' || uAct === 'fold'));
            if (isOk) {
              hit++;
            } else {
              cls += ' paint-wrong';
              mark = '<span class="pw-dot" title="標準答案：' + GTO.ACTIONS[ansAct].label + '">!</span>';
              missedHands.push({ h, uAct, ansAct });
            }
          }
        }
        html.push('<button type="button" class="' + cls + '" data-hand="' + h + '"><span class="rh">' + h + '</span>' + mark + '</button>');
      }
      html.push('</div>');
      gridHolder.innerHTML = html.join('');
      gridHolder.__paintCells = Array.from(gridHolder.firstElementChild.children);
    }

    // 右側面板
    if (!paintState.submitted) {
      updatePaintStatsOnly(side, sc);
    } else {
      const acc = Math.round((hit / Math.max(1, totalInBase)) * 100);
      side.innerHTML =
        '<div class="paint-result">' +
          '<div class="pr-score ' + (acc >= 90 ? 'good' : acc >= 75 ? 'warn' : 'bad') + '">' +
            '<div class="pr-num">' + acc + '%</div>' +
            '<div class="pr-lbl">範圍默寫準確率（' + hit + ' / ' + totalInBase + ' 格正確）</div>' +
          '</div>' +
          '<div class="pr-actions">' +
            '<button type="button" class="btn primary" id="toggleAnsViewBtn">' +
              (paintState.showAnswer ? '👀 切換看「我的填色」' : '🎯 切換看「GTO 標準答案」') +
            '</button>' +
            '<button type="button" class="btn" id="retryPaintBtn">🔄 重新默寫本題</button>' +
          '</div>' +
          '<div class="callout key" style="margin-top:12px"><b>記憶提示</b><br>' + GTO.esc(sc.summary) + '</div>' +
          (missedHands.length ? (
            '<div class="missed-box">' +
              '<h4>需修正的手牌（共 ' + missedHands.length + ' 格）：</h4>' +
              '<div class="missed-chips">' +
                missedHands.slice(0, 28).map((m) =>
                  '<span class="mchip"><strong>' + m.h + '</strong>：你填' + GTO.ACTIONS[m.uAct].short + ' → 應為<strong>' + GTO.ACTIONS[m.ansAct].label + '</strong></span>'
                ).join('') +
              '</div>' +
            '</div>'
          ) : '<div class="callout tip"><b>太強了！</b>169 格完全零失誤通關！</div>') +
        '</div>';

      side.querySelector('#toggleAnsViewBtn').addEventListener('click', () => {
        paintState.showAnswer = !paintState.showAnswer;
        drawPaintGrid(container, sc);
      });
      side.querySelector('#retryPaintBtn').addEventListener('click', () => {
        initPaintScenario(sc.id);
        drawPaintGrid(container, sc);
      });
    }
  }

  function updatePaintStatsOnly(side, sc) {
    let userCombos = 0;
    for (const h of GTO.HANDS) {
      if (sc.cells[h].inBase && paintState.userCells[h] !== 'fold') {
        userCombos += GTO.HAND_INFO[h].combos;
      }
    }
    const userPct = ((userCombos / GTO.TOTAL_COMBOS) * 100).toFixed(1);
    const targetPct = (sc.stats.continuePctAll * 100).toFixed(1);

    side.innerHTML =
      '<div class="paint-info">' +
        '<h3>' + GTO.esc(sc.title) + '</h3>' +
        '<p class="muted">尺度：' + GTO.esc(sc.openSize) + ' ｜ 目標範圍：<strong>' + GTO.esc(sc.targetPct) + '</strong></p>' +
        '<div class="paint-meter">' +
          '<div>你目前已塗色：<strong>' + userCombos + ' 組 (' + userPct + '%)</strong></div>' +
          '<div class="muted">GTO 基準約：' + Math.round(sc.stats.continueCombos) + ' 組 (' + targetPct + '%)</div>' +
        '</div>' +
        '<button type="button" class="btn primary lg-btn" id="submitPaintBtn" style="width:100%;margin-top:14px">✅ 交卷批改範圍</button>' +
        '<ul class="tips-list" style="margin-top:14px">' +
          sc.tips.map((t) => '<li>' + GTO.esc(t) + '</li>').join('') +
        '</ul>' +
      '</div>';

    side.querySelector('#submitPaintBtn').addEventListener('click', () => {
      paintState.submitted = true;
      // 計算分數並記錄
      let hit = 0, total = 0;
      for (const h of GTO.HANDS) {
        const tc = sc.cells[h];
        if (!tc.inBase) continue;
        total++;
        const u = paintState.userCells[h];
        const ok = u === tc.simple || (tc.primary === 0.5 && (u === sc.primaryAction || u === 'fold')) || (tc.call === 0.5 && (u === 'call' || u === 'fold'));
        if (ok) hit++;
      }
      const acc = Math.round((hit / Math.max(1, total)) * 100);
      GTO.progress.paint = GTO.progress.paint || { best: {} };
      GTO.progress.paint.best[sc.id] = Math.max(GTO.progress.paint.best[sc.id] || 0, acc);
      GTO.recordAnswer('paint', acc >= 85);
      drawPaintGrid(side.closest('.paint-wrap').parentElement, sc);
    });
  }

  // ===========================================================================
  // 主測驗頁渲染與下一題生成
  // ===========================================================================
  let activeRoot = null;

  function renderQuizPage(root, submode, queryParams) {
    activeRoot = root;
    if (submode && QUIZ_MODES.some((m) => m.id === submode)) {
      session.mode = submode;
    }
    if (queryParams && queryParams.scenario && GTO.SCENARIOS[queryParams.scenario]) {
      session.scenarioFilter = queryParams.scenario;
      const sc = GTO.SCENARIOS[queryParams.scenario];
      session.catFilter = sc.cat;
    }
    if (queryParams && queryParams.topic) {
      session.topicFilter = queryParams.topic;
      session.lvFilter = 0;
    } else if (submode === 'theory') {
      session.topicFilter = 'all';
    }
    if (submode === 'preflop' && !(queryParams && queryParams.scenario)) session.scenarioFilter = '';
    const mode = QUIZ_MODES.find((m) => m.id === session.mode) || QUIZ_MODES[0];
    const sameGroup = QUIZ_MODES.filter((m) => m.group === mode.group);

    root.innerHTML =
      '<div class="drill-head">' +
        '<a class="back-link" href="#/quiz">← 練習中心</a>' +
        '<div class="dh-title"><span class="dh-ic">' + mode.icon + '</span><div><h1>' + mode.title + '</h1><p>' + mode.sub + '</p></div></div>' +
        '<div class="session-scoreboard" id="quizScoreboard"></div>' +
      '</div>' +
      (sameGroup.length > 1 ? '<nav class="drill-switch">' + sameGroup.map((m) =>
        '<a class="ds-tab ' + (m.id === mode.id ? 'on' : '') + '" href="#/quiz/' + m.id + '">' + m.icon + ' ' + m.title + '</a>').join('') + '</nav>' : '') +
      '<div id="quizFilterBar"></div>' +
      '<div id="quizStageArea"></div>' +
      '<div class="kbd-hint">⌨️ 快捷鍵：<kbd>1</kbd>–<kbd>4</kbd> 選答案，<kbd>Space</kbd> / <kbd>Enter</kbd> 下一題</div>';

    updateScoreboard();
    renderFilterBar();
    if (session.mode === 'paint') {
      if (session.scenarioFilter) initPaintScenario(session.scenarioFilter);
      renderPaintMode(root.querySelector('#quizStageArea'));
    } else {
      nextQuestion();
    }
  }

  // ===========================================================================
  // 練習中心首頁（#/quiz）
  // ===========================================================================
  function renderPracticeHub(root) {
    const p = GTO.progress;
    const today = p.daily[GTO.todayKey()] || 0;
    const goal = (p.settings && p.settings.dailyGoal) || 30;
    const acc = p.totals.a ? Math.round((p.totals.c / p.totals.a) * 100) : 0;
    const level = (p.settings && p.settings.level) || '';
    const rec = level === 'gto' ? 'preflop' : level === 'casual' ? 'outs' : 'showdown';
    const recMode = QUIZ_MODES.find((m) => m.id === rec) || QUIZ_MODES[0];
    const modeCard = (m) => {
      const st = p.modes[m.id] || { a: 0, c: 0 };
      const a = st.a ? Math.round((st.c / st.a) * 100) : null;
      return '<a class="mode-card' + (m.id === rec ? ' rec' : '') + '" href="#/quiz/' + m.id + '">' +
        '<span class="mc-ic">' + m.icon + '</span>' +
        '<div class="mc-txt"><b>' + m.title + (m.id === rec ? ' <span class="chip ok">推薦</span>' : '') + '</b><p>' + m.sub + '</p>' +
          '<small>' + (st.a ? '已練 ' + st.a + ' 題 · 正確率 ' + a + '%' : '還沒練過') + '</small></div>' +
        '<span class="mc-go">開始 →</span>' +
      '</a>';
    };
    root.innerHTML =
      GTO.ui.pageHead({ icon: '🎯', title: '練習中心', sub: '每一題都是隨機產生、永遠刷不完。建議每天 15–30 題，答錯的題目會自動記到「我的進度」。' }) +
      '<div class="hub-top">' +
        '<div class="hub-goal">' + GTO.ui.progressRing(Math.min(100, Math.round(today / goal * 100)), 84, today + '/' + goal) +
          '<div><small>今日目標</small><b>' + (today >= goal ? '🎉 今日目標達成！' : '再 ' + (goal - today) + ' 題達成') + '</b>' +
          '<span class="muted">連續學習 ' + GTO.studyDays() + ' 天 · 總正確率 ' + acc + '%</span></div></div>' +
        '<a class="hub-rec" href="#/quiz/' + recMode.id + '"><small>為你推薦</small><b>' + recMode.icon + ' ' + recMode.title + '</b><span>' + recMode.sub + '</span><em>立即開始 →</em></a>' +
      '</div>' +
      QUIZ_GROUPS.map((g) => {
        const ms = QUIZ_MODES.filter((m) => m.group === g.id);
        if (!ms.length) return '';
        return '<section class="hub-sec"><div class="hub-sec-head"><span>' + g.icon + '</span><div><h2>' + g.title + '</h2><p>' + g.sub + '</p></div></div>' +
          '<div class="mode-grid">' + ms.map(modeCard).join('') + '</div></section>';
      }).join('');
  }

  function updateScoreboard() {
    const el = activeRoot && activeRoot.querySelector('#quizScoreboard');
    if (!el) return;
    const acc = session.total ? Math.round((session.correct / session.total) * 100) : 0;
    el.innerHTML =
      '<div class="sb-pill"><span>🔥 連對</span><strong>' + session.streak + '</strong></div>' +
      '<div class="sb-pill"><span>本次</span><strong>' + session.correct + '/' + session.total + '</strong> <small>' + acc + '%</small></div>' +
      '<div class="sb-pill"><span>今日</span><strong>' + (GTO.progress.daily[GTO.todayKey()] || 0) + '</strong> <small>題</small></div>';
  }

  function renderFilterBar() {
    const bar = activeRoot && activeRoot.querySelector('#quizFilterBar');
    if (!bar) return;
    if (session.mode === 'paint') { bar.innerHTML = ''; return; }

    if (session.mode === 'preflop') {
      const scOpts = '<option value="">🎲 在下方篩選條件內隨機抽情境</option>' +
        GTO.SCENARIO_LIST.map((s) =>
          '<option value="' + s.id + '"' + (session.scenarioFilter === s.id ? ' selected' : '') + '>' +
          GTO.esc(s.title) + ' (' + GTO.esc(s.targetPct) + ')</option>'
        ).join('');

      bar.innerHTML =
        '<div class="filter-bar">' +
          '<div class="fgroup">' +
            '<span class="flbl">情境：</span>' +
            [['all', '全部'], ['rfi', '🚀 開池 RFI'], ['vsrfi', '⚔️ 面對開池'], ['vs3bet', '🛡️ 被 3-Bet'], ['vs4bet', '💥 面對 4-Bet']].map(([k, lbl]) =>
              '<button type="button" class="fpill ' + (!session.scenarioFilter && session.catFilter === k ? 'active' : '') + '" data-cat="' + k + '">' + lbl + '</button>'
            ).join('') +
          '</div>' +
          '<div class="fgroup">' +
            '<span class="flbl">你的位置：</span>' +
            [['all', '全部'], ['UTG', 'UTG'], ['HJ', 'HJ'], ['CO', 'CO'], ['BTN', 'BTN'], ['SB', 'SB'], ['BB', 'BB']].map(([k, lbl]) =>
              '<button type="button" class="fpill ' + (!session.scenarioFilter && session.heroFilter === k ? 'active' : '') + '" data-hero="' + k + '">' + lbl + '</button>'
            ).join('') +
          '</div>' +
          '<div class="fgroup">' +
            '<select id="qfScenarioSelect" class="inp sm">' + scOpts + '</select>' +
            '<button type="button" class="fpill ' + (session.sampling === 'focus' ? 'active' : '') + '" id="qfSamplingBtn" title="優先抽取容易混淆的邊界手牌與歷史錯題">' +
              (session.sampling === 'focus' ? '🎯 邊緣牌強化抽題' : '🎲 完全隨機抽牌') +
            '</button>' +
          '</div>' +
        '</div>';

      bar.querySelectorAll('[data-cat]').forEach((b) => {
        b.addEventListener('click', () => {
          session.scenarioFilter = '';
          session.catFilter = b.getAttribute('data-cat');
          renderFilterBar();
          nextQuestion();
        });
      });
      bar.querySelectorAll('[data-hero]').forEach((b) => {
        b.addEventListener('click', () => {
          session.scenarioFilter = '';
          session.heroFilter = b.getAttribute('data-hero');
          renderFilterBar();
          nextQuestion();
        });
      });
      bar.querySelector('#qfScenarioSelect').addEventListener('change', (e) => {
        session.scenarioFilter = e.target.value;
        renderFilterBar();
        nextQuestion();
      });
      bar.querySelector('#qfSamplingBtn').addEventListener('click', () => {
        session.sampling = session.sampling === 'focus' ? 'random' : 'focus';
        renderFilterBar();
      });
      return;
    }

    if (session.mode === 'theory') {
      const topicOpts = '<option value="all">全部 ' + (GTO.THEORY || []).length + ' 堂課隨機</option>' +
        (GTO.THEORY || []).map((t) => '<option value="' + t.id + '"' + (session.topicFilter === t.id ? ' selected' : '') + '>' + t.icon + ' ' + GTO.esc(t.title) + '</option>').join('');
      bar.innerHTML =
        '<div class="filter-bar">' +
          '<div class="fgroup"><span class="flbl">課程主題：</span><select id="qtTopicSel" class="inp sm">' + topicOpts + '</select></div>' +
          '<div class="fgroup"><span class="flbl">難度：</span>' +
            [[0, '全部'], [1, '★ 入門'], [2, '★★ 進階'], [3, '★★★ 高階']].map(([lv, lbl]) =>
              '<button type="button" class="fpill ' + (session.lvFilter === lv ? 'active' : '') + '" data-lv="' + lv + '">' + lbl + '</button>'
            ).join('') +
          '</div>' +
        '</div>';
      bar.querySelector('#qtTopicSel').addEventListener('change', (e) => {
        session.topicFilter = e.target.value;
        nextQuestion();
      });
      bar.querySelectorAll('[data-lv]').forEach((b) => {
        b.addEventListener('click', () => {
          session.lvFilter = Number(b.getAttribute('data-lv'));
          renderFilterBar();
          nextQuestion();
        });
      });
      return;
    }

    if (session.mode === 'math') {
      bar.innerHTML =
        '<div class="filter-bar"><div class="fgroup"><span class="flbl">計算題型：</span>' +
        [
          ['all', '🎲 全部隨機'],
          ['pot-odds', '底池賠率'],
          ['mdf', 'MDF 防守頻率'],
          ['alpha', 'Alpha 詐唬率'],
          ['bluff-ratio', '價值詐唬比'],
          ['outs', 'Outs 與 2/4 法則'],
          ['ev', 'EV 期望值'],
          ['combos-spr', 'SPR 籌碼底池比']
        ].map(([k, lbl]) =>
          '<button type="button" class="fpill ' + (session.mathFilter === k ? 'active' : '') + '" data-mtype="' + k + '">' + lbl + '</button>'
        ).join('') +
        '</div></div>';
      bar.querySelectorAll('[data-mtype]').forEach((b) => {
        b.addEventListener('click', () => {
          session.mathFilter = b.getAttribute('data-mtype');
          renderFilterBar();
          nextQuestion();
        });
      });
      return;
    }

    bar.innerHTML = '';
  }

  function nextQuestion(forcedQuestion) {
    const stage = activeRoot && activeRoot.querySelector('#quizStageArea');
    if (!stage) return;
    session.answered = false;

    let q;
    if (forcedQuestion) {
      q = forcedQuestion;
    } else {
      let m = session.mode;
      if (m === 'mix') {
        const W = { preflop: 22, theory: 18, math: 11, terms: 8, equity: 5, showdown: 6, handname: 4, outs: 6, position: 3, texture: 5, nuts: 5, spots: (GTO.POSTFLOP_SPOTS || []).length ? 10 : 0 };
        const DRILL_IDS = ['showdown', 'handname', 'outs', 'position', 'texture', 'nuts', 'spots'];
        m = GTO.weightedPick(Object.keys(W).filter((k) => !DRILL_IDS.includes(k) || (GTO.DRILLS && GTO.DRILLS[k])), (k) => W[k]);
      }
      if (GTO.DRILLS && GTO.DRILLS[m]) q = GTO.DRILLS[m].gen();
      else if (m === 'preflop') q = generatePreflopQuestion();
      else if (m === 'theory') q = generateTheoryQuestion();
      else if (m === 'math') q = generateMathQuestion();
      else if (m === 'terms') q = generateTermsQuestion();
      else q = generateEquityQuestion();
    }
    session.currentQ = q;
    renderCurrentQuestion(stage, q);
  }

  function renderCurrentQuestion(stage, q) {
    if (q.kind === 'preflop') {
      const actBtns = q.actions.map((act, idx) => {
        const a = GTO.ACTIONS[act];
        return '<button type="button" class="act-choice-btn act-' + act + '" data-act="' + act + '">' +
          '<span class="kbd">' + (idx + 1) + '</span>' +
          '<span class="ac-main">' + a.label + '</span>' +
          '<span class="ac-en">' + a.en + '</span>' +
        '</button>';
      }).join('');

      stage.innerHTML =
        '<div class="qstage-grid preflop-stage">' +
          '<div class="card qleft-card">' +
            renderSixMaxTable(q) +
            '<div class="qprompt-box">' + q.situationDesc + '</div>' +
            '<div class="act-btn-row" id="preflopActRow">' + actBtns + '</div>' +
          '</div>' +
          '<div class="card qright-card" id="preflopFeedbackBox">' +
            '<div class="qplaceholder">' +
              '<div class="qp-icon">♟️</div>' +
              '<h3>請選擇你的翻前行動</h3>' +
              '<p class="muted">作答後將立即顯示該情境的完整 <strong>13×13 GTO 範圍表</strong>、頻率分布與策略原因解析。</p>' +
              '<div class="qp-meta">' +
                '<div>📍 情境：<strong>' + GTO.esc(q.sc.title) + '</strong></div>' +
                '<div>📏 尺度：<strong>' + GTO.esc(q.sc.openSize) + '</strong></div>' +
                '<div>🎯 範圍寬度：<strong>' + GTO.esc(q.sc.targetPct) + '</strong></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      stage.querySelectorAll('.act-choice-btn').forEach((btn) => {
        btn.addEventListener('click', () => submitPreflopAnswer(btn.getAttribute('data-act')));
      });
      return;
    }

    // 一般選擇題（theory / math / terms / equity / 新手練習）
    let visualHtml = q.visualHtml || '';
    if (q.kind === 'equity') {
      visualHtml =
        '<div class="eq-duel-box">' +
          '<div class="eq-side">' +
            '<div class="eq-lbl">玩家 A（請問此手牌勝率？）</div>' +
            GTO.cardsHtml(q.c1, 'lg') +
          '</div>' +
          '<div class="eq-vs">VS</div>' +
          '<div class="eq-side">' +
            '<div class="eq-lbl">玩家 B</div>' +
            GTO.cardsHtml(q.c2, 'lg') +
          '</div>' +
          (q.board && q.board.length ? (
            '<div class="eq-board"><div class="eq-lbl">當前公共牌（Flop）</div>' + GTO.cardsHtml(q.board, 'md') + '</div>'
          ) : '') +
        '</div>';
    }

    const optsHtml = q.opts.map((opt, idx) =>
      '<button type="button" class="mcq-opt" data-idx="' + idx + '">' +
        '<span class="kbd">' + (idx + 1) + '</span>' +
        '<span class="opt-txt">' + GTO.esc(opt) + '</span>' +
      '</button>'
    ).join('');

    stage.innerHTML =
      '<div class="card mcq-card">' +
        '<div class="mcq-top"><span class="chip info">' + GTO.esc(q.badge || 'GTO 測驗') + '</span></div>' +
        visualHtml +
        '<h2 class="mcq-q">' + GTO.esc(q.q) + '</h2>' +
        '<div class="mcq-opts" id="mcqOptsBox">' + optsHtml + '</div>' +
        '<div id="mcqExplainBox"></div>' +
      '</div>';

    stage.querySelectorAll('.mcq-opt').forEach((btn) => {
      btn.addEventListener('click', () => submitMcqAnswer(Number(btn.getAttribute('data-idx'))));
    });
  }

  function submitPreflopAnswer(chosenAct) {
    if (session.answered || !session.currentQ || session.currentQ.kind !== 'preflop') return;
    session.answered = true;
    const q = session.currentQ;
    const res = GTO.evaluateHandDecision(q.sc, q.hand, chosenAct, session.simpleJudge);

    session.total++;
    if (res.ok) { session.correct++; session.streak++; }
    else session.streak = 0;

    // 持久化記錄
    const pf = GTO.progress.preflop;
    GTO.bump(pf.byType, q.sc.cat, res.ok);
    GTO.bump(pf.byPos, q.sc.hero, res.ok);
    GTO.bump(pf.byScenario, q.sc.id, res.ok);
    if (!res.ok) {
      const mk = q.sc.id + ':' + q.hand;
      pf.missed[mk] = (pf.missed[mk] || 0) + 1;
    }
    GTO.recordAnswer('preflop', res.ok, {
      mistake: {
        kind: 'preflop',
        scId: q.sc.id,
        title: q.sc.title,
        hand: q.hand,
        chosen: chosenAct,
        best: res.bestAction,
      }
    });
    updateScoreboard();

    // 標示按鈕狀態
    const stage = activeRoot.querySelector('#quizStageArea');
    stage.querySelectorAll('.act-choice-btn').forEach((btn) => {
      const a = btn.getAttribute('data-act');
      if (res.acceptable.includes(a)) btn.classList.add('ans-correct');
      else if (a === chosenAct && !res.ok) btn.classList.add('ans-wrong');
    });

    // 右側顯示完整 13×13 範圍表與解說
    const fb = stage.querySelector('#preflopFeedbackBox');
    const pLabel = GTO.ACTIONS[q.sc.primaryAction].label;
    const chosenLabel = GTO.ACTIONS[chosenAct].label;
    const bestLabel = GTO.ACTIONS[res.bestAction].label;

    fb.innerHTML =
      '<div class="qfb-head ' + (res.ok ? 'ok' : 'bad') + '">' +
        '<div>' +
          '<div class="qfb-verdict">' +
            (res.ok ? '✅ 答對了！' : '❌ 答錯了！你選了「' + chosenLabel + '」，標準動作為「' + bestLabel + '」') +
            (res.isMixed ? ' <span class="chip warn">混合頻率牌</span>' : '') +
          '</div>' +
          '<div class="qfb-explain">' + GTO.explainHand(q.sc, q.hand) + '</div>' +
        '</div>' +
        '<button type="button" class="btn primary" id="nextPreflopQBtn">下一題 (Space) →</button>' +
      '</div>' +
      '<div class="qfb-chart-head">' +
        '<span>📊 <strong>' + GTO.esc(q.sc.title) + '</strong> 完整範圍對照（已標示 <span class="hand">' + q.hand + '</span>）：</span>' +
        '<a class="btn-xs" href="#/ranges/' + q.sc.id + '">在範圍表頁打開</a>' +
      '</div>' +
      '<div id="qfbGridSlot"></div>' +
      '<div class="embed-legend">' +
        '<span class="lg-item"><i class="sw act-' + q.sc.primaryAction + '"></i>' + pLabel + '</span>' +
        (q.sc.secondaryAction ? '<span class="lg-item"><i class="sw act-call"></i>跟注</span>' : '') +
        '<span class="lg-item"><i class="sw act-fold"></i>棄牌</span>' +
      '</div>';

    GTO.renderGrid(fb.querySelector('#qfbGridSlot'), q.sc, {
      selectedHand: q.hand,
      simple: false,
    });

    fb.querySelector('#nextPreflopQBtn').addEventListener('click', () => nextQuestion());
  }

  function submitMcqAnswer(idx) {
    if (session.answered || !session.currentQ) return;
    session.answered = true;
    const q = session.currentQ;
    const ok = idx === q.ans;

    session.total++;
    if (ok) { session.correct++; session.streak++; }
    else session.streak = 0;

    if (q.qid) GTO.bump(GTO.progress.qstats, q.qid, ok);
    GTO.recordAnswer(q.mode || 'theory', ok, {
      mistake: {
        kind: 'mcq',
        mode: q.mode,
        badge: q.badge,
        q: q.q,
        chosen: q.opts[idx],
        best: q.opts[q.ans],
        exp: q.exp,
      }
    });
    updateScoreboard();

    const stage = activeRoot.querySelector('#quizStageArea');
    stage.querySelectorAll('.mcq-opt').forEach((btn, i) => {
      if (i === q.ans) btn.classList.add('ans-correct');
      else if (i === idx && !ok) btn.classList.add('ans-wrong');
    });

    const expBox = stage.querySelector('#mcqExplainBox');
    expBox.innerHTML =
      '<div class="mcq-feedback ' + (ok ? 'ok' : 'bad') + '">' +
        '<div class="mfb-top">' +
          '<strong>' + (ok ? '✅ 回答正確！' : '❌ 回答錯誤 — 正確答案為：「' + GTO.esc(q.opts[q.ans]) + '」') + '</strong>' +
          '<div class="mfb-btns">' +
            (q.lessonLink ? '<a class="btn-xs" href="' + q.lessonLink + '">📖 閱讀對應課程</a>' : '') +
            '<button type="button" class="btn primary" id="nextMcqBtn">下一題 (Space) →</button>' +
          '</div>' +
        '</div>' +
        (q.expHtml ? '<div class="mfb-exp">' + q.expHtml + '</div>' : '<p class="mfb-exp">' + GTO.esc(q.exp) + '</p>') +
      '</div>';

    expBox.querySelector('#nextMcqBtn').addEventListener('click', () => nextQuestion());
  }

  // 全域鍵盤快捷鍵支援（當在 #/quiz 頁面時）
  window.addEventListener('keydown', (e) => {
    if (!location.hash.startsWith('#/quiz')) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
    if (session.mode === 'paint') return;

    if (session.answered && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      nextQuestion();
      return;
    }
    if (!session.answered && session.currentQ && /^[1-4]$/.test(e.key)) {
      const n = Number(e.key) - 1;
      if (session.currentQ.kind === 'preflop') {
        if (session.currentQ.actions[n]) {
          e.preventDefault();
          submitPreflopAnswer(session.currentQ.actions[n]);
        }
      } else if (session.currentQ.opts && session.currentQ.opts[n] !== undefined) {
        e.preventDefault();
        submitMcqAnswer(n);
      }
    }
  });

  function teardownQuiz() {
    stopPaintDrag();
    activeRoot = null;
  }

  Object.assign(GTO, {
    QUIZ_MODES,
    renderPracticeHub,
    renderQuizPage,
    generatePreflopQuestion,
    nextQuestion,
    teardownQuiz,
  });
})();

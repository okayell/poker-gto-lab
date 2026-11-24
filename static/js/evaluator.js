/* GTO 撲克學院 — evaluator.js
 * 7 張牌牌力評估（無查表、位元運算）+ Monte Carlo 勝率模擬（手牌 / 範圍 vs 手牌 / 範圍）。
 * 牌以 int 表示：rank*4 + suit，rank 2=0 … A=12。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  const CAT_NAMES = ['高牌', '一對', '兩對', '三條', '順子', '同花', '葫蘆', '四條', '同花順'];

  const counts = new Int32Array(13);
  const suitMask = new Int32Array(4);
  const suitCnt = new Int32Array(4);

  function straightHigh(mask) {
    for (let hi = 12; hi >= 4; hi--) {
      const m = 0x1f << (hi - 4);
      if ((mask & m) === m) return hi;
    }
    if ((mask & 0x100f) === 0x100f) return 3; // A-2-3-4-5（wheel）
    return -1;
  }

  function topBits(mask, n) {
    // 取出 mask 中最高的 n 個 rank，打包成 4-bit nibble
    let v = 0, k = 0;
    for (let r = 12; r >= 0 && k < n; r--) {
      if (mask & (1 << r)) { v = (v << 4) | r; k++; }
    }
    while (k < n) { v <<= 4; k++; }
    return v;
  }

  /** 評估 n 張牌（5–7 張），回傳可比較的整數分數（越大越好）。 */
  function evalCards(cards, n) {
    counts.fill(0); suitMask.fill(0); suitCnt.fill(0);
    let rankMask = 0;
    for (let i = 0; i < n; i++) {
      const c = cards[i], r = c >> 2, s = c & 3;
      counts[r]++; suitMask[s] |= 1 << r; suitCnt[s]++; rankMask |= 1 << r;
    }
    // 同花 / 同花順
    for (let s = 0; s < 4; s++) {
      if (suitCnt[s] >= 5) {
        const sf = straightHigh(suitMask[s]);
        if (sf >= 0) return (8 << 20) | (sf << 16);
        return (5 << 20) | topBits(suitMask[s], 5);
      }
    }
    let quad = -1, trips1 = -1, trips2 = -1, pair1 = -1, pair2 = -1;
    for (let r = 12; r >= 0; r--) {
      const k = counts[r];
      if (k === 4) quad = r;
      else if (k === 3) { if (trips1 < 0) trips1 = r; else if (trips2 < 0) trips2 = r; }
      else if (k === 2) { if (pair1 < 0) pair1 = r; else if (pair2 < 0) pair2 = r; }
    }
    if (quad >= 0) {
      const kick = topBits(rankMask & ~(1 << quad), 1);
      return (7 << 20) | (quad << 16) | (kick << 12);
    }
    if (trips1 >= 0 && (trips2 >= 0 || pair1 >= 0)) {
      const p = Math.max(trips2, pair1);
      return (6 << 20) | (trips1 << 16) | (p << 12);
    }
    const st = straightHigh(rankMask);
    if (st >= 0) return (4 << 20) | (st << 16);
    if (trips1 >= 0) {
      const k = topBits(rankMask & ~(1 << trips1), 2);
      return (3 << 20) | (trips1 << 16) | (k << 8);
    }
    if (pair1 >= 0 && pair2 >= 0) {
      const k = topBits(rankMask & ~(1 << pair1) & ~(1 << pair2), 1);
      return (2 << 20) | (pair1 << 16) | (pair2 << 12) | (k << 8);
    }
    if (pair1 >= 0) {
      const k = topBits(rankMask & ~(1 << pair1), 3);
      return (1 << 20) | (pair1 << 16) | (k << 4);
    }
    return topBits(rankMask, 5);
  }

  // ---------------------------------------------------------------------------
  // 範圍 → 具體組合
  // ---------------------------------------------------------------------------
  /**
   * 把輸入轉成組合清單：
   *  - 具體牌："AsKh" → [[c1,c2]]
   *  - 範圍字串："QQ+, AKs, A5s:50" → 依權重展開
   *  - 物件 {hand: weight}
   * 回傳 { combos: [[c1,c2,w], ...], label, exact: bool }
   */
  function toCombos(input) {
    if (input && typeof input === 'object' && !Array.isArray(input)) {
      return { combos: rangeObjToCombos(input), exact: false };
    }
    const s = String(input || '').trim();
    if (!s) return { combos: [], exact: false };
    const cards = GTO.parseCards(s);
    if (cards && cards.length === 2) {
      const a = GTO.cardToInt(cards[0]), b = GTO.cardToInt(cards[1]);
      if (a === b) throw new Error('兩張牌不能相同');
      return { combos: [[a, b, 1]], exact: true };
    }
    return { combos: rangeObjToCombos(GTO.parseRange(s)), exact: false };
  }

  function rangeObjToCombos(obj) {
    const out = [];
    for (const h in obj) {
      const w = obj[h];
      if (!(w > 0)) continue;
      for (const [a, b] of GTO.handCombos(h)) out.push([a, b, w]);
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Monte Carlo 勝率
  // ---------------------------------------------------------------------------
  /**
   * @param {Array} players  每位玩家的組合清單（toCombos().combos）
   * @param {Array<number>} board 已知公共牌（int）
   * @param {number} iters 模擬次數
   * @return {{equity:number[], win:number[], tie:number[], iters:number}}
   */
  function simulate(players, board, iters) {
    const n = players.length;
    const eq = new Float64Array(n), win = new Float64Array(n), tie = new Float64Array(n);
    const dead = new Uint8Array(52);
    for (const c of board) dead[c] = 1;
    const filtered = players.map((list) => list.filter((cb) => !dead[cb[0]] && !dead[cb[1]]));
    if (filtered.some((l) => !l.length)) throw new Error('有玩家的範圍與公共牌衝突，沒有可用組合');
    const cumW = filtered.map((list) => {
      const arr = new Float64Array(list.length);
      let t = 0;
      for (let i = 0; i < list.length; i++) { t += list[i][2]; arr[i] = t; }
      return arr;
    });
    const hands = new Array(n);
    const used = new Uint8Array(52);
    const seven = new Int32Array(7);
    const scores = new Int32Array(n);
    const need = 5 - board.length;
    let done = 0, attempts = 0;
    const maxAttempts = iters * 50;
    while (done < iters && attempts < maxAttempts) {
      attempts++;
      used.fill(0);
      for (const c of board) used[c] = 1;
      let ok = true;
      for (let p = 0; p < n; p++) {
        const list = filtered[p], cw = cumW[p];
        let cb;
        if (list.length === 1) cb = list[0];
        else {
          const x = Math.random() * cw[cw.length - 1];
          let lo = 0, hi = cw.length - 1;
          while (lo < hi) { const mid = (lo + hi) >> 1; if (cw[mid] < x) lo = mid + 1; else hi = mid; }
          cb = list[lo];
        }
        if (used[cb[0]] || used[cb[1]]) { ok = false; break; }
        used[cb[0]] = 1; used[cb[1]] = 1;
        hands[p] = cb;
      }
      if (!ok) continue;
      // 補公共牌
      const bd = board.slice();
      for (let k = 0; k < need; k++) {
        let c;
        do { c = (Math.random() * 52) | 0; } while (used[c]);
        used[c] = 1;
        bd.push(c);
      }
      let best = -1, nBest = 0;
      for (let p = 0; p < n; p++) {
        seven[0] = hands[p][0]; seven[1] = hands[p][1];
        for (let k = 0; k < 5; k++) seven[2 + k] = bd[k];
        const sc = evalCards(seven, 7);
        scores[p] = sc;
        if (sc > best) { best = sc; nBest = 1; } else if (sc === best) nBest++;
      }
      for (let p = 0; p < n; p++) {
        if (scores[p] === best) {
          eq[p] += 1 / nBest;
          if (nBest === 1) win[p]++; else tie[p]++;
        }
      }
      done++;
    }
    if (!done) throw new Error('無法產生有效的模擬（範圍互相衝突）');
    return {
      equity: Array.from(eq, (x) => x / done),
      win: Array.from(win, (x) => x / done),
      tie: Array.from(tie, (x) => x / done),
      iters: done,
    };
  }

  /** 兩個具體手牌（字串陣列）的翻前勝率（Monte Carlo）。 */
  function handVsHand(c1, c2, iters, board) {
    const p1 = [[GTO.cardToInt(c1[0]), GTO.cardToInt(c1[1]), 1]];
    const p2 = [[GTO.cardToInt(c2[0]), GTO.cardToInt(c2[1]), 1]];
    const bd = (board || []).map(GTO.cardToInt);
    return simulate([p1, p2], bd, iters || 20000);
  }

  Object.assign(GTO, { evalCards, CAT_NAMES, toCombos, simulate, handVsHand });
})();

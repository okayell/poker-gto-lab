/* GTO 撲克學院 — drills.js
 * 新手入門練習（無限隨機題，接在 quiz.js 的練習引擎上）：
 *   showdown  誰贏了？（比牌、踢腳、平分）
 *   handname  牌型辨識（7 選 5 的最大牌型）
 *   outs      數 Outs（已知對手牌，轉牌有幾張牌能反超）
 *   position  位置與行動順序（看按鈕找位置）
 * 每個產生器回傳 quiz.js 的選擇題物件：{ kind:'mcq', mode, badge, q, opts, ans, exp, expHtml, visualHtml }
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const pk = () => GTO.pk;

  const handBox = (label, cards, extra) => '<div class="dr-hand"><span class="lbl">' + label + '</span>' + GTO.cardsHtml(cards, 'lg') + (extra || '') + '</div>';
  const boardBox = (cards, label) => '<div class="dr-board"><span class="lbl">' + (label || '公共牌') + '</span>' + GTO.cardsHtml(cards, 'lg') + '</div>';

  // ===========================================================================
  // 1. 誰贏了？
  // ===========================================================================
  function genShowdown() {
    const three = Math.random() < 0.22;
    let board, hands, results, winner;
    if (!three) {
      const d = pk().dealShowdown();
      board = d.board; hands = d.hands; results = d.results; winner = d.winner;
    } else {
      const cards = pk().drawCards(11);
      board = cards.slice(0, 5);
      hands = [cards.slice(5, 7), cards.slice(7, 9), cards.slice(9, 11)];
      results = hands.map((h) => pk().bestFive(h.concat(board)));
      const best = Math.max.apply(null, results.map((r) => r.score));
      const winners = results.map((r, i) => (r.score === best ? i : -1)).filter((i) => i >= 0);
      winner = winners.length > 1 ? 3 : winners[0];
    }
    const names = three ? ['玩家 A', '玩家 B', '玩家 C'] : ['玩家 A', '玩家 B'];
    const opts = names.map((n) => n + ' 贏').concat(['平分底池']);
    const ans = (three ? winner === 3 : winner === 2) ? opts.length - 1 : winner;
    const visualHtml = '<div class="dr-stage">' + boardBox(board) + '<div class="dr-hands">' +
      hands.map((h, i) => handBox(names[i], h)).join('') + '</div></div>';
    const resHtml = '<div class="dr-results">' + results.map((r, i) => {
      const win = ans === opts.length - 1 ? r.score === Math.max.apply(null, results.map((x) => x.score)) : i === ans;
      return '<div class="dr-res ' + (win ? 'win' : '') + '"><b>' + names[i] + (win ? ' 🏆' : '') + '</b><span>' + r.desc + '</span>' + GTO.cardsHtml(r.five, 'mini') + '</div>';
    }).join('') + '</div>';
    const cats = results.map((r) => r.cat);
    const why = ans === opts.length - 1 ? '最佳五張牌一樣大（常見情況：大家都用公共牌、或踢腳也相同），所以平分底池。'
      : cats.filter((c) => c === results[ans].cat).length > 1
        ? '同樣是「' + results[ans].name + '」時，要依序比較點數與踢腳，' + names[ans] + ' 比較大。'
        : names[ans] + ' 的「' + results[ans].name + '」牌型最大。';
    return {
      kind: 'mcq', mode: 'showdown', badge: '🏆 誰贏了？' + (three ? '（3 人攤牌）' : ''),
      q: '攤牌了！依照牌型大小，誰贏得底池？', opts, ans,
      exp: why, expHtml: '<p>' + why + '</p>' + resHtml + '<p class="muted small">記得：7 張牌裡任選最好的 5 張；花色沒有大小；「第 6 張」不會拿來比。</p>',
      visualHtml, lessonLink: '#/learn/hand-rankings',
    };
  }

  // ===========================================================================
  // 2. 牌型辨識
  // ===========================================================================
  const CAT_WEIGHTS = [[0, 8], [1, 13], [2, 14], [3, 12], [4, 14], [5, 14], [6, 12], [7, 7], [8, 6]];
  const CAT_TIP = [
    '沒有任何組合時，比最大的單張。',
    '一對時，三張踢腳也很重要。',
    '兩對只取最大的兩組對子 + 最大的踢腳。',
    '三條：口袋對子中公共牌叫 Set，公共牌成對叫 Trips。',
    '順子：A 可以當 1（A-2-3-4-5），但不能繞圈。',
    '同花：五張同花色就好，不必連續；同花大於順子。',
    '葫蘆：三條 + 一對，先比三條。',
    '四條：四張同點數。',
    '同花順：同花色又連續，A 高的叫皇家同花順。',
  ];
  function makeSevenOfCat(cat) {
    const S = GTO.SUITS, R = GTO.RANKS;
    if (cat === 8) {
      const suit = GTO.pick(S.split(''));
      const top = 3 + GTO.randInt(10); // 3 = 5 高（A-2-3-4-5）… 12 = A 高（皇家）
      const low = '23456789TJQKA';
      const ranks = [];
      for (let k = 0; k < 5; k++) { const idx = top - k; ranks.push(idx < 0 ? 'A' : low[idx]); }
      const five = ranks.map((r) => r + suit);
      return five.concat(pk().drawCards(2, five));
    }
    if (cat === 7) {
      const r = GTO.pick(R.split(''));
      const four = S.split('').map((s) => r + s);
      return four.concat(pk().drawCards(3, four));
    }
    for (let t = 0; t < 6000; t++) {
      const c = pk().drawCards(7);
      if (pk().bestFive(c).cat === cat) return c;
    }
    return null;
  }
  function genHandName() {
    const target = GTO.weightedPick(CAT_WEIGHTS, (x) => x[1])[0];
    let cards = makeSevenOfCat(target);
    if (!cards) cards = pk().drawCards(7);
    cards = GTO.shuffle(cards);
    const hole = cards.slice(0, 2), board = cards.slice(2);
    const best = pk().bestFive(cards);
    const label = (c) => (c === 9 ? '皇家同花順' : GTO.CAT_NAMES[c]);
    const correctCat = best.name === '皇家同花順' ? 9 : best.cat;
    const pool = [];
    for (let d = 1; d <= 3; d++) { [correctCat - d, correctCat + d].forEach((c) => { if (c >= 0 && c <= 9 && c !== correctCat && !pool.includes(c)) pool.push(c); }); }
    const opts = GTO.shuffle([correctCat].concat(GTO.shuffle(pool.slice(0, 5)).slice(0, 3))).map(label);
    const ans = opts.indexOf(label(correctCat));
    const usedHole = hole.filter((c) => best.five.includes(c)).length;
    const why = '最佳五張是「' + best.desc + '」。' + (usedHole === 0 ? '這手牌兩張底牌都沒用到——最大的五張全在公共牌上（Play the Board）。' : '用了 ' + usedHole + ' 張底牌 + ' + (5 - usedHole) + ' 張公共牌。') + CAT_TIP[best.cat];
    return {
      kind: 'mcq', mode: 'handname', badge: '🃏 牌型辨識',
      q: '用你的 2 張底牌 + 5 張公共牌，任選 5 張，最大能組成什麼牌型？', opts, ans,
      exp: why,
      expHtml: '<p>' + why + '</p><div class="dr-results"><div class="dr-res win"><b>最佳五張</b><span>' + best.desc + '</span>' + GTO.cardsHtml(best.five, 'md') + '</div></div>',
      visualHtml: '<div class="dr-stage">' + boardBox(board) + '<div class="dr-hands">' + handBox('你的底牌', hole) + '</div></div>',
      lessonLink: '#/learn/hand-rankings',
    };
  }

  // ===========================================================================
  // 3. 數 Outs
  // ===========================================================================
  function analyzeOuts(hero, villain, flop) {
    const used = new Set(hero.concat(villain, flop));
    const deck = pk().fullDeck().filter((c) => !used.has(c));
    const h0 = pk().bestFive(hero.concat(flop)), v0 = pk().bestFive(villain.concat(flop));
    const outs = [], dirty = [];
    deck.forEach((c) => {
      const h = pk().bestFive(hero.concat(flop, [c])), v = pk().bestFive(villain.concat(flop, [c]));
      if (h.score > v.score) outs.push({ c, name: h.name });
      else if (h.cat > h0.cat) dirty.push({ c, name: h.name, vname: v.name });
    });
    return { h0, v0, outs, dirty, behind: v0.score > h0.score };
  }
  function genOuts() {
    let pickDeal = null, anyDeal = null;
    const wantDraw = Math.random() < 0.75;
    for (let t = 0; t < 400 && !pickDeal; t++) {
      const cards = pk().drawCards(7);
      const hero = cards.slice(0, 2), villain = cards.slice(2, 4), flop = cards.slice(4, 7);
      if (new Set(flop.map((c) => c[0])).size < 3) continue; // 避開公共牌成對（雙方都「一對」的怪題）
      const a = analyzeOuts(hero, villain, flop);
      if (!a.behind || a.outs.length < 2 || a.outs.length > 17 || a.v0.cat < 1) continue;
      const deal = { hero, villain, flop, a };
      if (!anyDeal) anyDeal = deal;
      const isDraw = a.outs.some((o) => o.name === '同花' || o.name === '順子');
      if (!wantDraw || isDraw) pickDeal = deal;
    }
    const d = pickDeal || anyDeal;
    if (!d) return genHandName();
    const n = d.a.outs.length;
    const cand = new Set([n]);
    const tries = [n + d.a.dirty.length, n + 1, n - 1, n + 2, n - 2, n + 3, n + 4, n - 3, n * 2];
    for (const x of GTO.shuffle(tries)) { if (cand.size >= 4) break; if (x > 0 && x <= 24) cand.add(x); }
    let k = 1;
    while (cand.size < 4) { cand.add(n + 4 + k); k++; }
    const nums = GTO.shuffle(Array.from(cand));
    const opts = nums.map((x) => x + ' 張');
    const ans = nums.indexOf(n);
    // 依完成牌型分組
    const groups = {};
    d.a.outs.forEach((o) => { (groups[o.name] = groups[o.name] || []).push(o.c); });
    const groupHtml = Object.keys(groups).map((g) => '<div class="dr-outs-row"><b>' + g + '（' + groups[g].length + ' 張）</b>' + GTO.cardsHtml(groups[g], 'mini') + '</div>').join('');
    const dirtyHtml = d.a.dirty.length ? '<div class="dr-outs-row dirty"><b>髒 outs（你變大，但對手更大）' + d.a.dirty.length + ' 張</b>' + GTO.cardsHtml(d.a.dirty.map((x) => x.c), 'mini') + '</div>' : '';
    const est = n * 2;
    const why = '你現在是「' + d.a.h0.desc + '」，對手是「' + d.a.v0.desc + '」，你落後。轉牌共有 ' + n + ' 張牌能讓你反超。' +
      '二四法則：只看轉牌一張 ≈ ' + n + ' × 2 = ' + est + '%（精確 ' + (n / 45 * 100).toFixed(1) + '%，因為已知 7 張牌、剩 45 張）。';
    return {
      kind: 'mcq', mode: 'outs', badge: '🎲 數 Outs（翻牌 → 轉牌）',
      q: '假設你看得到對手的牌。轉牌有幾張牌能讓你「反超領先」？', opts, ans,
      exp: why,
      expHtml: '<p>' + why + '</p><div class="dr-outs">' + groupHtml + dirtyHtml + '</div><p class="muted small">實戰看不到對手的牌，所以要靠「對手可能的範圍」估算 outs，並把會幫到對手的牌打折扣。</p>',
      visualHtml: '<div class="dr-stage">' + boardBox(d.flop, '翻牌') + '<div class="dr-hands">' + handBox('你', d.hero, '<small>' + d.a.h0.name + '</small>') +
        handBox('對手（攤開給你看）', d.villain, '<small>' + d.a.v0.name + '</small>') + '</div></div>',
      lessonLink: '#/learn/outs-odds',
    };
  }

  // ===========================================================================
  // 4. 位置與行動順序
  // ===========================================================================
  const POS_Q = [
    { pos: 'BB', q: '誰是大盲（BB）？', why: '按鈕（D）左手邊第 2 位是大盲 BB，要強制放 1bb。' },
    { pos: 'SB', q: '誰是小盲（SB）？', why: '按鈕（D）左手邊第 1 位是小盲 SB，要強制放 0.5bb。' },
    { pos: 'UTG', q: '翻牌前，誰第一個行動？', why: '翻前由大盲左手邊的 UTG（槍口位）先說話。' },
    { pos: 'BB', q: '翻牌前，誰最後一個行動？', why: '翻前最後說話的是大盲 BB（他已經放了 1bb）。' },
    { pos: 'SB', q: '假設所有人都看翻牌，翻牌後誰第一個行動？', why: '翻牌後由按鈕左邊第一位還在牌局的人先說話，所有人都在時就是 SB。' },
    { pos: 'BTN', q: '翻牌後，誰永遠最後行動？', why: '按鈕位 BTN 翻牌後永遠最後行動——這就是它最賺錢的原因。' },
    { pos: 'CO', q: '誰是關煞位（CO）？', why: 'CO 是按鈕右手邊（逆時針）第 1 位，也就是按鈕前一位。' },
    { pos: 'HJ', q: '誰是劫持位（HJ）？', why: 'HJ 在 CO 的右手邊，也就是 UTG 之後的下一位。' },
  ];
  function genPosition() {
    const k = GTO.randInt(6);
    const base = pk().SEAT_ORDER;
    const order = base.map((_, i) => base[(i + k) % 6]);
    const qq = GTO.pick(POS_Q);
    const correctSeat = order.indexOf(qq.pos);
    const seatName = (i) => (i + 1) + ' 號';
    const others = GTO.shuffle([0, 1, 2, 3, 4, 5].filter((i) => i !== correctSeat)).slice(0, 3);
    const seatsIdx = GTO.shuffle([correctSeat].concat(others));
    const opts = seatsIdx.map(seatName);
    const ans = seatsIdx.indexOf(correctSeat);
    const hidden = {}, shown = {};
    order.forEach((p, i) => {
      hidden[p] = { label: seatName(i) };
      shown[p] = { label: seatName(i), sub: p, hl: i === correctSeat };
    });
    return {
      kind: 'mcq', mode: 'position', badge: '🧭 位置與行動順序',
      q: qq.q + '（D = 莊家按鈕，行動順時針進行）', opts, ans,
      exp: qq.why,
      expHtml: '<p>' + qq.why + '</p>' + pk().miniTable({ seats: shown, order, cls: 'sm', centerNote: '答案：' + seatName(correctSeat) + ' = ' + qq.pos }),
      visualHtml: '<div class="dr-stage">' + pk().miniTable({ seats: hidden, order, cls: 'sm' }) + '</div>',
      lessonLink: '#/learn/positions',
    };
  }

  // ===========================================================================
  // 5. 牌面判讀（翻牌結構 → C-Bet 思路）
  // ===========================================================================
  const RLOW = '23456789TJQKA';
  const TEXTURES = {
    dry: { label: '乾燥牌面（彩虹、不連接）', plan: '高頻率小注（約 1/3 池）', why: '三張牌花色不同又不連接，聽牌很少、對手很難中牌。翻前加注者範圍優勢大，可以用小注頻繁持續下注。' },
    wet: { label: '濕潤牌面（同花＋順子聽牌多）', plan: '降低頻率、偏大注（約 2/3 池）並多過牌', why: '兩張同花又彼此相連，跟注者的同花聽、順子聽、兩對很多。加注者要更挑牌：強牌與好聽牌下大注保護，其餘多過牌。' },
    mono: { label: '單色牌面（三張同花）', plan: '謹慎、低頻率小注，持有同花 / 大同花阻擋牌時才積極', why: '翻牌已經三張同花，任何持有該花色的牌都可能成同花或聽堅果同花。下注要小、頻率要低，持有 A 同花阻擋牌時可以更積極。' },
    paired: { label: '配對牌面（公共牌有對子）', plan: '高頻率小注（雙方都很難中三條）', why: '公共牌成對時，雙方中三條的組合都很少，誰都很難「中牌」。加注者通常用小注高頻持續下注，讓對手的空氣牌直接棄牌。' },
  };
  function flopTexture(flop) {
    const r = flop.map((c) => RLOW.indexOf(c[0])).sort((a, b) => b - a);
    const suitCnt = {};
    flop.forEach((c) => { suitCnt[c[1]] = (suitCnt[c[1]] || 0) + 1; });
    const maxSuit = Math.max.apply(null, Object.values(suitCnt));
    const paired = new Set(r).size < 3;
    if (new Set(r).size === 1) return null;
    if (paired) return maxSuit <= 2 ? 'paired' : null;
    if (maxSuit === 3) return 'mono';
    const span = r[0] - r[2];
    const wheelSpan = r[0] === 12 ? Math.max(r[1], r[2]) + 1 : 99; // A 當 1
    const minGap = Math.min(r[0] - r[1], r[1] - r[2]);
    if (maxSuit === 2 && (span <= 4 || wheelSpan <= 4)) return 'wet';
    if (maxSuit === 1 && minGap >= 3 && span >= 6 && wheelSpan > 4) return 'dry';
    return null;
  }
  function genTexture() {
    const want = GTO.pick(Object.keys(TEXTURES));
    let flop = null, tex = null;
    for (let t = 0; t < 3000; t++) {
      const f = pk().drawCards(3);
      const x = flopTexture(f);
      if (x === want) { flop = f; tex = x; break; }
      if (x && !flop) { flop = f; tex = x; }
    }
    const T = TEXTURES[tex];
    const askPlan = Math.random() < 0.5;
    const keys = GTO.shuffle(Object.keys(TEXTURES));
    const opts = keys.map((k) => (askPlan ? TEXTURES[k].plan : TEXTURES[k].label));
    const ans = keys.indexOf(tex);
    const why = '這是「' + T.label + '」。' + T.why;
    return {
      kind: 'mcq', mode: 'texture', badge: '🧩 牌面判讀' + (askPlan ? '（C-Bet 思路）' : '（結構分類）'),
      q: askPlan ? '你翻前加注、對手跟注。在這種翻牌，你（翻前加注者）比較適合怎麼持續下注？' : '這個翻牌屬於哪一種牌面結構？', opts, ans,
      exp: why,
      expHtml: '<p>' + why + '</p><p class="muted small">這是 Solver 的「大方向」：實際頻率還會受位置、SPR、雙方範圍影響。</p>',
      visualHtml: '<div class="dr-stage">' + boardBox(GTO.shuffle(flop), '翻牌') + '</div>',
      lessonLink: '#/learn/board-texture',
    };
  }

  // ===========================================================================
  // 6. 找堅果（這個公共牌面最大的可能牌型）
  // ===========================================================================
  const NUT_LABELS = ['三條', '順子', '同花', '葫蘆', '四條', '同花順', '皇家同花順'];
  function genNuts() {
    const board = pk().drawCards(5);
    const used = new Set(board);
    const deck = pk().fullDeck().filter((c) => !used.has(c));
    const bInts = board.map(GTO.cardToInt);
    const seven = new Array(7);
    for (let k = 0; k < 5; k++) seven[k + 2] = bInts[k];
    let best = -1, bestCombos = [];
    for (let i = 0; i < deck.length; i++) {
      for (let j = i + 1; j < deck.length; j++) {
        seven[0] = GTO.cardToInt(deck[i]); seven[1] = GTO.cardToInt(deck[j]);
        const sc = GTO.evalCards(seven, 7);
        if (sc > best) { best = sc; bestCombos = [[deck[i], deck[j]]]; }
        else if (sc === best && bestCombos.length < 6) bestCombos.push([deck[i], deck[j]]);
      }
    }
    const ex = pk().bestFive(bestCombos[0].concat(board));
    const label = ex.name;
    const pool = NUT_LABELS.filter((l) => l !== label && !(label === '皇家同花順' && l === '同花順'));
    const opts = GTO.shuffle([label].concat(GTO.shuffle(pool).slice(0, 3)));
    const ans = opts.indexOf(label);
    const pairedB = new Set(board.map((c) => c[0])).size < 5;
    const sc = {};
    board.forEach((c) => { sc[c[1]] = (sc[c[1]] || 0) + 1; });
    const flushB = Math.max.apply(null, Object.values(sc)) >= 3;
    const why = '這個牌面最大的可能牌型（堅果）是「' + ex.desc + '」。檢查順序：① 公共牌' + (pairedB ? '有對子 → 可能出現葫蘆 / 四條' : '沒有對子 → 不可能有葫蘆 / 四條') +
      '；② ' + (flushB ? '有三張以上同花 → 可能同花' : '沒有三張同花 → 不可能同花') + '；③ 看有沒有三張牌能湊成順子。';
    return {
      kind: 'mcq', mode: 'nuts', badge: '💎 找堅果',
      q: '看公共牌：這個牌面上「最大的可能牌型」（堅果 The Nuts）是什麼？', opts, ans,
      exp: why,
      expHtml: '<p>' + why + '</p><div class="dr-results"><div class="dr-res win"><b>堅果例子</b>' + GTO.cardsHtml(bestCombos[0], 'md') + '<span>' + ex.desc + '</span>' + GTO.cardsHtml(ex.five, 'mini') + '</div></div>',
      visualHtml: '<div class="dr-stage">' + boardBox(board) + '</div>',
      lessonLink: '#/learn/reading-board',
    };
  }

  // ===========================================================================
  // 7. 翻後情境決策（題庫：postflop_spots.js）
  // ===========================================================================
  const spotRecent = [];
  const STREET_ZH = { flop: '翻牌', turn: '轉牌', river: '河牌' };
  function genSpot() {
    const all = GTO.POSTFLOP_SPOTS || [];
    if (!all.length) return genTexture();
    const fresh = all.filter((x) => !spotRecent.includes(x.id));
    const s = GTO.pick(fresh.length ? fresh : all);
    spotRecent.push(s.id);
    if (spotRecent.length > Math.min(30, Math.max(1, all.length - 1))) spotRecent.shift();
    const hero = GTO.parseCards(s.heroCards), board = GTO.parseCards(s.board);
    const lesson = GTO.LESSON_MAP && GTO.LESSON_MAP[s.topic];
    const st = STREET_ZH[s.street] || '';
    const visualHtml = '<div class="dr-stage spot-stage">' +
      '<div class="spot-meta"><span class="chip info">' + GTO.esc(s.hero + (s.villain ? ' vs ' + s.villain : '')) + '</span><span class="chip">' + st + '</span>' +
        '<span class="chip">底池 ' + GTO.fmtNum(s.pot, 1) + 'bb</span><span class="chip">有效籌碼 ' + GTO.fmtNum(s.stack, 1) + 'bb</span><span class="chip warn">SPR ' + (s.stack / s.pot).toFixed(1) + '</span></div>' +
      boardBox(board, st) +
      '<div class="dr-hands">' + handBox('你的手牌（' + GTO.esc(s.hero) + '）', hero) + '</div>' +
      '<div class="spot-history">📜 ' + GTO.esc(s.history) + '</div>' +
    '</div>';
    return {
      kind: 'mcq', mode: 'spots', qid: s.id, badge: '🎯 ' + s.title + ' · ' + '★'.repeat(s.lv || 1),
      q: s.q, opts: s.opts.slice(), ans: s.ans, exp: s.exp, visualHtml,
      lessonLink: lesson ? '#/learn/' + lesson.id : '#/learn',
    };
  }

  GTO.DRILLS = {
    spots: { icon: '🎯', title: '翻後情境決策', sub: '翻牌 / 轉牌 / 河牌：下注、過牌、跟注還是棄牌？', gen: genSpot, group: 'postflop' },
    showdown: { icon: '🏆', title: '誰贏了？', sub: '比牌大小、踢腳與平分', gen: genShowdown, group: 'beginner' },
    handname: { icon: '🃏', title: '牌型辨識', sub: '7 張牌找出最大牌型', gen: genHandName, group: 'beginner' },
    nuts: { icon: '💎', title: '找堅果', sub: '這個牌面最大可能是什麼牌？', gen: genNuts, group: 'beginner' },
    outs: { icon: '🎲', title: '數 Outs', sub: '幾張牌能讓你反超？', gen: genOuts, group: 'beginner' },
    position: { icon: '🧭', title: '位置與順序', sub: '看按鈕找出每個位置', gen: genPosition, group: 'beginner' },
    texture: { icon: '🧩', title: '牌面判讀', sub: '乾燥、濕潤、單色、配對與 C-Bet 思路', gen: genTexture, group: 'beginner' },
  };
})();

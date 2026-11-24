/* GTO 撲克學院 — widgets.js
 * 課程與百科可內嵌的互動元件：<div class="widget" data-widget="名稱"></div>
 *   hand-rankings / showdown-game / hand-walkthrough / position-table / hand-tiers /
 *   outs-table / draw-outs-examples / pot-odds-mini / bet-size-table / preflop-cheatsheet
 * 也提供共用撲克工具 GTO.pk（最佳五張、牌型白話描述、隨機發牌、迷你牌桌）給練習模式使用。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const esc = (s) => GTO.esc(s);

  // ===========================================================================
  // 共用撲克工具
  // ===========================================================================
  const RANK_LABEL = { A: 'A', K: 'K', Q: 'Q', J: 'J', T: '10', 9: '9', 8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2' };
  const RL = '23456789TJQKA';
  const rl = (r) => RANK_LABEL[r] || r;

  function fullDeck() {
    const d = [];
    for (const r of GTO.RANKS) for (const s of GTO.SUITS) d.push(r + s);
    return d;
  }
  function drawCards(n, exclude) {
    const ex = new Set(exclude || []);
    const deck = GTO.shuffle(fullDeck().filter((c) => !ex.has(c)));
    return deck.slice(0, n);
  }
  function scoreOf(cards) {
    const ints = cards.map(GTO.cardToInt);
    return GTO.evalCards(ints, ints.length);
  }
  /** 從 5–7 張牌找出最佳五張，回傳 { score, five, cat, name, desc } */
  function bestFive(cards) {
    let best = -1, bestSet = null;
    const n = cards.length;
    const idx = [0, 1, 2, 3, 4];
    const rec = (start, depth, chosen) => {
      if (depth === 5) {
        const set = chosen.map((i) => cards[i]);
        const sc = scoreOf(set);
        if (sc > best) { best = sc; bestSet = set; }
        return;
      }
      for (let i = start; i <= n - (5 - depth); i++) { chosen[depth] = i; rec(i + 1, depth + 1, chosen); }
    };
    if (n === 5) { best = scoreOf(cards); bestSet = cards.slice(); } else rec(0, 0, idx.slice());
    const five = sortFive(bestSet, best);
    return { score: best, five, cat: best >> 20, name: catName(best, five), desc: describe(best, five) };
  }
  function sortFive(five, score) {
    const cnt = {};
    five.forEach((c) => { cnt[c[0]] = (cnt[c[0]] || 0) + 1; });
    const arr = five.slice().sort((a, b) => (cnt[b[0]] - cnt[a[0]]) || (RL.indexOf(b[0]) - RL.indexOf(a[0])));
    const cat = score >> 20;
    if ((cat === 4 || cat === 8) && arr.some((c) => c[0] === 'A') && arr.some((c) => c[0] === '5') && !arr.some((c) => c[0] === 'K')) {
      // A-2-3-4-5：A 放最後
      const a = arr.filter((c) => c[0] === 'A');
      return arr.filter((c) => c[0] !== 'A').concat(a);
    }
    return arr;
  }
  function catName(score, five) {
    const cat = score >> 20;
    if (cat === 8 && five[0][0] === 'A') return '皇家同花順';
    return GTO.CAT_NAMES[cat];
  }
  function describe(score, five) {
    const cat = score >> 20;
    const ranks = five.map((c) => c[0]);
    const cnt = {};
    ranks.forEach((r) => { cnt[r] = (cnt[r] || 0) + 1; });
    const groups = Object.keys(cnt).sort((a, b) => (cnt[b] - cnt[a]) || (RL.indexOf(b) - RL.indexOf(a)));
    const kick = (arr) => arr.map(rl).join('、');
    switch (cat) {
      case 8: return five[0][0] === 'A' ? '皇家同花順' : '同花順（' + rl(ranks[0]) + ' 高）';
      case 7: return '四條 ' + rl(groups[0]) + '（踢腳 ' + rl(groups[1]) + '）';
      case 6: return '葫蘆：' + rl(groups[0]) + ' 帶 ' + rl(groups[1]);
      case 5: return '同花（' + kick(ranks) + '）';
      case 4: return ranks[0] === '5' && ranks[4] === 'A' ? '順子（A-2-3-4-5 最小順）' : '順子（' + rl(ranks[0]) + ' 高）';
      case 3: return '三條 ' + rl(groups[0]) + '（踢腳 ' + kick(groups.slice(1)) + '）';
      case 2: return '兩對：' + rl(groups[0]) + ' 和 ' + rl(groups[1]) + '（踢腳 ' + rl(groups[2]) + '）';
      case 1: return '一對 ' + rl(groups[0]) + '（踢腳 ' + kick(groups.slice(1)) + '）';
      default: return '高牌 ' + rl(groups[0]) + '（再比 ' + kick(groups.slice(1)) + '）';
    }
  }
  /** 比牌題：回傳 { board, hands, results, winner }，winner = 0 / 1 / 2（平分） */
  function dealShowdown() {
    const r = Math.random();
    const want = r < 0.16 ? 'tie' : r < 0.62 ? 'same' : 'any';
    let fallback = null;
    for (let t = 0; t < 60; t++) {
      const cards = drawCards(9);
      const board = cards.slice(0, 5), hands = [cards.slice(5, 7), cards.slice(7, 9)];
      const results = hands.map((h) => bestFive(h.concat(board)));
      const winner = results[0].score === results[1].score ? 2 : results[0].score > results[1].score ? 0 : 1;
      const deal = { board, hands, results, winner };
      if (!fallback) fallback = deal;
      if (want === 'tie' && winner === 2) return deal;
      if (want === 'same' && winner !== 2 && results[0].cat === results[1].cat && results[0].cat >= 1) return deal;
      if (want === 'any' && results[0].cat !== results[1].cat) return deal;
    }
    return fallback;
  }

  // ---------------------------------------------------------------------------
  // 迷你 6 人牌桌（BTN 在下方中央，順時針：BTN → SB → BB → UTG → HJ → CO）
  // ---------------------------------------------------------------------------
  const SEAT_ORDER = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
  function miniTable(o) {
    o = o || {};
    const seats = o.seats || {};
    const order = o.order || SEAT_ORDER;
    const seatHtml = order.map((pos, i) => {
      const s = seats[pos] || {};
      let cards = '';
      if (s.cards === 'back') cards = '<span class="mt-cards">' + GTO.cardBackHtml('sm') + GTO.cardBackHtml('sm') + '</span>';
      else if (Array.isArray(s.cards)) cards = '<span class="mt-cards">' + GTO.cardsHtml(s.cards, 'sm') + '</span>';
      const cls = ['mt-seat', 's' + i, s.folded ? 'folded' : '', s.hl ? 'hl' : '', s.hero ? 'hero' : '', o.clickable ? 'clickable' : ''].join(' ');
      return '<div class="' + cls + '" data-pos="' + pos + '">' +
        cards +
        '<div class="mt-badge"><strong>' + (s.label || pos) + '</strong>' + (s.en ? '<em>' + s.en + '</em>' : '') + (s.sub ? '<small>' + s.sub + '</small>' : '') + '</div>' +
        (s.order ? '<span class="mt-order">' + s.order + '</span>' : '') +
        (pos === (o.dealer || 'BTN') ? '<span class="mt-dealer" title="莊家按鈕">D</span>' : '') +
        (s.bet ? '<span class="mt-bet">' + s.bet + 'bb</span>' : '') +
        (s.say ? '<span class="mt-say">' + s.say + '</span>' : '') +
      '</div>';
    }).join('');
    const board = o.board && o.board.length
      ? GTO.cardsHtml(o.board, 'md')
      : (o.boardSlots ? '<span class="mt-slots">' + '<i></i>'.repeat(5) + '</span>' : '');
    return '<div class="mt-wrap ' + (o.cls || '') + '"><div class="mt-rail"><div class="mt-felt">' +
      '<div class="felt-inner-ring"></div>' +
      '<div class="mt-croupier" title="發牌荷官（固定座位，不參與牌局）"><span>🧑‍💼 荷官</span><small>Dealer（發牌）</small></div>' +
      '<div class="mt-center">' +
        (o.pot != null ? '<div class="mt-pot"><span class="pot-chip-stack" aria-hidden="true"></span><span>POT</span><strong>' + GTO.fmtNum(o.pot, 1) + ' BB</strong></div>' : '') +
        '<div class="mt-board">' + board + '</div>' +
        (o.centerNote ? '<div class="mt-note">' + o.centerNote + '</div>' : '') +
      '</div></div></div>' + seatHtml + '</div>';
  }

  GTO.pk = { fullDeck, drawCards, bestFive, dealShowdown, miniTable, SEAT_ORDER };

  // ===========================================================================
  // Widget：牌型大小階梯
  // ===========================================================================
  const RANKINGS = [
    { name: '皇家同花順', en: 'Royal Flush', cards: 'AsKsQsJsTs', p7: '0.003%', desc: '同一花色的 A-K-Q-J-10。其實就是「最大的同花順」，非常罕見，可能好幾年才遇到一次。' },
    { name: '同花順', en: 'Straight Flush', cards: '9h8h7h6h5h', p7: '0.03%', desc: '同一花色的五張連續牌。兩個同花順比較時看最大的那張；♠A-2-3-4-5 是最小的同花順。' },
    { name: '四條（鐵支）', en: 'Four of a Kind', cards: 'QsQhQdQc7s', p7: '0.17%', desc: '四張同點數 + 一張踢腳。先比四條的點數，若公共牌就是四條，再比第五張踢腳。' },
    { name: '葫蘆', en: 'Full House', cards: 'KsKhKd4c4s', p7: '2.6%', desc: '三條 + 一對。先比「三條」的點數，再比「一對」：K-K-K-4-4 大於 Q-Q-Q-A-A。' },
    { name: '同花', en: 'Flush', cards: 'AdJd8d5d2d', p7: '3.0%', desc: '五張同花色（不必連續）。從最大張開始逐張比較。記住：同花比順子大！' },
    { name: '順子', en: 'Straight', cards: 'Ts9h8d7c6s', p7: '4.6%', desc: '五張連續點數。A 可當最大（10-J-Q-K-A）或最小（A-2-3-4-5），但不能繞圈：Q-K-A-2-3 不是順子。' },
    { name: '三條', en: 'Three of a Kind', cards: '7s7h7dKc2s', p7: '4.8%', desc: '三張同點數 + 兩張踢腳。口袋對子配一張公共牌叫 Set（暗三條，很隱蔽）；一張底牌配公共牌對子叫 Trips（明三條）。' },
    { name: '兩對', en: 'Two Pair', cards: 'JsJhTdTc9s', p7: '23.5%', desc: '兩組對子 + 一張踢腳。先比大的對子、再比小的對子、最後比踢腳。' },
    { name: '一對', en: 'One Pair', cards: 'AsAh9d6c3s', p7: '43.8%', desc: '一組對子 + 三張踢腳。對子一樣大時，依序比踢腳（Kicker）——這是新手最常輸錢的地方！' },
    { name: '高牌', en: 'High Card', cards: 'AsJh8d5c3s', p7: '17.4%', desc: '什麼都沒湊成時，比最大的那張；一樣大再比第二張、第三張……' },
  ];
  function wHandRankings(el) {
    el.innerHTML =
      '<div class="w-card w-rankings">' +
        '<div class="w-head"><strong>🏆 牌型大小（由大到小）</strong><span class="muted">點任一列看說明 · 百分比 = 7 張牌最後湊成此牌型的機率</span></div>' +
        '<ol class="rk-list">' + RANKINGS.map((r, i) =>
          '<li class="rk-item' + (i === 8 ? ' open' : '') + '">' +
            '<button type="button" class="rk-row">' +
              '<span class="rk-no">' + (i + 1) + '</span>' +
              '<span class="rk-name"><b>' + r.name + '</b><small>' + r.en + '</small></span>' +
              '<span class="rk-cards">' + GTO.cardsHtml(GTO.parseCards(r.cards), 'mini') + '</span>' +
              '<span class="rk-prob">' + r.p7 + '</span>' +
              '<span class="rk-chev">▾</span>' +
            '</button>' +
            '<div class="rk-detail">' + r.desc + '</div>' +
          '</li>').join('') +
        '</ol>' +
        '<div class="w-foot">' +
          '<span>💡 口訣：<b>同花順 › 四條 › 葫蘆 › 同花 › 順子 › 三條 › 兩對 › 一對 › 高牌</b>；越難湊到越大，花色沒有大小。</span>' +
          '<span class="w-links"><a class="btn sm" href="#/quiz/showdown">🏆 比牌練習</a><a class="btn sm" href="#/quiz/handname">🃏 牌型辨識</a></span>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.rk-row');
      if (b && el.contains(b)) b.parentElement.classList.toggle('open');
    });
  }

  // ===========================================================================
  // Widget：誰贏了？比牌小遊戲
  // ===========================================================================
  function wShowdownGame(el) {
    const st = { a: 0, c: 0, deal: null, done: false };
    const render = () => {
      const d = st.deal = dealShowdown();
      st.done = false;
      el.innerHTML =
        '<div class="w-card w-showdown">' +
          '<div class="w-head"><strong>🏆 誰贏了？</strong><span class="chip info">答對 ' + st.c + ' / ' + st.a + '</span></div>' +
          '<div class="sd-board"><span class="lbl">公共牌</span>' + GTO.cardsHtml(d.board, 'md') + '</div>' +
          '<div class="sd-players">' +
            [0, 1].map((p) => '<div class="sd-p" data-p="' + p + '"><span class="lbl">玩家 ' + 'AB'[p] + '</span>' + GTO.cardsHtml(d.hands[p], 'md') + '<div class="sd-res"></div></div>').join('') +
          '</div>' +
          '<div class="sd-btns">' +
            '<button type="button" class="btn" data-ans="0">玩家 A 贏</button>' +
            '<button type="button" class="btn" data-ans="2">平分底池</button>' +
            '<button type="button" class="btn" data-ans="1">玩家 B 贏</button>' +
          '</div>' +
          '<div class="sd-feedback"></div>' +
        '</div>';
    };
    const answer = (ans, btn) => {
      if (st.done) return;
      st.done = true;
      const d = st.deal;
      const ok = ans === d.winner;
      st.a++; if (ok) st.c++;
      el.querySelectorAll('[data-ans]').forEach((b) => {
        const v = Number(b.getAttribute('data-ans'));
        if (v === d.winner) b.classList.add('ans-correct');
        else if (b === btn) b.classList.add('ans-wrong');
        b.disabled = true;
      });
      el.querySelectorAll('.sd-p').forEach((pEl, p) => {
        const r = d.results[p];
        pEl.classList.toggle('win', d.winner === p || d.winner === 2);
        pEl.querySelector('.sd-res').innerHTML = '<b>' + r.name + '</b><small>' + r.desc + '</small>' + GTO.cardsHtml(r.five, 'mini');
      });
      const why = d.winner === 2 ? '兩人的最佳五張牌完全一樣大，所以平分底池。'
        : d.results[0].cat !== d.results[1].cat ? '玩家 ' + 'AB'[d.winner] + ' 的「' + d.results[d.winner].name + '」牌型比較大。'
          : '兩人都是「' + d.results[0].name + '」，所以要依序比較點數 / 踢腳，玩家 ' + 'AB'[d.winner] + ' 比較大。';
      el.querySelector('.sd-feedback').innerHTML =
        '<div class="fb ' + (ok ? 'ok' : 'bad') + '"><strong>' + (ok ? '✅ 答對了！' : '❌ 再想想～') + '</strong> ' + why +
        ' <button type="button" class="btn primary sm sd-next">下一題 →</button></div>';
    };
    el.addEventListener('click', (e) => {
      const ansBtn = e.target.closest('[data-ans]');
      if (ansBtn && el.contains(ansBtn)) {
        answer(Number(ansBtn.getAttribute('data-ans')), ansBtn);
        return;
      }
      if (e.target.closest('.sd-next')) render();
    });
    render();
  }

  // ===========================================================================
  // Widget：一手牌逐步動畫
  // ===========================================================================
  function walkthroughSteps() {
    const base = () => ({
      BTN: { hero: true, label: 'BTN', sub: '你（按鈕）' },
      SB: { label: 'SB', sub: '小盲' },
      BB: { label: 'BB', sub: '大盲' },
      UTG: { label: 'UTG', sub: '槍口' },
      HJ: { label: 'HJ', sub: '劫持' },
      CO: { label: 'CO', sub: '關煞' },
    });
    const steps = [];
    const S = (title, text, mut) => {
      const prev = steps.length ? JSON.parse(JSON.stringify(steps[steps.length - 1].state)) : { seats: base(), board: [], pot: 0 };
      Object.values(prev.seats).forEach((s) => { delete s.say; delete s.hl; });
      mut(prev);
      steps.push({ title, text, state: prev });
    };
    S('① 入座與按鈕', '6 個人圍一桌。<b>D（莊家按鈕）</b>在你面前，代表你這手坐在 <b>BTN 按鈕位</b>——翻牌後永遠最後行動，是最好的位置。每打完一手，按鈕會<b>順時針</b>移動一位。', (s) => { s.seats.BTN.hl = true; });
    S('② 下盲注', '按鈕左邊兩位要強制下注：<b>SB 小盲放 0.5bb、BB 大盲放 1bb</b>。這樣底池一開始就有 1.5bb，大家才有東西可以搶。', (s) => {
      s.seats.SB.bet = 0.5; s.seats.BB.bet = 1; s.pot = 1.5; s.seats.SB.hl = s.seats.BB.hl = true;
    });
    S('③ 發底牌', '每人發 <b>2 張只有自己看得到的底牌</b>。你拿到 <span class="cards">KsQs</span>：同花色的兩張大牌，是一手很不錯的起手牌！', (s) => {
      Object.keys(s.seats).forEach((p) => { s.seats[p].cards = p === 'BTN' ? ['Ks', 'Qs'] : 'back'; });
      s.seats.BTN.hl = true;
    });
    S('④ 翻前：UTG 先說話', '翻牌前由 <b>BB 左手邊的 UTG</b> 先行動，然後順時針輪下去。UTG、HJ、CO 覺得自己的牌不夠好，依序<b>棄牌（Fold）</b>。', (s) => {
      ['UTG', 'HJ', 'CO'].forEach((p) => { s.seats[p].folded = true; s.seats[p].cards = null; s.seats[p].say = '棄牌'; });
    });
    S('⑤ 翻前：你開池加注', '輪到你。前面沒人加注，你用好牌<b>加注到 2.5bb</b>（叫做開池加注 Open Raise）。只跟 1bb 進池（溜入 Limp）是新手常見錯誤。', (s) => {
      s.seats.BTN.bet = 2.5; s.seats.BTN.say = '加注 2.5'; s.seats.BTN.hl = true; s.pot = 4;
    });
    S('⑥ 翻前：盲注回應', 'SB 棄牌（已放的 0.5bb 留在底池）。BB 已經放了 1bb，只要再補 1.5bb 就能<b>跟注（Call）</b>，他選擇跟注。底池 = 0.5 + 2.5 + 2.5 = <b>5.5bb</b>。', (s) => {
      s.seats.SB.folded = true; s.seats.SB.cards = null; s.seats.SB.say = '棄牌'; s.seats.BB.bet = 2.5; s.seats.BB.say = '跟注'; s.pot = 5.5;
    });
    S('⑦ 翻牌（Flop）', '收起下注、發出 <b>3 張公共牌</b> <span class="cards">Kh8c3d</span>。你中了<b>頂對</b>（一對 K，踢腳 Q）！翻牌後改由<b>按鈕左邊還在牌局的人</b>先行動，所以 BB 先說話。', (s) => {
      Object.values(s.seats).forEach((x) => { delete x.bet; }); s.board = ['Kh', '8c', '3d']; s.seats.BB.hl = true;
    });
    S('⑧ 翻牌行動', 'BB <b>過牌（Check）</b>。你下注 2bb（約 1/3 底池），這叫<b>持續下注（C-Bet）</b>：翻前加注的人翻牌繼續進攻。BB 跟注，底池變 <b>9.5bb</b>。', (s) => {
      s.seats.BB.say = '過牌 → 跟注'; s.seats.BTN.say = '下注 2'; s.seats.BTN.bet = 2; s.seats.BB.bet = 2; s.pot = 9.5;
    });
    S('⑨ 轉牌（Turn）', '第 4 張公共牌 <span class="cards">7s</span>。BB 又過牌，你有頂對，下注 6bb（約 2/3 底池）<b>價值下注</b>——讓更差的牌付錢給你。BB 跟注，底池 <b>21.5bb</b>。', (s) => {
      Object.values(s.seats).forEach((x) => { delete x.bet; }); s.board = ['Kh', '8c', '3d', '7s'];
      s.seats.BB.say = '過牌 → 跟注'; s.seats.BTN.say = '下注 6'; s.seats.BTN.bet = 6; s.seats.BB.bet = 6; s.pot = 21.5;
    });
    S('⑩ 河牌（River）', '最後一張公共牌 <span class="cards">2c</span>。BB 過牌，你再下注 14bb，BB 跟注。底池 <b>49.5bb</b>，進入攤牌！', (s) => {
      Object.values(s.seats).forEach((x) => { delete x.bet; }); s.board = ['Kh', '8c', '3d', '7s', '2c'];
      s.seats.BB.say = '過牌 → 跟注'; s.seats.BTN.say = '下注 14'; s.seats.BTN.bet = 14; s.seats.BB.bet = 14; s.pot = 49.5;
    });
    S('⑪ 攤牌（Showdown）', '河牌最後下注的你先亮牌：<span class="cards">KsQs</span> 一對 K、踢腳 Q。BB 亮出 <span class="cards">KcTc</span> 一對 K、踢腳 10。<b>對子一樣大就比踢腳</b>，Q 大於 10——你贏下 49.5bb！', (s) => {
      Object.values(s.seats).forEach((x) => { delete x.bet; }); s.seats.BB.cards = ['Kc', 'Tc']; s.seats.BTN.hl = true; s.seats.BTN.say = '🏆 贏 49.5bb';
    });
    S('⑫ 這手牌學到什麼？', '<ol class="steps mini"><li><b>位置</b>：BTN 翻後最後行動，看完對手動作再決定。</li><li><b>開池加注</b>：前面沒人進池時，好牌用加注進場，不要溜入。</li><li><b>價值下注</b>：中頂對後連續下注，讓更差的牌付錢。</li><li><b>踢腳</b>：一樣是一對 K 時，比第二大的牌。</li></ol>', (s) => { s.seats.BTN.hl = true; });
    return steps;
  }
  function wHandWalkthrough(el) {
    const steps = walkthroughSteps();
    let i = 0;
    const render = () => {
      const st = steps[i];
      el.innerHTML =
        '<div class="w-card w-walk">' +
          '<div class="w-head"><strong>🎬 一手牌從頭到尾（逐步動畫）</strong><span class="muted">第 ' + (i + 1) + ' / ' + steps.length + ' 步</span></div>' +
          '<div class="walk-grid">' +
            miniTable({ seats: st.state.seats, board: st.state.board, pot: st.state.pot, boardSlots: true }) +
            '<div class="walk-text">' +
              '<h4>' + st.title + '</h4>' +
              '<div class="walk-body">' + st.text + '</div>' +
              '<div class="walk-dots">' + steps.map((_, k) => '<i class="' + (k === i ? 'on' : k < i ? 'past' : '') + '" data-k="' + k + '"></i>').join('') + '</div>' +
              '<div class="walk-btns">' +
                '<button type="button" class="btn sm" data-go="-1"' + (i === 0 ? ' disabled' : '') + '>◀ 上一步</button>' +
                (i < steps.length - 1
                  ? '<button type="button" class="btn primary sm" data-go="1">下一步 ▶</button>'
                  : '<button type="button" class="btn primary sm" data-go="restart">↺ 再看一次</button>') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      GTO.hydrateCards(el);
    };
    el.addEventListener('click', (e) => {
      const goBtn = e.target.closest('[data-go]');
      if (goBtn && el.contains(goBtn)) {
        if (goBtn.disabled) return;
        const g = goBtn.getAttribute('data-go');
        i = g === 'restart' ? 0 : Math.max(0, Math.min(steps.length - 1, i + Number(g)));
        render();
        return;
      }
      const dot = e.target.closest('.walk-dots i[data-k]');
      if (dot && el.contains(dot)) {
        i = Number(dot.getAttribute('data-k'));
        render();
      }
    });
    render();
  }

  // ===========================================================================
  // Widget：6 人桌位置互動圖
  // ===========================================================================
  const POS_INFO = {
    UTG: { zh: '槍口位', en: 'Under the Gun', pre: 1, post: 3, rfi: '約 17%', sc: 'rfi_utg', why: '翻前第一個說話，後面還有 5 個人可能拿到大牌，像「第一個站到槍口前」，所以要玩最緊。', tip: '只用強牌開池：55+（22–44 混合）、A3s+（A2s 混合）、K9s+、ATo+、KQo 一類。' },
    HJ: { zh: '劫持位', en: 'Hijack', pre: 2, post: 4, rfi: '約 22%', sc: 'rfi_hj', why: 'Hijack 意思是「劫持」：常常搶在 CO、BTN 前面偷盲注。後面還有 4 人，範圍比 UTG 稍寬。', tip: '比 UTG 多加小對子（22+）、A2s、同花連張（76s、65s）與 KJo、QJo。' },
    CO: { zh: '關煞位', en: 'Cutoff', pre: 3, post: 5, rfi: '約 30%', sc: 'rfi_co', why: 'Cutoff 在按鈕前一位，只要 BTN 不進池，翻後你就有位置，可以開始積極偷盲。', tip: '約 30% 手牌開池，大部分同花牌都能玩。' },
    BTN: { zh: '按鈕位（莊位）', en: 'Button', pre: 4, post: 6, rfi: '約 45%', sc: 'rfi_btn', why: '翻後永遠最後行動，資訊最多、最好控制底池——長期最賺錢的位置。', tip: '前面都棄牌時，開池範圍可放寬到約 45%。' },
    SB: { zh: '小盲位', en: 'Small Blind', pre: 5, post: 1, rfi: '約 43%（加注或棄牌）', sc: 'rfi_sb', why: '已經被迫放 0.5bb，但翻後永遠第一個行動（最差位置），長期是虧錢最多的位置。', tip: '前面都棄牌時多用「加注或棄牌」，少平跟。' },
    BB: { zh: '大盲位', en: 'Big Blind', pre: 6, post: 2, rfi: '防守為主', sc: 'vsrfi_bb_btn', why: '已放 1bb，翻前最後說話，跟注價格最便宜，所以要用很寬的範圍防守。', tip: '面對 BTN 開池時，BB 要防守約一半的手牌。' },
  };
  function wPositionTable(el) {
    let mode = 'pre', sel = 'BTN';
    const render = () => {
      const seats = {};
      SEAT_ORDER.forEach((p) => {
        seats[p] = { label: p, en: POS_INFO[p].en, sub: POS_INFO[p].zh.replace('（莊位）', ''), order: mode === 'pre' ? POS_INFO[p].pre : POS_INFO[p].post, hl: p === sel };
      });
      const info = POS_INFO[sel];
      el.innerHTML =
        '<div class="w-card w-pos">' +
          '<div class="w-head"><strong>🧭 6 人桌位置（點座位看說明）</strong>' +
            '<span class="seg"><button type="button" class="' + (mode === 'pre' ? 'on' : '') + '" data-m="pre">翻前行動順序</button><button type="button" class="' + (mode === 'post' ? 'on' : '') + '" data-m="post">翻後行動順序</button></span></div>' +
          '<div class="pos-grid">' +
            miniTable({ seats, clickable: true, centerNote: mode === 'pre' ? '翻前：UTG 先、BB 最後' : '翻後：SB 先、BTN 最後' }) +
            '<div class="pos-info">' +
              '<div class="pi-title"><span class="pi-pos">' + sel + '</span><div><b>' + info.zh + '</b><small>' + info.en + '</small></div></div>' +
              '<div class="pi-stats"><span>翻前第 <b>' + info.pre + '</b> 個行動</span><span>翻後第 <b>' + info.post + '</b> 個行動</span><span>開池範圍 <b>' + info.rfi + '</b></span></div>' +
              '<p>' + info.why + '</p>' +
              '<div class="callout tip"><b>實戰小技巧</b>' + info.tip + '</div>' +
              '<a class="btn sm" href="#/ranges/' + info.sc + '">📊 看 ' + sel + ' 的範圍表</a>' +
            '</div>' +
          '</div>' +
          '<div class="w-foot"><span>💡 <b>🧑‍💼 荷官（Dealer）</b>固定坐在牌桌正上方只負責洗牌與發牌，不參與牌局；而玩家面前的 <b>🟡 D 圓牌（莊家按鈕）</b>每局會順時針移動一格，所有位置（BTN → SB → BB → UTG → HJ → CO）都是跟著 <b>D 按鈕</b>算的！</span></div>' +
        '</div>';
    };
    el.addEventListener('click', (e) => {
      const seat = e.target.closest('.mt-seat[data-pos]');
      if (seat && el.contains(seat)) {
        sel = seat.getAttribute('data-pos');
        render();
        return;
      }
      const mBtn = e.target.closest('[data-m]');
      if (mBtn && el.contains(mBtn)) {
        mode = mBtn.getAttribute('data-m');
        render();
      }
    });
    render();
  }

  // ===========================================================================
  // Widget：新手起手牌分級
  // ===========================================================================
  const TIERS = [
    { id: 1, name: '頂級', color: '#15803d', fg: '#fff', range: 'JJ+, AKs, AKo', advice: '任何位置都加注；被別人加注也可以再加注（3-Bet）。' },
    { id: 2, name: '強牌', color: '#22c55e', fg: '#fff', range: 'TT, 99, AQs, AJs, KQs, AQo', advice: '任何位置都可以開池加注；面對加注多半跟注或 3-Bet。' },
    { id: 3, name: '可玩', color: '#facc15', fg: '#422006', range: '88, 77, 66, ATs, KJs, KTs, QJs, QTs, JTs, T9s, AJo, KQo', advice: '中後位（HJ / CO / BTN）開池加注；前位要小心。' },
    { id: 4, name: '投機', color: '#fb923c', fg: '#431407', range: '55, 44, 33, 22, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, K9s, Q9s, J9s, T8s, 98s, 87s, 76s, 65s, 54s, ATo, KJo, QJo, JTo', advice: '只在後位（CO / BTN）或便宜時玩，靠中大牌贏大底池。' },
    { id: 5, name: '棄牌', color: '#1f262d', fg: '#8a959d', range: '', advice: '新手階段直接棄牌，省下的錢就是賺到的錢。' },
  ];
  let tierOf = null;
  function tierMap() {
    if (tierOf) return tierOf;
    tierOf = {};
    TIERS.forEach((t) => { if (t.range) Object.keys(GTO.parseRange(t.range)).forEach((h) => { if (!tierOf[h]) tierOf[h] = t.id; }); });
    GTO.HANDS.forEach((h) => { if (!tierOf[h]) tierOf[h] = 5; });
    return tierOf;
  }
  function wHandTiers(el) {
    const tm = tierMap();
    const combos = {};
    GTO.HANDS.forEach((h) => { combos[tm[h]] = (combos[tm[h]] || 0) + GTO.HAND_INFO[h].combos; });
    let cum = 0;
    const legend = TIERS.map((t) => {
      const p = combos[t.id] / 1326 * 100;
      if (t.id < 5) cum += p;
      return '<button type="button" class="tier-lg" data-t="' + t.id + '"><i style="background:' + t.color + '"></i><b>' + t.name + '</b><small>' + p.toFixed(1) + '%' + (t.id < 5 ? '（累計 ' + cum.toFixed(0) + '%）' : '') + '</small></button>';
    }).join('');
    const cells = GTO.HANDS.map((h) => {
      const t = TIERS[tm[h] - 1];
      return '<button type="button" class="rcell tier-cell" data-hand="' + h + '" data-t="' + t.id + '" style="background:' + t.color + ';color:' + t.fg + '"><span class="rh">' + h + '</span></button>';
    }).join('');
    el.innerHTML =
      '<div class="w-card w-tiers">' +
        '<div class="w-head"><strong>✋ 新手起手牌分級表</strong><span class="muted">點格子或色塊看建議</span></div>' +
        '<div class="tiers-grid"><div class="rgrid compact">' + cells + '</div>' +
          '<div class="tiers-side"><div class="tier-legend">' + legend + '</div><div class="tier-info"><b>點一下任一手牌</b><p class="muted">右上角是同花（s）、左下角是不同花（o）、對角線是口袋對子。新手先只玩綠色與黃色（約 11%），熟悉後在後位加入橘色投機牌（合計約 22%）。</p></div></div>' +
        '</div>' +
      '</div>';
    const info = el.querySelector('.tier-info');
    const cellEls = Array.from(el.querySelectorAll('.tier-cell'));
    const cellTids = cellEls.map((c) => Number(c.getAttribute('data-t')));
    const show = (tid, hand) => {
      const t = TIERS[tid - 1];
      for (let idx = 0; idx < cellEls.length; idx++) cellEls[idx].classList.toggle('dim', cellTids[idx] !== tid);
      info.innerHTML = '<b>' + (hand ? '<span class="hand">' + hand + '</span> → ' : '') + '<span class="tier-tag" style="background:' + t.color + ';color:' + t.fg + '">' + t.name + '</span></b><p>' + t.advice + '</p>' +
        (hand ? '<small class="muted">組合數：' + GTO.HAND_INFO[hand].combos + ' 組</small>' : '');
    };
    el.addEventListener('click', (e) => {
      const cell = e.target.closest('.tier-cell');
      if (cell && el.contains(cell)) {
        show(Number(cell.getAttribute('data-t')), cell.getAttribute('data-hand'));
        return;
      }
      const lg = e.target.closest('.tier-lg');
      if (lg && el.contains(lg)) show(Number(lg.getAttribute('data-t')));
    });
  }

  // ===========================================================================
  // Widget：Outs 機率表
  // ===========================================================================
  const DRAW_NAMES = { 2: '口袋對子中 Set', 4: '卡順（Gutshot）', 6: '兩張高牌', 8: '兩頭順（OESD）', 9: '同花聽牌', 12: '同花 + 卡順', 15: '同花 + 兩頭順' };
  function outsMath(o) {
    const turn = o / 47, river = o / 46, both = 1 - ((47 - o) / 47) * ((46 - o) / 46);
    const r4 = o > 8 ? o * 4 - (o - 8) : o * 4;
    return { turn, river, both, r4, r2: o * 2 };
  }
  function wOutsTable(el) {
    let cur = 9;
    const rows = [];
    for (let o = 1; o <= 20; o++) {
      const m = outsMath(o);
      rows.push('<tr class="' + (DRAW_NAMES[o] ? 'hl' : '') + '" data-o="' + o + '"><td><b>' + o + '</b>' + (DRAW_NAMES[o] ? ' <small>' + DRAW_NAMES[o] + '</small>' : '') + '</td>' +
        '<td>' + (m.turn * 100).toFixed(1) + '%</td><td>' + (m.river * 100).toFixed(1) + '%</td><td><b>' + (m.both * 100).toFixed(1) + '%</b></td>' +
        '<td class="muted">≈' + m.r2 + '% / ≈' + m.r4 + '%</td></tr>');
    }
    el.innerHTML =
      '<div class="w-card w-outs">' +
        '<div class="w-head"><strong>🎲 Outs → 中牌機率</strong><span class="muted">拖動滑桿，或點表格任一列</span></div>' +
        '<div class="outs-live">' +
          '<label>我有 <b class="ol-n">' + cur + '</b> 張 outs<input type="range" min="1" max="20" value="' + cur + '" class="ol-range"></label>' +
          '<div class="ol-cards"></div>' +
        '</div>' +
        '<div class="tbl-wrap"><table class="tbl compact-tbl outs-tbl"><thead><tr><th>Outs</th><th>翻牌→轉牌<br><small>1 張</small></th><th>轉牌→河牌<br><small>1 張</small></th><th>翻牌→河牌<br><small>2 張</small></th><th>二四法則<br><small>×2 / ×4</small></th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' +
        '<p class="w-note">二四法則：翻牌看兩張 ≈ outs × 4（outs 超過 8 張時再減掉「outs − 8」修正）；只看一張 ≈ outs × 2。</p>' +
      '</div>';
    const nEl = el.querySelector('.ol-n');
    const cardsEl = el.querySelector('.ol-cards');
    const rangeEl = el.querySelector('.ol-range');
    const rowEls = Array.from(el.querySelectorAll('.outs-tbl tr[data-o]'));
    let rafId = 0;
    const upd = () => {
      rafId = 0;
      const m = outsMath(cur);
      nEl.textContent = cur;
      cardsEl.innerHTML =
        '<div class="stat-tile"><small>下一張就中</small><b>' + (m.turn * 100).toFixed(1) + '%</b></div>' +
        '<div class="stat-tile"><small>看到河牌前中</small><b>' + (m.both * 100).toFixed(1) + '%</b></div>' +
        '<div class="stat-tile"><small>只看一張時，最多可跟</small><b>' + (m.turn >= 0.5 ? '任何下注' : GTO.fmtNum((m.turn / (1 - 2 * m.turn)) * 100, 0) + '% 底池') + '</b></div>';
      for (let idx = 0; idx < rowEls.length; idx++) rowEls[idx].classList.toggle('sel', (idx + 1) === cur);
    };
    rangeEl.addEventListener('input', (e) => {
      cur = Number(e.target.value);
      if (!rafId) rafId = requestAnimationFrame(upd);
    });
    el.addEventListener('click', (e) => {
      const tr = e.target.closest('.outs-tbl tr[data-o]');
      if (!tr || !el.contains(tr)) return;
      cur = Number(tr.getAttribute('data-o'));
      rangeEl.value = cur;
      upd();
    });
    upd();
  }

  // ===========================================================================
  // Widget：常見聽牌與 outs 圖解
  // ===========================================================================
  const DRAWS = [
    { name: '同花聽牌', en: 'Flush Draw', hand: 'Ah5h', board: 'Kh8h2c', outs: 9, why: '剩下 9 張紅心（13 − 4）都能完成同花。' },
    { name: '兩頭順', en: 'Open-Ended', hand: '9s8d', board: '7c6h2s', outs: 8, why: '任何 5 或 10 都能成順：4 + 4 = 8 張。' },
    { name: '卡順', en: 'Gutshot', hand: '9s8d', board: 'Jc7h2s', outs: 4, why: '只有中間缺的 10 能成順：4 張。' },
    { name: '雙卡順', en: 'Double Gutter', hand: 'Js9d', board: 'KcTh7s', outs: 8, why: 'Q 成 9-K 順、8 成 7-J 順：4 + 4 = 8 張。' },
    { name: '兩張高牌', en: 'Overcards', hand: 'AsKd', board: '9c6h2s', outs: 6, why: '3 張 A + 3 張 K 能中頂對（不一定穩贏，常打折算）。' },
    { name: '組合聽牌', en: 'Combo Draw', hand: 'JhTh', board: '9h8h2c', outs: 15, why: '9 張紅心 + 非紅心的 Q、7 各 3 張 = 15 張，翻牌就是勝率領先的怪獸聽牌！' },
    { name: 'Set 變葫蘆', en: 'Set → Boat', hand: '7s7d', board: 'Kc7h2s', outs: 7, why: '公共牌 K、2 各剩 3 張讓你成葫蘆，再加 1 張 7 成四條 = 7 張。' },
    { name: '口袋對子中 Set', en: 'Set Mining', hand: '5s5d', board: 'AcKh9s', outs: 2, why: '只剩 2 張 5。翻牌前跟注「挖 Set」要靠隱含賠率。' },
  ];
  function wDrawExamples(el) {
    el.innerHTML =
      '<div class="w-card w-draws">' +
        '<div class="w-head"><strong>🌊 常見聽牌與 Outs</strong><span class="muted">底牌 + 翻牌 → 幾張牌能幫你？</span></div>' +
        '<div class="draw-grid">' + DRAWS.map((d) => {
          const m = outsMath(d.outs);
          return '<div class="draw-card">' +
            '<div class="dc-top"><b>' + d.name + '</b><small>' + d.en + '</small><span class="dc-outs">' + d.outs + '<small> outs</small></span></div>' +
            '<div class="dc-cards"><span><small>底牌</small>' + GTO.cardsHtml(GTO.parseCards(d.hand), 'mini') + '</span><span><small>翻牌</small>' + GTO.cardsHtml(GTO.parseCards(d.board), 'mini') + '</span></div>' +
            '<p>' + d.why + '</p>' +
            '<div class="dc-pct"><span>下一張 <b>' + (m.turn * 100).toFixed(0) + '%</b></span><span>到河牌 <b>' + (m.both * 100).toFixed(0) + '%</b></span></div>' +
          '</div>';
        }).join('') + '</div>' +
        '<div class="w-foot"><span>想練到秒算？</span><span class="w-links"><a class="btn sm" href="#/quiz/outs">🎲 數 Outs 練習</a></span></div>' +
      '</div>';
  }

  // ===========================================================================
  // Widget：迷你底池賠率 / MDF 計算器
  // ===========================================================================
  function wPotOddsMini(el) {
    el.innerHTML =
      '<div class="w-card w-podds">' +
        '<div class="w-head"><strong>🧮 底池賠率小幫手</strong><span class="muted">輸入數字立即計算</span></div>' +
        '<div class="po-inputs">' +
          '<label>下注前底池<input type="number" class="inp" data-k="pot" value="10" min="0" step="0.5"></label>' +
          '<label>對手下注<input type="number" class="inp" data-k="bet" value="5" min="0" step="0.5"></label>' +
          '<label>我的 outs<input type="number" class="inp" data-k="outs" value="9" min="0" max="20"></label>' +
          '<label>還要發<select class="inp" data-k="left"><option value="1">1 張（只看下一張）</option><option value="2">2 張（翻牌全下）</option></select></label>' +
        '</div>' +
        '<div class="po-out"></div>' +
      '</div>';
    const inps = {
      pot: el.querySelector('[data-k="pot"]'),
      bet: el.querySelector('[data-k="bet"]'),
      outs: el.querySelector('[data-k="outs"]'),
      left: el.querySelector('[data-k="left"]'),
    };
    const outEl = el.querySelector('.po-out');
    let rafId = 0;
    const calc = () => {
      rafId = 0;
      const v = (k) => Number(inps[k].value) || 0;
      const pot = v('pot'), bet = v('bet'), outs = Math.min(20, v('outs')), left = v('left');
      const need = bet > 0 ? bet / (pot + 2 * bet) : 0;
      const mdf = bet > 0 ? pot / (pot + bet) : 1;
      const alpha = bet > 0 ? bet / (pot + bet) : 0;
      const m = outsMath(outs);
      const eq = left === 2 ? m.both : m.turn;
      const good = eq >= need;
      outEl.innerHTML =
        '<div class="stat-tile"><small>跟注需要勝率</small><b>' + (need * 100).toFixed(1) + '%</b><em>' + GTO.fmtNum(bet, 1) + ' ÷ ' + GTO.fmtNum(pot + 2 * bet, 1) + '</em></div>' +
        '<div class="stat-tile"><small>我的中牌機率</small><b>' + (eq * 100).toFixed(1) + '%</b><em>' + outs + ' outs · ' + left + ' 張</em></div>' +
        '<div class="stat-tile ' + (good ? 'ok' : 'bad') + '"><small>結論（不含隱含賠率）</small><b>' + (good ? '✅ 可以跟' : '❌ 偏虧，傾向棄牌') + '</b><em>' + (good ? '勝率 ≥ 需要勝率' : '勝率 < 需要勝率') + '</em></div>' +
        '<div class="stat-tile"><small>防守方 MDF</small><b>' + (mdf * 100).toFixed(1) + '%</b><em>詐唬需成功率 α ' + (alpha * 100).toFixed(1) + '%</em></div>';
    };
    el.addEventListener('input', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.target.closest('[data-k]') && !rafId) rafId = requestAnimationFrame(calc);
    });
    calc();
  }

  // ===========================================================================
  // Widget：下注尺度對照表
  // ===========================================================================
  function wBetSizeTable(el) {
    const sizes = [25, 33, 50, 66, 75, 100, 125, 150, 200];
    const row = (p) => {
      const b = p / 100;
      return '<td><b>' + p + '%</b></td><td>' + (b / (1 + 2 * b) * 100).toFixed(1) + '%</td><td>' + (1 / (1 + b) * 100).toFixed(1) + '%</td><td>' +
        (b / (1 + b) * 100).toFixed(1) + '%</td><td>' + GTO.fmtNum((1 + b) / b, 2) + ' : 1</td>';
    };
    const coachTabs = [
      {
        btn: '🎯 迷思 1：手牌不是 1 就是 0，2:1 是給誰看的？',
        html:
          '<b>你完全不需要記歷史牌局（不用想「上局是價值，這局一定要詐唬」）！</b><br>' +
          '• <b>單一手牌（Single Hand）確實是 1 或 0</b>：當你拿著具體手牌走到河牌，它當下要嘛強到拿價值（1），要嘛不夠強需要詐唬（0）。<br>' +
          '• <b>2 : 1 是指你的「整套範圍（Range）」</b>：以滿池下注（2:1）為例，假設你在這個河牌面有 <b>20 組強牌</b>會下注拿價值，你只需要從破產聽牌裡挑出最沒攤牌價值的 <b>10 組空氣牌</b>來當詐唬（或用底牌花色／手錶秒針偶數隨機挑一半），自然就達成 <b>20 : 10 = 2 : 1</b>！'
      },
      {
        btn: '🧭 迷思 2：這張表要死背嗎？記住 3 個直覺',
        html:
          '<b>不用邊打牌邊按計算機，只要把表格背後的「邏輯」放進心裡：</b><br>' +
          '1. <b>下注越大，詐唬佔比就要越高</b>：下 25% 小注是 <b>5:1</b>（對手便宜好跟，多拿好牌賺錢即可）；下 200% 超池是 <b>1.5:1</b>（對手需 40% 高勝率才敢跟，必須混入更多空氣牌誘使他抓詐）。<br>' +
          '2. <b>這是「防禦對手剝削」的防護罩</b>：如果你從不詐唬，懂觀念的對手看到你下大注就全棄牌，你的強牌永遠贏不到大錢。<br>' +
          '3. <b>實戰原則</b>：河牌下重注前先確保範圍裡「既有堅果、也有幾組破產聽牌平衡」；但若遇到死不棄牌的娛樂玩家（魚），<b>直接忘掉這張表，零詐唬狂打價值！</b>'
      },
      {
        btn: '🐟 迷思 3：對新手「不詐唬」＝沒好牌只能枯坐？',
        html:
          '<b>「不在河牌硬詐唬」≠「放棄翻前主動權與其他街的薄價值」！</b><br>' +
          '1. <b>擴大翻前起手牌範圍主動進攻</b>：利用位置優勢正常 Open 加注或偷盲；休閒玩家範圍鬆、拿中等牌也捨不得丟，你中兩對或好對子時他們都會付錢。<br>' +
          '2. <b>善用 C-Bet 拿「薄價值」而非詐唬</b>：例如拿 <b>AK</b> 在有 A 的翻牌下注，對手拿 Q 對或聽牌跟注——<b>這不是詐唬，這是價值！</b>因為你的牌比他大，他在幫你累積底池。<br>' +
          '3. <b>真的完全沒牌就乾脆放棄</b>：職業選手也棄掉約 80% 起手牌。「沒牌時別花錢，有好牌時狠狠收割他」才是對付新手的印鈔秘訣！'
      }
    ];
    el.innerHTML =
      '<div class="w-card w-bst">' +
        '<div class="w-head"><strong>📏 下注尺度 → 防守與詐唬比例</strong><span class="muted">尺度 = 下注額佔底池的比例</span></div>' +
        '<div class="tbl-wrap"><table class="tbl compact-tbl"><thead><tr><th>下注尺度</th><th>跟注者需要勝率<br><small>＝河牌最佳詐唬比例</small></th><th>MDF<br><small>至少要繼續的比例</small></th><th>Alpha<br><small>純詐唬需成功率</small></th><th>價值 : 詐唬</th></tr></thead><tbody>' +
          sizes.map((p) => '<tr>' + row(p) + '</tr>').join('') +
          '<tr class="custom"><td><input type="number" class="inp xs" value="80" min="1" max="500"> %</td><td colspan="4" class="cust-out"></td></tr>' +
        '</tbody></table></div>' +
        '<p class="w-note">下注越大 → 對手需要越高勝率才能跟、你的詐唬也可以越多，但詐唬失敗時虧得越多。</p>' +
        '<div class="w-coach" style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);">' +
          '<div class="tier-tabs" style="margin-bottom:8px;">' +
            coachTabs.map((t, i) => '<button type="button" class="tier-tab' + (i === 0 ? ' active' : '') + '" data-cidx="' + i + '">' + t.btn + '</button>').join('') +
          '</div>' +
          '<div class="callout tip w-coach-body" style="margin:0;">' + coachTabs[0].html + '</div>' +
        '</div>' +
      '</div>';
    const inp = el.querySelector('.custom input');
    const custOut = el.querySelector('.cust-out');
    const tabBtns = Array.from(el.querySelectorAll('[data-cidx]'));
    const coachBody = el.querySelector('.w-coach-body');
    let rafId = 0;
    const upd = () => {
      rafId = 0;
      const p = Math.max(1, Number(inp.value) || 1), b = p / 100;
      custOut.innerHTML = '需要勝率 <b>' + (b / (1 + 2 * b) * 100).toFixed(1) + '%</b> · MDF <b>' + (1 / (1 + b) * 100).toFixed(1) + '%</b> · Alpha <b>' +
        (b / (1 + b) * 100).toFixed(1) + '%</b> · 價值:詐唬 <b>' + GTO.fmtNum((1 + b) / b, 2) + ' : 1</b>';
    };
    inp.addEventListener('input', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (!rafId) rafId = requestAnimationFrame(upd);
    });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cidx]');
      if (!b || !el.contains(b)) return;
      const idx = Number(b.dataset.cidx) || 0;
      for (let k = 0; k < tabBtns.length; k++) tabBtns[k].classList.toggle('active', tabBtns[k] === b);
      coachBody.innerHTML = coachTabs[idx].html;
    });
    upd();
  }

  // ===========================================================================
  // Widget：翻前開池速查表
  // ===========================================================================
  const RFI_NOTE = {
    rfi_utg: '最緊：中大對子、同花 A、百老匯大牌',
    rfi_hj: '多加同花連張與小對子',
    rfi_co: '大部分同花牌都能開',
    rfi_btn: '最寬：接近一半手牌',
    rfi_sb: '加注或棄牌，不要平跟',
  };
  function wPreflopCheatsheet(el) {
    const ids = ['rfi_utg', 'rfi_hj', 'rfi_co', 'rfi_btn', 'rfi_sb'];
    el.innerHTML =
      '<div class="w-card w-pcs">' +
        '<div class="w-head"><strong>📋 6 人桌開池範圍速查（簡易版）</strong><span class="muted">紅色 = 加注開池，灰色 = 棄牌</span></div>' +
        '<div class="pcs-grid">' + ids.map((id) => {
          const sc = GTO.SCENARIOS[id];
          if (!sc) return '';
          return '<a class="pcs-item" href="#/ranges/' + id + '"><div class="pcs-head"><b>' + sc.hero + '</b><span>' + GTO.POS_ZH[sc.hero] + '</span><em>' + esc(sc.targetPct) + '</em></div>' +
            '<div class="pcs-grid-slot" data-sc="' + id + '"></div><small>' + RFI_NOTE[id] + '</small></a>';
        }).join('') + '</div>' +
      '</div>';
    el.querySelectorAll('.pcs-grid-slot').forEach((slot) => GTO.renderGrid(slot, slot.getAttribute('data-sc'), { compact: true, simple: true }));
  }

  // ===========================================================================
  // 註冊與 hydrate
  // ===========================================================================
  const WIDGETS = {
    'hand-rankings': wHandRankings,
    'showdown-game': wShowdownGame,
    'hand-walkthrough': wHandWalkthrough,
    'position-table': wPositionTable,
    'hand-tiers': wHandTiers,
    'outs-table': wOutsTable,
    'draw-outs-examples': wDrawExamples,
    'pot-odds-mini': wPotOddsMini,
    'bet-size-table': wBetSizeTable,
    'preflop-cheatsheet': wPreflopCheatsheet,
  };
  function hydrateWidgets(root) {
    (root || document).querySelectorAll('.widget[data-widget]:not([data-done])').forEach((el) => {
      el.setAttribute('data-done', '1');
      const fn = WIDGETS[el.getAttribute('data-widget')];
      if (!fn) return;
      try { fn(el); } catch (e) { console.error('widget failed', el.getAttribute('data-widget'), e); el.innerHTML = '<div class="w-card muted">（互動元件載入失敗）</div>'; }
    });
  }
  function widgetHtml(name) { return '<div class="widget" data-widget="' + name + '"></div>'; }

  Object.assign(GTO, { hydrateWidgets, widgetHtml, HAND_TIERS: TIERS, tierMap });
})();

/* GTO 撲克學院 — lessons_beginner.js：新手村 9 課 + Outs 機率 1 課 */
window.GTO = window.GTO || {};
GTO.THEORY = GTO.THEORY || [];
GTO.QUESTIONS = GTO.QUESTIONS || [];

// ===========================================================================
// 1. welcome — 德州撲克是什麼？5 分鐘看懂
// ===========================================================================
GTO.THEORY.push({
  id: 'welcome',
  stage: 'beginner',
  part: '〇、新手村',
  title: '德州撲克是什麼？5 分鐘看懂',
  icon: '👋',
  level: 1,
  minutes: 5,
  tldr: '每人 2 張底牌配 5 張公共牌，挑最好的 5 張；讓所有人棄牌，或攤牌時牌最大，就能贏走底池。',
  plain: '德州撲克像一場「共用食材的料理比賽」：桌子中間的 5 張公共牌大家都能用，你手上 2 張只有你知道。過程中大家輪流加碼，最後不是把對手全部嚇退，就是亮牌比誰的 5 張組合最強。',
  summary: '從零認識無限注德州撲克：遊戲目標、52 張牌、2 張底牌與 5 張公共牌、莊家按鈕與大小盲、四條下注街、為什麼不是最好的牌也能贏、現金桌與錦標賽的差別，以及本站新手村的學習路線。',
  keyPoints: [
    '目標是贏籌碼：讓其他人全部棄牌，或在攤牌（Showdown）時用 7 張牌中最好的 5 張贏過對手。',
    '每人 2 張底牌（Hole Cards）+ 最多 5 張公共牌（Board），組牌時底牌可以用 2 張、1 張或 0 張。',
    '莊家按鈕（BTN）每手順時針移動一位；左邊兩位強制下小盲（SB 0.5bb）與大盲（BB 1bb），讓每手牌都有底池可搶。',
    '一手牌最多 4 輪下注：翻牌前 → 翻牌（3 張）→ 轉牌（1 張）→ 河牌（1 張）。',
    '下注讓對手棄牌（詐唬 Bluff）也能贏，但新手先以「好牌多下注」為主。'
  ],
  html: `
<h3>1. 一句話規則：怎樣才算贏？</h3>
<div class="callout plain"><b>白話解釋</b>贏牌的兩種方法就像打球賽：一種是打完全場、比分最高的人贏（攤牌比大小）；另一種是對手中途棄權，你直接獲勝（其他人都棄牌）。對手棄權時，沒有人在乎你當下的比分是多少——撲克也一樣，沒人跟到最後，你的底牌就不用亮。</div>
<p>本站教的是全世界最流行的<strong>無限注德州撲克（No-Limit Hold'em, NLH）</strong>，目標只有一個：<strong>贏走中間的籌碼（底池 Pot）</strong>。贏的方法有兩種：</p>
<ul>
<li><strong>其他人全部棄牌（Fold）</strong>：只剩你一個人，底池直接歸你，<strong>不用亮牌</strong>。</li>
<li><strong>攤牌（Showdown）時牌最大</strong>：最後還有兩人以上，就亮牌比大小，用 7 張牌（2 張底牌 + 5 張公共牌）中最好的 5 張決勝負。</li>
</ul>
<table class="tbl"><thead><tr><th>名詞</th><th>意思</th></tr></thead><tbody>
<tr><td>底池（Pot）</td><td>這一手牌所有人投入的籌碼總和，贏家全部拿走</td></tr>
<tr><td>底牌（Hole Cards）</td><td>發給你的 2 張蓋著的牌，只有你看得到</td></tr>
<tr><td>公共牌（Board）</td><td>翻開在桌子中間、所有人共用的牌，最多 5 張</td></tr>
<tr><td>全下（All-in）</td><td>把面前所有籌碼推進底池；「無限注」就是隨時都能這樣做</td></tr>
</tbody></table>

<h3>2. 牌與座位：52 張牌、2 + 5、按鈕與大小盲</h3>
<p>使用一副 <strong>52 張</strong>撲克牌（沒有鬼牌）：4 種花色 × 13 種點數。點數由大到小是 A、K、Q、J、10、9…2。<strong>A 最大，但也能當 1 用來湊 A-2-3-4-5 的順子</strong>；花色（♠♥♦♣）<strong>沒有大小之分</strong>。</p>
<div class="callout example"><b>例題：7 張選 5 張</b>你的底牌 <span class="cards">AsKd</span>，公共牌 <span class="cards">Kh9c5d2sJh</span>。你最好的 5 張是 K-K-A-J-9：<strong>一對 K，踢腳 A</strong>。底牌可以用 2 張、1 張，甚至 0 張（直接用 5 張公共牌）。</div>
<p>每手牌有三個特殊座位：</p>
<ul>
<li><strong>莊家按鈕（Button, BTN）</strong>：桌上寫著「D」的圓牌，代表名義上的莊家。每打完一手就<strong>順時針移動一位</strong>，所以大家輪流當莊。</li>
<li><strong>小盲（Small Blind, SB）</strong>：按鈕左邊第一位，發牌前強制放入半個大盲。</li>
<li><strong>大盲（Big Blind, BB）</strong>：按鈕左邊第二位，發牌前強制放入 1 個大盲。</li>
</ul>
<p>例如「1/2 的牌局」代表小盲 1 元、大盲 2 元。本站一律用<strong>大盲數（bb）</strong>當單位：SB = 0.5bb、BB = 1bb，所以每手牌一開始底池就有 1.5bb。盲注的目的是逼大家「有東西可以搶」，不然所有人都可以只等 AA 才玩。點點看下面的 6 人桌座位圖：</p>
<div class="widget" data-widget="position-table"></div>

<h3>3. 一手牌的四條街（Streets）</h3>
<p>一手牌最多有 <strong>4 輪下注</strong>，撲克術語叫「街（Street）」。每一輪輪到你時，可以過牌、下注、跟注、加注或棄牌（第 4 課會詳細教）。</p>
<ol class="steps">
<li><b>盲注與發底牌</b>SB、BB 放好盲注，每人發 2 張底牌。</li>
<li><b>翻牌前（Preflop）</b>第一輪下注，從大盲左邊的 UTG 開始，大盲最後說話。</li>
<li><b>翻牌（Flop）</b>一次翻開 3 張公共牌，第二輪下注。</li>
<li><b>轉牌（Turn）</b>翻開第 4 張公共牌，第三輪下注。</li>
<li><b>河牌（River）</b>翻開第 5 張公共牌，最後一輪下注。</li>
<li><b>攤牌（Showdown）</b>還有 2 人以上就亮牌比大小；中途只剩 1 人時，那人直接贏。</li>
</ol>
<p>翻牌後的三條街一律從<strong>按鈕左邊第一位還在局的玩家</strong>先說話，<strong>按鈕永遠最後</strong>——能先看別人怎麼做再決定，所以按鈕是全桌最好的位置。</p>

<h3>4. 不需要最好的牌也能贏：下注的力量</h3>
<p>對手看不到你的底牌，所以你的<strong>下注本身就是一種訊號</strong>。如果你的下注讓所有人都放棄，即使牌很爛也能贏，這就是<strong>詐唬（Bluff）</strong>。</p>
<div class="hh">
<div class="hh-title">牌例：只有 J 高也贏下底池</div>
<div class="hh-row"><span class="hh-street">翻前</span>你在 BTN 拿 <span class="cards">Jc9c</span>，前面全部棄牌。你加注到 2.5bb，SB 棄牌，BB 跟注（底池 2.5 + 2.5 + 0.5 = 5.5bb）。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Ks7d2c</span>，你什麼都沒中。BB 過牌，你下注 2bb。</div>
<div class="hh-row"><span class="hh-street">結果</span>BB 棄牌，你贏走原本的 5.5bb 底池（自己下的 2bb 也收回），而且不用亮牌。</div>
<div class="hh-row result"><span class="hh-street">重點</span>你只有 J 高，但 BB 也沒中牌，你的下注讓他放棄。撲克比的不只是牌，也是「誰能讓對手相信什麼」。</div>
</div>
<div class="callout warn"><b>常見誤解</b>很多新手看了電視轉播，以為撲克就是靠詐唬。事實上，低級別牌桌很多玩家「什麼都跟」，對這種對手詐唬只是在送錢。新手階段請以<strong>好牌多下注</strong>為主，詐唬等學會看牌面、看對手之後再加進來。</div>

<h3>5. 現金桌 vs 錦標賽：一句話分清楚</h3>
<p><strong>現金桌（Cash Game）的籌碼就是錢、盲注固定、隨時能離開；錦標賽（Tournament / MTT）的籌碼只是分數、盲注定時升級、輸光就淘汰。</strong></p>
<table class="tbl"><thead><tr><th>比較</th><th>現金桌（Cash Game）</th><th>錦標賽（MTT）</th></tr></thead><tbody>
<tr><td>籌碼價值</td><td>等於真錢，可隨時兌現</td><td>只是計分，依最後名次分獎金</td></tr>
<tr><td>盲注</td><td>固定不變</td><td>每隔一段時間升級</td></tr>
<tr><td>離開</td><td>想走就走，輸光可再買入</td><td>輸光就淘汰（重購賽除外）</td></tr>
<tr><td>本站預設</td><td>✅ 6 人桌、100bb、無前注</td><td>在錦標賽課程另外說明</td></tr>
</tbody></table>
<div class="callout tip"><b>實戰小技巧</b>先從現金桌學起：盲注與籌碼深度固定，同樣的情境會反覆出現，最容易建立正確觀念。本站所有範圍表與練習都以「6 人桌 100bb 現金桌」為基準。</div>

<h3>6. 新手村學習路線與下一步</h3>
<ol class="steps">
<li><b>看懂規則</b><a href="#/learn/hand-rankings">牌型大小</a> → <a href="#/learn/hand-flow">一手牌流程</a> → <a href="#/learn/betting-actions">下注動作與規則</a>。</li>
<li><b>看懂牌</b><a href="#/learn/reading-board">看懂牌面</a> → <a href="#/learn/starting-hands-101">新手起手牌</a>。</li>
<li><b>少犯錯</b><a href="#/learn/beginner-strategy">10 條基本策略</a> → <a href="#/learn/beginner-mistakes">15 個常見錯誤</a> → <a href="#/learn/etiquette">牌桌禮儀</a>。</li>
<li><b>進入基礎篇</b><a href="#/learn/outs-odds">Outs 與聽牌機率</a> → <a href="#/learn/positions">位置</a> → <a href="#/learn/poker-math">撲克數學</a>，之後就能開始學 GTO。</li>
</ol>
<p><strong>下一步：</strong>先讀 <a href="#/learn/hand-rankings">牌型大小完全圖解</a>，再到 <a href="#/quiz/position">位置辨識練習</a> 熟悉座位，最後用 <a href="#/quiz/theory?topic=welcome">本課小測驗</a> 確認自己都懂了。</p>
`,
  sources: [
    { title: 'PokerNews — Texas Hold’em Rules', url: 'https://www.pokernews.com/poker-rules/texas-holdem.htm' },
    { title: 'Bicycle Cards — How to Play Texas Hold’em Poker', url: 'https://bicyclecards.com/how-to-play/texas-holdem-poker' },
    { title: '維基百科 — 德州撲克', url: 'https://zh.wikipedia.org/zh-tw/%E5%BE%B7%E5%B7%9E%E6%92%B2%E5%85%8B' },
    { title: 'PokerTraining — The 5 Key Differences Between Cash Game and Tournament Strategy', url: 'https://www.pokertraining.com/poker/blog/the-5-key-differences-between-cash-game-and-tournament-strategy/' },
    { title: 'Poker Q’z — 德州撲克規則', url: 'https://pokerqz.com/zh-TW/blog/texas-holdem-rules' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'welcome-01', topic: 'welcome', lv: 1,
    q: '德州撲克攤牌時，玩家用什麼來比大小？',
    opts: ['從 2 張底牌加 5 張公共牌中挑出最好的 5 張', '一定要用 2 張底牌加 3 張公共牌', '把 7 張牌的點數全部加總', '只比 2 張底牌誰比較大'],
    ans: 0,
    exp: '每位玩家從自己的 2 張底牌與 5 張公共牌（共 7 張）中任選最好的 5 張；底牌可以用 2 張、1 張或完全不用。點數加總或只比底牌都不是德州撲克的規則。' },
  { id: 'welcome-02', topic: 'welcome', lv: 1,
    q: '發牌前要強制放入「大盲注」的是哪個座位？',
    opts: ['莊家按鈕（BTN）左邊第二位', '莊家按鈕本人', '莊家按鈕左邊第一位', '由荷官每手隨機指定'],
    ans: 0,
    exp: '按鈕左邊第一位是小盲（SB，放 0.5bb），左邊第二位是大盲（BB，放 1bb）。按鈕每手順時針移動，所以盲注也會輪流。' },
  { id: 'welcome-03', topic: 'welcome', lv: 1,
    q: '翻牌圈（Flop）一次會翻開幾張公共牌？',
    opts: ['3 張', '1 張', '2 張', '5 張'],
    ans: 0,
    exp: '翻牌一次發 3 張公共牌，之後轉牌、河牌各再發 1 張，總共 5 張公共牌。' },
  { id: 'welcome-04', topic: 'welcome', lv: 1,
    q: '你在河牌下注，其他玩家全部棄牌，但你的底牌其實只有 J 高。結果會怎樣？',
    opts: ['你直接贏得底池，而且不需要亮牌', '仍然要攤牌，J 高很可能輸', '這手牌作廢，籌碼退回給每個人', '你只能拿回自己下注的籌碼'],
    ans: 0,
    exp: '只要其他人都棄牌，剩下的最後一人就贏走整個底池，不需要亮牌。這就是下注（包括詐唬）能贏牌的原因。' },
  { id: 'welcome-05', topic: 'welcome', lv: 1,
    q: '關於現金桌與錦標賽，下列何者正確？',
    opts: ['現金桌籌碼等於真錢、盲注固定；錦標賽盲注會定時升級', '現金桌盲注會越來越大，錦標賽盲注固定不變', '錦標賽的籌碼可以隨時兌換現金離開', '兩者的籌碼價值與盲注結構完全相同'],
    ans: 0,
    exp: '現金桌的籌碼就是錢，盲注固定，可以隨時離桌兌現；錦標賽籌碼只是計分，盲注定時升級，輸光就淘汰，最後依名次分獎金。' },
  { id: 'welcome-06', topic: 'welcome', lv: 1,
    q: '一手德州撲克最多會有幾輪下注？',
    opts: ['4 輪：翻牌前、翻牌、轉牌、河牌', '3 輪：翻牌、轉牌、河牌', '5 輪：每發一張公共牌就下注一次', '只有 1 輪：5 張公共牌發完才下注'],
    ans: 0,
    exp: '下注發生在翻牌前、翻牌、轉牌、河牌四條街。翻牌一次發 3 張，所以 5 張公共牌只對應 3 輪翻後下注，再加上翻牌前共 4 輪。' }
);

// ===========================================================================
// 2. hand-rankings — 牌型大小完全圖解
// ===========================================================================
GTO.THEORY.push({
  id: 'hand-rankings',
  stage: 'beginner',
  part: '〇、新手村',
  title: '牌型大小完全圖解',
  icon: '🏆',
  level: 1,
  minutes: 8,
  tldr: '10 種牌型由大到小：皇家同花順、同花順、四條、葫蘆、同花、順子、三條、兩對、一對、高牌；越稀有越大。',
  plain: '牌型大小就像遊戲裡的「稀有度排行榜」：越難湊到的組合越值錢。比大小時先比牌型等級，等級一樣才一張一張比點數；花色永遠不分大小。',
  summary: '用牌圖認識 10 種牌型與記憶口訣，看懂 5 張與 7 張牌的真實出現機率，並學會所有比大小細節：踢腳、兩對與葫蘆怎麼比、同花比最大張、A-2-3-4-5 輪子順、用公共牌與平分底池。',
  keyPoints: [
    '牌型由大到小：皇家同花順、同花順、四條、葫蘆、同花、順子、三條、兩對、一對、高牌。',
    '永遠只比「最好的 5 張」：牌型相同時依規則比點數，第 6、7 張牌不算；花色沒有大小。',
    '兩對先比大對、再比小對、最後比踢腳；葫蘆先比三條那組，三條相同才比對子。',
    'A 可以當最大（10-J-Q-K-A）也可以當 1（A-2-3-4-5 輪子順），但不能繞圈（Q-K-A-2-3 不是順子）。',
    '7 張牌中最常見的是一對（約 43.8%）與兩對（約 23.5%）；四條以上合計不到 0.2%。'
  ],
  html: `
<h3>1. 10 種牌型一覽（由大到小）</h3>
<div class="callout plain"><b>白話解釋</b>把 10 種牌型想成發票的獎項：特獎（皇家同花順）要打好幾萬手才遇得到一次，所以最大；最普通的一對幾乎每兩手就出現一次，所以不太值錢。先看你中的是第幾獎，同一獎再比號碼大小；發票印成什麼顏色（花色）都不影響獎項。</div>
<table class="tbl"><thead><tr><th>排名</th><th>牌型</th><th>怎麼組成</th><th>例子</th></tr></thead><tbody>
<tr><td>1</td><td><strong>皇家同花順</strong>（Royal Flush）</td><td>同一花色的 A-K-Q-J-10</td><td><span class="cards">AsKsQsJsTs</span></td></tr>
<tr><td>2</td><td><strong>同花順</strong>（Straight Flush）</td><td>同一花色的 5 張連續牌</td><td><span class="cards">9h8h7h6h5h</span></td></tr>
<tr><td>3</td><td><strong>四條／鐵支</strong>（Four of a Kind）</td><td>4 張同點數 + 1 張任意牌</td><td><span class="cards">QcQdQhQs7d</span></td></tr>
<tr><td>4</td><td><strong>葫蘆</strong>（Full House）</td><td>三條 + 一對</td><td><span class="cards">8s8h8dKcKs</span></td></tr>
<tr><td>5</td><td><strong>同花</strong>（Flush）</td><td>5 張同花色、不連續</td><td><span class="cards">AdJd8d5d2d</span></td></tr>
<tr><td>6</td><td><strong>順子</strong>（Straight）</td><td>5 張連續、花色不全相同</td><td><span class="cards">Tc9d8h7s6c</span></td></tr>
<tr><td>7</td><td><strong>三條</strong>（Three of a Kind）</td><td>3 張同點數 + 2 張雜牌</td><td><span class="cards">7c7d7hAsQd</span></td></tr>
<tr><td>8</td><td><strong>兩對</strong>（Two Pair）</td><td>兩組不同的對子 + 1 張</td><td><span class="cards">JsJd5c5hAs</span></td></tr>
<tr><td>9</td><td><strong>一對</strong>（One Pair）</td><td>一組對子 + 3 張雜牌</td><td><span class="cards">TsThAcKd4s</span></td></tr>
<tr><td>10</td><td><strong>高牌</strong>（High Card）</td><td>什麼都沒組成，比最大的那張</td><td><span class="cards">AcJd8s4h2c</span></td></tr>
</tbody></table>
<p>點開下面的牌型階梯，看每一種牌型的牌圖、機率與說明：</p>
<div class="widget" data-widget="hand-rankings"></div>
<div class="callout tip"><b>記憶口訣</b>「同花順稱王、四條第二強；葫蘆壓同花、同花壓順子；三條、兩對、一對、高牌排最後。」最容易搞混的是中間四個：<strong>葫蘆 &gt; 同花 &gt; 順子 &gt; 三條</strong>，可以念成「葫・花・順・三」。另外，同花順＝同花＋順子，兩個條件都要滿足，所以比只滿足其中一個的同花、順子都大。</div>

<h3>2. 出現機率：越稀有排越前面</h3>
<p>牌型排名是依「5 張牌」的出現機率制定的：從 52 張牌發 5 張，共有 <strong>2,598,960</strong> 種組合。德州撲克實際上是 7 張選 5 張（共 <strong>133,784,560</strong> 種），每種好牌型都變得更常見：</p>
<table class="tbl"><thead><tr><th>牌型</th><th>5 張牌機率</th><th>7 張牌機率（德州撲克）</th></tr></thead><tbody>
<tr><td>皇家同花順</td><td>0.000154%（約 649,740 次 1 次）</td><td>0.0032%（約 30,940 次 1 次）</td></tr>
<tr><td>同花順（不含皇家）</td><td>0.00139%（約 72,193 次 1 次）</td><td>0.0279%（約 3,591 次 1 次）</td></tr>
<tr><td>四條</td><td>0.024%（約 4,165 次 1 次）</td><td>0.168%（約 595 次 1 次）</td></tr>
<tr><td>葫蘆</td><td>0.144%（約 694 次 1 次）</td><td>2.60%（約 38.5 次 1 次）</td></tr>
<tr><td>同花</td><td>0.197%（約 509 次 1 次）</td><td>3.03%（約 33 次 1 次）</td></tr>
<tr><td>順子</td><td>0.392%（約 255 次 1 次）</td><td>4.62%（約 21.6 次 1 次）</td></tr>
<tr><td>三條</td><td>2.11%</td><td>4.83%</td></tr>
<tr><td>兩對</td><td>4.75%</td><td>23.5%</td></tr>
<tr><td>一對</td><td>42.3%</td><td>43.8%</td></tr>
<tr><td>高牌</td><td>50.1%</td><td>17.4%</td></tr>
</tbody></table>
<div class="callout pro"><b>進階補充</b>7 張牌時有兩個「怪現象」：三條（4.83%）其實比順子（4.62%）略常見，高牌（17.4%）反而比兩對（23.5%）少見。但牌型排名是依「5 張牌」機率訂下的固定規則，不會因此改變。容易搞混的葫蘆與同花則不論 5 張（0.144% vs 0.197%）或 7 張（2.60% vs 3.03%）都是葫蘆比較難湊，所以葫蘆比同花大。</div>

<h3>3. 比大小規則①：牌型相同時怎麼比？</h3>
<p>先比牌型等級；等級相同時，依下表規則比點數。<strong>永遠只比最好的 5 張</strong>，沒有第 6 張牌。</p>
<table class="tbl"><thead><tr><th>牌型</th><th>比較順序</th></tr></thead><tbody>
<tr><td>高牌、同花</td><td>從最大張開始比，相同就比第 2 大，一路比到第 5 張</td></tr>
<tr><td>一對</td><td>先比對子，再依序比 3 張踢腳（Kicker）</td></tr>
<tr><td>兩對</td><td>先比大的那對 → 再比小的那對 → 最後比第 5 張踢腳</td></tr>
<tr><td>三條、四條</td><td>先比三條（四條）的點數，再比踢腳</td></tr>
<tr><td>葫蘆</td><td>先比「三條」那組，三條一樣才比「對子」那組</td></tr>
<tr><td>順子、同花順</td><td>只比最大的那張（10-J-Q-K-A 最大，A-2-3-4-5 最小）</td></tr>
</tbody></table>
<ul>
<li><strong>葫蘆：</strong><span class="cards">KsKhKd2c2s</span>（K 葫蘆）贏 <span class="cards">QsQhQdAcAs</span>（Q 葫蘆）：先比三條 K &gt; Q，後面的對子 A 再大也沒用。</li>
<li><strong>兩對：</strong><span class="cards">AsAd8c8h4s</span> 贏 <span class="cards">AhAc6d6sKs</span>：大對都是 A，比小對 8 &gt; 6，第 5 張的 K 根本輪不到。</li>
<li><strong>同花：</strong>A-J-8-5-2 同花贏 A-J-7-6-4 同花：前兩張相同，第三張 8 &gt; 7。</li>
</ul>
<div class="callout example"><b>例題：踢腳決勝</b>公共牌 <span class="cards">Kh9c7d4s2h</span>。你拿 <span class="cards">AsKd</span>，對手拿 <span class="cards">KcQs</span>。兩人都是一對 K；你的 5 張是 K-K-A-9-7，對手是 K-K-Q-9-7，<strong>第一張踢腳 A &gt; Q，你贏</strong>。這就是為什麼「頂對」也要看踢腳（<a href="#/wiki/glossary/kicker">什麼是踢腳？</a>）。</div>

<h3>4. 比大小規則②：花色、A 的用法、用公共牌與平分</h3>
<ul>
<li><strong>花色沒有大小：</strong>黑桃同花和紅心同花如果 5 張點數完全相同，就是平手。「黑桃最大」是其他牌戲的規則，德州撲克沒有。</li>
<li><strong>A 可大可小：</strong><span class="cards">AhKdQcJsTh</span> 是最大的順子；<span class="cards">5d4c3h2sAd</span> 是最小的順子，叫「輪子（<a href="#/wiki/glossary/wheel">Wheel</a>）」，6 高的順子就能贏它。但 A 不能繞圈：Q-K-A-2-3 <strong>不是</strong>順子。</li>
<li><strong>用公共牌（Play the Board）：</strong>5 張公共牌本身就是你最好的 5 張時，你等於「用牌面在比」。公共牌 <span class="cards">9s8d7c6h5s</span>，你拿 <span class="cards">AcKd</span> 只能用牌面的 9 高順子；對手拿 <span class="cards">Tc2d</span> 組成 10 高順子，對手贏。如果大家都只能用牌面，就平分。</li>
<li><strong>平分底池（Split Pot）：</strong>最好的 5 張點數完全相同就平分。無法平分的零頭籌碼，多數牌室給按鈕左邊第一位（依現場規定）。</li>
</ul>
<div class="callout example"><b>例題：第 6 張牌不算數</b>公共牌 <span class="cards">KsKd7h7c2s</span>。甲拿 <span class="cards">AdQc</span>，乙拿 <span class="cards">Ah3h</span>。兩人最好的 5 張都是 K-K-7-7-A，<strong>平分底池</strong>。甲的 Q 是第 6 張牌，完全不算。</div>
<div class="callout warn"><b>常見錯誤</b>① 以為花色有大小；② 以為第 6、7 張牌可以當踢腳；③ 以為 Q-K-A-2-3 也是順子；④ 公共牌已經是順子或兩對時，忘了自己可能只是「用牌面」，手上的牌根本沒幫上忙。</div>

<h3>5. 實戰練習：誰贏了？</h3>
<p>攤牌時照這三步驟判斷，練幾次就會變成直覺：</p>
<ol class="steps">
<li><b>各自找出最好的 5 張</b>先看公共牌有沒有 3 張同花色、連張或對子，再看底牌補上了什麼。</li>
<li><b>比牌型等級</b>等級高的直接贏，例如同花一定贏順子、葫蘆一定贏同花。</li>
<li><b>同等級再比點數</b>依上面的規則比對子、踢腳或最大張；完全一樣就平分。</li>
</ol>
<div class="widget" data-widget="showdown-game"></div>
<p><strong>下一步：</strong>到 <a href="#/quiz/handname">牌型辨識練習</a> 與 <a href="#/quiz/showdown">誰贏了練習</a> 各做一輪，接著讀下一課 <a href="#/learn/hand-flow">一手牌怎麼進行：從發牌到攤牌</a>。</p>
`,
  sources: [
    { title: 'Wikipedia — Poker probability', url: 'https://en.wikipedia.org/wiki/Poker_probability' },
    { title: 'Wikipedia — List of poker hands', url: 'https://en.wikipedia.org/wiki/List_of_poker_hands' },
    { title: 'Upswing Poker — Poker Hand Rankings', url: 'https://upswingpoker.com/poker-hands-rankings/' },
    { title: 'PokerNews — Poker Hands Ranking', url: 'https://www.pokernews.com/poker-hands/' },
    { title: 'GGPoker — 撲克牌型大小', url: 'https://ggpoker.com/zh-tw/poker-basics/poker-hand-rankings/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'hand-rankings-01', topic: 'hand-rankings', lv: 1,
    q: '下列牌型中，哪一個最大？',
    opts: ['葫蘆（Full House）', '同花（Flush）', '順子（Straight）', '三條（Three of a Kind）'],
    ans: 0,
    exp: '大小順序是葫蘆 > 同花 > 順子 > 三條。7 張牌時湊出葫蘆（約 2.6%）比同花（約 3.0%）更難，所以葫蘆比較大。' },
  { id: 'hand-rankings-02', topic: 'hand-rankings', lv: 1,
    q: '公共牌 K♥ 9♣ 7♦ 4♠ 2♥。你拿 A♠ K♦，對手拿 K♣ Q♠，誰贏？',
    opts: ['你贏：兩人都是一對 K，你的踢腳 A 大於 Q', '對手贏：Q 比較接近 K', '平分：都是一對 K，踢腳不算', '平分：花色不同無法比較'],
    ans: 0,
    exp: '兩人都是一對 K，接著比踢腳：你的 5 張是 K-K-A-9-7，對手是 K-K-Q-9-7，A 大於 Q，你贏。花色在德州撲克不分大小。' },
  { id: 'hand-rankings-03', topic: 'hand-rankings', lv: 1,
    q: '兩對比大小：甲的最佳 5 張是 A-A-6-6-K，乙是 A-A-8-8-4，誰贏？',
    opts: ['乙贏：大對都是 A，再比小對 8 大於 6', '甲贏：甲的踢腳 K 大於 4', '平分：兩人都有一對 A', '甲贏：甲的點數總和比較大'],
    ans: 0,
    exp: '兩對先比大的那對（都是 A），再比小的那對（8 > 6），乙已經贏了，第 5 張踢腳只有在兩對都相同時才比。' },
  { id: 'hand-rankings-04', topic: 'hand-rankings', lv: 1,
    q: '下列哪一組「不是」合法的順子？',
    opts: ['Q-K-A-2-3', 'A-2-3-4-5', '10-J-Q-K-A', '6-7-8-9-10'],
    ans: 0,
    exp: 'A 可以當最大（10-J-Q-K-A）或當 1（A-2-3-4-5，最小的順子「輪子」），但不能繞過 A 把 K 和 2 接起來，所以 Q-K-A-2-3 不是順子。' },
  { id: 'hand-rankings-05', topic: 'hand-rankings', lv: 2,
    q: '公共牌 K♠ K♦ 7♥ 7♣ 2♠。甲拿 A♦ Q♣，乙拿 A♥ 3♥，結果是？',
    opts: ['平分底池：兩人最佳 5 張都是 K-K-7-7-A', '甲贏：甲的 Q 大於乙的 3', '乙贏：乙的 A 是紅心', '甲贏：甲兩張底牌都比較大'],
    ans: 0,
    exp: '兩人都用牌面的兩對 K 與 7，再各用一張 A 當第 5 張，最佳 5 張都是 K-K-7-7-A。甲的 Q 是第 6 張牌，不列入比較，所以平分。' },
  { id: 'hand-rankings-06', topic: 'hand-rankings', lv: 2,
    q: '德州撲克用 7 張牌（2 張底牌 + 5 張公共牌）組牌，最終最常出現的牌型是？',
    opts: ['一對（約 43.8%）', '高牌（約 17.4%）', '兩對（約 23.5%）', '三條（約 4.8%）'],
    ans: 0,
    exp: '7 張選 5 張時，一對約 43.8% 最常見，其次是兩對約 23.5%，高牌只有約 17.4%。所以在德州撲克裡，「有一對」通常不算特別強。' },
  { id: 'hand-rankings-07', topic: 'hand-rankings', lv: 2,
    q: '公共牌 9♠ 8♦ 7♣ 6♥ 5♠。甲拿 A♣ K♦，乙拿 T♣ 2♦。誰贏？',
    opts: ['乙贏：T 接上牌面組成 10 高順子', '甲贏：A 和 K 是全場最大的兩張', '平分：兩人都只能用牌面的順子', '甲贏：A 可以接成 A 高順子'],
    ans: 0,
    exp: '牌面本身就是 9 高順子。乙的 T 能接成 6-7-8-9-10 的 10 高順子；甲的 A、K 接不上任何順子，只能用牌面的 9 高順子（Play the Board），所以乙贏。A 要組順子必須有 10-J-Q-K 或 2-3-4-5 配合。' }
);

// ===========================================================================
// 3. hand-flow — 一手牌怎麼進行：從發牌到攤牌
// ===========================================================================
GTO.THEORY.push({
  id: 'hand-flow',
  stage: 'beginner',
  part: '〇、新手村',
  title: '一手牌怎麼進行：從發牌到攤牌',
  icon: '🔄',
  level: 1,
  minutes: 7,
  tldr: '盲注→發底牌→翻前（UTG 先、BB 最後）→翻牌→轉牌→河牌（翻後 SB 先、BTN 最後）→攤牌。',
  plain: '一手牌就像一場有 4 個關卡的拍賣會：每翻開一次公共牌就開放一輪出價，不想玩的人隨時可以退出。翻牌前大盲已經先付錢，所以最後說話；翻牌後永遠從按鈕左邊開始，按鈕最後一個決定。',
  summary: '用一手完整牌例跟著籌碼走一遍：盲注、發底牌、翻牌前由 UTG 先行動、翻牌後由 SB 先行動、每條街底池怎麼變大，以及攤牌時誰先亮牌、什麼時候可以蓋牌不亮。',
  keyPoints: [
    '發牌前 SB 放 0.5bb、BB 放 1bb，底池一開始就有 1.5bb。',
    '翻牌前由 UTG 先行動、BB 最後；翻牌後三條街都從 SB（或最靠近按鈕左邊的在局玩家）開始，BTN 最後。',
    '每位在局玩家都投入相同金額（或全下）、且都行動過，這一輪才結束，然後發下一張公共牌。',
    '中途只剩 1 人就直接贏走底池；河牌後還有 2 人以上才攤牌。',
    '攤牌時，河牌有人下注就由最後主動下注（加注）的人先亮；河牌全部過牌則從按鈕左邊第一位在局玩家開始亮。'
  ],
  html: `
<h3>1. 開始之前：座位、按鈕與盲注</h3>
<div class="callout plain"><b>白話解釋</b>按鈕就像班上輪流的「值日生名牌」：每打完一手就往左傳一位。坐在值日生左邊的兩個人要先繳「班費」（小盲、大盲），所以每一手牌一開局，桌上就已經有錢可以搶。</div>
<p>6 人桌（6-max）順時針依序是：<strong>BTN（按鈕）→ SB（小盲）→ BB（大盲）→ UTG（槍口）→ HJ（劫持）→ CO（關煞）</strong>，然後回到 BTN。發牌前 SB 放 0.5bb、BB 放 1bb，底池起始 <strong>1.5bb</strong>。接著荷官從 SB 開始順時針，每人發 2 張蓋著的底牌。現場每一條街發公共牌前，荷官都會先「燒掉」（蓋著丟掉）最上面一張牌，避免有人偷看到下一張。</p>
<div class="widget" data-widget="position-table"></div>

<h3>2. 行動順序：翻前 UTG 先，翻後 SB 先</h3>
<table class="tbl"><thead><tr><th>階段</th><th>新發的牌</th><th>行動順序（6 人桌）</th></tr></thead><tbody>
<tr><td>翻牌前（Preflop）</td><td>每人 2 張底牌</td><td>UTG → HJ → CO → BTN → SB → <strong>BB 最後</strong></td></tr>
<tr><td>翻牌（Flop）</td><td>3 張公共牌</td><td><strong>SB 先</strong> → BB → UTG → HJ → CO → <strong>BTN 最後</strong></td></tr>
<tr><td>轉牌（Turn）</td><td>第 4 張公共牌</td><td>同翻牌：在局玩家中最靠 SB 的人先說話</td></tr>
<tr><td>河牌（River）</td><td>第 5 張公共牌</td><td>同翻牌</td></tr>
</tbody></table>
<ul>
<li><strong>為什麼翻前 BB 最後？</strong>盲注算是「已經下的注」，所以從盲注後面的 UTG 開始。若沒人加注、大家只跟 1bb，輪到 BB 時他可以直接過牌看翻牌，或選擇加注（俗稱 BB 的 option）。</li>
<li><strong>一輪什麼時候結束？</strong>每位在局玩家都投入相同金額（或已全下），而且每個人都有機會行動過，這一輪就結束，接著發下一張公共牌。</li>
<li><strong>有人棄牌了怎麼辦？</strong>直接跳過，由順時針下一位在局玩家行動。翻後如果 SB 已棄牌，就由 BB 先說話，以此類推。</li>
<li><strong>單挑特例（Heads-up）：</strong>只剩兩個人的牌桌，按鈕同時是小盲：翻前按鈕先行動，翻後按鈕最後行動。</li>
</ul>
<div class="callout tip"><b>實戰小技巧</b>記住一句話：「翻前看大盲，翻後看按鈕。」翻前大盲最後說話；翻後按鈕最後說話。最後說話的人資訊最多，這就是<a href="#/learn/positions">位置優勢</a>的由來。</div>

<h3>3. 完整牌例：跟著籌碼走一遍</h3>
<p>以下是 6 人桌、每人 100bb 的一手牌。注意每條街結束時底池怎麼變大：</p>
<div class="hh">
<div class="hh-title">牌例：CO 的 A-Q 對上 BB 的 K-Q</div>
<div class="hh-row"><span class="hh-street">盲注</span>SB 放 0.5bb、BB 放 1bb，底池 1.5bb。每人拿到 2 張底牌，你在 CO 拿 <span class="cards">AhQc</span>。</div>
<div class="hh-row"><span class="hh-street">翻前</span>UTG、HJ 棄牌。你加注到 2.5bb，BTN、SB 棄牌，BB（<span class="cards">KdQd</span>）補 1.5bb 跟注。底池 = 2.5 + 2.5 + 0.5 = <strong>5.5bb</strong>。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Qs8d3c</span>：兩人都中一對 Q。BB 先說話：過牌；你下注 2bb，BB 跟注。底池 <strong>9.5bb</strong>。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2h</span>：BB 過牌，你下注 6bb，BB 跟注。底池 <strong>21.5bb</strong>。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">7s</span>：BB 過牌，你下注 14bb，BB 跟注。底池 <strong>49.5bb</strong>。</div>
<div class="hh-row"><span class="hh-street">攤牌</span>你是河牌最後下注的人，先亮牌：一對 Q、踢腳 A。BB 亮出一對 Q、踢腳 K。你的踢腳較大，贏下 49.5bb。</div>
<div class="hh-row result"><span class="hh-street">重點</span>你總共投入 2.5 + 2 + 6 + 14 = 24.5bb，贏回 49.5bb，淨賺 25bb（BB 輸 24.5bb，SB 輸掉盲注 0.5bb）。</div>
</div>
<table class="tbl"><thead><tr><th>街</th><th>行動</th><th>結束時底池</th></tr></thead><tbody>
<tr><td>盲注</td><td>SB 0.5 + BB 1</td><td>1.5bb</td></tr>
<tr><td>翻前</td><td>CO 加注到 2.5、BB 跟注（SB 的 0.5 留在底池）</td><td>5.5bb</td></tr>
<tr><td>翻牌</td><td>下注 2、跟注 2</td><td>9.5bb</td></tr>
<tr><td>轉牌</td><td>下注 6、跟注 6</td><td>21.5bb</td></tr>
<tr><td>河牌</td><td>下注 14、跟注 14</td><td>49.5bb</td></tr>
</tbody></table>
<p>想看動畫版？用下面的元件一步一步播放整手牌（附旁白）：</p>
<div class="widget" data-widget="hand-walkthrough"></div>

<h3>4. 攤牌（Showdown）：誰先亮牌？</h3>
<ol class="steps">
<li><b>河牌有人下注或加注</b>由<strong>最後一個主動下注或加注</strong>（並被跟注）的人先亮牌，之後順時針輪流。</li>
<li><b>河牌所有人都過牌</b>由<strong>按鈕左邊第一位在局玩家</strong>先亮（通常是 SB 或 BB），再順時針輪流。</li>
<li><b>輸了可以不亮</b>看到對手的牌比你大，可以把牌蓋著丟掉（Muck），不必給別人看；但想贏底池，就一定要把兩張底牌都翻開。</li>
<li><b>牌面說話（Cards Speak）</b>以實際翻開的牌為準，由荷官判讀；嘴巴說錯牌型不影響結果。</li>
</ol>
<p>另外，若有人全下而且已經沒有人能再下注，錦標賽規定所有在局玩家要立刻亮牌，再把剩下的公共牌發完；現金桌則依各牌室規定。</p>
<div class="callout warn"><b>常見錯誤</b>以為自己輸了就急著把牌丟進廢牌堆。牌一旦碰到廢牌堆，通常就會被判定為死牌，就算你其實是贏家也拿不回底池。<strong>攤牌時先把牌翻開放在桌上</strong>，等荷官判定。</div>

<h3>5. 常見問題與下一步</h3>
<ul>
<li><strong>翻前大家都棄牌到大盲？</strong>大盲直接贏走小盲的 0.5bb，這手牌就結束了。</li>
<li><strong>某條街大家都過牌？</strong>完全合法，直接發下一張；河牌也都過牌就攤牌。</li>
<li><strong>有人全下、其他人跟注後沒人能再下注？</strong>剩下的公共牌直接發完，然後攤牌。</li>
</ul>
<p>你已經知道一手牌的完整流程。<strong>下一步：</strong>讀 <a href="#/learn/betting-actions">下注動作與規則</a>，學會過牌、下注、跟注、加注與全下的細節；再到 <a href="#/quiz/position">位置辨識練習</a> 熟悉「誰先說話」。想深入了解為什麼位置這麼重要，可以接著看 <a href="#/learn/positions">6 人桌位置與位置優勢</a>。</p>
`,
  sources: [
    { title: 'PokerNews — Texas Hold’em Rules', url: 'https://www.pokernews.com/poker-rules/texas-holdem.htm' },
    { title: 'PokerStrategy — Showdown (Glossary)', url: 'https://www.pokerstrategy.com/glossary/Showdown/' },
    { title: 'PokerSkill — Showdown', url: 'https://www.pokerskill.com/poker-glossary/showdown/' },
    { title: 'Poker Q’z — 德州撲克規則', url: 'https://pokerqz.com/zh-TW/blog/texas-holdem-rules' },
    { title: 'AndyPoker — 德州撲克規則', url: 'https://www.andypoker.com/texas-holdem-rules/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'hand-flow-01', topic: 'hand-flow', lv: 1,
    q: '6 人桌翻牌前，第一個行動的是誰？',
    opts: ['UTG（大盲左邊第一位）', '小盲（SB）', '按鈕（BTN）', '大盲（BB）'],
    ans: 0,
    exp: '翻牌前盲注已經算是下了注，所以從大盲左邊的 UTG 開始，依序 HJ、CO、BTN、SB，大盲最後行動。' },
  { id: 'hand-flow-02', topic: 'hand-flow', lv: 1,
    q: '翻牌後，BTN、SB、BB 三人都還在局，誰先行動？',
    opts: ['SB', 'BB', 'BTN', '翻牌前最後加注的人'],
    ans: 0,
    exp: '翻牌、轉牌、河牌都從按鈕左邊第一位在局玩家開始，也就是 SB；BTN 永遠最後。翻前誰加注不會改變翻後的行動順序。' },
  { id: 'hand-flow-03', topic: 'hand-flow', lv: 1,
    q: '盲注 0.5bb / 1bb。CO 加注到 2.5bb，其他人棄牌，只有 BB 跟注。翻牌時底池有多大？',
    opts: ['5.5bb', '5bb', '3.5bb', '6bb'],
    ans: 0,
    exp: 'CO 投入 2.5bb，BB 補到 2.5bb，再加上 SB 棄牌留下的 0.5bb：2.5 + 2.5 + 0.5 = 5.5bb。' },
  { id: 'hand-flow-04', topic: 'hand-flow', lv: 1,
    q: '河牌 BB 過牌、CO 下注、BB 跟注。攤牌時誰應該先亮牌？',
    opts: ['CO：河牌最後主動下注的人', 'BB：翻後先行動的人', '兩人同時亮牌', '由荷官隨機決定'],
    ans: 0,
    exp: '河牌有人下注並被跟注時，由最後一個主動下注或加注的人先亮牌，這手牌就是 CO。' },
  { id: 'hand-flow-05', topic: 'hand-flow', lv: 2,
    q: 'BB 與 BTN 打到河牌，兩人都過牌。攤牌時誰先亮牌？',
    opts: ['BB：按鈕左邊第一位在局的玩家', 'BTN：按鈕位置最後行動', '翻牌前加注的人', '牌比較小的人'],
    ans: 0,
    exp: '河牌全部過牌時，從按鈕左邊第一位在局玩家開始亮牌。SB 已不在局，所以是 BB 先亮。' },
  { id: 'hand-flow-06', topic: 'hand-flow', lv: 2,
    q: '翻牌圈 SB 下注，BB 棄牌，BTN 跟注。接下來會發生什麼？',
    opts: ['這輪下注結束，發轉牌，轉牌由 SB 先行動', 'BTN 跟注後還要再決定一次是否加注', '直接攤牌比大小', '轉牌改由 BTN 先行動'],
    ans: 0,
    exp: '所有在局玩家（SB、BTN）投入金額相同，且都行動過，這輪就結束。發轉牌後仍由在局玩家中最靠按鈕左邊的 SB 先說話。' },
  { id: 'hand-flow-07', topic: 'hand-flow', lv: 1,
    q: '翻牌前沒有人加注，其他人都只跟注 1bb。輪到大盲（BB）時，他可以怎麼做？',
    opts: ['過牌直接看翻牌，或選擇加注', '必須再補 1bb', '必須棄牌', '只能跟注，不能加注'],
    ans: 0,
    exp: 'BB 已經放了 1bb，大家只是跟上這個金額，所以 BB 不必再補錢，可以過牌看翻牌，也可以加注，這叫 BB 的 option。' }
);

// ===========================================================================
// 4. betting-actions — 下注動作與規則：過牌、下注、跟注、加注、全下
// ===========================================================================
GTO.THEORY.push({
  id: 'betting-actions',
  stage: 'beginner',
  part: '〇、新手村',
  title: '下注動作與規則：過牌、下注、跟注、加注、全下',
  icon: '🪙',
  level: 1,
  minutes: 9,
  tldr: '沒人下注可以過牌或下注；有人下注只能棄牌、跟注或加注。加注至少要加「上一次的加注幅度」，籌碼不夠可以全下並產生邊池。',
  plain: '下注就像競標：還沒人出價時可以「先不出」（過牌）或開價（下注）；有人出價後只能退出、跟價或再抬價。無限注的意思是你隨時可以把面前所有籌碼推進去，但最多只能贏走對手跟得上的部分。',
  summary: '六個基本動作（過牌、下注、跟注、加注、棄牌、全下）何時可用、最小加注規則與數字例、無限注／底池限注／限注三種結構、全下與邊池怎麼分（3 人例），以及口頭宣告、string bet 與下注尺度的說法（bb、底池 %）。',
  keyPoints: [
    '前面沒人下注 → 可以過牌（Check）或下注（Bet）；前面有人下注 → 只能棄牌、跟注或加注。',
    '最小加注：加注的「增量」至少等於本輪前一次下注或加注的增量，例如對手下注 5bb，你最少加到 10bb。',
    '無限注（NL）最多可下全部籌碼；底池限注（PL）最多下到底池大小；限注（FL）每次只能下固定金額。',
    '全下（All-in）時你只能從每位對手身上贏走與自己投入相同的金額，多出來的部分形成邊池（Side Pot）。',
    '現場先口頭宣告再出籌碼；分好幾次往前推籌碼的 string bet 只算第一次推出的量。'
  ],
  html: `
<h3>1. 六個基本動作：什麼時候能用？</h3>
<div class="callout plain"><b>白話解釋</b>就像玩大老二：輪到你時，桌上還沒人出牌，你可以 pass（過牌）或先出（下注）；有人出牌之後，你只能 pass 放棄（棄牌）、出一樣大的（跟注），或出更大的壓過去（加注）。差別是德州撲克比的是籌碼，而且這一輪的「pass」一旦變成棄牌，就不能再回來。</div>
<table class="tbl"><thead><tr><th>動作</th><th>什麼時候可以用</th><th>例子</th></tr></thead><tbody>
<tr><td><strong>過牌</strong>（Check）</td><td>本輪還沒有人下注</td><td>翻牌後第一個說話，敲敲桌子表示「先不下」</td></tr>
<tr><td><strong>下注</strong>（Bet）</td><td>本輪還沒有人下注</td><td>翻牌時第一個投入 3bb</td></tr>
<tr><td><strong>跟注</strong>（Call）</td><td>前面有人下注或加注</td><td>對手下注 3bb，你也放 3bb</td></tr>
<tr><td><strong>加注</strong>（Raise）</td><td>前面有人下注或加注</td><td>對手下注 3bb，你加注到 9bb</td></tr>
<tr><td><strong>棄牌</strong>（Fold）</td><td>輪到你的任何時候</td><td>放棄這手牌，已投入的籌碼拿不回來</td></tr>
<tr><td><strong>全下</strong>（All-in）</td><td>輪到你的任何時候</td><td>把面前所有籌碼推進底池</td></tr>
</tbody></table>
<ul>
<li><strong>翻牌前的盲注算「已經下注」：</strong>所以翻前只有 BB 在沒人加注時能過牌。只跟 1bb 進場叫<strong>溜入（Limp）</strong>，第一個加注叫<strong>開池加注（Open / RFI）</strong>，再加注叫 <strong>3-Bet</strong>，再往上叫 <strong>4-Bet</strong>。</li>
<li><strong>翻牌後每條街重新開始：</strong>前面都過牌，你就能過牌或下注；有人下注，就只剩棄牌、跟注、加注。</li>
</ul>

<h3>2. 最小加注規則（Min-Raise）</h3>
<p>無限注的加注沒有上限，但<strong>有下限</strong>：加注的「增量」至少要等於本輪前一次下注或加注的增量。</p>
<div class="formula">最小加注到 = 目前要跟的金額 + 上一次的加注增量</div>
<table class="tbl"><thead><tr><th>情境</th><th>上一次增量</th><th>最小加注到</th></tr></thead><tbody>
<tr><td>翻前沒人加注，大盲 1bb</td><td>1bb（大盲本身）</td><td>2bb</td></tr>
<tr><td>UTG 開池到 2.5bb</td><td>2.5 − 1 = 1.5bb</td><td>2.5 + 1.5 = <strong>4bb</strong></td></tr>
<tr><td>翻牌對手下注 5bb</td><td>5bb</td><td>5 + 5 = <strong>10bb</strong></td></tr>
<tr><td>對手下注 4bb，有人加注到 14bb</td><td>14 − 4 = 10bb</td><td>14 + 10 = <strong>24bb</strong></td></tr>
</tbody></table>
<div class="callout example"><b>例題：連續加注</b>翻牌底池 10bb。A 下注 5bb，B 最小加注到 10bb（增量 5bb），C 想再加注，最少要到 10 + 5 = <strong>15bb</strong>。如果 B 當初加注到 20bb（增量 15bb），C 最少就要加到 20 + 15 = <strong>35bb</strong>。</div>
<p><strong>全下例外：</strong>籌碼不夠一個完整加注時，你仍然可以全下。但這種「不足額全下」通常不會重新開放加注：已經行動過的玩家只能跟注或棄牌（細節依 TDA 或各牌室規則）。</p>

<h3>3. 三種下注結構：無限注、底池限注、限注</h3>
<table class="tbl"><thead><tr><th>結構</th><th>最小下注</th><th>最大下注</th><th>常見遊戲</th></tr></thead><tbody>
<tr><td><strong>無限注</strong>（No-Limit, NL）</td><td>1 個大盲</td><td>面前全部籌碼</td><td>無限注德州撲克（本站主角）</td></tr>
<tr><td><strong>底池限注</strong>（Pot-Limit, PL）</td><td>1 個大盲</td><td>目前底池大小（加注時先把你的跟注算進底池）</td><td>底池限注奧馬哈（PLO）</td></tr>
<tr><td><strong>限注</strong>（Fixed-Limit, FL）</td><td>固定金額</td><td>固定金額：翻前、翻牌用「小注」，轉牌、河牌用「大注」（通常是小注的 2 倍）</td><td>限注德州撲克</td></tr>
</tbody></table>
<ul>
<li><strong>底池限注怎麼算最大加注？</strong>先假裝你跟注，再加「整個底池」。例：底池 10、對手下注 10 → 你先跟 10（底池變 30）→ 再加 30 → <strong>最多加注到 40</strong>。</li>
<li><strong>限注例子（2/4 限注）：</strong>翻前與翻牌每次下注或加注都是 2，轉牌與河牌都是 4；每輪通常最多「1 次下注 + 3 次加注」就封頂（Cap）。</li>
</ul>

<h3>4. 全下與邊池（Side Pot）：3 人數字例</h3>
<p>全下的黃金規則：<strong>你只能從每位對手身上贏走「你自己投入的同等金額」</strong>。籌碼較多的玩家之間多下的部分會另外放進邊池，籌碼少的玩家沒有資格贏。</p>
<div class="hh">
<div class="hh-title">牌例：三人全下，主池與邊池怎麼分</div>
<div class="hh-row"><span class="hh-street">翻前</span>甲全下 20bb（<span class="cards">QsQh</span>），乙全下 50bb（<span class="cards">AhKd</span>），丙有 100bb，跟注 50bb（<span class="cards">JcJd</span>）。為了好算，盲注已包含在各人的投入裡。</div>
<div class="hh-row"><span class="hh-street">分池</span><strong>主池</strong> = 20 × 3 = 60bb（甲、乙、丙都能贏）；<strong>邊池</strong> = (50 − 20) × 2 = 60bb（只有乙、丙能贏）。丙剩下的 50bb 沒有投入，仍在自己面前。</div>
<div class="hh-row"><span class="hh-street">公共牌</span><span class="cards">Qd9c4d2h7s</span>：甲中三條 Q（全場最大），丙一對 J，乙只有 A 高。</div>
<div class="hh-row"><span class="hh-street">結果</span>甲贏主池 60bb；邊池只比乙和丙，丙的一對 J 贏 A 高，拿走邊池 60bb。</div>
<div class="hh-row result"><span class="hh-street">重點</span>甲淨賺 40bb、丙淨賺 10bb、乙輸 50bb。甲的牌最大，卻只能贏到自己投入的同等金額；每一個池只在「有資格」的玩家之間比大小。</div>
</div>
<p>如果丙當初是全下 100bb，他多出的 50bb 因為沒人跟得上，會在攤牌前直接退回給他，不會變成任何人的獎金。</p>

<h3>5. 口頭宣告、String Bet 與下注尺度的說法</h3>
<ul>
<li><strong>口頭宣告有效：</strong>輪到你時清楚說出「跟注」「加注到 30」就具約束力，說了就要做到。</li>
<li><strong>String Bet（分次下注）：</strong>沒先宣告就先推一些籌碼、再回頭拿更多往前推，會被判為無效加注，只算第一次推出的量。</li>
<li><strong>單一大籌碼：</strong>面對下注時只丟一枚大面額籌碼又沒出聲，視為跟注；想加注要先說「加注（Raise）」。</li>
</ul>
<div class="compare"><div><h4>✅ 正確</h4>先說「加注到 7.5」，再一次把籌碼推出去；或一個動作把籌碼全部推出。</div><div><h4>❌ 錯誤</h4>先推 3 個籌碼、看對手反應，再回頭補 4 個——會被判 string bet，只算第一次的 3 個。</div></div>
<p><strong>下注尺度怎麼說：</strong>翻前用大盲數（開池 2.5bb、3-Bet 到 7.5bb）；翻後用「佔底池的百分比」，方便不同級別互相比較：</p>
<table class="tbl"><thead><tr><th>底池 10bb 時</th><th>33%</th><th>50%</th><th>75%</th><th>100%（滿池）</th><th>150%（超池）</th></tr></thead><tbody>
<tr><td>下注金額</td><td>3.3bb</td><td>5bb</td><td>7.5bb</td><td>10bb</td><td>15bb</td></tr>
</tbody></table>
<div class="callout warn"><b>常見錯誤</b>新手最常犯的規則錯誤：① 說了「跟注」卻丟出加注的金額（以口頭為準，只算跟注）；② 分好幾次推籌碼（string bet）；③ 還沒輪到自己就先行動，影響別人的決策。</div>
<div class="callout tip"><b>實戰小技巧</b>現場一律「先講再推」：說清楚「加注到 7.5」再出籌碼，永遠不會有爭議。線上則善用下注滑桿與 33%、50%、75%、滿池等快捷按鈕。</div>

<h3>6. 下一步</h3>
<p><strong>下一步：</strong>讀 <a href="#/learn/reading-board">看懂牌面：成牌、聽牌與堅果</a>。想先練計算，可以到 <a href="#/quiz/math">撲克數學練習</a>；想了解尺度背後的理論，之後再讀 <a href="#/learn/bet-sizing">下注尺度理論</a>；邊池相關名詞可查 <a href="#/wiki/glossary/side-pot">主池與邊池</a>。</p>
`,
  sources: [
    { title: 'Poker Stack Exchange — What is the min-raise and min-reraise in Hold’em No Limit?', url: 'https://poker.stackexchange.com/questions/2729/what-is-the-min-raise-and-min-reraise-in-holdem-no-limit' },
    { title: 'PokerSkill — Side Pots Explained', url: 'https://www.pokerskill.com/blog/side-pots-explained/' },
    { title: 'GGPoker — Beginner’s Guide: No-Limit vs Pot-Limit vs Fixed-Limit', url: 'https://ggpoker.com/blog/the-beginners-guide-series-no-limit-vs-pot-limit-vs-fixed-limit/' },
    { title: 'PokerListings — Texas Hold’em Betting Rules', url: 'https://www.pokerlistings.com/poker-guides/texas-holdem-betting-rules' },
    { title: 'SoMuchPoker — One Chip Rule in Live Poker', url: 'https://somuchpoker.com/poker-term/one-chip-rule-poker-guide-live-game' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'betting-actions-01', topic: 'betting-actions', lv: 1,
    q: '翻牌圈前面的玩家已經下注 3bb，輪到你時「不能」選哪個動作？',
    opts: ['過牌（Check）', '跟注（Call）', '加注（Raise）', '棄牌（Fold）'],
    ans: 0,
    exp: '過牌只能在本輪還沒有人下注時使用。前面已經有人下注，你只能棄牌、跟注或加注（含全下）。' },
  { id: 'betting-actions-02', topic: 'betting-actions', lv: 1,
    q: '無限注中，對手在翻牌下注 6bb，你想加注，最少要加到多少？',
    opts: ['12bb', '9bb', '6bb', '18bb'],
    ans: 0,
    exp: '最小加注到 = 要跟的 6bb + 上一次增量 6bb = 12bb。18bb 是合法的加注，但不是最小值。' },
  { id: 'betting-actions-03', topic: 'betting-actions', lv: 1,
    q: '翻前 UTG 開池加注到 2.5bb（大盲 1bb），HJ 想 3-Bet，最小合法加注到多少？',
    opts: ['4bb', '3.5bb', '5bb', '7.5bb'],
    ans: 0,
    exp: 'UTG 的加注增量是 2.5 − 1 = 1.5bb，所以最小再加注到 2.5 + 1.5 = 4bb。7.5bb 是常見的 3-Bet 尺度，但不是最小值。' },
  { id: 'betting-actions-04', topic: 'betting-actions', lv: 2,
    q: '三人翻前全下：甲 20bb、乙 50bb、丙跟注 50bb。攤牌甲最大、丙第二、乙最小，籌碼怎麼分？',
    opts: ['甲拿主池 60bb，丙拿邊池 60bb', '甲拿走全部 120bb', '甲拿 60bb，乙丙平分 60bb', '甲拿 20bb，其餘都給丙'],
    ans: 0,
    exp: '主池 20 × 3 = 60bb 三人都有資格，甲贏；邊池 (50 − 20) × 2 = 60bb 只有乙、丙有資格，丙比乙大所以丙拿。甲只能贏到自己投入的同等金額。' },
  { id: 'betting-actions-05', topic: 'betting-actions', lv: 3,
    q: '底池限注（Pot-Limit）中，底池 10、對手下注 10，你最多可以加注到多少？',
    opts: ['40', '30', '20', '沒有上限'],
    ans: 0,
    exp: '先假裝跟注 10，底池變成 10 + 10 + 10 = 30，再加一個底池 30，所以最多加注到 10 + 30 = 40。' },
  { id: 'betting-actions-06', topic: 'betting-actions', lv: 1,
    q: '現場牌局，你沒有任何口頭宣告，先推出 2 枚籌碼、停頓後又回頭拿 3 枚往前推。通常會怎麼判？',
    opts: ['String Bet：只算第一次推出的量，不算加注', '合法加注，以總共 5 枚計算', '整手牌作廢重發', '直接判定你棄牌'],
    ans: 0,
    exp: '分次往前推籌碼又沒有事先宣告，稱為 string bet，只算第一次推出的量。想加注就先說清楚金額，或一次推出。' },
  { id: 'betting-actions-07', topic: 'betting-actions', lv: 1,
    q: '翻牌後底池 12bb，你下注 9bb。這是底池的百分之多少？',
    opts: ['75%', '50%', '33%', '133%'],
    ans: 0,
    exp: '9 ÷ 12 = 0.75，也就是 75% 底池。翻後的下注尺度通常用佔底池的百分比來描述。' },
  { id: 'betting-actions-08', topic: 'betting-actions', lv: 2,
    q: '翻牌對手 A 下注 4bb，玩家 B 加注到 14bb。輪到你想再加注，最少要加到多少？',
    opts: ['24bb', '18bb', '28bb', '20bb'],
    ans: 0,
    exp: 'B 的加注增量是 14 − 4 = 10bb，所以最小再加注到 = 要跟的 14bb + 增量 10bb = 24bb。18bb 只多加了 A 的 4bb；28bb 是把 14bb 翻倍，合法但不是最小值。' }
);

// ===========================================================================
// 5. reading-board — 看懂牌面：成牌、聽牌與堅果
// ===========================================================================
GTO.THEORY.push({
  id: 'reading-board',
  stage: 'beginner',
  part: '〇、新手村',
  title: '看懂牌面：成牌、聽牌與堅果',
  icon: '👀',
  level: 1,
  minutes: 9,
  tldr: '翻牌後先分清楚自己是「成牌」還是「聽牌」，再用三步驟找出目前牌面的堅果（不可能被打敗的牌）。',
  plain: '看牌面就像看天氣預報：乾燥牌面像晴天，現在領先的牌多半能撐到最後；潮濕牌面像午後雷陣雨，順子、同花隨時可能下下來。你得先知道自己已經撐好傘（成牌），還是在等雨停（聽牌）。',
  summary: '學會把手牌分級：Set、兩對、超對、頂對、中對、底對與 Trips；認識同花聽、兩頭順、雙卡順、卡順、後門聽牌與組合聽牌的 outs；用三步驟找出任何牌面的堅果，並入門乾燥與潮濕牌面。',
  keyPoints: [
    '成牌（Made Hand）大致強弱：Set、兩對 > 超對 > 頂對 > 中對 > 底對；頂對要看踢腳。',
    'Set＝口袋對子配牌面一張（很隱蔽）；Trips＝牌面成對配你一張（大家看得到，踢腳很重要）。',
    '常見聽牌 outs：同花聽 9、兩頭順 8、雙卡順 8、卡順 4；同花聽 + 兩頭順的組合聽牌有 15 張。',
    '找堅果三步驟：牌面有對子？→ 有 3 張同花？→ 能連成順子？由大牌型往下檢查。',
    '乾燥牌面（如 K♠ 7♦ 2♣）聽牌少、牌力穩定；潮濕牌面（如 J♥ T♥ 9♣）聽牌多、變化快。'
  ],
  html: `
<h3>1. 成牌分級：你現在有多強？</h3>
<div class="callout plain"><b>白話解釋</b>成牌和聽牌就像考試：成牌是「已經交卷、分數確定」，頂對可能 75 分、Set 可能 98 分；聽牌是「還在等補考」，現在 0 分，但補考過了（中牌）可能直接變 100 分。先搞清楚自己是哪一種，才知道該加碼還是該省錢。</div>
<p><strong>成牌（Made Hand）</strong>是現在就已經有對子或牌型的手牌；<strong>聽牌（Draw）</strong>是現在還不夠大、要靠後面的牌補上的手牌。以翻牌 <span class="cards">Th7d3c</span> 為例：</p>
<table class="tbl"><thead><tr><th>名稱</th><th>意思</th><th>例子（翻牌 T-7-3）</th><th>強度</th></tr></thead><tbody>
<tr><td><strong>Set</strong>（暗三條）</td><td>口袋對子配上牌面一張</td><td><span class="cards">7c7h</span></td><td>非常強</td></tr>
<tr><td><strong>兩對</strong>（Two Pair）</td><td>兩張底牌各配上牌面一張</td><td><span class="cards">Tc7s</span></td><td>很強</td></tr>
<tr><td><strong>超對</strong>（Overpair）</td><td>口袋對子比牌面最大張還大</td><td><span class="cards">QsQh</span></td><td>強</td></tr>
<tr><td><strong>頂對</strong>（Top Pair）</td><td>配上牌面最大的那張</td><td><span class="cards">AdTs</span>（頂對頂踢腳 TPTK）</td><td>中強，看踢腳</td></tr>
<tr><td><strong>中對</strong>（Middle Pair）</td><td>配上牌面中間那張</td><td><span class="cards">As7s</span></td><td>中等</td></tr>
<tr><td><strong>底對</strong>（Bottom Pair）</td><td>配上牌面最小那張</td><td><span class="cards">Ac3d</span></td><td>偏弱</td></tr>
<tr><td><strong>低口袋對</strong>（Underpair）</td><td>口袋對子比牌面最大張小</td><td><span class="cards">5s5h</span></td><td>偏弱</td></tr>
<tr><td><strong>高牌</strong>（沒中）</td><td>什麼都沒配上</td><td><span class="cards">AcKd</span></td><td>弱</td></tr>
</tbody></table>
<p>順子、同花、葫蘆、四條當然更強，但它們需要特定的牌面才可能出現（見第 4 節「找堅果」）。</p>

<h3>2. Set 與 Trips：同樣是三條，差很多</h3>
<div class="compare"><div><h4>Set（暗三條）</h4>口袋對子 + 牌面一張，例如 <span class="cards">7c7h</span> 在 <span class="cards">Th7d3c</span>。牌面看不出來，對手很難防，常常能贏到大底池。</div><div><h4>Trips（明三條）</h4>牌面成對 + 你手上一張，例如 <span class="cards">Ad9c</span> 在 <span class="cards">9s9d4c</span>。大家都看得到牌面有對子，<strong>踢腳很重要</strong>：拿 9 配 K 的對手輸你，但拿 <span class="cards">4h4d</span> 的人已經是葫蘆。</div></div>

<h3>3. 聽牌（Draws）與 outs</h3>
<p><strong>Outs</strong> 是「還沒出現、一出現就能讓你變成強牌」的牌。outs 越多，補到的機會越大：</p>
<table class="tbl"><thead><tr><th>聽牌</th><th>例子（手牌 / 翻牌）</th><th>outs</th><th>翻牌→河牌約</th></tr></thead><tbody>
<tr><td><strong>同花聽</strong>（Flush Draw）</td><td><span class="cards">AhJh</span> / <span class="cards">Kh7h2c</span>：差 1 張紅心</td><td>9</td><td>35%</td></tr>
<tr><td><strong>兩頭順</strong>（OESD）</td><td><span class="cards">9s8s</span> / <span class="cards">Td7c2h</span>：J 或 6 都能成順</td><td>8</td><td>31.5%</td></tr>
<tr><td><strong>雙卡順</strong>（Double Gutshot）</td><td><span class="cards">9s7s</span> / <span class="cards">Jh8c5d</span>：6 或 10 都能成順</td><td>8</td><td>31.5%</td></tr>
<tr><td><strong>卡順</strong>（Gutshot）</td><td><span class="cards">9s8s</span> / <span class="cards">Jd7c2h</span>：只有 10 能補中間</td><td>4</td><td>16.5%</td></tr>
<tr><td><strong>後門同花聽</strong>（Backdoor）</td><td><span class="cards">AsKs</span> / <span class="cards">Qs7d2c</span>：轉牌、河牌都要來黑桃</td><td>—</td><td>約 4.2%</td></tr>
<tr><td><strong>組合聽牌</strong>（Combo Draw）</td><td><span class="cards">JsTs</span> / <span class="cards">9s8s2c</span>：同花聽 + 兩頭順</td><td>15</td><td>約 54%</td></tr>
</tbody></table>
<p>組合聽牌為什麼是 15 張，而不是 9 + 8 = 17 張？因為 Q♠ 和 7♠ 既是黑桃、也是順子牌，被算了兩次，要扣掉：9 + 8 − 2 = 15。看看互動圖解：</p>
<div class="widget" data-widget="draw-outs-examples"></div>
<p>outs 怎麼換算成機率、什麼時候值得追，會在 <a href="#/learn/outs-odds">Outs 與聽牌機率</a> 詳細教，也可以直接去 <a href="#/quiz/outs">數 Outs 練習</a>。</p>

<h3>4. 什麼是堅果（The Nuts）？三步驟找出來</h3>
<p><strong>堅果（<a href="#/wiki/glossary/nuts">Nuts</a>）</strong>是「以目前的牌面，不可能被任何人打敗的最大牌」；第二大的叫<strong>次堅果（Second Nuts）</strong>。每發一張新牌，堅果都可能改變。從最大的牌型往下檢查：</p>
<ol class="steps">
<li><b>牌面有對子嗎？</b>有 → 四條、葫蘆都可能存在，先找它們。例：<span class="cards">8s8d5c</span> 的堅果是口袋 8（四條 8）。</li>
<li><b>有 3 張以上同花色嗎？</b>有 → 同花可能存在，最大的是拿到該花色 A 的同花；但若這些同花牌夠連貫，要先檢查<strong>同花順</strong>。</li>
<li><b>有 3 張能在 5 個點數內連起來的牌嗎？</b>有 → 順子可能存在，找能組成「最高」順子的兩張牌。</li>
</ol>
<p>三步都沒有（沒對子、沒 3 張同花、連不成順子）的乾燥牌面，堅果就是用最大那張配成的三條（Set）。</p>
<table class="tbl"><thead><tr><th>牌面</th><th>堅果</th><th>怎麼判斷</th></tr></thead><tbody>
<tr><td><span class="cards">Ks7d2c</span></td><td><span class="hand">KK</span>（三條 K）</td><td>沒對子、彩虹、連不成順子 → 最大的 Set</td></tr>
<tr><td><span class="cards">9h8h7c</span></td><td><span class="hand">JT</span>（J 高順子）</td><td>只有 2 張紅心還不能成同花；能成順子的有 10-6、J-10、6-5，最大的是 J-10</td></tr>
<tr><td><span class="cards">Qh9h4h</span></td><td>紅心 A + 任一張紅心</td><td>3 張紅心 → 同花可能；點數差太遠，湊不出同花順或順子</td></tr>
<tr><td><span class="cards">Js9s4dTs</span>（轉牌）</td><td><span class="cards">KsQs</span>（K 高同花順）</td><td>3 張黑桃且 J-10-9 相連 → 先查同花順！拿 K♠ Q♠ 組成 K-Q-J-10-9 同花順</td></tr>
</tbody></table>
<div class="callout example"><b>例題：河牌的堅果是什麼？</b>牌面 <span class="cards">AhKd7s7c2h</span>。第一步：有對子（兩張 7）→ 拿另外兩張 7（<span class="cards">7h7d</span>）就是四條 7，<strong>這就是堅果</strong>。紅心只有 2 張不能成同花，而 A 葫蘆（A-A-A-7-7）比四條小。</div>
<div class="callout warn"><b>常見錯誤</b>① 牌面成對時還把同花、順子當成穩贏，忘了葫蘆；② 只看自己的牌，不檢查牌面能組成什麼；③ 以為頂對就是「好牌」——在潮濕或成對的牌面，頂對常常只是中等牌力。</div>

<h3>5. 乾燥 vs 潮濕牌面入門</h3>
<div class="compare"><div><h4>☀️ 乾燥牌面（Dry）</h4><span class="cards">Ks7d2c</span>：三種花色（彩虹 Rainbow）、點數分散。幾乎沒有聽牌，現在領先的牌多半能撐到河牌。</div><div><h4>🌧️ 潮濕牌面（Wet）</h4><span class="cards">JhTh9c</span>：兩張同花、三張相連。同花聽、兩頭順、組合聽牌一大堆，現在領先也可能被追過。</div></div>
<ul>
<li><strong>花色：</strong>彩虹（3 種花色）→ 雙花（Two-tone，2 張同花）→ 單色（Monotone，3 張同花），越後面越濕。</li>
<li><strong>連貫度：</strong>點數越接近（如 9-8-7），能組成順子與聽牌的組合越多。</li>
<li><strong>成對牌面：</strong>如 <span class="cards">8s8d5c</span>，三條與葫蘆變得可能，但其實大部分人都沒中。</li>
</ul>
<div class="callout tip"><b>實戰小技巧</b>翻牌一出來先問三個問題：「有沒有對子？有沒有 3 張（或 2 張）同花？牌是不是很連？」答案越多「有」，牌面越濕，強牌越該下注拿價值與保護；乾燥牌面則可以用小注或過牌控制底池。進階內容見 <a href="#/learn/board-texture">牌面結構分析</a>。</div>

<h3>6. 下一步</h3>
<p><strong>下一步：</strong>讀 <a href="#/learn/starting-hands-101">新手起手牌：哪些牌該玩？</a>，學會在翻牌前就挑出容易做成強牌的手牌。練習請到 <a href="#/quiz/handname">牌型辨識</a> 與 <a href="#/quiz/outs">數 Outs</a>；想把 outs 換算成機率，請看 <a href="#/learn/outs-odds">Outs 與聽牌機率</a>。</p>
`,
  sources: [
    { title: 'PokerNews — Straight Draw', url: 'https://www.pokernews.com/poker-hands/straight-draw.htm' },
    { title: 'Wikipedia — Draw (poker)', url: 'https://en.wikipedia.org/wiki/Draw_(poker)' },
    { title: 'PokerSource — The Nuts in Texas Hold’em', url: 'https://www.pokersource.com/poker-articles/the-nuts-texas-holdem-2.asp' },
    { title: 'Taiwan Rounders — 撲克常用術語', url: 'https://www.taiwanrounders.com/post/poker_common_terms' },
    { title: 'Monster Stack — 德州撲克新手術語', url: 'https://monsterstack.com.tw/blogs/newbie/holdem-glossary-for-beginners' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'reading-board-01', topic: 'reading-board', lv: 1,
    q: '翻牌 T♥ 7♦ 3♣，你拿 Q♠ Q♥。這手牌叫什麼？',
    opts: ['超對（Overpair）', '頂對（Top Pair）', '中對（Middle Pair）', 'Set（暗三條）'],
    ans: 0,
    exp: '口袋對子 QQ 比牌面最大張 10 還大，稱為超對。頂對是用一張底牌配上牌面最大張；Set 是口袋對子配上牌面一張。' },
  { id: 'reading-board-02', topic: 'reading-board', lv: 1,
    q: '你拿 7♣ 7♥，翻牌 T♥ 7♦ 3♣。這是什麼牌型？',
    opts: ['Set（暗三條）', 'Trips（明三條）', '兩對', '超對'],
    ans: 0,
    exp: '口袋對子配上牌面的一張 7 組成三條，叫 Set。Trips 是牌面本身成對、你手上配一張，例如牌面 9-9-4 你拿 A-9。' },
  { id: 'reading-board-03', topic: 'reading-board', lv: 1,
    q: '你拿 9♠ 8♠，翻牌 J♦ 7♣ 2♥。你有幾張 outs 能做成順子？',
    opts: ['4 張：只有 10 能補', '8 張：6 或 10 都可以', '9 張', '2 張'],
    ans: 0,
    exp: '你有 7-8-9-J，只差中間的 10 才能組成 7-8-9-10-J，這叫卡順（Gutshot），共 4 張 10。來 6 只會變成 6-7-8-9，配不上 J，不成順子。' },
  { id: 'reading-board-04', topic: 'reading-board', lv: 2,
    q: '你拿 J♠ T♠，翻牌 9♠ 8♠ 2♣。不重複計算的話，你共有幾張 outs？',
    opts: ['15 張', '17 張', '9 張', '8 張'],
    ans: 0,
    exp: '黑桃剩 9 張（同花聽），Q 與 7 共 8 張能成順子（兩頭順），其中 Q♠、7♠ 被算了兩次，所以 9 + 8 − 2 = 15 張。' },
  { id: 'reading-board-05', topic: 'reading-board', lv: 2,
    q: '翻牌 Q♥ 9♥ 4♥，目前的堅果是什麼？',
    opts: ['紅心 A 加任一張紅心組成的同花', '三條 Q（口袋 QQ）', 'K-J 的順子聽牌', 'Q-9 兩對'],
    ans: 0,
    exp: '牌面沒有對子；3 張紅心代表同花已經可能；點數差太遠，湊不出順子或同花順。所以最大的牌是拿紅心 A 的同花，三條與兩對都比同花小。' },
  { id: 'reading-board-06', topic: 'reading-board', lv: 2,
    q: '河牌牌面 A♥ K♦ 7♠ 7♣ 2♥，堅果是什麼？',
    opts: ['口袋 7♥ 7♦ 組成的四條 7', '口袋 AA 組成的葫蘆', '紅心同花', 'A-K 兩對'],
    ans: 0,
    exp: '牌面有一對 7，先檢查四條：拿另外兩張 7 就是四條 7，沒有任何牌能贏它。牌面只有 2 張紅心，不可能成同花；A 葫蘆也比四條小。' },
  { id: 'reading-board-07', topic: 'reading-board', lv: 1,
    q: '下列哪一個翻牌最「潮濕」（聽牌最多）？',
    opts: ['J♥ T♥ 9♣', 'K♠ 7♦ 2♣', 'A♣ 8♦ 3♥', 'Q♠ Q♦ 4♣'],
    ans: 0,
    exp: 'J-10-9 三張相連又有兩張紅心，同花聽、兩頭順與組合聽牌非常多。K-7-2 與 A-8-3 彩虹不連貫，是乾燥牌面；Q-Q-4 是成對但聽牌很少的牌面。' },
  { id: 'reading-board-08', topic: 'reading-board', lv: 2,
    q: '河牌牌面 9♠ 9♦ 4♣ 7♥ 2♠。你拿 A♦ 9♣，對手拿 9♥ Q♣。誰贏？',
    opts: ['你贏：都是三條 9，你的踢腳 A 大於 Q', '平分：兩人都是三條 9', '對手贏：Q 比較接近 9', '平分：踢腳只有一對時才比'],
    ans: 0,
    exp: '牌面成對時你和對手都是 Trips（明三條 9），接著比踢腳：你的 5 張是 9-9-9-A-7，對手是 9-9-9-Q-7，A 大於 Q，你贏。這就是 Trips 踢腳很重要的原因。' }
);

// ===========================================================================
// 6. starting-hands-101 — 新手起手牌：哪些牌該玩？
// ===========================================================================
GTO.THEORY.push({
  id: 'starting-hands-101',
  stage: 'beginner',
  part: '〇、新手村',
  title: '新手起手牌：哪些牌該玩？',
  icon: '🃏',
  level: 1,
  minutes: 8,
  tldr: '只玩約 15–25% 的好牌：大對子、大百老匯、同花 A、同花連張、中小對子；位置越後玩越多，一律加注或棄牌。',
  plain: '挑起手牌就像組球隊：先發要選實力派（AA、AK），板凳再補幾個有爆發力的角色球員（同花連張、小對子）。在 UTG 後面還有 5 個人沒說話，像客場作戰，只能派最強的上場；到了 BTN 只剩盲注，主場優勢讓你可以多派幾個人。',
  summary: '為什麼新手輸錢最常是因為玩太多牌？認識六大類起手牌、同花比不同花多多少勝率、連張與小對子的價值、位置如何影響開池範圍，並用 UTG 與 BTN 範圍圖建立「加注或棄牌、不要溜入」的新手紀律。',
  keyPoints: [
    '起手牌六大類：大對子、大百老匯、同花 A、同花連張、中小對子、垃圾牌；前五類才值得玩。',
    '同花只比不同花多約 1.5–3.5% 勝率；9♠ 3♠ 這種牌即使同花，仍然是垃圾牌。',
    '位置越後面可以玩越多：本站基準 UTG 開約 17%、BTN 開約 45%。',
    '新手整體只玩約 15–25% 的手牌；前面沒人入池時「加注或棄牌」，不要溜入（Limp）。',
    '面對別人加注要更緊：AJo、KQo 這類牌最怕被 AK、AQ 壓制（Domination）。'
  ],
  html: `
<h3>1. 為什麼要挑牌？</h3>
<div class="callout plain"><b>白話解釋</b>挑牌就像買股票：每次進場都要付「手續費」（盲注與加注），只挑體質好的標的（強牌）長期才會賺；看到什麼都想買，手續費和套牢的虧損就會慢慢把本金吃光。</div>
<p>起手牌的差距在翻牌前就決定了一大半。下表是各手牌對上「一手隨機牌」打到河牌的平均勝率（本站以 40 萬次模擬驗算）：</p>
<table class="tbl"><thead><tr><th>起手牌</th><th>對隨機牌勝率</th><th>評語</th></tr></thead><tbody>
<tr><td><span class="hand">AA</span></td><td>約 85%</td><td>最強起手牌</td></tr>
<tr><td><span class="hand">KK</span></td><td>約 82%</td><td>第二強</td></tr>
<tr><td><span class="hand">AKs</span></td><td>約 67%</td><td>最強的非對子牌</td></tr>
<tr><td><span class="hand">22</span></td><td>約 50%</td><td>勝率不差，但多半要中三條才敢打大底池</td></tr>
<tr><td><span class="hand">76s</span></td><td>約 45%</td><td>勝率低，但能做成隱蔽的順子、同花</td></tr>
<tr><td><span class="hand">72o</span></td><td>約 35%</td><td>公認最差的牌之一</td></tr>
</tbody></table>
<p>勝率只是起點，真正的問題是「中了以後能不能贏大池」。例如 <span class="hand">KJo</span> 中了頂對 K，常常輸給 <span class="hand">AK</span>；這種「同一張大牌、但踢腳比較小」被壓著打的情況叫<strong>壓制（Domination）</strong>，是新手輸大池最常見的原因。</p>
<div class="callout key"><b>好牌有多難拿到？</b>兩張底牌共有 1,326 種組合（C(52,2)），所以：
<ul>
<li>任一口袋對子：13 × 6 = 78 組 → 約 <strong>5.9%</strong>（大約 17 手 1 次）</li>
<li><span class="hand">AA</span>：6 組 → 約 <strong>0.45%</strong>（221 手才 1 次）；AA、KK、QQ 合計約 1.4%（74 手 1 次）</li>
<li>兩張同花（不含對子）：78 × 4 = 312 組 → 約 <strong>23.5%</strong>（大約每 4 手 1 次）</li>
</ul>
頂級牌非常稀有，等不到很正常——耐心棄牌本身就是一種技術。</div>

<h3>2. 起手牌六大分類</h3>
<table class="tbl"><thead><tr><th>類別</th><th>例子</th><th>特色</th><th>新手怎麼玩</th></tr></thead><tbody>
<tr><td><strong>大對子</strong>（Premium Pairs）</td><td><span class="hand">AA</span>–<span class="hand">TT</span></td><td>翻前就大幅領先</td><td>任何位置都加注；被 3-Bet 也常繼續</td></tr>
<tr><td><strong>大百老匯</strong>（Big Broadway）</td><td><span class="hand">AKs</span>、<span class="hand">AKo</span>、<span class="hand">AQs</span>、<span class="hand">AQo</span>、<span class="hand">KQs</span></td><td>容易中「頂對頂踢腳」</td><td>加注開池；<span class="hand">AJo</span>、<span class="hand">KQo</span> 面對早位加注要小心被壓制</td></tr>
<tr><td><strong>同花 A</strong>（Suited Aces）</td><td><span class="hand">ATs</span>–<span class="hand">A2s</span></td><td>能做成堅果同花；A5s–A2s 還能湊 A-2-3-4-5 順子</td><td>本站 UTG 就開大部分同花 A，越後面越完整</td></tr>
<tr><td><strong>同花連張</strong>（Suited Connectors）</td><td><span class="hand">JTs</span>、<span class="hand">T9s</span>、<span class="hand">98s</span>、<span class="hand">87s</span>、<span class="hand">76s</span>、<span class="hand">65s</span></td><td>順子＋同花潛力，中了很隱蔽</td><td>早位玩到 76s，後位再加入 65s、54s；沒中就放棄</td></tr>
<tr><td><strong>中小對子</strong>（Small Pairs）</td><td><span class="hand">99</span>–<span class="hand">22</span></td><td>翻牌中 Set（三條）約 11.8%</td><td>UTG 開 55 以上，HJ 之後全部開；沒中 Set 別戀戰</td></tr>
<tr><td><strong>垃圾牌</strong>（Trash）</td><td><span class="hand">72o</span>、<span class="hand">93o</span>、<span class="hand">J4o</span></td><td>不連、不同花、點數小</td><td>直接棄牌</td></tr>
</tbody></table>
<p>點開下面的 13×13 分級圖，看看每一格屬於哪一級：</p>
<div class="widget" data-widget="hand-tiers"></div>

<h3>3. 同花差多少？連張為什麼有價值？</h3>
<p>同花牌常被新手高估。實際上，同花只比同點數的不同花牌多一點點勝率（對隨機牌）：</p>
<table class="tbl"><thead><tr><th>手牌</th><th>同花（s）</th><th>不同花（o）</th><th>差距</th></tr></thead><tbody>
<tr><td>A-K</td><td>67.0%</td><td>65.4%</td><td>+1.6%</td></tr>
<tr><td>Q-J</td><td>60.2%</td><td>58.2%</td><td>+2.0%</td></tr>
<tr><td>J-10</td><td>57.5%</td><td>55.2%</td><td>+2.3%</td></tr>
<tr><td>A-5</td><td>59.9%</td><td>57.7%</td><td>+2.2%</td></tr>
<tr><td>7-6</td><td>45.3%</td><td>42.3%</td><td>+3.0%</td></tr>
<tr><td>9-3</td><td>43.4%</td><td>40.1%</td><td>+3.3%</td></tr>
</tbody></table>
<ul>
<li>拿同花牌打到河牌，用到手牌做成同花的機率只有約 <strong>6.4%</strong>；翻牌直接拿到同花聽牌約 10.9%。</li>
<li>同花的價值在於「中了常常是大牌、能贏大池」，以及多了半詐唬的機會；它無法把爛牌變好牌。</li>
<li><strong>連張</strong>能組成更多種順子：<span class="hand">76s</span> 能做成 3-7、4-8、5-9、6-10 共 4 種順子；隔一張的 <span class="hand">75s</span> 只有 3 種；<span class="hand">AK</span> 只能組成 10-J-Q-K-A 這 1 種。</li>
</ul>
<div class="callout warn"><b>常見錯誤</b>「同花就能玩」是新手第一大迷思。<span class="hand">93s</span> 只比 <span class="hand">93o</span> 多約 3% 勝率，仍然是垃圾牌；小同花即使中了，也常輸給更大的同花，反而輸得更多。</div>

<h3>4. 位置越後面，可以玩越多</h3>
<p>在 UTG 開池，後面還有 5 個人可能拿到更好的牌，翻牌後還常常要先說話；在 BTN 開池，只剩兩個盲注，翻牌後每條街都最後行動。所以同一手牌，位置越後面越好打：</p>
<table class="tbl"><thead><tr><th>位置</th><th>後面還沒說話的人</th><th>本站開池範圍</th></tr></thead><tbody>
<tr><td>UTG 槍口位</td><td>5 人</td><td>約 17%</td></tr>
<tr><td>HJ 劫持位</td><td>4 人</td><td>約 22%</td></tr>
<tr><td>CO 關煞位</td><td>3 人</td><td>約 30%</td></tr>
<tr><td>BTN 按鈕位</td><td>2 人（只剩盲注）</td><td>約 45%</td></tr>
<tr><td>SB 小盲位</td><td>1 人</td><td>約 43%（加注或棄牌，開 3bb）</td></tr>
</tbody></table>
<p>比較一下 UTG 與 BTN 的開池範圍：</p>
<div class="embed-chart" data-scenario="rfi_utg"></div>
<div class="embed-chart" data-scenario="rfi_btn"></div>
<p>例如 <span class="hand">A9o</span>、<span class="hand">K9o</span> 在 UTG 要棄牌，到了 BTN 卻是標準開池。完整範圍可到 <a href="#/ranges">範圍表</a> 查詢，背後原理在 <a href="#/learn/preflop-rfi">開池加注（RFI）</a> 一課。</p>

<h3>5. 新手紀律：15–25%、加注或棄牌、不要溜入</h3>
<ol class="steps">
<li><b>整體只玩約 15–25% 的手牌</b>這是所有手牌中「自願把錢放進底池」的比例（VPIP）。前面常常已經有人加注，這時只用更強的牌繼續，所以整體會比各位置的開池範圍低。</li>
<li><b>前面沒人入池：加注或棄牌</b>值得玩就加注到 2.5bb（SB 開 3bb），不值得玩就棄牌。</li>
<li><b>不要溜入（Limp）</b>只跟 1bb 會讓 BB 免費看牌、讓後面的人用加注隔離你，而且你失去主動權，只能靠中牌贏。</li>
</ol>
<div class="compare"><div><h4>✅ 加注 2.5bb</h4>可能直接贏下盲注；有人跟注時你握有主動權，翻牌下注常常就能贏；底池人數少，牌力更容易兌現。</div><div><h4>❌ 溜入 1bb</h4>沒機會在翻前就贏；容易變成多人底池；後面玩家常加注，逼你在沒位置時做困難決定。</div></div>
<div class="hh">
<div class="hh-title">牌例：同一手 K♣ J♣，加注 vs 溜入</div>
<div class="hh-row"><span class="hh-street">情境</span>你在 CO 拿 <span class="cards">KcJc</span>，前面全部棄牌，這手牌在本站 CO 開池範圍內。</div>
<div class="hh-row"><span class="hh-street">加注</span>你開到 2.5bb：BTN、SB、BB 只要全部棄牌，你立刻贏 1.5bb；BB 跟注的話，翻牌後你有位置、有主動權。</div>
<div class="hh-row"><span class="hh-street">溜入</span>你只跟 1bb：BTN 加注到 5bb 隔離你，你只能拿一手不上不下的牌、在翻牌後沒位置的情況下應戰，或白白丟掉 1bb。</div>
<div class="hh-row result"><span class="hh-street">重點</span>值得玩就加注、不值得就棄牌。「先溜入看看」是最常見也最昂貴的新手習慣。</div>
</div>
<div class="callout tip"><b>實戰小技巧</b>剛開始不必背整張範圍表：先把本站 <a href="#/ranges/rfi_utg">UTG 範圍</a> 當成「任何位置都能開的核心牌」，到 CO、BTN 再逐步加入更多同花 A、同花連張、小對子與大牌。被別人加注時，先只用大對子、AK、AQ 繼續。</div>

<h3>6. 下一步</h3>
<p><strong>下一步：</strong>讀 <a href="#/learn/beginner-strategy">新手必學的 10 條基本策略</a>。想練翻前判斷，到 <a href="#/quiz/preflop">翻前範圍練習</a>，或打開 <a href="#/ranges">範圍表</a> 對照各位置；想搞懂 1,326 種組合與壓制，可以讀 <a href="#/learn/hands-combos">起手牌、169 種牌型與組合數</a>。</p>
`,
  sources: [
    { title: 'Upswing Poker — Texas Hold’em Starting Hands Guide', url: 'https://upswingpoker.com/texas-holdem-starting-hands-guide/' },
    { title: 'PokerNews — Best Starting Hands in Texas Hold’em', url: 'https://www.pokernews.com/poker-hands/best-starting-hands.htm' },
    { title: 'PokerStrategy — Suited (Glossary)', url: 'https://www.pokerstrategy.com/glossary/Suited/' },
    { title: 'AndyPoker — 德州撲克翻前基礎', url: 'https://www.andypoker.com/preflop-basics/' },
    { title: 'Taiwan Rounders — 三個撲克基本原則', url: 'https://www.taiwanrounders.com/post/three_basic_poker_rules' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'starting-hands-101-01', topic: 'starting-hands-101', lv: 1,
    q: '下列哪一手屬於「同花連張（Suited Connectors）」？',
    opts: ['8♥ 7♥', 'A♠ K♦', '9♣ 3♣', 'Q♦ Q♠'],
    ans: 0,
    exp: '同花連張是同花色、點數相連的兩張牌，例如 8♥ 7♥。A♠ K♦ 不同花；9♣ 3♣ 雖同花但不相連；Q♦ Q♠ 是口袋對子。' },
  { id: 'starting-hands-101-02', topic: 'starting-hands-101', lv: 1,
    q: 'A♠ K♠（同花）和 A♦ K♣（不同花）相比，對一手隨機牌的勝率大約差多少？',
    opts: ['約 1.5–2%', '約 10%', '約 20%', '完全一樣'],
    ans: 0,
    exp: '模擬結果 AKs 約 67.0%、AKo 約 65.4%，只差約 1.6%。同花有幫助，但遠沒有新手想像的大。' },
  { id: 'starting-hands-101-03', topic: 'starting-hands-101', lv: 1,
    q: '你在 UTG（後面還有 5 人），拿到 K♦ 9♣，前面沒人入池。新手最好的做法是？',
    opts: ['棄牌：K9 不同花不在 UTG 開池範圍內', '溜入 1bb 便宜看翻牌', '加注到 2.5bb：有 K 就夠大', '直接全下'],
    ans: 0,
    exp: '本站 UTG 範圍約 17%，K9o 不在其中（到 BTN 才是標準開池）。早位後面人多，容易被更好的牌壓制；溜入更是新手大忌。' },
  { id: 'starting-hands-101-04', topic: 'starting-hands-101', lv: 1,
    q: '前面沒人入池，你在 CO 拿 7♠ 6♠，判斷這手牌值得玩。依新手紀律應該？',
    opts: ['加注開池到 2.5bb', '溜入 1bb', '只補 0.5bb', '等別人先加注再跟'],
    ans: 0,
    exp: '前面沒人入池時，值得玩就加注、不值得就棄牌。76s 在本站 CO 開池範圍內，標準做法是開到 2.5bb。' },
  { id: 'starting-hands-101-05', topic: 'starting-hands-101', lv: 1,
    q: '為什麼新手不該溜入（Limp）？',
    opts: ['失去主動權，還讓後面玩家便宜入池或用加注隔離你', '溜入違反德州撲克規則', '溜入一定會被荷官警告', '溜入後翻牌必須全下'],
    ans: 0,
    exp: '溜入是合法的，但不划算：你無法在翻前贏下盲注，容易變成多人底池，也常被後面玩家加注隔離，被迫在不利的情況下應戰。' },
  { id: 'starting-hands-101-06', topic: 'starting-hands-101', lv: 2,
    q: '拿口袋對子時，翻牌就中 Set（或更好）的機率大約是多少？',
    opts: ['約 12%（大約 8 到 9 次中 1 次）', '約 33%', '約 50%', '約 2%'],
    ans: 0,
    exp: '翻牌 3 張都沒中的機率是 C(48,3) ÷ C(50,3) ≈ 88.2%，所以至少中一張約 11.8%。小對子大多數時候都沒中，沒中就別戀戰。' },
  { id: 'starting-hands-101-07', topic: 'starting-hands-101', lv: 2,
    q: 'UTG 加注到 2.5bb，你在 CO 拿 A♣ J♦。為什麼要特別小心？',
    opts: ['UTG 範圍很強，AJ 不同花常被 AK、AQ 壓制', 'AJ 不同花是垃圾牌', 'CO 不能 3-Bet', 'A 在這種情況只能當 1 點'],
    ans: 0,
    exp: 'UTG 的開池範圍很緊，裡面有很多 AK、AQ。你中了 A 時常常踢腳比較小，贏小池、輸大池，這就是壓制（Domination）。' },
  { id: 'starting-hands-101-08', topic: 'starting-hands-101', lv: 1,
    q: '平均大約幾手牌，才會拿到一次口袋對子（任何一對）？',
    opts: ['約 17 手 1 次（約 5.9%）', '約 4 手 1 次（約 25%）', '約 50 手 1 次（約 2%）', '約 221 手 1 次（約 0.45%）'],
    ans: 0,
    exp: '口袋對子共 13 種 × 6 組 = 78 組，佔 1,326 組的約 5.9%，大約 17 手 1 次。221 手 1 次是指定拿到 AA 的機率；約 4 手 1 次接近拿到兩張同花（23.5%）的機率。' }
);

// ===========================================================================
// 7. beginner-strategy — 新手必學的 10 條基本策略
// ===========================================================================
GTO.THEORY.push({
  id: 'beginner-strategy',
  stage: 'beginner',
  part: '〇、新手村',
  title: '新手必學的 10 條基本策略',
  icon: '🧭',
  level: 1,
  minutes: 9,
  tldr: '緊兇入池、重視位置、加注不溜入、好牌多下注、不對跟注站詐唬、尊重被動玩家的大注、聽牌算賠率、管好資金與情緒、持續學習。',
  plain: '這 10 條就像開車的基本守則：繫安全帶（資金管理）、看後照鏡（位置）、不酒駕（不 Tilt）。你不必一開始就會甩尾漂移（花式詐唬），只要守規矩，就已經比牌桌上大部分人安全，也更容易贏。',
  summary: '把新手最該先做好的 10 件事整理成清單：緊兇風格、位置、翻前加注不溜入、價值下注、不對跟注站詐唬、尊重被動玩家的河牌大注、用底池賠率決定是否追聽牌、資金管理、避免 Tilt 與持續學習；每條都附「為什麼」與實例。',
  keyPoints: [
    '緊兇（TAG）：少玩牌，但玩的時候主動下注與加注。',
    '位置是免費的優勢：同一手牌在 BTN 比在 UTG 好打得多。',
    '有強牌就價值下注（Value Bet），讓更差的牌付錢；不要對「什麼都跟」的玩家詐唬。',
    '被動玩家突然在河牌下大注或加注，通常代表強牌；中等牌力可以放手。',
    '聽牌要算賠率；現金桌至少準備 20–30 個買入的專用資金，情緒上頭就離桌。'
  ],
  html: `
<h3>1. 翻前三原則：緊兇、位置、加注不溜入</h3>
<div class="callout plain"><b>白話解釋</b>緊兇就像狙擊手：子彈（籌碼）有限，所以不亂開槍；一旦瞄準好目標（強牌、好位置），就果斷扣扳機（加注），而不是躲在掩體後面等別人先開火（跟注、溜入）。</div>
<h4>① 打緊兇（Tight-Aggressive, TAG）</h4>
<ul>
<li><strong>為什麼：</strong>少玩牌，讓你的平均起手牌比對手好；主動下注又多了一種贏法——對手棄牌。</li>
<li><strong>例子：</strong>整體只玩約 15–25% 的手牌，而且入池多半是加注，很少只是跟注。</li>
</ul>
<table class="tbl"><thead><tr><th>風格</th><th>玩多少牌</th><th>入池方式</th><th>長期結果</th></tr></thead><tbody>
<tr><td><strong>緊兇（TAG）</strong></td><td>少（約 15–25%）</td><td>加注、下注為主</td><td>✅ 新手最推薦</td></tr>
<tr><td>鬆兇（LAG）</td><td>多</td><td>加注、下注為主</td><td>高手才玩得好</td></tr>
<tr><td>緊弱（Nit）</td><td>少</td><td>跟注、過牌為主</td><td>贏得很少，容易被偷盲</td></tr>
<tr><td>鬆弱（跟注站）</td><td>多</td><td>跟注為主</td><td>❌ 長期最輸錢</td></tr>
</tbody></table>
<h4>② 重視位置</h4>
<ul>
<li><strong>為什麼：</strong>翻牌後最後行動，每條街都能先看對手怎麼做再決定，詐唬與控制底池都更容易。</li>
<li><strong>例子：</strong><span class="hand">A9o</span> 在 UTG 要棄牌，到 BTN 卻是標準開池（見 <a href="#/learn/positions">6 人桌位置</a>）。</li>
</ul>
<h4>③ 翻前加注，不要溜入</h4>
<ul>
<li><strong>為什麼：</strong>加注可能直接贏下盲注、取得主動權，並讓底池人數變少。</li>
<li><strong>例子：</strong>前面沒人入池時，只有「加注到 2.5bb」或「棄牌」兩種選擇（細節見 <a href="#/learn/starting-hands-101">新手起手牌</a>）。</li>
</ul>

<h3>2. 翻後兩原則：強牌價值下注，別對跟注站詐唬</h3>
<h4>④ 有強牌就價值下注（Value Bet）</h4>
<ul>
<li><strong>為什麼：</strong>撲克的利潤大多來自「比你差的牌付錢給你」；拿強牌一直過牌，等於把這些錢留在桌上。</li>
<li><strong>例子：</strong>你拿 <span class="cards">AsKd</span>，翻牌 <span class="cards">Kh8c3d</span> 中頂對頂踢腳，對手是愛跟注的玩家：翻牌、轉牌、河牌都可以下注，讓他的 K-J、Q-Q、帶 8 的牌付錢。</li>
</ul>
<h4>⑤ 不要對跟注站詐唬</h4>
<ul>
<li><strong>為什麼：</strong>詐唬只有在對手棄牌時才賺錢；對手幾乎不棄牌，詐唬就只是送錢。</li>
<li><strong>例子：</strong>見下方例題。</li>
</ul>
<div class="callout example"><b>例題：對跟注站詐唬的期望值</b>河牌底池 10bb，你什麼都沒中，想下注 10bb 詐唬。滿池下注至少要對手棄牌 50% 才不虧（10 ÷ (10 + 10) = 50%）。如果對手是只會棄牌 20% 的跟注站：EV = 20% × 10 − 80% × 10 = <strong>−6bb</strong>。正確做法是放棄這次詐唬，改在拿到好牌時對他多下注。</div>
<div class="callout plain"><b>觀念解惑：「不對跟注站詐唬」等於整場只能枯坐等好牌嗎？</b>完全不是！「不在河牌拿空氣硬詐唬」不等於放棄翻前主動權，也不等於放棄翻牌、轉牌的薄價值。面對愛跟注的新手或休閒玩家：
<ol>
<li><strong>翻前照樣利用位置正常加注</strong>：他們拿次好牌也會付錢給你。</li>
<li><strong>翻後中了頂對、好的中對或強聽牌，就主動 C-Bet 拿價值</strong>：例如拿 <span class="hand">AK</span> 在有 A 的翻牌下注，對手拿一對 Q 跟注——這是價值注，不是詐唬。</li>
<li><strong>完全沒中、對手又很感興趣時，就乾脆放棄</strong>。</li>
</ol>
口訣：「沒牌時別花錢，有好牌時狠狠收割他！」</div>

<h3>3. 防守兩原則：尊重被動玩家的大注，聽牌要算賠率</h3>
<h4>⑥ 被動玩家突然下大注或加注，要尊重</h4>
<ul>
<li><strong>為什麼：</strong>低級別的被動玩家很少詐唬，尤其在河牌。他們一旦主動加注，範圍通常集中在兩對、三條、順子以上。</li>
<li><strong>例子：</strong>見下方牌例。</li>
</ul>
<div class="hh">
<div class="hh-title">牌例：河牌被跟注站加注</div>
<div class="hh-row"><span class="hh-street">翻前</span>你在 CO 拿 <span class="cards">AhQd</span> 開池 2.5bb，BB 跟注（底池 5.5bb）。BB 是整晚只會跟注、幾乎不加注的玩家。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Qs9s4c</span>：BB 過牌，你下注 3bb，BB 跟注（底池 11.5bb）。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">7d</span>：BB 過牌，你下注 7bb，BB 跟注（底池 25.5bb）。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">8s</span>：BB 過牌，你下注 15bb，BB 突然加注到 50bb。</div>
<div class="hh-row result"><span class="hh-street">重點</span>你只有頂對頂踢腳。牌面已經可能有同花（3 張黑桃）、順子（J-10、10-6、6-5）與兩對、三條，而這位玩家整晚第一次加注——棄牌是紀律，不是膽小。</div>
</div>
<h4>⑦ 聽牌要看賠率</h4>
<ul>
<li><strong>為什麼：</strong>聽牌大多數時候不會中；只有當「底池給你的報酬」夠高時，跟注才划算。</li>
<li><strong>例子：</strong>轉牌底池 10bb，你拿同花聽牌（河牌補中約 19.6%）。對手下注 5bb：必要勝率 = 5 ÷ (10 + 5 + 5) = 25%，不夠 → 棄牌；對手只下 2bb：2 ÷ (10 + 2 + 2) ≈ 14.3%，夠 → 跟注。</li>
</ul>
<div class="formula">必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）</div>

<h3>4. 場外三原則：資金管理、避免 Tilt、持續學習</h3>
<h4>⑧ 資金管理（Bankroll Management）</h4>
<ul>
<li><strong>為什麼：</strong>撲克短期波動很大，再強的玩家也會連輸好幾個買入；資金不夠厚，一次低潮就出局。</li>
<li><strong>例子：</strong>現金桌至少準備 20–30 個買入（線上波動更大，建議 30 個以上）：打每次買入 1,000 元的牌局，就要有 2–3 萬元「輸光也不影響生活」的專用資金；錦標賽則要 50–100 個買入以上。完整表格見 <a href="#/learn/bankroll-mindset">資金管理與心態</a>。</li>
</ul>
<h4>⑨ 避免 Tilt（情緒上頭）</h4>
<ul>
<li><strong>為什麼：</strong>被爆冷（Bad Beat）之後，人會想「馬上贏回來」，開始玩太多牌、亂詐唬、追不划算的聽牌。</li>
<li><strong>例子：</strong>事先設定停損線：一次輸掉 3 個買入，或發現自己在生氣，就立刻離桌（見 <a href="#/wiki/glossary/tilt">Tilt</a>）。</li>
</ul>
<h4>⑩ 持續學習</h4>
<ul>
<li><strong>為什麼：</strong>對手會進步，牌局也在變；只靠感覺打牌，同樣的錯會一直重複。</li>
<li><strong>例子：</strong>每次打完挑 1–2 手「當下不確定」的牌覆盤，用本站範圍表與練習檢查，每週固定做幾輪 <a href="#/quiz/mix">綜合練習</a>。</li>
</ul>
<div class="callout warn"><b>常見誤解</b>「GTO 高手都很常詐唬，所以我也要多詐唬。」錯！GTO 的詐唬建立在精確的範圍與頻率上，而低級別對手常常跟太多。新手階段，<strong>少詐唬、多價值下注</strong>，是最快開始贏錢的方式。</div>

<h3>5. 10 條速查表</h3>
<table class="tbl"><thead><tr><th>#</th><th>原則</th><th>一句話為什麼</th></tr></thead><tbody>
<tr><td>1</td><td>打緊兇（TAG）</td><td>起手牌比對手好，又多一種贏法</td></tr>
<tr><td>2</td><td>重視位置</td><td>最後說話的人資訊最多</td></tr>
<tr><td>3</td><td>加注，不要溜入</td><td>主動權＋可能直接贏下盲注</td></tr>
<tr><td>4</td><td>強牌價值下注</td><td>讓更差的牌付錢</td></tr>
<tr><td>5</td><td>不對跟注站詐唬</td><td>他不棄牌，詐唬就是送錢</td></tr>
<tr><td>6</td><td>尊重被動玩家的大注</td><td>被動玩家很少詐唬</td></tr>
<tr><td>7</td><td>聽牌看賠率</td><td>勝率要高過必要勝率才跟</td></tr>
<tr><td>8</td><td>資金管理</td><td>撐過波動，才等得到長期結果</td></tr>
<tr><td>9</td><td>避免 Tilt</td><td>情緒會讓所有原則失效</td></tr>
<tr><td>10</td><td>持續學習</td><td>不覆盤，錯誤會一直重複</td></tr>
</tbody></table>
<div class="callout tip"><b>實戰小技巧</b>把這張表存成手機截圖，每次上桌前看一遍；打完再對照，看看今天違反了哪一條。一次專心改一條，比一次想改十條有效得多。</div>

<h3>6. 下一步</h3>
<p><strong>下一步：</strong>讀 <a href="#/learn/beginner-mistakes">新手最常犯的 15 個錯誤</a>，對照自己有沒有中招。想練習跟注計算，到 <a href="#/quiz/math">撲克數學練習</a>；想了解對手類型與剝削，之後可以讀 <a href="#/learn/exploit">GTO 與剝削打法</a>。</p>
`,
  sources: [
    { title: 'Upswing Poker — Quick Poker Tips for Texas Hold’em', url: 'https://upswingpoker.com/quick-poker-tips-texas-holdem/' },
    { title: 'Upswing Poker — Tournament Advice for Beginners', url: 'https://upswingpoker.com/tournament-advice-beginners/' },
    { title: 'Natural8 — 撲克新手最常犯的 8 個錯誤', url: 'https://www.natural8.com/zh-TW/blog/top-8-mistakes-new-poker-players-make' },
    { title: 'AndyPoker — 德州撲克常見錯誤', url: 'https://www.andypoker.com/common-mistakes/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'beginner-strategy-01', topic: 'beginner-strategy', lv: 1,
    q: '「緊兇（TAG）」打法指的是什麼？',
    opts: ['少玩牌，但入池後主動下注、加注', '玩很多牌，而且常常跟注', '只玩 AA，其他牌全部棄掉', '每一手都嘗試詐唬'],
    ans: 0,
    exp: '緊（Tight）＝挑牌嚴格、玩得少；兇（Aggressive）＝入池後以下注、加注為主。這是新手最推薦的風格；玩很多又常跟注的是長期最輸錢的鬆弱型。' },
  { id: 'beginner-strategy-02', topic: 'beginner-strategy', lv: 1,
    q: '對手是幾乎從不棄牌的跟注站，你在河牌什麼都沒中。通常最好的做法是？',
    opts: ['放棄詐唬，過牌或棄牌', '下超大注逼他棄牌', '直接全下', '每次都小額下注試探'],
    ans: 0,
    exp: '詐唬只有在對手棄牌時才賺錢。跟注站很少棄牌，對他詐唬的期望值是負的；應該把下注留給有好牌的時候，讓他付錢。' },
  { id: 'beginner-strategy-03', topic: 'beginner-strategy', lv: 2,
    q: '轉牌底池 10bb，對手下注 5bb，你只有同花聽牌（河牌補中約 19.6%）。單看底池賠率該怎麼做？',
    opts: ['棄牌：需要 25% 勝率，聽牌只有約 20%', '跟注：同花聽牌一定要追', '加注全下', '跟注：只需要 10% 勝率'],
    ans: 0,
    exp: '必要勝率 = 5 ÷ (10 + 5 + 5) = 25%，高於補中機率約 19.6%，單看底池賠率應該棄牌（除非確定中了還能多贏很多，也就是隱含賠率）。' },
  { id: 'beginner-strategy-04', topic: 'beginner-strategy', lv: 1,
    q: '一位整晚只會跟注的被動玩家，在河牌突然對你的頂對加注。最常見的正確解讀是？',
    opts: ['他多半有強牌，中等牌力可以考慮棄牌', '他一定是在詐唬', '他按錯了，你應該全下', '被動玩家加注代表聽牌失敗'],
    ans: 0,
    exp: '低級別的被動玩家很少在河牌詐唬，他們主動加注時範圍通常集中在兩對、三條、順子以上。尊重這種訊號，頂對也可以放手。' },
  { id: 'beginner-strategy-05', topic: 'beginner-strategy', lv: 1,
    q: '打每次買入 100bb 的現金桌，新手至少要準備多少個買入的專用資金？',
    opts: ['至少 20–30 個買入（線上建議 30 個以上）', '2–3 個買入', '5 個買入', '帶 1 個買入就夠了'],
    ans: 0,
    exp: '撲克短期波動很大，連輸好幾個買入很正常。現金桌建議至少 20–30 個買入，線上波動更大建議 30 個以上；錦標賽要 50–100 個以上。' },
  { id: 'beginner-strategy-06', topic: 'beginner-strategy', lv: 1,
    q: '同樣拿 A♠ 9♦、前面所有人都棄牌。依本站開池範圍，哪個位置「應該」加注開池？',
    opts: ['BTN（按鈕位）', 'UTG（槍口位）', '在 UTG 先溜入，翻牌再決定', '任何位置都應該棄牌'],
    ans: 0,
    exp: 'A9 不同花不在 UTG 約 17% 的開池範圍內，但在 CO、BTN 都是標準開池。位置越後面，後面要擔心的人越少，翻後又有位置優勢。' },
  { id: 'beginner-strategy-07', topic: 'beginner-strategy', lv: 1,
    q: '為什麼 Tilt（情緒上頭）會嚴重傷害勝率？',
    opts: ['情緒上頭時會玩太多牌、亂詐唬、追不划算的聽牌', 'Tilt 會讓發到的牌變差', 'Tilt 只會影響線上撲克', 'Tilt 讓人更專注，其實有利'],
    ans: 0,
    exp: '發牌不受情緒影響，但你的決策會。Tilt 時人會急著贏回來，做出一連串負期望值的決定。設定停損線、情緒不對就離桌，是最有效的保護。' }
);

// ===========================================================================
// 8. beginner-mistakes — 新手最常犯的 15 個錯誤
// ===========================================================================
GTO.THEORY.push({
  id: 'beginner-mistakes',
  stage: 'beginner',
  part: '〇、新手村',
  title: '新手最常犯的 15 個錯誤',
  icon: '🚫',
  level: 1,
  minutes: 10,
  tldr: '新手輸錢的原因很集中：玩太多牌、溜入、跟太多、亂追聽牌、高估頂對、亂詐唬與 Tilt；逐一改掉就能贏過大半休閒玩家。',
  plain: '這課像一份「健康檢查表」：每個錯誤都寫出症狀、病因與處方。你不需要一次全改，先挑出自己最常犯的 2–3 個，下一次上桌專心改掉，就是最快的進步。',
  summary: '整理新手最常見的 15 個漏洞，分成翻前、翻後、心態與習慣三大類；每個錯誤都用「症狀 → 為什麼虧 → 怎麼改」說明，並用對照框比較錯誤與正確做法，附數字例、完整牌例與修正計畫。',
  keyPoints: [
    '翻前最大漏洞：玩太多牌、溜入、無視位置、被大牌壓制、只看自己的牌。',
    '翻後最大漏洞：當跟注站、追聽牌不算賠率、高估頂對、對跟注站詐唬、慢打過頭、看錯牌面。',
    '心態漏洞：Tilt、結果導向、打超出資金的級別、不覆盤又分心。',
    '修正要具體：用範圍表決定入池、用必要勝率決定跟注、用停損線決定離桌。'
  ],
  html: `
<h3>1. 翻前 5 大錯誤</h3>
<div class="callout plain"><b>白話解釋</b>翻前的錯誤像「漏水的水龍頭」：每次只滴一點點（溜入 1bb、跟注 2.5bb），看起來無關痛癢，一個晚上下來卻是一整桶水（好幾個買入）。撲克術語把這種長期失血的習慣叫做「漏洞（Leak）」。</div>
<table class="tbl"><thead><tr><th>#</th><th>錯誤</th><th>症狀</th><th>為什麼虧</th><th>怎麼改</th></tr></thead><tbody>
<tr><td>1</td><td><strong>玩太多手牌</strong></td><td>什麼牌都想看翻牌，VPIP 超過 35%</td><td>平均起手牌比對手差，常做出「第二大」的牌</td><td>照本站範圍表，整體控制在 15–25%</td></tr>
<tr><td>2</td><td><strong>溜入（Limp）</strong></td><td>前面沒人入池時只跟 1bb</td><td>不能在翻前贏、失去主動權、常被隔離加注</td><td>加注 2.5bb 或棄牌，二選一</td></tr>
<tr><td>3</td><td><strong>無視位置</strong></td><td>UTG 和 BTN 玩一樣多的牌</td><td>早位後面人多、翻後又沒位置，邊緣牌很難賺錢</td><td>早位最緊，越靠近按鈕越寬</td></tr>
<tr><td>4</td><td><strong>被大牌壓制</strong></td><td>用 AJo、KQo、A9o 跟早位的加注</td><td>中了頂對也常輸給 AK、AQ：贏小池、輸大池</td><td>面對早位加注，弱 A、弱 K 直接棄牌</td></tr>
<tr><td>5</td><td><strong>只看自己的牌</strong></td><td>前面已經有人加注、再加注，還拿 KQo 跟</td><td>對手的動作透露牌力，兩個人加注代表範圍很強</td><td>先問「對手可能拿什麼」，再看自己的牌</td></tr>
</tbody></table>
<div class="compare"><div><h4>✅ 正確</h4>UTG 加注到 2.5bb，你在 CO 拿 <span class="cards">Ac9d</span>：A9 不同花面對早位加注，常被更大的 A 壓制 → <strong>棄牌</strong>，只損失 0。</div><div><h4>❌ 錯誤</h4>你跟注，翻牌 <span class="cards">Ah7s2c</span> 中頂對很開心，一路跟到河牌，對手亮出 <span class="cards">AsKh</span>。「中了」反而輸最多。</div></div>

<h3>2. 翻後 6 大錯誤</h3>
<table class="tbl"><thead><tr><th>#</th><th>錯誤</th><th>症狀</th><th>為什麼虧</th><th>怎麼改</th></tr></thead><tbody>
<tr><td>6</td><td><strong>當跟注站</strong></td><td>怕被詐唬，什麼都跟到河牌</td><td>低級別玩家下大注多半真的有牌，跟注等於付錢看牌</td><td>跟注前先說出「他可能在詐唬哪些牌」，說不出來就棄</td></tr>
<tr><td>7</td><td><strong>追聽牌不算賠率</strong></td><td>不管下注多大都追同花、順子</td><td>聽牌多數時候不會中，價格太貴就是負 EV</td><td>用二四法則估勝率，和必要勝率比較</td></tr>
<tr><td>8</td><td><strong>高估頂對、超對</strong></td><td>弱踢腳頂對面對加注或三條街大注還不放</td><td>被強烈反擊時常輸給兩對、三條或更好的頂對</td><td>頂對適合控制底池；面對強烈反擊要願意放手</td></tr>
<tr><td>9</td><td><strong>對跟注站詐唬</strong></td><td>河牌沒中就想靠大注嚇跑對手</td><td>對手不棄牌，詐唬就是送錢</td><td>先看對手類型：對跟注站只做價值下注</td></tr>
<tr><td>10</td><td><strong>慢打過頭</strong></td><td>拿強牌一直過牌想「設陷阱」</td><td>少贏價值，還讓對手免費補到更大的牌</td><td>潮濕牌面拿強牌就直接下注</td></tr>
<tr><td>11</td><td><strong>看錯牌面</strong></td><td>以為自己是堅果，忽略同花、順子、成對牌面</td><td>在最大的底池輸給葫蘆或同花</td><td>每條街用「三步驟」檢查堅果（見 <a href="#/learn/reading-board">看懂牌面</a>）</td></tr>
</tbody></table>
<div class="callout example"><b>例題：追聽牌要付多少代價？</b>轉牌底池 20bb，對手下注 20bb，你只有同花聽牌（河牌補中 9 ÷ 46 ≈ 19.6%）。必要勝率 = 20 ÷ (20 + 20 + 20) ≈ 33%，遠高於 19.6%。不考慮之後的下注，每次跟注的期望值 ≈ 19.6% × 40 − 80.4% × 20 ≈ <strong>−8.3bb</strong>。</div>
<div class="compare"><div><h4>✅ 有理由的跟注</h4>對手是常亂打的激進玩家，你的牌能贏他大部分的詐唬，而且必要勝率不高。</div><div><h4>❌ 好奇心跟注</h4>「我想看看他到底拿什麼。」——這是全世界最貴的學費，請改用覆盤和練習來滿足好奇心。</div></div>

<h3>3. 心態與習慣 4 大錯誤</h3>
<table class="tbl"><thead><tr><th>#</th><th>錯誤</th><th>症狀</th><th>為什麼虧</th><th>怎麼改</th></tr></thead><tbody>
<tr><td>12</td><td><strong>Tilt（情緒上頭）</strong></td><td>被爆冷後開始亂加注，想馬上贏回來</td><td>決策品質崩壞，把小輸變成大輸</td><td>設停損線（例如輸 3 個買入）並離桌</td></tr>
<tr><td>13</td><td><strong>結果導向</strong></td><td>「上次這樣打贏了，所以是對的」</td><td>短期運氣會掩蓋決策好壞，還會強化錯誤習慣</td><td>用「當下的期望值」評估，而不是看輸贏</td></tr>
<tr><td>14</td><td><strong>打超出資金的級別</strong></td><td>只有 3 個買入就上桌，或輸了就升級想回本</td><td>一次正常的低潮就破產</td><td>至少 20–30 個買入；資金跌了就降級</td></tr>
<tr><td>15</td><td><strong>不覆盤、邊打邊分心</strong></td><td>一邊滑手機一邊打，打完就忘</td><td>錯過對手資訊，同樣的錯一直重犯</td><td>專心打；每次挑 1–2 手牌覆盤</td></tr>
</tbody></table>
<div class="compare"><div><h4>✅ 過程導向</h4>翻前拿 AA 對上 KK 全下（AA 勝率約 82%），結果河牌被追平輸了——<strong>決策正確</strong>，下次照樣全下。</div><div><h4>❌ 結果導向</h4>「AA 也會輸，以後不全下了。」用一次結果推翻正確決策，長期只會少賺。</div></div>

<h3>4. 牌例：一手牌連犯 6 個錯</h3>
<div class="hh">
<div class="hh-title">牌例：UTG 的 K-7 一路跟到底</div>
<div class="hh-row"><span class="hh-street">翻前</span>你在 UTG 拿 <span class="cards">Kd7c</span> 溜入 1bb（❌ 錯誤 1、2、3：早位玩弱牌又溜入）。BTN 加注到 4bb，盲注棄牌，你跟注（❌ 錯誤 5：沒想過 BTN 加注代表什麼）。底池 9.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Kh9h4s</span>：你中頂對、踢腳 7。你過牌，BTN 下注 6bb，你跟注。底池 21.5bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2c</span>：你過牌，BTN 下注 15bb，你跟注（❌ 錯誤 8：高估弱踢腳頂對）。底池 51.5bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">Jd</span>：你過牌，BTN 全下 75bb，你跟注（❌ 錯誤 6：當跟注站）。BTN 亮出 <span class="cards">AhKs</span>，你輸掉整整 100bb。</div>
<div class="hh-row result"><span class="hh-street">重點</span>這手牌在翻前就該結束：UTG 直接棄掉 K7o，什麼事都不會發生。就算走到翻牌，弱踢腳頂對面對三條街大注，也應該在轉牌或河牌放手。</div>
</div>

<h3>5. 修正計畫：一次改 2–3 個</h3>
<ol class="steps">
<li><b>健康檢查</b>對照上面 15 項，誠實勾出自己常犯的錯誤。</li>
<li><b>只挑 2–3 個</b>從最花錢的開始改，通常是 #1 玩太多牌、#2 溜入、#6 當跟注站。</li>
<li><b>上桌前寫下今天的規則</b>例如「UTG 只開範圍表裡的牌」「河牌被被動玩家加注就棄掉中等牌」。</li>
<li><b>打完覆盤與練習</b>挑 1–2 手不確定的牌，用範圍表與 <a href="#/quiz/preflop">翻前練習</a>、<a href="#/quiz/math">數學練習</a> 檢查。</li>
</ol>
<div class="callout warn"><b>小心矯枉過正</b>改錯誤時最常見的副作用是「改過頭」：從什麼都跟的跟注站，變成什麼都棄的緊弱玩家；或是從不詐唬，變成每手都詐唬。目標是有理由地做決定，而不是換一個極端。</div>
<div class="callout tip"><b>實戰小技巧</b>本站的 <a href="#/wiki/leaks">漏洞百科</a> 整理了更多常見漏洞與對應練習；每個月重新做一次健康檢查，看看哪些已經改掉、哪些又冒出來。</div>

<h3>6. 下一步</h3>
<p><strong>下一步：</strong>讀 <a href="#/learn/etiquette">牌桌禮儀：現場與線上規則</a>，避免「規則上的錯誤」。想複習正確做法，回頭看 <a href="#/learn/beginner-strategy">新手必學的 10 條基本策略</a>；想用數字修正追聽牌的漏洞，請讀 <a href="#/learn/outs-odds">Outs 與聽牌機率</a>。</p>
`,
  sources: [
    { title: 'Hand2Note — Common Preflop Mistakes Made by Beginner Players', url: 'https://hand2note.com/Blog/Features/common-preflop-mistakes-made-by-beginner-players' },
    { title: 'Bluffing Monkeys — 10 Common Poker Mistakes', url: 'https://bluffingmonkeys.com/10-common-poker-mistakes/' },
    { title: 'PokerStrategy — 10 Typical Rookie Mistakes', url: 'https://www.pokerstrategy.com/strategy/fixed-limit/10-typical-rookie-mistakes/' },
    { title: 'Natural8 — 撲克新手最常犯的 8 個錯誤', url: 'https://www.natural8.com/zh-TW/blog/top-8-mistakes-new-poker-players-make' },
    { title: 'AndyPoker — 德州撲克常見錯誤', url: 'https://www.andypoker.com/common-mistakes/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'beginner-mistakes-01', topic: 'beginner-mistakes', lv: 1,
    q: '下列哪一個是新手「翻前」最常見、也最花錢的錯誤？',
    opts: ['玩太多手牌（任何兩張都想看翻牌）', '拿 AA 加注', '在 BTN 用較寬的範圍開池', '棄掉 7♣ 2♦'],
    ans: 0,
    exp: '玩太多手牌會讓平均起手牌比對手差，常做出第二大的牌而輸大池。AA 加注、BTN 放寬範圍、棄掉 72o 都是正確做法。' },
  { id: 'beginner-mistakes-02', topic: 'beginner-mistakes', lv: 1,
    q: '你拿 K♦ 7♣ 中了頂對 K（踢腳 7），對手在翻牌、轉牌、河牌連續下重注。最可能犯的錯誤是什麼？',
    opts: ['高估頂對：弱踢腳很容易輸給更好的 K 或兩對', '應該全下反擊，因為頂對很強', '對手連續下注一定是詐唬', '踢腳在德州撲克不重要'],
    ans: 0,
    exp: '三條街重注代表對手範圍很強。你的 K 只配 7，對手只要有 A-K、K-Q、K-J 或兩對、三條都贏你。弱踢腳頂對適合控池，面對強烈攻擊要願意放手。' },
  { id: 'beginner-mistakes-03', topic: 'beginner-mistakes', lv: 1,
    q: '「結果導向」是什麼意思？',
    opts: ['用這手牌的輸贏判斷決策好壞，而不是看決策當下的期望值', '每次都根據輸贏調整範圍，這是正確做法', '只在贏錢時繼續玩', '只看攤牌結果覆盤是最好的學習方式'],
    ans: 0,
    exp: '短期內運氣影響很大，正確的決策也可能輸。用結果判斷對錯，會讓你放棄好的打法、保留壞習慣；應該評估決策當下的期望值。' },
  { id: 'beginner-mistakes-04', topic: 'beginner-mistakes', lv: 2,
    q: '河牌底池 20bb，對手下注 20bb。你只有一對小牌，對手是很少詐唬的緊手玩家。跟注至少需要多少勝率？',
    opts: ['約 33%（20 ÷ 60）', '約 50%', '約 20%', '約 10%'],
    ans: 0,
    exp: '必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）= 20 ÷ (20 + 20 + 20) ≈ 33%。對很少詐唬的對手，一對小牌通常達不到，應該棄牌。' },
  { id: 'beginner-mistakes-05', topic: 'beginner-mistakes', lv: 1,
    q: '你在潮濕牌面拿到強牌，卻每條街都過牌想「設陷阱」，結果對手免費補到更大的牌。這是哪一種錯誤？',
    opts: ['慢打過頭：少贏價值，還給對手免費看牌', '玩太多手牌', '資金管理失控', '溜入'],
    ans: 0,
    exp: '潮濕牌面有很多聽牌，過牌等於讓對手免費追牌，又少贏了他們願意付的價值。強牌在潮濕牌面通常應該直接下注。' },
  { id: 'beginner-mistakes-06', topic: 'beginner-mistakes', lv: 1,
    q: '連輸 3 個買入後，你開始用任何兩張牌加注，想「趕快贏回來」。最好的修正是？',
    opts: ['達到停損線就離桌休息，之後再覆盤', '升級到更大的級別一次贏回來', '繼續打到回本為止', '改成每手都全下'],
    ans: 0,
    exp: '這是典型的 Tilt。情緒上頭時決策品質會崩壞，最有效的方法是事先設停損線、到了就離桌；升級或硬打只會把小輸變大輸。' },
  { id: 'beginner-mistakes-07', topic: 'beginner-mistakes', lv: 2,
    q: '轉牌底池 20bb，對手下注 20bb，你只有同花聽牌（河牌補中約 19.6%）。不考慮之後的下注，每次跟注的期望值大約是？',
    opts: ['約虧 8bb', '約賺 8bb', '不賺不賠', '約虧 20bb'],
    ans: 0,
    exp: '補中時贏底池 20 + 對手下注 20 = 40bb，沒中輸掉跟注的 20bb：EV ≈ 19.6% × 40 − 80.4% × 20 ≈ −8.3bb，所以這種價格追聽牌長期是虧錢的。' }
);

// ===========================================================================
// 9. etiquette — 牌桌禮儀：現場與線上規則
// ===========================================================================
GTO.THEORY.push({
  id: 'etiquette',
  stage: 'beginner',
  part: '〇、新手村',
  title: '牌桌禮儀：現場與線上規則',
  icon: '🤝',
  level: 1,
  minutes: 8,
  tldr: '輪到你才行動、口頭宣告算數、籌碼一次推完、保護手牌、不慢亮牌、進行中不討論；線上嚴禁共謀與即時輔助工具（RTA）。',
  plain: '牌桌禮儀就像球場上的運動家精神：規則告訴你什麼會被吹犯規，禮儀告訴你怎樣大家才玩得開心。很多「禮儀」其實就是正式規則，不遵守可能讓你的下注被判無效，甚至被請出牌室。',
  summary: '現場規矩：依序行動、口頭宣告、string bet、one-chip rule、保護手牌、不 slow roll、不討論進行中的牌；線上的時間銀行、禁止共謀與 RTA；以及 rake、straddle、run it twice 等牌室用語。',
  keyPoints: [
    '輪到你才行動（Act in Turn）；口頭宣告具約束力，說了「跟注」就是跟注。',
    '籌碼要一次推出或先口頭說清楚金額，否則可能被判 string bet；面對下注只丟一枚大籌碼又沒出聲＝跟注。',
    '贏了就爽快亮牌，不要 slow roll；棄牌後也不要評論還在進行的牌局。',
    '線上撲克嚴禁共謀（Collusion）與即時輔助工具（RTA），違規通常會被封號並沒收資金。',
    '撲克是需要動腦的娛樂：遵守當地法律，只用輸得起的閒錢。'
  ],
  html: `
<h3>1. 行動規矩：依序行動、口頭宣告、一次推籌碼</h3>
<div class="callout plain"><b>白話解釋</b>依序行動就像排隊點餐：還沒輪到你就先大喊「我不吃了」，前面的人可能因此改變點法。牌桌上也一樣，你提前說「棄牌」，等於免費告訴前面的玩家：後面少了一個對手，他就能更放心地詐唬。</div>
<ul>
<li><strong>輪到你才行動（Act in Turn）：</strong>提前棄牌、提前下注都會影響別人的決策；很多牌室規定，提前做出的動作在輪到你時仍具約束力。</li>
<li><strong>口頭宣告有效：</strong>輪到你時說出「跟注」「加注到 30」，就必須照做，以口頭為準。</li>
<li><strong>String Bet：</strong>沒先宣告就分次推籌碼（先推一些、回頭再拿），只算第一次推出的量。</li>
<li><strong>One-Chip Rule（單一籌碼規則）：</strong>面對下注時，只丟出一枚大面額籌碼又沒出聲，一律視為跟注；想加注要在籌碼落桌前先說「加注」。</li>
</ul>
<table class="tbl"><thead><tr><th>你做的動作</th><th>通常的判定</th></tr></thead><tbody>
<tr><td>先說「加注到 600」，再推出籌碼</td><td>加注到 600 ✅</td></tr>
<tr><td>面對 200 的下注，默默丟出一枚 1,000</td><td>只算跟注 200，荷官找你 800</td></tr>
<tr><td>沒人下注時，先推 300、停頓、再回頭補 300（沒宣告）</td><td>String bet，只算下注 300</td></tr>
<tr><td>面對 200 的下注，說「跟注」卻推出 600</td><td>以口頭為準，算跟注 200</td></tr>
</tbody></table>

<h3>2. 保護手牌與攤牌禮儀</h3>
<ul>
<li><strong>保護手牌：</strong>拿到底牌後，用一枚籌碼或護牌小物壓在牌上。沒保護的牌如果被荷官誤收、或被別人丟的牌碰到，可能被判死牌，而且很難申訴。</li>
<li><strong>不要 Slow Roll：</strong>明明贏了卻故意拖延亮牌、假裝輸，是牌桌上最失禮的行為之一。被跟注又確定自己贏，就立刻亮牌。</li>
<li><strong>Show One, Show All：</strong>你把底牌亮給一個人看，全桌都有權要求看。不想洩漏資訊，就誰都不給看。</li>
<li><strong>先亮牌、再收牌：</strong>攤牌時把兩張牌翻開放在桌上，讓荷官判讀（牌面說話），不要自己判斷輸了就把牌丟進廢牌堆。</li>
</ul>
<div class="callout example"><b>例題：這樣算跟注還是加注？</b>對手下注 200，你沒有出聲，只丟出一枚 1,000 的籌碼。依 one-chip rule，這是<strong>跟注 200</strong>，荷官會找你 800。如果你其實想加注，必須在籌碼落桌前先說「加注」，最好連金額一起說清楚。</div>

<h3>3. 牌局進行中：不討論、不指導、尊重每個人</h3>
<ul>
<li><strong>一手牌只有一位玩家（One Player to a Hand）：</strong>不能給還在局的人建議，旁觀者也不行。</li>
<li><strong>棄牌了也別說話：</strong>「我剛棄了一張 K」「這裡有同花喔」都會洩漏資訊、影響還在局的人。等這手牌完全結束再聊。</li>
<li><strong>不要嘲笑或教訓別人：</strong>批評別人打得爛，只會讓他變小心或乾脆離開，也破壞牌桌氣氛。</li>
<li><strong>小費文化：</strong>在美國等地的賭場，贏下底池後給荷官一點小費（常見 1–5 美元）是慣例；台灣與亞洲各牌室的習慣不同，依現場規定與慣例即可。</li>
<li><strong>節奏：</strong>輪到你時盡量在合理時間內決定，遇到真正困難的牌再多想，不要每一手都拖。</li>
</ul>
<div class="callout warn"><b>這些行為會惹人厭，甚至被處罰</b>① Slow roll；② 棄牌後評論還在進行的牌；③ 還沒輪到就行動；④ 對荷官或輸家發脾氣；⑤ 故意拖時間。情節嚴重時，現場主管（Floor）可以警告、罰停打，甚至請你離開。</div>

<h3>4. 線上撲克：時間銀行、自動行動、禁止共謀與 RTA</h3>
<table class="tbl"><thead><tr><th>項目</th><th>說明</th></tr></thead><tbody>
<tr><td>時間銀行（Time Bank）</td><td>正常思考時間用完後的「額外時間」，用掉後通常要一段時間才會補充；留給真正困難的決定。</td></tr>
<tr><td>自動行動按鈕</td><td>「過牌／棄牌」「跟任何注」等預選按鈕能加快速度，但習慣性使用會洩漏你的節奏（秒棄、秒跟）。</td></tr>
<tr><td>離座（Sit Out）</td><td>要離開電腦就按離座，不要讓系統一直替你超時棄牌、拖慢牌局。</td></tr>
<tr><td>禁止共謀（Collusion）</td><td>和朋友在同一桌互通底牌、刻意不互相下注（軟打）、轉移籌碼，都屬於作弊。</td></tr>
<tr><td>禁止即時輔助（RTA）</td><td>打牌時開著 Solver、範圍表、計算機或任何即時給建議的工具查詢，就是即時輔助（Real-Time Assistance），各大平台都嚴格禁止。</td></tr>
</tbody></table>
<p>平台會用行為分析與軟體偵測抓違規，被抓到通常是<strong>永久封號並沒收帳戶資金</strong>（常會退還給受害玩家）。部分平台連 HUD 等第三方輔助軟體也禁止，上桌前請先讀清楚該平台的軟體政策。</p>
<div class="callout tip"><b>實戰小技巧</b>本站的範圍表、計算機與練習，請在<strong>牌局外</strong>使用：打牌前複習、打完後覆盤。牌局進行中開著它查表，就屬於 RTA。</div>

<h3>5. 第一次去牌室與常用術語</h3>
<p>第一次去現場牌室，流程通常是：</p>
<ol class="steps">
<li><b>登記候補</b>到櫃台或請現場人員把名字登記在想玩級別的候補名單（Waiting List）。</li>
<li><b>入座買入</b>輪到你時換籌碼入座，買入金額要在該桌的最低與最高限制之間。</li>
<li><b>等大盲或補盲</b>新入座的玩家通常要等輪到大盲，或直接補放一個大盲（Post），才開始拿牌；細節依各牌室規定。</li>
</ol>
<table class="tbl"><thead><tr><th>術語</th><th>意思</th></tr></thead><tbody>
<tr><td>買入（Buy-in）</td><td>上桌時兌換籌碼的金額。現金桌通常有最低與最高買入，例如 40–100bb；本站以 100bb 為基準。</td></tr>
<tr><td>抽水（<a href="#/wiki/glossary/rake">Rake</a>）</td><td>牌室從底池收取的服務費，常見約 5% 並設有上限；很多牌室「沒翻牌不抽水」（No Flop, No Drop）。</td></tr>
<tr><td><a href="#/wiki/glossary/straddle">Straddle</a></td><td>UTG 在看牌前自願下 2 倍大盲的「第三個盲注」，翻前因此取得最後行動權；現金桌常見，錦標賽通常不允許。</td></tr>
<tr><td><a href="#/wiki/glossary/run-it-twice">Run It Twice</a></td><td>全下後剩下的公共牌發兩次，每次各決定一半底池，用來降低運氣波動；需雙方同意且牌室允許。</td></tr>
<tr><td>Muck</td><td>廢牌堆；也指把牌蓋著丟掉、不亮給別人看。</td></tr>
<tr><td>Table Stakes</td><td>一手牌只能用開始時桌上的籌碼下注，不能中途從口袋加錢。</td></tr>
<tr><td>Floor</td><td>現場主管。遇到爭議時請荷官叫 Floor 裁決，不要和其他玩家爭吵。</td></tr>
</tbody></table>

<h3>6. 理性娛樂與下一步</h3>
<div class="callout key"><b>重點</b>各國與各地對撲克與博弈的法律規範不同，請遵守當地法律，只在合法場所或合規平台遊玩，未成年請勿參與。把撲克當成需要動腦的娛樂與學習：事先設定預算與時間上限，只用輸光也不影響生活的閒錢。本站所有練習都以 bb 計算，不涉及任何金錢。</div>
<p><strong>下一步：</strong>新手村到這裡就完成了！接著進入基礎篇第一課 <a href="#/learn/outs-odds">Outs 與聽牌機率：二四法則完整教學</a>。想熟悉更多名詞，可以到 <a href="#/quiz/terms">術語練習</a> 或查 <a href="#/wiki/glossary">術語百科</a>。</p>
`,
  sources: [
    { title: 'PokerSkill — Poker Etiquette', url: 'https://www.pokerskill.com/blog/poker-etiquette/' },
    { title: 'The Poker Bank — Live Poker Etiquette', url: 'https://www.thepokerbank.com/articles/etiquette/live/' },
    { title: 'Natural8 — 什麼是撲克中的 Slow Roll', url: 'https://www.natural8.com/zh-TW/blog/slow-roll-in-poker' },
    { title: 'PokerCoaching — Real-Time Assistance in Poker', url: 'https://pokercoaching.com/blog/real-time-assistance-in-poker-is-it-an-imminent-threat/' },
    { title: 'Wikipedia — Glossary of poker terms', url: 'https://en.wikipedia.org/wiki/Glossary_of_poker_terms' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'etiquette-01', topic: 'etiquette', lv: 1,
    q: '對手下注 200，你沒有出聲，只丟出一枚 1,000 的籌碼。通常會被判為？',
    opts: ['跟注 200（One-Chip Rule）', '加注到 1,000', '加注到 400', '下注無效，需重來'],
    ans: 0,
    exp: '面對下注時，只丟出一枚大面額籌碼又沒有口頭宣告，一律視為跟注，荷官會找零。想加注必須在籌碼落桌前先說「加注」。' },
  { id: 'etiquette-02', topic: 'etiquette', lv: 1,
    q: '什麼是 Slow Roll？',
    opts: ['明明贏了卻故意拖延亮牌、假裝輸，讓對手難堪', '遇到困難決定時想比較久', '把籌碼慢慢推進底池', '翻牌前拖很久才加注'],
    ans: 0,
    exp: 'Slow roll 是確定自己贏了還故意拖延亮牌，是牌桌上最失禮的行為之一。被跟注又確定贏時，應該立刻亮牌。單純思考比較久不算 slow roll。' },
  { id: 'etiquette-03', topic: 'etiquette', lv: 1,
    q: '你已經棄牌，看到另外兩人還在纏鬥，你隨口說「我剛棄了一張 K」。為什麼不行？',
    opts: ['會洩漏資訊、影響還在局玩家的決策，違反「一手牌只有一位玩家」的原則', '因為棄牌後必須離開座位', '因為 K 是大牌，不能提到', '其實可以，棄牌後說什麼都沒關係'],
    ans: 0,
    exp: '你棄掉的牌會改變還在局玩家對 outs 與對手範圍的判斷。牌局進行中不能討論，等這手牌完全結束再聊。' },
  { id: 'etiquette-04', topic: 'etiquette', lv: 1,
    q: '線上撲克中，下列哪一項會被平台視為嚴重違規？',
    opts: ['打牌時開著 Solver 或範圍表即時查詢（RTA）', '用時間銀行思考困難的決定', '牌局結束後用軟體覆盤', '設定自動補盲注'],
    ans: 0,
    exp: '牌局進行中使用任何即時給建議的工具都屬於即時輔助（RTA），被抓到通常會封號並沒收資金。時間銀行、自動補盲是平台內建功能；賽後覆盤是正常學習。' },
  { id: 'etiquette-05', topic: 'etiquette', lv: 1,
    q: '「Straddle」是什麼？',
    opts: ['UTG 在看牌前自願下 2 倍大盲的盲注，翻前取得最後行動權', '河牌下超過底池的大注', '兩位玩家平分底池', '全下後把公共牌發兩次'],
    ans: 0,
    exp: 'Straddle 是自願的第三個盲注，通常由 UTG 下 2 倍大盲，翻前因此最後行動。把公共牌發兩次是 Run It Twice。' },
  { id: 'etiquette-06', topic: 'etiquette', lv: 1,
    q: '一手牌結束後，你只把底牌亮給隔壁的朋友看，另一位玩家要求也要看。依「Show One, Show All」慣例會怎樣？',
    opts: ['全桌都有權看你的牌', '只有朋友可以看', '你可以拒絕任何人', '荷官會沒收你贏的底池'],
    ans: 0,
    exp: '亮給一個人看，就等於要讓全桌都能看，這樣資訊才公平。不想洩漏資訊，就誰都不要給看。' },
  { id: 'etiquette-07', topic: 'etiquette', lv: 1,
    q: '全下後雙方同意「Run It Twice」，代表什麼？',
    opts: ['剩下的公共牌發兩次，每次各決定一半底池', '重新發一次底牌', '兩人都可以再加注一次', '底池金額加倍'],
    ans: 0,
    exp: 'Run It Twice 是把剩下的公共牌發兩次，每一次各決定一半底池，期望值不變，但能降低運氣波動；需雙方同意且牌室允許。' }
);

// ===========================================================================
// 10. outs-odds — Outs 與聽牌機率：二四法則完整教學（基礎篇）
// ===========================================================================
GTO.THEORY.push({
  id: 'outs-odds',
  stage: 'basics',
  part: '一、基礎篇',
  title: 'Outs 與聽牌機率：二四法則完整教學',
  icon: '🎯',
  level: 2,
  minutes: 10,
  tldr: '數出讓你變最大的 outs：看兩張用 outs × 4、看一張用 outs × 2，再和必要勝率比較，夠就跟、不夠就棄。',
  plain: 'Outs 就像抽獎箱裡的「中獎籤」：翻牌後箱子裡還有 47 張沒看過的牌，轉牌後剩 46 張，你的中獎籤越多越值得抽。底池賠率則是這次抽獎的「票價」，中獎機率要高過票價比例才划算。',
  summary: '從零學會數 outs（乾淨與髒 outs、扣除重複），背熟常見聽牌 outs 表，用二四法則與修正公式心算勝率並對照精確機率，再把勝率和底池賠率比較決定跟注或棄牌，最後認識隱含賠率與反向隱含賠率。',
  keyPoints: [
    'Outs＝還沒出現、出現後能讓你變成（很可能）最強的牌；翻牌後未知牌 47 張，轉牌後 46 張。',
    '二四法則：翻牌→河牌 ≈ outs × 4（outs > 8 時用 outs × 4 − (outs − 8)）；轉牌→河牌 ≈ outs × 2。',
    '常見 outs：同花聽 9（翻牌→河牌約 35%）、兩頭順 8（約 31.5%）、卡順 4（約 16.5%）、同花聽＋兩頭順 15（約 54%）。',
    '必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）；你的勝率高於它才跟注。',
    '隱含賠率：中了之後還能多贏的錢；反向隱含賠率：中了卻仍然輸、反而輸更多的風險。'
  ],
  html: `
<h3>1. 什麼是 Outs？怎麼數？</h3>
<div class="callout plain"><b>白話解釋</b>數 outs 就像找鑰匙：抽屜裡還有 47 把沒試過的鑰匙（沒看過的牌），其中幾把能打開寶箱（讓你變成最大）？能開的鑰匙越多，越值得花錢再抽一次。但要小心，有些鑰匙打開你的寶箱時，也順便幫對手打開了更大的寶箱——這就是「髒 outs」。</div>
<p><strong>Outs</strong> 是牌堆裡「還沒出現、一出現就能讓你變成（很可能）最強」的牌。翻牌後你看過 5 張牌（2 張底牌 + 3 張公共牌），還有 <strong>47 張</strong>未知；轉牌後看過 6 張，剩 <strong>46 張</strong>。對手的底牌你看不到，所以也算在未知牌裡。</p>
<ol class="steps">
<li><b>先想清楚「變成什麼才會贏」</b>例如你聽同花，目標是同花；你有兩張高牌，目標可能是配成頂對。</li>
<li><b>數出能達成目標的牌</b>你拿 <span class="cards">AhJh</span>，翻牌 <span class="cards">Kh7h2c</span>：紅心共 13 張，已經看到 4 張，剩 <strong>9 張</strong>。</li>
<li><b>扣掉重複</b>同一張牌同時完成兩種聽牌，只能算一次，例如同花聽 + 兩頭順是 9 + 8 − 2 = 15 張。</li>
<li><b>扣掉髒 outs</b>會讓你成牌、卻同時讓對手變得更大的牌，要打折或乾脆不算。</li>
</ol>
<div class="callout example"><b>例題：乾淨 vs 髒 outs</b>你拿 <span class="cards">JcTc</span>，翻牌 <span class="cards">Qh9h2d</span>，K 或 8 都能讓你成順子，看起來有 8 張 outs。但 <span class="cards">Kh</span> 和 <span class="cards">8h</span> 會讓牌面出現第 3 張紅心，對手若拿紅心聽牌就變成同花。保守一點把這 2 張扣掉，<strong>乾淨 outs 約 6 張</strong>。</div>

<h3>2. 常見聽牌 outs 速查表</h3>
<table class="tbl"><thead><tr><th>聽牌</th><th>例子（手牌 / 牌面）</th><th>outs</th><th>翻牌→轉牌</th><th>轉牌→河牌</th><th>翻牌→河牌（兩張）</th></tr></thead><tbody>
<tr><td>後門同花聽（Backdoor）</td><td><span class="cards">AsKs</span> / <span class="cards">Qs7d2c</span></td><td>約 1</td><td>—</td><td>—</td><td>4.2%</td></tr>
<tr><td>口袋對子中 Set</td><td><span class="cards">8s8h</span> / <span class="cards">Kd7c2s</span></td><td>2</td><td>4.3%</td><td>4.3%</td><td>8.4%</td></tr>
<tr><td>卡順</td><td><span class="cards">9s8s</span> / <span class="cards">Jd7c2h</span></td><td>4</td><td>8.5%</td><td>8.7%</td><td>16.5%</td></tr>
<tr><td>兩張高牌配對</td><td><span class="cards">AcKd</span> / <span class="cards">9h7s2c</span></td><td>6</td><td>12.8%</td><td>13.0%</td><td>24.1%</td></tr>
<tr><td>兩頭順 / 雙卡順</td><td><span class="cards">9s8s</span> / <span class="cards">Td7c2h</span></td><td>8</td><td>17.0%</td><td>17.4%</td><td>31.5%</td></tr>
<tr><td>同花聽</td><td><span class="cards">AhJh</span> / <span class="cards">Kh7h2c</span></td><td>9</td><td>19.1%</td><td>19.6%</td><td>35.0%</td></tr>
<tr><td>同花聽 + 卡順</td><td><span class="cards">AhQh</span> / <span class="cards">JhTh3c</span></td><td>12</td><td>25.5%</td><td>26.1%</td><td>45.0%</td></tr>
<tr><td>同花聽 + 兩頭順</td><td><span class="cards">JsTs</span> / <span class="cards">9s8s2c</span></td><td>15</td><td>31.9%</td><td>32.6%</td><td>54.1%</td></tr>
</tbody></table>
<p>精確公式：轉牌中 = outs ÷ 47；從轉牌到河牌 = outs ÷ 46；翻牌到河牌至少中一張 = 1 −（47 − outs）÷ 47 ×（46 − outs）÷ 46。後門同花聽要轉牌、河牌連續來同花（10 ÷ 47 × 9 ÷ 46 ≈ 4.2%），價值大約只等於 1 張 out，常當成「加分項」而不是跟注的主要理由。下面的互動表格可以自己點選 outs 對照：</p>
<div class="widget" data-widget="outs-table"></div>
<div class="widget" data-widget="draw-outs-examples"></div>

<h3>3. 二四法則與修正公式</h3>
<div class="formula">翻牌→河牌（看兩張）≈ outs × 4；outs &gt; 8 時改用 outs × 4 − (outs − 8)<br>轉牌→河牌（看一張）≈ outs × 2</div>
<table class="tbl"><thead><tr><th>outs</th><th>× 4</th><th>修正後</th><th>精確值</th><th>× 2（轉牌）</th><th>精確值</th></tr></thead><tbody>
<tr><td>4</td><td>16%</td><td>16%</td><td>16.5%</td><td>8%</td><td>8.7%</td></tr>
<tr><td>8</td><td>32%</td><td>32%</td><td>31.5%</td><td>16%</td><td>17.4%</td></tr>
<tr><td>9</td><td>36%</td><td>35%</td><td>35.0%</td><td>18%</td><td>19.6%</td></tr>
<tr><td>12</td><td>48%</td><td>44%</td><td>45.0%</td><td>24%</td><td>26.1%</td></tr>
<tr><td>15</td><td>60%</td><td>53%</td><td>54.1%</td><td>30%</td><td>32.6%</td></tr>
</tbody></table>
<div class="callout warn"><b>最常見的誤用</b>「× 4」假設你<strong>一定能看到轉牌和河牌兩張</strong>，只有在對手已經全下、或確定不會再面對下注時才成立。如果對手翻牌下注、轉牌還會再下注，就要一條街一條街算：翻牌這一注只能用「看一張」的機率（約 outs × 2，精確是 outs ÷ 47）來比較。</div>
<div class="callout pro"><b>進階補充</b>為什麼 outs 多時「× 4」會高估？因為「轉牌中」和「河牌中」有重疊：轉牌已經中了，河牌再中一次並不會讓你贏兩次。outs 越多，重疊越多，所以要再減掉 (outs − 8)。</div>

<h3>4. 跟不跟？拿 outs 對照底池賠率</h3>
<div class="formula">必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）</div>
<table class="tbl"><thead><tr><th>情境</th><th>你的勝率</th><th>必要勝率</th><th>結論</th></tr></thead><tbody>
<tr><td>轉牌底池 20bb，對手下注 10bb，同花聽 9 outs</td><td>19.6%</td><td>10 ÷ 40 = 25%</td><td>❌ 單看賠率要棄牌</td></tr>
<tr><td>轉牌底池 20bb，對手下注 5bb，兩頭順 8 outs</td><td>17.4%</td><td>5 ÷ 30 ≈ 16.7%</td><td>✅ 剛好夠，跟注</td></tr>
<tr><td>翻牌底池 10bb，對手全下 10bb，組合聽牌 15 outs</td><td>54.1%（看兩張）</td><td>10 ÷ 30 ≈ 33.3%</td><td>✅ 輕鬆跟注</td></tr>
</tbody></table>
<p>自己動手算算看：</p>
<div class="widget" data-widget="pot-odds-mini"></div>
<div class="hh">
<div class="hh-title">牌例：BTN 拿堅果同花聽牌</div>
<div class="hh-row"><span class="hh-street">翻前</span>CO 開池 2.5bb，你在 BTN 拿 <span class="cards">AhTh</span> 跟注，盲注棄牌。底池 6.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Kh8h3c</span>：你有堅果同花聽牌（9 outs）。CO 下注 2bb，必要勝率 = 2 ÷ (6.5 + 2 + 2) ≈ 19.0%，轉牌就中的機率 9 ÷ 47 ≈ 19.1%，夠了，跟注。底池 10.5bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2s</span>：沒中。CO 下注 7bb，必要勝率 = 7 ÷ (10.5 + 7 + 7) ≈ 28.6%，河牌中的機率只有 9 ÷ 46 ≈ 19.6%——直接賠率不夠。</div>
<div class="hh-row"><span class="hh-street">判斷</span>但 CO 後面還有約 88bb，而你中了就是堅果、而且很隱蔽。只要河牌中了平均能再多贏約 11bb 以上，跟注就划算（見下一節）。你跟注，底池 24.5bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">9h</span>：中了堅果同花！CO 過牌，你下注 18bb，CO 拿 <span class="cards">KsQd</span> 跟注。你贏下 60.5bb 的底池。</div>
<div class="hh-row result"><span class="hh-street">重點</span>轉牌的跟注靠的是「隱含賠率」：河牌多贏的 18bb 超過了需要的約 11bb。如果對手很緊、你中了他也不會付錢，轉牌就應該棄牌。</div>
</div>

<h3>5. 隱含賠率與反向隱含賠率</h3>
<p><strong>隱含賠率（<a href="#/wiki/glossary/implied-odds">Implied Odds</a>）</strong>：把「中了以後還能多贏的錢」也算進來。直接賠率不夠時，可以估算中牌後至少要再多贏多少：</p>
<div class="formula">中牌後至少要再多贏 ≈ 跟注額 ÷ 你的勝率 −（原底池 + 對手下注 + 跟注額）</div>
<p>以上面的牌例計算：7 ÷ 19.6% − 24.5 ≈ 35.8 − 24.5 ≈ <strong>11.3bb</strong>。</p>
<p><strong>反向隱含賠率（<a href="#/wiki/glossary/reverse-implied-odds">Reverse Implied Odds</a>）</strong>正好相反：你「中了」卻還是輸，而且因為以為自己贏了，反而輸得更多。</p>
<div class="compare"><div><h4>隱含賠率高 👍</h4>堅果聽牌（A 高同花聽）、隱蔽的牌（口袋對子中 Set）、對手籌碼深而且愛跟注。</div><div><h4>反向隱含賠率高 👎</h4>小同花聽牌（例如 <span class="cards">6h5h</span> 在 <span class="cards">KhQh2c</span>，中了也常輸給更大的同花）、順子的小頭、弱踢腳的頂對。</div></div>
<div class="callout tip"><b>實戰小技巧</b>聽牌時先問兩個問題：「我中了會是堅果嗎？」「對手還有多少籌碼可以付我？」兩個答案都是「是」與「很多」，才值得用隱含賠率說服自己跟注；否則就老實照必要勝率決定。</div>

<h3>6. 下一步</h3>
<p><strong>下一步：</strong>到 <a href="#/quiz/outs">數 Outs 練習</a> 把數 outs 練成直覺，再用 <a href="#/quiz/math">撲克數學練習</a> 熟悉必要勝率；接著讀 <a href="#/learn/poker-math">底池賠率、勝率與期望值（EV）</a>，把 outs、賠率與 EV 串起來。</p>
`,
  sources: [
    { title: 'Thinking Poker — Outs and Odds', url: 'https://thinking.poker/en/learn/outs-and-odds' },
    { title: 'PokerCoaching — Outs in Poker', url: 'https://pokercoaching.com/blog/outs-in-poker/' },
    { title: 'PokerNews — Poker Probabilities', url: 'https://www.pokernews.com/poker-hands/probabilities.htm' },
    { title: 'Upswing Poker — Reverse Implied Odds', url: 'https://upswingpoker.com/reverse-implied-odds/' },
    { title: 'GTO Wizard — Visualizing Implied Odds', url: 'https://blog.gtowizard.com/visualizing-implied-odds/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'outs-odds-01', topic: 'outs-odds', lv: 1,
    q: '你拿 A♥ J♥，翻牌 K♥ 7♥ 2♣。你有幾張同花 outs？',
    opts: ['9 張', '13 張', '11 張', '4 張'],
    ans: 0,
    exp: '紅心共 13 張，你手上 2 張、牌面 2 張，已經看到 4 張，剩下 13 − 4 = 9 張能讓你成同花。' },
  { id: 'outs-odds-02', topic: 'outs-odds', lv: 1,
    q: '翻牌後你有 8 張 outs，對手已經全下（你會看到轉牌和河牌）。用二四法則估計成牌機率約多少？',
    opts: ['32%', '16%', '8%', '64%'],
    ans: 0,
    exp: '看兩張牌用 outs × 4：8 × 4 = 32%，精確值約 31.5%。16% 是只看一張（outs × 2）的估計。' },
  { id: 'outs-odds-03', topic: 'outs-odds', lv: 2,
    q: '翻牌有 15 張 outs，用修正後的四法則 outs × 4 − (outs − 8)，翻牌到河牌約多少？',
    opts: ['53%', '60%', '30%', '45%'],
    ans: 0,
    exp: '15 × 4 − (15 − 8) = 60 − 7 = 53%，很接近精確值 54.1%。直接用 × 4 的 60% 會明顯高估。' },
  { id: 'outs-odds-04', topic: 'outs-odds', lv: 2,
    q: '轉牌底池 20bb，對手下注 10bb，你有同花聽牌（河牌中約 19.6%）。只看底池賠率該怎麼做？',
    opts: ['棄牌：必要勝率 25% 高於 19.6%', '跟注：必要勝率只有 10%', '跟注：同花聽牌一定要追', '加注：必要勝率是 50%'],
    ans: 0,
    exp: '必要勝率 = 10 ÷ (20 + 10 + 10) = 25%，你的勝率約 19.6% 不夠。除非確定中了能多贏不少（隱含賠率），否則應該棄牌。' },
  { id: 'outs-odds-05', topic: 'outs-odds', lv: 2,
    q: '你拿 J♣ T♣，翻牌 Q♥ 9♥ 2♦，你有兩頭順聽牌。為什麼 K♥ 和 8♥ 常被當成「髒 outs」？',
    opts: ['它們讓你成順子，但也可能讓拿紅心聽牌的對手成同花', '它們會讓你變成同花', '它們已經被發出去，是死牌', '它們會讓牌面成對'],
    ans: 0,
    exp: 'K♥、8♥ 會讓牌面出現第 3 張紅心，對手若有兩張紅心就成同花，贏過你的順子。保守做法是把它們扣掉，乾淨 outs 約 6 張。' },
  { id: 'outs-odds-06', topic: 'outs-odds', lv: 3,
    q: '下列哪一種情況的「反向隱含賠率」最高？',
    opts: ['拿 6♥ 5♥ 在 K♥ Q♥ 2♣ 牌面聽小同花', '拿 A♥ T♥ 在 K♥ 8♥ 3♣ 牌面聽堅果同花', '拿 7♠ 7♦ 想在翻牌中 Set', '拿 A♠ K♠ 翻前加注'],
    ans: 0,
    exp: '6 高同花聽牌中了，也常輸給任何更大的紅心同花，而且你會以為自己贏了而投入更多。堅果同花聽與中 Set 都是「中了就很大」，隱含賠率高。' },
  { id: 'outs-odds-07', topic: 'outs-odds', lv: 1,
    q: '翻牌發完、轉牌還沒發時，對你來說有幾張未知的牌？',
    opts: ['47 張', '52 張', '45 張', '50 張'],
    ans: 0,
    exp: '52 張扣掉你的 2 張底牌與 3 張翻牌，共 47 張未知（對手的底牌你看不到，也算在未知牌裡）。所以轉牌中的機率是 outs ÷ 47。' },
  { id: 'outs-odds-08', topic: 'outs-odds', lv: 2,
    q: '翻牌你有同花聽牌（9 outs），對手下注；籌碼還很深，轉牌他很可能會再下注。評估這一次跟注時，該拿哪個勝率和必要勝率比較？',
    opts: ['約 19%（只看轉牌一張：9 ÷ 47）', '約 35%（看兩張：9 × 4 − 1）', '約 50%（中或不中各一半）', '約 9%（outs 數直接當百分比）'],
    ans: 0,
    exp: '× 4 法則假設你一定能免費看到轉牌與河牌，只適用於對手已全下或之後不會再下注。對手轉牌還會下注時，翻牌這一注只買到「一張牌」，應該用 9 ÷ 47 ≈ 19.1% 比較，不足的部分要靠隱含賠率補。' },
  { id: 'outs-odds-09', topic: 'outs-odds', lv: 3,
    q: '轉牌底池 20bb，對手下注 10bb，你有 9 outs（河牌中約 19.6%），直接賠率不夠。中牌後平均至少要再多贏多少，跟注才不虧？',
    opts: ['約 11bb', '0bb，直接賠率已經夠了', '約 40bb', '約 2bb'],
    ans: 0,
    exp: '中牌後至少要再多贏 ≈ 跟注額 ÷ 勝率 −（原底池 + 對手下注 + 跟注額）= 10 ÷ 0.196 − 40 ≈ 51 − 40 ≈ 11bb。直接賠率需要 25% 勝率，19.6% 不夠，所以不是 0；40bb 是跟注後的底池大小。' }
);

/* GTO 撲克學院 — lessons_core_plus.js：GTO 核心與翻前策略補充 5 課 */
window.GTO = window.GTO || {};
GTO.THEORY = GTO.THEORY || [];
GTO.QUESTIONS = GTO.QUESTIONS || [];

// ===========================================================================
// 1. 棄牌權益與半詐唬（fold-equity）
// ===========================================================================
GTO.THEORY.push({
  id: 'fold-equity',
  stage: 'gto',
  part: '二、GTO 核心觀念',
  title: '棄牌權益與半詐唬',
  icon: '🎯',
  level: 2,
  minutes: 11,
  tldr: '對手棄牌也是你的收入！聽牌下注有「對手現在棄牌」和「被跟注後中牌」兩種贏法，所以半詐唬需要的棄牌率遠低於純詐唬。',
  plain: '下注就像在對手面前喊價：他不敢跟（棄牌），你連牌都不用亮就收下底池。如果你手上還握著一張「可能中獎的彩券」（聽牌），就算他跟了，你還有機會在後面翻盤；純詐唬則只有喊價這一招，被跟就輸。',
  summary: '棄牌權益（Fold Equity）是「對手棄牌」替你賺到的期望值。本課推導純詐唬的損益兩平棄牌率（= Alpha）與半詐唬 EV 公式並用數字驗算，說明半詐唬為何優於純詐唬，以及跟注站、多人底池、低 SPR、強範圍時棄牌權益為何縮水。',
  keyPoints: [
    '棄牌權益 ≈ 對手棄牌率 × 當下底池：底池 10bb、對手棄牌 40%，「對手會棄牌」這件事就值約 4bb。',
    '純詐唬損益兩平棄牌率 = 下注額 ÷（原底池 + 下注額）＝ Alpha；下注 3/4 池需要對手棄牌 42.9%，滿池需要 50%。',
    '半詐唬 EV = 棄牌率 × 底池 +（1 − 棄牌率）×〔勝率 ×（底池 + 2 × 下注額）− 下注額〕；底池 20bb 全下 30bb、勝率 35%，只要 9.1% 棄牌就回本，純詐唬卻要 60%。',
    '聽牌越早用越值錢：同花聽牌在翻牌約 35% 勝率，到轉牌只剩約 20%，需要的棄牌率會大幅上升。',
    '面對跟注站、多人底池、低 SPR 或很強的對手範圍，棄牌權益趨近於零：停掉純詐唬，只用本身勝率夠高的聽牌施壓。'
  ],
  html: `
    <h3>1. 棄牌權益是什麼？</h3>
    <div class="callout plain"><b>白話解釋</b>把同一個情境想成打 10 次：底池 10bb，對手 10 次裡棄牌 4 次，那 4 次你每次都直接收下 10bb。平均下來，每下注一次就先賺到 4bb——這還沒算被跟注的那 6 次。這 4bb 就是棄牌權益。</div>
    <p>精確地說，<strong>棄牌權益（Fold Equity，FE）</strong>是對手因為你的下注或加注而棄牌，替你帶來的期望值（EV）。最常用的估算方式：</p>
    <div class="formula">棄牌權益 ≈ 對手棄牌率 × 當下底池</div>
    <p>例：底池 10bb，你估計對手面對下注會棄牌 40%，棄牌權益約 0.4 × 10 = <strong>4bb</strong>。它只是 EV 的「其中一部分」——對手跟注時的輸贏要另外算。想複習術語可看 <a href="#/wiki/glossary/fold-equity">Fold Equity</a>。</p>
    <p>棄牌權益從哪裡來？三個條件缺一不可：</p>
    <ul>
      <li><strong>對手範圍裡有「可以棄」的牌</strong>：沒中的高張、弱對子、落空的聽牌。</li>
      <li><strong>你的下注尺度夠痛</strong>：同一手牌，面對 1/4 池可能會跟，面對滿池就棄。</li>
      <li><strong>你的故事可信</strong>：你的範圍裡真的有強牌，對手才會怕。</li>
    </ul>

    <h3>2. 純詐唬：對手要棄多少才回本？（= Alpha）</h3>
    <p><strong>純詐唬（Pure Bluff）</strong>是被跟注就幾乎必輸的牌，只有「對手棄牌」一種贏法。設原底池為 P、你的下注為 B：對手棄牌你贏 P；對手跟注你輸 B。令 EV = 棄牌率 × P −（1 − 棄牌率）× B = 0，就得到損益兩平棄牌率——也就是 <a href="#/learn/mdf-alpha">MDF 與 Alpha</a> 那課的 Alpha：</p>
    <div class="formula">純詐唬損益兩平棄牌率（Alpha）= 下注額 ÷（原底池 + 下注額）</div>
    <table class="tbl">
      <thead><tr><th>下注尺度</th><th>純詐唬需要的棄牌率</th><th>白話</th></tr></thead>
      <tbody>
        <tr><td>1/4 池（25%）</td><td>20%</td><td>對手 5 次只要棄 1 次</td></tr>
        <tr><td>1/3 池（33%）</td><td>25%</td><td>4 次棄 1 次</td></tr>
        <tr><td>1/2 池（50%）</td><td>33.3%</td><td>3 次棄 1 次</td></tr>
        <tr><td>2/3 池（66%）</td><td>40%</td><td>5 次棄 2 次</td></tr>
        <tr><td>3/4 池（75%）</td><td>42.9%</td><td>7 次棄 3 次</td></tr>
        <tr><td>滿池（100%）</td><td>50%</td><td>一半以上就賺</td></tr>
        <tr><td>1.5 倍超池（150%）</td><td>60%</td><td>5 次要棄 3 次</td></tr>
      </tbody>
    </table>
    <div class="widget" data-widget="bet-size-table"></div>
    <p>下注越大，詐唬越依賴對手棄牌。純詐唬很「貴」，所以 GTO 只用最適合的牌來詐唬，而且數量受價值注比例限制（見 <a href="#/learn/value-bluff">價值與詐唬比例</a>）。</p>

    <h3>3. 半詐唬 EV 公式：兩種贏法加起來</h3>
    <p><strong>半詐唬（<a href="#/wiki/glossary/semi-bluff">Semi-Bluff</a>）</strong>是用「現在還沒成牌、但有 outs 能變強」的牌下注或加注，例如同花聽牌、兩頭順聽牌。它有兩種贏法：① 對手現在就棄牌；② 對手跟注後，你在轉牌或河牌中牌，贏下更大的底池。</p>
    <div class="formula">半詐唬 EV = 棄牌率 × 底池 +（1 − 棄牌率）×〔勝率 ×（底池 + 2 × 下注額）− 下注額〕</div>
    <p>中括號裡就是「被跟注時」的平均淨值：底池變成「原底池 + 你的下注 + 對手的跟注」，你依勝率分到一部分，再扣掉自己投入的下注額。（公式假設全下、或之後不再有下注，方便估算。）</p>
    <div class="callout example"><b>例題：翻牌同花聽牌全下</b>底池 20bb，對手過牌給你，你後手剩 30bb，拿同花聽牌全下。對手跟注的範圍以頂對以上為主，你的勝率約 35%（9 outs × 4 ≈ 36%，保守取 35%）。
      <ol class="steps">
        <li><b>被跟注時</b>最終底池 = 20 + 30 + 30 = 80bb；你平均分到 35% × 80 = 28bb，扣掉投入的 30bb → 淨值 <strong>−2bb</strong>。</li>
        <li><b>對手棄牌時</b>直接贏下 20bb。</li>
        <li><b>損益兩平棄牌率</b>令 20 × FE − 2 ×（1 − FE）= 0 → FE = 2 ÷ 22 ≈ <strong>9.1%</strong>。</li>
        <li><b>對照純詐唬</b>同樣冒 30bb 搶 20bb，純詐唬需要 30 ÷ 50 = <strong>60%</strong> 棄牌率。</li>
      </ol>
    </div>
    <table class="tbl">
      <thead><tr><th>對手棄牌率</th><th>半詐唬 EV（勝率 35%）</th><th>純詐唬 EV（勝率 0%）</th></tr></thead>
      <tbody>
        <tr><td>0%</td><td>−2.0bb</td><td>−30bb</td></tr>
        <tr><td>10%</td><td>+0.2bb</td><td>−25bb</td></tr>
        <tr><td>20%</td><td>+2.4bb</td><td>−20bb</td></tr>
        <tr><td>30%</td><td>+4.6bb</td><td>−15bb</td></tr>
        <tr><td>40%</td><td>+6.8bb</td><td>−10bb</td></tr>
        <tr><td>50%</td><td>+9.0bb</td><td>−5bb</td></tr>
      </tbody>
    </table>
    <p>同一個全下，聽牌只要對手偶爾棄牌就賺錢；純詐唬要對手棄掉六成以上才不虧。</p>

    <h3>4. 為什麼半詐唬比純詐唬好？</h3>
    <div class="compare">
      <div><h4>✅ 半詐唬（有 outs）</h4><ul><li>兩種贏法：對手棄牌＋自己中牌</li><li>需要的棄牌率低（上例 9.1%）</li><li>中牌時底池已被你做大，賺得更多</li><li>強牌也用同樣方式下注，對手更難讀牌</li></ul></div>
      <div><h4>❌ 純詐唬（沒 outs）</h4><ul><li>只有一種贏法：對手棄牌</li><li>需要的棄牌率高（上例 60%）</li><li>被跟注幾乎全輸</li><li>對手只要不愛棄牌，就是在送錢</li></ul></div>
    </div>
    <p>另一個關鍵：<strong>聽牌越早用越值錢</strong>。同花聽牌在翻牌還有兩張牌可以中（約 35%），到轉牌只剩一張（約 20%）：</p>
    <table class="tbl">
      <thead><tr><th>時機</th><th>情境</th><th>被跟注時淨值</th><th>半詐唬門檻</th><th>純詐唬門檻</th></tr></thead>
      <tbody>
        <tr><td>翻牌全下</td><td>底池 20bb、全下 30bb、勝率 35%</td><td>−2bb</td><td>9.1%</td><td>60%</td></tr>
        <tr><td>轉牌全下</td><td>底池 30bb、全下 30bb、勝率 20%</td><td>−12bb</td><td>28.6%</td><td>50%</td></tr>
      </tbody>
    </table>
    <div class="hh">
      <div class="hh-title">牌例：BB 用同花聽牌過牌加注</div>
      <div class="hh-row"><span class="hh-street">翻前</span>CO 開池 2.5bb，你在 BB 拿 <span class="cards">Th9h</span> 跟注，底池 5.5bb。</div>
      <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Kh7h2c</span>（底池 5.5bb）你過牌，CO 下注 2bb（約 1/3 池），你過牌加注到 8bb。若是純詐唬，你冒 8bb 搶 7.5bb，需要 8 ÷ 15.5 ≈ 51.6% 棄牌率；但你有 9 張紅心 outs，對頂對（如 <span class="cards">KsQd</span>）勝率約 39%。粗估就算 CO 永遠跟注，被跟注時淨值 ≈ 39% × 21.5 − 8 ≈ +0.4bb——每一次棄牌都是額外利潤。</div>
      <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">4d</span>（底池 21.5bb）CO 跟注後來了空白牌，你先行動，再下注 14bb（約 65% 池）。純詐唬需要 39.4% 棄牌率；你仍有 9 ÷ 44 ≈ 20% 勝率（以 CO 拿 K♠ Q♦ 計，扣掉他的 2 張後剩 44 張未知牌；不知道他的牌時用 9 ÷ 46 ≈ 19.6%），粗估只要 CO 棄牌約 15% 就回本。</div>
      <div class="hh-row"><span class="hh-street">結果</span>CO 想了很久後棄掉弱 K，你沒中牌也拿下 21.5bb 底池。</div>
      <div class="hh-row result"><span class="hh-street">重點</span>翻牌加注時主要靠「勝率」撐 EV，轉牌下注時「棄牌權益」的比重變大。若 CO 是死不棄牌的跟注站，轉牌就該過牌，改用便宜看牌實現權益。</div>
    </div>

    <h3>5. 棄牌權益很低的 5 種情況</h3>
    <table class="tbl">
      <thead><tr><th>情況</th><th>為什麼棄牌權益低</th><th>怎麼調整</th></tr></thead>
      <tbody>
        <tr><td><strong>對手是跟注站</strong></td><td>「好奇想看」是本性，實際棄牌率遠低於 Alpha</td><td>停掉純詐唬，改用價值注；聽牌便宜看牌</td></tr>
        <tr><td><strong>多人底池</strong></td><td>每位對手都要棄。假設各自 50% 棄牌：1 人 50%、2 人 25%、3 人 12.5%</td><td>只用強聽牌或成牌下注，見 <a href="#/learn/multiway">多人底池策略</a></td></tr>
        <tr><td><strong>低 SPR／對手已承諾</strong></td><td>例：底池 40bb、對手只剩 10bb，他只需 10 ÷ 60 ≈ 16.7% 勝率就該跟</td><td>把全下當成「比勝率」，見 <a href="#/learn/spr">SPR 課</a></td></tr>
        <tr><td><strong>對手範圍很強</strong></td><td>他剛 3-Bet、4-Bet 或過牌加注，範圍裡「會棄」的牌很少</td><td>降低詐唬頻率，保留高勝率聽牌</td></tr>
        <tr><td><strong>尺度太小或故事不可信</strong></td><td>1/4 池很難逼退有一點勝率的牌；牌面明顯對對手有利時，大注也不可信</td><td>需要棄牌時就下夠大，並挑你範圍佔優的牌面</td></tr>
      </tbody>
    </table>
    <div class="callout warn"><b>常見錯誤</b>「我有聽牌，所以一定要全下！」半詐唬的 EV 來自棄牌＋勝率兩部分；棄牌權益接近 0 時只剩勝率在撐，弱聽牌（卡順、小同花聽牌）直接全下多半是負 EV。對跟注站，最好的打法常是便宜看牌、中牌後大注收錢。</div>

    <h3>6. 實戰檢查清單與下一步</h3>
    <ol class="steps">
      <li><b>估對手會棄什麼</b>他的範圍有多少空氣與弱對子？他是緊手還是跟注站？</li>
      <li><b>算門檻</b>先用 Alpha 算純詐唬門檻；有聽牌就用半詐唬公式把門檻往下修。</li>
      <li><b>和過牌比較</b>真正要比的是「下注 EV」對「過牌 EV」：過牌也能免費看牌、控制底池。</li>
      <li><b>挑尺度</b>想逼對手棄牌就下夠大；想讓弱牌跟注就下小。</li>
    </ol>
    <div class="callout tip"><b>實戰小技巧</b>挑半詐唬的牌時，優先選「勝率高＋有阻擋牌」的聽牌，例如堅果同花聽牌、同花加兩頭順的組合聽牌（Combo Draw）。它們被跟注時常接近五五波，再加上棄牌權益，幾乎怎麼打都賺。</div>
    <div class="callout pro"><b>進階補充</b>GTO Wizard 強調棄牌權益是「相對於你的手牌」：讓對手棄掉一手本來就贏不了你的牌，其實沒賺多少。他們的實驗中（BTN 開池、BB 跟注、翻牌 A22 雙花），<span class="hand">KK</span> 對 BB 會棄的牌勝率約 98%，<span class="hand">33</span> 只有約 76%——所以 33 更有動機下注，把可能反超的高張趕走。換句話說，棄牌的真正價值是對手被迫放棄的那份權益（Equity Denial）。</div>
    <p><strong>下一步：</strong>到 <a href="#/quiz/math">數學練習</a> 熟練 Alpha 與底池賠率；複習 <a href="#/learn/mdf-alpha">MDF 與 Alpha</a>；接著學 <a href="#/learn/blockers">阻擋牌與卡牌移除效應</a>，挑出最適合詐唬的組合；最後用 <a href="#/quiz/theory?topic=fold-equity">本課測驗</a> 檢查自己。</p>
  `,
  sources: [
    { title: 'Upswing Poker — What is Fold Equity and Why is it Important?', url: 'https://upswingpoker.com/fold-equity/' },
    { title: 'GTO Wizard — The Value of Fold Equity (Experiment)', url: 'https://blog.gtowizard.com/the-value-of-fold-equity-experiment/' },
    { title: 'PokerVIP — Expected Value Calculations: Semi-Bluffing', url: 'https://www.pokervip.com/strategy-articles/expected-value-ev-calculations/ev-calculations-part-3-semi-bluffing' },
    { title: 'PokerNews — Semi-Bluff Definition', url: 'https://www.pokernews.com/pokerterms/semi-bluff.htm' },
    { title: 'Deepfold — Multiway Pot Strategy: How to Navigate 3+ Player Pots', url: 'https://deepfold.co/en/blog/multiway-pot-strategy' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'fold-equity-01', topic: 'fold-equity', lv: 1,
    q: '底池 12bb，你估計對手面對你的下注會棄牌 50%。只看「對手棄牌」這部分，你的下注替你帶來多少期望值（棄牌權益）？',
    opts: ['6bb', '12bb', '3bb', '24bb'],
    ans: 0,
    exp: '棄牌權益 ≈ 對手棄牌率 × 當下底池 = 50% × 12 = 6bb。這只是 EV 的一部分，對手跟注時的輸贏要另外計算。12bb 是整個底池，3bb 與 24bb 都是比例乘錯。' },
  { id: 'fold-equity-02', topic: 'fold-equity', lv: 1,
    q: '河牌底池 20bb，你拿完全沒有勝率的空氣牌下注 15bb（75% 池）詐唬。對手至少要棄牌多少，這個詐唬才不虧？',
    opts: ['約 42.9%', '約 30%', '約 57.1%', '75%'],
    ans: 0,
    exp: '純詐唬損益兩平棄牌率 = 下注額 ÷（底池 + 下注額）= 15 ÷ 35 ≈ 42.9%，也就是 Alpha。30% 是對手跟注所需的勝率（15 ÷ 50）；57.1% 是 MDF（防守方至少要繼續的比例）；75% 只是下注佔底池的比例。' },
  { id: 'fold-equity-03', topic: 'fold-equity', lv: 2,
    q: '翻牌底池 20bb，你後手剩 30bb，拿同花聽牌全下；被跟注時勝率約 35%，對手棄牌率 30%。這個半詐唬的 EV 約是多少？',
    opts: ['約 +4.6bb', '約 −2bb', '約 +6bb', '約 −15bb'],
    ans: 0,
    exp: '被跟注時最終底池 80bb，你平均分回 35% × 80 = 28bb，扣掉投入 30bb → −2bb。EV = 0.3 × 20 + 0.7 ×（−2）= 6 − 1.4 = +4.6bb。−2bb 是對手永遠跟注時的 EV；+6bb 只算了棄牌那部分；−15bb 是同條件下純詐唬（勝率 0%）的 EV。' },
  { id: 'fold-equity-04', topic: 'fold-equity', lv: 3,
    q: '轉牌底池 10bb，你全下 10bb 半詐唬，被跟注時勝率 25%（假設全下後直接發完）。對手至少要棄牌多少，這個全下才不虧？',
    opts: ['20%', '50%', '33.3%', '25%'],
    ans: 0,
    exp: '被跟注時最終底池 10 + 10 + 10 = 30bb，你平均分回 25% × 30 = 7.5bb，扣掉 10bb → −2.5bb。令 10 × FE − 2.5 ×（1 − FE）= 0 → FE = 2.5 ÷ 12.5 = 20%。50% 是純詐唬門檻（10 ÷ 20）；33.3% 是對手跟注所需勝率；25% 是你的勝率，不是棄牌率。' },
  { id: 'fold-equity-05', topic: 'fold-equity', lv: 1,
    q: '下列哪一種情況，你下注時的「棄牌權益」最低？',
    opts: ['三人底池、SPR 約 1，兩位對手都是很少棄牌的跟注站', '單挑底池，緊弱型對手在乾燥牌面連續過牌兩次', '單挑底池，你在河牌下注 1.5 倍底池，對手範圍多是落空聽牌', '你在 BTN 開池偷盲，兩個盲注都是棄牌率很高的緊手'],
    ans: 0,
    exp: '跟注站本來就不愛棄牌；多人底池需要每個人都棄牌；SPR 約 1 時對手只要很低勝率就該跟注——三個因素疊加，棄牌權益幾乎為零。其他選項的對手範圍都有大量「會棄」的牌，棄牌權益反而很高。' },
  { id: 'fold-equity-06', topic: 'fold-equity', lv: 2,
    q: '兩位對手面對你的下注，各自有 50% 機率棄牌（假設彼此獨立）。你的下注讓兩人都棄牌、直接拿下底池的機率是多少？',
    opts: ['25%', '50%', '75%', '100%'],
    ans: 0,
    exp: '兩人都要棄牌：50% × 50% = 25%。這就是多人底池詐唬難度暴增的原因——每多一位對手，成功率就再打一次折。50% 是只有一位對手時的機率；75% 是「至少一人棄牌」的機率，並不等於拿下底池。' },
  { id: 'fold-equity-07', topic: 'fold-equity', lv: 2,
    q: '同樣拿同花聽牌全下 30bb：翻牌（底池 20bb、勝率 35%）只需約 9.1% 棄牌率就不虧。到了轉牌（底池 30bb、勝率約 20%），需要多少棄牌率？',
    opts: ['約 28.6%', '約 9.1%', '50%', '約 20%'],
    ans: 0,
    exp: '轉牌被跟注時最終底池 30 + 30 + 30 = 90bb，你平均分回 20% × 90 = 18bb，扣掉 30bb → −12bb。令 30 × FE = 12 ×（1 − FE）→ FE = 12 ÷ 42 ≈ 28.6%。勝率從 35% 掉到 20%，門檻就從 9.1% 升到 28.6%——聽牌越早用越值錢。50% 是純詐唬門檻；20% 是勝率不是棄牌率。' }
);

// ===========================================================================
// 2. 阻擋牌與卡牌移除效應（blockers）
// ===========================================================================
GTO.THEORY.push({
  id: 'blockers',
  stage: 'gto',
  part: '二、GTO 核心觀念',
  title: '阻擋牌與卡牌移除效應',
  icon: '🧱',
  level: 3,
  minutes: 12,
  tldr: '你手上的牌會讓對手少拿到某些組合。好的詐唬要擋住對手的跟注牌、不擋他會棄的牌；但阻擋牌只是挑牌的加分項，不是詐唬的主因。',
  plain: '每種點數只有 4 張，就像抽獎箱裡只放了 4 張「A」籤。你先抽走一張，對手抽到兩張 A（AA）的機會就少了一半——這種「我拿走了，你就比較難拿到」的效果，就是阻擋牌。',
  summary: '阻擋牌（Blocker）與卡牌移除效應會改變對手範圍的組合數。本課教你親手算組合數，理解 4-Bet 詐唬為何偏愛 A5s、河牌詐唬「擋價值、不擋棄牌」的原則、堅果同花阻擋牌與抓詐唬，以及阻擋牌為何只是加分項。',
  keyPoints: [
    '你拿一張 A：對手 AA 從 6 組剩 3 組、AK 從 16 組剩 12 組；「QQ+、AK」這個價值範圍從 34 組降到 27 組（約少 20%）。',
    'A5s / A4s 是經典 4-Bet 詐唬：A 擋住 AA / AK（最不會棄的牌），5 / 4 不擋對手會棄的中段牌，被跟注時對 QQ+ / AK 仍有約 30% 勝率。',
    '河牌詐唬選牌：擋住對手的跟注牌（頂對、堅果），不要擋住他會棄的牌（落空聽牌）。同樣是 QJ，拿 Q♥J♥ 詐唬比拿 Q♠J♠（自己擋掉對手的落空黑桃聽牌）更好。',
    '抓詐唬時，擋住對手的價值牌、不擋他的詐唬牌，會讓跟注 EV 明顯上升；反過來就會變成虧損的跟注。',
    '思考順序：牌力與勝率 → 範圍與頻率（MDF / Alpha）→ 阻擋牌當「同分時的決勝」。'
  ],
  html: `
    <h3>1. 什麼是阻擋牌？</h3>
    <div class="callout plain"><b>白話解釋</b>阻擋牌就像玩「誰是臥底」時的排除法：你知道自己手上有什麼，就能推理出別人「不可能」或「比較不可能」有什麼。例如你握著 A♦，就能百分之百確定對手沒有 A♦ 組成的堅果同花——不用讀心，用排除法就好。</div>
    <p><strong>阻擋牌（<a href="#/wiki/glossary/blocker">Blocker</a>）</strong>是指你手上的牌讓對手某些組合變少；這個現象叫<strong>卡牌移除效應（Card Removal Effect）</strong>。相反地，<strong>反阻擋（Unblocker）</strong>是指你「沒有」拿到某些牌，讓對手那類組合保持完整。</p>
    <p>阻擋牌最常用在三個地方：① 翻前 3-Bet / 4-Bet 詐唬選牌；② 河牌詐唬選牌；③ 河牌抓詐唬時挑選要跟注的牌。若對組合數還不熟，先複習 <a href="#/learn/hands-combos">起手牌與組合數</a>。</p>

    <h3>2. 組合數怎麼被阻擋：自己算一次</h3>
    <ul>
      <li><strong>口袋對子</strong>：4 張選 2 張 = 6 組；你拿走其中一張，剩 3 張選 2 = <strong>3 組</strong>。</li>
      <li><strong>非對子（如 AK）</strong>：4 × 4 = 16 組（4 同花 + 12 非同花）；你拿一張 A，剩 3 × 4 = <strong>12 組</strong>；你同時拿 A 和 K，剩 3 × 3 = <strong>9 組</strong>。</li>
    </ul>
    <table class="tbl">
      <thead><tr><th>對手的牌</th><th>你沒有阻擋牌</th><th>你拿一張 A</th><th>你拿一張 K</th><th>你拿 A + K</th></tr></thead>
      <tbody>
        <tr><td><span class="hand">AA</span></td><td>6</td><td>3</td><td>6</td><td>3</td></tr>
        <tr><td><span class="hand">KK</span></td><td>6</td><td>6</td><td>3</td><td>3</td></tr>
        <tr><td><span class="hand">QQ</span></td><td>6</td><td>6</td><td>6</td><td>6</td></tr>
        <tr><td>AK（同花 + 非同花）</td><td>16</td><td>12</td><td>12</td><td>9</td></tr>
        <tr><td><strong>合計 QQ+、AK</strong></td><td><strong>34</strong></td><td><strong>27</strong></td><td><strong>27</strong></td><td><strong>21</strong></td></tr>
      </tbody>
    </table>
    <p>一張 A 就讓 AA 少一半、讓對手最強的那段範圍少了約 20%。這就是為什麼高張阻擋牌在翻前那麼重要。</p>

    <h3>3. 翻前：為什麼 4-Bet 詐唬愛用 A5s / A4s？</h3>
    <p>看看本站「CO 開池被 BTN 3-Bet」的範圍：價值 4-Bet 是 JJ+、AQs+、AKo，詐唬 4-Bet 則混入 <span class="hand">A5s</span>–<span class="hand">A2s</span>、<span class="hand">KQo</span> 等阻擋牌。</p>
    <div class="embed-chart" data-scenario="vs3bet_co_btn"></div>
    <ol class="steps">
      <li><b>A 是阻擋牌</b>擋住對手最不會棄的 AA 與 AK（AA 6→3、AK 16→12）。</li>
      <li><b>5 是反阻擋</b>它不擋對手會棄的中段牌（如 K9s、QTs、中小對子），讓對手的棄牌範圍保持完整。</li>
      <li><b>被跟注也不是死牌</b>對 QQ+ / AK 約 30% 勝率；對 KK 約 33.6%，甚至略高於 A9s 的約 32.3%，因為可以組成輪子順 A-2-3-4-5。</li>
      <li><b>本來就不適合跟注</b>A9s、ATs 這類有攤牌價值的牌拿來跟注 3-Bet 更好；A5s 跟注打不好、棄掉又可惜，轉成詐唬剛好。</li>
    </ol>
    <table class="tbl">
      <thead><tr><th>CO 的手牌</th><th>對手 QQ+、AK 剩幾組</th><th>對 QQ+、AK 勝率</th><th>本站面對 3-Bet 的打法</th></tr></thead>
      <tbody>
        <tr><td><span class="hand">A5s</span></td><td>27</td><td>約 30%</td><td>4-Bet 或棄牌（混合）</td></tr>
        <tr><td><span class="hand">A9s</span></td><td>27</td><td>約 29%</td><td>跟注</td></tr>
        <tr><td><span class="hand">76s</span></td><td>34（沒擋到）</td><td>約 31%</td><td>跟注或棄牌（混合）</td></tr>
        <tr><td><span class="hand">KQs</span></td><td>24</td><td>約 25%</td><td>4-Bet 或跟注（混合）</td></tr>
      </tbody>
    </table>
    <div class="callout warn"><b>常見錯誤</b>「A5s 是 GTO 詐唬牌，所以每次都 4-Bet！」對手若是極緊的玩家（3-Bet 只有 QQ+ / AK），他幾乎不會棄牌，阻擋牌救不了你；對超緊範圍直接棄牌才是正解。同理，拿到 A♦ 不代表河牌就一定要詐唬，也不代表就該英雄跟注。</div>

    <h3>4. 河牌詐唬選牌：擋價值、不擋棄牌</h3>
    <p>好的詐唬組合要同時做到兩件事：<strong>擋住對手的跟注牌</strong>，並且<strong>不擋住對手的棄牌牌</strong>。來看同一個河牌、兩手點數相同、只有花色不同的詐唬候選：</p>
    <p>牌面 <span class="cards">Ks9s5d2c3h</span>，黑桃同花沒來。你在河牌想用 QJ 詐唬（中間的 T 沒來，順子落空）。對手會跟注的主要是 Kx，會棄的主要是落空的黑桃聽牌與小對子。</p>
    <div class="compare">
      <div><h4>✅ 拿 <span class="cards">QhJh</span> 詐唬</h4><ul><li>Q、J 擋住對手的 KQ、KJ（跟注牌）</li><li>沒有黑桃：對手的落空同花聽牌最多 55 組（11 張黑桃選 2）完整保留</li><li>對手範圍裡「會棄」的牌比較多</li></ul></div>
      <div><h4>❌ 拿 <span class="cards">QsJs</span> 詐唬</h4><ul><li>同樣擋住 KQ、KJ</li><li>但你自己拿走兩張黑桃：對手的落空同花聽牌剩 36 組（9 張選 2），少了約 35%</li><li>你親手拿走了對手「會棄」的牌，他剩下的牌更偏向跟注</li></ul></div>
    </div>
    <div class="callout tip"><b>實戰小技巧</b>河牌想詐唬時，問自己兩個問題：①「我擋住他會跟注的牌了嗎？」②「我有沒有擋到他會棄的牌？」兩題答案是「有、沒有」的組合，就是最好的詐唬候選。</div>

    <h3>5. 堅果同花阻擋牌與抓詐唬</h3>
    <p>當河牌讓同花完成時，手上有該花色的 A 就是<strong>堅果同花阻擋牌</strong>：對手不可能有最大的同花，牌面上所有「兩張該花色」的組合也變少。</p>
    <div class="hh">
      <div class="hh-title">牌例：BTN 拿堅果同花阻擋牌在河牌詐唬</div>
      <div class="hh-row"><span class="hh-street">翻前</span>你在 BTN 拿 <span class="cards">AdTc</span> 開池 2.5bb，BB 跟注，底池 5.5bb。</div>
      <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Qh7d5d</span> BB 過牌，你持續下注 2bb（約 1/3 池），BB 跟注。你有 A 高與後門堅果同花。</div>
      <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2c</span>（底池 9.5bb）BB 過牌，你也過牌。</div>
      <div class="hh-row"><span class="hh-street">河牌</span><span class="cards">Jd</span>（底池 9.5bb）第三張方塊出現，BB 過牌。你的 A 高幾乎贏不了任何對子，你下注 7bb（約 75% 池）詐唬，需要 BB 棄牌 7 ÷ 16.5 ≈ 42.4%。</div>
      <div class="hh-row"><span class="hh-street">阻擋</span>你的 A♦ 讓 BB 不可能有堅果同花，BB 可能的「兩張方塊」組合從 45 組（10 張選 2）降到 36 組（9 張選 2）；T♣ 也不擋 BB 會棄的落空順子聽牌（如 64、86、43）。</div>
      <div class="hh-row result"><span class="hh-street">重點</span>同一個河牌若改拿 <span class="cards">6s4s</span>（落空的兩頭順）也能詐唬，但它擋住了 BB 會棄的 64、63、86、43 類聽牌，效果比 A♦T♣ 差。GTO Gecko 用同一個牌面舉例時，也把 A♦4♠ 這類含 A♦ 的牌列為很好的詐唬候選。</div>
    </div>
    <p><strong>抓詐唬（Bluff Catch）時反過來想</strong>：擋住對手的價值牌、不擋他的詐唬牌。假設河牌底池 10bb、對手下注 10bb（滿池，你需要 33.3% 勝率），他的範圍原本是 20 組價值 + 10 組詐唬：</p>
    <table class="tbl">
      <thead><tr><th>你的手牌擋到什麼</th><th>價值 : 詐唬</th><th>詐唬比例</th><th>跟注 EV</th></tr></thead>
      <tbody>
        <tr><td>什麼都沒擋到</td><td>20 : 10</td><td>33.3%</td><td>0bb（剛好打平）</td></tr>
        <tr><td>擋掉 4 組價值</td><td>16 : 10</td><td>38.5%</td><td>約 +1.5bb</td></tr>
        <tr><td>擋掉 3 組詐唬</td><td>20 : 7</td><td>25.9%</td><td>約 −2.2bb</td></tr>
      </tbody>
    </table>
    <p>跟注 EV = 詐唬比例 ×（底池 + 下注）− 價值比例 × 下注。例如第二列：0.385 × 20 − 0.615 × 10 ≈ +1.5bb。同樣強度的抓詐牌，阻擋效果不同，答案就從「跟」變成「棄」。</p>
    <p>GTO Wizard 有個經典例子：河牌 <span class="cards">Js6h4sTc2c</span> 面對 BB 下注，<span class="cards">Ts9s</span> 是純棄牌，<span class="cards">Th9h</span>、<span class="cards">Td9d</span> 卻都跟注——因為 9♠ 擋掉了 BB 用落空黑桃聽牌（如 K♠9♠、Q♠9♠、9♠8♠）詐唬的組合。</p>

    <h3>6. 阻擋牌只是加分項：正確的思考順序</h3>
    <ol class="steps">
      <li><b>牌力與勝率</b>先看手牌本身：有沒有攤牌價值？被跟注後有沒有 outs？</li>
      <li><b>範圍與頻率</b>用 <a href="#/learn/mdf-alpha">MDF / Alpha</a> 與 <a href="#/learn/value-bluff">價值詐唬比</a> 決定大概要跟多少、詐唬多少。</li>
      <li><b>阻擋牌決勝</b>在牌力相近的候選之間，用阻擋牌決定「誰來詐唬、誰來跟注」。</li>
    </ol>
    <p>一兩張阻擋牌通常只移除對手幾組到十幾組組合，效果是「微調」——GTO Wizard 也提醒，很多情況下阻擋效果小到可以忽略。多人底池更要打折，因為還有其他對手的範圍沒被你擋到。</p>
    <div class="callout pro"><b>進階補充</b>用本站範圍實算：CO 拿 <span class="cards">As5s</span> 4-Bet 時，BTN 3-Bet 範圍裡會 5-Bet 全下的加權組合從約 41 組降到約 33 組（少約 20%），代表你被全下打跑、白白損失 21bb 的次數明顯變少；但 BTN 整體面對 4-Bet 的棄牌率只從約 47.8% 升到約 48.9%，因為 A 也擋掉了 BTN 一些本來會棄牌的 Ax 3-Bet（如 A9s、AJo）。阻擋牌主要是降低最壞情況，而不是讓詐唬憑空變賺。</div>
    <p><strong>下一步：</strong>打開 <a href="#/ranges/vs3bet_co_btn">CO 面對 BTN 3-Bet 範圍表</a> 找出所有阻擋牌詐唬；複習 <a href="#/learn/preflop-4bet">4-Bet 與 5-Bet</a> 和 <a href="#/learn/turn-river">轉牌與河牌策略</a>；搭配 <a href="#/learn/fold-equity">棄牌權益與半詐唬</a> 一起看；最後做 <a href="#/quiz/theory?topic=blockers">本課測驗</a>。</p>
  `,
  sources: [
    { title: 'GTO Wizard — Understanding Blockers in Poker', url: 'https://blog.gtowizard.com/understanding-blockers-in-poker/' },
    { title: 'GTO Wizard — Blockers & Unblockers: The Secret to Picking Great Bluffs', url: 'https://blog.gtowizard.com/blockers-unblockers-the-secret-to-picking-great-bluffs/' },
    { title: 'PokerStrategy — Why A5s is such a powerful bluff', url: 'https://www.pokerstrategy.com/news/content/Why-A5s-is-such-a-powerful-bluff_127539/' },
    { title: 'GTO Gecko — Blockers in Poker: Why They Decide Your Bluffs', url: 'https://gtogecko.com/blog/blockers-unblockers' },
    { title: 'GTO Wizard Glossary — Card Removal', url: 'https://gtowizard.com/en/glossary/card-removal/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'blockers-01', topic: 'blockers', lv: 1,
    q: '你手上拿 A♠ 5♠。對手可能拿到 AA 的組合剩下幾組？',
    opts: ['3 組', '6 組', '1 組', '4 組'],
    ans: 0,
    exp: 'AA 原本是 4 張 A 選 2 張 = 6 組；你拿走一張 A，只剩 3 張 A 選 2 張 = 3 組。1 組是你拿兩張 A（口袋 AA）時對手剩下的組合；4 組是 AKs 這類同花牌的組合數。' },
  { id: 'blockers-02', topic: 'blockers', lv: 2,
    q: '你手上拿 A♥ K♣。對手可能拿到 AK（同花加非同花）的組合剩下幾組？',
    opts: ['9 組', '12 組', '16 組', '6 組'],
    ans: 0,
    exp: 'AK 原本 4 × 4 = 16 組。你拿走一張 A、一張 K，對手只剩 3 張 A × 3 張 K = 9 組。12 組是你只拿一張 A（或一張 K）的情況；16 組是完全沒有阻擋牌。' },
  { id: 'blockers-03', topic: 'blockers', lv: 2,
    q: 'CO 開池、BTN 3-Bet，CO 想選一手牌 4-Bet 詐唬。下列哪一手最符合「擋住強牌、不擋棄牌、被跟注還有勝率」的條件？',
    opts: ['A♠ 5♠', '7♠ 2♦', 'Q♣ J♦', 'A♦ 9♦'],
    ans: 0,
    exp: 'A5s 的 A 擋住 AA、AK，5 不擋對手會棄的中段牌，被跟注時還有同花與輪子順的勝率（對 QQ+ / AK 約 30%），是標準 4-Bet 詐唬。72o 沒有阻擋也沒有勝率；QJo 被對手繼續的範圍嚴重壓制；A9s 有攤牌價值，在本站範圍裡更適合跟注 3-Bet。' },
  { id: 'blockers-04', topic: 'blockers', lv: 2,
    q: '牌面 K♠ 9♠ 5♦ 2♣ 3♥，黑桃同花沒來。你想在河牌用 QJ 詐唬，對手會棄的主要是落空的黑桃聽牌。哪一個組合比較適合詐唬？',
    opts: ['Q♥ J♥：不擋對手的落空黑桃聽牌', 'Q♠ J♠：自己也有兩張黑桃，故事比較完整', '兩者完全一樣，花色不影響', 'Q♠ J♥：只擋一張黑桃最平衡'],
    ans: 0,
    exp: '詐唬要「不擋棄牌」。拿 Q♠ J♠ 等於自己拿走兩張黑桃，對手可能的落空同花聽牌從 55 組（11 張選 2）降到 36 組（9 張選 2），他剩下的範圍更偏向會跟注的牌。Q♥ J♥ 同樣擋住 KQ、KJ，卻完整保留對手的棄牌牌，所以更好。' },
  { id: 'blockers-05', topic: 'blockers', lv: 3,
    q: '河牌底池 10bb，對手下注 10bb。他的範圍原本是 20 組價值、10 組詐唬；你的抓詐牌剛好擋掉他 4 組價值牌。你的跟注 EV 約是多少？',
    opts: ['約 +1.5bb', '0bb', '約 −2.2bb', '約 +5bb'],
    ans: 0,
    exp: '擋掉 4 組價值後剩 16 組價值、10 組詐唬，詐唬比例 = 10 ÷ 26 ≈ 38.5%。跟注 EV = 0.385 ×（10 + 10）− 0.615 × 10 ≈ 7.7 − 6.2 = +1.5bb。0bb 是沒擋到任何牌時（詐唬比例 33.3%）的結果；−2.2bb 是擋到 3 組詐唬牌時的結果。' },
  { id: 'blockers-06', topic: 'blockers', lv: 1,
    q: '關於阻擋牌，下列哪一種說法最正確？',
    opts: ['阻擋牌是挑牌時的加分項：先看牌力與範圍頻率，再用阻擋牌在相近的牌之間做選擇', '只要手上有堅果同花阻擋牌，河牌就一定要詐唬', '阻擋牌在多人底池比單挑底池更重要', '拿到 A 就代表對手一定沒有 AA，可以放心全下'],
    ans: 0,
    exp: '阻擋牌通常只移除對手少量組合，屬於「微調」：先決定牌力、範圍與頻率，再用阻擋牌當決勝。有阻擋牌不等於一定要詐唬；多人底池還有其他對手的範圍沒被擋到，效果更弱；拿一張 A 只是讓 AA 從 6 組剩 3 組，並不是 0 組。' },
  { id: 'blockers-07', topic: 'blockers', lv: 3,
    q: '河牌牌面 J♠ 6♥ 4♠ T♣ 2♣，黑桃同花沒來，BB 下注，你想用一手 T9 抓詐唬。為什麼 T♥ 9♥ 比 T♠ 9♠ 更適合跟注？',
    opts: ['T♠ 9♠ 擋掉了 BB 用落空黑桃聽牌詐唬的組合，T♥ 9♥ 不擋', 'T♥ 9♥ 的牌力比較大', 'T♠ 9♠ 擋住了 BB 的價值牌', '花色不影響，兩手完全一樣'],
    ans: 0,
    exp: '抓詐唬要「擋價值、不擋詐唬」。BB 的詐唬多是落空的黑桃聽牌（如 K♠9♠、Q♠9♠、9♠8♠），你拿 T♠ 9♠ 會讓這些組合變少，對手剩下的範圍更偏價值；T♥ 9♥ 牌力相同，卻保留了對手的詐唬組合，所以更適合跟注。' }
);

// ===========================================================================
// 3. 盲注防守完整指南（blind-defense）
// ===========================================================================
GTO.THEORY.push({
  id: 'blind-defense',
  stage: 'preflop',
  part: '三、翻前策略',
  title: '盲注防守完整指南（SB / BB）',
  icon: '🛡️',
  level: 2,
  minutes: 12,
  tldr: '盲注長期必虧，目標是少輸。BB 有折扣又最後行動，可依底池賠率寬防守；SB 翻後全程沒位置，多用 3-Bet or Fold。',
  plain: '盲注就像每一圈都要先繳的「入場費」：還沒看牌就已經付錢，翻後又幾乎總是第一個行動。所以盲注位置長期一定是負的，你要做的是不讓入場費白白被偷走——該防守的防守，該放棄的放棄。',
  summary: '算出 BB 面對 2bb、2.5bb、3bb 與 SB 3bb 開池的必要勝率，對照本站範圍表看 BB 對各位置的防守寬度；解釋 SB 為何採 3-Bet or Fold、BB 翻後沒位置的打法原則，以及盲注常見漏洞與修正。',
  keyPoints: [
    'BB 面對 2.5bb 開池只需補 1.5bb，跟注後底池 5.5bb，必要勝率 1.5 ÷ 5.5 ≈ 27.3%；面對 2bb 只要 22.2%，面對 3bb 要 30.8%，面對 SB 開 3bb 要 33.3%。',
    '開池位置越後面、範圍越寬，BB 防守越寬：對 UTG 約 21%、對 CO 約 35%、對 BTN 約 52.5%（本站範圍表）。',
    'SB 面對開池採 3-Bet or Fold（對 UTG 約 5%、對 BTN 約 14.5%，尺度 10–10.5bb）：平跟後翻後全程沒位置，還會被 BB 擠壓或拖成多人底池。',
    'BB 翻後原則：先過牌給加注者；低連張牌面多過牌加注，A / K 高的乾燥牌面多過牌跟注或棄牌；面對 1/3 池小注不要自動棄牌。',
    '最大漏洞是 BB 棄太多與 SB 平跟太多；但也別因為「已經投了 1bb」就硬跟——沉沒成本不是理由。'
  ],
  html: `
    <h3>1. 盲注的現實：目標是「少輸」</h3>
    <div class="callout plain"><b>白話解釋</b>盲注防守像商店防竊：後位玩家每次伸手偷走 1.5bb 盲注看起來不多，但一晚被偷幾十次就是大損失。防守的目的不是把小偷變成客人，而是讓他每次伸手都有被抓的風險——他就不敢拿任何牌都來偷。</div>
    <p>BB 每圈強制投入 1bb，是全桌<strong>最貴</strong>的位置；SB 投入 0.5bb，而且翻後對所有人都沒位置（OOP）。就算是頂尖高手，這兩個位置長期也是虧錢的——好的盲注防守不是讓它們變成賺錢，而是把虧損壓到最低。</p>
    <table class="tbl">
      <thead><tr><th>位置</th><th>優勢</th><th>劣勢</th><th>核心策略</th></tr></thead>
      <tbody>
        <tr><td><strong>BB 大盲</strong></td><td>已投 1bb（折扣價）、翻前最後行動、跟注後保證看到翻牌</td><td>翻後對大多數人沒位置</td><td>依底池賠率寬防守＋極化 3-Bet</td></tr>
        <tr><td><strong>SB 小盲</strong></td><td>已投 0.5bb</td><td>翻後對所有人沒位置，後面還有 BB 可以擠壓</td><td>面對開池以 3-Bet or Fold 為主</td></tr>
      </tbody>
    </table>

    <h3>2. BB 的底池賠率：面對不同開池尺度</h3>
    <div class="formula">必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）</div>
    <p>以 BTN 開 2.5bb、SB 棄牌為例：原底池是兩個盲注 1.5bb，對手下注 2.5bb，你要補 1.5bb，所以必要勝率 = 1.5 ÷（1.5 + 2.5 + 1.5）= 1.5 ÷ 5.5 ≈ <strong>27.3%</strong>。</p>
    <table class="tbl">
      <thead><tr><th>開池尺度</th><th>BB 要補</th><th>跟注後底池</th><th>必要勝率</th></tr></thead>
      <tbody>
        <tr><td>2bb（最小加注）</td><td>1bb</td><td>4.5bb</td><td>22.2%</td></tr>
        <tr><td>2.5bb（本站基準）</td><td>1.5bb</td><td>5.5bb</td><td>27.3%</td></tr>
        <tr><td>3bb</td><td>2bb</td><td>6.5bb</td><td>30.8%</td></tr>
        <tr><td>4bb（現場常見）</td><td>3bb</td><td>8.5bb</td><td>35.3%</td></tr>
        <tr><td>SB 開 3bb（盲注對決）</td><td>2bb</td><td>6bb</td><td>33.3%</td></tr>
      </tbody>
    </table>
    <div class="widget" data-widget="pot-odds-mini"></div>
    <p>開池越大，BB 越要收緊。不過必要勝率只是門檻：BB 翻後多半沒位置，<a href="#/learn/equity-realization">權益實現率</a>常低於 100%，所以「勝率剛好過門檻」的非同花垃圾牌仍然要棄。</p>

    <h3>3. BB 對不同位置的防守寬度</h3>
    <p>開池者越靠後、範圍越寬，你的牌相對越強，防守就越寬。以下是本站範圍表的數字：</p>
    <table class="tbl">
      <thead><tr><th>誰開池</th><th>對手開池範圍</th><th>BB 3-Bet</th><th>BB 跟注</th><th>總防守</th></tr></thead>
      <tbody>
        <tr><td>UTG（2.5bb）</td><td>約 17%</td><td>4%</td><td>17%</td><td>約 21%</td></tr>
        <tr><td>HJ（2.5bb）</td><td>約 22%</td><td>5.5%</td><td>21.5%</td><td>約 27%</td></tr>
        <tr><td>CO（2.5bb）</td><td>約 30%</td><td>8%</td><td>27%</td><td>約 35%</td></tr>
        <tr><td>BTN（2.5bb）</td><td>約 45%</td><td>12.5%</td><td>40%</td><td>約 52.5%</td></tr>
        <tr><td>SB（3bb）</td><td>約 43%</td><td>14%（3-Bet 到 9bb）</td><td>40.5%</td><td>約 54.5%</td></tr>
      </tbody>
    </table>
    <div class="embed-chart" data-scenario="vsrfi_bb_utg"></div>
    <div class="embed-chart" data-scenario="vsrfi_bb_btn"></div>
    <div class="embed-chart" data-scenario="vsrfi_bb_sb"></div>
    <ul>
      <li><strong>對 UTG</strong>：範圍很強，3-Bet 偏極化（KK+、AK 加少量 A5s、同花連張）；QQ、JJ、AQs 常平跟，避免把 UTG 的弱牌嚇跑。KTo、QTo、A9o 這類容易被壓制的非同花牌直接棄掉，KJo、QJo 也只是偶爾防守。</li>
      <li><strong>對 BTN</strong>：幾乎所有同花牌、所有非同花 A 都能防守；3-Bet 提高到約 12.5%，價值牌加上同花小 A、同花連張。</li>
      <li><strong>對 SB</strong>：這是 BB 唯一翻後有位置的防守情境，所以就算 SB 開 3bb，BB 仍防守超過一半，3-Bet 也只需 3 倍（9bb）。</li>
    </ul>
    <div class="callout pro"><b>進階補充</b>BTN 開 2.5bb 偷盲，是冒 2.5bb 搶盲注的 1.5bb，要兩個盲注合計棄牌 2.5 ÷ 4 = 62.5% 才能「任意兩張牌都賺」。照本站範圍，SB 約棄 85.5%（3-Bet 約 14.5%）、BB 約棄 47.5%（防守約 52.5%），兩人都棄牌的機率只有約 0.855 × 0.475 ≈ 40.6%——這就是盲注防守的意義：讓偷盲者沒辦法拿任何牌都獲利。</div>

    <h3>4. SB：為什麼多用 3-Bet or Fold</h3>
    <ol class="steps">
      <li><b>翻後全程沒位置</b>SB 平跟後，翻牌、轉牌、河牌都第一個行動，權益實現率最差。</li>
      <li><b>後面還有 BB</b>BB 看到你平跟，可以拿死錢擠壓（Squeeze），或用超好的賠率跟進，變成你沒位置的三人底池。</li>
      <li><b>平跟更貴、又不關門</b>面對 2.5bb，SB 要補 2bb（必要勝率 2 ÷ 6 ≈ 33.3%），BB 只要補 1.5bb 而且保證看到翻牌。</li>
      <li><b>抽水與主動權</b>3-Bet 常在翻前直接收下底池（多數現金桌翻前結束不抽水），被跟注也握有主動權。</li>
    </ol>
    <table class="tbl">
      <thead><tr><th>SB 面對誰開池</th><th>3-Bet 頻率（本站）</th><th>3-Bet 尺度</th></tr></thead>
      <tbody>
        <tr><td>UTG</td><td>約 5%</td><td>10bb</td></tr>
        <tr><td>HJ</td><td>約 6.5%</td><td>10bb</td></tr>
        <tr><td>CO</td><td>約 9.5%</td><td>10.5bb</td></tr>
        <tr><td>BTN</td><td>約 14.5%</td><td>10.5bb</td></tr>
      </tbody>
    </table>
    <div class="embed-chart" data-scenario="vsrfi_sb_btn"></div>
    <div class="callout tip"><b>實戰小技巧</b>SB 對 BTN 的 3-Bet 範圍偏線性：88+、A8s+、A5s–A4s、KTs+、QTs+、JTs、AJo+、KQo 直接 3-Bet，77–55、A7s–A6s、同花連張等再混合加入。很多玩家 SB 對 BTN 的 3-Bet 不到 8%，等於讓 BTN 免費偷盲。</div>

    <h3>5. BB 翻後沒位置怎麼打</h3>
    <ol class="steps">
      <li><b>先過牌給加注者</b>單一加注底池裡，BB 絕大多數時候先過牌，讓開池者決定要不要持續下注。</li>
      <li><b>牌面決定攻守</b>8-5-2、7-6-4 這類低連張牌面，BB 範圍裡兩對、順子、組合聽牌更多，可以多過牌加注；A-K-7、K-8-3 這類高張乾燥牌面，開池者範圍優勢大，以過牌跟注與棄牌為主。</li>
      <li><b>面對小注別自動棄牌</b>1/3 池下注的 MDF 約 75%：後門聽牌、高張加卡順都可以繼續（見 <a href="#/learn/mdf-alpha">MDF</a>）。</li>
      <li><b>中等牌控制底池</b>頂對弱踢腳這類牌，沒位置時多用過牌跟注，不要自己把底池做大。</li>
      <li><b>過牌加注要平衡</b>強牌與強聽牌都要放進加注範圍，只用堅果加注很好讀，只用詐唬加注則一被反加注就垮。</li>
    </ol>
    <div class="hh">
      <div class="hh-title">牌例：BB 用 76s 防守 BTN，在低牌面過牌加注</div>
      <div class="hh-row"><span class="hh-street">翻前</span>BTN 開池 2.5bb，SB 棄牌。你在 BB 拿 <span class="cards">7s6s</span> 補 1.5bb 跟注（必要勝率 27.3%；同花連張容易做成兩對、順子與強聽牌）。</div>
      <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">8s5h2d</span>（底池 5.5bb）你過牌，BTN 下注 1.8bb（約 1/3 池），你過牌加注到 7bb。你有兩頭順聽牌（8 outs）加後門同花，對 BTN 的超對約 37% 勝率、對兩張高張超過 50%，而且低連張牌面本來就是 BB 範圍佔優的地方。</div>
      <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">Kc</span>（底池 19.5bb）BTN 跟注後來了 K，高張通常對翻前加注者的範圍比較有利。你過牌，BTN 也過牌。</div>
      <div class="hh-row"><span class="hh-street">河牌</span><span class="cards">9d</span>（底池 19.5bb）你做成 5-6-7-8-9 順子，下注 13bb（約 2/3 池），BTN 用一對 K 跟注，你贏下 45.5bb 底池。</div>
      <div class="hh-row result"><span class="hh-street">重點</span>① 翻前依底池賠率防守可玩性高的牌；② 在對自己範圍有利的牌面積極過牌加注；③ 遇到對手有利的轉牌就放慢。如果河牌沒中、BTN 下注，7 高沒有攤牌價值就乾脆棄牌——防守不等於死跟到底。</div>
    </div>

    <h3>6. 盲注常見漏洞與修正</h3>
    <table class="tbl">
      <thead><tr><th>漏洞</th><th>症狀</th><th>修正</th></tr></thead>
      <tbody>
        <tr><td><strong>BB 棄太多</strong></td><td>面對 BTN 開池防守不到 40%，K5s、T8s、A4o 都棄掉</td><td>依範圍表防守約一半以上，同花牌幾乎都能跟</td></tr>
        <tr><td><strong>SB 平跟太多</strong></td><td>SB 常平跟 BTN 開池，結果被 BB 擠壓或拖進多人底池</td><td>改成 3-Bet or Fold，對 BTN 約 14.5%</td></tr>
        <tr><td><strong>BB 3-Bet 太少</strong></td><td>只有 QQ+、AK 才 3-Bet，對手很好讀</td><td>對後位開池加入 A5s–A2s、同花連張等極化 3-Bet</td></tr>
        <tr><td><strong>面對前位亂防守</strong></td><td>拿 KTo、QTo、A9o 跟注 UTG</td><td>對 UTG 只防守約 1/5，棄掉容易被壓制的非同花牌</td></tr>
        <tr><td><strong>翻後自動棄牌</strong></td><td>翻牌沒中就過牌棄牌</td><td>面對小注用後門聽牌、卡順繼續；挑有利牌面過牌加注</td></tr>
      </tbody>
    </table>
    <div class="callout warn"><b>常見錯誤</b>「我已經投了 1bb，不跟很可惜」——沉沒成本不是跟注理由，標準永遠是「必要勝率＋權益實現」。反過來也別因為「沒位置好可怕」就幾乎全棄：BB 面對後位小開池時，棄太多才是更常見、更昂貴的漏洞。</div>
    <p><strong>下一步：</strong>打開 <a href="#/ranges/vsrfi_bb_btn">BB 防守 BTN 範圍表</a> 熟悉最常見的防守情境；到 <a href="#/quiz/preflop">翻前範圍練習</a> 實際測驗 BB 與 SB 的決策；延伸閱讀 <a href="#/learn/preflop-vs-open">面對開池：3-Bet 還是跟注</a> 與 <a href="#/learn/squeeze-coldcall">擠壓與冷跟</a>；最後做 <a href="#/quiz/theory?topic=blind-defense">本課測驗</a>。</p>
  `,
  sources: [
    { title: 'Upswing Poker — Lose Less, Win More: The Fundamentals of Big Blind Defense', url: 'https://upswingpoker.com/lose-less-win-more-the-fundamentals-of-big-blind-defense/' },
    { title: 'Preflop Wizard — BB Defend Range With Free Charts by Position', url: 'https://www.preflopwizard.app/blog/big-blind-defense' },
    { title: 'GTO Preflop — Big Blind Defense: What the Solver Actually Does vs Every Open', url: 'https://gtopreflop.com/posts/big-blind-defense' },
    { title: 'Upswing Poker — Small Blind Strategy Before the Flop (Level Up #16)', url: 'https://upswingpoker.com/podcast/ep16-small-blind-preflop/' },
    { title: 'Americas Cardroom — Navigating Post-Flop Play Out of Position in the Big Blind', url: 'https://www.acrpoker.eu/how-to/poker-strategy/intermediate/navigating-post-flop-play-out-of-position-in-the-big-blind/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'blind-defense-01', topic: 'blind-defense', lv: 1,
    q: 'BTN 開池 2.5bb，SB 棄牌，你在 BB。跟注需要的最低勝率（底池賠率）約是多少？',
    opts: ['約 27.3%', '約 22.2%', '約 30.8%', '約 62.5%'],
    ans: 0,
    exp: '你要補 1.5bb，跟注後底池 = 0.5 + 1 + 2.5 + 1.5 = 5.5bb，必要勝率 = 1.5 ÷ 5.5 ≈ 27.3%。22.2% 是面對 2bb 最小加注、30.8% 是面對 3bb 開池的門檻；62.5% 則是 BTN 拿任意牌偷盲要賺錢所需的盲注合計棄牌率。' },
  { id: 'blind-defense-02', topic: 'blind-defense', lv: 2,
    q: '前面全部棄牌，SB 開池到 3bb，你在 BB。跟注的必要勝率是多少？',
    opts: ['33.3%', '27.3%', '25%', '40%'],
    ans: 0,
    exp: 'SB 投入 3bb、你已投 1bb，底池 4bb；你補 2bb 後底池 6bb，必要勝率 = 2 ÷ 6 ≈ 33.3%。這比面對 2.5bb 開池（27.3%）高，這也是 SB 用 3bb 開池的原因之一；但 BB 對 SB 有位置，所以本站範圍仍防守約 54.5%（3-Bet 14% + 跟注 40.5%）。' },
  { id: 'blind-defense-03', topic: 'blind-defense', lv: 1,
    q: '依本站範圍表，BB 面對哪一個位置的 2.5bb 開池應該防守得最寬？',
    opts: ['BTN', 'UTG', 'HJ', 'CO'],
    ans: 0,
    exp: 'BTN 開池範圍最寬（約 45%），BB 的牌相對最強，總防守約 52.5%（3-Bet 12.5% + 跟注 40%）。對 UTG 只防守約 21%、對 HJ 約 27%、對 CO 約 35%：開池位置越前面，範圍越強，BB 越要收緊。' },
  { id: 'blind-defense-04', topic: 'blind-defense', lv: 2,
    q: '為什麼現代策略中，SB 面對開池幾乎不平跟，而是採用 3-Bet or Fold？',
    opts: ['平跟後翻後全程沒位置，BB 還可能擠壓或用好賠率跟進，形成你沒位置的多人底池', 'SB 已經投入 0.5bb，所以平跟最便宜、最應該多平跟', '規則規定小盲不能平跟別人的加注', '3-Bet 一定能讓開池者棄牌，所以永遠不會虧錢'],
    ans: 0,
    exp: 'SB 平跟有三個問題：翻後全程沒位置、後面的 BB 可以擠壓或便宜跟進、平跟要補 2bb 又不能關門。3-Bet 能拿主動權、常在翻前收下底池。規則並沒有禁止平跟；3-Bet 也不保證對手棄牌，只是整體 EV 較高。' },
  { id: 'blind-defense-05', topic: 'blind-defense', lv: 2,
    q: '你在 BB 跟注 BTN 的開池。翻牌 8♠ 5♥ 2♦，你拿 7♠ 6♠ 過牌，BTN 下注 1/3 池。下列哪個想法最符合 GTO 原則？',
    opts: ['繼續防守，常用過牌加注：低連張牌面對 BB 範圍有利，兩頭順聽牌勝率也不錯', '直接棄牌：沒有成對就不該繼續', '下次在這種牌面直接領先全下，聽牌就是要全下', '先跟注，轉牌不管發什麼都全下'],
    ans: 0,
    exp: '8-5-2 這類低連張牌面，BB 範圍有更多兩對、順子與組合聽牌，是適合過牌加注的地方；76s 有兩頭順聽牌加後門同花，對超對約 37% 勝率，加注同時擁有勝率與棄牌權益。棄牌太保守；無腦全下或不看轉牌就全下都忽略了牌面變化與底池大小。' },
  { id: 'blind-defense-06', topic: 'blind-defense', lv: 1,
    q: '下列哪一個是盲注防守最常見、最昂貴的漏洞？',
    opts: ['BB 面對 BTN 開池棄牌太多，例如把 K5s、T8s、A4o 都棄掉', 'BB 面對 UTG 開池只防守約五分之一的牌', 'BB 面對 SB 的 3bb 開池用 9bb 3-Bet', 'BB 在對自己有利的低牌面過牌加注強聽牌'],
    ans: 0,
    exp: '面對後位小開池，BB 有折扣又最後行動，依本站範圍應防守超過一半；把同花牌與 Axo 大量棄掉，等於讓對手免費偷盲。其他三個選項都是正確做法：對 UTG 收緊、對 SB 有位置時用 3 倍 3-Bet、在有利牌面過牌加注。' },
  { id: 'blind-defense-07', topic: 'blind-defense', lv: 1,
    q: '現場牌局 UTG 開池到 4bb，其他人都棄牌，你在 BB。跟注需要的最低勝率約是多少？',
    opts: ['約 35.3%', '約 27.3%', '約 25%', '50%'],
    ans: 0,
    exp: '你要補 3bb，跟注後底池 = 0.5 + 1 + 4 + 3 = 8.5bb，必要勝率 = 3 ÷ 8.5 ≈ 35.3%。開池越大、BB 越要收緊；再加上對手是範圍最強的 UTG，現場面對 4bb 開池要比線上 2.5bb 防守得緊很多。27.3% 是面對 2.5bb 開池的門檻。' },
  { id: 'blind-defense-08', topic: 'blind-defense', lv: 2,
    q: 'BTN 開池 2.5bb 偷盲。若想拿「任意兩張牌」都不虧，SB 與 BB 合計至少要棄牌多少？',
    opts: ['62.5%', '50%', '37.5%', '27.3%'],
    ans: 0,
    exp: 'BTN 冒 2.5bb 搶盲注的 1.5bb：損益兩平棄牌率 = 2.5 ÷（1.5 + 2.5）= 62.5%。依本站範圍 SB 約棄 85.5%、BB 約棄 47.5%，兩人都棄只有約 0.855 × 0.475 ≈ 40.6%，所以 BTN 不能拿任何牌都來偷——這就是盲注防守的目的。27.3% 是 BB 跟注的必要勝率。' }
);

// ===========================================================================
// 4. 擠壓與冷跟（squeeze-coldcall）
// ===========================================================================
GTO.THEORY.push({
  id: 'squeeze-coldcall',
  stage: 'preflop',
  part: '三、翻前策略',
  title: '擠壓（Squeeze）與冷跟（Cold Call）',
  icon: '🥪',
  level: 2,
  minutes: 11,
  tldr: '開池後有人跟注時再 3-Bet 就是擠壓：死錢多、跟注者範圍被封頂。冷跟只在有位置、不怕被擠壓時才合理。',
  plain: '擠壓像做三明治：開池者和跟注者被你夾在中間。開池者擔心後面的跟注者藏了強牌，跟注者自己又沒有頂級牌（真正的強牌早就 3-Bet 了），兩邊都難受，桌上的死錢就很容易落到你手上。',
  summary: '說明冷跟與擠壓的定義、擠壓尺度公式（3-Bet 尺度 + 每位跟注者一個開池量）、擠壓有效的原因（死錢、封頂範圍、夾擊）、擠壓選牌、冷跟何時合理何時該 3-Bet or Fold，以及面對擠壓時開池者與冷跟者的應對。',
  keyPoints: [
    '擠壓尺度 ≈ 一般 3-Bet 尺度 + 每位跟注者 1 個開池量：開池 2.5bb、一人跟注時，有位置擠壓到約 10bb，沒位置（SB / BB）約 12.5bb。',
    '擠壓有效的三個原因：底池死錢更多、冷跟者範圍被封頂、開池者被夾在中間只能多棄牌。',
    '擠壓範圍＝價值牌（QQ+、AK，對後位開池再加 JJ、AQs）＋阻擋牌與好打的同花牌（A5s–A2s、KTs、JTs）；沒位置與多人跟注時要更偏價值。',
    '冷跟最合理的位置是 BTN（例如面對 CO 開池）；SB 與前中位面對 UTG 時，後面人多、容易被擠壓，應以 3-Bet or Fold 為主。',
    '面對擠壓：開池者收緊，用強牌 4-Bet 或全下、棄掉範圍底部；冷跟者範圍最弱，大多只能棄牌，有位置時才多繼續一些。'
  ],
  html: `
    <h3>1. 定義：冷跟與擠壓</h3>
    <div class="callout plain"><b>白話解釋</b>冷跟就像在拍賣會上跟著別人的價格舉牌：你沒有主導權，而且後面的人隨時可能喊出更高價把你逼退。擠壓則是你當那個「喊出更高價」的人。</div>
    <ul>
      <li><strong>冷跟（<a href="#/wiki/glossary/cold-call">Cold Call</a>）</strong>：前面有人加注，你在還沒投入任何籌碼的情況下直接跟注。BB 已經投了 1bb，嚴格說不算冷跟，但「平跟防守」的道理相通。</li>
      <li><strong>擠壓（<a href="#/wiki/glossary/squeeze">Squeeze</a>）</strong>：有人開池、至少一人跟注之後，你再 3-Bet。</li>
    </ul>
    <table class="tbl">
      <thead><tr><th>行動順序範例</th><th>你的動作</th><th>名稱</th></tr></thead>
      <tbody>
        <tr><td>CO 開池 2.5bb → 你在 BTN</td><td>跟注 2.5bb</td><td>冷跟</td></tr>
        <tr><td>HJ 開池 2.5bb → CO 跟注 → 你在 BTN</td><td>加注到 10bb</td><td>擠壓</td></tr>
        <tr><td>HJ 開池 2.5bb → CO 跟注 → 你在 BTN</td><td>跟注 2.5bb</td><td>超跟（Overcall），也是一種冷跟</td></tr>
      </tbody>
    </table>

    <h3>2. 擠壓尺度怎麼算</h3>
    <div class="formula">擠壓尺度 ≈ 一般 3-Bet 尺度 + 每位跟注者 × 1 個開池量</div>
    <p>本站基準：開池 2.5bb，有位置（IP）3-Bet 約 3 倍（7.5bb），沒位置（OOP，SB / BB）約 4 倍（10bb）。每多一位跟注者，就再加一個 2.5bb：</p>
    <table class="tbl">
      <thead><tr><th>跟注人數</th><th>有位置擠壓（如 BTN）</th><th>沒位置擠壓（SB / BB）</th></tr></thead>
      <tbody>
        <tr><td>0 人（一般 3-Bet）</td><td>7.5bb</td><td>10bb</td></tr>
        <tr><td>1 人</td><td>10bb</td><td>12.5bb</td></tr>
        <tr><td>2 人</td><td>12.5bb</td><td>15bb</td></tr>
        <tr><td>3 人</td><td>15bb</td><td>17.5bb</td></tr>
      </tbody>
    </table>
    <p>為什麼要加大？底池裡多了跟注者的錢，如果你還是只加到 7.5bb，每個人都拿到很好的跟注賠率，結果常變成你最不想要的多人 3-Bet 底池。沒位置時再加大，是為了降低對手用位置便宜跟注的意願。這和 <a href="#/learn/preflop-3bet">3-Bet 範圍建構</a> 那課的公式一致。</p>

    <h3>3. 為什麼擠壓有效：死錢與封頂範圍</h3>
    <ol class="steps">
      <li><b>死錢更多</b>一人跟注後，擠壓前底池就有 2.5 + 2.5 + 1.5 = 6.5bb，比一般 3-Bet 面對的 4bb 多出六成。</li>
      <li><b>冷跟者範圍被封頂（Capped）</b>他的 AA、KK、AK 多半早就 3-Bet 了，冷跟範圍以中對子、同花牌為主，很難承受大額 3-Bet。</li>
      <li><b>開池者被夾在中間</b>就算他想跟注，也得擔心後面的冷跟者藏了陷阱，只能拿最強的牌繼續。</li>
    </ol>
    <table class="tbl">
      <thead><tr><th>BTN 的情境</th><th>加注前底池</th><th>加注到</th><th>純詐唬需要「全部人棄牌」的比例</th></tr></thead>
      <tbody>
        <tr><td>HJ 開池、沒人跟（一般 3-Bet）</td><td>4bb</td><td>7.5bb</td><td>7.5 ÷ 11.5 ≈ 65.2%</td></tr>
        <tr><td>HJ 開池、CO 跟注（擠壓）</td><td>6.5bb</td><td>10bb</td><td>10 ÷ 16.5 ≈ 60.6%</td></tr>
        <tr><td>HJ 開池、兩人跟注（擠壓）</td><td>9bb</td><td>12.5bb</td><td>12.5 ÷ 21.5 ≈ 58.1%</td></tr>
      </tbody>
    </table>
    <p>注意：跟注者越多，門檻看似越低，但要讓「每一個人」都棄牌也越難，被跟注時還可能是多人底池。所以兩人以上跟注時，擠壓範圍要更偏價值。</p>
    <div class="callout pro"><b>進階補充</b>GTO Wizard 的擠壓分析（40bb 範例）指出：擠壓之所以強，是因為開池者得擔心「跟注者可能是慢打的強牌」而大量棄牌，跟注者自己又因為沒 3-Bet 而範圍被封頂。現金桌有抽水，翻前收下底池不必付抽水，所以 Solver 的現金桌擠壓範圍偏緊、偏線性；而 KTs、JTs 這類同花百老匯是常見的詐唬擠壓，因為就算被兩個人跟注，它們也能做成同花、順子。</div>

    <h3>4. 擠壓範圍：價值牌＋有阻擋牌的詐唬</h3>
    <table class="tbl">
      <thead><tr><th>類型</th><th>例子</th><th>為什麼</th></tr></thead>
      <tbody>
        <tr><td><strong>價值擠壓</strong></td><td><span class="hand">QQ</span>+、<span class="hand">AKs</span>、<span class="hand">AKo</span>（對後位開池再加 <span class="hand">JJ</span>、<span class="hand">AQs</span>）</td><td>想用大底池打強牌，順便趕走會反超的牌</td></tr>
        <tr><td><strong>阻擋牌詐唬</strong></td><td><span class="hand">A5s</span>–<span class="hand">A2s</span></td><td>A 擋住 AA、AK；被跟注還有堅果同花與輪子順（見 <a href="#/learn/blockers">阻擋牌</a>）</td></tr>
        <tr><td><strong>好打的同花牌</strong></td><td><span class="hand">KTs</span>、<span class="hand">QTs</span>、<span class="hand">JTs</span>、<span class="hand">T9s</span></td><td>被跟注、甚至多人底池也能做成大牌</td></tr>
        <tr><td><strong>不適合擠壓</strong></td><td><span class="hand">KJo</span>、<span class="hand">QTo</span>、<span class="hand">A9o</span>、小對子</td><td>非同花牌被跟注時常被壓制；小對子比較適合便宜看翻牌</td></tr>
      </tbody>
    </table>
    <ul>
      <li><strong>沒位置要更緊</strong>：SB / BB 擠壓後翻後沒位置，範圍要更偏價值；BB 因為跟注有折扣，擠壓頻率通常比後位更低。</li>
      <li><strong>看開池位置</strong>：UTG 開池範圍強，擠壓要收緊；CO、BTN 開池範圍寬，擠壓可以更積極。</li>
    </ul>
    <div class="hh">
      <div class="hh-title">牌例：BTN 用 A5s 擠壓 HJ 與 CO</div>
      <div class="hh-row"><span class="hh-street">翻前</span>HJ 開池 2.5bb，CO 跟注 2.5bb，你在 BTN 拿 <span class="cards">As5s</span>，底池已有 2.5 + 2.5 + 1.5 = 6.5bb。</div>
      <div class="hh-row"><span class="hh-street">決策</span>你擠壓到 10bb（7.5bb + 一位跟注者 2.5bb）。就算當成純詐唬，也只要所有人棄牌 10 ÷ 16.5 ≈ 60.6% 就回本；A♠ 擋住 AA、AK，CO 的冷跟範圍又被封頂。</div>
      <div class="hh-row"><span class="hh-street">結果</span>SB、BB 棄牌；HJ 擔心被 CO 夾住而棄牌；CO 想了一下也棄牌，你收下 6.5bb。</div>
      <div class="hh-row result"><span class="hh-street">重點</span>若 HJ 4-Bet 到約 22–25bb，A5s 就乾脆棄牌——它是詐唬，不是價值牌。若只有 CO 跟注，你帶著主動權與位置進入 3-Bet 底池，A5s 還有堅果同花與輪子順的潛力。</div>
    </div>

    <h3>5. 冷跟：什麼時候合理？</h3>
    <div class="compare">
      <div><h4>✅ 冷跟合理</h4><ul><li><strong>BTN 面對 CO、HJ 開池</strong>：翻後保證有位置，後面只剩兩個盲注</li><li><strong>BB 平跟防守</strong>：有折扣又最後行動（見 <a href="#/learn/blind-defense">盲注防守</a>）</li><li>適合的牌：口袋對子、同花連張、同花百老匯</li></ul></div>
      <div><h4>❌ 改用 3-Bet or Fold</h4><ul><li><strong>SB</strong>：翻後全程沒位置，後面還有 BB</li><li><strong>HJ、CO 面對 UTG</strong>：後面人多，容易被擠壓</li><li>不適合的牌：面對 UTG 時的 AJo、KQo 這類非同花大牌，常被 AK、AQ 壓制</li></ul></div>
    </div>
    <table class="tbl">
      <thead><tr><th>本站範圍表</th><th>3-Bet</th><th>冷跟</th></tr></thead>
      <tbody>
        <tr><td>HJ 面對 UTG</td><td>約 4.5%</td><td>約 2.5%</td></tr>
        <tr><td>CO 面對 UTG</td><td>約 5%</td><td>約 3%</td></tr>
        <tr><td>CO 面對 HJ</td><td>約 7%</td><td>約 3%</td></tr>
        <tr><td>BTN 面對 CO</td><td>約 10%</td><td>約 6%</td></tr>
        <tr><td>SB 面對 BTN</td><td>約 14.5%</td><td>0%</td></tr>
      </tbody>
    </table>
    <div class="embed-chart" data-scenario="vsrfi_btn_co"></div>
    <div class="callout warn"><b>常見錯誤</b>把冷跟當成「不想棄、又不敢加」的安全選項。CO 冷跟 UTG 的 2.5bb 後，BTN、SB、BB 都可能擠壓；你的範圍沒有 AA、KK，被擠壓時多半只能棄牌，那 2.5bb 就白送了。冷跟要選「被擠壓也不太虧、看到翻牌又好打」的牌。</div>

    <h3>6. 面對擠壓：開池者與冷跟者怎麼辦？</h3>
    <ol class="steps">
      <li><b>開池者：收緊</b>你被夾在擠壓者與冷跟者中間，只用強牌繼續：QQ+、AK 4-Bet 或全下，部分好打的牌跟注，範圍底部直接棄掉。</li>
      <li><b>前位開池棄得少</b>UTG 開池範圍本來就強，面對擠壓棄牌比 CO、BTN 開池時少。</li>
      <li><b>冷跟者：最難受</b>範圍被封頂，大多只能棄牌；有位置的冷跟者（如 BTN）還能多繼續一些，沒位置的 SB 很少繼續。</li>
      <li><b>4-Bet 要更大或直接全下</b>擠壓後底池已經很大，小額 4-Bet 很尷尬。GTO Wizard 研究「開池＋兩人跟注後 BB 擠壓」時發現，底池已超過 20bb，各位置幾乎都不用非全下的 4-Bet，而是全下、跟注或棄牌。</li>
    </ol>
    <div class="callout tip"><b>實戰小技巧</b>記下每位對手的擠壓頻率。很少 3-Bet 的緊手一擠壓，多半就是 QQ+、AK，你可以放心棄掉 JJ、AQo；常常擠壓的激進玩家，則要多用 4-Bet 或有位置跟注反擊。</div>
    <p><strong>下一步：</strong>打開 <a href="#/ranges/vsrfi_btn_co">BTN 面對 CO 開池範圍表</a> 看看冷跟與 3-Bet 怎麼分工；複習 <a href="#/learn/preflop-3bet">3-Bet 範圍建構</a> 與 <a href="#/learn/blockers">阻擋牌</a>；到 <a href="#/quiz/preflop">翻前範圍練習</a> 實戰演練；接著學 <a href="#/learn/limped-pots">面對溜入</a>；最後做 <a href="#/quiz/theory?topic=squeeze-coldcall">本課測驗</a>。</p>
  `,
  sources: [
    { title: 'GTO Wizard — How To Construct a Squeezing Range', url: 'https://blog.gtowizard.com/how-to-construct-a-squeezing-range/' },
    { title: 'GTO Wizard — Responding to BB Squeezes', url: 'https://blog.gtowizard.com/responding-to-bb-squeezes/' },
    { title: 'PokerCoaching — The Squeeze Play in Poker (When and How to Use It)', url: 'https://pokercoaching.com/blog/squeezing-in-poker/' },
    { title: 'PokerCoaching — Cold Calling Preflop: Know When to Call a Raise', url: 'https://pokercoaching.com/blog/cold-calling-preflop-know-when-to-call-a-raise/' },
    { title: 'Deepfold — The Squeeze Play: When and How to 3-Bet Multiway', url: 'https://deepfold.co/en/blog/squeeze-play-tactics' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'squeeze-coldcall-01', topic: 'squeeze-coldcall', lv: 1,
    q: 'HJ 開池 2.5bb，CO 跟注，輪到你在 BTN 選擇再加注。這個動作叫什麼？',
    opts: ['擠壓（Squeeze）', '冷跟（Cold Call）', '4-Bet', '隔離加注（Iso-Raise）'],
    ans: 0,
    exp: '有人開池、至少一人跟注後再 3-Bet，就是擠壓。冷跟是「跟注」別人的加注；4-Bet 是對 3-Bet 再加注；隔離加注是對溜入者加注。' },
  { id: 'squeeze-coldcall-02', topic: 'squeeze-coldcall', lv: 1,
    q: 'HJ 開池 2.5bb、CO 跟注，你在 BTN（有位置）想擠壓。依「一般 3-Bet 尺度 + 每位跟注者一個開池量」，大約該加注到多少？',
    opts: ['10bb', '7.5bb', '12.5bb', '5bb'],
    ans: 0,
    exp: '有位置的一般 3-Bet 約 3 倍 = 7.5bb，再加一位跟注者的 2.5bb = 10bb。7.5bb 忽略了跟注者，會給大家太好的賠率；12.5bb 是沒位置擠壓（或有位置面對兩位跟注者）的尺度；5bb 太小。' },
  { id: 'squeeze-coldcall-03', topic: 'squeeze-coldcall', lv: 2,
    q: 'CO 開池 2.5bb，BTN 與 SB 都跟注，你在 BB 想擠壓（翻後沒位置）。依本課公式大約該加注到多少？',
    opts: ['15bb', '10bb', '12.5bb', '7.5bb'],
    ans: 0,
    exp: '沒位置的一般 3-Bet 約 4 倍 = 10bb，兩位跟注者各加 2.5bb：10 + 2.5 × 2 = 15bb。10bb 沒算跟注者；12.5bb 只算了一位；7.5bb 是有位置、沒人跟注時的尺度。' },
  { id: 'squeeze-coldcall-04', topic: 'squeeze-coldcall', lv: 2,
    q: '為什麼擠壓常常比面對單一開池的 3-Bet 更有效？',
    opts: ['底池死錢更多，而且冷跟者的範圍通常被封頂（強牌早就 3-Bet 了）', '跟注者越多，所有人一起棄牌的機率一定越高', '擠壓時完全不需要考慮開池者的範圍', '擠壓之後翻後一定會有位置'],
    ans: 0,
    exp: '死錢讓擠壓的風險報酬比更好，冷跟者範圍被封頂，開池者又被夾在中間，所以大家都得多棄牌。但跟注者越多，要「每個人」都棄牌其實越難；開池者範圍強弱仍然重要；BB、SB 擠壓後翻後是沒位置的。' },
  { id: 'squeeze-coldcall-05', topic: 'squeeze-coldcall', lv: 2,
    q: '依本站範圍表，下列哪一個情況最適合「冷跟」，而不是 3-Bet or Fold？',
    opts: ['BTN 拿 77 面對 CO 開池', 'SB 拿 KJo 面對 BTN 開池', 'HJ 拿 KQo 面對 UTG 開池', 'CO 拿 A9o 面對 UTG 開池'],
    ans: 0,
    exp: 'BTN 翻後保證有位置、後面只剩盲注，77 這類口袋對子是標準冷跟牌。SB 面對開池採 3-Bet or Fold（KJo 混合 3-Bet）；HJ 的 KQo、CO 的 A9o 面對 UTG 容易被壓制，後面人又多，應該棄牌。' },
  { id: 'squeeze-coldcall-06', topic: 'squeeze-coldcall', lv: 3,
    q: '你在 CO 開池 2.5bb，BTN 冷跟，BB 擠壓到 12.5bb。關於你的應對，下列何者最正確？',
    opts: ['收緊範圍：QQ+、AK 這類強牌 4-Bet 或全下，部分好打的牌跟注，開池範圍底部直接棄掉', '已經投入 2.5bb，所以大部分牌都應該跟注', 'BTN 冷跟代表他很弱，你應該拿任何牌 4-Bet 詐唬', 'BB 擠壓一定是在詐唬，所以全部跟注到底'],
    ans: 0,
    exp: '你被夾在擠壓者與後面的冷跟者之間，只能用強牌繼續、範圍底部棄掉。已投入的 2.5bb 是沉沒成本；BTN 雖然範圍被封頂，但仍可能繼續，任意牌 4-Bet 很危險；擠壓範圍以價值牌為主，不能假設對方一定在詐唬。' },
  { id: 'squeeze-coldcall-07', topic: 'squeeze-coldcall', lv: 2,
    q: 'HJ 開池 2.5bb、CO 跟注，你在 BTN 擠壓到 10bb 當純詐唬。所有人都棄牌的機率至少要多少，這個擠壓才不虧？',
    opts: ['約 60.6%', '約 65.2%', '50%', '約 40%'],
    ans: 0,
    exp: '擠壓前底池 = 2.5 + 2.5 + 0.5 + 1 = 6.5bb，你冒 10bb：損益兩平 = 10 ÷（6.5 + 10）≈ 60.6%。65.2% 是沒人跟注時一般 3-Bet 到 7.5bb 的門檻（7.5 ÷ 11.5）；死錢越多，詐唬門檻越低。' }
);

// ===========================================================================
// 5. 面對溜入：隔離加注與溜入底池（limped-pots）
// ===========================================================================
GTO.THEORY.push({
  id: 'limped-pots',
  stage: 'preflop',
  part: '三、翻前策略',
  title: '面對溜入（Limp）：隔離加注與溜入底池',
  icon: '🐟',
  level: 2,
  minutes: 11,
  tldr: '有人溜入時，用「開池尺度 + 每位溜入者 1bb」隔離加注，範圍比 RFI 緊；投機牌在有位置、多人溜入時可以跟著溜入。',
  plain: '溜入就像只付「最低消費」進場：便宜，但沒有主導權。面對一群想便宜看翻牌的人，最好的辦法通常是把門票漲價（隔離加注）——讓他們付高價陪你玩，或乾脆退場，把底池變成你和最弱玩家的一對一。',
  summary: '低級別桌常見玩家用溜入（Limp）入池。本課教你隔離加注的尺度表、隔離範圍為何通常比 RFI 緊、何時可以跟著溜入、BB 面對溜入該加注還是過牌、SB 何時補盲，以及如何用價值下注剝削溜入的休閒玩家。',
  keyPoints: [
    '隔離加注尺度 ≈ 開池尺度 + 每位溜入者 1bb：線上常用 3bb + 每人 1bb（一人溜入 → 4bb），現場 4bb + 每人 1bb；沒位置（SB / BB）再加 1bb。',
    '隔離範圍通常比同位置的 RFI 緊：偷盲價值變小、溜入者常跟注、尺度更大；溜入者越多越要收緊，只有面對單一弱玩家又有位置時才放寬。',
    '跟著溜入（Overlimp）適合：有位置、前面已有多人溜入、籌碼夠深、後面玩家被動；牌型是小對子、同花連張、同花 A。',
    'BB 面對溜入：中等與投機牌過牌看免費翻牌，強牌加大尺度加注打價值；SB 有多人溜入時可用 0.5bb 補盲投機牌，但翻後全程沒位置。',
    '剝削休閒溜入者：隔離要大、翻後多條街價值下注、少詐唬跟注站；被動玩家突然溜入再加注（Limp-Raise），多半是 AA、KK 這類強牌。'
  ],
  html: `
    <h3>1. 溜入是什麼？誰會溜入？</h3>
    <div class="callout plain"><b>白話解釋</b>像夜市排隊：真正想買的人（強牌）通常一開口就喊價（加注）；溜入的人比較像「先排排看」，手上多半是不上不下的牌。所以溜入範圍通常偏寬、偏弱，而且很少有 AA、KK。</div>
    <ul>
      <li><strong>溜入（<a href="#/wiki/glossary/open-limp">Limp / Open Limp</a>）</strong>：前面沒人加注時，第一個入池只跟 1bb。</li>
      <li><strong>跟著溜入（Overlimp / Limp Behind）</strong>：前面已經有人溜入，你也只跟 1bb。</li>
      <li><strong>補盲（Complete）</strong>：SB 只補 0.5bb 跟到 1bb。</li>
      <li><strong>隔離加注（<a href="#/wiki/glossary/iso-raise">Iso-Raise</a>）</strong>：對溜入者加注，目標是把底池變成你對溜入者的單挑。</li>
    </ul>
    <p>在 6 人桌 100bb 現金桌，Solver 幾乎不會用 SB 以外的位置溜入，本站基準也是「加注或棄牌」。但在低級別與現場小額桌，溜入的休閒玩家非常多——他們是牌桌上主要的利潤來源。</p>
    <table class="tbl">
      <thead><tr><th>溜入者類型</th><th>溜入範圍</th><th>你的對策</th></tr></thead>
      <tbody>
        <tr><td><strong>鬆被動休閒玩家</strong>（很常溜入）</td><td>很寬、很弱，常有 K7o、Q5s、小對子</td><td>放寬隔離範圍、加大尺度，翻後多打價值</td></tr>
        <tr><td><strong>緊被動玩家</strong>（很少溜入）</td><td>偏中強：對子、百老匯</td><td>收緊隔離範圍，尊重他的牌力</td></tr>
        <tr><td><strong>會溜入再加注的玩家</strong></td><td>常把 AA、KK 藏在溜入裡</td><td>對他的溜入再加注給足尊重</td></tr>
      </tbody>
    </table>

    <h3>2. 隔離加注（Iso-Raise）尺度</h3>
    <div class="formula">隔離加注尺度 ≈ 開池尺度 + 每位溜入者 1bb（沒位置再 + 1bb）</div>
    <p>本站 RFI 用 2.5bb，但面對溜入者時，底池已經有死錢、休閒玩家又不愛棄牌，所以底數通常提高：Upswing 建議線上用 3bb、現場用 4bb，再加上每位溜入者 1bb。</p>
    <table class="tbl">
      <thead><tr><th>溜入人數</th><th>線上・有位置</th><th>線上・沒位置（SB / BB）</th><th>現場・有位置</th><th>現場・沒位置</th></tr></thead>
      <tbody>
        <tr><td>1 人</td><td>4bb</td><td>5bb</td><td>5bb</td><td>6bb</td></tr>
        <tr><td>2 人</td><td>5bb</td><td>6bb</td><td>6bb</td><td>7bb</td></tr>
        <tr><td>3 人</td><td>6bb</td><td>7bb</td><td>7bb</td><td>8bb</td></tr>
      </tbody>
    </table>
    <ul>
      <li><strong>為什麼要加？</strong>每位溜入者都替底池多放 1bb，你若只開 2.5bb，後面的人和溜入者都拿到很好的賠率，很容易變成多人底池。</li>
      <li><strong>尺度的目標</strong>：大到讓後面的玩家不想冷跟，又小到讓溜入者願意用更差的牌跟注。</li>
      <li><strong>動態調整</strong>：如果現場的溜入者連 5bb 都秒跟，就試 6bb、7bb，直到他們開始棄牌，再退回上一個尺度。</li>
    </ul>

    <h3>3. 隔離範圍：比 RFI 緊還是寬？</h3>
    <p>大多數情況下，隔離範圍要<strong>比同位置的 RFI 緊</strong>，原因有四個：</p>
    <ol class="steps">
      <li><b>偷盲價值變小</b>RFI 有一部分 EV 來自「盲注直接棄牌」；有人溜入後，翻前直接收下底池的機會大減。</li>
      <li><b>溜入者常跟注</b>你會更常打翻後，高張與對子這類「牌力」比勉強的可玩性更重要。</li>
      <li><b>尺度更大、SPR 更低</b>投入更多，翻牌的籌碼底池比更低，頂對好踢腳更值錢，邊緣牌更容易被套住。</li>
      <li><b>溜入者越多越要緊</b>要讓多人都棄牌更難，底池也更大。Upswing 的黃金法則：前面溜入的人越多，隔離範圍越緊——位置也重要，但影響比溜入人數小。</li>
    </ol>
    <table class="tbl">
      <thead><tr><th>情境</th><th>範圍方向</th><th>偏好的牌</th></tr></thead>
      <tbody>
        <tr><td>UTG / HJ 面對溜入</td><td>比 RFI 略緊</td><td>中大對子、AJ+、KQ、同花百老匯</td></tr>
        <tr><td>CO / BTN 面對一位鬆弱溜入者</td><td>比 RFI 緊，但仍相當寬</td><td>對子、同花 A、同花百老匯、較強的非同花高張</td></tr>
        <tr><td>面對兩位以上溜入者</td><td>明顯更緊、更偏價值</td><td>中大對子、強高張；投機牌改成跟著溜入</td></tr>
        <tr><td>SB / BB 隔離（沒位置）</td><td>比有位置時更緊</td><td>以價值牌為主，尺度再加大</td></tr>
      </tbody>
    </table>
    <p>例外：面對單一位很鬆、翻後又很被動的溜入者，你在 CO / BTN 有位置時可以放寬隔離——這是 <a href="#/learn/exploit">剝削打法</a>，不是 GTO。另外，有效籌碼 40bb 以下時，別再用小對子隔離，因為中三條後能贏回的錢太少。</p>
    <p>下圖是本站 BTN 的 RFI 開池範圍（約 45%）。面對溜入者時，就從這張圖的「底部」開始往上刪：先拿掉最弱的非同花牌與低同花牌，溜入者越多刪得越多。</p>
    <div class="embed-chart" data-scenario="rfi_btn"></div>

    <h3>4. 什麼時候可以跟著溜入（Overlimp）？</h3>
    <p>只花 1bb 就能看多人翻牌，對「中了就是大牌」的投機牌很划算。口袋對子翻牌中三條（或更好）的機率約 <strong>11.8%</strong>（約 8.5 次中 1 次），對手多、籌碼深時，中一次就可能贏回很多倍。</p>
    <div class="compare">
      <div><h4>✅ 適合跟著溜入</h4><ul><li>有位置（越靠近 BTN 越好）</li><li>前面已有 2 位以上溜入者</li><li>籌碼深（100bb 以上）</li><li>後面玩家被動、不愛擠壓</li><li>牌型：<span class="hand">22</span>–<span class="hand">66</span>、同花連張、同花 A</li></ul></div>
      <div><h4>❌ 不適合跟著溜入</h4><ul><li>後面還有很多人、或有愛 3-Bet 的玩家</li><li>籌碼淺，中牌也贏不了多少</li><li>非同花高張如 <span class="hand">KJo</span>、<span class="hand">QTo</span>、<span class="hand">A9o</span>：多人底池容易做成第二大的牌</li><li>夠強的牌（如 <span class="hand">AA</span>、<span class="hand">AQs</span>）：應該隔離加注打價值</li></ul></div>
    </div>
    <div class="callout warn"><b>常見錯誤</b>「反正只要 1bb，什麼牌都跟著溜入看看。」非同花高張在多人底池常拿到頂對弱踢腳，反向隱含賠率很高；後面有激進玩家時，你的溜入還常被加注逼退，白送 1bb。跟著溜入要挑「中了很大、沒中好放棄」的牌。</div>

    <h3>5. 盲注面對溜入：BB 加注 vs 過牌、SB 補盲</h3>
    <table class="tbl">
      <thead><tr><th>情境</th><th>建議打法</th><th>說明</th></tr></thead>
      <tbody>
        <tr><td><strong>BB：大家都溜入</strong></td><td>中等牌、投機牌 → 過牌；強牌 → 加注打價值</td><td>過牌免費看翻牌；加注要更大（沒位置），範圍要更緊</td></tr>
        <tr><td><strong>BB：很多人溜入</strong></td><td>只用 QQ+、AK 這類強牌加注（JJ、AQ 在邊緣）</td><td>SplitSuit 指出在很鬆的現場小額桌，盲注加注常要到 10–15bb 才打得掉人</td></tr>
        <tr><td><strong>BB：SB 溜入（盲注對決）</strong></td><td>對會平衡溜入的對手，約 40–45% 加注到 3.5–4bb；對弱玩家可超過 50%、約 4.5bb</td><td>加到 4bb 時，SB 要補 3bb 搶 8bb，需要 37.5% 勝率</td></tr>
        <tr><td><strong>SB：前面有溜入者</strong></td><td>投機牌補盲；強牌加注；非同花垃圾牌棄牌</td><td>兩人溜入時底池 3.5bb，補 0.5bb 後變 4bb，只需 0.5 ÷ 4 = 12.5% 勝率；但 BB 還能加注，你翻後也全程沒位置</td></tr>
      </tbody>
    </table>
    <div class="callout tip"><b>實戰小技巧</b>BB 拿 <span class="hand">97s</span>、<span class="hand">55</span>、<span class="hand">KTo</span> 這類牌面對多人溜入時，別急著加注——你沒位置，加注只會把底池做大、卻趕不走跟注站。過牌看免費翻牌，中了大牌再讓溜入者付錢。</div>

    <h3>6. 如何剝削溜入的休閒玩家</h3>
    <ol class="steps">
      <li><b>隔離要大</b>休閒玩家跟 4bb 和跟 6bb 的範圍差不多，就讓他付更多錢。</li>
      <li><b>翻後以價值為主</b>拿到頂對以上就多條街下注，他常用更差的對子、聽牌跟到底。</li>
      <li><b>少對跟注站詐唬</b>他不愛棄牌，詐唬的棄牌權益很低（見 <a href="#/learn/fold-equity">棄牌權益</a>），沒中就過牌放棄。</li>
      <li><b>尊重突然的攻擊</b>被動玩家溜入再加注、或在轉牌、河牌突然加注，多半是兩對以上或 AA、KK。</li>
      <li><b>有位置、單挑最好</b>隔離的目的就是在有位置的單挑底池裡，放大他翻後的錯誤。</li>
    </ol>
    <div class="hh">
      <div class="hh-title">牌例：BTN 用 AJo 隔離溜入者，三條街收價值</div>
      <div class="hh-row"><span class="hh-street">翻前</span>線上 6 人桌，HJ（鬆被動休閒玩家）溜入 1bb，CO 棄牌。你在 BTN 拿 <span class="cards">AhJc</span> 隔離加注到 4bb（3bb + 一位溜入者 1bb），盲注棄牌，HJ 跟注，底池 9.5bb。</div>
      <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Jd7s3c</span>（底池 9.5bb）HJ 過牌，你下注 6bb（約 2/3 池），HJ 跟注。</div>
      <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2h</span>（底池 21.5bb）HJ 過牌，你再下注 14bb（約 2/3 池），HJ 跟注。</div>
      <div class="hh-row"><span class="hh-street">河牌</span><span class="cards">3d</span>（底池 49.5bb）HJ 過牌，你下注 25bb（約 1/2 池）薄價值，HJ 用 <span class="cards">Js9s</span> 跟注，你贏下 99.5bb。</div>
      <div class="hh-row result"><span class="hh-street">重點</span>對溜入的休閒玩家，最大的利潤來自價值下注，不是詐唬：他會用更差的 J、7x、小對子一路跟。反過來，如果這位被動的 HJ 在河牌突然大額加注，他多半是兩對或三條，AJ 這種一對要敢棄牌。</div>
    </div>
    <div class="callout pro"><b>進階補充</b>從 GTO 角度看，6 人桌 100bb 現金桌除了 SB 之外幾乎不該溜入：溜入讓 BB 能便宜實現權益、拿到強牌時又做不大底池，而且溜入範圍很容易被讀成「中弱牌」。所以面對溜入者，隔離加注本質上是剝削打法——尺度、範圍都要依對手調整；遇到少數會用平衡溜入策略的強手，再回到接近 GTO 的保守打法。</div>
    <p><strong>下一步：</strong>複習 <a href="#/learn/exploit">GTO 與剝削打法</a>，學會依對手類型調整；搭配 <a href="#/learn/multiway">多人底池策略</a> 練習溜入後的翻後打法；回顧 <a href="#/learn/preflop-rfi">RFI 開池範圍</a> 比較隔離範圍差在哪；到 <a href="#/wiki/leaks">常見漏洞</a> 檢查自己；最後做 <a href="#/quiz/theory?topic=limped-pots">本課測驗</a>。</p>
  `,
  sources: [
    { title: 'Upswing Poker — How to Maximize Your Winnings Versus Multiple Limpers', url: 'https://upswingpoker.com/vs-multiple-limpers/' },
    { title: 'Upswing Poker — How to Win Your Blind vs Blind Wars (When Facing a Limp)', url: 'https://upswingpoker.com/blind-vs-small-blind-limp/' },
    { title: 'PokerNews — 10 Tips That Will Help You Destroy Limpers', url: 'https://www.pokernews.com/strategy/10-tips-that-will-help-you-destroy-limpers-32206.htm' },
    { title: 'SplitSuit — Overlimping: When & How To Limp Behind Preflop', url: 'https://www.splitsuit.com/overlimping-how-to-limp-behind-preflop' },
    { title: 'SplitSuit — Playing The Blinds Against Many Limpers', url: 'https://www.splitsuit.com/playing-the-blinds-against-many-limpers' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'limped-pots-01', topic: 'limped-pots', lv: 1,
    q: '線上 6 人桌，HJ 溜入 1bb，你在 BTN 想隔離加注。依「3bb + 每位溜入者 1bb」的建議，大約該加注到多少？',
    opts: ['4bb', '2.5bb', '3bb', '7bb'],
    ans: 0,
    exp: '線上隔離尺度 ≈ 3bb + 1 位溜入者 × 1bb = 4bb。2.5bb 是沒人溜入時的 RFI 尺度，面對溜入者會給大家太好的賠率；3bb 忘了加溜入者；7bb 是現場 3 位溜入者時的尺度。' },
  { id: 'limped-pots-02', topic: 'limped-pots', lv: 2,
    q: '現場小額桌有兩位玩家溜入，你在 BB 拿 Q♠ Q♦ 想加注。依「現場 4bb + 每位溜入者 1bb，沒位置再加 1bb」，大約該加注到多少？',
    opts: ['7bb', '6bb', '4bb', '3bb'],
    ans: 0,
    exp: '4bb（現場底數）+ 2 × 1bb（兩位溜入者）+ 1bb（BB 翻後沒位置）= 7bb。6bb 是有位置時的尺度；4bb、3bb 太小，溜入者與 SB 都會拿到很好的跟注賠率，你會在沒位置的多人底池裡打 QQ。' },
  { id: 'limped-pots-03', topic: 'limped-pots', lv: 2,
    q: '面對一位溜入者時，你的隔離加注範圍通常應該比同位置的 RFI（開池）範圍怎樣？',
    opts: ['更緊：偷盲價值變小、溜入者常跟注、尺度更大，而且溜入者越多越要收緊', '更寬：溜入者都很弱，所以任何牌都該加注', '完全一樣：照 RFI 範圍表加注就好', '只用 AA、KK 加注，其餘全部跟著溜入'],
    ans: 0,
    exp: '有人溜入後，翻前直接收下底池的機會變少，溜入者又常跟注，加上尺度更大、SPR 更低，所以隔離範圍通常比 RFI 緊，溜入者越多越緊。只有面對單一位鬆弱玩家、又有位置時才適度放寬；只用 AA、KK 則太緊，會錯過大量價值。' },
  { id: 'limped-pots-04', topic: 'limped-pots', lv: 2,
    q: '下列哪一個情境最適合「跟著溜入（Overlimp）」？',
    opts: ['BTN 拿 4♠ 4♥，前面已有三位被動玩家溜入，大家籌碼都超過 100bb', 'HJ 拿 K♣ J♦，前面一位溜入者，後面有很愛 3-Bet 的玩家', 'CO 拿 A♠ A♦，前面兩位溜入者', 'BTN 拿 9♣ 4♦，前面一位溜入者'],
    ans: 0,
    exp: '小對子在有位置、多人溜入、籌碼深的情況下，用 1bb 換約 11.8% 中三條的機會，隱含賠率極佳。KJo 是容易被壓制的非同花牌，後面又有激進玩家；AA 應該隔離加注打價值；94o 是垃圾牌，便宜也不該玩。' },
  { id: 'limped-pots-05', topic: 'limped-pots', lv: 1,
    q: '前面三位玩家溜入、SB 補盲，輪到你在 BB 拿 9♥ 7♥。最標準的做法是什麼？',
    opts: ['過牌，免費看翻牌', '加注到 10bb，把所有人趕走', '直接全下', '棄牌'],
    ans: 0,
    exp: '97s 是適合多人底池的投機牌，BB 可以免費看翻牌，沒有理由在沒位置時把底池做大；加注很難趕走一群跟注站，只會讓你在大底池裡沒位置。全下太誇張；棄牌更是錯誤——你可以免費過牌，棄牌等於白白放棄權益。' },
  { id: 'limped-pots-06', topic: 'limped-pots', lv: 2,
    q: '一位整晚都很被動、常常溜入的休閒玩家，這次溜入後面對你的隔離加注，突然再加注（Limp-Raise）。這通常代表什麼？',
    opts: ['他的範圍非常強，常是 AA、KK 這類想設陷阱的牌', '他在詐唬，因為溜入代表牌很弱', '他按錯按鈕，應該直接全下懲罰他', '他的牌和平常溜入時一樣弱，照常應對即可'],
    ans: 0,
    exp: '被動玩家很少無故加注；溜入再加注是經典的陷阱打法，範圍通常集中在 AA、KK 等強牌。除非你也拿著頂級牌，否則應該大幅收緊、多數情況棄牌。把它當成詐唬或「跟平常一樣弱」是常見的昂貴錯誤。' },
  { id: 'limped-pots-07', topic: 'limped-pots', lv: 2,
    q: 'SB 溜入（補到 1bb），你在 BB 加注到 4bb。SB 想跟注，需要多少勝率？',
    opts: ['37.5%', '25%', '33.3%', '50%'],
    ans: 0,
    exp: 'SB 要再補 3bb，跟注後底池 = 4 + 4 = 8bb，必要勝率 = 3 ÷ 8 = 37.5%。這比面對 SB 開 3bb 時 BB 需要的 33.3% 還高，再加上 SB 翻後沒位置，所以 BB 對溜入的 SB 可以積極加注。' }
);

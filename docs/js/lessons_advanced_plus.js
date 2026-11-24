/* GTO 撲克學院 — lessons_advanced_plus.js：實戰與進階補充 9 課 */
window.GTO = window.GTO || {};
GTO.THEORY = GTO.THEORY || [];
GTO.QUESTIONS = GTO.QUESTIONS || [];

// ===========================================================================
// 1. 玩家類型與 HUD 數據
// ===========================================================================
GTO.THEORY.push({
  id: 'player-types',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: '玩家類型與 HUD 數據',
  icon: '🕵️',
  level: 2,
  minutes: 14,
  tldr: 'HUD 是對手的球探報告：先看樣本數，再用 VPIP / PFR 分類，最後看細項決定怎麼剝削。',
  plain: '棒球投手上場前會看打者的打擊率、選球率：愛追壞球的就多投變化球。HUD 就是撲克的數據看板，把對手過去幾百、幾千手的習慣濃縮成幾個百分比，你不用記住每一手牌，看數字就知道他「很緊、很鬆、很愛跟、還是很愛詐唬」。',
  summary: '拆解 10 個最常用 HUD 數據的定義與 6-max 合理區間、七種玩家類型的數據特徵與剝削方法、樣本要多大數字才可信，並用牌例示範如何用數據決定要不要 3-Bet 詐唬。',
  keyPoints: [
    'VPIP / PFR 是最快的分類工具：6-max 正常常客約 22–28 / 17–23，兩者差距越大越被動（42 / 8 是跟注站），差距越小越凶。',
    '攤牌三兄弟要一起看：WTSD 約 27–32%、W$SD 約 49–55%、WWSF 約 45–53%；WTSD 高、W$SD 低＝用爛牌跟到底的魚。',
    '七種類型各有解法：Nit 多偷、少付錢；跟注站不詐唬、多薄價值；瘋子收緊範圍讓他詐唬；LAG 用中強牌多抓詐。',
    '樣本數看「機會次數」：VPIP / PFR 約 300 手、3-Bet 約 1,000 手、攤牌類 8,000 手以上才可信；100 手的 VPIP 25%，真實值可能在 16.5%–33.5%。',
    'HUD 用來調整「整個範圍的頻率」而不是猜單手牌；使用前先確認平台是否允許追蹤軟體。'
  ],
  html: `
<h3>1. HUD 是什麼？把對手變成一張「球探報告」</h3>
<p>HUD（Heads-Up Display，抬頭顯示器）是追蹤軟體（例如 PokerTracker、Hold'em Manager、Hand2Note）的功能：軟體把你打過的每一手牌存進資料庫，再把每位對手的統計數字直接顯示在他的座位旁。</p>
<div class="callout plain"><b>白話解釋</b>HUD 很像健康檢查報告：單看血壓只知道一件事，要把血壓、血糖、心跳放在一起才看得出整體狀況；而且只量一次的血壓可能剛好偏高，量很多次的平均才可信。讀 HUD 也一樣：多項數據一起看，而且樣本要夠大。</div>
<ol class="steps">
<li><b>先看樣本數</b>手數太少的數字只是雜訊（見第 5 節）。</li>
<li><b>再看 VPIP / PFR</b>兩個數字就能把人粗分為緊 / 鬆、凶 / 被動。</li>
<li><b>最後看細項</b>3-Bet、Fold to 3-Bet、C-Bet、WTSD 等，決定具體怎麼剝削。</li>
</ol>
<div class="callout warn"><b>常見錯誤</b>① 以為每個平台都能用 HUD：許多平台禁止第三方追蹤軟體，違規可能被封號，一定要先讀平台規則（有些平台改提供內建數據）。② 把 HUD 當水晶球：數字描述的是對手「整體範圍的傾向」，不是「這一手拿什麼」。</div>

<h3>2. 翻前四大數據：VPIP、PFR、3-Bet%、Fold to 3-Bet</h3>
<table class="tbl"><thead><tr><th>數據</th><th>白話問題</th><th>怎麼算</th><th>6-max 常見合理區間</th><th>偏離時代表</th></tr></thead><tbody>
<tr><td><strong>VPIP</strong> 主動入池率</td><td>他玩多少手？</td><td>翻前自願跟注或加注的手數 ÷ 總手數（大盲被過牌、免費看牌不算）</td><td>約 22–28%（25% 左右最常見）</td><td>&gt; 35%：太鬆（魚、瘋子）；&lt; 15%：太緊（Nit）</td></tr>
<tr><td><strong>PFR</strong> 翻前加注率</td><td>他入池時多常主動加注？</td><td>翻前有加注（開池、3-Bet、4-Bet）的手數 ÷ 總手數</td><td>約 17–23%</td><td>比 VPIP 低 10 點以上：被動愛跟；差距 &lt; 3 點：非常凶</td></tr>
<tr><td><strong>3-Bet%</strong></td><td>別人開池時，他多常反擊？</td><td>3-Bet 次數 ÷ 有機會 3-Bet 的次數</td><td>約 6–10%（BTN、SB 較高，UTG 較低）</td><td>&gt; 13%：詐唬 3-Bet 很多；&lt; 4%：只有大牌才 3-Bet</td></tr>
<tr><td><strong>Fold to 3-Bet</strong>（開池後）</td><td>他開池被反加注時多常放棄？</td><td>開池後被 3-Bet 而棄牌 ÷ 開池後被 3-Bet 的次數</td><td>約 40–55%（有位置偏低、沒位置偏高）</td><td>&gt; 60%：怕 3-Bet，可以多偷；&lt; 35%：很黏，別對他詐唬 3-Bet</td></tr>
</tbody></table>
<p>設定 HUD 時，Fold to 3-Bet 要選「開池後（after raising）」的版本；一般版本會把「別人開池又被 3-Bet、他在大盲直接棄牌」也算進去，數字會失真。</p>
<div class="callout tip"><b>實戰小技巧</b>VPIP / PFR 兩個數字就能秒讀人：<strong>25 / 20</strong> 是正常常客；<strong>12 / 9</strong> 是只玩大牌的 Nit；<strong>42 / 8</strong> 是愛平跟的跟注站；<strong>55 / 40</strong> 是瘋子。差距越大越被動，差距越小越凶。</div>

<h3>3. 翻後數據：C-Bet、AF / AFq 與「攤牌三兄弟」</h3>
<table class="tbl"><thead><tr><th>數據</th><th>定義</th><th>常見合理區間</th><th>怎麼用</th></tr></thead><tbody>
<tr><td><strong>Flop C-Bet%</strong></td><td>翻前加注者在翻牌圈下注的頻率</td><td>整體約 50–70%（有位置、3-Bet 底池偏高；沒位置的單一加注底池偏低）</td><td>&gt; 80%：很多空氣，多跟注、多過牌加注；&lt; 40%：一下注幾乎都有貨</td></tr>
<tr><td><strong>Fold to C-Bet</strong></td><td>翻前跟注者面對翻牌 C-Bet 時棄牌的頻率</td><td>約 40–55%（面對小注本來就該少棄）</td><td>&gt; 60%：沒中就丟，高頻 C-Bet 詐唬；&lt; 35%：很黏，少詐唬、多價值</td></tr>
<tr><td><strong>AF</strong> 侵略因子</td><td>翻後（下注 + 加注）÷ 跟注</td><td>約 2–3.5</td><td>&lt; 1.5：被動，他下注或加注就要尊重；&gt; 4：很凶，抓詐範圍放寬</td></tr>
<tr><td><strong>AFq</strong> 侵略頻率</td><td>翻後（下注 + 加注）÷（下注 + 加注 + 跟注 + 棄牌）</td><td>約 40–55%（各軟體算法略有不同）</td><td>百分比比 AF 好比較；&lt; 35% 被動，&gt; 60% 過度侵略</td></tr>
<tr><td><strong>WTSD</strong> 攤牌率</td><td>看到翻牌後，一路走到攤牌的比例</td><td>約 27–32%</td><td>&gt; 33%：跟注站，不要詐唬；&lt; 25%：容易被連續下注打跑</td></tr>
<tr><td><strong>W$SD</strong> 攤牌勝率</td><td>走到攤牌時贏得底池的比例</td><td>約 49–55%</td><td>WTSD 高 + W$SD 低：用爛牌跟到底的魚</td></tr>
<tr><td><strong>WWSF</strong> 見翻牌勝率</td><td>看到翻牌後最後贏得底池的比例（含沒攤牌就贏）</td><td>約 45–53%</td><td>&gt; 53%：很會搶底池；&lt; 44%：太早放棄</td></tr>
</tbody></table>
<div class="formula">AF = （下注次數 + 加注次數）÷ 跟注次數</div>
<div class="formula">AFq = （下注 + 加注）÷（下注 + 加注 + 跟注 + 棄牌）× 100%</div>
<div class="callout example"><b>例題：攤牌三兄弟一起看</b>
甲：WTSD 35 / W$SD 46 / WWSF 42 → 常跟到底又常輸，典型跟注站：薄價值下注、完全不詐唬。<br>
乙：WTSD 23 / W$SD 58 / WWSF 41 → 很少攤牌、一攤牌就是好牌：緊弱型，多開第二、三槍施壓，但他真的跟到河牌時要尊重。<br>
丙：WTSD 29 / W$SD 52 / WWSF 51 → 各項均衡又很會搶底池：強 Reg，避免無謂硬碰。</div>

<h3>4. 七種玩家類型：數據特徵與剝削方法</h3>
<table class="tbl"><thead><tr><th>類型</th><th>典型 VPIP / PFR</th><th>其他特徵</th><th>怎麼剝削</th></tr></thead><tbody>
<tr><td><strong>Nit（岩石）</strong></td><td>約 10–15 / 8–12</td><td>3-Bet &lt; 4%；WTSD 低、W$SD 高</td><td>他在盲注時狂偷；他加注、3-Bet 或連續下注時，邊緣牌直接棄；翻牌詐唬常有效，但別付錢給他的大注</td></tr>
<tr><td><strong>TAG（緊凶）</strong></td><td>約 18–23 / 15–20</td><td>3-Bet 6–9%；AF 2–3；數據接近教科書</td><td>以 GTO 打法為底，只針對單一漏洞（例如轉牌放棄太多就多漂浮跟注）；少打無謂的翻前大戰</td></tr>
<tr><td><strong>LAG（鬆凶）</strong></td><td>約 26–32 / 22–28</td><td>3-Bet 10–14%；WWSF 高</td><td>用頂對、超對等中強牌多抓詐；適度 4-Bet、有位置多平跟他的 3-Bet；別被他的頻繁下注嚇跑</td></tr>
<tr><td><strong>Maniac（瘋子）</strong></td><td>約 45+ / 35+</td><td>AF &gt; 4；翻前常全下、愛超池下注</td><td>收緊範圍、讓他自己詐唬；頂對以上「要嘛跟到底、要嘛一開始就棄」，別中途放棄；強牌可慢打</td></tr>
<tr><td><strong>跟注站（魚）</strong></td><td>約 35–50 / 5–12</td><td>常溜入；AF &lt; 1.5；WTSD &gt; 33%</td><td>永遠不要純詐唬；中等牌也做薄價值下注，而且尺度加大；他突然加注＝很強，一對直接棄</td></tr>
<tr><td><strong>鯨魚（大魚）</strong></td><td>約 55–80 / 很低且忽高忽低</td><td>尺度怪、常溜入、什麼都跟</td><td>坐他左邊、用較大尺度隔離加注（Iso-raise）、打直白的價值牌；保持友善，不要嘲笑他的打法</td></tr>
<tr><td><strong>Reg（常客）</strong></td><td>約 22–28 / 18–24</td><td>多桌、樣本大、各項接近合理區間</td><td>找他「偏離合理區間」的那一兩個數字下手；整桌都是 Reg 時考慮換桌</td></tr>
</tbody></table>
<div class="callout pro"><b>進階補充</b>① <strong>數據會被對局組合污染</strong>：常客對魚、常客對常客的打法不同，同一個 Reg 的數字其實混了兩種策略；部分軟體可以排除特定對局再統計。② <strong>要拆開看</strong>：3-Bet、C-Bet、Fold to 3-Bet 都應分成有位置 / 沒位置、單一加注底池 / 3-Bet 底池，整體數字只是平均。③ <strong>大眾池（Population）傾向</strong>：個人樣本不夠時，用整個級別玩家的平均傾向當預設讀牌，例如低級別普遍「河牌加注詐唬不足」。</div>

<h3>5. 樣本數：幾手之後數字才可信？</h3>
<p>關鍵觀念：可信度取決於該動作的<strong>機會次數</strong>，而不是總手數。每一手都有機會 VPIP，但 3-Bet 要先有人開池才有機會，攤牌類數據更要先看到翻牌。</p>
<table class="tbl"><thead><tr><th>數據</th><th>大致可信的手數（參考 Upswing）</th><th>原因</th></tr></thead><tbody>
<tr><td>VPIP / PFR</td><td>約 300 手（極端值 50 手內就看得出來）</td><td>每一手都是一次機會</td></tr>
<tr><td>3-Bet%</td><td>約 1,000 手</td><td>要先有人開池才有機會</td></tr>
<tr><td>Fold to 3-Bet</td><td>約 1,500 手</td><td>要他開池、又剛好被 3-Bet</td></tr>
<tr><td>C-Bet / Fold to C-Bet</td><td>數千手</td><td>還要拆位置與底池類型</td></tr>
<tr><td>WTSD / W$SD / WWSF</td><td>約 8,000 手以上</td><td>只有少數手牌看到翻牌，攤牌更少</td></tr>
</tbody></table>
<div class="formula">95% 信賴區間 ≈ p ± 1.96 × √（p × (1 − p) ÷ n）</div>
<div class="callout example"><b>例題：100 手的 25% 有多不準？</b>VPIP 顯示 25%：樣本 100 手 → 真實值大約落在 <strong>16.5%–33.5%</strong>；300 手 → <strong>20.1%–29.9%</strong>；1,000 手 → <strong>22.3%–27.7%</strong>。3-Bet 顯示 8% 但只有 100 次機會 → 真實值可能在 <strong>2.7%–13.3%</strong>，從「超緊」到「超凶」都有可能！</div>
<div class="callout warn"><b>常見錯誤</b>看到對手 Fold to C-Bet 100%（其實只有 3 次機會）就每手 C-Bet 詐唬，這是被雜訊騙了。小樣本只拿來「粗分類」（鬆 / 緊、凶 / 被動），細部剝削要等樣本夠大。</div>

<h3>6. 牌例：用 HUD 決定要不要 3-Bet 詐唬</h3>
<div class="hh">
<div class="hh-title">牌例：BTN 拿 A5 同花，面對「怕 3-Bet」的 CO</div>
<div class="hh-row"><span class="hh-street">數據</span>CO 的 HUD：VPIP 26 / PFR 22、Fold to 3-Bet 68%（樣本約 6,000 手，開池後被 3-Bet 約 130 次）。</div>
<div class="hh-row"><span class="hh-street">翻前</span>有效籌碼 100bb，CO 開 2.5bb，你在 BTN 拿 <span class="cards">As5s</span>，3-Bet 到 7.5bb。</div>
<div class="hh-row"><span class="hh-street">計算</span>底池原有 0.5 + 1 + 2.5 = 4bb。你冒險 7.5bb 去贏 4bb，純詐唬的損益兩平棄牌率 = 7.5 ÷（7.5 + 4）≈ 65.2%。假設盲注都棄牌，就算他沒棄牌時你一律放棄（等於輸 7.5bb），EV = 0.68 × 4 − 0.32 × 7.5 = +0.32bb，已經賺錢；何況 A5s 被跟注後還有同花、順子的權益。</div>
<div class="hh-row"><span class="hh-street">對照</span>如果 CO 的 Fold to 3-Bet 只有 35%：0.35 × 4 − 0.65 × 7.5 ≈ −3.5bb，純詐唬大虧。這時改成線性價值 3-Bet（<span class="hand">QQ+</span>、<span class="hand">AK</span>、<span class="hand">AQs</span> 等），A5s 改平跟或棄牌。</div>
<div class="hh-row result"><span class="hh-street">重點</span>HUD 不是用來猜「他這手拿什麼」，而是調整「你整個範圍的頻率」：對手棄太多 → 多詐唬；對手跟太多 → 少詐唬、多價值。</div>
</div>

<h3>7. 下一步</h3>
<p>先複習 <a href="#/learn/exploit">GTO 與剝削打法</a>，理解「以 GTO 為盾、剝削為矛」；再回頭看 <a href="#/learn/range-thinking">範圍思維</a>，練習把 HUD 數字翻譯成對手範圍。現場沒有 HUD 時，改用 <a href="#/learn/live-tells">現場馬腳與線上時間馬腳</a> 收集資訊；想把讀人能力變成收益，接著學 <a href="#/learn/game-selection">選桌、時段與實戰習慣</a> 與 <a href="#/learn/hand-review">如何覆盤與追蹤數據</a>。學完到 <a href="#/quiz/theory?topic=player-types">本課測驗</a> 檢查理解，也可以逛 <a href="#/wiki/leaks">常見漏洞</a> 對照自己是哪一型。</p>
`,
  sources: [
    { title: 'Upswing Poker — What is a HUD & What Stats Should You Include?', url: 'https://upswingpoker.com/poker-hud-stats/' },
    { title: 'PokerCoaching — How to Use Poker HUD Stats to Exploit Weak Players', url: 'https://pokercoaching.com/blog/poker-stats/' },
    { title: 'PokerStrategy.com — The Five Player Types', url: 'https://www.pokerstrategy.com/strategy/bss/five-player-types/' },
    { title: 'Upswing Poker — What is AFq in Poker?', url: 'https://upswingpoker.com/glossary/afq/' },
    { title: 'BlackRain79 — What is a Good WTSD in Poker?', url: 'https://www.blackrain79.com/2019/10/what-is-good-wtsd-in-poker.html' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'player-types-01', topic: 'player-types', lv: 1,
    q: '6 人桌 HUD 顯示某位對手 VPIP 42 / PFR 8，最可能是哪一型玩家？',
    opts: ['被動的跟注站（魚）', '緊凶的常客（TAG）', '只玩大牌的岩石（Nit）', '鬆凶的高手（LAG）'],
    ans: 0,
    exp: 'VPIP 42% 代表玩很多手，但 PFR 只有 8%，兩者差了 34 點，代表他入池大多是溜入或平跟、很少加注，是典型的被動跟注站。TAG 約 18–23 / 15–20，Nit 約 10–15 / 8–12，LAG 的 PFR 會很接近 VPIP。' },
  { id: 'player-types-02', topic: 'player-types', lv: 2,
    q: '對手 WTSD 35%、W$SD 46%，面對他時最好的調整是？',
    opts: ['停止純詐唬，用中等牌也做薄價值下注', '多用三槍詐唬逼他棄牌', '他攤牌常輸，所以他下注時都該加注', '數據正常，不需要任何調整'],
    ans: 0,
    exp: 'WTSD 35% 高於常見的 27–32%，代表他很愛跟到攤牌；W$SD 46% 低於 49–55%，代表他常用弱牌跟到底。這種人不會被詐唬嚇跑，所以要停止純詐唬、加大價值下注的頻率與尺度。他會跟到底，三槍詐唬正好送錢；W$SD 低不代表他下注時是詐唬。' },
  { id: 'player-types-03', topic: 'player-types', lv: 2,
    q: '你只和某位對手打了 100 手，他的 VPIP 顯示 25%。依 95% 信賴區間估算，他的真實 VPIP 大約落在哪個範圍？',
    opts: ['約 16.5%–33.5%', '約 24%–26%', '約 22%–28%', '約 5%–45%'],
    ans: 0,
    exp: '標準誤 = √(0.25 × 0.75 ÷ 100) ≈ 4.33%，95% 信賴區間 ≈ 25% ± 1.96 × 4.33% ≈ 16.5%–33.5%。這說明 100 手的數字只能粗分類；要到 1,000 手左右，區間才會縮到約 22.3%–27.7%。' },
  { id: 'player-types-04', topic: 'player-types', lv: 2,
    q: 'CO 開 2.5bb，你在 BTN 想用 A5 同花純詐唬 3-Bet 到 7.5bb（盲注都會棄牌）。CO 的 Fold to 3-Bet 至少要高於多少，這個 3-Bet 才保證立即獲利？',
    opts: ['約 65%', '約 50%', '約 35%', '約 80%'],
    ans: 0,
    exp: '底池原有 0.5 + 1 + 2.5 = 4bb，你冒險 7.5bb，損益兩平棄牌率 = 7.5 ÷（7.5 + 4）≈ 65.2%。對手棄牌率高於這個數字，即使沒棄牌時你一律放棄也賺錢；A5s 被跟注後還有權益，實際門檻更低。' },
  { id: 'player-types-05', topic: 'player-types', lv: 3,
    q: '下列哪一個 HUD 數據，需要最多手牌才能可靠解讀？',
    opts: ['WTSD（攤牌率）', 'VPIP（主動入池率）', 'PFR（翻前加注率）', '3-Bet%'],
    ans: 0,
    exp: '可信度取決於「機會次數」。每一手都是 VPIP / PFR 的機會（約 300 手可信）；3-Bet 要有人先開池（約 1,000 手）；WTSD 要先看到翻牌才算一次機會，通常要 8,000 手以上才可靠。' },
  { id: 'player-types-06', topic: 'player-types', lv: 1,
    q: '面對 VPIP 12 / PFR 9、3-Bet 只有 2% 的岩石（Nit），哪個做法最合理？',
    opts: ['他在盲注時多偷盲，他 3-Bet 時邊緣牌直接棄牌', '他 3-Bet 時用 AJo 4-Bet 詐唬反擊', '他翻後下大注時一律抓詐', '對他溜入，等翻牌再說'],
    ans: 0,
    exp: 'Nit 只玩大牌，偷盲時他大多會棄牌，所以多偷他的盲注；反過來，他 3-Bet 只有 2%，範圍幾乎都是 QQ+、AK，邊緣牌該直接棄。對他 4-Bet 詐唬或翻後大注抓詐，都是把錢送給他的強牌。' }
);

// ===========================================================================
// 2. 現場馬腳與線上時間馬腳
// ===========================================================================
GTO.THEORY.push({
  id: 'live-tells',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: '現場馬腳與線上時間馬腳',
  icon: '👀',
  level: 2,
  minutes: 12,
  tldr: '馬腳只是輔助：先用範圍與數學算門檻，再和對手的「基準線」比較，只在五五波的決策裡讓可靠的馬腳當決勝球。',
  plain: '馬腳就像天氣預報的「降雨機率」：看到烏雲（對手手抖、秒跟），下雨的機率變高，但不保證一定下雨。而且每個人的「正常天氣」不同，有人天生手抖、話多，所以要先知道他平常的樣子，才看得出今天哪裡不一樣。',
  summary: '整理現場與線上最常見的馬腳：哪些較可靠、哪些是迷思，下注時間與尺度透露什麼，手抖、盯牌、籌碼動作、說話代表什麼，以及如何用固定節奏隱藏自己的馬腳。核心原則：範圍與數學是主體，馬腳只是輔助。',
  keyPoints: [
    '馬腳只是調味料：先用範圍與底池賠率算出門檻，只有在接近損益兩平的「五五波」決策裡，才讓可靠的馬腳當決勝球。',
    '一定要先建立基準線（Baseline）：同一個動作對不同人意義不同，只有「偏離他平常的樣子」才有資訊量；休閒玩家的馬腳遠比職業玩家可靠。',
    '較可靠的現場模式：秒跟＝中等牌；下大注前猶豫＝偏強；等待行動時的防禦動作＝偏弱；下注後說弱牌話或挑釁＝偏強。',
    '線上時間馬腳：秒過牌常是預選放棄、長考後過牌多半偏弱、長考後加注在低級別多半很強；但多桌玩家的時間常與牌力無關。',
    '保護自己比讀別人更實用：每個決定固定數 3 秒、看牌只看一次、籌碼一次推出、少說話，讓對手讀不到東西。'
  ],
  html: `
<h3>1. 先擺正位置：範圍與數學是主菜，馬腳是調味料</h3>
<p>馬腳（Tell）是對手在行為、說話或行動時間上無意間透露的牌力線索。電影裡「一摸耳朵就是詐唬」的橋段很誇張；真實牌桌上，馬腳只會讓某些牌的<strong>機率</strong>變高或變低。</p>
<div class="callout plain"><b>白話解釋</b>想像你在猜同學考得好不好：他一直擦汗，可能是沒準備，也可能只是天氣熱。如果你知道他平常就很會流汗，擦汗就沒什麼意義；如果他平常很冷靜、今天卻狂擦汗，這才是值得注意的「偏離」。</div>
<ol class="steps">
<li><b>先算門檻</b>用底池賠率算出跟注需要的勝率（或詐唬需要的棄牌率）。</li>
<li><b>再看範圍</b>依前面每條街的行動，估計對手範圍裡價值牌與詐唬牌的比例。</li>
<li><b>比對基準線</b>這個人平常怎麼下注、說不說話、手會不會抖？今天哪裡不一樣？</li>
<li><b>最後才用馬腳</b>只有範圍分析結果「接近門檻」時，才讓馬腳把天平推向跟注或棄牌。</li>
</ol>
<p>知名撲克馬腳作家 Zachary Elwood 也強調：馬腳是「蛋糕上的糖霜」，對大多數玩家來說，花時間學基本策略的回報遠高於研究馬腳；不少職業牌手只在接近五五波的決策裡，拿一點行為線索來做最後決定。</p>

<h3>2. 可靠 vs 不可靠：哪些馬腳值得參考？</h3>
<table class="tbl"><thead><tr><th>行為（多觀察休閒玩家）</th><th>常見意義</th><th>為什麼</th></tr></thead><tbody>
<tr><td>你伸手拿籌碼準備下注時，他也立刻作勢要跟</td><td>偏弱</td><td>拿強牌的人不會阻止你下注；這種防禦動作多半是下意識，很少是演的</td></tr>
<tr><td>下大注前停頓、動作斷斷續續，或先喊「加注」再慢慢決定數字</td><td>偏強</td><td>詐唬者不想被盯太久，通常動作俐落；拿強牌的人反而會「演」猶豫</td></tr>
<tr><td>秒跟（尤其翻前、翻牌的小注）</td><td>中等牌</td><td>秒跟代表他已排除加注，強牌通常至少會考慮一下加注；很多人秒跟 3-Bet / 4-Bet 常是 <span class="hand">JJ</span>、<span class="hand">QQ</span></td></tr>
<tr><td>下注時說弱牌話（「我只是聽牌啦」）或挑釁（「我知道你會棄」）</td><td>偏強</td><td>詐唬者怕激起你的跟注反射，不敢亂講話</td></tr>
<tr><td>過牌或等待時反覆看底牌</td><td>偏弱</td><td>拿到強牌通常看一眼就記住；下大注之後才回頭看牌，反而代表放鬆、偏強</td></tr>
<tr><td>看完翻牌立刻瞄自己的籌碼</td><td>偏強</td><td>下意識在盤算「要下多少」</td></tr>
</tbody></table>
<div class="callout example"><b>例題：休閒玩家秒跟你的 3-Bet，翻牌怎麼打？</b>你在 BTN 3-Bet，對手幾乎不假思索就跟注。依常見模式，他的範圍會偏向「太強不想棄、又不夠強去 4-Bet」的 <span class="hand">JJ</span>、<span class="hand">QQ</span>、<span class="hand">TT</span> 與 <span class="hand">AQs</span> 這類牌。<br>
• 翻牌 <span class="cards">Ah8c3d</span> 或 <span class="cards">Kd7s2c</span>：他大量的中高對子變成「低於公牌的對子」，你的 C-Bet 會拿到很多棄牌，可以更積極下注。<br>
• 翻牌 <span class="cards">8h6c2d</span>：他的 <span class="hand">TT</span>–<span class="hand">QQ</span> 都是超對，對你的詐唬很不利，空氣牌應該放慢。<br>
這就是馬腳的正確用法：不是猜「他就是 QQ」，而是把他的<strong>範圍</strong>往某個方向調整，再決定整體策略。</div>
<div class="callout warn"><b>常見錯誤</b>① <strong>相信電影迷思</strong>：「不敢看你＝詐唬」常常相反，休閒玩家拿強牌時反而會把目光移開，怕把你嚇跑。② <strong>忽略基準線</strong>：有人天生手抖、話多、動作慢，這些對他來說都是「正常天氣」。③ <strong>讀高手</strong>：常客與職業玩家會刻意保持一致，甚至反向表演（Reverse Tell），對他們最好別依賴馬腳。④ <strong>用馬腳推翻數學</strong>：範圍分析明顯該棄時，再強烈的感覺都不該硬跟。</div>

<h3>3. 下注時間與尺度馬腳（現場）</h3>
<table class="tbl"><thead><tr><th>情境</th><th>常見意義</th><th>例外與提醒</th></tr></thead><tbody>
<tr><td>長時間思考後過牌</td><td>多半偏弱，想讓你以為他在設陷阱</td><td>對「會慢打」的對手要小心</td></tr>
<tr><td>長時間思考後下注或加注</td><td>低級別多半很強</td><td>好的常客會平衡思考時間</td></tr>
<tr><td>河牌突然下很小的注（擋注 Blocker Bet）</td><td>常是中等牌，想便宜看攤牌</td><td>可以考慮用強牌加注拿價值</td></tr>
<tr><td>休閒玩家河牌下大注、超池或過牌加注</td><td>多半是強牌（低級別普遍詐唬不足）</td><td>對瘋子型例外</td></tr>
<tr><td>大面額籌碼、整數下注 vs 很精確的奇怪數字</td><td>有些人強牌時下整數想引誘跟注、想讓你棄牌時下精確數字</td><td>因人而異，必須累積觀察</td></tr>
</tbody></table>
<p>尺度馬腳最好「個人化」累積：每次攤牌都記下他用什麼尺度打什麼牌，例如「價值牌都下 2/3 池、詐唬都下滿池」。同樣的模式出現三、四次，就是一條比任何通用規則都準的讀牌筆記。</p>

<h3>4. 身體與說話馬腳：手抖、盯人、籌碼動作、坐姿</h3>
<ul>
<li><strong>手抖</strong>：多數人以為是緊張詐唬，但經典觀點（Mike Caro）認為下注時手抖常是拿到大牌、腎上腺素上升；平常就會抖的人除外。</li>
<li><strong>下注後一直盯著你</strong>：休閒玩家常用這招「裝強」，偏詐唬；拿強牌的人比較會看別處、讓你放鬆。</li>
<li><strong>看底牌太久</strong>：拿到 <span class="hand">AA</span> 多半看一眼就不看了，盯著研究很久的常是邊緣牌。</li>
<li><strong>籌碼動作</strong>：用力甩籌碼、把籌碼濺進底池（Splash）多半是想嚇你，偏弱；平順、從容地推出籌碼較常是強牌。</li>
<li><strong>坐姿與距離</strong>：看到翻牌後身體前傾、突然坐直＝有興趣；往後靠＝沒興趣。</li>
<li><strong>說話</strong>：「強代表弱、弱代表強」只是粗略規則，關鍵仍是和他平常的說話習慣比較。</li>
</ul>
<p>怎麼建立一位對手的基準線？四個簡單方法：</p>
<ul>
<li><strong>先看他沒事時的樣子</strong>：棄牌、聊天、喝飲料時的坐姿、手的位置與說話量，就是他的「正常值」。</li>
<li><strong>每次攤牌都對答案</strong>：記下他拿強牌與詐唬被抓時，下注速度、眼神、籌碼動作有什麼不同。</li>
<li><strong>一次只盯一個人</strong>：同時觀察全桌什麼都記不住，先鎖定最常和你對戰的休閒玩家。</li>
<li><strong>在小級別驗證</strong>：把讀牌結果寫下來，事後檢查命中率，命中率不高的「感覺」就別再用。</li>
</ul>
<div class="callout tip"><b>實戰小技巧</b>注意哪些人會在輪到自己之前就先看牌：他們看牌當下的反應（瞄籌碼、坐直、立刻失去興趣）會提早洩漏資訊。你自己則反過來：等輪到你再看牌，前面的時間拿來觀察別人，既不洩漏、又多收集情報。</div>

<h3>5. 線上時間馬腳：沒有臉，但有時間</h3>
<table class="tbl"><thead><tr><th>線上動作</th><th>常見意義</th><th>例外</th></tr></thead><tbody>
<tr><td>秒過牌</td><td>常是預選了「過牌 / 棄牌」按鈕，偏弱或放棄</td><td>少數人會固定用預選鍵隱藏節奏</td></tr>
<tr><td>秒 C-Bet（翻牌或轉牌自動下注）</td><td>常是中等牌或整個範圍都下的習慣</td><td>大量多桌的常客常自動 C-Bet，可多加注或漂浮</td></tr>
<tr><td>秒跟（翻前或翻後）</td><td>已排除加注，常是中對、聽牌、弱踢腳頂對</td><td>河牌秒跟偶爾是興奮的休閒玩家</td></tr>
<tr><td>長考後過牌</td><td>多半弱，希望你也過牌</td><td>網路延遲、離開座位</td></tr>
<tr><td>長考後下注 / 加注</td><td>低級別多半很強</td><td>同時開 12 桌以上的人可能只是在處理別桌</td></tr>
</tbody></table>
<div class="callout pro"><b>進階補充</b>線上時間馬腳的可信度取決於對手開幾桌：大量多桌的常客常用固定節奏或預選鍵行動，時間幾乎不帶資訊；只開一兩桌的休閒玩家，節奏變化才比較有意義。建議用 HUD 的筆記功能記下「某人長考後加注＝堅果」這類個人化模式，累積的比通用規則更準。</div>

<h3>6. 牌例：數學先行，馬腳決勝</h3>
<div class="hh">
<div class="hh-title">牌例：現場遊戲，河牌同花完成，你拿頂對頂踢腳</div>
<div class="hh-row"><span class="hh-street">背景</span>對手是休閒玩家，你觀察了 1 小時：他平常下注動作隨意、會和鄰座聊天、下注後不太看人。有效籌碼 100bb（以 bb 表示方便計算）。</div>
<div class="hh-row"><span class="hh-street">翻前</span>他在 HJ 開 2.5bb，你在 BTN 拿 <span class="cards">AdQc</span> 跟注，盲注棄牌，底池 6.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Qs9s4d</span>，他下注 3bb，你跟注，底池 12.5bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2c</span>，他下注 7bb，你跟注，底池 26.5bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">3s</span>（同花完成），他下注 13bb。你跟注需要的勝率 = 13 ÷（26.5 + 13 + 13）≈ 24.8%。他的範圍有同花、兩對、也有沒中的聽牌，估計詐唬比例接近門檻，是典型的五五波。</div>
<div class="hh-row"><span class="hh-street">情境 A</span>他下注前停頓好幾秒，先喊「下注」才慢慢數籌碼，下注後還回頭看了一次底牌 → 都是「放鬆、偏強」的訊號 → 棄牌。</div>
<div class="hh-row"><span class="hh-street">情境 B</span>他秒下注、用力把籌碼甩進底池，之後一直盯著你 → 對平常不盯人的他來說是明顯偏離，像在「裝強」→ 跟注。</div>
<div class="hh-row result"><span class="hh-street">重點</span>先用數學算出 24.8% 的門檻、再用範圍判斷接近門檻，最後才讓馬腳決勝。如果對手是從不詐唬的 Nit，範圍已經遠低於門檻，任何馬腳都不該讓你硬跟。</div>
</div>

<h3>7. 隱藏自己的馬腳，並接著學什麼</h3>
<ol class="steps">
<li><b>固定節奏</b>輪到你時，不論秒棄 72o 還是拿堅果，都在心裡數到 3 再行動。</li>
<li><b>看牌一次</b>發牌時看清楚並記住，不要反覆偷看。</li>
<li><b>固定動作</b>手放在固定位置，籌碼一次平順推出，或直接口頭宣告數字。</li>
<li><b>少說話</b>大底池裡保持沉默或只說固定的客套話，不解釋、不挑釁。</li>
<li><b>線上也一樣</b>少用預選鍵，重要決定用差不多的時間完成。</li>
</ol>
<p>下一步：把馬腳和數據結合，回到 <a href="#/learn/player-types">玩家類型與 HUD 數據</a>；馬腳會被情緒放大，記得讀 <a href="#/learn/mental-game">撲克心理學</a>；河牌抓詐的數學基礎在 <a href="#/learn/mdf-alpha">MDF 與 Alpha</a> 與 <a href="#/learn/turn-river">轉牌與河牌</a>。最後到 <a href="#/quiz/theory?topic=live-tells">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'Upswing Poker — 7 Poker Tells You Should Look Out For（Zachary Elwood）', url: 'https://upswingpoker.com/poker-tells-live-common-list/' },
    { title: 'Upswing Poker — Does Studying Poker Tells Make You a Worse Overall Player?', url: 'https://upswingpoker.com/studying-poker-tells/' },
    { title: 'PokerNews — Breaking Down The Most Important Tells & Live Reads in Poker', url: 'https://www.pokernews.com/news/2025/11/breaking-down-poker-live-reads-and-tells-49735.htm' },
    { title: 'PokerCoaching — How to Read Poker Tells in Live Poker: 7 Reliable Examples', url: 'https://pokercoaching.com/blog/live-poker-tells/' },
    { title: 'BlackRain79 — Poker Timing Tells and Betting Patterns', url: 'https://www.blackrain79.com/2014/10/online-poker-timing-tells-and-betting.html' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'live-tells-01', topic: 'live-tells', lv: 1,
    q: '現場一位休閒玩家面對你的翻牌 C-Bet「秒跟」，依常見模式，他最可能拿什麼牌？',
    opts: ['中等牌，例如中對子或聽牌（他已排除加注）', '堅果牌，他想慢打陷阱', '完全空氣，準備河牌詐唬', '秒跟沒有任何資訊量'],
    ans: 0,
    exp: '秒跟代表他在你下注前就決定「跟但不加注」。拿強牌的人通常至少會考慮加注、拿空氣通常會棄牌，所以秒跟最常是中對、聽牌、弱踢腳頂對這類中等牌。這是機率傾向而非保證，但比「沒有資訊」更接近事實。' },
  { id: 'live-tells-02', topic: 'live-tells', lv: 2,
    q: '你在河牌伸手拿籌碼準備下注時，還沒輪到的對手也立刻伸手作勢要跟。這個防禦性動作最常代表？',
    opts: ['他偏弱，想阻止你下注', '他拿堅果，迫不及待想跟', '他想騙你過牌，好讓他詐唬', '只是習慣動作，任何人都一樣'],
    ans: 0,
    exp: '拿強牌的人最希望你下注，不會做出讓你縮手的動作；作勢要跟是下意識想「勸退」你下注，通常代表中等或偏弱的牌。這類防禦動作很少是演出來的，因此在馬腳中算較可靠的一種（仍要對照他的基準線）。' },
  { id: 'live-tells-03', topic: 'live-tells', lv: 2,
    q: '線上低級別桌，一位只開一桌的對手在河牌長考了 20 秒後加注。依常見的時間馬腳，最合理的解讀是？',
    opts: ['多半是很強的牌', '多半是詐唬，因為他想很久', '多半是中等牌想保護', '時間馬腳在線上完全無效'],
    ans: 0,
    exp: '低級別的玩家普遍偏被動、詐唬不足，長考後加注常是強牌在「演」掙扎。若對手同時開十幾桌，長考可能只是在處理別桌，可信度就會大降；只開一桌的玩家，節奏變化才比較有意義。' },
  { id: 'live-tells-04', topic: 'live-tells', lv: 2,
    q: '河牌底池 26.5bb，對手下注 13bb。你拿一對抓詐，跟注至少需要多少勝率？',
    opts: ['約 24.8%', '約 33.3%', '約 49.1%', '約 19.7%'],
    ans: 0,
    exp: '必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）= 13 ÷（26.5 + 13 + 13）= 13 ÷ 52.5 ≈ 24.8%。先算出這個門檻，才知道馬腳只需要把天平推多少。' },
  { id: 'live-tells-05', topic: 'live-tells', lv: 3,
    q: '對手是幾乎從不詐唬的岩石（Nit），河牌下大注後一直盯著你、手還微微發抖。你只有一對，範圍分析顯示他的詐唬比例遠低於跟注門檻。最佳做法是？',
    opts: ['棄牌：範圍分析遠低於門檻時，不該讓馬腳推翻數學', '跟注：盯人代表他在裝強', '加注：手抖代表他很緊張', '跟注：馬腳永遠比數學可靠'],
    ans: 0,
    exp: '馬腳只在接近損益兩平的決策中當決勝球。Nit 的大注範圍本來就以價值牌為主，而且下注時手抖也常是拿到大牌、腎上腺素上升的表現，不能當成詐唬證據。範圍明顯低於門檻時，應該棄牌。' },
  { id: 'live-tells-06', topic: 'live-tells', lv: 1,
    q: '下列哪一個習慣最能隱藏自己的馬腳？',
    opts: ['不論牌力強弱，每個決定都固定數到 3 再行動', '拿強牌時秒跟，拿弱牌時長考', '詐唬時一直盯著對手看', '每次都反覆確認底牌，避免看錯'],
    ans: 0,
    exp: '馬腳來自「行為隨牌力改變」。固定節奏讓強牌、弱牌看起來一模一樣，對手就讀不到資訊。牌力不同、速度不同，正是最常見的時間馬腳；盯人與反覆看牌也是常被讀到的模式。' }
);

// ===========================================================================
// 3. 撲克心理學：Tilt、A-Game 與決策品質
// ===========================================================================
GTO.THEORY.push({
  id: 'mental-game',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: '撲克心理學：Tilt、A-Game 與決策品質',
  icon: '🧘',
  level: 2,
  minutes: 14,
  tldr: 'Tilt 是情緒綁架決策：認出 Tilt 類型、用數字理解變異數、用決策品質取代輸贏，再用停損保護 A-Game。',
  plain: 'Tilt 就像開車時的路怒：被人超車後開始飆車、亂按喇叭。車還是同一台（你的技術沒變），但方向盤被情緒搶走了。好駕駛不是從不生氣，而是知道自己快爆了就靠邊停車。',
  summary: '拆解 Jared Tendler 的七種 Tilt 與 A / B / C-Game、毛毛蟲（Inchworm）理論，用模擬數字說明 5bb/100 贏家也會遇到的長期下風，區分結果導向與決策品質，並提供暖身、收心、停損與睡眠的實戰流程。',
  keyPoints: [
    'Tilt 不只一種：運氣差、不公平、討厭輸、犯錯、自以為是、報復、絕望，各有不同根源，要對症下藥。',
    '毛毛蟲理論：進步最快的方法通常是把 C-Game 往上拉，少犯最糟的錯，比學新招更快提升勝率。',
    '變異數很大：5bb/100、標準差 100bb/100 的贏家打 1 萬手仍有約 31% 機率虧損；打 10 萬手約六成機率遇到 20 個買入以上的下風期。',
    '用決策品質評分而不是輸贏：AA 對 KK 全下約 82% 會贏，輸掉那 18% 不代表打錯。',
    '開打前寫好停損（例如輸 3 個買入或出現 2 個 Tilt 訊號就離桌），睡眠不足、喝酒時不要打牌。'
  ],
  html: `
<h3>1. Tilt 是什麼？不只是「生氣」</h3>
<p>Tilt（情緒失控、上頭）指的是：情緒讓你偏離自己平常的正確打法。它不一定是暴怒，也可能是害怕、焦慮、不耐煩，甚至是贏太多之後的自大。</p>
<div class="callout plain"><b>白話解釋</b>想想考試時前一題寫錯，越想越氣，結果後面會寫的題目也開始粗心。Tilt 不是因為你不會，而是情緒佔掉了思考的空間；牌桌上的「後面幾題」，就是你接下來打的每一手牌。</div>
<table class="tbl"><thead><tr><th>Tilt 訊號</th><th>你可能會注意到</th></tr></thead><tbody>
<tr><td>身體</td><td>心跳加快、臉發熱、呼吸變淺、肩膀緊繃</td></tr>
<tr><td>想法</td><td>「怎麼又是我」「這次一定要贏回來」「我要電爆他」</td></tr>
<tr><td>行動</td><td>玩更多手、不甘心跟到河牌、下注越來越大、想升級翻本、開始打字罵人</td></tr>
</tbody></table>
<div class="callout key"><b>重點：Tilt 急救三步驟</b>① <strong>認出</strong>：上表任兩個訊號同時出現，就是警報。② <strong>暫停</strong>：這手打完就坐出（Sit Out），起身喝水、深呼吸 1 分鐘。③ <strong>判斷</strong>：默念事先準備好的修正句（例如「我只能控制決策，不能控制發牌」），平靜了再回來；做不到就照停損規則收工。</div>

<h3>2. 七種 Tilt：先找出你是哪一種</h3>
<p>心理教練 Jared Tendler 在《The Mental Game of Poker》中把 Tilt 拆成七種。原因不同，解法也不同；只會說「冷靜點」通常沒用。</p>
<table class="tbl"><thead><tr><th>類型</th><th>腦中的聲音</th><th>根源</th><th>對策</th></tr></thead><tbody>
<tr><td><strong>運氣差</strong></td><td>「連輸五天，怎麼可能！」</td><td>多種 Tilt 短時間內累積，前一天的怒氣沒清掉</td><td>每天收心；用數字確認下風期是否在正常範圍</td></tr>
<tr><td><strong>不公平</strong></td><td>「魚每次都中，這不公平！」</td><td>只記得壞運、忘記好運，對變異數的期待錯誤</td><td>學習變異數；看全下期望值（All-in EV）了解真實運氣</td></tr>
<tr><td><strong>討厭輸</strong></td><td>「我絕對不能輸！」</td><td>好勝心強，卻用短期輸贏衡量自己</td><td>把好勝心轉向可控指標：決策品質、學習量、情緒控制</td></tr>
<tr><td><strong>犯錯</strong></td><td>「這手我明明知道，怎麼打這麼爛！」</td><td>完美主義</td><td>把錯誤寫進筆記，當成下一次進步的素材</td></tr>
<tr><td><strong>自以為是</strong></td><td>「我比他強那麼多，憑什麼輸？」</td><td>覺得技術好就「應該」贏</td><td>接受撲克短期由運氣主導，弱者每天都會贏</td></tr>
<tr><td><strong>報復</strong></td><td>「我一定要搞死這個人！」</td><td>把對手當敵人，想討回公道</td><td>一感覺到針對某人，就休息或換桌</td></tr>
<tr><td><strong>絕望</strong></td><td>「今天沒贏回來就不走！」</td><td>前面幾種累積到崩潰，最具破壞力</td><td>觸發硬性停損，立刻離桌</td></tr>
</tbody></table>
<p>下風期其實是一面照妖鏡：把當下腦中冒出的那句話原封不動寫下來，再對照上表，就能看出自己真正的 Tilt 類型，例如「我永遠贏不了翻硬幣」屬於不公平 Tilt，「這手我怎麼會打成這樣」屬於犯錯 Tilt。</p>
<div class="callout warn"><b>常見錯誤</b>① 輸了就延長時間想「贏回來」，結果用 C-Game 打最久。② 輸錢後升級想一次翻本，資金風險暴增。③ 一邊喝酒一邊打牌。④ 以為讀懂變異數就不會有情緒：情緒一定會出現，重點是它出現時你有沒有準備好的應對方式。</div>

<h3>3. A / B / C-Game 與毛毛蟲理論</h3>
<table class="tbl"><thead><tr><th>狀態</th><th>特徵</th><th>例子</th></tr></thead><tbody>
<tr><td><strong>A-Game</strong></td><td>專注、決策流暢，會想對手範圍與類型</td><td>冷靜算出河牌抓詐門檻，再依對手傾向微調</td></tr>
<tr><td><strong>B-Game</strong></td><td>有點累或分心，大多正確但比較機械</td><td>照範圍表打，但少了針對對手的調整</td></tr>
<tr><td><strong>C-Game</strong></td><td>情緒或疲勞主導，犯平常不會犯的錯</td><td>不甘心跟到底、報復性 3-Bet、玩太多垃圾牌</td></tr>
</tbody></table>
<p>Tendler 用<strong>毛毛蟲（Inchworm）</strong>比喻進步：前腳是你的 A-Game，後腳是你的 C-Game。學新觀念讓前腳往前伸；修正最糟的錯誤讓後腳跟上。只伸前腳、後腳不動，你的表現只會越來越不穩定。</p>
<p>實作方法：寫下「我的 C-Game 長什麼樣子」，例如「被 3-Bet 三次後開始亂 4-Bet」「連輸兩個大底池後翻前範圍變鬆」。清單越具體，下次越早認得出來；每個月檢查一次，劃掉已經不再發生的項目，就是後腳往前移的證據。</p>
<div class="callout example"><b>例題：把 C-Game 拉上來有多值錢？</b>假設你的 A-Game 每百手 +8bb、B-Game +3bb、C-Game −15bb，時間比例 50% / 30% / 20%：<br>
整體勝率 = 0.5 × 8 + 0.3 × 3 + 0.2 ×（−15）= 4 + 0.9 − 3 = <strong>+1.9bb/100</strong>。<br>
只要把 C-Game 時間降到 5%（多出來的 15% 變成 B-Game）：0.5 × 8 + 0.45 × 3 + 0.05 ×（−15）= <strong>+4.6bb/100</strong>。<br>
勝率翻了一倍多，而且你沒有學任何新技術。（數字為示意，重點是比例。）</div>

<h3>4. 變異數與下風期：用數字看清運氣有多大</h3>
<div class="formula">N 手後的期望值 = 勝率（bb/100）× N ÷ 100；標準差 = SD（bb/100）× √（N ÷ 100）</div>
<p>6-max 無限注現金桌每百手的標準差（SD）大約在 80–100bb 之間。以勝率 +5bb/100、SD 100bb/100 的穩定贏家為例：</p>
<table class="tbl"><thead><tr><th>樣本</th><th>期望獲利</th><th>1 個標準差</th><th>結束時仍虧損的機率</th></tr></thead><tbody>
<tr><td>10,000 手</td><td>+500bb（5 個買入）</td><td>±1,000bb</td><td>約 31%</td></tr>
<tr><td>50,000 手</td><td>+2,500bb</td><td>±2,236bb</td><td>約 13%</td></tr>
<tr><td>100,000 手</td><td>+5,000bb</td><td>±3,162bb</td><td>約 5.7%</td></tr>
</tbody></table>
<p>注意第一列：真實勝率是正的，打了 1 萬手卻有將近三分之一的機會在輸錢；就算打到 10 萬手，95% 的結果也會落在約 −1,200bb 到 +11,200bb 這麼寬的區間。所以不能用幾千手的輸贏，判斷自己或某個打法的好壞。</p>
<p>再看「下風期（Downswing）」：從最高點往下跌的最大幅度。以下是用電腦模擬 20,000 位贏家各打 100,000 手的結果：</p>
<table class="tbl"><thead><tr><th>100,000 手內</th><th>SD 100bb/100</th><th>SD 80bb/100</th></tr></thead><tbody>
<tr><td>最大下風期（中位數）</td><td>約 2,200bb（22 個買入）</td><td>約 1,600bb（16 個買入）</td></tr>
<tr><td>至少一次 ≥ 20 個買入的下風期</td><td>約 61%</td><td>約 27%</td></tr>
<tr><td>至少一次 ≥ 30 個買入的下風期</td><td>約 20%</td><td>約 5%</td></tr>
<tr><td>最長「沒創新高」期間（中位數）</td><td>約 30,000 手</td><td>約 26,000 手</td></tr>
</tbody></table>
<div class="callout tip"><b>實戰小技巧</b>覺得自己「衰到不正常」時，先把勝率與標準差丟進變異數計算器（例如 PrimeDope），看看這段下風期在統計上有多常見。多數時候答案是：很正常。每週打 5,000 手的贏家，連續 6 週沒創新高都在合理範圍內。</div>

<h3>5. 結果導向 vs 決策品質</h3>
<p>把決策好壞和結果好壞混為一談，叫做<strong>結果導向（Resulting）</strong>。撲克是不完全資訊遊戲，好決策也可能輸、壞決策也可能贏。</p>
<table class="tbl"><thead><tr><th></th><th>結果好</th><th>結果壞</th></tr></thead><tbody>
<tr><td><strong>決策好</strong></td><td>應得的報酬</td><td>壞運（Bad Beat）：繼續這樣打</td></tr>
<tr><td><strong>決策差</strong></td><td>走運：最危險，會強化錯誤</td><td>應得的教訓</td></tr>
</tbody></table>
<div class="compare"><div><h4>✅ 決策導向</h4>「AA 對 KK 全下，我約有 82% 勝率。每次這樣全下 100bb，平均淨賺約 0.82 × 200 − 100 = 64bb，這次只是落進 18%。」</div><div><h4>❌ 結果導向</h4>「又被 KK 中了，早知道就不要全下，AA 根本是爛牌。」</div></div>
<p>想知道自己的運氣到底多差，可以看追蹤軟體的全下期望值（All-in EV）：它把全下後的結果換算成「依當時勝率應得的金額」。如果實際盈虧遠低於 All-in EV，代表你是全下時運氣不好，而不是打錯。</p>

<h3>6. 暖身、收心、停損與健康</h3>
<ol class="steps">
<li><b>開打前 10 分鐘暖身</b>排除干擾（手機收起、上廁所、準備水）→ 複習 1–2 個本週重點 → 深呼吸、提醒自己只能控制決策 → 寫下今天的停損與結束時間。</li>
<li><b>打牌中定時休息</b>每小時起身 5–10 分鐘，不要等到很累才休息。</li>
<li><b>遵守停損</b>例如：單次輸 3 個買入、或出現 2 個以上 Tilt 訊號就離桌；休息 10 分鐘後仍無法平靜就收工。贏錢時也照計畫時間結束，別因為手感好就無限延長，最後在疲勞中把錢吐回去。</li>
<li><b>結束後 5–10 分鐘收心</b>記下情緒高點與觸發事件、標記 3–5 手要覆盤的牌、用決策品質給自己打分，然後關掉軟體去做別的事。</li>
</ol>
<p>睡眠與健康也是技術的一部分：2021 年《Frontiers in Psychiatry》追蹤 23 位線上撲克玩家 28 天，發現睡眠不足時的牌局，情緒性與行為性 Tilt 都較高、打的手數較多、財務結果也較差；喝酒時 Tilt 同樣升高。睡不夠、喝了酒、心情很差的日子，最好的決定就是不上桌。</p>
<div class="callout pro"><b>進階補充：心理手牌紀錄（Mental Hand History）</b>Tendler 建議像覆盤牌局一樣覆盤情緒，分五步寫下來：① 描述問題（什麼觸發、當下想法與身體感覺）② 為什麼這個反應「合理」③ 這個邏輯哪裡有缺陷 ④ 修正後的正確想法 ⑤ 為什麼修正是對的。把第 ④ 步濃縮成一句話（例如「AA 輸給 KK 是 18% 的正常結果，我的決策正確」），情緒上來時默念，就是所謂的「注入邏輯」。</div>
<p>下一步：資金管理與升降級規則在 <a href="#/learn/bankroll-mindset">資金管理、變異數與心態</a>；把收心時標記的手牌拿去 <a href="#/learn/hand-review">如何覆盤與追蹤數據</a>；想避開讓你容易上頭的牌局，看 <a href="#/learn/game-selection">選桌、時段與實戰習慣</a>。最後到 <a href="#/quiz/theory?topic=mental-game">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'PokerStrategy.com — Breaking Down the Seven Types of Tilt（Jared Tendler）', url: 'https://www.pokerstrategy.com/strategy/poker-psychology/breaking-down-7-tilt-types/' },
    { title: 'The Hendon Mob — Mental Game of Poker Excerpt 5: Inchworm', url: 'https://www.thehendonmob.com/jared_tendler/mental_game_of_poker_excerpt_5_inchworm' },
    { title: 'PrimeDope — Cash Game Variance Calculator', url: 'https://www.primedope.com/poker-variance-calculator/' },
    { title: 'Upswing Poker — 3-Step Poker Warm Up Routine That Will Improve Your Results', url: 'https://upswingpoker.com/poker-warm-up-routine/' },
    { title: 'Frontiers in Psychiatry — Sleep or Play Online Poker?: Gambling Behaviors and Tilt Symptoms While Sleep Deprived', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7829254/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'mental-game-01', topic: 'mental-game', lv: 1,
    q: '連輸幾手給一位明顯較弱的玩家後，你心想：「我比他強那麼多，憑什麼一直輸給他？」這最接近哪一種 Tilt？',
    opts: ['自以為是（Entitlement）Tilt', '犯錯（Mistake）Tilt', '報復（Revenge）Tilt', '絕望（Desperation）Tilt'],
    ans: 0,
    exp: '自以為是 Tilt 的核心是「我技術比較好，所以我應該贏」。犯錯 Tilt 是氣自己打錯；報復 Tilt 是想針對某人討回來；絕望 Tilt 是不贏回來不走。解法是接受撲克短期由運氣主導，弱者本來就常常贏。' },
  { id: 'mental-game-02', topic: 'mental-game', lv: 2,
    q: '一位真實勝率 +5bb/100、標準差 100bb/100 的贏家打完 10,000 手，結果仍是虧損的機率大約是多少？',
    opts: ['約 31%', '約 1%', '約 5%', '約 50%'],
    ans: 0,
    exp: '10,000 手 = 100 個「百手」。期望值 = 5 × 100 = +500bb，標準差 = 100 × √100 = 1,000bb。虧損代表低於 0，也就是低於期望值 0.5 個標準差，機率約 31%。所以短期輸贏幾乎說明不了實力。' },
  { id: 'mental-game-03', topic: 'mental-game', lv: 2,
    q: '假設你的 A-Game 每百手 +8bb、B-Game +3bb、C-Game −15bb，時間比例分別是 50% / 30% / 20%。你的整體勝率大約是多少？',
    opts: ['約 +1.9bb/100', '約 +5.3bb/100', '約 −4.0bb/100', '約 +8.0bb/100'],
    ans: 0,
    exp: '0.5 × 8 + 0.3 × 3 + 0.2 ×（−15）= 4 + 0.9 − 3 = +1.9bb/100。若把 C-Game 時間降到 5%（多的 15% 變 B-Game），勝率會升到 +4.6bb/100，這就是毛毛蟲理論強調「把後腳 C-Game 拉上來」的原因。' },
  { id: 'mental-game-04', topic: 'mental-game', lv: 1,
    q: '你翻前用 AA 對上 KK 全下 100bb，結果河牌被追到輸掉。用決策品質的角度，最正確的評價是？',
    opts: ['決策正確：AA 約有 82% 勝率，這次只是落入 18% 的壞結果', '決策錯誤：應該平跟控制底池', '決策錯誤：輸掉就代表打錯', '無法評價：撲克只能看結果'],
    ans: 0,
    exp: 'AA 對 KK 翻前約 82% 勝率，每次這樣全下平均淨賺約 0.82 × 200 − 100 = 64bb。輸掉是變異數，不是決策錯誤。用結果評價決策（Resulting）會讓你放棄正確打法。' },
  { id: 'mental-game-05', topic: 'mental-game', lv: 1,
    q: '下列哪一個是最好的停損做法？',
    opts: ['開打前就寫好：輸 3 個買入或出現 2 個 Tilt 訊號就離桌', '輸了就繼續打，直到贏回來為止', '輸了就升級一次翻本', '不設規則，依當下感覺決定'],
    ans: 0,
    exp: '停損要在頭腦冷靜時事先決定，因為 Tilt 時的判斷力最差。輸了硬撐會讓你用 C-Game 打最久；升級翻本會讓資金風險暴增；憑感覺等於把決定交給情緒。' },
  { id: 'mental-game-06', topic: 'mental-game', lv: 2,
    q: '根據 2021 年追蹤線上撲克玩家睡眠的研究，睡眠不足時的牌局最可能出現什麼情況？',
    opts: ['Tilt 症狀增加、打更多手牌、財務結果較差', '更專注、勝率提升', '打得更緊、變異數變小', '與睡飽時沒有差別'],
    ans: 0,
    exp: '該研究追蹤 23 位線上玩家 28 天，睡眠不足的牌局情緒性與行為性 Tilt 較高、手數較多、結果較差；喝酒時 Tilt 也較高。睡不夠時最好的決定就是不上桌。' }
);

// ===========================================================================
// 4. 錦標賽（MTT）入門
// ===========================================================================
GTO.THEORY.push({
  id: 'mtt-basics',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: '錦標賽（MTT）入門',
  icon: '🎟️',
  level: 2,
  minutes: 14,
  tldr: '錦標賽是盲注會升級、輸光就出局的馬拉松：用 bb 數判斷打法，依階段調整鬆緊，並記得贏來的籌碼不如輸掉的值錢。',
  plain: '現金桌像按時計酬的打工：每個籌碼就是現金，隨時可以補碼或下班。錦標賽像馬拉松：大家繳一樣的報名費、拿一樣的籌碼，比賽會越跑越快（盲注升級），跑不完就淘汰，只有前面約一成多的人拿獎金，而且冠軍拿最多。',
  summary: '從結構（盲注升級、BB Ante、晚報名、重購 / Re-entry）到各階段策略（早期、中期、泡沫、進錢圈、決賽桌），學會用 bb 數思考籌碼深度，理解頭重腳輕的獎金結構與籌碼價值非線性，並用牌例比較籌碼 EV 與泡沫期的差別。',
  keyPoints: [
    '錦標賽與現金桌最大差異：盲注會升級、輸光就出局、籌碼價值非線性；贏來的籌碼價值小於輸掉的籌碼。',
    '有前注時底池變大、偷盲更划算：盲注 0.5 / 1bb 加 1bb 的 BB Ante，翻前底池就有 2.5bb，開 2.2bb 偷盲只需約 46.8% 棄牌率。',
    '永遠用 bb 數看籌碼：60bb 以上接近現金桌；15–25bb 以開池與反推全下為主；約 15bb 以下進入推擠（Push / Fold）。',
    '各階段重點不同：早期穩健累積、中期擴大偷盲、泡沫期大碼施壓中碼收緊、進錢圈後重新積極、決賽桌注意獎金階梯。',
    '典型獎金只發給約 15–20% 的參賽者，前三名約拿走 30–40% 獎金池，所以要為「打進前段」承擔適度風險。'
  ],
  html: `
<h3>1. 錦標賽 vs 現金桌：同一個遊戲，兩種比賽</h3>
<div class="callout plain"><b>白話解釋</b>現金桌的籌碼像銀行存款，100 元就是 100 元；錦標賽（MTT，Multi-Table Tournament）的籌碼比較像比賽積分：積分本身不能花，最後是「名次」決定你拿多少獎金。所以同樣贏 100bb，在兩種遊戲裡的意義完全不同。</div>
<table class="tbl"><thead><tr><th>比較</th><th>現金桌</th><th>錦標賽（MTT）</th></tr></thead><tbody>
<tr><td>籌碼價值</td><td>1 個籌碼 = 固定金額</td><td>籌碼不是錢，價值隨獎金結構變化（非線性）</td></tr>
<tr><td>盲注</td><td>固定不變</td><td>每隔一段時間升級，中期起加入前注</td></tr>
<tr><td>輸光之後</td><td>隨時重新買入</td><td>出局（除非還在可重購的時段）</td></tr>
<tr><td>何時結束</td><td>想走就走</td><td>被淘汰或贏下全部籌碼</td></tr>
<tr><td>籌碼深度</td><td>常見 100bb</td><td>從 100bb 以上一路變到只剩幾個 bb</td></tr>
<tr><td>變異數</td><td>大</td><td>更大：大部分獎金集中在極少數人</td></tr>
</tbody></table>
<p>Upswing 有個很好的說明：就算你第一手就淘汰全場所有人，也只能拿到約 30% 的獎金池；反過來，你可能靠一個小籌碼「爬」進錢圈就拿回大約兩倍買入。所以在錦標賽裡，<strong>贏來的籌碼價值小於輸掉的籌碼</strong>，不必要的大風險要少碰。</p>
<div class="callout key"><b>重點：錦標賽三大鐵則</b>① 永遠用 bb 數（不是籌碼數字）思考。② 前注越大、盲注越高，越要主動偷盲與反偷，不能一直等大牌。③ 越接近獎金跳級（泡沫、決賽桌），越要尊重「存活」的價值。</div>

<h3>2. 結構怎麼看：盲注升級、前注、晚報名、重購</h3>
<table class="tbl"><thead><tr><th>名詞</th><th>意思</th><th>策略影響</th></tr></thead><tbody>
<tr><td>盲注升級（Blind Level）</td><td>每 N 分鐘盲注提高一級</td><td>不入池籌碼也會越來越「短」，不能一直等大牌</td></tr>
<tr><td>前注（Ante）</td><td>發牌前的強制下注，屬於死錢</td><td>底池變大，偷盲與防守都要變寬</td></tr>
<tr><td>大盲前注（BB Ante）</td><td>由大盲一人代繳全桌前注，通常等於一個大盲</td><td>效果與傳統前注相同，但收取更快、更少錯誤</td></tr>
<tr><td>晚報名（Late Registration）</td><td>開賽後一段時間內仍可報名</td><td>晚進場跳過低盲注階段，但起始籌碼相對變短</td></tr>
<tr><td>Freezeout</td><td>只有一條命</td><td>最重視存活</td></tr>
<tr><td>重購（Rebuy）/ 加購（Add-on）</td><td>在原座位補一份籌碼 / 規定時段結束時加買籌碼</td><td>重購期常見更鬆、更賭的打法</td></tr>
<tr><td>重新報名（Re-entry）</td><td>出局後在報名期間重新買入，換新座位</td><td>每一條命都是獨立的小比賽，注意總花費</td></tr>
</tbody></table>
<div class="callout example"><b>例題：前注讓偷盲變得多划算？</b>盲注 1,000 / 2,000、BB Ante 2,000，沒人入池時底池 = 1,000 + 2,000 + 2,000 = 5,000，也就是 <strong>2.5bb</strong>（現金桌只有 1.5bb）。<br>
你在 BTN 開 2.2bb 純偷盲：需要的棄牌率 = 2.2 ÷（2.2 + 2.5）≈ <strong>46.8%</strong>；現金桌開 2.5bb 偷 1.5bb 需要 2.5 ÷（2.5 + 1.5）= <strong>62.5%</strong>。<br>
GTO Wizard 比較現金桌與錦標賽的解答也指出：同樣 100bb、6 人桌，BTN 開池範圍會從現金桌（無前注，本站基準約 45%）擴大到有前注錦標賽的五成以上；BB 面對 BTN 開池時拿到的賠率更好，防守範圍也明顯變寬。</div>
<p>晚報名的取捨：晚進場可以省時間、跳過盲注很小的階段，但也放棄了對手失誤最多、最容易累積籌碼的早期時段。剛開始打錦標賽的新手，建議準時開打，把每個階段都完整經歷一次，比較能建立節奏感。</p>

<h3>3. 用 bb 數思考：籌碼深度決定打法</h3>
<div class="formula">籌碼深度（bb）= 你的籌碼 ÷ 目前大盲</div>
<table class="tbl"><thead><tr><th>籌碼深度</th><th>打法重點</th></tr></thead><tbody>
<tr><td><strong>60bb 以上</strong>（深碼）</td><td>接近現金桌；小對子、同花連張等投機牌有隱含賠率，翻後技術最重要</td></tr>
<tr><td><strong>25–60bb</strong>（中碼）</td><td>開池常縮小到約 2–2.3bb；3-Bet 底池很快就接近全下，要預先想好面對 4-Bet 怎麼辦</td></tr>
<tr><td><strong>15–25bb</strong></td><td>開池與「3-Bet 全下（反推，Re-shove）」是主要武器，少平跟、少翻後小動作</td></tr>
<tr><td><strong>約 15bb 以下</strong>（短碼）</td><td>逐漸進入推擠（Push / Fold）：要嘛全下、要嘛棄牌，詳見下一課</td></tr>
</tbody></table>
<div class="callout tip"><b>實戰小技巧</b>不要看籌碼「數字」，要看「bb 數」。同樣 50,000 籌碼，在盲注 250 / 500 時是 100bb 的深碼，到了 1,000 / 2,000 只剩 25bb。每次盲注升級，都重新算一次自己和對手的 bb 數；真正決定打法的是<strong>有效籌碼</strong>，也就是你和對手之中較短的那一份。</div>
<div class="callout pro"><b>進階補充：M 值</b>Harrington 提出的 M 值 = 你的籌碼 ÷ 每一圈的強制成本（小盲 + 大盲 + 全部前注）。以 0.5 / 1bb 加 1bb BB Ante 為例，每圈成本 2.5bb，所以 25bb 的 M 值是 10，代表不入池大約還能撐 10 圈。M 值越低，越該主動找全下的機會，而不是等到只剩幾個 bb。</div>

<h3>4. 各階段策略重點</h3>
<table class="tbl"><thead><tr><th>階段</th><th>情境</th><th>策略重點</th><th>常見錯誤</th></tr></thead><tbody>
<tr><td><strong>早期</strong></td><td>深碼、還沒有前注</td><td>打穩、用位置累積籌碼，多觀察對手</td><td>為了華麗詐唬賭掉半個籌碼</td></tr>
<tr><td><strong>中期</strong></td><td>前注出現，平均約 30–60bb</td><td>擴大後位偷盲與反偷（3-Bet），留意短碼的反推</td><td>還停留在早期的緊打，被盲注慢慢吃掉</td></tr>
<tr><td><strong>泡沫期</strong></td><td>再淘汰一兩人就進錢圈</td><td>大碼施壓、中碼收緊、短碼精準推擠</td><td>中碼和能淘汰自己的大碼硬碰</td></tr>
<tr><td><strong>進錢圈</strong></td><td>剛保住獎金，獎金跳幅還平緩</td><td>重新積極累積籌碼，短碼找翻倍機會</td><td>滿足於最低獎金而消極</td></tr>
<tr><td><strong>決賽桌</strong></td><td>每淘汰一人獎金大跳</td><td>ICM 壓力最大：大碼欺負中碼，中碼避開大碼</td><td>完全忽略獎金階梯，或怕到被盲注吃光</td></tr>
<tr><td><strong>單挑</strong></td><td>只剩兩人</td><td>範圍大幅放寬，回到接近籌碼 EV 的打法</td><td>還用多人桌的緊範圍</td></tr>
</tbody></table>
<p>兩個常聽到的名詞：<strong>獎金階梯（Pay Jump）</strong>是名次每往前一名、獎金增加的幅度；<strong>爬梯（Ladder）</strong>是指短碼刻意避戰、等別人先出局來換取更高名次。爬梯只有在獎金跳幅夠大、而且確實有人比你更短時才值得；否則一味等待只會被盲注吃光。</p>

<h3>5. 頭重腳輕的獎金與「籌碼價值非線性」</h3>
<p>典型錦標賽只發獎金給約 <strong>15–20%</strong> 的參賽者，大部分獎金集中在決賽桌，前三名合計約拿走 <strong>30–40%</strong> 的獎金池；剛進錢圈的獎金通常只比買入多一點。這代表：存活很重要，但只求「擠進錢圈」也賺不到大錢。</p>
<p>籌碼價值非線性的直覺：4 人搶 3 個獎金位（獎金 500 / 300 / 200），大家籌碼一樣，每人期望值 $250。你全下贏了、籌碼翻倍，期望值只升到約 $383（+53%）；輸了直接變 $0（−100%）。而且旁觀棄牌的兩位，什麼都沒做期望值就從 $250 升到約 $308——這就是為什麼錦標賽裡「棄牌也有正期望值」。</p>
<div class="callout example"><b>例題：錦標賽的變異數有多大？</b>GTO Wizard 用變異數計算器模擬一位 ROI（投資報酬率）10% 的玩家，打 1,000 場 100 人、買入 $50 的錦標賽：平均獲利約 $5,000，但仍有約 <strong>18.2%</strong> 的機率最後是虧損；若同樣條件只發 5 個獎金位（結構更陡），虧損機率升到約 <strong>26.1%</strong>。打了一千場還不一定看得出實力，這就是錦標賽需要更多買入當資金的原因。</div>
<div class="callout warn"><b>常見錯誤</b>① 把現金桌「只要 +EV 就跟」的習慣帶到泡沫期，結果用邊緣牌跟全下出局。② 中期太緊、等大牌，等到只剩 8bb 才被迫亂推。③ 進錢圈後鬆懈，把籌碼送給更積極的對手。④ Re-entry 賽事一直重新報名，總花費超出資金管理上限。</div>

<h3>6. 牌例：中期偷盲，遇到短碼反推</h3>
<div class="hh">
<div class="hh-title">牌例：BTN 用 K7 同花偷盲，大盲 12bb 反推</div>
<div class="hh-row"><span class="hh-street">背景</span>錦標賽中期（離泡沫還遠），盲注 1,000 / 2,000、BB Ante 2,000。你在 BTN 有 25bb，大盲玩家下完前注後剩 12bb（含已下的 1bb 大盲）。</div>
<div class="hh-row"><span class="hh-street">翻前</span>前面棄牌到你，拿 <span class="cards">Kh7h</span> 開池 2.2bb（純偷盲門檻約 46.8%）。小盲棄牌，大盲全下 12bb。</div>
<div class="hh-row"><span class="hh-street">計算</span>你要再補 12 − 2.2 = 9.8bb；跟注後底池 = 0.5（小盲）+ 1（前注）+ 12 + 12 = 25.5bb。必要勝率 = 9.8 ÷ 25.5 ≈ 38.4%。假設他的反推範圍約 27%（22+、所有 A、K9+、QTs+、QJo、JTs），K7s 對這個範圍的勝率約 39%。</div>
<div class="hh-row"><span class="hh-street">判斷</span>以籌碼 EV 來看只多約 0.39 × 25.5 − 9.8 ≈ +0.1bb，是非常邊緣的跟注；若他的範圍再緊一點就該棄牌，若他是什麼牌都反推的鬆凶玩家，跟注就變得明確。</div>
<div class="hh-row result"><span class="hh-street">重點</span>同一手牌如果發生在泡沫期，ICM 會把跟注門檻再往上推好幾個百分點，K7s 就是明確的棄牌。錦標賽的正確答案取決於「階段」，不只取決於牌力。</div>
</div>

<h3>7. 下一步</h3>
<p>泡沫期與短碼的精確算法在 <a href="#/learn/icm-pushfold">ICM 與短碼推擠</a>；想比較 SNG、Spin & Go 等其他賽制，看 <a href="#/learn/game-formats">撲克遊戲種類</a>；錦標賽變異數極大，資金需求請參考 <a href="#/learn/bankroll-mindset">資金管理、變異數與心態</a>。也可以回顧 <a href="#/learn/preflop-rfi">開池範圍</a>，再想想有前注時要怎麼放寬。最後到 <a href="#/quiz/theory?topic=mtt-basics">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'GTO Wizard — Poker Strategies: Tournaments vs. Cash Games', url: 'https://blog.gtowizard.com/poker-strategies-tournaments-vs-cash-games/' },
    { title: 'GTO Wizard — How Payout Structures Impact ICM', url: 'https://blog.gtowizard.com/how-payout-structures-impact-icm/' },
    { title: 'Upswing Poker — Early Stage Poker Tournament Strategy', url: 'https://upswingpoker.com/early-stage-poker-tournament-strategy-pre-ante/' },
    { title: 'PokerCoaching — Poker Antes: What Most Players Get Wrong', url: 'https://pokercoaching.com/blog/poker-ante/' },
    { title: 'SoMuchPoker — Poker Rebuy vs. Re-Entry: What Is the Difference?', url: 'https://somuchpoker.com/news/poker-rebuy-and-re-entry-differences' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'mtt-basics-01', topic: 'mtt-basics', lv: 1,
    q: '錦標賽盲注 1,000 / 2,000、大盲前注（BB Ante）2,000。翻前還沒人入池時，底池是幾個 bb？',
    opts: ['2.5bb', '1.5bb', '3.5bb', '2bb'],
    ans: 0,
    exp: '底池 = 小盲 1,000 + 大盲 2,000 + BB Ante 2,000 = 5,000，除以大盲 2,000 = 2.5bb。現金桌沒有前注只有 1.5bb，所以有前注時偷盲的報酬更大。' },
  { id: 'mtt-basics-02', topic: 'mtt-basics', lv: 2,
    q: '承上，你在 BTN 開池 2.2bb 純偷盲（拿到棄牌就贏 2.5bb）。對手至少要棄牌多少，你才損益兩平？',
    opts: ['約 46.8%', '約 62.5%', '約 33.3%', '約 55.0%'],
    ans: 0,
    exp: '純詐唬門檻 = 冒險額 ÷（冒險額 + 可贏的底池）= 2.2 ÷（2.2 + 2.5）≈ 46.8%。62.5% 是現金桌開 2.5bb 偷 1.5bb 的門檻（2.5 ÷ 4），前注讓偷盲門檻大幅下降。' },
  { id: 'mtt-basics-03', topic: 'mtt-basics', lv: 1,
    q: '盲注 1,500 / 3,000 時你有 36,000 籌碼。以 bb 計是多少？通常是什麼打法？',
    opts: ['12bb，以推擠（Push / Fold）為主', '36bb，可以正常開池與翻後操作', '24bb，適合溜入看翻牌', '120bb，接近現金桌深碼'],
    ans: 0,
    exp: '籌碼深度 = 36,000 ÷ 3,000 = 12bb。約 15bb 以下就逐漸進入推擠模式：要嘛全下、要嘛棄牌，因為開池後被反推時你常常已經投入太多、無法棄牌。' },
  { id: 'mtt-basics-04', topic: 'mtt-basics', lv: 1,
    q: '典型的多桌錦標賽（MTT），大約有多少比例的參賽者能拿到獎金？',
    opts: ['約 15–20%', '約 50%', '約 3%', '約 35–40%'],
    ans: 0,
    exp: '常見的標準獎金結構只發給約 15–20% 的參賽者，而且大部分獎金集中在決賽桌，前三名合計約拿走 30–40% 的獎金池。' },
  { id: 'mtt-basics-05', topic: 'mtt-basics', lv: 2,
    q: '4 人搶 3 個獎金位（500 / 300 / 200），大家籌碼一樣、每人期望值 $250。你全下贏了籌碼翻倍，期望值變約 $383；輸了變 $0。這說明了什麼？',
    opts: ['贏來的籌碼價值小於輸掉的籌碼，泡沫期跟全下要更謹慎', '籌碼翻倍就等於獎金期望值翻倍', '泡沫期應該放寬跟注全下的範圍', '獎金結構不會影響策略'],
    ans: 0,
    exp: '翻倍只讓期望值 +53%（250 → 383），輸光卻是 −100%（250 → 0）。這種不對稱就是籌碼價值非線性（ICM），所以泡沫期需要比籌碼 EV 更高的勝率才值得跟注全下。' },
  { id: 'mtt-basics-06', topic: 'mtt-basics', lv: 2,
    q: '泡沫期你是中等籌碼，桌上一位大籌碼不斷開池施壓。一般而言你應該怎麼做？',
    opts: ['收緊範圍，避免和能淘汰你的大籌碼硬碰，除非牌很強', '每次都跟他全下拚了', '快進錢圈了，所以放寬跟注範圍', '開始溜入每一手看翻牌'],
    ans: 0,
    exp: '大籌碼能淘汰你、你卻只能讓他少一部分籌碼，泡沫期這種對抗對中碼極不利，所以要收緊。這也是大碼在泡沫期施壓會成功的原因；溜入看翻牌則只會讓籌碼慢慢流失。' },
  { id: 'mtt-basics-07', topic: 'mtt-basics', lv: 2,
    q: '錦標賽盲注 0.5 / 1bb 加 1bb 的大盲前注（BB Ante），你有 20bb。依 Harrington 的定義，你的 M 值是多少？',
    opts: ['8', '20', '約 13.3', '10'],
    ans: 0,
    exp: 'M 值 = 籌碼 ÷ 每圈強制成本（小盲 + 大盲 + 全部前注）= 20 ÷（0.5 + 1 + 1）= 8，代表不入池大約只能撐 8 圈。13.3 是忘了算前注（20 ÷ 1.5）；20 是把 bb 數當成 M 值。' }
);

// ===========================================================================
// 5. ICM 與短碼推擠（Push / Fold）
// ===========================================================================
GTO.THEORY.push({
  id: 'icm-pushfold',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: 'ICM 與短碼推擠（Push / Fold）',
  icon: '🧮',
  level: 3,
  minutes: 16,
  tldr: 'ICM 把籌碼換算成獎金期望值：輸的痛大於贏的爽，泡沫期跟全下要更高勝率；約 15bb 以下改用推或棄。',
  plain: '想像三個人分披薩，規則是第一名拿一半、第二名三成、第三名兩成。就算你的籌碼佔六成，也分不到六成披薩，因為第一名最多只拿一半；籌碼最少的人也保底兩成。ICM 就是計算「你的籌碼到底值多少披薩」的方法。',
  summary: '用 Malmuth–Harville 模型實算 3 人 50 / 30 / 20 獎金的 ICM，理解風險溢價、Bubble Factor 與泡沫期施壓，並用 HoldemResources 與 HRC 的數據學會約 15bb 以下的推擠策略。',
  keyPoints: [
    'ICM（Malmuth–Harville）：拿第 1 名的機率 = 你的籌碼占比，再依序推算其他名次；籌碼價值不是線性的，大碼的籌碼打折、短碼的籌碼加值。',
    'Bubble Factor = 輸掉時失去的獎金期望值 ÷ 贏時增加的期望值；等額全下所需勝率 = BF ÷（BF + 1）。BF 1.18 就要 54%，而不是 50%。',
    '泡沫期被大籌碼覆蓋的中籌碼 BF 最高、最該收緊；覆蓋別人的大籌碼 BF 較低，可以大範圍施壓。',
    'HoldemResources 單挑推擠 Nash（無前注）：10bb 時小盲約推 58%、大盲約跟 37%；15bb 時約 46% / 29%。',
    '約 15bb 以下考慮推擠；現代多人桌解法常混用最小加注，純推擠表最適合 SNG、Spin & Go 與單挑。'
  ],
  html: `
<h3>1. ICM 是什麼？把籌碼換算成「獎金期望值」</h3>
<p>ICM（Independent Chip Model，獨立籌碼模型）又稱 Malmuth–Harville 模型：它假設大家技術相同，只用「現在的籌碼量」估計每個人拿到各名次的機率，再換算成獎金期望值（$EV）。這個模型最早由 David Harville 在 1973 年用於賽馬，1987 年 Mason Malmuth 把它帶進撲克。</p>
<div class="formula">拿第 1 名的機率 = 你的籌碼 ÷ 全部籌碼</div>
<div class="formula">某人拿第 1 名之後，你拿第 2 名的機率 = 你的籌碼 ÷（全部籌碼 − 第 1 名的籌碼）</div>
<p>依此類推算出每種名次順序的機率，乘上對應獎金再加總，就是你的 ICM 期望值。現金桌的籌碼是「線性」的（多一倍籌碼＝多一倍錢）；錦標賽的籌碼經過 ICM 換算後，是<strong>非線性</strong>的。</p>

<h3>2. 算給你看：3 人分 50 / 30 / 20 的獎金</h3>
<p>獎金池 $1,000：第 1 名 $500、第 2 名 $300、第 3 名 $200。三人籌碼 A 6,000、B 3,000、C 1,000（共 10,000）。</p>
<ol class="steps">
<li><b>第 1 名機率</b>直接看籌碼占比：A 60%、B 30%、C 10%。</li>
<li><b>A 拿第 2 名</b>＝ B 先拿第 1（30%）× A 在剩下 7,000 籌碼中占 6/7，加上 C 先拿第 1（10%）× A 在剩下 9,000 中占 6/9：0.3 × 0.857 + 0.1 × 0.667 ≈ 32.4%。</li>
<li><b>A 拿第 3 名</b>＝ 1 − 60% − 32.4% ≈ 7.6%。</li>
<li><b>A 的期望值</b>＝ 0.6 × 500 + 0.324 × 300 + 0.076 × 200 ≈ <strong>$412.4</strong>。</li>
</ol>
<table class="tbl"><thead><tr><th>玩家</th><th>籌碼（占比）</th><th>第 1 名</th><th>第 2 名</th><th>第 3 名</th><th>ICM 期望值</th><th>若照籌碼比例分</th></tr></thead><tbody>
<tr><td>A</td><td>6,000（60%）</td><td>60.0%</td><td>32.4%</td><td>7.6%</td><td><strong>$412.4</strong></td><td>$600</td></tr>
<tr><td>B</td><td>3,000（30%）</td><td>30.0%</td><td>48.3%</td><td>21.7%</td><td><strong>$338.3</strong></td><td>$300</td></tr>
<tr><td>C</td><td>1,000（10%）</td><td>10.0%</td><td>19.3%</td><td>70.7%</td><td><strong>$249.3</strong></td><td>$100</td></tr>
</tbody></table>
<p>A 握有 60% 籌碼，卻只值獎金池的 41.2%；C 只有 10% 籌碼，卻值 24.9%（因為已經保底 $200）。這就是「大碼的籌碼打折、短碼的籌碼加值」。</p>

<h3>3. 風險溢價與 Bubble Factor：為什麼要更高勝率</h3>
<div class="callout plain"><b>白話解釋</b>玩大富翁時，如果你只剩一點錢，多賺一千塊不會讓你贏，但輸掉一千塊就破產出局，所以你會比有錢的玩家更怕冒險。Bubble Factor 就是把這種「怕輸的程度」量化成一個數字。</div>
<div class="formula">Bubble Factor（BF）= 輸掉時失去的 $EV ÷ 贏時增加的 $EV</div>
<div class="formula">等額全下（不計死錢）所需勝率 = BF ÷（BF + 1）；風險溢價 = ICM 所需勝率 − 籌碼 EV 所需勝率</div>
<p>GTO Wizard 的經典例子：10 人 SNG、每人 1,000 籌碼、獎金 $500 / $300 / $200，每人期望值 $100。第一手兩人全下：輸家從 $100 變 $0；贏家籌碼翻倍，期望值卻只升到 $184.44（只多 $84.44），其他 8 人什麼都沒做，各自多了 $1.94。所以 BF = 100 ÷ 84.44 ≈ 1.18，跟注全下需要約 54% 勝率，而不是 50%。</p>
<div class="callout example"><b>例題：泡沫期誰最該怕？</b>剩 4 人、前 3 名有獎金（$500 / $300 / $200），籌碼 4,000 / 3,000 / 2,000 / 1,000，ICM 期望值約 $336 / $295 / $236 / $133。
<table class="tbl"><thead><tr><th>對決（各投入 3,000）</th><th>贏了增加</th><th>輸了損失</th><th>BF</th><th>所需勝率</th></tr></thead><tbody>
<tr><td>3,000 的中碼跟注 4,000 大碼的全下</td><td>+$110</td><td>−$295（出局）</td><td>2.69</td><td>約 72.9%</td></tr>
<tr><td>4,000 的大碼跟注 3,000 中碼的全下</td><td>+$99</td><td>−$169</td><td>1.71</td><td>約 63.1%</td></tr>
</tbody></table>
同一場對決，中碼需要約 73% 勝率才能跟，大碼只要約 63%；而 1,000 籌碼的短碼只要中碼出局，期望值就從 $133 升到約 $256。這就是泡沫期「大碼施壓、中碼收緊、短碼等人先爆」的數學根據。</div>
<p>獎金結構也會改變 BF：GTO Wizard 模擬 180 人賽泡沫、6 位玩家各 20bb 時，標準結構 BF 約 1.41（需 59% 勝率）、平坦結構約 1.48（60%）、陡峭結構約 1.35（57%）；贏家通吃賽事 BF = 1，而所有晉級者獎品相同的衛星賽，BF 可高達 27（需約 96% 勝率），連 AA 都可能該棄牌。</p>

<h3>4. 泡沫期：大籌碼施壓、中籌碼收緊</h3>
<table class="tbl"><thead><tr><th>你的籌碼</th><th>泡沫期策略</th></tr></thead><tbody>
<tr><td><strong>大碼</strong>（能覆蓋多數人）</td><td>大幅放寬開池與全下，專挑「怕出局」的中碼施壓；避免和第二大的籌碼互撞</td></tr>
<tr><td><strong>中碼</strong></td><td>面對能淘汰你的大碼要明顯收緊，邊緣牌就算籌碼 EV 為正也常該棄</td></tr>
<tr><td><strong>短碼</strong></td><td>用推擠搶盲注；若場上還有更短的籌碼、獎金跳幅又大，可以適度等別人先出局</td></tr>
</tbody></table>
<div class="callout tip"><b>實戰小技巧</b>每次面對全下，先問兩個問題：「誰能淘汰我？」「我能淘汰誰？」能淘汰你的人下注時，你要更緊；你能淘汰的人，就是你施壓的目標。</div>
<div class="callout warn"><b>常見錯誤</b>① 泡沫期中碼用 AJ、KQ 這類牌跟大碼的全下，把進錢圈的機會送掉。② 短碼一直等，等到只剩 1–2bb 才推，連棄牌權益都沒了。③ 拿籌碼 EV 的推擠表直接套用在泡沫期或決賽桌。④ 以為 ICM 只在泡沫才重要：獎金結構從開賽就影響決策，只是越接近獎金跳級越明顯。</div>

<h3>5. 短碼推擠（Push / Fold）：約 15bb 以下的武器</h3>
<p>籌碼很短時，「開池後被反推只好棄牌」會白白損失一大截籌碼。直接全下有兩個好處：最大化<strong>棄牌權益</strong>，而且被跟注時能看完五張公牌、完整實現勝率。</p>
<table class="tbl"><thead><tr><th>有效籌碼（單挑、無前注）</th><th>小盲推擠範圍</th><th>大盲跟注範圍</th></tr></thead><tbody>
<tr><td>5bb</td><td>約 72%</td><td>約 62%</td></tr>
<tr><td>10bb</td><td>約 58%</td><td>約 37%</td></tr>
<tr><td>15bb</td><td>約 46%</td><td>約 29%</td></tr>
<tr><td>20bb</td><td>約 40%</td><td>約 22%</td></tr>
</tbody></table>
<p>（依 HoldemResources 單挑推擠 Nash 表逐手統計。）10bb 時，小盲推所有對子、所有 A 與 K、絕大多數 Q 與同花牌；大盲則用所有對子、所有 A、所有同花 K、<span class="hand">K5o</span> 以上、<span class="hand">Q9o</span> 以上、<span class="hand">Q7s</span> 以上、<span class="hand">J8s</span> 以上、<span class="hand">JTo</span>、<span class="hand">T9s</span> 跟注。HoldemResources 也提醒：純推或棄通常只建議用到約 10bb，超過 20bb 幾乎一定是錯的。</p>
<p>多人桌更複雜。Upswing 引用 HRC 的 8 人桌解法（10bb、約剩 30% 參賽者）：UTG 只玩約 16.1%（全下 8.5%、最小加注 7.6%），HJ 約 26.3%，CO 約 32.2%（全下 25.7%），BTN 約 38.4%（全下 29.3%），SB 約 75.2%（全下 54.3%、其餘多為溜入）。而純推擠表（ICMizer）在同樣 10bb 時 UTG 只推約 13.1%——加入最小加注選項後，能有利可圖地玩更多牌。</p>
<div class="callout pro"><b>進階補充</b>① ICM 假設大家技術相同，也不考慮位置與盲注即將輪到誰；HRC、ICMizer 等工具會用「未來局面模擬（FGS）」修正這些缺點。② 大型賽事人數太多，無法直接算完整 ICM，工具會用近似模型。③ 純推擠表最適合 SNG、Spin & Go 與單挑；多人桌錦標賽的現代打法常在 10–20bb 混用最小加注、甚至溜入。</div>

<h3>6. 牌例：10bb 單挑的盲注大戰</h3>
<div class="hh">
<div class="hh-title">牌例：籌碼 EV 下的推擠與跟注（單挑、有效 10bb、無前注）</div>
<div class="hh-row"><span class="hh-street">小盲</span>你拿 <span class="cards">Kh5d</span>。依 Nash 表，<span class="hand">K5o</span> 在 14.2bb 以下都可以推。</div>
<div class="hh-row"><span class="hh-street">計算</span>大盲依 Nash 約跟 37%、棄 63%。棄牌時你贏 1bb；被跟注時 K5o 對他的跟注範圍約 38% 勝率，底池 20bb，平均拿回 7.6bb、投入 10bb，等於 −2.4bb。推擠 EV ≈ 0.63 × 1 + 0.37 ×（−2.4）≈ −0.26bb，比直接棄牌（損失 0.5bb 小盲）好約 0.24bb，所以要推。</div>
<div class="hh-row"><span class="hh-street">大盲</span>換你在大盲面對 10bb 全下：再補 9bb 去爭 20bb 的底池，必要勝率 = 9 ÷ 20 = 45%。</div>
<div class="hh-row"><span class="hh-street">比較</span><span class="cards">Qh8d</span> 對 58% 的推擠範圍勝率約 44.9%，差一點點 → 棄牌；<span class="cards">Qh9d</span> 約 47.1% → 跟注。這和 Nash 表一致（Q8o 只在 9.7bb 以下跟、Q9o 可到 11.7bb）。</div>
<div class="hh-row result"><span class="hh-street">重點</span>推擠的「正確」是和棄牌比較出來的；而在泡沫期，BF 會讓大盲的 45% 門檻再往上加好幾個百分點，Q9o 也可能變成棄牌。</div>
</div>

<h3>7. 下一步</h3>
<p>先複習 <a href="#/learn/mtt-basics">錦標賽（MTT）入門</a> 的階段概念；想自己算 ICM 與推擠範圍，看 <a href="#/learn/solver-basics">Solver 入門</a> 中的 HRC / ICMizer 介紹，也可以用 <a href="#/tools">工具頁</a> 的計算機驗算勝率與底池賠率；必要勝率的基本功在 <a href="#/learn/poker-math">撲克數學</a>。最後到 <a href="#/quiz/theory?topic=icm-pushfold">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'Wikipedia — Independent Chip Model', url: 'https://en.wikipedia.org/wiki/Independent_Chip_Model' },
    { title: 'GTO Wizard — What Is the Bubble Factor in Poker Tournaments?', url: 'https://blog.gtowizard.com/what-is-the-bubble-factor-in-poker-tournaments/' },
    { title: 'GTO Wizard — How Payout Structures Impact ICM', url: 'https://blog.gtowizard.com/how-payout-structures-impact-icm/' },
    { title: 'HoldemResources.net — HeadsUp Push/Fold Nash Equilibrium', url: 'https://www.holdemresources.net/hune' },
    { title: 'Upswing Poker — Push Fold Charts for Poker Tournaments, Plus More Advanced Strategies', url: 'https://upswingpoker.com/push-fold-tournament-strategy-charts/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'icm-pushfold-01', topic: 'icm-pushfold', lv: 1,
    q: '剩 3 人，籌碼分別是 6,000 / 3,000 / 1,000。依 ICM（Malmuth–Harville）模型，6,000 籌碼的玩家拿第 1 名的機率是多少？',
    opts: ['60%', '50%', '41.2%', '33.3%'],
    ans: 0,
    exp: 'ICM 的第一步：拿第 1 名的機率等於籌碼占比 = 6,000 ÷ 10,000 = 60%。41.2% 是他的期望值占獎金池的比例（$412.4 ÷ $1,000），不是第 1 名機率。' },
  { id: 'icm-pushfold-02', topic: 'icm-pushfold', lv: 2,
    q: '承上，獎金是 $500 / $300 / $200。6,000 籌碼玩家的 ICM 期望值最接近多少？',
    opts: ['約 $412', '$600', '$500', '約 $338'],
    ans: 0,
    exp: '他拿第 1、2、3 名的機率約 60%、32.4%、7.6%，期望值 ≈ 0.6 × 500 + 0.324 × 300 + 0.076 × 200 ≈ $412.4。照籌碼比例分會是 $600，但第 1 名最多只拿 $500，所以大碼的籌碼會「打折」。約 $338 是 3,000 籌碼玩家的期望值。' },
  { id: 'icm-pushfold-03', topic: 'icm-pushfold', lv: 2,
    q: '某次全下，輸了會讓你的獎金期望值少 $100，贏了只會多 $84.44。你的 Bubble Factor 與等額全下所需勝率大約是多少？',
    opts: ['BF 約 1.18，需要約 54% 勝率', 'BF 1.00，需要 50% 勝率', 'BF 約 0.84，需要約 46% 勝率', 'BF 2.00，需要約 67% 勝率'],
    ans: 0,
    exp: 'BF = 輸掉損失 ÷ 贏時增加 = 100 ÷ 84.44 ≈ 1.18；所需勝率 = BF ÷（BF + 1）= 1.18 ÷ 2.18 ≈ 54%。比籌碼 EV 的 50% 多出的 4 個百分點，就是風險溢價。' },
  { id: 'icm-pushfold-04', topic: 'icm-pushfold', lv: 2,
    q: '錦標賽泡沫期，下列哪一種玩家面對全下時通常 Bubble Factor 最高、最該收緊？',
    opts: ['被大籌碼覆蓋的中等籌碼', '能覆蓋全桌的最大籌碼', '贏家通吃賽事中的任何玩家', '只剩兩人單挑爭冠軍的玩家'],
    ans: 0,
    exp: '中碼輸了就出局，贏了卻只多一部分期望值，所以 BF 最高（例題中約 2.69，需要約 73% 勝率）。大碼輸了不會出局，BF 較低；贏家通吃 BF = 1；單挑時 ICM 期望值與籌碼成正比，也接近籌碼 EV。' },
  { id: 'icm-pushfold-05', topic: 'icm-pushfold', lv: 2,
    q: '依 HoldemResources 單挑推擠 Nash 表（無前注），有效籌碼 10bb 時，小盲大約應該推多少比例的手牌？',
    opts: ['約 58%', '約 25%', '約 85%', '約 40%'],
    ans: 0,
    exp: '10bb 單挑時，小盲約推 58% 的手牌（所有對子、所有 A 與 K、絕大多數 Q 與同花牌），大盲約用 37% 跟注。約 40% 是 20bb 時的推擠比例；籌碼越短，推擠範圍越寬。' },
  { id: 'icm-pushfold-06', topic: 'icm-pushfold', lv: 3,
    q: '單挑有效 10bb、無前注，小盲全下，你在大盲（已投入 1bb）。以籌碼 EV 計算，你跟注至少需要多少勝率？',
    opts: ['45%', '50%', '33.3%', '55%'],
    ans: 0,
    exp: '你要再補 9bb，跟注後底池 = 10 + 10 = 20bb，必要勝率 = 9 ÷ 20 = 45%。Q8o 對 58% 推擠範圍約 44.9%，差一點點所以棄牌；Q9o 約 47.1% 可以跟。泡沫期因為 BF 大於 1，門檻還會更高。' },
  { id: 'icm-pushfold-07', topic: 'icm-pushfold', lv: 3,
    q: '泡沫期剩 4 人（獎金 $500 / $300 / $200），籌碼 4,000 / 3,000 / 2,000 / 1,000。3,000 的中碼跟注 4,000 大碼的全下：贏了 +$110、輸了 −$295。他需要多少勝率才值得跟？',
    opts: ['約 72.9%', '50%', '約 63.1%', '約 54%'],
    ans: 0,
    exp: 'BF = 295 ÷ 110 ≈ 2.69，所需勝率 = BF ÷（BF + 1）= 2.69 ÷ 3.69 ≈ 72.9%。63.1% 是反過來大碼跟注中碼全下的門檻；54% 是第一手 10 人 SNG 的例子。被大碼覆蓋的中碼，泡沫期最該收緊。' }
);

// ===========================================================================
// 6. 撲克遊戲種類：現金桌、錦標賽、SNG、短牌、PLO
// ===========================================================================
GTO.THEORY.push({
  id: 'game-formats',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: '撲克遊戲種類：現金桌、錦標賽、SNG、短牌、PLO',
  icon: '🃏',
  level: 1,
  minutes: 13,
  tldr: '現金桌、錦標賽、SNG、Spin & Go、短牌、PLO 規則與策略差很多：先選一種專精，並遵守當地法律、理性娛樂。',
  plain: '撲克像「球類運動」這個大家族：籃球、排球、足球都用球，但人數、規則、比賽時間完全不同。德州撲克現金桌、錦標賽、短牌、奧馬哈也一樣，同樣比牌型大小，需要的技術與心態卻各不相同。',
  summary: '一次看懂現金桌、MTT、SNG、Spin & Go、單挑、6-max 與 9 人全桌、短牌（6+）、奧馬哈 PLO / PLO5 與混合賽：規則差在哪、策略怎麼調整、各自適合什麼樣的玩家，以及遵守當地法律的提醒。',
  keyPoints: [
    '先分兩大類：現金桌（籌碼＝錢、隨時進出）與錦標賽類（MTT、SNG、Spin & Go：盲注升級、名次決定獎金）。',
    '人數越少越要侵略：6-max 每人每手平均繳 0.25bb 盲注、9 人桌約 0.17bb；單挑時按鈕位就是小盲、範圍最寬。',
    '短牌（36 張）同花大於葫蘆，多數規則順子大於三條（少數相反），最小順子是 A-6-7-8-9。',
    'PLO 發 4 張底牌、PLO5 發 5 張，但攤牌都必須「正好用 2 張底牌 + 3 張公牌」，而且是底池限注。',
    '撲克涉及金錢時務必遵守當地法律；在台灣，以網路等方式賭博財物可能觸犯刑法第 266 條。'
  ],
  html: `
<h3>1. 兩大類：現金桌 vs 錦標賽類</h3>
<table class="tbl"><thead><tr><th>形式</th><th>怎麼玩</th><th>籌碼與節奏</th><th>策略重點</th><th>適合誰</th></tr></thead><tbody>
<tr><td><strong>現金桌</strong>（Cash Game）</td><td>隨時坐下、隨時離開，籌碼就是錢</td><td>常見 100bb，盲注固定</td><td>翻後技術、範圍平衡、資金管理</td><td>想穩定練技術、時間彈性的人</td></tr>
<tr><td><strong>多桌錦標賽</strong>（MTT）</td><td>數十到上萬人同場，打到剩最後一人</td><td>盲注升級，可能打好幾個小時</td><td>階段調整、ICM、短碼技巧</td><td>有整段時間、能承受大變異的人</td></tr>
<tr><td><strong>SNG</strong>（Sit &amp; Go）</td><td>人數一滿就開打，常見單桌 6 或 9 人</td><td>較快的盲注升級，前 2–3 名有獎金</td><td>中短碼、ICM、推擠範圍</td><td>想專練 ICM、時間較固定的人</td></tr>
<tr><td><strong>Spin &amp; Go</strong></td><td>3 人極速賽，開打前隨機抽出獎金倍數</td><td>常見 500 籌碼、盲注 10 / 20（25bb），每 2–5 分鐘升級</td><td>推擠與短碼單挑</td><td>喜歡快節奏、能接受極高變異的人</td></tr>
<tr><td><strong>單挑</strong>（Heads-Up）</td><td>一對一</td><td>按鈕位就是小盲，翻前先行動、翻後後行動</td><td>極寬範圍、持續施壓、讀人</td><td>基本功紮實、想練侵略性的人</td></tr>
</tbody></table>
<p>Spin &amp; Go 的獎金倍數像抽獎：多數時候（約八到九成）只抽到 2–3 倍買入，而且通常是冠軍通吃；極少數抽到超高倍數時，才會讓前三名都有獎金。它的節奏快、樂趣高，但短期運氣成分比任何形式都大。</p>
<p>SNG 則是「迷你錦標賽」：例如 GTO Wizard 說明 ICM 時用的 10 人 SNG，獎金是前三名 50% / 30% / 20%。因為獎金位少、跳幅大，泡沫期的 ICM 壓力比大型 MTT 更集中，非常適合用來練習 ICM 與推擠。賽事名稱裡的 Turbo、Hyper 指的是盲注升級速度：越快的結構，籌碼越早變短，推擠技術越重要。</p>

<h3>2. 6-max、9 人全桌與單挑：人數決定侵略性</h3>
<table class="tbl"><thead><tr><th>比較</th><th>9 人全桌（Full Ring）</th><th>6 人桌（6-max）</th><th>單挑（HU）</th></tr></thead><tbody>
<tr><td>每人每手平均繳的盲注</td><td>1.5 ÷ 9 ≈ 0.17bb</td><td>1.5 ÷ 6 = 0.25bb</td><td>1.5 ÷ 2 = 0.75bb</td></tr>
<tr><td>穩健玩家常見 VPIP</td><td>約 15–20%</td><td>約 22–28%</td><td>按鈕位常玩八成以上</td></tr>
<tr><td>打法</td><td>耐心、前位很緊、多人底池較多</td><td>偷盲、3-Bet、盲注防守都更頻繁</td><td>幾乎每手都在搶盲，侵略性最高</td></tr>
</tbody></table>
<p>盲注越常輪到你、要打敗的人越少，你就越不能只等大牌。本站的範圍表以 6-max 為基準；如果你打的是 9 人桌，前位的開池範圍要再收緊，單挑則要大幅放寬。單挑還有一個特殊規則：按鈕位同時是小盲，翻前先行動、翻後最後行動，所以按鈕位的位置優勢在單挑特別明顯。</p>

<h3>3. 短牌（Short Deck / 6+）：同花比葫蘆大</h3>
<p>短牌把 2 到 5 全部拿掉，只用 36 張牌。規則大多和德州一樣，但常用「按鈕盲注 + 全體前注」的結構（每人都繳前注，只有按鈕位繳一個盲注，通常是前注的 2–4 倍，想跟注入池要補到盲注大小），而且牌型大小有關鍵差異：</p>
<table class="tbl"><thead><tr><th>名次</th><th>短牌（常見的 Triton 規則）</th><th>德州撲克</th></tr></thead><tbody>
<tr><td>1–3</td><td>皇家同花順 &gt; 同花順 &gt; 四條</td><td>相同</td></tr>
<tr><td>4</td><td><strong>同花</strong></td><td>葫蘆</td></tr>
<tr><td>5</td><td><strong>葫蘆</strong></td><td>同花</td></tr>
<tr><td>6–7</td><td>順子 &gt; 三條（少數規則改成三條 &gt; 順子）</td><td>順子 &gt; 三條</td></tr>
</tbody></table>
<ul>
<li><strong>為什麼同花變大？</strong>每種花色只剩 9 張，同花更難湊；葫蘆反而更容易。</li>
<li><strong>最小順子</strong>：A 可以當最小，所以是 <span class="cards">As6d7c8h9s</span>（A-6-7-8-9）。</li>
<li><strong>機率大變</strong>：拿到 AA 的機率約 0.95%（德州約 0.45%，多了一倍）；翻牌兩頭順聽牌到河牌約 45.5%（德州約 31.5%）；同花聽牌只剩 5 個 outs，到河牌約 30%；口袋對子翻牌中三條約 17%（德州約 12%）。</li>
<li><strong>翻前勝率更接近</strong>：本站模擬，<span class="hand">JTs</span> 對 <span class="hand">AKs</span> 在短牌約 48%（德州約 39%）；<span class="hand">AKs</span> 對 <span class="hand">66</span> 在短牌約 61%（德州約 48%，接近擲硬幣）。</li>
<li><strong>策略調整</strong>：同花牌與口袋對子價值上升，可以打得更積極；估算聽牌可用「6 與 3 法則」：翻牌 outs × 6、轉牌 outs × 3（8 outs 在翻牌約 48%，實際 45.5%）。德州的位置、盲注防守與 3-Bet 結構等觀念仍然適用。</li>
</ul>
<div class="callout example"><b>例題：同一手牌，兩種結果</b>公牌 <span class="cards">KsJs9s9d6c</span>，甲拿 <span class="cards">As7s</span>（A 高同花），乙拿 <span class="cards">KdKh</span>（K 葫蘆）。<br>
• 德州撲克：葫蘆大於同花，<strong>乙贏</strong>。<br>
• 短牌：同花大於葫蘆，<strong>甲贏</strong>。<br>
上桌前一定要先確認該桌採用哪一套牌型規則。</div>

<h3>4. 奧馬哈 PLO 與 PLO5：必須正好用兩張</h3>
<div class="callout plain"><b>白話解釋</b>PLO 像點套餐：菜單上有四道菜（四張底牌），規定只能挑兩道，再搭配桌上三道公菜（公牌），不能多也不能少。就算桌上已經擺好四道同款的菜，你手上沒有兩道搭得上，還是湊不成。</div>
<ul>
<li><strong>四張底牌、正好用兩張</strong>：攤牌時必須用「2 張底牌 + 3 張公牌」組成 5 張牌。</li>
<li><strong>底池限注（Pot-Limit）</strong>：最大下注或加注就是當下的底池大小。例如 1 / 2 的遊戲，前面沒人入池，加注到底池＝先跟 2，再加上跟注後的底池 1 + 2 + 2 = 5，總共加到 7。</li>
<li><strong>PLO5</strong>：每人發 5 張底牌，但規則一樣只能用 2 張；兩張的組合從 6 種增加到 10 種，牌桌通常最多 6 人。</li>
</ul>
<div class="formula">底池加注（Pot Raise）的總額 = 跟注額 +（目前底池 + 跟注額）</div>
<div class="callout warn"><b>常見錯誤</b>公牌 <span class="cards">Ts9s4s2sKd</span>，你拿 <span class="cards">AsKh7c7d</span>，以為自己有堅果同花——其實沒有！你只有一張黑桃，無法用「正好兩張底牌」湊出同花；你的最佳牌是用 Kh、As 搭配公牌 K、T、9 組成的一對 K（A 踢腳）。德州玩家轉打 PLO 最常犯的就是這種錯。</div>
<p>PLO 的翻前勝率比德州接近得多。本站用程式模擬：德州 <span class="hand">AA</span> 對隨機牌約 85% 勝率；PLO 的 <span class="cards">AsAh7c2d</span> 對隨機四張牌只有約 61%，最好的雙同花 <span class="cards">AsAhKsKh</span> 約 71%；而 <span class="cards">AsAhKd7c</span> 對雙同花連張 <span class="cards">JhTh9d8d</span> 只有約 52%，幾乎是擲硬幣。所以 PLO 更重視「堅果潛力」與翻後技術，變異數也比德州大。同樣拿 AA，四張牌彼此配合（雙同花、連張）時勝率明顯更高；四張分散、沒有同花的牌，翻後常常只能做出不是堅果的牌，最容易輸大底池。</p>

<h3>5. 混合賽（Mixed Games）</h3>
<p>混合賽會輪流打不同的撲克，考驗全面能力。最有名的兩種：</p>
<ul>
<li><strong>H.O.R.S.E.</strong>：限注德州（Limit Hold'em）、奧馬哈高低（8 or Better）、Razz（七張梭哈比小）、七張梭哈（Stud）、七張梭哈高低（Stud 8 or Better），多半是限注（Fixed-Limit）。</li>
<li><strong>8-Game</strong>：在 H.O.R.S.E. 之外再加入 2-7 三次換牌（Triple Draw）、無限注德州與 PLO。</li>
</ul>
<p>限注遊戲的下注額固定，很難靠一次大注逼退對手，算牌與起手牌選擇更重要；比小的遊戲則要重新適應「越小越好」的牌型：Razz 的 A 永遠算小、順子與同花不算數，最好的牌是 A-2-3-4-5；2-7 的 A 算大、順子與同花都會「扣分」，最好的牌是不同花的 2-3-4-5-7。</p>

<h3>6. 怎麼選？以及法律與理性娛樂</h3>
<table class="tbl"><thead><tr><th>你的情況</th><th>建議先專精</th></tr></thead><tbody>
<tr><td>剛學會規則、想打好基本功</td><td>小級別 6-max 現金桌（或免費練習），搭配本站範圍表</td></tr>
<tr><td>週末有一整段時間、喜歡比賽感</td><td>MTT，並先讀懂 ICM 與短碼打法</td></tr>
<tr><td>時間零碎、想專練短碼</td><td>SNG 或 Spin &amp; Go，先背熟推擠範圍</td></tr>
<tr><td>德州已經很熟、想要新挑戰</td><td>PLO 或短牌，先從最小級別開始</td></tr>
</tbody></table>
<div class="callout tip"><b>實戰小技巧</b>同一時期只主攻一種形式。每種形式的範圍、籌碼深度與心態都不同，什麼都打一點，最後每種都只是半桶水；等主力形式穩定獲利，再慢慢擴展。也要依形式準備資金：大致上現金桌變異最小，SNG 次之，MTT 與 Spin &amp; Go 最大；變異越大，需要的買入數越多。</div>
<div class="callout pro"><b>進階補充</b>形式也會改變你該學的技術比重：現金桌深碼重視翻後與平衡；MTT 與 SNG 重視籌碼深度與 ICM；Spin &amp; Go 幾乎都在 25bb 以下，推擠與單挑最重要；PLO 因為底池限注，翻前很難直接全下，比德州更吃翻後技術。</div>
<div class="callout warn"><b>法律與理性娛樂</b>各國與各地區對撲克與博弈的規範差異很大，請先確認並遵守當地法律。以台灣為例，依 2022 年修正施行的刑法第 266 條，在公共場所或以網路、電子通訊等方式賭博財物，可處新臺幣 5 萬元以下罰金（以供人暫時娛樂之物為賭者除外）。本站內容以學習策略與數學為目的；若要打牌，請只用事先設定、輸光也不影響生活的娛樂預算，絕不借錢或追輸。</div>
<p>下一步：選定形式後，錦標賽玩家接著讀 <a href="#/learn/mtt-basics">錦標賽（MTT）入門</a> 與 <a href="#/learn/icm-pushfold">ICM 與短碼推擠</a>；PLO 常出現多人底池，可以參考 <a href="#/learn/multiway">多人底池策略</a>；想知道怎麼挑到好牌局，看 <a href="#/learn/game-selection">選桌、時段與實戰習慣</a>。最後到 <a href="#/quiz/theory?topic=game-formats">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'Upswing Poker — How to Play Short Deck Hold\'em | Short Deck Poker Rules & Strategy', url: 'https://upswingpoker.com/short-deck-six-plus-holdem-strategy/' },
    { title: 'Wikipedia — Six-plus hold \'em', url: 'https://en.wikipedia.org/wiki/Six-plus_hold_%27em' },
    { title: 'Upswing Poker — 5-Card PLO Rules', url: 'https://upswingpoker.com/poker-rules/5-card-plo-rules/' },
    { title: 'PokerNews — The Complete Guide to Spin and Go Poker', url: 'https://www.pokernews.com/strategy/spin-and-go-poker-36231.htm' },
    { title: '桃園市政府 — 刑法第 266 條網路賭博修法說明', url: 'https://wrb.tycg.gov.tw/News_Content.aspx?n=10904&s=1062253' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'game-formats-01', topic: 'game-formats', lv: 1,
    q: '在短牌（Short Deck / 6+，拿掉 2–5 的 36 張牌）中，同花和葫蘆哪一個比較大？',
    opts: ['同花比較大', '葫蘆比較大', '一樣大，平分底池', '看花色決定'],
    ans: 0,
    exp: '短牌每種花色只剩 9 張，同花比葫蘆更難湊成，所以短牌把同花排在葫蘆之上。這是短牌與德州撲克最關鍵的牌型差異，上桌前一定要確認。' },
  { id: 'game-formats-02', topic: 'game-formats', lv: 1,
    q: '短牌中，最小的順子是哪一個？',
    opts: ['A-6-7-8-9', 'A-2-3-4-5', '6-7-8-9-T', '短牌沒有順子'],
    ans: 0,
    exp: '短牌拿掉了 2 到 5，所以 A-2-3-4-5 不存在；A 仍然可以當最小牌，和 6-7-8-9 組成最小的順子。6-7-8-9-T 比 A-6-7-8-9 大。' },
  { id: 'game-formats-03', topic: 'game-formats', lv: 2,
    q: 'PLO 公牌是 T♠ 9♠ 4♠ 2♠ K♦，你的四張底牌是 A♠ K♥ 7♣ 7♦。你有同花嗎？',
    opts: ['沒有：必須正好用兩張底牌，你只有一張黑桃', '有：A♠ 加上四張公牌黑桃就是堅果同花', '有：PLO 可以用任意張數的底牌', '要看對手有沒有黑桃'],
    ans: 0,
    exp: 'PLO 攤牌必須用「正好 2 張底牌 + 3 張公牌」。你只有一張黑桃，無法湊出同花；最佳牌是用 K♥、A♠ 搭配公牌 K、T、9 的一對 K。德州玩家轉打 PLO 時最常犯這種錯。' },
  { id: 'game-formats-04', topic: 'game-formats', lv: 1,
    q: '常見的 Spin & Go 起始 500 籌碼、盲注 10 / 20。開局時每位玩家有幾個大盲？',
    opts: ['25bb', '50bb', '100bb', '10bb'],
    ans: 0,
    exp: '500 ÷ 20 = 25bb。再加上盲注每 2–5 分鐘就升級，Spin & Go 幾乎都在短碼狀態，推擠範圍與單挑技巧是最重要的基本功。' },
  { id: 'game-formats-05', topic: 'game-formats', lv: 2,
    q: '為什麼 6-max 的開池範圍通常比 9 人全桌寬？',
    opts: ['盲注更常輪到你（每手平均 0.25bb 對約 0.17bb），而且要打敗的人更少', '6-max 的牌比較好', '6-max 不允許溜入', '9 人桌的盲注比較小'],
    ans: 0,
    exp: '每圈盲注 1.5bb，6 人分攤是每手 0.25bb、9 人分攤約 0.17bb，所以 6-max 更不能只等大牌；同時你後面要過的人更少，被大牌壓制的機率較低，開池範圍自然更寬。' },
  { id: 'game-formats-06', topic: 'game-formats', lv: 1,
    q: '關於 PLO5，下列敘述何者正確？',
    opts: ['每人發 5 張底牌，但攤牌時仍必須正好用 2 張', '每人發 5 張底牌，可以用 3 張底牌組牌', '每人發 4 張底牌，下注是無限注', '每人發 5 張底牌，比小的牌贏'],
    ans: 0,
    exp: 'PLO5 只是多發一張底牌，讓兩張組合從 6 種增加到 10 種；組牌規則與 PLO 相同（正好 2 張底牌 + 3 張公牌），下注同樣是底池限注，比大不比小。' },
  { id: 'game-formats-07', topic: 'game-formats', lv: 1,
    q: '下列哪一個做法最符合「遵守法律、理性娛樂」的原則？',
    opts: ['先確認當地法律，只用事先設定、輸光也不影響生活的預算', '輸了就借錢追回來', '在法律不允許的地方偷偷用網路賭錢', '把生活費拿去追 Spin & Go 高倍數'],
    ans: 0,
    exp: '各地法規不同，必須先確認；例如台灣刑法第 266 條處罰以網路等方式賭博財物的行為。即使在合法環境，也只能用輸得起的娛樂預算，絕不借錢、追輸或動用生活費。' }
);

// ===========================================================================
// 7. Solver 入門：怎麼用 GTO 軟體學習
// ===========================================================================
GTO.THEORY.push({
  id: 'solver-basics',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: 'Solver 入門：怎麼用 GTO 軟體學習',
  icon: '🤖',
  level: 3,
  minutes: 15,
  tldr: 'Solver 讓兩個 AI 互相找漏洞直到均衡；用它學「為什麼」而不是背頻率，從常見局面與彙總報告開始。',
  plain: 'Solver 像一台無限對練機：讓兩個電腦玩家把同一個局面打上百萬次，每次都檢討「剛剛換個打法會不會多賺」，再一點一點修正，直到誰都抓不到對方的漏洞。它給你的是標準答案，但你真正要學的是解題思路。',
  summary: '白話說明 Solver 與 CFR 怎麼找到均衡、常用工具各自的用途，學會用彙總報告、手牌分類與 Node Locking 學習，並了解 Solver 的限制與即時輔助（RTA）禁令。',
  keyPoints: [
    'Solver 是「最大化 EV 的演算法」：用 CFR 反覆計算每個選擇少賺多少（遺憾值），逐步修正，直到雙方都無法再改進＝納許均衡。',
    '輸入決定輸出：下注尺度、範圍、籌碼深度、抽水都由你設定，設定錯了，Solver 會非常精準地給出錯的答案。',
    '學習順序：先挑一個常見局面（例如 BTN vs BB 單一加注底池）→ 看彙總報告找規律 → 用手牌分類理解原因 → 研究例外 → 再練習。',
    'EV 差很小的混合策略不必死背，挑一個簡化打法；把力氣花在 EV 差距大的決策。',
    'Node Locking 能回答「對手犯這個錯時我該怎麼改」，但預設對手在其他地方仍然完美；打牌時即時使用 Solver（RTA）在幾乎所有平台都屬作弊。'
  ],
  html: `
<h3>1. Solver 是什麼？兩個 AI 互相找漏洞</h3>
<p>Solver（求解器）是計算撲克均衡策略的程式。GTO Wizard 的說明很精闢：Solver 其實「不知道」什麼是納許均衡，它只是<strong>最大化 EV 的演算法</strong>——讓兩個只想多贏錢的電腦玩家互相針對，直到誰都無法再改進，那個點就是均衡（GTO）。</p>
<ol class="steps">
<li><b>隨機開始</b>每個決策點的每個動作先給一樣的機率。</li>
<li><b>計算遺憾值（Regret）</b>對每一手牌算：「如果剛剛改用別的動作，對上對手目前的策略，會多賺多少？」</li>
<li><b>修正策略</b>把頻率往遺憾值高（更賺錢）的動作移一點；換對手做同樣的事。</li>
<li><b>不斷重複</b>每一輪叫一次迭代（Iteration），依局面大小需要幾千到幾十億次，直到雙方都幾乎沒有可以改進的地方。</li>
</ol>
<p>這個方法叫 <strong>CFR（Counterfactual Regret Minimization，反事實遺憾最小化）</strong>，2007 年由加拿大亞伯達大學的 Martin Zinkevich 等人發表，並證明在兩人零和遊戲中會收斂到均衡。「反事實」指的就是「假如當初選了另一條路」的比較。</p>
<p>均衡策略保證什麼？在兩人零和的情境下，照均衡打的一方長期不會被任何策略打敗（不計抽水）；但它只是「不輸」的保證，不代表能從弱對手身上贏到最多。這就是為什麼實戰還需要剝削打法。</p>
<div class="callout key"><b>重點：解得多準才算準？</b>Solver 用 Nash Distance（納許距離）衡量精準度：對手若完全針對你目前的策略，最多能多贏多少（以底池百分比表示）。GTO Wizard 指出，納許距離低於 1% 底池策略才開始收斂，多數職業玩家認為差於 0.5% 就不可接受；他們的解答約解到 0.1%–0.3%。</div>

<h3>2. 常見工具：各自擅長什麼？</h3>
<table class="tbl"><thead><tr><th>工具</th><th>類型</th><th>主要用途</th></tr></thead><tbody>
<tr><td><strong>PioSOLVER</strong></td><td>電腦版翻後 Solver</td><td>自訂單挑翻後局面、彙總報告、Node Locking，業界常用的標竿</td></tr>
<tr><td><strong>GTO+</strong></td><td>電腦版翻後 Solver</td><td>介面直覺、價格親民的自訂翻後求解</td></tr>
<tr><td><strong>Simple Postflop</strong></td><td>電腦版 Solver 套件</td><td>翻後求解與彙總，另有多人底池、翻前等模組</td></tr>
<tr><td><strong>GTO Wizard</strong></td><td>雲端解答庫 + AI 求解</td><td>直接查現金桌、MTT、Spin &amp; Go 的預算解答，內建練習模式與手牌分析</td></tr>
<tr><td><strong>MonkerSolver</strong></td><td>翻前 / 多人 / 奧馬哈</td><td>產生翻前範圍表、多人底池與 PLO，需要很強的電腦</td></tr>
<tr><td><strong>HRC、ICMIZER</strong></td><td>錦標賽 ICM 工具</td><td>泡沫期、決賽桌、推擠與 ICM 計算（HRC 也提供 FGS 未來局面模擬）</td></tr>
</tbody></table>
<p>新手不需要一開始就買最貴的工具：先用現成的解答庫或範圍表學翻前，等你知道自己想研究哪些局面，再考慮自訂求解的軟體。工具也有翻前、翻後之分：本站這類翻前範圍表，通常來自能處理翻前與多人的 Solver；單挑翻後細節則多用 PioSOLVER、GTO+ 這類翻後工具研究。</p>
<p>傳統 Solver 每次迭代都要把翻牌之後所有的轉牌、河牌走過一遍，所以很耗時；GTO Wizard AI 則用類神經網路「估計」後面街道的價值，一次只解一條街，再透過自我對弈（Self-Play）訓練，因此能在幾秒內處理自訂局面。兩種方法目標一樣，都是逼近均衡。</p>
<h4>Solver 的輸出怎麼看？</h4>
<table class="tbl"><thead><tr><th>欄位</th><th>意思</th><th>怎麼用</th></tr></thead><tbody>
<tr><td>Strategy（策略）</td><td>每手牌各動作的頻率，常用顏色表示</td><td>先看整體範圍怎麼分配，再看個別手牌</td></tr>
<tr><td>EV（期望值）</td><td>每個動作平均能贏多少</td><td>比較動作之間差多少，差很小就簡化</td></tr>
<tr><td>EQ（勝率）</td><td>攤牌時的原始勝率</td><td>判斷範圍優勢在誰手上</td></tr>
<tr><td>EQR（勝率實現）</td><td>實際拿到的 EV 相對於勝率的比例</td><td>看出位置與牌型對「把勝率變現」的影響</td></tr>
</tbody></table>

<h3>3. 輸入決定輸出：下注樹、範圍與抽象化</h3>
<div class="callout plain"><b>白話解釋</b>Solver 像導航 App：你輸入的起點、終點、允許走哪些路，決定它給的路線。設定成「只能走高速公路」，它就算出只走高速公路的最佳路線；設定錯了，它會非常精準地把你帶到錯的地方。</div>
<p>跑一個 Solver 前，你要決定：<strong>下注樹</strong>（每個節點能用哪些尺度）、雙方的<strong>起始範圍</strong>、<strong>底池與有效籌碼</strong>、<strong>公牌</strong>、要求的<strong>精準度</strong>，以及是否加入<strong>抽水或 ICM</strong>。下注尺度選項一多，樹就爆炸性變大：GTO Wizard 舉例，一個極簡的樹有約 69.7 萬個節點，而他們實際使用的複雜樹約有 8,736 萬個節點——尺度選項多 45 倍，樹大了約 125 倍。</p>
<p>因此所有 Solver 都會做<strong>抽象化（Abstraction）</strong>：限制下注尺度、把相似的手牌歸成一組、用代表性的翻牌子集合（Subset）近似全部 1,755 種翻牌。這些簡化本身就是誤差來源，而且 Solver 會「利用」你給的樹的限制。</p>

<h3>4. 怎麼用 Solver 學習：從規律到原因</h3>
<ol class="steps">
<li><b>先挑一個常見局面</b>例如 100bb、BTN 開池、BB 跟注的單一加注底池。你最常遇到的局面，研究回報最高。</li>
<li><b>先自己作答</b>打開 Solver 前，先寫下你會怎麼打、為什麼；對完答案再看差在哪，比直接看答案記得更牢。</li>
<li><b>先看彙總報告（Aggregated Report）</b>把所有翻牌的結果整合起來看平均：GTO Wizard 的例子中，這個局面 BTN 在 1,755 種翻牌上被過牌後，平均大約一半的時候 C-Bet。再依高牌、是否成對、花色、連接性分組，看策略怎麼隨牌面改變。</li>
<li><b>用手牌分類理解原因</b>把手牌分成強成牌、中等牌、聽牌、空氣，問「哪類牌在哪種牌面從下注變成過牌？」而不是背某一手牌的頻率。PioSOLVER 的彙總工具就是設計來回答「Q 高牌面平均 C-Bet 多少？」「AK 沒中時怎麼打？」這類問題。</li>
<li><b>研究例外</b>找出和平均差很多的牌面，追問「為什麼這個牌面打破規律？」例外最能幫你理解範圍優勢與堅果優勢。</li>
<li><b>看 EV，不只看頻率</b>兩個動作 EV 只差一點點時，選一個簡單的打法就好。</li>
<li><b>練習成直覺</b>用練習模式或本站測驗反覆練，把規律變成反射動作。</li>
</ol>
<div class="callout tip"><b>實戰小技巧</b>每研究完一個局面，寫下一句「人話規則」，例如「乾燥 K 高牌面，BTN 用小注高頻 C-Bet」「濕潤低牌面，翻前加注者多過牌」。一句話記得住、用得出來；一張 13×13 的頻率圖背不起來。</div>
<div class="callout example"><b>例題：一次 30 分鐘的 Solver 學習菜單</b>① 前 10 分鐘：打開「BTN vs BB 單一加注底池」的彙總報告，依翻牌高牌分組，記下 C-Bet 頻率與尺度怎麼變化。② 中間 10 分鐘：挑兩個和平均差最多的翻牌，比較雙方範圍的堅果組合，寫下原因。③ 最後 10 分鐘：用練習模式或本站測驗打 20 題同類局面，錯的題目記進錯題本。</div>

<h3>5. 牌例：用 Node Locking 測試剝削</h3>
<p><strong>節點鎖定（Node Locking）</strong>是把某個玩家在某個決策點的策略固定成你指定的樣子（例如「他河牌棄牌太多」），再讓 Solver 算出你的最佳對策。</p>
<div class="hh">
<div class="hh-title">牌例：河牌純詐唬，對手棄牌率不同時的 EV</div>
<div class="hh-row"><span class="hh-street">局面</span>河牌底池 20bb，你拿完全沒中的牌，考慮下注滿池 20bb 純詐唬。</div>
<div class="hh-row"><span class="hh-street">均衡</span>對手的最小防守頻率 MDF = 20 ÷（20 + 20）= 50%；你純詐唬需要的棄牌率 Alpha 也是 50%。均衡時詐唬的 EV 剛好約為 0，所以 Solver 會混合詐唬與放棄。</div>
<div class="hh-row"><span class="hh-street">鎖定 A</span>把對手鎖成棄牌 65%：詐唬 EV = 0.65 × 20 − 0.35 × 20 = <strong>+6bb</strong>。Solver 會把幾乎所有空氣都拿來詐唬。</div>
<div class="hh-row"><span class="hh-street">鎖定 B</span>把對手鎖成棄牌 30%：詐唬 EV = 0.3 × 20 − 0.7 × 20 = <strong>−8bb</strong>。Solver 會停止詐唬，改用更薄的價值下注。</div>
<div class="hh-row result"><span class="hh-street">重點</span>Node Locking 把「讀牌」變成可以驗證的數學：先估計對手的錯誤有多大，再看最佳對策改變多少。這也是 HUD 數據與 Solver 結合的方式。</div>
</div>
<div class="callout pro"><b>進階補充：MinES 與 MaxES</b>只鎖定一個節點時，Solver 會假設對手在其他所有節點仍然打得完美，並在前後街「修補」被鎖住的漏洞，這叫最小剝削策略（MinES）。現實中，在翻牌棄太多的對手，轉牌與河牌通常也有錯；要模擬整體漏洞得鎖很多節點（接近最大剝削 MaxES），目前的工具做多街鎖定仍然困難。</div>

<h3>6. Solver 的限制與常見誤用</h3>
<ul>
<li><strong>簡化的下注樹</strong>：結果只在你給的尺度裡最佳，換一組尺度答案就可能不同。</li>
<li><strong>假設對手完美</strong>：均衡策略是「不被剝削」，不是「從弱對手身上賺最多」；面對漏洞明顯的對手，剝削打法常常更賺。</li>
<li><strong>抽水與遊戲條件</strong>：沒有設定抽水、前注或 ICM，算出的範圍會和你實際的遊戲不同。</li>
<li><strong>多人底池與翻前</strong>：多人底池難以精確求解，翻前解答也大量依賴抽象化。</li>
<li><strong>精準度不足</strong>：納許距離太大時混合頻率很不可靠；自己跑解答要等收斂到合理精度（例如 0.5% 底池以內）再下結論。</li>
<li><strong>不認識你的對手</strong>：Solver 不知道對手的傾向，要靠 HUD、筆記與 Node Locking 把讀牌加進去。</li>
</ul>
<div class="callout warn"><b>常見錯誤</b>① 死背「這手牌下注 37%」，上桌卻不知道為什麼。② 一開始就研究冷門的 4-Bet 底池，忽略每天都會遇到的單一加注底池。③ 只看頻率不看 EV，為了 0.01bb 的差距糾結半天。④ 打牌時開著 Solver 或範圍表即時查詢（RTA, Real-Time Assistance）：幾乎所有平台都視為作弊，會被封號、沒收資金。Solver 只能在牌局外學習。</div>
<p>下一步：先確定你懂 <a href="#/learn/gto-intro">GTO 入門</a> 與 <a href="#/learn/exploit">剝削打法</a> 的差別；把實戰中標記的手牌帶進 <a href="#/learn/hand-review">如何覆盤與追蹤數據</a> 的流程；錦標賽玩家可以搭配 <a href="#/learn/icm-pushfold">ICM 與短碼推擠</a> 研究 HRC / ICMIZER 的輸出。翻前基礎可以先用 <a href="#/ranges">範圍表</a> 打底，最後到 <a href="#/quiz/theory?topic=solver-basics">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'GTO Wizard — How Solvers Work', url: 'https://blog.gtowizard.com/how-solvers-work/' },
    { title: 'GTO Wizard — GTO Wizard AI Explained', url: 'https://blog.gtowizard.com/gto-wizard-ai-explained/' },
    { title: 'GTO Wizard Help — Aggregate Reports', url: 'https://help.gtowizard.com/aggregate-reports-guide/' },
    { title: 'PioSOLVER — Flop Aggregation Reports', url: 'https://piosolver.com/blog/2026-02-04-flop-aggregation-reports/' },
    { title: 'Simple Poker — Ultimate Guide to GTO Poker Solvers', url: 'https://simplepoker.com/en/News/Ultimate_Guide_to_GTO_Poker_Solvers._Which_is_the_Best_Poker_Solver__113' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'solver-basics-01', topic: 'solver-basics', lv: 2,
    q: 'Solver 常用的 CFR（反事實遺憾最小化）演算法，大致是怎麼找到均衡的？',
    opts: ['反覆計算每個選擇「改用別的動作會多賺多少」，逐步調整策略，直到雙方都無法再改進', '從職業玩家的牌譜中統計最常見的打法', '把所有可能的牌局一次列舉出來，挑出勝率最高的牌', '依照人類專家寫好的規則逐條判斷'],
    ans: 0,
    exp: 'CFR 從隨機策略開始，對每手牌計算遺憾值（換個動作會多賺多少），把頻率往更賺錢的動作移動，雙方輪流修正、重複幾千到幾十億次，直到誰都無法再改進，也就是納許均衡。它不是統計人類牌譜，也不是人工規則。' },
  { id: 'solver-basics-02', topic: 'solver-basics', lv: 1,
    q: '想研究錦標賽泡沫期的推擠範圍與 ICM，下列哪一類工具最合適？',
    opts: ['HRC 或 ICMIZER 這類錦標賽 ICM 工具', '不設定 ICM 的單挑翻後 Solver', 'HUD 追蹤軟體', '只能算兩手牌對決的勝率計算器'],
    ans: 0,
    exp: 'HRC、ICMIZER 專門處理 ICM、推擠與決賽桌局面（HRC 還有未來局面模擬 FGS）。不設 ICM 的翻後 Solver 算的是籌碼 EV；HUD 是統計對手數據；勝率計算器只算勝率，不考慮獎金結構。' },
  { id: 'solver-basics-03', topic: 'solver-basics', lv: 2,
    q: '河牌底池 20bb，你用完全沒中的牌下注 20bb 純詐唬。若用 Node Locking 把對手鎖成棄牌 65%，這個詐唬的 EV 是多少？',
    opts: ['+6bb', '0bb', '−8bb', '+13bb'],
    ans: 0,
    exp: 'EV = 棄牌率 × 底池 − 跟注率 × 下注額 = 0.65 × 20 − 0.35 × 20 = 13 − 7 = +6bb。均衡時對手棄 50%，詐唬 EV 約為 0；若對手只棄 30%，EV 會變成 0.3 × 20 − 0.7 × 20 = −8bb。' },
  { id: 'solver-basics-04', topic: 'solver-basics', lv: 2,
    q: 'Solver 顯示某手牌下注 45%、過牌 55%，而且兩個動作的 EV 只差 0.02bb。最好的學習方式是什麼？',
    opts: ['理解兩種打法幾乎一樣好，實戰選一種簡化打法，把力氣留給 EV 差距大的決策', '一定要精準背下 45% 的頻率，並在實戰中用亂數執行', '這代表 Solver 算錯了，忽略這個局面', '只要頻率超過 40% 就一律下注'],
    ans: 0,
    exp: 'EV 幾乎相同代表這手牌在兩個動作之間「無差異」，選哪個都只損失極少的 EV。學 Solver 的重點是找出 EV 差距大的地方與背後原因，而不是死背混合頻率。' },
  { id: 'solver-basics-05', topic: 'solver-basics', lv: 1,
    q: '下列哪一項是 Solver 的真實限制？',
    opts: ['它只在你設定的下注尺度與範圍內求最佳解，並假設對手也打得完美', '它會自動辨識你牌桌上的對手是誰', '不管怎麼設定下注尺度，它算出的答案都一樣', '它可以完美解出任何多人底池'],
    ans: 0,
    exp: 'Solver 的答案受輸入限制：下注樹、範圍、籌碼、抽水都會影響結果，而且均衡策略假設對手完美。它不認識你的對手，多人底池也難以精確求解。' },
  { id: 'solver-basics-06', topic: 'solver-basics', lv: 3,
    q: '你只把對手在翻牌「面對 C-Bet 棄牌太多」這一個節點鎖定，Solver 對他在轉牌與河牌的假設是什麼？',
    opts: ['他在其他節點仍然打得完美（最小剝削策略 MinES）', '他在轉牌與河牌也會棄牌太多', '他在後面的街會完全隨機行動', 'Solver 會停止計算轉牌與河牌'],
    ans: 0,
    exp: '鎖定單一節點時，Solver 假設對手其餘地方都完美，並在前後街修補被鎖住的漏洞，這叫最小剝削策略（MinES）。要模擬對手整體的漏洞，必須鎖定更多節點。' },
  { id: 'solver-basics-07', topic: 'solver-basics', lv: 1,
    q: '線上打牌時，旁邊開著 Solver 或範圍表即時查詢每個決策（RTA），會有什麼後果？',
    opts: ['幾乎所有平台都視為作弊，可能被封號並沒收資金', '完全合法，因為只是參考資料', '只要不被對手知道就沒關係', '只有錦標賽禁止，現金桌可以'],
    ans: 0,
    exp: '即時輔助（Real-Time Assistance）讓玩家在牌局中取得電腦級的決策，破壞公平性，幾乎所有平台都在條款中禁止並積極偵測。Solver 只能用在牌局外的學習與覆盤。' }
);

// ===========================================================================
// 8. 選桌、時段與實戰習慣
// ===========================================================================
GTO.THEORY.push({
  id: 'game-selection',
  stage: 'advanced',
  part: '五、實戰與進階',
  title: '選桌、時段與實戰習慣',
  icon: '🪑',
  level: 2,
  minutes: 13,
  tldr: '你贏多少，很大一部分取決於跟誰打：挑休閒玩家多的桌、坐在魚的左邊、選對時段與級別，並固定上桌前後的流程。',
  plain: '釣魚高手不會隨便找個池塘就下竿，而是先看哪裡魚多、競爭的釣客少。打牌也一樣：同樣的技術，坐進滿是休閒玩家的桌子，和坐進滿是職業常客的桌子，收入可能差好幾倍。',
  summary: '學會用平均 VPIP、看翻牌比例、平均底池等數據挑好桌，坐在休閒玩家的左邊，選擇休閒玩家多的時段，讓級別配合資金，知道何時換桌或離桌、線上該開幾桌，並建立上桌前後的例行流程。',
  keyPoints: [
    '好桌訊號（線上 6-max）：平均 VPIP 25% 以上、看翻牌比例 35% 以上、平均底池 20bb 以上、有兩位以上的短籌碼；平均 VPIP 低於 20% 的桌子多半是常客大戰。',
    '坐在魚的左邊：他先行動、你有位置，能隔離加注、控制底池；有人實測坐魚左邊的勝率是坐右邊的兩倍以上。',
    '休閒玩家最多的時段通常是晚上、週末（尤其週五晚上）與假日；平日白天多是職業常客。',
    '級別配合資金：現金桌至少 30–50 個買入，跌回新級別約 30 個買入就降級；試升級只拿 3–5 個買入並設停損。',
    '線上從 1–2 桌開始，穩定幾週再一次加 1 桌；出現超時、誤按、機械化或容易上頭，就該減桌。'
  ],
  html: `
<h3>1. 為什麼選桌這麼重要？</h3>
<p>撲克的收入來自「你和對手的技術差距」。同一個你，坐到高手桌可能只能打平甚至被抽水吃掉利潤；坐到休閒玩家多的桌子，就算技術普通也能穩定獲利。選桌不是投機取巧，而是職業玩家每天都在做的基本功。</p>
<p>用數字感受一下（數字為示意）：假設你在好桌每百手贏 8bb、在常客桌扣掉抽水後每百手輸 1bb，每週打 5,000 手，好桌一週 +400bb、常客桌 −50bb，差了 450bb，也就是 4.5 個買入——技術完全一樣，差別只在坐哪裡。</p>
<div class="callout example"><b>例題：兩張桌子，選哪一張？</b>
<table class="tbl"><thead><tr><th>大廳數據</th><th>A 桌</th><th>B 桌</th></tr></thead><tbody>
<tr><td>平均 VPIP</td><td>31%</td><td>19%</td></tr>
<tr><td>看翻牌比例（Players per Flop）</td><td>42%</td><td>22%</td></tr>
<tr><td>平均底池</td><td>24bb</td><td>11bb</td></tr>
<tr><td>籌碼分布</td><td>2 人只有 40–60bb</td><td>5 人都是滿籌碼 100bb</td></tr>
</tbody></table>
A 桌每一項都符合好桌訊號：大家玩很多手、常常多人看翻牌、底池大、還有補碼的短籌碼（常是休閒玩家）。B 桌則是典型的常客對戰桌，你大部分時間只是在付抽水。答案：選 A 桌，並盡量坐在最鬆那位玩家的左邊。</div>

<h3>2. 怎麼找好桌：線上看數據、現場看氣氛</h3>
<table class="tbl"><thead><tr><th>訊號（線上 6-max）</th><th>好桌</th><th>壞桌</th></tr></thead><tbody>
<tr><td>平均 VPIP</td><td>25% 以上（9 人桌 22% 以上）</td><td>低於 20%：多半是緊的常客</td></tr>
<tr><td>看翻牌比例</td><td>35% 以上：常有多人底池</td><td>低於 25%：幾乎都是單挑搶盲</td></tr>
<tr><td>平均底池</td><td>20bb 以上：錢在流動</td><td>低於 12bb：被動、翻前就結束</td></tr>
<tr><td>籌碼分布</td><td>兩位以上低於 60bb 的短籌碼</td><td>四位以上滿籌碼、沒有短籌碼</td></tr>
<tr><td>候補名單</td><td>0–1 人</td><td>一堆人排隊：好桌不會好太久</td></tr>
</tbody></table>
<p>現場牌桌也能「看」出來：笑聲多、聊天熱絡、有人點啤酒調酒，通常是休閒玩家多的好桌；整桌戴降噪耳機、墨鏡、拉起連帽外套、安靜專注，多半是常客的戰場。你可以在換桌名單上登記，等好桌出現空位。</p>
<p>怎麼在現場認出休閒玩家？觀察 15–30 分鐘，留意這些訊號：</p>
<ul>
<li>常溜入、或用很弱的牌平跟大加注。</li>
<li>攤牌時亮出明顯太弱的牌，例如用 <span class="hand">J7o</span> 一路跟到河牌。</li>
<li>只買入很少籌碼，或輸了馬上補碼。</li>
<li>下注尺度奇怪：最小下注、突然超池，或強牌弱牌都同一種尺度。</li>
<li>把打牌當社交，聊天、喝酒、對輸贏不太在意。</li>
</ul>
<div class="callout tip"><b>實戰小技巧</b>先看 <a href="#/learn/player-types">玩家類型與 HUD 數據</a> 學會辨識魚與常客，再用筆記功能把每位休閒玩家標記起來（例如用顏色分類）。之後打開大廳，先找「有標記魚」的桌子，比只看平均數據更準。</div>

<h3>3. 座位選擇：坐在魚的左邊</h3>
<div class="callout plain"><b>白話解釋</b>坐在魚的左邊，就像打球時總是在對手出手「之後」才決定怎麼防守：他每次出招，你都已經看清楚了。反過來坐在他右邊，你得先出手，再看他亂打。</div>
<ul>
<li><strong>翻後有位置</strong>：他入池時你幾乎都在他後面行動，價值下注、控制底池都更容易。</li>
<li><strong>翻前能隔離</strong>：他溜入或最小加注時，你可以用較大尺度加注，把其他人趕走、和他單挑。</li>
<li><strong>真實數據</strong>：Hand2Note 部落格作者用自己的資料庫統計，對上 VPIP 50% 以上的魚，坐在他右邊時勝率約 6.6bb/100，坐在他正左邊時升到約 15bb/100，多了一倍以上。</li>
<li><strong>反過來</strong>：盡量別坐在愛 3-Bet、愛全下的鬆凶玩家或瘋子右邊，否則你每次開池都要先面對他的反擊。</li>
</ul>
<div class="hh">
<div class="hh-title">實例：現場 1 / 2 現金桌的選桌與換位</div>
<div class="hh-row"><span class="hh-street">抵達</span>場內有三張 1 / 2 桌。你先站著觀察 10 分鐘：A 桌很安靜，四個人戴耳機；B 桌笑聲不斷，兩人點了啤酒，常常四、五個人溜入看翻牌。</div>
<div class="hh-row"><span class="hh-street">登記</span>你在 B 桌的候補名單登記，同時先坐 A 桌、用很緊的範圍打，不急著冒險。</div>
<div class="hh-row"><span class="hh-street">入座</span>B 桌空出的位子剛好在最鬆那位玩家的右邊。你先坐下，立刻向發牌員或現場人員登記換位，等他左邊的座位空出來就換過去。</div>
<div class="hh-row"><span class="hh-street">變化</span>兩小時後那位玩家離開，B 桌只剩安靜的常客，平均底池明顯變小 → 你重新評估：換到另一張熱鬧的桌子，或照預定時間收工。</div>
<div class="hh-row result"><span class="hh-street">重點</span>選桌不是坐下前做一次就結束，而是整場都在持續評估：桌子變硬了，就換；狀態變差了，就走。</div>
</div>

<h3>4. 時段與級別：何時打、打多大</h3>
<p>休閒玩家多半有工作或學業，所以最常出現在<strong>晚上、週末（尤其週五晚上）與連續假日</strong>；平台舉辦促銷活動時也會吸引大量休閒玩家。平日白天則以職業常客為主，桌子通常比較硬。線上玩家來自世界各地，記得考慮主要玩家群所在的時區。</p>
<p>選級別時也要把<strong>抽水</strong>算進去：級別越小，抽水佔底池的比例往往越高，同樣的技術差距扣掉抽水後剩得更少。Upswing 提到 Doug Polk 做小額資金挑戰時，就發現微級別現金桌抽水高到難以維持滿意的勝率，後來改以錦標賽與 SNG 為主。另外，每手都換對手的快速棄牌（Fast-fold）池無法選桌、選座，常客比例通常也較高，需要更保守的資金。</p>
<table class="tbl"><thead><tr><th>形式</th><th>建議資金（以平均買入計）</th></tr></thead><tbody>
<tr><td>線上現金桌（1 個買入 = 100bb）</td><td>至少 30–50 個買入；Upswing 的保守建議是 100 個以上</td></tr>
<tr><td>現場現金桌</td><td>約 20–40 個買入（變異較小），下風時要願意降級</td></tr>
<tr><td>一般單桌 SNG</td><td>約 60 個以上</td></tr>
<tr><td>多桌錦標賽（MTT）</td><td>約 150–300 個平均買入</td></tr>
</tbody></table>
<ol class="steps">
<li><b>升級</b>資金足以支撐新級別的建議買入數（例如 40–50 個），再正式升級。</li>
<li><b>試升級（Shot）</b>想提早挑戰，只拿出 3–5 個新級別買入，輸完就回原級別，不追加。</li>
<li><b>降級</b>跌回新級別約 30 個買入以下，立刻回到原級別重建資金，不要靠自尊硬撐。</li>
</ol>
<div class="callout warn"><b>常見錯誤</b>① 為了「打大一點比較好贏回來」而升級。② 魚離開後還留在只剩常客的桌子。③ 疲勞、上頭時不換桌也不離桌。④ 一次從 2 桌跳到 8 桌。⑤ 在法律不允許的地方或用輸不起的錢打牌。各地法規不同，請先確認並遵守當地法律（見 <a href="#/learn/game-formats">撲克遊戲種類</a> 的提醒）。</div>

<h3>5. 何時換桌或離桌？線上開幾桌？</h3>
<ul>
<li><strong>該換桌</strong>：桌上唯一的魚離開了、桌上只剩常客、有更好的桌子或「魚的左邊」空出位子。</li>
<li><strong>該離桌</strong>：出現 Tilt 訊號、覺得累或注意力下降、到了預定的時間或停損、你成了桌上最弱的人。</li>
</ul>
<p>線上多開桌是「勝率 vs 手數」的取捨：每多開一桌，你每手牌能思考的時間變少，單桌的 bb/100 會下降，但每小時看到的手數變多。PokerVIP 的建議是：從 2 桌左右開始，穩定好幾週再一次加 1 桌；多開桌不是成功的必要條件，很多職業玩家只開 4 桌甚至 1 桌。</p>
<table class="tbl"><thead><tr><th>你的狀況</th><th>建議桌數</th></tr></thead><tbody>
<tr><td>剛開始學、還在對照範圍表</td><td>1 桌</td></tr>
<tr><td>翻前已熟練、決策大多不用想</td><td>2–4 桌</td></tr>
<tr><td>出現超時、誤按、機械化打法、更容易上頭</td><td>立刻減 1–2 桌</td></tr>
</tbody></table>
<div class="callout pro"><b>進階補充</b>常客彼此之間也會「選桌」：好桌上的空位常被搶，候補名單很長的桌子很快就會變硬。除了平均數據，也要注意桌上有沒有你筆記裡的強常客；當你發現自己是桌上技術最差的那一位時，最正確的決定就是離開，這跟面子無關，只跟期望值有關。</div>

<h3>6. 每次上桌前後的例行流程</h3>
<ol class="steps">
<li><b>上桌前（5 分鐘）</b>確認資金與今天要打的級別 → 寫下時間上限與停損 → 複習一個本週重點 → 打開大廳選桌、選座位。</li>
<li><b>打牌中</b>每小時休息 5–10 分鐘；魚離開就重新評估要不要換桌；遇到想覆盤的牌立刻標記。</li>
<li><b>下桌後（10 分鐘）</b>記錄手數、輸贏（bb）、bb/100 與全下期望值（All-in EV）→ 更新對手筆記 → 從標記的牌挑 3–5 手覆盤 → 用決策品質給自己打分。</li>
<li><b>每月回顧</b>比較不同時段、桌型、級別的 bb/100（樣本夠大時），用你自己的數據修正選桌策略，例如「週五晚上的勝率明顯最好」。</li>
</ol>
<p>下一步：資金規則的細節在 <a href="#/learn/bankroll-mindset">資金管理、變異數與心態</a>；情緒管理與停損看 <a href="#/learn/mental-game">撲克心理學</a>；下桌後的覆盤與數據追蹤在 <a href="#/learn/hand-review">如何覆盤與追蹤數據</a>。最後到 <a href="#/quiz/theory?topic=game-selection">本課測驗</a> 檢查理解。</p>
`,
  sources: [
    { title: 'Deepfold — Table Selection: How to Find the Most Profitable Games', url: 'https://deepfold.co/en/blog/table-selection-and-game-choice' },
    { title: 'Hand2Note — 5 Vital Aspects of Table Selection', url: 'https://hand2note.com/pt/Blog/Features/5-vital-aspects-of-table-selection' },
    { title: 'PokerCoaching — When\'s the Best Time to Play Poker?', url: 'https://pokercoaching.com/blog/the-best-time-to-play-poker/' },
    { title: 'PokerVIP — Ultimate Guide to Multi Tabling in Online Poker', url: 'https://www.pokervip.com/strategy-articles/texas-hold-em-no-limit-intermediate/guide-to-multi-tabling-in-online-poker' },
    { title: 'Upswing Poker — Poker Bankroll Management Strategy', url: 'https://upswingpoker.com/poker-bankroll-management-strategy-2018/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'game-selection-01', topic: 'game-selection', lv: 1,
    q: '線上 6-max 大廳裡，哪一張桌子最可能是好桌？',
    opts: ['平均 VPIP 31%、看翻牌比例 42%、平均底池 24bb', '平均 VPIP 18%、看翻牌比例 21%、平均底池 10bb', '平均 VPIP 20%、六人都是滿籌碼、候補 6 人', '平均 VPIP 19%、平均底池 11bb、桌上都是你筆記裡的強常客'],
    ans: 0,
    exp: '好桌訊號是平均 VPIP 25% 以上、看翻牌比例 35% 以上、平均底池 20bb 以上：代表大家玩很多手、常多人看翻牌、錢在流動。VPIP 低於 20%、底池小、滿籌碼又有長候補的桌子，多半是常客對戰。' },
  { id: 'game-selection-02', topic: 'game-selection', lv: 1,
    q: '桌上有一位 VPIP 55% 的休閒玩家，你最想坐在他的哪個位置？',
    opts: ['他的左邊：他先行動，你翻後有位置', '他的右邊：你可以先下注給他壓力', '他的正對面：方便觀察馬腳', '離他越遠越好，避免被他的運氣影響'],
    ans: 0,
    exp: '坐在魚的左邊，他入池時你幾乎都在他之後行動，能隔離加注、控制底池、拿到更多價值。有實測顯示坐在魚正左邊的勝率是坐在右邊的兩倍以上。' },
  { id: 'game-selection-03', topic: 'game-selection', lv: 1,
    q: '一般來說，休閒玩家最多、牌桌最軟的時段通常是？',
    opts: ['晚上、週末（尤其週五晚上）與假日', '平日早上', '平日下午上班時間', '凌晨四點到六點'],
    ans: 0,
    exp: '休閒玩家多半有工作或學業，晚上、週末與假日才有空打牌，週五晚上還常有人邊喝酒邊玩。平日白天則以職業常客為主。線上也要考慮主要玩家群所在的時區。' },
  { id: 'game-selection-04', topic: 'game-selection', lv: 1,
    q: '剛開始打線上現金桌的新手，開桌數最合理的做法是？',
    opts: ['從 1–2 桌開始，穩定幾週後再一次加 1 桌', '一開始就開 8 桌，衝手數最快', '看心情，手感好時多開、手感差時也多開', '越多桌勝率越高，所以越多越好'],
    ans: 0,
    exp: '多開桌會讓每手牌的思考時間變少、單桌 bb/100 下降，也更容易上頭。新手應先把 1–2 桌打好，等決策變成直覺，再慢慢一次加 1 桌；出現超時或誤按就該減桌。' },
  { id: 'game-selection-05', topic: 'game-selection', lv: 2,
    q: '你用足夠的資金升到新級別，後來遇到下風期，資金跌到只剩新級別約 30 個買入。依常見的升降級規則，該怎麼做？',
    opts: ['回到原本的級別重建資金', '再升一級，用更大的級別快速贏回來', '繼續硬撐，因為下風期一定會結束', '把預留的生活費也存進資金'],
    ans: 0,
    exp: '降級規則要事先訂好並嚴格遵守：資金跌破新級別約 30 個買入就回原級別。升級翻本或動用生活費都會讓破產風險暴增；下風期在數學上可能比你想的更長。' },
  { id: 'game-selection-06', topic: 'game-selection', lv: 2,
    q: '下列哪一個情況，最應該立刻換桌或離桌？',
    opts: ['桌上唯一的休閒玩家離開了，剩下的都是強常客', '你剛贏了一個大底池', '輪到你當按鈕位', '桌上有一位 VPIP 60% 的玩家剛坐下'],
    ans: 0,
    exp: '好桌的價值來自休閒玩家；他一離開，桌子就變成常客對戰，你主要是在付抽水，應該換桌。剛贏大底池或輪到按鈕位都不是換桌理由，而新來的鬆玩家正是你該留下的原因。' }
);


// ===========================================================================
// 9. 如何覆盤與追蹤數據 (hand-review)
// ===========================================================================
GTO.THEORY.push({
  id: 'hand-review',
  part: '五、實戰與進階',
  stage: 'advanced',
  order: 54,
  icon: '🔍',
  title: '如何覆盤與追蹤數據',
  tag: '覆盤 · 數據 · 漏洞診斷',
  level: 2,
  minutes: 10,
  tldr: '打完牌不覆盤，就像考完試從不訂正考卷。建立「打牌標記 → 牌後四步覆盤 → 每週看數據找最大漏洞 → 單點突破」的閉環，才是從普通玩家邁向穩定贏家的最短路徑。',
  plain: '很多人打了十萬手牌還是在原地踏步，不是因為不夠努力，而是「只看輸贏結果、不看決策品質」：贏了大底池就以為自己打得好，被河牌買中就只怪運氣差。學會科學覆盤，就像給自己的牌技裝上 X 光機，哪個位置在漏錢、哪條街跟注太多，一看數據就清清楚楚。',
  summary: '掌握手牌紀錄（Hand History）的標準閱讀法、牌局後四步覆盤流程、追蹤軟體各位置勝率（bb/100）與紅藍線解讀，以及每週修正一個漏洞的閉環方法。',
  keyPoints: [
    '結果導向（Results-oriented）是覆盤最大的敵人：全下時 80% 勝率被 20% 逆轉是好決策；20% 勝率幸運買中反而是必須檢討的錯誤。',
    '打牌時養成「一鍵標記（Tag / Note）」習慣：只要當下猶豫超過 5 秒、底池超過 30bb 或不確定尺度，立刻標記，不在牌局中分心研究。',
    '四步覆盤法：① 還原翻前範圍與位置/SPR → ② 逐街寫下當下想法與對手範圍 → ③ 用底池賠率/MDF/範圍表驗算 → ④ 提煉一句下次可執行的規則。',
    '數據體檢看三個核心指標：各位置 bb/100（BTN 最賺；BB 一定是負數，多數贏家約 −20 到 −40bb/100）、VPIP / PFR 差距（約 6 點以內）、以及 WTSD / W$SD 攤牌平衡。',
    '一次只修一個漏洞（One leak at a time）：每週鎖定一個最花錢的錯誤，連續執行 5–7 天直到變成直覺，再進入下一個主題。'
  ],
  html: `
<div class="callout plain"><b>白話解釋</b>覆盤不是挑「輸最多錢的那幾手牌」出來罵自己，而是挑「當下最猶豫、不確定怎麼打才對」的手牌，冷靜算一次：如果重來一百次，怎麼打期望值最高？</div>

<h3>1. 為什麼只看輸贏會讓你學壞牌技？</h3>
<p>撲克短期充滿運氣（變異數），這會帶來兩種常見的認知陷阱：</p>
<div class="compare">
  <div>
    <h4>❌ 結果導向（看輸贏評分）</h4>
    <ul>
      <li>拿 <span class="hand">AA</span> 翻前全下被 <span class="hand">88</span> 買中三條：「我是不是不該全下？」</li>
      <li>拿 <span class="hand">J4o</span> 在前位跟注、翻牌幸運中兩對贏大池：「這手牌其實很強，下次繼續玩！」</li>
      <li>河牌胡亂詐唬剛好遇到對手棄牌，就以為自己抓到了必勝絕招。</li>
    </ul>
  </div>
  <div>
    <h4>✅ 決策導向（看期望值評分）</h4>
    <ul>
      <li>只問：「在看不見對手底牌的那一刻，我的跟注/下注是否 +EV？」</li>
      <li>翻前 <span class="hand">AA</span> 對 <span class="hand">88</span> 全下有約 80% 勝率，再來一萬次還是全下，完全不必改。</li>
      <li>就算贏了底池，只要翻前違背 <a href="#/ranges">6-Max 範圍表</a> 或翻後賠率不夠硬跟，依然列為錯誤。</li>
    </ul>
  </div>
</div>

<h3>2. 牌局中與牌局後的「四步標準覆盤法」</h3>
<p>打牌時不要一邊打一邊開工具算牌（既違反平台規則，也會讓你其他桌分心）。正確流程是<strong>「牌中標記、牌後解剖」</strong>：</p>
<ol class="steps">
  <li><b>Step 1｜牌中一鍵標記（或手機快速記 20 秒）</b>：只要遇到 ① 自己猶豫超過 5 秒、② 底池超過 30bb、③ 對手走出奇怪路線（如河牌超池或小注領先打），立刻按星號標記；現場牌局則在下一手棄牌時用手機記下「位置、有效籌碼、牌面、雙方動作」。</li>
  <li><b>Step 2｜先不看攤牌結果，還原每條街的範圍</b>：覆盤時先把結局遮住！從翻前開始問自己：對手這個位置開池有哪些牌？翻牌跟注後去掉了哪些空氣、留下了哪些一對與聽牌？轉牌這張牌對誰的範圍更有利？</li>
  <li><b>Step 3｜用三大工具定量驗算</b>：
    <ul>
      <li><strong>翻前疑問</strong>：直接對照本站 <a href="#/ranges">翻前範圍表</a>（RFI、面對開池、面對 3-Bet），檢查這手牌在不在範圍內。</li>
      <li><strong>跟注疑問</strong>：打開 <a href="#/tools">底池賠率與 MDF 計算器</a>，算出必要勝率（Required Equity），再估算手牌對抗對手價值與詐唬範圍的勝率。</li>
      <li><strong>下注尺度與頻率疑問</strong>：對照 <a href="#/learn/cbet">持續下注（C-Bet）</a>、<a href="#/learn/bet-sizing">下注尺度原理</a> 或在課後用 <a href="#/learn/solver-basics">Solver</a> 跑同一牌面。</li>
    </ul>
  </li>
  <li><b>Step 4｜寫下一句「下次能照著做的行動規則」</b>：不要只寫「這手打錯了」，要寫成具體觸發條件，例如：<em>「BB 單挑跟注 BTN 開池，在 K-7-2 彩虹面沒有擊中也沒有後門同花時，面對 1/3 底池直接棄牌，不再拿無後門的 Q9o 硬飄。」</em></li>
</ol>

<div class="callout warn"><b>常見錯誤</b>① 只覆盤輸錢的大底池，贏錢的手牌從不檢查——「走運的錯誤」最會強化壞習慣。② 先看攤牌結果再分析，結論被結果牽著走。③ 用兩三千手的位置 bb/100 下結論：樣本太小，至少累積上萬手再看趨勢。④ 一次想修十個漏洞，結果一個都沒改掉。</div>

<h3>3. 實戰覆盤範例：一手牌抓出兩個漏洞</h3>
<div class="hh">
<div class="hh-title">牌例：CO 拿 A♥J♣ 跟注 BTN 的 3-Bet（6-max 現金桌、有效籌碼 100bb）</div>
<div class="hh-row"><span class="hh-street">翻前</span>UTG、HJ 棄牌，你在 CO 拿 <span class="cards">AhJc</span> 開池 2.5bb。BTN（緊凶常客，VPIP 21 / PFR 18 / 3-Bet 8%）3-Bet 到 7.5bb，盲注棄牌，你跟注。底池 16.5bb，後手 92.5bb（SPR 約 5.6）。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">KhJd4s</span>（底池 16.5bb）你過牌，BTN 下注 5.5bb（1/3 底池），你跟注。底池 27.5bb，後手 87bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">9c</span>（底池 27.5bb）你過牌，BTN 下注 18bb（約 65% 底池），你跟注。底池 63.5bb，後手 69bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">2d</span>（底池 63.5bb）你過牌，BTN 全下 69bb（約 109% 底池），你苦思後跟注。BTN 亮出 <span class="cards">AcKc</span> 贏下底池。</div>
<div class="hh-row result"><span class="hh-street">覆盤</span>先遮住結果，照四步法逐街還原：河牌跟注需要 69 ÷（63.5 + 69 + 69）≈ 34.2% 勝率，而對手的範圍幾乎沒有詐唬（見下方分析）。</div>
</div>
<div class="callout warn"><b>這手牌用四步覆盤會抓出哪兩個關鍵錯誤？</b><br>
1. <strong>翻前錯誤（最大根源）</strong>：對照 <a href="#/learn/preflop-vs-3bet">面對 3-Bet 策略</a>，CO 在不利位置（OOP）面對 BTN 的 3-Bet 時，<span class="hand">AJo</span> 多半是<strong>棄牌</strong>（容易被 <span class="hand">AK</span>、<span class="hand">AQ</span>、<span class="hand">AJ</span>、<span class="hand">JJ+</span> 壓制，且沒位置極難實現權益；<span class="hand">AJs</span> 才能跟注）。翻前多跟這 5bb，直接導致後面輸掉整個 100bb 買入！<br>
2. <strong>轉牌與河牌錯誤</strong>：在 <span class="cards">KhJd4s9c2d</span> 這種乾燥 K 高牌面，緊兇常客在 3-Bet 底池連開三槍全下，價值範圍是 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">JJ</span>、<span class="hand">AK</span>、<span class="hand">KQs</span>，自然詐唬非常少（連 <span class="hand">QTs</span> 都在轉牌成順了）。第二大對子 <span class="cards">AhJc</span> 在轉牌面對大注就已非常勉強，河牌超池全下更是標準棄牌。</div>

<h3>4. 追蹤軟體數據體檢：五分鐘找出你在哪裡漏錢</h3>
<p>如果你在允許追蹤軟體的平台打牌（如 PokerTracker 4、Hold'em Manager 3、Hand2Note 或平台內建數據頁），累積 10,000 手以上時，可以按下面這張表做「健康檢查」：</p>
<table class="tbl">
  <thead>
    <tr><th>檢查項目</th><th>6-Max 健康參考區間</th><th>偏離時代表什麼漏洞？</th><th>對應補修課程</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><b>各位置勝率（bb/100）</b></td>
      <td>BTN 最高（約 +15 ~ +35）&gt; CO &gt; HJ &gt; UTG &gt; SB（約 −10 ~ −20）&gt; BB（約 −20 ~ −40）</td>
      <td>若 BTN/CO 不賺錢＝後位偷盲太少或翻後太被動；若 BB 明顯低於 −40bb/100＝盲注冷跟太多爛牌或面對 3-Bet 硬守。</td>
      <td><a href="#/learn/positions">六人桌位置學</a>、<a href="#/learn/blind-defense">盲注防衛與搶盲戰</a></td>
    </tr>
    <tr>
      <td><b>VPIP / PFR</b></td>
      <td>VPIP 22–28% / PFR 17–23%（差距約 6 點以內）</td>
      <td>差距 &gt; 8 點代表平跟（Cold Call）或溜入（Limp）太多；VPIP &gt; 32% 代表翻前玩太多邊緣牌。</td>
      <td><a href="#/learn/preflop-rfi">翻前 RFI 開池範圍</a>、<a href="#/learn/squeeze-coldcall">擠壓加注與冷跟陷阱</a></td>
    </tr>
    <tr>
      <td><b>3-Bet %</b></td>
      <td>約 6%–11%</td>
      <td>&lt; 5% 代表只拿 <span class="hand">QQ+</span>、<span class="hand">AK</span> 3-Bet，對手面對你很容易棄牌；&gt; 13% 代表用太多垃圾牌亂 3-Bet。</td>
      <td><a href="#/learn/preflop-3bet">3-Bet 策略</a></td>
    </tr>
    <tr>
      <td><b>Flop C-Bet / Turn C-Bet</b></td>
      <td>Flop 55%–70% / Turn 45%–55%</td>
      <td>Flop &gt; 80% 且 Turn &lt; 35%＝典型的「翻牌無腦開一槍、轉牌沒中就投降」，最容易被常客漂浮跟注（Float）搶走底池。</td>
      <td><a href="#/learn/cbet">持續下注（C-Bet）</a>、<a href="#/learn/turn-river">轉牌與河牌多街規劃</a></td>
    </tr>
    <tr>
      <td><b>WTSD（看攤牌率）與 W$SD（攤牌勝率）</b></td>
      <td>WTSD 27%–32% / W$SD 49%–55%</td>
      <td>WTSD &gt; 33% 且 W$SD &lt; 48%＝跟注站（Calling Station），河牌抓詐唬太多；WTSD &lt; 23% 且 W$SD &gt; 60%＝太容易被詐唬棄牌。</td>
      <td><a href="#/learn/river-decisions">河牌決策</a>、<a href="#/learn/defense-postflop">翻後防守</a></td>
    </tr>
  </tbody>
</table>

<div class="callout pro"><b>進階補充：怎麼看「紅線（非攤牌盈虧）」與「藍線（攤牌盈虧）」？</b><br>
追蹤軟體的走勢圖常有三條線：<strong>綠線（總盈虧）</strong>、<strong>藍線（打到攤牌的盈虧）</strong>、<strong>紅線（沒打到攤牌的盈虧）</strong>。<br>
• 在低級別（娛樂玩家多、不愛棄牌），贏家的正常圖形通常是<strong>「藍線一路往上衝、紅線緩慢往下走」</strong>——因為對跟注站少詐唬、多做厚價值下注，錢全是在攤牌贏來的。<br>
• 千萬別為了「把紅線打正」而在低級別對不棄牌的玩家瘋狂三槍詐唬！我們追求的是<strong>綠線（總獲利）最高</strong>，而不是紅線好看。</div>

<h3>5. 建立你的每週進步閉環（Weekly Study Loop）</h3>
<p>把覆盤變成固定習慣，只需要每週重複以下四件事：</p>
<ol class="steps">
  <li><b>每次牌局後（10–15 分鐘）</b>：趁記憶最新鮮時，挑出今天標記的 3 手牌跑完「四步覆盤法」，並在本站 <a href="#/wiki/leaks">常見漏洞自查表</a> 勾選自己犯過的項目。</li>
  <li><b>每週固定一天（30 分鐘）</b>：看本週的統計數據或覆盤筆記，找出<strong>重複出現最多次的 1 個錯誤</strong>（例如：「不利位置跟注 3-Bet 太寬」或「潮濕牌面 C-Bet 下太小」）。</li>
  <li><b>對症下藥練習（15 分鐘）</b>：重讀對應的課程章節，並到 <a href="#/quiz">練習中心</a> 做 20 題該主題的專項訓練（如 <a href="#/quiz/preflop">翻前決策</a>、<a href="#/quiz/spots">翻後情境</a> 或 <a href="#/quiz/theory?topic=hand-review">覆盤測驗</a>）。</li>
  <li><b>下一週牌局貼便利貼提醒</b>：在螢幕旁貼一張只寫一句話的字條（例如：<em>「OOP 面對 3-Bet，AJo / KQo 一律棄牌！」</em>），一整週只盯住這一個習慣，直到完全不犯為止。</li>
</ol>
<p>下一步：想搭配完整的每日進度表，請前往 <a href="#/learn?view=plan">30 天系統化學習計畫</a> 或閱讀 <a href="#/learn/study-plan">學習路線與高效訓練法</a>；想立刻自我體檢，可到 <a href="#/wiki/leaks">百科：41 個常見漏洞診斷</a> 逐項核對。</p>
`,
  sources: [
    { title: 'PokerTracker 4 — Official Guide & Stat Definitions', url: 'https://www.pokertracker.com/' },
    { title: 'Hand2Note — HUD & Database Analysis Software', url: 'https://hand2note.com/' },
    { title: 'Equilab（PokerStrategy）— 範圍對範圍勝率計算工具', url: 'https://www.pokerstrategy.com/poker-software-tools/equilab-holdem/' },
    { title: 'Upswing Poker — Poker Strategy Articles & Hand Analysis', url: 'https://upswingpoker.com/' }
  ]
});

GTO.QUESTIONS.push(
  { id: 'hand-review-01', topic: 'hand-review', lv: 1,
    q: '你在翻前拿 A♠ A♥ 與對手的 K♠ K♥ 打到全下（你有約 82% 勝率），結果河牌發出 K♦ 讓你輸掉 100bb。覆盤這手牌時最正確的結論是？',
    opts: [
      '翻前全下是極高期望值（+EV）的正確決策，短期輸掉只是正常變異數，打法完全不必改變',
      '下次拿 AA 不要在翻前全下，改平跟比較安全',
      '只要輸掉 100bb 就代表這手牌一定打錯了',
      '應該立刻升級去更大的牌桌把這 100bb 贏回來'
    ],
    ans: 0,
    exp: '覆盤看的是決策當下的期望值（EV），而不是單次發牌結果。AA 對 KK 翻前全下有約 82% 勝率，長期每打一次平均大賺，因一次被逆轉就改打法正是典型的「結果導向（Results-oriented）」錯誤。' },
  { id: 'hand-review-02', topic: 'hand-review', lv: 1,
    q: '牌局進行中遇到一手自己非常不確定該怎麼打的大底池，最恰當的做法是什麼？',
    opts: [
      '當下先盡力做出決定並一鍵標記（或簡短記下牌局資訊），等下桌後再完整覆盤與驗算',
      '立刻打開 Solver 把對手牌局輸入進去求即時解答',
      '接下來十手牌都不看牌桌，專心在腦中反覆後悔剛剛那手牌',
      '只挑最後有贏錢的手牌記下來，輸錢的手牌假裝沒發生'
    ],
    ans: 0,
    exp: '牌局中開 Solver 屬於禁止的即時輔助（RTA），而且在牌局中糾結上一手牌會讓你正在打的牌桌分心或上頭。正確習慣是當下快速標記（Tag），下桌後再冷靜用四步覆盤法研究。' },
  { id: 'hand-review-03', topic: 'hand-review', lv: 2,
    q: '檢視 6-Max 追蹤軟體數據時，發現某位玩家的 VPIP 是 34%、PFR 是 11%（差距高達 23%）。這代表他翻前最大的漏洞是什麼？',
    opts: [
      '溜入（Limp）與被動冷跟注（Cold Call）太多邊緣牌，缺乏主動加注',
      '翻前 3-Bet 頻率太高、打法過度激進',
      '翻前玩得太緊，只玩超強起手牌',
      '在大盲位棄牌太多，完全不防守盲注'
    ],
    ans: 0,
    exp: '健康的 6-Max 常客 VPIP 約 22–28%、PFR 約 17–23%，兩者差距通常在 6 點以內。VPIP 34% 但 PFR 只有 11%，說明他有超過 20% 的手牌是用平跟或溜入進池，屬於典型的鬆弱被動型打法。' },
  { id: 'hand-review-04', topic: 'hand-review', lv: 2,
    q: '在 6-Max 現金桌的長期位置數據中，下列哪一個現象是「完全正常」的？',
    opts: [
      '按鈕位（BTN）的 bb/100 最高，而大盲位（BB）的總體 bb/100 是負數（如 −25bb/100）',
      '大盲位（BB）應該要是全桌贏最多錢的位置',
      '槍口位（UTG）的開池頻率與獲利應該比按鈕位（BTN）更高',
      '六個位置的 bb/100 應該完全一樣'
    ],
    ans: 0,
    exp: '因為大盲位每手牌都被迫先投入 1bb 盲注且翻後常沒位置，就算是頂尖職業選手，BB 的總體 bb/100 也是負數（但比每手直接棄牌的 −100bb/100 少輸非常多，例如控制在 −20 到 −40bb/100）。主要獲利則來自 BTN 與 CO 等後位。' },
  { id: 'hand-review-05', topic: 'hand-review', lv: 2,
    q: '某位玩家的攤牌數據為「看攤牌率 WTSD 36%、攤牌勝率 W$SD 44%」，同時 Flop C-Bet 85% 但 Turn C-Bet 只有 30%。這組數據反映了哪兩個漏洞？',
    opts: [
      '防守時跟注太多弱牌到攤牌（跟注站傾向），進攻時翻牌無腦 C-Bet 但轉牌輕易放棄',
      '防守時過度棄牌，進攻時三條街都在瘋狂超池詐唬',
      '翻前玩得太緊，且從來不在翻牌圈持續下注',
      '數據完全平衡，沒有任何可被剝削的地方'
    ],
    ans: 0,
    exp: '健康 WTSD 約 27–32%、W$SD 約 49–55%；WTSD 36% 且 W$SD 44% 代表帶太多弱牌跟到河牌攤牌輸掉。而 Flop C-Bet 85% 搭配 Turn C-Bet 30% 則是典型的「一槍流」，翻牌跟注他的小注後在轉牌很容易搶走底池。' },
  { id: 'hand-review-06', topic: 'hand-review', lv: 2,
    q: '關於追蹤軟體中的「紅線（非攤牌盈虧）」與「藍線（攤牌盈虧）」，在娛樂玩家多、普遍不愛棄牌的低級別牌局中，正確的觀念是？',
    opts: [
      '專注讓綠線（總盈虧）最高；面對不棄牌的對手多做價值下注，藍線大賺、紅線略往下是健康現象',
      '不管對手跟注多黏，一定要瘋狂三槍詐唬把紅線打成正數',
      '只要紅線是負的，就代表一定在輸錢',
      '藍線往上代表詐唬太多，應該立刻減少價值下注'
    ],
    ans: 0,
    exp: '綠線（總獲利）＝藍線＋紅線。在跟注站多的低級別，最賺錢的剝削策略是減少詐唬、把價值下注打厚，因此贏家的錢主要在攤牌贏來（藍線大漲、紅線緩降）。刻意為了紅線好看而對跟注站詐唬，反而會讓總獲利暴跌。' },
  { id: 'hand-review-07', topic: 'hand-review', lv: 2,
    q: '覆盤一手牌：河牌底池 63.5bb，對手全下 69bb，你考慮用第二對跟注。跟注至少需要多少勝率？',
    opts: ['約 34.2%', '約 52.1%', '約 25%', '約 50%'],
    ans: 0,
    exp: '必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）= 69 ÷（63.5 + 69 + 69）= 69 ÷ 201.5 ≈ 34.2%。52.1% 是忘了把自己的跟注算進分母（69 ÷ 132.5）。算出門檻後，再估計對手範圍裡的詐唬是否超過三分之一。' }
);

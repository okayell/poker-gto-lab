/* GTO 撲克學院 — lessons_postflop_plus.js：翻後策略補充 6 課 */
window.GTO = window.GTO || {};
GTO.THEORY = GTO.THEORY || [];
GTO.QUESTIONS = GTO.QUESTIONS || [];

/* ---------------------------------------------------------------------------
 * 1. postflop-bet-types 翻後下注類型大全
 * ------------------------------------------------------------------------- */
GTO.THEORY.push({
  id: 'postflop-bet-types',
  stage: 'postflop',
  part: '四、翻後策略',
  title: '翻後下注類型大全',
  icon: '🧰',
  level: 2,
  minutes: 13,
  tldr: '翻後每種下注都有名字和目的：先看誰有主動權、誰有位置、上一條街發生什麼，就叫得出名字、猜得到範圍。',
  plain: '翻後動作就像籃球戰術：同樣是出手投籃，快攻上籃、外線三分、空中接力名字都不一樣，差別在誰持球、站哪裡、前一個動作是什麼。撲克也一樣，同樣是「下注」，由誰、在什麼時機下，就代表完全不同的範圍與目的。',
  summary: '用一張總表整理翻後 12 種動作：C-Bet、延遲 C-Bet、連續開火、Check Back、Donk、Probe、Float、過牌跟注 / 加注、Overbet、Block Bet、加注，說明誰用、何時用、Solver 為什麼用。',
  keyPoints: [
    '叫出動作名稱前先問三件事：誰是翻前加注者（主動權）？誰有位置？上一條街是誰下注、誰過牌？',
    '主動權方的武器是 C-Bet、延遲 C-Bet、連續開火、Overbet、Check Back；跟注方的武器是過牌跟注、過牌加注、Donk、Probe、Float、Block Bet。',
    'Solver 的 Donk 很少見，主要出現在對 BB 有堅果優勢的低連張牌面，且多用 20–33% 小注；Probe 則在 IP 翻牌過牌、範圍被封頂後常常出現。',
    'Overbet 需要三個條件：對手範圍被封頂、自己堅果較多、下注範圍極化；Block Bet 則是 OOP 中等牌用 20–33% 小注自己定價格。',
    '每次下注都要說得出目的：價值、保護（否定權益）或詐唬；加注也一樣，「加注看看他在哪裡」通常是把中等牌變成詐唬。'
  ],
  html: `
<h3>1. 先抓三個座標：主動權、位置、上一條街</h3>
<div class="callout plain"><b>白話解釋</b>想像公司開會：主管（翻前加注者）通常先發言定調；如果主管這次沉默不說話（翻牌過牌），旁邊的同事（跟注者）就有機會搶先提案——這就是 Probe。同樣是「開口說話」，<strong>誰說、坐在哪、前一輪有沒有人表態</strong>，意義就完全不同。</div>
<p>看到任何翻後下注，先問三個問題，名字和目的就自然浮現：</p>
<ol class="steps">
<li><b>誰有主動權（Initiative）？</b>翻前最後加注的人（PFR）範圍通常比較強，預設由他進攻；跟注者預設先過牌給他。</li>
<li><b>誰有位置？</b>最後行動的人（IP）可以過牌回去（Check Back）免費看牌，也可以漂浮（Float）；先行動的人（OOP）只能先表態。</li>
<li><b>上一條街發生什麼事？</b>PFR 上一街放棄下注，代表他多數想立刻做大底池的強牌不在這條路線上，範圍被封頂（Capped），跟注者就有探測（Probe）的機會。</li>
</ol>
<div class="compare"><div><h4>🔵 主動權方（PFR）常用</h4><p>C-Bet、延遲 C-Bet、連續開火（Barrel）、Overbet、Check Back</p></div><div><h4>🟠 跟注方常用</h4><p>過牌跟注、過牌加注、Donk、Probe、Float、Block Bet</p></div></div>

<h3>2. 總表：12 種翻後動作一次看懂</h3>
<table class="tbl"><thead><tr><th>動作</th><th>誰</th><th>時機</th><th>為什麼（Solver 何時用）</th><th>例子</th></tr></thead><tbody>
<tr><td><strong>持續下注 C-Bet</strong></td><td>翻前加注者</td><td>翻牌第一個下注</td><td>牌面對你的範圍有利；乾燥高張面常用 25–33% 小注高頻，潮濕面改大注、降頻</td><td>BTN vs BB，<span class="cards">As7d2c</span> 下 33%</td></tr>
<tr><td><strong>延遲 C-Bet</strong></td><td>翻前加注者（多為 IP）</td><td>翻牌過牌回去，轉牌對手再過牌時下注</td><td>翻牌過牌控池、保護過牌範圍；對手連過兩次，範圍更弱</td><td><span class="cards">Qd8s4h</span> 拿 <span class="hand">77</span> 過牌，轉牌 <span class="cards">2c</span> 下 50%</td></tr>
<tr><td><strong>連續開火 Double / Triple Barrel</strong></td><td>翻前加注者</td><td>C-Bet 被跟後，轉牌第二槍、河牌第三槍</td><td>轉牌是高張或空白牌、堅果優勢還在；跟注者範圍越跟越窄</td><td><span class="cards">Ts7s2d</span> 被跟，轉牌 <span class="cards">Ah</span> 再開火</td></tr>
<tr><td><strong>過牌回去 Check Back</strong></td><td>IP（多為 PFR）</td><td>對手過牌，你也過牌結束這條街</td><td>中等牌控池、拿免費牌；留一些好牌在過牌範圍，讓對手不敢針對</td><td><span class="cards">8s7d5c</span> 拿 <span class="cards">AhQd</span> 過牌</td></tr>
<tr><td><strong>領先下注 Donk Bet</strong></td><td>OOP 跟注者</td><td>搶在上一街進攻者之前下注</td><td>牌面讓跟注者堅果較多（低連張面），多用 20–33% 小注；整體頻率很低</td><td>BTN vs BB，<span class="cards">6d5s4c</span> BB 先下 25%</td></tr>
<tr><td><strong>探測下注 Probe Bet</strong></td><td>OOP 跟注者</td><td>IP 的 PFR 翻牌過牌後，轉牌先下注</td><td>IP 過牌範圍少有暗三條、兩對；OOP 搶回主動權、否定權益</td><td><span class="cards">Tc7d2s</span> BTN 過牌，轉牌 <span class="cards">8h</span> BB 下注</td></tr>
<tr><td><strong>漂浮 Float</strong></td><td>IP 跟注者</td><td>翻牌跟注 C-Bet，打算下一街對手過牌時搶池</td><td>位置 + 高張 / 後門聽牌；懲罰「翻牌下注、轉牌就放棄」的對手</td><td><span class="cards">9d5c2s</span> 拿 <span class="cards">QsJs</span> 跟注</td></tr>
<tr><td><strong>過牌跟注 Check-Call</strong></td><td>OOP</td><td>先過牌，面對下注選擇跟注</td><td>中等牌、抓詐牌、聽牌便宜看牌；守住 MDF，讓對手的詐唬繼續付錢</td><td><span class="cards">Ks8d3c</span> 拿 <span class="cards">Kd9c</span> 跟注 33%</td></tr>
<tr><td><strong>過牌加注 Check-Raise</strong></td><td>OOP</td><td>先過牌，對手下注後加注</td><td>極化：暗三條、兩對 + 強聽牌；懲罰高頻小注、快速做大底池</td><td><span class="cards">8d7s3c</span> 拿 <span class="hand">88</span> 加注</td></tr>
<tr><td><strong>超池下注 Overbet</strong></td><td>堅果較多的一方</td><td>多在轉牌、河牌</td><td>對手範圍封頂、自己範圍極化；逼對手拿一對面對超過底池的壓力</td><td><span class="cards">KsQh8d</span> 小注被跟，轉牌 <span class="cards">2c</span> 下 125%</td></tr>
<tr><td><strong>阻擋下注 Block Bet</strong></td><td>OOP</td><td>多在河牌，下 20–33% 小注</td><td>中等牌想拿薄價值、又不想過牌後面對大注；自己決定價格</td><td>河牌拿第二對下 25%</td></tr>
<tr><td><strong>價值加注 / 詐唬加注</strong></td><td>面對下注的任一方</td><td>任何一街</td><td>價值：會被更差的牌跟注；詐唬：用聽牌或阻擋牌逼退更好的牌</td><td>轉牌拿組合聽牌半詐唬加注</td></tr>
</tbody></table>

<h3>3. 主動權方：翻牌之後的三條路</h3>
<p>翻前加注者在翻牌的選擇，會直接決定轉牌能用哪些動作：</p>
<table class="tbl"><thead><tr><th>翻牌選擇</th><th>適合的情況</th><th>轉牌接著做什麼</th></tr></thead><tbody>
<tr><td><strong>小注 C-Bet（25–33%）</strong></td><td>範圍優勢大的乾燥高張面，接近全範圍下注</td><td>好轉牌（高張、空白牌）用大注或 Overbet 開第二槍；壞轉牌（完成對手聽牌）多過牌</td></tr>
<tr><td><strong>大注 C-Bet（66–75%）</strong></td><td>潮濕動態面，用強牌 + 強聽牌極化</td><td>強牌多半繼續開火；聽牌沒中可放棄或挑好牌繼續半詐唬</td></tr>
<tr><td><strong>過牌回去</strong></td><td>中等攤牌價值、想拿免費牌的高張，以及少數強牌（保護過牌範圍）</td><td>對手再過牌 → 延遲 C-Bet；對手 Probe → 依牌力跟注、加注或棄牌</td></tr>
</tbody></table>
<p><strong>Overbet 的三個條件</strong>（缺一不可）：① 對手範圍被封頂，例如他翻牌只跟注、沒加注，兩對和暗三條相對少；② 你的範圍有明顯更多的堅果牌；③ 你用極化範圍下注（堅果 + 詐唬，中等牌過牌）。下 125% 底池時，對手的 MDF 只有 1 ÷ 2.25 ≈ 44%，但他手上多半是一對，非常難受。</p>
<div class="callout pro"><b>進階補充</b>為什麼超池多出現在轉牌、河牌？翻牌時雙方範圍都還很寬，PFR 的優勢多半是「整體範圍較強」而不是「堅果較多」，所以常用小注；到了轉牌，行動與牌面讓雙方範圍分化（對手封頂、你堅果多），超池才發揮威力。另外 100bb 單挑底池翻牌 SPR 約 17.7：翻牌 5.5bb 底池下 33% 被跟 → 轉牌底池約 9.1bb；轉牌下 125%（約 11.4bb）被跟 → 河牌底池約 31.9bb、後手約 84.3bb，河牌仍要約 2.6 倍底池才能全下。想打光籌碼，大注與超池是必要工具。</div>

<h3>4. 跟注方的反擊：Donk、Probe、Float、Block Bet</h3>
<h4>領先下注（Donk Bet）：牌面打中跟注者時</h4>
<p>BTN 對 BB 的單挑底池裡，Solver 的 BB 在大多數翻牌<strong>幾乎不 Donk</strong>，主要只在低連張牌面（如 <span class="cards">6d5s4c</span>、<span class="cards">5h4c3d</span>、<span class="cards">7c6d5h</span>）出現。原因是 BB 的防守範圍有大量同花連張、小對子，能組成順子、兩對、暗三條；BTN 的範圍則以高張和超對為主。BB 擁有<strong>堅果優勢</strong>，又有很多怕對手免費看牌的脆弱成牌，所以先用 20–33% 小注收費。</p>
<p>轉牌也會出現 Donk：BB 翻牌跟注 C-Bet 後，轉牌發出大幅偏向 BB 的牌（例如翻牌 <span class="cards">9h8c3d</span>、轉牌 <span class="cards">6s</span> 完成 75、T7 等順子），BB 會用小注領先。</p>
<h4>探測下注（Probe Bet）：IP 翻牌放棄時</h4>
<p>IP 的 PFR 翻牌過牌，通常代表他沒有想立刻做大底池的暗三條、兩對——範圍被封頂。BB 轉牌就能用較寬的範圍探測：價值牌、想保護的中等對子、強聽牌，再配少量詐唬。轉牌是低張、中張（偏向 BB）時探測頻率高；轉牌是 A、K（偏向 BTN，而且 BTN 常把 AK、AQ 留在過牌範圍）時就多過牌。尺度以 33–50% 底池最常見。</p>
<h4>漂浮（Float）：有位置的延後進攻</h4>
<p>Float 不是亂跟。好的 Float 牌通常有<strong>高張 + 後門聽牌</strong>（例如 <span class="cards">QsJs</span> 在 <span class="cards">9d5c2s</span>），翻牌跟注，轉牌對手過牌就下注偷池（Stab）；轉牌中牌或拿到聽牌，也能繼續打。</p>
<h4>阻擋下注（Block Bet）：自己定價格</h4>
<p>OOP 拿中等牌到河牌，過牌常會面對 IP 的大注而很難跟；先下 20–33% 小注，能讓更差的對子、A 高跟注，也把攤牌的價格壓低。Solver 的小注範圍還會混入少量強牌，避免被對手肆意加注詐唬。</p>
<div class="callout tip"><b>實戰小技巧</b>新手當 BB 可以先用簡化版：翻牌<strong>一律過牌</strong>（不 Donk），用過牌跟注與過牌加注防守；等 BTN 翻牌過牌回去，轉牌再積極 Probe。這樣損失的 EV 很少，卻能避免「拿中等牌亂 Donk、被加注後不知所措」。遇到高頻 C-Bet 的對手，過牌加注本來就比 Donk 更能懲罰他。</div>

<h3>5. 加注的兩種目的：價值加注 vs 詐唬加注</h3>
<div class="compare"><div><h4>💰 價值加注（Value Raise）</h4><p>條件：對手<strong>會繼續（跟注或再加注）的範圍</strong>裡，比你差的牌要夠多——被跟注時你要領先一半以上。例：轉牌拿暗三條面對下注、河牌拿堅果同花。</p></div><div><h4>🎭 詐唬加注（Bluff Raise）</h4><p>條件：能逼退比你好的牌。翻牌、轉牌用有權益的聽牌（組合聽牌、兩頭順 + 後門花）半詐唬加注最穩；河牌則挑阻擋對手強牌的牌，例如三張黑桃牌面拿 <span class="cards">As</span>。</p></div></div>
<div class="callout warn"><b>常見錯誤</b>① 「加注看看他在哪裡」：拿中等牌加注，比你差的牌全棄、只有更好的牌會跟或再加注——你把一手能攤牌的牌變成了詐唬。② 拿中等牌亂 Donk「試水溫」：被加注就只能棄牌，等於送錢。③ 低級別牌桌上，對手在河牌<strong>加注你的下注</strong>，多數時候是堅果或接近堅果，別太愛英雄跟注。</div>

<h3>6. 牌例：從翻牌到河牌叫出每個動作</h3>
<div class="hh">
<div class="hh-title">牌例 1：BB 的 Probe 與 Block Bet</div>
<div class="hh-row"><span class="hh-street">翻前</span>BTN 開池 2.5bb，SB 棄牌，你在 BB 拿 <span class="cards">8h7h</span> 跟注。底池 5.5bb，有效籌碼 97.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Th7d2s</span>（底池 5.5bb）你過牌，BTN <strong>過牌回去（Check Back）</strong>。BTN 多數暗三條、強 Tx 會在這種乾燥面下注，所以他現在的範圍偏中等牌與空氣。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">4h</span>（底池 5.5bb）你有第二對 + 紅心同花聽（9 outs），<strong>探測下注（Probe）</strong>2.75bb（50%）。BTN 跟注，底池 11bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">2d</span>（底池 11bb）同花沒中，但你還有一對 7。過牌可能面對大注，於是下 3bb（約 27%）的<strong>阻擋下注（Block Bet）</strong>。BTN 跟注亮出 <span class="cards">6s6c</span>，你以 7 與 2 兩對贏得 17bb 底池。</div>
<div class="hh-row result"><span class="hh-street">重點</span>Check Back → Probe → Block Bet，三個名字都由「誰有主動權、誰先行動、上一街發生什麼」決定。河牌下 3bb，對手只需 3 ÷ 17 ≈ 17.6% 勝率就能跟注，所以 66、55、4x 這類更差的牌很樂意付錢。</div>
</div>
<div class="hh">
<div class="hh-title">牌例 2：BTN 的漂浮（Float）</div>
<div class="hh-row"><span class="hh-street">翻前</span>CO 開池 2.5bb，你在 BTN 拿 <span class="cards">QsJs</span> 跟注，兩個盲注棄牌。底池 6.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">9d5c2s</span>（底池 6.5bb）CO 下注 2.2bb（約 33%）。你有兩張高牌 + 後門同花 + 後門順子，<strong>跟注（Float）</strong>。底池 10.9bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">4h</span>（底池 10.9bb）CO 過牌。你下注 5.5bb（約 50%）偷池，CO 棄牌。</div>
<div class="hh-row result"><span class="hh-street">重點</span>這 5.5bb 只要 CO 棄牌率超過 5.5 ÷ 16.4 ≈ 34% 就立刻賺錢；就算被跟注，你還有 Q、J 高張可以中牌。沒有位置就很難這樣打——這正是位置的價值。</div>
</div>

<h3>7. 下一步</h3>
<p>先複習 <a href="#/learn/cbet">C-Bet 策略</a> 與 <a href="#/learn/defense-postflop">翻後防守</a>，再讀 <a href="#/learn/bet-sizing">下注尺度理論</a>，理解小注與超池各自的用途。沒位置的完整打法請看 <a href="#/learn/oop-play">沒位置（OOP）怎麼打</a>，河牌薄價值與 Block Bet 的細節在 <a href="#/learn/river-decisions">河牌三大決策</a>。最後到 <a href="#/quiz/theory?topic=postflop-bet-types">本課測驗</a> 檢查自己能不能一眼叫出動作名稱；術語忘了可以查 <a href="#/wiki/glossary/probe-bet">Probe Bet</a>、<a href="#/wiki/glossary/donk-bet">Donk Bet</a>。</p>
`,
  sources: [
    { title: 'GTO Wizard — The Turn Probe Bet', url: 'https://blog.gtowizard.com/the-turn-probe-bet/' },
    { title: 'Upswing Poker — Donk Betting 解析', url: 'https://upswingpoker.com/donk-betting-lucid/' },
    { title: 'Upswing Poker — River Block Bets', url: 'https://upswingpoker.com/river-block-bets-biggest-edge/' },
    { title: 'Upswing Poker — Floating 漂浮策略', url: 'https://upswingpoker.com/floating-poker-float-strategy/' },
    { title: 'Upswing Poker — Overbet the Turn', url: 'https://upswingpoker.com/overbet-the-turn/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'postflop-bet-types-01', topic: 'postflop-bet-types', lv: 1,
    q: 'BTN 開池、BB 跟注。翻牌 BB 過牌、BTN 也過牌；轉牌 BB 先下注。BB 這個轉牌下注叫什麼？',
    opts: ['探測下注（Probe Bet）', '領先下注（Donk Bet）', '延遲 C-Bet（Delayed C-Bet）', '漂浮（Float）'],
    ans: 0,
    exp: 'IP 的翻前加注者翻牌過牌回去，OOP 的跟注者在下一街先下注，就是 Probe。Donk 是搶在「上一街進攻者」前面下注，但翻牌沒人下注；延遲 C-Bet 是翻前加注者才會做的；Float 是有位置的人跟注、準備下一街再出手。' },
  { id: 'postflop-bet-types-02', topic: 'postflop-bet-types', lv: 2,
    q: 'BTN 開池、BB 跟注的單挑底池，下列哪個翻牌最可能讓 Solver 的 BB 用小注領先下注（Donk）？',
    opts: ['6♦ 5♠ 4♣', 'A♠ K♦ 7♣', 'K♥ 8♦ 3♣', 'Q♠ Q♦ 4♥'],
    ans: 0,
    exp: '低連張牌面打中 BB 防守範圍裡的同花連張與小對子，BB 的順子、兩對、暗三條比例較高（堅果優勢），又有很多怕免費牌的脆弱成牌，所以會用 20–33% 小注領先。A 高、K 高與高張成對牌面都偏向 BTN 的範圍，BB 幾乎全部過牌。' },
  { id: 'postflop-bet-types-03', topic: 'postflop-bet-types', lv: 2,
    q: 'CO 開池，你在 BTN 跟注。翻牌 9♦ 5♣ 2♠，CO 下注 1/3 底池，你拿 Q♠ J♠ 跟注，打算轉牌 CO 過牌就下注搶池。這種打法叫什麼？',
    opts: ['漂浮（Float）', '探測下注（Probe Bet）', '過牌加注（Check-Raise）', '阻擋下注（Block Bet）'],
    ans: 0,
    exp: 'Float 是有位置的跟注者用高張、後門聽牌等有一點權益的牌跟注 C-Bet，等對手下一街過牌再下注拿下底池。Probe 與 Block Bet 都是 OOP 的動作；你沒有先過牌，也不是加注。' },
  { id: 'postflop-bet-types-04', topic: 'postflop-bet-types', lv: 2,
    q: '河牌你在 OOP 拿第二對，想讓更差的對子跟注、又怕過牌後面對大注，於是下 25% 底池。這個下注叫什麼？如果拿空氣用同樣尺度純詐唬，需要對手棄牌多少才保本？',
    opts: ['阻擋下注；約 20%', '超池下注；約 20%', '阻擋下注；約 25%', '探測下注；約 33%'],
    ans: 0,
    exp: 'OOP 用 20–33% 小注自己定價格就是 Block Bet。純詐唬保本棄牌率 Alpha = 下注額 ÷（底池 + 下注額）= 0.25 ÷ 1.25 = 20%。直接用 25% 是常見誤算：分母要加上自己的下注。' },
  { id: 'postflop-bet-types-05', topic: 'postflop-bet-types', lv: 3,
    q: '下列哪個情況最適合在轉牌使用超池下注（Overbet）？',
    opts: ['對手翻牌只跟注、範圍被封頂，你有明顯更多的堅果牌，並用極化範圍下注', '你拿中等一對，想保護手牌不被聽牌追上', '轉牌剛好完成對手範圍裡大量的同花聽牌', '你沒有位置，而且牌面明顯偏向對手的範圍'],
    ans: 0,
    exp: 'Overbet 需要「對手封頂 + 自己堅果多 + 極化範圍」三個條件，逼對手用一對面對超過底池的壓力。中等一對用超池只會讓更差的牌棄牌、更好的牌跟注；完成對手聽牌或偏向對手的牌面，你的堅果優勢已經不見了。' },
  { id: 'postflop-bet-types-06', topic: 'postflop-bet-types', lv: 2,
    q: '朋友說：「翻牌我拿中對子，對手下注我就加注，看看他在哪裡。」這個想法最大的問題是？',
    opts: ['加注後更差的牌會棄牌、只有更好的牌會繼續，等於把能攤牌的中等牌變成詐唬', '加注在翻牌圈是違反規則的', '中對子在翻牌一定要全下才正確', '加注會讓自己之後的底池賠率變好，所以沒問題'],
    ans: 0,
    exp: '價值加注要被更差的牌跟注、詐唬加注要逼退更好的牌。拿中等牌加注兩者都做不到：比你差的牌棄掉、比你好的牌跟注或再加注，你花更多錢只換到「資訊」，而且常被迫棄掉原本能攤牌的牌。' },
  { id: 'postflop-bet-types-07', topic: 'postflop-bet-types', lv: 1,
    q: 'BTN 開池、BB 跟注。翻牌 BB 過牌、BTN 也過牌；轉牌 BB 再過牌，BTN 下注。BTN 這個轉牌下注叫什麼？',
    opts: ['延遲 C-Bet（Delayed C-Bet）', '探測下注（Probe Bet）', '領先下注（Donk Bet）', '阻擋下注（Block Bet）'],
    ans: 0,
    exp: '翻前加注者翻牌先過牌回去、轉牌對手再過牌時才下注，就是延遲 C-Bet。Probe 是 OOP 跟注者在 IP 翻牌過牌後先下注；Donk 是搶在上一街進攻者之前下注；Block Bet 是 OOP 的小注定價。' }
);

/* ---------------------------------------------------------------------------
 * 2. draws-play 聽牌怎麼打：半詐唬、跟注與放棄
 * ------------------------------------------------------------------------- */
GTO.THEORY.push({
  id: 'draws-play',
  stage: 'postflop',
  part: '四、翻後策略',
  title: '聽牌怎麼打：半詐唬、跟注與放棄',
  icon: '🎯',
  level: 2,
  minutes: 13,
  tldr: '強聽牌積極半詐唬、弱聽牌面對大注多半放棄；先數 outs、算底池賠率，再看位置、SPR 與是不是堅果聽牌。',
  plain: '聽牌像買彩券：強聽牌是一半機會中獎的刮刮樂，值得加碼；弱聽牌是十二分之一的樂透，只有獎金夠大才值得買。打聽牌就是先看清楚彩券的中獎率，再看它現在賣多少錢。',
  summary: '把聽牌分成強、中、弱三級：組合聽牌怎麼用半詐唬一次拿兩種贏法、卡順面對大注為什麼該放棄、堅果與非堅果聽牌的差別、位置與 SPR 如何改變打法，附底池賠率、隱含賠率計算與牌例。',
  keyPoints: [
    '依 outs 分級：強聽牌 12–15 outs（翻牌對一手頂對常有 45–57% 勝率）、中等聽牌 8–9 outs、弱聽牌是 4 outs 的卡順與後門聽牌。',
    '強聽牌要積極下注或加注半詐唬：對手棄牌立刻贏，被跟注還有接近一半勝率；SPR 低時常直接全下。',
    '弱聽牌面對大注先算底池賠率：轉牌面對 75% 底池需要 30% 勝率，卡順只有 8.7%，中牌後要再多贏約 122bb 才打平，所以棄牌。',
    '堅果聽牌中了賺大錢；非堅果聽牌（低同花、順子笨端）中了可能輸大錢，叫反隱含賠率，outs 要打折。',
    '有位置權益實現好，中等聽牌可以跟注、延後進攻；沒位置以過牌加注或放棄為主。SPR 越低，隱含賠率越小。'
  ],
  html: `
<h3>1. 先替聽牌分級：強、中、弱</h3>
<div class="callout plain"><b>白話解釋</b>聽牌像在站牌等公車。強聽牌是好幾路公車都能載你到目的地（15 個 outs），很快就會來；弱聽牌是只有一班車能到（卡順 4 個 outs），等很久還不一定來。<strong>車票（跟注）便宜時可以等；車票太貴，就別等那班車了</strong>。</div>
<p>聽牌強弱看兩件事：<strong>outs 數</strong>（能讓你變成最大牌的剩餘張數）與<strong>中了之後是不是堅果</strong>。假設 outs 都是乾淨的：</p>
<table class="tbl"><thead><tr><th>等級</th><th>常見聽牌</th><th>outs</th><th>翻牌→河牌</th><th>轉牌→河牌</th></tr></thead><tbody>
<tr><td><strong>強</strong></td><td>同花聽 + 兩頭順（組合聽牌）</td><td>15</td><td>54.1%</td><td>32.6%</td></tr>
<tr><td><strong>強</strong></td><td>同花聽 + 卡順</td><td>12</td><td>45.0%</td><td>26.1%</td></tr>
<tr><td><strong>中</strong></td><td>同花聽</td><td>9</td><td>35.0%</td><td>19.6%</td></tr>
<tr><td><strong>中</strong></td><td>兩頭順（OESD）</td><td>8</td><td>31.5%</td><td>17.4%</td></tr>
<tr><td><strong>弱</strong></td><td>卡順（Gutshot）</td><td>4</td><td>16.5%</td><td>8.7%</td></tr>
<tr><td><strong>弱</strong></td><td>後門同花（轉牌、河牌連中兩張）</td><td>—</td><td>約 4.2%</td><td>—</td></tr>
</tbody></table>
<p>翻牌只看到轉牌一張牌時，機率是 outs ÷ 47（同花聽 9 ÷ 47 ≈ 19.1%）。對手轉牌很可能再下注時，用「一張牌」的機率比較保守。下表可以點選任意 outs 查機率：</p>
<div class="widget" data-widget="outs-table"></div>

<h3>2. 強聽牌：積極半詐唬，兩種贏法一次拿</h3>
<p>12–15 outs 的強聽牌，翻牌時對一手頂對常常<strong>已經領先或接近五五波</strong>：<span class="cards">7h6h</span> 在 <span class="cards">9h8h2c</span> 對上 <span class="cards">As9d</span>（頂對頂踢腳）勝率約 56.8%，對上 <span class="cards">QsQc</span>（超對）約 55.4%。這種牌下注或加注，有兩種贏法：</p>
<ol class="steps">
<li><b>棄牌權益（Fold Equity）</b>對手棄牌，你立刻贏下整個底池。</li>
<li><b>權益（Equity）</b>對手跟注，你還有接近一半的機會中牌，而且底池已經變大。</li>
</ol>
<div class="formula">半詐唬 EV = 對手棄牌率 × 目前底池 + 對手跟注率 ×（你的勝率 × 最終底池 − 你投入的籌碼）</div>
<p>只會被動跟注，等於丟掉第一種贏法；而且聽牌中了的時候，對手常常看得出來而不付錢。主動加注能在你勝率高的時候把底池做大，中牌時也更隱蔽。</p>
<div class="callout pro"><b>進階補充</b>Solver 不會把每一手強聽牌都拿去加注。組合聽牌就算只跟注也非常賺，而被你逼棄的牌裡有些本來就輸給你，把它們趕走不一定划算；留一部分強聽牌在跟注範圍，也讓你的跟注範圍在轉牌出現同花、順子時不會太弱。反而像「卡順 + 後門同花」「帶高張的兩頭順」這類中等權益的牌，最依賴棄牌權益，常被選為半詐唬。</div>

<h3>3. 弱聽牌：面對大注多半放棄，除非隱含賠率夠</h3>
<p>先算<strong>底池賠率</strong>：轉牌底池 20bb，對手下注 15bb（75%），跟注需要的勝率是 15 ÷（20 + 15 + 15）= <strong>30%</strong>。河牌只剩一張時，各種聽牌對照如下：</p>
<table class="tbl"><thead><tr><th>你的聽牌</th><th>中牌機率</th><th>與 30% 比較</th><th>中牌後至少要再多贏</th><th>結論</th></tr></thead><tbody>
<tr><td>組合聽牌（15 outs）</td><td>32.6%</td><td>已超過</td><td>不需要</td><td>✅ 直接跟注就賺，常可加注</td></tr>
<tr><td>同花聽 + 卡順（12 outs）</td><td>26.1%</td><td>差一點</td><td>約 7.5bb</td><td>✅ 隱含賠率很容易補上</td></tr>
<tr><td>同花聽（9 outs）</td><td>19.6%</td><td>差約 10%</td><td>約 26.7bb</td><td>⚠️ 堅果聽牌、對手會付錢才跟</td></tr>
<tr><td>兩頭順（8 outs）</td><td>17.4%</td><td>差約 12.6%</td><td>約 36.3bb</td><td>⚠️ 看籌碼深度與對手類型</td></tr>
<tr><td>卡順（4 outs）</td><td>8.7%</td><td>差很多</td><td>約 122.5bb</td><td>❌ 超過 100bb 籌碼，棄牌</td></tr>
</tbody></table>
<div class="formula">中牌後至少要再多贏 = 跟注額 ÷ 中牌機率 −（原底池 + 對手下注 + 跟注額）</div>
<p>這就是<strong>隱含賠率（Implied Odds）</strong>：現在的價格不夠，靠中牌後多贏的錢補回來。它成立需要四個條件：籌碼夠深、中了是堅果、牌面中牌不明顯、對手是會付錢的類型。翻牌面對小注就寬鬆得多：面對 33% 下注只需約 20% 勝率，卡順到轉牌雖然只有 8.5%，但只要帶高張或後門聽牌、籌碼又深，常常仍可以跟注。</p>
<div class="callout warn"><b>常見錯誤</b>① 拿卡順跟注轉牌大注「因為說不定會中」——算完會發現中牌後要再贏 100bb 以上才打平。② 把每張 outs 都當乾淨的：成對牌面的同花聽可能輸給葫蘆，會讓對手成同花的順子牌也要打折。③ 河牌聽牌沒中就硬詐唬：對手範圍很強、不會棄牌時，放棄才是對的。④ 拿強聽牌永遠只跟注，白白丟掉棄牌權益。</div>

<h3>4. 堅果聽牌 vs 非堅果聽牌</h3>
<div class="compare"><div><h4>✅ 堅果聽牌</h4><p><span class="cards">Ah5h</span> 在 <span class="cards">Kh8h2c</span>：中同花就是最大的同花，對手的小同花會付你大錢；沒中時手上的 A 也可能變成最大的一對，或當作阻擋牌詐唬。對 <span class="cards">KsQd</span>（頂對）翻牌勝率約 45.9%（9 張紅心 + 3 張 A）。</p></div><div><h4>⚠️ 非堅果聽牌</h4><p><span class="cards">6h5h</span> 在 <span class="cards">Kh8h2c</span>：中了同花，對手的 A♥x♥、Q♥J♥ 等更大的同花會讓你輸掉大底池，這叫<strong>反隱含賠率（Reverse Implied Odds）</strong>。</p></div></div>
<p>順子也一樣。牌面 <span class="cards">JsTd4c</span> 你拿 <span class="cards">9h8h</span>（兩頭順，聽 Q 或 7）：轉牌 <span class="cards">7c</span> 給你 J-T-9-8-7，是當下的堅果；轉牌 <span class="cards">Qd</span> 雖然也成順，但對手的 AK（A-K-Q-J-T）、K9（K-Q-J-T-9）都比你大，這種「笨端（Ignorant End）」的 outs 要打折。</p>
<p><strong>經驗法則</strong>：面對大注時，非堅果聽牌的 outs 要打折；中了之後如果對手突然大力加注，要懂得收手。</p>

<h3>5. 位置與 SPR：同一手聽牌，打法不同</h3>
<table class="tbl"><thead><tr><th>比較</th><th>有位置（IP）</th><th>沒位置（OOP）</th></tr></thead><tbody>
<tr><td>權益實現</td><td>好：對手過牌時可以過牌回去，免費看下一張</td><td>差：先行動，跟注後下一街常再面對下注</td></tr>
<tr><td>中等聽牌</td><td>跟注很舒服，也能延後進攻（Float）</td><td>跟注前要先想好轉牌被大注時怎麼辦</td></tr>
<tr><td>半詐唬方式</td><td>下注、加注或延到下一街都可以</td><td>以過牌加注為主，挑強聽牌或有後門的牌</td></tr>
<tr><td>弱聽牌</td><td>面對小注可以跟</td><td>面對大注多半直接棄牌</td></tr>
</tbody></table>
<table class="tbl"><thead><tr><th>SPR</th><th>常見底池（100bb）</th><th>聽牌怎麼打</th></tr></thead><tbody>
<tr><td><strong>高（≥ 10）</strong></td><td>單次加注底池（約 17.7）</td><td>隱含賠率大：IP 可用帶高張的卡順、同花聽跟注小注；非堅果聽牌要小心反隱含賠率</td></tr>
<tr><td><strong>中（4–8）</strong></td><td>IP 3-Bet 底池（約 5.6）</td><td>強聽牌加注後通常就準備打光；中等聽牌跟注前要想清楚轉牌的價格</td></tr>
<tr><td><strong>低（≤ 4）</strong></td><td>OOP 3-Bet 底池（約 4）、4-Bet 底池（約 1.8）</td><td>隱含賠率很小，弱聽牌放棄；12 outs 以上的強聽牌傾向直接全下</td></tr>
</tbody></table>
<p><strong>低 SPR 全下怎麼算</strong>：BB 3-Bet 到 11bb、BTN 跟注，翻牌底池 22.5bb、後手 89bb。翻牌 <span class="cards">9h8h2c</span>，BB 下注 7.5bb，BTN 拿 <span class="cards">7h6h</span> 全下。BB 棄牌，BTN 立刻贏 30bb；就算被 <span class="cards">QsQc</span> 跟注，BTN 的 EV 約 55.4% × 200.5 − 89 ≈ <strong>+22bb</strong>。兩種結果都比棄牌好，這就是低 SPR 下強聽牌「直接推」的理由。</p>
<div class="callout tip"><b>實戰小技巧</b>轉牌面對下注的 10 秒流程：① 數乾淨 outs；② outs × 2 估勝率；③ 跟注額 ÷ 跟注後總底池 = 需要勝率；④ 只差一點點時才看隱含賠率（是不是堅果聽牌、對手會不會付錢、後手籌碼夠不夠）。差很多就棄牌，不要用「感覺會中」做決定。</div>

<h3>6. 牌例：組合聽牌的過牌加注</h3>
<div class="hh">
<div class="hh-title">牌例：BB 拿 7♥6♥ 反擊 BTN 的 C-Bet</div>
<div class="hh-row"><span class="hh-street">翻前</span>BTN 開池 2.5bb，SB 棄牌，你在 BB 拿 <span class="cards">7h6h</span> 跟注。底池 5.5bb，有效籌碼 97.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">9h8h2c</span>（底池 5.5bb）你過牌，BTN 下注 1.8bb（33%）。你有同花聽 + 兩頭順共 15 outs，對頂對約 57%。你<strong>過牌加注到 6bb</strong>，BTN 跟注。底池 17.5bb，後手 91.5bb（SPR 約 5.2）。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">3s</span>（底池 17.5bb）沒中，但仍有 15 outs（河牌中牌約 32.6%）。你繼續下注 11bb（約 63%）。</div>
<div class="hh-row"><span class="hh-street">結果</span>BTN 考慮很久後棄牌，你贏下 17.5bb 底池。</div>
<div class="hh-row result"><span class="hh-street">重點</span>轉牌這 11bb 只要 BTN 棄牌率超過 11 ÷ 28.5 ≈ 38.6% 就直接獲利；被跟注時還有約三分之一機會中牌、贏更大的底池。若翻牌只過牌跟注，就放棄了「逼對手棄牌」這條贏法。</div>
</div>

<h3>7. 下一步</h3>
<p>先到 <a href="#/quiz/outs">數 Outs 練習</a> 把 outs 數到不用想；接著讀 <a href="#/learn/fold-equity">棄牌權益與半詐唬</a>，學會算對手要棄牌多少，半詐唬才賺錢。底池賠率與 EV 的基礎在 <a href="#/learn/poker-math">撲克數學</a>，不同 SPR 的打法在 <a href="#/learn/spr">SPR 與籌碼承諾</a>，位置對權益實現的影響可複習 <a href="#/learn/equity-realization">權益實現</a>。最後用 <a href="#/quiz/theory?topic=draws-play">本課測驗</a> 與 <a href="#/quiz/math">數學練習</a> 驗收。</p>
`,
  sources: [
    { title: 'GTO Wizard — Picking the Right Semi-Bluffs', url: 'https://blog.gtowizard.com/picking-the-right-semi-bluffs/' },
    { title: 'Upswing Poker — Semi-Bluff Poker Strategy', url: 'https://upswingpoker.com/semi-bluff-poker-strategy/' },
    { title: 'Upswing Poker — Implied Odds 隱含賠率', url: 'https://upswingpoker.com/implied-odds-poker-strategy/' },
    { title: 'GTO Wizard — Stack-to-Pot Ratio', url: 'https://blog.gtowizard.com/stack-to-pot-ratio/' },
    { title: 'PokerStrategy — When NOT to bluff with a strong draw', url: 'https://www.pokerstrategy.com/news/content/When-NOT-to-bluff-with-a-strong-draw_131203/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'draws-play-01', topic: 'draws-play', lv: 1,
    q: '翻牌你拿同花聽 + 兩頭順（15 outs）。用二四法則（outs 大於 8 時要修正）估算，到河牌的中牌機率大約是多少？',
    opts: ['約 53%', '約 60%', '約 30%', '約 45%'],
    ans: 0,
    exp: '翻牌到河牌用 outs × 4，outs 大於 8 時再減去（outs − 8）：15 × 4 − 7 = 53%，精確值約 54.1%。直接用 60% 會高估；30% 是只看一張牌（outs × 2）的機率；45% 是 12 outs 的數字。' },
  { id: 'draws-play-02', topic: 'draws-play', lv: 2,
    q: '轉牌底池 20bb，對手下注 15bb。你只有卡順（4 outs，河牌中牌約 8.7%）。跟注需要多少勝率？該怎麼做？',
    opts: ['需要 30%；差太多，除非中牌後能再多贏約 120bb 以上，否則棄牌', '需要 43%；但卡順有隱含賠率，可以跟注', '需要 15%；8.7% 雖然不夠但差不多，跟注', '需要 30%；卡順中了很隱蔽，所以一定要跟注'],
    ans: 0,
    exp: '需要勝率 = 15 ÷（20 + 15 + 15）= 30%。中牌後至少要再多贏 = 15 ÷ 0.087 − 50 ≈ 122.5bb，比 100bb 的有效籌碼還多，隱含賠率不可能補回來，應該棄牌。' },
  { id: 'draws-play-03', topic: 'draws-play', lv: 2,
    q: '下列哪一手聽牌的「反隱含賠率」最高、中了也要特別小心？',
    opts: ['牌面 K♥ 8♥ 2♣，你拿 6♥ 5♥（低張同花聽）', '牌面 K♥ 8♥ 2♣，你拿 A♥ 5♥（堅果同花聽）', '牌面 9♥ 8♥ 2♣，你拿 7♥ 6♥（同花聽 + 兩頭順）', '牌面 Q♠ J♦ 4♣，你拿 K♠ T♠（兩頭順，兩端都成堅果順）'],
    ans: 0,
    exp: '6♥5♥ 中了同花，仍可能輸給 A♥x♥、Q♥J♥ 等更大的同花，常在大底池輸錢，這就是反隱含賠率。A♥5♥ 是堅果同花聽；K♠T♠ 中 A 或 9 都是堅果順；7♥6♥ 的同花與順子 outs 大多也很強。' },
  { id: 'draws-play-04', topic: 'draws-play', lv: 2,
    q: 'OOP 3-Bet 底池（SPR 約 4），翻牌你拿組合聽牌，對上超對約有 55% 勝率，對手下注 1/3 底池。一般來說哪個打法最好？',
    opts: ['直接全下：棄牌權益加上權益一次兌現，就算被跟注 EV 也是正的', '棄牌，因為對手 3-Bet 範圍很強', '只跟注，等中牌再下注', '跟注到河牌，不論中不中都不加注'],
    ans: 0,
    exp: 'SPR 低時隱含賠率很小，強聽牌的價值來自「現在的勝率 + 棄牌權益」。例如底池 22.5bb、後手 89bb 時全下，被超對跟注的 EV 約 55% × 200.5 − 89 ≈ +22bb，對手棄牌則立刻贏 30bb。只跟注會在轉牌沒中時面對難受的全下決定。' },
  { id: 'draws-play-05', topic: 'draws-play', lv: 3,
    q: '為什麼 Solver 不會把所有強聽牌（例如組合聽牌）都拿去加注半詐唬？',
    opts: ['強聽牌只跟注也很賺，逼對手棄牌時有些被趕走的牌本來就輸給你；留一些在跟注範圍也能保護跟注範圍', '因為強聽牌中牌機率太低，不值得投資', '因為加注聽牌違反 MDF 最小防守頻率', '因為強聽牌只能在河牌使用'],
    ans: 0,
    exp: '半詐唬的價值在於棄牌權益，而勝率很高的組合聽牌就算被動跟注也有很高 EV；把本來就領先的牌逼棄並不划算。Solver 會混合跟注與加注，並常用卡順 + 後門花這類中等權益的牌來半詐唬。' },
  { id: 'draws-play-06', topic: 'draws-play', lv: 2,
    q: '同樣拿一手中等聽牌（例如同花聽），有位置和沒位置的差別，哪個說法正確？',
    opts: ['有位置時權益實現較好，可以跟注、對手過牌時拿免費牌或延後進攻；沒位置跟注後下一街常再面對下注', '沒位置比較好，因為可以先下注搶主動', '位置對聽牌沒有影響，只看 outs 數', '有位置時聽牌一定要加注，不能跟注'],
    ans: 0,
    exp: 'IP 最後行動，對手過牌時可以過牌回去免費看牌，中等聽牌的權益比較能實現；OOP 先行動，跟注後轉牌常被再次下注逼退，所以 OOP 的聽牌多用過牌加注或在面對大注時放棄。' },
  { id: 'draws-play-07', topic: 'draws-play', lv: 2,
    q: '轉牌底池 20bb，對手下注 15bb，你拿堅果同花聽牌（9 outs，河牌中牌約 19.6%）。只靠現在的賠率不夠，中牌後至少要再多贏多少才打平？',
    opts: ['約 26.7bb', '約 7.5bb', '約 36.3bb', '不需要，現在的賠率已經足夠'],
    ans: 0,
    exp: '需要勝率 = 15 ÷（20 + 15 + 15）= 30%，19.6% 不夠。中牌後至少要再多贏 = 15 ÷（9 ÷ 46）− 50 ≈ 76.7 − 50 ≈ 26.7bb。7.5bb 是 12 outs、36.3bb 是 8 outs 的數字。對手會付錢、籌碼夠深時，堅果同花聽牌才值得跟。' }
);

/* ---------------------------------------------------------------------------
 * 3. hand-reading 讀牌：一條街一條街縮小對手範圍
 * ------------------------------------------------------------------------- */
GTO.THEORY.push({
  id: 'hand-reading',
  stage: 'postflop',
  part: '四、翻後策略',
  title: '讀牌：一條街一條街縮小對手範圍',
  icon: '🔍',
  level: 3,
  minutes: 14,
  tldr: '讀牌不是猜對手拿哪一手，而是從翻前範圍開始，每條街依行動刪掉不合理的牌，最後數價值與詐唬各有幾組。',
  plain: '讀牌像偵探辦案：一開始嫌犯有兩百人，每多一條線索（位置、下注、尺度）就刪掉一批不符合的人。到了河牌名單只剩幾十人，數一數「真兇」和「無辜的人」各有幾個，就知道該不該跟注。',
  summary: '專業讀牌流程：翻前範圍 → 翻牌 → 轉牌 → 河牌逐街過濾；用 6 / 4 / 12 規則算組合數與卡牌移除；用尺度與時機判斷範圍形狀；把範圍分成價值、中段、詐唬，附一手每條街都數組合的完整牌例。',
  keyPoints: [
    '讀牌是追蹤「範圍」而不是猜一手牌：翻前依位置定範圍，每條街問「哪些牌會這樣打」，把不符合的刪掉。',
    '組合數：對子 6、同花 4、不同花 12；牌面與自己手上的牌會移除組合，例如牌面有一張 K 時，KK 剩 3 組、AK 剩 12 組。',
    '尺度是線索：小注範圍寬且合併、幾乎不縮範圍；大注與超池範圍極化、中等牌大多消失；過牌代表範圍被封頂。',
    '河牌把對手範圍分成價值、中段、詐唬；純抓詐牌的勝率 = 詐唬 ÷（價值 + 詐唬），對手下滿池時需要 33.3%。',
    '速算：價值組合 ÷ 2 = 對手下滿池時你打平所需的詐唬數；他實際會詐唬的組合比這少，就棄牌。'
  ],
  html: `
<h3>1. 讀牌不是猜一手牌，而是縮小嫌犯名單</h3>
<div class="callout plain"><b>白話解釋</b>讀牌很像玩「終極密碼」：一開始答案在 1–100 之間，每次聽到「比 50 大」「比 75 小」，範圍就縮小一次，最後只剩幾個數字。對手的每個動作（開池位置、下注尺度、過牌）都是一次提示——你不需要一次猜中答案，只要每次都把範圍縮對。</div>
<p>新手常說「我覺得他有 AK」；高手會說「他這樣打，範圍裡大概有 39 組價值、33 組詐唬」。讀牌的標準流程只有四步：</p>
<ol class="steps">
<li><b>翻前定範圍</b>依位置與動作（開池、跟注、3-Bet）寫下對手的起始範圍。</li>
<li><b>每條街過濾</b>問自己：「範圍裡哪些牌會這樣打？哪些不會？」把不會的刪掉。</li>
<li><b>算組合數</b>用 6 / 4 / 12 規則，扣掉牌面和你手上的牌。</li>
<li><b>分三類</b>把剩下的範圍分成價值、中段、詐唬，再和底池賠率比較。</li>
</ol>

<h3>2. 組合數：讀牌的計算機</h3>
<p>每種起手牌的組合數是固定的：<strong>口袋對子 6 組、同花 4 組、不同花 12 組</strong>（全部 1326 組）。但牌面和你手上的牌會「用掉」一些牌，組合數就跟著減少：</p>
<div class="formula">對子組合數 = 剩下張數 × (剩下張數 − 1) ÷ 2；非對子組合數 = 第一張剩下張數 × 第二張剩下張數</div>
<table class="tbl"><thead><tr><th>手牌</th><th>沒有移除</th><th>翻牌 <span class="cards">KsTs4d</span> 後</th><th>再扣掉你的 <span class="cards">JhJc</span></th></tr></thead><tbody>
<tr><td><span class="hand">KK</span></td><td>6</td><td>3（K 剩 3 張）</td><td>3</td></tr>
<tr><td><span class="hand">AA</span></td><td>6</td><td>6</td><td>6</td></tr>
<tr><td>AK（同花 + 不同花）</td><td>16</td><td>12（4 × 3）</td><td>12</td></tr>
<tr><td>KT（同花 + 不同花）</td><td>16</td><td>9（3 × 3）</td><td>9</td></tr>
<tr><td><span class="hand">QJs</span></td><td>4</td><td>4</td><td>2（只剩 Q♠J♠、Q♦J♦）</td></tr>
<tr><td><span class="hand">AJo</span></td><td>12</td><td>12</td><td>6（J 只剩 2 張）</td></tr>
</tbody></table>
<p>看最後兩行：你手上的兩張 J 擋掉了對手一半的 QJ、AJ，而這些正是 <span class="cards">KsTs4d</span> 上的順子聽牌——也就是對手未來可能拿來詐唬的牌。這就是<strong>阻擋牌（Blocker）</strong>影響讀牌的方式。</p>

<h3>3. 一條街一條街縮小範圍</h3>
<table class="tbl"><thead><tr><th>街道</th><th>你要問的問題</th><th>通常會刪掉什麼</th></tr></thead><tbody>
<tr><td><strong>翻前</strong></td><td>他從哪個位置、用什麼動作入池？</td><td>UTG 開池約 17%、BTN 約 45%；只跟注 3-Bet 的人，通常少了會 4-Bet 的 AA、KK</td></tr>
<tr><td><strong>翻牌</strong></td><td>牌面打中他哪些牌？下注還是過牌、尺度多大？</td><td>跟注下注的人，多半刪掉完全沒中、沒有後門的空氣；小注 C-Bet 幾乎不刪任何牌</td></tr>
<tr><td><strong>轉牌</strong></td><td>轉牌幫了誰？他繼續開火還是放慢？</td><td>大注繼續開火 → 刪掉大部分只想攤牌的中等牌；過牌 → 刪掉大部分強牌</td></tr>
<tr><td><strong>河牌</strong></td><td>哪些聽牌中了、哪些破產？下注是極化還是合併？</td><td>大注 → 範圍分成價值與詐唬兩端，中段幾乎消失；小注 → 中等牌與薄價值較多</td></tr>
</tbody></table>
<p><strong>翻前範圍決定一切</strong>：同樣是 <span class="cards">7s6s5d</span> 翻牌，UTG 的簡化開池範圍扣掉牌面後約 202 組，能組成順子、暗三條、兩對的只有 <span class="hand">98s</span> 4 組、<span class="hand">77</span> / <span class="hand">66</span> / <span class="hand">55</span> 各 3 組、<span class="hand">76s</span> 3 組，共 16 組（約 7.9%）；而 BB 防守 BTN 的範圍裡有 98、84s、43s（順子）、76、75s、65（兩對）與 77–55（暗三條），堅果比例高得多。翻前範圍定錯，後面每一步都會跟著錯。</p>
<div class="callout tip"><b>實戰小技巧</b>牌桌上不需要算到個位數。每條街只要把對手範圍粗分成「強 / 中 / 弱」三格，問「哪一格會這樣打」，就能做出大部分正確的判斷。精算組合數留到下桌覆盤時練，久了就會變成直覺。</div>

<h3>4. 用下注尺度與時機縮範圍</h3>
<table class="tbl"><thead><tr><th>對手的動作</th><th>範圍通常長怎樣</th><th>你的讀牌調整</th></tr></thead><tbody>
<tr><td>小注（25–33%）</td><td>寬、合併：強牌、中等牌、聽牌、空氣都有</td><td>幾乎不縮範圍；別對小注棄太多</td></tr>
<tr><td>大注（66–100%）</td><td>極化：強牌 + 聽牌 / 詐唬，中等牌變少</td><td>把第二對、弱頂對這類中段大多刪掉</td></tr>
<tr><td>超池（超過 100%）</td><td>更極化：堅果或詐唬</td><td>只用最好的抓詐牌跟注</td></tr>
<tr><td>過牌</td><td>封頂：多數強牌會下注，剩中等牌與放棄的牌（少數陷阱）</td><td>可以 Probe、延遲下注或薄價值下注</td></tr>
<tr><td>過牌加注</td><td>強牌 + 強聽牌</td><td>中等一對要謹慎，常常棄牌</td></tr>
<tr><td>被動玩家突然在河牌加注</td><td>低級別多半是堅果或接近堅果</td><td>剝削：抓詐要更緊</td></tr>
</tbody></table>
<p><strong>時機也是線索</strong>：一直過牌跟注的人，在同花完成的河牌突然領先大注，範圍會大幅偏向同花；翻牌、轉牌都積極下注的人，在聽牌破產的河牌繼續下注，就要把破產聽牌算進他的詐唬。前後行動是否「說得通」，比單一動作更重要。</p>
<p><strong>對手類型會改變同一個動作的意義</strong>：</p>
<table class="tbl"><thead><tr><th>對手類型</th><th>翻前範圍</th><th>翻後特徵</th><th>讀牌調整</th></tr></thead><tbody>
<tr><td>緊弱型（Nit）</td><td>很窄</td><td>下注多半是真的，很少詐唬</td><td>抓詐要更緊；他棄牌多，你可以多偷池</td></tr>
<tr><td>跟注站（Calling Station）</td><td>很寬</td><td>很少加注，中等牌也一路跟到底</td><td>他主動下注或加注 = 強牌；你少詐唬、多薄價值</td></tr>
<tr><td>激進常客（LAG / Reg）</td><td>偏寬</td><td>詐唬頻率高，會挑阻擋牌</td><td>抓詐可以接近理論頻率，別被嚇跑</td></tr>
</tbody></table>
<div class="callout warn"><b>常見錯誤</b>① 只猜一手牌（「他一定是 AK」），漏掉範圍裡其他價值與詐唬。② 忘了扣掉牌面和自己手上的牌，組合數算錯。③ 每條街都用翻前範圍思考，沒有根據新行動重新過濾。④ 以為所有聽牌都會變成詐唬——很多玩家（尤其低級別）河牌會直接放棄。⑤ 忽略對手類型：同樣的下注，跟注站和緊弱玩家代表的範圍完全不同。</div>

<h3>5. 把範圍分成價值、中段、詐唬</h3>
<table class="tbl"><thead><tr><th>類別</th><th>定義</th><th>河牌常見動作</th></tr></thead><tbody>
<tr><td><strong>價值（Value）</strong></td><td>被更差的牌跟注時領先</td><td>下注、加注</td></tr>
<tr><td><strong>中段（Medium / 抓詐牌）</strong></td><td>有攤牌價值，但下注只會被更好的牌跟注</td><td>過牌、過牌跟注</td></tr>
<tr><td><strong>詐唬（Bluff）</strong></td><td>沒有攤牌價值，只能靠對手棄牌獲勝</td><td>下注（或放棄）</td></tr>
</tbody></table>
<p>對手在河牌下大注時，他的中段大多已經不在下注範圍裡，你只需要比較兩端：價值有幾組、詐唬有幾組。</p>
<div class="callout pro"><b>進階補充</b>如果你的牌「贏所有詐唬、輸所有價值」（純抓詐牌），跟注勝率就等於 詐唬組合 ÷（價值組合 + 詐唬組合）。對手下滿池時你需要 33.3% 勝率，也就是他每 2 組價值要配 1 組詐唬，你才打平。實用算法：<strong>先數價值組合，除以 2，得到「打平所需詐唬數」</strong>（對手下 75% 底池時改乘 0.43，因為 30% ÷ 70% ≈ 0.43）。他實際能詐唬的組合比這多就跟注，比這少就棄牌。</div>

<h3>6. 完整讀牌牌例：JJ 面對 UTG 三槍</h3>
<div class="hh">
<div class="hh-title">牌例：BTN 拿 J♥J♣ 對抗 UTG 的三次下注</div>
<div class="hh-row"><span class="hh-street">翻前</span>UTG 開池 2.5bb，你在 BTN 拿 <span class="cards">JhJc</span> 跟注，盲注棄牌，底池 6.5bb。UTG 範圍（簡化）：55+、A3s+、K9s+、Q9s+、J9s+、T9s、98s、87s、76s、ATo+、KQo，共 216 組合；扣掉你的兩張 J 剩 <strong>195 組</strong>。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">KsTs4d</span>（底池 6.5bb）UTG 下注 2.2bb（33%），你跟注，底池 10.9bb。扣掉牌面後剩 <strong>170 組</strong>；小注幾乎是全範圍下注，範圍沒有變窄。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2c</span>（底池 10.9bb）UTG 下注 8.2bb（75%），你跟注，底池 27.3bb。假設他用<strong>價值 40 組</strong>（AA、KK、TT、AK、KQ、KT、KJ）+ <strong>同花聽 15 組</strong> + <strong>QJ、AQ 卡順聽 22 組</strong>（QJ 7 組 + AQ 15 組，Q♠J♠、A♠Q♠ 已算在同花聽）下注，其餘 93 組（QQ、99–55、AT、K9 等中等牌與空氣）過牌。剩 <strong>77 組</strong>。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">7h</span>（底池 27.3bb）UTG 下注 27.3bb（滿池）。聽牌全部破產，77 組分成：<strong>價值 39 組</strong>、<strong>詐唬 33 組</strong>（11 組破產同花聽 + 22 組 QJ、AQ），另有 5 組中段（KJ、配到一對的同花聽）通常會過牌。</div>
<div class="hh-row"><span class="hh-street">決策</span>跟注需要 27.3 ÷ 81.9 ≈ 33.3% 勝率。JJ 贏所有詐唬、輸所有價值，勝率 = 33 ÷ 72 ≈ 45.8%，跟注 EV ≈ 0.458 × 54.6 − 0.542 × 27.3 ≈ <strong>+10.2bb</strong>，所以跟注。</div>
<div class="hh-row result"><span class="hh-street">重點</span>打平所需詐唬 = 39 ÷ 2 = 19.5 組。若這位 UTG 是很少詐唬的緊弱玩家，只拿一半聽牌開槍（約 16 組），勝率變成 16 ÷ 55 ≈ 29.1%，低於 33.3%，JJ 就該棄牌。讀牌的結論，永遠取決於「他實際會拿多少詐唬」。</div>
</div>

<h3>7. 下一步</h3>
<p>組合數忘了可以回到 <a href="#/learn/hands-combos">起手牌與組合數</a>；阻擋牌如何改變組合數，請看 <a href="#/learn/blockers">阻擋牌與卡牌移除</a>。範圍分類的觀念在 <a href="#/learn/range-thinking">範圍思維</a>，不同對手怎麼調整範圍可看 <a href="#/learn/player-types">玩家類型與 HUD 數據</a>，河牌要不要跟注請接著讀 <a href="#/learn/river-decisions">河牌三大決策</a>。最後到 <a href="#/quiz/theory?topic=hand-reading">本課測驗</a> 練習算組合數；術語可查 <a href="#/wiki/glossary/combos">Combo</a>、<a href="#/wiki/glossary/capped-range">Capped Range</a>。</p>
`,
  sources: [
    { title: 'Upswing Poker — Hand Reading 讀牌教學', url: 'https://upswingpoker.com/hand-reading-poker/' },
    { title: 'SplitSuit — Poker Ranges & Hand Reading', url: 'https://www.splitsuit.com/poker-ranges-reading' },
    { title: 'GTO Wizard — A Beginner\'s Guide to Poker Combinatorics', url: 'https://blog.gtowizard.com/a-beginners-guide-to-poker-combinatorics/' },
    { title: 'Upswing Poker — How the Pros Take Advantage of Hand Combinations', url: 'https://upswingpoker.com/how-the-pros-take-advantage-of-hand-combinations/' },
    { title: 'Smart Poker Study — Counting Poker Hand Combos', url: 'https://smartpokerstudy.com/counting-poker-hand-combos-hand-reading-lab-part-7-podcast-080/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'hand-reading-01', topic: 'hand-reading', lv: 1,
    q: '翻牌 K♠ T♠ 4♦。對手手上是 AK（含同花與不同花）的組合一共剩幾組？',
    opts: ['12 組', '16 組', '9 組', '6 組'],
    ans: 0,
    exp: '牌面用掉一張 K，K 只剩 3 張、A 還有 4 張，非對子組合數 = 4 × 3 = 12（同花 3 組 + 不同花 9 組）。16 組是完全沒有移除時的數字；9 組是 KT 這種兩張都被牌面用掉一張的情況。' },
  { id: 'hand-reading-02', topic: 'hand-reading', lv: 2,
    q: '翻牌 K♠ T♠ 4♦，你手上拿 J♥ J♣。對手的 QJ 同花（QJs）還剩幾組？',
    opts: ['2 組', '4 組', '3 組', '1 組'],
    ans: 0,
    exp: 'QJs 原本有 ♠♥♦♣ 4 組。你拿走 J♥ 和 J♣，Q♥J♥、Q♣J♣ 就不可能存在，只剩 Q♠J♠、Q♦J♦ 2 組。這就是阻擋牌：你的手牌直接改變對手的組合數。' },
  { id: 'hand-reading-03', topic: 'hand-reading', lv: 2,
    q: '對手轉牌下 1/3 底池的小注，和下 1.5 倍底池的超池，讀牌上最正確的解讀是？',
    opts: ['小注範圍寬且合併、幾乎不縮範圍；超池範圍極化，多半是堅果或詐唬，中等牌很少', '兩者範圍一樣，尺度不影響讀牌', '小注代表他一定拿堅果在釣魚', '超池代表他一定是在詐唬'],
    ans: 0,
    exp: '小注能讓很多中等牌、聽牌、空氣一起下注，所以範圍寬而合併；超池只有堅果與詐唬划算，中等牌會改用過牌或小注，所以範圍極化。不能把任何單一尺度直接等於「一定堅果」或「一定詐唬」。' },
  { id: 'hand-reading-04', topic: 'hand-reading', lv: 2,
    q: 'BTN 開池、BB 跟注。翻牌 BB 過牌，BTN（翻前加注者）也過牌回去。BTN 這時的範圍通常是？',
    opts: ['被封頂：多數暗三條、兩對會在翻牌下注，剩下以中等牌與放棄的牌為主（偶爾有陷阱）', '一定是堅果在設陷阱', '一定是完全沒中的空氣', '跟他下注時的範圍完全一樣'],
    ans: 0,
    exp: '強牌通常想立刻做大底池，所以 IP 的翻前加注者過牌回去，範圍會缺少大部分頂端強牌（Capped）。這給了 BB 轉牌 Probe、河牌薄價值下注的機會；但仍可能有少量慢打，所以不是「一定空氣」。' },
  { id: 'hand-reading-05', topic: 'hand-reading', lv: 3,
    q: '河牌對手下滿池，你拿一手「贏所有詐唬、輸所有價值」的抓詐牌。你估計他的下注範圍有 30 組價值、12 組詐唬。你該？',
    opts: ['棄牌：勝率 12 ÷ 42 ≈ 28.6%，低於需要的 33.3%', '跟注：12 組詐唬已經很多', '跟注：只要對手有詐唬就應該抓', '加注：對手範圍裡有詐唬'],
    ans: 0,
    exp: '面對滿池下注需要 33.3% 勝率。純抓詐牌的勝率 = 詐唬 ÷（價值 + 詐唬）= 12 ÷ 42 ≈ 28.6%，不夠。用速算：30 組價值 ÷ 2 = 15 組才打平，他只有 12 組，所以棄牌。' },
  { id: 'hand-reading-06', topic: 'hand-reading', lv: 3,
    q: '你算出對手河牌滿池下注的範圍裡有 39 組價值。他至少要有幾組詐唬，你的純抓詐牌跟注才不虧？',
    opts: ['約 19.5 組', '39 組', '13 組', '26 組'],
    ans: 0,
    exp: '滿池下注時，跟注需要 33.3% 勝率，代表價值 : 詐唬 = 2 : 1，所以打平所需詐唬 = 39 ÷ 2 = 19.5 組。少於這個數字就棄牌，多於就跟注。' },
  { id: 'hand-reading-07', topic: 'hand-reading', lv: 3,
    q: '河牌對手下 75% 底池，你算出他的下注範圍有 30 組價值。你的純抓詐牌要打平，他至少要有幾組詐唬？',
    opts: ['約 12.9 組', '15 組', '約 22.5 組', '30 組'],
    ans: 0,
    exp: '面對 75% 底池需要 0.75 ÷（1 + 0.75 + 0.75）= 30% 勝率，也就是詐唬 ÷（價值 + 詐唬）= 30%，詐唬 = 30 × 0.3 ÷ 0.7 ≈ 12.9 組（速算：價值 × 0.43）。15 組是滿池下注的答案（價值 ÷ 2）。' }
);

/* ---------------------------------------------------------------------------
 * 4. 3bet-pots 3-Bet 底池的翻後策略
 * ------------------------------------------------------------------------- */
GTO.THEORY.push({
  id: '3bet-pots',
  stage: 'postflop',
  part: '四、翻後策略',
  title: '3-Bet 底池的翻後策略',
  icon: '🔥',
  level: 3,
  minutes: 13,
  tldr: '3-Bet 底池 SPR 只有約 4–6：3-Bettor 高牌面高頻小注、跟注者在連張牌面反擊，頂對好踢腳以上常要打光。',
  plain: '單次加注底池像馬拉松，籌碼還很多，可以慢慢周旋；3-Bet 底池像百米短跑，籌碼相對底池很少，兩三個動作就會全下。所以起跑前（翻牌）就要先想好：這手牌值不值得打光？',
  summary: '3-Bet 底池完整翻後指南：自己算 IP / OOP 3-Bet 的底池與 SPR、3-Bettor 為什麼能高頻小注、跟注者在哪些牌面反擊、低 SPR 的打光門檻與三條街下注計畫，附 AK 三槍打光與跟注者過牌加注的牌例。',
  keyPoints: [
    '100bb 下 IP 3-Bet 到 7.5bb 被跟注：翻牌底池 16.5bb、SPR 約 5.6；OOP 3-Bet 到 11bb 被跟注：底池 22.5–23bb、SPR 約 3.9–4.0。',
    '3-Bettor 範圍集中在大對子與大高張，在 A / K / Q 高牌面用 25–33% 小注高頻下注；有位置時下得比沒位置更頻繁。',
    '跟注者範圍少了 AA、KK，但有中小對子與同花連張：在中低連張牌面用過牌加注或加注反擊，高牌面以跟注為主。',
    'SPR 4–6 時，頂對好踢腳與超對多半就是打光的牌；33% → 75% → 全下，三條街就能把籌碼打完。',
    '低 SPR 的隱含賠率很小：弱聽牌、弱對子別期待後面贏大錢；強聽牌傾向直接全下。'
  ],
  html: `
<h3>1. 為什麼 3-Bet 底池要另外學？</h3>
<div class="callout plain"><b>白話解釋</b>SPR 就像油箱裡剩下的油。單次加注底池油箱很滿（SPR 約 17.7），可以繞路、慢慢開；3-Bet 底池只剩 4–6 格油，開兩三段就沒油了。<strong>出發前就要決定目的地（這手牌要不要打光）</strong>，不然開到一半才煩惱，就只能拋錨在路邊。</div>
<p>先自己算一次底池與 SPR（6 人桌、100bb、SB 0.5bb、BB 1bb）：</p>
<table class="tbl"><thead><tr><th>底池類型</th><th>翻前行動</th><th>翻牌底池</th><th>後手籌碼</th><th>SPR</th></tr></thead><tbody>
<tr><td>單次加注（對照）</td><td>BTN 開 2.5bb，BB 跟注</td><td>5.5bb</td><td>97.5bb</td><td>約 17.7</td></tr>
<tr><td><strong>IP 3-Bet</strong></td><td>CO 開 2.5bb，BTN 3-Bet 到 7.5bb，CO 跟注</td><td>7.5 + 7.5 + 1.5 = 16.5bb</td><td>92.5bb</td><td><strong>約 5.6</strong></td></tr>
<tr><td><strong>OOP 3-Bet（BB）</strong></td><td>BTN 開 2.5bb，BB 3-Bet 到 11bb，BTN 跟注</td><td>11 + 11 + 0.5 = 22.5bb</td><td>89bb</td><td><strong>約 4.0</strong></td></tr>
<tr><td>OOP 3-Bet（SB）</td><td>BTN 開 2.5bb，SB 3-Bet 到 11bb，BTN 跟注</td><td>11 + 11 + 1 = 23bb</td><td>89bb</td><td>約 3.9</td></tr>
<tr><td>OOP 3-Bet（10bb）</td><td>CO 開 2.5bb，SB 3-Bet 到 10bb，CO 跟注</td><td>10 + 10 + 1 = 21bb</td><td>90bb</td><td>約 4.3</td></tr>
<tr><td>4-Bet（對照）</td><td>CO 4-Bet 到 21bb，BTN 跟注</td><td>43.5bb</td><td>79bb</td><td>約 1.8</td></tr>
</tbody></table>
<p>注意盲注的死錢也要算進底池：IP 3-Bet 底池如果忘了加 1.5bb，會誤以為底池只有 15bb、SPR 約 6.2。SPR 從 17.7 掉到 4–6，代表翻後的「操作空間」少了三分之二以上。</p>

<h3>2. 3-Bettor 的優勢：範圍更強，所以高頻小注</h3>
<p>3-Bettor 的範圍集中在 <span class="hand">QQ</span>+、<span class="hand">AK</span> 這類強牌，再配上一些同花 A（<span class="hand">A5s</span>–<span class="hand">A2s</span>）、同花連張當詐唬；跟注者則多半把 <span class="hand">AA</span>、<span class="hand">KK</span> 拿去 4-Bet，跟注範圍以 <span class="hand">TT</span>–<span class="hand">77</span>、<span class="hand">AQ</span>、<span class="hand">AJs</span>、<span class="hand">KQs</span>、同花百老匯與部分同花連張為主——<strong>範圍被封頂</strong>。</p>
<table class="tbl"><thead><tr><th>翻牌類型</th><th>例子</th><th>對誰有利</th><th>3-Bettor 常見策略</th></tr></thead><tbody>
<tr><td>A / K 高乾燥</td><td><span class="cards">As8d3c</span>、<span class="cards">Kh7s2d</span></td><td>3-Bettor（AA、KK、AK 多）</td><td>高頻 25–33% 小注，接近全範圍</td></tr>
<tr><td>兩張高牌</td><td><span class="cards">KsQd7c</span></td><td>3-Bettor</td><td>高頻小注，強牌與強聽牌偶爾加大</td></tr>
<tr><td>低成對</td><td><span class="cards">5s5d2h</span></td><td>3-Bettor（超對多）</td><td>高頻小注</td></tr>
<tr><td>中低連張</td><td><span class="cards">8h7h5s</span>、<span class="cards">6d5s4c</span></td><td>跟注者（暗三條、兩對、順子較多）</td><td>降頻、多過牌；下注時偏極化</td></tr>
</tbody></table>
<p><strong>為什麼是小注？</strong>① SPR 已經很低，小注之後轉牌、河牌稍微加大就能全下，不需要翻牌就下大；② 跟注者範圍被封頂，很難用加注懲罰小注；③ 小注讓高張、後門聽牌也付一點錢，達到便宜的權益否定。有位置的 3-Bettor 下注最頻繁；沒位置的 3-Bettor（BB / SB）會多過牌，特別是在偏向跟注者的連張牌面。</p>
<div class="callout pro"><b>進階補充</b>用幾何下注算「三條街剛好打光」的比例：每街比例 = [(1 + 2 × SPR) 的 1/3 次方 − 1] ÷ 2。SPR 4.0 → 每街約 54% 底池；SPR 5.6 → 每街約 65% 底池。實戰常用「33% → 75% → 全下」：IP 3-Bet 底池 16.5bb 下 5.5bb 被跟 → 27.5bb；轉牌下 75% 被跟 → 68.75bb、後手約 66.4bb，河牌約 97% 底池剛好全下。OOP 3-Bet 底池同樣的節奏，河牌只剩約 57% 底池。所以翻牌小注並不會「打不光」。</div>

<h3>3. 跟注者的策略：哪些牌面可以反擊？</h3>
<p>跟注者少了最頂端的 AA、KK，但中小對子（暗三條）、同花連張（兩對、順子）比 3-Bettor 多。依牌面分三種反應：</p>
<ol class="steps">
<li><b>中低連張、低張牌面：反擊</b><span class="cards">7h6h5s</span>、<span class="cards">8s7d5c</span> 這類牌面，3-Bettor 的超對很脆弱，跟注者用暗三條、兩對、順子加上強聽牌<strong>過牌加注</strong>（OOP）或<strong>加注</strong>（IP）。</li>
<li><b>A / K 高牌面：以跟注為主</b>對手範圍優勢太大，加注只會被更好的牌繼續；用中對子、帶後門的高張跟注小注，守住 MDF。</li>
<li><b>不期待隱含賠率</b>SPR 只有 4–6，卡順、弱同花聽中了也贏不到太多，面對大注要果斷放棄。</li>
</ol>
<p><strong>加注尺度</strong>：因為 SPR 低，過牌加注不必太大，常見是對手下注的 2.5–3 倍，轉牌就能自然全下。例如 IP 3-Bet 底池 16.5bb，對手下 5.5bb，你加注到約 16bb；對手跟注後底池變成 48.5bb，雙方後手只剩 76.5bb，SPR 約 1.6，轉牌一個下注就能全下。</p>
<div class="callout tip"><b>實戰小技巧</b>翻牌前先問一句：「這手牌在這個牌面，願不願意打光？」願意（超對、頂對好踢腳、組合聽牌）→ 下注或加注，主動把錢放進去；不願意（中對子、弱頂對）→ 過牌控池或跟注抓詐；完全沒權益 → 早點放棄。3-Bet 底池最怕的，是中等牌一路被動跟注，最後在河牌面對全下才開始煩惱。</div>

<h3>4. 低 SPR 的全下門檻</h3>
<div class="formula">跟注全下需要的勝率 = 你要補的跟注額 ÷（跟注後的總底池）</div>
<ul>
<li><strong>OOP 3-Bet（SPR 約 4）</strong>：你在 22.5bb 底池下注 7.5bb，對手全下 89bb。你要補 81.5bb，跟注後總底池 200.5bb，需要 81.5 ÷ 200.5 ≈ <strong>40.6%</strong> 勝率。</li>
<li><strong>IP 3-Bet（SPR 約 5.6）</strong>：你在 16.5bb 底池下注 5.5bb，對手過牌加注全下 92.5bb。你要補 87bb，跟注後總底池 201.5bb，需要約 <strong>43.2%</strong>。</li>
</ul>
<p>對手的全下範圍通常混有聽牌與更差的成牌，超對、頂對頂踢腳常常有 40% 以上勝率，所以「下注後被全下就棄牌」在 3-Bet 底池多半是錯的。</p>
<table class="tbl"><thead><tr><th>SPR</th><th>常見底池</th><th>通常願意打光的牌</th></tr></thead><tbody>
<tr><td>約 1.8</td><td>4-Bet 底池</td><td>任何頂對、超對、強聽牌</td></tr>
<tr><td>約 4</td><td>OOP 3-Bet 底池</td><td>頂對好踢腳以上、超對、組合聽牌</td></tr>
<tr><td>約 5.6</td><td>IP 3-Bet 底池</td><td>超對、安全牌面的頂對頂踢腳；弱頂對要謹慎</td></tr>
<tr><td>約 17.7</td><td>單次加注底池</td><td>兩對以上；只有一對時，面對三條街大注常要放棄</td></tr>
</tbody></table>
<div class="callout warn"><b>常見錯誤</b>① 把 3-Bet 底池當單次加注底池打：SPR 4 時拿超對被加注就棄牌，送掉大量 EV。② 跟注者拿卡順、弱聽牌跟注大注，以為中了能贏一大筆——後手只剩幾倍底池，隱含賠率很小。③ 3-Bettor 在每個牌面都下大注，結果在連張牌面被暗三條、兩對過牌加注打爆。④ 拿頂對好踢腳下注後被全下才發現「好像要跟」，其實翻牌就該想好。</div>

<h3>5. 牌例：AK 三槍打光與跟注者的反擊</h3>
<div class="hh">
<div class="hh-title">牌例 1：BTN 3-Bet 底池的頂對頂踢腳</div>
<div class="hh-row"><span class="hh-street">翻前</span>CO 開池 2.5bb，你在 BTN 拿 <span class="cards">AhKc</span> 3-Bet 到 7.5bb，盲注棄牌，CO 跟注。底池 16.5bb，有效籌碼 92.5bb（SPR 約 5.6）。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Ks8d3c</span>（底池 16.5bb）CO 過牌。K 高乾燥面對 3-Bettor 極有利，你下注 5.5bb（33%），CO 跟注。底池 27.5bb，後手 87bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2h</span>（底池 27.5bb）CO 過牌，你下注 20bb（約 73%），CO 跟注。底池 67.5bb，後手 67bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">7s</span>（底池 67.5bb）CO 過牌，你全下 67bb（約 99% 底池）。CO 跟注亮出 <span class="cards">KhQh</span>，你以頂對頂踢腳贏下 201.5bb 底池。</div>
<div class="hh-row result"><span class="hh-street">重點</span>33% → 73% → 全下，三條街剛好打完 92.5bb。SPR 5.6 時頂對頂踢腳就是要打光的牌；同樣的 AK 在 SPR 17.7 的單次加注底池，很少需要三條街打光。</div>
</div>
<div class="hh">
<div class="hh-title">牌例 2：跟注者在連張牌面過牌加注</div>
<div class="hh-row"><span class="hh-street">翻前</span>CO 開池 2.5bb，BTN 3-Bet 到 7.5bb，你在 CO 拿 <span class="cards">6c6d</span> 跟注。底池 16.5bb，有效籌碼 92.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">7h6h5s</span>（底池 16.5bb）你過牌，BTN 下注 5.5bb（33%）。這個牌面打中你的暗三條、兩對與順子，你<strong>過牌加注到 16bb</strong>（約 2.9 倍）。</div>
<div class="hh-row"><span class="hh-street">結果</span>BTN 拿 <span class="cards">AsKd</span> 只有高張與後門，棄牌。你贏下 22bb 底池（16.5bb + BTN 的 5.5bb）。</div>
<div class="hh-row result"><span class="hh-street">重點</span>連張牌面是跟注者的主場。你的過牌加注範圍除了暗三條、順子（如 <span class="cards">9c8c</span>），也要配上強聽牌，對手才不能只用超對跟注。</div>
</div>

<h3>6. 下一步</h3>
<p>翻前怎麼建構 3-Bet 範圍，請複習 <a href="#/learn/preflop-3bet">3-Bet 範圍建構</a> 與 <a href="#/learn/preflop-vs-3bet">面對 3-Bet</a>；可以打開 <a href="#/ranges/vs3bet_co_btn">CO 面對 BTN 3-Bet 範圍表</a> 看看跟注者的範圍長怎樣。SPR 與籌碼承諾的完整觀念在 <a href="#/learn/spr">SPR 課程</a>，翻牌下注頻率與尺度可對照 <a href="#/learn/cbet">C-Bet 策略</a> 和 <a href="#/learn/bet-sizing">下注尺度理論</a>。最後到 <a href="#/quiz/theory?topic=3bet-pots">本課測驗</a> 練習算 SPR 與全下門檻。</p>
`,
  sources: [
    { title: 'GTO Wizard — C-Betting IP in 3-Bet Pots', url: 'https://blog.gtowizard.com/c-betting-ip-in-3-bet-pots/' },
    { title: 'Upswing Poker — How to C-Bet in 3-Bet Pots Out of Position', url: 'https://upswingpoker.com/c-bet-3-bet-pots-oop/' },
    { title: 'Upswing Poker — Single-Raised Pots vs 3-Bet Pots', url: 'https://upswingpoker.com/single-raised-pots-vs-3-bet-pots/' },
    { title: 'Upswing Poker — Raising In Position in 3-Bet Pots', url: 'https://upswingpoker.com/in-position-raising-3-bet-pots/' },
    { title: 'SplitSuit — SPR Poker Strategy', url: 'https://www.splitsuit.com/spr-poker-strategy' }
  ]
});
GTO.QUESTIONS.push(
  { id: '3bet-pots-01', topic: '3bet-pots', lv: 1,
    q: 'CO 開池 2.5bb，BTN 3-Bet 到 7.5bb，盲注棄牌，CO 跟注（100bb）。翻牌的底池與 SPR 大約是多少？',
    opts: ['底池 16.5bb，SPR 約 5.6', '底池 15bb，SPR 約 6.2', '底池 5.5bb，SPR 約 17.7', '底池 22.5bb，SPR 約 4.0'],
    ans: 0,
    exp: '底池 = 7.5 + 7.5 + 盲注死錢 0.5 + 1 = 16.5bb；後手 100 − 7.5 = 92.5bb；SPR = 92.5 ÷ 16.5 ≈ 5.6。15bb 是忘了加盲注；5.5bb / 17.7 是單次加注底池；22.5bb / 4.0 是 BB 3-Bet 到 11bb 的 OOP 3-Bet 底池。' },
  { id: '3bet-pots-02', topic: '3bet-pots', lv: 2,
    q: 'BTN 開池 2.5bb，SB 棄牌，BB 3-Bet 到 11bb，BTN 跟注。翻牌 SPR 約是？',
    opts: ['約 4.0', '約 5.6', '約 8.1', '約 1.8'],
    ans: 0,
    exp: '底池 = 11 + 11 + SB 死錢 0.5 = 22.5bb；後手 100 − 11 = 89bb；SPR = 89 ÷ 22.5 ≈ 4.0。8.1 是誤把 3-Bet 額 11bb 當成底池；1.8 是 4-Bet 底池的數字。' },
  { id: '3bet-pots-03', topic: '3bet-pots', lv: 2,
    q: 'IP 3-Bet 底池，翻牌 A♠ 8♦ 3♣（乾燥 A 高面），3-Bettor 最常見的策略是？',
    opts: ['高頻率用 25–33% 底池的小注下注', '過牌大部分範圍，等轉牌再說', '只用強牌下 75% 以上大注，其他全部過牌', '直接全下'],
    ans: 0,
    exp: '3-Bettor 在 A 高乾燥面有大量 AA、AK、AQ，跟注者範圍被封頂，所以可以接近全範圍小注：SPR 已低，小注之後轉牌、河牌加大就能打光，也讓對手的高張與後門聽牌付錢。' },
  { id: '3bet-pots-04', topic: '3bet-pots', lv: 2,
    q: '在 3-Bet 底池中，翻前跟注者最適合用過牌加注反擊的是哪一種翻牌？',
    opts: ['7♥ 6♥ 5♠ 這類中低連張', 'A♠ K♦ 2♣', 'K♥ K♦ 4♠', 'A♣ Q♠ 7♦'],
    ans: 0,
    exp: '跟注者範圍有較多中小對子與同花連張，在中低連張牌面有更多暗三條、兩對、順子，3-Bettor 的超對又很脆弱，適合過牌加注。A、K 高牌面與 KK 成對牌面都是 3-Bettor 的範圍優勢牌面。' },
  { id: '3bet-pots-05', topic: '3bet-pots', lv: 3,
    q: 'OOP 3-Bet 底池：翻牌底池 22.5bb、後手 89bb。你下注 7.5bb 後，對手全下。你跟注需要多少勝率？',
    opts: ['約 40.6%', '約 33.3%', '約 50%', '約 25%'],
    ans: 0,
    exp: '你還要補 89 − 7.5 = 81.5bb；跟注後總底池 = 22.5 + 7.5 + 89 + 81.5 = 200.5bb；需要勝率 = 81.5 ÷ 200.5 ≈ 40.6%。超對、頂對頂踢腳面對混有聽牌的全下範圍，通常都超過這個門檻。' },
  { id: '3bet-pots-06', topic: '3bet-pots', lv: 2,
    q: '為什麼 3-Bet 底池裡，K 高牌面上的 AK（頂對頂踢腳）常常是可以打光的牌？',
    opts: ['SPR 只有約 4–6，三條街合理尺度就能全下，對手範圍裡又有很多更差的 Kx、口袋對子與聽牌', '因為 3-Bet 底池規定不能棄牌', '因為 AK 是翻前勝率最高的牌', '因為 3-Bet 底池的對手一定在詐唬'],
    ans: 0,
    exp: 'SPR 低代表一對強牌的相對價值變高：33% → 75% → 全下就能打光，而對手會用 KQ、KJ、QQ–TT 與聽牌付錢。單次加注底池 SPR 約 17.7，同樣的 AK 面對三條街大注就常常要放棄。' },
  { id: '3bet-pots-07', topic: '3bet-pots', lv: 3,
    q: 'OOP 3-Bet 底池翻牌 SPR 約 4.0。若想用三條街「同樣的底池比例」剛好打光，每條街大約要下多少？',
    opts: ['約 54% 底池', '約 33% 底池', '約 75% 底池', '約 100% 底池'],
    ans: 0,
    exp: '幾何下注：每街比例 = [(1 + 2 × SPR) 的 1/3 次方 − 1] ÷ 2 = (9 的立方根 − 1) ÷ 2 ≈（2.08 − 1）÷ 2 ≈ 54%。SPR 5.6 的 IP 3-Bet 底池則約 65%。所以 3-Bet 底池翻牌下小注，後面稍微加大就能打光。' }
);

/* ---------------------------------------------------------------------------
 * 5. oop-play 沒位置（OOP）怎麼打
 * ------------------------------------------------------------------------- */
GTO.THEORY.push({
  id: 'oop-play',
  stage: 'postflop',
  part: '四、翻後策略',
  title: '沒位置（OOP）怎麼打',
  icon: '🛡️',
  level: 2,
  minutes: 13,
  tldr: '沒位置要以過牌為主、過牌範圍裡藏強牌，再用過牌加注反擊；每次過牌後都要清楚分出棄、跟、加三種牌。',
  plain: '沒位置就像猜拳時永遠要先出：對手看完你出什麼再決定。所以 OOP 要少做「先出拳」的決定（多過牌）、出拳就要有份量（過牌加注），而且讓對手猜不到你過牌時手上是石頭還是布。',
  summary: '沒位置的完整打法：OOP 的資訊與權益實現劣勢、為什麼預設過牌、如何保護過牌範圍、過牌加注怎麼選牌與尺度、何時過牌跟注或棄牌，再用 BB 對 BTN 單挑底池的實戰流程與牌例串起來。',
  keyPoints: [
    'OOP 三大劣勢：資訊少（每條街先行動）、權益實現差（聽牌與中等牌容易被下一街逼退）、控制底池困難。',
    '預設以過牌為主：BB 對 BTN 翻牌幾乎全部過牌；OOP 的翻前加注者在連張、濕潤牌面也要大量過牌。',
    '保護過牌範圍：過牌裡要留一些暗三條、兩對、強頂對，對手才不敢把你的過牌當成示弱、用任何牌偷池。',
    '過牌之後三選一：強牌與強聽牌過牌加注（對小注常加到 3–4 倍）、中等牌與聽牌過牌跟注、沒有權益的牌過牌棄牌。',
    '面對 1/3 底池小注最少要守約 75%；面對大注可以守緊一點（75% 底池時 MDF 約 57%）。'
  ],
  html: `
<h3>1. OOP 的三大劣勢</h3>
<table class="tbl"><thead><tr><th>劣勢</th><th>發生什麼事</th><th>例子</th></tr></thead><tbody>
<tr><td><strong>資訊少</strong></td><td>每條街都要先表態，對手看完你的動作才決定</td><td>你過牌，BTN 可以選擇下注偷池或過牌拿免費牌；你下注，他可以加注或便宜跟注</td></tr>
<tr><td><strong>權益實現差（EQR）</strong></td><td>聽牌與中等牌常被下一街的下注逼退，原始勝率拿不回來</td><td>BB 的許多邊緣牌只能實現約七、八成的原始勝率；IP 拿同樣的牌可以過牌回去，免費看河牌</td></tr>
<tr><td><strong>控池困難</strong></td><td>中等牌過牌會被下注，下注又怕被加注；強牌過牌，對手可能過牌回去</td><td>第二對想便宜攤牌，卻在轉牌、河牌連續面對下注</td></tr>
</tbody></table>
<p>位置的價值不是「最後行動比較帥」，而是<strong>每條街多一份資訊、多一個選項</strong>。翻前範圍表會讓 BB 以外的位置在沒位置時打得比較緊，就是為了少面對這三個劣勢；既然 BB 已經便宜跟注入池，就要學會把劣勢降到最低。</p>
<div class="formula">實際能拿回的勝率 ≈ 原始勝率 × 權益實現率（EQR）</div>
<p>例如一手牌對上對手範圍的原始勝率是 38%，但因為沒位置只能實現 75%，實際表現就像只有 38% × 0.75 ≈ 28.5% 勝率的牌。這也是為什麼 OOP 的跟注門檻要比底池賠率算出來的再嚴格一點。</p>

<h3>2. 以過牌為主：OOP 的預設動作</h3>
<table class="tbl"><thead><tr><th>OOP 的角色</th><th>例子</th><th>翻牌預設</th><th>重點</th></tr></thead><tbody>
<tr><td><strong>OOP 跟注者</strong></td><td>BB 跟注 BTN 開池</td><td>幾乎 100% 過牌</td><td>用過牌跟注與過牌加注防守；只有低連張牌面偶爾小注 Donk</td></tr>
<tr><td><strong>OOP 翻前加注者</strong></td><td>UTG 開池被 BTN 跟注、BB 3-Bet 被 BTN 跟注</td><td>混合：A 高乾燥面多下注，連張濕潤面大量過牌</td><td>不必因為翻前加注就一定要 C-Bet；過牌範圍要留強牌</td></tr>
</tbody></table>
<p>為什麼預設過牌？① 對手（IP）範圍裡有很多空氣與高張，過牌讓他用這些牌下注，你再用跟注或加注回應；② 中等牌 OOP 下注，好牌會跟、壞牌會棄，等於把底池做大給位置比你好的人；③ 強牌過牌時，IP 常常會替你下注，你還能過牌加注把底池做大。</p>
<p><strong>OOP 翻前加注者的 C-Bet</strong>：UTG 開池被 BTN 跟注時，UTG 範圍雖然比較強，但在 <span class="cards">Ts9h6d</span>、<span class="cards">9d8d6s</span> 這類連張牌面，BTN 的跟注範圍（同花連張、中對子）打中很多，Solver 的 UTG 會過牌一半以上；只有在 <span class="cards">As7d2c</span>、<span class="cards">Kh8c3s</span> 這種乾燥高張面，才用較高頻率小注。</p>

<h3>3. 保護過牌範圍：過牌裡也要有強牌</h3>
<div class="callout plain"><b>白話解釋</b>保護過牌範圍就像居家保全：如果小偷知道「沒開燈＝沒人在家」，他每次看到沒開燈就闖進來。只要你偶爾在沒開燈的時候也坐在客廳（過牌時手上也有強牌），小偷就不敢每次都闖——你的弱牌過牌也跟著安全了。</div>
<p>如果你只拿弱牌過牌、強牌都下注，對手只要看到你過牌就用任何兩張牌下注，你只能一直棄牌。所以：</p>
<ul>
<li><strong>OOP 跟注者</strong>（BB）：翻牌把暗三條、兩對、頂對全部先過牌，等對手下注再決定跟注或加注。</li>
<li><strong>OOP 翻前加注者</strong>（例如 UTG 對 BTN）：在 <span class="cards">9d8d6s</span> 這種連張牌面，除了中等牌，也要把部分超對、暗三條留在過牌範圍；在 <span class="cards">As7d2c</span> 這種乾燥 A 高面，下注頻率才可以提高。</li>
</ul>
<div class="callout pro"><b>進階補充</b>「保護過牌範圍」不是拿強牌做慈善。Solver 會過牌強牌，是因為在那些情況下<strong>過牌的 EV 本來就和下注差不多</strong>：IP 面對過牌會高頻下注，你的強牌照樣能透過過牌加注或過牌跟注拿到價值。當過牌與下注的 EV 接近時，Solver 就會混合兩種動作，順便讓過牌範圍不會只剩弱牌。反過來說，若對手面對過牌幾乎從不下注，強牌就該自己下注。</div>

<h3>4. 過牌之後三選一：棄、跟、加</h3>
<table class="tbl"><thead><tr><th>選擇</th><th>放什麼牌</th><th>為什麼</th></tr></thead><tbody>
<tr><td><strong>過牌加注</strong></td><td>暗三條、兩對、部分強頂對 + 兩頭順、同花聽、帶後門的卡順</td><td>極化：價值牌要把底池做大，半詐唬靠棄牌權益加權益獲利</td></tr>
<tr><td><strong>過牌跟注</strong></td><td>中等對子、弱頂對、A 高、聽牌、帶後門的高張</td><td>有攤牌價值或權益，但加注只會被更好的牌繼續</td></tr>
<tr><td><strong>過牌棄牌</strong></td><td>沒有對子、沒有聽牌、也沒有後門的牌</td><td>勉強跟注也會在轉牌、河牌被逼退，權益實現極差</td></tr>
</tbody></table>
<p><strong>防守多寬看尺度</strong>：面對 1/3 底池的 C-Bet，MDF = 1 ÷ 1.33 ≈ 75%，你最多只能棄 25%；面對 75% 底池，MDF ≈ 57%，可以守緊一點。<strong>過牌加注的尺度</strong>：面對小注常加到對手下注的 3–4 倍，面對大注約 2.5–3 倍。</p>
<p><strong>過牌加注頻率看牌面</strong>：A、K 高的乾燥面偏向 BTN，BB 過牌加注很少，以過牌跟注為主；低張、連張或低成對牌面（例如 <span class="cards">7d4c2h</span>、<span class="cards">8s7d5c</span>）BB 擁有較多兩對、暗三條、順子，過牌加注就多得多。</p>
<div class="callout warn"><b>常見錯誤</b>① 拿中等牌領先下注「試探」，被加注只能棄牌。② 過牌範圍只有弱牌，BTN 每次都下注偷池你卻無可奈何。③ 面對 1/3 底池小注棄牌太多（例如沒中對子就棄），讓對手的小注全範圍穩賺。④ 想把所有強牌都慢打到河牌，結果對手過牌回去，拿不到價值又送出免費牌。⑤ 過牌跟注沒有計畫，到了河牌才開始想要不要跟。</div>

<h3>5. BB 對 BTN 單挑底池：實戰流程</h3>
<ol class="steps">
<li><b>翻前</b>BTN 開 2.5bb、BB 跟注，底池 5.5bb、後手 97.5bb（SPR 約 17.7）。BB 的防守範圍很寬，包含大量同花連張、小對子與高張。</li>
<li><b>翻牌：先判斷牌面</b>A、K、Q 高乾燥面偏向 BTN → 以過牌跟注為主；低張、連張、低成對面偏向 BB → 過牌加注變多。不論哪種，預設都先過牌。</li>
<li><b>面對 C-Bet</b>依尺度算 MDF，把手牌分成加注、跟注、棄牌三組；小注守寬、大注守緊。</li>
<li><b>轉牌</b>BTN 翻牌過牌回去 → 他範圍被封頂，你可以探測下注（Probe）；BTN 翻牌下注、你跟注 → 轉牌多半再過牌，看轉牌是否讓你的牌升級（成對、成聽牌）再決定跟或棄。</li>
<li><b>河牌</b>拿中等牌想攤牌可用阻擋下注（Block Bet）；抓詐時參考阻擋牌與對手類型；沒中的聽牌偶爾可以過牌加注詐唬，但低級別對手很少棄牌，要少用。</li>
</ol>
<div class="callout tip"><b>實戰小技巧</b>新手版 BB 打法：翻牌 100% 過牌 → 面對小注至少守七成多 → 只用兩對以上與強聽牌過牌加注 → BTN 翻牌過牌就在轉牌 Probe。先把這四步做到穩定，就已經贏過大多數只會「中了才打、沒中就丟」的對手。</div>

<h3>6. 牌例：BB 的過牌加注</h3>
<div class="hh">
<div class="hh-title">牌例：BB 拿 6♦5♦ 在低張牌面反擊</div>
<div class="hh-row"><span class="hh-street">翻前</span>BTN 開池 2.5bb，SB 棄牌，你在 BB 拿 <span class="cards">6d5d</span> 跟注。底池 5.5bb，有效籌碼 97.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">7d4c2h</span>（底池 5.5bb）你過牌，BTN 下注 1.8bb（33%）。低張牌面偏向你的範圍，你又有兩頭順（3 或 8，8 outs）+ 後門同花，<strong>過牌加注到 6.5bb</strong>（約 3.6 倍）。BTN 跟注，底池 18.5bb，後手 91bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">8s</span>（底池 18.5bb）你完成 8-7-6-5-4 順子。翻牌已經用加注奪回主動權，這次直接下注 12bb（約 65%），BTN 跟注。底池 42.5bb，後手 79bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">Kc</span>（底池 42.5bb）你下注 30bb（約 71%），BTN 跟注亮出 <span class="cards">9h9c</span>（超對），你贏下 102.5bb 底池。</div>
<div class="hh-row result"><span class="hh-street">重點</span>翻牌如果只過牌跟注，底池只有 9.1bb，就算轉牌成順，也很難在兩條街贏到這麼多。過牌加注讓你在權益不錯時先把底池做大、搶回主動權——這就是 OOP 最重要的武器。</div>
</div>
<div class="hh">
<div class="hh-title">牌例 2：UTG 把暗三條藏進過牌範圍</div>
<div class="hh-row"><span class="hh-street">翻前</span>你在 UTG 拿 <span class="cards">6h6c</span> 開池 2.5bb，BTN 跟注，盲注棄牌。底池 6.5bb，有效籌碼 97.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">9d8d6s</span>（底池 6.5bb）這個連張面打中 BTN 的 T7s、87s、T9s、99、88 等牌，你的範圍大量過牌——你連暗三條也一起過牌。BTN 下注 4.3bb（約 66%），你<strong>過牌加注到 14bb</strong>（約 3.3 倍），BTN 跟注。底池 34.5bb，後手 83.5bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2c</span>（底池 34.5bb）你下注 23bb（約 67%），BTN 棄牌，你贏下 34.5bb 底池。</div>
<div class="hh-row result"><span class="hh-street">重點</span>如果 UTG 在這種牌面只拿弱牌過牌，BTN 就能每次過牌都下注偷池。把暗三條、兩對放進過牌範圍，BTN 下注前就得擔心被過牌加注，你的弱牌過牌也因此更安全。</div>
</div>

<h3>7. 下一步</h3>
<p>面對 C-Bet 的完整防守範圍請看 <a href="#/learn/defense-postflop">翻後防守</a>，翻前怎麼決定哪些牌值得從盲注防守，請讀 <a href="#/learn/blind-defense">盲注防守完整指南</a>，並打開 <a href="#/ranges/vsrfi_bb_btn">BB 防守 BTN 範圍表</a> 對照。位置為什麼影響勝率，可複習 <a href="#/learn/equity-realization">權益實現</a>；Probe、Block Bet 等動作名稱整理在 <a href="#/learn/postflop-bet-types">翻後下注類型大全</a>。最後到 <a href="#/quiz/theory?topic=oop-play">本課測驗</a> 檢查自己會不會分「棄、跟、加」。</p>
`,
  sources: [
    { title: 'Upswing Poker — Equity Realization Explained', url: 'https://upswingpoker.com/equity-realization-explained/' },
    { title: 'PokerCoaching — Mastering Big Blind Strategy', url: 'https://pokercoaching.com/blog/mastering-big-blind-strategy-a-guide-to-profitable-defence/' },
    { title: 'PokerStrategy — Common Spots: BTN vs BB', url: 'https://www.pokerstrategy.com/news/content/Common-Spots-BTN-vs-BB_128759/' },
    { title: 'GTO Wizard — Exploiting Excessive C-Betting by OOP', url: 'https://blog.gtowizard.com/exploiting-excessive-c-betting-by-oop/' },
    { title: 'GTO Wizard — Poker Concepts You\'re Using Wrong', url: 'https://blog.gtowizard.com/poker-concepts-youre-using-wrong-and-how-theyre-hurting-your-winrate/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'oop-play-01', topic: 'oop-play', lv: 1,
    q: '翻後沒位置（OOP）最主要的劣勢是什麼？',
    opts: ['每條街都要先行動、資訊較少，聽牌與中等牌的權益比較難實現', 'OOP 只能拿到比較差的起手牌', '規則規定 OOP 不能加注', 'OOP 的底池賠率永遠比較差'],
    ans: 0,
    exp: 'OOP 先表態，對手看完再決定；聽牌與中等牌常被下一街的下注逼退，原始勝率拿不回來（權益實現差），也比較難控制底池。起手牌、規則與底池賠率都和位置無關。' },
  { id: 'oop-play-02', topic: 'oop-play', lv: 2,
    q: 'BTN 開池、BB 跟注的單挑底池，BB 在翻牌最常見的預設動作是？',
    opts: ['幾乎全部過牌給翻前加注者', '每次都領先下注搶主動', '只要中任何對子就領先下注', '沒中就過牌，中了就全下'],
    ans: 0,
    exp: 'Solver 的 BB 在大多數翻牌幾乎 100% 過牌，只在少數低連張牌面用小注 Donk。過牌讓 BTN 用寬範圍下注，BB 再用過牌跟注與過牌加注回應。' },
  { id: 'oop-play-03', topic: 'oop-play', lv: 2,
    q: '為什麼 OOP 要把部分強牌（暗三條、兩對）留在過牌範圍？',
    opts: ['否則過牌就等於示弱，對手可以用任何牌下注偷池；過牌裡有強牌，才能過牌加注、讓對手不敢亂下', '因為強牌下注違反規則', '因為強牌不需要贏錢', '因為過牌永遠比下注賺得多'],
    ans: 0,
    exp: '只拿弱牌過牌，對手看到過牌就全範圍下注。過牌範圍裡有暗三條、兩對，對手下注就要擔心被過牌加注。而且 IP 面對過牌常會下注，強牌過牌的 EV 本來就不差。' },
  { id: 'oop-play-04', topic: 'oop-play', lv: 1,
    q: 'BB 面對 BTN 1/3 底池的 C-Bet，理論上最少要用多少比例的範圍繼續（跟注 + 加注）？',
    opts: ['約 75%', '約 50%', '約 33%', '約 25%'],
    ans: 0,
    exp: 'MDF = 底池 ÷（底池 + 下注）= 1 ÷ 1.33 ≈ 75%，所以最多只能棄掉約 25%。「沒中對子就棄牌」通常會棄到一半以上，讓對手的小注穩賺。' },
  { id: 'oop-play-05', topic: 'oop-play', lv: 2,
    q: '翻牌 7♦ 4♣ 2♥，BTN 下 1/3 底池。你在 BB，下列哪手牌最適合過牌加注半詐唬？',
    opts: ['6♦ 5♦（兩頭順 + 後門同花）', 'J♠ 9♣（沒有對子、沒有聽牌、沒有後門）', 'K♣ 2♣（底對，適合過牌跟注）', '4♠ 3♠（中對 + 卡順，適合過牌跟注）'],
    ans: 0,
    exp: '6♦5♦ 有 8 張 outs 的兩頭順加後門同花，被跟注仍有不錯權益，對手棄牌則直接贏，是標準的過牌加注半詐唬。J♠9♣ 完全沒權益，過牌棄牌；K♣2♣、4♠3♠ 有攤牌價值，過牌跟注比較合適。' },
  { id: 'oop-play-06', topic: 'oop-play', lv: 2,
    q: 'OOP 拿中等牌（例如第二對）面對對手的翻牌小注，一般最合理的處理是？',
    opts: ['過牌跟注：保留對手的詐唬，也控制底池大小', '過牌加注：看看對手到底有什麼', '直接棄牌：沒位置就不要玩中等牌', '領先全下：先下手為強'],
    ans: 0,
    exp: '中等牌加注時，更差的牌會棄、更好的牌會繼續，等於把自己變成詐唬；直接棄牌又會讓防守頻率太低。過牌跟注能抓到對手的詐唬，也不會讓底池在沒位置時膨脹。' },
  { id: 'oop-play-07', topic: 'oop-play', lv: 2,
    q: '一手牌對上對手範圍的原始勝率是 38%，但因為沒位置只能實現約 75%。它實際表現大約像幾 % 勝率的牌？',
    opts: ['約 28.5%', '約 38%', '約 50.7%', '約 13%'],
    ans: 0,
    exp: '實際能拿回的勝率 ≈ 原始勝率 × 權益實現率 = 38% × 0.75 ≈ 28.5%。50.7% 是把 38% 除以 0.75 的誤算。這就是 OOP 跟注門檻要比底池賠率更嚴格一點的原因。' }
);

/* ---------------------------------------------------------------------------
 * 6. river-decisions 河牌三大決策：薄價值、詐唬選牌、抓詐
 * ------------------------------------------------------------------------- */
GTO.THEORY.push({
  id: 'river-decisions',
  stage: 'postflop',
  part: '四、翻後策略',
  title: '河牌三大決策：薄價值、詐唬選牌、抓詐',
  icon: '🌊',
  level: 3,
  minutes: 14,
  tldr: '河牌只剩三個問題：中等牌下注會不會被更差的牌跟、沒中要拿哪手詐唬、對手大注要不要抓——用組合數、阻擋牌與尺度回答。',
  plain: '河牌就像考試最後一題：牌已經發完，不會再有轉機。這時只剩三種題型——拿到不錯的牌要不要多賺一點（薄價值）、沒中要不要虛張聲勢（詐唬）、對手下大注要不要相信他（抓詐）。',
  summary: '河牌決策完整指南：用「被更差的牌跟注超過 50%」判斷薄價值、用三條件挑詐唬牌、用 MDF 與阻擋牌抓詐並剝削詐唬不足的對手，再搞懂極化大注、合併小注與河牌過牌加注，附組合數計算與牌例。',
  keyPoints: [
    '河牌沒有下一張牌：每手牌只會是價值、抓詐牌或空氣，決策只剩薄價值、詐唬、抓詐三種。',
    '薄價值：下注被跟注時要贏超過 50%（會跟注的更差牌組合多於更好牌組合）；中等牌用小注，讓更差的牌願意付錢。',
    '詐唬選牌三條件：沒有攤牌價值、阻擋對手的跟注範圍、不阻擋對手的棄牌範圍。',
    '抓詐：MDF 是對抗平衡對手的底線；低級別玩家河牌大注普遍詐唬不足，可以多棄邊緣抓詐牌。',
    '尺度：極化範圍用大注或超池，合併範圍用小注；詐唬比例 = 下注額 ÷（底池 + 2 × 下注額）；河牌過牌加注一律極化。'
  ],
  html: `
<h3>1. 河牌的特別之處：沒有下一張牌</h3>
<p>到了河牌，聽牌不是中了就是破產，每一手牌只剩三種身分，各自對應一個問題：</p>
<table class="tbl"><thead><tr><th>你的牌</th><th>要回答的問題</th><th>主要工具</th></tr></thead><tbody>
<tr><td><strong>強牌（價值）</strong></td><td>怎麼讓對手付最多？</td><td>極化大注、超池、過牌加注</td></tr>
<tr><td><strong>中等牌</strong></td><td>下注會被更差的牌跟注嗎？還是過牌抓詐？</td><td>薄價值 50% 法則、小注 / Block Bet、MDF</td></tr>
<tr><td><strong>空氣（沒有攤牌價值）</strong></td><td>要不要詐唬？用哪一手？</td><td>Alpha（所需棄牌率）、阻擋牌</td></tr>
</tbody></table>
<p>河牌沒有「之後再說」：不能指望下一張牌救你，所以每個決定都能用組合數算清楚，這也是河牌最能拉開實力差距的原因。</p>

<h3>2. 決策一：薄價值下注（Thin Value）</h3>
<div class="callout plain"><b>白話解釋</b>薄價值像在二手市場賣東西：開價太高（大注），只有比你更懂行情的人（更好的牌）會買，你反而虧；開一個合理的小價（小注），一般買家（更差的牌）也願意掏錢，你就多賺一筆。</div>
<div class="formula">薄價值成立：會跟注的「更差牌」組合數 > 會跟注的「更好牌」組合數（被跟注時勝率 > 50%）</div>
<p>為什麼是 50%？河牌你過牌也能攤牌，下注只改變「被跟注」的那部分：被更差的牌跟注多贏一注、被更好的牌跟注多輸一注。更差的跟注比較多，下注就賺（對手可能加注時，門檻要再高一點）。</p>
<p><strong>例子</strong>：牌面 <span class="cards">Ks8d5c3h2s</span>，你在 BTN 拿 <span class="cards">KhJd</span>，BB 跟注了翻牌與轉牌，河牌過牌給你。假設 BB 會跟注的範圍（已扣掉牌面與你手上的牌）如下：</p>
<table class="tbl"><thead><tr><th>對手的牌</th><th>組合數</th><th>和你比</th><th>面對 33% 小注</th><th>面對 75% 大注</th></tr></thead><tbody>
<tr><td><span class="hand">KQ</span></td><td>8</td><td>更好</td><td>跟注</td><td>跟注</td></tr>
<tr><td>K8（兩對）</td><td>6</td><td>更好</td><td>跟注</td><td>跟注</td></tr>
<tr><td><span class="hand">88</span>（暗三條）</td><td>3</td><td>更好</td><td>跟注</td><td>跟注</td></tr>
<tr><td><span class="hand">KT</span>、<span class="hand">K9</span></td><td>8 + 8</td><td>更差</td><td>跟注</td><td>跟注</td></tr>
<tr><td>A8（第二對）</td><td>12</td><td>更差</td><td>跟注</td><td>多半棄牌</td></tr>
<tr><td><span class="hand">98s</span>、<span class="hand">87s</span></td><td>3 + 3</td><td>更差</td><td>跟注</td><td>多半棄牌</td></tr>
</tbody></table>
<p>下 33%：更差 34 組 vs 更好 17 組，被跟注時領先 34 ÷ 51 ≈ <strong>66.7%</strong>，下注賺錢。下 75%：第二對都棄牌，剩更差 16 組 vs 更好 17 組，只領先約 <strong>48.5%</strong>，下注反而虧。<strong>薄價值的關鍵是尺度</strong>：中等牌用小注，讓更差的牌願意付錢。</p>

<h3>3. 決策二：詐唬選牌</h3>
<p>河牌詐唬不是「沒中就打」，而是從所有沒中的牌裡挑出最適合的幾手。三個條件：</p>
<ol class="steps">
<li><b>沒有攤牌價值</b>過牌也贏不了的牌才拿來詐唬；能贏對手破產聽牌的 A 高、小對子，通常過牌攤牌。</li>
<li><b>阻擋對手的跟注範圍</b>你手上的牌讓對手少了強牌組合，他就更常棄牌。</li>
<li><b>不阻擋對手的棄牌範圍</b>你手上的牌不要剛好是對手會棄掉的那些牌，例如他破產的聽牌。</li>
</ol>
<p><strong>例子</strong>：牌面 <span class="cards">9h6h2cKs4h</span>，河牌 4♥ 完成同花。你是翻前加注者，翻牌、轉牌都下注被跟，BB 河牌過牌。候選詐唬牌：</p>
<table class="tbl"><thead><tr><th>候選</th><th>攤牌價值</th><th>阻擋跟注範圍？</th><th>阻擋棄牌範圍？</th><th>結論</th></tr></thead><tbody>
<tr><td><span class="cards">AhQc</span></td><td>A 高，一點點</td><td>✅ 擋掉所有 A♥x♥ 堅果同花</td><td>不擋</td><td><strong>最佳詐唬</strong>：阻擋效果遠大於那一點攤牌價值</td></tr>
<tr><td><span class="cards">QcJc</span></td><td>沒有</td><td>沒擋到關鍵牌</td><td>不擋</td><td>可以詐唬（次選）</td></tr>
<tr><td><span class="cards">8s7s</span></td><td>沒有（破產順子聽牌）</td><td>不擋</td><td>❌ 擋掉對手破產的 87、T8、T7、85 等聽牌</td><td>較差的詐唬</td></tr>
<tr><td><span class="cards">Ac5c</span></td><td>A 高，一點點</td><td>不擋同花</td><td>不擋</td><td>過牌攤牌：沒有阻擋效果，留著贏對手的破產聽牌</td></tr>
</tbody></table>
<p>同樣是 A 高，手上有沒有 <span class="cards">Ah</span>，就決定了該詐唬還是過牌——這就是阻擋牌的威力。</p>

<h3>4. 決策三：抓詐（Bluff Catching）</h3>
<p>抓詐牌是「只贏詐唬、輸給所有價值」的牌。面對對手的河牌下注，依序檢查三件事：</p>
<ol class="steps">
<li><b>MDF：理論上要守多少</b>MDF = 底池 ÷（底池 + 下注）。面對滿池要守 50%，面對 75% 底池約 57%，面對 2 倍超池只要守約 33%。</li>
<li><b>阻擋牌：挑哪幾手來跟</b>好的抓詐牌<strong>阻擋對手的價值、不阻擋他的詐唬</strong>。同樣在 <span class="cards">9h6h2cKs4h</span>，如果你是 BB 面對下注，拿 <span class="cards">KhTc</span> 比 <span class="cards">KcTc</span> 更適合跟注：K♥ 讓對手少了 K♥x♥ 的同花。</li>
<li><b>對手類型：他真的會詐唬嗎？</b>MDF 是對抗「平衡對手」的底線，不是義務。</li>
</ol>
<p>下表是各種尺度的 MDF、Alpha（純詐唬所需棄牌率）與極化範圍的詐唬比例：</p>
<div class="widget" data-widget="bet-size-table"></div>
<div class="callout tip"><b>實戰小技巧</b>低級別（現場 1/2、1/3 與線上微級別）的玩家群體，在河牌下大注或超池時普遍<strong>詐唬不足</strong>：很多人不會把破產聽牌變成詐唬，卻很愛拿強牌下大注。面對這類對手，把 MDF 當成上限而不是下限，多棄邊緣抓詐牌；同時你自己的價值下注要更寬、更大，因為他們跟太多。只有遇到積極、會三槍詐唬的對手，才照理論頻率抓詐。</div>

<h3>5. 河牌尺度與過牌加注</h3>
<table class="tbl"><thead><tr><th>你的下注範圍</th><th>組成</th><th>尺度</th><th>常見情境</th></tr></thead><tbody>
<tr><td><strong>極化（Polarized）</strong></td><td>堅果 + 空氣，沒有中等牌</td><td>大注 75–150%，甚至超池</td><td>對手範圍被封頂（一路只跟注、聽牌全破產）</td></tr>
<tr><td><strong>合併（Merged）</strong></td><td>強牌 + 中等偏強的價值牌，少量詐唬</td><td>小注 25–50%</td><td>雙方以一對為主的牌面、薄價值、OOP 的 Block Bet</td></tr>
</tbody></table>
<div class="formula">極化下注的詐唬比例 = 下注額 ÷（底池 + 2 × 下注額）</div>
<p>下 33% 底池時詐唬約佔 20%（價值 : 詐唬 = 4 : 1）；下滿池約 33.3%（2 : 1）；下 2 倍超池約 40%（1.5 : 1）。尺度越大，能帶的詐唬越多，但對手需要守的頻率也越低。</p>
<div class="callout plain"><b>觀念解惑：單一手牌不是 1（價值）就是 0（詐唬），那 2:1 是給誰看的？</b>對你手上的「單一手牌」而言，河牌確實只有強到拿價值（1）或沒中要詐唬（0）兩種。表格上的 2:1 指的是你走到河牌的<strong>「整套範圍（Range）」</strong>——例如範圍裡有 20 組強牌會下滿池拿價值，你就只從破產聽牌裡挑出最沒攤牌價值的 10 組（或用花色／秒針偶數隨機挑一半）來詐唬，自然達成 20 : 10 = 2 : 1，<strong>完全不需要去記跟對手的歷史牌局</strong>！而且面對死不棄牌的休閒玩家，直接忘掉表格、把詐唬降到 0 才最賺（詳見 <a href="#/learn/value-bluff">價值與詐唬比例</a>）。</div>
<div class="callout pro"><b>進階補充</b>為什麼大注只能配極化範圍？因為對手面對大注只會用強牌跟注，你的中等牌下大注只會被更好的牌跟、更差的牌棄，直接違反薄價值的 50% 法則。所以中等牌要嘛小注、要嘛過牌；大注只留給「被跟注一定贏」的強牌，以及「被跟注一定輸、但能逼退對手」的詐唬。</div>
<p><strong>河牌過牌加注一律極化</strong>：只放堅果級價值（河牌成的順子、同花、葫蘆、頂端兩對）與精挑的詐唬（沒攤牌價值、又阻擋對手會跟注的強牌，例如同花完成時拿該花色的 A）。中等牌絕不過牌加注。最適合的時機是你沒位置、對手很常在河牌下注，或河牌讓你的範圍突然變強；面對小注常加到對手下注的 3 倍左右，籌碼不深時直接全下。</p>
<div class="callout warn"><b>常見錯誤</b>① 拿中等牌下大注「想多贏一點」，結果只被更好的牌跟注。② 沒中的牌全都拿來詐唬，沒挑阻擋牌，甚至擋掉對手的棄牌範圍。③ 把 MDF 當義務，面對從不詐唬的對手也硬抓。④ 拿中等牌在河牌過牌加注。⑤ 低級別牌桌上，面對被動玩家的河牌加注還英雄跟注——那幾乎都是堅果。</div>

<h3>6. 牌例：同一手抓詐牌，兩種對手兩種答案</h3>
<div class="hh">
<div class="hh-title">牌例：BB 拿 K♥T♣ 面對河牌滿池</div>
<div class="hh-row"><span class="hh-street">翻前</span>BTN 開池 2.5bb，SB 棄牌，你在 BB 拿 <span class="cards">KhTc</span> 跟注。底池 5.5bb。</div>
<div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">9h6h2c</span>（底池 5.5bb）你過牌，BTN 下注 1.8bb，你跟注。底池 9.1bb。</div>
<div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">Ks</span>（底池 9.1bb）你中頂對，過牌；BTN 下注 6bb，你跟注。底池 21.1bb。</div>
<div class="hh-row"><span class="hh-street">河牌</span><span class="cards">4h</span>（底池 21.1bb）同花完成。你過牌，BTN 下注 21bb（滿池）。跟注需要 21 ÷ 63.1 ≈ 33.3% 勝率；你的 K♥ 擋掉 K♥x♥ 同花，在你的範圍裡算是較好的抓詐牌。</div>
<div class="hh-row"><span class="hh-street">決策</span>對手是會把 87、T8 這類破產順子聽牌拿來三槍詐唬的積極常客 → <strong>跟注</strong>；對手是很少詐唬、河牌大注幾乎都是同花或兩對的被動玩家 → <strong>棄牌</strong>。</div>
<div class="hh-row result"><span class="hh-street">重點</span>同一手牌、同一個尺度，正確答案取決於對手實際的詐唬頻率。MDF 告訴你「平衡對手」要守多少，阻擋牌告訴你挑哪幾手來守，對手類型告訴你該往哪邊調整。</div>
</div>

<h3>7. 下一步</h3>
<p>河牌數學的基礎在 <a href="#/learn/mdf-alpha">MDF 與 Alpha</a> 與 <a href="#/learn/value-bluff">價值與詐唬比例</a>；阻擋牌的完整原理在 <a href="#/learn/blockers">阻擋牌與卡牌移除</a>，數對手價值與詐唬組合的方法在 <a href="#/learn/hand-reading">讀牌</a>。轉牌如何為河牌鋪路請看 <a href="#/learn/turn-river">轉牌與河牌策略</a>，針對不同對手的調整在 <a href="#/learn/exploit">剝削打法</a>。最後用 <a href="#/quiz/theory?topic=river-decisions">本課測驗</a> 與 <a href="#/quiz/math">數學練習</a> 驗收。</p>
`,
  sources: [
    { title: 'GTO Wizard — Principles of River Play', url: 'https://blog.gtowizard.com/principles-of-river-play/' },
    { title: 'GTO Wizard — Blockers & Unblockers: Picking Great Bluffs', url: 'https://blog.gtowizard.com/blockers-unblockers-the-secret-to-picking-great-bluffs/' },
    { title: 'GTO Wizard — We\'re at the River, Our Hand Can\'t Win, Now What?', url: 'https://blog.gtowizard.com/were-at-the-river-our-hand-cant-win-now-what/' },
    { title: 'Upswing Poker — River Check-Raise Strategy', url: 'https://upswingpoker.com/check-raise-river-strategy/' }
  ]
});
GTO.QUESTIONS.push(
  { id: 'river-decisions-01', topic: 'river-decisions', lv: 1,
    q: '河牌你拿中等牌，想下注拿薄價值。什麼條件下下注才划算？',
    opts: ['對手會跟注的牌裡，比你差的組合多於比你好的組合（被跟注時勝率超過 50%）', '只要對手有可能棄牌就下注', '只要自己有一對以上就下注', '只要對手的跟注範圍裡至少有一組比你差'],
    ans: 0,
    exp: '河牌過牌也能攤牌，下注只影響被跟注的情況：被更差的牌跟注多贏一注、被更好的牌跟注多輸一注。所以會跟注的更差牌要比更好牌多，也就是被跟注時勝率超過 50%。對手棄牌的牌本來就輸給你，不是下注的理由。' },
  { id: 'river-decisions-02', topic: 'river-decisions', lv: 2,
    q: '你估計對手面對小注會用 20 組比你好、30 組比你差的牌跟注；面對大注，比你差的牌只剩 12 組會跟。你該怎麼做？',
    opts: ['下小注：被跟注時領先 30 ÷ 50 = 60%；大注只領先 12 ÷ 32 = 37.5%', '下大注：反正對手都會跟注', '過牌：只要有比你好的牌會跟，就不該下注', '全下：讓對手做最困難的決定'],
    ans: 0,
    exp: '小注被跟注時勝率 30 ÷（20 + 30）= 60% > 50%，是好的薄價值下注；大注把更差的牌嚇跑，勝率剩 12 ÷（20 + 12）= 37.5%，反而虧錢。薄價值的關鍵就是用小尺度讓更差的牌留下來。' },
  { id: 'river-decisions-03', topic: 'river-decisions', lv: 2,
    q: '牌面 9♥ 6♥ 2♣ K♠ 4♥（河牌完成同花），你翻牌、轉牌都下注被跟，對手河牌過牌。你想詐唬，下列哪一手最好？',
    opts: ['A♥ Q♣：擋掉對手所有 A♥x♥ 堅果同花', 'A♣ 5♣：A 高但沒有紅心', '8♠ 7♠：破產的順子聽牌', 'Q♣ J♣：沒有任何對子'],
    ans: 0,
    exp: 'A♥Q♣ 阻擋對手最強的跟注牌（堅果同花），又不阻擋他的棄牌範圍，是最好的詐唬。A♣5♣ 沒有阻擋效果、又能贏對手的破產聽牌，應該過牌攤牌；8♠7♠ 擋掉對手破產的 87、T8 等聽牌（他的棄牌範圍）；Q♣J♣ 可以詐唬但只是次選。' },
  { id: 'river-decisions-04', topic: 'river-decisions', lv: 1,
    q: '對手河牌下滿池（下注額 = 底池），理論上你最少要用多少比例的範圍跟注（MDF）？',
    opts: ['50%', '33.3%', '66.7%', '25%'],
    ans: 0,
    exp: 'MDF = 底池 ÷（底池 + 下注）= 1 ÷ 2 = 50%。33.3% 是你跟注需要的勝率（底池賠率），兩者常被搞混：MDF 看的是「整個範圍要守多少」，底池賠率看的是「這一手需要多少勝率」。' },
  { id: 'river-decisions-05', topic: 'river-decisions', lv: 3,
    q: '河牌下 2 倍底池的超池。如果你的下注範圍是平衡的極化範圍，詐唬應該佔多少？',
    opts: ['約 40%', '約 33.3%', '約 66.7%', '約 20%'],
    ans: 0,
    exp: '極化範圍的詐唬比例 = 下注額 ÷（底池 + 2 × 下注額）= 2 ÷（1 + 4）= 40%，價值 : 詐唬 = 1.5 : 1。33.3% 是滿池下注的比例，20% 是 1/3 底池的比例；66.7% 則是面對 2 倍超池時的 Alpha（純詐唬所需棄牌率）。' },
  { id: 'river-decisions-06', topic: 'river-decisions', lv: 2,
    q: '現場 1/2 牌局，一位很少詐唬的被動玩家在河牌突然下超池。你拿一手中等抓詐牌，最好的調整是？',
    opts: ['多棄牌：這類玩家河牌大注普遍詐唬不足，MDF 不是義務', '一定跟注：MDF 規定你必須守住', '加注回去詐唬他', '跟注：超池通常代表對手在詐唬'],
    ans: 0,
    exp: 'MDF 是對抗平衡對手、避免被剝削的底線。低級別被動玩家河牌下大注時多半是強牌、詐唬遠低於理論比例，跟注抓詐的勝率不夠，應該多棄牌，並把省下來的錢用在對他們更寬的價值下注上。' },
  { id: 'river-decisions-07', topic: 'river-decisions', lv: 2,
    q: '河牌過牌加注（Check-Raise）的範圍應該長什麼樣子？',
    opts: ['極化：堅果級價值牌加上精挑的詐唬，不放中等牌', '以中等牌為主，看看對手在哪裡', '只放詐唬，價值牌一律過牌跟注', '任何牌都可以，越常加注越好'],
    ans: 0,
    exp: '河牌加注後，更差的牌會棄、只有更好的牌會跟，所以中等牌加注等於把自己變成詐唬。價值部分只放河牌成的順子、同花、葫蘆等強牌，詐唬部分挑沒攤牌價值、又阻擋對手跟注牌的手牌。' }
);

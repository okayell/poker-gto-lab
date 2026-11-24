/* GTO 撲克學院 — theory_part1.js
 * 第 1–12 課：基礎篇（規則、位置、組合數、撲克數學）、GTO 核心觀念篇、翻前策略篇（上）。
 */
window.GTO = window.GTO || {};
GTO.THEORY = (GTO.THEORY || []).concat([
  // ===========================================================================
  // 1. 德州撲克規則與牌型大小
  // ===========================================================================
  {
    id: 'rules',
    part: '一、基礎篇',
    title: '德州撲克規則與牌型大小',
    icon: '🃏',
    level: 1,
    minutes: 8,
    summary: '認識無限注德州撲克（NLH）的四條街流程、行動規則、10 種成牌大小與 7 張牌真實出現機率，以及踢腳（Kicker）與分池判定。',
    keyPoints: [
      '每位玩家發 2 張私有底牌（Hole Cards），搭配牌面 5 張公共牌（Community Cards），7 選 5 組成最大牌型。',
      '一局共有四個下注回合（四條街）：翻牌前（Preflop）→ 翻牌圈（Flop 3 張）→ 轉牌圈（Turn 1 張）→ 河牌圈（River 1 張）。',
      '7 張牌中「一對（43.8%）」與「兩對（23.5%）」最常出現；葫蘆（2.60%）比同花（3.03%）更難湊出，所以葫蘆比同花大——牌型越稀有排名越高（排名依 5 張牌機率制定，7 張牌時順序仍大致成立）。',
      '永遠取「最好的 5 張牌」比大小，沒有「第 6 張踢腳」，也沒有花色大小之分（♠ ♥ ♦ ♣ 在德州撲克完全平手）。'
    ],
    html: `
      <h3>1. 遊戲核心與四條街（Streets）流程</h3>
      <p>在<strong>無限注德州撲克（No-Limit Texas Hold'em, NLH）</strong>中，使用一副標準 52 張撲克牌（不含鬼牌）。每位玩家會拿到 <strong>2 張只有自己能看的底牌（Hole Cards）</strong>，牌桌上則會依序發出 <strong>5 張所有人共用的公共牌（Community Cards / Board）</strong>。每位玩家從這 7 張牌中挑出<strong>任意 5 張最強組合</strong>來比大小（可用 2 張底牌 + 3 張公共牌、1 張底牌 + 4 張公共牌，甚至 0 張底牌全部直接用牌面 5 張公共牌「Play the Board」）。</p>
      <table class="tbl">
        <thead>
          <tr><th>回合（街 Street）</th><th>發牌內容</th><th>行動順序（6 人桌）</th><th>重點說明</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>強制盲注（Blinds）</strong></td><td>發牌前強制投入</td><td>SB 放 0.5bb、BB 放 1bb</td><td>製造初始底池（1.5bb），讓玩家有爭奪底池的誘因</td></tr>
          <tr><td><strong>① 翻牌前（Preflop）</strong></td><td>每人 2 張私有底牌</td><td><strong>UTG → HJ → CO → BTN → SB → BB</strong></td><td>大盲（BB）已先投入 1bb，所以翻前最後行動</td></tr>
          <tr><td><strong>② 翻牌圈（Flop）</strong></td><td>一次發出 3 張公共牌</td><td><strong>SB → BB → UTG → HJ → CO → BTN</strong></td><td>7 張牌已出現 5 張（約 71% 資訊），決定底池走向</td></tr>
          <tr><td><strong>③ 轉牌圈（Turn）</strong></td><td>發出第 4 張公共牌</td><td><strong>SB → BB → … → BTN</strong></td><td>底池變大，聽牌只剩最後一張機會，下注尺度常放大</td></tr>
          <tr><td><strong>④ 河牌圈（River）</strong></td><td>發出第 5 張公共牌</td><td><strong>SB → BB → … → BTN</strong></td><td>所有牌發完，未成牌的聽牌勝率歸零，範圍完全極化</td></tr>
          <tr><td><strong>攤牌（Showdown）</strong></td><td>比較最佳 5 張牌</td><td>河牌最後主動下注／加注者先亮牌</td><td>若河牌所有人過牌，由按鈕左手邊第一位仍在牌局中的玩家（SB 方向）先亮牌</td></tr>
        </tbody>
      </table>

      <h3>2. 10 種牌型由大到小與 7 張牌真實機率</h3>
      <p>下表列出從 52 張牌發出 7 張（共 133,784,560 種組合）時，各牌型作為最佳 5 張牌的精確機率：</p>
      <table class="tbl">
        <thead>
          <tr><th>排名</th><th>牌型（中 / 英）</th><th>牌例（5 張成牌）</th><th>7 張牌出現機率</th><th>平手時的比法（踢腳 Kicker）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>1</strong></td><td><strong>皇家同花順</strong>（Royal Flush）</td><td><span class="cards">AsKsQsJsTs</span></td><td>0.0032%</td><td>同花色 A-K-Q-J-T，堅果無敵</td></tr>
          <tr><td><strong>2</strong></td><td><strong>同花順</strong>（Straight Flush）</td><td><span class="cards">9h8h7h6h5h</span></td><td>0.0279%</td><td>比順子最高那張（<span class="cards">5d4d3d2dAd</span> 為最小 5 高同花順）</td></tr>
          <tr><td><strong>3</strong></td><td><strong>四條 / 鐵支</strong>（Four of a Kind / Quads）</td><td><span class="cards">QcQdQhQs7c</span></td><td>0.168%</td><td>先比四條點數；若四條在公共牌，比第 5 張踢腳</td></tr>
          <tr><td><strong>4</strong></td><td><strong>葫蘆</strong>（Full House / Boat）</td><td><span class="cards">KhKdKs9c9d</span></td><td>2.60%</td><td><strong>先比三條點數</strong>，三條相同才比對子點數</td></tr>
          <tr><td><strong>5</strong></td><td><strong>同花</strong>（Flush）</td><td><span class="cards">AdJd9d6d2d</span></td><td>3.03%</td><td>取最大的 5 張同花色牌，由最高張一路往下比</td></tr>
          <tr><td><strong>6</strong></td><td><strong>順子</strong>（Straight）</td><td><span class="cards">Tc9s8h7d6c</span></td><td>4.62%</td><td>A 可當最大（<span class="cards">AsKdQhJcTs</span> 百老匯順）或最小（<span class="cards">5s4d3h2cAs</span> 輪子順 Wheel）</td></tr>
          <tr><td><strong>7</strong></td><td><strong>三條</strong>（Three of a Kind / Set / Trips）</td><td><span class="cards">8s8h8dAcJd</span></td><td>4.83%</td><td>口袋對子擊中稱 <strong>Set（暗三條）</strong>；牌面一對配手牌一張稱 <strong>Trips（明三條）</strong></td></tr>
          <tr><td><strong>8</strong></td><td><strong>兩對</strong>（Two Pair）</td><td><span class="cards">AhAdJcJs4d</span></td><td>23.5%</td><td>先比大對、再比小對、最後比<strong>第 5 張踢腳</strong>（若有三對，只取最大的兩對！）</td></tr>
          <tr><td><strong>9</strong></td><td><strong>一對</strong>（One Pair）</td><td><span class="cards">KsKdQhTc4s</span></td><td>43.8%</td><td>先比對子點數，相同時依序比較最大的 3 張踢腳</td></tr>
          <tr><td><strong>10</strong></td><td><strong>高牌</strong>（High Card）</td><td><span class="cards">AsQd9c6h3s</span></td><td>17.4%</td><td>無任何對子或聽牌完成，由最大單張往下比 5 張</td></tr>
        </tbody>
      </table>

      <h3>3. 新手最常搞錯的 3 個規則陷阱</h3>
      <div class="callout warn">
        <b>常見錯誤 1：以為「三對」大於兩對，或比到第 6 張牌</b><br>
        德州撲克<strong>永遠只取 5 張牌</strong>！例如公共牌是 <span class="cards">AhAd8s8c2d</span>，甲拿 <span class="cards">KhQd</span>、乙拿 <span class="cards">Kd7c</span>：兩人的最佳 5 張牌都是 <strong>A-A-8-8-K</strong>，因此<strong>平分底池（Split Pot）</strong>！甲的 Q 是第 6 張牌，完全不參與比較；若甲拿的是 <span class="cards">9h9c</span>，他的最佳 5 張是 <strong>A-A-9-9-8</strong>，才會贏過乙的 A-A-8-8-K。
      </div>
      <div class="callout warn">
        <b>常見錯誤 2：以為花色有大小</b><br>
        德州撲克<strong>沒有花色大小</strong>。兩人都拿到 A 高同花時，比的是同花裡第 2 大、第 3 大…的點數；如果 5 張點數完全一樣（例如同花全部來自公共牌），就平分底池，♠ 不會贏 ♥。
      </div>
      <div class="callout warn">
        <b>常見錯誤 3：忘記「公共牌本身可能就是最大」</b><br>
        公共牌 <span class="cards">Ts9h8d7c6s</span> 已經是 T 高順子。你拿 <span class="cards">AhKd</span>、對手拿 <span class="cards">2c2d</span>，兩人的最佳 5 張都是公共牌的 T-9-8-7-6，<strong>平分底池</strong>；只有手上拿 J 的人（J-T-9-8-7）才會贏。這種情況叫「打公共牌（Play the Board）」。
      </div>
      <div class="callout tip">
        <b>小技巧：暗三條（Set）vs 明三條（Trips）的關鍵差別</b><br>
        兩者牌力同為三條，但實戰價值天差地遠：當你手握口袋對子 <span class="cards">7s7h</span> 在 <span class="cards">Ks7d2c</span> 翻牌中 <strong>Set</strong> 時，牌面看不出三條，極度隱蔽，對手拿 <span class="hand">AK</span> 頂對很容易把整疊籌碼輸給你；相反地，若牌面是 <span class="cards">7c7dKs</span> 而你拿 <span class="hand">A7s</span> 中 <strong>Trips</strong>，全世界都看到牌面成對，且你還得擔心對手是不是踢腳更大或已經做成葫蘆。
      </div>

      <h3>4. 牌例：一手牌從發牌打到攤牌</h3>
      <div class="hh">
        <div class="hh-title">牌例：BTN 開池、BB 防守的單挑底池</div>
        <div class="hh-row"><span class="hh-street">翻前</span>SB、BB 先放 0.5bb / 1bb 盲注。UTG、HJ、CO 棄牌，你在 BTN 拿 <span class="cards">AhJh</span> 開池 2.5bb，SB 棄牌，BB 跟注（補 1.5bb）。底池 = 2.5 + 2.5 + 0.5 = <strong>5.5bb</strong>。</div>
        <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Jd7c2h</span>，翻後由 BB 先行動：BB 過牌，你下注 2bb，BB 跟注。底池 9.5bb。</div>
        <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">4s</span>，BB 過牌，你過牌（控制底池）。底池仍為 9.5bb。</div>
        <div class="hh-row"><span class="hh-street">河牌</span><span class="cards">9c</span>，BB 下注 5bb，你跟注。底池 19.5bb。</div>
        <div class="hh-row result"><span class="hh-street">攤牌</span>BB 最後主動下注，先亮出 <span class="cards">Js8s</span>：兩人都是一對 J，比踢腳——你的最佳 5 張 J-J-A-9-7，對手 J-J-9-8-7，<strong>你的 A 踢腳獲勝</strong>，贏下 19.5bb。</div>
      </div>
    `
  },

  // ===========================================================================
  // 2. 6 人桌位置與位置優勢
  // ===========================================================================
  {
    id: 'positions',
    part: '一、基礎篇',
    title: '6 人桌位置與位置優勢',
    icon: '🧭',
    level: 1,
    minutes: 9,
    summary: '理解 6-Max 六個位置（UTG、HJ、CO、BTN、SB、BB）的行動順序、為什麼按鈕位（BTN）長期獲利最高，以及各位置標準開池寬度。',
    keyPoints: [
      '6 人桌依翻前行動順序為：UTG（槍口 ~17%）→ HJ（劫持 ~22%）→ CO（關煞 ~30%）→ BTN（按鈕 ~45%）→ SB（小盲 ~43%）→ BB（大盲）。',
      '有位置（IP, In Position）代表翻後每一條街都比對手晚行動，能先看到對手動作再決定策略，權益實現率（EQR）往往超過 100%。',
      '按鈕位（BTN）翻後永遠最後行動，是全桌長期獲利最高的位置；小盲（SB）與大盲（BB）因強制盲注，長期總 EV 為負，目標是「少輸就是贏」。',
      '位置越靠後，後面尚未表態的玩家越少，被 3-Bet 的機率越低，因此開池範圍可以大幅放寬。'
    ],
    html: `
      <h3>1. 6 人桌（6-Max）六大位置全解析</h3>
      <p>現代線上與實戰現金桌最主流的規格是 <strong>6 人桌（6-Max）</strong>。相較於 9 人滿員桌（Full Ring），6 人桌相當於把最前面的 3 個早位拿掉，節奏更快、後位偷盲與 3-Bet 攻防更加頻繁。</p>
      <table class="tbl">
        <thead>
          <tr><th>位置縮寫</th><th>中文名稱</th><th>英文全名</th><th>後面剩幾人</th><th>標準 RFI 開池率</th><th>位置定位與策略特性</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>UTG</strong>（或 LJ）</td><td><strong>槍口位</strong>（低劫位）</td><td>Under the Gun / Lowjack</td><td>5 人</td><td><strong>約 17%</strong>（2.5bb）</td><td>翻前第一個行動，被 3-Bet 機率最高且翻後常沒位置，範圍最緊</td></tr>
          <tr><td><strong>HJ</strong></td><td><strong>劫持位</strong></td><td>Hijack</td><td>4 人</td><td><strong>約 22%</strong>（2.5bb）</td><td>中前位，22+ 口袋對子全部開池，加入更多同花連張與 KJo/QJo</td></tr>
          <tr><td><strong>CO</strong></td><td><strong>關煞位</strong></td><td>Cutoff</td><td>3 人</td><td><strong>約 30%</strong>（2.5bb）</td><td>黃金後位，只要 BTN 棄牌就能享有翻後絕對位置優勢</td></tr>
          <tr><td><strong>BTN</strong></td><td><strong>按鈕位 / 莊位</strong></td><td>Button / Dealer</td><td>2 人（僅盲注）</td><td><strong>約 45%</strong>（2.5bb）</td><td><strong>全桌最強位置！</strong>翻後三條街永遠最後行動（IP）</td></tr>
          <tr><td><strong>SB</strong></td><td><strong>小盲位</strong></td><td>Small Blind</td><td>1 人（僅 BB）</td><td><strong>約 43%</strong>（3.0bb）</td><td>已強制投入 0.5bb，但翻後永遠第一個行動（最差 OOP），採 Raise-or-Fold</td></tr>
          <tr><td><strong>BB</strong></td><td><strong>大盲位</strong></td><td>Big Blind</td><td>0 人（翻前關門）</td><td>防守位置</td><td>已投入 1bb，享底池賠率折扣與翻前關門權，對 BTN、SB 開池防守超過 50%</td></tr>
        </tbody>
      </table>

      <h3>2. 為什麼「有位置（IP）」在 GTO 中價值連城？</h3>
      <p>在翻牌後（Flop、Turn、River），<strong>有位置（In Position, IP）</strong>的玩家每一條街都最後行動，帶來四大結構性優勢：</p>
      <ul>
        <li><strong>資訊優勢（Information Advantage）</strong>：每次輪到你決定前，對手都必須先過牌（Check）或下注（Bet），等於每條街多看對手一張「動作底牌」。</li>
        <li><strong>免費看牌權（Free Card &amp; Equity Realization）</strong>：當你拿聽牌或中等對子時，若對手過牌，IP 可以選擇跟著過牌（Check Back）免費看下一張牌；OOP 若過牌則隨時可能面對對手下注而被迫棄牌。</li>
        <li><strong>底池控制（Pot Control）</strong>：IP 可以決定這條街要不要把底池做大，手持一對中等牌力時能輕鬆把三條街壓成兩條街價值。</li>
        <li><strong>更有效的詐唬與薄價值（Thin Value）</strong>：當對手在河牌過牌示弱時，IP 能精準估算對手封頂範圍，打出極高成功率的詐唬或薄價值下注。</li>
      </ul>

      <h3>3. 視覺化對比：UTG 開池（17%）vs BTN 開池（45%）</h3>
      <p>看看同樣是開池加注 2.5bb，從槍口位（UTG）移動到按鈕位（BTN），GTO 允許我們多玩多少手牌：</p>
      <div class="embed-chart" data-scenario="rfi_utg"></div>
      <div class="embed-chart" data-scenario="rfi_btn"></div>

      <div class="callout key">
        <b>重點結論：為什麼盲注位長期是負 EV？</b><br>
        如果你在 SB 與 BB 每一手牌都直接棄牌，長期勝率會是 <strong>SB = -50 bb/100、BB = -100 bb/100</strong>（每 100 手各被收一次盲注 × 100 次）。就算防守與 3-Bet 打得很好，盲注位仍然是負的：常見的贏家數據大約是 <strong>SB -10 ~ -25 bb/100、BB -20 ~ -40 bb/100</strong>（依級別、抽水與對手而不同），目標是「比全棄少輸」。整張桌子的淨利潤主要來自 <strong>BTN、CO</strong>，其次是 HJ 與 UTG。
      </div>

      <h3>4. 常見錯誤：不看位置、一律同樣打法</h3>
      <div class="compare">
        <div>
          <h4>✅ 正確</h4>
          <ul>
            <li>位置越前越緊：UTG 只開約 17%，BTN 可開到約 45%。</li>
            <li>SB 採 raise-or-fold：要玩就加注到 3bb，不要平跟（溜入）。</li>
            <li>同一手牌在不同位置可以有不同答案：<span class="hand">KTo</span> 在 UTG 棄牌、在 CO / BTN 開池。</li>
          </ul>
        </div>
        <div>
          <h4>❌ 錯誤</h4>
          <ul>
            <li>在 UTG 開 <span class="hand">KTo</span>、<span class="hand">A9o</span> 這類容易被壓制的牌，翻後還常沒位置。</li>
            <li>在 BTN 只玩大牌，浪費全桌最好的位置。</li>
            <li>在盲注位「因為已經放錢了」就亂跟——已投入的盲注是沉沒成本，只看跟注後的底池賠率與翻後實現能力。</li>
          </ul>
        </div>
      </div>
    `
  },

  // ===========================================================================
  // 3. 起手牌、169 種牌型與組合數
  // ===========================================================================
  {
    id: 'hands-combos',
    part: '一、基礎篇',
    title: '起手牌、169 種牌型與組合數',
    icon: '🔢',
    level: 1,
    minutes: 10,
    summary: '徹底搞懂 52 張牌如何構成 1,326 個具體組合與 13×13 的 169 種起手牌格，並學會秒算卡牌移除效應（Blocker / Card Removal）。',
    keyPoints: [
      '52 張牌任取 2 張共有 52 × 51 ÷ 2 = 1,326 種具體組合（Combos），在不分花色等價下歸納為 169 種起手牌型。',
      '每種口袋對子有 6 組（共 13 × 6 = 78 組）、每種同花牌有 4 組（共 78 × 4 = 312 組）、每種非同花牌有 12 組（共 78 × 12 = 936 組）。',
      '每一格非同花牌（12 組）的數量是同花牌（4 組）的整整 3 倍！因此開池或跟注若亂加非同花牌，範圍會瞬間膨脹失控。',
      '卡牌移除（Blocker）：當你手上有一張 A 時，對手拿到 AA 的組合從 6 組直接減半剩 3 組，拿到 AK 從 16 組降為 12 組。'
    ],
    html: `
      <h3>1. 1,326 組合與 169 種起手牌的數學結構</h3>
      <p>一副牌有 52 張，發給你 2 張底牌的總組合數為：</p>
      <div class="formula">總起手牌組合數 = 52 × 51 ÷ 2 = 1,326 組（Combos）</div>
      <p>因為翻牌前黑桃、紅心、方塊、梅花四種花色機率完全對稱，我們把 1,326 組濃縮進一張 <strong>13 × 13 = 169 格</strong>的範圍表中：</p>
      <table class="tbl">
        <thead>
          <tr><th>類別</th><th>13×13 表位置</th><th>牌型數量</th><th>每格組合數</th><th>總組合數</th><th>佔全體起手牌比例</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>口袋對子（Pocket Pairs）</strong></td><td>左上到右下<strong>對角線</strong>（<span class="hand">AA</span>–<span class="hand">22</span>）</td><td>13 種</td><td><strong>6 組</strong>（4 選 2）</td><td>78 組</td><td>5.88%（單一對子約 0.45%）</td></tr>
          <tr><td><strong>同花牌（Suited, s）</strong></td><td>對角線<strong>右上方</strong>（如 <span class="hand">AKs</span>、<span class="hand">T9s</span>）</td><td>78 種</td><td><strong>4 組</strong>（4 種花色）</td><td>312 組</td><td>23.53%（單格約 0.30%）</td></tr>
          <tr><td><strong>非同花牌（Offsuit, o）</strong></td><td>對角線<strong>左下方</strong>（如 <span class="hand">AKo</span>、<span class="hand">KQo</span>）</td><td>78 種</td><td><strong>12 組</strong>（4 × 3）</td><td>936 組</td><td>70.59%（單格約 0.90%）</td></tr>
          <tr><td><strong>合計（如 <span class="hand">AK</span> 總和）</strong></td><td>同花 4 組 + 非同花 12 組</td><td>169 種</td><td>無對子共 <strong>16 組</strong></td><td><strong>1,326 組</strong></td><td>100.0%</td></tr>
        </tbody>
      </table>

      <h3>2. 卡牌移除效應（Card Removal / Blockers）速算表</h3>
      <p>當你手中握有某張牌，或公共牌已經開出某張牌時，對手能組成特定強牌的組合數會大幅減少——這就是 GTO 挑選詐唬牌與抓詐牌的核心武器：</p>
      <table class="tbl">
        <thead>
          <tr><th>你想估算的對手牌型</th><th>原始組合數</th><th>當你手上有 1 張同點數牌（例如你有 1 張 A）</th><th>當你手上有 2 張相干牌（例如你有 AA 或 AK）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>口袋對子（如 <span class="hand">AA</span>）</strong></td><td><strong>6 組</strong></td><td>只剩 3 × 2 ÷ 2 = <strong>3 組（直接減半！）</strong></td><td>若你有 <span class="hand">AA</span>，對手只剩 <strong>1 組</strong></td></tr>
          <tr><td><strong>同花大牌（如 <span class="hand">AKs</span>）</strong></td><td><strong>4 組</strong></td><td>你拿 1 張 A（如 <span class="cards">As</span>），<span class="cards">AsKs</span> 這組消失，剩 <strong>3 組</strong></td><td>若你有 <span class="cards">AsKh</span>，對手 <span class="hand">AKs</span> 只剩 <strong>2 組</strong></td></tr>
          <tr><td><strong>非同花大牌（如 <span class="hand">AKo</span>）</strong></td><td><strong>12 組</strong></td><td>剩 3 × 4 - 3 = <strong>9 組</strong></td><td>若你有 <span class="cards">AsKh</span>，對手 <span class="hand">AKo</span> 剩 <strong>7 組</strong>（剩下 9 組 AK 中有 2 組是同花）</td></tr>
          <tr><td><strong>任意兩張不成對（如全部 <span class="hand">AK</span>）</strong></td><td><strong>16 組</strong></td><td>3 張 A × 4 張 K = <strong>12 組（少 25%）</strong></td><td>你有 <span class="hand">AK</span> 時，剩 3 × 3 = <strong>9 組（少 44%！）</strong></td></tr>
        </tbody>
      </table>

      <h3>3. 同花（Suited）到底比非同花（Offsuit）強多少？</h3>
      <div class="callout key">
        <b>重點數據：同花只多約 2% 原始勝率，但可玩性高很多</b><br>
        以 <span class="hand">AKs</span> 對比 <span class="hand">AKo</span> 為例，兩者對隨機手牌的全下勝率約 <strong>67% vs 65%</strong>，只差約 <strong>2%</strong>（同花牌最終用兩張底牌做成同花的機率約 <strong>6.4%</strong>）。但在有四條街行動的深籌碼局中，同花牌在翻牌圈有 <strong>10.9% 機率直接擊中同花聽牌（Flush Draw, 9 outs）</strong>、更有約 <strong>41.6% 機率擊中後門同花聽牌（Backdoor Flush Draw）</strong>！這讓同花牌在翻牌與轉牌擁有大量持續開槍與加注半詐唬的空間，因此<strong>權益實現率（EQR）遠高於非同花牌</strong>。
      </div>

      <h3>4. 實戰應用：用組合數判斷「對手比較可能拿什麼」</h3>
      <div class="callout example">
        <b>例題：翻牌 <span class="cards">Kh7d2c</span>，對手可能是 <span class="hand">KK</span>、<span class="hand">77</span>、<span class="hand">AK</span> 中的哪一種？</b><br>
        • <span class="hand">KK</span>：牌面已出 1 張 K，剩 3 張 K → C(3,2) = <strong>3 組</strong><br>
        • <span class="hand">77</span>：同理剩 <strong>3 組</strong><br>
        • <span class="hand">AK</span>：4 張 A × 3 張 K = <strong>12 組</strong><br>
        結論：同樣是「對手很強」，頂對 <span class="hand">AK</span>（12 組）比暗三條（KK + 77 共 6 組）多出一倍。這就是為什麼不能每次都假設對手剛好拿到最強的牌。
      </div>
      <ol class="steps">
        <li><b>先列出對手可能的牌型</b>：依他的位置與行動（開池、跟注、3-Bet）決定範圍。</li>
        <li><b>扣掉看得到的牌</b>：公共牌與你手上的牌都會減少對手的組合（口袋對子 6 → 3 → 1；不成對 16 → 12 → 9）。</li>
        <li><b>比較價值組合 vs 詐唬組合</b>：如果對手的價值組合遠多於詐唬組合，就算底池賠率不錯也要小心。</li>
      </ol>
    `
  },

  // ===========================================================================
  // 4. 底池賠率、勝率與期望值
  // ===========================================================================
  {
    id: 'poker-math',
    part: '一、基礎篇',
    title: '底池賠率、勝率與期望值 (EV)',
    icon: '🧮',
    level: 1,
    minutes: 12,
    summary: '掌握牌桌上 5 秒心算必備的底池賠率（必要勝率）、Outs 與二四法則、隱含賠率，以及期望值（EV）正負判斷。',
    keyPoints: [
      '必要勝率（Required Equity）= 你的跟注金額 ÷（跟注後的總底池）= 跟注額 ÷（原底池 + 對手下注 + 你的跟注額）。',
      '二四法則（Rule of 2 and 4）：翻牌圈看兩張牌（到河牌）勝率 ≈ Outs × 4%；轉牌圈看一張牌（到河牌）勝率 ≈ Outs × 2%。',
      '期望值 EV = （贏的機率 × 贏得的金額）− （輸的機率 × 付出的成本）；只要長期 EV > 0 的決策就該執行。',
      '熟記翻前經典對決勝率：大對子 vs 小對子 ≈ 82:18、對子 vs 兩高牌（Coin Flip）≈ 55:45、壓制牌（AK vs AQ）≈ 74:26。'
    ],
    html: `
      <h3>1. 底池賠率（Pot Odds）與必要勝率公式</h3>
      <p>當對手下注時，你要不要跟注（Call），取決於你的手牌勝率（Equity）是否大於<strong>必要勝率（Required Equity）</strong>：</p>
      <div class="formula">必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）</div>
      <p>實戰最常見的下注尺度與必要勝率對照表（建議直接背起來）：</p>
      <table class="tbl">
        <thead>
          <tr><th>對手下注尺度（佔底池）</th><th>假設底池 100 時對手下多少</th><th>跟注後總底池</th><th>計算式</th><th>幾比幾賠率</th><th>跟注所需最低勝率</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>1/4 底池（25%）</strong></td><td>25</td><td>150</td><td>25 ÷ 150</td><td>5 : 1</td><td><strong>16.7%</strong></td></tr>
          <tr><td><strong>1/3 底池（33%）</strong></td><td>33</td><td>166</td><td>33 ÷ 166</td><td>4 : 1</td><td><strong>20.0%</strong></td></tr>
          <tr><td><strong>1/2 底池（50%）</strong></td><td>50</td><td>200</td><td>50 ÷ 200</td><td>3 : 1</td><td><strong>25.0%</strong></td></tr>
          <tr><td><strong>2/3 底池（66%）</strong></td><td>66</td><td>232</td><td>66 ÷ 232</td><td>2.5 : 1</td><td><strong>28.4%</strong></td></tr>
          <tr><td><strong>3/4 底池（75%）</strong></td><td>75</td><td>250</td><td>75 ÷ 250</td><td>2.33 : 1</td><td><strong>30.0%</strong></td></tr>
          <tr><td><strong>1 倍滿池（100%）</strong></td><td>100</td><td>300</td><td>100 ÷ 300</td><td>2 : 1</td><td><strong>33.3%</strong></td></tr>
          <tr><td><strong>1.5 倍超池（150%）</strong></td><td>150</td><td>400</td><td>150 ÷ 400</td><td>1.67 : 1</td><td><strong>37.5%</strong></td></tr>
          <tr><td><strong>2 倍超池（200%）</strong></td><td>200</td><td>500</td><td>200 ÷ 500</td><td>1.5 : 1</td><td><strong>40.0%</strong></td></tr>
        </tbody>
      </table>

      <h3>2. 補牌數（Outs）與二四法則（Rule of 2 and 4）</h3>
      <p>能讓你從落後逆轉成領先的未知好牌稱為 <strong>Outs（補牌）</strong>。在牌桌上可用<strong>二四法則</strong>快速心算聽牌成牌率（若 Outs &gt; 8，翻牌到河牌可用 <code>Outs × 4 − (Outs − 8)</code> 修正）：</p>
      <table class="tbl">
        <thead>
          <tr><th>常見聽牌類型</th><th>牌例</th><th>補牌數（Outs）</th><th>轉牌命中率（1 張）</th><th>翻牌到河牌命中率（2 張）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>口袋對子抽暗三條（Set）</strong></td><td><span class="cards">8s8h</span></td><td><strong>2 Outs</strong></td><td>4.3%（約 4%）</td><td>8.4%（約 8%）</td></tr>
          <tr><td><strong>卡順 / 內聽順（Gutshot）</strong></td><td><span class="cards">JhTh</span> 在 <span class="cards">8c7d2s</span></td><td><strong>4 Outs</strong></td><td>8.5%（約 8%）</td><td>16.5%（約 16%）</td></tr>
          <tr><td><strong>兩張高牌抽頂對（Overcards）</strong></td><td><span class="cards">AsKd</span> 在 <span class="cards">Jc7h3s</span></td><td><strong>6 Outs</strong></td><td>12.8%（約 12%）</td><td>24.1%（約 24%）</td></tr>
          <tr><td><strong>兩頭順聽牌（OESD）</strong></td><td><span class="cards">Ts9s</span> 在 <span class="cards">8c7d2h</span></td><td><strong>8 Outs</strong></td><td>17.0%（約 16%）</td><td>31.5%（約 32%）</td></tr>
          <tr><td><strong>同花聽牌（Flush Draw）</strong></td><td><span class="cards">Ah9h</span> 在 <span class="cards">Kh6h2c</span></td><td><strong>9 Outs</strong></td><td>19.1%（約 18%）</td><td>35.0%（約 35%）</td></tr>
          <tr><td><strong>同花聽 + 卡順</strong></td><td><span class="cards">AhQh</span> 在 <span class="cards">JhTh3c</span></td><td><strong>12 Outs</strong></td><td>25.5%（約 24%）</td><td>45.0%</td></tr>
          <tr><td><strong>同花聽 + 兩頭順（怪獸聽牌）</strong></td><td><span class="cards">JhTh</span> 在 <span class="cards">9h8h2c</span></td><td><strong>15 Outs</strong></td><td>31.9%（約 30%）</td><td><strong>54.1%（勝率過半，常比對手的一對還高！）</strong></td></tr>
        </tbody>
      </table>

      <h3>3. 翻前全下經典對決勝率速查表</h3>
      <table class="tbl">
        <thead>
          <tr><th>對決情境</th><th>範例手牌</th><th>近似勝率比</th><th>記憶口訣</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>大對子 vs 小對子（Overpair vs Underpair）</strong></td><td><span class="hand">AA</span> vs <span class="hand">KK</span> / <span class="hand">TT</span> vs <span class="hand">66</span></td><td><strong>82% : 18%</strong></td><td>約八二開，小對子主要靠 2 張補牌中 Set</td></tr>
          <tr><td><strong>對子 vs 兩張高牌（跑馬 Coin Flip）</strong></td><td><span class="hand">QQ</span> vs <span class="hand">AKs</span> / <span class="hand">88</span> vs <span class="hand">AKo</span></td><td><strong>約 55% : 45%</strong></td><td>經典「跑馬」（<span class="hand">AKs</span> 對 <span class="hand">QQ</span> 約 46%、<span class="hand">AKo</span> 對 <span class="hand">QQ</span> 約 43%）</td></tr>
          <tr><td><strong>對子 vs 一高一低（如 <span class="hand">JJ</span> vs <span class="hand">A9o</span>）</strong></td><td><span class="hand">JJ</span> vs <span class="hand">A9o</span></td><td><strong>72% : 28%</strong></td><td>對手主要靠 3 張 A 超車（9 只能做成更小的對子）</td></tr>
          <tr><td><strong>高牌壓制踢腳（Dominated）</strong></td><td><span class="hand">AKo</span> vs <span class="hand">AQo</span> / <span class="hand">KQo</span> vs <span class="hand">KJo</span></td><td><strong>74% : 26%</strong></td><td>最慘烈的壓制，落後方只有 3 張踢腳能救命</td></tr>
          <tr><td><strong>兩張高牌 vs 兩張低連張（無交集）</strong></td><td><span class="hand">AKo</span> vs <span class="hand">87s</span></td><td><strong>59% : 41%</strong></td><td>就算是 <span class="hand">AK</span> 對上同花連張，對方也有近 4 成勝率！</td></tr>
        </tbody>
      </table>

      <div class="callout example">
        <b>例題：計算跟注的期望值（EV）</b><br>
        河牌底池 <strong>100bb</strong>，對手全下 <strong>50bb</strong>。你拿頂對抓詐，估計對手有 <strong>30%</strong> 機率是詐唬（你贏），<strong>70%</strong> 機率是真牌（你輸）。該跟注嗎？<br>
        • 方法一（必要勝率法）：必要勝率 = 50 ÷ (100 + 50 + 50) = <strong>25%</strong>。你的勝率 30% &gt; 25%，<strong>必跟！</strong><br>
        • 方法二（EV 公式直算）：EV = 0.30 × (+150bb) − 0.70 × (50bb) = 45bb − 35bb = <strong>+10bb</strong>！每跟注一次平均淨賺 10bb！
      </div>

      <h3>4. 隱含賠率（Implied Odds）：中牌後還能多贏多少？</h3>
      <p>底池賠率只算「現在桌上的錢」。但聽牌中了以後，對手常常還會再付錢給你——把這筆「未來會多贏的錢」也算進去，就是<strong>隱含賠率</strong>。</p>
      <div class="formula">中牌後至少還要多贏 = 跟注額 ÷ 你的中牌率 −（原底池 + 對手下注 + 跟注額）</div>
      <div class="callout example">
        <b>例題：轉牌兩頭順聽牌，賠率不夠怎麼辦？</b><br>
        轉牌底池 10bb，對手下注 5bb。你拿兩頭順聽牌（8 outs），河牌中牌率 = 8 ÷ 46 ≈ <strong>17.4%</strong>；必要勝率 = 5 ÷ (10 + 5 + 5) = <strong>25%</strong>，直接跟注不夠。<br>
        需要中牌後多贏：5 ÷ 0.174 − 20 ≈ <strong>8.75bb</strong>。只要你判斷「河牌中順子時，對手平均還會再付約 9bb 以上」，跟注就有利可圖。
      </div>
      <div class="callout warn">
        <b>常見錯誤：把隱含賠率當成萬用藉口</b><br>
        中的是<strong>明顯的牌</strong>（例如第 4 張同花落下）或對手籌碼很短時，隱含賠率就很小；反過來，如果你中的是<strong>非堅果</strong>（例如小同花），還可能遇到「反向隱含賠率」——中牌後反而輸更多。
      </div>

      <h3>5. 觀念分析：牌桌上根本來不及按計算機，要怎麼用數學？</h3>
      <div class="callout plain">
        <b>破除迷思：撲克數學不是心算比賽，而是「買東西比價」的直覺框架！</b><br>
        很多初學者看到公式與百分比就頭痛，以為職業選手坐在牌桌上都在心算小數點。其實在實戰中，你<strong>完全不需要算到個位數或小數點</strong>，只要建立以下三個直覺習慣：
      </div>
      <ol class="steps">
        <li><b>把對手的下注看成「超商折扣價標籤」</b>：你只要記住三個最常見的標價——對手下<strong>小注（1/3 池）≈ 只要贏 2 成（20%）</strong>；對手下<strong>半池（1/2 池）≈ 要贏 1/4（25%）</strong>；對手下<strong>滿池（1 倍池）≈ 要贏 1/3（33%）</strong>。</li>
        <li><b>用「二四法則」一秒估出你的中獎率</b>：數一下有幾張牌能救你（Outs），只看下一張牌就 <strong>× 2</strong>（例如轉牌同花聽牌 9 張 × 2 ≈ 18%），翻牌圈兩張牌機會就 <strong>× 4</strong>（9 × 4 ≈ 36%）。</li>
        <li><b>中獎率 &gt; 標價就跟注，差很多就直接丟</b>：例如轉牌同花聽牌中獎率約 20%（9 ÷ 46 ≈ 19.6%），對手下 1/3 池（標價 20%）幾乎打平，再加上中牌後還能多贏的錢就值得跟；對手若直接下滿池（標價 33%），標價太貴，除非中牌後還能從他身上多掏一大筆錢（隱含賠率），否則乾脆棄牌省錢！</li>
      </ol>
    `
  },

  // ===========================================================================
  // 5. 什麼是 GTO？納許均衡與不可剝削
  // ===========================================================================
  {
    id: 'gto-intro',
    part: '二、GTO 核心觀念',
    title: '什麼是 GTO？納許均衡與不可剝削',
    icon: '♟️',
    level: 2,
    minutes: 10,
    summary: '從賽局理論的納許均衡（Nash Equilibrium）與無差異原則（Indifference Principle）出發，理解 GTO 為什麼使用混合策略，以及它與剝削打法的關係。',
    keyPoints: [
      'GTO（Game Theory Optimal，賽局理論最優）即兩人零和賽局中的「納許均衡」：當你採取 GTO 策略時，任何對手無論怎麼調整都無法剝削你。',
      '無差異原則（Indifference Principle）：透過精確控制自己的價值與詐唬比例，讓對手的邊緣抓詐牌（Bluff Catcher）「跟注 EV = 棄牌 EV = 0」。',
      '混合策略（Mixed Strategy）：同一手牌以例如 50% 加注、50% 跟注執行，是因為兩個動作 EV 幾乎相同，混合能讓你在不同行動分支（Nodes）都保有足夠的強牌與牌面覆蓋。',
      'GTO 是你的「防禦基準線（Baseline）」，當觀察到對手有明顯偏離時，再主動偏離 GTO 進行最大化剝削（Exploit）。'
    ],
    html: `
      <h3>1. 納許均衡（Nash Equilibrium）與「不可被剝削」</h3>
      <p><strong>GTO（Game Theory Optimal）</strong>的理論基礎是諾貝爾獎得主約翰·納許（John Nash）提出的<strong>納許均衡</strong>：一組策略組合中，<strong>沒有任何一方能透過單方面改變自己的策略而獲得更高期望值</strong>。在<strong>雙人零和遊戲</strong>（例如單挑底池）裡，均衡策略還有一個關鍵性質：不管對手怎麼打，你的期望值都不會低於均衡值——這就是「不可被剝削」。</p>
      <p>用大家最熟悉的「剪刀、石頭、布」來比喻：</p>
      <ul>
        <li>如果你的策略是「60% 出石頭、20% 出布、20% 出剪刀」，聰明的對手只要「100% 出布」就能把你打爆（這叫<strong>剝削 Exploit</strong>）。</li>
        <li>但如果你採取 <strong>1/3 石頭、1/3 剪刀、1/3 布</strong>的混合策略，對手不管出什麼，他的期望值（EV）永遠被鎖死在 0——這就是 <strong>GTO（不可被剝削策略）</strong>！</li>
      </ul>

      <h3>2. 無差異原則（Indifference Principle）：GTO 的數學靈魂</h3>
      <p>為什麼 GTO 要在河牌詐唬？為什麼防守要算 MDF？答案都是為了達成<strong>「讓對手的邊緣行動無差異（Indifferent）」</strong>！</p>
      <div class="callout example">
        <b>經典推導：AKQ 玩具遊戲與河牌完美詐唬頻率</b><br>
        假設河牌底池 <strong>100</strong>，你（進攻方）的範圍完全極化：只有<strong>堅果牌（Nuts，勝率 100%）</strong>與<strong>空氣牌（Air，勝率 0%）</strong>；對手拿的是一手<strong>抓詐牌（Bluff Catcher，只贏你的空氣、輸你的堅果）</strong>。<br>
        當你下注 <strong>100（1 倍底池）</strong>時，我們希望對手「跟注 EV = 棄牌 EV = 0」，請問你的下注範圍裡應該放幾成詐唬（設詐唬佔比為 b）？<br>
        • 對手棄牌 EV = <strong>0</strong><br>
        • 對手跟注 EV = b × (+200) + (1 − b) × (−100) = 300b − 100<br>
        • 令 300b − 100 = 0 ⇒ <strong>b = 1/3 ≈ 33.3%</strong>（即<strong>價值 : 詐唬 = 2 : 1</strong>）！<br>
        一旦你維持 <strong>2 組價值配 1 組詐唬</strong>，對手不管跟注 100% 還是棄牌 100%，他的 EV 永遠都是 0，完全無法從你身上佔到任何便宜！
      </div>

      <h3>3. 為什麼 Solver 會出現「50% 加注 / 50% 跟注」的混合策略？</h3>
      <p>看範圍表時，你常看到某些格子一半紅、一半綠。為什麼 Solver 不乾脆選 EV 比較高的那個動作 100% 執行？</p>
      <ol>
        <li><strong>因為兩個動作的 EV 完全相等！</strong>在納許均衡下，會被混合的手牌正是處於「加注 EV = 跟注 EV」的無差異邊界牌。</li>
        <li><strong>保護不同行動線的牌面覆蓋率（Board Coverage）</strong>：例如你在 BTN 拿 <span class="hand">87s</span> 面對開池，若 100% 平跟，那在 3-Bet 底池開出 <span class="cards">9s6s5d</span> 時你就永遠沒有順子與兩對；反之若 100% 3-Bet，平跟底池就會缺少同花連張。各分 50% 能讓兩條行動線都難以被對手針對。</li>
      </ol>

      <h3>4. 觀念分析：學 GTO 不是要你變成機器人，而是建立「防身基準線」</h3>
      <div class="callout tip">
        <b>實戰腦袋怎麼想？三個觀念讓你不再對 GTO 感到焦慮：</b><br>
        1. <strong>看到混合頻率（如 60% 下注 / 40% 過牌）不用背百分比</strong>：既然兩個動作被 Solver 混合，代表<strong>兩個動作的期望值（EV）幾乎一樣好</strong>！你就算每次都直接選頻率較高的那個動作，EV 損失也微乎其微；真正會讓你大失血的，是去做 Solver 顯示「0%」的動作。<br>
        2. <strong>先懂「標準答案」，才看得見對手的漏洞</strong>：GTO 就像體檢報告上的「正常參考值」。你必須先知道標準情況下該開池多寬、河牌該有多少詐唬，才認得出某位對手「太緊（Nit）」或「死不棄牌（跟注站）」，進而精準剝削他。<br>
        3. <strong>GTO 是防護罩，剝削是長矛</strong>：遇到不認識的對手或強敵時，站在 GTO 防護罩裡讓他無從下手；一旦發現對手有明顯壞習慣（例如永遠不棄對子），立刻收起複雜的平衡，直接用最賺錢的剝削打法收割！
      </div>

      <h3>5. 關於 GTO 的三個常見誤解</h3>
      <div class="callout warn">
        <b>常見錯誤</b><br>
        • <strong>「GTO 保證每一手都贏」</strong>：錯。GTO 只保證長期不被剝削，單手牌照樣會輸，短期結果受運氣主宰。<br>
        • <strong>「GTO 就是賺最多錢的打法」</strong>：不一定。對上漏洞明顯的玩家，GTO 賺得到錢，但針對性的剝削打法通常賺更多。<br>
        • <strong>「Solver 的答案在任何牌局都適用」</strong>：Solver 結果取決於輸入假設（籌碼深度、下注尺度、抽水、人數）。多人底池與現場常見的溜入（Limp）底池，往往不是標準單挑解的情境。
      </div>
    `
  },

  // ===========================================================================
  // 6. MDF 與 Alpha：防守頻率與詐唬成功率
  // ===========================================================================
  {
    id: 'mdf-alpha',
    part: '二、GTO 核心觀念',
    title: 'MDF 與 Alpha：防守頻率與詐唬成功率',
    icon: '🛡️',
    level: 2,
    minutes: 10,
    summary: '完整推導最小防守頻率（MDF）與純詐唬最低成功率（Alpha, α）的互補關係，並了解何時該嚴格遵守 MDF、何時可以合理棄牌更多。',
    keyPoints: [
      'Alpha（α）= 下注額 ÷（原底池 + 下注額）：代表進攻方拿 0% 勝率空氣牌純詐唬時，至少需要對手棄牌幾 % 才會直接回本（0 EV）。',
      'MDF（Minimum Defense Frequency，最小防守頻率）= 1 − α = 原底池 ÷（原底池 + 下注額）：防守方至少要繼續（跟注或加注）這個比例，才能阻止對手用任意兩張空氣牌無腦印鈔。',
      '熟記黃金數字：面對 1/3 底池下注 MDF = 75%（α = 25%）；面對 1/2 底池下注 MDF = 66.7%（α = 33.3%）；面對 1 倍底池下注 MDF = 50%（α = 50%）。',
      'MDF 的重要前提：假設詐唬牌是 0% 權益；在翻牌圈若對手擁有顯著範圍優勢，Solver 實際防守頻率常略低於理論 MDF（稱為 Overfold）。'
    ],
    html: `
      <h3>1. Alpha（α）與 MDF 的數學推導</h3>
      <p>假設目前底池為 <strong>P（Pot）</strong>，對手下注 <strong>B（Bet）</strong>。如果對手拿的是一手完全沒有勝率的純空氣牌（0% Equity），當你棄牌時他贏走 P；當你跟注時他損失 B。這手純詐唬要達到損益兩平（EV = 0），所需的最低棄牌率就是 <strong>Alpha（α）</strong>：</p>
      <div class="formula">Alpha（純詐唬所需棄牌率 α）= 下注額 B ÷（原底池 P + 下注額 B）</div>
      <p>反過來看，身為防守方，為了不讓對手「拿任意兩張垃圾牌下注都能自動賺錢」，你至少必須繼續留在底池（Call 或 Raise）的比例就是 <strong>MDF（最小防守頻率）</strong>：</p>
      <div class="formula">MDF（最小防守頻率）= 1 − α = 原底池 P ÷（原底池 P + 下注額 B）</div>

      <h3>2. 全尺度 MDF / Alpha / 底池賠率完整速查表</h3>
      <table class="tbl">
        <thead>
          <tr><th>下注尺度（佔底池）</th><th>Alpha（詐唬回本棄牌率）</th><th>MDF（最小防守頻率）</th><th>防守方最多可棄牌比例</th><th>跟注所需必要勝率（Pot Odds）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>25% 底池（1/4 Pot）</strong></td><td><strong>20.0%</strong></td><td><strong>80.0%</strong></td><td>20.0%</td><td>16.7%</td></tr>
          <tr><td><strong>33% 底池（1/3 Pot）</strong></td><td><strong>25.0%</strong></td><td><strong>75.0%</strong></td><td>25.0%</td><td>20.0%</td></tr>
          <tr><td><strong>50% 底池（1/2 Pot）</strong></td><td><strong>33.3%</strong></td><td><strong>66.7%</strong></td><td>33.3%</td><td>25.0%</td></tr>
          <tr><td><strong>66% 底池（2/3 Pot）</strong></td><td><strong>40.0%</strong></td><td><strong>60.0%</strong></td><td>40.0%</td><td>28.4%</td></tr>
          <tr><td><strong>75% 底池（3/4 Pot）</strong></td><td><strong>42.9%</strong></td><td><strong>57.1%</strong></td><td>42.9%</td><td>30.0%</td></tr>
          <tr><td><strong>100% 底池（1x Pot）</strong></td><td><strong>50.0%</strong></td><td><strong>50.0%</strong></td><td>50.0%</td><td>33.3%</td></tr>
          <tr><td><strong>150% 底池（1.5x Overbet）</strong></td><td><strong>60.0%</strong></td><td><strong>40.0%</strong></td><td>60.0%</td><td>37.5%</td></tr>
          <tr><td><strong>200% 底池（2x Overbet）</strong></td><td><strong>66.7%</strong></td><td><strong>33.3%</strong></td><td>66.7%</td><td>40.0%</td></tr>
        </tbody>
      </table>

      <h3>3. 面對加注（Facing a Raise）與翻前 3-Bet 時怎麼算 MDF？</h3>
      <p>當你先下注（或開池）<strong>b₁</strong>，對手加注到 <strong>b₂</strong> 時，對手冒的風險是 <strong>b₂</strong>（若他原本沒投入盲注），他能贏走的死錢是「原底池 + 你已投入的 b₁」：</p>
      <div class="callout example">
        <b>實戰例題：你在 CO 開池 2.5bb，被 BTN 3-Bet 到 7.5bb</b><br>
        • 死錢底池 P = 盲注 1.5bb + 你的開池 2.5bb = <strong>4.0bb</strong><br>
        • BTN 冒的風險 B = <strong>7.5bb</strong><br>
        • BTN 純詐唬 3-Bet 的 Alpha = 7.5 ÷ (4.0 + 7.5) = 7.5 ÷ 11.5 ≈ <strong>65.2%</strong><br>
        • 換算 CO 的純數學 MDF = 1 − 65.2% ≈ <strong>34.8%</strong><br>
        • 但注意：BTN 的詐唬牌被你跟注後還有翻後權益（不是 0% 勝率！），而且你自己的開池範圍本來就偏強，因此 Solver 中開池者面對 3x 3-Bet 實際常繼續（4-Bet + 跟注）約 <strong>45%–52%</strong> 的開池範圍（可對照本站 <a href="#/ranges/vs3bet_co_btn">CO vs BTN 3-Bet 範圍表</a>）！
      </div>

      <div class="callout warn">
        <b>常見誤解：不管什麼牌面都死守 MDF？</b><br>
        MDF 推導的前提是「雙方的牌要嘛 100% 贏、要嘛 0% 輸」。但在翻牌圈，例如 BTN 開池、BB 跟注，翻牌發出 <span class="cards">AsKdQh</span>——這個牌面 BTN 擁有壓倒性的範圍優勢與堅果優勢，BB 即使拿一對也很難在轉牌、河牌實現權益。此時 Solver 會讓 BB <strong>棄牌超過 MDF（Overfold）</strong>，因為硬跟注的 EV 比讓對手小賺詐唬還要更虧！
      </div>

      <h3>4. 觀念分析：不用死背 MDF 表格，實戰只要抓緊這兩個原則</h3>
      <div class="compare">
        <div>
          <h4>🛡️ 面對小注（如 1/3 池）：別太容易被嚇跑</h4>
          <p>對手只拿 1/3 底池試探時，他冒的風險極小（只要你棄牌超過 25% 他就賺）。這時你手上的<strong>任何對子、聽牌、甚至帶後門花順的高張</strong>都應該留下來防守，別養成「沒中頂對就秒棄」的習慣。</p>
        </div>
        <div>
          <h4>🚨 面對河牌大注／加注：看人決定，MDF 不是死命令</h4>
          <p>MDF 是為了防禦「懂得平衡詐唬的高手」。在一般牌局中，大多數玩家在河牌下大注或加注時<strong>根本湊不足理論詐唬比例（幾乎都是真強牌）</strong>。面對這種對手，直接把邊緣一對棄掉，比死守 MDF 省錢得多！</p>
        </div>
      </div>
    `
  },

  // ===========================================================================
  // 7. 價值與詐唬比例、極化與線性範圍
  // ===========================================================================
  {
    id: 'value-bluff',
    part: '二、GTO 核心觀念',
    title: '價值與詐唬比例、極化與線性範圍',
    icon: '⚖️',
    level: 2,
    minutes: 13,
    summary: '學會計算各條街與各下注尺度的最佳「價值 : 詐唬」黃金比例，徹底釐清「單一手牌（1 或 0）」與「整體範圍（2:1）」的觀念差異，掌握不用死背表格的三大實戰直覺。',
    keyPoints: [
      '河牌極化下注時，防守方的必要勝率就是進攻方的最佳詐唬佔比：詐唬比例 = 下注額 ÷（原底池 + 2 × 下注額）。',
      '下注尺度越大，可以放的詐唬比例越高：下 1/3 底池價值:詐唬 = 4:1（20% 詐唬）；下 1 倍底池 = 2:1（33.3% 詐唬）；下 2 倍底池 = 1.5:1（40% 詐唬）。',
      '觀念關鍵：對你手上的「單一手牌」而言，河牌確實不是 1（價值）就是 0（詐唬）；2:1 比例是指你在這個局面下「整套手牌範圍（Range）」的組合分工，完全不需要去記歷史牌局！',
      '實戰不用死背表格，記住三個核心邏輯：① 下注越大，詐唬佔比可以越高（因為對手需要更高勝率才能跟）；② 這是防禦高手剝削的防護罩；③ 遇到死不棄牌的休閒玩家（跟注站），直接忘掉表格、零詐唬狂打價值！'
    ],
    html: `
      <h3>1. 河牌最佳「價值 : 詐唬」比例公式</h3>
      <p>在河牌圈，所有公共牌都已發出。當你用極化範圍下注 <strong>B</strong> 進入底池 <strong>P</strong> 時，為了讓對手的抓詐牌（Bluff Catcher）剛好處於無差異狀態，你的<strong>詐唬佔總下注範圍的比例</strong>必須恰好等於<strong>對手的底池賠率（必要勝率）</strong>！</p>
      <div class="formula">河牌詐唬佔比 = 下注額 B ÷（原底池 P + 2 × 下注額 B）　｜　價值 : 詐唬 = (P + B) : B</div>
      <table class="tbl">
        <thead>
          <tr><th>河牌下注尺度</th><th>對手跟注必要勝率</th><th>你的最佳詐唬佔比</th><th>價值 : 詐唬組合比</th><th>實戰記憶法（每幾組價值配 1 組詐唬）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>25% 底池（1/4 Pot）</strong></td><td>16.7%</td><td><strong>16.7%</strong></td><td><strong>5 : 1</strong></td><td>每 5 組價值牌，只能配 1 組詐唬</td></tr>
          <tr><td><strong>33% 底池（1/3 Pot）</strong></td><td>20.0%</td><td><strong>20.0%</strong></td><td><strong>4 : 1</strong></td><td>每 4 組價值牌，配 1 組詐唬</td></tr>
          <tr><td><strong>50% 底池（1/2 Pot）</strong></td><td>25.0%</td><td><strong>25.0%</strong></td><td><strong>3 : 1</strong></td><td>每 3 組價值牌，配 1 組詐唬</td></tr>
          <tr><td><strong>66% 底池（2/3 Pot）</strong></td><td>28.4%</td><td><strong>28.4%</strong></td><td><strong>2.5 : 1</strong></td><td>每 5 組價值牌，配 2 組詐唬</td></tr>
          <tr><td><strong>75% 底池（3/4 Pot）</strong></td><td>30.0%</td><td><strong>30.0%</strong></td><td><strong>2.33 : 1</strong></td><td>約 7 成價值、3 成詐唬</td></tr>
          <tr><td><strong>100% 底池（1x Pot）</strong></td><td>33.3%</td><td><strong>33.3%</strong></td><td><strong>2 : 1</strong></td><td>每 2 組價值牌，配 1 組詐唬</td></tr>
          <tr><td><strong>150% 底池（1.5x Overbet）</strong></td><td>37.5%</td><td><strong>37.5%</strong></td><td><strong>1.67 : 1</strong></td><td>每 5 組價值牌，可配 3 組詐唬</td></tr>
          <tr><td><strong>200% 底池（2x Overbet）</strong></td><td>40.0%</td><td><strong>40.0%</strong></td><td><strong>1.5 : 1</strong></td><td>每 3 組價值牌，可配 2 組詐唬</td></tr>
        </tbody>
      </table>

      <h3>2. 觀念突破一：單手牌「不是 1 就是 0」，那 2:1 是給誰看的？</h3>
      <div class="callout plain">
        <b>這是一個德州撲克學習過程中非常經典且關鍵的迷思！</b><br>
        很多學習者看著上面的表格會冒出一個大問號：「我拿到一手牌走到河牌，對我來說要嘛是好牌（1）、要嘛是沒中（0），哪來的 2:1？難道我要去記跟對手的每一手歷史牌局，心想『我剛剛前兩局是價值，所以這局我一定要詐唬』嗎？」<br>
        <strong>答案是：你完全不需要去記跟對手的每一手牌，也絕對不是靠記歷史來湊比例！</strong>要解開這個盲點，我們只需要釐清<strong>「單一局面（Single Hand / Combo）」</strong>與<strong>「整體範圍（Range）」</strong>的差別：
      </div>

      <h4>① 為什麼你覺得「不是 1 就是 0」？</h4>
      <p>因為你把視角放在<strong>「單一手牌（Single Hand）」</strong>上。當你拿到一副具體的手牌走到河牌時，對你個人而言，這張牌當下的絕對牌力確實只有兩種可能：</p>
      <ul>
        <li><strong>強到可以拿價值（Value）</strong> → 對手跟注你，你會贏。</li>
        <li><strong>不夠強需要詐唬（Bluff）</strong> → 你必須把對手踢走才能贏。</li>
      </ul>
      <p>所以對你「此時此刻拿著的這兩張牌」來說，它的確不是 1 就是 0。</p>

      <h4>② 那表格上的比例（例如 2:1）是給誰看的？</h4>
      <p>表格上的比例（如 100% 底池下注對應的 <strong>2 : 1 價值與詐唬組合比</strong>），是指你<strong>「在這種情況下，所使用的整套手牌範圍（Range）」</strong>。</p>
      <p>德州撲克是機率與範圍的遊戲。當你在河牌決定下注（例如 1 個底池）時，你不會一輩子只拿 1 種牌組合去打，而是會把你走到河牌的所有手牌分工：</p>
      <div class="compare">
        <div>
          <h4>💎 價值組合（Value Combos）</h4>
          <p>你手牌範圍裡最強的那群牌（例如兩對、三條、順子、同花、葫蘆等），負責在對手跟注時贏錢。</p>
        </div>
        <div>
          <h4>🎭 詐唬組合（Bluff Combos）</h4>
          <p>你手牌範圍裡沒機會攤牌贏、但可以拿來當詐唬的牌（例如沒中聽牌的廢牌、空氣牌），負責逼對手棄牌、並掩護你的價值牌。</p>
        </div>
      </div>
      <p>你不需要去記錄歷史紀錄，你只需要在<strong>「當下這一手牌」</strong>，從你符合條件的牌組裡自然分配比例。</p>

      <h4>③ 不需要記歷史，實戰中具體該怎麼做？</h4>
      <p>實戰中，你不需要拿計算機算機率，而是透過以下三個觀念來達成平衡：</p>
      <ol class="steps">
        <li><b>A. 靠「手牌組合（Combos）」來湊比例</b>：以 <strong>100% 底池下注（2 : 1 比例）</strong>為例——假設在某個河牌面，你的範圍裡大約有 <strong>20 種組合</strong>的牌足夠強到可以下注拿價值；為了符合 2 : 1 的比例（即 2 份價值 : 1 份詐唬），你只需要從範圍裡挑出 <strong>10 種組合</strong>最差、最沒有攤牌價值的空氣牌來當作詐唬就行了（<strong>20 個價值 : 10 個詐唬 = 2 : 1</strong>）。</li>
        <li><b>B. 利用「隨機化（Randomization）」來決定</b>：如果你覺得現場數組合很麻煩，撲克選手通常會利用<strong>底牌的花色</strong>或<strong>手錶的秒針</strong>來做隨機化。例如你手上有 4 種不同花色的同花聽牌失敗組合（空氣牌），但你只需要 2 個詐唬組合，你可以規定自己「看到秒針指在偶數時（或手牌帶紅心／黑桃時）才拿來詐唬」，藉此在長期對戰中自然達到平衡，不讓對手透過花色或頻率抓到規律。</li>
        <li><b>C. 面對真實對手，不需要「完美 GTO」</b>：這張圖表代表的是 GTO（理論最優解），是用來保護自己不被高手剝削的<strong>「基準線」</strong>，而不是一條死板的法律！
          <ul>
            <li><strong>如果對手非常愛跟注（水魚／跟注站 Calling Station）</strong>：你根本不需要達到表上的詐唬比例，應該<strong>降低詐唬、提高價值比例（甚至不需要詐唬，狂打價值就對了）</strong>。</li>
            <li><strong>如果對手超愛棄牌（容易被嚇跑）</strong>：你可以<strong>提高詐唬比例</strong>，因為多詐唬幾次就能賺取超額利潤。</li>
          </ul>
        </li>
      </ol>

      <h3>3. 觀念突破二：不用死背，記住 3 個核心觀念</h3>
      <div class="callout key">
        <b>不需要死背，但建議把它當作「觀念框架」去理解！</b><br>
        你絕對不需要坐在牌桌上一邊拿計算機算、一邊死記 2:1、3:1 這些數字，因為實戰中根本來不及。不過，了解這張表背後的<strong>「邏輯」</strong>會對你的牌技非常有幫助——你可以把它簡化成以下<strong>三個核心觀念</strong>，在打牌時放在心裡就好：
      </div>
      <ol class="steps">
        <li><b>觀念 1：下注越大，詐唬佔比可以越高（反之亦然）</b><br>
          看表格最右邊的「價值：詐唬組合比」：<br>
          • <strong>下注 25% 底池（小注） → 比例是 5 : 1</strong>（價值很多，詐唬很少）。<br>
          • <strong>下注 200% 底池（超大注） → 比例是 1.5 : 1</strong>（詐唬佔的比例變高很多）。<br>
          <strong>為什麼？</strong>因為下注越大，對手跟注需要的勝率越高（下 2 倍底池時要 40%）。這代表你的下注範圍裡就算有 40% 是詐唬，他跟注也只是打平、佔不到便宜，所以你「可以」放更多詐唬；反過來，下 1/4 底池時對手只需要 16.7% 勝率就能跟，你若放太多詐唬就會被輕鬆抓爆，所以小注要以價值牌為主。</li>
        <li><b>觀念 2：這是一個「防禦對手剝削」的防護罩</b><br>
          這張表是 GTO（理論最佳解）的產物，它的核心目的是：<strong>「讓對手面對你的下注時，跟注和棄牌的期望值一樣——不管他怎麼選都佔不到便宜。」</strong><br>
          如果你打牌從不詐唬（全都是價值牌），對手只要懂一點觀念，就會發現「你一下注就等於有好牌」，然後通通棄牌，你永遠贏不到大錢。所以你必須在範圍裡適度放進一些詐唬，這張比例表就是告訴你「放多少才最科學、才不會被懂數學的對手反制」。</li>
        <li><b>觀念 3：實戰中該怎麼應用？（忘掉數字，記住原則）</b><br>
          • <strong>河牌決定要下重注時</strong>：檢查一下自己的手牌範圍，心裡有個底：「我現在除了拿堅果牌（最強的牌）拿價值之外，手上有沒有幾張剛好沒中、可以拿來開槍（詐唬）的廢牌？」只要有意識地<strong>「有攻有守」</strong>，就不會變成好欺負的明牌。<br>
          • <strong>遇到娛樂型玩家（休閒玩家）</strong>：直接把這張表忘掉！如果對手是那種「只要拿聽牌或對子就絕對跟到底、死不棄牌」的魚，你完全不需要詐唬，直接把價值牌拉滿、狂打價值就對了。<strong>記住：詐唬是留給會棄牌的高手看的！</strong></li>
      </ol>

      <h3>4. 三條街的詐唬漏斗：為什麼翻牌圈可以詐唬超過 50%？</h3>
      <p>剛才的公式只適用於河牌（詐唬牌勝率 = 0%）。在<strong>翻牌圈（Flop）與轉牌圈（Turn）</strong>，你的詐唬牌其實是<strong>半詐唬（Semi-Bluff，如花順聽牌、後門聽牌）</strong>，被跟注後還有機會在後面幾條街翻盤成強牌！因此三條街的價值與詐唬結構呈現「漏斗狀」（以下是以大注、極化下注為例的<strong>粗略經驗法則</strong>，實際比例依牌面與尺度而變）：</p>
      <ul>
        <li><strong>翻牌圈（Flop）</strong>：約 <strong>1.5 ~ 2 組半詐唬 : 1 組價值牌</strong>（半詐唬佔 60%–67%）。</li>
        <li><strong>轉牌圈（Turn）</strong>：部分聽牌成牌、部分放棄，收斂至約 <strong>1 組半詐唬 : 1 組價值牌</strong>（各佔 50%）。</li>
        <li><strong>河牌圈（River）</strong>：依下注尺度收斂至 <strong>1 組純詐唬 : 2 組價值牌</strong>（以滿池下注為例，詐唬佔 33%）。</li>
      </ul>

      <h3>5. 三大範圍形態：極化 vs 線性（合併）vs 壓縮</h3>
      <table class="tbl">
        <thead>
          <tr><th>範圍形態</th><th>英文名稱</th><th>牌力結構</th><th>對應下注尺度</th><th>典型實戰場景</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>極化範圍</strong></td><td><strong>Polarized Range</strong></td><td>只有<strong>最頂端強牌</strong>與<strong>底端詐唬牌</strong>，中間牌力全部過牌或平跟</td><td><strong>大注 / 超池注</strong>（75%–200% Pot）</td><td>河牌大注、BB 對前位開池的 3-Bet、翻後過牌加注（Check-Raise）</td></tr>
          <tr><td><strong>線性 / 合併範圍</strong></td><td><strong>Linear / Merged Range</strong></td><td>從最強牌一路往下<strong>連續選取到中強牌</strong>，不含垃圾牌</td><td><strong>中小尺度</strong>（25%–50% Pot）</td><td>SB 的「3-Bet or Fold」範圍、翻牌圈乾燥高牌面的小額範圍下注</td></tr>
          <tr><td><strong>壓縮 / 封頂範圍</strong></td><td><strong>Condensed / Capped Range</strong></td><td>頂端強牌已經加注走，只剩下<strong>大量中等一對與聽牌</strong></td><td>被動跟注 / 過牌</td><td>翻前 BB 平跟範圍、翻牌圈只跟注沒加注的防守範圍</td></tr>
        </tbody>
      </table>
    `
  },

  // ===========================================================================
  // 8. 範圍思維：範圍優勢與堅果優勢
  // ===========================================================================
  {
    id: 'range-thinking',
    part: '二、GTO 核心觀念',
    title: '範圍思維：範圍優勢與堅果優勢',
    icon: '🧠',
    level: 2,
    minutes: 10,
    summary: '戒掉「只看自己兩張底牌」的新手思維，學會判斷誰在特定公共牌面擁有「範圍優勢（Range Advantage）」與「堅果優勢（Nut Advantage）」，進而決定下注頻率與尺度。',
    keyPoints: [
      '黃金法則：「範圍優勢（整體平均勝率誰高）決定下注頻率；堅果優勢（最頂端超強牌誰多）決定下注尺度！」',
      '範圍優勢（Range Advantage）：比較雙方整個範圍在該牌面的平均權益（Equity）。領先越多，越適合高頻率下注（甚至 100% 範圍下注 Range Bet）。',
      '堅果優勢（Nut Advantage）：比較雙方誰能拿出更多暗三條、兩對、同花、順子或超對。只有擁有堅果優勢的一方才能使用大注或超池注（Overbet）。',
      '封頂範圍（Capped Range）：當一方在前面的行動中沒有加注（例如翻前只在 BB 平跟，或翻牌只跟注），其範圍就缺乏頂端強牌，極易遭受對手大注施壓。'
    ],
    html: `
      <h3>1. 影響翻後整套策略的兩句話</h3>
      <div class="callout key">
        <b>GTO 翻後核心鐵律</b><br>
        1. <strong>範圍優勢（Range Advantage）決定你的「下注頻率（Frequency）」</strong>：整體範圍平均勝率越高，下注頻率越高。<br>
        2. <strong>堅果優勢（Nut Advantage）決定你的「下注尺度（Sizing）」</strong>：頂端超強牌比例越懸殊，下注尺度可以越大（甚至 Overbet）！
      </div>

      <h3>2. 實戰牌面剖析：BTN 開池 vs BB 跟注</h3>
      <p>假設 BTN 開池 2.5bb（範圍 45%，包含所有 <span class="hand">AA</span>–<span class="hand">TT</span>、<span class="hand">AK</span>、<span class="hand">AQ</span>），而 BB 選擇平跟（BB 的 <span class="hand">AA</span>–<span class="hand">QQ</span>、<span class="hand">AK</span> 大多已在翻前 3-Bet，<span class="hand">JJ</span>、<span class="hand">TT</span>、<span class="hand">AQ</span> 也有一部分 3-Bet，所以 BB 平跟範圍的頂端偏弱，接近<strong>封頂 Capped</strong>）。我們來看三種截然不同的翻牌：</p>
      <table class="tbl">
        <thead>
          <tr><th>翻牌牌面</th><th>範圍優勢（平均勝率）</th><th>堅果優勢（頂端強牌）</th><th>BTN 的最佳 C-Bet 策略</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="cards">AsKd2c</span><br>（AK 高乾燥彩虹面）</td>
            <td><strong>BTN 領先最多（~57% vs 43%）</strong></td>
            <td><strong>BTN 幾乎壟斷</strong>（BB 的 AA/KK/AK 大多已 3-Bet，只剩 22 暗三條與少量 A2s/K2s 兩對）</td>
            <td><strong>高頻率（接近 100%）+ 可用大注或小注</strong>：BTN 幾乎什麼牌都能下注，BB 被迫大量棄牌</td>
          </tr>
          <tr>
            <td><span class="cards">Ks7d2c</span><br>（K 高乾燥彩虹面）</td>
            <td><strong>BTN 明顯領先（~55% vs 45%）</strong></td>
            <td>BTN 有 AA/KK/AK，雙方都有 77/22</td>
            <td><strong>高頻率（85%+）+ 小尺度（25%–33% 底池）</strong>：經典的小注範圍下注（Range Bet）牌面</td>
          </tr>
          <tr>
            <td><span class="cards">7s6s5d</span><br>（低張雙色連接面）</td>
            <td><strong>雙方接近（~50% vs 50%）</strong></td>
            <td><strong>BB 反而略優！</strong>（BB 防守範圍有更多 <span class="hand">98s</span>、<span class="hand">43s</span>、<span class="hand">84s</span> 順子與 <span class="hand">76s</span>、<span class="hand">65s</span>、<span class="hand">75s</span> 兩對，以及 <span class="hand">98o</span>、<span class="hand">64o</span> 這類 BTN 不會開的非同花牌）</td>
            <td><strong>大幅降低下注頻率（高頻過牌 Check Back）</strong>！若胡亂 C-Bet 會頻繁遭到 BB 過牌加注（Check-Raise）懲罰</td>
          </tr>
        </tbody>
      </table>

      <h3>3. 什麼是「封頂範圍（Capped Range）」？如何懲罰它？</h3>
      <p>當對手的行動線排除了該牌面所有最強牌時，他的範圍就是<strong>封頂（Capped）</strong>的。例如：</p>
      <ul>
        <li><strong>翻前平跟者</strong>通常沒有 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">QQ</span>、<span class="hand">AK</span>。</li>
        <li><strong>翻牌、轉牌連續過牌跟注（Check-Call）的防守者</strong>，在牌面沒有湊成新順子或同花時，通常只有一對抓詐牌（因為兩對、暗三條多半已經在翻牌或轉牌過牌加注了）。</li>
      </ul>
      <p>當你的範圍<strong>未封頂（Uncapped，保有所有堅果）</strong>而對手範圍<strong>已封頂（Capped）</strong>時，GTO 的標準答案就是使用<strong>大尺度（75%–100% 底池）甚至超池下注（Overbet 125%–200%）</strong>，把對手的抓詐牌逼入絕境！</p>

      <h3>4. 牌桌上 10 秒判斷：誰有範圍優勢？</h3>
      <ol class="steps">
        <li><b>誰是翻前加注者？</b>翻前加注（尤其是 3-Bet）的人，範圍頂端有更多 AA、KK、AK。</li>
        <li><b>這個牌面打中誰的範圍？</b>A、K、Q 高牌面通常有利於加注者；6-5-4、8-7-5 這類中低連張面通常有利於跟注者（BB 有更多小同花連張與小對子）。</li>
        <li><b>誰能拿出最強的牌？</b>數一數暗三條、兩對、順子的組合：最強的牌比較多的一方擁有堅果優勢，才適合下大注。</li>
      </ol>
      <div class="callout warn">
        <b>常見錯誤</b>
        只看自己有沒有中牌：拿 <span class="hand">AK</span> 在 <span class="cards">7s6s5d</span> 沒中，就以為對手也沒中而亂下注——其實這是對手範圍最喜歡的牌面之一。
      </div>
    `
  },

  // ===========================================================================
  // 9. 權益實現與可玩性
  // ===========================================================================
  {
    id: 'equity-realization',
    part: '二、GTO 核心觀念',
    title: '權益實現與可玩性 (EQR & Playability)',
    icon: '📈',
    level: 2,
    minutes: 9,
    summary: '理解為什麼「原始勝率 40%」不等於「能拿走 40% 底池」：位置、同花、連張與籌碼深度如何決定你的權益實現率（EQR）。',
    keyPoints: [
      '權益實現率（Equity Realization, EQR）=（實際平均贏得的底池比例）÷（手牌翻前原始勝率 Raw Equity）。',
      '有位置（IP）、同花（Suited）、連張（Connected）、高牌且處於有範圍優勢的一方，EQR 常大於 100%（超額實現權益）。',
      '沒位置（OOP）、非同花不連張（如 K7o、Q6o）、容易被壓制的邊緣牌，EQR 常只有 50%–70%，因為翻牌沒中或面對多槍施壓時被迫提前棄牌。',
      '這解釋了為什麼 65s 對 BTN 開池範圍的原始勝率只有約 39%，低於 K7o 的約 44%，卻常常比 K7o 更好打、更值得防守！'
    ],
    html: `
      <h3>1. 原始勝率（Raw Equity）vs 權益實現率（EQR）</h3>
      <p>許多新手用勝率計算機發現：<span class="hand">K7o</span> 對上 BTN 約 45% 的開池範圍有約 44% 勝率，而 <span class="hand">65s</span> 只有約 39% 勝率，於是覺得 <span class="hand">K7o</span> 比較強。但那是在<strong>「翻牌前直接全下、免費看完 5 張公共牌」</strong>的前提下！</p>
      <p>在 100bb 深籌碼實戰中，翻牌、轉牌、河牌三條街都有下注。如果你在翻牌圈沒有擊中足夠強的牌或強聽牌，面對對手下注你必須棄牌，這時你<strong>剩餘的勝率就直接被清零（Equity Denial）</strong>！</p>
      <div class="formula">權益實現率（EQR）= 實際贏得底池佔比 ÷ 原始勝率（Raw Equity）　｜　實戰期望底池 = 底池 × 原始勝率 × EQR</div>

      <h3>2. 決定 EQR 高低的五大因子</h3>
      <table class="tbl">
        <thead>
          <tr><th>影響因子</th><th>高 EQR（&gt; 100%，超額實現）</th><th>低 EQR（明顯 &lt; 100%，折損）</th><th>背後原因</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>① 位置（Position）</strong></td><td><strong>有位置（IP）</strong>（平均 EQR ~110%+）</td><td><strong>沒位置（OOP）</strong>（平均 EQR ~75%–85%）</td><td>IP 可免費看牌、控制底池、在對手示弱時偷池</td></tr>
          <tr><td><strong>② 同花屬性（Suitedness）</strong></td><td><strong>同花牌（s）</strong>（如 <span class="hand">A5s</span>、<span class="hand">K9s</span>）</td><td><strong>非同花牌（o）</strong>（如 <span class="hand">A5o</span>、<span class="hand">K9o</span>）</td><td>同花聽牌讓你輕鬆跟注翻牌與轉牌，不會被迫提前棄牌</td></tr>
          <tr><td><strong>③ 連接性（Connectivity）</strong></td><td><strong>連張 / 隔一張</strong>（如 <span class="hand">98s</span>、<span class="hand">T8s</span>）</td><td><strong>大斷層牌</strong>（如 <span class="hand">K6o</span>、<span class="hand">Q4o</span>）</td><td>連張常同時擊中順子聽牌 + 對子，清楚知道自己何時領先</td></tr>
          <tr><td><strong>④ 堅果潛力（Nut Potential）</strong></td><td><strong>同花 A、口袋對子</strong></td><td><strong>易被壓制的次高牌</strong>（如 OOP 的 <span class="hand">KJo</span>）</td><td><span class="hand">KJo</span> 中頂對時，輸 <span class="hand">AK</span>/<span class="hand">KQ</span> 會輸大鍋，贏弱牌只贏小鍋（反向隱含賠率）</td></tr>
          <tr><td><strong>⑤ 籌碼深度（SPR）</strong></td><td>同花連張 / 小對子在<strong>高 SPR</strong></td><td>非同花單大牌在<strong>高 SPR OOP</strong></td><td>籌碼越深，翻牌後還有越多條街會把脆弱的一對打走</td></tr>
        </tbody>
      </table>

      <h3>3. 用 EQR 修正你的底池賠率</h3>
      <div class="formula">實際可實現勝率 = 原始勝率 × EQR　→　再拿去和必要勝率比較</div>
      <div class="callout tip">
        <b>修正你的底池賠率公式！</b><br>
        前面我們學過：大盲（BB）面對 UTG 2.5bb 開池，補 1.5bb 搶 4bb 底池，理論必要勝率是 <code>1.5 ÷ 5.5 = 27.3%</code>。但因為 BB 翻後<strong>沒位置（OOP）</strong>，一手非同花弱牌（如 <span class="hand">K5o</span>）的 EQR 只有約 <strong>65%</strong>，代表它對 UTG 範圍雖然有約 33% 原始勝率，實際只能實現 <code>33% × 0.65 ≈ 21.5%</code> &lt; 27.3%，所以必須棄牌！反觀 <span class="hand">64s</span> 雖然原始勝率也只有約 33%，但同花隔張牌的 EQR 可達約 <strong>85%</strong>（實現約 28% &gt; 27.3%），因此可以（邊緣地）獲利跟注！
      </div>

      <h3>4. 常見錯誤：只看勝率計算機就做決定</h3>
      <div class="compare">
        <div>
          <h4>✅ 正確思路</h4>
          <ul>
            <li>先問「這手牌翻後好不好打？」：有沒有位置、同花、連張、能不能做成堅果。</li>
            <li>OOP 防守時把非同花弱高牌（<span class="hand">K5o</span>、<span class="hand">Q4o</span>）的勝率打折，同花連張則打折較少。</li>
            <li>籌碼越深越重視可玩性；籌碼越淺（例如短碼全下）越接近只看原始勝率。</li>
          </ul>
        </div>
        <div>
          <h4>❌ 錯誤思路</h4>
          <ul>
            <li>「計算機說 <span class="hand">K7o</span> 有 44%，比 <span class="hand">65s</span> 高，所以 K7o 比較好跟。」——忽略了翻後還有三條街。</li>
            <li>在 SB 平跟一堆非同花牌，翻後永遠第一個行動，權益大量流失。</li>
            <li>以為 IP 就能玩任何牌：位置再好，垃圾牌的 EQR 也救不回來。</li>
          </ul>
        </div>
      </div>
    `
  },

  // ===========================================================================
  // 10. 開池加注（RFI）策略與尺度
  // ===========================================================================
  {
    id: 'preflop-rfi',
    part: '三、翻前策略',
    title: '開池加注（RFI）策略與尺度',
    icon: '🚀',
    level: 2,
    minutes: 11,
    summary: '完整掌握 6 人桌五個開池位置（UTG、HJ、CO、BTN、SB）的標準 RFI 範圍、為什麼絕對不要平跟入池（Open Limp），以及快速背誦全桌範圍的結構記憶法。',
    keyPoints: [
      'RFI（Raise First In）：當前面所有人棄牌到你時，永遠選擇「加注開池或棄牌」，絕不平跟入池（No Open Limp），才能保有拿下盲注的棄牌率（Fold Equity）。',
      '標準開池尺度：UTG / HJ / CO / BTN 統一開 2.5bb（線上高抽水環境 BTN 亦可開 2.2–2.5bb）；SB 因為翻後 OOP，加大為 3.0bb。',
      '五位置 RFI 寬度口訣：「UTG 17%、HJ 22%、CO 30%、BTN 45%、SB 43%」。',
      '記憶結構：先記「對子線、同花 A 線、同花 K/Q 線、同花連張線、非同花大牌線」五個錨點，就能在 10 分鐘內默寫出整張 6 人桌開池表！'
    ],
    html: `
      <h3>1. 為什麼 GTO 翻前幾乎從不「平跟入池（Open Limp）」？</h3>
      <p>許多休閒玩家喜歡在翻前直接丟 1bb 平跟（Limp）想「便宜看翻牌」，但這是德州撲克最嚴重的翻前漏洞之一：</p>
      <ul>
        <li><strong>0% 立即贏下盲注的機率</strong>：如果你加注開池，盲注棄牌你就能直接贏走 1.5bb；如果你 Limp，大盲（BB）有免費過牌看翻牌的權利，你永遠不可能在翻前直接收池。</li>
        <li><strong>給後面玩家絕佳賠率隔離加注（Isolation Raise）</strong>：你一 Limp，後位玩家會用寬範圍隔離加注到約 4bb–5bb（每多一位溜入者再加約 1bb），迫使你在沒位置（OOP）下棄牌或拿弱牌打大底池。</li>
        <li><strong>現金桌抽水（Rake）懲罰</strong>：多數現金桌遵循「No Flop, No Drop（不看翻牌不抽水）」。加注在翻前收下盲注完全免抽水；Limp 進翻牌圈的底池則會被抽水（常見約 5%，有上限）！</li>
      </ul>

      <h3>2. 6 人桌五個位置 RFI 開池邊界一覽表（背誦神表）</h3>
      <p>不用一格一格死背 169 張牌！只要記住每個位置在以下<strong>五條牌線的最低門檻</strong>，就能瞬間還原整張表：</p>
      <table class="tbl">
        <thead>
          <tr><th>位置</th><th>開池尺度</th><th>總比例</th><th>① 口袋對子</th><th>② 同花 A / K / Q / J / T</th><th>③ 同花連張</th><th>④ 非同花 A</th><th>⑤ 非同花高牌</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>UTG</strong></td><td>2.5bb</td><td><strong>~17%</strong></td><td><span class="hand">55+</span>（22–44 混合）</td><td><span class="hand">A3s+</span>（A2s 混合）、<span class="hand">K9s+</span>、<span class="hand">QTs+</span>（Q9s 混合）</td><td><span class="hand">87s+</span>、<span class="hand">JTs</span>（76s、J9s 混合）</td><td><span class="hand">ATo+</span></td><td><span class="hand">KQo</span>（KJo 混合）</td></tr>
          <tr><td><strong>HJ</strong></td><td>2.5bb</td><td><strong>~22%</strong></td><td><span class="hand">22+</span>（全開！）</td><td><span class="hand">A2s+</span>、<span class="hand">K8s+</span>、<span class="hand">Q9s+</span>、<span class="hand">J9s+</span></td><td><span class="hand">65s+</span>、<span class="hand">T8s</span>（54s、97s 混合）</td><td><span class="hand">ATo+</span>（A9o 混合）</td><td><span class="hand">KJo+</span>、<span class="hand">QJo</span>（KTo 混合）</td></tr>
          <tr><td><strong>CO</strong></td><td>2.5bb</td><td><strong>~30%</strong></td><td><span class="hand">22+</span></td><td><span class="hand">A2s+</span>、<span class="hand">K5s+</span>、<span class="hand">Q7s+</span>、<span class="hand">J8s+</span></td><td><span class="hand">54s+</span>、隔張 <span class="hand">75s+</span>、<span class="hand">T8s</span>、<span class="hand">97s</span></td><td><span class="hand">A8o+</span>（A7o、A5o 混合）</td><td><span class="hand">KTo+</span>、<span class="hand">QTo+</span>、<span class="hand">JTo</span>（K9o 混合）</td></tr>
          <tr><td><strong>BTN</strong></td><td>2.5bb</td><td><strong>~45%</strong></td><td><span class="hand">22+</span></td><td><span class="hand">A2s+</span>、<span class="hand">K2s+</span>、<span class="hand">Q2s+</span>、<span class="hand">J5s+</span>、<span class="hand">T6s+</span></td><td><span class="hand">54s</span>、<span class="hand">53s</span>、隔張 <span class="hand">64s+</span>（43s 混合）</td><td><span class="hand">A2o+</span>（全開！）</td><td><span class="hand">K8o+</span>、<span class="hand">Q9o+</span>、<span class="hand">J9o+</span>、<span class="hand">T9o</span>（T8o、98o、87o 混合）</td></tr>
          <tr><td><strong>SB</strong></td><td>3.0bb</td><td><strong>~43%</strong></td><td><span class="hand">22+</span></td><td><span class="hand">A2s+</span>、<span class="hand">K2s+</span>、<span class="hand">Q4s+</span>、<span class="hand">J6s+</span>、<span class="hand">T6s+</span>（Q3s、Q2s 混合）</td><td><span class="hand">54s+</span>、隔張 <span class="hand">75s+</span>（64s、53s、43s 混合）</td><td><span class="hand">A2o+</span></td><td><span class="hand">K8o+</span>、<span class="hand">Q9o+</span>、<span class="hand">J9o+</span>（T9o、98o、87o 混合）</td></tr>
        </tbody>
      </table>

      <h3>3. 五個位置 RFI 範圍圖完整對照</h3>
      <div class="embed-chart" data-scenario="rfi_utg"></div>
      <div class="embed-chart" data-scenario="rfi_hj"></div>
      <div class="embed-chart" data-scenario="rfi_co"></div>
      <div class="embed-chart" data-scenario="rfi_btn"></div>
      <div class="embed-chart" data-scenario="rfi_sb"></div>

      <h3>4. 為什麼是 2.5bb？SB 為什麼開 3bb？</h3>
      <table class="tbl">
        <thead>
          <tr><th>開池位置</th><th>尺度</th><th>偷盲要成功的棄牌率（Alpha）</th><th>理由</th></tr>
        </thead>
        <tbody>
          <tr><td>UTG / HJ / CO / BTN</td><td>2.5bb</td><td>2.5 ÷（1.5 + 2.5）= <strong>62.5%</strong></td><td>夠大能拿下盲注、夠小讓詐唬便宜；翻後多半有位置或面對寬範圍</td></tr>
          <tr><td>SB</td><td>3bb</td><td>2.5 ÷（1.5 + 2.5）= <strong>62.5%</strong>（SB 已投入 0.5bb，實際多冒 2.5bb）</td><td>翻後永遠 OOP，開大一點讓 BB 的跟注賠率變差、少讓 BB 便宜看翻牌</td></tr>
        </tbody>
      </table>
      <div class="callout plain">
        <b>白話解釋</b>
        開池就像「先出價」：出價太低（溜入 1bb），大家都想跟；出價太高（開 5bb），只有好牌才敢跟、你的詐唬也變貴。2.5bb 是現代線上與 Solver 最常用的平衡點。
      </div>

      <h3>5. 常見錯誤</h3>
      <div class="callout warn">
        <b>常見錯誤</b><br>
        • <strong>位置不分、範圍固定</strong>：在 UTG 開 <span class="hand">KTo</span>、<span class="hand">A9o</span>、<span class="hand">QJo</span> 這類太弱的非同花牌，或在 BTN 只開大牌。<br>
        • <strong>拿強牌溜入想「設陷阱」</strong>：AA 溜入會讓 BB 免費看翻牌，翻後籌碼深、對手範圍寬，反而更難贏大底池。<br>
        • <strong>開池尺度洩露牌力</strong>：好牌開 4bb、弱牌開 2bb，懂的對手一眼看穿。同一個位置請用同一個尺度。
      </div>
    `
  },

  // ===========================================================================
  // 11. 面對開池：3-Bet 還是跟注
  // ===========================================================================
  {
    id: 'preflop-vs-open',
    part: '三、翻前策略',
    title: '面對開池：3-Bet 還是跟注 (Cold Call)',
    icon: '⚔️',
    level: 2,
    minutes: 11,
    summary: '當前面有玩家開池加注時，我們該如何根據自己的位置（HJ/CO、BTN、SB、BB）與開池者的位置，選擇 3-Bet、平跟（Cold Call）或棄牌。',
    keyPoints: [
      '非大盲位置（HJ、CO、SB）面對開池時，應以「3-Bet 為主、極少平跟（本站 SB 採 3-Bet or Fold、0% 平跟）」，避免被後面玩家擠壓（Squeeze）以及被現金桌抽水侵蝕。',
      '按鈕位（BTN）因為保證翻後有位置且只剩盲注在後，可以保留約 6% 的中對子、同花百老匯與同花連張平跟範圍。',
      '大盲位（BB）因為已投入 1bb 且是翻前最後行動者（保證關門），擁有絕佳底池賠率，平跟範圍最寬（對 UTG 約 17% 平跟，對 BTN、SB 約 40% 平跟）。',
      '3-Bet 標準尺度：有位置（IP）約為開池的 3 倍（2.5bb → 7.5bb）；沒位置（SB/BB OOP）約為開池的 4 倍（2.5bb → 10–11bb；BB 對 SB 3bb 開池為 IP 則 3-Bet 到 9bb）。'
    ],
    html: `
      <h3>1. 四種防守位置的策略定位比較</h3>
      <p>當前面有人開池 2.5bb 時，你在不同位置面對的處境完全不同：</p>
      <table class="tbl">
        <thead>
          <tr><th>你的位置</th><th>翻後位置</th><th>後面還有誰未行動</th><th>核心策略方針</th><th>3-Bet 尺度</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>HJ / CO</strong></td><td>對開池者 IP</td><td>HJ 後面還有 CO、BTN、SB、BB 4 人；CO 後面還有 3 人，都可能 Squeeze</td><td><strong>以 3-Bet 為主（約 4.5%–7%）</strong>，僅極少量中對子/強同花平跟（約 2.5%–3%）</td><td><strong>3x（7.5bb）</strong></td></tr>
          <tr><td><strong>BTN</strong></td><td>絕對 IP</td><td>只剩 SB、BB 2 人</td><td><strong>3-Bet（約 4.5%–10%）與平跟（約 6%）並重</strong>，充分發揮莊位優勢</td><td><strong>3x（7.5bb）</strong></td></tr>
          <tr><td><strong>SB</strong></td><td>永遠 OOP</td><td>還有 BB 1 人享極佳賠率</td><td><strong>100%「3-Bet or Fold」（0% 平跟！）</strong>，對 UTG 約 5% → 對 BTN 約 14.5%</td><td><strong>4x（10–10.5bb）</strong></td></tr>
          <tr><td><strong>BB</strong></td><td>OOP（對 SB 為 IP）</td><td>0 人（直接關門看翻牌！）</td><td><strong>大量平跟防守（約 17%–40%）+ 極化 3-Bet（約 4%–14%）</strong></td><td><strong>4.4x（11bb）</strong><br>（對 SB 3bb 為 9bb）</td></tr>
        </tbody>
      </table>

      <h3>2. 為什麼非大盲位置（特別是 SB）不該亂平跟（Cold Call）？</h3>
      <div class="callout warn">
        <b>平跟（Cold Call）的三大隱藏成本</b><br>
        1. <strong>被擠壓（Squeeze）風險</strong>：當你在 CO 平跟 2.5bb，後面的 BTN、SB、BB 看到底池有死錢且你的範圍封頂（你沒拿 AA/KK），會高頻率 3-Bet 擠壓到 11bb–12bb，讓你白白浪費 2.5bb。<br>
        2. <strong>失去主動權與棄牌率</strong>：3-Bet 有兩種贏法（對手直接棄牌 + 攤牌比贏）；平跟只有一種贏法（必須在翻後做成比對手更好的牌或成功詐唬）。<br>
        3. <strong>翻前免抽水紅利</strong>：在多數現金桌，3-Bet 若直接迫使開池者翻前棄牌，整鍋底池完全不抽水！
      </div>

      <h3>3. 經典防守範圍對照：BTN vs CO、SB vs BTN、BB vs BTN</h3>
      <div class="embed-chart" data-scenario="vsrfi_btn_co"></div>
      <div class="embed-chart" data-scenario="vsrfi_sb_btn"></div>
      <div class="embed-chart" data-scenario="vsrfi_bb_btn"></div>

      <h3>4. BB 為什麼可以防守這麼寬？用底池賠率算給你看</h3>
      <table class="tbl">
        <thead>
          <tr><th>情境</th><th>BB 要補</th><th>跟注後底池</th><th>必要勝率</th><th>防守寬度</th></tr>
        </thead>
        <tbody>
          <tr><td>UTG 開 2.5bb（其他人棄牌）</td><td>1.5bb</td><td>2.5 + 2.5 + 0.5 = 5.5bb</td><td>1.5 ÷ 5.5 ≈ <strong>27.3%</strong></td><td>最緊（對手範圍最強）</td></tr>
          <tr><td>BTN 開 2.5bb</td><td>1.5bb</td><td>5.5bb</td><td><strong>27.3%</strong></td><td>很寬（對手範圍約 45%，較弱）</td></tr>
          <tr><td>SB 開 3bb</td><td>2bb</td><td>3 + 3 = 6bb</td><td>2 ÷ 6 ≈ <strong>33.3%</strong></td><td>很寬（BB 翻後還有位置）</td></tr>
        </tbody>
      </table>
      <div class="callout key">
        <b>重點</b>
        必要勝率一樣是 27.3%，但面對 UTG 的強範圍，你的牌平均勝率低很多，所以防守比面對 BTN 緊得多。別忘了還要用權益實現率（EQR）打折：BB 翻後沒位置。
      </div>

      <h3>5. 牌例：BTN 對 CO 開池 3-Bet</h3>
      <div class="hh">
        <div class="hh-title">牌例：BTN 拿 AQo 對 CO 開池</div>
        <div class="hh-row"><span class="hh-street">翻前</span>CO 開 2.5bb，你在 BTN 拿 <span class="cards">AhQd</span>。<span class="hand">AQo</span> 在 BTN vs CO 屬於 3-Bet 價值牌，你 3-Bet 到 7.5bb（3 倍），SB、BB 棄牌，CO 跟注。</div>
        <div class="hh-row"><span class="hh-street">翻牌</span>底池 7.5 + 7.5 + 1.5 = <strong>16.5bb</strong>，雙方剩 92.5bb（SPR ≈ 5.6）。你有位置又是翻前加注者，範圍優勢在你。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>如果你只平跟，SB、BB 還可能擠壓（Squeeze），你也失去「CO 直接棄牌」這種贏法。3-Bet 讓你用主動權與位置把 <span class="hand">AQo</span> 的價值最大化。</div>
      </div>
    `
  },

  // ===========================================================================
  // 12. 3-Bet 範圍建構：線性 vs 極化
  // ===========================================================================
  {
    id: 'preflop-3bet',
    part: '三、翻前策略',
    title: '3-Bet 範圍建構：線性 vs 極化與擠壓 (Squeeze)',
    icon: '🔥',
    level: 3,
    minutes: 10,
    summary: '深入解析何時該用「線性（Linear）3-Bet」、何時該用「極化（Polarized）3-Bet」，為什麼 A5s–A2s 是最受歡迎的 3-Bet 詐唬牌，以及多人底池擠壓（Squeeze）尺度。',
    keyPoints: [
      '線性 3-Bet（Linear / Merged）：當你不設平跟範圍（如 SB），或對手跟注 3-Bet 很寬時，直接拿前 X% 最強手牌（QQ+、AK、AQ、AJ、KQs、KJs、QJs、中對子）全部 3-Bet。',
      '極化 3-Bet（Polarized）：當你有寬廣的平跟範圍（如 BB 防守，或 BTN 對早位開池）時，把中等強牌留著平跟，用「最頂端強牌 + 平跟邊緣的同花連張/A5s 阻擋牌」做 3-Bet。',
      '為什麼 A5s–A2s 是 3-Bet 神牌？① A 阻擋對手 AA/AK；② 被跟注後有堅果同花潛力；③ 有 A-2-3-4-5 輪子順潛力，翻後極難被看穿。',
      '擠壓加注（Squeeze）：當前位開池且有人平跟時，3-Bet 尺度需每多一位跟注者再加 1x 開池額（例如 IP 4x = 10bb、OOP 5x = 12.5bb）。'
    ],
    html: `
      <h3>1. 線性（Linear）3-Bet vs 極化（Polarized）3-Bet 完整比較</h3>
      <table class="tbl">
        <thead>
          <tr><th>比較維度</th><th>線性 / 合併 3-Bet（Linear / Merged）</th><th>極化 3-Bet（Polarized）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>手牌組成結構</strong></td><td>從 <span class="hand">AA</span> 一路往下取前 8%–16% 的所有好牌（含 <span class="hand">AJs</span>、<span class="hand">ATs</span>、<span class="hand">KQs</span>、<span class="hand">KJs</span>、<span class="hand">QJs</span>、<span class="hand">TT</span>–<span class="hand">88</span>）</td><td><strong>頂端價值牌</strong>（<span class="hand">QQ+</span>、<span class="hand">AK</span>）+ <strong>詐唬/半詐唬牌</strong>（<span class="hand">A5s</span>–<span class="hand">A2s</span>、<span class="hand">87s</span>、<span class="hand">76s</span>、<span class="hand">K9s</span>）；中強牌留著平跟</td></tr>
          <tr><td><strong>是否有平跟範圍</strong></td><td><strong>沒有（或極少）平跟範圍</strong></td><td><strong>有健康的平跟範圍</strong>（如 BB 或 BTN）</td></tr>
          <tr><td><strong>最佳使用時機</strong></td><td>① <strong>SB 面對任何位置開池</strong>；② CO/HJ 面對前位；③ 對手喜歡用弱牌跟注 3-Bet 時</td><td>① <strong>BB 面對開池</strong>（平跟賠率太好，中強牌平跟就賺）；② BTN 面對 UTG/HJ 緊開池時</td></tr>
          <tr><td><strong>面對 4-Bet 時的表現</strong></td><td>部分中強牌（如 <span class="hand">TT</span>、<span class="hand">AJs</span>、<span class="hand">KQs</span>）可跟注 4-Bet，最底端棄牌</td><td>分工極清楚：頂端價值牌 5-Bet 全下或跟注，底端詐唬牌毫無懸念直接棄牌！</td></tr>
        </tbody>
      </table>

      <h3>2. 為什麼 <span class="hand">A5s</span>–<span class="hand">A2s</span> 比 <span class="hand">A8s</span>–<span class="hand">A6s</span> 更常被拿來 3-Bet 與 4-Bet？</h3>
      <p>仔細觀察前位的 3-Bet 表（如 HJ vs UTG、CO vs UTG），你會發現一個超有趣的現象：<span class="hand">A5s</span>、<span class="hand">A4s</span> 經常高頻 3-Bet，反而是點數更大的 <span class="hand">A8s</span>、<span class="hand">A7s</span>、<span class="hand">A6s</span> 卻棄牌！這背後有三個嚴謹的數學理由：</p>
      <ol>
        <li><strong>相同的 A 阻擋牌效應（Card Removal）</strong>：只要手上有 1 張 A，對手拿到 <span class="hand">AA</span> 的組合就從 6 組減半成 3 組，拿到 <span class="hand">AK</span> 從 16 組降為 12 組。</li>
        <li><strong>額外的順子連接性（Wheel Straight）</strong>：<span class="hand">A5s</span>–<span class="hand">A2s</span> 可以組成 <strong>A-2-3-4-5 輪子順</strong>！而 <span class="hand">A6s</span>–<span class="hand">A9s</span> 兩張牌之間差超過 4 點，永遠無法同時參與同一條順子。</li>
        <li><strong>反向隱含賠率更低</strong>：當翻牌開出 A 時，拿 <span class="hand">A8s</span> 很容易因為踢腳不夠大卻捨不得棄牌而輸光給 <span class="hand">AK</span>/<span class="hand">AQ</span>；拿 <span class="hand">A5s</span> 則定位明確（要嘛小底池控制，要嘛抽堅果同花與順子）。</li>
      </ol>

      <h3>3. 實戰對比：CO 線性偏混合 3-Bet vs BB 極化 3-Bet</h3>
      <div class="embed-chart" data-scenario="vsrfi_co_hj"></div>
      <div class="embed-chart" data-scenario="vsrfi_bb_co"></div>

      <h3>4. 擠壓加注（Squeeze Play）尺度公式</h3>
      <div class="formula">Squeeze 尺度 = 標準 3-Bet 尺度 +（每位平跟者 × 1 倍開池額）</div>
      <p>例如：HJ 開池 <strong>2.5bb</strong>，CO 平跟 <strong>2.5bb</strong>。此時：</p>
      <ul>
        <li>若你在 <strong>BTN（有位置 IP）</strong>想 Squeeze：7.5bb + 2.5bb = <strong>10.0bb</strong>。</li>
        <li>若你在 <strong>SB / BB（沒位置 OOP）</strong>想 Squeeze：10bb + 2.5bb = <strong>12.5bb</strong>。</li>
      </ul>
    `
  }
]);

/* GTO 撲克學院 — theory_part2.js
 * 第 13–24 課：翻前策略篇（下：面對 3-Bet、4-Bet/5-Bet）、翻後策略篇、實戰與進階篇。
 */
window.GTO = window.GTO || {};
GTO.THEORY = (GTO.THEORY || []).concat([
  // ===========================================================================
  // 13. 面對 3-Bet：4-Bet、跟注或棄牌
  // ===========================================================================
  {
    id: 'preflop-vs-3bet',
    part: '三、翻前策略',
    title: '面對 3-Bet：4-Bet、跟注或棄牌',
    icon: '🛡️',
    level: 2,
    minutes: 12,
    summary: '當你開池加注後遭到對手 3-Bet 再加注時，如何依「翻後有沒有位置（IP vs OOP）」與對手 3-Bet 寬度，決定 4-Bet、平跟或棄牌。',
    keyPoints: [
      '面對標準 3-Bet，開池者整體大約繼續（4-Bet + 跟注）「原本開池範圍的 40%–55%」（被後位 3-Bet、自己沒位置時偏少；被盲注 3-Bet、自己有位置時偏多），其餘最弱的開池牌棄掉。',
      '黃金分水嶺：面對後位 3-Bet（你翻後沒位置 OOP）時，採取「高頻率 4-Bet、少平跟」；面對盲注 3-Bet（你翻後有位置 IP）時，採取「少 4-Bet、大量平跟」！',
      'OOP 面對 3-Bet 時，容易被壓制的非同花大牌（如 AJo、ATo、KQo、KJo）大多棄牌或只少量混合，應優先保留同花百老匯（AQs、AJs、KQs、QJs、JTs）與中對子（77–JJ）。',
      '挖暗三條（Set Mining）的 15–20 倍法則：跟注 3-Bet 看翻牌抽 Set，有效籌碼至少需要跟注額的 15–20 倍（且有位置時更佳）。'
    ],
    html: `
      <h3>1. 開池後被 3-Bet 的核心決策框架：你有沒有位置（IP vs OOP）？</h3>
      <p>許多玩家背翻前範圍時，最常卡關的就是<strong>「我開池 2.5bb 被對手 3-Bet，到底該拿哪些牌繼續？」</strong>其實只要先問自己一個問題：<strong>「翻牌後我有沒有位置？」</strong></p>
      <table class="tbl">
        <thead>
          <tr><th>情境分類</th><th>代表對局</th><th>3-Bet 尺度</th><th>你的翻後位置</th><th>GTO 核心應對原則</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>A. 被後位玩家 3-Bet</strong></td>
            <td>UTG vs HJ/CO/BTN<br>HJ vs CO/BTN<br>CO vs BTN</td>
            <td>7.5bb（3x）</td>
            <td><strong>沒位置（OOP）</strong><br>（翻後你先行動）</td>
            <td><strong>多 4-Bet 或棄牌、少平跟！</strong><br>因為 OOP 在 3-Bet 大底池很難實現權益，中強牌（如 CO 的 <span class="hand">JJ</span>、<span class="hand">AQs</span>）直接轉為 4-Bet！</td>
          </tr>
          <tr>
            <td><strong>B. 被盲注玩家 3-Bet</strong></td>
            <td>UTG/HJ/CO/BTN<br>面對 SB 或 BB 3-Bet</td>
            <td>10–11bb（4x）</td>
            <td><strong>有位置（IP）</strong><br>（翻後你最後行動）</td>
            <td><strong>少 4-Bet、大量平跟！</strong><br>因為你有絕對位置優勢，連 <span class="hand">QQ</span>、<span class="hand">AKo</span> 都可以混入平跟，並用大量同花牌與中對子平跟拆解對手！</td>
          </tr>
          <tr>
            <td><strong>C. 小盲被大盲 3-Bet</strong></td>
            <td>SB 開 3bb vs BB 3B 9bb</td>
            <td>9.0bb（3x）</td>
            <td><strong>沒位置（OOP）</strong></td>
            <td><strong>高頻 4-Bet（約 17%）+ 寬同花平跟（約 28%）</strong>：因雙方範圍都很寬（SB 開 43% vs BB 3-Bet 約 14%），<span class="hand">TT+</span>、<span class="hand">AQs+</span>、<span class="hand">AQo+</span> 直接 4-Bet！</td>
          </tr>
        </tbody>
      </table>

      <h3>2. 哪些牌該跟注 3-Bet？哪些牌該 4-Bet？哪些必須棄牌？</h3>
      <ul>
        <li><strong>4-Bet 價值核心（Value 4-Bet）</strong>：對早位 3-Bet 以 <span class="hand">KK+</span>、<span class="hand">AKs</span>、<span class="hand">AKo</span>（混合 <span class="hand">QQ</span>）為主；在後位對抗寬 3-Bet（如 CO vs BTN、BTN vs SB、SB vs BB）則放寬至 <strong><span class="hand">JJ+</span>（甚至 <span class="hand">TT+</span>）、<span class="hand">AQs+</span>、<span class="hand">AQo+</span></strong>。</li>
        <li><strong>4-Bet 詐唬首選（Bluff 4-Bet）</strong>：<strong><span class="hand">A5s</span>、<span class="hand">A4s</span>、<span class="hand">A3s</span></strong>（阻擋 AA/AK，被跟注還有同花與順子），以及部分處於平跟邊緣的高牌阻擋牌（如 <span class="hand">KJs</span>、<span class="hand">KTs</span>、<span class="hand">AJo</span>、<span class="hand">KQo</span>）。</li>
        <li><strong>平跟 3-Bet 主力（Call 3-Bet）</strong>：中對子（<span class="hand">77</span>–<span class="hand">JJ</span>，在 IP 時可到 <span class="hand">44+</span>）、同花百老匯（<span class="hand">AQs</span>、<span class="hand">AJs</span>、<span class="hand">ATs</span>、<span class="hand">KQs</span>、<span class="hand">KJs</span>、<span class="hand">QJs</span>、<span class="hand">JTs</span>）與同花連張（<span class="hand">T9s</span>、<span class="hand">98s</span>、<span class="hand">87s</span>）。</li>
        <li><strong>標準棄牌（Fold to 3-Bet）</strong>：開池範圍中最弱的約一半——特別是 OOP 時的<strong>非同花邊緣牌（<span class="hand">ATo</span>、<span class="hand">KJo</span>、<span class="hand">QJo</span>、<span class="hand">KTo</span>）</strong>與<strong>小對子（<span class="hand">22</span>–<span class="hand">55</span>）</strong>。</li>
      </ul>

      <h3>3. 四大經典「被 3-Bet」範圍圖完整對比</h3>
      <div class="embed-chart" data-scenario="vs3bet_utg_btn"></div>
      <div class="embed-chart" data-scenario="vs3bet_co_btn"></div>
      <div class="embed-chart" data-scenario="vs3bet_btn_sb"></div>
      <div class="embed-chart" data-scenario="vs3bet_btn_bb"></div>

      <h3>4. 挖暗三條（Set Mining）的數學：15–20 倍法則從哪來？</h3>
      <p>口袋對子在翻牌擊中暗三條（或更好）的機率約 <strong>11.8%</strong>（1 − C(48,3) ÷ C(50,3)），大約每 8.5 次才中 1 次。沒中多半只能放棄，所以中了的那次必須贏回前面 7 次多的跟注成本。</p>
      <div class="formula">需要的籌碼倍數 ≈（1 − 11.8%）÷ 11.8% ≈ 7.5 倍跟注額（只算打平）→ 實戰再保守估計為 15–20 倍</div>
      <div class="callout example">
        <b>例題：BTN 開 2.5bb，SB 3-Bet 到 10.5bb，你拿 <span class="hand">55</span> 想跟注挖 Set</b><br>
        • 你要補 10.5 − 2.5 = <strong>8bb</strong>，跟注後雙方剩 <strong>89.5bb</strong>。<br>
        • 89.5 ÷ 8 ≈ <strong>11 倍</strong>，低於 15–20 倍；而且中 Set 時對手也不一定會付光籌碼（他可能拿 AK 沒中就收手）。<br>
        • 結論：100bb 下「只靠中 Set」並不夠賺。本站 <a href="#/ranges/vs3bet_btn_sb">BTN vs SB 3-Bet 範圍表</a>仍會跟注 <span class="hand">55</span>，是因為 BTN 有位置，沒中 Set 時也能靠過牌看牌、對手放棄時拿下底池來額外實現權益；換成 OOP 時，小對子就應該更常棄牌。
      </div>
      <div class="callout warn">
        <b>常見錯誤</b>
        • 被 3-Bet 後「捨不得」棄掉已投入的 2.5bb，拿 <span class="hand">KJo</span>、<span class="hand">ATo</span> 在沒位置時硬跟。<br>
        • 4-Bet 只用 <span class="hand">AA</span>、<span class="hand">KK</span>，對手一看就知道你多強；適度加入 <span class="hand">A5s</span>、<span class="hand">A4s</span> 這類阻擋牌詐唬才平衡。<br>
        • 忘記看 3-Bet 是誰打的：不同位置的 3-Bet 寬度差很多（例如 SB 對 BTN 約 14.5%、BTN 對 UTG 約 4.5%），防守寬度要跟著調整。
      </div>
    `
  },

  // ===========================================================================
  // 14. 4-Bet 與 5-Bet 全下
  // ===========================================================================
  {
    id: 'preflop-4bet',
    part: '三、翻前策略',
    title: '4-Bet 與 5-Bet 全下 (All-in)',
    icon: '💥',
    level: 3,
    minutes: 10,
    summary: '掌握 100bb 下 4-Bet 的尺度（IP 約 2.2 倍、OOP 約 2.7–2.8 倍，總額都落在 21–24bb）、價值與詐唬配比，以及面對 4-Bet 時何時該 5-Bet 全下、何時該平跟。',
    keyPoints: [
      '4-Bet 標準尺度：你有位置（IP，例如面對盲注 10–11bb 3-Bet）時約 2.1–2.2 倍（22–23bb）；你沒位置（OOP，例如面對後位 7.5bb 3-Bet）時約 2.7–2.8 倍（20–21bb）。',
      '為什麼 4-Bet 不直接全下 100bb？因為下到 21–23bb 就能給對手的 3-Bet 詐唬牌極大壓力，同時保留自己 4-Bet 詐唬牌在對手 5-Bet 全下時棄牌省下 78bb 的空間！',
      '在 100bb 有效籌碼下，一旦有人 4-Bet 到 21–24bb，下一步的 5-Bet 就直接是 100bb 全下（All-in）。',
      '面對 4-Bet 時，若你沒位置（如 SB/BB vs BTN 4-Bet）應以「5-Bet 全下或棄牌」為主；若你有位置（如 BTN vs CO 4-Bet）則可用 JJ、TT、AQs、AJs、KQs 平跟 4-Bet！'
    ],
    html: `
      <h3>1. 100bb 下的 4-Bet 尺度與數學結構</h3>
      <p>當底池進入 4-Bet 階段，籌碼投入量從原本的 7.5–11bb 跳升至 <strong>21–24bb（約佔總籌碼的近 1/4）</strong>：</p>
      <table class="tbl">
        <thead>
          <tr><th>對戰位置關係</th><th>對手 3-Bet 尺度</th><th>你的 4-Bet 標準尺度</th><th>若被平跟後的翻牌底池</th><th>剩餘有效籌碼</th><th>翻牌圈 SPR</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>你沒位置（OOP）面對後位 3B</strong><br>（如 CO 開 2.5bb → BTN 3B 7.5bb）</td><td>7.5bb</td><td><strong>21bb</strong>（約 2.8x）</td><td>約 43.5bb</td><td>79bb</td><td><strong>約 1.8</strong></td></tr>
          <tr><td><strong>你有位置（IP）面對盲注 3B</strong><br>（如 BTN 開 2.5bb → SB 3B 10.5bb）</td><td>10.5bb</td><td><strong>23bb</strong>（約 2.2x）</td><td>約 47.0bb</td><td>77bb</td><td><strong>約 1.6</strong></td></tr>
          <tr><td><strong>盲注大戰（SB OOP vs BB 3B）</strong><br>（SB 開 3bb → BB 3B 9bb）</td><td>9.0bb</td><td><strong>22bb</strong>（約 2.4x）</td><td>約 44.0bb</td><td>78bb</td><td><strong>約 1.8</strong></td></tr>
        </tbody>
      </table>

      <h3>2. 面對 5-Bet 全下時，<span class="hand">QQ</span> 與 <span class="hand">AK</span> 的底池賠率計算</h3>
      <div class="callout example">
        <b>實戰算給你看：當你已經 4-Bet 到 22bb，對手 5-Bet 全下 100bb！</b><br>
        • 你還需要補：<code>100 − 22 = 78bb</code><br>
        • 跟注後總底池：<code>100 + 100 + 1.5（盲注）= 201.5bb</code><br>
        • <strong>你的跟注必要勝率 = 78 ÷ 201.5 ≈ 38.7%！</strong><br>
        這代表只要你的手牌對上對手的 5-Bet 全下範圍有 <strong>39% 以上勝率</strong>，跟注全下就比棄牌更划算！<br>
        • 就算對手的 5-Bet 範圍緊到只有 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">QQ</span>、<span class="hand">AK</span>，你手上的 <strong><span class="hand">AKs</span> 也有約 41% 勝率、<span class="hand">QQ</span> 也有約 40.2% 勝率</strong>——所以在標準 100bb 後位攻防中，一旦用 <span class="hand">QQ</span> 或 <span class="hand">AK</span> 做出 4-Bet，面對全下就是<strong>標準跟注（Commit）</strong>！
      </div>

      <h3>3. 面對 4-Bet 的經典範圍圖（HJ vs UTG、BTN vs CO、BB vs BTN）</h3>
      <div class="embed-chart" data-scenario="vs4bet_hj_utg"></div>
      <div class="embed-chart" data-scenario="vs4bet_btn_co"></div>
      <div class="embed-chart" data-scenario="vs4bet_bb_btn"></div>

      <h3>4. 4-Bet 詐唬要多少成功率才划算？</h3>
      <div class="callout example">
        <b>例題：CO 開 2.5bb，BTN 3-Bet 到 7.5bb，你在 CO 拿 <span class="hand">A5s</span> 4-Bet 到 21bb 詐唬</b><br>
        • 目前底池 = 盲注 1.5 + 你的開池 2.5 + BTN 的 7.5 = <strong>11.5bb</strong><br>
        • 你額外冒險 = 21 − 2.5 = <strong>18.5bb</strong><br>
        • 純詐唬需要的棄牌率（Alpha）= 18.5 ÷（11.5 + 18.5）≈ <strong>61.7%</strong><br>
        • 實際上 BTN 的 3-Bet 範圍有不少詐唬與邊緣牌，面對 4-Bet 常棄掉一半以上；加上 <span class="hand">A5s</span> 被跟注後還有約 30% 勝率、又阻擋對手的 <span class="hand">AA</span>/<span class="hand">AK</span>，所以它是標準的 4-Bet 詐唬牌。
      </div>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>4-Bet 直接全下 100bb</strong>：用 <span class="hand">A5s</span> 詐唬時，對手只會用 <span class="hand">QQ+</span>/<span class="hand">AK</span> 跟注，你的詐唬冒險太大；用 <span class="hand">AA</span> 全下時，對手的詐唬牌全部棄掉，你只贏到小底池。<br>
        • <strong>4-Bet 範圍只有 AA、KK</strong>：太容易被讀，對手面對你的 4-Bet 可以放心棄掉所有邊緣牌。<br>
        • <strong>4-Bet 詐唬後面對 5-Bet 全下還硬跟</strong>：<span class="hand">A5s</span> 對 <span class="hand">QQ+</span>/<span class="hand">AK</span> 只有約 30% 勝率，低於約 39% 的必要勝率，應該棄牌。
      </div>
    `
  },

  // ===========================================================================
  // 15. 牌面結構分析
  // ===========================================================================
  {
    id: 'board-texture',
    part: '四、翻後策略',
    title: '牌面結構分析 (Board Texture)',
    icon: '🧩',
    level: 2,
    minutes: 10,
    summary: '翻牌發出的那一秒，如何從「高牌點數、同花色數、順子連接度、成對與否」四個維度瞬間讀懂牌面結構，判斷這個牌面對誰有利。',
    keyPoints: [
      '翻牌結構四維度：① 點數高低（A/K 高 vs 中低張）；② 花色結構（彩虹 Rainbow vs 雙色 Two-Tone vs 單色 Monotone）；③ 連接度（乾燥斷層 Dry vs 潮濕連接 Wet）；④ 是否成對（Paired）。',
      '高牌乾燥面（如 A♠7♦2♣、K♣8♦3♠）對「翻前加注者（PFR）」極度有利，因為加注者壟斷所有 AA/KK/AK/KQ 強頂對與超對。',
      '中低連接雙色面（如 8♠7♠5♦、9♥7♥6♣）對「翻前跟注者（尤其是 BB）」有利，因為跟注範圍集中了大量中低同花連張與口袋對子。',
      '靜態牌面（Static，轉牌很難改變堅果歸屬，如 K♠7♦2♣）適合小注高頻率；動態牌面（Dynamic，轉牌隨時讓聽牌超車，如 J♠T♠8♦）需要大注保護並極化範圍。'
    ],
    html: `
      <h3>1. 翻牌結構的五大經典類型與策略對照</h3>
      <p>在翻牌圈行動前，永遠先分析牌面結構（Board Texture），而不是只看自己有沒有中對子：</p>
      <table class="tbl">
        <thead>
          <tr><th>牌面類型</th><th>代表牌例</th><th>花色 / 連接特性</th><th>對誰有利（PFR vs Caller）</th><th>PFR 典型 C-Bet 策略</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>① A/K 高乾燥彩虹面</strong><br>（High Dry Rainbow）</td>
            <td><span class="cards">As7d2c</span><br><span class="cards">Kh8c3d</span></td>
            <td>三種不同花色、無順子聽牌、靜態（Static）</td>
            <td><strong>翻前加注者（PFR）大優</strong></td>
            <td><strong>高頻率（85%–100%）+ 小尺度（25%–33% Pot）</strong>範圍下注</td>
          </tr>
          <tr>
            <td><strong>② 多高牌百老匯面</strong><br>（Double/Triple Broadway）</td>
            <td><span class="cards">KsQdTc</span><br><span class="cards">AhKdJs</span></td>
            <td>高牌密集、有強順子與兩對</td>
            <td><strong>翻前加注者（PFR）壓倒性優勢</strong>（壟斷 AA/KK/QQ/AK/KQ/AJ）</td>
            <td><strong>高頻率 + 中大尺度（50%–75% Pot）</strong>，兼具價值與強抽牌施壓</td>
          </tr>
          <tr>
            <td><strong>③ 中高張雙色動態面</strong><br>（Dynamic Two-Tone）</td>
            <td><span class="cards">JsTs6d</span><br><span class="cards">Qh9h7c</span></td>
            <td>同花聽牌 + 順子聽牌並存，轉牌極易變天</td>
            <td>PFR 有較多超對與強頂對，但跟注者有更多兩對、聽牌與部分順子，堅果優勢接近</td>
            <td><strong>中等頻率（45%–60%）+ 大尺度（66%–75% Pot）</strong>極化並拒絕對手便宜實現權益</td>
          </tr>
          <tr>
            <td><strong>④ 中低張連接潮濕面</strong><br>（Low Connected Wet）</td>
            <td><span class="cards">8s7s5d</span><br><span class="cards">7h6c4d</span></td>
            <td>大量順子、兩對、暗三條與複合聽牌</td>
            <td><strong>跟注者（BB）追平甚至佔優！</strong></td>
            <td><strong>高頻過牌（Check 60%–80%）</strong>！只用超強牌與高權益聽牌下注</td>
          </tr>
          <tr>
            <td><strong>⑤ 單色牌面 / 成對牌面</strong><br>（Monotone / Paired）</td>
            <td><span class="cards">Ks9s4s</span><br><span class="cards">8d8c3h</span></td>
            <td>單色面三張同花，誰有同花一目了然；成對面讓三條組合大減、牌面較靜態</td>
            <td>成對面 PFR 具範圍優勢；單色面雙方都需謹慎</td>
            <td><strong>一律使用小尺度（25%–33% Pot）</strong>！單色面降頻；成對面可高頻小注</td>
          </tr>
        </tbody>
      </table>

      <h3>2. 靜態牌面（Static）vs 動態牌面（Dynamic）的本質差異</h3>
      <div class="callout key">
        <b>為什麼動態牌面要下大注、靜態牌面要下小注？</b><br>
        • 在<strong>靜態牌面</strong>（如 <span class="cards">Kh7d2c</span>），如果你拿 <span class="hand">AA</span> 或 <span class="hand">AK</span>，對手拿 <span class="hand">88</span> 或 <span class="hand">76s</span>，對手的逆轉補牌（Outs）只有 2–5 張（轉牌單張命中率約 4%–11%）。你完全不怕給對手看轉牌，反而希望用 <strong>1/3 底池小注</strong>誘使對手拿所有小對子、A 高與後門聽牌繼續跟注。<br>
        • 在<strong>動態牌面</strong>（如 <span class="cards">JdTd6c</span>），對手的 <span class="hand">Q9s</span>、<span class="hand">98s</span>（兩頭順 8 張）、<span class="cards">KdQd</span>（兩頭順 + 同花聽 15 張）、<span class="cards">AdQd</span>（同花聽 + 卡順 + 高張）都有 8–15 張補牌（到河牌約 30%–55% 勝率），幾乎任何一張轉牌都可能讓牌面變天。此時你的 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">AJ</span> 必須下 <strong>2/3–3/4 底池大注</strong>，向對手的聽牌收取昂貴過路費！
      </div>

      <h3>3. 翻牌一發出來，按這 4 步判讀</h3>
      <ol class="steps">
        <li><b>最高張是什麼？</b>A、K 高牌面通常有利於翻前加注者；9 以下的低牌面要提高警覺。</li>
        <li><b>有幾種花色？</b>彩虹（3 種）→ 沒有同花聽牌；雙色（2 張同花）→ 有同花聽牌；單色（3 張同花）→ 已經可能有人成同花。</li>
        <li><b>連不連？</b>三張牌落在 5 點範圍內（如 <span class="cards">8s7d5c</span>）代表順子與兩頭順很多；斷層大（如 <span class="cards">Kd7s2c</span>）則很乾燥。</li>
        <li><b>有沒有成對？</b>成對牌面讓兩對、暗三條組合變少，牌力分布更「兩極」，常可用小注高頻下注。</li>
      </ol>

      <h3>4. 牌例：同一手牌在兩種牌面的不同打法</h3>
      <div class="hh">
        <div class="hh-title">牌例：BTN 開池、BB 跟注，你在 BTN 拿 AhQh（底池 5.5bb）</div>
        <div class="hh-row"><span class="hh-street">牌面 A</span><span class="cards">Ks7d2c</span>（乾燥靜態）：BB 過牌，你用整個範圍高頻下 1/3 底池（約 1.8bb），<span class="hand">AQ</span> 雖然沒中，但有兩張高張與後門順，小注就能逼掉 BB 大量沒中的牌。</div>
        <div class="hh-row"><span class="hh-street">牌面 B</span><span class="cards">8s7s5d</span>（潮濕動態）：這是 BB 範圍的好牌面，你的 <span class="hand">AQ</span> 只有高張，<strong>多半過牌</strong>，不要亂下注被過牌加注（Check-Raise）打走。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>同一手牌，下不下注取決於「牌面對誰的範圍有利」，而不只是你有沒有中。</div>
      </div>
      <div class="callout warn">
        <b>常見錯誤</b>
        • 在 <span class="cards">8s7s5d</span> 這種低連張面照樣 100% C-Bet。<br>
        • 在 <span class="cards">Ks7d2c</span> 這種乾燥面下大注，只會嚇跑對手的弱牌、留下比你強的牌。<br>
        • 只看自己的兩張牌，忘了判斷牌面屬於哪一類。
      </div>
    `
  },

  // ===========================================================================
  // 16. 持續下注（C-Bet）策略
  // ===========================================================================
  {
    id: 'cbet',
    part: '四、翻後策略',
    title: '持續下注（C-Bet）策略與延遲 C-Bet',
    icon: '🎯',
    level: 2,
    minutes: 11,
    summary: '系統掌握單次加注底池（SRP）與 3-Bet 底池的持續下注（C-Bet）規則：何時用 1/3 小注全範圍下注、何時用 2/3 大注極化、何時該過牌打延遲 C-Bet。',
    keyPoints: [
      '持續下注（Continuation Bet, C-Bet）：翻前最後主動加注者（PFR）在翻牌圈繼續主動下注。',
      '當你在翻牌圈沒位置（OOP，例如 UTG 開池被 BTN 跟注）時，即使你有範圍優勢，C-Bet 頻率也必須大幅降低（常過牌 50%–70%），並保護你的過牌範圍！',
      '3-Bet 底池因為 SPR 低（約 4–6）且 3-Bet 者擁有強大高牌範圍優勢，C-Bet 頻率比單次加注底池更高，且常使用 25%–33% 底池小注。',
      '延遲 C-Bet（Delayed C-Bet）：翻牌圈選擇過牌（Check）控制底池或保護過牌範圍，等轉牌對手再度過牌示弱時才出手下注。'
    ],
    html: `
      <h3>1. IP C-Bet vs OOP C-Bet：位置如何徹底改變你的下注頻率</h3>
      <p>同樣是翻前加注者（PFR），<strong>翻後有位置（IP，例如 BTN 開池 vs BB 跟注）</strong>與<strong>翻後沒位置（OOP，例如 CO 開池 vs BTN 跟注）</strong>的 C-Bet 策略有巨大差異：</p>
      <table class="tbl">
        <thead>
          <tr><th>情境</th><th>平均 C-Bet 頻率</th><th>原因解析與過牌範圍保護</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>你有位置（IP）</strong><br>（如 BTN vs BB）</td>
            <td><strong>高（約 65%–85%）</strong></td>
            <td>當 BB 過牌給你時，如果你也過牌，這一街就立刻結束免費看轉牌！因此你可以放心地把大部分好牌與詐唬牌拿出來 C-Bet，中等攤牌價值牌則安心 Check Back 看免費轉牌。</td>
          </tr>
          <tr>
            <td><strong>你沒位置（OOP）</strong><br>（如 HJ/CO vs BTN）</td>
            <td><strong>偏低（約 30%–50%）</strong></td>
            <td>因為你先行動，如果你把所有強牌都拿去 C-Bet，那當你一過牌（Check），後面的 BTN 就會知道你很弱而瘋狂下注搶池！因此 OOP 必須將<strong>部分頂對、超對甚至暗三條留在過牌範圍中（Check-Call / Check-Raise）</strong>！</td>
          </tr>
        </tbody>
      </table>

      <h3>2. 翻牌圈你的手牌該分進哪個籃子？（四分法）</h3>
      <p>在需要混合下注與過牌的牌面上，GTO 會將手牌分成四類：</p>
      <ol>
        <li><strong>強價值牌（Strong Value：頂對好踢腳以上、兩對、暗三條）</strong>：高頻率 C-Bet 把底池做大（OOP 時保留少部分設陷阱過牌加注）。</li>
        <li><strong>中等攤牌價值牌（Medium Showdown Value：頂對弱踢腳、中對子、口袋對子如 <span class="cards">Ks8d3c</span> 上的 <span class="hand">QQ</span>/<span class="hand">99</span>/<span class="hand">A8s</span>）</strong>：優先<strong>過牌控制底池</strong>，抓對手的詐唬或在轉牌打延遲 C-Bet。</li>
        <li><strong>半詐唬強聽牌 / 後門聽牌（Semi-Bluffs：同花聽、兩頭順聽、卡順 + 後門花、兩高牌 + 後門花）</strong>：積極 C-Bet！一旦對手棄牌直接贏池，被跟注還有大量轉牌可以繼續開第二槍（Double Barrel）。</li>
        <li><strong>完全無望的純空氣（Give-ups：無高牌、無後門聽牌的垃圾牌）</strong>：在非範圍下注牌面直接過牌放棄，不要浪費籌碼。</li>
      </ol>

      <div class="callout tip">
        <b>實用戰術：延遲 C-Bet（Delayed C-Bet）</b><br>
        當你在翻牌圈拿著像 <span class="hand">JJ</span>（在 <span class="cards">Ks7d2c</span> 牌面）或 <span class="hand">A9s</span>（在 <span class="cards">Qh8d4c</span> 牌面）選擇隨手過牌（Check Back）後，到了轉牌如果大盲（BB）<strong>第二次過牌</strong>，代表 BB 幾乎不可能有頂對 K 或 Q 了！這時你在轉牌打出 <strong>50%–66% 底池的延遲 C-Bet</strong>，既能向更小的對子拿薄價值，也能高效率偷走底池！
      </div>

      <h3>3. 觀念分析：C-Bet 不等於「無腦詐唬」！薄價值與保護權益的差別</h3>
      <div class="callout plain">
        <b>破除迷思：在翻牌圈或轉牌圈主動下注，很多時候根本不是「詐唬（想把對方嚇跑）」，而是「薄價值（Thin Value）」與「拒絕讓對手免費看牌」！</b><br>
        • 休閒玩家經常會拿「任何中對子」或「任何聽牌」跟注翻牌圈。<br>
        • 如果你拿 <span class="hand">AK</span>，翻牌有 A（例如 <span class="cards">AsQh7c</span>），你下注時對手用一對 Q 或順子聽牌跟注你——<strong>這不是詐唬，這是實打實的價值！</strong>因為你的牌比他大，他在幫你把底池做大；就算你拿的是中強對子下注，逼退對手兩張高牌的 6 張補牌（Outs），也是在保護自己的底池權益。
      </div>

      <h3>4. 3-Bet 底池的 C-Bet：SPR 低，小注就很有威力</h3>
      <table class="tbl">
        <thead>
          <tr><th>比較</th><th>單次加注底池（SRP）</th><th>3-Bet 底池</th></tr>
        </thead>
        <tbody>
          <tr><td>翻牌 SPR</td><td>約 17.7（BTN vs BB）</td><td>約 4–6（IP 約 5.6、OOP 約 4.0）</td></tr>
          <tr><td>C-Bet 者的範圍</td><td>較寬（例如 BTN 開 45%）</td><td>很緊、高牌多（QQ+、AK、AQ…）</td></tr>
          <tr><td>常見尺度</td><td>乾燥面 25%–33%、潮濕面 50%–75%</td><td>多數牌面 25%–33% 就夠（兩條街就能打光）</td></tr>
        </tbody>
      </table>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>每次都 C-Bet、尺度永遠半池</strong>：對手很快就會用過牌加注或飄浮（Float）反制。<br>
        • <strong>OOP 也照 IP 的頻率下注</strong>：沒位置時過牌範圍沒有強牌保護，對手可以放心偷池。<br>
        • <strong>翻牌 C-Bet 被跟注後轉牌就放棄</strong>：要先想好哪些轉牌適合開第二槍（見<a href="#/learn/turn-river">轉牌與河牌策略</a>）。
      </div>
    `
  },

  // ===========================================================================
  // 17. 下注尺度理論
  // ===========================================================================
  {
    id: 'bet-sizing',
    part: '四、翻後策略',
    title: '下注尺度理論：小注、超池注與幾何下注',
    icon: '📐',
    level: 3,
    minutes: 11,
    summary: '掌握現代 GTO 最核心的尺度革命：為什麼 Solver 熱愛 25%–33% 小注與 150% 超池注（Overbet），以及如何計算在河牌剛好打光籌碼的「幾何下注尺度（Geometric Sizing）」。',
    keyPoints: [
      '小尺度下注（25%–33% 底池）：用於你有範圍優勢但想用廣泛合併範圍（Merged Range）下注時，逼對手防守 75%–80% 的過寬範圍。',
      '大尺度與超池下注（75%–200% 底池 Overbet）：用於你有堅果優勢且對手範圍封頂（Capped）時，用極化範圍最大化堅果牌 EV 並獲得最高棄牌率。',
      '幾何下注（Geometric Sizing）：當你希望在剩餘 N 條街用「每一街相同底池百分比」剛好把後手有效籌碼 S 全部推進底池 P 時，每街下注比例 r = [((2S + P) ÷ P)^(1/N) − 1] ÷ 2。',
      '阻擋注（Block Bet，約 20%–30% 底池）：當你沒位置（OOP）拿中等牌力時，主動下小注自己定價，避免面對 IP 對手的大注。'
    ],
    html: `
      <h3>1. 為什麼「半池（50% Pot）」不再是萬用答案？</h3>
      <p>十年前的撲克書常教大家「不知道下多少就下 1/2 底池」，但現代 Solver 告訴我們，多數情境應該往兩端分化：</p>
      <table class="tbl">
        <thead>
          <tr><th>尺度區間</th><th>名稱</th><th>戰術目的</th><th>最常出現的場景</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>20%–33% Pot</strong></td><td><strong>小注 / 阻擋注</strong><br>（Small / Block Bet）</td><td>用極便宜的價格達成<strong>權益否定（Equity Denial）</strong>，或用合併範圍拿薄價值</td><td>乾燥面範圍 C-Bet、3-Bet 底池翻牌 C-Bet、單色/成對面、OOP 轉河牌阻擋注</td></tr>
          <tr><td><strong>66%–80% Pot</strong></td><td><strong>極化大注</strong><br>（Large Polar Bet）</td><td>向對手聽牌與一對收取高額費用，開始極化範圍</td><td>潮濕動態翻牌圈、轉牌第二槍（Double Barrel）</td></tr>
          <tr><td><strong>125%–200% Pot</strong></td><td><strong>超池下注</strong><br>（Overbet）</td><td>在對手範圍封頂（Capped）時，用堅果優勢極限施壓</td><td>翻牌小注後轉牌發出空白牌（Blank）或高牌時的轉牌超池、河牌極化超池</td></tr>
        </tbody>
      </table>

      <h3>2. 幾何下注尺度（Geometric Sizing）公式與速查表</h3>
      <p>當你在翻牌圈或轉牌圈拿著超強價值牌（與對應的極化詐唬），目標是在河牌圈把對手剩餘籌碼<strong>全部贏光（Stack-off）</strong>時，最有效率的方式是讓<strong>每一條街下注佔底池的比例都完全相同</strong>（稱為幾何尺度 <strong>e-sizing</strong>）。</p>
      <p>因為每當你下注底池的 <strong>r 倍</strong> 並被跟注時，底池會變成原本的 <strong>(1 + 2r) 倍</strong>！若經過 <strong>N 條街</strong>後，最終底池恰好等於「初始底池 P + 雙方後手籌碼 2S」，則：</p>
      <div class="formula">(1 + 2r)^N = 1 + 2 × SPR　⇒　每街幾何下注比例 r = [ (1 + 2 × SPR)^(1/N) − 1 ] ÷ 2</div>
      <table class="tbl">
        <thead>
          <tr><th>當前 SPR（有效籌碼 ÷ 底池）</th><th>想用「2 條街（轉+河）」打光：每街下幾 %</th><th>想用「3 條街（翻+轉+河）」打光：每街下幾 %</th><th>典型對應情境</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>SPR = 1.5</strong></td><td>每街約 <strong>50% 底池</strong>（或 1 街 150% 全下）</td><td>—</td><td>4-Bet 底池（翻牌 1 小注、轉牌全下）</td></tr>
          <tr><td><strong>SPR = 4.0</strong>（最終底池 9x）</td><td><strong>每街 100% 底池（滿池 × 2 街）</strong></td><td>每街約 <strong>54% 底池</strong></td><td>OOP 3-Bet 底池（翻牌 54% → 轉牌 54% → 河牌 54% 全下）</td></tr>
          <tr><td><strong>SPR = 6.0</strong>（最終底池 13x）</td><td>每街約 <strong>130% 超池 × 2 街</strong></td><td><strong>每街約 68% 底池（2/3 池 × 3 街）</strong></td><td>IP 3-Bet 底池（三槍 2/3 底池剛好全下！）</td></tr>
          <tr><td><strong>SPR = 13.0</strong>（最終底池 27x）</td><td>—</td><td><strong>每街 100% 底池（滿池 × 3 街）</strong></td><td>三人單次加注底池（底池約 8bb、SPR ≈ 12）：三槍滿池才能打光</td></tr>
          <tr><td><strong>SPR ≈ 17.7</strong>（100bb 單挑 SRP）</td><td>若翻牌只下 33%，轉+河需各下約 <strong>185% 超池</strong></td><td>每街約 <strong>116% 底池 × 3 街</strong></td><td>這解釋了為什麼 100bb 單次加注底池若想贏光對手，轉牌或河牌一定要用到 Overbet！</td></tr>
        </tbody>
      </table>
      <div class="callout example">
        <b>例題：怎麼算出「翻牌 33% 之後要下約 185%」？</b><br>
        SRP 翻牌底池 5.5bb、有效籌碼 97.5bb。翻牌下 1.8bb（33%）被跟注 → 底池 9.1bb、剩 95.7bb，SPR ≈ 10.5。<br>
        剩 2 條街：(1 + 2 × 10.5)^(1/2) ≈ 4.69 → r = (4.69 − 1) ÷ 2 ≈ <strong>1.85（約 185% 底池）</strong>。
      </div>

      <h3>3. 阻擋注（Block Bet）：OOP 拿中等牌力時自己定價</h3>
      <p>你在河牌沒位置，拿一手「能贏詐唬、但怕對手下大注」的中等牌（例如第二對）。如果過牌，IP 對手可能下 75% 甚至超池，你很難跟；先主動下 <strong>20%–30% 底池</strong>，就能用便宜價格看到攤牌，還能從更差的牌拿到一點薄價值。</p>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>用尺度洩露牌力</strong>：強牌下大、弱牌下小，對手很快就能讀出你的牌。同一種情境下，價值牌與詐唬牌要用同一個尺度。<br>
        • <strong>沒有堅果優勢卻超池</strong>：對手範圍有很多強牌時，超池只會被比你更強的牌跟注或加注。<br>
        • <strong>阻擋注被當成萬靈丹</strong>：面對會「對小注加注詐唬」的對手，阻擋注反而會被打走。
      </div>

      <h3>4. 牌例：對手範圍封頂時的轉牌超池</h3>
      <div class="hh">
        <div class="hh-title">牌例：BTN 開池、BB 跟注，你在 BTN 拿 AsKc</div>
        <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Kd7s2c</span>（底池 5.5bb），BB 過牌，你下 1/3 池 1.8bb，BB 跟注。底池 9.1bb，剩 95.7bb。</div>
        <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">3h</span>（空白牌），BB 再過牌。BB 的 <span class="hand">AK</span>、<span class="hand">KK</span> 大多在翻前就 3-Bet 了，範圍以 Kx 弱踢腳、7x、小對子為主（封頂）。你下 <strong>125% 底池（約 11.4bb）</strong>。</div>
        <div class="hh-row"><span class="hh-street">河牌</span>BB 跟注後底池約 31.9bb、剩約 84bb（SPR ≈ 2.6），任何非危險河牌你都可以全下拿價值。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>超池下注的前提是「你有堅果優勢、對手範圍封頂」。你的超池範圍要搭配適量詐唬（例如帶後門聽牌、阻擋 Kx 的牌），否則對手只要拿最強的牌跟注就好。</div>
      </div>
    `
  },

  // ===========================================================================
  // 18. SPR 與籌碼承諾
  // ===========================================================================
  {
    id: 'spr',
    part: '四、翻後策略',
    title: 'SPR（籌碼底池比）與籌碼承諾',
    icon: '🪙',
    level: 2,
    minutes: 9,
    summary: '學會秒算翻牌圈的 SPR（Stack-to-Pot Ratio），並清楚知道在什麼 SPR 下「頂對就該打光全下」、在什麼 SPR 下「頂對頂踢腳也必須棄牌」。',
    keyPoints: [
      'SPR（Stack-to-Pot Ratio，籌碼底池比）= 翻牌圈雙方較小的剩餘有效籌碼 ÷ 翻牌圈底池大小。',
      '100bb 標準戰局的四大 SPR 錨點：單次加注底池（SRP）SPR ≈ 17.7；IP 3-Bet 底池 SPR ≈ 5.6；OOP 3-Bet 底池 SPR ≈ 4.0；4-Bet 底池 SPR ≈ 1.8。',
      'SPR 越低（≤ 4），翻後操作空間越小，一對大牌（頂對強踢腳、超對 AA/KK）價值越高，擊中就準備打光（Committed）。',
      'SPR 越高（≥ 13），一對牌很難承受三條街大注，暗三條（Set）、順子、同花等具有堅果潛力的手牌價值大增。'
    ],
    html: `
      <h3>1. 100bb 現金桌四大底池類型的 SPR 精確計算</h3>
      <div class="formula">SPR（籌碼底池比）= 有效剩餘籌碼（Effective Stack）÷ 翻牌圈底池（Flop Pot）</div>
      <p>以本站 6-Max 100bb 標準翻前尺度為例，我們直接算出四種底池進入翻牌圈時的 SPR：</p>
      <table class="tbl">
        <thead>
          <tr><th>底池類型</th><th>翻前行動範例</th><th>翻牌圈底池 P</th><th>剩餘有效籌碼 S</th><th>SPR = S ÷ P</th><th>願意打光全下（Stack-off）的最低牌力門檻</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>① 單次加注底池（SRP）</strong></td>
            <td>BTN 開 2.5bb，BB 跟注（SB 0.5bb 死錢）</td>
            <td><strong>5.5bb</strong></td>
            <td><strong>97.5bb</strong></td>
            <td><strong>17.7</strong>（高 SPR）</td>
            <td>通常需要<strong>兩對以上、暗三條、順子、同花</strong>才願意打光 100bb；單一對被加注常需棄牌</td>
          </tr>
          <tr>
            <td><strong>② IP 3-Bet 底池</strong></td>
            <td>CO 開 2.5bb，BTN 3B 7.5bb，CO 跟注（盲注 1.5bb）</td>
            <td><strong>16.5bb</strong></td>
            <td><strong>92.5bb</strong></td>
            <td><strong>5.6</strong>（中低 SPR）</td>
            <td><strong>超對（AA/KK/QQ）與頂對頂踢腳（TPTK 如 AK）</strong>在多數安全牌面可打光</td>
          </tr>
          <tr>
            <td><strong>③ OOP 3-Bet 底池</strong></td>
            <td>BTN 開 2.5bb，BB 3B 11bb，BTN 跟注（SB 0.5bb）</td>
            <td><strong>22.5bb</strong></td>
            <td><strong>89.0bb</strong></td>
            <td><strong>≈ 4.0</strong>（低 SPR）</td>
            <td><strong>任何頂對好踢腳、超對、高權益複合聽牌</strong>幾乎都已承諾籌碼</td>
          </tr>
          <tr>
            <td><strong>④ 4-Bet 底池</strong></td>
            <td>CO 4B 到 21bb，BTN 跟注（盲注 1.5bb）</td>
            <td><strong>43.5bb</strong></td>
            <td><strong>79.0bb</strong></td>
            <td><strong>1.8</strong>（極低 SPR）</td>
            <td><strong>任何頂對、中對以上或買花買順</strong>，翻後一槍到兩槍即全下（完全 Committed）</td>
          </tr>
        </tbody>
      </table>

      <h3>2. 為什麼理解 SPR 能救你無數個買入？</h3>
      <div class="callout warn">
        <b>新手破產第一名：在 SPR = 17 的單次加注底池，拿一對 <span class="hand">AA</span> 或 <span class="hand">AK</span> 死不棄牌！</b><br>
        在 <strong>3-Bet 底池（SPR ≈ 4–5）</strong>，對手只要花兩條街就能把籌碼打完，拿頂對 <span class="hand">AK</span> 或超對 <span class="hand">AA</span> 打光完全符合 GTO；但在 <strong>單次加注底池（SPR ≈ 17.7）</strong>，底池只有 5.5bb，後手還有 97.5bb！當對手在翻牌過牌加注、轉牌大注、河牌全下時，你投入將近 18 倍底池，對手沒有兩對或暗三條根本不敢這樣打——這時把單一對 <span class="hand">AA</span> 棄掉才是真正的職業級紀律！
      </div>

      <h3>3. 牌例：同樣是頂對頂踢腳，SPR 不同、結論不同</h3>
      <div class="hh">
        <div class="hh-title">牌例：你拿 AsKd，翻牌 Kh8c3d</div>
        <div class="hh-row"><span class="hh-street">3-Bet 底池</span>你在 BTN 3-Bet、CO 跟注，翻牌底池 16.5bb、剩 92.5bb（SPR ≈ 5.6）。下注 1/3 池 → 轉牌 2/3 池 → 河牌全下，三條街就能打光，<strong>頂對頂踢腳在這裡準備打光</strong>。</div>
        <div class="hh-row"><span class="hh-street">單次加注底池</span>BTN 開池、BB 跟注，翻牌底池 5.5bb、剩 97.5bb（SPR ≈ 17.7）。BB 翻牌過牌加注、轉牌再下大注、河牌全下——要投入接近 18 倍底池，對手的範圍以兩對、暗三條為主，<strong>頂對頂踢腳通常應該在某條街收手</strong>。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>先算 SPR，再決定「這手牌值得打幾條街」，而不是看到頂對就打光。</div>
      </div>

      <h3>4. 常見錯誤與實戰提醒</h3>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>用錯籌碼量算 SPR</strong>：要用「雙方較小的那一疊」（有效籌碼），不是你自己的籌碼。<br>
        • <strong>低 SPR 還想控池</strong>：SPR ≈ 2 時拿超對過牌，等於放棄價值又讓對手免費實現聽牌。<br>
        • <strong>高 SPR 拿小對子、同花連張卻不敢打大底池</strong>：這些牌就是為了在深籌碼時中暗三條、順子、同花贏整疊。
      </div>
    `
  },

  // ===========================================================================
  // 19. 翻後防守：跟注、加注與過牌加注
  // ===========================================================================
  {
    id: 'defense-postflop',
    part: '四、翻後策略',
    title: '翻後防守：跟注、飄浮與過牌加注 (Check-Raise)',
    icon: '🛡️',
    level: 2,
    minutes: 10,
    summary: '當面對對手的持續下注（C-Bet）時，如何建立平衡的跟注與過牌加注（Check-Raise）範圍，並避免最常見的「對小注棄牌過多」漏洞。',
    keyPoints: [
      '面對對手 1/3 底池（33%）小額 C-Bet 時，理論 MDF 高達 75%！你必須用所有對子、所有聽牌、甚至大量「帶後門花順的高牌」跟注或過牌加注防守。',
      '過牌加注（Check-Raise, XR）是 OOP 防守方奪回主動權與懲罰對手高頻小注的核心武器，由「兩對/暗三條/強頂對」與「兩頭順聽/同花聽/卡順+後門花」極化組成。',
      '在對防守方有利的中低連接牌面（如 8♠7♦5♣），大盲（BB）有大量兩對、暗三條與聽牌，過牌加注頻率最高（可達約 15%–25%）；在 A/K 高乾燥面則明顯較低。',
      '位置內飄浮（Float）：當你有位置（IP）時，用帶有後門聽牌與高牌阻擋的牌跟注翻牌小注，若對手在轉牌過牌示弱就出手偷池。'
    ],
    html: `
      <h3>1. 面對 1/3 底池小額 C-Bet，你到底該防守多寬？</h3>
      <p>現代牌手非常喜歡在翻牌圈下 <strong>1/3 底池（33% Pot）</strong>。根據 MDF 公式，面對 1/3 底池下注，你的最小防守頻率是 <strong>75%（最多只能棄牌 25%！）</strong>。如果你遵循舊時代「沒中對子或強聽牌就蓋牌（Fit-or-Fold）」的打法，你在翻牌圈會棄牌高達 55%！</p>
      <p>以 <strong>BTN 開池 vs BB 跟注，翻牌 <span class="cards">Ks8d3c</span> 彩虹面，BTN 下注 1/3 底池</strong>為例，BB 的標準防守組合包含：</p>
      <table class="tbl">
        <thead>
          <tr><th>防守動作</th><th>佔比</th><th>具體手牌類型</th><th>戰術原因</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>過牌加注（Check-Raise）</strong></td>
            <td>約 12%–15%</td>
            <td>• <strong>價值</strong>：<span class="hand">88</span>、<span class="hand">33</span>、<span class="hand">K8s</span>、<span class="hand">K3s</span>、<span class="hand">83s</span>、部分 <span class="hand">KQo</span>/<span class="hand">KJo</span><br>• <strong>半詐唬</strong>：<span class="hand">T9s</span>、<span class="hand">97s</span>、<span class="hand">76s</span>、<span class="hand">65s</span>、<span class="hand">54s</span>、<span class="hand">A5s</span>、<span class="hand">A4s</span>（帶後門同花色！）</td>
            <td>懲罰 BTN 用全範圍垃圾牌下 1/3 小注，同時幫自己的兩對與暗三條立刻把底池做大！</td>
          </tr>
          <tr>
            <td><strong>過牌跟注（Check-Call）</strong></td>
            <td>約 52%–58%</td>
            <td>• 所有頂對 <span class="hand">Kx</span>、所有中對 <span class="hand">8x</span>、所有底對 <span class="hand">3x</span><br>• 口袋對子 <span class="hand">99</span>–<span class="hand">44</span>、<span class="hand">22</span><br>• 強 A 高（<span class="hand">AQ</span>–<span class="hand">A4</span>）與<strong>帶後門同花+後門順的兩張高牌</strong>（如 <span class="cards">QdJd</span>、<span class="cards">QdTd</span>、<span class="cards">Jd9d</span>，都和牌面的 <span class="cards">8d</span> 湊成 3 張方塊）</td>
            <td>小注底池賠率極佳（只需 20% 勝率）；後門同花在轉牌有約 21%（10 ÷ 47）機率變成同花聽牌，再加上中對子、順子聽牌的機會，<span class="cards">QdJd</span> 轉牌改善率約 34%！</td>
          </tr>
          <tr>
            <td><strong>過牌棄牌（Check-Fold）</strong></td>
            <td>約 25%–33%</td>
            <td>• 完全沒有對子、沒有 A 高、也沒有後門同花色與後門順子的純空氣（如不同花色的 <span class="cards">Qh6c</span>、<span class="cards">Jh5d</span>、<span class="cards">Th4c</span>）</td>
            <td>連後門發展性都沒有的牌，果斷棄牌不浪費籌碼。</td>
          </tr>
        </tbody>
      </table>

      <p>注意：上表的棄牌比例略高於 MDF 允許的 25%。這是正常的——<span class="cards">Ks8d3c</span> 是 BTN 範圍優勢很大的牌面，BB 的純空氣硬跟只會在轉牌、河牌繼續虧錢，Solver 允許少量超額棄牌（Overfold，見 <a href="#/learn/mdf-alpha">MDF 與 Alpha</a>）。</p>

      <h3>2. 挑選「過牌加注半詐唬牌」的黃金秘訣：後門同花聽牌（BDFD）</h3>
      <div class="callout key">
        <b>為什麼 Solver 超愛用「卡順 / 兩低張 + 後門同花（Backdoor Flush Draw）」做翻牌 Check-Raise？</b><br>
        1. 若你在乾燥彩虹面 <span class="cards">Ks8d3c</span> 拿 <span class="cards">7d6d</span>（帶有方塊 ♦ 後門同花 + 後門順子）過牌加注，一旦對手跟注，轉牌只要掉出<strong>任何一張方塊（10 張）就變同花聽牌；掉 9 或 5 變兩頭順、掉 4 或 T 變卡順</strong>，你就有理由繼續施壓開第二槍！<br>
        2. 反之，如果你拿完全沒有後門花的 <span class="cards">7h6s</span> 過牌加注，被跟注後轉牌幾乎每一張牌你都不知道該怎麼繼續！
      </div>

      <h3>3. 飄浮（Float）：有位置時跟注，轉牌再出手</h3>
      <p>當你在 IP、對手翻牌 C-Bet 小注時，用<strong>有後門聽牌或高張</strong>的牌先跟注；如果對手轉牌過牌示弱（代表他的 C-Bet 常是全範圍下注），你就下注拿走底池。</p>
      <div class="hh">
        <div class="hh-title">牌例：BTN 跟注 CO 開池，拿 Qh Jh 飄浮</div>
        <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Ah7h3c</span>（底池 6.5bb），CO 下注 2bb（約 1/3 池），你帶著同花聽牌 + 後門順跟注。</div>
        <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">2s</span>，CO 過牌（底池 10.5bb）。你下注約 7bb（約 2/3 池），讓 CO 沒有 A 的牌難以繼續，被跟注還有 9 張同花補牌。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>飄浮不是「沒牌硬跟」，而是靠位置 + 聽牌/後門潛力，在對手示弱時接手主動權。</div>
      </div>

      <h3>4. 常見錯誤</h3>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>Fit-or-Fold</strong>：面對 1/3 池小注沒中就棄，等於讓對手用任何兩張牌下注都賺。<br>
        • <strong>過牌加注只用堅果</strong>：對手很快就知道你一加注就是暗三條，強牌拿不到價值；要搭配後門聽牌類的半詐唬。<br>
        • <strong>OOP 飄浮</strong>：沒位置時「先跟、轉牌再搶」很難執行，因為你要先行動，資訊永遠比對手少。
      </div>
    `
  },

  // ===========================================================================
  // 20. 轉牌與河牌策略
  // ===========================================================================
  {
    id: 'turn-river',
    part: '四、翻後策略',
    title: '轉牌與河牌策略：開槍選擇、阻擋牌與抓詐',
    icon: '🌊',
    level: 3,
    minutes: 11,
    summary: '進入大底池的轉牌（Turn）與河牌（River）：學會辨識哪張轉牌適合開第二槍（Double Barrel），以及在河牌如何用阻擋牌（Blockers）挑選最完美的詐唬與抓詐牌。',
    keyPoints: [
      '轉牌四分類：① 高牌驚悚牌（Overcard / Scare Card，對 PFR 極有利，適合大注或超池）；② 完成明顯聽牌的牌（同花或四連順到牌，需降頻或用小注）；③ 牌面成對牌（Paired Card，減少對手兩對組合）；④ 空白磚頭牌（Blank / Brick，維持翻牌優勢，適合大注極化）。',
      '河牌好詐唬牌（Good River Bluffs）的三大條件：① 自己沒有攤牌價值（0% SDV）；② 阻擋對手的跟注/堅果範圍（Block Call/Nuts）；③ 不阻擋對手的棄牌範圍（Unblock Folds，例如不要阻擋對手破產的同花聽牌）！',
      '河牌好抓詐牌（Good Bluff Catchers）：因為所有抓詐牌都只贏詐唬、輸價值，點數大小反而不重要，最重要的是「阻擋對手的價值牌、不阻擋對手的詐唬牌」！',
      '薄價值下注（Thin Value Bet）：當對手範圍已封頂時，只要被跟注時你有 > 50% 勝率，就應該勇敢打薄價值。'
    ],
    html: `
      <h3>1. 轉牌圈（Turn）：哪些牌適合開第二槍（Double Barrel）？</h3>
      <p>在翻牌圈 C-Bet 被對手跟注後，底池已經變大。轉牌發出的第 4 張公共牌會劇烈改變雙方範圍的強弱：</p>
      <table class="tbl">
        <thead>
          <tr><th>轉牌類型</th><th>假設翻牌為 <span class="cards">Ts7s2d</span> 時的轉牌</th><th>對誰有利？</th><th>進攻方（PFR）的轉牌策略</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>① 高牌驚悚牌（Overcard）</strong></td><td>轉牌掉 <span class="cards">Ah</span> 或 <span class="cards">Kd</span></td><td><strong>PFR 大優！</strong>（PFR 有大量 AK/AQ/KQ，防守方翻牌很多一對 10 變成第二對）</td><td><strong>高頻率繼續開槍，且常使用大注或超池（Overbet）</strong>施壓對手的 <span class="hand">Tx</span></td></tr>
          <tr><td><strong>② 低張空白磚頭（Blank）</strong></td><td>轉牌掉 <span class="cards">3c</span></td><td><strong>維持 PFR 堅果優勢</strong></td><td><strong>極化大注（75%–125% Pot）</strong>：用超對/暗三條/強頂對與高權益聽牌開大槍，中等一對過牌控池</td></tr>
          <tr><td><strong>③ 同花成牌張（Flush Completes）</strong></td><td>轉牌掉 <span class="cards">4s</span>（三張黑桃）</td><td>雙方都有同花，原本的超對/暗三條不再是堅果</td><td><strong>大幅降低下注頻率，且改用小尺度（33% Pot）</strong>；手上帶有單張 <span class="cards">As</span> 或 <span class="cards">Ks</span> 阻擋牌的可作半詐唬</td></tr>
          <tr><td><strong>④ 中張成順連結牌</strong></td><td>轉牌掉 <span class="cards">8h</span> 或 <span class="cards">9d</span></td><td><strong>對 BB 防守方有利！</strong>（轉 8：<span class="hand">J9</span>、<span class="hand">96</span> 成順；轉 9：<span class="hand">J8</span>、<span class="hand">86</span> 成順，<span class="hand">98</span> 變兩對）</td><td><strong>高度謹慎、多過牌</strong>，避免拿超對在不利轉牌被打爆</td></tr>
        </tbody>
      </table>

      <h3>2. 河牌圈（River）阻擋牌藝術：什麼是最好的詐唬與最好的抓詐？</h3>
      <p>到了河牌，聽牌未中就是 0% 勝率。這時決定要不要開第三槍詐唬（Triple Barrel Bluff）或英雄跟注（Hero Call），關鍵全在<strong>「阻擋牌（Blockers）與反阻擋牌（Unblockers）」</strong>！</p>
      <div class="callout example">
        <b>實戰神級案例：翻牌與轉牌都有黑桃同花聽牌，河牌沒開出第 3 張黑桃（同花聽牌破產！）</b><br>
        假設公共牌最終為 <span class="cards">Ks9s4d2h7c</span>（翻牌兩張黑桃 ♠，轉河牌都沒開黑桃）：<br>
        • <strong>如果你是進攻方想在河牌詐唬</strong>：你<strong>最不應該</strong>拿破產的「黑桃同花聽牌（如 <span class="cards">QsJs</span>）」去詐唬！為什麼？因為對手在翻牌、轉牌跟注你兩槍，到河牌最容易棄牌的就是「他手上也破產的黑桃同花聽牌」！如果你自己握著兩張黑桃，就<strong>阻擋了對手的棄牌範圍（Block Villain's Folds）</strong>！相反地，你應該拿沒有黑桃的順子聽牌破產（如 <span class="cards">QdJd</span>、<span class="cards">JcTc</span>）去詐唬！<br>
        • <strong>如果你是防守方拿一對 <span class="hand">K</span> 想抓詐</strong>：如果你拿的是 <span class="cards">KhQs</span>（帶黑桃），反而<strong>比較不適合跟注</strong>（因為你阻擋了對手可能拿來亂詐唬的黑桃聽牌）；拿完全沒黑桃的 <span class="cards">KhQd</span> 才是更好的抓詐牌！<br>
        • <strong>反之，如果河牌真的開出第 3 張黑桃（同花完成！）</strong>：這時誰手上有單張堅果黑桃 <span class="cards">As</span>，誰就擁有全場最強的堅果阻擋牌，最適合打出河牌超池詐唬！
      </div>

      <h3>3. 河牌薄價值（Thin Value）：被跟注時贏一半以上就該下注</h3>
      <p>判斷要不要拿中等牌力下注，不是問「我是不是最大」，而是問：<strong>「對手會用哪些牌跟注？其中我能贏幾成？」</strong>只要被跟注時你贏超過 50%，下注就比過牌賺。</p>
      <div class="hh">
        <div class="hh-title">牌例：BTN 拿 KhJh，公共牌 Kd8s5c3h2d</div>
        <div class="hh-row"><span class="hh-street">前情</span>翻牌你 C-Bet 被 BB 跟注，轉牌雙方過牌。河牌 BB 再過牌。</div>
        <div class="hh-row"><span class="hh-street">想對手</span>BB 翻牌跟注、轉牌過牌，常見的是 <span class="hand">KT</span>、<span class="hand">K9</span>、<span class="hand">Q8s</span>、<span class="hand">88</span>/<span class="hand">55</span>（但暗三條多半會加注）、<span class="hand">A8</span>、<span class="hand">87s</span> 等。</div>
        <div class="hh-row"><span class="hh-street">決策</span>小注（約 1/3 池）會被更差的 K 與 8x 跟注，你贏的比較多 → <strong>下注拿薄價值</strong>；若對方加注，大多是兩對以上，可以棄牌。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>薄價值用小尺度：下太大只會讓更差的牌棄掉，只剩更好的牌跟注。</div>
      </div>

      <h3>4. 常見錯誤</h3>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>轉牌每張都開第二槍</strong>：完成對手聽牌的轉牌（同花、順子到位）要降頻、縮小尺度。<br>
        • <strong>拿有攤牌價值的牌去河牌詐唬</strong>：A 高、小對子過牌常常就能贏，拿它詐唬等於把能贏的牌變成要對手棄牌才贏。<br>
        • <strong>抓詐只看自己牌力大小</strong>：抓詐牌的好壞取決於阻擋牌——阻擋對手的價值牌、不阻擋他的詐唬牌，才是好的抓詐牌。
      </div>
    `
  },

  // ===========================================================================
  // 21. GTO 與剝削打法
  // ===========================================================================
  {
    id: 'exploit',
    part: '五、實戰與進階',
    title: 'GTO 與剝削打法 (Exploitative Play) 及 HUD 判讀',
    icon: '🎯',
    level: 2,
    minutes: 11,
    summary: '理解「以 GTO 為盾、以剝削為矛」的實戰哲學：如何針對六大常見玩家類型與大眾池漏洞（Population Leaks）做出最高 EV 的偏離調整，以及讀懂 HUD 核心數據。',
    keyPoints: [
      'GTO 保證你長期不被剝削（雙人對局中不會輸給任何策略），但當對手偏離均衡時，主動偏離 GTO 採取「剝削打法（Exploit）」才能把對手的錯誤轉化為最大利潤！',
      '中低級別大眾池（Population）四大鐵律漏洞：① 河牌大注與加注嚴重詐唬不足（Under-bluff）；② 翻牌面對小注跟注過多或棄牌過多；③ 面對 3-Bet / 4-Bet 處理極端；④ 在被動線上從不保護過牌範圍。',
      '核心剝削口訣：「對手棄太多（Overfold）→ 我們大幅增加詐唬；對手跟太多（Overcall）→ 我們幾乎不詐唬並放寬薄價值下注！」',
      '熟悉 VPIP（入池率）、PFR（翻前加注率）、3-Bet%、Fold to 3-Bet%、WTSD（看攤牌率）五大 HUD 指標的標準 GTO 區間。'
    ],
    html: `
      <h3>1. 六人桌 HUD 核心數據：GTO 基準值 vs 玩家類型判讀</h3>
      <table class="tbl">
        <thead>
          <tr><th>HUD 指標</th><th>中文意義</th><th>6-Max GTO 標準區間</th><th>過高代表什麼漏洞？</th><th>過低代表什麼漏洞？</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>VPIP</strong></td><td>主動入池率</td><td><strong>22%–28%</strong></td><td>&gt; 35%：玩太多垃圾牌（鬆魚 / 鯨魚）</td><td>&lt; 18%：只玩大牌的超緊岩石（Nit）</td></tr>
          <tr><td><strong>PFR</strong></td><td>翻前加注率</td><td><strong>17%–23%</strong><br>（與 VPIP 差距約 6 點以內）</td><td>與 VPIP 都很高：瘋狂鬆凶（LAG / Maniac）</td><td>VPIP 40% 但 PFR 8%：愛平跟的被動跟注站（Calling Station）</td></tr>
          <tr><td><strong>3-Bet %</strong></td><td>翻前再加注率</td><td><strong>9%–11%</strong></td><td>&gt; 14%：過度詐唬 3-Bet，可多 4-Bet 與平跟反制</td><td>&lt; 5%：只有 QQ+/AK 才 3-Bet，面對他 3-Bet 可直接大棄牌！</td></tr>
          <tr><td><strong>Fold to 3-Bet</strong></td><td>面對 3B 棄牌率</td><td><strong>約 45%–55%</strong></td><td>&gt; 60%：嚴重怕 3-Bet！可拿任意阻擋牌瘋狂 3-Bet 偷他的開池</td><td>&lt; 38%：死不蓋牌！對他停掉所有詐唬 3-Bet，改用寬線性價值 3-Bet</td></tr>
          <tr><td><strong>WTSD %</strong></td><td>進翻牌後走到攤牌率</td><td><strong>27%–32%</strong></td><td>&gt; 34%：好奇寶寶跟注站，絕不對他純詐唬</td><td>&lt; 23%：翻後稍遇壓力就棄牌，可多開兩槍、三槍施壓</td></tr>
        </tbody>
      </table>

      <h3>2. 大眾池四大常見漏洞（Population Leaks）與高獲利剝削方案</h3>
      <div class="callout key">
        <b>實戰印鈔機：針對一般玩家的 4 個高勝率調整</b><br>
        1. <strong>河牌面對「過牌加注（River Check-Raise）」或「河牌超池」</strong>：中低級別玩家在河牌加注幾乎 90% 以上都是兩對、暗三條、順子或同花（嚴重詐唬不足 Under-bluff）。不要在這裡當英雄拿一對去抓詐——<strong>直接棄牌（Overfold）能幫你省下巨額買入！</strong><br>
        2. <strong>當對手在翻牌與轉牌連續過牌兩次（Check-Check）</strong>：一般玩家幾乎不會把強牌慢打兩條街，他們的範圍 95% 是弱一對或放棄的空氣。此時在轉牌或河牌打出<strong>66%–100% 大注偷池</strong>，成功率遠超 Alpha 門檻！<br>
        3. <strong>對付愛平跟的休閒魚玩家（Calling Station）</strong>：用更大尺度（如 3.5bb–4bb）隔離加注（Isolation Raise），翻後只要中頂對就連打三條街大額價值注，沒中就安靜過牌，<strong>永遠不要想把跟注站打蓋牌</strong>！<br>
        4. <strong>對付緊弱常客（Nit / Weak-Tight Reg）</strong>：在後位與盲注位對他高頻率 3-Bet，並在轉牌發出驚悚高牌（A/K）時勇敢開第二槍。
      </div>

      <h3>3. 觀念突破：對休閒玩家不詐唬，難道只能整場枯坐？</h3>
      <div class="callout plain">
        <b>這是一個非常棒且直擊核心的問題！</b><br>
        很多人聽到「對上新手或休閒玩家（俗稱『魚』／跟注站）要採取只打價值、完全不詐唬的策略」，就會擔心：「那我豈不是整場只能等拿到 <span class="hand">AA</span>、<span class="hand">KK</span> 才玩，沒拿到好牌就只能一路棄牌當木頭人？」<br>
        <strong>完全不是！關鍵在於：「不在河牌硬詐唬」≠「放棄翻牌前的進攻權（Pre-flop Aggression）」與「放棄其他街的薄價值」！</strong>
      </div>
      <p>你可以透過以下三個策略，在面對新手時依然打得主動、掌握主導權，而不是被動乾等大牌：</p>
      <ol class="steps">
        <li><b>策略 1：擴大你的「起手牌範圍」（Pre-flop 依然可以主動進攻）</b><br>
          你不需要拿頂級好牌（如 <span class="hand">AA</span>、<span class="hand">KK</span>）才進場。在翻牌前（Pre-flop），面對休閒玩家，你可以利用<strong>位置優勢</strong>，用更廣泛的合適範圍去加注（Open raise）、隔離加注或偷盲注。<br>
          • 休閒玩家通常範圍很鬆、喜歡看牌，拿到中等牌力也捨不得放手。<br>
          • 這意味著當你拿到兩對、頂對，甚至只是中等強度的牌時，他們都會付錢給你！所以你有很多機會可以主動進池，根本不用整場枯坐等好牌。</li>
        <li><b>策略 2：善用「持續下注（C-Bet）」拿小價值，而不是詐唬</b><br>
          在翻牌圈（Flop）或轉牌圈（Turn）時，你下注有時候不一定是「詐唬（想把對方嚇跑）」，而是<strong>「薄價值（Thin Value）」</strong>或<strong>「拒絕讓對手免費看牌」</strong>：<br>
          • 休閒玩家經常會拿「任何中對子」或「任何聽牌」跟注翻牌圈。<br>
          • 如果你在翻牌圈中了高牌（例如你拿 <span class="hand">AK</span>，翻牌有 A），你可以主動下注。這時候對手用 Q 對或聽牌跟注你——<strong>這不是詐唬，這是價值！</strong>因為你的牌比他大，他在幫你累積底池。</li>
        <li><b>策略 3：如果真的完全沒牌，就乾脆地「放棄」</b><br>
          德州撲克本來就是一場「棄牌率很高」的遊戲，職業選手也會棄掉大多數的起手牌（6 人桌平均約 72%–78% 的起手牌不進場）。<br>
          • 當你在翻牌前沒拿到好牌、翻牌圈又完全沒中，對手又展現出強烈的興趣時，直接過牌或棄牌是完全正確且省錢的做法。<br>
          • 對付新手的核心祕訣就是：<strong>「當你沒牌時，別花錢；當你有好牌時，狠狠地收割他。」</strong>他們犯的錯（愛跟注、不肯棄牌）會讓你每次中好牌時賺回好幾倍！</li>
      </ol>
      <div class="compare">
        <div>
          <h4>✅ 打休閒玩家的正確主動節奏</h4>
          <p>• <strong>翻牌前</strong>：利用位置，用合適的範圍正常加注、主動進攻。<br>• <strong>翻牌後</strong>：只要有中等以上的牌力或強聽牌，就安心下注拿價值（因為他們會跟）。<br>• <strong>真的什麼都沒有時</strong>：果斷放棄，把籌碼留給下一手牌！</p>
        </div>
        <div>
          <h4>❌ 對休閒玩家最昂貴的誤區</h4>
          <p>翻牌完全沒中、對手已經跟注兩條街，你還在河牌試圖用空氣大注「嚇跑」一個<strong>根本不懂你在代表什麼範圍、眼裡只有自己手上一對</strong>的新手！</p>
        </div>
      </div>

      <h3>4. 牌例：對跟注站把價值打滿</h3>
      <div class="hh">
        <div class="hh-title">牌例：你在 CO 開池，BB 的休閒玩家跟注（他 VPIP 45%、WTSD 38%）</div>
        <div class="hh-row"><span class="hh-street">翻前</span>你拿 <span class="cards">AhTd</span> 開 2.5bb，BB 跟注，底池 5.5bb。</div>
        <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Ts6c3d</span>，你頂對好踢腳，下注 2/3 池（約 3.5bb）而不是 1/3——跟注站會用 6x、3x、任何兩張高牌跟注。</div>
        <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">8h</span>，繼續下 2/3 池；他跟注。</div>
        <div class="hh-row"><span class="hh-street">河牌</span><span class="cards">2s</span>，再下注 1/2–2/3 池拿薄價值。他翻出 <span class="cards">Tc5c</span>，你的 A 踢腳獲勝。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>對跟注站：價值下注要更大、更多條街；但如果你的牌沒中，就不要詐唬。</div>
      </div>
    `
  },

  // ===========================================================================
  // 22. 多人底池策略
  // ===========================================================================
  {
    id: 'multiway',
    part: '五、實戰與進階',
    title: '多人底池策略 (Multiway Pots)',
    icon: '👥',
    level: 2,
    minutes: 8,
    summary: '現場撲克（Live Poker）與低級別最常出現的 3 人以上多人底池：為什麼單挑的 C-Bet 習慣在多人底池會讓你大失血，以及正確的尺度與手牌選擇。',
    keyPoints: [
      '防守負擔倍增（Defense Burden Shared）：在 3 人底池中，面對你的下注，兩位對手的「共同 MDF」會讓每個人只需要防守比單挑更緊的強牌，意味著你的詐唬成功率大幅下降！',
      'C-Bet 頻率必須腰斬：單挑可以 80% 範圍下注的乾燥面，在 3–4 人底池中 C-Bet 頻率通常降到 20%–35%，而且尺度縮小為 25%–33% 底池。',
      '一對的價值大幅貶值，堅果潛力（Nut Potential）成為王道：在多人底池裡，KJo 這種中頂對弱踢腳常一進場就已經輸給別人的兩對或更好踢腳；反而是同花 A（Axs）、口袋對子（抽 Set）與同花連張價值大增。',
      '多人底池絕不純空氣硬詐唬（No Pure Air Bluffs）：半詐唬必須是「堅果同花聽牌（Nut Flush Draw）」或「兩頭順聽以上」。'
    ],
    html: `
      <h3>1. 為什麼單挑（Heads-Up）跟多人底池（Multiway）完全是兩個遊戲？</h3>
      <p>假設你在翻牌圈下注 <strong>50% 底池</strong>，需要對手全體棄牌 <strong>33.3%（即留存 66.7%）</strong>才會讓純詐唬回本：</p>
      <ul>
        <li>在<strong>單挑底池（1 對 1）</strong>：唯一的對手必須自己扛下 66.7% 的防守頻率，所以他得拿大量弱對子與後門聽牌硬跟。</li>
        <li>在<strong>三人底池（1 對 2）</strong>：只要兩位對手「加起來」有 66.7% 機率有人繼續即可！換算下來，每位對手只需要拿自己範圍中<strong>前 42% 最強的牌</strong>跟注（因為 <code>(1 − 0.42) × (1 − 0.42) ≈ 33.6%</code> 兩人同時棄牌）！</li>
        <li>在<strong>四人底池（1 對 3）</strong>：每位對手只需要拿<strong>前 30% 最強的牌</strong>跟注！一旦有人跟注，他的範圍比單挑時強上好幾個檔次！</li>
      </ul>

      <h3>2. 多人底池 vs 單挑底池的四大實戰調整</h3>
      <table class="tbl">
        <thead>
          <tr><th>調整面向</th><th>單挑底池（Heads-Up）</th><th>多人底池（3+ Players）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>翻牌 C-Bet 頻率</strong></td><td>高（60%–90%）</td><td><strong>極低（20%–35%）</strong>，沒位置時甚至接近全面過牌</td></tr>
          <tr><td><strong>翻牌 C-Bet 尺度</strong></td><td>33%–75% 視牌面而定</td><td><strong>優先使用 25%–33% 小尺度</strong>（因為小注就能迫使兩位對手各自棄掉大量邊緣牌）</td></tr>
          <tr><td><strong>價值下注門檻</strong></td><td>頂對中等踢腳即可連打三街</td><td><strong>頂對頂踢腳（如 AK）通常只值 1–2 條街</strong>；打滿三條街常需暗三條、堅果同花或順子</td></tr>
          <tr><td><strong>半詐唬選擇</strong></td><td>卡順、低同花聽牌（如 <span class="hand">65s</span>）皆可半詐唬</td><td><strong>只用堅果同花聽牌（<span class="hand">Axs</span>）或強複合聽牌</strong>（避免好不容易湊成小同花卻撞上別人的 A 同花輸光！）</td></tr>
        </tbody>
      </table>

      <h3>3. 牌例：三人底池拿頂對，該打幾條街？</h3>
      <div class="hh">
        <div class="hh-title">牌例：CO 開池 2.5bb，BTN、BB 跟注（三人底池）</div>
        <div class="hh-row"><span class="hh-street">翻前</span>你在 CO 拿 <span class="cards">AsJd</span>。底池 2.5 × 3 + 0.5 = <strong>8bb</strong>，剩 97.5bb（SPR ≈ 12）。</div>
        <div class="hh-row"><span class="hh-street">翻牌</span><span class="cards">Jh8h4c</span>，BB 過牌。你有頂對好踢腳，下注 1/3 池（約 2.7bb），BTN 跟注、BB 棄牌。</div>
        <div class="hh-row"><span class="hh-street">轉牌</span><span class="cards">7h</span>（第三張紅心、又連上 8-7），你過牌控池；BTN 下注半池，你跟注或視對手類型棄牌。</div>
        <div class="hh-row result"><span class="hh-street">重點</span>多人底池中，頂對好踢腳通常只值 1–2 條街；牌面變危險時要願意放慢，而不是像單挑一樣連打三條街。</div>
      </div>

      <h3>4. 常見錯誤</h3>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>把單挑的高頻小注 C-Bet 照搬到多人底池</strong>：兩三個對手中只要有一人中牌就會繼續，你的詐唬很少成功。<br>
        • <strong>拿非堅果聽牌大力半詐唬</strong>：例如 <span class="hand">65s</span> 的小同花聽牌，中了也可能輸給更大的同花。<br>
        • <strong>忽略「夾在中間」的位置</strong>：你下注後，前面的人跟注、後面的人還能加注，中間位置的邊緣牌要更保守。
      </div>
    `
  },

  // ===========================================================================
  // 23. 資金管理、變異數與心態
  // ===========================================================================
  {
    id: 'bankroll-mindset',
    part: '五、實戰與進階',
    title: '資金管理、變異數與頂尖牌手心態',
    icon: '💎',
    level: 1,
    minutes: 9,
    summary: '為什麼技術再好的職業牌手也會經歷 15 個買入的下風期（Downswing）？建立科學的資金管理（Bankroll Management）、理解變異數與抽水，徹底告別上頭（Tilt）。',
    keyPoints: [
      '衡量長期勝率最常用的指標是「bb/100（每 100 手牌平均贏幾個大盲）」：線上 6-Max 現金桌能穩定打出 +3 ~ +8 bb/100 就已經是很好的贏家（樣本要夠大才準）。',
      '6 人桌無限注德州撲克的標準差（Standard Deviation）高達約 85–105 bb/100！這意味著即使是 +5 bb/100 的穩定贏家，在 10,000 手牌內也有超過 30% 機率處於虧損或經歷 10–20 個買入的下風期。',
      '資金管理鐵律（Bankroll Management）：線上現金桌至少準備 30–50 個買入（3,000–5,000bb，全職建議 60–100 個）；錦標賽（MTT）因變異數極大，需準備 100–200 個買入。',
      '過程導向（Process-Oriented）取代結果導向（Results-Oriented）：只要全下時你的決策是 +EV，後面發什麼牌都只是機率兌現，無須為 Bad Beat 或 Cooler 動搖策略。'
    ],
    html: `
      <h3>1. 殘酷但真實的數學：贏家的變異數（Variance）有多大？</h3>
      <p>許多剛學 GTO 的玩家打了 2,000 手牌輸了 5 個買入（500bb），就開始懷疑「是不是 GTO 沒用？」。讓我們看真實的統計學數據：</p>
      <ul>
        <li>在 6-Max 無限注德州撲克中，一位強大贏家的長期真實勝率約為 <strong>+5 bb/100</strong>（每打 100 手牌平均贏 5 個大盲，也就是每 2,000 手牌預期贏 1 個 100bb 買入）。</li>
        <li>但每 100 手牌的<strong>標準差（Standard Deviation, σ）卻高達約 100 bb/100</strong>（是每百手贏率的 <strong>20 倍</strong>！）。</li>
        <li>因此，在短期幾千手牌內，發牌運氣（Cooler 冤家牌如 KK 撞 AA、全下跑馬被逆轉 Bad Beat、聽牌有沒有中）會完全掩蓋技術差距；唯有累積到 <strong>30,000–50,000 手牌以上</strong>，真實的 +EV 技術曲線才會穩定浮現！</li>
      </ul>

      <h3>2. 科學資金管理表（Bankroll Management）與升降級機制</h3>
      <table class="tbl">
        <thead>
          <tr><th>遊戲類型</th><th>休閒 / 業餘學習者（有其他收入）</th><th>嚴謹進階牌手</th><th>全職 / 零破產風險標準</th><th>何時降級保護資金？</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>線上 6-Max 現金桌（100bb）</strong></td><td><strong>25–30 個買入</strong>（2,500–3,000bb）</td><td><strong>40–50 個買入</strong></td><td><strong>60–100 個買入</strong></td><td>當資金跌破<strong>目前級別</strong>約 25–30 個買入時，就降回低一級，等資金回來再升級</td></tr>
          <tr><td><strong>現場現金桌（Live Cash）</strong></td><td><strong>15–20 個買入</strong></td><td><strong>25–30 個買入</strong></td><td><strong>40 個買入</strong></td><td>現場節奏慢、對手較軟，變異數略低於線上</td></tr>
          <tr><td><strong>多桌錦標賽（MTT）</strong></td><td><strong>50–80 個平均買入</strong></td><td><strong>100–150 個買入</strong></td><td><strong>200+ 個買入</strong></td><td>MTT 前 1% 獎金高度集中，連輸 30–50 場屬正常現象</td></tr>
        </tbody>
      </table>

      <h3>3. 預防與戒除「情緒失控（Tilt）」的三個實戰習慣</h3>
      <div class="callout tip">
        <b>頂尖牌手的心態防線</b><br>
        1. <strong>設定單日停損線（Stop-Loss，例如單次 Session 輸滿 3–4 個買入且感覺專注力下降時立刻關桌）</strong>：A-Game（最佳狀態）與 C-Game（上頭亂跟、報復性 3-Bet）的勝率差距高達 20 bb/100！<br>
        2. <strong>用大盲（bb）而非金錢顯示籌碼</strong>：把牌桌設定切換為「顯示 BB 數」，讓你專注在 2.5bb、7.5bb、SPR 與底池賠率，消除對金額的恐懼。<br>
        3. <strong>區分「決策錯誤」與「結果不好」</strong>：每天打完牌，只挑出「當下不確定該怎麼打的題目」放進範圍表與計算機復盤，不要花時間抱怨 <span class="hand">AA</span> 被 <span class="hand">77</span> 抽中三條。
      </div>

      <h3>4. 例題：+5 bb/100 的贏家，打 1 萬手還會虧錢嗎？</h3>
      <div class="callout example">
        <b>用標準差算給你看</b><br>
        • 期望值：10,000 手 = 100 個「百手」，平均贏 5 × 100 = <strong>+500bb</strong>（5 個買入）。<br>
        • 標準差：100 bb/100 × √100 = <strong>1,000bb</strong>。<br>
        • 結果低於 0 的機率 ≈ 期望值往下 0.5 個標準差 ≈ <strong>31%</strong>。<br>
        結論：就算你是穩定贏家，打 1 萬手仍有約三成機率是虧錢的。這就是為什麼要準備足夠的買入、並用決策品質而不是短期輸贏評估自己。
      </div>
    `
  },

  // ===========================================================================
  // 24. 學習路線：如何用本站變強
  // ===========================================================================
  {
    id: 'study-plan',
    part: '五、實戰與進階',
    title: '學習路線圖：如何用本站每天 30 分鐘系統化變強',
    icon: '🗺️',
    level: 1,
    minutes: 7,
    summary: '把本站的 54 堂課、40 組翻前範圍表、多種隨機測驗（翻前、數學、理論、牌型、Outs、牌面、翻後情境…）、術語百科與計算工具，串成一套「新手村 → 基礎 → GTO 核心 → 翻前 → 翻後 → 實戰」的循序漸進路線，搭配 30 天計畫每天練習。',
    keyPoints: [
      '第 0 步（完全新手）：先讀〇、新手村（規則、牌型、一手牌流程、下注動作），並用「誰贏了」「牌型辨識」練到不用想就能判斷輸贏。',
      '第 1 週（打底與 RFI 開池）：讀基礎篇與開池課程，用「範圍填色挑戰」與「翻前決策練習」把 UTG、HJ、CO、BTN、SB 五個開池範圍練到 90% 以上準確率。',
      '第 2 週（面對開池與被 3-Bet 防守）：專攻「面對開池」與「被 3-Bet」兩大最常犯錯的情境，徹底搞懂 IP 與 OOP 的防守分水嶺。',
      '第 3–4 週（數學與翻後）：每天刷撲克數學與 GTO 理論題，把底池賠率、MDF、Alpha、價值詐唬比練成直覺，再進入牌面結構、C-Bet、SPR，並定期把錯題本清零。'
    ],
    html: `
      <h3>1. 六階段學習地圖</h3>
      <p>學撲克最怕「看了一堆文章，上桌卻還是憑感覺亂按」。本站的設計是<strong>「學完立刻做題、哪裡不會就練哪裡」</strong>：</p>
      <table class="tbl">
        <thead>
          <tr><th>階段</th><th>核心目標</th><th>推薦課程</th><th>對應練習</th><th>通關標準</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>〇、新手村</strong></td>
            <td>看懂規則、牌型與一手牌流程</td>
            <td><a href="#/learn/welcome">德州撲克是什麼</a>、<a href="#/learn/hand-rankings">牌型大小</a>、<a href="#/learn/hand-flow">一手牌流程</a></td>
            <td><a href="#/quiz/showdown">🏆 誰贏了</a> · <a href="#/quiz/handname">🃏 牌型辨識</a></td>
            <td>比牌題連續 20 題全對</td>
          </tr>
          <tr>
            <td><strong>一、基礎篇</strong></td>
            <td>位置、組合數、底池賠率與 Outs</td>
            <td><a href="#/learn/positions">位置</a>、<a href="#/learn/hands-combos">組合數</a>、<a href="#/learn/poker-math">底池賠率與 EV</a></td>
            <td><a href="#/quiz/position">🧭 位置辨識</a> · <a href="#/quiz/outs">🎯 數 Outs</a> · <a href="#/quiz/math">🧮 撲克數學</a></td>
            <td>數學題準確率 <strong>≥ 85%</strong></td>
          </tr>
          <tr>
            <td><strong>二、GTO 核心</strong></td>
            <td>MDF、Alpha、價值詐唬比、範圍思維</td>
            <td><a href="#/learn/gto-intro">什麼是 GTO</a>、<a href="#/learn/mdf-alpha">MDF 與 Alpha</a>、<a href="#/learn/value-bluff">價值與詐唬</a></td>
            <td><a href="#/quiz/theory">📚 GTO 理論測驗</a></td>
            <td>理論題累計 50 題準確率 <strong>≥ 85%</strong></td>
          </tr>
          <tr>
            <td><strong>三、翻前策略</strong></td>
            <td>開池、面對開池、3-Bet / 4-Bet 攻防</td>
            <td><a href="#/learn/preflop-rfi">RFI 開池</a>、<a href="#/learn/preflop-vs-open">面對開池</a>、<a href="#/learn/preflop-vs-3bet">面對 3-Bet</a>、<a href="#/learn/preflop-4bet">4-Bet</a></td>
            <td><a href="#/ranges/rfi_utg">📊 範圍表</a> · <a href="#/quiz/paint">🎨 範圍填色</a> · <a href="#/quiz/preflop">🃏 翻前決策</a></td>
            <td>5 個開池位置填色 <strong>≥ 90%</strong>；面對開池 / 被 3-Bet 連續 30 題 <strong>≥ 85%</strong></td>
          </tr>
          <tr>
            <td><strong>四、翻後策略</strong></td>
            <td>牌面結構、C-Bet、尺度、SPR、防守</td>
            <td><a href="#/learn/board-texture">牌面結構</a>、<a href="#/learn/cbet">C-Bet</a>、<a href="#/learn/spr">SPR</a>、<a href="#/learn/defense-postflop">翻後防守</a></td>
            <td><a href="#/quiz/texture">🧩 牌面判讀</a> · <a href="#/quiz/spots">🌊 翻後情境</a> · <a href="#/quiz/equity">🎲 勝率直覺</a></td>
            <td>翻後情境題準確率 <strong>≥ 80%</strong></td>
          </tr>
          <tr>
            <td><strong>五、實戰與進階</strong></td>
            <td>剝削、多人底池、資金管理與覆盤</td>
            <td><a href="#/learn/exploit">GTO 與剝削</a>、<a href="#/learn/multiway">多人底池</a>、<a href="#/learn/bankroll-mindset">資金管理</a></td>
            <td><a href="#/quiz/mix">⚡ 綜合特訓</a> · <a href="#/quiz/terms">🔤 術語快問快答</a></td>
            <td>清空 <a href="#/stats">📈 錯題本</a> 中的高頻錯題</td>
          </tr>
        </tbody>
      </table>
      <div class="callout tip">
        <b>實戰小技巧</b>
        不知道每天要學什麼？直接跟著 <a href="#/learn?view=plan">📅 30 天計畫</a> 走，每天一個主題、一組練習。
      </div>

      <h3>2. 每日 30 分鐘練習菜單</h3>
      <ol class="steps">
        <li><b>前 5 分鐘：範圍記憶喚醒</b>打開 <a href="#/quiz/paint">🎨 範圍填色挑戰</a>，隨機抽 1 個開池位置 + 1 個被 3-Bet 情境默寫塗色。</li>
        <li><b>10 分鐘：翻前秒決策</b>進入 <a href="#/quiz/preflop">🃏 翻前決策練習</a>，連續刷 25 題，特別注意邊緣手牌。</li>
        <li><b>10 分鐘：讀一節課 + 做該課測驗</b>例如讀完 <a href="#/learn/mdf-alpha">MDF 與 Alpha</a> 立刻做 <a href="#/quiz/theory?topic=mdf-alpha">這一課的題目</a>。</li>
        <li><b>最後 5 分鐘：錯題複習</b>到 <a href="#/stats">📈 學習統計與錯題本</a> 重做當日答錯的題目。</li>
      </ol>

      <h3>3. 打完牌怎麼覆盤？</h3>
      <ol class="steps">
        <li><b>只挑 2–3 手「當下不確定」的牌</b>不要只看輸最多的牌，而是挑你猶豫最久的決策。</li>
        <li><b>先寫下你當時的理由</b>對手範圍是什麼？底池賠率多少？SPR 多少？</li>
        <li><b>對照本站工具</b>用範圍表檢查翻前、用計算機算賠率，再回到相關課程找答案。</li>
        <li><b>把結論變成一句規則</b>例如「OOP 被 BTN 3-Bet 時，KJo 直接棄牌」，下次上桌只專心執行這一條。</li>
      </ol>

      <h3>4. 常見錯誤</h3>
      <div class="callout warn">
        <b>常見錯誤</b>
        • <strong>跳過新手村直接學 Solver</strong>：連牌型與底池賠率都不熟，GTO 觀念只會變成背不起來的數字。<br>
        • <strong>只讀不練</strong>：讀完課程不做題，上桌時根本想不起來。<br>
        • <strong>用短期輸贏評估學習成效</strong>：幾千手的結果幾乎都是運氣，請看測驗準確率與決策品質。
      </div>
    `
  }
]);

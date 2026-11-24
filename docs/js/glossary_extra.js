/* GTO 撲克學院 — glossary_extra.js：補充術語
 * 依 CONTENT_GUIDE.md 第 9 節格式撰寫；id 不與 glossary.js 重複。
 * 參考：GTO Wizard、Upswing Poker、PokerCoaching、PokerNews、ThinkGTO、PokerSkill、Wikipedia 等（以自己的話整理）。
 * 文中機率與勝率皆以 node 實際列舉驗算（例如 7 張牌牌型機率、指定手牌勝率）。
 */
window.GTO = window.GTO || {};
GTO.GLOSSARY_EXTRA = GTO.GLOSSARY_EXTRA || [];

// ---------------------------------------------------------------------------
// 1. 一手牌的流程與基本動作（basic / action）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'hole-cards', term: 'Hole Cards', zh: '底牌（手牌）', aka: ['手牌', '口袋牌', 'Pocket Cards'],
    cat: 'basic', imp: 3,
    short: '每位玩家各自拿到、只有自己看得到的兩張面朝下的牌',
    def: '德州撲克每人發 <strong>2 張底牌</strong>，搭配 5 張公共牌，從 7 張中選出最好的 5 張比大小；底牌可以用上 2 張、1 張，甚至 0 張（全用公共牌）。52 張牌任取 2 張共有 <strong>1,326 種組合</strong>，歸納成 169 種起手牌型。',
    ex: '你的底牌是 <span class="cards">AhKh</span>，牌桌上習慣寫成 <span class="hand">AKs</span>（同花 AK）。',
    rel: ['community-cards', 'combos', 'suited', 'pocket-pair'] },

  { id: 'community-cards', term: 'Community Cards / Board', zh: '公共牌（牌面）', aka: ['公牌', 'Board', '牌面'],
    cat: 'basic', imp: 3,
    short: '發在桌子中央、所有玩家共用的 5 張面朝上的牌',
    def: '公共牌分三次發出：<strong>翻牌 3 張 → 轉牌 1 張 → 河牌 1 張</strong>，合稱「牌面（Board）」。每位玩家都用自己的 2 張底牌加上這 5 張公共牌組成最佳 5 張牌型，所以讀懂牌面結構是所有翻後策略的起點。',
    ex: '牌面 <span class="cards">Ks9s4d7c2h</span>：拿 <span class="cards">AsQs</span> 的人什麼都沒中（只有 A 高），拿 <span class="cards">Kd9c</span> 的人則是兩對。',
    rel: ['hole-cards', 'flop', 'turn', 'river', 'dry-board'] },

  { id: 'preflop', term: 'Preflop', zh: '翻牌前（翻前）', aka: ['翻前', 'Pre-flop', 'PF'],
    cat: 'basic', imp: 3,
    short: '發完兩張底牌、還沒發任何公共牌之前的第一輪下注',
    def: '翻前由大盲左手邊的槍口位（UTG）先行動，<strong>大盲位最後行動</strong>，可以棄牌、跟注或加注。開池範圍、3-Bet、盲注防守等翻前決策，是 GTO 知識中最能「背起來」的部分，也是新手最該先打好的基礎。',
    ex: '6 人桌 100bb：前面全部棄牌，你在 BTN 拿 <span class="hand">KJo</span>，標準做法是開池加注到 2.5bb。',
    rel: ['rfi', '3bet', 'flop', 'street'] },

  { id: 'flop', term: 'Flop', zh: '翻牌（翻牌圈）', aka: ['翻牌圈', 'Flop Round'],
    cat: 'basic', imp: 3,
    short: '一次翻開前 3 張公共牌，以及隨後進行的第二輪下注',
    def: '從翻牌開始，<strong>行動順序改為從小盲起依序行動、BTN 最後</strong>。看到 3 張公共牌時，你的 7 張牌已確定 5 張，是判斷牌力、聽牌與範圍優勢的關鍵時刻。Solver 研究常以 <strong>1,755 種策略上不同的翻牌</strong>為單位做整體統計。',
    ex: '翻牌 <span class="cards">Ah7d2c</span> 是 A 高乾燥面，通常對翻前加注者有利。',
    rel: ['community-cards', 'turn', 'cbet', 'aggregated-report'] },

  { id: 'turn', term: 'Turn', zh: '轉牌（轉牌圈）', aka: ['轉牌圈', '第四街', 'Fourth Street'],
    cat: 'basic', imp: 3,
    short: '翻牌圈下注結束後發出的第 4 張公共牌，以及隨後的第三輪下注',
    def: '到了轉牌，底池通常已經變大，下注金額跟著放大。聽牌只剩河牌一張機會，<strong>勝率 ≈ Outs × 2%</strong>。要不要開第二槍（Double Barrel），關鍵在於這張轉牌讓誰的範圍變強。',
    ex: '翻牌 <span class="cards">Ks8s3d</span>，轉牌 <span class="cards">As</span> 同時是高張與第三張黑桃，雙方範圍的強弱會大洗牌。',
    rel: ['flop', 'river', 'barrel', 'rule-2-4', 'scare-card'] },

  { id: 'river', term: 'River', zh: '河牌（河牌圈）', aka: ['河牌圈', '第五街', 'Fifth Street'],
    cat: 'basic', imp: 3,
    short: '最後一張（第 5 張）公共牌，以及隨後的最後一輪下注',
    def: '河牌之後不會再有新牌，<strong>聽牌不是成了就是失敗</strong>，牌力完全確定。所以河牌是最「純數學」的一條街：下注方的詐唬比例、防守方的 MDF 與抓詐牌選擇，都最貼近理論公式。',
    ex: '河牌完成了同花，對手下注 1 倍底池：你需要至少 33.3% 勝率，跟注抓詐才不虧。',
    rel: ['turn', 'showdown', 'bluff-catcher', 'mdf'] },

  { id: 'street', term: 'Street', zh: '下注輪（一條街）', aka: ['街', '下注圈', 'Betting Round'],
    cat: 'basic', imp: 2,
    short: '每發一次牌後的一整輪下注，一手牌共有翻前、翻牌、轉牌、河牌四條街',
    def: '「打三條街價值」指翻牌、轉牌、河牌都下注拿價值；「少拿一條街」則是某條街過牌，讓對手免費看牌或少付錢。籌碼越深，可以下注的街就越重要；<strong>SPR 與幾何下注</strong>就是在規劃剩下幾條街要怎麼把籌碼放進底池。',
    ex: '拿 <span class="hand">AA</span> 在 <span class="cards">Kd7s2c</span> 想打三條街：翻牌 33%、轉牌 75%、河牌全下。',
    rel: ['preflop', 'flop', 'turn', 'river', 'geometric-sizing'] },

  { id: 'showdown', term: 'Showdown', zh: '攤牌（比牌）', aka: ['亮牌', 'SD'],
    cat: 'basic', imp: 3,
    short: '河牌下注結束後仍有兩人以上時，亮出底牌比大小決定贏家',
    def: '河牌圈有人下注時，由<strong>最後一個下注或加注的人先亮牌</strong>；若河牌大家都過牌，則由按鈕左邊第一位仍在局中的玩家先亮。輸家可以不亮直接蓋牌（Muck）。「多常走到攤牌、攤牌贏多少」也是 HUD 的重要指標。',
    ex: '河牌你下注、對手跟注：你要先亮牌；對手看到自己輸了，可以直接把牌蓋掉不給看。',
    rel: ['river', 'muck', 'wtsd', 'showdown-value'] },

  { id: 'fold', term: 'Fold', zh: '棄牌（蓋牌）', aka: ['蓋牌', '丟牌'],
    cat: 'action', imp: 3,
    short: '放棄這手牌與底池的一切權利，之前投入的籌碼也一併放棄',
    def: '面對下注、覺得繼續不划算時就棄牌；<strong>已經投入的籌碼不再屬於你</strong>，只該看「現在跟注划不划算」。前面沒人下注時可以免費過牌，就不該棄牌。棄牌是最被新手低估的動作：好玩家的 EV 有很大一部分來自「不在爛牌上浪費錢」。',
    ex: 'UTG 開池，你在 CO 拿 <span class="hand">K9o</span>，正確選擇通常是直接棄牌。',
    rel: ['check', 'call', 'sunk-cost', 'mdf'] },

  { id: 'check', term: 'Check', zh: '過牌（看牌）', aka: ['看牌', '讓牌', 'X'],
    cat: 'action', imp: 3,
    short: '本輪還沒有人下注時，不放籌碼、把行動權交給下一位',
    def: '只有在<strong>前面沒有任何下注</strong>時才能過牌；所有人都過牌就直接發下一張牌。手牌紀錄常用 X 代表過牌（XR = 過牌加注）。過牌不等於示弱：GTO 會在過牌範圍裡保留一些強牌，避免被對手看穿。',
    ex: '翻牌 <span class="cards">Jh8h4c</span>，你在大盲先行動，可以先過牌，看翻前加注者怎麼做。',
    rel: ['bet', 'check-raise', 'check-call', 'check-back'] },

  { id: 'bet', term: 'Bet', zh: '下注', aka: ['開注', 'B'],
    cat: 'action', imp: 3,
    short: '某一輪第一個主動把籌碼放進底池，逼其他人回應的動作',
    def: '下注逼其他玩家選擇跟注、加注或棄牌，大小常用「佔底池百分比」描述，例如 33% 底池、75% 底池或超池。下注只有兩個好理由：<strong>拿價值</strong>（讓更差的牌跟注）或<strong>詐唬</strong>（讓更好的牌棄牌），兩者都做不到的下注多半是在浪費籌碼。',
    ex: '底池 10bb，你下注 3.3bb，就是約 1/3 底池的小注。',
    rel: ['raise', 'value-bet', 'pure-bluff', 'overbet'] },

  { id: 'call', term: 'Call', zh: '跟注', aka: ['平跟', 'C'],
    cat: 'action', imp: 3,
    short: '投入與對手相同的金額，不加碼、繼續留在這手牌中',
    def: '跟注不會奪走主動權，只是付錢看下一張牌或攤牌。能不能跟注的核心是<strong>底池賠率</strong>：必要勝率 = 跟注額 ÷（原底池 + 對手下注 + 跟注額）。翻前直接跟注別人的加注叫冷跟（Cold Call），跟在其他跟注者後面叫超跟（Overcall）。',
    ex: '底池 10bb，對手下注 5bb：你跟 5bb 需要 5 ÷ 20 = 25% 勝率。',
    rel: ['pot-odds', 'cold-call', 'overcall', 'raise'] },

  { id: 'raise', term: 'Raise', zh: '加注', aka: ['加碼', 'R'],
    cat: 'action', imp: 3,
    short: '在別人已經下注之後，投入比對方更多的籌碼',
    def: '無限注中，加注的<strong>增加幅度至少要等於前一次下注或加注的幅度</strong>，上限是自己全部籌碼。翻前第一次加注叫開池（RFI），之後依序是 3-Bet、4-Bet、5-Bet。加注能拿價值、逼棄牌，也能奪回主動權。',
    ex: '對手翻牌下注 10bb，你加注到 30bb（增加 20bb）；他若想再加注，至少要加到 50bb。',
    rel: ['min-raise', '3bet', 'check-raise', 'rfi'] },

  { id: 'min-raise', term: 'Min-Raise', zh: '最小加注', aka: ['Min-click', 'Min Raise', '點擊加注'],
    cat: 'action', imp: 2,
    short: '用規則允許的最小金額加注，也就是再加上與前一次相同的增量',
    def: '計算方式：<strong>新的總額 = 目前最高下注 + 上一次加注的增量</strong>。翻前大盲 1bb、對手開到 2.5bb（增量 1.5bb），最小 3-Bet 就是 4bb。最小加注給對手很好的賠率，但在錦標賽中短碼用 2bb 開池非常常見。',
    ex: '錦標賽籌碼 25bb 時，BTN 常用 2bb 最小加注開池，被 3-Bet 全下時損失較小。',
    rel: ['raise', '3bet', 'rfi'] },

  { id: 'check-call', term: 'Check-Call', zh: '過牌跟注', aka: ['X/C', '過跟'],
    cat: 'action', imp: 2,
    short: '先過牌，等對手下注之後再跟注，是沒位置時最常見的防守路線',
    def: '沒位置一方最常見的防守路線，適合<strong>中等牌力與聽牌</strong>：不夠強到想加注、又不想棄掉。缺點是讓對手繼續掌握主動權；如果你的過牌跟注範圍裡完全沒有強牌，對手就能連續開槍施壓。',
    ex: '大盲拿 <span class="cards">Td9d</span> 在 <span class="cards">Js6d2c</span> 面對 33% C-Bet：過牌跟注，帶著後門同花與後門順子繼續。',
    rel: ['check', 'call', 'check-raise', 'capped-range'] },

  { id: 'check-back', term: 'Check Back', zh: '過牌帶過（後位過牌）', aka: ['Check Behind', '帶過', '控池過牌'],
    cat: 'action', imp: 2,
    short: '有位置的玩家在對手過牌後也選擇過牌，直接進入下一張牌',
    def: '後位過牌可以<strong>免費實現權益、控制底池</strong>，也能保護自己的過牌範圍。常見用途：中等牌不想被過牌加注、空氣牌放棄詐唬，或強牌刻意慢打。你轉牌過牌帶過後，對手常在河牌用刺探下注（Probe）搶先出擊。',
    ex: '你在 BTN 拿 <span class="cards">QsJs</span>，在 <span class="cards">Kd7c3h</span> 被大盲過牌，選擇過牌帶過看免費轉牌。',
    rel: ['check', 'pot-control', 'probe-bet', 'delayed-cbet'] },

  { id: 'bet-fold', term: 'Bet-Fold', zh: '下注後棄牌', aka: ['B/F', '打了就跑'],
    cat: 'action', imp: 2,
    short: '先下注，但如果被對手加注就棄牌的行動計畫',
    def: '適合「想拿薄價值或保護，但被加注時大多落後」的中等牌，以及<strong>純詐唬被加注</strong>的情況。相對的計畫是 Bet-Call（被加注會跟）與 Bet-3Bet（被加注再加注）。下注前先想好被加注怎麼辦，是避免臨場慌亂的好習慣。',
    ex: '河牌拿 <span class="hand">AJ</span> 頂對，在 <span class="cards">Jh8c4s2d6c</span> 下 1/3 底池薄價值，被加注就棄牌。',
    rel: ['bet', 'thin-value', 'raise'] },

  { id: 'overcall', term: 'Overcall', zh: '超跟（跟在跟注者之後）', aka: ['Over-call', '跟風跟注'],
    cat: 'action', imp: 1,
    short: '前面已有人下注、也已有人跟注之後，你再選擇跟注',
    def: '超跟時至少已有兩位對手對這手牌有興趣，<strong>底池賠率變好，但你的牌要更強或更有堅果潛力</strong>，因為後面還可能有人加注。翻前常見於大盲面對「開池 + 跟注」；翻後超跟則要留意被夾在中間遭到擠壓。',
    ex: 'CO 開池 2.5bb、BTN 跟注，你在大盲拿 <span class="hand">76s</span>：只要再付 1.5bb 就能看翻牌，底池共 8bb，必要勝率約 19%。',
    rel: ['call', 'cold-call', 'squeeze', 'multiway-pot'] },

  { id: 'overlimp', term: 'Overlimp', zh: '跟著溜入', aka: ['Limp Behind', '跟溜'],
    cat: 'action', imp: 1,
    short: '前面已有人只跟大盲溜入時，你也只跟大盲進池',
    def: '現場低級別很常見：前面有人溜入時，用小對子、同花連張等投機牌便宜看翻牌。缺點是放棄主動權、邀請更多人入池，後面的玩家還能加注<strong>隔離</strong>你。面對較弱的溜入者，多數情況「隔離加注」比跟著溜入賺更多。',
    ex: 'UTG 溜入，你在 CO 拿 <span class="hand">55</span>，現場桌選擇跟溜，用便宜的價格挖三條。',
    rel: ['open-limp', 'iso-raise', 'set-mining', 'limp-raise'] },

  { id: 'limp-raise', term: 'Limp-Raise', zh: '溜入再加注', aka: ['Limp-Reraise', 'Limp-Re', '溜後加注'],
    cat: 'action', imp: 1,
    short: '翻前先只跟大盲溜入，等後面有人加注時再大幅加注',
    def: '傳統上是拿 <span class="hand">AA</span>、<span class="hand">KK</span> 設陷阱的招數，但在低級別這條路線幾乎<strong>只代表超強牌</strong>，很容易被看穿。現代 6 人桌現金局的 GTO 策略幾乎不溜入，所以這招多半出現在現場局或錦標賽的小盲溜入策略中。',
    ex: '現場 1/2 桌，UTG 溜入、BTN 加到 $12，UTG 突然再加到 $45——多半是 <span class="hand">QQ</span> 以上。',
    rel: ['open-limp', 'overlimp', 'slowplay'] },

  { id: '4bet-bluff', term: '4-Bet Bluff', zh: '4-Bet 詐唬', aka: ['Light 4-Bet', '輕 4-Bet'],
    cat: 'action', imp: 2,
    short: '用不打算跟注 5-Bet 全下的牌進行 4-Bet，目的是逼對手棄掉 3-Bet',
    def: '最佳候選是 <span class="hand">A5s</span>、<span class="hand">A4s</span> 這類同花小 A：手上的 A <strong>阻擋對手的 AA、AK</strong>，被跟注時還有同花與輪子順潛力。100bb 下 4-Bet 到約 20–23bb，面對 5-Bet 全下就直接棄牌，損失可控。',
    ex: '你在 CO 開池 2.5bb，BTN 3-Bet 到 7.5bb，你拿 <span class="hand">A5s</span> 4-Bet 到 21bb；BTN 若全下就棄牌。',
    rel: ['4bet', '5bet', 'blocker', 'suited'] },

  { id: 'complete', term: 'Complete', zh: '小盲補齊（小盲溜入）', aka: ['SB Limp', '補盲', '補齊大盲'],
    cat: 'action', imp: 1,
    short: '前面全部棄牌時，小盲只補到一個大盲的金額而不加注',
    def: '小盲已放 0.5bb，再補 0.5bb 就能看翻牌，賠率很好，但翻後全程沒位置。本站基準採 SB <strong>只加注或棄牌（Raise-or-Fold）</strong>的簡化策略；不過部分 Solver 解與線上高手會在盲注大戰中混用補齊策略，拿大量中等牌便宜看翻牌。',
    ex: '前面全部棄牌，你在 SB 拿 <span class="hand">T7s</span>：簡化策略是加注到 3bb 或棄牌，而不是補 0.5bb 溜入。',
    rel: ['sb', 'bvb', 'open-limp', 'raise-or-fold'] },

  { id: 'line', term: 'Line', zh: '路線（打法路線）', aka: ['Betting Line', '行動路線', '下注路線'],
    cat: 'strategy', imp: 2,
    short: '一手牌中每條街選擇的動作組合，例如翻牌下注、轉牌過牌、河牌下注',
    def: '討論手牌時常說「這條路線合不合理」。好的路線要回答：<strong>我想讓哪些更差的牌跟注、哪些更好的牌棄牌？</strong>也要想想這條路線代表什麼範圍、故事可不可信。手牌紀錄常用縮寫：B 下注、X 過牌、C 跟注、R 加注，例如 B/X/B。',
    ex: '翻牌 C-Bet、轉牌過牌、河牌下注（B/X/B）：常用在中等牌想拿兩條街價值，或轉牌放棄後河牌再詐唬。',
    rel: ['represent', 'barrel', 'delayed-cbet', 'range'] }
);

// ---------------------------------------------------------------------------
// 2. 牌型與手牌類別（hand）— 7 張牌牌型機率以 node 完整列舉 133,784,560 種組合驗算
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'high-card', term: 'High Card', zh: '高牌（散牌）', aka: ['散牌', 'No Pair', '無對'],
    cat: 'hand', imp: 3,
    short: '連一對都沒有，只能用最大的單張來比大小的牌型',
    def: '10 種牌型中最小的一種，7 張牌最後只有高牌的機率約 <strong>17.4%</strong>。比大小時先比最大張，相同再依序比第 2、3、4、5 張。<strong>A 高</strong>在單挑底池的河牌常是不錯的抓詐牌，但在多人底池幾乎沒有攤牌價值。',
    ex: '你 <span class="cards">AhQd</span>、對手 <span class="cards">AsJc</span>，牌面 <span class="cards">9s7d4c3h2s</span>：都是 A 高，比到第二張 Q 大於 J，你贏。',
    rel: ['one-pair', 'kicker', 'showdown-value'] },

  { id: 'one-pair', term: 'One Pair', zh: '一對', aka: ['對子', 'Pair'],
    cat: 'hand', imp: 3,
    short: '兩張同點數的牌加上三張散牌，是 7 張牌最常出現的牌型',
    def: '7 張牌湊出一對的機率約 <strong>43.8%</strong>，是最常見的牌型。依相對牌面的位置可分成<strong>超對、頂對、中對、底對、低對</strong>；同樣一對時先比對子大小，再依序比三張踢腳。一對在單挑底池很有價值，但在多人底池或深籌碼時常淪為抓詐牌。',
    ex: '你 <span class="cards">KhQh</span>，翻牌 <span class="cards">Kd8s5c</span>：中了一對 K（頂對），踢腳是 Q。',
    rel: ['pocket-pair', 'top-pair', 'second-pair', 'two-pair'] },

  { id: 'two-pair', term: 'Two Pair', zh: '兩對', aka: ['二對'],
    cat: 'hand', imp: 3,
    short: '兩組不同點數的對子再加一張踢腳，7 張牌約有 23.5% 會出現',
    def: '7 張牌出現兩對的機率約 <strong>23.5%</strong>。比大小先比大對、再比小對、最後比踢腳。要注意公共牌上的對子：如果其中一對來自牌面，所有人都共享它，實際價值常沒有看起來高，還可能被<strong>稀釋（Counterfeit）</strong>。',
    ex: '你 <span class="cards">Kc9c</span>，翻牌 <span class="cards">Kd9h4s</span>：頂兩對（K 與 9），在乾燥牌面非常強。',
    rel: ['one-pair', 'counterfeit', 'set', 'full-house'] },

  { id: 'straight', term: 'Straight', zh: '順子', aka: ['順', '連順'],
    cat: 'hand', imp: 3,
    short: '五張點數連續、花色不限的牌，A 可以當最大或最小的一張',
    def: '7 張牌湊成順子的機率約 <strong>4.62%</strong>。A 可以當最大（<strong>T-J-Q-K-A</strong>，又稱百老匯順），也可以當最小（<strong>A-2-3-4-5</strong>，輪子順），但不能繞圈：Q-K-A-2-3 不算順子。兩人都有順子時比最大的那張。',
    ex: '你 <span class="cards">9s8s</span>，翻牌 <span class="cards">Td7c6h</span>：直接成順（6-7-8-9-T）。',
    rel: ['wheel', 'draw', 'flush', 'broadway'] },

  { id: 'flush', term: 'Flush', zh: '同花', aka: ['花', '同花色'],
    cat: 'hand', imp: 3,
    short: '五張同一花色、但點數不連續的牌，比順子大、比葫蘆小',
    def: '7 張牌湊成同花的機率約 <strong>3.03%</strong>，比順子大、比葫蘆小。兩人都有同花時從最大張開始比，所以 <strong>A 高同花（堅果同花）</strong>最安全。牌面出現 3 張同花色時就可能有人成花；出現 4 張同花色時，只要手上有 1 張該花色就成花。',
    ex: '牌面 <span class="cards">Ks9s4s2d7h</span>：你 <span class="cards">Qs3s</span> 是 K 高同花，但對手 <span class="cards">As5s</span> 的 A 高同花更大。',
    rel: ['nuts', 'nfd', 'rainbow', 'full-house'] },

  { id: 'full-house', term: 'Full House', zh: '葫蘆', aka: ['Boat', 'Full Boat', '三帶二'],
    cat: 'hand', imp: 3,
    short: '三張同點數再加上一對，例如三張 10 帶兩張 J',
    def: '7 張牌湊成葫蘆的機率約 <strong>2.60%</strong>，比同花（3.03%）稀有，所以葫蘆比同花大。兩人都有葫蘆時先比三條的點數，再比對子。只有<strong>牌面成對</strong>時才可能有人拿到葫蘆，所以成對牌面上的同花、順子都要提高警覺。',
    ex: '你 <span class="cards">9h9d</span>，牌面 <span class="cards">9s5c5h</span>：你有 9 帶 5 的葫蘆；但若對手拿 <span class="hand">55</span>，他就是鐵支。',
    rel: ['flush', 'quads', 'paired-board', 'set'] },

  { id: 'quads', term: 'Four of a Kind (Quads)', zh: '四條（鐵支）', aka: ['鐵支', 'Quads', '炸彈'],
    cat: 'hand', imp: 2,
    short: '四張同點數的牌加上一張踢腳，台灣俗稱「鐵支」',
    def: '7 張牌湊出四條的機率只有約 <strong>0.168%</strong>（約每 595 次一次），只輸給同花順。若四條全在公共牌上，就比第 5 張踢腳。經典冤家牌之一就是「葫蘆撞鐵支」，兩邊都很難棄牌。',
    ex: '你 <span class="cards">7s7h</span>，翻牌 <span class="cards">7d7cKs</span>：翻牌就是鐵支，對手拿 <span class="hand">KK</span> 的葫蘆會輸光。',
    rel: ['full-house', 'straight-flush', 'cooler', 'slowplay'] },

  { id: 'straight-flush', term: 'Straight Flush', zh: '同花順', aka: ['同花順子'],
    cat: 'hand', imp: 2,
    short: '五張同一花色而且點數連續的牌，只輸給更大的同花順',
    def: '7 張牌湊成同花順（不含皇家）的機率約 <strong>0.0279%</strong>。比大小看最大那張：最小是 <span class="cards">5h4h3h2hAh</span>（輪子同花順），最大則是 A 高的皇家同花順。同花順只會輸給更大的同花順。',
    ex: '你 <span class="cards">8d7d</span>，牌面 <span class="cards">9d6d5dKs2c</span>：5-6-7-8-9 方塊同花順。',
    rel: ['royal-flush', 'flush', 'straight'] },

  { id: 'royal-flush', term: 'Royal Flush', zh: '皇家同花順', aka: ['同花大順', 'Royal'],
    cat: 'hand', imp: 2,
    short: '同一花色的 A、K、Q、J、10，德州撲克最大的牌型',
    def: '7 張牌湊成皇家同花順的機率約 <strong>0.0032%</strong>（約每 30,940 次一次）。它其實就是 A 高的同花順，所以<strong>沒有任何牌型能贏它</strong>；兩人同時擁有只可能是五張都在公共牌上，結果就是平分底池。',
    ex: '牌面 <span class="cards">AsKsQsJs2d</span>：誰手上有 <span class="cards">Ts</span>，誰就是皇家同花順。',
    rel: ['straight-flush', 'nuts', 'flush'] },

  { id: 'underpair', term: 'Underpair', zh: '低對（低於牌面的口袋對）', aka: ['Under Pair', '小口袋對'],
    cat: 'hand', imp: 2,
    short: '口袋對子比牌面上每一張公共牌都小，例如 66 在 K-9-8 的牌面',
    def: '與超對（Overpair）相反。低對仍有攤牌價值，可以抓詐或便宜看牌，但面對下注要小心：<strong>對手任何一張牌中對都贏你</strong>，想改進通常只能靠 2 張 Outs 中暗三條（翻牌到河牌約 8.4%）。',
    ex: '你 <span class="cards">6s6h</span>，翻牌 <span class="cards">Ks9d8c</span>：面對 <span class="hand">AQ</span> 仍領先約 72%，但被連續大注施壓時很難繼續。',
    rel: ['overpair', 'pocket-pair', 'set-mining', 'bluff-catcher'] },

  { id: 'overcards', term: 'Overcards', zh: '高張（兩張高牌）', aka: ['Overs', '兩高張'],
    cat: 'hand', imp: 2,
    short: '手上兩張牌都比牌面最大的公共牌還大，但還沒有成對',
    def: '兩張高張大約有 <strong>6 張 Outs</strong>（各有 3 張能配成頂對），翻牌到河牌約 24%。翻前「對子 vs 兩張高張」就是經典的擲硬幣局。實戰中兩張高張常搭配後門聽牌一起半詐唬，但要記得：中了頂對也不一定贏。',
    ex: '你 <span class="cards">AhKd</span>，翻牌 <span class="cards">7s4c2d</span>，對手 <span class="hand">99</span>：你只剩約 25.6% 勝率。',
    rel: ['outs', 'coin-flip', 'rule-2-4', 'backdoor'] },

  { id: 'counterfeit', term: 'Counterfeit', zh: '被公共牌稀釋（假兩對）', aka: ['Counterfeited', '被稀釋', '牌被做掉'],
    cat: 'hand', imp: 2,
    short: '後續公共牌讓你原本的牌型失去作用，牌力瞬間下降',
    def: '最常見的是兩對被「蓋過」：牌面出現更大的對子時，你手上的小對子不再算進最佳 5 張。例如你用 7、6 組成兩對，若轉牌、河牌連出兩張 K，最佳牌型變成 <strong>K 對 + 7 對 + 6 踢腳</strong>，任何有 K、或 7 帶更大踢腳的人都能贏你。',
    ex: '你 <span class="cards">7h6h</span>，翻牌 <span class="cards">7c6d2s</span> 是兩對；轉河跑出 <span class="cards">KsKd</span> 後，對手 <span class="cards">Ac7d</span> 反而贏你。',
    rel: ['two-pair', 'paired-board', 'kicker'] },

  { id: 'air', term: 'Air', zh: '空氣牌', aka: ['空氣', '完全沒中', 'Nothing'],
    cat: 'hand', imp: 2,
    short: '沒有成牌、也沒有像樣聽牌，攤牌幾乎不可能贏的牌',
    def: '空氣牌的<strong>攤牌價值接近 0</strong>，只有兩個選擇：放棄，或拿來詐唬。GTO 河牌的詐唬牌主要就來自空氣牌與失敗的聽牌；挑選時會優先選「阻擋對手跟注範圍、但不阻擋對手棄牌範圍」的組合。',
    ex: '你 <span class="cards">6s5s</span>，河牌後牌面 <span class="cards">AhKd9c3h2c</span>：完全沒中，只剩詐唬或放棄兩個選項。',
    rel: ['pure-bluff', 'showdown-value', 'blocker', 'semi-bluff'] },

  { id: 'nfd', term: 'Nut Flush Draw (NFD)', zh: '堅果同花聽牌', aka: ['NFD', 'A 花聽牌', '堅果花聽'],
    cat: 'hand', imp: 2,
    short: '再一張就能成最大同花的同花聽牌，通常是手握該花色的 A',
    def: '同花聽牌有 <strong>9 張 Outs</strong>（翻牌到河牌約 35%）；堅果同花聽牌中了就是最大同花，不怕撞上更大的同花，加上 A 本身可能配成頂對，是最好的<strong>半詐唬</strong>與過牌加注候選。多人底池聽花時，盡量只追堅果同花。',
    ex: '你 <span class="cards">AsKs</span>，翻牌 <span class="cards">Qs7s2d</span>，對手 <span class="hand">JJ</span>：堅果花聽加兩張高張約 15 張 Outs，勝率約 54%。',
    rel: ['draw', 'nuts', 'semi-bluff', 'combo-draw'] },

  { id: 'redraw', term: 'Redraw', zh: '再改進（反超聽牌）', aka: ['Re-draw', '二次聽牌'],
    cat: 'hand', imp: 1,
    short: '目前落後或平手時，還有機會再中一張牌變成更大的牌型',
    def: '典型例子是「暗三條撞上已成的順子或同花」：牌面只要成對，暗三條就升級成葫蘆或鐵支。<strong>有 Redraw 的牌比看起來強</strong>，全下前要把這些 Outs 算進去；反過來，自己成順時若對手可能有 Redraw，也要提防反向隱含賠率。',
    ex: '你 <span class="cards">9s9d</span>，翻牌 <span class="cards">Tc9h8d</span> 撞上對手 <span class="hand">QJ</span> 已成順：靠轉河讓牌面成對，你仍有約 35% 勝率。',
    rel: ['set', 'full-house', 'outs', 'freeroll'] },

  { id: 'premium-hand', term: 'Premium Hands', zh: '頂級起手牌（大牌）', aka: ['Premiums', '超強起手牌'],
    cat: 'hand', imp: 3,
    short: '翻前最強的一小群起手牌，通常指 QQ 以上與 AK',
    def: '<span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">QQ</span>、<span class="hand">AK</span> 合計 34 個組合，只佔全部 1,326 組合約 <strong>2.6%</strong>，平均約 39 手才拿到一次；單拿 <span class="hand">AA</span> 的機率是 1/221（約 0.45%）。頂級牌要積極加注、3-Bet、4-Bet 建立底池，不要因為怕嚇跑對手而平跟。',
    ex: '有人開池、你拿 <span class="hand">KK</span>：在 100bb 現金局幾乎永遠選擇 3-Bet，而不是平跟。',
    rel: ['3bet', '4bet', 'pocket-pair', 'combos'] },

  { id: 'made-hand', term: 'Made Hand', zh: '成牌', aka: ['已成牌', '有牌'],
    cat: 'hand', imp: 2,
    short: '已經組成一對或以上、現在就能拿去攤牌的牌',
    def: '與「聽牌（Draw）」相對。成牌依強度可粗分為<strong>堅果級、強成牌、中等成牌、弱成牌</strong>：強成牌想拿價值，中等成牌想控池、抓詐，弱成牌則要看對手下注大小決定。同時有成牌與聽牌的，例如頂對加同花聽，常是翻後最舒服的牌。',
    ex: '翻牌 <span class="cards">Jh8h3c</span>：<span class="cards">AcJd</span> 是成牌（頂對頂踢腳），<span class="cards">Qh9h</span> 則是聽牌（同花聽 + 卡順）。',
    rel: ['draw', 'showdown-value', 'top-pair', 'pot-control'] },

  { id: 'play-the-board', term: 'Playing the Board', zh: '打公共牌（用牌面牌型）', aka: ['Play the Board', '用公牌', '全用公共牌'],
    cat: 'basic', imp: 2,
    short: '你的最佳五張牌全部來自公共牌，兩張底牌完全沒用上',
    def: '當牌面本身就組成很強的牌型（順子、葫蘆、同花），而你的底牌無法讓它更好時，你就是在打公共牌；所有同樣「打公共牌」的玩家會<strong>平分底池</strong>。新手常以為手上的 A 可以當第 6 張踢腳，但規則只比最好的 5 張。',
    ex: '牌面 <span class="cards">5s6d7h8c9s</span>：你 <span class="cards">Ac2d</span>、對手 <span class="cards">Kh3c</span> 都用公共順子平分；拿 <span class="cards">Td</span> 的人才會贏。',
    rel: ['kicker', 'community-cards', 'chop', 'straight'] }
);

// ---------------------------------------------------------------------------
// 3. 牌面結構與位置（board / position）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'connected-board', term: 'Connected Board', zh: '連張牌面（連接牌面）', aka: ['Coordinated Board', '連牌面', '順子面'],
    cat: 'board', imp: 2,
    short: '公共牌點數彼此接近，很多起手牌能組成順子或順子聽牌',
    def: '牌面結構有三個維度：<strong>點數連接度</strong>（連張 vs 斷層）、花色（彩虹 / 雙色 / 單色）、是否成對。像 <span class="cards">9h8c7d</span> 這種高度連接面，即使是彩虹面也很「濕」，通常對翻前跟注者（尤其大盲）有利；<span class="cards">Kd7s2c</span> 則是斷層乾燥面。',
    ex: '翻牌 <span class="cards">Ts9s8d</span>：<span class="hand">J7</span>、<span class="hand">QJ</span>、<span class="hand">76</span> 都已經成順，翻前加注者應該降低 C-Bet 頻率。',
    rel: ['dry-board', 'rainbow', 'static-dynamic', 'range-advantage'] },

  { id: 'static-dynamic', term: 'Static vs Dynamic Board', zh: '靜態牌面 vs 動態牌面', aka: ['Static Board', 'Dynamic Board', '靜態面', '動態面'],
    cat: 'board', imp: 2,
    short: '依轉牌、河牌有多容易改變目前領先者，來替牌面分類',
    def: '<strong>靜態牌面</strong>：後續牌很難改變強弱排名（如 <span class="cards">Ah9d6c</span>、<span class="cards">KcKd5s</span>），適合小注高頻、不急著保護；<strong>動態牌面</strong>：轉河牌常讓領先者易主（如 <span class="cards">JhTh8s</span>），要用較大注保護或極化。乾濕看「現在有多少聽牌」，靜動看「之後會不會翻盤」。',
    ex: '<span class="cards">9s6s4d</span> 看起來不算很濕，但許多高張與 5、7、8 都會改變局勢，屬於偏動態的牌面。',
    rel: ['dry-board', 'connected-board', 'protection-bet', 'runout'] },

  { id: 'board-height', term: 'Board Height (High / Middle / Low)', zh: '牌面高低（高牌面 / 中張面 / 低牌面）', aka: ['High Card Board', 'Low Board', 'A 高面', '低張面'],
    cat: 'board', imp: 2,
    short: '依翻牌最大張是 A、K 等大牌還是中低張，判斷牌面對誰有利',
    def: '翻前加注範圍集中在大牌，所以 <strong>A 高、K 高牌面通常對加注者有利</strong>，可以高頻小注；<strong>中低張連接面</strong>（如 <span class="cards">7h6d5c</span>）則讓大盲的同花連張與小對子大量擊中，加注者要多過牌。讀牌面時先看高低，再看連接度與花色。',
    ex: 'BTN 開池、大盲跟注：<span class="cards">Ac8d3s</span> 對 BTN 有利；<span class="cards">6h5h4c</span> 則對大盲有利。',
    rel: ['range-advantage', 'nut-advantage', 'cbet', 'connected-board'] },

  { id: 'runout', term: 'Runout', zh: '後續發牌（轉河牌走勢）', aka: ['Run-out', 'Board Runout', '發牌走勢'],
    cat: 'board', imp: 2,
    short: '翻牌之後陸續發出的轉牌與河牌，以及它們對雙方範圍的影響',
    def: '同一個翻牌可能接上上千種不同的轉河牌。常見分類：<strong>空白磚頭牌</strong>（維持原局勢）、<strong>高張驚悚牌</strong>、<strong>完成聽牌的牌</strong>、<strong>讓牌面成對的牌</strong>。「Runner-Runner」指轉河連中兩張才完成的後門聽牌。規劃連續開槍前，先想清楚哪些 Runout 對你有利。',
    ex: '翻牌 <span class="cards">Ks8s3d</span> 之後跑出 <span class="cards">2c</span>、<span class="cards">4h</span>，是對翻前加注者有利的空白走勢。',
    rel: ['scare-card', 'backdoor', 'barrel', 'static-dynamic'] },

  { id: 'ep-mp-lp', term: 'Early / Middle / Late Position', zh: '前位 / 中位 / 後位', aka: ['EP', 'MP', 'LP', '前段位置', '後段位置'],
    cat: 'position', imp: 2,
    short: '依翻前行動順序，把座位粗分成前、中、後三段',
    def: '9 人滿桌常分：<strong>前位</strong> UTG、UTG+1、UTG+2；<strong>中位</strong> LJ、HJ；<strong>後位</strong> CO、BTN；兩個盲注另外算。6 人桌則 UTG 屬前位、HJ 屬中位、CO 與 BTN 是後位。越晚行動，身後剩下的對手越少、翻後越常有位置，開池範圍就越寬。',
    ex: '本站 6 人桌基準：前位 UTG 開池約 17%，後位 BTN 可以開到約 45%。',
    rel: ['utg', 'hj', 'co', 'btn', 'full-ring'] },

  { id: 'relative-position', term: 'Relative Position', zh: '相對位置', aka: ['相對於加注者的位置'],
    cat: 'position', imp: 1,
    short: '你和主動下注者之間的行動先後，在多人底池中特別重要',
    def: '「絕對位置」看你是不是最後行動；「相對位置」看你和<strong>主動下注者</strong>的先後。多人底池中，若你坐在預期會下注者的右手邊，可以先過牌，等他下注、其他人表態後最後才決定，資訊最多；坐在他左手邊則必須緊接著表態，容易被夾在中間。',
    ex: '三人底池、翻前加注者在 CO：你在 SB 過牌後，能看到 CO 下注與 BTN 的反應才行動，相對位置反而比 BTN 好。',
    rel: ['ip', 'oop', 'multiway-pot', 'check-raise'] }
);

// ---------------------------------------------------------------------------
// 4. GTO 與 Solver 觀念（gto）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'range', term: 'Range', zh: '範圍（手牌範圍）', aka: ['Hand Range', '牌型範圍'],
    cat: 'gto', imp: 3,
    short: '在某個情境下，一位玩家可能持有的所有起手牌組合與比例',
    def: '高手不猜「對手拿什麼牌」，而是想「對手<strong>可能拿哪些牌、各佔多少</strong>」。範圍會隨每個動作縮小：開池範圍 → 跟注 3-Bet 的範圍 → 翻牌跟注的範圍……。同樣地，你也要思考自己整個範圍在這個牌面的表現，而不是只盯著手上兩張牌。',
    ex: 'UTG 開池範圍約 17%（例如 <span class="hand">55+</span>、<span class="hand">A3s+</span>、<span class="hand">ATo+</span>、<span class="hand">KQo</span>…），你拿 <span class="hand">AJo</span> 面對他時要想「他有多少牌比我好」。',
    rel: ['range-advantage', 'polarized-range', 'combos', 'range-grid'] },

  { id: 'range-grid', term: 'Hand Matrix (13×13 Range Chart)', zh: '13×13 範圍表（手牌矩陣）', aka: ['Range Chart', 'Hand Chart', '範圍表', '起手牌表'],
    cat: 'basic', imp: 3,
    short: '把 169 種起手牌排成 13×13 方格，用顏色標示每手牌該怎麼行動',
    def: '對角線是<strong>口袋對子</strong>（13 格，每格 6 組合）；右上半是<strong>同花牌</strong>（78 格，每格 4 組合）；左下半是<strong>非同花牌</strong>（78 格，每格 12 組合）。看表時記得：左下一格的組合數是右上對應格的 3 倍，多加幾格非同花牌，範圍就會迅速變寬。',
    ex: '在<a href="#/ranges">範圍表</a>頁面裡，<span class="hand">AKs</span> 在右上方、<span class="hand">AKo</span> 在左下方，兩格以對角線對稱。',
    rel: ['combos', 'range', 'suited', 'offsuit'] },

  { id: 'balanced-range', term: 'Balance (Balanced Range)', zh: '平衡（平衡範圍）', aka: ['Balanced', 'Unbalanced', '範圍平衡', '不平衡'],
    cat: 'gto', imp: 2,
    short: '同一個行動裡放入適當比例的強牌與詐唬，讓對手無從判斷',
    def: '如果你下大注時只有堅果，對手全棄；只有詐唬，對手全跟——這就是<strong>不平衡</strong>。平衡的範圍會依下注尺度配好價值與詐唬比例（例如河牌 1 倍底池約 2:1），讓對手抓詐牌跟注與棄牌的 EV 相同。平衡是防守工具；面對有明顯漏洞的玩家，可以刻意不平衡去剝削。',
    ex: '河牌下注 1 倍底池：每 2 組價值牌搭配 1 組詐唬，對手跟注抓詐的 EV 剛好是 0。',
    rel: ['value-to-bluff-ratio', 'indifference', 'gto', 'overbluff'] },

  { id: 'cfr', term: 'CFR (Counterfactual Regret Minimization)', zh: '反事實遺憾最小化', aka: ['CFR+', 'MCCFR', '遺憾最小化'],
    cat: 'gto', imp: 1,
    short: '多數 GTO Solver 用來逼近納許均衡的自我對打演算法',
    def: '白話版：電腦和自己對打上百萬次，每次都記下「如果當時改做別的動作，會多賺多少」（<strong>遺憾值</strong>），下一輪就更常選擇遺憾大的動作。反覆更新後，<strong>所有迭代的平均策略</strong>會收斂到納許均衡。CFR+、Monte Carlo CFR、Deep CFR 等改良版讓計算更快。',
    ex: 'PioSolver、GTO Wizard 這類工具在「解算」時，背後就是類似 CFR 的迭代，跑得越久，可剝削度越低。',
    rel: ['solver', 'nash-equilibrium', 'exploitability', 'game-tree'] },

  { id: 'game-tree', term: 'Game Tree', zh: '賽局樹（決策樹）', aka: ['Betting Tree', '下注樹', 'Node', '節點'],
    cat: 'gto', imp: 2,
    short: '把一手牌所有可能的動作與發牌畫成樹狀分支，每個分岔點稱為節點',
    def: 'Solver 只能在你設定的樹裡找答案：允許哪些下注尺度（例如 33%、75%、150%）、可以加注幾次、籌碼多深。<strong>樹越複雜，結果越精細但越難算、越難學</strong>；過度簡化又可能偏離真實情況。每個節點（Node）就是一個決策點。',
    ex: '翻牌只給 BTN 33% 與 75% 兩種下注尺度，大盲面對下注可以棄牌、跟注或加注到 3 倍——這就是一棵簡化的賽局樹。',
    rel: ['solver', 'node-locking', 'abstraction', 'simplification'] },

  { id: 'abstraction', term: 'Abstraction', zh: '抽象化（賽局簡化）', aka: ['Bucketing', 'Action Abstraction', 'Card Abstraction', '分桶'],
    cat: 'gto', imp: 1,
    short: '把龐大的撲克賽局縮小成電腦算得動的版本，例如合併相似手牌或限制尺度',
    def: '完整無限注德州撲克的決策點多到無法直接求解，所以 Solver 與撲克 AI 會做兩種抽象化：<strong>動作抽象</strong>（只允許幾種下注尺度）與<strong>牌的抽象</strong>（把策略相似的手牌放進同一桶）。抽象得越粗，算得越快，但結果離真正的均衡越遠。',
    ex: '早期的撲克 AI 會把大量手牌依強度分成有限個「桶」，同一桶的手牌共用同一套策略。',
    rel: ['game-tree', 'solver', 'cfr', 'simplification'] },

  { id: 'aggregated-report', term: 'Aggregated Report', zh: '整體報告（翻牌聚合報告）', aka: ['Aggregate Report', 'Flop Report', 'CAR', '聚合報告'],
    cat: 'gto', imp: 2,
    short: '把同一情境下所有翻牌的 Solver 結果彙總成表，找出大方向規律',
    def: '與其一個一個研究牌面，聚合報告把 <strong>1,755 種策略上不同的翻牌</strong>（依出現機率加權）的下注頻率、尺度、EV、勝率與 EQR 整理成表格或圖表，並可依牌面高低、花色、連接度分組。最適合用來建立「哪類牌面高頻小注、哪類牌面多過牌」的經驗法則。',
    ex: '看 BTN vs BB 單次加注底池的報告：A 高彩虹面的 C-Bet 頻率普遍很高，低張連接面則明顯過牌較多。',
    rel: ['solver', 'cbet', 'board-height', 'simplification'] },

  { id: 'exploitability', term: 'Exploitability (Nash Distance)', zh: '可剝削度（納許距離）', aka: ['Nash Distance', 'dEV', 'Accuracy', '可被剝削程度'],
    cat: 'gto', imp: 1,
    short: '一套策略最多會被完美針對者贏走多少，數值越低越接近 GTO',
    def: '真正的納許均衡，可剝削度為 <strong>0</strong>。Solver 不會無限計算，而是在可剝削度降到門檻時停止，常以<strong>起始底池的百分比</strong>表示，例如 0.3% 底池。這麼小的誤差人類不可能察覺，但會造成一些「兩個動作 EV 幾乎相同卻混合」的 Solver 雜訊。',
    ex: '底池 5bb、可剝削度 0.2%：代表完美的對手每手最多只能多贏 0.01bb。',
    rel: ['nash-equilibrium', 'solver', 'best-response', 'cfr'] },

  { id: 'simplification', term: 'Strategy Simplification', zh: '策略簡化', aka: ['Simplified Strategy', 'Single Sizing', '簡化策略'],
    cat: 'gto', imp: 2,
    short: '用較少的下注尺度或純策略取代複雜混合，只犧牲很少 EV 換取好執行',
    def: 'Solver 原始解常同時混用 3–4 種尺度與複雜頻率，人類很難照做。研究顯示，把翻牌的多種尺度合併成一個選得好的尺度，<strong>常能保留 99% 以上的 EV</strong>；而「完美但記不住」的策略在實戰中的失誤反而更貴。河牌對尺度較敏感，簡化要更小心。',
    ex: '把 BTN vs BB 多數翻牌的 C-Bet 簡化成只用 33% 一種尺度，EV 損失通常很小，卻大幅降低記憶負擔。',
    rel: ['solver', 'mixed-strategy', 'ev-loss', 'aggregated-report'] },

  { id: 'ev-loss', term: 'EV Loss', zh: 'EV 損失（期望值損失）', aka: ['Blunder', 'Mistake', 'Inaccuracy', '失誤成本'],
    cat: 'gto', imp: 2,
    short: '你的選擇比最佳選擇少賺多少期望值，用來衡量一個決策錯多大',
    def: '計算方式：<strong>最佳動作 EV − 你選的動作 EV</strong>，常以 bb 或底池百分比表示。GTO 練習軟體會依 EV 損失把錯誤分成不精確、錯誤、嚴重失誤。重點不是每手都和 Solver 一模一樣，而是<strong>避免大額 EV 損失</strong>；兩個動作 EV 幾乎相同時選錯，其實無傷大雅。',
    ex: '某手牌下注 EV = +2.1bb、過牌 EV = +2.0bb：選擇過牌只損失 0.1bb，是可以接受的小偏差。',
    rel: ['ev', 'solver', 'simplification', 'mixed-strategy'] },

  { id: 'best-response', term: 'Best Response (MES / Nemesis)', zh: '最佳反應（最大剝削策略）', aka: ['MES', 'Maximally Exploitative Strategy', 'Nemesis', '剋星策略'],
    cat: 'gto', imp: 1,
    short: '已知對手的固定策略時，能從他身上贏最多的那一套反制策略',
    def: '在 Solver 裡把對手的錯誤策略<strong>節點鎖定</strong>，再只讓自己這一方重新計算，就得到最大剝削策略。它通常是極端的純策略，例如對手河牌棄牌太多時「所有空氣牌都詐唬」。代價是自己完全不平衡，對手一調整就會被反剝削，所以實戰多用較溫和的剝削幅度。',
    ex: '對手面對河牌 1 倍底池下注棄牌 80%（理論約 50%）：最佳反應就是把所有能詐唬的牌全拿來下注。',
    rel: ['exploit', 'node-locking', 'exploitability', 'balanced-range'] },

  { id: 'equity-distribution', term: 'Equity Distribution', zh: '勝率分布（權益分布圖）', aka: ['Equity Graph', 'Equity Buckets', 'EQ Distribution', '勝率分桶'],
    cat: 'gto', imp: 2,
    short: '把範圍內每手牌對上對手範圍的勝率由低到高排成曲線，用來看範圍形狀',
    def: '橫軸是範圍內的手牌（由弱到強排序），縱軸是勝率。<strong>整條線較高的一方有範圍優勢</strong>；<strong>最右端（最強 5%–10%）較高的一方有堅果優勢</strong>。曲線中段陡升代表範圍極化，平滑上升代表範圍壓縮。GTO Wizard 也會把手牌分成強、好、弱、垃圾等勝率分桶。',
    ex: 'BTN vs BB 在 <span class="cards">Ah7d2c</span>：BTN 的曲線整體較高、右端也較高，所以能高頻下注。',
    rel: ['range-advantage', 'nut-advantage', 'polarized-range', 'condensed-range'] },

  { id: 'toy-game', term: 'Toy Game (AKQ Game)', zh: '玩具賽局（AKQ 賽局）', aka: ['AKQ Game', '簡化模型'],
    cat: 'gto', imp: 1,
    short: '把撲克縮小成只有幾張牌、幾種動作的簡化模型，用來看清 GTO 原理',
    def: '最有名的是 <strong>AKQ 賽局</strong>：只有 A、K、Q 三張牌，每人拿一張。拿 A 永遠價值下注、拿 Q 只能詐唬、拿 K 是抓詐牌。用無差異原則可推出：下注 1 倍底池時，<strong>下注範圍約 1/3 是詐唬</strong>（拿 Q 時詐唬一半），而拿 K 要跟注 50%，剛好等於 MDF。',
    ex: '這就是為什麼河牌下 1 倍底池時，價值與詐唬的比例是 2:1。',
    rel: ['indifference', 'value-to-bluff-ratio', 'mdf', 'nash-equilibrium'] }
);

// ---------------------------------------------------------------------------
// 5. 撲克數學與統計（math）— 勝率以 node 列舉驗算，統計數字以公式計算
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'odds-ratio', term: 'Odds (X:1) vs Percentage', zh: '賠率比與百分比換算', aka: ['Odds Against', '幾賠一', '比率賠率'],
    cat: 'math', imp: 2,
    short: '把「X 比 1」的賠率說法換算成勝率百分比的方法',
    def: '「<strong>X : 1</strong>」表示每 1 次成功對應 X 次失敗，換算成機率 = 1 ÷（X + 1）。例如 4:1 = 20%、3:1 = 25%、2:1 = 33.3%。底池賠率也能這樣說：底池 15bb、要跟 5bb，就是拿到 3:1 的賠率，至少需要 25% 勝率。',
    ex: '轉牌聽同花 9 張 Outs、46 張未知牌：37 張失敗比 9 張成功 ≈ 4.1:1，約 19.6%。',
    rel: ['pot-odds', 'outs', 'rule-2-4', 'equity'] },

  { id: 'dirty-outs', term: 'Clean Outs vs Dirty Outs', zh: '乾淨 Outs vs 髒 Outs', aka: ['Dirty Outs', 'Clean Outs', '假 Outs', '打折 Outs'],
    cat: 'math', imp: 2,
    short: '中了也不一定贏的補牌叫髒 Outs，計算勝率時要扣掉或打折',
    def: '數 Outs 時要問：「這張牌<strong>會不會同時幫到對手</strong>？」例如你聽同花，但對手已有暗三條，讓牌面成對的同花牌也會讓對手變葫蘆，這些就是髒 Outs。高估 Outs 是新手常見錯誤，會讓你用錯誤的賠率跟注。',
    ex: '你 <span class="cards">AsQs</span>，轉牌後牌面 <span class="cards">Ks8s3d5c</span>，對手 <span class="hand">88</span>：9 張黑桃中 <span class="cards">3s</span>、<span class="cards">5s</span> 會讓他成葫蘆，只剩 7 張乾淨 Outs（約 15.9%）。',
    rel: ['outs', 'reverse-implied-odds', 'draw', 'paired-board'] },

  { id: 'coin-flip', term: 'Coin Flip (Race)', zh: '擲硬幣局（五五波對決）', aka: ['Flip', 'Race', '五五波'],
    cat: 'math', imp: 2,
    short: '全下時雙方勝率接近一半一半的對決，最典型是對子對兩張高張',
    def: '經典數字：<span class="hand">QQ</span> vs <span class="hand">AKo</span> 約 <strong>57% : 43%</strong>；<span class="hand">QQ</span> vs <span class="hand">AKs</span> 約 54% : 46%；<span class="hand">22</span> vs <span class="hand">AKo</span> 約 53% : 47%，對子都是小幅領先者。錦標賽常說「要拿冠軍得贏好幾次擲硬幣」，所以能不擲硬幣就拿下籌碼更好。',
    ex: '你 <span class="hand">JJ</span> 全下被 <span class="hand">AKo</span> 跟注：你約 57% 小幅領先，是標準的擲硬幣局。',
    rel: ['equity', 'dominate', 'overcards', 'all-in'] },

  { id: 'standard-deviation', term: 'Standard Deviation (SD)', zh: '標準差', aka: ['SD', 'Std Dev', '波動度'],
    cat: 'math', imp: 2,
    short: '衡量結果偏離平均值有多劇烈的統計量，撲克常以 bb/100 表示',
    def: '6 人桌無限注現金局的標準差約 <strong>80–100 bb/100</strong>，遠大於好玩家約 5 bb/100 的贏率。標準差隨手數的平方根成長：SD 90 時，1 萬手的結果大約會在期望值 <strong>±1,764bb</strong>（95% 區間）內擺盪，相當於將近 ±18 個買入。',
    ex: '1 萬手贏率 5 bb/100，期望贏 500bb；但實際落在 −1,264bb 到 +2,264bb 之間都很正常。',
    rel: ['bankroll', 'sample-size', 'risk-of-ruin', 'downswing'] },

  { id: 'sample-size', term: 'Sample Size', zh: '樣本數（樣本量）', aka: ['Sample', '手數樣本'],
    cat: 'math', imp: 2,
    short: '判斷數據可不可信所需的手牌數量，樣本太小時結果大多是運氣',
    def: '贏率的誤差 ≈ 標準差 ÷ √（手數 ÷ 100）。SD 90 時，1 萬手的誤差高達 ±17.6 bb/100（95%），10 萬手仍有 <strong>±5.6 bb/100</strong>。HUD 數據也一樣：VPIP、PFR 幾十手就有參考價值，但 Fold to 3-Bet 與河牌數據需要上百次機會才穩定。',
    ex: '你 5,000 手打出 +15 bb/100，不代表你很強——這個樣本的誤差遠大於贏率本身。',
    rel: ['standard-deviation', 'hud', 'vpip-pfr', 'results-oriented'] },

  { id: 'all-in-ev', term: 'All-in Adjusted EV', zh: '全下調整期望值（全下 EV）', aka: ['All-in EV', 'EV Line', 'Sklansky Bucks', '期望值線'],
    cat: 'math', imp: 2,
    short: '排除全下之後的運氣，改用全下當下的勝率計算你「應得」的盈虧',
    def: '追蹤軟體在每次全下並亮牌時，用當下勝率分配底池：例如翻前 <span class="hand">AA</span> 對 <span class="hand">KK</span> 全下、底池 200bb，你約有 82% 勝率，EV 線就記你拿到約 <strong>164bb</strong>，不論實際輸贏。實際盈虧線低於 EV 線代表全下運氣差，高於則是運氣好。',
    ex: '這個月實際輸了 3 個買入，但 EV 線是 +2 個買入：你打得不錯，只是全下運氣差。',
    rel: ['ev', 'run-good', 'red-line', 'equity'] },

  { id: 'monte-carlo', term: 'Monte Carlo Simulation', zh: '蒙地卡羅模擬', aka: ['Monte Carlo', 'MC', '隨機模擬'],
    cat: 'math', imp: 1,
    short: '用電腦隨機發牌成千上萬次，再統計結果來估算勝率的方法',
    def: '當窮舉所有可能太慢時（例如範圍對範圍），就改用隨機抽樣。誤差大約與 1 ÷ √次數成正比：<strong>2 萬次模擬的 95% 誤差約 ±0.7%</strong>，10 萬次約 ±0.3%。本站勝率計算器與許多撲克 AI 都用這個方法；Monte Carlo CFR 也是靠抽樣加速 Solver。',
    ex: '模擬 <span class="hand">AKs</span> vs <span class="hand">QQ</span> 2 萬次得到 45.8%，精確值約 46.2%，差距在誤差範圍內。',
    rel: ['equity', 'cfr', 'solver'] },

  { id: 'risk-of-ruin', term: 'Risk of Ruin (RoR)', zh: '破產風險', aka: ['RoR', '破產機率'],
    cat: 'math', imp: 2,
    short: '在已知贏率與標準差下，資金長期輸光的機率',
    def: '常用近似公式：<strong>RoR = e^(−2 × 贏率 × 資金 ÷ 標準差²)</strong>（贏率、標準差用 bb/100，資金用 bb）。贏率越高、資金越多，破產風險就呈指數下降。小樣本算出的贏率常被高估，代進公式前最好先打折。',
    ex: '贏率 5 bb/100、標準差 90：30 個買入（3,000bb）的破產風險約 2.5%，50 個買入約 0.2%。',
    rel: ['bankroll', 'standard-deviation', 'shot-take', 'downswing'] }
);

// ---------------------------------------------------------------------------
// 6. 策略觀念與心態（strategy）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'initiative', term: 'Initiative', zh: '主動權', aka: ['主導權', 'Aggressor', '主動'],
    cat: 'strategy', imp: 2,
    short: '上一條街最後一個下注或加注的人所擁有的「發球權」',
    def: '有主動權的一方（例如翻前加注者）在下一條街通常可以 C-Bet，代表的範圍也比較強；沒主動權的一方要等對手過牌才有機會搶先。主動權的價值來自<strong>你的範圍較強、對手範圍較封頂</strong>，而不是「上一條街下注了，這條街就該繼續下注」。',
    ex: '你在 CO 開池、大盲跟注：翻牌你擁有主動權，大盲通常先過牌給你。',
    rel: ['cbet', 'rfi', 'donk-bet', 'probe-bet'] },

  { id: 'overfold', term: 'Overfold / Underfold', zh: '過度棄牌 / 棄牌不足', aka: ['Overfold', 'Underfold', 'Overdefend', 'Underdefend', '棄太多', '跟太多'],
    cat: 'strategy', imp: 2,
    short: '面對下注時，棄牌比例高於或低於理論應有的頻率',
    def: '理論基準是 <strong>MDF</strong>：面對 1/2 底池下注，整體要繼續約 66.7%。棄得比這更多就是 Overfold，對手的任意詐唬都能獲利；跟得太多則是棄牌不足，對手應該少詐唬、多打薄價值。剝削口訣：<strong>對手棄太多就多詐唬，跟太多就多拿價值</strong>。',
    ex: '對手面對 1/3 底池 C-Bet 棄牌高達 65%（遠高於 MDF 允許的約 25%）：你可以拿更多空氣牌 C-Bet。',
    rel: ['mdf', 'alpha', 'exploit', 'overbluff'] },

  { id: 'overbluff', term: 'Overbluff / Underbluff', zh: '過度詐唬 / 詐唬不足', aka: ['Overbluff', 'Underbluff', '詐唬太多', '詐唬太少'],
    cat: 'strategy', imp: 2,
    short: '下注範圍裡的詐唬比例高於或低於該尺度的理論比例',
    def: '例如河牌下注 1 倍底池，理論詐唬佔 33.3%。<strong>過度詐唬</strong>時，對手拿任何抓詐牌跟注都賺；<strong>詐唬不足</strong>時，對手可以把中等牌全部棄掉。中低級別大眾池最典型的漏洞就是<strong>河牌大注與加注詐唬不足</strong>，所以面對陌生玩家的河牌加注，可以比 MDF 棄得更多。',
    ex: '對手 500 手裡河牌下大注、攤牌全是強牌：他詐唬不足，你的中等抓詐牌應該直接棄掉。',
    rel: ['value-to-bluff-ratio', 'overfold', 'population-tendency', 'bluff-catcher'] },

  { id: 'represent', term: 'Represent', zh: '代表（演出某手牌）', aka: ['Rep', 'Telling a Story', '講故事'],
    cat: 'strategy', imp: 2,
    short: '用前後一致的下注路線，讓對手相信你拿著某種特定的牌',
    def: '詐唬能不能成功，取決於<strong>你的路線是否可信</strong>：翻前、翻牌、轉牌的動作都要能合理對應你想代表的牌。例如翻牌出現同花聽牌後一路跟注，河牌同花完成時下大注，就能代表同花。如果你的範圍根本不可能有那手牌，對手就不會相信。',
    ex: '你在大盲跟注，過牌跟注 <span class="cards">Kh9h4c</span> 的 C-Bet，轉牌 <span class="cards">7s</span> 雙方過牌，河牌 <span class="cards">2h</span> 完成同花時你下大注：代表的就是同花。',
    rel: ['line', 'pure-bluff', 'table-image', 'semi-bluff'] },

  { id: 'table-image', term: 'Table Image', zh: '牌桌形象', aka: ['Image', '形象'],
    cat: 'strategy', imp: 2,
    short: '其他玩家根據你過去的表現，對你打法鬆緊與誠實程度的印象',
    def: '形象會影響對手怎麼解讀你的下注：<strong>緊形象</strong>的下注更容易被尊重，適合詐唬；<strong>鬆凶形象</strong>（例如剛被抓到詐唬）時，對手會放寬跟注，適合多打價值。形象是暫時的，會隨攤牌與時間改變；面對不太注意別人的休閒玩家，形象的作用也比較小。',
    ex: '你剛在攤牌時亮出 <span class="cards">7s2d</span> 的詐唬，接下來一段時間拿強牌下注更容易被跟注。',
    rel: ['leveling', 'represent', 'tag-lag', 'exploit'] },

  { id: 'leveling', term: 'Leveling (Multi-Level Thinking)', zh: '層次思考（想幾層）', aka: ['Multi-Level Thinking', 'Levels', '多層次思考', 'Level 自己'],
    cat: 'strategy', imp: 1,
    short: '從「我有什麼」到「他以為我有什麼」，一層一層推理對手想法的思考方式',
    def: '第 1 層：我有什麼牌？第 2 層：對手可能有什麼？第 3 層：對手覺得我有什麼？第 4 層：對手覺得我認為他有什麼……。關鍵是<strong>只比對手多想一層</strong>：對只想第 1 層的新手做複雜詐唬，他根本看不懂；想太多反而做出怪決定，俗稱「Level 自己」。',
    ex: '面對只看自己牌的跟注站，不需要演故事，直接打價值就好。',
    rel: ['table-image', 'represent', 'exploit', 'range'] },

  { id: 'raise-or-fold', term: 'Raise-or-Fold', zh: '只加注或棄牌', aka: ['ROF', 'Raise or Fold', '不平跟策略'],
    cat: 'strategy', imp: 2,
    short: '不設跟注範圍，要玩的牌全部加注、其餘全部棄牌的策略',
    def: '最常見於<strong>小盲位開池</strong>（本站基準 SB 開 3bb、範圍約 43%），以及大盲以外的位置面對開池時。好處是簡單、保有棄牌權益、避免被後位擠壓，也避開翻後沒位置的難打底池。缺點是放棄平跟的彈性，但對新手來說 EV 損失很小。',
    ex: '前面全部棄牌到你的 SB：<span class="hand">Q8s</span> 開池到 3bb，<span class="hand">Q4o</span> 直接棄牌，不補盲溜入。',
    rel: ['sb', 'rfi', 'complete', 'squeeze'] },

  { id: 'table-selection', term: 'Table Selection', zh: '選桌（與選位）', aka: ['Game Selection', 'Seat Selection', 'Bumhunting', '選位'],
    cat: 'strategy', imp: 2,
    short: '主動挑選弱玩家多的牌桌與好座位，以提高自己的贏率',
    def: '你的贏率取決於你和桌上對手的實力差。選桌看平均入池率（VPIP 高、看翻牌比例高的桌比較軟），以及有沒有明顯的休閒玩家；選位則盡量<strong>坐在鬆凶或休閒玩家的左手邊</strong>，讓你在大部分底池中比他晚行動。只挑弱者打、避開強者，在線上常被稱為 Bumhunting。',
    ex: '同級別兩張桌：A 桌平均 VPIP 35%、B 桌 22%，選 A 桌通常更賺。',
    rel: ['vpip-pfr', 'nit-fish', 'reg', 'ip'] },

  { id: 'leak', term: 'Leak', zh: '漏洞（破綻）', aka: ['Leaks', '失血點'],
    cat: 'strategy', imp: 3,
    short: '在某類情境中反覆犯錯，長期持續漏掉 EV 的打法習慣',
    def: '漏洞像水管上的小洞，單看一手牌不明顯，累積幾萬手就很可觀。常見例子：翻前玩太多手牌、面對小注棄太多、河牌愛抓詐、詐唬時不看對手類型。找漏洞的方法是用<strong>追蹤軟體篩選特定情境</strong>，拿自己的數據和 GTO 基準比對。',
    ex: '覆盤發現自己面對 3-Bet 棄牌 70%（本站基準約 50%）——這就是會被對手剝削的漏洞。',
    rel: ['exploit', 'hud', 'hand-history', 'fold-to-3bet'] },

  { id: 'results-oriented', term: 'Results-Oriented Thinking', zh: '結果導向思維', aka: ['Resulting', 'Process-Oriented', '以成敗論英雄'],
    cat: 'strategy', imp: 2,
    short: '用單次輸贏結果來評價決策好壞的錯誤思考方式',
    def: '撲克短期充滿運氣：<span class="hand">AA</span> 對 <span class="hand">KK</span> 全下仍有約 18% 會輸。若因為輸了就認定打錯、贏了就認定打對，會讓你改掉正確的打法、保留錯誤的打法。正確做法是<strong>過程導向</strong>：檢視決策當下的資訊與 EV，而不是看最後發出什麼牌。',
    ex: '必要勝率 25%，你拿約 35% 勝率的聽牌跟注，最後沒中而輸——這仍然是好決策。',
    rel: ['ev', 'tilt', 'sample-size', 'a-game'] },

  { id: 'sunk-cost', term: 'Sunk Cost Fallacy', zh: '沉沒成本謬誤', aka: ['Sunk Cost', '已經投入太多', '捨不得棄'],
    cat: 'strategy', imp: 2,
    short: '因為已經投入很多籌碼，就捨不得棄牌而繼續付錢的心理陷阱',
    def: '底池裡的籌碼<strong>已經不屬於任何人</strong>，你之前投入多少都收不回來。每個決策只該看「現在要付多少、能贏多少、勝率多少」。大底池的好處是賠率變好，但當對手路線明顯代表大牌、你的勝率低於必要勝率時，投入再多也不是跟注的理由。',
    ex: '你已經投入 60bb，對手河牌全下，你判斷勝率只有 10%、卻需要 30%：棄牌才正確。',
    rel: ['pot-odds', 'commit', 'fold', 'hero-fold'] },

  { id: 'a-game', term: 'A-Game / C-Game', zh: 'A 級狀態 / C 級狀態', aka: ['A-Game', 'B-Game', 'C-Game', '巔峰狀態'],
    cat: 'strategy', imp: 1,
    short: '把自己的發揮分成最佳 A、普通 B、最差 C 三種狀態的心態概念',
    def: '由心理教練 Jared Tendler 推廣。<strong>A-Game</strong> 是專注、決策清晰的巔峰狀態；<strong>C-Game</strong> 是疲勞或上頭時的最差狀態，常出現追損失、亂詐唬。目標不只是提升 A-Game，更重要的是<strong>拉高 C-Game 的下限</strong>，並在察覺自己掉進 C-Game 時及時停下來。',
    ex: '連輸三次冤家牌後開始想「今天一定要贏回來」，就是快掉進 C-Game 的警訊，該休息了。',
    rel: ['tilt', 'results-oriented', 'downswing', 'leak'] }
);

// ---------------------------------------------------------------------------
// 7. 玩家類型、HUD 數據與覆盤工具（player）— 基準值與本站 exploit 課程一致
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'af', term: 'AF (Aggression Factor)', zh: '攻擊係數', aka: ['AF', 'Aggression Factor', '侵略係數'],
    cat: 'player', imp: 2,
    short: '翻後主動下注與加注的次數，除以跟注次數所得的比值',
    def: '公式：<strong>AF =（下注次數 + 加注次數）÷ 跟注次數</strong>，過牌與棄牌不計入。一般認為約 <strong>2–3</strong> 屬正常積極，低於 1 偏被動（愛跟注），高於 4 非常激進。因為不計棄牌，AF 看不出對手多常放棄，最好搭配 AFq 一起看。',
    ex: '對手翻後下注 30 次、加注 10 次、跟注 20 次：AF = 40 ÷ 20 = 2。',
    rel: ['afq', 'hud', 'vpip-pfr', 'tag-lag'] },

  { id: 'afq', term: 'AFq (Aggression Frequency)', zh: '攻擊頻率', aka: ['AFq', 'Agg%', 'Aggression Frequency'],
    cat: 'player', imp: 2,
    short: '翻後所有行動中，選擇下注或加注所佔的百分比',
    def: 'PokerTracker 的公式：<strong>AFq =（下注 + 加注）÷（下注 + 加注 + 跟注 + 棄牌）× 100%</strong>。和 AF 不同，它把棄牌算進去，更能反映整體凶不凶。大致上 60% 以上代表非常凶、常開多槍；30% 以下代表被動，多半「中了才打、沒中就棄」。分街看更有用，例如河牌 AFq 驟降代表他很少河牌詐唬。',
    ex: '對手下注加加注 40 次、跟注 30 次、棄牌 30 次：AFq = 40 ÷ 100 = 40%。',
    rel: ['af', 'hud', 'wwsf', 'overbluff'] },

  { id: 'wwsf', term: 'WWSF (Won When Saw Flop)', zh: '看翻牌後贏池率', aka: ['WWSF', '翻後贏池率'],
    cat: 'player', imp: 2,
    short: '玩家看到翻牌之後，最後贏下底池的百分比（不論有沒有攤牌）',
    def: '計算：贏下的底池數 ÷ 看到翻牌的次數；靠下注逼對手棄牌、或攤牌獲勝都算進去。6 人桌穩健贏家常落在約 <strong>45%–53%</strong>：太低代表翻後太容易放棄，可以多施壓；太高代表很凶、愛搶池，可以多用跟注與誘捕反制。',
    ex: 'WWSF 40% 而且 WTSD 很低的玩家，翻後一被下注就棄牌，很適合多開幾槍。',
    rel: ['wtsd', 'afq', 'hud', 'red-line'] },

  { id: 'fold-to-3bet', term: 'Fold to 3-Bet', zh: '面對 3-Bet 棄牌率', aka: ['F3B', 'Fold vs 3-Bet', '被 3-Bet 棄牌率'],
    cat: 'player', imp: 2,
    short: '玩家開池加注後遭到 3-Bet 時，選擇棄牌的百分比',
    def: '本站 6 人桌基準約 <strong>45%–60%</strong>（依位置：被盲注 3-Bet、自己有位置時約 45%–50%；UTG 被後位 3-Bet、自己沒位置時可達約 60%）。明顯高於 60% 代表他很怕 3-Bet，你可以拿阻擋牌（如 <span class="hand">A5s</span>）更常 3-Bet 詐唬；低於 40% 代表他幾乎不棄，對他應該停止詐唬 3-Bet、改用較寬的價值 3-Bet。這個數據要累積足夠的被 3-Bet 次數才可信。',
    ex: '對手在 BTN 開池很寬、Fold to 3-Bet 高達 68%：你在 SB 可以用更多同花小 A 與同花連張 3-Bet。',
    rel: ['3bet', '3bet-pct', 'hud', 'resteal'] },

  { id: '3bet-pct', term: '3-Bet %', zh: '3-Bet 頻率', aka: ['3B%', 'PF 3Bet', '再加注率'],
    cat: 'player', imp: 2,
    short: '有機會 3-Bet 的情況下，玩家實際選擇 3-Bet 的百分比',
    def: '本站 6 人桌 GTO 基準依位置差很多：前位對前位約 <strong>4%–5%</strong>，後位或盲注對 CO / BTN 約 <strong>10%–15%</strong>，整體平均約 8%–10%。低於 5% 的玩家通常只拿 <span class="hand">QQ+</span>、<span class="hand">AK</span> 才 3-Bet，被他 3-Bet 時可以大量棄牌；高於 14% 代表 3-Bet 很鬆，可以多 4-Bet 或平跟反制。最好分位置看：盲注對按鈕的 3-Bet 頻率本來就比較高。',
    ex: '某玩家 2,000 手的 3-Bet 只有 3%：他 3-Bet 你時，連 <span class="hand">JJ</span>、<span class="hand">AQs</span> 都可以考慮棄牌。',
    rel: ['3bet', 'fold-to-3bet', 'vpip-pfr', 'nit-fish'] },

  { id: 'cbet-pct', term: 'C-Bet % / Fold to C-Bet', zh: '持續下注率 / 面對持續下注棄牌率', aka: ['CB%', 'Fold to CB', 'FCB'],
    cat: 'player', imp: 2,
    short: '翻前加注者在翻牌下注的比例，以及面對這種下注時棄牌的比例',
    def: '單次加注底池、有位置時的翻牌 C-Bet 常見約 <strong>55%–70%</strong>，沒位置會明顯較低。C-Bet 高達 80% 以上代表幾乎無腦下注，可以多跟注飄浮或過牌加注；Fold to C-Bet 很高的人則可以多用小注攻擊。也要分街看：翻牌 C-Bet 高、轉牌開槍低的人，最適合翻牌跟注、轉牌搶池。',
    ex: '對手翻牌 C-Bet 85%、轉牌只有 35%：用有後門聽牌的牌跟注翻牌，等他轉牌過牌再下注。',
    rel: ['cbet', 'stab', 'hud', 'check-raise'] },

  { id: 'ats', term: 'ATS / Fold to Steal', zh: '偷盲率 / 面對偷盲棄牌率', aka: ['ATS', 'Attempt to Steal', 'Fold to Steal', 'FTS'],
    cat: 'player', imp: 2,
    short: '後位在前面全棄時開池的比例，以及盲注面對這種開池時棄牌的比例',
    def: 'ATS 統計 CO、BTN、SB 在前面全棄時的開池頻率。依本站開池基準（CO 30%、BTN 45%、SB 43%）推算，合理值約 40% 上下；長期超過 55% 代表偷盲很兇，盲注可以多 3-Bet 反偷。反過來，大盲面對偷盲棄牌超過 70% 的玩家，後位幾乎可以拿任意兩張牌偷他的盲注。',
    ex: '大盲 Fold to Steal 75%：你在 BTN 可以把開池範圍放寬到 55% 以上。',
    rel: ['steal', 'resteal', 'btn', 'hud'] },

  { id: 'red-line', term: 'Red Line / Blue Line', zh: '紅線（非攤牌盈虧）/ 藍線（攤牌盈虧）', aka: ['Red Line', 'Blue Line', 'Green Line', '非攤牌贏利', '攤牌贏利'],
    cat: 'player', imp: 1,
    short: '追蹤軟體的盈虧圖中，把盈虧拆成「沒攤牌」與「有攤牌」兩條線',
    def: '<strong>藍線</strong>：攤牌時贏或輸的錢；<strong>紅線</strong>：沒走到攤牌就結束的手牌（偷盲、C-Bet 成功、被逼棄牌）的盈虧；<strong>綠線 = 藍線 + 紅線</strong>，是總盈虧；另一條黃（橘）線是全下 EV。低級別紅線往下很常見，但若一路暴跌，通常代表翻後太被動、太容易棄牌。',
    ex: '藍線一路往上、紅線一路往下：你很會打價值，但面對壓力棄太多，也很少搶沒人要的底池。',
    rel: ['all-in-ev', 'hud', 'hand-history', 'wwsf'] },

  { id: 'reg', term: 'Reg (Regular)', zh: '常客（固定玩家）', aka: ['Regular', 'Grinder', '刷量玩家'],
    cat: 'player', imp: 2,
    short: '長期固定在某個級別出現、具備基本功的玩家',
    def: '常客通常會用 HUD、懂基本範圍與數學，彼此對打時技術差距小、抽水卻照付，所以「常客打常客」往往大家都不太賺。面對常客要以 <strong>GTO 為基礎</strong>，找出他偏離的地方（例如太怕 3-Bet）再小幅剝削；真正的主要利潤來自休閒玩家。',
    ex: '一張桌坐了 5 個常客、沒有休閒玩家：就算你技術最好，扣掉抽水後的贏率也會很低。',
    rel: ['nit-fish', 'table-selection', 'tag-lag', 'population-tendency'] },

  { id: 'population-tendency', term: 'Population Tendencies', zh: '大眾池傾向', aka: ['Pool', 'Population Read', '大眾池', '群體傾向'],
    cat: 'player', imp: 2,
    short: '某個級別或平台上「大多數玩家」共通的打法習慣與漏洞',
    def: '面對沒有數據的陌生人時，最好的參考就是大眾池傾向。中低級別常見：<strong>河牌大注與加注詐唬不足</strong>、翻牌面對小注棄太多或跟太多、3-Bet 太少。先用大眾池傾向做預設調整，再隨著對個別玩家的觀察修正，是實戰剝削的起點。',
    ex: '低級別大眾池在河牌過牌加注時幾乎都是強牌，所以你拿一對時直接棄牌通常更賺。',
    rel: ['exploit', 'overbluff', 'sample-size', 'reg'] },

  { id: 'tell', term: 'Tell', zh: '馬腳（破綻訊號）', aka: ['Tells', 'Timing Tell', '時間馬腳', '肢體語言'],
    cat: 'player', imp: 2,
    short: '對手無意間透露牌力的行為訊號，例如動作、說話或思考時間',
    def: '現場馬腳包括手抖、呼吸、看籌碼、說話語氣；線上則以<strong>時間馬腳</strong>與下注尺度習慣為主，例如秒過牌常代表放棄。馬腳要對照該玩家平時的「基準行為」才有意義，可靠度也遠不如下注路線與範圍分析，只適合在<strong>邊緣決策時加分參考</strong>。',
    ex: '某玩家平常思考約 3 秒，這次河牌秒跟注：比較像早就決定跟注的中等牌，而不是會考慮加注的堅果。',
    rel: ['hollywood', 'tank', 'snap-call', 'exploit'] },

  { id: 'hand-history', term: 'Hand History (HH)', zh: '手牌紀錄', aka: ['HH', 'Tracker', '追蹤軟體', '牌譜'],
    cat: 'player', imp: 2,
    short: '線上平台自動保存的每手牌完整過程，可匯入追蹤軟體覆盤與統計',
    def: '手牌紀錄包含座位、籌碼、每個動作與攤牌結果。匯入 <strong>PokerTracker 4、Hold’em Manager 3、Hand2Note</strong> 等追蹤軟體後，就能產生 HUD 數據、盈虧圖、篩選特定情境覆盤，或把關鍵手牌丟進 Solver 比對。分享手牌討論時，記得附上位置、籌碼深度與下注尺度。',
    ex: '每週篩出「在大盲面對 BTN 開池、翻牌過牌跟注」的所有手牌一起覆盤，找出自己的漏洞。',
    rel: ['hud', 'leak', 'red-line', 'solver'] }
);

// ---------------------------------------------------------------------------
// 8. 錦標賽（tournament）— 以下皆為錦標賽情境（有前注、籌碼深度會變化）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'push-fold', term: 'Push / Fold', zh: '推擠 / 棄牌（全下或棄牌）', aka: ['Push-Fold', 'Shove or Fold', 'Nash Push', '推或棄'],
    cat: 'tournament', imp: 3,
    short: '籌碼很短時，翻前只在「全下」與「棄牌」兩者之間選擇的策略',
    def: '錦標賽籌碼約 <strong>10–15bb 以下</strong>時，開池後再被 3-Bet 會很難處理，乾脆直接全下，把棄牌權益最大化。<strong>納許推擠表</strong>列出各位置、各籌碼量的推擠與跟注範圍：位置越後面可以推得越寬，小盲 10bb 時常可推超過一半的手牌。接近錢圈時要再用 ICM 收緊。',
    ex: '錦標賽中你在 BTN 剩 8bb、前面全部棄牌：拿 <span class="hand">K8s</span>、<span class="hand">A3o</span>、<span class="hand">55</span> 多半直接全下。',
    rel: ['all-in', 'icm', 'm-ratio', 'fold-equity'] },

  { id: 'm-ratio', term: 'M-Ratio', zh: 'M 值（籌碼生存指數）', aka: ['M', 'Harrington M', 'Effective M'],
    cat: 'tournament', imp: 2,
    short: '籌碼量除以一整圈盲注加前注的總和，代表什麼都不玩還能撐幾圈',
    def: '公式：<strong>M = 籌碼 ÷（小盲 + 大盲 + 全部前注）</strong>。由 Dan Harrington 推廣的分區：M 大於 20 是綠區（自由操作）、10–20 黃區（少玩投機牌）、6–10 橘區（多搶先出擊）、1–5 紅區（推擠或棄牌）、低於 1 是死區。現代錦標賽多直接用「幾個大盲」思考，但 M 值很適合理解前注的影響。',
    ex: '盲注 500/1,000、大盲前注 1,000，你有 30,000：M = 30,000 ÷ 2,500 = 12（黃區）。',
    rel: ['push-fold', 'bb-ante', 'effective-stack', 'icm'] },

  { id: 'bb-ante', term: 'Big Blind Ante (BBA)', zh: '大盲前注', aka: ['BBA', 'BB Ante', '大盲代付前注'],
    cat: 'tournament', imp: 2,
    short: '由大盲一個人替全桌支付前注的錦標賽制度，前注通常等於一個大盲',
    def: '傳統上每人都要放前注，收錢很慢；大盲前注改由<strong>坐在大盲的人一次付清</strong>，省時又少爭議。例如 1,000/2,000 加大盲前注 2,000，翻前底池一開始就有 5,000（2.5bb），死錢變多，偷盲與防守都要更寬。籌碼不足時，多數規則（如 TDA）先付前注、再付大盲。',
    ex: '大盲前注制下，前面全部棄牌時，BTN 的開池範圍可以比無前注的現金桌更寬。',
    rel: ['straddle', 'm-ratio', 'steal', 'mtt-cash'] },

  { id: 'stop-and-go', term: 'Stop-and-Go', zh: '停走戰術（先跟後推）', aka: ['Stop and Go', '先跟再推'],
    cat: 'tournament', imp: 1,
    short: '短碼翻前先跟注加注，翻牌不論發什麼都搶先全下的錦標賽招數',
    def: '情境：你約剩 10bb、沒位置面對開池。翻前直接全下對手很可能跟注；改成先跟注，翻牌<strong>搶先全下</strong>，對手若沒中（兩張不同點數的高張約 2/3 的時間翻牌沒配成對）就得面對棄牌壓力。現代 Solver 認為多數時候翻前直接推擠更好，但面對特定對手仍然有用。',
    ex: '你在大盲剩 9bb 拿 <span class="hand">66</span>，BTN 開池：先跟注，翻牌任何牌都直接全下。',
    rel: ['push-fold', 'fold-equity', 'oop', 'm-ratio'] },

  { id: 'freezeout', term: 'Freezeout', zh: '單次參賽制（凍結賽）', aka: ['Freeze-out', '一次性買入', '不可重購'],
    cat: 'tournament', imp: 1,
    short: '每位玩家只能買入一次、輸光就淘汰，不能重新進場的錦標賽',
    def: '最傳統的錦標賽形式，<strong>每人只有一條命</strong>，所以前期少了「反正可以再買」的瘋狂打法，整體偏緊、生存價值較高。相較可以重購（Rebuy）或重新參賽（Re-entry）的賽事，Freezeout 的獎池也比較容易預估。',
    ex: '賽事名稱標示「NLH Freezeout $100」：輸光就結束，不能再付錢回到座位。',
    rel: ['re-entry', 'rebuy', 'mtt-cash', 'icm'] },

  { id: 're-entry', term: 'Re-entry', zh: '重新參賽', aka: ['Re-Entry', 'Multi-entry', '再進場', '子彈'],
    cat: 'tournament', imp: 2,
    short: '被淘汰後在規定期間內再付一次報名費，拿一份新籌碼並重新抽座位',
    def: '和重購（Rebuy）不同：Re-entry 必須<strong>先被淘汰</strong>才能再報名，而且會被分到新座位，相當於多一顆「參賽子彈」，通常只能在晚報名截止前使用。可重新參賽讓前期打法變鬆、獎池變大，也代表資金充足的玩家能多試幾次。',
    ex: '某賽事允許 2 次 re-entry：你最多可以付 3 次報名費（3 顆子彈）。',
    rel: ['rebuy', 'freezeout', 'late-registration', 'buy-in'] },

  { id: 'rebuy', term: 'Rebuy', zh: '重購', aka: ['Re-buy', '補碼', '重購賽'],
    cat: 'tournament', imp: 1,
    short: '在重購期內籌碼不足或輸光時，留在原座位直接付費補一份籌碼',
    def: '重購賽通常規定前幾個盲注級別為<strong>重購期</strong>，籌碼低於起始量時可以付費補碼，不必離開座位；重購期結束時常提供一次<strong>加購（Add-on）</strong>。現金桌輸掉籌碼後再買一次也叫 Rebuy。重購期內很多人打得特別鬆，要依此調整。',
    ex: '重購期內你輸光 10,000 起始籌碼，可以再付一次買入，直接在原座位拿回 10,000。',
    rel: ['add-on', 're-entry', 'freezeout', 'buy-in'] },

  { id: 'add-on', term: 'Add-on', zh: '加購', aka: ['Add On', '最後加碼'],
    cat: 'tournament', imp: 1,
    short: '重購期結束時，所有仍在比賽中的玩家可以付費加買一次固定籌碼',
    def: '加購通常<strong>不論你目前籌碼多少都可以買</strong>，有些賽事的加購籌碼性價比還比起始籌碼更高。在重購賽中大部分玩家都會加購，若你不買，等於自願讓籌碼落後；通常只有籌碼已經非常深的人才會考慮不買。',
    ex: '重購期結束，主持人宣布可以用一次買入的價格加購 15,000 籌碼。',
    rel: ['rebuy', 'buy-in', 'mtt-cash'] },

  { id: 'satellite', term: 'Satellite', zh: '衛星賽', aka: ['Sat', 'Qualifier', 'Mega Satellite', '資格賽'],
    cat: 'tournament', imp: 2,
    short: '獎品不是現金、而是更大賽事門票（座位）的小型錦標賽',
    def: '衛星賽常發放<strong>同等價值的門票</strong>：例如前 10 名都拿一張主賽門票，第 1 名和第 10 名獎勵一樣。所以一旦籌碼足以安全晉級，多贏籌碼幾乎沒有額外價值，ICM 壓力極大；在門票泡沫期，即使拿到 <span class="hand">AA</span> 也可能正確棄牌。',
    ex: '10 張門票的衛星賽剩 11 人時你籌碼第一：最好的策略常常是一路棄牌，等短碼被淘汰。',
    rel: ['icm', 'hand-for-hand', 'freeroll', 'min-cash'] },

  { id: 'bounty', term: 'Bounty (Knockout)', zh: '賞金賽（獵人賽）', aka: ['KO', 'Knockout', 'Bounty Tournament', 'Mystery Bounty', '人頭賽'],
    cat: 'tournament', imp: 2,
    short: '每淘汰一位玩家，就能領取他頭上賞金的錦標賽形式',
    def: '賞金賽把每位玩家的買入分成<strong>獎池與賞金</strong>兩部分，淘汰對手立刻拿到他的賞金。因為多了額外獎勵，<strong>籌碼能蓋過對手（Cover）的人跟注範圍要更寬</strong>，短碼也更容易被跟注。變化型有漸進式賞金（PKO），以及賞金金額隨機抽出的神秘賞金（Mystery Bounty）。',
    ex: '你的籌碼比對手多，他全下 15bb、頭上還有賞金：你可以用比平常更寬的範圍跟注。',
    rel: ['pko', 'side-pot', 'icm', 'mtt-cash'] },

  { id: 'pko', term: 'PKO (Progressive Knockout)', zh: '漸進式賞金賽', aka: ['PKO', 'Progressive KO', '累進賞金'],
    cat: 'tournament', imp: 2,
    short: '淘汰對手時一半賞金立刻入袋、另一半加到自己頭上的賞金賽',
    def: '常見 50/50 結構：買入一半進獎池、一半成為你的起始賞金。淘汰一位頭上 $50 的玩家，你<strong>立刻拿到 $25 現金，自己的賞金也增加 $25</strong>，變成 $75。越到後期，大籌碼頭上的賞金越大，甚至超過名次獎金，所以 PKO 後期的策略和一般錦標賽差異很大。',
    ex: '$100 PKO（不計抽水）：$50 進獎池、$50 是賞金。你淘汰兩位 $50 賞金的玩家後，已入袋 $50，頭上賞金變成 $100。',
    rel: ['bounty', 'icm', 'chip-leader', 'final-table'] }
);

GTO.GLOSSARY_EXTRA.push(
  { id: 'final-table', term: 'Final Table (FT)', zh: '決賽桌', aka: ['FT', '最終桌', '決賽圈'],
    cat: 'tournament', imp: 2,
    short: '錦標賽最後剩下的一張桌子，通常 6–9 人，名次獎金差距最大',
    def: '決賽桌的名次獎金常常一階比一階跳得更多，前 3 名尤其懸殊，所以 <strong>ICM 壓力最大</strong>：中等籌碼最綁手綁腳，大籌碼可以施壓，短碼則要找推擠機會。這個階段也常出現協議分錢（Deal）。',
    ex: '決賽桌剩 4 人、第 4 名 $10,000、第 3 名 $15,000：還有更短的籌碼時，中碼面對大碼全下要棄掉不少平常會跟的牌。',
    rel: ['icm', 'pay-jump', 'chip-leader', 'chop'] },

  { id: 'chip-leader', term: 'Chip Leader (CL)', zh: '籌碼領先者（大籌碼）', aka: ['CL', 'Big Stack', '大碼', '籌碼王'],
    cat: 'tournament', imp: 2,
    short: '目前籌碼最多的玩家，能蓋過（Cover）桌上其他所有人',
    def: '在 ICM 情境下，籌碼領先者輸一手牌也不會出局，對手卻可能被淘汰，所以<strong>他可以用更寬的範圍開池、3-Bet 施壓</strong>，其他人面對他則必須收緊。大籌碼最怕的是和第二大籌碼硬碰，因此通常會避開對方，專心壓迫中等籌碼。',
    ex: '泡沫期你是籌碼王：在 BTN 面對兩個中等籌碼的盲注，可以用比平常寬得多的範圍開池。',
    rel: ['icm', 'effective-stack', 'final-table', 'steal'] },

  { id: 'sng', term: 'SNG (Sit & Go)', zh: '坐滿即開賽', aka: ['Sit and Go', 'SNG', 'Spin & Go', '單桌賽'],
    cat: 'tournament', imp: 2,
    short: '沒有固定開賽時間，報名人數一滿就立刻開打的小型錦標賽',
    def: '常見單桌 6 人或 9 人、只有前 2–3 名有獎金，結構固定、時間短，非常適合練習 <strong>ICM 與推擠</strong>。其中「Spin &amp; Go」是 3 人極速賽，開賽前隨機抽出獎池倍數（從 2 倍起跳，極少數可達上萬倍），變異數非常大。',
    ex: '9 人 SNG 常見前 3 名獎金 50% / 30% / 20%：泡沫期就是第 4 名被淘汰之前。',
    rel: ['icm', 'push-fold', 'turbo', 'mtt-cash'] },

  { id: 'overlay', term: 'Overlay', zh: '保證獎金缺口', aka: ['GTD', 'Guarantee', '保底獎池', '保證獎金'],
    cat: 'tournament', imp: 1,
    short: '保證獎池的賽事報名不足時，主辦方自掏腰包補上的差額',
    def: '賽事標示「保證 $100,000（GTD）」但報名費只收到 $80,000 時，主辦方要補上 <strong>$20,000 的 Overlay</strong>。這筆錢等於白送給參賽者，讓整場比賽的平均 EV 變高，所以職業玩家會特別留意可能出現 Overlay 的賽事。',
    ex: '小型線上賽保證 $5,000，卻只有 40 人各付 $100：Overlay 就是 $1,000（不計抽水）。',
    rel: ['buy-in', 'mtt-cash', 'freeroll'] },

  { id: 'freeroll', term: 'Freeroll', zh: '免費賽（免費翻盤機會）', aka: ['Free Roll', '免費錦標賽'],
    cat: 'tournament', imp: 1,
    short: '不用報名費就能參加的錦標賽；也指一手牌中「最差平手、還可能獨贏」的情況',
    def: '第一種意思：平台或場館舉辦、<strong>零報名費但有獎金</strong>的比賽，適合新手練習。第二種是牌局用語：雙方目前平手，但你還多了額外的聽牌可以獨贏，<strong>最差平分、最好全拿</strong>。',
    ex: '你 <span class="cards">AhKh</span>、對手 <span class="cards">AdKc</span>，翻牌 <span class="cards">QhJhTc</span>：兩人都是 A 高順子，但你還有同花聽牌，勝率約 68%——這就是 Freeroll。',
    rel: ['redraw', 'satellite', 'chop', 'overlay'] },

  { id: 'pay-jump', term: 'Pay Jump', zh: '獎金跳階', aka: ['Pay Jumps', 'Ladder', '拉名次', '名次爬升'],
    cat: 'tournament', imp: 2,
    short: '每多撐過一名淘汰，名次獎金往上增加的幅度，越接近冠軍越大',
    def: '錦標賽獎金結構通常<strong>越接近冠軍跳得越多</strong>。當下一個跳階很大、又有更短的籌碼可能先出局時，中等籌碼常選擇保守等待，這種策略叫「拉名次（Ladder）」。ICM 模型就是在量化這些跳階對每一手牌決策的影響。',
    ex: '第 9 名 $2,000、第 8 名 $2,600：只差一名就多 $600，短碼更傾向等待別人先出局。',
    rel: ['icm', 'final-table', 'min-cash', 'chip-leader'] },

  { id: 'min-cash', term: 'Min-Cash', zh: '最低獎金（剛進錢圈）', aka: ['Mincash', 'ITM', 'In the Money', '進錢圈'],
    cat: 'tournament', imp: 1,
    short: '剛跨過泡沫、拿到最低一級獎金的名次，俗稱「剛進錢圈」',
    def: '多數錦標賽只付給前約 <strong>10%–15%</strong> 的玩家，剛進錢圈的那批人拿到的就是 Min-Cash，金額通常只比報名費多一點。長期獲利主要來自打進決賽桌與前幾名，所以不要為了保住 Min-Cash 而在泡沫期過度保守。',
    ex: '1,000 人參賽、付前 150 名：第 151 名被淘汰的那一刻，剩下的人都鎖住了 Min-Cash。',
    rel: ['pay-jump', 'icm', 'hand-for-hand', 'satellite'] },

  { id: 'hand-for-hand', term: 'Hand-for-Hand', zh: '逐手同步進行', aka: ['HFH', 'Hand for Hand', '同步發牌'],
    cat: 'tournament', imp: 1,
    short: '泡沫期全場各桌一手一手同步進行，避免有人故意拖時間等別人出局',
    def: '接近錢圈（通常只差 1 人）時，賽事總監會宣布逐手進行：<strong>每張桌都打完當前這手後，才一起發下一手</strong>。這樣短碼就無法靠拖延時間「躲」盲注。同一手中若不同桌有多人同時被淘汰，通常依規則平分相關名次的獎金。',
    ex: '剩 151 人、付前 150 名：各桌打完這一手就停下等待，全部完成後才同時發下一手。',
    rel: ['min-cash', 'icm', 'satellite', 'time-bank'] },

  { id: 'late-registration', term: 'Late Registration', zh: '晚報名', aka: ['Late Reg', 'LR', '延遲報名'],
    cat: 'tournament', imp: 1,
    short: '比賽開始後的一段時間內，仍然可以報名入場',
    def: '多數錦標賽會開放前幾個盲注級別晚報名，通常仍拿完整的起始籌碼。晚進場能<strong>省時間、跳過前期低盲注的瑣碎牌局</strong>，但起始籌碼換算成大盲變少，策略更接近短碼。職業玩家會依自己的優勢與賽事結構決定何時進場。',
    ex: '起始籌碼 20,000、晚報名截止時盲注 300/600：晚進場的人等於只有約 33bb。',
    rel: ['re-entry', 'm-ratio', 'push-fold', 'turbo'] },

  { id: 'turbo', term: 'Turbo / Hyper-Turbo', zh: '快速賽 / 極速賽', aka: ['Turbo', 'Hyper', 'Hyper-Turbo', '快速結構'],
    cat: 'tournament', imp: 1,
    short: '盲注升級間隔比標準賽短很多、籌碼很快變淺的錦標賽結構',
    def: '線上常見：標準賽每級 10–15 分鐘，<strong>Turbo 約 3–5 分鐘，Hyper-Turbo 約 1–3 分鐘</strong>。升盲越快，平均籌碼越淺、越早進入推擠階段，技術差距被壓縮、運氣比重變大，所以需要更多買入來承受變異數。',
    ex: 'Hyper-Turbo SNG 開賽沒幾分鐘，大家就剩 10bb 上下，開始全下或棄牌。',
    rel: ['sng', 'push-fold', 'm-ratio', 'bankroll'] }
);

// ---------------------------------------------------------------------------
// 9. 現金桌、現場規則與線上用語（basic）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'buy-in', term: 'Buy-in (BI)', zh: '買入（報名費）', aka: ['BI', 'Buy In', '入場費'],
    cat: 'basic', imp: 3,
    short: '坐上現金桌換籌碼的金額，或參加錦標賽要付的報名費',
    def: '現金桌標準買入是 <strong>100bb</strong>（例如 NL100 買入 $100），多數平台允許 40–100bb 甚至更多；錦標賽常寫成「$100 + $10」，前者進獎池、後者是主辦抽水。資金管理以「幾個買入」為單位：現金桌建議至少 30–50 個，錦標賽 100 個以上。',
    ex: '你有 $3,000 想打 NL100：$3,000 ÷ $100 = 30 個買入，剛好是現金桌的最低建議。',
    rel: ['bankroll', 'stakes', 'rebuy', 'table-stakes'] },

  { id: 'stakes', term: 'Stakes (NL2 / NL100 / 1/2)', zh: '級別（盲注大小）', aka: ['Limits', 'Micro Stakes', '微級別', '級數'],
    cat: 'basic', imp: 2,
    short: '牌局的盲注大小與買入金額，常用 NL 加數字或「小盲/大盲」表示',
    def: '線上寫法是 <strong>NL + 100bb 買入的美元數</strong>：NL2 = $0.01/$0.02、NL10 = $0.05/$0.10、NL100 = $0.50/$1。現場常寫「1/2」「2/5」代表小盲/大盲金額。一般把 NL25 以下稱為微級別（定義因社群而異）。不同級別的贏率都用 bb 為單位比較。',
    ex: 'NL100 的 100bb 買入是 $100；現場 1/2 桌的 100bb 則是 $200。',
    rel: ['buy-in', 'bb', 'bankroll', 'shot-take'] },

  { id: 'table-stakes', term: 'Table Stakes', zh: '桌上籌碼規則', aka: ['檯面籌碼', '桌面籌碼制'],
    cat: 'basic', imp: 2,
    short: '一手牌中只能用開始時已經在桌上的籌碼，不能臨時掏錢加碼',
    def: '這條規則保護籌碼較少的玩家：你<strong>最多只會輸掉桌上的籌碼</strong>，對手再有錢也不能用場外資金逼你棄牌；不夠跟注時就是全下，必要時形成邊池。反過來，牌局進行中也不能把桌上籌碼收進口袋（Ratholing）。',
    ex: '你桌上只剩 $80，對手下注 $500：你只要跟 $80 全下，多出來的部分退回給對手（多人時形成邊池）。',
    rel: ['side-pot', 'all-in', 'ratholing', 'buy-in'] },

  { id: 'orbit', term: 'Orbit', zh: '一圈（按鈕繞一輪）', aka: ['一輪', 'Round'],
    cat: 'basic', imp: 2,
    short: '按鈕繞桌一整圈、每位玩家都輪過一次大小盲所需的手數',
    def: '6 人桌一圈是 6 手、9 人桌是 9 手。每一圈你都要付一次小盲與大盲，所以<strong>每圈固定成本是 1.5bb</strong>（有前注時更多）。這就是為什麼什麼都不玩也會慢慢輸，也是錦標賽 M 值用「還能撐幾圈」衡量籌碼的原因。',
    ex: '現場禮儀常說：大贏一手之後，至少再打一圈再離開，避免被當成贏了就跑。',
    rel: ['sb', 'bb', 'm-ratio', 'hit-and-run'] },

  { id: 'full-ring', term: 'Full Ring vs 6-Max', zh: '滿桌（9 人桌）vs 6 人桌', aka: ['Full Ring', '6-Max', '9-Max', 'FR', '短桌'],
    cat: 'basic', imp: 2,
    short: '依每桌最多座位數區分的牌桌格式：滿桌 9–10 人、6 人桌最多 6 人',
    def: '人越少，每圈付盲注的頻率越高，<strong>每個位置的開池範圍都要更寬</strong>，翻後也更常單挑。6 人桌是線上現金局最主流的格式，也是本站範圍表的基準；現場與錦標賽多是 8–9 人桌，前位要比 6 人桌的 UTG 更緊。',
    ex: '6 人桌的 UTG 身後還有 5 人，位置相當於 9 人桌的 LJ（低劫位），所以兩者開池範圍相近。',
    rel: ['ep-mp-lp', 'utg', 'rfi', 'nlh'] },

  { id: 'short-deck', term: 'Short Deck (6+ Hold’em)', zh: '短牌德州撲克（6+）', aka: ['Short Deck', '6+ Hold’em', 'Six Plus', '短牌'],
    cat: 'basic', imp: 1,
    short: '拿掉 2 到 5、只用 36 張牌來玩的德州撲克變體',
    def: '每種花色只剩 9 張，<strong>同花比葫蘆更難湊，所以同花大於葫蘆</strong>；最小的順子變成 <strong>A-6-7-8-9</strong>（A 頂替 5 的位置）。部分場館還規定三條大於順子，開打前一定要先確認規則。牌少、牌力接近、動作多，在亞洲相當受歡迎。',
    ex: '短牌中你 <span class="cards">Ah9d</span>，牌面 <span class="cards">6s7c8hKdQs</span>：A-6-7-8-9 就是一個順子。',
    rel: ['nlh', 'straight', 'flush', 'full-house'] },

  { id: 'burn-card', term: 'Burn Card', zh: '燒牌', aka: ['Burn', '棄頂牌'],
    cat: 'basic', imp: 1,
    short: '發翻牌、轉牌、河牌之前，荷官先把牌堆最上面一張面朝下丟掉',
    def: '燒牌是防弊措施：如果有人偷看到或在最上面那張牌做了記號，燒掉它就不會影響接下來的公共牌。一手牌共燒 <strong>3 張</strong>（翻牌、轉牌、河牌前各一張）。燒牌不屬於任何人，也不會被亮出來。',
    ex: '荷官燒一張牌後翻出 3 張翻牌；之後轉牌、河牌前也各燒一張。',
    rel: ['flop', 'turn', 'river', 'misdeal'] },

  { id: 'muck', term: 'Muck', zh: '棄牌堆（蓋牌不亮）', aka: ['Mucked', '蓋掉', '丟進牌堆'],
    cat: 'basic', imp: 2,
    short: '荷官收集棄牌的那一堆牌；也指把自己的牌面朝下丟進去不給人看',
    def: '牌一旦碰到棄牌堆就成為<strong>死牌</strong>，就算原本是贏家也不能拿回來。攤牌時輸家可以直接 Muck 不亮牌，避免洩漏自己的打法；但若想爭取底池，就必須把兩張牌完整亮出。',
    ex: '對手河牌亮出順子，你知道自己只有兩對：直接把牌蓋進棄牌堆即可。',
    rel: ['showdown', 'fold', 'misdeal'] },

  { id: 'time-bank', term: 'Time Bank', zh: '時間銀行（延時額度）', aka: ['Timebank', 'Shot Clock', '延時卡'],
    cat: 'basic', imp: 1,
    short: '基本思考時間用完後，可以額外動用的延長思考秒數',
    def: '線上平台與許多現場賽事都有每手的行動時限（Shot Clock），另外給一筆可以累積或定期補充的時間銀行。只在關鍵大底池動用，平常快速行動；也要小心<strong>別讓動用時間的習慣變成時間馬腳</strong>，例如只有拿大牌時才長考。',
    ex: '線上河牌面對全下，15 秒基本時間用完後，系統開始扣你的 60 秒時間銀行。',
    rel: ['tank', 'tell', 'hand-for-hand'] },

  { id: 'misdeal', term: 'Misdeal', zh: '發牌錯誤（重發）', aka: ['Mis-deal', '誤發', '重發牌'],
    cat: 'basic', imp: 1,
    short: '發牌出錯導致這手牌作廢，所有牌收回、重新洗牌再發',
    def: '常見情況：發錯人數、發牌時翻開了第一或第二張牌、按鈕位置錯誤等。一般原則是<strong>還沒有實質行動之前</strong>才判定重發；若已有多人行動，通常改用修正錯誤的方式繼續。細節依各場館或 TDA 規則而定，發現問題要立刻提出。',
    ex: '荷官發牌時不小心把第一張牌翻開，這手牌宣布 misdeal 並重新發牌。',
    rel: ['burn-card', 'muck'] },

  { id: 'string-bet', term: 'String Bet', zh: '分段下注（拉線下注）', aka: ['String Raise', '分次放籌碼'],
    cat: 'basic', imp: 2,
    short: '沒有先口頭宣告，就分好幾次動作把籌碼推出去的違規下注',
    def: '現場規則要求：下注或加注時若沒先說出金額，必須<strong>一次連續動作</strong>把籌碼放出；先推一部分、再回手拿更多，會被判定只算第一次的動作（常常變成只是跟注）。避免爭議最簡單的方法：<strong>先說「加注到 X」</strong>，口頭宣告具有約束力。',
    ex: '對手下注 $20，你先推出 $20、停頓後再拿 $40 想加注：荷官會判定你只是跟注 $20。',
    rel: ['one-chip-rule', 'raise', 'angle-shoot'] },

  { id: 'one-chip-rule', term: 'One-Chip Rule', zh: '單一籌碼規則', aka: ['One Chip Rule', '單枚籌碼視為跟注'],
    cat: 'basic', imp: 1,
    short: '面對下注時默默丟出一枚大面額籌碼，只會被當成跟注',
    def: '前面已有人下注時，你<strong>沒說話</strong>就放出一枚面額大於跟注額的籌碼，荷官會視為跟注並找零；想加注必須在籌碼放出前或同時說「加注」。前面沒人下注時丟出一枚大籌碼，則視為下注那枚籌碼的全額。',
    ex: '對手下注 $25，你默默丟出一枚 $100 籌碼：只算跟注 $25，荷官找你 $75。',
    rel: ['string-bet', 'call', 'raise'] },

  { id: 'insurance', term: 'All-in Insurance', zh: '全下保險', aka: ['Insurance', '買保險', '保險'],
    cat: 'basic', imp: 1,
    short: '現金局全下並亮牌後，領先方付保費給莊家，若被反超就由莊家理賠',
    def: '常見於亞洲（含台灣）的現場局與部分俱樂部 App：全下亮牌後，<strong>暫時領先的一方</strong>可以依對手的 Outs 數買保險，被反超時領回賠款。保險給的賠率會比公平機率略差，所以<strong>長期是 −EV</strong>，買的是降低變異數與心情穩定；錦標賽不提供保險。',
    ex: '轉牌全下時你領先，對手聽同花 9 張 Outs：買了全額保險，河牌就算出同花，你也能拿回大部分損失。',
    rel: ['run-it-twice', 'all-in', 'outs', 'bankroll'] },

  { id: 'rakeback', term: 'Rakeback', zh: '抽水返還', aka: ['RB', 'Rewards', '返水', '回饋'],
    cat: 'basic', imp: 2,
    short: '平台把你付出的抽水按比例退還給你的回饋制度',
    def: '例如你一個月付了 $1,000 抽水、返還比例 30%，就能拿回 $300。在低級別，抽水佔底池的比例高，<strong>返還常常決定你是小輸還是小贏</strong>。計算真實贏率時，要把「牌桌上的贏率」和「含返還的總收入」分開來看。',
    ex: '你在 NL25 的牌桌贏率 +1 bb/100，但返還相當於 +3 bb/100：你主要是靠返還獲利。',
    rel: ['rake', 'stakes', 'bankroll'] }
);

// ---------------------------------------------------------------------------
// 10. 牌桌俚語、禮儀與心態用語（slang）
// ---------------------------------------------------------------------------
GTO.GLOSSARY_EXTRA.push(
  { id: 'hero-fold', term: 'Hero Fold', zh: '英雄棄牌', aka: ['Big Laydown', '神蓋', '勇敢棄牌'],
    cat: 'slang', imp: 2,
    short: '拿著看起來很強的牌，根據讀牌判斷對手領先而果斷棄掉',
    def: '與英雄跟注（Hero Call）相反。好的英雄棄牌建立在<strong>對手路線與大眾池傾向</strong>上，例如保守玩家在河牌突然過牌加注，或低級別玩家在多人底池連開三槍大注。但若太常英雄棄牌，就會被懂得詐唬的對手剝削，所以要搭配 MDF 與對手類型一起判斷。',
    ex: '超緊玩家翻前 5-Bet 全下，你拿 <span class="hand">KK</span> 棄牌：如果他只會拿 <span class="hand">AA</span> 這樣做，這就是正確的英雄棄牌。',
    rel: ['hero-call', 'overbluff', 'population-tendency', 'sunk-cost'] },

  { id: 'punt', term: 'Punt', zh: '大失誤（亂丟籌碼）', aka: ['Punting', '送分', '暴走'],
    cat: 'slang', imp: 1,
    short: '做出明顯很差的決定，把一大筆籌碼或錦標賽生命白白送掉',
    def: 'Punt 通常指<strong>單次的重大失誤</strong>，例如錦標賽深處拿弱牌全下詐唬、河牌拿空氣跟注全下。它常是疲勞、上頭或想太多的結果。和 Spew 的差別：Punt 偏向一次性的大錯，Spew 則是持續性地漏籌碼。',
    ex: '比賽打了 8 小時，你在泡沫期拿 <span class="hand">J4o</span> 對籌碼王全下詐唬被跟注：標準的 punt。',
    rel: ['spew', 'tilt', 'leveling', 'a-game'] },

  { id: 'spew', term: 'Spew', zh: '漏籌碼（亂噴）', aka: ['Spewing', 'Spewy', '噴籌碼'],
    cat: 'slang', imp: 1,
    short: '持續用不合理的詐唬或過度激進的打法，一點一點把籌碼送出去',
    def: '典型的 Spew：沒有計畫地連續開槍、在對手不可能棄牌的地方詐唬、輸了以後放寬範圍想贏回來，常和上頭（Tilt）一起出現。用追蹤軟體看<strong>紅線</strong>與特定路線的盈虧，可以找出自己是否在某些情境持續漏籌碼。',
    ex: '你一晚上對同一個跟注站詐唬了 5 次，每次都被抓：這就是在 spew。',
    rel: ['punt', 'tilt', 'red-line', 'overbluff'] },

  { id: 'run-good', term: 'Run Good / Run Bad', zh: '手氣好 / 手氣差', aka: ['Running Hot', 'Running Bad', 'Heater', '手熱', '手冷'],
    cat: 'slang', imp: 2,
    short: '實際結果明顯高於或低於期望值的一段運氣表現',
    def: 'Run Good 不是技術，而是短期拿到的牌比平均好，連續手熱的一段時間常被叫做 <strong>Heater</strong>。判斷是運氣還是實力，可以比較實際盈虧與<strong>全下 EV 線</strong>：實際線遠高於 EV 線就是 Run Good。手熱時別急著升級，手冷時別懷疑正確的打法。',
    ex: '這個月你全下時拿 30% 勝率的牌卻贏了一半以上，實際盈虧比 EV 多出 8 個買入：你在 run good。',
    rel: ['all-in-ev', 'downswing', 'results-oriented', 'bankroll'] },

  { id: 'downswing', term: 'Downswing', zh: '下風期（連輸期）', aka: ['Losing Streak', 'Upswing', '逆風期', '上風期'],
    cat: 'slang', imp: 2,
    short: '一段持續輸錢、資金曲線明顯下滑的期間，即使打法正確也會發生',
    def: '因為標準差遠大於贏率，<strong>贏家經歷 10–20 個買入的下風期非常正常</strong>，甚至更長；錦標賽更可能連續上百場不進錢圈。面對下風期：確認資金足夠、用 EV 線檢查是否真有漏洞、必要時降級，而不是改變正確打法去追回損失。相反的連贏期叫 Upswing。',
    ex: '贏率 5 bb/100 的玩家在 5 萬手內遇到 15 個買入的下風期，在數學上一點都不奇怪。',
    rel: ['bankroll', 'standard-deviation', 'risk-of-ruin', 'run-good'] },

  { id: 'chop', term: 'Chop', zh: '平分（分池 / 分錢協議）', aka: ['Split Pot', 'Chop the Blinds', 'Deal', 'ICM Chop', '分池'],
    cat: 'slang', imp: 2,
    short: '平分底池或獎金的各種情況：牌力相同、盲注互退或錦標賽協議分錢',
    def: '三種常見用法：① <strong>分池</strong>：攤牌時牌力完全相同，平分底池；② <strong>Chop the Blinds</strong>：現場現金桌前面全部棄牌時，大小盲同意各自收回盲注、不打這一手；③ <strong>錦標賽 Deal</strong>：決賽階段剩下的玩家協議依籌碼比例或 ICM 分配剩餘獎金。',
    ex: '你 <span class="hand">AK</span>、對手也是 <span class="hand">AK</span>，五張公共牌沒有讓任何一方成同花：兩人平分底池。',
    rel: ['play-the-board', 'final-table', 'icm', 'kicker'] },

  { id: 'chip-and-a-chair', term: 'A Chip and a Chair', zh: '一枚籌碼一張椅子（永不放棄）', aka: ['Chip and a Chair', '還有希望'],
    cat: 'slang', imp: 1,
    short: '「只要還有一枚籌碼和座位，就還有機會贏」的撲克名言',
    def: '典故來自 <strong>1982 年 WSOP 主賽事</strong>：Jack Straus 以為自己全下輸光、正要離開，才發現桌上還藏著一枚籌碼；因為他沒有宣告全下，仍可繼續比賽，最後一路逆轉奪冠。這句話提醒錦標賽短碼別放棄，但也別因此在該推擠時拖延。',
    ex: '剩 1.5bb 時抓到好牌翻倍、再翻倍，最後打進決賽桌：這就是 chip and a chair 的精神。',
    rel: ['push-fold', 'm-ratio', 'mtt-cash'] },

  { id: 'tank', term: 'Tank', zh: '長考', aka: ['Tanking', 'Tank Call', 'Tank Fold', '進入長考'],
    cat: 'slang', imp: 1,
    short: '在一個決策上思考非常久，常見於大底池或面對全下的時候',
    def: '「Tank Call」是長考後跟注、「Tank Fold」是長考後棄牌。大底池長考很正常，但不要每手都長考拖慢遊戲。長考本身不代表強或弱，<strong>要對照該玩家平常的節奏</strong>，也要留意有人會刻意演出長考（Hollywood）來誤導你。',
    ex: '對手面對你的河牌全下長考 3 分鐘後才跟注，亮出一對 A 抓到你的詐唬。',
    rel: ['time-bank', 'tell', 'snap-call', 'hollywood'] },

  { id: 'snap-call', term: 'Snap Call', zh: '秒跟', aka: ['Snap', 'Insta-call', 'Snap Fold', '秒棄'],
    cat: 'slang', imp: 1,
    short: '對手一下注就立刻跟注，幾乎不花任何思考時間',
    def: '面對全下時秒跟，通常代表很強的牌；面對還可以加注的下注時秒跟，反而常是<strong>不打算加注的中等牌或聽牌</strong>，因為真正的堅果會考慮加注。這是時間馬腳的一種。相對的「秒棄（Snap Fold）」則是完全不考慮就棄牌。',
    ex: '你河牌全下，對手 snap call 亮出堅果：那一刻你就知道這次詐唬失敗了。',
    rel: ['tell', 'tank', 'hollywood'] },

  { id: 'hollywood', term: 'Hollywood', zh: '演戲（好萊塢）', aka: ['Hollywooding', '演技派', '假動作'],
    cat: 'slang', imp: 1,
    short: '故意誇張地表演猶豫或痛苦，誤導對手判斷你的牌力',
    def: '例如拿堅果卻嘆氣、搖頭、長考很久才跟注，想讓對手以為你很弱而繼續下注；或拿空氣卻裝得很輕鬆。適度表演不違規，但<strong>過度拖延或刻意誤導會被視為不禮貌</strong>。面對愛演戲的玩家，最可靠的還是下注路線而不是表情。',
    ex: '對手嘆了一大口氣、想了兩分鐘才「勉強」跟注，攤牌是葫蘆：典型的 Hollywood。',
    rel: ['tell', 'tank', 'slow-roll', 'angle-shoot'] },

  { id: 'slow-roll', term: 'Slow Roll', zh: '故意慢亮牌', aka: ['Slowroll', '慢亮'],
    cat: 'slang', imp: 1,
    short: '攤牌時明知自己贏，卻故意拖很久才亮牌，讓對手以為自己贏了',
    def: '這是撲克圈公認<strong>最沒禮貌的行為之一</strong>，雖然通常不違規，卻非常容易引發衝突。正確禮儀是：輪到你亮牌或知道自己贏時，乾脆地把牌翻開。注意和「慢打（Slowplay）」不同：慢打是下注策略，慢亮是攤牌時的失禮行為。',
    ex: '對手全下後你拿堅果跟注，卻假裝猶豫半天才亮牌：標準的 slow roll。',
    rel: ['showdown', 'slowplay', 'hollywood', 'angle-shoot'] },

  { id: 'angle-shoot', term: 'Angle Shooting', zh: '鑽規則漏洞（奧步）', aka: ['Angle', 'Angle Shooter', '奧步', '耍詐'],
    cat: 'slang', imp: 1,
    short: '利用規則模糊地帶或誤導性動作占便宜，不一定違規但違反撲克精神',
    def: '常見例子：故意做出像要跟注的動作觀察對手反應、假裝棄牌騙對手亮牌、把大面額籌碼藏在後面讓人誤判籌碼量、使用模糊的口頭宣告。被抓到可能遭警告或處罰；<strong>遇到疑似狀況要立刻請荷官或樓面處理</strong>，不要自己爭吵。',
    ex: '對手嘴上說「我大概會跟吧……」，觀察你的反應後才突然加注：這就是在 angle shooting。',
    rel: ['string-bet', 'slow-roll', 'hollywood', 'one-chip-rule'] },

  { id: 'splash-the-pot', term: 'Splash the Pot', zh: '把籌碼丟進底池', aka: ['Splashing', '濺池'],
    cat: 'slang', imp: 1,
    short: '下注時把籌碼直接丟進中央底池堆裡的違規動作',
    def: '籌碼一旦混進底池，荷官和對手就<strong>無法確認你到底下了多少</strong>，很容易引發糾紛。現場規則要求把下注籌碼整齊放在自己面前，由荷官確認後再收進底池。新手常不小心犯這個錯，先學會這條禮儀能少很多麻煩。',
    ex: '你想跟注 $15：把籌碼放在自己前方的下注線內，而不是丟到中間那堆籌碼上。',
    rel: ['string-bet', 'one-chip-rule', 'angle-shoot'] },

  { id: 'rabbit-hunt', term: 'Rabbit Hunt', zh: '獵兔（偷看後面的牌）', aka: ['Rabbit Hunting', '看剩下的牌'],
    cat: 'slang', imp: 1,
    short: '一手牌提前結束後，要求荷官翻出沒發的公共牌，看「如果繼續會怎樣」',
    def: '這純粹是好奇，對結果沒有任何影響，卻會拖慢遊戲，也可能洩漏資訊或影響情緒，所以<strong>多數正式場館與錦標賽都禁止</strong>，只有部分休閒局允許。想知道結果，不如回家用勝率計算器算一算。',
    ex: '你在河牌前被下注而棄掉同花聽牌，問荷官「可以看一下河牌嗎？」：這就是 Rabbit Hunt。',
    rel: ['results-oriented', 'burn-card'] },

  { id: 'bomb-pot', term: 'Bomb Pot', zh: '炸彈底池', aka: ['Bomb', '全員底池'],
    cat: 'slang', imp: 1,
    short: '全桌每人先放入約定金額、跳過翻前下注，直接發翻牌開打的特殊牌局',
    def: '現場現金桌的娛樂玩法，常在每圈或換荷官時打一次，也有<strong>雙公牌（Double Board）</strong>版本，兩組公共牌各分一半底池。因為是多人底池、大家的範圍完全隨機，翻後要更重視堅果潛力，不要拿一對就打光籌碼。',
    ex: '6 人桌每人放 2bb 打 Bomb Pot：翻牌前底池就有 12bb，而且 6 個人全部參與。',
    rel: ['multiway-pot', 'straddle', 'nuts'] },

  { id: 'shot-take', term: 'Shot Taking', zh: '越級挑戰', aka: ['Take a Shot', 'Move Up', '打高一級'],
    cat: 'slang', imp: 1,
    short: '用資金的一小部分，暫時到比平常高一級的牌局試打',
    def: '有紀律的越級要先設好規則：例如只拿出 <strong>3–5 個高級別買入</strong>試打，輸完就退回原級別，不要用整份資金硬撐。越級時對手平均更強、贏率通常會下降，要用足夠的樣本判斷自己是否真的打得過，而不是只看一兩次結果。',
    ex: '你在 NL50 有 40 個買入，決定拿 5 個 NL100 買入（$500）越級試打，輸完就退回 NL50。',
    rel: ['bankroll', 'stakes', 'risk-of-ruin', 'sample-size'] },

  { id: 'ratholing', term: 'Ratholing', zh: '偷收籌碼', aka: ['Rathole', 'Going South', '收碼'],
    cat: 'slang', imp: 1,
    short: '現金局進行中把桌上部分籌碼收起來、鎖定獲利的違規行為',
    def: '這違反<strong>桌上籌碼規則（Table Stakes）</strong>：你贏了錢，卻偷偷縮小自己可能輸掉的籌碼量，對其他玩家不公平。許多場館也規定贏錢離桌後一段時間內（例如 1–2 小時）回到同一牌局，必須帶回至少離開時的籌碼量，防止「離開再用最低買入回來」的變相收碼。',
    ex: '你贏到 $600 後，把 $300 收進口袋、只留 $300 繼續打：這就是 ratholing。',
    rel: ['table-stakes', 'hit-and-run', 'buy-in'] },

  { id: 'hit-and-run', term: 'Hit and Run', zh: '贏了就跑', aka: ['Hit & Run', '打了就走', '贏完就閃'],
    cat: 'slang', imp: 1,
    short: '坐下沒多久、贏了一個大底池就立刻離桌兌現',
    def: '規則上完全允許，你從來沒有義務一直坐著；但在現場被視為<strong>不太禮貌</strong>，容易讓輸錢的玩家不滿。常見禮儀是大贏後至少再打一圈（Orbit）再離開。從策略角度看，好的牌局本來就值得多打，不該因為怕輸回去而急著走。',
    ex: '剛坐下第三手就贏了對手 200bb，立刻起身換籌碼離開：這就是 hit and run。',
    rel: ['orbit', 'ratholing', 'table-selection'] },

  { id: 'rta', term: 'RTA (Real-Time Assistance)', zh: '即時輔助（作弊）', aka: ['RTA', 'Real-Time Assistance', 'Ghosting', 'Collusion', '代打', '串通'],
    cat: 'slang', imp: 2,
    short: '在牌局進行中使用 Solver、範圍表或他人指導做決策的作弊行為',
    def: '賽後用 Solver 研究完全合法；但<strong>在手牌進行中查詢</strong> Solver 或圖表就是 RTA，主流平台都明確禁止，查到會封號、沒收資金。其他常見作弊還有<strong>代打（Ghosting）</strong>：讓高手遠端指導或操作帳號；以及<strong>串通（Collusion）</strong>：同桌玩家互通底牌或互相放水。',
    ex: '線上牌局一邊打、一邊把局面輸入 GTO 軟體看建議：這就是 RTA，屬於作弊。',
    rel: ['solver', 'hud', 'hand-history'] }
);

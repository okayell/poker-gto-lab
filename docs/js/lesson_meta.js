/* GTO 撲克學院 — lesson_meta.js：既有 24 課的一句話重點、白話比喻與參考來源
 * 依 CONTENT_GUIDE.md 第 11 節格式；sources 皆為以 search_web 查到、並確認可連線的真實網址。
 * 數字與 theory_part1.js / theory_part2.js 及全站基準（6-max、100bb、UTG 17%…BTN 45%）一致。
 */
window.GTO = window.GTO || {};
GTO.LESSON_META = Object.assign(GTO.LESSON_META || {}, {
  rules: {
    tldr: '每人 2 張底牌搭配 5 張公共牌，取最好的 5 張比大小；一手牌共有翻前、翻牌、轉牌、河牌四輪下注。',
    plain: '德州撲克就像「七選五」的組牌遊戲：你手上 2 張牌只有自己看得到，桌上 5 張大家共用，最後誰能湊出最強的 5 張就贏。每發一次牌就有一輪「喊價」，你可以加碼、跟進或放棄。比大小只看最好的 5 張，花色沒有大小之分。',
    sources: [
      { title: 'PokerNews — Texas Hold’em Poker Rules', url: 'https://www.pokernews.com/poker-rules/texas-holdem.htm' },
      { title: 'Upswing Poker — Poker Hand Rankings', url: 'https://upswingpoker.com/poker-hands-rankings/' },
      { title: 'Bicycle Cards — How to Play Texas Hold’em Poker', url: 'https://bicyclecards.com/how-to-play/texas-holdem-poker' },
    ],
  },
  positions: {
    tldr: '越晚行動越有利：按鈕位翻後永遠最後說話，能看完對手動作再決定，所以開池範圍最寬、長期最賺錢。',
    plain: '位置就像猜拳時最後出拳：別人都先亮了，你再決定出什麼，當然佔便宜。UTG 最早說話，身後還有 5 個人可能拿到大牌，所以要很挑牌；按鈕位身後只剩兩個盲注，翻後又永遠最後行動，可以玩得最寬。',
    sources: [
      { title: 'Upswing Poker — 6-Max Poker Strategy', url: 'https://upswingpoker.com/6-handed-max-poker-strategy/' },
      { title: 'ThinkGTO — Poker Positions Explained', url: 'https://thinkgto.com/guides/poker-positions-explained' },
    ],
  },
  'hands-combos': {
    tldr: '1,326 種起手組合中，每種對子 6 組、同花 4 組、非同花 12 組；你手上的牌會減少對手的組合數。',
    plain: '把起手牌想成抽籤：AA 只有 6 支籤、AKs 只有 4 支、AKo 卻有 12 支，所以「對手拿 AK」比「對手拿 AA」常見得多。如果你手上已經握著一張 A，就等於先抽走了幾支 A 的籤，對手拿到 AA 的組合立刻從 6 組剩 3 組，這就是阻擋牌的原理。',
    sources: [
      { title: 'GTO Wizard — A Beginner’s Guide to Poker Combinatorics', url: 'https://blog.gtowizard.com/a-beginners-guide-to-poker-combinatorics/' },
      { title: 'PokerCoaching — Poker Combinations', url: 'https://pokercoaching.com/blog/poker-combinations/' },
      { title: 'Upswing Poker — How the Pros Take Advantage of Hand Combinations', url: 'https://upswingpoker.com/how-the-pros-take-advantage-of-hand-combinations/' },
    ],
  },
  'poker-math': {
    tldr: '跟注前先算「要付多少、能贏多少」：只要勝率高於必要勝率（底池賠率），長期來看就是賺錢的決定。',
    plain: '撲克數學就像買東西比價：花 25 元、有機會把 100 元的底池全拿走，只要贏的機率超過 25% 就值得買。底池賠率是「價格」，勝率是「中獎率」，期望值（EV）則是這筆交易重複一千次後平均賺或賠多少。單次輸贏不重要，重要的是每次都做 +EV 的決定。',
    sources: [
      { title: 'PokerCoaching — Poker Math', url: 'https://pokercoaching.com/poker-math/' },
      { title: 'ThinkGTO — Pot Odds, Equity & Expected Value Explained', url: 'https://thinkgto.com/blog/pot-odds-equity-expected-value-explained' },
      { title: 'PokerSkill — Poker Odds Explained', url: 'https://www.pokerskill.com/blog/poker-odds-explained/' },
    ],
  },
  'gto-intro': {
    tldr: 'GTO 是不怕被針對的平衡打法：對手怎麼調整都佔不到便宜，是看不懂對手時最安全的預設策略。',
    plain: 'GTO 就像猜拳時每次都隨機出拳，剪刀、石頭、布各三分之一：對手再聰明也抓不到規律，長期最多只能和你打平。撲克的 GTO 更複雜，會用精準的頻率混合下注與過牌，讓對手不管跟注或棄牌都拿不到額外好處。等你看出對手有明顯漏洞，再偏離 GTO 去剝削他。',
    sources: [
      { title: 'GTO Wizard — The Three Laws of Indifference', url: 'https://blog.gtowizard.com/the-three-laws-of-indifference/' },
      { title: 'ThinkGTO — Nash Equilibrium (Glossary)', url: 'https://thinkgto.com/glossary/nash-equilibrium' },
      { title: 'Upswing Poker — GTO vs Exploitative Play', url: 'https://upswingpoker.com/gto-vs-exploitative-play-game-theory-optimal-strategy/' },
    ],
  },
  'mdf-alpha': {
    tldr: '下注越小，防守方要守得越多：MDF = 底池 ÷（底池 + 下注），詐唬所需棄牌率 Alpha = 1 − MDF。',
    plain: '想像對手花 1 元去搶桌上 2 元的紅包：只要你棄牌超過三分之一，他拿任何爛牌下注都穩賺。MDF 就是「至少要守住多少」的防線，Alpha 則是詐唬者需要你棄牌的比例，兩者加起來剛好 100%。下注越小，對手冒的風險越小，你就得守得越寬。',
    sources: [
      { title: 'GTO Wizard — Minimum Defense Frequency (MDF)', url: 'https://gtowizard.com/en/glossary/minimum-defense-frequency-mdf/' },
      { title: 'PokerSkill — Minimum Defense Frequency', url: 'https://www.pokerskill.com/poker-glossary/minimum-defense-frequency/' },
      { title: 'ThinkGTO — MDF (Minimum Defense Frequency)', url: 'https://thinkgto.com/glossary/mdf-minimum-defense-frequency' },
    ],
  },
  'value-bluff': {
    tldr: '河牌下注越大，可以放的詐唬越多：下 1 倍底池時價值與詐唬約 2:1，讓對手跟注或棄牌的 EV 一樣。',
    plain: '下注範圍就像一盒混裝巧克力：如果全是真巧克力（價值牌），對手一看到你下大注就棄；如果全是空盒（詐唬），對手每次都跟。GTO 會依下注大小調配真假比例，讓對手怎麼選都不賺。下大注時「真巧克力加空盒」叫極化，下小注時放一整排中強牌叫線性。',
    sources: [
      { title: 'Upswing Poker — What Is the Bluff-to-Value Ratio?', url: 'https://upswingpoker.com/what-is-bluff-to-value-ratio/' },
      { title: 'Upswing Poker — Polarized vs Linear Ranges', url: 'https://upswingpoker.com/polarized-vs-linear-ranges/' },
      { title: 'PokerSkill — Optimal Bluffing Frequency Formula', url: 'https://www.pokerskill.com/blog/optimal-bluffing-frequency-formula/' },
    ],
  },
  'range-thinking': {
    tldr: '別只看自己兩張牌：範圍優勢決定下注頻率，堅果優勢決定下注尺度，先判斷牌面對誰的範圍有利。',
    plain: '範圍思維像比較兩支球隊的整體陣容，而不是只看一位球員：A 高乾燥牌面時，翻前加注者整隊都是強打者，可以頻繁進攻；低張連接牌面時，跟注者的陣容反而更合適，加注者就要收斂。誰手上的「王牌（堅果）」比較多，誰才有本錢下大注。',
    sources: [
      { title: 'GTO Wizard — The Mechanics of C-Bet Sizing', url: 'https://blog.gtowizard.com/the-mechanics-of-c-bet-sizing/' },
      { title: 'PokerStrategy — Range Advantage vs Nutted Advantage', url: 'https://www.pokerstrategy.com/news/content/Range-Advantage-vs-Nutted-Advantage_116542/' },
      { title: 'Upswing Poker — Nut Range & Positional Advantage', url: 'https://upswingpoker.com/nut-range-positional-advantage/' },
      { title: 'PokerCoaching — Dominating with Nut Advantage', url: 'https://pokercoaching.com/blog/dominating-with-nut-advantage-a-key-edge-in-poker-strategy/' },
    ],
  },
});

Object.assign(GTO.LESSON_META, {
  'equity-realization': {
    tldr: '帳面勝率不等於能拿到的底池：有位置、同花、連張的牌容易兌現勝率，沒位置的雜色牌常被迫中途放棄。',
    plain: '原始勝率像彩券上印的中獎機率，權益實現率則是你真正能領到多少獎金。沒位置又不好打的牌，常常還沒到攤牌就被對手下注逼退，等於彩券還沒開獎就被迫丟掉；有位置的同花連張則能便宜看牌、中了還能多贏，實際拿到的比帳面還多。',
    sources: [
      { title: 'GTO Wizard — Equity Realization', url: 'https://blog.gtowizard.com/equity-realization/' },
      { title: 'Upswing Poker — Equity Realization Explained', url: 'https://upswingpoker.com/equity-realization-explained/' },
      { title: 'ThinkGTO — Equity Realization (Glossary)', url: 'https://thinkgto.com/glossary/equity-realization' },
    ],
  },
  'preflop-rfi': {
    tldr: '前面都棄牌時只選「加注或棄牌」、不要平跟溜入；位置越後面開得越寬：UTG 約 17%、BTN 約 45%。',
    plain: '開池就像第一個站出來競標：要嘛喊價拿下主導權，要嘛乾脆不參加；只跟大盲「溜進去」，既拿不到主動權，又會招來更多人一起分。越前面的位置，身後還沒表態的人越多、越可能撞上大牌，所以要越挑；坐在按鈕位時只剩兩個盲注，就能放手偷盲。',
    sources: [
      { title: 'Upswing Poker — Preflop Open Strategy (RFI) Explained', url: 'https://upswingpoker.com/preflop-open-strategy-rfi-explained/' },
      { title: 'Red Chip Poker — Preflop Poker Charts', url: 'https://redchippoker.com/preflop-poker-charts/' },
      { title: 'ThinkGTO — Preflop Ranges: Building Your Opening Strategy', url: 'https://thinkgto.com/blog/preflop-ranges-building-your-opening-strategy' },
    ],
  },
  'preflop-vs-open': {
    tldr: '面對開池時，大盲以外的位置多半「3-Bet 或棄牌」，平跟主要留給按鈕位與大盲，避免被後面擠壓。',
    plain: '面對別人開池，就像有人先出了價：你可以加價搶（3-Bet）、跟著出一樣的價（平跟），或退出。如果身後還有人沒表態，平跟很容易被後面的人「擠壓」，逼你白白丟掉跟注的錢，所以多半加價或退出；大盲已經先付了一部分、又是最後一個表態，價格最划算，才能平跟比較多。',
    sources: [
      { title: 'Upswing Poker — Cold Calling in Cash Games', url: 'https://upswingpoker.com/cold-calling-cash-games/' },
      { title: 'PokerSkill — Cold Call vs 3-Bet', url: 'https://www.pokerskill.com/blog/cold-call-vs-3-bet/' },
      { title: 'BBZ Poker — 3-Bet vs Call: Why Flatting Wide Preflop Sucks', url: 'https://bbzpoker.com/3-bet-vs-call-why-flatting-wide-preflop-sucks/' },
    ],
  },
  'preflop-3bet': {
    tldr: '沒有平跟範圍時用線性 3-Bet（由強到弱一路往下），有平跟範圍時用極化 3-Bet（強牌加 A5s 這類阻擋牌）。',
    plain: '3-Bet 範圍有兩種組法：線性像「從排行榜第一名一路取到第 N 名」，適合沒位置、不想平跟的時候；極化像「冠軍再加上幾個奇兵」，中間的牌留著平跟。A5s 就是最好的奇兵：手上的 A 讓對手更難有 AA、AK，被跟注了還有機會中同花或輪子順。',
    sources: [
      { title: 'Upswing Poker — Polarized vs Linear Ranges', url: 'https://upswingpoker.com/polarized-vs-linear-ranges/' },
      { title: 'Smart Poker Study — Bluff 3-Bets (Podcast #107)', url: 'https://smartpokerstudy.com/bluff-3bets-med-3-class-3-poker-podcast-107/' },
      { title: 'PokerCoaching — Squeezing in Poker', url: 'https://pokercoaching.com/blog/squeezing-in-poker/' },
    ],
  },
  'preflop-vs-3bet': {
    tldr: '被 3-Bet 時先看位置：翻後沒位置就多 4-Bet、少平跟；有位置時可以多用同花大牌與中對子平跟。',
    plain: '被 3-Bet 就像對方把價格抬高：如果接下來每條街都得你先表態（沒位置），跟進去只會一路被動挨打，不如直接再加價或放棄；如果之後都能後手行動（有位置），就可以多跟進去看翻牌。容易被壓制的雜色大牌（像 AJo、KQo）在沒位置時最好放手。',
    sources: [
      { title: 'Upswing Poker — Vs 3-Bet Preflop Position Strategy', url: 'https://upswingpoker.com/vs-3-bet-pre-flop-position-strategy-revealed/' },
      { title: 'PokerCoaching — 3-Bet Calling Ranges', url: 'https://pokercoaching.com/blog/3-bet-calling-ranges/' },
      { title: 'ThinkGTO — Preflop Strategy Masterclass', url: 'https://thinkgto.com/guides/preflop-strategy-masterclass' },
    ],
  },
  'preflop-4bet': {
    tldr: '100bb 下 4-Bet 約 20–23bb，價值靠 AA、KK，詐唬用 A5s 等阻擋牌；再被 5-Bet 通常就是全下。',
    plain: '4-Bet 是牌桌上的「第三次加價」，而籌碼只有 100bb 時，再往上一步就是全部押上。所以 4-Bet 不必直接全下，下到二十多 bb 就足以施壓；拿詐唬牌被對手全下時也能安心棄牌，保住大部分籌碼。價值牌和詐唬牌要搭配好，對手才猜不透。',
    sources: [
      { title: 'Upswing Poker — 4-Bet Size Strategy', url: 'https://upswingpoker.com/4-bet-size-strategy/' },
      { title: 'GTO Wizard — OOP 4-Betting in Deep-Stacked Cash Games', url: 'https://blog.gtowizard.com/oop-4-betting-in-deep-stacked-cash-games/' },
      { title: 'PokerCoaching — 4-Betting Strategy', url: 'https://pokercoaching.com/blog/4-betting-strategy/' },
      { title: 'PokerStrategy — 5-Bet Bluff Push vs 4-Bet', url: 'https://www.pokerstrategy.com/strategy/weekly-no-limit/5bet-bluff-push-vs-4bet/' },
    ],
  },
  'board-texture': {
    tldr: '翻牌一出來先看四件事：高低、花色、連接度、有沒有成對，就能判斷牌面對加注者還是跟注者有利。',
    plain: '讀牌面就像看天氣：A 高、彩虹、不連接的牌面是「晴天」，局勢穩定，翻前加注者可以小注頻繁出擊；中低張、雙色又連接的牌面是「暴風雨」，隨時有人中順子或同花，下注要更謹慎，或用更大的注保護。先判斷天氣，再決定要不要出門、帶多大的傘。',
    sources: [
      { title: 'Upswing Poker — Board Texture Tips', url: 'https://upswingpoker.com/board-texture-tips/' },
      { title: 'GTO Wizard — How to Analyze Flop Textures', url: 'https://blog.gtowizard.com/how-to-analyze-flop-textures/' },
      { title: 'PokerNews — Board Texture in Poker', url: 'https://www.pokernews.com/strategy/board-texture-in-poker-32177.htm' },
    ],
  },
  cbet: {
    tldr: '翻前加注者在翻牌繼續下注：有位置、乾燥高牌面可以高頻小注，沒位置或濕牌面就要多過牌。',
    plain: '持續下注就像延續翻前「我很強」的故事：A 高乾燥牌面時大家都相信你，用小注就能讓對手頻繁放棄；但牌面對對手有利、或你沒位置時，硬要把故事講下去只會被拆穿。有時先過牌、等轉牌再出手（延遲 C-Bet），故事反而更可信。',
    sources: [
      { title: 'Upswing Poker — Continuation Bet Strategy by Position', url: 'https://upswingpoker.com/continuation-bet-c-bet-strategy-position/' },
      { title: 'GTO Wizard — C-Betting OOP in 3-Bet Pots', url: 'https://blog.gtowizard.com/c-betting-oop-in-3-bet-pots/' },
      { title: 'GTO Gecko — What Is a Continuation Bet?', url: 'https://gtogecko.com/blog/what-is-a-continuation-bet' },
    ],
  },
});

Object.assign(GTO.LESSON_META, {
  'bet-sizing': {
    tldr: '範圍優勢大、但堅果不多時用小注高頻；握有堅果優勢時用大注或超池注；幾何下注讓籌碼在河牌剛好打完。',
    plain: '下注尺度就像釣魚的餌：小注是小餌，很多魚都會咬，適合你整體領先、想讓對手一直付錢的時候；超池大注是大餌，只有你最想要的獵物才會上鉤，適合你握有最強牌、對手範圍又被封頂的時候。幾何下注則是事先規劃每條街放多少餌，讓籌碼到河牌剛好全部投入。',
    sources: [
      { title: 'Upswing Poker — Geometric Bet Sizing', url: 'https://upswingpoker.com/geometric-bet-sizing/' },
      { title: 'GTO Gecko — Poker Bet Sizing Strategy', url: 'https://gtogecko.com/blog/poker-bet-sizing-strategy' },
      { title: 'PokerSkill — Bet Sizing (Glossary)', url: 'https://www.pokerskill.com/poker-glossary/bet-sizing/' },
    ],
  },
  spr: {
    tldr: 'SPR = 有效籌碼 ÷ 翻牌底池；SPR 越低，頂對越值得打光，SPR 越高，越需要暗三條、順子這類強牌。',
    plain: 'SPR 就像「剩下的子彈 ÷ 戰利品大小」：3-Bet 底池的戰利品已經很大、子彈不多，拿頂對就值得全押；單次加注底池子彈還很多、要打滿三條街，光靠一對很難撐到最後。翻牌一出來先算 SPR，就知道這手牌最多該投入多少。',
    sources: [
      { title: 'PokerNews — Stack-to-Pot Ratio (SPR)', url: 'https://www.pokernews.com/pokerterms/stack-to-pot-ratio.htm' },
      { title: 'Red Chip Poker — SPR (Stack-to-Pot Ratio) Podcast', url: 'https://redchippoker.com/spr-stack-to-pot-ratio-podcast/' },
      { title: 'Upswing Poker — Stack to Pot Ratio (SPR) Strategy', url: 'https://upswingpoker.com/stack-to-pot-ratio-spr-poker-strategy/' },
    ],
  },
  'defense-postflop': {
    tldr: '面對 1/3 底池小注要守住約 75%：對子、聽牌、帶後門的高牌都要繼續，並混入過牌加注反擊。',
    plain: '防守就像守城門：對手只派一支小部隊（小注）來試探，你若一看到就棄城（棄牌太多），他派任何兵力都能佔便宜。所以面對小注要守得很寬，用過牌跟注撐住城門；手上有強牌或好的聽牌時，偶爾開門反擊（過牌加注），讓對手不敢無腦進攻。',
    sources: [
      { title: 'PokerCoaching — Mastering Big Blind Strategy: A Guide to Profitable Defence', url: 'https://pokercoaching.com/blog/mastering-big-blind-strategy-a-guide-to-profitable-defence/' },
      { title: 'PokerCoaching — Defending the BB on High Card Boards', url: 'https://pokercoaching.com/blog/defending-bb-on-high-card-boards/' },
      { title: 'GTO Wizard — Flop Heuristics for Defending the Blinds in MTTs', url: 'https://blog.gtowizard.com/flop-heuristics-for-defending-the-blinds-in-mtts/' },
    ],
  },
  'turn-river': {
    tldr: '轉牌挑對自己有利的牌繼續開槍；河牌詐唬選「擋住對手跟注牌、不擋棄牌」的組合，抓詐也看阻擋牌。',
    plain: '轉牌和河牌是決勝局：轉牌出現對你範圍有利的高張，就像天降援軍，可以繼續施壓；河牌則像攤牌前的心理戰，詐唬要選手上剛好握有對手「關鍵跟注牌」的組合，讓他更可能沒牌可跟。抓詐時道理相反：你的牌擋掉對手的價值牌，對手就更可能是在詐唬。',
    sources: [
      { title: 'PokerCoaching — When to Double Barrel the Turn as a Bluff', url: 'https://pokercoaching.com/blog/when-to-double-barrel-the-turn-as-a-bluff/' },
      { title: 'Upswing Poker — C-Bet Turn Barreling on Bricks', url: 'https://upswingpoker.com/c-bet-turn-barreling-bricks/' },
      { title: 'GTO Wizard — Blockers & Unblockers: The Secret to Picking Great Bluffs', url: 'https://blog.gtowizard.com/blockers-unblockers-the-secret-to-picking-great-bluffs/' },
      { title: 'GTO Wizard — Understanding Blockers in Poker', url: 'https://blog.gtowizard.com/understanding-blockers-in-poker/' },
    ],
  },
  exploit: {
    tldr: '以 GTO 為盾、以剝削為矛：對手棄太多就多詐唬，跟太多就多打價值；數據要有足夠樣本才調整。',
    plain: 'GTO 像一套誰都打不穿的標準防守陣型，剝削則是看穿對手弱點後的針對性戰術。發現對手老是被嚇跑，就多詐唬他；發現對手死不棄牌，就別再詐唬，改成一直拿價值。但要先看清楚再出手：對手的數據太少時貿然剝削，反而會害到自己。',
    sources: [
      { title: 'Upswing Poker — GTO vs Exploitative Play', url: 'https://upswingpoker.com/gto-vs-exploitative-play-game-theory-optimal-strategy/' },
      { title: 'Upswing Poker — When to Deviate from GTO', url: 'https://upswingpoker.com/deviate-from-gto/' },
      { title: 'BBZ Poker — Poker HUD Stats Explained', url: 'https://bbzpoker.com/poker-hud-stats-explained/' },
    ],
  },
  multiway: {
    tldr: '多人底池要少 C-Bet、少詐唬、重視堅果潛力：對手越多越可能有人中牌，一對的價值大幅下降。',
    plain: '單挑像一對一談判，嚇退一個人就贏；多人底池像同時說服整個會議室，只要有一個人不買帳，你的詐唬就失敗了。人越多，越可能有人手握好牌，所以要少虛張聲勢，等真的拿到堅果或強聽牌再出手；中等的一對常常只值得小心過牌。',
    sources: [
      { title: 'GTO Wizard — 10 Tips for Multiway Pots in Poker', url: 'https://blog.gtowizard.com/10-tips-multiway-pots-in-poker/' },
      { title: 'PokerCoaching — C-Betting in Multiway Pots: Stop Betting Every Flop', url: 'https://pokercoaching.com/blog/c-betting-in-multiway-pots-stop-betting-every-flop/' },
      { title: 'PokerCoaching — Mastering Multiway Pots', url: 'https://pokercoaching.com/blog/mastering-multiway-pots/' },
    ],
  },
  'bankroll-mindset': {
    tldr: '短期輸贏充滿運氣：準備足夠買入撐過下風期（現金桌至少 30–50 個），用決策品質而非結果評價自己。',
    plain: '撲克的變異數就像股市：就算你選的是好股票，短期內也可能連跌好幾週。資金管理是幫你撐過「下跌期」的安全氣囊，例如現金桌至少準備 30–50 個買入。只要每次決策都是 +EV，就別因為一兩次冤家牌懷疑自己；真正該避免的是上頭之後亂打。',
    sources: [
      { title: 'GTO Wizard — Variance and Bankroll Management', url: 'https://blog.gtowizard.com/variance-and-bankroll-management/' },
      { title: 'PrimeDope — The Ultimate Guide to Poker Variance', url: 'https://www.primedope.com/the-ultimate-guide-to-poker-variance/' },
      { title: 'ThinkGTO — Bankroll Management for Serious Poker Players', url: 'https://thinkgto.com/blog/bankroll-management-for-serious-poker-players' },
    ],
  },
  'study-plan': {
    tldr: '每天 25–30 分鐘、分 4 週練：先背開池範圍，再練面對開池與 3-Bet，接著刷數學題，最後綜合練習並清空錯題。',
    plain: '學撲克就像上健身房：每天固定練一點，比週末一次練八小時有效。先把開池範圍這類「基本動作」練熟，再逐步加上防守與數學的重量；每次練完翻一翻錯題本，針對弱點加強。學習、練習、覆盤三步循環，進步會比只看影片快得多。',
    sources: [
      { title: 'GTO Wizard — How to Study GTO Solutions', url: 'https://blog.gtowizard.com/how-to-study-gto-solutions/' },
      { title: 'PokerCoaching — Poker Study Plan', url: 'https://pokercoaching.com/blog/study-plan/' },
      { title: 'PokerSkill — How to Study Poker', url: 'https://www.pokerskill.com/blog/how-to-study-poker/' },
    ],
  },
});

// === GTO.LESSON_CONCEPTS：全站 54 堂課「觀念分析與迷思破解」深度教練模組 ===
GTO.LESSON_CONCEPTS = Object.assign(GTO.LESSON_CONCEPTS || {}, {
welcome: `
<h3>💡 觀念分析與迷思破解：為什麼「短期一直被爛牌運氣贏走」反而證明撲克能長期賺錢？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我照著教學拿好牌加注，結果還是被新手亂跟、河牌中兩對贏走！德州撲克最後還不是靠運氣？」</b><br>
  這是幾乎所有初學者踏入撲克時最大的心理難關。當你拿 <span class="hand">AA</span> 輸給對手的 <span class="hand">85o</span>，你會覺得「學技術沒用」。但只要把視角從<strong>「單一局的結果」</strong>切換成<strong>「開賭場的莊家思維」</strong>，你就會豁然開朗：
</div>
<ol class="steps">
  <li><b>1. 如果爛牌永遠不會贏（0% 勝率），這世界上就沒有人會送錢給你</b><br>
    想像一下：如果娛樂玩家每次拿爛牌跟注都 100% 輸，他們玩兩小時就會覺得無聊、再也不上桌了。正是因為運氣（變異數 Variance）偶爾會讓他們的錯誤打法贏下一兩個大底池，他們才會誤以為自己打得好，並在接下來的幾千手牌裡持續把籌碼送給懂技術的你！</li>
  <li><b>2. 你不是在賭「這一把誰贏」，你是在賣「80% 勝率的彩券」</b><br>
    當你在翻前用 <span class="hand">AA</span> 和對手的 <span class="hand">KK</span> 各放 100bb 全下時，你的勝率約 <strong>82%</strong>。這意味著在「籌碼推進去的那一秒」，不管後面發什麼牌，你在數學上已經淨賺了 <strong>82% × 200bb − 100bb = +64bb</strong>！後面發出的五張公共牌只是在執行開獎，就算這把剛好落在那 18% 輸掉，你的決策依然是滿分。</li>
  <li><b>3. 實戰腦袋怎麼想？（忘掉單局輸贏，記住三個習慣）</b><br>
    • <strong>對手拿爛牌跟注還買中時，心裡要暗爽</strong>：因為他剛才做了一個長期會幫你賺錢的錯誤決定，千萬別在牌桌上教育他。<br>
    • <strong>只問自己「重來一次我還會這樣打嗎？」</strong>：如果答案是會，那就毫無遺憾地進入下一手牌。<br>
    • <strong>把注意力放在你能控制的 3 件事</strong>：起手牌選擇、位置優勢、下注理由——發牌機發什麼牌，永遠不在你的工作範圍內！</li>
</ol>
`,

  'hand-rankings': `
<h3>💡 觀念分析與迷思破解：不用背機率表！新手比牌最常踩中的 3 個視覺陷阱</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「牌型順序我都背熟了，為什麼實戰攤牌時還是常常看錯誰贏、甚至以為自己贏了卻輸掉？」</b><br>
  因為背熟「同花 &gt; 順子 &gt; 三條」只是第一步；到了牌桌上，你的眼睛很容易被「手上兩張牌」或「公共牌上的對子」騙過去。你完全不需要去背 0.197% 這些出現機率，只要避開以下三個經典視覺盲點：
</div>
<ol class="steps">
  <li><b>盲點 1：以為「我手上有兩對、桌上一對，所以我三對比他大！」</b><br>
    德州撲克永遠是<strong>「7 張牌裡只挑最大的 5 張」</strong>比大小，世界上沒有「三對」也沒有「第六張踢腳」！<br>
    • 例如公共牌是 <span class="cards">AsAhKdQc2s</span>，你拿 <span class="cards">QdJc</span>（A 一對 + Q 一對 + K 踢腳），對手拿 <span class="cards">Ks3c</span>（A 一對 + K 一對 + Q 踢腳）——對手是「AAKKQ」，你是「AAQQK」，對手的兩對比你大！</li>
  <li><b>盲點 2：看到四張連號或四張同色，就以為「差一點點也算」</b><br>
    撲克裡沒有「四張同花」或「四張順子」這種安慰獎，差一張就只是單純的高牌或一對；而且<strong>順子絕對不能繞過 A 轉彎</strong>（像 Q-K-A-2-3 只是 A 高牌，根本不是順子）。</li>
  <li><b>盲點 3：看到自己湊成同花或順子就以為無敵，忘了檢查「桌面有沒有成對」</b><br>
    • 只要公共牌上出現對子（例如 <span class="cards">KhKd8h5h2s</span>），任何手上有 K8、K5、88、55 的人就已經是<strong>葫蘆（Full House）</strong>，你的紅心同花再大也會被葫蘆輾壓！<br>
    • <strong>實戰 2 秒口訣</strong>：攤牌與下大注前，先看一眼桌面<strong>「有沒有對子（防葫蘆）→ 有沒有三張同色（防同花）→ 有沒有三張連號（防順子）」</strong>，永遠只組合最強的 5 張牌！</li>
</ol>
`,

  'hand-flow': `
<h3>💡 觀念分析與迷思破解：為什麼要分四輪發牌下注？每多發一張牌到底在改變什麼？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「為什麼德州撲克不乾脆一次把 5 張公共牌發完大家比大小，而要分成翻前、翻牌、轉牌、河牌四輪慢慢發？」</b><br>
  如果你把四輪行動只當成「付四次入場費看牌」，你就會一路被動跟注到河牌。其實「分四輪發牌」正是德州撲克成為頂尖策略遊戲的核心原因——<strong>每一條街都在重新洗牌「資訊量」與「價格」</strong>：
</div>
<ol class="steps">
  <li><b>翻牌前（Pre-flop）：買的是「潛力與位置」，底池最小、棄牌最便宜</b><br>
    這時候還沒看到公共牌，投入的只是 1bb～3bb 的小錢。在這一輪學會「挑好牌、挑好位置」，就能在損失最小的時候避開 80% 的麻煩。</li>
  <li><b>翻牌圈（Flop）：一次開出 3 張牌，決定了這手牌 70% 的劇本走向</b><br>
    從 2 張底牌變成 5 張牌（已知 5/7 ≈ 71% 的資訊），誰中了強牌、誰在聽牌、牌面對誰有利，都在這一刻定調。</li>
  <li><b>轉牌圈（Turn）與河牌圈（River）：底池呈倍數放大，錯誤的代價最昂貴</b><br>
    因為每次下注都是按「當下底池的百分比」計算，翻牌只下 3bb，到了轉牌可能變成 10bb，到了河牌往往是 30bb～50bb 的重注！<br>
    • <strong>實戰核心觀念</strong>：<strong>「小街（翻前、翻牌）守紀律，大街（轉牌、河牌）省大錢。」</strong>很多新手翻前省那 2bb 很計較，到了河牌面對 50bb 大注卻不肯棄掉一對——搞懂底池在四輪中「滾雪球放大」的本質，你就不會在最貴的轉牌與河牌意氣用事！</li>
</ol>
`,

  'betting-actions': `
<h3>💡 觀念分析與迷思破解：不用背複雜規則！一眼看懂「加注尺度」與「邊池」的直覺邏輯</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「最小加注增量、底池百分比、三人全下分主池邊池……規則這麼多，牌桌上緊張時算錯怎麼辦？」</b><br>
  別擔心！現場有荷官幫你算、線上有滑桿自動幫你卡住合法金額。你在牌桌上根本不需要當人肉收銀機，只需要掌握這三個影響你輸贏的核心觀念：
</div>
<ol class="steps">
  <li><b>觀念 1：為什麼老手說話都講「幾 bb」或「幾 % 底池」，而不是講「幾百塊」？</b><br>
    因為下注的威力取決於<strong>「相對於目前底池的比例」</strong>！在底池 100 元時下注 50 元（半池），跟在底池 1,000 元時下注 50 元（只佔 5%），給對手的壓力完全是兩個世界。養成「看底池有幾 bb、按底池比例（1/3、1/2、2/3、滿池）下注」的習慣，你的策略才能在任何級別通用。</li>
  <li><b>觀念 2：主池與邊池（Side Pot）不用自己算乘法，只要記住「公平對等原則」</b><br>
    規則背後的邏輯只有一句話：<strong>「你面前的籌碼有多少，你最多就只能從每位對手身上贏走多少；多出來的錢跟短碼玩家無關。」</strong><br>
    • 這在實戰中有個超重要的策略啟示：當一個只剩 10bb 的短碼玩家全下，而你和另一位還有 100bb 的深碼玩家還在底池裡時，<strong>千萬不要為了搶短碼那一點點主池，而在沒有好牌時跟深碼玩家打起 90bb 的邊池大戰！</strong></li>
  <li><b>觀念 3：現場打牌永遠記住「嘴巴比手快」</b><br>
    現場最常發生的冤枉虧損，就是沒講話直接丟出一顆大籌碼（被判只算跟注）或分兩次推籌碼（String Bet）。只要養成<strong>「先開口喊『加注到 X』，手再碰籌碼」</strong>的習慣，你一輩子都不會吃規則的虧！</li>
</ol>
`,

  'reading-board': `
<h3>💡 觀念分析與迷思破解：為什麼「我中了一對 A」有時候超強，有時候卻該害怕？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我拿到 <span class="hand">AK</span>，翻牌開出 A，我中了最大的頂對頂踢腳（TPTK），為什麼教練卻說在某些牌面不能無腦打光籌碼？」</b><br>
  因為新手看牌只看<strong>「自己的絕對牌型（我有沒有對子）」</strong>，而高手看牌看的是<strong>「我的牌相對於這張公共牌面的位置（相對牌力）」</strong>！同樣是一對 A，放在不同牌面上，命運完全不同：
</div>
<ol class="steps">
  <li><b>1. 先看「牌面天氣」：晴天（乾燥面）的一對是霸主，暴雨天（潮濕面）的一對只是平民</b><br>
    • 在 <span class="cards">As7d2c</span>（乾燥彩虹面）：沒有人能成同花，也沒有人能成順子。你手上的 <span class="cards">AhKd</span> 只輸給極少數的 <span class="hand">AA</span>、<span class="hand">77</span>、<span class="hand">22</span>、<span class="hand">A7</span>、<span class="hand">A2</span>，這時你的頂對就像晴天裡的跑車，非常安全。<br>
    • 在 <span class="cards">AhJhTh</span>（單色連張面）：任何兩張紅心就是同花、任何 <span class="hand">KQ</span> 就是順子、任何 <span class="hand">AJ</span>/<span class="hand">AT</span>/<span class="hand">JT</span> 都是兩對！這時你手上的黑桃 <span class="cards">AsKd</span> 雖然也叫「頂對頂踢腳」，但在這種暴雨牌面，對手一旦強烈反擊，你往往已經落後！</li>
  <li><b>2. 暗三條（Set）與明三條（Trips）千萬別混為一談</b><br>
    • <strong>暗三條（手上一對 + 桌上一張）</strong>是隱形轟炸機，對手完全看不見，最容易贏下整疊 100bb。<br>
    • <strong>明三條（桌上一對 + 手上一張）</strong>則是貼在公告欄上的警報，全桌都看得到桌面有對子——如果對手這時還敢跟你打光，他手上很可能也是三條（比踢腳）甚至是已經成型的葫蘆！</li>
  <li><b>3. 實戰 3 秒讀牌習慣</b><br>
    每次發牌後，<strong>先盯著公共牌看 2 秒，再看自己的底牌</strong>：先問「現在這張桌面上最強的牌（堅果）長什麼樣子？」，你就永遠不會拿著一對在同花順牌面上傻傻送錢！</li>
</ol>
`,

  'starting-hands-101': `
<h3>💡 觀念分析與迷思破解：為什麼「只要看到 A 或 K/Q/J 就想玩」是新手最大的破財陷阱？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「<span class="hand">A8o</span> 有 A 耶！<span class="hand">KJo</span> 兩張都是破十點的大臉牌耶！為什麼範圍表叫我在前位把這些看起來很漂亮的牌直接丟進垃圾桶，反而叫我留著 <span class="hand">76s</span> 這種小牌？」</b><br>
  這個問題直接點破了業餘玩家與贏家之間最大的思維鴻溝——<strong>「漂亮的高牌不一定賺錢，會害你做出『第二大好牌』的牌最貴！」</strong>
</div>
<ol class="steps">
  <li><b>1. 認識撲克裡最隱形的殺手：「壓制（Domination）」——贏小池、輸大池的元兇</b><br>
    當你在前位拿 <span class="hand">A8o</span> 或 <span class="hand">KJo</span> 跟注別人的加注時，如果翻牌沒中 A 或 K，你只能棄牌；<strong>最恐怖的是當翻牌真的開出 A 或 K 時！</strong><br>
    • 當你拿 <span class="hand">A8o</span> 中了頂對 A，對手手上的 <span class="hand">A4o</span> 早就棄牌了，會跟你連打三條街大底池的，往往是 <span class="hand">AK</span>、<span class="hand">AQ</span>、<span class="hand">AJ</span>！結果就是：<strong>對手比你差時不會付你錢，對手付你大錢時你剛好輸踢腳！</strong></li>
  <li><b>2. 為什麼「同花（Suited）」與「連張（Connected）」這麼值錢？因為好退也好進！</b><br>
    反觀 <span class="hand">76s</span> 或 <span class="hand">A5s</span> 這類同花牌，它們有兩大優勢：<br>
    • <strong>進可攻（堅果潛力）</strong>：一旦中了同花、順子或兩對，對手拿著一對 <span class="hand">AA</span>、<span class="hand">AK</span> 根本看不出來，會乖乖把整疊 100bb 送給你。<br>
    • <strong>退可守（容易棄牌）</strong>：翻牌如果完全沒中聽牌、只是一對 6，面對重注你可以毫不留戀地棄牌，絕對不會像拿著 <span class="hand">KJo</span> 中頂對那樣捨不得丟而輸光！</li>
  <li><b>3. 實戰選牌一句話原則</b><br>
    <strong>「非同花的次高牌（如 <span class="hand">ATo</span>、<span class="hand">KJo</span>、<span class="hand">QTo</span>）是糖衣毒藥，位置越前面越要無情棄牌；同花 A（<span class="hand">Axs</span>）與同花連張才是能以小博大的好武器！」</strong></li>
</ol>
`,

  'beginner-strategy': `
<h3>💡 觀念分析與迷思破解：為什麼「緊兇（TAG）」叫你少玩牌，卻又要你兇？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「『緊（少玩牌）』聽起來很保守，『兇（主動加注）』聽起來很激進，這兩個詞放在一起不是自相矛盾嗎？而且少玩牌不會被大家發現我一進場就是有好牌嗎？」</b><br>
  一點都不矛盾！把「翻前挑牌（緊）」跟「進池後的打法（兇）」分開來看，你就會明白為什麼緊兇（TAG）是所有贏家的共同起點：
</div>
<ol class="steps">
  <li><b>1. 「緊」是在進場前挑戰場，「兇」是一旦進場就拿走兩種贏法</b><br>
    • <strong>鬆弱玩家（愛跟注的魚）</strong>：什麼牌都想花 1bb、2bb 進去看翻牌（鬆），進去後只會過牌跟注（弱），唯一的贏法是「最後攤牌剛好比別人好」。<br>
    • <strong>緊兇玩家（TAG）</strong>：翻前把 75%–80% 的垃圾牌免費丟掉（緊），省下所有冤枉錢；一旦拿到前 20% 的好牌或好位置進場，就用加注與下注主動出擊（兇）——<strong>對手棄牌你直接贏，對手跟注你的平均牌力也領先，等於同時擁有兩種贏法！</strong></li>
  <li><b>2. 怕「只玩 20% 的牌會被對手看穿」？其實 20% 已經比你想的寬很多！</b><br>
    在 6 人桌上，每個人平均每 6 手牌就會輪到一次按鈕位（BTN）與關煞位（CO）。20%–25% 的入池率代表你<strong>大約每 4 到 5 手牌就會主動加注參與一局</strong>，而且裡面除了 <span class="hand">AA</span>、<span class="hand">AK</span>，還包含大量同花連張（<span class="hand">87s</span>）、同花 A（<span class="hand">A5s</span>）與口袋對子，對手根本猜不到你這把是中大牌還是中順子！</li>
  <li><b>3. 實戰腦袋怎麼切換？</b><br>
    上桌只要記住八個字：<strong>「進池從嚴，出擊從果」</strong>——還沒放錢進去前當個挑剔的守財奴；決定要玩這手牌時，就用加注取代平跟！</li>
</ol>
`,

  'beginner-mistakes': `
<h3>💡 觀念分析與迷思破解：為什麼明知道「不該好奇跟注」，坐在牌桌上卻還是手癢忍不住？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「這 15 個錯誤我讀課文時都覺得很有道理，但為什麼一坐上牌桌，遇到無聊沒牌、或是對手在河牌下注時，我的手還是會不自覺按下『跟注』？」</b><br>
  因為在牌桌上犯錯，90% 不是因為「不知道規則」，而是大腦落入了三個天生的心理本能陷阱。要真正改掉漏洞，你需要把「戒律」換成「替代動作」：
</div>
<ol class="steps">
  <li><b>陷阱 1：「沉沒成本謬誤」——覺得「我前面已經投了 20bb，現在棄牌那 20bb 就白費了！」</b><br>
    • <strong>觀念破解</strong>：只要籌碼一推進底池中央，<strong>那筆錢就已經不是你的錢了，而是公共獎金！</strong>河牌對手下注 30bb 時，你不是在拯救過去的 20bb，而是在決定「現在這筆新的 30bb 投資划不划算」。如果不划算還硬跟，你不是救回 20bb，而是再多燒掉 30bb！</li>
  <li><b>陷阱 2：「花錢買答案」——河牌心想「我知道我可能輸了，但我好想看他到底是不是在偷雞！」</b><br>
    • <strong>觀念破解</strong>：滿足一次好奇心要付 20bb～50bb，而你在該級別辛苦打一小時平均也才贏 5bb～10bb！下次手癢想「付費看牌」時，把那筆錢想像成<strong>「這是直接轉帳送給對手的學費」</strong>，立刻果斷棄牌。</li>
  <li><b>陷阱 3：「無聊症候群」——連棄 10 手爛牌覺得沒參與感，決定拿一手 <span class="hand">Q8s</span> 溜進去看看</b><br>
    • <strong>實戰替代動作</strong>：棄牌後不要發呆滑手機！把棄牌後的時間拿來玩<strong>「免費猜牌遊戲」</strong>——觀察場上還在打的兩位對手，根據他們的下注大小猜他們拿什麼範圍，攤牌時對答案。這樣你每一手牌都有事做，就不會為了找樂子而拿自己的籌碼開玩笑！</li>
</ol>
`,

  etiquette: `
<h3>💡 觀念分析與迷思破解：為什麼「牌桌禮儀」不只是教養，而是直接影響你贏多少錢的技術？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「禮儀不就是不要罵人、不要慢翻（Slow Roll）而已嗎？這跟我的撲克技術與勝率有什麼關係？」</b><br>
  關係可大了！在現場與線上牌局中，好的牌桌禮儀與動作習慣，其實是保護你自身利益、並讓娛樂玩家心甘情願留在桌上跟你的<strong>「隱形印鈔機」</strong>：
</div>
<ol class="steps">
  <li><b>1. 別在牌桌上當「撲克老師」——嘲笑或糾正娛樂玩家，等於親手把財神爺趕走</b><br>
    當一位休閒玩家用荒謬的爛牌跟注並運氣好贏走你的底池時，新手最愛氣呼呼地說：「你拿那什麼爛牌怎麼可能跟注？！」<br>
    • <strong>聰明贏家的想法</strong>：你的長期利潤 80% 來自這些不按牌理出牌的娛樂玩家。如果你罵他、讓他覺得丟臉或學會了正確棄牌，他就不會再犯錯送錢給你了！微笑說聲「好牌（Nice hand）」，讓他開開心心繼續玩，才是最高段位的職業素養。</li>
  <li><b>2. 嚴格遵守「輪到才行動」與「不討論進行中手牌」，是在保護你自己的資訊安全</b><br>
    還沒輪到你就急著把牌拿起來準備丟（提早洩漏你要棄牌），後面的人就能免費獲得位置優勢去偷盲；反過來，養成「輪到自己才看牌、先口頭宣告再推籌碼」的固定節奏，既不會誤觸單一籌碼規則，也讓對手永遠讀不到你的馬腳。</li>
</ol>
`,

  rules: `
<h3>💡 觀念分析與迷思破解：為什麼同樣一套規則，有人玩成猜大小，高手卻能穩定獲利？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「德州撲克規則這麼簡單，5 分鐘就學會了，為什麼有人學了一年還是輸錢，這當中的技術差距到底藏在哪裡？」</b><br>
  俗話說：「德州撲克花 5 分鐘就能學會規則，卻需要一輩子去精通。」因為規則表面上是「湊 5 張牌比大小」，但規則背後的底層設計其實是一場<strong>「資訊與定價的博弈」</strong>：
</div>
<ol class="steps">
  <li><b>1. 7 張牌裡有 5 張是大家共用的（超過 70% 資訊完全公開）</b><br>
    這意味著對手能湊出什麼強牌，線索全寫在桌面那 5 張公共牌上！新手只盯著自己手上的 2 張暗牌，高手則花 80% 的精力解讀「桌面的 5 張公共牌搭配對手每一輪的行動，代表他手上是什麼範圍」。</li>
  <li><b>2. 無限注（No-Limit）允許你在任何一刻改變「交易價格」</b><br>
    你隨時可以過牌免費看牌（0 元），也可以直接全下 100bb。<strong>會不會贏錢，不在於你拿到幾次同花順，而在於「當你領先時能不能定出對手願意付的最高價」以及「當你落後時能不能用最低價全身而退」！</strong></li>
  <li><b>3. 贏下底池不需要等到最後攤牌</b><br>
    規則規定「只要其他人都棄牌，最後留下的人直接贏走底池，連牌都不用亮」。這讓沒有大牌的人也能透過位置、故事邏輯與下注壓力獲勝——從今天起，別再把撲克當成「等發好牌的配對遊戲」，而是當成「用籌碼買賣權益的決策遊戲」！</li>
</ol>
`,

  positions: `
<h3>💡 觀念分析與迷思破解：為什麼「坐在哪裡」比「拿到什麼牌」更重要？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「牌還不是一樣隨機發的嗎？為什麼圖表說我在大盲（BB）長期一定會輸錢，坐在按鈕位（BTN）卻能大賺？難道按鈕位發到的牌比較好？」</b><br>
  每個位置發到 <span class="hand">AA</span> 的機率完全一樣！但為什麼所有職業牌手的資料庫打開，獲利曲線都是「越靠近按鈕位賺越多」？因為你不需要背誦各位置的 EV 數字，只要理解<strong>「最後說話的人擁有三大免費特權」</strong>：
</div>
<ol class="steps">
  <li><b>特權 1：你可以先看完別人的「底牌測謊報告」再做決定</b><br>
    在翻牌、轉牌、河牌三條街，沒位置的人（OOP）必須先行動。如果他過牌示弱，坐在 BTN 的你可以趁機下注搶池；如果他主動下重注示強，你可以輕鬆棄掉邊緣牌省錢。<strong>你永遠比對手多看一個動作才出拳！</strong></li>
  <li><b>特權 2：你可以自己決定「這張牌要不要免費看（控池權）」</b><br>
    當你在 BTN 拿到中等一對或聽牌時，只要前面的對手過牌，你跟著喊一聲「過牌（Check Back）」，就能<strong>免費看到下一張公共牌</strong>！但如果你沒位置，你一過牌，後面的對手隨時可以下大注逼你付錢或棄牌。</li>
  <li><b>特權 3：為什麼大盲（BB）帳面顯示「-30bb/100」卻算是打得很好？</b><br>
    因為大盲每一手牌都被強制先扣了 1bb（每 100 手在大盲如果你全部棄牌，是穩輸 <strong>-100bb/100</strong>）！我們在盲注位防守的目標，從來不是「把大盲打成正數」，而是<strong>「把原本要輸的 -100bb 追回來變成只輸 -30bb」</strong>，再用 BTN 與 CO 大賺的籌碼贏下整場勝利！</li>
</ol>
`,

  'hands-combos': `
<h3>💡 觀念分析與迷思破解：難道打牌時真的要在腦袋裡從 1,326 組慢慢數嗎？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「C(52,2) = 1,326 組、對子 6 組、同花 4 組、非同花 12 組……這些排列組合數字，難道我在牌桌上短短 15 秒內真的要心算出來嗎？」</b><br>
  <strong>絕對不用在牌桌上背 1,326！</strong>組合數（Combinatorics）在實戰中真正的作用，不是考你數學乘法，而是幫你建立<strong>「對手手牌出現機率的直覺比例尺」</strong>。你只要記住以下三個「倍數直覺」就夠用一輩子了：
</div>
<ol class="steps">
  <li><b>直覺 1：「非同花（12 組）是同花（4 組）的整整 3 倍！」</b><br>
    看 13×13 範圍表時，右上角的 <span class="hand">AKs</span> 跟左下角的 <span class="hand">AKo</span> 面積一樣大（都佔一格），但實際上<strong>左下角每一格的牌量都是右上角的 3 倍</strong>！<br>
    • 這就是為什麼翻前範圍表裡「同花牌可以開很寬（加一格只多 4 組），非同花牌卻要守很緊（隨便加一格就暴增 12 組垃圾牌）」！</li>
  <li><b>直覺 2：「中一對很常有，但中暗三條（Set）非常罕見（只有 3 組）！」</b><br>
    當翻牌開出 <span class="cards">As8d3c</span> 時，牌面上已經亮出一張 8，剩下的三張 8 只能湊出 <strong>3 組</strong> <span class="hand">88</span> 暗三條；但對手拿 <span class="hand">AK</span>、<span class="hand">AQ</span>、<span class="hand">AJ</span> 中頂對 A 的組合卻有好幾十組！<br>
    • 實戰啟示：不要每次看到對手跟注就自己嚇自己「完了他一定中暗三條了」——因為一對的組合數永遠是暗三條的好幾倍！</li>
  <li><b>直覺 3：「我手上握著一張 A，對手拿到 <span class="hand">AA</span> 的機會直接砍半！」</b><br>
    原本 <span class="hand">AA</span> 有 6 組，只要你手上有張 A（剩 3 張 A），對手只剩 <strong>3 組</strong> <span class="hand">AA</span>，而拿 <span class="hand">AK</span> 的組合也從 16 組降到 12 組。不用算精確百分比，只要懂「手握關鍵大牌＝對手很難同時拿頂級強牌」這個邏輯，你就已經學會阻擋牌的核心了！</li>
</ol>
`,

  'outs-odds': `
<h3>💡 觀念分析與迷思破解：下一張牌「不是中就是沒中」，算出 36% 中牌率到底有什麼意義？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「二四法則說我翻牌拿同花聽牌（9 Outs）到河牌有約 36% 機率會中。可是實際發牌時，我要嘛中同花贏錢、要嘛沒中輸錢，這個 36% 對我這把牌到底怎麼用？」</b><br>
  這是一個非常好的問題！單看 36% 這個數字確實不能告訴你「下一張牌是不是紅心」，但把它跟<strong>「對手開出的跟注價格（底池賠率）」</strong>放在一起比大小，它就是幫你決定「這張彩券該買還是該丟」的唯一標準：
</div>
<ol class="steps">
  <li><b>1. 把「中牌率」想成彩券的中獎率，把「對手下注」想成彩券售價</b><br>
    假設今天有一張彩券，頭獎是 <strong>100 元</strong>，中獎率是 <strong>20%（每買 5 張平均中 1 次，長期平均價值 20 元）</strong>：<br>
    • 如果老闆只賣你 <strong>15 元</strong>，就算這次沒刮中，你下次遇到還是該買（因為每買一次平均賺 5 元）！<br>
    • 如果老闆賣你 <strong>35 元</strong>，就算這次不小心刮中了，你長期一直買一定會破產！</li>
  <li><b>2. 牌桌上最常見的「二四法則」誤用：翻牌圈直接無腦用「× 4」去跟大注！</b><br>
    很多新手背了「翻牌 × 4、轉牌 × 2」，在翻牌圈拿同花聽牌（9 × 4 = 36%），看到對手下滿池（需要 33% 勝率），就開心地說「36% &gt; 33%，我要跟注！」<br>
    • <strong>小心陷阱</strong>：<strong>「× 4（36%）」的前提是你付一次錢就能免費看到轉牌和河牌兩張牌（例如對方全下，或轉牌大家都會過牌）！</strong>如果對手還有很多籌碼，轉牌沒中時他一定會再下重注收第二次費，你在翻牌圈看下一張牌的真實機率其實只有 <strong>9 × 2 ≈ 18%</strong>！</li>
  <li><b>3. 實戰 3 秒判斷口訣</b><br>
    • <strong>對手全下或小注</strong>：可以用「翻牌 × 4」算總勝率。<br>
    • <strong>對手下大注且後手還很深</strong>：改用「× 2（只看下一張牌）」，除非你有位置、或是中牌後能從對手身上多贏一大筆錢（隱含賠率），否則別當昂貴的追夢人！</li>
</ol>
`,

  'range-thinking': `
<h3>💡 觀念分析與迷思破解：為什麼「我有沒有中翻牌」不重要，「牌面對誰的範圍有利」才決定能不能下注？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我在 BTN 拿 <span class="hand">98s</span> 加注開池，大盲跟注。翻牌開出 <span class="cards">AsKd4c</span>，我完全沒中（只有 9 高），為什麼 GTO 卻叫我在這裡一樣要下注？反過來，我在前位拿 <span class="hand">AA</span>，翻牌開出 <span class="cards">7h6h5d</span>，我有超強的一對 A，為什麼反而叫我要小心過牌？」</b><br>
  因為業餘玩家打的是<strong>「我手上的兩張牌（Hand）」</strong>，而高手打的是<strong>「我在對手眼中代表的整套範圍（Range）」</strong>！只要搞懂這兩個對比，你的翻後觀念就會立刻升級：
</div>
<ol class="steps">
  <li><b>1. 當牌面大喊「翻前加注者超強」時（如 <span class="cards">AsKd4c</span>），你連空氣牌都能借勢小注</b><br>
    大盲在翻前只是平跟，他的 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">AK</span> 早就 3-Bet 了；而你是翻前加注者，所有的 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">AK</span>、<span class="hand">AQ</span> 都在你的範圍裡（你有壓倒性的<strong>範圍優勢</strong>）。<br>
    • 這時候你不需要真的中 A 或 K，只要用 <strong>1/3 底池的小注</strong>代表你的強範圍，大盲手上一大堆中低張與小對子就會因為承受不住壓力而棄牌！</li>
  <li><b>2. 當牌面撞進防守方的主場時（如 <span class="cards">7h6h5d</span>），就算你拿 <span class="hand">AA</span> 也不能無腦下大注</b><br>
    前位開池範圍都是高張大牌，很難湊成 7-6-5 的兩對或順子；反而是大盲防守範圍裡有滿滿的 <span class="hand">98s</span>、<span class="hand">86s</span>、<span class="hand">76s</span>、<span class="hand">65s</span>、<span class="hand">55</span>–<span class="hand">77</span>（大盲擁有<strong>堅果優勢</strong>）。在別人的主場拿著一對 <span class="hand">AA</span> 猛烈把底池做大，只會讓對手拿著順子與兩對把你吃乾抹淨！</li>
  <li><b>3. 實戰腦袋怎麼想？（不用算百分比，翻牌先問兩個問題）</b><br>
    • <strong>問題一（決定下不下）</strong>：「這三張公共牌，比較像翻前加注者會有的牌，還是跟注者會有的牌？」（像加注者的牌 → 多下注；像跟注者的牌 → 多過牌）。<br>
    • <strong>問題二（決定下多大）</strong>：「這個牌面上的最強怪獸牌（暗三條、順子、兩對），是我比較多還是他比較多？」（我比較多 → 可以下大注；雙方都有或他比較多 → 用小注或過牌控池）！</li>
</ol>
`,

  'equity-realization': `
<h3>💡 觀念分析與迷思破解：為什麼兩手翻前勝率差不多的牌，實戰賺錢能力卻天差地遠？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我用勝率計算器算過，<span class="hand">K2o</span> 對上對手的範圍有 35% 勝率，<span class="hand">76s</span> 對上同一個範圍也差不多是 38% 勝率，為什麼教練說在大盲拿 <span class="hand">76s</span> 可以輕鬆跟注，拿 <span class="hand">K2o</span> 跟注卻是長期虧錢？」</b><br>
  這就是德州撲克從「算死數」走向「真功夫」的分水嶺！因為<strong>「計算器算出來的勝率（Raw Equity）」假設雙方從翻牌前就直接把五張牌發完攤牌</strong>；但在真實牌局裡，中間還有三輪下注——很多時候你還沒走到河牌，就被迫棄牌了！
</div>
<ol class="steps">
  <li><b>1. 什麼叫「看得到、吃不到」的帳面勝率？</b><br>
    拿著 <span class="hand">K2o</span> 在大盲跟注後，如果翻牌開出 <span class="cards">Qd9s5c</span>（你沒中），對手下一槍 C-Bet，你只能立刻棄牌——原本計算器說你「轉牌或河牌可能會開出 K 而贏」的那 35% 勝率，直接因為你被迫棄牌而歸零！就算翻牌真的開出 K，你踢腳只有 2，也很難贏到大底池。</li>
  <li><b>2. 哪三種特質能幫你把帳面勝率「100% 甚至超額領出來」？</b><br>
    • <strong>有位置（IP）</strong>：對手過牌時你可以免費看下一張牌，不會被輕易趕走。<br>
    • <strong>同花（Suited）與連張（Connected）</strong>：像 <span class="hand">76s</span> 翻牌很容易中同花聽牌、兩頭順聽牌或後門聽牌，就算當下沒成牌，也有足夠的「繼續玩下去的理由」撐到河牌，中牌還能反贏大底池！<br>
    • <strong>技術優勢</strong>：越懂得在翻後判斷牌面與施壓的人，越能把底池搶過來。</li>
  <li><b>3. 實戰記憶口訣</b><br>
    翻前決定要不要跟注時，別只看底池賠率說「只要 27% 勝率就能跟」，心裡要自動做個折扣：<strong>「沒位置、非同花、不相連的斷層牌（如 <span class="hand">K5o</span>、<span class="hand">Q6o</span>、<span class="hand">J4o</span>），帳面勝率一律打七折——直接棄牌最省錢！」</strong></li>
</ol>
`,

  'fold-equity': `
<h3>💡 觀念分析與迷思破解：為什麼「半詐唬（Semi-Bluff）」是撲克裡最划算的武器？怎麼避免變成無腦亂轟？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「既然半詐唬有『對手棄牌直接贏』跟『被跟注還能抽牌』兩種贏法，那我是不是只要拿到任何聽牌，閉著眼睛加注或全下就對了？」</b><br>
  半詐唬確實是拉開贏家與保守玩家差距的核心武器，但如果沒看懂公式裡最重要的那個變數——<strong>「對手到底有沒有可能棄牌（Fold Equity）」</strong>，你的半詐唬就會變成昂貴的自殺衝鋒！
</div>
<ol class="steps">
  <li><b>1. 半詐唬的威力來自「兩條腿走路」：少了一條腿，就要看另一條腿夠不夠粗！</b><br>
    • <strong>第一條腿：棄牌率（Fold Equity）</strong>——對手被你嚇跑的機率。<br>
    • <strong>第二條腿：抽牌勝率（Pot Equity）</strong>——對手跟注後你補中強牌的機率。<br>
    當你拿 <strong>15 Outs 的同花+順子組合聽牌</strong>（抽牌勝率高達 54%）時，就算對手完全不棄牌（棄牌率 = 0%），你推全下也是賺的；但當你拿的只是 <strong>4 Outs 的卡順聽牌</strong>（抽牌勝率只有 8%–16%）時，你必須高度依賴「對手會棄牌」才能半詐唬！</li>
  <li><b>2. 哪三種情況你的「棄牌權益（Fold Equity）」幾乎等於 0，千萬別硬轟？</b><br>
    • <strong>對手是死不棄牌的跟注站（Calling Station）</strong>：他眼裡只有自己的一對，根本不會棄牌。<br>
    • <strong>對手後手剩下的籌碼太少（例如底池已經 50bb，他只剩 15bb）</strong>：底池賠率太好，他已經套池（Pot Committed），不可能棄牌。<br>
    • <strong>牌面明顯打中對手的強牌範圍，而你的加注尺度太小</strong>：給對手太便宜的價格，等於白送底池。</li>
  <li><b>3. 實戰半詐唬 3 秒檢查表</b><br>
    出手半詐唬前先問自己：<strong>「① 我想逼退他手上的哪一類牌（如中對子、高牌）？② 這個下注金額夠不夠讓他那手牌感到痛苦？③ 萬一被跟注，我有幾張乾淨的 Outs 可以救命？」</strong>三個都有答案，就果斷扣下扳機！</li>
</ol>
`,

  blockers: `
<h3>💡 觀念分析與迷思破解：阻擋牌（Blockers）聽起來很玄，難道手上有張 A 就能隨便詐唬嗎？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「看教學影片每個高手都在講 Blocker（阻擋牌），說手上有一張黑桃 A 擋住堅果同花就要詐唬。結果我在低級別牌局照著做，對手拿著一對紅心 K 秒跟把我抓死！阻擋牌到底是真的有用還是騙人的？」</b><br>
  這是一個無數進階玩家都踩過的巨坑！阻擋牌是千真萬確的數學（卡牌移除效應），但它在實戰中之所以會害人輸錢，是因為很多人搞錯了<strong>「阻擋牌生效的前提」</strong>與<strong>「優先順序」</strong>：
</div>
<ol class="steps">
  <li><b>1. 先看「對手會不會棄牌」，再看「阻擋牌」！</b><br>
    阻擋牌的效果，是把對手拿到堅果強牌的組合數減少（例如從 15 組減少到 9 組）。<br>
    • <strong>面對懂棄牌的對手（Reg / 高手）</strong>：他只會用強牌跟注你的河牌大注，當你擋掉他的強牌時，他的棄牌率會明顯上升，這時阻擋牌價值連城！<br>
    • <strong>面對什麼對子都跟的休閒玩家（跟注站）</strong>：他跟注根本不需要同花，只要有一對 7 他就跟！你手上那張黑桃 <span class="cards">As</span> 雖然擋住了他的黑桃同花，卻擋不住他手上的 50 組一對——對上不棄牌的人，阻擋牌永遠不能當作詐唬的理由！</li>
  <li><b>2. 為什麼你不該「每一把拿阻擋牌都 100% 詐唬」？</b><br>
    因為拿到單張花色 A 的破產牌組合非常多，如果你每次拿到都無腦詐唬，你的詐唬組合數就會遠遠超過「2 份價值 : 1 份詐唬」的平衡比例（變成過度詐唬）。<strong>阻擋牌只是幫你從眾多沒中的空氣牌裡「排出優先順序（挑哪幾手先上場詐唬）」，而不是逼你把所有帶阻擋牌的空氣全部打出去！</strong></li>
  <li><b>3. 實戰最簡單的一句話口訣</b><br>
    河牌挑詐唬或抓詐時，只要問：<strong>「我手上的花色與點數，是擋住了對手『會跟注的強牌』（好詐唬！），還是擋住了對手『原本也沒中要棄牌的廢牌』（壞詐唬！）？」</strong></li>
</ol>
`,

  'preflop-rfi': `
<h3>💡 觀念分析與迷思破解：翻前 169 格範圍表怎麼記才不會忘？不用死背每格顏色的「幾何記憶法」</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「五個位置（UTG、HJ、CO、BTN、SB）有五張 13×13 的範圍表，總共 845 個格子！難道我要像背九九乘法表一樣，把每一格在每個位置是幾 % 全部死背下來嗎？」</b><br>
  <strong>千萬不要一格一格死背！</strong>如果你把五張表當成五張獨立的圖片去背，上桌一定會搞混。其實五個位置的開池範圍（RFI）是<strong>「同一個核心，像水波一樣隨位置往外擴散」</strong>。你只要記住「形狀與邊界（Cutoffs）」，3 分鐘就能把五張表裝進腦袋：
</div>
<ol class="steps">
  <li><b>1. 把 13×13 表格拆成四條軸線，只記「最低門檻（底線牌）」！</b><br>
    你永遠不需要記 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">AKs</span> 要加注（因為任何位置都加注），也不用記 <span class="hand">72o</span>、<span class="hand">83o</span> 要棄牌。你真正要記的只有四條線的「邊界牌」：<br>
    • <strong>對角線（口袋對子）</strong>：UTG 純開 <span class="hand">55+</span>（<span class="hand">22</span>–<span class="hand">44</span> 只混合約一半），到了 HJ/CO/BTN 則是<strong>所有口袋對（<span class="hand">22+</span>）全開</strong>！<br>
    • <strong>第一橫排（同花 A：<span class="hand">Axs</span>）</strong>：從 UTG 到 BTN，幾乎<strong>所有同花 A（<span class="hand">A2s+</span>）在任何位置都可以開池</strong>！這條線最好記！<br>
    • <strong>右上三角（同花高張與同花連張）</strong>：隨位置往後，像扇子一樣往右下方展開（UTG 同花連張到 <span class="hand">87s</span>，CO 到 <span class="hand">54s</span>，BTN 連 <span class="hand">53s</span>、<span class="hand">K2s</span>、<span class="hand">Q2s</span> 都開）。<br>
    • <strong>左下三角（非同花大牌）</strong>：最嚴格！UTG 只開 <span class="hand">ATo+</span>、<span class="hand">KQo</span>；直到 BTN 才放寬到 <span class="hand">A2o+</span>、<span class="hand">K8o+</span>、<span class="hand">Q9o+</span>、<span class="hand">J9o+</span>、<span class="hand">T9o</span>（<span class="hand">T8o</span>、<span class="hand">98o</span>、<span class="hand">87o</span> 只混合）。</li>
  <li><b>2. 桌上有很鬆的魚或很緊的 Nit 時，範圍邊界可以動態微調</b><br>
    範圍表是面對標準對手的「基準線」。如果坐在大盲的是一位從不 3-Bet、翻後又很好對付的休閒玩家，你在按鈕位可以比表格再多開幾手牌；如果身後坐著兩位超愛 3-Bet 的瘋子，你把邊界牌收緊一格就是最聰明的調整！</li>
</ol>
`,

  'preflop-vs-open': `
<h3>💡 觀念分析與迷思破解：別人只開 2.5bb，為什麼我在中間位置拿 KJo、ATo 這種好牌卻要棄掉？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「UTG 或 HJ 開池 2.5bb，我在 CO 拿到 <span class="hand">KJo</span> 或 <span class="hand">ATo</span>，兩張都是大牌耶！跟注只要 2.5bb 又不貴，為什麼範圍表叫我在這裡直接棄牌，連平跟（Cold Call）都不行？」</b><br>
  這就是翻前最容易讓人不知不覺慢性失血的<strong>「冷跟注陷阱（Cold Call Trap）」</strong>！為什麼你覺得「只花 2.5bb 看翻牌很便宜」，在 Solver 眼裡卻是虧錢的？原因有三個：
</div>
<ol class="steps">
  <li><b>原因 1：你身後還有 3 個人沒說話，隨時會被「三明治擠壓（Squeeze）」！</b><br>
    當你在 CO 平跟 2.5bb 時，這手牌還沒結束——你身後的 BTN、SB、BB 三個人只要有任何一人拿到好牌（或看準你在平跟弱牌）打出 <strong>12bb 的擠壓 3-Bet</strong>，原本開池的人還有可能 4-Bet，夾在中間拿著 <span class="hand">KJo</span> 的你幾乎只能直接把剛投進去的 2.5bb 白白丟進水裡！</li>
  <li><b>原因 2：開池者的範圍比你想像的強，你的非同花次高牌嚴重被「壓制」</b><br>
    前位（UTG/HJ）開池的範圍只有前 17%–22%，裡面滿滿都是 <span class="hand">AK</span>、<span class="hand">AQ</span>、<span class="hand">AJ</span>、<span class="hand">KQ</span>。你拿 <span class="hand">KJo</span>、<span class="hand">ATo</span> 平跟進去，中了頂對往往踢腳輸人，沒中只能棄牌。</li>
  <li><b>原因 3：現金桌有抽水（Rake），翻後底池還沒打贏就先被抽走一筆</b><br>
    在多數現金桌規則下，「翻前結束的底池不抽水（No Flop, No Drop），一看到翻牌就抽 5%」。因此在大盲與按鈕位以外的位置，採用<strong>「要嘛 3-Bet 搶下主動權（有機會在翻前直接免抽水贏池），要嘛直接棄牌」</strong>，長期比溫吞地平跟賺得多！</li>
</ol>
`,

  'blind-defense': `
<h3>💡 觀念分析與迷思破解：我在大盲已經付了 1bb，為什麼不能「什麼牌都跟」，又不能「只等大牌才玩」？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我在大盲（BB）已經被迫先放了 1bb，面對按鈕位（BTN）開池 2.5bb，我只要再補 1.5bb。有人說『已經付了一半不跟白不跟』，也有人說『沒位置很難打乾脆沒大牌就棄』——到底哪個才對？」</b><br>
  這兩種極端都是大盲位最常見的漏洞！要抓準大盲防守的分寸，你不需要背下整張大盲範圍表，只要搞懂<strong>「折扣價」</strong>與<strong>「可玩性」</strong>的平衡：
</div>
<ol class="steps">
  <li><b>1. 為什麼不能「沒大牌就棄」？因為你享有全場唯一的「半價折扣 + 關門權」！</b><br>
    其他位置跟注要付全額 2.5bb，而且身後還有人可能再加注；你在大盲只需要補 <strong>1.5bb 去爭 5.5bb 的底池（底池賠率只要 27.3%）</strong>，而且你是翻前最後一個說話的人，只要你跟注，就<strong>100% 保證能看到翻牌，絕對不會被別人擠壓</strong>！如果你在大盲棄掉 70%–80% 的牌，按鈕位只要閉著眼睛拿任意兩張牌加注就能把你的盲注偷光。</li>
  <li><b>2. 為什麼也不能「什麼垃圾牌都跟」？因為翻後你三條街都沒位置（OOP）！</b><br>
    雖然底池賠率只要 27.3%，但像 <span class="hand">93o</span>、<span class="hand">J2o</span>、<span class="hand">K4o</span> 這種非同花斷層爛牌，翻牌後有八成以上只是一手毫無發展性的高牌，面對 BTN 的持續下注只能棄牌，實際能兌現的勝率連 20% 都不到。</li>
  <li><b>3. 實戰大盲防守 3 秒記憶法（對抗後位開池）</b><br>
    • <strong>所有同花牌幾乎都能守</strong>：同花連張、同花隔一張、甚至大部分同花 K/Q/J 都能跟注看翻牌。<br>
    • <strong>所有口袋對子全部守</strong>：<span class="hand">22</span>–<span class="hand">99</span> 平跟或混 3-Bet，<span class="hand">TT+</span> 主動 3-Bet。<br>
    • <strong>非同花牌只留「兩張都夠大」或「連得很緊」的牌</strong>：把不同花的低張斷層牌（如 <span class="hand">K5o</span>、<span class="hand">Q4o</span>、<span class="hand">83o</span>）果斷丟掉！</li>
</ol>
`,

  'preflop-3bet': `
<h3>💡 觀念分析與迷思破解：為什麼 3-Bet 詐唬會挑 A5s，而不是看起來比較大的 A9o 或 KJo？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我想在翻前做輕 3-Bet（詐唬再加注），手上拿到 <span class="hand">A9o</span> 或 <span class="hand">KJo</span> 點數很大，為什麼教練卻說拿這兩手牌 3-Bet 是大錯特錯，反而叫我拿點數很小的 <span class="hand">A5s</span>、<span class="hand">A4s</span> 或 <span class="hand">76s</span> 去 3-Bet？」</b><br>
  這個問題是理解「翻前範圍建構」最關鍵的一把鑰匙！為什麼點數小的 <span class="hand">A5s</span> 比點數大的 <span class="hand">A9o</span> 更適合當 3-Bet 武器？因為我們考慮的是<strong>「當對手跟注或 4-Bet 時會發生什麼事」</strong>：
</div>
<ol class="steps">
  <li><b>1. 當你 3-Bet 被對手跟注時，<span class="hand">A9o</span> 會陷入「壓制地獄」，而 <span class="hand">A5s</span> 能中堅果！</b><br>
    對手願意跟注你 3-Bet 的範圍裡，有大量的 <span class="hand">AK</span>、<span class="hand">AQ</span>、<span class="hand">AJ</span>、<span class="hand">ATs</span>、<span class="hand">KQs</span>。<br>
    • 如果你拿 <span class="hand">A9o</span> 或 <span class="hand">KJo</span> 3-Bet 被跟注，翻牌開出 A 或 K 時，你剛好撞上對手更大的踢腳，在一個已經膨脹的 3-Bet 大底池裡輸掉大筆籌碼！<br>
    • 反觀 <span class="hand">A5s</span>：它同樣有一張 A 可以<strong>阻擋對手拿到 <span class="hand">AA</span>、<span class="hand">AK</span> 的機率</strong>；萬一被跟注，它可以靠<strong>堅果同花（Nut Flush）</strong>或 <strong>A-2-3-4-5 輪子順</strong>直接打敗對手的超對與頂對！</li>
  <li><b>2. 當對手 4-Bet 反擊你時，<span class="hand">A5s</span> 可以毫不心痛地棄牌</b><br>
    極化 3-Bet 的精髓就是「強牌不怕被 4-Bet，詐唬牌被 4-Bet 就輕鬆棄牌」。把那些「平跟會微虧、或平跟邊緣」的 <span class="hand">A5s</span>、<span class="hand">K9s</span>、<span class="hand">65s</span> 拿來 3-Bet，既能搶下死錢，被 4-Bet 棄掉也完全不可惜！</li>
  <li><b>3. 「線性 3-Bet」與「極化 3-Bet」不用背名詞，只看一件事</b><br>
    • <strong>你在這個位置有沒有平跟（Call）範圍？</strong><br>
    • <strong>沒有平跟範圍（如小盲 SB）</strong> → 好牌全部直接 3-Bet（從最強一路往下挑，叫<strong>線性</strong>）。<br>
    • <strong>有平跟範圍（如按鈕 BTN 或大盲 BB）</strong> → 中等好牌留著平跟，3-Bet 只放「最頂強牌 + <span class="hand">A5s</span> 這類奇兵」（這就叫<strong>極化</strong>）！</li>
</ol>
`,

  'squeeze-coldcall': `
<h3>💡 觀念分析與迷思破解：前面一人加注、兩人跟注，底池這麼肥，為什麼我不該拿中等牌跟進去「以小博大」？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「前面 UTG 開池 2.5bb，HJ 跟注、CO 也跟注，底池已經快 10bb 了！我在按鈕位或盲注位拿到 <span class="hand">QJo</span> 或 <span class="hand">A9o</span>，只要花 2.5bb 就能抽將近 10bb 的大彩池，為什麼說這種『跟著上車』是虧錢的？」</b><br>
  這正是業餘牌手最容易被「帳面底池賠率」騙進去的陷阱！表面上看你是花 1 份錢去爭 4 份錢，但實際上這班公車上有三個看不見的危險：
</div>
<ol class="steps">
  <li><b>1. 多人底池裡，「一對」幾乎贏不了錢，「第二大好牌」最容易破產</b><br>
    在 4 人底池裡，翻牌開出後有極高機率至少有一個人中了兩對、暗三條、或強同花順子聽牌。你拿著 <span class="hand">QJo</span>、<span class="hand">A9o</span> 跟進去，就算翻牌中了頂對 Q 或 A，也很難在三個人的夾擊下安全走到河牌。</li>
  <li><b>2. 為什麼這時候「主動擠壓加注（Squeeze）」比「溫吞跟注」威力大十倍？</b><br>
    注意看場上的結構：第一個開池的人範圍可能還很寬，而中間那兩個「只敢平跟、不敢 3-Bet」的跟注者，早就親口承認<strong>「我手上沒有 <span class="hand">AA</span>、<span class="hand">KK</span>、<span class="hand">QQ</span>、<span class="hand">AK</span>（範圍已封頂）」</strong>！<br>
    • 當你這時拿強牌或 <span class="hand">A5s</span>、<span class="hand">KJs</span> 這類好同花牌，直接轟出一記 <strong>12bb–15bb 的擠壓 3-Bet</strong>，開池者因為忌憚後面還有兩個人而不敢亂跟，中間兩個拿中等牌平跟的人更只能乖乖棄牌——你常常連翻牌都不用看，就直接白撿桌上那 8bb–10bb 的死錢！</li>
  <li><b>3. 實戰面對「一人開池 + 多人跟注」的二分法</b><br>
    • <strong>能打多人堅果的牌（如小對子 <span class="hand">22</span>–<span class="hand">66</span> 專門抽暗三條、同花 A <span class="hand">Axs</span> 抽堅果同花）且有位置</strong>：可以便宜跟注抽大獎。<br>
    • <strong>強牌與優質同花大牌 / 同花 A 阻擋牌</strong>：直接加大尺度 <strong>Squeeze 擠壓加注</strong>，把肥美的死錢底池直接收進口袋！</li>
</ol>
`,

  'preflop-vs-3bet': `
<h3>💡 觀念分析與迷思破解：開池後被對手 3-Bet 覺得好難受？用「位置」一秒決定跟注還是棄牌！</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「我開池 2.5bb 後被對手 3-Bet 到 7.5bb 或 10bb，每次都覺得很糾結——棄牌覺得剛才投的 2.5bb 好浪費，跟注又怕翻牌沒中不知道怎麼辦。有沒有不用死背表格的判斷法？」</b><br>
  有！面對 3-Bet 時之所以會糾結，往往是因為還捨不得那已經投入的 2.5bb。只要先把那 2.5bb 忘掉，接著問自己一個最關鍵的問題——<strong>「這手牌進了翻牌圈，是我先說話（沒位置 OOP），還是他先說話（有位置 IP）？」</strong>
</div>
<ol class="steps">
  <li><b>1. 當你「有位置（IP，例如你在 BTN 開池，SB 或 BB 對你 3-Bet）」：可以安心多平跟！</b><br>
    因為盲注對你 3-Bet 通常是 10–11bb（以 10bb 為例：你補 7.5bb，跟注後底池約 21bb，必要勝率約 36%），更重要的是<strong>翻後三條街都是你最後行動</strong>！<br>
    • 這時你手上的中對子（<span class="hand">44</span>–<span class="hand">TT</span>）、同花百老匯大牌（<span class="hand">AQs</span>、<span class="hand">AJs</span>、<span class="hand">KQs</span>、<span class="hand">QJs</span>）甚至同花連張（<span class="hand">98s</span>、<span class="hand">87s</span>）都能舒服地平跟看翻牌，利用位置優勢在翻後跟對手周旋。</li>
  <li><b>2. 當你「沒位置（OOP，例如你在 CO 開池，被 BTN 3-Bet）」：少平跟，改用「4-Bet 或棄牌」為主！</b><br>
    當你在沒位置時平跟進一個 16bb 的 3-Bet 大底池，翻牌一旦沒中，你先過牌就會面對 BTN 的延續重注，非常痛苦。<br>
    • 因此在 OOP 面對 3-Bet，<strong>絕對不要拿非同花的次大牌（如 <span class="hand">AJo</span>、<span class="hand">ATo</span>、<span class="hand">KQo</span>）去平跟受罪</strong>——要嘛拿頂端好牌與少數阻擋牌直接 <strong>4-Bet 反擊</strong>，要嘛只留高品質的同花大牌與中高對子防守，其餘乾脆棄牌！</li>
  <li><b>3. 看對手是誰，比看自己的牌更重要！</b><br>
    如果在低級別牌局，一位整晚 3-Bet 率只有 2%–3% 的緊弱玩家突然對你 3-Bet，他的底牌幾乎寫在臉上就是 <span class="hand">QQ+</span>、<span class="hand">AK</span>——這時你連 <span class="hand">AQo</span>、<span class="hand">AJs</span> 都可以果斷一秒棄牌，省下的每一塊錢都是純利潤！</li>
</ol>
`,

  'preflop-4bet': `
<h3>💡 觀念分析與迷思破解：為什麼 100bb 籌碼下，4-Bet 不直接全下，而要下在 21bb–24bb 這個數字？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「別人 3-Bet 到 7.5bb 或 9bb，我手上有 <span class="hand">AA</span>、<span class="hand">KK</span> 或想拿 <span class="hand">A5s</span> 4-Bet 詐唬時，為什麼不乾脆直接喊 All-in（全下 100bb），而要下 21bb–24bb 這種只佔四分之一籌碼的尺度？」</b><br>
  這是一個非常經典的籌碼槓桿問題！如果你在 100bb 時直接把 4-Bet 喊成 100bb 全下，會立刻發生兩件對你極度不利的事：
</div>
<ol class="steps">
  <li><b>1. 直接全下 100bb 會「嚇跑所有比你差的牌，只留下能打敗你的牌」！</b><br>
    當你拿 <span class="hand">AA</span>、<span class="hand">KK</span> 時，你最希望對手的 <span class="hand">JJ</span>、<span class="hand">TT</span>、<span class="hand">AQs</span>、<span class="hand">KQs</span> 繼續把錢放進底池。如果你從 8bb 直接跳到 100bb 全下，對手除了 <span class="hand">AA</span>、<span class="hand">KK</span> 之外幾乎可以輕鬆棄掉所有牌；但如果你只 <strong>4-Bet 到 22bb</strong>，對手會覺得「只需要再補 13bb–14bb 就能看翻牌」，進而帶著一堆被你壓制的牌跟注進池！</li>
  <li><b>2. 22bb 的小尺度 4-Bet，讓你「進可全下、退可棄牌」！</b><br>
    • <strong>對你的詐唬牌（如 <span class="hand">A5s</span>）來說</strong>：你只冒 22bb 的風險，就能逼迫對手棄掉他 3-Bet 範圍裡所有的輕詐唬與邊緣牌（贏走底池裡的 10bb+ 死錢）；萬一對手真的拿 <span class="hand">AA</span>、<span class="hand">KK</span> 推 100bb 5-Bet 全下，你只需要拍拍屁股棄牌，<strong>還保住了手上的 78bb 籌碼</strong>！如果一開始就 4-Bet 全下 100bb，撞上大牌就直接出局了！</li>
  <li><b>3. 實戰 4-Bet 記憶法</b><br>
    • <strong>100bb 標準籌碼</strong>：有位置約對手 3-Bet 的 <strong>2.2–2.3 倍（約 20–22bb）</strong>，沒位置約 <strong>2.4–2.5 倍（約 22–25bb）</strong>。<br>
    • <strong>什麼時候才直接 4-Bet 全下？</strong>只有當雙方有效籌碼已經少於 <strong>40bb–50bb</strong>（例如錦標賽中後期），因為這時下到 22bb 已經超過一半籌碼、退無可退，直接推全下才最乾脆！</li>
</ol>
`,

  'limped-pots': `
<h3>💡 觀念分析與迷思破解：低級別牌桌大家都在溜入（Limp 1bb），我到底該跟著溜，還是加注隔離？</h3>
<div class="callout plain">
  <b>這堂課最常見的迷思：「在現場 1/2 或朋友局裡，常常前面三、四個人都只放 1bb 溜入（Limp）。如果我照教科書加注，他們還是會跟注變成多人大底池；那我是不是乾脆也花 1bb 跟著溜進去看翻牌比較划算？」</b><br>
  這是現場玩家與微級別玩家最常問的實戰難題！答案不是「永遠加注」也不是「永遠跟著溜」，而是把你的手牌分成兩類，分別採取<strong>「隔離收割（Iso-Raise）」</strong>與<strong>「便宜挖礦（Over-Limp）」</strong>：
</div>
<ol class="steps">
  <li><b>1. 拿到強高牌與大對子（如 <span class="hand">TT+</span>、<span class="hand">AK</span>、<span class="hand">AQ</span>、<span class="hand">KQs</span>）：一定要大尺度加注隔離（Iso-Raise）！</b><br>
    為什麼不能拿 <span class="hand">AK</span> 或 <span class="hand">QQ</span> 跟著溜 1bb？因為如果你只放 1bb，底池裡會有 5 到 6 個人一起免費看翻牌——再強的 <span class="hand">QQ</span> 對上五個隨機對手，勝率也會暴跌到只剩三、四成！<br>
    • <strong>正確做法</strong>：用 <strong>「3bb + 每位溜入者 1bb」</strong>（如果現場跟注很鬆，甚至直接開到 5bb–7bb）主動加注！把人數從 6 人縮減到 1–2 人，讓對手帶著更差的牌在已經做大的底池裡付錢給你。</li>
  <li><b>2. 當前面已經有好幾個人溜入，而你拿的是「小對子（<span class="hand">22</span>–<span class="hand">66</span>）或小同花連張」：可以破例跟著溜（Over-Limp）！</b><br>
    注意：<strong>「當第一個溜入的人（Open Limp）」永遠是錯誤的</strong>；但如果前面已經有 2–3 位休閒玩家溜入，你在後位拿著 <span class="hand">33</span> 或 <span class="hand">65s</span>，這時加注很難把他們全部趕走，反而花 1bb 跟著進池「抽暗三條或順子同花（Set Mining）」擁有極高的隱含賠率——中了大獎就收割整桌，沒中翻牌就直接免費丟掉！</li>
  <li><b>3. 一句話總結對付溜入桌的秘訣</b><br>
    <strong>「絕不當第一個溜入的人！強牌用大注把魚隔離出來單挑，投機小牌在多人溜入後便宜跟車抽堅果，翻後沒中真牌絕不對四個人硬詐唬！」</strong></li>
</ol>
`,
"board-texture": `
<h3>💡 觀念分析與迷思破解：一眼看穿牌面結構，不再被 1,755 種翻牌嚇倒</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我得背下所有牌面的分類才能打好翻牌。」</b> 很多人試圖死記硬背各種翻牌面的 GTO 頻率，結果實戰中遇到一張不同的牌就全亂了。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為撲克教學常把牌面分得太細（例如 A 高乾燥面、雙同花連張面等），讓人誤以為每種牌面都有一個固定的解法。其實牌面結構只不過是在回答一個問題：「這個牌面對誰的範圍比較有利？」</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>與其記 1,755 種翻牌，不如看三個核心指標：<strong>大牌、連接性、花色</strong>。大牌（A/K/Q）多，通常對翻前加注者有利；連接性強、花色多（濕潤面），通常對防守方的中等牌與聽牌有利。誰的「極強牌」多，誰就能打得更凶。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>誰中頭獎的機率大？</strong> 看到 <span class="cards">AsKd7c</span>，翻前 3-Bet 的人範圍裡滿滿的 <span class="hand">AA</span>、<span class="hand">AKs</span>，他有絕對優勢；看到 <span class="cards">8s7s6d</span>，防守方範圍裡的 <span class="hand">T9s</span>、<span class="hand">54s</span> 就成了主角。</li>
      <li><strong>牌面越「乾」，主動權越重：</strong> 乾燥面（如 <span class="cards">Ks7d2c</span>）大家都不容易中牌，這時翻前的優勢就能順延到翻後，適合高頻率的持續下注。</li>
      <li><strong>牌面越「濕」，越要小心防守方反撲：</strong> 在濕潤面（如 <span class="cards">JsTs9h</span>），對手的跟注範圍會包含大量聽牌，這裡的下注需要更大的尺度來保護你的成牌，或是準備好面對加注。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 牌面不是死的，它是你和對手範圍交集的舞台。誰的強牌多，誰就是主角。</div>
  `,

  "cbet": `
<h3>💡 觀念分析與迷思破解：持續下注（C-Bet）不是買保險，是施加壓力的藝術</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「翻牌前我是加注者，翻牌後不管有沒有中，我都要 C-Bet 一次。」</b> 這種盲目的「自動化 C-Bet」在低級別或許有用，但遇到會思考的對手，這就是送錢的行為。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為這招在過去很好用！很多對手只要沒中牌就會棄牌，導致你覺得 C-Bet 是個萬靈丹。但當對手學會用聽牌過牌-加注，或是用第二大對子抓詐唬時，你的空氣 C-Bet 就會撞牆。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>C-Bet 的頻率與大小取決於<strong>範圍優勢（Range Advantage）</strong>與<strong>堅果優勢（Nut Advantage）</strong>。如果牌面完全沒幫助到你的翻前加注範圍（例如你是 UTG 加注，翻牌 <span class="cards">7s6s5d</span>），範圍優勢與堅果優勢都不在你這邊，這時高頻率過牌才是正解。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 適合高頻 C-Bet：</strong> 牌面乾燥、有大牌（如 <span class="cards">Ah8d3c</span>）。這裡你可以下小注（約 1/3 底池），因為對手大部分的牌都無法跟注，你的空氣牌也能便宜買到棄牌率。</div>
      <div><strong>❌ 適合提高過牌頻率：</strong> 牌面濕潤、對手中等牌多（如 <span class="cards">9h8h7c</span>）。即使你拿著 <span class="hand">AA</span>，有時候也需要過牌來控制底池，更別說你的空氣牌了。</div>
    </div>
    <ul>
      <li><strong>每次下注前問自己：</strong> 我是為了什麼下注？是希望更差的牌跟注（價值），還是希望更好的牌棄牌（詐唬）？如果都不是，請過牌。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 翻前優勢不等於翻後優勢。牌面不對，學會勇敢過牌。</div>
  `,

  "postflop-bet-types": `
<h3>💡 觀念分析與迷思破解：看穿 12 種下注類型，掌握牌桌上的劇本</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「Donk、Probe、Float 這些名詞太複雜了，我只要管自己牌好不好就好。」</b> 不懂下注類型，就像在聽外語，對手在跟你說話，你卻不知道他在表達什麼。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為撲克的術語確實很多，而且很多時候「下注」看起來就是把籌碼推出去而已。我們習慣把焦點放在自己的手牌，而忽略了下注的「語境（Context）」。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>所有的下注類型都可以用三個問題拆解：<strong>1. 上一街誰是攻擊者？ 2. 誰有位置優勢？ 3. 上一街的動作是過牌還是下注？</strong> 搞懂這三點，名詞只是標籤，你真正看到的是「主動權的轉移」。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>反客為主（Donk Bet）：</strong> 防守方在沒有主動權時率先下注。這在 GTO 中頻率極低，如果對手這麼做，他要不是超級強牌想造池，就是爛牌想試探。</li>
      <li><strong>趁虛而入（Probe & Float）：</strong> 當攻擊者示弱（過牌）時，你立刻下注搶奪底池。轉牌 Probe（沒位置時）或翻牌 Float（有位置時）是你懲罰對手放棄主動權的最佳武器。</li>
      <li><strong>解讀劇本：</strong> 不要只看對手下注多少，要看他在「什麼時候」下注。一個在翻牌跟注，轉牌對手過牌後立刻下大注的人，通常不是在開玩笑。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 下注是撲克的語言。位置加主動權，決定了這句話的重量。</div>
  `,

  "bet-sizing": `
<h3>💡 觀念分析與迷思破解：下注大小不是看牌強弱，是看「牌面與範圍」</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我拿好牌就下大注，拿弱牌或想詐唬就下小注（或反過來），這樣最合理。」</b> 這是最容易被對手看穿的「尺寸馬腳（Sizing Tell）」。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為人類的直覺是「牌強 = 自信 = 籌碼推多一點」。或者覺得「詐唬 = 怕被抓 = 下大一點嚇跑別人」。這會讓你的下注尺寸變成你底牌的翻譯機。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>你的下注大小應該由<strong>「整個範圍」</strong>來決定，而不是當下那一手牌。如果這個牌面你整體極強，你想把對手全下，你就需要幾何增長的大尺寸；如果這個牌面你只是想買便宜的棄牌率，你整個範圍就該下小注。你的強牌和詐唬牌，必須用<strong>同一個尺寸</strong>來隱藏彼此。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 小注（1/4 ~ 1/3 池）：</strong> 用在乾燥面、對手範圍很難有牌時。你的目標是極大化對手空氣牌的痛苦，便宜拿走底池。這裡你的詐唬和價值都要下小。</div>
      <div><strong>✅ 大注（2/3 ~ 超池）：</strong> 用在濕潤面，或你的範圍極化（只有堅果或空氣）時。你想讓對手的中等對子付出慘痛代價。</div>
    </div>
    <ul>
      <li><strong>目標導向：</strong> 下注前問：「這個尺寸可以被什麼差牌跟？可以打蓋什麼好牌？」如果 1/3 池就能打蓋空氣，何必下滿池？</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 牌面決定尺寸，尺寸掩護範圍。別讓你的籌碼說出你的底牌。</div>
  `,

  "spr": `
<h3>💡 觀念分析與迷思破解：SPR 是你的安全帶，別在單次加注底池全下頂對</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我拿到 <span class="hand">AKo</span>，翻牌中了 A，這把牌我死活都不退！」</b> 結果在單次加注底池裡，對方河牌推全下，你跟注後看到對手是兩對或三條。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為我們對「牌力」的認知常是絕對的（頂對頂踢腳很大！）。但撲克裡的牌力是<strong>相對的</strong>，而且跟「剩餘籌碼量（SPR）」息息相關。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>SPR（剩餘有效籌碼 ÷ 底池大小）決定了你要用什麼強度的牌來「打光籌碼」。SPR 越小（例如 3-Bet 底池），你需要打光的牌力門檻越低；SPR 越大（如單次加注深籌碼），你打光所需的牌力就必須越強（通常要兩對、暗三條以上）。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>SPR 1~3（3-Bet/4-Bet 底池）：</strong> 你的頂對頂踢腳（TPTK）或超對幾乎都能直接打光。不用擔心，因為底池已經夠大了。</li>
      <li><strong>SPR 4~6：</strong> 頂對開始變得尷尬。你可以價值下注兩條街，但如果遇到對手加注，你必須有能力棄掉頂對。</li>
      <li><strong>SPR 10+（單次加注底池）：</strong> 頂對只是個中等牌！想在這種深籌碼情況下打光所有籌碼，通常你面對的都是對手的兩對或三條。學會控制底池大小。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 底池越大，頂對越強；籌碼越深，頂對越慌。看著 SPR 打牌。</div>
  `,

  "defense-postflop": `
<h3>💡 觀念分析與迷思破解：翻後防守的藝術，拒絕成為「提款機」或「膽小鬼」</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「只要對手下注，我沒中頂對就趕快蓋牌，免得被騙錢。」或「他一定在詐唬我，我用底對抓到底！」</b> 這是兩種極端，都會讓你嚴重漏財。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為我們害怕未知。棄牌是最安全的選擇，跟到底則是被自我意識綁架。這兩者都忽略了數學與對手範圍的客觀事實。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>防守的頻率取決於<strong>底池賠率（Pot Odds）</strong>與<strong>最小防守頻率（MDF）</strong>。對手下小注，給你的賠率很好，你就必須用更寬的範圍（包括中對、底對、卡順聽牌）跟注；對手下大注，你可以理直氣壯地棄掉許多邊緣牌。防守不是靠感覺，是看價格。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 翻牌面對 1/3 小注：</strong> 你的防守範圍要極寬。有兩張高牌、有後門同花、有任何對子，都應該跟注。別怕，他很多時候也是空氣。</div>
      <div><strong>✅ 河牌面對滿池大注：</strong> 你的防守範圍要極窄。除非你認為他的詐唬過度，否則連頂對都可以考慮棄掉。</div>
    </div>
    <ul>
      <li><strong>別怕被詐唬：</strong> 如果你從來沒有被詐唬過，代表你棄牌太多了。偶爾被抓到詐唬，是為了整體策略的平衡付出的合理成本。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 小注要勇敢看牌，大注要冷靜放手。防守是看價格，不是賭氣。</div>
  `,

  "oop-play": `
<h3>💡 觀念分析與迷思破解：沒有位置（OOP）時，「過牌」不是認輸，是陷阱</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我翻前 3-Bet 了，雖然在盲注位沒位置，但我還是要繼續下注，不然看起來太弱了。」</b> 沒位置硬打，是破產的最快捷徑。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為我們把「過牌」等同於「我牌不好」。我們害怕示弱會被對手欺負，所以用下注來掩飾自己的不安。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>位置優勢在撲克中是絕對的。當你在 OOP（Out of Position）時，你永遠比對手少看一個動作。為了彌補這個劣勢，GTO 策略會要求你在 OOP 時<strong>大幅提高過牌頻率</strong>。這不是示弱，而是保護你的整個範圍，讓對手不敢輕易開槍。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>把強牌藏在過牌裡：</strong> 如果你在 OOP 永遠只用弱牌過牌，對手只要看你過牌就可以無腦下注。你必須把一些 <span class="hand">AA</span> 或頂對也加入過牌範圍，這叫「保護過牌範圍」。</li>
      <li><strong>接受勝率的流失：</strong> 在 OOP 時，即使你有優勢，你能實現的勝率（Equity Realization）也會打折。不要勉強在不利位置造大底池，這就是位置的代價。</li>
      <li><strong>善用過牌-加注（Check-Raise）：</strong> 這是 OOP 最強的武器。面對喜歡亂下注的對手，過牌-加注能瞬間奪回主動權並懲罰他們。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 沒位置就多過牌。你的過牌裡要有刺，別人才不敢亂咬。</div>
  `,

  "draws-play": `
<h3>💡 觀念分析與迷思破解：聽牌不是用來「跟」的，半詐唬的藝術</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我有同花聽牌！我要一路跟注到底，中花就發財了！」</b> 這是最典型的「魚」式打法，長期下來你付出的跟注費絕對大於你中牌贏來的錢。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為中聽牌的感覺太爽了！大腦會記住那次河牌中花的快感，卻忘記了前面九次聽牌失敗丟掉的籌碼。我們被「隱含賠率」的幻想蒙蔽了。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>純跟注聽牌，你只有一種贏法：<strong>中牌</strong>。但如果你主動加注聽牌（半詐唬 Semi-Bluff），你有兩種贏法：<strong>中牌，或是對手棄牌</strong>。這多出來的棄牌率（Fold Equity），才是讓聽牌從 -EV 變成 +EV 的關鍵。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 適合加注的聽牌：</strong> 組合聽牌（同花兼買順）、沒有攤牌價值的低牌聽牌（如 <span class="cards">6s5s</span> 買花）。因為你現在牌很弱，加注打蓋對手賺最大。</div>
      <div><strong>✅ 適合跟注的聽牌：</strong> 帶有攤牌價值的聽牌（如 A 高同花聽牌、帶對子的聽牌）。你本身有機會贏，不需要冒著被再加注打飛的風險。</div>
    </div>
    <ul>
      <li><strong>算算賠率：</strong> 轉牌面對對手的滿池下注，你在河牌中花的機率（9 ÷ 46 ≈ 19.6%）根本不夠賠率（需要 33.3%）。硬跟是數學上的自殺。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 聽牌是被動的，半詐唬是主動的。多給自己一種贏的方式。</div>
  `,

  "hand-reading": `
<h3>💡 觀念分析與迷思破解：讀牌不是通靈，是無聊的「漏斗篩選法」</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「電視上的神人看對手一眼，就說『你拿著梅花 7 跟方塊 8』，我也要練這種通靈術！」</b> 這是電影效果。真實的讀牌從來不是猜具體兩張牌，而是估計一個「範圍」。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為猜中具體兩張牌的成就感太高了，會讓你覺得自己像個天才。但這在邏輯上是不可能的，因為玩家很多時候會用不同的牌做出相同的動作。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>讀牌是一個<strong>「漏斗」</strong>。從翻前開始，對手有一個 100% 的範圍；他加注，漏斗縮小到 20%；翻牌他 C-Bet，漏斗縮小到 10%；轉牌他過牌，漏斗篩選掉堅果牌... 你是一步步排除不可能的牌，最後剩下一個「合理範圍的集合」。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>第一步定錨：</strong> 他翻前的動作是什麼？UTG 加注絕對沒有 <span class="hand">T7o</span>，別在河牌懷疑他有這手牌。</li>
      <li><strong>動作不一致就是破綻：</strong> 翻牌和轉牌都瘋狂下注，河牌卻面對危險牌秒過牌。他的範圍裡「超強牌」被篩掉了，剩下的是中等牌或放棄的詐唬。</li>
      <li><strong>把對手當成一個群體：</strong> 想想「在這個情況下，普通玩家會用什麼牌這麼打？」而不是「這個人現在到底拿什麼」。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 讀牌不是猜底牌，是做減法。動作越極端，範圍越清晰。</div>
  `,

  "3bet-pots": `
<h3>💡 觀念分析與迷思破解：3-Bet 底池變大了，但你的下注應該變小</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「這是 3-Bet 底池，底池好大！為了保護我的超對，我翻牌要下注半池或 2/3 池！」</b> 這樣打，你只會趕走你想贏的錢，並被比你大的牌清空。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為底池數字變大，心理壓力也變大，直覺上會想下大注來「宣示主權」或「快點結束這局」。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>在 3-Bet 底池中，雙方的 SPR（籌碼底池比）已經縮小到約 4–6（盲注 3-Bet 被跟約 4、有位置 3-Bet 被跟約 5.6）。這意味著你不需要在翻牌下大注：三條街每街下約 54%–65% 底池（幾何尺度：SPR 4 → 約 54%、SPR 5.6 → 約 65%）就能在河牌剛好打光；翻牌先用 1/4–1/3 小注、轉河再放大也來得及。<strong>翻牌不必急著造池</strong>，而且小注能保留對手範圍裡的弱牌。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 3-Bet 翻牌圈的黃金尺寸：</strong> 1/4 到 1/3 底池。尤其在低牌乾燥面，你的高對範圍優勢極大，小注能讓對手痛苦不堪。</div>
      <div><strong>❌ 錯誤的保護心態：</strong> 在 <span class="cards">Jh8d4c</span> 牌面拿著 <span class="hand">QQ</span> 下注 2/3 池。對手拿 <span class="hand">AKo</span> 會輕鬆蓋牌（你沒賺到錢），拿 <span class="hand">JJ</span> 會全下（你死定了）。</div>
    </div>
    <ul>
      <li><strong>SPR 越小，越不需要大注造池：</strong> 底池已經幫你造好了，慢慢來，優雅地把籌碼放進去。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 3-Bet 底池是絞肉機，小注就足以致命。不需要用力過猛。</div>
  `,

  "turn-river": `
<h3>💡 觀念分析與迷思破解：轉牌與河牌，告別「沒中就放棄」與「硬開三槍」</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我翻牌 C-Bet 詐唬被跟了，轉牌沒中，他一定有牌，我放棄吧。」或是「我要展現氣勢，閉著眼睛開三槍詐唬到底！」</b> 這兩種打法都太好預測了。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為轉牌是決策最困難的一街。底池變大了，失誤的成本變高。我們往往屈服於恐懼（放棄），或是屈服於衝動（無腦硬打）。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>轉牌要不要開第二槍，取決於<strong>轉牌這張牌改變了什麼？</strong>。如果發出一張對你範圍有利的高牌（如 A 或 K），或者讓你的空氣牌增加了聽牌勝率（如多了一個同花聽牌），這就是你繼續詐唬的最佳時機（Barrel）。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>尋找「好轉牌（Good Turn Card）」：</strong> 翻牌 <span class="cards">Ts7d3c</span>，你拿 <span class="hand">QJs</span> C-Bet 被跟。轉牌發 <span class="cards">Ks</span>。這張 K 對翻前加注者的範圍有利，而且給了你兩頭順聽牌（A 或 9；若是 <span class="cards">QsJs</span> 還多了同花聽牌），請大力開第二槍！</li>
      <li><strong>壞轉牌請踩煞車：</strong> 轉牌發出重複的牌（如 7）或是完成明顯聽牌的牌，而你什麼都沒有，這時過牌放棄是最聰明的。</li>
      <li><strong>河牌看阻擋牌（Blockers）：</strong> 河牌詐唬時，你手上最好要有能「阻擋對手堅果牌」的牌。例如牌面有三張同花，你手上有該花色的 A 但沒成花，這就是最好的詐唬牌，因為對手絕對沒有堅果同花。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 轉牌看這張牌幫了誰，河牌看你擋住了對手的什麼牌。</div>
  `,

  "river-decisions": `
<h3>💡 觀念分析與迷思破解：河牌的三大決策，停止用中等牌害死自己</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「河牌我中了一個不錯的兩對，我要下大注拿價值！」然後被對手的順子或三條全下，只能無奈跟注。</b> 河牌是沒有未來的一街，一切塵埃落定。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為我們想要贏更多。但我們忽略了「當我下注，對手會用什麼牌跟注？」這個最根本的問題。在河牌，對手的跟注範圍會極度收縮。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>河牌的下注只有兩個原因：<strong>價值下注（Value Bet）</strong>讓更差的牌跟，或<strong>詐唬（Bluff）</strong>讓更好的牌蓋。如果你拿著中等牌下注，比你差的牌全蓋了，比你好的牌全跟了，這叫「自己搞自己（Value Owning）」。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 薄價值下注（Thin Value）：</strong> 如果你拿著頂對弱踢腳，覺得對手有更弱的頂對或第二大對，你可以下一個<strong>很小的注（如 1/4 池）</strong>。這能讓對手勉強跟注，萬一被加注也能輕鬆逃跑。</div>
      <div><strong>❌ 避免中等牌下大注：</strong> 河牌的大注/全下，範圍應該是極化的（極強或極弱）。中等牌在河牌最好的朋友是「過牌-跟注」或「過牌-過牌」。</div>
    </div>
    <ul>
      <li><strong>抓詐唬的 5 秒抉擇：</strong> 不要去算組合數了。問自己：「對手的線條合理嗎？他有什麼牌能這樣打？」如果他的故事充滿矛盾，你的中對子可能就夠贏了。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 河牌沒有如果。中等牌過牌求攤牌，強牌下注拿價值，空氣放手去詐唬。</div>
  `,

  "exploit": `
<h3>💡 觀念分析與迷思破解：既然剝削這麼賺，為什麼不從第一手牌就無腦剝削？過度調整的陷阱</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我聽說打低級別就是要剝削！我看他前兩把都蓋牌，他一定是個大緊佬，我要把把加注搞死他！」</b> 幾分鐘後，你被這個所謂的「大緊佬」用 <span class="hand">AA</span> 坑了你所有的籌碼。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為人類大腦非常擅長「尋找模式」，即使樣本數小到根本沒有統計意義。我們太急著幫對手貼標籤，並且過度相信自己的觀察。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>剝削的前提是<strong>「可靠的數據與觀察」</strong>。在只有 20 手牌的樣本下，對手 VPIP 是 0% 或 50% 都可能只是運氣（發牌波動）。如果你基於錯誤的假設進行「極端剝削」（例如 100% 詐唬他），你反而讓自己成為了被剝削的目標。GTO 是你的安全防護網，剝削是你確認對手漏洞後才打出的刺拳。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>未知玩家，先預設 GTO：</strong> 當你不認識對手時，先用接近 GTO 的平衡策略打。你不會贏最多，但你絕對不會犯大錯。</li>
      <li><strong>邊際調整，不要極端：</strong> 發現對手棄牌率高？你的 C-Bet 頻率可以從 50% 調高到 70%，而不是直接變成 100%。保留退路，萬一你看走眼了也不會破產。</li>
      <li><strong>隨時準備「退回基線」：</strong> 當你瘋狂剝削對手，對手開始反擊（例如對你的詐唬頻繁過牌-加注）時，你必須能立刻意識到：「啊，他發現了。」這時要迅速退回 GTO 防守。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 樣本不夠，GTO 來湊。剝削是微調的藝術，不是極端的豪賭。</div>
  `,

  "player-types": `
<h3>💡 觀念分析與迷思破解：撕下 HUD 的神話，用肉眼看穿 4 種玩家類型</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「沒有 HUD 數據軟體，我根本不會打牌了。在現場牌桌我怎麼知道誰是 VPIP 40 的魚？」</b> 過度依賴軟體，會讓你失去最基本的撲克觀察力。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>線上撲克養成了我們看數字打牌的習慣。VPIP、PFR、3B% 確實客觀，但它們只是結果。現場撲克或沒有 HUD 的環境，你需要直接看對手的「行為模式」。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>無論用什麼軟體，撲克玩家最終都可以粗略分為兩根軸線：<strong>鬆（玩很多牌）vs. 緊（只玩好牌）</strong>，以及<strong>凶（喜歡下注/加注）vs. 弱（喜歡過牌/跟注）</strong>。這組合出四種經典原型，你只要在 15 分鐘內觀察他們的幾個關鍵動作就能定位。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>鬆弱（Calling Station 提款機）：</strong> 特徵：一直平跟盲注（Limp），面對下注幾乎不蓋牌，但很少主動加注。對策：<strong>絕對不要詐唬他！</strong> 拿到好牌就下大注價值，他會用爛牌支付你。</li>
      <li><strong>鬆凶（Maniac 瘋子）：</strong> 特徵：幾乎每把牌都在加注，翻後無腦開槍。對策：放寬你的抓詐唬範圍，用頂對甚至中對跟他打光，讓他的侵略性摧毀他自己。</li>
      <li><strong>緊弱（Nit 石頭）：</strong> 特徵：一小時只玩兩把牌，下注時必定是堅果。對策：瘋狂偷他的盲注，當他主動反擊時，尊重他，果斷棄牌。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 不看數字看行為：平跟多是鬆弱，加注多是凶。對症下藥才是剝削。</div>
  `,

  "multiway": `
<h3>💡 觀念分析與迷思破解：多人底池的誠實原則，別把單挑神兵當成群戰武器</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我拿 <span class="hand">AKo</span>，翻牌中 A，這把有 4 個人看翻牌，我當然要像單挑一樣 C-Bet 半池保護我的頂對啊！」</b> 結果被後位一個加注，你進退兩難。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>我們學的大部分 GTO 理論和 Solver 解答，都是基於「單挑（Heads-up）」底池。在單挑時，頂對是強牌，高頻 C-Bet 詐唬是常態。但我們常忘記，人數變多，數學會發生劇變。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>在多人底池（Multiway）中，<strong>「防守負擔」是共享的</strong>。你不需要頻繁詐唬，因為要成功騙過 3 個人的機率，遠低於騙過 1 個人。同時，有人擊中兩對或暗三條的機率呈指數上升。所以多人底池的核心思維就是兩個字：<strong>誠實</strong>。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 縮小下注尺寸，極度減少詐唬：</strong> 如果你想下注，尺寸要小。而且你的空氣牌和弱聽牌，請直接過牌放棄，不要嘗試在 3 人底池逆天詐唬。</div>
      <div><strong>✅ 頂對大幅貶值：</strong> 在單挑底池，頂對能打光；在 4 人底池，頂對好踢腳面對加注，通常只能心碎棄牌。</div>
    </div>
    <ul>
      <li><strong>有真材實料才大聲：</strong> 在多人底池，誰敢下大注或加注，他通常就是有兩對或堅果。不用懷疑，相信他的誠實。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 單挑可以騙，群毆要誠實。人數越多，頂對越弱。</div>
  `,

  "live-tells": `
<h3>💡 觀念分析與迷思破解：真實牌桌的馬腳（Tells），不是電影裡的摸鼻子</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我看他下注時手在抖，還不敢看我，他一定是在心虛詐唬！我抓！」</b> 結果對手翻開堅果同花，他手抖是因為太興奮了。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>電影與大眾媒體把「馬腳」神化了，讓我們以為每個玩家都有一個像開關一樣的特定動作。但現實中，刻意表現出來的動作，大多是反向的假動作（Reverse Tells）。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>真正可靠的馬腳通常是<strong>無意識的生理反應</strong>或是<strong>時間馬腳（Timing Tells）</strong>。而且，馬腳永遠不能凌駕於「數學與範圍邏輯」之上。如果邏輯告訴你這裡 95% 要棄牌，不要因為對手吞了口水就去跟注。馬腳只是 51:49 決策時的最後一根稻草。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>強作弱，弱作強：</strong> 這是現場撲克最準確的鐵律。對手下注後故意嘆氣、搖頭、無奈地丟出籌碼（裝弱）？他通常有強牌。對手下注後死死盯著你、像雕像一樣展現氣勢（裝強）？通常是詐唬。</li>
      <li><strong>時間馬腳最真實：</strong> 線上或現場都適用。面對下注，<strong>「秒跟注（Snap Call）」</strong>極少是堅果，通常是聽牌或中等對子（因為堅果通常會想一下要不要加注）。</li>
      <li><strong>看籌碼，別看臉：</strong> 觀察對手在發牌前怎麼整理籌碼，或者他是不是已經提早把手放在籌碼上準備棄牌。這比看微表情有用多了。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 演弱就是真強，秒跟就是中等牌。把馬腳當輔助，別當聖旨。</div>
  `,

  "mental-game": `
<h3>💡 觀念分析與迷思破解：撲克心理學，別讓「上頭（Tilt）」偷走你的大腦</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我明明看了很多 GTO 教學，知道怎麼打才是對的。但只要被對手河牌 2 outs 絕殺，我就會開始把把 All-in，想把錢立刻贏回來！」</b> 這是最昂貴的衝動。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>人類的大腦設計是用來逃避痛苦和追求即時回報的。當你遭遇 Bad Beat（冤家牌），大腦的杏仁核會接管控制權，進入「戰鬥或逃跑」模式。這時候，你的前額葉（負責邏輯與 GTO）已經離線了。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>撲克是一個<strong>短期靠運氣，長期靠技術</strong>的遊戲。你在這一桌輸掉的錢，不需要在這一桌贏回來。你的 EV（期望值）是存在你的大腦裡的，只要你持續做出 +EV 的決策，機率大神最終會把錢還給你。上頭（Tilt）的本質，是無法接受變異數（Variance）的客觀存在。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>察覺上頭的生理訊號：</strong> 心跳加速？呼吸變淺？開始在心裡咒罵對手？這就是警告燈。此時你打的每一手牌都是 -EV。</li>
      <li><strong>斷路器機制（Circuit Breaker）：</strong> 給自己設定鐵律：只要被 Bad Beat 輸掉一個大底池，<strong>強制站起來離開牌桌 5 分鐘</strong>。去洗個臉，喝口水。中斷杏仁核的綁架。</li>
      <li><strong>專注於「決策」而非「結果」：</strong> 問自己：「如果再來一次，我會打得一樣嗎？」如果答案是會，那恭喜你，你打得很好，只是運氣不好。這值得慶祝，而不是生氣。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 錢不用在原桌贏回來。贏在決策，而不是贏在結果。離桌休息是最強的防禦。</div>
  `,

  "bankroll-mindset": `
<h3>💡 觀念分析與迷思破解：資金管理是底線，別讓「破產風險」毀了技術</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我技術比桌上的人都好，我帶了我一半的存款上桌打大級別，只要小心一點，穩贏的！」</b> 三個小時後，你遇到兩次不可避免的 Cooler（冤家牌），存款歸零。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>我們太相信自己的技術，而嚴重低估了撲克中的「變異數（Variance）」。我們以為技術好就能穩定獲利，就像上班領薪水一樣。但在撲克裡，連輸 10 個買入（Buy-ins）對頂尖高手來說也是家常便飯。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>資金管理（Bankroll Management）的唯一目的，是<strong>確保你永遠有籌碼能熬過數學上的低潮期（Downswing）</strong>。如果你只有 5 個買入的資金，只要運氣稍微差一點就可能輸光，破產風險（Risk of Ruin）極高。而且，當你在意那筆錢的輸贏時（Scared Money），你根本無法做出正確的 GTO 決策（例如你不敢做正確的河牌全下詐唬）。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>✅ 遵守買入鐵律：</strong> 現金桌至少準備 30~50 個買入；錦標賽（MTT）至少需要 100 個買入。低於這個數字，請降級（Move down）。</div>
      <div><strong>❌ 拒絕 Scared Money：</strong> 如果桌上的籌碼量會讓你心跳加速、捨不得吃一頓好料，你已經在越級打怪了。降級打，直到籌碼對你來說只是「記分牌」。</div>
    </div>
    <ul>
      <li><strong>接受下風期是工作的一部分：</strong> 連輸三個晚上？完全正常。這不是你技術退步，這只是變異數在發揮作用。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 沒有資金管理，再好的技術都是零。籌碼只是記分牌，別用生活費打牌。</div>
  `,

  "game-formats": `
<h3>💡 觀念分析與迷思破解：不同賽制切換，別把現金桌的神功用在錦標賽</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我是打現金桌的高手，我去打錦標賽（MTT）一定也能輕鬆輾壓！」</b> 結果在錦標賽中段，你因為死守現金桌的深籌碼打法，被盲注吸乾，早早淘汰。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>我們以為「撲克就是撲克」，只要底牌和規則一樣，打法就一樣。但不同賽制的核心目標和籌碼深度完全不同，導致最優策略（GTO）有天壤之別。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p><strong>現金桌（Cash Game）</strong>的籌碼深度通常是 100bb 以上，核心是「追求籌碼 EV（cEV）極大化」，你可以慢慢磨，等好牌造大池。而<strong>錦標賽（MTT）</strong>的盲注會不斷上漲，平均籌碼很快會掉到 20~40bb，且存在「生存價值（ICM）」。在錦標賽，籌碼的價值是不等價的：你輸掉的最後一顆籌碼，比你贏來的第一顆籌碼有價值得多。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>短碼是錦標賽的靈魂：</strong> 在 MTT，你必須學會 15bb 的推擠（Push/Fold）策略。很多在現金桌絕對要跟注的牌，在 MTT 決賽桌為了保名次，必須含淚蓋掉。</li>
      <li><strong>短牌（Short Deck）的價值重估：</strong> 玩 6+ 短牌時，同花大於葫蘆，順子極容易出現。頂對的價值大幅下降，你必須重新建立牌力認知。</li>
      <li><strong>切換腦袋：</strong> 上桌前告訴自己：「我現在打的是什麼賽制？」深籌碼打翻後，短籌碼打翻前。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 現金桌求最大化獲利，錦標賽求生存與推進。賽制不同，武器不同。</div>
  `,

  "mtt-basics": `
<h3>💡 觀念分析與迷思破解：錦標賽基礎，在「生存」與「累積」間走鋼索</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「錦標賽就是要活下去！我只要每一手牌都蓋掉，一直撐到錢圈（ITM）就賺了！」</b> 結果你以不到 3bb 的極短籌碼滑進錢圈，拿著最低獎金，永遠拿不到冠軍的大頭。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>這叫做「錢圈恐懼症」。因為進入錢圈是錦標賽的第一個明顯回報，我們的大腦會極度渴望這個確定的獎勵，從而放棄了去追求前三名的高額期望值。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>錦標賽的獎金結構是「頭重腳輕」的。冠軍拿走 20%，最後一名錢圈可能只拿回 1.5 倍報名費。為了贏得比賽，你必須在前期和中期<strong>積極累積籌碼</strong>，這意味著你必須承擔被淘汰的風險。只求生存的打法，在數學上是長期虧損的。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>❌ 錯誤的生存觀：</strong> 盲注很高，你有 15bb，拿到 <span class="hand">88</span> 卻不敢推全下，怕輸了被淘汰。這叫被盲注慢慢放血致死。</div>
      <div><strong>✅ 動態平衡：</strong> 錦標賽前期（深籌碼）打得像現金桌；中期（有前注，籌碼變淺）開始瘋狂偷盲；泡沫期（快進錢圈時），如果你是大籌碼，盡情霸凌那些想生存的小籌碼。</div>
    </div>
    <ul>
      <li><strong>目標是冠軍，不是錢圈：</strong> 當你面臨一個 +cEV（籌碼期望值為正）但有淘汰風險的決策時，除非是極端泡沫期，否則勇敢去拼。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 不冒險就是最大的風險。大籌碼霸凌小籌碼，別當只想熬進錢圈的石頭。</div>
  `,

  "icm-pushfold": `
<h3>💡 觀念分析與迷思破解：ICM 與推擠，不用背表也能感受「籌碼壓迫感」</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我在決賽桌剩 12bb，拿到 <span class="hand">AQo</span>，對手推全下，這牌太強了我秒跟！」</b> 然後你出局拿第 5 名，對手翻出 <span class="hand">AKo</span>。其實根據 ICM，這裡常常是正確的棄牌（尤其桌上還有更短的籌碼時）。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為我們還停留在「籌碼 EV（cEV）」的思維裡。在現金桌，12bb 拿 <span class="hand">AQo</span> 跟注全下絕對是賺的。但我們忽略了決賽桌名次獎金的跳躍差距（ICM - 獨立籌碼模型）。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>ICM 的核心概念是：<strong>「保住你現有籌碼的價值，比贏得新籌碼更重要」</strong>。如果你跟注全下，贏了籌碼翻倍，但你的獎金期望值並不會翻倍；如果輸了，你直接出局獎金鎖死。這種不對等，導致在錦標賽晚期，<strong>「跟注全下」的門檻必須極度收緊，而「主動推全下」的範圍可以放寬（因為有棄牌率）</strong>。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>跟注要地獄級嚴格：</strong> 面對全下，尤其你是中等籌碼面對大籌碼時，即使是 <span class="hand">AKo</span> 或 <span class="hand">JJ</span> 都有可能是必須棄掉的牌。讓小籌碼先去死，你的名次就前進了。</li>
      <li><strong>主動推擠（Push）永遠優於跟注（Call）：</strong> 自己推全下，你有機會不戰而勝撿走盲注；跟注全下，你只能硬碰硬比牌。</li>
      <li><strong>看誰最怕死：</strong> 如果你是大籌碼，看到中等籌碼，你可以用極寬的範圍推他全下，因為他有嚴重的 ICM 壓力，不敢隨便跟。這叫「ICM 霸凌」。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 自己推是猛虎，跟注推是羔羊。決賽桌上，活著看別人死就是賺錢。</div>
  `,

  "solver-basics": `
<h3>💡 觀念分析與迷思破解：Solver 軟體入門，別當盲目抄襲頻率的機器人</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「Solver（GTO 軟體）說這裡下注 1/3 池的頻率是 42.5%，過牌頻率是 57.5%，我實戰也要用手錶秒針來隨機執行！」</b> 這種死背小數點的做法，會讓你變成牌桌上最容易出錯的機器人。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為 Solver 太強大了，我們容易把它當成神諭。我們以為學 GTO 就是把軟體跑出來的那張五顏六色的頻率矩陣圖背下來。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>Solver 跑出的精確頻率，是建立在「對手也完美執行 GTO」的假設上。人類是不可能完美混合頻率的。學習 Solver 的目的不是<strong>背答案</strong>，而是<strong>學邏輯（Why）</strong>。為什麼這手牌會被選來詐唬？為什麼那個牌面它永遠過牌？</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>❌ 錯誤看 Solver：</strong> 「喔，<span class="hand">A5s</span> 在這裡有 15% 會 4-Bet 詐唬。」然後實戰中硬要湊那個 15%。</div>
      <div><strong>✅ 正確看 Solver 的 3 個問題：</strong> <br>1. <strong>整體的策略傾向是什麼？</strong>（例如：這個牌面是高頻還是低頻 C-Bet？）<br>2. <strong>尺寸選了哪幾個？</strong>（是選極化大注，還是範圍小注？）<br>3. <strong>它選了什麼牌做詐唬/價值？為什麼？</strong>（例如：因為 <span class="hand">A5s</span> 阻擋了對手的 AA/AK。）</div>
    </div>
    <ul>
      <li><strong>人類的簡化策略（Heuristics）：</strong> 把 42.5% 當成「一半一半」，把 80% 當成「幾乎總是做」。用大腦能處理的規則來打牌。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> Solver 是望遠鏡，用來理解地形，不是用來背地圖。學邏輯，別背數字。</div>
  `,

  "game-selection": `
<h3>💡 觀念分析與迷思破解：選桌就是最大的 +EV，遠離無意義的自尊之戰</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我是個有尊嚴的撲克玩家，我要去挑戰那桌全是常客（Reg）的高手桌，打敗他們才能證明我的實力！」</b> 恭喜你，你正在用最快的速度把錢送給賭場抽水（Rake）。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>自尊心與好勝心作祟。我們把撲克當成了體育競技，覺得虐菜勝之不武。但在現金桌，撲克的本質是投資與獲利，不是武林大會。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>這是一個經典的數學事實：<strong>「如果你是世界第 6 好的玩家，但你選擇坐在世界前 5 名那一桌，那你就是那桌的魚（Fish），你會輸錢。」</strong> 撲克的獲利來源，是桌上玩家實力的差距（Edge）。花 5 分鐘找一張有兩個大娛樂玩家的桌子，帶來的利潤往往比苦讀好幾十小時 GTO 還高。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>尋找「目標客戶」：</strong> 坐下前，掃視牌桌。有沒有人一直平跟？有沒有人喝醉了？有沒有人每次輸牌都在抱怨運氣？如果桌上全戴著耳機、一言不發打得很緊，<strong>立刻換桌</strong>。</li>
      <li><strong>位置決定利潤：</strong> 你不僅要找到魚，還要<strong>坐在他的左邊</strong>。這樣你每把牌都能對他擁有位置優勢，這是撲克裡最值錢的座位。</li>
      <li><strong>放下自尊：</strong> 離開艱難的牌桌不叫逃避，這叫「極佳的資金管理與高智商決策」。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 如果你上桌半小時還看不出誰是魚，那你就是那條魚。換桌是最好的戰術。</div>
  `,

  "hand-review": `
<h3>💡 觀念分析與迷思破解：別再只拿「冤家牌」討拍，掌握 5 分鐘高效覆盤法</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我今天輸了個大底池，我是 <span class="hand">KK</span> 翻前全下撞到 <span class="hand">AA</span>。我趕快截圖發到群組問大家這把要怎麼躲！」</b> 這種覆盤對你的技術提升是零。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>因為輸掉大底池最痛，情緒波動最大，我們急需別人的安慰（「兄弟這把沒辦法，Cooler」）。但這種「不可避免的命運」，根本沒有決策修正的空間。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>真正造成你長期虧損的，不是幾個月才遇到一次的 KK 撞 AA，而是你<strong>每天都在重複犯的「邊際錯誤」</strong>。例如：翻前盲注防守太寬、翻後沒位置 C-Bet 太多、河牌該價值下注卻退縮過牌。這些每次只輸幾 bb 的漏洞，才是覆盤的黃金礦脈。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <div class="compare">
      <div><strong>❌ 無效覆盤：</strong> 討論 Cooler（如暗三條撞更大的暗三條）、抱怨運氣、只討論自己輸最大的那一手牌。</div>
      <div><strong>✅ 高效的 5 分鐘覆盤：</strong> 挑出那些你<strong>「當時感到猶豫、不知道該下注還是過牌」</strong>的中等底池。這代表你的知識有盲區。</div>
    </div>
    <ul>
      <li><strong>覆盤三步驟：</strong> 1. 寫下翻前的範圍。2. 把牌局輸入 Solver 或 GTO 軟體。3. 對比自己的直覺與軟體的解答，找出「為什麼軟體這樣做」，並記錄成一條直覺規則。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 別覆盤命運，覆盤你的猶豫。真正漏水的是那些不起眼的小底池。</div>
  `,

  "study-plan": `
<h3>💡 觀念分析與迷思破解：看完 100 部影片還是不會打？把知識轉化為肌肉記憶</h3>
<div class="callout plain"><b>這堂課最常見的迷思：「我訂閱了三個撲克教學網站，每天看大師打牌的影片，我的技術一定突飛猛進！」</b> 結果一上牌桌，面對對手的加注，腦袋還是一片空白，又變回靠感覺打牌。</div>

<ol class="steps">
  <li><strong>為什麼你會有這個盲點？</strong>
    <p>看影片是一種「被動學習」，它會給你一種「我懂了」的錯覺（被動流暢性錯覺）。你看大師操作覺得很合理，但這就像看 Curry 投三分球，不代表你上場就能投進。撲克決策需要的是神經連結的即時反應。</p>
  </li>
  <li><strong>背後的真實邏輯是什麼（不用死背數字）？</strong>
    <p>學習撲克必須遵循<strong>「主動輸出」與「刻意練習」</strong>。你不能一次學 10 個概念。大腦在壓力下只能提取練到變成「肌肉記憶」的規則。你必須將複雜的 GTO 樹狀圖，壓縮成你在牌桌上能 3 秒內想起來的「啟發式規則（Heuristics）」。</p>
  </li>
  <li><strong>實戰腦袋怎麼想（2～3 個直覺原則）？</strong>
    <ul>
      <li><strong>一次只練一件事：</strong> 這個禮拜，我只練習「在大盲位面對按鈕位加注的防守範圍」。打牌時，除了這件事，其他憑直覺打。把這個動作練到反射層級。</li>
      <li><strong>主動暫停與自問：</strong> 在看教學影片時，對手下注，<strong>馬上按暫停！</strong> 先問自己：「如果是我，這裡打什麼尺寸？為什麼？」想好後再按播放。看大師的答案跟你的差距在哪裡。</li>
      <li><strong>使用訓練軟體（Trainer）：</strong> GTO Trainer 是最好的工具。每天花 20 分鐘像玩闖關遊戲一樣做決策題，這比看 2 小時影片有效十倍。</li>
    </ul>
  </li>
</ol>
<div class="callout tip"><b>實戰口訣：</b> 看懂不等於會打。一次專注一個漏洞，把思考練成膝跳反射。</div>
  `
});

// 自動將各課「觀念分析與迷思破解」併入課程 HTML（若位於「下一步」小節前則插入於其上方，讓目錄與閱讀動線自然銜接）
(GTO.THEORY || []).forEach(function (l) {
  if (!l || !l.id || !l.html) return;
  var c = (GTO.LESSON_CONCEPTS || {})[l.id];
  if (!c || l.html.indexOf(c.trim().slice(0, 28)) >= 0) return;
  var nextRe = /<h3[^>]*>[^<]*下一步[^<]*<\/h3>/i;
  var m = nextRe.exec(l.html);
  if (m) {
    l.html = l.html.slice(0, m.index) + '\n' + c.trim() + '\n\n' + l.html.slice(m.index);
  } else {
    l.html = l.html + '\n' + c.trim() + '\n';
  }
});

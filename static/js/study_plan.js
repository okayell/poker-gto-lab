/* GTO 撲克學院 — study_plan.js
 * 30 天系統化學習計畫（從零基礎新手村 → 基礎觀念 → GTO 核心 → 翻前範圍 → 翻後實戰 → 進階與覆盤）
 * 完整涵蓋全站 54 堂課程與 14 種互動練習模式。
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  GTO.STUDY_PLAN_WEEKS = [
    {
      week: 1,
      title: 'Week 1｜新手村與基礎觀念：看懂牌桌、牌型與底池數學',
      desc: 'Day 1–6：從零開始認識德州撲克流程、10 種牌型、6 人桌位置、169 種起手牌與二四法則，打下零盲點的基本功。'
    },
    {
      week: 2,
      title: 'Week 2｜GTO 核心思維：期望值、MDF、價值詐唬比與阻擋牌',
      desc: 'Day 7–11：理解為什麼頂尖牌手用「範圍」而非單手牌思考，掌握納許均衡、最低防守頻率、極化 vs 線性、棄牌權益與阻擋牌。'
    },
    {
      week: 3,
      title: 'Week 3｜6-Max 翻前武器庫：開池、3-Bet、盲注防守與 4-Bet',
      desc: 'Day 12–17：把每一手牌都會用到的翻前範圍（RFI、面對開池、SB/BB 防守、擠壓、面對 3-Bet、4-Bet 與溜入處理）練到反射動作。'
    },
    {
      week: 4,
      title: 'Week 4｜翻後三條街系統：牌面結構、C-Bet、SPR、讀牌與河牌決策',
      desc: 'Day 18–24：學會拆解翻牌結構、選擇下注尺度、計算 SPR、沒位置與聽牌處理、逐街讀牌，以及河牌薄價值與抓詐唬。'
    },
    {
      week: 5,
      title: 'Week 5｜實戰進階、剝削、錦標賽 ICM 與覆盤閉環',
      desc: 'Day 25–30：結合 HUD 與玩家類型精準剝削、掌握多人底池與馬腳、心理學與資金管理、錦標賽 ICM、Solver 與每週覆盤系統。'
    }
  ];

  GTO.STUDY_PLAN = [
    // =========================================================================
    // Week 1：新手村與基礎觀念（14 堂課）
    // =========================================================================
    {
      day: 1, week: 1, minutes: 25,
      title: '認識德州撲克與 10 種牌型大小',
      goal: '5 分鐘看懂遊戲目標，並能一眼分辨同花、順子、三條與踢腳大小。',
      lessons: ['welcome', 'hand-rankings'],
      drills: [
        { mode: 'handname', count: 10 },
        { mode: 'showdown', count: 10 }
      ],
      tip: '記住兩句新手口訣：「同花大於順子」、「五張比完才平分，第四、第五張叫踢腳（Kicker）」。'
    },
    {
      day: 2, week: 1, minutes: 25,
      title: '一手牌的完整流程與五大行動規則',
      goal: '弄懂盲注、翻牌/轉牌/河牌四個階段，以及過牌、下注、跟注、加注、全下的規則。',
      lessons: ['hand-flow', 'betting-actions'],
      drills: [
        { mode: 'theory', topic: 'hand-flow', count: 5 },
        { mode: 'theory', topic: 'betting-actions', count: 5 }
      ],
      tip: '翻前大盲位已經強制放了 1bb，所以翻前的第一次主動進攻叫做「開池加注（Open Raise）」。'
    },
    {
      day: 3, week: 1, minutes: 30,
      title: '看懂公共牌面與新手必備起手牌觀念',
      goal: '學會找出牌面上的堅果牌（The Nuts）、分辨成牌與聽牌，並知道哪些起手牌該直接棄掉。',
      lessons: ['reading-board', 'starting-hands-101'],
      drills: [
        { mode: 'nuts', count: 10 },
        { mode: 'theory', topic: 'starting-hands-101', count: 5 }
      ],
      tip: '同花（s）比非同花（o）勝率只多約 2.5%–3%，但可玩性與堅果潛力好很多；不過 J4s 這種斷連爛牌就算同花也是秒棄！'
    },
    {
      day: 4, week: 1, minutes: 30,
      title: '新手 10 大黃金策略、15 個常見錯誤與牌桌禮儀',
      goal: '建立「緊兇（TAG）」基本球風，避開溜入與追聽牌陷阱，並熟悉現場與線上禮儀。',
      lessons: ['beginner-strategy', 'beginner-mistakes', 'etiquette'],
      drills: [
        { mode: 'theory', topic: 'beginner-strategy', count: 5 },
        { mode: 'theory', topic: 'beginner-mistakes', count: 5 }
      ],
      tip: '現場口頭優先（說「加注」就必須加注，只丟一顆大籌碼不說話算跟注）；還沒輪到你時千萬別提早亮出棄牌動作。'
    },
    {
      day: 5, week: 1, minutes: 30,
      title: '完整規則精要、6 人桌位置學與 169 種手牌組合數',
      goal: '秒認 UTG / HJ / CO / BTN / SB / BB 六個位置，並背熟口袋對 6 組、同花 4 組、非同花 12 組。',
      lessons: ['rules', 'positions', 'hands-combos'],
      drills: [
        { mode: 'position', count: 10 },
        { mode: 'theory', topic: 'hands-combos', count: 6 }
      ],
      tip: '按鈕位（BTN）翻後永遠最後行動，是整張牌桌最賺錢的座位；手牌組合數 6 / 4 / 12 則是往後讀牌算範圍的乘法表。'
    },
    {
      day: 6, week: 1, minutes: 30,
      title: '撲克核心數學：底池賠率、期望值（EV）與二四法則',
      goal: '學會數補牌（Outs）、用二四法則秒算聽牌勝率，並用必要勝率公式判斷跟注是否划算。',
      lessons: ['poker-math', 'outs-odds'],
      drills: [
        { mode: 'outs', count: 10 },
        { mode: 'math', count: 10 }
      ],
      tip: '必要勝率公式：跟注金額 ÷（原底池 + 對手下注 + 你的跟注）。同花聽牌 9 Outs（轉牌約 18%、兩張牌約 36%），兩頭順 8 Outs（約 16% / 32%）。'
    },

    // =========================================================================
    // Week 2：GTO 核心思維（7 堂課）
    // =========================================================================
    {
      day: 7, week: 2, minutes: 30,
      title: '什麼是 GTO？納許均衡、MDF 與 Alpha 公式',
      goal: '搞懂不可剝削策略的本質，並熟記常見下注尺度（1/3、1/2、2/3、滿池）對應的 Alpha 與 MDF。',
      lessons: ['gto-intro', 'mdf-alpha'],
      drills: [
        { mode: 'theory', topic: 'gto-intro', count: 5 },
        { mode: 'math', count: 10 }
      ],
      tip: 'Alpha = 下注 ÷（底池 + 下注），MDF = 1 − Alpha。下 1/2 底池時 Alpha = 33.3%、MDF = 66.7%；下滿池時 Alpha = 50%、MDF = 50%。'
    },
    {
      day: 8, week: 2, minutes: 25,
      title: '價值與詐唬黃金比例、極化範圍 vs 線性範圍',
      goal: '明白河牌圈為什麼價值與詐唬要按尺度配比，以及什麼時候該用線性範圍、什麼時候該用極化範圍。',
      lessons: ['value-bluff'],
      drills: [
        { mode: 'theory', topic: 'value-bluff', count: 6 },
        { mode: 'math', count: 8 }
      ],
      tip: '河牌圈完美詐唬佔比 = 對手跟注的必要勝率 = B ÷ (P + 2B)。下滿池時詐唬佔 1/3（價值 : 詐唬 = 2 : 1）。'
    },
    {
      day: 9, week: 2, minutes: 30,
      title: '範圍思維（Range vs Nut Advantage）與權益實現（EQR）',
      goal: '學會區分「整體範圍平均誰強」與「誰擁有最多超強堅果」，並理解位置與同花連張如何影響權益實現率。',
      lessons: ['range-thinking', 'equity-realization'],
      drills: [
        { mode: 'theory', topic: 'range-thinking', count: 6 },
        { mode: 'theory', topic: 'equity-realization', count: 6 }
      ],
      tip: '原始勝率 50% 不等於能拿回 50% 底池！有位置、同花、連張的牌 EQR 經常超過 100%，沒位置的非同花斷連牌 EQR 常不到 70%。'
    },
    {
      day: 10, week: 2, minutes: 30,
      title: '棄牌權益（Fold Equity）、半詐唬與阻擋牌效應',
      goal: '學會計算半詐唬的雙重獲利來源，並利用卡牌移除效應挑選最佳的 3-Bet 與河牌詐唬牌。',
      lessons: ['fold-equity', 'blockers'],
      drills: [
        { mode: 'theory', topic: 'fold-equity', count: 6 },
        { mode: 'theory', topic: 'blockers', count: 6 }
      ],
      tip: '手裡有 1 張 A 時，對手拿到 AA 的組合從 6 組直接砍半剩 3 組！選詐唬牌要「阻擋對手的跟注範圍、不阻擋對手的棄牌範圍」。'
    },
    {
      day: 11, week: 2, minutes: 25,
      title: 'Week 1–2 階段總複習：數學、術語與 GTO 觀念驗收',
      goal: '透過綜合隨機題庫與翻前勝率直覺訓練，確保前兩週的公式與術語完全融會貫通。',
      lessons: ['poker-math', 'mdf-alpha', 'blockers'],
      drills: [
        { mode: 'equity', count: 10 },
        { mode: 'terms', count: 10 },
        { mode: 'math', count: 10 }
      ],
      tip: '遇到答錯的題目別急著跳過，點開解析下方的課程連結回讀 2 分鐘，記憶最深刻。'
    },

    // =========================================================================
    // Week 3：6-Max 翻前武器庫（8 堂課）
    // =========================================================================
    {
      day: 12, week: 3, minutes: 30,
      title: '翻前開池加注（RFI）：從 UTG 17% 到 BTN 45% 的擴張邏輯',
      goal: '記熟五個開池位置的百分比（UTG 17%、HJ 22%、CO 30%、BTN 45%、SB 43%）與邊界牌（如 UTG 的 55+/A3s+/ATo+/KQo、BTN 的 22+/A2s+/A2o+/K8o+）。',
      lessons: ['preflop-rfi'],
      drills: [
        { mode: 'preflop', count: 15 },
        { mode: 'paint', count: 2 }
      ],
      tip: '用「範圍默寫（Paint Drill）」先畫一次 UTG 與 BTN 的開池表，重點記住每條對角線與每列的最後一格邊界牌！'
    },
    {
      day: 13, week: 3, minutes: 30,
      title: '面對開池（vs Open）與盲注防衛戰（SB / BB）',
      goal: '理解為什麼非大盲位置面對開池以「3-Bet 為主、只留很窄的平跟」（SB 更是只 3-Bet 或棄牌），而大盲位（BB）因為已投入 1bb 且關閉行動能用寬範圍防守。',
      lessons: ['preflop-vs-open', 'blind-defense'],
      drills: [
        { mode: 'preflop', count: 15 },
        { mode: 'theory', topic: 'blind-defense', count: 6 }
      ],
      tip: '小盲位（SB）翻後永遠沒位置且後面還有大盲未表態，面對前位開池應採「3-Bet 或棄牌」策略，千萬別在 SB 習慣性平跟！'
    },
    {
      day: 14, week: 3, minutes: 30,
      title: '3-Bet 範圍建構與擠壓加注（Squeeze）實戰',
      goal: '學會 3-Bet 尺度（有位置約 3 倍＝7.5bb、在盲注沒位置約 4 倍＝10–12bb），分辨線性（SB 只 3-Bet 或棄牌）與極化（BB、保留平跟的位置）兩種範圍結構，並懲罰翻前冷跟注。',
      lessons: ['preflop-3bet', 'squeeze-coldcall'],
      drills: [
        { mode: 'preflop', count: 15 },
        { mode: 'theory', topic: 'squeeze-coldcall', count: 6 }
      ],
      tip: '擠壓（Squeeze）尺度口訣：前面每多一位跟注者，就在標準 3-Bet 尺度上再加約 1 個開池額（例如 2.5bb 開池 + 1 人跟注：有位置擠壓到約 10bb，在盲注沒位置擠壓到約 12–13bb）。'
    },
    {
      day: 15, week: 3, minutes: 30,
      title: '面對 3-Bet 的防守與 4-Bet / 5-Bet 全下數學',
      goal: '分清 IP 與 OOP 面對 3-Bet 的差異（UTG 被後位 3-Bet 時 AJo/KQo 直接棄牌；BTN 被盲注 3-Bet 時卻可以有位置跟注），以及 A5s/A4s 為何是最佳 4-Bet 詐唬牌。',
      lessons: ['preflop-vs-3bet', 'preflop-4bet'],
      drills: [
        { mode: 'preflop', count: 15 },
        { mode: 'theory', topic: 'preflop-4bet', count: 6 }
      ],
      tip: '不利位置（OOP）面對 3-Bet 時，非同花大牌（AJo、KQo、ATo）是最大陷阱，務必果斷棄牌；同花 Axs 與中高口袋對才是好跟注牌。'
    },
    {
      day: 16, week: 3, minutes: 25,
      title: '懲罰溜入者（Limpers）：隔離加注（Iso-Raise）與溜入底池',
      goal: '學會用「3bb + 每位溜入者 1bb（OOP 再 +1bb）」的尺度隔離娛樂玩家，創造有位置的單挑底池。',
      lessons: ['limped-pots'],
      drills: [
        { mode: 'theory', topic: 'limped-pots', count: 6 },
        { mode: 'preflop', count: 15 }
      ],
      tip: '當前面有人溜入時，跟著溜入只會創造 5 人大鍋底；用偏線性的強牌隔離加注（Iso-Raise），把底池變成你有位置的單挑局！'
    },
    {
      day: 17, week: 3, minutes: 30,
      title: 'Week 3 翻前畢業考：全位置範圍默寫與綜合抽考',
      goal: '不看範圍表完成 RFI、面對開池、面對 3-Bet 的連續抽考，正確率穩定達 85% 以上。',
      lessons: ['preflop-rfi', 'preflop-3bet', 'preflop-vs-3bet'],
      drills: [
        { mode: 'preflop', count: 25 },
        { mode: 'paint', count: 3 }
      ],
      tip: '上桌前花 3 分鐘刷 15 題翻前決策熱身，能大幅減少牌局中因為猶豫而犯下的翻前低級失誤。'
    },

    // =========================================================================
    // Week 4：翻後三條街系統（12 堂課）
    // =========================================================================
    {
      day: 18, week: 4, minutes: 30,
      title: '翻牌圈第一眼：牌面結構（Board Texture）與持續下注（C-Bet）',
      goal: '一眼判斷牌面是乾燥/潮濕、靜態/動態，並決定該用高頻小注（1/3）還是低頻大注（2/3+）。',
      lessons: ['board-texture', 'cbet'],
      drills: [
        { mode: 'texture', count: 10 },
        { mode: 'spots', count: 8 }
      ],
      tip: 'K-7-2 彩虹面屬於翻前加注者，用 1/3 底池高頻 C-Bet；8-7-6 雙色面連結度偏向大盲防守方，翻前加注者要大幅提高過牌率！'
    },
    {
      day: 19, week: 4, minutes: 30,
      title: '翻後下注類型大全與下注尺度理論（小注、超池與幾何尺度）',
      goal: '認識 C-Bet、延遲 C-Bet、探測注（Probe）、領先注（Donk），並掌握如何依範圍與剩餘籌碼挑尺度。',
      lessons: ['postflop-bet-types', 'bet-sizing'],
      drills: [
        { mode: 'theory', topic: 'postflop-bet-types', count: 6 },
        { mode: 'theory', topic: 'bet-sizing', count: 6 },
        { mode: 'spots', count: 6 }
      ],
      tip: '當翻前加注者在翻牌過牌示弱，代表他通常沒有頂端超強牌，這時轉牌由 OOP 主動打出的「探測下注（Probe Bet）」極具攻擊力。'
    },
    {
      day: 20, week: 4, minutes: 30,
      title: 'SPR（籌碼底池比）與翻後防守（跟注、浮call與過牌加注）',
      goal: '秒算四大底池的 SPR（17.7 / 5.6 / 3.9 / 1.7），並學會用後門同花與後門順挑選翻牌防守牌。',
      lessons: ['spr', 'defense-postflop'],
      drills: [
        { mode: 'theory', topic: 'spr', count: 5 },
        { mode: 'theory', topic: 'defense-postflop', count: 5 },
        { mode: 'spots', count: 8 }
      ],
      tip: '面對 1/3 底池小注時，有沒有「後門同花（Backdoor Flush Draw）」加「後門順子」往往是決定一手高牌該跟注還是棄牌的分水嶺。'
    },
    {
      day: 21, week: 4, minutes: 30,
      title: '不利位置（OOP）生存指南與聽牌實戰打法',
      goal: '掌握 OOP 為什麼要先過牌保護範圍，以及同花聽牌、兩頭順、卡順與組合聽牌何時半詐唬、何時跟注。',
      lessons: ['oop-play', 'draws-play'],
      drills: [
        { mode: 'theory', topic: 'oop-play', count: 6 },
        { mode: 'theory', topic: 'draws-play', count: 6 },
        { mode: 'spots', count: 6 }
      ],
      tip: '不是所有聽牌都要無腦快打！有 A 高攤牌價值的堅果同花聽牌常可跟注控池；沒有攤牌價值的低端順聽牌或帶後門花的卡順更適合主動加注半詐唬。'
    },
    {
      day: 22, week: 4, minutes: 30,
      title: '逐街讀牌（Hand Reading）漏斗法與 3-Bet 底池翻後策略',
      goal: '學會從翻前到河牌一步步剔除對手不可能的牌，並適應 3-Bet 底池低 SPR 的尺度與承諾門檻。',
      lessons: ['hand-reading', '3bet-pots'],
      drills: [
        { mode: 'theory', topic: 'hand-reading', count: 6 },
        { mode: 'theory', topic: '3bet-pots', count: 6 },
        { mode: 'spots', count: 6 }
      ],
      tip: '讀牌永遠不要只猜對手「拿哪一手牌」，而是像漏斗一樣：翻前 300 組 → 翻牌跟注剩 140 組 → 轉牌跟注剩 60 組 → 河牌算出價值與詐唬各幾組。'
    },
    {
      day: 23, week: 4, minutes: 30,
      title: '轉牌與河牌多街規劃：第二槍選擇、薄價值、詐唬與抓詐唬',
      goal: '學會哪些轉牌適合開第二槍（Double Barrel），以及河牌圈三大決策（薄價值、阻擋牌詐唬、抓詐唬）的檢核清單。',
      lessons: ['turn-river', 'river-decisions'],
      drills: [
        { mode: 'theory', topic: 'turn-river', count: 5 },
        { mode: 'theory', topic: 'river-decisions', count: 6 },
        { mode: 'spots', count: 8 }
      ],
      tip: '河牌圈要薄價值下注（Thin Value Bet），必須確認「對手跟注範圍裡超過 50% 的組合比你弱」；如果只剩比你強的牌才跟，過牌攤牌更好。'
    },
    {
      day: 24, week: 4, minutes: 25,
      title: 'Week 4 翻後實戰特訓：翻牌、轉牌、河牌連續情境決策',
      goal: '連續完成 20 題翻後實戰情境與牌面判讀，把「位置 + SPR + 牌面結構 + 範圍」四合一思考變成習慣。',
      lessons: ['board-texture', 'cbet', 'river-decisions'],
      drills: [
        { mode: 'spots', count: 15 },
        { mode: 'texture', count: 10 }
      ],
      tip: '每進一個翻牌圈，先在心裡默念四個詞：「誰有範圍優勢？SPR 多少？牌面乾還濕？我的手牌屬於哪一類？」'
    },

    // =========================================================================
    // Week 5：實戰進階、剝削、錦標賽與覆盤閉環（13 堂課）
    // =========================================================================
    {
      day: 25, week: 5, minutes: 30,
      title: '從 GTO 走向精準剝削（Exploit）：五大玩家類型與 HUD 數據解讀',
      goal: '看懂 VPIP / PFR / 3-Bet / C-Bet / WTSD，並學會針對跟注站、緊弱（Nit）、瘋魚（Maniac）與常客調整策略。',
      lessons: ['exploit', 'player-types'],
      drills: [
        { mode: 'theory', topic: 'exploit', count: 5 },
        { mode: 'theory', topic: 'player-types', count: 6 }
      ],
      tip: '對跟注站「零詐唬、厚價值」；對緊弱玩家「多偷盲、多小注 C-Bet、面對他反加立刻尊重棄牌」。'
    },
    {
      day: 26, week: 5, minutes: 30,
      title: '多人底池（Multiway Pots）生存法則與現場 / 線上馬腳判讀',
      goal: '明白多人底池為何必須收緊詐唬、看重堅果潛力，並學會辨識下注節奏（Timing Tells）與尺度馬腳。',
      lessons: ['multiway', 'live-tells'],
      drills: [
        { mode: 'theory', topic: 'multiway', count: 5 },
        { mode: 'theory', topic: 'live-tells', count: 6 }
      ],
      tip: '河牌圈面對還能加注的下注時「秒跟（Snap Call）」常是中等抓詐牌（真正的堅果通常會考慮加注）；而長考後突然超池或加注，在低中級別往往偏重真強牌。'
    },
    {
      day: 27, week: 5, minutes: 30,
      title: '撲克心理學（防 Tilt 與 A-Game）與資金管理、變異數心態',
      goal: '建立嚴格的買入倍數規則（現金桌 30–50 BI、MTT 100+ BI），並學會辨識上頭訊號與設定停損機制。',
      lessons: ['mental-game', 'bankroll-mindset'],
      drills: [
        { mode: 'theory', topic: 'mental-game', count: 6 },
        { mode: 'theory', topic: 'bankroll-mindset', count: 5 }
      ],
      tip: '贏家的差距往往不在於順風時能贏多少，而在於下風期與情緒波動時能比別人少送幾個買入。'
    },
    {
      day: 28, week: 5, minutes: 35,
      title: '遊戲賽制全景、錦標賽（MTT）階段策略與 ICM 短碼推擠',
      goal: '了解現金桌、MTT、PKO、短牌與奧馬哈的差異，並掌握錦標賽泡沫期 ICM 風險溢價與 10–15bb 推擠表。',
      lessons: ['game-formats', 'mtt-basics', 'icm-pushfold'],
      drills: [
        { mode: 'theory', topic: 'game-formats', count: 5 },
        { mode: 'theory', topic: 'mtt-basics', count: 6 },
        { mode: 'theory', topic: 'icm-pushfold', count: 6 }
      ],
      tip: '現金桌 1 顆籌碼永遠等於 1 塊錢；錦標賽因為獎金跳級（ICM），輸光出局的代價遠大於翻倍的好處，泡沫期中碼切記避開大碼硬碰！'
    },
    {
      day: 29, week: 5, minutes: 30,
      title: '如何正確用 Solver 學習、選桌選位與高期望值實戰習慣',
      goal: '學會從 Solver 提煉「人類可執行的簡化規則」而非死背頻率，並養成交手娛樂玩家、坐在魚左邊的選桌習慣。',
      lessons: ['solver-basics', 'game-selection'],
      drills: [
        { mode: 'theory', topic: 'solver-basics', count: 6 },
        { mode: 'theory', topic: 'game-selection', count: 6 }
      ],
      tip: '世界上最強的 GTO 技術，坐在五位頂尖職業選手桌上也只是一起付抽水；挑一張有娛樂玩家的軟桌並坐在他左邊，贏率往往大幅提升。'
    },
    {
      day: 30, week: 5, minutes: 35,
      title: '建立終身進步系統：四步覆盤法、數據體檢與長期訓練閉環',
      goal: '學會牌後四步覆盤與追蹤軟體紅藍線/位置勝率體檢，並完成全站綜合畢業測驗！',
      lessons: ['hand-review', 'study-plan'],
      drills: [
        { mode: 'theory', topic: 'hand-review', count: 6 },
        { mode: 'mix', count: 20 }
      ],
      tip: '恭喜完成 30 天計畫！從今天起，每週只要維持「打牌標記 → 牌後覆盤 3 手 → 到漏洞自查表與練習中心修 1 個習慣」，你的牌技就會持續穩定成長。'
    }
  ];
})();

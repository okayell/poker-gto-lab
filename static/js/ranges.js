/* GTO 撲克學院 — ranges.js
 * 6 人桌（6-Max）100bb 無前注 GTO 翻前範圍資料與 13×13 互動範圍表渲染器。
 * 涵蓋四大情境共 40 組範圍：
 *   1. 開池加注（RFI）：UTG, HJ, CO, BTN, SB（共 5 組）
 *   2. 面對開池（vs RFI）：HJ/CO/BTN/SB/BB 面對前位開池（共 15 組）
 *   3. 開池後面對 3-Bet（vs 3-Bet）：UTG/HJ/CO/BTN/SB 被後位或盲位 3-Bet（共 15 組）
 *   4. 3-Bet 後面對 4-Bet（vs 4-Bet）：常見 5 組經典對決
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  // ---------------------------------------------------------------------------
  // 輔助：將精簡定義展開為 169 手牌的動作分布
  // 每個 scenario 定義 primaryAction（如 'raise' / '3bet' / '4bet' / '5bet'）與 secondaryAction（'call'），
  // 其餘未列出的手牌即為 'fold'。
  // 語法支援：
  //   hi: 高頻主要進攻動作（100%）
  //   hiMix: 混合主要進攻動作（50% 進攻 / 50% 次要或棄牌）
  //   call: 純跟注（100%）
  //   callMix: 混合跟注（50% 跟注 / 50% 棄牌）
  //   splitMix: 50% 主要進攻 + 50% 跟注
  // ---------------------------------------------------------------------------
  const RAW_SCENARIOS = [
    // =========================================================================
    // 1. 開池加注（RFI — Raise First In）
    // =========================================================================
    {
      id: 'rfi_utg',
      cat: 'rfi',
      hero: 'UTG',
      villain: null,
      title: 'UTG 槍口位開池 (RFI)',
      shortTitle: 'UTG 開池',
      openSize: '2.5bb',
      primaryAction: 'raise',
      secondaryAction: null,
      targetPct: '約 17%',
      hi: '55+, A3s+, K9s+, QTs+, JTs, T9s, 98s, 87s, ATo+, KQo',
      hiMix: '44, 33, 22, A2s, Q9s, J9s, 76s, KJo',
      summary: '6 人桌最前位，後面還有 5 位玩家未行動，被 3-Bet 風險最高且翻後常處於沒位置（OOP），因此只開強高牌、中高對子與具堅果潛力的同花牌。',
      tips: [
        '同花 A 幾乎都能開池（A3s+ 純開、A2s 混合）：A5s–A2s 具備堅果同花與輪子順（A-2-3-4-5）潛力，且阻擋對手 AA/AK。',
        '非同花牌非常緊：只開 ATo+ 與 KQo（KJo 僅邊緣混合，QJo 棄牌），因為非同花低踢腳極易被壓制（Dominated）。',
        '小對子 22–44 在高抽水環境可部分棄牌，標準 100bb 約以 50% 頻率開池挖暗三條（Set Mining）。'
      ]
    },
    {
      id: 'rfi_hj',
      cat: 'rfi',
      hero: 'HJ',
      villain: null,
      title: 'HJ 劫持位開池 (RFI)',
      shortTitle: 'HJ 開池',
      openSize: '2.5bb',
      primaryAction: 'raise',
      secondaryAction: null,
      targetPct: '約 22%',
      hi: '22+, A2s+, K8s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, 65s, ATo+, KJo+, QJo',
      hiMix: 'K7s, Q8s, 97s, 54s, A9o, KTo',
      summary: '後面剩 4 位玩家（CO、BTN、SB、BB）。相比 UTG，22–44 全部晉升為 100% 開池，並加入更多同花 K、同花連張與 KJo/QJo。',
      tips: [
        '口袋對子 22+ 全部 100% 開池。',
        '同花連張擴展至 65s（54s 混合），能在各種中低牌面保有強牌與聽牌覆蓋率（Board Coverage）。',
        '非同花百老匯（KJo、QJo）正式進入標準開池範圍。'
      ]
    },
    {
      id: 'rfi_co',
      cat: 'rfi',
      hero: 'CO',
      villain: null,
      title: 'CO 關煞位開池 (RFI)',
      shortTitle: 'CO 開池',
      openSize: '2.5bb',
      primaryAction: 'raise',
      secondaryAction: null,
      targetPct: '約 30%',
      hi: '22+, A2s+, K5s+, Q7s+, J8s+, T8s+, 97s+, 86s+, 75s+, 65s, 54s, A8o+, KTo+, QTo+, JTo',
      hiMix: 'K4s, 96s, 85s, 64s, A7o, A5o, K9o',
      summary: '僅次於 BTN 的黃金後位，後面只剩按鈕位與盲注。只要 BTN 棄牌，CO 翻後對盲注永遠享有位置優勢（IP），開池範圍擴展至約 30%。',
      tips: [
        '同花 K 大幅放寬到 K5s+，同花 Q 放寬到 Q7s+。',
        '非同花 A 純開 A8o+，A7o 與 A5o 混合開池（A5o 有輪子順潛力與 A 阻擋牌，比 A6o 更適合；A6o 棄牌）。',
        '若桌上的 BTN 非常緊（3-Bet 率低），CO 甚至可以直接偷用接近 BTN 的開池範圍。'
      ]
    },
    {
      id: 'rfi_btn',
      cat: 'rfi',
      hero: 'BTN',
      villain: null,
      title: 'BTN 按鈕位開池 (RFI)',
      shortTitle: 'BTN 開池',
      openSize: '2.5bb',
      primaryAction: 'raise',
      secondaryAction: null,
      targetPct: '約 45%',
      hi: '22+, A2s+, K2s+, Q2s+, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, 53s, A2o+, K8o+, Q9o+, J9o+, T9o',
      hiMix: 'J4s, J3s, 95s, 84s, 43s, T8o, 98o, 87o',
      summary: '整張牌桌獲利最高的位置！後面只剩兩位盲注，且翻後在翻牌、轉牌、河牌三條街永遠最後行動（IP），權益實現率（EQR）極高，可開池約 45% 手牌。',
      tips: [
        '所有同花 A（A2s+）、所有同花 K（K2s+）、所有同花 Q（Q2s+）與所有非同花 A（A2o+）都是標準開池！',
        '同花隔張（Gappers）如 85s、75s、64s、53s 在有位置時可玩性極佳。',
        '不開的主要是弱非同花牌（K7o 以下、Q8o 以下、J8o 以下、T7o、97o、86o、76o 等）與最低的同花垃圾牌（J2s、T5s 以下、63s、52s、42s、32s 等）；T8o、98o、87o 只做邊緣混合。'
      ]
    },
    {
      id: 'rfi_sb',
      cat: 'rfi',
      hero: 'SB',
      villain: null,
      title: 'SB 小盲位開池 (Raise-or-Fold)',
      shortTitle: 'SB 開池',
      openSize: '3.0bb',
      primaryAction: 'raise',
      secondaryAction: null,
      targetPct: '約 43%',
      hi: '22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 96s+, 86s+, 75s+, 65s, 54s, A2o+, K8o+, Q9o+, J9o+',
      hiMix: 'Q3s, Q2s, J5s, J4s, 85s, 64s, 53s, 43s, T9o, 98o, 87o',
      summary: '前面所有人棄牌到小盲，只剩大盲（BB）一位對手。採現代主流「只加注或棄牌（Raise-or-Fold）」策略，因翻後沒位置（OOP），開池尺度加大至 3bb 以降低 BB 的跟注賠率。',
      tips: [
        '為什麼不平跟（Limp）？雖然理論 Solver 存在極複雜的混合 Limp 策略，但實戰有抽水（Rake）且極難平衡，簡化為 3bb Raise-or-Fold 不但容易執行，EV 幾乎無損。',
        '因為只剩 BB 一人，雖然沒位置，開池寬度仍達 ~43%（略緊於 BTN 的 45%）。',
        '開 3bb 讓 BB 需要補 2bb 搶 4bb 底池（必要勝率 2 ÷ 6 = 33.3%），比面對 2.5bb 開池更難防守。'
      ]
    },

    // =========================================================================
    // 2. 面對開池（vs RFI — 3-Bet / Cold Call / Fold）
    // =========================================================================
    {
      id: 'vsrfi_hj_utg',
      cat: 'vsrfi',
      hero: 'HJ',
      villain: 'UTG',
      title: 'HJ 面對 UTG 開池',
      shortTitle: 'HJ vs UTG',
      openSize: '2.5bb → 3B 7.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 4.5% / 跟注 2.5%',
      hi: 'QQ+, AKs, AQs, AKo',
      hiMix: 'JJ, AJs, ATs, A5s, A4s, KQs, KJs, QJs, AQo',
      call: 'TT, 99, 88',
      callMix: 'JJ, 77, AJs, KQs, QJs, JTs, T9s',
      summary: '面對最強的 UTG 開池且後面還有 CO、BTN、SB、BB 四位玩家可能擠壓（Squeeze），HJ 應以緊凶的線性 3-Bet 為主，極少平跟。',
      tips: [
        '非大盲位置面對前位開池，平跟（Cold Call）範圍必須非常窄，否則容易被後位 Squeeze。',
        'A5s、A4s 是經典的 3-Bet 詐唬牌：有 A 阻擋牌減少 UTG 拿到 AA/AK 的機率，被跟注後又有同花與順子潛力。'
      ]
    },
    {
      id: 'vsrfi_co_utg',
      cat: 'vsrfi',
      hero: 'CO',
      villain: 'UTG',
      title: 'CO 面對 UTG 開池',
      shortTitle: 'CO vs UTG',
      openSize: '2.5bb → 3B 7.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 5% / 跟注 3%',
      hi: 'QQ+, AKs, AQs, AKo',
      hiMix: 'JJ, AJs, ATs, A5s, A4s, KQs, KJs, QJs, T9s, 98s, AQo',
      call: 'TT, 99, 88, 77',
      callMix: 'JJ, 66, AJs, ATs, KQs, KJs, QJs, JTs',
      summary: 'CO 對上 UTG 仍需尊重槍口位的強範圍，價值 3-Bet 以 QQ+/AK/AQs 為核心，搭配同花小 A 與部分同花連張平衡。',
      tips: [
        '中對子（77–TT）與高同花百老匯可少量平跟，利用位置優勢在翻後實現權益。',
        '避免用 KQo、AJo 這類非同花大牌平跟——常被 UTG 的 AK/AQ 嚴格壓制（Dominated）。'
      ]
    },
    {
      id: 'vsrfi_co_hj',
      cat: 'vsrfi',
      hero: 'CO',
      villain: 'HJ',
      title: 'CO 面對 HJ 開池',
      shortTitle: 'CO vs HJ',
      openSize: '2.5bb → 3B 7.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 7% / 跟注 3%',
      hi: 'JJ+, AJs+, KQs, AKo, AQo',
      hiMix: 'TT, ATs, A5s, A4s, A3s, KJs, KTs, QJs, JTs, T9s, 98s, 87s, KQo',
      call: '99, 88, 77, 66',
      callMix: 'TT, 55, ATs, KJs, QJs, JTs, T9s',
      summary: 'HJ 開池比 UTG 寬約 5%，因此 CO 的價值 3-Bet 擴展到 JJ+、AJs+、AQo，並增加同花百老匯（KJs、QJs、JTs）與 A5s–A3s 的 3-Bet 頻率。',
      tips: [
        'JJ 與 AQo 在對 HJ 時已經是明確的純價值 3-Bet。',
        '若想採取「零平跟（3-Bet or Fold）」簡化策略，可將 77–TT 與 KJs/QJs 併入 3-Bet，小對子棄牌。'
      ]
    },
    {
      id: 'vsrfi_btn_utg',
      cat: 'vsrfi',
      hero: 'BTN',
      villain: 'UTG',
      title: 'BTN 面對 UTG 開池',
      shortTitle: 'BTN vs UTG',
      openSize: '2.5bb → 3B 7.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 4.5% / 跟注 6%',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, AQs, AJs, A5s, A4s, KQs, T9s, 98s, 87s, AQo',
      call: 'JJ, TT, 99, 88, 77, 66, AQs, AJs, ATs, KQs, KJs, QJs, JTs',
      callMix: '55, 44, KTs, QTs, T9s, 98s, 87s, 76s, AQo',
      summary: 'BTN 擁有絕對位置優勢，且後面只剩兩位盲注，被 Squeeze 的機率較低，因此比 HJ/CO 保留更多平跟範圍（中對子、同花百老匯、同花連張）。',
      tips: [
        '對 UTG 時，JJ 與 AQs 有相當高比例可以選擇平跟，保留對手範圍中較弱的牌並利用位置打翻後。',
        '3-Bet 偏極化：用 QQ+/AK 打價值，搭配 A5s/A4s 與部分同花連張作為詐唬。'
      ]
    },
    {
      id: 'vsrfi_btn_hj',
      cat: 'vsrfi',
      hero: 'BTN',
      villain: 'HJ',
      title: 'BTN 面對 HJ 開池',
      shortTitle: 'BTN vs HJ',
      openSize: '2.5bb → 3B 7.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 7% / 跟注 6.5%',
      hi: 'JJ+, AQs+, KQs, AKo, AQo',
      hiMix: 'TT, AJs, ATs, A5s, A4s, A3s, KJs, QJs, JTs, T9s, 98s, 87s, KQo',
      call: 'TT, 99, 88, 77, 66, 55, AJs, ATs, KJs, KTs, QJs, QTs, JTs, T9s, 98s',
      callMix: '44, 33, 22, A9s, 87s, 76s, 65s, AJo, KQo',
      summary: 'BTN 對 HJ 可同時擴大 3-Bet 與跟注範圍：JJ+/AQs+/AQo+ 主動 3-Bet 施壓，中對子與同花連張平跟發揮位置優勢。',
      tips: [
        '同花連張（JTs、T9s、98s）在 BTN 是既能平跟也能混合 3-Bet 的彈性好牌：讓你在中低潮濕牌面也能拿到兩對、順子與強聽牌。',
        '小對子 22–55 若後面的盲注不愛 Squeeze，在 100bb 可以獲利平跟挖 Set。'
      ]
    },
    {
      id: 'vsrfi_btn_co',
      cat: 'vsrfi',
      hero: 'BTN',
      villain: 'CO',
      title: 'BTN 面對 CO 開池',
      shortTitle: 'BTN vs CO',
      openSize: '2.5bb → 3B 7.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 10% / 跟注 6%',
      hi: 'TT+, AJs+, ATs, KJs+, QJs, AKo, AQo, KQo',
      hiMix: '99, A9s, A8s, A5s, A4s, A3s, A2s, KTs, QTs, JTs, T9s, 98s, 87s, 76s, AJo, KJo',
      call: '99, 88, 77, 66, 55, A9s, A8s, KTs, QTs, JTs, T9s, 98s, 87s, 76s',
      callMix: '44, 33, 22, A7s, A6s, K9s, Q9s, J9s, 65s, 54s, AJo, ATo',
      summary: 'CO 開池達 30%，BTN 必須積極用約 10% 的 3-Bet（另約 6% 平跟）懲罰過寬的後位開池！TT+、ATs+、KJs+、AQo、KQo 都是直接 3-Bet 的主力。',
      tips: [
        '這是後位攻防最頻繁的戰場：BTN 對 CO 的 3-Bet 頻率遠高於對 UTG/HJ。',
        'KQo、AJo 帶有強高牌阻擋效應，拿來 3-Bet 比平跟更能直接拿下底池（Fold Equity）。'
      ]
    },
    {
      id: 'vsrfi_sb_utg',
      cat: 'vsrfi',
      hero: 'SB',
      villain: 'UTG',
      title: 'SB 面對 UTG 開池',
      shortTitle: 'SB vs UTG',
      openSize: '2.5bb → 3B 10bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 5%（只 3B 或棄牌）',
      hi: 'QQ+, AKs, AQs, AKo',
      hiMix: 'JJ, TT, AJs, ATs, A5s, A4s, KQs, KJs, QJs, AQo',
      call: '',
      callMix: '',
      summary: '小盲位（SB）面對開池採「只 3-Bet 或棄牌（3-Bet or Fold）」策略！因為平跟後大盲還在後面，且翻後永遠第一個行動（OOP），對 UTG 只用約 5% 的強線性範圍 3-Bet 到 10bb。',
      tips: [
        '為什麼 SB 不平跟？1. 給 BB 極佳賠率進池形成多人底池；2. 翻後永遠 OOP 權益實現率極低；3. 現金桌抽水（Rake）會吃掉平跟微薄的 EV。',
        'OOP 3-Bet 尺度需加大至約 4 倍（10bb），降低開池者用位置優勢便宜跟注的意願。'
      ]
    },
    {
      id: 'vsrfi_sb_hj',
      cat: 'vsrfi',
      hero: 'SB',
      villain: 'HJ',
      title: 'SB 面對 HJ 開池',
      shortTitle: 'SB vs HJ',
      openSize: '2.5bb → 3B 10bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 6.5%（只 3B 或棄牌）',
      hi: 'JJ+, AJs+, KQs, AKo, AQo',
      hiMix: 'TT, 99, ATs, A5s, A4s, KJs, KTs, QJs, JTs, T9s',
      call: '',
      callMix: '',
      summary: '同樣採「3-Bet or Fold」線性範圍（約 6.5%），尺度 10bb。以 JJ+、AJs+、KQs、AQo+ 為核心，加上 TT/99、ATs、KJs/QJs 與 A5s/A4s。',
      tips: [
        '線性（Linear / Merged）3-Bet 的特色：不放弱垃圾牌詐唬，而是由頂尖強牌一路往下延伸到中強同花百老匯與中對子。',
        '因為沒有平跟範圍，你的全部繼續手牌都集中在 3-Bet 裡，範圍非常紮實。'
      ]
    },
    {
      id: 'vsrfi_sb_co',
      cat: 'vsrfi',
      hero: 'SB',
      villain: 'CO',
      title: 'SB 面對 CO 開池',
      shortTitle: 'SB vs CO',
      openSize: '2.5bb → 3B 10.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 9.5%（只 3B 或棄牌）',
      hi: 'TT+, ATs+, KJs+, QJs, AKo, AQo',
      hiMix: '99, 88, 77, A9s, A8s, A5s, A4s, A3s, KTs, QTs, JTs, T9s, 98s, AJo, KQo',
      call: '',
      callMix: '',
      summary: '面對 CO 30% 的開池，SB 以約 9.5% 線性範圍 3-Bet 到 10.5bb（只 3-Bet 或棄牌），迫使 CO 放棄大量邊緣開池牌。',
      tips: [
        'TT+、ATs+、KJs+、QJs、AQo+ 全部 100% 3-Bet。',
        '88–99、JTs、T9s、A5s–A3s、AJo、KQo 以混合頻率加入 3-Bet。'
      ]
    },
    {
      id: 'vsrfi_sb_btn',
      cat: 'vsrfi',
      hero: 'SB',
      villain: 'BTN',
      title: 'SB 面對 BTN 開池',
      shortTitle: 'SB vs BTN',
      openSize: '2.5bb → 3B 10.5bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 14.5%（只 3B 或棄牌）',
      hi: '88+, A8s+, A5s, A4s, KTs+, QTs+, JTs, AKo, AQo, AJo, KQo',
      hiMix: '77, 66, 55, A7s, A6s, A3s, A2s, K9s, Q9s, J9s, T9s, 98s, 87s, 76s, ATo, KJo, QJo',
      call: '',
      callMix: '',
      summary: '盲注保衛戰的關鍵！BTN 開池高達 45%，SB 必須用約 14–15% 的寬線性範圍積極 3-Bet（只 3-Bet 或棄牌）反偷盲（Resteal）。',
      tips: [
        '對上 BTN，88+、A8s+、A5s–A4s、KTs+、QTs+、JTs、AJo+、KQo 都是直接 3-Bet 的正 EV 好牌！',
        '許多新手在 SB 對 BTN 3-Bet 不到 8%，這會讓 BTN 無成本瘋狂偷盲。'
      ]
    },
    {
      id: 'vsrfi_bb_utg',
      cat: 'vsrfi',
      hero: 'BB',
      villain: 'UTG',
      title: 'BB 大盲防守 UTG 開池',
      shortTitle: 'BB vs UTG',
      openSize: '2.5bb → 補 1.5bb / 3B 11bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 4% / 跟注 17%',
      hi: 'KK+, AKs, AKo',
      hiMix: 'QQ, AQs, A5s, A4s, A3s, KQs, QJs, JTs, T9s, 87s, 76s',
      call: 'QQ, JJ, TT, 99, 88, 77, 66, 55, 44, 33, 22, AQs, AJs, ATs, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KQs, KJs, KTs, K9s, QJs, QTs, Q9s, JTs, J9s, T9s, 98s, 87s, 76s, 65s, 54s, AQo, AJo, KQo',
      callMix: 'K8s, Q8s, J8s, T8s, 97s, 86s, 75s, 64s, ATo, KJo, QJo, JTo',
      summary: 'BB 已投入 1bb 且是翻前最後行動者（保證關門看翻牌），面對 2.5bb 只需補 1.5bb 搶 4bb 底池（必要勝率僅 27.3%）。對 UTG 強範圍，3-Bet 極化（KK+/AK + 少量同花連張/A5s），其餘可玩牌大量平跟。',
      tips: [
        '為什麼 BB 的 QQ、JJ、AQs 對 UTG 常選擇平跟？因為 UTG 開池很強，3-Bet 到 11bb 後只會留下更強的牌；平跟能保留 UTG 所有較弱的開池牌。',
        '所有口袋對子（22–QQ）、所有同花 A（A2s+）、同花百老匯與同花連張（54s+）都能憑便宜底池賠率跟注防守。'
      ]
    },
    {
      id: 'vsrfi_bb_hj',
      cat: 'vsrfi',
      hero: 'BB',
      villain: 'HJ',
      title: 'BB 大盲防守 HJ 開池',
      shortTitle: 'BB vs HJ',
      openSize: '2.5bb → 補 1.5bb / 3B 11bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 5.5% / 跟注 21.5%',
      hi: 'QQ+, AKs, AQs, AKo',
      hiMix: 'JJ, AJs, A5s, A4s, A3s, KQs, KJs, QJs, JTs, T9s, 98s, 87s, 76s, AQo',
      call: 'JJ, TT, 99, 88, 77, 66, 55, 44, 33, 22, AJs, ATs, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KQs, KJs, KTs, K9s, K8s, QJs, QTs, Q9s, Q8s, JTs, J9s, J8s, T9s, T8s, 98s, 97s, 87s, 86s, 76s, 75s, 65s, 64s, 54s, AQo, AJo, ATo, KQo, KJo, QJo, JTo',
      callMix: 'K7s, K6s, Q7s, J7s, T7s, 96s, 85s, 53s, 43s, A9o, KTo, QTo, T9o',
      summary: '對 HJ 開池，QQ 與 AQs 正式加入價值 3-Bet 主力，平跟範圍也隨之放寬至約 26%。',
      tips: [
        'BB 的 3-Bet 屬於「極化（Polarized）」結構：用最頂端強牌 + 邊緣或具阻擋/連接性的同花牌 3-Bet，中等強牌（如 TT、AJs、KQs）留在跟注範圍保護平跟強度。'
      ]
    },
    {
      id: 'vsrfi_bb_co',
      cat: 'vsrfi',
      hero: 'BB',
      villain: 'CO',
      title: 'BB 大盲防守 CO 開池',
      shortTitle: 'BB vs CO',
      openSize: '2.5bb → 補 1.5bb / 3B 11bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 8% / 跟注 27%',
      hi: 'JJ+, AJs+, KQs, AKo, AQo',
      hiMix: 'TT, ATs, A5s, A4s, A3s, A2s, KJs, KTs, QJs, QTs, JTs, T9s, 98s, 87s, 76s, 65s, AJo, KQo',
      call: 'TT, 99, 88, 77, 66, 55, 44, 33, 22, ATs, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KJs, KTs, K9s, K8s, K7s, K6s, QJs, QTs, Q9s, Q8s, Q7s, JTs, J9s, J8s, J7s, T9s, T8s, T7s, 98s, 97s, 96s, 87s, 86s, 85s, 76s, 75s, 65s, 64s, 54s, 53s, 43s, AJo, ATo, A9o, KQo, KJo, KTo, QJo, QTo, JTo, T9o',
      callMix: 'K5s, K4s, K3s, K2s, Q6s, Q5s, J6s, T6s, 74s, 63s, 42s, A8o, A7o, A5o, K9o, Q9o, J9o, 98o, 87o',
      summary: '面對 CO 30% 開池，BB 總防守約 35% 的手牌（約 8% 3-Bet + 27% 平跟），涵蓋幾乎所有同花好牌與中連結非同花牌。',
      tips: [
        'JJ+、AJs+、KQs、AQo+ 直接 3-Bet 打價值，搭配 A5s–A2s、同花連張與部分非同花大牌（AJo/KQo）平衡。',
        '同花 K（K6s+）、同花 Q（Q7s+）與各種同花隔張都能輕鬆跟注。'
      ]
    },
    {
      id: 'vsrfi_bb_btn',
      cat: 'vsrfi',
      hero: 'BB',
      villain: 'BTN',
      title: 'BB 大盲防守 BTN 開池',
      shortTitle: 'BB vs BTN',
      openSize: '2.5bb → 補 1.5bb / 3B 11bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 12.5% / 跟注 40%',
      hi: 'TT+, ATs+, KJs+, QJs, AKo, AQo, AJo, KQo',
      hiMix: '99, 88, A9s, A5s, A4s, A3s, A2s, KTs, K9s, QTs, Q9s, JTs, J9s, T9s, T8s, 98s, 87s, 76s, 65s, 54s, ATo, KJo, QJo',
      call: '99, 88, 77, 66, 55, 44, 33, 22, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KTs, K9s, K8s, K7s, K6s, K5s, K4s, K3s, K2s, QTs, Q9s, Q8s, Q7s, Q6s, Q5s, Q4s, Q3s, Q2s, JTs, J9s, J8s, J7s, J6s, J5s, T9s, T8s, T7s, T6s, 98s, 97s, 96s, 87s, 86s, 85s, 76s, 75s, 74s, 65s, 64s, 63s, 54s, 53s, 52s, 43s, 42s, 32s, ATo, A9o, A8o, A7o, A6o, A5o, A4o, A3o, A2o, KJo, KTo, K9o, K8o, QJo, QTo, Q9o, JTo, J9o, T9o, T8o, 98o, 87o, 76o',
      callMix: 'J4s, J3s, J2s, T5s, 95s, 84s, 73s, K7o, Q8o, J8o, 97o, 86o, 65o',
      summary: '德州撲克最常發生的單挑底池（BTN vs BB）！面對 BTN 45% 開池與極佳底池賠率，BB 總防守高達約 52.5%（約 12.5% 3-Bet + 40% 跟注）。',
      tips: [
        '幾乎所有同花牌（全部 Axs、Kxs、Qxs、同花連張與隔張）與全部 Axo 都在防守範圍內！',
        '3-Bet 提高到約 12.5%：TT+、ATs+、KJs+、QJs、AJo+、KQo 為價值核心，搭配大量同花連張與低同花牌作為極化 3-Bet。',
        '因為 BB 跟注範圍非常寬且頂端強牌（QQ+/AK）已經 3-Bet 走，翻後在乾燥高牌面 BB 範圍是封頂的（Capped），需注意防守頻率。'
      ]
    },
    {
      id: 'vsrfi_bb_sb',
      cat: 'vsrfi',
      hero: 'BB',
      villain: 'SB',
      title: 'BB 大盲防守 SB 開池 (3bb)',
      shortTitle: 'BB vs SB',
      openSize: '3.0bb → 補 2bb / 3B 9bb',
      primaryAction: '3bet',
      secondaryAction: 'call',
      targetPct: '3B 14% / 跟注 40.5%',
      hi: '99+, ATs+, KJs+, QJs, AKo, AQo, AJo, KQo',
      hiMix: '88, 77, A9s, A8s, A5s, A4s, A3s, A2s, KTs, QTs, JTs, T9s, 98s, 87s, 76s, 65s, 54s, K5s, Q6s, J7s, ATo, KJo, QJo, A5o, K9o',
      call: '88, 77, 66, 55, 44, 33, 22, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KTs, K9s, K8s, K7s, K6s, K5s, K4s, K3s, K2s, QTs, Q9s, Q8s, Q7s, Q6s, Q5s, Q4s, Q3s, Q2s, JTs, J9s, J8s, J7s, J6s, J5s, J4s, T9s, T8s, T7s, T6s, 98s, 97s, 96s, 95s, 87s, 86s, 85s, 76s, 75s, 74s, 65s, 64s, 63s, 54s, 53s, 52s, 43s, 42s, 32s, ATo, A9o, A8o, A7o, A6o, A5o, A4o, A3o, A2o, KJo, KTo, K9o, K8o, QJo, QTo, Q9o, JTo, J9o, T9o, T8o, 98o, 87o, 76o, 65o',
      callMix: 'J3s, J2s, T5s, T4s, 84s, 73s, K7o, K6o, Q8o, J8o, 97o, 86o, 54o',
      summary: '盲注大戰（Blind vs Blind）！這時 BB 對 SB 擁有翻後位置優勢（IP）！雖然 SB 開到 3bb，因為有位置（EQR > 100%），BB 仍可防守超過 50%，且 3-Bet 尺度只需 3 倍（9bb）。',
      tips: [
        '這是唯一 BB 在翻後有位置（IP）的防守情境！有位置讓你的權益實現率大幅提升。',
        '3-Bet 尺度只需 9bb（面對 3bb 開池的 3 倍），價值 3-Bet 放寬到 99+、ATs+、KJs+、AJo+、KQo，並混入低同花連張與阻擋牌施壓。'
      ]
    },

    // =========================================================================
    // 3. 開池後面對 3-Bet（vs 3-Bet — 4-Bet / Call / Fold）
    // =========================================================================
    {
      id: 'vs3bet_utg_hj',
      cat: 'vs3bet',
      hero: 'UTG',
      villain: 'HJ',
      title: 'UTG 開池被 HJ 3-Bet (7.5bb)',
      shortTitle: 'UTG vs HJ 3B',
      openSize: '2.5bb → 面臨 7.5bb (4B 21bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 15% / 跟注 22% / 棄牌 63%',
      baseScenario: 'rfi_utg',
      hi: 'KK+, AKs, AKo:50',
      hiMix: 'QQ, AQs, A5s, A4s, KQs, AKo',
      call: 'QQ, JJ, TT, 99, AQs, AJs, KQs',
      callMix: '88, 77, ATs, KJs, QJs, JTs, T9s, AKo',
      summary: 'UTG 面對緊鄰的 HJ 3-Bet，對手範圍極強（QQ+/AK 佔比高），且 UTG 翻後沒位置（OOP）。只用 KK+/AK 與少量 A5s/A4s 阻擋牌 4-Bet，中強同花牌與 JJ–99 謹慎跟注，非同花邊緣牌（ATo–AQo、KQo）果斷棄牌！',
      tips: [
        '注意：本頁百分比是以「全體手牌」或「原本開池範圍」對照；灰底有虛線框的代表「原本有開池、面對 3-Bet 應該棄牌（Fold to 3-Bet）」的手牌！',
        '為什麼 AQo 在 UTG 被 HJ 3-Bet 要棄牌？因為 HJ 的 3-Bet 充滿 AA/KK/QQ/AK，AQo 被嚴重壓制且翻後 OOP 極難打。',
        'A5s、A4s 是最佳 4-Bet 詐唬牌：手上有 A 能讓對手拿到 AA 的組合從 6 組減半為 3 組、AK 從 16 組減為 12 組！'
      ]
    },
    {
      id: 'vs3bet_utg_co',
      cat: 'vs3bet',
      hero: 'UTG',
      villain: 'CO',
      title: 'UTG 開池被 CO 3-Bet (7.5bb)',
      shortTitle: 'UTG vs CO 3B',
      openSize: '2.5bb → 面臨 7.5bb (4B 21bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 17% / 跟注 28% / 棄牌 55%',
      baseScenario: 'rfi_utg',
      hi: 'KK+, AKs, AKo',
      hiMix: 'QQ, AQs, A5s, A4s, KQs',
      call: 'QQ, JJ, TT, 99, 88, AQs, AJs, ATs, KQs, KJs, QJs, JTs',
      callMix: '77, T9s, 98s, AQo',
      summary: 'CO 的 3-Bet 略寬於 HJ，UTG 仍處於 OOP，以 KK+/AK 為 4-Bet 價值核心（搭配 A5s/A4s 詐唬），88–QQ 與 AJs+/KJs+/QJs/JTs 跟注防守。',
      tips: [
        'OOP 面對 3-Bet 時，同花高牌（AQs、AJs、KQs、QJs、JTs）的跟注表現遠優於非同花大牌（AQo、KQo），因為同花能提供額外權益與翻後半詐唬能力。'
      ]
    },
    {
      id: 'vs3bet_utg_btn',
      cat: 'vs3bet',
      hero: 'UTG',
      villain: 'BTN',
      title: 'UTG 開池被 BTN 3-Bet (7.5bb)',
      shortTitle: 'UTG vs BTN 3B',
      openSize: '2.5bb → 面臨 7.5bb (4B 21bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 22% / 跟注 32% / 棄牌 46%',
      baseScenario: 'rfi_utg',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, AQs, A5s, A4s, A3s, KQs, KJs',
      call: 'JJ, TT, 99, 88, 77, AQs, AJs, ATs, KQs, KJs, QJs, JTs, T9s',
      callMix: '66, A9s, KTs, QTs, 98s, 87s, AQo',
      summary: 'BTN 位置最好，但面對 UTG 開池其 3-Bet 仍保持一定強度。UTG 將 QQ 納入高頻 4-Bet，並用 77–JJ、ATs+、同花百老匯與 JTs/T9s 防守約一半的開池範圍。',
      tips: [
        '因為 UTG 原本開池只有 17%（全是很強的牌），面對 3-Bet 繼續約 50% 的開池牌，就已經符合翻前最小防守要求。',
        '小對子 22–55 在 OOP 面對 3x 3-Bet 時隱含賠率不足（跟注後底池 16.5bb、後手 92.5bb，SPR 約 5.6），應直接棄牌。'
      ]
    },
    {
      id: 'vs3bet_utg_sb',
      cat: 'vs3bet',
      hero: 'UTG',
      villain: 'SB',
      title: 'UTG 開池被 SB 3-Bet (10bb)',
      shortTitle: 'UTG vs SB 3B',
      openSize: '2.5bb → 面臨 10bb (4B 22bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 14% / 跟注 42% / 棄牌 44%',
      baseScenario: 'rfi_utg',
      hi: 'KK+, AKs',
      hiMix: 'QQ, AKo, A5s, A4s, AQs',
      call: 'QQ, JJ, TT, 99, 88, 77, AQs, AJs, ATs, KQs, KJs, QJs, JTs, T9s, 98s, AKo',
      callMix: '66, 55, A9s, A5s, KTs, QTs, 87s, 76s, AQo',
      summary: '關鍵差異：面對盲位（SB/BB）的 3-Bet 時，UTG 在翻後「有位置（IP）」！因此不需要急著用很多牌 4-Bet，反而能多平跟（包括部分 QQ、AKo 與同花連張），利用位置在翻後發揮優勢！',
      tips: [
        '開池者有位置（IP）vs 沒位置（OOP）的黃金法則：IP 時「少 4-Bet、多平跟」；OOP 時「多 4-Bet 或棄牌、少平跟」。',
        '即使 SB 3-Bet 到 10bb（4 倍），因為你有位置，77–QQ、ATs+、KJs+、QJs、JTs、T9s、98s 都能舒服平跟。'
      ]
    },
    {
      id: 'vs3bet_utg_bb',
      cat: 'vs3bet',
      hero: 'UTG',
      villain: 'BB',
      title: 'UTG 開池被 BB 3-Bet (11bb)',
      shortTitle: 'UTG vs BB 3B',
      openSize: '2.5bb → 面臨 11bb (4B 23bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 13% / 跟注 41% / 棄牌 46%',
      baseScenario: 'rfi_utg',
      hi: 'KK+, AKs',
      hiMix: 'QQ, AKo, A5s, A4s',
      call: 'QQ, JJ, TT, 99, 88, 77, AQs, AJs, ATs, KQs, KJs, QJs, JTs, T9s, 98s, AKo',
      callMix: '66, A9s, A5s, KTs, QTs, 87s, AQo',
      summary: 'BB 對 UTG 的 3-Bet 是極化範圍（KK+/AK + 少量同花詐唬牌）。UTG 翻後有位置（IP），以 KK+/AKs 為 4-Bet 核心，QQ/JJ/TT/AKo 與同花強牌大量平跟，讓 BB 的詐唬牌在翻後 OOP 難以操作。',
      tips: [
        '對上極化的 BB 3-Bet，拿 QQ 或 AKo 平跟能把 BB 的詐唬牌留在底池裡，讓他在翻後沒位置繼續犯錯。'
      ]
    },
    {
      id: 'vs3bet_hj_co',
      cat: 'vs3bet',
      hero: 'HJ',
      villain: 'CO',
      title: 'HJ 開池被 CO 3-Bet (7.5bb)',
      shortTitle: 'HJ vs CO 3B',
      openSize: '2.5bb → 面臨 7.5bb (4B 21bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 17% / 跟注 22% / 棄牌 61%',
      baseScenario: 'rfi_hj',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, AQs, A5s, A4s, A3s, KQs, KJs',
      call: 'JJ, TT, 99, 88, 77, AQs, AJs, ATs, KQs, KJs, QJs, JTs',
      callMix: '66, KTs, QTs, T9s, 98s, AQo',
      summary: 'HJ 面對 CO 的位置內 3-Bet（HJ 翻後 OOP）。以 QQ+/AK 為價值 4-Bet，A5s–A3s 與部分 KQs/KJs 為詐唬 4-Bet；中對子 77–JJ 與同花百老匯跟注。',
      tips: [
        '原本在 HJ 開池的 KJo、QJo、ATo、小對子 22–55 與低同花 K（K8s）面對 3-Bet 全部標準棄牌。'
      ]
    },
    {
      id: 'vs3bet_hj_btn',
      cat: 'vs3bet',
      hero: 'HJ',
      villain: 'BTN',
      title: 'HJ 開池被 BTN 3-Bet (7.5bb)',
      shortTitle: 'HJ vs BTN 3B',
      openSize: '2.5bb → 面臨 7.5bb (4B 21bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 20% / 跟注 26% / 棄牌 54%',
      baseScenario: 'rfi_hj',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, TT, AQs, AJs, A5s, A4s, A3s, KQs, KJs, AQo',
      call: 'JJ, TT, 99, 88, 77, 66, AQs, AJs, ATs, KQs, KJs, KTs, QJs, QTs, JTs, T9s',
      callMix: '55, A9s, 98s, 87s, AQo',
      summary: 'BTN 對 HJ 的 3-Bet 約 7%，HJ 翻後 OOP，需用 QQ+/AK（混合 JJ/AQs/AQo）與 A5s–A3s 積極 4-Bet 反擊，並以 66–JJ 與同花強牌跟注。',
      tips: [
        '因為你沒位置，不要用非同花 AJo、KQo 跟注 3-Bet；AQo 則是部分 4-Bet、部分跟注或棄牌。'
      ]
    },
    {
      id: 'vs3bet_hj_sb',
      cat: 'vs3bet',
      hero: 'HJ',
      villain: 'SB',
      title: 'HJ 開池被 SB 3-Bet (10bb)',
      shortTitle: 'HJ vs SB 3B',
      openSize: '2.5bb → 面臨 10bb (4B 22bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 13% / 跟注 37% / 棄牌 50%',
      baseScenario: 'rfi_hj',
      hi: 'QQ+, AKs, AKo:50',
      hiMix: 'JJ, AQs, A5s, A4s, KQs, AKo',
      call: 'JJ, TT, 99, 88, 77, 66, AQs, AJs, ATs, A9s, KQs, KJs, KTs, QJs, QTs, JTs, T9s, 98s, AKo, AQo',
      callMix: '55, A5s, A4s, 87s, 76s, 65s',
      summary: 'HJ 對上 SB 3-Bet 享有翻後位置優勢（IP）！因此平跟範圍明顯比面對 CO/BTN 時更寬，66–JJ、A9s+、同花百老匯、同花連張與 AQo 都能 IP 跟注。',
      tips: [
        '有位置（IP）讓同花連張（T9s、98s、87s）在 3-Bet 底池變得非常好打，能在許多牌面施壓對手。'
      ]
    },
    {
      id: 'vs3bet_hj_bb',
      cat: 'vs3bet',
      hero: 'HJ',
      villain: 'BB',
      title: 'HJ 開池被 BB 3-Bet (11bb)',
      shortTitle: 'HJ vs BB 3B',
      openSize: '2.5bb → 面臨 11bb (4B 23bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 13% / 跟注 37% / 棄牌 50%',
      baseScenario: 'rfi_hj',
      hi: 'QQ+, AKs',
      hiMix: 'JJ, AKo, A5s, A4s, A3s',
      call: 'JJ, TT, 99, 88, 77, 66, AQs, AJs, ATs, A9s, KQs, KJs, KTs, QJs, QTs, JTs, T9s, 98s, AKo, AQo',
      callMix: '55, A5s, A4s, 87s, 76s',
      summary: '面對 BB 極化 11bb 3-Bet，HJ 具位置優勢（IP），以 QQ+/AKs 與少量 A5s–A3s 4-Bet，其餘強牌（含 AKo、AQo、AQs、66–JJ、同花百老匯）穩定平跟。',
      tips: [
        '當對手 3-Bet 尺度較大（11bb）但你有位置時，不需要過度擴張 4-Bet 詐唬，多用高可玩性的同花牌跟注即可。'
      ]
    },
    {
      id: 'vs3bet_co_btn',
      cat: 'vs3bet',
      hero: 'CO',
      villain: 'BTN',
      title: 'CO 開池被 BTN 3-Bet (7.5bb)',
      shortTitle: 'CO vs BTN 3B',
      openSize: '2.5bb → 面臨 7.5bb (4B 21bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 20% / 跟注 24% / 棄牌 56%',
      baseScenario: 'rfi_co',
      hi: 'JJ+, AQs+, AKo, AQo:50',
      hiMix: 'TT, AJs, ATs, A5s, A4s, A3s, A2s, KQs, KJs, KTs, QJs, AQo, KQo',
      call: 'TT, 99, 88, 77, 66, AJs, ATs, A9s, KQs, KJs, KTs, QJs, QTs, JTs, T9s, 98s, AQo',
      callMix: '55, A8s, K9s, Q9s, J9s, 87s, 76s, 65s, AJo, KQo',
      summary: '經典的後位激戰！BTN 對 CO 的 3-Bet 約 10%，而且 CO 翻後沒位置（OOP）。因此 CO 必須提高 4-Bet 頻率：JJ+、AQs+、AKo 全力價值 4-Bet，搭配 A5s–A2s、KJs/KTs、AQo/KQo 阻擋牌反擊！',
      tips: [
        '對抗激進的 BTN 3-Bet，JJ 與 AQs 在 CO 已經是純價值 4-Bet！',
        'A5s–A2s 與 KTs/QJs/KQo 是優質的 4-Bet 詐唬候選，因為它們阻擋了 BTN 繼續 5-Bet 的強牌（AA/KK/QQ/AK）。',
        'CO 開池中最弱的那一半（K5s–K8s、Q7s–Q8s、A8o–ATo、KTo/QTo/JTo、22–44）面對 3-Bet 直接棄牌。'
      ]
    },
    {
      id: 'vs3bet_co_sb',
      cat: 'vs3bet',
      hero: 'CO',
      villain: 'SB',
      title: 'CO 開池被 SB 3-Bet (10.5bb)',
      shortTitle: 'CO vs SB 3B',
      openSize: '2.5bb → 面臨 10.5bb (4B 23bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 13% / 跟注 34% / 棄牌 53%',
      baseScenario: 'rfi_co',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, AQs, A5s, A4s, A3s, KQs, AQo',
      call: 'JJ, TT, 99, 88, 77, 66, 55, AQs, AJs, ATs, A9s, A8s, KQs, KJs, KTs, QJs, QTs, JTs, J9s, T9s, 98s, 87s, 76s, AQo',
      callMix: '44, A7s, A6s, A5s, K9s, Q9s, T8s, 65s, 54s, AJo, KQo',
      summary: 'SB 對 CO 的 3-Bet 約 9.5%，且 CO 在翻後「有位置（IP）」！CO 可用 55–JJ、A8s+、KTs+、QTs+、J9s+、T9s–65s 同花連張與 AQo 廣泛跟注，在位置優勢下拆解 SB 的範圍。',
      tips: [
        '比較「CO vs BTN 3-Bet（OOP）」與「CO vs SB 3-Bet（IP）」：同樣在 CO 開池，對 BTN 要多 4-Bet（JJ/AQs 4-Bet），對 SB 則多跟注（JJ/AQs 高頻平跟）！'
      ]
    },
    {
      id: 'vs3bet_co_bb',
      cat: 'vs3bet',
      hero: 'CO',
      villain: 'BB',
      title: 'CO 開池被 BB 3-Bet (11bb)',
      shortTitle: 'CO vs BB 3B',
      openSize: '2.5bb → 面臨 11bb (4B 23bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 12% / 跟注 35% / 棄牌 53%',
      baseScenario: 'rfi_co',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, AQs, A5s, A4s, A3s, KQs',
      call: 'JJ, TT, 99, 88, 77, 66, 55, AQs, AJs, ATs, A9s, A8s, KQs, KJs, KTs, QJs, QTs, JTs, J9s, T9s, 98s, 87s, 76s, AQo',
      callMix: '44, A5s, A4s, K9s, Q9s, 65s, 54s, AJo, KQo',
      summary: 'CO 面對 BB 的極化 3-Bet 同樣享有翻後位置（IP），策略與面對 SB 類似：以 QQ+/AK 為 4-Bet 主力，55–JJ、同花 A、同花百老匯與同花連張在有位置下穩定跟注。',
      tips: [
        'BB 的 3-Bet 包含不少低同花連張與 A5s–A2s 詐唬牌，因此像 AQo、AJs、KQs 這類牌在 IP 跟注能完全壓制對手的詐唬部分。'
      ]
    },
    {
      id: 'vs3bet_btn_sb',
      cat: 'vs3bet',
      hero: 'BTN',
      villain: 'SB',
      title: 'BTN 開池被 SB 3-Bet (10.5bb)',
      shortTitle: 'BTN vs SB 3B',
      openSize: '2.5bb → 面臨 10.5bb (4B 23bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 14% / 跟注 37% / 棄牌 49%',
      baseScenario: 'rfi_btn',
      hi: 'JJ+, AQs+, AKo, AQo',
      hiMix: 'TT, AJs, A5s, A4s, A3s, A2s, KQs, KJs, AJo, KQo',
      call: 'TT, 99, 88, 77, 66, 55, 44, AJs, ATs, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KQs, KJs, KTs, K9s, QJs, QTs, Q9s, JTs, J9s, T9s, T8s, 98s, 87s, 76s, 65s, 54s, AJo, ATo, KQo, KJo, QJo',
      callMix: '33, 22, K8s, K7s, Q8s, J8s, 97s, 86s, 75s, 64s, A9o, KTo, QTo, JTo',
      summary: '最常見的 3-Bet 底池！SB 對 BTN 的 3-Bet 高達約 14.5%，而 BTN 在翻後「永遠有位置（IP）」！BTN 不但用 JJ+/AQs+/AQo+ 4-Bet，更用約 37% 的開池牌（幾乎所有同花 A、同花百老匯、同花連張、44–TT、ATo+/KJo+）平跟！',
      tips: [
        '很多玩家在 BTN 被盲位 3-Bet 時棄牌太多（Fold to 3-Bet > 60%），這是最常見的翻前漏洞之一！',
        '因為你有位置且對手 SB 3-Bet 約 14.5%，像 K9s、Q9s、J9s、T8s、65s、54s、ATo、KJo 都是標準正 EV 跟注！',
        '4-Bet 尺度只需約 2.1–2.2 倍（22–23bb），因為你有位置優勢。'
      ]
    },
    {
      id: 'vs3bet_btn_bb',
      cat: 'vs3bet',
      hero: 'BTN',
      villain: 'BB',
      title: 'BTN 開池被 BB 3-Bet (11bb)',
      shortTitle: 'BTN vs BB 3B',
      openSize: '2.5bb → 面臨 11bb (4B 23bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 13% / 跟注 34% / 棄牌 53%',
      baseScenario: 'rfi_btn',
      hi: 'JJ+, AQs+, AKo, AQo:50',
      hiMix: 'TT, AJs, A5s, A4s, A3s, A2s, KQs, AQo, AJo, KQo',
      call: 'TT, 99, 88, 77, 66, 55, 44, AJs, ATs, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, KQs, KJs, KTs, K9s, QJs, QTs, Q9s, JTs, J9s, T9s, T8s, 98s, 87s, 76s, 65s, 54s, AQo, AJo, ATo, KQo, KJo',
      callMix: '33, 22, K8s, Q8s, J8s, 97s, 86s, 75s, QJo, JTo',
      summary: 'BB 對 BTN 的 3-Bet 約 12.5%，BTN 享有位置優勢（IP）。用 JJ+/AQs+/AKo 與 A5s–A2s/AJo/KQo 阻擋牌 4-Bet，並用寬廣的同花牌與對子跟注防守約一半的開池範圍。',
      tips: [
        '所有的同花 A（A2s–AJs）在 BTN 面對盲位 3-Bet 都絕對不能棄牌——不是平跟就是 4-Bet！'
      ]
    },
    {
      id: 'vs3bet_sb_bb',
      cat: 'vs3bet',
      hero: 'SB',
      villain: 'BB',
      title: 'SB 開池 (3bb) 被 BB 3-Bet (9bb)',
      shortTitle: 'SB vs BB 3B',
      openSize: '3.0bb → 面臨 9bb (4B 22bb)',
      primaryAction: '4bet',
      secondaryAction: 'call',
      targetPct: '開池中：4B 17% / 跟注 28% / 棄牌 55%',
      baseScenario: 'rfi_sb',
      hi: 'TT+, AQs+, AKo, AQo',
      hiMix: '99, 88, AJs, ATs, A5s, A4s, A3s, A2s, KQs, KJs, KTs, QJs, AJo, KQo',
      call: '99, 88, 77, 66, 55, 44, AJs, ATs, A9s, A8s, A7s, A6s, A5s, KQs, KJs, KTs, K9s, QJs, QTs, Q9s, JTs, J9s, T9s, T8s, 98s, 87s, 76s, 65s, 54s, AJo, KQo',
      callMix: '33, 22, A4s, A3s, A2s, K8s, Q8s, J8s, 97s, 86s, ATo, KJo, QJo',
      summary: '盲注單挑 3-Bet 底池！BB 因為有位置會對 SB 3-Bet 約 14%（尺度 9bb）。SB 雖然翻後沒位置（OOP），但因底池賠率好且對手範圍寬，需用 TT+/AQs+/AQo+ 搭配阻擋牌積極 4-Bet 到 22bb，並用中對子與同花牌防守。',
      tips: [
        '因為 SB 沒位置，4-Bet 頻率（約 17%）比 BTN 面對盲位時更高，用 TT、99、AQs、AQo 直接 4-Bet 能有效抵銷 BB 的位置優勢。',
        '非同花弱牌（A2o–A9o、K8o–KTo、Q9o）是開池後面對 3-Bet 的標準棄牌。'
      ]
    },

    // =========================================================================
    // 4. 3-Bet 後面對 4-Bet（vs 4-Bet — 5-Bet All-in / Call / Fold）
    // =========================================================================
    {
      id: 'vs4bet_hj_utg',
      cat: 'vs4bet',
      hero: 'HJ',
      villain: 'UTG',
      title: 'HJ 3-Bet 後被 UTG 4-Bet (21bb)',
      shortTitle: 'HJ vs UTG 4B',
      openSize: '7.5bb → 面臨 21bb (5B 全下 100bb)',
      primaryAction: '5bet',
      secondaryAction: 'call',
      targetPct: '3B 中：5B 全下 43% / 跟注 29% / 棄牌 28%',
      baseScenario: 'vsrfi_hj_utg',
      hi: 'KK+, AKs',
      hiMix: 'QQ, AKo, A5s',
      call: 'QQ, AQs',
      callMix: 'JJ, AJs, KQs, A5s, AKo',
      summary: 'UTG 的 4-Bet 範圍極度強悍（以 KK+/AK 為主）。HJ 在有位置（IP）下，以 KK+/AKs 全下，QQ/AQs/部分 AKo 可選擇平跟 4-Bet 控制風險並保留對手的 A5s/A4s 詐唬牌。',
      tips: [
        '4-Bet 底池的 SPR 僅約 1.8（底池 21 + 21 + 1.5 = 43.5bb，後手 79bb），翻後只要擊中頂對或超對幾乎都已經承諾籌碼（Committed）。',
        '有位置面對超強的 UTG 4-Bet 時，AA/KK 也可以混合部分平跟（Trap 慢打）保護你的平跟範圍。'
      ]
    },
    {
      id: 'vs4bet_btn_co',
      cat: 'vs4bet',
      hero: 'BTN',
      villain: 'CO',
      title: 'BTN 3-Bet 後被 CO 4-Bet (21bb)',
      shortTitle: 'BTN vs CO 4B',
      openSize: '7.5bb → 面臨 21bb (5B 全下 100bb)',
      primaryAction: '5bet',
      secondaryAction: 'call',
      targetPct: '3B 中：5B 全下 30% / 跟注 22% / 棄牌 48%',
      baseScenario: 'vsrfi_btn_co',
      hi: 'QQ+, AKs, AKo',
      hiMix: 'JJ, A5s, A4s, AQs',
      call: 'JJ, TT, AQs, AJs, KQs',
      callMix: '99, ATs, KJs, QJs, JTs, A5s, A4s',
      summary: 'CO 面對 BTN 3-Bet 時約有 20% 的開池牌會 4-Bet（含 JJ+、AQs+ 與 A5s–A2s/KQo 詐唬）。BTN 有位置（IP），QQ+/AK 全下，JJ/TT/AQs/AJs/KQs 可平跟 4-Bet，A5s/A4s 則混合全下詐唬或平跟！',
      tips: [
        '在 CO vs BTN 的寬範圍對決中，QQ 與 AK 是毫無疑問的 100bb 全下價值牌！',
        'A5s 作 5-Bet 全下詐唬的數學原理：阻擋 AA/AK，且就算被 KK/QQ 跟注也還有約 30% 勝率（抽一張 A 或成同花/順子）。'
      ]
    },
    {
      id: 'vs4bet_sb_btn',
      cat: 'vs4bet',
      hero: 'SB',
      villain: 'BTN',
      title: 'SB 3-Bet 後被 BTN 4-Bet (23bb)',
      shortTitle: 'SB vs BTN 4B',
      openSize: '10.5bb → 面臨 23bb (5B 全下 100bb)',
      primaryAction: '5bet',
      secondaryAction: 'call',
      targetPct: '3B 中：5B 全下 31% / 跟注 8% / 棄牌 61%',
      baseScenario: 'vsrfi_sb_btn',
      hi: 'JJ+, AKs, AQs, AKo',
      hiMix: 'TT, AJs, A5s, A4s, KQs, AQo',
      call: 'TT, AJs, KQs',
      callMix: '99, ATs, KJs, QJs',
      summary: 'SB 翻後沒位置（OOP），面對 BTN 的 23bb 4-Bet 不適合大量平跟，因此以「5-Bet 全下或棄牌」為主：JJ+、AQs+、AKo 直接全下，搭配 A5s/A4s 阻擋牌全下施壓！',
      tips: [
        '因為 SB 沒位置，跟注 4-Bet 後底池達 47bb（23 + 23 + BB 的 1bb）、SPR 只剩約 1.6（77 ÷ 47），拿 JJ、QQ、AK、AQs 直接 5-Bet 全下 100bb，能立刻實現 100% 權益，不給 BTN 在翻後用位置操作你的機會！'
      ]
    },
    {
      id: 'vs4bet_bb_btn',
      cat: 'vs4bet',
      hero: 'BB',
      villain: 'BTN',
      title: 'BB 3-Bet 後被 BTN 4-Bet (23bb)',
      shortTitle: 'BB vs BTN 4B',
      openSize: '11bb → 面臨 23bb (5B 全下 100bb)',
      primaryAction: '5bet',
      secondaryAction: 'call',
      targetPct: '3B 中：5B 全下 33% / 跟注 11% / 棄牌 56%',
      baseScenario: 'vsrfi_bb_btn',
      hi: 'JJ+, AKs, AQs, AKo',
      hiMix: 'TT, A5s, A4s, A3s, AJs, KQs',
      call: 'TT, AJs, KQs, QJs',
      callMix: '99, ATs, JTs, T9s, A5s',
      summary: '與 SB vs BTN 相同，BB 在 OOP 面對 BTN 4-Bet 以 5-Bet 全下（JJ+/AQs+/AKo + A5s–A3s）為主，僅保留少量高可玩性的同花強牌與 TT 平跟。',
      tips: [
        '你在 BB 原本用來極化 3-Bet 詐唬的非同花牌（ATo、KJo、QJo）與低同花連張在面對 4-Bet 時已完成任務，直接棄牌即可。'
      ]
    },
    {
      id: 'vs4bet_bb_sb',
      cat: 'vs4bet',
      hero: 'BB',
      villain: 'SB',
      title: 'BB 3-Bet (9bb) 後被 SB 4-Bet (22bb)',
      shortTitle: 'BB vs SB 4B',
      openSize: '9bb → 面臨 22bb (5B 全下 100bb)',
      primaryAction: '5bet',
      secondaryAction: 'call',
      targetPct: '3B 中：5B 全下 26% / 跟注 26% / 棄牌 48%',
      baseScenario: 'vsrfi_bb_sb',
      hi: 'JJ+, AKs, AKo',
      hiMix: 'TT, AQs, A5s, A4s, A3s',
      call: 'TT, 99, 88, AQs, AJs, ATs, KQs, KJs, QJs, JTs',
      callMix: '77, T9s, 98s, A5s, A4s, AQo',
      summary: '盲注大戰的 4-Bet 底池！因為 BB 對 SB 有位置（IP），BB 不必全用全下解決，除了 JJ+/AK 5-Bet 全下外，88–TT、ATs–AQs、KJs+、QJs、JTs 都能利用位置優勢平跟 22bb！',
      tips: [
        '對比 BB vs BTN 4-Bet（OOP）與 BB vs SB 4-Bet（IP）：有位置時，平跟 4-Bet 的比例幾乎翻倍！'
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // 展開每個 Scenario 的 169 手牌資料
  // cells[hand] = {
  //   primary: 0 | 0.5 | 1,   // 主要進攻動作頻率 (raise / 3bet / 4bet / 5bet)
  //   call:    0 | 0.5 | 1,   // 跟注頻率
  //   fold:    0 | 0.5 | 1,   // 棄牌頻率
  //   simple:  'raise'|'3bet'|'4bet'|'5bet'|'call'|'fold', // 簡易範圍（純策略）動作
  //   inBase:  bool           // 在 vs3bet/vs4bet 中，該手牌是否屬於 Hero 原本的開池/3B 範圍
  // }
  // ---------------------------------------------------------------------------
  const SCENARIOS = {};
  const SCENARIO_LIST = [];

  function expandScenario(sc) {
    const hiMap = GTO.parseRange(sc.hi || '');
    const hiMixMap = GTO.parseRange(sc.hiMix || '');
    const callMap = GTO.parseRange(sc.call || '');
    const callMixMap = GTO.parseRange(sc.callMix || '');
    const cells = {};

    for (const h of GTO.HANDS) {
      let p = 0, c = 0;
      const inHi = hiMap[h] || 0;
      const inHiMix = hiMixMap[h] || 0;
      const inCall = callMap[h] || 0;
      const inCallMix = callMixMap[h] || 0;

      if (inHi >= 1 && inCall >= 1) {
        p = 0.5; c = 0.5;
      } else if (inHi >= 1) {
        p = inHi;
        if (p < 1 && inCall > 0) c = 1 - p;
      } else if (inHiMix > 0 && inCall >= 1) {
        p = 0.5; c = 0.5;
      } else if (inHiMix > 0 && inCallMix > 0) {
        p = 0.5; c = 0.5;
      } else if (inHiMix > 0) {
        p = 0.5;
      } else if (inCall >= 1) {
        c = 1;
      } else if (inCallMix > 0) {
        c = 0.5;
      }

      const f = Math.max(0, +(1 - p - c).toFixed(2));
      // 簡易模式（純策略）：
      // 若 p >= 0.5 且 p >= c → primaryAction
      // 否則若 c >= 0.5 → 'call'
      // 但為了讓簡易表清楚區分，若 p == 0.5 && c == 0（純混合進攻/棄牌），在簡易模式中：
      // 對子、同花 A、同花連張與高同花牌歸入進攻，最邊緣的非同花混合牌歸入棄牌或保留高辨識度。
      let simple = 'fold';
      if (p > 0.5) simple = sc.primaryAction;
      else if (c > 0.5) simple = 'call';
      else if (p === 0.5 && c === 0.5) simple = sc.primaryAction;
      else if (p === 0.5) simple = sc.primaryAction;
      else if (c === 0.5) simple = 'call';

      cells[h] = { primary: p, call: c, fold: f, simple, inBase: true };
    }

    sc.cells = cells;
    SCENARIOS[sc.id] = sc;
    SCENARIO_LIST.push(sc);
  }

  RAW_SCENARIOS.forEach(expandScenario);

  // 標記 vs3bet / vs4bet 中哪些手牌在原本的 baseScenario 範圍內，並確保不在原本範圍的手牌為 fold
  // 注意：只有 base 的「主要進攻動作」才會走到下一個節點——
  //   vs3bet 的 base 是 RFI（開池）；vs4bet 的 base 是 vsrfi，但只有「3-Bet」過的手牌才會面對 4-Bet，
  //   原本只跟注（Call）的手牌不可能出現在 4-Bet 底池中。
  // baseW[h] = 該手牌在 base 中的進攻頻率（0 / 0.5 / 1），用來加權計算真實組合數。
  for (const sc of SCENARIO_LIST) {
    sc.baseW = null;
    if (sc.baseScenario && SCENARIOS[sc.baseScenario]) {
      const base = SCENARIOS[sc.baseScenario];
      sc.baseW = {};
      for (const h of GTO.HANDS) {
        const bc = base.cells[h];
        const inBase = bc.primary > 0;
        sc.baseW[h] = bc.primary;
        sc.cells[h].inBase = inBase;
        if (!inBase) {
          sc.cells[h].primary = 0;
          sc.cells[h].call = 0;
          sc.cells[h].fold = 1;
          sc.cells[h].simple = 'fold';
        }
      }
    }
    // 統計組合數與百分比，並預先快取每格 CSS 類別與混合漸層背景（切換範圍時 O(169) 原地更新零重算）
    const pAct = sc.primaryAction;
    const pCol = 'var(--act-' + pAct + ')';
    let pCombos = 0, cCombos = 0, baseCombos = 0;
    for (const h of GTO.HANDS) {
      const info = GTO.HAND_INFO[h];
      const w = sc.baseW ? sc.baseW[h] : 1;
      const cb = info.combos * w;
      const cell = sc.cells[h];
      if (cell.inBase) baseCombos += cb;
      pCombos += cb * cell.primary;
      cCombos += cb * cell.call;

      const baseCls = 'rcell type-' + info.type + (cell.inBase ? '' : ' not-in-base');
      cell._sCls = baseCls + ' act-' + cell.simple;
      const p = cell.primary * 100, c = cell.call * 100;
      if (p === 100) {
        cell._gCls = baseCls + ' act-' + pAct;
        cell._gBg = '';
      } else if (c === 100) {
        cell._gCls = baseCls + ' act-call';
        cell._gBg = '';
      } else if (p === 0 && c === 0) {
        cell._gCls = baseCls + ' act-fold';
        cell._gBg = '';
      } else {
        cell._gCls = baseCls + ' act-mix';
        cell._gBg = 'linear-gradient(90deg,' +
          pCol + ' 0%,' + pCol + ' ' + p + '%,' +
          'var(--act-call) ' + p + '%,var(--act-call) ' + (p + c) + '%,' +
          'var(--act-fold-bg) ' + (p + c) + '%,var(--act-fold-bg) 100%)';
      }
      cell._mixDot = cell.primary === 0.5 || cell.call === 0.5;
    }
    sc.stats = {
      primaryCombos: pCombos,
      callCombos: cCombos,
      continueCombos: pCombos + cCombos,
      baseCombos: baseCombos || GTO.TOTAL_COMBOS,
      primaryPctAll: pCombos / GTO.TOTAL_COMBOS,
      callPctAll: cCombos / GTO.TOTAL_COMBOS,
      continuePctAll: (pCombos + cCombos) / GTO.TOTAL_COMBOS,
      primaryPctBase: pCombos / (baseCombos || GTO.TOTAL_COMBOS),
      callPctBase: cCombos / (baseCombos || GTO.TOTAL_COMBOS),
      foldPctBase: Math.max(0, 1 - (pCombos + cCombos) / (baseCombos || GTO.TOTAL_COMBOS)),
    };
  }

  // ---------------------------------------------------------------------------
  // 查詢與解說產生器
  // ---------------------------------------------------------------------------
  function getScenario(id) { return SCENARIOS[id] || SCENARIO_LIST[0]; }

  /** 取得某手牌在指定 scenario 下的正確行動清單（供測驗判分與解說使用） */
  function evaluateHandDecision(sc, hand, chosenAction, simpleMode) {
    const cell = sc.cells[hand];
    if (!cell) return { ok: false, bestAction: 'fold', acceptable: ['fold'], cell: null };
    if (simpleMode) {
      const best = cell.simple;
      return { ok: chosenAction === best, bestAction: best, acceptable: [best], cell, isMixed: (cell.primary === 0.5 || cell.call === 0.5) };
    }
    const acceptable = [];
    if (cell.primary > 0) acceptable.push(sc.primaryAction);
    if (cell.call > 0) acceptable.push('call');
    if (cell.fold > 0 && cell.primary < 1 && cell.call < 1 && (cell.primary === 0 && cell.call === 0 || cell.fold >= 0.5)) {
      acceptable.push('fold');
    }
    let best = 'fold';
    if (cell.primary >= cell.call && cell.primary >= cell.fold && cell.primary > 0) best = sc.primaryAction;
    else if (cell.call >= cell.primary && cell.call >= cell.fold && cell.call > 0) best = 'call';
    return {
      ok: acceptable.includes(chosenAction),
      bestAction: best,
      acceptable,
      cell,
      isMixed: acceptable.length > 1,
    };
  }

  /** 為任意 (scenario, hand) 動態產生清楚的繁體中文 GTO 策略原因解說 */
  function explainHand(sc, hand) {
    const cell = sc.cells[hand];
    const info = GTO.HAND_INFO[hand];
    if (!cell || !info) return '';
    const pActLabel = GTO.ACTIONS[sc.primaryAction].label;
    const parts = [];

    // 1. 頻率結論
    if (!cell.inBase) {
      parts.push('【前提提醒】<strong>' + hand + '</strong> 在 ' + sc.hero + ' 原本的開池範圍中屬於棄牌，因此實戰中不會帶著這手牌進入此節點。');
    } else if (cell.primary === 1) {
      parts.push('在「' + sc.title + '」中，<strong>' + hand + '</strong> 是 <strong>100% 純' + pActLabel + '</strong>（共 ' + info.combos + ' 組組合）。');
    } else if (cell.call === 1) {
      parts.push('在「' + sc.title + '」中，<strong>' + hand + '</strong> 是 <strong>100% 純跟注（Call）</strong>（共 ' + info.combos + ' 組組合）。');
    } else if (cell.fold === 1) {
      parts.push('在「' + sc.title + '」中，<strong>' + hand + '</strong> 是 <strong>100% 棄牌（Fold）</strong>。');
    } else if (cell.primary === 0.5 && cell.call === 0.5) {
      parts.push('在「' + sc.title + '」中，<strong>' + hand + '</strong> 為 <strong>混合策略：50% ' + pActLabel + ' / 50% 跟注</strong>（簡易範圍歸為「' + GTO.ACTIONS[cell.simple].label + '」）。');
    } else if (cell.primary === 0.5) {
      parts.push('在「' + sc.title + '」中，<strong>' + hand + '</strong> 為 <strong>邊緣混合牌：50% ' + pActLabel + ' / 50% 棄牌</strong>（簡易範圍歸為「' + GTO.ACTIONS[cell.simple].label + '」）。');
    } else if (cell.call === 0.5) {
      parts.push('在「' + sc.title + '」中，<strong>' + hand + '</strong> 為 <strong>邊緣混合跟注：50% 跟注 / 50% 棄牌</strong>。');
    }

    // 2. 手牌性質與位置邏輯
    const r1 = GTO.rankIdx(hand[0]), r2 = GTO.rankIdx(hand[1]);
    if (info.type === 'pair') {
      if (r1 <= 2) parts.push('頂級口袋大對子（QQ+）具備極高原始權益與堅果優勢，主動進攻打造大底池能最大化期望值（EV）。');
      else if (r1 <= 6) parts.push('中對子（TT–66）兼具攤牌價值與翻牌約 11.8% 擊中暗三條（Set）的爆發力。');
      else parts.push('小對子（55–22）主要依賴翻後擊中暗三條（Set Mining）贏取大底池，因此需要足夠的隱含賠率（Implied Odds）或後位棄牌率。');
    } else if (info.type === 'suited') {
      if (hand[0] === 'A') {
        if (r2 <= 4) parts.push('同花大 A（ATs–AKs）兼具頂對強踢腳與堅果同花潛力（Nut Flush Draw），是翻前與翻後的核心強牌。');
        else if (r2 >= 9) parts.push('同花小 A（A5s–A2s）擁有 A 阻擋牌（減少對手 AA/AK 組合），且能成堅果同花與 A-2-3-4-5 輪子順，是 GTO 最經典的半詐唬 / 3-Bet / 4-Bet 武器。');
        else parts.push('中段同花 A（A9s–A6s）具備堅果同花潛力與 A 阻擋效應，權益實現率明顯優於非同花 A。');
      } else if (r2 - r1 === 1) {
        parts.push('同花連張（Suited Connectors）可玩性極高，能同時擊中順子、同花與強聽牌，幫你的範圍覆蓋中低潮濕牌面（Board Coverage）。');
      } else if (r1 <= 4 && r2 <= 4) {
        parts.push('同花百老匯（Suited Broadways）能做成大頂對、大順子與大同花，很少被對手壓制。');
      } else {
        parts.push('同花屬性比非同花多約 2.5–3% 原始勝率，且翻牌擊中同花聽牌（約 10.9%）能提供強力的翻後半詐唬權益。');
      }
    } else {
      // offsuit
      if (r1 <= 3 && r2 <= 3) {
        parts.push('非同花百老匯具備高牌阻擋效應，但因缺乏同花潛力，翻後可玩性低於同花版本；若踢腳落後（如面對前位強範圍時的 AJo/KQo）容易被壓制（Dominated）。');
      } else {
        parts.push('非同花牌有 12 組組合，若過度納入範圍會讓你的頻率瞬間過寬，且翻後沒位置時權益實現率（EQR）極差。');
      }
    }

    return parts.join(' ');
  }

  // ---------------------------------------------------------------------------
  // 13×13 範圍表 HTML 渲染器
  // ---------------------------------------------------------------------------
  /**
   * 渲染一張 13×13 範圍表到 container。
   * opts:
   *   simple: bool（true = 簡易純策略色塊；false = GTO 混合比例填充）
   *   selectedHand: 'AKs'（高亮顯示指定手牌）
   *   compact: bool（小尺寸內嵌圖）
   *   onSelect: function(hand, cell)
   */
  function renderGrid(container, sc, opts) {
    opts = opts || {};
    if (typeof sc === 'string') sc = getScenario(sc);
    if (!sc || !container) return;
    const simple = !!opts.simple;
    const hiHand = opts.selectedHand || null;
    const compact = !!opts.compact;

    const state = container.__gtoGrid || (container.__gtoGrid = { sc, onSelect: null, selBtn: null });
    state.sc = sc;
    state.onSelect = opts.onSelect || null;
    state.selBtn = null;

    if (!container.__gtoBound && container.addEventListener) {
      container.__gtoBound = true;
      container.addEventListener('click', (e) => {
        const st = container.__gtoGrid;
        if (!st || !st.onSelect) return;
        const btn = e.target && e.target.closest ? e.target.closest('.rcell') : null;
        if (!btn || !container.contains(btn)) return;
        const h = btn.getAttribute('data-hand');
        if (!h || !st.sc.cells[h]) return;
        if (st.selBtn && st.selBtn !== btn) st.selBtn.classList.remove('selected');
        else container.querySelectorAll('.rcell.selected').forEach((el) => { if (el !== btn) el.classList.remove('selected'); });
        btn.classList.add('selected');
        st.selBtn = btn;
        st.onSelect(h, st.sc.cells[h], st.sc);
      });
    }

    const existingGrid = container.firstElementChild;
    const cachedCells = container.__gtoCells;
    if (cachedCells && cachedCells.length === 169 && container.__gtoCompact === compact &&
        existingGrid && existingGrid.classList && existingGrid.classList.contains('rgrid')) {
      existingGrid.setAttribute('aria-label', sc.title);
      for (let i = 0; i < 169; i++) {
        const h = GTO.HANDS[i];
        const cell = sc.cells[h];
        const btn = cachedCells[i];
        const wantCls = (simple ? cell._sCls : cell._gCls) + (hiHand === h ? ' selected' : '');
        if (btn.className !== wantCls) btn.className = wantCls;
        const wantBg = simple ? '' : cell._gBg;
        if (btn.__bg !== wantBg) {
          btn.__bg = wantBg;
          btn.style.background = wantBg;
        }
        const wantDot = !compact && !simple && cell._mixDot;
        if (!!btn.__dot !== wantDot) {
          btn.__dot = wantDot;
          if (wantDot) {
            const dot = document.createElement('span');
            dot.className = 'rmix-dot';
            dot.title = '混合頻率 50%';
            dot.textContent = '½';
            btn.appendChild(dot);
          } else if (btn.lastElementChild && btn.lastElementChild.classList.contains('rmix-dot')) {
            btn.lastElementChild.remove();
          }
        }
        if (hiHand === h) state.selBtn = btn;
      }
      return;
    }

    const html = ['<div class="rgrid ' + (compact ? 'compact' : '') + '" role="grid" aria-label="' + GTO.esc(sc.title) + '">'];
    for (let i = 0; i < 169; i++) {
      const h = GTO.HANDS[i];
      const cell = sc.cells[h];
      const cls = (simple ? cell._sCls : cell._gCls) + (hiHand === h ? ' selected' : '');
      const bg = simple ? '' : cell._gBg;
      const bgStyle = bg ? ' style="background:' + bg + '"' : '';
      const freqBadge = !compact && !simple && cell._mixDot
        ? '<span class="rmix-dot" title="混合頻率 50%">½</span>' : '';
      html.push(
        '<button type="button" class="' + cls + '" data-hand="' + h + '"' + bgStyle + '>' +
        '<span class="rh">' + h + '</span>' + freqBadge + '</button>'
      );
    }
    html.push('</div>');
    container.innerHTML = html.join('');
    container.__gtoCompact = compact;
    if (container.firstElementChild && container.firstElementChild.children) {
      const btns = Array.from(container.firstElementChild.children);
      container.__gtoCells = btns;
      for (let i = 0; i < btns.length; i++) {
        const h = GTO.HANDS[i];
        const cell = sc.cells[h];
        const btn = btns[i];
        btn.__bg = simple ? '' : cell._gBg;
        btn.__dot = !compact && !simple && cell._mixDot;
        if (hiHand === h) state.selBtn = btn;
      }
    }
  }

  /** 將課文內嵌的 <div class="embed-chart" data-scenario="rfi_utg"></div> 自動渲染為迷你範圍卡 */
  function hydrateEmbedCharts(root) {
    (root || document).querySelectorAll('.embed-chart:not([data-done])').forEach((el) => {
      el.setAttribute('data-done', '1');
      const id = el.getAttribute('data-scenario');
      const sc = SCENARIOS[id];
      if (!sc) return;
      const pLabel = GTO.ACTIONS[sc.primaryAction].label;
      el.innerHTML =
        '<div class="embed-card">' +
          '<div class="embed-head">' +
            '<div><strong>' + GTO.esc(sc.title) + '</strong> <span class="muted">（' + GTO.esc(sc.targetPct) + ' · ' + GTO.esc(sc.openSize) + '）</span></div>' +
            '<div class="embed-actions">' +
              '<a class="btn-xs" href="#/ranges/' + sc.id + '">🔍 在範圍表開啟</a>' +
              '<a class="btn-xs primary" href="#/quiz/preflop?scenario=' + sc.id + '">🎯 測驗此範圍</a>' +
            '</div>' +
          '</div>' +
          '<div class="embed-grid-Slot"></div>' +
          '<div class="embed-legend">' +
            '<span class="lg-item"><i class="sw act-' + sc.primaryAction + '"></i>' + pLabel + '</span>' +
            (sc.secondaryAction ? '<span class="lg-item"><i class="sw act-call"></i>跟注</span>' : '') +
            '<span class="lg-item"><i class="sw act-fold"></i>棄牌</span>' +
          '</div>' +
        '</div>';
      renderGrid(el.querySelector('.embed-grid-Slot'), sc, { compact: true, simple: false });
    });
  }

  Object.assign(GTO, {
    SCENARIOS,
    SCENARIO_LIST,
    getScenario,
    evaluateHandDecision,
    explainHand,
    renderGrid,
    hydrateEmbedCharts,
  });
})();

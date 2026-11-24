/**
 * GTO 撲克學院（獨立版）— 導流追蹤（GA4 / UTM）與金流設定檔
 *
 * 【上線前只要改這個檔案！】
 * 1. 去 https://analytics.google.com/ 建立 GA4 資源，把 Measurement ID（G-XXXXXXXXXX）貼到 ga4MeasurementId。
 * 2. 去 https://portaly.cc/（傳送門）建立免費創作者頁面與數位商品，把商品網址貼到下方 portalyUrl / products[].url。
 * 3. 申請 GTO Wizard / Hand2Note / PokerTracker 4 官方聯盟計畫後，把專屬推廣連結貼到 affiliates[].url。
 * 4. 改完後跑 `python3 tools/build_github_pages.py` 再推到你的獨立 GitHub Repo 即可生效！
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  GTO.MONETIZE_CONFIG = {
    // ── 1. Google Analytics 4 追蹤碼（留空或保留 G-XXXXXXXXXX 時不載入）──
    ga4MeasurementId: 'G-B8GN60K9V5',

    // ── 2. 你的 IG / YouTube 頻道連結 ──
    social: {
      igHandle: '@your_poker_lab',
      igUrl: 'https://www.instagram.com/',
      youtubeUrl: 'https://www.youtube.com/',
      portalyHomeUrl: 'https://portaly.cc/pokergtolab',
    },

    // ── 3. Portaly 數位商品與贊助（台灣支援信用卡 / LINE Pay / 超商）──
    //    備註：核心 54 堂課、40 組範圍表、6 人 AI 桌與 11 種練習皆維持免費開放吸粉
    products: [
      {
        id: 'pack_postflop_cards',
        badge: '熱銷數位手冊',
        tone: 'mint',
        title: '《翻後決策 30 招》暗黑圖解隨身卡 PDF',
        price: 'NT$ 390',
        desc: '把 IG 短影音最受歡迎的 30 支翻後觀念整理成手機高清圖解卡（JJ 高張面、AK 乾燥面 C-bet、Set 快慢打、阻擋張檢核表），上桌前 3 分鐘快速複習。',
        cta: '前往 Portaly 查看詳情 →',
        url: 'https://portaly.cc/pokergtolab',
      },
      {
        id: 'service_hand_review',
        badge: '深度覆盤',
        tone: 'coral',
        title: '實戰關鍵手牌 1 對 1 GTO 健檢報告',
        price: 'NT$ 690',
        desc: '投稿你最糾結的 3 手實戰牌局，搭配 GTO Solver 與低級別剝削視角產出專屬文字＋圖解覆盤報告，幫你直接抓出最燒錢的 EV 漏洞。',
        cta: '預約手牌健檢（Portaly）→',
        url: 'https://portaly.cc/pokergtolab',
      },
      {
        id: 'tip_coffee',
        badge: '免費工具贊助',
        tone: 'gold',
        title: '請站長喝杯咖啡・支持學院永久免費更新',
        price: '隨喜贊助',
        desc: '本網站 54 堂課、40 組範圍矩陣與 6 人 AI 練習桌皆免費開放、無彈窗廣告。如果這個工具曾幫你省下一個 Buy-in，歡迎小額贊助支持開發！',
        cta: '透過 Portaly 小額贊助 →',
        url: 'https://portaly.cc/pokergtolab/support',
      },
    ],

    // ── 4. 合法競技撲克訓練軟體聯盟推薦（純學習工具 SaaS，非博弈／真錢平台）──
    affiliates: [
      {
        id: 'aff_gtowizard',
        tag: '進階 Solver 首選',
        name: 'GTO Wizard',
        desc: '全球職業牌手最常用的雲端 GTO 資料庫與手牌自動分析工具。適合在本站練熟基礎後，進一步研究複雜翻後轉牌／河牌樹與自訂 AI 訓練。',
        benefit: '透過推薦連結註冊可享首月方案優惠',
        cta: '前往 GTO Wizard →',
        url: 'https://gtowizard.com/',
      },
      {
        id: 'aff_hand2note',
        tag: '牌局覆盤 / HUD',
        name: 'Hand2Note',
        desc: '高效能牌局紀錄資料庫與進階範圍分析工具，幫你長期統計自己的 VPIP / PFR / 3-Bet 與各位置真實盈虧曲線。',
        benefit: '支援免費入門版；首購輸入專屬優惠碼 GTOLAB 再享 9 折（10% OFF）',
        cta: '前往 Hand2Note（優惠碼 GTOLAB）→',
        url: 'https://hand2note.com?rid=90918',
      },
      {
        id: 'aff_pt4',
        tag: '經典數據追蹤',
        name: 'PokerTracker 4',
        desc: '老牌穩定的手牌紀錄管理與漏洞追蹤軟體（LeakTracker），一次性買斷制，適合系統化檢視數萬手樣本的長期表現。',
        benefit: '提供 14 天免費完整試用',
        cta: '了解 PokerTracker 4 →',
        url: 'https://www.pokertracker.com/',
      },
    ],
  };
})();

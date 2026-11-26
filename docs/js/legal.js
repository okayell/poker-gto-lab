/**
 * GTO 撲克學院（Poker GTO Lab）— 全站法務資訊、合規聲明、退款說明與頁尾模組 (#/legal)
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});

  const LEGAL_TABS = [
    { id: 'terms', icon: '📜', label: '使用條款與非博弈聲明' },
    { id: 'privacy', icon: '🔒', label: '隱私權政策' },
    { id: 'refund', icon: '🧾', label: '數位教材與退款說明' },
    { id: 'about', icon: '📬', label: '關於本站與聯絡客服' },
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getConfig() {
    const cfg = GTO.MONETIZE_CONFIG || {};
    const social = cfg.social || {};
    const business = cfg.business || {};
    return {
      social: {
        igHandle: (social.igHandle || '@pokergtolab').trim(),
        igUrl: (social.igUrl || 'https://www.instagram.com/pokergtolab/').trim(),
        youtubeUrl: (social.youtubeUrl || 'https://www.youtube.com/@pokergtolab').trim(),
        portalyHomeUrl: (social.portalyHomeUrl || 'https://portaly.cc/pokergtolab').trim(),
        contactEmail: (social.contactEmail || '').trim(),
      },
      business: {
        operatorLabel: (business.operatorLabel || 'GTO 撲克學院（Poker GTO Lab）獨立開發團隊').trim(),
        businessName: (business.businessName || '').trim(),
        taxId: (business.taxId || '').trim(),
        lastUpdated: (business.lastUpdated || '2026-11-25').trim(),
      },
    };
  }

  function renderFooter(activePage) {
    const el = document.getElementById('siteFooter');
    if (!el) return;
    const { social, business } = getConfig();
    const curHash = (typeof location !== 'undefined' && location.hash) || '';

    const navLinks = [
      { href: '#/legal/about', label: '關於與聯絡', match: '#/legal/about' },
      { href: '#/legal/terms', label: '使用條款', match: '#/legal/terms' },
      { href: '#/legal/privacy', label: '隱私權政策', match: '#/legal/privacy' },
      { href: '#/legal/refund', label: '數位教材與退款說明', match: '#/legal/refund' },
      { href: '#/feedback', label: '意見回饋', match: '#/feedback' },
    ];

    const navHtml = navLinks.map((it) => {
      const isAct = (activePage === 'feedback' && it.match === '#/feedback') ||
        (activePage === 'legal' && (curHash.startsWith(it.match) || (it.match === '#/legal/terms' && (curHash === '#/legal' || curHash === '#/legal/'))));
      return '<a class="sf-link' + (isAct ? ' active' : '') + '" href="' + it.href + '">' + it.label + '</a>';
    }).join('<span class="sf-sep" aria-hidden="true">·</span>');

    const socialPills = [
      social.contactEmail ? '<a class="sf-pill" href="mailto:' + esc(social.contactEmail) + '">✉️ ' + esc(social.contactEmail) + '</a>' : '',
      social.igUrl ? '<a class="sf-pill" href="' + esc(social.igUrl) + '" target="_blank" rel="noopener noreferrer">IG ' + esc(social.igHandle) + '</a>' : '',
      social.youtubeUrl ? '<a class="sf-pill" href="' + esc(social.youtubeUrl) + '" target="_blank" rel="noopener noreferrer">YouTube</a>' : '',
      social.portalyHomeUrl ? '<a class="sf-pill accent" href="' + esc(social.portalyHomeUrl) + '" target="_blank" rel="noopener noreferrer">Portaly 傳送門</a>' : '',
    ].filter(Boolean).join('');

    const taxParts = [];
    if (business.businessName) taxParts.push('營業人名稱：' + esc(business.businessName));
    if (business.taxId) taxParts.push('統一編號：' + esc(business.taxId));
    const taxLine = taxParts.length ? '<div class="sf-tax">' + taxParts.join('｜') + '</div>' : '';

    el.innerHTML =
      '<div class="sf-inner">' +
        '<div class="sf-top">' +
          '<div class="sf-brand-row">' +
            '<a class="sf-brand" href="#/home">♠ GTO 撲克學院 · Poker GTO Lab</a>' +
            '<span class="sf-tag">純競技賽局理論與機率訓練工具（非真錢博弈）</span>' +
          '</div>' +
          '<div class="sf-links-row">' +
            '<nav class="sf-nav" aria-label="法務與服務連結">' + navHtml + '</nav>' +
            (socialPills ? '<div class="sf-social">' + socialPills + '</div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="sf-bottom">' +
          '<p class="sf-compliance">本站所有牌局與練習皆以虛擬大盲（bb）計算，無任何金錢價值、不可儲值或兌現，亦不提供或仲介任何真錢賭博服務。請遵守所在地法律，未滿 18 歲請勿接觸博弈相關活動。</p>' +
          taxLine +
        '</div>' +
      '</div>';
  }

  function renderTermsTab() {
    return (
      '<div class="legal-grid">' +
        '<article class="legal-card">' +
          '<span class="legal-kicker">01 · 核心定位</span>' +
          '<h2>服務定位與非真錢博弈聲明</h2>' +
          '<p><strong>GTO 撲克學院（Poker GTO Lab）</strong>為專注於德州撲克賽局理論（GTO）、數學機率與策略思考之教育訓練網站，嚴格遵守中華民國（台灣）《刑法》第 266 條、第 268 條及相關法令規範：</p>' +
          '<ul>' +
            '<li><strong>零真錢與零兌現機制：</strong>本站所有模擬對局、覆盤與練習數據皆僅以虛擬「大盲注（bb）」單位計算，<strong>無任何實際金錢價值</strong>，亦不提供儲值、買賣點數、轉讓籌碼或兌換現金／等值財物之功能。</li>' +
            '<li><strong>絕不經營或導流賭博平台：</strong>本站不提供線上真錢對戰、不開設或仲介任何線上私局、實體賭場、娛樂城或幣商服務，亦不收取任何抽頭或對賭傭金。</li>' +
            '<li><strong>年齡提醒：</strong>未滿 18 歲之未成年人請勿接觸任何涉及真實金錢或博弈性質之活動，並請所有使用者務必遵守所在地之法律規定。</li>' +
          '</ul>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">02 · 教育性質</span>' +
          '<h2>教學內容免責聲明</h2>' +
          '<p>本站提供之 54 堂圖解課程、40 組 6-Max 簡化範圍矩陣、計算機及 AI 模擬覆盤分析，係整理自公開撲克數學理論與簡化近似 Solver 模型，僅供策略學習與學術邏輯研究參考。</p>' +
          '<p>撲克實戰受桌面動態、對手傾向與短期機率波動影響極大，本站不對任何實戰賽事結果、牌局勝負或財務報酬作任何明示或默示之保證，使用者應自行評估並承擔所有決策風險。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">03 · 公平競技</span>' +
          '<h2>禁止即時輔助聲明（Anti-RTA）</h2>' +
          '<p>本站之翻前範圍表、勝率計算機、MDF／EV 試算器與模擬工具，<strong>僅供牌局開始前之預習與牌局結束後之覆盤檢討使用</strong>。</p>' +
          '<p>嚴禁於任何線上或現場真實撲克對局進行中，將本站作為「即時輔助工具（Real-Time Assistance, RTA）」查詢或輔助決策。違反各賽事或平台規則所生之後果由使用者自行負責。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">04 · 智財與透明揭露</span>' +
          '<h2>智慧財產權與外部推薦連結揭露</h2>' +
          '<ul>' +
            '<li><strong>著作權保護：</strong>本站原創之課程教材、題庫解析、UI 設計、程式碼及衍生販售之數位圖解隨身卡（PDF），均受中華民國《著作權法》及國際著作權條約保護。未經書面授權，禁止重製、改作、公開散佈、爬蟲擷取或作為商業轉售用途。</li>' +
            '<li><strong>聯盟推薦透明揭露：</strong>本站「進階資源（<a href="#/resources">#/resources</a>）」頁面所列之第三方撲克學習／數據覆盤軟體（如 GTO Wizard、Hand2Note、PokerTracker 4），部分連結含站方聯盟推薦參數或專屬折扣碼；透過該連結訂閱或購買，站方可能獲得軟體商提供之推廣回饋以支持本站免費營運，但<strong>不會增加使用者任何額外費用</strong>。</li>' +
          '</ul>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">05 · 條款效力</span>' +
          '<h2>條款修訂與準據法</h2>' +
          '<p>站方得因應法規更新或服務調整隨時修訂本使用條款，並於本頁面公告最新更新日期後生效；繼續使用本站即視為同意修訂後之條款。</p>' +
          '<p>本條款之解釋與適用，悉依<strong>中華民國（台灣）法律</strong>為準據法；如有未盡事宜，依相關法令及誠實信用原則處理。</p>' +
        '</article>' +
      '</div>'
    );
  }

  function renderPrivacyTab() {
    const hasClarity = !!(GTO.MONETIZE_CONFIG && (GTO.MONETIZE_CONFIG.clarityProjectId || '').trim());
    const clarityBullet = hasClarity
      ? '<li><strong>介面互動熱圖（Microsoft Clarity）：</strong>本站亦使用 Microsoft Clarity 記錄匿名之頁面捲動與點擊熱圖，用以優化手機與桌機操作體驗（系統自動遮罩輸入欄位，不蒐集敏感個資）。</li>'
      : '';
    return (
      '<div class="legal-grid">' +
        '<article class="legal-card">' +
          '<span class="legal-kicker">01 · 資料最小化</span>' +
          '<h2>免註冊架構與瀏覽器本機儲存</h2>' +
          '<p>依台灣《個人資料保護法》第 8 條規範，本站明確告知資料處理方式：本網站採<strong>完全免註冊、免登入</strong>之純靜態架構，不會要求或蒐集您的真實姓名、身分證字號、通訊地址或信用卡號等敏感個資。</p>' +
          '<p>您的課程閱讀紀錄、測驗統計、錯題本、AI 練習桌設定與模擬牌譜，皆僅儲存在您自己裝置瀏覽器的 <code>localStorage</code>（本機儲存空間）中，不會自動上傳至遠端帳號資料庫。您隨時可於「<a href="#/stats">我的進度</a>」頁面自行匯出 JSON 備份或一鍵重置清除。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">02 · 匿名流量統計</span>' +
          '<h2>流量分析與 Cookie／Session 技術</h2>' +
          '<p>為了解課程受歡迎程度與改善網站動線，本站使用 <strong>Google Analytics 4（GA4）</strong>' + (hasClarity ? ' 與 <strong>Microsoft Clarity</strong>' : '') + ' 收集去識別化之統計資訊，包含：</p>' +
          '<ul>' +
            '<li>瀏覽頁面路徑、停留概況、核心功能互動（如範圍表瀏覽、題庫作答與 AI 練習手數）、瀏覽器類型與裝置解析度等聚合數據（不直接識別個人身分）。</li>' +
            '<li>當您經由社群推廣連結進入本站時，系統會於該次瀏覽工作階段之 <code>sessionStorage</code> 暫存 UTM 來源標籤（如 <code>utm_source</code>、<code>utm_medium</code>、<code>utm_campaign</code>、<code>utm_content</code>），並在您點擊外部資源按鈕時記錄匿名之點擊事件。</li>' +
            clarityBullet +
            '<li><strong>退出追蹤方式：</strong>您可透過瀏覽器設定封鎖或刪除 Cookie，或安裝 Google 官方提供之 <em>Google Analytics Opt-out Browser Add-on</em> 停用 GA4 數據收集。</li>' +
          '</ul>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">03 · 客服與回饋</span>' +
          '<h2>意見回饋與客服聯繫資料</h2>' +
          '<p>當您主動透過站內「<a href="#/feedback">意見回饋</a>」、客服信箱或官方社群私訊聯繫我們時，您所提供的問題描述、訂單編號或回覆用聯絡方式，僅會用於：</p>' +
          '<ul>' +
            '<li>回覆您的疑問與技術問題排除。</li>' +
            '<li>數位教材補發或訂單異常協助確認。</li>' +
            '<li>網站課程內容勘誤與功能優化評估。</li>' +
          '</ul>' +
          '<p>本站承諾絕不將您主動提供之聯絡資訊出售、出租或揭露予無關第三方（依法令或司法機關要求配合調查者除外）。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">04 · 金流安全隔離</span>' +
          '<h2>第三方數位商品金流與外部網站</h2>' +
          '<p>本站販售之延伸數位教材與免費工具贊助，均導向第三方創作者電商平台 <strong>Portaly（傳送門）</strong> 及其合作合法金流機構進行加密結帳與檔案發送。付款過程中輸入之信用卡、LINE Pay 或超商繳費資訊皆由該金流平台直接處理，<strong>本站伺服器不會經手、側錄或儲存您的任何付款資訊</strong>。</p>' +
          '<p>透過本站連結前往外部網站（如 Portaly、GTO Wizard、Hand2Note、PokerTracker 4 或各參考文獻來源）後，將適用各該第三方網站之隱私權政策。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">05 · 當事人權利</span>' +
          '<h2>個資當事人權利行使（個資法第 3 條）</h2>' +
          '<p>若您曾透過客服管道提供個人聯絡資料，依台灣《個人資料保護法》第 3 條規定，您享有以下權利：查詢或請求閱覽、請求製給複製本、請求補充或更正、請求停止蒐集／處理或利用，以及請求刪除。</p>' +
          '<p>如需行使上述權利，請透過「<a href="#/legal/about">關於本站與聯絡客服</a>」所列管道與我們聯繫，我們將於確認身分後盡速協助處理。</p>' +
        '</article>' +
      '</div>'
    );
  }

  function renderRefundTab() {
    return (
      '<div class="legal-grid">' +
        '<article class="legal-card">' +
          '<span class="legal-kicker">01 · 核心功能免費</span>' +
          '<h2>站內核心學習功能永久免費</h2>' +
          '<p>本網站目前提供之 <strong>54 堂圖解課程、40 組 6-Max 範圍矩陣、6 人擬真 AI 實戰練習桌、雙軌覆盤室、14 種隨機練習與 4 項計算工具</strong> 皆為完全免費開放使用。</p>' +
          '<p>本站<strong>不存在</strong>任何強制試用轉自動扣款、隱藏定期續訂或未經授權收費機制，您無須綁定信用卡即可永久使用免費核心功能。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">02 · 數位內容例外條款</span>' +
          '<h2>數位電子書／圖解隨身卡（PDF）退費規範</h2>' +
          '<p>透過 Portaly 傳送門購買之《翻後決策 30 招》暗黑圖解隨身卡 PDF 等可下載數位產品，依中華民國《消費者保護法》第 19 條第 1 項但書暨行政院公告之<strong>《通訊交易解除權合理例外情事適用準則》第 2 條第 5 款</strong>規定：</p>' +
          '<blockquote class="legal-quote">「非以有形媒介提供之數位內容或一經提供即為完成之線上服務，經消費者事先同意始提供。」</blockquote>' +
          '<ul>' +
            '<li><strong>不適用 7 日無條件退費：</strong>本類數位電子書於結帳頁面已事先告知並經消費者確認同意，付款完成後系統即自動寄送／開啟下載連結並完成交付，恕<strong>不適用 7 天猶豫期無條件退貨或退費</strong>。</li>' +
            '<li><strong>異常免費補發與重複扣款處理：</strong>若發生未收到下載連結信件、檔案損壞無法開啟，或因系統連線異常導致重複扣款，請於<strong>購買後 7 日內</strong>檢附訂單編號與購買人信箱聯繫客服（<a href="#/legal/about">查看聯絡管道</a>），我們將免費為您重新補發檔案或協助核對辦理重複扣款退費。</li>' +
          '</ul>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">03 · 覆盤服務與未來課程規範</span>' +
          '<h2>客製化手牌覆盤報告與線上課程規範</h2>' +
          '<ul>' +
            '<li><strong>客製化手牌健檢／覆盤報告（未來若開放）：</strong>屬依消費者要求客製化給付之勞務服務。於站方<strong>尚未開始撰寫分析前</strong>可聯繫申請全額取消退費；一旦開始製作並交付專屬覆盤報告後，恕不予退費。</li>' +
            '<li><strong>固定期間線上教學訂閱（未來規劃保障）：</strong>目前本站並無訂閱制付費課程；若未來推出任何固定期間或定期扣款之線上教學服務，將全面遵循數位發展部主管之<strong>《網際網路教學服務定型化契約應記載及不得記載事項》</strong>，提供明確試看／試聽機制、消費者隨時終止契約權利，並依契約約定及未使用服務比例辦理退費，絕不以無效條款限制消費者權益。</li>' +
          '</ul>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">04 · 小額贊助</span>' +
          '<h2>小額贊助（請站長喝咖啡）</h2>' +
          '<p>透過 Portaly 進行之「請站長喝杯咖啡」隨喜贊助，純屬使用者對免費教學工具的自願支持與鼓勵，不對應特定對價商品或權利；除經核實為金流系統重複扣款之異常情況外，完成贊助後恕不退還。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">05 · 第三方軟體</span>' +
          '<h2>第三方推薦軟體退訂與退款說明</h2>' +
          '<p>本站「進階資源」頁面推薦之外部獨立軟體（如 <strong>GTO Wizard、Hand2Note、PokerTracker 4</strong>），其訂閱計費、試用期取消、自動續費關閉及退款審核，均由各該軟體官方公司依其服務條款與退款政策獨立處理，本站無法代為取消或辦理第三方平台之款項退還。</p>' +
        '</article>' +
      '</div>'
    );
  }

  function renderAboutTab(social, business) {
    const bizRows = [];
    bizRows.push('<div><span>營運單位</span><strong>' + esc(business.operatorLabel) + '</strong></div>');
    if (business.businessName) {
      bizRows.push('<div><span>營業人名稱</span><strong>' + esc(business.businessName) + '</strong></div>');
    }
    if (business.taxId) {
      bizRows.push('<div><span>統一編號</span><strong>' + esc(business.taxId) + '</strong></div>');
    }
    bizRows.push('<div><span>客服回覆時效</span><strong>一般於 1～2 個工作日內回覆</strong></div>');

    const emailCard = social.contactEmail
      ? '<a class="legal-contact-item" href="mailto:' + esc(social.contactEmail) + '">' +
          '<span class="lci-ic">✉️</span>' +
          '<div><b>官方客服信箱</b><small>' + esc(social.contactEmail) + '</small></div>' +
          '<span class="lci-go">寄信 →</span>' +
        '</a>'
      : '';

    return (
      '<div class="legal-grid">' +
        '<article class="legal-card">' +
          '<span class="legal-kicker">01 · 創立理念</span>' +
          '<h2>關於 GTO 撲克學院（Poker GTO Lab）</h2>' +
          '<p>我們致力於為繁體中文學習者打造一個<strong>免費、免註冊、零賭博誘惑</strong>的德州撲克賽局理論（GTO）與機率思維訓練室。</p>' +
          '<p>透過視覺化的 13×13 範圍矩陣、6 人擬真 AI 實戰練習桌、雙軌教練覆盤診斷與循序漸進的 54 堂圖解課，讓新手不必接觸高風險真錢牌局，就能在安全純粹的環境中建立紮實的數學期望值（EV）與賽局邏輯。</p>' +
        '</article>' +

        '<article class="legal-card">' +
          '<span class="legal-kicker">02 · 聯絡我們（消保法第 18 條資訊管道）</span>' +
          '<h2>營運資訊與官方客服管道</h2>' +
          '<div class="legal-meta-list">' + bizRows.join('') + '</div>' +
          '<p class="muted small" style="margin-top:10px">依台灣《消費者保護法》第 18 條精神，若您對數位教材購買、下載補發、重複扣款查核、個資權利行使或課程勘誤有任何疑問，歡迎透過以下任一官方管道聯繫我們：</p>' +
          '<div class="legal-contact-grid">' +
            '<a class="legal-contact-item" href="' + esc(social.igUrl) + '" target="_blank" rel="noopener noreferrer">' +
              '<span class="lci-ic">📸</span>' +
              '<div><b>官方 Instagram 私訊</b><small>' + esc(social.igHandle) + '</small></div>' +
              '<span class="lci-go">前往 IG →</span>' +
            '</a>' +
            '<a class="legal-contact-item" href="' + esc(social.portalyHomeUrl) + '" target="_blank" rel="noopener noreferrer">' +
              '<span class="lci-ic">📦</span>' +
              '<div><b>Portaly 傳送門專頁</b><small>訂單查詢與數位教材支援</small></div>' +
              '<span class="lci-go">前往專頁 →</span>' +
            '</a>' +
            '<a class="legal-contact-item" href="#/feedback">' +
              '<span class="lci-ic">💬</span>' +
              '<div><b>站內意見回饋表單</b><small>Bug 回報、課程勘誤與功能許願</small></div>' +
              '<span class="lci-go">填寫表單 →</span>' +
            '</a>' +
            emailCard +
          '</div>' +
        '</article>' +
      '</div>'
    );
  }

  function renderLegalPage(root, sub) {
    const activeTab = LEGAL_TABS.some((t) => t.id === sub) ? sub : 'terms';
    const { social, business } = getConfig();

    const tabsHtml = LEGAL_TABS.map((t) =>
      '<a class="legal-tab' + (t.id === activeTab ? ' on' : '') + '" href="#/legal/' + t.id + '">' +
        '<span>' + t.icon + '</span><b>' + esc(t.label) + '</b>' +
      '</a>'
    ).join('');

    let bodyHtml = '';
    if (activeTab === 'privacy') bodyHtml = renderPrivacyTab();
    else if (activeTab === 'refund') bodyHtml = renderRefundTab();
    else if (activeTab === 'about') bodyHtml = renderAboutTab(social, business);
    else bodyHtml = renderTermsTab();

    root.innerHTML =
      '<div class="legal-page no-en">' +
        '<header class="legal-hero">' +
          '<div class="legal-hero-top">' +
            '<span class="mon-kicker">♠ Poker GTO Lab · 法務與透明揭露</span>' +
            '<span class="legal-updated">最後更新日期：' + esc(business.lastUpdated) + '</span>' +
          '</div>' +
          '<h1>⚖️ 法務資訊、合規聲明與聯絡客服</h1>' +
          '<p class="legal-lead">本站為純競技德州撲克數學機率與賽局理論教學工具，遵循中華民國（台灣）相關法令並致力於清楚透明的消費者資訊揭露。</p>' +
        '</header>' +
        '<nav class="legal-tabs" aria-label="法務文件分頁">' + tabsHtml + '</nav>' +
        '<section class="legal-body" aria-live="polite">' + bodyHtml + '</section>' +
      '</div>';
  }

  GTO.Legal = {
    renderFooter,
    renderLegalPage,
  };
})();

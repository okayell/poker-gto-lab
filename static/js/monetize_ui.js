/**
 * GTO 撲克學院（獨立版）— GA4 / Microsoft Clarity / UTM 導流追蹤 + 進階工具與 Portaly 資源頁 (#/resources)
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const UTM_KEY = 'poker_gto_standalone_utm_v1';
  const SITE_NAME = 'GTO 撲克學院';
  const DEFAULT_TITLE = 'GTO 撲克學院｜從零學會德州撲克：圖解課程・GTO 範圍表・無限隨機練習・術語百科';

  const QUIZ_MODE_LABELS = {
    preflop: '翻前決策練習',
    paint: '範圍表默寫',
    theory: '觀念選擇題',
    math: '數學與賠率計算',
    terms: '術語測驗',
    equity: '勝率估算',
    mix: '綜合挑戰',
    showdown: '誰贏了？比牌練習',
    handname: '牌型辨識',
    outs: '聽牌與 Outs 計算',
    position: '位置判斷',
    nuts: '找堅果牌',
    texture: '牌面結構判斷',
    spots: '翻後實戰情境',
  };

  const WIKI_TAB_LABELS = {
    glossary: '術語百科',
    faq: '新手 FAQ',
    tips: '實戰技巧',
    leaks: '常見漏洞',
    cheatsheet: '速查表',
    resources: '學習資源',
  };

  const LEGAL_TAB_LABELS = {
    terms: '使用條款與非博弈聲明',
    privacy: '隱私權政策',
    refund: '數位教材與退款說明',
    about: '關於與聯絡客服',
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getCfg() {
    return GTO.MONETIZE_CONFIG || { products: [], affiliates: [], social: {} };
  }

  function isTrackableProtocol() {
    return typeof window !== 'undefined' &&
      window.location &&
      (window.location.protocol === 'https:' || window.location.protocol === 'http:');
  }

  // ── 1. Capture UTM parameters from IG Bio / Reels / YouTube Shorts links ──
  function captureUtm() {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashQuery = (window.location.hash.split('?')[1]) || '';
      const hashParams = new URLSearchParams(hashQuery);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
      const found = {};
      let hasAny = false;
      for (const k of keys) {
        const val = searchParams.get(k) || hashParams.get(k);
        if (val) {
          found[k] = val;
          hasAny = true;
        }
      }
      if (hasAny) {
        found.landed_at = new Date().toISOString();
        sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
      }
    } catch (_) {}
  }

  function getSavedUtm() {
    try {
      return JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function utmEventParams() {
    const utm = getSavedUtm();
    return {
      utm_source: utm.utm_source || '(direct)',
      utm_medium: utm.utm_medium || '(none)',
      utm_campaign: utm.utm_campaign || '(none)',
      utm_content: utm.utm_content || '(none)',
    };
  }

  // ── 2. Google Analytics 4 (auto-loads only when valid Measurement ID is configured) ──
  let ga4Ready = false;
  let clarityReady = false;
  let sentInitialPageView = false;
  let lastTrackedPath = '';

  function initGa4() {
    if (!isTrackableProtocol()) return;
    const id = (getCfg().ga4MeasurementId || '').trim();
    if (!id || id === 'G-XXXXXXXXXX' || !/^G-[A-Z0-9]+$/i.test(id)) return;
    if (ga4Ready) return;
    ga4Ready = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
    const sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(sc);
  }

  // ── 2b. Microsoft Clarity (optional heatmaps & session replay; auto-loads when clarityProjectId is set) ──
  function initClarity() {
    if (!isTrackableProtocol()) return;
    const cid = (getCfg().clarityProjectId || '').trim();
    if (!cid || !/^[a-z0-9]{6,20}$/i.test(cid)) return;
    if (clarityReady) return;
    clarityReady = true;
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    const sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(cid);
    const first = document.getElementsByTagName('script')[0];
    if (first && first.parentNode) first.parentNode.insertBefore(sc, first);
    else if (document.head) document.head.appendChild(sc);

    const utm = getSavedUtm();
    if (utm.utm_source) window.clarity('set', 'utm_source', utm.utm_source);
    if (utm.utm_medium) window.clarity('set', 'utm_medium', utm.utm_medium);
    if (utm.utm_campaign) window.clarity('set', 'utm_campaign', utm.utm_campaign);
    if (utm.utm_content) window.clarity('set', 'utm_content', utm.utm_content);
  }

  // ── 2c. Clean hash-free SPA virtual path & dynamic document.title ──
  function buildPageMeta(page, sub, extra, query) {
    const p = page || 'home';
    const segs = [p];
    if (sub) {
      segs.push(sub);
    } else if (p === 'learn' && query && query.view === 'plan') {
      segs.push('plan');
    } else if (p === 'quiz' && query && query.topic) {
      segs.push('topic', query.topic);
    }
    if (extra) segs.push(extra);
    const path = '/' + segs.map((s) => encodeURIComponent(s)).join('/');

    let title = DEFAULT_TITLE;
    if (p === 'play') {
      title = '6 人 AI 實戰練習桌｜' + SITE_NAME;
    } else if (p === 'replay') {
      title = (sub ? '牌局覆盤檢討｜' : '雙軌教練覆盤室｜') + SITE_NAME;
    } else if (p === 'ranges') {
      const sc = sub && GTO.SCENARIOS && GTO.SCENARIOS[sub];
      title = (sc ? sc.title + '｜翻前範圍表｜' : '翻前範圍表（40 組 6-Max）｜') + SITE_NAME;
    } else if (p === 'learn') {
      const lesson = sub && GTO.LESSON_MAP && GTO.LESSON_MAP[sub];
      if (lesson) title = lesson.title + '｜圖解課程｜' + SITE_NAME;
      else if (query && query.view === 'plan') title = '30 天學習計畫｜' + SITE_NAME;
      else title = '54 堂圖解課程地圖｜' + SITE_NAME;
    } else if (p === 'quiz') {
      if (query && query.topic && GTO.LESSON_MAP && GTO.LESSON_MAP[query.topic]) {
        title = GTO.LESSON_MAP[query.topic].title + ' 測驗｜' + SITE_NAME;
      } else if (sub && QUIZ_MODE_LABELS[sub]) {
        title = QUIZ_MODE_LABELS[sub] + '｜' + SITE_NAME;
      } else {
        title = '無限隨機練習中心｜' + SITE_NAME;
      }
    } else if (p === 'wiki') {
      const tab = WIKI_TAB_LABELS[sub || 'glossary'] || '撲克百科';
      title = tab + '｜' + SITE_NAME;
    } else if (p === 'tools') {
      title = 'GTO 計算工具（勝率・MDF・EV・SPR）｜' + SITE_NAME;
    } else if (p === 'stats') {
      title = '我的學習進度｜' + SITE_NAME;
    } else if (p === 'resources') {
      title = '進階資源與翻後隨身卡｜' + SITE_NAME;
    } else if (p === 'legal') {
      const tab = LEGAL_TAB_LABELS[sub || 'terms'] || '法務資訊';
      title = tab + '｜' + SITE_NAME;
    } else if (p === 'feedback') {
      title = '意見回饋｜' + SITE_NAME;
    }

    return { path, title, section: p };
  }

  function buildVirtualLocation(cleanPath, includeLandingQuery) {
    const origin = (window.location && window.location.origin && window.location.origin !== 'null')
      ? window.location.origin
      : 'https://poker-gto-lab.pages.dev';
    let search = '';
    if (includeLandingQuery) {
      if (window.location && window.location.search) {
        search = window.location.search;
      } else {
        // 若 UTM 參數寫在 #hash?utm_source=... 後面，首次進站也補進 page_location 讓 GA4 正確歸因
        const utm = getSavedUtm();
        const sp = new URLSearchParams();
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
          if (utm[k]) sp.set(k, utm[k]);
        });
        const qs = sp.toString();
        if (qs) search = '?' + qs;
      }
    }
    return origin + cleanPath + search;
  }

  function trackEvent(eventName, params) {
    if (!eventName) return;
    const payload = Object.assign({}, utmEventParams());
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((k) => {
        if (params[k] !== undefined && params[k] !== null) payload[k] = params[k];
      });
    }
    if (ga4Ready && typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
    if (clarityReady && typeof window.clarity === 'function') {
      try { window.clarity('event', eventName); } catch (_) {}
    }
  }

  function trackPageView(page, sub, extra, query) {
    captureUtm();
    const meta = buildPageMeta(page, sub, extra, query);
    if (typeof document !== 'undefined') document.title = meta.title;

    // 防止同一頁面重複觸發（例如初次進站 syncFromServer 觸發 progress-replaced 重繪 home）
    if (meta.path === lastTrackedPath && sentInitialPageView) return;
    const isLanding = !sentInitialPageView;
    lastTrackedPath = meta.path;
    sentInitialPageView = true;

    const id = (getCfg().ga4MeasurementId || '').trim();
    if (ga4Ready && id && id !== 'G-XXXXXXXXXX' && typeof window.gtag === 'function') {
      const payload = Object.assign({
        page_location: buildVirtualLocation(meta.path, isLanding),
        page_path: meta.path,
        page_title: meta.title,
        spa_section: meta.section,
      }, utmEventParams());
      window.gtag('event', 'page_view', payload);
    }
    if (clarityReady && typeof window.clarity === 'function') {
      try { window.clarity('set', 'spa_page', meta.path); } catch (_) {}
    }
  }

  function trackOutbound(kind, itemId, label, url) {
    trackEvent('monetize_outbound_click', {
      event_category: kind,
      item_id: itemId,
      item_name: label,
      link_url: url,
    });
  }

  // 全站攔截導流 Banner 點擊（home / replay 等區塊）
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', (e) => {
      const link = e.target && e.target.closest ? e.target.closest('.mon-banner a[href="#/resources"]') : null;
      if (!link) return;
      const sec = link.closest('.mon-banner');
      trackEvent('monetize_banner_click', {
        placement: (sec && sec.getAttribute('data-placement')) || 'unknown',
      });
    });
  }

  function isPlaceholderUrl(url) {
    return !url || /^https:\/\/portaly\.cc\/?$/.test(url.trim());
  }

  // ── 3. Subtle Non-Intrusive Funnel Banner for Home / Replay pages ──
  function bannerHtml(placement) {
    return (
      '<section class="mon-banner no-en" data-placement="' + esc(placement || 'home') + '">' +
        '<div class="mon-banner-left">' +
          '<span class="mon-kicker">♠ 永久免費練習 · 進階資源站</span>' +
          '<h3>想把短影音重點存進手機，或升級進階 GTO Solver？</h3>' +
          '<p>本站 54 堂課、40 組範圍矩陣與 6 人 AI 實戰桌完全免費開放。逛逛我們整理的 <b>《翻後 30 招隨身卡》</b> 與進階訓練工具推薦，同時支持學院持續更新！</p>' +
        '</div>' +
        '<div class="mon-banner-actions">' +
          '<a class="btn primary" href="#/resources">⚡ 查看進階資源與手冊 →</a>' +
        '</div>' +
      '</section>'
    );
  }

  // ── 4. Dedicated #/resources Page ──
  function renderResourcesPage(root) {
    const cfg = getCfg();
    const utm = getSavedUtm();
    const products = cfg.products || [];
    const affiliates = cfg.affiliates || [];
    const gaActive = cfg.ga4MeasurementId && cfg.ga4MeasurementId !== 'G-XXXXXXXXXX';

    const utmBadge = utm.utm_source
      ? '<span class="mon-utm-pill">來源追蹤：' + esc(utm.utm_source) + (utm.utm_campaign ? ' · ' + esc(utm.utm_campaign) : '') + '</span>'
      : '';

    root.innerHTML =
      '<div class="mon-page no-en">' +
        '<div class="mon-hero">' +
          '<div class="mon-hero-top">' +
            '<span class="mon-kicker">GTO 撲克學院 · 獨立進階資源與支持</span>' +
            utmBadge +
          '</div>' +
          '<h1>把免費練習工具用到極致，再用對的工具加速升級</h1>' +
          '<p class="mon-lead">本站所有核心功能（<b>6 人 AI 實戰桌、雙軌教練覆盤、54 堂圖解課、40 組 6-Max 範圍表、14 種無限隨機練習</b>）一律免費、免註冊直接用。下方為站長精選的延伸教材與合法競技訓練軟體推薦。</p>' +
        '</div>' +

        '<section class="mon-section">' +
          '<div class="mon-sec-head">' +
            '<div>' +
              '<h2>📦 精選數位手冊、覆盤服務與贊助（Portaly）</h2>' +
              '<p class="mon-sec-sub">支援台灣信用卡、LINE Pay 與超商付款，購買後自動發送下載連結。</p>' +
            '</div>' +
          '</div>' +
          '<div class="mon-grid">' +
            products.map((p) =>
              '<article class="mon-card tone-' + esc(p.tone || 'mint') + '">' +
                '<div class="mon-card-top">' +
                  '<span class="mon-badge">' + esc(p.badge) + '</span>' +
                  '<span class="mon-price">' + esc(p.price) + '</span>' +
                '</div>' +
                '<h3>' + esc(p.title) + '</h3>' +
                '<p>' + esc(p.desc) + '</p>' +
                '<a class="mon-cta" target="_blank" rel="noopener noreferrer" data-mon-kind="portaly" data-mon-id="' + esc(p.id) + '" data-mon-label="' + esc(p.title) + '" href="' + esc(p.url) + '">' + esc(p.cta) + '</a>' +
                (isPlaceholderUrl(p.url) ? '<div class="mon-setup-hint">🔧 站長提示：請至 static/js/monetize_config.js 填入你的專屬 Portaly 商品網址</div>' : '') +
              '</article>'
            ).join('') +
          '</div>' +
          '<div class="mon-prepurchase-note">' +
            '📌 <strong>購買前須知：</strong>數位電子書（PDF）屬「非以有形媒介提供之數位內容」，一經付款提供下載連結即完成交付；依台灣《消費者保護法》第 19 條合理例外情事規定，經結帳確認同意後不適用 7 日無條件退費（檔案異常可免費補發）。詳見 <a href="#/legal/refund">數位教材與退款說明</a>。' +
          '</div>' +
        '</section>' +

        '<section class="mon-section">' +
          '<div class="mon-sec-head">' +
            '<div>' +
              '<h2>🧮 推薦進階競技訓練軟體（Solver &amp; HUD）</h2>' +
              '<p class="mon-sec-sub">皆為合法公開的撲克數學計算與覆盤學習軟體；透過推薦連結升級可回饋站長維護免費學院。</p>' +
            '</div>' +
          '</div>' +
          '<div class="mon-grid">' +
            affiliates.map((a) =>
              '<article class="mon-card tone-aff">' +
                '<div class="mon-card-top">' +
                  '<span class="mon-badge">' + esc(a.tag) + '</span>' +
                '</div>' +
                '<h3>' + esc(a.name) + '</h3>' +
                '<p>' + esc(a.desc) + '</p>' +
                '<div class="mon-benefit">✨ ' + esc(a.benefit) + '</div>' +
                '<a class="mon-cta secondary" target="_blank" rel="noopener noreferrer" data-mon-kind="affiliate" data-mon-id="' + esc(a.id) + '" data-mon-label="' + esc(a.name) + '" href="' + esc(a.url) + '">' + esc(a.cta) + '</a>' +
              '</article>'
            ).join('') +
          '</div>' +
        '</section>' +

        '<footer class="mon-disclaimer">' +
          '<strong>合規與透明聲明：</strong>本站為純競技德州撲克數學機率、博弈論（GTO）與策略教學工具，不提供任何真錢賭博或線上私局服務。部分外部學習軟體連結為聯盟推薦連結，點擊不會增加你的任何費用。' +
          '<div class="mon-legal-links">' +
            '<a href="#/legal/terms">使用條款與非博弈聲明</a> · ' +
            '<a href="#/legal/privacy">隱私權政策</a> · ' +
            '<a href="#/legal/refund">退款說明</a> · ' +
            '<a href="#/legal/about">關於與聯絡我們</a>' +
          '</div>' +
          (gaActive ? '' : ' <span class="mon-ga-hint">（GA4 追蹤碼待設定：編輯 static/js/monetize_config.js 即可啟用）</span>') +
        '</footer>' +
      '</div>';

    root.querySelectorAll('[data-mon-kind]').forEach((a) => {
      a.addEventListener('click', () => {
        trackOutbound(
          a.getAttribute('data-mon-kind'),
          a.getAttribute('data-mon-id'),
          a.getAttribute('data-mon-label'),
          a.getAttribute('href')
        );
      });
    });
  }

  captureUtm();
  initGa4();
  initClarity();

  GTO.Monetize = {
    captureUtm,
    getSavedUtm,
    buildPageMeta,
    trackPageView,
    trackEvent,
    trackOutbound,
    bannerHtml,
    renderResourcesPage,
  };
})();

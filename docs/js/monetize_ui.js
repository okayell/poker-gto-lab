/**
 * GTO 撲克學院（獨立版）— GA4 / UTM 導流追蹤 + 進階工具與 Portaly 資源頁 (#/resources)
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const UTM_KEY = 'poker_gto_standalone_utm_v1';

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

  // ── 1. Capture UTM parameters from IG Reels / YouTube Shorts links ──
  function captureUtm() {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashQuery = (window.location.hash.split('?')[1]) || '';
      const hashParams = new URLSearchParams(hashQuery);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'];
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

  // ── 2. Google Analytics 4 (auto-loads only when valid Measurement ID is configured) ──
  let ga4Ready = false;
  function initGa4() {
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

  function trackPageView(page, sub) {
    const id = (getCfg().ga4MeasurementId || '').trim();
    if (!id || id === 'G-XXXXXXXXXX' || typeof window.gtag !== 'function') return;
    const utm = getSavedUtm();
    window.gtag('event', 'page_view', {
      page_path: '/#/' + page + (sub ? '/' + sub : ''),
      page_title: document.title,
      utm_source: utm.utm_source || '(direct)',
      utm_campaign: utm.utm_campaign || '(none)',
    });
  }

  function trackOutbound(kind, itemId, label, url) {
    const utm = getSavedUtm();
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'monetize_outbound_click', {
        event_category: kind,
        item_id: itemId,
        item_name: label,
        link_url: url,
        utm_source: utm.utm_source || '(direct)',
        utm_campaign: utm.utm_campaign || '(none)',
      });
    }
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

  GTO.Monetize = {
    captureUtm,
    getSavedUtm,
    trackPageView,
    trackOutbound,
    bannerHtml,
    renderResourcesPage,
  };
})();

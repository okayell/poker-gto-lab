/* GTO 撲克學院 — releases.js
 * 版本資訊、Release Notes 歷史紀錄與「待發布變更偵測 / 1.x.x 智慧進位發布中心」彈跳視窗
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  GTO.RELEASES_DATA = {
  "current_version": "1.1.0",
  "releases": [
    {
      "version": "1.1.0",
      "date": "2026-11-26",
      "bump": "minor",
      "title": "全站滑動與效能大優化・6 人實戰桌手機單屏體驗升級",
      "highlights": [
        "6 人實戰桌改採局部差量 DOM 更新與非同步牌譜存檔，消除每手重繪閃爍與卡頓；修正座位配置彈窗、C 鍵跟注、超時自動過牌／棄牌與棄牌自動略過雙重存檔等問題",
        "手機版 6 人實戰桌改為可收合緊湊工具列與優化 6 席幾何座標，第一屏即可同時看全桌並直接點擊下注操作，徹底消除莊家鈕／HUD 與牌面重疊",
        "移除全站高耗能固定背景重繪、SVG 雜訊濾鏡與手機高斯模糊合成，頁面跳轉更輕快順暢，並於手機底部新增「更多」導覽抽屜可直達工具、百科與覆盤",
        "同步修正覆盤室迷你牌桌手機重疊、首頁迷你桌裁切、進度頁手機橫向捲動表格與全站文案一致性"
      ],
      "files_count": 0
    },
    {
      "version": "1.0.0",
      "date": "2026-11-24",
      "bump": "major",
      "title": "Poker GTO Lab｜GTO 撲克學院正式上線（暗黑牌桌 Studio 版）",
      "highlights": [
        "完整 6 人桌（6-Max 100bb）40 組翻前 GTO 範圍矩陣，支援混合頻率與雙範圍並排比較",
        "內建 6 人擬真 AI 實戰練習桌、雙軌教練即時覆盤室（GTO 基準＋低級別實戰剝削建議）與 38 組經典翻後情境",
        "收錄 54 堂圖解課程、380 道隨機練習題庫、260+ 撲克術語中英對照百科與四大機率／EV／MDF／SPR 計算器",
        "電視轉播級深色高對比牌桌視覺（黑曜石 × 祖母綠絨布 × 胡桃木 × 古銅金），桌面與手機皆可免註冊直接使用"
      ],
      "files_count": 0
    }
  ]
};
  const BUMP_LABELS = {
    major: { label: 'Major 大改版（進第 1 位數 X.0.0）', badge: 'Major 大改版', cls: 'bad' },
    minor: { label: 'Minor 功能／內容擴充（進第 2 位數 1.X.0）', badge: 'Minor 功能擴充', cls: 'info' },
    patch: { label: 'Patch 細節優化／修正（進第 3 位數 1.x.X）', badge: 'Patch 細節修正', cls: 'ok' },
  };

  let cachedStatus = null;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isStaticEnv() {
    const host = (typeof location !== 'undefined' && location.hostname) || '';
    return !!(
      window.GTO_STATIC_ONLY ||
      (location.protocol !== 'http:' && location.protocol !== 'https:') ||
      /\.github\.io$|\.pages\.dev$|\.netlify\.app$|\.vercel\.app$/i.test(host)
    );
  }

  function updateBadgeUI(status) {
    const btn = document.getElementById('verBadgeBtn');
    if (!btn) return;
    const ver = (status && status.current_version) || (GTO.RELEASES_DATA && GTO.RELEASES_DATA.current_version) || '1.3.0';
    const localMode = !!(status && !status.static) && !isStaticEnv();
    const hasChanges = localMode && !!(status && status.has_changes);
    btn.className = 'ver-badge' + (hasChanges ? ' has-changes' : '');
    btn.innerHTML = '<span>v' + esc(ver) + '</span>' + (hasChanges ? '<i class="ver-dot" title="有未發布的修改檔案"></i>' : '');
    if (!localMode) {
      btn.title = '版本 v' + ver + '（點擊查看 Release Notes）';
    } else {
      btn.title = hasChanges
        ? '目前版本 v' + ver + '（偵測到 ' + status.changed_files.length + ' 個檔案已修改，點擊查看 Release Notes 與發布新版本）'
        : '目前版本 v' + ver + '（點擊查看 Release Notes、匯出單一 HTML 或發布新版本）';
    }
  }

  async function fetchReleaseStatus() {
    if (window.__MOCK_RELEASE_STATUS) {
      cachedStatus = window.__MOCK_RELEASE_STATUS;
      updateBadgeUI(cachedStatus);
      return cachedStatus;
    }
    if (isStaticEnv()) {
      return null;
    }
    try {
      const res = await fetch('api/release_status', { cache: 'no-store' });
      if (!res.ok) return null;
      const ct = (res.headers && res.headers.get && res.headers.get('content-type')) || '';
      if (!ct.includes('application/json')) return null;
      cachedStatus = await res.json();
      if (cachedStatus && cachedStatus.current_version) {
        GTO.RELEASES_DATA.current_version = cachedStatus.current_version;
        GTO.RELEASES_DATA.releases = cachedStatus.releases || GTO.RELEASES_DATA.releases;
      }
      updateBadgeUI(cachedStatus);
      return cachedStatus;
    } catch (e) {
      return null;
    }
  }

  function renderReleaseModal(status) {
    let bd = document.getElementById('relModal');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'relModal';
      bd.className = 'modal-bd';
      bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.remove('open'); });
      document.body.appendChild(bd);
    }

    const ver = (status && status.current_version) || GTO.RELEASES_DATA.current_version || '1.3.0';
    const releases = (status && status.releases) || GTO.RELEASES_DATA.releases || [];
    const isLocalServer = !!(status && !status.static) && !isStaticEnv();
    const hasChanges = isLocalServer && !!(status && status.has_changes);

    let statusSectionHtml = '';
    if (isLocalServer) {
      const exportBoxHtml =
        '<div class="rel-status-box" style="margin-bottom:12px">' +
          '<div class="rs-head">' +
            '<div>' +
              '<strong>📦 GitHub Pages 單一檔案匯出（免安裝靜態版）</strong>' +
              '<div class="muted" style="font-size:12.5px;margin-top:3px">將最新課程、範圍表、練習題庫與所有介面打包成單一 <code>index.html</code>，直接拖進 GitHub 即可發布公開網頁（公開版僅顯示 Release Notes）。</div>' +
            '</div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
              '<a class="btn sm primary" href="/download/index.html" download="index.html">⬇️ 直接下載最新 index.html</a>' +
              '<a class="btn sm" href="/download/zip" download="GTO_Poker_Academy_Web_Package.zip">📦 下載網站包 (.zip)</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      if (!hasChanges) {
        statusSectionHtml = exportBoxHtml +
          '<div class="rel-status-box clean">' +
            '<div style="font-size:13.5px;color:#166534">✅ 目前工作目錄所有程式碼與教材皆與最新發布版 <strong>v' + esc(ver) + '</strong> 同步，無待發布修改。</div>' +
          '</div>';
      } else {
        const rec = status.recommended_bump || 'patch';
        const nv = status.next_versions || {};
        const filesRows = status.changed_files.map((f) =>
          '<tr>' +
            '<td><span class="chip info">' + esc(f.cat) + '</span></td>' +
            '<td><code>' + esc(f.path) + '</code><div class="muted" style="font-size:11.5px">' + esc(f.desc) + '</div></td>' +
            '<td><span class="chip warn">' + esc(f.status_zh) + '</span></td>' +
            '<td style="white-space:nowrap;font-weight:700"><span style="color:#16a34a">+' + f.added_lines + '</span> / <span style="color:#dc2626">-' + f.removed_lines + '</span> 行</td>' +
          '</tr>'
        ).join('');

        const bumpOpts = ['patch', 'minor', 'major'].map((b) => {
          const isRec = b === rec;
          const targetVer = nv[b] || '';
          const descMap = {
            patch: '進第 3 位數（1.x.X）：微調樣式、文字修正、小 Bug 修復',
            minor: '進第 2 位數（1.X.0）：新增功能、互動圖表、課程或題庫擴充',
            major: '進第 1 位數（X.0.0）：全站架構大改版、跨模組大規模升級',
          };
          return '<label class="rel-bump-opt' + (isRec ? ' on' : '') + '" data-bump-card="' + b + '">' +
            '<input type="radio" name="relBumpType" value="' + b + '"' + (isRec ? ' checked' : '') + '>' +
            '<div class="rbo-top">' +
              '<strong>v' + esc(targetVer) + '</strong>' +
              (isRec ? '<span class="chip ok">🤖 系統推薦</span>' : '') +
            '</div>' +
            '<div class="rbo-sub">' + esc(descMap[b]) + '</div>' +
          '</label>';
        }).join('');

        statusSectionHtml = exportBoxHtml +
          '<div class="rel-status-box dirty">' +
            '<div class="rs-head">' +
              '<div><span class="chip warn">⚠️ 偵測到未發布變更</span> <strong>共有 ' + status.changed_files.length + ' 個檔案自 v' + esc(ver) + ' 後有修改</strong></div>' +
              '<span class="muted" style="font-size:12.5px">總變動：<b style="color:#16a34a">+' + status.total_added + '</b> / <b style="color:#dc2626">-' + status.total_removed + '</b> 行</span>' +
            '</div>' +
            '<div class="rel-ai-advice">🧭 <strong>智慧版號進位判斷（1.x.x）：</strong>' + esc(status.recommendation_reason) + '</div>' +
            '<div class="tbl-wrap" style="margin:10px 0;max-height:180px;overflow:auto">' +
              '<table class="tbl compact"><thead><tr><th>分類</th><th>修改檔案與說明</th><th>狀態</th><th>行數變動</th></tr></thead><tbody>' + filesRows + '</tbody></table>' +
            '</div>' +
            '<div class="rel-bump-grid">' + bumpOpts + '</div>' +
            '<div class="rel-form">' +
              '<label style="display:block"><b>新版本標題（Release Title）</b><input type="text" id="relTitleInp" class="inp" style="width:100%;margin-top:4px;display:block" value="' + esc(status.suggested_title || '') + '" placeholder="簡述本次更新重點"></label>' +
              '<label style="margin-top:8px;display:block"><b>更新細項（Release Notes，每行一條，已根據修改檔案自動預填）</b>' +
                '<textarea id="relHighlightsInp" class="inp" rows="3" style="width:100%;margin-top:4px;font-family:inherit">' + esc((status.suggested_highlights || []).join('\n')) + '</textarea>' +
              '</label>' +
              '<div class="rel-actions">' +
                '<button type="button" class="btn primary" id="publishRelBtn">🚀 發布新版本 v<span id="publishVerTxt">' + esc(nv[rec] || '') + '</span> 並同步重新打包</button>' +
              '</div>' +
            '</div>' +
          '</div>';
      }
    }

    const historyHtml = releases.map((r, idx) => {
      const bInfo = BUMP_LABELS[r.bump] || BUMP_LABELS.minor;
      const items = (r.highlights || []).map((h) => '<li>' + esc(h) + '</li>').join('');
      return '<div class="rel-item' + (idx === 0 ? ' latest' : '') + '">' +
        '<div class="ri-head">' +
          '<span class="ri-ver">v' + esc(r.version) + '</span>' +
          (idx === 0 ? '<span class="chip ok">目前版本</span>' : '') +
          '<span class="chip ' + bInfo.cls + '">' + esc(bInfo.badge) + '</span>' +
          '<span class="ri-date">📅 ' + esc(r.date) + (r.files_count ? ' · 涵蓋 ' + r.files_count + ' 個檔案' : '') + '</span>' +
        '</div>' +
        '<h4 class="ri-title">' + esc(r.title) + '</h4>' +
        '<ul class="ri-list">' + items + '</ul>' +
      '</div>';
    }).join('');

    const modalTitle = isLocalServer
      ? '🚀 GTO 撲克學院 · 版本紀錄與發布中心'
      : '📜 GTO 撲克學院 · Release Notes';
    const modalSub = isLocalServer
      ? '<p class="muted" style="margin:3px 0 0;font-size:13px">遵循語意化版本 <code>MAJOR.MINOR.PATCH (1.x.x)</code>：大改版進第 1 位、新功能/內容擴充進第 2 位、細節微調與修正進第 3 位。</p>'
      : '';

    bd.innerHTML =
      '<div class="modal-box rel-modal-box" role="dialog" aria-label="Release Notes">' +
        '<div class="rel-modal-head">' +
          '<div>' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              '<h3 style="margin:0;font-size:19px">' + modalTitle + '</h3>' +
              '<span class="ver-pill-lg">v' + esc(ver) + '</span>' +
            '</div>' +
            modalSub +
          '</div>' +
          '<button type="button" class="btn sm ghost" id="closeRelModalBtn">✕ 關閉</button>' +
        '</div>' +
        '<div class="rel-modal-body">' +
          statusSectionHtml +
          '<h4 class="rel-sec-title"' + (!isLocalServer ? ' style="margin-top:0"' : '') + '>📜 Release Notes 歷史版本紀錄</h4>' +
          '<div class="rel-timeline">' + historyHtml + '</div>' +
        '</div>' +
      '</div>';

    bd.classList.add('open');
    bd.querySelector('#closeRelModalBtn').addEventListener('click', () => bd.classList.remove('open'));

    bd.querySelectorAll('[name="relBumpType"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        bd.querySelectorAll('.rel-bump-opt').forEach((el) => el.classList.remove('on'));
        const card = radio.closest('.rel-bump-opt');
        if (card) card.classList.add('on');
        const vTxt = bd.querySelector('#publishVerTxt');
        if (vTxt && status && status.next_versions) {
          vTxt.textContent = status.next_versions[radio.value] || '';
        }
      });
    });

    const pubBtn = bd.querySelector('#publishRelBtn');
    if (pubBtn) {
      pubBtn.addEventListener('click', async () => {
        const checked = bd.querySelector('[name="relBumpType"]:checked');
        const bumpType = checked ? checked.value : (status.recommended_bump || 'patch');
        const titleVal = (bd.querySelector('#relTitleInp') || {}).value || '';
        const hlRaw = (bd.querySelector('#relHighlightsInp') || {}).value || '';
        const highlights = hlRaw.split('\n').map((s) => s.trim()).filter(Boolean);
        pubBtn.disabled = true;
        pubBtn.textContent = '⏳ 正在發布並重新打包 index.html ...';
        try {
          const res = await fetch('api/release_publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bump_type: bumpType, bump: bumpType, title: titleVal, highlights }),
          });
          const out = await res.json();
          if (out && out.ok) {
            cachedStatus = out.status;
            GTO.RELEASES_DATA.current_version = out.new_version;
            GTO.RELEASES_DATA.releases = out.status.releases;
            updateBadgeUI(cachedStatus);
            renderReleaseModal(cachedStatus);
            if (GTO.toast) GTO.toast('🎉 已發布 v' + out.new_version + ' 並同步更新離線/GitHub 打包檔！', 'ok');
          } else {
            pubBtn.disabled = false;
            pubBtn.textContent = '🚀 重新嘗試發布';
            if (GTO.toast) GTO.toast('發布失敗：' + ((out && out.error) || '未知錯誤'), 'bad');
          }
        } catch (err) {
          pubBtn.disabled = false;
          pubBtn.textContent = '🚀 重新嘗試發布';
          if (GTO.toast) GTO.toast('網路錯誤，無法連線至本機伺服器', 'bad');
        }
      });
    }
  }

  async function openReleaseModal() {
    document.querySelectorAll('.modal-overlay').forEach((el) => el.remove());
    const st = await fetchReleaseStatus();
    renderReleaseModal(st || cachedStatus);
  }

  function initVersionBadge() {
    const btn = document.getElementById('verBadgeBtn');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openReleaseModal();
      });
    }
    updateBadgeUI(cachedStatus);
    fetchReleaseStatus().then(() => {
      if (location.search.includes('releases=1') || location.hash === '#/releases') {
        openReleaseModal();
      }
    });
  }

  GTO.openReleaseModal = openReleaseModal;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVersionBadge);
  } else {
    initVersionBadge();
  }
})();

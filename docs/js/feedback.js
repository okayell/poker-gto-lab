/* GTO 撲克學院 — feedback.js
 * 💬 意見回饋・問題回報・功能許願 (#/feedback)
 */
(function () {
  'use strict';
  const GTO = (window.GTO = window.GTO || {});
  const esc = (s) => GTO.esc(s);
  const LS_KEY = 'gto.feedback.v1';

  function getTargetEmail() {
    const s = (GTO.MONETIZE_CONFIG && GTO.MONETIZE_CONFIG.social) || {};
    return (s.contactEmail || '').trim();
  }

  function getPortalyUrl() {
    const s = (GTO.MONETIZE_CONFIG && GTO.MONETIZE_CONFIG.social) || {};
    return (s.portalyHomeUrl || 'https://portaly.cc/pokergtolab').trim();
  }

  const KINDS = [
    { id: 'feature', label: '✨ 功能許願' },
    { id: 'bug', label: '🐞 問題回報 (Bug)' },
    { id: 'ux', label: '🎨 介面與課程建議' },
    { id: 'other', label: '💬 其他意見' },
  ];

  let itemsCache = null;
  let selKind = 'feature';
  let sending = false;
  let imeActive = false;

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('compositionstart', () => { imeActive = true; });
    document.addEventListener('compositionend', () => { setTimeout(() => { imeActive = false; }, 30); });
  }

  function isEnterSend(ev) {
    return ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing && !imeActive && ev.keyCode !== 229;
  }

  function loadLocal() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch (_) { return []; }
  }
  function saveLocal(items) {
    try { localStorage.setItem(LS_KEY, JSON.stringify((items || []).slice(0, 50))); }
    catch (_) { /* quota */ }
  }

  function buildMailto(kindLabel, title, desc) {
    const email = getTargetEmail();
    if (!email) return '';
    const subject = `[GTO 撲克學院 意見回饋] ${kindLabel} — ${title}`;
    const body = `工具名稱：GTO 撲克學院\n回饋類型：${kindLabel}\n標題：${title}\n\n內容描述：\n${desc}\n`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function renderFallbackBox(kindLabel, title, desc, note) {
    const mailtoUrl = buildMailto(kindLabel, title, desc);
    if (mailtoUrl) {
      return `<div style="background:var(--warn-bg);border:1px solid rgba(201,162,89,0.42);color:var(--warn-fg);padding:10px 13px;border-radius:10px;font-size:13px">${esc(note || '請點擊下方連結寄出：')} <a href="${esc(mailtoUrl)}" style="font-weight:700;text-decoration:underline;color:var(--brass-light)">📩 直接寄信給站長</a></div>`;
    }
    const portalyUrl = getPortalyUrl();
    return `<div style="background:var(--ok-bg);border:1px solid rgba(52,211,153,0.38);color:var(--ok-fg);padding:10px 13px;border-radius:10px;font-size:13px">✅ 已儲存於您的本機紀錄！如需即時聯繫站長或投稿實戰手牌，歡迎前往 <a href="${esc(portalyUrl)}" target="_blank" rel="noopener noreferrer" style="font-weight:700;text-decoration:underline;color:inherit">♠ Poker GTO Lab 傳送門</a>。</div>`;
  }

  async function sendStaticEmail(item) {
    const email = getTargetEmail();
    if (!email) return { sent: false };
    const subject = `[GTO 撲克學院 意見回饋] ${item.kind_label} — ${item.title}`;
    try {
      const resp = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
          工具名稱: 'GTO 撲克學院',
          回饋類型: item.kind_label,
          標題: item.title,
          內容描述: item.description,
          送出時間: item.created_at,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && (data.success === 'true' || data.success === true)) {
        return { sent: true };
      }
    } catch (_) { /* fallback */ }
    return { sent: false };
  }

  function renderFeedbackPage(root) {
    const isLocalBackend = !!(GTO.isLocalServer && GTO.isLocalServer());

    if (itemsCache === null) {
      itemsCache = loadLocal();
      if (isLocalBackend) {
        fetch('api/feedback', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (res && Array.isArray(res.items)) {
              itemsCache = res.items;
              if ((location.hash || '').startsWith('#/feedback')) renderFeedbackPage(root);
            }
          })
          .catch(() => {});
      }
    }

    root.innerHTML = `
      <div class="container" style="max-width:1080px;margin:0 auto;padding:18px 16px 40px">
        <section class="card" style="padding:18px 20px;margin-bottom:16px">
          <h1 style="margin:0 0 6px;font-size:21px;font-weight:800">💬 意見回饋・問題回報・功能許願</h1>
          <p style="margin:0;color:var(--text-2);font-size:14px;line-height:1.6">
            有任何德州撲克 GTO 範圍表建議、想許願的新練習模式或實戰題型、或是遇到介面 Bug，歡迎隨時留言！送出後將自動寄送通知信至站長信箱。
          </p>
        </section>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:16px;align-items:start">
          <form class="card" id="gtoFeedbackForm" style="padding:18px 20px;display:flex;flex-direction:column;gap:14px">
            <div>
              <label style="font-weight:700;font-size:14px;display:block;margin-bottom:8px">1. 回饋類型</label>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${KINDS.map((k) => {
                  const active = selKind === k.id;
                  return `<button type="button" data-gto-fb-kind="${k.id}" style="padding:7px 13px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid ${active ? 'rgba(201,162,89,0.55)' : 'var(--border-strong)'};background:${active ? 'rgba(201,162,89,0.16)' : 'var(--surface-elev)'};color:${active ? '#f0d79c' : 'var(--text-2)'}">${k.label}</button>`;
                }).join('')}
              </div>
            </div>

            <div>
              <label for="gtoFbTitle" style="font-weight:700;font-size:14px;display:block;margin-bottom:6px">2. 標題</label>
              <input id="gtoFbTitle" class="inp" required maxlength="150" placeholder="簡短說明您的許願功能、課程建議或遇到的問題…"
                style="width:100%;box-sizing:border-box;padding:9px 12px;font-size:14px">
            </div>

            <div>
              <label for="gtoFbDesc" style="font-weight:700;font-size:14px;display:block;margin-bottom:6px">3. 內容描述</label>
              <textarea id="gtoFbDesc" class="inp" required rows="6" maxlength="4000" placeholder="請描述詳細建議、希望新增的撲克情境或異常狀況…"
                style="width:100%;box-sizing:border-box;min-height:130px;padding:9px 12px;font-size:14px;resize:vertical"></textarea>
            </div>

            <div id="gtoFbBanner" hidden></div>

            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
              <span style="font-size:12px;color:var(--muted)">📩 送出後會自動通知站長</span>
              <button type="submit" id="gtoFbSubmitBtn" class="btn primary">📨 送出回饋</button>
            </div>
          </form>

          <section class="card" style="padding:18px 20px">
            <h3 style="margin:0 0 12px;font-size:16px;font-weight:800">🗂️ 已送出的回饋紀錄（${(itemsCache || []).length}）</h3>
            <div style="display:flex;flex-direction:column;gap:10px;max-height:520px;overflow-y:auto">
              ${(itemsCache || []).map((it) => `
                <div style="padding:11px 13px;background:var(--surface-sub);border:1px solid var(--border);border-radius:10px;content-visibility:auto;contain-intrinsic-size:auto 84px">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
                    <span style="font-size:12px;font-weight:700;color:var(--ok-fg);background:var(--ok-bg);padding:2px 8px;border-radius:99px">${esc(it.kind_label || it.kind)}</span>
                    <span style="font-size:12px;color:var(--muted)">${esc(it.created_at || '')}</span>
                  </div>
                  <div style="font-weight:700;font-size:14px;color:var(--text)">${esc(it.title)}</div>
                  <div style="font-size:13px;color:var(--text-2);margin-top:4px;white-space:pre-wrap">${esc(it.description)}</div>
                </div>
              `).join('') || '<div style="padding:24px 0;text-align:center;color:var(--muted);font-size:14px">目前尚無回饋紀錄，歡迎留下第一則建議！</div>'}
            </div>
          </section>
        </div>
      </div>
    `;

    const form = root.querySelector('#gtoFeedbackForm');
    if (!form) return;
    const kindBtns = Array.from(form.querySelectorAll('[data-gto-fb-kind]'));
    form.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-gto-fb-kind]');
      if (!btn || !form.contains(btn)) return;
      selKind = btn.getAttribute('data-gto-fb-kind');
      for (let i = 0; i < kindBtns.length; i++) {
        const b = kindBtns[i];
        const act = b === btn;
        b.style.borderColor = act ? '#059669' : '#cbd5e1';
        b.style.background = act ? '#ecfdf5' : '#ffffff';
        b.style.color = act ? '#047857' : '#334155';
      }
    });

    const titleInp = root.querySelector('#gtoFbTitle');
    if (titleInp) {
      titleInp.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && !isEnterSend(ev)) ev.preventDefault();
      });
    }

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (sending) return;
      const title = (root.querySelector('#gtoFbTitle').value || '').trim();
      const description = (root.querySelector('#gtoFbDesc').value || '').trim();
      if (!title || !description) {
        if (GTO.toast) GTO.toast('請填寫標題與內容描述');
        return;
      }
      sending = true;
      const btn = root.querySelector('#gtoFbSubmitBtn');
      if (btn) { btn.disabled = true; btn.textContent = '⏳ 寄送中…'; }
      const kindObj = KINDS.find((k) => k.id === selKind) || KINDS[0];

      try {
        if (isLocalBackend) {
          const resp = await fetch('api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kind: selKind, title, description }),
          });
          const res = await resp.json();
          if (!resp.ok || !res.ok) throw new Error(res.error || '送出失敗');
          itemsCache = res.items || [res.item, ...(itemsCache || [])];
          saveLocal(itemsCache);
          const sentOk = !res.item || res.item.mail_sent !== false;
          if (sentOk && GTO.toast) GTO.toast('✅ 感謝您的回饋！已寄送至站長信箱');
          if (!(location.hash || '').startsWith('#/feedback')) return;
          renderFeedbackPage(root);
          const b2 = root.querySelector('#gtoFbBanner');
          if (b2) {
            b2.hidden = false;
            if (sentOk) {
              b2.style.cssText = 'background:#f0fdf4;border:1px solid #86efac;color:#166534;padding:10px 13px;border-radius:10px;font-size:13px';
              b2.innerHTML = `✅ 已成功收到並寄送通知信給站長！感謝您的寶貴意見。`;
            } else {
              b2.style.cssText = '';
              b2.innerHTML = renderFallbackBox(kindObj.label, title, description, '✅ 回饋已儲存至伺服器紀錄；但自動寄信暫時無法連線，歡迎任選下方一種方式一鍵寄達站長：');
            }
          }
        } else {
          const item = {
            id: 'FB-' + Date.now().toString(36).toUpperCase(),
            kind: selKind,
            kind_label: kindObj.label,
            title,
            description,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };
          const mailRes = await sendStaticEmail(item);
          itemsCache = [item, ...(itemsCache || [])];
          saveLocal(itemsCache);
          if (!(location.hash || '').startsWith('#/feedback')) return;
          renderFeedbackPage(root);
          const b2 = root.querySelector('#gtoFbBanner');
          if (b2) {
            b2.hidden = false;
            if (mailRes.sent) {
              b2.style.cssText = 'background:#f0fdf4;border:1px solid #86efac;color:#166534;padding:10px 13px;border-radius:10px;font-size:13px';
              b2.innerHTML = `✅ 感謝回饋！意見已成功寄送給站長。`;
            } else {
              b2.style.cssText = '';
              b2.innerHTML = renderFallbackBox(kindObj.label, title, description);
            }
          }
        }
      } catch (e) {
        const b2 = root.querySelector('#gtoFbBanner');
        if (b2) {
          b2.hidden = false;
          b2.style.cssText = '';
          b2.innerHTML = renderFallbackBox(kindObj.label, title, description, `⚠️ 自動寄信暫時無法連線（${e.message || '連線忙碌'}），請任選下方一種方式一鍵寄達站長：`);
        }
      } finally {
        sending = false;
        if (btn) { btn.disabled = false; btn.textContent = '📨 送出回饋'; }
      }
    });
  }

  GTO.renderFeedbackPage = renderFeedbackPage;
})();

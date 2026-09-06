/**
 * RehearsalIQ - Live In-Page Edit & Commenting Suite
 * Allows direct in-browser text editing, dropping comment pins on components,
 * and exporting all edits/notes formatted for Antigravity pair programming.
 */

(function () {
  const STORAGE_EDITS_KEY = 'rehearsaliq_user_edits';
  const STORAGE_COMMENTS_KEY = 'rehearsaliq_user_comments';

  let isEditMode = false;
  let isDroppingPin = false;
  let liveEdits = JSON.parse(localStorage.getItem(STORAGE_EDITS_KEY) || '{}');
  let commentPins = JSON.parse(localStorage.getItem(STORAGE_COMMENTS_KEY) || '[]');

  // Helper to generate unique CSS selector for an element
  function getUniqueSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    if (el.id) return '#' + el.id;
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector = '#' + el.id;
        path.unshift(selector);
        break;
      } else {
        let sibling = el;
        let nth = 1;
        while (sibling = sibling.previousElementSibling) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      el = el.parentNode;
    }
    return path.join(' > ');
  }

  // Inject UI Styles for Edit Mode
  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'live-edit-mode-styles';
    style.textContent = `
      /* Live Edit Mode Visual Cues */
      body.live-edit-active [data-live-editable="true"]:hover {
        outline: 2px dashed #0284c7 !important;
        outline-offset: 2px !important;
        background-color: rgba(2, 132, 199, 0.08) !important;
        cursor: text !important;
        border-radius: 4px !important;
      }

      body.live-edit-active [data-live-editable="true"]:focus {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
        background-color: rgba(37, 99, 235, 0.12) !important;
      }

      /* Dropping Comment Pin Crosshair */
      body.dropping-pin-active, body.dropping-pin-active * {
        cursor: crosshair !important;
      }

      /* Visual Comment Pins */
      .live-comment-pin-marker {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #dc2626;
        color: #ffffff;
        font-size: 0.7rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.5);
        z-index: 999;
        cursor: pointer;
        user-select: none;
        transition: transform 0.15s ease;
      }

      .live-comment-pin-marker:hover {
        transform: scale(1.2);
      }

      /* Floating Edit Mode Bar */
      .live-edit-toolbar {
        position: fixed;
        top: 60px;
        right: 16px;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(56, 189, 248, 0.4);
        border-radius: 30px;
        padding: 6px 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        z-index: 9990;
        color: #ffffff;
        font-size: 0.8rem;
        animation: fadeIn 0.2s ease;
      }

      @media (max-width: 600px) {
        .live-edit-toolbar {
          top: auto;
          bottom: 74px;
          left: 12px;
          right: 12px;
          border-radius: 12px;
          justify-content: space-between;
          padding: 8px 12px;
        }
      }

      /* Live Edit Drawer */
      .live-edit-drawer-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        z-index: 9995;
        display: flex;
        justify-content: flex-end;
      }

      .live-edit-drawer {
        width: 100%;
        max-width: 440px;
        height: 100%;
        background: #0f172a;
        color: #f8fafc;
        display: flex;
        flex-direction: column;
        border-left: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.4);
      }

      .live-edit-drawer-header {
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .live-edit-drawer-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .live-edit-card {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
        font-size: 0.82rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Apply stored edits on page load
  function applyStoredEdits() {
    Object.keys(liveEdits).forEach(selector => {
      try {
        const el = document.querySelector(selector);
        if (el && liveEdits[selector].newText) {
          el.innerText = liveEdits[selector].newText;
        }
      } catch (e) {}
    });
  }

  // Render comment pin badges on elements
  function renderCommentPins() {
    document.querySelectorAll('.live-comment-pin-marker').forEach(m => m.remove());
    commentPins.forEach((pin, index) => {
      try {
        const el = document.querySelector(pin.selector);
        if (el) {
          if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
          }
          const marker = document.createElement('div');
          marker.className = 'live-comment-pin-marker';
          marker.textContent = index + 1;
          marker.title = `Comment #${index + 1}: ${pin.comment}`;
          marker.onclick = (e) => {
            e.stopPropagation();
            openDrawer();
          };
          el.appendChild(marker);
        }
      } catch (e) {}
    });
  }

  // Enable contentEditable on text elements
  function makeElementsEditable() {
    const textElements = document.querySelectorAll(`
      #appContent h1, #appContent h2, #appContent h3,
      #appContent p, #appContent .label, #appContent .value,
      #appContent .badge, #appContent .eyebrow, #appContent strong,
      #appContent span:not(.live-comment-pin-marker):not(.badge)
    `);

    textElements.forEach(el => {
      if (el.closest('.live-edit-toolbar') || el.closest('#liveEditDrawer')) return;
      el.setAttribute('data-live-editable', 'true');
      el.setAttribute('contenteditable', 'true');

      // Record original text if not already stored
      const selector = getUniqueSelector(el);
      if (!liveEdits[selector]) {
        el.setAttribute('data-original-text', el.innerText.trim());
      }

      el.onblur = () => {
        const originalText = el.getAttribute('data-original-text') || el.innerText.trim();
        const currentText = el.innerText.trim();
        if (currentText !== originalText) {
          liveEdits[selector] = {
            selector,
            elementName: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
            originalText,
            newText: currentText,
            timestamp: new Date().toLocaleTimeString()
          };
          localStorage.setItem(STORAGE_EDITS_KEY, JSON.stringify(liveEdits));
          updateToolbarCount();
        }
      };
    });
  }

  // Disable contentEditable
  function removeEditable() {
    document.querySelectorAll('[data-live-editable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-live-editable');
    });
  }

  // Toggle Edit Mode ON / OFF
  function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('live-edit-active', isEditMode);

    let toolbar = document.getElementById('liveEditToolbar');
    if (isEditMode) {
      makeElementsEditable();
      if (!toolbar) {
        toolbar = createToolbar();
        document.body.appendChild(toolbar);
      }
      toolbar.style.display = 'flex';
      updateToolbarCount();
    } else {
      removeEditable();
      if (toolbar) toolbar.style.display = 'none';
      if (isDroppingPin) cancelPinMode();
    }
  }

  // Create Floating Toolbar
  function createToolbar() {
    const bar = document.createElement('div');
    bar.id = 'liveEditToolbar';
    bar.className = 'live-edit-toolbar';
    bar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e;"></span>
        <strong style="color: #38bdf8;">Live Edit Active</strong>
      </div>
      <button type="button" id="btnDropPin" class="btn btn-xs btn-outline" style="color: #fbbf24; border-color: rgba(251, 191, 36, 0.4);">
        💬 Add Comment Pin
      </button>
      <button type="button" id="btnOpenEditsDrawer" class="btn btn-xs btn-primary" style="padding: 3px 8px;">
        📋 Changes (<span id="liveEditsCountBadge">0</span>)
      </button>
      <button type="button" id="btnCloseEditMode" class="btn btn-xs btn-outline text-red" style="padding: 2px 6px;">
        ✕ Exit
      </button>
    `;

    bar.querySelector('#btnDropPin').onclick = startPinMode;
    bar.querySelector('#btnOpenEditsDrawer').onclick = openDrawer;
    bar.querySelector('#btnCloseEditMode').onclick = toggleEditMode;

    return bar;
  }

  function updateToolbarCount() {
    const editCount = Object.keys(liveEdits).length;
    const commentCount = commentPins.length;
    const total = editCount + commentCount;
    const badge = document.getElementById('liveEditsCountBadge');
    if (badge) badge.textContent = total;
  }

  // Start Drop Pin Mode
  function startPinMode() {
    isDroppingPin = true;
    document.body.classList.add('dropping-pin-active');
    const pinBtn = document.getElementById('btnDropPin');
    if (pinBtn) pinBtn.textContent = '👆 Click any element...';

    const clickHandler = (e) => {
      if (e.target.closest('#liveEditToolbar') || e.target.closest('#liveEditDrawer')) return;
      e.preventDefault();
      e.stopPropagation();

      const targetEl = e.target;
      const selector = getUniqueSelector(targetEl);
      const textPreview = targetEl.innerText ? targetEl.innerText.substring(0, 40).replace(/\n/g, ' ') : targetEl.tagName;

      const userNote = prompt(`Comment / requested change for "${textPreview}":`);
      if (userNote && userNote.trim()) {
        commentPins.push({
          id: 'pin-' + Date.now(),
          selector,
          preview: textPreview,
          comment: userNote.trim(),
          timestamp: new Date().toLocaleTimeString()
        });
        localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(commentPins));
        renderCommentPins();
        updateToolbarCount();
        openDrawer();
      }

      cancelPinMode();
      document.removeEventListener('click', clickHandler, true);
    };

    setTimeout(() => {
      document.addEventListener('click', clickHandler, true);
    }, 100);
  }

  function cancelPinMode() {
    isDroppingPin = false;
    document.body.classList.remove('dropping-pin-active');
    const pinBtn = document.getElementById('btnDropPin');
    if (pinBtn) pinBtn.textContent = '💬 Add Comment Pin';
  }

  // Changes & Feedback Drawer
  function openDrawer() {
    let overlay = document.getElementById('liveEditDrawer');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'liveEditDrawer';
      overlay.className = 'live-edit-drawer-overlay';
      overlay.innerHTML = `
        <div class="live-edit-drawer">
          <div class="live-edit-drawer-header">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #38bdf8; margin: 0;">Your Live Page Edits & Notes</h3>
              <p class="xs muted" style="margin-top: 2px;">Copy these changes directly to paste for Antigravity</p>
            </div>
            <button type="button" class="btn btn-xs btn-outline" id="btnCloseDrawer">✕</button>
          </div>
          <div class="live-edit-drawer-body" id="liveEditDrawerList"></div>
          <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 8px;">
            <button type="button" id="btnCopyForAgent" class="btn btn-primary w-full" style="justify-content: center; font-weight: 600;">
              📋 Copy All Changes for Antigravity
            </button>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btnClearEdits" class="btn btn-xs btn-outline text-red" style="flex: 1; justify-content: center;">
                Clear All Edits
              </button>
              <button type="button" id="btnResetPage" class="btn btn-xs btn-outline" style="flex: 1; justify-content: center;">
                Reset Default Text
              </button>
            </div>
          </div>
        </div>
      `;

      overlay.querySelector('#btnCloseDrawer').onclick = () => overlay.remove();
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

      overlay.querySelector('#btnCopyForAgent').onclick = copyEditsForAgent;
      overlay.querySelector('#btnClearEdits').onclick = () => {
        if (confirm('Clear all recorded edits and comment pins?')) {
          liveEdits = {};
          commentPins = [];
          localStorage.removeItem(STORAGE_EDITS_KEY);
          localStorage.removeItem(STORAGE_COMMENTS_KEY);
          renderCommentPins();
          updateToolbarCount();
          renderDrawerBody();
        }
      };
      overlay.querySelector('#btnResetPage').onclick = () => {
        if (confirm('Reset page to original code text and reload?')) {
          localStorage.removeItem(STORAGE_EDITS_KEY);
          localStorage.removeItem(STORAGE_COMMENTS_KEY);
          window.location.reload();
        }
      };

      document.body.appendChild(overlay);
    }

    renderDrawerBody();
  }

  function renderDrawerBody() {
    const list = document.getElementById('liveEditDrawerList');
    if (!list) return;

    const editEntries = Object.values(liveEdits);
    if (editEntries.length === 0 && commentPins.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 32px 16px;">
          <div style="font-size: 2rem; margin-bottom: 8px;">✏️</div>
          <p>No edits or comments recorded yet.</p>
          <p class="xs" style="margin-top: 6px;">Click on any text on the page to edit it directly, or click <strong>"Add Comment Pin"</strong> to leave a note on any element.</p>
        </div>
      `;
      return;
    }

    let html = '';

    if (editEntries.length > 0) {
      html += `<div style="font-weight: 700; font-size: 0.85rem; color: #38bdf8; margin-bottom: 8px;">Direct Text Edits (${editEntries.length}):</div>`;
      editEntries.forEach(item => {
        html += `
          <div class="live-edit-card">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.72rem; margin-bottom: 4px;">
              <span><code>${item.selector}</code></span>
              <span>${item.timestamp}</span>
            </div>
            <div style="text-decoration: line-through; color: #f87171; font-size: 0.8rem;">"${escapeHtml(item.originalText)}"</div>
            <div style="color: #4ade80; font-weight: 600; font-size: 0.82rem; margin-top: 2px;">↳ "${escapeHtml(item.newText)}"</div>
          </div>
        `;
      });
    }

    if (commentPins.length > 0) {
      html += `<div style="font-weight: 700; font-size: 0.85rem; color: #fbbf24; margin: 16px 0 8px 0;">Comment Pins (${commentPins.length}):</div>`;
      commentPins.forEach((pin, idx) => {
        html += `
          <div class="live-edit-card" style="border-left: 3px solid #fbbf24;">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.72rem; margin-bottom: 4px;">
              <span><strong>Pin #${idx + 1}</strong> on <code>${pin.selector}</code></span>
              <span>${pin.timestamp}</span>
            </div>
            <div style="color: #cbd5e1; margin-top: 2px;">💬 "${escapeHtml(pin.comment)}"</div>
          </div>
        `;
      });
    }

    list.innerHTML = html;
  }

  // Copy formatted markdown to clipboard
  function copyEditsForAgent() {
    const editEntries = Object.values(liveEdits);
    if (editEntries.length === 0 && commentPins.length === 0) {
      alert('No edits or comments recorded to copy.');
      return;
    }

    let report = `Please implement the following changes I made on the page:\n\n`;

    if (editEntries.length > 0) {
      report += `### Inline Text Changes:\n`;
      editEntries.forEach((e, i) => {
        report += `${i + 1}. **${e.selector}**:\n   - Original: "${e.originalText}"\n   - Changed to: "${e.newText}"\n\n`;
      });
    }

    if (commentPins.length > 0) {
      report += `### Requested Changes & Comments:\n`;
      commentPins.forEach((c, i) => {
        report += `${i + 1}. **Pin on \`${c.selector}\`** (Target: "${c.preview}"):\n   - Note: "${c.comment}"\n\n`;
      });
    }

    navigator.clipboard.writeText(report).then(() => {
      const btn = document.getElementById('btnCopyForAgent');
      if (btn) {
        const oldText = btn.innerHTML;
        btn.innerHTML = '✅ Copied to Clipboard!';
        setTimeout(() => { btn.innerHTML = oldText; }, 2000);
      }
      alert('All edits and comments copied to clipboard!\nYou can now paste them directly into our Antigravity chat.');
    }).catch(err => {
      prompt('Copy your changes below:', report);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initialization
  function init() {
    injectStyles();
    applyStoredEdits();
    renderCommentPins();

    // Re-apply whenever URL / tab changes
    window.addEventListener('hashchange', () => {
      setTimeout(applyStoredEdits, 200);
    });

    // Expose global controller
    window.LiveEdit = {
      toggle: toggleEditMode,
      openDrawer: openDrawer,
      copyEdits: copyEditsForAgent,
      clearEdits: () => {
        liveEdits = {};
        commentPins = [];
        localStorage.removeItem(STORAGE_EDITS_KEY);
        localStorage.removeItem(STORAGE_COMMENTS_KEY);
        renderCommentPins();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

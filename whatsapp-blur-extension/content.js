// WhatsApp Web Blur - Content Script

const STORAGE_KEY = 'wa_blur_settings';

const defaults = {
  enabled: false,
  blurAmount: 3,
  hoverReveal: true,
  blurSidebar: false,
  blurHeader: false,
  blurAvatars: false,
  blurNotifications: true,
  screenshotWarningShown: false,
};

let settings = { ...defaults };

// ── Style injection ───────────────────────────────────────────────────────────

const styleEl = document.createElement('style');
styleEl.id = 'wa-blur-styles';
(document.head || document.documentElement).appendChild(styleEl);

function buildCSS() {
  if (!settings.enabled) {
    styleEl.textContent = '';
    return;
  }

  const b = `${settings.blurAmount}px`;
  const rules = [];

  rules.push(`
    div[role="row"] {
      filter: blur(${b});
      transition: filter 0.15s ease;
    }
    ${settings.hoverReveal ? `div[role="row"]:hover { filter: none !important; }` : ''}

    .x1iyjqo2._ao3e,
    .x1iyjqo2._ap1_ {
      filter: blur(${b});
      transition: filter 0.15s ease;
    }
    ${settings.hoverReveal ? `
    .x1iyjqo2._ao3e:hover,
    .x1iyjqo2._ap1_:hover { filter: none !important; }
    ` : ''}
  `);

  if (settings.blurSidebar) {
    rules.push(`
      ._ak8q, ._ak8j, ._ak8k {
        filter: blur(5px);
        transition: filter 0.15s ease;
      }
      ._ak8o:hover ._ak8q,
      ._ak8o:hover ._ak8j,
      ._ak8o:hover ._ak8k {
        filter: none !important;
      }
    `);
  }

  if (settings.blurHeader) {
    rules.push(`
      header ._ak8q,
      header span[dir="auto"],
      header .x1iyjqo2 {
        filter: blur(5px);
        transition: filter 0.15s ease;
      }
      header:hover ._ak8q,
      header:hover span[dir="auto"],
      header:hover .x1iyjqo2 {
        filter: none !important;
      }
    `);
  }

  if (settings.blurAvatars) {
    rules.push(`
      img[src*="blob:"],
      img[src*="pps.whatsapp"],
      img[src*="media"] {
        filter: blur(8px);
        transition: filter 0.15s ease;
        border-radius: 50%;
      }
      ._ak8o:hover img[src*="blob:"],
      ._ak8o:hover img[src*="pps.whatsapp"],
      header:hover img {
        filter: none !important;
      }
    `);
  }

  styleEl.textContent = rules.join('\n');
}

function applySettings() {
  buildCSS();
  syncNotificationBlur();
}

// ── Notification blur ─────────────────────────────────────────────────────────
// inject.js runs in MAIN world and patches window.Notification.
// We communicate the enabled state via a CustomEvent.

function syncNotificationBlur() {
  window.dispatchEvent(new CustomEvent('__waBluNotifSync', {
    detail: { enabled: !!settings.blurNotifications }
  }));
}

// ── Screenshot warning ────────────────────────────────────────────────────────

function showScreenshotWarning() {
  if (document.getElementById('wa-blur-warning')) return;

  const banner = document.createElement('div');
  banner.id = 'wa-blur-warning';
  Object.assign(banner.style, {
    position: 'fixed',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(24,24,24,0.97)',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, sans-serif',
    fontSize: '13px',
    zIndex: '999999',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: '380px',
    lineHeight: '1.5',
    cursor: 'pointer',
    opacity: '0',
    transition: 'opacity 0.3s ease',
  });

  banner.innerHTML = `
    <span style="font-size:20px;flex-shrink:0">⚠️</span>
    <span><strong style="color:#ffcc00">Blur doesn't stop screen recording.</strong><br>Anyone recording your screen can still see your messages.</span>
    <span style="margin-left:6px;opacity:0.4;font-size:15px;flex-shrink:0">✕</span>
  `;

  const dismiss = () => {
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 300);
    settings.screenshotWarningShown = true;
    chrome.storage.sync.set({ [STORAGE_KEY]: { ...settings } });
  };

  banner.addEventListener('click', dismiss);
  document.body.appendChild(banner);
  requestAnimationFrame(() => { banner.style.opacity = '1'; });
  setTimeout(dismiss, 8000);
}

// ── Init ──────────────────────────────────────────────────────────────────────

chrome.storage.sync.get(STORAGE_KEY, (data) => {
  if (data[STORAGE_KEY]) settings = { ...defaults, ...data[STORAGE_KEY] };
  applySettings();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY]) {
    const wasEnabled = settings.enabled;
    settings = { ...defaults, ...changes[STORAGE_KEY].newValue };
    if (!wasEnabled && settings.enabled && !settings.screenshotWarningShown) {
      showScreenshotWarning();
    }
    applySettings();
  }
});

// ── Keyboard shortcut: Alt+B ──────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 'b') {
    settings.enabled = !settings.enabled;
    chrome.storage.sync.set({ [STORAGE_KEY]: { ...settings } });
    if (settings.enabled && !settings.screenshotWarningShown) showScreenshotWarning();
    applySettings();
    showToast(settings.enabled ? '🔒 Blur ON' : '👁 Blur OFF');
  }
});

// ── Toast ─────────────────────────────────────────────────────────────────────

let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('wa-blur-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wa-blur-toast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(18,18,18,0.92)', color: '#fff',
      padding: '10px 20px', borderRadius: '24px',
      fontFamily: 'Segoe UI, sans-serif', fontSize: '13px',
      zIndex: '999999', pointerEvents: 'none',
      transition: 'opacity 0.3s ease',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      opacity: '0',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

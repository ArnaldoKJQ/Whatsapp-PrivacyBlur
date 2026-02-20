// inject.js - runs in MAIN world (page context)
// Intercepts the Notification API to blur message content

(function() {
  if (window.__waBluNotifPatched) return;
  window.__waBluNotifPatched = true;
  window.__waBluNotif = false;

  const OriginalNotification = window.Notification;

  function BlurNotification(title, options = {}) {
    if (window.__waBluNotif) {
      title = 'WhatsApp';
      options = { ...options, body: '🔒 New message' };
    }
    return new OriginalNotification(title, options);
  }

  BlurNotification.prototype = OriginalNotification.prototype;

  Object.defineProperty(BlurNotification, 'permission', {
    get: () => OriginalNotification.permission
  });

  BlurNotification.requestPermission = OriginalNotification.requestPermission.bind(OriginalNotification);
  window.Notification = BlurNotification;

  // Listen for setting updates from content script via custom event
  window.addEventListener('__waBluNotifSync', (e) => {
    window.__waBluNotif = e.detail.enabled;
  });
})();

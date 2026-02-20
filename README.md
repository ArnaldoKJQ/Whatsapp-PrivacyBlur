# WhatsApp Web Blur 🔒

A Chrome extension that blurs WhatsApp Web conversations for privacy — so you can use WhatsApp in public without exposing your messages to people around you.

---

## Installation

1. Download and unzip `whatsapp-blur-extension.zip`
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the `whatsapp-blur-extension` folder
5. Open [web.whatsapp.com](https://web.whatsapp.com) — the extension is ready

---

## Features

| Feature | Description |
|---|---|
| **Blur Messages** | Blurs all message bubbles in the open conversation |
| **Blur Intensity** | Adjustable slider from 2px to 20px |
| **Reveal on Hover** | Mouse over a message to temporarily unblur it |
| **Blur Chat List** | Hides chat names and message previews in the sidebar |
| **Blur Contact Name** | Hides the name in the conversation header |
| **Blur Profile Photos** | Blurs avatar images across the app |
| **Blur Notifications** | Replaces OS notification content with "🔒 New message" |
| **Screenshot Warning** | One-time reminder that blur doesn't protect against screen recording |
| **Keyboard Shortcut** | `Alt + B` to instantly toggle blur without opening the popup |

---

## Usage

- Click the extension icon in the Chrome toolbar to open the popup
- Toggle **Blur Messages** to enable/disable globally
- Use `Alt + B` as a quick panic shortcut when someone approaches
- Enable **Blur Notifications** to prevent message previews from appearing in OS alerts even when blur is off

---

## File Structure

```
whatsapp-blur-extension/
├── manifest.json       # Extension config (Manifest V3)
├── content.js          # Main script injected into WhatsApp Web
├── inject.js           # Runs in page context to intercept Notification API
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic and settings management
├── blur.css            # Static styles loaded by content script
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Privacy

This extension operates entirely locally on your machine. It does not collect, transmit, or store any message content, chat names, or personal data. All settings are stored in Chrome's local sync storage (`chrome.storage.sync`) and never leave your browser.

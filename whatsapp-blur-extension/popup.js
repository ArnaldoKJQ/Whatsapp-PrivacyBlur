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

const elements = {
  mainToggle: document.getElementById('mainToggle'),
  mainToggleArea: document.getElementById('mainToggleArea'),
  blurRange: document.getElementById('blurRange'),
  blurVal: document.getElementById('blurVal'),
  hoverReveal: document.getElementById('hoverReveal'),
  blurSidebar: document.getElementById('blurSidebar'),
  blurHeader: document.getElementById('blurHeader'),
  blurAvatars: document.getElementById('blurAvatars'),
  blurNotifications: document.getElementById('blurNotifications'),
  statusDot: document.getElementById('statusDot'),
};

let settings = { ...defaults };

function updateUI() {
  elements.mainToggle.checked = settings.enabled;
  elements.blurRange.value = settings.blurAmount;
  elements.blurVal.textContent = `${settings.blurAmount}px`;
  elements.hoverReveal.checked = settings.hoverReveal;
  elements.blurSidebar.checked = settings.blurSidebar;
  elements.blurHeader.checked = settings.blurHeader;
  elements.blurAvatars.checked = settings.blurAvatars;
  elements.blurNotifications.checked = settings.blurNotifications !== false;
  elements.statusDot.classList.toggle('active', settings.enabled);
}

function save() {
  chrome.storage.sync.set({ [STORAGE_KEY]: { ...settings } });
}

// Load
chrome.storage.sync.get(STORAGE_KEY, (data) => {
  if (data[STORAGE_KEY]) settings = { ...defaults, ...data[STORAGE_KEY] };
  updateUI();
});

// Main toggle
elements.mainToggleArea.addEventListener('click', (e) => {
  if (e.target === elements.mainToggle || e.target.closest('label')) return;
  elements.mainToggle.checked = !elements.mainToggle.checked;
  settings.enabled = elements.mainToggle.checked;
  updateUI();
  save();
});

elements.mainToggle.addEventListener('change', () => {
  settings.enabled = elements.mainToggle.checked;
  updateUI();
  save();
});

elements.blurRange.addEventListener('input', () => {
  settings.blurAmount = parseInt(elements.blurRange.value);
  elements.blurVal.textContent = `${settings.blurAmount}px`;
  save();
});

elements.hoverReveal.addEventListener('change', () => {
  settings.hoverReveal = elements.hoverReveal.checked;
  save();
});

elements.blurSidebar.addEventListener('change', () => {
  settings.blurSidebar = elements.blurSidebar.checked;
  save();
});

elements.blurHeader.addEventListener('change', () => {
  settings.blurHeader = elements.blurHeader.checked;
  save();
});

elements.blurAvatars.addEventListener('change', () => {
  settings.blurAvatars = elements.blurAvatars.checked;
  save();
});

elements.blurNotifications.addEventListener('change', () => {
  settings.blurNotifications = elements.blurNotifications.checked;
  save();
});

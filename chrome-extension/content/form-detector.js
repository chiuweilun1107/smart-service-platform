/**
 * 智慧服務平台 AI 填表助手 — Form Detector
 * 偵測頁面上的表單欄位，通知 background service worker
 */
(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // Form field selectors for SSP pages
  // ────────────────────────────────────────────────────────────
  const FORM_SELECTORS = [
    'input[type="text"]',
    'input[type="tel"]',
    'input[type="email"]',
    'input[type="number"]',
    'textarea',
    'select'
  ];

  // SSP-specific selectors (React controlled components)
  const SSP_SELECTORS = [
    'input[name="reporterName"]',
    'input[name="contactName"]',
    'input[name="phone"]',
    'input[name="email"]',
    'input[name="address"]',
    'input[name="location"]',
    'input[name="region"]',
    'textarea[name="description"]',
    'select[name="category"]',
    'select[name="region"]'
  ];

  let detectedFields = [];
  let isFormPage = false;

  // ────────────────────────────────────────────────────────────
  // Detect form fields on the page
  // ────────────────────────────────────────────────────────────
  function detectFormFields() {
    const allSelectors = FORM_SELECTORS.join(', ');
    const elements = document.querySelectorAll(allSelectors);
    const fields = [];

    elements.forEach(function (el) {
      // Skip hidden elements
      if (el.offsetParent === null && el.type !== 'hidden') return;
      // Skip elements inside navbars, footers etc.
      if (el.closest('nav, footer, header')) return;

      const field = {
        tagName: el.tagName.toLowerCase(),
        type: el.type || '',
        name: el.name || '',
        id: el.id || '',
        placeholder: el.placeholder || '',
        className: el.className || '',
        value: el.value || ''
      };

      // Try to find label
      let label = '';
      if (el.id) {
        const labelEl = document.querySelector('label[for="' + el.id + '"]');
        if (labelEl) label = labelEl.textContent.trim();
      }
      if (!label) {
        // Look for preceding label or text content
        const parent = el.closest('.space-y-3, .form-field, .form-group, [class*="field"]');
        if (parent) {
          const labelEl = parent.querySelector('label, [class*="label"], [class*="Label"]');
          if (labelEl) label = labelEl.textContent.trim();
        }
      }
      field.label = label;

      fields.push(field);
    });

    return fields;
  }

  // ────────────────────────────────────────────────────────────
  // Check if current page is an SSP form page
  // ────────────────────────────────────────────────────────────
  function isSSPFormPage() {
    const path = window.location.pathname;
    return (
      path.includes('/report') ||
      path.includes('/smart-guide') ||
      path.includes('/smart-service-platform') ||
      path.includes('/form')
    );
  }

  // ────────────────────────────────────────────────────────────
  // Main detection routine
  // ────────────────────────────────────────────────────────────
  function runDetection() {
    const fields = detectFormFields();
    const onFormPage = isSSPFormPage() || fields.length >= 2;

    if (onFormPage && fields.length > 0) {
      isFormPage = true;
      detectedFields = fields;

      chrome.runtime.sendMessage({
        type: 'form-detected',
        fields: fields,
        url: window.location.href,
        title: document.title
      });
    } else {
      isFormPage = false;
      detectedFields = [];

      chrome.runtime.sendMessage({
        type: 'form-not-detected',
        url: window.location.href
      });
    }
  }

  // ────────────────────────────────────────────────────────────
  // Listen for queries from background
  // ────────────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'query-form-fields') {
      const fields = detectFormFields();
      sendResponse({
        hasForm: fields.length > 0,
        fields: fields,
        url: window.location.href
      });
      return true;
    }
  });

  // ────────────────────────────────────────────────────────────
  // Run on load + observe DOM changes (for SPA)
  // ────────────────────────────────────────────────────────────
  // Initial detection (delayed to allow React to render)
  setTimeout(runDetection, 1000);

  // Re-detect on DOM changes (SPA navigation)
  let debounceTimer = null;
  const observer = new MutationObserver(function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runDetection, 800);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Re-detect on URL change (SPA routing)
  let lastUrl = window.location.href;
  setInterval(function () {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      setTimeout(runDetection, 1000);
    }
  }, 500);

})();

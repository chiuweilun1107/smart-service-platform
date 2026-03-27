/**
 * 智慧服務平台 AI 填表助手 — Form Filler
 * 接收填表指令，使用 React 相容方式填入表單欄位
 * 包含打字動畫與高亮效果
 */
(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // React-compatible value setter
  // Handles React controlled components by using the native setter
  // and dispatching proper events
  // ────────────────────────────────────────────────────────────
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype, 'value'
  ).set;

  const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype, 'value'
  ).set;

  const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype, 'value'
  ).set;

  /**
   * Set value on an input/textarea/select with React compatibility
   */
  function setReactValue(element, value) {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'select') {
      nativeSelectValueSetter.call(element, value);
    } else if (tagName === 'textarea') {
      nativeTextareaValueSetter.call(element, value);
    } else {
      nativeInputValueSetter.call(element, value);
    }

    // Dispatch events that React listens for
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));

    // Also try React's synthetic event system
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue('');
    }

    element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ────────────────────────────────────────────────────────────
  // Typing animation — simulates character-by-character input
  // ────────────────────────────────────────────────────────────
  function typeWithAnimation(element, value) {
    return new Promise(function (resolve) {
      const tagName = element.tagName.toLowerCase();
      if (tagName === 'select') {
        // For select elements, just set the value directly
        setReactValue(element, value);
        flashHighlight(element);
        resolve();
        return;
      }

      // Focus the element first
      element.focus();

      const chars = value.split('');
      let current = '';
      let index = 0;

      function typeChar() {
        if (index < chars.length) {
          current += chars[index];

          // Use the appropriate native setter
          if (tagName === 'textarea') {
            nativeTextareaValueSetter.call(element, current);
          } else {
            nativeInputValueSetter.call(element, current);
          }

          // Fire events
          element.dispatchEvent(new Event('input', { bubbles: true }));

          index++;

          // Variable speed: faster for longer texts
          const baseSpeed = value.length > 50 ? 15 : 30;
          const speed = baseSpeed + Math.random() * 20;
          setTimeout(typeChar, speed);
        } else {
          // Final change event
          element.dispatchEvent(new Event('change', { bubbles: true }));

          // Handle React value tracker
          const tracker = element._valueTracker;
          if (tracker) {
            tracker.setValue('');
          }
          element.dispatchEvent(new Event('input', { bubbles: true }));

          element.blur();
          flashHighlight(element);
          resolve();
        }
      }

      typeChar();
    });
  }

  // ────────────────────────────────────────────────────────────
  // Green highlight flash after filling
  // ────────────────────────────────────────────────────────────
  function flashHighlight(element) {
    const originalBorder = element.style.border;
    const originalBoxShadow = element.style.boxShadow;
    const originalTransition = element.style.transition;

    element.style.transition = 'border-color 0.3s, box-shadow 0.3s';
    element.style.border = '2px solid #10b981';
    element.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';

    setTimeout(function () {
      element.style.transition = 'border-color 0.6s, box-shadow 0.6s';
      element.style.border = originalBorder || '';
      element.style.boxShadow = originalBoxShadow || '';

      setTimeout(function () {
        element.style.transition = originalTransition || '';
      }, 600);
    }, 1200);
  }

  // ────────────────────────────────────────────────────────────
  // Find form element by various strategies
  // ────────────────────────────────────────────────────────────
  function findElement(fieldId, formData) {
    // Strategy 1: by name attribute
    let el = document.querySelector(
      'input[name="' + fieldId + '"], ' +
      'textarea[name="' + fieldId + '"], ' +
      'select[name="' + fieldId + '"]'
    );
    if (el) return el;

    // Strategy 2: by id
    el = document.getElementById(fieldId);
    if (el) return el;

    // Strategy 3: by placeholder text mapping
    const placeholderMap = {
      reporterName: ['姓名', '通報人'],
      contactName: ['姓名', '聯絡人'],
      phone: ['電話', '手機'],
      email: ['email', 'mail', '信箱'],
      location: ['地點', '地址'],
      address: ['地址', '地點'],
      description: ['描述', '說明', '狀況', '情況']
    };

    const hints = placeholderMap[fieldId];
    if (hints) {
      for (const hint of hints) {
        el = document.querySelector(
          'input[placeholder*="' + hint + '"], ' +
          'textarea[placeholder*="' + hint + '"]'
        );
        if (el) return el;
      }
    }

    // Strategy 4: by label text
    const labelMap = {
      reporterName: ['通報人姓名', '姓名', '聯絡人姓名'],
      contactName: ['聯絡人姓名', '姓名'],
      phone: ['聯絡電話', '手機', '電話'],
      email: ['電子郵件', 'Email', 'E-Mail'],
      location: ['事件地點', '地點', '地址'],
      address: ['精確地址', '地址'],
      description: ['具體情況描述', '問題描述', '描述'],
      category: ['通報類型', '類型', '類別'],
      region: ['通報區域', '區域']
    };

    const labels = labelMap[fieldId];
    if (labels) {
      for (const labelText of labels) {
        // Find label containing the text
        const allLabels = document.querySelectorAll('label, [class*="label"], [class*="Label"]');
        for (const label of allLabels) {
          if (label.textContent.trim().includes(labelText)) {
            // Find the nearest input/textarea/select
            const parent = label.closest('.space-y-3, .form-field, .form-group, [class*="field"]') ||
              label.parentElement;
            if (parent) {
              el = parent.querySelector('input, textarea, select');
              if (el) return el;
            }
          }
        }
      }
    }

    // Strategy 5: generic fallback for description → first textarea
    if (fieldId === 'description') {
      el = document.querySelector('textarea');
      if (el) return el;
    }

    // Strategy 6: generic fallback for category → first select
    if (fieldId === 'category' || fieldId === 'region') {
      const selects = document.querySelectorAll('select');
      if (fieldId === 'region' && selects.length > 0) return selects[0];
      if (fieldId === 'category' && selects.length > 1) return selects[1];
      if (fieldId === 'category' && selects.length > 0) return selects[0];
    }

    return null;
  }

  // ────────────────────────────────────────────────────────────
  // Fill all fields with animation
  // ────────────────────────────────────────────────────────────
  async function fillFormFields(formData) {
    const fieldOrder = ['category', 'region', 'reporterName', 'contactName', 'phone', 'email', 'location', 'address', 'description'];
    const results = { filled: 0, total: 0, errors: [] };

    // Map formData keys to field IDs
    const dataToFieldMap = {
      category: 'category',
      subcategory: 'subcategory',
      description: 'description',
      priority: 'priority',
      region: 'region',
      reporterName: 'reporterName',
      contactName: 'contactName',
      phone: 'phone',
      email: 'email',
      location: 'location',
      address: 'address'
    };

    // Build fill queue
    const queue = [];
    for (const key of fieldOrder) {
      if (formData[key]) {
        queue.push({ fieldId: key, value: formData[key] });
      }
    }
    // Add any remaining keys not in fieldOrder
    for (const key of Object.keys(formData)) {
      if (!fieldOrder.includes(key) && formData[key]) {
        queue.push({ fieldId: key, value: formData[key] });
      }
    }

    results.total = queue.length;

    for (const item of queue) {
      const element = findElement(item.fieldId, formData);
      if (element) {
        try {
          await typeWithAnimation(element, item.value);
          results.filled++;

          // Delay between fields (200ms)
          await new Promise(function (r) { setTimeout(r, 200); });
        } catch (err) {
          results.errors.push(item.fieldId + ': ' + err.message);
        }
      } else {
        results.errors.push(item.fieldId + ': 找不到對應的表單欄位');
      }
    }

    return results;
  }

  // ────────────────────────────────────────────────────────────
  // Message Listener
  // ────────────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'execute-fill') {
      fillFormFields(msg.formData).then(function (results) {
        sendResponse({
          success: results.filled > 0,
          filledCount: results.filled,
          totalCount: results.total,
          errors: results.errors
        });
      }).catch(function (err) {
        sendResponse({
          success: false,
          error: err.message
        });
      });
      return true; // Keep channel open for async response
    }
  });

})();

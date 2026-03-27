/**
 * 智慧服務平台 AI 填表助手 — Side Panel
 * 支援雙模式：LLM（Azure OpenAI）& Demo（引導式問答）
 */
(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // Keep service worker alive
  // ────────────────────────────────────────────────────────────
  let keepalivePort = null;
  function connectKeepalive() {
    try {
      keepalivePort = chrome.runtime.connect({ name: 'keepalive' });
      keepalivePort.onDisconnect.addListener(() => setTimeout(connectKeepalive, 1000));
    } catch (_) { setTimeout(connectKeepalive, 2000); }
  }
  connectKeepalive();

  // ────────────────────────────────────────────────────────────
  // DOM
  // ────────────────────────────────────────────────────────────
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const btnSend = document.getElementById('btn-send');
  const connectionStatus = document.getElementById('connection-status');
  const modeBadge = document.getElementById('mode-badge');
  const btnSettings = document.getElementById('btn-settings');

  // ────────────────────────────────────────────────────────────
  // Current mode
  // ────────────────────────────────────────────────────────────
  let currentMode = 'demo'; // 'demo' or 'llm'

  // ────────────────────────────────────────────────────────────
  // Mode Detection & Initialization
  // ────────────────────────────────────────────────────────────
  chrome.storage.local.get(['mode'], function (result) {
    currentMode = result.mode || 'demo';
    updateModeBadge();
    if (currentMode === 'llm') {
      initLLMMode();
    } else {
      initDemoMode();
    }
  });

  // Listen for mode changes from options page
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'local' && changes.mode) {
      var newMode = changes.mode.newValue || 'demo';
      if (newMode !== currentMode) {
        currentMode = newMode;
        updateModeBadge();
        // Reload the panel to switch modes cleanly
        window.location.reload();
      }
    }
  });

  function updateModeBadge() {
    if (currentMode === 'llm') {
      modeBadge.textContent = 'Azure OpenAI';
      modeBadge.classList.add('llm-mode');
    } else {
      modeBadge.textContent = '展示模式';
      modeBadge.classList.remove('llm-mode');
    }
  }

  // Settings button
  btnSettings.addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });

  // ────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  // LLM MODE
  // ═══════════════════════════════════════════════════════════
  // ────────────────────────────────────────────────────────────
  let llmExtracted = {};

  function initLLMMode() {
    // LLM mode uses the same UI, but routes messages through background → Azure OpenAI
    // The welcome message is already in HTML, no changes needed
  }

  function handleLLMInput(text) {
    appendMessage('user', text);
    var typingEl = showTyping();

    chrome.runtime.sendMessage({ type: 'user-message', text: text }, function (response) {
      removeElement(typingEl);

      if (chrome.runtime.lastError) {
        appendMessage('assistant', '連線錯誤：' + chrome.runtime.lastError.message);
        return;
      }

      if (!response) {
        appendMessage('assistant', '未收到 AI 回覆，請確認 Azure OpenAI 設定是否正確。');
        return;
      }

      if (response.error) {
        appendMessage('assistant', response.text || '發生錯誤');
        return;
      }

      // Update extracted data
      if (response.extracted) {
        llmExtracted = response.extracted;
      }

      // Show message with buttons
      if (response.allCollected) {
        // Show confirmation card
        showLLMConfirmation(response.text, response.extracted);
      } else {
        appendMessage('assistant', response.text, response.buttons ? response.buttons.map(function (b) {
          return { label: b.label, value: b.value };
        }) : null);
      }
    });
  }

  function showLLMConfirmation(text, extracted) {
    // Build formData from extracted
    var formData = {};
    if (extracted.category) formData.category = extracted.category;
    if (extracted.description) formData.description = extracted.description;
    if (extracted.location) formData.location = extracted.location;
    if (extracted.priority) formData.priority = extracted.priority;
    if (extracted.reporterName) formData.reporterName = extracted.reporterName;
    if (extracted.phone) formData.phone = extracted.phone;

    // Create the confirmation message
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><circle cx="9" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1" fill="currentColor"/></svg>';

    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

    bubbleDiv.appendChild(contentDiv);

    // Form preview card
    var previewCard = createFormPreview(formData);
    bubbleDiv.appendChild(previewCard);

    // Confirm + Edit buttons
    var btnGroup = document.createElement('div');
    btnGroup.className = 'confirm-btn-group';

    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirm';
    confirmBtn.dataset.formdata = JSON.stringify(formData);
    confirmBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>' +
      '確認，自動填入表單';

    var editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
      '重新填寫';

    btnGroup.appendChild(confirmBtn);
    btnGroup.appendChild(editBtn);
    bubbleDiv.appendChild(btnGroup);

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  // ────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  // DEMO MODE — 引導式問答流程
  // ═══════════════════════════════════════════════════════════
  // ────────────────────────────────────────────────────────────
  const FLOWS = {
    '流浪動物通報': {
      category: '動物保護',
      steps: [
        { key: 'animalType', question: '請問是什麼動物？', buttons: [
          { label: '狗', value: '狗' },
          { label: '貓', value: '貓' },
          { label: '鳥類', value: '鳥類' },
          { label: '其他', value: '其他動物' }
        ]},
        { key: 'condition', question: '動物目前的狀況如何？', buttons: [
          { label: '健康但流浪', value: '健康流浪' },
          { label: '受傷', value: '受傷' },
          { label: '奄奄一息', value: '奄奄一息，需緊急救援' },
          { label: '懷孕/帶幼崽', value: '懷孕或帶幼崽' }
        ]},
        { key: 'location', question: '請問發現的地點在哪裡？\n（例如：中正公園北側入口、民生路 123 號前）', buttons: null },
        { key: 'count', question: '大約有幾隻？', buttons: [
          { label: '1 隻', value: '1 隻' },
          { label: '2-3 隻', value: '2-3 隻' },
          { label: '一群（4 隻以上）', value: '一群，約 4 隻以上' }
        ]},
        { key: 'extra', question: '還有其他要補充的嗎？\n（例如：動物外觀特徵、是否有項圈等，沒有可以直接按「跳過」）', buttons: [
          { label: '跳過', value: '__SKIP__' }
        ]},
        { key: 'reporterName', question: '請問您的姓名？（通報人聯絡用）', buttons: null },
        { key: 'phone', question: '請留下您的手機號碼，方便後續聯繫：', buttons: null }
      ]
    },
    '蜂窩通報': {
      category: '蜂蛇移除',
      steps: [
        { key: 'beeType', question: '請問是哪種蜂？', buttons: [
          { label: '蜜蜂', value: '蜜蜂' },
          { label: '虎頭蜂', value: '虎頭蜂' },
          { label: '長腳蜂', value: '長腳蜂' },
          { label: '不確定', value: '不確定種類' }
        ]},
        { key: 'nestSize', question: '蜂窩大約多大？', buttons: [
          { label: '拳頭大小', value: '約拳頭大小' },
          { label: '籃球大小', value: '約籃球大小' },
          { label: '更大', value: '比籃球更大' },
          { label: '看不清楚', value: '無法確認大小' }
        ]},
        { key: 'nestLocation', question: '蜂窩的位置在哪？', buttons: [
          { label: '屋簷/陽台', value: '屋簷或陽台' },
          { label: '樹上', value: '樹上' },
          { label: '牆壁/電箱', value: '牆壁或電箱' },
          { label: '其他', value: '其他位置' }
        ]},
        { key: 'address', question: '請問詳細地址或地標？\n（例如：中山路 45 號 3 樓陽台）', buttons: null },
        { key: 'danger', question: '目前是否有人被螫傷？', buttons: [
          { label: '沒有', value: '目前無人被螫傷' },
          { label: '有人被螫', value: '已有人被螫傷' }
        ]},
        { key: 'reporterName', question: '請問您的姓名？', buttons: null },
        { key: 'phone', question: '請留下您的手機號碼：', buttons: null }
      ]
    },
    '環境汙染通報': {
      category: '環境汙染',
      steps: [
        { key: 'pollutionType', question: '請問是哪種汙染？', buttons: [
          { label: '噪音', value: '噪音' },
          { label: '空氣/異味', value: '空氣汙染或異味' },
          { label: '廢水/水汙染', value: '廢水或水汙染' },
          { label: '廢棄物', value: '廢棄物或垃圾' }
        ]},
        { key: 'source', question: '汙染來源是什麼？\n（例如：工廠排放、工地施工、鄰居裝潢等）', buttons: null },
        { key: 'address', question: '發生地點在哪裡？', buttons: null },
        { key: 'duration', question: '這個問題持續多久了？', buttons: [
          { label: '剛剛發生', value: '剛剛發生' },
          { label: '今天內', value: '今天內' },
          { label: '已持續數天', value: '已持續數天' },
          { label: '長期問題', value: '長期問題' }
        ]},
        { key: 'extra', question: '還有其他補充嗎？（沒有可按「跳過」）', buttons: [
          { label: '跳過', value: '__SKIP__' }
        ]},
        { key: 'reporterName', question: '請問您的姓名？', buttons: null },
        { key: 'phone', question: '請留下您的手機號碼：', buttons: null }
      ]
    },
    '噪音陳情': {
      category: '環境汙染',
      steps: [
        { key: 'noiseType', question: '請問噪音的類型？', buttons: [
          { label: '工地施工', value: '工地施工噪音' },
          { label: '商業活動', value: '商業活動噪音' },
          { label: '鄰居', value: '鄰居噪音' },
          { label: '交通', value: '交通噪音' },
          { label: '其他', value: '其他噪音' }
        ]},
        { key: 'time', question: '噪音通常在什麼時間發生？', buttons: [
          { label: '白天', value: '白天' },
          { label: '晚上（22點後）', value: '晚間 22 點後' },
          { label: '全天', value: '全天' },
          { label: '不定時', value: '不定時' }
        ]},
        { key: 'address', question: '噪音來源的位置在哪裡？', buttons: null },
        { key: 'extra', question: '還有其他補充嗎？（沒有可按「跳過」）', buttons: [
          { label: '跳過', value: '__SKIP__' }
        ]},
        { key: 'reporterName', question: '請問您的姓名？', buttons: null },
        { key: 'phone', question: '請留下您的手機號碼：', buttons: null }
      ]
    }
  };

  // ────────────────────────────────────────────────────────────
  // Demo 對話狀態
  // ────────────────────────────────────────────────────────────
  let currentFlow = null;
  let currentStepIndex = -1;
  let collectedData = {};

  function initDemoMode() {
    // Demo mode uses the built-in guided flow — no extra init needed
  }

  // ────────────────────────────────────────────────────────────
  // Delegated Click
  // ────────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    // Quick action buttons (initial menu)
    const quickBtn = e.target.closest('.quick-btn');
    if (quickBtn && !quickBtn.disabled) {
      var value = quickBtn.dataset.value;
      if (!value) return;
      var container = quickBtn.closest('.quick-actions');
      if (container) {
        container.querySelectorAll('.quick-btn').forEach(function (b) {
          b.disabled = true;
          if (b === quickBtn) b.classList.add('selected');
        });
      }
      handleUserInput(value);
      return;
    }

    // Inline buttons (flow step buttons)
    const inlineBtn = e.target.closest('.inline-btn');
    if (inlineBtn && !inlineBtn.disabled) {
      var val = inlineBtn.dataset.value;
      if (!val) return;
      var cont = inlineBtn.closest('.inline-buttons');
      if (cont) {
        cont.querySelectorAll('.inline-btn').forEach(function (b) {
          b.disabled = true;
          if (b === inlineBtn) b.classList.add('selected');
        });
      }
      handleUserInput(val);
      return;
    }

    // Fill form button
    const fillBtn = e.target.closest('.btn-fill-form');
    if (fillBtn && !fillBtn.disabled) {
      var raw = fillBtn.dataset.formdata;
      if (raw) {
        try { triggerFormFill(JSON.parse(raw), fillBtn); }
        catch (err) { console.error('Parse error:', err); }
      }
    }

    // Confirm button
    const confirmBtn = e.target.closest('.btn-confirm');
    if (confirmBtn && !confirmBtn.disabled) {
      var raw2 = confirmBtn.dataset.formdata;
      if (raw2) {
        try { triggerFormFill(JSON.parse(raw2), confirmBtn); }
        catch (err) { console.error('Parse error:', err); }
      }
    }

    // Edit button — restart flow
    const editBtn = e.target.closest('.btn-edit');
    if (editBtn) {
      if (currentMode === 'llm') {
        // Reset LLM conversation
        chrome.runtime.sendMessage({ type: 'reset-conversation' });
        llmExtracted = {};
        appendMessage('assistant', '好的，讓我們重新開始。請告訴我您要通報的問題。');
      } else {
        appendMessage('assistant', '好的，讓我們重新開始。請選擇要通報的類型：', getMainButtons());
        currentFlow = null;
        currentStepIndex = -1;
        collectedData = {};
      }
    }
  });

  // ────────────────────────────────────────────────────────────
  // Unified input handler — routes to LLM or Demo mode
  // ────────────────────────────────────────────────────────────
  function handleUserInput(text) {
    if (currentMode === 'llm') {
      handleLLMInput(text);
      return;
    }

    // Demo mode logic below
    if (text === '__SKIP__') {
      appendMessage('user', '跳過');
    } else {
      appendMessage('user', text);
    }

    var typingEl = showTyping();

    setTimeout(function () {
      removeElement(typingEl);

      // Starting a new flow?
      if (!currentFlow && FLOWS[text]) {
        currentFlow = text;
        currentStepIndex = 0;
        collectedData = { flowName: text, category: FLOWS[text].category };
        askCurrentStep();
        return;
      }

      // Free text that matches a flow keyword
      if (!currentFlow) {
        var detected = detectFlow(text);
        if (detected) {
          currentFlow = detected;
          currentStepIndex = 0;
          collectedData = { flowName: detected, category: FLOWS[detected].category };
          appendMessage('assistant', '了解，為您啟動「' + detected + '」流程。');
          setTimeout(function () { askCurrentStep(); }, 300);
          return;
        }

        // No flow matched — prompt to pick
        appendMessage('assistant',
          '我可以協助您進行以下通報，請選擇一個類型：',
          getMainButtons()
        );
        return;
      }

      // In a flow — record answer and advance
      var flow = FLOWS[currentFlow];
      var step = flow.steps[currentStepIndex];
      if (text !== '__SKIP__') {
        collectedData[step.key] = text;
      }
      currentStepIndex++;

      if (currentStepIndex < flow.steps.length) {
        askCurrentStep();
      } else {
        // Flow complete — show summary
        showFlowSummary();
      }
    }, 400 + Math.random() * 300);
  }

  function detectFlow(text) {
    var lower = text.toLowerCase();
    if (/流浪|狗|貓|動物|犬|毛孩|浪犬|浪貓|受傷/.test(lower)) return '流浪動物通報';
    if (/蜂|蜜蜂|虎頭蜂|蜂窩|蜂巢/.test(lower)) return '蜂窩通報';
    if (/噪音|吵|施工噪|音量|深夜/.test(lower)) return '噪音陳情';
    if (/汙染|排放|臭|垃圾|廢水|廢氣|空氣/.test(lower)) return '環境汙染通報';
    return null;
  }

  function askCurrentStep() {
    var flow = FLOWS[currentFlow];
    var step = flow.steps[currentStepIndex];
    var stepNum = '(' + (currentStepIndex + 1) + '/' + flow.steps.length + ') ';
    appendMessage('assistant', stepNum + step.question, step.buttons);
  }

  function getMainButtons() {
    return [
      { label: '流浪動物通報', value: '流浪動物通報' },
      { label: '蜂窩通報', value: '蜂窩通報' },
      { label: '環境汙染通報', value: '環境汙染通報' },
      { label: '噪音陳情', value: '噪音陳情' }
    ];
  }

  // ────────────────────────────────────────────────────────────
  // Flow summary + confirm card (Demo mode)
  // ────────────────────────────────────────────────────────────
  function showFlowSummary() {
    var flow = FLOWS[currentFlow];

    // Build description from collected data
    var descParts = [];
    for (var i = 0; i < flow.steps.length; i++) {
      var s = flow.steps[i];
      var val = collectedData[s.key];
      if (val) descParts.push(val);
    }
    var description = descParts.join('。');

    var priority = '一般';
    var allText = JSON.stringify(collectedData);
    if (/緊急|奄奄一息|被螫|受傷/.test(allText)) priority = '緊急';

    var formData = {
      category: collectedData.category,
      description: description,
      priority: priority
    };
    if (collectedData.address) formData.location = collectedData.address;
    if (collectedData.location) formData.location = collectedData.location;
    if (collectedData.reporterName) formData.reporterName = collectedData.reporterName;
    if (collectedData.phone) formData.phone = collectedData.phone;

    // Summary text
    var summary = '資料收集完成！以下是您的通報摘要：\n\n';
    summary += '通報類型：' + currentFlow + '\n';

    var labelMap = {};
    flow.steps.forEach(function (s) {
      var labels = {
        animalType: '動物種類', condition: '狀況', location: '地點',
        count: '數量', beeType: '蜂種', nestSize: '蜂窩大小',
        nestLocation: '蜂窩位置', address: '地址', danger: '傷亡情況',
        pollutionType: '汙染類型', source: '汙染來源', duration: '持續時間',
        noiseType: '噪音類型', time: '發生時間', extra: '備註'
      };
      labelMap[s.key] = labels[s.key] || s.key;
    });

    flow.steps.forEach(function (s) {
      if (collectedData[s.key]) {
        summary += labelMap[s.key] + '：' + collectedData[s.key] + '\n';
      }
    });

    summary += '\n請確認以上資訊是否正確：';

    // Show summary message + confirm/edit buttons
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><circle cx="9" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1" fill="currentColor"/></svg>';

    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = escapeHtml(summary).replace(/\n/g, '<br>');

    bubbleDiv.appendChild(contentDiv);

    // Form preview card
    var previewCard = createFormPreview(formData);
    bubbleDiv.appendChild(previewCard);

    // Confirm + Edit buttons
    var btnGroup = document.createElement('div');
    btnGroup.className = 'confirm-btn-group';

    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirm';
    confirmBtn.dataset.formdata = JSON.stringify(formData);
    confirmBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>' +
      '確認，自動填入表單';

    var editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
      '重新填寫';

    btnGroup.appendChild(confirmBtn);
    btnGroup.appendChild(editBtn);
    bubbleDiv.appendChild(btnGroup);

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  // ────────────────────────────────────────────────────────────
  // Send text message
  // ────────────────────────────────────────────────────────────
  function sendMessage() {
    var text = userInput.value.trim();
    if (!text) return;
    userInput.value = '';
    userInput.style.height = 'auto';
    updateSendButton();
    handleUserInput(text);
  }

  // ────────────────────────────────────────────────────────────
  // UI: append message (with optional inline buttons)
  // ────────────────────────────────────────────────────────────
  function appendMessage(role, text, buttons) {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + role;

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    if (role === 'assistant') {
      avatarDiv.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><circle cx="9" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1" fill="currentColor"/></svg>';
    } else {
      avatarDiv.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    }

    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

    bubbleDiv.appendChild(contentDiv);

    // Inline buttons
    if (buttons && buttons.length > 0) {
      var btnContainer = document.createElement('div');
      btnContainer.className = 'inline-buttons';
      buttons.forEach(function (b) {
        var btnEl = document.createElement('button');
        btnEl.className = 'inline-btn';
        btnEl.dataset.value = b.value;
        btnEl.textContent = b.label;
        btnContainer.appendChild(btnEl);
      });
      bubbleDiv.appendChild(btnContainer);
    }

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function createFormPreview(formData) {
    var card = document.createElement('div');
    card.className = 'form-preview';

    var header = document.createElement('div');
    header.className = 'form-preview-header';
    header.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
      '<span class="form-preview-title">表單填入資料</span>';
    card.appendChild(header);

    var fieldsDiv = document.createElement('div');
    fieldsDiv.className = 'form-preview-fields';

    var labelMap = {
      category: '通報類型', description: '狀況描述', priority: '緊急程度', location: '地點',
      reporterName: '通報人', phone: '聯絡電話'
    };

    for (var key in formData) {
      if (!formData[key]) continue;
      var fieldDiv = document.createElement('div');
      fieldDiv.className = 'form-preview-field';
      var displayVal = formData[key].length > 50 ? formData[key].substring(0, 50) + '...' : formData[key];
      fieldDiv.innerHTML =
        '<span class="form-preview-label">' + (labelMap[key] || key) + '</span>' +
        '<span class="form-preview-value">' + escapeHtml(displayVal) + '</span>';
      fieldsDiv.appendChild(fieldDiv);
    }
    card.appendChild(fieldsDiv);
    return card;
  }

  function showTyping() {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><circle cx="9" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1" fill="currentColor"/></svg>';

    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

    bubbleDiv.appendChild(contentDiv);
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
    return msgDiv;
  }

  function removeElement(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }
  function scrollToBottom() { requestAnimationFrame(function () { chatMessages.scrollTop = chatMessages.scrollHeight; }); }
  function escapeHtml(str) { var d = document.createElement('div'); d.appendChild(document.createTextNode(str)); return d.innerHTML; }

  // ────────────────────────────────────────────────────────────
  // Form Fill — auto navigate + fill
  // ────────────────────────────────────────────────────────────
  var activeFillBtn = null;

  function triggerFormFill(formData, btn) {
    btn.disabled = true;
    btn.innerHTML =
      '<div class="fill-progress-spinner" style="width:14px;height:14px;border-width:2px;"></div>' +
      '導向並填入中...';
    activeFillBtn = btn;

    appendMessage('assistant', '正在為您導向通報頁面並自動填入...');

    // Send navigate-and-fill — background will navigate + fill after page loads
    chrome.runtime.sendMessage({
      type: 'navigate-and-fill',
      formData: formData
    }, function (response) {
      if (!response || !response.success) {
        btn.disabled = false;
        btn.innerHTML = '重試填入';
        appendMessage('assistant', '導向失敗：' + ((response && response.error) || '未知錯誤'));
      }
      // Otherwise, wait for fill-result from background
    });
  }

  // Listen for fill result from background (after page loads + fill completes)
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.type === 'fill-result') {
      var btn = activeFillBtn;
      var response = msg.response;

      if (response && response.success) {
        if (btn) {
          btn.classList.add('filled');
          btn.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;"><path d="M20 6L9 17l-5-5"/></svg>' +
            '已填入 ' + (response.filledCount || '') + ' 個欄位';
        }

        appendMessage('assistant',
          '表單已自動填入完成！已成功填入 ' + (response.filledCount || 0) + ' 個欄位。\n\n' +
          '請檢查表單內容是否正確，如需修改可直接在表單上調整。\n' +
          '確認無誤後請點擊頁面上的「送出」按鈕完成通報。'
        );

        // Reset state
        currentFlow = null;
        currentStepIndex = -1;
        collectedData = {};
        if (currentMode === 'llm') {
          chrome.runtime.sendMessage({ type: 'reset-conversation' });
          llmExtracted = {};
        }
      } else {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '重試填入';
        }
        var errMsg = (response && response.error) || '未偵測到表單欄位';
        appendMessage('assistant', '填入時發生問題：' + errMsg);
      }
      activeFillBtn = null;
    }
  });

  // ────────────────────────────────────────────────────────────
  // Voice Input (Web Speech API)
  // ────────────────────────────────────────────────────────────
  var btnMic = document.getElementById('btn-mic');
  var recognition = null;
  var isRecording = false;

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = function (event) {
      var transcript = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      userInput.value = transcript;
      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 100) + 'px';
      updateSendButton();

      if (event.results[event.results.length - 1].isFinal) {
        stopRecording();
        if (transcript.trim()) sendMessage();
      }
    };

    recognition.onerror = function (event) {
      stopRecording();
      if (event.error === 'not-allowed') {
        appendMessage('assistant', '請允許麥克風權限以使用語音輸入。');
      }
    };

    recognition.onend = function () { stopRecording(); };
  } else {
    if (btnMic) btnMic.style.display = 'none';
  }

  if (btnMic) {
    btnMic.addEventListener('click', function () {
      if (!recognition) return;
      if (isRecording) {
        recognition.stop();
        stopRecording();
      } else {
        recognition.start();
        isRecording = true;
        btnMic.classList.add('recording');
        userInput.placeholder = '正在聆聽...';
      }
    });
  }

  function stopRecording() {
    isRecording = false;
    if (btnMic) btnMic.classList.remove('recording');
    userInput.placeholder = '輸入或點麥克風語音輸入...';
  }

  // ────────────────────────────────────────────────────────────
  // Event Listeners
  // ────────────────────────────────────────────────────────────
  btnSend.addEventListener('click', sendMessage);
  userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  userInput.addEventListener('input', function () {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 100) + 'px';
    updateSendButton();
  });
  function updateSendButton() { btnSend.disabled = !userInput.value.trim(); }

  // ────────────────────────────────────────────────────────────
  // Listen for background messages (form detection)
  // ────────────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.type === 'form-detected') {
      connectionStatus.classList.remove('disconnected');
      connectionStatus.classList.add('connected');
    }
    if (msg.type === 'form-not-detected') {
      connectionStatus.classList.remove('connected');
      connectionStatus.classList.add('disconnected');
    }
  });

  chrome.runtime.sendMessage({ type: 'check-form-status' }, function (response) {
    if (response && response.hasForm) {
      connectionStatus.classList.remove('disconnected');
      connectionStatus.classList.add('connected');
    }
  });

})();

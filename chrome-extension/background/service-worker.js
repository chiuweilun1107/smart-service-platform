/**
 * 智慧服務平台 AI 填表助手 — Background Service Worker (ES Module)
 */

import { chatCompletion } from '../lib/llm-api.js';

let formDetectedTabs = new Set();
let pendingFill = null; // { tabId, formData }

// ────────────────────────────────────────────────────────────
// LLM Mode — System Prompt & State
// ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `你是智慧服務平台的 AI 填表助手，協助市民通報動物保護、環境汙染、噪音等問題。

## 支援的通報類型
1. 動物保護（流浪動物、受傷動物）
2. 蜂蛇移除（蜂窩、蛇類）
3. 環境汙染（空氣、水、廢棄物）
4. 噪音陳情（施工、商業、鄰居）
5. 公共設施（路燈、道路、公園）

## 需要收集的欄位
- category: 通報類型
- description: 狀況描述（根據用戶描述整理成結構化內容）
- location: 地點/地址
- priority: 緊急程度（一般/緊急）
- reporterName: 通報人姓名
- phone: 聯絡電話

## 回應規則
- 繁體中文，語氣親切簡潔
- 逐步引導，每次只問一個問題
- 每次回覆先確認收到的資訊，再問下一題
- 用戶一次提供多個資訊時全部記錄，追問還缺的
- 手機格式：09 開頭共 10 碼
- **每一步都必須提供 buttons**，讓用戶可以快速點選，減少打字

## 輸出格式（嚴格 JSON）
{
  "message": "你要對用戶說的話",
  "buttons": [{"label": "按鈕文字", "value": "點擊送出的文字"}],
  "extracted": {
    "category": "值或null",
    "description": "值或null",
    "location": "值或null",
    "priority": "值或null",
    "reporterName": "值或null",
    "phone": "值或null"
  },
  "allCollected": false
}

## buttons 規則（非常重要，每一步都要有）
- **buttons 永遠不能為 null**，每次回覆都必須提供至少 2 個按鈕選項
- 最多 5 個按鈕，每個 label 不超過 15 字
- 按鈕範例：

### 確認通報類型時：
[{"label":"🐕 流浪動物","value":"流浪動物"},{"label":"🐝 蜂窩蛇類","value":"蜂窩蛇類"},{"label":"🏭 環境汙染","value":"環境汙染"},{"label":"🔊 噪音","value":"噪音"}]

### 問動物種類時：
[{"label":"🐕 狗","value":"狗"},{"label":"🐈 貓","value":"貓"},{"label":"🐦 鳥類","value":"鳥類"},{"label":"🦎 其他","value":"其他動物"}]

### 問動物狀況時：
[{"label":"健康流浪","value":"健康流浪"},{"label":"⚠️ 受傷","value":"受傷"},{"label":"🚨 奄奄一息","value":"奄奄一息"},{"label":"🤰 帶幼崽","value":"帶幼崽"}]

### 問數量時：
[{"label":"1 隻","value":"1 隻"},{"label":"2-3 隻","value":"2-3 隻"},{"label":"一群(4+)","value":"一群約4隻以上"}]

### 問蜂窩種類時：
[{"label":"🐝 蜜蜂","value":"蜜蜂"},{"label":"🐝 虎頭蜂","value":"虎頭蜂"},{"label":"🐝 長腳蜂","value":"長腳蜂"},{"label":"❓ 不確定","value":"不確定種類"}]

### 問噪音類型時：
[{"label":"🏗️ 工地施工","value":"工地施工噪音"},{"label":"🎤 商業活動","value":"商業活動噪音"},{"label":"🏠 鄰居","value":"鄰居噪音"},{"label":"🚗 交通","value":"交通噪音"}]

### 問汙染類型時：
[{"label":"🔊 噪音","value":"噪音"},{"label":"💨 空氣/異味","value":"空氣汙染"},{"label":"💧 廢水","value":"廢水汙染"},{"label":"🗑️ 廢棄物","value":"廢棄物"}]

### 問緊急程度時：
[{"label":"一般","value":"一般"},{"label":"⚠️ 緊急","value":"緊急"}]

### 問地點時（也要給按鈕）：
[{"label":"📍 輸入地址","value":"我要輸入地址"}]
用戶可以點按鈕後再打字輸入，或直接打字

### 問姓名/電話時：
[{"label":"跳過","value":"跳過"}]
讓用戶可以選擇跳過`;

// Per-tab conversation state
// state: 'IDLE' | 'COLLECTING' | 'CONFIRMING' | 'FILLING'
const tabConversations = new Map();

function getConversation(tabId) {
  if (!tabConversations.has(tabId)) {
    tabConversations.set(tabId, {
      state: 'IDLE',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }],
      extracted: {}
    });
  }
  return tabConversations.get(tabId);
}

function resetConversation(tabId) {
  tabConversations.delete(tabId);
}

// ────────────────────────────────────────────────────────────
// LLM Message Handler
// ────────────────────────────────────────────────────────────
async function handleLLMMessage(text, senderTabId) {
  const conv = getConversation(senderTabId || 'global');

  // Move state to COLLECTING
  if (conv.state === 'IDLE') {
    conv.state = 'COLLECTING';
  }

  // Add user message
  conv.messages.push({ role: 'user', content: text });

  try {
    const raw = await chatCompletion(conv.messages, { jsonMode: true, temperature: 0.3 });
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      // Try extracting JSON from the response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('無法解析 AI 回覆');
      }
    }

    // Update extracted data
    if (parsed.extracted) {
      for (const key in parsed.extracted) {
        if (parsed.extracted[key] && parsed.extracted[key] !== 'null') {
          conv.extracted[key] = parsed.extracted[key];
        }
      }
    }

    // Add assistant response to conversation history
    conv.messages.push({ role: 'assistant', content: raw });

    // Check state transitions
    if (parsed.allCollected) {
      conv.state = 'CONFIRMING';
    }

    return {
      type: 'assistant-message',
      text: parsed.message || '',
      buttons: parsed.buttons || null,
      extracted: conv.extracted,
      allCollected: parsed.allCollected || false
    };

  } catch (err) {
    console.error('LLM error:', err);
    return {
      type: 'assistant-message',
      text: '抱歉，AI 處理發生錯誤：' + err.message,
      buttons: null,
      extracted: conv.extracted,
      allCollected: false,
      error: true
    };
  }
}

// ────────────────────────────────────────────────────────────
// Tab monitoring
// ────────────────────────────────────────────────────────────
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete') return;
  if (!tab.url) return;

  if (isSSPUrl(tab.url)) {
    formDetectedTabs.add(tabId);

    chrome.sidePanel.setOptions({
      tabId: tabId,
      path: 'sidepanel/sidepanel.html',
      enabled: true
    });

    // If there's a pending fill for this tab, execute it now
    if (pendingFill && pendingFill.tabId === tabId) {
      var formData = pendingFill.formData;
      pendingFill = null;

      // Wait a bit for React to render the form
      setTimeout(function () {
        chrome.tabs.sendMessage(tabId, {
          type: 'execute-fill',
          formData: formData
        }, function (response) {
          // Forward result to sidepanel
          try {
            chrome.runtime.sendMessage({
              type: 'fill-result',
              response: response || { success: false, error: '未收到回應' }
            }).catch(function () {});
          } catch (_) {}
        });
      }, 1500);
    }
  } else {
    formDetectedTabs.delete(tabId);
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  formDetectedTabs.delete(tabId);
  if (pendingFill && pendingFill.tabId === tabId) pendingFill = null;
  tabConversations.delete(tabId);
});

function isSSPUrl(url) {
  try {
    var parsed = new URL(url);
    if (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost') return true;
    if (parsed.hostname === 'chiuweilun1107.github.io' && parsed.pathname.includes('smart-service-platform')) return true;
    return false;
  } catch (_) { return false; }
}

// ────────────────────────────────────────────────────────────
// Message routing
// ────────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

  // Form detected from content script
  if (msg.type === 'form-detected') {
    var tabId = sender.tab ? sender.tab.id : null;
    if (tabId) formDetectedTabs.add(tabId);
    forwardToSidePanel(msg);
    sendResponse({ received: true });
    return false;
  }

  if (msg.type === 'form-not-detected') {
    var tabId2 = sender.tab ? sender.tab.id : null;
    if (tabId2) formDetectedTabs.delete(tabId2);
    forwardToSidePanel(msg);
    sendResponse({ received: true });
    return false;
  }

  // Check form status
  if (msg.type === 'check-form-status') {
    getActiveTab().then(function (tab) {
      if (!tab) { sendResponse({ hasForm: false }); return; }

      chrome.tabs.sendMessage(tab.id, { type: 'query-form-fields' }, function (response) {
        if (chrome.runtime.lastError) {
          sendResponse({ hasForm: false });
          return;
        }
        sendResponse(response || { hasForm: false });
      });
    });
    return true;
  }

  // LLM user message — handle with Azure OpenAI
  if (msg.type === 'user-message') {
    getActiveTab().then(function (tab) {
      var tabId = tab ? tab.id : 'global';
      handleLLMMessage(msg.text, tabId).then(function (response) {
        sendResponse(response);
      });
    });
    return true; // Keep channel open for async
  }

  // Reset LLM conversation
  if (msg.type === 'reset-conversation') {
    getActiveTab().then(function (tab) {
      var tabId = tab ? tab.id : 'global';
      resetConversation(tabId);
      sendResponse({ success: true });
    });
    return true;
  }

  // Navigate to report page + schedule fill after load
  if (msg.type === 'navigate-and-fill') {
    getActiveTab().then(function (tab) {
      if (!tab) {
        sendResponse({ success: false, error: '找不到有效的分頁' });
        return;
      }

      try {
        var parsed = new URL(tab.url);
        var base = parsed.origin;

        var reportType = 'general';
        if (msg.formData) {
          var cat = msg.formData.category || '';
          if (/動物/.test(cat)) reportType = 'animal';
          else if (/蜂|蛇/.test(cat)) reportType = 'bee';
          else if (/環境|汙染|噪音/.test(cat)) reportType = 'environment';
        }

        var reportUrl = base + '/smart-service-platform/report/' + reportType;

        // Store pending fill — will execute when tab finishes loading
        pendingFill = { tabId: tab.id, formData: msg.formData };

        chrome.tabs.update(tab.id, { url: reportUrl }, function () {
          sendResponse({ success: true, navigating: true });
        });
      } catch (_) {
        sendResponse({ success: false, error: '導向失敗' });
      }
    });
    return true;
  }

  // Direct fill (when already on form page)
  if (msg.type === 'fill-form') {
    getActiveTab().then(function (tab) {
      if (!tab) {
        sendResponse({ success: false, error: '找不到有效的分頁' });
        return;
      }

      chrome.tabs.sendMessage(tab.id, {
        type: 'execute-fill',
        formData: msg.formData
      }, function (response) {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: '無法連線到頁面，請重新載入。' });
          return;
        }
        sendResponse(response || { success: false, error: '未收到回應' });
      });
    });
    return true;
  }

  return false;
});

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
async function getActiveTab() {
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
  } catch (_) { return null; }
}

function forwardToSidePanel(message) {
  try {
    chrome.runtime.sendMessage(message).catch(function () {});
  } catch (_) {}
}

// Open side panel on icon click
chrome.action.onClicked.addListener(function (tab) {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Keep alive
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'keepalive') {
    port.onDisconnect.addListener(function () {});
  }
});

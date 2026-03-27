/**
 * 智慧服務平台 AI 填表助手 — Options Page
 */

const DEFAULTS = {
  endpoint: '',
  deployment: 'gpt-4.1',
  apiVersion: '2025-01-01-preview'
};

// ────────────────────────────────────────────────────────────
// Load saved settings
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
  const result = await chrome.storage.local.get([
    'mode', 'azureEndpoint', 'azureDeployment', 'azureApiKey', 'azureApiVersion'
  ]);

  // Mode
  const mode = result.mode || 'demo';
  const radios = document.querySelectorAll('input[name="mode"]');
  radios.forEach(function (radio) {
    radio.checked = (radio.value === mode);
  });
  toggleAzureSection(mode);

  // Azure settings
  document.getElementById('endpoint').value = result.azureEndpoint || DEFAULTS.endpoint;
  document.getElementById('deployment').value = result.azureDeployment || DEFAULTS.deployment;
  document.getElementById('apiKey').value = result.azureApiKey || '';
  document.getElementById('apiVersion').value = result.azureApiVersion || DEFAULTS.apiVersion;
});

// ────────────────────────────────────────────────────────────
// Mode toggle — show/hide Azure settings
// ────────────────────────────────────────────────────────────
function toggleAzureSection(mode) {
  const azureSection = document.getElementById('azure-settings');
  if (mode === 'llm') {
    azureSection.classList.remove('hidden');
  } else {
    azureSection.classList.add('hidden');
  }
}

document.querySelectorAll('input[name="mode"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    const selectedMode = this.value;
    toggleAzureSection(selectedMode);

    // Save mode immediately
    chrome.storage.local.set({ mode: selectedMode }, function () {
      showStatus('success', 'Mode 已切換為「' + (selectedMode === 'llm' ? 'Azure OpenAI' : 'Demo 展示') + '」模式');
      setTimeout(clearStatus, 2000);
    });
  });
});

// ────────────────────────────────────────────────────────────
// Save Azure settings
// ────────────────────────────────────────────────────────────
document.getElementById('btn-save').addEventListener('click', async function () {
  await chrome.storage.local.set({
    azureEndpoint: document.getElementById('endpoint').value.trim(),
    azureDeployment: document.getElementById('deployment').value.trim(),
    azureApiKey: document.getElementById('apiKey').value.trim(),
    azureApiVersion: document.getElementById('apiVersion').value.trim()
  });

  showStatus('success', '設定已儲存');
  setTimeout(clearStatus, 2500);
});

// ────────────────────────────────────────────────────────────
// Test connection
// ────────────────────────────────────────────────────────────
document.getElementById('btn-test').addEventListener('click', async function () {
  const endpoint = document.getElementById('endpoint').value.trim();
  const deployment = document.getElementById('deployment').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  const apiVersion = document.getElementById('apiVersion').value.trim();

  if (!endpoint) {
    showStatus('error', '請先填入 Endpoint URL');
    return;
  }
  if (!apiKey) {
    showStatus('error', '請先填入 API Key');
    return;
  }

  const btn = this;
  btn.disabled = true;
  showStatus('testing', '<span class="spinner"></span>正在測試連線...');

  try {
    const url = endpoint + '/openai/deployments/' + (deployment || 'gpt-4.1') +
      '/chat/completions?api-version=' + (apiVersion || '2025-01-01-preview');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '你好' }],
        max_tokens: 10,
        temperature: 0
      })
    });

    if (response.ok) {
      const data = await response.json();
      const reply = data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : '';
      showStatus('success', '連線成功！回覆：' + reply);
    } else {
      const errorText = await response.text();
      showStatus('error', '連線失敗 (' + response.status + ')：' + errorText.substring(0, 120));
    }
  } catch (err) {
    showStatus('error', '連線錯誤：' + err.message);
  } finally {
    btn.disabled = false;
    setTimeout(clearStatus, 5000);
  }
});

// ────────────────────────────────────────────────────────────
// Status helpers
// ────────────────────────────────────────────────────────────
function showStatus(type, message) {
  const el = document.getElementById('status');
  el.className = 'status ' + type;
  el.innerHTML = message;
}

function clearStatus() {
  const el = document.getElementById('status');
  el.className = 'status';
  el.innerHTML = '';
}

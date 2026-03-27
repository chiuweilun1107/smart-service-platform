/**
 * Azure OpenAI API wrapper for SSP Extension
 */

const DEFAULT_CONFIG = {
  endpoint: '',
  deployment: 'gpt-4.1',
  apiVersion: '2025-01-01-preview'
};

export async function getConfig() {
  const result = await chrome.storage.local.get(['azureEndpoint', 'azureDeployment', 'azureApiKey', 'azureApiVersion']);
  return {
    endpoint: result.azureEndpoint || DEFAULT_CONFIG.endpoint,
    deployment: result.azureDeployment || DEFAULT_CONFIG.deployment,
    apiKey: result.azureApiKey || '',
    apiVersion: result.azureApiVersion || DEFAULT_CONFIG.apiVersion
  };
}

export async function chatCompletion(messages, options = {}) {
  const config = await getConfig();

  if (!config.apiKey) {
    throw new Error('未設定 Azure OpenAI API Key，請到擴充功能設定頁填入。');
  }

  if (!config.endpoint) {
    throw new Error('未設定 Azure OpenAI Endpoint，請到擴充功能設定頁填入。');
  }

  const url = `${config.endpoint}/openai/deployments/${config.deployment}/chat/completions?api-version=${config.apiVersion}`;

  const body = {
    messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 1024,
    response_format: options.jsonMode ? { type: 'json_object' } : undefined
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI API 錯誤 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

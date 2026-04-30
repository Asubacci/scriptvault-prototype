import { messages } from "./data/messages.js";

function getElement(selector) {
  return document.querySelector(selector);
}

export function getStoredApiSettings() {
  return {
    apiUrl: window.SCRIPTVAULT_API_URL || window.localStorage.getItem("scriptvault_api_url") || "",
    adminKey: window.localStorage.getItem("scriptvault_admin_key") || "",
  };
}

export function initApiSettings() {
  const form = getElement("#apiSettingsForm");
  const apiUrlInput = getElement("#settingsApiUrl");
  const adminKeyInput = getElement("#settingsAdminKey");
  const status = getElement("#settingsStatus");
  const clearButton = getElement("#clearApiSettingsButton");

  if (!form || !apiUrlInput || !adminKeyInput || !status || !clearButton) {
    return;
  }

  const saved = getStoredApiSettings();
  apiUrlInput.value = saved.apiUrl;
  adminKeyInput.value = saved.adminKey;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.localStorage.setItem("scriptvault_api_url", apiUrlInput.value.trim());
    window.localStorage.setItem("scriptvault_admin_key", adminKeyInput.value.trim());
    status.textContent = messages.settingsSaved;
  });

  clearButton.addEventListener("click", () => {
    window.localStorage.removeItem("scriptvault_api_url");
    window.localStorage.removeItem("scriptvault_admin_key");
    apiUrlInput.value = "";
    adminKeyInput.value = "";
    status.textContent = messages.settingsCleared;
  });
}

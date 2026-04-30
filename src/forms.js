import { messages } from "./data/messages.js";
import { getRequiredElement } from "./utils/dom.js";
import { logger } from "./utils/logger.js";

function setStatus(element, message) {
  element.textContent = message;
  element.tabIndex = -1;
  element.focus({ preventScroll: true });
}

function getApiBaseUrl() {
  return window.SCRIPTVAULT_API_URL || window.localStorage.getItem("scriptvault_api_url") || "";
}

function getProducerPayload(form) {
  const formData = new window.FormData(form);

  return {
    fullName: String(formData.get("fullName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    company: String(formData.get("company") || ""),
    role: String(formData.get("role") || ""),
    primaryNeed: String(formData.get("primaryNeed") || ""),
    preferredGenre: String(formData.get("preferredGenre") || ""),
    budgetRange: String(formData.get("budgetRange") || ""),
    productionTimeline: String(formData.get("productionTimeline") || ""),
    interests: formData.getAll("interests").map(String),
    notes: String(formData.get("notes") || ""),
    source: "github-pages-prototype",
    consentToContact: formData.get("consentToContact") === "on",
    consentToUpdates: formData.get("consentToUpdates") === "on",
  };
}

async function submitProducerLead(payload) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return { mode: "demo" };
  }

  const response = await window.fetch(`${apiBaseUrl.replace(/\/$/, "")}/waitlist/producer`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Waitlist API returned ${response.status}`);
  }

  return response.json();
}

function initThemeSelector() {
  const themeSelect = getRequiredElement("#themeSelect");
  const customThemeWrap = getRequiredElement("#customThemeWrap");
  const customTheme = getRequiredElement("#customTheme");

  themeSelect.addEventListener("change", () => {
    const isCustom = themeSelect.value === "custom";

    customThemeWrap.classList.toggle("hidden", !isCustom);
    customTheme.required = isCustom;

    if (!isCustom) {
      customTheme.value = "";
    }

    logger.info("theme_selection_changed", { mode: isCustom ? "custom" : "preset" });
  });
}

function initCoverageForm() {
  const coverageForm = getRequiredElement("#coverageForm");
  const coverageError = getRequiredElement("#coverageError");

  coverageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const unchecked = coverageForm.querySelectorAll(".disclaimer-box input[type='checkbox']:not(:checked)");

    if (unchecked.length > 0) {
      setStatus(coverageError, messages.coverageIncomplete);
      unchecked[0].focus();
      logger.warn("coverage_submit_blocked", { uncheckedCount: unchecked.length });
      return;
    }

    setStatus(coverageError, messages.coverageSuccess);
    logger.info("coverage_submit_success");
  });
}

function initContactForm() {
  const contactForm = getRequiredElement("#contactForm");
  const contactSuccess = getRequiredElement("#contactSuccess");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus(contactSuccess, messages.contactSuccess);
    contactForm.reset();
    logger.info("contact_submit_success");
  });
}

function initProducerForm() {
  const producerForm = getRequiredElement("#producerForm");
  const producerSuccess = getRequiredElement("#producerSuccess");

  producerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = getProducerPayload(producerForm);
      const result = await submitProducerLead(payload);
      setStatus(
        producerSuccess,
        result.mode === "demo" ? messages.producerSuccessDemo : messages.producerSuccess
      );
      producerForm.reset();
      logger.info("producer_waitlist_submit_success", { mode: result.mode || "api" });
    } catch (error) {
      setStatus(producerSuccess, messages.producerError);
      logger.warn("producer_waitlist_submit_failed", { message: error.message });
    }
  });
}

function initPrototypeActions() {
  const buyScreenplayButton = getRequiredElement("#buyScreenplayButton");
  const purchaseSuccess = getRequiredElement("#purchaseSuccess");
  const generateOutlineButton = getRequiredElement("#generateOutlineButton");
  const generationSuccess = getRequiredElement("#generationSuccess");

  buyScreenplayButton.addEventListener("click", () => {
    setStatus(purchaseSuccess, messages.purchaseSuccess);
    logger.info("purchase_demo_started", { item: "The Last Beacon" });
  });

  generateOutlineButton.addEventListener("click", () => {
    setStatus(generationSuccess, messages.generationSuccess);
    logger.info("generation_demo_started", { stage: "beat_outline" });
  });
}

export function initForms() {
  initThemeSelector();
  initCoverageForm();
  initContactForm();
  initProducerForm();
  initPrototypeActions();
}

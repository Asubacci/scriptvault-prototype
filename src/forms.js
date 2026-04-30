import { messages } from "./data/messages.js";
import { getStoredApiSettings } from "./settings.js";
import { getRequiredElement } from "./utils/dom.js";
import { logger } from "./utils/logger.js";

function setStatus(element, message) {
  element.textContent = message;
  element.tabIndex = -1;
  element.focus({ preventScroll: true });
}

function getApiBaseUrl() {
  return getStoredApiSettings().apiUrl;
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
  const coverageDemoReport = getRequiredElement("#coverageDemoReport");
  const coverageDemoTitle = getRequiredElement("#coverageDemoTitle");

  coverageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const unchecked = coverageForm.querySelectorAll(".disclaimer-box input[type='checkbox']:not(:checked)");

    if (unchecked.length > 0) {
      setStatus(coverageError, messages.coverageIncomplete);
      unchecked[0].focus();
      logger.warn("coverage_submit_blocked", { uncheckedCount: unchecked.length });
      return;
    }

    const title = coverageForm.querySelector("input")?.value.trim() || "Untitled Screenplay";
    coverageDemoTitle.textContent = `Coverage Report: ${title}`;
    coverageDemoReport.classList.remove("hidden");
    setStatus(coverageError, messages.coverageSuccess);
    coverageDemoReport.scrollIntoView({ behavior: "smooth", block: "center" });
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
  const purchaseDemoResult = getRequiredElement("#purchaseDemoResult");
  const generateOutlineButton = getRequiredElement("#generateOutlineButton");
  const generationSuccess = getRequiredElement("#generationSuccess");
  const downloadSampleCoverageButton = getRequiredElement("#downloadSampleCoverageButton");

  buyScreenplayButton.addEventListener("click", () => {
    purchaseDemoResult.classList.remove("hidden");
    setStatus(purchaseSuccess, messages.purchaseSuccess);
    purchaseDemoResult.scrollIntoView({ behavior: "smooth", block: "center" });
    logger.info("purchase_demo_started", { item: "The Last Beacon" });
  });

  generateOutlineButton.addEventListener("click", () => {
    setStatus(generationSuccess, messages.generationSuccess);
    logger.info("generation_demo_started", { stage: "beat_outline" });
  });

  downloadSampleCoverageButton.addEventListener("click", () => {
    const reportText = [
      "ScriptVault Sample Coverage Report",
      "",
      "Final Score: 82 / 100",
      "Marketplace: Eligible after rewrite",
      "Turnaround: 2-5 business days",
      "",
      "Reader Notes:",
      "The premise has strong commercial appeal for a contained Lagos thriller, but the midpoint needs a sharper reversal and the antagonist's goal should become visible earlier.",
      "",
      "Rewrite Priorities:",
      "1. Reduce locations from 11 to 6 for a stronger low-budget production path.",
      "2. Give the lead character a clearer moral choice before the climax.",
      "3. Trim exposition-heavy dialogue in scenes 8, 14, and 22.",
    ].join("\n");
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "scriptvault-sample-coverage-report.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    logger.info("sample_coverage_report_downloaded");
  });
}

export function initForms() {
  initThemeSelector();
  initCoverageForm();
  initContactForm();
  initProducerForm();
  initPrototypeActions();
}

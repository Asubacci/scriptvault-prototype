import { messages } from "./data/messages.js";
import { getRequiredElement } from "./utils/dom.js";
import { logger } from "./utils/logger.js";

function setStatus(element, message) {
  element.textContent = message;
  element.tabIndex = -1;
  element.focus({ preventScroll: true });
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

  producerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus(producerSuccess, messages.producerSuccess);
    producerForm.reset();
    logger.info("producer_waitlist_submit_success");
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

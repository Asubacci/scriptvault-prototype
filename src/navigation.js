import { getElements } from "./utils/dom.js";
import { logger } from "./utils/logger.js";

const defaultView = "home";

export function initNavigation() {
  const navTriggers = getElements("[data-view]");
  const views = getElements(".view");

  function showView(id, options = {}) {
    const { updateHash = true } = options;
    const hasView = views.some((view) => view.id === id);

    if (!hasView) {
      logger.warn("missing_view", { id });
      return;
    }

    views.forEach((view) => view.classList.toggle("active", view.id === id));
    getElements(".nav-item").forEach((button) => {
      const isActive = button.dataset.view === id;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    if (updateHash && window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    logger.info("view_changed", { id });
  }

  navTriggers.forEach((button) => {
    button.setAttribute("aria-controls", button.dataset.view);
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  window.addEventListener("hashchange", () => {
    const hashView = window.location.hash.replace("#", "") || defaultView;
    showView(hashView, { updateHash: false });
  });

  const initialView = window.location.hash.replace("#", "") || defaultView;
  showView(initialView, { updateHash: false });
}

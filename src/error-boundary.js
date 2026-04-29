import { messages } from "./data/messages.js";
import { logger } from "./utils/logger.js";

function showFallback(message) {
  let fallback = document.querySelector(".app-error");

  if (!fallback) {
    fallback = document.createElement("div");
    fallback.className = "app-error";
    fallback.setAttribute("role", "alert");
    document.body.prepend(fallback);
  }

  fallback.textContent = message;
}

export function registerGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    logger.error("runtime_error", { message: event.message, source: event.filename });
    showFallback(messages.unexpectedError);
  });

  window.addEventListener("unhandledrejection", (event) => {
    logger.error("unhandled_rejection", { reason: String(event.reason) });
    showFallback(messages.unexpectedError);
  });
}

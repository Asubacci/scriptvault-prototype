import { registerGlobalErrorHandlers } from "./error-boundary.js";
import { initAdminWaitlist } from "./admin.js";
import { initForms } from "./forms.js";
import { initNavigation } from "./navigation.js";
import { applyReviewUpdates } from "./review-updates.js";
import { logger } from "./utils/logger.js";

registerGlobalErrorHandlers();

try {
  applyReviewUpdates();
  initNavigation();
  initForms();
  initAdminWaitlist();
  logger.info("app_initialized");
} catch (error) {
  logger.error("app_initialization_failed", { message: error.message });
  throw error;
}

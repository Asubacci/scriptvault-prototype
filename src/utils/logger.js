const levels = {
  info: "info",
  warn: "warn",
  error: "error",
};

function write(level, event, details = {}) {
  const entry = {
    level,
    event,
    details,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("scriptvault:log", { detail: entry }));
}

export const logger = {
  info(event, details) {
    write(levels.info, event, details);
  },
  warn(event, details) {
    write(levels.warn, event, details);
  },
  error(event, details) {
    write(levels.error, event, details);
  },
};

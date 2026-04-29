export function getRequiredElement(selector, root = document) {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

export function getElements(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

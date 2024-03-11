/**
 * Selects a DOM element based on a variety of input types.
 */
export function domSelector<T extends Element>(selector: Node | string, parent: Element | Document = document): T | null {
  // Validate the type of the incoming selector
  if (!(selector instanceof Node) && typeof selector !== 'string') {
    throw new Error('There is no valid selector.');
  }

  // Handle Node instances
  if (selector instanceof Node) {
    // Skip non-element nodes like text or comment nodes
    if (selector.nodeType === Node.ELEMENT_NODE) {
      return selector as T;
    }
    return null;
  }

  // Parse incoming string as HTML and find the first element node
  const newDocument = new DOMParser().parseFromString(selector, 'text/html');
  if (newDocument.body.firstChild?.nodeType === Node.ELEMENT_NODE) {
    return newDocument.body.firstChild as T;
  }

  // Query selects within the specified parent if other methods fail
  return parent.querySelector(selector);
}

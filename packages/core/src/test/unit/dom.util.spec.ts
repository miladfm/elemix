import { domSelector } from '../../lib/dom/dom.util';

describe('Util - domSelector', () => {
  describe('Valid Selectors', () => {
    let parentDiv: HTMLDivElement;

    beforeEach(() => {
      parentDiv = document.createElement('div');
      parentDiv.innerHTML = `<span class="child"></span>`;
      document.body.appendChild(parentDiv);
    });

    afterEach(() => {
      document.body.removeChild(parentDiv);
    });

    it('should return the same Node when a Node is provided', () => {
      const node = document.createElement('div');
      expect(domSelector(node)).toBe(node);
    });

    it('should return an element when an HTML string is provided', () => {
      const element = domSelector('<div></div>');
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    it('should return only the first element when multiple HTML elements are provided in a string', () => {
      const element = domSelector('<div></div><span></span>');
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    it('should return an element as a child of the provided parent element when the parent element is specified', () => {
      const element = domSelector('.child', parentDiv);
      expect(element).toBeInstanceOf(HTMLSpanElement);
    });

    it('should return an element from the document when no parent element is specified', () => {
      const element = domSelector('.child');
      expect(element).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Invalid Selectors', () => {
    it('should throw an error when an invalid selector is provided', () => {
      expect(() => domSelector(null as unknown as Node)).toThrow('There is no valid selector.');
    });

    it('should return null when a non-existing selector is provided', () => {
      const element = domSelector('.non-existent');
      expect(element).toBeNull();
    });

    it('should return null when a non-element Node is provided', () => {
      const textNode = document.createTextNode('some text');
      expect(domSelector(textNode)).toBeNull();
    });
  });
});

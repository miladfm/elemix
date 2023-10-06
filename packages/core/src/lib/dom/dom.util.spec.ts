import { domSelector } from './dom.util';

describe('domSelector', () => {
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

    test('should return the Node when passed a Node', () => {
      const node = document.createElement('div');
      expect(domSelector(node)).toBe(node);
    });

    test('should create an element from the HTML string', () => {
      const element = domSelector('<div></div>');
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    test('should return only the first element from an HTML string with multiple elements', () => {
      const element = domSelector('<div></div><span></span>');
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    test('should return the child element when searching within a parent', () => {
      const element = domSelector('.child', parentDiv);
      expect(element).toBeInstanceOf(HTMLSpanElement);
    });

    test('should return the element when searching without specifying a parent', () => {
      const element = domSelector('.child');
      expect(element).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Invalid Selectors', () => {
    test('should throw an error for invalid selector', () => {
      expect(() => domSelector(null as unknown as Node)).toThrow('There is no valid selector.');
    });

    test('should return null for non-existing selector', () => {
      const element = domSelector('.non-existent');
      expect(element).toBeNull();
    });

    test('should return null for a non-element Node', () => {
      const textNode = document.createTextNode('some text');
      expect(domSelector(textNode)).toBeNull();
    });
  });
});

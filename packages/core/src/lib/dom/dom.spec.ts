import { Dom } from './dom';

describe('Dom Class - HTMLElement', () => {
  // Initialize a DOM element
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    // Mocking offsetWidth and offsetHeight because these values can be unreliable in a test environment
    Object.defineProperty(element, 'offsetWidth', { configurable: true, value: 200 });
    Object.defineProperty(element, 'offsetHeight', { configurable: true, value: 300 });
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should construct Dom instance from HTMLElement', () => {
    const domInstance = new Dom(element);
    expect(domInstance.target).toEqual(element);
  });

  it('should throw error if no target is found', () => {
    expect(() => new Dom('non-existent', document)).toThrow('No element was found');
  });

  it('should set styles immediately', () => {
    const domInstance = new Dom(element);
    domInstance.setStyleImmediately('opacity', '0.5');
    expect(element.style.opacity).toBe('0.5');
  });

  it('should get width and height', () => {
    const domInstance = new Dom(element);
    expect(domInstance.width).toBe(200);
    expect(domInstance.height).toBe(300);
  });

  it('should get dimension', () => {
    const domInstance = new Dom(element);
    expect(domInstance.dimension).toEqual({ width: 200, height: 300 });
  });

  it('should querySelector', () => {
    const childElem = document.createElement('span');
    element.appendChild(childElem);
    const domInstance = new Dom(element);
    expect(domInstance.querySelector('span')).toEqual(childElem);
  });

  test('should append the element to a parent', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    const domParent = new Dom(parent);
    const domChild = new Dom(child);

    domChild.appendTo(domParent);
    expect(parent.children).toContain(child);
  });

  test('should append a child element', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    const domParent = new Dom(parent);
    const domChild = new Dom(child);

    domParent.appendChild(domChild);
    expect(parent.children).toContain(child);
  });

  test('should add a class to the element', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    domInstance.addClass('new-class');

    expect(elem.classList).toContain('new-class');
  });

  test('should remove a class from the element', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    elem.classList.add('old-class');

    domInstance.removeClass('old-class');
    expect(elem.classList).not.toContain('old-class');
  });

  test('should set an attribute', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    domInstance.setAttribute('data-test', 'value');

    expect(elem.getAttribute('data-test')).toBe('value');
  });

  test('should get an attribute value', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    elem.setAttribute('data-test', 'value');

    expect(domInstance.getAttribute('data-test')).toBe('value');
  });
});

describe('Dom Class - SVG Elements', () => {
  let svgElem: SVGSVGElement;

  beforeEach(() => {
    svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElem.getBBox = jest.fn().mockReturnValue({ width: 100, height: 200 });
    document.body.appendChild(svgElem);
  });

  afterEach(() => {
    document.body.removeChild(svgElem);
  });

  test('should correctly get width of SVG element', () => {
    const domInstance = new Dom(svgElem);
    expect(domInstance.width).toBe(100);
  });

  test('should correctly get height of SVG element', () => {
    const domInstance = new Dom(svgElem);
    expect(domInstance.height).toBe(200);
  });
});

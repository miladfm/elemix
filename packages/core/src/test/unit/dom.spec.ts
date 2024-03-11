import { Dom } from '../../lib/dom/dom';
import { Observable } from 'rxjs';

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

  it('should initialize correctly when passed a valid HTMLElement', () => {
    const domInstance = new Dom(element);
    expect(domInstance.nativeElement).toEqual(element);
  });

  it('should throw an error when no target is found', () => {
    expect(() => new Dom('non-existent', document)).toThrow('No element was found');
  });

  it('should update the DOM styles immediately when setStyleImmediately is called', () => {
    const domInstance = new Dom(element);
    domInstance.setStyleImmediately('opacity', '0.5');
    expect(element.style.opacity).toBe('0.5');
  });

  it('should return the width of the HTMLElement when width is called', () => {
    const domInstance = new Dom(element);
    expect(domInstance.width).toBe(200);
  });

  it('should return the height of the HTMLElement when height is called', () => {
    const domInstance = new Dom(element);
    expect(domInstance.height).toBe(300);
  });

  it('should return the dimensions of the HTMLElement when dimension is called', () => {
    const domInstance = new Dom(element);
    expect(domInstance.dimension).toEqual({ width: 200, height: 300 });
  });

  it('should return the child HTMLElement when querySelector is called', () => {
    const childElem = document.createElement('span');
    element.appendChild(childElem);
    const domInstance = new Dom(element);
    expect(domInstance.querySelector('span')).toEqual(childElem);
  });

  it('should return all children HTMLElement when querySelectorAll is called', () => {
    const firstChildElem = document.createElement('span');
    const secondChildElem = document.createElement('span');
    element.appendChild(firstChildElem);
    element.appendChild(secondChildElem);
    const domInstance = new Dom(element);

    const selector = domInstance.querySelectorAll('span');
    expect(selector.length).toEqual(2);
    expect(selector[0]).toEqual(firstChildElem);
    expect(selector[1]).toEqual(secondChildElem);
  });

  it('should append the element to a parent when appendTo is called', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    const domParent = new Dom(parent);
    const domChild = new Dom(child);

    domChild.appendTo(domParent);
    expect(parent.children).toContain(child);
  });

  it('should append an element as a child when appendChild is called', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    const domParent = new Dom(parent);
    const domChild = new Dom(child);

    domParent.appendChild(domChild);
    expect(parent.children).toContain(child);
  });

  it('should add the provided class to the element when addClass is called', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    domInstance.addClass('new-class');

    expect(elem.classList).toContain('new-class');
  });

  it('should remove the provided class from the element when removeClass is called', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    elem.classList.add('old-class');

    domInstance.removeClass('old-class');
    expect(elem.classList).not.toContain('old-class');
  });

  it('should set the provided attribute to the element when setAttribute is called', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    domInstance.setAttribute('data-test', 'value');

    expect(elem.getAttribute('data-test')).toBe('value');
  });

  it('should return the value of the provided attribute when getAttribute is called', () => {
    const elem = document.createElement('div');
    const domInstance = new Dom(elem);
    elem.setAttribute('data-test', 'value');

    expect(domInstance.getAttribute('data-test')).toBe('value');
  });

  describe('Dom Class - HTMLElement - observeResize$', () => {
    let observeResize$: Observable<any>;
    let mockObserve: jest.Mock;
    let mockDisconnect: jest.Mock;

    beforeEach(() => {
      mockObserve = jest.fn();
      mockDisconnect = jest.fn();

      global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      }));

      observeResize$ = new Dom(document.createElement('div')).observeResize$();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should not observe the element when there is no subscription', () => {
      expect(mockObserve).not.toHaveBeenCalled();
    });
    it('should observe the element when there is a subscription', () => {
      observeResize$.subscribe();
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
    it('should observe the element only once when there is more than one subscription', () => {
      observeResize$.subscribe();
      observeResize$.subscribe();
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
    it('should not disconnect the element when not all subscription has unsubscribed', () => {
      observeResize$.subscribe();
      const subscription = observeResize$.subscribe();
      subscription.unsubscribe();
      expect(mockDisconnect).not.toHaveBeenCalled();
    });
    it('should disconnect the element when there all subscription has unsubscribed', () => {
      const subscription1 = observeResize$.subscribe();
      const subscription2 = observeResize$.subscribe();
      subscription1.unsubscribe();
      subscription2.unsubscribe();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
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

  it('should return the width of SVGElement when width is called', () => {
    const domInstance = new Dom(svgElem);
    expect(domInstance.width).toBe(100);
  });

  it('should return the height of SVGElement when height is called', () => {
    const domInstance = new Dom(svgElem);
    expect(domInstance.height).toBe(200);
  });
});

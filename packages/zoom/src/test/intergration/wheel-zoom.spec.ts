import { generateCustomEvent, mockBasicRequestAnimationFrame, mockEventListener } from '@internal-lib/util-testing';
import { WheelZoom } from '../../lib/wheel-zoom/wheel-zoom';

describe('Feature - Wheel Zoom', () => {
  let element: HTMLElement;
  let wheelZoom: WheelZoom;

  const dispatchWheel = (offsetX: number, offsetY: number, deltaY: number, ctrlKey = false) => {
    const event = generateCustomEvent('wheel', { offsetX, offsetY, deltaY, ctrlKey });
    element.dispatchEvent(event);
  };

  beforeEach(() => {
    element = document.createElement('div');

    mockEventListener(element);
    mockBasicRequestAnimationFrame();

    wheelZoom = new WheelZoom(element, {
      minScale: 0.5,
      maxScale: 2,
      wheelDeltaFactor: 0.02,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Initialized Wheel Zoom', () => {
    // Init
    it(`should only listen to 'wheel' event when wheel-zoom is initialized`, () => {
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), undefined);
    });

    // Enable
    it(`should not listen to 'wheel' more than once when the enabled method has called more than one times`, () => {
      wheelZoom.enable();
      wheelZoom.enable();

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), undefined);
    });
    it(`should listen to 'wheel' only once when the enable method is called`, () => {
      wheelZoom.disable();
      jest.clearAllMocks();
      wheelZoom.enable();

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), undefined);
    });
    it(`should 'isEnabled' be true when the enabled method has called`, () => {
      wheelZoom.enable();
      expect(wheelZoom.isEnable).toBe(true);
    });

    // Disabled
    it(`should 'isEnabled' be false when the disabled method has called`, () => {
      wheelZoom.disable();
      expect(wheelZoom.isEnable).toBe(false);
    });
    it(`should remove all event listener when disabled method has called`, () => {
      wheelZoom.disable();
      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), undefined);
    });
  });

  describe('Zoom In/Out Wheel Zoom', () => {
    it(`should zoom in the element based on 'wheelDeltaFactor' at the mouse coordinates when a pinch wheel event is triggered once from touchpad`, () => {
      dispatchWheel(20, 50, -12, true);

      expect(element.style.transform).toContain('translate(-4.8px, -12px)');
      expect(element.style.transform).toContain('scale(1.24, 1.24)');
    });
    it(`should zoom in the element based on 'wheelDeltaFactor' at the mouse coordinates when a pinch wheel event is triggered multiple times from touchpad`, () => {
      dispatchWheel(20, 50, -12, true);
      dispatchWheel(50, 20, -10, true);

      expect(element.style.transform).toContain('translate(-14.8px, -16px)');
      expect(element.style.transform).toContain('scale(1.44, 1.44)');
    });
    it(`should zoom in the element based on 'wheelDeltaFactor' at the mouse coordinates when a wheel event is triggered once`, () => {
      dispatchWheel(20, 50, 12);

      expect(element.style.transform).toContain('translate(-4.8px, -12px)');
      expect(element.style.transform).toContain('scale(1.24, 1.24)');
    });
    it(`should zoom in the element based on 'wheelDeltaFactor' at the mouse coordinates when a wheel event is triggered multiple times`, () => {
      dispatchWheel(20, 50, 12);
      dispatchWheel(50, 20, 10);

      expect(element.style.transform).toContain('translate(-14.8px, -16px)');
      expect(element.style.transform).toContain('scale(1.44, 1.44)');
    });
    it(`should not zoom in beyond the maximum zoom level when a wheel event is triggered`, () => {
      dispatchWheel(20, 50, 12);
      dispatchWheel(50, 20, 10);
      dispatchWheel(10, 10, 20);
      dispatchWheel(10, 10, 20); // Last event
      expect(element.style.transform).toContain('translate(-20.4px, -21.6px)');
      expect(element.style.transform).toContain('scale(2, 2)');

      dispatchWheel(10, 10, 20); // // Should not do anything
      expect(element.style.transform).toContain('translate(-20.4px, -21.6px)');
      expect(element.style.transform).toContain('scale(2, 2)');
    });

    it(`should zoom out the element based on 'wheelDeltaFactor' at the mouse coordinates when a pinch wheel event is triggered once from touchpad`, () => {
      dispatchWheel(20, 50, 12, true);

      expect(element.style.transform).toContain('translate(4.8px, 12px)');
      expect(element.style.transform).toContain('scale(0.76, 0.76)');
    });
    it(`should zoom out the element based on 'wheelDeltaFactor' at the mouse coordinates when a pinch wheel event is triggered multiple times from touchpad`, () => {
      dispatchWheel(20, 50, 12, true);
      dispatchWheel(50, 20, 10, true);

      expect(element.style.transform).toContain('translate(14.8px, 16px)');
      expect(element.style.transform).toContain('scale(0.56, 0.56)');
    });
    it(`should zoom out the element based on 'wheelDeltaFactor' at the mouse coordinates when a wheel event is triggered once`, () => {
      dispatchWheel(20, 50, -12);

      expect(element.style.transform).toContain('translate(4.8px, 12px)');
      expect(element.style.transform).toContain('scale(0.76, 0.76)');
    });
    it(`should zoom out the element based on 'wheelDeltaFactor' at the mouse coordinates when a wheel event is triggered multiple times`, () => {
      dispatchWheel(20, 50, -12);
      dispatchWheel(50, 20, -10);

      expect(element.style.transform).toContain('translate(14.8px, 16px)');
      expect(element.style.transform).toContain('scale(0.56, 0.56)');
    });
    it(`should not zoom out beyond the minimum zoom level when a wheel event is triggered`, () => {
      dispatchWheel(20, 50, -12);
      dispatchWheel(50, 20, -10);
      dispatchWheel(50, 20, -20); // Last event

      expect(element.style.transform).toContain('translate(17.8px, 17.2px)');
      expect(element.style.transform).toContain('scale(0.5, 0.5)');

      dispatchWheel(50, 20, -20); // Last event

      expect(element.style.transform).toContain('translate(17.8px, 17.2px)');
      expect(element.style.transform).toContain('scale(0.5, 0.5)');
    });

    it(`should zoom in/out only the target element when multi wheel-zoom element exist`, () => {
      const secondElement = document.createElement('div');
      new WheelZoom(secondElement);

      dispatchWheel(10, 10, 20);
      dispatchWheel(20, 20, -10);

      expect(element.style.transform).toContain('translate(1px, 1px)');
      expect(element.style.transform).toContain('scale(1.1, 1.1)');
      expect(secondElement.style.transform).toBe('');
    });
    it(`should not zoom in/out when the wheel zoom feature is disabled`, () => {
      wheelZoom.disable();
      dispatchWheel(10, 10, 20);
      dispatchWheel(20, 20, -10);

      expect(element.style.transform).toBe('');
    });
  });
});

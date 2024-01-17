import { Zoom } from '../../lib/zoom/zoom';
import { ClickZoom } from '../../lib/click-zoom/click-zoom';
import { PinchZoom } from '../../lib/pinch-zoom/pinch-zoom';
import { WheelZoom } from '../../lib/wheel-zoom/wheel-zoom';
import { mockRequestAnimationFrame } from '@internal-lib/util-testing';

jest.mock('../../lib/pinch-zoom/pinch-zoom', () => ({
  PinchZoom: jest.fn(),
}));

jest.mock('../../lib/click-zoom/click-zoom', () => ({
  ClickZoom: jest.fn(),
}));

jest.mock('../../lib/wheel-zoom/wheel-zoom', () => ({
  WheelZoom: jest.fn(),
}));

describe('Feature - Click Zoom', () => {
  let element: HTMLElement;
  let zoom: Zoom;

  const mockPinchZoom = PinchZoom as jest.Mock;
  let mockPinchZoomEnable: jest.Mock;
  let mockPinchZoomDisabled: jest.Mock;

  const mockClickZoom = ClickZoom as jest.Mock;
  let mockClickZoomEnable: jest.Mock;
  let mockClickZoomDisabled: jest.Mock;
  let mockClickZoomCetClickType: jest.Mock;

  const mockWheelZoom = WheelZoom as jest.Mock;
  let mockWheelZoomEnable: jest.Mock;
  let mockWheelZoomDisabled: jest.Mock;

  const initMocks = () => {
    mockRequestAnimationFrame();

    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      ...element.getBoundingClientRect(),
      width: 400,
      height: 400,
    });

    // Pinch Zoom
    mockPinchZoomEnable = jest.fn();
    mockPinchZoomDisabled = jest.fn();
    mockPinchZoom.mockImplementation(() => ({
      enable: mockPinchZoomEnable,
      disable: mockPinchZoomDisabled,
    }));

    // Click Zoom
    mockClickZoomEnable = jest.fn();
    mockClickZoomDisabled = jest.fn();
    mockClickZoomCetClickType = jest.fn();
    mockClickZoom.mockImplementation(() => ({
      enable: mockClickZoomEnable,
      disable: mockClickZoomDisabled,
      setClickType: mockClickZoomCetClickType,
    }));

    // Wheel Zoom
    mockWheelZoomEnable = jest.fn();
    mockWheelZoomDisabled = jest.fn();
    mockWheelZoom.mockImplementation(() => ({
      enable: mockWheelZoomEnable,
      disable: mockWheelZoomDisabled,
    }));
  };

  beforeEach(() => {
    element = document.createElement('div');
    initMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Initialized Zoom', () => {
    // Init
    it(`should initialize the 'PinchZoom', 'ClickZoom', 'WheelZoom' with default options, when 'Zoom' instance has create without any options`, () => {
      zoom = new Zoom(element);

      // Pinch Zoom
      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockPinchZoom).toHaveBeenCalledTimes(1);
      expect(mockPinchZoomEnable).toHaveBeenCalledTimes(1);

      // Click Zoom
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockClickZoom).toHaveBeenCalledTimes(1);
      expect(mockClickZoomEnable).toHaveBeenCalledTimes(1);

      // Wheel Zoom
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockWheelZoom).toHaveBeenCalledTimes(1);
      expect(mockWheelZoomEnable).toHaveBeenCalledTimes(1);
    });
    it(`should initialize the 'PinchZoom', 'ClickZoom', 'WheelZoom' with custom options, when 'Zoom' instance has create with options`, () => {
      zoom = new Zoom(element, {
        minScale: 0.1,
        maxScale: 10,
      });

      // Pinch Zoom
      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockPinchZoom).toHaveBeenCalledTimes(1);
      expect(mockPinchZoomEnable).toHaveBeenCalledTimes(1);

      // Click Zoom
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockClickZoom).toHaveBeenCalledTimes(1);
      expect(mockClickZoomEnable).toHaveBeenCalledTimes(1);

      // Wheel Zoom
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockWheelZoom).toHaveBeenCalledTimes(1);
      expect(mockWheelZoomEnable).toHaveBeenCalledTimes(1);
    });
    it(`should not initialize the 'PinchZoom', when 'skipPinchZoom' is true`, () => {
      zoom = new Zoom(element, {
        minScale: 0.1,
        maxScale: 10,
        skipPinchZoom: true,
      });

      // Pinch Zoom
      expect(mockPinchZoom).not.toHaveBeenCalled();
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
    });
    it(`should not initialize the 'ClickZoom', when 'skipClickZoom' is true`, () => {
      zoom = new Zoom(element, {
        minScale: 0.1,
        maxScale: 10,
        skipClickZoom: true,
      });

      // Pinch Zoom
      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockClickZoom).not.toHaveBeenCalled();
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
    });
    it(`should not initialize the 'WheelZoom', when 'skipWheelZoom' is true`, () => {
      zoom = new Zoom(element, {
        minScale: 0.1,
        maxScale: 10,
        skipWheelZoom: true,
      });

      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0.1, maxScale: 10 });
      expect(mockWheelZoom).not.toHaveBeenCalled();
    });
    it(`should initialize the 'PinchZoom' with 'pinchZoom' options, when 'pinchZoom' exists in zoom options`, () => {
      zoom = new Zoom(element, {
        pinchZoom: {
          minScale: 0,
          maxScale: 2,
          minEventThreshold: 10,
          bounceFactor: 1,
        },
      });

      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0, maxScale: 2, minEventThreshold: 10, bounceFactor: 1 });
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
    });
    it(`should initialize the 'ClickZoom' with 'clickZoom' options, when 'clickZoom' exists in zoom options`, () => {
      zoom = new Zoom(element, {
        clickZoom: {
          minScale: 0,
          maxScale: 2,
          clickScaleFactor: 1.3,
          dblclickScaleFactor: 5,
        },
      });

      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0, maxScale: 2, clickScaleFactor: 1.3, dblclickScaleFactor: 5 });
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
    });
    it(`should initialize the 'WheelZoom' with 'wheelZoom' options, when 'wheelZoom' exists in zoom options`, () => {
      zoom = new Zoom(element, {
        wheelZoom: {
          minScale: 0,
          maxScale: 2,
          wheelDeltaFactor: 0.1,
        },
      });

      expect(mockPinchZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockClickZoom).toHaveBeenCalledWith(element, { minScale: 0.5, maxScale: 6 });
      expect(mockWheelZoom).toHaveBeenCalledWith(element, { minScale: 0, maxScale: 2, wheelDeltaFactor: 0.1 });
    });

    // Enabled
    it(`should enable the 'PinchZoom', 'ClickZoom' and 'WheelZoom' when enable method has called`, () => {
      zoom = new Zoom(element);
      zoom.disable();

      jest.clearAllMocks();
      zoom.enable();
      expect(mockPinchZoomEnable).toHaveBeenCalledTimes(1);
      expect(mockClickZoomEnable).toHaveBeenCalledTimes(1);
      expect(mockWheelZoomEnable).toHaveBeenCalledTimes(1);
    });
    it(`should 'isEnabled' be true when the enable method has called`, () => {
      zoom = new Zoom(element);
      zoom.disable();
      zoom.enable();

      expect(zoom.isEnable).toBe(true);
    });

    // Disable
    it(`should disable the 'PinchZoom', 'ClickZoom' and 'WheelZoom' when disable method has called`, () => {
      zoom = new Zoom(element);
      zoom.disable();

      expect(mockPinchZoomDisabled).toHaveBeenCalledTimes(1);
      expect(mockClickZoomDisabled).toHaveBeenCalledTimes(1);
      expect(mockWheelZoomDisabled).toHaveBeenCalledTimes(1);
    });
    it(`should 'isEnabled' be false when the enable method has called`, () => {
      zoom = new Zoom(element);
      zoom.disable();

      expect(zoom.isEnable).toBe(false);
    });
  });

  describe('Initialized Zoom In', () => {
    beforeEach(() => {
      zoom = new Zoom(element);
    });

    it(`should zoom in the element with animation on the given center coordinates and 'scaleFactor' when the 'zoomIn' method has called`, () => {
      zoom.zoomIn({ scaleFactor: 1.8, center: { x: 10, y: 50 } });
      expect(element.style.transform).toContain('scale(1.8, 1.8)');
      expect(element.style.transform).toContain('translate(-8px, -40px)');
    });
    it(`should zoom in the element with animation on the given center coordinates and default 'scaleFactor' when the 'zoomIn' method has called`, () => {
      zoom.zoomIn({ center: { x: 10, y: 50 } });
      expect(element.style.transform).toContain('scale(1.2, 1.2)');
      expect(element.style.transform).toContain('translate(-2px, -10px)');
    });
    it(`should zoom in the element with animation on the given center x and default 'scaleFactor' and center y when the 'zoomIn' method has called`, () => {
      zoom.zoomIn({ center: { x: 10 } });
      expect(element.style.transform).toContain('scale(1.2, 1.2)');
      expect(element.style.transform).toContain('translate(-2px, -40px)');
    });
    it(`should zoom in the element with animation on the given center y and default 'scaleFactor' and center x when the 'zoomIn' method has called`, () => {
      zoom.zoomIn({ center: { y: 50 } });
      expect(element.style.transform).toContain('scale(1.2, 1.2)');
      expect(element.style.transform).toContain('translate(-40px, -10px)');
    });
    it(`should not zoom in when the zoom feature is disabled`, () => {
      zoom.disable();
      zoom.zoomIn();
      expect(element.style.transform).toBe('');
    });
    it(`should zoom in only the target element when multi zoom element existed`, () => {
      const secondElement = document.createElement('div');
      new Zoom(secondElement);
      zoom.zoomIn();
      expect(element.style.transform).toContain('scale(1.2, 1.2)');
      expect(element.style.transform).toContain('translate(-40px, -40px)');
      expect(secondElement.style.transform).toBe('');
    });
    it(`should not zoom in beyond the maximum zoom level when 'zoomIn' method has called`, () => {
      zoom.zoomIn({ scaleFactor: 2 });
      zoom.zoomIn({ scaleFactor: 2 }); // Last one
      zoom.zoomIn({ scaleFactor: 2 }); // Should not have any effect
      expect(element.style.transform).toContain('scale(6, 6)');
      expect(element.style.transform).toContain('translate(-1000px, -1000px)');
    });
  });

  describe('Initialized Zoom Out', () => {
    beforeEach(() => {
      zoom = new Zoom(element);
    });

    it(`should zoom out the element with animation on the given center coordinates and 'scaleFactor' when the 'zoomOut' method has called`, () => {
      zoom.zoomOut({ scaleFactor: 1.8, center: { x: 10, y: 50 } });
      expect(element.style.transform).toContain('scale(0.56, 0.56)');
      expect(element.style.transform).toContain('translate(4.44px, 22.22px)');
    });
    it(`should zoom out the element with animation on the given center coordinates and default 'scaleFactor' when the 'zoomOut' method has called`, () => {
      zoom.zoomOut({ center: { x: 10, y: 50 } });
      expect(element.style.transform).toContain('scale(0.83, 0.83)');
      expect(element.style.transform).toContain('translate(1.67px, 8.33px)');
    });
    it(`should zoom out the element with animation on the given center x and default 'scaleFactor' and center y when the 'zoomOut' method has called`, () => {
      zoom.zoomOut({ center: { x: 10 } });
      expect(element.style.transform).toContain('scale(0.83, 0.83)');
      expect(element.style.transform).toContain('translate(1.67px, 33.33px)');
    });
    it(`should zoom out the element with animation on the given center y and default 'scaleFactor' and center x when the 'zoomOut' method has called`, () => {
      zoom.zoomOut({ center: { y: 50 } });
      expect(element.style.transform).toContain('scale(0.83, 0.83)');
      expect(element.style.transform).toContain('translate(33.33px, 8.33px)');
    });
    it(`should not zoom out when the zoom feature is disabled`, () => {
      zoom.disable();
      zoom.zoomOut();
      expect(element.style.transform).toBe('');
    });
    it(`should zoom out only the target element when multi zoom element existed`, () => {
      const secondElement = document.createElement('div');
      new Zoom(secondElement);
      zoom.zoomOut();
      expect(element.style.transform).toContain('scale(0.83, 0.83)');
      expect(element.style.transform).toContain('translate(33.33px, 33.33px)');
      expect(secondElement.style.transform).toBe('');
    });
    it(`should not zoom out beyond the minimum zoom level when 'zoomOut' method has called`, () => {
      zoom.zoomOut({ scaleFactor: 2 });
      zoom.zoomOut({ scaleFactor: 2 }); // Last one
      zoom.zoomOut({ scaleFactor: 2 }); // Should not have any effect
      expect(element.style.transform).toContain('scale(0.5, 0.5)');
      expect(element.style.transform).toContain('translate(100px, 100px)');
    });
  });

  describe('Initialized Zoom To', () => {
    beforeEach(() => {
      zoom = new Zoom(element);
    });

    it(`should zoom the element to given scale with animation on the given center coordinates when the 'zoomTo' method has called`, () => {
      zoom.zoomTo(3, { x: 10, y: 50 });
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(element.style.transform).toContain('translate(-20px, -100px)');
    });
    it(`should zoom the element to given scale with animation on the given center x and default center y when the 'zoomTo' method has called`, () => {
      zoom.zoomTo(3, { x: 10 });
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(element.style.transform).toContain('translate(-20px, -400px)');
    });
    it(`should zoom the element to given scale with animation on the given center y and default center x when the 'zoomTo' method has called`, () => {
      zoom.zoomTo(3, { y: 50 });
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(element.style.transform).toContain('translate(-400px, -100px)');
    });
    it(`should not zoom when the zoom feature is disabled`, () => {
      zoom.disable();
      zoom.zoomTo(3);
      expect(element.style.transform).toBe('');
    });
    it(`should zoom only the target element when multi zoom element existed`, () => {
      const secondElement = document.createElement('div');
      new Zoom(secondElement);
      zoom.zoomTo(3);
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(element.style.transform).toContain('translate(-400px, -400px)');
      expect(secondElement.style.transform).toBe('');
    });
    it(`should not zoom in beyond the maximum zoom level when 'zoomIn' method has called`, () => {
      zoom.zoomTo(10);
      expect(element.style.transform).toContain('scale(6, 6)');
      expect(element.style.transform).toContain('translate(-1000px, -1000px)');
    });
    it(`should not zoom out beyond the minimum zoom level when 'zoomOut' method has called`, () => {
      zoom.zoomTo(0);
      expect(element.style.transform).toContain('scale(0.5, 0.5)');
      expect(element.style.transform).toContain('translate(100px, 100px)');
    });
  });
});

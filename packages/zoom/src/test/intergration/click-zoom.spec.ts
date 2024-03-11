import { generateCustomEvent, mockEventListener, mockRequestAnimationFrame, wait } from '@internal-lib/util-testing';
import { ClickZoom } from '../../lib/click-zoom/click-zoom';
import { ClickZoomType } from '../../lib/click-zoom/click-zoom.model';

describe('Feature - Click Zoom', () => {
  let element: HTMLElement;
  let clickZoom: ClickZoom;

  const dispatchClick = (offsetX: number, offsetY: number) => {
    const event = generateCustomEvent('click', { offsetX, offsetY });
    element.dispatchEvent(event);
    return wait(0); // wait until the current event handler with mock animation be finished and then continue.
  };
  const dispatchDblclick = (offsetX: number, offsetY: number) => {
    const event = generateCustomEvent('dblclick', { offsetX, offsetY });
    element.dispatchEvent(event);
    return wait(0); // wait until the current event handler with mock animation be finished and then continue.
  };

  beforeEach(() => {
    element = document.createElement('div');

    mockEventListener(element);

    clickZoom = new ClickZoom(element, {
      minScale: 0.2,
      maxScale: 4,
      clickScaleFactor: 1.5,
      dblclickScaleFactor: 3,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Initialized Click Zoom', () => {
    // Init
    it(`should only listen to 'click' and 'dblclick' event when click-zoom is initialized`, () => {
      expect(element.addEventListener).toHaveBeenCalledTimes(2);
      expect(element.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined);
      expect(element.addEventListener).toHaveBeenCalledWith('dblclick', expect.any(Function), undefined);
    });
    it(`should set the zoom-in cursor for the element when click-zoom is initialized`, () => {
      expect(element.style.cursor).toBe('zoom-in');
    });

    // Enable
    it(`should not listen to 'click' and 'dblclick' more than once when the enabled method has called more than one times`, () => {
      clickZoom.enable();
      clickZoom.enable();

      expect(element.addEventListener).toHaveBeenCalledTimes(2);
      expect(element.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined);
      expect(element.addEventListener).toHaveBeenCalledWith('dblclick', expect.any(Function), undefined);
    });
    it(`should listen to 'click' and 'dblclick' only once when the enable method is called`, () => {
      clickZoom.disable();
      jest.clearAllMocks();
      clickZoom.enable();

      expect(element.addEventListener).toHaveBeenCalledTimes(2);
      expect(element.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined);
      expect(element.addEventListener).toHaveBeenCalledWith('dblclick', expect.any(Function), undefined);
    });
    it(`should 'isEnabled' be true when the enabled method has called`, () => {
      clickZoom.enable();
      expect(clickZoom.isEnable).toBe(true);
    });

    // Disabled
    it(`should 'isEnabled' be false when the disabled method has called`, () => {
      clickZoom.disable();
      expect(clickZoom.isEnable).toBe(false);
    });
    it(`should remove all event listener when disabled method has called`, () => {
      clickZoom.disable();
      expect(element.removeEventListener).toHaveBeenCalledTimes(2);
      expect(element.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined);
      expect(element.removeEventListener).toHaveBeenCalledWith('dblclick', expect.any(Function), undefined);
    });
    it(`should set the default cursor for the element when disabled method has called`, () => {
      clickZoom.disable();
      expect(element.style.cursor).toBe('initial');
    });

    // Destroy
    // TODO: Add scenarios for test the destroy
  });

  describe('Zoom In Click Zoom', () => {
    it(`should zoom in the element with animation on the mouse click coordinates based on the 'clickScaleFactor' when a click event is triggered once`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomIn);
      await dispatchClick(10, 10);

      expect(element.style.transform).toContain('translate(-5px, -5px)');
      expect(element.style.transform).toContain('scale(1.5, 1.5)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    it(`should zoom in the element with animation on the mouse click coordinates based on the 'clickScaleFactor' when a click event is triggered multiple times`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomIn);
      await dispatchClick(10, 10);
      await dispatchClick(20, 50);
      await dispatchClick(50, 20);

      expect(element.style.transform).toContain('translate(-76.5px, -65.1px)');
      expect(element.style.transform).toContain('scale(3.38, 3.38)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    it(`should not zoom in beyond the maximum zoom level when a click event is triggered`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomIn);
      await dispatchClick(10, 10);
      await dispatchClick(20, 50);
      await dispatchClick(50, 20);
      await dispatchClick(10, 10); // Last event
      jest.clearAllMocks();
      await dispatchClick(10, 10); // Should not do anything

      expect(element.style.transform).toContain('translate(-82.7px, -71.3px)');
      expect(element.style.transform).toContain('scale(4, 4)');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it(`should zoom in only the target element when multi click-zoom element exist`, async () => {
      mockRequestAnimationFrame({ frames: 2 });
      clickZoom.setClickType(ClickZoomType.ZoomIn);

      const secondElement = document.createElement('div');
      new ClickZoom(secondElement);

      await dispatchClick(10, 10);

      expect(element.style.transform).toContain('translate(-5px, -5px)');
      expect(element.style.transform).toContain('scale(1.5, 1.5)');
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2); // Base on mockRequestAnimationFrame, each request runs in 2 frames.

      expect(secondElement.style.transform).toBe('');
    });
    it(`should not zoom in when the click zoom feature is disabled`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomIn);
      clickZoom.disable();
      await dispatchClick(10, 10);

      expect(element.style.transform).toContain('');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it(`should mouse cursor be zoom-in when zoom type is zoom-in`, () => {
      clickZoom.setClickType(ClickZoomType.ZoomIn);
      expect(element.style.cursor).toBe('zoom-in');
    });
    it(`should use zoom-in type and correct mouse cursor when zoom-in type is selected and disable then enable method has called`, async () => {
      mockRequestAnimationFrame();

      clickZoom.setClickType(ClickZoomType.ZoomIn);
      clickZoom.disable();
      clickZoom.enable();

      await dispatchClick(10, 10);

      expect(element.style.cursor).toBe('zoom-in');
      expect(element.style.transform).toContain('translate(-5px, -5px)');
      expect(element.style.transform).toContain('scale(1.5, 1.5)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Zoom Out Click Zoom', () => {
    it(`should zoom out the element with animation on the mouse click coordinates based on the 'clickScaleFactor' when a click event is triggered once`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomOut);
      await dispatchClick(10, 10);

      expect(element.style.transform).toContain('translate(3.3px, 3.3px)');
      expect(element.style.transform).toContain('scale(0.67, 0.67)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    it(`should zoom out the element with animation on the mouse click coordinates based on the 'clickScaleFactor' when a click event is triggered multiple times`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomOut);
      await dispatchClick(10, 10);
      await dispatchClick(20, 50);
      await dispatchClick(50, 20);

      expect(element.style.transform).toContain('15.2px, 17.3p');
      expect(element.style.transform).toContain('scale(0.3, 0.3)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    it(`should not zoom out beyond the minimum zoom level when a click event is triggered`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomOut);
      await dispatchClick(10, 10);
      await dispatchClick(20, 50);
      await dispatchClick(50, 20);
      await dispatchClick(10, 10); // Last event
      jest.clearAllMocks();
      await dispatchClick(10, 10); // Should not do anything

      expect(element.style.transform).toContain('translate(16.2px, 18.3px)');
      expect(element.style.transform).toContain('scale(0.2, 0.2)');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it(`should zoom out only the target element when multi click-zoom element exist`, async () => {
      mockRequestAnimationFrame({ frames: 2 });
      clickZoom.setClickType(ClickZoomType.ZoomOut);

      const secondElement = document.createElement('div');
      new ClickZoom(secondElement);

      await dispatchClick(10, 10);

      expect(element.style.transform).toContain('translate(3.3px, 3.3px)');
      expect(element.style.transform).toContain('scale(0.67, 0.67)');
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2); // Base on mockRequestAnimationFrame, each request runs in 2 frames.

      expect(secondElement.style.transform).toBe('');
    });
    it(`should not zoom out when the click zoom feature is disabled`, async () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.ZoomOut);
      clickZoom.disable();
      await dispatchClick(10, 10);

      expect(element.style.transform).toContain('');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it(`should mouse cursor be zoom-out when zoom type is zoom-out`, () => {
      clickZoom.setClickType(ClickZoomType.ZoomOut);
      expect(element.style.cursor).toBe('zoom-out');
    });
    it(`should use zoom-out type and correct mouse cursor when zoom-out type is selected and disable then enable method has called`, async () => {
      mockRequestAnimationFrame();

      clickZoom.setClickType(ClickZoomType.ZoomOut);
      clickZoom.disable();
      clickZoom.enable();

      await dispatchClick(10, 10);

      expect(element.style.cursor).toBe('zoom-out');
      expect(element.style.transform).toContain('translate(3.3px, 3.3px)');
      expect(element.style.transform).toContain('scale(0.67, 0.67)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Double Click Zoom', () => {
    it(`should zoom in the element with animation based on 'dblclickScaleFactor' at the dblclick coordinates when a dblclick event is triggered at the original zoom level`, () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.Dblclick);
      dispatchDblclick(10, 10);

      expect(element.style.transform).toContain('translate(-20px, -20px)');
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    it(`should zoom out the element with animation based on 'dblclickScaleFactor' at the dblclick coordinates when a dblclick event is triggered and the element is not at the original zoom level`, async () => {
      mockRequestAnimationFrame({ frames: 2 });
      clickZoom.setClickType(ClickZoomType.Dblclick);
      await dispatchDblclick(10, 10);
      await dispatchDblclick(50, 50);

      expect(element.style.transform).toContain('translate(80px, 80px)');
      expect(element.style.transform).toContain('scale(1, 1)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it(`should zoom in only the target element when multi click-zoom element exist`, () => {
      mockRequestAnimationFrame({ frames: 2 });
      clickZoom.setClickType(ClickZoomType.Dblclick);

      const secondElement = document.createElement('div');
      const secondClickZoom = new ClickZoom(secondElement);
      secondClickZoom.setClickType(ClickZoomType.Dblclick);

      dispatchDblclick(10, 10);

      expect(element.style.transform).toContain('translate(-20px, -20px)');
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2); // Base on mockRequestAnimationFrame, each request runs in 2 frames.

      expect(secondElement.style.transform).toBe('');
    });
    it(`should zoom out only the target element when multi click-zoom element exist`, async () => {
      mockRequestAnimationFrame({ frames: 2 });
      clickZoom.setClickType(ClickZoomType.Dblclick);

      const secondElement = document.createElement('div');
      const secondClickZoom = new ClickZoom(secondElement);
      secondClickZoom.setClickType(ClickZoomType.Dblclick);

      await dispatchDblclick(10, 10);
      jest.clearAllMocks();
      await dispatchDblclick(50, 50);

      expect(element.style.transform).toContain('translate(80px, 80px)');
      expect(element.style.transform).toContain('scale(1, 1)');
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2); // Base on mockRequestAnimationFrame, each request runs in 2 frames.

      expect(secondElement.style.transform).toBe('');
    });

    it(`should not zoom in when the click zoom feature is disabled`, () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.Dblclick);
      clickZoom.disable();
      dispatchDblclick(10, 10);

      expect(element.style.transform).toBe('');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it(`should not zoom out when the click zoom feature is disabled`, () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.Dblclick);
      dispatchDblclick(10, 10);

      jest.clearAllMocks();
      clickZoom.disable();
      dispatchDblclick(10, 10);

      expect(element.style.transform).toContain('translate(-20px, -20px)');
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it(`should mouse cursor be default when zoom type is dblclick`, () => {
      clickZoom.setClickType(ClickZoomType.Dblclick);
      expect(element.style.cursor).toBe('default');
    });
    it(`should use dblclick type and correct mouse cursor when dblclick type is selected and disable then enable method has called`, () => {
      mockRequestAnimationFrame();
      clickZoom.setClickType(ClickZoomType.Dblclick);
      dispatchDblclick(10, 10);

      expect(element.style.transform).toContain('translate(-20px, -20px)');
      expect(element.style.transform).toContain('scale(3, 3)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(element.style.cursor).toBe('default');
    });
  });
});

import { PinchZoom } from '../../lib/pinch-zoom/pinch-zoom';
import {
  getActiveListener,
  mockBasicRequestAnimationFrame,
  mockEventListener,
  MockPointerEvent,
  mockRequestAnimationFrame,
} from '@internal-lib/util-testing';
import { map, Observable, toArray } from 'rxjs';
import { GesturesEventType, ZoomGesturesEventType } from '@elemix/core';

describe('Feature - Zoom', () => {
  let element: HTMLElement;
  let pinchZoom: PinchZoom;
  let firstEvent: MockPointerEvent;
  let secondEvent: MockPointerEvent;

  beforeEach(() => {
    element = document.createElement('div');

    mockEventListener(element);
    mockEventListener(document);
    mockBasicRequestAnimationFrame();

    firstEvent = new MockPointerEvent({ defaultDownElement: element, defaultCancelElement: element, pointerId: 0 });
    secondEvent = new MockPointerEvent({ defaultDownElement: element, defaultCancelElement: element, pointerId: 1 });
  });

  describe('Initialized', () => {
    beforeEach(() => {
      pinchZoom = new PinchZoom(element);
    });

    // Init
    it(`should 'isEnabled' be true when pinch-zoom functionality is initialized`, () => {
      expect(pinchZoom.isEnable).toEqual(true);
    });
    it(`should only listen to 'pointerdown' event when pinch-zoom is initialized`, () => {
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });

    // Enable
    it(`should not listen to 'pointerdown' more than once when the enabled method has called more than one times`, () => {
      pinchZoom.enable();
      pinchZoom.enable();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it(`should listen to 'pointerdown' only once when the enable method is called`, () => {
      pinchZoom.disable();
      jest.clearAllMocks();
      pinchZoom.enable();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it(`should 'isEnabled' be true when the enabled method has called`, () => {
      pinchZoom.enable();
      expect(pinchZoom.isEnable).toEqual(true);
    });

    // Disabled
    it(`should 'isEnabled' be false when the disabled method has called`, () => {
      pinchZoom.disable();
      expect(pinchZoom.isEnable).toEqual(false);
    });
    it(`should remove all event listener when disabled method has called`, () => {
      pinchZoom.disable();
      expect(getActiveListener(element)).toEqual(0);
      expect(getActiveListener(document)).toEqual(0);
    });

    // Destroy
    // TODO: Add scenarios for test the destroy
  });

  describe('Events', () => {
    let events$: Observable<ZoomGesturesEventType[]>;

    beforeEach(() => {
      pinchZoom = new PinchZoom(element, { minEventThreshold: 1 });
      events$ = pinchZoom.events$.pipe(
        map((e) => e.type),
        toArray()
      );
    });

    it(`should dispatch 'ZoomPress' when 'pointerdown' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomPress, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      pinchZoom.destroy();
    });
    it(`should dispatch 'ZoomStart' when 'pointermove' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomStart, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      pinchZoom.destroy();
    });
    it(`should dispatch 'Zoom' when the second 'pointermove' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Zoom, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 2, y: 2 });
      pinchZoom.destroy();
    });
    it(`should dispatch 'ZoomEnd' when the 'pointerup' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      pinchZoom.destroy();
    });
    it(`should dispatch 'ZoomEnd' when the 'pointercancel' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      pinchZoom.destroy();
    });
    it(`should dispatch 'ZoomRelease' when the 'pointerup' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      pinchZoom.destroy();
    });
    it(`should dispatch 'ZoomRelease' when the 'pointercancel' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      pinchZoom.destroy();
    });
  });

  describe('Basic Pinch Zoom', () => {
    beforeEach(() => {
      pinchZoom = new PinchZoom(element, { minEventThreshold: 1 });
    });

    it(`should 'isZooming' be false when no pinch-zoom action has begun on the element`, () => {
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      expect(pinchZoom.isZooming).toEqual(false);
    });
    it(`should 'isZooming' be true when pinch-zoom action begins on the element`, () => {
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      expect(pinchZoom.isZooming).toEqual(true);
    });
    it(`should correctly update the element's position during pinch zooming`, () => {
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 5, y: 5 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 30, y: 30 });
      expect(element.style.transform).toContain('translate(-10px, -10px)');
      expect(element.style.transform).toContain('scale(2, 2)');
    });
    it(`should correctly update the element's position during multiple pinch-zoom interactions`, () => {
      // First pinch zoom process
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 5, y: 5 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 30, y: 30 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      secondEvent.dispatchUp({ x: 30, y: 30 });

      // Seconds pinch zoom process
      firstEvent.dispatchDown({ x: 50, y: 10 });
      secondEvent.dispatchDown({ x: 10, y: 50 });
      firstEvent.dispatchMove({ x: 40, y: 20 });
      firstEvent.dispatchMove({ x: 30, y: 30 });
      secondEvent.dispatchMove({ x: 20, y: 35 });

      expect(element.style.transform).toContain('translate(27px, 39.3px)');
      expect(element.style.transform).toContain('scale(0.52, 0.52)');
    });
    it(`should prevent zooming if a zoom start event has not been fired`, () => {
      firstEvent.dispatchMove({ x: 5, y: 5 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 30, y: 30 });
      expect(element.style.transform).toEqual('');
      expect(pinchZoom.isZooming).toEqual(false);
    });
    it(`should update only the target element's position when multi pinch-zoom element exist`, () => {
      const secondElement = document.createElement('div');
      const thirdEvent = new MockPointerEvent({ pointerId: 2, defaultDownElement: secondElement, defaultCancelElement: secondElement });
      const fourthEvent = new MockPointerEvent({ pointerId: 3, defaultDownElement: secondElement, defaultCancelElement: secondElement });
      new PinchZoom(secondElement, { minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 5, y: 5 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 30, y: 30 });

      thirdEvent.dispatchDown({ x: 20, y: 20 });
      fourthEvent.dispatchDown({ x: 50, y: 50 });
      thirdEvent.dispatchMove({ x: 0, y: 0 });
      thirdEvent.dispatchMove({ x: 25, y: 25 });
      fourthEvent.dispatchMove({ x: 40, y: 40 });

      expect(element.style.transform).toContain('translate(-10px, -10px)');
      expect(element.style.transform).toContain('scale(2, 2)');

      expect(secondElement.style.transform).toContain('translate(25px, 25px)');
      expect(secondElement.style.transform).toContain('scale(0.3, 0.3)');
    });
    it(`should not update the other element's position during zooming a element`, () => {
      const secondElement = document.createElement('div');
      new PinchZoom(secondElement);

      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 5, y: 5 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 30, y: 30 });

      expect(element.style.transform).toContain('translate(-10px, -10px)');
      expect(element.style.transform).toContain('scale(2, 2)');

      expect(secondElement.style.transform).toEqual('');
    });
  });

  describe('Bounce Pinch Zoom', () => {
    // Min
    it(`should apply the min scale without bounce effect when minScale is set and bounceFactor equals 1`, () => {
      pinchZoom = new PinchZoom(element, { minScale: 1, bounceFactor: 1, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 50, y: 50 });
      firstEvent.dispatchMove({ x: 15, y: 15 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchMove({ x: 40, y: 30 });

      expect(element.style.transform).toContain('translate(-2.5px, -7.5px)');
      expect(element.style.transform).toContain('scale(1, 1)');
    });
    it(`should not enforce min scale limit when minScale is set and bounceFactor equals 0`, () => {
      pinchZoom = new PinchZoom(element, { minScale: 1, bounceFactor: 0, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 50, y: 50 });
      firstEvent.dispatchMove({ x: 15, y: 15 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchMove({ x: 50, y: 40 });

      expect(element.style.transform).toContain('translate(11.275px, 6.275px)');
      expect(element.style.transform).toContain('scale(0.73, 0.73)');
    });
    it(`should continue zooming out with bounce effect when scale is below minScale and bounceFactor is between 0 and 1`, () => {
      pinchZoom = new PinchZoom(element, { minScale: 1, bounceFactor: 0.6, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 50, y: 50 });
      firstEvent.dispatchMove({ x: 15, y: 15 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchMove({ x: 40, y: 35 });

      expect(element.style.transform).toContain('translate(7.692px, 5.192px)');
      expect(element.style.transform).toContain('scale(0.6864, 0.6864)');
    });
    it(`should animate back to minimum scale when zooming ends below minScale and bounceFactor is between 0 and 1`, () => {
      mockRequestAnimationFrame();
      pinchZoom = new PinchZoom(element, { minScale: 1, bounceFactor: 0.6, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 50, y: 50 });
      firstEvent.dispatchMove({ x: 15, y: 15 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchMove({ x: 35, y: 35 });

      jest.clearAllMocks();
      firstEvent.dispatchUp({ x: 20, y: 20 });
      secondEvent.dispatchUp({ x: 70, y: 60 });

      expect(element.style.transform).toContain('translate(6.856px, 6.856px)');
      expect(element.style.transform).toContain('scale(1, 1)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    // Max
    it(`should apply the max scale without bounce effect when maxScale is set and bounceFactor equals 1`, () => {
      pinchZoom = new PinchZoom(element, { maxScale: 2, bounceFactor: 1, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 50, y: 50 });
      secondEvent.dispatchDown({ x: 60, y: 60 });
      firstEvent.dispatchMove({ x: 40, y: 40 });
      firstEvent.dispatchMove({ x: 30, y: 30 });
      secondEvent.dispatchMove({ x: 70, y: 80 });

      expect(element.style.transform).toContain('translate(-50px, -45px)');
      expect(element.style.transform).toContain('scale(2, 2)');
    });
    it(`should not enforce max scale limit when maxScale is set and bounceFactor equals 0`, () => {
      pinchZoom = new PinchZoom(element, { maxScale: 2, bounceFactor: 0, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 50, y: 50 });
      secondEvent.dispatchDown({ x: 60, y: 60 });
      firstEvent.dispatchMove({ x: 40, y: 40 });
      firstEvent.dispatchMove({ x: 30, y: 30 });
      secondEvent.dispatchMove({ x: 95, y: 95 });

      expect(element.style.transform).toContain('translate(-100px, -100px)');
      expect(element.style.transform).toContain('scale(3.25, 3.25)');
    });
    it(`should continue zooming in with bounce effect when scale exceeds maxScale and bounceFactor is between 0 and 1`, () => {
      pinchZoom = new PinchZoom(element, { maxScale: 2, bounceFactor: 0.6, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 50, y: 50 });
      secondEvent.dispatchDown({ x: 60, y: 60 });
      firstEvent.dispatchMove({ x: 40, y: 40 });
      firstEvent.dispatchMove({ x: 30, y: 30 });
      secondEvent.dispatchMove({ x: 80, y: 90 });

      expect(element.style.transform).toContain('translate(-69.32px, -64.32px)');
      expect(element.style.transform).toContain('scale(2.4863999999999997, 2.4863999999999997)');
    });
    it(`should animate back to maximum scale when zooming ends above maxScale and bounceFactor is between 0 and 1 `, () => {
      mockRequestAnimationFrame();
      pinchZoom = new PinchZoom(element, { maxScale: 2, bounceFactor: 0.6, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 50, y: 50 });
      secondEvent.dispatchDown({ x: 60, y: 60 });
      firstEvent.dispatchMove({ x: 40, y: 40 });
      firstEvent.dispatchMove({ x: 30, y: 30 });
      secondEvent.dispatchMove({ x: 70, y: 80 });

      jest.clearAllMocks();
      firstEvent.dispatchUp({ x: 30, y: 30 });
      secondEvent.dispatchUp({ x: 75, y: 85 });

      expect(element.style.transform).toContain('translate(-58.31999999999999px, -53.31999999999999px)');
      expect(element.style.transform).toContain('scale(2, 2)');
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it(`should not animate to any scale when zooming ends within the range of minScale and maxScale`, () => {
      mockRequestAnimationFrame();
      pinchZoom = new PinchZoom(element, { minScale: 1, maxScale: 2, bounceFactor: 0.6, minEventThreshold: 1 });

      firstEvent.dispatchDown({ x: 50, y: 50 });
      secondEvent.dispatchDown({ x: 60, y: 60 });
      firstEvent.dispatchMove({ x: 48, y: 48 });
      firstEvent.dispatchMove({ x: 45, y: 45 });
      secondEvent.dispatchMove({ x: 62, y: 64 });

      jest.clearAllMocks();
      firstEvent.dispatchUp({ x: 45, y: 45 });
      secondEvent.dispatchUp({ x: 62, y: 64 });

      expect(element.style.transform).toContain('translate(-27.5px, -26.5px)');
      expect(element.style.transform).toContain('scale(1.5, 1.5)');
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
  });
});

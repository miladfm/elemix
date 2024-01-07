import { PinchZoom } from '../../lib/pinch-zoom/pinch-zoom';
import { getActiveListener, mockBasicRequestAnimationFrame, mockEventListener, MockPointerEvent } from '@internal-lib/util-testing';
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
    it(`should only listen to 'pointerdown' when pinch-zoom functionality is initialized`, () => {
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });

    // Enable
    it(`should not listen to 'pointerdown' more than one when the enabled method has called more than one times`, () => {
      pinchZoom.enable();
      pinchZoom.enable();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it(`should only listen to 'pointerdown' once when the enabled method has called`, () => {
      pinchZoom.disable();
      jest.clearAllMocks();
      pinchZoom.enable();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it(`should 'isEnabled' be true when when the enabled method has called`, () => {
      pinchZoom.enable();
      expect(pinchZoom.isEnable).toEqual(true);
    });

    // Disabled
    it(`should 'isEnabled' be false when when the disabled method has called`, () => {
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
      pinchZoom = new PinchZoom(element);
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
      pinchZoom = new PinchZoom(element);
    });

    it(`should 'isZooming' be false when the element is no pinch-zoom begins`, () => {
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      expect(pinchZoom.isZooming).toEqual(false);
    });
    it(`should 'isZooming' be true when the element is begins with pinch-zoom`, () => {
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      expect(pinchZoom.isZooming).toEqual(true);
    });
    it(`should update the element's position correctly when it is pinch zooming`, () => {
      firstEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchDown({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 5, y: 5 });
      firstEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 30, y: 30 });
      expect(element.style.transform).toContain('translate(-10px, -10px)');
      expect(element.style.transform).toContain('scale(2, 2)');
    });
    it(`should not allow zooming when zoom start has not fired`, () => {
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
      new PinchZoom(secondElement);

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

      expect(secondElement.style.transform).toContain('translate(5.625px, 5.625px)');
      expect(secondElement.style.transform).toContain('scale(0.5, 0.5)');
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
});

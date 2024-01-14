import { filter, firstValueFrom, map, Observable, toArray } from 'rxjs';
import { clearListenerCallbacks, mockEventListener, MockPointerEvent } from '@internal-lib/util-testing';
import { Gestures } from '../../lib/gestures/gestures';
import { GesturesEventType } from '../../lib/gestures/gestures.model';

describe('Feature - Gestures', () => {
  let element: HTMLDivElement;
  let secondElement: HTMLDivElement;
  let firstEvent: MockPointerEvent;
  let secondEvent: MockPointerEvent;

  let gestures: Gestures;
  let gestureTypesChanges$: Observable<GesturesEventType[]>;

  beforeEach(() => {
    element = document.createElement('div');
    secondElement = document.createElement('div');

    firstEvent = new MockPointerEvent({ defaultDownElement: element, defaultCancelElement: element });
    secondEvent = new MockPointerEvent({
      defaultDownElement: secondElement,
      defaultCancelElement: secondElement,
      pointerId: 1,
    });

    mockEventListener(element);
    mockEventListener(secondElement);
    mockEventListener(document);

    gestures = new Gestures(element, { minDragMovements: 5, minZoomEventThreshold: 1 });

    gestureTypesChanges$ = gestures.changes$.pipe(
      map((e) => e.type),
      toArray()
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    clearListenerCallbacks();
  });

  describe('Initialize and Destroy', () => {
    // Initialize
    it('should listen only to `pointerdown` when a subscription for `changes$` exist', () => {
      gestures.changes$.subscribe();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it('should listen only once to `pointerdown` when multi subscription for `changes$` exist', () => {
      gestures.changes$.subscribe();
      gestures.changes$.subscribe();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it('should not listen to `pointermove`, `pointerup` and `pointercancel` when `pointerdown` on different element has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      secondEvent.dispatchDown({ x: 0, y: 0 });

      expect(element.addEventListener).not.toHaveBeenCalled();
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it('should listen to `pointermove`, `pointerup` and `pointercancel` when `pointerdown` on element has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      firstEvent.dispatchDown({ x: 0, y: 0 });

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.addEventListener).toHaveBeenCalledTimes(2);
      expect(document.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });
    it('should listen only once to `pointermove`, `pointerup` and `pointercancel` when multi subscription for `changes$` exist and `pointerdown` has fired', () => {
      gestures.changes$.subscribe();
      gestures.changes$.subscribe();

      jest.clearAllMocks();
      firstEvent.dispatchDown({ x: 0, y: 0 });

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.addEventListener).toHaveBeenCalledTimes(2);
      expect(document.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });
    it('should remove listener for `pointermove`, `pointerup` and `pointercancel` when `pointerup` event has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });
    it('should remove listener for `pointermove`, `pointerup` and `pointercancel` when `pointercancel` has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });

    it('should not remove and add new listener for `pointermove`, `pointerup` and `pointercancel` when a additional `pointerdown` has fired ', () => {
      gestures.changes$.subscribe();

      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });

      expect(element.removeEventListener).not.toHaveBeenCalled();

      expect(element.addEventListener).toHaveBeenCalledTimes(2);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(element.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.addEventListener).toHaveBeenCalledTimes(2);
      expect(document.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });

    // Destroy
    it('should remove all listener when destroy has called', () => {
      gestures.changes$.subscribe();
      firstEvent.dispatchDown({ x: 0, y: 0 });
      gestures.destroy();

      expect(element.removeEventListener).toHaveBeenCalledTimes(2);
      expect(element.removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(element.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });

    it('should ignore `pointermove`, `pointerup` and `pointercancel` events when the `pointerdown` of the target pointer has not been triggered on element', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toEqual([GesturesEventType.Press, GesturesEventType.DragPress]); // for second pointer to listen to the events
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ x: 0, y: 0 });

      secondEvent.dispatchMove({ x: 10, y: 10 });
      secondEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchUp({ x: 0, y: 0 });

      secondEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 10, y: 10 });
      secondEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchUp({ x: 0, y: 0 });

      gestures.destroy();
    });
  });

  describe('Event Types', () => {
    // Press
    it('should dispatch Press when pointerdown is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Press, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch Press event when a new pointerdown event is triggered and active touches length is bigger than 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Press, 1); // Only for firstPointerdownEvent
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      gestures.destroy();
    });

    // PressRelease
    it('should not dispatch PressRelease when pointerup is triggered and Press has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Press);
        done();
      });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch PressRelease when pointercancel is triggered and Press has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Press);
        done();
      });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should dispatch PressRelease when pointerup is triggered and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.PressRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should dispatch PressRelease when pointercancel is triggered and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.PressRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should not dispatch PressRelease event when pointerup is triggered and active touches length is bigger than 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.PressRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      secondEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch PressRelease event when pointercancel is triggered and active touches length is bigger than 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.PressRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      secondEvent.dispatchCancel({ element, x: 0, y: 0 });
      gestures.destroy();
    });

    // DragPress
    it('should dispatch DragPress when pointerdown is triggered and active touches length is 1.', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragPress, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      gestures.destroy();
    });

    // DragStart
    it('should not dispatch DragStart when pointermove is triggered and active touches length is not 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      gestures.destroy();
    });
    it('should not dispatch DragStart when pointermove is triggered and DragPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      gestures.destroy();
    });

    it('should dispatch DragStart when pointermove is triggered, and X-axis movement from DragPress event is bigger than minMovement', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 5, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch DragStart when pointermove is triggered and X-axis movement from DragPress event is less than minMovement', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragStart);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 4, y: 0 });
      gestures.destroy();
    });

    it('should dispatch DragStart when pointermove is triggered, and Y-axis movement from DragPress event is bigger than minMovement', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 0, y: 5 });
      gestures.destroy();
    });
    it('should not dispatch DragStart when pointermove is triggered and Y-axis movement from DragPress event is less than minMovement.', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragStart);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 0, y: 4 });
      gestures.destroy();
    });

    it(`should dispatch DragStart when pointermove is triggered following a ZoomRelease without checking for minMovement`, (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      secondEvent.dispatchUp({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 4, y: 0 });
      gestures.destroy();
    });

    // Drag
    it('should not dispatch Drag when pointermove is triggered for the second time and active touches length is bigger than 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1); // Only for the firstPointermoveEvent
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });

      secondEvent.dispatchDown({ element, x: 0, y: 0 });

      firstEvent.dispatchMove({ x: 20, y: 20 });
      firstEvent.dispatchMove({ x: 30, y: 30 });
      gestures.destroy();
    });
    it('should not dispatch Drag when pointermove is triggered and DragStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragStart);
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 });

      secondEvent.dispatchDown({ element, x: 0, y: 0 });

      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      gestures.destroy();
    });

    it('should dispatch Drag when pointermove event is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Drag, 1);
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      gestures.destroy();
    });

    // DragEnd
    it('should not dispatch DragEnd when pointerup is triggered and DragStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragEnd);
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch DragEnd when pointercancel is triggered and DragStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragEnd);
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should dispatch DragEnd when pointerup is triggered and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should dispatch DragEnd when pointercancel is triggered, and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should not dispatch DragEnd when pointerdown is triggered and DragStart has not dispatched jet. (changing the type from drag to zoom)', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragEnd);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should dispatch DragEnd when pointerdown is triggered and DragStart has already dispatched. (changing the type from drag to zoom)', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      gestures.destroy();
    });

    // DragRelease
    it('should not dispatch DragRelease when pointerup is triggered and active touches length is not 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      secondEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch DragRelease when pointercancel is triggered and active touches length is not 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      secondEvent.dispatchCancel({ element, x: 0, y: 0 });
      gestures.destroy();
    });

    it('should not dispatch DragRelease when pointerup is triggered and DragPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch DragRelease when pointercancel is triggered and DragPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should dispatch DragRelease when pointerup is triggered and DragPress has already dispatch and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should dispatch DragRelease when pointercancel is triggered and DragPress has already dispatch and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    // ZoomPress
    it('should dispatch ZoomPress when pointerdown is triggered, and active touches length is 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomPress, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      gestures.destroy();
    });

    // ZoomStart
    it('should not dispatch ZoomStart when pointermove is triggered and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomStart);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      gestures.destroy();
    });
    it('should not dispatch ZoomStart when pointermove is triggered and ZoomPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomStart);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 10, y: 10 });
      gestures.destroy();
    });

    it('should dispatch ZoomStart when pointermove is triggered and active touches length is 2 and events length is bigger than min threshold', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomStart, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      gestures.destroy();
    });
    it('should not dispatch ZoomStart when pointermove is triggered and active touches length is 2 and events length is smaller than min threshold', (done) => {
      const gesturesWithThreshold = new Gestures(element, { minDragMovements: 5, minZoomEventThreshold: 2 });

      gesturesWithThreshold.changes$
        .pipe(
          map((e) => e.type),
          toArray()
        )
        .subscribe((types) => {
          expect(types).not.toContain(GesturesEventType.ZoomStart);
          done();
        });

      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });

      gesturesWithThreshold.destroy();
    });

    // Zoom
    it('should not dispatch Zoom when pointermove is triggered for second times and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Zoom);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      gestures.destroy();
    });
    it('should not dispatch Zoom when pointermove is triggered for second times and ZoomStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Zoom);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      gestures.destroy();
    });

    it('should dispatch Zoom when pointermove is triggered for second times and active touches length is 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Zoom, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchMove({ x: 20, y: 20 });
      gestures.destroy();
    });

    // ZoomEnd
    it('should not dispatch ZoomEnd when pointerup is triggered and ZoomStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomEnd);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch ZoomEnd when pointercancel is triggered and ZoomStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomEnd);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should dispatch ZoomEnd when pointerup is triggered and ZoomStart has already detached and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should dispatch ZoomEnd when pointercancel is triggered and ZoomStart has already detached and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    // ZoomRelease
    it('should not dispatch ZoomRelease when pointerup is triggered and active touches length is not 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch ZoomRelease when pointercancel is triggered and active touches length is not 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should not dispatch ZoomRelease when pointerup is triggered and ZoomPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should not dispatch ZoomRelease when pointercancel is triggered and ZoomPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    it('should dispatch ZoomRelease when pointerup is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchUp({ x: 0, y: 0 });
      gestures.destroy();
    });
    it('should dispatch ZoomRelease when pointercancel is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        done();
      });
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 0, y: 0 });
      firstEvent.dispatchCancel({ x: 0, y: 0 });
      gestures.destroy();
    });

    // Order
    it('should dispatch all event only once when the gesture process completed ', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Press, 1);
        expect(types).toContainTimes(GesturesEventType.DragPress, 1);
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        expect(types).toContainTimes(GesturesEventType.Drag, 1);
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        expect(types).toContainTimes(GesturesEventType.ZoomPress, 1);
        expect(types).toContainTimes(GesturesEventType.ZoomStart, 1);
        expect(types).toContainTimes(GesturesEventType.Zoom, 1);
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        expect(types).toContainTimes(GesturesEventType.PressRelease, 1);
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 }); // Press, DragPress
      firstEvent.dispatchMove({ x: 10, y: 10 }); // DragStart
      firstEvent.dispatchMove({ x: 20, y: 20 }); // Drag

      secondEvent.dispatchDown({ element, x: 0, y: 0 }); // DragEnd, ZoomPress
      firstEvent.dispatchMove({ x: 10, y: 10 }); // ZoomStart
      firstEvent.dispatchMove({ x: 20, y: 20 }); // Zoom
      firstEvent.dispatchUp({ x: 0, y: 0 }); // ZoomEnd, ZoomRelease

      secondEvent.dispatchUp({ x: 0, y: 0 }); // DragRelease, PressRelease
      gestures.destroy();
    });
    it('should dispatch all event in correct order when the gesture process completed', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toEqual([
          GesturesEventType.Press,
          GesturesEventType.DragPress,
          GesturesEventType.DragStart,
          GesturesEventType.Drag,
          GesturesEventType.DragEnd,
          GesturesEventType.ZoomPress,
          GesturesEventType.ZoomStart,
          GesturesEventType.Zoom,
          GesturesEventType.ZoomEnd,
          GesturesEventType.ZoomRelease,
          GesturesEventType.DragRelease,
          GesturesEventType.PressRelease,
        ]);
        done();
      });

      firstEvent.dispatchDown({ x: 0, y: 0 }); // Press, DragPress
      firstEvent.dispatchMove({ x: 10, y: 10 }); // DragStart
      firstEvent.dispatchMove({ x: 10, y: 10 }); // Drag

      secondEvent.dispatchDown({ element, x: 0, y: 0 }); // DragEnd, ZoomPress
      firstEvent.dispatchMove({ x: 20, y: 20 }); // ZoomStart
      firstEvent.dispatchMove({ x: 30, y: 30 }); // Zoom
      firstEvent.dispatchUp({ x: 0, y: 0 }); // ZoomEnd, ZoomRelease

      secondEvent.dispatchUp({ x: 0, y: 0 }); // DragRelease, PressRelease
      gestures.destroy();
    });

    // Rerun
    it('should dispatch all gesture events after resetting the gesture cycle', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Press, 2);
        expect(types).toContainTimes(GesturesEventType.PressRelease, 2);

        expect(types).toContainTimes(GesturesEventType.DragPress, 2);
        expect(types).toContainTimes(GesturesEventType.DragStart, 2);
        expect(types).toContainTimes(GesturesEventType.Drag, 2);
        expect(types).toContainTimes(GesturesEventType.DragEnd, 2);
        expect(types).toContainTimes(GesturesEventType.DragRelease, 2);

        expect(types).toContainTimes(GesturesEventType.ZoomPress, 2);
        expect(types).toContainTimes(GesturesEventType.ZoomStart, 2);
        expect(types).toContainTimes(GesturesEventType.Zoom, 2);
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 2);
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 2);
        done();
      });

      // First cycle
      firstEvent.dispatchDown({ x: 0, y: 0 }); // Press, DragPress
      firstEvent.dispatchMove({ x: 10, y: 10 }); // DragStart
      firstEvent.dispatchMove({ x: 20, y: 20 }); // Drag

      secondEvent.dispatchDown({ element, x: 0, y: 0 }); // DragEnd, ZoomPress
      firstEvent.dispatchMove({ x: 30, y: 30 }); // ZoomStart
      firstEvent.dispatchMove({ x: 40, y: 40 }); // Zoom

      firstEvent.dispatchUp({ x: 0, y: 0 });
      secondEvent.dispatchUp({ x: 0, y: 0 }); // DragRelease, PressRelease

      // Second cycle
      firstEvent.dispatchDown({ x: 0, y: 0 }); // Press, DragPress
      firstEvent.dispatchMove({ x: 10, y: 10 }); // DragStart
      firstEvent.dispatchMove({ x: 20, y: 20 }); // Drag

      secondEvent.dispatchDown({ element, x: 0, y: 0 }); // DragEnd, ZoomPress
      firstEvent.dispatchMove({ x: 30, y: 30 }); // ZoomStart
      firstEvent.dispatchMove({ x: 40, y: 40 }); // Zoom

      firstEvent.dispatchUp({ x: 0, y: 0 });
      secondEvent.dispatchUp({ x: 0, y: 0 }); // DragRelease, PressRelease

      gestures.destroy();
    });
  });

  describe('Event Data', () => {
    it('should return the correct PressEvent when Press has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.Press)));
      const downEvent = firstEvent.dispatchDown({ x: 0, y: 0, clientX: 0, clientY: 0 });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.Press,
        pageX: 0,
        pageY: 0,
        clientX: 0,
        clientY: 0,
        event: downEvent,
      });
    });
    it('should return the correct PressReleaseEvent when PressRelease has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.PressRelease)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      const eventUp = firstEvent.dispatchUp({ x: 0, y: 0, clientX: 0, clientY: 0 });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.PressRelease,
        pageX: 0,
        pageY: 0,
        clientX: 0,
        clientY: 0,
        event: eventUp,
      });
    });

    it('should return the correct DragPress event data when DragPress has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragPress)));
      const downEvent = firstEvent.dispatchDown({
        x: 10,
        y: 10,
        clientX: 20,
        clientY: 20,
        movementX: 11,
        movementY: 11,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.DragPress,
        pageX: 10,
        pageY: 10,
        clientX: 20,
        clientY: 20,
        movementX: 11,
        movementY: 11,
        movementXFromPress: 0,
        movementYFromPress: 0,
        movementXFromStart: null,
        movementYFromStart: null,
        event: downEvent,
      });
    });
    it('should return the correct DragStart event data when DragStart has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragStart)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      const moveEvent = firstEvent.dispatchMove({
        x: 10,
        y: 10,
        clientX: 20,
        clientY: 20,
        movementX: 11,
        movementY: 11,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.DragStart,
        pageX: 10,
        pageY: 10,
        clientX: 20,
        clientY: 20,
        movementX: 11,
        movementY: 11,
        movementXFromPress: 10,
        movementYFromPress: 10,
        movementXFromStart: 0,
        movementYFromStart: 0,
        event: moveEvent,
      });
    });
    it('should return the correct Drag event data when Drag has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.Drag)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      const moveEvent = firstEvent.dispatchMove({
        x: 30,
        y: 30,
        clientX: 40,
        clientY: 40,
        movementX: 11,
        movementY: 11,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.Drag,
        pageX: 30,
        pageY: 30,
        clientX: 40,
        clientY: 40,
        movementX: 11,
        movementY: 11,
        movementXFromPress: 30,
        movementYFromPress: 30,
        movementXFromStart: 20,
        movementYFromStart: 20,
        event: moveEvent,
      });
    });
    it('should return the correct DragEnd event data when DragEnd has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragEnd)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      const upEvent = firstEvent.dispatchUp({
        x: 20,
        y: 20,
        clientX: 30,
        clientY: 30,
        movementX: 11,
        movementY: 11,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.DragEnd,
        pageX: 20,
        pageY: 20,
        clientX: 30,
        clientY: 30,
        movementX: 11,
        movementY: 11,
        movementXFromPress: 20,
        movementYFromPress: 20,
        movementXFromStart: 10,
        movementYFromStart: 10,
        event: upEvent,
      });
    });
    it('should return the correct DragRelease event data when DragRelease has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragRelease)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      firstEvent.dispatchMove({ x: 10, y: 10 });
      const upEvent = firstEvent.dispatchUp({
        x: 20,
        y: 20,
        clientX: 30,
        clientY: 30,
        movementX: 11,
        movementY: 11,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.DragRelease,
        pageX: 20,
        pageY: 20,
        clientX: 30,
        clientY: 30,
        movementX: 11,
        movementY: 11,
        movementXFromPress: 20,
        movementYFromPress: 20,
        movementXFromStart: 10,
        movementYFromStart: 10,
        event: upEvent,
      });
    });

    it('should return the correct ZoomPress event data when ZoomPress has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomPress)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      const secondEventDown = secondEvent.dispatchDown({
        element,
        x: 10,
        y: 10,
        clientX: 20,
        clientY: 20,
        offsetX: 30,
        offsetY: 30,
        movementX: 0,
        movementY: 0,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.ZoomPress,

        distance: 14.14,
        scaleFactorFromPress: 1,
        scaleFactorFromStart: null,

        centerPageX: 5,
        centerPageY: 5,
        centerClientX: 10,
        centerClientY: 10,
        centerOffsetX: 15,
        centerOffsetY: 15,
        centerMovementX: 0,
        centerMovementY: 0,

        centerMovementXFromPress: 0,
        centerMovementYFromPress: 0,
        centerMovementXFromStart: null,
        centerMovementYFromStart: null,
        event: secondEventDown,
      });
    });
    it('should return the correct ZoomStart event data when ZoomStart has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomStart)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 10, y: 10 });
      const eventMove = firstEvent.dispatchMove({
        x: 20,
        y: 20,
        clientX: 30,
        clientY: 30,
        offsetX: 40,
        offsetY: 40,
        movementX: 20,
        movementY: 20,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.ZoomStart,

        distance: 14.14,
        scaleFactorFromPress: 1,
        scaleFactorFromStart: 1,

        centerPageX: 15,
        centerPageY: 15,
        centerClientX: 20,
        centerClientY: 20,
        centerOffsetX: 25,
        centerOffsetY: 25,
        centerMovementX: 10,
        centerMovementY: 10,

        centerMovementXFromPress: 10,
        centerMovementYFromPress: 10,
        centerMovementXFromStart: 0,
        centerMovementYFromStart: 0,
        event: eventMove,
      });
    });
    it('should return the correct Zoom event data when Zoom has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.Zoom)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 10, y: 10 });
      secondEvent.dispatchMove({ x: 40, y: 40, movementX: 10, movementY: 10 });
      const eventMove = firstEvent.dispatchMove({
        x: 60,
        y: 60,
        clientX: 70,
        clientY: 70,
        offsetX: 80,
        offsetY: 80,
        movementX: 80,
        movementY: 80,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.Zoom,

        distance: 28.28,
        scaleFactorFromPress: 2,
        scaleFactorFromStart: 0.5,

        centerPageX: 50,
        centerPageY: 50,
        centerClientX: 55,
        centerClientY: 55,
        centerOffsetX: 60,
        centerOffsetY: 60,
        centerMovementX: 45,
        centerMovementY: 45,

        centerMovementXFromPress: 45,
        centerMovementYFromPress: 45,
        centerMovementXFromStart: 30,
        centerMovementYFromStart: 30,
        event: eventMove,
      });
    });
    it('should return the correct ZoomEnd event data when ZoomEnd has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomEnd)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 10, y: 10 });
      secondEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchMove({ x: 30, y: 30, movementX: 10, movementY: 10 });
      firstEvent.dispatchMove({
        x: 60,
        y: 60,
        clientX: 70,
        clientY: 70,
        offsetX: 80,
        offsetY: 80,
        movementX: 90,
        movementY: 90,
      });
      const eventUp = firstEvent.dispatchUp({
        x: 60,
        y: 60,
        clientX: 70,
        clientY: 70,
        offsetX: 80,
        offsetY: 80,
        movementX: 90,
        movementY: 90,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.ZoomEnd,

        distance: 42.43,
        scaleFactorFromPress: 3,
        scaleFactorFromStart: 1.5,

        centerPageX: 45,
        centerPageY: 45,
        centerClientX: 50,
        centerClientY: 50,
        centerOffsetX: 55,
        centerOffsetY: 55,
        centerMovementX: 50,
        centerMovementY: 50,

        centerMovementXFromPress: 40,
        centerMovementYFromPress: 40,
        centerMovementXFromStart: 35,
        centerMovementYFromStart: 35,
        event: eventUp,
      });
    });
    it('should return the correct ZoomRelease event data when ZoomRelease has dispatched', async () => {
      const gesturesEvent = firstValueFrom(gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomRelease)));
      firstEvent.dispatchDown({ x: 0, y: 0 });
      secondEvent.dispatchDown({ element, x: 10, y: 10 });
      secondEvent.dispatchMove({ x: 20, y: 20 });
      secondEvent.dispatchMove({ x: 30, y: 30, movementX: 10, movementY: 10 });
      firstEvent.dispatchMove({
        x: 60,
        y: 60,
        clientX: 70,
        clientY: 70,
        offsetX: 80,
        offsetY: 80,
        movementX: 90,
        movementY: 90,
      });
      const eventUp = firstEvent.dispatchUp({
        x: 60,
        y: 60,
        clientX: 70,
        clientY: 70,
        offsetX: 80,
        offsetY: 80,
        movementX: 90,
        movementY: 90,
      });
      gestures.destroy();

      expect(await gesturesEvent).toEqual({
        type: GesturesEventType.ZoomRelease,

        distance: 42.43,
        scaleFactorFromPress: 3,
        scaleFactorFromStart: 1.5,

        centerPageX: 45,
        centerPageY: 45,
        centerClientX: 50,
        centerClientY: 50,
        centerOffsetX: 55,
        centerOffsetY: 55,
        centerMovementX: 50,
        centerMovementY: 50,

        centerMovementXFromPress: 40,
        centerMovementYFromPress: 40,
        centerMovementXFromStart: 35,
        centerMovementYFromStart: 35,
        event: eventUp,
      });
    });
  });
});

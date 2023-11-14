import { clearCallbacks, generateCustomEvent, mockEventListener } from '@internal-lib/util-testing';
import { Gestures } from '../../lib/gestures/gestures';
import { filter, map, Observable, toArray } from 'rxjs';
import { DragGesturesEvent, GesturesEventType } from '../../lib/gestures/gestures.model';

type MockPointerEvent = CustomEvent<unknown> & {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  movementX: number;
  movementY: number;
};

let FIRST_POINTER_DOWN: Partial<PointerEvent>;
let FIRST_POINTER_MOVE: Partial<PointerEvent>;
let FIRST_ADDITIONAL_POINTER_MOVE: Partial<PointerEvent>;
let FIRST_POINTER_UP: Partial<PointerEvent>;
let SECOND_POINTER_DOWN: Partial<PointerEvent>;
let SECOND_POINTER_MOVE: Partial<PointerEvent>;
let SECOND_ADDITIONAL_POINTER_MOVE: Partial<PointerEvent>;
let SECOND_POINTER_UP: Partial<PointerEvent>;

function resetPointerEventData() {
  FIRST_POINTER_DOWN = {
    pointerId: 1,
    pageX: 100,
    pageY: 400,
    clientX: 100,
    clientY: 200,
    movementX: 0,
    movementY: 0,
  };
  FIRST_POINTER_MOVE = {
    pointerId: 1,
    pageX: 150,
    pageY: 450,
    clientX: 150,
    clientY: 250,
    movementX: 50,
    movementY: 50,
  };
  FIRST_ADDITIONAL_POINTER_MOVE = {
    pointerId: 1,
    pageX: 160,
    pageY: 460,
    clientX: 160,
    clientY: 260,
    movementX: 10,
    movementY: 10,
  };
  FIRST_POINTER_UP = {
    pointerId: 1,
    pageX: 200,
    pageY: 500,
    clientX: 200,
    clientY: 300,
    movementX: 50,
    movementY: 50,
  };
  SECOND_POINTER_DOWN = {
    pointerId: 2,
    pageX: 1000,
    pageY: 4000,
    clientX: 1000,
    clientY: 2000,
    movementX: 0,
    movementY: 0,
  };
  SECOND_POINTER_MOVE = {
    pointerId: 2,
    pageX: 1500,
    pageY: 4500,
    clientX: 1500,
    clientY: 2500,
    movementX: 500,
    movementY: 500,
  };
  SECOND_ADDITIONAL_POINTER_MOVE = {
    pointerId: 2,
    pageX: 1600,
    pageY: 4600,
    clientX: 1600,
    clientY: 2600,
    movementX: 100,
    movementY: 100,
  };
  SECOND_POINTER_UP = {
    pointerId: 2,
    pageX: 2000,
    pageY: 5000,
    clientX: 2000,
    clientY: 3000,
    movementX: 500,
    movementY: 500,
  };
}

describe('Feature - Gestures', () => {
  let element: HTMLDivElement;
  let gestures: Gestures;
  let gestureTypesChanges$: Observable<GesturesEventType[]>;

  let firstPointerdownEvent: MockPointerEvent;
  let firstPointermoveEvent: MockPointerEvent;
  let firstAdditionalPointermoveEvent: MockPointerEvent;
  let firstPointerupEvent: MockPointerEvent;
  let firstPointercancelEvent: MockPointerEvent;

  let secondPointerdownEvent: MockPointerEvent;
  let secondPointermoveEvent: MockPointerEvent;
  let secondAdditionalPointermoveEvent: MockPointerEvent;
  let secondPointerupEvent: MockPointerEvent;
  let secondPointercancelEvent: MockPointerEvent;

  beforeEach(() => {
    resetPointerEventData();
    element = document.createElement('div');

    mockEventListener(element);
    mockEventListener(document);

    gestures = new Gestures(element, {
      minDragMovements: 5,
    });

    gestureTypesChanges$ = gestures.changes$.pipe(
      map((e) => e.type),
      toArray()
    );

    firstPointerdownEvent = generateCustomEvent('pointerdown', FIRST_POINTER_DOWN) as MockPointerEvent;
    firstPointermoveEvent = generateCustomEvent('pointermove', FIRST_POINTER_MOVE) as MockPointerEvent;
    firstAdditionalPointermoveEvent = generateCustomEvent('pointermove', FIRST_ADDITIONAL_POINTER_MOVE) as MockPointerEvent;
    firstPointerupEvent = generateCustomEvent('pointerup', FIRST_POINTER_UP) as MockPointerEvent;
    firstPointercancelEvent = generateCustomEvent('pointercancel', FIRST_POINTER_UP) as MockPointerEvent;

    secondPointerdownEvent = generateCustomEvent('pointerdown', SECOND_POINTER_DOWN) as MockPointerEvent;
    secondPointermoveEvent = generateCustomEvent('pointermove', SECOND_POINTER_MOVE) as MockPointerEvent;
    secondAdditionalPointermoveEvent = generateCustomEvent('pointermove', SECOND_ADDITIONAL_POINTER_MOVE) as MockPointerEvent;
    secondPointerupEvent = generateCustomEvent('pointerup', SECOND_POINTER_UP) as MockPointerEvent;
    secondPointercancelEvent = generateCustomEvent('pointercancel', SECOND_POINTER_UP) as MockPointerEvent;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    clearCallbacks();
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

      document.dispatchEvent(firstPointerdownEvent);

      expect(element.addEventListener).not.toHaveBeenCalled();
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it('should listen to `pointermove`, `pointerup` and `pointercancel` when `pointerdown` on element has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      element.dispatchEvent(firstPointerdownEvent);

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
      element.dispatchEvent(firstPointerdownEvent);

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.addEventListener).toHaveBeenCalledTimes(2);
      expect(document.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });
    it('should remove listener for `pointermove`, `pointerup` and `pointercancel` when `pointerup` event has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointerupEvent);

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });
    it('should remove listener for `pointermove`, `pointerup` and `pointercancel` when `pointercancel` has fired', () => {
      gestures.changes$.subscribe();
      jest.clearAllMocks();

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(firstPointercancelEvent);

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);

      expect(document.removeEventListener).toHaveBeenCalledTimes(2);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
      expect(document.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
    });

    it('should not remove and add new listener for `pointermove`, `pointerup` and `pointercancel` when a additional `pointerdown` has fired ', () => {
      gestures.changes$.subscribe();

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);

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
      element.dispatchEvent(firstPointerdownEvent);
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

      document.dispatchEvent(firstPointerdownEvent);

      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstAdditionalPointermoveEvent);
      document.dispatchEvent(firstPointerupEvent);

      document.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstAdditionalPointermoveEvent);
      document.dispatchEvent(firstPointerupEvent);

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
      element.dispatchEvent(firstPointerdownEvent);
      gestures.destroy();
    });
    it('should not dispatch Press event when a new pointerdown event is triggered and active touches length is bigger than 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Press, 1); // Only for firstPointerdownEvent
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      gestures.destroy();
    });

    // PressRelease
    it('should not dispatch PressRelease when pointerup is triggered and Press has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Press);
        done();
      });
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch PressRelease when pointercancel is triggered and Press has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Press);
        done();
      });
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should dispatch PressRelease when pointerup is triggered and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.PressRelease, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should dispatch PressRelease when pointercancel is triggered and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.PressRelease, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should not dispatch PressRelease event when pointerup is triggered and active touches length is bigger than 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.PressRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch PressRelease event when pointercancel is triggered and active touches length is bigger than 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.PressRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      element.dispatchEvent(secondPointercancelEvent);
      gestures.destroy();
    });

    // DragPress
    it('should dispatch DragPress when pointerdown is triggered and active touches length is 1.', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragPress, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      gestures.destroy();
    });

    // DragStart
    it('should not dispatch DragStart when pointermove is triggered and active touches length is not 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should not dispatch DragStart when pointermove is triggered and DragPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    it('should dispatch DragStart when pointermove is triggered, and X-axis movement from DragPress event is bigger than minMovement', (done) => {
      firstPointermoveEvent.pageX = firstPointerdownEvent.pageX + 5;
      firstPointermoveEvent.pageY = firstPointerdownEvent.pageY;

      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should not dispatch DragStart when pointermove is triggered and X-axis movement from DragPress event is less than minMovement', (done) => {
      firstPointermoveEvent.pageX = firstPointerdownEvent.pageX + 4;
      firstPointermoveEvent.pageY = firstPointerdownEvent.pageY;

      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragStart);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    it('should dispatch DragStart when pointermove is triggered, and Y-axis movement from DragPress event is bigger than minMovement', (done) => {
      firstPointermoveEvent.pageX = firstPointerdownEvent.pageX;
      firstPointermoveEvent.pageY = firstPointerdownEvent.pageY + 5;

      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should not dispatch DragStart when pointermove is triggered and Y-axis movement from DragPress event is less than minMovement.', (done) => {
      firstPointermoveEvent.pageX = firstPointerdownEvent.pageX;
      firstPointermoveEvent.pageY = firstPointerdownEvent.pageY + 4;

      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragStart);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    it(`should dispatch DragStart when pointermove is triggered following a ZoomRelease without checking for minMovement`, (done) => {
      firstPointermoveEvent.pageX = firstPointerdownEvent.pageX + 1;
      firstPointermoveEvent.pageY = firstPointerdownEvent.pageY;

      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointerupEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    // Drag
    it('should not dispatch Drag when pointermove is triggered for the second time and active touches length is bigger than 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1); // Only for the firstPointermoveEvent
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      element.dispatchEvent(secondPointerdownEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should not dispatch Drag when pointermove is triggered and DragStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragStart);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    it('should dispatch Drag when pointermove event is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Drag, 1);
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    // DragEnd
    it('should not dispatch DragEnd when pointerup is triggered and DragStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragEnd);
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch DragEnd when pointercancel is triggered and DragStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragEnd);
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should dispatch DragEnd when pointerup is triggered and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should dispatch DragEnd when pointercancel is triggered, and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should not dispatch DragEnd when pointerdown is triggered and DragStart has not dispatched jet. (changing the type from drag to zoom)', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragEnd);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(secondPointerdownEvent);
      gestures.destroy();
    });
    it('should dispatch DragEnd when pointerdown is triggered and DragStart has already dispatched. (changing the type from drag to zoom)', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      element.dispatchEvent(secondPointerdownEvent);
      gestures.destroy();
    });

    // DragRelease
    it('should not dispatch DragRelease when pointerup is triggered and active touches length is not 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch DragRelease when pointercancel is triggered and active touches length is not 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      element.dispatchEvent(secondPointercancelEvent);
      gestures.destroy();
    });

    it('should not dispatch DragRelease when pointerup is triggered and DragPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch DragRelease when pointercancel is triggered and DragPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.DragRelease);
        done();
      });
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should dispatch DragRelease when pointerup is triggered and DragPress has already dispatch and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should dispatch DragRelease when pointercancel is triggered and DragPress has already dispatch and active touches length is 0', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    // ZoomPress
    it('should dispatch ZoomPress when pointerdown is triggered, and active touches length is 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomPress, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      gestures.destroy();
    });

    // ZoomStart
    it('should not dispatch ZoomStart when pointermove is triggered and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomStart);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should not dispatch ZoomStart when pointermove is triggered and ZoomPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomStart);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      gestures.destroy();
    });

    it('should dispatch ZoomStart when pointermove is triggered and active touches length is 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomStart, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      gestures.destroy();
    });

    // Zoom
    it('should not dispatch Zoom when pointermove is triggered for second times and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Zoom);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should not dispatch Zoom when pointermove is triggered for second times and ZoomStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.Zoom);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });

    it('should dispatch Zoom when pointermove is triggered for second times and active touches length is 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Zoom, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      secondPointermoveEvent.pageX += 10;
      document.dispatchEvent(secondPointermoveEvent);
      gestures.destroy();
    });

    // ZoomEnd
    it('should not dispatch ZoomEnd when pointerup is triggered and ZoomStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomEnd);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch ZoomEnd when pointercancel is triggered and ZoomStart has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomEnd);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(secondPointercancelEvent);
      gestures.destroy();
    });

    it('should dispatch ZoomEnd when pointerup is triggered and ZoomStart has already detached and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
    it('should dispatch ZoomEnd when pointercancel is triggered and ZoomStart has already detached and active touches length is not 2', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomEnd, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      element.dispatchEvent(secondPointercancelEvent);
      gestures.destroy();
    });

    // ZoomRelease
    it('should not dispatch ZoomRelease when pointerup is triggered and active touches length is not 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch ZoomRelease when pointercancel is triggered and active touches length is not 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should not dispatch ZoomRelease when pointerup is triggered and ZoomPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should not dispatch ZoomRelease when pointercancel is triggered and ZoomPress has not dispatched jet', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).not.toContain(GesturesEventType.ZoomRelease);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(firstPointercancelEvent);
      gestures.destroy();
    });

    it('should dispatch ZoomRelease when pointerup is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
    it('should dispatch ZoomRelease when pointercancel is triggered and active touches length is 1', (done) => {
      gestureTypesChanges$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.ZoomRelease, 1);
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      element.dispatchEvent(secondPointercancelEvent);
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

      element.dispatchEvent(firstPointerdownEvent); // Press, DragPress
      document.dispatchEvent(firstPointermoveEvent); // DragStart
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent); // Drag

      element.dispatchEvent(secondPointerdownEvent); // DragEnd, ZoomPress
      document.dispatchEvent(secondPointermoveEvent); // ZoomStart
      secondPointermoveEvent.pageX += 10;
      document.dispatchEvent(secondPointermoveEvent); // Zoom
      document.dispatchEvent(secondPointerupEvent); // ZoomEnd, ZoomRelease

      document.dispatchEvent(firstPointerupEvent); // DragRelease, PressRelease
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

      element.dispatchEvent(firstPointerdownEvent); // Press, DragPress
      document.dispatchEvent(firstPointermoveEvent); // DragStart
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent); // Drag

      element.dispatchEvent(secondPointerdownEvent); // DragEnd, ZoomPress
      document.dispatchEvent(secondPointermoveEvent); // ZoomStart
      secondPointermoveEvent.pageX += 10;
      document.dispatchEvent(secondPointermoveEvent); // Zoom
      document.dispatchEvent(secondPointerupEvent); // ZoomEnd, ZoomRelease

      document.dispatchEvent(firstPointerupEvent); // DragRelease, PressRelease
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
      element.dispatchEvent(firstPointerdownEvent); // Press, DragPress
      document.dispatchEvent(firstPointermoveEvent); // DragStart
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent); // Drag

      element.dispatchEvent(secondPointerdownEvent); // DragEnd, ZoomPress
      document.dispatchEvent(secondPointermoveEvent); // ZoomStart
      secondPointermoveEvent.pageX += 10;
      document.dispatchEvent(secondPointermoveEvent); // Zoom
      document.dispatchEvent(secondPointerupEvent); // ZoomEnd, ZoomRelease

      document.dispatchEvent(firstPointerupEvent); // DragRelease, PressRelease

      // Second cycle
      element.dispatchEvent(firstPointerdownEvent); // Press, DragPress
      document.dispatchEvent(firstPointermoveEvent); // DragStart
      firstPointermoveEvent.pageX += 10;
      document.dispatchEvent(firstPointermoveEvent); // Drag

      element.dispatchEvent(secondPointerdownEvent); // DragEnd, ZoomPress
      document.dispatchEvent(secondPointermoveEvent); // ZoomStart
      secondPointermoveEvent.pageX += 10;
      document.dispatchEvent(secondPointermoveEvent); // Zoom
      document.dispatchEvent(secondPointerupEvent); // ZoomEnd, ZoomRelease

      document.dispatchEvent(firstPointerupEvent); // DragRelease, PressRelease

      gestures.destroy();
    });
  });

  describe('Event Data', () => {
    it('should return the correct PressEvent when Press has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.Press)).subscribe((e) => {
        expect(e).toEqual({
          type: GesturesEventType.Press,
          pageX: firstPointerdownEvent.pageX,
          pageY: firstPointerdownEvent.pageY,
          clientX: firstPointerdownEvent.clientX,
          clientY: firstPointerdownEvent.clientY,

          event: firstPointerdownEvent,
        });
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      gestures.destroy();
    });
    it('should return the correct PressReleaseEvent when PressRelease has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.PressRelease)).subscribe((e) => {
        expect(e).toEqual({
          type: GesturesEventType.PressRelease,
          pageX: firstPointerupEvent.pageX,
          pageY: firstPointerupEvent.pageY,
          clientX: firstPointerupEvent.clientX,
          clientY: firstPointerupEvent.clientY,

          event: firstPointerupEvent,
        });
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });

    it('should return the correct DragPress event data when DragPress has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragPress)).subscribe((e) => {
        expect(e).toEqual({
          type: GesturesEventType.DragPress,

          pageX: firstPointerdownEvent.pageX,
          pageY: firstPointerdownEvent.pageY,
          clientX: firstPointerdownEvent.clientX,
          clientY: firstPointerdownEvent.clientY,
          movementX: firstPointerdownEvent.movementX,
          movementY: firstPointerdownEvent.movementY,

          movementXFromPress: 0,
          movementYFromPress: 0,
          movementXFromStart: null,
          movementYFromStart: null,

          event: firstPointerdownEvent,
        });
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      gestures.destroy();
    });
    it('should return the correct DragStart event data when DragStart has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragStart)).subscribe((e) => {
        expect(e).toEqual({
          type: GesturesEventType.DragStart,

          pageX: firstPointermoveEvent.pageX,
          pageY: firstPointermoveEvent.pageY,
          clientX: firstPointermoveEvent.clientX,
          clientY: firstPointermoveEvent.clientY,
          movementX: firstPointermoveEvent.movementX,
          movementY: firstPointermoveEvent.movementY,

          movementXFromPress: 50,
          movementYFromPress: 50,
          movementXFromStart: 0,
          movementYFromStart: 0,

          event: firstPointermoveEvent,
        });
        done();
      });
      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      gestures.destroy();
    });
    it('should return the correct Drag event data when Drag has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.Drag)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.Drag,

          pageX: firstAdditionalPointermoveEvent.pageX,
          pageY: firstAdditionalPointermoveEvent.pageY,
          clientX: firstAdditionalPointermoveEvent.clientX,
          clientY: firstAdditionalPointermoveEvent.clientY,
          movementX: firstAdditionalPointermoveEvent.movementX,
          movementY: firstAdditionalPointermoveEvent.movementY,

          movementXFromPress: 60,
          movementYFromPress: 60,
          movementXFromStart: 10,
          movementYFromStart: 10,

          event: firstAdditionalPointermoveEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstAdditionalPointermoveEvent);
      gestures.destroy();
    });
    it('should return the correct DragEnd event data when DragEnd has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragEnd)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.DragEnd,

          pageX: firstPointerupEvent.pageX,
          pageY: firstPointerupEvent.pageY,
          clientX: firstPointerupEvent.clientX,
          clientY: firstPointerupEvent.clientY,
          movementX: firstPointerupEvent.movementX,
          movementY: firstPointerupEvent.movementY,

          movementXFromPress: 100,
          movementYFromPress: 100,
          movementXFromStart: 50,
          movementYFromStart: 50,

          event: firstPointerupEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });
    it('should return the correct DragRelease event data when DragRelease has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.DragRelease)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.DragRelease,

          pageX: firstPointerupEvent.pageX,
          pageY: firstPointerupEvent.pageY,
          clientX: firstPointerupEvent.clientX,
          clientY: firstPointerupEvent.clientY,
          movementX: firstPointerupEvent.movementX,
          movementY: firstPointerupEvent.movementY,

          movementXFromPress: 100,
          movementYFromPress: 100,
          movementXFromStart: 50,
          movementYFromStart: 50,

          event: firstPointerupEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      document.dispatchEvent(firstPointermoveEvent);
      document.dispatchEvent(firstPointerupEvent);
      gestures.destroy();
    });

    it('should return the correct ZoomPress event data when ZoomPress has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomPress)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.ZoomPress,

          distance: 3710.8,
          scaleFactorFromPress: 1,

          centerPageX: 550,
          centerPageY: 2200,
          centerClientX: 550,
          centerClientY: 1100,
          centerMovementX: 0,
          centerMovementY: 0,

          centerMovementXFromPress: 0,
          centerMovementYFromPress: 0,

          event: secondPointerdownEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      gestures.destroy();
    });
    it('should return the correct ZoomStart event data when ZoomStart has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomStart)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.ZoomStart,

          distance: 4332.44,
          scaleFactorFromPress: 1.17,

          centerPageX: 800,
          centerPageY: 2450,
          centerClientX: 800,
          centerClientY: 1350,
          centerMovementX: 250,
          centerMovementY: 250,

          centerMovementXFromPress: 250,
          centerMovementYFromPress: 250,

          event: secondPointermoveEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      gestures.destroy();
    });
    it('should return the correct Zoom event data when Zoom has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.Zoom)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.Zoom,

          distance: 4459.82,
          scaleFactorFromPress: 1.2,

          centerPageX: 850,
          centerPageY: 2500,
          centerClientX: 850,
          centerClientY: 1400,
          centerMovementX: 50,
          centerMovementY: 50,

          centerMovementXFromPress: 300,
          centerMovementYFromPress: 300,

          event: secondAdditionalPointermoveEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      document.dispatchEvent(secondAdditionalPointermoveEvent);
      gestures.destroy();
    });
    it('should return the correct ZoomEnd event data when ZoomEnd has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomEnd)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.ZoomEnd,

          distance: 4976.95,
          scaleFactorFromPress: 1.34,

          centerPageX: 1050,
          centerPageY: 2700,
          centerClientX: 1050,
          centerClientY: 1600,
          centerMovementX: 250,
          centerMovementY: 250,

          centerMovementXFromPress: 500,
          centerMovementYFromPress: 500,

          event: secondPointerupEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      document.dispatchEvent(secondAdditionalPointermoveEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
    it('should return the correct ZoomRelease event data when ZoomRelease has dispatched', (done) => {
      gestures.changes$.pipe(filter((e) => e.type === GesturesEventType.ZoomRelease)).subscribe((e: DragGesturesEvent) => {
        expect(e).toEqual({
          type: GesturesEventType.ZoomRelease,

          distance: 4976.95,
          scaleFactorFromPress: 1.34,

          centerPageX: 1050,
          centerPageY: 2700,
          centerClientX: 1050,
          centerClientY: 1600,
          centerMovementX: 250,
          centerMovementY: 250,

          centerMovementXFromPress: 500,
          centerMovementYFromPress: 500,

          event: secondPointerupEvent,
        });
        done();
      });

      element.dispatchEvent(firstPointerdownEvent);
      element.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      document.dispatchEvent(secondAdditionalPointermoveEvent);
      document.dispatchEvent(secondPointerupEvent);
      gestures.destroy();
    });
  });
});

import { Drag } from '../../lib/drag';
import { generateCustomEvent, getActiveListener, mockEventListener } from '@internal-lib/util-testing';
import { map, Observable, toArray } from 'rxjs';
import { DragGesturesEventType, GesturesEventType } from '@elemix/core';

type MockPointerEvent = CustomEvent<unknown> & {
  pointerId: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  movementX: number;
  movementY: number;
};

describe('Feature - Drag', () => {
  let element: HTMLElement;
  let drag: Drag;

  let POINTER_DOWN: Partial<PointerEvent>;
  let POINTER_MOVE: Partial<PointerEvent>;
  let ADDITIONAL_POINTER_MOVE: Partial<PointerEvent>;
  let POINTER_UP: Partial<PointerEvent>;

  let pointerdownEvent: MockPointerEvent;
  let pointermoveEvent: MockPointerEvent;
  let additionalPointermoveEvent: MockPointerEvent;
  let pointerupEvent: MockPointerEvent;
  let pointercancelEvent: MockPointerEvent;

  beforeEach(() => {
    POINTER_DOWN = {
      pointerId: 1,
      pageX: 100,
      pageY: 400,
      clientX: 100,
      clientY: 200,
      movementX: 0,
      movementY: 0,
    };
    POINTER_MOVE = {
      pointerId: 1,
      pageX: 150,
      pageY: 450,
      clientX: 150,
      clientY: 250,
      movementX: 50,
      movementY: 50,
    };
    ADDITIONAL_POINTER_MOVE = {
      pointerId: 1,
      pageX: 200,
      pageY: 500,
      clientX: 200,
      clientY: 300,
      movementX: 50,
      movementY: 50,
    };
    POINTER_UP = {
      pointerId: 1,
      pageX: 250,
      pageY: 550,
      clientX: 250,
      clientY: 350,
      movementX: 50,
      movementY: 50,
    };

    pointerdownEvent = generateCustomEvent('pointerdown', POINTER_DOWN) as MockPointerEvent;
    pointermoveEvent = generateCustomEvent('pointermove', POINTER_MOVE) as MockPointerEvent;
    additionalPointermoveEvent = generateCustomEvent('pointermove', ADDITIONAL_POINTER_MOVE) as MockPointerEvent;
    pointerupEvent = generateCustomEvent('pointerup', POINTER_UP) as MockPointerEvent;
    pointercancelEvent = generateCustomEvent('pointercancel', POINTER_UP) as MockPointerEvent;

    element = document.createElement('div');
    element.style.width = '200px';
    element.style.height = '200px';

    mockEventListener(element);
    mockEventListener(document);

    // createMockRequestAnimationFrame({ stopOnFrames: 1 });
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(1);
    });

    drag = new Drag(element);
  });

  describe('Initialized', () => {
    // Init
    it(`should 'isEnabled' be true when drag functionality is initialized`, () => {
      expect(drag.isEnable).toEqual(true);
    });
    it(`should only listen to 'pointerdown' when drag functionality is initialized`, () => {
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });

    // Enable
    it(`should not listen to 'pointerdown' more than one when the enabled method has called more than one times`, () => {
      drag.enable();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it(`should only listen to 'pointerdown' once when the enabled method has called`, () => {
      drag.disable();
      jest.clearAllMocks();
      drag.enable();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
      expect(document.addEventListener).not.toHaveBeenCalled();
    });
    it(`should 'isEnabled' be true when when the enabled method has called`, () => {
      drag.enable();
      expect(drag.isEnable).toEqual(true);
    });

    // Disabled
    it(`should 'isEnabled' be false when when the disabled method has called`, () => {
      drag.disable();
      expect(drag.isEnable).toEqual(false);
    });
    it(`should remove all event listener when disabled method has called`, () => {
      drag.disable();
      expect(getActiveListener(element)).toEqual(0);
      expect(getActiveListener(document)).toEqual(0);
    });

    // Destroy
    // TODO: Add scenarios for test the destroy
  });

  describe('Events', () => {
    let events$: Observable<DragGesturesEventType[]>;

    beforeEach(() => {
      events$ = drag.events$.pipe(
        map((e) => e.type),
        toArray()
      );
    });

    it(`should dispatch 'DragPress' when 'pointerdown' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragPress, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      drag.destroy();
    });
    it(`should dispatch 'DragStart' when 'pointermove' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      drag.destroy();
    });
    it(`should dispatch 'Drag' when the second 'pointermove' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Drag, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(additionalPointermoveEvent);
      drag.destroy();
    });
    it(`should dispatch 'DragEnd' when the 'pointerup' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(pointerupEvent);
      drag.destroy();
    });
    it(`should dispatch 'DragEnd' when the 'pointercancel' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      element.dispatchEvent(pointercancelEvent);
      drag.destroy();
    });
    it(`should dispatch 'DragRelease' when the 'pointerup' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(pointerupEvent);
      drag.destroy();
    });
    it(`should dispatch 'DragRelease' when the 'pointercancel' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      element.dispatchEvent(pointercancelEvent);
      drag.destroy();
    });
  });

  describe('Basic Dragging', () => {
    it(`should 'isDragging' be false when the element is no dragging begins`, () => {
      element.dispatchEvent(pointerdownEvent);
      expect(drag.isDragging).toEqual(false);
    });
    it(`should 'isDragging' be true when the element is dragging begins`, () => {
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      expect(drag.isDragging).toEqual(true);
    });
    it(`should update the element's position correctly when it is dragging`, () => {
      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(additionalPointermoveEvent);
      expect(element.style.transform).toEqual('translate(50px, 50px) scale(1, 1) rotateY(0deg) rotateX(0deg)');
    });
    it(`should not allow dragging when drag start has not fired`, () => {
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(additionalPointermoveEvent);
      expect(element.style.transform).toEqual('');
      expect(drag.isDragging).toEqual(false);
    });
    it(`should update only the target element's position when multi draggable element exist`, () => {
      const secondPointerdownEvent = generateCustomEvent('pointerdown', { ...POINTER_DOWN, pointerId: 2 });
      const secondPointermoveEvent = generateCustomEvent('pointermove', { ...POINTER_MOVE, pointerId: 2 });
      const secondAdditionalPointermoveEvent = generateCustomEvent('pointermove', {
        ...ADDITIONAL_POINTER_MOVE,
        pointerId: 2,
        pageX: 300,
        pageY: 600,
      });
      const secondElement = document.createElement('div');
      new Drag(secondElement);

      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(additionalPointermoveEvent);

      secondElement.dispatchEvent(secondPointerdownEvent);
      document.dispatchEvent(secondPointermoveEvent);
      document.dispatchEvent(secondAdditionalPointermoveEvent);

      expect(element.style.transform).toEqual('translate(50px, 50px) scale(1, 1) rotateY(0deg) rotateX(0deg)');
      expect(secondElement.style.transform).toEqual('translate(150px, 150px) scale(1, 1) rotateY(0deg) rotateX(0deg)');
    });
    it(`should not update the other element's position during dragging a draggable element`, () => {
      const secondElement = document.createElement('div');
      new Drag(secondElement);

      element.dispatchEvent(pointerdownEvent);
      document.dispatchEvent(pointermoveEvent);
      document.dispatchEvent(additionalPointermoveEvent);

      expect(element.style.transform).toEqual('translate(50px, 50px) scale(1, 1) rotateY(0deg) rotateX(0deg)');
      expect(secondElement.style.transform).toEqual('');
    });
  });

  describe('MinMovement Dragging', () => {});
  describe('LockAxis Dragging', () => {});
  describe('MovementDirection Dragging', () => {});
  describe('Boundary Dragging', () => {});
  describe('Boundary Dragging', () => {});
});

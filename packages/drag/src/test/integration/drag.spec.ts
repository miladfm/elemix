import { Drag } from '../../lib/drag';
import {
  mockRequestAnimationFrame,
  getActiveListener,
  mockClientRect,
  mockEventListener,
  MockPointerEvent,
  mockBasicRequestAnimationFrame,
} from '@internal-lib/util-testing';
import { map, Observable, toArray } from 'rxjs';
import { DragGesturesEventType, GesturesEventType } from '@elemix/core';
import { DragBoundaryType, MovementDirection } from '../../lib/drag.model';

describe('Feature - Drag', () => {
  let element: HTMLElement;
  let drag: Drag;
  let event: MockPointerEvent;

  beforeEach(() => {
    element = document.createElement('div');

    mockEventListener(element);
    mockEventListener(document);
    mockBasicRequestAnimationFrame();

    event = new MockPointerEvent({ defaultDownElement: element, defaultCancelElement: element });
  });

  describe('Initialized', () => {
    beforeEach(() => {
      drag = new Drag(element);
    });
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
      drag = new Drag(element);

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
      event.dispatchDown({ x: 10, y: 10 });
      drag.destroy();
    });
    it(`should dispatch 'DragStart' when 'pointermove' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragStart, 1);
        done();
      });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      drag.destroy();
    });
    it(`should dispatch 'Drag' when the second 'pointermove' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.Drag, 1);
        done();
      });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 100, y: 100 });
      drag.destroy();
    });
    it(`should dispatch 'DragEnd' when the 'pointerup' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchUp({ x: 0, y: 0 });
      drag.destroy();
    });
    it(`should dispatch 'DragEnd' when the 'pointercancel' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragEnd, 1);
        done();
      });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchCancel({ x: 0, y: 0 });
      drag.destroy();
    });
    it(`should dispatch 'DragRelease' when the 'pointerup' has fired on the document`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchUp({ x: 0, y: 0 });
      drag.destroy();
    });
    it(`should dispatch 'DragRelease' when the 'pointercancel' has fired on the element`, (done) => {
      events$.subscribe((types) => {
        expect(types).toContainTimes(GesturesEventType.DragRelease, 1);
        done();
      });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchCancel({ x: 0, y: 0 });
      drag.destroy();
    });
  });

  describe('Basic Dragging', () => {
    beforeEach(() => {
      drag = new Drag(element);
    });

    it(`should 'isDragging' be false when the element is no dragging begins`, () => {
      event.dispatchDown({ x: 10, y: 10 });
      expect(drag.isDragging).toEqual(false);
    });
    it(`should 'isDragging' be true when the element is dragging begins`, () => {
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      expect(drag.isDragging).toEqual(true);
    });
    it(`should update the element's position correctly when it is dragging`, () => {
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
    });
    it(`should not allow dragging when drag start has not fired`, () => {
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toEqual('');
      expect(drag.isDragging).toEqual(false);
    });
    it(`should update only the target element's position when multi draggable element exist`, () => {
      const secondElement = document.createElement('div');
      const secondEvent = new MockPointerEvent({
        pointerId: 1,
        defaultDownElement: secondElement,
        defaultCancelElement: secondElement,
      });
      new Drag(secondElement);

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });

      secondEvent.dispatchDown({ x: 10, y: 10 });
      secondEvent.dispatchMove({ x: 0, y: 0 });
      secondEvent.dispatchMove({ x: 150, y: 150 });

      expect(element.style.transform).toContain('translate(50px, 50px)');
      expect(secondElement.style.transform).toContain('translate(150px, 150px)');
    });
    it(`should not update the other element's position during dragging a draggable element`, () => {
      const secondElement = document.createElement('div');
      new Drag(secondElement);

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });

      expect(element.style.transform).toContain('translate(50px, 50px)');
      expect(secondElement.style.transform).toEqual('');
    });
  });

  describe('MovementDirection Dragging', () => {
    beforeEach(() => {
      drag = new Drag(element);
    });

    it(`should move the element in x and y axis when no 'movementDirection' has defined`, () => {
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
    });
    it(`should move the element in x and y axis when 'movementDirection' is 'Both`, () => {
      drag = new Drag(element, { movementDirection: MovementDirection.Both });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
    });
    it(`should move the element only in x axis when 'movementDirection' is 'Horizontal`, () => {
      drag = new Drag(element, { movementDirection: MovementDirection.Horizontal });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 0px)');
    });
    it(`should move the element only in y axis when 'movementDirection' is 'Vertical`, () => {
      drag = new Drag(element, { movementDirection: MovementDirection.Vertical });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(0px, 50px)');
    });
    it(`should move the element only in x axis when the initial drag movement starts in a x axis and 'movementDirection' is 'Lock`, () => {
      drag = new Drag(element, { movementDirection: MovementDirection.Lock });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 10 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 0px)');
    });
    it(`should move the element only in y axis when the initial drag movement starts in a y axis and 'movementDirection' is 'Lock`, () => {
      drag = new Drag(element, { movementDirection: MovementDirection.Lock });
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 10, y: 0 });
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(0px, 50px)');
    });
  });

  describe('Boundary Dragging', () => {
    let boundaryElement: HTMLElement;

    /**
     * Boundary Movement:
     * Horizontal: -100 - 100
     * Vertical: -100 - 100
     *
     * Free space:
     * left: 400-500
     * top: 400-500
     * right: 700-800
     * bottom: 700-800
     */
    const initInnerBoundary = () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
    };
    const initAutoBoundaryWithSmallElement = () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Auto,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
    };

    /**
     * Boundary Movement:
     * Horizontal: -100 - 100
     * Vertical: -100 - 100
     *
     * Free space:
     * left: 300-400
     * top: 300-400
     * right: 800-900
     * bottom: 800-900
     */
    const initOuterBoundary = () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 600,
        height: 600,
        x: 300,
        y: 300,
        left: 300,
        top: 300,
        right: 900,
        bottom: 900,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Outer,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
    };
    const initAutoBoundaryWithBigElement = () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 600,
        height: 600,
        x: 300,
        y: 300,
        left: 300,
        top: 300,
        right: 900,
        bottom: 900,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Auto,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
    };

    const initAutoBoundaryWithSmallerHeight = () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 600,
        height: 200,
        x: 300,
        y: 500,
        left: 300,
        top: 500,
        right: 900,
        bottom: 700,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Auto,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
    };
    const initAutoBoundaryWithSmallerWidth = () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 600,
        x: 500,
        y: 300,
        left: 500,
        top: 300,
        right: 700,
        bottom: 900,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Auto,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
    };

    beforeEach(() => {
      boundaryElement = document.createElement('div');
      boundaryElement.classList.add('boundary-element');
      boundaryElement.style.width = '400px';
      boundaryElement.style.height = '400px';
    });

    it(`should prevent the draggable element from moving outside the boundary when 'boundaryType' is 'Inner'`, () => {
      initInnerBoundary();

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: -300 });
      expect(element.style.transform).toContain('translate(-100px, -100px)');
    });
    it(`should allow movement within the boundary when the draggable element is smaller than the boundary and 'boundaryType' is 'Inner'`, () => {
      initInnerBoundary();

      // left
      event.dispatchMove({ x: -50, y: 0 });
      expect(element.style.transform).toContain('translate(-50px, 0px)');
      event.dispatchMove({ x: -100, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -50, y: 50 });
      expect(element.style.transform).toContain('translate(-50px, 50px)');
      event.dispatchMove({ x: -100, y: 100 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 50 });
      expect(element.style.transform).toContain('translate(0px, 50px)');
      event.dispatchMove({ x: 0, y: 100 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
      event.dispatchMove({ x: 100, y: 100 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 100, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');
      event.dispatchMove({ x: 50, y: 0 });
      expect(element.style.transform).toContain('translate(50px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
      event.dispatchMove({ x: 100, y: 100 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 50 });
      expect(element.style.transform).toContain('translate(0px, 50px)');
      event.dispatchMove({ x: 0, y: 100 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -50, y: 50 });
      expect(element.style.transform).toContain('translate(-50px, 50px)');
      event.dispatchMove({ x: -100, y: 100 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });

    it(`should ensure the boundary does not exit the confines of the draggable element when 'boundaryType' is 'Outer'`, () => {
      initOuterBoundary();

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });
    it(`should allow movement within the boundary when the draggable element is bigger than the boundary and 'boundaryType' is 'Outer'`, () => {
      initOuterBoundary();

      // left
      event.dispatchMove({ x: -50, y: 0 });
      expect(element.style.transform).toContain('translate(-50px, 0px)');
      event.dispatchMove({ x: -100, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -50, y: 50 });
      expect(element.style.transform).toContain('translate(-50px, 50px)');
      event.dispatchMove({ x: -100, y: 100 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 50 });
      expect(element.style.transform).toContain('translate(0px, 50px)');
      event.dispatchMove({ x: 0, y: 100 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
      event.dispatchMove({ x: 100, y: 100 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 100, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');
      event.dispatchMove({ x: 50, y: 0 });
      expect(element.style.transform).toContain('translate(50px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 50, y: 50 });
      expect(element.style.transform).toContain('translate(50px, 50px)');
      event.dispatchMove({ x: 100, y: 100 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 50 });
      expect(element.style.transform).toContain('translate(0px, 50px)');
      event.dispatchMove({ x: 0, y: 100 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -50, y: 50 });
      expect(element.style.transform).toContain('translate(-50px, 50px)');
      event.dispatchMove({ x: -100, y: 100 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });

    it(`should automatically select 'Inner' boundary constraints when the draggable is smaller than the boundary on both axes and 'boundaryType' is 'Auto'`, () => {
      initAutoBoundaryWithSmallElement();

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');
    });
    it(`should automatically select 'Outer' boundary constraints when the draggable is larger than the boundary on both axes and 'boundaryType' is 'Auto'`, () => {
      initAutoBoundaryWithBigElement();

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');
    });
    it(`should apply 'Inner' vertical and 'Outer' horizontal boundary constraints when boundaryType is 'Auto' and draggable element is shorter in height and wider in width than the boundary`, () => {
      initAutoBoundaryWithSmallerHeight();

      // left
      event.dispatchMove({ x: -500, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -500, y: 500 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 500 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 500, y: 500 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 500, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 500, y: 500 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 500 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -500, y: 500 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });
    it(`should apply 'Inner' horizontal and 'Outer' vertical boundary constraints when boundaryType is 'Auto' and draggable element is shorter in width and wider in height than the boundary`, () => {
      initAutoBoundaryWithSmallerWidth();

      // left
      event.dispatchMove({ x: -500, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -500, y: 500 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 500 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 500, y: 500 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 500, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 500, y: 500 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 500 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -500, y: 500 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });

    it(`should throw an error where boundaryElem does not exist.`, () => {
      expect(() => {
        new Drag(element, {
          boundary: {
            elem: null,
          },
        });
      }).toThrow();
    });
    it(`should verify that boundary constraints are still effective after changes in DOM structure`, () => {
      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
        },
      });

      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });
    it(`should use '1' bounceFactor and 'Auto' type when the interaction or type has not defined`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 600,
        height: 200,
        x: 300,
        y: 500,
        left: 300,
        top: 500,
        right: 900,
        bottom: 700,
      });

      new Drag(element, { boundary: { elem: boundaryElement } });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      // left
      event.dispatchMove({ x: -500, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 0px)');

      // left-top
      event.dispatchMove({ x: -500, y: 500 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top
      event.dispatchMove({ x: 0, y: 500 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // top-right
      event.dispatchMove({ x: 500, y: 500 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right
      event.dispatchMove({ x: 500, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 500, y: 500 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // bottom
      event.dispatchMove({ x: 0, y: 500 });
      expect(element.style.transform).toContain('translate(0px, 100px)');

      // bottom-left
      event.dispatchMove({ x: -500, y: 500 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });

    it(`should calculate and apply bounce effect when the draggable element moves outside boundary and boundaryType is 'Inner'`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 0.5,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-250px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(250px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');
    });
    it(`should calculate and apply bounce effect when the draggable element moves outside boundary and boundaryType is 'Outer'`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 600,
        height: 600,
        x: 300,
        y: 300,
        left: 300,
        top: 300,
        right: 900,
        bottom: 900,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Outer,
          bounceFactor: 0.5,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-250px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(250px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');
    });
    it(`should calculate and apply bounce effect when the draggable element moves outside boundary and boundaryType is 'Auto' and draggable element is shorter in height and wider in width than the boundary`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 600,
        height: 200,
        x: 300,
        y: 500,
        left: 300,
        top: 500,
        right: 900,
        bottom: 700,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Auto,
          bounceFactor: 0.5,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-250px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(250px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');
    });
    it(`should calculate and apply bounce effect when the draggable element moves outside boundary and boundaryType is 'Auto' and draggable element is shorter in width and wider in height than the boundary`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 600,
        x: 500,
        y: 300,
        left: 500,
        top: 300,
        right: 700,
        bottom: 900,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Auto,
          bounceFactor: 0.5,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      // left
      event.dispatchMove({ x: -300, y: 0 });
      expect(element.style.transform).toContain('translate(-250px, 0px)');

      // left-top
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');

      // top
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // top-right
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // right
      event.dispatchMove({ x: 300, y: 0 });
      expect(element.style.transform).toContain('translate(250px, 0px)');

      // right-bottom
      event.dispatchMove({ x: 300, y: 300 });
      expect(element.style.transform).toContain('translate(250px, 250px)');

      // bottom
      event.dispatchMove({ x: 0, y: 300 });
      expect(element.style.transform).toContain('translate(0px, 250px)');

      // bottom-left
      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-250px, 250px)');
    });

    it(`should apply stronger bounce effect for higher 'bounceFactor' values`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 0.9,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-138px, 138px)');
    });
    it(`should apply weaker bounce effect for lower 'bounceFactor values`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 0.2,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-292px, 292px)');
    });
    it(`should draggable element moving outside the boundary like basic drag without bounce effect when 'bounceFactor' is 0`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 0,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-300px, 300px)');
    });
    it(`should draggable element moving outside the boundary like basic drag without bounce effect when 'bounceFactor' is less than 0`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: -1,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-300px, 300px)');
    });
    it(`should prevent the draggable element from moving outside the boundary without bounce effect when 'bounceFactor' is equal to 1`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 1,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });
    it(`should prevent the draggable element from moving outside the boundary without bounce effect when 'bounceFactor' is bigger than 1`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 2,
        },
      });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging

      event.dispatchMove({ x: -300, y: 300 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');
    });

    it(`should animate the element back to the boundary when bounce effect has applied and dragging has finished`, () => {
      mockRequestAnimationFrame();

      mockClientRect(boundaryElement, { width: 400, height: 400, left: 400, top: 400 });
      mockClientRect(element, { width: 200, height: 200, left: 500, top: 500 });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
          bounceFactor: 0.5,
        },
      });

      // left-top
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
      event.dispatchMove({ x: -300, y: 300 });
      event.dispatchUp({ x: 0, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, 100px)');

      // top-right
      mockClientRect(element, { width: 200, height: 200, left: 400, top: 600 });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
      event.dispatchMove({ x: 300, y: 300 });
      event.dispatchUp({ x: 0, y: 0 });
      expect(element.style.transform).toContain('translate(100px, 100px)');

      // right-bottom
      mockClientRect(element, { width: 200, height: 200, left: 600, top: 600 });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
      event.dispatchMove({ x: 300, y: -300 });
      event.dispatchUp({ x: 0, y: 0 });
      expect(element.style.transform).toContain('translate(100px, -100px)');

      // bottom-left
      mockClientRect(element, { width: 200, height: 200, left: 600, top: 400 });

      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
      event.dispatchMove({ x: -300, y: -300 });
      event.dispatchUp({ x: 0, y: 0 });
      expect(element.style.transform).toContain('translate(-100px, -100px)');
    });
    it(`should skip boundary concept where the boundary element is removed before start dragging`, () => {
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 400,
        height: 400,
        x: 400,
        y: 400,
        left: 400,
        top: 400,
        right: 800,
        bottom: 800,
      });
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 200,
        height: 200,
        x: 500,
        y: 500,
        left: 500,
        top: 500,
        right: 700,
        bottom: 700,
      });

      drag = new Drag(element, {
        boundary: {
          elem: boundaryElement,
          type: DragBoundaryType.Inner,
        },
      });

      boundaryElement.remove();
      jest.spyOn(boundaryElement, 'getBoundingClientRect').mockReturnValue({
        ...element.getBoundingClientRect(),
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      });

      // left-top
      event.dispatchDown({ x: 10, y: 10 });
      event.dispatchMove({ x: 0, y: 0 }); // To start dragging
      event.dispatchMove({ x: -300, y: 300 });
      event.dispatchUp({ x: 0, y: 0 });
      expect(element.style.transform).toContain('translate(-300px, 300px)');
    });
  });

  describe('Multi Options', () => {
    it(`should move the element in both x and y axes within boundary constraints when 'movementDirection' is 'Both' and 'boundaryType' is 'Inner'`, () => {});
    it(`should move the element only in x axis within boundary constraints when 'movementDirection' is 'Horizontal' and 'boundaryType' is 'Inner'`, () => {});
    it(`should move the element only in y axis within boundary constraints when 'movementDirection' is 'Vertical' and 'boundaryType' is 'Inner'`, () => {});
    it(`should move the element only in x axis within boundary constraints when the initial drag movement starts in a x axis and 'movementDirection' is 'Lock' and 'boundaryType' is 'Inner'`, () => {});
    it(`should move the element only in y axis within boundary constraints when the initial drag movement starts in a y axis and 'movementDirection' is 'Lock' and 'boundaryType' is 'Inner'`, () => {});

    it(`should move the element in both x and y axes within boundary constraints when 'movementDirection' is 'Both' and 'boundaryType' is 'Outer'`, () => {});
    it(`should move the element only in x axis within boundary constraints when 'movementDirection' is 'Horizontal' and 'boundaryType' is 'Outer'`, () => {});
    it(`should move the element only in y axis within boundary constraints when 'movementDirection' is 'Vertical' and 'boundaryType' is 'Outer'`, () => {});
    it(`should move the element only in x axis within boundary constraints when the initial drag movement starts in a x axis and 'movementDirection' is 'Lock' and 'boundaryType' is 'Outer'`, () => {});
    it(`should move the element only in y axis within boundary constraints when the initial drag movement starts in a y axis and 'movementDirection' is 'Lock' and 'boundaryType' is 'Outer'`, () => {});

    it(`should move the element in both x and y axes within boundary constraints when 'movementDirection' is 'Both' and 'boundaryType' is 'Auto'`, () => {});
    it(`should move the element only in x axis within boundary constraints when 'movementDirection' is 'Horizontal' and 'boundaryType' is 'Auto'`, () => {});
    it(`should move the element only in y axis within boundary constraints when 'movementDirection' is 'Vertical' and 'boundaryType' is 'Auto'`, () => {});
    it(`should move the element only in x axis within boundary constraints when the initial drag movement starts in a x axis and 'movementDirection' is 'Lock' and 'boundaryType' is 'Auto'`, () => {});
    it(`should move the element only in y axis within boundary constraints when the initial drag movement starts in a y axis and 'movementDirection' is 'Lock' and 'boundaryType' is 'Auto'`, () => {});
  });

  describe('MinMovement Dragging', () => {
    it(`should not the element when the movement is less than the defined minMovements threshold`, () => {});
    it(`should move the element when the movement exceeds the minMovements threshold`, () => {});
  });
});

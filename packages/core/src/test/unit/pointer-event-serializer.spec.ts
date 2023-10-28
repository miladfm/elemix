import { PointerEventSerializer } from '../../lib/gestures/pointer-event-serializer';
import { generateCustomEvent, mockEventListener } from '@internal-lib/util-testing';

type MockPointerEvent = CustomEvent<unknown> & {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  movementX: number;
  movementY: number;
};

const ACTUAL_POINTER_DOWN = {
  pointerId: 1,
  pageX: 100,
  pageY: 400,
  clientX: 100,
  clientY: 200,
  movementX: 0,
  movementY: 0,
};

const ACTUAL_POINTER_MOVE = {
  pointerId: 2,
  pageX: 150,
  pageY: 450,
  clientX: 150,
  clientY: 250,
  movementX: 50,
  movementY: 50,
};

const ACTUAL_POINTER_UP = {
  pointerId: 3,
  pageX: 200,
  pageY: 500,
  clientX: 200,
  clientY: 300,
  movementX: 50,
  movementY: 50,
};

describe('Unit - PointerEventSerializer', () => {
  let element: HTMLDivElement;
  let pointerEventSerializer: PointerEventSerializer;

  let pointerdownEvent: MockPointerEvent;
  let pointermoveEvent: MockPointerEvent;
  let pointerupEvent: MockPointerEvent;
  let pointercancelEvent: MockPointerEvent;

  beforeEach(() => {
    element = document.createElement('div');
    mockEventListener(element);
    mockEventListener(document);
    pointerEventSerializer = new PointerEventSerializer(element);

    pointerdownEvent = generateCustomEvent('pointerdown', ACTUAL_POINTER_DOWN) as MockPointerEvent;
    pointermoveEvent = generateCustomEvent('pointermove', ACTUAL_POINTER_MOVE) as MockPointerEvent;
    pointerupEvent = generateCustomEvent('pointerup', ACTUAL_POINTER_UP) as MockPointerEvent;
    pointercancelEvent = generateCustomEvent('pointercancel', ACTUAL_POINTER_UP) as MockPointerEvent;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not listen to any touch event when there is no subscription', () => {
    expect(element.addEventListener).not.toHaveBeenCalled();
  });

  it('should listen to `pointerdown` when there is a subscription', () => {
    pointerEventSerializer.down$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
  });
  it('should listen to `pointermove` when there is a subscription', () => {
    pointerEventSerializer.move$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
  });
  it('should listen to `pointerup` when there is a subscription', () => {
    pointerEventSerializer.end$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
  });
  it('should listen to `pointercancel` when there is a subscription', () => {
    pointerEventSerializer.cancel$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);
  });

  it('should remove listener to `pointerdown` when subscription has unsubscribe', () => {
    pointerEventSerializer.down$.subscribe().unsubscribe();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element.removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
  });
  it('should remove listener to `pointermove` when subscription has unsubscribe', () => {
    pointerEventSerializer.move$.subscribe().unsubscribe();
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
  });
  it('should remove listener to `pointerup` when subscription has unsubscribe', () => {
    pointerEventSerializer.end$.subscribe().unsubscribe();
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
  });
  it('should remove listener to `pointercancel` when subscription has unsubscribe', () => {
    pointerEventSerializer.cancel$.subscribe().unsubscribe();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);
  });

  it('should only listen to `pointerdown` once when there is multi subscription', () => {
    pointerEventSerializer.down$.subscribe();
    pointerEventSerializer.down$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), undefined);
  });
  it('should only listen to `pointermove` once when there is multi subscription', () => {
    pointerEventSerializer.move$.subscribe();
    pointerEventSerializer.move$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), undefined);
  });
  it('should only listen to `pointerup` once when there is multi subscription', () => {
    pointerEventSerializer.end$.subscribe();
    pointerEventSerializer.end$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), undefined);
  });
  it('should only listen to `pointercancel` once when there is multi subscription', () => {
    pointerEventSerializer.cancel$.subscribe();
    pointerEventSerializer.cancel$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), undefined);
  });

  it('should return correct values when start event has finished', (done) => {
    pointerEventSerializer.down$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: ACTUAL_POINTER_DOWN.pointerId,
          page: { x: 100, y: 400 },
          client: { x: 100, y: 200 },
          movement: { x: 0, y: 0 },
          originalEvent: pointerdownEvent,
        },
      ]);
      done();
    });

    element.dispatchEvent(pointerdownEvent);
  });
  it('should return correct values when move event has finished', (done) => {
    pointerEventSerializer.move$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: ACTUAL_POINTER_MOVE.pointerId,
          page: { x: 150, y: 450 },
          client: { x: 150, y: 250 },
          movement: { x: 50, y: 50 },
          originalEvent: pointermoveEvent,
        },
      ]);
      done();
    });

    document.dispatchEvent(pointermoveEvent);
  });
  it('should return correct values when end event has finished', (done) => {
    pointerEventSerializer.end$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: ACTUAL_POINTER_UP.pointerId,
          page: { x: 200, y: 500 },
          client: { x: 200, y: 300 },
          movement: { x: 50, y: 50 },
          originalEvent: pointerupEvent,
        },
      ]);
      done();
    });

    document.dispatchEvent(pointerupEvent);
  });
  it('should return correct values when cancel event has finished', (done) => {
    pointerEventSerializer.cancel$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: ACTUAL_POINTER_UP.pointerId,
          page: { x: 200, y: 500 },
          client: { x: 200, y: 300 },
          movement: { x: 50, y: 50 },
          originalEvent: pointerupEvent,
        },
      ]);
      done();
    });

    element.dispatchEvent(pointercancelEvent);
  });

  it('should remove all touch listener when the instance has restored ', () => {
    const mockCallback = jest.fn();

    pointerEventSerializer.down$.subscribe(mockCallback);
    pointerEventSerializer.move$.subscribe(mockCallback);
    pointerEventSerializer.end$.subscribe(mockCallback);
    pointerEventSerializer.cancel$.subscribe(mockCallback);

    pointerEventSerializer.destroy();
    element.dispatchEvent(pointerdownEvent);
    element.dispatchEvent(pointermoveEvent);
    element.dispatchEvent(pointerupEvent);
    element.dispatchEvent(pointercancelEvent);

    expect(element.removeEventListener).toBeCalledTimes(2);
    expect(element.removeEventListener).toBeCalledWith('pointerdown', expect.any(Function), undefined);
    expect(element.removeEventListener).toBeCalledWith('pointercancel', expect.any(Function), undefined);

    expect(document.removeEventListener).toBeCalledTimes(2);
    expect(document.removeEventListener).toBeCalledWith('pointermove', expect.any(Function), undefined);
    expect(document.removeEventListener).toBeCalledWith('pointerup', expect.any(Function), undefined);
  });
});

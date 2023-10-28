import { MouseEventSerializer } from '../../lib/gestures/mouse-event-serializer';
import { generateCustomEvent, mockEventListener } from '@internal-lib/util-testing';

type MockMouseEvent = CustomEvent<unknown> & {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  movementX: number;
  movementY: number;
};

const ACTUAL_MOUSE_DOWN = {
  pageX: 100,
  pageY: 400,
  clientX: 100,
  clientY: 200,
  movementX: 0,
  movementY: 0,
};

const ACTUAL_MOUSE_MOVE = {
  pageX: 150,
  pageY: 450,
  clientX: 150,
  clientY: 250,
  movementX: 50,
  movementY: 50,
};

const ACTUAL_MOUSE_UP = {
  pageX: 200,
  pageY: 500,
  clientX: 200,
  clientY: 300,
  movementX: 50,
  movementY: 50,
};

describe('Unit - MouseEventSerializer', () => {
  let element: HTMLDivElement;
  let mouseEventSerializer: MouseEventSerializer;

  let mousedownEvent: MockMouseEvent;
  let mousemoveEvent: MockMouseEvent;
  let mouseupEvent: MockMouseEvent;

  beforeEach(() => {
    element = document.createElement('div');
    mockEventListener(element);
    mockEventListener(document);
    mouseEventSerializer = new MouseEventSerializer(element);

    mousedownEvent = generateCustomEvent('mousedown', ACTUAL_MOUSE_DOWN) as MockMouseEvent;
    mousemoveEvent = generateCustomEvent('mousemove', ACTUAL_MOUSE_MOVE) as MockMouseEvent;
    mouseupEvent = generateCustomEvent('mouseup', ACTUAL_MOUSE_UP) as MockMouseEvent;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not listen to any touch event when there is no subscription', () => {
    expect(element.addEventListener).not.toHaveBeenCalled();
  });

  it('should listen to `mousedown` when there is a subscription', () => {
    mouseEventSerializer.down$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined);
  });
  it('should listen to `mousemove` when there is a subscription', () => {
    mouseEventSerializer.move$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function), undefined);
  });
  it('should listen to `mouseup` when there is a subscription', () => {
    mouseEventSerializer.end$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function), undefined);
  });

  it('should remove listener to `mousedown` when subscription has unsubscribe', () => {
    mouseEventSerializer.down$.subscribe().unsubscribe();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined);
  });
  it('should remove listener to `mousemove` when subscription has unsubscribe', () => {
    mouseEventSerializer.move$.subscribe().unsubscribe();
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function), undefined);
  });
  it('should remove listener to `mouseup` when subscription has unsubscribe', () => {
    mouseEventSerializer.end$.subscribe().unsubscribe();
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function), undefined);
  });

  it('should only listen to `mousedown` once when there is multi subscription', () => {
    mouseEventSerializer.down$.subscribe();
    mouseEventSerializer.down$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined);
  });
  it('should only listen to `mousemove` once when there is multi subscription', () => {
    mouseEventSerializer.move$.subscribe();
    mouseEventSerializer.move$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function), undefined);
  });
  it('should only listen to `mouseup` once when there is multi subscription', () => {
    mouseEventSerializer.end$.subscribe();
    mouseEventSerializer.end$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function), undefined);
  });

  it('should return correct values when down event has fired', (done) => {
    mouseEventSerializer.down$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: -1,
          page: { x: 100, y: 400 },
          client: { x: 100, y: 200 },
          movement: { x: 0, y: 0 },
          originalEvent: mousedownEvent,
        },
      ]);
      done();
    });

    element.dispatchEvent(mousedownEvent);
  });
  it('should return correct values when move event has fired', (done) => {
    mouseEventSerializer.move$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: -1,
          page: { x: 150, y: 450 },
          client: { x: 150, y: 250 },
          movement: { x: 50, y: 50 },
          originalEvent: mousemoveEvent,
        },
      ]);
      done();
    });

    document.dispatchEvent(mousemoveEvent);
  });
  it('should return correct values when up event has fired', (done) => {
    mouseEventSerializer.end$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: -1,
          page: { x: 200, y: 500 },
          client: { x: 200, y: 300 },
          movement: { x: 50, y: 50 },
          originalEvent: mouseupEvent,
        },
      ]);
      done();
    });

    document.dispatchEvent(mouseupEvent);
  });

  it('should remove all touch listener when the instance has restored ', () => {
    const mockCallback = jest.fn();

    mouseEventSerializer.down$.subscribe(mockCallback);
    mouseEventSerializer.move$.subscribe(mockCallback);
    mouseEventSerializer.end$.subscribe(mockCallback);

    mouseEventSerializer.destroy();
    element.dispatchEvent(mousedownEvent);
    element.dispatchEvent(mousemoveEvent);
    element.dispatchEvent(mouseupEvent);

    expect(element.removeEventListener).toBeCalledTimes(1);
    expect(element.removeEventListener).toBeCalledWith('mousedown', expect.any(Function), undefined);

    expect(document.removeEventListener).toBeCalledTimes(2);
    expect(document.removeEventListener).toBeCalledWith('mousemove', expect.any(Function), undefined);
    expect(document.removeEventListener).toBeCalledWith('mouseup', expect.any(Function), undefined);
  });
});

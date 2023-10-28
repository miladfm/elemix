import { TouchEventSerializer } from '../../lib/gestures/touch-event-serializer';
import { generateCustomEvent, mockEventListener } from '@internal-lib/util-testing';

type MockTouchEvent = CustomEvent<unknown> & {
  touches?: {
    identifier: number;
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
  }[];
};

const ACTUAL_TOUCHES_START = {
  touches: [
    {
      identifier: 0,
      pageX: 100,
      pageY: 400,
      clientX: 100,
      clientY: 200,
    },
  ],
};

const ACTUAL_TOUCHES_MOVE = {
  touches: [
    {
      identifier: 0,
      pageX: 150,
      pageY: 450,
      clientX: 150,
      clientY: 250,
    },
  ],
};

const ACTUAL_TOUCHES_END = {
  touches: [
    {
      identifier: 0,
      pageX: 200,
      pageY: 500,
      clientX: 200,
      clientY: 300,
    },
  ],
};

describe('Unit - TouchEventSerializer', () => {
  let element: HTMLDivElement;
  let touchEventSerializer: TouchEventSerializer;

  let touchstartEvent: MockTouchEvent;
  let touchmoveEvent: MockTouchEvent;
  let touchendEvent: MockTouchEvent;
  let touchcancelEvent: MockTouchEvent;

  beforeEach(() => {
    element = document.createElement('div');
    mockEventListener(element);
    mockEventListener(document);
    touchEventSerializer = new TouchEventSerializer(element);

    touchstartEvent = generateCustomEvent('touchstart', ACTUAL_TOUCHES_START);
    touchmoveEvent = generateCustomEvent('touchmove', ACTUAL_TOUCHES_MOVE);
    touchendEvent = generateCustomEvent('touchend', ACTUAL_TOUCHES_END);
    touchcancelEvent = generateCustomEvent('touchcancel', ACTUAL_TOUCHES_END);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not listen to any touch event when there is no subscription', () => {
    expect(element.addEventListener).not.toHaveBeenCalled();
  });

  it('should listen to `touchstart` when there is a subscription', () => {
    touchEventSerializer.down$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), undefined);
  });
  it('should listen to `touchmove` when there is a subscription', () => {
    touchEventSerializer.move$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), undefined);
  });
  it('should listen to `touchend` when there is a subscription', () => {
    touchEventSerializer.end$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), undefined);
  });
  it('should listen to `touchcancel` when there is a subscription', () => {
    touchEventSerializer.cancel$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function), undefined);
  });

  it('should remove listener to `touchstart` when subscription has unsubscribe', () => {
    touchEventSerializer.down$.subscribe().unsubscribe();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), undefined);
  });
  it('should remove listener to `touchmove` when subscription has unsubscribe', () => {
    touchEventSerializer.move$.subscribe().unsubscribe();
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), undefined);
  });
  it('should remove listener to `touchend` when subscription has unsubscribe', () => {
    touchEventSerializer.end$.subscribe().unsubscribe();
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), undefined);
  });
  it('should remove listener to `touchcancel` when subscription has unsubscribe', () => {
    touchEventSerializer.cancel$.subscribe().unsubscribe();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element.removeEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function), undefined);
  });

  it('should only listen to `touchstart` once when there is multi subscription', () => {
    touchEventSerializer.down$.subscribe();
    touchEventSerializer.down$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), undefined);
  });
  it('should only listen to `touchmove` once when there is multi subscription', () => {
    touchEventSerializer.move$.subscribe();
    touchEventSerializer.move$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), undefined);
  });
  it('should only listen to `touchend` once when there is multi subscription', () => {
    touchEventSerializer.end$.subscribe();
    touchEventSerializer.end$.subscribe();
    expect(document.addEventListener).toHaveBeenCalledTimes(1);
    expect(document.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), undefined);
  });
  it('should only listen to `touchcancel` once when there is multi subscription', () => {
    touchEventSerializer.cancel$.subscribe();
    touchEventSerializer.cancel$.subscribe();
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function), undefined);
  });

  it('should return correct values when start event has finished', (done) => {
    touchEventSerializer.down$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: touchstartEvent.touches[0].identifier,
          page: { x: 100, y: 400 },
          client: { x: 100, y: 200 },
          movement: { x: 0, y: 0 },
          originalEvent: touchstartEvent,
        },
      ]);
      done();
    });

    element.dispatchEvent(touchstartEvent);
  });
  it('should return correct values when move event has finished', (done) => {
    touchEventSerializer.move$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: touchmoveEvent.touches[0].identifier,
          page: { x: 150, y: 450 },
          client: { x: 150, y: 250 },
          movement: { x: 0, y: 0 },
          originalEvent: touchmoveEvent,
        },
      ]);
      done();
    });

    document.dispatchEvent(touchmoveEvent);
  });
  it('should return correct values when end event has finished', (done) => {
    touchEventSerializer.end$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: touchendEvent.touches[0].identifier,
          page: { x: 200, y: 500 },
          client: { x: 200, y: 300 },
          movement: { x: 0, y: 0 },
          originalEvent: touchendEvent,
        },
      ]);
      done();
    });

    document.dispatchEvent(touchendEvent);
  });
  it('should return correct values when cancel event has finished', (done) => {
    touchEventSerializer.cancel$.subscribe((e) => {
      expect(e).toEqual([
        {
          id: touchendEvent.touches[0].identifier,
          page: { x: 200, y: 500 },
          client: { x: 200, y: 300 },
          movement: { x: 0, y: 0 },
          originalEvent: touchendEvent,
        },
      ]);
      done();
    });

    element.dispatchEvent(touchcancelEvent);
  });

  it('should return correct movement for move event when start has fired before move', (done) => {
    touchEventSerializer.down$.subscribe();
    touchEventSerializer.move$.subscribe((e) => {
      e.forEach((interactionEvent) => expect(interactionEvent.movement).toEqual({ x: 50, y: 50 }));
      done();
    });

    element.dispatchEvent(touchstartEvent);
    document.dispatchEvent(touchmoveEvent);
  });
  it('should return correct movement for end when move event has fired before move', (done) => {
    touchEventSerializer.move$.subscribe();
    touchEventSerializer.end$.subscribe((e) => {
      e.forEach((interactionEvent) => expect(interactionEvent.movement).toEqual({ x: 50, y: 50 }));
      done();
    });

    document.dispatchEvent(touchmoveEvent);
    document.dispatchEvent(touchendEvent);
  });
  it('should return correct movement for cancel when move event has fired before move', (done) => {
    touchEventSerializer.move$.subscribe();
    touchEventSerializer.cancel$.subscribe((e) => {
      e.forEach((interactionEvent) => expect(interactionEvent.movement).toEqual({ x: 50, y: 50 }));
      done();
    });

    document.dispatchEvent(touchmoveEvent);
    element.dispatchEvent(touchcancelEvent);
  });

  it('should remove all touch listener when the instance has restored ', () => {
    const mockCallback = jest.fn();

    touchEventSerializer.down$.subscribe(mockCallback);
    touchEventSerializer.move$.subscribe(mockCallback);
    touchEventSerializer.end$.subscribe(mockCallback);
    touchEventSerializer.cancel$.subscribe(mockCallback);

    touchEventSerializer.destroy();
    element.dispatchEvent(touchstartEvent);
    element.dispatchEvent(touchmoveEvent);
    element.dispatchEvent(touchendEvent);
    element.dispatchEvent(touchcancelEvent);

    expect(element.removeEventListener).toBeCalledTimes(2);
    expect(element.removeEventListener).toBeCalledWith('touchstart', expect.any(Function), undefined);
    expect(element.removeEventListener).toBeCalledWith('touchcancel', expect.any(Function), undefined);

    expect(document.removeEventListener).toBeCalledTimes(2);
    expect(document.removeEventListener).toBeCalledWith('touchmove', expect.any(Function), undefined);
    expect(document.removeEventListener).toBeCalledWith('touchend', expect.any(Function), undefined);
  });
});

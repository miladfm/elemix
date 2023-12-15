import { mockEventListener, generateCustomEvent, clearListenerCallbacks, getActiveListener } from './event-listener';

describe('Util - mockEventListener', () => {
  let element1: Node;
  let element2: Node;

  beforeEach(() => {
    element1 = document.createElement('div');
    element2 = document.createElement('div');
    mockEventListener(element1);
    mockEventListener(element2);
  });

  it('should use mock addEventListener when mockEventListener has initialized', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    expect(element1.addEventListener).toHaveBeenCalledTimes(1);
    expect(element1.addEventListener).toHaveBeenCalledWith('click', mockCallback);
  });

  it('should not call the callback when addEventListener has called', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should use removeEventListener when mockEventListener has initialized', () => {
    const mockCallback = jest.fn();
    element1.removeEventListener('click', mockCallback);
    expect(element1.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element1.removeEventListener).toHaveBeenCalledWith('click', mockCallback);
  });

  it('should not invoke the callback function when dispatchEvent is called with unregistered event type', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    element1.dispatchEvent(new Event('mousedown'));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not invoke the callback function when dispatchEvent is called after removeEventListener', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    element1.removeEventListener('click', mockCallback);
    element1.dispatchEvent(new Event('click'));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should invoke the callback function when dispatchEvent is called with registered event type', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    element1.dispatchEvent(new Event('click'));
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should invoke multiple callbacks when multiple listeners are added for the same event on the same element', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    element1.addEventListener('click', mockCallback1);
    element1.addEventListener('click', mockCallback2);
    element1.dispatchEvent(new Event('click'));
    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });

  it('should handle callbacks independently when different elements have listeners for the same event type', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    element1.addEventListener('click', mockCallback1);
    element2.addEventListener('click', mockCallback2);
    element1.dispatchEvent(new Event('click'));
    element2.dispatchEvent(new Event('click'));
    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });

  it('should invoke the correct callback when multiple elements have different listeners for different events', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    element1.addEventListener('click', mockCallback1);
    element2.addEventListener('mouseover', mockCallback2);
    element1.dispatchEvent(new Event('click'));
    element2.dispatchEvent(new Event('mouseover'));
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should allow re-adding a previously removed callback and invoke it on subsequent event dispatches', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    element1.removeEventListener('click', mockCallback);
    element1.addEventListener('click', mockCallback);
    element1.dispatchEvent(new Event('click'));
    expect(mockCallback).toHaveBeenCalled();
  });
});

describe('Util - getActiveListener', () => {
  let element: Node;

  beforeEach(() => {
    element = document.createElement('div');
    mockEventListener(element);
  });

  it('should return 0 when no listeners are registered for the element', () => {
    expect(getActiveListener(element)).toBe(0);
  });

  it('should return 0 when no listeners are registered for the specified event', () => {
    element.addEventListener('click', jest.fn());
    expect(getActiveListener(element, 'mousemove')).toBe(0);
  });

  it('should return the number of listeners for the specified event', () => {
    element.addEventListener('mouseover', jest.fn());
    element.addEventListener('click', jest.fn());
    element.addEventListener('click', jest.fn());
    expect(getActiveListener(element, 'click')).toBe(2);
  });

  it('should return the total number of listeners when no event is specified', () => {
    element.addEventListener('mouseover', jest.fn());
    element.addEventListener('click', jest.fn());
    element.addEventListener('click', jest.fn());
    expect(getActiveListener(element)).toBe(3);
  });

  it('should return the number of listeners for a single event when a listener has removed', () => {
    const callback = jest.fn();
    element.addEventListener('mouseover', jest.fn());
    element.addEventListener('click', callback);
    element.addEventListener('click', jest.fn());
    element.removeEventListener('click', callback);
    expect(getActiveListener(element, 'click')).toBe(1);
  });

  it('should return the total number of listeners when a listener has removed', () => {
    const callback = jest.fn();
    element.addEventListener('mouseover', jest.fn());
    element.addEventListener('click', callback);
    element.addEventListener('click', jest.fn());
    element.removeEventListener('click', callback);
    expect(getActiveListener(element)).toBe(2);
  });
});

describe('Util - generateCustomEvent', () => {
  it('should handle custom event dispatch correctly when a custom event is dispatched to an element with a registered listener', () => {
    const name = 'eventName';
    const event = generateCustomEvent(name);
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toEqual(name);
  });

  it('should retain event properties and data when a custom event with additional data is dispatched', () => {
    const data = { key1: 'value1', key2: 'value2' };
    const event = generateCustomEvent('eventName', data);
    expect(event['key1']).toEqual(data.key1);
    expect(event['key2']).toEqual(data.key2);
  });
});

describe('Util - generateCustomEvent', () => {
  let element1: Node;
  let element2: Node;

  beforeEach(() => {
    element1 = document.createElement('div');
    element2 = document.createElement('div');
    mockEventListener(element1);
    mockEventListener(element2);
  });

  it('should not invoke any callbacks when `clearCallbacks` is called to clear all registered event listeners', () => {
    const mockCallback = jest.fn();
    element1.addEventListener('click', mockCallback);
    element1.addEventListener('click', mockCallback);
    element2.addEventListener('click', mockCallback);
    clearListenerCallbacks();
    element1.dispatchEvent(new Event('click'));
    expect(mockCallback).not.toHaveBeenCalled();
  });
});

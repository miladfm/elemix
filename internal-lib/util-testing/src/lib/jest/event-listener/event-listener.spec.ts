import { mockEventListener, generateCustomEvent } from './event-listener';

describe('Util - mockEventListener', () => {
  let element: Node;

  beforeEach(() => {
    element = document.createElement('div');
    mockEventListener(element);
  });

  it('should use mock addEventListener when mockEventListener has initialized', () => {
    const mockCallback = jest.fn();
    element.addEventListener('click', mockCallback);
    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith('click', mockCallback);
  });

  it('should not call the callback when addEventListener has called', () => {
    const mockCallback = jest.fn();
    element.addEventListener('click', mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should use removeEventListener when mockEventListener has initialized', () => {
    const mockCallback = jest.fn();
    element.removeEventListener('click', mockCallback);
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    expect(element.removeEventListener).toHaveBeenCalledWith('click', mockCallback);
  });

  it('should not invoke the callback function when dispatchEvent is called with unregistered event type', () => {
    const mockCallback = jest.fn();
    element.addEventListener('click', mockCallback);
    element.dispatchEvent(new Event('mousedown'));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not invoke the callback function when dispatchEvent is called after removeEventListener', () => {
    const mockCallback = jest.fn();
    element.addEventListener('click', mockCallback);
    element.removeEventListener('click', mockCallback);
    element.dispatchEvent(new Event('click'));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should invoke the callback function when dispatchEvent is called with registered event type', () => {
    const mockCallback = jest.fn();
    element.addEventListener('click', mockCallback);
    element.dispatchEvent(new Event('click'));
    expect(mockCallback).toHaveBeenCalled();
  });
});

describe('Util - generateCustomEvent', () => {
  it('should return a CustomEvent object with correct name', () => {
    const name = 'eventName';
    const event = generateCustomEvent(name);
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toEqual(name);
  });

  it('should attach data to the CustomEvent object', () => {
    const data = { key1: 'value1', key2: 'value2' };
    const event = generateCustomEvent('eventName', data);
    expect(event['key1']).toEqual(data.key1);
    expect(event['key2']).toEqual(data.key2);
  });
});

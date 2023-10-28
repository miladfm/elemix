const events = {} as Record<string, EventListener | null>;
export function mockEventListener(element: Node) {
  jest.spyOn(element, 'addEventListener').mockImplementation((event, callback) => {
    events[event] = callback as EventListener;
  });

  jest.spyOn(element, 'removeEventListener').mockImplementation((event, callback) => {
    events[event] = null;
  });

  jest.spyOn(element, 'dispatchEvent').mockImplementation((event) => {
    const callback = events[event.type];
    if (callback) {
      callback(event);
    }
    return true;
  });
}

export function generateCustomEvent(name: string, data: Record<string, any> = {}): CustomEvent & Record<string, any> {
  const customEvent = new CustomEvent(name) as CustomEvent & Record<string, any>;

  for (const key in data) {
    customEvent[key] = data[key];
  }

  return customEvent;
}

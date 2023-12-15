// const events = {} as Record<string, EventListener | null>;
const events = new Map<Node, Map<string, Set<EventListener>>>();
export function mockEventListener(element: Node) {
  jest.spyOn(element, 'addEventListener').mockImplementation((event, callback) => {
    if (!events.has(element)) {
      events.set(element, new Map<string, Set<EventListener>>());
    }

    if (!events.get(element)!.has(event)) {
      events.get(element)!.set(event, new Set());
    }

    const elemMap = events.get(element)!;
    const eventSet = elemMap.get(event)!;

    eventSet.add(callback as EventListener);
  });

  jest.spyOn(element, 'removeEventListener').mockImplementation((event, callback) => {
    const elemMap = events.get(element);
    const eventSet = elemMap?.get(event);

    if (eventSet?.has(callback as EventListener)) {
      eventSet.delete(callback as EventListener);
    }
  });

  jest.spyOn(element, 'dispatchEvent').mockImplementation((event) => {
    const elemMap = events.get(element);
    const eventSet = elemMap?.get(event.type);

    eventSet?.forEach((callback) => callback(event));
    return true;
  });
}

export function getActiveListener(element: Node, event?: string): number {
  const elementListeners = events.get(element);

  if (!elementListeners) {
    return 0;
  }

  if (event) {
    return elementListeners.get(event)?.size ?? 0;
  }

  // If no event name is provided, count all listeners for the element
  let count = 0;
  elementListeners.forEach((listeners) => {
    count += listeners.size;
  });
  return count;
}

export function generateCustomEvent<T extends Record<string, any>>(name: string, data: T = {} as T): CustomEvent & T {
  const customEvent = new CustomEvent(name) as CustomEvent & Record<string, any>;

  for (const key in data) {
    customEvent[key] = data[key];
  }

  return customEvent as CustomEvent & T;
}

export function clearListenerCallbacks() {
  events.clear();
}

type MockElementSize = {
  naturalWidth: number;
  naturalHeight: number;
  offsetWidth: number;
  offsetHeight: number;
};

export function mockClientRect(
  element: Element,
  { width, height, left, top }: { width: number; height: number; top: number; left: number }
) {
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    ...element.getBoundingClientRect(),
    width,
    height,
    x: left,
    y: top,
    left,
    top,
    right: left + width,
    bottom: height + top,
  });
}

export function mockElementAttribute(element: HTMLElement, size: Partial<MockElementSize>) {
  Object.entries(size).forEach(([key, value]) => {
    Object.defineProperty(element, key, { configurable: true, value });
  });
}

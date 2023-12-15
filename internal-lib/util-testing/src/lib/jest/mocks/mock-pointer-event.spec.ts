import { MockPointerEvent } from './mock-pointer-event';

describe('MockPointerEvent', () => {
  let mockElementDispatchEvent: jest.SpyInstance<boolean, [event: PointerEvent], any>;
  let mockDocumentDispatchEvent: jest.SpyInstance<boolean, [event: PointerEvent], any>;
  let mockElement: Element;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElementDispatchEvent = jest.spyOn(mockElement, 'dispatchEvent') as jest.SpyInstance<boolean, [event: PointerEvent], any>;
    mockDocumentDispatchEvent = jest.spyOn(document, 'dispatchEvent') as jest.SpyInstance<boolean, [event: PointerEvent], any>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // pointerdown
  it(`should correctly dispatch a pointerdown event with the specified data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1 });
    mockPointerEvent.dispatchDown({
      element: mockElement,
      x: 100,
      y: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({
      type: 'pointerdown',
      pointerId: 1,
      pageX: 100,
      pageY: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });
  });
  it(`should use the defaultDownElement for dispatch a pointerdown even when no element is provided in data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1, defaultDownElement: mockElement });
    mockPointerEvent.dispatchDown({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should use the document for dispatch a pointerdown even when no element or defaultDownElement is provided`, () => {
    const mockPointerEvent = new MockPointerEvent();
    mockPointerEvent.dispatchDown({ x: 100, y: 200 });

    const dispatchedEvent = mockDocumentDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should set default values for clientX and clientY as x and y for dispatch a pointerdown even when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultDownElement: mockElement });
    mockPointerEvent.dispatchDown({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ clientX: 100, clientY: 200 });
  });
  it(`should set default values for movementX and movementY as 0 for dispatch a pointerdown when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultDownElement: mockElement });
    mockPointerEvent.dispatchDown({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ movementX: 0, movementY: 0 });
  });
  it(`should include default pointerId in the dispatched event when pointerdown has dispatched and no pointerId is provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultDownElement: mockElement });
    mockPointerEvent.dispatchDown({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pointerId: 0 });
  });

  // pointermove
  it(`should correctly dispatch a pointermove event with the specified data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1 });
    mockPointerEvent.dispatchMove({
      element: mockElement,
      x: 100,
      y: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({
      type: 'pointermove',
      pointerId: 1,
      pageX: 100,
      pageY: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });
  });
  it(`should use the defaultDownElement for dispatch a pointermove even when no element is provided in data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1, defaultMoveElement: mockElement });
    mockPointerEvent.dispatchMove({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should use the document for dispatch a pointermove even when no element or defaultMoveElement is provided`, () => {
    const mockPointerEvent = new MockPointerEvent();
    mockPointerEvent.dispatchMove({ x: 100, y: 200 });

    const dispatchedEvent = mockDocumentDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should set default values for clientX and clientY as x and y for dispatch a pointermove even when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultMoveElement: mockElement });
    mockPointerEvent.dispatchMove({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ clientX: 100, clientY: 200 });
  });
  it(`should set default values for movementX and movementY as 0 for dispatch a pointermove when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultMoveElement: mockElement });
    mockPointerEvent.dispatchMove({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ movementX: 0, movementY: 0 });
  });
  it(`should include default pointerId in the dispatched event when pointermove has dispatched and no pointerId is provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultMoveElement: mockElement });
    mockPointerEvent.dispatchMove({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pointerId: 0 });
  });

  // pointerup
  it(`should correctly dispatch a pointerup event with the specified data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1 });
    mockPointerEvent.dispatchUp({
      element: mockElement,
      x: 100,
      y: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({
      type: 'pointerup',
      pointerId: 1,
      pageX: 100,
      pageY: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });
  });
  it(`should use the defaultDownElement for dispatch a pointerup even when no element is provided in data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1, defaultUpElement: mockElement });
    mockPointerEvent.dispatchUp({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should use the document for dispatch a pointerup even when no element or defaultUpElement is provided`, () => {
    const mockPointerEvent = new MockPointerEvent();
    mockPointerEvent.dispatchUp({ x: 100, y: 200 });

    const dispatchedEvent = mockDocumentDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should set default values for clientX and clientY as x and y for dispatch a pointerup even when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultUpElement: mockElement });
    mockPointerEvent.dispatchUp({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ clientX: 100, clientY: 200 });
  });
  it(`should set default values for movementX and movementY as 0 for dispatch a pointerup when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultUpElement: mockElement });
    mockPointerEvent.dispatchUp({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ movementX: 0, movementY: 0 });
  });
  it(`should include default pointerId in the dispatched event when pointerup has dispatched and no pointerId is provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultUpElement: mockElement });
    mockPointerEvent.dispatchUp({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pointerId: 0 });
  });

  // pointercancel
  it(`should correctly dispatch a pointercancel event with the specified data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1 });
    mockPointerEvent.dispatchCancel({
      element: mockElement,
      x: 100,
      y: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({
      type: 'pointercancel',
      pointerId: 1,
      pageX: 100,
      pageY: 200,
      clientX: 300,
      clientY: 400,
      movementX: 500,
      movementY: 600,
    });
  });
  it(`should use the defaultDownElement for dispatch a pointercancel even when no element is provided in data`, () => {
    const mockPointerEvent = new MockPointerEvent({ pointerId: 1, defaultCancelElement: mockElement });
    mockPointerEvent.dispatchCancel({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should use the document for dispatch a pointercancel even when no element or defaultCancelElement is provided`, () => {
    const mockPointerEvent = new MockPointerEvent();
    mockPointerEvent.dispatchCancel({ x: 100, y: 200 });

    const dispatchedEvent = mockDocumentDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pageX: 100, pageY: 200 });
  });
  it(`should set default values for clientX and clientY as x and y for dispatch a pointercancel even when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultCancelElement: mockElement });
    mockPointerEvent.dispatchCancel({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ clientX: 100, clientY: 200 });
  });
  it(`should set default values for movementX and movementY as 0 for dispatch a pointercancel when not provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultCancelElement: mockElement });
    mockPointerEvent.dispatchCancel({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ movementX: 0, movementY: 0 });
  });
  it(`should include default pointerId in the dispatched event when pointercancel has dispatched and no pointerId is provided`, () => {
    const mockPointerEvent = new MockPointerEvent({ defaultCancelElement: mockElement });
    mockPointerEvent.dispatchCancel({ x: 100, y: 200 });

    const dispatchedEvent = mockElementDispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent).toMatchObject({ pointerId: 0 });
  });
});

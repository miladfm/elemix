import { generateCustomEvent } from './event-listener';

interface MockPointerEventConfig {
  defaultDownElement: Element | Document;
  defaultMoveElement: Element | Document;
  defaultUpElement: Element | Document;
  defaultCancelElement: Element | Document;
  pointerId: number;
}

interface MockPointerEventDispatch {
  element?: Element | Document;
  x: number; // PageX
  y: number; // PageY
  clientX?: number; // Default is x
  clientY?: number; // Default is y
  movementX?: number; // Default is 0
  movementY?: number; // Default is 0
}

export enum PointerEventName {
  Down = 'pointerdown',
  Move = 'pointermove',
  Up = 'pointerup',
  Cancel = 'pointercancel',
}

export class MockPointerEvent {
  private defaultElement: Record<PointerEventName, Element | Document>;
  private pointerId: number;

  constructor(config: Partial<MockPointerEventConfig> = {}) {
    this.pointerId = config.pointerId ?? 0;
    this.defaultElement = {
      [PointerEventName.Down]: config.defaultDownElement ?? document,
      [PointerEventName.Move]: config.defaultMoveElement ?? document,
      [PointerEventName.Up]: config.defaultUpElement ?? document,
      [PointerEventName.Cancel]: config.defaultCancelElement ?? document,
    };
  }

  private dispatch(eventName: PointerEventName, data: MockPointerEventDispatch) {
    const event = generateCustomEvent<Partial<PointerEvent>>(eventName, {
      pointerId: this.pointerId,
      pageX: data.x,
      pageY: data.y,
      clientX: data.clientX ?? data.x,
      clientY: data.clientY ?? data.y,
      movementX: data.movementX ?? 0,
      movementY: data.movementY ?? 0,
    });
    const element = data.element ?? this.defaultElement[eventName];
    element.dispatchEvent(event);
    return event;
  }

  public dispatchDown(data: MockPointerEventDispatch) {
    return this.dispatch(PointerEventName.Down, data);
  }

  public dispatchMove(data: MockPointerEventDispatch) {
    return this.dispatch(PointerEventName.Move, data);
  }

  public dispatchUp(data: MockPointerEventDispatch) {
    return this.dispatch(PointerEventName.Up, data);
  }

  public dispatchCancel(data: MockPointerEventDispatch) {
    return this.dispatch(PointerEventName.Cancel, data);
  }
}

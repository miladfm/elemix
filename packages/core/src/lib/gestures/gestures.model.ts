export type PointerId = number;

export enum GesturesEventType {
  Press = 'press',
  PressRelease = 'pressRelease',

  DragPress = 'dragPress',
  DragStart = 'dragStart',
  Drag = 'drag',
  DragEnd = 'dragEnd',
  DragRelease = 'dragRelease',

  ZoomPress = 'zoomPress',
  ZoomStart = 'zoomStart',
  Zoom = 'zoom',
  ZoomEnd = 'zoomEnd',
  ZoomRelease = 'zoomRelease',
}

export type PressGesturesEventType = GesturesEventType.Press | GesturesEventType.PressRelease;

export type DragGesturesEventType =
  | GesturesEventType.DragPress
  | GesturesEventType.DragStart
  | GesturesEventType.Drag
  | GesturesEventType.DragEnd
  | GesturesEventType.DragRelease;

export type ZoomGesturesEventType =
  | GesturesEventType.ZoomPress
  | GesturesEventType.ZoomStart
  | GesturesEventType.Zoom
  | GesturesEventType.ZoomEnd
  | GesturesEventType.ZoomRelease;

export interface GesturesOptions {
  /**
   * The minimum movements in pixels that the pointer event must be moved
   * along either the x or y axis to initiate the dragging process.
   */
  minDragMovements: number;
}

export interface PressGesturesEvent {
  type: PressGesturesEventType;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;

  event: PointerEvent;
}

export interface DragGesturesEvent {
  type: DragGesturesEventType;

  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  movementX: number;
  movementY: number;

  movementXFromPress: number | null; // available after DragPress
  movementYFromPress: number | null; // available after DragPress
  movementXFromStart: number | null; // available after DragStart
  movementYFromStart: number | null; // available after DragStart

  event: PointerEvent;
}

export interface ZoomGesturesEvent {
  type: ZoomGesturesEventType;

  distance: number;
  scaleFactorFromPress: number | null; // available after ZoomPress

  centerPageX: number;
  centerPageY: number;
  centerClientX: number;
  centerClientY: number;
  centerMovementX: number;
  centerMovementY: number;

  centerMovementXFromPress: number | null; // available after ZoomPress
  centerMovementYFromPress: number | null; // available after ZoomPress

  event: PointerEvent;
}

export type GesturesEvent = PressGesturesEvent | DragGesturesEvent | ZoomGesturesEvent;

export interface GestureHandlerParams {
  isDown: boolean;
  isMove: boolean;
  isUp: boolean;
  isCancel: boolean;
  isUpOrCancel: boolean;
  pointerLength: number;
  eventList: PointerEvent[];
  event: PointerEvent;
}

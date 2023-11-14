import { GestureStrategyBase } from './gesture-strategy.base';
import { DragGesturesEvent, DragGesturesEventType, GestureHandlerParams, GesturesEventType } from './gestures.model';

export class DragGestureStrategy extends GestureStrategyBase {
  private pressEvent: PointerEvent | null = null;
  private startEvent: PointerEvent | null = null;
  private shouldCheckMinMovements = true; // We don't need to check minMovement when the gesture switched from zoom to drag

  private get hasPressEventDispatched() {
    return !!this.pressEvent;
  }

  private get hasStartEventDispatched() {
    return !!this.startEvent;
  }

  constructor(private options: { minMovement: number }) {
    super();
  }

  override gestureHandler(params: GestureHandlerParams): DragGesturesEvent[] {
    const identifiedGestures = [
      ...this.identifyDragPressGesture(params),
      ...this.identifyDragStartGesture(params),
      ...this.identifyDragGesture(params),
      ...this.identifyDragEndGesture(params),
      ...this.identifyDragReleaseGesture(params),
    ];
    this.afterGesturesIdentified(identifiedGestures, params);
    const dragGesturesEvents = identifiedGestures.map((gestureType) => this.createGestureEvent(gestureType, params.event));
    this.afterGestureEventCreated(identifiedGestures);

    return dragGesturesEvents;
  }

  // region Identifier
  private identifyDragPressGesture(params: GestureHandlerParams): DragGesturesEventType[] {
    if (!this.hasPressEventDispatched && params.isDown && params.pointerLength === 1) {
      return [GesturesEventType.DragPress];
    }
    return [];
  }

  private identifyDragStartGesture(params: GestureHandlerParams): DragGesturesEventType[] {
    // from zoom to drag without checking the movement
    if (!this.hasStartEventDispatched && params.isMove && !this.shouldCheckMinMovements && params.pointerLength === 1) {
      return [GesturesEventType.DragStart];
    }

    // from press to drag with checking the movement
    const isMovementExceeded = this.isMovementExceeded(params.event);
    if (
      !this.hasStartEventDispatched &&
      params.isMove &&
      this.shouldCheckMinMovements &&
      isMovementExceeded &&
      params.pointerLength === 1
    ) {
      return [GesturesEventType.DragStart];
    }

    return [];
  }

  private identifyDragGesture(params: GestureHandlerParams): DragGesturesEventType[] {
    if (this.hasStartEventDispatched && params.isMove && params.pointerLength === 1) {
      return [GesturesEventType.Drag];
    }
    return [];
  }

  private identifyDragEndGesture(params: GestureHandlerParams): DragGesturesEventType[] {
    // from drag to press
    if (this.hasStartEventDispatched && params.isUpOrCancel && params.pointerLength === 0) {
      return [GesturesEventType.DragEnd];
    }

    // from drag to zoom
    if (this.hasStartEventDispatched && params.isDown && params.pointerLength > 1) {
      return [GesturesEventType.DragEnd];
    }
    return [];
  }

  private identifyDragReleaseGesture(params: GestureHandlerParams): DragGesturesEventType[] {
    if (this.hasPressEventDispatched && params.isUpOrCancel && params.pointerLength === 0) {
      return [GesturesEventType.DragRelease];
    }

    return [];
  }

  // endregion

  // region Hooks
  private afterGesturesIdentified(identifiedGestures: DragGesturesEventType[], params: GestureHandlerParams) {
    if (identifiedGestures.includes(GesturesEventType.DragPress)) {
      this.pressEvent = params.event;
    }

    if (identifiedGestures.includes(GesturesEventType.DragStart)) {
      this.startEvent = params.event;
      this.shouldCheckMinMovements = false;
    }

    // We don't need to check minMovement when the gesture switched from zoom to drag
    if (params.isUpOrCancel && params.pointerLength === 1) {
      this.shouldCheckMinMovements = false;
    }
  }

  private afterGestureEventCreated(identifiedGestures: DragGesturesEventType[]) {
    if (identifiedGestures.includes(GesturesEventType.DragEnd)) {
      this.startEvent = null;
    }
  }

  // endregion

  // region Helpers
  private createGestureEvent(gestureType: DragGesturesEventType, event: PointerEvent) {
    return {
      type: gestureType,
      pageX: event.pageX,
      pageY: event.pageY,
      clientX: event.clientX,
      clientY: event.clientY,
      movementX: event.movementX,
      movementY: event.movementY,
      movementXFromPress: this.pressEvent && event.pageX - this.pressEvent.pageX,
      movementYFromPress: this.pressEvent && event.pageY - this.pressEvent.pageY,
      movementXFromStart: this.startEvent && event.pageX - this.startEvent.pageX,
      movementYFromStart: this.startEvent && event.pageY - this.startEvent.pageY,
      event,
    };
  }

  private isMovementExceeded(event: PointerEvent): boolean {
    const isXMovementExceeded = this.pressEvent && Math.abs(event.pageX - this.pressEvent.pageX) >= this.options.minMovement;
    const isYMovementExceeded = this.pressEvent && Math.abs(event.pageY - this.pressEvent.pageY) >= this.options.minMovement;
    return !!(isXMovementExceeded || isYMovementExceeded);
  }

  // endregion
}

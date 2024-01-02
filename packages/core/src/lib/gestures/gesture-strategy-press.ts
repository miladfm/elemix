import { GestureStrategyBase } from './gesture-strategy.base';
import { GestureHandlerParams, GesturesEventType, PressGesturesEvent, PressGesturesEventType } from './gestures.model';

export class PressGestureStrategy extends GestureStrategyBase {
  protected gestureHandler(params: GestureHandlerParams): PressGesturesEvent[] {
    const identifiedGestures = [...this.identifyPressGesture(params), ...this.identifyPressReleaseGesture(params)];
    const gestureEvents = identifiedGestures.map((gestureType) => this.createGestureEvent(gestureType, params.event));
    return gestureEvents;
  }

  private identifyPressGesture(params: GestureHandlerParams): PressGesturesEventType[] {
    if (params.isDown && params.pointerLength === 1) {
      return [GesturesEventType.Press];
    }

    return [];
  }

  private identifyPressReleaseGesture(params: GestureHandlerParams): PressGesturesEventType[] {
    if (params.isUpOrCancel && params.pointerLength === 0) {
      return [GesturesEventType.PressRelease];
    }

    return [];
  }

  private createGestureEvent(gestureType: PressGesturesEventType, event: PointerEvent): PressGesturesEvent {
    return {
      type: gestureType,
      pageX: event.pageX,
      pageY: event.pageY,
      clientX: event.clientX,
      clientY: event.clientY,
      event,
    };
  }
}

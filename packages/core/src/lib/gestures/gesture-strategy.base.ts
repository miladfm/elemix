import { GestureHandlerParams, GesturesEvent, PointerId } from './gestures.model';

export abstract class GestureStrategyBase {
  protected abstract gestureHandler(params: GestureHandlerParams): GesturesEvent[];

  public detectGesture(events: Map<PointerId, PointerEvent>, activeEvent: PointerEvent): GesturesEvent[] {
    return this.gestureHandler({
      isDown: activeEvent.type === 'pointerdown',
      isMove: activeEvent.type === 'pointermove',
      isUp: activeEvent.type === 'pointerup',
      isCancel: activeEvent.type === 'pointercancel',
      isUpOrCancel: activeEvent.type === 'pointerup' || activeEvent.type === 'pointercancel',
      pointerLength: events.size,
      eventList: this.getAllEventListIncludingActive(events, activeEvent),
      event: activeEvent,
    });
  }

  // Creates a new Map including the active event
  private getAllEventListIncludingActive(events: Map<PointerId, PointerEvent>, activeEvent: PointerEvent): PointerEvent[] {
    const allEvents = new Map(events);
    allEvents.set(activeEvent.pointerId, activeEvent);
    return Array.from(allEvents.values());
  }
}

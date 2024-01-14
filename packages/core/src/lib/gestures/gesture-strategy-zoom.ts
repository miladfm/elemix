import { GestureStrategyBase } from './gesture-strategy.base';
import { GestureHandlerParams, GesturesEventType, ZoomGesturesEvent, ZoomGesturesEventType } from './gestures.model';
import { average, getDistance } from '../common/math.util';

export class ZoomGestureStrategy extends GestureStrategyBase {
  private pressEvent: PointerEvent | null = null;
  private startEvent: PointerEvent | null = null;
  private eventCounter = 0;

  private pressEventCenterMovementX: number | null = null;
  private pressEventCenterMovementY: number | null = null;
  private pressEventDistance: number | null = null;

  private startEventCenterMovementX: number | null = null;
  private startEventCenterMovementY: number | null = null;
  private startEventDistance: number | null = null;

  private get hasPressEventDispatched() {
    return !!this.pressEvent;
  }

  private get hasStartEventDispatched() {
    return !!this.startEvent;
  }

  constructor(private option: { minEventThreshold: number }) {
    super();
  }

  protected gestureHandler(params: GestureHandlerParams): ZoomGesturesEvent[] {
    const identifiedGestures = [
      ...this.identifyZoomPressGesture(params),
      ...this.identifyZoomStartGesture(params),
      ...this.identifyZoomGesture(params),
      ...this.identifyZoomEndGesture(params),
      ...this.identifyZoomReleaseGesture(params),
    ];

    this.afterGesturesIdentified(identifiedGestures, params);
    const zoomGesturesEvents = identifiedGestures.map((gestureType) => this.createGestureEvent(gestureType, params));
    this.afterGestureEventCreated(params);

    this.eventCounter = params.eventList.length === 2 ? this.eventCounter + 1 : 0;
    return zoomGesturesEvents;
  }

  // region Identifier
  private identifyZoomPressGesture(params: GestureHandlerParams): ZoomGesturesEventType[] {
    if (params.isDown && !this.pressEvent && params.pointerLength === 2) {
      return [GesturesEventType.ZoomPress];
    }
    return [];
  }

  private identifyZoomStartGesture(params: GestureHandlerParams): ZoomGesturesEventType[] {
    if (
      this.hasPressEventDispatched &&
      !this.hasStartEventDispatched &&
      params.isMove &&
      this.eventCounter >= this.option.minEventThreshold &&
      params.pointerLength === 2
    ) {
      return [GesturesEventType.ZoomStart];
    }
    return [];
  }

  private identifyZoomGesture(params: GestureHandlerParams): ZoomGesturesEventType[] {
    if (this.hasStartEventDispatched && params.isMove && params.pointerLength === 2) {
      return [GesturesEventType.Zoom];
    }
    return [];
  }

  private identifyZoomEndGesture(params: GestureHandlerParams): ZoomGesturesEventType[] {
    if (this.hasStartEventDispatched && params.isUpOrCancel && params.pointerLength !== 2) {
      return [GesturesEventType.ZoomEnd];
    }
    return [];
  }

  private identifyZoomReleaseGesture(params: GestureHandlerParams): ZoomGesturesEventType[] {
    if (this.hasPressEventDispatched && params.isUpOrCancel && params.pointerLength !== 2) {
      return [GesturesEventType.ZoomRelease];
    }
    return [];
  }

  // endregion

  // region Hooks
  private afterGesturesIdentified(identifiedGestures: ZoomGesturesEventType[], params: GestureHandlerParams) {
    if (identifiedGestures.includes(GesturesEventType.ZoomPress)) {
      this.pressEvent = params.event;
      this.pressEventCenterMovementX = average(params.eventList.map((e) => e.pageX));
      this.pressEventCenterMovementY = average(params.eventList.map((e) => e.pageY));
      this.pressEventDistance = getDistance(
        params.eventList[0].pageX,
        params.eventList[0].pageY,
        params.eventList[1].pageX,
        params.eventList[1].pageY
      );
    }

    if (identifiedGestures.includes(GesturesEventType.ZoomStart)) {
      this.startEvent = params.event;
      this.startEventCenterMovementX = average(params.eventList.map((e) => e.pageX));
      this.startEventCenterMovementY = average(params.eventList.map((e) => e.pageY));
      this.startEventDistance = getDistance(
        params.eventList[0].pageX,
        params.eventList[0].pageY,
        params.eventList[1].pageX,
        params.eventList[1].pageY
      );
    }
  }

  private afterGestureEventCreated(params: GestureHandlerParams) {
    if (params.pointerLength !== 2) {
      this.pressEvent = null;
      this.startEvent = null;

      this.pressEventCenterMovementX = null;
      this.pressEventCenterMovementY = null;
      this.pressEventDistance = null;

      this.startEventCenterMovementX = null;
      this.startEventCenterMovementY = null;
      this.startEventDistance = null;
    }
  }

  // endregion

  // region Helpers
  private createGestureEvent(gestureType: ZoomGesturesEventType, params: GestureHandlerParams): ZoomGesturesEvent {
    const centerPageX = average(params.eventList.map((e) => e.pageX));
    const centerPageY = average(params.eventList.map((e) => e.pageY));

    const distance = getDistance(
      params.eventList[0].pageX,
      params.eventList[0].pageY,
      params.eventList[1].pageX,
      params.eventList[1].pageY
    );

    return {
      type: gestureType,

      distance: getDistance(params.eventList[0].pageX, params.eventList[0].pageY, params.eventList[1].pageX, params.eventList[1].pageY),
      scaleFactorFromPress: this.pressEventDistance && Number((distance / this.pressEventDistance).toFixed(2)),
      scaleFactorFromStart: this.startEventDistance && Number((distance / this.startEventDistance).toFixed(2)),

      centerPageX,
      centerPageY,
      centerClientX: average(params.eventList.map((e) => e.clientX)),
      centerClientY: average(params.eventList.map((e) => e.clientY)),
      centerOffsetX: average(params.eventList.map((e) => e.offsetX)),
      centerOffsetY: average(params.eventList.map((e) => e.offsetY)),
      centerMovementX: average(params.eventList.map((e) => e.movementX)),
      centerMovementY: average(params.eventList.map((e) => e.movementY)),

      centerMovementXFromPress: this.pressEventCenterMovementX && centerPageX - this.pressEventCenterMovementX,
      centerMovementYFromPress: this.pressEventCenterMovementY && centerPageY - this.pressEventCenterMovementY,

      centerMovementXFromStart: this.startEventCenterMovementX && centerPageX - this.startEventCenterMovementX,
      centerMovementYFromStart: this.startEventCenterMovementY && centerPageY - this.startEventCenterMovementY,

      event: params.event,
    };
  }

  // endregion
}

import { Animation, Dom, DomType, Gestures, GesturesEvent, GesturesEventType, TransformProperty, ZoomGesturesEvent } from '@elemix/core';

import { ZoomAdjuster, ZoomAdjusterConfig, ZoomAdjusterHooks } from '../zoom.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { pinchZoomScaleAdjuster } from './pinch-zoom-scale-adjusters';
import { PinchZoomOptions } from './pinch-zoom.model';

const DEFAULT_OPTIONS: PinchZoomOptions = {};

const PINCH_ZOOM_GESTURES_TYPE = [
  GesturesEventType.ZoomPress,
  GesturesEventType.ZoomStart,
  GesturesEventType.Zoom,
  GesturesEventType.ZoomEnd,
  GesturesEventType.ZoomRelease,
];

export class PinchZoom {
  private eventsSubject$ = new Subject<ZoomGesturesEvent>();
  public events$: Observable<ZoomGesturesEvent> = this.eventsSubject$.asObservable();

  private _isEnable = false;
  public get isEnable() {
    return this._isEnable;
  }

  private set isEnable(isEnable: boolean) {
    this._isEnable = isEnable;
  }

  private _isZooming = false;
  public get isZooming() {
    return this._isZooming;
  }

  private set isZooming(isZooming: boolean) {
    this._isZooming = isZooming;
  }

  private readonly options: PinchZoomOptions;
  private readonly element: Dom;
  private gesture: Gestures;
  private animation: Animation;
  private gestureChangesSub: Subscription | null = null;

  private translateOnStart: TransformProperty | null;
  private zoomAdjuster: (ZoomAdjuster | ZoomAdjusterHooks)[];

  constructor(selector: DomType, options: Partial<PinchZoomOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.element = new Dom(selector);
    this.gesture = new Gestures(this.element);
    this.animation = Animation.getOrCreateInstance(this.element);

    this.addZoomStyle();
    this.setZoomAdjuster();
    this.enable();
  }

  private addZoomStyle() {
    this.element.setStyleImmediately('transformOrigin', '0% 0%');
    this.element.setStyleImmediately('userSelect', 'none');
    this.element.setStyleImmediately('touchAction', 'none');
  }

  private setZoomAdjuster() {
    this.zoomAdjuster = [pinchZoomScaleAdjuster];
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.gestureChangesSub = this.gesture.changes$.subscribe(async (event: GesturesEvent) => {
      if (!this.isPinchZoomGesture(event)) {
        return;
      }

      this.handleGesture(event);
      this.eventsSubject$.next(event);
    });
    this.isEnable = true;
  }

  public disable() {
    this.gestureChangesSub?.unsubscribe();
    this.gestureChangesSub = null;
    this.isEnable = false;
  }

  public destroy() {
    this.disable();
    this.eventsSubject$.complete();
    // TODO: Don't let the enable method works after destroy
  }

  private async handleGesture(event: GesturesEvent) {
    switch (event.type) {
      case GesturesEventType.ZoomPress:
        this.handlePinchZoomPress(event);
        break;

      case GesturesEventType.ZoomStart:
        this.handlePinchZoomStart(event);
        break;

      case GesturesEventType.Zoom:
        await this.handlePinchZoom(event);
        break;

      case GesturesEventType.ZoomEnd:
        this.handlePinchZoomEnd(event);
        break;

      case GesturesEventType.ZoomRelease:
        this.handlePinchZoomRelease(event);
        break;
    }
  }

  // eslint-disable-next-line no-empty-function
  private handlePinchZoomPress(_event: ZoomGesturesEvent) {}

  private handlePinchZoomStart(_event: ZoomGesturesEvent) {
    this.isZooming = true;
    this.translateOnStart = { ...this.animation.value.transform };
  }

  private async handlePinchZoom(event: ZoomGesturesEvent) {
    if (!this.translateOnStart) {
      return;
    }

    const adjusterConfig: ZoomAdjusterConfig = {
      translateOnStart: this.translateOnStart,
      event,
      option: this.options,
    };

    const values = {
      x: this.animation.value.transform.x,
      y: this.animation.value.transform.y,
      scale: this.animation.value.transform.scale,
    };

    const next = this.zoomAdjuster.reduce(
      (zoomAdjuster, positionAdjuster) =>
        typeof positionAdjuster === 'function'
          ? positionAdjuster(zoomAdjuster, adjusterConfig)
          : positionAdjuster.adjuster(zoomAdjuster, adjusterConfig),
      values
    );

    await this.animation.setScale(next.scale).setTranslate(next).apply();
  }

  private handlePinchZoomEnd(_event: ZoomGesturesEvent) {
    this.isZooming = false;
  }

  // eslint-disable-next-line no-empty-function
  private handlePinchZoomRelease(_event: ZoomGesturesEvent) {}

  private isPinchZoomGesture(event: GesturesEvent): event is ZoomGesturesEvent {
    return PINCH_ZOOM_GESTURES_TYPE.includes(event.type);
  }
}
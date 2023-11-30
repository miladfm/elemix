import {
  Animation,
  Axis,
  Dom,
  DomSelector,
  DragGesturesEvent,
  Gestures,
  GesturesEvent,
  GesturesEventType,
  TransformProperty,
} from '@elemix/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BoundaryInteraction, DragBoundaryType, DragOptions } from './drag.model';

const DEFAULT_OPTIONS: DragOptions = {
  lockAxis: false,
  movementDirection: Axis.Both,
  boundaryType: DragBoundaryType.None,
  boundaryElem: null,
  boundaryInteraction: BoundaryInteraction.Stop,
};

const DRAG_GESTURES_TYPE = [
  GesturesEventType.DragPress,
  GesturesEventType.DragStart,
  GesturesEventType.Drag,
  GesturesEventType.DragEnd,
  GesturesEventType.DragRelease,
];

export class Drag {
  private eventsSubject$ = new Subject<DragGesturesEvent>();
  public events$: Observable<DragGesturesEvent> = this.eventsSubject$.asObservable();

  private _isEnable = false;
  public get isEnable() {
    return this._isEnable;
  }

  private set isEnable(isEnable: boolean) {
    this._isEnable = isEnable;
  }

  private _isDragging = false;
  public get isDragging() {
    return this._isDragging;
  }

  private set isDragging(isDragging: boolean) {
    this._isDragging = isDragging;
  }

  private readonly options: DragOptions;
  private readonly element: Dom;
  private gesture: Gestures;
  private animation: Animation;
  private gestureChangesSub: Subscription | null = null;

  private translateOnStart: TransformProperty | null;

  constructor(selector: DomSelector, options: Partial<DragOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.element = new Dom(selector);
    this.gesture = new Gestures(this.element);
    this.animation = new Animation(this.element);
    this.enable();
  }

  private async onDetectGesture(event: GesturesEvent) {
    switch (event.type) {
      case GesturesEventType.DragPress:
        this.handleDragPress(event);
        break;

      case GesturesEventType.DragStart:
        this.handleDragStart(event);
        break;

      case GesturesEventType.Drag:
        await this.handleDrag(event);
        break;

      case GesturesEventType.DragEnd:
        this.handleDragEndPress(event);
        break;
    }
  }

  private handleDragPress(event: DragGesturesEvent) {
    this.animation.syncValue();
    this.translateOnStart = { ...this.animation.value.transform };
  }

  private handleDragStart(event: DragGesturesEvent) {
    this.isDragging = true;
  }

  private async handleDrag(event: DragGesturesEvent) {
    if (!event.movementXFromStart || !event.movementYFromStart || !this.translateOnStart) {
      return;
    }

    this.animation.setTranslate({
      x: this.translateOnStart.x + event.movementXFromStart,
      y: this.translateOnStart.y + event.movementYFromStart,
    });

    await this.animation.apply();
  }

  private handleDragEndPress(event: DragGesturesEvent) {
    this.isDragging = false;
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.gestureChangesSub = this.gesture.changes$.subscribe(async (event) => {
      if (!this.isDragGesture(event)) {
        return;
      }

      this.onDetectGesture(event);
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

  private isDragGesture(event: GesturesEvent): event is DragGesturesEvent {
    return DRAG_GESTURES_TYPE.includes(event.type);
  }
}

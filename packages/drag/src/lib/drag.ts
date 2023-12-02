import {
  Animation,
  Dom,
  DomSelector,
  DragGesturesEvent,
  Gestures,
  GesturesEvent,
  GesturesEventType,
  TransformProperty,
} from '@elemix/core';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  BoundaryInteraction,
  DragBoundaryType,
  DragOptions,
  DragPositionAdjuster,
  DragPositionAdjusterConfig,
  MovementDirection,
} from './drag.model';
import { movementDirectionPositionAdjuster } from './drag-movement-direction-position-adjusters';
import { basicPositionAdjuster } from './drag-basic-position-adjusters';

const DEFAULT_OPTIONS: DragOptions = {
  movementDirection: MovementDirection.Both,
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
  private pressEvent: DragGesturesEvent | null;
  private startEvent: DragGesturesEvent | null;
  private positionAdjuster: DragPositionAdjuster[];

  constructor(selector: DomSelector, options: Partial<DragOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.element = new Dom(selector);
    this.gesture = new Gestures(this.element);
    this.animation = new Animation(this.element);

    this.positionAdjuster = [
      basicPositionAdjuster,
      movementDirectionPositionAdjuster,
      // isClass or function
    ];

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
        this.handleDragEnd(event);
        break;

      case GesturesEventType.DragRelease:
        this.handleDragRelease(event);
        break;
    }
  }

  private handleDragPress(event: DragGesturesEvent) {
    this.animation.syncValue();
    this.pressEvent = event;
  }

  private handleDragStart(event: DragGesturesEvent) {
    this.isDragging = true;
    this.translateOnStart = { ...this.animation.value.transform };
    this.startEvent = event;
  }

  private async handleDrag(event: DragGesturesEvent) {
    if (!this.translateOnStart || !this.startEvent || !this.pressEvent) {
      return;
    }

    const positionAdjusterConfig: DragPositionAdjusterConfig = {
      translateOnStart: this.translateOnStart,
      pressEvent: this.pressEvent,
      startEvent: this.startEvent,
      event,
      option: this.options,
    };

    const nextTranslate = this.positionAdjuster.reduce(
      (translate, positionAdjusterFn) => positionAdjusterFn(translate, positionAdjusterConfig),
      { x: 0, y: 0 }
    );

    this.animation.setTranslate(nextTranslate);
    await this.animation.apply();
  }

  private handleDragEnd(_event: DragGesturesEvent) {
    this.isDragging = false;
    this.translateOnStart = null;
    this.startEvent = null;
  }

  private handleDragRelease(_event: DragGesturesEvent) {
    this.pressEvent = null;
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.gestureChangesSub = this.gesture.changes$.subscribe(async (event: GesturesEvent) => {
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

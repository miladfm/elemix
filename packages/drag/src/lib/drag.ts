import {
  Animation,
  Coordinate,
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
  DragEvent,
  DragOptions,
  DragPositionAdjuster,
  DragPositionAdjusterConfig,
  DragPositionAdjusterHooks,
  MovementDirection,
} from './drag.model';
import { movementDirectionPositionAdjuster } from './drag-movement-direction-position-adjusters';
import { basicPositionAdjuster } from './drag-basic-position-adjusters';
import { BoundaryPositionAdjuster } from './drag-boundary-position-adjusters';

const DEFAULT_OPTIONS: DragOptions = {
  movementDirection: MovementDirection.Both,
  minMovements: 0,
};

const DRAG_GESTURES_TYPE = [
  GesturesEventType.DragPress,
  GesturesEventType.DragStart,
  GesturesEventType.Drag,
  GesturesEventType.DragEnd,
  GesturesEventType.DragRelease,
];

export class Drag {
  private eventsSubject$ = new Subject<DragEvent>();
  public events$: Observable<DragEvent> = this.eventsSubject$.asObservable();

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
  private positionAdjuster: (DragPositionAdjuster | DragPositionAdjusterHooks)[];

  constructor(selector: DomSelector, options: Partial<DragOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.element = new Dom(selector);
    this.gesture = new Gestures(this.element, {
      minDragMovements: this.options.minMovements,
    });
    this.animation = Animation.getOrCreateInstance(this.element);

    this.setPositionAdjuster();
    this.addDraggableStyle();
    this.enable();
  }

  private setPositionAdjuster() {
    this.positionAdjuster = [basicPositionAdjuster, movementDirectionPositionAdjuster];

    if (this.options.boundary) {
      this.positionAdjuster.push(new BoundaryPositionAdjuster(this.element, this.options, this.eventsSubject$));
    }
  }

  private handleGesture(event: DragGesturesEvent): Promise<Coordinate> | Coordinate {
    switch (event.type) {
      case GesturesEventType.DragPress:
        return this.handleDragPress(event);

      case GesturesEventType.DragStart:
        return this.handleDragStart(event);

      case GesturesEventType.Drag:
        return this.handleDrag(event);

      case GesturesEventType.DragEnd:
        return this.handleDragEnd(event);

      case GesturesEventType.DragRelease:
        return this.handleDragRelease(event);
    }
  }

  private handleDragPress(event: DragGesturesEvent): Coordinate {
    this.pressEvent = event;

    this.positionAdjuster.forEach((positionAdjuster) => {
      if (typeof positionAdjuster !== 'function' && positionAdjuster.onPress) {
        positionAdjuster.onPress(event, this.options);
      }
    });

    return {
      x: this.animation.actualValue.transform.x,
      y: this.animation.actualValue.transform.y,
    };
  }

  private handleDragStart(event: DragGesturesEvent): Coordinate {
    this.isDragging = true;
    this.translateOnStart = { ...this.animation.value.transform };
    this.startEvent = event;

    this.positionAdjuster.forEach((positionAdjuster) => {
      if (typeof positionAdjuster !== 'function' && positionAdjuster.onStart) {
        positionAdjuster.onStart(event, this.options);
      }
    });

    return {
      x: this.animation.actualValue.transform.x,
      y: this.animation.actualValue.transform.y,
    };
  }

  private async handleDrag(event: DragGesturesEvent): Promise<Coordinate> {
    if (!this.translateOnStart || !this.startEvent || !this.pressEvent) {
      return {
        x: this.animation.actualValue.transform.x,
        y: this.animation.actualValue.transform.y,
      };
    }

    const positionAdjusterConfig: DragPositionAdjusterConfig = {
      translateOnStart: this.translateOnStart,
      pressEvent: this.pressEvent,
      startEvent: this.startEvent,
      event,
      option: this.options,
    };

    const nextTranslate = this.positionAdjuster.reduce(
      (translate, positionAdjuster) =>
        typeof positionAdjuster === 'function'
          ? positionAdjuster(translate, positionAdjusterConfig)
          : positionAdjuster.adjuster(translate, positionAdjusterConfig),
      { x: 0, y: 0 }
    );

    this.animation.setTranslate(nextTranslate);
    await this.animation.apply();
    return nextTranslate;
  }

  private handleDragEnd(event: DragGesturesEvent): Coordinate {
    this.isDragging = false;
    this.translateOnStart = null;
    this.startEvent = null;

    this.positionAdjuster.forEach((positionAdjuster) => {
      if (typeof positionAdjuster !== 'function' && positionAdjuster.onEnd) {
        positionAdjuster.onEnd(event, this.options);
      }
    });

    return {
      x: this.animation.actualValue.transform.x,
      y: this.animation.actualValue.transform.y,
    };
  }

  private handleDragRelease(event: DragGesturesEvent): Coordinate {
    this.pressEvent = null;

    this.positionAdjuster.forEach((positionAdjuster) => {
      if (typeof positionAdjuster !== 'function' && positionAdjuster.onRelease) {
        positionAdjuster.onRelease(event, this.options);
      }
    });

    return {
      x: this.animation.actualValue.transform.x,
      y: this.animation.actualValue.transform.y,
    };
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.gestureChangesSub = this.gesture.changes$.subscribe(async (event: GesturesEvent) => {
      if (!this.isDragGesture(event)) {
        return;
      }

      const translate = await this.handleGesture(event);
      this.eventsSubject$.next({ type: event.type, translate });
    });

    this.isEnable = true;
  }

  private addDraggableStyle() {
    this.element.setStyleImmediately('userSelect', 'none');
    this.element.setStyleImmediately('touchAction', 'none');
    this.element.setStyleImmediately('userDrag', 'none');
    this.element.setStyleImmediately('webkitUserDrag', 'none');
  }

  public disable() {
    this.gestureChangesSub?.unsubscribe();
    this.gestureChangesSub = null;
    this.isEnable = false;
  }

  public destroy() {
    this.disable();
    /**
     * In handling asynchronous pointer events, such as drag operations, where DOM updates are scheduled
     * for the next animation frame, we use setTimeout to delay eventsSubject$ completion.
     * To ensure that changes are dispatched through eventsSubject$ after these updates, we use setTimeout.
     * This technique delays the completion of eventsSubject$ until the current event handling cycle is fully resolved.
     * Without this delay, eventsSubject$ might complete before the DOM is updated, preventing the dispatch
     * of change events after asynchronous DOM updates.
     * This ensures consistency between the DOM state and events dispatched by eventsSubject$.
     */
    setTimeout((_) => {
      this.eventsSubject$.complete();
    });
    // TODO: Don't let the enable method works after destroy
  }

  private isDragGesture(event: GesturesEvent): event is DragGesturesEvent {
    return DRAG_GESTURES_TYPE.includes(event.type);
  }
}

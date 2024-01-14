import { Dom, DomSelector } from '../dom/dom';
import { filter, fromEvent, map, merge, mergeMap, Observable, share, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GesturesEvent, GesturesEventType, GesturesOptions, PointerId } from './gestures.model';
import { GestureStrategyBase } from './gesture-strategy.base';
import { PressGestureStrategy } from './gesture-strategy-press';
import { DragGestureStrategy } from './gesture-strategy-drag';
import { ZoomGestureStrategy } from './gesture-strategy-zoom';

const DEFAULT_OPTIONS: GesturesOptions = {
  minDragMovements: 3,
  minZoomEventThreshold: 3,
};

const gesturePriority: Record<GesturesEventType, number> = {
  [GesturesEventType.Press]: 1,
  [GesturesEventType.DragPress]: 2,
  [GesturesEventType.DragStart]: 3,
  [GesturesEventType.Drag]: 4,
  [GesturesEventType.DragEnd]: 5,
  [GesturesEventType.ZoomPress]: 6,
  [GesturesEventType.ZoomStart]: 7,
  [GesturesEventType.Zoom]: 8,
  [GesturesEventType.ZoomEnd]: 9,
  [GesturesEventType.ZoomRelease]: 10,
  [GesturesEventType.DragRelease]: 11,
  [GesturesEventType.PressRelease]: 12,
};

export class Gestures {
  /**
   * A subject that emits when a complete cycle of pointer events is processed, allowing for cleanup or reset operations.
   * A gesture cycle is defined as the period from the first `pointerdown` event to the last `pointerup` or `pointercancel` event,
   * after which no more active pointer events are on the screen.
   */
  private cycleComplete$ = new Subject<void>();

  /**
   * A map to track ongoing pointer events, enabling efficient
   * management and retrieval of pointer data necessary for gesture recognition and to find out the active pointer events.
   */
  private events = new Map<PointerId, PointerEvent>();

  /**
   * Holds a collection of gesture strategy instances. Each strategy represents a different type of gesture
   * recognition logic, allowing the class to handle a variety of gesture events.
   */
  private strategies: GestureStrategyBase[] = [];

  private dom: Dom;
  private options: GesturesOptions;
  private destroy$ = new Subject<void>();
  public changes$: Observable<GesturesEvent>;

  constructor(selector: DomSelector, options: Partial<GesturesOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.dom = new Dom(selector);

    const down$ = fromEvent<PointerEvent>(this.dom.nativeElement, 'pointerdown').pipe(share());
    const start$ = down$.pipe(filter((_) => this.events.size === 0));
    const move$ = fromEvent<PointerEvent>(document, 'pointermove').pipe(share());
    const up$ = fromEvent<PointerEvent>(document, 'pointerup').pipe(share());
    const cancel$ = fromEvent<PointerEvent>(this.dom.nativeElement, 'pointercancel').pipe(share());
    const moveUpCancel$ = merge(move$, up$, cancel$).pipe(filter((e) => this.events.has(e.pointerId)));

    this.changes$ = start$.pipe(
      tap((e) => this.initProcess(e)),
      switchMap((pointerdownEvent) => merge(down$, moveUpCancel$).pipe(startWith(pointerdownEvent), takeUntil(this.cycleComplete$))),
      tap((e) => this.updateEvents(e)),
      map((e) => this.detectGesture(e)),
      mergeMap((e) => e), // Flatten the list of gestures into multiple events
      takeUntil(this.destroy$),
      share()
    );
  }

  private updateEvents(event: PointerEvent) {
    // Add or Remove event based on its type to keep the events map updated
    if (event.type === 'pointerup' || event.type === 'pointercancel') {
      this.events.delete(event.pointerId);
    } else {
      this.events.set(event.pointerId, event);
    }

    // Dispatch complete event when no more events are being tracked
    if (this.events.size === 0) {
      this.cycleComplete$.next();
    }
  }

  private initProcess(_e: PointerEvent) {
    this.strategies = [
      new PressGestureStrategy(),
      new DragGestureStrategy({ minMovement: this.options.minDragMovements }),
      new ZoomGestureStrategy({ minEventThreshold: this.options.minZoomEventThreshold }),
    ];
  }

  private detectGesture(event: PointerEvent): GesturesEvent[] {
    // console.log('event', {
    //   ponterId: event.pointerId,
    //   type: event.type,
    //   pageX: event.pageX,
    //   pageY: event.pageY,
    //   clientX: event.clientX,
    //   clientY: event.clientY,
    //   offsetX: event.offsetX,
    //   offsetY: event.offsetY,
    //   movementX: event.movementX,
    //   movementY: event.movementY,
    // });
    return this.strategies
      .flatMap((strategy) => strategy.detectGesture(this.events, event) || [])
      .sort((a, b) => gesturePriority[a.type] - gesturePriority[b.type]);
  }

  public destroy() {
    this.events.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

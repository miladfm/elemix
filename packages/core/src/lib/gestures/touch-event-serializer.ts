import { Dom, DomType } from '../dom/dom';
import { InteractionEvent, InteractionEventSerializer } from './gestures.model';
import { fromEvent, map, Observable, share, Subject, takeUntil, tap } from 'rxjs';

export class TouchEventSerializer implements InteractionEventSerializer {
  private dom: Dom;

  public down$: Observable<InteractionEvent[]>;
  public move$: Observable<InteractionEvent[]>;
  public end$: Observable<InteractionEvent[]>;
  public cancel$: Observable<InteractionEvent[]>;

  private destroy$ = new Subject<void>();
  private lastInteractionEvent: InteractionEvent[] | null;

  constructor(selector: DomType) {
    this.dom = new Dom(selector);

    this.down$ = fromEvent<TouchEvent>(this.dom.nativeElement, 'touchstart').pipe(
      map((e) => this.serializer(e)),
      tap((interactionEvent) => (this.lastInteractionEvent = interactionEvent)),
      takeUntil(this.destroy$),
      share()
    );

    this.move$ = fromEvent<TouchEvent>(document, 'touchmove').pipe(
      map((e) => this.serializer(e, this.lastInteractionEvent)),
      tap((interactionEvent) => (this.lastInteractionEvent = interactionEvent)),
      takeUntil(this.destroy$),
      share()
    );

    this.end$ = fromEvent<TouchEvent>(document, 'touchend').pipe(
      map((e) => this.serializer(e, this.lastInteractionEvent)),
      tap((_) => (this.lastInteractionEvent = null)),
      takeUntil(this.destroy$),
      share()
    );

    this.cancel$ = fromEvent<TouchEvent>(this.dom.nativeElement, 'touchcancel').pipe(
      map((e) => this.serializer(e, this.lastInteractionEvent)),
      tap((_) => (this.lastInteractionEvent = null)),
      takeUntil(this.destroy$),
      share()
    );
  }

  private serializer(event: TouchEvent, lastValue?: InteractionEvent[] | null) {
    return Array.from(event.touches).map((touch) => {
      const lastTouch = lastValue?.find((value) => value.id === touch.identifier);
      const page = { x: touch.pageX, y: touch.pageY };
      const client = { x: touch.clientX, y: touch.clientY };
      const movement = lastTouch ? { x: touch.pageX - lastTouch.page.x, y: touch.pageY - lastTouch.page.y } : { x: 0, y: 0 };

      return {
        id: touch.identifier,
        page,
        client,
        movement,
        originalEvent: event,
      };
    });
  }

  public destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

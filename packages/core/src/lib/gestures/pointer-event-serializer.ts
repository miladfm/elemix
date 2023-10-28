import { InteractionEvent, InteractionEventSerializer } from './gestures.model';
import { fromEvent, map, Observable, share, Subject, takeUntil } from 'rxjs';
import { Dom, DomType } from '../dom/dom';

export class PointerEventSerializer implements InteractionEventSerializer {
  private dom: Dom;

  public down$: Observable<InteractionEvent[]>;
  public move$: Observable<InteractionEvent[]>;
  public end$: Observable<InteractionEvent[]>;
  public cancel$: Observable<InteractionEvent[]>;

  private destroy$ = new Subject<void>();

  constructor(selector: DomType) {
    this.dom = new Dom(selector);

    this.down$ = fromEvent<PointerEvent>(this.dom.nativeElement, 'pointerdown').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );

    this.move$ = fromEvent<PointerEvent>(document, 'pointermove').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );

    this.end$ = fromEvent<PointerEvent>(document, 'pointerup').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );

    this.cancel$ = fromEvent<PointerEvent>(this.dom.nativeElement, 'pointercancel').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );
  }

  private serializer(event: PointerEvent) {
    return [
      {
        id: event.pointerId,
        page: { x: event.pageX, y: event.pageY },
        client: { x: event.clientX, y: event.clientY },
        movement: { x: event.movementX, y: event.movementY },
        originalEvent: event,
      },
    ];
  }

  public destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

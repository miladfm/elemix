import { InteractionEvent, InteractionEventSerializer } from './gestures.model';
import { fromEvent, map, Observable, share, Subject, takeUntil } from 'rxjs';
import { Dom, DomType } from '../dom/dom';

export class MouseEventSerializer implements InteractionEventSerializer {
  private dom: Dom;

  public down$: Observable<InteractionEvent[]>;
  public move$: Observable<InteractionEvent[]>;
  public end$: Observable<InteractionEvent[]>;
  public cancel$: Observable<InteractionEvent[]>;

  private destroy$ = new Subject<void>();

  constructor(selector: DomType) {
    this.dom = new Dom(selector);

    this.down$ = fromEvent<MouseEvent>(this.dom.nativeElement, 'mousedown').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );

    this.move$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );

    this.end$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(
      map((e) => this.serializer(e)),
      takeUntil(this.destroy$),
      share()
    );

    this.cancel$ = new Subject<InteractionEvent[]>().pipe(takeUntil(this.destroy$));
  }

  private serializer(event: MouseEvent) {
    return [
      {
        id: -1,
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

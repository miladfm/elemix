import { Observable } from 'rxjs';
import { Coordinate } from '../common/common.model';

export type InteractionOriginalEvent = PointerEvent | MouseEvent | TouchEvent;

export interface InteractionEvent {
  id: number;
  page: Coordinate;
  client: Coordinate;
  movement: Coordinate;
  originalEvent: InteractionOriginalEvent;
}

export interface InteractionEventSerializer {
  down$: Observable<InteractionEvent[]>;
  move$: Observable<InteractionEvent[]>;
  end$: Observable<InteractionEvent[]>;
  cancel$: Observable<InteractionEvent[]>;
}

import { AnimateState, Animation, clamp, Coordinate, Dom, DragGesturesEvent, getBounceEffectValue } from '@elemix/core';
import {
  DragBoundary,
  DragBoundaryRange,
  DragBoundaryType,
  DragOptions,
  DragPositionAdjusterConfig,
  DragPositionAdjusterHooks,
  DragEvent,
} from './drag.model';
import { getBoundaryRange } from './drag-boundary-position-adjusters.utils';
import { Subject } from 'rxjs';

export class BoundaryPositionAdjuster implements DragPositionAdjusterHooks {
  private enabled = false;
  private draggableElement: Dom;
  private boundaryElement: Dom;
  private boundaryType: DragBoundaryType;
  private boundaryRange: DragBoundaryRange | null;
  private bounceFactor: number;

  constructor(element: Dom, private option: DragOptions, private eventsSubject$: Subject<DragEvent>) {
    if (!this.option.boundary) {
      return;
    }

    this.initialize(element, this.option.boundary);
  }

  private initialize(element: Dom, boundaryConfig: DragBoundary) {
    this.enabled = true;
    this.boundaryElement = new Dom(boundaryConfig.elem);
    this.draggableElement = element;
    this.boundaryType = boundaryConfig.type ?? DragBoundaryType.Auto;

    this.bounceFactor = boundaryConfig.bounceFactor ?? 1;
    this.bounceFactor = Math.max(0, Math.min(this.bounceFactor, 1));
  }

  onPress(_event: DragGesturesEvent, _option: DragOptions): void {
    if (!this.enabled) {
      return;
    }

    this.boundaryRange = getBoundaryRange(this.draggableElement, this.boundaryElement, this.boundaryType);
  }

  adjuster(nextPosition: Coordinate, _config: DragPositionAdjusterConfig): Coordinate {
    if (!this.enabled || !this.boundaryRange) {
      return nextPosition;
    }

    return {
      x: getBounceEffectValue(nextPosition.x, this.boundaryRange.minX, this.boundaryRange.maxX, this.bounceFactor),
      y: getBounceEffectValue(nextPosition.y, this.boundaryRange.minX, this.boundaryRange.maxY, this.bounceFactor),
    };
  }

  onEnd(_event: DragGesturesEvent, _option: DragOptions): void {
    if (!this.enabled || !this.boundaryRange) {
      return;
    }

    const animation = Animation.getOrCreateInstance(this.draggableElement);

    const position = {
      x: clamp(animation.value.transform.x, [this.boundaryRange.minX, this.boundaryRange.maxX]),
      y: clamp(animation.value.transform.y, [this.boundaryRange.minX, this.boundaryRange.maxY]),
    };

    const hasPositionChanged = position.x !== animation.value.transform.x || position.y !== animation.value.transform.y;

    if (hasPositionChanged) {
      animation
        .setTranslate(position)
        .animate$()
        .subscribe((e) => {
          if (e.state === AnimateState.Animating) {
            const x = e.changes?.transform?.x ?? animation.value.transform.x;
            const y = e.changes?.transform?.y ?? animation.value.transform.y;
            this.eventsSubject$.next({ type: 'bounce', translate: { x, y } });
          }
        });
    }
  }
}

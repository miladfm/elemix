import { Animation, clamp, Coordinate, Dom, DomSelector, DragGesturesEvent } from '@elemix/core';
import {
  DragBoundaryRange,
  DragBoundary,
  DragBoundaryType,
  DragOptions,
  DragPositionAdjusterConfig,
  DragPositionAdjusterHooks,
} from './drag.model';
import { getBoundaryRange, getPositionWithBounceEffect } from './drag-boundary-position-adjusters.utils';

export class BoundaryPositionAdjuster implements DragPositionAdjusterHooks {
  private enabled = false;
  private draggableElement: Dom;
  private boundaryElement: Dom;
  private boundaryType: DragBoundaryType;
  private boundaryRange: DragBoundaryRange | null;
  private bounceFactor: number;

  constructor(element: DomSelector, private option: DragOptions) {
    if (!this.option.boundary) {
      return;
    }

    this.initialize(element, this.option.boundary);
  }

  private initialize(element: DomSelector, boundaryConfig: DragBoundary) {
    this.enabled = true;
    this.boundaryElement = new Dom(boundaryConfig.elem);
    this.draggableElement = new Dom(element);
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
      x: getPositionWithBounceEffect(nextPosition.x, this.boundaryRange.left, this.boundaryRange.right, this.bounceFactor),
      y: getPositionWithBounceEffect(nextPosition.y, this.boundaryRange.top, this.boundaryRange.bottom, this.bounceFactor),
    };
  }

  onEnd(_event: DragGesturesEvent, _option: DragOptions): void {
    if (!this.enabled || !this.boundaryRange) {
      return;
    }

    const animation = Animation.getOrCreateInstance(this.draggableElement);

    const position = {
      x: clamp(animation.value.transform.x, [this.boundaryRange.left, this.boundaryRange.right]),
      y: clamp(animation.value.transform.y, [this.boundaryRange.top, this.boundaryRange.bottom]),
    };

    const hasPositionChanged = position.x !== animation.value.transform.x || position.y !== animation.value.transform.y;

    if (hasPositionChanged) {
      animation.setTranslate(position).animate();
    }
  }
}

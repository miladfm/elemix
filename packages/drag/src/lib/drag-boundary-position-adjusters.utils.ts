import { Animation, AnimationProperties, Dom } from '@elemix/core';
import { DragBoundaryRange, DragBoundaryType } from './drag.model';

// region BoundaryRange
export function getBoundaryRange(draggableElement: Dom, boundaryElement: Dom, boundaryType: DragBoundaryType): DragBoundaryRange | null {
  const animationProperties = Animation.getOrCreateInstance(draggableElement).value;
  const boundaryRect = boundaryElement.nativeElement.getBoundingClientRect();
  const elementRect = draggableElement.nativeElement.getBoundingClientRect();

  if (boundaryRect.width === 0 || boundaryRect.height === 0) {
    return null;
  }

  switch (boundaryType) {
    case DragBoundaryType.Inner:
      return getInnerBoundaryRange(animationProperties, boundaryRect, elementRect);

    case DragBoundaryType.Outer:
      return getOuterBoundaryRange(animationProperties, boundaryRect, elementRect);

    case DragBoundaryType.Auto:
      return getAutoBoundaryRange(animationProperties, boundaryRect, elementRect);
  }
}

function getInnerBoundaryRange(animationProperties: AnimationProperties, boundaryRect: DOMRect, draggableRect: DOMRect): DragBoundaryRange {
  return {
    left: boundaryRect.left - draggableRect.left + animationProperties.transform.x,
    top: boundaryRect.top - draggableRect.top + animationProperties.transform.y,
    right: boundaryRect.right - draggableRect.right + animationProperties.transform.x,
    bottom: boundaryRect.bottom - draggableRect.bottom + animationProperties.transform.y,
  };
}

function getOuterBoundaryRange(animationProperties: AnimationProperties, boundaryRect: DOMRect, draggableRect: DOMRect): DragBoundaryRange {
  return {
    left: draggableRect.left - boundaryRect.left - animationProperties.transform.x,
    top: draggableRect.top - boundaryRect.top - animationProperties.transform.y,
    right: draggableRect.right - boundaryRect.right - animationProperties.transform.x,
    bottom: draggableRect.bottom - boundaryRect.bottom - animationProperties.transform.y,
  };
}

function getAutoBoundaryRange(animationProperties: AnimationProperties, boundaryRect: DOMRect, draggableRect: DOMRect): DragBoundaryRange {
  return {
    left: calculateAxisBoundary('left', boundaryRect, draggableRect, animationProperties.transform),
    top: calculateAxisBoundary('top', boundaryRect, draggableRect, animationProperties.transform),
    right: calculateAxisBoundary('right', boundaryRect, draggableRect, animationProperties.transform),
    bottom: calculateAxisBoundary('bottom', boundaryRect, draggableRect, animationProperties.transform),
  };
}

function calculateAxisBoundary(
  axis: 'left' | 'top' | 'right' | 'bottom',
  boundaryRect: DOMRect,
  draggableRect: DOMRect,
  transform: { x: number; y: number }
): number {
  const boundaryDimension = axis === 'left' || axis === 'right' ? boundaryRect.width : boundaryRect.height;
  const elementDimension = axis === 'left' || axis === 'right' ? draggableRect.width : draggableRect.height;
  const transformOffset = axis === 'left' || axis === 'right' ? transform.x : transform.y;

  const elementPosition = draggableRect[axis];
  const boundaryPosition = boundaryRect[axis];

  return elementDimension > boundaryDimension
    ? elementPosition - boundaryPosition - transformOffset
    : boundaryPosition - elementPosition + transformOffset;
}

// endregion

// region BounceEffect
export function getPositionWithBounceEffect(
  currentPosition: number,
  minBoundaryRange: number,
  maxBoundaryRange: number,
  bounceFactor: number
): number {
  /**
   * 'bounceIntensity' determines how strong the bounce effect is.
   * It's a multiplier for the distance the element has moved beyond the boundary,
   * dictating how far back it will "bounce".
   *
   * Value Close to 1: Results in a stronger bounce,
   *    making the element move further away from the boundary after hitting it.
   * Value Close to 0: Leads to a weaker bounce,
   *    causing the element to move only slightly away from the boundary.
   *
   * Example:
   * - If the bounceIntensity is set to 1, and the element goes 10 pixels beyond the boundary,
   *   it will bounce back 10 pixels.
   * - If the bounceIntensity is 0.5, for the same 10 pixels beyond the boundary,
   *   the bounce back will be 5 pixels (50% of the overshoot).
   */
  const bounceIntensity = bounceFactor; // Adjust this for stronger/weaker bounce

  /**
   * 'dampeningFactor' controls how quickly the bouncing motion decreases over time.
   * It's applied to the bounce effect in each iteration to gradually reduce
   * the distance the element bounces back.
   *
   * Value Close to 1: The bouncing effect diminishes slowly.
   *    The element continues to bounce back and forth for a longer period.
   * Value Close to 0: The bouncing effect diminishes quickly.
   *    The element quickly settles and stops bouncing.
   *
   * Example:
   * - Suppose the dampeningFactor is 0.9, and the initial bounce is 10 pixels.
   *   In the next iteration, the bounce would be 0.9 * 10 = 9 pixels, then 0.9 * 9 = 8.1 pixels, and so on.
   * - If the dampeningFactor is 0.5, starting with a 10-pixel bounce,
   *   the next bounce would be only 0.5 * 10 = 5 pixels, then 0.5 * 5 = 2.5 pixels,
   *   reducing the bounce much more rapidly.
   */
  const dampeningFactor = bounceFactor; // Adjust this for quicker/slower dampening

  const isBeyondMinBoundary = currentPosition < minBoundaryRange;
  const isBeyondMaxBoundary = currentPosition > maxBoundaryRange;

  if (!isBeyondMaxBoundary && !isBeyondMinBoundary) {
    return currentPosition;
  }

  const boundaryDelta = isBeyondMaxBoundary ? currentPosition - maxBoundaryRange : minBoundaryRange - currentPosition;
  const adjustedBounce = dampeningFactor * boundaryDelta * bounceIntensity;
  return isBeyondMaxBoundary ? currentPosition - adjustedBounce : currentPosition + adjustedBounce;
}

// endregion

import { Animation, AnimationProperties, Dom } from '@elemix/core';
import { DragBoundaryRange, DragBoundaryType } from './drag.model';

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

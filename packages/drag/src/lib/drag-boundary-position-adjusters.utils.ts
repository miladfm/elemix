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
  const left = boundaryRect.left - draggableRect.left + animationProperties.transform.x;
  const top = boundaryRect.top - draggableRect.top + animationProperties.transform.y;
  const right = boundaryRect.right - draggableRect.right + animationProperties.transform.x;
  const bottom = boundaryRect.bottom - draggableRect.bottom + animationProperties.transform.y;

  return {
    minX: Math.min(left, right),
    maxX: Math.max(left, right),
    minY: Math.min(top, bottom),
    maxY: Math.max(top, bottom),
  };
}

function getOuterBoundaryRange(animationProperties: AnimationProperties, boundaryRect: DOMRect, draggableRect: DOMRect): DragBoundaryRange {
  const left =
    (draggableRect.left - boundaryRect.left - animationProperties.transform.x) * (draggableRect.left <= boundaryRect.left ? -1 : 1);
  const top = (draggableRect.top - boundaryRect.top - animationProperties.transform.y) * (draggableRect.top <= boundaryRect.top ? -1 : 1);
  const right =
    (draggableRect.right - boundaryRect.right - animationProperties.transform.x) * (draggableRect.right >= boundaryRect.right ? -1 : 1);
  const bottom =
    (draggableRect.bottom - boundaryRect.bottom - animationProperties.transform.y) * (draggableRect.bottom >= boundaryRect.bottom ? -1 : 1);

  return {
    minX: Math.min(left, right),
    maxX: Math.max(left, right),
    minY: Math.min(top, bottom),
    maxY: Math.max(top, bottom),
  };
}

function getAutoBoundaryRange(animationProperties: AnimationProperties, boundaryRect: DOMRect, draggableRect: DOMRect): DragBoundaryRange {
  const left = calculateAxisBoundary('left', boundaryRect, draggableRect, animationProperties.transform);
  const top = calculateAxisBoundary('top', boundaryRect, draggableRect, animationProperties.transform);
  const right = calculateAxisBoundary('right', boundaryRect, draggableRect, animationProperties.transform);
  const bottom = calculateAxisBoundary('bottom', boundaryRect, draggableRect, animationProperties.transform);

  return {
    minX: Math.min(left, right),
    maxX: Math.max(left, right),
    minY: Math.min(top, bottom),
    maxY: Math.max(top, bottom),
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

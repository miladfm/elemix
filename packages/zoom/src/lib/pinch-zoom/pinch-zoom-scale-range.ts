import { PinchZoomBoundary, PinchZoomBoundaryType, PinchZoomOptions } from './pinch-zoom.model';
import { Dom, DomSelector } from '@elemix/core';

export function getPinchZoomScaleRange(element: Dom, options: PinchZoomOptions): { min: number; max: number } {
  return {
    min: calculateScale(element, options.minScale, true),
    max: calculateScale(element, options.maxScale, false),
  };
}

function calculateScale(element: Dom, scaleOrBoundary: number | PinchZoomBoundary, isMinScale: boolean): number {
  if (typeof scaleOrBoundary === 'number') {
    return scaleOrBoundary;
  }

  const boundary = scaleOrBoundary;
  const { widthRatio, heightRatio } = getScaleRatios(element, boundary.element);

  return getScaleByBoundaryType(boundary.boundaryType, widthRatio, heightRatio, isMinScale);
}

function getScaleByBoundaryType(boundaryType: PinchZoomBoundaryType, widthRatio: number, heightRatio: number, isMinScale: boolean) {
  switch (boundaryType) {
    case PinchZoomBoundaryType.Inner:
      return Math.min(widthRatio, heightRatio);

    case PinchZoomBoundaryType.Outer:
      return Math.max(widthRatio, heightRatio);

    case PinchZoomBoundaryType.Auto:
      // prettier-ignore
      return isMinScale
        ? (widthRatio > 1 ? Math.min(widthRatio, heightRatio) : Math.max(widthRatio, heightRatio))
        : (widthRatio > 1 ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio));
  }
}

function getScaleRatios(element: Dom, boundaryElement: DomSelector) {
  const boundRect = new Dom(boundaryElement).getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();

  const widthRatio = boundRect.width / elemRect.width;
  const heightRatio = boundRect.height / elemRect.height;

  return { widthRatio, heightRatio };
}

import { ZoomAdjusterConfig, ZoomAdjusterHooks, ZoomAdjusterResult } from '../zoom.model';
import { Animation, clamp, Coordinate, Dom, DomSelector, getBounceEffectValue, TransformProperty, ZoomGesturesEvent } from '@elemix/core';
import { PinchZoomBoundary, PinchZoomBoundaryType, PinchZoomOptions } from './pinch-zoom.model';

export class PinchZoomCoreAdjuster implements ZoomAdjusterHooks {
  private animation: Animation;
  private startCenterOffset: Coordinate | null;
  private translateOnStart: TransformProperty | null;

  private element: Dom;
  private minScale: number;
  private maxScale: number;
  private minScaleBoundRect: DOMRect;
  private maxScaleBoundRect: DOMRect;
  private elemRect: DOMRect;

  constructor(element: DomSelector, options: PinchZoomOptions) {
    this.animation = Animation.getOrCreateInstance(element);
    this.element = new Dom(element);

    if (typeof options.minScale === 'number') {
      this.minScale = options.minScale;
    } else {
      this.minScaleBoundRect = new Dom(options.minScale.element).getBoundingClientRect();
      this.elemRect = this.element.getBoundingClientRect();

      const widthRatio = this.minScaleBoundRect.width / this.elemRect.width;
      const heightRatio = this.minScaleBoundRect.height / this.elemRect.height;

      switch (options.minScale.boundaryType) {
        case PinchZoomBoundaryType.Inner:
          this.minScale = Math.min(widthRatio, heightRatio);
          break;

        case PinchZoomBoundaryType.Outer:
          this.minScale = Math.max(widthRatio, heightRatio);
          break;

        case PinchZoomBoundaryType.Auto:
          this.minScale =
            this.minScaleBoundRect.width > this.elemRect.width ? Math.min(widthRatio, heightRatio) : Math.max(widthRatio, heightRatio);
          break;
      }
    }

    if (typeof options.maxScale === 'number') {
      this.maxScale = options.maxScale;
    } else {
      this.maxScaleBoundRect = new Dom(options.maxScale.element).getBoundingClientRect();
      this.elemRect = this.element.getBoundingClientRect();

      const widthRatio = this.maxScaleBoundRect.width / this.elemRect.width;
      const heightRatio = this.maxScaleBoundRect.height / this.elemRect.height;

      switch (options.maxScale.boundaryType) {
        case PinchZoomBoundaryType.Inner:
          this.maxScale = Math.min(widthRatio, heightRatio);
          break;

        case PinchZoomBoundaryType.Outer:
          this.maxScale = Math.max(widthRatio, heightRatio);
          break;

        case PinchZoomBoundaryType.Auto:
          this.maxScale =
            this.maxScaleBoundRect.width > this.elemRect.width ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);
          break;
      }
    }
  }

  onPress(event: ZoomGesturesEvent, option: PinchZoomOptions) {
    if (typeof option.minScale !== 'number') {
      this.minScaleBoundRect = new Dom(option.minScale.element).getBoundingClientRect();
    }
    if (typeof option.maxScale !== 'number') {
      this.maxScaleBoundRect = new Dom(option.maxScale.element).getBoundingClientRect();
    }
    const elemRect = this.element.getBoundingClientRect();
    const newWidth = elemRect.width / this.animation.value.transform.scale;
    const newHeight = elemRect.height / this.animation.value.transform.scale;
    this.elemRect = {
      ...elemRect,
      width: newWidth,
      height: newHeight,
      x: elemRect.x - this.animation.value.transform.x,
      y: elemRect.y - this.animation.value.transform.y,
      left: elemRect.left - this.animation.value.transform.x,
      top: elemRect.top - this.animation.value.transform.y,
      right: newWidth + elemRect.x - this.animation.value.transform.x,
      bottom: newHeight + elemRect.y - this.animation.value.transform.y,
    };
  }

  onStart(event: ZoomGesturesEvent) {
    this.startCenterOffset = {
      x: event.centerOffsetX,
      y: event.centerOffsetY,
    };
    this.translateOnStart = this.animation.value.transform;
  }

  adjuster(next: ZoomAdjusterResult, config: ZoomAdjusterConfig): ZoomAdjusterResult {
    if (!config.event.scaleFactorFromStart) {
      return next;
    }

    const pinchScale = config.translateOnStart.scale * config.event.scaleFactorFromStart;
    const scale = getBounceEffectValue(pinchScale, this.minScale, this.maxScale, config.option.bounceFactor);
    const { x, y } = this.getTranslate(scale, config.event) ?? {};

    return {
      scale,
      x: x ?? next.x,
      y: y ?? next.y,
    };
  }

  onEnd(event: ZoomGesturesEvent, option: PinchZoomOptions): void {
    const scale = this.animation.value.transform.scale;
    const clampScale = clamp(scale, [this.minScale, this.maxScale]);
    const { x, y } = this.getTranslateOnZoomEnd(this.animation.value.transform, option, clampScale);

    this.animation.setScale(clampScale).setTranslate({ x, y }).animate();

    this.startCenterOffset = null;
    this.translateOnStart = null;
  }

  private getTranslateOnZoomEnd({ x, y }: { x: number; y: number }, option: PinchZoomOptions, scale: number) {
    const getBoundaryElement = (minScale: PinchZoomBoundary | number, maxScale: PinchZoomBoundary | number): DomSelector | null => {
      if (typeof maxScale !== 'number') {
        return maxScale.element;
      }

      if (typeof minScale !== 'number') {
        return minScale.element;
      }

      return null;
    };

    const boundaryElement = getBoundaryElement(option.minScale, option.maxScale);

    if (!boundaryElement) {
      return { x: undefined, y: undefined };
    }

    const boundaryRect = new Dom(boundaryElement).getBoundingClientRect();

    const elemWidthWithScale = this.elemRect.width * scale;
    const elemHeightWithScale = this.elemRect.height * scale;

    const elemWidthDiff = elemWidthWithScale - this.elemRect.width;
    const elemHeightDiff = elemHeightWithScale - this.elemRect.height;

    const boundaryLeft = boundaryRect.left - this.elemRect.left;
    const boundaryTop = boundaryRect.top - this.elemRect.top;
    const boundaryRight = boundaryRect.right - this.elemRect.right;
    const boundaryBottom = boundaryRect.bottom - this.elemRect.bottom;

    const newX =
      elemWidthWithScale > boundaryRect.width
        ? clamp(x, [boundaryRight - elemWidthDiff, boundaryLeft])
        : clamp(x, [boundaryLeft, boundaryRight - elemWidthDiff]);

    const newY =
      elemHeightWithScale > boundaryRect.height
        ? clamp(y, [boundaryBottom - elemHeightDiff, boundaryTop])
        : clamp(y, [boundaryTop, boundaryBottom - elemHeightDiff]);

    return { x: newX, y: newY };
  }

  private getTranslate(scale: number, event: ZoomGesturesEvent): Coordinate | null {
    if (!this.translateOnStart || !this.startCenterOffset) {
      return null;
    }

    const translationDelta = getZoomTranslationDelta(scale, this.translateOnStart.scale, this.startCenterOffset);
    const x = this.translateOnStart.x + event.centerMovementXFromStart! + translationDelta.x;
    const y = this.translateOnStart.y + event.centerMovementYFromStart! + translationDelta.y;

    return { x, y };
  }
}

/**
 * Calculates the translation offset required to maintain a stationary pinch center during scaling.
 * This function plays a crucial role in creating a zoom effect that is both natural and centered around the user's pinch gesture.
 *
 * The function performs the following steps:
 * 1- Identifying the translation origin, which is the pinch center ('centerOffset'). This origin point,
 *   representing the center of pointer events at the start of zooming, should remain constant throughout the zoom process.
 *   Keeping this origin unchanged is vital; any alterations during zooming can cause the element to shift unexpectedly,
 *   leading to a jarring user experience.
 * 2- Calculating the scale change. This is achieved by comparing the new scale ('scale') with the initial scale at the start of zooming ('scaleOnStart').
 *   The scale change reflects how much the element has been zoomed in or out relative to its initial state.
 * 3- Computing the translation offset. This offset is essential for ensuring the pinch center remains stationary as the scale changes.
 *   It is determined by multiplying the negative of the scale change with the coordinates of the translation origin.
 *   This calculation ensures that the zoom effect is anchored around the pinch center, providing a smooth and intuitive user interaction.
 *
 * Through these steps, the function effectively maintains the focal point of the zoom, enhancing the natural feel and responsiveness of the scaling action.
 */
function getZoomTranslationDelta(scale: number, scaleOnStart: number, centerOffset: Coordinate) {
  const scaleChange = scale - scaleOnStart;
  const x = -(centerOffset.x * scaleChange);
  const y = -(centerOffset.y * scaleChange);

  return { x, y };
}

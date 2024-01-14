import { ZoomAdjusterConfig, ZoomAdjusterHooks, ZoomAdjusterResult } from '../zoom.model';
import { Animation, clamp, Dom, DomSelector } from '@elemix/core';
import { PinchZoomBoundary, PinchZoomOptions } from './pinch-zoom.model';

export class PinchZoomAnimateToBoundaryAdjusters implements ZoomAdjusterHooks {
  private animation: Animation;
  private element: Dom;
  private elemRect: DOMRect;

  constructor(element: DomSelector) {
    this.animation = Animation.getOrCreateInstance(element);
    this.element = new Dom(element);
  }

  onPress(): void {
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
  adjuster(next: ZoomAdjusterResult): ZoomAdjusterResult {
    return next;
  }
  onEnd(config: ZoomAdjusterConfig): void {
    const scale = this.animation.value.transform.scale;
    const clampScale = clamp(scale, [config.minScale, config.maxScale]);
    const { x, y } = this.getTranslateOnZoomEnd(this.animation.value.transform, config.option, clampScale);

    this.animation.setScale(clampScale).setTranslate({ x, y }).animate();
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
}

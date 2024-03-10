import { Dom } from '@elemix/core';
import { CropOptions } from './crop.model';
import { CropBaseConfig, CropDragMovementConfig, CropElements } from './crop.internal-model';

interface DebugElements {
  pointerX: Dom;
  pointerY: Dom;
  zoneBoundaryX: Dom;
  zoneBoundaryY: Dom;
}

export class CropDebug {
  private static options: CropOptions;
  private static cropElements: CropElements;
  private static enabled = false;
  private static debugElements: DebugElements;

  public static init(options: CropOptions, elements: CropElements) {
    this.options = options;
    this.cropElements = elements;
    this.enabled = options._debug;

    if (this.enabled) {
      this.createElements();
    }
  }
  private static createElements() {
    const debugElements = new Dom(`
      <div class="crop-debug__invisible-zone-wrapper">
        <div style="width: ${this.options.horizontalGap}" class="crop-debug__invisible-zone--left"></div>
        <div style="height: ${this.options.verticalGap}" class="crop-debug__invisible-zone--top"></div>
        <div style="width: ${this.options.horizontalGap}" class="crop-debug__invisible-zone--right"></div>
        <div style="height: ${this.options.verticalGap};" class="crop-debug__invisible-zone--bottom"></div>
        
        <div class="crop-debug__pointer-x"></div>
        <div class="crop-debug__pointer-y"></div>
        <div class="crop-debug__zone-boundary-x"></div>
        <div class="crop-debug__zone-boundary-y"></div>
      </div>
    `).appendTo(this.cropElements.wrapper);

    this.debugElements = {
      pointerX: new Dom('.crop-debug__pointer-x', debugElements.nativeElement),
      pointerY: new Dom('.crop-debug__pointer-y', debugElements.nativeElement),
      zoneBoundaryX: new Dom('.crop-debug__zone-boundary-x', debugElements.nativeElement),
      zoneBoundaryY: new Dom('.crop-debug__zone-boundary-y', debugElements.nativeElement),
    };
  }

  public static updatePointerPosition(config: CropBaseConfig, movementsConfig: CropDragMovementConfig) {
    if (!this.enabled) {
      return;
    }

    // PointerX
    this.debugElements.pointerX.setStyleImmediately('left', movementsConfig.clientX - config.documentXDelta - 1 + 'px');
    this.debugElements.pointerX.setStyleImmediately('width', '3px');
    this.debugElements.pointerX.setStyleImmediately('height', '100%');

    // pointerY
    this.debugElements.pointerY.setStyleImmediately('top', movementsConfig.clientY - config.documentYDelta - 1 + 'px');
    this.debugElements.pointerY.setStyleImmediately('height', '3px');
    this.debugElements.pointerY.setStyleImmediately('width', '100%');
  }

  public static updateBoundaryX(x: number) {
    if (!this.enabled) {
      return;
    }

    this.debugElements.zoneBoundaryX.setStyleImmediately('left', x - 1 + 'px');
    this.debugElements.zoneBoundaryX.setStyleImmediately('width', '3px');
    this.debugElements.zoneBoundaryX.setStyleImmediately('height', '100%');
  }

  public static updateBoundaryY(y: number) {
    if (!this.enabled) {
      return;
    }

    this.debugElements.zoneBoundaryY.setStyleImmediately('top', y - 1 + 'px');
    this.debugElements.zoneBoundaryY.setStyleImmediately('height', '3px');
    this.debugElements.zoneBoundaryY.setStyleImmediately('width', '100%');
  }
}

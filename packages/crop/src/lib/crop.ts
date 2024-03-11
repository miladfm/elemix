import { filter } from 'rxjs';
import { DomSelector, GesturesEventType, NonNullableProps } from '@elemix/core';
import { Drag, DragBoundaryType } from '@elemix/drag';
import { CropOptions } from './crop.model';
import { getCropElements } from './crop-elements';
import { getCropZoneConfig } from './crop-resize-zone-config';
import { getBackdropWrapperScale, getBackdropWrapperX, getBackdropWrapperY } from './crop-resize-backdrop-wrapper';
import { getCropDragMovements } from './crop-resize-movements';
import { getImageScale } from './crop-resize-image-scale';
import { getCropBoxWidth } from './crop-resize-crop-box-width';
import { getCropBoxHeight } from './crop-resize-crop-box-height';
import { getCropBoxX } from './crop-resize-crop-box-x';
import { getCropBoxY } from './crop-resize-crop-box-y';
import { getImageX } from './crop-resize-image-x';
import { getImageY } from './crop-resize-image-y';
import { getCropBoundedValues } from './crop-resize-bounded';
import { CropDebug } from './crop-debug';
import { getCropElementsEvent } from './crop-elements-event';
import { CropAnimation } from './crop-animation';
import { captureTransformOnPress } from './crop-image-drag';
import { getCropBaseConfig } from './crop-resize-base-config';
import { CropBaseConfig, CropElements, CropElementsEventData, CropElementsEventDataOnDrag } from './crop.internal-model';
import { isCropResizeDragEventData } from './crop.utils';

const DEFAULT_OPTIONS: CropOptions = {
  verticalGap: 150,
  horizontalGap: 170,
  minWidth: 50,
  minHeight: 50,
  _debug: false,
};

export class Crop {
  private options: CropOptions;
  private elements: CropElements;

  private baseConfig: CropBaseConfig | null;
  private cropAnimation: CropAnimation;

  constructor(element: DomSelector, imgSrc: string, options: Partial<CropOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.elements = getCropElements(element, imgSrc);
    this.cropAnimation = new CropAnimation(this.elements, this.options);

    CropDebug.init(this.options, this.elements);

    this.elements.image.nativeElement.addEventListener('load', () => {
      this.cropAnimation.applyInitStyle();
      this.initImageDrag();
      this.initResize();

      this.elements.container.observeResize$().subscribe(() => {
        this.cropAnimation.alignElementsToCenter();
      });
    });

    this.elements.container.appendChild(this.elements.wrapper);
  }

  private initImageDrag() {
    const _drag = new Drag(this.elements.image, {
      boundary: {
        elem: this.elements.cropBox,
        type: DragBoundaryType.Inner,
        bounceFactor: 0.98,
      },
    });

    _drag.events$
      .pipe(
        captureTransformOnPress(this.elements),
        filter(({ event }) => event.type === GesturesEventType.Drag || event.type === 'bounce')
      )
      .subscribe((dragEvent) => {
        const x = dragEvent.transformOnPress.backdropWrapper.x - (dragEvent.transformOnPress.image.x - dragEvent.event.translate.x);
        const y = dragEvent.transformOnPress.backdropWrapper.y - (dragEvent.transformOnPress.image.y - dragEvent.event.translate.y);
        this.cropAnimation.applyStylesOnImageDrag({ x, y }, dragEvent.event.type !== GesturesEventType.Drag);
      });
  }

  private initResize() {
    getCropElementsEvent(this.elements.wrapper).subscribe((eventData) => {
      switch (eventData.event.type) {
        case GesturesEventType.DragPress:
          this.onCropResizePress(eventData);
          break;

        case GesturesEventType.Drag:
          if (isCropResizeDragEventData(eventData)) {
            this.onCropResize(eventData);
          }
          break;

        case GesturesEventType.DragEnd:
          this.onCropResizeEnd();
          break;

        case GesturesEventType.DragRelease:
          this.onCropResizeRelease();
          break;
      }
    });
  }

  private onCropResizePress(eventData: CropElementsEventData) {
    this.cropAnimation.animateBackdropVisibilityOnCropResize(true);
    this.baseConfig = getCropBaseConfig(this.elements, this.options, eventData);
  }

  private onCropResize(eventData: CropElementsEventDataOnDrag) {
    if (!this.baseConfig) {
      return;
    }
    const zoneConfig = getCropZoneConfig(this.baseConfig, this.elements, this.options, eventData);
    const movementsConfig = getCropDragMovements(this.baseConfig, zoneConfig, eventData);

    const imageScale = getImageScale(this.baseConfig, movementsConfig);

    CropDebug.updatePointerPosition(this.baseConfig, movementsConfig);

    const cropBoxUnboundedWidth = getCropBoxWidth(imageScale, this.baseConfig, movementsConfig, this.elements, this.options);
    const cropBoxUnboundedHeight = getCropBoxHeight(imageScale, this.baseConfig, movementsConfig, this.elements, this.options);
    const imageUnboundedX = getImageX(cropBoxUnboundedWidth, imageScale, this.baseConfig);
    const imageUnboundedY = getImageY(cropBoxUnboundedHeight, imageScale, this.baseConfig);

    const { cropBoxWidth, cropBoxHeight, imageX, imageY } = getCropBoundedValues(this.baseConfig, {
      imageScale,
      cropBoxUnboundedWidth,
      cropBoxUnboundedHeight,
      imageUnboundedX,
      imageUnboundedY,
    });

    const cropBoxX = getCropBoxX(cropBoxWidth, imageScale, this.baseConfig, movementsConfig, this.elements);
    const cropBoxY = getCropBoxY(cropBoxHeight, imageScale, this.baseConfig, movementsConfig, this.elements);
    const backdropWrapperScale = getBackdropWrapperScale(this.baseConfig, imageScale);
    const backdropWrapperX = getBackdropWrapperX(cropBoxX, imageX);
    const backdropWrapperY = getBackdropWrapperY(cropBoxY, imageY);

    this.cropAnimation.applyChangesOnCropResize({
      cropBoxWidth,
      cropBoxHeight,
      cropBoxX,
      cropBoxY,
      imageScale,
      imageX,
      imageY,
      backdropWrapperScale,
      backdropWrapperX,
      backdropWrapperY,
    });
  }

  private onCropResizeEnd() {
    this.cropAnimation.alignElementsToCenter(true);
    this.baseConfig = null;
  }

  private onCropResizeRelease() {
    this.cropAnimation.animateBackdropVisibilityOnCropResize(false);
  }
}

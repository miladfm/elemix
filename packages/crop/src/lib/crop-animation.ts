import { CropOptions } from './crop.model';
import { Animation, AnimationGroup, scaleElementToFit } from '@elemix/core';
import { CropDomChanges, CropElements } from './crop.internal-model';

export class CropAnimation {
  private elements: CropElements;
  private options: CropOptions;

  private cropAnimationGroup: AnimationGroup;
  private backdropAnimationGroup: AnimationGroup;

  private cropBoxAnimation: Animation;
  private imageAnimation: Animation;
  private backdropWrapperAnimation: Animation;
  private backdropAnimation: Animation;
  private gridAnimation: Animation;

  constructor(elements: CropElements, options: CropOptions) {
    this.elements = elements;
    this.options = options;

    this.cropAnimationGroup = new AnimationGroup([this.elements.cropBox, this.elements.image, this.elements.backdropWrapper], {
      disableInstance: true,
    });

    this.backdropAnimationGroup = new AnimationGroup([this.elements.grids, this.elements.backdrop], {
      disableInstance: true,
    });

    this.cropBoxAnimation = Animation.getOrCreateInstance(elements.cropBox);
    this.imageAnimation = Animation.getOrCreateInstance(elements.image);
    this.backdropWrapperAnimation = Animation.getOrCreateInstance(elements.backdropWrapper);
    this.backdropAnimation = Animation.getOrCreateInstance(elements.backdrop);
    this.gridAnimation = Animation.getOrCreateInstance(elements.grids);
  }

  public applyInitStyle() {
    const allAnimations = [
      this.cropBoxAnimation,
      this.imageAnimation,
      this.backdropWrapperAnimation,
      this.backdropAnimation,
      this.gridAnimation,
    ];

    const size = scaleElementToFit(this.elements.image, this.elements.container, {
      gap: {
        vertical: this.options.verticalGap,
        horizontal: this.options.horizontalGap,
      },
    });

    this.cropBoxAnimation.setDimension({ width: size.dimensions.width, height: size.dimensions.height });
    this.cropBoxAnimation.setTranslate({ x: size.relativePosition.x, y: size.relativePosition.y });
    this.imageAnimation.setTranslate({ x: 0, y: 0 });
    this.imageAnimation.setScale(size.scale);
    this.backdropAnimation.setOpacity(0.7); // Don't use css: The element has not applied to dom to get the init opacity from css
    this.backdropWrapperAnimation.setDimension({ width: size.dimensions.width, height: size.dimensions.height });
    this.backdropWrapperAnimation.setTranslate({ x: size.relativePosition.x, y: size.relativePosition.y });
    this.gridAnimation.setOpacity(0); // Don't use css: The element has not applied to dom to get the init opacity from css

    allAnimations.forEach((animation) => animation.applyImmediately());
  }

  public applyChangesOnCropResize(changes: CropDomChanges) {
    this.cropBoxAnimation.setDimension({ width: changes.cropBoxWidth, height: changes.cropBoxHeight });
    this.cropBoxAnimation.setTranslate({ x: changes.cropBoxX, y: changes.cropBoxY });

    this.imageAnimation.setScale(changes.imageScale);
    this.imageAnimation.setTranslate({ x: changes.imageX, y: changes.imageY });

    this.backdropWrapperAnimation.setScale(changes.backdropWrapperScale);
    this.backdropWrapperAnimation.setTranslate({ x: changes.backdropWrapperX, y: changes.backdropWrapperY });

    this.cropAnimationGroup.apply();
  }

  public alignElementsToCenter(animate = false) {
    const size = scaleElementToFit(this.elements.cropBox, this.elements.container, {
      gap: {
        vertical: this.options.verticalGap,
        horizontal: this.options.horizontalGap,
      },
    });

    this.cropBoxAnimation.setDimension({ width: size.dimensions.width, height: size.dimensions.height });
    this.cropBoxAnimation.setTranslate({ x: size.relativePosition.x, y: size.relativePosition.y });

    this.imageAnimation.setScale(this.imageAnimation.value.transform.scale * size.scale);
    this.imageAnimation.setTranslate({
      x: this.imageAnimation.value.transform.x * size.scale,
      y: this.imageAnimation.value.transform.y * size.scale,
    });

    this.backdropWrapperAnimation.setScale(this.backdropWrapperAnimation.value.transform.scale * size.scale);

    // always cropBox position + imageInCropBoxPosition
    const scaledBackdropWrapperX = this.imageAnimation.actualValue.transform.x * size.scale;
    const scaledBackdropWrapperY = this.imageAnimation.actualValue.transform.y * size.scale;
    this.backdropWrapperAnimation.setTranslate({
      x: scaledBackdropWrapperX + size.relativePosition.x,
      y: scaledBackdropWrapperY + size.relativePosition.y,
    });

    if (animate) {
      this.cropAnimationGroup.animate({ duration: 300 });
    } else {
      this.cropAnimationGroup.apply();
    }
  }

  public animateBackdropVisibilityOnCropResize(isVisible: boolean) {
    this.gridAnimation.setOpacity(isVisible ? 1 : 0);
    this.backdropAnimation.setOpacity(isVisible ? 0.4 : 0.7);

    this.backdropAnimationGroup.animate();
  }

  public applyStylesOnImageDrag(changes: { x: number; y: number }, applyImmediately: boolean) {
    this.backdropWrapperAnimation.setTranslate(changes);

    applyImmediately ? this.cropAnimationGroup.applyImmediately() : this.cropAnimationGroup.apply();
  }
}

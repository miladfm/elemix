import { on, switchArray, Animation, clamp } from '@elemix/core';
import { CropOptions } from './crop.model';
import { getAdjustedValueAfterScaled } from './crop.utils';
import { CropBaseConfig, CropDragMovementConfig, CropElements, CropZone } from './crop.internal-model';

// region PUBLIC
export function getCropBoxWidth(
  imageScale: number,
  baseConfig: CropBaseConfig,
  movementConfig: CropDragMovementConfig,
  elements: CropElements,
  options: CropOptions
): number {
  const width = switchArray(
    [movementConfig.xZone, movementConfig.yZone],

    // X-Y: Single-Scale
    on([CropZone.SingleSide, CropZone.Scale], () => {
      const currentWidth = Animation.getOrCreateInstance(elements.cropBox).value.dimension.width;
      const currentScale = Animation.getOrCreateInstance(elements.image).value.transform.scale;

      const movementFromCurrentCropBoxEdge = getMovementXFromCurrentCropBoxPosition(baseConfig, movementConfig, elements);

      const defaultWidthInScaleZone = getAdjustedValueAfterScaled(currentWidth, imageScale, currentScale);
      return defaultWidthInScaleZone + movementFromCurrentCropBoxEdge;
    }),

    // X-Y: Both-Scale
    on([CropZone.BothSide, CropZone.Scale], () => {
      const currentWidth = Animation.getOrCreateInstance(elements.cropBox).value.dimension.width;

      const movementFromCurrentCropBoxEdge = getMovementXFromCurrentCropBoxPosition(baseConfig, movementConfig, elements);
      const totalMovement = movementFromCurrentCropBoxEdge * 2;
      return currentWidth + totalMovement;
    }),

    // X-Y: Any-Scale
    on([null, CropZone.Scale], () => {
      const currentWidth = Animation.getOrCreateInstance(elements.cropBox).value.dimension.width;
      const currentScale = Animation.getOrCreateInstance(elements.image).value.transform.scale;
      return getAdjustedValueAfterScaled(currentWidth, imageScale, currentScale);
    }),

    // X-Y: Scale-Any
    on([CropZone.Scale, 'any'], () => {
      const totalGap = options.horizontalGap * 2;
      return baseConfig.react.container.width - totalGap;
    }),

    // X-Y: Single-Any
    on([CropZone.SingleSide, 'any'], () => {
      const widthChanges = baseConfig.hDirection === 'left' ? -movementConfig.movementXInZone : movementConfig.movementXInZone;
      return Math.max(baseConfig.react.cropBox.width + widthChanges, options.minWidth);
    }),

    // X-Y: Both-Any
    on([CropZone.BothSide, 'any'], () => {
      const widthChanges = baseConfig.hDirection === 'left' ? -movementConfig.movementXInZone * 2 : movementConfig.movementXInZone * 2;
      return baseConfig.react.cropBox.width + widthChanges;
    }),

    // Default: Current width without changes
    on('default', () => {
      return Animation.getOrCreateInstance(elements.cropBox).value.dimension.width;
    })
  );

  const totalGap = options.horizontalGap * 2;
  const maxWidth = baseConfig.react.container.width - totalGap;
  return clamp(width, [options.minWidth, maxWidth]);
}
// endregion

// region HELPERS
/**
 * Mouse cursor movement from left or right of cropBox and not from start point.
 * The cropBox can change the position, and we need to keep the left/right of cropBox same as mouse cursor position.
 */
export function getMovementXFromCurrentCropBoxPosition(
  config: CropBaseConfig,
  movementConfig: CropDragMovementConfig,
  elements: CropElements
) {
  const currentWidth = Animation.getOrCreateInstance(elements.cropBox).value.dimension.width;
  const currentX = Animation.getOrCreateInstance(elements.cropBox).value.transform.x;

  const movementX =
    config.hDirection === 'left'
      ? config.react.container.x + currentX - movementConfig.clientX
      : movementConfig.clientX - (config.react.container.x + currentX + currentWidth);

  return movementX;
}
// endregion

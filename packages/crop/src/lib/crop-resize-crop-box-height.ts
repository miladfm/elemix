import { CropOptions } from './crop.model';
import { Animation, clamp, on, switchArray } from '@elemix/core';
import { getAdjustedValueAfterScaled } from './crop.utils';
import { CropBaseConfig, CropDragMovementConfig, CropElements, CropZone } from './crop.internal-model';

// region PUBLIC
export function getCropBoxHeight(
  imageScale: number,
  baseConfig: CropBaseConfig,
  movementConfig: CropDragMovementConfig,
  elements: CropElements,
  options: CropOptions
): number {
  const height = switchArray(
    [movementConfig.xZone, movementConfig.yZone],

    // X-Y: Scale-Single
    on([CropZone.Scale, CropZone.SingleSide], () => {
      const currentHeight = Animation.getOrCreateInstance(elements.cropBox).value.dimension.height;
      const currentScale = Animation.getOrCreateInstance(elements.image).value.transform.scale;

      const movementFromCurrentCropBoxEdge = getMovementYFromCurrentCropBoxPosition(baseConfig, movementConfig, elements);
      const defaultHeightInScaleZone = getAdjustedValueAfterScaled(currentHeight, imageScale, currentScale);

      return defaultHeightInScaleZone + movementFromCurrentCropBoxEdge;
    }),

    // X-Y: Scale-Both
    on([CropZone.Scale, CropZone.BothSide], () => {
      const currentHeight = Animation.getOrCreateInstance(elements.cropBox).value.dimension.height;

      const movementFromCurrentCropBoxEdge = getMovementYFromCurrentCropBoxPosition(baseConfig, movementConfig, elements);
      const totalMovement = movementFromCurrentCropBoxEdge * 2;
      return currentHeight + totalMovement;
    }),

    // X-Y: Scale-Any
    on([CropZone.Scale, null], () => {
      const currentHeight = Animation.getOrCreateInstance(elements.cropBox).value.dimension.height;
      const currentScale = Animation.getOrCreateInstance(elements.image).value.transform.scale;
      return getAdjustedValueAfterScaled(currentHeight, imageScale, currentScale);
    }),

    // X-Y: Any-Scale
    on(['any', CropZone.Scale], () => {
      const totalGap = options.verticalGap * 2;
      return baseConfig.react.container.height - totalGap;
    }),

    // X-Y: Any-Single
    on(['any', CropZone.SingleSide], () => {
      const heightChanges = baseConfig.vDirection === 'top' ? -movementConfig.movementYInZone : movementConfig.movementYInZone;
      return Math.max(baseConfig.react.cropBox.height + heightChanges, options.minHeight);
    }),

    // X-Y: Any-Both
    on(['any', CropZone.BothSide], () => {
      const heightChanges = baseConfig.vDirection === 'top' ? -movementConfig.movementYInZone * 2 : movementConfig.movementYInZone * 2;
      return baseConfig.react.cropBox.height + heightChanges;
    }),

    // Default: Current height without changes
    on('default', () => {
      // console.log('cropBox height default');
      return Animation.getOrCreateInstance(elements.cropBox).value.dimension.height;
    })
  );

  const totalGap = options.verticalGap * 2;
  const maxHeight = baseConfig.react.container.height - totalGap;
  return clamp(height, [options.minHeight, maxHeight]);
}
// endregion

// region HELPERS
/**
 * Mouse cursor movement from top or bottom of cropBox and not from start point.
 * The cropBox can change the position, and we need to keep the top/bottom of cropBox same as mouse cursor position.
 */
function getMovementYFromCurrentCropBoxPosition(config: CropBaseConfig, movementConfig: CropDragMovementConfig, elements: CropElements) {
  const currentHeight = Animation.getOrCreateInstance(elements.cropBox).value.dimension.height;
  const currentY = Animation.getOrCreateInstance(elements.cropBox).value.transform.y;

  const movementY =
    config.vDirection === 'top'
      ? config.react.container.y + currentY - movementConfig.clientY
      : movementConfig.clientY - (config.react.container.y + currentY + currentHeight);

  return movementY;
}
// endregion

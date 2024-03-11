import { Animation, on, switchArray } from '@elemix/core';
import { CropBaseConfig, CropDragMovementConfig, CropElements, CropHDirection, CropZone } from './crop.internal-model';

// region PUBLIC
export function getCropBoxX(
  newWidth: number,
  imageScale: number,
  baseConfig: CropBaseConfig,
  movementConfig: CropDragMovementConfig,
  elements: CropElements
): number {
  return switchArray(
    [movementConfig.xZone, movementConfig.yZone],

    // X-Y: Single-Scale
    on([CropZone.SingleSide, CropZone.Scale], () => {
      // centerOfStart: Align to center but base on Press position and not live
      const widthFromStart = (baseConfig.react.cropBox.width * imageScale) / baseConfig.transform.image.scale;
      const left = (baseConfig.react.container.width - widthFromStart) / 2;
      const x = baseConfig.hDirection === CropHDirection.Left ? left + widthFromStart - newWidth : left;

      return x;
    }),

    // X-Y: Single-Any
    on([CropZone.SingleSide, 'any'], () => {
      // right: For left we have to align to the right
      // left: For right we have to align to the left
      if (baseConfig.hDirection === CropHDirection.Left) {
        const x = baseConfig.transform.cropBox.x + baseConfig.react.cropBox.width - newWidth;
        return x;
      } else {
        return Animation.getOrCreateInstance(elements.cropBox).value.transform.x;
      }
    }),

    // Default
    on('default', () => {
      // center: Align to the center
      return (baseConfig.react.container.width - newWidth) / 2;
    })
  );
}
// endregion

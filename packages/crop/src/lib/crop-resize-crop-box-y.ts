import { Animation, on, switchArray } from '@elemix/core';
import { CropBaseConfig, CropDragMovementConfig, CropElements, CropVDirection, CropZone } from './crop.internal-model';

// region PUBLIC
export function getCropBoxY(
  newHeight: number,
  imageScale: number,
  baseConfig: CropBaseConfig,
  movementConfig: CropDragMovementConfig,
  elements: CropElements
): number {
  return switchArray(
    [movementConfig.xZone, movementConfig.yZone],

    // X-Y: Scale-Single
    on([CropZone.Scale, CropZone.SingleSide], () => {
      // centerOfStart: Align to center but base on Press position and not live
      const heightFromStart = (baseConfig.react.cropBox.height * imageScale) / baseConfig.transform.image.scale;
      const top = (baseConfig.react.container.height - heightFromStart) / 2;
      const y = baseConfig.vDirection === CropVDirection.Top ? top + heightFromStart - newHeight : top;

      return y;
    }),

    // X-Y: Any-Single
    on(['any', CropZone.SingleSide], () => {
      // right: For top we have to align to the bottom
      // left: For bottom we have to align to the top
      if (baseConfig.vDirection === CropVDirection.Top) {
        const y = baseConfig.transform.cropBox.y + baseConfig.react.cropBox.height - newHeight;
        return y;
      } else {
        return Animation.getOrCreateInstance(elements.cropBox).value.transform.y;
      }
    }),

    // Default
    on('default', () => {
      // console.log('DEFAULT CROP-BOX Y');
      // center: Align to the center
      return (baseConfig.react.container.height - newHeight) / 2;
    })
  );
}
// endregion

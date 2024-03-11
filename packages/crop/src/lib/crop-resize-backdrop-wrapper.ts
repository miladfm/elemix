import { getAdjustedValueAfterScaled } from './crop.utils';
import { CropBaseConfig } from './crop.internal-model';

// region PUBLIC
export function getBackdropWrapperScale(baseConfig: CropBaseConfig, imageScale: number) {
  return getAdjustedValueAfterScaled(baseConfig.transform.backdropWrapper.scale, imageScale, baseConfig.transform.image.scale);
}

export function getBackdropWrapperX(cropBoxX: number, imageX: number) {
  return cropBoxX + imageX;
}

export function getBackdropWrapperY(cropBoxY: number, imageY: number) {
  return cropBoxY + imageY;
}
// endregion

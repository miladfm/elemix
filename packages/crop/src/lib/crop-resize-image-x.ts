import { CropBaseConfig } from './crop.internal-model';

// region PUBLIC
export function getImageX(newWidth: number, imageScale: number, baseConfig: CropBaseConfig): number {
  switch (baseConfig.hDirection) {
    case 'left':
      return alignToRight(baseConfig, imageScale, newWidth);

    case 'right':
    default:
      return alignToLeft(baseConfig, imageScale);
  }
}
// endregion

// region HELPERS
function alignToLeft(config: CropBaseConfig, imageScale: number): number {
  const newImageWidth = (config.react.image.width * imageScale) / config.transform.image.scale;
  const imageXScaleFactor = newImageWidth / config.react.image.width;
  const imageX = config.transform.image.x * imageXScaleFactor;
  return imageX;
}

function alignToRight(config: CropBaseConfig, imageScale: number, newWidth: number): number {
  const newImageWidth = (config.react.image.width * imageScale) / config.transform.image.scale;
  const imageXScaleFactor = newImageWidth / config.react.image.width;
  const imageRight = config.react.image.width - -config.transform.image.x - config.react.cropBox.width;
  const imageRightAfterScale = imageRight * imageXScaleFactor;
  const imageX = -(newImageWidth - newWidth - imageRightAfterScale);
  return imageX;
}
// endregion

import { CropBaseConfig } from './crop.internal-model';

// region PUBLIC
export function getImageY(newHeight: number, imageScale: number, baseConfig: CropBaseConfig): number {
  switch (baseConfig.vDirection) {
    case 'top':
      return alignToBottom(baseConfig, imageScale, newHeight);

    case 'bottom':
    default:
      return alignToTop(baseConfig, imageScale);
  }
}
// endregion

// region HELPERS
function alignToTop(config: CropBaseConfig, imageScale: number): number {
  const newImageHeight = (config.react.image.height * imageScale) / config.transform.image.scale;
  const imageYScaleFactor = newImageHeight / config.react.image.width;
  const imageY = config.transform.image.y * imageYScaleFactor;
  return imageY;
}

function alignToBottom(config: CropBaseConfig, imageScale: number, newHeight: number): number {
  const newImageHeight = (config.react.image.height * imageScale) / config.transform.image.scale;
  const imageYScaleFactor = newImageHeight / config.react.image.width;
  const imageBottom = config.react.image.height - -config.transform.image.y - config.react.cropBox.height;
  const imageBottomAfterScale = imageBottom * imageYScaleFactor;
  const imageY = -(newImageHeight - newHeight - imageBottomAfterScale);
  return imageY;
}
// endregion

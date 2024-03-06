import { getAdjustedValueAfterScaled } from './crop.utils';
import { CropBaseConfig } from './crop.internal-model';

// region MODEL
interface CropUnboundedInputParams {
  imageScale: number;
  cropBoxUnboundedWidth: number;
  cropBoxUnboundedHeight: number;
  imageUnboundedX: number;
  imageUnboundedY: number;
}

interface CropUnboundedOutputParams {
  cropBoxWidth: number;
  cropBoxHeight: number;
  imageX: number;
  imageY: number;
}

interface CropUnboundedCurrentValues {
  imageTotalWidth: number;
  imageTotalHeight: number;
  imageLeftOutsideCropBox: number;
  imageRightOutsideCropBox: number;
  imageTopOutsideCropBox: number;
  imageBottomOutsideCropBox: number;
}
// endregion

// region PUBLIC
export function getCropBoundedValues(baseConfig: CropBaseConfig, unboundedValues: CropUnboundedInputParams): CropUnboundedOutputParams {
  const currentSizes = getCurrentSizes(baseConfig, unboundedValues);

  const result: CropUnboundedOutputParams = {
    cropBoxWidth: unboundedValues.cropBoxUnboundedWidth,
    cropBoxHeight: unboundedValues.cropBoxUnboundedHeight,
    imageX: unboundedValues.imageUnboundedX,
    imageY: unboundedValues.imageUnboundedY,
    ...getBoundedLeftValues(unboundedValues, currentSizes),
    ...getBoundedRightValues(unboundedValues, currentSizes),
    ...getBoundedTopValues(unboundedValues, currentSizes),
    ...getBoundedBottomValues(unboundedValues, currentSizes),
  };

  return result;
}
// endregion

// region HELPERS
function getCurrentSizes(config: CropBaseConfig, unboundedValues: CropUnboundedInputParams): CropUnboundedCurrentValues {
  const imageTotalWidth = getAdjustedValueAfterScaled(config.react.image.width, unboundedValues.imageScale, config.transform.image.scale);
  const imageTotalHeight = getAdjustedValueAfterScaled(config.react.image.height, unboundedValues.imageScale, config.transform.image.scale);

  const imageLeftOutsideCropBox = -unboundedValues.imageUnboundedX;
  const imageRightOutsideCropBox = imageTotalWidth - -unboundedValues.imageUnboundedX - unboundedValues.cropBoxUnboundedWidth;
  const imageTopOutsideCropBox = -unboundedValues.imageUnboundedY;
  const imageBottomOutsideCropBox = imageTotalHeight - -unboundedValues.imageUnboundedY - unboundedValues.cropBoxUnboundedHeight;

  return {
    imageTotalWidth,
    imageTotalHeight,
    imageLeftOutsideCropBox,
    imageRightOutsideCropBox,
    imageTopOutsideCropBox,
    imageBottomOutsideCropBox,
  };
}

function getBoundedLeftValues(
  unboundedValues: CropUnboundedInputParams,
  currentSizes: CropUnboundedCurrentValues
): Partial<CropUnboundedOutputParams> {
  if (currentSizes.imageLeftOutsideCropBox < 0) {
    return {
      cropBoxWidth: unboundedValues.cropBoxUnboundedWidth + currentSizes.imageLeftOutsideCropBox,
      imageX: unboundedValues.imageUnboundedX + currentSizes.imageLeftOutsideCropBox,
    };
  }

  return {};
}

function getBoundedRightValues(
  unboundedValues: CropUnboundedInputParams,
  currentSizes: CropUnboundedCurrentValues
): Partial<CropUnboundedOutputParams> {
  if (currentSizes.imageRightOutsideCropBox < 0) {
    const cropBoxWidth = unboundedValues.cropBoxUnboundedWidth + currentSizes.imageRightOutsideCropBox;
    const imageXDelta = currentSizes.imageTotalWidth - -unboundedValues.imageUnboundedX - cropBoxWidth;

    return {
      cropBoxWidth,
      imageX: unboundedValues.imageUnboundedX - imageXDelta,
    };
  }

  return {};
}

function getBoundedTopValues(
  unboundedValues: CropUnboundedInputParams,
  currentSizes: CropUnboundedCurrentValues
): Partial<CropUnboundedOutputParams> {
  if (currentSizes.imageTopOutsideCropBox < 0) {
    return {
      cropBoxHeight: unboundedValues.cropBoxUnboundedHeight + currentSizes.imageTopOutsideCropBox,
      imageY: unboundedValues.imageUnboundedY + currentSizes.imageTopOutsideCropBox,
    };
  }

  return {};
}

function getBoundedBottomValues(
  unboundedValues: CropUnboundedInputParams,
  currentSizes: CropUnboundedCurrentValues
): Partial<CropUnboundedOutputParams> {
  if (currentSizes.imageBottomOutsideCropBox < 0) {
    const cropBoxHeight = unboundedValues.cropBoxUnboundedHeight + currentSizes.imageBottomOutsideCropBox;
    const imageYDelta = currentSizes.imageTotalHeight - -unboundedValues.imageUnboundedY - cropBoxHeight;

    return {
      cropBoxHeight,
      imageY: unboundedValues.imageUnboundedY - imageYDelta,
    };
  }

  return {};
}
// endregion

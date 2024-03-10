import { Animation } from '@elemix/core';
import { CropOptions } from './crop.model';
import { CropDebug } from './crop-debug';
import {
  CropBaseConfig,
  CropConfigBoundaryZone,
  CropElements,
  CropElementsEventData,
  CropHDirection,
  CropVDirection,
  CropZoneConfig,
} from './crop.internal-model';

// region MODEL
interface CropZoneBorder {
  x: number;
  y: number;
}
// endregion

// region PUBLIC
export function getCropZoneConfig(
  baseConfig: CropBaseConfig,
  elements: CropElements,
  options: CropOptions,
  eventData: CropElementsEventData
): CropZoneConfig {
  const zoneBorder: CropZoneBorder = {
    x: getSingleBothSizeZoneBorderX(baseConfig, elements),
    y: getSingleBothSizeZoneBorderY(baseConfig, elements),
  };

  const singleSideZone = getSingleSideZone(baseConfig, options, eventData, zoneBorder);
  const bothSideZone = getBothSideZone(baseConfig, options, eventData, zoneBorder);
  const scaleZone = getScaleZone(baseConfig, options, eventData);

  return { singleSideZone, bothSideZone, scaleZone };
}
// endregion

// region HELPERS
function getSingleBothSizeZoneBorderX(baseConfig: CropBaseConfig, elements: CropElements): number {
  const imageTransform = Animation.getOrCreateInstance(elements.image).value.transform;
  const cropBoxTransform = Animation.getOrCreateInstance(elements.cropBox).value.transform;
  const cropBoxDimension = Animation.getOrCreateInstance(elements.cropBox).value.dimension;

  if (baseConfig.hDirection === CropHDirection.Left) {
    // Left side of image
    const newLeftFromStart = (baseConfig.transform.image.x * imageTransform.scale) / baseConfig.transform.image.scale;
    const leftChanges = -imageTransform.x - -newLeftFromStart;
    const zoneBorder = cropBoxTransform.x - leftChanges - baseConfig.transform.cropBox.x;

    CropDebug.updateBoundaryX(cropBoxTransform.x - leftChanges);

    return zoneBorder;
  }

  if (baseConfig.hDirection === CropHDirection.Right) {
    // Left side of image + visible image in cropBox
    const imageRightOnStart = -baseConfig.transform.image.x + baseConfig.react.cropBox.width;
    const newRightFromStart = (imageRightOnStart * imageTransform.scale) / baseConfig.transform.image.scale;
    const rightChanges = newRightFromStart - (-imageTransform.x + cropBoxDimension.width);
    const zoneBorder =
      cropBoxTransform.x + cropBoxDimension.width + rightChanges - (baseConfig.transform.cropBox.x + baseConfig.react.cropBox.width);

    CropDebug.updateBoundaryX(cropBoxTransform.x + cropBoxDimension.width + rightChanges);

    return zoneBorder;
  }

  return 0;
}

function getSingleBothSizeZoneBorderY(baseConfig: CropBaseConfig, elements: CropElements): number {
  const imageTransform = Animation.getOrCreateInstance(elements.image).value.transform;
  const cropBoxTransform = Animation.getOrCreateInstance(elements.cropBox).value.transform;
  const cropBoxDimension = Animation.getOrCreateInstance(elements.cropBox).value.dimension;

  if (baseConfig.vDirection === CropVDirection.Top) {
    // Top side of image
    const newTopFromStart = (baseConfig.transform.image.y * imageTransform.scale) / baseConfig.transform.image.scale;
    const topChanges = -imageTransform.y - -newTopFromStart;
    const zoneBorder = cropBoxTransform.y - topChanges - baseConfig.transform.cropBox.y;

    CropDebug.updateBoundaryY(cropBoxTransform.y - topChanges);

    return zoneBorder;
  }

  if (baseConfig.vDirection === CropVDirection.Bottom) {
    // Top side of image + visible image in cropBox
    const imageBottomOnStart = -baseConfig.transform.image.y + baseConfig.react.cropBox.height;
    const newBottomFromStart = (imageBottomOnStart * imageTransform.scale) / baseConfig.transform.image.scale;
    const bottomChanges = newBottomFromStart - (-imageTransform.y + cropBoxDimension.height);
    const zoneBorder =
      cropBoxTransform.y + cropBoxDimension.height + bottomChanges - (baseConfig.transform.cropBox.y + baseConfig.react.cropBox.height);

    CropDebug.updateBoundaryY(cropBoxTransform.y + cropBoxDimension.height + bottomChanges);

    return zoneBorder;
  }

  return 0;
}

function getSingleSideZone(
  baseConfig: CropBaseConfig,
  options: CropOptions,
  eventData: CropElementsEventData,
  zoneBorder: CropZoneBorder
): CropConfigBoundaryZone {
  const singleSideZone = {} as CropConfigBoundaryZone;

  if (eventData.hDirection === CropHDirection.Left) {
    singleSideZone.minMovementX = zoneBorder.x;
    singleSideZone.maxMovementX = baseConfig.react.cropBox.width - options.minWidth;
  }

  if (eventData.hDirection === CropHDirection.Right) {
    singleSideZone.minMovementX = -(baseConfig.react.cropBox.width - options.minWidth);
    singleSideZone.maxMovementX = zoneBorder.x;
  }

  if (eventData.vDirection === CropVDirection.Top) {
    singleSideZone.minMovementY = zoneBorder.y;
    singleSideZone.maxMovementY = baseConfig.react.cropBox.height - options.minHeight;
  }

  if (eventData.vDirection === CropVDirection.Bottom) {
    singleSideZone.minMovementY = -(baseConfig.react.cropBox.height - options.minHeight);
    singleSideZone.maxMovementY = zoneBorder.y;
  }

  return singleSideZone;
}

function getBothSideZone(
  baseConfig: CropBaseConfig,
  options: CropOptions,
  eventData: CropElementsEventData,
  zoneBorder: CropZoneBorder
): CropConfigBoundaryZone {
  const bothSideZone = {} as CropConfigBoundaryZone;

  if (eventData.hDirection === CropHDirection.Left) {
    const imageOutsideLeft = -baseConfig.transform.image.x;
    const untilScaleZone = baseConfig.react.cropBox.left - (baseConfig.react.container.left + options.horizontalGap);

    bothSideZone.minMovementX = -Math.min(untilScaleZone, imageOutsideLeft / 2);
    bothSideZone.maxMovementX = zoneBorder.x;
  }

  if (eventData.hDirection === CropHDirection.Right) {
    const imageOutsideRight = baseConfig.react.image.width - -baseConfig.transform.image.x - baseConfig.react.cropBox.width;
    const untilScaleZone = baseConfig.react.container.right - options.horizontalGap - baseConfig.react.cropBox.right;

    bothSideZone.minMovementX = zoneBorder.x;
    bothSideZone.maxMovementX = Math.min(untilScaleZone, imageOutsideRight / 2);
  }

  if (eventData.vDirection === CropVDirection.Top) {
    const imageOutsideTop = -baseConfig.transform.image.y;
    const untilScaleZone = baseConfig.react.cropBox.top - (baseConfig.react.container.top + options.verticalGap);

    bothSideZone.minMovementY = -Math.min(untilScaleZone, imageOutsideTop / 2);
    bothSideZone.maxMovementY = zoneBorder.y;
  }

  if (eventData.vDirection === CropVDirection.Bottom) {
    const imageOutsideBottom = baseConfig.react.image.height - -baseConfig.transform.image.y - baseConfig.react.cropBox.height;
    const untilScaleZone = baseConfig.react.container.bottom - options.verticalGap - baseConfig.react.cropBox.bottom;

    bothSideZone.minMovementY = zoneBorder.y;
    bothSideZone.maxMovementY = Math.min(untilScaleZone, imageOutsideBottom / 2);
  }

  return bothSideZone;
}

function getScaleZone(baseConfig: CropBaseConfig, options: CropOptions, eventData: CropElementsEventData): CropConfigBoundaryZone {
  const scaleZone: CropConfigBoundaryZone = {
    maxMovementX: 0,
    minMovementX: 0,
    maxMovementY: 0,
    minMovementY: 0,
  };

  if (eventData.hDirection === CropHDirection.Left) {
    scaleZone.maxMovementX = baseConfig.react.container.left + options.horizontalGap - baseConfig.react.cropBox.left;
    scaleZone.minMovementX = scaleZone.maxMovementX - options.horizontalGap;
  }

  if (eventData.hDirection === CropHDirection.Right) {
    scaleZone.minMovementX = baseConfig.react.container.right - options.horizontalGap - baseConfig.react.cropBox.right;
    scaleZone.maxMovementX = scaleZone.minMovementX + options.horizontalGap;
  }

  if (eventData.vDirection === CropVDirection.Top) {
    scaleZone.maxMovementY = baseConfig.react.container.top + options.verticalGap - baseConfig.react.cropBox.top;
    scaleZone.minMovementY = scaleZone.maxMovementY - options.verticalGap;
  }

  if (eventData.vDirection === CropVDirection.Bottom) {
    scaleZone.minMovementY = baseConfig.react.container.bottom - options.verticalGap - baseConfig.react.cropBox.bottom;
    scaleZone.maxMovementY = scaleZone.minMovementY + options.verticalGap;
  }

  return scaleZone;
}
// endregion

import { CropOptions } from './crop.model';
import { Animation, Dom } from '@elemix/core';
import { getCropZoneConfig } from './crop-resize-zone-config';
import {
  CropBaseConfig,
  CropConfigRect,
  CropConfigTransform,
  CropElements,
  CropElementsEventData,
  CropHDirection,
  CropVDirection,
  CropZoneConfig,
} from './crop.internal-model';

// region PUBLIC
export function getCropBaseConfig(elements: CropElements, options: CropOptions, eventData: CropElementsEventData): CropBaseConfig {
  const react: CropConfigRect = {
    container: new Dom(elements.container).getBoundingClientRect(),
    cropBox: new Dom(elements.cropBox).getBoundingClientRect(),
    image: new Dom(elements.image).getBoundingClientRect(),
  };

  const transform: CropConfigTransform = {
    cropBox: Animation.getOrCreateInstance(elements.cropBox).value.transform,
    image: Animation.getOrCreateInstance(elements.image).value.transform,
    backdropWrapper: Animation.getOrCreateInstance(elements.backdropWrapper).value.transform,
  };

  const { clientXDelta, clientYDelta } = getClientDelta(eventData);
  const { documentXDelta, documentYDelta } = getDocumentDelta();

  const tmpBaseConfig = { react, transform } as CropBaseConfig;
  const cropZoneConfig = getCropZoneConfig(tmpBaseConfig, elements, options, eventData);

  const { endScaleX, scaleFactorX } = getScaleX(eventData, options, cropZoneConfig, react, transform);
  const { endScaleY, scaleFactorY } = getScaleY(eventData, options, cropZoneConfig, react, transform);

  return {
    react,
    transform,
    hDirection: eventData.hDirection,
    vDirection: eventData.vDirection,
    clientXDelta,
    clientYDelta,
    documentXDelta,
    documentYDelta,

    endScaleX,
    endScaleY,

    scaleFactorX,
    scaleFactorY,
  };
}
// endregion

// region HELPERS
function getDocumentDelta() {
  const htmlStyle = window.getComputedStyle(document.documentElement);
  const bodyStyle = window.getComputedStyle(document.body);

  const documentXDelta =
    parseInt(htmlStyle.marginLeft) + parseInt(bodyStyle.marginLeft) + parseInt(htmlStyle.paddingLeft) + parseInt(bodyStyle.paddingLeft);
  const documentYDelta =
    parseInt(htmlStyle.marginTop) + parseInt(bodyStyle.marginTop) + parseInt(htmlStyle.paddingTop) + parseInt(bodyStyle.paddingTop);

  return { documentXDelta, documentYDelta };
}

function getClientDelta(eventData: CropElementsEventData) {
  const currentTargetRect = (eventData.event.event.currentTarget as HTMLElement).getBoundingClientRect();

  const halfTargetWidth = currentTargetRect.width / 2;
  const halfTargetHeight = currentTargetRect.height / 2;

  const clientXDelta = currentTargetRect.left + halfTargetWidth - eventData.event.clientX;
  const clientYDelta = currentTargetRect.top + halfTargetHeight - eventData.event.clientY;

  return { clientXDelta, clientYDelta };
}

function getScaleX(
  eventData: CropElementsEventData,
  options: CropOptions,
  zoneConfig: CropZoneConfig,
  react: CropConfigRect,
  transform: CropConfigTransform
) {
  if (eventData.hDirection === CropHDirection.Left) {
    const totalGap = options.horizontalGap * 2;
    const imageOutsideLeft = -transform.image.x - -(zoneConfig.bothSideZone.minMovementX * 2);
    const cropBoxMaxWidth = react.container.width - totalGap;
    const endScaleX = transform.image.scale * (cropBoxMaxWidth / (cropBoxMaxWidth + imageOutsideLeft));
    const scaleFactorX = (transform.image.scale - endScaleX) / (zoneConfig.scaleZone.minMovementX - zoneConfig.bothSideZone.minMovementX);

    return { endScaleX, scaleFactorX };
  }

  if (eventData.hDirection === CropHDirection.Right) {
    const totalGap = options.horizontalGap * 2;
    const totalMinMovement = -zoneConfig.bothSideZone.minMovementX * 2;
    const imageOutsideRight = react.image.width - -transform.image.x - react.cropBox.width - totalMinMovement;
    const cropBoxMaxWidth = react.container.width - totalGap;
    const endScaleX = transform.image.scale * (cropBoxMaxWidth / (react.cropBox.width + imageOutsideRight));
    const scaleFactorX = (transform.image.scale - endScaleX) / (zoneConfig.scaleZone.maxMovementX - zoneConfig.bothSideZone.maxMovementX);

    return { endScaleX, scaleFactorX };
  }

  return {
    endScaleX: transform.image.scale,
    scaleFactorX: 1,
  };
}

function getScaleY(
  eventData: CropElementsEventData,
  options: CropOptions,
  zoneConfig: CropZoneConfig,
  react: CropConfigRect,
  transform: CropConfigTransform
) {
  if (eventData.vDirection === CropVDirection.Top) {
    const totalGap = options.verticalGap * 2;
    const totalMinMovement = -zoneConfig.bothSideZone.minMovementY * 2;
    const imageOutsideTop = -transform.image.y - totalMinMovement;
    const cropBoxMaxHeight = react.container.height - totalGap;
    const endScaleY = transform.image.scale * (cropBoxMaxHeight / (cropBoxMaxHeight + imageOutsideTop));
    const scaleFactorY = (transform.image.scale - endScaleY) / (zoneConfig.scaleZone.minMovementY - zoneConfig.bothSideZone.minMovementY);

    return { endScaleY, scaleFactorY };
  }

  if (eventData.vDirection === CropVDirection.Bottom) {
    const totalGap = options.verticalGap * 2;
    const totalMinMovement = -zoneConfig.bothSideZone.minMovementY * 2;
    const imageOutsideBottom = react.image.height - -transform.image.y - react.cropBox.height - totalMinMovement;
    const cropBoxMaxHeight = react.container.height - totalGap;
    const endScaleY = transform.image.scale * (cropBoxMaxHeight / (react.cropBox.height + imageOutsideBottom));
    const scaleFactorY = (transform.image.scale - endScaleY) / (zoneConfig.scaleZone.maxMovementY - zoneConfig.bothSideZone.maxMovementY);

    return { endScaleY, scaleFactorY };
  }

  return {
    endScaleY: transform.image.scale,
    scaleFactorY: 1,
  };
}
// endregion

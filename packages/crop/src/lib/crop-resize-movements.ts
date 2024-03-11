import { clamp } from '@elemix/core';
import {
  CropBaseConfig,
  CropDragMovementConfig,
  CropElementsEventDataOnDrag,
  CropHDirection,
  CropVDirection,
  CropZone,
  CropZoneConfig,
} from './crop.internal-model';

// region PUBLIC
export function getCropDragMovements(
  baseConfig: CropBaseConfig,
  zoneConfig: CropZoneConfig,
  eventData: CropElementsEventDataOnDrag
): CropDragMovementConfig {
  const xZone = getXZone(baseConfig, zoneConfig, eventData);
  const yZone = getYZone(baseConfig, zoneConfig, eventData);

  const movementXInZone = getMovementXInZone(baseConfig, zoneConfig, xZone, eventData.event.movementXFromPress);
  const movementYInZone = getMovementYInZone(baseConfig, zoneConfig, yZone, eventData.event.movementYFromPress);

  const clientX = eventData.event.clientX + baseConfig.clientXDelta;
  const clientY = eventData.event.clientY + baseConfig.clientYDelta;

  const offsetXInContainer = clientX - baseConfig.react.container.left;
  const offsetYInContainer = clientY - baseConfig.react.container.top;

  return { xZone, yZone, movementXInZone, movementYInZone, offsetXInContainer, offsetYInContainer, clientX, clientY };
}
// endregion

// region HELPERS
function getXZone(baseConfig: CropBaseConfig, zoneConfig: CropZoneConfig, eventData: CropElementsEventDataOnDrag): CropZone | null {
  if (baseConfig.hDirection === null) {
    return null;
  }

  // Single Side
  if (
    (baseConfig.hDirection === CropHDirection.Left && eventData.event.movementXFromPress >= zoneConfig.singleSideZone.minMovementX) ||
    (baseConfig.hDirection === CropHDirection.Right && eventData.event.movementXFromPress <= zoneConfig.singleSideZone.maxMovementX)
  ) {
    return CropZone.SingleSide;
  }

  // Both Side
  if (
    zoneConfig.bothSideZone.minMovementX < eventData.event.movementXFromPress &&
    eventData.event.movementXFromPress <= zoneConfig.bothSideZone.maxMovementX
  ) {
    return CropZone.BothSide;
  }

  // Scale
  if (
    (baseConfig.hDirection === CropHDirection.Left && eventData.event.movementXFromPress < zoneConfig.scaleZone.maxMovementX) ||
    (baseConfig.hDirection === CropHDirection.Right && eventData.event.movementXFromPress > zoneConfig.scaleZone.minMovementX)
  ) {
    return CropZone.Scale;
  }

  return null;
}

function getYZone(baseConfig: CropBaseConfig, zoneConfig: CropZoneConfig, eventData: CropElementsEventDataOnDrag): CropZone | null {
  if (baseConfig.vDirection === null) {
    return null;
  }

  // Single Side
  if (
    (baseConfig.vDirection === CropVDirection.Top && eventData.event.movementYFromPress >= zoneConfig.singleSideZone.minMovementY) ||
    (baseConfig.vDirection === CropVDirection.Bottom && eventData.event.movementYFromPress <= zoneConfig.singleSideZone.maxMovementY)
  ) {
    return CropZone.SingleSide;
  }

  // Both Side
  if (
    zoneConfig.bothSideZone.minMovementY < eventData.event.movementYFromPress &&
    eventData.event.movementYFromPress <= zoneConfig.bothSideZone.maxMovementY
  ) {
    return CropZone.BothSide;
  }

  // Scale
  if (
    (baseConfig.vDirection === CropVDirection.Top && eventData.event.movementYFromPress < zoneConfig.scaleZone.maxMovementY) ||
    (baseConfig.vDirection === CropVDirection.Bottom && eventData.event.movementYFromPress > zoneConfig.scaleZone.minMovementY)
  ) {
    return CropZone.Scale;
  }

  return null;
}

function getMovementXInZone(baseConfig: CropBaseConfig, zoneConfig: CropZoneConfig, xZone: CropZone | null, movementX: number): number {
  if (xZone === CropZone.SingleSide) {
    return baseConfig.hDirection === CropHDirection.Left
      ? Math.min(movementX, zoneConfig.singleSideZone.maxMovementX)
      : Math.max(movementX, zoneConfig.singleSideZone.minMovementX);
  }

  if (xZone === CropZone.BothSide) {
    return clamp(movementX, [zoneConfig.bothSideZone.minMovementX, zoneConfig.bothSideZone.maxMovementX]);
  }

  if (xZone === CropZone.Scale) {
    return baseConfig.hDirection === CropHDirection.Left
      ? Math.max(movementX - zoneConfig.scaleZone.maxMovementX, zoneConfig.scaleZone.minMovementX - zoneConfig.scaleZone.maxMovementX)
      : Math.min(movementX - zoneConfig.scaleZone.minMovementX, zoneConfig.scaleZone.maxMovementX - zoneConfig.scaleZone.minMovementX);
  }

  return 0;
}

function getMovementYInZone(baseConfig: CropBaseConfig, zoneConfig: CropZoneConfig, yZone: CropZone | null, movementY: number): number {
  if (yZone === CropZone.SingleSide) {
    return baseConfig.vDirection === CropVDirection.Top
      ? Math.min(movementY, zoneConfig.singleSideZone.maxMovementY)
      : Math.max(movementY, zoneConfig.singleSideZone.minMovementY);
  }

  if (yZone === CropZone.BothSide) {
    return clamp(movementY, [zoneConfig.bothSideZone.minMovementY, zoneConfig.bothSideZone.maxMovementY]);
  }

  if (yZone === CropZone.Scale) {
    return baseConfig.vDirection === CropVDirection.Top
      ? Math.max(movementY - zoneConfig.scaleZone.maxMovementY, zoneConfig.scaleZone.minMovementY - zoneConfig.scaleZone.maxMovementY)
      : Math.min(movementY - zoneConfig.scaleZone.minMovementY, zoneConfig.scaleZone.maxMovementY - zoneConfig.scaleZone.minMovementY);
  }

  return 0;
}
// endregion

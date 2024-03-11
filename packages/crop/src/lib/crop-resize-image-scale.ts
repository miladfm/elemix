import { clamp } from '@elemix/core';
import { CropBaseConfig, CropDragMovementConfig, CropZone } from './crop.internal-model';

// region PUBLIC
export function getImageScale(baseConfig: CropBaseConfig, movementConfig: CropDragMovementConfig) {
  if (movementConfig.xZone !== CropZone.Scale && movementConfig.yZone !== CropZone.Scale) {
    return baseConfig.transform.image.scale;
  }

  const scaleZoneMovementX = movementConfig.xZone === CropZone.Scale ? movementConfig.movementXInZone : 0;
  const scaleZoneMovementY = movementConfig.yZone === CropZone.Scale ? movementConfig.movementYInZone : 0;
  const totalMovementInZone = scaleZoneMovementX + scaleZoneMovementY;

  const scaleX = baseConfig.scaleFactorX * scaleZoneMovementX;
  const scaleY = baseConfig.scaleFactorY * scaleZoneMovementY;
  const scaleFactor = (scaleX + scaleY) / totalMovementInZone;

  const movementScale = totalMovementInZone * scaleFactor;
  const unboundedScale = baseConfig.transform.image.scale - movementScale;
  const endScale = Math.min(baseConfig.endScaleX, baseConfig.endScaleY);
  const scale = clamp(unboundedScale, [endScale, baseConfig.transform.image.scale]);

  return scale;
}

// endregion

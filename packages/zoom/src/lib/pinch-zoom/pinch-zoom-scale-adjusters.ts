import { ZoomAdjusterConfig, ZoomAdjusterResult } from '../zoom.model';
import { AllPropsNonNullable, getBounceEffectValue, isNullish } from '@elemix/core';
import { getZoomTranslationDelta } from '../zoom.util';

export function pinchZoomScaleAdjusters(next: ZoomAdjusterResult, config: AllPropsNonNullable<ZoomAdjusterConfig>): ZoomAdjusterResult {
  if (isNullish(config.event.scaleFactorFromStart)) {
    return next;
  }

  // Scale
  const pinchScale = config.translateOnStart.scale * config.event.scaleFactorFromStart;
  const scale = getBounceEffectValue(pinchScale, config.minScale, config.maxScale, config.option.bounceFactor);

  // x, y
  const startCenterOffset = { x: config.startEvent.centerOffsetX, y: config.startEvent.centerOffsetY };
  const translationDelta = getZoomTranslationDelta(scale, config.translateOnStart.scale, startCenterOffset);
  const x = config.translateOnStart.x + config.event.centerMovementXFromStart! + translationDelta.x;
  const y = config.translateOnStart.y + config.event.centerMovementYFromStart! + translationDelta.y;

  return { scale, x, y };
}

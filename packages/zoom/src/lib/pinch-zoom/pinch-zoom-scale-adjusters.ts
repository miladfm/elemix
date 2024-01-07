import { ZoomAdjusterConfig, ZoomAdjusterResult } from '../zoom.model';

export function pinchZoomScaleAdjuster(next: ZoomAdjusterResult, config: ZoomAdjusterConfig): ZoomAdjusterResult {
  if (!config.event.scaleFactorFromPress || !config.event.centerMovementXFromPress || !config.event.centerMovementYFromPress) {
    return next;
  }

  const translationDelta = getPinchZoomTranslationDelta(
    config.event.scaleFactorFromPress,
    config.event.centerClientX,
    config.event.centerClientY
  );

  const scale = config.translateOnStart.scale * config.event.scaleFactorFromPress;
  const x = config.translateOnStart.x + config.event.centerMovementXFromPress + translationDelta.x;
  const y = config.translateOnStart.y + config.event.centerMovementYFromPress + translationDelta.y;

  return { x, y, scale };
}

/**
 * Calculate the movement of the element based on the pinch center and scale change.
 * The goal is to adjust the element's position so that the pinch center remains visually stationary during scaling.
 *
 * This creates a natural zoom effect centered around the user's fingers
 * 'centerClientX' and 'centerY' are the positions of the pinch center before scaling.
 * The term 'scaledCenterClientX' or '(centerClientX * scaleFactorFromStart)' calculates the new position of the pinch center after scaling.
 * By subtracting this new position from the original 'centerClientX', we find the distance the center has moved due to scaling
 *
 * However, since scaling is around the transform origin, the movement is effectively doubled.
 * Dividing by 2 corrects this, yielding the actual distance to translate the element.
 * This ensures that the scaling origin aligns with the center of the fingers.
 */
function getPinchZoomTranslationDelta(scaleFactor: number, centerClientX: number, centerClientY: number) {
  const scaledCenterClientX = centerClientX * scaleFactor;
  const scaledCenterClientY = centerClientY * scaleFactor;

  const x = (centerClientX - scaledCenterClientX) / 2;
  const y = (centerClientY - scaledCenterClientY) / 2;

  return { x, y };
}

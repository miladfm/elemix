export function clamp(value: number, [minBound, maxBound]: [number, number]): number {
  return Math.max(minBound, Math.min(value, maxBound));
}

export function average(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Number(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)).toFixed(2));
}

/**
 * Calculates the value with a bounce effect when it exceeds specified boundaries.
 */
export function getBounceEffectValue(value: number, min: number, max: number, bounceFactor: number): number {
  /**
   * 'bounceIntensity' determines how strong the bounce effect is.
   * It's a multiplier for the distance the element has moved beyond the boundary,
   * dictating how far back it will "bounce".
   *
   * Value Close to 1: Results in a stronger bounce,
   *    making the element move further away from the boundary after hitting it.
   * Value Close to 0: Leads to a weaker bounce,
   *    causing the element to move only slightly away from the boundary.
   *
   * Example:
   * - If the bounceIntensity is set to 1, and the element goes 10 pixels beyond the boundary,
   *   it will bounce back 10 pixels.
   * - If the bounceIntensity is 0.5, for the same 10 pixels beyond the boundary,
   *   the bounce back will be 5 pixels (50% of the overshoot).
   */
  const bounceIntensity = bounceFactor; // Adjust this for stronger/weaker bounce

  /**
   * 'dampeningFactor' controls how quickly the bouncing motion decreases over time.
   * It's applied to the bounce effect in each iteration to gradually reduce
   * the distance the element bounces back.
   *
   * Value Close to 1: The bouncing effect diminishes slowly.
   *    The element continues to bounce back and forth for a longer period.
   * Value Close to 0: The bouncing effect diminishes quickly.
   *    The element quickly settles and stops bouncing.
   *
   * Example:
   * - Suppose the dampeningFactor is 0.9, and the initial bounce is 10 pixels.
   *   In the next iteration, the bounce would be 0.9 * 10 = 9 pixels, then 0.9 * 9 = 8.1 pixels, and so on.
   * - If the dampeningFactor is 0.5, starting with a 10-pixel bounce,
   *   the next bounce would be only 0.5 * 10 = 5 pixels, then 0.5 * 5 = 2.5 pixels,
   *   reducing the bounce much more rapidly.
   */
  const dampeningFactor = bounceFactor; // Adjust this for quicker/slower dampening

  const isBeyondMinBoundary = value < min;
  const isBeyondMaxBoundary = value > max;

  if (!isBeyondMaxBoundary && !isBeyondMinBoundary) {
    return value;
  }

  const boundaryDelta = isBeyondMaxBoundary ? value - max : min - value;
  const adjustedBounce = dampeningFactor * boundaryDelta * bounceIntensity;
  return isBeyondMaxBoundary ? value - adjustedBounce : value + adjustedBounce;
}

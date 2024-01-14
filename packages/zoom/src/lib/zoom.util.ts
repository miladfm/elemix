import { Coordinate } from '@elemix/core';

/**
 * Calculates the translation offset required to maintain a stationary pinch center during scaling.
 * This function plays a crucial role in creating a zoom effect that is both natural and centered around the user's pinch gesture.
 *
 * The function performs the following steps:
 * 1- Identifying the translation origin, which is the pinch center ('centerOffset'). This origin point,
 *   representing the center of pointer events at the start of zooming, should remain constant throughout the zoom process.
 *   Keeping this origin unchanged is vital; any alterations during zooming can cause the element to shift unexpectedly,
 *   leading to a jarring user experience.
 * 2- Calculating the scale change. This is achieved by comparing the new scale ('scale') with the initial scale at the start of zooming ('scaleOnStart').
 *   The scale change reflects how much the element has been zoomed in or out relative to its initial state.
 * 3- Computing the translation offset. This offset is essential for ensuring the pinch center remains stationary as the scale changes.
 *   It is determined by multiplying the negative of the scale change with the coordinates of the translation origin.
 *   This calculation ensures that the zoom effect is anchored around the pinch center, providing a smooth and intuitive user interaction.
 *
 * Through these steps, the function effectively maintains the focal point of the zoom, enhancing the natural feel and responsiveness of the scaling action.
 */
export function getZoomTranslationDelta(scale: number, scaleOnStart: number, centerOffset: Coordinate) {
  const scaleChange = scale - scaleOnStart;
  const x = -(centerOffset.x * scaleChange);
  const y = -(centerOffset.y * scaleChange);

  return { x, y };
}

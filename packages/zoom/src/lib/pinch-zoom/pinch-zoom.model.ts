import { DomSelector } from '@elemix/core';

export interface PinchZoomOptions {
  /**
   * The minimum number of events required to start the pinch zoom process.
   */
  minEventThreshold: number;

  /**
   * The `minScale` defines the smallest zoom level the element can reach.
   */
  minScale: number | PinchZoomBoundary;

  /**
   * The `maxScale` sets the largest zoom level for the element.
   */
  maxScale: number | PinchZoomBoundary;

  /**
   * The `bounceFactor` is a unified parameter that controls the bounce effect when the element
   * reaches the min or max zoom. It ranges from 0 to 1, where 1 means no bounce effect, and 0
   * represents the maximum bounce effect.
   *
   * The `bounceFactor` influences both the intensity of the initial bounce and the rate at which
   * the bounce dampens over time. A lower value results in a more pronounced initial bounce
   * and a slower dampening, leading to a longer-lasting bounce effect. Conversely, a higher value
   * results in a subtler bounce and quicker settling.
   *
   * @default 0.9 - No bounce effect
   */
  bounceFactor: number;
}

export interface PinchZoomBoundary {
  element: DomSelector;
  /**
   * Defines the type of boundary constraints applied during pinch zoom interactions, dictating how the zoomable element
   * interacts with the specified boundary.
   * This setting influences the scaling behavior of the element within its boundary.
   * If `minScale` is a number, then `boundaryType` will not affect the minimum scale;
   * similarly, the same applies to `maxScale`.
   * The default value is 'Auto'.
   */
  boundaryType: PinchZoomBoundaryType;
}

/**
 * Defines the type of boundary constraints applied during pinch zoom interactions, dictating how the zoomable element
 * interacts with the specified boundary. This setting influences the scaling behavior of the element within its boundary.
 */
export enum PinchZoomBoundaryType {
  /**
   * Chosen when the zoomable element is smaller than the boundary.
   * It limits zoom so that
   * the element cannot scale beyond the boundary.
   * This is particularly useful when the zoomable element and the boundary
   * have different aspect ratios.
   * The smaller scale ratio between width and height is used, ensuring the element always
   * remains within the boundary.
   * Additionally, the element cannot be moved outside the boundary during pinch zoom movements,
   * even when the user moves two fingers to pan the element while zooming.
   */
  Inner = 'inner',

  /**
   * Applicable when the zoomable element is larger than the boundary. It ensures that the zoomable element
   * does not scale in a way that the boundary is exceeded. This is especially relevant when there is a discrepancy in
   * aspect ratios between the zoomable element and the boundary. Scaling is limited to the axis where the zoomable element
   * is larger than the boundary, and movement is constrained to prevent the boundary from exiting the confines of the zoomable element
   * during pinch zoom actions.
   */
  Outer = 'outer',

  /**
   * Chooses between 'Inner' and 'Outer' based on the size comparison of the zoomable and boundary elements.
   * It applies the most suitable scale constraints for each axis, considering whether the zoomable is larger or smaller
   * than the boundary in both horizontal and vertical dimensions. For example, if the height of the element is larger than the boundary
   * but the width is smaller, the minimum scale is calculated to ensure the height of the element does not become smaller than the height of the boundary,
   * and the maximum scale is determined so that the width of the element does not exceed the width of the boundary. This mode ensures that during pinch zoom interactions,
   * the zoomable element is appropriately scaled and moved, maintaining its position within the boundary while considering its size relative to the boundary.
   */
  Auto = 'auto',
}

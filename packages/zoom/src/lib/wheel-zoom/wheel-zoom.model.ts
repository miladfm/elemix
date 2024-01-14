export interface WheelZoomOptions {
  /**
   * The `minScale` defines the smallest zoom level the element can reach.
   * @default 0
   */
  minScale: number;

  /**
   * The `maxScale` sets the largest zoom level for the element.
   * @default 10
   */
  maxScale: number;

  /**
   * The `wheelDeltaFactor` determines the sensitivity of zooming when the mouse ot touchpad wheel is used.
   * @default 0.01
   */
  wheelDeltaFactor: number;
}

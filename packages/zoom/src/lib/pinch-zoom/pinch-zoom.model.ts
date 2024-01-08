export interface PinchZoomOptions {
  // minMovementToStartPinch: number;
  /**
   * The `minZoom` defines the smallest zoom level the element can reach.
   * It determines the minimum scale at which the element is displayed.
   */
  minScale: number;

  /**
   * The `maxZoom` sets the largest zoom level for the element.
   * It specifies the maximum scale at which the element can be displayed.
   */
  maxScale: number;
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
  // boundElem: HTMLElement | null;
}

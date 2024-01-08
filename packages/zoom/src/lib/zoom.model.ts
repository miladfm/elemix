import { TransformProperty, ZoomGesturesEvent } from '@elemix/core';
import { PinchZoomOptions } from './pinch-zoom/pinch-zoom.model';

export interface ZoomAdjusterResult {
  scale: number;
  x: number;
  y: number;
}

export interface ZoomAdjusterConfig {
  startEvent: ZoomGesturesEvent;
  translateOnStart: TransformProperty;
  event: ZoomGesturesEvent;
  option: PinchZoomOptions;
}

export type ZoomAdjuster = (next: ZoomAdjusterResult, config: ZoomAdjusterConfig) => ZoomAdjusterResult;

/**
 * Hooks providing customizable behavior at different stages of a pinch-zoom operation.
 * These functions allow for additional processing or side effects in response to pinch-zoom events.
 */
export interface ZoomAdjusterHooks {
  /**
   * Called when the pinch-zoom gesture is initially detected, typically on a mousedown or touchstart event.
   * This hook allows for preliminary processing or setup when the user first interacts with the pinch-zoom element.
   */
  // onPress?(event: ZoomGesturesEvent, option?: PinchZoomOptions): void;
  //
  // /**
  //  * Called when the pinch-zoom operation officially starts, usually after the element has moved beyond a certain threshold.
  //  * This hook is useful for setting up state or performing actions that are specific to the start of a pinch-zoom motion.
  //  */
  // onStart?(event: ZoomGesturesEvent, option?: PinchZoomOptions): void;

  /**
   * The core function that adjusts the position of the element.
   * This function is called repeatedly during the pinch-zoom operation and is responsible for calculating the new position of the element based on the pinch-zoom events and configuration.
   */
  adjuster(next: ZoomAdjusterResult, config: ZoomAdjusterConfig): ZoomAdjusterResult;
  //
  // /**
  //  * Called when the pinch-zoom operation is ending, typically on a mouseup or touchend event.
  //  * This hook is useful for performing cleanup or finalization tasks at the end of a pinch-zoom.
  //  */
  // onEnd?(event: ZoomGesturesEvent, option?: PinchZoomOptions): void;
  //
  // /**
  //  * Called when the user releases the element, signaling the completion of the pinch-zoom operation.
  //  * This hook differs from `onEnd` in that it specifically handles the release action, which may involve additional considerations like dropping the element onto a target.
  //  */
  // onRelease?(event: ZoomGesturesEvent, option?: PinchZoomOptions): void;
}

import { Coordinate, DomSelector, DragGesturesEvent, TransformProperty } from '@elemix/core';

export interface DragOptions {
  /**
   * Specifies the axis of movement for the draggable element, dictating whether the element
   * is allowed to move horizontally, vertically, or both.
   */
  movementDirection: MovementDirection;

  /**
   * If provided, these settings define the constraints and behavior
   * of the draggable element in relation to a specified boundary.
   */
  boundary?: DragBoundary;

  /**
   * The minimum movements in pixels that the draggable element must be moved
   *
   * @default 1
   */
  minMovements: number;
}

/**
 * Test document Test document Test document Test document Test document Test document Test document Test document Test document Test document Test document Test document Test document Test document
 */
export interface DragBoundary {
  /**
   * Identifies the boundary element. This element is the reference within which or around which
   * the draggable element's movement is constrained.
   */
  elem: DomSelector;

  /**
   * Defines the type of boundary constraints applied to the draggable element, dictating how the element interacts
   * with the specified boundary.
   * The default value is 'Auto'
   */
  type?: DragBoundaryType;

  /**
   * The `bounceFactor` is a unified parameter that controls the bounce effect when the element
   * reaches the boundary. It ranges from 0 to 1, where 1 means no bounce effect, and 0
   * represents the maximum bounce effect.
   *
   * The `bounceFactor` influences both the intensity of the initial bounce and the rate at which
   * the bounce dampens over time. A lower value results in a more pronounced initial bounce
   * and a slower dampening, leading to a longer-lasting bounce effect. Conversely, a higher value
   * results in a subtler bounce and quicker settling.
   *
   * @default 1 - No bounce effect
   */
  bounceFactor?: number;
}

export enum MovementDirection {
  /**
   * Determines whether the drag movement is locked to a single axis. When set to true,
   * if the initial drag movement starts in a horizontal direction, any vertical movement is ignored, and the same applies in reverse for vertical starts.
   */
  Lock = 'lock',

  /**
   * Allows drag movement in both horizontal and vertical directions without restriction.
   */
  Both = 'both',

  /**
   * Restricts drag movement to only the horizontal axis.
   */
  Horizontal = 'horizontal',

  /**
   * Restricts drag movement to only the vertical axis.
   */
  Vertical = 'vertical',
}

/**
 * Defines the type of boundary constraints applied to the draggable element, dictating how the element interacts
 * with the specified boundary.
 */
export enum DragBoundaryType {
  /**
   * Applies when the draggable element is smaller than the boundary. It restricts movement so that
   * the draggable cannot go outside the boundary. This is particularly relevant when the dimensions of the draggable
   * and boundary differ significantly, allowing movement only along the axis where the draggable is smaller.
   */
  Inner = 'inner',

  /**
   * Used when the draggable element is larger than the boundary. It ensures that the draggable element
   * does not move in such a way that the boundary exits its confines. This typically restricts movement to the axis
   * where the draggable element exceeds the boundary's size.
   */
  Outer = 'outer',

  /**
   * Selects between 'Inner' and 'Outer' based on the size comparison of the draggable and boundary elements.
   * It applies the most appropriate constraints for each axis, taking into account whether the draggable is larger or smaller
   * than the boundary in the horizontal and vertical dimensions.
   */
  Auto = 'auto',
}

/**
 * Hooks providing customizable behavior at different stages of a drag operation.
 * These functions allow for additional processing or side effects in response to drag events.
 */
export interface DragPositionAdjusterHooks {
  /**
   * Called when the drag gesture is initially detected, typically on a mousedown or touchstart event.
   * This hook allows for preliminary processing or setup when the user first interacts with the draggable element.
   */
  onPress?(event: DragGesturesEvent, option?: DragOptions): void;

  /**
   * Called when the drag operation officially starts, usually after the draggable element has moved beyond a certain threshold.
   * This hook is useful for setting up state or performing actions that are specific to the start of a drag motion.
   */
  onStart?(event: DragGesturesEvent, option?: DragOptions): void;

  /**
   * The core function that adjusts the position of the draggable element.
   * This function is called repeatedly during the drag operation and is responsible for calculating the new position of the element based on the drag events and configuration.
   */
  adjuster(nextPosition: Coordinate, config?: DragPositionAdjusterConfig): Coordinate;

  /**
   * Called when the drag operation is ending, typically on a mouseup or touchend event.
   * This hook is useful for performing cleanup or finalization tasks at the end of a drag.
   */
  onEnd?(event: DragGesturesEvent, option?: DragOptions): void;

  /**
   * Called when the user releases the draggable element, signaling the completion of the drag operation.
   * This hook differs from `onEnd` in that it specifically handles the release action, which may involve additional considerations like dropping the element onto a target.
   */
  onRelease?(event: DragGesturesEvent, option?: DragOptions): void;
}

export interface DragPositionAdjusterConfig {
  translateOnStart: TransformProperty;
  pressEvent: DragGesturesEvent;
  startEvent: DragGesturesEvent;
  event: DragGesturesEvent;
  option: DragOptions;
}

export type DragPositionAdjuster = (nextPosition: Coordinate, config: DragPositionAdjusterConfig) => Coordinate;

export interface DragBoundaryRange {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

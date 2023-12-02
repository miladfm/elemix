import { Coordinate, DomSelector, DragGesturesEvent, TransformProperty } from '@elemix/core';

export interface DragOptions {
  /**
   * Specifies the axis of movement for the draggable element, dictating whether the element
   * is allowed to move horizontally, vertically, or both.
   */
  movementDirection: MovementDirection;

  /**
   * Defines the type of boundary constraints applied to the draggable element, dictating how the element interacts
   * with the specified boundary.
   */
  boundaryType: DragBoundaryType;

  /**
   * Identifies the boundary element. This element is the reference within which or around which
   * the draggable element's movement is constrained.
   */
  boundaryElem: DomSelector | null;

  /**
   * Specifies the interaction behavior when the draggable element reaches the boundary.
   */
  boundaryInteraction: BoundaryInteraction;
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

export enum BoundaryInteraction {
  /**
   * Immediately stops the dragging action when the draggable element reaches its boundary.
   * The element will not move beyond the boundary even if the mouse continues to drag.
   */
  Stop = 'stop',

  /**
   * Allows the draggable element to exhibit a bounce effect upon reaching the boundary.
   * Dragging can continue, but the element moves only slightly based on the pointer distance from the boundary
   * and snaps back to the boundary edge once the dragging ends.
   */
  BounceEffect = 'bounceEffect',
}

export enum DragBoundaryType {
  /**
   * Implies no constraints on movement, allowing the draggable element to move freely without regard to any boundary.
   */
  None = 'none',

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

export interface DragPositionAdjusterConfig {
  translateOnStart: TransformProperty;
  pressEvent: DragGesturesEvent;
  startEvent: DragGesturesEvent;
  event: DragGesturesEvent;
  option: DragOptions;
}

export type DragPositionAdjuster = (nextPosition: Coordinate, config: DragPositionAdjusterConfig) => Coordinate;

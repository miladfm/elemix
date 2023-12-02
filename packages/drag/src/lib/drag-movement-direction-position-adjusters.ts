import { Axis, Coordinate } from '@elemix/core';
import { DragPositionAdjusterConfig, MovementDirection } from './drag.model';

export function movementDirectionPositionAdjuster(nextPosition: Coordinate, config: DragPositionAdjusterConfig): Coordinate {
  switch (config.option.movementDirection) {
    case MovementDirection.Lock:
      return getMovementRestriction(config) === Axis.Horizontal
        ? { ...nextPosition, y: config.translateOnStart.y }
        : { ...nextPosition, x: config.translateOnStart.x };

    case MovementDirection.Horizontal:
      return { ...nextPosition, y: config.translateOnStart.y };

    case MovementDirection.Vertical:
      return { ...nextPosition, x: config.translateOnStart.x };

    default:
      return nextPosition;
  }
}

function getMovementRestriction(config: DragPositionAdjusterConfig): Axis {
  const xMovement = Math.abs(config.pressEvent.pageX - config.startEvent.pageX);
  const yMovement = Math.abs(config.pressEvent.pageY - config.startEvent.pageY);

  return xMovement > yMovement ? Axis.Horizontal : Axis.Vertical;
}

import { Coordinate } from '@elemix/core';
import { DragPositionAdjusterConfig } from './drag.model';

export function basicPositionAdjuster(nextPosition: Coordinate, config: DragPositionAdjusterConfig): Coordinate {
  if (config.event.movementXFromStart === null || config.event.movementYFromStart === null) {
    return nextPosition;
  }

  return {
    x: config.translateOnStart.x + config.event.movementXFromStart,
    y: config.translateOnStart.y + config.event.movementYFromStart,
  };
}

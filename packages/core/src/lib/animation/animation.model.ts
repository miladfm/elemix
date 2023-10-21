import { Coordinate } from '../common/common.model';

export interface TransformProperty extends Coordinate {
  scale: number;
  scaleX?: number;
  scaleY?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export interface AnimationProperties {
  transform: TransformProperty;
  dimension: Dimension;
  opacity: number;
}

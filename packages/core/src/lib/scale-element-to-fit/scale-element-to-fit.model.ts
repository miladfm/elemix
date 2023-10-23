import { Coordinates, DimensionalGap, Dimensions } from '../common/common.model';
import { Dom } from '../dom/dom';

export type TargetSelector = HTMLImageElement | HTMLElement | Dom;
export type ContainerSelector = HTMLElement | Dom;

export enum ScalingMode {
  Cover = 'cover',
  Contain = 'contain',
}

export interface ScalingElement {
  isImage: boolean;
  width: number;
  height: number;
  effectiveWidth: number;
  effectiveHeight: number;
  aspectRatio: number;
}

export interface ScalingOptions {
  gap: DimensionalGap;
  fitType: ScalingMode;
}

export interface ScalingResult {
  scale: number;
  dimensions: Dimensions;
  relativePosition: Coordinates;
}

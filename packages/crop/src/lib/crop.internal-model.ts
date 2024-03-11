import { DragEvent } from '@elemix/drag';
import { Dom, DragGesturesEvent, NonNullableProps, TransformProperty } from '@elemix/core';

export interface CropElements {
  container: Dom;
  wrapper: Dom;
  cropBox: Dom;
  image: Dom;
  grids: Dom;
  backdropWrapper: Dom;
  backdrop: Dom;
}

export interface CropBaseConfig {
  react: CropConfigRect;
  transform: CropConfigTransform;

  hDirection: CropHDirection | null;
  vDirection: CropVDirection | null;

  clientXDelta: number;
  clientYDelta: number;
  documentXDelta: number;
  documentYDelta: number;

  endScaleX: number;
  endScaleY: number;

  scaleFactorX: number;
  scaleFactorY: number;
}

export interface CropZoneConfig {
  singleSideZone: CropConfigBoundaryZone;
  bothSideZone: CropConfigBoundaryZone;
  scaleZone: CropConfigBoundaryZone;
}

export interface CropConfigRect {
  container: DOMRect;
  cropBox: DOMRect;
  image: DOMRect;
}

export interface CropConfigTransform {
  cropBox: TransformProperty;
  image: TransformProperty;
  backdropWrapper: TransformProperty;
}

export interface CropConfigBoundaryZone {
  minMovementX: number;
  maxMovementX: number;
  minMovementY: number;
  maxMovementY: number;
}

export enum CropZone {
  SingleSide = 'single-side-zone',
  BothSide = 'both-side-zone',
  Scale = 'scale-zone',
}

export interface CropDragMovementConfig {
  xZone: CropZone | null;
  yZone: CropZone | null;

  movementXInZone: number;
  movementYInZone: number;

  offsetXInContainer: number;
  offsetYInContainer: number;

  clientX: number;
  clientY: number;
}

export enum CropVDirection {
  Top = 'top',
  Bottom = 'bottom',
}

export enum CropHDirection {
  Left = 'left',
  Right = 'right',
}

export interface CropDomChanges {
  cropBoxWidth: number;
  cropBoxHeight: number;
  cropBoxX: number;
  cropBoxY: number;
  imageScale: number;
  imageX: number;
  imageY: number;
  backdropWrapperScale: number;
  backdropWrapperX: number;
  backdropWrapperY: number;
}

export interface CropElementsEventData extends CropElementsEventDataDirection {
  event: DragGesturesEvent;
}

export type CropElementsEventDataOnDrag = NonNullableProps<CropElementsEventData, 'event'>;

export interface CropElementsEventDataDirection {
  vDirection: CropVDirection | null;
  hDirection: CropHDirection | null;
}

export interface CropDragEvent {
  event: DragEvent;
  transformOnPress: {
    image: TransformProperty;
    backdropWrapper: TransformProperty;
  };
}

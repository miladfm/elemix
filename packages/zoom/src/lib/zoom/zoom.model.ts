import { PinchZoomOptions } from '../pinch-zoom/pinch-zoom.model';
import { ClickZoomOptions } from '../click-zoom/click-zoom.model';
import { WheelZoomOptions } from '../wheel-zoom/wheel-zoom.model';

export interface ZoomOptions {
  pinchZoom: Partial<PinchZoomOptions>;
  clickZoom: Partial<ClickZoomOptions>;
  wheelZoom: Partial<WheelZoomOptions>;

  skipPinchZoom: boolean;
  skipClickZoom: boolean;
  skipWheelZoom: boolean;

  minScale: number;
  maxScale: number;
}

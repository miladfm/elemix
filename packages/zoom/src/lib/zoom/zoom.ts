import { ClickZoom } from '../click-zoom/click-zoom';
import { PinchZoom } from '../pinch-zoom/pinch-zoom';
import { WheelZoom } from '../wheel-zoom/wheel-zoom';
import { Dom, DomSelector, Animation, deepmerge, Coordinate, clamp, isNotNullish } from '@elemix/core';
import { ZoomOptions } from './zoom.model';
import { getZoomTranslationDelta } from '../zoom.util';
import { ClickZoomType } from '../click-zoom/click-zoom.model';

const DEFAULT_CONFIG: ZoomOptions = {
  pinchZoom: {},
  clickZoom: {},
  wheelZoom: {},

  skipPinchZoom: false,
  skipClickZoom: false,
  skipWheelZoom: false,

  minScale: 0.5,
  maxScale: 6,
};

const DEFAULT_SCALE_FACTOR = 1.2;

export class Zoom {
  private _isEnable = false;
  public get isEnable() {
    return this._isEnable;
  }

  private set isEnable(isEnable: boolean) {
    this._isEnable = isEnable;
  }

  private pinchZoom?: PinchZoom;
  private clickZoom?: ClickZoom;
  private wheelZoom?: WheelZoom;

  private readonly element: Dom;
  private readonly animation: Animation;

  private readonly options: ZoomOptions;

  constructor(selector: DomSelector, options: Partial<ZoomOptions> = {}) {
    this.options = deepmerge(DEFAULT_CONFIG, options);

    this.element = new Dom(selector);
    this.animation = Animation.getOrCreateInstance(this.element);

    this.initInstances(selector);
    this.addZoomStyle();
    this.enable();
  }

  private initInstances(selector: DomSelector) {
    // PinchZoom
    if (!this.options.skipPinchZoom) {
      this.pinchZoom = new PinchZoom(selector, {
        ...this.options.pinchZoom,
        minScale: this.options.pinchZoom.minScale ?? this.options.minScale,
        maxScale: this.options.pinchZoom.maxScale ?? this.options.maxScale,
      });
    }

    // ClickZoom
    if (!this.options.skipClickZoom) {
      this.clickZoom = new ClickZoom(selector, {
        ...this.options.clickZoom,
        minScale: this.options.clickZoom.minScale ?? this.options.minScale,
        maxScale: this.options.clickZoom.maxScale ?? this.options.maxScale,
      });
    }

    // WheelZoom
    if (!this.options.skipWheelZoom) {
      this.wheelZoom = new WheelZoom(selector, {
        ...this.options.wheelZoom,
        minScale: this.options.wheelZoom.minScale ?? this.options.minScale,
        maxScale: this.options.wheelZoom.maxScale ?? this.options.maxScale,
      });
    }
  }

  private addZoomStyle() {
    this.element.setStyleImmediately('transformOrigin', '0% 0%');
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.pinchZoom?.enable();
    this.clickZoom?.enable();
    this.wheelZoom?.enable();

    this.isEnable = true;
  }

  public disable() {
    if (!this.isEnable) {
      return;
    }

    this.pinchZoom?.disable();
    this.clickZoom?.disable();
    this.wheelZoom?.disable();

    this.isEnable = false;
  }

  public setClickType(type: ClickZoomType) {
    this.clickZoom?.setClickType(type);
  }

  public destroy() {
    this.pinchZoom?.destroy();
    this.clickZoom?.destroy();
    this.wheelZoom?.destroy();
    // TODO: Don't let the enable method works after destroy
  }

  public zoomIn(config: { scaleFactor?: number; center?: Partial<Coordinate> } = {}) {
    if (!this.isEnable) {
      return;
    }

    const scaleFactor = config.scaleFactor ?? DEFAULT_SCALE_FACTOR;
    const scale = this.animation.value.transform.scale * scaleFactor;
    const clampScale = clamp(scale, [this.options.minScale, this.options.maxScale]);
    const center = this.getCenterTranslate(config.center);
    const transitionDelta = getZoomTranslationDelta(clampScale, this.animation.value.transform.scale, center);
    this.applyZoom(clampScale, transitionDelta);
  }

  public zoomOut(config: { scaleFactor?: number; center?: Partial<Coordinate> } = {}) {
    if (!this.isEnable) {
      return;
    }

    const scaleFactor = config.scaleFactor ?? DEFAULT_SCALE_FACTOR;
    const scale = this.animation.value.transform.scale / scaleFactor;
    const clampScale = clamp(scale, [this.options.minScale, this.options.maxScale]);
    const center = this.getCenterTranslate(config.center);
    const transitionDelta = getZoomTranslationDelta(clampScale, this.animation.value.transform.scale, center);
    this.applyZoom(clampScale, transitionDelta);
  }

  public zoomTo(scale: number, center?: Partial<Coordinate>) {
    if (!this.isEnable) {
      return;
    }

    const clampScale = clamp(scale, [this.options.minScale, this.options.maxScale]);
    const _center = this.getCenterTranslate(center);
    const transitionDelta = getZoomTranslationDelta(clampScale, this.animation.value.transform.scale, _center);
    this.applyZoom(clampScale, transitionDelta);
  }

  private getCenterTranslate(center?: Partial<Coordinate>): Coordinate {
    if (isNotNullish(center?.x) && isNotNullish(center?.y)) {
      return center as Coordinate;
    }

    const elementRect = this.element.getBoundingClientRect();
    return {
      x: center?.x ?? elementRect.width / 2,
      y: center?.y ?? elementRect.height / 2,
    };
  }

  private applyZoom(scale: number, translate: Coordinate) {
    const _scale = Number(scale.toFixed(2));
    const x = this.animation.value.transform.x + Number(translate.x.toFixed(2));
    const y = this.animation.value.transform.y + Number(translate.y.toFixed(2));
    this.animation.setScale(_scale).setTranslate({ x, y }).animate();
  }
}

import { Animation, clamp, Dom, DomType } from '@elemix/core';
import { fromEvent, Subscription } from 'rxjs';
import { getZoomTranslationDelta } from '../zoom.util';
import { WheelZoomOptions } from './wheel-zoom.model';

const DEFAULT_OPTIONS: WheelZoomOptions = {
  minScale: 0,
  maxScale: 10,
  wheelDeltaFactor: 0.01,
};

export class WheelZoom {
  private _isEnable = false;
  public get isEnable() {
    return this._isEnable;
  }

  private set isEnable(isEnable: boolean) {
    this._isEnable = isEnable;
  }

  private readonly options: WheelZoomOptions;
  private readonly element: Dom;
  private readonly animation: Animation;

  private wheelEventSub: Subscription | null = null;

  constructor(selector: DomType, options: Partial<WheelZoomOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.element = new Dom(selector);
    this.animation = Animation.getOrCreateInstance(this.element);

    this.addZoomStyle();
    this.enable();
  }

  private addZoomStyle() {
    this.element.setStyleImmediately('transformOrigin', '0% 0%');
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.wheelEventSub = fromEvent<WheelEvent>(this.element.nativeElement, 'wheel').subscribe((event) => {
      this.handleWheel(event);
    });

    this.isEnable = true;
  }

  public disable() {
    this.wheelEventSub?.unsubscribe();
    this.wheelEventSub = null;
    this.isEnable = false;
  }

  public destroy() {
    this.disable();
    // TODO: Don't let the enable method works after destroy
  }

  private async handleWheel(event: WheelEvent) {
    event.preventDefault();

    const deltaFactor = event.ctrlKey ? -this.options.wheelDeltaFactor : this.options.wheelDeltaFactor;
    const deltaY = clamp(event.deltaY, [-15, 15]);
    const scaleDelta = deltaY * deltaFactor;
    const wheelScale = this.animation.value.transform.scale + scaleDelta;
    const scale = clamp(wheelScale, [this.options.minScale, this.options.maxScale]);

    const centerOffset = { x: event.offsetX, y: event.offsetY };
    const translationDelta = getZoomTranslationDelta(scale, this.animation.value.transform.scale, centerOffset);
    const x = this.animation.value.transform.x + translationDelta.x;
    const y = this.animation.value.transform.y + translationDelta.y;

    this.animation.setScale(scale).setTranslate({ x, y }).apply();
  }
}

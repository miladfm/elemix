import { Animation, clamp, Dom, DomSelector } from '@elemix/core';
import { filter, fromEvent, Subscription } from 'rxjs';
import { ClickZoomOptions, ClickZoomType } from './click-zoom.model';
import { getZoomTranslationDelta } from '../zoom.util';

const DEFAULT_OPTIONS: ClickZoomOptions = {
  minScale: 0,
  maxScale: 10,
  clickScaleFactor: 1.2,
  dblclickScaleFactor: 2,
};

export class ClickZoom {
  private clickType = ClickZoomType.ZoomIn;

  private _isEnable = false;
  public get isEnable() {
    return this._isEnable;
  }

  private set isEnable(isEnable: boolean) {
    this._isEnable = isEnable;
  }

  private readonly options: ClickZoomOptions;
  private readonly element: Dom;
  private readonly animation: Animation;

  private clickEventSub: Subscription | null = null;
  private dblclickEventSub: Subscription | null = null;

  constructor(selector: DomSelector, options: Partial<ClickZoomOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.element = new Dom(selector);
    this.animation = Animation.getOrCreateInstance(this.element);

    this.addZoomStyle();
    this.enable();
  }

  private addZoomStyle() {
    this.element.setStyleImmediately('transformOrigin', '0% 0%');
  }

  public setClickType(type: ClickZoomType) {
    this.clickType = type;

    switch (type) {
      case ClickZoomType.ZoomIn:
        this.element.setStyleImmediately('cursor', 'zoom-in');
        break;

      case ClickZoomType.ZoomOut:
        this.element.setStyleImmediately('cursor', 'zoom-out');
        break;

      case ClickZoomType.Dblclick:
      default:
        this.element.setStyleImmediately('cursor', 'default');
        break;
    }
  }

  public enable() {
    if (this.isEnable) {
      return;
    }

    this.setClickType(this.clickType);

    this.clickEventSub = fromEvent<MouseEvent>(this.element.nativeElement, 'click')
      .pipe(filter((_) => this.clickType === ClickZoomType.ZoomIn || this.clickType === ClickZoomType.ZoomOut))
      .subscribe((event) => {
        this.handleClick(event);
      });

    this.dblclickEventSub = fromEvent<MouseEvent>(this.element.nativeElement, 'dblclick')
      .pipe(filter((_) => this.clickType === ClickZoomType.Dblclick))
      .subscribe((event) => {
        this.handleDblClick(event);
      });

    this.isEnable = true;
  }

  public disable() {
    this.element.setStyleImmediately('cursor', 'initial');
    this.clickEventSub?.unsubscribe();
    this.dblclickEventSub?.unsubscribe();
    this.clickEventSub = null;
    this.dblclickEventSub = null;
    this.isEnable = false;
  }

  public destroy() {
    this.disable();
    // TODO: Don't let the enable method works after destroy
  }

  private async handleClick(event: MouseEvent) {
    const clickScale =
      this.clickType === ClickZoomType.ZoomIn
        ? this.animation.value.transform.scale * this.options.clickScaleFactor
        : this.animation.value.transform.scale / this.options.clickScaleFactor;

    const scale = Number(clamp(clickScale, [this.options.minScale, this.options.maxScale]).toFixed(2));

    const centerOffset = { x: event.offsetX, y: event.offsetY };
    const translationDelta = getZoomTranslationDelta(scale, this.animation.value.transform.scale, centerOffset);
    const x = Number((this.animation.value.transform.x + translationDelta.x).toFixed(2));
    const y = Number((this.animation.value.transform.y + translationDelta.y).toFixed(2));

    this.animation.setScale(scale).setTranslate({ x, y }).animate();
  }

  private async handleDblClick(event: MouseEvent) {
    const dblclickScale =
      this.animation.value.transform.scale === 1
        ? this.animation.value.transform.scale * this.options.dblclickScaleFactor
        : this.animation.value.transform.scale / this.options.dblclickScaleFactor;

    const scale = Number(clamp(dblclickScale, [this.options.minScale, this.options.maxScale]).toFixed(2));

    const centerOffset = { x: event.offsetX, y: event.offsetY };
    const translationDelta = getZoomTranslationDelta(scale, this.animation.value.transform.scale, centerOffset);
    const x = Number((this.animation.value.transform.x + translationDelta.x).toFixed(2));
    const y = Number((this.animation.value.transform.y + translationDelta.y).toFixed(2));

    this.animation.setScale(scale).setTranslate({ x, y }).animate();
  }
}

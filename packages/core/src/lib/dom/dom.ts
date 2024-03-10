import { domSelector } from './dom.util';
import { toStr } from '../common/ensure.util';
import { CssStylesKey, Dimensions } from '../common/common.model';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export type DomType = HTMLElement | SVGSVGElement;
export type DomSelector = Dom<DomType> | HTMLElement | string | Node;

export class Dom<T extends DomType = HTMLElement> {
  public nativeElement: T;

  constructor(selector: DomSelector, parentElem: HTMLElement | Document = document) {
    if (selector instanceof Dom) {
      return selector as Dom<T>;
    }

    const _target = domSelector<T>(selector, parentElem);

    if (!_target) {
      throw new Error(`No element was found. Try to find ${selector}`);
    }

    this.nativeElement = _target;
  }

  public setStyleImmediately(key: CssStylesKey, value: string | number) {
    this.nativeElement.style[key as any] = toStr(value);
  }

  public get width(): number {
    if (this.nativeElement instanceof SVGSVGElement) {
      const svgBBox = this.nativeElement.getBBox();
      return svgBBox.width;
    }

    return this.nativeElement.offsetWidth;
  }

  public get height() {
    if (this.nativeElement instanceof SVGSVGElement) {
      const svgBBox = this.nativeElement.getBBox();
      return svgBBox.height;
    }

    return this.nativeElement.offsetHeight;
  }

  public get dimension(): Dimensions {
    return {
      width: this.width,
      height: this.height,
    };
  }

  public getOpacity() {
    return Number(window.getComputedStyle(this.nativeElement).opacity);
  }

  public querySelector(selector: string) {
    return this.nativeElement.querySelector(selector);
  }

  public querySelectorAll(selector: string) {
    return this.nativeElement.querySelectorAll(selector);
  }

  public appendTo(parentElem: DomSelector) {
    const parent = new Dom(parentElem);
    parent.nativeElement.appendChild(this.nativeElement);
    return this;
  }

  public appendChild(childElem: DomSelector) {
    const child = new Dom(childElem);
    this.nativeElement.appendChild(child.nativeElement);
    return this;
  }

  public addClass(...className: string[]) {
    this.nativeElement.classList.add(...className);
    return this;
  }

  public removeClass(...className: string[]) {
    this.nativeElement.classList.remove(...className);
    return this;
  }

  public getBoundingClientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  public setAttribute(attr: string, value: string) {
    this.nativeElement.setAttribute(attr, value);
    return this;
  }

  public getAttribute(attr: string): string | null {
    return this.nativeElement.getAttribute(attr);
  }

  public remove() {
    this.nativeElement.remove();
  }

  public get children() {
    return this.nativeElement.children;
  }

  public get naturalWidth() {
    if (!(this.nativeElement instanceof HTMLImageElement)) {
      return null;
    }

    return this.nativeElement.naturalWidth;
  }

  public get naturalHeight() {
    if (!(this.nativeElement instanceof HTMLImageElement)) {
      return null;
    }

    return this.nativeElement.naturalHeight;
  }

  public get parentElement() {
    return this.nativeElement.parentElement;
  }

  public observeResize$(): Observable<ResizeObserverEntry> {
    return new Observable<ResizeObserverEntry>((subscriber) => {
      // Create a ResizeObserver and subscribe to resize events
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          subscriber.next(entry);
        });
      });

      // Start observing the element
      resizeObserver.observe(this.nativeElement);

      // Return teardown logic to disconnect the observer when there are no more subscribers
      return () => {
        resizeObserver.disconnect();
      };
    }).pipe(shareReplay({ refCount: true }));
  }
}

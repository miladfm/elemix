import { domSelector } from './dom.util';
import { toStr } from '../common/ensure.util';
import { CssStylesKey, Dimension } from '../common/common.model';
import { parseElementTransform } from './parse-transform.util';

export type DomType = HTMLElement | SVGSVGElement;
export type DomInputType = Dom<DomType> | HTMLElement | string | Node;

export class Dom<T extends DomType = HTMLElement> {
  public target: T;

  constructor(target: DomInputType, parentElem: HTMLElement | Document = document) {
    if (target instanceof Dom) {
      return target as Dom<T>;
    }

    const _target = domSelector<T>(target, parentElem);

    if (!_target) {
      throw new Error('No element was found');
    }

    this.target = _target;
  }

  public setStyleImmediately(property: CssStylesKey, value: string | number) {
    this.target.style[property] = toStr(value);
  }

  public get width(): number {
    if (this.target instanceof SVGSVGElement) {
      const svgBBox = this.target.getBBox();
      return svgBBox.width;
    }

    return this.target.offsetWidth;
  }

  public get height() {
    if (this.target instanceof SVGSVGElement) {
      const svgBBox = this.target.getBBox();
      return svgBBox.height;
    }

    return this.target.offsetHeight;
  }

  public get dimension(): Dimension {
    return {
      width: this.width,
      height: this.height,
    };
  }

  public getTransform() {
    return parseElementTransform(this.target);
  }

  public getOpacity() {
    return Number(window.getComputedStyle(this.target).opacity);
  }

  public querySelector(selector: string) {
    return this.target.querySelector(selector);
  }

  public appendTo(parentElem: DomInputType) {
    const parent = new Dom(parentElem);
    parent.target.appendChild(this.target);
    return this;
  }

  public appendChild(childElem: DomInputType) {
    const child = new Dom(childElem);
    this.target.appendChild(child.target);
    return this;
  }

  public addClass(...className: string[]) {
    this.target.classList.add(...className);
    return this;
  }

  public removeClass(...className: string[]) {
    this.target.classList.remove(...className);
    return this;
  }

  public getBoundingClientRect(): DOMRect {
    return this.target.getBoundingClientRect();
  }

  public setAttribute(attr: string, value: string) {
    this.target.setAttribute(attr, value);
    return this;
  }

  public getAttribute(attr: string): string | null {
    return this.target.getAttribute(attr);
  }

  public remove() {
    this.target.remove();
  }

  public get children() {
    return this.target.children;
  }

  public get naturalWidth() {
    if (!(this.target instanceof HTMLImageElement)) {
      return null;
    }

    return this.target.naturalWidth;
  }

  public get naturalHeight() {
    if (!(this.target instanceof HTMLImageElement)) {
      return null;
    }

    return this.target.naturalHeight;
  }

  public get parentElement() {
    return this.target.parentElement;
  }
}

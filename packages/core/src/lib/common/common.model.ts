export interface Dimension {
  width: number;
  height: number;
}

export interface TransformObject {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
}

export type CssStylesKey = Exclude<
  keyof CSSStyleDeclaration,
  'parentRule' | 'length' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'
>;

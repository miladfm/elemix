export interface Dimensions {
  width: number;
  height: number;
}

export interface DimensionalGap {
  vertical: number;
  horizontal: number;
}

export interface Coordinates {
  x: number;
  y: number;
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

export interface Coordinate {
  x: number;
  y: number;
}

export type Callback<T> = (data: T) => void;

export type AnyObject = Record<string | number, any>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

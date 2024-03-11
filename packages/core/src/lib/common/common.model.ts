export enum Axis {
  /**
   * Allows movement or operation in both horizontal and vertical directions.
   * This provides full freedom for bidirectional activity.
   */
  Both = 'both',

  /**
   * Restricts movement or operation to the horizontal axis only.
   * This limits activity to left and right directions.
   */
  Horizontal = 'horizontal',

  /**
   * Restricts movement or operation to the vertical axis only.
   * This limits activity to up and down directions.
   */
  Vertical = 'vertical',
}

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
  rotateX: number;
  rotateY: number;
  scaleX: number;
  scaleY: number;
}

export type CssStylesKey =
  | Exclude<
      keyof CSSStyleDeclaration,
      'parentRule' | 'length' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'
    >
  | 'userDrag'
  | 'webkitUserDrag';

export interface Coordinate {
  x: number;
  y: number;
}

export type Callback<T> = (data: T) => void;

export type AnyObject = Record<string | number, any>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export declare interface Class<T> extends Function {
  new (...args: any[]): T;
}

export type AllPropsNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type DeepNonNullable<T> = T extends object ? { [P in keyof T]: DeepNonNullable<T[P]> } : NonNullable<T>;

export type NonNullableProps<T, K extends keyof T = keyof T> = {
  [P in keyof T]: P extends K ? DeepNonNullable<T[P]> : T[P];
};

export interface ClickZoomOptions {
  /**
   * The `minScale` defines the smallest zoom level the element can reach.
   * @default 0
   */
  minScale: number;

  /**
   * The `maxScale` sets the largest zoom level for the element.
   * @default 10
   */
  maxScale: number;

  /**
   * The `scaleFactor` determines how much the zoom changes with each click.
   * @default 1.2
   */
  clickScaleFactor: number;

  /**
   * The `scaleFactor` determines how much the zoom changes with each double click.
   * @default 2
   */
  dblclickScaleFactor: number;
}

export enum ClickZoomType {
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
  Dblclick = 'dblclick',
}

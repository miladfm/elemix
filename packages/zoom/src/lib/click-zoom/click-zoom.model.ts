export interface ClickZoomOptions {
  /**
   * The `minScale` defines the smallest zoom level the element can reach.
   */
  minScale: number;

  /**
   * The `maxScale` sets the largest zoom level for the element.
   */
  maxScale: number;

  /**
   * The `scaleFactor` determines how much the zoom changes with each click.
   */
  clickScaleFactor: number;

  /**
   * The `scaleFactor` determines how much the zoom changes with each double click.
   */
  dblclickScaleFactor: number;
}

export enum ClickZoomType {
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
  Dblclick = 'dblclick',
}

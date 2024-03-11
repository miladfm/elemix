import { scaleElementToFit } from '../../lib/scale-element-to-fit/scale-element-to-fit';
import { ScalingMode } from '../../lib/scale-element-to-fit/scale-element-to-fit.model';
import { mockClientRect, mockElementAttribute } from '@internal-lib/util-testing';

describe('Utils - elementFitScale', () => {
  /**
   * In this test suite, we consider scenarios where HTMLElement is smaller and HTMLImageElement is larger than the container.
   * The purpose is to validate that the function handles elements of different sizes correctly.
   * Existing tests already adequately cover these conditions,
   * so additional test scenarios focused only on size differences are not needed.
   * Adding more tests would increase both the maintenance cost and negative impact on code readability.
   */
  let targetSmallElement: HTMLElement; // Must be smaller than container
  let targetBigImageElement: HTMLImageElement; // Must be bigger than container
  let containerElement: HTMLElement;

  beforeEach(() => {
    /**
     * Contain correct value:
     *  container: 600X400
     *  target: 100X200
     *  result with gap 0 should be: scale: 2, width: 200, height: 400, x: 200, y: 0
     *  result with gap 50 should be: scale: 1.5, width: 150, height: 300, x: 225, y: 50
     *
     *  Cover correct value:
     *  container: 600X400
     *  target: 100X200
     *  result with gap 0 should be: scale: 6, width: 600, height: 1200, x: 0, y: -400
     *  result with gap 50 should be: scale: 5, width: 500, height: 1000, x: 50, y: -300
     */

    // Target Element
    targetSmallElement = document.createElement('div');
    mockClientRect(targetSmallElement, { width: 100, height: 200 });
    mockElementAttribute(targetSmallElement, { offsetWidth: 100, offsetHeight: 200 });

    // Target Image Element
    targetBigImageElement = document.createElement('img');
    mockClientRect(targetBigImageElement, { width: 1000, height: 1000 });
    mockElementAttribute(targetBigImageElement, { naturalWidth: 1000, naturalHeight: 1000 });

    // Container Element
    containerElement = document.createElement('div');
    mockClientRect(containerElement, { width: 600, height: 400 });
    mockElementAttribute(containerElement, { offsetWidth: 600, offsetHeight: 400 });
  });

  describe('shared', () => {
    it('should not throw an error when no options is provided', () => {
      expect(() => scaleElementToFit(targetSmallElement, containerElement)).not.toThrow();
    });
    it('should use the zero `gap` and `contain` when no option is provided', () => {
      const { scale } = scaleElementToFit(targetSmallElement, containerElement);
      expect(scale).toEqual(2);
    });

    it('should throw an error when target is not a valid TargetElement', () => {
      expect(() => scaleElementToFit('' as any, containerElement)).toThrow();
      expect(() => scaleElementToFit(null, containerElement)).toThrow();
      expect(() => scaleElementToFit(undefined, containerElement)).toThrow();
      expect(() => scaleElementToFit({} as any, containerElement)).toThrow();
    });
    it('should throw an error when container is not a valid ContainerElement', () => {
      expect(() => scaleElementToFit(targetSmallElement, '' as any)).toThrow();
      expect(() => scaleElementToFit(targetSmallElement, null)).toThrow();
      expect(() => scaleElementToFit(targetSmallElement, undefined)).toThrow();
      expect(() => scaleElementToFit(targetSmallElement, {} as any)).toThrow();
      expect(() => scaleElementToFit(targetSmallElement, targetBigImageElement)).toThrow();
    });
    it('should throw an error when the width of target HTMLEElement is 0', () => {
      mockClientRect(targetSmallElement, { width: 0, height: 100 });
      expect(() => scaleElementToFit(targetSmallElement, containerElement)).toThrow(
        'The width or height of the target HTMLElement should be greater than zero.'
      );
    });
    it('should throw an error when the height of target HTMLEElement is 0', () => {
      mockClientRect(targetSmallElement, { width: 100, height: 0 });
      expect(() => scaleElementToFit(targetSmallElement, containerElement)).toThrow(
        'The width or height of the target HTMLElement should be greater than zero.'
      );
    });
    it('should throw an error when the width of container HTMLEElement is 0', () => {
      Object.defineProperty(containerElement, 'offsetWidth', { configurable: true, value: 0 });
      expect(() => scaleElementToFit(targetSmallElement, containerElement)).toThrow(
        'The width or height of the container HTMLElement should be greater than zero.'
      );
    });
    it('should throw an error when the height of container HTMLEElement is 0', () => {
      Object.defineProperty(containerElement, 'offsetHeight', { configurable: true, value: 0 });
      expect(() => scaleElementToFit(targetSmallElement, containerElement)).toThrow(
        'The width or height of the container HTMLElement should be greater than zero.'
      );
    });
    it('should throw an error when the naturalWidth of target HTMLImageElement is 0', () => {
      Object.defineProperty(targetBigImageElement, 'naturalWidth', { configurable: true, value: 0 });
      expect(() => scaleElementToFit(targetBigImageElement, containerElement)).toThrow(
        'The naturalWidth or naturalHeight of the target HTMLImageElement should be greater than zero.'
      );
    });
    it('should throw an error when the naturalHeight of target HTMLImageElement is 0', () => {
      Object.defineProperty(targetBigImageElement, 'naturalHeight', { configurable: true, value: 0 });
      expect(() => scaleElementToFit(targetBigImageElement, containerElement)).toThrow(
        'The naturalWidth or naturalHeight of the target HTMLImageElement should be greater than zero.'
      );
    });
    it('should throw an error when the provided gap is negative', () => {
      expect(() =>
        scaleElementToFit(targetSmallElement, containerElement, {
          gap: {
            vertical: -10,
            horizontal: -10,
          },
        })
      ).toThrow('The provided gap value should not be negative');
    });
    it('should throw an error when the large vertical gap is provided', () => {
      expect(() =>
        scaleElementToFit(targetSmallElement, containerElement, {
          gap: {
            vertical: 200,
            horizontal: 0,
          },
        })
      ).toThrow('The provided vertical gap value is too large for the container dimensions');
    });
    it('should throw an error when the large horizontal gap is provided', () => {
      expect(() =>
        scaleElementToFit(targetSmallElement, containerElement, {
          gap: {
            vertical: 0,
            horizontal: 300,
          },
        })
      ).toThrow('The provided horizontal gap value is too large for the container dimensions');
    });

    it('should return the correct `relativePosition` when container is bigger than target', () => {
      const { relativePosition } = scaleElementToFit(targetSmallElement, containerElement);
      expect(relativePosition).toEqual({ x: 200, y: 0 });
    });
    it('should return the correct `relativePosition` when container is smaller than target', () => {
      const { relativePosition } = scaleElementToFit(targetBigImageElement, containerElement);
      expect(relativePosition).toEqual({ x: 100, y: 0 });
    });
    it('should return the correct `relativePosition` when container is bigger than target and gap options is provided', () => {
      const { relativePosition } = scaleElementToFit(targetSmallElement, containerElement, {
        gap: {
          vertical: 50,
          horizontal: 50,
        },
      });
      expect(relativePosition).toEqual({ x: 225, y: 50 });
    });
    it('should return the correct `relativePosition` when container is smaller than target and gap options is provided', () => {
      const { relativePosition } = scaleElementToFit(targetBigImageElement, containerElement, {
        gap: {
          vertical: 50,
          horizontal: 50,
        },
      });
      expect(relativePosition).toEqual({ x: 150, y: 50 });
    });
  });

  describe('contain type', () => {
    it('should return the correct `scale` when `fitType` options is `contain`', () => {
      const { scale } = scaleElementToFit(targetSmallElement, containerElement, { fitType: ScalingMode.Contain });
      expect(scale).toEqual(2);
    });
    it('should return the correct `dimensions` when `fitType` options is `contain`', () => {
      const { dimensions } = scaleElementToFit(targetSmallElement, containerElement, { fitType: ScalingMode.Contain });
      expect(dimensions.width).toEqual(200);
      expect(dimensions.height).toEqual(400);
    });

    it('should return the correct `scale` when target is a `HTMLImageElement` element and `fitType` options is `contain`', () => {
      const { scale } = scaleElementToFit(targetBigImageElement, containerElement, { fitType: ScalingMode.Contain });
      expect(scale).toEqual(0.4);
    });
    it('should return the correct `dimensions` when target is a `HTMLImageElement` element and `fitType` options is `contain`', () => {
      const { dimensions } = scaleElementToFit(targetBigImageElement, containerElement, { fitType: ScalingMode.Contain });
      expect(dimensions.width).toEqual(400);
      expect(dimensions.height).toEqual(400);
    });

    it('should return the correct `scale` when gap option is provided and `fitType` options is `contain`', () => {
      const { scale } = scaleElementToFit(targetSmallElement, containerElement, {
        fitType: ScalingMode.Contain,
        gap: {
          vertical: 50,
          horizontal: 50,
        },
      });
      expect(scale).toEqual(1.5);
    });
    it('should return the correct `dimensions` when gap options is provided and `fitType` options is `contain`', () => {
      const { dimensions } = scaleElementToFit(targetSmallElement, containerElement, {
        fitType: ScalingMode.Contain,
        gap: {
          vertical: 50,
          horizontal: 50,
        },
      });
      expect(dimensions.width).toEqual(150);
      expect(dimensions.height).toEqual(300);
    });
  });

  describe('cover type', () => {
    it('should return the correct `scale` when `fitType` options is `cover`', () => {
      const { scale } = scaleElementToFit(targetSmallElement, containerElement, { fitType: ScalingMode.Cover });
      expect(scale).toEqual(6);
    });
    it('should return the correct `dimensions` when `fitType` options is `cover`', () => {
      const { dimensions } = scaleElementToFit(targetSmallElement, containerElement, { fitType: ScalingMode.Cover });
      expect(dimensions.width).toEqual(600);
      expect(dimensions.height).toEqual(1200);
    });

    it('should return the correct `scale` when target is a `HTMLImageElement` element and `fitType` options is `cover`', () => {
      const { scale } = scaleElementToFit(targetBigImageElement, containerElement, { fitType: ScalingMode.Cover });
      expect(scale).toEqual(0.6);
    });
    it('should return the correct `dimensions` when target is a `HTMLImageElement` element and `fitType` options is `cover`', () => {
      const { dimensions } = scaleElementToFit(targetBigImageElement, containerElement, { fitType: ScalingMode.Cover });
      expect(dimensions.width).toEqual(600);
      expect(dimensions.height).toEqual(600);
    });

    it('should return the correct `scale` when gap option is provided and `fitType` options is `cover`', () => {
      const { scale } = scaleElementToFit(targetSmallElement, containerElement, {
        fitType: ScalingMode.Cover,
        gap: {
          vertical: 50,
          horizontal: 50,
        },
      });
      expect(scale).toEqual(5);
    });
    it('should return the correct `dimensions` when gap options is provided and `fitType` options is `cover`', () => {
      const { dimensions } = scaleElementToFit(targetSmallElement, containerElement, {
        fitType: ScalingMode.Cover,
        gap: {
          vertical: 50,
          horizontal: 50,
        },
      });
      expect(dimensions.width).toEqual(500);
      expect(dimensions.height).toEqual(1000);
    });
  });
});

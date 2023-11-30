import { createMockRequestAnimationFrame } from '@internal-lib/util-testing';

import { Animation } from '../../lib/animation/animation';
import { AnimationProperties } from '../../lib/animation/animation.model';
import { deepmerge } from '../../lib/common/common.util';

const INIT_ANIM_PROPS: AnimationProperties = {
  transform: { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 },
  dimension: { width: 100, height: 100 },
  opacity: 1,
};

describe('Feature - Animation', () => {
  let divElement: HTMLDivElement;

  beforeEach(() => {
    divElement = document.createElement('div');

    Object.defineProperty(divElement, 'offsetWidth', {
      configurable: true,
      value: INIT_ANIM_PROPS.dimension.width,
    });

    Object.defineProperty(divElement, 'offsetHeight', {
      configurable: true,
      value: INIT_ANIM_PROPS.dimension.height,
    });

    divElement.style.opacity = '1';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Values', () => {
    it('Should correctly update `value` with current DOM element properties when syncValue has called,', () => {
      const animation = new Animation(divElement);

      Object.defineProperty(divElement, 'offsetWidth', {
        configurable: true,
        value: 1,
      });

      Object.defineProperty(divElement, 'offsetHeight', {
        configurable: true,
        value: 1,
      });

      divElement.style.opacity = '0.5';
      divElement.style.width = '1px';
      divElement.style.height = '1px';
      divElement.style.transform = 'translate(1px, 1px) scale(2, 2)';

      animation.syncValue();

      expect(animation.value.transform.x).toEqual(1);
      expect(animation.value.transform.y).toEqual(1);
      expect(animation.value.transform.scale).toEqual(2);
      expect(animation.value.dimension.width).toEqual(1);
      expect(animation.value.dimension.height).toEqual(1);
      expect(animation.value.opacity).toEqual(0.5);
    });
  });

  describe('Value Change Listeners', () => {
    it('should invoke the callback method only once when applyImmediately is called', () => {
      const animation = new Animation(divElement);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);

      animation.addTranslate({ x: 10 }).applyImmediately();

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        deepmerge(INIT_ANIM_PROPS, {
          transform: {
            x: 10,
          },
        })
      );
    });
    it('should invoke the callback method only once when apply is called', async () => {
      const animation = new Animation(divElement);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);

      await animation.addTranslate({ x: 10 }).apply();

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        deepmerge(INIT_ANIM_PROPS, {
          transform: {
            x: 10,
          },
        })
      );
    });
    it('should invoke the callback method during animate', async () => {
      createMockRequestAnimationFrame({ frames: 3 });
      const animation = new Animation(divElement);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);

      await animation.addTranslate({ x: 10 }).animate({ duration: 100 });

      expect(mockCallback).toHaveBeenCalledTimes(2); // The first frame is set the init value (old value), so there is no value changes to emit
      expect(mockCallback).toHaveBeenNthCalledWith(1, deepmerge(INIT_ANIM_PROPS, { transform: { x: 5 } }));
      expect(mockCallback).toHaveBeenNthCalledWith(2, deepmerge(INIT_ANIM_PROPS, { transform: { x: 10 } }));
    });
    it('should not add the same callback function twice', () => {
      const animation = new Animation(divElement);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);
      animation.addValueChangeListener(mockCallback);

      animation.addTranslate({ x: 10 }).applyImmediately();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
    it('should not trigger any callbacks after the listener is removed', () => {
      const animation = new Animation(divElement);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);
      animation.removeValueChangeListener(mockCallback);

      animation.addTranslate({ x: 10 }).applyImmediately();

      expect(mockCallback).not.toHaveBeenCalled();
    });
    it('should only trigger listeners not removed from the list after one is deleted', () => {
      const animation = new Animation(divElement);
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      animation.addValueChangeListener(mockCallback1);
      animation.addValueChangeListener(mockCallback2);
      animation.removeValueChangeListener(mockCallback1);

      animation.addTranslate({ x: 10 }).applyImmediately();

      expect(mockCallback1).not.toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalled();
    });
  });

  describe('Translations Manipulations', () => {
    it('should update existing x and y values when a new translation is added', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ x: 10, y: 10 });
      animation.addTranslate({ x: 5, y: 5 });
      expect(animation.value.transform.x).toEqual(15);
      expect(animation.value.transform.y).toEqual(15);
    });
    it('should update only the x value when a new x translation is added', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ x: 10 });
      animation.addTranslate({ x: 5 });
      expect(animation.value.transform.x).toEqual(15);
      expect(animation.value.transform.y).toEqual(0);
    });
    it('should update only the y value when a new y translation is added', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ y: 10 });
      animation.addTranslate({ y: 5 });
      expect(animation.value.transform.y).toEqual(15);
      expect(animation.value.transform.x).toEqual(0);
    });
    it('should leave existing values unchanged when no new translation parameters are for adding is provided', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({});
      expect(animation.value.transform).toEqual({
        ...INIT_ANIM_PROPS.transform,
      });
    });
    it('should not affect other attributes when adding a new translation', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ x: 10, y: 10 });
      animation.addTranslate({ x: 5, y: 5 });
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        transform: {
          ...INIT_ANIM_PROPS.transform,
          x: 15,
          y: 15,
        },
      });
    });
    it('should override existing x and y values when new translation is set', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ x: 5, y: 5 });
      animation.setTranslate({ x: 10, y: 10 });
      expect(animation.value.transform.x).toEqual(10);
      expect(animation.value.transform.y).toEqual(10);
    });
    it('should override only the x value when new x translation is set', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ x: 5 });
      animation.setTranslate({ x: 10 });
      expect(animation.value.transform.x).toEqual(10);
      expect(animation.value.transform.y).toEqual(0);
    });
    it('should override only the y value when new y translation is set', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ y: 5 });
      animation.setTranslate({ y: 10 });
      expect(animation.value.transform.x).toEqual(0);
      expect(animation.value.transform.y).toEqual(10);
    });
    it('should leave existing values unchanged when no new translation parameters are for setting is provided', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({});
      expect(animation.value.transform).toEqual({
        ...INIT_ANIM_PROPS.transform,
      });
    });
    it('should not affect other attributes when setting a new translation', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ x: 5, y: 5 });
      animation.setTranslate({ x: 10, y: 10 });
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        transform: {
          ...INIT_ANIM_PROPS.transform,
          x: 10,
          y: 10,
        },
      });
    });
  });

  describe('Dimension Manipulations', () => {
    it('should update existing width and height when new dimensions are added', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ width: 10, height: 10 });
      animation.addDimension({ width: 5, height: 5 });
      expect(animation.value.dimension.width).toEqual(115);
      expect(animation.value.dimension.height).toEqual(115);
    });
    it('should update only the width when a new width is added', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ width: 10 });
      animation.addDimension({ width: 5 });
      expect(animation.value.dimension.width).toEqual(115);
      expect(animation.value.dimension.height).toEqual(100);
    });
    it('should update only the height when a new height is added', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ height: 10 });
      animation.addDimension({ height: 5 });
      expect(animation.value.dimension.width).toEqual(100);
      expect(animation.value.dimension.height).toEqual(115);
    });
    it('should leave existing dimensions unchanged when no parameters for adding are provided', () => {
      const animation = new Animation(divElement);
      animation.addDimension({});
      expect(animation.value.dimension).toEqual({
        ...INIT_ANIM_PROPS.dimension,
      });
    });
    it('should not affect other attributes when adding new dimensions', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ width: 10, height: 10 });
      animation.addDimension({ width: 5, height: 5 });
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        dimension: {
          ...INIT_ANIM_PROPS.dimension,
          width: 115,
          height: 115,
        },
      });
    });
    it('should override existing width and height when new dimensions are set', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ width: 10, height: 10 });
      expect(animation.value.dimension.width).toEqual(10);
      expect(animation.value.dimension.height).toEqual(10);
    });
    it('should override only the width when a new width is set', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ width: 10 });
      expect(animation.value.dimension.width).toEqual(10);
      expect(animation.value.dimension.height).toEqual(100);
    });
    it('should override only the height when a new height is set', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ height: 10 });
      expect(animation.value.dimension.width).toEqual(100);
      expect(animation.value.dimension.height).toEqual(10);
    });
    it('should leave existing dimensions unchanged when no parameters for setting are provided', () => {
      const animation = new Animation(divElement);
      animation.setDimension({});
      expect(animation.value.dimension).toEqual({
        ...INIT_ANIM_PROPS.dimension,
      });
    });
    it('should not affect other attributes when setting new dimensions', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ width: 10, height: 10 });
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        dimension: {
          ...INIT_ANIM_PROPS.dimension,
          width: 10,
          height: 10,
        },
      });
    });
  });

  describe('Flip Manipulations', () => {
    it('should change rotation to 180 degrees when flipped on the X-axis', () => {
      const animation = new Animation(divElement);
      animation.flipX();
      expect(animation.value.transform.rotateX).toEqual(180);
    });
    it('should revert rotation to 0 degrees when flipped again on the X-axis', () => {
      const animation = new Animation(divElement);
      animation.flipX();
      animation.flipX();
      expect(animation.value.transform.rotateX).toEqual(0);
    });
    it('should not affect other attributes when flipping on the X-axis', () => {
      const animation = new Animation(divElement);
      animation.flipX();
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        transform: {
          ...INIT_ANIM_PROPS.transform,
          rotateX: 180,
        },
      });
    });
    it('should change rotation to 180 degrees when flipped on the Y-axis', () => {
      const animation = new Animation(divElement);
      animation.flipY();
      expect(animation.value.transform.rotateY).toEqual(180);
    });
    it('should revert rotation to 0 degrees when flipped again on the Y-axis', () => {
      const animation = new Animation(divElement);
      animation.flipY();
      animation.flipY();
      expect(animation.value.transform.rotateY).toEqual(0);
    });
    it('should not affect other attributes when flipping on the Y-axis', () => {
      const animation = new Animation(divElement);
      animation.flipY();
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        transform: {
          ...INIT_ANIM_PROPS.transform,
          rotateY: 180,
        },
      });
    });
  });

  describe('Scale Manipulations', () => {
    it('should override existing scale when new scale is set', () => {
      const animation = new Animation(divElement);
      animation.setScale(2);
      expect(animation.value.transform.scale).toEqual(2);
    });
    it('should not affect other attributes when setting the scale', () => {
      const animation = new Animation(divElement);
      animation.setScale(2);
      expect(animation.value).toEqual({
        ...INIT_ANIM_PROPS,
        transform: {
          ...INIT_ANIM_PROPS.transform,
          scale: 2,
        },
      });
    });
  });

  describe('Opacity Manipulations', () => {
    it('should override existing opacity when new opacity is set', () => {
      const animation = new Animation(divElement);
      animation.setOpacity(0.7);
      expect(animation.value.opacity).toEqual(0.7);
    });
    it('should set opacity to minimum limit when values are less than 0', () => {
      const animation = new Animation(divElement);
      animation.setOpacity(-1);
      expect(animation.value.opacity).toEqual(0);
    });
    it('should set opacity to maximum limit when values are greater than 1', () => {
      const animation = new Animation(divElement);
      animation.setOpacity(2);
      expect(animation.value.opacity).toEqual(1);
    });
  });

  describe('Manipulation DOM Without Animation', () => {
    it('should apply all style changes to DOM element immediately', () => {
      const animation = new Animation(divElement);
      animation
        .setTranslate({ x: 10, y: 10 })
        .setDimension({ width: 200, height: 50 })
        .setScale(2)
        .setOpacity(0.5)
        .flipX()
        .applyImmediately();

      expect(divElement.style.transform).toEqual('translate(10px, 10px) scale(2, 2) rotateY(0deg) rotateX(180deg)');
      expect(divElement.style.width).toEqual('200px');
      expect(divElement.style.height).toEqual('50px');
      expect(divElement.style.opacity).toEqual('0.5');
    });
    it('should apply all style changes to DOM element at next animation frame', () => {
      const animation = new Animation(divElement);
      const { mockRequestAnimationFrame } = createMockRequestAnimationFrame({ stopOnFrames: 1 });
      animation.setTranslate({ x: 10, y: 10 }).setDimension({ width: 200, height: 50 }).setScale(2).setOpacity(0.5).flipX().apply();

      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(divElement.style.transform).toEqual('translate(10px, 10px) scale(2, 2) rotateY(0deg) rotateX(180deg)');
      expect(divElement.style.width).toEqual('200px');
      expect(divElement.style.height).toEqual('50px');
      expect(divElement.style.opacity).toEqual('0.5');
    });
    it('should emit changes when style modifications are present', () => {
      const mockValueChangesCallback = jest.fn();
      const animation = new Animation(divElement);
      animation.addValueChangeListener(mockValueChangesCallback);
      animation
        .setTranslate({ x: 10, y: 10 })
        .setDimension({ width: 200, height: 50 })
        .setScale(2)
        .setOpacity(0.5)
        .flipX()
        .applyImmediately();

      expect(mockValueChangesCallback).toHaveBeenCalledTimes(1);
      expect(mockValueChangesCallback).toBeCalledWith({
        transform: { x: 10, y: 10, scale: 2, rotateX: 180, rotateY: 0 },
        dimension: { width: 200, height: 50 },
        opacity: 0.5,
      });
    });
    it('should not emit changes when no style modifications have been made', () => {
      const mockValueChangesCallback = jest.fn();
      const animation = new Animation(divElement);
      animation.applyImmediately();

      expect(mockValueChangesCallback).not.toHaveBeenCalled();
    });
  });

  describe('Manipulation DOM With Animation', () => {
    it('should stop animation when receiving a stop signal', () => {
      const animation = new Animation(divElement);
      createMockRequestAnimationFrame({
        frames: 6,
        beforeEachFrame: (timestamp, frame) => {
          if (frame === 4) {
            animation.stopAnimation();
          }
        },
      });
      animation.setTranslate({ x: 500 }).animate();
      expect(animation.value.transform.x).toBe(200);
    });
    it('should resolve a promise with false when ongoing animation has stopped', async () => {
      const animation = new Animation(divElement);
      createMockRequestAnimationFrame({ stopOnFrames: 1 });
      const animatePromise = animation.setTranslate({ x: 500 }).animate();
      animation.stopAnimation();
      await expect(animatePromise).resolves.toEqual(false);
    });
    it('should complete the animation within the specified duration', async () => {
      // const { getTotalDuration, frameDuration } = mockRequestAnimationFrameWithFPS(100);
      const duration = 150;
      const { frameDuration, getLastTime } = createMockRequestAnimationFrame({ frames: 45, duration });
      const animation = new Animation(divElement);

      await animation.setDimension({ width: 100 }).animate({ duration });

      expect(getLastTime()).toBeGreaterThanOrEqual(duration);
      expect(getLastTime()).toBeLessThanOrEqual(duration + frameDuration);
    });
    it('should delay the start of the animation until after the delay period', async () => {
      jest.spyOn(global, 'setTimeout');
      const animation = new Animation(divElement);
      await animation.animate({ delay: 10 });

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10);
    });
    it('should cancel any existing animations before starting a new one', () => {
      const { getLastFrameID } = createMockRequestAnimationFrame({ stopOnFrames: 1 });
      jest.spyOn(window, 'cancelAnimationFrame');
      const animation = new Animation(divElement);

      animation.animate();
      const firstFrameID = getLastFrameID();
      animation.animate();

      expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(cancelAnimationFrame).toHaveBeenCalledWith(firstFrameID);
    });
    it('should update DOM attributes consistently during the animation', async () => {
      createMockRequestAnimationFrame({
        frames: 3,
        beforeEachFrame: (_, frame) => {
          if (frame === 2) {
            expect(divElement.style.transform).toEqual(``);
            expect(divElement.style.width).toEqual(``);
            expect(divElement.style.height).toEqual(``);
            expect(divElement.style.opacity).toEqual(`1`); // Opacity has been set as style of the element on beforeEach
          } else if (frame === 3) {
            expect(divElement.style.transform).toEqual(`translate(50px, 50px) scale(1.5, 1.5) rotateY(90deg) rotateX(90deg)`);
            expect(divElement.style.width).toEqual(`150px`);
            expect(divElement.style.height).toEqual(`150px`);
            expect(divElement.style.opacity).toEqual(`0.5`);
          }
        },
      });
      const animation = new Animation(divElement);
      await animation
        .setTranslate({ x: 100, y: 100 })
        .setDimension({ width: 200, height: 200 })
        .setScale(2)
        .flipX()
        .flipY()
        .setOpacity(0)
        .animate();

      expect(divElement.style.transform).toEqual(`translate(100px, 100px) scale(2, 2) rotateY(180deg) rotateX(180deg)`);
      expect(divElement.style.width).toEqual(`200px`);
      expect(divElement.style.height).toEqual(`200px`);
      expect(divElement.style.opacity).toEqual(`0`);
    });
    it('should update DOM attributes according to the provided easing functions', async () => {
      const mockEaseIn = jest.fn().mockImplementation((progress) => progress * progress);
      createMockRequestAnimationFrame({
        frames: 3,
        beforeEachFrame: (_, frame) => {
          if (frame === 2) {
            expect(divElement.style.transform).toEqual(``);
          } else if (frame === 3) {
            expect(divElement.style.transform).toEqual(`translate(25px, 0px) scale(1, 1) rotateY(0deg) rotateX(0deg)`);
          }
        },
      });
      const animation = new Animation(divElement);
      await animation.setTranslate({ x: 100 }).animate({ easing: mockEaseIn });

      expect(divElement.style.transform).toEqual(`translate(100px, 0px) scale(1, 1) rotateY(0deg) rotateX(0deg)`);
    });
  });
});

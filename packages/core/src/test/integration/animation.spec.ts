import { mockBasicRequestAnimationFrame, mockRequestAnimationFrame } from '@internal-lib/util-testing';

import { Animation } from '../../lib/animation/animation';
import { AnimationProperties } from '../../lib/animation/animation.model';
import { deepmerge } from '../../lib/common/common.util';

const INIT_ANIM_PROPS: AnimationProperties = {
  transform: { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 },
  dimension: { width: 100, height: 100 },
  opacity: 1,
};

describe('Feature - Animation', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    Object.defineProperty(element, 'offsetWidth', {
      configurable: true,
      value: INIT_ANIM_PROPS.dimension.width,
    });
    Object.defineProperty(element, 'offsetHeight', {
      configurable: true,
      value: INIT_ANIM_PROPS.dimension.height,
    });
    element.style.opacity = '1';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initialize', () => {
    it('should not throw an error during initialize', () => {
      expect(() => new Animation(element)).not.toThrow();
    });
    it('Should return an existing instance if one already exists for the passed element', () => {
      const animation1 = new Animation(element);
      const animation2 = Animation.getOrCreateInstance(element);
      expect(animation1).toBe(animation2);
    });
    it('Should return a new instance if none exists for the passed element', () => {
      const divElementSecondary = document.createElement('span');
      const animation1 = Animation.getOrCreateInstance(element);
      const animation2 = Animation.getOrCreateInstance(divElementSecondary);
      expect(animation1).not.toBe(animation2);
    });
  });

  describe('Value Change Listeners', () => {
    it('should invoke the callback method only once when applyImmediately is called', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
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
      mockRequestAnimationFrame({ frames: 3 });
      const animation = new Animation(element);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);

      await animation.addTranslate({ x: 10 }).animate({ duration: 100 });

      expect(mockCallback).toHaveBeenCalledTimes(2); // The first frame is set the init value (old value), so there is no value changes to emit
      expect(mockCallback).toHaveBeenNthCalledWith(1, deepmerge(INIT_ANIM_PROPS, { transform: { x: 5 } }));
      expect(mockCallback).toHaveBeenNthCalledWith(2, deepmerge(INIT_ANIM_PROPS, { transform: { x: 10 } }));
    });
    it('should not add the same callback function twice', () => {
      const animation = new Animation(element);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);
      animation.addValueChangeListener(mockCallback);

      animation.addTranslate({ x: 10 }).applyImmediately();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
    it('should not trigger any callbacks after the listener is removed', () => {
      const animation = new Animation(element);
      const mockCallback = jest.fn();
      animation.addValueChangeListener(mockCallback);
      animation.removeValueChangeListener(mockCallback);

      animation.addTranslate({ x: 10 }).applyImmediately();

      expect(mockCallback).not.toHaveBeenCalled();
    });
    it('should only trigger listeners not removed from the list after one is deleted', () => {
      const animation = new Animation(element);
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      animation.addValueChangeListener(mockCallback1);
      animation.addValueChangeListener(mockCallback2);
      animation.removeValueChangeListener(mockCallback1);

      animation.addTranslate({ x: 10 }).applyImmediately();

      expect(mockCallback1).not.toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalled();
    });
    it('should not invoke the callback when no style modifications have been made', () => {
      const mockValueChangesCallback = jest.fn();
      const animation = new Animation(element);
      animation.applyImmediately();

      expect(mockValueChangesCallback).not.toHaveBeenCalled();
    });
  });

  describe('Translations Manipulations', () => {
    it('should update existing x and y values when a new translation is added', () => {
      const animation = new Animation(element);
      animation.addTranslate({ x: 10, y: 10 });
      animation.addTranslate({ x: 5, y: 5 });
      expect(animation.value.transform.x).toEqual(15);
      expect(animation.value.transform.y).toEqual(15);
    });
    it('should update only the x value when a new x translation is added', () => {
      const animation = new Animation(element);
      animation.addTranslate({ x: 10 });
      animation.addTranslate({ x: 5 });
      expect(animation.value.transform.x).toEqual(15);
      expect(animation.value.transform.y).toEqual(0);
    });
    it('should update only the y value when a new y translation is added', () => {
      const animation = new Animation(element);
      animation.addTranslate({ y: 10 });
      animation.addTranslate({ y: 5 });
      expect(animation.value.transform.y).toEqual(15);
      expect(animation.value.transform.x).toEqual(0);
    });
    it('should leave existing values unchanged when no new translation parameters are for adding is provided', () => {
      const animation = new Animation(element);
      animation.addTranslate({});
      expect(animation.value.transform).toEqual({
        ...INIT_ANIM_PROPS.transform,
      });
    });
    it('should not affect other attributes when adding a new translation', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.setTranslate({ x: 5, y: 5 });
      animation.setTranslate({ x: 10, y: 10 });
      expect(animation.value.transform.x).toEqual(10);
      expect(animation.value.transform.y).toEqual(10);
    });
    it('should override only the x value when new x translation is set', () => {
      const animation = new Animation(element);
      animation.setTranslate({ x: 5 });
      animation.setTranslate({ x: 10 });
      expect(animation.value.transform.x).toEqual(10);
      expect(animation.value.transform.y).toEqual(0);
    });
    it('should override only the y value when new y translation is set', () => {
      const animation = new Animation(element);
      animation.setTranslate({ y: 5 });
      animation.setTranslate({ y: 10 });
      expect(animation.value.transform.x).toEqual(0);
      expect(animation.value.transform.y).toEqual(10);
    });
    it('should leave existing values unchanged when no new translation parameters are for setting is provided', () => {
      const animation = new Animation(element);
      animation.setTranslate({});
      expect(animation.value.transform).toEqual({
        ...INIT_ANIM_PROPS.transform,
      });
    });
    it('should not affect other attributes when setting a new translation', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.addDimension({ width: 10, height: 10 });
      animation.addDimension({ width: 5, height: 5 });
      expect(animation.value.dimension.width).toEqual(115);
      expect(animation.value.dimension.height).toEqual(115);
    });
    it('should update only the width when a new width is added', () => {
      const animation = new Animation(element);
      animation.addDimension({ width: 10 });
      animation.addDimension({ width: 5 });
      expect(animation.value.dimension.width).toEqual(115);
      expect(animation.value.dimension.height).toEqual(100);
    });
    it('should update only the height when a new height is added', () => {
      const animation = new Animation(element);
      animation.addDimension({ height: 10 });
      animation.addDimension({ height: 5 });
      expect(animation.value.dimension.width).toEqual(100);
      expect(animation.value.dimension.height).toEqual(115);
    });
    it('should leave existing dimensions unchanged when no parameters for adding are provided', () => {
      const animation = new Animation(element);
      animation.addDimension({});
      expect(animation.value.dimension).toEqual({
        ...INIT_ANIM_PROPS.dimension,
      });
    });
    it('should not affect other attributes when adding new dimensions', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.setDimension({ width: 10, height: 10 });
      expect(animation.value.dimension.width).toEqual(10);
      expect(animation.value.dimension.height).toEqual(10);
    });
    it('should override only the width when a new width is set', () => {
      const animation = new Animation(element);
      animation.setDimension({ width: 10 });
      expect(animation.value.dimension.width).toEqual(10);
      expect(animation.value.dimension.height).toEqual(100);
    });
    it('should override only the height when a new height is set', () => {
      const animation = new Animation(element);
      animation.setDimension({ height: 10 });
      expect(animation.value.dimension.width).toEqual(100);
      expect(animation.value.dimension.height).toEqual(10);
    });
    it('should leave existing dimensions unchanged when no parameters for setting are provided', () => {
      const animation = new Animation(element);
      animation.setDimension({});
      expect(animation.value.dimension).toEqual({
        ...INIT_ANIM_PROPS.dimension,
      });
    });
    it('should not affect other attributes when setting new dimensions', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.flipX();
      expect(animation.value.transform.rotateX).toEqual(180);
    });
    it('should revert rotation to 0 degrees when flipped again on the X-axis', () => {
      const animation = new Animation(element);
      animation.flipX();
      animation.flipX();
      expect(animation.value.transform.rotateX).toEqual(0);
    });
    it('should not affect other attributes when flipping on the X-axis', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.flipY();
      expect(animation.value.transform.rotateY).toEqual(180);
    });
    it('should revert rotation to 0 degrees when flipped again on the Y-axis', () => {
      const animation = new Animation(element);
      animation.flipY();
      animation.flipY();
      expect(animation.value.transform.rotateY).toEqual(0);
    });
    it('should not affect other attributes when flipping on the Y-axis', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.setScale(2);
      expect(animation.value.transform.scale).toEqual(2);
    });
    it('should not affect other attributes when setting the scale', () => {
      const animation = new Animation(element);
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
      const animation = new Animation(element);
      animation.setOpacity(0.7);
      expect(animation.value.opacity).toEqual(0.7);
    });
    it('should set opacity to minimum limit when values are less than 0', () => {
      const animation = new Animation(element);
      animation.setOpacity(-1);
      expect(animation.value.opacity).toEqual(0);
    });
    it('should set opacity to maximum limit when values are greater than 1', () => {
      const animation = new Animation(element);
      animation.setOpacity(2);
      expect(animation.value.opacity).toEqual(1);
    });
  });

  describe('Manipulation DOM Without Animation', () => {
    it('should immediately apply all style changes to DOM element when applyImmediately method has called', () => {
      const animation = new Animation(element);
      animation
        .setTranslate({ x: 10, y: 10 })
        .setDimension({ width: 200, height: 50 })
        .setScale(2)
        .setOpacity(0.5)
        .flipX()
        .applyImmediately();

      expect(element.style.transform).toEqual('translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)');
      expect(element.style.width).toEqual('200px');
      expect(element.style.height).toEqual('50px');
      expect(element.style.opacity).toEqual('0.5');
    });
    it('should only apply specified style changes and not affect other properties when applyImmediately method is called', () => {
      const animation = new Animation(element);
      animation.setTranslate({ x: 10, y: 10 }).setOpacity(0.5).applyImmediately();

      expect(element.style.transform).toEqual('translate(10px, 10px) rotateX(0deg) rotateY(0deg) scale(1, 1)');
      expect(element.style.width).toEqual('');
      expect(element.style.height).toEqual('');
      expect(element.style.opacity).toEqual('0.5');
    });
    it('should apply all style changes to DOM element at next animation frame when apply method has called', () => {
      const animation = new Animation(element);
      mockRequestAnimationFrame({ stopOnFrames: 1 });
      animation
        .setTranslate({ x: 10, y: 10 })
        .setDimension({
          width: 200,
          height: 50,
        })
        .setScale(2)
        .setOpacity(0.5)
        .flipX()
        .apply();

      expect(element.style.transform).toEqual('translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)');
      expect(element.style.width).toEqual('200px');
      expect(element.style.height).toEqual('50px');
      expect(element.style.opacity).toEqual('0.5');
    });
    it('should only apply specified style changes and not affect other properties at next animation frame when apply method is called', () => {
      const animation = new Animation(element);
      mockRequestAnimationFrame({ stopOnFrames: 1 });
      animation.setTranslate({ x: 10, y: 10 }).setOpacity(0.5).apply();

      expect(element.style.transform).toEqual('translate(10px, 10px) rotateX(0deg) rotateY(0deg) scale(1, 1)');
      expect(element.style.width).toEqual('');
      expect(element.style.height).toEqual('');
      expect(element.style.opacity).toEqual('0.5');
    });
  });

  describe('Manipulation DOM With Animation', () => {
    it('should apply all style changes to DOM element at next animation frame when the animation duration is 0', async () => {
      const animation = new Animation(element);
      mockBasicRequestAnimationFrame();
      await animation.setTranslate({ x: 10, y: 10 }).animate({ duration: 0 });

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element.style.transform).toContain('translate(10px, 10px)');
    });
    it('should apply all style changes to DOM element at next animation frame when the animation duration is negative', async () => {
      const animation = new Animation(element);
      mockBasicRequestAnimationFrame();
      await animation.setTranslate({ x: 10, y: 10 }).animate({ duration: -1 });

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element.style.transform).toContain('translate(10px, 10px)');
    });
    it('should skip animation delay and run animation immediately, when animation delay in 0', async () => {
      jest.spyOn(window, 'setTimeout');
      mockRequestAnimationFrame({ frames: 2 });
      const animation = new Animation(element);
      await animation.setTranslate({ x: 10, y: 10 }).animate({ delay: -1 });

      expect(window.setTimeout).not.toHaveBeenCalled();
      expect(element.style.transform).toContain('translate(10px, 10px)');
    });
    it('should skip animation delay and run animation immediately, when animation delay in negative', async () => {
      jest.spyOn(window, 'setTimeout');
      mockRequestAnimationFrame({ frames: 2 });
      const animation = new Animation(element);
      await animation.setTranslate({ x: 10, y: 10 }).animate({ delay: 0 });

      expect(window.setTimeout).not.toHaveBeenCalled();
      expect(element.style.transform).toContain('translate(10px, 10px)');
    });

    it('should resolve a promise with true when ongoing animation has completed', async () => {
      const animation = new Animation(element);
      mockRequestAnimationFrame({ frames: 2 });
      const animatePromise = await animation.setTranslate({ x: 500 }).animate();
      expect(animatePromise).toEqual(true);
    });
    it('should resolve a promise with false when ongoing animation has stopped', async () => {
      const animation = new Animation(element);
      mockRequestAnimationFrame({ stopOnFrames: 1 });
      const animatePromise = animation.setTranslate({ x: 500 }).animate();
      animation.stopAnimation();
      expect(await animatePromise).toEqual(false);
    });

    it('should stop animation when receiving a stop signal', () => {
      const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
      const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
      const animation = new Animation(element);
      mockRequestAnimationFrame({
        frames: 6,
        beforeEachFrame: (_, frame) => {
          if (frame === 4) {
            animation.stopAnimation();
          }
        },
      });
      animation.setTranslate({ x: 500 }).animate();
      expect(animation.value.transform.x).toBe(200);
      expect(mockClearTimeout).toHaveBeenCalledTimes(2); // The first one is on start animate.
      expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
    });
    it('should cancel any existing animations before starting a new one', () => {
      const { getLastFrameID } = mockRequestAnimationFrame({ stopOnFrames: 1 });
      jest.spyOn(window, 'cancelAnimationFrame');
      const animation = new Animation(element);

      animation.addTranslate({ x: 10 }).animate();
      const firstFrameID = getLastFrameID();
      animation.addTranslate({ x: 20 }).animate();

      expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(cancelAnimationFrame).toHaveBeenCalledWith(firstFrameID);
    });

    it('should update DOM attributes consistently during the animation', async () => {
      mockRequestAnimationFrame({
        frames: 3,
        beforeEachFrame: (_, frame) => {
          if (frame === 2) {
            expect(element.style.transform).toEqual(``);
            expect(element.style.width).toEqual(``);
            expect(element.style.height).toEqual(``);
            expect(element.style.opacity).toEqual(`1`); // Opacity has been set as style of the element on beforeEach
          } else if (frame === 3) {
            expect(element.style.transform).toEqual(`translate(50px, 50px) rotateX(90deg) rotateY(90deg) scale(1.5, 1.5)`);
            expect(element.style.width).toEqual(`150px`);
            expect(element.style.height).toEqual(`150px`);
            expect(element.style.opacity).toEqual(`0.5`);
          }
        },
      });
      const animation = new Animation(element);
      await animation
        .setTranslate({ x: 100, y: 100 })
        .setDimension({ width: 200, height: 200 })
        .setScale(2)
        .flipX()
        .flipY()
        .setOpacity(0)
        .animate();

      expect(element.style.transform).toEqual(`translate(100px, 100px) rotateX(180deg) rotateY(180deg) scale(2, 2)`);
      expect(element.style.width).toEqual(`200px`);
      expect(element.style.height).toEqual(`200px`);
      expect(element.style.opacity).toEqual(`0`);
    });

    it('should complete the animation within the specified duration', async () => {
      const duration = 150;
      const { frameDuration, getLastTime } = mockRequestAnimationFrame({ frames: 45, duration });
      const animation = new Animation(element);

      await animation.setDimension({ width: 200 }).animate({ duration });

      expect(getLastTime()).toBeGreaterThanOrEqual(duration);
      expect(getLastTime()).toBeLessThanOrEqual(duration + frameDuration);
    });
    it('should delay the start of the animation until after the delay period', async () => {
      jest.spyOn(global, 'setTimeout');
      const animation = new Animation(element);
      await animation.animate({ delay: 10 });

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10);
    });
    it('should update DOM attributes according to the provided easing functions', async () => {
      const mockEaseIn = jest.fn().mockImplementation((progress) => progress * progress);
      mockRequestAnimationFrame({
        frames: 3,
        beforeEachFrame: (_, frame) => {
          if (frame === 2) {
            expect(element.style.transform).toEqual(``);
          } else if (frame === 3) {
            expect(element.style.transform).toEqual(`translate(25px, 0px) rotateX(0deg) rotateY(0deg) scale(1, 1)`);
          }
        },
      });
      const animation = new Animation(element);
      await animation.setTranslate({ x: 100 }).animate({ easing: mockEaseIn });

      expect(mockEaseIn).toHaveBeenCalledTimes(2); // The first frame is just for init the start time
      expect(element.style.transform).toEqual(`translate(100px, 0px) rotateX(0deg) rotateY(0deg) scale(1, 1)`);
    });

    it('should not run animation when no animation values has changed', async () => {
      mockRequestAnimationFrame({ stopOnFrames: 1 });
      jest.spyOn(window, 'cancelAnimationFrame');
      jest.spyOn(window, 'requestAnimationFrame');
      const animation = new Animation(element);

      animation.animate();

      expect(cancelAnimationFrame).not.toHaveBeenCalled();
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should `isAnimating` be true when animation is running', () => {});
    it('should `isAnimating` be false when animation has completed', () => {});
    it('should `isAnimating` be false when no animation is running', () => {});
  });
});

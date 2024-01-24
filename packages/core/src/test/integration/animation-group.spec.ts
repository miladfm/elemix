import { AnimationProperties } from '../../lib/animation/animation.model';
import { AnimationGroup } from '../../lib/animation/animation-group';
import { Animation } from '../../lib/animation/animation';
import { mockBasicRequestAnimationFrame, mockRequestAnimationFrame } from '@internal-lib/util-testing';

const INIT_ANIM_PROPS: AnimationProperties = {
  transform: { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 },
  dimension: { width: 100, height: 100 },
  opacity: 1,
};

function setElementStyle(...elements: HTMLElement[]) {
  elements.forEach((element, index) => {
    element.id = `element-${index + 1}`;
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
}

describe('Feature - Animation Group', () => {
  let element1: HTMLDivElement;
  let element2: HTMLDivElement;
  let element3: HTMLDivElement;

  let animation1: Animation;
  let animation2: Animation;
  let animation3: Animation;

  let animationGroup: AnimationGroup;

  beforeEach(() => {
    element1 = document.createElement('div');
    element2 = document.createElement('div');
    element3 = document.createElement('div');

    setElementStyle(element1, element2, element3);

    animation1 = Animation.getOrCreateInstance(element1);
    animation2 = Animation.getOrCreateInstance(element2);
    animation3 = Animation.getOrCreateInstance(element3);

    document.body.appendChild(element1);
    document.body.appendChild(element2);
    document.body.appendChild(element3);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    animationGroup = null;
    element1.remove();
    element2.remove();
    element3.remove();
  });

  describe('Manipulation DOM', () => {
    beforeEach(() => {
      animationGroup = new AnimationGroup([element1, element2]);
    });

    it('should immediately apply all style changes when applyImmediately method has called', () => {
      animation1.setTranslate({ x: 10, y: 10 }).setDimension({ width: 200, height: 50 }).setScale(2).setOpacity(0.5).flipX();

      animation2.setTranslate({ x: 20, y: 20 }).setDimension({ width: 300, height: 80 }).setScale(3).setOpacity(0.2).flipY();

      animationGroup.applyImmediately();

      expect(element1.style.transform).toEqual('translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)');
      expect(element1.style.width).toEqual('200px');
      expect(element1.style.height).toEqual('50px');
      expect(element1.style.opacity).toEqual('0.5');

      expect(element2.style.transform).toEqual('translate(20px, 20px) rotateX(0deg) rotateY(180deg) scale(3, 3)');
      expect(element2.style.width).toEqual('300px');
      expect(element2.style.height).toEqual('80px');
      expect(element2.style.opacity).toEqual('0.2');
    });
    it('should apply all style changes to DOM element in a single animation frame when apply method has called', () => {
      mockBasicRequestAnimationFrame();

      animation1.setTranslate({ x: 10, y: 10 }).setDimension({ width: 200, height: 50 }).setScale(2).setOpacity(0.5).flipX();

      animation2.setTranslate({ x: 20, y: 20 }).setDimension({ width: 300, height: 80 }).setScale(3).setOpacity(0.2).flipY();

      animationGroup.apply();

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element1.style.transform).toEqual('translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)');
      expect(element1.style.width).toEqual('200px');
      expect(element1.style.height).toEqual('50px');
      expect(element1.style.opacity).toEqual('0.5');

      expect(element2.style.transform).toEqual('translate(20px, 20px) rotateX(0deg) rotateY(180deg) scale(3, 3)');
      expect(element2.style.width).toEqual('300px');
      expect(element2.style.height).toEqual('80px');
      expect(element2.style.opacity).toEqual('0.2');
    });

    it('should apply all style changes to DOM element at next animation frame when the animation duration is 0', () => {
      mockBasicRequestAnimationFrame();

      animation1.setTranslate({ x: 10, y: 10 }).setDimension({ width: 200, height: 50 }).setScale(2).setOpacity(0.5).flipX();

      animation2.setTranslate({ x: 20, y: 20 }).setDimension({ width: 300, height: 80 }).setScale(3).setOpacity(0.2).flipY();

      animationGroup.animate({ duration: 0 });

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element1.style.transform).toEqual('translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)');
      expect(element1.style.width).toEqual('200px');
      expect(element1.style.height).toEqual('50px');
      expect(element1.style.opacity).toEqual('0.5');

      expect(element2.style.transform).toEqual('translate(20px, 20px) rotateX(0deg) rotateY(180deg) scale(3, 3)');
      expect(element2.style.width).toEqual('300px');
      expect(element2.style.height).toEqual('80px');
      expect(element2.style.opacity).toEqual('0.2');
    });
    it('should apply all style changes to DOM element at next animation frame when the animation duration is negative', () => {
      mockBasicRequestAnimationFrame();

      animation1.setTranslate({ x: 10, y: 10 }).setDimension({ width: 200, height: 50 }).setScale(2).setOpacity(0.5).flipX();

      animation2.setTranslate({ x: 20, y: 20 }).setDimension({ width: 300, height: 80 }).setScale(3).setOpacity(0.2).flipY();

      animationGroup.animate({ duration: -1 });

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element1.style.transform).toEqual('translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)');
      expect(element1.style.width).toEqual('200px');
      expect(element1.style.height).toEqual('50px');
      expect(element1.style.opacity).toEqual('0.5');

      expect(element2.style.transform).toEqual('translate(20px, 20px) rotateX(0deg) rotateY(180deg) scale(3, 3)');
      expect(element2.style.width).toEqual('300px');
      expect(element2.style.height).toEqual('80px');
      expect(element2.style.opacity).toEqual('0.2');
    });
    it('should resolve a promise with true when ongoing animation has completed', async () => {
      mockRequestAnimationFrame({ frames: 2 });

      animation1.setTranslate({ x: 10, y: 10 });
      animation2.setTranslate({ x: 20, y: 20 });
      const animatePromise = await animationGroup.animate();

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2); // Make sure animation runs only one times
      expect(animatePromise).toEqual(true);
    });
    it('should resolve a promise with false when ongoing animation has stopped', async () => {
      mockRequestAnimationFrame({ stopOnFrames: 1 });

      animation1.setTranslate({ x: 10, y: 10 });
      animation2.setTranslate({ x: 20, y: 20 });
      const animatePromise = animationGroup.animate();
      animationGroup.stopAnimation();

      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2); // Make sure animation runs only one times
      expect(await animatePromise).toEqual(false);
    });
    it('should stop animation when receiving a stop signal', () => {
      jest.spyOn(window, 'cancelAnimationFrame');
      mockRequestAnimationFrame({
        frames: 6,
        beforeEachFrame: (_, frame) => {
          if (frame === 4) {
            animationGroup.stopAnimation();
          }
        },
      });

      animation1.setTranslate({ x: 10, y: 10 });
      animation2.setTranslate({ x: 20, y: 20 });
      animationGroup.animate();

      expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(element1.style.transform).toContain('translate(4px, 4px)');
      expect(element2.style.transform).toContain('translate(8px, 8px)');
    });
    it('should cancel any existing animations before starting a new one', () => {
      const { getLastFrameID } = mockRequestAnimationFrame({ stopOnFrames: 1 });
      jest.spyOn(window, 'cancelAnimationFrame');

      animation1.setTranslate({ x: 10, y: 10 });
      animation2.setTranslate({ x: 20, y: 20 });
      animationGroup.animate();

      const firstFrameID = getLastFrameID();

      animation1.setTranslate({ x: 30, y: 30 });
      animation2.setTranslate({ x: 40, y: 40 });
      animationGroup.animate();

      expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(cancelAnimationFrame).toHaveBeenCalledWith(firstFrameID);
    });
    it('should update DOM attributes consistently during the animation', async () => {
      mockRequestAnimationFrame({
        frames: 3,
        beforeEachFrame: (_, frame) => {
          if (frame === 2) {
            expect(element1.style.transform).toEqual(``);
            expect(element1.style.width).toEqual(``);
            expect(element1.style.height).toEqual(``);
            expect(element1.style.opacity).toEqual(`1`); // Opacity has been set as style of the element on beforeEach

            expect(element2.style.transform).toEqual(``);
            expect(element2.style.width).toEqual(``);
            expect(element2.style.height).toEqual(``);
            expect(element2.style.opacity).toEqual(`1`); // Opacity has been set as style of the element on beforeEach
          } else if (frame === 3) {
            expect(element1.style.transform).toEqual(`translate(5px, 5px) rotateX(90deg) rotateY(0deg) scale(1.5, 1.5)`);
            expect(element1.style.width).toEqual(`150px`);
            expect(element1.style.height).toEqual(`75px`);
            expect(element1.style.opacity).toEqual(`0.75`);

            expect(element2.style.transform).toEqual(`translate(10px, 10px) rotateX(0deg) rotateY(90deg) scale(2, 2)`);
            expect(element2.style.width).toEqual(`200px`);
            expect(element2.style.height).toEqual(`90px`);
            expect(element2.style.opacity).toEqual(`0.6`);
          }
        },
      });
      animation1.setTranslate({ x: 10, y: 10 }).setDimension({ width: 200, height: 50 }).setScale(2).setOpacity(0.5).flipX();

      animation2.setTranslate({ x: 20, y: 20 }).setDimension({ width: 300, height: 80 }).setScale(3).setOpacity(0.2).flipY();

      await animationGroup.animate();

      expect(element1.style.transform).toEqual(`translate(10px, 10px) rotateX(180deg) rotateY(0deg) scale(2, 2)`);
      expect(element1.style.width).toEqual(`200px`);
      expect(element1.style.height).toEqual(`50px`);
      expect(element1.style.opacity).toEqual(`0.5`);

      expect(element2.style.transform).toEqual(`translate(20px, 20px) rotateX(0deg) rotateY(180deg) scale(3, 3)`);
      expect(element2.style.width).toEqual(`300px`);
      expect(element2.style.height).toEqual(`80px`);
      expect(element2.style.opacity).toEqual(`0.19999999999999996`);
    });
    it('should complete the animation within the specified duration', async () => {
      const duration = 150;
      const { frameDuration, getLastTime } = mockRequestAnimationFrame({ frames: 45, duration });

      animation1.setTranslate({ x: 10, y: 10 });
      animation2.setTranslate({ x: 20, y: 20 });
      await animationGroup.animate({ duration });

      expect(getLastTime()).toBeGreaterThanOrEqual(duration);
      expect(getLastTime()).toBeLessThanOrEqual(duration + frameDuration);
    });
    it('should update DOM attributes according to the provided easing functions', async () => {
      const mockEaseIn = jest.fn().mockImplementation((progress) => progress * progress);
      mockRequestAnimationFrame({
        frames: 3,
        beforeEachFrame: (_, frame) => {
          if (frame === 2) {
            expect(element1.style.transform).toEqual(``);
            expect(element2.style.transform).toEqual(``);
          } else if (frame === 3) {
            expect(element1.style.transform).toContain(`translate(2.5px, 2.5px)`);
            expect(element2.style.transform).toContain(`translate(5px, 5px)`);
          }
        },
      });
      animation1.setTranslate({ x: 10, y: 10 });
      animation2.setTranslate({ x: 20, y: 20 });
      await animationGroup.animate({ easing: mockEaseIn });

      expect(mockEaseIn).toHaveBeenCalledTimes(2); // The first frame is just for init the start time
      expect(element1.style.transform).toContain(`translate(10px, 10px)`);
      expect(element2.style.transform).toContain(`translate(20px, 20px)`);
    });
    it('should not run animation when no animation values has changed', async () => {
      jest.spyOn(window, 'cancelAnimationFrame');
      jest.spyOn(window, 'requestAnimationFrame');

      await animationGroup.animate();

      expect(cancelAnimationFrame).not.toHaveBeenCalled();
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should `isAnimating` be true when animation is running', () => {
      mockRequestAnimationFrame({ stopOnFrames: 1 });

      animation1.setTranslate({ x: 10, y: 10 });
      animationGroup.animate();

      expect(animationGroup.isAnimating).toEqual(true);
    });
    it('should `isAnimating` be false when animation has completed', async () => {
      animation1.setTranslate({ x: 10, y: 10 });
      await animationGroup.animate();

      expect(animationGroup.isAnimating).toEqual(false);
    });
    it('should `isAnimating` be false when no animation is running', () => {
      expect(animationGroup.isAnimating).toEqual(false);
    });
  });

  describe('Init/Add/Remove', () => {
    let mockElement1Width: jest.SpyInstance;
    let mockElement2Width: jest.SpyInstance;
    let mockElement3Width: jest.SpyInstance;

    beforeEach(() => {
      mockElement1Width = jest.spyOn(element1.style, 'width', 'set');
      mockElement2Width = jest.spyOn(element2.style, 'width', 'set');
      mockElement3Width = jest.spyOn(element3.style, 'width', 'set');
    });

    afterEach(() => {
      jest.restoreAllMocks();
      animationGroup = null;
    });

    // Add
    it('should add Animation instances to the group when add method has called with Animation instances', () => {
      animationGroup = new AnimationGroup();
      animationGroup.add(animation1);
      animationGroup.add(animation2);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
    });
    it('should add Animation instances to the group when add method has called with DomSelector', () => {
      animationGroup = new AnimationGroup();
      animationGroup.add('#element-1');
      animationGroup.add(element2);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
    });
    it('should add Animation instances to the group when add method has called with DomSelector and Animation instances', () => {
      animationGroup = new AnimationGroup();
      animationGroup.add(animation1);
      animationGroup.add('#element-2');
      animationGroup.add(element3);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animation3.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
      expect(mockElement3Width).toHaveBeenCalledTimes(1);
      expect(mockElement3Width).toHaveBeenCalledWith('10px');
    });
    it('should not add duplicate items to the group when an equivalent Animation instance already exists in the group', () => {
      animationGroup = new AnimationGroup();
      animationGroup.add(animation1);
      animationGroup.add('#element-1');
      animationGroup.add(element1);
      animation1.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
    });

    // Delete
    it('should delete Animation instances from the group when delete method has called with Animation instances', () => {
      animationGroup = new AnimationGroup([animation1, animation2]);
      animationGroup.delete(animation1);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(0);
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
    });
    it('should delete Animation instances from the group when delete method has called with DomSelector', () => {
      animationGroup = new AnimationGroup([animation1, animation2, animation3]);
      animationGroup.delete(element1);
      animationGroup.delete('#element-2');
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animation3.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(0);
      expect(mockElement2Width).toHaveBeenCalledTimes(0);
      expect(mockElement3Width).toHaveBeenCalledTimes(1);
      expect(mockElement3Width).toHaveBeenCalledWith('10px');
    });

    // New
    it('should add Animation instances to the group when provided in the constructor', () => {
      animationGroup = new AnimationGroup([animation1, animation2]);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
    });
    it('should add DomSelector instances as Animation objects when provided in the constructor', () => {
      animationGroup = new AnimationGroup(['#element-1', element2]);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
    });
    it('should handle mixed Animation and DomSelector instances when provided in the constructor', () => {
      animationGroup = new AnimationGroup([animation1, '#element-2', element3]);
      animation1.setDimension({ width: 10 });
      animation2.setDimension({ width: 10 });
      animation3.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
      expect(mockElement2Width).toHaveBeenCalledTimes(1);
      expect(mockElement2Width).toHaveBeenCalledWith('10px');
      expect(mockElement3Width).toHaveBeenCalledTimes(1);
      expect(mockElement3Width).toHaveBeenCalledWith('10px');
    });
    it('should not add duplicate items to the group when an equivalent Animation instance already provided in the constructor', () => {
      animationGroup = new AnimationGroup([animation1, '#element-1', element1]);
      animation1.setDimension({ width: 10 });
      animationGroup.applyImmediately();

      expect(mockElement1Width).toHaveBeenCalledTimes(1);
      expect(mockElement1Width).toHaveBeenCalledWith('10px');
    });
  });
});

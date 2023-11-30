import { createMockRequestAnimationFrame } from '@internal-lib/util-testing';

import { Animation } from '../../lib/animation/animation';
import { TransformObject } from '../../lib/common/common.model';
import { AnimationProperties } from '../../lib/animation/animation.model';
import { getObjectDiff } from '../../lib/common/common.util';

// region --- MOCKS ---
export const INIT_TRANSFORM: TransformObject = {
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
};
export const INIT_ANIM_PROPS: AnimationProperties = {
  transform: { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 },
  dimension: { width: 100, height: 100 },
  opacity: 1,
};

const mockDomInstances = new Map();

const mockDomGetTransform = jest.fn().mockReturnValue({ ...INIT_TRANSFORM });
const mockDomGetOpacity = jest.fn().mockReturnValue(0);
const mockDomSetStyleImmediately = jest.fn();

const mockReactiveValueAddListener = jest.fn();
const mockReactiveValueRemoveListener = jest.fn();
const mockReactiveValueUpdate = jest.fn();

const mockGetObjectDiff = jest.fn();

jest.mock('../../lib/common/reactive-value', () => {
  const originalModule = jest.requireActual('../../lib/common/reactive-value');

  return {
    ReactiveValue: jest.fn().mockImplementation(() => ({
      addListener: mockReactiveValueAddListener,
      removeListener: mockReactiveValueRemoveListener,
      update: mockReactiveValueUpdate,
      clone: jest.fn(),
      value: { ...INIT_ANIM_PROPS },
      emit: jest.fn(),
    })),
  };
});
jest.mock('../../lib/dom/dom', () => ({
  Dom: jest.fn().mockImplementation((selector) => {
    const domSelector = mockDomInstances.get(selector) || selector;
    mockDomInstances.set(selector, domSelector);
    return {
      nativeElement: domSelector.nativeElement ?? domSelector,
      getTransform: mockDomGetTransform,
      getOpacity: mockDomGetOpacity,
      setStyleImmediately: mockDomSetStyleImmediately,
    };
  }),
}));
jest.mock('../../lib/common/common.util', () => ({
  deepmerge: jest.fn().mockImplementation((target, source) => source),
  deepClone: jest.fn().mockImplementation((obj) => obj),
  getObjectDiff: jest.fn().mockReturnValue({}),
}));
jest.mock('../../lib/animation/animation.util', () => ({
  getTransform2dValue: jest.fn().mockReturnValue('translate(0px, 0px) scale(1, 1) rotateY(0deg) rotateX(0deg)'),
}));
// endregion

describe('Class - Animation', () => {
  let divElement: HTMLDivElement;
  let divElementSecondary: HTMLSpanElement;

  beforeEach(() => {
    divElement = document.createElement('div');
    divElement.style.opacity = '1';
    divElementSecondary = document.createElement('span');
    divElementSecondary.style.opacity = '1';

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
    jest.clearAllMocks();
    mockDomInstances.clear();
  });

  describe('constructor', () => {
    it('should initialize properly when passed a valid selector', () => {
      const animation = new Animation(divElement);
      expect(animation).toBeInstanceOf(Animation);
    });

    it('should throw an error when scaleX and scaleY differ', () => {
      mockDomGetTransform.mockReturnValueOnce({
        ...INIT_TRANSFORM,
        scaleX: 1,
        scaleY: 2,
      });
      expect(() => new Animation(divElement)).toThrow(`Sorry, Animation class support right now just 'scale' and not 'scaleX, scaleY'`);
    });
  });

  describe('getOrCreateInstance', () => {
    it('Should return an existing instance if one already exists for the passed element', () => {
      const animation1 = Animation.getOrCreateInstance(divElement);
      const animation2 = Animation.getOrCreateInstance(divElement);
      expect(animation1).toBe(animation2);
    });
    it('Should return a new instance if none exists for the passed element', () => {
      const animation1 = Animation.getOrCreateInstance(divElement);
      const animation2 = Animation.getOrCreateInstance(divElementSecondary);
      expect(animation1).not.toBe(animation2);
    });
  });

  describe('addValueChangeListener', () => {
    it('should register value changes callback', () => {
      const animation = new Animation(divElement);

      animation.addValueChangeListener(jest.fn());
      expect(mockReactiveValueAddListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeValueChangeListener', () => {
    it('should remove value changes callback', () => {
      const animation = new Animation(divElement);
      animation.removeValueChangeListener(jest.fn());
      expect(mockReactiveValueRemoveListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTranslate', () => {
    it('Should handle adding both x and y translation values', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ x: 10, y: 10 });
      jest.fn();
      expect(mockReactiveValueUpdate).toBeCalled();
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 5, y: 5 } },
        {
          transform: {
            x: 15,
            y: 15,
          },
        }
      );
    });

    it('should handle adding only x translation', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ x: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 5, y: 5 } },
        {
          transform: {
            x: 15,
            y: 5,
          },
        }
      );
    });

    it('should handle adding only y translation', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({ y: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 0, y: 5 } },
        {
          transform: {
            x: 0,
            y: 15,
          },
        }
      );
    });

    it('Should leave values unchanged if no translation parameters are provided', () => {
      const animation = new Animation(divElement);
      animation.addTranslate({});
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 10, y: 10 } },
        {
          transform: {
            x: 10,
            y: 10,
          },
        }
      );
    });
  });

  describe('setTranslate', () => {
    it('Should override both x and y translation values', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ x: 10, y: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 5, y: 5 } },
        {
          transform: {
            x: 10,
            y: 10,
          },
        }
      );
    });

    it('should override only x translation', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ x: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 5, y: 5 } },
        {
          transform: {
            x: 10,
            y: 5,
          },
        }
      );
    });

    it('should override only y translation', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({ y: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 5, y: 5 } },
        {
          transform: {
            x: 5,
            y: 10,
          },
        }
      );
    });

    it('Should leave values unchanged if no translation parameters are provided', () => {
      const animation = new Animation(divElement);
      animation.setTranslate({});
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { transform: { x: 5, y: 5 } },
        {
          transform: {
            x: 5,
            y: 5,
          },
        }
      );
    });
  });

  describe('addDimension', () => {
    it('Should handle adding both width and height dimensions', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ width: 10, height: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 15, height: 15 } }
      );
    });

    it('should handle adding only width dimension', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ width: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 15, height: 5 } }
      );
    });

    it('should handle adding only height dimension', () => {
      const animation = new Animation(divElement);
      animation.addDimension({ height: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 5, height: 15 } }
      );
    });

    it('Should leave values unchanged if no dimension parameters are provided', () => {
      const animation = new Animation(divElement);
      animation.addDimension({});
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 5, height: 5 } }
      );
    });
  });

  describe('setDimension', () => {
    it('Should override both width and height dimensions', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ width: 10, height: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 10, height: 10 } }
      );
    });

    it('should override only width dimension', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ width: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 10, height: 5 } }
      );
    });

    it('should override only height dimension', () => {
      const animation = new Animation(divElement);
      animation.setDimension({ height: 10 });
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 5, height: 10 } }
      );
    });

    it('Should leave values unchanged if no dimension parameters are provided', () => {
      const animation = new Animation(divElement);
      animation.setDimension({});
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith(
        { dimension: { width: 5, height: 5 } },
        { dimension: { width: 5, height: 5 } }
      );
    });
  });

  describe('flipX', () => {
    it('Should toggle rotation on the X-axis from 0 to 180 degrees', () => {
      const animation = new Animation(divElement);
      animation.flipX();
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({ transform: { rotateX: 0 } }, { transform: { rotateX: 180 } });
    });

    it('Should toggle rotation on the X-axis from 180 to 0 degrees', () => {
      const animation = new Animation(divElement);
      animation.flipX();
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({ transform: { rotateX: 180 } }, { transform: { rotateX: 0 } });
    });
  });

  describe('flipY', () => {
    it('Should toggle rotation on the Y-axis from 0 to 180 degrees', () => {
      const animation = new Animation(divElement);
      animation.flipY();
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({ transform: { rotateY: 0 } }, { transform: { rotateY: 180 } });
    });

    it('Should toggle rotation on the Y-axis from 180 to 0 degrees', () => {
      const animation = new Animation(divElement);
      animation.flipY();
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({ transform: { rotateY: 180 } }, { transform: { rotateY: 0 } });
    });
  });

  describe('setScale', () => {
    it('should override scale', () => {
      const animation = new Animation(divElement);
      animation.setScale(2);
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({ transform: { scale: 0 } }, { transform: { scale: 2 } });
    });
  });

  describe('setOpacity', () => {
    it('should override opacity', () => {
      const animation = new Animation(divElement);
      animation.setOpacity(0.7);
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({}, { opacity: 0.7 });
    });

    it('should adjust opacity to 0 for values less than 0', () => {
      const animation = new Animation(divElement);
      animation.setOpacity(-1);
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({}, { opacity: 0 });
    });

    it('should adjust opacity to 1 for values greater than 1', () => {
      const animation = new Animation(divElement);
      animation.setOpacity(2);
      expect(mockReactiveValueUpdate).toBeCalledAsFunctionWith({}, { opacity: 1 });
    });
  });

  describe('stopAnimation', () => {
    it('Should clear animation states when stopAnimation is called.', () => {
      createMockRequestAnimationFrame({ stopOnFrames: 1 });
      const animation = new Animation(divElement);
      const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
      const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
      jest.spyOn(animation, 'isAnimating', 'get').mockReturnValue(true);
      const mockIsAnimatingSetter = jest.spyOn(animation, 'isAnimating', 'set');

      animation.stopAnimation();

      expect(mockIsAnimatingSetter).toHaveBeenCalledTimes(1);
      expect(mockIsAnimatingSetter).toHaveBeenCalledWith(false);
      expect(mockClearTimeout).toHaveBeenCalledTimes(1);
      expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
    });

    it('Should call the resolveAnimationPromise with false when stopAnimation is called and there is any ongoing animation', () => {
      const animation = new Animation(divElement);
      const mockResolveAnimationPromise = jest.fn();
      (animation as any).resolveAnimationPromise = mockResolveAnimationPromise;

      createMockRequestAnimationFrame({ stopOnFrames: 1 });
      jest.spyOn(animation, 'isAnimating', 'get').mockReturnValue(true);

      animation.stopAnimation();
      expect(mockResolveAnimationPromise).toHaveBeenCalledTimes(1);
      expect(mockResolveAnimationPromise).toHaveBeenCalledWith(false);
      expect((animation as any).resolveAnimationPromise).toBe(null);
    });

    it('should not clear any animation states when there is no running animation', () => {
      const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
      const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
      createMockRequestAnimationFrame({ stopOnFrames: 1 });
      const animation = new Animation(divElement);
      jest.spyOn(animation, 'isAnimating', 'get').mockReturnValue(false);
      const mockIsAnimatingSetter = jest.spyOn(animation, 'isAnimating', 'set');

      animation.stopAnimation();

      expect(mockIsAnimatingSetter).not.toHaveBeenCalled();
      expect(mockCancelAnimationFrame).not.toHaveBeenCalled();
      expect(mockClearTimeout).not.toHaveBeenCalled();
    });
  });

  describe('applyImmediately', () => {
    it('Should immediately apply all style changes to the DOM element', () => {
      (getObjectDiff as jest.Mock).mockImplementationOnce((_) => ({
        transform: { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 },
        dimension: { width: 0, height: 0 },
        opacity: 0,
      }));
      new Animation(divElement).applyImmediately();

      // These values are derived from INIT_ANIM_PROPS, not directly from getObjectDiff
      expect(mockDomSetStyleImmediately).toHaveBeenCalledWith('transform', 'translate(0px, 0px) scale(1, 1) rotateY(0deg) rotateX(0deg)');
      expect(mockDomSetStyleImmediately).toHaveBeenCalledWith('width', '100px');
      expect(mockDomSetStyleImmediately).toHaveBeenCalledWith('height', '100px');
      expect(mockDomSetStyleImmediately).toHaveBeenCalledWith('opacity', 1);
      expect(mockDomSetStyleImmediately).toHaveBeenCalledTimes(4);
    });
    it('Should immediately apply only changes styles changes to the DOM element', () => {
      (getObjectDiff as jest.Mock).mockImplementationOnce((_) => ({
        transform: { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 },
      }));

      new Animation(divElement).applyImmediately();

      // These values are derived from INIT_ANIM_PROPS, not directly from getObjectDiff
      expect(mockDomSetStyleImmediately).toHaveBeenCalledTimes(1);
      expect(mockDomSetStyleImmediately).toHaveBeenCalledWith('transform', 'translate(0px, 0px) scale(1, 1) rotateY(0deg) rotateX(0deg)');
    });
  });

  describe('apply', () => {
    it('Should call applyImmediately only once on next animation frame', () => {
      const animation = new Animation(divElement);
      const mockApplyImmediately = jest.spyOn(animation, 'applyImmediately');
      const { mockRequestAnimationFrame } = createMockRequestAnimationFrame({
        frames: 1,
      });
      animation.apply();
      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(mockApplyImmediately).toHaveBeenCalledTimes(1);
    });

    it('should resolve a promise after applying styles', async () => {
      const animation = new Animation(divElement);
      createMockRequestAnimationFrame({ frames: 1 });
      jest.spyOn(animation, 'applyImmediately');

      const applyPromise = animation.apply();

      expect(applyPromise).toBeInstanceOf(Promise);
      await expect(applyPromise).resolves.toEqual(true);
    });
  });

  describe('animate', () => {
    it('should throw an error message for invalid duration', async () => {
      const animation = new Animation(divElement);
      await expect(animation.animate({ duration: 0 })).rejects.toThrow('the duration of animation cna not be less than 1ms');
    });

    it('should throw an error message for invalid delay', async () => {
      const animation = new Animation(divElement);
      await expect(animation.animate({ delay: -1 })).rejects.toThrow('the delay of animation cna not be less than 0ms');
    });

    it('should execute animations using the provided easing functions', async () => {
      createMockRequestAnimationFrame({ frames: 3 });
      const mockEasing = jest.fn().mockReturnValue(0.5);
      const animation = new Animation(divElement);
      await animation.animate({ easing: mockEasing });

      expect(mockEasing).toHaveBeenCalledTimes(3);
      expect(mockEasing).toHaveBeenCalledWith(0);
      expect(mockEasing).toHaveBeenCalledWith(0.5);
      expect(mockEasing).toHaveBeenCalledWith(1);
    });

    it('should keep isAnimating true while the animation is in progress', async () => {
      const animation = new Animation(divElement);
      createMockRequestAnimationFrame({
        frames: 2,
        beforeEachFrame: () => {
          expect(animation.isAnimating).toEqual(true);
        },
      });
      await animation.animate();
    });

    it('should set isAnimating to false when the animation completes', async () => {
      const animation = new Animation(divElement);
      createMockRequestAnimationFrame({ frames: 2 });
      await animation.animate();
      expect(animation.isAnimating).toEqual(false);
    });

    it('should resolve a promise after animation completion', async () => {
      const animation = new Animation(divElement);
      const applyPromise = animation.animate();
      expect(applyPromise).toBeInstanceOf(Promise);
      await expect(applyPromise).resolves.toEqual(true);
    });
  });
});

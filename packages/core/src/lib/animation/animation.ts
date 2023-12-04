import { Dom, DomSelector, DomType } from '../dom/dom';
import { Callback, Coordinate } from '../common/common.model';
import { deepClone, getObjectDiff } from '../common/common.util';
import { State } from '../common/state';
import { AnimationProperties, Dimension } from './animation.model';
import { getAnimationValueOnProgress, getTransform2dValue } from './animation.util';
import { clamp } from '../common/math.util';
import { isNullish } from '../common/ensure.util';

interface AnimationState {
  properties: AnimationProperties;
  previousProperties: AnimationProperties;
  isAnimating: boolean;
}

export const INITIAL_ANIMATION_PROPERTIES: AnimationProperties = {
  transform: { x: 0, y: 0, scale: 0 },
  dimension: { width: 0, height: 0 },
  opacity: 0,
};

export const INITIAL_STATE: AnimationState = {
  properties: { ...INITIAL_ANIMATION_PROPERTIES },
  previousProperties: { ...INITIAL_ANIMATION_PROPERTIES },
  isAnimating: false,
};

/**
 * Animation class for handling element animations.
 *
 * @example
 * // For always creating new instances:
 * const anim1 = new Animation(element1); // Returns a new instance for element1
 * const anim2 = new Animation(element1); // Returns another new instance for element1
 *
 * // For singleton instances per HTMLElement, use the getOrCreateInstance method:
 * const anim1 = Animation.getOrCreateInstance(element1); // Returns a new instance for element1, as none exists yet
 * const anim2 = Animation.getOrCreateInstance(element1); // Returns the existing instance for element1, anim1 and anim2 are now the same
 * const anim3 = Animation.getOrCreateInstance(element2); // Returns a new instance for element2, as none exists yet
 */
export class Animation {
  private static instances: Map<DomType, Animation> = new Map();
  private callbacks = new Set<Callback<AnimationProperties>>();

  private state = new State(INITIAL_STATE);

  private dom: Dom;

  // Used to resolve the Promise when the animation is manually stopped outside animate method.
  private resolveAnimationPromise: ((isCompleted: boolean) => void) | null = null;

  private animationFrameID: number;
  private animationDelayTimerID: NodeJS.Timeout;

  public get value() {
    return this.state.value.properties;
  }

  constructor(element: DomSelector) {
    this.dom = new Dom(element);
    this.syncValue();
  }

  public syncValue() {
    const transform = this.dom.getTransform();

    if (transform.scaleX !== transform.scaleY) {
      throw new Error(`Sorry, Animation class support right now just 'scale' and not 'scaleX, scaleY'`);
    }

    const properties: AnimationProperties = {
      transform: {
        x: transform.translateX,
        y: transform.translateY,
        scale: transform.scaleX,
        rotateX: 0, // TODO: Get the current rotate value from element
        rotateY: 0, // TODO: Get the current rotate value from element
      },
      dimension: this.dom.dimension,
      opacity: Number(window.getComputedStyle(this.dom.nativeElement).opacity),
    };

    this.state.deepSet({
      properties,
      previousProperties: deepClone(properties),
    });
  }

  private emit() {
    this.callbacks.forEach((fn) => fn(this.value));
  }

  /**
   * Returns the singleton instance of Animation for a given element
   */
  public static getOrCreateInstance(nativeElement: DomSelector): Animation {
    const element = new Dom(nativeElement);

    if (!Animation.instances.has(element.nativeElement)) {
      Animation.instances.set(element.nativeElement, new Animation(element));
    }
    return Animation.instances.get(element.nativeElement)!;
  }

  // region --- Values ---
  public addValueChangeListener(fn: Callback<AnimationProperties>) {
    this.callbacks.add(fn);
  }

  public removeValueChangeListener(fn: Callback<AnimationProperties>) {
    this.callbacks.delete(fn);
  }

  public addTranslate({ x = 0, y = 0 }: Partial<Coordinate>) {
    const transform = {
      x: this.state.value.properties.transform.x + x,
      y: this.state.value.properties.transform.y + y,
    };
    this.state.deepSet({ properties: { transform } });
    return this;
  }

  public setTranslate(transform: Partial<Coordinate>) {
    const x = transform.x ?? this.state.value.properties.transform.x;
    const y = transform.y ?? this.state.value.properties.transform.y;
    this.state.deepSet({ properties: { transform: { x, y } } });
    return this;
  }

  public addDimension({ width = 0, height = 0 }: Partial<Dimension>) {
    const dimension = {
      width: this.state.value.properties.dimension.width + width,
      height: this.state.value.properties.dimension.height + height,
    };
    this.state.deepSet({ properties: { dimension } });
    return this;
  }

  public setDimension(dimension: Partial<Dimension>) {
    const width = dimension.width ?? this.state.value.properties.dimension.width;
    const height = dimension.height ?? this.state.value.properties.dimension.height;
    this.state.deepSet({ properties: { dimension: { width, height } } });
    return this;
  }

  public flipX() {
    const rotateX = this.state.value.properties.transform.rotateX === 180 ? 0 : 180;
    this.state.deepSet({ properties: { transform: { rotateX } } });
    return this;
  }

  public flipY() {
    const rotateY = this.state.value.properties.transform.rotateY === 180 ? 0 : 180;
    this.state.deepSet({ properties: { transform: { rotateY } } });
    return this;
  }

  public setScale(scale: number) {
    this.state.deepSet({ properties: { transform: { scale } } });
    return this;
  }

  public setOpacity(opacity: number) {
    const boundedOpacity = clamp(opacity, [0, 1]);
    this.state.deepSet({ properties: { opacity: boundedOpacity } });
    return this;
  }

  // endregion

  // region --- animate ----

  public stopAnimation() {
    if (this.state.value.isAnimating) {
      this.state.deepSet({ isAnimating: false });
      cancelAnimationFrame(this.animationFrameID);
      clearTimeout(this.animationDelayTimerID);

      if (this.resolveAnimationPromise) {
        this.resolveAnimationPromise(false);
        this.resolveAnimationPromise = null;
      }
    }
  }

  public applyImmediately() {
    const changesValues = getObjectDiff(this.state.value.previousProperties, this.state.value.properties);

    if (changesValues.transform !== undefined) {
      this.dom.setStyleImmediately('transform', getTransform2dValue(this.state.value.properties.transform));
    }

    if (changesValues.dimension?.width !== undefined) {
      this.dom.setStyleImmediately('width', `${this.state.value.properties.dimension.width}px`);
    }

    if (changesValues.dimension?.height !== undefined) {
      this.dom.setStyleImmediately('height', `${this.state.value.properties.dimension.height}px`);
    }

    if (changesValues.opacity !== undefined) {
      this.dom.setStyleImmediately('opacity', this.state.value.properties.opacity);
    }

    if (Object.keys(changesValues).length > 0) {
      this.emit();
    }

    this.state.deepSet({ previousProperties: deepClone(this.state.value.properties) });
  }

  public apply() {
    return new Promise<boolean>((resolve) => {
      this.stopAnimation();
      this.animationFrameID = requestAnimationFrame(() => {
        this.applyImmediately();
        resolve(true);
      });
    });
  }

  public async animate({ duration = 100, easing = (x: number) => x, delay = 0 } = {}): Promise<boolean> {
    this.validateAnimation(duration, delay);

    return new Promise((resolve) => {
      if (delay > 0) {
        this.animationDelayTimerID = setTimeout(async () => {
          const animateResult = await this.animate({ duration, easing });
          resolve(animateResult);
        }, delay);
      } else {
        this.stopAnimation();

        const valueOnStart = deepClone(this.state.value.previousProperties);
        const valueOnEnd = deepClone(this.state.value.properties);

        let start: number;
        this.state.deepSet({ isAnimating: true });
        this.resolveAnimationPromise = resolve;

        const _animate = (timeStamp: number) => {
          /**
           * Initialize Animation Start Time
           *
           * The 'timeStamp' argument represents the current time in the animation cycle.
           * On the first call, we initialize 'start' with this value to properly calculate
           * frameTime on subsequent frames.
           */
          if (isNullish(start)) {
            start = timeStamp;
          }

          /**
           * Calculate Frame Time
           *
           * FrameTime is a normalized value between 0 and 1 that represents the animation's progress.
           * To ensure it doesn't exceed 1, we use Math.min().
           */
          const frameTime = Math.min(1, (timeStamp - start) / duration);

          // Calculate Animation Progress with Easing Function
          const progress = easing(frameTime);

          // Update Animation State
          this.state.deepSet({
            properties: {
              transform: {
                x: getAnimationValueOnProgress(progress, valueOnStart.transform.x, valueOnEnd.transform.x),
                y: getAnimationValueOnProgress(progress, valueOnStart.transform.y, valueOnEnd.transform.y),
                scale: getAnimationValueOnProgress(progress, valueOnStart.transform.scale, valueOnEnd.transform.scale),
                rotateX: getAnimationValueOnProgress(progress, valueOnStart.transform.rotateX, valueOnEnd.transform.rotateX),
                rotateY: getAnimationValueOnProgress(progress, valueOnStart.transform.rotateY, valueOnEnd.transform.rotateY),
              },
              dimension: {
                width: getAnimationValueOnProgress(progress, valueOnStart.dimension.width, valueOnEnd.dimension.width),
                height: getAnimationValueOnProgress(progress, valueOnStart.dimension.height, valueOnEnd.dimension.height),
              },
              opacity: getAnimationValueOnProgress(progress, valueOnStart.opacity, valueOnEnd.opacity),
            },
          });

          this.applyImmediately();

          // Check for Animation Completion. (frameTime 1, means animation is completed)
          if (frameTime === 1) {
            this.state.deepSet({ isAnimating: false });
            resolve(true);
            this.resolveAnimationPromise = null;
            return;
          }

          // Request the next animation frame if the animation is not complete
          this.animationFrameID = requestAnimationFrame(_animate);
        };

        // Trigger the first animation frame
        this.animationFrameID = requestAnimationFrame(_animate);
      }
    });
  }

  private validateAnimation(duration: number, delay: number) {
    if (duration < 1) {
      throw new Error('the duration of animation cna not be less than 1ms');
    }
    if (delay < 0) {
      throw new Error('the delay of animation cna not be less than 0ms');
    }
  }

  // endregion
}

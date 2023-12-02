import { Dom, DomSelector, DomType } from '../dom/dom';
import { Callback, Coordinate } from '../common/common.model';
import { deepClone, deepmerge, getObjectDiff } from '../common/common.util';
import { State } from '../common/state';
import { AnimationProperties, Dimension } from './animation.model';
import { getAnimationValueOnProgress, getTransform2dValue } from './animation.util';
import { clamp } from '../common/math.util';
import { isNullish } from '../common/ensure.util';

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

  private dom: Dom;
  private previousStateValue: AnimationProperties;
  private state: State<AnimationProperties>;

  // Used to resolve the Promise when the animation is manually stopped outside animate method.
  private resolveAnimationPromise: ((isCompleted: boolean) => void) | null = null;

  private _isAnimating = false;
  public get isAnimating() {
    return this._isAnimating;
  }

  private set isAnimating(isAnimating: boolean) {
    this._isAnimating = isAnimating;
  }

  private animationFrameID: number;
  private animationDelayTimerID: NodeJS.Timeout;

  public get value() {
    return this.state.value;
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

    this.state = new State<AnimationProperties>(
      {
        transform: {
          x: transform.translateX,
          y: transform.translateY,
          scale: transform.scaleX,
          rotateX: 0, // TODO: Get the current rotate value from element
          rotateY: 0, // TODO: Get the current rotate value from element
        },
        dimension: this.dom.dimension,
        opacity: Number(window.getComputedStyle(this.dom.nativeElement).opacity),
      },
      { manualEmitter: true }
    );
    this.previousStateValue = this.state.clone();
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
    this.state.addListener(fn);
  }

  public removeValueChangeListener(fn: Callback<AnimationProperties>) {
    this.state.removeListener(fn);
  }

  public addTranslate({ x = 0, y = 0 }: Partial<Coordinate>) {
    this.state.update((value) =>
      deepmerge(value, {
        transform: {
          x: value.transform.x + x,
          y: value.transform.y + y,
        },
      })
    );
    return this;
  }

  public setTranslate({ x, y }: Partial<Coordinate>) {
    this.state.update((value) =>
      deepmerge(value, {
        transform: {
          x: x ?? value.transform.x,
          y: y ?? value.transform.y,
        },
      })
    );
    return this;
  }

  public addDimension({ width = 0, height = 0 }: Partial<Dimension>) {
    this.state.update((value) =>
      deepmerge(value, {
        dimension: {
          width: value.dimension.width + width,
          height: value.dimension.height + height,
        },
      })
    );
    return this;
  }

  public setDimension({ width, height }: Partial<Dimension>) {
    this.state.update((value) =>
      deepmerge(value, {
        dimension: {
          width: width ?? value.dimension.width,
          height: height ?? value.dimension.height,
        },
      })
    );

    return this;
  }

  public flipX() {
    this.state.update((value) =>
      deepmerge(value, {
        transform: {
          rotateX: value.transform.rotateX === 180 ? 0 : 180,
        },
      })
    );
    return this;
  }

  public flipY() {
    this.state.update((value) =>
      deepmerge(value, {
        transform: {
          rotateY: value.transform.rotateY === 180 ? 0 : 180,
        },
      })
    );
    return this;
  }

  public setScale(scale: number) {
    this.state.update((value) =>
      deepmerge(value, {
        transform: {
          scale: scale,
        },
      })
    );
    return this;
  }

  public setOpacity(opacity: number) {
    const boundedOpacity = clamp(opacity, [0, 1]);
    this.state.update((value) => deepmerge(value, { opacity: boundedOpacity }));
    return this;
  }

  // endregion

  // region --- animate ----

  public stopAnimation() {
    if (this.isAnimating) {
      this.isAnimating = false;
      cancelAnimationFrame(this.animationFrameID);
      clearTimeout(this.animationDelayTimerID);

      if (this.resolveAnimationPromise) {
        this.resolveAnimationPromise(false);
        this.resolveAnimationPromise = null;
      }
    }
  }

  public applyImmediately() {
    const changesValues = getObjectDiff(this.previousStateValue, this.state.value);

    if (changesValues.transform !== undefined) {
      this.dom.setStyleImmediately('transform', getTransform2dValue(this.state.value.transform));
    }

    if (changesValues.dimension?.width !== undefined) {
      this.dom.setStyleImmediately('width', `${this.state.value.dimension.width}px`);
    }

    if (changesValues.dimension?.height !== undefined) {
      this.dom.setStyleImmediately('height', `${this.state.value.dimension.height}px`);
    }

    if (changesValues.opacity !== undefined) {
      this.dom.setStyleImmediately('opacity', this.state.value.opacity);
    }

    if (Object.keys(changesValues).length > 0) {
      this.state.emit();
    }

    this.previousStateValue = this.state.clone();
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

        const valueOnStart = deepClone(this.previousStateValue);
        const valueOnEnd = this.state.clone();

        let start: number;
        this.isAnimating = true;
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
          this.state.update((value) =>
            deepmerge(value, {
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
            })
          );

          this.applyImmediately();

          // Check for Animation Completion. (frameTime 1, means animation is completed)
          if (frameTime === 1) {
            this.isAnimating = false;
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

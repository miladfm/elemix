import { Animation } from './animation';
import { DomSelector } from '../dom/dom';
import { AnimationFrameManager } from './animation-frame-manager';
import { AnimationGroupConfig } from './animation.model';

const DEFAULT_CONFIG: AnimationGroupConfig = {
  disableInstance: false,
};

export class AnimationGroup {
  private readonly config: AnimationGroupConfig;

  private animationDelayTimerID: NodeJS.Timeout;
  private frameManager: AnimationFrameManager | null;

  private instances = new Set<Animation>();

  public get isAnimating() {
    return !!this.frameManager?.isAnimating;
  }

  constructor(instances: (Animation | DomSelector)[] = [], config: Partial<AnimationGroupConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    instances.forEach((instance) => this.add(instance));
  }

  public add(instance: Animation | DomSelector) {
    const animation = instance instanceof Animation ? instance : Animation.getOrCreateInstance(instance);
    animation._disableAnimate = this.config.disableInstance;
    this.instances.add(animation);
  }

  public delete(instance: Animation | DomSelector) {
    const animation = instance instanceof Animation ? instance : Animation.getOrCreateInstance(instance);
    this.instances.delete(animation);
  }

  public stopAnimation() {
    this.instances.forEach((animation) => animation.stopAnimation());
    clearTimeout(this.animationDelayTimerID);
    this.frameManager?.cancel();
    this.frameManager = null;
  }

  public applyImmediately() {
    this.instances.forEach((animation) => animation.applyImmediately());
  }

  public apply() {
    return new Promise<boolean>((resolve) => {
      this.stopAnimation();
      requestAnimationFrame(() => {
        this.applyImmediately();
        resolve(true);
      });
    });
  }

  public async animate({ duration = 100, easing = (x: number) => x, delay = 0 } = {}): Promise<boolean> {
    if (duration <= 0) {
      return this.apply();
    }

    this.stopAnimation();

    return new Promise(async (resolve) => {
      // Handel Delay
      if (delay > 0) {
        this.animationDelayTimerID = setTimeout(async () => {
          const animateResult = await this.animate({ duration, easing });
          resolve(animateResult);
        }, delay);

        return;
      }

      const onAnimateFrame = Array.from(this.instances).map((animation) => animation._getAnimationFrameCallback());
      const hasValuesChanged = onAnimateFrame.some((callback) => callback !== null);

      if (!hasValuesChanged) {
        resolve(true);
        return;
      }

      this.frameManager = new AnimationFrameManager(duration, easing);
      const animateResult = await this.frameManager.animate((progress) => onAnimateFrame.forEach((onProgress) => onProgress?.(progress)));
      this.frameManager = null;
      resolve(animateResult);
    });
  }
}

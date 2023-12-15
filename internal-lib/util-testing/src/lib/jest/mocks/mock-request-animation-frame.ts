/**
 * Configuration options for the mockRequestAnimationFrame function.
 */
interface MockRequestAnimationFrameOptions {
  /**
   * The number of frames to execute.
   * @default 2
   */
  frames?: number;

  /**
   * The frame number to stop execution at.
   * @default Infinity
   */
  stopOnFrames?: number;

  /**
   * The total duration of the animation in milliseconds.
   * @default 100
   */
  duration?: number;

  /**
   * Function to be called before each frame execution.
   */
  beforeEachFrame?: (timestamp: number, frame: number) => void;
}

/**
 * The output object returned by mockRequestAnimationFrame function.
 */
interface MockRequestAnimationFrameOutput {
  /**
   * The mock function for cancelAnimationFrame
   */
  mockCancelAnimationFrameFn: jest.SpyInstance;

  /**
   * The mock function for requestAnimationFrame
   */
  mockRequestAnimationFrameFn: jest.SpyInstance;

  /**
   * The calculated duration of each frame in milliseconds.
   */
  frameDuration: number;

  /**
   * A function that returns the last timestamp passed to `requestAnimationFrame`.
   */
  getLastTime: () => number;

  /**
   * A function that returns the ID of the last frame.
   */
  getLastFrameID: () => number;
}

/**
 * Mocks `window.requestAnimationFrame` for unit tests to simulate multiple frame updates.
 *
 * This function is designed to offer flexibility for multiple test scenarios requiring frame updates.
 * It provides a synchronous behavior suitable for unit tests, enabling assertions for multiple frames.
 *
 * **When to Use**:
 * Use this function to simulate a series of animation frames over time for different test scenarios.
 * It can be configured for a single frame update, multiple frame updates, or to stop at a certain frame.
 *
 * @param {MockRequestAnimationFrameOptions} options - The configuration options for the mock function.
 * @param {number} [options.frames=2] - The total number of frames to simulate. Must be at least 2.
 * @param {number} [options.duration=100] - The total duration for all frames in milliseconds.
 * @param {number} [options.stopOnFrames=Infinity] - The frame at which to stop the simulation.
 * @param {Function} [options.beforeEachFrame] - A callback executed before each frame. Receives the timestamp and frame number.
 *
 * @returns {MockRequestAnimationFrameOutput} - Contains the frameDuration and two getter methods for lastTimestamp and lastFrameID.
 *
 * @example
 * const { frameDuration, getLastTime, getLastFrameID } = mockRequestAnimationFrame({ frames: 5, duration: 200 });
 */
export function mockRequestAnimationFrame({
  frames = 2,
  duration = 100,
  beforeEachFrame,
  stopOnFrames = Infinity,
}: MockRequestAnimationFrameOptions = {}): MockRequestAnimationFrameOutput {
  if (duration < frames) {
    throw new Error('The duration in `mockRequestAnimationFrame` cannot be less than frames.');
  }

  const frameDuration = frames === 1 ? 0 : parseFloat((duration / (frames - 1)).toFixed(4));

  let frameCounter = 0;
  let lastTimestamp = 0;
  let lastFrameID = 0;
  let hasCancelAnimationFrameCalled = false;
  const mockCancelAnimationFrameFn = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
    hasCancelAnimationFrameCalled = true;
  });
  const mockRequestAnimationFrameFn = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    lastFrameID = Math.round(Math.random() * 1000000);

    if (frameCounter < stopOnFrames && !hasCancelAnimationFrameCalled) {
      lastTimestamp = frameDuration * frameCounter;
      frameCounter++;
      if (beforeEachFrame) {
        beforeEachFrame(lastTimestamp, frameCounter);
      }
      if (!hasCancelAnimationFrameCalled) {
        cb(lastTimestamp);
      }
    }

    return lastFrameID;
  });

  return {
    mockCancelAnimationFrameFn,
    mockRequestAnimationFrameFn,
    frameDuration,
    getLastTime: () => lastTimestamp,
    getLastFrameID: () => lastFrameID,
  };
}

export function mockBasicRequestAnimationFrame() {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(1);
    return 0;
  });
}

export function mockClientRect(
  element: Element,
  { width, height, left, top }: { width: number; height: number; top: number; left: number }
) {
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    ...element.getBoundingClientRect(),
    width,
    height,
    x: left,
    y: top,
    left,
    top,
    right: left + width,
    bottom: height + top,
  });
}

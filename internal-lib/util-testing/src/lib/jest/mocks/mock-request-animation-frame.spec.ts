import { mockBasicRequestAnimationFrame, mockRequestAnimationFrame } from './mock-request-animation-frame';
import { mockClientRect } from '@internal-lib/util-testing';

function getMockRequestAnimationFrameCallback(duration: number, onCallback?: (timeStamp: number) => void) {
  let startTime: number;
  const mockCallback = jest.fn().mockImplementation((timeStamp: number) => {
    if (startTime === undefined) {
      startTime = timeStamp;
    }

    if (onCallback) {
      onCallback(timeStamp);
    }

    const frameTime = parseFloat(Math.min(1, (timeStamp - startTime) / duration).toFixed(4));
    if (frameTime !== 1) {
      window.requestAnimationFrame(mockCallback);
    }
  });

  return mockCallback;
}

describe('Util - mockRequestAnimationFrame', () => {
  it('should invoke the callback once when frame count is 1', () => {
    const mockCallback = jest.fn();
    const { mockRequestAnimationFrameFn } = mockRequestAnimationFrame({ frames: 1 });

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockRequestAnimationFrameFn).toHaveBeenCalledTimes(1);
  });

  it('should return 0 for getLastTime and frameDuration when frame count is 1', () => {
    const { getLastTime, frameDuration } = mockRequestAnimationFrame({ frames: 1 });
    window.requestAnimationFrame(jest.fn());
    expect(getLastTime()).toEqual(0);
    expect(frameDuration).toEqual(0);
  });

  it('should throw an error when duration is less than frame count', () => {
    expect(() => mockRequestAnimationFrame({ frames: 10, duration: 5 })).toThrow(
      'The duration in `mockRequestAnimationFrame` cannot be less than frames.'
    );
  });

  it('should sequentially execute the requestAnimationFrame callback based on provided frame count', () => {
    mockRequestAnimationFrame({ frames: 100 });
    const mockCallback = getMockRequestAnimationFrameCallback(100);

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(100);
  });

  it('should provide correct timestamps to requestAnimationFrame callbacks for each individual frame, based on specified duration', () => {
    const duration = 600;
    const frames = 3;
    const frameDuration = duration / (frames - 1);
    let frameCounter = 0;

    const mockCallback = getMockRequestAnimationFrameCallback(
      duration,
      jest.fn().mockImplementation((timeStamp: number) => {
        expect(timeStamp).toEqual(frameDuration * frameCounter);
        frameCounter++;
      })
    );

    mockRequestAnimationFrame({ frames, duration });
    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(frames);
  });

  it('should use a default duration of 100 when none is provided', () => {
    const { frameDuration } = mockRequestAnimationFrame({ frames: 3 });
    const mockCallback = getMockRequestAnimationFrameCallback(100);
    window.requestAnimationFrame(mockCallback);

    expect(frameDuration).toEqual(50); // defaultDuration / (frames - 1)
  });

  it('should use default values for frames if not specified', () => {
    mockRequestAnimationFrame();
    const mockCallback = getMockRequestAnimationFrameCallback(100);

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should return the correct frameDuration based on the provided frame count', () => {
    const { frameDuration } = mockRequestAnimationFrame({ frames: 5 });
    expect(frameDuration).toEqual(25);
  });

  it('should return unique frame IDs for consecutive window.requestAnimationFrame calls', () => {
    mockRequestAnimationFrame({ frames: 2 });
    const frameID1 = window.requestAnimationFrame(jest.fn());
    const frameID2 = window.requestAnimationFrame(jest.fn());
    expect(frameID1).not.toEqual(frameID2);
  });

  it('should return the correct getCurrentTime function based on the provided frame count', () => {
    const { getLastTime } = mockRequestAnimationFrame();
    const mockCallback = getMockRequestAnimationFrameCallback(100);
    window.requestAnimationFrame(mockCallback);
    expect(getLastTime()).toEqual(100);
  });

  it('should return different getLastFrameID values for each frame', () => {
    const { getLastFrameID } = mockRequestAnimationFrame();
    window.requestAnimationFrame(jest.fn());
    const firstFrameID = getLastFrameID();
    window.requestAnimationFrame(jest.fn());
    const secondFrameID = getLastFrameID();

    expect(firstFrameID).not.toEqual(secondFrameID);
  });

  it('should invoke beforeEachFrame function before each frame execution with the correct timestamp and frame number', () => {
    let frameCounter = 0;
    const expectedFrameDuration = 50; // mockRequestAnimationDuration / (mockRequestAnimationFrames - 1)
    const mockBeforeEachFrame = jest.fn().mockImplementation((timeStamp: number, frame: number) => {
      expect(timeStamp).toEqual(expectedFrameDuration * frameCounter);
      frameCounter++;
      expect(frame).toEqual(frameCounter);
    });
    const mockCallback = getMockRequestAnimationFrameCallback(100);

    mockRequestAnimationFrame({ frames: 3, beforeEachFrame: mockBeforeEachFrame });
    window.requestAnimationFrame(mockCallback);

    expect(mockBeforeEachFrame).toHaveBeenCalledTimes(3);
  });

  it('should stop executing requestAnimationFrame callbacks based on provided stopOnFrames value', () => {
    const mockCallback = getMockRequestAnimationFrameCallback(100);

    mockRequestAnimationFrame({ frames: 3, stopOnFrames: 2 });
    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should return the mock function for cancelAnimationFrame', () => {
    const { mockCancelAnimationFrameFn } = mockRequestAnimationFrame();
    expect(mockCancelAnimationFrameFn.mock).toBeDefined();
  });

  it('should return the mock function for requestAnimationFrame', () => {
    const { mockRequestAnimationFrameFn } = mockRequestAnimationFrame();
    expect(mockRequestAnimationFrameFn.mock).toBeDefined();
  });

  it('should cease callback invocation when cancelAnimationFrame is called', () => {
    const mockCallback = getMockRequestAnimationFrameCallback(100);
    const mockBeforeEachFrame = jest.fn().mockImplementation((timestamp, frame) => {
      if (frame === 3) {
        window.cancelAnimationFrame(0);
      }
    });

    mockRequestAnimationFrame({ frames: 6, beforeEachFrame: mockBeforeEachFrame });

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toBeCalledTimes(2);
    expect(mockBeforeEachFrame).toBeCalledTimes(3);
  });
});

describe('Util - mockBasicRequestAnimationFrame', () => {
  it(`should mock requestAnimationFrame when the mock function has called`, () => {
    mockBasicRequestAnimationFrame();
    const mockFn = jest.fn();
    const id = requestAnimationFrame(mockFn);

    expect(typeof id).toBe('number');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('Util - mockClientRect', () => {
  it(`should return the mock client rect value the the getBoundingClientRect called`, () => {
    const element = document.createElement('div');
    mockClientRect(element, { width: 100, height: 200, top: 10, left: 20 });
    expect(element.getBoundingClientRect()).toMatchObject({
      width: 100,
      height: 200,
      x: 20,
      y: 10,
      left: 20,
      top: 10,
      right: 120,
      bottom: 210,
    });
  });
});

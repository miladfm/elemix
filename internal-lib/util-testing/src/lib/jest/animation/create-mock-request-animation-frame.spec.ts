import { createMockRequestAnimationFrame } from './create-mock-request-animation-frame';

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
    const { mockRequestAnimationFrame } = createMockRequestAnimationFrame({ frames: 1 });

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should return 0 for getLastTime and frameDuration when frame count is 1', () => {
    const { getLastTime, frameDuration } = createMockRequestAnimationFrame({ frames: 1 });
    window.requestAnimationFrame(jest.fn());
    expect(getLastTime()).toEqual(0);
    expect(frameDuration).toEqual(0);
  });

  it('should throw an error when duration is less than frame count', () => {
    expect(() => createMockRequestAnimationFrame({ frames: 10, duration: 5 })).toThrow(
      'The duration in `mockRequestAnimationFrame` cannot be less than frames.'
    );
  });

  it('should sequentially execute the requestAnimationFrame callback based on provided frame count', () => {
    createMockRequestAnimationFrame({ frames: 100 });
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

    createMockRequestAnimationFrame({ frames, duration });
    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(frames);
  });

  it('should use a default duration of 100 when none is provided', () => {
    const { frameDuration } = createMockRequestAnimationFrame({ frames: 3 });
    const mockCallback = getMockRequestAnimationFrameCallback(100);
    window.requestAnimationFrame(mockCallback);

    expect(frameDuration).toEqual(50); // defaultDuration / (frames - 1)
  });

  it('should use default values for frames if not specified', () => {
    createMockRequestAnimationFrame();
    const mockCallback = getMockRequestAnimationFrameCallback(100);

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should return the correct frameDuration based on the provided frame count', () => {
    const { frameDuration } = createMockRequestAnimationFrame({ frames: 5 });
    expect(frameDuration).toEqual(25);
  });

  it('should return unique frame IDs for consecutive window.requestAnimationFrame calls', () => {
    createMockRequestAnimationFrame({ frames: 2 });
    const frameID1 = window.requestAnimationFrame(jest.fn());
    const frameID2 = window.requestAnimationFrame(jest.fn());
    expect(frameID1).not.toEqual(frameID2);
  });

  it('should return the correct getCurrentTime function based on the provided frame count', () => {
    const { getLastTime } = createMockRequestAnimationFrame();
    const mockCallback = getMockRequestAnimationFrameCallback(100);
    window.requestAnimationFrame(mockCallback);
    expect(getLastTime()).toEqual(100);
  });

  it('should return different getLastFrameID values for each frame', () => {
    const { getLastFrameID } = createMockRequestAnimationFrame();
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

    createMockRequestAnimationFrame({ frames: 3, beforeEachFrame: mockBeforeEachFrame });
    window.requestAnimationFrame(mockCallback);

    expect(mockBeforeEachFrame).toHaveBeenCalledTimes(3);
  });

  it('should stop executing requestAnimationFrame callbacks based on provided stopOnFrames value', () => {
    const mockCallback = getMockRequestAnimationFrameCallback(100);

    createMockRequestAnimationFrame({ frames: 3, stopOnFrames: 2 });
    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should return the mock function for cancelAnimationFrame', () => {
    const { mockCancelAnimationFrame } = createMockRequestAnimationFrame();
    expect(mockCancelAnimationFrame.mock).toBeDefined();
  });

  it('should return the mock function for requestAnimationFrame', () => {
    const { mockRequestAnimationFrame } = createMockRequestAnimationFrame();
    expect(mockRequestAnimationFrame.mock).toBeDefined();
  });

  it('should cease callback invocation when cancelAnimationFrame is called', () => {
    const mockCallback = getMockRequestAnimationFrameCallback(100);
    const mockBeforeEachFrame = jest.fn().mockImplementation((timestamp, frame) => {
      if (frame === 3) {
        window.cancelAnimationFrame(0);
      }
    });

    createMockRequestAnimationFrame({ frames: 6, beforeEachFrame: mockBeforeEachFrame });

    window.requestAnimationFrame(mockCallback);

    expect(mockCallback).toBeCalledTimes(2);
    expect(mockBeforeEachFrame).toBeCalledTimes(3);
  });
});

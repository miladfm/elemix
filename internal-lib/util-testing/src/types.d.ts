declare namespace jest {
  interface Matchers<R> {
    toBeCalledAsFunctionWith: (input: unknown, expectedOutput: unknown) => void;
    toContainTimes: (input: unknown, times?: number) => void;
  }
}

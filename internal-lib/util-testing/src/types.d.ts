declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R> {
    toBeCalledAsFunctionWith: (input: unknown, expectedOutput: unknown) => void;
    toContainTimes: (input: unknown, times?: number) => void;
    toHaveNotDeepInstances: (obj: unknown) => void;
  }
}

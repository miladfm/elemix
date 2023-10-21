declare namespace jest {
  interface Matchers<R> {
    toBeCalledAsFunctionWith: (input: unknown, expectedOutput: unknown) => void;
  }
}

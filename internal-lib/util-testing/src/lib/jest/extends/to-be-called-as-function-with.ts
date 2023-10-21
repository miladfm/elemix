export const toBeCalledAsFunctionWith = function (actual: jest.Mock, input: unknown, expectedOutput: unknown) {
  expect(actual).toBeCalled();
  const firstCall = actual.mock.calls[0][0];
  if (typeof firstCall !== 'function') {
    return {
      message: () => `expected the first argument to be a function`,
      pass: false,
    };
  }

  const output = firstCall(input);

  if (JSON.stringify(output) === JSON.stringify(expectedOutput)) {
    return {
      message: () => `\nexpected the function not not return ${JSON.stringify(expectedOutput)}`,
      pass: true,
    };
  } else {
    return {
      message: () => `\nexpected the function return ${JSON.stringify(expectedOutput)}\nreceived ${JSON.stringify(output)}`,
      pass: false,
    };
  }
};

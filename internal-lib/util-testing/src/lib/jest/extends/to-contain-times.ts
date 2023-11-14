export const toContainTimes = function (actual: unknown[], expectedOutput: unknown, times?: number) {
  const actualFiltered = actual.filter((value) => value === expectedOutput);

  if (typeof times === 'number') {
    if (actualFiltered.length === times) {
      return {
        message: () => `The '${expectedOutput}' contains '${actual}' ${times} times`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `\nExpected '${expectedOutput}' to be contained in the array ${times} times, but it was found ${actualFiltered.length} times.\n\n` +
          `Expected times: ${times}\n` +
          `Received times: ${actualFiltered.length}\n` +
          `Received array: ${actual}`,
        pass: false,
      };
    }
  }

  if (actualFiltered.length === 0) {
    return {
      message: () =>
        `\nThe '${expectedOutput}' was not found in '${actual}'\n\n` + `Expected value: ${expectedOutput}\n` + `Received array: ${actual}`,
      pass: false,
    };
  }

  return {
    message: () => `The '${actual}' contains '${expectedOutput}'`,
    pass: true,
  };
};

// add all jest-extended matchers
import { toBeCalledAsFunctionWith, toContainTimes } from '@internal-lib/util-testing';

// This line is a workaround to prevent IDE liek WebStorm from mistyping `extend`.
// By default, WebStorm assumes `extend` is part of Node, resulting in a type mismatch error.
// By explicitly assigning `extend` to `expect.extend`, the IDE can correctly identify the type,
// which is provided by Jest, and resolve the issue.
const extend = expect.extend;
extend({
  toBeCalledAsFunctionWith,
  toContainTimes,
});

beforeAll(() => {});
beforeEach(() => {});

afterEach(() => {});
afterAll(() => {});

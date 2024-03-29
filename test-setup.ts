/// <reference types="./node_modules/@types/jest/index.d.ts" />

// add all jest-extended matchers
import { toBeCalledAsFunctionWith, toContainTimes, toHaveNotDeepInstances } from '@internal-lib/util-testing';

// This line is a workaround to prevent IDE liek WebStorm from mistyping `extend`.
// By default, WebStorm assumes `extend` is part of Node, resulting in a type mismatch error.
// By explicitly assigning `extend` to `expect.extend`, the IDE can correctly identify the type,
// which is provided by Jest, and resolve the issue.
const extend = expect.extend;
extend({
  toBeCalledAsFunctionWith,
  toContainTimes,
  toHaveNotDeepInstances,
});

beforeAll(() => {});
beforeEach(() => {});

afterEach(() => {});
afterAll(() => {});

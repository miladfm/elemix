# Testing Guidelines 

## Table of Contents

1. [Introduction](#introduction)
2. [Unit Tests](#unit-tests)
    - [Definition](#definition)
    - [When to Write Unit Tests](#when-to-write-unit-tests)
    - [Examples](#examples)
3. [Integration Tests](#integration-tests)
    - [Definition](#definition-1)
    - [When to Write Integration Tests](#when-to-write-integration-tests)
    - [Examples](#examples-1)

---

## Introduction

Effective testing is crucial for delivering high-quality software. This guide aims to clarify when and how to write unit and integration tests, complete with examples for better understanding.

---
## Unit Tests

### Definition

A unit test isolates the smallest piece of testable software from the remainder of the code and determines whether it behaves exactly as you expect.

### When to Write Unit Tests
- When you want to test a single functionality or method in isolation.
- When you need to confirm the expected output for specific inputs.
- When the logic is complex enough to have multiple edge cases.
- When you need to validate error handling and edge cases.
- When you're testing state changes within the same unit or class.
- When you want to ensure backward compatibility after refactoring or updating dependencies.

### When to Use Mocks in Unit Tests
- Use mocks to isolate the unit of work from internal dependencies. The test should not import anything from our internal dependencies such as utility functions, methods, classes, etc.
- Use mocks to isolate the unit of work from external dependencies such as library calls, native API calls, etc.
- Do not mock the class or method you are testing; focus on its dependencies.
- Mock the behavior of stateful dependencies to validate how the unit of work responds to different states.
- Use mocks to simulate different timing scenarios, especially if your unit has asynchronous code.
- Use a mock when you need to observe specific state changes. This includes counting the number of times a setter or a method is called or tracking the sequence of values it takes on.

#### Examples

##### Testing Error Handling

```javascript
it('should throw an error message for invalid duration', async () => {
  const animation = new Animation(divElement);
  await expect(animation.animate({ duration: 0 })).rejects.toThrow(
    'the duration of animation cannot be less than 1ms'
  );
});
```

##### Testing Internal State Changes
```javascript
it('should set isAnimating to false when the animation completes', async () => {
  const animation = new Animation(divElement);
  createMockRequestAnimationFrame({ frames: 2 });
  await animation.animate();
  expect(animation.isAnimating).toEqual(false);
});
```
---

## Integration Tests

### Definition
Integration tests validate that different units of the application work together as expected. These tests are more concerned with the interaction between these units at a high level.

### When to Write Integration Tests
- When you need to verify the interaction between multiple methods or components.
- When the system's parts have complex dependencies that you need to validate.
- When you need to confirm that your changes haven't broken existing functionality.
- When the application has critical workflows that multiple units contribute to (e.g., user registration, order processing).
- When you need to validate the entire lifecycle of a particular feature.
- When you want to ensure that the system behaves correctly under certain conditions (e.g., low network latency).
- When you want to test the resiliency and fault tolerance of an application.

### When to Use Mocks in Integration Tests
- Don't mock any dependencies that exist in our workspace to genuinely test the interactions.
- Mock the native APIs that do not exist in the test environment (for example, requestAnimationFrame).
- Always mock HTTP requests to control the data and simulate different server scenarios.
- Mock to simulate error conditions or unusual conditions for testing resiliency.
- Use mocks to simulate specific configurations that are hard to recreate in a test environment.
- Use a mock when you need to inspect specific state changes across integrated units. This is particularly useful for observing the ripple effects of a state change on multiple components.

#### Examples

##### Testing Multiple Calls to Animate Method
```javascript
it('should terminate any existing animation before starting a new one', () => {
  const { getLastFrameID } = createMockRequestAnimationFrame({ stopOnFrames: 1});
  jest.spyOn(window, 'cancelAnimationFrame');
  const animation = new Animation(divElement);

  animation.animate();
  const firstFrameID = getLastFrameID();
  animation.animate();

  expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
  expect(cancelAnimationFrame).toHaveBeenCalledWith(firstFrameID);
});
```

##### Testing Animation Delays
```javascript
it('should not start animating until the delay period is over', async () => {
  jest.spyOn(global, 'setTimeout');
  const animation = new Animation(divElement);
  await animation.animate({ delay: 10 });

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10);
});
```

---
### Mocking Example

##### Mocking external dependencies/API

```javascript
const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
```

##### Mocking internal module

```javascript
const mockDomGetTransform = jest.fn().mockReturnValue({ ... });
const mockDomGetOpacity = jest.fn().mockReturnValue(0);
const mockDomSetStyleImmediately = jest.fn();

jest.mock('../../lib/dom/dom', () => ({
  Dom: jest.fn().mockImplementation((selector) => {
    const nativeElement = mockDomInstances.get(selector) || Symbol(selector);
    mockDomInstances.set(selector, nativeElement);
    return {
      nativeElement,
      getTransform: mockDomGetTransform,
      getOpacity: mockDomGetOpacity,
      setStyleImmediately: mockDomSetStyleImmediately,
    };
  }),
}));
```

##### Mocking property or method of a class instances

```javascript
const animation = new Animation();
const mockIsAnimatingGetter =  jest.spyOn(animation, 'isAnimating', 'get').mockReturnValue(true);
const mockIsAnimatingSetter = jest.spyOn(animation, 'isAnimating', 'set');
const mockStopAnimation = jest.spyOn(animation, 'stopAnimation');
```

##### Mocking Internal utils

```javascript
jest.mock('../../lib/common/common.util', () => ({
  deepmerge: jest.fn().mockImplementation((target, source) => source),
  deepClone: jest.fn().mockImplementation((obj) => obj),
  getObjectDiff: jest.fn().mockReturnValue({}),
}));
```
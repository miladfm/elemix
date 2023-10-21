# Test Scenario Standardization Template

## Summary:
This document outlines the standardized template for writing test scenarios, ensuring consistent and descriptive testing. It covers grouping test cases and crafting descriptive test descriptions using active verbs and conditions.

## Grouping:

### Root Grouping
The root group is prefixed according to its type:

- Utility functions: prefix with `Util`
- Unit test for classes: prefix with `Class`
- Integration tests for features: prefix with `Feature`

```javascript
describe('Util - toStr', () => {...})
describe('Class - Animation', () => {...})
describe('Feature - Animation', () => {...})
```

### Child Grouping
The child group focuses on either:

- **Unit Test:** specific method names within the class
- **Integration Test:** Sub-features or steps within a class or feature

```javascript
// Unit Test
describe('Class - Animation', () => {
  describe('addValueChangeListener', () => {...});
})

// Intergration Test
describe('Feature - Animation', () => {
  describe('Value Changes', () => {...});
})
```


## Test Description
Clarity and descriptiveness are key when outlining the test scenario.

### Guidelines for Unit and Integration Tests
For integration tests, the focus should be solely on the behavior without mentioning specific method names.
Example:
```javascript
it('should complete the checkout process when payment is valid', () => {...})
```

For unit tests:
- If the test is about behavior, describe the behavior. Example:
    ```javascript
    it('should return the sum when passed two positive integers', () => {...})
    ```
- Otherwise, describe the implementation. Example:
    ```javascript
  it('should call the sort() method when an array is passed', () => {...})
    ```


### Format

```javascript
Format: it('should <perform some action> when <condition>', () => {...})
```

### \<perform some action\>
Use an active verb to describe the function's behavior. Examples include:

  - return `it('should return true when ...', () => {...})`
  - throw `it('should throw an error when ...', () => {...})`
  - update `it('should update the counter when ...', () => {...})`
  - create `it('should create a new ... when ...', () => {...})`
  - remove `it('should remove a record when ...', () => {...})`
  - increment `it('should increment the counter when ...', () => {...})`
  - decrement `it('should decrement the counter when ...', () => {...})`
  - invoke `it('should invoke the callback function when ...', () => {...})`
  - emit `it('should emit the change event when ...', () => {...})`
  - add `it('should add an item to the array when ...', () => {...})`
  - replace `it('should replace the first item when ...', () => {...})`
  - reject `it('should reject the promise with ... when ...', () => {...})`
  - resolve `it('should resolve the promise with ... when ...', () => {...})`

Be specific about what the function does, such as `return the sum`, `update the state` or `throw an error`.


### \<condition\>

State the specific circumstances under which the test will run, such as:
 
- `when passed an empty array`
- `when the user is not authenticated`
- `when called with a negative number`
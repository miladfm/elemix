import { toStr, isNullish, isNotNullish, isObject } from '../../lib/common/ensure.util';

describe('Util - toStr', () => {
  it('should return a string when a number is provided', () => {
    expect(toStr(123)).toBe('123');
  });

  it('should return a string when a boolean is provided', () => {
    expect(toStr(true)).toBe('true');
    expect(toStr(false)).toBe('false');
  });

  it('should return a string when null is provided', () => {
    expect(toStr(null)).toBe('null');
  });

  it('should return a string when undefined is provided', () => {
    expect(toStr(undefined)).toBe('undefined');
  });

  it('should return a string when an object is provided', () => {
    expect(toStr({ a: 1 })).toBe('[object Object]');
  });

  it('should return the same string when a string is provided', () => {
    expect(toStr('abc')).toBe('abc');
  });
});

describe('Util - isNullish', () => {
  it('should return true when either null or undefined is provided', () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
  });

  it('should return false when any value other than null or undefined is provided', () => {
    expect(isNullish(0)).toBe(false);
    expect(isNullish('')).toBe(false);
    expect(isNullish([])).toBe(false);
    expect(isNullish({})).toBe(false);
    expect(isNullish(true)).toBe(false);
  });
});

describe('Util - isNotNullish', () => {
  it('should return false when either null or undefined is provided', () => {
    expect(isNotNullish(null)).toBe(false);
    expect(isNotNullish(undefined)).toBe(false);
  });

  it('should return true when any value other than null or undefined is provided', () => {
    expect(isNotNullish(0)).toBe(true);
    expect(isNotNullish('')).toBe(true);
    expect(isNotNullish([])).toBe(true);
    expect(isNotNullish({})).toBe(true);
    expect(isNotNullish(true)).toBe(true);
  });
});

describe('Util - isObject', () => {
  it('should return true when an object is provided', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject({ a: 1 })).toBeTruthy();
  });

  it('should return false when an array is provided', () => {
    expect(isObject([])).toBeFalsy();
    expect(isObject([1, 2, 3])).toBeFalsy();
  });

  it('should return false when a non-object type is provided', () => {
    expect(isObject(42)).toBeFalsy();
    expect(isObject('string')).toBeFalsy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(true)).toBeFalsy();
    expect(isObject(() => {})).toBeFalsy();
  });
});

import { deepClone, deepmerge, getObjectDiff } from '../../lib/common/common.util';

describe('Util - deepClone', () => {
  it('should return the primitive type as is when a primitive type is provided', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('str')).toBe('str');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('should return a deep clone of a plain object when a plain object is provided', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clonedObj = deepClone(obj);

    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.b).not.toBe(obj.b);
  });

  it('should return a deep clone of an array when an array is provided', () => {
    const arr = [1, [2, 3], { a: 4 }];
    const clonedArr = deepClone(arr);

    expect(clonedArr).toEqual(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedArr[1]).not.toBe(arr[1]);
    expect(clonedArr[2]).not.toBe(arr[2]);
  });
});

describe('Util - deepmerge', () => {
  it('should return a merged object when flat objects are provided', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepmerge(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should return a merged object when nested objects are provided', () => {
    const target = { a: 1, b: { c: 2 } } as any;
    const source = { b: { d: 3 }, e: 4 } as any;
    const result = deepmerge(target, source);
    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
  });

  it('should not have a side effect on the input objects', () => {
    const target = { a: 1 } as any;
    const source = { b: 2 } as any;
    deepmerge(target, source);
    expect(source).toEqual({ b: 2 });
    expect(source).toBe(source);
    expect(target).toEqual({ a: 1 });
    expect(target).toBe(target);
  });

  it('should skip merging undefined values', () => {
    const obj1: any = { a: 1, b: { c: 2 } };
    const obj2: any = { a: 2, b: { c: undefined } };
    expect(deepmerge(obj1, obj2)).toEqual({ a: 2, b: { c: 2 } });
  });
});

describe('Util - getObjectDiff', () => {
  it('should return an empty object when identical objects are provided', () => {
    const obj1: any = { a: 1, b: 2 };
    const obj2: any = { a: 1, b: 2 };
    expect(getObjectDiff(obj1, obj2)).toEqual({});
  });

  it('should return an object with changed properties when properties have changed', () => {
    const obj1: any = { a: 1, b: 2 };
    const obj2: any = { a: 3, b: 2 };
    expect(getObjectDiff(obj1, obj2)).toEqual({ a: 3 });
  });

  it('should return an object with added properties when new properties are added', () => {
    const obj1: any = { a: 1 };
    const obj2: any = { a: 1, b: 2 };
    expect(getObjectDiff(obj1, obj2)).toEqual({ b: 2 });
  });

  it('should return an object with null values for deleted properties', () => {
    const obj1: any = { a: 1, b: 2 };
    const obj2: any = { a: 1 };
    expect(getObjectDiff(obj1, obj2)).toEqual({ b: null });
  });

  it('should handle nested objects and return an appropriate diff', () => {
    const obj1: any = { a: { b: 1, c: 2 } };
    const obj2: any = { a: { b: 1, c: 3 } };
    expect(getObjectDiff(obj1, obj2)).toEqual({ a: { c: 3 } });
  });

  it('should handle multiple types of diffs and return a comprehensive diff object', () => {
    const obj1: any = { a: 1, b: { c: 2 } };
    const obj2: any = { a: 2, b: { c: 3 }, d: 4 };
    expect(getObjectDiff(obj1, obj2)).toEqual({ a: 2, b: { c: 3 }, d: 4 });
  });
});

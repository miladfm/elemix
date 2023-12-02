import { isObject } from './ensure.util';
import { AnyObject, Class, DeepPartial } from './common.model';

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (const item of obj) {
      arrCopy.push(deepClone(item));
    }
    return arrCopy as unknown as T;
  }

  const objCopy = {} as T;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      objCopy[key] = deepClone(obj[key]);
    }
  }
  return objCopy;
}

export function deepmerge<T extends AnyObject>(target: T, source: DeepPartial<T>): T {
  if (isObject(target) && isObject(source)) {
    const output: AnyObject = { ...target };

    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue === undefined || targetValue === undefined) {
        output[key] = sourceValue ?? targetValue;
        continue;
      }

      if (isObject(sourceValue) && isObject(targetValue)) {
        output[key] = deepmerge(targetValue, sourceValue as typeof targetValue);
      } else {
        output[key] = sourceValue;
      }
    }

    return output as T;
  }

  return source as T;
}

export function getObjectDiff<T extends AnyObject>(obj1: T, obj2: T): Partial<T> {
  const diff: AnyObject = {};

  for (const key in obj1) {
    if (Object.hasOwn(obj2, key)) {
      const areBothObjects = typeof obj1[key] === 'object' && typeof obj2[key] === 'object';
      const isDifferent = obj1[key] !== obj2[key];

      if (areBothObjects) {
        const nestedDiff = getObjectDiff(obj1[key], obj2[key]);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (isDifferent) {
        diff[key] = obj2[key];
      }
    } else {
      diff[key] = null;
    }
  }

  for (const key in obj2) {
    if (!Object.hasOwn(obj1, key)) {
      diff[key] = obj2[key];
    }
  }

  return diff as Partial<T>;
}

export function isImage(element: unknown): element is HTMLImageElement {
  return element instanceof HTMLImageElement;
}

export function isClass<T>(func: any): func is Class<T> {
  return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

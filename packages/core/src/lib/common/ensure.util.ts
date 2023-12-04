import { AnyObject } from './common.model';

/**
 * Converts a given value to its string representation.
 */
export function toStr(value: unknown): string {
  return `${value}`;
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isNotNullish<T>(value: T | null | undefined): value is T {
  return !isNullish(value);
}

export function isObject(value: unknown): value is AnyObject {
  return isNotNullish(value) && typeof value === 'object' && !Array.isArray(value);
}

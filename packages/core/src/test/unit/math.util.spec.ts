import { average, clamp, getDistance } from '../../lib/common/math.util';

describe('Util - clamp', () => {
  it('should return the value when it is within the bounds', () => {
    expect(clamp(5, [1, 10])).toBe(5);
  });

  it('should return minBound when the value is less than minBound', () => {
    expect(clamp(0, [1, 10])).toBe(1);
  });

  it('should return maxBound when the value is greater than maxBound', () => {
    expect(clamp(11, [1, 10])).toBe(10);
  });

  it('should handle negative numbers correctly and return the appropriate bound', () => {
    expect(clamp(-5, [-10, 0])).toBe(-5);
    expect(clamp(-11, [-10, 0])).toBe(-10);
    expect(clamp(1, [-10, 0])).toBe(0);
  });

  it('should return the value when minBound and maxBound are equal and the value matches them', () => {
    expect(clamp(5, [5, 5])).toBe(5);
  });

  it('should return minBound when minBound and maxBound are equal but do not match the value', () => {
    expect(clamp(10, [5, 5])).toBe(5);
    expect(clamp(0, [5, 5])).toBe(5);
  });
});

describe('Util - average', () => {
  it('should return 0 when the array is empty', () => {
    expect(average([])).toBe(0);
  });

  it('should return the element itself when the array contains only one element', () => {
    expect(average([5])).toBe(5);
  });

  it('should calculate the average when the array contains multiple numbers', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
  });

  it('should calculate the average when the array contains negative numbers', () => {
    expect(average([-5, -10, -15])).toBeCloseTo(-10);
  });

  it('should correctly calculate the average when the array contains both positive and negative numbers', () => {
    expect(average([-2, 2])).toBe(0);
  });

  it('should calculate the average when the array contains large numbers', () => {
    expect(average([1000000, 2000000, 3000000])).toBeCloseTo(2000000);
  });

  it('should calculate the average when the array contains decimal numbers', () => {
    expect(average([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
  });

  it('should calculate the average when the array contains same value', () => {
    expect(average([2, 2, 2])).toBeCloseTo(2);
  });
});

describe('Util - getDistance', () => {
  it('should return 0 when both points are the same', () => {
    expect(getDistance(0, 0, 0, 0)).toBe(0);
  });

  it('should return the correct distance when points are on the x-axis', () => {
    expect(getDistance(0, 0, 5, 0)).toBe(5);
  });

  it('should return the correct distance when points are on the y-axis', () => {
    expect(getDistance(0, 0, 0, 5)).toBe(5);
  });

  it('should return the rounded distance for positive coordinates', () => {
    expect(getDistance(1, 2, 4, 6)).toBe(5);
  });

  it('should return the rounded distance for negative coordinates', () => {
    expect(getDistance(-1, -2, -4, -6)).toBe(5);
  });

  it('should return the rounded distance for mixed positive and negative coordinates', () => {
    expect(getDistance(-1, 2, 4, -6)).toBe(9.43);
  });

  it('should return the rounded distance when x1 is greater than x2', () => {
    expect(getDistance(5, 0, 1, 0)).toBe(4);
  });

  it('should return the rounded distance when y1 is greater than y2', () => {
    expect(getDistance(0, 5, 0, 1)).toBe(4);
  });

  it('should handle non-integer values correctly', () => {
    expect(getDistance(1.5, 2.5, 4.5, 6.5)).toBe(5);
  });
});

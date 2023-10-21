import { clamp } from '../../lib/common/math.util';

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

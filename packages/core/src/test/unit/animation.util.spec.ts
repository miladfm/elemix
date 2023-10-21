import { getTransform2dValue } from '../../lib/animation/animation.util';

describe('Util - getTransform2dValue', () => {
  it('should return the default transformation when no arguments are provided', () => {
    const result = getTransform2dValue({});
    expect(result).toBe('translate(0px, 0px) scale(1, 1)');
  });

  it('should return a transformation that includes custom translate values when they are provided', () => {
    const result = getTransform2dValue({ x: 10, y: 20 });
    expect(result).toBe('translate(10px, 20px) scale(1, 1)');
  });

  it('should return a transformation that includes custom scale values when they are provided', () => {
    const result = getTransform2dValue({ scale: 2 });
    expect(result).toBe('translate(0px, 0px) scale(2, 2)');
  });

  it('should return a transformation that includes both custom scale and rotate values when they are provided', () => {
    const result = getTransform2dValue({ scaleX: 2, scaleY: 3, rotateX: 30, rotateY: 40 });
    expect(result).toBe('translate(0px, 0px) scale(1, 1) scaleX(2) scaleY(3) rotateY(40deg) rotateX(30deg)');
  });

  it('should return a transformation that ignores null or undefined values when they are provided', () => {
    const result = getTransform2dValue({ x: 10, y: undefined });
    expect(result).toBe('translate(10px, 0px) scale(1, 1)');
  });
});

import {
  checkFor3DTransforms,
  parseElementTransform,
  parseIndividualTransforms,
  parseMatrixTransform,
} from '../../lib/dom/dom-parse-transform.util';
import { TransformObject } from '../../lib/common/common.model';

const INITIALIZE_TRANSFORM: TransformObject = {
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
};

describe('Util - checkFor3DTransforms', () => {
  it('should return true when passed 3D transforms', () => {
    expect(checkFor3DTransforms('matrix3d()')).toBe(true);
    expect(checkFor3DTransforms('translate3d()')).toBe(true);
    expect(checkFor3DTransforms('scale3d()')).toBe(true);
    expect(checkFor3DTransforms('rotate3d()')).toBe(true);
    expect(checkFor3DTransforms('perspective()')).toBe(true);
  });

  it('should return false when passed 2D transforms', () => {
    expect(checkFor3DTransforms('matrix()')).toBe(false);
    expect(checkFor3DTransforms('translate()')).toBe(false);
  });

  it('should handle multiple transform functions correctly', () => {
    expect(checkFor3DTransforms('matrix() translate3d()')).toBe(true);
    expect(checkFor3DTransforms('matrix() translate()')).toBe(false);
  });

  it('should return false when passed an empty string', () => {
    expect(checkFor3DTransforms('')).toBe(false);
  });
});

describe('Util - parseMatrixTransform', () => {
  it('should parse the matrix correctly when provided a valid matrix', () => {
    expect(parseMatrixTransform('matrix(1, 0, 0, 1, 0, 0)')).toEqual({
      scaleX: 1,
      skewY: 0,
      skewX: 0,
      scaleY: 1,
      translateX: 0,
      translateY: 0,
    });
  });

  it('should return null when passed an empty string', () => {
    expect(() => parseMatrixTransform('')).toThrow('Failed to parse matrix values.');
  });

  it('should throw an error when passed an invalid format', () => {
    expect(() => parseMatrixTransform('invalid matrix')).toThrow('Failed to parse matrix values.');
  });

  it('should throw an error when passed a string with less than 6 values', () => {
    expect(() => parseMatrixTransform('matrix(1, 0, 0)')).toThrow('Failed to parse matrix values.');
  });
});

describe('Util - parseIndividualTransforms', () => {
  it('should parse translate correctly when passed a valid translate function', () => {
    expect(parseIndividualTransforms('translate(10.5px, 20px)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      translateX: 10.5,
      translateY: 20,
    });
    expect(parseIndividualTransforms('translate(10px)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      translateX: 10,
    });
  });

  it('should parse scale correctly when passed a valid scale function', () => {
    expect(parseIndividualTransforms('scale(2, 1.5)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      scaleX: 2,
      scaleY: 1.5,
    });
    expect(parseIndividualTransforms('scale(2)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      scaleX: 2,
    });
  });

  it('should parse skew correctly when passed a valid skew function', () => {
    expect(parseIndividualTransforms('skew(10.4deg, 20deg)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      skewX: 10.4,
      skewY: 20,
    });
    expect(parseIndividualTransforms('skew(10deg)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      skewX: 10,
    });
  });

  it('should parse multiple transformations correctly when passed multiple valid functions', () => {
    expect(parseIndividualTransforms('translate(10px, 20px) scale(2, 2)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      translateX: 10,
      translateY: 20,
      scaleX: 2,
      scaleY: 2,
    });

    expect(parseIndividualTransforms('translate(10px, 20px) scale(2, 2) skew(10deg, 30deg)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      translateX: 10,
      translateY: 20,
      scaleX: 2,
      scaleY: 2,
      skewX: 10,
      skewY: 30,
    });

    expect(parseIndividualTransforms('translate(10px) scale(2) skew(10deg)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      translateX: 10,
      scaleX: 2,
      skewX: 10,
    });

    expect(parseIndividualTransforms('scale(2, 2) skew(10deg, 30deg)')).toEqual({
      ...INITIALIZE_TRANSFORM,
      scaleX: 2,
      scaleY: 2,
      skewX: 10,
      skewY: 30,
    });
  });

  it('should throw an error when passed invalid transform functions', () => {
    expect(() => parseIndividualTransforms('')).toThrow('Failed to parse individual transforms');
    expect(() => parseIndividualTransforms('matrix(10px, 20px)')).toThrow('Failed to parse individual transforms');
    expect(() => parseIndividualTransforms('scaleX(10)')).toThrow('Failed to parse individual transforms');
    expect(() => parseIndividualTransforms('skewX(10deg)')).toThrow('Failed to parse individual transforms');
    expect(() => parseIndividualTransforms('translateX(10px)')).toThrow('Failed to parse individual transforms');
    expect(() => parseIndividualTransforms('translate(10px) skewX(10deg) skewY(10deg)')).toThrow('Failed to parse individual transforms');
  });

  it('should throw an error when a translate unit is missing', () => {
    expect(() => parseIndividualTransforms('translate()')).toThrow('The translate do not have a valid value');
    expect(() => parseIndividualTransforms('translate(10)')).toThrow('The translate do not have a valid value');
    expect(() => parseIndividualTransforms('translate(10px, 3)')).toThrow('The translate do not have a valid value');
    expect(() => parseIndividualTransforms('translate(10%)')).toThrow('The translate do not have a valid value');
  });

  it('should throw an error when a scale unit is missing', () => {
    expect(() => parseIndividualTransforms('scale()')).toThrow('The scale do not have a valid value');
    expect(() => parseIndividualTransforms('scale(2%)')).toThrow('The scale do not have a valid value');
    expect(() => parseIndividualTransforms('scale(1, 2%)')).toThrow('The scale do not have a valid value');
  });

  it('should throw an error when a skew unit is missing', () => {
    expect(() => parseIndividualTransforms('skew()')).toThrow('The skew do not have a valid value');
    expect(() => parseIndividualTransforms('skew(10)')).toThrow('The skew do not have a valid value');
    expect(() => parseIndividualTransforms('skew(10deg, 10)')).toThrow('The skew do not have a valid value');
  });
});

describe('Util - parseElementTransform', () => {
  let element: any;

  beforeEach(() => {
    element = { style: {} };
    window.getComputedStyle = jest.fn(() => ({
      ...document.createElement('div').style,
      transform: element.style.transform || 'none',
    }));
  });

  it('should return default values when no transformations are applied', () => {
    const result = parseElementTransform(element);
    expect(result).toEqual(INITIALIZE_TRANSFORM);
  });

  it('should throw an error when passed 3D transformations', () => {
    element.style.transform = 'rotate3d(1, 1, 1, 45deg)';
    expect(() => parseElementTransform(element)).toThrow("Sorry, we don't support 3D transformations right now.");
  });

  it('should parse matrix transformations correctly when passed a valid matrix', () => {
    element.style.transform = 'matrix(1.5, 3, 4, 2, 50, 10)';
    const result = parseElementTransform(element);
    expect(result).toEqual({
      translateX: 50,
      translateY: 10,
      scaleX: 1.5,
      scaleY: 2,
      skewX: 4,
      skewY: 3,
    });
  });

  it('should handle individual transforms correctly when passed valid individual transform functions', () => {
    element.style.transform = 'translate(10px, 20px)';
    const result = parseElementTransform(element);
    expect(result).toEqual({
      ...INITIALIZE_TRANSFORM,
      translateX: 10,
      translateY: 20,
    });
  });
});

import { TransformObject } from '../common/common.model';
import { INITIALIZE_ELEM_TRANSFORM } from '../common/constant';

/**
 * Check if the transform property includes any 3D transformations
 */
export function checkFor3DTransforms(transform: string): boolean {
  const threeDTransforms = ['matrix3d', 'translate3d', 'scale3d', 'rotate3d', 'perspective'];
  return threeDTransforms.some((func) => transform.includes(func));
}

/**
 * Handle parsing of matrix transformation
 */
export function parseMatrixTransform(transform: string): TransformObject {
  // Regex to match numerical values in matrix
  const matrixValues = transform.match(/-?\d+\.?\d*/g);

  if (!matrixValues || matrixValues.length < 6) {
    throw new Error('Failed to parse matrix values.');
  }

  const [scaleX, skewY, skewX, scaleY, translateX, translateY] = matrixValues.map(Number);
  return { scaleX, skewY, skewX, scaleY, translateX, translateY };
}

/**
 * Handle parsing of individual transform functions like translate, scale, skew
 * Limitation: This function just supports the basic transform value with px units
 *    Valid format:
 *      - translate(10px, 20px) scale(1, 2)
 *    Invalid formats:
 *      - scaleX(2)
 *      - translateX(10px) translateY(5px)
 *      - translateX(10%)
 *      - translate(10px)
 */
export function parseIndividualTransforms(transform: string): TransformObject {
  const transformObject = { ...INITIALIZE_ELEM_TRANSFORM };
  const transformFunctionMatches = Array.from(transform.matchAll(/\b(\w+)\s*\(/g)).map((match) => match[1]);
  validateTransformFunctionMatches(transformFunctionMatches);

  // Translate
  if (transformFunctionMatches.includes('translate')) {
    const match = processTransformFunction('translate', transform, /translate\((-?\d+(?:\.\d+)?)px?(?:,\s*(-?\d+(?:\.\d+)?)px?)?\)/);
    transformObject.translateX = match.x;
    transformObject.translateY = isNaN(match.y) ? transformObject.translateY : match.y;
  }

  // Scale
  if (transformFunctionMatches.includes('scale')) {
    const match = processTransformFunction('scale', transform, /scale\((-?\d+(?:\.\d+)?)(?:,\s*(-?\d+(?:\.\d+)?))?\)/);
    transformObject.scaleX = match.x;
    transformObject.scaleY = isNaN(match.y) ? transformObject.scaleY : match.y;
  }

  // Skew
  if (transformFunctionMatches.includes('skew')) {
    const match = processTransformFunction('skew', transform, /skew\((-?\d+(?:\.\d+)?)deg(?:,\s*(-?\d+(?:\.\d+)?)deg)?\)/);
    transformObject.skewX = match.x;
    transformObject.skewY = isNaN(match.y) ? transformObject.skewY : match.y;
  }

  return transformObject;
}

/**
 * No unit tests; implicitly tested via public functions that use this private helper.
 */

function validateTransformFunctionMatches(transformFunctionMatches: string[]) {
  const hasValidTransformFunction = transformFunctionMatches.every((match) => ['translate', 'scale', 'skew'].includes(match));

  if (!hasValidTransformFunction || transformFunctionMatches.length === 0) {
    throw new Error('Failed to parse individual transforms');
  }
}

/**
 * No unit tests; implicitly tested via public functions that use this private helper.
 */

function processTransformFunction(name: 'translate' | 'scale' | 'skew', transform: string, regex: RegExp) {
  const match = transform.match(regex);

  if (!match) {
    throw new Error(`The ${name} do not have a valid value`);
  }

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  };
}

/**
 * Parses a given element's transform CSS into a structured object.
 */
export function parseElementTransform(element: Element): TransformObject {
  const transform = window.getComputedStyle(element).transform;

  // If no transformations applied, return default values
  if (!transform || transform === 'none') {
    return { ...INITIALIZE_ELEM_TRANSFORM };
  }

  // Validate and reject 3D transformations
  if (checkFor3DTransforms(transform)) {
    throw new Error("Sorry, we don't support 3D transformations right now.");
  }

  // Handle matrix
  if (transform.includes('matrix(')) {
    return parseMatrixTransform(transform);
  }

  return parseIndividualTransforms(transform);
}

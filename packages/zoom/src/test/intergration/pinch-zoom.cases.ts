import { PinchZoomBoundaryType } from '../../lib/pinch-zoom/pinch-zoom.model';

// region SCALE
export interface PinchZoomBoundaryScaleCases {
  index: number;
  boundaryRect: { ratio: '1:1' | '2:1' | '1:2'; width: number; x: number; y: number };
  elemRect: { ratio: '1:1' | '2:1' | '1:2'; width: number; x: number; y: number };
  scaleType: 'minScale' | 'maxScale';
  boundaryType: PinchZoomBoundaryType;
  expected: string;
}

export const pinchZoomBoundaryScaleCases: PinchZoomBoundaryScaleCases[] = [
  // minScale - Inner
  {
    index: 1,
    boundaryRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    elemRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'scale(0.5, 0.5)',
  },
  {
    index: 2,
    boundaryRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    elemRect: { ratio: '2:1', width: 500, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'scale(0.4, 0.4)',
  },
  {
    index: 3,
    boundaryRect: { ratio: '2:1', width: 300, x: 500, y: 500 },
    elemRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'scale(0.375, 0.375)',
  },

  // minScale - Outer
  {
    index: 4,
    boundaryRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    elemRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'scale(0.5, 0.5)',
  },
  {
    index: 5,
    boundaryRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    elemRect: { ratio: '2:1', width: 600, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'scale(0.6666666666666666, 0.6666666666666666)',
  },
  {
    index: 6,
    boundaryRect: { ratio: '2:1', width: 300, x: 500, y: 500 },
    elemRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'scale(0.75, 0.75)',
  },

  // minScale - Auto
  {
    index: 7,
    boundaryRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    elemRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'scale(0.5, 0.5)',
  },
  {
    index: 8,
    boundaryRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    elemRect: { ratio: '2:1', width: 600, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'scale(0.6666666666666666, 0.6666666666666666)',
  },
  {
    index: 9,
    boundaryRect: { ratio: '2:1', width: 300, x: 500, y: 500 },
    elemRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    scaleType: 'minScale',
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'scale(0.75, 0.75)',
  },

  // maxScale - Inner
  {
    index: 10,
    boundaryRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    elemRect: { ratio: '1:1', width: 200, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'scale(2, 2)',
  },
  {
    index: 11,
    boundaryRect: { ratio: '1:1', width: 500, x: 400, y: 400 },
    elemRect: { ratio: '2:1', width: 200, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'scale(2.5, 2.5)',
  },
  {
    index: 12,
    boundaryRect: { ratio: '2:1', width: 400, x: 400, y: 400 },
    elemRect: { ratio: '1:1', width: 150, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'scale(1.333333333333333, 1.333333333333333)',
  },

  // maxScale - Outer
  {
    index: 13,
    boundaryRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    elemRect: { ratio: '1:1', width: 300, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'scale(1.333333333333333, 1.333333333333333)',
  },
  {
    index: 14,
    boundaryRect: { ratio: '1:1', width: 600, x: 400, y: 400 },
    elemRect: { ratio: '2:1', width: 400, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'scale(3, 3)',
  },
  {
    index: 15,
    boundaryRect: { ratio: '2:1', width: 600, x: 400, y: 400 },
    elemRect: { ratio: '1:1', width: 400, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'scale(1.5, 1.5)',
  },

  // maxScale - Auto
  {
    index: 16,
    boundaryRect: { ratio: '1:1', width: 400, x: 400, y: 400 },
    elemRect: { ratio: '1:1', width: 150, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'scale(2.6666666666666665, 2.6666666666666665)',
  },
  {
    index: 17,
    boundaryRect: { ratio: '1:1', width: 600, x: 400, y: 400 },
    elemRect: { ratio: '2:1', width: 400, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'scale(3, 3)',
  },
  {
    index: 18,
    boundaryRect: { ratio: '2:1', width: 400, x: 400, y: 400 },
    elemRect: { ratio: '1:1', width: 300, x: 500, y: 500 },
    scaleType: 'maxScale',
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'scale(1.333333333333333, 1.333333333333333)',
  },
];
// endregion

// region MOVEMENTS

export interface PinchZoomBoundaryMovementCases {
  index: number;
  boundaryRect: { ratio: '1:1' | '2:1' | '1:2'; width: number; x: number; y: number };
  elemRect: { ratio: '1:1' | '2:1' | '1:2'; width: number; x: number; y: number };
  scaleType: 'minScale' | 'maxScale';
  moveTo: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  pointerMovements: {
    fistEvent: { x: number; y: number };
    secondEvent: { x: number; y: number };
  };
  boundaryType: PinchZoomBoundaryType;
  expected: string;
}

const MIN_SCALE_1X1_1X1: Pick<PinchZoomBoundaryMovementCases, 'boundaryRect' | 'elemRect' | 'scaleType'> = {
  boundaryRect: { ratio: '1:1', width: 200, x: 300, y: 300 },
  elemRect: { ratio: '1:1', width: 400, x: 200, y: 200 },
  scaleType: 'minScale',
};
const MAX_SCALE_1X1_1X1: Pick<PinchZoomBoundaryMovementCases, 'boundaryRect' | 'elemRect' | 'scaleType'> = {
  boundaryRect: { ratio: '1:1', width: 400, x: 200, y: 200 },
  elemRect: { ratio: '1:1', width: 200, x: 300, y: 300 },
  scaleType: 'maxScale',
};

const MIN_SCALE_2X1_1X1: Pick<PinchZoomBoundaryMovementCases, 'boundaryRect' | 'elemRect' | 'scaleType'> = {
  boundaryRect: { ratio: '2:1', width: 200, x: 300, y: 300 },
  elemRect: { ratio: '1:1', width: 400, x: 200, y: 200 },
  scaleType: 'minScale',
};
const MAX_SCALE_2X1_1X1: Pick<PinchZoomBoundaryMovementCases, 'boundaryRect' | 'elemRect' | 'scaleType'> = {
  boundaryRect: { ratio: '2:1', width: 400, x: 200, y: 200 },
  elemRect: { ratio: '1:1', width: 200, x: 300, y: 300 },
  scaleType: 'maxScale',
};

const MIN_SCALE_1X1_2X1: Pick<PinchZoomBoundaryMovementCases, 'boundaryRect' | 'elemRect' | 'scaleType'> = {
  boundaryRect: { ratio: '1:1', width: 200, x: 300, y: 300 },
  elemRect: { ratio: '2:1', width: 400, x: 200, y: 200 },
  scaleType: 'minScale',
};
const MAX_SCALE_1X1_2X1: Pick<PinchZoomBoundaryMovementCases, 'boundaryRect' | 'elemRect' | 'scaleType'> = {
  boundaryRect: { ratio: '1:1', width: 400, x: 200, y: 200 },
  elemRect: { ratio: '2:1', width: 200, x: 300, y: 300 },
  scaleType: 'maxScale',
};

const MOVEMENT = 500;

const TOP_LEFT: Pick<PinchZoomBoundaryMovementCases, 'moveTo' | 'pointerMovements'> = {
  moveTo: 'top-left',
  pointerMovements: {
    fistEvent: { x: -MOVEMENT, y: -MOVEMENT },
    secondEvent: { x: -MOVEMENT, y: -MOVEMENT },
  },
};
const TOP_RIGHT: Pick<PinchZoomBoundaryMovementCases, 'moveTo' | 'pointerMovements'> = {
  moveTo: 'top-right',
  pointerMovements: {
    fistEvent: { x: MOVEMENT, y: -MOVEMENT },
    secondEvent: { x: MOVEMENT, y: -MOVEMENT },
  },
};
const BOTTOM_RIGHT: Pick<PinchZoomBoundaryMovementCases, 'moveTo' | 'pointerMovements'> = {
  moveTo: 'bottom-right',
  pointerMovements: {
    fistEvent: { x: MOVEMENT, y: MOVEMENT },
    secondEvent: { x: MOVEMENT, y: MOVEMENT },
  },
};
const BOTTOM_LEFT: Pick<PinchZoomBoundaryMovementCases, 'moveTo' | 'pointerMovements'> = {
  moveTo: 'bottom-left',
  pointerMovements: {
    fistEvent: { x: -MOVEMENT, y: MOVEMENT },
    secondEvent: { x: -MOVEMENT, y: MOVEMENT },
  },
};

export const pinchZoomBoundaryMovementCases: PinchZoomBoundaryMovementCases[] = [
  // region --------- Boundary: 1:1 -  Element: 1:1 -----------

  // minScale - Inner - 1:1, 1:1
  {
    index: 1,
    ...MIN_SCALE_1X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 2,
    ...MIN_SCALE_1X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 3,
    ...MIN_SCALE_1X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 4,
    ...MIN_SCALE_1X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },

  // minScale - Outer - 1:1, 1:1
  {
    index: 5,
    ...MIN_SCALE_1X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 6,
    ...MIN_SCALE_1X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 7,
    ...MIN_SCALE_1X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 8,
    ...MIN_SCALE_1X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },

  // minScale - Auto - 1:1, 1:1
  {
    index: 9,
    ...MIN_SCALE_1X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 10,
    ...MIN_SCALE_1X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 11,
    ...MIN_SCALE_1X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 12,
    ...MIN_SCALE_1X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },

  // maxScale - Inner - 1:1, 1:1
  {
    index: 13,
    ...MAX_SCALE_1X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 14,
    ...MAX_SCALE_1X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 15,
    ...MAX_SCALE_1X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 16,
    ...MAX_SCALE_1X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },

  // maxScale - Outer - 1:1, 1:1
  {
    index: 17,
    ...MAX_SCALE_1X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 18,
    ...MAX_SCALE_1X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 19,
    ...MAX_SCALE_1X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 20,
    ...MAX_SCALE_1X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },

  // maxScale - Auto - 1:1, 1:1
  {
    index: 21,
    ...MAX_SCALE_1X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 22,
    ...MAX_SCALE_1X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 23,
    ...MAX_SCALE_1X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 24,
    ...MAX_SCALE_1X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },

  // endregion

  // region --------- Boundary: 2:1 -  Element: 1:1 -----------

  // minScale - Inner - 2:1, 1:1
  {
    index: 25,
    ...MIN_SCALE_2X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 26,
    ...MIN_SCALE_2X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(200px, 100px)',
  },
  {
    index: 27,
    ...MIN_SCALE_2X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(200px, 100px)',
  },
  {
    index: 28,
    ...MIN_SCALE_2X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },

  // minScale - Outer - 2:1, 1:1
  {
    index: 29,
    ...MIN_SCALE_2X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 0px)',
  },
  {
    index: 30,
    ...MIN_SCALE_2X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 0px)',
  },
  {
    index: 31,
    ...MIN_SCALE_2X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 32,
    ...MIN_SCALE_2X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },

  // minScale - Auto - 2:1, 1:1
  {
    index: 33,
    ...MIN_SCALE_2X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 0px)',
  },
  {
    index: 34,
    ...MIN_SCALE_2X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 0px)',
  },
  {
    index: 35,
    ...MIN_SCALE_2X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 36,
    ...MIN_SCALE_2X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },

  // maxScale - Inner - 2:1, 1:1
  {
    index: 37,
    ...MAX_SCALE_2X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 38,
    ...MAX_SCALE_2X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, -100px)',
  },
  {
    index: 39,
    ...MAX_SCALE_2X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, -100px)',
  },
  {
    index: 40,
    ...MAX_SCALE_2X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },

  // maxScale - Outer - 2:1, 1:1
  {
    index: 41,
    ...MAX_SCALE_2X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -300px)',
  },
  {
    index: 42,
    ...MAX_SCALE_2X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -300px)',
  },
  {
    index: 43,
    ...MAX_SCALE_2X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 44,
    ...MAX_SCALE_2X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },

  // maxScale - Auto - 2:1, 1:1
  {
    index: 45,
    ...MAX_SCALE_2X1_1X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -300px)',
  },
  {
    index: 46,
    ...MAX_SCALE_2X1_1X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -300px)',
  },
  {
    index: 47,
    ...MAX_SCALE_2X1_1X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 48,
    ...MAX_SCALE_2X1_1X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },

  // endregion

  // region --------- Boundary: 1:1 -  Element: 2:1 -----------

  // minScale - Inner - 1:1, 2:1
  {
    index: 49,
    ...MIN_SCALE_1X1_2X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 50,
    ...MIN_SCALE_1X1_2X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 51,
    ...MIN_SCALE_1X1_2X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 200px)',
  },
  {
    index: 52,
    ...MIN_SCALE_1X1_2X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(100px, 200px)',
  },

  // minScale - Outer - 1:1, 2:1
  {
    index: 53,
    ...MIN_SCALE_1X1_2X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, 100px)',
  },
  {
    index: 54,
    ...MIN_SCALE_1X1_2X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 55,
    ...MIN_SCALE_1X1_2X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 56,
    ...MIN_SCALE_1X1_2X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, 100px)',
  },

  // minScale - Auto - 1:1, 2:1
  {
    index: 57,
    ...MIN_SCALE_1X1_2X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, 100px)',
  },
  {
    index: 58,
    ...MIN_SCALE_1X1_2X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 59,
    ...MIN_SCALE_1X1_2X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(100px, 100px)',
  },
  {
    index: 60,
    ...MIN_SCALE_1X1_2X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, 100px)',
  },

  // maxScale - Inner - 1:1, 2:1
  {
    index: 61,
    ...MAX_SCALE_1X1_2X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 62,
    ...MAX_SCALE_1X1_2X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 63,
    ...MAX_SCALE_1X1_2X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, 100px)',
  },
  {
    index: 64,
    ...MAX_SCALE_1X1_2X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Inner,
    expected: 'translate(-100px, 100px)',
  },

  // maxScale - Outer - 1:1, 2:1
  {
    index: 65,
    ...MAX_SCALE_1X1_2X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 66,
    ...MAX_SCALE_1X1_2X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 67,
    ...MAX_SCALE_1X1_2X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, 100px)',
  },
  {
    index: 68,
    ...MAX_SCALE_1X1_2X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Outer,
    expected: 'translate(-100px, 100px)',
  },

  // maxScale - Auto - 1:1, 2:1
  {
    index: 69,
    ...MAX_SCALE_1X1_2X1,
    ...TOP_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 70,
    ...MAX_SCALE_1X1_2X1,
    ...TOP_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, -100px)',
  },
  {
    index: 71,
    ...MAX_SCALE_1X1_2X1,
    ...BOTTOM_RIGHT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, 100px)',
  },
  {
    index: 72,
    ...MAX_SCALE_1X1_2X1,
    ...BOTTOM_LEFT,
    boundaryType: PinchZoomBoundaryType.Auto,
    expected: 'translate(-100px, 100px)',
  },

  // endregion
];

// endregion

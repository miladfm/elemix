import { CROP_HORIZONTAL_STYLE, CROP_VERTICAL_STYLE } from '../support/crop-config';

describe('Crop Resize', () => {
  describe('Crop - Single Zone', () => {
    beforeEach(() => {
      cy.setInitCropHorizontalStyle({}, CROP_HORIZONTAL_STYLE);
    });

    it(`should correctly calculate crop elements style for 'single-zone' and 'top-left'`, () => {
      cy.dragPress('top-left', 167, 245);
      cy.dragStart();
      cy.dragFromTo([167, 245], [387, 370], 10);

      cy.checkCropStyle({
        cropBox: { w: 143, h: 87, x: 387, y: 370 },
        image: { x: -577, y: -577, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragFromTo([387, 370], [269, 269], 10);

      cy.checkCropStyle({
        cropBox: { w: 261, h: 188, x: 269, y: 269 },
        image: { x: -459, y: -476, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 259, x: 170, y: 220 },
        image: { x: -633, y: -656, s: 3.14273 },
        backdrop: { x: -463, y: -436, s: 4.13793 },
      });
    });
    it(`should correctly calculate crop elements style for 'single-zone' and 'top-right'`, () => {
      cy.dragPress('top-right', 529, 240);
      cy.dragStart();

      cy.dragFromTo([529, 240], [283, 400], 10);

      cy.checkCropStyle({
        cropBox: { w: 113, h: 57, x: 170, y: 400 },
        image: { x: -360, y: -607, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragFromTo([283, 400], [399, 268], 10);

      cy.checkCropStyle({
        cropBox: { w: 229, h: 189, x: 170, y: 268 },
        image: { x: -360, y: -475, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 297, x: 170, y: 201 },
        image: { x: -565, y: -746, s: 3.58189 },
        backdrop: { x: -395, y: -545, s: 4.71616 },
      });
    });
    it(`should correctly calculate crop elements style for 'single-zone' and 'bottom-right'`, () => {
      cy.dragPress('bottom-right', 525, 455);
      cy.dragStart();
      cy.dragFromTo([525, 455], [299, 303], 10);

      cy.checkCropStyle({
        cropBox: { w: 129, h: 60, x: 170, y: 243 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragFromTo([299, 303], [383, 411], 10);

      cy.checkCropStyle({
        cropBox: { w: 213, h: 168, x: 170, y: 243 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 283, x: 170, y: 208 },
        image: { x: -608, y: -760, s: 3.85095 },
        backdrop: { x: -438, y: -552, s: 5.07042 },
      });
    });
    it(`should correctly calculate crop elements style for 'single-zone' and 'bottom-left'`, () => {
      cy.dragPress('bottom-left', 173, 458);
      cy.dragStart();
      cy.dragFromTo([173, 458], [377, 357], 10);

      cy.checkCropStyle({
        cropBox: { w: 153, h: 114, x: 377, y: 242 },
        image: { x: -567, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -208, s: 3 },
      });

      cy.dragFromTo([377, 357], [236, 458], 10);

      cy.checkCropStyle({
        cropBox: { w: 294, h: 216, x: 236, y: 242 },
        image: { x: -426, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -208, s: 3 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 264, x: 170, y: 217 },
        image: { x: -521, y: -551, s: 2.78998 },
        backdrop: { x: -351, y: -333, s: 3.67347 },
      });
    });

    it(`should correctly calculate crop elements style for 'single-zone' and 'top'`, () => {
      cy.dragPress('top', 370, 244);
      cy.dragStart();

      cy.dragFromTo([370, 244], [367, 384], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 73, x: 170, y: 384 },
        image: { x: -360, y: -591, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragFromTo([367, 384], [368, 285], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 172, x: 170, y: 285 },
        image: { x: -360, y: -492, s: 2.27848 },
        backdrop: { x: -190, y: -207, s: 3 },
      });

      cy.dragEnd('top');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 172, x: 170, y: 264 },
        image: { x: -360, y: -492, s: 2.27848 },
        backdrop: { x: -190, y: -228, s: 3 },
      });
    });
    it(`should correctly calculate crop elements style for 'single-zone' and 'right'`, () => {
      cy.dragPress('right', 537, 333);
      cy.dragStart();

      cy.dragFromTo([537, 333], [328, 349], 10);

      cy.checkCropStyle({
        cropBox: { w: 158, h: 209, x: 170, y: 245 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -204, s: 3 },
      });

      cy.dragFromTo([328, 349], [501, 269], 10);

      cy.checkCropStyle({
        cropBox: { w: 331, h: 209, x: 170, y: 245 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -204, s: 3 },
      });

      cy.dragEnd('right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 227, x: 170, y: 236 },
        image: { x: -391, y: -489, s: 2.47811 },
        backdrop: { x: -221, y: -253, s: 3.26284 },
      });
    });
    it(`should correctly calculate crop elements style for 'single-zone' and 'bottom'`, () => {
      cy.dragPress('bottom', 353, 464);
      cy.dragStart();

      cy.dragFromTo([353, 464], [399, 313], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 70, x: 170, y: 236 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -214, s: 3 },
      });

      cy.dragFromTo([399, 313], [272, 459], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 218, x: 170, y: 241 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -209, s: 3 },
      });

      cy.dragEnd('bottom');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 218, x: 170, y: 241 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -209, s: 3 },
      });
    });
    it(`should correctly calculate crop elements style for 'single-zone' and 'left'`, () => {
      cy.dragPress('left', 164, 401);
      cy.dragStart();

      cy.dragFromTo([164, 401], [429, 302], 10);

      cy.checkCropStyle({
        cropBox: { w: 101, h: 210, x: 429, y: 244 },
        image: { x: -619, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -205, s: 3 },
      });

      cy.dragFromTo([429, 302], [190, 318], 10);

      cy.checkCropStyle({
        cropBox: { w: 340, h: 210, x: 190, y: 244 },
        image: { x: -380, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -205, s: 3 },
      });

      cy.dragEnd('left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 222, x: 170, y: 238 },
        image: { x: -402, y: -476, s: 2.41251 },
        backdrop: { x: -232, y: -237, s: 3.17647 },
      });
    });
  });

  describe('Crop - BothSide Zone - Horizontal Crop', () => {
    beforeEach(() => {
      cy.setInitCropHorizontalStyle({}, CROP_HORIZONTAL_STYLE);
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-left'`, () => {
      cy.dragPress('top-left', 173, 244);
      cy.dragStart();

      cy.dragFromTo([173, 244], [391, 165], 10);

      cy.checkCropStyle({
        cropBox: { w: 139, h: 370, x: 391, y: 165 },
        image: { x: -581, y: -294, s: 2.27848 },
        backdrop: { x: -190, y: -129, s: 3 },
      });

      cy.dragFromTo([391, 165], [288, 233], 10);

      cy.checkCropStyle({
        cropBox: { w: 242, h: 234, x: 288, y: 233 },
        image: { x: -478, y: -430, s: 2.27848 },
        backdrop: { x: -190, y: -197, s: 3 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 348, x: 170, y: 175 },
        image: { x: -711, y: -639, s: 3.38947 },
        backdrop: { x: -541, y: -463, s: 4.46281 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-right'`, () => {
      cy.dragPress('top-right', 527, 244);
      cy.dragStart();

      cy.dragFromTo([527, 244], [297, 160], 10);

      cy.checkCropStyle({
        cropBox: { w: 127, h: 380, x: 170, y: 160 },
        image: { x: -360, y: -284, s: 2.27848 },
        backdrop: { x: -190, y: -124, s: 3 },
      });

      cy.dragFromTo([297, 160], [422, 228], 10);

      cy.checkCropStyle({
        cropBox: { w: 252, h: 244, x: 170, y: 228 },
        image: { x: -360, y: -420, s: 2.27848 },
        backdrop: { x: -190, y: -192, s: 3 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 348, x: 170, y: 175 },
        image: { x: -514, y: -600, s: 3.25497 },
        backdrop: { x: -344, y: -424, s: 4.28571 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-right'`, () => {
      cy.dragPress('bottom-right', 531, 454);
      cy.dragStart();

      cy.dragFromTo([531, 454], [299, 526], 10);

      cy.checkCropStyle({
        cropBox: { w: 129, h: 352, x: 170, y: 174 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -276, s: 3 },
      });

      cy.dragFromTo([299, 526], [405, 458], 10);

      cy.checkCropStyle({
        cropBox: { w: 235, h: 216, x: 170, y: 242 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -208, s: 3 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 330, x: 170, y: 184 },
        image: { x: -551, y: -689, s: 3.49044 },
        backdrop: { x: -381, y: -504, s: 4.59574 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-left'`, () => {
      cy.dragPress('bottom-left', 170, 459);
      cy.dragStart();

      cy.dragFromTo([170, 459], [431, 539], 10);

      cy.checkCropStyle({
        cropBox: { w: 99, h: 378, x: 431, y: 161 },
        image: { x: -621, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -289, s: 3 },
      });

      cy.dragFromTo([431, 539], [276, 478], 10);

      cy.checkCropStyle({
        cropBox: { w: 254, h: 256, x: 276, y: 222 },
        image: { x: -466, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -228, s: 3 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 362, x: 170, y: 168 },
        image: { x: -660, y: -637, s: 3.22934 },
        backdrop: { x: -490, y: -469, s: 4.25197 },
      });
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top'`, () => {
      cy.dragPress('top', 355, 236);
      cy.dragStart();

      cy.dragFromTo([355, 236], [359, 157], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 386, x: 170, y: 157 },
        image: { x: -360, y: -278, s: 2.27848 },
        backdrop: { x: -190, y: -121, s: 3 },
      });

      cy.dragFromTo([359, 157], [353, 217], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 266, x: 170, y: 217 },
        image: { x: -360, y: -398, s: 2.27848 },
        backdrop: { x: -190, y: -181, s: 3 },
      });

      cy.dragEnd('top');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 266, x: 170, y: 217 },
        image: { x: -360, y: -398, s: 2.27848 },
        backdrop: { x: -190, y: -181, s: 3 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom'`, () => {
      cy.dragPress('bottom', 339, 468);
      cy.dragStart();

      cy.dragFromTo([339, 468], [339, 537], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 374, x: 170, y: 163 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -287, s: 3 },
      });

      cy.dragFromTo([339, 537], [341, 484], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 268, x: 170, y: 216 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -234, s: 3 },
      });

      cy.dragEnd('bottom');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 268, x: 170, y: 216 },
        image: { x: -360, y: -450, s: 2.27848 },
        backdrop: { x: -190, y: -234, s: 3 },
      });
    });
  });

  describe('Crop - BothSide Zone - Vertical Crop', () => {
    beforeEach(() => {
      cy.setInitCropHorizontalStyle({}, CROP_VERTICAL_STYLE);
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-left'`, () => {
      cy.dragPress('top-left', 266, 152);
      cy.dragStart();
      cy.dragFromTo([266, 152], [182, 417], 10);

      cy.checkCropStyle({
        cropBox: { w: 334, h: 133, x: 182, y: 417 },
        image: { x: -194, y: -512, s: 1.87549 },
        backdrop: { x: -11, y: -95, s: 2.4694 },
      });

      cy.dragFromTo([182, 417], [255, 271], 10);

      cy.checkCropStyle({
        cropBox: { w: 188, h: 279, x: 255, y: 271 },
        image: { x: -340, y: -366, s: 1.87549 },
        backdrop: { x: -84, y: -95, s: 2.4694 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 270, h: 400, x: 214, y: 150 },
        image: { x: -487, y: -526, s: 2.68887 },
        backdrop: { x: -272, y: -376, s: 3.54036 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-right'`, () => {
      cy.dragPress('top-right', 437, 156);
      cy.dragStart();
      cy.dragFromTo([437, 156], [518, 450], 10);

      cy.checkCropStyle({
        cropBox: { w: 336, h: 100, x: 181, y: 450 },
        image: { x: -362, y: -545, s: 1.87549 },
        backdrop: { x: -180, y: -95, s: 2.4694 },
      });

      cy.dragFromTo([518, 450], [444, 218], 10);

      cy.checkCropStyle({
        cropBox: { w: 188, h: 332, x: 255, y: 218 },
        image: { x: -362, y: -313, s: 1.87549 },
        backdrop: { x: -106, y: -95, s: 2.4694 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 226, h: 400, x: 236, y: 150 },
        image: { x: -436, y: -378, s: 2.25963 },
        backdrop: { x: -199, y: -228, s: 2.97518 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-right'`, () => {
      cy.dragPress('bottom-right', 436, 556);
      cy.dragStart();
      cy.dragFromTo([436, 556], [524, 290], 10);

      cy.checkCropStyle({
        cropBox: { w: 348, h: 140, x: 175, y: 150 },
        image: { x: -362, y: -245, s: 1.87549 },
        backdrop: { x: -186, y: -95, s: 2.4694 },
      });

      cy.dragFromTo([524, 290], [458, 407], 10);

      cy.checkCropStyle({
        cropBox: { w: 216, h: 257, x: 241, y: 150 },
        image: { x: -362, y: -245, s: 1.87549 },
        backdrop: { x: -120, y: -95, s: 2.4694 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 336, h: 400, x: 181, y: 150 },
        image: { x: -563, y: -382, s: 2.91905 },
        backdrop: { x: -381, y: -232, s: 3.84342 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-left'`, () => {
      cy.dragPress('bottom-left', 272, 548);
      cy.dragStart();

      cy.dragFromTo([272, 548], [178, 294], 10);

      cy.checkCropStyle({
        cropBox: { w: 342, h: 144, x: 178, y: 150 },
        image: { x: -186, y: -245, s: 1.87549 },
        backdrop: { x: -7, y: -95, s: 2.4694 },
      });

      cy.dragFromTo([178, 294], [259, 363], 10);

      cy.checkCropStyle({
        cropBox: { w: 180, h: 213, x: 259, y: 150 },
        image: { x: -348, y: -245, s: 1.87549 },
        backdrop: { x: -88, y: -95, s: 2.4694 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 338, h: 400, x: 180, y: 150 },
        image: { x: -653, y: -461, s: 3.52205 },
        backdrop: { x: -473, y: -311, s: 4.63737 },
      });
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'left'`, () => {
      cy.dragPress('left', 260, 352);
      cy.dragStart();

      cy.dragFromTo([260, 352], [175, 365], 10);

      cy.checkCropStyle({
        cropBox: { w: 348, h: 400, x: 175, y: 150 },
        image: { x: -180, y: -245, s: 1.87549 },
        backdrop: { x: -4, y: -95, s: 2.4694 },
      });

      cy.dragFromTo([175, 365], [249, 357], 10);

      cy.checkCropStyle({
        cropBox: { w: 200, h: 400, x: 249, y: 150 },
        image: { x: -328, y: -245, s: 1.87549 },
        backdrop: { x: -78, y: -95, s: 2.4694 },
      });

      cy.dragEnd('left');
      cy.dragFromTo([249, 357], [249, 357], 10);

      cy.checkCropStyle({
        cropBox: { w: 200, h: 400, x: 249, y: 150 },
        image: { x: -328, y: -245, s: 1.87549 },
        backdrop: { x: -78, y: -95, s: 2.4694 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'right'`, () => {
      cy.dragPress('right', 445, 315);
      cy.dragStart();
      cy.dragFromTo([445, 315], [525, 308], 10);

      cy.checkCropStyle({
        cropBox: { w: 350, h: 400, x: 174, y: 150 },
        image: { x: -362, y: -245, s: 1.87549 },
        backdrop: { x: -187, y: -95, s: 2.4694 },
      });

      cy.dragFromTo([525, 308], [449, 315], 10);

      cy.checkCropStyle({
        cropBox: { w: 198, h: 400, x: 250, y: 150 },
        image: { x: -362, y: -245, s: 1.87549 },
        backdrop: { x: -111, y: -95, s: 2.4694 },
      });

      cy.dragEnd('right');

      cy.checkCropStyle({
        cropBox: { w: 198, h: 400, x: 250, y: 150 },
        image: { x: -362, y: -245, s: 1.87549 },
        backdrop: { x: -111, y: -95, s: 2.4694 },
      });
    });
  });

  describe('Crop - Scale Zone - Horizontal Crop', () => {
    beforeEach(() => {
      cy.setInitCropHorizontalStyle({}, CROP_HORIZONTAL_STYLE);
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-left'`, () => {
      cy.dragPress('top-left', 174, 245);
      cy.dragStart();
      cy.dragFromTo([174, 245], [186, 56], 10);

      cy.checkCropStyle({
        cropBox: { w: 336, h: 400, x: 182, y: 150 },
        image: { x: -204, y: -98, s: 1.71078 },
        backdrop: { x: -22, y: 51, s: 2.25253 },
      });

      cy.dragFromTo([186, 56], [187, -8], 10);

      cy.checkCropStyle({
        cropBox: { w: 334, h: 400, x: 183, y: 150 },
        image: { x: -99, y: -5, s: 1.37258 },
        backdrop: { x: 83, y: 150, s: 1.80723 },
      });

      cy.dragFromTo([187, -8], [155, -4], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 370, x: 170, y: 164 },
        image: { x: -41, y: 0, s: 1.27206 },
        backdrop: { x: 128, y: 164, s: 1.67488 },
      });

      cy.dragFromTo([155, -4], [131, 0], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 332, x: 170, y: 184 },
        image: { x: 0, y: 0, s: 1.13924 },
        backdrop: { x: 170, y: 184, s: 1.5 },
      });

      cy.dragFromTo([131, 0], [74, 129], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -116, y: -39, s: 1.50832 },
        backdrop: { x: 53, y: 110, s: 1.98595 },
      });

      cy.dragFromTo([74, 129], [-4, -3], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 332, x: 170, y: 184 },
        image: { x: 0, y: 0, s: 1.13924 },
        backdrop: { x: 170, y: 184, s: 1.5 },
      });

      cy.dragFromTo([-4, -3], [4, 199], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 306, x: 170, y: 197 },
        image: { x: -8, y: -33, s: 1.16605 },
        backdrop: { x: 161, y: 163, s: 1.53529 },
      });

      cy.dragFromTo([4, 199], [52, 252], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 200, x: 170, y: 250 },
        image: { x: -110, y: -233, s: 1.48771 },
        backdrop: { x: 59, y: 16, s: 1.95882 },
      });

      cy.dragFromTo([52, 252], [103, 274], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 165, x: 170, y: 270 },
        image: { x: -218, y: -367, s: 1.82949 },
        backdrop: { x: -48, y: -97, s: 2.40882 },
      });

      cy.dragFromTo([103, 274], [93, 212], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 280, x: 170, y: 210 },
        image: { x: -196, y: -233, s: 1.76247 },
        backdrop: { x: -26, y: -23, s: 2.32059 },
      });

      cy.dragFromTo([93, 212], [92, 121], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -139, y: -60, s: 1.58063 },
        backdrop: { x: 30, y: 89, s: 2.08116 },
      });

      cy.dragFromTo([92, 121], [209, -6], 10);

      cy.checkCropStyle({
        cropBox: { w: 290, h: 400, x: 205, y: 150 },
        image: { x: -143, y: -5, s: 1.37258 },
        backdrop: { x: 61, y: 150, s: 1.80723 },
      });

      cy.dragFromTo([209, -6], [350, 78], 10);

      cy.checkCropStyle({
        cropBox: { w: 150, h: 400, x: 345, y: 150 },
        image: { x: -432, y: -137, s: 1.84365 },
        backdrop: { x: -86, y: 12, s: 2.42747 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 150, h: 400, x: 274, y: 150 },
        image: { x: -432, y: -137, s: 1.84365 },
        backdrop: { x: -157, y: 12, s: 2.42747 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-right'`, () => {
      cy.dragPress('top-right', 527, 253);
      cy.dragStart();
      cy.dragFromTo([527, 253], [514, 73], 10);

      cy.checkCropStyle({
        cropBox: { w: 334, h: 400, x: 183, y: 150 },
        image: { x: -286, y: -128, s: 1.81345 },
        backdrop: { x: -103, y: 21, s: 2.38771 },
      });

      cy.dragFromTo([514, 73], [514, 3], 10);

      cy.checkCropStyle({
        cropBox: { w: 334, h: 400, x: 183, y: 150 },
        image: { x: -219, y: -5, s: 1.3907 },
        backdrop: { x: -36, y: 144, s: 1.83108 },
      });

      cy.dragFromTo([514, 3], [550, 0], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 360, x: 170, y: 169 },
        image: { x: -195, y: 0, s: 1.23855 },
        backdrop: { x: -25, y: 169, s: 1.63076 },
      });

      cy.dragFromTo([550, 0], [567, 0], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 332, x: 170, y: 184 },
        image: { x: -180, y: 0, s: 1.13924 },
        backdrop: { x: -10, y: 184, s: 1.5 },
      });

      cy.dragFromTo([567, 0], [585, 87], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -241, y: -45, s: 1.52942 },
        backdrop: { x: -71, y: 104, s: 2.01374 },
      });

      cy.dragFromTo([585, 87], [683, 184], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 352, x: 170, y: 174 },
        image: { x: -198, y: -13, s: 1.25316 },
        backdrop: { x: -28, y: 160, s: 1.65 },
      });

      cy.dragFromTo([683, 184], [654, 272], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 176, x: 170, y: 262 },
        image: { x: -228, y: -245, s: 1.44751 },
        backdrop: { x: -58, y: 16, s: 1.90588 },
      });

      cy.dragFromTo([654, 272], [597, 330], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 116, x: 170, y: 319 },
        image: { x: -289, y: -416, s: 1.82949 },
        backdrop: { x: -119, y: -97, s: 2.40882 },
      });

      cy.dragFromTo([597, 330], [550, 175], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 370, x: 170, y: 165 },
        image: { x: -338, y: -254, s: 2.14445 },
        backdrop: { x: -168, y: -89, s: 2.82353 },
      });

      cy.dragFromTo([550, 175], [555, 122], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -306, y: -165, s: 1.94184 },
        backdrop: { x: -136, y: -15, s: 2.55676 },
      });

      cy.dragFromTo([555, 122], [635, 89], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 351, x: 170, y: 174 },
        image: { x: -190, y: 0, s: 1.20643 },
        backdrop: { x: -20, y: 174, s: 1.58847 },
      });

      cy.dragFromTo([635, 89], [533, -3], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 394, x: 170, y: 152 },
        image: { x: -213, y: 0, s: 1.35247 },
        backdrop: { x: -43, y: 152, s: 1.78076 },
      });

      cy.dragFromTo([533, -3], [345, 114], 10);

      cy.checkCropStyle({
        cropBox: { w: 161, h: 400, x: 187, y: 150 },
        image: { x: -325, y: -200, s: 2.06106 },
        backdrop: { x: -138, y: -50, s: 2.71373 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 161, h: 400, x: 269, y: 150 },
        image: { x: -325, y: -200, s: 2.06106 },
        backdrop: { x: -56, y: -50, s: 2.71373 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-right'`, () => {
      cy.dragPress('bottom-right', 527, 447);
      cy.dragStart();
      cy.dragFromTo([527, 447], [518, 641], 10);

      cy.checkCropStyle({
        cropBox: { w: 342, h: 400, x: 179, y: 150 },
        image: { x: -280, y: -350, s: 1.77384 },
        backdrop: { x: -101, y: -200, s: 2.33556 },
      });

      cy.dragFromTo([518, 641], [513, 696], 10);

      cy.checkCropStyle({
        cropBox: { w: 332, h: 400, x: 184, y: 150 },
        image: { x: -232, y: -290, s: 1.46884 },
        backdrop: { x: -48, y: -140, s: 1.93397 },
      });

      cy.dragFromTo([513, 696], [561, 695], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 350, x: 170, y: 174 },
        image: { x: -200, y: -250, s: 1.26664 },
        backdrop: { x: -30, y: -75, s: 1.66774 },
      });

      cy.dragFromTo([561, 695], [593, 694], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 315, x: 170, y: 192 },
        image: { x: -180, y: -225, s: 1.13924 },
        backdrop: { x: -10, y: -32, s: 1.5 },
      });

      cy.dragFromTo([593, 694], [609, 589], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -242, y: -302, s: 1.53279 },
        backdrop: { x: -72, y: -152, s: 2.01818 },
      });

      cy.dragFromTo([609, 589], [690, 566], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 315, x: 170, y: 192 },
        image: { x: -180, y: -225, s: 1.13924 },
        backdrop: { x: -10, y: -32, s: 1.5 },
      });

      cy.dragFromTo([690, 566], [698, 480], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 280, x: 170, y: 210 },
        image: { x: -182, y: -227, s: 1.15264 },
        backdrop: { x: -12, y: -17, s: 1.51765 },
      });

      cy.dragFromTo([698, 480], [624, 437], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 194, x: 170, y: 253 },
        image: { x: -260, y: -325, s: 1.64855 },
        backdrop: { x: -90, y: -72, s: 2.17059 },
      });

      cy.dragFromTo([624, 437], [560, 384], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 142, x: 170, y: 252 },
        image: { x: -328, y: -410, s: 2.07744 },
        backdrop: { x: -158, y: -157, s: 2.73529 },
      });

      cy.dragFromTo([560, 384], [575, 426], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 178, x: 170, y: 257 },
        image: { x: -312, y: -390, s: 1.97692 },
        backdrop: { x: -142, y: -133, s: 2.60294 },
      });

      cy.dragFromTo([575, 426], [630, 503], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 326, x: 170, y: 187 },
        image: { x: -254, y: -317, s: 1.60834 },
        backdrop: { x: -84, y: -130, s: 2.11765 },
      });

      cy.dragFromTo([630, 503], [679, 535], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 353, x: 170, y: 173 },
        image: { x: -202, y: -252, s: 1.27997 },
        backdrop: { x: -32, y: -79, s: 1.6853 },
      });

      cy.dragFromTo([679, 535], [691, 597], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 315, x: 170, y: 192 },
        image: { x: -180, y: -225, s: 1.13924 },
        backdrop: { x: -10, y: -32, s: 1.5 },
      });

      cy.dragFromTo([691, 597], [584, 610], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -250, y: -312, s: 1.58387 },
        backdrop: { x: -80, y: -162, s: 2.08544 },
      });

      cy.dragFromTo([584, 610], [474, 687], 10);

      cy.checkCropStyle({
        cropBox: { w: 254, h: 400, x: 223, y: 150 },
        image: { x: -239, y: -299, s: 1.51875 },
        backdrop: { x: -16, y: -149, s: 1.99968 },
      });

      cy.dragFromTo([474, 687], [442, 600], 10);

      cy.checkCropStyle({
        cropBox: { w: 255, h: 400, x: 191, y: 150 },
        image: { x: -316, y: -395, s: 2.00121 },
        backdrop: { x: -124, y: -245, s: 2.63492 },
      });

      cy.dragFromTo([442, 600], [374, 555], 10);

      cy.checkCropStyle({
        cropBox: { w: 205, h: 400, x: 172, y: 150 },
        image: { x: -355, y: -444, s: 2.25075 },
        backdrop: { x: -183, y: -294, s: 2.96349 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 205, h: 400, x: 247, y: 150 },
        image: { x: -355, y: -444, s: 2.25075 },
        backdrop: { x: -108, y: -294, s: 2.96349 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-left'`, () => {
      cy.dragPress('bottom-left', 175, 451);
      cy.dragStart();
      cy.dragFromTo([175, 451], [195, 652], 10);

      cy.checkCropStyle({
        cropBox: { w: 320, h: 400, x: 190, y: 150 },
        image: { x: -221, y: -338, s: 1.71284 },
        backdrop: { x: -31, y: -188, s: 2.25524 },
      });

      cy.dragFromTo([195, 652], [204, 706], 10);

      cy.checkCropStyle({
        cropBox: { w: 302, h: 400, x: 199, y: 150 },
        image: { x: -155, y: -285, s: 1.44666 },
        backdrop: { x: 43, y: -135, s: 1.90476 },
      });

      cy.dragFromTo([204, 706], [150, 711], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 362, x: 170, y: 168 },
        image: { x: -54, y: -259, s: 1.31263 },
        backdrop: { x: 115, y: -90, s: 1.72829 },
      });

      cy.dragFromTo([150, 711], [109, 708], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 315, x: 170, y: 192 },
        image: { x: 0, y: -225, s: 1.13924 },
        backdrop: { x: 170, y: -32, s: 1.5 },
      });

      cy.dragFromTo([109, 708], [95, 596], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -120, y: -300, s: 1.52078 },
        backdrop: { x: 49, y: -150, s: 2.00236 },
      });

      cy.dragFromTo([95, 596], [42, 588], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 334, x: 170, y: 182 },
        image: { x: -22, y: -238, s: 1.20997 },
        backdrop: { x: 147, y: -56, s: 1.59313 },
      });

      cy.dragFromTo([42, 588], [19, 497], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 306, x: 170, y: 197 },
        image: { x: -40, y: -250, s: 1.26657 },
        backdrop: { x: 129, y: -53, s: 1.66765 },
      });

      cy.dragFromTo([19, 497], [58, 426], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 164, x: 170, y: 268 },
        image: { x: -122, y: -301, s: 1.52792 },
        backdrop: { x: 47, y: -33, s: 2.01176 },
      });

      cy.dragFromTo([58, 426], [102, 336], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 77, x: 170, y: 264 },
        image: { x: -216, y: -360, s: 1.82278 },
        backdrop: { x: -46, y: -95, s: 2.4 },
      });

      cy.dragFromTo([102, 336], [146, 415], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 171, x: 170, y: 250 },
        image: { x: -309, y: -418, s: 2.11765 },
        backdrop: { x: -139, y: -167, s: 2.78824 },
      });

      cy.dragFromTo([146, 415], [110, 528], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 368, x: 170, y: 166 },
        image: { x: -232, y: -370, s: 1.8764 },
        backdrop: { x: -62, y: -204, s: 2.47059 },
      });

      cy.dragFromTo([110, 528], [-1, 476], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 264, x: 170, y: 218 },
        image: { x: 0, y: -225, s: 1.13924 },
        backdrop: { x: 170, y: -7, s: 1.5 },
      });

      cy.dragFromTo([-1, 476], [55, 557], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -104, y: -290, s: 1.469 },
        backdrop: { x: 65, y: -140, s: 1.93418 },
      });

      cy.dragFromTo([55, 557], [144, 625], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -173, y: -333, s: 1.68833 },
        backdrop: { x: -3, y: -183, s: 2.22297 },
      });

      cy.dragFromTo([144, 625], [220, 695], 10);

      cy.checkCropStyle({
        cropBox: { w: 270, h: 400, x: 215, y: 150 },
        image: { x: -195, y: -291, s: 1.47438 },
        backdrop: { x: 19, y: -141, s: 1.94127 },
      });

      cy.dragFromTo([220, 695], [272, 658], 10);

      cy.checkCropStyle({
        cropBox: { w: 216, h: 400, x: 265, y: 150 },
        image: { x: -313, y: -331, s: 1.67957 },
        backdrop: { x: -48, y: -181, s: 2.21143 },
      });

      cy.dragFromTo([272, 658], [401, 600], 10);

      cy.checkCropStyle({
        cropBox: { w: 111, h: 400, x: 396, y: 150 },
        image: { x: -520, y: -395, s: 2.00121 },
        backdrop: { x: -124, y: -245, s: 2.63492 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 111, h: 400, x: 294, y: 150 },
        image: { x: -520, y: -395, s: 2.00121 },
        backdrop: { x: -226, y: -245, s: 2.63492 },
      });
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top'`, () => {
      cy.dragPress('top', 379, 236);
      cy.dragStart();
      cy.dragFromTo([379, 236], [381, 80], 10);

      cy.checkCropStyle({
        cropBox: { w: 293, h: 400, x: 203, y: 150 },
        image: { x: -293, y: -140, s: 1.85573 },
        backdrop: { x: -89, y: 9, s: 2.44337 },
      });

      cy.dragFromTo([381, 80], [384, -7], 10);

      cy.checkCropStyle({
        cropBox: { w: 216, h: 400, x: 241, y: 150 },
        image: { x: -216, y: -5, s: 1.37258 },
        backdrop: { x: 24, y: 150, s: 1.80723 },
      });

      cy.dragFromTo([384, -7], [389, 63], 10);

      cy.checkCropStyle({
        cropBox: { w: 276, h: 400, x: 211, y: 150 },
        image: { x: -276, y: -110, s: 1.75306 },
        backdrop: { x: -65, y: 39, s: 2.30819 },
      });

      cy.dragFromTo([389, 63], [395, 131], 10);

      cy.checkCropStyle({
        cropBox: { w: 341, h: 400, x: 179, y: 150 },
        image: { x: -341, y: -230, s: 2.16373 },
        backdrop: { x: -162, y: -80, s: 2.84892 },
      });

      cy.dragEnd('top');

      cy.checkCropStyle({
        cropBox: { w: 341, h: 400, x: 179, y: 150 },
        image: { x: -341, y: -230, s: 2.16373 },
        backdrop: { x: -162, y: -80, s: 2.84892 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'right'`, () => {
      cy.dragPress('right', 531, 345);
      cy.dragStart();
      cy.dragFromTo([531, 345], [601, 344], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 169, x: 170, y: 265 },
        image: { x: -284, y: -356, s: 1.80268 },
        backdrop: { x: -114, y: -90, s: 2.37353 },
      });

      cy.dragFromTo([601, 344], [703, 340], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 107, x: 170, y: 296 },
        image: { x: -180, y: -225, s: 1.13924 },
        backdrop: { x: -10, y: 71, s: 1.5 },
      });

      cy.dragFromTo([703, 340], [540, 351], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 207, x: 170, y: 246 },
        image: { x: -349, y: -436, s: 2.21147 },
        backdrop: { x: -179, y: -190, s: 2.91176 },
      });

      cy.dragEnd('right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 207, x: 170, y: 246 },
        image: { x: -349, y: -436, s: 2.21147 },
        backdrop: { x: -179, y: -190, s: 2.91176 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom'`, () => {
      cy.dragPress('bottom', 359, 464);
      cy.dragStart();
      cy.dragFromTo([359, 464], [361, 604], 10);

      cy.checkCropStyle({
        cropBox: { w: 312, h: 400, x: 193, y: 150 },
        image: { x: -312, y: -390, s: 1.97902 },
        backdrop: { x: -119, y: -240, s: 2.60571 },
      });

      cy.dragFromTo([361, 604], [369, 710], 10);

      cy.checkCropStyle({
        cropBox: { w: 228, h: 400, x: 235, y: 150 },
        image: { x: -228, y: -285, s: 1.44666 },
        backdrop: { x: 7, y: -135, s: 1.90476 },
      });

      cy.dragFromTo([369, 710], [375, 605], 10);

      cy.checkCropStyle({
        cropBox: { w: 311, h: 400, x: 194, y: 150 },
        image: { x: -311, y: -389, s: 1.97348 },
        backdrop: { x: -117, y: -239, s: 2.59841 },
      });

      cy.dragFromTo([375, 605], [383, 565], 10);

      cy.checkCropStyle({
        cropBox: { w: 346, h: 400, x: 176, y: 150 },
        image: { x: -346, y: -433, s: 2.1953 },
        backdrop: { x: -170, y: -283, s: 2.89048 },
      });

      cy.dragEnd('bottom');

      cy.checkCropStyle({
        cropBox: { w: 346, h: 400, x: 176, y: 150 },
        image: { x: -346, y: -433, s: 2.1953 },
        backdrop: { x: -170, y: -283, s: 2.89048 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'left'`, () => {
      cy.dragPress('left', 171, 340);
      cy.dragStart();
      cy.dragFromTo([171, 340], [102, 343], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 171, x: 170, y: 264 },
        image: { x: -216, y: -360, s: 1.82278 },
        backdrop: { x: -46, y: -95, s: 2.4 },
      });

      cy.dragFromTo([102, 343], [-4, 349], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 107, x: 170, y: 296 },
        image: { x: 0, y: -225, s: 1.13924 },
        backdrop: { x: 170, y: 71, s: 1.5 },
      });

      cy.dragFromTo([-4, 349], [154, 342], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 203, x: 170, y: 248 },
        image: { x: -326, y: -428, s: 2.17126 },
        backdrop: { x: -156, y: -180, s: 2.85882 },
      });

      cy.dragEnd('left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 203, x: 170, y: 248 },
        image: { x: -326, y: -428, s: 2.17126 },
        backdrop: { x: -156, y: -180, s: 2.85882 },
      });
    });
  });

  describe('Crop - Scale Zone - Vertical Crop', () => {
    beforeEach(() => {
      cy.setInitCropHorizontalStyle({}, CROP_VERTICAL_STYLE);
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-left'`, () => {
      cy.dragPress('top-left', 261, 156);
      cy.dragStart();
      cy.dragFromTo([261, 156], [104, 164], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 378, x: 170, y: 160 },
        image: { x: -103, y: -188, s: 1.64629 },
        backdrop: { x: 66, y: -27, s: 2.16762 },
      });

      cy.dragFromTo([104, 164], [5, 176], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 360, x: 170, y: 170 },
        image: { x: -5, y: -87, s: 1.2981 },
        backdrop: { x: 164, y: 82, s: 1.70917 },
      });

      cy.dragFromTo([5, 176], [71, 326], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 193, x: 170, y: 319 },
        image: { x: -71, y: -333, s: 1.53023 },
        backdrop: { x: 98, y: -13, s: 2.0148 },
      });

      cy.dragFromTo([71, 326], [129, 94], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -53, y: -105, s: 1.46762 },
        backdrop: { x: 116, y: 44, s: 1.93237 },
      });

      cy.dragFromTo([129, 94], [52, 115], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -5, y: -46, s: 1.29678 },
        backdrop: { x: 164, y: 103, s: 1.70743 },
      });

      cy.dragFromTo([52, 115], [20, 122], 10);

      cy.checkCropStyle({
        cropBox: { w: 343, h: 400, x: 178, y: 150 },
        image: { x: 0, y: -19, s: 1.21756 },
        backdrop: { x: 178, y: 130, s: 1.60312 },
      });

      cy.dragFromTo([20, 122], [208, 15], 10);

      cy.checkCropStyle({
        cropBox: { w: 272, h: 400, x: 213, y: 150 },
        image: { x: -75, y: -24, s: 1.23281 },
        backdrop: { x: 138, y: 125, s: 1.6232 },
      });

      cy.dragFromTo([208, 15], [214, 3], 10);

      cy.checkCropStyle({
        cropBox: { w: 260, h: 400, x: 219, y: 150 },
        image: { x: -70, y: -4, s: 1.17568 },
        backdrop: { x: 148, y: 145, s: 1.54798 },
      });

      cy.dragFromTo([214, 3], [265, -3], 10);

      cy.checkCropStyle({
        cropBox: { w: 158, h: 400, x: 270, y: 150 },
        image: { x: -168, y: 0, s: 1.1614 },
        backdrop: { x: 101, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([265, -3], [316, 67], 10);

      cy.checkCropStyle({
        cropBox: { w: 94, h: 400, x: 321, y: 150 },
        image: { x: -322, y: -109, s: 1.48036 },
        backdrop: { x: -1, y: 40, s: 1.94914 },
      });

      cy.dragFromTo([316, 67], [266, 116], 10);

      cy.checkCropStyle({
        cropBox: { w: 156, h: 400, x: 271, y: 150 },
        image: { x: -326, y: -190, s: 1.71363 },
        backdrop: { x: -54, y: -40, s: 2.25628 },
      });

      cy.dragFromTo([266, 116], [223, 120], 10);

      cy.checkCropStyle({
        cropBox: { w: 242, h: 400, x: 228, y: 150 },
        image: { x: -245, y: -196, s: 1.73267 },
        backdrop: { x: -17, y: -46, s: 2.28136 },
      });

      cy.dragFromTo([223, 120], [123, 43], 10);

      cy.checkCropStyle({
        cropBox: { w: 339, h: 400, x: 180, y: 150 },
        image: { x: 0, y: -14, s: 1.20373 },
        backdrop: { x: 180, y: 135, s: 1.58491 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 339, h: 400, x: 180, y: 150 },
        image: { x: 0, y: -14, s: 1.20373 },
        backdrop: { x: 180, y: 135, s: 1.58491 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top-right'`, () => {
      cy.dragPress('top-right', 430, 150);
      cy.dragStart();
      cy.dragFromTo([430, 150], [613, 159], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 382, x: 170, y: 159 },
        image: { x: -306, y: -163, s: 1.58492 },
        backdrop: { x: -136, y: -4, s: 2.08682 },
      });

      cy.dragFromTo([613, 159], [695, 169], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 362, x: 170, y: 169 },
        image: { x: -250, y: -85, s: 1.29844 },
        backdrop: { x: -80, y: 83, s: 1.70961 },
      });

      cy.dragFromTo([695, 169], [638, 235], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 276, x: 170, y: 233 },
        image: { x: -289, y: -239, s: 1.49758 },
        backdrop: { x: -119, y: -6, s: 1.97182 },
      });

      cy.dragFromTo([638, 235], [552, 313], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 229, x: 170, y: 312 },
        image: { x: -347, y: -389, s: 1.79804 },
        backdrop: { x: -177, y: -77, s: 2.36743 },
      });

      cy.dragFromTo([552, 313], [583, 157], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 390, x: 170, y: 154 },
        image: { x: -326, y: -191, s: 1.68974 },
        backdrop: { x: -156, y: -36, s: 2.22482 },
      });

      cy.dragFromTo([583, 157], [594, 73], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -248, y: -42, s: 1.28474 },
        backdrop: { x: -78, y: 107, s: 1.69158 },
      });

      cy.dragFromTo([594, 73], [599, 37], 10);

      cy.checkCropStyle({
        cropBox: { w: 326, h: 400, x: 186, y: 150 },
        image: { x: -224, y: 0, s: 1.1614 },
        backdrop: { x: -37, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([599, 37], [468, 45], 10);

      cy.checkCropStyle({
        cropBox: { w: 242, h: 400, x: 228, y: 150 },
        image: { x: -265, y: -73, s: 1.37563 },
        backdrop: { x: -36, y: 76, s: 1.81125 },
      });

      cy.dragFromTo([468, 45], [455, -3], 10);

      cy.checkCropStyle({
        cropBox: { w: 216, h: 400, x: 241, y: 150 },
        image: { x: -224, y: 0, s: 1.1614 },
        backdrop: { x: 17, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([455, -3], [418, -2], 10);

      cy.checkCropStyle({
        cropBox: { w: 142, h: 400, x: 278, y: 150 },
        image: { x: -224, y: 0, s: 1.1614 },
        backdrop: { x: 54, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([418, -2], [371, 123], 10);

      cy.checkCropStyle({
        cropBox: { w: 102, h: 400, x: 272, y: 150 },
        image: { x: -337, y: -201, s: 1.74695 },
        backdrop: { x: -64, y: -51, s: 2.30016 },
      });

      cy.dragFromTo([371, 123], [376, -4], 10);

      cy.checkCropStyle({
        cropBox: { w: 79, h: 400, x: 298, y: 150 },
        image: { x: -224, y: 0, s: 1.1614 },
        backdrop: { x: 74, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([376, -4], [474, -22], 10);

      cy.checkCropStyle({
        cropBox: { w: 254, h: 400, x: 222, y: 150 },
        image: { x: -224, y: 0, s: 1.1614 },
        backdrop: { x: -1, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([474, -22], [540, 141], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -347, y: -218, s: 1.79712 },
        backdrop: { x: -177, y: -68, s: 2.36621 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -347, y: -218, s: 1.79712 },
        backdrop: { x: -177, y: -68, s: 2.36621 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-right'`, () => {
      cy.dragPress('bottom-right', 430, 542);
      cy.dragStart();
      cy.dragFromTo([430, 542], [612, 528], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 367, x: 170, y: 166 },
        image: { x: -306, y: -208, s: 1.58842 },
        backdrop: { x: -136, y: -42, s: 2.09142 },
      });

      cy.dragFromTo([612, 528], [694, 525], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 366, x: 170, y: 167 },
        image: { x: -251, y: -170, s: 1.30193 },
        backdrop: { x: -81, y: -3, s: 1.71421 },
      });

      cy.dragFromTo([694, 525], [701, 558], 10);

      cy.checkCropStyle({
        cropBox: { w: 349, h: 400, x: 175, y: 150 },
        image: { x: -240, y: -163, s: 1.24375 },
        backdrop: { x: -64, y: -13, s: 1.63761 },
      });

      cy.dragFromTo([701, 558], [592, 618], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -258, y: -175, s: 1.33695 },
        backdrop: { x: -88, y: -25, s: 1.76032 },
      });

      cy.dragFromTo([592, 618], [535, 705], 10);

      cy.checkCropStyle({
        cropBox: { w: 327, h: 400, x: 186, y: 150 },
        image: { x: -225, y: -152, s: 1.16664 },
        backdrop: { x: -39, y: -2, s: 1.53608 },
      });

      cy.dragFromTo([535, 705], [449, 637], 10);

      cy.checkCropStyle({
        cropBox: { w: 204, h: 400, x: 247, y: 150 },
        image: { x: -282, y: -192, s: 1.46436 },
        backdrop: { x: -34, y: -42, s: 1.92807 },
      });

      cy.dragFromTo([449, 637], [336, 579], 10);

      cy.checkCropStyle({
        cropBox: { w: 66, h: 400, x: 272, y: 150 },
        image: { x: -335, y: -227, s: 1.73845 },
        backdrop: { x: -62, y: -77, s: 2.28896 },
      });

      cy.dragFromTo([336, 579], [360, 669], 10);

      cy.checkCropStyle({
        cropBox: { w: 71, h: 400, x: 291, y: 150 },
        image: { x: -253, y: -172, s: 1.31313 },
        backdrop: { x: 38, y: -22, s: 1.72896 },
      });

      cy.dragFromTo([360, 669], [480, 616], 10);

      cy.checkCropStyle({
        cropBox: { w: 266, h: 400, x: 216, y: 150 },
        image: { x: -301, y: -205, s: 1.56359 },
        backdrop: { x: -85, y: -55, s: 2.05874 },
      });

      cy.dragFromTo([480, 616], [500, 677], 10);

      cy.checkCropStyle({
        cropBox: { w: 306, h: 400, x: 196, y: 150 },
        image: { x: -246, y: -167, s: 1.27533 },
        backdrop: { x: -49, y: -17, s: 1.67919 },
      });

      cy.dragFromTo([500, 677], [564, 666], 10);

      cy.checkCropStyle({
        cropBox: { w: 339, h: 400, x: 180, y: 150 },
        image: { x: -233, y: -158, s: 1.20794 },
        backdrop: { x: -52, y: -8, s: 1.59045 },
      });

      cy.dragFromTo([564, 666], [674, 502], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 320, x: 170, y: 190 },
        image: { x: -264, y: -179, s: 1.37181 },
        backdrop: { x: -94, y: 10, s: 1.80621 },
      });

      cy.dragFromTo([674, 502], [640, 445], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 262, x: 170, y: 191 },
        image: { x: -287, y: -195, s: 1.49059 },
        backdrop: { x: -117, y: -4, s: 1.96262 },
      });

      cy.dragFromTo([640, 445], [609, 410], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 238, x: 170, y: 179 },
        image: { x: -308, y: -209, s: 1.5989 },
        backdrop: { x: -138, y: -30, s: 2.10522 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 238, x: 170, y: 230 },
        image: { x: -308, y: -209, s: 1.5989 },
        backdrop: { x: -138, y: 20, s: 2.10522 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom-left'`, () => {
      cy.dragPress('bottom-left', 270, 547);
      cy.dragStart();
      cy.dragFromTo([270, 547], [111, 533], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 358, x: 170, y: 171 },
        image: { x: -110, y: -219, s: 1.67091 },
        backdrop: { x: 59, y: -47, s: 2.20003 },
      });

      cy.dragFromTo([111, 533], [-1, 538], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 382, x: 170, y: 159 },
        image: { x: 0, y: -167, s: 1.27759 },
        backdrop: { x: 170, y: -8, s: 1.68216 },
      });

      cy.dragFromTo([-1, 538], [3, 572], 10);

      cy.checkCropStyle({
        cropBox: { w: 334, h: 400, x: 182, y: 150 },
        image: { x: 0, y: -155, s: 1.1871 },
        backdrop: { x: 182, y: -5, s: 1.56302 },
      });

      cy.dragFromTo([3, 572], [82, 579], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -43, y: -187, s: 1.43187 },
        backdrop: { x: 126, y: -37, s: 1.8853 },
      });

      cy.dragFromTo([82, 579], [205, 698], 10);

      cy.checkCropStyle({
        cropBox: { w: 296, h: 400, x: 201, y: 150 },
        image: { x: -35, y: -154, s: 1.17609 },
        backdrop: { x: 166, y: -4, s: 1.54852 },
      });

      cy.dragFromTo([205, 698], [254, 663], 10);

      cy.checkCropStyle({
        cropBox: { w: 198, h: 400, x: 250, y: 150 },
        image: { x: -179, y: -175, s: 1.34149 },
        backdrop: { x: 71, y: -25, s: 1.7663 },
      });

      cy.dragFromTo([254, 663], [357, 597], 10);

      cy.checkCropStyle({
        cropBox: { w: 69, h: 400, x: 353, y: 150 },
        image: { x: -396, y: -216, s: 1.65338 },
        backdrop: { x: -42, y: -66, s: 2.17696 },
      });

      cy.dragFromTo([357, 597], [282, 572], 10);

      cy.checkCropStyle({
        cropBox: { w: 150, h: 400, x: 278, y: 150 },
        image: { x: -349, y: -232, s: 1.77152 },
        backdrop: { x: -70, y: -82, s: 2.33251 },
      });

      cy.dragFromTo([282, 572], [211, 608], 10);

      cy.checkCropStyle({
        cropBox: { w: 284, h: 400, x: 207, y: 150 },
        image: { x: -166, y: -209, s: 1.6014 },
        backdrop: { x: 40, y: -59, s: 2.10851 },
      });

      cy.dragFromTo([211, 608], [142, 636], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 400, x: 170, y: 150 },
        image: { x: -27, y: -180, s: 1.37353 },
        backdrop: { x: 142, y: -30, s: 1.80848 },
      });

      cy.dragFromTo([142, 636], [124, 665], 10);

      cy.checkCropStyle({
        cropBox: { w: 330, h: 400, x: 184, y: 150 },
        image: { x: 0, y: -153, s: 1.17318 },
        backdrop: { x: 184, y: -3, s: 1.54469 },
      });

      cy.dragFromTo([124, 665], [47, 478], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 282, x: 170, y: 195 },
        image: { x: -47, y: -189, s: 1.44582 },
        backdrop: { x: 122, y: 6, s: 1.90366 },
      });

      cy.dragFromTo([47, 478], [153, 476], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 325, x: 170, y: 156 },
        image: { x: -152, y: -238, s: 1.81863 },
        backdrop: { x: 17, y: -82, s: 2.39453 },
      });

      cy.dragFromTo([153, 476], [145, 480], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 323, x: 170, y: 159 },
        image: { x: -144, y: -234, s: 1.79049 },
        backdrop: { x: 25, y: -75, s: 2.35748 },
      });

      cy.dragFromTo([145, 480], [100, 329], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 156, x: 170, y: 175 },
        image: { x: -99, y: -214, s: 1.63222 },
        backdrop: { x: 70, y: -38, s: 2.1491 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 156, x: 170, y: 271 },
        image: { x: -99, y: -214, s: 1.63222 },
        backdrop: { x: 70, y: 57, s: 2.1491 },
      });
    });

    it(`should correctly calculate crop elements style for 'both-side-zone' and 'top'`, () => {
      cy.dragPress('top', 362, 146);
      cy.dragStart();
      cy.dragFromTo([362, 146], [362, 47], 10);

      cy.checkCropStyle({
        cropBox: { w: 122, h: 400, x: 288, y: 150 },
        image: { x: -267, y: -77, s: 1.38515 },
        backdrop: { x: 21, y: 72, s: 1.82378 },
      });

      cy.dragFromTo([362, 47], [363, -31], 10);

      cy.checkCropStyle({
        cropBox: { w: 103, h: 400, x: 298, y: 150 },
        image: { x: -224, y: 0, s: 1.1614 },
        backdrop: { x: 74, y: 150, s: 1.52918 },
      });

      cy.dragFromTo([363, -31], [357, 92], 10);

      cy.checkCropStyle({
        cropBox: { w: 141, h: 400, x: 279, y: 150 },
        image: { x: -308, y: -150, s: 1.59938 },
        backdrop: { x: -29, y: 0, s: 2.10585 },
      });

      cy.dragFromTo([357, 92], [358, 119], 10);

      cy.checkCropStyle({
        cropBox: { w: 153, h: 400, x: 273, y: 150 },
        image: { x: -333, y: -195, s: 1.72791 },
        backdrop: { x: -60, y: -45, s: 2.27509 },
      });

      cy.dragEnd('top');

      cy.checkCropStyle({
        cropBox: { w: 153, h: 400, x: 273, y: 150 },
        image: { x: -333, y: -195, s: 1.72791 },
        backdrop: { x: -60, y: -45, s: 2.27509 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'right'`, () => {
      cy.dragPress('right', 437, 353);
      cy.dragStart();
      cy.dragFromTo([437, 353], [610, 355], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 340, x: 170, y: 179 },
        image: { x: -308, y: -209, s: 1.5954 },
        backdrop: { x: -138, y: -29, s: 2.10062 },
      });

      cy.dragFromTo([610, 355], [710, 355], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 273, x: 170, y: 213 },
        image: { x: -247, y: -168, s: 1.28156 },
        backdrop: { x: -77, y: 45, s: 1.68739 },
      });

      cy.dragFromTo([710, 355], [546, 365], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 387, x: 170, y: 156 },
        image: { x: -351, y: -238, s: 1.819 },
        backdrop: { x: -181, y: -82, s: 2.39503 },
      });

      cy.dragEnd('right');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 387, x: 170, y: 156 },
        image: { x: -351, y: -238, s: 1.819 },
        backdrop: { x: -181, y: -82, s: 2.39503 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'bottom'`, () => {
      cy.dragPress('bottom', 344, 554);
      cy.dragStart();
      cy.dragFromTo([344, 554], [343, 661], 10);

      cy.checkCropStyle({
        cropBox: { w: 119, h: 400, x: 290, y: 150 },
        image: { x: -260, y: -177, s: 1.35094 },
        backdrop: { x: 29, y: -27, s: 1.77874 },
      });

      cy.dragFromTo([343, 661], [343, 707], 10);

      cy.checkCropStyle({
        cropBox: { w: 103, h: 400, x: 298, y: 150 },
        image: { x: -225, y: -152, s: 1.16664 },
        backdrop: { x: 72, y: -2, s: 1.53608 },
      });

      cy.dragFromTo([343, 707], [355, 566], 10);

      cy.checkCropStyle({
        cropBox: { w: 159, h: 400, x: 270, y: 150 },
        image: { x: -347, y: -236, s: 1.79988 },
        backdrop: { x: -77, y: -86, s: 2.36985 },
      });

      cy.dragEnd('bottom');

      cy.checkCropStyle({
        cropBox: { w: 159, h: 400, x: 270, y: 150 },
        image: { x: -347, y: -236, s: 1.79988 },
        backdrop: { x: -77, y: -86, s: 2.36985 },
      });
    });
    it(`should correctly calculate crop elements style for 'both-side-zone' and 'left'`, () => {
      cy.dragPress('left', 270, 359);
      cy.dragStart();
      cy.dragFromTo([270, 359], [103, 375], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 350, x: 170, y: 174 },
        image: { x: -102, y: -215, s: 1.64277 },
        backdrop: { x: 67, y: -40, s: 2.16299 },
      });

      cy.dragFromTo([103, 375], [-5, 372], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 272, x: 170, y: 213 },
        image: { x: 0, y: -167, s: 1.27759 },
        backdrop: { x: 170, y: 46, s: 1.68216 },
      });

      cy.dragFromTo([-5, 372], [143, 288], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 380, x: 170, y: 159 },
        image: { x: -142, y: -233, s: 1.78346 },
        backdrop: { x: 27, y: -74, s: 2.34822 },
      });

      cy.dragEnd('left');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 380, x: 170, y: 159 },
        image: { x: -142, y: -233, s: 1.78346 },
        backdrop: { x: 27, y: -74, s: 2.34822 },
      });
    });
  });
});

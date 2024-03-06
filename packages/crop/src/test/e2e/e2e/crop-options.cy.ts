describe('Crop Options', () => {
  describe('Crop - Min Width and Height', () => {
    beforeEach(() => {
      cy.setInitCropHorizontalStyle({ minWidth: 100, minHeight: 200 });
    });

    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'top-left'`, () => {
      cy.dragPress('top-left', 172, 174);
      cy.dragStart();
      cy.dragFromTo([172, 174], [526, 475], 5);

      cy.checkCropStyle({
        cropBox: { w: 100, h: 200, x: 430, y: 330 },
        image: { x: -260, y: -160, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 200, h: 400, x: 250, y: 150 },
        image: { x: -520, y: -320, s: 1.51899 },
        backdrop: { x: -270, y: -170, s: 2 },
      });
    });
    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'top-right'`, () => {
      cy.dragPress('top-right', 528, 171);
      cy.dragStart();
      cy.dragFromTo([528, 171], [228, 472], 5);

      cy.checkCropStyle({
        cropBox: { w: 100, h: 200, x: 170, y: 330 },
        image: { x: 0, y: -160, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 200, h: 400, x: 250, y: 150 },
        image: { x: 0, y: -320, s: 1.51899 },
        backdrop: { x: 250, y: -170, s: 2 },
      });
    });
    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'bottom-right'`, () => {
      cy.dragPress('bottom-right', 533, 535);
      cy.dragStart();
      cy.dragFromTo([533, 535], [153, 114], 5);

      cy.checkCropStyle({
        cropBox: { w: 100, h: 200, x: 170, y: 170 },
        image: { x: 0, y: 0, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 200, h: 400, x: 250, y: 150 },
        image: { x: 0, y: 0, s: 1.51899 },
        backdrop: { x: 250, y: 150, s: 2 },
      });
    });
    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'bottom-left'`, () => {
      cy.dragPress('bottom-left', 175, 524);
      cy.dragStart();
      cy.dragFromTo([175, 524], [477, 237], 5);

      cy.checkCropStyle({
        cropBox: { w: 100, h: 200, x: 430, y: 170 },
        image: { x: -260, y: 0, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 200, h: 400, x: 250, y: 150 },
        image: { x: -520, y: 0, s: 1.51899 },
        backdrop: { x: -270, y: 150, s: 2 },
      });
    });

    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'top'`, () => {
      cy.dragPress('top', 351, 166);
      cy.dragStart();
      cy.dragFromTo([351, 166], [353, 474], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 200, x: 170, y: 330 },
        image: { x: 0, y: -160, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('top');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 200, x: 170, y: 250 },
        image: { x: 0, y: -160, s: 0.759494 },
        backdrop: { x: 170, y: 90, s: 1 },
      });
    });
    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'right'`, () => {
      cy.dragPress('right', 539, 344);
      cy.dragStart();
      cy.dragFromTo([539, 344], [156, 358], 10);

      cy.checkCropStyle({
        cropBox: { w: 100, h: 360, x: 170, y: 170 },
        image: { x: 0, y: 0, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('right');

      cy.checkCropStyle({
        cropBox: { w: 111, h: 400, x: 294, y: 150 },
        image: { x: 0, y: 0, s: 0.843882 },
        backdrop: { x: 294, y: 150, s: 1.11111 },
      });
    });
    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'bottom'`, () => {
      cy.dragPress('bottom', 434, 541);
      cy.dragStart();
      cy.dragFromTo([434, 541], [233, 209], 10);

      cy.checkCropStyle({
        cropBox: { w: 360, h: 200, x: 170, y: 170 },
        image: { x: 0, y: 0, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('bottom');

      cy.checkCropStyle({
        cropBox: { w: 360, h: 200, x: 170, y: 250 },
        image: { x: 0, y: 0, s: 0.759494 },
        backdrop: { x: 170, y: 250, s: 1 },
      });
    });
    it(`should maintain 'minWidth' and 'minHeight' when resizing from 'left'`, () => {
      cy.dragPress('left', 164, 270);
      cy.dragStart();
      cy.dragFromTo([164, 270], [471, 422], 10);

      cy.checkCropStyle({
        cropBox: { w: 100, h: 360, x: 430, y: 170 },
        image: { x: -260, y: 0, s: 0.759494 },
        backdrop: { x: 170, y: 170, s: 1 },
      });

      cy.dragEnd('left');

      cy.checkCropStyle({
        cropBox: { w: 111, h: 400, x: 294, y: 150 },
        image: { x: -288, y: 0, s: 0.843882 },
        backdrop: { x: 5, y: 150, s: 1.11111 },
      });
    });
  });

  describe('Crop - Gap', () => {
    it(`should set custom gap when the resizing from 'top-left'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 314.682,
          cropBoxH: 600,
          cropBoxX: 192.659,
          cropBoxY: 50,
          imageS: 3.15346,
          imageX: -593.156,
          imageY: -581.676,
          backdropS: 2.98948,
          backdropX: -400.496,
          backdropY: -531.676,
        }
      );

      cy.dragPress('top-left', 199, 52);
      cy.dragStart();
      cy.dragFromTo([199, 52], [108, 57], 10);

      cy.checkCropStyle({
        cropBox: { w: 482, h: 593, x: 108, y: 57 },
        image: { x: -425, y: -588, s: 3.15346 },
        backdrop: { x: -316, y: -531, s: 2.98948 },
      });

      cy.dragFromTo([108, 57], [92, 59], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 580, x: 100, y: 59 },
        image: { x: -377, y: -561, s: 3.04946 },
        backdrop: { x: -277, y: -502, s: 2.89089 },
      });

      cy.dragFromTo([92, 59], [91, 39], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 600, x: 100, y: 50 },
        image: { x: -275, y: -409, s: 2.69379 },
        backdrop: { x: -175, y: -359, s: 2.55372 },
      });

      cy.dragFromTo([91, 39], [119, 33], 10);

      cy.checkCropStyle({
        cropBox: { w: 474, h: 600, x: 112, y: 50 },
        image: { x: -281, y: -383, s: 2.62568 },
        backdrop: { x: -168, y: -333, s: 2.48915 },
      });

      cy.dragFromTo([119, 33], [292, 21], 10);

      cy.checkCropStyle({
        cropBox: { w: 175, h: 600, x: 286, y: 50 },
        image: { x: -473, y: -244, s: 2.25314 },
        backdrop: { x: -186, y: -194, s: 2.13597 },
      });

      cy.dragEnd('top-left');

      cy.checkCropStyle({
        cropBox: { w: 175, h: 600, x: 262, y: 50 },
        image: { x: -473, y: -244, s: 2.25314 },
        backdrop: { x: -210, y: -194, s: 2.13597 },
      });
    });
    it(`should set custom gap when the resizing from 'top-right'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 500,
          cropBoxH: 226.144,
          cropBoxX: 100,
          cropBoxY: 236.928,
          imageS: 2.31132,
          imageX: -295.065,
          imageY: -435.647,
          backdropS: 2.19113,
          backdropX: -195.065,
          backdropY: -198.958,
        }
      );

      cy.dragPress('top-right', 603, 235);
      cy.dragStart();
      cy.dragFromTo([603, 235], [595, 52], 10);

      cy.checkCropStyle({
        cropBox: { w: 495, h: 596, x: 100, y: 51 },
        image: { x: -295, y: -65, s: 2.31132 },
        backdrop: { x: -194, y: -13, s: 2.19113 },
      });

      cy.dragFromTo([595, 52], [596, 37], 10);

      cy.checkCropStyle({
        cropBox: { w: 486, h: 600, x: 107, y: 50 },
        image: { x: -287, y: -45, s: 2.2549 },
        backdrop: { x: -180, y: 4, s: 2.13764 },
      });

      cy.dragFromTo([596, 37], [616, 34], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 600, x: 100, y: 50 },
        image: { x: -268, y: -2, s: 2.10313 },
        backdrop: { x: -168, y: 47, s: 1.99376 },
      });

      cy.dragEnd('top-right');

      cy.checkCropStyle({
        cropBox: { w: 500, h: 600, x: 100, y: 50 },
        image: { x: -268, y: -2, s: 2.10313 },
        backdrop: { x: -168, y: 47, s: 1.99376 },
      });
    });
    it(`should set custom gap when the resizing from 'bottom-right'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 314.682,
          cropBoxH: 600,
          cropBoxX: 192.659,
          cropBoxY: 50,
          imageS: 3.15346,
          imageX: -593.156,
          imageY: -581.676,
          backdropS: 2.98948,
          backdropX: -400.496,
          backdropY: -531.676,
        }
      );

      cy.dragPress('bottom-right', 511, 644);
      cy.dragStart();
      cy.dragFromTo([511, 644], [598, 640], 10);

      cy.checkCropStyle({
        cropBox: { w: 496, h: 590, x: 101, y: 50 },
        image: { x: -593, y: -581, s: 3.15346 },
        backdrop: { x: -491, y: -531, s: 2.98948 },
      });

      cy.dragFromTo([598, 640], [638, 634], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 580, x: 100, y: 60 },
        image: { x: -491, y: -482, s: 2.61495 },
        backdrop: { x: -391, y: -422, s: 2.47897 },
      });

      cy.dragFromTo([638, 634], [638, 653], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 600, x: 100, y: 50 },
        image: { x: -479, y: -470, s: 2.55007 },
        backdrop: { x: -379, y: -420, s: 2.41747 },
      });

      cy.dragFromTo([638, 653], [595, 665], 10);

      cy.checkCropStyle({
        cropBox: { w: 482, h: 600, x: 108, y: 50 },
        image: { x: -532, y: -521, s: 2.82909 },
        backdrop: { x: -423, y: -471, s: 2.68198 },
      });

      cy.dragEnd('bottom-right');

      cy.checkCropStyle({
        cropBox: { w: 482, h: 600, x: 108, y: 50 },
        image: { x: -532, y: -521, s: 2.82909 },
        backdrop: { x: -423, y: -471, s: 2.68198 },
      });
    });
    it(`should set custom gap when the resizing from 'bottom-left'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 500,
          cropBoxH: 226.144,
          cropBoxX: 100,
          cropBoxY: 236.928,
          imageS: 2.31132,
          imageX: -295.065,
          imageY: -435.647,
          backdropS: 2.19113,
          backdropX: -195.065,
          backdropY: -198.958,
        }
      );

      cy.dragPress('bottom-left', 104, 462);
      cy.dragStart();
      cy.dragFromTo([104, 462], [112, 637], 10);

      cy.checkCropStyle({
        cropBox: { w: 488, h: 572, x: 112, y: 63 },
        image: { x: -307, y: -435, s: 2.31132 },
        backdrop: { x: -195, y: -371, s: 2.19113 },
      });

      cy.dragFromTo([112, 637], [114, 662], 10);

      cy.checkCropStyle({
        cropBox: { w: 483, h: 600, x: 111, y: 50 },
        image: { x: -295, y: -426, s: 2.26486 },
        backdrop: { x: -184, y: -376, s: 2.14709 },
      });

      cy.dragFromTo([114, 662], [92, 663], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 600, x: 100, y: 50 },
        image: { x: -254, y: -413, s: 2.19204 },
        backdrop: { x: -154, y: -363, s: 2.07806 },
      });

      cy.dragEnd('bottom-left');

      cy.checkCropStyle({
        cropBox: { w: 500, h: 600, x: 100, y: 50 },
        image: { x: -254, y: -413, s: 2.19204 },
        backdrop: { x: -154, y: -363, s: 2.07806 },
      });
    });

    it(`should set custom gap when the resizing from 'top'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 500,
          cropBoxH: 226.144,
          cropBoxX: 100,
          cropBoxY: 236.928,
          imageS: 2.31132,
          imageX: -295.065,
          imageY: -435.647,
          backdropS: 2.19113,
          backdropX: -195.065,
          backdropY: -198.958,
        }
      );

      cy.dragPress('top', 358, 237);
      cy.dragStart();
      cy.dragFromTo([358, 237], [362, 58], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 584, x: 100, y: 57 },
        image: { x: -295, y: -77, s: 2.31132 },
        backdrop: { x: -195, y: -19, s: 2.19113 },
      });

      cy.dragFromTo([362, 58], [362, 25], 10);

      cy.checkCropStyle({
        cropBox: { w: 476, h: 600, x: 111, y: 50 },
        image: { x: -281, y: -30, s: 2.20311 },
        backdrop: { x: -169, y: 19, s: 2.08854 },
      });

      cy.dragFromTo([362, 25], [362, -1], 10);

      cy.checkCropStyle({
        cropBox: { w: 453, h: 599, x: 123, y: 50 },
        image: { x: -267, y: 0, s: 2.09551 },
        backdrop: { x: -144, y: 50, s: 1.98655 },
      });

      cy.dragEnd('top');

      cy.checkCropStyle({
        cropBox: { w: 453, h: 600, x: 123, y: 50 },
        image: { x: -267, y: 0, s: 2.09554 },
        backdrop: { x: -144, y: 50, s: 1.98657 },
      });
    });
    it(`should set custom gap when the resizing from 'right'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 314.682,
          cropBoxH: 600,
          cropBoxX: 192.659,
          cropBoxY: 50,
          imageS: 3.15346,
          imageX: -593.156,
          imageY: -581.676,
          backdropS: 2.98948,
          backdropX: -400.496,
          backdropY: -531.676,
        }
      );

      cy.dragPress('right', 511, 353);
      cy.dragStart();

      cy.dragFromTo([511, 353], [594, 351], 10);

      cy.checkCropStyle({
        cropBox: { w: 488, h: 600, x: 105, y: 50 },
        image: { x: -593, y: -581, s: 3.15346 },
        backdrop: { x: -487, y: -531, s: 2.98948 },
      });

      cy.dragFromTo([594, 351], [624, 348], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 534, x: 100, y: 82 },
        image: { x: -528, y: -518, s: 2.81159 },
        backdrop: { x: -428, y: -436, s: 2.66539 },
      });

      cy.dragFromTo([624, 348], [705, 334], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 332, x: 100, y: 183 },
        image: { x: -328, y: -322, s: 1.74884 },
        backdrop: { x: -228, y: -138, s: 1.6579 },
      });

      cy.dragEnd('right');

      cy.checkCropStyle({
        cropBox: { w: 500, h: 332, x: 100, y: 183 },
        image: { x: -328, y: -322, s: 1.74884 },
        backdrop: { x: -228, y: -138, s: 1.6579 },
      });
    });
    it(`should set custom gap when the resizing from 'bottom'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 500,
          cropBoxH: 226.144,
          cropBoxX: 100,
          cropBoxY: 236.928,
          imageS: 2.31132,
          imageX: -295.065,
          imageY: -435.647,
          backdropS: 2.19113,
          backdropX: -195.065,
          backdropY: -198.958,
        }
      );

      cy.dragPress('bottom', 359, 470);
      cy.dragStart();
      cy.dragFromTo([359, 470], [362, 648], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 594, x: 100, y: 52 },
        image: { x: -295, y: -435, s: 2.31132 },
        backdrop: { x: -195, y: -382, s: 2.19113 },
      });

      cy.dragFromTo([362, 648], [362, 669], 10);

      cy.checkCropStyle({
        cropBox: { w: 483, h: 600, x: 108, y: 50 },
        image: { x: -285, y: -421, s: 2.23548 },
        backdrop: { x: -177, y: -371, s: 2.11924 },
      });

      cy.dragFromTo([362, 669], [366, 705], 10);

      cy.checkCropStyle({
        cropBox: { w: 454, h: 600, x: 122, y: 50 },
        image: { x: -268, y: -396, s: 2.10146 },
        backdrop: { x: -145, y: -346, s: 1.99218 },
      });

      cy.dragEnd('bottom');

      cy.checkCropStyle({
        cropBox: { w: 454, h: 600, x: 122, y: 50 },
        image: { x: -268, y: -396, s: 2.10146 },
        backdrop: { x: -145, y: -346, s: 1.99218 },
      });
    });
    it(`should set custom gap when the resizing from 'left'`, () => {
      cy.setInitCropHorizontalStyle(
        { verticalGap: 50, horizontalGap: 100 },
        {
          cropBoxW: 314.682,
          cropBoxH: 600,
          cropBoxX: 192.659,
          cropBoxY: 50,
          imageS: 3.15346,
          imageX: -593.156,
          imageY: -581.676,
          backdropS: 2.98948,
          backdropX: -400.496,
          backdropY: -531.676,
        }
      );

      cy.dragPress('left', 186, 352);
      cy.dragStart();
      cy.dragFromTo([186, 352], [101, 358], 10);

      cy.checkCropStyle({
        cropBox: { w: 496, h: 600, x: 101, y: 50 },
        image: { x: -411, y: -581, s: 3.15346 },
        backdrop: { x: -309, y: -531, s: 2.98948 },
      });

      cy.dragFromTo([101, 358], [75, 361], 10);

      cy.checkCropStyle({
        cropBox: { w: 500, h: 534, x: 100, y: 82 },
        image: { x: -308, y: -518, s: 2.80863 },
        backdrop: { x: -208, y: -435, s: 2.66258 },
      });

      cy.dragFromTo([75, 361], [-6, 360], 10);

      cy.checkCropStyle({
        cropBox: { w: 499, h: 330, x: 100, y: 184 },
        image: { x: 0, y: -320, s: 1.7368 },
        backdrop: { x: 100, y: -135, s: 1.64648 },
      });

      cy.dragEnd('left');

      cy.checkCropStyle({
        cropBox: { w: 500, h: 330, x: 100, y: 184 },
        image: { x: 0, y: -320, s: 1.73682 },
        backdrop: { x: 100, y: -135, s: 1.64651 },
      });
    });
  });
});

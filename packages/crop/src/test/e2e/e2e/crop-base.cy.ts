import { CROP_HORIZONTAL_STYLE } from '../support/crop-config';

describe('Crop Base', () => {
  it(`should cropBox be at center of container when crop has initialized`, () => {
    cy.setInitCropHorizontalStyle({});

    cy.checkCropStyle({
      cropBox: { w: 360, h: 360, x: 170, y: 170 },
      image: { x: 0, y: 0, s: 0.759494 },
      backdrop: { x: 170, y: 170, s: 1 },
    });
  });

  it(`should grid be invisible and backdrop almost invisible when crop resize has not started`, () => {
    cy.setInitCropHorizontalStyle({});

    cy.checkCss('.crop__box-grid', { opacity: 0 });
    cy.checkCss('.crop__back-drop', { opacity: 0.7 });
  });
  it(`should grid be visible and backdrop almost visible when crop resize has started`, () => {
    cy.setInitCropHorizontalStyle({});

    cy.dragPress('top-left', 0, 0);

    cy.checkCss('.crop__box-grid', { opacity: 1 });
    cy.checkCss('.crop__back-drop', { opacity: 0.4 });
  });
  it(`should grid be invisible and backdrop almost invisible when crop resize has ended`, () => {
    cy.setInitCropHorizontalStyle({});

    cy.dragPress('top-left', 0, 0);
    cy.dragEnd('top-left');

    cy.checkCss('.crop__box-grid', { opacity: 0 });
    cy.checkCss('.crop__back-drop', { opacity: 0.7 });
  });
  it(`should grid be invisible and backdrop almost invisible when image is dragging`, () => {
    cy.setInitCropHorizontalStyle({}, CROP_HORIZONTAL_STYLE);

    cy.dragPress('image', 350, 350);
    cy.dragMove(350, 350);
    cy.dragMove(400, 400);

    cy.checkCss('.crop__box-grid', { opacity: 0 });
    cy.checkCss('.crop__back-drop', { opacity: 0.7 });

    cy.dragEnd('image');

    cy.checkCss('.crop__box-grid', { opacity: 0 });
    cy.checkCss('.crop__back-drop', { opacity: 0.7 });
  });

  it(`should move the backdrop with image when the image is dragging`, () => {
    cy.setInitCropHorizontalStyle({}, CROP_HORIZONTAL_STYLE);

    cy.dragPress('image', 201, 272);
    cy.dragStart(201, 272);
    cy.dragFromTo([201, 272], [465, 658], 5);

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -96, y: -64, s: 2.27848 },
      backdrop: { x: 74, y: 179, s: 3 },
    });

    cy.dragFromTo([465, 658], [9, 11], 5);

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -552, y: -711, s: 2.27848 },
      backdrop: { x: -382, y: -468, s: 3 },
    });

    cy.dragEnd('image');

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -552, y: -711, s: 2.27848 },
      backdrop: { x: -382, y: -468, s: 3 },
    });
  });

  it(`should move back the backdrop with image in cropBox when the image is dragged towards the top-left outside the crop box`, () => {
    cy.setInitCropHorizontalStyle(
      {},
      {
        cropBoxW: 360,
        cropBoxH: 214,
        cropBoxX: 170,
        cropBoxY: 243,
        imageS: 2.27848,
        imageX: 0,
        imageY: 0,
        backdropS: 3,
        backdropX: 170,
        backdropY: 243,
      }
    );

    cy.dragPress('image', 276, 293);
    cy.dragStart(276, 293);
    cy.dragFromTo([276, 293], [522, 448], 5);

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: 9, y: 6, s: 2.27848 },
      backdrop: { x: 179.742, y: 249.138, s: 3 },
    });

    cy.dragEnd('image');

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: 0, y: 0, s: 2.27848 },
      backdrop: { x: 170, y: 243, s: 3 },
    });
  });
  it(`should move back the backdrop with image in cropBox when the image is dragged towards the top-right outside the crop box`, () => {
    cy.setInitCropHorizontalStyle(
      {},
      {
        cropBoxW: 360,
        cropBoxH: 214,
        cropBoxX: 170,
        cropBoxY: 243,
        imageS: 2.27848,
        imageX: -720,
        imageY: 0,
        backdropS: 3,
        backdropX: -550,
        backdropY: 243,
      }
    );

    cy.dragPress('image', 386, 311);
    cy.dragStart(386, 311);
    cy.dragFromTo([386, 311], [252, 467], 5);

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -725, y: 6, s: 2.27848 },
      backdrop: { x: -555, y: 249, s: 3 },
    });

    cy.dragEnd('image');

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -720, y: 0, s: 2.27848 },
      backdrop: { x: -550, y: 243, s: 3 },
    });
  });
  it(`should move back the backdrop with image in cropBox when the image is dragged towards the bottom-right outside the crop box`, () => {
    cy.setInitCropHorizontalStyle(
      {},
      {
        cropBoxW: 360,
        cropBoxH: 214,
        cropBoxX: 170,
        cropBoxY: 243,
        imageS: 2.27848,
        imageX: -720,
        imageY: -866,
        backdropS: 3,
        backdropX: -550,
        backdropY: -623,
      }
    );

    cy.dragPress('image', 439, 396);
    cy.dragStart(439, 396);
    cy.dragFromTo([439, 396], [118, 154], 5);

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -732, y: -875, s: 2.27848 },
      backdrop: { x: -562, y: -632, s: 3 },
    });

    cy.dragEnd('image');

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: -720, y: -866, s: 2.27848 },
      backdrop: { x: -550, y: -623, s: 3 },
    });
  });
  it(`should move back the backdrop with image in cropBox when the image is dragged towards the bottom-left outside the crop box`, () => {
    cy.setInitCropHorizontalStyle(
      {},
      {
        cropBoxW: 360,
        cropBoxH: 214,
        cropBoxX: 170,
        cropBoxY: 243,
        imageS: 2.27848,
        imageX: 0,
        imageY: -866,
        backdropS: 3,
        backdropX: 170,
        backdropY: -623,
      }
    );

    cy.dragPress('image', 244, 367);
    cy.dragStart(244, 367);
    cy.dragFromTo([244, 367], [587, 113], 5);

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: 13, y: -876, s: 2.27848 },
      backdrop: { x: 183, y: -633, s: 3 },
    });

    cy.dragEnd('image');

    cy.checkCropStyle({
      cropBox: { w: 360, h: 214, x: 170, y: 243 },
      image: { x: 0, y: -866, s: 2.27848 },
      backdrop: { x: 170, y: -623, s: 3 },
    });
  });
});

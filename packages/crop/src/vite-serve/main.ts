import { Crop } from '../lib/crop';
import { CropOptions } from '../lib/crop.model';
import { Animation } from '@elemix/core';

interface CropInitStyle {
  cropBoxW: number;
  cropBoxH: number;
  cropBoxX: number;
  cropBoxY: number;
  imageS: number;
  imageX: number;
  imageY: number;
  backdropS: number;
  backdropX: number;
  backdropY: number;
}

(window as any).__INIT_CROP__ = (options: CropOptions, initStyle: CropInitStyle = {} as CropInitStyle) => {
  new Crop('.container', './assets/number-grid-1-40.jpeg', options);

  document.querySelector('.crop__image').addEventListener('load', () => {
    const cropBoxAnimation = Animation.getOrCreateInstance('.crop__box');
    const cropImageAnimation = Animation.getOrCreateInstance('.crop__image');
    const cropBackdropWrapperAnimation = Animation.getOrCreateInstance('.crop__back-drop-wrapper');

    cropBoxAnimation.setDimension({ width: initStyle.cropBoxW, height: initStyle.cropBoxH });
    cropBoxAnimation.setTranslate({ x: initStyle.cropBoxX, y: initStyle.cropBoxY });
    cropImageAnimation.setScale(initStyle.imageS);
    cropImageAnimation.setTranslate({ x: initStyle.imageX, y: initStyle.imageY });
    cropBackdropWrapperAnimation.setScale(initStyle.backdropS);
    cropBackdropWrapperAnimation.setTranslate({ x: initStyle.backdropX, y: initStyle.backdropY });

    cropBoxAnimation.applyImmediately();
    cropImageAnimation.applyImmediately();
    cropBackdropWrapperAnimation.applyImmediately();
  });
};

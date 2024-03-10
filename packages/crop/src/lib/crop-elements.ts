import { Dom, DomSelector } from '@elemix/core';
import { CropElements } from './crop.internal-model';

// region PUBLIC
export function getCropElements(containerSelector: DomSelector, imgSrc: string): CropElements {
  const container = new Dom(containerSelector);
  container.addClass('crop__container');

  const wrapper = new Dom(CROP_HTML);
  wrapper.querySelectorAll('img').forEach((img) => ((img as HTMLImageElement).src = imgSrc));

  return {
    container,
    wrapper,
    cropBox: new Dom('.crop__box', wrapper.nativeElement),
    image: new Dom('.crop__image', wrapper.nativeElement),
    grids: new Dom('.crop__box-grid', wrapper.nativeElement),

    backdropWrapper: new Dom('.crop__back-drop-wrapper', wrapper.nativeElement),
    backdrop: new Dom('.crop__back-drop', wrapper.nativeElement),
  };
}
// endregion

// region HELPERS
const CROP_HTML = `
<div class="crop__wrapper">

  <div class="crop__box" data-testid="crop_box">

    <div class="crop__box-border"></div>

    <div class="crop__image-wrapper">
      <img class="crop__image" data-testid="crop__image"/>
    </div>
    
    <div class="crop__box-grid" data-testid="crop_box-grid">
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
      <div class="crop__box-grid-item"></div>
    </div>
    
    <div class="crop__draggable crop__draggable--top-left" data-testid="crop__draggable--top-left"></div>
    <div class="crop__draggable crop__draggable--top-right"></div>
    <div class="crop__draggable crop__draggable--bottom-right"></div>
    <div class="crop__draggable crop__draggable--bottom-left"></div>

    <div class="crop__draggable crop__draggable--top"></div>
    <div class="crop__draggable crop__draggable--right"></div>
    <div class="crop__draggable crop__draggable--bottom"></div>
    <div class="crop__draggable crop__draggable--left"></div>

  </div>
    
  <div class="crop__back-drop-wrapper">
    <img class="crop__back-drop-image"/>
    <div class="crop__back-drop"></div>
  </div>
  
</div>
`;
// endregion

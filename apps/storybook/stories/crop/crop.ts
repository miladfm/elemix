import { StoryContext } from '@storybook/html';
import { CropStoryType } from './crop.stories';
import { Dom } from '@elemix/core';
import { Crop } from '@elemix/crop';
import './crop.css';

export function createCrop(_args: CropStoryType, _context: StoryContext<CropStoryType>) {
  const element = new Dom(`<div class="crop-story__container"></div>`);

  document.addEventListener('DOMContentLoaded', () => {
    const imgSrc = 'images/number-grid-1-40.jpeg';
    const _crop = new Crop(element, imgSrc);
  });

  return element.nativeElement;
}

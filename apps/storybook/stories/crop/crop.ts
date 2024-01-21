import { StoryContext } from '@storybook/html';
import { CropStoryType } from './crop.stories';
import { Dom } from '@elemix/core';
import { Crop } from '@elemix/crop';

export function createCrop(_args: CropStoryType, _context: StoryContext<CropStoryType>) {
  const element = new Dom(`<div></div>`);

  document.addEventListener('DOMContentLoaded', () => {
    const imgSrc = 'images/number-grid-1-40.jpeg';
    const _crop = new Crop(element, imgSrc);
  });

  return element.nativeElement;
}

import './wheel-zoom.css';
import { WheelZoomStoryType } from './wheel-zoom.stories';
import { StoryContext } from '@storybook/html';
import { WheelZoom } from '@elemix/zoom';

export const createWheelZoom = (args: WheelZoomStoryType, _context: StoryContext<WheelZoomStoryType>) => {
  const container = createContainer();
  const element = createElement();

  container.appendChild(element);

  document.addEventListener('DOMContentLoaded', () => {
    new WheelZoom(element, {
      minScale: args.minScale,
      maxScale: args.maxScale,
      wheelDeltaFactor: args.wheelDeltaFactor,
    });
  });

  return container;
};

function createContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'wheel-zoom-story__container';
  return container;
}

function createElement(): HTMLDivElement {
  const element = document.createElement('div');
  element.className = `wheel-zoom-story__zoom-element`;

  const img = document.createElement('img');
  img.setAttribute('src', '/images/number-grid-1-40.jpeg');
  img.className = 'wheel-zoom-story__image';

  element.appendChild(img);

  return element;
}

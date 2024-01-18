import './click-zoom.css';
import { ClickZoomStoryType } from './click-zoom.stories';
import { StoryContext } from '@storybook/html';
import { ClickZoom } from '@elemix/zoom';

export const createClickZoom = (args: ClickZoomStoryType, _context: StoryContext<ClickZoomStoryType>) => {
  const container = createContainer();
  const element = createElement();

  container.appendChild(element);

  document.addEventListener('DOMContentLoaded', () => {
    const clickZoom = new ClickZoom(element, {
      minScale: args.minScale,
      maxScale: args.maxScale,
      clickScaleFactor: args.clickScaleFactor,
      dblclickScaleFactor: args.dblclickScaleFactor,
    });

    clickZoom.setClickType(args.clickType);
  });

  return container;
};

function createContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'click-zoom-story__container';
  return container;
}

function createElement(): HTMLDivElement {
  const element = document.createElement('div');
  element.className = `click-zoom-story__zoom-element`;

  const img = document.createElement('img');
  img.setAttribute('src', '/images/number-grid-1-40.jpeg');
  img.className = 'click-zoom-story__image';

  element.appendChild(img);

  return element;
}

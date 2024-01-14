import './zoom.css';
import { ZoomStoryType } from './zoom.stories';
import { StoryContext } from '@storybook/html';
import { PinchZoom } from '@elemix/zoom';

export const createPinchZoom = (args: ZoomStoryType, _context: StoryContext<ZoomStoryType>) => {
  const container = createContainer();
  const wrapperBig = createWrapperBig(args);
  const wrapperSmall = createWrapperSmall(args);
  const element = createElement(args);

  container.appendChild(element);
  container.appendChild(wrapperSmall);
  container.appendChild(wrapperBig);

  document.addEventListener('DOMContentLoaded', () => {
    const minScale =
      typeof args.minScale === 'number'
        ? args.minScale
        : {
          element: args.minScale === 'wrapper-big' ? wrapperBig : wrapperSmall,
          boundaryType: args.minScaleBoundaryType,
        };
    const maxScale =
      typeof args.maxScale === 'number'
        ? args.maxScale
        : {
          element: args.maxScale === 'wrapper-big' ? wrapperBig : wrapperSmall,
          boundaryType: args.maxScaleBoundaryType,
        };

    const pinchZoom = new PinchZoom(element, {
      minScale,
      maxScale,
      bounceFactor: args.bounceFactor,
    });

    pinchZoom.events$.subscribe((event) => {
      if (args.printLogs) {
        args.onEvents(event);
      }
    });
  });

  return container;
};

function getZoomElementRatio(imageRatio: '1:1' | '1:2' | '2:1'): string {
  switch (imageRatio) {
    case '1:1':
      return 'zoom-story__zoom-element--ratio-1-1';

    case '1:2':
      return 'zoom-story__zoom-element--ratio-1-2';

    case '2:1':
      return 'zoom-story__zoom-element--ratio-2-1';
  }
}

function createContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'zoom-story__container';
  return container;
}

function createWrapperBig(args: ZoomStoryType): HTMLDivElement {
  const wrapperBig = document.createElement('div');
  wrapperBig.className = 'zoom-story__wrapper zoom-story__wrapper--big';
  if (args.minScale === 'wrapper-big' || args.maxScale === 'wrapper-big') {
    wrapperBig.classList.add('zoom-story__wrapper--visible');
  }
  return wrapperBig;
}
function createWrapperSmall(args: ZoomStoryType): HTMLDivElement {
  const wrapperSmall = document.createElement('div');
  wrapperSmall.className = 'zoom-story__wrapper zoom-story__wrapper--small';
  if (args.minScale === 'wrapper-small' || args.maxScale === 'wrapper-small') {
    wrapperSmall.classList.add('zoom-story__wrapper--visible');
  }
  return wrapperSmall;
}

function createElement(args: ZoomStoryType): HTMLDivElement {
  const element = document.createElement('div');
  const rationClassName = getZoomElementRatio(args.imageRatio);
  element.className = `zoom-story__zoom-element ${rationClassName}`;

  const img = document.createElement('img');
  img.setAttribute('src', '/images/number-grid-1-40.jpeg');
  img.className = 'zoom-story__image';

  element.appendChild(img);

  return element;
}

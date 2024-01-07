import './zoom.css';
import { ZoomStoryType } from './zoom.stories';
import { StoryContext } from '@storybook/html';
import { PinchZoom } from '@elemix/zoom';

export const createBasicZoom = (args: ZoomStoryType, _context: StoryContext<ZoomStoryType>) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'zoom-wrapper';

  const element = document.createElement('div');
  element.className = 'zoom-element';

  wrapper.appendChild(element);

  const pinchZoom = new PinchZoom(element, {});

  pinchZoom.events$.subscribe((event) => {
    args.onEvents(event);
  });

  return wrapper;
};

import './drag.css';
import { DragStoryType } from './drag.stories';
import { Drag } from '@elemix/drag';

export const createDrag = (args: DragStoryType) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'draggable-wrapper';

  const element = document.createElement('div');
  element.className = 'draggable-element';

  wrapper.appendChild(element);

  const drag = new Drag(element, {
    movementDirection: args.movementDirection,
  });

  drag.events$.subscribe((event) => {
    args.onPress(event);
  });

  return wrapper;
};

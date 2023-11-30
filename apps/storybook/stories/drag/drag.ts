import './drag.css';
import { DragStoryType } from './drag.stories';
import { Drag } from '@elemix/drag';
import { action } from '@storybook/addon-actions';

export const createDrag = (args: DragStoryType) => {
  const element = document.createElement('div');

  element.className = 'draggable-element';
  element.style.backgroundColor = args.backgroundColor;

  const drag = new Drag(element);
  drag.events$.subscribe((event) => {
    action(event.type)(event);
  });

  return element;
};

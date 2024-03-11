import './drag.css';
import { DragStorySize, DragStoryType } from './drag.stories';
import { Drag } from '@elemix/drag';
import { StoryContext } from '@storybook/html';
import { Animation } from '@elemix/core';

export const createBasicDrag = (args: DragStoryType, _context: StoryContext<DragStoryType>) => {
  const container = document.createElement('div');
  container.className = 'drag-story__container';

  const element = document.createElement('div');
  element.className = 'drag-story__draggable-element drag-story__draggable-element--1-1';

  container.appendChild(element);

  const drag = new Drag(element, {
    movementDirection: args.movementDirection,
    minMovements: args.minMovements,
  });

  drag.events$.subscribe((event) => {
    args.onAction(event);
  });

  return container;
};

export const createBoundaryDrag = (args: DragStoryType) => {
  const container = document.createElement('div');
  container.className = 'drag-story__container';

  const wrapper = document.createElement('div');
  wrapper.className = 'drag-story__wrapper';

  const element = document.createElement('div');
  element.className = 'drag-story__draggable-element';

  const wrapperSize = args.wrapperSize ?? ('1X1' as DragStorySize);
  const draggableSize = args.draggableSize ?? ('1X1' as DragStorySize);
  const wrapperScale: number = isNaN(parseFloat(args.wrapperScale)) ? 1 : parseFloat(args.wrapperScale);
  const draggableScale: number = isNaN(parseFloat(args.draggableScale)) ? 1 : parseFloat(args.draggableScale);

  switch (wrapperSize) {
    case '1X1':
      wrapper.classList.add('drag-story__wrapper--1-1');
      break;

    case '2X1':
      wrapper.classList.add('drag-story__wrapper--2-1');
      break;

    case '1X2':
      wrapper.classList.add('drag-story__wrapper--1-2');
      break;
  }

  switch (draggableSize) {
    case '1X1':
      element.classList.add('drag-story__draggable-element--1-1');
      break;

    case '2X1':
      element.classList.add('drag-story__draggable-element--2-1');
      break;

    case '1X2':
      element.classList.add('drag-story__draggable-element--1-2');
      break;
  }

  Animation.getOrCreateInstance(element).setScale(draggableScale).applyImmediately();
  wrapper.style.transform = `translate(-50%, -50%) rotateX(0deg) rotateY(0deg) scale(${wrapperScale}, ${wrapperScale})`;

  container.appendChild(wrapper);
  container.appendChild(element);

  document.addEventListener('DOMContentLoaded', function () {
    const drag = new Drag(element, {
      movementDirection: args.movementDirection,
      minMovements: args.minMovements,
      boundary: {
        elem: wrapper,
        type: args.boundaryType,
        bounceFactor: args.bounceFactor,
      },
    });

    drag.events$.subscribe((event) => {
      args.onAction(event);
    });
  });

  return container;
};

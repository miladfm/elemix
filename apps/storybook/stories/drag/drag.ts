import './drag.css';
import { DragStoryType } from './drag.stories';
import { Drag, DragBoundaryType } from '@elemix/drag';
import { StoryContext } from '@storybook/html';

export const createBasicDrag = (args: DragStoryType, _context: StoryContext<DragStoryType>) => {
  const container = document.createElement('div');
  container.className = 'drag-story__container';

  const element = document.createElement('div');
  element.className = 'drag-story__draggable-element drag-story__draggable-element--inner';

  container.appendChild(element);

  const drag = new Drag(element, {
    movementDirection: args.movementDirection,
    minMovements: args.minMovements,
  });

  drag.events$.subscribe((event) => {
    args.onPress(event);
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

  switch (args.boundaryType) {
    case DragBoundaryType.Inner:
      element.classList.add('drag-story__draggable-element--inner');
      break;

    case DragBoundaryType.Outer:
      element.classList.add('drag-story__draggable-element--outer');
      break;

    case DragBoundaryType.Auto:
      element.classList.add('drag-story__draggable-element--auto');
      break;
  }

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
      args.onPress(event);
    });
  });

  return container;
};

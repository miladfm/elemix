import './drag.css';
import { DragStoryType } from './drag.stories';
import { Drag, DragBoundaryType } from '@elemix/drag';

export const createBasicDrag = (args: DragStoryType) => {
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

export const createBoundaryDrag = (args: DragStoryType) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'draggable-wrapper';

  const boundary = document.createElement('div');
  boundary.className = 'draggable-boundary';

  const element = document.createElement('div');
  element.className = 'draggable-element';

  switch (args.boundaryType) {
    case DragBoundaryType.Inner:
      element.classList.add('draggable-element--inner');
      break;

    case DragBoundaryType.Outer:
      element.classList.add('draggable-element--outer');
      break;

    case DragBoundaryType.Auto:
      element.classList.add('draggable-element--auto');
      break;
  }

  wrapper.appendChild(boundary);
  boundary.appendChild(element);

  const drag = new Drag(element, {
    movementDirection: args.movementDirection,
    boundary: {
      elem: boundary,
      type: args.boundaryType,
      bounceFactor: args.bounceFactor,

      bounceIntensity: args.bounceIntensity,
      dampeningFactor: args.dampeningFactor,
    } as any,
  });

  drag.events$.subscribe((event) => {
    args.onPress(event);
  });

  return wrapper;
};

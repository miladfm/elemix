import './zoom.css';
import { ZoomStoryType } from './zoom.stories';
import { StoryContext } from '@storybook/html';
import { Zoom } from '@elemix/zoom';
import { Dom } from '@elemix/core';

const APPLY_BTN_EVENT_TYPE = 'applyClick';

interface ApplyBtnEventData {
  scale?: number;
  x?: number;
  y?: number;
}

export const createZoom = (args: ZoomStoryType, _context: StoryContext<ZoomStoryType>) => {
  const containerElement = new Dom(`<div class="zoom-story__container"></div>`);
  const controllersContainerElement = new Dom(`<div class="zoom-story__controller-container"></div>`);
  const zoomInElement = createController('Zoom In');
  const zoomOutElement = createController('Zoom Out');
  const zoomToElement = createController('Zoom To', 'Final Scale:  ');
  const zoomElement = new Dom(`
    <div class="zoom-story__zoom-element">
      <img src="/images/number-grid-1-40.jpeg" class="zoom-story__image">
    </div>
  `);

  controllersContainerElement.appendChild(zoomInElement);
  controllersContainerElement.appendChild(zoomOutElement);
  controllersContainerElement.appendChild(zoomToElement);
  containerElement.appendChild(controllersContainerElement);
  containerElement.appendChild(zoomElement);

  document.addEventListener('DOMContentLoaded', () => {
    const zoom = new Zoom('.zoom-story__zoom-element', {
      minScale: args.minScale,
      maxScale: args.maxScale,
    });

    zoomInElement.nativeElement.addEventListener(APPLY_BTN_EVENT_TYPE, (e: CustomEvent<ApplyBtnEventData>) => {
      zoom.zoomIn({
        scaleFactor: e.detail.scale,
        center: {
          x: e.detail.x,
          y: e.detail.y,
        },
      });
    });

    zoomOutElement.nativeElement.addEventListener(APPLY_BTN_EVENT_TYPE, (e: CustomEvent<ApplyBtnEventData>) => {
      zoom.zoomOut({
        scaleFactor: e.detail.scale,
        center: {
          x: e.detail.x,
          y: e.detail.y,
        },
      });
    });

    zoomToElement.nativeElement.addEventListener(APPLY_BTN_EVENT_TYPE, (e: CustomEvent<ApplyBtnEventData>) => {
      zoom.zoomTo(e.detail.scale, {
        x: e.detail.x,
        y: e.detail.y,
      });
    });
  });

  return containerElement.nativeElement;
};

function createController(title: string, scaleText = 'Scale Factor:') {
  const template = new Dom(`
    <div class="zoom-story__controller-wrapper">

      <div class="zoom-story__controller-title">${title}</div>
      
      <div class="zoom-story__input-title">${scaleText}</div>
      <input type="number" class="zoom-story__input"/>

      <div class="zoom-story__input-title">X:</div>
      <input type="number" class="zoom-story__input"/>

      <div class="zoom-story__input-title">Y:</div>
      <input type="number" class="zoom-story__input"/>

      <button class="zoom-story__button">Apply</button>
      
    </div>
  `);

  template.querySelector('button').addEventListener('click', () => {
    const [scaleStr, xStr, yStr] = Array.from(template.querySelectorAll('input')).map((input: HTMLInputElement) => input.value);
    const scale = scaleStr.trim() !== '' ? Number(scaleStr) : undefined;
    const x = xStr.trim() !== '' ? Number(xStr) : undefined;
    const y = yStr.trim() !== '' ? Number(yStr) : undefined;

    const detail: ApplyBtnEventData = { scale, x, y };

    template.nativeElement.dispatchEvent(new CustomEvent(APPLY_BTN_EVENT_TYPE, { detail }));
  });

  return template;
}

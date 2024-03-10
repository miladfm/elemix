/// <reference types="cypress" />

type CropOrigin = 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'image';

const CROP_ORIGIN_SELECTOR: Record<CropOrigin, string> = {
  top: '.crop__draggable--top',
  right: '.crop__draggable--right',
  bottom: '.crop__draggable--bottom',
  left: '.crop__draggable--left',
  'top-right': '.crop__draggable--top-right',
  'bottom-right': '.crop__draggable--bottom-right',
  'bottom-left': '.crop__draggable--bottom-left',
  'top-left': '.crop__draggable--top-left',
  image: '.crop__image',
};

interface CropInitStyle {
  cropBoxW: number;
  cropBoxH: number;
  cropBoxX: number;
  cropBoxY: number;
  imageS: number;
  imageX: number;
  imageY: number;
  backdropS: number;
  backdropX: number;
  backdropY: number;
}

interface CropInitOption {
  verticalGap: number;
  horizontalGap: number;
  minWidth: number;
  minHeight: number;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    checkCss(
      selector: string,
      style: Partial<{ w: number; h: number; x: number; y: number; s: number }> | Record<string, string | number>
    ): void;
    checkCropStyle(elements: {
      cropBox: { w: number; h: number; x: number; y: number };
      image: { x: number; y: number; s: number };
      backdrop: { x: number; y: number; s: number };
    }): void;
    waitForAnimationFrame(): void;
    documentTrigger(eventName: string, options?: Partial<TriggerOptions & ObjectLike>): void;
    dragPress(origin: CropOrigin, x: number, y: number): void;
    dragStart(x?: number, y?: number): void;
    dragMove(x: number, y: number): void;
    dragFromTo(from: [number, number], to: [number, number], counter?: number): void;
    dragEnd(origin: CropOrigin): void;
    setInitCropHorizontalStyle(options: Partial<CropInitOption>, initStyle?: CropInitStyle): void;
  }
}

Cypress.Commands.add('waitForAnimationFrame', () => {
  return new Cypress.Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
});

Cypress.Commands.add('setInitCropHorizontalStyle', (options, initStyle) => {
  cy.viewport(700, 700);
  cy.visit('http://127.0.0.1:4300/');
  cy.window().then((canvasWindows) => {
    (canvasWindows as any).__INIT_CROP__(options, initStyle);
  });

  cy.wait(100);
});

Cypress.Commands.add('checkCropStyle', ({ cropBox, image, backdrop }) => {
  cy.checkCss('.crop__box', cropBox);
  cy.checkCss('.crop__image', image);
  cy.checkCss('.crop__back-drop-wrapper', backdrop);
});

Cypress.Commands.add('checkCss', (selector, styles) => {
  cy.get(selector).should(($el) => {
    if (styles.w) {
      expect(toFloor($el[0].style.width), 'Check Width').to.be.closeTo(toFloor(styles.w), 1);
    }

    if (styles.h) {
      expect(toFloor($el[0].style.height), 'Check Height').to.be.closeTo(toFloor(styles.h), 1);
    }

    const transformValue = getTransformValues($el[0].style.transform) ?? ({} as { x: string; y: string; s: string });
    if (styles.x) {
      expect(toFloor(transformValue.x), 'Check X').to.be.closeTo(toFloor(styles.x), 1);
    }

    if (styles.y) {
      expect(toFloor(transformValue.y), 'Check Y').to.be.closeTo(toFloor(styles.y), 1);
    }

    if (styles.s) {
      expect(parseFloat(transformValue.s), 'Check Scale').to.be.equal(styles.s);
    }

    const otherStyles = Object.entries(styles).filter(([key, _value]) => !['w', 'h', 'x', 'y', 's'].includes(key));
    if (otherStyles.length > 0) {
      otherStyles.forEach(([key, value]) => {
        expect($el[0].style[key as any], `Check ${key}`).to.be.equal(value.toString());
      });
    }
  });
});

Cypress.Commands.add('documentTrigger', (eventName, options = {}) => {
  cy.document({ log: false }).then((canvasDocument) => {
    const event = new PointerEvent(eventName, options);
    canvasDocument.dispatchEvent(event);
    cy.log(eventName, options);
  });
});

Cypress.Commands.add('dragPress', (origin, x, y) => {
  cy.get(CROP_ORIGIN_SELECTOR[origin]).trigger('pointerdown', { pointerId: 1, clientX: x, clientY: y, force: true });
});

Cypress.Commands.add('dragStart', (x = 0, y = 0) => {
  cy.documentTrigger('pointermove', { pointerId: 1, clientX: x, clientY: y });
});

Cypress.Commands.add('dragMove', (x, y) => {
  cy.documentTrigger('pointermove', { pointerId: 1, clientX: x, clientY: y });
  cy.waitForAnimationFrame();
});

Cypress.Commands.add('dragFromTo', (from, to, counter = 10) => {
  const baseDeltaX = (to[0] - from[0]) / counter;
  const baseDeltaY = (to[1] - from[1]) / counter;
  for (let i = 0; i <= counter; i++) {
    const deltaX = baseDeltaX * i;
    const deltaY = baseDeltaY * i;
    const x = from[0] + deltaX;
    const y = from[1] + deltaY;
    cy.documentTrigger('pointermove', { pointerId: 1, clientX: x, clientY: y });
    cy.waitForAnimationFrame();
  }
});

Cypress.Commands.add('dragEnd', (origin) => {
  cy.get(CROP_ORIGIN_SELECTOR[origin]).trigger('pointerup', { pointerId: 1, clientX: 0, clientY: 0, force: true });
  cy.wait(310);
});

function getTransformValues(transform: string) {
  const regex = /translate\((.*)px, (.*)px\).*scale\((.*),.*\)/;
  const match = transform.match(regex);

  return (
    match && {
      x: match[1],
      y: match[2],
      s: match[3],
    }
  );
}

function toFloor(value: string | number) {
  return typeof value === 'number' ? Math.floor(value) : Math.floor(parseInt(value, 10));
}

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
    /**
     * Checks the CSS styles of an element against the expected values.
     * It verifies if the specified element's dimensions, position, scale or any css value matches the expected styles.
     */
    checkStyle(
      selector: string,
      style: Partial<{ w: number; h: number; x: number; y: number; s: number }> | Record<string, string | number>,
      message?: string
    ): void;

    /**
     * Sets specific CSS styles for an element selected by the CSS selector.
     * This command allows direct manipulation of the element's style, aiding in testing various CSS properties.
     */
    setCss(selector: string, style: Partial<Record<keyof CSSStyleDeclaration, string>>): void;

    /**
     * Checks the styles of crop box, image, and backdrop elements against specified values.
     * This is used to ensure that these elements are correctly styled during cropping operations.
     */
    checkCropStyle(
      elements: {
        cropBox: { w: number; h: number; x: number; y: number };
        image: { x: number; y: number; s: number };
        backdrop: { x: number; y: number; s: number };
      },
      message?: string
    ): void;

    /**
     * Waits for the next animation frame before proceeding.
     * This ensures that any CSS transitions or animations have been processed by the browser.
     */
    waitForAnimationFrame(): void;

    /**
     * Triggers a document-level event, such as mouse or pointer events, with specified options.
     * This is useful for simulating user interactions in a controlled manner.
     */
    documentTrigger(eventName: string, options?: Partial<TriggerOptions & ObjectLike>): void;

    /**
     * Simulates a press action at a specific point of the crop origin.
     * This is used to initiate a drag or interact with a cropping interface.
     */
    dragPress(origin: CropOrigin, x: number, y: number): void;

    /**
     * Starts a drag action at a specified position.
     * This command is typically used to initiate a drag interact with a cropping interface.
     */
    dragStart(x?: number, y?: number): void;

    /**
     * Continues a drag action to a new position.
     * This command is used to simulate the movement of an element during a drag operation.
     */
    dragMove(x: number, y: number): void;

    /**
     * Performs a drag action from one point to another, emitting events at intervals based on the 'counter'.
     * This function calculates the start and end points of the drag and then simulates the drag action
     * by emitting pointer events at evenly spaced intervals between these points. The 'counter' parameter
     * determines the number of intermediate steps and events to be generated during the drag, allowing for
     * a more detailed simulation of the dragging motion.
     */
    dragFromTo(from: [number, number], to: [number, number], counter?: number): void;

    /**
     * Ends a drag action at a specified crop origin.
     * This command is used to finish a drag operation and release the dragged element.
     */
    dragEnd(origin: CropOrigin): void;

    /**
     * Sets the initial style for the crop elements based on the given options and init styles.
     * This helps in preparing the crop elements with specific dimensions and positions before testing.
     */
    setupCrop(options: Partial<CropInitOption>, initStyle?: CropInitStyle): void;

    /**
     * Logs the current styles of the crop box, image, and backdrop elements for debugging purposes.
     * Then we can just copy the output to check the styles of crop
     */
    logStyles(message?: string): void;
  }
}

Cypress.Commands.add('waitForAnimationFrame', () => {
  return new Cypress.Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
});

Cypress.Commands.add('setupCrop', (options, initStyle) => {
  cy.viewport(700, 700);
  cy.visit('http://127.0.0.1:4300');
  cy.window().then((canvasWindows) => {
    (canvasWindows as any).__INIT_CROP__(options, initStyle);
  });

  cy.wait(300); // Wait for image load and init styles
});

Cypress.Commands.add('checkCropStyle', ({ cropBox, image, backdrop }, message) => {
  cy.checkStyle('.crop__box', cropBox, message);
  cy.checkStyle('.crop__image', image, message);
  cy.checkStyle('.crop__back-drop-wrapper', backdrop, message);
});

Cypress.Commands.add('checkStyle', (selector, styles, message) => {
  cy.get(selector).should(($el) => {
    const style = $el[0].style;

    if (styles.w) {
      expect(toFloor(style.width), `Check Width ${message ? '(' + message + ')' : ''}`).to.be.closeTo(toFloor(styles.w), 1);
    }

    if (styles.h) {
      expect(toFloor(style.height), `Check Height ${message ? '(' + message + ')' : ''}`).to.be.closeTo(toFloor(styles.h), 1);
    }

    const transformValue = getTransformValues(style.transform) ?? ({} as { x: string; y: string; s: string });
    if (styles.x) {
      expect(toFloor(transformValue.x), `Check X ${message ? '(' + message + ')' : ''}`).to.be.closeTo(toFloor(styles.x), 1);
    }

    if (styles.y) {
      expect(toFloor(transformValue.y), `Check Y ${message ? '(' + message + ')' : ''}`).to.be.closeTo(toFloor(styles.y), 1);
    }

    if (styles.s) {
      expect(parseFloat(transformValue.s), `Check Scale ${message ? '(' + message + ')' : ''}`).to.be.closeTo(styles.s as number, 0.00005);
    }

    const otherStyles = Object.entries(styles).filter(([key, _value]) => !['w', 'h', 'x', 'y', 's'].includes(key));
    if (otherStyles.length > 0) {
      otherStyles.forEach(([key, value]) => {
        expect(style[key as any], `Check ${key} ${message ? '(' + message + ')' : ''}`).to.be.equal(value.toString());
      });
    }
  });
});

Cypress.Commands.add('setCss', (selector, styles) => {
  cy.get(selector).then(($el) => {
    Object.entries(styles).forEach(([key, value]) => {
      $el[0].style[key as any] = value as string;
    });
  });
  cy.log('Set style', selector, styles);
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
  cy.wait(110); // Wait for press animation (grid lines and backdrop opacity)
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
  cy.wait(310); // Wait for end animation (grid lines, backdrop opacity, move the cropBox to center)
});

Cypress.Commands.add('logStyles', (message = 'LOG STYLE') => {
  cy.get('.crop__box').then(($cropBox) => {
    cy.get('.crop__image').then(($image) => {
      // eslint-disable-next-line max-nested-callbacks
      cy.get('.crop__back-drop-wrapper').then(($backdropWrapper) => {
        const cropBoxStyle = $cropBox[0].style;
        const imageStyle = $image[0].style;
        const backdropWrapperStyle = $backdropWrapper[0].style;

        /**
         * Regular expression to extract translate and scale values from a CSS transform string.
         * It matches translate values with optional negative and decimal numbers followed by 'px',
         * and scale values with optional negative and decimal numbers.
         *
         * @example
         * 'translate(-10px, 20px) scale(0.5, 0.5)' => translateX: -10, translateY: 20, scale: 0.5
         */
        const regex = /translate\((-?\d+|-?\d*\.\d+)px, (-?\d+|-?\d*\.\d+)px\).*scale\((-?\d+|-?\d*\.\d+), (-?\d+|-?\d*\.\d+)\)/;

        const cropBoxMatches = cropBoxStyle.transform.match(regex);
        const imageMatches = imageStyle.transform.match(regex);
        const backdropWrapperMatches = backdropWrapperStyle.transform.match(regex);

        if (!cropBoxMatches || !imageMatches || !backdropWrapperMatches) {
          throw new Error(`
          Can not parse the transform value.\n
          cropBox: ${!!cropBoxMatches} - ${cropBoxStyle.transform}\n
          image: ${!!imageMatches} - ${imageStyle.transform}\n
          backdropWrapper: ${!!backdropWrapperMatches} - ${backdropWrapperStyle.transform}`);
        }

        const cropBoxWidth = toFloor(parseFloat($cropBox[0].style.width));
        const cropBoxHeight = toFloor(parseFloat($cropBox[0].style.height));

        const cropBoxX = toFloor(parseFloat(cropBoxMatches[1]));
        const cropBoxY = toFloor(parseFloat(cropBoxMatches[2]));

        const imageX = toFloor(parseFloat(imageMatches[1]));
        const imageY = toFloor(parseFloat(imageMatches[2]));
        const imageS = parseFloat(imageMatches[3]);

        const backdropWrapperX = toFloor(parseFloat(backdropWrapperMatches[1]));
        const backdropWrapperY = toFloor(parseFloat(backdropWrapperMatches[2]));
        const backdropWrapperS = parseFloat(backdropWrapperMatches[3]);

        // eslint-disable-next-line no-console
        console.log(
          message,
          `
          cy.checkCropStyle({
            cropBox: { w: ${cropBoxWidth}, h: ${cropBoxHeight}, x: ${cropBoxX}, y: ${cropBoxY} },
            image: { x: ${imageX}, y: ${imageY}, s: ${imageS} },
            backdrop: { x: ${backdropWrapperX}, y: ${backdropWrapperY}, s: ${backdropWrapperS} },
          });
        `
        );
      });
    });
  });
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

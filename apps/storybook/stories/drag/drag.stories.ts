import { Meta, StoryObj } from '@storybook/html';
import { createBasicDrag, createBoundaryDrag } from './drag';
import { DragBoundaryType, MovementDirection } from '@elemix/drag';
import README from '../../../../packages/drag/README.md';

export type DragStorySize = '1X1' | '2X1' | '1X2';
export type DragStoryScale = '0.5X' | '1X' | '2X' | '3X' | '4X';

export interface DragStoryType {
  movementDirection: MovementDirection;
  minMovements: number;
  onAction: any;
  boundaryType: DragBoundaryType;
  bounceFactor: number;

  bounceIntensity: number;
  dampeningFactor: number;

  // Size Configuration
  showStorySizeConfig: boolean;

  wrapperSize: DragStorySize;
  draggableSize: DragStorySize;

  draggableScale: DragStoryScale;
  wrapperScale: DragStoryScale;
}

type Story = StoryObj<DragStoryType>;

const meta: Meta<DragStoryType> = {
  title: 'Drag',
  tags: ['autodocs'],
  argTypes: {
    onAction: { action: 'OnAction', table: { disable: true } },
    movementDirection: {
      control: 'select',
      options: Object.values(MovementDirection),
      description: 'Overwritten description',
      name: 'Test Name',
      type: 'string',
    },
    minMovements: { control: 'number', description: 'Overwritten description', defaultValue: 0 },
  },
  args: {},
  parameters: {
    componentSubtitle:
      'A tiny drag and drop library enabling any DOM element to be draggable via mouse or touch - simply click or tap the handle and hold.',
    docs: {
      overviewMarkdown: README,
      apiRefPath: 'packages/drag/src/lib/drag.model.ts',
      source: {
        code: 'DEFAULT SOURCE CODE',
      },
      description: {
        component: 'description component',
      },
    },
  },
};

export default meta;

/**
 * This is the basic component
 */
export const Basic: Story = {
  args: {
    movementDirection: MovementDirection.Both,
    minMovements: 0,
  },
  render: (args, context) => createBasicDrag(args, context),
};

export const Boundary: Story = {
  argTypes: {
    boundaryType: { control: { type: 'select' }, options: Object.values(DragBoundaryType) },
    bounceFactor: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    showStorySizeConfig: { control: 'boolean' },
    wrapperSize: {
      if: { arg: 'showStorySizeConfig', truthy: true },
      control: 'select',
      options: ['1X1', '2X1', '1X2'],
    },
    draggableSize: {
      if: { arg: 'showStorySizeConfig', truthy: true },
      control: 'select',
      options: ['1X1', '2X1', '1X2'],
    },
    wrapperScale: {
      if: { arg: 'showStorySizeConfig', truthy: true },
      control: 'select',
      options: ['0.5X', '1X', '2X', '3X', '4X'],
    },
    draggableScale: {
      if: { arg: 'showStorySizeConfig', truthy: true },
      control: 'select',
      options: ['0.5X', '1X', '2X', '3X', '4X'],
    },
  },
  args: {
    movementDirection: MovementDirection.Both,
    minMovements: 0,
    boundaryType: DragBoundaryType.Inner,
    bounceFactor: 1,
    showStorySizeConfig: false,
    wrapperSize: '1X1',
    draggableSize: '1X1',
    wrapperScale: '1X',
    draggableScale: '1X',
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { Drag } from '@elemix/drag';

new Drag(element, {
  boundary: {
    elem: '.boundary'
  },
});
        `,
      },
    },
  },
  render: (args) => createBoundaryDrag(args),
};

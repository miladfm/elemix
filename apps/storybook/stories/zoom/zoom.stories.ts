import { Meta, StoryObj } from '@storybook/html';
import { createPinchZoom } from './zoom';
import README from '../../../../packages/zoom/src/lib/pinch-zoom/README.md';
import { PinchZoomBoundaryType } from '@elemix/zoom';

export interface ZoomStoryType {
  bounceFactor: number;
  minScale: 'wrapper-big' | 'wrapper-small' | number;
  minScaleBoundaryType: PinchZoomBoundaryType;
  maxScale: 'wrapper-big' | 'wrapper-small' | number;
  maxScaleBoundaryType: PinchZoomBoundaryType;
  imageRatio: '1:1' | '1:2' | '2:1';

  printLogs: boolean;
  onEvents: (e: unknown) => void;
}

type Story = StoryObj<ZoomStoryType>;

const meta: Meta<ZoomStoryType> = {
  title: 'Pinch Zoom',
  tags: ['autodocs'],
  argTypes: {
    onEvents: { action: 'OnEvents', table: { disable: true } },
    printLogs: { action: 'boolean' },
    bounceFactor: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    // label: {
    //   name: 'ABXDE ',
    //   description: 'XYZ Label',
    //   control: { type: 'text' },
    //   table: { type: { summary: 'The label contents', } }
    // },
  },
  args: {},
  parameters: {
    componentSubtitle: 'TODO',
    docs: {
      overviewMarkdown: README,
      apiRefPath: ['packages/zoom/src/lib/pinch-zoom/pinch-zoom.model.ts', 'packages/zoom/src/lib/zoom.model.ts'],
      source: {
        code: 'TODO',
      },
      description: {
        component: 'TODO',
      },
    },
  },
};

export default meta;

/**
 * This is the basic component
 */
export const Basic: Story = {
  name: 'Pinch Zoom Basic',
  args: {
    minScale: 0.5,
    maxScale: 2,
    bounceFactor: 0.9,
    printLogs: false,
  },
  argTypes: {
    minScale: { control: { type: 'number' } },
    maxScale: { control: { type: 'number' } },
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { Zoom } from '@elemix/zoom';

new Zoom(element);
        `,
      },
    },
  },
  render: (args, context) => createPinchZoom(args, context),
};

export const BoundaryMinScale: Story = {
  name: 'Pinch Zoom Min Boundary',
  args: {
    maxScale: 4,
    minScaleBoundaryType: PinchZoomBoundaryType.Auto,
    bounceFactor: 0.9,
    printLogs: false,
    imageRatio: '1:1',
  },
  argTypes: {
    minScaleBoundaryType: { control: { type: 'select' }, options: Object.values(PinchZoomBoundaryType) },
    maxScale: { control: { type: 'number' } },
    imageRatio: { control: { type: 'select' }, options: ['1:1', '1:2', '2:1'] },
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { Zoom } from '@elemix/zoom';

new Zoom(element);
        `,
      },
    },
  },
  render: (args, context) => createPinchZoom({ ...args, minScale: 'wrapper-small' }, context),
};

export const BoundaryMaxScale: Story = {
  name: 'Pinch Zoom Max Boundary',
  args: {
    minScale: 1,
    maxScaleBoundaryType: PinchZoomBoundaryType.Auto,
    bounceFactor: 0.9,
    printLogs: false,
    imageRatio: '1:1',
  },
  argTypes: {
    maxScaleBoundaryType: { control: { type: 'select' }, options: Object.values(PinchZoomBoundaryType) },
    minScale: { control: { type: 'number' } },
    imageRatio: { control: { type: 'select' }, options: ['1:1', '1:2', '2:1'] },
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { Zoom } from '@elemix/zoom';

new Zoom(element);
        `,
      },
    },
  },
  render: (args, context) => createPinchZoom({ ...args, maxScale: 'wrapper-big' }, context),
};

export const BoundaryMaxMinScale: Story = {
  args: {
    minScale: 'wrapper-small',
    maxScale: 'wrapper-big',
    minScaleBoundaryType: PinchZoomBoundaryType.Auto,
    maxScaleBoundaryType: PinchZoomBoundaryType.Auto,
    bounceFactor: 0.9,
    printLogs: false,
    imageRatio: '1:1',
  },
  argTypes: {
    maxScaleBoundaryType: { control: { type: 'select' }, options: Object.values(PinchZoomBoundaryType) },
    minScaleBoundaryType: { control: { type: 'select' }, options: Object.values(PinchZoomBoundaryType) },
    minScale: { control: { type: 'select' }, options: ['wrapper-big', 'wrapper-small', 0, 0.2, 0.4, 0.6, 0.8, 1] },
    maxScale: { control: { type: 'select' }, options: ['wrapper-big', 'wrapper-small', 1, 1.5, 2, 2.5, 3, 3.5] },
    imageRatio: { control: { type: 'select' }, options: ['1:1', '1:2', '2:1'] },
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { Zoom } from '@elemix/zoom';

new Zoom(element);
        `,
      },
    },
  },
  render: (args, context) => createPinchZoom(args, context),
};

import { Meta, StoryObj } from '@storybook/html';
import { createWheelZoom } from './wheel-zoom';
import README from '../../../../../packages/zoom/src/lib/wheel-zoom/README.md';

export interface WheelZoomStoryType {
  minScale: number;
  maxScale: number;
  wheelDeltaFactor: number;
}

type Story = StoryObj<WheelZoomStoryType>;

const meta: Meta<WheelZoomStoryType> = {
  title: 'Wheel Zoom',
  tags: ['autodocs'],
  argTypes: {
    minScale: { control: { type: 'number' } },
    maxScale: { control: { type: 'number' } },
    wheelDeltaFactor: { control: { type: 'number' } },
  },
  args: {},
  parameters: {
    componentSubtitle: 'TODO',
    docs: {
      overviewMarkdown: README,
      apiRefPath: ['packages/zoom/src/lib/wheel-zoom/wheel-zoom.model.ts'],
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
  name: 'Wheel Zoom Basic',
  args: {
    minScale: 0.5,
    maxScale: 6,
    wheelDeltaFactor: 0.01,
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { WheelZoom } from '@elemix/zoom';

new WheelZoom(element);
        `,
      },
    },
  },
  render: (args, context) => createWheelZoom(args, context),
};

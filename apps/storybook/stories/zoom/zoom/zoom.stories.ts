import { Meta, StoryObj } from '@storybook/html';
import { createZoom } from './zoom';
import README from '../../../../../packages/zoom/src/lib/zoom/README.md';

export interface ZoomStoryType {
  minScale: number;
  maxScale: number;
}

type Story = StoryObj<ZoomStoryType>;

const meta: Meta<ZoomStoryType> = {
  title: 'Zoom',
  tags: ['autodocs'],
  argTypes: {
    minScale: { control: { type: 'number' } },
    maxScale: { control: { type: 'number' } },
  },
  args: {},
  parameters: {
    componentSubtitle: 'TODO',
    docs: {
      overviewMarkdown: README,
      apiRefPath: [
        'packages/zoom/src/lib/zoom/zoom.model.ts',
        'packages/zoom/src/lib/pinch-zoom/pinch-zoom.model.ts',
        'packages/zoom/src/lib/click-zoom/click-zoom.model.ts',
        'packages/zoom/src/lib/wheel-zoom/wheel-zoom.model.ts',
        'packages/zoom/src/lib/zoom.model.ts',
      ],
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
    minScale: 0.2,
    maxScale: 6,
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
  render: (args, context) => createZoom(args, context),
};

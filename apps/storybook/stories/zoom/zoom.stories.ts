import { Meta, StoryObj } from '@storybook/html';
import { createBasicZoom } from './zoom';
import README from '../../../../packages/zoom/src/lib/pinch-zoom/README.md';

export interface ZoomStoryType {
  onEvents: (e: unknown) => void;
}

type Story = StoryObj<ZoomStoryType>;

const meta: Meta<ZoomStoryType> = {
  title: 'Pinch Zoom',
  tags: ['autodocs'],
  argTypes: {
    onEvents: { action: 'OnEvents', table: { disable: true } },
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
  args: {},
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
  render: (args, context) => createBasicZoom(args, context),
};

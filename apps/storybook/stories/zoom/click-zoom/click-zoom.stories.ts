import { Meta, StoryObj } from '@storybook/html';
import { createClickZoom } from './click-zoom';
import README from '../../../../../packages/zoom/src/lib/click-zoom/README.md';
import { ClickZoomType } from '@elemix/zoom';

export interface ClickZoomStoryType {
  minScale: number;
  maxScale: number;
  clickScaleFactor: number;
  dblclickScaleFactor: number;
  clickType: ClickZoomType;
}

type Story = StoryObj<ClickZoomStoryType>;

const meta: Meta<ClickZoomStoryType> = {
  title: 'Click Zoom',
  tags: ['autodocs'],
  argTypes: {
    minScale: { control: { type: 'number' } },
    maxScale: { control: { type: 'number' } },
    clickScaleFactor: { control: { type: 'number' } },
    dblclickScaleFactor: { control: { type: 'number' } },
    clickType: { control: { type: 'select' }, options: Object.values(ClickZoomType) },
  },
  args: {},
  parameters: {
    componentSubtitle: 'TODO',
    docs: {
      overviewMarkdown: README,
      apiRefPath: ['packages/zoom/src/lib/click-zoom/click-zoom.model.ts'],
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
  name: 'Click Zoom Basic',
  args: {
    minScale: 0.5,
    maxScale: 2,
    clickScaleFactor: 1.2,
    dblclickScaleFactor: 2,
    clickType: ClickZoomType.ZoomIn,
  },
  parameters: {
    docs: {
      source: {
        language: 'js',
        code: `
import { ClickZoom } from '@elemix/zoom';

new ClickZoom(element);
        `,
      },
    },
  },
  render: (args, context) => createClickZoom(args, context),
};

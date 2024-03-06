import { Meta, StoryObj } from '@storybook/html';
import README from '../../../../packages/crop/README.md';
import { createCrop } from './crop';

export interface CropStoryType {
  runTest: boolean;
}

type Story = StoryObj<CropStoryType>;

const meta: Meta<CropStoryType> = {
  title: 'Crop',
  tags: ['autodocs'],
  argTypes: {
    runTest: { control: 'boolean' },
  },
  args: {},
  parameters: {
    componentSubtitle: 'TODO',
    docs: {
      overviewMarkdown: README,
      apiRefPath: 'packages/crop/src/lib/crop.model.ts',
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
  args: {},
  render: (args, context) => createCrop(args, context),
};

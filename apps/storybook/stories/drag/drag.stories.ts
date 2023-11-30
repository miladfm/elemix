import { Meta, StoryObj } from '@storybook/html';
import { action, HandlerFunction } from '@storybook/addon-actions';
import { createDrag } from './drag';

export interface DragStoryType {
  backgroundColor: string;
  onDragPress: HandlerFunction;
  onDragStart: HandlerFunction;
  onDrag: HandlerFunction;
  onDragEnd: HandlerFunction;
  onDragRelease: HandlerFunction;
}

type Story = StoryObj<DragStoryType>;

const meta: Meta<DragStoryType> = {
  title: 'Drag/Basic',
  render: (args) => createDrag(args),
  argTypes: {},
  args: {},
};

export default meta;

export const Basic: Story = {
  args: {},
};

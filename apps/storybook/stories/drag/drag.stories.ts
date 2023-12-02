import { Meta, StoryObj } from '@storybook/html';
import { createDrag } from './drag';
import { MovementDirection } from '@elemix/drag';

export interface DragStoryType {
  movementDirection: MovementDirection;
  onPress: any;
}

type Story = StoryObj<DragStoryType>;

const meta: Meta<DragStoryType> = {
  title: 'Drag/Basic',
  render: (args) => createDrag(args),
  argTypes: {
    onPress: { action: 'OnPress', table: { disable: true } },
    movementDirection: {
      control: { type: 'select' },
      options: Object.values(MovementDirection),
    },
  },
  args: {},
};

export default meta;

export const Basic: Story = {
  args: {
    movementDirection: MovementDirection.Both,
  },
};

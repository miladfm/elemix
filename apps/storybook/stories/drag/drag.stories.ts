import { Meta, StoryObj } from '@storybook/html';
import { createBasicDrag, createBoundaryDrag } from './drag';
import { DragBoundaryType, MovementDirection } from '@elemix/drag';

export interface DragStoryType {
  movementDirection: MovementDirection;
  minMovements: number;
  onPress: any;
  boundaryType: DragBoundaryType;
  bounceFactor: number;

  bounceIntensity: number;
  dampeningFactor: number;
}

type Story = StoryObj<DragStoryType>;

const meta: Meta<DragStoryType> = {
  title: 'Drag/Basic',
  argTypes: {
    onPress: { action: 'OnPress', table: { disable: true } },
    movementDirection: { control: { type: 'select' }, options: Object.values(MovementDirection) },
    minMovements: { control: { type: 'number' } },
  },
  args: {},
};

export default meta;

export const Basic: Story = {
  args: {
    movementDirection: MovementDirection.Both,
    minMovements: 0,
  },
  render: (args) => createBasicDrag(args),
};

export const Boundary: Story = {
  argTypes: {
    boundaryType: { control: { type: 'select' }, options: Object.values(DragBoundaryType) },
    bounceFactor: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
  args: {
    movementDirection: MovementDirection.Both,
    minMovements: 0,
    boundaryType: DragBoundaryType.Inner,
    bounceFactor: 1,
  },
  render: (args) => createBoundaryDrag(args),
};

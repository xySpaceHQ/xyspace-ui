import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chips";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "UI/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GreenChip: Story = {
  render: () => (
    <Chip color="green" size="lg" onDismiss={() => {}}>
      Active
    </Chip>
  ),
};

export const BlueChip: Story = {
  render: () => (
    <Chip color="blue" onDismiss={() => {}}>
      Maya
    </Chip>
  ),
};

export const RedChip: Story = {
  render: () => (
    <Chip color="red" onDismiss={() => {}} outlined>
      Blocked
    </Chip>
  ),
};

export const PurpleChip: Story = {
  render: () => (
    <Chip
      color="purple"
      selectable
      size="lg"
      selected={true}
      onSelectedChange={() => {}}
      leading={
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      }
    >
      Design
    </Chip>
  ),
};

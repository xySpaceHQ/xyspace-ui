import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Input type="password" placeholder="Enter your password" />,
};

export const Disabled: Story = {
  render: () => (
    <Input type="password" disabled placeholder="Enter your password" />
  ),
};

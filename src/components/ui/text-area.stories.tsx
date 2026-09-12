import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./text-area";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Textarea className="w-64" placeholder="Type your message here" />
  ),
};

export const WithValue: Story = {
  render: () => (
    <Textarea
      className="w-64"
      defaultValue="This is some example text inside the textarea."
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Textarea
      className="w-64"
      disabled
      placeholder="Type your message here"
    />
  ),
};

export const Invalid: Story = {
  render: () => (
    <Textarea
      className="w-64"
      aria-invalid
      defaultValue="Something went wrong with this input."
    />
  ),
};

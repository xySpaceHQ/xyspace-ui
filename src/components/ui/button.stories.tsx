import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button variant="secondary">Default Button</Button>,
};

export const Small: Story = {
  render: () => <Button size="sm">Small Button</Button>,
};

export const Large: Story = {
  render: () => <Button size="lg">Small Button</Button>,
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
      Button with Icon
    </Button>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Button asChild>
      <a href="#">Button as Child</a>
    </Button>
  ),
};

export const AsChildWithIcon: Story = {
  render: () => (
    <Button asChild>
      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />
        </svg>
        Button as Child with Icon
      </a>
    </Button>
  ),
};

export const WithIconOnly: Story = {
  render: () => (
    <Button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    </Button>
  ),
};

export const Disabled: Story = {
  render: () => <Button disabled>Default Button</Button>,
};

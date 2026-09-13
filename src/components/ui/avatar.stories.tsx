import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-image-url.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="bg-highlight-green-50">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="bg-highlight-blue-50">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const GroupSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarGroup>
        <Avatar size="sm" className="bg-highlight-purple-50">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="sm" className="bg-highlight-green-50">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="default" className="bg-highlight-purple-50">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="default" className="bg-highlight-green-50">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg" className="bg-highlight-purple-50">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg" className="bg-highlight-green-50">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
};

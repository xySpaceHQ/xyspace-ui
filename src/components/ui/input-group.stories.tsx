import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupInput aria-invalid placeholder="Enter a value" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>Required</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupInput disabled placeholder="Enter a value" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton disabled>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupTextarea placeholder="Write a note" />
      <InputGroupAddon align="block-end">
        <InputGroupText>0/280</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

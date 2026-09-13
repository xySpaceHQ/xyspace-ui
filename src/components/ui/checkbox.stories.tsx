import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox />,
};

export const Checked: Story = {
  render: () => <Checkbox defaultChecked />,
};

export const Disabled: Story = {
  render: () => <Checkbox disabled />,
};

export const DisabledChecked: Story = {
  render: () => <Checkbox disabled defaultChecked />,
};

export const Indeterminate: Story = {
  render: () => <Checkbox indeterminate />,
};

export const Invalid: Story = {
  render: () => <Checkbox aria-invalid />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="group/field-label flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const ControlledCheckbox = () => {
      const [checked, setChecked] = useState(false);

      return (
        <div className="group/field-label flex items-center gap-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
          <Label htmlFor="controlled">
            {checked ? "Checked" : "Unchecked"}
          </Label>
        </div>
      );
    };

    return <ControlledCheckbox />;
  },
};

export const List: Story = {
  render: () => {
    const items = ["Recents", "Home", "Applications", "Desktop"];

    return (
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item} className="group/field-label flex items-center gap-2">
            <Checkbox id={item} />
            <Label htmlFor={item}>{item}</Label>
          </div>
        ))}
      </div>
    );
  },
};

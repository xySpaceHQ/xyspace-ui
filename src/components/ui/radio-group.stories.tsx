import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" disabled>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="default" id="rd1" />
        <Label htmlFor="rd1">Default</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="rd2" />
        <Label htmlFor="rd2">Comfortable</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="compact" id="rd3" />
        <Label htmlFor="rd3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="default">
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="default" id="rdi1" />
        <Label htmlFor="rdi1">Default</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="rdi2" disabled />
        <Label htmlFor="rdi2">Comfortable</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="compact" id="rdi3" />
        <Label htmlFor="rdi3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="default" id="ri1" aria-invalid />
        <Label htmlFor="ri1">Default</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="ri2" aria-invalid />
        <Label htmlFor="ri2">Comfortable</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="compact" id="ri3" aria-invalid />
        <Label htmlFor="ri3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="grid-flow-col w-auto gap-6">
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="default" id="rh1" />
        <Label htmlFor="rh1">Default</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="rh2" />
        <Label htmlFor="rh2">Comfortable</Label>
      </div>
      <div className="group/field-label flex items-center gap-2">
        <RadioGroupItem value="compact" id="rh3" />
        <Label htmlFor="rh3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const ControlledRadioGroup = () => {
      const [value, setValue] = useState("comfortable");

      return (
        <div className="flex flex-col gap-3">
          <RadioGroup value={value} onValueChange={(v) => setValue(String(v))}>
            <div className="group/field-label flex items-center gap-2">
              <RadioGroupItem value="default" id="rc1" />
              <Label htmlFor="rc1">Default</Label>
            </div>
            <div className="group/field-label flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="rc2" />
              <Label htmlFor="rc2">Comfortable</Label>
            </div>
            <div className="group/field-label flex items-center gap-2">
              <RadioGroupItem value="compact" id="rc3" />
              <Label htmlFor="rc3">Compact</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">Selected: {value}</p>
        </div>
      );
    };

    return <ControlledRadioGroup />;
  },
};

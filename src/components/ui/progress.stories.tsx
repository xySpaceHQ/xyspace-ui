import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "./progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
  },
  args: {
    value: 50,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={50} />
    </div>
  ),
};

export const WithLabelAndValue: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={50}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={0}>
        <ProgressLabel>Not started</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};

export const Complete: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={100}>
        <ProgressLabel>Done</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={null}>
        <ProgressLabel>Loading</ProgressLabel>
      </Progress>
    </div>
  ),
};

export const CustomRange: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={30} min={0} max={50}>
        <ProgressLabel>Storage used</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};

export const CustomFormat: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={3} min={0} max={5} format={{ style: "decimal" }}>
        <ProgressLabel>Steps completed</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className="w-64">
      <ProgressPrimitive.Root value={70} className="flex flex-wrap gap-3">
        <ProgressLabel>Custom color</ProgressLabel>
        <ProgressValue />
        <ProgressTrack className="bg-highlight-grey-25">
          <ProgressIndicator className="bg-green-500" />
        </ProgressTrack>
      </ProgressPrimitive.Root>
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const AnimatedProgress = () => {
      const [value, setValue] = useState(0);

      useEffect(() => {
        const interval = setInterval(() => {
          setValue((prev) => (prev >= 100 ? 0 : prev + 10));
        }, 500);
        return () => clearInterval(interval);
      }, []);

      return (
        <Progress value={value}>
          <ProgressLabel>Processing</ProgressLabel>
          <ProgressValue />
        </Progress>
      );
    };

    return (
      <div className="w-64">
        <AnimatedProgress />
      </div>
    );
  },
};

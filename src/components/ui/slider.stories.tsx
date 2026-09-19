import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Slider, SliderLabel, SliderValue } from "./slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Slider
        defaultValue={50}
        getThumbAriaLabel={() => "Amount"}
      />
    </div>
  ),
};

export const WithLabelAndValue: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={40}>
        <SliderLabel>Volume</SliderLabel>
        <SliderValue />
      </Slider>
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[25, 75]}>
        <SliderLabel>Price range</SliderLabel>
        <SliderValue />
      </Slider>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={30} disabled>
        <SliderLabel>Locked</SliderLabel>
        <SliderValue />
      </Slider>
    </div>
  ),
};

/** Min/max hints above and a value pill beside the slider, e.g. a cell-size picker. */
export const WithRangeHintsAndValuePill: Story = {
  render: () => {
    const CellSize = () => {
      const [value, setValue] = useState(100);

      return (
        <div className="flex w-80 flex-col gap-1.5">
          <h5 className="px-1 text-xs font-medium text-subtext-01">Cell size</h5>
          <div className="flex justify-between px-1 text-[0.64rem] text-subtext-01">
            <span>50m</span>
            <span>1000m</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              min={50}
              max={1000}
              step={10}
              value={value}
              onValueChange={setValue}
              getThumbAriaLabel={() => "Cell size in metres"}
            />
            <span className="shrink-0 rounded-10 bg-surface-level-02 px-2.5 py-1 text-xs font-medium text-body tabular-nums">
              {value} m
            </span>
          </div>
        </div>
      );
    };

    return <CellSize />;
  },
};

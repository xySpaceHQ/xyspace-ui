import type { Meta, StoryObj } from "@storybook/react-vite";
import AppTab from "./app-tab";
import React, { useState } from "react";

const meta: Meta<typeof AppTab> = {
  title: "Custom/AppTab",
  component: AppTab,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Tab: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
      <AppTab
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        value={activeTab}
        tablist={[
          { value: "home", label: "Home", content: <div>Home Content</div> },
          {
            value: "disabled",
            label: "Disabled",
            content: <div>Disabled Content</div>,
          },
        ]}
      />
    );
  },
};

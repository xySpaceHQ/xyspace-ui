import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { SectionContainer } from "./section-container";
import { Button } from "../ui/button";
import Table from "@/icons/Table";
import Track from "@/icons/Track";

const meta: Meta<typeof SectionContainer> = {
  title: "Custom/SectionContainer",
  component: SectionContainer,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = ({ label = "Content" }: { label?: string }) => (
  <div className="rounded-lg border border-dashed p-6 text-sm text-gray-500">
    {label}
  </div>
);

export const Default: Story = {
  render: () => (
    <SectionContainer title="Section title" onClose={() => alert("closed")}>
      <Placeholder />
    </SectionContainer>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <SectionContainer title="No close button" showCloseButton={false}>
      <Placeholder />
    </SectionContainer>
  ),
};

export const NoTitle: Story = {
  render: () => (
    <SectionContainer onClose={() => alert("closed")}>
      <Placeholder label="A section without a title, close button still shows" />
    </SectionContainer>
  ),
};

export const NoHeaderContent: Story = {
  render: () => (
    <SectionContainer showCloseButton={false}>
      <Placeholder label="No title, no close button — header row is skipped entirely" />
    </SectionContainer>
  ),
};

export const CustomTitleNode: Story = {
  render: () => (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5" />
          <span className="text-2xl font-bold">Custom title node</span>
        </div>
      }
      onClose={() => alert("closed")}
    >
      <Placeholder label="title accepts any ReactNode, not just a string" />
    </SectionContainer>
  ),
};

export const WithActions: Story = {
  render: () => (
    <SectionContainer
      title="With extra actions"
      onClose={() => alert("closed")}
      actions={
        <>
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="default" size="sm">
            Add
          </Button>
        </>
      }
    >
      <Placeholder label="actions render before the close button" />
    </SectionContainer>
  ),
};

export const CustomCloseIcon: Story = {
  render: () => (
    <SectionContainer
      title="Custom close icon"
      onClose={() => alert("closed")}
      closeIcon={<Track className="h-4 w-4" />}
    >
      <Placeholder />
    </SectionContainer>
  ),
};

export const CustomHeaderOverride: Story = {
  render: () => (
    <SectionContainer
      header={
        <div className="flex items-center justify-between rounded-lg bg-highlight-grey-25 p-3">
          <span className="font-semibold">Fully custom header</span>
          <Button variant="ghost" size="sm">
            Custom action
          </Button>
        </div>
      }
    >
      <Placeholder label="the default title/actions/close row is replaced entirely" />
    </SectionContainer>
  ),
};

export const WithoutDivider: Story = {
  render: () => (
    <SectionContainer
      title="No divider"
      divider={false}
      onClose={() => alert("closed")}
    >
      <Placeholder label="the dotted header divider is opt-out via divider={false}" />
    </SectionContainer>
  ),
};

export const CollapsibleUncontrolled: Story = {
  render: () => (
    <SectionContainer
      title="Collapsible (uncontrolled)"
      collapsible
      onClose={() => alert("closed")}
    >
      <Placeholder label="click the panel icon to toggle" />
    </SectionContainer>
  ),
};

export const CollapsibleDefaultCollapsed: Story = {
  render: () => (
    <SectionContainer
      title="Starts collapsed"
      collapsible
      defaultCollapsed
      onClose={() => alert("closed")}
    >
      <Placeholder label="mounted collapsed via defaultCollapsed" />
    </SectionContainer>
  ),
};

export const CollapsibleControlled: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setCollapsed((c) => !c)}
        >
          Toggle from outside ({collapsed ? "expanded" : "collapsed"})
        </Button>
        <SectionContainer
          title="Collapsible (controlled)"
          collapsible
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        >
          <Placeholder label="state is owned by the parent" />
        </SectionContainer>
      </div>
    );
  },
};

export const CollapsibleCustomIcons: Story = {
  render: () => (
    <SectionContainer
      title="Custom expand/collapse icons"
      collapsible
      collapseIcon={<span className="text-base leading-none">−</span>}
      expandIcon={<span className="text-base leading-none">+</span>}
    >
      <Placeholder label="collapseIcon/expandIcon override the defaults" />
    </SectionContainer>
  ),
};

export const CollapsibleWithActionsAndClose: Story = {
  render: () => (
    <SectionContainer
      title="Everything together"
      collapsible
      onClose={() => alert("closed")}
      actions={
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      <Placeholder label="actions, collapse toggle and close button all in the header" />
    </SectionContainer>
  ),
};

export const LayersPanelSample: Story = {
  name: "Sample: Layers panel",
  render: () => (
    <div className="flex max-w-sm items-start bg-[url('https://upload.wikimedia.org/wikipedia/commons/9/9d/Satellite_image_of_farmland.jpg')] bg-cover p-6">
      <SectionContainer title="Layers" collapsible showCloseButton={false}>
        <div className="flex flex-col gap-6">
          <label className="flex items-center gap-3">
            <input type="radio" name="layer" className="h-5 w-5" />
            <span className="text-lg">Mapping Point</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-5 w-5 rounded" />
            <span className="text-lg">Layer Name</span>
          </label>
        </div>
      </SectionContainer>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button";
import SidebarSimple from "@/icons/SidebarSimple";
import { AppDialog } from "./app-dialog";
import { SVGProps } from "react";
import BackgroundVectorUp from "@/vectors/BackgroundVectorUp";

const meta: Meta<typeof AppDialog> = {
  title: "Custom/AppDialog",
  component: AppDialog,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AppDialog
      trigger={<Button>Open dialog</Button>}
      showBgVector
      backgroundVector={
        <BackgroundVectorUp className="fill-border-02 h-auto" />
      }
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </>
      }
    />
  ),
};

export const LayersPanel: Story = {
  name: "Sample: Layers panel",
  render: () => (
    <div className="flex max-w-sm items-start bg-[url('https://upload.wikimedia.org/wikipedia/commons/9/9d/Satellite_image_of_farmland.jpg')] bg-cover p-6">
      <AppDialog
        trigger={<Button>Open layers</Button>}
        defaultOpen
        modal={false}
        position="top"
        overlayClassName="bg-transparent"
        contentClassName="static translate-x-0 translate-y-0 w-full max-w-sm shadow-lg"
        title="Layers"
        showCloseButton={false}
        showBgVector
        backgroundVector={
          <BackgroundVectorUp className="absolute w-135.5 fill-border-02 h-46.75 right-0 top-0 z-0" />
        }
        headerActions={
          <Button variant="ghost" size="icon-sm" aria-label="Toggle panel">
            <SidebarSimple className="h-4 w-4" />
          </Button>
        }
      >
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
      </AppDialog>
    </div>
  ),
};

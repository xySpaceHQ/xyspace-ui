"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";

// The group owns the Input surface (bg, radius, height, focus/invalid/disabled
// states) so addons and buttons sit inside the same field as the control.
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-[2.815rem] w-full min-w-0 items-center rounded-14 bg-base-01 text-body transition-[color,box-shadow] outline-none",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-[1px] has-[[data-slot=input-group-control]:focus-visible]:ring-highlight-grey-50",
        "has-[[data-slot][aria-invalid=true]]:ring-[1px] has-[[data-slot][aria-invalid=true]]:ring-highlight-red-100",
        "has-disabled:cursor-not-allowed has-disabled:bg-base-disable",
        "in-data-[slot=combobox-content]:focus-within:ring-0",
        "has-[>textarea]:h-auto has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
        "has-[>[data-align=block-end]]:[&>input]:pt-s has-[>[data-align=block-start]]:[&>input]:pb-s has-[>[data-align=inline-end]]:[&>input]:pr-xs has-[>[data-align=inline-start]]:[&>input]:pl-xs",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-s py-xs text-sm font-medium text-subtle select-none group-has-disabled/input-group:text-btn-primary-disable [&>kbd]:rounded-4 [&>svg]:text-icon-default [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-s group-has-[>input]/input-group:pt-s [.border-b]:border-border-01 [.border-b]:pb-s",
        "block-end":
          "order-last w-full justify-start px-3 pb-s group-has-[>input]/input-group:pb-s [.border-t]:border-border-01 [.border-t]:pt-s",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-s text-sm text-subtext-01 shadow-none [&_svg]:text-icon-default hover:[&_svg]:text-icon-active",
  {
    variants: {
      size: {
        xs: "h-6 gap-xs rounded-8 px-s [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 rounded-10 px-s",
        "icon-xs": "size-6 rounded-8 p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 rounded-10 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-s text-sm text-subtle [&_svg]:pointer-events-none [&_svg]:text-icon-default [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

// Strips the standalone Input surface so the control inherits the group's.
function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-full flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-s shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};

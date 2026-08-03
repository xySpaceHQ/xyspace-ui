import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-8 text-sm font-normal transition-all disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover hover:text focus-visible:ring-btn-primary-focus disabled:bg-btn-primary-disabled disabled:text-btn-primary-text-disabled",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover focus-visible:ring-border-02 disabled:bg-btn-secondary-disabled disabled:text-btn-secondary-text-disabled",
        tertiary:
          "bg-surface-00 text-btn-secondary-text hover:bg-highlight-grey-25 hover:text-btn-secondary-text",
        text: "bg-base underline-offset-4 hover:underline text-btn-secondary-text",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[2.5rem] px-lg py-l has-[>svg]:px-3",
        sm: "h-[2.125rem] gap-1.5 px-l py-s  has-[>svg]:px-2.5",
        lg: "h-[3.25rem] p-lg has-[>svg]:px-3",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

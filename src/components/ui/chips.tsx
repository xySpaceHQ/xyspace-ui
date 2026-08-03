import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  [
    "group/chip relative inline-flex w-fit shrink-0 items-center gap-1.5",
    "rounded-full border border-transparent whitespace-nowrap",
    "font-medium transition-[color,background-color,border-color,box-shadow]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  ],
  {
    variants: {
      variant: {
        text: "",
        image: "",
        NoImage: "",
      },
      size: {
        sm: "h-6 px-2 text-xs [&_svg]:size-3",
        md: "h-8 px-3 text-[13px] [&_svg]:size-3.5",
        lg: "h-9 px-3.5 text-sm [&_svg]:size-4",
      },
      color: {
        grey: "bg-highlight-grey-25 text-highlight-grey-100 data-[interactive=true]:hover:bg-highlight-grey-50 data-[selected=true]:bg-highlight-grey-50 data-[selected=true]:border-highlight-grey-100/25",
        green:
          "bg-highlight-green-25 text-highlight-green-100 data-[interactive=true]:hover:bg-highlight-green-50 data-[selected=true]:bg-highlight-green-50 data-[selected=true]:border-highlight-green-100/25",
        yellow:
          "bg-highlight-yellow-25 text-highlight-yellow-100 data-[interactive=true]:hover:bg-highlight-yellow-50 data-[selected=true]:bg-highlight-yellow-50 data-[selected=true]:border-highlight-yellow-100/25",
        purple:
          "bg-highlight-purple-25 text-highlight-purple-100 data-[interactive=true]:hover:bg-highlight-purple-50 data-[selected=true]:bg-highlight-purple-50 data-[selected=true]:border-highlight-purple-100/25",
        red: "bg-highlight-red-25 text-highlight-red-100 data-[interactive=true]:hover:bg-highlight-red-50 data-[selected=true]:bg-highlight-red-50 data-[selected=true]:border-highlight-red-100/25",
        blue: "bg-highlight-blue-25 text-highlight-blue-100 data-[interactive=true]:hover:bg-highlight-blue-50 data-[selected=true]:bg-highlight-blue-50 data-[selected=true]:border-highlight-blue-100/25",
        orange:
          "bg-highlight-orange-25 text-highlight-orange-100 data-[interactive=true]:hover:bg-highlight-orange-50 data-[selected=true]:bg-highlight-orange-50 data-[selected=true]:border-highlight-orange-100/25",
      },
      outlined: {
        true: "bg-transparent border-current/25",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", className: "data-[dismissible=true]:pr-1" },
      { size: "md", className: "data-[dismissible=true]:pr-1.5" },
      { size: "lg", className: "data-[dismissible=true]:pr-2" },
      { variant: "image", size: "sm", className: "pl-1" },
      { variant: "image", size: "md", className: "pl-1.5" },
      { variant: "image", size: "lg", className: "pl-2" },
    ],
    defaultVariants: {
      variant: "text",
      size: "md",
      color: "grey",
      outlined: false,
    },
  },
);

type ChipProps = Omit<React.ComponentProps<"span">, "onSelect" | "color" | "ref"> &
  VariantProps<typeof chipVariants> & {
    asChild?: boolean;
    /** Renders as a toggle. Wires up aria-pressed, hover and keyboard. */
    selectable?: boolean;
    selected?: boolean;
    onSelectedChange?: (selected: boolean) => void;
    /** Shows a trailing remove button. Backspace and Delete also fire it. */
    onDismiss?: () => void;
    dismissLabel?: string;
    disabled?: boolean;
    /** Avatar, icon or count rendered before the label. */
    leading?: React.ReactNode;
  };

function Chip({
  className,
  variant,
  size = "md",
  color,
  outlined,
  asChild = false,
  selectable = false,
  selected = false,
  onSelectedChange,
  onDismiss,
  dismissLabel = "Remove",
  disabled = false,
  leading,
  children,
  onClick,
  onKeyDown,
  ...props
}: ChipProps) {
  const interactive = selectable || Boolean(onClick);
  const dismissible = Boolean(onDismiss);
  const resolvedVariant = variant ?? (leading ? "image" : "text");

  const Comp: React.ElementType = asChild
    ? Slot.Root
    : interactive
      ? "button"
      : "span";

  function handleClick(event: React.MouseEvent<HTMLSpanElement>) {
    if (disabled) return;
    onClick?.(event);
    if (selectable && !event.defaultPrevented) onSelectedChange?.(!selected);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (dismissible && (event.key === "Backspace" || event.key === "Delete")) {
      event.preventDefault();
      onDismiss?.();
    }
  }

  return (
    <Comp
      data-slot="chip"
      data-variant={resolvedVariant}
      data-color={color ?? "grey"}
      data-interactive={interactive || undefined}
      data-selected={selected || undefined}
      data-dismissible={dismissible || undefined}
      data-has-leading={leading ? true : undefined}
      data-disabled={disabled || undefined}
      aria-pressed={selectable ? selected : undefined}
      disabled={interactive && Comp === "button" ? disabled : undefined}
      tabIndex={!interactive && dismissible ? 0 : undefined}
      className={cn(
        chipVariants({ variant: resolvedVariant, size, color, outlined }),
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {leading}
      <span className="min-w-0 truncate">{children}</span>
      {dismissible ? (
        <span
          role="button"
          tabIndex={-1}
          aria-label={dismissLabel}
          onClick={(event) => {
            event.stopPropagation();
            if (!disabled) onDismiss?.();
          }}
          className={cn(
            "-mr-0.5 grid place-items-center rounded-full opacity-60",
            "transition-[opacity,background-color] cursor-pointer",
            "hover:bg-current/15 hover:opacity-100",
            size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5",
          )}
        >
          <XIcon aria-hidden="true" />
        </span>
      ) : null}
    </Comp>
  );
}

export { Chip, chipVariants };
export type { ChipProps };

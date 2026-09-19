"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

type SliderInputValue = number | readonly number[];

/** How many thumbs to render: one per entry of a range value, otherwise one. */
function getThumbCount(
  value: SliderInputValue | undefined,
  defaultValue: SliderInputValue | undefined,
) {
  const current = value ?? defaultValue;
  return Array.isArray(current) ? current.length : 1;
}

/**
 * Track and fill mirror `Progress` so the two read as one family; the thumb is
 * the only addition. Pass a number for a single thumb or an array for a range.
 * Compose `SliderLabel` / `SliderValue` as children, like `Progress`.
 */
function Slider<Value extends SliderInputValue = number>({
  className,
  children,
  value,
  defaultValue,
  getThumbAriaLabel,
  ...props
}: SliderPrimitive.Root.Props<Value> & {
  /** Accessible name per thumb, for when there is no visible `SliderLabel`. */
  getThumbAriaLabel?: (index: number) => string;
}) {
  const thumbCount = getThumbCount(value, defaultValue);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      thumbAlignment="edge"
      className={cn("flex w-full flex-wrap items-center gap-3", className)}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      {children}
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          {Array.from({ length: thumbCount }, (_, index) => (
            <SliderThumb
              key={index}
              index={thumbCount > 1 ? index : undefined}
              getAriaLabel={getThumbAriaLabel}
            />
          ))}
        </SliderTrack>
      </SliderControl>
    </SliderPrimitive.Root>
  );
}

function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn(
        "flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function SliderTrack({ className, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(
        "relative h-0.5 w-full rounded-full bg-surface-level-04",
        className,
      )}
      {...props}
    />
  );
}

function SliderIndicator({
  className,
  ...props
}: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn("h-full rounded-full bg-surface-inverse", className)}
      {...props}
    />
  );
}

function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        "size-4 rounded-full border-2 border-surface-base-00 bg-surface-inverse shadow-md outline-none transition-shadow",
        // Enlarges the pointer hit area without changing the visible size.
        "after:absolute after:-inset-2",
        "focus-visible:ring-4 focus-visible:ring-border-02 data-[dragging]:ring-4 data-[dragging]:ring-border-02",
        className,
      )}
      {...props}
    />
  );
}

function SliderLabel({ className, ...props }: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("ml-auto text-xs text-body tabular-nums", className)}
      {...props}
    />
  );
}

export {
  Slider,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderLabel,
  SliderValue,
};

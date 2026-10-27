"use client";

import type { ComponentType, SVGProps } from "react";

import {
  ArrowBendUpLeft,
  ArrowBendUpRight,
  PencilSimple,
  Ruler,
  SelectionPlus,
} from "@/icons";
import LineSegment from "@/icons/LineSegment";
import { cn } from "@/lib/utils";

import type { MapDrawController, MapDrawTool } from "./map-draw";

/*
 * Floating toolbar for `useMapDraw()`: one button per drawing tool, then
 * undo / redo, with a hint for the active tool. Drop it inside <Map> next to
 * <MapDraw>; it sits at the bottom center unless told otherwise.
 *
 *   const draw = useMapDraw({ onCreate });
 *   <Map>
 *     <MapDraw draw={draw} />
 *     <MapDrawToolbar draw={draw} tools={["polygon", "rectangle"]} />
 *   </Map>
 */

type MapDrawToolbarPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type MapDrawToolbarProps = {
  /** Controller from `useMapDraw()`. */
  draw: MapDrawController;
  /** Tools to show, in order (default: polygon, rectangle, measure). */
  tools?: MapDrawTool[];
  /** Where the toolbar sits over the map (default: "bottom-center"). */
  position?: MapDrawToolbarPosition;
  /** Show a hint for the active tool next to the toolbar (default: true). */
  showHint?: boolean;
  /** Override the hint text per tool, or for `edit` while a shape is being edited. */
  hints?: Partial<Record<MapDrawTool | "edit", string>>;
  /** Disable every button, e.g. while saving. */
  disabled?: boolean;
  className?: string;
};

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const TOOLS: Record<MapDrawTool, { label: string; icon: Icon }> = {
  polygon: { label: "Draw polygon", icon: PencilSimple },
  rectangle: { label: "Draw rectangle", icon: SelectionPlus },
  line: { label: "Draw line", icon: LineSegment },
  measure: { label: "Measure distance", icon: Ruler },
};

const DEFAULT_HINTS: Record<MapDrawTool | "edit", string> = {
  polygon:
    "Click to add points. Click the first point or press Enter to close the shape.",
  rectangle: "Press and drag to draw a rectangle.",
  line: "Click to add points. Double-click or press Enter to finish.",
  measure: "Click to measure. Double-click or press Enter to finish.",
  edit: "Drag points to reshape, drag a midpoint to add one. Select a point and press Delete to remove it.",
};

const positionClasses: Record<MapDrawToolbarPosition, string> = {
  "top-left": "top-2.5 left-2 items-start",
  "top-center": "top-2.5 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-2.5 right-2 items-end",
  "bottom-left": "bottom-2.5 left-2 items-start flex-col-reverse",
  "bottom-center":
    "bottom-2.5 left-1/2 -translate-x-1/2 items-center flex-col-reverse",
  "bottom-right": "bottom-2.5 right-2 items-end flex-col-reverse",
};

function ToolbarButton({
  label,
  icon: Icon,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  icon: Icon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-icon-default flex size-8 items-center justify-center rounded-full transition-colors",
        "hover:bg-btn-icon-hover focus-visible:ring-border-03 focus-visible:ring-2 focus-visible:outline-none",
        "disabled:text-icon-disabled disabled:pointer-events-none",
        active && "bg-btn-icon-hover text-icon-active",
      )}
    >
      <Icon className="size-4.5" />
    </button>
  );
}

/** Drawing tools plus undo / redo for a `useMapDraw()` controller. */
function MapDrawToolbar({
  draw,
  tools = ["polygon", "rectangle", "measure"],
  position = "bottom-center",
  showHint = true,
  hints,
  disabled = false,
  className,
}: MapDrawToolbarProps) {
  const hintKey = draw.editing ? "edit" : draw.mode;
  const hint = hintKey ? (hints?.[hintKey] ?? DEFAULT_HINTS[hintKey]) : null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 flex flex-col gap-2",
        positionClasses[position],
        className,
      )}
    >
      <div
        role="toolbar"
        aria-label="Drawing tools"
        // Same height as <MapControls> (h-9), so the two line up along the bottom.
        className="bg-surface-base-01 pointer-events-auto flex h-9 items-center gap-1 rounded-full px-0.5"
      >
        {tools.map((tool) => (
          <ToolbarButton
            key={tool}
            label={TOOLS[tool].label}
            icon={TOOLS[tool].icon}
            active={draw.mode === tool}
            disabled={disabled}
            // Clicking the active tool again puts it down.
            onClick={() =>
              draw.mode === tool ? draw.cancel() : draw.start(tool)
            }
          />
        ))}
        <span aria-hidden className="bg-border-02 mx-0.5 h-5 w-px" />
        <ToolbarButton
          label="Undo"
          icon={ArrowBendUpLeft}
          disabled={disabled || !draw.canUndo}
          onClick={draw.undo}
        />
        <ToolbarButton
          label="Redo"
          icon={ArrowBendUpRight}
          disabled={disabled || !draw.canRedo}
          onClick={draw.redo}
        />
      </div>
      {showHint && hint && (
        <p
          role="status"
          className="bg-foreground/85 text-background max-w-80 rounded-md px-2.5 py-1.5 text-center text-xs text-balance shadow-md"
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export { MapDrawToolbar };

export type { MapDrawToolbarProps, MapDrawToolbarPosition };

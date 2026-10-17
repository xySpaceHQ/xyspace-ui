"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MagnifyingGlass from "@/icons/MagnifyingGlass";

export type ColumnPickerOption = {
  id: string;
  label: string;
};

type ColumnPickerProps = {
  columns: ColumnPickerOption[];
  // Ids of the columns currently shown
  visibleColumnIds: ReadonlySet<string> | string[];
  onVisibilityChange: (columnId: string, visible: boolean) => void;
  // Shows "Show all" / "Hide all" when given
  onAllVisibilityChange?: (visible: boolean) => void;
  // The element that opens the picker, e.g. a button
  trigger: React.ReactElement;
  align?: "start" | "center" | "end";
  searchPlaceholder?: string;
  emptyMessage?: React.ReactNode;
  className?: string;
  listClassName?: string;
};

export function ColumnPicker({
  columns,
  visibleColumnIds,
  onVisibilityChange,
  onAllVisibilityChange,
  trigger,
  align = "end",
  searchPlaceholder = "Search columns",
  emptyMessage = "No columns found.",
  className,
  listClassName,
}: ColumnPickerProps) {
  const [search, setSearch] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  const visibleIds = React.useMemo(
    () => new Set(visibleColumnIds),
    [visibleColumnIds],
  );

  const filteredColumns = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return columns;
    return columns.filter(
      (column) =>
        column.label.toLowerCase().includes(query) ||
        column.id.toLowerCase().includes(query),
    );
  }, [columns, search]);

  const visibleCount = columns.filter((column) =>
    visibleIds.has(column.id),
  ).length;

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) setSearch("");
      }}
    >
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        initialFocus={searchRef}
        className={cn(
          "w-60 gap-1 rounded-10 bg-surface-base-01 p-2 shadow-4 ring-border-01",
          className,
        )}
      >
        <div className="flex items-center gap-2 rounded-md border border-border-01 px-2">
          <MagnifyingGlass className="size-4 shrink-0 text-icon-subtle" />
          <input
            ref={searchRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-8 w-full min-w-0 bg-transparent text-xs font-medium text-body outline-none placeholder:text-subtle"
          />
        </div>

        <div className="flex items-center justify-between px-1.5 pt-1 text-xs text-subtext-02">
          <span className="text-xs">
            {visibleCount} of {columns.length} shown
          </span>
          {onAllVisibilityChange && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-medium hover:text-body disabled:opacity-50"
                disabled={visibleCount === columns.length}
                onClick={() => onAllVisibilityChange(true)}
              >
                Show all
              </button>
              <button
                type="button"
                className="text-xs font-medium hover:text-body disabled:opacity-50"
                disabled={visibleCount === 0}
                onClick={() => onAllVisibilityChange(false)}
              >
                Hide all
              </button>
            </div>
          )}
        </div>

        <div
          role="group"
          className={cn("-mx-1 max-h-64 overflow-y-auto px-1", listClassName)}
        >
          {filteredColumns.length ? (
            filteredColumns.map((column) => {
              const checked = visibleIds.has(column.id);
              return (
                <label
                  key={column.id}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-xs font-medium text-body select-none hover:bg-surface-level-02 has-focus-visible:bg-surface-level-02"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      onVisibilityChange(column.id, value)
                    }
                    className="size-4 rounded-sm after:hidden"
                  />
                  <span className="truncate">{column.label}</span>
                </label>
              );
            })
          ) : (
            <div className="px-1.5 py-4 text-center text-xs text-subtext-02">
              {emptyMessage}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

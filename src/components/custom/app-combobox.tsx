"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import { Chip, type ChipProps } from "../ui/chips";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type AppComboboxItem = {
  value: string;
  label?: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
  /**
   * Classes for the circle behind `icon` in the menu, e.g. its background.
   * Also colours the initials avatar shown when an item has no `icon`.
   */
  iconClassName?: string;
};

type AppComboboxProps = {
  value: AppComboboxItem[];
  onValueChange: (value: AppComboboxItem[]) => void;
  options: AppComboboxItem[];
  searchValue?: string;
  onSearchChange?: (search: string) => void;
  filterOptions?: boolean;
  loading?: boolean;
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  createItem?: (text: string) => AppComboboxItem | null;
  createLabel?: (item: AppComboboxItem) => React.ReactNode;
  delimiters?: string[];
  renderOption?: (item: AppComboboxItem) => React.ReactNode;
  placeholder?: string;
  addMorePlaceholder?: string;
  disabled?: boolean;
  maxItems?: number;
  chipColor?: ChipProps["color"];
  collapse?: boolean;
  className?: string;
  contentClassName?: string;
  iconClassName?: string;
  "aria-label"?: string;
};

// Width (px) kept free for the input when chips are collapsed onto one line.
const INPUT_RESERVE = 96;

function getInitials(label?: string) {
  if (!label) return "?";
  const parts = label.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function ItemLeading({
  item,
  className,
  fallbackClassName,
}: {
  item: AppComboboxItem;
  className?: string;
  fallbackClassName?: string;
}) {
  if (item.icon) return <>{item.icon}</>;
  return (
    <Avatar className={className}>
      {item.image ? <AvatarImage src={item.image} alt="" /> : null}
      <AvatarFallback
        className={cn("bg-highlight-purple-50 text-[10px]", fallbackClassName)}
      >
        {getInitials(item.label ?? item.value)}
      </AvatarFallback>
    </Avatar>
  );
}

function OptionIcon({
  item,
  className,
}: {
  item: AppComboboxItem;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-level-02 text-icon-default [&_svg:not([class*='size-'])]:size-3.5",
        className,
        item.iconClassName,
      )}
    >
      {item.icon}
    </span>
  );
}

function DefaultOption({
  item,
  iconClassName,
}: {
  item: AppComboboxItem;
  iconClassName?: string;
}) {
  return (
    <>
      {item.icon ? (
        <OptionIcon item={item} className={iconClassName} />
      ) : (
        <ItemLeading
          item={item}
          className="size-7"
          fallbackClassName={cn(iconClassName, item.iconClassName)}
        />
      )}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm text-body">
          {item.label ?? item.value}
        </span>
        {item.description ? (
          <span className="truncate text-xs text-subtext-03">
            {item.description}
          </span>
        ) : null}
      </div>
    </>
  );
}

export function AppCombobox({
  value,
  onValueChange,
  options,
  searchValue,
  onSearchChange,
  filterOptions = true,
  loading = false,
  loadingMessage = "Searching..",
  emptyMessage = "No results found.",
  createItem,
  createLabel = (item) => (
    <>
      Add <span className="font-medium">{item.value}</span>
    </>
  ),
  delimiters = [",", ";"],
  renderOption,
  placeholder = "Search..",
  addMorePlaceholder = "Add more..",
  disabled = false,
  maxItems,
  chipColor = "grey",
  collapse = true,
  className,
  contentClassName,
  iconClassName,
  "aria-label": ariaLabel = "Search",
}: AppComboboxProps) {
  const [internalSearch, setInternalSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = React.useId();
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [fitCount, setFitCount] = React.useState(value.length);

  const text = searchValue ?? internalSearch;
  const query = text.trim().toLowerCase();
  const isFull = maxItems !== undefined && value.length >= maxItems;

  const setText = (next: string) => {
    if (searchValue === undefined) setInternalSearch(next);
    onSearchChange?.(next);
  };

  const selectedValues = React.useMemo(
    () => new Set(value.map((item) => item.value.toLowerCase())),
    [value],
  );

  const visibleOptions = React.useMemo(() => {
    const available = options.filter(
      (option) => !selectedValues.has(option.value.toLowerCase()),
    );
    const matches =
      filterOptions && query
        ? available.filter((option) =>
            [option.label, option.value, option.description].some((field) =>
              field?.toLowerCase().includes(query),
            ),
          )
        : available;

    // Offer the typed text as a new item when nothing matches it exactly.
    const created = createItem && query ? createItem(text.trim()) : null;
    const exists =
      created &&
      (selectedValues.has(created.value.toLowerCase()) ||
        matches.some(
          (option) =>
            option.value.toLowerCase() === created.value.toLowerCase(),
        ));
    return created && !exists
      ? [...matches, { ...created, __created: true as const }]
      : matches;
  }, [options, selectedValues, filterOptions, query, createItem, text]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [text, options]);

  const showMenu =
    open && !isFull && (visibleOptions.length > 0 || query !== "" || loading);

  const addItems = (items: AppComboboxItem[]) => {
    const seen = new Set(selectedValues);
    const next = [...value];
    for (const item of items) {
      const key = item.value.toLowerCase();
      if (seen.has(key)) continue;
      if (maxItems !== undefined && next.length >= maxItems) break;
      seen.add(key);
      next.push(item);
    }
    if (next.length !== value.length) onValueChange(next);
  };

  const removeItem = (itemValue: string) => {
    onValueChange(value.filter((item) => item.value !== itemValue));
  };

  const selectOption = (option: AppComboboxItem & { __created?: true }) => {
    const { __created, ...item } = option;
    addItems([item]);
    setText("");
    inputRef.current?.focus();
  };

  // Splits text on delimiters and commits every part `createItem` accepts.
  // Rejected parts stay in the input so they can be fixed. `commitLast`
  // also commits the trailing part, which may still be mid-typing.
  const commitText = (raw: string, commitLast: boolean) => {
    if (!createItem) return raw;
    const pattern = new RegExp(
      `[${delimiters.map((d) => d.replace(/[\]\\^-]/g, "\\$&")).join("")}\\n]`,
    );
    const parts = raw.split(pattern);
    const trailing = commitLast ? "" : (parts.pop() ?? "");
    const created: AppComboboxItem[] = [];
    const rejected: string[] = [];
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const item = createItem(trimmed);
      if (item) created.push(item);
      else rejected.push(trimmed);
    }
    addItems(created);
    return [...rejected, trailing].filter(Boolean).join(", ");
  };

  const handleChange = (next: string) => {
    setOpen(true);
    const hasDelimiter = delimiters.some((d) => next.includes(d));
    setText(hasDelimiter ? commitText(next, false) : next);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!createItem) return;
    const pasted = event.clipboardData.getData("text");
    const combined = text + pasted;
    if (!/[\n]/.test(pasted) && !delimiters.some((d) => pasted.includes(d)))
      return;
    event.preventDefault();
    setText(commitText(combined, true));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setOpen(true);
        setActiveIndex((index) =>
          visibleOptions.length ? (index + 1) % visibleOptions.length : 0,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) =>
          visibleOptions.length
            ? (index - 1 + visibleOptions.length) % visibleOptions.length
            : 0,
        );
        break;
      case "Enter": {
        const option = showMenu ? visibleOptions[activeIndex] : undefined;
        if (option) {
          event.preventDefault();
          selectOption(option);
        } else if (query) {
          event.preventDefault();
          setText(commitText(text, true));
        }
        break;
      }
      case "Tab":
        if (query && createItem?.(text.trim())) {
          event.preventDefault();
          setText(commitText(text, true));
        }
        break;
      case "Backspace":
        if (!text && value.length) removeItem(value[value.length - 1].value);
        break;
      case "Escape":
        if (showMenu) {
          event.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  // Collapsed, chips stay on one line. Measure every chip in a hidden row
  // and show as many as fit next to the "+N more" toggle and the input.
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const update = () => {
      const style = getComputedStyle(container);
      const gap = parseFloat(style.columnGap) || 0;
      const available =
        container.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        INPUT_RESERVE -
        gap;
      const nodes = Array.from(measure.children) as HTMLElement[];
      const moreWidth = nodes.pop()?.offsetWidth ?? 0;
      const widths = nodes.map((node) => node.offsetWidth + gap);
      const total = widths.reduce((sum, width) => sum + width, 0);
      if (total <= available) {
        setFitCount(widths.length);
        return;
      }
      let used = moreWidth;
      let count = 0;
      while (count < widths.length && used + widths[count] <= available) {
        used += widths[count];
        count += 1;
      }
      setFitCount(count);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [value, collapse]);

  const hiddenCount = collapse ? Math.max(value.length - fitCount, 0) : 0;
  const collapsed = !expanded && hiddenCount > 0;
  const visibleChips = collapsed ? value.slice(0, fitCount) : value;

  React.useEffect(() => {
    if (hiddenCount === 0) setExpanded(false);
  }, [hiddenCount]);

  const renderChip = (item: AppComboboxItem) => (
    <Chip
      key={item.value}
      size="lg"
      color={chipColor}
      leading={<ItemLeading fallbackClassName="" item={item} className="size-6" />}
      onDismiss={() => removeItem(item.value)}
      dismissLabel={`Remove ${item.label ?? item.value}`}
      disabled={disabled}
      title={item.description ?? item.value}
    >
      <span className="max-w-40 truncate">{item.label ?? item.value}</span>
    </Chip>
  );

  const renderToggle = (count: number, isExpanded: boolean) => (
    <Chip
      size="lg"
      color={chipColor}
      outlined
      aria-expanded={isExpanded}
      onClick={(event) => {
        event.stopPropagation();
        setExpanded(!isExpanded);
      }}
    >
      {isExpanded ? "See less" : `…+${count} more`}
    </Chip>
  );

  const activeOptionId =
    showMenu && visibleOptions[activeIndex]
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  return (
    <PopoverPrimitive.Root
      open={showMenu}
      onOpenChange={(nextOpen, details) => {
        // Presses inside the field keep the menu open; the input has focus.
        if (
          !nextOpen &&
          details.event?.target instanceof Node &&
          containerRef.current?.contains(details.event.target)
        )
          return;
        setOpen(nextOpen);
      }}
    >
      <div
        ref={containerRef}
        data-slot="app-combobox"
        data-disabled={disabled || undefined}
        // Keep focus in the input when pressing chips or padding.
        onMouseDown={(event) => {
          if (event.target !== inputRef.current) event.preventDefault();
        }}
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "relative flex min-h-[2.815rem] w-full min-w-0 cursor-text items-center gap-1.5 overflow-hidden rounded-14 bg-base-01 px-3 py-1.5 transition-[color,box-shadow]",
          expanded || !collapse ? "flex-wrap" : "flex-nowrap",
          "focus-within:ring-[1px] focus-within:ring-highlight-grey-50",
          disabled && "pointer-events-none bg-base-disable opacity-60",
          className,
        )}
      >
        {collapse ? (
          <div
            ref={measureRef}
            aria-hidden
            inert
            className="pointer-events-none invisible absolute top-0 left-0 flex gap-1.5 whitespace-nowrap"
          >
            {value.map(renderChip)}
            {renderToggle(value.length, false)}
          </div>
        ) : null}
        {visibleChips.map(renderChip)}
        {collapsed ? renderToggle(hiddenCount, false) : null}
        {expanded ? renderToggle(hiddenCount, true) : null}
        <input
          ref={inputRef}
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            // Leaving the field turns finished text into a chip.
            if (query && createItem?.(text.trim())) {
              setText(commitText(text, true));
            }
          }}
          disabled={disabled || isFull}
          placeholder={value.length ? addMorePlaceholder : placeholder}
          aria-label={ariaLabel}
          role="combobox"
          aria-expanded={showMenu}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          className="h-7 min-w-24 flex-1 bg-transparent text-sm font-medium text-body outline-none placeholder:text-subtle disabled:cursor-not-allowed"
        />
      </div>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={containerRef}
          align="start"
          side="bottom"
          sideOffset={6}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="app-combobox-content"
            initialFocus={false}
            finalFocus={false}
            className={cn(
              "flex max-h-72 w-(--anchor-width) min-w-64 origin-(--transform-origin) flex-col overflow-y-auto rounded-10 bg-surface-base-01 p-1 text-subtext-01 shadow-4 ring-1 ring-border-01 outline-hidden duration-100",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              contentClassName,
            )}
          >
            {visibleOptions.length === 0 ? (
              <p className="p-2 text-xs text-subtext-01">
                {loading ? loadingMessage : emptyMessage}
              </p>
            ) : (
              <ul id={listboxId} role="listbox" className="flex flex-col">
                {visibleOptions.map((option, index) => (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    // Keep focus in the input so typing can continue.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-10 px-2 py-1.5",
                      index === activeIndex && "bg-surface-level-02",
                    )}
                  >
                    {"__created" in option ? (
                      <>
                        <OptionIcon item={option} className={iconClassName} />
                        <span className="truncate text-sm text-body">
                          {createLabel(option)}
                        </span>
                      </>
                    ) : renderOption ? (
                      renderOption(option)
                    ) : (
                      <DefaultOption
                        item={option}
                        iconClassName={iconClassName}
                      />
                    )}
                  </li>
                ))}
                {loading ? (
                  <li
                    role="presentation"
                    className="p-2 text-xs text-subtext-01"
                  >
                    {loadingMessage}
                  </li>
                ) : null}
              </ul>
            )}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

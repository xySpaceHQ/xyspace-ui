import React, { useState } from "react";
import { cn } from "@/lib/utils";
import X from "@/icons/X";
import SidebarSimple from "@/icons/SidebarSimple";
import { Button } from "../ui/button";

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  titleClassName?: string;
  header?: React.ReactNode;
  headerClassName?: string;
  actions?: React.ReactNode;
  contentClassName?: string;
  divider?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  closeIcon?: React.ReactNode;
  closeButtonProps?: Omit<React.ComponentProps<typeof Button>, "onClick">;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  collapseButtonProps?: Omit<React.ComponentProps<typeof Button>, "onClick">;
};

const SectionContainer = ({
  children,
  className,
  title,
  titleClassName,
  header,
  headerClassName,
  actions,
  contentClassName,
  divider = true,
  onClose,
  showCloseButton = true,
  closeIcon,
  closeButtonProps,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapseIcon,
  expandIcon,
  collapseButtonProps,
}: SectionContainerProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? internalCollapsed);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const hasHeaderContent = title || actions || showCloseButton || collapsible;
  const hasHeader = header ?? hasHeaderContent;

  if (isCollapsed) {
    return (
      <section
        className={cn(
          "inline-flex rounded-16 border border-border-01 bg-surface-base-00 p-2 shadow-md",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Expand"
          aria-expanded={false}
          {...collapseButtonProps}
          onClick={toggleCollapsed}
        >
          {expandIcon ?? <SidebarSimple className="h-4 w-4" />}
        </Button>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "w-full flex flex-col gap-4 rounded-16 border border-border-01 bg-surface-base-00 p-xl shadow-md",
        className,
      )}
    >
      {header ??
        (hasHeaderContent && (
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              headerClassName,
            )}
          >
            {title &&
              (typeof title === "string" ? (
                <h1
                  className={cn(
                    "text-2xl font-bold text-display-01",
                    titleClassName,
                  )}
                >
                  {title}
                </h1>
              ) : (
                title
              ))}
            {(actions || showCloseButton || collapsible) && (
              <div className="flex items-center gap-2">
                {actions}
                {collapsible && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Collapse"
                    aria-expanded={true}
                    {...collapseButtonProps}
                    onClick={toggleCollapsed}
                  >
                    {collapseIcon ?? <SidebarSimple className="h-4 w-4" />}
                  </Button>
                )}
                {showCloseButton && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close"
                    {...closeButtonProps}
                    onClick={onClose}
                  >
                    {closeIcon ?? <X className="size-5" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      {divider && hasHeader && (
        <div className="-mx-xl border-t border-dotted border-border-01" />
      )}
      <div className={cn(contentClassName)}>{children}</div>
    </section>
  );
};

export default SectionContainer;

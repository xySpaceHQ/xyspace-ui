import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { XIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sizeClassName: Record<NonNullable<AppDialogProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  full: "max-w-[calc(100%-2rem)] h-[calc(100%-2rem)]",
};

const positionClassName: Record<
  NonNullable<AppDialogProps["position"]>,
  string
> = {
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  top: "top-4 left-1/2 -translate-x-1/2",
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  left: "top-1/2 left-4 -translate-y-1/2",
  right: "top-1/2 right-4 -translate-y-1/2",
};

type AppDialogProps = {
  trigger?: React.ReactElement;
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  triggerVariant?: VariantProps<typeof buttonVariants>["variant"];
  triggerSize?: VariantProps<typeof buttonVariants>["size"];
  triggerDisabled?: boolean;
  triggerClassName?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean | "trap-focus";
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  finalFocusRef?: React.RefObject<HTMLElement | null>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom" | "left" | "right";
  divider?: boolean;
  showCloseButton?: boolean;
  scrollable?: boolean;
  showBgVector?: boolean;
  backgroundVector?: React.ReactNode;
  backgroundVectorClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  closeButtonClassName?: string;
};

export const AppDialog = ({
  trigger,
  triggerText,
  triggerIcon,
  triggerVariant = "default",
  triggerSize = "default",
  triggerDisabled = false,
  triggerClassName,
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
  initialFocusRef,
  finalFocusRef,
  title,
  description,
  headerActions,
  footer,
  children,
  size = "md",
  position = "center",
  divider = true,
  showCloseButton = true,
  scrollable = false,
  showBgVector = false,
  backgroundVector,
  backgroundVectorClassName,
  overlayClassName,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  closeButtonClassName,
}: AppDialogProps) => {
  const hasHeader = Boolean(title || headerActions || showCloseButton);

  return (
    <Dialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {trigger && (
        <DialogTrigger
          className={triggerClassName}
          render={
            trigger ?? (
              <Button
                variant={triggerVariant}
                size={triggerSize}
                disabled={triggerDisabled}
              >
                {triggerIcon}
                {triggerText}
              </Button>
            )
          }
        />
      )}

      <DialogPortal>
        <DialogOverlay className={overlayClassName} />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          initialFocus={initialFocusRef}
          finalFocus={finalFocusRef}
          className={cn(
            "fixed z-50 flex w-full flex-col gap-4 overflow-hidden rounded-16 border border-border-01 bg-surface-base-00 p-xl text-sm text-popover-foreground shadow-md duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            positionClassName[position],
            sizeClassName[size],
            scrollable && "overflow-y-auto",
            contentClassName,
          )}
        >
          {showBgVector && (
            <div
              className={cn(
                "pointer-events-none absolute inset-0 -left-20 -top-20 -z-10",
                backgroundVectorClassName,
              )}
            >
              {backgroundVector}
            </div>
          )}
          {hasHeader && (
            <DialogHeader className={headerClassName}>
              <div className="flex items-center justify-between gap-4">
                {title &&
                  (typeof title === "string" ? (
                    <DialogTitle className={titleClassName}>
                      {title}
                    </DialogTitle>
                  ) : (
                    title
                  ))}
                {(headerActions || showCloseButton) && (
                  <div className="flex items-center gap-2">
                    {headerActions}
                    {showCloseButton && (
                      <DialogClose
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className={cn(
                              "bg-surface-base-01 rounded-full text-icon-default hover:bg-surface-inverse hover:text-icon-white",
                              closeButtonClassName,
                            )}
                          >
                            <XIcon />
                            <span className="sr-only">Close</span>
                          </Button>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              {description && (
                <DialogDescription className={descriptionClassName}>
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
          {footer && (
            <DialogFooter className={footerClassName}>{footer}</DialogFooter>
          )}
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
};

import { cn } from "@/lib/utils";
import * as React from "react"


function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-subtle text-body font-medium flex field-sizing-content min-h-16 w-full min-w-0 rounded-14 bg-base-01 px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:text-btn-primary-disable disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-base-disable md:text-sm",
        "focus-visible:border-highlight-grey-50 focus-visible:ring-highlight-grey-50 focus-visible:ring-[1px]",
        "aria-invalid:ring-highlight-red-100 aria-invalid:text-highlight-red-100 aria-invalid:border-highlight-red-100",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

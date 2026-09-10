import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-body placeholder:text-subtle selection:bg-primary selection:text-display-base-01 text-body font-medium h-[2.815rem] w-full min-w-0 rounded-14 bg-base-01 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:text-btn-primary-disable disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-base-disable md:text-sm",
        "focus-visible:border-highlight-grey-50 focus-visible:ring-highlight-grey-50 focus-visible:ring-[1px]",
        "aria-invalid:ring-highlight-red-100 aria-invalid:text-highlight-red-100 aria-invalid:border-highlight-red-100",
        "autofill:shadow-[inset_0_0_0_1000px_var(--color-base-01)]",
        "autofill:[-webkit-text-fill-color:var(--color-body)]",
        "autofill:[caret-color:var(--color-body)]",
        "autofill:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

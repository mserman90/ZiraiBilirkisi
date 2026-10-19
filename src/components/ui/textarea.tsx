import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[220px] w-full rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 text-[15px] leading-[1.75] font-sans text-[hsl(var(--card-foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-colors duration-150 focus-visible:outline-none focus-visible:border-[#0F3D2E] focus-visible:ring-1 focus-visible:ring-[#0F3D2E] disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

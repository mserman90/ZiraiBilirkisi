import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[14px] font-sans text-[hsl(var(--card-foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-colors duration-150 focus-visible:outline-none focus-visible:border-[#0F3D2E] focus-visible:ring-1 focus-visible:ring-[#0F3D2E] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

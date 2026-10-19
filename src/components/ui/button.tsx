import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "amber";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-[#0F3D2E] text-[#FBF9F4] hover:bg-[#16533f] border border-transparent shadow-xs",
      secondary:
        "border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))] hover:border-[#B45309]",
      outline:
        "border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))]",
      ghost:
        "text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))]",
      destructive:
        "bg-[#DC2626] text-white hover:bg-red-700 border border-transparent shadow-xs",
      amber:
        "bg-[#B45309] text-[#FBF9F4] hover:bg-[#92400e] border border-amber-600/50 shadow-xs",
    };

    const sizeStyles = {
      default: "h-10 px-4 text-[14px]",
      sm: "h-8 px-3 text-[12.5px]",
      lg: "h-11 px-6 text-[15px]",
      icon: "w-10 h-10 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[8px] font-sans font-semibold transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

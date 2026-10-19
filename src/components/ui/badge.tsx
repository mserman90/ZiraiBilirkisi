import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ziraat" | "gida" | "hayvancilik" | "taslak" | "inceleniyor" | "tamamlandi" | "arsiv" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[hsl(var(--muted))] text-[hsl(var(--card-foreground))]",
    ziraat: "alan-badge-ziraat",
    gida: "alan-badge-gida",
    hayvancilik: "alan-badge-hayvancilik",
    taslak: "durum-badge-taslak",
    inceleniyor: "durum-badge-inceleniyor",
    tamamlandi: "durum-badge-tamamlandi",
    arsiv: "durum-badge-arsiv",
    destructive: "bg-red-500/12 text-[#DC2626] border border-red-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-[12px] font-sans font-semibold tracking-tight transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

import React from "react";
import { AlertTriangle, AlertCircle, BookOpen, Quote, Info } from "lucide-react";

export type KenarNotuTipi = "ogretici" | "hata_uyari" | "ornek_ifade" | "mevzuat" | "hata";

interface KenarNotuProps {
  baslik?: string;
  tip?: KenarNotuTipi;
  children: React.ReactNode;
  className?: string;
}

/**
 * Belirleyici Görsel Fikir: Kanun Maddesi Kenar Çizgisi
 * Solunda 3px kalınlığında amber (veya kritik hata durumunda kırmızı) dikey çizgi
 * bulunan resmî belge kenar notu kutusu.
 */
export default function KenarNotu({
  baslik,
  tip = "ogretici",
  children,
  className = "",
}: KenarNotuProps) {
  const isDestructive = tip === "hata";

  const getIcon = () => {
    switch (tip) {
      case "hata_uyari":
        return <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />;
      case "ornek_ifade":
        return <Quote className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />;
      case "mevzuat":
        return <BookOpen className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />;
      case "hata":
        return <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />;
      default:
        return <Info className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />;
    }
  };

  return (
    <div
      role={isDestructive ? "alert" : "note"}
      className={`border rounded-[4px] p-3 text-[14px] leading-[1.6] transition-colors duration-150 ${
        isDestructive
          ? "border-[hsl(var(--border))] border-l-[3px] border-l-[#DC2626] bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
          : "border-[hsl(var(--border))] border-l-[3px] border-l-[#B45309] bg-[hsl(var(--muted))] text-[hsl(var(--card-foreground))] dark:text-slate-200"
      } ${className}`}
    >
      {baslik && (
        <div className="flex items-center gap-2 mb-1.5 font-semibold text-[13px] tracking-wide">
          {getIcon()}
          <span className={isDestructive ? "text-[#DC2626]" : "text-[#B45309] dark:text-amber-400 font-serif"}>
            {baslik}
          </span>
        </div>
      )}
      <div className="text-[13.5px] leading-[1.65] font-sans">
        {children}
      </div>
    </div>
  );
}

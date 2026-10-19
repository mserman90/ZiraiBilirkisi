import React from "react";
import { Check } from "lucide-react";
import { YEDI_ADIM_TANIMLARI, AdimVerisi } from "../../data/fields";

interface AdimSeridiProps {
  aktifAdim: number;
  tamamlananAdimlar?: number[];
  onAdimSec: (adimNo: number) => void;
  className?: string;
  varyant?: "ustbar" | "sidebar" | "hero";
}

/**
 * 7 Adımlı Şerit (AdımŞeridi)
 * Ürünün "adım adım" sözünü daha ilk bakışta kanıtlar.
 * Monospace adım numarası, amber aktif alt çizgi, yeşil tamamlanma dairesi.
 */
export default function AdimSeridi({
  aktifAdim,
  tamamlananAdimlar = [],
  onAdimSec,
  className = "",
  varyant = "ustbar",
}: AdimSeridiProps) {
  return (
    <nav
      aria-label="Rapor Hazırlama Adımları"
      className={`w-full overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      <ol className="flex items-center gap-1 md:gap-2 min-w-max px-1">
        {YEDI_ADIM_TANIMLARI.map((adim) => {
          const isAktif = adim.no === aktifAdim;
          const isTamamlandi =
            tamamlananAdimlar.includes(adim.no) || adim.no < aktifAdim;

          return (
            <li key={adim.no} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => onAdimSec(adim.no)}
                aria-current={isAktif ? "step" : undefined}
                aria-label={`Adım ${adim.no}: ${adim.tamBaslik}`}
                className={`group flex items-center gap-2 py-2 px-3 text-left transition-colors duration-150 rounded-[4px] touch-min ${
                  isAktif
                    ? "border-b-2 border-[#B45309] bg-[hsl(var(--muted))]/60 text-[hsl(var(--card-foreground))] font-medium"
                    : "border-b-2 border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))]/30"
                }`}
              >
                {/* Durum Göstergesi: Yeşil Daire veya Monospace Numara */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-mono shrink-0 transition-colors ${
                    isTamamlandi
                      ? "bg-[#15803D] text-white"
                      : isAktif
                      ? "bg-[#B45309] text-white font-semibold"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                  }`}
                >
                  {isTamamlandi ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    adim.kod
                  )}
                </span>

                {/* Kısa Etiket */}
                <span className="text-[13px] tracking-tight whitespace-nowrap">
                  {adim.kisaBaslik}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

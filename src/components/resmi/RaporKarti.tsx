import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Calendar,
  Building2,
  FileText,
  Clock,
  ExternalLink,
  Edit3,
  Archive,
  Trash2,
} from "lucide-react";
import { BilirKisiRaporu, ALAN_TANIMLARI, DURUM_TANIMLARI } from "../../data/fields";

interface RaporKartiProps {
  rapor: BilirKisiRaporu;
  onAc: (rapor: BilirKisiRaporu) => void;
  onDuzenle: (rapor: BilirKisiRaporu) => void;
  onWordIndir?: (rapor: BilirKisiRaporu) => void;
  onArsivle?: (raporId: string) => void;
  onSil?: (raporId: string) => void;
}

/**
 * RaporKartı Bileşeni
 * - Başlık, alan badge'i (4px yarıçap, %12 opaklık), durum badge'i
 * - Dosya No (monospace), son güncelleme tarihi
 * - Üç nokta açılır menüsü (Aç / Düzenle / Arşivle / Sil)
 */
export default function RaporKarti({
  rapor,
  onAc,
  onDuzenle,
  onWordIndir,
  onArsivle,
  onSil,
}: RaporKartiProps) {
  const [menuAcik, setMenuAcik] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAcik(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alanInfo = ALAN_TANIMLARI[rapor.alan];
  const durumInfo = DURUM_TANIMLARI[rapor.durum];

  const getAlanBadgeClass = () => {
    switch (rapor.alan) {
      case "ziraat":
        return "alan-badge-ziraat";
      case "gida":
        return "alan-badge-gida";
      case "hayvancilik":
        return "alan-badge-hayvancilik";
    }
  };

  const getDurumBadgeClass = () => {
    switch (rapor.durum) {
      case "taslak":
        return "durum-badge-taslak";
      case "inceleniyor":
        return "durum-badge-inceleniyor";
      case "tamamlandi":
        return "durum-badge-tamamlandi";
      case "arsiv":
        return "durum-badge-arsiv";
    }
  };

  return (
    <article className="resmi-kart p-5 flex flex-col justify-between hover:border-[#0F3D2E]/40 transition-colors duration-150 relative group">
      {/* Üst Kısım: Rozetler ve Üç Nokta Menüsü */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Alan Badge'i */}
          <span className={getAlanBadgeClass()}>{alanInfo.ad}</span>

          {/* Durum Badge'i */}
          <span className={getDurumBadgeClass()}>{durumInfo.ad}</span>
        </div>

        {/* Üç Nokta Menüsü */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAcik(!menuAcik);
            }}
            aria-label="Rapor Eylemleri Menüsü"
            className="w-8 h-8 rounded-[4px] hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))] flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuAcik && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-44 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] shadow-md py-1 z-30 text-[13px] font-sans"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuAcik(false);
                  onAc(rapor);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[hsl(var(--muted))] cursor-pointer text-[hsl(var(--card-foreground))]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0F3D2E]" />
                <span>Raporu Aç</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuAcik(false);
                  onDuzenle(rapor);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[hsl(var(--muted))] cursor-pointer text-[hsl(var(--card-foreground))]"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Düzenle (Sihirbaz)</span>
              </button>

              {onWordIndir && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuAcik(false);
                    onWordIndir(rapor);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[hsl(var(--muted))] cursor-pointer text-[#0F3D2E] dark:text-emerald-400 font-medium"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Word İndir (.doc)</span>
                </button>
              )}

              {onArsivle && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuAcik(false);
                    onArsivle(rapor.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[hsl(var(--muted))] cursor-pointer text-[hsl(var(--muted-foreground))]"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Arşivle</span>
                </button>
              )}

              {onSil && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuAcik(false);
                    onSil(rapor.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/20 text-[#DC2626] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sil</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Orta Kısım: Başlık ve Özet */}
      <div className="space-y-2 mb-4 cursor-pointer" onClick={() => onAc(rapor)}>
        <h3 className="font-serif font-semibold text-[17px] sm:text-[18px] leading-[1.3] text-[hsl(var(--card-foreground))] m-0 group-hover:text-[#0F3D2E] dark:group-hover:text-emerald-400 transition-colors">
          {rapor.baslik}
        </h3>

        <p className="font-sans text-[13.5px] leading-[1.6] text-[hsl(var(--muted-foreground))] line-clamp-2">
          {rapor.ozet}
        </p>
      </div>

      {/* Alt Meta Veriler */}
      <div className="pt-3 border-t border-[hsl(var(--border))] space-y-2 text-[12px] font-sans">
        {/* Dosya No (Monospace) ve Mahkeme */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground))]">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[180px]">{rapor.mahkeme}</span>
          </div>

          <span className="font-mono text-[12px] font-semibold text-[#0F3D2E] dark:text-emerald-400 bg-[hsl(var(--muted))] px-2 py-0.5 rounded-[4px] shrink-0">
            {rapor.dosyaNo}
          </span>
        </div>

        {/* Son Güncelleme & İlerleme */}
        <div className="flex items-center justify-between gap-2 text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{rapor.sonGuncelleme}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden border border-[hsl(var(--border))]">
              <div
                className="h-full bg-[#15803D]"
                style={{ width: `${rapor.tamamlanmaYuzdesi}%` }}
              />
            </div>
            <span className="font-mono text-[11px] font-medium text-[hsl(var(--card-foreground))]">
              %{rapor.tamamlanmaYuzdesi}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

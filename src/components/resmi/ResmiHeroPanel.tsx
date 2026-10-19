import React from "react";
import { Plus, BookOpen, Check, ArrowRight } from "lucide-react";
import { YEDI_ADIM_TANIMLARI } from "../../data/fields";

interface ResmiHeroPanelProps {
  onYeniRaporBaslat: () => void;
  onKutuphaneAc: () => void;
  onAdimSec?: (adimNo: number) => void;
}

/**
 * Karşılama Ekranı (Hero Panel)
 * - Koyu yeşil dolgulu panel (#0F3D2E)
 * - Sol %55: Başlık, resmi rehberlik vaadi, 7 adımlı şerit ve CTA butonları
 * - Sağ %45: 16:9 oranında metin bindirmesiz saha incelemesi fotoğrafı
 * - Asimetrik 2 kolonlu resmi düzen (ortalanmış tek kolon yasaktır).
 */
export default function ResmiHeroPanel({
  onYeniRaporBaslat,
  onKutuphaneAc,
  onAdimSec,
}: ResmiHeroPanelProps) {
  return (
    <section className="resmi-hero-panel p-6 lg:p-8 mb-8 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sol Kolon (%55 - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          {/* Üst Küçük Rozet */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#FBF9F4] rounded-[4px] text-[12px] font-mono tracking-wide w-fit border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#B45309]"></span>
            <span>T.C. ADALET BAKANLIĞI & HMK 279 UYUMLU</span>
          </div>

          {/* Başlık: Fraunces Serif 600 */}
          <div className="space-y-2">
            <h1 className="font-serif font-semibold text-2xl sm:text-3xl lg:text-[34px] leading-[1.2] text-[#FBF9F4] m-0">
              Bilirkişi Rapor Yazma Çalışma Masası
            </h1>
            <p className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#FBF9F4]/85 max-w-2xl pt-1">
              İlk kez bilirkişi raporu tanzim edecek ziraat mühendisleri, gıda mühendisleri ve veteriner hekimler için adım adım öğretici kılavuz. Yargıtay bozma risklerini önleyen, bilimsel ve mevzuata tam uyumlu resmî evrak üretim ortamı.
            </p>
          </div>

          {/* Yedi Adımlı Şerit Önizlemesi */}
          <div className="pt-2">
            <div className="text-[12px] font-mono uppercase tracking-wider text-[#FBF9F4]/70 mb-2">
              7 ADIMDA RESMÎ RAPOR YAPISI:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 bg-black/20 p-2 rounded-[6px] border border-white/10">
              {YEDI_ADIM_TANIMLARI.map((adim) => (
                <button
                  key={adim.no}
                  type="button"
                  onClick={() => onAdimSec && onAdimSec(adim.no)}
                  className="flex flex-col p-1.5 rounded-[4px] hover:bg-white/10 text-left transition-colors duration-150 group cursor-pointer"
                  title={adim.tamBaslik}
                >
                  <span className="text-[11px] font-mono font-medium text-[#B45309] group-hover:text-amber-300">
                    {adim.kod}
                  </span>
                  <span className="text-[12px] font-sans text-[#FBF9F4]/90 truncate">
                    {adim.kisaBaslik}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Eylem Butonları */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onYeniRaporBaslat}
              className="h-10 px-5 bg-[#B45309] hover:bg-[#92400e] text-[#FBF9F4] font-sans font-semibold text-[14px] rounded-[8px] inline-flex items-center gap-2 cursor-pointer transition-colors duration-150 border border-amber-600/50 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              <span>Yeni Rapor Başlat</span>
            </button>

            <button
              type="button"
              onClick={onKutuphaneAc}
              className="h-10 px-5 bg-white/10 hover:bg-white/15 text-[#FBF9F4] font-sans font-semibold text-[14px] rounded-[8px] inline-flex items-center gap-2 cursor-pointer transition-colors duration-150 border border-white/15"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Kütüphane & Emsaller</span>
            </button>
          </div>
        </div>

        {/* Sağ Kolon (%45 - 5 cols) - Metin Bindirmesiz 16:9 Saha Fotoğrafı */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="w-full aspect-[16/9] rounded-[8px] overflow-hidden border border-white/15 shadow-sm bg-black/20 relative">
            <img
              src="/ZiraiBilirkisi/hero-saha-incelemesi.jpg"
              alt="Zirai bilirkişi tarla ve ürün saha incelemesi"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Alternatif yerel yol denemesi
                const target = e.currentTarget;
                if (!target.src.endsWith("/hero-saha-incelemesi.jpg")) {
                  target.src = "/hero-saha-incelemesi.jpg";
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import {
  BookOpen,
  X,
  FileCheck,
  Beef,
  Satellite,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Scale,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { TabId } from "../types";

interface HizliRehberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabId) => void;
}

export default function HizliRehberModal({
  isOpen,
  onClose,
  onSelectTab,
}: HizliRehberModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Dava Türü & 3'lü Kurul Heyeti",
      subtitle: "Gerekli bilirkişi künyesini ve faiz matrisini oluşturun",
      desc: "Kamulaştırma ve telefat davalarında tek bilirkişi raporu Yargıtay tarafından bozulabilmektedir. Sistemde Ziraat Müh. + Veteriner Hekim / Harita Müh. + Gayrimenkul Değerleme Uzmanından oluşan 3'lü kurul heyetini oluşturun. Varsa muhalefet şerhini ve faiz türünü belirleyin.",
      actionTab: "raporOtomasyonu" as TabId,
      actionText: "Tarım Raporunu Başlat",
      badge: "HMK m. 266 Uyumlu",
    },
    {
      num: 2,
      title: "TKGM Parsel & TÜİK Resmi Verileri",
      subtitle: "Koordinat ve resmi dekar maliyetlerini otomatik getirin",
      desc: "Keşif koordinatlarını (ITRF96/WGS84) TKGM'den çekin. Sentinel-2 L2A uydu görüntüleri üzerinden NDVI bitki örtüsü endeksini ve TÜİK resmi il/ilçe ürün maliyet cetvellerini yükleyerek emsalleri çapraz doğrulayın.",
      actionTab: "uyduParsel" as TabId,
      actionText: "Uydu Parsel AI'yi Aç",
      badge: "Sentinel-2 & TKGM",
    },
    {
      num: 3,
      title: "Pre-Flight 10 Nokta Yargıtay Denetimi",
      subtitle: "Raporu UYAP'a sunmadan önce bozma risklerini sıfırlayın",
      desc: "Yargıtay 3, 5 ve 11. Hukuk Dairesi bozma kriterlerini (TBK m.52/55 kurtarma eti mahsubu, münavebe net kâr tenzili, HMK m.279 kusur kelimesi yasağı) tek tıkla taratın. 100 üzerinden skorunuzu alın.",
      actionTab: "tarayici" as TabId,
      actionText: "HMK 279 Tarayıcıyı Aç",
      badge: "Bozma Riski Kontrolü",
    },
    {
      num: 4,
      title: "Resmi A4 & Word (.doc) / UYAP Çıktısı",
      subtitle: "Adliye formatında antetli heyet raporunu tek tıkla indirin",
      desc: "Hesap tabloları, açıklamalı keşif fotoğrafları albümü, kroki ve faiz tavsiye paragrafını içeren resmi A4 mahkeme raporunuzu doğrudan Word (.doc) veya PDF olarak indirin, UYAP sistemine yükleyin.",
      actionTab: "hayvancilikRaporOtomasyonu" as TabId,
      actionText: "Hayvancılık Raporunu Başlat",
      badge: "UYAP Uyumlu .doc",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-[#0f172a]/90 backdrop-blur-2xl text-white rounded-3xl border border-white/15 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/80 via-slate-900/80 to-indigo-950/80 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Platform Nasıl Kullanılır?</h2>
              <p className="text-xs text-emerald-400 font-medium">
                4 Adımda Yargıtay Denetimine Elverişli Bilirkişi Raporu Hazırlama Rehberi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Adım Seçici Çubuğu */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-black/20 backdrop-blur-lg text-xs">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3 sm:p-4 text-center font-bold transition border-b-2 cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeStep === s.num
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                  activeStep === s.num
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-white/10 text-slate-400"
                }`}
              >
                {s.num}
              </span>
              <span className="truncate hidden sm:inline">{s.title.split("&")[0]}</span>
            </button>
          ))}
        </div>

        {/* Seçili Adım Detay Alanı */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {(() => {
            const current = steps.find((s) => s.num === activeStep) || steps[0];
            return (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ADIM {current.num} / 4 • {current.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Bilirkişi İş Akışı</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{current.title}</h3>
                  <p className="text-sm font-semibold text-emerald-400">{current.subtitle}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm leading-relaxed">
                  {current.desc}
                </div>

                {/* Sıkça Sorulan Hukuki İpucu */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle size={15} />
                    <span>Yargıtay Bozma İpucu</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {current.num === 1 && "Hâkim raporda faiz başlangıç tarihini arar. Haksız fiil ve telefatlarda 'Olay Tarihi', kamulaştırmada 'Dava + 4 ay sonu', ticari süt tesliminde ise 'Temerrüt Tarihi' tavsiye edilmelidir."}
                    {current.num === 2 && "Yargıtay 5. HD, keşif tarihi ile resmi veri celp tarihi arasındaki tutarsızlıkları bozma sebebi sayar. Çapraz doğrulama ekranında her verinin resmi evrak sayısı ve tarihini işleyin."}
                    {current.num === 3 && "HMK m. 279 gereğince bilirkişi asla 'Davalı %100 kusurludur' veya 'sorumludur' diyemez. Yalnızca teknik sebep-sonuç (illiyet) bağı tespit edilmelidir."}
                    {current.num === 4 && "Kurtarma (hurda et ve deri) bedeli TBK m. 52/55 uyarınca brüt zarardan düşülmeden verilen kararlar Yargıtay 3. ve 11. Hukuk Dairelerince kesinlikle bozulmaktadır."}
                  </p>
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-2">
                    {activeStep > 1 && (
                      <button
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        ← Önceki Adım
                      </button>
                    )}
                    {activeStep < 4 && (
                      <button
                        onClick={() => setActiveStep((prev) => prev + 1)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                      >
                        Sonraki Adım →
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab(current.actionTab);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    <span>{current.actionText}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Alt Kısayol Menüsü */}
        <div className="p-4 bg-[#0b1222] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <span>İpucu: İstediğiniz an <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Ctrl + K</kbd> ile modül arayabilirsiniz.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold cursor-pointer text-xs"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

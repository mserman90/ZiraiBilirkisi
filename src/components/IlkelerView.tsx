import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  BookOpen,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  ChevronRight,
  HelpCircle,
  FileText,
  Calendar,
  Layers,
  Award,
  ClipboardCheck,
} from "lucide-react";
import { RESMI_ILKELER_STANDARTLAR } from "../data/mockData";
import { IlkeMadde } from "../types";
import KontrolListesiView from "./KontrolListesiView";

export default function IlkelerView({
  onSelectTab,
  showToast,
}: {
  onSelectTab: (tab: any) => void;
  showToast: (msg: string) => void;
}) {
  const [altSekme, setAltSekme] = useState<"ilkeler" | "kontrolListesi">("ilkeler");
  const [arama, setArama] = useState("");
  const [seciliIlke, setSeciliIlke] = useState<IlkeMadde>(RESMI_ILKELER_STANDARTLAR[0]);
  const [tamamlananlar, setTamamlananlar] = useState<Record<string, boolean>>({});

  const filtrelenmis = RESMI_ILKELER_STANDARTLAR.filter(
    (item) =>
      item.baslik.toLowerCase().includes(arama.toLowerCase()) ||
      item.ozet.toLowerCase().includes(arama.toLowerCase()) ||
      item.kaynak.toLowerCase().includes(arama.toLowerCase())
  );

  const toggleCheck = (key: string) => {
    setTamamlananlar((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const kopyalaMetin = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Metin panoya kopyalandı");
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* Üst Sekmeler */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm max-w-md">
        <button
          onClick={() => setAltSekme("ilkeler")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            altSekme === "ilkeler"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award size={15} /> Rehber İlkeler & Standartlar
        </button>
        <button
          onClick={() => setAltSekme("kontrolListesi")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            altSekme === "kontrolListesi"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ClipboardCheck size={15} /> Rapor Kontrol Listesi
        </button>
      </div>

      {altSekme === "kontrolListesi" ? (
        <KontrolListesiView
          showToast={showToast}
          onGoToWizard={() => onSelectTab("sihirbaz")}
        />
      ) : (
        <>
          {/* Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-emerald-500/30 shadow-xl">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 tracking-wider mb-3">
                <Award size={14} /> ADALET BAKANLIĞI BİLİRKİŞİLİK DAİRE BAŞKANLIĞI & TMMOB ZMO STANDARTLARI
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                Zirai Bilirkişilik İlkeleri, Standartları ve Yargıtay Esasları
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                6754 sayılı Bilirkişilik Kanunu, HMK m.266-287, İBBK içtihatları ve 351 sayfalık resmi Ziraat Bilirkişi Rehberi uyarınca rapor tanzim kuralları, hukuki aşım sınırları ve kontrol listeleri.
              </p>
            </div>
          </div>

          {/* Arama ve Liste Düzeni */}
          <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
            {/* Sol Liste */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={arama}
                  onChange={(e) => setArama(e.target.value)}
                  placeholder="İlke, standart veya kanun maddesi ara..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {filtrelenmis.map((item) => {
                  const aktif = seciliIlke.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSeciliIlke(item)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-2 ${
                        aktif
                          ? "bg-emerald-50/80 border-emerald-300 shadow-sm text-slate-900"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className={`text-xs font-bold leading-snug ${aktif ? "text-emerald-900" : "text-slate-800"}`}>
                          {item.baslik}
                        </p>
                        <p className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded w-fit">
                          {item.kaynak}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.ozet}
                        </p>
                      </div>
                      <ChevronRight size={16} className={`shrink-0 mt-1 ${aktif ? "text-emerald-600" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sağ Detay Paneli */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Başlık & Kaynak */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white tracking-wider">
                  {seciliIlke.kaynak}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {seciliIlke.baslik}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  {seciliIlke.ozet}
                </p>
              </div>

              {/* Hukuki Açıklama & İçtihat */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Scale size={14} className="text-emerald-600" /> Kanuni Dayanak ve Hukuki İzah
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {seciliIlke.detay}
                </p>
              </div>

              {/* İnteraktif Rapor Denetim Listesi (Checklist) */}
              <div className="bg-white border-2 border-emerald-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" /> Raporda Bu İlkeyi Kontrol Et (Denetim Listesi)
                  </h4>
                  <span className="text-[10px] text-slate-400">İşaretleyerek denetleyin</span>
                </div>
                <div className="space-y-2">
                  {seciliIlke.kontrolListesi.map((k, idx) => {
                    const key = `${seciliIlke.id}-${idx}`;
                    const checked = tamamlananlar[key] || false;
                    return (
                      <label
                        key={key}
                        onClick={() => toggleCheck(key)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                          checked
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium"
                            : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="flex-1">{k}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Hatalı Yazım vs Doğru Yazım */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                      <AlertTriangle size={14} /> Hatalı Yazım (Bozma Nedeni)
                    </span>
                    <span className="text-[10px] text-rose-600 font-mono">❌ Kaçının</span>
                  </div>
                  <p className="text-xs text-rose-950 bg-white/70 p-3 rounded-lg border border-rose-200 italic leading-relaxed">
                    {seciliIlke.ornekIhlal}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Doğru Yazım (Hükme Elverişli)
                    </span>
                    <button
                      onClick={() => kopyalaMetin(seciliIlke.dogruUygulama)}
                      className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Copy size={11} /> Kopyala
                    </button>
                  </div>
                  <p className="text-xs text-emerald-950 bg-white/70 p-3 rounded-lg border border-emerald-200 font-medium leading-relaxed">
                    {seciliIlke.dogruUygulama}
                  </p>
                </div>
              </div>

              {/* Hızlı Butonlar */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectTab("sihirbaz")}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition flex items-center gap-1.5"
                >
                  <FileText size={14} /> Rapor Sihirbazında Uygula
                </button>
                <button
                  onClick={() => onSelectTab("tarayici")}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <Scale size={14} /> HMK 279 Tarayıcıda Doğrula
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

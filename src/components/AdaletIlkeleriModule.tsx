import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Gavel,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
} from "lucide-react";
import {
  ADALET_BAKANLIGI_32_ILKE,
  AdaletRehberIlke,
} from "../data/ziraatRehberiData";

interface AdaletIlkeleriModuleProps {
  showToast: (msg: string) => void;
}

export default function AdaletIlkeleriModule({
  showToast,
}: AdaletIlkeleriModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "görev_yetki" | "kusur_hukuk_yasagi" | "bilimsel_metot" | "rapor_ve_celiski"
  >("all");
  const [expandedIlkeler, setExpandedIlkeler] = useState<Record<number, boolean>>({
    14: true,
    16: true,
    28: true,
    29: true,
    30: true,
  });

  const toggleExpand = (no: number) => {
    setExpandedIlkeler((prev) => ({ ...prev, [no]: !prev[no] }));
  };

  const filteredIlkeler = useMemo(() => {
    return ADALET_BAKANLIGI_32_ILKE.filter((ilke) => {
      const matchesCategory =
        selectedCategory === "all" || ilke.kategori === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ilke.baslik.toLowerCase().includes(q) ||
        ilke.ozetKural.toLowerCase().includes(q) ||
        ilke.tamMetin.toLowerCase().includes(q) ||
        ilke.pratikUygulamaNotu.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyIlke = (ilke: AdaletRehberIlke) => {
    const text = `T.C. ADALET BAKANLIĞI BİLİRKİŞİLİK REHBER İLKE NO ${ilke.no}: ${ilke.baslik}\n\nKURAL: ${ilke.ozetKural}\n\nMETİN: ${ilke.tamMetin}\n\nUYGULAMA NOTU: ${ilke.pratikUygulamaNotu}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 İlke No ${ilke.no} kopyalandı`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <ShieldCheck size={220} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
              <Scale size={14} className="text-indigo-400" />
              T.C. ADALET BAKANLIĞI BİLİRKİŞİLİK DAİRE BAŞKANLIĞI
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-200 border border-rose-400/30">
              DANIŞTAY İDDK 2026/22 KUSUR YASAĞI
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              32 REHBER İLKE VE RAPOR STANDARDI
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bilirkişilerin Uyacağı Rehber İlkeler ve Rapor Standartları
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            Hukuki değerlendirme ve kusur dağıtımı yasağından bizzat ölçüm yapma zorunluluğuna,
            çelişkili raporların giderilmesinden ek rapor tanzim kurallarına kadar Türk yargısında
            bilirkişilerin uyması zorunlu tüm resmi standartlar.
          </p>
        </div>
      </div>

      {/* Danıştay İDDK 2026/22 Özel Kusur Yasağı Bildirisi */}
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl p-5 border-2 border-rose-500/60 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-extrabold text-sm">
          <AlertTriangle size={18} className="text-rose-600 animate-pulse" />
          <span>KRİTİK HUKUKİ İLKE (NO 28): KUSUR TESPİTİ VE DAĞITIMI KESİN YASAĞI</span>
        </div>
        <p className="text-rose-900/90 dark:text-rose-200/90 text-xs sm:text-[13px] leading-relaxed">
          "Kusurun tespiti normatif bir değerlendirmeyle mümkündür ve sadece hâkimin yetkisindedir.
          Bilirkişi münhasıran hâkimin yetkisinde olan kusurluluk konusunda (asli/tali kusurlu,
          kusursuz, yüzdelik kusur oranı) herhangi bir değerlendirme yapamaz. Aksi yöndeki tutum
          bilirkişilik görevinin sınırlarını aşmayı ve hâkimin yerine geçmeyi ifade eder."
          <span className="block mt-1 font-bold text-rose-700 dark:text-rose-300">
            — Danıştay İdari Dava Daireleri Kurulu 07/01/2026 T., E:2025/2154, K:2026/22
          </span>
        </p>
      </div>

      {/* Arama ve Filtreleme Kontrolleri */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İlke ara... (Örn: kusur, ek rapor, çelişki, bizzat ölçüm, UYAP)"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Tümü (32)" },
              { id: "kusur_hukuk_yasagi", label: "Kusur & Hukuk Yasağı" },
              { id: "görev_yetki", label: "Görev & Yetki" },
              { id: "bilimsel_metot", label: "Bilimsel Metot & Ölçüm" },
              { id: "rapor_ve_celiski", label: "Rapor & Çelişki & Ek Rapor" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-xs"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* İlkeler Listesi */}
      <div className="space-y-3">
        {filteredIlkeler.map((ilke) => (
          <div
            key={ilke.no}
            className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition overflow-hidden ${
              ilke.no === 28
                ? "border-rose-400/80 dark:border-rose-700/80"
                : ilke.no === 14 || ilke.no === 30
                ? "border-amber-400/80 dark:border-amber-700/80"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            {/* Başlık Başlatıcı */}
            <div
              onClick={() => toggleExpand(ilke.no)}
              className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    ilke.no === 28
                      ? "bg-rose-600 text-white"
                      : ilke.no === 14 || ilke.no === 30
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {ilke.no}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                      {ilke.baslik}
                    </h4>
                    {ilke.no === 28 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300">
                        KESİN YASAK
                      </span>
                    )}
                    {(ilke.no === 14 || ilke.no === 30) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300">
                        ZORUNLU STANDART
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {ilke.ozetKural}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyIlke(ilke);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                  title="İlkeyi Kopyala"
                >
                  <Copy size={13} />
                </button>
                {expandedIlkeler[ilke.no] ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Genişletilmiş Gövde */}
            {expandedIlkeler[ilke.no] && (
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs leading-relaxed">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                    Resmi İlke Metni (Adalet Bakanlığı)
                  </span>
                  <p className="text-slate-700 dark:text-slate-200">{ilke.tamMetin}</p>
                </div>

                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                    Zirai Bilirkişi İçin Pratik Uygulama Rehberi
                  </span>
                  <p className="text-emerald-950 dark:text-emerald-200">{ilke.pratikUygulamaNotu}</p>
                </div>

                {ilke.onemliUyari && (
                  <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 font-semibold">
                    ⚠️ {ilke.onemliUyari}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

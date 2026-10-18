import React, { useState, useMemo } from "react";
import {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  Search,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Printer,
  Sparkles,
  Layers,
  Gavel,
  FileCheck,
  Info,
  Check,
  X,
  Sprout,
  Beef,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ORNEK_RAPORLAR_DB, HESAPLAMA_PRENSIPLERI_REHBERI } from "../data/ornekRaporlarData";
import { OrnekRapor, TabId } from "../types";

interface OrnekRaporlarViewProps {
  showToast: (msg: string) => void;
  categoryLock: "tarim" | "hayvancilik";
  onSwitchCategory?: (tabId: TabId) => void;
  onTransferToWizard?: (data: { netGelir: number; araziTipi: "sulu" | "kuru"; urunAdi: string }) => void;
}

export default function OrnekRaporlarView({
  showToast,
  categoryLock = "tarim",
  onSwitchCategory,
  onTransferToWizard,
}: OrnekRaporlarViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"raporlar" | "prensipler">("raporlar");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAltKategori, setSelectedAltKategori] = useState<string>("Tümü");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPrensipKey, setExpandedPrensipKey] = useState<string | null>(
    categoryLock === "tarim" ? "kamulastirma_gelir_kapitalizasyonu" : "hayvan_telefi_mahsup"
  );

  const isTarim = categoryLock === "tarim";

  // Alt kategorilerin dostane Türkçe isimleri
  const formatAltKategori = (kat: string) => {
    const map: Record<string, string> = {
      kamulastirma: "Kamulaştırma (2942 s.K.)",
      irtifak: "İrtifak & Pilon DDO",
      ecrimisil: "Ecrimisil (TÜİK ÜFE)",
      agac_bahce: "Meyvelik & Ağaç",
      mahsul_hasari: "Mahsul Zararı & Taşkın",
      ilac_drift: "Pestisit & İlaç Drifti",
      kadastro_zilyetlik: "Kadastro & Zilyetlik (3402)",
      tarsim_itiraz: "TARSİM & Don / Dolu",
      kuruyan_agac: "Kuruyan Ağaç / Taban Suyu",
      ek_rapor: "Kademeli Ek Rapor (HMK 281)",
      mera_ve_muhdesat: "Mera Tecavüzü & Muhdesat",
      cevre_zarari: "Sanayi & Çevre Tahribatı",
      urun_hasari: "Hatalı Gübre & Ürün Zararı",
      gecit_hakki: "Zorunlu Geçit Hakkı (TMK 747)",
      hayvan_telefi: "Büyükbaş / Küçükbaş Telefat",
      elektrik_carpmasi: "Elektrik Çarpması & Yangın",
      yem_aflatoksin: "Yem Aflatoksin & Toksisite",
      kumes_asfiksi: "Kanatlı Kümes Asfiksi",
      rasyon_asidoz: "Hatalı Rasyon & Asidoz",
      mera_itlaf: "Sürü Otlatma İtlafı",
      sut_kalite_ayip: "Çiğ Süt Mandıra Ayıbı",
    };
    return map[kat] || kat.replace(/_/g, " ").toUpperCase();
  };

  // Kategoriye ve arama kriterlerine göre filtrelenmiş raporlar
  const filteredReports = useMemo(() => {
    return ORNEK_RAPORLAR_DB.filter((r) => {
      // 1. Kesin kategori kilidi: Tarım kısmında yalnızca tarım, Hayvancılık kısmında yalnızca hayvancılık!
      if (r.kategori !== categoryLock) return false;

      // 2. Alt kategori filtresi
      if (selectedAltKategori !== "Tümü" && r.altKategori !== selectedAltKategori) return false;

      // 3. Arama sorgusu
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.baslik.toLowerCase().includes(q);
        const matchesCourt = r.mahkeme.toLowerCase().includes(q);
        const matchesCase = r.dosyaNo.toLowerCase().includes(q);
        const matchesSummary = r.ozet.toLowerCase().includes(q);
        const matchesLaw = r.etiket.toLowerCase().includes(q);
        return matchesTitle || matchesCourt || matchesCase || matchesSummary || matchesLaw;
      }

      return true;
    });
  }, [categoryLock, selectedAltKategori, searchQuery]);

  // Seçili aktif rapor
  const activeReport = useMemo(() => {
    if (selectedReportId) {
      const found = filteredReports.find((r) => r.id === selectedReportId);
      if (found) return found;
    }
    return filteredReports.length > 0 ? filteredReports[0] : null;
  }, [selectedReportId, filteredReports]);

  // Yalnızca bu kategoriye ait alt kategoriler
  const altKategoriler = useMemo(() => {
    const list = ORNEK_RAPORLAR_DB
      .filter((r) => r.kategori === categoryLock)
      .map((r) => r.altKategori);
    return ["Tümü", ...Array.from(new Set(list))];
  }, [categoryLock]);

  // Yalnızca bu kategoriye ait hesaplama prensipleri
  const filteredPrinciples = useMemo(() => {
    return Object.entries(HESAPLAMA_PRENSIPLERI_REHBERI).filter(([_, p]) => {
      return p.kategori === categoryLock;
    });
  }, [categoryLock]);

  // Panoya Kopyalama Fonksiyonu
  const handleCopyReport = (report: OrnekRapor) => {
    const text = `
================================================================================
BİLİRKİŞİ RAPORU (ÖRNEK RESMİ METİN)
================================================================================
MAHKEME       : ${report.mahkeme}
DOSYA NO      : ${report.dosyaNo}
DAVA TÜRÜ     : ${report.davaTuru}
KEŞİF TARİHİ  : ${report.kesifTarihi}
KONU          : ${report.baslik}
YASAL DAYANAK : ${report.etiket}

--------------------------------------------------------------------------------
1. DAVA KONUSU VE UYUŞMAZLIK
--------------------------------------------------------------------------------
${report.ozet}

• Davacı İddiası : ${report.iddiaVeSavunma.davaciIstem}
• Davalı Savunması: ${report.iddiaVeSavunma.davaliSavunma}
• Uyuşmazlık Özü  : ${report.iddiaVeSavunma.uyusmazlikNoktasi}

--------------------------------------------------------------------------------
2. UYGULANAN HESAPLAMA METODOLOJİSİ VE HUKUKİ PRENSİPLER
--------------------------------------------------------------------------------
Dayanak Mevzuat: ${report.hesaplamaPrensibi.kanunVeIctihat}
Metodoloji     : ${report.hesaplamaPrensibi.aciklama}
Matematik Formül:
${report.hesaplamaPrensibi.formulMetni}

--------------------------------------------------------------------------------
3. TEKNİK VERİLER VE TESPİTLER
--------------------------------------------------------------------------------
${report.teknikVeriler.map((d) => `• ${d.etiket}: ${d.deger} ${d.birim ? `(${d.birim})` : ""} ${d.aciklama ? `— [${d.aciklama}]` : ""}`).join("\n")}

--------------------------------------------------------------------------------
4. MATEMATİKSEL HESAPLAMA ADIMLARI
--------------------------------------------------------------------------------
${report.hesaplamaAdimlari.map((a) => `[Adım ${a.adimNo}] ${a.adimAdi}\n  İşlem : ${a.islem}\n  Sonuç : ${a.sonuc}\n  Gerekçe: ${a.aciklama}`).join("\n\n")}

--------------------------------------------------------------------------------
5. HMK 279 UYUMLU SONUÇ VE KANAAT
--------------------------------------------------------------------------------
${report.sonucVeKanaatMetni}

HÜKMEDİLEN NET MADDİ ZARAR / TAZMİNAT TUTARI: ₺${report.toplamTazminatTL.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}

BİLİRKİŞİ HEYETİ:
${report.bilirkisiHeyeti.join("\n")}
================================================================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(report.id);
    showToast(`📋 ${report.dosyaNo} sayılı bilirkişi raporu panoya kopyalandı.`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. ÜST BAŞLIK VE SEKME SEÇİCİ */}
      {/* ===================================================================== */}
      <div
        className={`p-6 sm:p-8 rounded-3xl shadow-xl border relative overflow-hidden text-white transition-colors duration-200 ${
          isTarim
            ? "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-emerald-500/30"
            : "bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 border-amber-500/30"
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isTarim ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-inner border ${
                  isTarim
                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                    : "bg-amber-500/20 border-amber-400/40 text-amber-300"
                }`}
              >
                {isTarim ? <Sprout size={28} /> : <Beef size={28} />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isTarim
                        ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/40"
                        : "bg-amber-500/30 text-amber-200 border-amber-400/40"
                    }`}
                  >
                    {isTarim ? "01 TARIM & ZİRAAT BİLİRKİŞİLİĞİ" : "02 HAYVANCILIK & YEMLER"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                    {isTarim ? "YARGITAY 5. & 3. HD İÇTİHATLI" : "YARGITAY 3. & 11. HD UYUMLU"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    GERÇEK DAVA ESASLI
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  {isTarim
                    ? "01 Tarım Örnek Bilirkişi Raporları Kütüphanesi"
                    : "02 Hayvancılık & Yem Örnek Bilirkişi Raporları Kütüphanesi"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
                  {isTarim
                    ? "Tarla kamulaştırması (2942 s.K. m.11), irtifak hakkı DDO, kademeli ecrimisil (Tarım-ÜFE), kapama zeytinlik/meyvelik, kanal taşkını mahsul zararı ve kadastro zilyetlik davalarında onaylanmış 17 resmi rapor."
                    : "Damızlık süt sığırı ve besi danası telefatı, TBK m.52/55 hurda et mahsubu, aflatoksinli yem zararları, broiler kümes asfiksi ve mandıra çiğ süt kalite ayıplarında onaylanmış 8 resmi rapor."}
                </p>
              </div>
            </div>

            {/* Kategori İçi Alt Sekmeler & Diğer Kategoriye Geçiş */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveSubTab("raporlar")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    activeSubTab === "raporlar"
                      ? isTarim
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-amber-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FileText size={15} />
                  <span>
                    {isTarim ? `Tarım Raporları (${filteredReports.length})` : `Hayvancılık Raporları (${filteredReports.length})`}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubTab("prensipler")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    activeSubTab === "prensipler"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Scale size={15} />
                  <span>Hesaplama İlkeleri ({filteredPrinciples.length})</span>
                </button>
              </div>

              {/* Diğer Kategoriye Doğrudan Geçiş Butonu */}
              {onSwitchCategory && (
                <button
                  onClick={() => onSwitchCategory(isTarim ? "hayvancilikRaporlar" : "tarimRaporlar")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition cursor-pointer"
                  title={isTarim ? "02 Hayvancılık Örnek Raporları'na Geç" : "01 Tarım Örnek Raporları'na Geç"}
                >
                  {isTarim ? <Beef size={14} className="text-amber-400" /> : <Sprout size={14} className="text-emerald-400" />}
                  <span>{isTarim ? "02 Hayvancılık Raporları" : "01 Tarım Raporları"}</span>
                  <ArrowRight size={13} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. RAPORLAR GÖRÜNÜMÜ */}
      {/* ===================================================================== */}
      {activeSubTab === "raporlar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SOL PANEL: RAPOR LİSTESİ VE ARAMA FİLTRELERİ (5 KOLON) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              {/* Arama Kutusu */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    isTarim
                      ? "Kamulaştırma, ecrimisil, irtifak, mahsul veya esas no..."
                      : "Telef, elektrik, yem, broiler, mandıra veya esas no..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Alt Kategori Filtresi */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Konu Filtresi:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {altKategoriler.map((kat) => (
                    <button
                      key={kat}
                      onClick={() => setSelectedAltKategori(kat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                        selectedAltKategori === kat
                          ? isTarim
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                            : "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                      }`}
                    >
                      {kat === "Tümü" ? "Tümü" : formatAltKategori(kat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>
                  Listelenen: <b className="text-slate-800 dark:text-slate-200">{filteredReports.length}</b> Örnek Rapor
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Tıklayarak inceleyin
                </span>
              </div>
            </div>

            {/* RAPOR KARTLARI LİSTESİ */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                  <Info size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-semibold">Arama kriterlerine uygun rapor bulunamadı.</p>
                  <p className="text-xs text-slate-400 mt-1">Filtreleri temizleyip tekrar deneyiniz.</p>
                </div>
              ) : (
                filteredReports.map((report) => {
                  const isSelected = activeReport?.id === report.id;
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition relative overflow-hidden ${
                        isSelected
                          ? isTarim
                            ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                            : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 shadow-md ring-2 ring-amber-500/20"
                          : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isTarim
                              ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200"
                              : "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200"
                          }`}
                        >
                          {report.etiket}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                          {report.dosyaNo}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {report.baslik}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {report.ozet}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <span className="truncate max-w-[200px]">{report.mahkeme}</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {report.toplamTazminatTL > 0
                            ? `₺${report.toplamTazminatTL.toLocaleString("tr-TR")}`
                            : "Tespit Hükmü"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SAĞ PANEL: SEÇİLİ RAPOR DETAYI VE RESMİ DÖKÜM (7 KOLON) */}
          <div className="lg:col-span-7">
            {activeReport ? (
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                {/* Rapor Başlık Şeridi */}
                <div
                  className={`p-6 text-white ${
                    isTarim
                      ? "bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900"
                      : "bg-gradient-to-r from-amber-800 via-orange-950 to-slate-900"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                      {activeReport.etiket}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      Keşif: {activeReport.kesifTarihi}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mt-2 text-white leading-tight">
                    {activeReport.baslik}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1">
                    {activeReport.mahkeme} • Esas No: <b className="text-white">{activeReport.dosyaNo}</b>
                  </p>

                  {/* Buton Çubuğu */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleCopyReport(activeReport)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition shadow-xs cursor-pointer"
                    >
                      {copiedId === activeReport.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedId === activeReport.id ? "Kopyalandı!" : "Rapor Metnini Kopyala"}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition border border-white/20 cursor-pointer"
                    >
                      <Printer size={14} />
                      <span>Yazdır / PDF</span>
                    </button>

                    {isTarim && onTransferToWizard && (
                      <button
                        onClick={() => {
                          onTransferToWizard({
                            netGelir: 5037,
                            araziTipi: activeReport.baslik.toLowerCase().includes("sulu") ? "sulu" : "kuru",
                            urunAdi: activeReport.baslik,
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition ml-auto shadow-xs cursor-pointer"
                      >
                        <Sparkles size={14} />
                        <span>Sihirbaza Aktar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Rapor Gövdesi */}
                <div className="p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300">
                  {/* 1. Dava Konusu ve İddia/Savunma */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={15} className={isTarim ? "text-emerald-600" : "text-amber-600"} />
                      1. Dava Konusu ve Tarafların İddia/Savunması
                    </h4>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        <b>Özet:</b> {activeReport.ozet}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">Davacı Talebi:</span>
                          <span className="text-slate-600 dark:text-slate-400">{activeReport.iddiaVeSavunma.davaciIstem}</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-rose-900 dark:text-rose-300 block mb-1">Davalı Savunması:</span>
                          <span className="text-slate-600 dark:text-slate-400">{activeReport.iddiaVeSavunma.davaliSavunma}</span>
                        </div>
                      </div>
                      <div className="p-2 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-medium">
                        <b>Uyuşmazlığın Teknik Özü:</b> {activeReport.iddiaVeSavunma.uyusmazlikNoktasi}
                      </div>
                    </div>
                  </div>

                  {/* 2. Uygulanan Hesaplama Metodolojisi ve Formülü */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Scale size={15} className={isTarim ? "text-emerald-600" : "text-amber-600"} />
                      2. Uygulanan Hesaplama Prensibi & Yargıtay Metodolojisi
                    </h4>

                    <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block">
                          {activeReport.hesaplamaPrensibi.baslik}
                        </span>
                        <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                          Yasal Dayanak: {activeReport.hesaplamaPrensibi.kanunVeIctihat}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {activeReport.hesaplamaPrensibi.aciklama}
                      </p>

                      {/* Matematiksel Formül Kutusu */}
                      <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl shadow-inner border border-slate-800 leading-relaxed whitespace-pre-line">
                        {activeReport.hesaplamaPrensibi.formulMetni}
                      </div>

                      {/* Yargıtay Kriterleri */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                          Yargıtay Hüküm ve Bozma Kriterleri:
                        </span>
                        <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                          {activeReport.hesaplamaPrensibi.yargitayKriterleri.map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 3. Teknik Veriler Tablosu */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Calculator size={15} className={isTarim ? "text-emerald-600" : "text-amber-600"} />
                      3. Keşif Mahallinde Tespit Edilen Teknik Veriler
                    </h4>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="p-2.5">Parametre / Veri</th>
                            <th className="p-2.5">Tespit Edilen Değer</th>
                            <th className="p-2.5">Teknik Açıklama / Kaynak</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {activeReport.teknikVeriler.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{item.etiket}</td>
                              <td className="p-2.5 font-mono font-bold text-indigo-900 dark:text-indigo-300">
                                {typeof item.deger === "number" ? item.deger.toLocaleString("tr-TR") : item.deger}{" "}
                                {item.birim || ""}
                              </td>
                              <td className="p-2.5 text-slate-500 dark:text-slate-400">
                                {item.aciklama || "Keşif ve resmi cetvel tespiti"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 4. Adım Adım Matematiksel Hesaplama */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Layers size={15} className={isTarim ? "text-emerald-600" : "text-amber-600"} />
                      4. Adım Adım Matematiksel Çözüm ve Hesap Cetveli
                    </h4>

                    <div className="space-y-2.5">
                      {activeReport.hesaplamaAdimlari.map((step) => (
                        <div
                          key={step.adimNo}
                          className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold ${
                                  isTarim ? "bg-emerald-600" : "bg-amber-600"
                                }`}
                              >
                                {step.adimNo}
                              </span>
                              {step.adimAdi}
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                              {step.sonuc}
                            </span>
                          </div>

                          <div className="font-mono text-xs text-indigo-950 dark:text-indigo-200 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                            <b>Formül / İşlem:</b> {step.islem}
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.aciklama}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. HMK 279 Uyumlu Sonuç ve Kanaat Metni */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck size={15} className="text-emerald-600" />
                      5. HMK 279 Uyumlu Nihai Sonuç ve Kanaat (Mahkemeye Sunulan Metin)
                    </h4>

                    <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                      <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 italic font-serif">
                        "{activeReport.sonucVeKanaatMetni}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          HÜKMEDİLECEK TOPLAM BEDEL / NET TAZMİNAT:
                        </span>
                        <span className="text-base font-bold font-mono text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-700">
                          {activeReport.toplamTazminatTL > 0
                            ? `₺${activeReport.toplamTazminatTL.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`
                            : "Tespit Hükmü"}
                        </span>
                      </div>

                      {activeReport.yargitayOnayNotu && (
                        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 font-medium flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>
                            <b>Yargıtay Denetimi:</b> {activeReport.yargitayOnayNotu}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bilirkişi Heyeti İmzaları */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400 block mb-2">BİLİRKİŞİ HEYETİ:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {activeReport.bilirkisiHeyeti.map((member, i) => (
                        <div
                          key={i}
                          className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                Lütfen sol listeden incelemek istediğiniz raporu seçiniz.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. BU KATEGORİYE ÖZGÜ HESAPLAMA PRENSİPLERİ VE FORMÜL REHBERİ */}
      {/* ===================================================================== */}
      {activeSubTab === "prensipler" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className={isTarim ? "text-emerald-600" : "text-amber-600"} />
              {isTarim
                ? "01 Tarım & Ziraat Bilirkişiliği Kanuni Hesaplama Metodolojisi"
                : "02 Hayvancılık & Yem Bilirkişiliği Kanuni Hesaplama Metodolojisi"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isTarim
                ? "Yargıtay 5. HD (Kamulaştırma & İrtifak), 3. HD (Ecrimisil & Taşkın Hasarı) ve 16. HD (Kadastro Zilyetlik) ilamlarında kabul edilen resmi formüller ve bozma kriterleri."
                : "Yargıtay 3. ve 11. HD (Telefat, Karkas Hurda Mahsubu, Aflatoksinli Yem Sorumluluğu, Kümes Asfiksi ve TTK m. 23 Çiğ Süt Ayıpları) ilamlarında uygulanan resmi hesap prensipleri."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrinciples.map(([key, p]) => {
              const isExpanded = expandedPrensipKey === key;
              return (
                <div
                  key={key}
                  className={`bg-white dark:bg-[#0f172a] rounded-2xl border transition overflow-hidden ${
                    isExpanded
                      ? isTarim
                        ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                        : "border-amber-500 shadow-md ring-1 ring-amber-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div
                    onClick={() => setExpandedPrensipKey(isExpanded ? null : key)}
                    className="p-5 cursor-pointer flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isTarim
                            ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200"
                            : "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200"
                        }`}
                      >
                        {p.kanunVeIctihat}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{p.baslik}</h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={18} className={isTarim ? "text-emerald-600" : "text-amber-600"} />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{p.aciklama}</p>

                      {/* Formül */}
                      <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl shadow-inner whitespace-pre-line leading-relaxed">
                        {p.formulMetni}
                      </div>

                      {/* Değişkenler */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">Formül Değişkenleri:</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {p.degiskenler.map((d, i) => (
                            <div
                              key={i}
                              className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              <b className={isTarim ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}>
                                {d.ad}:
                              </b>{" "}
                              {d.tanim}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Yargıtay Kriterleri */}
                      <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          Yargıtay Yerleşik Kriterleri:
                        </span>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                          {p.yargitayKriterleri.map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dikkat Edilecekler */}
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                        <span className="font-bold flex items-center gap-1.5">
                          <AlertTriangle size={13} className="text-amber-600" />
                          Bilirkişinin Dikkat Edeceği İpuçları:
                        </span>
                        <ul className="space-y-0.5 text-[11px] list-disc list-inside">
                          {p.dikkatEdilecekler.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

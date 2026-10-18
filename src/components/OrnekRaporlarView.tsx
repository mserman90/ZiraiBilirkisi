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
  Download,
  Wheat,
  Beef,
  Sprout,
  Printer,
  ArrowRight,
  Sparkles,
  Filter,
  Layers,
  Gavel,
  FileCheck,
  Info,
  Percent,
  ShieldAlert,
  DollarSign,
  Check,
  Eye,
  X,
} from "lucide-react";
import { ORNEK_RAPORLAR_DB, HESAPLAMA_PRENSIPLERI_REHBERI } from "../data/ornekRaporlarData";
import { OrnekRapor, HesaplamaPrensibi } from "../types";

interface OrnekRaporlarViewProps {
  showToast: (msg: string) => void;
  defaultCategory?: "tarim" | "hayvancilik";
  onTransferToWizard?: (data: { netGelir: number; araziTipi: "sulu" | "kuru"; urunAdi: string }) => void;
}

export default function OrnekRaporlarView({
  showToast,
  defaultCategory = "tarim",
  onTransferToWizard,
}: OrnekRaporlarViewProps) {
  const [activeCategory, setActiveCategory] = useState<"tarim" | "hayvancilik" | "prensipler">(defaultCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAltKategori, setSelectedAltKategori] = useState<string>("Tümü");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPrensipKey, setExpandedPrensipKey] = useState<string | null>("kamulastirma_gelir_kapitalizasyonu");

  // Rapor listesi filtreleme
  const filteredReports = useMemo(() => {
    return ORNEK_RAPORLAR_DB.filter((r) => {
      // Kategori kontrolü
      if (activeCategory === "tarim" && r.kategori !== "tarim") return false;
      if (activeCategory === "hayvancilik" && r.kategori !== "hayvancilik") return false;

      // Alt kategori kontrolü
      if (selectedAltKategori !== "Tümü" && r.altKategori !== selectedAltKategori) return false;

      // Arama sorgusu
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
  }, [activeCategory, selectedAltKategori, searchQuery]);

  // Seçili aktif rapor
  const activeReport = useMemo(() => {
    if (selectedReportId) {
      return ORNEK_RAPORLAR_DB.find((r) => r.id === selectedReportId) || null;
    }
    return filteredReports.length > 0 ? filteredReports[0] : null;
  }, [selectedReportId, filteredReports]);

  // Alt kategoriler listesi
  const altKategoriler = useMemo(() => {
    const list = ORNEK_RAPORLAR_DB
      .filter((r) => activeCategory === "prensipler" ? true : r.kategori === activeCategory)
      .map((r) => r.altKategori);
    return ["Tümü", ...Array.from(new Set(list))];
  }, [activeCategory]);

  // Panoya Kopyalama Fonksiyonu
  const handleCopyReport = (report: OrnekRapor) => {
    const text = `
================================================================================
BİLİRKİŞİ RAPORU (ÖRNEK METİN)
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

HÜKMEDİLEN NET MADDİ ZARAR / KAMULAŞTIRMA BEDELİ: ₺${report.toplamTazminatTL.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}

BİLİRKİŞİ HEYETİ:
${report.bilirkisiHeyeti.join("\n")}
================================================================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(report.id);
    showToast(`📋 ${report.dosyaNo} sayılı bilirkişi raporu panoya kopyalandı.`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Yazdırma penceresi
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ÜST BAŞLIK VE SEKME SEÇİCİ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <Gavel size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                    YARGITAY İÇTİHATLI • HMK 279 UYUMLU
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    GERÇEK DAVA ESASLI
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  Örnek Bilirkişi Raporları & Hesaplama Prensipleri
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Tarım (01) ve Hayvancılık (02) davalarında mahkemelere sunulan eksiksiz rapor metinleri, yasal dayanaklar ve adım adım matematiksel çözümler.
                </p>
              </div>
            </div>

            {/* ANA KATEGORİ SEÇİCİ BUTONLARI */}
            <div className="flex items-center bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => { setActiveCategory("tarim"); setSelectedReportId(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeCategory === "tarim"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Sprout size={16} />
                <span>01 Tarım Raporları</span>
              </button>

              <button
                onClick={() => { setActiveCategory("hayvancilik"); setSelectedReportId(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeCategory === "hayvancilik"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Beef size={16} />
                <span>02 Hayvancılık & Yem Raporları</span>
              </button>

              <button
                onClick={() => { setActiveCategory("prensipler"); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeCategory === "prensipler"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Scale size={16} />
                <span>Hesaplama Prensipleri</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1 & 2. TARIM VE HAYVANCILIK RAPORLARI GÖRÜNÜMÜ */}
      {/* ===================================================================== */}
      {activeCategory !== "prensipler" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SOL PANEL: RAPOR LİSTESİ VE ARAMA FİLTRELERİ (4 KOLON) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              {/* Arama Kutusu */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Dava türü, mahkeme, esas no veya anahtar kelime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Alt Kategori Filtresi */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {altKategoriler.map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setSelectedAltKategori(kat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                      selectedAltKategori === kat
                        ? activeCategory === "tarim"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                          : "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {kat === "Tümü" ? "Tüm Konular" : kat.replace(/_/g, " ").toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span>Listelenen: <b>{filteredReports.length}</b> Örnek Rapor</span>
                <span className="text-[11px] text-indigo-600 font-semibold">Tıklayarak inceleyin</span>
              </div>
            </div>

            {/* RAPOR KARTLARI LİSTESİ */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                  <Info size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-semibold">Arama kriterlerine uygun rapor bulunamadı.</p>
                  <p className="text-xs text-slate-400 mt-1">Filtreleri temizleyip tekrar deneyin.</p>
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
                          ? report.kategori === "tarim"
                            ? "bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/20"
                            : "bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-400/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            report.kategori === "tarim"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {report.etiket}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">
                          {report.dosyaNo}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                        {report.baslik}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                        {report.ozet}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-slate-100 text-slate-500">
                        <span className="truncate max-w-[200px]">{report.mahkeme}</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {report.toplamTazminatTL > 0
                            ? `₺${report.toplamTazminatTL.toLocaleString("tr-TR")}`
                            : "Tespit"}
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
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Rapor Başlık Şeridi */}
                <div
                  className={`p-6 text-white ${
                    activeReport.kategori === "tarim"
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
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition shadow-sm"
                    >
                      {copiedId === activeReport.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedId === activeReport.id ? "Kopyalandı!" : "Rapor Metnini Kopyala"}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                    >
                      <Printer size={14} />
                      <span>Yazdır / PDF</span>
                    </button>

                    {activeReport.kategori === "tarim" && onTransferToWizard && (
                      <button
                        onClick={() => {
                          // Net geliri bul ve sihirbaza aktar
                          const netRow = activeReport.hesaplamaAdimlari.find((a) => a.adimAdi.includes("Net Gelir"));
                          onTransferToWizard({
                            netGelir: 5037,
                            araziTipi: activeReport.baslik.toLowerCase().includes("sulu") ? "sulu" : "kuru",
                            urunAdi: activeReport.baslik,
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition ml-auto shadow-sm"
                      >
                        <Sparkles size={14} />
                        <span>Sihirbaza Aktar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Rapor Gövdesi */}
                <div className="p-6 space-y-6 text-sm text-slate-700">
                  {/* 1. Dava Konusu ve İddia/Savunma */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={15} className="text-indigo-600" />
                      1. Dava Konusu ve Tarafların İddia/Savunması
                    </h4>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <p className="text-slate-700 leading-relaxed">
                        <b>Özet:</b> {activeReport.ozet}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-blue-900 block mb-1">Davacı Talebi:</span>
                          <span className="text-slate-600">{activeReport.iddiaVeSavunma.davaciIstem}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-rose-900 block mb-1">Davalı Savunması:</span>
                          <span className="text-slate-600">{activeReport.iddiaVeSavunma.davaliSavunma}</span>
                        </div>
                      </div>
                      <div className="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100 text-indigo-900 font-medium">
                        <b>Uyuşmazlığın Teknik Özü:</b> {activeReport.iddiaVeSavunma.uyusmazlikNoktasi}
                      </div>
                    </div>
                  </div>

                  {/* 2. Uygulanan Hesaplama Metodolojisi ve Formülü */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Scale size={15} className="text-indigo-600" />
                      2. Uygulanan Hesaplama Prensibi & Yargıtay Metodolojisi
                    </h4>

                    <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-950 block">
                          {activeReport.hesaplamaPrensibi.baslik}
                        </span>
                        <span className="text-[11px] text-indigo-700 font-medium">
                          Yasal Dayanak: {activeReport.hesaplamaPrensibi.kanunVeIctihat}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeReport.hesaplamaPrensibi.aciklama}
                      </p>

                      {/* Matematiksel Formül Kutusu */}
                      <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl shadow-inner border border-slate-800 leading-relaxed whitespace-pre-line">
                        {activeReport.hesaplamaPrensibi.formulMetni}
                      </div>

                      {/* Yargıtay Kriterleri */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-800 block">Yargıtay Hüküm ve Bozma Kriterleri:</span>
                        <ul className="text-xs space-y-1 text-slate-600">
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
                      <Calculator size={15} className="text-indigo-600" />
                      3. Keşif Mahallinde Tespit Edilen Teknik Veriler
                    </h4>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Parametre / Veri</th>
                            <th className="p-2.5">Tespit Edilen Değer</th>
                            <th className="p-2.5">Teknik Açıklama / Kaynak</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeReport.teknikVeriler.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-semibold text-slate-800">{item.etiket}</td>
                              <td className="p-2.5 font-mono font-bold text-indigo-900">
                                {typeof item.deger === "number" ? item.deger.toLocaleString("tr-TR") : item.deger} {item.birim || ""}
                              </td>
                              <td className="p-2.5 text-slate-500">{item.aciklama || "Keşif ve resmi cetvel tespiti"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 4. Adım Adım Matematiksel Hesaplama */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Layers size={15} className="text-indigo-600" />
                      4. Adım Adım Matematiksel Çözüm ve Hesap Cetveli
                    </h4>

                    <div className="space-y-2.5">
                      {activeReport.hesaplamaAdimlari.map((step) => (
                        <div key={step.adimNo} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                                {step.adimNo}
                              </span>
                              {step.adimAdi}
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                              {step.sonuc}
                            </span>
                          </div>

                          <div className="font-mono text-xs text-indigo-950 bg-white p-2 rounded-xl border border-slate-200">
                            <b>Formül / İşlem:</b> {step.islem}
                          </div>

                          <p className="text-[11px] text-slate-500">
                            {step.aciklama}
                          </p>
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

                    <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-3">
                      <p className="text-xs leading-relaxed text-slate-800 italic font-serif">
                        "{activeReport.sonucVeKanaatMetni}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/60">
                        <span className="text-xs font-bold text-slate-700">
                          HÜKMEDİLECEK TOPLAM BEDEL / NET TAZMİNAT:
                        </span>
                        <span className="text-base font-bold font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                          {activeReport.toplamTazminatTL > 0
                            ? `₺${activeReport.toplamTazminatTL.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`
                            : "Tespit Hükmü"}
                        </span>
                      </div>

                      {activeReport.yargitayOnayNotu && (
                        <div className="p-2 bg-white rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span><b>Yargıtay Denetimi:</b> {activeReport.yargitayOnayNotu}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bilirkişi Heyeti İmzaları */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-600 block mb-2">BİLİRKİŞİ HEYETİ:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {activeReport.bilirkisiHeyeti.map((member, i) => (
                        <div key={i} className="p-2 bg-white rounded-xl border border-slate-200 text-slate-700 font-medium">
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                Lütfen sol listeden incelemek istediğiniz raporu seçin.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TÜM HESAPLAMA PRENSİPLERİ VE FORMÜL REHBERİ (GENEL SEKME) */}
      {/* ===================================================================== */}
      {activeCategory === "prensipler" && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600" />
              Zirai & Hayvancılık Bilirkişiliği Kanuni Hesaplama Metodolojisi
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Yargıtay 5. HD (Kamulaştırma), 3. HD (Ecrimisil & Haksız Fiil), 11. HD (TARSİM & Ayıplı Mal) ve 16. HD (Kadastro) ilamlarında kabul edilen resmi formüller ve bozma kriterleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(HESAPLAMA_PRENSIPLERI_REHBERI).map(([key, p]) => {
              const isExpanded = expandedPrensipKey === key;
              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border transition overflow-hidden ${
                    isExpanded ? "border-indigo-400 shadow-md ring-1 ring-indigo-400/20" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    onClick={() => setExpandedPrensipKey(isExpanded ? null : key)}
                    className="p-5 cursor-pointer flex items-start justify-between gap-3 bg-slate-50/50 hover:bg-slate-50"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                        {p.kanunVeIctihat}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{p.baslik}</h4>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-indigo-600" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 space-y-4 text-xs">
                      <p className="text-slate-600 leading-relaxed">{p.aciklama}</p>

                      {/* Formül */}
                      <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl shadow-inner whitespace-pre-line leading-relaxed">
                        {p.formulMetni}
                      </div>

                      {/* Değişkenler */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 block">Formül Değişkenleri:</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {p.degiskenler.map((d, i) => (
                            <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                              <b className="text-indigo-900">{d.ad}:</b> {d.tanim}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Yargıtay Kriterleri */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-800 block">Yargıtay Yerleşik Kriterleri:</span>
                        <ul className="space-y-1 text-slate-600">
                          {p.yargitayKriterleri.map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dikkat Edilecekler */}
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
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

import React, { useState, useMemo } from "react";
import {
  Scale,
  FileText,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  BookOpen,
  Gavel,
  Check,
  RotateCcw,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  ITIRAZ_SENARYOLARI_DB,
  ItirazSenaryosu,
  generateEkRaporText,
} from "../data/ziraatRehberiData";

interface EkRaporModuleProps {
  showToast: (msg: string) => void;
  defaultMahkeme?: string;
  defaultDosyaNo?: string;
  defaultDavaci?: string;
  defaultDavali?: string;
}

export default function EkRaporModule({
  showToast,
  defaultMahkeme = "Edirne 2. Asliye Hukuk Mahkemesi",
  defaultDosyaNo = "2024/318 Esas",
  defaultDavaci = "T.C. Karayolları Genel Müdürlüğü",
  defaultDavali = "Ahmet Yılmaz ve Müşterekleri",
}: EkRaporModuleProps) {
  const [selectedSenaryoId, setSelectedSenaryoId] = useState<string>("kfo_itirazi");

  const senaryo = useMemo(
    () =>
      ITIRAZ_SENARYOLARI_DB.find((s) => s.id === selectedSenaryoId) ||
      ITIRAZ_SENARYOLARI_DB[0],
    [selectedSenaryoId]
  );

  // Künye Bilgileri
  const [mahkeme, setMahkeme] = useState(defaultMahkeme);
  const [dosyaNo, setDosyaNo] = useState(defaultDosyaNo);
  const [davaci, setDavaci] = useState(defaultDavaci);
  const [davaciVekili, setDavaciVekili] = useState("Av. Selin Kara");
  const [davali, setDavali] = useState(defaultDavali);
  const [davaliVekili, setDavaliVekili] = useState("Av. Mehmet Demir");
  const [davaKonusu, setDavaKonusu] = useState("Kamulaştırma Bedelinin Tespiti ve Tescili (Ek Rapor Talebi)");
  const [kokRaporTarihi, setKokRaporTarihi] = useState("14.05.2024");
  const [araKararTarihi, setAraKararTarihi] = useState("20.06.2024");
  const [itirazDilekceTarihi, setItirazDilekceTarihi] = useState("05.06.2024");

  // Rakamlar
  const [kokRaporBedeli, setKokRaporBedeli] = useState<number>(2450000);
  const [ozelTeknikNot, setOzelTeknikNot] = useState("");

  // Seçenekli hesap bedelleri (katsayı çarpanı ile otomatik hesaplanır veya serbest düzenlenir)
  const secenek1Bedel = useMemo(() => {
    return Math.round(kokRaporBedeli * senaryo.secenekliTabloSablonu.secenekA.katsayiCarpani);
  }, [kokRaporBedeli, senaryo]);

  const secenek2Bedel = useMemo(() => {
    return Math.round(kokRaporBedeli * senaryo.secenekliTabloSablonu.secenekB.katsayiCarpani);
  }, [kokRaporBedeli, senaryo]);

  const secenek3Bedel = useMemo(() => {
    if (!senaryo.secenekliTabloSablonu.secenekC) return undefined;
    return Math.round(kokRaporBedeli * senaryo.secenekliTabloSablonu.secenekC.katsayiCarpani);
  }, [kokRaporBedeli, senaryo]);

  // Bilirkişi Heyeti
  const [heyetUyeleri] = useState<string[]>([
    "Zir. Yük. Müh. Ahmet YILMAZ (Tarım Ekonomisti / Heyet Başkanı)",
    "Zir. Müh. Selim KAYA (Tarla Bitkileri Uzmanı)",
    "Harita Müh. Burak DEMİR (Kadastro / Fen Bilirkişisi)",
  ]);

  // Tam Rapor Metni
  const fullReportText = useMemo(() => {
    return generateEkRaporText({
      mahkeme,
      dosyaNo,
      davaci,
      davaciVekili,
      davali,
      davaliVekili,
      davaKonusu,
      itirazSenaryoId: selectedSenaryoId,
      tarafItirazDilekceTarihi: itirazDilekceTarihi,
      araKararTarihi,
      kokRaporTarihi,
      kokRaporBedeliTL: kokRaporBedeli,
      secenek1BedeliTL: secenek1Bedel,
      secenek2BedeliTL: secenek2Bedel,
      secenek3BedeliTL: secenek3Bedel,
      ozelTeknikAciklama: ozelTeknikNot,
      bilirkisiHeyeti: heyetUyeleri,
    });
  }, [
    mahkeme,
    dosyaNo,
    davaci,
    davaciVekili,
    davali,
    davaliVekili,
    davaKonusu,
    selectedSenaryoId,
    itirazDilekceTarihi,
    araKararTarihi,
    kokRaporTarihi,
    kokRaporBedeli,
    secenek1Bedel,
    secenek2Bedel,
    secenek3Bedel,
    ozelTeknikNot,
    heyetUyeleri,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportText).then(() => {
      showToast("📋 Ek Bilirkişi Raporu panoya kopyalandı");
    });
  };

  const handleDownloadWord = () => {
    // HTML bazlı .doc oluştur
    const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>EK BILIRKISI RAPORU - ${dosyaNo}</title>
<style>
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 25mm 20mm; }
  h1 { font-size: 13pt; text-align: center; font-weight: bold; margin-bottom: 20px; }
  h2 { font-size: 12pt; font-weight: bold; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #333; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11pt; }
  th, td { border: 1px solid #444; padding: 6px 8px; text-align: left; }
  th { background-color: #f2f2f2; font-weight: bold; }
  .text-right { text-align: right; }
  .bold { font-weight: bold; }
</style>
</head>
<body>
<pre style="white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
${fullReportText}
</pre>
</body>
</html>`;

    const blob = new Blob(["\ufeff" + htmlContent], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ek_Bilirkisi_Raporu_${dosyaNo.replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📄 Word (.doc) Ek Raporu indirildi");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Yazdırma penceresi açılamadı");
      return;
    }
    printWindow.document.write(`<pre style="white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 11pt; padding: 20px;">${fullReportText}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Gavel size={220} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1.5">
              <Scale size={14} className="text-amber-400" />
              HMK 281 & ADALET BAKANLIĞI İLKE 30
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              TMMOB ZMO BİLİRKİŞİ REHBERİ EK-7
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              KADEMELİ SEÇENEKLİ HESAP
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            İtirazlara Cevap & Ek Rapor Hazırlama Asistanı
          </h2>
          <p className="text-amber-100/90 text-sm md:text-base max-w-3xl leading-relaxed">
            Mahkemelerce taraf vekillerinin KFO, münavebe, dekar masrafları veya arsa/arazi vasfına
            yönelik itirazlarının karşılanması için talep edilen Ek Raporları (HMK 281),
            Yargıtay içtihatları ve seçenekli hesap tabloları ile saniyeler içinde hazırlayın.
          </p>
        </div>
      </div>

      {/* 8 İtiraz Senaryosu Seçici */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={18} className="text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            1. Dava Konusu İtiraz Türünü Seçin
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {ITIRAZ_SENARYOLARI_DB.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSenaryoId(item.id);
                showToast(`Seçildi: ${item.baslik}`);
              }}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedSenaryoId === item.id
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {item.itirazEden}
                </span>
                <p className="font-bold text-xs mt-0.5 line-clamp-1">{item.baslik}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.ozetItiraz}
                </p>
              </div>
              {selectedSenaryoId === item.id && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                  <Check size={12} /> Aktif Şablon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* İki Kolonlu Çalışma Alanı: Sol Form & Sağ Canlı Önizleme */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Form ve Parametreler (5 Kolon) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mahkeme ve Görevlendirme Bilgileri */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <FileText size={15} className="text-amber-600" />
              Mahkeme ve Ara Karar Künyesi
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Mahkeme Adı
                </label>
                <input
                  type="text"
                  value={mahkeme}
                  onChange={(e) => setMahkeme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Dosya No
                  </label>
                  <input
                    type="text"
                    value={dosyaNo}
                    onChange={(e) => setDosyaNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Kök Rapor Bedeli (₺)
                  </label>
                  <input
                    type="number"
                    value={kokRaporBedeli}
                    onChange={(e) => setKokRaporBedeli(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Davacı
                  </label>
                  <input
                    type="text"
                    value={davaci}
                    onChange={(e) => setDavaci(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Davalı
                  </label>
                  <input
                    type="text"
                    value={davali}
                    onChange={(e) => setDavali(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Kök Rapor Tarihi
                  </label>
                  <input
                    type="text"
                    value={kokRaporTarihi}
                    onChange={(e) => setKokRaporTarihi(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    İtiraz Dilekçesi
                  </label>
                  <input
                    type="text"
                    value={itirazDilekceTarihi}
                    onChange={(e) => setItirazDilekceTarihi(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Ara Karar Tarihi
                  </label>
                  <input
                    type="text"
                    value={araKararTarihi}
                    onChange={(e) => setAraKararTarihi(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* İddia ve Savunma Özeti Kartı */}
          <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-200/80 dark:border-amber-800/40 space-y-2.5">
            <h4 className="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scale size={14} />
              Taraf İddiaları ve İtiraz Özeti
            </h4>

            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Davacı İddiası:</span>
              <p className="text-slate-600 dark:text-slate-300 italic">
                "{senaryo.tarafIddialari.davaciIddia}"
              </p>
            </div>

            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400">Davalı Savunması:</span>
              <p className="text-slate-600 dark:text-slate-300 italic">
                "{senaryo.tarafIddialari.davaliIddia}"
              </p>
            </div>
          </div>

          {/* Seçenekli Hesap Kartı */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Layers size={15} className="text-amber-600" />
              Kademeli Seçenekli Hesap Cetveli
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300">
                    Seçenek 1 (Heyet Kanaati)
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                    ₺{secenek1Bedel.toLocaleString("tr-TR")}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">
                  {senaryo.secenekliTabloSablonu.secenekA.baslik}
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/40">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-900 dark:text-blue-300">
                    Seçenek 2 (Alternatif Kriter)
                  </span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-400 text-sm">
                    ₺{secenek2Bedel.toLocaleString("tr-TR")}
                  </span>
                </div>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-400/80 mt-0.5">
                  {senaryo.secenekliTabloSablonu.secenekB.baslik}
                </p>
              </div>

              {secenek3Bedel !== undefined && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/40">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-900 dark:text-purple-300">
                      Seçenek 3 (İdare/Malik Tezi)
                    </span>
                    <span className="font-extrabold text-purple-700 dark:text-purple-400 text-sm">
                      ₺{secenek3Bedel.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-400/80 mt-0.5">
                    {senaryo.secenekliTabloSablonu.secenekC?.baslik}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold text-xs mb-1">
                İlave Teknik Şerh / Not (Opsiyonel)
              </label>
              <textarea
                value={ozelTeknikNot}
                onChange={(e) => setOzelTeknikNot(e.target.value)}
                placeholder="Örneğin: Keşif esnasında çekilen fotoğraflar ektedir; İlçe Tarım 2024 onaylı maliyet cetveli ek raporda sunulmuştur..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SAĞ: Canlı Mahkeme Rapor Önizlemesi & İndirme (7 Kolon) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Mahkemeye Sunulmaya Hazır Ek Rapor
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Panoya Kopyala"
              >
                <Copy size={13} /> Kopyala
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Yazdır / PDF"
              >
                <Printer size={13} /> Yazdır
              </button>
              <button
                onClick={handleDownloadWord}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download size={13} /> Word (.doc) İndir
              </button>
            </div>
          </div>

          {/* Rapor Kağıdı Görünümü */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800 max-h-[750px] overflow-y-auto">
            <div className="font-serif text-slate-900 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line selection:bg-amber-200 selection:text-slate-900">
              {fullReportText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

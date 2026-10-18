import React, { useState, useMemo } from "react";
import {
  Milk,
  Scale,
  Calculator,
  Search,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Sparkles,
  Info,
  DollarSign,
  Check,
  RotateCcw,
  ShieldCheck,
  Clock,
  Thermometer,
  Layers,
  FileCheck,
  TrendingUp,
  AlertOctagon,
  Percent,
  FlaskConical,
  Flame,
  Activity,
  FileText,
} from "lucide-react";
import {
  TGK_CIG_SUT_NORMLARI,
  MANDIRA_RANDIMAN_CETVELI,
  SUT_TAGSIS_DB,
  SUT_ICTIHAT_DB,
  calculateWaterAdulteration,
  calculateDairyYieldLoss,
  UrunRandimani,
} from "../data/sutUrunleriData";

interface SutUrunleriViewProps {
  showToast: (msg: string) => void;
  onGoToReportAutomation?: () => void;
}

export default function SutUrunleriView({
  showToast,
  onGoToReportAutomation,
}: SutUrunleriViewProps) {
  // Aktif alt sekme
  const [activeTab, setActiveTab] = useState<
    "kriyoskopi" | "randiman" | "sogukZincir" | "tagsisRehber"
  >("kriyoskopi");

  // -------------------------------------------------------------------
  // SEKME 1: KRİYOSKOPİK DONMA NOKTASI VE SU KATMA HESAPLAYICISI
  // -------------------------------------------------------------------
  const [measuredFreezingPoint, setMeasuredFreezingPoint] = useState<number>(-0.448);
  const [totalDeliveredLiters, setTotalDeliveredLiters] = useState<number>(12000);
  const [milkLiterPrice, setMilkLiterPrice] = useState<number>(18.5);
  const [measuredFatPct, setMeasuredFatPct] = useState<number>(3.1);
  const [measuredSnfPct, setMeasuredSnfPct] = useState<number>(7.4);
  const [measuredAciditySH, setMeasuredAciditySH] = useState<number>(6.8);
  const [referenceFP, setReferenceFP] = useState<number>(-0.520);
  const [kriyoskopiReportText, setKriyoskopiReportText] = useState<string | null>(null);

  const waterCalc = useMemo(() => {
    return calculateWaterAdulteration(
      measuredFreezingPoint,
      totalDeliveredLiters,
      milkLiterPrice,
      referenceFP
    );
  }, [measuredFreezingPoint, totalDeliveredLiters, milkLiterPrice, referenceFP]);

  const handleGenerateKriyoskopiReport = () => {
    const text = `T.C. HUKUK MAHKEMESİ SAYIN HAKİMLİĞİ'NE

DOSYA KONUSU: Çiğ Süt Tesliminde Su Katma (Kriyoskopi Tağşişi) ve Bedel Tenzili Hesabı

1. TEKNİK İNCELEME VE YASAL DAYANAK:
Türk Gıda Kodeksi Çiğ Süt Tebliği Madde 5 ve TS 1018 sayılı standart uyarınca inek sütünün donma noktası -0.520 °C ile -0.550 °C arasında olmak zorundadır. Saf sütün donma noktasının 0 °C'ye yaklaşması (yükselmesi) süte dışarıdan su katıldığının (Hortvet Kuralı) kesin bilimsel kanıtıdır.

2. LABORATUVAR BULGULARI:
- Uyuşmazlık Konusu Süt Partisi: ${totalDeliveredLiters.toLocaleString("tr-TR")} Litre
- Kararlaştırılan Birim Fiyat: ₺${milkLiterPrice.toFixed(2)} / Litre
- Akredite Laboratuvarda Ölçülen Donma Noktası: ${measuredFreezingPoint} °C (Eşik Sınır: ${referenceFP} °C)
- Ölçülen Yağ Oranı: %${measuredFatPct} (TGK Standardı: Asgari %3.50)
- Ölçülen Yağsız Kuru Madde (YKM): %${measuredSnfPct} (TGK Standardı: Asgari %8.50)
- Titrasyon Asitliği: ${measuredAciditySH} °SH (Normal aralıkta)

3. HORTVET FORMÜLÜ VE MATEMATİKSEL HESAPLAMA:
% Katılan Su = [(${referenceFP}) - (${measuredFreezingPoint})] / (${referenceFP}) * 100
% Katılan Su = %${waterCalc.waterPct}

- Süte Katılan Harici Su Hacmi: ${waterCalc.addedWaterLiters.toLocaleString("tr-TR")} Litre
- Fiilen Teslim Edilen Saf Süt Hacmi: ${waterCalc.pureMilkLiters.toLocaleString("tr-TR")} Litre
- Suya Karşılık Ödenen / Fazla Talep Edilen Tenzilat Tutarı: ₺${waterCalc.deductionAmountTL.toLocaleString("tr-TR")}

4. HMK 279 UYUMLU TEKNİK KANAAT:
${waterCalc.statusText} Yağ (%${measuredFatPct}) ve YKM (%${measuredSnfPct}) değerlerinin de yasal alt sınırların altında kalması su katma bulgusunu çaprazlama teyit etmektedir. Su katılan kısma tekabül eden ₺${waterCalc.deductionAmountTL.toLocaleString("tr-TR")} bedelin teslimat hakedişinden mahsup edilmesi gerektiği, takdiri Sayın Mahkemenize ait olmak üzere teknik tespit olarak arz olunur.`;

    setKriyoskopiReportText(text);
    showToast("✅ Kriyoskopi bilirkişi raporu hazırlandı");
  };

  // -------------------------------------------------------------------
  // SEKME 2: MANDIRA RANDIMAN VE EKSİK ÜRÜN (FİRE) HESAPLAYICISI
  // -------------------------------------------------------------------
  const [selectedYieldId, setSelectedYieldId] = useState<string>("taze_kasar");
  const selectedYieldItem = useMemo(
    () =>
      MANDIRA_RANDIMAN_CETVELI.find((y) => y.id === selectedYieldId) ||
      MANDIRA_RANDIMAN_CETVELI[1],
    [selectedYieldId]
  );
  const [processedMilkKg, setProcessedMilkKg] = useState<number>(50000);
  const [actualProducedKg, setActualProducedKg] = useState<number>(3800);
  const [productUnitPriceTL, setProductUnitPriceTL] = useState<number>(280);
  const [yieldReportText, setYieldReportText] = useState<string | null>(null);

  const yieldCalc = useMemo(() => {
    return calculateDairyYieldLoss(
      selectedYieldItem,
      processedMilkKg,
      actualProducedKg,
      productUnitPriceTL
    );
  }, [selectedYieldItem, processedMilkKg, actualProducedKg, productUnitPriceTL]);

  const handleGenerateYieldReport = () => {
    const text = `T.C. HUKUK MAHKEMESİ SAYIN HAKİMLİĞİ'NE

DOSYA KONUSU: Mandıra Fason Üretim Randıman Açığı ve Eksik Mamul Bedeli Tespiti

1. BİLİMSEL NORMLAR VE DÖNÜŞÜM KATSAYISI:
Süt teknolojisi normları ve TMMOB Gıda Mühendisleri Odası kabullerine göre; ${selectedYieldItem.urunAdi} üretiminde 1 kg mamul elde edebilmek için ortalama ${selectedYieldItem.sutIhtiyaciKg} kg çiğ inek sütü sarf edilmektedir (Normatif Randıman: %${selectedYieldItem.beklenenRandimanPct}). Bu prosesteki teknolojik fire eşiği azami %${selectedYieldItem.tipikFirePct}'tir.

2. ÜRETİM GİRDİ VE ÇIKTI VERİLERİ:
- Davacı Tarafça Teslim Edilen Süt Miktarı: ${processedMilkKg.toLocaleString("tr-TR")} kg
- Davalı Mandıra Tarafından Teslim Edilen Mamul: ${actualProducedKg.toLocaleString("tr-TR")} kg
- Mamul Birim Piyasa Rayici: ₺${productUnitPriceTL.toLocaleString("tr-TR")} / kg

3. MATEMATİKSEL RANDIMAN DEĞERLENDİRMESİ:
- Beklenen Normatif Üretim Miktarı: ${yieldCalc.expectedProductKg.toLocaleString("tr-TR")} kg
- Gerçekleşen İmalat Miktarı: ${actualProducedKg.toLocaleString("tr-TR")} kg
- Saptanan Eksik Üretim (Açık): ${yieldCalc.deficitKg.toLocaleString("tr-TR")} kg (%${yieldCalc.deficitPct})
- Teknolojik Fire Oranı Aşımı: ${yieldCalc.isDeficitAbnormal ? `%${(yieldCalc.deficitPct - selectedYieldItem.tipikFirePct).toFixed(1)} anormal kayıp` : "Normal fire sınırında"}
- Hesaplanan Teknik Zarar / Hakediş Açığı: ₺${yieldCalc.yieldLossAmountTL.toLocaleString("tr-TR")}

4. HMK 279 KAPSAMINDA TEKNİK KANAAT:
${yieldCalc.evaluationText} Yan ürün olarak ortaya çıkan ${selectedYieldItem.yanUrun} değerlemesi ayrıca dikkate alınmak üzere, Sayın Mahkemenizin takdirlerine saygıyla arz olunur.`;

    setYieldReportText(text);
    showToast("✅ Randıman açığı bilirkişi raporu hazırlandı");
  };

  // -------------------------------------------------------------------
  // SEKME 3: SOĞUK ZİNCİR KIRILMASI, ASİTLİK (°SH) VE DÖKÜM ZARARI
  // -------------------------------------------------------------------
  const [spoilMilkLiters, setSpoilMilkLiters] = useState<number>(18000);
  const [spoilLiterPrice, setSpoilLiterPrice] = useState<number>(19.0);
  const [measuredAcidity, setMeasuredAcidity] = useState<number>(9.6);
  const [measuredPH, setMeasuredPH] = useState<number>(6.25);
  const [alcoholTestResult, setAlcoholTestResult] = useState<"Pozitif (Pıhtılaşma Var)" | "Negatif (Sağlam)">("Pozitif (Pıhtılaşma Var)");
  const [coolingBreakdownHours, setCoolingBreakdownHours] = useState<number>(14);
  const [peakTemperatureC, setPeakTemperatureC] = useState<number>(21.5);
  const [disposalCostTL, setDisposalCostTL] = useState<number>(6500);
  const [freightCostTL, setFreightCostTL] = useState<number>(12000);
  const [spoilReportText, setSpoilReportText] = useState<string | null>(null);

  const spoilTotalLoss = useMemo(() => {
    const rawMilkValue = spoilMilkLiters * spoilLiterPrice;
    return rawMilkValue + disposalCostTL + freightCostTL;
  }, [spoilMilkLiters, spoilLiterPrice, disposalCostTL, freightCostTL]);

  const handleGenerateSpoilReport = () => {
    const text = `T.C. HUKUK MAHKEMESİ SAYIN HAKİMLİĞİ'NE

DOSYA KONUSU: Soğuk Zincir Kırılması Kaynaklı Çiğ Sütün Ekşimesi ve İmha/Döküm Maddi Tazminat Hesabı

1. BİLİMSEL İNCELEME VE BOZULMA MEKANİZMASI:
Çiğ inek sütü sağım sonrasında 2 saat içerisinde +4 °C'ye soğutulmalı ve nakliye/depolama süresince bu sıcaklık muhafaza edilmelidir. Süt sıcaklığının +10 °C'nin üzerine çıkması halinde mezofilik laktik asit bakterileri geometrik olarak çoğalarak süt şekerini (laktoz) laktik asite dönüştürür. Titrasyon asitliğinin 8.0 °SH üzerine çıkması ve pH'nın 6.50'nin altına düşmesi halinde sütün kazein miselleri stabilitesini kaybeder ve süt ısıyla pıhtılaşır (kaynama testi kesilir).

2. TESPİT EDİLEN BOZULMA VERİLERİ:
- Taşıyıcı Tanker Frigofirik Arıza Süresi: ${coolingBreakdownHours} Saat
- Datalogger (Sıcaklık Kayıt) Tepe Sıcaklığı: +${peakTemperatureC} °C
- Fabrika Girişinde Ölçülen Asitlik: ${measuredAcidity} °SH (Azami Yasal Kabul Sınırı: 7.5 °SH)
- Ölçülen pH Değeri: ${measuredPH} (Normal: 6.60 - 6.80)
- %68'lik Etil Alkol Pıhtılaşma Testi: ${alcoholTestResult}

3. MADDİ ZARAR KALEMLERİ:
- Bozulup İmha Edilen Çiğ Süt Miktarı: ${spoilMilkLiters.toLocaleString("tr-TR")} Litre
- Çiğ Süt Satış / Alım Değeri: ₺${(spoilMilkLiters * spoilLiterPrice).toLocaleString("tr-TR")}
- Tank Temizliği ve Çevre Mevzuatına Göre Bertaraf Gideri: ₺${disposalCostTL.toLocaleString("tr-TR")}
- Atıl Kalan Nakliye / Navlun Bedeli: ₺${freightCostTL.toLocaleString("tr-TR")}
- TOPLAM NET TEKNİK ZARAR: ₺${spoilTotalLoss.toLocaleString("tr-TR")}

4. HMK 279 UYUMLU TEKNİK KANAAT:
Laboratuvar analiz raporu ve fabrika ret tutanağı doğrultusunda; sütün ${coolingBreakdownHours} saat boyunca +${peakTemperatureC} °C sıcaklığa maruz kalması ile ${measuredAcidity} °SH seviyesindeki asitlik artışı ve alkol testi pıhtılaşması arasında tam bir bilimsel nedensellik (illiyet) bağı mevcuttur. Sütün teknolojik olarak işlenmesi imkansız hale gelmiş olup imhası teknik olarak zorunludur. Toplam zarar ₺${spoilTotalLoss.toLocaleString("tr-TR")} olarak hesaplanmıştır.`;

    setSpoilReportText(text);
    showToast("✅ Soğuk zincir döküm zararı raporu hazırlandı");
  };

  // -------------------------------------------------------------------
  // SEKME 4: SÜT TAĞŞİŞ VE HİLE KÜTÜPHANESİ & YARGITAY İÇTİHATLARI
  // -------------------------------------------------------------------
  const [searchIctihat, setSearchIctihat] = useState("");
  const filteredIctihat = useMemo(() => {
    if (!searchIctihat.trim()) return SUT_ICTIHAT_DB;
    const q = searchIctihat.toLowerCase();
    return SUT_ICTIHAT_DB.filter(
      (c) =>
        c.konu.toLowerCase().includes(q) ||
        c.ozet.toLowerCase().includes(q) ||
        c.anahtar.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchIctihat]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Rapor metni panoya kopyalandı");
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* BAŞLIK & METODOLOJİ BANNERI */}
      <div className="bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Milk size={260} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-400/20 text-sky-200 border border-sky-400/30 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-sky-300" />
              TÜRK GIDA KODEKSİ ÇİĞ SÜT & PEYNİR TEBLİĞİ UYUMLU
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-400/20 text-blue-200 border border-blue-400/30">
              HORTVET KRİYOSKOPİ & RANDIMAN MOTORU
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
              02.06 SÜT TEKNOLOJİSİ BİLİRKİŞİLİĞİ
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Süt Teknolojisi & Mandıra Bilirkişilik Modülü
            </h1>
            <p className="text-sky-100/90 text-sm md:text-base max-w-3xl mt-1.5 leading-relaxed">
              Çiğ sütte donma noktası ile su katma tespiti (Kriyoskopi), mandıra peynir ve tereyağı
              randıman/fire açığı hesabı, soğuk zincir kırılması ekşime zararı ve Yargıtay emsal içtihatları.
            </p>
          </div>

          {/* Alt Sekme Butonları */}
          <div className="pt-2 flex flex-wrap gap-2">
            {[
              { id: "kriyoskopi", label: "Donma Noktası (Su Katma)", icon: <Thermometer size={14} /> },
              { id: "randiman", label: "Peynir & Tereyağı Randımanı", icon: <Scale size={14} /> },
              { id: "sogukZincir", label: "Soğuk Zincir & Ekşime Zararı", icon: <AlertOctagon size={14} /> },
              { id: "tagsisRehber", label: "Tağşiş Kılavuzu & İçtihatlar", icon: <FileText size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  activeTab === tab.id
                    ? "bg-white text-blue-900 border-white shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEKME 1: KRİYOSKOPİK DONMA NOKTASI VE SU KATMA HESAPLAYICISI */}
      {activeTab === "kriyoskopi" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Thermometer className="text-sky-600" />
                Hortvet Formülü ile Çiğ Sütte Su Katma (Kriyoskopi) Hesaplayıcısı
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Türk Gıda Kodeksi Çiğ Süt Tebliği'ne göre donma noktasının -0.520 °C'nin üzerine çıkması süte su katıldığının yasal kanıtıdır.
              </p>
            </div>

            {/* Giriş Parametreleri */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ölçülen Donma Noktası (°C)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={measuredFreezingPoint}
                  onChange={(e) => setMeasuredFreezingPoint(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: -0.520 ila -0.550</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teslim Edilen Toplam Süt (Litre)
                </label>
                <input
                  type="number"
                  value={totalDeliveredLiters}
                  onChange={(e) => setTotalDeliveredLiters(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Çiğ Süt Birim Fiyatı (₺/Litre)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={milkLiterPrice}
                  onChange={(e) => setMilkLiterPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Yasal Eşik Referans (°C)
                </label>
                <input
                  type="number"
                  step="0.005"
                  value={referenceFP}
                  onChange={(e) => setReferenceFP(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">TGK Normu: -0.520</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ölçülen Süt Yağı (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measuredFatPct}
                  onChange={(e) => setMeasuredFatPct(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">TGK Asgari: %3.50</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Yağsız Kuru Madde (YKM %)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measuredSnfPct}
                  onChange={(e) => setMeasuredSnfPct(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">TGK Asgari: %8.50</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titrasyon Asitliği (°SH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measuredAciditySH}
                  onChange={(e) => setMeasuredAciditySH(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 6.0 - 7.5 °SH</span>
              </div>
            </div>

            {/* Canlı Hesaplama Sonuç Kartı */}
            <div
              className={`p-6 rounded-2xl border ${
                waterCalc.isAdulterated
                  ? "bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-900/60"
                  : "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60"
              } space-y-4`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                      waterCalc.isAdulterated ? "bg-red-600 shadow-lg shadow-red-500/20" : "bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    }`}
                  >
                    {waterCalc.isAdulterated ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {waterCalc.isAdulterated
                        ? `Süte %${waterCalc.waterPct} Oranında Harici Su Katıldığı Saptanmıştır`
                        : "Süt Standartlara Uygundur (Su Katma Yok)"}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Hortvet Eşitliği: Donma Noktası Sapması = {Math.abs(referenceFP - measuredFreezingPoint).toFixed(3)} °C
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateKriyoskopiReport}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
                >
                  <Sparkles size={14} /> Bilirkişi Rapor Metnini Hazırla
                </button>
              </div>

              {/* Rakamlar Tablosu */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Katılan Su Oranı
                  </span>
                  <span className="text-xl font-extrabold text-red-600 dark:text-red-400">
                    %{waterCalc.waterPct}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Katılan Su Miktarı
                  </span>
                  <span className="text-xl font-extrabold text-red-600 dark:text-red-400">
                    {waterCalc.addedWaterLiters.toLocaleString("tr-TR")} Litre
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Fiili Saf Süt
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {waterCalc.pureMilkLiters.toLocaleString("tr-TR")} Litre
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Kesilecek Tenzilat Bedeli
                  </span>
                  <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">
                    ₺{waterCalc.deductionAmountTL.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <b>Teknik Değerlendirme:</b> {waterCalc.statusText}
              </p>
            </div>

            {/* Üretilen Bilirkişi Raporu */}
            {kriyoskopiReportText && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck size={15} className="text-emerald-600" />
                    Hazır Bilirkişi Rapor Metni (Mahkemeye Sunulabilir)
                  </h4>
                  <button
                    onClick={() => handleCopyText(kriyoskopiReportText)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Copy size={13} /> Raporu Kopyala
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed">
                  {kriyoskopiReportText}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 2: MANDIRA ÜRÜN RANDIMAN VE EKSİK ÜRÜN (FİRE) HESAPLAYICISI */}
      {activeTab === "randiman" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="text-blue-600" />
                Mandıra Mamul Ürün Randıman & Fire / Üretim Açığı Hesaplayıcısı
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fason peynir ve tereyağı üretiminde teslim edilen çiğ süte göre ne kadar mamul çıkması gerektiğini bilimsel normlarla hesaplar.
              </p>
            </div>

            {/* Ürün Seçici Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MANDIRA_RANDIMAN_CETVELI.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedYieldId(item.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedYieldId === item.id
                      ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                    {item.kategori}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                    {item.urunAdi}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    1 kg için <b>{item.sutIhtiyaciKg} kg</b> süt
                  </div>
                </div>
              ))}
            </div>

            {/* Girdi Formu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  İşlenen Çiğ Süt Miktarı (kg / Litre)
                </label>
                <input
                  type="number"
                  value={processedMilkKg}
                  onChange={(e) => setProcessedMilkKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teslim Edilen / Gerçekleşen Mamul (kg)
                </label>
                <input
                  type="number"
                  value={actualProducedKg}
                  onChange={(e) => setActualProducedKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mamul Satış Piyasa Fiyatı (₺/kg)
                </label>
                <input
                  type="number"
                  value={productUnitPriceTL}
                  onChange={(e) => setProductUnitPriceTL(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            {/* Randıman Sonuç Paneli */}
            <div
              className={`p-6 rounded-2xl border ${
                yieldCalc.isDeficitAbnormal
                  ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60"
                  : "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60"
              } space-y-4`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                      yieldCalc.isDeficitAbnormal
                        ? "bg-amber-600 shadow-lg shadow-amber-500/20"
                        : "bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    }`}
                  >
                    <Scale size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {yieldCalc.isDeficitAbnormal
                        ? `Anormal Randıman Açığı: ${yieldCalc.deficitKg.toLocaleString("tr-TR")} kg Eksik Mamul`
                        : "Üretim Normatif Randıman Standartlarına Uygundur"}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Standart Katsayı: 1 kg {selectedYieldItem.urunAdi} için {selectedYieldItem.sutIhtiyaciKg} kg süt (Teknolojik Fire Limiti: %{selectedYieldItem.tipikFirePct})
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateYieldReport}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
                >
                  <Sparkles size={14} /> Randıman Rapor Metnini Hazırla
                </button>
              </div>

              {/* Rakamlar Tablosu */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Beklenen Normatif Üretim
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    {yieldCalc.expectedProductKg.toLocaleString("tr-TR")} kg
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Gerçekleşen İmalat
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    {actualProducedKg.toLocaleString("tr-TR")} kg
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Eksik Mamul Miktarı
                  </span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                    {yieldCalc.deficitKg.toLocaleString("tr-TR")} kg (%{yieldCalc.deficitPct})
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Maddi Tazminat / Fark Tutarı
                  </span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    ₺{yieldCalc.yieldLossAmountTL.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <b>Teknik Sonuç:</b> {yieldCalc.evaluationText}
              </p>
            </div>

            {/* Üretilen Bilirkişi Raporu */}
            {yieldReportText && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck size={15} className="text-emerald-600" />
                    Hazır Bilirkişi Rapor Metni (Fason Üretim / Randıman Uyuşmazlığı)
                  </h4>
                  <button
                    onClick={() => handleCopyText(yieldReportText)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Copy size={13} /> Raporu Kopyala
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed">
                  {yieldReportText}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 3: SOĞUK ZİNCİR KIRILMASI, ASİTLİK (°SH) VE DÖKÜM ZARARI */}
      {activeTab === "sogukZincir" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="text-red-600" />
                Soğuk Zincir Bozulması, Asitlik (°SH) & Döküm / Zayiat Hesabı
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tanker arızası, elektrik kesintisi veya nakliye gecikmesinde sütün ekşimesi (asitlik artışı) sebebiyle meydana gelen döküm zararı.
              </p>
            </div>

            {/* Girdi Formu */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bozulan / Dökülen Süt (Litre)
                </label>
                <input
                  type="number"
                  value={spoilMilkLiters}
                  onChange={(e) => setSpoilMilkLiters(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Çiğ Süt Alım Fiyatı (₺/Litre)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={spoilLiterPrice}
                  onChange={(e) => setSpoilLiterPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                  Ölçülen Asitlik (°SH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measuredAcidity}
                  onChange={(e) => setMeasuredAcidity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-xs font-bold text-red-700 dark:text-red-300 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Kritik Sınır: &gt; 8.0 °SH</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ölçülen pH Değeri
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={measuredPH}
                  onChange={(e) => setMeasuredPH(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 6.60 - 6.80</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Soğutma Kesinti Süresi (Saat)
                </label>
                <input
                  type="number"
                  value={coolingBreakdownHours}
                  onChange={(e) => setCoolingBreakdownHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ulaşılan Tepe Sıcaklığı (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={peakTemperatureC}
                  onChange={(e) => setPeakTemperatureC(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Zorunlu Saklama: +4 °C</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alkol / Kaynatma Testi
                </label>
                <select
                  value={alcoholTestResult}
                  onChange={(e) => setAlcoholTestResult(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Pozitif (Pıhtılaşma Var)">Pozitif (Pıhtılaşma Var - Kesik)</option>
                  <option value="Negatif (Sağlam)">Negatif (Sağlam - Kesilme Yok)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  İmha / Bertaraf Masrafı (₺)
                </label>
                <input
                  type="number"
                  value={disposalCostTL}
                  onChange={(e) => setDisposalCostTL(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Atıl Nakliye / Navlun (₺)
                </label>
                <input
                  type="number"
                  value={freightCostTL}
                  onChange={(e) => setFreightCostTL(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            {/* Zarar Sonuç Kartı */}
            <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-300 dark:border-red-900/60 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-500/20 shrink-0">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Toplam Döküm ve Ekşime Zararı: ₺{spoilTotalLoss.toLocaleString("tr-TR")}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {coolingBreakdownHours} saat +{peakTemperatureC} °C sıcaklık etkisiyle asitlik {measuredAcidity} °SH seviyesine çıkmış ve süt pıhtılaşmıştır.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateSpoilReport}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
                >
                  <Sparkles size={14} /> Döküm Zararı Raporunu Hazırla
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Dökülen Çiğ Süt Değeri
                  </span>
                  <span className="text-xl font-extrabold text-red-600 dark:text-red-400">
                    ₺{(spoilMilkLiters * spoilLiterPrice).toLocaleString("tr-TR")}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Bertaraf / Arıtma Gideri
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    ₺{disposalCostTL.toLocaleString("tr-TR")}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    Boşa Giden Navlun
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    ₺{freightCostTL.toLocaleString("tr-TR")}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                    TOPLAM NET TAZMİNAT
                  </span>
                  <span className="text-2xl font-black text-red-700 dark:text-red-400">
                    ₺{spoilTotalLoss.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Üretilen Bilirkişi Raporu */}
            {spoilReportText && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck size={15} className="text-emerald-600" />
                    Hazır Bilirkişi Rapor Metni (Soğuk Zincir / Tanker Arızası Davası)
                  </h4>
                  <button
                    onClick={() => handleCopyText(spoilReportText)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Copy size={13} /> Raporu Kopyala
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed">
                  {spoilReportText}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 4: TAĞŞİŞ KÜTÜPHANESİ, YASAL NORMLAR VE İÇTİHATLAR */}
      {activeTab === "tagsisRehber" && (
        <div className="space-y-6">
          {/* TGK Çiğ Süt Normları Tablosu */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="text-sky-600" />
              Türk Gıda Kodeksi Çiğ Süt Kalite ve Kabul Kriterleri (TS 1018)
            </h3>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Parametre</th>
                    <th className="p-3">Yasal Standart Değer</th>
                    <th className="p-3">Mevzuat</th>
                    <th className="p-3">Bilirkişi Teknik Açıklaması</th>
                    <th className="p-3">Hukuki Sonuç</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {TGK_CIG_SUT_NORMLARI.map((norm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                        {norm.parametre}
                      </td>
                      <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                        {norm.standartAralik} {norm.birim}
                      </td>
                      <td className="p-3 text-slate-500">{norm.yasalMevzuat}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{norm.aciklama}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {norm.hukukiSonuc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tağşiş ve Hile Türleri Kartları */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-600" />
              Süt ve Süt Ürünlerinde Yaygın Tağşiş / Hile Metotları ve Bilirkişi Tespiti
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUT_TAGSIS_DB.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2 text-xs"
                >
                  <span className="font-extrabold text-red-600 dark:text-red-400 block text-sm">
                    {t.hileTuru}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    <b>Amaç:</b> {t.amac}
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <b>Tespit Yöntemi:</b> {t.tespitYontemi}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <b>Hukuki Yaptırım:</b> {t.cezaiVeHukukiYaptirim}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Yargıtay İçtihatları */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="text-indigo-600" />
                  Süt ve Süt Ürünleri Yargıtay Emsal Kararları
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kriyoskopi, fason kaşar randımanı ve soğuk zincir bozulması uyuşmazlıklarında bağlayıcı içtihatlar.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="İçtihatlarda ara (kriyoskopi, kaşar...)"
                  value={searchIctihat}
                  onChange={(e) => setSearchIctihat(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredIctihat.map((ict, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {ict.daire} - E. {ict.esas} / K. {ict.karar} (T: {ict.tarih})
                    </span>
                    <button
                      onClick={() => handleCopyText(`${ict.daire} - E. ${ict.esas} / K. ${ict.karar}\n\nKonu: ${ict.konu}\n\nÖzet: ${ict.ozet}`)}
                      className="text-slate-400 hover:text-indigo-600 p-1 flex items-center gap-1 text-[11px]"
                    >
                      <Copy size={12} /> Kopyala
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{ict.konu}</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ict.ozet}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ict.anahtar.map((k, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

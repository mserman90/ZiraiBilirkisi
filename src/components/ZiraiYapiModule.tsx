import React, { useState, useMemo } from "react";
import {
  Building2,
  Calculator,
  Copy,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Warehouse,
  Percent,
} from "lucide-react";
import {
  ZIRAI_YAPI_TESIS_DB,
  ZiraiYapiBilgi,
  hesaplaZiraiYapiAmortisman,
} from "../data/ziraatRehberiData";

interface ZiraiYapiModuleProps {
  showToast: (msg: string) => void;
  onSendToReport?: (text: string) => void;
}

export default function ZiraiYapiModule({
  showToast,
  onSendToReport,
}: ZiraiYapiModuleProps) {
  const [selectedYapiId, setSelectedYapiId] = useState<string>("cam_sera");
  const [yapiAlani, setYapiAlani] = useState<number>(500);
  const [yapiYasi, setYapiYasi] = useState<number>(6);

  const selectedYapi = useMemo(
    () =>
      ZIRAI_YAPI_TESIS_DB.find((y) => y.id === selectedYapiId) ||
      ZIRAI_YAPI_TESIS_DB[0],
    [selectedYapiId]
  );

  const hesapSonucu = useMemo(() => {
    return hesaplaZiraiYapiAmortisman(selectedYapiId, yapiAlani, yapiYasi);
  }, [selectedYapiId, yapiAlani, yapiYasi]);

  const teknikRaporParagrafi = useMemo(() => {
    return `ZİRAİ YAPI VE TESİS DEĞERLEMESİ (ÇŞB VE ZMO AMORTİSMAN HESABI):
Dava konusu taşınmaz üzerinde yer alan ${yapiAlani} m² yüzölçümlü ${selectedYapi.ad} vasfındaki zirai tesis üzerinde yapılan incelemede;
1. Tesisin keşif tarihindeki fiziki durumu, taşıyıcı iskelet profili ve kullanım fonksiyonu itibarıyla ${yapiYasi} yaşında olduğu saptanmıştır.
2. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Yapı Yaklaşık Birim Maliyetleri Cetveli uyarınca keşif tarihindeki m² birim inşa bedeli ₺${selectedYapi.birimMaliyetTLM2.toLocaleString("tr-TR")} olarak alınmış olup yeniden inşa bedeli: ${yapiAlani} m² × ₺${selectedYapi.birimMaliyetTLM2.toLocaleString("tr-TR")} = ₺${hesapSonucu.yenidenInsaDegeriTL.toLocaleString("tr-TR")} olarak hesaplanmıştır.
3. TMMOB Ziraat Mühendisleri Odası Bilirkişilik Rehberi Amortisman Normları uyarınca yıllık %${selectedYapi.yillikAmortismanPct} esasıyla ${yapiYasi} yıllık kullanım karşılığı %${hesapSonucu.yipranmaOraniPct} yıpranma payı (₺${hesapSonucu.yipranmaTutariTL.toLocaleString("tr-TR")}) tenzil edilmiştir.
4. Tesisin yıpranmış net yapı kıymeti: ₺${hesapSonucu.yipranmisKiymetTL.toLocaleString("tr-TR")} olarak belirlenmiştir. (Tesisin yıkımı halinde enkaz/hurda kurtarma değeri yaklaşık ₺${hesapSonucu.enkazHurdaDegeriTL.toLocaleString("tr-TR")}'dir).

Hususları teknik tespit olarak Sayın Mahkemenin takdirlerine saygıyla arz olunur.`;
  }, [selectedYapi, yapiAlani, yapiYasi, hesapSonucu]);

  const handleCopy = () => {
    navigator.clipboard.writeText(teknikRaporParagrafi).then(() => {
      showToast("📋 Yapı amortisman gerekçesi panoya kopyalandı");
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Warehouse size={220} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-400" />
              ÇŞB YAPI YAKLAŞIK BİRİM MALİYETLERİ
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              TMMOB ZMO AMORTİSMAN TABLOSU
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              SERA • AHIR • SAMANLIK • SONDAJ
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Zirai Yapılar, Seralar ve Çiftlik Tesisleri Amortisman Cetveli
          </h2>
          <p className="text-blue-100/90 text-sm md:text-base max-w-3xl leading-relaxed">
            Cam ve plastik seralar, hayvan barınakları, kuyu ve trafo tesisleri, soğuk hava
            depoları ve ihata duvarlarının keşif yılı inşa bedelleri üzerinden yaşa ve malzeme
            türüne bağlı amortisman ve yıpranmış net kıymetini hesaplayın.
          </p>
        </div>
      </div>

      {/* Yapı Türü Seçimi */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              1. Zirai Tesis Türünü Seçin ({ZIRAI_YAPI_TESIS_DB.length} Tesis Tipi)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Resmi ÇŞB ve ZMO Sınıfları
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {ZIRAI_YAPI_TESIS_DB.map((yapi) => (
            <button
              key={yapi.id}
              onClick={() => {
                setSelectedYapiId(yapi.id);
                // Tipik büyüklüğü ayarla
                if (yapi.id === "derin_kuyu_trafo") setYapiAlani(1);
                else if (yapi.kategori === "sera") setYapiAlani(1000);
                else if (yapi.kategori === "barinak") setYapiAlani(300);
                else setYapiAlani(250);
                showToast(`Seçildi: ${yapi.ad}`);
              }}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedYapiId === yapi.id
                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 font-bold shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {yapi.kategori === "sera"
                    ? "Örtüaltı / Sera"
                    : yapi.kategori === "barinak"
                    ? "Hayvan Barınağı"
                    : yapi.kategori === "altyapi"
                    ? "Altyapı & Sulama"
                    : "Depo & Tesis"}
                </span>
                <p className="text-xs mt-0.5 line-clamp-1">{yapi.ad}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>₺{yapi.birimMaliyetTLM2.toLocaleString("tr-TR")}/m²</span>
                <span>Ömür: {yapi.ekonomikOmurYil} yıl</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Parametre Girişi ve Sonuçlar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Parametreler */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Calculator size={15} className="text-blue-600" />
              Tesis Ölçü ve Yaş Bilgileri
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {selectedYapi.id === "derin_kuyu_trafo"
                    ? "Tesis Adedi"
                    : selectedYapi.id === "ihata_duvari_cit"
                    ? "Uzunluk (Metretül - mtül)"
                    : "Yüzölçümü (m²)"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={yapiAlani}
                  onChange={(e) => setYapiAlani(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Yapı Yaşı: <b className="text-blue-700 dark:text-blue-400">{yapiYasi} Yıl</b>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Ekonomik Ömür: {selectedYapi.ekonomikOmurYil} yıl
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={selectedYapi.ekonomikOmurYil}
                  value={yapiYasi}
                  onChange={(e) => setYapiYasi(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>ÇŞB Birim Maliyeti:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₺{selectedYapi.birimMaliyetTLM2.toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Yıllık Amortisman Oranı:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    %{selectedYapi.yillikAmortismanPct} / yıl
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Azami Yıpranma Tavanı:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    %{selectedYapi.azamiYipranmaPct}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-200/80 dark:border-blue-800/40 text-xs space-y-1.5">
            <h5 className="font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} /> Teknik Tanım & Yıpranma Kriteri
            </h5>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {selectedYapi.aciklama}
            </p>
          </div>
        </div>

        {/* SAĞ: Sonuç Kartları ve Rapor Paragrafı */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Yeniden İnşa
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block mt-1">
                ₺{hesapSonucu.yenidenInsaDegeriTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Keşif yılı sıfır bedeli
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Yıpranma Oranı
              </span>
              <span className="text-sm font-extrabold text-amber-600 block mt-1">
                %{hesapSonucu.yipranmaOraniPct}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {yapiYasi} yıllık amortisman
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Yıpranma Payı
              </span>
              <span className="text-sm font-extrabold text-rose-600 block mt-1">
                - ₺{hesapSonucu.yipranmaTutariTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Düşülen amortisman
              </span>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 block">
                Yıpranmış Kıymet
              </span>
              <span className="text-base font-extrabold block mt-1">
                ₺{hesapSonucu.yipranmisKiymetTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-blue-100/80 mt-0.5 block">
                Hükme esas net bedel
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Mahkemeye Sunulmaya Hazır Yapı Gerekçe Paragrafı
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={13} /> Kopyala
                </button>
                {onSendToReport && (
                  <button
                    onClick={() => {
                      onSendToReport(teknikRaporParagrafi);
                      showToast("✅ Yapı hesabı kök rapor taslağına aktarıldı");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <ArrowRight size={13} /> Rapora Aktar
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 max-h-[400px] overflow-y-auto">
              {teknikRaporParagrafi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

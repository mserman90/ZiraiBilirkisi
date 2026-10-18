import React, { useState, useMemo } from "react";
import {
  TreePine,
  Calculator,
  Copy,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Percent,
} from "lucide-react";
import {
  MEYVE_AGACLARI_DB,
  MeyveAgaciBilgi,
  hesaplaAgacTazminati,
} from "../data/ziraatRehberiData";

interface MeyveAgaciModuleProps {
  showToast: (msg: string) => void;
  onSendToReport?: (text: string) => void;
}

export default function MeyveAgaciModule({
  showToast,
  onSendToReport,
}: MeyveAgaciModuleProps) {
  const [selectedTurId, setSelectedTurId] = useState<string>("antep_fistigi");
  const [agacYasi, setAgacYasi] = useState<number>(32);
  const [agacSayisi, setAgacSayisi] = useState<number>(44);
  const [zararDurumu, setZararDurumu] = useState<"tamamen_kurudu" | "kesildi" | "kismi_hasar">("tamamen_kurudu");
  const [hasarOraniPct, setHasarOraniPct] = useState<number>(40);

  const selectedAgac = useMemo(
    () => MEYVE_AGACLARI_DB.find((a) => a.id === selectedTurId) || MEYVE_AGACLARI_DB[0],
    [selectedTurId]
  );

  // Otomatik hesaplama
  const hesapSonucu = useMemo(() => {
    return hesaplaAgacTazminati(
      selectedTurId,
      agacYasi,
      agacSayisi,
      zararDurumu,
      hasarOraniPct
    );
  }, [selectedTurId, agacYasi, agacSayisi, zararDurumu, hasarOraniPct]);

  // Mahkeme Raporu Gerekçe Paragrafı
  const teknikRaporParagrafi = useMemo(() => {
    return `MEYVE AĞACI DEĞERLEMESİ VE ZARAR TAZMİNATI HESABI:
Dava konusu taşınmazda yer alan ${agacSayisi} adet ${selectedAgac.ad} ağacı üzerinde yapılan incelemede;
1. Ağaçların gövde çapları ve fenolojik gelişimleri itibarıyla ${agacYasi} yaşında oldukları ve TMMOB Ziraat Mühendisleri Odası Bilirkişilik Rehberi uyarınca '${hesapSonucu.devre}' evresinde bulundukları saptanmıştır.
2. ${hesapSonucu.metodolojikAciklama}
3. Ağaçların toplam brüt değeri: ${agacSayisi} adet × ₺${hesapSonucu.birimAgacDegeriTL.toLocaleString("tr-TR")}/adet = ₺${hesapSonucu.toplamBrutDegerTL.toLocaleString("tr-TR")} olarak hesaplanmıştır.
${
  zararDurumu === "tamamen_kurudu"
    ? `4. Ağaçların kuruması sebebiyle çiftçinin yapmaktan kurtulduğu budama/ilaçlama bakım masrafı olan ₺${hesapSonucu.tasarrufEdilenMasrafTL.toLocaleString("tr-TR")} ile gövde yakacak odun hurda değeri olan ₺${hesapSonucu.odunHurdaKiymetiTL.toLocaleString("tr-TR")} TBK m. 52/55 uyarınca mahsup edilmiştir.\n5. Sonuç olarak hak sahibine ödenmesi gereken net teknik zarar tutarı: ₺${hesapSonucu.netTazminatTL.toLocaleString("tr-TR")} olarak tespit edilmiştir.`
    : zararDurumu === "kesildi"
    ? `4. Kesilen ağaçların odun hurda bedeli olan ₺${hesapSonucu.odunHurdaKiymetiTL.toLocaleString("tr-TR")} mahsup edilmiş olup net tazminat tutarı: ₺${hesapSonucu.netTazminatTL.toLocaleString("tr-TR")} olarak belirlenmiştir.`
    : `4. Ağaçlarda meydana gelen kısmi verim hasarı (%${hasarOraniPct}) oranında net teknik zarar tutarı: ₺${hesapSonucu.netTazminatTL.toLocaleString("tr-TR")} olarak hesaplanmıştır.`
}
Hususları teknik tespit olarak Sayın Mahkemenin takdirlerine saygıyla arz olunur.`;
  }, [selectedAgac, agacSayisi, agacYasi, hesapSonucu, zararDurumu, hasarOraniPct]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(teknikRaporParagrafi).then(() => {
      showToast("📋 Ağaç tazminat gerekçesi panoya kopyalandı");
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <TreePine size={220} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <TreePine size={14} className="text-emerald-400" />
              ZMO BİLİRKİŞİ REHBERİ (DOÇ. DR. GÖKALP MÜLAYİM)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              4 HAYAT DEVRESİ ESASI
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
              FİLİZ BERBEROĞLU YENİPINAR VAKA 5
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Meyve Ağaçları 4 Devre Değerleme & Kuruyan Ağaç Tazminatı
          </h2>
          <p className="text-emerald-100/90 text-sm md:text-base max-w-3xl leading-relaxed">
            Ziraat mühendisliği değerleme normlarına göre meyve ağaçlarının hayat devresini (Tesis,
            Artış, Normal Mahsul, Eksiliş) otomatik belirleyin; DSİ kanalı sızıntısı, yangın, yol
            kesimi veya elektrik hattı sebebiyle kuruyan/kesilen ağaçların tasarruf masraflarını ve
            odun hurda bedelini mahsup ederek net tazminatı hesaplayın.
          </p>
        </div>
      </div>

      {/* Ağaç Türü Seçimi */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine size={18} className="text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              1. Ağaç Türünü Seçin ({MEYVE_AGACLARI_DB.length} Tür Kayıtlı)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Resmi İl Tarım ve ZMO Normları
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {MEYVE_AGACLARI_DB.map((tur) => (
            <button
              key={tur.id}
              onClick={() => {
                setSelectedTurId(tur.id);
                // Yaşı türün tam verim çağına uyarla
                if (tur.id === "kavak") setAgacYasi(8);
                else setAgacYasi(Math.round(tur.normalMahsulDevresiYil * 0.7));
                showToast(`Seçildi: ${tur.ad}`);
              }}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                selectedTurId === tur.id
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <span className="text-xs">{tur.ad.split("(")[0]}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                Ömür: {tur.ekonomikOmur} yıl
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Hesap Parametreleri ve Sonuçlar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Parametre Girişi (5 Kolon) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Calculator size={15} className="text-emerald-600" />
              Keşif ve Zarar Parametreleri
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Ağaç Yaşı: <b className="text-emerald-700 dark:text-emerald-400">{agacYasi} Yaş</b>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Azami: {selectedAgac.ekonomikOmur} yıl
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={selectedAgac.ekonomikOmur}
                  value={agacYasi}
                  onChange={(e) => setAgacYasi(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Zarar Gören Ağaç Adedi
                </label>
                <input
                  type="number"
                  min={1}
                  value={agacSayisi}
                  onChange={(e) => setAgacSayisi(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Zarar / Hasar Durumu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "tamamen_kurudu", label: "Kurudu" },
                    { id: "kesildi", label: "Kesildi" },
                    { id: "kismi_hasar", label: "Kısmi Hasar" },
                  ].map((z) => (
                    <button
                      key={z.id}
                      onClick={() => setZararDurumu(z.id as any)}
                      className={`py-2 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                        zararDurumu === z.id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>

              {zararDurumu === "kismi_hasar" && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Kısmi Hasar Oranı: <b>%{hasarOraniPct}</b>
                    </label>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    step={5}
                    value={hasarOraniPct}
                    onChange={(e) => setHasarOraniPct(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Türün ZMO 4-Devre Standart Tablosu */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-200/80 dark:border-emerald-800/40 text-xs space-y-2">
            <h5 className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} /> {selectedAgac.ad} 4 Hayat Devresi
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">1. Tesis Devresi:</span>
                <p className="text-slate-600 dark:text-slate-300">0 - {selectedAgac.tesisDevresiYil} Yaş (Maliyet Metodu)</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                <span className="font-bold text-blue-700 dark:text-blue-400">2. Artış Devresi:</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedAgac.tesisDevresiYil + 1} - {selectedAgac.artisDevresiYil} Yaş (Artan Verim)</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                <span className="font-bold text-amber-700 dark:text-amber-400">3. Normal Mahsul:</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedAgac.artisDevresiYil + 1} - {selectedAgac.normalMahsulDevresiYil} Yaş (Tam Verim)</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                <span className="font-bold text-rose-700 dark:text-rose-400">4. Eksiliş Devresi:</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedAgac.normalMahsulDevresiYil + 1} - {selectedAgac.ekonomikOmur} Yaş (Odun Değeri)</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
              {selectedAgac.aciklama}
            </p>
          </div>
        </div>

        {/* SAĞ: Hesaplama Özeti ve Rapor Gerekçesi (7 Kolon) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sonuç Kartları Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Hayat Devresi
              </span>
              <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 block mt-1">
                {hesapSonucu.devre}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {hesapSonucu.kalanOmurYil} yıl kalan ömür
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Ağaç Birim Değeri
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block mt-1">
                ₺{hesapSonucu.birimAgacDegeriTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Adet başı baz kıymet
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mahsuplar (Masraf+Odun)
              </span>
              <span className="text-sm font-extrabold text-rose-600 block mt-1">
                - ₺{(hesapSonucu.tasarrufEdilenMasrafTL + hesapSonucu.odunHurdaKiymetiTL).toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                TBK m.52/55 tenzili
              </span>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
                Net Tazminat
              </span>
              <span className="text-base font-extrabold block mt-1">
                ₺{hesapSonucu.netTazminatTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-emerald-100/80 mt-0.5 block">
                {agacSayisi} ağaç toplamı
              </span>
            </div>
          </div>

          {/* Rapor Gerekçe Metni Paneli */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Mahkemeye Sunulmaya Hazır Teknik Gerekçe Paragrafı
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={13} /> Kopyala
                </button>
                {onSendToReport && (
                  <button
                    onClick={() => {
                      onSendToReport(teknikRaporParagrafi);
                      showToast("✅ Ağaç hesabı kök rapor taslağına aktarıldı");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
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

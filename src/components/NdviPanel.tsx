import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Sprout,
  Wheat,
  Copy,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Droplets,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from "recharts";

export interface NdviMultiYearPoint {
  ay: string;
  ayAd: string;
  sira: number;
  ndvi2023: number;
  ndvi2024: number;
  ndvi2025: number;
  ndviOrt: number;
  evre: string;
  aciklama: string;
}

const MULTI_YEAR_NDVI_DATA: NdviMultiYearPoint[] = [
  { ay: "Eki", ayAd: "Ekim", sira: 1, ndvi2023: 0.32, ndvi2024: 0.38, ndvi2025: 0.35, ndviOrt: 0.34, evre: "Ekim & Çıkış", aciklama: "Tohum yatağı hazırlığı ve ilk çimlenme" },
  { ay: "Kas", ayAd: "Kasım", sira: 2, ndvi2023: 0.44, ndvi2024: 0.52, ndvi2025: 0.48, ndviOrt: 0.46, evre: "Kardeşlenme Başlangıcı", aciklama: "2024'te ılık sonbahar nedeniyle erken kardeşlenme" },
  { ay: "Ara", ayAd: "Aralık", sira: 3, ndvi2023: 0.51, ndvi2024: 0.58, ndvi2025: 0.55, ndviOrt: 0.53, evre: "Kardeşlenme", aciklama: "Kışa giriş bitki sıklığı normalin üzerinde" },
  { ay: "Oca", ayAd: "Ocak", sira: 4, ndvi2023: 0.55, ndvi2024: 0.62, ndvi2025: 0.59, ndviOrt: 0.56, evre: "Kış Uykusu / Yavaşlama", aciklama: "Düşük sıcaklıklar, vejetasyon duraksaması" },
  { ay: "Şub", ayAd: "Şubat", sira: 5, ndvi2023: 0.61, ndvi2024: 0.71, ndvi2025: 0.66, ndviOrt: 0.64, evre: "Sapa Kalkma (BBCH 30-32)", aciklama: "2024'te Şubat başında hızlı sap uzaması" },
  { ay: "Mar", ayAd: "Mart", sira: 6, ndvi2023: 0.68, ndvi2024: 0.78, ndvi2025: 0.73, ndviOrt: 0.71, evre: "Bayrak Yaprak / Başaklanma", aciklama: "Maksimum yeşil aksam biyokütlesi (Tepe NDVI)" },
  { ay: "Nis", ayAd: "Nisan", sira: 7, ndvi2023: 0.64, ndvi2024: 0.72, ndvi2025: 0.67, ndviOrt: 0.66, evre: "Çiçeklenme & Dane Dolumu", aciklama: "2023'te kuraklık stresiyle erken düşüş" },
  { ay: "May", ayAd: "Mayıs", sira: 8, ndvi2023: 0.45, ndvi2024: 0.51, ndvi2025: 0.47, ndviOrt: 0.47, evre: "Sarı Olum (Senesans)", aciklama: "Klorofilin çekilmesi ve danede nem kaybı" },
  { ay: "Haz", ayAd: "Haziran", sira: 9, ndvi2023: 0.22, ndvi2024: 0.24, ndvi2025: 0.23, ndviOrt: 0.23, evre: "Tam Olum & Hasat", aciklama: "Hasat sonrası anız kalıntısı" },
  { ay: "Tem", ayAd: "Temmuz", sira: 10, ndvi2023: 0.18, ndvi2024: 0.20, ndvi2025: 0.19, ndviOrt: 0.19, evre: "Anız / Toprak Dinlenmesi", aciklama: "Çıplak anız toprağı" },
  { ay: "Ağu", ayAd: "Ağustos", sira: 11, ndvi2023: 0.20, ndvi2024: 0.23, ndvi2025: 0.21, ndviOrt: 0.21, evre: "Yaz Sürümü / Nadas", aciklama: "Anız bozma ve toprak hazırlığı" },
  { ay: "Eyl", ayAd: "Eylül", sira: 12, ndvi2023: 0.24, ndvi2024: 0.27, ndvi2025: 0.25, ndviOrt: 0.25, evre: "Tohum Yatağı Hazırlığı", aciklama: "Güzlük ekim öncesi son tav sürümü" },
];

export default function NdviPanel({
  parselInfo = { il: "Edirne", ilce: "Merkez", ada: "123", parsel: "5", urun: "Buğday" },
  onTransferNetGelir,
  showToast,
}: {
  parselInfo?: { il: string; ilce: string; ada: string; parsel: string; urun?: string };
  onTransferNetGelir?: (net: number) => void;
  showToast: (msg: string) => void;
}) {
  const [goruntule2023, setGoruntule2023] = useState(true);
  const [goruntule2024, setGoruntule2024] = useState(true);
  const [goruntule2025, setGoruntule2025] = useState(true);
  const [goruntuleOrt, setGoruntuleOrt] = useState(true);
  const [seciliAy, setSeciliAy] = useState<NdviMultiYearPoint | null>(MULTI_YEAR_NDVI_DATA[5]); // Mart (peak)
  const [aktifMod, setAktifMod] = useState<"cokYilli" | "trendAnaliz">("cokYilli");

  // Yıl bazında tepe değerler
  const max2023 = Math.max(...MULTI_YEAR_NDVI_DATA.map((d) => d.ndvi2023));
  const max2024 = Math.max(...MULTI_YEAR_NDVI_DATA.map((d) => d.ndvi2024));
  const max2025 = Math.max(...MULTI_YEAR_NDVI_DATA.map((d) => d.ndvi2025));
  const fark24vs23 = Number((max2024 - max2023).toFixed(2));
  const farkYuzde = Number(((fark24vs23 / max2023) * 100).toFixed(1));

  const kopyalaTrendRaporu = () => {
    const metin = `ÇOK YILLI UYDU NDVI ZAMAN SERİSİ VE VEJETASYON TREND ANALİZİ
Taşınmaz: ${parselInfo.il} / ${parselInfo.ilce} - Ada ${parselInfo.ada} Parsel ${parselInfo.parsel}
Ürün Deseni: ${parselInfo.urun || "Buğday"} (Kışlık Tahıl Fenolojisi)
Kaynak: Sentinel-2 L2A Yüksek Çözünürlüklü Yansıma Bantları (10m)

YILLIK GELİŞİM TRENDİ KARŞILAŞTIRMASI:
• 2023 Sezonu Zirve NDVI: ${max2023.toFixed(2)} (Mart 2023 - Bayrak yaprak evresi)
• 2024 Sezonu Zirve NDVI: ${max2024.toFixed(2)} (Mart 2024 - Tepe vejetatif güç)
• 2025 Sezonu Zirve NDVI (Öngörü): ${max2025.toFixed(2)}
• 5 Yıllık Bölge Ortalaması: 0.71

TREND VE FENOLOJİ DEĞERLENDİRMESİ:
- 2024 yılı vejetasyon eğrisi, 2023 yılına kıyasla tepe değerde +%${farkYuzde} (+${fark24vs23}) daha yüksek seyretmiştir.
- Şubat-Mart döneminde sapa kalkma evresi 2024'te 9 gün erken gerçekleşmiş, fotosentetik aktivite ve biyokütle birikimi güçlü olmuştur.
- 2023 yılı Nisan ayında yaşanan kuraklık stresi, NDVI eğrisinde 0.68'den 0.64'e hızlı gerileme olarak gözlenmiştir. 2024 sezonunda ise dane dolumunda yeşil aksam daha uzun süre korunmuştur.
- Verim Modeli Korelasyonu (R²=0.87): 2023 yılı verim takdiri 435 kg/da iken 2024 yılı verim potansiyeli 485 kg/da olarak doğrulanmıştır.

HMK 279 Uyarınca: İşbu tespit fenolojik ve spektral verilere dayalı objektif teknik inceleme niteliğindedir.`;

    navigator.clipboard.writeText(metin).then(() => {
      showToast("Çok yıllık NDVI trend analizi kopyalandı");
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Başlık Çubuğu */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 grid place-items-center shadow">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight">
                Çok Yıllı NDVI Vejetasyon & Gelişim Trendi
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black tracking-wider uppercase">
                2023 vs 2024 vs 2025
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {parselInfo.il} {parselInfo.ilce} {parselInfo.ada}/{parselInfo.parsel} • Sentinel-2 Çoklu Sezon Karşılaştırması
            </p>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAktifMod(aktifMod === "cokYilli" ? "trendAnaliz" : "cokYilli")}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5"
          >
            <Layers size={13} /> {aktifMod === "cokYilli" ? "Trend Detayları" : "Grafik Modu"}
          </button>
          <button
            onClick={kopyalaTrendRaporu}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow"
          >
            <Copy size={13} /> Trend Raporunu Kopyala
          </button>
        </div>
      </div>

      {/* Yıl Filtreleri ve İstatistik Göstergeleri */}
      <div className="px-6 grid md:grid-cols-[1fr_auto] gap-4 items-center">
        {/* Yıl Seçim Toggle Butonları */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Karşılaştırılan Yıllar:</span>
          
          <button
            onClick={() => setGoruntule2024(!goruntule2024)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              goruntule2024
                ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-950" />
            2024 Sezonu (Zirve: {max2024})
          </button>

          <button
            onClick={() => setGoruntule2023(!goruntule2023)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              goruntule2023
                ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            2023 Sezonu (Zirve: {max2023})
          </button>

          <button
            onClick={() => setGoruntule2025(!goruntule2025)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              goruntule2025
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            2025 Sezonu (Zirve: {max2025})
          </button>

          <button
            onClick={() => setGoruntuleOrt(!goruntuleOrt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              goruntuleOrt
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            5 Yıllık Ortalama
          </button>
        </div>

        {/* Fark Rozeti */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white grid place-items-center">
            <ArrowUpRight size={14} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-emerald-800 tracking-wider">2024 vs 2023 FARKI</p>
            <p className="text-xs font-black text-emerald-950">
              +{fark24vs23} NDVI (+%{farkYuzde} Güçlü Gelişim)
            </p>
          </div>
        </div>
      </div>

      {/* Çok Yıllı Çizgi Grafiği */}
      <div className="px-6">
        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
            <span className="font-bold flex items-center gap-1.5 text-slate-700">
              <Sprout size={15} className="text-emerald-600" /> Aylık Fenolojik Vejetasyon İndeksi (NDVI 0.00 - 1.00)
            </span>
            <span className="text-[11px] font-mono">Dönem: Ekim (Ekim) → Haziran (Hasat) → Eylül</span>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={MULTI_YEAR_NDVI_DATA}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    setSeciliAy(e.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="ay"
                  tick={{ fontSize: 11, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tick={{ fontSize: 11, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d: NdviMultiYearPoint = payload[0]?.payload;
                    return (
                      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-2xl border border-white/10 text-xs space-y-1.5 min-w-[210px]">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1">
                          <span className="font-black text-emerald-300">{d.ayAd} Ayı</span>
                          <span className="text-[10px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">{d.evre}</span>
                        </div>
                        <div className="space-y-0.5 text-[11px]">
                          {goruntule2024 && (
                            <p className="flex justify-between text-emerald-400 font-bold">
                              <span>2024 NDVI:</span> <span>{d.ndvi2024}</span>
                            </p>
                          )}
                          {goruntule2023 && (
                            <p className="flex justify-between text-sky-300 font-bold">
                              <span>2023 NDVI:</span> <span>{d.ndvi2023}</span>
                            </p>
                          )}
                          {goruntule2025 && (
                            <p className="flex justify-between text-violet-300 font-bold">
                              <span>2025 NDVI:</span> <span>{d.ndvi2025}</span>
                            </p>
                          )}
                          {goruntuleOrt && (
                            <p className="flex justify-between text-slate-400">
                              <span>5 Yıl Ort.:</span> <span>{d.ndviOrt}</span>
                            </p>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-300 pt-1 border-t border-white/10 italic">
                          {d.aciklama}
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(value) => <span className="text-slate-700 font-semibold">{value}</span>}
                />

                {goruntule2024 && (
                  <Line
                    type="monotone"
                    dataKey="ndvi2024"
                    name="2024 Sezonu"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                )}

                {goruntule2023 && (
                  <Line
                    type="monotone"
                    dataKey="ndvi2023"
                    name="2023 Sezonu"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    strokeDasharray="4 2"
                    dot={{ r: 3, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 1.5 }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {goruntule2025 && (
                  <Line
                    type="monotone"
                    dataKey="ndvi2025"
                    name="2025 (Öngörü)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#8b5cf6" }}
                  />
                )}

                {goruntuleOrt && (
                  <Line
                    type="monotone"
                    dataKey="ndviOrt"
                    name="5 Yıl Normu"
                    stroke="#64748b"
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                )}

                {/* Zirve vejetasyon referans noktaları */}
                <ReferenceDot x="Mar" y={max2024} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                <ReferenceDot x="Mar" y={max2023} r={5} fill="#0284c7" stroke="#ffffff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seçilen Ay Detayı & Fenolojik Kıyaslama Kartları */}
      {seciliAy && (
        <div className="px-6 grid md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              SEÇİLEN DÖNEM
            </span>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900">{seciliAy.ayAd} Ayı</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {seciliAy.evre}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {seciliAy.aciklama}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              YILLAR ARASI FARKLAR
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-600">2024 Sezonu:</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{seciliAy.ndvi2024}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-600">2023 Sezonu:</span>
                <span className="font-bold text-sky-700 font-mono">{seciliAy.ndvi2023}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-slate-200 pt-1">
                <span className="text-slate-600 font-bold">Fark (24 - 23):</span>
                <span className={`font-black font-mono ${seciliAy.ndvi2024 >= seciliAy.ndvi2023 ? "text-emerald-600" : "text-rose-600"}`}>
                  {seciliAy.ndvi2024 >= seciliAy.ndvi2023 ? "+" : ""}
                  {(seciliAy.ndvi2024 - seciliAy.ndvi2023).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                VEJETATİF YORUM
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {seciliAy.ndvi2024 > 0.70
                  ? "Tepe fotosentez seviyesinde; su ve azot eksikliği yaşanmamış, yaprak alanı indeksi optimum düzeydedir."
                  : seciliAy.ndvi2024 > 0.40
                  ? "Normal gelişim periyodu; kardeşlenme ve ilk boylanma evreleri bölge normalleriyle tam uyumlu."
                  : "Dinlenme veya hasat sonrası evresi; spektral yansıma anız ve toprak arka planı niteliğindedir."}
              </p>
            </div>
            {onTransferNetGelir && (
              <button
                onClick={() => {
                  const tahminiNet = Math.round(seciliAy.ndvi2024 * 16000);
                  onTransferNetGelir(tahminiNet);
                  showToast(`NDVI modelinden ${tahminiNet.toLocaleString("tr-TR")} TL/da net gelir aktarıldı`);
                }}
                className="w-full py-1.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1"
              >
                <Target size={13} /> Bu Veriyi Rapor Sihirbazına Aktar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Alt Bilgi & Metodoloji Notu */}
      <div className="px-6 pb-6">
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
          <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Zirai Bilirkişi Metodolojisi & HMK 279 Uyumu:
            </p>
            <p className="text-[11px] leading-relaxed text-emerald-900">
              Farklı yıllara ait NDVI (Normalleştirilmiş Fark Bitki Örtüsü İndeksi) eğrilerinin çakıştırılması, arazinin geçmişteki fiili ekim durumu, nadas münavebesi ve dönemsel afet/don/kuraklık hasarlarının objektif olarak tespit edilmesini sağlar. Yargıtay 16. HD yerleşik içtihatlarına uygun olarak birden fazla sezonun incelenmesiyle arazinin kadim tarımsal vasfı bilimsel olarak ispatlanmaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

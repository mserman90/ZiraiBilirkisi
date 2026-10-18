import React, { useState, useMemo } from "react";
import {
  Scissors,
  Calculator,
  Copy,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Percent,
} from "lucide-react";
import { hesaplaKismiKamulastirma } from "../data/ziraatRehberiData";

interface KismiKamulastirmaModuleProps {
  showToast: (msg: string) => void;
  onSendToReport?: (text: string) => void;
}

export default function KismiKamulastirmaModule({
  showToast,
  onSendToReport,
}: KismiKamulastirmaModuleProps) {
  const [toplamAlan, setToplamAlan] = useState<number>(24500);
  const [kamulastirilanAlan, setKamulastirilanAlan] = useState<number>(4200);
  const [m2Rayici, setM2Rayici] = useState<number>(185);
  const [artik1Alan, setArtik1Alan] = useState<number>(1800);
  const [artik1DDO, setArtik1DDO] = useState<number>(30);
  const [artik2Alan, setArtik2Alan] = useState<number>(18500);
  const [artik2DDO, setArtik2DDO] = useState<number>(10);
  const [ekonomikYararsiz, setEkonomikYararsiz] = useState<boolean>(true);

  // Otomatik artık alan toplamı kontrolü
  const hesapKalan = Math.max(0, toplamAlan - kamulastirilanAlan);

  const hesapSonucu = useMemo(() => {
    return hesaplaKismiKamulastirma({
      parselToplamAlanM2: toplamAlan,
      kamulastirilanAlanM2: kamulastirilanAlan,
      m2RayicBedeliTL: m2Rayici,
      artikParsel1AlanM2: artik1Alan,
      artikParsel1DegerDususuPct: artik1DDO,
      artikParsel2AlanM2: artik2Alan,
      artikParsel2DegerDususuPct: artik2DDO,
      artikParselEkonomikYararsizMi: ekonomikYararsiz,
    });
  }, [
    toplamAlan,
    kamulastirilanAlan,
    m2Rayici,
    artik1Alan,
    artik1DDO,
    artik2Alan,
    artik2DDO,
    ekonomikYararsiz,
  ]);

  const teknikRaporParagrafi = useMemo(() => {
    return `2942 SAYILI KANUN M. 12 UYARINCA KISMİ KAMULAŞTIRMA VE ARTIK PARSEL DEĞER AZALIŞI HESABI:
Dava konusu ${toplamAlan.toLocaleString("tr-TR")} m² yüzölçümlü taşınmazın ${kamulastirilanAlan.toLocaleString("tr-TR")} m²'lik kısmının yol/kanal güzergahı sebebiyle kamulaştırılması neticesinde;
1. Kamulaştırılan ${kamulastirilanAlan.toLocaleString("tr-TR")} m² sahanın net gelir metodu ile saptanan m² birim rayici (₺${m2Rayici.toFixed(2)}) üzerinden mülkiyet kamulaştırma bedeli: ₺${hesapSonucu.kamulastirmaBedeliTL.toLocaleString("tr-TR")} olarak hesaplanmıştır.
2. Taşınmazın kamulaştırma güzergahıyla ikiye bölünmesi sebebiyle arta kalan kuzeydeki ${artik1Alan.toLocaleString("tr-TR")} m²'lik (A) parçasının sivri üçgen forma dönüştüğü, traktör dönüş ve tarımsal mekanizasyon manevra kabiliyetini büyük ölçüde yitirdiği gerekçesiyle %${artik1DDO} oranında değer azalışı (₺${hesapSonucu.artik1DegerKaybiTL.toLocaleString("tr-TR")}) takdir edilmiştir.
3. Arta kalan güneydeki ${artik2Alan.toLocaleString("tr-TR")} m²'lik (B) parçasının ise sulama kanalı/kuyu irtibatından kopması sebebiyle %${artik2DDO} oranında değer azalışı (₺${hesapSonucu.artik2DegerKaybiTL.toLocaleString("tr-TR")}) takdir edilmiştir.
4. 2942 s.K. m. 12/2 uyarınca kamulaştırma bedeline artık parsel değer azalışları eklenerek malike ödenmesi gereken toplam bedel: ₺${hesapSonucu.toplamOdenecekTazminatTL.toLocaleString("tr-TR")} olarak hesaplanmıştır.
${
  ekonomikYararsiz
    ? `\n5. YASAL BİLDİRİM VE TAVSİYE (2942 s.K. m. 12/3):\nKuzeyde arta kalan ${artik1Alan.toLocaleString("tr-TR")} m²'lik parça 5403 sayılı Toprak Koruma Kanunu asgari tarımsal parsel büyüklüğünün altında kaldığından ve geometrik olarak ekonomik tarıma elverişsiz hale geldiğinden, malikin yasal süresi içinde idareye başvurarak TAŞINMAZIN TAMAMININ KAMULAŞTIRILMASINI (Toplam ₺${hesapSonucu.tamamKamulastirmaBedeliTL.toLocaleString("tr-TR")}) talep hakkı bulunduğu mütalaa edilmiştir.`
    : ""
}
Hususları teknik kanaat olarak Sayın Mahkemenin takdirlerine saygıyla arz olunur.`;
  }, [toplamAlan, kamulastirilanAlan, m2Rayici, artik1Alan, artik1DDO, artik2Alan, artik2DDO, ekonomikYararsiz, hesapSonucu]);

  const handleCopy = () => {
    navigator.clipboard.writeText(teknikRaporParagrafi).then(() => {
      showToast("📋 Kısmi kamulaştırma gerekçesi panoya kopyalandı");
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-800 via-red-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Scissors size={220} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-200 border border-rose-400/30 flex items-center gap-1.5">
              <Scissors size={14} className="text-rose-400" />
              2942 SAYILI KANUN MADDE 12
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              ZMO BİLİRKİŞİ REHBERİ BÖLÜM VII/A.2
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
              TAMAMINI KAMULAŞTIRMA TALEBİ (M. 12/3)
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Kısmi Kamulaştırma ve Artık Parsel Değer Azalışı
          </h2>
          <p className="text-rose-100/90 text-sm md:text-base max-w-3xl leading-relaxed">
            Yol, otoyol, kanal veya demiryolu hattının taşınmazı ortadan bölmesi neticesinde arta
            kalan parçalarda meydana gelen geometrik biçimsizlik, mekanizasyon zorluğu ve sulama
            kaybını 2942 s.K. m. 12 çerçevesinde hesaplayın.
          </p>
        </div>
      </div>

      {/* Parametre Girişi ve Hesaplamalar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: Parametreler (5 Kolon) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Calculator size={15} className="text-rose-600" />
              Parsel ve Kamulaştırma Ölçüleri
            </h4>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Toplam Parsel Alanı (m²)
                  </label>
                  <input
                    type="number"
                    value={toplamAlan}
                    onChange={(e) => setToplamAlan(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Kamulaştırılan Alan (m²)
                  </label>
                  <input
                    type="number"
                    value={kamulastirilanAlan}
                    onChange={(e) => setKamulastirilanAlan(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Taşınmazın m² Zirai Rayici (₺/m²)
                </label>
                <input
                  type="number"
                  value={m2Rayici}
                  onChange={(e) => setM2Rayici(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm"
                />
              </div>

              {/* Artık Parsel 1 */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Artık Parça 1 (Kuzey Parçası)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Yüzölçümü (m²)</label>
                    <input
                      type="number"
                      value={artik1Alan}
                      onChange={(e) => setArtik1Alan(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Değer Düşüşü (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={artik1DDO}
                      onChange={(e) => setArtik1DDO(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 font-semibold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Artık Parsel 2 */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Artık Parça 2 (Güney Parçası)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Yüzölçümü (m²)</label>
                    <input
                      type="number"
                      value={artik2Alan}
                      onChange={(e) => setArtik2Alan(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Değer Düşüşü (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={artik2DDO}
                      onChange={(e) => setArtik2DDO(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 font-semibold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Ekonomik Yararsızlık Kutusu */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="yararsizCheck"
                  checked={ekonomikYararsiz}
                  onChange={(e) => setEkonomikYararsiz(e.target.checked)}
                  className="mt-0.5 rounded accent-amber-600 cursor-pointer"
                />
                <label htmlFor="yararsizCheck" className="text-[11px] text-amber-900 dark:text-amber-200 cursor-pointer leading-tight">
                  <b>2942 s.K. m. 12/3 Şartı:</b> Arta kalan kısım geometrisi veya küçüklüğü nedeniyle ekonomik tarıma elverişsiz hale geldi (Malikin tamamının kamulaştırılmasını talep hakkı var).
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: Sonuç ve Rapor Metni (7 Kolon) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Kamulaştırılan Alan
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block mt-1">
                ₺{hesapSonucu.kamulastirmaBedeliTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {kamulastirilanAlan} m² bedeli
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Artık 1 Değer Kaybı
              </span>
              <span className="text-sm font-extrabold text-rose-600 block mt-1">
                + ₺{hesapSonucu.artik1DegerKaybiTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                %{artik1DDO} değer azalışı
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Artık 2 Değer Kaybı
              </span>
              <span className="text-sm font-extrabold text-rose-600 block mt-1">
                + ₺{hesapSonucu.artik2DegerKaybiTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                %{artik2DDO} değer azalışı
              </span>
            </div>

            <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl p-4 text-white shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100 block">
                Toplam Ödenecek
              </span>
              <span className="text-base font-extrabold block mt-1">
                ₺{hesapSonucu.toplamOdenecekTazminatTL.toLocaleString("tr-TR")}
              </span>
              <span className="text-[10px] text-rose-100/80 mt-0.5 block">
                m. 12 nihai tazminat
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-rose-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Mahkemeye Sunulmaya Hazır Kısmi Kamulaştırma Gerekçesi
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
                      showToast("✅ Kısmi kamulaştırma hesabı kök rapora aktarıldı");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
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

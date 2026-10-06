import React, { useState } from "react";
import {
  Monitor,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Lock,
  Building,
  Key,
  Shield,
  CreditCard,
  UserCheck,
  Check,
  Info,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Bell,
  Mail,
  Calendar,
  Clock,
  AlertOctagon,
  RotateCcw,
  Send,
  CheckSquare,
  ShieldAlert,
  Scale,
  Copy,
} from "lucide-react";
import {
  UYAP_BASVURU_ADIMLARI,
  TARIM_UZMANLIK_ALANLARI,
} from "../data/uyapBasvuruData";

export default function UyapSimulatorView({
  showToast,
  onGoToWizard,
}: {
  showToast: (msg: string) => void;
  onGoToWizard: () => void;
}) {
  const [altSekme, setAltSekme] = useState<"kilavuz" | "uzmanlik" | "etebligat" | "teslim" | "udf">("kilavuz");
  const [seciliAdim, setSeciliAdim] = useState(1);

  // Uzmanlık Seçim State (Max 3 temel, max 6 alt alan)
  const [seciliTemelKodlar, setSeciliTemelKodlar] = useState<string[]>(["01"]);
  const [seciliAltKodlar, setSeciliAltKodlar] = useState<string[]>([
    "01.01",
    "01.02",
    "01.05",
  ]);

  // Teslim Simülasyonu
  const [raporYuklendi, setRaporYuklendi] = useState(false);
  const [eImzaAtildi, setEImzaAtildi] = useState(false);

  // E-Tebligat & Süre Takip State
  const [tebligatUlasmaTarihi, setTebligatUlasmaTarihi] = useState<string>("2026-09-15");
  const [verilenSureGun, setVerilenSureGun] = useState<number>(30);
  const [mahkemeAdi, setMahkemeAdi] = useState<string>("Edirne 2. Asliye Hukuk Mahkemesi");
  const [dosyaEsasNo, setDosyaEsasNo] = useState<string>("2026/142 Esas");
  const [ekSureGerekcesi, setEkSureGerekcesi] = useState<string>(
    "İlçe Tarım ve Orman Müdürlüğü'nden resmi maliyet cetvelinin henüz temin edilememiş olması ve meteorolojik verilerin beklenmesi"
  );
  const [hatirlaticiSecili, setHatirlaticiSecili] = useState<Record<string, boolean>>({
    h1: true,
    h2: true,
    h3: false,
    h4: false,
    h5: false,
  });

  const toggleAltAlan = (temelKod: string, altKod: string) => {
    if (seciliAltKodlar.includes(altKod)) {
      setSeciliAltKodlar(seciliAltKodlar.filter((k) => k !== altKod));
      showToast(`${altKod} çıkarıldı`);
    } else {
      if (seciliAltKodlar.length >= 6) {
        showToast("⚠️ Bakanlık Kuralı: En fazla 6 alt uzmanlık alanı seçilebilir!");
        return;
      }
      if (!seciliTemelKodlar.includes(temelKod)) {
        if (seciliTemelKodlar.length >= 3) {
          showToast("⚠️ Bakanlık Kuralı: En fazla 3 temel uzmanlık alanı seçilebilir!");
          return;
        }
        setSeciliTemelKodlar([...seciliTemelKodlar, temelKod]);
      }
      setSeciliAltKodlar([...seciliAltKodlar, altKod]);
      showToast(`✅ ${altKod} uzmanlık alanı eklendi (${seciliAltKodlar.length + 1}/6)`);
    }
  };

  const indirBasvuruDilekcesi = () => {
    const metin = `T.C. ADALET BAKANLIĞI BİLİRKİŞİLİK BÖLGE KURULU BAŞKANLIĞINA
GERÇEK KİŞİ BİLİRKİŞİLİK BAŞVURU FORMU (.UDF SİMÜLASYONU)

Başvuru Yapan: Ziraat Mühendisi
Temel Uzmanlık Alanı: 01 TARIM
Seçilen Alt Uzmanlık Alanları (${seciliAltKodlar.length}/6):
${seciliAltKodlar.map((k) => `- ${k}`).join("\n")}

Mesleki Kıdem: 5+ Yıl (Ziraat Mühendisleri Odası Kayıtlı)
Temel Eğitim Sertifikası: Tamamlandı
E-İmza Doğrulaması: 5070 Sayılı Elektronik İmza Kanununa Uygun Olarak İmzalanmıştır.`;

    const blob = new Blob([metin], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bilirkisilik_Basvuru_Dilekcesi.udf";
    a.click();
    URL.revokeObjectURL(url);
    showToast("📄 UYAP Başvuru Dilekçesi (.udf simülasyonu) indirildi");
  };

  const indirEkSureDilekcesi = () => {
    const metin = `${mahkemeAdi.toUpperCase()} SAYIN HÂKİMLİĞİNE
DOSYA NO: ${dosyaEsasNo}
KONU: Bilirkişi Raporu Tanzimi İçin Ek Süre Talebi (.UDF Formatı)

Sayın Mahkemenizin yukarıda esas numarası yazılı dosyasında Ziraat Bilirkişisi olarak görevlendirilmiş bulunmaktayım.

Tarafıma tanınan süre içerisinde raporun hazırlanması için gerekli incelemelere başlanmış olup; ${ekSureGerekcesi} sebebiyle raporun yasal süresinde tamamlanarak mahkemenize sunulması mümkün olamamıştır.

6100 sayılı Hukuk Muhakemeleri Kanunu'nun 281. maddesi ve 6754 sayılı Bilirkişilik Kanunu hükümleri uyarınca, raporun sıhhatli ve Yargıtay denetimine elverişli şekilde tanzim edilebilmesi amacıyla tarafıma 30 (otuz) gün EK SÜRE verilmesini saygılarımla arz ve talep ederim.

Tarih: ${new Date().toLocaleDateString("tr-TR")}
Bilirkişi: Ziraat Mühendisi
E-İmza: 5070 Sayılı Elektronik İmza Kanunu Uyarınca İmzalanmıştır.`;

    const blob = new Blob([metin], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ek_Sure_Talebi_${dosyaEsasNo.replace(/[^a-zA-Z0-9]/g, "_")}.udf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📄 Ek Süre Talep Dilekçesi (.udf simülasyonu) indirildi");
  };

  // E-Tebligat ve Süre Hesaplama (7201 SK m.7/a)
  const ulasmaDate = new Date(tebligatUlasmaTarihi);
  const tebligSayilmaDate = new Date(ulasmaDate);
  tebligSayilmaDate.setDate(tebligSayilmaDate.getDate() + 5);

  const sonTeslimDate = new Date(tebligSayilmaDate);
  sonTeslimDate.setDate(sonTeslimDate.getDate() + verilenSureGun);

  const bugun = new Date();
  const diffTime = sonTeslimDate.getTime() - bugun.getTime();
  const kalanGun = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-blue-500/30 shadow-xl">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-[40px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[11px] font-bold text-blue-300 tracking-wider mb-3">
              <Monitor size={14} /> ADALET BAKANLIĞI BİLİRKİŞİ PORTAL (bilirkisi.uyap.gov.tr) SİMÜLATÖRÜ
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              UYAP Bilirkişi Portalı Başvuru & Dosya Simülasyonu
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Resmi Başvuru Kılavuzu'na uygun adım adım başvuru simülasyonu, 01 Tarım alt uzmanlık alanı seçimi (max 3 temel, 6 alt alan sınırı), E-Tebligat süre takibi, UYAP Doküman Editörü (.UDF) ve e-imzalı rapor yükleme iş akışı.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shrink-0 min-w-[200px]">
            <p className="text-[10px] font-bold tracking-widest text-blue-200">SEÇİLEN ALT UZMANLIK</p>
            <p className="text-3xl font-black text-white mt-1">
              {seciliAltKodlar.length} <span className="text-lg font-normal text-slate-300">/ 6 Sınır</span>
            </p>
            <p className="text-[11px] text-emerald-300 font-medium mt-1">
              Temel Alan: {seciliTemelKodlar.length} / 3 Sınır
            </p>
          </div>
        </div>
      </div>

      {/* Üst Navigasyon Sekmeleri */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto">
        {[
          { id: "kilavuz", label: "Başvuru Kılavuzu (8 Adım)", icon: FileText },
          { id: "uzmanlik", label: "Uzmanlık Alanı Seçimi (Max 3/6)", icon: UserCheck },
          { id: "etebligat", label: "E-Tebligat & Süre Kontrolü", icon: Bell },
          { id: "teslim", label: "Dosya & Rapor Teslimi", icon: Upload },
          { id: "udf", label: "UYAP Editör (.UDF) Rehberi", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const aktif = altSekme === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAltSekme(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                aktif
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. BAŞVURU KILAVUZU (8 ADIM) */}
      {altSekme === "kilavuz" && (
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* Adım Listesi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Başvuru Aşamaları
            </h4>
            {UYAP_BASVURU_ADIMLARI.map((item) => {
              const aktif = seciliAdim === item.adim;
              return (
                <button
                  key={item.adim}
                  onClick={() => setSeciliAdim(item.adim)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    aktif
                      ? "bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold ${
                        aktif ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.adim}
                    </span>
                    <span className="text-xs line-clamp-1">{item.baslik}</span>
                  </div>
                  <ChevronRight size={14} className={aktif ? "text-blue-600" : "text-slate-300"} />
                </button>
              );
            })}
          </div>

          {/* Adım Detayı */}
          {(() => {
            const current = UYAP_BASVURU_ADIMLARI.find((a) => a.adim === seciliAdim) || UYAP_BASVURU_ADIMLARI[0];
            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    ADIM {current.adim} / 8
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{current.baslik}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{current.aciklama}</p>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Önemli Kural / Uyarı:</p>
                    <p className="mt-0.5 leading-relaxed">{current.uyari}</p>
                  </div>
                </div>

                {/* Görsel/İnteraktif Adım Simülasyonu */}
                {current.adim === 6 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-slate-900">
                      01 TARIM Alt Uzmanlık Alanları Seçimi Simülasyonu:
                    </p>
                    <p className="text-xs text-slate-500">
                      Şu anda {seciliAltKodlar.length} adet alt uzmanlık seçtiniz (İzin verilen tavan: 6).
                    </p>
                    <button
                      onClick={() => setAltSekme("uzmanlik")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition"
                    >
                      Uzmanlık Alanlarını Yönet & Seç
                    </button>
                  </div>
                )}

                {current.adim === 7 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-slate-900">
                      Başvuru Dilekçesini İndirme ve E-İmza ile Gönderme:
                    </p>
                    <p className="text-xs text-slate-500">
                      UYAP Doküman Editörü (.UDF) formatında başvuru dilekçenizi oluşturup indirebilirsiniz.
                    </p>
                    <button
                      onClick={indirBasvuruDilekcesi}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition flex items-center gap-1.5"
                    >
                      <Download size={14} /> Örnek Başvuru Dilekçesini İndir (.udf)
                    </button>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <button
                    disabled={seciliAdim === 1}
                    onClick={() => setSeciliAdim(seciliAdim - 1)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 disabled:opacity-40 rounded-xl text-xs font-bold"
                  >
                    Önceki Adım
                  </button>
                  <button
                    disabled={seciliAdim === UYAP_BASVURU_ADIMLARI.length}
                    onClick={() => setSeciliAdim(seciliAdim + 1)}
                    className="px-4 py-2 bg-slate-900 text-white disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    Sonraki Adım <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. UZMANLIK ALANI SEÇİMİ (3 Temel, 6 Alt Sınırı) */}
      {altSekme === "uzmanlik" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                01 TARIM ve Bağlı Uzmanlık Alanları Seçimi
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Adalet Bakanlığı Kuralı: En fazla <b>3 Temel Uzmanlık Alanı</b> ve en fazla <b>6 Alt Uzmanlık Alanı</b> seçilebilir.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full font-bold">
                Temel: {seciliTemelKodlar.length}/3
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                seciliAltKodlar.length === 6
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}>
                Alt Alan: {seciliAltKodlar.length}/6
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {TARIM_UZMANLIK_ALANLARI.map((temel) => (
              <div key={temel.kod} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs grid place-items-center font-bold">
                      {temel.kod}
                    </span>
                    {temel.ad}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {temel.altAlanlar.length} Alt Uzmanlık Alanı
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {temel.altAlanlar.map((alt) => {
                    const secili = seciliAltKodlar.includes(alt.kod);
                    return (
                      <div
                        key={alt.kod}
                        onClick={() => toggleAltAlan(temel.kod, alt.kod)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                          secili
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border grid place-items-center shrink-0 mt-0.5 ${
                            secili
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-slate-50"
                          }`}
                        >
                          {secili && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/50 px-1 rounded">
                              {alt.kod}
                            </span>
                            <p className="text-xs font-bold leading-snug">{alt.ad}</p>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {alt.arananNitelik}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={indirBasvuruDilekcesi}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Download size={14} /> Seçilen Alanlarla Başvuru Dilekçesi İndir (.udf)
            </button>
          </div>
        </div>
      )}

      {/* E-TEBLİGAT KONTROLÜ VE SÜRE TAKİP SİMÜLASYONU */}
      {altSekme === "etebligat" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Başlık */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
                <Bell size={13} /> 7201 SAYILI TEBLİGAT KANUNU m.7/a & HMK m.281
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Adalet Bakanlığı UETS & UYAP Süre Takip Standartları
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              E-Tebligat Kontrolü, Süre Aşımı Alarmı ve Hak Kaybı İkazı
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Elektronik tebligatın ulaştığı tarihi izleyen <b>beşinci günün sonunda</b> tebliğ edilmiş sayılma kuralı (7201 SK m.7/a), rapor teslim süresi hesaplama simülatörü ve süresinde cevap verilmemesi durumunda doğacak hukuki/cezai hak kayıpları.
            </p>
          </div>

          {/* İnteraktif Tarih & Süre Hesaplayıcı */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={15} className="text-blue-600" /> E-Tebligat ve Rapor Süresi Hesaplama Simülatörü
              </h4>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border">
                7201 SK 5 Gün Kuralı Aktif
              </span>
            </div>

            <div className="grid md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  1. E-Tebligatın Ulaştığı Tarih
                </label>
                <input
                  type="date"
                  value={tebligatUlasmaTarihi}
                  onChange={(e) => setTebligatUlasmaTarihi(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  2. Yasal Tebliğ Sayılma Tarihi (+5 Gün)
                </label>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl font-mono font-bold text-blue-900 text-xs">
                  {tebligSayilmaDate.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  3. Mahkemece Verilen Süre
                </label>
                <div className="flex gap-1.5">
                  {[15, 30, 45, 60].map((gun) => (
                    <button
                      key={gun}
                      onClick={() => setVerilenSureGun(gun)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                        verilenSureGun === gun
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {gun} Gün
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  4. Rapor Son Teslim Tarihi
                </label>
                <div className="p-2.5 bg-slate-900 text-white rounded-xl font-mono font-bold text-xs flex items-center justify-between">
                  <span>{sonTeslimDate.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  <Clock size={14} className="text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Süre Durum Göstergesi */}
            <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
              kalanGun < 0
                ? "bg-rose-50 border-rose-300 text-rose-950"
                : kalanGun <= 7
                ? "bg-amber-50 border-amber-300 text-amber-950"
                : "bg-emerald-50 border-emerald-300 text-emerald-950"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl grid place-items-center text-white font-bold shrink-0 ${
                  kalanGun < 0 ? "bg-rose-600" : kalanGun <= 7 ? "bg-amber-500" : "bg-emerald-600"
                }`}>
                  {kalanGun < 0 ? <AlertOctagon size={20} /> : kalanGun <= 7 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div>
                  <p className="text-xs font-black">
                    {kalanGun < 0
                      ? `SÜRE AŞIMI GERÇEKLEŞTİ! (${Math.abs(kalanGun)} Gün Gecikme)`
                      : kalanGun <= 7
                      ? `KRİTİK UYARI: Son Teslim Tarihine Sadece ${kalanGun} Gün Kaldı!`
                      : `Süre Normal: Rapor Teslimine ${kalanGun} Gün Var`}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
                    {kalanGun < 0
                      ? "Mahkemece disiplin soruşturması, bilirkişi ücretinden kesinti ve sicilden çıkarılma yaptırımları uygulanabilir. Derhal mazeret / ek süre bildiriniz!"
                      : kalanGun <= 7
                      ? "Rapor henüz hazır değilse ceza ve hak kaybına uğramamak için süresi dolmadan önce UYAP üzerinden ek süre talep ediniz."
                      : "7201 sayılı Kanun m.7/a uyarınca 5 günlük yasal bildirim süresi sonrasındaki teslim takvimi işlemeye devam etmektedir."}
                  </p>
                </div>
              </div>

              {kalanGun <= 7 && (
                <button
                  onClick={() => {
                    const el = document.getElementById("ek-sure-dilekce-alani");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-500 whitespace-nowrap"
                >
                  Ek Süre Dilekçesi Hazırla
                </button>
              )}
            </div>
          </div>

          {/* Olası Hak Kayıpları ve Hukuki/Cezai Yaptırımlar Paneli */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-600" /> Süresinde Cevap Verilmemesi Halinde Oluşacak Hak Kayıpları
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-rose-600" /> Bilirkişilik Sicilinden ve Listeden Silinme
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">6754 SK m.13/1-c</span>
                </div>
                <p className="text-[11.5px] text-rose-950 leading-relaxed">
                  Raporunu haklı bir gerekçe olmaksızın belirlenen süre içinde vermeyen veya süreyi alışkanlık haline getirecek şekilde geciktiren bilirkişiler Bölge Bilirkişilik Kurulu kararıyla <b>bilirkişilik listesinden çıkarılır</b>. Listeden çıkarılan bilirkişi en az 3 yıl süreyle yeniden listeye yazılamaz.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-rose-600" /> Bilirkişi Ücretinin İptali veya Kesilmesi
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">HMK m.281/3</span>
                </div>
                <p className="text-[11.5px] text-rose-950 leading-relaxed">
                  Mahkeme hâkimi, raporunu süresinde vermeyen bilirkişinin <b>ücret almamasına</b> veya daha önce peşin yatırılan avansın tamamının ya da bir kısmının mahkeme veznesine iadesine karar verebilir. Rapor geç sunulsa dahi ücretten yoksun bırakılabilir.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Scale size={14} className="text-amber-600" /> Hukuki Tazminat & Rücu Sorumluluğu
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">HMK m.285</span>
                </div>
                <p className="text-[11.5px] text-amber-950 leading-relaxed">
                  Bilirkişinin raporu süresinde vermemesi nedeniyle yargılamanın makul sürede tamamlanamaması ve tarafların zarara uğraması durumunda, Devlet aleyhine açılan tazminat davalarında hükmedilen tazminat <b>kusurlu bilirkişiye rücu edilir</b>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Lock size={14} className="text-amber-600" /> Disiplin Para Cezası ve Görevi İhmal
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">HMK m.274 & TCK m.257</span>
                </div>
                <p className="text-[11.5px] text-amber-950 leading-relaxed">
                  Mahkemece kendisine verilen görevi geçerli mazereti olmaksızın kabul etmeyen veya süresinde teslim etmeyerek celsenin ertelenmesine sebebiyet veren bilirkişi hakkında <b>disiplin para cezasına</b> ve celse masraflarının tahsiline hükmedilebilir.
                </p>
              </div>
            </div>
          </div>

          {/* Hatırlatıcı Kontrol Listesi */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare size={16} className="text-indigo-600" /> Hak Kaybını Önleyici Hatırlatıcı Eylem Listesi
              </h4>
              <span className="text-[10px] text-slate-400">Rutin kontrollerinizi tamamlayın</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: "h1", metin: "UETS (Ulusal Elektronik Tebligat Sistemi) SMS ve E-posta bildirimleri aktif mi?", mevzuat: "UETS Yönetmeliği" },
                { id: "h2", metin: "E-Tebligat ulaştıktan sonra 5 gün dolmadan dosya tensip zaptı ve ara kararları incelendi mi?", mevzuat: "7201 SK m.7/a" },
                { id: "h3", metin: "Arazi keşif tarihi ile rapor teslim tarihi arasındaki süre takvimde işaretlendi mi?", mevzuat: "HMK m.281" },
                { id: "h4", metin: "Resmi kurumlardan (İlçe Tarım, Kadastro, Meteoroloji) belge bekleniyorsa derhal mahkemeye müzekkere yazılması bildirildi mi?", mevzuat: "HMK m.279" },
                { id: "h5", metin: "Rapor teslim süresi yetersiz ise sürenin bitimine en az 7 gün kala UYAP üzerinden ek süre talep dilekçesi verildi mi?", mevzuat: "HMK m.281/2" },
              ].map((h) => {
                const checked = hatirlaticiSecili[h.id] || false;
                return (
                  <label
                    key={h.id}
                    onClick={() => setHatirlaticiSecili({ ...hatirlaticiSecili, [h.id]: !checked })}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                      checked
                        ? "bg-indigo-50/60 border-indigo-300 text-indigo-950 font-medium"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1 flex justify-between items-center gap-2">
                      <span>{h.metin}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border shrink-0">
                        {h.mevzuat}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Acil Durum Ek Süre Talep Dilekçesi Üreticisi */}
          <div id="ek-sure-dilekce-alani" className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2 text-white">
                  <Send size={15} className="text-emerald-400" /> Hızlı Ek Süre Talep Dilekçesi Üretici (HMK m.281)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hak kaybına uğramamak için tek tıkla UYAP uyumlu Ek Süre Talep Dilekçesi oluşturun.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                .UDF & E-İmza Uyumlu
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Mahkeme Adı</label>
                <input
                  type="text"
                  value={mahkemeAdi}
                  onChange={(e) => setMahkemeAdi(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Dosya Esas Numarası</label>
                <input
                  type="text"
                  value={dosyaEsasNo}
                  onChange={(e) => setDosyaEsasNo(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">Gecikme Gerekçesi</label>
                <textarea
                  rows={2}
                  value={ekSureGerekcesi}
                  onChange={(e) => setEkSureGerekcesi(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={indirEkSureDilekcesi}
                className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition flex items-center gap-1.5 shadow"
              >
                <Download size={14} /> Ek Süre Dilekçesini İndir (.udf)
              </button>
              <button
                onClick={() => {
                  const metin = `${mahkemeAdi.toUpperCase()} SAYIN HÂKİMLİĞİNE\nDOSYA NO: ${dosyaEsasNo}\nKONU: Bilirkişi Raporu Tanzimi İçin Ek Süre Talebi\n\nSayın Mahkemenizin yukarıda esas numarası yazılı dosyasında Ziraat Bilirkişisi olarak görevlendirilmiş bulunmaktayım.\n\nTarafıma tanınan süre içerisinde raporun hazırlanması için gerekli incelemelere başlanmış olup; ${ekSureGerekcesi} sebebiyle raporun yasal süresinde tamamlanarak mahkemenize sunulması mümkün olamamıştır.\n\nHMK m.281 ve 6754 sayılı Kanun uyarınca tarafıma 30 gün ek süre verilmesini saygılarımla arz ve talep ederim.\n\nTarih: ${new Date().toLocaleDateString("tr-TR")}\nZiraat Mühendisi Bilirkişi`;
                  navigator.clipboard.writeText(metin).then(() => showToast("Dilekçe metni kopyalandı"));
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Copy size={14} /> Metni Kopyala
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DOSYA & RAPOR TESLİM SİMÜLASYONU */}
      {altSekme === "teslim" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              UYAP BİLİRKİŞİ PORTALI • DOSYA İŞLEMLERİ
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Görevlendirme İnceleme ve Rapor Yükleme Ekranı
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mahkeme tensip zaptını okuma, keşif tarihini inceleme ve hazırlanan raporu e-imzalı olarak UYAP'a gönderme simülatörü.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Edirne 2. Asliye Hukuk Mahkemesi - 2025/142 Esas
                </p>
                <p className="text-[11px] text-slate-500">Dava Türü: Kamulaştırma Bedel Tespiti ve Tescil (2942 SK m.10)</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                GÖREV KABUL EDİLDİ
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border">
                <p className="text-slate-400 font-bold text-[10px]">KEŞİF TARİHİ</p>
                <p className="font-bold text-slate-800 mt-1">15.06.2025 - Saat 10:30</p>
              </div>
              <div className="p-3 bg-white rounded-xl border">
                <p className="text-slate-400 font-bold text-[10px]">RAPOR TESLİM SÜRESİ</p>
                <p className="font-bold text-slate-800 mt-1">30 Gün (Son: 15.07.2025)</p>
              </div>
              <div className="p-3 bg-white rounded-xl border">
                <p className="text-slate-400 font-bold text-[10px]">BİLİRKİŞİ ÜCRETİ</p>
                <p className="font-bold text-emerald-700 mt-1">4.500,00 TL (Yatırıldı)</p>
              </div>
            </div>

            {/* Dosya Yükleme Alanı */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-3 bg-white">
              <Upload size={32} className="mx-auto text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Bilirkişi Raporunu Yükleyin (.udf veya .pdf)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Maksimum 10 MB. Rapor metni ve ekli krokiler tek dosya halinde veya ek evrak olarak gönderilmelidir.
                </p>
              </div>

              {!raporYuklendi ? (
                <button
                  onClick={() => {
                    setRaporYuklendi(true);
                    showToast("Rapor dosyası başarıyla yüklendi");
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Rapor Dosyası Seç (Simülasyon)
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                    <FileCheck size={16} /> Bilirkisi_Raporu_2025_142E.pdf (Yüklendi)
                  </div>
                  <div>
                    {!eImzaAtildi ? (
                      <button
                        onClick={() => {
                          setEImzaAtildi(true);
                          showToast("✅ E-İmza atıldı! Rapor mahkeme kalemine iletildi.");
                        }}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-500 transition flex items-center gap-2 mx-auto"
                      >
                        <Lock size={14} /> 5070 SK Uyarınca E-İmza ile İmzala & Gönder
                      </button>
                    ) : (
                      <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={16} /> E-İmza ile İmzalandı & Mahkemeye Gönderildi (Barkod: TR-2025-8841)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. UYAP DOKÜMAN EDİTÖRÜ (.UDF) REHBERİ */}
      {altSekme === "udf" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              UYAP DOKÜMAN EDİTÖRÜ (UDE) KILAVUZU
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              .UDF Formatı Nedir ve Nasıl Kullanılır?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Adalet Bakanlığı UYAP Bilişim Sistemi'nin resmi belge formatı olan UDF dokümanlarının hazırlanması ve e-imza gereksinimleri.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" /> 1. UDE Programı İndirme
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                UYAP Doküman Editörü (UDE), Adalet Bakanlığı resmi sitesinden (uyap.gov.tr/UYAP-Editor) ücretsiz indirilip bilgisayara kurulmalıdır.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Key size={14} className="text-emerald-600" /> 2. E-İmza / M-İmza Entegrasyonu
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                UDE içinde "Araçlar" sekmesinden e-imza kart sürücüsü tanımlanır. Rapor hazırlandıktan sonra tek tıkla 5070 SK uyumlu e-imza atılır.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Shield size={14} className="text-violet-600" /> 3. Değiştirilemezlik Güvencesi
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                İmzalanan .udf belgesi kriptografik olarak mühürlenir. Mahkeme hâkimi ve taraflar raporun değiştirilmediğini UYAP üzerinden doğrular.
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed flex items-center justify-between gap-4">
            <div>
              <p className="font-bold">Önemli Hatırlatma:</p>
              <p className="mt-0.5">
                UYAP Bilirkişi Portalı üzerinden başvuru dilekçesi gönderirken Word veya PDF kabul edilmemektedir; mutlaka UDE ile imzalanmış <b>.udf</b> dosyası yüklenmelidir.
              </p>
            </div>
            <button
              onClick={indirBasvuruDilekcesi}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold whitespace-nowrap hover:bg-blue-500"
            >
              Örnek .UDF İndir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

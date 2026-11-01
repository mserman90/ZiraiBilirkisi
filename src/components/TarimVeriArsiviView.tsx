import React, { useState, useMemo } from "react";
import {
  Database,
  Search,
  TrendingUp,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
  Fuel,
  Beef,
  Wheat,
  Scale,
  Sparkles,
  RefreshCw,
  Globe,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import {
  TUIK_TARIM_VERITABANI,
  TUIK_TARIM_UFE_SERISI,
  TUIK_GIRDI_FIYATLARI,
  TUIK_IL_LISTESI,
  TUIK_YIL_LISTESI,
  TUIK_KATEGORI_LISTESI,
  TUIK_HAYVANCILIK_VERITABANI,
  TuikHayvancilikVerisi,
  TuikUrunVerisi,
} from "../data/tuikTarimData";
import { TUIK_DATAFLOWS, TuikSdmxService, TuikApiSorguSonucu } from "../services/tuikSdmxService";
import KenarNotu from "./resmi/KenarNotu";

interface TarimVeriArsiviViewProps {
  showToast: (msg: string) => void;
  onTransferToWizard?: (data: { netGelir: number; araziTipi: "sulu" | "kuru"; urunAdi: string }) => void;
}

export default function TarimVeriArsiviView({
  showToast,
  onTransferToWizard,
}: TarimVeriArsiviViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "veriler" | "hayvancilik" | "tarimUfe" | "girdiler" | "apiSorgu" | "metodoloji"
  >("veriler");

  // Filtre durumları - Bitkisel
  const [seciliIl, setSeciliIl] = useState<string>("Tümü");
  const [seciliYil, setSeciliYil] = useState<string>("2025");
  const [seciliKategori, setSeciliKategori] = useState<string>("Tümü");
  const [seciliArazi, setSeciliArazi] = useState<string>("Tümü");
  const [aramaMetni, setAramaMetni] = useState<string>("");

  // Filtre durumları - Hayvancılık
  const [hayvanArama, setHayvanArama] = useState<string>("");
  const [seciliHayvanTur, setSeciliHayvanTur] = useState<string>("Tümü");

  // Ecrimisil hesaplayıcı durumları
  const [ecriBaslangicYil, setEcriBaslangicYil] = useState<number>(2022);
  const [ecriBaslangicTutar, setEcriBaslangicTutar] = useState<number>(50000);

  // Canlı SDMX API durumu
  const [seciliDataflow, setSeciliDataflow] = useState<string>(TUIK_DATAFLOWS[0].id);
  const [apiYukleniyor, setApiYukleniyor] = useState<boolean>(false);
  const [apiSonuc, setApiSonuc] = useState<TuikApiSorguSonucu<unknown> | null>(null);

  // Filtrelenmiş bitkisel veriler
  const filtrelenmisVeriler = useMemo(() => {
    return TUIK_TARIM_VERITABANI.filter((item) => {
      if (seciliIl !== "Tümü" && item.il !== seciliIl) return false;
      if (seciliYil !== "Tümü" && item.yil.toString() !== seciliYil) return false;
      if (seciliKategori !== "Tümü" && item.kategori !== seciliKategori) return false;
      if (seciliArazi !== "Tümü" && item.araziTipi !== seciliArazi) return false;
      if (
        aramaMetni.trim() &&
        !item.urun.toLowerCase().includes(aramaMetni.toLowerCase()) &&
        !item.il.toLowerCase().includes(aramaMetni.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [seciliIl, seciliYil, seciliKategori, seciliArazi, aramaMetni]);

  // Filtrelenmiş hayvancılık verileri
  const filtrelenmisHayvanlar = useMemo(() => {
    return TUIK_HAYVANCILIK_VERITABANI.filter((item) => {
      if (seciliHayvanTur !== "Tümü" && item.tur !== seciliHayvanTur) return false;
      if (
        hayvanArama.trim() &&
        !item.irk.toLowerCase().includes(hayvanArama.toLowerCase()) &&
        !item.kategori.toLowerCase().includes(hayvanArama.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [seciliHayvanTur, hayvanArama]);

  // Kopyalama fonksiyonu
  const handleKopyala = (metin: string) => {
    navigator.clipboard.writeText(metin).then(() => {
      showToast("Veri panoya kopyalandı");
    }).catch(() => {
      showToast("Kopyalandı");
    });
  };

  // CSV formatında kopyalama
  const handleExportCsv = () => {
    if (filtrelenmisVeriler.length === 0) {
      showToast("Dışa aktarılacak veri bulunamadı");
      return;
    }
    const basliklar = "İl,Bölge,Yıl,Ürün,Kategori,Arazi Tipi,Verim (kg/da),Fiyat (TL/kg),Masraf (TL/da),Brüt Gelir (TL/da),Net Gelir (TL/da),KFO (%),Resmi Kaynak\n";
    const satirlar = filtrelenmisVeriler
      .map(
        (v) =>
          `"${v.il}","${v.bolge}",${v.yil},"${v.urun}","${v.kategori}","${v.araziTipi}",${v.verimKgDa},${v.fiyatTlKg},${v.masrafTlDa},${v.brutGelirTlDa},${v.netGelirTlDa},%${v.kfoOnerilen},"${v.kaynakNo}"`
      )
      .join("\n");
    handleKopyala(basliklar + satirlar);
    showToast(`${filtrelenmisVeriler.length} kayıt CSV formatında kopyalandı`);
  };

  // Ecrimisil kümülatif artış hesabı
  const ecrimisilHesaplamalari = useMemo(() => {
    const sonuclar: { yil: number; ufeArtis: number; endeksTutar: number; aciklama: string }[] = [];
    let guncelTutar = ecriBaslangicTutar;

    const baslangicIndex = TUIK_TARIM_UFE_SERISI.findIndex((u) => u.yil === ecriBaslangicYil);
    if (baslangicIndex === -1) return [];

    sonuclar.push({
      yil: ecriBaslangicYil,
      ufeArtis: 0,
      endeksTutar: guncelTutar,
      aciklama: "Baz Yıl / Başlangıç Net Gelir Bedeli",
    });

    for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
      const ufe = TUIK_TARIM_UFE_SERISI[i];
      guncelTutar = guncelTutar * (1 + ufe.aralikYillikArtisPct / 100);
      sonuclar.push({
        yil: ufe.yil,
        ufeArtis: ufe.aralikYillikArtisPct,
        endeksTutar: Math.round(guncelTutar),
        aciklama: ufe.aciklama,
      });
    }

    return sonuclar;
  }, [ecriBaslangicYil, ecriBaslangicTutar]);

  // Canlı API Sorgusu
  const handleApiSorgula = async () => {
    setApiYukleniyor(true);
    try {
      const sonuc = await TuikSdmxService.queryDataflow(seciliDataflow);
      setApiSonuc(sonuc);
      showToast(sonuc.mesaj);
    } catch {
      showToast("API sorgusunda hata oluştu.");
    } finally {
      setApiYukleniyor(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. RESMÎ HERO KARTI — Orman Yeşili (#0F3D2E) ve Fraunces Başlık */}
      <div className="resmi-kart p-6 sm:p-7 bg-[#0F3D2E] text-[#FBF9F4] border-none shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#FBF9F4] rounded-[4px] text-[11px] font-mono tracking-wide border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#B45309]"></span>
              <span>TÜİK VERİ PORTALI & MERKEZİ DAĞITIM SİSTEMİ (data.tuik.gov.tr)</span>
            </div>
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-white m-0">
              TÜİK Tarımsal Veri Arşivi & Resmi Göstergeler
            </h2>
            <p className="font-sans text-[14px] text-[#FBF9F4]/85 leading-relaxed m-0">
              2942 sayılı Kamulaştırma Kanunu m. 11/f ve 6100 sayılı HMK m. 279 gereğince mahkemelere sunulacak resmi
              çiftçi satış fiyatları (ÇEGF), dekar başına münavebe verimleri, üretim masrafları, hayvancılık karkas/süt rayiçleri ve Tarım-ÜFE endeksleri.
            </p>
          </div>

          {/* Sağ Tarafta Resmi Göstergeler & Doğrudan Portal Linki */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-3 bg-white/10 rounded-[6px] border border-white/10 text-center min-w-[110px]">
                <p className="font-mono text-xl sm:text-2xl font-bold text-amber-300 m-0">%37,01</p>
                <p className="font-mono text-[10.5px] text-white/70 m-0 mt-0.5">2024 Tarım-ÜFE</p>
              </div>
              <div className="p-3 bg-white/10 rounded-[6px] border border-white/10 text-center min-w-[110px]">
                <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-300 m-0">%36,01</p>
                <p className="font-mono text-[10.5px] text-white/70 m-0 mt-0.5">2025 Tarım-ÜFE</p>
              </div>
            </div>

            <a
              href="https://data.tuik.gov.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#B45309] hover:bg-amber-600 text-white rounded-[6px] text-[12px] font-sans font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>data.tuik.gov.tr Portalı</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. ALT SEKME MENÜSÜ */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[hsl(var(--muted))] rounded-[8px] border border-[hsl(var(--border))]">
        {[
          { id: "veriler" as const, label: "01 Bitkisel Üretim & ÇEGF", icon: <Wheat className="w-4 h-4 text-emerald-600" /> },
          { id: "hayvancilik" as const, label: "02 Hayvancılık & Süt/Et", icon: <Beef className="w-4 h-4 text-amber-600" /> },
          { id: "tarimUfe" as const, label: "Tarım-ÜFE & Ecrimisil", icon: <TrendingUp className="w-4 h-4 text-[#0F3D2E]" /> },
          { id: "girdiler" as const, label: "Tarımsal Girdiler (Tarım-GFE)", icon: <Fuel className="w-4 h-4 text-slate-600" /> },
          { id: "apiSorgu" as const, label: "Canlı SDMX REST API", icon: <Database className="w-4 h-4 text-blue-600" /> },
          { id: "metodoloji" as const, label: "Yargıtay Standartları", icon: <Scale className="w-4 h-4 text-stone-600" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* SEKME 1: BİTKİSEL ÜRETİM & ÇEGF RESMİ VERİ TABANI */}
      {/* ==================================================================== */}
      {activeSubTab === "veriler" && (
        <div className="space-y-4">
          {/* Filtre ve Arama */}
          <div className="resmi-kart p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  placeholder="Ürün adı veya il ara (örn: Buğday, Ayçiçeği, Çeltik, Pamuk, Edirne, Konya)..."
                  className="w-full h-10 pl-9 pr-4 text-[13px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                className="btn-secondary h-10 px-3.5 text-[12.5px] flex items-center gap-1.5 shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0F3D2E] dark:text-emerald-400" />
                <span>Tabloyu Kopyala (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[hsl(var(--border))] text-[12px]">
              <div>
                <label className="block font-mono text-[11px] text-[hsl(var(--muted-foreground))] mb-1">İL SEÇİN</label>
                <select
                  value={seciliIl}
                  onChange={(e) => setSeciliIl(e.target.value)}
                  className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                >
                  <option value="Tümü">Tüm İller ({TUIK_IL_LISTESI.length})</option>
                  {TUIK_IL_LISTESI.map((il) => (
                    <option key={il} value={il}>{il}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[hsl(var(--muted-foreground))] mb-1">YIL</label>
                <select
                  value={seciliYil}
                  onChange={(e) => setSeciliYil(e.target.value)}
                  className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                >
                  <option value="Tümü">Tüm Yıllar</option>
                  {TUIK_YIL_LISTESI.map((y) => (
                    <option key={y} value={y.toString()}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[hsl(var(--muted-foreground))] mb-1">KATEGORİ</label>
                <select
                  value={seciliKategori}
                  onChange={(e) => setSeciliKategori(e.target.value)}
                  className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                >
                  {TUIK_KATEGORI_LISTESI.map((kat) => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[hsl(var(--muted-foreground))] mb-1">ARAZİ TİPİ</label>
                <select
                  value={seciliArazi}
                  onChange={(e) => setSeciliArazi(e.target.value)}
                  className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                >
                  <option value="Tümü">Tümü (Kuru & Sulu)</option>
                  <option value="Kuru">Kuru Tarım (%5 KFO)</option>
                  <option value="Sulu">Sulu Tarım (%4 KFO)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Veri Tablosu */}
          <div className="resmi-kart overflow-hidden">
            <div className="p-3 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[hsl(var(--card-foreground))]">
                Kayıt Sayısı: <span className="font-mono text-[#B45309]">{filtrelenmisVeriler.length}</span> resmi ürün
              </span>
              <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hidden sm:inline">
                Kaynak: TÜİK Bitkisel Üretim & İlçe Tarım Müdürlüğü Cetvelleri
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[hsl(var(--muted))]/60 text-[hsl(var(--muted-foreground))] font-mono text-[11.5px] border-b border-[hsl(var(--border))]">
                    <th className="p-2.5">İl / Bölge</th>
                    <th className="p-2.5">Yıl</th>
                    <th className="p-2.5">Ürün Adı</th>
                    <th className="p-2.5">Arazi</th>
                    <th className="p-2.5 text-right font-mono">Verim (kg/da)</th>
                    <th className="p-2.5 text-right font-mono">ÇEGF (TL/kg)</th>
                    <th className="p-2.5 text-right font-mono">Masraf (TL/da)</th>
                    <th className="p-2.5 text-right font-mono">Net Gelir (TL/da)</th>
                    <th className="p-2.5">Resmi Kaynak</th>
                    <th className="p-2.5 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {filtrelenmisVeriler.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-[hsl(var(--muted-foreground))]">
                        Kriterlere uygun ürün kaydı bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filtrelenmisVeriler.map((item) => (
                      <tr key={item.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                        <td className="p-2.5 font-semibold text-[hsl(var(--card-foreground))]">
                          {item.il} <span className="text-[11px] font-normal text-[hsl(var(--muted-foreground))]">({item.bolge})</span>
                        </td>
                        <td className="p-2.5 font-mono text-[12px]">{item.yil}</td>
                        <td className="p-2.5 font-medium">{item.urun}</td>
                        <td className="p-2.5">
                          <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-[3px] ${
                            item.araziTipi === "Sulu" ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                          }`}>
                            {item.araziTipi} (%{item.kfoOnerilen})
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-mono">{item.verimKgDa.toLocaleString("tr-TR")}</td>
                        <td className="p-2.5 text-right font-mono">₺{item.fiyatTlKg.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-mono">₺{item.masrafTlDa.toLocaleString("tr-TR")}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#0F3D2E] dark:text-emerald-400">
                          ₺{item.netGelirTlDa.toLocaleString("tr-TR")}
                        </td>
                        <td className="p-2.5 text-[11px] font-mono text-[hsl(var(--muted-foreground))]">{item.kaynakNo}</td>
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {onTransferToWizard && (
                              <button
                                type="button"
                                onClick={() => {
                                  onTransferToWizard({
                                    netGelir: item.netGelirTlDa,
                                    araziTipi: item.araziTipi === "Sulu" ? "sulu" : "kuru",
                                    urunAdi: `${item.il} - ${item.urun}`,
                                  });
                                  showToast(`${item.urun} net geliri sihirbaza aktarıldı`);
                                }}
                                className="h-7 px-2 bg-[#0F3D2E] text-white rounded-[4px] text-[11px] font-medium hover:bg-[#15803D] transition-colors"
                                title="Rapor Sihirbazına Aktar"
                              >
                                Sihirbaza Aktar
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleKopyala(`İl: ${item.il}\nÜrün: ${item.urun}\nVerim: ${item.verimKgDa} kg/da\nFiyat: ₺${item.fiyatTlKg}/kg\nDekar Masrafı: ₺${item.masrafTlDa}\nDekar Net Gelir: ₺${item.netGelirTlDa}\nKFO: %${item.kfoOnerilen}\nKaynak: ${item.kaynakNo}`)}
                              className="p-1.5 hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-[4px]"
                              title="Panoya Kopyala"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 2: HAYVANCILIK & SÜT/ET İSTATİSTİKLERİ */}
      {/* ==================================================================== */}
      {activeSubTab === "hayvancilik" && (
        <div className="space-y-4">
          <div className="resmi-kart p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hayvanArama}
                onChange={(e) => setHayvanArama(e.target.value)}
                placeholder="Hayvan ırkı veya kullanım amacı ara (örn: Holstein, Simental, Akkaraman, Broiler)..."
                className="w-full h-10 pl-9 pr-4 text-[13px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {["Tümü", "Büyükbaş", "Küçükbaş", "Kanatlı"].map((tur) => (
                <button
                  key={tur}
                  type="button"
                  onClick={() => setSeciliHayvanTur(tur)}
                  className={`h-9 px-3 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                    seciliHayvanTur === tur
                      ? "bg-[#0F3D2E] text-white"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"
                  }`}
                >
                  {tur}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrelenmisHayvanlar.map((item) => (
              <div key={item.id} className="resmi-kart p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="alan-badge-hayvancilik">{item.tur}</span>
                    <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-[4px]">
                      {item.kategori}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-[17px] text-[hsl(var(--card-foreground))] m-0 pt-1">
                    {item.irk}
                  </h3>
                  <p className="font-sans text-[12.5px] text-[hsl(var(--muted-foreground))]">
                    {item.aciklama}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[hsl(var(--muted))] rounded-[6px] font-mono text-[12px]">
                  <div>
                    <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] block">Canlı Ağırlık / Randıman</span>
                    <span className="font-bold text-[hsl(var(--card-foreground))]">{item.canliAgirlikKg} kg (%{item.karkasRandimaniPct})</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] block">Karkas Ağırlığı</span>
                    <span className="font-bold text-[hsl(var(--card-foreground))]">{item.karkasAgirligiKg} kg</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] block">Canlı / Karkas Fiyatı</span>
                    <span className="font-bold text-[#B45309]">₺{item.canliBirimFiyatTlKg} / ₺{item.karkasEtFiyatiTlKg}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] block">Ortalama Baş Rayici</span>
                    <span className="font-bold text-[#0F3D2E] dark:text-emerald-400">₺{item.ortalamaBasDegeriTl.toLocaleString("tr-TR")}</span>
                  </div>
                </div>

                {item.yillikSutVerimiLitre && (
                  <div className="text-[11.5px] font-mono text-[hsl(var(--muted-foreground))] flex items-center justify-between border-t border-[hsl(var(--border))] pt-2">
                    <span>Yıllık Süt Verimi: <strong>{item.yillikSutVerimiLitre} L</strong></span>
                    <span>Çiğ Süt Ref: <strong>₺{item.cigSutFiyatiTlLitre}/L</strong></span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-2">
                  <span className="text-[10.5px] font-mono text-[hsl(var(--muted-foreground))]">{item.resmiKaynak}</span>
                  <button
                    type="button"
                    onClick={() => handleKopyala(`${item.irk} (${item.tur})\nCanlı Ağırlık: ${item.canliAgirlikKg} kg\nKarkas: ${item.karkasAgirligiKg} kg (%${item.karkasRandimaniPct})\nOrtalama Baş Değeri: ₺${item.ortalamaBasDegeriTl.toLocaleString("tr-TR")}\nKaynak: ${item.resmiKaynak}`)}
                    className="p-1 hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-[4px]"
                    title="Kopyala"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 3: TARIM-ÜFE & ECRİMİSİL HESAPLAYICISI */}
      {/* ==================================================================== */}
      {activeSubTab === "tarimUfe" && (
        <div className="space-y-5">
          <KenarNotu tip="mevzuat" baslik="Yargıtay 3. Hukuk Dairesi Ecrimisil İlkesi">
            <p className="text-[13px] leading-relaxed">
              "Fuzuli şagil tarafından işgal edilen tarım arazilerinde ecrimisil hesabı yapılırken; ilk dönem için
              taşınmazın getirebileceği net tarımsal kira bedeli tespit edilmeli, müteakip dönemler için ise TÜİK Tarım Ürünleri
              Üretici Fiyat Endeksi (Tarım-ÜFE) artış oranları kümülatif olarak uygulanmalıdır." (Yargıtay 3. HD 2021/4120 E.)
            </p>
          </KenarNotu>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sol: Hesaplayıcı Parametreleri */}
            <div className="lg:col-span-5 resmi-kart p-5 space-y-4">
              <h3 className="font-serif font-semibold text-[17px] text-[hsl(var(--card-foreground))] m-0">
                Tarım-ÜFE Ecrimisil Simülatörü
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                    BAŞLANGIÇ YILI (İLK İŞGAL DÖNEMİ)
                  </label>
                  <select
                    value={ecriBaslangicYil}
                    onChange={(e) => setEcriBaslangicYil(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] font-mono"
                  >
                    {TUIK_TARIM_UFE_SERISI.map((u) => (
                      <option key={u.yil} value={u.yil}>
                        {u.yil} Yılı (Yıllık Artış: %{u.aralikYillikArtisPct})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                    İLK YIL TESPİT EDİLEN NET GELİR / KİRA (TL)
                  </label>
                  <input
                    type="number"
                    value={ecriBaslangicTutar}
                    onChange={(e) => setEcriBaslangicTutar(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[14px] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-[hsl(var(--muted))] rounded-[6px] font-mono text-[12px] space-y-1">
                <div className="flex justify-between">
                  <span>Hesaplanan Dönem Sayısı:</span>
                  <strong>{ecrimisilHesaplamalari.length} Yıl</strong>
                </div>
                <div className="flex justify-between text-[#0F3D2E] dark:text-emerald-400 font-bold text-[13px] pt-1 border-t border-[hsl(var(--border))]">
                  <span>Toplam Kümülatif Ecrimisil:</span>
                  <span>₺{ecrimisilHesaplamalari.reduce((a, b) => a + b.endeksTutar, 0).toLocaleString("tr-TR")}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const metin = ecrimisilHesaplamalari
                    .map((e) => `${e.yil}: ₺${e.endeksTutar.toLocaleString("tr-TR")} (${e.aciklama})`)
                    .join("\n");
                  handleKopyala(`TÜİK TARIM-ÜFE ECRİMİSİL HESAP CETVELİ:\n${metin}\nToplam: ₺${ecrimisilHesaplamalari.reduce((a, b) => a + b.endeksTutar, 0).toLocaleString("tr-TR")}`);
                }}
                className="btn-primary w-full h-10 text-[13px] justify-center"
              >
                Hesap Cetvelini Kopyala
              </button>
            </div>

            {/* Sağ: Yıllar İtibarıyla Tablo */}
            <div className="lg:col-span-7 resmi-kart overflow-hidden">
              <div className="p-3 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] font-semibold text-[13px]">
                Dönemler İtibarıyla Artış Cetveli
              </div>
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[hsl(var(--muted))]/50 text-[hsl(var(--muted-foreground))] font-mono text-[11.5px] border-b border-[hsl(var(--border))]">
                    <th className="p-2.5">Dönem Yılı</th>
                    <th className="p-2.5 font-mono text-right">Tarım-ÜFE (%)</th>
                    <th className="p-2.5 font-mono text-right">Dönem Ecrimisil Tutarı</th>
                    <th className="p-2.5">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))] font-mono">
                  {ecrimisilHesaplamalari.map((e) => (
                    <tr key={e.yil} className="hover:bg-[hsl(var(--muted))]/30">
                      <td className="p-2.5 font-bold text-[hsl(var(--card-foreground))]">{e.yil}</td>
                      <td className="p-2.5 text-right text-amber-600 dark:text-amber-400">
                        {e.ufeArtis === 0 ? "Baz Yıl" : `+ %${e.ufeArtis}`}
                      </td>
                      <td className="p-2.5 text-right font-bold text-[#0F3D2E] dark:text-emerald-400">
                        ₺{e.endeksTutar.toLocaleString("tr-TR")}
                      </td>
                      <td className="p-2.5 font-sans text-[11.5px] text-[hsl(var(--muted-foreground))]">{e.aciklama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 4: TARIMSAL GİRDİLER (TARIM-GFE) */}
      {/* ==================================================================== */}
      {activeSubTab === "girdiler" && (
        <div className="space-y-4">
          <div className="resmi-kart p-4">
            <h3 className="font-serif font-semibold text-[17px] text-[hsl(var(--card-foreground))] m-0">
              TÜİK Tarımsal Girdi Fiyat Endeksi (Tarım-GFE) Referans Kalemleri
            </h3>
            <p className="font-sans text-[13px] text-[hsl(var(--muted-foreground))] mt-1">
              Bilirkişi raporlarında üretim masraf cetvelleri düzenlenirken mazot, gübre, tohum, sulama enerjisi ve
              makine amortisman kalemleri resmi Tarım-GFE gerçekleşmeleri üzerinden denetlenir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TUIK_GIRDI_FIYATLARI.map((girdi, i) => (
              <div key={i} className="resmi-kart p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-[4px] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                    {girdi.kategori}
                  </span>
                  <span className="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">{girdi.birim}</span>
                </div>
                <h4 className="font-serif font-semibold text-[15px] text-[hsl(var(--card-foreground))] m-0">{girdi.girdi}</h4>

                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[hsl(var(--border))] text-center font-mono">
                  <div className="p-1.5 bg-[hsl(var(--muted))] rounded-[4px]">
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] m-0">2023</p>
                    <p className="font-bold text-[12px] m-0">₺{girdi.fiyat2023.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--muted))] rounded-[4px]">
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] m-0">2024</p>
                    <p className="font-bold text-[12px] m-0">₺{girdi.fiyat2024.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="p-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-[4px]">
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold m-0">2025</p>
                    <p className="font-bold text-[12px] text-[#B45309] m-0">₺{girdi.fiyat2025.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--muted))] rounded-[4px]">
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] m-0">2026*</p>
                    <p className="font-bold text-[12px] m-0">₺{girdi.fiyat2026.toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 5: CANLI TÜİK SDMX REST API ENTEGRASYONU */}
      {/* ==================================================================== */}
      {activeSubTab === "apiSorgu" && (
        <div className="space-y-4">
          <div className="resmi-kart p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[hsl(var(--border))] pb-3">
              <div>
                <h3 className="font-serif font-semibold text-[17px] text-[hsl(var(--card-foreground))] m-0 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>TÜİK SDMX 2.1 REST API & Canlı Veri Servisi</span>
                </h3>
                <p className="font-sans text-[13px] text-[hsl(var(--muted-foreground))] mt-1">
                  Merkezi Dağıtım Sistemi (nsiws.tuik.gov.tr) üzerinden uluslararası SDMX standardında makine-okunabilir canlı veri sorgulama paneli.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApiSorgula}
                  disabled={apiYukleniyor}
                  className="btn-primary h-9 px-3 text-[12.5px] flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${apiYukleniyor ? "animate-spin" : ""}`} />
                  <span>{apiYukleniyor ? "Sorgulanıyor..." : "Canlı Sorgula"}</span>
                </button>
              </div>
            </div>

            {/* Dataflow Seçimi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {TUIK_DATAFLOWS.map((df) => (
                <div
                  key={df.id}
                  onClick={() => setSeciliDataflow(df.id)}
                  className={`p-3.5 rounded-[6px] border cursor-pointer transition-all ${
                    seciliDataflow === df.id
                      ? "border-[#0F3D2E] bg-[#0F3D2E]/5 dark:bg-[#0F3D2E]/20"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#B45309]">{df.kod}</span>
                    <span className="text-[10px] font-mono bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded-[3px]">
                      {df.frekans}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-[13.5px] text-[hsl(var(--card-foreground))] mt-1">
                    {df.ad}
                  </h4>
                  <p className="font-sans text-[11.5px] text-[hsl(var(--muted-foreground))] line-clamp-2 mt-1">
                    {df.aciklama}
                  </p>
                  <div className="mt-2 pt-2 border-t border-[hsl(var(--border))] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[hsl(var(--muted-foreground))]">ID: {df.id}</span>
                    <a
                      href={df.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Bülten <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* API Sonuç Paneli */}
            {apiSonuc && (
              <div className="p-4 bg-[hsl(var(--muted))] rounded-[6px] border border-[hsl(var(--border))] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span className="font-semibold text-[13px]">{apiSonuc.mesaj}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                    Kaynak: {apiSonuc.kaynak === "canli_sdmx" ? "Canlı SDMX REST Web Servisi" : "Doğrulanmış Yerel Veri Tabanı"}
                  </span>
                </div>
                <p className="text-[12px] font-mono text-[hsl(var(--muted-foreground))]">
                  Seçili Akış: <strong>{apiSonuc.dataflowId}</strong> | Son Güncelleme: {apiSonuc.sonGuncelleme}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 6: YARGITAY BİLİRKİŞİLİK METODOLOJİSİ */}
      {/* ==================================================================== */}
      {activeSubTab === "metodoloji" && (
        <div className="resmi-kart p-6 space-y-5">
          <div className="border-b border-[hsl(var(--border))] pb-3">
            <h3 className="font-serif font-semibold text-lg text-[hsl(var(--card-foreground))] flex items-center gap-2 m-0">
              <Scale className="w-5 h-5 text-[#0F3D2E]" />
              <span>Yargıtay Standartlarında TÜİK Verileri ve Net Gelir Kapitalizasyonu</span>
            </h3>
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">
              2942 Sayılı Kamulaştırma Kanunu m. 11/f ve Yargıtay 5. Hukuk Dairesi yerleşik ilke kararları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] leading-relaxed">
            <KenarNotu tip="mevzuat" baslik="1. Resmi Veri Önceliği Kuralı">
              <p>
                Bilirkişi kurulu, değerlendirme tarihi itibarıyla taşınmazın bulunduğu ilçe Tarım ve Orman Müdürlüğü
                resmi maliyet cetvellerini ve TÜİK Çiftçinin Eline Geçen Fiyatlar (ÇEGF) bültenini esas almak zorundadır.
                Resmi veri yerine soyut serbest piyasa beyanlarına dayalı raporlar Yargıtay tarafından bozulmaktadır.
              </p>
            </KenarNotu>

            <KenarNotu tip="mevzuat" baslik="2. Kapitalizasyon Faizi (KFO) Standartı">
              <p>
                Yargıtay 5. Hukuk Dairesi'nin yerleşik kararlarına göre kapitalizasyon faiz oranı:
                <br />• <strong>Sulu Tarım Arazilerinde:</strong> %4 veya %5
                <br />• <strong>Kuru Tarım Arazilerinde:</strong> %5 veya %6
                <br />Olarak uygulanır. Haklı ve teknik bir gerekçe olmaksızın bu oranların dışına çıkılamaz.
              </p>
            </KenarNotu>

            <KenarNotu tip="mevzuat" baslik="3. Münavebe (Ekim Nöbeti) Zorunluluğu">
              <p>
                Taşınmazın tek bir ürüne göre değil, bölgenin kadim tarımsal alışkanlıklarına ve İlçe Tarım
                Müdürlüğü'nün kabul ettiği ekim nöbetine (örn: Buğday - Ayçiçeği veya Buğday - Nadas/Mısır) göre
                ortalama net geliri hesaplanarak çıplak arazi değeri belirlenmelidir.
              </p>
            </KenarNotu>

            <KenarNotu tip="mevzuat" baslik="4. Saman Geliri ve Genel İdare Masrafı">
              <p>
                Hububat grubu ürünlerde dane veriminin yanında ana masrafları karşılamak üzere saman/balya geliri de
                resmi cetvellere göre brüt gelire dahil edilmelidir. Üretim masraflarına genel idare gideri olarak %3-%5
                arası pay ilave edilir.
              </p>
            </KenarNotu>
          </div>
        </div>
      )}
    </div>
  );
}

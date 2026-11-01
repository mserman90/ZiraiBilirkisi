import React, { useState, useMemo } from "react";
import {
  X,
  Database,
  Wheat,
  Beef,
  TrendingUp,
  Fuel,
  Check,
  Search,
  FileText,
  Table as TableIcon,
  ListFilter,
  Calculator,
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  Info,
  Copy,
  Scale,
  Utensils,
  BookOpen,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import {
  TUIK_TARIM_VERITABANI,
  TUIK_IL_LISTESI,
  TUIK_YIL_LISTESI,
  TUIK_KATEGORI_LISTESI,
  TUIK_HAYVANCILIK_VERITABANI,
  TUIK_TARIM_UFE_SERISI,
  TUIK_GIRDI_FIYATLARI,
  TUIK_GIDA_ZAYIAT_VERITABANI,
  TUIK_DEFLATOR_SERISI,
  TUIK_SDMX_TABLOLARI,
  DAVA_TURU_SABLONLARI,
  DavaTuruKodu,
  TUIK_HATA_KATALOGU,
  UAT_TEST_SENARYOLARI,
  TuikUrunVerisi,
  TuikHayvancilikVerisi,
  TuikGirdiMaliyeti,
  TuikTarimUfeVerisi,
  TuikGidaUrunu,
  TuikDenetimIzi,
  generateTuikDenetimIzi,
  parseCegfCsv,
} from "../../data/tuikTarimData";
import { RaporEki } from "../../data/fields";

interface TuikVeriAktarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMetinEkle: (eklenecekMetin: string) => void;
  showToast: (msg: string) => void;
  onEkEkle?: (yeniEk: RaporEki) => void;
  currentStep?: number;
}

type AnaSekme = "sorgu" | "ithalat" | "denetim" | "uat" | "sdmx";
type AktifMod = "bitkisel" | "hayvancilik" | "girdiler" | "ecrimisil" | "gida" | "deflator";
type CiktiFormati = "paragraf" | "tablo" | "madde";
type KullaniciRolu = "bilirkisi" | "denetci" | "yonetici";

interface BirlesikAramaSonucu {
  id: string;
  tur: AktifMod;
  baslik: string;
  etiket: string;
  detay1: string;
  detay2: string;
  birimDeger: string;
  hamVeri: TuikUrunVerisi | TuikHayvancilikVerisi | TuikGirdiMaliyeti | TuikTarimUfeVerisi | TuikGidaUrunu;
}

export default function TuikVeriAktarModal({
  isOpen,
  onClose,
  onMetinEkle,
  showToast,
  onEkEkle,
  currentStep = 4,
}: TuikVeriAktarModalProps) {
  // Ana Sekme
  const [anaSekme, setAnaSekme] = useState<AnaSekme>("sorgu");

  // Kullanıcı Profili (Şartname Madde 1.3)
  const [kullaniciRolu, setKullaniciRolu] = useState<KullaniciRolu>("bilirkisi");

  // Seçili Dava Türü Şablonu (Şartname Ek-1)
  const [seciliDavaTuru, setSeciliDavaTuru] = useState<DavaTuruKodu>("kamulastirma");

  // Arama metni
  const [serbestArama, setSerbestArama] = useState<string>("");

  // Aktif Veri Modu
  const [aktifMod, setAktifMod] = useState<AktifMod>("bitkisel");

  // Çıktı formatı
  const [ciktiFormati, setCiktiFormati] = useState<CiktiFormati>("paragraf");

  // Çarpan / Miktar parametreleri
  const [alanDekar, setAlanDekar] = useState<string>("25");
  const [hayvanAdedi, setHayvanAdedi] = useState<string>("1");
  const [gebeDamizlikMi, setGebeDamizlikMi] = useState<boolean>(true);
  const [laktasyonSutKaybiEkle, setLaktasyonSutKaybiEkle] = useState<boolean>(true);
  const [gidaZayiatMiktari, setGidaZayiatMiktari] = useState<string>("2500");

  // Yapılandırılmış filtreler - Bitkisel
  const [seciliIl, setSeciliIl] = useState<string>("Ankara");
  const [seciliKategori, setSeciliKategori] = useState<string>("Hububat");
  const [seciliArazi, setSeciliArazi] = useState<string>("Sulu");
  const [seciliYil, setSeciliYil] = useState<string>("2025");
  const [seciliUrunId, setSeciliUrunId] = useState<string>("");
  const [ozelKfo, setOzelKfo] = useState<number>(5);

  // Yapılandırılmış filtreler - Hayvancılık
  const [seciliHayvanTur, setSeciliHayvanTur] = useState<string>("Büyükbaş");
  const [seciliHayvanId, setSeciliHayvanId] = useState<string>(TUIK_HAYVANCILIK_VERITABANI[0].id);

  // Yapılandırılmış filtreler - Girdiler
  const [seciliGirdiIndex, setSeciliGirdiIndex] = useState<number>(0);
  const [seciliGirdiYil, setSeciliGirdiYil] = useState<number>(2025);

  // Yapılandırılmış filtreler - Ecrimisil
  const [ecriBaslangicYil, setEcriBaslangicYil] = useState<number>(2022);
  const [ecriBaslangicTutar, setEcriBaslangicTutar] = useState<number>(50000);

  // Yapılandırılmış filtreler - Gıda Zayiatı
  const [seciliGidaId, setSeciliGidaId] = useState<string>(TUIK_GIDA_ZAYIAT_VERITABANI[0].id);
  const [seciliGidaYil, setSeciliGidaYil] = useState<number>(2025);

  // Yapılandırılmış filtreler - Deflatör
  const [deflatorBazYil, setDeflatorBazYil] = useState<number>(2022);
  const [deflatorHedefYil, setDeflatorHedefYil] = useState<number>(2025);
  const [deflatorNominalTutar, setDeflatorNominalTutar] = useState<number>(100000);

  // CSV İçe Aktarma Durumu (Şartname Ek-2)
  const [csvGirdisi, setCsvGirdisi] = useState<string>("");
  const [csvMesaji, setCsvMesaji] = useState<{ tipi: "basari" | "hata"; metin: string } | null>(null);

  // Son oluşturulan Denetim İzi kaydı (Şartname Ek-4)
  const [sonDenetimIzi, setSonDenetimIzi] = useState<TuikDenetimIzi | null>(null);

  // ==========================================================================
  // 1. DAVA TÜRÜ ŞABLONUNU UYGULAMA (ŞARTNAME EK-1)
  // ==========================================================================
  const handleDavaTuruDegistir = (davaKodu: DavaTuruKodu) => {
    setSeciliDavaTuru(davaKodu);
    const sablon = DAVA_TURU_SABLONLARI.find((s) => s.id === davaKodu);
    if (!sablon) return;

    setAktifMod(sablon.onerilenMod);
    if (sablon.varsayilanParametreler.il) setSeciliIl(sablon.varsayilanParametreler.il);
    if (sablon.varsayilanParametreler.kategori) setSeciliKategori(sablon.varsayilanParametreler.kategori);
    if (sablon.varsayilanParametreler.araziTipi) setSeciliArazi(sablon.varsayilanParametreler.araziTipi);
    if (sablon.varsayilanParametreler.kfo) setOzelKfo(sablon.varsayilanParametreler.kfo);
    if (sablon.varsayilanParametreler.dekar) setAlanDekar(sablon.varsayilanParametreler.dekar.toString());
    if (sablon.varsayilanParametreler.adet) setHayvanAdedi(sablon.varsayilanParametreler.adet.toString());
    if (sablon.varsayilanParametreler.bazTutar) setEcriBaslangicTutar(sablon.varsayilanParametreler.bazTutar);
    if (sablon.varsayilanParametreler.bazYil) setEcriBaslangicYil(sablon.varsayilanParametreler.bazYil);
    if (sablon.varsayilanParametreler.zayiatMiktari) setGidaZayiatMiktari(sablon.varsayilanParametreler.zayiatMiktari.toString());

    showToast(`"${sablon.ad}" şablonu ve hesaplama parametreleri yüklendi.`);
  };

  // ==========================================================================
  // 2. SERBEST METİN SORGULAMA MOTORU (Fuzzy Multi-Word Match)
  // ==========================================================================
  const serbestAramaSonuclari = useMemo<BirlesikAramaSonucu[]>(() => {
    const q = serbestArama.trim().toLowerCase();
    if (!q) return [];

    const kelimeler = q.split(/\s+/).filter(Boolean);
    const sonuclar: BirlesikAramaSonucu[] = [];

    // A) Bitkisel
    TUIK_TARIM_VERITABANI.forEach((item) => {
      const aramaHavuza = `${item.il} ${item.urun} ${item.kategori} ${item.araziTipi} ${item.bolge} ${item.yil} ${item.kaynakNo}`.toLowerCase();
      if (kelimeler.every((k) => aramaHavuza.includes(k))) {
        sonuclar.push({
          id: `bitkisel-${item.id}`,
          tur: "bitkisel",
          baslik: `${item.il} — ${item.urun} (${item.yil})`,
          etiket: `${item.araziTipi} Tarım (%${item.kfoOnerilen} KFO)`,
          detay1: `Verim: ${item.verimKgDa} kg/da • ÇEGF: ₺${item.fiyatTlKg.toFixed(2)}/kg`,
          detay2: `Masraf: ₺${item.masrafTlDa.toLocaleString("tr-TR")}/da • Kaynak: ${item.kaynakNo}`,
          birimDeger: `Net Gelir: ₺${item.netGelirTlDa.toLocaleString("tr-TR")}/da`,
          hamVeri: item,
        });
      }
    });

    // B) Hayvancılık
    TUIK_HAYVANCILIK_VERITABANI.forEach((item) => {
      const aramaHavuza = `${item.tur} ${item.irk} ${item.kategori} ${item.resmiKaynak} ${item.aciklama || ""}`.toLowerCase();
      if (kelimeler.every((k) => aramaHavuza.includes(k))) {
        sonuclar.push({
          id: `hayvan-${item.id}`,
          tur: "hayvancilik",
          baslik: `${item.irk} (${item.tur})`,
          etiket: item.kategori,
          detay1: `Canlı: ${item.canliAgirlikKg} kg • Karkas: ${item.karkasAgirligiKg} kg (%${item.karkasRandimaniPct})`,
          detay2: `Canlı ₺${item.canliBirimFiyatTlKg}/kg • Karkas ₺${item.karkasEtFiyatiTlKg}/kg`,
          birimDeger: `Baş Rayici: ₺${item.ortalamaBasDegeriTl.toLocaleString("tr-TR")}`,
          hamVeri: item,
        });
      }
    });

    // C) Gıda Zayiatı
    TUIK_GIDA_ZAYIAT_VERITABANI.forEach((item) => {
      const aramaHavuza = `${item.maddeAdi} ${item.maddeKodu} ${item.kategori} ${item.resmiKaynak} ${item.aciklama}`.toLowerCase();
      if (kelimeler.every((k) => aramaHavuza.includes(k))) {
        sonuclar.push({
          id: `gida-${item.id}`,
          tur: "gida",
          baslik: `${item.maddeAdi}`,
          etiket: `${item.kategori} (TÜİK: ${item.maddeKodu})`,
          detay1: `2025: ₺${item.fiyat2025.toLocaleString("tr-TR")} / ${item.birim} • 2024: ₺${item.fiyat2024.toLocaleString("tr-TR")}`,
          detay2: item.resmiKaynak,
          birimDeger: `₺${item.fiyat2025.toLocaleString("tr-TR")} / ${item.birim}`,
          hamVeri: item,
        });
      }
    });

    // D) Tarımsal Girdiler
    TUIK_GIRDI_FIYATLARI.forEach((item, index) => {
      const aramaHavuza = `${item.girdi} ${item.kategori} ${item.birim} gübre mazot tohum elektrik ilaç mekanizasyon`.toLowerCase();
      if (kelimeler.every((k) => aramaHavuza.includes(k))) {
        sonuclar.push({
          id: `girdi-${index}`,
          tur: "girdiler",
          baslik: `${item.girdi}`,
          etiket: `${item.kategori} (${item.birim})`,
          detay1: `2024: ₺${item.fiyat2024.toLocaleString("tr-TR")} • 2025: ₺${item.fiyat2025.toLocaleString("tr-TR")}`,
          detay2: `TÜİK Tarımsal Girdi Fiyat Endeksi (Tarım-GFE)`,
          birimDeger: `2025: ₺${item.fiyat2025.toLocaleString("tr-TR")}`,
          hamVeri: item,
        });
      }
    });

    // E) Tarım-ÜFE Ecrimisil
    if (kelimeler.some((k) => ["üfe", "ufe", "ecrimisil", "kira", "enflasyon"].includes(k) || !isNaN(Number(k)))) {
      TUIK_TARIM_UFE_SERISI.forEach((item) => {
        const aramaHavuza = `${item.yil} ${item.aciklama} ufe üfe ecrimisil`.toLowerCase();
        if (kelimeler.some((k) => aramaHavuza.includes(k))) {
          sonuclar.push({
            id: `ufe-${item.yil}`,
            tur: "ecrimisil",
            baslik: `${item.yil} Yılı TÜİK Tarım-ÜFE Artış Oranı`,
            etiket: "Yargıtay 3. HD Ecrimisil Standardı",
            detay1: `Aralık Yıllık Değişim: +%${item.aralikYillikArtisPct} • 12 Aylık Ort: %${item.onikiAylikOrtalamaPct}`,
            detay2: item.aciklama,
            birimDeger: `+%${item.aralikYillikArtisPct}`,
            hamVeri: item,
          });
        }
      });
    }

    return sonuclar.slice(0, 15);
  }, [serbestArama]);

  // Arama sonucundan veri seçimi
  const handleAramaSonucuSec = (sonuc: BirlesikAramaSonucu) => {
    setAktifMod(sonuc.tur);
    if (sonuc.tur === "bitkisel") {
      const u = sonuc.hamVeri as TuikUrunVerisi;
      setSeciliIl(u.il);
      setSeciliUrunId(u.id);
      setOzelKfo(u.kfoOnerilen);
    } else if (sonuc.tur === "hayvancilik") {
      const h = sonuc.hamVeri as TuikHayvancilikVerisi;
      setSeciliHayvanTur(h.tur);
      setSeciliHayvanId(h.id);
    } else if (sonuc.tur === "gida") {
      const g = sonuc.hamVeri as TuikGidaUrunu;
      setSeciliGidaId(g.id);
    } else if (sonuc.tur === "girdiler") {
      const g = sonuc.hamVeri as TuikGirdiMaliyeti;
      const idx = TUIK_GIRDI_FIYATLARI.findIndex((x) => x.girdi === g.girdi);
      if (idx !== -1) setSeciliGirdiIndex(idx);
    } else if (sonuc.tur === "ecrimisil") {
      const ufe = sonuc.hamVeri as TuikTarimUfeVerisi;
      setEcriBaslangicYil(ufe.yil);
    }
    setSerbestArama("");
    showToast(`"${sonuc.baslik}" seçildi ve hesaplama parametrelerine yüklendi.`);
  };

  // ==========================================================================
  // 3. AKTİF SEÇİMLER VE HESAPLAMA MOTORU
  // ==========================================================================
  const filtrelenmisBitkiselUrunler = useMemo(() => {
    return TUIK_TARIM_VERITABANI.filter((u) => {
      if (seciliIl !== "Tümü" && u.il !== seciliIl) return false;
      if (seciliKategori !== "Tümü" && u.kategori !== seciliKategori) return false;
      if (seciliArazi !== "Tümü" && u.araziTipi !== seciliArazi) return false;
      if (seciliYil !== "Tümü" && u.yil.toString() !== seciliYil) return false;
      return true;
    });
  }, [seciliIl, seciliKategori, seciliArazi, seciliYil]);

  const aktifBitkiselUrun = useMemo(() => {
    return (
      filtrelenmisBitkiselUrunler.find((u) => u.id === seciliUrunId) ||
      filtrelenmisBitkiselUrunler[0] ||
      TUIK_TARIM_VERITABANI[0]
    );
  }, [filtrelenmisBitkiselUrunler, seciliUrunId]);

  const filtrelenmisHayvanlar = useMemo(() => {
    return TUIK_HAYVANCILIK_VERITABANI.filter((h) => {
      if (seciliHayvanTur !== "Tümü" && h.tur !== seciliHayvanTur) return false;
      return true;
    });
  }, [seciliHayvanTur]);

  const aktifHayvan = useMemo(() => {
    return (
      filtrelenmisHayvanlar.find((h) => h.id === seciliHayvanId) ||
      filtrelenmisHayvanlar[0] ||
      TUIK_HAYVANCILIK_VERITABANI[0]
    );
  }, [filtrelenmisHayvanlar, seciliHayvanId]);

  const aktifGirdi = useMemo(() => {
    return TUIK_GIRDI_FIYATLARI[seciliGirdiIndex] || TUIK_GIRDI_FIYATLARI[0];
  }, [seciliGirdiIndex]);

  const aktifGidaUrunu = useMemo(() => {
    return TUIK_GIDA_ZAYIAT_VERITABANI.find((g) => g.id === seciliGidaId) || TUIK_GIDA_ZAYIAT_VERITABANI[0];
  }, [seciliGidaId]);

  // ==========================================================================
  // 4. METİN, TABLO VE DENETİM İZİ ÜRETİCİSİ (ŞARTNAME MADDE 3.3, 3.4 & 3.5)
  // ==========================================================================
  const hesaplamaSonuclari = useMemo(() => {
    const dekarSayisi = parseFloat(alanDekar) || 0;
    const basSayisi = parseInt(hayvanAdedi) || 0;
    const zayiatMiktari = parseFloat(gidaZayiatMiktari) || 0;

    let hesaplananTutarTl = 0;
    let sdmxAkisKodu = "TR_AGRI_PROD_2025";
    let tabloNo = "33714";
    let veriKaynaklari: string[] = [];
    const hesaplamaAdimlari: string[] = [];
    let uretilenMetin = "";

    // ------------------------------------------------------------------------
    // A) BİTKİSEL ÜRETİM & KAMULAŞTIRMA (NET GELİR KAPİTALİZASYONU)
    // ------------------------------------------------------------------------
    if (aktifMod === "bitkisel") {
      sdmxAkisKodu = "TR_AGRI_PROD_2025";
      tabloNo = "33714";
      veriKaynaklari = [
        "TÜİK Bitkisel Üretim İstatistikleri (Tablo 33714)",
        "T.C. Tarım ve Orman İlçe Müdürlüğü ÇEGF ve Maliyet Cetvelleri",
        "Yargıtay 5. Hukuk Dairesi Gelir Metodu Emsal Kararları",
      ];

      const kfo = ozelKfo || aktifBitkiselUrun.kfoOnerilen || 5;
      const brutGelir = aktifBitkiselUrun.brutGelirTlDa;
      const netGelir = aktifBitkiselUrun.netGelirTlDa;
      const birimM2 = parseFloat(((netGelir / 1000) / (kfo / 100)).toFixed(2));
      hesaplananTutarTl = dekarSayisi > 0 ? Math.round(dekarSayisi * 1000 * birimM2) : Math.round(netGelir);

      hesaplamaAdimlari.push(`Münavebe Ürünü: ${aktifBitkiselUrun.urun} (${aktifBitkiselUrun.il})`);
      hesaplamaAdimlari.push(`Dekar Verimi: ${aktifBitkiselUrun.verimKgDa} kg/da × ÇEGF Fiyatı: ₺${aktifBitkiselUrun.fiyatTlKg.toFixed(2)}/kg = Brüt Gelir: ₺${brutGelir.toLocaleString("tr-TR")}/da`);
      hesaplamaAdimlari.push(`Dekar Masrafı: ₺${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")}/da -> Dekar Net Gelir: ₺${netGelir.toLocaleString("tr-TR")}/da`);
      hesaplamaAdimlari.push(`Kapitalizasyon Faizi: %${kfo} -> Çıplak Arazi m² Birim Değeri: ₺${birimM2}/m²`);
      if (dekarSayisi > 0) {
        hesaplamaAdimlari.push(`Dava Konusu Alan: ${dekarSayisi} da (${dekarSayisi * 1000} m²) -> Toplam Arazi Bedeli: ₺${hesaplananTutarTl.toLocaleString("tr-TR")}`);
      }

      if (ciktiFormati === "tablo") {
        uretilenMetin = `\n| Kriter / Parametre | Resmî Cetvel Değeri | Yasal Açıklama |\n` +
          `|---|---|---|\n` +
          `| Taşınmazın Konumu & İli | ${aktifBitkiselUrun.il} (${aktifBitkiselUrun.bolge}) | Mutat Tarım Bölgesi |\n` +
          `| Münavebe Ürünü & Arazi Tipi | ${aktifBitkiselUrun.urun} | ${aktifBitkiselUrun.araziTipi} Tarım |\n` +
          `| Ortalama Dekar Verimi | ${aktifBitkiselUrun.verimKgDa.toLocaleString("tr-TR")} kg/da | TÜİK ${aktifBitkiselUrun.yil} Cetveli |\n` +
          `| Satış Fiyatı (ÇEGF) | ₺${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} / kg | Çiftçinin Eline Geçen |\n` +
          `| Dekar Brüt Geliri | ₺${brutGelir.toLocaleString("tr-TR")} / da | Verim × ÇEGF Fiyatı |\n` +
          `| Dekar Üretim Masrafı | ₺${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} / da | İlçe Tarım Resmi Cetveli |\n` +
          `| Dekar Başına Net Gelir | ₺${netGelir.toLocaleString("tr-TR")} / da | Brüt Gelir - Masraf |\n` +
          `| Kapitalizasyon Faizi (KFO) | %${kfo} | Yargıtay 5. HD Standardı |\n` +
          `| Çıplak Toprak Birim Değeri | ₺${birimM2} / m² | Net Gelir / (1000 × KFO) |\n`;
        if (dekarSayisi > 0) {
          uretilenMetin += `| **Dava Konusu Alan (${dekarSayisi} da)** | **₺${hesaplananTutarTl.toLocaleString("tr-TR")}** | **Toplam Kamulaştırma Bedeli** |\n`;
        }
      } else if (ciktiFormati === "madde") {
        uretilenMetin = `\n[TÜİK VE İLÇE TARIM RESMİ BİTKİSEL DEĞERLEME BULGULARI]\n` +
          `• Taşınmaz İli ve Vasfı: ${aktifBitkiselUrun.il} / ${aktifBitkiselUrun.araziTipi} Tarım Arazisi\n` +
          `• Münavebe Ürünü: ${aktifBitkiselUrun.urun} (${aktifBitkiselUrun.yil} Yılı)\n` +
          `• Resmi Dekar Verimi: ${aktifBitkiselUrun.verimKgDa} kg/da (Kaynak: ${aktifBitkiselUrun.kaynakNo})\n` +
          `• Çiftçi Satış Fiyatı (ÇEGF): ₺${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} / kg\n` +
          `• Dekar Masrafı ve Net Gelir: Masraf ₺${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} / Net Gelir ₺${netGelir.toLocaleString("tr-TR")} da\n` +
          `• Yargıtay KFO ve Birim Değer: %${kfo} KFO ile ₺${birimM2} / m²\n`;
        if (dekarSayisi > 0) {
          uretilenMetin += `• Toplam Takdir Olunan Arazi Bedeli: ${dekarSayisi} da × ₺${birimM2}/m² = ₺${hesaplananTutarTl.toLocaleString("tr-TR")}\n`;
        }
      } else {
        uretilenMetin = `\n\n[TÜİK VE İLÇE TARIM MÜDÜRLÜĞÜ RESMİ VERİ DEĞERLEMESİ]\n` +
          `Dava konusu taşınmazın ${aktifBitkiselUrun.araziTipi.toLowerCase()} tarım arazisi vasfında olduğu ve bölgede mutat münavebe ürününün "${aktifBitkiselUrun.urun}" olduğu tespit edilmiştir. ` +
          `TÜİK Çiftçinin Eline Geçen Fiyatlar (ÇEGF) bülteni ile İlçe Tarım ve Orman Müdürlüğü resmi cetvellerine göre ${aktifBitkiselUrun.yil} yılında ` +
          `dekar verimi ${aktifBitkiselUrun.verimKgDa.toLocaleString("tr-TR")} kg/da, satış fiyatı ${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} TL/kg, dekar üretim masrafı ${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} TL/da ` +
          `ve dekar başına net geliri ${netGelir.toLocaleString("tr-TR")} TL/da olarak belirlenmiştir. ` +
          `Yargıtay 5. Hukuk Dairesi'nin yerleşik içtihatları uyarınca yörenin şartları gözetilerek %${kfo} kapitalizasyon faiz oranı tatbik edilmiş, ` +
          `buna göre taşınmazın çıplak arazi birim değeri ${birimM2} TL/m² takdir olunmuştur.`;
        if (dekarSayisi > 0) {
          uretilenMetin += ` Dava konusu taşınmazın ${dekarSayisi.toLocaleString("tr-TR")} dekar (${(dekarSayisi * 1000).toLocaleString("tr-TR")} m²) yüzölçümü gözetildiğinde, ` +
            `toplam arazi kamulaştırma / kıymet takdiri bedeli ${hesaplananTutarTl.toLocaleString("tr-TR")} TL olarak hesaplanmıştır.`;
        }
        uretilenMetin += ` (Kaynak: ${aktifBitkiselUrun.kaynakNo})`;
      }
    }

    // ------------------------------------------------------------------------
    // B) HAYVANCILIK & GEBE DAMIZLIK BUZAĞI KAYBI (ŞARTNAME MADDE 3.3)
    // ------------------------------------------------------------------------
    else if (aktifMod === "hayvancilik") {
      sdmxAkisKodu = "TR_LIVESTOCK_2025";
      tabloNo = "33715";
      veriKaynaklari = [
        "TÜİK Hayvancılık İstatistikleri (Tablo 33715)",
        "Ulusal Kırmızı Et Konseyi (UKON) Borsa Fiyatları",
        "Damızlık Sığır Yetiştiricileri Merkez Birliği Rayiçleri",
      ];

      const birimRayic = aktifHayvan.ortalamaBasDegeriTl;
      const buzagiKaybi = (gebeDamizlikMi && aktifHayvan.gebeDamizlikBuzagiDegeriTl) ? aktifHayvan.gebeDamizlikBuzagiDegeriTl : 0;
      const sutKaybi = (gebeDamizlikMi && laktasyonSutKaybiEkle && aktifHayvan.laktasyonSutKaybiTl) ? aktifHayvan.laktasyonSutKaybiTl : 0;
      const basBasiToplamZarar = birimRayic + buzagiKaybi + sutKaybi;
      hesaplananTutarTl = basSayisi > 0 ? basSayisi * basBasiToplamZarar : basBasiToplamZarar;

      hesaplamaAdimlari.push(`Hayvan Türü ve Irkı: ${aktifHayvan.irk} (${aktifHayvan.tur} - ${aktifHayvan.kategori})`);
      hesaplamaAdimlari.push(`Canlı Ağırlık: ${aktifHayvan.canliAgirlikKg} kg • Karkas Randımanı: %${aktifHayvan.karkasRandimaniPct} (${aktifHayvan.karkasAgirligiKg} kg)`);
      hesaplamaAdimlari.push(`Canlı kg Fiyatı: ₺${aktifHayvan.canliBirimFiyatTlKg} • Karkas kg Fiyatı: ₺${aktifHayvan.karkasEtFiyatiTlKg} -> Birim Baş Rayici: ₺${birimRayic.toLocaleString("tr-TR")}`);
      if (gebeDamizlikMi && buzagiKaybi > 0) {
        hesaplamaAdimlari.push(`Gebe Damızlık Yoksun Kalınan Kâr: 1 Adet Sütten Kesilmiş Buzağı Kaybı (₺${buzagiKaybi.toLocaleString("tr-TR")})`);
      }
      if (sutKaybi > 0) {
        hesaplamaAdimlari.push(`Laktasyon Dönemi Süt Gelir Kaybı: ₺${sutKaybi.toLocaleString("tr-TR")}`);
      }
      hesaplamaAdimlari.push(`Dava Konusu Adet: ${basSayisi} Baş -> Toplam Zarar: ₺${hesaplananTutarTl.toLocaleString("tr-TR")}`);

      if (ciktiFormati === "tablo") {
        uretilenMetin = `\n| Kriter / Parametre | Resmî Rayiç Değeri | Açıklama |\n` +
          `|---|---|---|\n` +
          `| Hayvan Türü ve Irkı | ${aktifHayvan.irk} (${aktifHayvan.tur}) | ${aktifHayvan.kategori} |\n` +
          `| Ortalama Canlı Ağırlık | ${aktifHayvan.canliAgirlikKg} kg | TÜİK Standartları |\n` +
          `| Karkas Randımanı ve Ağırlığı | %${aktifHayvan.karkasRandimaniPct} (${aktifHayvan.karkasAgirligiKg} kg) | Net Et Verimi |\n` +
          `| Canlı / Karkas Birim Fiyatı | Canlı ₺${aktifHayvan.canliBirimFiyatTlKg}/kg • Karkas ₺${aktifHayvan.karkasEtFiyatiTlKg}/kg | Resmî Borsa Fiyatı |\n` +
          `| Birim Hayvan Değeri (Baş) | ₺${birimRayic.toLocaleString("tr-TR")} | TÜİK & Borsa Rayici |\n`;
        if (gebeDamizlikMi && buzagiKaybi > 0) {
          uretilenMetin += `| Yoksun Kalınan Kâr (Buzağı Kaybı) | ₺${buzagiKaybi.toLocaleString("tr-TR")} | Sütten Kesilmiş Buzağı Rayici |\n`;
        }
        if (sutKaybi > 0) {
          uretilenMetin += `| Laktasyon Dönemi Süt Kaybı | ₺${sutKaybi.toLocaleString("tr-TR")} | USK Çiğ Süt Rayici |\n`;
        }
        uretilenMetin += `| **Toplam Takdir Olunan Zarar (${basSayisi} Baş)** | **₺${hesaplananTutarTl.toLocaleString("tr-TR")}** | **TBK 49-50 Hükümleri Uyarınca** |\n`;
      } else {
        uretilenMetin = `\n\n[TÜİK VE RESMİ BORSA HAYVANCILIK KIYMET TAKDİRİ]\n` +
          `Dava konusu uyuşmazlıkta incelenen ${aktifHayvan.tur.toLowerCase()} vasfındaki ${aktifHayvan.irk} ırkı hayvanın; ortalama canlı ağırlığının ${aktifHayvan.canliAgirlikKg} kg, ` +
          `karkas et randımanının %${aktifHayvan.karkasRandimaniPct} (yaklaşık ${aktifHayvan.karkasAgirligiKg} kg karkas et) olduğu tespit edilmiştir. ` +
          `TÜİK ve Kırmızı Et Üreticileri Birliği resmi piyasa gerçekleşmelerine göre canlı kg fiyatı ${aktifHayvan.canliBirimFiyatTlKg.toFixed(2)} TL/kg, karkas kg fiyatı ${aktifHayvan.karkasEtFiyatiTlKg.toFixed(2)} TL/kg olup, ` +
          `birim damızlık/besi hayvan rayiç değeri ${birimRayic.toLocaleString("tr-TR")} TL olarak takdir edilmiştir.`;
        if (gebeDamizlikMi && buzagiKaybi > 0) {
          uretilenMetin += ` Hayvanın gebe damızlık vasfında olması sebebiyle TBK m. 50 uyarınca yoksun kalınan kâr kapsamında ${buzagiKaybi.toLocaleString("tr-TR")} TL sütten kesilmiş buzağı değeri ` +
            (sutKaybi > 0 ? `ve ${sutKaybi.toLocaleString("tr-TR")} TL laktasyon dönemi süt gelir kaybı eklenmiştir.` : `eklenmiştir.`);
        }
        if (basSayisi > 0) {
          uretilenMetin += ` Olayda telef olan / zarar gören ${basSayisi} baş hayvan için toplam tazminat tutarı ${hesaplananTutarTl.toLocaleString("tr-TR")} TL olarak hesaplanmıştır.`;
        }
        uretilenMetin += ` (Kaynak: ${aktifHayvan.resmiKaynak})`;
      }
    }

    // ------------------------------------------------------------------------
    // C) GIDA ZAYİATI & TÜFE MADDE SEPETİ (ŞARTNAME MADDE 3.3 & UAT SENARYO 4)
    // ------------------------------------------------------------------------
    else if (aktifMod === "gida") {
      sdmxAkisKodu = "TR_CPI_FOOD_2025";
      tabloNo = "41205";
      veriKaynaklari = [
        "TÜİK Tüketici Fiyat Endeksi (TÜFE) Gıda ve Alkolsüz İçecekler (Tablo 41205)",
        "Ulusal Süt Konseyi (USK) Referans Fiyat Bültenleri",
        "Türk Gıda Kodeksi Yönetmelik ve Tebliğleri",
      ];

      const fiyat =
        seciliGidaYil === 2024
          ? aktifGidaUrunu.fiyat2024
          : seciliGidaYil === 2025
          ? aktifGidaUrunu.fiyat2025
          : aktifGidaUrunu.fiyat2023;

      hesaplananTutarTl = Math.round(zayiatMiktari * fiyat);
      hesaplamaAdimlari.push(`Zayi Olan Ürün: ${aktifGidaUrunu.maddeAdi} (TÜİK Madde Kodu: ${aktifGidaUrunu.maddeKodu})`);
      hesaplamaAdimlari.push(`Resmî Birim Fiyatı (${seciliGidaYil}): ₺${fiyat.toLocaleString("tr-TR")} / ${aktifGidaUrunu.birim}`);
      hesaplamaAdimlari.push(`Zayiat / Bozulma Miktarı: ${zayiatMiktari.toLocaleString("tr-TR")} ${aktifGidaUrunu.birim}`);
      hesaplamaAdimlari.push(`Toplam Gıda Zayiat Bedeli: ${zayiatMiktari} × ₺${fiyat} = ₺${hesaplananTutarTl.toLocaleString("tr-TR")}`);

      if (ciktiFormati === "tablo") {
        uretilenMetin = `\n| Parametre | Resmî Değer | Dayanak |\n` +
          `|---|---|---|\n` +
          `| Gıda Maddesi | ${aktifGidaUrunu.maddeAdi} | ${aktifGidaUrunu.kategori} |\n` +
          `| TÜİK TÜFE Madde Kodu | ${aktifGidaUrunu.maddeKodu} | TÜİK Madde Sepeti |\n` +
          `| Resmî Birim Fiyatı (${seciliGidaYil}) | ₺${fiyat.toLocaleString("tr-TR")} / ${aktifGidaUrunu.birim} | ${aktifGidaUrunu.resmiKaynak} |\n` +
          `| Zayi Olan Miktar | ${zayiatMiktari.toLocaleString("tr-TR")} ${aktifGidaUrunu.birim} | Keşif & İnceleme Tutanağı |\n` +
          `| **Toplam Zayiat Tazminatı** | **₺${hesaplananTutarTl.toLocaleString("tr-TR")}** | **TBK 219 & 5996 s.K.** |\n`;
      } else {
        uretilenMetin = `\n\n[TÜİK VE RESMİ PİYASA GIDA ZAYİATI KIYMET TAKDİRİ]\n` +
          `Dosya kapsamında zayiatı, bozulması veya ayıplı teslimi incelenen "${aktifGidaUrunu.maddeAdi}" ürününe ilişkin olarak; ` +
          `TÜİK Tüketici Fiyat Endeksi (TÜFE) resmi verileri ve borsa gerçekleşmelerine göre ${seciliGidaYil} yılı birim fiyatının ` +
          `${fiyat.toLocaleString("tr-TR")} TL / ${aktifGidaUrunu.birim} olduğu belirlenmiştir. ` +
          `Maddi tespiti yapılan ${zayiatMiktari.toLocaleString("tr-TR")} ${aktifGidaUrunu.birim} ürünün toplam zayiat ve zarar tutarı ` +
          `${hesaplananTutarTl.toLocaleString("tr-TR")} TL olarak takdir olunmuştur. (Kaynak: ${aktifGidaUrunu.resmiKaynak}, TÜİK Madde Kodu: ${aktifGidaUrunu.maddeKodu})`;
      }
    }

    // ------------------------------------------------------------------------
    // D) TARIM-ÜFE ECRİMİSİL ZİNCİRİ (ŞARTNAME MADDE 3.3)
    // ------------------------------------------------------------------------
    else if (aktifMod === "ecrimisil") {
      sdmxAkisKodu = "TR_AGRI_PPI_2025";
      tabloNo = "41209";
      veriKaynaklari = [
        "TÜİK Tarım Ürünleri Üretici Fiyat Endeksi (Tarım-ÜFE) (Tablo 41209)",
        "Yargıtay 3. Hukuk Dairesi Ecrimisil Kümülatif Artış İçtihatları",
      ];

      const baslangicIndex = TUIK_TARIM_UFE_SERISI.findIndex((u) => u.yil === ecriBaslangicYil);
      if (baslangicIndex === -1) {
        hesaplananTutarTl = ecriBaslangicTutar;
      } else {
        let guncel = ecriBaslangicTutar;
        let toplam = guncel;
        hesaplamaAdimlari.push(`İlk Dönem Baz Kira/Net Gelir (${ecriBaslangicYil}): ₺${Math.round(guncel).toLocaleString("tr-TR")}`);
        for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
          const ufe = TUIK_TARIM_UFE_SERISI[i];
          guncel = guncel * (1 + ufe.aralikYillikArtisPct / 100);
          toplam += guncel;
          hesaplamaAdimlari.push(`${ufe.yil} Yılı: ₺${Math.round(guncel).toLocaleString("tr-TR")} (Tarım-ÜFE Artışı: +%${ufe.aralikYillikArtisPct})`);
        }
        hesaplananTutarTl = Math.round(toplam);

        if (ciktiFormati === "tablo") {
          uretilenMetin = `\n| İşgal Dönemi (Yıl) | Tarım-ÜFE Artışı (%) | Dönem Ecrimisil Tutarı (TL) | Resmî Açıklama |\n` +
            `|---|---|---|---|\n`;
          let tempGuncel = ecriBaslangicTutar;
          uretilenMetin += `| ${ecriBaslangicYil} (İlk Dönem) | Baz Yıl | ₺${Math.round(tempGuncel).toLocaleString("tr-TR")} | İlk Yıl Mahalli Kira/Net Gelir |\n`;
          for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
            const ufe = TUIK_TARIM_UFE_SERISI[i];
            tempGuncel = tempGuncel * (1 + ufe.aralikYillikArtisPct / 100);
            uretilenMetin += `| ${ufe.yil} | +%${ufe.aralikYillikArtisPct} | ₺${Math.round(tempGuncel).toLocaleString("tr-TR")} | ${ufe.aciklama} |\n`;
          }
          uretilenMetin += `| **TOPLAM ECRİMİSİL** | **Kümülatif** | **₺${hesaplananTutarTl.toLocaleString("tr-TR")}** | **Yargıtay 3. HD Uyumlu** |\n`;
        } else {
          uretilenMetin = `\n\n[TÜİK TARIM-ÜFE KÜMÜLATİF ECRİMİSİL CETVELİ]\n` +
            `Yargıtay 3. Hukuk Dairesi'nin yerleşik içtihatları gereğince ilk dönem belirlenen baz net tarımsal kira tutarına, takip eden her yıl için TÜİK Tarım-ÜFE yıllık değişim oranı tatbik edilmiştir:\n`;
          let tempGuncel = ecriBaslangicTutar;
          uretilenMetin += `• ${ecriBaslangicYil} Yılı (Baz Dönem): ${Math.round(tempGuncel).toLocaleString("tr-TR")} TL\n`;
          for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
            const ufe = TUIK_TARIM_UFE_SERISI[i];
            tempGuncel = tempGuncel * (1 + ufe.aralikYillikArtisPct / 100);
            uretilenMetin += `• ${ufe.yil} Yılı (Tarım-ÜFE +%${ufe.aralikYillikArtisPct}): ${Math.round(tempGuncel).toLocaleString("tr-TR")} TL\n`;
          }
          uretilenMetin += `TOPLAM ECRİMİSİL TAZMİNATI: ${hesaplananTutarTl.toLocaleString("tr-TR")} TL (Kaynak: TÜİK Resmî Tarım-ÜFE İstatistikleri)`;
        }
      }
    }

    // ------------------------------------------------------------------------
    // E) TARIMSAL GİRDİLER (TARIM-GFE)
    // ------------------------------------------------------------------------
    else if (aktifMod === "girdiler") {
      sdmxAkisKodu = "TR_AGRI_INP_2025";
      tabloNo = "37281";
      veriKaynaklari = ["TÜİK Tarımsal Girdi Fiyat Endeksi (Tarım-GFE) (Tablo 37281)"];

      const fiyat =
        seciliGirdiYil === 2024
          ? aktifGirdi.fiyat2024
          : seciliGirdiYil === 2025
          ? aktifGirdi.fiyat2025
          : aktifGirdi.fiyat2023;

      hesaplananTutarTl = Math.round(fiyat);
      hesaplamaAdimlari.push(`Girdi Kalemi: ${aktifGirdi.girdi} (${aktifGirdi.kategori})`);
      hesaplamaAdimlari.push(`Dönem: ${seciliGirdiYil} Yılı`);
      hesaplamaAdimlari.push(`Resmî Birim Fiyat: ₺${fiyat.toLocaleString("tr-TR")} / ${aktifGirdi.birim}`);

      uretilenMetin = `\n\n[TÜİK TARIM-GFE RESMİ GİRDİ MALİYET TESPİTİ]\n` +
        `Bilirkişi heyetimizce üretim masraflarının denetiminde; TÜİK Tarımsal Girdi Fiyat Endeksi (Tarım-GFE) gerçekleşmelerine göre ` +
        `"${aktifGirdi.girdi}" (${aktifGirdi.kategori}) resmi birim fiyatı ${seciliGirdiYil} yılı itibarıyla ` +
        `${fiyat.toLocaleString("tr-TR")} ${aktifGirdi.birim} olarak tespit edilmiş ve üretim maliyet analizinde bu resmi parametre esas alınmıştır. (Kaynak: TÜİK Tarım-GFE)`;
    }

    // ------------------------------------------------------------------------
    // F) DEFLATÖR (NOMİNAL -> REEL DÖNÜŞÜM)
    // ------------------------------------------------------------------------
    else if (aktifMod === "deflator") {
      sdmxAkisKodu = "TR_CPI_FOOD_2025";
      tabloNo = "41205";
      veriKaynaklari = ["TÜİK TÜFE & Tarım-ÜFE Kümülatif Deflatör Serisi"];

      const bazItem = TUIK_DEFLATOR_SERISI.find((d) => d.yil === deflatorBazYil) || TUIK_DEFLATOR_SERISI[0];
      const hedefItem = TUIK_DEFLATOR_SERISI.find((d) => d.yil === deflatorHedefYil) || TUIK_DEFLATOR_SERISI[TUIK_DEFLATOR_SERISI.length - 1];

      const katsayi = hedefItem.tufeEndeks / bazItem.tufeEndeks;
      hesaplananTutarTl = Math.round(deflatorNominalTutar * katsayi);

      hesaplamaAdimlari.push(`Baz Yıl (${deflatorBazYil}) TÜFE Endeksi: ${bazItem.tufeEndeks}`);
      hesaplamaAdimlari.push(`Hedef Yıl (${deflatorHedefYil}) TÜFE Endeksi: ${hedefItem.tufeEndeks}`);
      hesaplamaAdimlari.push(`Kümülatif Deflasyon Katsayısı: ${katsayi.toFixed(4)}`);
      hesaplamaAdimlari.push(`Nominal Tutar: ₺${deflatorNominalTutar.toLocaleString("tr-TR")} -> Reel Tutar (${deflatorHedefYil}): ₺${hesaplananTutarTl.toLocaleString("tr-TR")}`);

      uretilenMetin = `\n\n[TÜİK ENFLASYON DEFLATÖRÜ İLE REEL DEĞER HESAPLAMASI]\n` +
        `${deflatorBazYil} tarihindeki ${deflatorNominalTutar.toLocaleString("tr-TR")} TL tutarındaki zarar/tazminat miktarı, ` +
        `TÜİK resmi Tüketici Fiyat Endeksi (TÜFE) serisi esas alınarak ${deflatorHedefYil} yılı değerine güncellenmiştir. ` +
        `Baz dönem endeksi (${bazItem.tufeEndeks}) ile hedef dönem endeksi (${hedefItem.tufeEndeks}) arasındaki kümülatif değişim oranı (+%${((katsayi - 1) * 100).toFixed(2)}) ` +
        `tatbik edilmiş, güncellenmiş reel tazminat tutarı ${hesaplananTutarTl.toLocaleString("tr-TR")} TL olarak takdir olunmuştur.`;
    }

    // HMK m. 279 Değiştirilemez Referans Bloğu ve Künye Dipnotu Ekleme
    const hmkDipnotu = `\n\n> **[HMK m. 279 RESMÎ VERİ VE DENETİM REFERANS BLOĞU]**\n` +
      `> • **Yasal Dayanak:** 5429 sayılı Türkiye İstatistik Kanunu & HMK m. 279 (Bilirkişi hukuki değerlendirme yasağı)\n` +
      `> • **Veri Akış Kimliği (SDMX):** \`${sdmxAkisKodu}\` | **TÜİK Tablo No:** \`${tabloNo}\`\n` +
      `> • **Sorgu Zamanı:** ${new Date().toLocaleString("tr-TR")} | **Dava Türü:** ${seciliDavaTuru.toUpperCase()}\n` +
      `> • **Bağlayıcılık Şerhi:** İşbu veriler resmi kamu cetvellerinden aktarılmış olup, yalnızca teknik ve matematiksel tespite esas alınmıştır.`;

    const nihaiRaporMetni = uretilenMetin + hmkDipnotu;

    return {
      hesaplananTutarTl,
      sdmxAkisKodu,
      tabloNo,
      veriKaynaklari,
      hesaplamaAdimlari,
      nihaiRaporMetni,
      safMetin: uretilenMetin,
    };
  }, [
    aktifMod,
    ciktiFormati,
    alanDekar,
    hayvanAdedi,
    gebeDamizlikMi,
    laktasyonSutKaybiEkle,
    gidaZayiatMiktari,
    seciliIl,
    seciliKategori,
    seciliArazi,
    seciliYil,
    seciliUrunId,
    ozelKfo,
    seciliHayvanTur,
    seciliHayvanId,
    seciliGirdiIndex,
    seciliGirdiYil,
    seciliGidaId,
    seciliGidaYil,
    ecriBaslangicYil,
    ecriBaslangicTutar,
    deflatorBazYil,
    deflatorHedefYil,
    deflatorNominalTutar,
    seciliDavaTuru,
    aktifBitkiselUrun,
    aktifHayvan,
    aktifGirdi,
    aktifGidaUrunu,
  ]);

  // ==========================================================================
  // 5. RAPORA AKTARMA VE DENETİM İZİ PAKETLEME (ŞARTNAME MADDE 3.4 & 3.5)
  // ==========================================================================
  const handleRaporaAktar = () => {
    // 1. Metni rapora aktar
    onMetinEkle(hesaplamaSonuclari.nihaiRaporMetni);

    // 2. Denetim İzi (Audit Trail) üret
    const audit = generateTuikDenetimIzi({
      davaTuru: seciliDavaTuru,
      sdmxAkisKodu: hesaplamaSonuclari.sdmxAkisKodu,
      tabloNo: hesaplamaSonuclari.tabloNo,
      veriKaynaklari: hesaplamaSonuclari.veriKaynaklari,
      sorguParametreleri: {
        aktifMod,
        seciliIl,
        alanDekar,
        hayvanAdedi,
        gebeDamizlikMi,
        ecriBaslangicYil,
        ozelKfo,
      },
      hesaplamaAdimlari: hesaplamaSonuclari.hesaplamaAdimlari,
      hesaplananTutarTl: hesaplamaSonuclari.hesaplananTutarTl,
    });

    setSonDenetimIzi(audit);

    // 3. Rapor ekleri listesine ekle (Şartname Madde 3.5)
    if (onEkEkle) {
      const yeniEk: RaporEki = {
        id: `ek-${Date.now()}`,
        ad: `TÜİK Resmî Veri Denetim İzi (${audit.id})`,
        tur: "resmi_yazi",
        dosyaAdi: `${audit.id}.json`,
        boyut: "12 KB",
        yuklemeTarihi: new Date().toLocaleDateString("tr-TR"),
        aciklama: `5429 sayılı Kanun ve HMK 279 uyarınca oluşturulmuş dijital imzalı denetim izi paketi. Sağlama: ${audit.dijitalSaglamaHash}`,
      };
      onEkEkle(yeniEk);
    }

    showToast(`TÜİK verisi ve Denetim İzi (#${audit.id}) Bölüm ${currentStep}'e başarıyla aktarıldı!`);
    onClose();
  };

  // ==========================================================================
  // 6. CSV İÇE AKTARMA (IMPORT) (ŞARTNAME EK-2)
  // ==========================================================================
  const handleCsvYukle = () => {
    const sonuc = parseCegfCsv(csvGirdisi);
    if (sonuc.basarili) {
      setCsvMesaji({ tipi: "basari", metin: sonuc.mesaj });
      showToast(sonuc.mesaj);
    } else {
      setCsvMesaji({ tipi: "hata", metin: sonuc.mesaj });
    }
  };

  // ==========================================================================
  // 7. VERİLERİ CSV OLARAK DIŞA AKTARMA (EXPORT) (ŞARTNAME MADDE 3.2)
  // ==========================================================================
  const handleVerileriCsvIndir = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (aktifMod === "bitkisel") {
      csvContent += "İl,Ürün,Kategori,AraziTipi,Yıl,Verim(kg/da),ÇEGF(TL/kg),Masraf(TL/da),NetGelir(TL/da),KFO(%),Kaynak\n";
      TUIK_TARIM_VERITABANI.forEach((item) => {
        csvContent += `"${item.il}","${item.urun}","${item.kategori}","${item.araziTipi}",${item.yil},${item.verimKgDa},${item.fiyatTlKg},${item.masrafTlDa},${item.netGelirTlDa},${item.kfoOnerilen},"${item.kaynakNo}"\n`;
      });
    } else if (aktifMod === "hayvancilik") {
      csvContent += "Tür,Irk,Kategori,CanlıAğırlık(kg),KarkasRandımanı(%),CanlıFiyat(TL/kg),KarkasFiyat(TL/kg),BaşRayici(TL),Kaynak\n";
      TUIK_HAYVANCILIK_VERITABANI.forEach((item) => {
        csvContent += `"${item.tur}","${item.irk}","${item.kategori}",${item.canliAgirlikKg},${item.karkasRandimaniPct},${item.canliBirimFiyatTlKg},${item.karkasEtFiyatiTlKg},${item.ortalamaBasDegeriTl},"${item.resmiKaynak}"\n`;
      });
    } else {
      csvContent += "Hesaplama Adımı,Parametre\n";
      hesaplamaSonuclari.hesaplamaAdimlari.forEach((adim) => {
        csvContent += `"${adim}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TUIK_${aktifMod.toUpperCase()}_VERILERI_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Veri seti CSV formatında dışa aktarıldı.");
  };

  // UAT Senaryosunu Çalıştırma
  const handleUatCalistir = (senaryo: (typeof UAT_TEST_SENARYOLARI)[0]) => {
    setAnaSekme("sorgu");
    setSeciliDavaTuru(senaryo.davaTuru);

    if (senaryo.davaTuru === "kamulastirma") {
      setAktifMod("bitkisel");
      setSeciliIl(senaryo.parametreler.il);
      setSeciliArazi(senaryo.parametreler.araziTipi);
      setAlanDekar(senaryo.parametreler.dekar.toString());
      setOzelKfo(senaryo.parametreler.kfo);
    } else if (senaryo.davaTuru === "ecrimisil") {
      setAktifMod("ecrimisil");
      setEcriBaslangicYil(senaryo.parametreler.bazYil);
      setEcriBaslangicTutar(senaryo.parametreler.bazTutar);
    } else if (senaryo.davaTuru === "hayvan_telefi") {
      setAktifMod("hayvancilik");
      setSeciliHayvanTur("Büyükbaş");
      setHayvanAdedi(senaryo.parametreler.basAdedi.toString());
      setGebeDamizlikMi(senaryo.parametreler.gebeMi);
    } else if (senaryo.davaTuru === "gida_zayiat") {
      setAktifMod("gida");
      setGidaZayiatMiktari(senaryo.parametreler.miktar.toString());
    }

    showToast(`${senaryo.ad} parametreleri başarıyla yüklendi.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[8px] shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-[hsl(var(--foreground))]">
        {/* ================================================================== */}
        {/* MODAL HEADER */}
        {/* ================================================================== */}
        <div className="bg-[#0F3D2E] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#0F3D2E]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[6px] bg-white/10 flex items-center justify-center text-amber-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-[17px] font-bold text-[#FBF9F4] tracking-wide">
                  TÜİK ve Resmî Maliyet Verisi Aktar Modülü
                </h3>
                <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-medium">
                  TÜİK-BİL-2026/01-REV01
                </span>
                <span className="hidden sm:inline-block font-mono text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  HMK m. 279 Uyumlu
                </span>
              </div>
              <p className="text-[12px] text-emerald-200/80">
                5429 sayılı İstatistik Kanunu & Resmî ÇEGF / Tarım-ÜFE / Tarım-GFE Bilirkişi Veri Tezgâhı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Kullanıcı Profili Seçimi (Şartname Madde 1.3) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-[6px] text-[11px] border border-white/10">
              <span className="text-emerald-300/80">Profil:</span>
              <select
                value={kullaniciRolu}
                onChange={(e) => setKullaniciRolu(e.target.value as KullaniciRolu)}
                className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="bilirkisi" className="bg-[#0F3D2E] text-white">Bilirkişi (Yetkili)</option>
                <option value="denetci" className="bg-[#0F3D2E] text-white">Denetçi / Hâkim (Salt-Okunur)</option>
                <option value="yonetici" className="bg-[#0F3D2E] text-white">Sistem Yöneticisi</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[6px] hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* DAVA TÜRÜ ÖN TANIMLI ŞABLONLARI (ŞARTNAME EK-1) */}
        {/* ================================================================== */}
        <div className="bg-[#FBF9F3] dark:bg-[#1a2621] px-5 py-2.5 border-b border-[hsl(var(--border))] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#0F3D2E] dark:text-emerald-300 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#B45309]" />
              Dava Şablonu:
            </span>
            <div className="flex flex-wrap gap-1">
              {DAVA_TURU_SABLONLARI.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleDavaTuruDegistir(s.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-[4px] font-medium transition-all cursor-pointer ${
                    seciliDavaTuru === s.id
                      ? "bg-[#0F3D2E] text-white shadow-xs"
                      : "bg-white dark:bg-stone-800 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-stone-100"
                  }`}
                  title={s.rehberAciklama}
                >
                  {s.ad.split("(")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Ana Sekme Butonları */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAnaSekme("sorgu")}
              className={`text-[12px] px-3 py-1 rounded-[4px] font-medium flex items-center gap-1.5 cursor-pointer ${
                anaSekme === "sorgu"
                  ? "bg-[#B45309] text-white font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Sorgu & Hesapla
            </button>

            <button
              type="button"
              onClick={() => setAnaSekme("ithalat")}
              className={`text-[12px] px-3 py-1 rounded-[4px] font-medium flex items-center gap-1.5 cursor-pointer ${
                anaSekme === "ithalat"
                  ? "bg-[#B45309] text-white font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              ÇEGF İçe/Dışa Aktar
            </button>

            <button
              type="button"
              onClick={() => setAnaSekme("denetim")}
              className={`text-[12px] px-3 py-1 rounded-[4px] font-medium flex items-center gap-1.5 cursor-pointer ${
                anaSekme === "denetim"
                  ? "bg-[#B45309] text-white font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Denetim İzi
            </button>

            <button
              type="button"
              onClick={() => setAnaSekme("uat")}
              className={`text-[12px] px-3 py-1 rounded-[4px] font-medium flex items-center gap-1.5 cursor-pointer ${
                anaSekme === "uat"
                  ? "bg-[#B45309] text-white font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              UAT Testleri
            </button>

            <button
              type="button"
              onClick={() => setAnaSekme("sdmx")}
              className={`text-[12px] px-3 py-1 rounded-[4px] font-medium flex items-center gap-1.5 cursor-pointer ${
                anaSekme === "sdmx"
                  ? "bg-[#B45309] text-white font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              SDMX Künyesi
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* ANA İÇERİK ALANI */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: SORGULAMA VE HESAPLAMA */}
          {anaSekme === "sorgu" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* SOL KOLON: PARAMETRELER VE VERİ SEÇİMİ (7 Kolon) */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. SERBEST ARAMA ÇUBUĞU */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[hsl(var(--muted-foreground))]">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={serbestArama}
                    onChange={(e) => setSerbestArama(e.target.value)}
                    placeholder="Serbest metinle ara (örn: Konya buğday, Simental tosun, çiğ süt, ÜRE gübre, ecrimisil)..."
                    className="w-full pl-9 pr-9 py-2 text-[13px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] focus:outline-hidden focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]"
                  />
                  {serbestArama && (
                    <button
                      type="button"
                      onClick={() => setSerbestArama("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Serbest Arama Sonuç Listesi */}
                {serbestArama.trim() && (
                  <div className="bg-[hsl(var(--card))] border border-[#B45309]/30 rounded-[6px] p-2.5 max-h-56 overflow-y-auto shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))] pb-1 border-b border-[hsl(var(--border))]">
                      <span>Bulunan Kayıtlar ({serbestAramaSonuclari.length})</span>
                      <span className="text-[10px]">Tıklayarak hesaplama parametrelerine yükleyin</span>
                    </div>
                    {serbestAramaSonuclari.length === 0 ? (
                      <div className="text-[12px] text-stone-500 py-3 text-center">
                        "{serbestArama}" ile eşleşen resmi kayıt bulunamadı. Filtre sekmelerini kullanabilirsiniz.
                      </div>
                    ) : (
                      serbestAramaSonuclari.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleAramaSonucuSec(item)}
                          className="p-2 rounded-[4px] hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 cursor-pointer transition-colors flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-[12px] font-medium text-[hsl(var(--foreground))] flex items-center gap-1.5">
                              <span>{item.baslik}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                {item.etiket}
                              </span>
                            </div>
                            <div className="text-[11px] text-[hsl(var(--muted-foreground))]">
                              {item.detay1}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-[12px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                              {item.birimDeger}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 2. VERİ MODU SEKMELERİ */}
                <div className="flex flex-wrap gap-1 border-b border-[hsl(var(--border))] pb-2">
                  <button
                    type="button"
                    onClick={() => setAktifMod("bitkisel")}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      aktifMod === "bitkisel"
                        ? "bg-[#0F3D2E] text-white"
                        : "bg-[hsl(var(--background))] hover:bg-stone-200/50 text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <Wheat className="w-3.5 h-3.5" />
                    Bitkisel & ÇEGF
                  </button>

                  <button
                    type="button"
                    onClick={() => setAktifMod("hayvancilik")}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      aktifMod === "hayvancilik"
                        ? "bg-[#0F3D2E] text-white"
                        : "bg-[hsl(var(--background))] hover:bg-stone-200/50 text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <Beef className="w-3.5 h-3.5" />
                    Hayvancılık & Karkas
                  </button>

                  <button
                    type="button"
                    onClick={() => setAktifMod("gida")}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      aktifMod === "gida"
                        ? "bg-[#0F3D2E] text-white"
                        : "bg-[hsl(var(--background))] hover:bg-stone-200/50 text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    Gıda Zayiatı
                  </button>

                  <button
                    type="button"
                    onClick={() => setAktifMod("ecrimisil")}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      aktifMod === "ecrimisil"
                        ? "bg-[#0F3D2E] text-white"
                        : "bg-[hsl(var(--background))] hover:bg-stone-200/50 text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Tarım-ÜFE Ecrimisil
                  </button>

                  <button
                    type="button"
                    onClick={() => setAktifMod("girdiler")}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      aktifMod === "girdiler"
                        ? "bg-[#0F3D2E] text-white"
                        : "bg-[hsl(var(--background))] hover:bg-stone-200/50 text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <Fuel className="w-3.5 h-3.5" />
                    Tarım-GFE Girdiler
                  </button>

                  <button
                    type="button"
                    onClick={() => setAktifMod("deflator")}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      aktifMod === "deflator"
                        ? "bg-[#0F3D2E] text-white"
                        : "bg-[hsl(var(--background))] hover:bg-stone-200/50 text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Enflasyon Deflatörü
                  </button>
                </div>

                {/* 3. MOD BAZLI PARAMETRİK FİLTRELER */}
                {/* A) BİTKİSEL MODU */}
                {aktifMod === "bitkisel" && (
                  <div className="bg-[hsl(var(--background))] p-3.5 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          İl Seçimi
                        </label>
                        <select
                          value={seciliIl}
                          onChange={(e) => setSeciliIl(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden"
                        >
                          <option value="Tümü">Tüm İller</option>
                          {TUIK_IL_LISTESI.map((il) => (
                            <option key={il} value={il}>{il}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Ürün Kategorisi
                        </label>
                        <select
                          value={seciliKategori}
                          onChange={(e) => setSeciliKategori(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden"
                        >
                          <option value="Tümü">Tüm Kategoriler</option>
                          {TUIK_KATEGORI_LISTESI.map((kat) => (
                            <option key={kat} value={kat}>{kat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Arazi Tipi
                        </label>
                        <select
                          value={seciliArazi}
                          onChange={(e) => setSeciliArazi(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden"
                        >
                          <option value="Tümü">Kuru + Sulu</option>
                          <option value="Kuru">Kuru Tarım</option>
                          <option value="Sulu">Sulu Tarım</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Resmi Yıl
                        </label>
                        <select
                          value={seciliYil}
                          onChange={(e) => setSeciliYil(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden"
                        >
                          <option value="Tümü">Tüm Yıllar</option>
                          {TUIK_YIL_LISTESI.map((y) => (
                            <option key={y} value={y.toString()}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Münavebe Ürünü Seçimi */}
                    <div>
                      <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                        Münavebe Ürünü ({filtrelenmisBitkiselUrunler.length} Resmî Kayıt)
                      </label>
                      <select
                        value={seciliUrunId || aktifBitkiselUrun.id}
                        onChange={(e) => {
                          setSeciliUrunId(e.target.value);
                          const u = TUIK_TARIM_VERITABANI.find((x) => x.id === e.target.value);
                          if (u) setOzelKfo(u.kfoOnerilen);
                        }}
                        className="w-full text-[12px] py-2 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-medium"
                      >
                        {filtrelenmisBitkiselUrunler.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.il} — {u.urun} ({u.yil} • {u.araziTipi} • Verim: {u.verimKgDa} kg/da • ÇEGF: ₺{u.fiyatTlKg.toFixed(2)} • Net: ₺{u.netGelirTlDa.toLocaleString("tr-TR")}/da)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Çarpanlar: Dekar Alanı ve KFO */}
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[hsl(var(--border))]">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Dava Konusu Alan (Dekar)
                        </label>
                        <input
                          type="number"
                          value={alanDekar}
                          onChange={(e) => setAlanDekar(e.target.value)}
                          placeholder="Dekar alanı..."
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Kapitalizasyon Faizi (KFO %)
                        </label>
                        <select
                          value={ozelKfo}
                          onChange={(e) => setOzelKfo(parseFloat(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        >
                          <option value={4}>%4 (Yargıtay Standart 1. Sınıf Sulu)</option>
                          <option value={5}>%5 (Yargıtay Sulu Tarla Standardı)</option>
                          <option value={6}>%6 (Yargıtay Kuru Tarla Standardı)</option>
                          <option value={7}>%7 (Taşlı / Marjinal Kuru Arazi)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* B) HAYVANCILIK MODU */}
                {aktifMod === "hayvancilik" && (
                  <div className="bg-[hsl(var(--background))] p-3.5 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Hayvan Türü
                        </label>
                        <select
                          value={seciliHayvanTur}
                          onChange={(e) => setSeciliHayvanTur(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden"
                        >
                          <option value="Tümü">Tüm Türler</option>
                          <option value="Büyükbaş">Büyükbaş</option>
                          <option value="Küçükbaş">Küçükbaş</option>
                          <option value="Kanatlı">Kanatlı</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Telef / Zayiat Adedi (Baş)
                        </label>
                        <input
                          type="number"
                          value={hayvanAdedi}
                          onChange={(e) => setHayvanAdedi(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                        Irk ve Rayiç Seçimi
                      </label>
                      <select
                        value={seciliHayvanId || aktifHayvan.id}
                        onChange={(e) => setSeciliHayvanId(e.target.value)}
                        className="w-full text-[12px] py-2 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-medium"
                      >
                        {filtrelenmisHayvanlar.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.irk} ({h.tur} • {h.kategori} • Canlı: {h.canliAgirlikKg} kg • Karkas: %{h.karkasRandimaniPct} • Rayiç: ₺{h.ortalamaBasDegeriTl.toLocaleString("tr-TR")})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Gebe Damızlık Buzağı Kaybı (Şartname Madde 3.3) */}
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-[4px] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk-gebe"
                          checked={gebeDamizlikMi}
                          onChange={(e) => setGebeDamizlikMi(e.target.checked)}
                          className="rounded-xs text-[#0F3D2E] focus:ring-0"
                        />
                        <label htmlFor="chk-gebe" className="text-[12px] font-semibold text-[#B45309] cursor-pointer">
                          Gebe Damızlık Hayvan (Buzağı Kaybı / Yoksun Kalınan Kâr) Ekle (+₺35.000 / baş)
                        </label>
                      </div>

                      {gebeDamizlikMi && (
                        <div className="flex items-center gap-2 pl-5">
                          <input
                            type="checkbox"
                            id="chk-sut"
                            checked={laktasyonSutKaybiEkle}
                            onChange={(e) => setLaktasyonSutKaybiEkle(e.target.checked)}
                            className="rounded-xs text-[#0F3D2E] focus:ring-0"
                          />
                          <label htmlFor="chk-sut" className="text-[11px] text-[hsl(var(--foreground))] cursor-pointer">
                            Laktasyon dönemi süt gelir kaybı tazminatını ekle (+₺28.000)
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* C) GIDA ZAYİATI MODU */}
                {aktifMod === "gida" && (
                  <div className="bg-[hsl(var(--background))] p-3.5 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Gıda Maddesi Seçimi
                        </label>
                        <select
                          value={seciliGidaId}
                          onChange={(e) => setSeciliGidaId(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-medium"
                        >
                          {TUIK_GIDA_ZAYIAT_VERITABANI.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.maddeAdi} ({g.kategori} • ₺{g.fiyat2025}/{g.birim})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Zayiat / Hasar Miktarı ({aktifGidaUrunu.birim})
                        </label>
                        <input
                          type="number"
                          value={gidaZayiatMiktari}
                          onChange={(e) => setGidaZayiatMiktari(e.target.value)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Fiyat Yılı (TÜFE / ÇEGF)
                        </label>
                        <select
                          value={seciliGidaYil}
                          onChange={(e) => setSeciliGidaYil(parseInt(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        >
                          <option value={2026}>2026 Yılı Projeksiyon</option>
                          <option value={2025}>2025 Yılı Kesinleşen (Önerilen)</option>
                          <option value={2024}>2024 Yılı Kesinleşen</option>
                          <option value={2023}>2023 Yılı</option>
                        </select>
                      </div>
                      <div className="flex flex-col justify-end">
                        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">TÜİK Madde Kodu:</span>
                        <span className="font-mono text-[12px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                          {aktifGidaUrunu.maddeKodu}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* D) TARIM-ÜFE ECRİMİSİL MODU */}
                {aktifMod === "ecrimisil" && (
                  <div className="bg-[hsl(var(--background))] p-3.5 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Başlangıç İşgal Yılı
                        </label>
                        <select
                          value={ecriBaslangicYil}
                          onChange={(e) => setEcriBaslangicYil(parseInt(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        >
                          <option value={2020}>2020 Yılı (Baz)</option>
                          <option value={2021}>2021 Yılı</option>
                          <option value={2022}>2022 Yılı (Önerilen)</option>
                          <option value={2023}>2023 Yılı</option>
                          <option value={2024}>2024 Yılı</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          İlk Yıl Baz Kira / Gelir Tutarı (TL)
                        </label>
                        <input
                          type="number"
                          value={ecriBaslangicTutar}
                          onChange={(e) => setEcriBaslangicTutar(parseFloat(e.target.value) || 0)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                      Yargıtay 3. Hukuk Dairesi ilamı uyarınca ilk dönemden sonraki yıllar için TÜİK Tarım-ÜFE yıllık değişim oranı zincirleme uygulanarak toplam ecrimisil bulunur.
                    </p>
                  </div>
                )}

                {/* E) GİRDİLER MODU */}
                {aktifMod === "girdiler" && (
                  <div className="bg-[hsl(var(--background))] p-3.5 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Girdi Türü (Tarım-GFE)
                        </label>
                        <select
                          value={seciliGirdiIndex}
                          onChange={(e) => setSeciliGirdiIndex(parseInt(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-medium"
                        >
                          {TUIK_GIRDI_FIYATLARI.map((g, idx) => (
                            <option key={g.girdi} value={idx}>
                              {g.girdi} ({g.kategori})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Endeks Yılı
                        </label>
                        <select
                          value={seciliGirdiYil}
                          onChange={(e) => setSeciliGirdiYil(parseInt(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        >
                          <option value={2026}>2026 Yılı Projeksiyon</option>
                          <option value={2025}>2025 Yılı Kesinleşen</option>
                          <option value={2024}>2024 Yılı Kesinleşen</option>
                          <option value={2023}>2023 Yılı</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* F) DEFLATÖR MODU */}
                {aktifMod === "deflator" && (
                  <div className="bg-[hsl(var(--background))] p-3.5 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Baz Yıl (Eski)
                        </label>
                        <select
                          value={deflatorBazYil}
                          onChange={(e) => setDeflatorBazYil(parseInt(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        >
                          {TUIK_DEFLATOR_SERISI.map((d) => (
                            <option key={d.yil} value={d.yil}>{d.yil}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Hedef Yıl (Güncel)
                        </label>
                        <select
                          value={deflatorHedefYil}
                          onChange={(e) => setDeflatorHedefYil(parseInt(e.target.value))}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        >
                          {TUIK_DEFLATOR_SERISI.map((d) => (
                            <option key={d.yil} value={d.yil}>{d.yil}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                          Nominal Tutar (TL)
                        </label>
                        <input
                          type="number"
                          value={deflatorNominalTutar}
                          onChange={(e) => setDeflatorNominalTutar(parseFloat(e.target.value) || 0)}
                          className="w-full text-[12px] py-1.5 px-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[4px] focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hata Yönetimi Bilgi Notu (Şartname Madde 4.2) */}
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-[6px] text-[11px]">
                  <Info className="w-4 h-4 text-[#0F3D2E] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0F3D2E] dark:text-emerald-300">
                      HMK m. 279 & TÜİK ÇEGF Doğrulama Şerhi:
                    </span>
                    <span className="text-[hsl(var(--muted-foreground))] ml-1">
                      Veriler 5429 sayılı Kanun kapsamında resmî istatistik cetvelleriyle birebir eşleştirilmiştir. Bilirkişi hukuki değerlendirme yapmaksızın yalnızca teknik hesaplamayı mahkemeye sunar.
                    </span>
                  </div>
                </div>
              </div>

              {/* SAĞ KOLON: CANLI ÖNİZLEME, FORMAT SEÇİMİ VE RAPORA AKTAR (5 Kolon) */}
              <div className="lg:col-span-5 flex flex-col bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px] p-4">
                <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--border))] mb-3">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#B45309]" />
                    <span className="font-serif text-[14px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                      Rapor Çıktı Formatı
                    </span>
                  </div>

                  {/* Format Seçici Butonlar */}
                  <div className="flex items-center gap-1 bg-[hsl(var(--card))] p-0.5 rounded-[4px] border border-[hsl(var(--border))]">
                    <button
                      type="button"
                      onClick={() => setCiktiFormati("paragraf")}
                      className={`px-2 py-1 text-[11px] rounded-[3px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        ciktiFormati === "paragraf"
                          ? "bg-[#0F3D2E] text-white"
                          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      }`}
                      title="Gerekçeli Mahkeme Metni"
                    >
                      <FileText className="w-3 h-3" />
                      Metin
                    </button>

                    <button
                      type="button"
                      onClick={() => setCiktiFormati("tablo")}
                      className={`px-2 py-1 text-[11px] rounded-[3px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        ciktiFormati === "tablo"
                          ? "bg-[#0F3D2E] text-white"
                          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      }`}
                      title="Resmî Cetvel Tablosu"
                    >
                      <TableIcon className="w-3 h-3" />
                      Tablo
                    </button>

                    <button
                      type="button"
                      onClick={() => setCiktiFormati("madde")}
                      className={`px-2 py-1 text-[11px] rounded-[3px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        ciktiFormati === "madde"
                          ? "bg-[#0F3D2E] text-white"
                          : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                      }`}
                      title="Özet Madde İmleri"
                    >
                      <ListFilter className="w-3 h-3" />
                      Madde
                    </button>
                  </div>
                </div>

                {/* Toplam Hesaplanan Bedel Özeti */}
                <div className="bg-[#0F3D2E]/5 border border-[#0F3D2E]/20 rounded-[6px] p-3 mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] block">
                      Hesaplanan Takdir Bedeli
                    </span>
                    <span className="font-serif text-[18px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                      ₺{hesaplamaSonuclari.hesaplananTutarTl.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] block">
                      SDMX: {hesaplamaSonuclari.sdmxAkisKodu}
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      Tablo No: {hesaplamaSonuclari.tabloNo}
                    </span>
                  </div>
                </div>

                {/* Canlı Önizleme Metin Kutusu */}
                <div className="flex-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] p-3 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[300px] select-text">
                  <pre className="whitespace-pre-wrap font-sans text-[12px] text-[hsl(var(--foreground))]">
                    {hesaplamaSonuclari.nihaiRaporMetni.trim()}
                  </pre>
                </div>

                {/* Eylem Butonları */}
                <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleVerileriCsvIndir}
                      className="px-2.5 py-1.5 rounded-[4px] text-[11px] font-medium border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
                      title="Veri tablosunu CSV olarak indir"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CSV İndir
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(hesaplamaSonuclari.nihaiRaporMetni);
                        showToast("Rapor metni panoya kopyalandı!");
                      }}
                      className="px-2.5 py-1.5 rounded-[4px] text-[11px] font-medium border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
                      title="Metni kopyala"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Kopyala
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRaporaAktar}
                    className="px-4 py-2 rounded-[6px] text-[13px] font-bold bg-[#0F3D2E] hover:bg-[#15543F] text-white shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-98"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Rapora Aktar (Bölüm {currentStep})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ÇEGF İÇE / DIŞA AKTARMA (ŞARTNAME MADDE 3.2 & EK-2) */}
          {anaSekme === "ithalat" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-[8px] space-y-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#0F3D2E] dark:text-emerald-300" />
                  <h4 className="font-serif text-[15px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                    ÇEGF Maliyet Cetveli İçe Aktarma (CSV Formatında)
                  </h4>
                </div>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))]">
                  İl/İlçe Tarım ve Orman Müdürlüklerinden veya Ticaret Borsalarından temin ettiğiniz ÇEGF cetvellerini aşağıdaki şablona göre içe aktarabilirsiniz.
                </p>

                {/* CSV Format Şablonu */}
                <div className="bg-stone-100 dark:bg-stone-900 p-2.5 rounded-[4px] font-mono text-[11px] border border-stone-200 dark:border-stone-800">
                  <span className="text-[hsl(var(--muted-foreground))] block mb-1">Beklenen CSV Formatı:</span>
                  <code>İl,Ürün,Yıl,Verim(kg/da),Fiyat(TL/kg),Masraf(TL/da),AraziTipi</code><br />
                  <code className="text-emerald-600 dark:text-emerald-400">Ankara,Buğday (Ekmeklik),2025,480,12.00,3000,Sulu</code>
                </div>

                <textarea
                  value={csvGirdisi}
                  onChange={(e) => setCsvGirdisi(e.target.value)}
                  placeholder="CSV verisini buraya yapıştırın..."
                  rows={6}
                  className="w-full text-[12px] font-mono p-2.5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] focus:outline-hidden"
                />

                {csvMesaji && (
                  <div className={`p-2.5 rounded-[4px] text-[12px] flex items-center gap-2 ${
                    csvMesaji.tipi === "basari" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "bg-red-500/10 text-red-600 border border-red-500/30"
                  }`}>
                    {csvMesaji.tipi === "basari" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{csvMesaji.metin}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCsvGirdisi(
                        "İl,Ürün,Yıl,Verim,Fiyat,Masraf,AraziTipi\n" +
                        "Konya,Buğday (Makarnalık),2025,420,13.50,2800,Kuru\n" +
                        "Konya,Dane Mısır,2025,1250,8.20,5400,Sulu\n" +
                        "Konya,Şeker Pancarı,2025,6800,2.40,9200,Sulu"
                      );
                    }}
                    className="text-[12px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Örnek Konya ÇEGF Verisi Doldur
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleVerileriCsvIndir}
                      className="btn-secondary h-9 px-3 text-[12px] flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Mevcut Veritabanını İndir
                    </button>

                    <button
                      type="button"
                      onClick={handleCsvYukle}
                      className="btn-primary h-9 px-4 text-[12px] flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      ÇEGF Verilerini Doğrula ve Yükle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DENETİM İZİ & DOĞRULAMA PAKETİ (ŞARTNAME MADDE 3.5 & EK-4) */}
          {anaSekme === "denetim" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-[8px] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#B45309]" />
                    <h4 className="font-serif text-[15px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                      Veri Aktarım Denetim İzi (Audit Trail)
                    </h4>
                  </div>
                  <span className="font-mono text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    HMK m. 279 & 5429 s.K. Denetlenebilirlik
                  </span>
                </div>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))]">
                  Mahkeme denetimi ve bilirkişi itirazlarında her aktarılan verinin kaynağı, zaman damgası ve matematiksel sağlama kodu kaydedilir.
                </p>

                {sonDenetimIzi ? (
                  <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] p-4 space-y-3 font-mono text-[12px]">
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[hsl(var(--border))]">
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))] block text-[11px]">Denetim Kimliği (ID):</span>
                        <span className="font-bold text-[#0F3D2E] dark:text-emerald-300">{sonDenetimIzi.id}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))] block text-[11px]">Zaman Damgası (ISO):</span>
                        <span>{sonDenetimIzi.olusturmaTarihi}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))] block text-[11px]">Bilirkişi Sicil / Ad:</span>
                        <span>{sonDenetimIzi.bilirkisiAdi} ({sonDenetimIzi.bilirkisiSicil})</span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))] block text-[11px]">Dijital Sağlama Hash:</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">{sonDenetimIzi.dijitalSaglamaHash}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[hsl(var(--muted-foreground))] block text-[11px] mb-1">Hesaplama Adımları ve Kaynaklar:</span>
                      <ul className="list-disc pl-5 space-y-1 text-[11px] text-[hsl(var(--foreground))]">
                        {sonDenetimIzi.hesaplamaAdimlari.map((adim, i) => (
                          <li key={i}>{adim}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 text-[11px] text-stone-500 italic">
                      {sonDenetimIzi.hmk279Serhi}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border border-dashed border-[hsl(var(--border))] rounded-[6px]">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                    <span>Henüz bu oturumda rapora aktarım yapılmadı. "Rapora Aktar" butonuna basıldığında denetim paketi otomatik üretilir.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: UAT TEST SENARYOLARI (ŞARTNAME MADDE 7.1) */}
          {anaSekme === "uat" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-[8px] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-serif text-[15px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                      UAT Test Senaryoları (Şartname Madde 7.1 Doğrulaması)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-sm">
                    4 Resmî Senaryo
                  </span>
                </div>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))]">
                  Şartname No: TÜİK-BİL-2026/01-REV01 kapsamında tanımlanmış 4 kabul test senaryosunu tek tıkla yükleyip formüllerini doğrulayabilirsiniz.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {UAT_TEST_SENARYOLARI.map((senaryo) => (
                    <div
                      key={senaryo.no}
                      className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] p-3.5 flex flex-col justify-between hover:border-[#0F3D2E] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-serif text-[13px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                            {senaryo.ad}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-600 font-semibold">
                            UAT-{senaryo.no}
                          </span>
                        </div>
                        <p className="text-[11px] text-[hsl(var(--foreground))] mb-2">
                          {senaryo.kisaTanim}
                        </p>
                        <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-[4px] text-[10px] font-mono text-[hsl(var(--muted-foreground))] mb-3">
                          {senaryo.beklenenCikti}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUatCalistir(senaryo)}
                        className="w-full py-1.5 px-3 rounded-[4px] text-[11px] font-semibold bg-[#0F3D2E]/10 hover:bg-[#0F3D2E] hover:text-white text-[#0F3D2E] dark:text-emerald-300 border border-[#0F3D2E]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Senaryoyu Yükle & Test Et</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SDMX VERİ AKIŞ KÜNYESİ (ŞARTNAME EK-3) */}
          {anaSekme === "sdmx" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-4 rounded-[8px] space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0F3D2E] dark:text-emerald-300" />
                  <h4 className="font-serif text-[15px] font-bold text-[#0F3D2E] dark:text-emerald-300">
                    Zorunlu TÜİK Veri Akışı ve Tablo Kodları (Şartname Ek-3)
                  </h4>
                </div>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))]">
                  Modülün arka planda eşleştiği resmî SDMX veri akışları ve TÜİK veri tabanı tablo numaraları:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0F3D2E] text-white">
                        <th className="p-2 font-semibold">Akış Kodu</th>
                        <th className="p-2 font-semibold">Tablo No</th>
                        <th className="p-2 font-semibold">Tablo Adı</th>
                        <th className="p-2 font-semibold">Sektör</th>
                        <th className="p-2 font-semibold">SDMX Dataflow ID</th>
                        <th className="p-2 font-semibold">Periyot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))] bg-[hsl(var(--card))]">
                      {TUIK_SDMX_TABLOLARI.map((tablo) => (
                        <tr key={tablo.akisKodu} className="hover:bg-stone-50 dark:hover:bg-stone-800">
                          <td className="p-2 font-mono font-bold text-[#B45309]">{tablo.akisKodu}</td>
                          <td className="p-2 font-mono">{tablo.tabloNo}</td>
                          <td className="p-2 font-medium">{tablo.tabloAdi}</td>
                          <td className="p-2 text-[hsl(var(--muted-foreground))]">{tablo.sektor}</td>
                          <td className="p-2 font-mono text-[10px]">{tablo.sdmxDataflowId}</td>
                          <td className="p-2">{tablo.guncellemePeriyodu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Hata Kataloğu Özeti (Şartname Ek-5) */}
                <div className="pt-3 border-t border-[hsl(var(--border))]">
                  <h5 className="font-serif text-[13px] font-bold text-[#0F3D2E] dark:text-emerald-300 mb-2">
                    Resmî Hata Kodları Kataloğu (Ek-5)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {Object.values(TUIK_HATA_KATALOGU).map((hata) => (
                      <div key={hata.kod} className="p-2 rounded-[4px] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                        <div className="font-mono font-bold text-amber-600 mb-0.5">{hata.kod}: {hata.baslik}</div>
                        <div className="text-[hsl(var(--muted-foreground))]">{hata.aciklama}</div>
                        <div className="text-emerald-700 dark:text-emerald-400 mt-1">Çözüm: {hata.cozumOnerisi}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

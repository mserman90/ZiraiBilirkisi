import React, { useState, useMemo } from "react";
import {
  Activity,
  Heart,
  Calculator,
  Database,
  BookOpen,
  Search,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Scale,
  FileText,
  TrendingUp,
  DollarSign,
  Clipboard,
  Shield,
  Info,
  ArrowLeft,
  Sparkles,
  X,
  Filter,
  Egg,
  Milk,
  RotateCcw,
  Check,
  Award,
  Layers,
  Building2,
  Calendar,
  Weight,
  Clock,
  ExternalLink,
  Flame,
  Zap,
  Truck,
  TrendingDown,
  ArrowRight,
  Beef,
  PawPrint,
  Bird,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  BUYUKBAS_IRKLARI,
  KUCUKBAS_IRKLARI,
  KANATLI_TURLERI,
  HAYVAN_BIRIM_FIYATLARI,
  YEM_FIYATLARI,
  HAYVAN_ICTIHAT_DB,
  HAYVAN_DEGERLEME_REHBER_ILKELERI,
  HAYVAN_KONTROL_LISTESI,
  TELEF_NEDENLERI,
  BuyukbasIrk,
  KucukbasIrk,
  KanatliTuru,
  TelefNedeni,
  HayvanIctihat,
} from "../data/hayvancilikData";

export interface HayvancilikViewProps {
  showToast: (msg: string) => void;
  onGoToWizard: () => void;
}

// ÜFE Artış Oranları (Telef Tarihinden Günümüze Endeksleme)
const UFE_ARTIS_KATSAYILARI: Record<string, { oran: number; aciklama: string }> = {
  "2021": { oran: 4.85, aciklama: "2021 Yılından Günümüze Yİ-ÜFE Kümülatif Artışı (%385)" },
  "2022": { oran: 3.20, aciklama: "2022 Yılından Günümüze Yİ-ÜFE Kümülatif Artışı (%220)" },
  "2023": { oran: 2.15, aciklama: "2023 Yılından Günümüze Yİ-ÜFE Kümülatif Artışı (%115)" },
  "2024": { oran: 1.55, aciklama: "2024 Yılından Günümüze Yİ-ÜFE Kümülatif Artışı (%55)" },
  "2025": { oran: 1.25, aciklama: "2025 Yılından Günümüze Yİ-ÜFE Kümülatif Artışı (%25)" },
  "2026": { oran: 1.0, aciklama: "2026 Yılı Cari Fiyatlar (Endeksleme Yok)" },
};

// Yem İsimleri Türkçe Eşleşmesi
const YEM_ETIKETLERI: Record<string, { ad: string; kategori: string }> = {
  arpa: { ad: "Yemlik Arpa (Dane)", kategori: "Hammadde / Dane" },
  bugday: { ad: "Yemlik Buğday (Dane)", kategori: "Hammadde / Dane" },
  misir: { ad: "Sarı Mısır (Dane)", kategori: "Hammadde / Dane" },
  soyaKuspesi: { ad: "Soya Küspesi (%46 HP)", kategori: "Protein Küspesi" },
  aycicekKuspesi: { ad: "Ayçiçeği Küspesi (%32 HP)", kategori: "Protein Küspesi" },
  yonca: { ad: "Kuru Yonca Otu (1. Kalite)", kategori: "Kaba Yem" },
  silaj: { ad: "Mısır Silajı (%30 KM)", kategori: "Kaba Yem" },
  kuspe: { ad: "Yaş Şeker Pancarı Küspesi", kategori: "Kaba Yem" },
  saman: { ad: "Buğday Sap Samanı (Balyalı)", kategori: "Kaba Yem" },
  korunga: { ad: "Kuru Korunga Otu", kategori: "Kaba Yem" },
  ryegrassOtu: { ad: "İtalyan Çimi (Ryegrass) Kuru Otu", kategori: "Kaba Yem" },
  premiks: { ad: "Standart Vitamin-Mineral Premiksi", kategori: "Katkı Maddesi" },
  sutYemi: { ad: "Süt Yemi (%19 Ham Protein)", kategori: "Karma Fabrika Yemi" },
  sutYemiYuksekVerim: { ad: "Pik Dönem Süt Yemi (%21 HP)", kategori: "Karma Fabrika Yemi" },
  besiYemi: { ad: "Besi Geliştirme Yemi", kategori: "Karma Fabrika Yemi" },
  besiBitirmeYemi: { ad: "Besi Bitirme Yemi", kategori: "Karma Fabrika Yemi" },
  kuzuBuyutmeYemi: { ad: "Pelet Kuzu Büyütme Yemi", kategori: "Karma Fabrika Yemi" },
  kuzuBaslangicYemi: { ad: "Kuzu Başlangıç Yemi", kategori: "Karma Fabrika Yemi" },
  kanatliYemi: { ad: "Broiler Bitirme Pelet Yemi", kategori: "Kanatlı Yemi" },
  broilerBaslangicYemi: { ad: "Broiler Başlangıç Granül Yemi", kategori: "Kanatlı Yemi" },
  yumurtaYemi: { ad: "Yumurta Tavuğu Karma Yemi", kategori: "Kanatlı Yemi" },
};

export default function HayvancilikView({ showToast, onGoToWizard }: HayvancilikViewProps) {
  // Ana Alt Sekmeler
  const [altSekme, setAltSekme] = useState<"degerleme" | "telef" | "irkDB" | "rehber">("degerleme");

  // ==========================================
  // TAB 1: DEĞERLEME SİHİRBAZI STATE'LERİ
  // ==========================================
  const [turTipi, setTurTipi] = useState<"buyukbas" | "kucukbas" | "kanatli">("buyukbas");
  const [seciliIrkAd, setSeciliIrkAd] = useState<string>(BUYUKBAS_IRKLARI[0].irk);
  const [hayvanAdet, setHayvanAdet] = useState<number>(1);
  const [hayvanYasi, setHayvanYasi] = useState<number>(3.5);
  const [canliAgirlik, setCanliAgirlik] = useState<number>(BUYUKBAS_IRKLARI[0].ortCanliAgirlik);
  const [isDamizlik, setIsDamizlik] = useState<boolean>(true);
  const [damizlikDerece, setDamizlikDerece] = useState<"tescilli" | "isletme">("tescilli");
  const [gunlukSut, setGunlukSut] = useState<number>(BUYUKBAS_IRKLARI[0].gunlukSutVerimi || 26);
  const [yumurtaVerimi, setYumurtaVerimi] = useState<number>(315);
  const [laktasyonGun, setLaktasyonGun] = useState<number>(305);
  const [gunlukYemKg, setGunlukYemKg] = useState<number>(20);

  // Manuel Özel Fiyat Ayarı Toggle
  const [ozelFiyatAktif, setOzelFiyatAktif] = useState<boolean>(false);
  const [ozelCanliKgFiyat, setOzelCanliKgFiyat] = useState<number>(HAYVAN_BIRIM_FIYATLARI.buyukbas.canliKgBesi);
  const [ozelKarkasKgFiyat, setOzelKarkasKgFiyat] = useState<number>(HAYVAN_BIRIM_FIYATLARI.buyukbas.karkasDanaKg);
  const [ozelSutLitreFiyat, setOzelSutLitreFiyat] = useState<number>(HAYVAN_BIRIM_FIYATLARI.buyukbas.sutLt);
  const [ozelYemKgFiyat, setOzelYemKgFiyat] = useState<number>(YEM_FIYATLARI.sutYemi);

  // Kategori değiştiğinde varsayılanları güncelle
  const handleTurDegistir = (yeniTur: "buyukbas" | "kucukbas" | "kanatli") => {
    setTurTipi(yeniTur);
    if (yeniTur === "buyukbas") {
      const ilk = BUYUKBAS_IRKLARI[0];
      setSeciliIrkAd(ilk.irk);
      setCanliAgirlik(ilk.ortCanliAgirlik);
      setGunlukSut(ilk.gunlukSutVerimi || 26);
      setHayvanYasi(3.5);
      setGunlukYemKg(Math.round((ilk.gunlukYemMaliyeti / YEM_FIYATLARI.sutYemi) * 10) / 10 || 18);
      setOzelCanliKgFiyat(HAYVAN_BIRIM_FIYATLARI.buyukbas.canliKgBesi);
      setOzelKarkasKgFiyat(HAYVAN_BIRIM_FIYATLARI.buyukbas.karkasDanaKg);
      setOzelSutLitreFiyat(HAYVAN_BIRIM_FIYATLARI.buyukbas.sutLt);
    } else if (yeniTur === "kucukbas") {
      const ilk = KUCUKBAS_IRKLARI[0];
      setSeciliIrkAd(ilk.irk);
      setCanliAgirlik(ilk.ortCanliAgirlik);
      setGunlukSut(ilk.gunlukSutVerimi || 1.2);
      setHayvanYasi(2.5);
      setGunlukYemKg(Math.round((ilk.gunlukYemMaliyeti / YEM_FIYATLARI.kuzuBuyutmeYemi) * 10) / 10 || 2);
      setOzelCanliKgFiyat(HAYVAN_BIRIM_FIYATLARI.kucukbas.canliKgKuzu);
      setOzelKarkasKgFiyat(HAYVAN_BIRIM_FIYATLARI.kucukbas.karkasKuzuKg);
      setOzelSutLitreFiyat(HAYVAN_BIRIM_FIYATLARI.kucukbas.sutKoyunLt);
    } else {
      const ilk = KANATLI_TURLERI[0];
      setSeciliIrkAd(ilk.tur);
      setCanliAgirlik(ilk.canliAgirlik);
      setYumurtaVerimi(ilk.yillikYumurtaVerimi || 0);
      setHayvanYasi(1);
      setGunlukYemKg(Math.round((ilk.gunlukYemMaliyeti / YEM_FIYATLARI.kanatliYemi) * 100) / 100 || 0.15);
      setOzelCanliKgFiyat(HAYVAN_BIRIM_FIYATLARI.kanatli.broilerCanliKg);
      setOzelKarkasKgFiyat(HAYVAN_BIRIM_FIYATLARI.kanatli.broilerKarkasKg);
    }
  };

  const handleIrkDegistir = (irkAdi: string) => {
    setSeciliIrkAd(irkAdi);
    if (turTipi === "buyukbas") {
      const irk = BUYUKBAS_IRKLARI.find((b) => b.irk === irkAdi);
      if (irk) {
        setCanliAgirlik(irk.ortCanliAgirlik);
        setGunlukSut(irk.gunlukSutVerimi || 20);
        setGunlukYemKg(Math.round((irk.gunlukYemMaliyeti / YEM_FIYATLARI.sutYemi) * 10) / 10 || 18);
      }
    } else if (turTipi === "kucukbas") {
      const irk = KUCUKBAS_IRKLARI.find((k) => k.irk === irkAdi);
      if (irk) {
        setCanliAgirlik(irk.ortCanliAgirlik);
        setGunlukSut(irk.gunlukSutVerimi || 1.0);
        setGunlukYemKg(Math.round((irk.gunlukYemMaliyeti / YEM_FIYATLARI.kuzuBuyutmeYemi) * 10) / 10 || 2);
        setOzelSutLitreFiyat(
          irk.hayvanTuru === "Keçi" ? HAYVAN_BIRIM_FIYATLARI.kucukbas.sutKeciLt : HAYVAN_BIRIM_FIYATLARI.kucukbas.sutKoyunLt
        );
      }
    } else {
      const tur = KANATLI_TURLERI.find((k) => k.tur === irkAdi);
      if (tur) {
        setCanliAgirlik(tur.canliAgirlik);
        setYumurtaVerimi(tur.yillikYumurtaVerimi || 0);
        setGunlukYemKg(Math.round((tur.gunlukYemMaliyeti / YEM_FIYATLARI.kanatliYemi) * 100) / 100 || 0.15);
      }
    }
  };

  // Aktif Irk Objesi
  const aktifIrkData = useMemo(() => {
    if (turTipi === "buyukbas") {
      return BUYUKBAS_IRKLARI.find((i) => i.irk === seciliIrkAd) || BUYUKBAS_IRKLARI[0];
    }
    if (turTipi === "kucukbas") {
      return KUCUKBAS_IRKLARI.find((i) => i.irk === seciliIrkAd) || KUCUKBAS_IRKLARI[0];
    }
    return KANATLI_TURLERI.find((i) => i.tur === seciliIrkAd) || KANATLI_TURLERI[0];
  }, [turTipi, seciliIrkAd]);

  // Değerleme Sihirbazı Hesaplamaları
  const degerlemeSonucu = useMemo(() => {
    const canliKgFiyat = ozelFiyatAktif
      ? ozelCanliKgFiyat
      : turTipi === "buyukbas"
      ? HAYVAN_BIRIM_FIYATLARI.buyukbas.canliKgBesi
      : turTipi === "kucukbas"
      ? (aktifIrkData as KucukbasIrk).hayvanTuru === "Keçi"
        ? HAYVAN_BIRIM_FIYATLARI.kucukbas.canliKgKeci
        : HAYVAN_BIRIM_FIYATLARI.kucukbas.canliKgKuzu
      : HAYVAN_BIRIM_FIYATLARI.kanatli.broilerCanliKg;

    const karkasKgFiyat = ozelFiyatAktif
      ? ozelKarkasKgFiyat
      : turTipi === "buyukbas"
      ? HAYVAN_BIRIM_FIYATLARI.buyukbas.karkasDanaKg
      : turTipi === "kucukbas"
      ? (aktifIrkData as KucukbasIrk).hayvanTuru === "Keçi"
        ? HAYVAN_BIRIM_FIYATLARI.kucukbas.karkasKeciKg
        : HAYVAN_BIRIM_FIYATLARI.kucukbas.karkasKuzuKg
      : HAYVAN_BIRIM_FIYATLARI.kanatli.broilerKarkasKg;

    const sutLitreFiyat = ozelFiyatAktif
      ? ozelSutLitreFiyat
      : turTipi === "buyukbas"
      ? HAYVAN_BIRIM_FIYATLARI.buyukbas.sutLt
      : (aktifIrkData as KucukbasIrk)?.hayvanTuru === "Keçi"
      ? HAYVAN_BIRIM_FIYATLARI.kucukbas.sutKeciLt
      : HAYVAN_BIRIM_FIYATLARI.kucukbas.sutKoyunLt;

    const yemKgFiyat = ozelFiyatAktif ? ozelYemKgFiyat : YEM_FIYATLARI.sutYemi;

    const randiman = aktifIrkData.karkasRandimani / 100;
    const canliDegerBirim = canliAgirlik * canliKgFiyat;
    const karkasAgirlikBirim = canliAgirlik * randiman;
    const karkasDegerBirim = karkasAgirlikBirim * karkasKgFiyat;

    // Damızlık Değeri Katkısı
    const damizlikKatsayi = isDamizlik ? (damizlikDerece === "tescilli" ? 0.35 : 0.2) : 0;
    const damizlikFarki = canliDegerBirim * damizlikKatsayi;

    // Amortisman Oranı
    const ekonomikOmur = aktifIrkData.ekonomikOmur || 6;
    const hesaplananAmortisman = Math.min(0.9, Math.max(0, hayvanYasi / ekonomikOmur));
    const amortismanOrani = isDamizlik ? hesaplananAmortisman * 0.6 : hesaplananAmortisman;

    // Birim Nihai Değer
    const netBirimDeger = Math.round((canliDegerBirim + damizlikFarki) * (1 - amortismanOrani * 0.35));

    // Yıllık Gelir & Masraf
    let yillikBrutUrunGeliri = 0;
    if (turTipi === "buyukbas" || turTipi === "kucukbas") {
      yillikBrutUrunGeliri = gunlukSut * laktasyonGun * sutLitreFiyat;
    } else {
      yillikBrutUrunGeliri = yumurtaVerimi * HAYVAN_BIRIM_FIYATLARI.kanatli.yumurtaAdet;
    }

    const yillikYemMaliyetiBirim = gunlukYemKg * 365 * yemKgFiyat;
    const yillikNetGelirBirim = Math.round(yillikBrutUrunGeliri - yillikYemMaliyetiBirim);

    // Sürü / Kümes Toplamı
    const toplamSuruDegeri = netBirimDeger * hayvanAdet;
    const toplamYillikNetGelir = yillikNetGelirBirim * hayvanAdet;

    return {
      canliKgFiyat,
      karkasKgFiyat,
      sutLitreFiyat,
      yemKgFiyat,
      canliDegerBirim: Math.round(canliDegerBirim),
      karkasAgirlikBirim: Math.round(karkasAgirlikBirim * 10) / 10,
      karkasDegerBirim: Math.round(karkasDegerBirim),
      damizlikFarki: Math.round(damizlikFarki),
      amortismanOrani: Math.round(amortismanOrani * 100),
      netBirimDeger,
      yillikBrutUrunGeliri: Math.round(yillikBrutUrunGeliri),
      yillikYemMaliyetiBirim: Math.round(yillikYemMaliyetiBirim),
      yillikNetGelirBirim,
      toplamSuruDegeri,
      toplamYillikNetGelir,
    };
  }, [
    turTipi,
    aktifIrkData,
    canliAgirlik,
    hayvanYasi,
    hayvanAdet,
    isDamizlik,
    damizlikDerece,
    gunlukSut,
    yumurtaVerimi,
    laktasyonGun,
    gunlukYemKg,
    ozelFiyatAktif,
    ozelCanliKgFiyat,
    ozelKarkasKgFiyat,
    ozelSutLitreFiyat,
    ozelYemKgFiyat,
  ]);

  // ==========================================
  // TAB 2: TELEF / HASAR HESAPLAMA STATE'LERİ
  // ==========================================
  const [telefNedeniAd, setTelefNedeniAd] = useState<string>(TELEF_NEDENLERI[0].neden);
  const [telefTur, setTelefTur] = useState<"buyukbas" | "kucukbas" | "kanatli">("buyukbas");
  const [telefAdet, setTelefAdet] = useState<number>(2);
  const [telefCanliAgirlik, setTelefCanliAgirlik] = useState<number>(650);
  const [telefYas, setTelefYas] = useState<number>(4);
  const [telefGebe, setTelefGebe] = useState<boolean>(true);
  const [telefGebelikAyi, setTelefGebelikAyi] = useState<number>(7);
  const [telefHurdaBedeli, setTelefHurdaBedeli] = useState<number>(24000); // Kurtarma et/deri mahsubu
  const [ikameGun, setIkameGun] = useState<number>(45); // Yargıtay 3. HD makul ikame süresi
  const [telefGunlukSut, setTelefGunlukSut] = useState<number>(24);
  const [telefGunlukYemTasarrufu, setTelefGunlukYemTasarrufu] = useState<number>(18); // Düşülecek masraf
  const [muterafikKusurOrani, setMuterafikKusurOrani] = useState<number>(20); // %20 başıboş otlatma indirimi
  const [telefYili, setTelefYili] = useState<string>("2024");

  // AI Gerekçe Yazıcı State
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiGerekceMetni, setAiGerekceMetni] = useState<string>("");

  const aktifTelefNedeni: TelefNedeni = useMemo(() => {
    return TELEF_NEDENLERI.find((t) => t.neden === telefNedeniAd) || TELEF_NEDENLERI[0];
  }, [telefNedeniAd]);

  // Telef / Hasar Hesaplaması
  const telefSonucu = useMemo(() => {
    // 1. Hayvanın Olay Tarihi Piyasa Değeri
    const canliKgFiyat =
      telefTur === "buyukbas"
        ? HAYVAN_BIRIM_FIYATLARI.buyukbas.canliKgBesi
        : telefTur === "kucukbas"
        ? HAYVAN_BIRIM_FIYATLARI.kucukbas.canliKgKuzu
        : HAYVAN_BIRIM_FIYATLARI.kanatli.broilerCanliKg;

    const birimPiyasaDegeri = telefCanliAgirlik * canliKgFiyat * 1.15; // Piyasa rayiç katsayısı
    const toplamPiyasaDegeri = birimPiyasaDegeri * telefAdet;

    // 2. Gebe Yavru Değer Kaybı
    let birimGebeKaybi = 0;
    if (telefGebe) {
      if (telefTur === "buyukbas") {
        birimGebeKaybi = HAYVAN_BIRIM_FIYATLARI.buyukbas.yavruBuzagi * Math.min(1, telefGebelikAyi / 9);
      } else if (telefTur === "kucukbas") {
        birimGebeKaybi = HAYVAN_BIRIM_FIYATLARI.kucukbas.yavruKuzu * Math.min(1, telefGebelikAyi / 5);
      }
    }
    const toplamGebeKaybi = birimGebeKaybi * telefAdet;

    // 3. Yoksun Kalınan Net Kâr (Yargıtay İlkesi: Brüt Gelir - Tasarruf Edilen Yem)
    const sutFiyat = telefTur === "buyukbas" ? HAYVAN_BIRIM_FIYATLARI.buyukbas.sutLt : HAYVAN_BIRIM_FIYATLARI.kucukbas.sutKoyunLt;
    const yemFiyat = YEM_FIYATLARI.sutYemi;
    const gunlukBrutSutGeliri = telefGunlukSut * sutFiyat;
    const gunlukTasarrufYemMasrafi = telefGunlukYemTasarrufu * yemFiyat;
    const gunlukNetMahrumiyet = Math.max(0, gunlukBrutSutGeliri - gunlukTasarrufYemMasrafi);
    const toplamYoksunKar = gunlukNetMahrumiyet * ikameGun * telefAdet;

    // 4. Brüt Zarar
    const brutToplamZarar = toplamPiyasaDegeri + toplamGebeKaybi + toplamYoksunKar;

    // 5. Hurda / Kurtarma Mahsubu (Yargıtay 3. HD 2021/4812 E. zorunlu mahsup)
    const hurdaMahsubu = Math.min(brutToplamZarar, telefHurdaBedeli);

    // 6. Müterafik Kusur İndirimi (TBK m.52)
    const mahsupSonrasiZarar = Math.max(0, brutToplamZarar - hurdaMahsubu);
    const kusurIndirimTutari = Math.round(mahsupSonrasiZarar * (muterafikKusurOrani / 100));

    // 7. Olay Tarihi Net Tazminat
    const olayTarihiTazminat = Math.max(0, mahsupSonrasiZarar - kusurIndirimTutari);

    // 8. ÜFE Endeksli Güncel Değer
    const endeksKatsayisi = UFE_ARTIS_KATSAYILARI[telefYili]?.oran || 1.0;
    const guncelTazminat = Math.round(olayTarihiTazminat * endeksKatsayisi);

    return {
      toplamPiyasaDegeri: Math.round(toplamPiyasaDegeri),
      toplamGebeKaybi: Math.round(toplamGebeKaybi),
      toplamYoksunKar: Math.round(toplamYoksunKar),
      brutToplamZarar: Math.round(brutToplamZarar),
      hurdaMahsubu: Math.round(hurdaMahsubu),
      kusurIndirimTutari,
      olayTarihiTazminat: Math.round(olayTarihiTazminat),
      endeksKatsayisi,
      guncelTazminat,
    };
  }, [
    telefTur,
    telefCanliAgirlik,
    telefAdet,
    telefGebe,
    telefGebelikAyi,
    ikameGun,
    telefGunlukSut,
    telefGunlukYemTasarrufu,
    telefHurdaBedeli,
    muterafikKusurOrani,
    telefYili,
  ]);

  // Simüle AI Rapor Yazıcı
  const handleGenerateAiReport = () => {
    setAiGenerating(true);
    setAiGerekceMetni("");
    setTimeout(() => {
      const metin = `T.C. MAHKEMESİ HUZURUNA SUNULAN 02.01 HAYVANCILIK BİLİRKİŞİ HASAR VE TAZMİNAT GEREKÇE RAPORU

1. OLAY VE TESPİT:
Dosya kapsamı, İlçe Tarım ve Orman Müdürlüğü resmi tutanakları ve veteriner hekim nekropsi raporu incelendiğinde; davacıya ait ${telefAdet} baş ${
        telefTur === "buyukbas" ? "Büyükbaş Sığır" : telefTur === "kucukbas" ? "Küçükbaş" : "Kanatlı"
      } cinsi hayvanın "${aktifTelefNedeni.neden}" hadisesi neticesinde ${telefYili} yılında telef olduğu tespit edilmiştir.

2. HUKUKİ SORUMLULUK VE İLLİYET BAĞI:
Söz konusu olayda zarar verenin kusursuz / tehlike sorumluluğu veya haksız fiil sorumluluğu bulunmaktadır. Olay yeri tutanakları ile ölüm arasındaki illiyet bağının kesilmediği anlaşılmıştır.

3. ZARAR VE MAHSUP HESABI (YARGITAY 3. HD 2021/4812 E. ESASLARI):
a) Hayvanların olay tarihindeki pazar ikame rayici: ${telefSonucu.toplamPiyasaDegeri.toLocaleString("tr-TR")} ₺
b) Gebe hayvan yavru kaybı değeri: ${telefSonucu.toplamGebeKaybi.toLocaleString("tr-TR")} ₺
c) İkame teminine kadar ${ikameGun} günlük yoksun kalınan net süt geliri (Yem masrafı tenzil edilmiştir): ${telefSonucu.toplamYoksunKar.toLocaleString("tr-TR")} ₺
d) Mahsup Edilen Karkas/Deri Kurtarma (Hurda) Bedeli: -${telefSonucu.hurdaMahsubu.toLocaleString("tr-TR")} ₺
e) Başıboş otlatma / çoban ihmali sebebiyle TBK m.52 uyarınca %${muterafikKusurOrani} Müterafik Kusur İndirimi: -${telefSonucu.kusurIndirimTutari.toLocaleString(
        "tr-TR"
      )} ₺

4. SONUÇ VE KANAAT:
Olay tarihi (${telefYili}) itibarıyla davacının nihai maddi tazminat alacağı ${telefSonucu.olayTarihiTazminat.toLocaleString(
        "tr-TR"
      )} ₺ olup; ${telefYili} yılından günümüze Yİ-ÜFE katsayısı (${telefSonucu.endeksKatsayisi} kat) uygulandığında güncellenmiş toplam tazminat tutarının ${telefSonucu.guncelTazminat.toLocaleString(
        "tr-TR"
      )} ₺ olduğu bilimsel ve teknik kanaatimizle arz olunur.`;

      setAiGerekceMetni(metin);
      setAiGenerating(false);
      showToast("Yargıtay uyumlu gerekçeli rapor metni oluşturuldu");
    }, 1200);
  };

  // ==========================================
  // TAB 3: IRK VERİTABANI STATE'LERİ
  // ==========================================
  const [irkKategoriFiltre, setIrkKategoriFiltre] = useState<"tumu" | "buyukbas" | "kucukbas" | "kanatli">("tumu");
  const [irkArama, setIrkArama] = useState<string>("");
  const [detaySeciliIrk, setDetaySeciliIrk] = useState<any>(null);

  const filtrelenmisIrklar = useMemo(() => {
    const list: Array<{
      turKategori: "Büyükbaş" | "Küçükbaş" | "Kanatlı";
      ad: string;
      tip: string;
      canliAgirlik: number;
      karkasRandimani: number;
      sutVerimi?: number;
      yumurtaVerimi?: number;
      ekonomikOmur: number;
      damizlikMin: number;
      damizlikMax: number;
      yemMaliyeti: number;
      aciklama: string;
      rawObj: any;
    }> = [];

    if (irkKategoriFiltre === "tumu" || irkKategoriFiltre === "buyukbas") {
      BUYUKBAS_IRKLARI.forEach((b) =>
        list.push({
          turKategori: "Büyükbaş",
          ad: b.irk,
          tip: b.tip,
          canliAgirlik: b.ortCanliAgirlik,
          karkasRandimani: b.karkasRandimani,
          sutVerimi: b.yillikSutVerimi || (b.gunlukSutVerimi ? b.gunlukSutVerimi * 305 : 0),
          ekonomikOmur: b.ekonomikOmur,
          damizlikMin: b.damizlikDegerMin,
          damizlikMax: b.damizlikDegerMax,
          yemMaliyeti: b.gunlukYemMaliyeti,
          aciklama: b.aciklama,
          rawObj: b,
        })
      );
    }

    if (irkKategoriFiltre === "tumu" || irkKategoriFiltre === "kucukbas") {
      KUCUKBAS_IRKLARI.forEach((k) =>
        list.push({
          turKategori: "Küçükbaş",
          ad: `${k.irk} (${k.hayvanTuru})`,
          tip: k.tip,
          canliAgirlik: k.ortCanliAgirlik,
          karkasRandimani: k.karkasRandimani,
          sutVerimi: k.yillikSutVerimi || 0,
          ekonomikOmur: k.ekonomikOmur,
          damizlikMin: k.damizlikDegerMin,
          damizlikMax: k.damizlikDegerMax,
          yemMaliyeti: k.gunlukYemMaliyeti,
          aciklama: k.aciklama,
          rawObj: k,
        })
      );
    }

    if (irkKategoriFiltre === "tumu" || irkKategoriFiltre === "kanatli") {
      KANATLI_TURLERI.forEach((t) =>
        list.push({
          turKategori: "Kanatlı",
          ad: t.tur,
          tip: t.tip,
          canliAgirlik: t.canliAgirlik,
          karkasRandimani: t.karkasRandimani,
          yumurtaVerimi: t.yillikYumurtaVerimi || 0,
          ekonomikOmur: t.ekonomikOmur,
          damizlikMin: t.birimDeger,
          damizlikMax: Math.round(t.birimDeger * 1.3),
          yemMaliyeti: t.gunlukYemMaliyeti,
          aciklama: t.aciklama,
          rawObj: t,
        })
      );
    }

    if (!irkArama.trim()) return list;

    const query = irkArama.toLowerCase();
    return list.filter(
      (item) =>
        item.ad.toLowerCase().includes(query) ||
        item.tip.toLowerCase().includes(query) ||
        item.aciklama.toLowerCase().includes(query)
    );
  }, [irkKategoriFiltre, irkArama]);

  // ==========================================
  // TAB 4: REHBER & KONTROL LİSTESİ STATE'LERİ
  // ==========================================
  const [rehberAltSekme, setRehberAltSekme] = useState<"ilkeler" | "kontrol" | "ictihat">("ilkeler");
  const [genisleyenIlkeId, setGenisleyenIlkeId] = useState<string>("piyasa-rayici-emsal");
  const [kontrolCheckboxlar, setKontrolCheckboxlar] = useState<Record<string, boolean>>({});
  const [ictihatArama, setIctihatArama] = useState<string>("");

  const toggleKontrolCheckbox = (id: string) => {
    setKontrolCheckboxlar((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tumKontrolleriSec = () => {
    const all: Record<string, boolean> = {};
    HAYVAN_KONTROL_LISTESI.forEach((kat) => {
      kat.maddeler.forEach((m) => {
        all[m.id] = true;
      });
    });
    setKontrolCheckboxlar(all);
    showToast("Tüm denetim adımları onaylandı");
  };

  const kontrolSifirla = () => {
    setKontrolCheckboxlar({});
    showToast("Kontrol listesi sıfırlandı");
  };

  const tumKontrolMaddeleri = useMemo(() => {
    return HAYVAN_KONTROL_LISTESI.flatMap((k) => k.maddeler);
  }, []);

  const tamamlananKontrolSayisi = useMemo(() => {
    return tumKontrolMaddeleri.filter((m) => kontrolCheckboxlar[m.id]).length;
  }, [tumKontrolMaddeleri, kontrolCheckboxlar]);

  const kontrolYuzdesi = tumKontrolMaddeleri.length
    ? Math.round((tamamlananKontrolSayisi / tumKontrolMaddeleri.length) * 100)
    : 0;

  const filtrelenmisIctihatlar: HayvanIctihat[] = useMemo(() => {
    if (!ictihatArama.trim()) return HAYVAN_ICTIHAT_DB;
    const q = ictihatArama.toLowerCase();
    return HAYVAN_ICTIHAT_DB.filter(
      (i) =>
        i.daire.toLowerCase().includes(q) ||
        i.esas.toLowerCase().includes(q) ||
        i.karar.toLowerCase().includes(q) ||
        i.konu.toLowerCase().includes(q) ||
        i.ozet.toLowerCase().includes(q) ||
        i.anahtar.some((k) => k.toLowerCase().includes(q))
    );
  }, [ictihatArama]);

  const kopyalaMetin = (metin: string, bildirim = "Metin panoya kopyalandı") => {
    navigator.clipboard.writeText(metin).then(() => {
      showToast(bildirim);
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* ========================================================= */}
      {/* HEADER BANNER - AMBER & ORANGE GRADIENT LIVESTOCK THEME */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-amber-400/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-[50px] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-bold text-amber-100 tracking-wider mb-3">
              <Beef size={14} /> 02.01 HAYVANCILIK & CANLI DEMİRBAŞ DEĞERLEME UZMANLIĞI
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Hayvancılık Bilirkişiliği & Değerleme Sistemi
            </h2>
            <p className="text-xs md:text-sm text-amber-100 mt-2 leading-relaxed">
              Büyükbaş, küçükbaş ve kanatlı canlı değerleme; karkas randımanı, damızlık katsayısı, amortisman, telef-hasar tazminatı, yoksun kalınan süt/yavru net kârı ve Yargıtay emsal mahsup ilkeleri.
            </p>
          </div>

          {/* Hızlı Referans İstatistik Kutusu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center p-2 rounded-xl bg-white/10">
              <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Büyükbaş Canlı</p>
              <p className="text-lg font-black text-white mt-0.5">{HAYVAN_BIRIM_FIYATLARI.buyukbas.canliKgBesi} ₺/kg</p>
              <p className="text-[9px] text-amber-100">Karkas: {HAYVAN_BIRIM_FIYATLARI.buyukbas.karkasDanaKg} ₺</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/10">
              <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Küçükbaş Canlı</p>
              <p className="text-lg font-black text-white mt-0.5">{HAYVAN_BIRIM_FIYATLARI.kucukbas.canliKgKuzu} ₺/kg</p>
              <p className="text-[9px] text-amber-100">Karkas: {HAYVAN_BIRIM_FIYATLARI.kucukbas.karkasKuzuKg} ₺</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/10 col-span-2 sm:col-span-1">
              <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Çiğ Süt (USK)</p>
              <p className="text-lg font-black text-emerald-300 mt-0.5">{HAYVAN_BIRIM_FIYATLARI.buyukbas.sutLt} ₺/lt</p>
              <p className="text-[9px] text-amber-100">Yumurta: {HAYVAN_BIRIM_FIYATLARI.kanatli.yumurtaAdet} ₺</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 ANA SUB-TAB SEÇİCİ */}
      {/* ========================================================= */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto max-w-2xl">
        <button
          onClick={() => setAltSekme("degerleme")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "degerleme"
              ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calculator size={15} /> Değerleme Sihirbazı
        </button>
        <button
          onClick={() => setAltSekme("telef")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "telef"
              ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <AlertTriangle size={15} /> Telef & Hasar Tazminatı
        </button>
        <button
          onClick={() => setAltSekme("irkDB")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "irkDB"
              ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Database size={15} /> Irk & Verim Veritabanı
        </button>
        <button
          onClick={() => setAltSekme("rehber")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "rehber"
              ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen size={15} /> Rehber & Kontrol Listesi
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. SEKME: DEĞERLEME SİHİRBAZI */}
      {/* ========================================================= */}
      {altSekme === "degerleme" && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Sol Form: Parametre Girişleri (7 Kolon) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="text-amber-600" size={18} /> Canlı Hayvan & Sürü Değerleme Formu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zooteknik veriler, karkas randımanı ve amortisman katsayılarıyla resmi değer takdiri
                </p>
              </div>
              <button
                onClick={() => {
                  handleTurDegistir("buyukbas");
                  setHayvanAdet(1);
                  showToast("Form varsayılan değerlere sıfırlandı");
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw size={13} /> Sıfırla
              </button>
            </div>

            {/* Tür Seçimi Butonları */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Hayvan Kategorisi</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleTurDegistir("buyukbas")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    turTipi === "buyukbas"
                      ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Beef size={20} className={turTipi === "buyukbas" ? "text-amber-600" : "text-slate-400"} />
                  <span className="text-xs">Büyükbaş</span>
                  <span className="text-[10px] text-slate-400">Sığır / Manda</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTurDegistir("kucukbas")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    turTipi === "kucukbas"
                      ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <PawPrint size={20} className={turTipi === "kucukbas" ? "text-amber-600" : "text-slate-400"} />
                  <span className="text-xs">Küçükbaş</span>
                  <span className="text-[10px] text-slate-400">Koyun / Keçi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTurDegistir("kanatli")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    turTipi === "kanatli"
                      ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Bird size={20} className={turTipi === "kanatli" ? "text-amber-600" : "text-slate-400"} />
                  <span className="text-xs">Kanatlı</span>
                  <span className="text-[10px] text-slate-400">Tavuk / Hindi / Kaz</span>
                </button>
              </div>
            </div>

            {/* Irk Seçimi Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Irk / Tür Seçimi</label>
              <select
                value={seciliIrkAd}
                onChange={(e) => handleIrkDegistir(e.target.value)}
                className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              >
                {turTipi === "buyukbas" &&
                  BUYUKBAS_IRKLARI.map((irk) => (
                    <option key={irk.irk} value={irk.irk}>
                      {irk.irk} ({irk.tip} Tipi - Ort. {irk.ortCanliAgirlik} kg - Karkas %{irk.karkasRandimani})
                    </option>
                  ))}
                {turTipi === "kucukbas" &&
                  KUCUKBAS_IRKLARI.map((irk) => (
                    <option key={irk.irk} value={irk.irk}>
                      {irk.irk} ({irk.hayvanTuru} - {irk.tip} - Ort. {irk.ortCanliAgirlik} kg - Karkas %{irk.karkasRandimani})
                    </option>
                  ))}
                {turTipi === "kanatli" &&
                  KANATLI_TURLERI.map((tur) => (
                    <option key={tur.tur} value={tur.tur}>
                      {tur.tur} ({tur.tip} - {tur.canliAgirlik} kg - Karkas %{tur.karkasRandimani})
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-slate-500 italic mt-1">{aktifIrkData.aciklama}</p>
            </div>

            {/* Sayısal Girdiler Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hayvan Sayısı (Adet/Baş)</label>
                <input
                  type="number"
                  min={1}
                  value={hayvanAdet}
                  onChange={(e) => setHayvanAdet(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {turTipi === "kanatli" ? "Yaş (Ay)" : "Hayvanın Yaşı (Yıl)"}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={0.1}
                  value={hayvanYasi}
                  onChange={(e) => setHayvanYasi(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Canlı Ağırlık (kg / adet)</label>
                <input
                  type="number"
                  step="1"
                  min={0.5}
                  value={canliAgirlik}
                  onChange={(e) => setCanliAgirlik(Math.max(0.5, parseFloat(e.target.value) || 1))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-bold text-amber-900"
                />
              </div>
            </div>

            {/* Damızlık Nitelik Durumu Toggle */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Award size={15} className="text-amber-600" /> Damızlık Nitelik & Soykütüğü Primi
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Hayvan kayıtlı damızlık vasfına haiz mi? (Canlı değere damızlık katsayısı eklenir)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDamizlik(!isDamizlik)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    isDamizlik ? "bg-amber-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                      isDamizlik ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {isDamizlik && (
                <div className="pt-2 border-t border-amber-200 flex flex-wrap gap-4 items-center">
                  <span className="text-xs font-semibold text-slate-700">Damızlık Belge Türü:</span>
                  <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="damizlikTip"
                      checked={damizlikDerece === "tescilli"}
                      onChange={() => setDamizlikDerece("tescilli")}
                      className="text-amber-600"
                    />
                    <span>Resmi Pedigrili / Birlik Tescilli (+%35)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="damizlikTip"
                      checked={damizlikDerece === "isletme"}
                      onChange={() => setDamizlikDerece("isletme")}
                      className="text-amber-600"
                    />
                    <span>İşletme Damızlığı (+%20)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Verim Girdileri (Süt veya Yumurta) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {turTipi !== "kanatli" ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Milk size={13} className="text-blue-600" /> Günlük Süt (Litre/Gün)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={gunlukSut}
                      onChange={(e) => setGunlukSut(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar size={13} className="text-slate-500" /> Laktasyon Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={365}
                      value={laktasyonGun}
                      onChange={(e) => setLaktasyonGun(parseInt(e.target.value) || 305)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Egg size={13} className="text-amber-600" /> Yıllık Yumurta Verimi (Adet)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={yumurtaVerimi}
                    onChange={(e) => setYumurtaVerimi(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-bold"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Layers size={13} className="text-emerald-600" /> Günlük Rasyon Yem (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  value={gunlukYemKg}
                  onChange={(e) => setGunlukYemKg(Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none font-bold"
                />
              </div>
            </div>

            {/* Manuel Birim Fiyatları Özelleştirme Açılır Bölümü */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOzelFiyatAktif(!ozelFiyatAktif)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
              >
                {ozelFiyatAktif ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {ozelFiyatAktif
                  ? "Resmi Birim Fiyatlara Geri Dön (UKON / USK 2024-2025)"
                  : "Birim Fiyatları Özelleştir (Yerel Borsa / Dava Tarihi Rayici)"}
              </button>

              {ozelFiyatAktif && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-[fadeIn_0.2s_ease]">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Canlı Kg (₺)</label>
                    <input
                      type="number"
                      value={ozelCanliKgFiyat}
                      onChange={(e) => setOzelCanliKgFiyat(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Karkas Kg (₺)</label>
                    <input
                      type="number"
                      value={ozelKarkasKgFiyat}
                      onChange={(e) => setOzelKarkasKgFiyat(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Süt Litre (₺)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ozelSutLitreFiyat}
                      onChange={(e) => setOzelSutLitreFiyat(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Yem Kg (₺)</label>
                    <input
                      type="number"
                      step="0.2"
                      value={ozelYemKgFiyat}
                      onChange={(e) => setOzelYemKgFiyat(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon: Hesaplama Sonucu Kartı (5 Kolon) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-xl border border-amber-500/30 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Bilirkişi Değerleme Özeti
                  </span>
                  <h4 className="text-xl font-black text-white">{seciliIrkAd}</h4>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                  {hayvanAdet} Baş
                </div>
              </div>

              {/* Ana Toplam Değer Vurgusu */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-xs text-slate-300 font-medium">Toplam Sürü / Kümes Nihai Değeri</p>
                <p className="text-3xl font-black text-amber-400 mt-1">
                  {degerlemeSonucu.toplamSuruDegeri.toLocaleString("tr-TR")} ₺
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Birim Değer: {degerlemeSonucu.netBirimDeger.toLocaleString("tr-TR")} ₺ / baş (Amortisman: %
                  {degerlemeSonucu.amortismanOrani})
                </p>
              </div>

              {/* Ayrıştırma Tablosu */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-700/60">
                  <span className="text-slate-400">Canlı Ağırlık Değeri ({canliAgirlik} kg × {degerlemeSonucu.canliKgFiyat} ₺):</span>
                  <span className="font-bold text-white">{degerlemeSonucu.canliDegerBirim.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/60">
                  <span className="text-slate-400">
                    Karkas Et Değeri (%{aktifIrkData.karkasRandimani} randıman - {degerlemeSonucu.karkasAgirlikBirim} kg):
                  </span>
                  <span className="font-bold text-white">{degerlemeSonucu.karkasDegerBirim.toLocaleString("tr-TR")} ₺</span>
                </div>
                {isDamizlik && (
                  <div className="flex justify-between py-1.5 border-b border-slate-700/60 text-amber-300">
                    <span>Damızlık Soykütüğü Primi ({damizlikDerece === "tescilli" ? "+%35" : "+%20"}):</span>
                    <span className="font-bold">+{degerlemeSonucu.damizlikFarki.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-700/60 text-rose-300">
                  <span>Yaş & Amortisman Düşüşü (%{degerlemeSonucu.amortismanOrani}):</span>
                  <span className="font-bold">Uygulandı</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/60 text-emerald-300">
                  <span>Yıllık Brüt Ürün Geliri ({turTipi === "kanatli" ? "Yumurta" : "Süt"}):</span>
                  <span className="font-bold">+{degerlemeSonucu.yillikBrutUrunGeliri.toLocaleString("tr-TR")} ₺/baş</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/60 text-amber-200">
                  <span>Yıllık Yem Maliyeti ({gunlukYemKg} kg × 365 gün):</span>
                  <span className="font-bold">-{degerlemeSonucu.yillikYemMaliyetiBirim.toLocaleString("tr-TR")} ₺/baş</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-emerald-400 text-sm">
                  <span>Net Yıllık İşletme Kârı (Birim):</span>
                  <span>{degerlemeSonucu.yillikNetGelirBirim.toLocaleString("tr-TR")} ₺/yıl</span>
                </div>
                {hayvanAdet > 1 && (
                  <div className="flex justify-between py-2 font-bold text-amber-300 text-sm border-t border-slate-700">
                    <span>Sürü Toplam Yıllık Net Geliri:</span>
                    <span>{degerlemeSonucu.toplamYillikNetGelir.toLocaleString("tr-TR")} ₺/yıl</span>
                  </div>
                )}
              </div>

              {/* Rapor Paragrafı Kopyalama */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const metin = `02.01 HAYVANCILIK BİLİRKİŞİ DEĞERLEME TESPİT TUTANAĞI:
Değerleme Konusu: ${hayvanAdet} Baş ${seciliIrkAd} (${turTipi.toUpperCase()})
Yaş: ${hayvanYasi} Yıl | Canlı Ağırlık: ${canliAgirlik} kg | Karkas Randımanı: %${aktifIrkData.karkasRandimani}
Damızlık Durumu: ${isDamizlik ? (damizlikDerece === "tescilli" ? "Pedigrili Tescilli Damızlık" : "İşletme Damızlığı") : "Ticari / Besi"}
Canlı Ağırlık Birim Değeri: ${degerlemeSonucu.canliDegerBirim.toLocaleString("tr-TR")} ₺
Karkas Et Emsal Değeri: ${degerlemeSonucu.karkasDegerBirim.toLocaleString("tr-TR")} ₺
Yaşa Bağlı Amortisman Oranı: %${degerlemeSonucu.amortismanOrani}
Nihai Birim Canlı Değer: ${degerlemeSonucu.netBirimDeger.toLocaleString("tr-TR")} ₺ / baş
TOPLAM SÜRÜ / HAYVAN DEĞERİ: ${degerlemeSonucu.toplamSuruDegeri.toLocaleString("tr-TR")} ₺
Yıllık Net Ürün Getirisi (Yem Masrafı Tenzilli): ${degerlemeSonucu.toplamYillikNetGelir.toLocaleString("tr-TR")} ₺`;
                    kopyalaMetin(metin, "Değerleme rapor özeti kopyalandı");
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Copy size={14} /> Rapor Metnini Kopyala
                </button>
                <button
                  type="button"
                  onClick={onGoToWizard}
                  className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                  title="Genel Bilirkişi Sihirbazına Dön"
                >
                  <ExternalLink size={14} /> Genel Sihirbaz
                </button>
              </div>
            </div>

            {/* İkame Prensibi Bilgilendirme Notu */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <Info size={14} className="text-amber-700 shrink-0" /> Bilirkişi Değerleme Notu (ZMO Standartları)
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Canlı hayvanlar doğurgan sermaye niteliğinde olduğundan doğrudan kapitalizasyon faiz oranı (%4-5) uygulanmaz. Mahallin ticaret borsası bültenleri, damızlık birlik kayıtları ve UKON/USK taban fiyatları doğrultusunda <b>ikame piyasa değeri</b> ve <b>yoksun kalınan net mahrumiyet</b> esası uygulanır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SEKME: TELEF & HASAR TAZMİNATI HESAPLAMA */}
      {/* ========================================================= */}
      {altSekme === "telef" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Sol Panel: Olay ve Telef Parametreleri (7 Kolon) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="text-rose-600" size={18} /> Telef & Hasar Tazminatı Parametreleri
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ölüm sebebi, Yargıtay emsal mahsup ilkeleri ve ÜFE endeksli güncel tazminat hesabı
                </p>
              </div>

              {/* Telef Nedeni Seçici */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Telef / Ölüm Nedeni</label>
                <select
                  value={telefNedeniAd}
                  onChange={(e) => setTelefNedeniAd(e.target.value)}
                  className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:border-amber-500 outline-none"
                >
                  {TELEF_NEDENLERI.map((neden) => (
                    <option key={neden.neden} value={neden.neden}>
                      {neden.neden} ({neden.nedenKodu || "KOD"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Seçili Nedene Göre Bilgi Kartı */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-800">Hasar Türü: {aktifTelefNedeni.neden}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                    KOD: {aktifTelefNedeni.nedenKodu || "TK"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{aktifTelefNedeni.aciklama}</p>
                <div className="pt-1">
                  <span className="font-bold text-slate-700 block text-[11px] mb-1">Dosyada Aranacak Zorunlu Deliller:</span>
                  <ul className="space-y-0.5 pl-2 text-[10px] text-slate-500 list-disc list-inside">
                    {aktifTelefNedeni.gerekliDeliller.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hayvan Türü ve Adedi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={telefTur}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setTelefTur(t);
                      if (t === "buyukbas") setTelefCanliAgirlik(650);
                      else if (t === "kucukbas") setTelefCanliAgirlik(60);
                      else setTelefCanliAgirlik(2.6);
                    }}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="buyukbas">Büyükbaş</option>
                    <option value="kucukbas">Küçükbaş</option>
                    <option value="kanatli">Kanatlı</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Telef Olan Sayı (Adet)</label>
                  <input
                    type="number"
                    min={1}
                    value={telefAdet}
                    onChange={(e) => setTelefAdet(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ortalama Canlı Ağırlık (kg)</label>
                  <input
                    type="number"
                    min={0.5}
                    value={telefCanliAgirlik}
                    onChange={(e) => setTelefCanliAgirlik(Math.max(0.5, parseFloat(e.target.value) || 1))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>
              </div>

              {/* Gebelik Durumu Toggle */}
              {telefTur !== "kanatli" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Heart size={14} className="text-rose-500" /> Gebe Hayvan & Yavru Kaybı
                      </span>
                      <p className="text-[11px] text-slate-500">Telef olan hayvan gebe miydi? (Ek yavru tazminatı eklenir)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTelefGebe(!telefGebe)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                        telefGebe ? "bg-rose-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                          telefGebe ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {telefGebe && (
                    <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-700">Gebelik Ayı:</label>
                      <input
                        type="number"
                        min={1}
                        max={telefTur === "buyukbas" ? 9 : 5}
                        value={telefGebelikAyi}
                        onChange={(e) => setTelefGebelikAyi(parseInt(e.target.value) || 1)}
                        className="w-20 p-2 text-xs rounded-lg border bg-white font-bold text-center"
                      />
                      <span className="text-[11px] text-slate-500">
                        ({telefTur === "buyukbas" ? "Maksimum 9 ay" : "Maksimum 5 ay"})
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Yoksun Kalınan Kâr & Yem Tasarrufu (Yargıtay Standartları) */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-amber-700" /> Yoksun Kalınan Net Kâr (Yargıtay 3. HD 2021/4812 E.)
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  İkame hayvan satın alınana kadar geçecek makul süre için brüt süt gelirinden cepte kalan günlük yem tasarrufu <b>MUTLAKA mahsup edilir</b>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Makul İkame Süresi (Gün)</label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      value={ikameGun}
                      onChange={(e) => setIkameGun(parseInt(e.target.value) || 45)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border bg-white font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Emsal: 30-60 gün</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Günlük Süt (Litre)</label>
                    <input
                      type="number"
                      value={telefGunlukSut}
                      onChange={(e) => setTelefGunlukSut(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border bg-white font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Kayıp hasılat</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-rose-800">Tasarruf Edilen Yem (kg)</label>
                    <input
                      type="number"
                      value={telefGunlukYemTasarrufu}
                      onChange={(e) => setTelefGunlukYemTasarrufu(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-rose-300 bg-white font-bold text-rose-900"
                    />
                    <p className="text-[10px] text-rose-500 mt-0.5">Mahsup edilecek yem</p>
                  </div>
                </div>
              </div>

              {/* Hurda (Kurtarma) Mahsubu & Müterafik Kusur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Scale size={13} className="text-amber-600" /> Hurda / Kurtarma Bedeli (Mahsup)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={telefHurdaBedeli}
                    onChange={(e) => setTelefHurdaBedeli(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-bold text-rose-700"
                  />
                  <p className="text-[10px] text-slate-500">
                    Acil kesim karkas/deri satışı yapıldıysa tazminattan düşülür (Yargıtay 3. HD)
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Shield size={13} className="text-blue-600" /> Müterafik Kusur İndirimi (%)
                  </label>
                  <select
                    value={muterafikKusurOrani}
                    onChange={(e) => setMuterafikKusurOrani(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value={0}>%0 - Kusursuz (Hayvan sahibi kusursuz)</option>
                    <option value={20}>%20 - Hafif İhmal (Yarı gözetim eksikliği)</option>
                    <option value={30}>%30 - Başıboş Otlatma / Çoban Yokluğu</option>
                    <option value={50}>%50 - Eşit Kusur (Karayoluna serbest bırakma)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">TBK m.52 hakkaniyet ve müterafik kusur tenzili</p>
                </div>
              </div>

              {/* Telef Yılı (ÜFE Escalation) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock size={13} className="text-indigo-600" /> Telef / Olay Yılı (Yİ-ÜFE Endeksleme)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.keys(UFE_ARTIS_KATSAYILARI).map((yil) => (
                    <button
                      key={yil}
                      type="button"
                      onClick={() => setTelefYili(yil)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        telefYili === yil
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {yil}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-indigo-700 mt-1">
                  {UFE_ARTIS_KATSAYILARI[telefYili]?.aciklama} ({telefSonucu.endeksKatsayisi} kat katsayı)
                </p>
              </div>
            </div>

            {/* Sağ Panel: Tazminat Döküm ve AI Rapor Kartı (5 Kolon) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl shadow-xl border border-rose-500/30 p-6 space-y-6">
                <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      Tazminat Hesap Tablosu
                    </span>
                    <h4 className="text-xl font-black text-white">{telefAdet} Baş Telef Tazminatı</h4>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold">
                    {telefYili} Yılı Olayı
                  </span>
                </div>

                {/* Güncel Endeksli Toplam Değer Kutusu */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
                  <p className="text-xs text-rose-200 font-medium">Güncellenmiş Toplam Tazminat Tutarı (ÜFE Dahil)</p>
                  <p className="text-3xl font-black text-rose-400 mt-1">
                    {telefSonucu.guncelTazminat.toLocaleString("tr-TR")} ₺
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Olay Tarihi Net Tazminat: {telefSonucu.olayTarihiTazminat.toLocaleString("tr-TR")} ₺
                  </p>
                </div>

                {/* Matematiksel Kalemler Tablosu */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-300">Hayvanların Pazar İkame Değeri:</span>
                    <span className="font-bold text-white">+{telefSonucu.toplamPiyasaDegeri.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  {telefGebe && (
                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-rose-300">
                      <span>Gebe Hayvan Yavru Kaybı ({telefGebelikAyi}. ay):</span>
                      <span className="font-bold">+{telefSonucu.toplamGebeKaybi.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-amber-300">
                    <span>Yoksun Kalınan Net Süt Kârı ({ikameGun} gün - Yem tenzilli):</span>
                    <span className="font-bold">+{telefSonucu.toplamYoksunKar.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Brüt Toplam Zarar:</span>
                    <span className="font-bold text-white">{telefSonucu.brutToplamZarar.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-emerald-300 font-medium">
                    <span>Karkas/Deri Kurtarma Hurda Mahsubu (-):</span>
                    <span className="font-bold">-{telefSonucu.hurdaMahsubu.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  {muterafikKusurOrani > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-slate-800 text-blue-300">
                      <span>Müterafik Kusur İndirimi (%{muterafikKusurOrani} - TBK m.52):</span>
                      <span className="font-bold">-{telefSonucu.kusurIndirimTutari.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-t border-slate-700 text-slate-200 font-bold">
                    <span>Olay Tarihi Hüküm Tutarı:</span>
                    <span className="text-amber-400">{telefSonucu.olayTarihiTazminat.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  {telefYili !== "2026" && (
                    <div className="flex justify-between py-1 text-indigo-300 text-[11px]">
                      <span>Yİ-ÜFE Kümülatif Artış Çarpanı:</span>
                      <span className="font-bold font-mono">× {telefSonucu.endeksKatsayisi}</span>
                    </div>
                  )}
                </div>

                {/* AI Rapor Üretici Butonu */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiReport}
                    disabled={aiGenerating}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
                  >
                    <Sparkles size={15} />
                    {aiGenerating ? "Mahkeme Gerekçesi Hazırlanıyor..." : "Yargıtay Uyumlu Rapor Metni Yazdır"}
                  </button>
                </div>
              </div>

              {/* Oluşturulan AI Rapor Metni Alanı */}
              {aiGerekceMetni && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-3 animate-[fadeIn_0.3s_ease]">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText size={15} className="text-rose-600" /> Gerekçeli Bilirkişi Rapor Paragrafı
                    </span>
                    <button
                      onClick={() => kopyalaMetin(aiGerekceMetni, "Gerekçeli rapor metni kopyalandı")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Copy size={12} /> Kopyala
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={aiGerekceMetni}
                    rows={10}
                    className="w-full text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono leading-relaxed outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SEKME: IRK & VERİM VERİTABANI */}
      {/* ========================================================= */}
      {altSekme === "irkDB" && (
        <div className="space-y-6">
          {/* Üst Filtreler ve Arama */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setIrkKategoriFiltre("tumu")}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  irkKategoriFiltre === "tumu"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tümü ({BUYUKBAS_IRKLARI.length + KUCUKBAS_IRKLARI.length + KANATLI_TURLERI.length})
              </button>
              <button
                onClick={() => setIrkKategoriFiltre("buyukbas")}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  irkKategoriFiltre === "buyukbas"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Beef size={14} /> Büyükbaş ({BUYUKBAS_IRKLARI.length})
              </button>
              <button
                onClick={() => setIrkKategoriFiltre("kucukbas")}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  irkKategoriFiltre === "kucukbas"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <PawPrint size={14} /> Küçükbaş ({KUCUKBAS_IRKLARI.length})
              </button>
              <button
                onClick={() => setIrkKategoriFiltre("kanatli")}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  irkKategoriFiltre === "kanatli"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Bird size={14} /> Kanatlı ({KANATLI_TURLERI.length})
              </button>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={irkArama}
                onChange={(e) => setIrkArama(e.target.value)}
                placeholder="Irk, verim yönü veya özellik ara..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Irk Kartları Izgarası */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrelenmisIrklar.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setDetaySeciliIrk(item)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase">
                        {item.turKategori} • {item.tip}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">{item.ad}</h4>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                      {item.turKategori === "Büyükbaş" ? (
                        <Beef size={20} className="text-amber-700" />
                      ) : item.turKategori === "Küçükbaş" ? (
                        <PawPrint size={20} className="text-amber-700" />
                      ) : (
                        <Bird size={20} className="text-amber-700" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.aciklama}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 block">Canlı Ağırlık:</span>
                      <span className="font-bold text-slate-800">{item.canliAgirlik} kg</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 block">Karkas Randımanı:</span>
                      <span className="font-bold text-slate-800">%{item.karkasRandimani}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 block">
                        {item.turKategori === "Kanatlı" ? "Yıllık Yumurta:" : "Yıllık Süt:"}
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.turKategori === "Kanatlı"
                          ? `${item.yumurtaVerimi} adet`
                          : `${item.sutVerimi ? item.sutVerimi.toLocaleString("tr-TR") : 0} lt`}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 block">Ekonomik Ömür:</span>
                      <span className="font-bold text-slate-800">
                        {item.ekonomikOmur} {item.turKategori === "Kanatlı" ? "Ay" : "Yıl"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-900">Damızlık Değeri:</span>
                    <span className="text-xs font-black text-amber-800">
                      {item.damizlikMin.toLocaleString("tr-TR")} ₺ - {item.damizlikMax.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seçili Irk Detay Modalı */}
          {detaySeciliIrk && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-xl rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease]">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      {detaySeciliIrk.turKategori} Standart Kartı
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{detaySeciliIrk.ad}</h3>
                  </div>
                  <button
                    onClick={() => setDetaySeciliIrk(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border">
                  {detaySeciliIrk.aciklama}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <span className="text-slate-500 block text-[10px]">Ortalama Canlı Ağırlık</span>
                    <span className="text-sm font-black text-slate-900">{detaySeciliIrk.canliAgirlik} kg</span>
                  </div>
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <span className="text-slate-500 block text-[10px]">Karkas Randımanı</span>
                    <span className="text-sm font-black text-slate-900">%{detaySeciliIrk.karkasRandimani}</span>
                  </div>
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <span className="text-slate-500 block text-[10px]">Günlük Yem Maliyeti</span>
                    <span className="text-sm font-black text-slate-900">{detaySeciliIrk.yemMaliyeti} ₺/gün</span>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <span className="text-slate-500 block text-[10px]">Ekonomik Ömür</span>
                    <span className="text-sm font-black text-slate-900">
                      {detaySeciliIrk.ekonomikOmur} {detaySeciliIrk.turKategori === "Kanatlı" ? "Ay" : "Yıl"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl col-span-2">
                    <span className="text-slate-500 block text-[10px]">Piyasa Damızlık Değer Aralığı</span>
                    <span className="text-sm font-black text-amber-700">
                      {detaySeciliIrk.damizlikMin.toLocaleString("tr-TR")} ₺ -{" "}
                      {detaySeciliIrk.damizlikMax.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      if (detaySeciliIrk.turKategori === "Büyükbaş") {
                        handleTurDegistir("buyukbas");
                        handleIrkDegistir(detaySeciliIrk.rawObj.irk);
                      } else if (detaySeciliIrk.turKategori === "Küçükbaş") {
                        handleTurDegistir("kucukbas");
                        handleIrkDegistir(detaySeciliIrk.rawObj.irk);
                      } else {
                        handleTurDegistir("kanatli");
                        handleIrkDegistir(detaySeciliIrk.rawObj.tur);
                      }
                      setDetaySeciliIrk(null);
                      setAltSekme("degerleme");
                      showToast(`${detaySeciliIrk.ad} değerleme sihirbazına aktarıldı`);
                    }}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
                  >
                    Bu Irkı Değerleme Sihirbazına Aktar
                  </button>
                  <button
                    onClick={() => setDetaySeciliIrk(null)}
                    className="py-2.5 px-4 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alt Kısım: Yem Fiyatları Referans Tablosu */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="text-emerald-600" size={16} /> Resmi Yem Fiyatları & Rasyon Maliyet Referansı (2024-2025)
                </h4>
                <p className="text-xs text-slate-500">
                  Tarım Kredi Kooperatifleri, Türkiye Yem Sanayicileri Birliği ve mahalli borsa verileri
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                21 Referans Yem Kalemi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-700 font-bold">
                    <th className="p-3">Yem / Hammadde Çeşidi</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Kg Başına Fiyat (TL/kg)</th>
                    <th className="p-3">50 kg Çuval Emsal Bedeli</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(YEM_FIYATLARI).map(([key, fiyat]) => {
                    const info = YEM_ETIKETLERI[key] || { ad: key, kategori: "Genel Yem" };
                    return (
                      <tr key={key} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-semibold text-slate-800">{info.ad}</td>
                        <td className="p-3 text-slate-500">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium">
                            {info.kategori}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-700">{Number(fiyat).toFixed(2)} ₺ / kg</td>
                        <td className="p-3 text-slate-600 font-medium">{(Number(fiyat) * 50).toLocaleString("tr-TR")} ₺</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SEKME: REHBER İLKELER & KONTROL LİSTESİ */}
      {/* ========================================================= */}
      {altSekme === "rehber" && (
        <div className="space-y-6">
          {/* Rehber İçi Alt Sekmeler */}
          <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm max-w-lg">
            <button
              onClick={() => setRehberAltSekme("ilkeler")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rehberAltSekme === "ilkeler"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen size={14} /> Rehber İlkeler
            </button>
            <button
              onClick={() => setRehberAltSekme("kontrol")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rehberAltSekme === "kontrol"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clipboard size={14} /> Rapor Kontrol Listesi (%{kontrolYuzdesi})
            </button>
            <button
              onClick={() => setRehberAltSekme("ictihat")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rehberAltSekme === "ictihat"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Scale size={14} /> Yargıtay İçtihatları
            </button>
          </div>

          {/* 4.A: REHBER İLKELER (Expand/Collapse) */}
          {rehberAltSekme === "ilkeler" && (
            <div className="space-y-4">
              {HAYVAN_DEGERLEME_REHBER_ILKELERI.map((ilke) => {
                const isOpen = genisleyenIlkeId === ilke.id;
                return (
                  <div
                    key={ilke.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setGenisleyenIlkeId(isOpen ? "" : ilke.id)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition"
                    >
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                          {ilke.kaynak}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{ilke.baslik}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{ilke.ozet}</p>
                      </div>
                      <div className="shrink-0 p-1 rounded-lg text-slate-400 mt-1">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-100 space-y-4 text-xs animate-[fadeIn_0.2s_ease]">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                          <b>Detaylı Açıklama:</b> {ilke.detay}
                        </div>

                        {/* Kontrol Listesi Maddeleri */}
                        <div className="space-y-1.5">
                          <span className="font-bold text-slate-800">Bilirkişi Denetim Adımları:</span>
                          <ul className="space-y-1 pl-1">
                            {ilke.kontrolListesi.map((kMadde, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-600">
                                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>{kMadde}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Hatalı vs Doğru Uygulama Kıyaslaması */}
                        <div className="grid md:grid-cols-2 gap-3 pt-2">
                          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                            <span className="font-bold text-rose-800 flex items-center gap-1.5">
                              <AlertTriangle size={14} /> Hatalı / Bozma Nedeni Uygulama:
                            </span>
                            <p className="text-rose-900 italic">{ilke.ornekIhlal}</p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                              <CheckCircle2 size={14} /> Doğru Bilirkişi Uygulaması:
                            </span>
                            <p className="text-emerald-900">{ilke.dogruUygulama}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              const text = `${ilke.baslik}\nKaynak: ${ilke.kaynak}\nÖzet: ${ilke.ozet}\nDoğru Uygulama: ${ilke.dogruUygulama}`;
                              kopyalaMetin(text, "İlke metni kopyalandı");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                          >
                            <Copy size={13} /> Bu İlkeyi Kopyala
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 4.B: RAPOR KONTROL LİSTESİ */}
          {rehberAltSekme === "kontrol" && (
            <div className="space-y-6">
              {/* İlerleme ve Aksiyon Çubuğu */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clipboard className="text-amber-600" size={16} /> Hayvancılık Bilirkişi Raporu Denetim Skoru
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tamamlananKontrolSayisi} / {tumKontrolMaddeleri.length} Madde Onaylandı (%{kontrolYuzdesi})
                  </p>
                  <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        kontrolYuzdesi === 100
                          ? "bg-emerald-500"
                          : kontrolYuzdesi >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${kontrolYuzdesi}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={tumKontrolleriSec}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition"
                  >
                    Tümünü Onayla
                  </button>
                  <button
                    onClick={kontrolSifirla}
                    className="px-3.5 py-2 rounded-xl border hover:bg-slate-50 text-slate-600 font-bold text-xs transition"
                  >
                    Sıfırla
                  </button>
                  <button
                    onClick={() => {
                      const eksikler = tumKontrolMaddeleri.filter((m) => !kontrolCheckboxlar[m.id]);
                      const metin = `02.01 HAYVANCILIK BİLİRKİŞİ RAPORU KONTROL LİSTESİ SONUCU:
Tarih: ${new Date().toLocaleDateString("tr-TR")}
Uygunluk Oranı: %${kontrolYuzdesi} (${tamamlananKontrolSayisi}/${tumKontrolMaddeleri.length})
Durum: ${kontrolYuzdesi === 100 ? "MAHKEMEYE SUNULMAYA EKSİKSİZ UYGUN" : "EKSİK MADDELER MEVCUT"}

${
  eksikler.length > 0
    ? "Denetlenmemiş Adımlar:\n" + eksikler.map((e) => `- [ ] ${e.metin} (${e.mevzuat})`).join("\n")
    : "Tüm adımlar eksiksiz tamamlanmıştır."
}`;
                      kopyalaMetin(metin, "Denetim raporu kopyalandı");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Copy size={13} /> Denetim Özetini Kopyala
                  </button>
                </div>
              </div>

              {/* Maddeler Listesi */}
              <div className="space-y-4">
                {HAYVAN_KONTROL_LISTESI.map((kategori) => (
                  <div key={kategori.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                    <div className="border-b pb-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                          {kategori.asama}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{kategori.baslik}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 hidden sm:block">{kategori.aciklama}</p>
                    </div>

                    <div className="space-y-2.5">
                      {kategori.maddeler.map((madde) => {
                        const checked = !!kontrolCheckboxlar[madde.id];
                        return (
                          <div
                            key={madde.id}
                            onClick={() => toggleKontrolCheckbox(madde.id)}
                            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                              checked
                                ? "bg-amber-50/60 border-amber-300 shadow-sm"
                                : "bg-slate-50/60 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className={`text-xs font-bold ${checked ? "text-amber-900" : "text-slate-800"}`}>
                                  {madde.metin}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    madde.onem === "kritik"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {madde.onem.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{madde.aciklama}</p>
                              <span className="text-[10px] font-mono text-slate-400 block">{madde.mevzuat}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4.C: YARGITAY EMSAL İÇTİHATLARI */}
          {rehberAltSekme === "ictihat" && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={ictihatArama}
                  onChange={(e) => setIctihatArama(e.target.value)}
                  placeholder="İçtihat konusu, daire veya anahtar kelime ara (mahsup, elektrik, kaza, TARSİM)..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-white focus:border-amber-500 outline-none shadow-sm"
                />
              </div>

              <div className="space-y-4">
                {filtrelenmisIctihatlar.map((ictihat, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                      <span className="text-xs font-black text-amber-700 font-mono">
                        {ictihat.daire} - {ictihat.esas}/{ictihat.karar} ({ictihat.tarih})
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 w-fit">
                        {ictihat.konu}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium leading-relaxed">
                        <b>Yargıtay Emsal Karar Özeti:</b> {ictihat.ozet}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ictihat.anahtar.map((a, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            #{a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          const metin = `${ictihat.daire} - ${ictihat.esas}/${ictihat.karar} (${ictihat.tarih})\nKonu: ${ictihat.konu}\nÖzet: ${ictihat.ozet}`;
                          kopyalaMetin(metin, "İçtihat metni kopyalandı");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Copy size={13} /> İçtihadı Kopyala
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  Wheat,
  FlaskConical,
  Scale,
  Calculator,
  Database,
  BookOpen,
  Search,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Target,
  FileCheck,
  Download,
  RotateCcw,
  Check,
  Award,
  Layers,
  CircleCheck,
  CircleX,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  X,
  Shield,
  ShieldAlert,
  AlertCircle,
  Clipboard,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

import {
  YEM_HAMMADDELERI,
  HAYVAN_BESIN_IHTIYACLARI,
  RASYON_SABLONLARI,
  YEM_KALITE_STANDARTLARI,
  YEM_HASAR_TURLERI,
  YEM_ICTIHAT_DB,
  YEM_BESLEME_REHBER_ILKELERI,
  YEM_KONTROL_LISTESI,
  LABORATUVAR_ANALIZ_PARAMETRELERI,
  YemHammadde,
  BesinIhtiyaci,
  LabAnaliz,
  YemHasarTuru,
  YemIctihat,
} from "../data/yemlerBeslemeData";
import { sanitizeTR } from "../utils/geo";

export interface YemlerBeslemeViewProps {
  showToast: (msg: string) => void;
  onGoToWizard: () => void;
}

// RFV Kalite Sınıfları (Hay Quality Standards)
const RFV_SINIFLARI = [
  {
    sinif: "Prime / Premium (≥151)",
    minRfv: 151,
    maxRfv: 999,
    aciklama: "En üstün kalite; erken vejetatif biçim, çok yüksek süt verimli inekler için ideal sindirilebilirlik.",
    renk: "text-emerald-700 bg-emerald-50 border-emerald-300",
  },
  {
    sinif: "1. Sınıf (125 - 150)",
    minRfv: 125,
    maxRfv: 150,
    aciklama: "Yüksek kalite; erken tomurcuklanma dönemi, süt sığırları için standart 1. sınıf kaba yem.",
    renk: "text-green-700 bg-green-50 border-green-300",
  },
  {
    sinif: "2. Sınıf (103 - 124)",
    minRfv: 103,
    maxRfv: 124,
    aciklama: "İyi / Standart kalite; orta tomurcuklanma, besi sığırları ve düveler için uygun dengeli rasyon yemi.",
    renk: "text-blue-700 bg-blue-50 border-blue-300",
  },
  {
    sinif: "3. Sınıf (87 - 102)",
    minRfv: 87,
    maxRfv: 102,
    aciklama: "Orta / Vasat kalite; çiçeklenme başlangıcı, lif oranı yüksek, protein oranı düşüktür.",
    renk: "text-amber-700 bg-amber-50 border-amber-300",
  },
  {
    sinif: "4. Sınıf (75 - 86)",
    minRfv: 75,
    maxRfv: 86,
    aciklama: "Düşük kalite; tam çiçeklenme ve tohum bağlama dönemi, odunlaşmış hücre çeperi.",
    renk: "text-orange-700 bg-orange-50 border-orange-300",
  },
  {
    sinif: "5. Sınıf (<75)",
    minRfv: 0,
    maxRfv: 74,
    aciklama: "Red / Vasat altı kalite; saman düzeyinde besin değeri, ticari değer kaybı belirgindir.",
    renk: "text-red-700 bg-red-50 border-red-300",
  },
];

const KATEGORI_ETIKETLERI: Record<string, string> = {
  kaba: "Kaba Yem",
  kesif: "Kesif Yem",
  enerjik: "Enerji Yemi",
  proteinli: "Protein Yemi",
  mineral: "Mineral Yemi",
  katki: "Yem Katkısı",
};

export default function YemlerBeslemeView({
  showToast,
  onGoToWizard: _onGoToWizard,
}: YemlerBeslemeViewProps) {
  // ============================================================================
  // 4 SUB-TAB YÖNETİMİ
  // ============================================================================
  const [altSekme, setAltSekme] = useState<"rasyon" | "analiz" | "hasar" | "rehber">("rasyon");

  // ============================================================================
  // TAB 1: RASYON HESAPLAMA SİHİRBAZI STATE'LERİ
  // ============================================================================
  const [seciliHayvanId, setSeciliHayvanId] = useState<string>(HAYVAN_BESIN_IHTIYACLARI[0].id);
  const [seciliSablonId, setSeciliSablonId] = useState<string>(RASYON_SABLONLARI[0].id);

  // İnteraktif rasyondaki yemler: hammaddeId ve taze miktar (kg)
  const [rasyonYemleri, setRasyonYemleri] = useState<{ hammaddeId: string; miktarKg: number }[]>(
    () =>
      RASYON_SABLONLARI[0].bilesim.map((b) => ({
        hammaddeId: b.yemId,
        miktarKg: b.miktar,
      }))
  );

  // Hammadde Ekle Modal / Dropdown State'leri
  const [modalYemEkleAcik, setModalYemEkleAcik] = useState<boolean>(false);
  const [yemAramaMetni, setYemAramaMetni] = useState<string>("");
  const [seciliKategoriFiltre, setSeciliKategoriFiltre] = useState<string>("Tümü");

  // Aktif Seçili Hayvan İhtiyacı Objesi
  const aktifHayvan: BesinIhtiyaci = useMemo(() => {
    return (
      HAYVAN_BESIN_IHTIYACLARI.find((h) => h.id === seciliHayvanId) ||
      HAYVAN_BESIN_IHTIYACLARI[0]
    );
  }, [seciliHayvanId]);

  // Hazır şablon yükle
  const handleSablonYukle = (sablonId: string) => {
    const sablon = RASYON_SABLONLARI.find((s) => s.id === sablonId);
    if (sablon) {
      setRasyonYemleri(
        sablon.bilesim.map((b) => ({
          hammaddeId: b.yemId,
          miktarKg: b.miktar,
        }))
      );
      const hayvan = HAYVAN_BESIN_IHTIYACLARI.find(
        (h) => h.hayvanTipi.toLowerCase() === sablon.hayvanTipi.toLowerCase()
      );
      if (hayvan) {
        setSeciliHayvanId(hayvan.id);
      }
      showToast(`"${sablon.ad}" şablonu yüklendi`);
    }
  };

  // Yem miktarı güncelleme
  const handleMiktarGuncelle = (index: number, yeniMiktar: number) => {
    const val = Math.max(0, Math.round(yeniMiktar * 100) / 100);
    setRasyonYemleri((prev) => {
      const kopya = [...prev];
      kopya[index] = { ...kopya[index], miktarKg: val };
      return kopya;
    });
  };

  // Yem çıkarma
  const handleYemCikar = (index: number) => {
    setRasyonYemleri((prev) => prev.filter((_, i) => i !== index));
    showToast("Yem rasyondan çıkarıldı");
  };

  // Yem ekleme
  const handleYemEkle = (hammaddeId: string) => {
    const mevcutIndex = rasyonYemleri.findIndex((item) => item.hammaddeId === hammaddeId);
    if (mevcutIndex >= 0) {
      handleMiktarGuncelle(mevcutIndex, rasyonYemleri[mevcutIndex].miktarKg + 1.0);
      showToast("Mevcut yem miktarı 1 kg artırıldı");
    } else {
      setRasyonYemleri((prev) => [...prev, { hammaddeId, miktarKg: 2.0 }]);
      showToast("Yem rasyona eklendi");
    }
    setModalYemEkleAcik(false);
  };

  // CANLI RASYON HESAPLAMA MOTORU (Live Calculation)
  const rasyonSonucu = useMemo(() => {
    let toplamTazeKg = 0;
    let toplamKmKg = 0;
    let toplamHpKg = 0;
    let toplamMeMcal = 0;
    let toplamNdfKg = 0;
    let toplamAdfKg = 0;
    let kabaYemKmKg = 0;
    let toplamCaKg = 0;
    let toplamPKg = 0;
    let toplamMaliyetTl = 0;

    const kalemDetaylari = rasyonYemleri.map((kalem) => {
      const hammadde: YemHammadde =
        YEM_HAMMADDELERI.find((y) => y.id === kalem.hammaddeId) || YEM_HAMMADDELERI[0];
      const tazeKg = kalem.miktarKg;
      const kmKg = tazeKg * (hammadde.kuruMadde / 100);
      const hpKg = kmKg * (hammadde.hamProtein / 100);
      const meMcal = kmKg * hammadde.metabolikEnerji;
      const ndfKg = kmKg * (hammadde.ndf / 100);
      const adfKg = kmKg * (hammadde.adf / 100);
      const caKg = kmKg * (hammadde.kalsiyum / 100);
      const pKg = kmKg * (hammadde.fosfor / 100);
      const maliyet = tazeKg * hammadde.fiyatKg;
      const isKabaYem = hammadde.kategori === "kaba";

      toplamTazeKg += tazeKg;
      toplamKmKg += kmKg;
      toplamHpKg += hpKg;
      toplamMeMcal += meMcal;
      toplamNdfKg += ndfKg;
      toplamAdfKg += adfKg;
      toplamCaKg += caKg;
      toplamPKg += pKg;
      toplamMaliyetTl += maliyet;
      if (isKabaYem) kabaYemKmKg += kmKg;

      return {
        hammadde,
        tazeKg,
        kmKg,
        hpKg,
        meMcal,
        ndfKg,
        adfKg,
        maliyet,
        isKabaYem,
      };
    });

    const rasyonHpPct = toplamKmKg > 0 ? (toplamHpKg / toplamKmKg) * 100 : 0;
    const rasyonNdfPct = toplamKmKg > 0 ? (toplamNdfKg / toplamKmKg) * 100 : 0;
    const rasyonAdfPct = toplamKmKg > 0 ? (toplamAdfKg / toplamKmKg) * 100 : 0;
    const rasyonKabaYemPct = toplamKmKg > 0 ? (kabaYemKmKg / toplamKmKg) * 100 : 0;
    const rasyonCaPct = toplamKmKg > 0 ? (toplamCaKg / toplamKmKg) * 100 : 0;
    const rasyonPPct = toplamKmKg > 0 ? (toplamPKg / toplamKmKg) * 100 : 0;
    const caPOrani = rasyonPPct > 0 ? rasyonCaPct / rasyonPPct : 0;
    const kmBirimMaliyeti = toplamKmKg > 0 ? toplamMaliyetTl / toplamKmKg : 0;

    return {
      toplamTazeKg: Math.round(toplamTazeKg * 100) / 100,
      toplamKmKg: Math.round(toplamKmKg * 100) / 100,
      rasyonHpPct: Math.round(rasyonHpPct * 100) / 100,
      toplamMeMcal: Math.round(toplamMeMcal * 100) / 100,
      rasyonNdfPct: Math.round(rasyonNdfPct * 100) / 100,
      rasyonAdfPct: Math.round(rasyonAdfPct * 100) / 100,
      rasyonKabaYemPct: Math.round(rasyonKabaYemPct * 100) / 100,
      rasyonCaPct: Math.round(rasyonCaPct * 100) / 100,
      rasyonPPct: Math.round(rasyonPPct * 100) / 100,
      caPOrani: Math.round(caPOrani * 100) / 100,
      toplamMaliyetTl: Math.round(toplamMaliyetTl * 100) / 100,
      kmBirimMaliyeti: Math.round(kmBirimMaliyeti * 100) / 100,
      kalemDetaylari,
    };
  }, [rasyonYemleri]);

  // Karşılaştırma Analizi (Farklar ve Renk İndikatörleri)
  const rasyonKarsilastirma = useMemo(() => {
    const kmFarki = rasyonSonucu.toplamKmKg - aktifHayvan.kuruMaddeAlimi;
    const hpFarki = rasyonSonucu.rasyonHpPct - aktifHayvan.hamProtein;
    const meFarki = rasyonSonucu.toplamMeMcal - aktifHayvan.metabolikEnerji;
    const ndfUygun = rasyonSonucu.rasyonNdfPct >= aktifHayvan.ndf;
    const adfUygun = rasyonSonucu.rasyonAdfPct >= aktifHayvan.adf * 0.9;
    const kabaYemUygun = rasyonSonucu.rasyonKabaYemPct >= aktifHayvan.kabaYemOrani;
    const caUygun = rasyonSonucu.rasyonCaPct >= aktifHayvan.kalsiyum * 0.9;
    const pUygun = rasyonSonucu.rasyonPPct >= aktifHayvan.fosfor * 0.9;

    return {
      km: {
        deger: rasyonSonucu.toplamKmKg,
        hedef: aktifHayvan.kuruMaddeAlimi,
        fark: Math.round(kmFarki * 10) / 10,
        durum: Math.abs(kmFarki) <= 1.5 ? "ideal" : kmFarki > 1.5 ? "fazla" : "eksik",
      },
      hp: {
        deger: rasyonSonucu.rasyonHpPct,
        hedef: aktifHayvan.hamProtein,
        fark: Math.round(hpFarki * 10) / 10,
        durum: Math.abs(hpFarki) <= 1.0 ? "ideal" : hpFarki > 1.0 ? "fazla" : "eksik",
      },
      me: {
        deger: rasyonSonucu.toplamMeMcal,
        hedef: aktifHayvan.metabolikEnerji,
        fark: Math.round(meFarki * 10) / 10,
        durum: Math.abs(meFarki) <= 3.0 ? "ideal" : meFarki > 3.0 ? "fazla" : "eksik",
      },
      ndf: {
        deger: rasyonSonucu.rasyonNdfPct,
        hedefMin: `%${aktifHayvan.ndf}`,
        durum: ndfUygun ? "ideal" : "eksik",
      },
      adf: {
        deger: rasyonSonucu.rasyonAdfPct,
        hedefMin: `%${aktifHayvan.adf}`,
        durum: adfUygun ? "ideal" : "eksik",
      },
      kabaYem: {
        deger: rasyonSonucu.rasyonKabaYemPct,
        hedefMin: `%${aktifHayvan.kabaYemOrani}`,
        durum: kabaYemUygun ? "ideal" : "kritik_eksik",
      },
      ca: {
        deger: rasyonSonucu.rasyonCaPct,
        hedef: aktifHayvan.kalsiyum,
        durum: caUygun ? "ideal" : "eksik",
      },
      p: {
        deger: rasyonSonucu.rasyonPPct,
        hedef: aktifHayvan.fosfor,
        durum: pUygun ? "ideal" : "eksik",
      },
    };
  }, [rasyonSonucu, aktifHayvan]);

  // Rasyonu Kopyala
  const handleRasyonKopyala = () => {
    let metin = `========================================================\n`;
    metin += `ZİRAİ BİLİRKİŞİ RASYON VE HAYVAN BESLEME CETVELİ\n`;
    metin += `========================================================\n`;
    metin += `HAYVAN TİPİ: ${aktifHayvan.hayvanTipi}\n`;
    metin += `CANLI AĞIRLIK: ${aktifHayvan.canliAgirlik} kg\n`;
    metin += `AÇIKLAMA: ${aktifHayvan.aciklama}\n\n`;
    metin += `GÜNLÜK RASYON BİLEŞİMİ:\n`;
    metin += `--------------------------------------------------------\n`;
    rasyonSonucu.kalemDetaylari.forEach((k, idx) => {
      metin += `${idx + 1}. ${k.hammadde.ad} (${KATEGORI_ETIKETLERI[k.hammadde.kategori] || k.hammadde.kategori}): ${k.tazeKg.toFixed(
        2
      )} kg (KM: ${k.kmKg.toFixed(2)} kg, HP: %${k.hammadde.hamProtein}, ME: ${k.meMcal.toFixed(
        2
      )} Mcal, Tutar: ${k.maliyet.toFixed(2)} ₺)\n`;
    });
    metin += `--------------------------------------------------------\n`;
    metin += `TOPLAM TAZE YEM: ${rasyonSonucu.toplamTazeKg} kg / gün\n`;
    metin += `TOPLAM KURU MADDE (KM): ${rasyonSonucu.toplamKmKg} kg (Gereksinim: ${aktifHayvan.kuruMaddeAlimi} kg)\n`;
    metin += `RASYON HAM PROTEİNİ: %${rasyonSonucu.rasyonHpPct} (Gereksinim: %${aktifHayvan.hamProtein})\n`;
    metin += `TOPLAM METABOLİK ENERJİ: ${rasyonSonucu.toplamMeMcal} Mcal (Gereksinim: ${aktifHayvan.metabolikEnerji} Mcal)\n`;
    metin += `LİF ORANLARI: %${rasyonSonucu.rasyonNdfPct} NDF / %${rasyonSonucu.rasyonAdfPct} ADF\n`;
    metin += `KABA YEM ORANI: %${rasyonSonucu.rasyonKabaYemPct} (Min: %${aktifHayvan.kabaYemOrani})\n`;
    metin += `MİNERAL DENGESİ: %${rasyonSonucu.rasyonCaPct} Ca / %${rasyonSonucu.rasyonPPct} P (Ca:P Oranı: ${rasyonSonucu.caPOrani}:1)\n`;
    metin += `GÜNLÜK TOPLAM RASYON MALİYETİ: ${rasyonSonucu.toplamMaliyetTl.toLocaleString(
      "tr-TR"
    )} ₺ / baş\n`;
    metin += `1 KG KURU MADDE MALİYETİ: ${rasyonSonucu.kmBirimMaliyeti.toLocaleString(
      "tr-TR"
    )} ₺ / kg KM\n`;
    metin += `========================================================\n`;

    navigator.clipboard.writeText(metin).then(() => {
      showToast("Rasyon dökümü panoya kopyalandı");
    });
  };

  // Rasyon PDF İndir
  const handleRasyonPdfIndir = () => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const margin = 15;
      let y = 20;

      // Header Banner
      doc.setFillColor(34, 139, 34); // Green
      doc.rect(0, 0, 210, 32, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text(
        sanitizeTR("ZIRAI BILIRKISI PORTALI - RASYON VE HAYVAN BESLEME CETVELI"),
        margin,
        15
      );
      doc.setFontSize(8.5);
      doc.text(
        sanitizeTR("02.05 Yemler ve Hayvan Besleme Uzmanligi - Bilimsel Rasyon Raporu"),
        margin,
        22
      );

      y = 42;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.text(sanitizeTR(`Hayvan Tipi: ${aktifHayvan.hayvanTipi}`), margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        sanitizeTR(`Canli Agirlik: ${aktifHayvan.canliAgirlik} kg | Hedef KM: ${aktifHayvan.kuruMaddeAlimi} kg/gun`),
        margin,
        y
      );
      y += 8;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, 180, 7, "F");
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.text(sanitizeTR("Hammadde"), margin + 2, y + 5);
      doc.text(sanitizeTR("Taze (kg)"), margin + 65, y + 5);
      doc.text(sanitizeTR("KM (kg)"), margin + 90, y + 5);
      doc.text(sanitizeTR("HP (%)"), margin + 115, y + 5);
      doc.text(sanitizeTR("ME (Mcal)"), margin + 140, y + 5);
      doc.text(sanitizeTR("Tutar (TL)"), margin + 165, y + 5);
      y += 10;

      // Table Rows
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      rasyonSonucu.kalemDetaylari.forEach((k) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(sanitizeTR(k.hammadde.ad.substring(0, 32)), margin + 2, y);
        doc.text(k.tazeKg.toFixed(2), margin + 65, y);
        doc.text(k.kmKg.toFixed(2), margin + 90, y);
        doc.text(`%${k.hammadde.hamProtein.toFixed(1)}`, margin + 115, y);
        doc.text(k.meMcal.toFixed(2), margin + 140, y);
        doc.text(`${k.maliyet.toFixed(2)} TL`, margin + 165, y);
        y += 6;
      });

      y += 4;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, margin + 180, y);
      y += 8;

      // Summary Box
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, 180, 46, "F");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizeTR("RASYON VE BESIN MADDE DENGESI OZETI:"), margin + 4, y + 7);

      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(
        sanitizeTR(
          `Toplam Kuru Madde: ${rasyonSonucu.toplamKmKg} kg (Hedef: ${aktifHayvan.kuruMaddeAlimi} kg)`
        ),
        margin + 4,
        y + 14
      );
      doc.text(
        sanitizeTR(
          `Ham Protein (HP): %${rasyonSonucu.rasyonHpPct} (Hedef: %${aktifHayvan.hamProtein})`
        ),
        margin + 4,
        y + 20
      );
      doc.text(
        sanitizeTR(
          `Metabolik Enerji: ${rasyonSonucu.toplamMeMcal} Mcal (Hedef: ${aktifHayvan.metabolikEnerji} Mcal)`
        ),
        margin + 4,
        y + 26
      );
      doc.text(
        sanitizeTR(
          `NDF / ADF: %${rasyonSonucu.rasyonNdfPct} / %${rasyonSonucu.rasyonAdfPct} (Kaba Yem: %${rasyonSonucu.rasyonKabaYemPct})`
        ),
        margin + 4,
        y + 32
      );
      doc.text(
        sanitizeTR(
          `Gunluk Rasyon Maliyeti: ${rasyonSonucu.toplamMaliyetTl.toLocaleString(
            "tr-TR"
          )} TL (KM: ${rasyonSonucu.kmBirimMaliyeti.toLocaleString("tr-TR")} TL/kg)`
        ),
        margin + 4,
        y + 38
      );

      doc.save(`Rasyon_Raporu_${aktifHayvan.id}.pdf`);
      showToast("Rasyon PDF raporu indirildi");
    } catch (e) {
      console.error(e);
      showToast("PDF oluşturulurken bir hata meydana geldi");
    }
  };

  // ============================================================================
  // TAB 2: YEM ANALİZ VE KALİTE KONTROL STATE'LERİ
  // ============================================================================
  const [analizYemAdi, setAnalizYemAdi] = useState<string>("1. Kalite Kuru Yonca Otu Numunesi");
  const [analizRaporNo, setAnalizRaporNo] = useState<string>("TÜRKAK-YEM-2025/1104");
  const [analizYemTipi, setAnalizYemTipi] = useState<string>("Kaba Yem (Yonca / Ot)");

  // Laboratuvar analiz giriş değerleri
  const [analizKm, setAnalizKm] = useState<number>(89.2);
  const [analizHp, setAnalizHp] = useState<number>(18.5);
  const [analizHy, setAnalizHy] = useState<number>(2.4);
  const [analizHs, setAnalizHs] = useState<number>(28.0);
  const [analizHk, setAnalizHk] = useState<number>(8.1);
  const [analizNdf, setAnalizNdf] = useState<number>(41.5);
  const [analizAdf, setAnalizAdf] = useState<number>(30.4);
  const [analizMe, setAnalizMe] = useState<number>(2.32);
  const [analizPh, setAnalizPh] = useState<number>(4.1);
  const [analizAfb1, setAnalizAfb1] = useState<number>(2.4);
  const [analizTopAf, setAnalizTopAf] = useState<number>(4.8);

  const [genisleyenParametreIndex, setGenisleyenParametreIndex] = useState<number | null>(0);

  // RFV ve Kalite Hesaplama Motoru
  const kaliteSonucu = useMemo(() => {
    // Nispi Yem Değeri (RFV):
    // DMD% = 88.9 - (0.779 * ADF%)
    // DMI% = 120 / NDF%
    // RFV = (DMD * DMI) / 1.29
    const dmd = 88.9 - 0.779 * analizAdf;
    const dmi = analizNdf > 0 ? 120 / analizNdf : 0;
    const rfv = analizNdf > 0 ? (dmd * dmi) / 1.29 : 0;
    const yuvarlanmisRfv = Math.round(rfv);

    let rfvSinifObj = RFV_SINIFLARI[5];
    for (const item of RFV_SINIFLARI) {
      if (yuvarlanmisRfv >= item.minRfv && yuvarlanmisRfv <= item.maxRfv) {
        rfvSinifObj = item;
        break;
      }
    }

    // Aflatoksin Durumu
    let afb1Durum: { durum: "uygun" | "sartli" | "tehlikeli"; aciklama: string } = {
      durum: "uygun",
      aciklama: "Yasal limitin altında, süt sığırı yemlerinde kullanılabilir (≤ 5 ppb).",
    };
    if (analizAfb1 > 20.0) {
      afb1Durum = {
        durum: "tehlikeli",
        aciklama: "YASAL LİMİT AŞIMI (> 20 ppb). İmhaya tabi tehlikeli ayıptır, hayvanlara yedirilemez!",
      };
    } else if (analizAfb1 > 5.0) {
      afb1Durum = {
        durum: "sartli",
        aciklama:
          "Süt ineklerine YEDİRİLEMEZ (sütte Aflatoksin M1 riski). Yalnızca besi sığırlarında üst sınırda değerlendirilebilir.",
      };
    }

    // Ham Kül / Toprak Bulaşıklığı Kontrolü
    const hkSorun = analizHk > 10.0;

    // Rutubet Kontrolü
    const nem = Math.max(0, 100 - analizKm);
    const nemSorun = analizYemTipi !== "Mısır Silajı" && nem > 14.0;

    // Silaj Fermantasyon Kalitesi
    let silajDurum = "Uygulanmıyor";
    if (analizYemTipi === "Mısır Silajı") {
      if (analizPh <= 4.2) silajDurum = "Kusursuz Laktik Asit Fermantasyonu (pH ≤ 4.2)";
      else if (analizPh <= 4.5) silajDurum = "İyi Fermantasyon (pH 4.3 - 4.5)";
      else if (analizPh <= 5.0) silajDurum = "Şüpheli / Sekonder Fermantasyon (pH 4.6 - 5.0)";
      else silajDurum = "Bozuk / Clostridial Silaj (pH > 5.0 - Botulizm & Toksik Risk!)";
    }

    return {
      dmd: Math.round(dmd * 10) / 10,
      dmi: Math.round(dmi * 100) / 100,
      rfv: yuvarlanmisRfv,
      rfvSinifObj,
      afb1Durum,
      hkSorun,
      nem: Math.round(nem * 10) / 10,
      nemSorun,
      silajDurum,
    };
  }, [analizAdf, analizNdf, analizAfb1, analizHk, analizKm, analizYemTipi, analizPh]);

  const handleAnalizRaporuKopyala = () => {
    let metin = `========================================================\n`;
    metin += `YEM ANALİZ VE KALİTE KONTROL BİLİRKİŞİ DEĞERLENDİRMESİ\n`;
    metin += `========================================================\n`;
    metin += `NUMUNE ADI: ${analizYemAdi}\n`;
    metin += `RAPOR NO: ${analizRaporNo}\n`;
    metin += `YEM TÜRÜ: ${analizYemTipi}\n\n`;
    metin += `LABORATUVAR BULGULARI:\n`;
    metin += `- Kuru Madde (KM): %${analizKm} (Rutubet: %${kaliteSonucu.nem})\n`;
    metin += `- Ham Protein (HP): %${analizHp} KM\n`;
    metin += `- Ham Yağ: %${analizHy} | Ham Selüloz: %${analizHs}\n`;
    metin += `- Ham Kül: %${analizHk} KM ${
      kaliteSonucu.hkSorun ? "(DİKKAT: Toprak/kum bulaşması yüksek)" : ""
    }\n`;
    metin += `- NDF: %${analizNdf} | ADF: %${analizAdf}\n`;
    metin += `- Metabolik Enerji (ME): ${analizMe} Mcal/kg KM\n`;
    if (analizYemTipi === "Mısır Silajı") {
      metin += `- Silaj pH: ${analizPh} (${kaliteSonucu.silajDurum})\n`;
    }
    metin += `- Aflatoksin B1: ${analizAfb1} ppb (${kaliteSonucu.afb1Durum.aciklama})\n`;
    metin += `- Toplam Aflatoksin: ${analizTopAf} ppb\n\n`;
    metin += `BİLİRKİŞİ KALİTE TESPİTİ:\n`;
    metin += `- Kaba Yem Sindirilebilir Kuru Madde (DMD): %${kaliteSonucu.dmd}\n`;
    metin += `- Kuru Madde Tüketim Kapasitesi (DMI): %${kaliteSonucu.dmi} Canlı Ağırlık\n`;
    metin += `- Nispi Yem Değeri (RFV): ${kaliteSonucu.rfv} -> [${kaliteSonucu.rfvSinifObj.sinif}]\n`;
    metin += `- Açıklama: ${kaliteSonucu.rfvSinifObj.aciklama}\n`;
    metin += `========================================================\n`;

    navigator.clipboard.writeText(metin).then(() => {
      showToast("Yem analiz raporu panoya kopyalandı");
    });
  };

  // ============================================================================
  // TAB 3: YEM KAYNAKLI ZARAR HESAPLAMA STATE'LERİ
  // ============================================================================
  const [seciliHasarId, setSeciliHasarId] = useState<string>(YEM_HASAR_TURLERI[0].id);
  const [hasarHayvanTuru, setHasarHayvanTuru] = useState<"Süt Sığırı" | "Besi Sığırı" | "Küçükbaş">(
    "Süt Sığırı"
  );
  const [etkilenenHayvanSayisi, setEtkilenenHayvanSayisi] = useState<number>(30);
  const [telefSayisi, setTelefSayisi] = useState<number>(4);
  const [hayvanBirimDegeri, setHayvanBirimDegeri] = useState<number>(115000);
  const [gunlukVerimKaybi, setGunlukVerimKaybi] = useState<number>(8.0); // lt süt veya kg canlı ağırlık
  const [verimKaybiSuresi, setVerimKaybiSuresi] = useState<number>(45); // gün (Yargıtay makul iyileşme)
  const [urunBirimFiyati, setUrunBirimFiyati] = useState<number>(18.5); // ₺ / lt süt
  const [tedaviGideri, setTedaviGideri] = useState<number>(42000); // ₺
  const [imhaYemMiktari, setImhaYemMiktari] = useState<number>(14); // ton
  const [imhaYemBirimFiyati, setImhaYemBirimFiyati] = useState<number>(12800); // ₺ / ton
  const [hurdaKurtarmaBedeli, setHurdaKurtarmaBedeli] = useState<number>(70000); // ₺ zorunlu kesim mahsubu
  const [muterafikKusurPct, setMuterafikKusurPct] = useState<number>(15); // % TBK m. 52 indirimi

  // AI Gerekçe Yazıcı State
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiGerekceMetni, setAiGerekceMetni] = useState<string>("");

  const aktifHasarTuru: YemHasarTuru = useMemo(() => {
    return YEM_HASAR_TURLERI.find((h) => h.id === seciliHasarId) || YEM_HASAR_TURLERI[0];
  }, [seciliHasarId]);

  // Zarar Hesabı Motoru
  const zararHesapSonucu = useMemo(() => {
    const telefZarari = telefSayisi * hayvanBirimDegeri;
    const sagKalanEtkilenen = Math.max(0, etkilenenHayvanSayisi - telefSayisi);
    const verimKaybiTutari =
      gunlukVerimKaybi * verimKaybiSuresi * urunBirimFiyati * sagKalanEtkilenen;
    const tedaviMasraflari = tedaviGideri;
    const imhaYemTutari = imhaYemMiktari * imhaYemBirimFiyati;
    const brutToplamZarar = telefZarari + verimKaybiTutari + tedaviMasraflari + imhaYemTutari;
    const mahsupTutari = Math.min(brutToplamZarar, hurdaKurtarmaBedeli);
    const mahsupSonrasiZarar = Math.max(0, brutToplamZarar - mahsupTutari);
    const kusurIndirimTutari = Math.round(mahsupSonrasiZarar * (muterafikKusurPct / 100));
    const netTazminatTutari = Math.max(0, mahsupSonrasiZarar - kusurIndirimTutari);

    return {
      telefZarari: Math.round(telefZarari),
      verimKaybiTutari: Math.round(verimKaybiTutari),
      tedaviMasraflari: Math.round(tedaviMasraflari),
      imhaYemTutari: Math.round(imhaYemTutari),
      brutToplamZarar: Math.round(brutToplamZarar),
      mahsupTutari: Math.round(mahsupTutari),
      mahsupSonrasiZarar: Math.round(mahsupSonrasiZarar),
      kusurIndirimTutari,
      netTazminatTutari: Math.round(netTazminatTutari),
      sagKalanEtkilenen,
    };
  }, [
    telefSayisi,
    hayvanBirimDegeri,
    etkilenenHayvanSayisi,
    gunlukVerimKaybi,
    verimKaybiSuresi,
    urunBirimFiyati,
    tedaviGideri,
    imhaYemMiktari,
    imhaYemBirimFiyati,
    hurdaKurtarmaBedeli,
    muterafikKusurPct,
  ]);

  const handleAiGerekceUret = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const metin = `T.C. ASLİYE HUKUK MAHKEMESİ HAKİMLİĞİ'NE
DOSYA ESAS NO: 2024/... Esas
KONU: Yem Kaynaklı Zarar ve Maddi Tazminat Hesabına İlişkin Bilirkişi Raporu Gerekçesi

1. MADDİ VAKIA VE İLLİYET BAĞI:
Davacı işletmede davalı şirketten satın alınan yem partisinin tüketilmesini müteakip "${aktifHasarTuru.baslik}" tablosu gelişmiştir. Akredite laboratuvar analizleri, şahit numune sonuçları ve resmi veteriner hekim nekropsi tutanakları birlikte değerlendirildiğinde; meydana gelen toplu patoloji ile davalı tarafından teslim edilen ayıplı yem arasında Türk Borçlar Kanunu m. 49 ve 5996 sayılı Kanun m. 24 kapsamında doğrudan uygun nedensellik bağı (illiyet bağı) sübut bulmuştur.

2. AKTÜERYAL ZARAR KALEMLERİ HESABI:
a) Telef Olan Hayvan Zararı: Olay günü itibarıyla telef olan ${telefSayisi} baş ${hasarHayvanTuru.toLowerCase()} için il/ilçe tarım müdürlüğü ve ticaret borsası cari damızlık rayiçleri esas alınarak:
   ${telefSayisi} adet × ${hayvanBirimDegeri.toLocaleString("tr-TR")} ₺ = ${zararHesapSonucu.telefZarari.toLocaleString("tr-TR")} ₺

b) Yoksun Kalınan Süt / Verim Kaybı: Yargıtay 11. HD'nin yerleşik içtihatları gereğince verim kaybı tüm laktasyona yayılamayacağından; rasyon değişiminden sonra hayvanların metabolik toparlanması için bilimsel olarak kabul edilen ${verimKaybiSuresi} günlük rehabilitasyon periyodu ile sınırlandırılmış, sağ kalan ${zararHesapSonucu.sagKalanEtkilenen} baş hayvan için USK çiğ süt tavsiye fiyatı üzerinden:
   ${zararHesapSonucu.sagKalanEtkilenen} baş × ${gunlukVerimKaybi} lt/gün × ${verimKaybiSuresi} gün × ${urunBirimFiyati} ₺ = ${zararHesapSonucu.verimKaybiTutari.toLocaleString("tr-TR")} ₺

c) Veteriner Müdahale, Toksikoloji ve İlaç Giderleri: ${zararHesapSonucu.tedaviMasraflari.toLocaleString("tr-TR")} ₺
d) İmha Edilen Ayıplı Yem Ziyanı (${imhaYemMiktari} ton): ${zararHesapSonucu.imhaYemTutari.toLocaleString("tr-TR")} ₺
BRÜT TOPLAM MADDİ ZARAR: ${zararHesapSonucu.brutToplamZarar.toLocaleString("tr-TR")} ₺

3. ZORUNLU MAHSUPLAR VE KUSUR TENZİLATI:
- TBK m. 55 uyarınca sebepsiz zenginleşmeyi önlemek maksadıyla mezbahada zorunlu kesimden elde edilen et ve deri kurtarma bedeli (-${zararHesapSonucu.mahsupTutari.toLocaleString("tr-TR")} ₺) mahsup edilmiştir.
- Davacı yetiştiricinin yemde ilk fiziki semptomları fark etmesine karşın yedirmeyi derhal kesmeyerek basiretli yetiştirici özen borcunu kısmen ihlal ettiği değerlendirilerek TBK m. 52 uyarınca takdiren %${muterafikKusurPct} müterafik kusur indirimi (-${zararHesapSonucu.kusurIndirimTutari.toLocaleString("tr-TR")} ₺) yapılmıştır.

4. NİHAİ KANAAT VE SONUÇ:
Davalı tarafın ayıplı ifası nedeniyle davacının malvarlığında doğan ve hükme esas alınması gereken net maddi zarar ${zararHesapSonucu.netTazminatTutari.toLocaleString("tr-TR")} ₺ (Türk Lirası) olarak hesaplanmıştır.
Takdir Sayın Mahkeme'ye aittir.`;

      setAiGerekceMetni(metin);
      setAiGenerating(false);
      showToast("Bilirkişi gerekçeli mahkeme metni hazırlandı");
    }, 1200);
  };

  const handleZararRaporuKopyala = () => {
    const metin = aiGerekceMetni
      ? aiGerekceMetni
      : `ZARAR CETVELİ ÖZETİ:
- Hasar Türü: ${aktifHasarTuru.baslik}
- Telef Zararı: ${zararHesapSonucu.telefZarari.toLocaleString("tr-TR")} ₺
- Verim Kaybı (${verimKaybiSuresi} gün): ${zararHesapSonucu.verimKaybiTutari.toLocaleString("tr-TR")} ₺
- Veteriner & İlaç: ${zararHesapSonucu.tedaviMasraflari.toLocaleString("tr-TR")} ₺
- İmha Edilen Yem: ${zararHesapSonucu.imhaYemTutari.toLocaleString("tr-TR")} ₺
- Brüt Zarar: ${zararHesapSonucu.brutToplamZarar.toLocaleString("tr-TR")} ₺
- Hurda Mahsubu: -${zararHesapSonucu.mahsupTutari.toLocaleString("tr-TR")} ₺
- Müterafik Kusur (%${muterafikKusurPct}): -${zararHesapSonucu.kusurIndirimTutari.toLocaleString("tr-TR")} ₺
- HÜKME ESAS NET TAZMİNAT: ${zararHesapSonucu.netTazminatTutari.toLocaleString("tr-TR")} ₺`;

    navigator.clipboard.writeText(metin).then(() => {
      showToast("Zarar hesap raporu panoya kopyalandı");
    });
  };

  // ============================================================================
  // TAB 4: REHBER, MEVZUAT VE İÇTİHAT STATE'LERİ
  // ============================================================================
  const [rehberAltSekme, setRehberAltSekme] = useState<"ilkeler" | "kontrol" | "ictihat">("ilkeler");
  const [genisleyenIlkeId, setGenisleyenIlkeId] = useState<string>("ilke-sahit-numune");
  const [kontrolCheckboxlar, setKontrolCheckboxlar] = useState<Record<string, boolean>>({});
  const [ictihatArama, setIctihatArama] = useState<string>("");
  const [seciliIctihatEtiket, setSeciliIctihatEtiket] = useState<string>("Tümü");

  const toggleKontrolCheckbox = (id: string) => {
    setKontrolCheckboxlar((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tumKontrolleriSec = () => {
    const all: Record<string, boolean> = {};
    YEM_KONTROL_LISTESI.forEach((kat) => {
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
    return YEM_KONTROL_LISTESI.flatMap((k) => k.maddeler);
  }, []);

  const tamamlananKontrolSayisi = useMemo(() => {
    return tumKontrolMaddeleri.filter((m) => kontrolCheckboxlar[m.id]).length;
  }, [tumKontrolMaddeleri, kontrolCheckboxlar]);

  const kontrolYuzdesi = tumKontrolMaddeleri.length
    ? Math.round((tamamlananKontrolSayisi / tumKontrolMaddeleri.length) * 100)
    : 0;

  // İçtihat Arama ve Filtreleme
  const filtrelenmisIctihatlar: YemIctihat[] = useMemo(() => {
    let list = YEM_ICTIHAT_DB;
    if (seciliIctihatEtiket !== "Tümü") {
      list = list.filter((i) => i.anahtar.includes(seciliIctihatEtiket));
    }
    if (!ictihatArama.trim()) return list;

    const q = ictihatArama.toLowerCase();
    return list.filter(
      (item) =>
        item.daire.toLowerCase().includes(q) ||
        item.esas.toLowerCase().includes(q) ||
        item.karar.toLowerCase().includes(q) ||
        item.konu.toLowerCase().includes(q) ||
        item.ozet.toLowerCase().includes(q) ||
        item.anahtar.some((k) => k.toLowerCase().includes(q))
    );
  }, [ictihatArama, seciliIctihatEtiket]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* ========================================================= */}
      {/* HEADER BANNER - LIME TO EMERALD GRADIENT FEED THEME */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-lime-400/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-[50px] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-bold text-lime-100 tracking-wider mb-3">
              <Wheat size={14} /> 02.05 YEMLER VE HAYVAN BESLEME UZMANLIĞI
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Yemler & Hayvan Besleme Bilirkişilik Modülü
            </h2>
            <p className="text-xs md:text-sm text-lime-100 mt-2 leading-relaxed">
              Dinamik rasyon dengeleme sihirbazı, RFV kaba yem kalite kontrolü, mikotoksin ve silaj değerlendirmesi, yem kaynaklı telef ve süt verim kaybı tazminatı ile Yargıtay emsal içtihatları.
            </p>
          </div>

          {/* Hızlı Piyasa Rayiçleri Barı */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center p-2 rounded-xl bg-white/10">
              <p className="text-[10px] text-lime-200 font-bold uppercase tracking-wider">Süt Yemi (%19)</p>
              <p className="text-base md:text-lg font-black text-white mt-0.5">12.50 ₺/kg</p>
              <p className="text-[9px] text-lime-100">Pelet Fabrika</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/10">
              <p className="text-[10px] text-lime-200 font-bold uppercase tracking-wider">Kuru Yonca</p>
              <p className="text-base md:text-lg font-black text-white mt-0.5">9.20 ₺/kg</p>
              <p className="text-[9px] text-lime-100">1. Biçim Tomurcuk</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/10">
              <p className="text-[10px] text-lime-200 font-bold uppercase tracking-wider">Mısır Silajı</p>
              <p className="text-base md:text-lg font-black text-white mt-0.5">2.90 ₺/kg</p>
              <p className="text-[9px] text-lime-100">%32.5 KM Fermante</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/10">
              <p className="text-[10px] text-lime-200 font-bold uppercase tracking-wider">Soya Küspesi</p>
              <p className="text-base md:text-lg font-black text-white mt-0.5">20.50 ₺/kg</p>
              <p className="text-[9px] text-lime-100">%47 Ham Protein</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 ANA SUB-TAB SEÇİCİ */}
      {/* ========================================================= */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto max-w-3xl">
        <button
          onClick={() => setAltSekme("rasyon")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "rasyon"
              ? "bg-gradient-to-r from-lime-600 to-green-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calculator size={15} /> Rasyon Hesaplama Sihirbazı
        </button>
        <button
          onClick={() => setAltSekme("analiz")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "analiz"
              ? "bg-gradient-to-r from-lime-600 to-green-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FlaskConical size={15} /> Yem Analiz & Kalite (RFV)
        </button>
        <button
          onClick={() => setAltSekme("hasar")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "hasar"
              ? "bg-gradient-to-r from-lime-600 to-green-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <AlertTriangle size={15} /> Yem Kaynaklı Zarar Hesaplama
        </button>
        <button
          onClick={() => setAltSekme("rehber")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            altSekme === "rehber"
              ? "bg-gradient-to-r from-lime-600 to-green-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen size={15} /> Mevzuat, İlkeler & İçtihat
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: RASYON HESAPLAMA SİHİRBAZI */}
      {/* ========================================================= */}
      {altSekme === "rasyon" && (
        <div className="space-y-6">
          {/* Üst Kontrol Paneli: Hayvan & Şablon Seçimi */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="grid md:grid-cols-12 gap-5 items-end">
              {/* Hayvan Tipi Dropdown */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Target size={14} className="text-green-600" /> Hayvan Tipi & Besin İhtiyacı
                </label>
                <select
                  value={seciliHayvanId}
                  onChange={(e) => setSeciliHayvanId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {HAYVAN_BESIN_IHTIYACLARI.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hayvanTipi} ({h.canliAgirlik} kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Rasyon Şablonu Dropdown */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers size={14} className="text-lime-600" /> Hazır Rasyon Şablonu
                </label>
                <select
                  value={seciliSablonId}
                  onChange={(e) => setSeciliSablonId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  {RASYON_SABLONLARI.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.ad} ({s.hayvanTipi})
                    </option>
                  ))}
                </select>
              </div>

              {/* Şablon Yükle Butonları */}
              <div className="md:col-span-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSablonYukle(seciliSablonId)}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download size={14} /> Şablon Yükle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRasyonYemleri([]);
                    showToast("Rasyon tablosu temizlendi");
                  }}
                  title="Rasyonu Temizle"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-500 transition"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Seçili Hayvan Besin İhtiyaçları Bilgi Kartı */}
            <div className="mt-5 p-4 rounded-xl bg-lime-50/60 border border-lime-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lime-200/60">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-lime-200 text-lime-900 font-bold text-xs">
                    NRC / INRA Standartları
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{aktifHayvan.hayvanTipi}</h4>
                    <p className="text-xs text-slate-600">{aktifHayvan.aciklama}</p>
                  </div>
                </div>
                <div className="text-xs text-lime-900 font-semibold bg-white/70 px-3 py-1 rounded-full border border-lime-300">
                  Canlı Ağırlık: {aktifHayvan.canliAgirlik} kg
                </div>
              </div>

              {/* Günlük İhtiyaç Değerleri Matrisi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-3">
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Kuru Madde (KM)</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {aktifHayvan.kuruMaddeAlimi} kg
                  </p>
                  <p className="text-[9px] text-lime-700 font-medium">Tüketim Kapasitesi</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Ham Protein (HP)</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    %{aktifHayvan.hamProtein}
                  </p>
                  <p className="text-[9px] text-lime-700 font-medium">KM Bazında İdeal</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Enerji (ME)</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {aktifHayvan.metabolikEnerji} Mcal
                  </p>
                  <p className="text-[9px] text-lime-700 font-medium">Günlük Net İhtiyaç</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Min NDF</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    %{aktifHayvan.ndf}
                  </p>
                  <p className="text-[9px] text-lime-700 font-medium">Doygunluk Sınırı</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Min ADF</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    %{aktifHayvan.adf}
                  </p>
                  <p className="text-[9px] text-lime-700 font-medium">Sindirim Sınırı</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Min Kaba Yem</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    %{aktifHayvan.kabaYemOrani}
                  </p>
                  <p className="text-[9px] text-red-600 font-medium">Rumen Sağlığı</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-lime-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold">Ca / P Oranı</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    %{aktifHayvan.kalsiyum} / %{aktifHayvan.fosfor}
                  </p>
                  <p className="text-[9px] text-lime-700 font-medium">İdeal 1.5 - 2:1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orta Kısım: İnteraktif Rasyon Oluşturucu ve Canlı Hesaplama Paneli */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Sol: Rasyon Yem Listesi (7 Kolon) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Wheat className="text-green-600" size={18} /> Rasyon Formülasyonu
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Günlük rasyona eklenen yem hammaddeleri ve taze tartım miktarları (kg)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalYemEkleAcik(true)}
                  className="py-2 px-3.5 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Hammadde Ekle
                </button>
              </div>

              {/* Rasyondaki Yem Kalemleri Listesi */}
              {rasyonYemleri.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <Wheat className="mx-auto text-slate-300" size={40} />
                  <p className="text-xs text-slate-500 font-medium">
                    Rasyonda henüz yem bulunmuyor. Yukarıdan hazır şablon yükleyebilir veya hammadde ekleyebilirsiniz.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSablonYukle(seciliSablonId)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                  >
                    Varsayılan Şablonu Yükle
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {rasyonSonucu.kalemDetaylari.map((kalem, index) => (
                    <div
                      key={`${kalem.hammadde.id}-${index}`}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`p-1.5 rounded-lg text-[10px] font-bold shrink-0 ${
                              kalem.isKabaYem
                                ? "bg-emerald-100 text-emerald-800"
                                : kalem.hammadde.kategori === "proteinli"
                                ? "bg-amber-100 text-amber-800"
                                : kalem.hammadde.kategori === "mineral"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {KATEGORI_ETIKETLERI[kalem.hammadde.kategori] || kalem.hammadde.kategori}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {kalem.hammadde.ad}
                          </span>
                        </div>

                        {/* Miktar Girişi ve Çıkar Butonu */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              type="button"
                              onClick={() =>
                                handleMiktarGuncelle(index, Math.max(0.1, kalem.tazeKg - 0.5))
                              }
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <Minus size={12} />
                            </button>
                            <input
                              type="number"
                              step="0.1"
                              min="0.05"
                              value={kalem.tazeKg}
                              onChange={(e) =>
                                handleMiktarGuncelle(index, parseFloat(e.target.value) || 0)
                              }
                              className="w-16 text-center text-xs font-black text-slate-900 border-x border-slate-100 py-1 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleMiktarGuncelle(index, kalem.tazeKg + 0.5)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-slate-500">kg</span>
                          <button
                            type="button"
                            onClick={() => handleYemCikar(index)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="Yemi Çıkar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Besin Madde Katkıları Alt Satırı */}
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">KM Katkısı</span>
                          <span className="font-bold text-slate-700">{kalem.kmKg.toFixed(2)} kg</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">HP Katkısı</span>
                          <span className="font-bold text-slate-700">
                            {kalem.hpKg.toFixed(2)} kg (%{kalem.hammadde.hamProtein})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">ME Enerji</span>
                          <span className="font-bold text-slate-700">{kalem.meMcal.toFixed(2)} Mcal</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Maliyet</span>
                          <span className="font-bold text-emerald-700">{kalem.maliyet.toFixed(1)} ₺</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ: Canlı Hesaplama ve İhtiyaç Karşılaştırma Paneli (5 Kolon) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Canlı Hesap Özeti Kartı */}
              <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-lime-400 flex items-center gap-2">
                    <BarChart3 size={16} /> Rasyon Analiz Göstergeleri
                  </h4>
                  <span className="text-[11px] font-bold bg-lime-500/20 text-lime-300 px-2.5 py-0.5 rounded-full border border-lime-500/30">
                    {rasyonSonucu.kalemDetaylari.length} Hammadde
                  </span>
                </div>

                {/* 6'lı Metrik Kartları */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Kuru Madde */}
                  <div
                    className={`p-3 rounded-xl border ${
                      rasyonKarsilastirma.km.durum === "ideal"
                        ? "bg-slate-800/80 border-lime-500/40 text-lime-300"
                        : "bg-slate-800/80 border-amber-500/40 text-amber-300"
                    }`}
                  >
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Toplam Kuru Madde</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      {rasyonSonucu.toplamKmKg} <span className="text-xs font-normal">kg</span>
                    </p>
                    <p className="text-[10px] mt-1 flex items-center gap-1">
                      {rasyonKarsilastirma.km.durum === "ideal" ? (
                        <CheckCircle2 size={12} className="text-lime-400" />
                      ) : (
                        <AlertTriangle size={12} className="text-amber-400" />
                      )}
                      Hedef: {aktifHayvan.kuruMaddeAlimi} kg ({rasyonKarsilastirma.km.fark > 0 ? "+" : ""}
                      {rasyonKarsilastirma.km.fark})
                    </p>
                  </div>

                  {/* Ham Protein */}
                  <div
                    className={`p-3 rounded-xl border ${
                      rasyonKarsilastirma.hp.durum === "ideal"
                        ? "bg-slate-800/80 border-lime-500/40 text-lime-300"
                        : "bg-slate-800/80 border-red-500/40 text-red-300"
                    }`}
                  >
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Rasyon Proteini (HP)</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      %{rasyonSonucu.rasyonHpPct}
                    </p>
                    <p className="text-[10px] mt-1 flex items-center gap-1">
                      {rasyonKarsilastirma.hp.durum === "ideal" ? (
                        <CheckCircle2 size={12} className="text-lime-400" />
                      ) : (
                        <AlertTriangle size={12} className="text-red-400" />
                      )}
                      Hedef: %{aktifHayvan.hamProtein} ({rasyonKarsilastirma.hp.fark > 0 ? "+" : ""}
                      {rasyonKarsilastirma.hp.fark}%)
                    </p>
                  </div>

                  {/* Metabolik Enerji */}
                  <div
                    className={`p-3 rounded-xl border ${
                      rasyonKarsilastirma.me.durum === "ideal"
                        ? "bg-slate-800/80 border-lime-500/40 text-lime-300"
                        : "bg-slate-800/80 border-amber-500/40 text-amber-300"
                    }`}
                  >
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Toplam Enerji (ME)</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      {rasyonSonucu.toplamMeMcal} <span className="text-xs font-normal">Mcal</span>
                    </p>
                    <p className="text-[10px] mt-1 flex items-center gap-1">
                      {rasyonKarsilastirma.me.durum === "ideal" ? (
                        <CheckCircle2 size={12} className="text-lime-400" />
                      ) : (
                        <AlertTriangle size={12} className="text-amber-400" />
                      )}
                      Hedef: {aktifHayvan.metabolikEnerji} Mcal ({rasyonKarsilastirma.me.fark > 0 ? "+" : ""}
                      {rasyonKarsilastirma.me.fark})
                    </p>
                  </div>

                  {/* Kaba Yem Oranı */}
                  <div
                    className={`p-3 rounded-xl border ${
                      rasyonKarsilastirma.kabaYem.durum === "ideal"
                        ? "bg-slate-800/80 border-lime-500/40 text-lime-300"
                        : "bg-slate-800/80 border-red-500/40 text-red-300"
                    }`}
                  >
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Kaba Yem Oranı</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      %{rasyonSonucu.rasyonKabaYemPct}
                    </p>
                    <p className="text-[10px] mt-1 flex items-center gap-1">
                      {rasyonKarsilastirma.kabaYem.durum === "ideal" ? (
                        <CheckCircle2 size={12} className="text-lime-400" />
                      ) : (
                        <AlertTriangle size={12} className="text-red-400" />
                      )}
                      Min: %{aktifHayvan.kabaYemOrani}{" "}
                      {rasyonKarsilastirma.kabaYem.durum !== "ideal" && "(Asidoz Riski!)"}
                    </p>
                  </div>

                  {/* NDF ve ADF */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Lif Oranı (NDF / ADF)</p>
                    <p className="text-base font-black text-white mt-0.5">
                      %{rasyonSonucu.rasyonNdfPct} / %{rasyonSonucu.rasyonAdfPct}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      Hedef: %{aktifHayvan.ndf} NDF | %{aktifHayvan.adf} ADF
                    </p>
                  </div>

                  {/* Mineral Ca:P */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Mineral Ca : P</p>
                    <p className="text-base font-black text-white mt-0.5">
                      {rasyonSonucu.caPOrani} : 1
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      %{rasyonSonucu.rasyonCaPct} Ca | %{rasyonSonucu.rasyonPPct} P
                    </p>
                  </div>
                </div>

                {/* Günlük Maliyet Kutusu */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-emerald-300 font-bold uppercase">Günlük Rasyon Maliyeti</p>
                    <p className="text-2xl font-black text-emerald-400 mt-0.5">
                      {rasyonSonucu.toplamMaliyetTl.toLocaleString("tr-TR")} ₺
                    </p>
                    <p className="text-[10px] text-slate-400">
                      1 kg KM Maliyeti: {rasyonSonucu.kmBirimMaliyeti.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">Toplam Taze Yem</span>
                    <span className="text-lg font-black text-white">
                      {rasyonSonucu.toplamTazeKg} kg / gün
                    </span>
                  </div>
                </div>

                {/* Eylem Butonları */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleRasyonKopyala}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Copy size={14} /> Rasyonu Kopyala
                  </button>
                  <button
                    type="button"
                    onClick={handleRasyonPdfIndir}
                    className="py-2.5 px-3 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download size={14} /> PDF Olarak İndir
                  </button>
                </div>
              </div>

              {/* Bilirkişi Rasyon Uyarısı */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-green-600" /> Bilirkişi Rasyon Değerlendirmesi
                </h4>
                <div className="space-y-2 text-xs">
                  {rasyonSonucu.rasyonKabaYemPct < aktifHayvan.kabaYemOrani ? (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
                      <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Rumen Asidozu (SARA) Tehlikesi!</strong>
                        Kaba yem oranı (%{rasyonSonucu.rasyonKabaYemPct}) önerilen minimum oranın (%
                        {aktifHayvan.kabaYemOrani}) altındadır. Rumen pH'ı düşebilir ve topallık gelişebilir.
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                      <CircleCheck size={15} className="shrink-0 text-emerald-600" />
                      <span>Kaba yem lif dengesi güvenli aralıktadır (%{rasyonSonucu.rasyonKabaYemPct}).</span>
                    </div>
                  )}

                  {Math.abs(rasyonKarsilastirma.hp.fark) > 1.5 && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2">
                      <AlertTriangle size={15} className="shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Protein Sapması:</strong>
                        Rasyon protein düzeyi (%{rasyonSonucu.rasyonHpPct}) gereksinimden (%
                        {aktifHayvan.hamProtein}) %{Math.abs(rasyonKarsilastirma.hp.fark)} sapmaktadır.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* HAMMADDE EKLEME MODALI */}
      {/* ========================================================= */}
      <AnimatePresence>
        {modalYemEkleAcik && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="text-green-600" size={18} /> Yem Hammaddesi Ekle
                  </h3>
                  <p className="text-xs text-slate-500">
                    2024-2025 cari rayiçli yem hammaddeleri arasından seçim yapın
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalYemEkleAcik(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filtre ve Arama Çubuğu */}
              <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    type="text"
                    placeholder="Yem adı veya kategori ara..."
                    value={yemAramaMetni}
                    onChange={(e) => setYemAramaMetni(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {["Tümü", "kaba", "kesif", "enerjik", "proteinli", "mineral", "katki"].map(
                    (kat) => (
                      <button
                        key={kat}
                        type="button"
                        onClick={() => setSeciliKategoriFiltre(kat)}
                        className={`px-3 py-1 rounded-full font-bold transition whitespace-nowrap ${
                          seciliKategoriFiltre === kat
                            ? "bg-green-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {KATEGORI_ETIKETLERI[kat] || kat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Scrollable Yem Listesi */}
              <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
                {YEM_HAMMADDELERI.filter((yem) => {
                  const matchKat =
                    seciliKategoriFiltre === "Tümü" || yem.kategori === seciliKategoriFiltre;
                  const matchSearch =
                    yem.ad.toLowerCase().includes(yemAramaMetni.toLowerCase()) ||
                    yem.kategori.toLowerCase().includes(yemAramaMetni.toLowerCase());
                  return matchKat && matchSearch;
                }).map((yem) => (
                  <div
                    key={yem.id}
                    onClick={() => handleYemEkle(yem.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-green-400 hover:bg-green-50/40 cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-green-800">
                          {yem.ad}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                          {KATEGORI_ETIKETLERI[yem.kategori] || yem.kategori}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{yem.aciklama}</p>
                      <div className="flex gap-3 text-[10px] text-slate-600 font-medium mt-1">
                        <span>KM: %{yem.kuruMadde}</span>
                        <span>HP: %{yem.hamProtein}</span>
                        <span>ME: {yem.metabolikEnerji} Mcal</span>
                        <span>NDF: %{yem.ndf}</span>
                        <span>ADF: %{yem.adf}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-emerald-700 block">
                        {yem.fiyatKg.toFixed(2)} ₺/kg
                      </span>
                      <button
                        type="button"
                        className="mt-1 px-2.5 py-1 rounded-lg bg-green-600 group-hover:bg-green-700 text-white text-[10px] font-bold"
                      >
                        Seç
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* TAB 2: YEM ANALİZ & KALİTE KONTROL (RFV) */}
      {/* ========================================================= */}
      {altSekme === "analiz" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Sol: Laboratuvar Analiz Giriş Formu (7 Kolon) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical className="text-green-600" size={18} /> Laboratuvar Analiz Sonucu Girişi
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Laboratuvar test bulgularını girerek Nispi Yem Değerini (RFV) ve yasal uygunluğu hesaplayın
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAnalizKm(89.2);
                    setAnalizHp(18.5);
                    setAnalizAdf(30.4);
                    setAnalizNdf(41.5);
                    setAnalizAfb1(2.4);
                    setAnalizHk(8.1);
                    showToast("Form 1. Sınıf Yonca değerlerine sıfırlandı");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={13} /> Örnek Değerler
                </button>
              </div>

              {/* Temel Bilgiler */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Numune Tanımı / Adı</label>
                  <input
                    type="text"
                    value={analizYemAdi}
                    onChange={(e) => setAnalizYemAdi(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Rapor / Numune No</label>
                  <input
                    type="text"
                    value={analizRaporNo}
                    onChange={(e) => setAnalizRaporNo(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Yem Grubu</label>
                  <select
                    value={analizYemTipi}
                    onChange={(e) => setAnalizYemTipi(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
                  >
                    <option value="Kaba Yem (Yonca / Ot)">Kaba Yem (Yonca / Ot)</option>
                    <option value="Mısır Silajı">Mısır Silajı</option>
                    <option value="Fabrika Karma Yemi">Fabrika Karma Yemi</option>
                    <option value="Dane / Hammadde">Dane / Hammadde</option>
                  </select>
                </div>
              </div>

              {/* Nümerik Analiz Parametreleri Grid'i */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    Kuru Madde (KM %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={analizKm}
                    onChange={(e) => setAnalizKm(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">Rutubet: %{(100 - analizKm).toFixed(1)}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    Ham Protein (HP %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={analizHp}
                    onChange={(e) => setAnalizHp(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">Kjeldahl N x 6.25</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    NDF (% Lif)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={analizNdf}
                    onChange={(e) => setAnalizNdf(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">Doygunluk Sınırı</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    ADF (% Lif)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={analizAdf}
                    onChange={(e) => setAnalizAdf(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">RFV İçin Kritik</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    Ham Kül (HK %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={analizHk}
                    onChange={(e) => setAnalizHk(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">Toprak Bulaşıklığı</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    Metabolik Enerji
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={analizMe}
                    onChange={(e) => setAnalizMe(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">Mcal / kg KM</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block uppercase">
                    Aflatoksin B1 (ppb)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={analizAfb1}
                    onChange={(e) => setAnalizAfb1(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                  />
                  <span className="text-[9px] text-slate-400 block">Süt Limiti: 5.0 ppb</span>
                </div>

                {analizYemTipi === "Mısır Silajı" ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block uppercase">
                      Silaj pH Değeri
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={analizPh}
                      onChange={(e) => setAnalizPh(parseFloat(e.target.value) || 0)}
                      className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                    />
                    <span className="text-[9px] text-slate-400 block">İdeal: 3.8 - 4.2</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block uppercase">
                      Ham Yağ (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={analizHy}
                      onChange={(e) => setAnalizHy(parseFloat(e.target.value) || 0)}
                      className="w-full text-base font-black text-slate-900 bg-white p-1 rounded-lg border border-slate-200"
                    />
                    <span className="text-[9px] text-slate-400 block">Soxhlet Eter</span>
                  </div>
                )}
              </div>

              {/* Raporu Kopyala Butonu */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAnalizRaporuKopyala}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Copy size={14} /> Analiz Raporunu Kopyala
                </button>
              </div>
            </div>

            {/* Sağ: Bilirkişi Kalite Skoru ve RFV Göstergesi (5 Kolon) */}
            <div className="lg:col-span-5 space-y-5">
              {/* RFV Sınıf Kartı */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="text-lime-600" size={17} /> Nispi Yem Değeri (RFV)
                  </h4>
                  <span className="text-xs font-bold text-slate-400">Kalite İndeksi</span>
                </div>

                {/* Büyük RFV Skoru Rozeti */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center space-y-2">
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Hesaplanan Nispi Yem Değeri
                  </p>
                  <p className="text-5xl font-black text-lime-400 tracking-tight">
                    {kaliteSonucu.rfv}
                  </p>
                  <div className="inline-block mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border ${kaliteSonucu.rfvSinifObj.renk}`}
                    >
                      {kaliteSonucu.rfvSinifObj.sinif}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pt-2 leading-relaxed max-w-sm mx-auto">
                    {kaliteSonucu.rfvSinifObj.aciklama}
                  </p>
                </div>

                {/* Alt Metrikler */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Sindirilebilirlik (DMD)</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">%{kaliteSonucu.dmd}</p>
                    <p className="text-[9px] text-slate-500 font-medium">88.9 - (0.779 x ADF)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Tüketim İndeksi (DMI)</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">%{kaliteSonucu.dmi}</p>
                    <p className="text-[9px] text-slate-500 font-medium">120 / NDF (Canlı Ağırlık)</p>
                  </div>
                </div>
              </div>

              {/* Yasal Uygunluk & Ayıp Kontrol Kartı */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-amber-600" /> Resmi Mevzuat & Ayıp Değerlendirmesi
                </h4>

                {/* Aflatoksin Durum Bildirimi */}
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    kaliteSonucu.afb1Durum.durum === "uygun"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : kaliteSonucu.afb1Durum.durum === "sartli"
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-red-50 border-red-200 text-red-800 font-bold"
                  }`}
                >
                  {kaliteSonucu.afb1Durum.durum === "uygun" ? (
                    <CircleCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">Aflatoksin B1 ({analizAfb1} ppb):</span>
                    <span className="text-[11px] font-medium leading-relaxed">
                      {kaliteSonucu.afb1Durum.aciklama}
                    </span>
                  </div>
                </div>

                {/* Ham Kül Durumu */}
                {kaliteSonucu.hkSorun && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5 text-xs">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Toprak / Kum Bulaşıklığı Tespiti:</span>
                      <span className="text-[11px] leading-relaxed">
                        Ham kül oranı %{analizHk} seviyesindedir (azami %8.5 olmalıdır). Hasat sırasında tırmık veya balya makinesinin toprağı sıyırması sonucu bulaşma gerçekleşmiştir.
                      </span>
                    </div>
                  </div>
                )}

                {/* Nem Durumu */}
                {kaliteSonucu.nemSorun && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-xs">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Aşırı Rutubet Riski:</span>
                      <span className="text-[11px] leading-relaxed">
                        Nem oranı %{kaliteSonucu.nem} seviyesindedir. %14'ün üzerindeki kuru yemlerde kızışma, küflenme ve toksin oluşumu riski mevcuttur.
                      </span>
                    </div>
                  </div>
                )}

                {/* Silaj pH Durumu */}
                {analizYemTipi === "Mısır Silajı" && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs">
                    <span className="font-bold block text-slate-900">Silaj Fermantasyon Kalitesi:</span>
                    <span className="text-[11px] text-slate-600 mt-0.5 block">
                      {kaliteSonucu.silajDurum}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alt Tablo: Laboratuvar Analiz Parametreleri Resmi Kütüphanesi */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="text-green-600" size={18} /> Yem Laboratuvar Analiz Parametreleri & Resmi Yöntemler
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  TSE, ISO ve Bakanlık resmi talimatlarına göre yem analiz metotları ve standart değerler
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {LABORATUVAR_ANALIZ_PARAMETRELERI.length} Parametre
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">Kısaltma / Parametre</th>
                    <th className="py-2.5 px-3">Birim</th>
                    <th className="py-2.5 px-3">Analiz Yöntemi</th>
                    <th className="py-2.5 px-3">Tipik Aralık / Standart</th>
                    <th className="py-2.5 px-3 text-right">Detay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {LABORATUVAR_ANALIZ_PARAMETRELERI.map((param: LabAnaliz, idx: number) => {
                    const isExpanded = genisleyenParametreIndex === idx;
                    return (
                      <React.Fragment key={idx}>
                        <tr
                          onClick={() =>
                            setGenisleyenParametreIndex(isExpanded ? null : idx)
                          }
                          className="hover:bg-slate-50/80 cursor-pointer transition"
                        >
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-black text-[10px] mr-2">
                              {param.kisaltma}
                            </span>
                            {param.parametre}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{param.birim}</td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">{param.yontem}</td>
                          <td className="py-3 px-3 text-slate-700 font-semibold">{param.tipikAralik}</td>
                          <td className="py-3 px-3 text-right text-slate-400">
                            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-lime-50/40 border-b border-lime-100">
                            <td colSpan={5} className="py-3 px-4 text-xs space-y-2">
                              <p className="text-slate-700 leading-relaxed">
                                <strong className="font-bold text-slate-900">Bilirkişi Değerlendirmesi:</strong>{" "}
                                {param.aciklama}
                              </p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: YEM KAYNAKLI ZARAR HESAPLAMA */}
      {/* ========================================================= */}
      {altSekme === "hasar" && (
        <div className="space-y-6">
          {/* Hasar Türü Seçici Banner */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" size={18} /> Yem Kaynaklı Hasar ve İlliyet Türü
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zarar konusu hadisenin biyolojik, kimyasal veya mekanik kökenini belirleyiniz
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {aktifHasarTuru.id}
              </span>
            </div>

            <select
              value={seciliHasarId}
              onChange={(e) => setSeciliHasarId(e.target.value)}
              className="w-full p-3 text-xs md:text-sm rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {YEM_HASAR_TURLERI.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.baslik}
                </option>
              ))}
            </select>

            {/* Seçili Hasar Detay Kutusu */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">{aktifHasarTuru.aciklama}</p>

              <div className="grid md:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                    Klinik Belirtiler
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                    {aktifHasarTuru.belirtiler.slice(0, 3).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                    Gerekli Hukuki Deliller
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                    {aktifHasarTuru.gerekliDeliller.slice(0, 3).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                    Hesaplama & Mevzuat
                  </span>
                  <p className="text-[11px] text-slate-600">{aktifHasarTuru.hesaplamaYontemi}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{aktifHasarTuru.mevzuat}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hasar Parametreleri ve Canlı Hesaplama */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Sol: Girdi Parametreleri Formu (7 Kolon) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5">
              <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Calculator className="text-amber-600" size={16} /> Zarar Hesaplama Parametreleri
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Hayvan Türü */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Etkilenen Hayvan Türü</label>
                  <select
                    value={hasarHayvanTuru}
                    onChange={(e) =>
                      setHasarHayvanTuru(e.target.value as "Süt Sığırı" | "Besi Sığırı" | "Küçükbaş")
                    }
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="Süt Sığırı">Süt Sığırı (Sağmal İnek)</option>
                    <option value="Besi Sığırı">Besi Sığırı (Besi Danası)</option>
                    <option value="Küçükbaş">Küçükbaş (Koyun / Keçi)</option>
                  </select>
                </div>

                {/* Toplam Etkilenen Hayvan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Toplam Yem Yiyen Hayvan Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    value={etkilenenHayvanSayisi}
                    onChange={(e) => setEtkilenenHayvanSayisi(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* Telef Sayısı */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 text-red-600">
                    Telef Olan (Ölen) Hayvan Sayısı
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={telefSayisi}
                    onChange={(e) => setTelefSayisi(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-red-300 bg-red-50/30 font-black text-red-700"
                  />
                </div>

                {/* Hayvan Birim Piyasa Değeri */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hayvan Birim Rayici (₺)</label>
                  <input
                    type="number"
                    step="1000"
                    value={hayvanBirimDegeri}
                    onChange={(e) => setHayvanBirimDegeri(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* Günlük Verim Kaybı */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Günlük Verim Kaybı ({hasarHayvanTuru === "Besi Sığırı" ? "kg Et" : "lt Süt"})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={gunlukVerimKaybi}
                    onChange={(e) => setGunlukVerimKaybi(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* Verim Kaybı Süresi */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Verim Kaybı Süresi (Gün) - Makul Periyot
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={verimKaybiSuresi}
                    onChange={(e) => setVerimKaybiSuresi(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Yargıtay makul süresi: 30-60 gün</span>
                </div>

                {/* Ürün Birim Fiyatı */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Ürün Birim Fiyatı (₺ / {hasarHayvanTuru === "Besi Sığırı" ? "kg" : "lt"})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={urunBirimFiyati}
                    onChange={(e) => setUrunBirimFiyati(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* Tedavi Masrafları */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tedavi & Analiz Masrafları (₺)</label>
                  <input
                    type="number"
                    step="500"
                    value={tedaviGideri}
                    onChange={(e) => setTedaviGideri(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* İmha Edilen Yem Miktarı */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">İmha Edilen Bozuk Yem (Ton)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={imhaYemMiktari}
                    onChange={(e) => setImhaYemMiktari(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* Yem Birim Fiyatı */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Yem Birim Alış Fiyatı (₺ / Ton)</label>
                  <input
                    type="number"
                    step="100"
                    value={imhaYemBirimFiyati}
                    onChange={(e) => setImhaYemBirimFiyati(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                {/* Hurda / Zorunlu Kesim Mahsubu */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 text-blue-700">
                    Zorunlu Kesim Et/Deri Mahsubu (₺)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={hurdaKurtarmaBedeli}
                    onChange={(e) => setHurdaKurtarmaBedeli(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-xs rounded-xl border border-blue-300 bg-blue-50/30 font-black text-blue-900"
                  />
                  <span className="text-[10px] text-slate-400">TBK m. 55 Zarardan kâr mahsubu</span>
                </div>

                {/* Müterafik Kusur Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Müterafik Kusur İndirimi (TBK m.52)</span>
                    <span className="text-amber-600">%{muterafikKusurPct}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={muterafikKusurPct}
                    onChange={(e) => setMuterafikKusurPct(parseInt(e.target.value) || 0)}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>%0 (Kusursuz)</span>
                    <span>%25 (Orta İhmal)</span>
                    <span>%50 (Ağır İhmal)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Tazminat Dökümü ve AI Raporlama (5 Kolon) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <DollarSign size={16} /> Aktüeryal Tazminat Tablosu
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Bilirkişi Cetveli
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>Telef Hayvan Zararı ({telefSayisi} baş):</span>
                    <span className="font-bold text-white">
                      {zararHesapSonucu.telefZarari.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>Verim Kaybı ({zararHesapSonucu.sagKalanEtkilenen} baş × {verimKaybiSuresi} gün):</span>
                    <span className="font-bold text-white">
                      {zararHesapSonucu.verimKaybiTutari.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>Tedavi & Toksikoloji Masrafları:</span>
                    <span className="font-bold text-white">
                      {zararHesapSonucu.tedaviMasraflari.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>İmha Edilen Ayıplı Yem ({imhaYemMiktari} Ton):</span>
                    <span className="font-bold text-white">
                      {zararHesapSonucu.imhaYemTutari.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-t border-slate-700 text-slate-200 font-bold">
                    <span>BRÜT TOPLAM ZARAR:</span>
                    <span className="text-amber-400">
                      {zararHesapSonucu.brutToplamZarar.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>

                  {zararHesapSonucu.mahsupTutari > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-800 text-blue-300">
                      <span>Kurtarma / Et-Deri Mahsubu (TBK m.55):</span>
                      <span className="font-bold">
                        -{zararHesapSonucu.mahsupTutari.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  )}

                  {muterafikKusurPct > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-800 text-amber-300">
                      <span>Müterafik Kusur İndirimi (%{muterafikKusurPct}):</span>
                      <span className="font-bold">
                        -{zararHesapSonucu.kusurIndirimTutari.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  )}
                </div>

                {/* Net Hükme Esas Tutar Kutusu */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 text-center space-y-1">
                  <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                    HÜKME ESAS NET MADDİ TAZMİNAT
                  </p>
                  <p className="text-3xl font-black text-emerald-400 tracking-tight">
                    {zararHesapSonucu.netTazminatTutari.toLocaleString("tr-TR")} ₺
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Mahsup ve kusur tenzilatları sonrası kesin zarar
                  </p>
                </div>

                {/* Aksiyon Butonları */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAiGerekceUret}
                    disabled={aiGenerating}
                    className="py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Sparkles size={14} className={aiGenerating ? "animate-spin" : ""} />
                    {aiGenerating ? "Yazılıyor..." : "AI Gerekçe Yazıcı"}
                  </button>
                  <button
                    type="button"
                    onClick={handleZararRaporuKopyala}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Copy size={14} /> Raporu Kopyala
                  </button>
                </div>
              </div>

              {/* AI Gerekçe Yazıcı Sonuç Kutusu */}
              {aiGerekceMetni && (
                <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                    <h5 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-600" /> Mahkeme Gerekçeli Rapor Metni
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(aiGerekceMetni).then(() => {
                          showToast("Gerekçe metni panoya kopyalandı");
                        });
                      }}
                      className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
                    >
                      <Copy size={12} /> Kopyala
                    </button>
                  </div>
                  <pre className="text-[11px] text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-purple-50/40 p-3 rounded-xl border border-purple-100 max-h-60 overflow-y-auto">
                    {aiGerekceMetni}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: MEVZUAT, İLKELER & İÇTİHAT */}
      {/* ========================================================= */}
      {altSekme === "rehber" && (
        <div className="space-y-6">
          {/* Tab 4 İç Sub-Tab Seçici */}
          <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm max-w-md">
            <button
              onClick={() => setRehberAltSekme("ilkeler")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rehberAltSekme === "ilkeler"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield size={14} /> Rehber İlkeler
            </button>
            <button
              onClick={() => setRehberAltSekme("kontrol")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rehberAltSekme === "kontrol"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clipboard size={14} /> Denetim Kontrol Listesi
            </button>
            <button
              onClick={() => setRehberAltSekme("ictihat")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rehberAltSekme === "ictihat"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Scale size={14} /> Yargıtay İçtihatları
            </button>
          </div>

          {/* 4.1 REHBER İLKELER AKORDİYON LİSTESİ */}
          {rehberAltSekme === "ilkeler" && (
            <div className="space-y-4">
              {YEM_BESLEME_REHBER_ILKELERI.map((ilke, index) => {
                const isExpanded = genisleyenIlkeId === ilke.id;
                return (
                  <div
                    key={ilke.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setGenisleyenIlkeId(isExpanded ? "" : ilke.id)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold text-[10px]">
                            İlke #{index + 1}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {ilke.kaynak}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{ilke.baslik}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{ilke.ozet}</p>
                      </div>
                      <div className="p-1 rounded-lg text-slate-400 mt-1 shrink-0">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-100 space-y-4 text-xs">
                        <div className="pt-4">
                          <strong className="block text-slate-900 font-bold mb-1">
                            Ayrıntılı İlke Açıklaması:
                          </strong>
                          <p className="text-slate-700 leading-relaxed">{ilke.detay}</p>
                        </div>

                        {/* Kontrol Listesi Maddeleri */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                            Bilirkişi Denetim Adımları:
                          </span>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {ilke.kontrolListesi.map((m, i) => (
                              <div key={i} className="flex items-start gap-2 text-slate-700">
                                <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Doğru vs Yanlış Karşılaştırması */}
                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                            <span className="font-bold text-xs flex items-center gap-1.5 text-red-800">
                              <CircleX size={14} /> Hatalı / Bozma Sebebi Uygulama:
                            </span>
                            <p className="text-[11px] leading-relaxed">{ilke.ornekIhlal}</p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                            <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                              <CircleCheck size={14} /> Yerleşik Yargıtay & Zooteknik Doğrusu:
                            </span>
                            <p className="text-[11px] leading-relaxed">{ilke.dogruUygulama}</p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const text = `İLKE #${index + 1}: ${ilke.baslik}\nKAYNAK: ${ilke.kaynak}\nÖZET: ${ilke.ozet}\nDETAY: ${ilke.detay}\nDOĞRU UYGULAMA: ${ilke.dogruUygulama}`;
                              navigator.clipboard.writeText(text).then(() => {
                                showToast("İlke metni panoya kopyalandı");
                              });
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
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

          {/* 4.2 İNTERAKTİF DENETİM KONTROL LİSTESİ */}
          {rehberAltSekme === "kontrol" && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              {/* İlerleme Çubuğu */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-2">
                    <FileCheck size={15} className="text-green-600" /> Bilirkişi Rapor Hazırlık ve Denetim İlerlemesi
                  </span>
                  <span className="text-green-700">
                    %{kontrolYuzdesi} ({tamamlananKontrolSayisi} / {tumKontrolMaddeleri.length})
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-lime-500 to-green-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${kontrolYuzdesi}%` }}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={tumKontrolleriSec}
                    className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
                  >
                    Tümünü Onayla
                  </button>
                  <button
                    type="button"
                    onClick={kontrolSifirla}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition"
                  >
                    Sıfırla
                  </button>
                </div>
              </div>

              {/* Aşamalar ve Maddeler */}
              <div className="space-y-6">
                {YEM_KONTROL_LISTESI.map((kat) => (
                  <div key={kat.id} className="space-y-3">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-900 font-black text-[10px] uppercase">
                        {kat.asama}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{kat.baslik}</h4>
                      <p className="text-xs text-slate-500">{kat.aciklama}</p>
                    </div>

                    <div className="grid gap-2.5">
                      {kat.maddeler.map((madde) => {
                        const isChecked = !!kontrolCheckboxlar[madde.id];
                        return (
                          <div
                            key={madde.id}
                            onClick={() => toggleKontrolCheckbox(madde.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                              isChecked
                                ? "bg-green-50/60 border-green-300 shadow-2xs"
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                                isChecked
                                  ? "bg-green-600 border-green-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isChecked && <Check size={13} />}
                            </div>
                            <div className="space-y-0.5 flex-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-semibold ${
                                    isChecked ? "text-slate-900 line-through text-slate-500" : "text-slate-800"
                                  }`}
                                >
                                  {madde.metin}
                                </span>
                                {madde.onem === "kritik" && (
                                  <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold text-[9px]">
                                    Kritik
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500">{madde.aciklama}</p>
                              <span className="text-[10px] text-slate-400 font-medium">
                                Dayanak: {madde.mevzuat}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Denetim Özeti Kopyala */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    let summary = `YEM VE HAYVAN BESLEME BİLİRKİŞİ DENETİM KONTROL LİSTESİ SONUCU\n`;
                    summary += `İlerleme Oranı: %${kontrolYuzdesi} (${tamamlananKontrolSayisi}/${tumKontrolMaddeleri.length} Adım Onaylandı)\n\n`;
                    tumKontrolMaddeleri.forEach((m, idx) => {
                      summary += `[${kontrolCheckboxlar[m.id] ? "X" : " "}] ${idx + 1}. ${m.metin} (${m.mevzuat})\n`;
                    });
                    navigator.clipboard.writeText(summary).then(() => {
                      showToast("Denetim özeti panoya kopyalandı");
                    });
                  }}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <Copy size={14} /> Denetim Özetini Kopyala
                </button>
              </div>
            </div>
          )}

          {/* 4.3 YARGITAY EMSAL İÇTİHATLARI */}
          {rehberAltSekme === "ictihat" && (
            <div className="space-y-4">
              {/* Arama ve Etiket Filtreleme */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Daire, esas no, karar no, konu veya anahtar kelime ara..."
                    value={ictihatArama}
                    onChange={(e) => setIctihatArama(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                  />
                </div>

                {/* Anahtar Kelime Filtreleri */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {[
                    "Tümü",
                    "Ayıplı Yem",
                    "Şahit Numune",
                    "Süt Verim Kaybı",
                    "Yabancı Madde",
                    "Silaj",
                    "Gizli Ayıp",
                    "Müterafik Kusur",
                  ].map((etiket) => (
                    <button
                      key={etiket}
                      type="button"
                      onClick={() => setSeciliIctihatEtiket(etiket)}
                      className={`px-3 py-1 rounded-full font-bold transition whitespace-nowrap ${
                        seciliIctihatEtiket === etiket
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {etiket}
                    </button>
                  ))}
                </div>
              </div>

              {/* İçtihat Kartları */}
              <div className="space-y-4">
                {filtrelenmisIctihatlar.map((karar: YemIctihat, index: number) => (
                  <div
                    key={`${karar.esas}-${index}`}
                    className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 space-y-3.5 hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[10px]">
                          {karar.daire}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          E: {karar.esas} | K: {karar.karar}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{karar.tarih}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{karar.konu}</h4>

                    {/* Karar Özeti */}
                    <p className="text-xs text-slate-600 leading-relaxed">{karar.ozet}</p>

                    {/* Anahtar Kelimeler ve Kopyalama */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {karar.anahtar.map((k: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]"
                          >
                            #{k}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const metin = `${karar.daire}\nEsas: ${karar.esas} | Karar: ${karar.karar} | Tarih: ${karar.tarih}\nKonu: ${karar.konu}\n\nÖZET:\n${karar.ozet}`;
                          navigator.clipboard.writeText(metin).then(() => {
                            showToast("İçtihat metni panoya kopyalandı");
                          });
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-end sm:self-auto"
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

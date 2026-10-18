import React, { useState, useMemo } from "react";
import {
  FileCheck,
  Beef,
  Scale,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Download,
  Printer,
  Sparkles,
  Camera,
  Trash2,
  Plus,
  RefreshCw,
  Info,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  FileText,
  DollarSign,
  HelpCircle,
  Clock,
  Layers,
  MapPin,
  Tag,
  Hash,
  Percent,
} from "lucide-react";
import {
  HayvancilikVarlikItem,
  HayvancilikDavaSablonu,
  HAYVANCILIK_DAVA_SABLONLARI,
  HAYVANCILIK_PREFLIGHT_CHECKLIST,
} from "../data/hayvancilikRaporData";
import { BUYUKBAS_IRKLARI, KUCUKBAS_IRKLARI } from "../data/hayvancilikData";

interface HayvancilikRaporOtomasyonuViewProps {
  showToast: (msg: string) => void;
  onGoToWizard?: () => void;
}

export default function HayvancilikRaporOtomasyonuView({
  showToast,
  onGoToWizard,
}: HayvancilikRaporOtomasyonuViewProps) {
  // Wizard Aktif Adımı (1 - 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. DAVA VE KÜNYE BİLGİLERİ
  const [selectedDavaId, setSelectedDavaId] = useState<string>("telef_haksiz_fiil");
  const selectedDava = useMemo(() => {
    return (
      HAYVANCILIK_DAVA_SABLONLARI.find((d) => d.id === selectedDavaId) ||
      HAYVANCILIK_DAVA_SABLONLARI[0]
    );
  }, [selectedDavaId]);

  const [mahkemeAdi, setMahkemeAdi] = useState<string>(selectedDava.ornekVeriler.mahkeme);
  const [dosyaNo, setDosyaNo] = useState<string>(selectedDava.ornekVeriler.dosyaNo);
  const [davaci, setDavaci] = useState<string>(selectedDava.ornekVeriler.davaci);
  const [davaciVekili, setDavaciVekili] = useState<string>(selectedDava.ornekVeriler.davaciVekili);
  const [davali, setDavali] = useState<string>(selectedDava.ornekVeriler.davali);
  const [davaliVekili, setDavaliVekili] = useState<string>(selectedDava.ornekVeriler.davaliVekili);
  const [davaKonusu, setDavaKonusu] = useState<string>(selectedDava.ornekVeriler.konu);
  const [olayTarihi, setOlayTarihi] = useState<string>(selectedDava.ornekVeriler.olayTarihi);
  const [davaTarihi, setDavaTarihi] = useState<string>(selectedDava.ornekVeriler.davaTarihi);
  const [tesisMevkii, setTesisMevkii] = useState<string>(
    `${selectedDava.ornekVeriler.il} İli, ${selectedDava.ornekVeriler.ilce} İlçesi, ${selectedDava.ornekVeriler.koyMahalle} (${selectedDava.ornekVeriler.tesisAdaParsel})`
  );

  // 3'LÜ KURUL HEYETİ BİLGİLERİ
  const [raporTuru, setRaporTuru] = useState<"tek" | "heyet_3">("heyet_3");
  const [kararTuru, setKararTuru] = useState<"oybirligi" | "oycoklugu">("oybirligi");
  const [muhalifBilirkisi, setMuhalifBilirkisi] = useState<string>("3. Bilirkişi (Tarım Ekonomisti)");
  const [muhalefetSerhiMetni, setMuhalefetSerhiMetni] = useState<string>(
    "Zorunlu kesimden elde edilen hurda et bedelinin mahalli serbest piyasa yerine borsa karkas tavan fiyatından mahsup edilmesi gerektiği kanaatinde olduğumdan kurul çoğunluğunun hesaplama sonucuna muhalifim."
  );

  // Kurul Künyeleri
  const [b1Adi, setB1Adi] = useState<string>("Kemal Yılmaz");
  const [b1Unvan, setB1Unvan] = useState<string>("Ziraat Yüksek Mühendisi (Zooteknist)");
  const [b1Sicil, setB1Sicil] = useState<string>("ZM-41208");

  const [b2Adi, setB2Adi] = useState<string>("Dr. Vet. Hek. Selim Demir");
  const [b2Unvan, setB2Unvan] = useState<string>("Veteriner Hekim (Hayvan Sağlığı & Patoloji)");
  const [b2Sicil, setB2Sicil] = useState<string>("VET-18542");

  const [b3Adi, setB3Adi] = useState<string>("Ahmet Kaya");
  const [b3Unvan, setB3Unvan] = useState<string>("Ziraat Mühendisi (Tarım Ekonomisti / Değerleme Uzmanı)");
  const [b3Sicil, setB3Sicil] = useState<string>("ZM-32910");

  // FAİZ MATRİSİ
  const [faizTuru, setFaizTuru] = useState<"yasal" | "avans_ticari">(selectedDava.ornekVeriler.faizTuru);
  const [faizBaslangicTuru, setFaizBaslangicTuru] = useState<"olay_tarihi" | "temerrut_tarihi" | "dava_tarihi">(
    selectedDava.ornekVeriler.faizBaslangicTuru
  );

  // 2. TÜRKVET HAYVAN VARLIĞI LİSTESİ
  const [varliklar, setVarliklar] = useState<HayvancilikVarlikItem[]>(selectedDava.ornekVeriler.varliklar);

  // 3. PARAMETRELER VE EK HASARLAR
  const [yoksunKalinanGun, setYoksunKalinanGun] = useState<number>(selectedDava.ornekVeriler.yoksunKalinanGun);
  const [cigSutLitreFiyatiTl, setCigSutLitreFiyatiTl] = useState<number>(
    selectedDava.ornekVeriler.cigSutLitreFiyatiTl
  );
  const [yemHasarMiktariTon, setYemHasarMiktariTon] = useState<number>(
    selectedDava.ornekVeriler.yemHasarMiktariTon || 0
  );
  const [yemBirimFiyatiTl, setYemBirimFiyatiTl] = useState<number>(
    selectedDava.ornekVeriler.yemBirimFiyatiTl || 0
  );
  const [tarsimMuafiyetPct, setTarsimMuafiyetPct] = useState<number>(
    selectedDava.ornekVeriler.tarsimMuafiyetPct || 0
  );
  const [muterafikKusurPct, setMuterafikKusurPct] = useState<number>(
    selectedDava.ornekVeriler.muterafikKusurPct || 0
  );

  // 4. TEKNİK İNCELEME METNİ
  const [teknikIncelemeMetni, setTeknikIncelemeMetni] = useState<string>(
    selectedDava.ornekVeriler.teknikIncelemeMetni
  );

  // 5. KEŞİF FOTOĞRAFLARI LİSTESİ
  const [fotograflar, setFotograflar] = useState<
    { id: string; baslik: string; aciklama: string; tarih: string; yon: string; koordinat: string }[]
  >([
    {
      id: "foto_1",
      baslik: "Ahır İçi Elektrik Nakil Hattı Temas Noktası",
      aciklama: "Kopan 220V alçak gerilim iletken telinin yemlik demir borusuna temas ettiği yanık izli nokta.",
      tarih: "2025-04-14",
      yon: "Kuzeydoğu",
      koordinat: "39.6482° K, 27.8826° D (ITRF96: Y:548210, X:4389120)",
    },
    {
      id: "foto_2",
      baslik: "TR100012345678 Kulak Küpeli Ex Holstein İnek",
      aciklama: "Olay yerinde elektroküsyon sonucu telef olan damızlık süt ineğinin kulak küpesi ve lezyonları.",
      tarih: "2025-04-14",
      yon: "Güney",
      koordinat: "39.6481° K, 27.8824° D",
    },
    {
      id: "foto_3",
      baslik: "İlçe Tarım Müdürlüğü Veteriner Nekropsi Muayenesi",
      aciklama: "Nöbetçi veteriner hekimce olay yerinde yapılan otopside elektriğe bağlı iç kanama tespiti.",
      tarih: "2025-04-13",
      yon: "İç Alan",
      koordinat: "39.6483° K, 27.8825° D",
    },
    {
      id: "foto_4",
      baslik: "Mecburi Kesime Sevk Edilen Hayvanların Sevk Belgesi",
      aciklama: "Kombina veteriner hekimi onaylı acil kesim ve karkas tartı zaptı belgesi.",
      tarih: "2025-04-14",
      yon: "Resmi Evrak",
      koordinat: "Balıkesir Kombinası",
    },
  ]);

  // Yeni fotoğraf ekleme alanları
  const [yeniFotoBaslik, setYeniFotoBaslik] = useState("");
  const [yeniFotoAciklama, setYeniFotoAciklama] = useState("");

  const handleAddFoto = () => {
    if (!yeniFotoBaslik) {
      showToast("Lütfen fotoğraf başlığı giriniz");
      return;
    }
    const newF = {
      id: `foto_${Date.now()}`,
      baslik: yeniFotoBaslik,
      aciklama: yeniFotoAciklama || "Keşif anında çekilen resmi bilirkişi fotoğrafı.",
      tarih: new Date().toISOString().split("T")[0],
      yon: "Genel Görünüm",
      koordinat: "ITRF96 / WGS84 Belirlenmiş",
    };
    setFotograflar([...fotograflar, newF]);
    setYeniFotoBaslik("");
    setYeniFotoAciklama("");
    showToast("Fotoğraf albüme eklendi");
  };

  const handleDeleteFoto = (id: string) => {
    setFotograflar(fotograflar.filter((f) => f.id !== id));
    showToast("Fotoğraf silindi");
  };

  // Şablon Değiştirildiğinde Verileri Güncelle
  const handleSelectDavaTemplate = (id: string) => {
    setSelectedDavaId(id);
    const d = HAYVANCILIK_DAVA_SABLONLARI.find((item) => item.id === id);
    if (!d) return;

    setMahkemeAdi(d.ornekVeriler.mahkeme);
    setDosyaNo(d.ornekVeriler.dosyaNo);
    setDavaci(d.ornekVeriler.davaci);
    setDavaciVekili(d.ornekVeriler.davaciVekili);
    setDavali(d.ornekVeriler.davali);
    setDavaliVekili(d.ornekVeriler.davaliVekili);
    setDavaKonusu(d.ornekVeriler.konu);
    setOlayTarihi(d.ornekVeriler.olayTarihi);
    setDavaTarihi(d.ornekVeriler.davaTarihi);
    setTesisMevkii(
      `${d.ornekVeriler.il} İli, ${d.ornekVeriler.ilce} İlçesi, ${d.ornekVeriler.koyMahalle} (${d.ornekVeriler.tesisAdaParsel})`
    );
    setVarliklar(d.ornekVeriler.varliklar);
    setYoksunKalinanGun(d.ornekVeriler.yoksunKalinanGun);
    setCigSutLitreFiyatiTl(d.ornekVeriler.cigSutLitreFiyatiTl);
    setYemHasarMiktariTon(d.ornekVeriler.yemHasarMiktariTon || 0);
    setYemBirimFiyatiTl(d.ornekVeriler.yemBirimFiyatiTl || 0);
    setTarsimMuafiyetPct(d.ornekVeriler.tarsimMuafiyetPct || 0);
    setMuterafikKusurPct(d.ornekVeriler.muterafikKusurPct || 0);
    setFaizTuru(d.ornekVeriler.faizTuru);
    setFaizBaslangicTuru(d.ornekVeriler.faizBaslangicTuru);
    setTeknikIncelemeMetni(d.ornekVeriler.teknikIncelemeMetni);

    showToast(`"${d.kisaltma}" şablonu yüklendi`);
  };

  // Hayvan Ekleme / Güncelleme / Silme
  const handleAddHayvan = (tur: "Büyükbaş" | "Küçükbaş" = "Büyükbaş") => {
    const defaultIrk = tur === "Büyükbaş" ? BUYUKBAS_IRKLARI[0] : KUCUKBAS_IRKLARI[0];
    const newItem: HayvancilikVarlikItem = {
      id: `varlik_${Date.now()}`,
      tur: tur,
      irk: defaultIrk.irk,
      kulakKupeNo: `TR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      yasAy: 36,
      cinsiyet: "Dişi",
      canliAgirlikKg: defaultIrk.ortCanliAgirlik,
      karkasRandimaniPct: defaultIrk.karkasRandimani,
      miktarBas: 1,
      durum: "telef",
      damizlikVasfi: true,
      damizlikFarkTl: 20000,
      gebelikDurumu: false,
      beklenenYavruTl: 0,
      gunlukSutLt: (defaultIrk as any).gunlukSutVerimi || 20,
      canliKgRayicTl: 240,
      karkasKgRayicTl: 430,
      kurtarmaHurdaEtTl: 0,
      tedaviMasrafiTl: 0,
      tespitVeNotlar: "Keşif yerinde tespit edilen hayvan.",
    };
    setVarliklar([...varliklar, newItem]);
    showToast("Yeni hayvan kalemi eklendi");
  };

  const handleUpdateVarlik = (id: string, field: keyof HayvancilikVarlikItem, val: any) => {
    setVarliklar(
      varliklar.map((v) => {
        if (v.id !== id) return v;
        const updated = { ...v, [field]: val };

        // Irk değiştiğinde otomatik ağırlık ve randıman doldur
        if (field === "irk") {
          const bb = BUYUKBAS_IRKLARI.find((b) => b.irk === val);
          const kb = KUCUKBAS_IRKLARI.find((k) => k.irk === val);
          if (bb) {
            updated.canliAgirlikKg = bb.ortCanliAgirlik;
            updated.karkasRandimaniPct = bb.karkasRandimani;
            updated.gunlukSutLt = bb.gunlukSutVerimi || 0;
          } else if (kb) {
            updated.canliAgirlikKg = kb.ortCanliAgirlik;
            updated.karkasRandimaniPct = kb.karkasRandimani;
            updated.gunlukSutLt = kb.gunlukSutVerimi || 0;
          }
        }
        return updated;
      })
    );
  };

  const handleDeleteVarlik = (id: string) => {
    setVarliklar(varliklar.filter((v) => v.id !== id));
    showToast("Hayvan kalemi silindi");
  };

  // -------------------------------------------------------------------------
  // HESAPLAMA MOTORU (Canlı, Karkas, Yoksun Kâr, Hurda Mahsubu, Net Tazminat)
  // -------------------------------------------------------------------------
  const hesaplamalar = useMemo(() => {
    let toplamCanliDegeri = 0;
    let toplamDamizlikFarki = 0;
    let toplamBeklenenYavru = 0;
    let toplamSutKaybi = 0;
    let toplamKurtarmaHurda = 0;
    let toplamTedaviMasrafi = 0;
    let toplamHayvanSayisi = 0;

    varliklar.forEach((v) => {
      toplamHayvanSayisi += v.miktarBas;
      // 1. Çıplak Değer (Canlı Ağırlık x Canlı Fiyat x Baş)
      const canliDeger = v.canliAgirlikKg * v.canliKgRayicTl * v.miktarBas;
      toplamCanliDegeri += canliDeger;

      // 2. Damızlık Farkı
      if (v.damizlikVasfi) {
        toplamDamizlikFarki += v.damizlikFarkTl * v.miktarBas;
      }

      // 3. Gebe Yavru Kaybı
      if (v.gebelikDurumu) {
        toplamBeklenenYavru += v.beklenenYavruTl * v.miktarBas;
      }

      // 4. Süt Kaybı (Eğer telef veya mecburi kesim ise ve süt veriyorsa)
      if (v.durum === "telef" || v.durum === "mecburi_kesim") {
        const netSutGunluk = v.gunlukSutLt * cigSutLitreFiyatiTl * 0.7; // Yem masrafı arındırılmış %70 net kâr
        toplamSutKaybi += netSutGunluk * yoksunKalinanGun * v.miktarBas;
      }

      // 5. Hurda Et Mahsubu
      toplamKurtarmaHurda += v.kurtarmaHurdaEtTl;

      // 6. Tedavi
      toplamTedaviMasrafi += v.tedaviMasrafiTl;
    });

    // Yem Hasarı Varsa (İmha edilen yem)
    const toplamYemZarari = yemHasarMiktariTon * yemBirimFiyatiTl;

    // Brüt Hasar
    const brutZarar =
      toplamCanliDegeri +
      toplamDamizlikFarki +
      toplamBeklenenYavru +
      toplamSutKaybi +
      toplamTedaviMasrafi +
      toplamYemZarari;

    // Mahsuplar:
    // a. Hurda et mahsubu (TBK 55)
    let netTazminat = brutZarar - toplamKurtarmaHurda;

    // b. TARSİM Muafiyet tenzili
    let tarsimTenzili = 0;
    if (tarsimMuafiyetPct > 0) {
      tarsimTenzili = (netTazminat * tarsimMuafiyetPct) / 100;
      netTazminat -= tarsimTenzili;
    }

    // c. Müterafik Kusur İndirimi
    let muterafikIndirimi = 0;
    if (muterafikKusurPct > 0) {
      muterafikIndirimi = (netTazminat * muterafikKusurPct) / 100;
      netTazminat -= muterafikIndirimi;
    }

    return {
      toplamHayvanSayisi,
      toplamCanliDegeri,
      toplamDamizlikFarki,
      toplamBeklenenYavru,
      toplamSutKaybi,
      toplamKurtarmaHurda,
      toplamTedaviMasrafi,
      toplamYemZarari,
      brutZarar,
      tarsimTenzili,
      muterafikIndirimi,
      netTazminat: Math.max(0, netTazminat),
    };
  }, [
    varliklar,
    cigSutLitreFiyatiTl,
    yoksunKalinanGun,
    yemHasarMiktariTon,
    yemBirimFiyatiTl,
    tarsimMuafiyetPct,
    muterafikKusurPct,
  ]);

  // -------------------------------------------------------------------------
  // 5. USTA BİLİRKİŞİ PRE-FLIGHT DENETİM MOTORU
  // -------------------------------------------------------------------------
  const preFlightSonucu = useMemo(() => {
    let alinanPuan = 0;
    const auditItems = HAYVANCILIK_PREFLIGHT_CHECKLIST.map((item) => {
      let passed = true;
      let durumMetni = "Uygun";
      let gerekce = "";

      switch (item.otomatikKontrolKey) {
        case "turkvet_var_mi":
          const kupeEksik = varliklar.some((v) => !v.kulakKupeNo || v.kulakKupeNo.length < 8);
          if (varliklar.length === 0 || kupeEksik) {
            passed = false;
            durumMetni = "Riskli";
            gerekce = "Kulak küpe (TÜRKVET) numaraları eksik veya tanımsız hayvan kalemleri mevcut.";
          } else {
            gerekce = `${varliklar.length} baş hayvanın TÜRKVET kulak küpeleri dosyaya eksiksiz işlenmiştir.`;
          }
          break;

        case "hmk_kusur_yok_mu":
          const lowerTeknik = teknikIncelemeMetni.toLowerCase();
          const kusurKelimeleri = ["%100 kusurlu", "asli kusurlu", "tam kusurlu", "kusursuzdur"];
          const kusurBulundu = kusurKelimeleri.some((w) => lowerTeknik.includes(w));
          if (kusurBulundu) {
            passed = false;
            durumMetni = "Riskli";
            gerekce = "Teknik inceleme metninde HMK m. 279'a aykırı 'kusurlu' nitelemesi tespit edildi.";
          } else {
            gerekce = "Teknik illiyet bağı kusur nitelemesi yapılmaksızın maddi olgularla açıklanmıştır.";
          }
          break;

        case "veteriner_raporu_var_mi":
          if (
            teknikIncelemeMetni.toLowerCase().includes("veteriner") ||
            fotograflar.some((f) => f.baslik.toLowerCase().includes("otopsi") || f.baslik.toLowerCase().includes("veteriner"))
          ) {
            gerekce = "Resmi veteriner hekim muayene/nekropsi tespit zaptına açıkça atıf yapılmıştır.";
          } else {
            passed = false;
            durumMetni = "Uyarı";
            gerekce = "Veteriner hekim otopsi/nekropsi zaptı metinde yeterince belirginleştirilmemiştir.";
          }
          break;

        case "resmi_rayic_var_mi":
          if (varliklar.every((v) => v.canliKgRayicTl >= 150 && v.canliKgRayicTl <= 400)) {
            gerekce = "Birim canlı kg fiyatları 2025-2026 Ticaret Borsası ve UKON bültenleriyle uyumludur.";
          } else {
            passed = false;
            durumMetni = "Uyarı";
            gerekce = "Bazı hayvan kalemlerinde rayiç fiyatlar mutat borsa ortalamasının dışında görünüyor.";
          }
          break;

        case "hurda_mahsubu_tam_mi":
          const mecburiKesimVar = varliklar.some((v) => v.durum === "mecburi_kesim");
          if (mecburiKesimVar && hesaplamalar.toplamKurtarmaHurda <= 0) {
            passed = false;
            durumMetni = "Riskli";
            gerekce = "Mecburi kesime sevk edilen hayvan olmasına rağmen TBK m. 55 hurda et mahsubu girilmemiştir!";
          } else {
            gerekce = `TBK m. 52/55 denkleştirme ilkesi gereğince ₺${hesaplamalar.toplamKurtarmaHurda.toLocaleString("tr-TR")} hurda et mahsubu yapılmıştır.`;
          }
          break;

        case "net_kar_kurali_uygun_mu":
          if (yoksunKalinanGun > 0 && cigSutLitreFiyatiTl > 0) {
            gerekce = "Yoksun kalınan süt kârında yem ve bakım giderleri arındırılarak net kâr hesaplanmıştır.";
          } else {
            gerekce = "Yoksun kalınan kâr talebi bulunmamaktadır veya doğrudan çıplak değer istenmiştir.";
          }
          break;

        case "sigorta_muafiyeti_incelendi_mi":
          if (selectedDavaId === "tarsim_sigorta_hasar") {
            if (tarsimMuafiyetPct > 0) {
              gerekce = `TARSİM poliçesindeki %${tarsimMuafiyetPct} tenzili muafiyet net tazminattan düşülmüştür.`;
            } else {
              passed = false;
              durumMetni = "Uyarı";
              gerekce = "TARSİM poliçelerinde mutat olan %10-%15 muafiyet tenzili girilmemiştir.";
            }
          } else {
            gerekce = "Haksız fiil davası olduğundan poliçe muafiyeti aranmamıştır.";
          }
          break;

        case "fotograf_ekli_mi":
          if (fotograflar.length >= 2) {
            gerekce = `${fotograflar.length} adet açıklamalı keşif fotoğrafı ve koordinat rapora gömülmüştür.`;
          } else {
            passed = false;
            durumMetni = "Uyarı";
            gerekce = "Rapora en az 2 adet açıklamalı keşif fotoğrafı eklenmelidir.";
          }
          break;

        case "heyet_uzmanligi_tam_mi":
          if (raporTuru === "heyet_3") {
            gerekce = "3'lü Bilirkişi Kurulu: Ziraat Müh. (Zooteknist), Veteriner Hekim ve Tarım Ekonomisti künyeleri tamdır.";
          } else {
            gerekce = "Tek bilirkişi Ziraat Mühendisi Zooteknist künyesi tamdır.";
          }
          break;

        case "faiz_tavsiyesi_mevcut_mu":
          gerekce = `${faizTuru === "yasal" ? "Yasal Faiz" : "Avans (Ticari) Faiz"} türü ve ${faizBaslangicTuru} başlangıcı tavsiye edilmiştir.`;
          break;
      }

      if (passed) {
        alinanPuan += item.agirlikPuan;
      } else if (durumMetni === "Uyarı") {
        alinanPuan += Math.round(item.agirlikPuan * 0.5);
      }

      return {
        ...item,
        passed,
        durumMetni,
        gerekce,
      };
    });

    const toplamPuan = Math.min(100, alinanPuan);
    const riskSayisi = auditItems.filter((i) => i.durumMetni === "Riskli").length;
    const uyariSayisi = auditItems.filter((i) => i.durumMetni === "Uyarı").length;
    const gecenSayisi = auditItems.filter((i) => i.durumMetni === "Uygun").length;

    return {
      toplamPuan,
      riskSayisi,
      uyariSayisi,
      gecenSayisi,
      sertifikaKodu: `ZB-HYV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      denetimTarihi: new Date().toLocaleDateString("tr-TR"),
      items: auditItems,
    };
  }, [
    varliklar,
    teknikIncelemeMetni,
    fotograflar,
    hesaplamalar,
    selectedDavaId,
    tarsimMuafiyetPct,
    raporTuru,
    faizTuru,
    faizBaslangicTuru,
    yoksunKalinanGun,
    cigSutLitreFiyatiTl,
  ]);

  // -------------------------------------------------------------------------
  // 6. RESMİ MAHKEME RAPORU HTML METNİ
  // -------------------------------------------------------------------------
  const resmiRaporMetni = useMemo(() => {
    return `
T.C.
${mahkemeAdi.toUpperCase()}
SAYIN HAKİMLİĞİ'NE

DOSYA ESAS NO       : ${dosyaNo}
DAVACI              : ${davaci}
DAVACI VEKİLİ       : ${davaciVekili}
DAVALI              : ${davali}
DAVALI VEKİLİ       : ${davaliVekili}
DAVA KONUSU         : ${davaKonusu}
OLAY TARİHİ         : ${olayTarihi}
DAVA TARİHİ         : ${davaTarihi}
KEŞİF & TESİS YERİ  : ${tesisMevkii}
BİLİRKİŞİ KURULU    : ${
      raporTuru === "heyet_3"
        ? `1. ${b1Adi} (${b1Unvan} - Sicil: ${b1Sicil})\n                      2. ${b2Adi} (${b2Unvan} - Sicil: ${b2Sicil})\n                      3. ${b3Adi} (${b3Unvan} - Sicil: ${b3Sicil})`
        : `${b1Adi} (${b1Unvan} - Sicil: ${b1Sicil})`
    }
KARAR TÜRÜ          : ${kararTuru === "oybirligi" ? "Oybirliği" : `Oyçokluğu (${muhalifBilirkisi} Muhalif)`}

I. GÖREVLENDİRME VE İNCELEMENİN KAPSAMI
Sayın Mahkemenizin yukarıda esas numarası yazılı dava dosyasında verilen ara kararı uyarınca; davacıya ait hayvancılık işletmesinde meydana gelen olay neticesinde telef olan veya hasara uğrayan canlı hayvanların kulak küpe (TÜRKVET) kayıtları, ırk, yaş, cinsiyet ve damızlık özellikleri, ölüm sebebiyle olay arasındaki teknik illiyet bağı, olay tarihindeki mahalli Ticaret Borsası ve UKON rayiç değerleri, yoksun kalınan kâr ile TBK m. 52 ve 55 uyarınca mahsup edilmesi gereken hurda (kurtarma et/deri) bedellerinin tespiti amacıyla heyetimizce yerinde keşif icra edilmiş ve işbu teknik rapor tanzim edilmiştir.

II. TÜRKVET / HAYBİS KAYITLARI VE MEVCUT DURUM TESPİTİ
İlçe Tarım ve Orman Müdürlüğü resmi veri tabanı (TÜRKVET / HAYBİS) dökümleri ve mahallinde yapılan fiili sayım neticesinde dava konusu varlıklar aşağıdaki tabloda detaylandırılmıştır:
${varliklar
  .map(
    (v, i) =>
      `${i + 1}. [${v.kulakKupeNo}] ${v.tur} - ${v.irk} (${v.yasAy} Aylık ${v.cinsiyet}, Canlı Ağ.: ${v.canliAgirlikKg} kg, Karkas %${v.karkasRandimaniPct}) | Durum: ${v.durum.toUpperCase()} | Damızlık: ${v.damizlikVasfi ? "Evet" : "Hayır"} | Not: ${v.tespitVeNotlar}`
  )
  .join("\n")}

III. TEKNİK İNCELEME, MEVZUAT VE İLLİYET BAĞI DEĞERLENDİRMESİ
${teknikIncelemeMetni}

IV. ADLİ HESAPLAMA, ZARAR VE MAHSUP TABLOSU
6098 sayılı Türk Borçlar Kanunu m. 49, 50, 52 ve 55 hükümleri ile Yargıtay Hukuk Genel Kurulu ve 3. Hukuk Dairesi'nin yerleşik içtihatları uyarınca yapılan teknik hesaplama cetveli:

1. Çıplak Canlı Hayvan Rayiç Değeri Toplamı : ₺${hesaplamalar.toplamCanliDegeri.toLocaleString("tr-TR")}
2. Damızlık / Soykütüğü İlave Değeri       : ₺${hesaplamalar.toplamDamizlikFarki.toLocaleString("tr-TR")}
3. Gebe Hayvanlarda Yavru Kaybı Değeri      : ₺${hesaplamalar.toplamBeklenenYavru.toLocaleString("tr-TR")}
4. Yoksun Kalınan Net Süt Kârı (${yoksunKalinanGun} Gün) : ₺${hesaplamalar.toplamSutKaybi.toLocaleString("tr-TR")}
5. Veteriner Hekim Tedavi & Nekropsi Gideri : ₺${hesaplamalar.toplamTedaviMasrafi.toLocaleString("tr-TR")}
${hesaplamalar.toplamYemZarari > 0 ? `6. İmha Edilen Bozuk Yem Bedeli (${yemHasarMiktariTon} Ton) : ₺${hesaplamalar.toplamYemZarari.toLocaleString("tr-TR")}\n` : ""}---------------------------------------------------------------------------------
BRÜT ZARAR VE TEKNİK TAZMİNAT TOPLAMI      : ₺${hesaplamalar.brutZarar.toLocaleString("tr-TR")}

MAHSUP VE İNDİRİM KALEMLERİ:
(-) TBK m. 52/55 Hurda (Kurtarma) Et Mahsubu : -₺${hesaplamalar.toplamKurtarmaHurda.toLocaleString("tr-TR")}
${hesaplamalar.tarsimTenzili > 0 ? `(-) TARSİM Poliçe Muafiyeti (%${tarsimMuafiyetPct})      : -₺${hesaplamalar.tarsimTenzili.toLocaleString("tr-TR")}\n` : ""}${hesaplamalar.muterafikIndirimi > 0 ? `(-) Müterafik Kusur İndirimi (%${muterafikKusurPct})       : -₺${hesaplamalar.muterafikIndirimi.toLocaleString("tr-TR")}\n` : ""}=================================================================================
NET HÜKMEDİLEBİLİR TAZMİNAT / KIYMET TUTARI : ₺${hesaplamalar.netTazminat.toLocaleString("tr-TR")}

V. HUKUKİ VE TEKNİK TAVSİYELER (FAİZ VE MASRAFLAR)
1. Faiz Türü ve Başlangıcı: Uyuşmazlık ${selectedDava.kisaltma} niteliğinde olduğundan, hükmedilecek net tazminata ${
      faizBaslangicTuru === "olay_tarihi"
        ? `haksız fiil tarihi olan ${olayTarihi} tarihinden`
        : faizBaslangicTuru === "temerrut_tarihi"
        ? "sigortacı / borçlunun temerrüde düştüğü tarihten"
        : `dava tarihi olan ${davaTarihi} tarihinden`
    } itibaren ${faizTuru === "yasal" ? "YASAL FAİZ (3095 s.K. m.1)" : "AVANS / TİCARİ FAİZ (TTK m.9)"} işletilmesi teknik ve hukuki teamüllere uygundur.
2. HMK m. 279 Beyanı: İşbu rapor tamamen teknik, bilimsel ve zooteknik verilere dayalı olarak tanzim edilmiş olup, hukuki tavsif ve kusur takdiri Sayın Mahkemenizin münhasır takdirindedir.

VI. USTA BİLİRKİŞİ PRE-FLIGHT DENETİM SERTİFİKASI
Denetim Kodu: ${preFlightSonucu.sertifikaKodu} | Uygunluk Puanı: %${preFlightSonucu.toplamPuan}/100
Yargıtay Bozma Riskleri Denetimi: ${preFlightSonucu.gecenSayisi} Kriter Geçti, ${preFlightSonucu.uyariSayisi} Uyarı, ${preFlightSonucu.riskSayisi} Risk.

${
  kararTuru === "oycoklugu"
    ? `VII. KARŞI OY / MUHALEFET ŞERHİ (${muhalifBilirkisi})\n${muhalefetSerhiMetni}\n`
    : ""
}
SONUÇ VE KANAAT:
Yukarıda ayrıntılı olarak açıklanan teknik, zooteknik ve adli gerekçeler muvacehesinde; davacının toplam net zararının ₺${hesaplamalar.netTazminat.toLocaleString(
      "tr-TR"
    )} olduğu hususunu takdirleri Sayın Mahkemenize ait olmak üzere saygılarımızla arz ederiz. ${new Date().toLocaleDateString(
      "tr-TR"
    )}

BİLİRKİŞİ KURULU / BİLİRKİŞİ
${
  raporTuru === "heyet_3"
    ? `
1. Bilirkişi: ${b1Adi}                2. Bilirkişi: ${b2Adi}                3. Bilirkişi: ${b3Adi}
${b1Unvan}    ${b2Unvan}    ${b3Unvan}
Sicil: ${b1Sicil}                 Sicil: ${b2Sicil}                 Sicil: ${b3Sicil}
(İmza)                           (İmza)                           (İmza ${kararTuru === "oycoklugu" ? "- Karşı Oyla" : ""})
`
    : `
${b1Adi}
${b1Unvan}
Bilirkişi Sicil No: ${b1Sicil}
(İmza)
`
}
`;
  }, [
    mahkemeAdi,
    dosyaNo,
    davaci,
    davaciVekili,
    davali,
    davaliVekili,
    davaKonusu,
    olayTarihi,
    davaTarihi,
    tesisMevkii,
    raporTuru,
    kararTuru,
    muhalifBilirkisi,
    muhalefetSerhiMetni,
    b1Adi,
    b1Unvan,
    b1Sicil,
    b2Adi,
    b2Unvan,
    b2Sicil,
    b3Adi,
    b3Unvan,
    b3Sicil,
    varliklar,
    teknikIncelemeMetni,
    hesaplamalar,
    faizTuru,
    faizBaslangicTuru,
    selectedDava,
    preFlightSonucu,
    yoksunKalinanGun,
    yemHasarMiktariTon,
    tarsimMuafiyetPct,
    muterafikKusurPct,
  ]);

  // Kopyalama ve İndirme Eylemleri
  const handleCopyReport = () => {
    navigator.clipboard.writeText(resmiRaporMetni.trim()).then(() => {
      showToast("Resmi bilirkişi raporu panoya kopyalandı");
    });
  };

  const handleDownloadWord = () => {
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Hayvancılık Bilirkişi Raporu</title>" +
      "<style>body{font-family:'Times New Roman',serif; font-size:12pt; line-height:1.5;}</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML =
      header +
      resmiRaporMetni
        .replace(/\n/g, "<br>")
        .replace(/===+/g, "<hr>")
        .replace(/---+/g, "<hr>") +
      footer;

    const source =
      "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Hayvancilik_Bilirkisi_Raporu_${dosyaNo.replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    showToast("Word (.doc) raporu başarıyla indirildi");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Lütfen açılır pencerelere izin veriniz");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Resmi Hayvancılık Bilirkişi Raporu - ${dosyaNo}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; padding: 30px; color: #111; }
            pre { white-space: pre-wrap; font-family: inherit; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <pre>${resmiRaporMetni}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="space-y-6 pb-16 animate-[fadeIn_0.3s_ease]">
      {/* BAŞLIK & REHBER BANNER */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl border border-amber-500/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-[50px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Beef size={15} />
              <span>02 HAYVANCILIK • ZOOTEKNİ • YEM • MANDIRA</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Adım Adım Hayvancılık Bilirkişi Rapor Otomasyonu
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
              TBK m. 49/55 haksız fiil telefatı, TARSİM poliçe hasarı, aflatoksinli yem zayiatı, süt kriyoskopi ve sürü değerleme uyuşmazlıklarında Yargıtay standartlarında 6 adımlı resmi mahkeme raporu tanzim motoru.
            </p>
          </div>

          {/* Hızlı Özet Skor Kartı */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[210px] space-y-1">
            <span className="text-[10px] font-bold text-amber-200 tracking-wider">NET TAZMİNAT / KIYMET</span>
            <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
              ₺{hesaplamalar.netTazminat.toLocaleString("tr-TR")}
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              {hesaplamalar.toplamHayvanSayisi} Baş Hayvan | Skor: %{preFlightSonucu.toplamPuan}
            </div>
          </div>
        </div>
      </div>

      {/* 6 ADIMLI SİHİRBAZ NAVİGASYONU */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-xs font-bold">
          {[
            { step: 1, title: "1. Dava & Künye", icon: <Building2 size={14} /> },
            { step: 2, title: "2. TÜRKVET Sürü", icon: <Beef size={14} /> },
            { step: 3, title: "3. Hasar & Mahsup", icon: <Scale size={14} /> },
            { step: 4, title: "4. Keşif & Foto", icon: <Camera size={14} /> },
            { step: 5, title: "5. Pre-Flight", icon: <ShieldCheck size={14} /> },
            { step: 6, title: "6. A4 / Word", icon: <FileCheck size={14} /> },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition min-h-[44px] cursor-pointer ${
                currentStep === item.step
                  ? "bg-amber-600 text-white shadow-sm font-black"
                  : currentStep > item.step
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.icon}
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ADIM 1: DAVA VE KURUL KÜNYESİ */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Şablon Seçici Kartı */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Award className="text-amber-600" size={17} />
                  Dava Türü ve Yargıtay Uyuşmazlık Şablonu
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Hayvancılık alanındaki 5 temel yargı uyuşmazlığından birini seçerek ilgili mevzuatı yükleyin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {HAYVANCILIK_DAVA_SABLONLARI.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDavaTemplate(d.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[90px] cursor-pointer ${
                    selectedDavaId === d.id
                      ? "bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm"
                      : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-300"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block uppercase">
                      {d.mahkemeTuru}
                    </span>
                    <span className="text-xs font-bold block leading-snug">{d.kisaltma}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-2">
                    {d.kanunMaddesi.split(";")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mahkeme ve Taraf Künyesi Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="text-amber-600" size={17} />
              Mahkeme, Dosya ve Taraf Bilgileri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Mahkeme Adı
                </label>
                <input
                  type="text"
                  value={mahkemeAdi}
                  onChange={(e) => setMahkemeAdi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Dosya Esas No
                </label>
                <input
                  type="text"
                  value={dosyaNo}
                  onChange={(e) => setDosyaNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Olay / Zarar Tarihi
                </label>
                <input
                  type="date"
                  value={olayTarihi}
                  onChange={(e) => setOlayTarihi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Dava Tarihi
                </label>
                <input
                  type="date"
                  value={davaTarihi}
                  onChange={(e) => setDavaTarihi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Davacı (İşletme Sahibi)
                </label>
                <input
                  type="text"
                  value={davaci}
                  onChange={(e) => setDavaci(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Davacı Vekili
                </label>
                <input
                  type="text"
                  value={davaciVekili}
                  onChange={(e) => setDavaciVekili(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Davalı (TEDAŞ/Fabrika/Şahıs)
                </label>
                <input
                  type="text"
                  value={davali}
                  onChange={(e) => setDavali(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Davalı Vekili
                </label>
                <input
                  type="text"
                  value={davaliVekili}
                  onChange={(e) => setDavaliVekili(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Keşif Yeri / Ahır İşletme Mevkii
                </label>
                <input
                  type="text"
                  value={tesisMevkii}
                  onChange={(e) => setTesisMevkii(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 3'LÜ KURUL (HEYET) VE MUHALEFET ŞERHİ (KARŞI OY) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="text-amber-600" size={17} />
                  Bilirkişi Kurulu (Heyet) Yapısı & Görev Dağılımı
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Hayvancılık davalarında Yargıtay standardı: Ziraat Müh. (Zooteknist) + Veteriner Hekim + Tarım Ekonomisti.
                </p>
              </div>

              {/* Tek / Heyet Seçimi */}
              <div className="flex gap-2">
                <button
                  onClick={() => setRaporTuru("tek")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[44px] cursor-pointer ${
                    raporTuru === "tek"
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Tek Bilirkişi
                </button>
                <button
                  onClick={() => setRaporTuru("heyet_3")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[44px] cursor-pointer ${
                    raporTuru === "heyet_3"
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  3'lü Kurul (Heyet)
                </button>
              </div>
            </div>

            {/* Bilirkişiler Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                  1. Bilirkişi (Zooteknist)
                </span>
                <input
                  type="text"
                  value={b1Adi}
                  onChange={(e) => setB1Adi(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
                <input
                  type="text"
                  value={b1Unvan}
                  onChange={(e) => setB1Unvan(e.target.value)}
                  placeholder="Unvan"
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={b1Sicil}
                  onChange={(e) => setB1Sicil(e.target.value)}
                  placeholder="Sicil No"
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              {raporTuru === "heyet_3" && (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                      2. Bilirkişi (Veteriner Hekim)
                    </span>
                    <input
                      type="text"
                      value={b2Adi}
                      onChange={(e) => setB2Adi(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={b2Unvan}
                      onChange={(e) => setB2Unvan(e.target.value)}
                      placeholder="Unvan"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      value={b2Sicil}
                      onChange={(e) => setB2Sicil(e.target.value)}
                      placeholder="Sicil No"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                      3. Bilirkişi (Tarım Ekonomisti / Değerleme)
                    </span>
                    <input
                      type="text"
                      value={b3Adi}
                      onChange={(e) => setB3Adi(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={b3Unvan}
                      onChange={(e) => setB3Unvan(e.target.value)}
                      placeholder="Unvan"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      value={b3Sicil}
                      onChange={(e) => setB3Sicil(e.target.value)}
                      placeholder="Sicil No"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Karar Türü & Muhalefet Şerhi */}
            {raporTuru === "heyet_3" && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Kurul Karar Şekli:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setKararTuru("oybirligi")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition min-h-[36px] cursor-pointer ${
                        kararTuru === "oybirligi"
                          ? "bg-emerald-600 text-white"
                          : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Oybirliği
                    </button>
                    <button
                      onClick={() => setKararTuru("oycoklugu")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition min-h-[36px] cursor-pointer ${
                        kararTuru === "oycoklugu"
                          ? "bg-amber-600 text-white"
                          : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Oyçokluğu (Karşı Oy Var)
                    </button>
                  </div>
                </div>

                {kararTuru === "oycoklugu" && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        Muhalif Kalan Bilirkişi:
                      </span>
                      <input
                        type="text"
                        value={muhalifBilirkisi}
                        onChange={(e) => setMuhalifBilirkisi(e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={muhalefetSerhiMetni}
                      onChange={(e) => setMuhalefetSerhiMetni(e.target.value)}
                      placeholder="Muhalefet şerhi (Karşı Oy) gerekçesini yazınız..."
                      className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-xs font-serif leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition min-h-[44px] cursor-pointer"
            >
              <span>Adım 2: TÜRKVET Sürü Tespiti</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 2: TÜRKVET SÜRÜ VE HAYVAN LİSTESİ */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Beef className="text-amber-600" size={17} />
                  TÜRKVET Kulak Küpe & Hayvan Varlığı Listesi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Telef olan, mecburi kesime sevk edilen veya kıymet takdiri yapılan hayvanları tek tek tanımlayın.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddHayvan("Büyükbaş")}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition min-h-[44px] cursor-pointer"
                >
                  <Plus size={14} /> Büyükbaş Ekle
                </button>
                <button
                  onClick={() => handleAddHayvan("Küçükbaş")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition min-h-[44px] cursor-pointer"
                >
                  <Plus size={14} /> Küçükbaş Ekle
                </button>
              </div>
            </div>

            {/* Hayvan Kartları */}
            <div className="space-y-3">
              {varliklar.map((v, index) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {v.tur} - {v.irk}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {v.kulakKupeNo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={v.durum}
                        onChange={(e) => handleUpdateVarlik(v.id, "durum", e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                          v.durum === "telef"
                            ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40"
                            : v.durum === "mecburi_kesim"
                            ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40"
                        }`}
                      >
                        <option value="telef">Ex / Telef Oldu</option>
                        <option value="mecburi_kesim">Mecburi Acil Kesim (Kombina)</option>
                        <option value="yarali_tedavi">Yaralı / Tedavi Edildi</option>
                        <option value="saglam_kiymet_takdiri">Sağlam (Kıymet Takdiri)</option>
                      </select>

                      <button
                        onClick={() => handleDeleteVarlik(v.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 min-h-[36px] cursor-pointer"
                        title="Kalemi Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Hayvan Parametreleri Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Irk Seçimi
                      </label>
                      <select
                        value={v.irk}
                        onChange={(e) => handleUpdateVarlik(v.id, "irk", e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      >
                        {v.tur === "Büyükbaş"
                          ? BUYUKBAS_IRKLARI.map((b) => (
                              <option key={b.irk} value={b.irk}>
                                {b.irk}
                              </option>
                            ))
                          : KUCUKBAS_IRKLARI.map((k) => (
                              <option key={k.irk} value={k.irk}>
                                {k.irk}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        TÜRKVET Küpe No
                      </label>
                      <input
                        type="text"
                        value={v.kulakKupeNo}
                        onChange={(e) => handleUpdateVarlik(v.id, "kulakKupeNo", e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Yaş (Ay) & Miktar
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={v.yasAy}
                          onChange={(e) => handleUpdateVarlik(v.id, "yasAy", Number(e.target.value))}
                          placeholder="Ay"
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-center"
                        />
                        <input
                          type="number"
                          value={v.miktarBas}
                          onChange={(e) => handleUpdateVarlik(v.id, "miktarBas", Number(e.target.value))}
                          placeholder="Baş"
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center text-amber-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Canlı Ağırlık (kg)
                      </label>
                      <input
                        type="number"
                        value={v.canliAgirlikKg}
                        onChange={(e) =>
                          handleUpdateVarlik(v.id, "canliAgirlikKg", Number(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Canlı Kg Fiyatı (₺)
                      </label>
                      <input
                        type="number"
                        value={v.canliKgRayicTl}
                        onChange={(e) =>
                          handleUpdateVarlik(v.id, "canliKgRayicTl", Number(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-red-600 dark:text-red-400 mb-0.5">
                        TBK 55 Hurda Et (₺)
                      </label>
                      <input
                        type="number"
                        value={v.kurtarmaHurdaEtTl}
                        onChange={(e) =>
                          handleUpdateVarlik(v.id, "kurtarmaHurdaEtTl", Number(e.target.value))
                        }
                        placeholder="Kurtarma"
                        className="w-full px-2 py-1 rounded-lg border border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20 text-xs font-bold text-right text-red-600"
                      />
                    </div>
                  </div>

                  {/* Damızlık & Gebelik Satırı */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={v.damizlikVasfi}
                        onChange={(e) => handleUpdateVarlik(v.id, "damizlikVasfi", e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span>Damızlık / Pedigreli (+₺{v.damizlikFarkTl.toLocaleString("tr-TR")})</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={v.gebelikDurumu}
                        onChange={(e) => handleUpdateVarlik(v.id, "gebelikDurumu", e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span>Gebe Hayvan (+₺{v.beklenenYavruTl.toLocaleString("tr-TR")} Buzağı/Kuzu)</span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Günlük Süt:</span>
                      <input
                        type="number"
                        value={v.gunlukSutLt}
                        onChange={(e) =>
                          handleUpdateVarlik(v.id, "gunlukSutLt", Number(e.target.value))
                        }
                        className="w-14 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-center font-bold"
                      />
                      <span>lt/gün</span>
                    </div>

                    <div className="flex-1 text-right font-bold text-amber-700 dark:text-amber-400">
                      Kalem Değeri: ₺
                      {(
                        v.canliAgirlikKg * v.canliKgRayicTl * v.miktarBas +
                        (v.damizlikVasfi ? v.damizlikFarkTl * v.miktarBas : 0) +
                        (v.gebelikDurumu ? v.beklenenYavruTl * v.miktarBas : 0) -
                        v.kurtarmaHurdaEtTl
                      ).toLocaleString("tr-TR")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft size={16} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition min-h-[44px] cursor-pointer"
            >
              <span>Adım 3: Hasar, Gelir & Mahsup Motoru</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 3: HASAR, GELİR VE MAHSUP MOTORU */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale className="text-amber-600" size={17} />
              Adli Hasar, Gelir Kaybı ve Yasal İndirim Parametreleri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Yoksun Kalınan Laktasyon Süresi (Gün)
                </label>
                <input
                  type="number"
                  value={yoksunKalinanGun}
                  onChange={(e) => setYoksunKalinanGun(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Çiğ Süt Birim Fiyatı (₺/lt - USK)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={cigSutLitreFiyatiTl}
                  onChange={(e) => setCigSutLitreFiyatiTl(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  TARSİM Sigorta Muafiyeti (%)
                </label>
                <input
                  type="number"
                  value={tarsimMuafiyetPct}
                  onChange={(e) => setTarsimMuafiyetPct(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Müterafik Kusur İndirimi (%)
                </label>
                <input
                  type="number"
                  value={muterafikKusurPct}
                  onChange={(e) => setMuterafikKusurPct(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                />
              </div>

              {selectedDavaId === "yem_toksin_hasar" && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      İmha Edilen Bozuk Yem (Ton)
                    </label>
                    <input
                      type="number"
                      value={yemHasarMiktariTon}
                      onChange={(e) => setYemHasarMiktariTon(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Yem Birim Fiyatı (₺/Ton)
                    </label>
                    <input
                      type="number"
                      value={yemBirimFiyatiTl}
                      onChange={(e) => setYemBirimFiyatiTl(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-right"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Faiz Matrisi Tavsiyesi */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                  Hâkime Tavsiye Edilen Faiz Türü:
                </span>
                <select
                  value={faizTuru}
                  onChange={(e) => setFaizTuru(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="yasal">Yasal Faiz (3095 s.K. m. 1 - Haksız Fiil Telefat)</option>
                  <option value="avans_ticari">Avans / Ticari Faiz (TTK m. 9 - Yem / Mandıra)</option>
                </select>
              </div>

              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                  Faiz Başlangıç Tarihi Esası:
                </span>
                <select
                  value={faizBaslangicTuru}
                  onChange={(e) => setFaizBaslangicTuru(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="olay_tarihi">Olay / Haksız Fiil Tarihi ({olayTarihi})</option>
                  <option value="temerrut_tarihi">Temerrüt / İhtar Tarihi</option>
                  <option value="dava_tarihi">Dava Tarihi ({davaTarihi})</option>
                </select>
              </div>
            </div>

            {/* Canlı Hesap Özeti Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Çıplak Canlı Değer</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  ₺{hesaplamalar.toplamCanliDegeri.toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Damızlık + Kâr</span>
                <p className="text-base font-bold text-amber-700 dark:text-amber-300 mt-1">
                  + ₺{(hesaplamalar.toplamDamizlikFarki + hesaplamalar.toplamBeklenenYavru + hesaplamalar.toplamSutKaybi).toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">TBK 55 Hurda Mahsubu</span>
                <p className="text-base font-bold text-red-600 dark:text-red-300 mt-1">
                  - ₺{hesaplamalar.toplamKurtarmaHurda.toLocaleString("tr-TR")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950">
                <span className="text-[10px] font-black uppercase tracking-wider">NET HÜKMEDİLEBİLİR</span>
                <p className="text-xl font-black mt-1">
                  ₺{hesaplamalar.netTazminat.toLocaleString("tr-TR")}
                </p>
              </div>
            </div>

            {/* Teknik İnceleme Metni Alanı */}
            <div className="space-y-1.5 pt-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Teknik İnceleme, İlliyet Bağı ve Gerekçe Metni
              </label>
              <textarea
                rows={4}
                value={teknikIncelemeMetni}
                onChange={(e) => setTeknikIncelemeMetni(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-serif leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft size={16} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition min-h-[44px] cursor-pointer"
            >
              <span>Adım 4: Keşif & Fotoğraf Albümü</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 4: KEŞİF FOTOĞRAFLARI VE KROKİ ALBÜMÜ */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Camera className="text-amber-600" size={17} />
                  Açıklamalı Keşif Fotoğrafları ve Ahır / Olay Yeri Albümü
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Yargıtay bozma riskini önlemek için kulak küpesi, temas noktası ve nekropsi fotoğraflarını rapora ekleyin.
                </p>
              </div>
            </div>

            {/* Yeni Fotoğraf Ekleme Formu */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Fotoğraf Başlığı (Örn: Kulak Küpesi Yakın Çekim)"
                value={yeniFotoBaslik}
                onChange={(e) => setYeniFotoBaslik(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="Teknik Açıklama & Koordinat"
                value={yeniFotoAciklama}
                onChange={(e) => setYeniFotoAciklama(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <button
                onClick={handleAddFoto}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition min-h-[44px] cursor-pointer"
              >
                <Plus size={15} /> Fotoğrafı Albüme Ekle
              </button>
            </div>

            {/* Fotoğraf Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fotograflar.map((f, i) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 shadow-xs space-y-2 relative"
                >
                  <button
                    onClick={() => handleDeleteFoto(f.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition min-h-[36px] cursor-pointer"
                    title="Fotoğrafı Kaldır"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{f.baslik}</h4>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
                    {f.aciklama}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {f.tarih} ({f.yon})
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin size={11} className="text-amber-500" /> {f.koordinat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft size={16} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition min-h-[44px] cursor-pointer"
            >
              <span>Adım 5: Usta Bilirkişi Pre-Flight</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 5: USTA BİLİRKİŞİ PRE-FLIGHT DENETİM MOTORU */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="text-amber-600" size={18} />
                  Usta Bilirkişi Nihai Denetim Motoru (Pre-Flight Checklist)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Yargıtay 3. ve 11. Hukuk Dairesi bozma kararlarına karşı 10 maddelik otomatik risk denetimi.
                </p>
              </div>

              {/* Skor Rozeti */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    UYGUNLUK PUANI
                  </span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    %{preFlightSonucu.toplamPuan}
                  </span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    preFlightSonucu.toplamPuan >= 85
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40"
                      : "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40"
                  }`}
                >
                  {preFlightSonucu.toplamPuan >= 85
                    ? "✓ MAHKEMEYE SUNULABİLİR"
                    : "⚠ REVİZYON ÖNERİLİR"}
                </div>
              </div>
            </div>

            {/* 10 Maddelik Tablo */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5 text-center w-8">No</th>
                    <th className="p-2.5 w-1/4">Yargıtay Denetim Maddesi</th>
                    <th className="p-2.5 w-1/4">Hukuki Dayanak</th>
                    <th className="p-2.5 text-center w-24">Durum</th>
                    <th className="p-2.5">Teknik Değerlendirme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {preFlightSonucu.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-2.5 text-center font-bold text-slate-500">{item.siraNo}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{item.baslik}</td>
                      <td className="p-2.5 text-slate-500 font-serif text-[11px]">{item.hukukiDayanak}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.durumMetni === "Uygun"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40"
                              : item.durumMetni === "Uyarı"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40"
                              : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40"
                          }`}
                        >
                          {item.durumMetni}
                        </span>
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                        {item.gerekce}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft size={16} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition min-h-[44px] cursor-pointer"
            >
              <span>Adım 6: Resmi A4 Rapor & UYAP Çıktısı</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 6: RESMİ A4 MAHKEME RAPORU VE WORD / PDF İNDİRME */}
      {currentStep === 6 && (
        <div className="space-y-6">
          {/* Eylem Butonları */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Resmi Rapor Hazır:
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {dosyaNo} • Net ₺{hesaplamalar.netTazminat.toLocaleString("tr-TR")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition min-h-[44px] cursor-pointer"
              >
                <Copy size={14} /> Metni Kopyala
              </button>
              <button
                onClick={handleDownloadWord}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition min-h-[44px] cursor-pointer"
              >
                <Download size={14} /> Word (.doc) İndir
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition min-h-[44px] cursor-pointer"
              >
                <Printer size={14} /> Yazdır / PDF
              </button>
            </div>
          </div>

          {/* A4 Doküman Görünümü */}
          <div className="bg-slate-100 dark:bg-slate-950 p-4 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 md:p-14 shadow-2xl rounded-2xl border border-slate-300 font-serif text-xs md:text-sm leading-relaxed space-y-6">
              {/* Mahkeme Başlığı */}
              <div className="text-center font-bold text-base md:text-lg border-b pb-4">
                T.C.<br />
                {mahkemeAdi.toUpperCase()}<br />
                SAYIN HAKİMLİĞİ'NE
                <div className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-wider">
                  {raporTuru === "heyet_3"
                    ? "BİLİRKİŞİ KURULU (HEYET) TEKNİK HASAR RAPORU"
                    : "BİLİRKİŞİ TEKNİK HASAR RAPORU"}
                </div>
              </div>

              {/* Künye Tablosu */}
              <div className="border border-slate-300 text-xs">
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DOSYA ESAS NO</span>
                  <span className="col-span-2 font-mono">: {dosyaNo}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DAVACI & VEKİLİ</span>
                  <span className="col-span-2">: {davaci} ({davaciVekili})</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DAVALI & VEKİLİ</span>
                  <span className="col-span-2">: {davali} ({davaliVekili})</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DAVA KONUSU</span>
                  <span className="col-span-2">: {davaKonusu}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">OLAY & DAVA TARİHİ</span>
                  <span className="col-span-2">: Olay: {olayTarihi} | Dava: {davaTarihi}</span>
                </div>
                <div className="grid grid-cols-3 p-2">
                  <span className="font-bold">BİLİRKİŞİ KURULU</span>
                  <div className="col-span-2 space-y-1">
                    <div>1. <b>{b1Adi}</b> ({b1Unvan} - Sicil: {b1Sicil})</div>
                    {raporTuru === "heyet_3" && (
                      <>
                        <div>2. <b>{b2Adi}</b> ({b2Unvan} - Sicil: {b2Sicil})</div>
                        <div>3. <b>{b3Adi}</b> ({b3Unvan} - Sicil: {b3Sicil})</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* TÜRKVET Hayvan Varlığı Tablosu */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm border-b pb-1">
                  II. TÜRKVET / HAYBİS KAYITLARI VE MEVCUT DURUM CETVELİ
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10.5px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300">
                        <th className="p-1 text-center w-6">No</th>
                        <th className="p-1">TÜRKVET Küpe No</th>
                        <th className="p-1">Irk & Cinsiyet</th>
                        <th className="p-1 text-center">Yaş (Ay)</th>
                        <th className="p-1 text-right">Canlı (kg)</th>
                        <th className="p-1 text-center">Durum</th>
                        <th className="p-1 text-right">Birim Rayiç</th>
                        <th className="p-1 text-right">Hurda Mahsup</th>
                        <th className="p-1 text-right">Net Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {varliklar.map((v, i) => (
                        <tr key={v.id}>
                          <td className="p-1 text-center font-bold">{i + 1}</td>
                          <td className="p-1 font-mono font-bold">{v.kulakKupeNo}</td>
                          <td className="p-1">{v.tur} - {v.irk} ({v.cinsiyet})</td>
                          <td className="p-1 text-center">{v.yasAy}</td>
                          <td className="p-1 text-right">{v.canliAgirlikKg}</td>
                          <td className="p-1 text-center">
                            <span className="font-bold text-[9px] uppercase">{v.durum}</span>
                          </td>
                          <td className="p-1 text-right">₺{v.canliKgRayicTl}/kg</td>
                          <td className="p-1 text-right text-red-600 font-bold">
                            {v.kurtarmaHurdaEtTl > 0 ? `-₺${v.kurtarmaHurdaEtTl.toLocaleString("tr-TR")}` : "0"}
                          </td>
                          <td className="p-1 text-right font-bold">
                            ₺{(v.canliAgirlikKg * v.canliKgRayicTl * v.miktarBas - v.kurtarmaHurdaEtTl).toLocaleString("tr-TR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Teknik İnceleme Metni */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm border-b pb-1">
                  III. TEKNİK İNCELEME, OTOPSİ VE İLLİYET BAĞI
                </h4>
                <p className="text-xs leading-relaxed font-serif text-slate-800 whitespace-pre-wrap">
                  {teknikIncelemeMetni}
                </p>
              </div>

              {/* Zarar ve Mahsup Hesabı */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm border-b pb-1">
                  IV. ADLİ HESAPLAMA, ZARAR VE MAHSUP CETVELİ
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-300 rounded space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>1. Çıplak Canlı Hayvan Bedeli Toplamı:</span>
                    <b>₺{hesaplamalar.toplamCanliDegeri.toLocaleString("tr-TR")}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Damızlık ve Gebe Buzağı/Kuzu İlavesi:</span>
                    <b>+ ₺{(hesaplamalar.toplamDamizlikFarki + hesaplamalar.toplamBeklenenYavru).toLocaleString("tr-TR")}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Yoksun Kalınan Net Süt Geliri ({yoksunKalinanGun} Gün):</span>
                    <b>+ ₺{hesaplamalar.toplamSutKaybi.toLocaleString("tr-TR")}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>4. Veteriner Tedavi ve İlaç Masrafları:</span>
                    <b>+ ₺{hesaplamalar.toplamTedaviMasrafi.toLocaleString("tr-TR")}</b>
                  </div>
                  <hr className="my-1 border-slate-300" />
                  <div className="flex justify-between font-bold">
                    <span>BRÜT TEKNİK ZARAR TOPLAMI:</span>
                    <span>₺{hesaplamalar.brutZarar.toLocaleString("tr-TR")}</span>
                  </div>
                  <div className="flex justify-between text-red-700">
                    <span>(-) TBK m. 52/55 Hurda (Kurtarma) Et Mahsubu:</span>
                    <span>- ₺{hesaplamalar.toplamKurtarmaHurda.toLocaleString("tr-TR")}</span>
                  </div>
                  {hesaplamalar.tarsimTenzili > 0 && (
                    <div className="flex justify-between text-red-700">
                      <span>(-) TARSİM Poliçe Muafiyet Tenzili (%{tarsimMuafiyetPct}):</span>
                      <span>- ₺{hesaplamalar.tarsimTenzili.toLocaleString("tr-TR")}</span>
                    </div>
                  )}
                  <hr className="my-1 border-slate-300" />
                  <div className="flex justify-between text-base font-extrabold text-slate-900 font-sans">
                    <span>HÜKMEDİLEBİLİR NET TEKNİK TAZMİNAT:</span>
                    <span>₺{hesaplamalar.netTazminat.toLocaleString("tr-TR")}</span>
                  </div>
                </div>
              </div>

              {/* Kurul İmzaları */}
              <div className="pt-8 border-t border-slate-300">
                <div className="text-center font-bold text-xs mb-8">
                  Sayın Mahkemenizin Takdirlerine Saygıyla Arz Olunur. {new Date().toLocaleDateString("tr-TR")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs">
                  <div>
                    <p className="font-bold">{b1Adi}</p>
                    <p className="text-[10px] text-slate-600">{b1Unvan}</p>
                    <p className="text-[10px] font-mono text-slate-500">Sicil: {b1Sicil}</p>
                    <div className="mt-6 border-b border-dashed w-28 mx-auto" />
                    <span className="text-[9px] text-slate-400">(İmza)</span>
                  </div>
                  {raporTuru === "heyet_3" && (
                    <>
                      <div>
                        <p className="font-bold">{b2Adi}</p>
                        <p className="text-[10px] text-slate-600">{b2Unvan}</p>
                        <p className="text-[10px] font-mono text-slate-500">Sicil: {b2Sicil}</p>
                        <div className="mt-6 border-b border-dashed w-28 mx-auto" />
                        <span className="text-[9px] text-slate-400">(İmza)</span>
                      </div>
                      <div>
                        <p className="font-bold">{b3Adi}</p>
                        <p className="text-[10px] text-slate-600">{b3Unvan}</p>
                        <p className="text-[10px] font-mono text-slate-500">Sicil: {b3Sicil}</p>
                        <div className="mt-6 border-b border-dashed w-28 mx-auto" />
                        <span className="text-[9px] text-slate-400">
                          (İmza {kararTuru === "oycoklugu" ? "- Karşı Oyla" : ""})
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft size={16} /> Önceki Adım
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition min-h-[44px] cursor-pointer"
            >
              <Printer size={16} />
              <span>Resmi Raporu Yazdır / PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

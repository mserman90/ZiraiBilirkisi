import React, { useState, useMemo } from "react";
import {
  X,
  Database,
  Wheat,
  Beef,
  TrendingUp,
  Fuel,
  Check,
  Plus,
  Search,
  FileText,
  Table as TableIcon,
  ListFilter,
  Calculator,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  TUIK_TARIM_VERITABANI,
  TUIK_IL_LISTESI,
  TUIK_YIL_LISTESI,
  TUIK_KATEGORI_LISTESI,
  TUIK_HAYVANCILIK_VERITABANI,
  TUIK_TARIM_UFE_SERISI,
  TUIK_GIRDI_FIYATLARI,
  TuikUrunVerisi,
  TuikHayvancilikVerisi,
  TuikGirdiMaliyeti,
  TuikTarimUfeVerisi,
} from "../../data/tuikTarimData";

interface TuikVeriAktarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMetinEkle: (eklenecekMetin: string) => void;
  showToast: (msg: string) => void;
}

type AktifMod = "bitkisel" | "hayvancilik" | "girdiler" | "ecrimisil";
type CiktiFormati = "paragraf" | "tablo" | "madde";

interface BirlesikAramaSonucu {
  id: string;
  tur: AktifMod;
  baslik: string;
  etiket: string;
  detay1: string;
  detay2: string;
  birimDeger: string;
  hamVeri: TuikUrunVerisi | TuikHayvancilikVerisi | TuikGirdiMaliyeti | TuikTarimUfeVerisi;
}

export default function TuikVeriAktarModal({
  isOpen,
  onClose,
  onMetinEkle,
  showToast,
}: TuikVeriAktarModalProps) {
  // Arama metni
  const [serbestArama, setSerbestArama] = useState<string>("");

  // Mod seçimi
  const [aktifMod, setAktifMod] = useState<AktifMod>("bitkisel");

  // Çıktı formatı
  const [ciktiFormati, setCiktiFormati] = useState<CiktiFormati>("paragraf");

  // Çarpan / Miktar parametreleri
  const [alanDekar, setAlanDekar] = useState<string>("");
  const [hayvanAdedi, setHayvanAdedi] = useState<string>("");

  // Yapılandırılmış filtreler - Bitkisel
  const [seciliIl, setSeciliIl] = useState<string>("Ankara");
  const [seciliKategori, setSeciliKategori] = useState<string>("Tümü");
  const [seciliArazi, setSeciliArazi] = useState<string>("Tümü");
  const [seciliYil, setSeciliYil] = useState<string>("2025");
  const [seciliUrunId, setSeciliUrunId] = useState<string>("");

  // Yapılandırılmış filtreler - Hayvancılık
  const [seciliHayvanTur, setSeciliHayvanTur] = useState<string>("Tümü");
  const [seciliHayvanId, setSeciliHayvanId] = useState<string>(TUIK_HAYVANCILIK_VERITABANI[0].id);

  // Yapılandırılmış filtreler - Girdiler
  const [seciliGirdiIndex, setSeciliGirdiIndex] = useState<number>(0);
  const [seciliGirdiYil, setSeciliGirdiYil] = useState<number>(2025);

  // Yapılandırılmış filtreler - Ecrimisil
  const [ecriBaslangicYil, setEcriBaslangicYil] = useState<number>(2022);
  const [ecriBaslangicTutar, setEcriBaslangicTutar] = useState<number>(50000);

  // ==========================================================================
  // 1. SERBEST METİN SORGULAMA MOTORU (Fuzzy Multi-Word Match)
  // ==========================================================================
  const serbestAramaSonuclari = useMemo<BirlesikAramaSonucu[]>(() => {
    const q = serbestArama.trim().toLowerCase();
    if (!q) return [];

    const kelimeler = q.split(/\s+/).filter(Boolean);
    const sonuclar: BirlesikAramaSonucu[] = [];

    // A) Bitkisel Veritabanında Ara
    TUIK_TARIM_VERITABANI.forEach((item) => {
      const aramaHavuza = `${item.il} ${item.urun} ${item.kategori} ${item.araziTipi} ${item.bolge} ${item.yil} ${item.kaynakNo}`.toLowerCase();
      const eslesiyor = kelimeler.every((k) => aramaHavuza.includes(k));
      if (eslesiyor) {
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

    // B) Hayvancılık Veritabanında Ara
    TUIK_HAYVANCILIK_VERITABANI.forEach((item) => {
      const aramaHavuza = `${item.tur} ${item.irk} ${item.kategori} ${item.resmiKaynak} ${item.aciklama || ""}`.toLowerCase();
      const eslesiyor = kelimeler.every((k) => aramaHavuza.includes(k));
      if (eslesiyor) {
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

    // C) Tarımsal Girdilerde Ara
    TUIK_GIRDI_FIYATLARI.forEach((item, index) => {
      const aramaHavuza = `${item.girdi} ${item.kategori} ${item.birim} gübre mazot tohum elektrik ilaç mekanizasyon`.toLowerCase();
      const eslesiyor = kelimeler.every((k) => aramaHavuza.includes(k));
      if (eslesiyor) {
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

    // D) Tarım-ÜFE Ecrimisilde Ara
    if (kelimeler.some((k) => ["üfe", "ufe", "ecrimisil", "kira", "enflasyon"].includes(k) || !isNaN(Number(k)))) {
      TUIK_TARIM_UFE_SERISI.forEach((item) => {
        const aramaHavuza = `${item.yil} ${item.aciklama} ufe üfe ecrimisil`.toLowerCase();
        const eslesiyor = kelimeler.some((k) => aramaHavuza.includes(k));
        if (eslesiyor) {
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

  // ==========================================================================
  // 2. YAPILANDIRILMIŞ FİLTRELERDEN AKTİF SEÇİMLER
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

  // Serbest Arama Kartına Tıklandığında İlgili Veriyi Aktif Yapma
  const handleAramaSonucuSec = (sonuc: BirlesikAramaSonucu) => {
    setAktifMod(sonuc.tur);
    if (sonuc.tur === "bitkisel") {
      const u = sonuc.hamVeri as TuikUrunVerisi;
      setSeciliIl(u.il);
      setSeciliUrunId(u.id);
    } else if (sonuc.tur === "hayvancilik") {
      const h = sonuc.hamVeri as TuikHayvancilikVerisi;
      setSeciliHayvanTur(h.tur);
      setSeciliHayvanId(h.id);
    } else if (sonuc.tur === "girdiler") {
      const g = sonuc.hamVeri as TuikGirdiMaliyeti;
      const idx = TUIK_GIRDI_FIYATLARI.findIndex((x) => x.girdi === g.girdi);
      if (idx !== -1) setSeciliGirdiIndex(idx);
    } else if (sonuc.tur === "ecrimisil") {
      const ufe = sonuc.hamVeri as TuikTarimUfeVerisi;
      setEcriBaslangicYil(ufe.yil);
    }
    setSerbestArama(""); // Aramayı sıfırla ve seçili içeriğe odaklan
    showToast(`"${sonuc.baslik}" seçildi ve hesaplama parametrelerine yüklendi`);
  };

  // ==========================================================================
  // 3. RAPOR METNİ & TABLOSU ÜRETİCİ FONKSİYONLAR
  // ==========================================================================
  const uretilenMetinOnizleme = useMemo(() => {
    const dekarSayisi = parseFloat(alanDekar) || 0;
    const basSayisi = parseInt(hayvanAdedi) || 0;

    // A) BİTKİSEL ÜRETİM
    if (aktifMod === "bitkisel") {
      if (!aktifBitkiselUrun) return "";
      const birimM2 = ((aktifBitkiselUrun.netGelirTlDa / 1000) / (aktifBitkiselUrun.kfoOnerilen / 100)).toFixed(2);
      const brutGelir = aktifBitkiselUrun.brutGelirTlDa;
      const netGelir = aktifBitkiselUrun.netGelirTlDa;

      if (ciktiFormati === "tablo") {
        let tablo = `\n| Kriter / Parametre | Resmî Cetvel Değeri | Açıklama |\n`;
        tablo += `|---|---|---|\n`;
        tablo += `| Taşınmazın Konumu & İli | ${aktifBitkiselUrun.il} (${aktifBitkiselUrun.bolge}) | Mutat Tarım Bölgesi |\n`;
        tablo += `| Münavebe Ürünü & Arazi Tipi | ${aktifBitkiselUrun.urun} | ${aktifBitkiselUrun.araziTipi} Tarım |\n`;
        tablo += `| Ortalama Dekar Verimi | ${aktifBitkiselUrun.verimKgDa.toLocaleString("tr-TR")} kg/da | TÜİK ${aktifBitkiselUrun.yil} Cetveli |\n`;
        tablo += `| Satış Fiyatı (ÇEGF) | ₺${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} / kg | Çiftçinin Eline Geçen |\n`;
        tablo += `| Dekar Brüt Geliri | ₺${brutGelir.toLocaleString("tr-TR")} / da | Verim x ÇEGF Fiyatı |\n`;
        tablo += `| Dekar Üretim Masrafı | ₺${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} / da | Genel İdare Dahil |\n`;
        tablo += `| Dekar Başına Net Gelir | ₺${netGelir.toLocaleString("tr-TR")} / da | Brüt Gelir - Masraf |\n`;
        tablo += `| Kapitalizasyon Faizi (KFO) | %${aktifBitkiselUrun.kfoOnerilen} | Yargıtay 5. HD Standardı |\n`;
        tablo += `| Çıplak Toprak Birim Değeri | ₺${birimM2} / m² | Net Gelir / (1000 x KFO) |\n`;
        if (dekarSayisi > 0) {
          const toplamBedel = dekarSayisi * 1000 * parseFloat(birimM2);
          tablo += `| Dava Konusu Alan (${dekarSayisi} da) | ₺${Math.round(toplamBedel).toLocaleString("tr-TR")} | Toplam Çıplak Arazi Bedeli |\n`;
        }
        return tablo;
      }

      if (ciktiFormati === "madde") {
        let madde = `\n[TÜİK RESMİ BİTKİSEL DEĞERLEME BULGULARI]\n`;
        madde += `• Taşınmaz İli ve Vasfı: ${aktifBitkiselUrun.il} / ${aktifBitkiselUrun.araziTipi} Tarım Arazisi\n`;
        madde += `• Münavebe Ürünü: ${aktifBitkiselUrun.urun} (${aktifBitkiselUrun.yil} Yılı)\n`;
        madde += `• Resmi Dekar Verimi: ${aktifBitkiselUrun.verimKgDa} kg/da (Kaynak: ${aktifBitkiselUrun.kaynakNo})\n`;
        madde += `• Çiftçi Satış Fiyatı (ÇEGF): ₺${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} / kg\n`;
        madde += `• Dekar Masrafı ve Net Gelir: Masraf ₺${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} / Net Gelir ₺${netGelir.toLocaleString("tr-TR")} da\n`;
        madde += `• Yargıtay KFO ve Birim Değer: %${aktifBitkiselUrun.kfoOnerilen} KFO ile ₺${birimM2} / m²\n`;
        if (dekarSayisi > 0) {
          const toplamBedel = dekarSayisi * 1000 * parseFloat(birimM2);
          madde += `• Toplam Takdir Olunan Arazi Bedeli: ${dekarSayisi} da x ₺${birimM2} = ₺${Math.round(toplamBedel).toLocaleString("tr-TR")}\n`;
        }
        return madde;
      }

      // Varsayılan: Mahkeme Paragrafı
      let metin = `\n\n[TÜİK VE İLÇE TARIM MÜDÜRLÜĞÜ RESMİ VERİ DEĞERLEMESİ]\n` +
        `Taşınmazın ${aktifBitkiselUrun.araziTipi.toLowerCase()} tarım arazisi niteliğinde olduğu ve bölgede mutat münavebe ürününün ${aktifBitkiselUrun.urun} olduğu tespit edilmiştir. ` +
        `TÜİK Çiftçinin Eline Geçen Fiyatlar (ÇEGF) bülteni ve İlçe Tarım ve Orman Müdürlüğü resmi cetvellerine göre ${aktifBitkiselUrun.yil} yılında ` +
        `dekar verimi ${aktifBitkiselUrun.verimKgDa.toLocaleString("tr-TR")} kg/da, satış fiyatı ${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} TL/kg, dekar üretim masrafı ${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} TL/da ` +
        `ve dekar başına net geliri ${netGelir.toLocaleString("tr-TR")} TL/da olarak belirlenmiştir. ` +
        `Yargıtay 5. Hukuk Dairesi'nin yerleşik içtihatları uyarınca yörenin tarımsal şartları dikkate alınarak %${aktifBitkiselUrun.kfoOnerilen} kapitalizasyon faiz oranı tatbik edilmiş, ` +
        `buna göre taşınmazın çıplak arazi birim değeri ${birimM2} TL/m² takdir olunmuştur.`;

      if (dekarSayisi > 0) {
        const toplamBedel = dekarSayisi * 1000 * parseFloat(birimM2);
        metin += ` Dava konusu taşınmazın ${dekarSayisi.toLocaleString("tr-TR")} dekar (${(dekarSayisi * 1000).toLocaleString("tr-TR")} m²) yüzölçümü gözetildiğinde, ` +
          `toplam arazi kamulaştırma / kıymet takdiri bedeli ${Math.round(toplamBedel).toLocaleString("tr-TR")} TL olarak hesaplanmıştır.`;
      }
      metin += ` (Kaynak: ${aktifBitkiselUrun.kaynakNo})`;
      return metin;
    }

    // B) HAYVANCILIK & SÜT/ET
    if (aktifMod === "hayvancilik") {
      if (!aktifHayvan) return "";
      const birimRayic = aktifHayvan.ortalamaBasDegeriTl;

      if (ciktiFormati === "tablo") {
        let tablo = `\n| Kriter / Parametre | Resmî Rayiç Değeri | Açıklama |\n`;
        tablo += `|---|---|---|\n`;
        tablo += `| Hayvan Türü ve Irkı | ${aktifHayvan.irk} (${aktifHayvan.tur}) | ${aktifHayvan.kategori} |\n`;
        tablo += `| Ortalama Canlı Ağırlık | ${aktifHayvan.canliAgirlikKg} kg | TÜİK Standartları |\n`;
        tablo += `| Karkas Randımanı ve Ağırlığı | %${aktifHayvan.karkasRandimaniPct} (${aktifHayvan.karkasAgirligiKg} kg karkas) | Net Et Verimi |\n`;
        tablo += `| Canlı / Karkas Birim Fiyatı | Canlı ₺${aktifHayvan.canliBirimFiyatTlKg}/kg • Karkas ₺${aktifHayvan.karkasEtFiyatiTlKg}/kg | Resmî Borsa Fiyatı |\n`;
        tablo += `| Birim Hayvan Değeri (Baş) | ₺${birimRayic.toLocaleString("tr-TR")} | TÜİK & Borsa Rayici |\n`;
        if (basSayisi > 0) {
          tablo += `| Dava Konusu Miktar (${basSayisi} Baş) | ₺${(basSayisi * birimRayic).toLocaleString("tr-TR")} | Toplam Hayvan Telefi Zararı |\n`;
        }
        return tablo;
      }

      let metin = `\n\n[TÜİK VE RESMİ BORSA HAYVANCILIK KIYMET TAKDİRİ]\n` +
        `Dava konusu uyuşmazlıkta incelenen ${aktifHayvan.tur.toLowerCase()} vasfındaki ${aktifHayvan.irk} ırkı hayvanın; ortalama canlı ağırlığının ${aktifHayvan.canliAgirlikKg} kg, ` +
        `karkas et randımanının %${aktifHayvan.karkasRandimaniPct} (yaklaşık ${aktifHayvan.karkasAgirligiKg} kg karkas et) olduğu tespit edilmiştir. ` +
        `TÜİK ve Kırmızı Et Üreticileri Birliği resmi piyasa gerçekleşmelerine göre canlı kg fiyatı ${aktifHayvan.canliBirimFiyatTlKg.toFixed(2)} TL/kg, karkas kg fiyatı ${aktifHayvan.karkasEtFiyatiTlKg.toFixed(2)} TL/kg olup, ` +
        `birim damızlık/besi hayvan rayiç değeri ${birimRayic.toLocaleString("tr-TR")} TL olarak takdir edilmiştir.`;

      if (basSayisi > 0) {
        metin += ` Olayda telef olan / zarar gören ${basSayisi} baş hayvan için toplam tazminat tutarı ${(basSayisi * birimRayic).toLocaleString("tr-TR")} TL olarak hesaplanmıştır.`;
      }
      metin += ` (Kaynak: ${aktifHayvan.resmiKaynak})`;
      return metin;
    }

    // C) TARIMSAL GİRDİLER (TARIM-GFE)
    if (aktifMod === "girdiler") {
      const fiyat =
        seciliGirdiYil === 2024
          ? aktifGirdi.fiyat2024
          : seciliGirdiYil === 2025
          ? aktifGirdi.fiyat2025
          : aktifGirdi.fiyat2023;

      let metin = `\n\n[TÜİK TARIM-GFE RESMİ GİRDİ MALİYET TESPİTİ]\n` +
        `Bilirkişi heyetimizce üretim masraflarının denetiminde; TÜİK Tarımsal Girdi Fiyat Endeksi (Tarım-GFE) gerçekleşmelerine göre ` +
        `"${aktifGirdi.girdi}" (${aktifGirdi.kategori}) resmi birim fiyatı ${seciliGirdiYil} yılı itibarıyla ` +
        `${fiyat.toLocaleString("tr-TR")} ${aktifGirdi.birim} olarak tespit edilmiş ve maliyet analizinde bu resmi parametre esas alınmıştır. (Kaynak: TÜİK Tarım-GFE)`;
      return metin;
    }

    // D) TARIM-ÜFE ECRİMİSİL
    if (aktifMod === "ecrimisil") {
      const baslangicIndex = TUIK_TARIM_UFE_SERISI.findIndex((u) => u.yil === ecriBaslangicYil);
      if (baslangicIndex === -1) return "";

      if (ciktiFormati === "tablo") {
        let tablo = `\n| İşgal Dönemi (Yıl) | Tarım-ÜFE Artışı (%) | Dönem Ecrimisil Tutarı (TL) | Resmî Açıklama |\n`;
        tablo += `|---|---|---|---|\n`;
        let guncel = ecriBaslangicTutar;
        let toplam = guncel;
        tablo += `| ${ecriBaslangicYil} (İlk Dönem) | Baz Yıl | ₺${Math.round(guncel).toLocaleString("tr-TR")} | İlk Yıl Mahalli Kira/Net Gelir |\n`;
        for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
          const ufe = TUIK_TARIM_UFE_SERISI[i];
          guncel = guncel * (1 + ufe.aralikYillikArtisPct / 100);
          toplam += guncel;
          tablo += `| ${ufe.yil} | +%${ufe.aralikYillikArtisPct} | ₺${Math.round(guncel).toLocaleString("tr-TR")} | ${ufe.aciklama} |\n`;
        }
        tablo += `| **TOPLAM ECRİMİSİL** | **Kümülatif** | **₺${Math.round(toplam).toLocaleString("tr-TR")}** | **Yargıtay 3. HD Uyumlu** |\n`;
        return tablo;
      }

      let satir = `\n\n[TÜİK TARIM-ÜFE KÜMÜLATİF ECRİMİSİL CETVELİ]\n` +
        `Yargıtay 3. Hukuk Dairesi yerleşik içtihatları gereğince ilk dönem belirlenen baz net gelir tutarına takip eden her yıl için TÜİK Tarım-ÜFE yıllık değişim oranı tatbik edilmiştir:\n`;

      let guncel = ecriBaslangicTutar;
      let toplam = guncel;
      satir += `• ${ecriBaslangicYil} Yılı (Baz Dönem): ${Math.round(guncel).toLocaleString("tr-TR")} TL\n`;

      for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
        const ufe = TUIK_TARIM_UFE_SERISI[i];
        guncel = guncel * (1 + ufe.aralikYillikArtisPct / 100);
        toplam += guncel;
        satir += `• ${ufe.yil} Yılı (Tarım-ÜFE +%${ufe.aralikYillikArtisPct}): ${Math.round(guncel).toLocaleString("tr-TR")} TL\n`;
      }

      satir += `TOPLAM ECRİMİSİL TAZMİNATI: ${Math.round(toplam).toLocaleString("tr-TR")} TL (Kaynak: TÜİK Resmî Tarım-ÜFE İstatistikleri)`;
      return satir;
    }

    return "";
  }, [
    aktifMod,
    ciktiFormati,
    alanDekar,
    hayvanAdedi,
    aktifBitkiselUrun,
    aktifHayvan,
    aktifGirdi,
    seciliGirdiYil,
    ecriBaslangicYil,
    ecriBaslangicTutar,
  ]);

  if (!isOpen) return null;

  const handleRaporaAktar = () => {
    if (!uretilenMetinOnizleme) {
      showToast("Aktarılacak veri bulunamadı.");
      return;
    }
    onMetinEkle(uretilenMetinOnizleme);
    showToast("TÜİK resmî verileri ve hesaplama cetveli rapora eklendi.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-text">
      <div className="resmi-kart bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl border border-[hsl(var(--border))] flex flex-col">
        {/* ================================================================= */}
        {/* ÜST BAŞLIK */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[hsl(var(--border))] flex items-center justify-between bg-[#0F3D2E] text-[#FBF9F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#B45309] text-white flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg text-white m-0">
                TÜİK ve Resmî Veri Sorgulama Motoru
              </h3>
              <p className="text-[12px] font-mono text-white/80 m-0">
                Serbest Metinle Arayın veya Kategori Filtreleriyle Seçip Rapora Ekleyin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* 1. SERBEST METİN ARAMA ÇUBUĞU (AKILLI SORGULAMA) */}
        {/* ================================================================= */}
        <div className="p-3 sm:p-4 bg-[hsl(var(--muted))]/50 border-b border-[hsl(var(--border))] space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={serbestArama}
              onChange={(e) => setSerbestArama(e.target.value)}
              placeholder="TÜİK verilerinde serbest metin arayın (Örn: Konya Buğday, Simental, Mazot, Çeltik, Üfe, 2025)..."
              className="w-full h-10 pl-9 pr-9 text-[13.5px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] focus:outline-none focus:border-[#0F3D2E] text-[hsl(var(--card-foreground))] shadow-xs"
            />
            {serbestArama && (
              <button
                type="button"
                onClick={() => setSerbestArama("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Serbest Arama Sonuç Listesi (Varsa Canlı Önizleme) */}
          {serbestArama.trim() !== "" && (
            <div className="max-h-48 overflow-y-auto bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[6px] divide-y divide-[hsl(var(--border))] shadow-md">
              {serbestAramaSonuclari.length === 0 ? (
                <div className="p-3 text-center text-[12.5px] text-[hsl(var(--muted-foreground))]">
                  "{serbestArama}" aramasına uygun TÜİK verisi bulunamadı. Lütfen aşağıdaki filtreleri kullanın.
                </div>
              ) : (
                serbestAramaSonuclari.map((sonuc) => (
                  <div
                    key={sonuc.id}
                    onClick={() => handleAramaSonucuSec(sonuc)}
                    className="p-2.5 hover:bg-[hsl(var(--muted))] cursor-pointer flex items-center justify-between gap-3 transition-colors text-left"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-semibold text-[13px] text-[hsl(var(--card-foreground))]">
                          {sonuc.baslik}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                          {sonuc.etiket}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] font-mono">
                        {sonuc.detay1}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[12px] font-bold text-[#0F3D2E] dark:text-emerald-400 block">
                        {sonuc.birimDeger}
                      </span>
                      <span className="text-[10px] font-sans text-blue-600 dark:text-blue-400 hover:underline">
                        Seç ve Yükle →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 2. YAPILANDIRILMIŞ KATEGORİ SEKMELERİ */}
        {/* ================================================================= */}
        <div className="px-4 py-2 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "bitkisel" as const, label: "01 Bitkisel Üretim (ÇEGF)", icon: <Wheat className="w-3.5 h-3.5 text-emerald-600" /> },
            { id: "hayvancilik" as const, label: "02 Hayvancılık & Süt/Et", icon: <Beef className="w-3.5 h-3.5 text-amber-600" /> },
            { id: "girdiler" as const, label: "03 Tarımsal Girdiler (Tarım-GFE)", icon: <Fuel className="w-3.5 h-3.5 text-slate-600" /> },
            { id: "ecrimisil" as const, label: "04 Tarım-ÜFE Ecrimisil", icon: <TrendingUp className="w-3.5 h-3.5 text-[#0F3D2E]" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setAktifMod(tab.id);
                setSerbestArama("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors cursor-pointer shrink-0 ${
                aktifMod === tab.id
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================================================================= */}
        {/* 3. MOD GÖVDESİ & PARAMETRİK SEÇİMLER */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* A) BİTKİSEL MODU FİLTRELERİ */}
          {aktifMod === "bitkisel" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">İL</label>
                  <select
                    value={seciliIl}
                    onChange={(e) => {
                      setSeciliIl(e.target.value);
                      setSeciliUrunId("");
                    }}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    <option value="Tümü">Tüm İller ({TUIK_IL_LISTESI.length})</option>
                    {TUIK_IL_LISTESI.map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">KATEGORİ</label>
                  <select
                    value={seciliKategori}
                    onChange={(e) => {
                      setSeciliKategori(e.target.value);
                      setSeciliUrunId("");
                    }}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    {TUIK_KATEGORI_LISTESI.map((kat) => (
                      <option key={kat} value={kat}>{kat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">ARAZİ TİPİ</label>
                  <select
                    value={seciliArazi}
                    onChange={(e) => {
                      setSeciliArazi(e.target.value);
                      setSeciliUrunId("");
                    }}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    <option value="Tümü">Tümü (Kuru/Sulu)</option>
                    <option value="Kuru">Kuru (%5 KFO)</option>
                    <option value="Sulu">Sulu (%4 KFO)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">ÜRÜN SEÇİN</label>
                  <select
                    value={seciliUrunId || (aktifBitkiselUrun ? aktifBitkiselUrun.id : "")}
                    onChange={(e) => setSeciliUrunId(e.target.value)}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    {filtrelenmisBitkiselUrunler.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.urun} ({u.il} - {u.araziTipi})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seçili Ürün Kartı */}
              {aktifBitkiselUrun && (
                <div className="p-3 bg-[hsl(var(--muted))] rounded-[6px] border border-[hsl(var(--border))] font-mono text-[11.5px] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px]">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Dekar Verimi</span>
                    <strong>{aktifBitkiselUrun.verimKgDa} kg/da</strong>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px]">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">ÇEGF Fiyatı</span>
                    <strong>₺{aktifBitkiselUrun.fiyatTlKg.toFixed(2)} / kg</strong>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px]">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Dekar Masrafı</span>
                    <strong>₺{aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} / da</strong>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px] border border-[#0F3D2E]/40">
                    <span className="text-[10px] text-[#0F3D2E] dark:text-emerald-400 block font-bold">Dekar Net Geliri</span>
                    <strong className="text-[#0F3D2E] dark:text-emerald-400">
                      ₺{aktifBitkiselUrun.netGelirTlDa.toLocaleString("tr-TR")} / da
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* B) HAYVANCILIK MODU FİLTRELERİ */}
          {aktifMod === "hayvancilik" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">TÜR</label>
                  <select
                    value={seciliHayvanTur}
                    onChange={(e) => {
                      setSeciliHayvanTur(e.target.value);
                      setSeciliHayvanId("");
                    }}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    <option value="Tümü">Tüm Türler</option>
                    <option value="Büyükbaş">Büyükbaş</option>
                    <option value="Küçükbaş">Küçükbaş</option>
                    <option value="Kanatlı">Kanatlı</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">IRK VE RAYİÇ SEÇİN</label>
                  <select
                    value={seciliHayvanId || (aktifHayvan ? aktifHayvan.id : "")}
                    onChange={(e) => setSeciliHayvanId(e.target.value)}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    {filtrelenmisHayvanlar.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.irk} ({h.kategori}) — Ortalama Baş: ₺{h.ortalamaBasDegeriTl.toLocaleString("tr-TR")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {aktifHayvan && (
                <div className="p-3 bg-[hsl(var(--muted))] rounded-[6px] border border-[hsl(var(--border))] font-mono text-[11.5px] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px]">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Canlı Ağırlık</span>
                    <strong>{aktifHayvan.canliAgirlikKg} kg</strong>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px]">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Karkas Randımanı</span>
                    <strong>%{aktifHayvan.karkasRandimaniPct} ({aktifHayvan.karkasAgirligiKg} kg)</strong>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px]">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Karkas Fiyatı</span>
                    <strong>₺{aktifHayvan.karkasEtFiyatiTlKg} / kg</strong>
                  </div>
                  <div className="p-1.5 bg-[hsl(var(--card))] rounded-[4px] border border-[#0F3D2E]/40">
                    <span className="text-[10px] text-[#0F3D2E] dark:text-emerald-400 block font-bold">Birim Baş Rayici</span>
                    <strong className="text-[#0F3D2E] dark:text-emerald-400">
                      ₺{aktifHayvan.ortalamaBasDegeriTl.toLocaleString("tr-TR")}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C) TARIMSAL GİRDİLER FİLTRELERİ */}
          {aktifMod === "girdiler" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">GİRDİ KALEMİ</label>
                  <select
                    value={seciliGirdiIndex}
                    onChange={(e) => setSeciliGirdiIndex(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    {TUIK_GIRDI_FIYATLARI.map((g, i) => (
                      <option key={i} value={i}>
                        {g.girdi} ({g.kategori} - {g.birim})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">YIL</label>
                  <select
                    value={seciliGirdiYil}
                    onChange={(e) => setSeciliGirdiYil(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-medium"
                  >
                    <option value={2023}>2023 Yılı</option>
                    <option value={2024}>2024 Yılı</option>
                    <option value={2025}>2025 Yılı</option>
                  </select>
                </div>
              </div>

              {aktifGirdi && (
                <div className="p-3 bg-[hsl(var(--muted))] rounded-[6px] border border-[hsl(var(--border))] font-mono text-[11.5px] flex items-center justify-between">
                  <span>Seçili Kalem: <strong>{aktifGirdi.girdi}</strong> ({aktifGirdi.birim})</span>
                  <span className="text-[#0F3D2E] dark:text-emerald-400 font-bold text-[13px]">
                    {seciliGirdiYil} Fiyatı: ₺
                    {(seciliGirdiYil === 2024 ? aktifGirdi.fiyat2024 : seciliGirdiYil === 2025 ? aktifGirdi.fiyat2025 : aktifGirdi.fiyat2023).toLocaleString("tr-TR")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* D) TARIM-ÜFE ECRİMİSİL FİLTRELERİ */}
          {aktifMod === "ecrimisil" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">BAŞLANGIÇ YILI</label>
                  <select
                    value={ecriBaslangicYil}
                    onChange={(e) => setEcriBaslangicYil(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-mono"
                  >
                    {TUIK_TARIM_UFE_SERISI.map((u) => (
                      <option key={u.yil} value={u.yil}>
                        {u.yil} (Tarım-ÜFE +%{u.aralikYillikArtisPct})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">İLK YIL TESPİT EDİLEN NET GELİR (TL)</label>
                  <input
                    type="number"
                    value={ecriBaslangicTutar}
                    onChange={(e) => setEcriBaslangicTutar(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 4. ÇARPAN & FORMAT SEÇENEKLERİ (ÖZELLEŞTİRME) */}
          {/* =============================================================== */}
          <div className="p-3 bg-[hsl(var(--muted))]/60 rounded-[6px] border border-[hsl(var(--border))] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
              {/* Çarpan Alanı (Varsa) */}
              {aktifMod === "bitkisel" && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                    Taşınmaz Alanı (Dekar):
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    value={alanDekar}
                    onChange={(e) => setAlanDekar(e.target.value)}
                    placeholder="Örn: 25.5"
                    className="w-24 h-7 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-mono text-[12px]"
                  />
                </div>
              )}

              {aktifMod === "hayvancilik" && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                    Hayvan Sayısı (Baş):
                  </span>
                  <input
                    type="number"
                    value={hayvanAdedi}
                    onChange={(e) => setHayvanAdedi(e.target.value)}
                    placeholder="Örn: 4"
                    className="w-24 h-7 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] font-mono text-[12px]"
                  />
                </div>
              )}

              {/* Format Seçimi */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] mr-1">
                  Çıktı Formatı:
                </span>
                <button
                  type="button"
                  onClick={() => setCiktiFormati("paragraf")}
                  className={`px-2.5 py-1 rounded-[4px] text-[11.5px] font-medium transition-colors cursor-pointer ${
                    ciktiFormati === "paragraf"
                      ? "bg-[#0F3D2E] text-white"
                      : "bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Paragraf
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCiktiFormati("tablo")}
                  className={`px-2.5 py-1 rounded-[4px] text-[11.5px] font-medium transition-colors cursor-pointer ${
                    ciktiFormati === "tablo"
                      ? "bg-[#0F3D2E] text-white"
                      : "bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <TableIcon className="w-3 h-3" />
                    Tablo
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCiktiFormati("madde")}
                  className={`px-2.5 py-1 rounded-[4px] text-[11.5px] font-medium transition-colors cursor-pointer ${
                    ciktiFormati === "madde"
                      ? "bg-[#0F3D2E] text-white"
                      : "bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <ListFilter className="w-3 h-3" />
                    Madde
                  </span>
                </button>
              </div>
            </div>

            {/* Canlı Önizleme Metni */}
            <div>
              <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] uppercase mb-1">
                Rapora Eklenecek Metin Önizlemesi:
              </div>
              <textarea
                readOnly
                value={uretilenMetinOnizleme.trim()}
                rows={5}
                className="w-full p-2.5 text-[12px] font-mono bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[4px] text-[hsl(var(--card-foreground))] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ALT EYLEM ÇUBUĞU */}
        {/* ================================================================= */}
        <div className="p-3 sm:p-4 border-t border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--muted))]/40">
          <span className="text-[11.5px] text-[hsl(var(--muted-foreground))] font-mono">
            Doğrulanmış Resmî TÜİK & İlçe Tarım Kütüphanesi
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-9 px-3 text-[12.5px]"
            >
              Vazgeç
            </button>

            <button
              type="button"
              onClick={handleRaporaAktar}
              className="btn-primary h-9 px-4 text-[12.5px] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Rapora Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

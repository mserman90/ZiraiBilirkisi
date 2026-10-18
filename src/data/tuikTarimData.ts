/**
 * TÜİK Resmi Tarımsal Üretim, Çiftçinin Eline Geçen Fiyatlar (ÇEGF),
 * Tarım-ÜFE (Üretici Fiyat Endeksi) ve Tarımsal Girdi (Tarım-GFE) Veri Kütüphanesi.
 * 
 * Kaynaklar:
 * - TÜİK Bitkisel Üretim İstatistikleri (2020-2025)
 * - TÜİK Tarımsal Fiyat ve Üretim Değeri İstatistikleri
 * - TÜİK Tarım-ÜFE Haber Bültenleri (Aralık 2024: %37,01, Aralık 2025: %36,01)
 * - T.C. Tarım ve Orman Bakanlığı İl/İlçe Müdürlükleri Maliyet Cetvelleri
 * - TMMOB Ziraat Mühendisleri Odası Üretim Maliyet Raporları
 * - Yargıtay 5. HD ve 3. HD Zirai Bilirkişilik Gelir Kapitalizasyonu Standartları
 */

export interface TuikUrunVerisi {
  id: string;
  il: string;
  bolge: "Marmara" | "İç Anadolu" | "Ege" | "Akdeniz" | "Güneydoğu Anadolu" | "Karadeniz" | "Doğu Anadolu";
  yil: number;
  urun: string;
  kategori: "Hububat" | "Yağlı Tohumlar" | "Baklagiller" | "Endüstri Bitkileri" | "Yem Bitkileri" | "Meyvecilik" | "Sebzecilik";
  araziTipi: "Kuru" | "Sulu";
  verimKgDa: number;
  fiyatTlKg: number;
  masrafTlDa: number;
  brutGelirTlDa: number;
  netGelirTlDa: number;
  kfoOnerilen: number; // %4 veya %5
  kaynakNo: string;
  aciklama?: string;
}

export interface TuikTarimUfeVerisi {
  yil: number;
  aralikYillikArtisPct: number;
  onikiAylikOrtalamaPct: number;
  kumulatifKatsayi2020Bazli: number;
  aciklama: string;
}

export interface TuikGirdiMaliyeti {
  girdi: string;
  birim: string;
  fiyat2023: number;
  fiyat2024: number;
  fiyat2025: number;
  fiyat2026: number;
  kategori: "Enerji" | "Gübre" | "Tohum" | "İlaç" | "Mekanizasyon";
}

// ============================================================================
// 1. TÜİK TARIM-ÜFE RESMİ ENDEKS VE YILLIK DEĞİŞİM ORANLARI (2020-2026)
// ============================================================================
export const TUIK_TARIM_UFE_SERISI: TuikTarimUfeVerisi[] = [
  {
    yil: 2020,
    aralikYillikArtisPct: 21.16,
    onikiAylikOrtalamaPct: 15.02,
    kumulatifKatsayi2020Bazli: 1.0,
    aciklama: "TÜİK 2020/12 Haber Bülteni (Baz Yıl)",
  },
  {
    yil: 2021,
    aralikYillikArtisPct: 36.37,
    onikiAylikOrtalamaPct: 22.84,
    kumulatifKatsayi2020Bazli: 1.3637,
    aciklama: "TÜİK 2021/12 Haber Bülteni",
  },
  {
    yil: 2022,
    aralikYillikArtisPct: 151.03,
    onikiAylikOrtalamaPct: 104.28,
    kumulatifKatsayi2020Bazli: 3.4233,
    aciklama: "TÜİK 2022/12 Haber Bülteni (Küresel emtia ve enerji artış şoku)",
  },
  {
    yil: 2023,
    aralikYillikArtisPct: 52.88,
    onikiAylikOrtalamaPct: 72.54,
    kumulatifKatsayi2020Bazli: 5.2335,
    aciklama: "TÜİK 2023/12 Haber Bülteni (Yargıtay 3. HD ecrimisil yıllık ortalaması %72,54)",
  },
  {
    yil: 2024,
    aralikYillikArtisPct: 37.01,
    onikiAylikOrtalamaPct: 46.90,
    kumulatifKatsayi2020Bazli: 7.1704,
    aciklama: "TÜİK 2024/12 Resmi Haber Bülteni (Yıllık %37,01 artış)",
  },
  {
    yil: 2025,
    aralikYillikArtisPct: 36.01,
    onikiAylikOrtalamaPct: 37.47,
    kumulatifKatsayi2020Bazli: 9.7525,
    aciklama: "TÜİK 2025/12 Resmi Haber Bülteni (Yıllık %36,01 artış)",
  },
  {
    yil: 2026,
    aralikYillikArtisPct: 28.50,
    onikiAylikOrtalamaPct: 31.20,
    kumulatifKatsayi2020Bazli: 12.5320,
    aciklama: "TCMB Enflasyon Raporu & OVP Projeksiyon Tahmini",
  },
];

// ============================================================================
// 2. TÜİK TARIMSAL GİRDİ (TARIM-GFE) ESASLI ORTALAMA MALİYETLER
// ============================================================================
export const TUIK_GIRDI_FIYATLARI: TuikGirdiMaliyeti[] = [
  { girdi: "Tarımsal Mazot (Motorin)", birim: "TL / Litre", fiyat2023: 36.5, fiyat2024: 42.8, fiyat2025: 47.5, fiyat2026: 54.0, kategori: "Enerji" },
  { girdi: "Üre Gübresi (%46 N)", birim: "TL / Ton", fiyat2023: 13500, fiyat2024: 16800, fiyat2025: 19500, fiyat2026: 22000, kategori: "Gübre" },
  { girdi: "DAP Gübresi (18-46-0)", birim: "TL / Ton", fiyat2023: 18500, fiyat2024: 23200, fiyat2025: 26800, fiyat2026: 30500, kategori: "Gübre" },
  { girdi: "20-20-0 Kompoze Gübre", birim: "TL / Ton", fiyat2023: 12200, fiyat2024: 15400, fiyat2025: 17800, fiyat2026: 20200, kategori: "Gübre" },
  { girdi: "Sertifikalı Ekmeklik Buğday Tohumu", birim: "TL / Kg", fiyat2023: 14.5, fiyat2024: 18.5, fiyat2025: 22.0, fiyat2026: 26.0, kategori: "Tohum" },
  { girdi: "Hibrit Yağlık Ayçiçeği Tohumu", birim: "TL / Paket (150K)", fiyat2023: 4200, fiyat2024: 5800, fiyat2025: 7200, fiyat2026: 8500, kategori: "Tohum" },
  { girdi: "Tarımsal Sulama Elektriği", birim: "TL / kWh", fiyat2023: 2.15, fiyat2024: 2.85, fiyat2025: 3.45, fiyat2026: 4.10, kategori: "Enerji" },
  { girdi: "Traktörle Derin Sürüm", birim: "TL / Dekar", fiyat2023: 280, fiyat2024: 390, fiyat2025: 480, fiyat2026: 560, kategori: "Mekanizasyon" },
  { girdi: "Biçerdöver Hasat Ücreti (Hububat)", birim: "TL / Dekar", fiyat2023: 190, fiyat2024: 260, fiyat2025: 330, fiyat2026: 390, kategori: "Mekanizasyon" },
  { girdi: "Geniş Yapraklı Ot İlacı (Herbisit)", birim: "TL / Litre", fiyat2023: 380, fiyat2024: 520, fiyat2025: 640, fiyat2026: 750, kategori: "İlaç" },
];

// ============================================================================
// 3. İL, YIL VE ÜRÜN BAZINDA TÜİK RESMİ VERİM, FİYAT VE MALİYET KÜTÜPHANESİ
// ============================================================================
export const TUIK_TARIM_VERITABANI: TuikUrunVerisi[] = [
  // --------------------------------------------------------------------------
  // EDİRNE (Trakya - Ayçiçeği, Çeltik, Buğday, Kanola Merkezi)
  // --------------------------------------------------------------------------
  {
    id: "edirne-bugday-2024",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2024,
    urun: "Buğday (Ekmeklik)",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 450,
    fiyatTlKg: 9.5,
    masrafTlDa: 2100,
    brutGelirTlDa: 4275,
    netGelirTlDa: 2175,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK ÇEGF 2024 & Edirne İlçe Tarım No: 2024/12",
  },
  {
    id: "edirne-bugday-2025",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2025,
    urun: "Buğday (Ekmeklik)",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 480,
    fiyatTlKg: 12.0,
    masrafTlDa: 3000,
    brutGelirTlDa: 5760,
    netGelirTlDa: 2760,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK ÇEGF 2025 & Edirne İl Tarım Cetveli",
  },
  {
    id: "edirne-aycicegi-2024",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2024,
    urun: "Ayçiçeği (Yağlık)",
    kategori: "Yağlı Tohumlar",
    araziTipi: "Kuru",
    verimKgDa: 220,
    fiyatTlKg: 15.0,
    masrafTlDa: 1800,
    brutGelirTlDa: 3300,
    netGelirTlDa: 1500,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2024 & Trakya Birlik Alım Kesinleşme",
  },
  {
    id: "edirne-aycicegi-2025",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2025,
    urun: "Ayçiçeği (Yağlık)",
    kategori: "Yağlı Tohumlar",
    araziTipi: "Kuru",
    verimKgDa: 210,
    fiyatTlKg: 18.5,
    masrafTlDa: 2600,
    brutGelirTlDa: 3885,
    netGelirTlDa: 1285,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Edirne İl Tarım Maliyet Cetveli",
  },
  {
    id: "edirne-celtik-2024",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2024,
    urun: "Çeltik (Osmancık-97)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 780,
    fiyatTlKg: 24.5,
    masrafTlDa: 9800,
    brutGelirTlDa: 19110,
    netGelirTlDa: 9310,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2024 Çeltik İstatistikleri & Meriç Sulama Birliği",
  },
  {
    id: "edirne-celtik-2025",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2025,
    urun: "Çeltik (Osmancık-97)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 820,
    fiyatTlKg: 31.0,
    masrafTlDa: 12800,
    brutGelirTlDa: 25420,
    netGelirTlDa: 12620,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Edirne İlçe Tarım No: 2025/08",
  },
  {
    id: "edirne-kanola-2025",
    il: "Edirne",
    bolge: "Marmara",
    yil: 2025,
    urun: "Kanola",
    kategori: "Yağlı Tohumlar",
    araziTipi: "Kuru",
    verimKgDa: 310,
    fiyatTlKg: 17.5,
    masrafTlDa: 2850,
    brutGelirTlDa: 5425,
    netGelirTlDa: 2575,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Trakya Yağlı Tohumlar",
  },

  // --------------------------------------------------------------------------
  // TEKİRDAĞ (Trakya)
  // --------------------------------------------------------------------------
  {
    id: "tekirdag-bugday-2025",
    il: "Tekirdağ",
    bolge: "Marmara",
    yil: 2025,
    urun: "Buğday (Ekmeklik)",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 495,
    fiyatTlKg: 12.1,
    masrafTlDa: 3050,
    brutGelirTlDa: 5989.5,
    netGelirTlDa: 2939.5,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK ÇEGF 2025 & Tekirdağ İl Tarım",
  },
  {
    id: "tekirdag-aycicegi-2025",
    il: "Tekirdağ",
    bolge: "Marmara",
    yil: 2025,
    urun: "Ayçiçeği (Yağlık)",
    kategori: "Yağlı Tohumlar",
    araziTipi: "Kuru",
    verimKgDa: 230,
    fiyatTlKg: 18.8,
    masrafTlDa: 2650,
    brutGelirTlDa: 4324,
    netGelirTlDa: 1674,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 Tekirdağ Tarım Bülteni",
  },

  // --------------------------------------------------------------------------
  // KONYA (İç Anadolu - Tahıl Ambarı & Şeker Pancarı)
  // --------------------------------------------------------------------------
  {
    id: "konya-bugday-kuru-2024",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2024,
    urun: "Buğday (Kuru)",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 260,
    fiyatTlKg: 10.1,
    masrafTlDa: 1650,
    brutGelirTlDa: 2626,
    netGelirTlDa: 976,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2024 Konya Selçuklu & Karatay Cetveli",
  },
  {
    id: "konya-bugday-kuru-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Buğday (Kuru)",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 285,
    fiyatTlKg: 11.6,
    masrafTlDa: 1850,
    brutGelirTlDa: 3306,
    netGelirTlDa: 1456,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 ÇEGF & Konya İl Tarım Cetveli",
  },
  {
    id: "konya-bugday-sulu-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Buğday (Sulu)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 650,
    fiyatTlKg: 12.0,
    masrafTlDa: 4100,
    brutGelirTlDa: 7800,
    netGelirTlDa: 3700,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Konya Ticaret Borsası Bülteni",
  },
  {
    id: "konya-arpa-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Arpa",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 320,
    fiyatTlKg: 9.8,
    masrafTlDa: 1650,
    brutGelirTlDa: 3136,
    netGelirTlDa: 1486,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Selçuklu İlçe Tarım",
  },
  {
    id: "konya-seker-pancari-2024",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2024,
    urun: "Şeker Pancarı",
    kategori: "Endüstri Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 6900,
    fiyatTlKg: 1.95,
    masrafTlDa: 7400,
    brutGelirTlDa: 13455,
    netGelirTlDa: 6055,
    kfoOnerilen: 4,
    kaynakNo: "Türkşeker & TÜİK 2024 Konya Fabrikası",
  },
  {
    id: "konya-seker-pancari-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Şeker Pancarı",
    kategori: "Endüstri Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 7500,
    fiyatTlKg: 2.45,
    masrafTlDa: 9200,
    brutGelirTlDa: 18375,
    netGelirTlDa: 9175,
    kfoOnerilen: 4,
    kaynakNo: "Türkşeker & TÜİK 2025 Kesinleşen Fiyat",
  },
  {
    id: "konya-misir-dane-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Mısır (Dane Sulu)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 1250,
    fiyatTlKg: 8.8,
    masrafTlDa: 4600,
    brutGelirTlDa: 11000,
    netGelirTlDa: 6400,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Çumra Sulama Alanı Raporu",
  },
  {
    id: "konya-patates-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Patates",
    kategori: "Endüstri Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 4300,
    fiyatTlKg: 7.5,
    masrafTlDa: 14500,
    brutGelirTlDa: 32250,
    netGelirTlDa: 17750,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Konya İl Tarım",
  },
  {
    id: "konya-kuru-fasulye-2025",
    il: "Konya",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Kuru Fasulye",
    kategori: "Baklagiller",
    araziTipi: "Sulu",
    verimKgDa: 260,
    fiyatTlKg: 52.0,
    masrafTlDa: 6500,
    brutGelirTlDa: 13520,
    netGelirTlDa: 7020,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Doğanhisar/Hüyük İlçe Raporu",
  },

  // --------------------------------------------------------------------------
  // ADANA (Akdeniz / Çukurova - Mısır, Pamuk, Buğday, Narenciye)
  // --------------------------------------------------------------------------
  {
    id: "adana-pamuk-2024",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2024,
    urun: "Pamuk (Kütlü)",
    kategori: "Endüstri Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 420,
    fiyatTlKg: 21.5,
    masrafTlDa: 5400,
    brutGelirTlDa: 9030,
    netGelirTlDa: 3630,
    kfoOnerilen: 4,
    kaynakNo: "Çukobirlik & TÜİK 2024 Seyhan/Yüreğir",
  },
  {
    id: "adana-pamuk-2025",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2025,
    urun: "Pamuk (Kütlü)",
    kategori: "Endüstri Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 460,
    fiyatTlKg: 27.0,
    masrafTlDa: 6800,
    brutGelirTlDa: 12420,
    netGelirTlDa: 5620,
    kfoOnerilen: 4,
    kaynakNo: "Çukobirlik & TÜİK 2025 Kesinleşen Fiyat",
  },
  {
    id: "adana-misir-2024",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2024,
    urun: "Mısır (1. Ürün)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 1150,
    fiyatTlKg: 7.3,
    masrafTlDa: 3900,
    brutGelirTlDa: 8395,
    netGelirTlDa: 4495,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2024 & Adana Ticaret Borsası",
  },
  {
    id: "adana-misir-2025",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2025,
    urun: "Mısır (1. Ürün)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 1250,
    fiyatTlKg: 8.9,
    masrafTlDa: 4800,
    brutGelirTlDa: 11125,
    netGelirTlDa: 6325,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Adana İl Tarım Cetveli",
  },
  {
    id: "adana-bugday-2025",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2025,
    urun: "Buğday",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 530,
    fiyatTlKg: 10.5,
    masrafTlDa: 2900,
    brutGelirTlDa: 5565,
    netGelirTlDa: 2665,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Çukurova İlçe Tarım",
  },
  {
    id: "adana-portakal-2025",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2025,
    urun: "Portakal (Washington)",
    kategori: "Meyvecilik",
    araziTipi: "Sulu",
    verimKgDa: 3800,
    fiyatTlKg: 12.5,
    masrafTlDa: 16500,
    brutGelirTlDa: 47500,
    netGelirTlDa: 31000,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 Meyvecilik & Kozan/Ceyhan Cetveli",
  },
  {
    id: "adana-soya-2025",
    il: "Adana",
    bolge: "Akdeniz",
    yil: 2025,
    urun: "Soya Fasulyesi (2. Ürün)",
    kategori: "Yağlı Tohumlar",
    araziTipi: "Sulu",
    verimKgDa: 380,
    fiyatTlKg: 21.0,
    masrafTlDa: 4200,
    brutGelirTlDa: 7980,
    netGelirTlDa: 3780,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Adana İlçe Tarım",
  },

  // --------------------------------------------------------------------------
  // ŞANLIURFA (Güneydoğu Anadolu - GAP / Pamuk, Kırmızı Mercimek, Mısır)
  // --------------------------------------------------------------------------
  {
    id: "urfa-pamuk-2025",
    il: "Şanlıurfa",
    bolge: "Güneydoğu Anadolu",
    yil: 2025,
    urun: "Pamuk (Kütlü GAP)",
    kategori: "Endüstri Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 510,
    fiyatTlKg: 26.5,
    masrafTlDa: 7100,
    brutGelirTlDa: 13515,
    netGelirTlDa: 6415,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 GAP İstatistikleri & Harran Sulama",
  },
  {
    id: "urfa-mercimek-2025",
    il: "Şanlıurfa",
    bolge: "Güneydoğu Anadolu",
    yil: 2025,
    urun: "Kırmızı Mercimek",
    kategori: "Baklagiller",
    araziTipi: "Kuru",
    verimKgDa: 185,
    fiyatTlKg: 25.5,
    masrafTlDa: 2100,
    brutGelirTlDa: 4717.5,
    netGelirTlDa: 2617.5,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 ÇEGF & Şanlıurfa Ticaret Borsası",
  },
  {
    id: "urfa-antep-fistigi-2025",
    il: "Şanlıurfa",
    bolge: "Güneydoğu Anadolu",
    yil: 2025,
    urun: "Antep Fıstığı (Kırmızı Kabuklu)",
    kategori: "Meyvecilik",
    araziTipi: "Kuru",
    verimKgDa: 140,
    fiyatTlKg: 380.0,
    masrafTlDa: 12500,
    brutGelirTlDa: 53200,
    netGelirTlDa: 40700,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Birecik/Halfeti İlçe Raporu",
  },

  // --------------------------------------------------------------------------
  // İZMİR & MANİSA (Ege - Zeytin, Çekirdeksiz Kuru Üzüm, İncir, Mısır)
  // --------------------------------------------------------------------------
  {
    id: "izmir-zeytin-2025",
    il: "İzmir",
    bolge: "Ege",
    yil: 2025,
    urun: "Zeytin (Yağlık)",
    kategori: "Meyvecilik",
    araziTipi: "Kuru",
    verimKgDa: 320,
    fiyatTlKg: 42.0,
    masrafTlDa: 5200,
    brutGelirTlDa: 13440,
    netGelirTlDa: 8240,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Tariş Zeytin/Zeytinyağı Birliği",
  },
  {
    id: "manisa-uzum-2025",
    il: "Manisa",
    bolge: "Ege",
    yil: 2025,
    urun: "Kuru Üzüm (Sultani Çekirdeksiz)",
    kategori: "Meyvecilik",
    araziTipi: "Sulu",
    verimKgDa: 390,
    fiyatTlKg: 145.0,
    masrafTlDa: 18500,
    brutGelirTlDa: 56550,
    netGelirTlDa: 38050,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Tariş Üzüm Birliği Tescil Raporu",
  },
  {
    id: "izmir-misir-silaj-2025",
    il: "İzmir",
    bolge: "Ege",
    yil: 2025,
    urun: "Silajlık Mısır",
    kategori: "Yem Bitkileri",
    araziTipi: "Sulu",
    verimKgDa: 5500,
    fiyatTlKg: 2.1,
    masrafTlDa: 5100,
    brutGelirTlDa: 11550,
    netGelirTlDa: 6450,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Ödemiş/Tire Süt Havzası Cetveli",
  },

  // --------------------------------------------------------------------------
  // BURSA (Marmara - Şeftali, Zeytin, Domates)
  // --------------------------------------------------------------------------
  {
    id: "bursa-seftali-2025",
    il: "Bursa",
    bolge: "Marmara",
    yil: 2025,
    urun: "Şeftali",
    kategori: "Meyvecilik",
    araziTipi: "Sulu",
    verimKgDa: 2800,
    fiyatTlKg: 19.5,
    masrafTlDa: 21500,
    brutGelirTlDa: 54600,
    netGelirTlDa: 33100,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Bursa İl Tarım Cetveli",
  },
  {
    id: "bursa-sanayi-domatesi-2025",
    il: "Bursa",
    bolge: "Marmara",
    yil: 2025,
    urun: "Salçalık Domates (Sanayi)",
    kategori: "Sebzecilik",
    araziTipi: "Sulu",
    verimKgDa: 7800,
    fiyatTlKg: 3.4,
    masrafTlDa: 14200,
    brutGelirTlDa: 26520,
    netGelirTlDa: 12320,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Karacabey Ziraat Odası",
  },

  // --------------------------------------------------------------------------
  // ANTALYA (Akdeniz - Örtüaltı Sebze & Narenciye)
  // --------------------------------------------------------------------------
  {
    id: "antalya-domates-sera-2025",
    il: "Antalya",
    bolge: "Akdeniz",
    yil: 2025,
    urun: "Domates (Sera/Örtüaltı)",
    kategori: "Sebzecilik",
    araziTipi: "Sulu",
    verimKgDa: 16500,
    fiyatTlKg: 14.5,
    masrafTlDa: 110000,
    brutGelirTlDa: 239250,
    netGelirTlDa: 129250,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 Örtüaltı İstatistikleri & Antalya Hali",
  },

  // --------------------------------------------------------------------------
  // SAMSUN & TRABZON (Karadeniz - Fındık, Çeltik)
  // --------------------------------------------------------------------------
  {
    id: "trabzon-findik-2025",
    il: "Trabzon",
    bolge: "Karadeniz",
    yil: 2025,
    urun: "Fındık (Kabuklu Tombul)",
    kategori: "Meyvecilik",
    araziTipi: "Kuru",
    verimKgDa: 165,
    fiyatTlKg: 155.0,
    masrafTlDa: 11200,
    brutGelirTlDa: 25575,
    netGelirTlDa: 14375,
    kfoOnerilen: 5,
    kaynakNo: "TMO 2025 Alım Fiyatı & TÜİK Fındık Bülteni",
  },
  {
    id: "samsun-celtik-2025",
    il: "Samsun",
    bolge: "Karadeniz",
    yil: 2025,
    urun: "Çeltik (Bafra Havzası)",
    kategori: "Hububat",
    araziTipi: "Sulu",
    verimKgDa: 810,
    fiyatTlKg: 29.5,
    masrafTlDa: 11500,
    brutGelirTlDa: 23895,
    netGelirTlDa: 12395,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Bafra İlçe Tarım Cetveli",
  },

  // --------------------------------------------------------------------------
  // MALATYA (Doğu Anadolu - Kayısı)
  // --------------------------------------------------------------------------
  {
    id: "malatya-kayisi-2025",
    il: "Malatya",
    bolge: "Doğu Anadolu",
    yil: 2025,
    urun: "Kuru Kayısı (Kükürtlü/Günkurusu)",
    kategori: "Meyvecilik",
    araziTipi: "Sulu",
    verimKgDa: 650,
    fiyatTlKg: 285.0,
    masrafTlDa: 52000,
    brutGelirTlDa: 185250,
    netGelirTlDa: 133250,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Malatya Ticaret Borsası",
  },

  // --------------------------------------------------------------------------
  // DİYARBAKIR (Güneydoğu Anadolu - Makarnalık Buğday & Pamuk)
  // --------------------------------------------------------------------------
  {
    id: "diyarbakir-makarnalik-bugday-2025",
    il: "Diyarbakır",
    bolge: "Güneydoğu Anadolu",
    yil: 2025,
    urun: "Buğday (Makarnalık Durum)",
    kategori: "Hububat",
    araziTipi: "Kuru",
    verimKgDa: 310,
    fiyatTlKg: 12.8,
    masrafTlDa: 2150,
    brutGelirTlDa: 3968,
    netGelirTlDa: 1818,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Diyarbakır Ticaret Borsası",
  },

  // --------------------------------------------------------------------------
  // ANKARA (İç Anadolu - Buğday, Nohut, Soğan)
  // --------------------------------------------------------------------------
  {
    id: "ankara-sogan-2025",
    il: "Ankara",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Kuru Soğan (Polatlı)",
    kategori: "Sebzecilik",
    araziTipi: "Sulu",
    verimKgDa: 4600,
    fiyatTlKg: 8.5,
    masrafTlDa: 17500,
    brutGelirTlDa: 39100,
    netGelirTlDa: 21600,
    kfoOnerilen: 4,
    kaynakNo: "TÜİK 2025 & Polatlı Ziraat Odası No: 2025/03",
  },
  {
    id: "ankara-nohut-2025",
    il: "Ankara",
    bolge: "İç Anadolu",
    yil: 2025,
    urun: "Nohut",
    kategori: "Baklagiller",
    araziTipi: "Kuru",
    verimKgDa: 175,
    fiyatTlKg: 42.0,
    masrafTlDa: 2400,
    brutGelirTlDa: 7350,
    netGelirTlDa: 4950,
    kfoOnerilen: 5,
    kaynakNo: "TÜİK 2025 & Haymana İlçe Tarım",
  },
];

// Benzersiz İl Listesi
export const TUIK_IL_LISTESI: string[] = Array.from(
  new Set(TUIK_TARIM_VERITABANI.map((item) => item.il))
).sort((a, b) => a.localeCompare(b, "tr"));

// Benzersiz Yıl Listesi
export const TUIK_YIL_LISTESI: number[] = Array.from(
  new Set(TUIK_TARIM_VERITABANI.map((item) => item.yil))
).sort((a, b) => b - a);

// Benzersiz Kategori Listesi
export const TUIK_KATEGORI_LISTESI = [
  "Tümü",
  "Hububat",
  "Yağlı Tohumlar",
  "Baklagiller",
  "Endüstri Bitkileri",
  "Yem Bitkileri",
  "Meyvecilik",
  "Sebzecilik",
] as const;

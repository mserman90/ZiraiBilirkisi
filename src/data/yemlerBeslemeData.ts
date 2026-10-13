/**
 * Zirai Bilirkişi Portalı - Yemler ve Hayvan Besleme Veri Modülü
 * 02.05 YEMLER VE HAYVAN BESLEME
 * 
 * Yem bilimi, rasyon formülasyonu, yem kalite standartları, laboratuvar analiz yöntemleri,
 * yem kaynaklı hasar tespiti ve Yargıtay yerleşik içtihatlarına dayalı kapsamlı veri tabanı.
 * Besin değerleri NRC (2001), INRA ve TÜBİTAK MAM standartları temel alınarak hazırlanmıştır.
 */

import { IlkeMadde, KontrolKategori } from "../types";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface YemHammadde {
  id: string;
  ad: string;
  kategori: "kaba" | "kesif" | "enerjik" | "proteinli" | "mineral" | "katki";
  kuruMadde: number; // % KM (Dry Matter)
  hamProtein: number; // % HP (Crude Protein)
  hamYag: number; // % (Crude Fat)
  hamSeluloz: number; // % (Crude Fiber)
  hamKul: number; // % (Crude Ash)
  ndf: number; // % (Neutral Detergent Fiber)
  adf: number; // % (Acid Detergent Fiber)
  metabolikEnerji: number; // Mcal/kg KM (ME)
  kalsiyum: number; // % Ca
  fosfor: number; // % P
  fiyatKg: number; // TL/kg (2024-2025 rayiç)
  aciklama: string;
}

export interface BesinIhtiyaci {
  id: string;
  hayvanTipi: string; // örn. "Süt İneği (30 lt/gün)"
  canliAgirlik: number; // kg
  kuruMaddeAlimi: number; // kg KM/gün
  hamProtein: number; // % HP (KM bazında)
  metabolikEnerji: number; // Mcal/gün
  ndf: number; // % min NDF
  adf: number; // % min ADF
  kabaYemOrani: number; // % min (forage ratio)
  kalsiyum: number; // % Ca
  fosfor: number; // % P
  tuz: number; // % NaCl
  aciklama: string;
}

export interface RasyonSablonu {
  id: string;
  ad: string;
  hayvanTipi: string;
  toplamKM: number; // kg KM
  bilesim: { yemId: string; yemAd: string; miktar: number; birim: "kg" }[];
  tahminiMaliyet: number; // TL/gün
  aciklama: string;
}

export interface KaliteStandardi {
  id: string;
  parametre: string;
  birim: string;
  siniflar: { sinif: string; min?: number; max?: number; aciklama: string }[];
  mevzuat: string;
  aciklama: string;
}

export interface YemHasarTuru {
  id: string;
  baslik: string;
  aciklama: string;
  belirtiler: string[];
  gerekliDeliller: string[];
  hesaplamaYontemi: string;
  mevzuat: string;
}

export interface YemIctihat {
  daire: string;
  esas: string;
  karar: string;
  tarih: string;
  konu: string;
  ozet: string;
  anahtar: string[];
}

export interface YemAiKnowledgeItem {
  keywords: string[];
  answer: string;
  badge?: string;
}

export interface LabAnaliz {
  parametre: string;
  kisaltma: string;
  birim: string;
  yontem: string;
  aciklama: string;
  tipikAralik: string;
}

// ============================================================================
// 1. YEM HAMMADDELERI DATABASE (31 ADET)
// ============================================================================

export const YEM_HAMMADDELERI: YemHammadde[] = [
  // --- KABA YEMLER ---
  {
    id: "yonca-kuru-otu",
    ad: "Yonca Kuru Otu (1. Biçim - Çiçeklenme Başlangıcı)",
    kategori: "kaba",
    kuruMadde: 89.0,
    hamProtein: 18.5,
    hamYag: 2.3,
    hamSeluloz: 26.5,
    hamKul: 8.8,
    ndf: 43.5,
    adf: 31.8,
    metabolikEnerji: 2.18,
    kalsiyum: 1.45,
    fosfor: 0.26,
    fiyatKg: 9.20,
    aciklama: "Kaba yemlerin kraliçesi; yüksek kalsiyum ve sindirilebilir protein içeriğiyle süt sığırcılığının vazgeçilmez temel yemidir."
  },
  {
    id: "cayir-otu",
    ad: "Çayır Kuru Otu (Doğal Çayır Otu)",
    kategori: "kaba",
    kuruMadde: 88.0,
    hamProtein: 10.8,
    hamYag: 2.2,
    hamSeluloz: 29.5,
    hamKul: 7.6,
    ndf: 57.5,
    adf: 37.0,
    metabolikEnerji: 1.95,
    kalsiyum: 0.48,
    fosfor: 0.22,
    fiyatKg: 7.20,
    aciklama: "Doğal çayır ve meralardan erken dönemde biçilerek kurutulan, lif yapısı dengeli orta verimli kaba yem."
  },
  {
    id: "misir-silaji",
    ad: "Mısır Silajı (%32 KM - Hamurlanma Dönemi)",
    kategori: "kaba",
    kuruMadde: 32.5,
    hamProtein: 8.2,
    hamYag: 3.1,
    hamSeluloz: 21.0,
    hamKul: 4.4,
    ndf: 43.8,
    adf: 25.2,
    metabolikEnerji: 2.42,
    kalsiyum: 0.26,
    fosfor: 0.22,
    fiyatKg: 3.20,
    aciklama: "Yüksek nişasta ve enerji içeriğiyle ruminant rasyonlarının en ekonomik enerjik kaba yemidir; pH 3.8-4.2 aralığında olmalıdır."
  },
  {
    id: "bugday-samani",
    ad: "Buğday Samanı",
    kategori: "kaba",
    kuruMadde: 91.0,
    hamProtein: 3.8,
    hamYag: 1.4,
    hamSeluloz: 41.0,
    hamKul: 8.2,
    ndf: 75.5,
    adf: 52.5,
    metabolikEnerji: 1.38,
    kalsiyum: 0.18,
    fosfor: 0.08,
    fiyatKg: 3.20,
    aciklama: "Düşük sindirilebilirlik ve besin maddesine sahip dolgu maddesi; rasyonlarda etkin lif (peNDF) ve geviş getirmeyi tetiklemek için kullanılır."
  },
  {
    id: "arpa-samani",
    ad: "Arpa Samanı",
    kategori: "kaba",
    kuruMadde: 90.0,
    hamProtein: 4.4,
    hamYag: 1.6,
    hamSeluloz: 38.5,
    hamKul: 7.0,
    ndf: 71.0,
    adf: 48.0,
    metabolikEnerji: 1.48,
    kalsiyum: 0.24,
    fosfor: 0.10,
    fiyatKg: 3.50,
    aciklama: "Buğday samanına göre daha yumuşak dokulu ve sindirilebilirliği bir miktar daha yüksek olan tahıl samanı."
  },
  {
    id: "fig-kuru-otu",
    ad: "Fiğ Kuru Otu (Adi Fiğ)",
    kategori: "kaba",
    kuruMadde: 88.5,
    hamProtein: 16.8,
    hamYag: 2.1,
    hamSeluloz: 25.0,
    hamKul: 8.4,
    ndf: 46.0,
    adf: 33.0,
    metabolikEnerji: 2.20,
    kalsiyum: 1.25,
    fosfor: 0.28,
    fiyatKg: 8.60,
    aciklama: "Baklagil kaba yemi; protein ve kalsiyum değeri yüksek, süt ve besi hayvanlarında lezzetli tüketilen ot."
  },
  {
    id: "korunga-kuru-otu",
    ad: "Korunga Kuru Otu",
    kategori: "kaba",
    kuruMadde: 89.0,
    hamProtein: 15.4,
    hamYag: 2.3,
    hamSeluloz: 26.8,
    hamKul: 7.7,
    ndf: 47.5,
    adf: 34.5,
    metabolikEnerji: 2.14,
    kalsiyum: 1.15,
    fosfor: 0.25,
    fiyatKg: 8.50,
    aciklama: "Tannin içeriği sayesinde rumende köpüklü şişmeye (timpani) neden olmayan, kurak bölgelerin kıymetli baklagil kaba yemi."
  },
  {
    id: "sorgum-silaji",
    ad: "Sorgum Silajı (Sorgum-Sudan Otu Melezi)",
    kategori: "kaba",
    kuruMadde: 28.5,
    hamProtein: 7.4,
    hamYag: 2.1,
    hamSeluloz: 28.5,
    hamKul: 6.2,
    ndf: 54.0,
    adf: 36.2,
    metabolikEnerji: 2.08,
    kalsiyum: 0.35,
    fosfor: 0.20,
    fiyatKg: 2.70,
    aciklama: "Kuraklığa dayanıklı, mısır silajına alternatif sulu kaba yem; nişasta oranı mısıra göre daha düşüktür."
  },
  {
    id: "ryegrass-kuru-otu",
    ad: "İtalyan Çimi (Ryegrass) Kuru Otu",
    kategori: "kaba",
    kuruMadde: 88.0,
    hamProtein: 14.0,
    hamYag: 2.6,
    hamSeluloz: 24.5,
    hamKul: 8.1,
    ndf: 50.5,
    adf: 31.5,
    metabolikEnerji: 2.25,
    kalsiyum: 0.58,
    fosfor: 0.32,
    fiyatKg: 8.20,
    aciklama: "Yüksek şeker içeriği, mükemmel lezzetlilik ve hızlı rumen sindirilebilirliği ile süt verimini destekleyen buğdaygil otu."
  },
  {
    id: "pancar-posasi-silaji",
    ad: "Şeker Pancarı Posası Silajı (Preslenmiş Yaş)",
    kategori: "kaba",
    kuruMadde: 24.0,
    hamProtein: 9.8,
    hamYag: 1.2,
    hamSeluloz: 19.5,
    hamKul: 4.8,
    ndf: 44.5,
    adf: 25.5,
    metabolikEnerji: 2.65,
    kalsiyum: 0.68,
    fosfor: 0.12,
    fiyatKg: 2.40,
    aciklama: "Yüksek pektin içeriğiyle rumen pH'sını düşürmeden enerji sağlayan, süt yağını artıran lezzetli sulu yan ürün."
  },

  // --- ENERJİ KAYNAKLARI ---
  {
    id: "arpa",
    ad: "Yemlik Arpa (Ezme / Kırma)",
    kategori: "enerjik",
    kuruMadde: 88.5,
    hamProtein: 11.8,
    hamYag: 2.1,
    hamSeluloz: 5.2,
    hamKul: 2.6,
    ndf: 19.5,
    adf: 7.2,
    metabolikEnerji: 2.96,
    kalsiyum: 0.06,
    fosfor: 0.36,
    fiyatKg: 8.50,
    aciklama: "Hızlı fermente olan nişasta yapısı nedeniyle karkas randımanı ve et kalitesini artıran, besi sığırcılığının temel enerji tahılı."
  },
  {
    id: "misir",
    ad: "Dane Mısır (Kırma)",
    kategori: "enerjik",
    kuruMadde: 87.5,
    hamProtein: 8.8,
    hamYag: 3.9,
    hamSeluloz: 2.3,
    hamKul: 1.4,
    ndf: 10.8,
    adf: 3.5,
    metabolikEnerji: 3.34,
    kalsiyum: 0.03,
    fosfor: 0.28,
    fiyatKg: 8.80,
    aciklama: "En yüksek metabolik enerjiye sahip tahıl; arpadan daha yavaş rumen parçalanabilirliği ile süt ve besi rasyonlarında temel nişasta kaynağıdır."
  },
  {
    id: "bugday",
    ad: "Yemlik Buğday (Kırma)",
    kategori: "enerjik",
    kuruMadde: 88.0,
    hamProtein: 13.0,
    hamYag: 1.9,
    hamSeluloz: 2.7,
    hamKul: 1.8,
    ndf: 12.8,
    adf: 4.1,
    metabolikEnerji: 3.24,
    kalsiyum: 0.05,
    fosfor: 0.38,
    fiyatKg: 9.30,
    aciklama: "Yüksek protein ve enerji içerir; ancak rumende çok hızlı fermente olduğundan asidoz riskine karşı rasyonda %20-25'i geçmemelidir."
  },
  {
    id: "bugday-kepegi",
    ad: "Buğday Kepeği (Kaba Kepek)",
    kategori: "kesif",
    kuruMadde: 88.0,
    hamProtein: 15.2,
    hamYag: 3.8,
    hamSeluloz: 9.8,
    hamKul: 5.6,
    ndf: 41.0,
    adf: 13.5,
    metabolikEnerji: 2.44,
    kalsiyum: 0.12,
    fosfor: 1.15,
    fiyatKg: 6.60,
    aciklama: "Yüksek fosfor içeriği, lezzetliliği ve hafif laksatif etkisiyle laktasyon ve doğum öncesi rasyonlarda sık tercih edilir."
  },
  {
    id: "razmol",
    ad: "Razmol (İnce Kepek / Değirmen Artığı)",
    kategori: "kesif",
    kuruMadde: 88.0,
    hamProtein: 14.2,
    hamYag: 3.2,
    hamSeluloz: 7.2,
    hamKul: 4.3,
    ndf: 31.0,
    adf: 9.5,
    metabolikEnerji: 2.68,
    kalsiyum: 0.10,
    fosfor: 0.92,
    fiyatKg: 7.20,
    aciklama: "Kepek ile un arasında kalan, kepeğe göre enerjisi ve sindirilebilirliği daha yüksek un değirmeni yan ürünü."
  },
  {
    id: "misir-floke",
    ad: "Mısır Flake (Buharla Pişirilmiş Flake Mısır)",
    kategori: "enerjik",
    kuruMadde: 88.0,
    hamProtein: 9.2,
    hamYag: 4.1,
    hamSeluloz: 2.1,
    hamKul: 1.5,
    ndf: 9.8,
    adf: 3.1,
    metabolikEnerji: 3.50,
    kalsiyum: 0.03,
    fosfor: 0.28,
    fiyatKg: 11.20,
    aciklama: "Buharla jelatinize edilmiş mısır; nişasta sindirilebilirliği %95'in üzerindedir, yüksek verimli süt ve bitirme besi sığırlarında kullanılır."
  },
  {
    id: "melas",
    ad: "Şeker Pancarı Melası",
    kategori: "enerjik",
    kuruMadde: 74.0,
    hamProtein: 8.0,
    hamYag: 0.1,
    hamSeluloz: 0.0,
    hamKul: 10.2,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 2.70,
    kalsiyum: 0.82,
    fosfor: 0.08,
    fiyatKg: 6.50,
    aciklama: "Rasyon lezzetlendirici, toz bağlayıcı ve hızlı fermente şeker kaynağı; rasyonda %3-5 oranında katılır."
  },

  // --- PROTEİN KAYNAKLARI ---
  {
    id: "soya-kuspesi-44",
    ad: "Soya Fasulyesi Küspesi (%44 HP)",
    kategori: "proteinli",
    kuruMadde: 89.0,
    hamProtein: 44.0,
    hamYag: 1.5,
    hamSeluloz: 6.5,
    hamKul: 6.0,
    ndf: 15.0,
    adf: 10.0,
    metabolikEnerji: 2.92,
    kalsiyum: 0.32,
    fosfor: 0.65,
    fiyatKg: 18.50,
    aciklama: "Dengeli aminoasit (lizin) profili ile hayvancılıkta altın standart kabul edilen bitkisel protein kaynağı."
  },
  {
    id: "soya-kuspesi-48",
    ad: "Soya Fasulyesi Küspesi (%48 HP - Kabuksuz)",
    kategori: "proteinli",
    kuruMadde: 89.5,
    hamProtein: 48.0,
    hamYag: 1.2,
    hamSeluloz: 3.8,
    hamKul: 6.2,
    ndf: 10.2,
    adf: 6.0,
    metabolikEnerji: 3.20,
    kalsiyum: 0.28,
    fosfor: 0.68,
    fiyatKg: 20.80,
    aciklama: "Kabuğu ayrılmış yüksek proteinli ve yüksek enerjili soya küspesi; kanatlı ve yüksek verimli süt ineği rasyonlarının temelidir."
  },
  {
    id: "aycicegi-kuspesi",
    ad: "Ayçiçeği Tohumu Küspesi (%34-36 HP)",
    kategori: "proteinli",
    kuruMadde: 90.0,
    hamProtein: 34.5,
    hamYag: 1.8,
    hamSeluloz: 19.5,
    hamKul: 6.5,
    ndf: 38.0,
    adf: 25.0,
    metabolikEnerji: 2.15,
    kalsiyum: 0.38,
    fosfor: 0.95,
    fiyatKg: 11.50,
    aciklama: "Selüloz içeriği yüksek ancak metiyonin açısından zengin ekonomik protein kaynağı; ruminant rasyonlarında yaygın kullanılır."
  },
  {
    id: "pamuk-kuspesi",
    ad: "Pamuk Tohumu Küspesi (%28-30 HP)",
    kategori: "proteinli",
    kuruMadde: 90.0,
    hamProtein: 29.5,
    hamYag: 4.5,
    hamSeluloz: 18.0,
    hamKul: 6.0,
    ndf: 41.0,
    adf: 27.5,
    metabolikEnerji: 2.30,
    kalsiyum: 0.22,
    fosfor: 1.05,
    fiyatKg: 12.00,
    aciklama: "Ruminantlar için lezzetli protein ve lif kaynağı; serbest gossipol içeriği nedeniyle tek midelilere ve genç hayvanlara verilmemelidir."
  },
  {
    id: "ddgs",
    ad: "DDGS (Mısır Damıtma Artığı Kuru Çözünürleri)",
    kategori: "proteinli",
    kuruMadde: 90.5,
    hamProtein: 28.5,
    hamYag: 10.2,
    hamSeluloz: 7.8,
    hamKul: 5.2,
    ndf: 35.0,
    adf: 16.0,
    metabolikEnerji: 3.15,
    kalsiyum: 0.15,
    fosfor: 0.82,
    fiyatKg: 13.50,
    aciklama: "Biyoetanol üretimi yan ürünü; yüksek bypass protein (%55 RUP), enerji ve yağ içeriğiyle süt ve besi performansını artırır."
  },
  {
    id: "tam-yagli-soya",
    ad: "Ekstrüde Tam Yağlı Soya",
    kategori: "proteinli",
    kuruMadde: 91.0,
    hamProtein: 37.0,
    hamYag: 19.2,
    hamSeluloz: 5.2,
    hamKul: 5.4,
    ndf: 13.0,
    adf: 8.0,
    metabolikEnerji: 3.75,
    kalsiyum: 0.26,
    fosfor: 0.58,
    fiyatKg: 23.80,
    aciklama: "Ekstrüzyon ile antinutrisyonel faktörleri yok edilmiş, konsantre enerji ve protein deposu; erken laktasyon ve kanatlı yemlerinde kullanılır."
  },
  {
    id: "kanola-kuspesi",
    ad: "Kanola Küspesi (%36 HP)",
    kategori: "proteinli",
    kuruMadde: 89.5,
    hamProtein: 36.2,
    hamYag: 2.5,
    hamSeluloz: 11.8,
    hamKul: 7.2,
    ndf: 25.5,
    adf: 18.0,
    metabolikEnerji: 2.60,
    kalsiyum: 0.68,
    fosfor: 1.12,
    fiyatKg: 12.80,
    aciklama: "Soya küspesine alternatif, kükürtlü aminoasitlerce zengin ve kalsiyum-fosfor dengesi iyi olan protein küspesi."
  },

  // --- MİNERAL VE KATKI MADDELERİ ---
  {
    id: "mermer-tozu",
    ad: "Mermer Tozu (Kalsiyum Karbonat - CaCO3)",
    kategori: "mineral",
    kuruMadde: 99.5,
    hamProtein: 0.0,
    hamYag: 0.0,
    hamSeluloz: 0.0,
    hamKul: 98.5,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.0,
    kalsiyum: 38.0,
    fosfor: 0.0,
    fiyatKg: 3.00,
    aciklama: "Rasyonlarda kalsiyum ihtiyacını karşılamak için kullanılan en ucuz ve en saf kalsiyum kaynağı mineral katkı."
  },
  {
    id: "dikalsiyum-fosfat",
    ad: "Dikalsiyum Fosfat (DCP - %18 P, %24 Ca)",
    kategori: "mineral",
    kuruMadde: 97.0,
    hamProtein: 0.0,
    hamYag: 0.0,
    hamSeluloz: 0.0,
    hamKul: 96.0,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.0,
    kalsiyum: 24.0,
    fosfor: 18.0,
    fiyatKg: 26.50,
    aciklama: "Yüksek biyoyararlanıma sahip kalsiyum ve inorganik fosfor kaynağı; iskelet gelişimi ve döl verimi için zorunludur."
  },
  {
    id: "yem-tuzu",
    ad: "Yem Tuzu (Sodyum Klorür - NaCl)",
    kategori: "mineral",
    kuruMadde: 99.5,
    hamProtein: 0.0,
    hamYag: 0.0,
    hamSeluloz: 0.0,
    hamKul: 99.0,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.0,
    kalsiyum: 0.0,
    fosfor: 0.0,
    fiyatKg: 3.80,
    aciklama: "Ozmotik basınç, su tüketimi ve asit-baz dengesini sağlayan, rasyon tüketimini artıran sodyum ve klor kaynağı."
  },
  {
    id: "sodyum-bikarbonat",
    ad: "Sodyum Bikarbonat (NaHCO3 - Rumen Tamponlayıcı)",
    kategori: "katki",
    kuruMadde: 99.0,
    hamProtein: 0.0,
    hamYag: 0.0,
    hamSeluloz: 0.0,
    hamKul: 98.0,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.0,
    kalsiyum: 0.0,
    fosfor: 0.0,
    fiyatKg: 15.50,
    aciklama: "Rumen asidozunu (SARA) önleyen ve rumen pH'sını 6.0-6.8 seviyesinde tutan en yaygın tamponlayıcı (buffer) madde."
  },
  {
    id: "vitamin-mineral-premiks",
    ad: "Büyükbaş/Küçükbaş Vitamin-Mineral Premiksi (%1)",
    kategori: "katki",
    kuruMadde: 96.0,
    hamProtein: 0.0,
    hamYag: 1.0,
    hamSeluloz: 0.0,
    hamKul: 86.0,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.40,
    kalsiyum: 12.5,
    fosfor: 4.2,
    fiyatKg: 82.00,
    aciklama: "A, D3, E vitaminleri ile Zn, Mn, Cu, I, Se, Co iz minerallerini içeren konsantre koruyucu katkı paketi."
  },
  {
    id: "toksin-baglayici",
    ad: "Geniş Spektrumlu Mikotoksin Bağlayıcı (Bentonit + MOS)",
    kategori: "katki",
    kuruMadde: 93.0,
    hamProtein: 3.5,
    hamYag: 0.2,
    hamSeluloz: 0.5,
    hamKul: 76.0,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.20,
    kalsiyum: 1.8,
    fosfor: 0.20,
    fiyatKg: 88.00,
    aciklama: "Aflatoksin, Zearalenon, T-2 ve DON mikotoksinlerini sindirim kanalında bağlayarak emilimini engelleyen inorganik/organik karışım."
  },
  {
    id: "yemlik-ure",
    ad: "Yemlik Üre (%46 N - Ruminant NPN Kaynağı)",
    kategori: "proteinli",
    kuruMadde: 99.5,
    hamProtein: 287.5,
    hamYag: 0.0,
    hamSeluloz: 0.0,
    hamKul: 0.0,
    ndf: 0.0,
    adf: 0.0,
    metabolikEnerji: 0.0,
    kalsiyum: 0.0,
    fosfor: 0.0,
    fiyatKg: 24.50,
    aciklama: "Sadece gelişmiş rumene sahip sığır ve koyunlarda mikrobiyal protein sentezi için kontrollü kullanılan protein dışı azot (NPN) kaynağı."
  }
];

// ============================================================================
// 2. HAYVAN BESIN IHTIYACLARI (12 KATEGORİ)
// ============================================================================

export const HAYVAN_BESIN_IHTIYACLARI: BesinIhtiyaci[] = [
  {
    id: "sut-inek-erken",
    hayvanTipi: "Süt İneği - Erken Laktasyon (40 lt/gün)",
    canliAgirlik: 650,
    kuruMaddeAlimi: 25.5,
    hamProtein: 17.5,
    metabolikEnerji: 68.0,
    ndf: 28.0,
    adf: 19.0,
    kabaYemOrani: 42.0,
    kalsiyum: 0.85,
    fosfor: 0.45,
    tuz: 0.50,
    aciklama: "Negatif enerji dengesinin en yoğun yaşandığı dönem. Yüksek kaliteli kaba yem, bypass yağ ve bypass protein desteği şarttır."
  },
  {
    id: "sut-inek-orta",
    hayvanTipi: "Süt İneği - Orta Laktasyon (25 lt/gün)",
    canliAgirlik: 650,
    kuruMaddeAlimi: 21.0,
    hamProtein: 15.8,
    metabolikEnerji: 50.0,
    ndf: 32.0,
    adf: 22.0,
    kabaYemOrani: 48.0,
    kalsiyum: 0.70,
    fosfor: 0.38,
    tuz: 0.50,
    aciklama: "Kuru madde tüketiminin zirveye ulaştığı, verim ile kondisyonun dengelendiği istikrarlı laktasyon dönemi."
  },
  {
    id: "sut-inek-gec",
    hayvanTipi: "Süt İneği - Geç Laktasyon (15 lt/gün)",
    canliAgirlik: 650,
    kuruMaddeAlimi: 17.5,
    hamProtein: 14.0,
    metabolikEnerji: 38.0,
    ndf: 36.0,
    adf: 24.0,
    kabaYemOrani: 58.0,
    kalsiyum: 0.60,
    fosfor: 0.32,
    tuz: 0.45,
    aciklama: "Verimin azaldığı ve hayvanın sonraki laktasyon için vücut kondisyon skoru (VKS 3.25-3.50) toparladığı dönem."
  },
  {
    id: "sut-inek-kuru",
    hayvanTipi: "Süt İneği - Kuru Dönem (Far-off, 60-21 gün kala)",
    canliAgirlik: 680,
    kuruMaddeAlimi: 13.0,
    hamProtein: 12.2,
    metabolikEnerji: 24.5,
    ndf: 45.0,
    adf: 30.0,
    kabaYemOrani: 72.0,
    kalsiyum: 0.45,
    fosfor: 0.28,
    tuz: 0.35,
    aciklama: "Meme dokusunun yenilendiği dönem; doğum felcini (hipokalsemi) önlemek için kalsiyum alımı kısıtlanmalı, DCAD dengelenmelidir."
  },
  {
    id: "besi-baslangic",
    hayvanTipi: "Besi Sığırı - Başlangıç Dönemi (200 kg CA)",
    canliAgirlik: 200,
    kuruMaddeAlimi: 6.0,
    hamProtein: 15.5,
    metabolikEnerji: 16.0,
    ndf: 30.0,
    adf: 20.0,
    kabaYemOrani: 40.0,
    kalsiyum: 0.70,
    fosfor: 0.35,
    tuz: 0.35,
    aciklama: "İskelet ve kas çatısının hızla geliştiği dönem. Protein kalitesi ve sindirilebilir kaba yem oranı yüksek tutulmalıdır."
  },
  {
    id: "besi-gelistirme",
    hayvanTipi: "Besi Sığırı - Geliştirme Dönemi (350 kg CA)",
    canliAgirlik: 350,
    kuruMaddeAlimi: 9.0,
    hamProtein: 14.0,
    metabolikEnerji: 24.5,
    ndf: 25.0,
    adf: 17.0,
    kabaYemOrani: 28.0,
    kalsiyum: 0.60,
    fosfor: 0.30,
    tuz: 0.35,
    aciklama: "Günlük canlı ağırlık artışının (GCAA 1.4-1.6 kg) en yüksek olduğu verimli büyüme evresi."
  },
  {
    id: "besi-bitirme",
    hayvanTipi: "Besi Sığırı - Bitirme Dönemi (500 kg CA)",
    canliAgirlik: 500,
    kuruMaddeAlimi: 11.2,
    hamProtein: 12.5,
    metabolikEnerji: 32.0,
    ndf: 21.0,
    adf: 15.0,
    kabaYemOrani: 16.0,
    kalsiyum: 0.50,
    fosfor: 0.28,
    tuz: 0.35,
    aciklama: "Karkas yağlanması ve mermerleşmenin tamamlandığı son 60-90 gün; asidoz riskine karşı tamponlayıcılar ihmal edilmemelidir."
  },
  {
    id: "koyun-gebelik-son",
    hayvanTipi: "Koyun - Gebelik Son Dönem (İkiz Gebe, 65 kg)",
    canliAgirlik: 65,
    kuruMaddeAlimi: 2.0,
    hamProtein: 14.0,
    metabolikEnerji: 4.8,
    ndf: 35.0,
    adf: 24.0,
    kabaYemOrani: 52.0,
    kalsiyum: 0.65,
    fosfor: 0.35,
    tuz: 0.40,
    aciklama: "Fötusların %70'inin büyüdüğü ve rumen hacminin daraldığı son 6 hafta. Gebelik toksemisini (ikiz kuzu hastalığı) önlemek için kesif yem artırılmalıdır."
  },
  {
    id: "koyun-laktasyon",
    hayvanTipi: "Koyun - Laktasyon Dönemi (İkiz Emziren, 65 kg)",
    canliAgirlik: 65,
    kuruMaddeAlimi: 2.6,
    hamProtein: 15.8,
    metabolikEnerji: 6.6,
    ndf: 32.0,
    adf: 22.0,
    kabaYemOrani: 46.0,
    kalsiyum: 0.75,
    fosfor: 0.40,
    tuz: 0.45,
    aciklama: "Kuzu gelişimini ve süt verimini desteklemek amacıyla yüksek kaliteli yonca ve tahıl ezmesi içeren konsantre besleme gerekir."
  },
  {
    id: "koyun-idame",
    hayvanTipi: "Koyun - İdame Dönemi (Kuru / Boş Koyun, 60 kg)",
    canliAgirlik: 60,
    kuruMaddeAlimi: 1.35,
    hamProtein: 10.0,
    metabolikEnerji: 2.8,
    ndf: 50.0,
    adf: 32.0,
    kabaYemOrani: 75.0,
    kalsiyum: 0.40,
    fosfor: 0.25,
    tuz: 0.30,
    aciklama: "Mera veya ucuz kaba yem ağırlıklı beslemeyle vücut ağırlığının sabit tutulduğu dinlenme evresi."
  },
  {
    id: "keci-sut-3lt",
    hayvanTipi: "Süt Keçisi - Laktasyon (3 lt Süt, 60 kg)",
    canliAgirlik: 60,
    kuruMaddeAlimi: 2.8,
    hamProtein: 16.0,
    metabolikEnerji: 7.4,
    ndf: 32.0,
    adf: 22.0,
    kabaYemOrani: 45.0,
    kalsiyum: 0.80,
    fosfor: 0.42,
    tuz: 0.45,
    aciklama: "Keçilerin seçici yeme davranışı göz önünde bulundurularak homojen TMR rasyonu ve kaliteli yapraklı kaba yem sunulmalıdır."
  },
  {
    id: "keci-idame",
    hayvanTipi: "Keçi - İdame Dönemi (Kuru / Boş Keçi, 55 kg)",
    canliAgirlik: 55,
    kuruMaddeAlimi: 1.25,
    hamProtein: 9.5,
    metabolikEnerji: 2.6,
    ndf: 50.0,
    adf: 34.0,
    kabaYemOrani: 80.0,
    kalsiyum: 0.40,
    fosfor: 0.24,
    tuz: 0.30,
    aciklama: "Çalı, mera ve kaba yem sindirimi yüksek olan keçilerin vücut kondisyonunu korumaya yönelik temel besleme."
  }
];

// ============================================================================
// 3. RASYON SABLONLARI (6 ADET)
// ============================================================================

export const RASYON_SABLONLARI: RasyonSablonu[] = [
  {
    id: "rasyon-sut-yuksek",
    ad: "Yüksek Verimli Süt İneği TMR Rasyonu (30+ lt/gün)",
    hayvanTipi: "Süt İneği (650 kg CA, 32-35 lt süt)",
    toplamKM: 24.8,
    bilesim: [
      { yemId: "misir-silaji", yemAd: "Mısır Silajı", miktar: 22.0, birim: "kg" },
      { yemId: "yonca-kuru-otu", yemAd: "Yonca Kuru Otu", miktar: 4.5, birim: "kg" },
      { yemId: "bugday-samani", yemAd: "Buğday Samanı", miktar: 1.0, birim: "kg" },
      { yemId: "misir", yemAd: "Dane Mısır (Kırma)", miktar: 4.0, birim: "kg" },
      { yemId: "arpa", yemAd: "Yemlik Arpa (Ezme)", miktar: 3.0, birim: "kg" },
      { yemId: "soya-kuspesi-48", yemAd: "Soya Küspesi (%48 HP)", miktar: 3.2, birim: "kg" },
      { yemId: "pamuk-kuspesi", yemAd: "Pamuk Tohumu Küspesi", miktar: 1.5, birim: "kg" },
      { yemId: "mermer-tozu", yemAd: "Mermer Tozu (CaCO3)", miktar: 0.2, birim: "kg" },
      { yemId: "yem-tuzu", yemAd: "Yem Tuzu", miktar: 0.1, birim: "kg" },
      { yemId: "sodyum-bikarbonat", yemAd: "Sodyum Bikarbonat", miktar: 0.15, birim: "kg" },
      { yemId: "vitamin-mineral-premiks", yemAd: "Vitamin-Mineral Premiksi", miktar: 0.15, birim: "kg" },
      { yemId: "toksin-baglayici", yemAd: "Toksin Bağlayıcı", miktar: 0.05, birim: "kg" }
    ],
    tahminiMaliyet: 254.80,
    aciklama: "Homojen karma (TMR) esasına göre hazırlanmış, %17.6 ham protein ve 69.2 Mcal metabolik enerji sağlayan profesyonel süt rasyonu."
  },
  {
    id: "rasyon-sut-orta",
    ad: "Orta Verimli Süt İneği Rasyonu (20 lt/gün)",
    hayvanTipi: "Süt İneği (600 kg CA, 20-22 lt süt)",
    toplamKM: 19.4,
    bilesim: [
      { yemId: "misir-silaji", yemAd: "Mısır Silajı", miktar: 18.0, birim: "kg" },
      { yemId: "cayir-otu", yemAd: "Çayır Kuru Otu", miktar: 3.0, birim: "kg" },
      { yemId: "bugday-samani", yemAd: "Buğday Samanı", miktar: 2.0, birim: "kg" },
      { yemId: "arpa", yemAd: "Yemlik Arpa", miktar: 3.5, birim: "kg" },
      { yemId: "misir", yemAd: "Dane Mısır", miktar: 2.0, birim: "kg" },
      { yemId: "aycicegi-kuspesi", yemAd: "Ayçiçeği Küspesi (%34 HP)", miktar: 2.8, birim: "kg" },
      { yemId: "bugday-kepegi", yemAd: "Buğday Kepeği", miktar: 1.5, birim: "kg" },
      { yemId: "mermer-tozu", yemAd: "Mermer Tozu", miktar: 0.15, birim: "kg" },
      { yemId: "yem-tuzu", yemAd: "Yem Tuzu", miktar: 0.1, birim: "kg" },
      { yemId: "vitamin-mineral-premiks", yemAd: "Vitamin-Mineral Premiksi", miktar: 0.1, birim: "kg" }
    ],
    tahminiMaliyet: 172.40,
    aciklama: "Orta ölçekli aile işletmeleri için maliyet/verim optimizasyonu yapılmış, %15.4 ham protein içeren ekonomik rasyon."
  },
  {
    id: "rasyon-besi-bitirme",
    ad: "Besi Sığırı Yoğun Bitirme Rasyonu (500 kg CA)",
    hayvanTipi: "Besi Danası (500 kg CA, 1.5 kg GCAA)",
    toplamKM: 11.4,
    bilesim: [
      { yemId: "bugday-samani", yemAd: "Buğday Samanı", miktar: 1.5, birim: "kg" },
      { yemId: "misir-silaji", yemAd: "Mısır Silajı", miktar: 4.0, birim: "kg" },
      { yemId: "misir", yemAd: "Dane Mısır (Kırma)", miktar: 4.5, birim: "kg" },
      { yemId: "arpa", yemAd: "Yemlik Arpa (Ezme)", miktar: 3.0, birim: "kg" },
      { yemId: "aycicegi-kuspesi", yemAd: "Ayçiçeği Küspesi", miktar: 1.8, birim: "kg" },
      { yemId: "ddgs", yemAd: "Mısır DDGS", miktar: 1.2, birim: "kg" },
      { yemId: "mermer-tozu", yemAd: "Mermer Tozu", miktar: 0.12, birim: "kg" },
      { yemId: "sodyum-bikarbonat", yemAd: "Sodyum Bikarbonat", miktar: 0.08, birim: "kg" },
      { yemId: "yem-tuzu", yemAd: "Yem Tuzu", miktar: 0.06, birim: "kg" },
      { yemId: "vitamin-mineral-premiks", yemAd: "Vitamin-Mineral Premiksi", miktar: 0.06, birim: "kg" }
    ],
    tahminiMaliyet: 144.50,
    aciklama: "Yüksek karkas randımanı ve hızlı kilo artışı sağlayan, asidoz emniyet payı tamponlayıcı ile desteklenmiş bitirme besisi rasyonu."
  },
  {
    id: "rasyon-koyun-gebelik",
    ad: "Koyun Gebelik Sonu Rasyonu (İkiz Gebe, 65 kg)",
    hayvanTipi: "Koyun (65 kg CA, son 6 hafta)",
    toplamKM: 1.95,
    bilesim: [
      { yemId: "yonca-kuru-otu", yemAd: "Yonca Kuru Otu", miktar: 1.0, birim: "kg" },
      { yemId: "fig-kuru-otu", yemAd: "Fiğ Kuru Otu", miktar: 0.6, birim: "kg" },
      { yemId: "bugday-samani", yemAd: "Buğday Samanı", miktar: 0.2, birim: "kg" },
      { yemId: "arpa", yemAd: "Yemlik Arpa", miktar: 0.55, birim: "kg" },
      { yemId: "soya-kuspesi-44", yemAd: "Soya Küspesi (%44 HP)", miktar: 0.15, birim: "kg" },
      { yemId: "mermer-tozu", yemAd: "Mermer Tozu", miktar: 0.015, birim: "kg" },
      { yemId: "yem-tuzu", yemAd: "Yem Tuzu", miktar: 0.01, birim: "kg" },
      { yemId: "vitamin-mineral-premiks", yemAd: "Vitamin-Mineral Premiksi", miktar: 0.015, birim: "kg" }
    ],
    tahminiMaliyet: 24.80,
    aciklama: "İkiz kuzu gebeliğinde ketozis ve gebelik toksemisini engelleyen, fötal gelişimi ve kolostrum kalitesini artıran dengeli koyun rasyonu."
  },
  {
    id: "rasyon-keci-sut",
    ad: "Yüksek Verimli Süt Keçisi Rasyonu (3 lt Süt)",
    hayvanTipi: "Süt Keçisi (Saanen/Alpin, 60 kg CA)",
    toplamKM: 2.75,
    bilesim: [
      { yemId: "yonca-kuru-otu", yemAd: "Yonca Kuru Otu", miktar: 1.2, birim: "kg" },
      { yemId: "ryegrass-kuru-otu", yemAd: "Ryegrass Kuru Otu", miktar: 0.8, birim: "kg" },
      { yemId: "pancar-posasi-silaji", yemAd: "Pancar Posası Silajı", miktar: 2.0, birim: "kg" },
      { yemId: "arpa", yemAd: "Yemlik Arpa (Ezme)", miktar: 0.7, birim: "kg" },
      { yemId: "misir-floke", yemAd: "Mısır Flake", miktar: 0.4, birim: "kg" },
      { yemId: "soya-kuspesi-48", yemAd: "Soya Küspesi (%48 HP)", miktar: 0.35, birim: "kg" },
      { yemId: "mermer-tozu", yemAd: "Mermer Tozu", miktar: 0.02, birim: "kg" },
      { yemId: "yem-tuzu", yemAd: "Yem Tuzu", miktar: 0.015, birim: "kg" },
      { yemId: "vitamin-mineral-premiks", yemAd: "Vitamin-Mineral Premiksi", miktar: 0.02, birim: "kg" }
    ],
    tahminiMaliyet: 34.20,
    aciklama: "Pancar posası ve kaliteli kuru otlarla desteklenen, süt yağını ve süt proteinini artıran lezzetli keçi rasyonu."
  },
  {
    id: "rasyon-etlik-pilic-buyutme",
    ad: "Etlik Piliç (Broiler) Büyütme Yemi Formülü (100 kg Formül)",
    hayvanTipi: "Etlik Piliç (15-35. Gün Büyütme Dönemi)",
    toplamKM: 89.2,
    bilesim: [
      { yemId: "misir", yemAd: "Dane Mısır (Öğütülmüş)", miktar: 56.5, birim: "kg" },
      { yemId: "soya-kuspesi-48", yemAd: "Soya Küspesi (%48 HP)", miktar: 30.5, birim: "kg" },
      { yemId: "tam-yagli-soya", yemAd: "Ekstrüde Tam Yağlı Soya", miktar: 5.0, birim: "kg" },
      { yemId: "dikalsiyum-fosfat", yemAd: "Dikalsiyum Fosfat (DCP)", miktar: 1.8, birim: "kg" },
      { yemId: "mermer-tozu", yemAd: "Mermer Tozu", miktar: 1.2, birim: "kg" },
      { yemId: "yem-tuzu", yemAd: "Yem Tuzu", miktar: 0.35, birim: "kg" },
      { yemId: "vitamin-mineral-premiks", yemAd: "Kanatlı Premiksi + Enzim + Lizin/Metiyonin", miktar: 1.2, birim: "kg" },
      { yemId: "toksin-baglayici", yemAd: "Toksin Bağlayıcı", miktar: 0.25, birim: "kg" },
      { yemId: "melas", yemAd: "Yemlik Yağ / Melas Karışımı", miktar: 3.2, birim: "kg" }
    ],
    tahminiMaliyet: 1685.00,
    aciklama: "100 kg fabrika karma yem formülasyonu bazında; %21.5 ham protein ve 3150 kcal/kg ME içeren broiler büyütme yemi (kg maliyeti ~16.85 TL)."
  }
];

// ============================================================================
// 4. YEM KALITE VE MEVZUAT STANDARTLARI
// ============================================================================

export const YEM_KALITE_STANDARTLARI: KaliteStandardi[] = [
  {
    id: "std-aflatoksin-b1",
    parametre: "Aflatoksin B1",
    birim: "mg/kg (ppm) / [µg/kg (ppb)]",
    siniflar: [
      { sinif: "Süt Veren Hayvan Karma Yemleri", max: 0.005, aciklama: "5 ppb (0.005 mg/kg) - Süte Aflatoksin M1 geçişini engellemek için en katı yasal sınır." },
      { sinif: "Buzağı ve Kuzu Karma Yemleri", max: 0.010, aciklama: "10 ppb (0.010 mg/kg) - Genç ruminant hassasiyeti ve bağışıklık baskılanması limiti." },
      { sinif: "Sığır Besi Karma Yemleri", max: 0.020, aciklama: "20 ppb (0.020 mg/kg) - Yetişkin besi sığırları için kabul edilebilir üst yasal sınır." },
      { sinif: "Kanatlı Karma Yemleri", max: 0.020, aciklama: "20 ppb (0.020 mg/kg) - Broiler ve yumurtacı tavuklar için yasal tolerans limiti." },
      { sinif: "Yem Hammaddeleri (Tahıllar, Küspeler)", max: 0.020, aciklama: "20 ppb (0.020 mg/kg) - İthalat ve piyasaya arz yasal sınır eşiği." }
    ],
    mevzuat: "Yemlerde İstenmeyen Maddeler Tebliği (Resmi Gazete No: 28977)",
    aciklama: "Aspergillus flavus ve A. parasiticus tarafından üretilen kanserojen ve karaciğer hasarı yapan mikotoksin. Süt ineklerinde süte M1 olarak geçer."
  },
  {
    id: "std-toplam-aflatoksin",
    parametre: "Toplam Aflatoksin (B1 + B2 + G1 + G2)",
    birim: "mg/kg (ppm)",
    siniflar: [
      { sinif: "İthalat ve Yurt İçi Hammadde Kabulü", max: 0.040, aciklama: "40 ppb (0.040 mg/kg) - Toplam aflatoksin yasal sınır baremi." },
      { sinif: "Tam Yem Karışımları", max: 0.020, aciklama: "20 ppb (0.020 mg/kg) - Nihai tüketim tolerans seviyesi." }
    ],
    mevzuat: "Türk Gıda Kodeksi ve Yem Hijyeni Yönetmeliği",
    aciklama: "Tüm aflatoksin fraksiyonlarının toplamı; özellikle sıcak ve nemli depolama koşullarında mısır, pamuk tohumu ve yerfıstığında artar."
  },
  {
    id: "std-deoksinivalenol",
    parametre: "Deoksinivalenol (DON / Vomitoksin)",
    birim: "mg/kg (ppm)",
    siniflar: [
      { sinif: "Tahıl ve Tahıl Ürünleri", max: 8.0, aciklama: "8 mg/kg - Hammadde tolerans sınırı." },
      { sinif: "Buzağı Karma Yemi", max: 2.0, aciklama: "2 mg/kg - Genç ruminant hassasiyeti sınırı." },
      { sinif: "Yetişkin Sığır Karma Yemleri", max: 5.0, aciklama: "5 mg/kg - Rumen mikroorganizmaları DON'u kısmen detoksifiye edebilir." },
      { sinif: "Kanatlı Karma Yemleri", max: 5.0, aciklama: "5 mg/kg - Yem tüketiminde düşüş ve bağışıklık gerilemesi eşiği." }
    ],
    mevzuat: "2006/576/EC AB Tavsiye Kararı & Yem Tebliği",
    aciklama: "Fusarium mantarları tarafından üretilir; yem tüketimini dramatik düşürür, kusma, sindirim kanalı yangısı ve bağışıklık çöküşüne yol açar."
  },
  {
    id: "std-zearalenon",
    parametre: "Zearalenon (ZEN)",
    birim: "mg/kg (ppm)",
    siniflar: [
      { sinif: "Tahıllar ve Mısır Yan Ürünleri", max: 2.0, aciklama: "2 mg/kg - Hammadde üst limiti." },
      { sinif: "Düve ve Damızlık Süt İneği Yemleri", max: 0.5, aciklama: "0.5 mg/kg - Östrojenik etki, kızgınlık düzensizliği, kist ve yavru atma riski." },
      { sinif: "Besi Sığırı Yemleri", max: 1.0, aciklama: "1.0 mg/kg - Besi performansını ve karkas kalitesini etkileme sınırı." }
    ],
    mevzuat: "Yemlerde İstenmeyen Maddeler Tebliği",
    aciklama: "Östrojen benzeri etki gösteren mikotoksindir. Vulvada şişme, vajinal prolapsus, yalancı kızgınlık, embriyonik ölüm ve aborta neden olur."
  },
  {
    id: "std-okratoksin-a",
    parametre: "Okratoksin A (OTA)",
    birim: "mg/kg (ppm)",
    siniflar: [
      { sinif: "Tahıllar ve Tahıl Türevleri", max: 0.25, aciklama: "0.25 mg/kg (250 ppb) - Hammadde kabul limiti." },
      { sinif: "Kanatlı Karma Yemleri", max: 0.10, aciklama: "0.10 mg/kg (100 ppb) - Kanatlılarda nefrotoksisite ve mortalite riski." },
      { sinif: "Ruminant Karma Yemleri", max: 0.20, aciklama: "0.20 mg/kg (200 ppb) - Böbrek ve karaciğer fonksiyonu hasar eşiği." }
    ],
    mevzuat: "Yem Mevzuatı ve FAO/WHO Standartları",
    aciklama: "Penicillium ve Aspergillus türleri üretir. Şiddetli nefrotoksiktir (böbrek hasarı), su tüketimini aşırı artırır ve bağışıklık sistemini baskılar."
  },
  {
    id: "std-fumonisin",
    parametre: "Fumonisin (B1 + B2)",
    birim: "mg/kg (ppm)",
    siniflar: [
      { sinif: "Mısır ve Mısır Yan Ürünleri", max: 60.0, aciklama: "60 mg/kg - Mısır hammadde tolerans sınırı." },
      { sinif: "At ve Tek Tırnaklı Karma Yemleri", max: 5.0, aciklama: "5 mg/kg - Atlarda ölümcül Lökoensefalomalazi (ELEM) riski!" },
      { sinif: "Yetişkin Sığır Karma Yemleri", max: 50.0, aciklama: "50 mg/kg - Karaciğer lezyonları ve süt verim kaybı sınırı." },
      { sinif: "Kanatlı Karma Yemleri", max: 20.0, aciklama: "20 mg/kg - Bağışıklık baskılanması ve büyüme geriliği." }
    ],
    mevzuat: "Resmi Gazete No: 28977 & AB Direktifleri",
    aciklama: "Fusarium verticillioides mantarınca mısırda üretilir. Tek tırnaklılarda beyin erimesi (ELEM), ruminantlarda hepatotoksisite yapar."
  },
  {
    id: "std-adl",
    parametre: "Asit Deterjan Lignin (ADL)",
    birim: "% (KM bazında)",
    siniflar: [
      { sinif: "Mükemmel Kaba Yem", max: 4.0, aciklama: "ADL < %4.0 - Yüksek sindirilebilirlik ve lezzetlilik." },
      { sinif: "İyi / Orta Kalite Kaba Yem", min: 4.1, max: 7.5, aciklama: "ADL %4.1-7.5 - Normal yonca ve çayır kuru otları." },
      { sinif: "Düşük Kalite Kaba Yem (Saman vb.)", min: 7.6, aciklama: "ADL > %7.6 - Hücre çeperi odunlaşmış, sindirilebilirlik son derece düşük." }
    ],
    mevzuat: "Van Soest Lif Analiz Metodolojisi / TSE 9620",
    aciklama: "Bitki hücre çeperinin sindirilemeyen sert lignin fraksiyonudur. ADL yükseldikçe selüloz ve hemiselüloz sindirilebilirliği çöker."
  },
  {
    id: "std-nem-orani",
    parametre: "Nem Oranı (Rutubet)",
    birim: "%",
    siniflar: [
      { sinif: "Fabrika Pelet ve Toz Karma Yemleri", max: 13.0, aciklama: "Maksimum %12.5-13.0 - Üzeri depoda kızışma ve küflenmeye yol açar." },
      { sinif: "Balya Kuru Otlar (Yonca, Saman)", max: 15.0, aciklama: "Maksimum %14.0-15.0 - Nemli balyalanırsa içten içe yanar ve küflenir." },
      { sinif: "Mısır Silajı (İdeal Fermantasyon)", min: 65.0, max: 70.0, aciklama: "İdeal %65-68. %72 üzeri sızıntı ve çürüme; %62 altı sıkışmama ve küflenme." }
    ],
    mevzuat: "TSE 8998 Karma Yem Standardı & Yem Yönetmeliği",
    aciklama: "Yemin raf ömrünü, biyolojik stabilitesini ve küf mantarlarının üremesini belirleyen birincil fiziksel parametre."
  },
  {
    id: "std-ure-azotu",
    parametre: "Yem Üresi ve NPN Sınırları",
    birim: "% / [mg/dL sütte]",
    siniflar: [
      { sinif: "Ruminant Karma Fabrika Yemleri", max: 1.5, aciklama: "Maksimum %1.0-1.5 üre (Rasyonda toplam ham proteinin en fazla %30'u NPN kaynaklı olabilir)." },
      { sinif: "Süt Üre Azotu (MUN - Bireysel/Tank)", min: 10.0, max: 14.0, aciklama: "İdeal 10-14 mg/dL. <10 protein yetersizliği; >16 karaciğer yükü ve döl tutmama." },
      { sinif: "Tek Mideliler ve Genç Ruminantlar", max: 0.0, aciklama: "0.0 - At, kanatlı ve 4 aydan küçük buzağı yemlerine üre katılması KESİNLİKLE YASAKTIR." }
    ],
    mevzuat: "5996 Sayılı Kanun & Yem Katkı Maddeleri Yönetmeliği",
    aciklama: "NPN (protein dışı azot) maddeleri rumende hızlıca amonyağa döner. Fazlası akut amonyak zehirlenmesine, beyin ödemine ve ölüme yol açar."
  },
  {
    id: "std-kuflu-yem",
    parametre: "Küflü Yem ve Mikolojik Kalite (Toplam Küf/Maya)",
    birim: "CFU/g (Koloni Oluşturan Birim)",
    siniflar: [
      { sinif: "İyi / Temiz Yem", max: 10000, aciklama: "< 10^4 CFU/g - Normal mikolojik yük, hayvan besleme için güvenli." },
      { sinif: "Kuşkulu / Riskli Yem", min: 10000, max: 1000000, aciklama: "10^4 - 10^6 CFU/g - Mikotoksin varlığı araştırılmalı, toksin bağlayıcı şart." },
      { sinif: "Bozuk / Tüketilemez Yem", min: 1000000, aciklama: "> 10^6 CFU/g - Kesinlikle yedirilmemeli, doğrudan imha edilmelidir." }
    ],
    mevzuat: "ISO 21527 Mikrobiyoloji & TSE Yem Hijyeni",
    aciklama: "Küf sporu yoğunluğu yemin fermantasyon bozukluğunu, yanlış depolamayı ve mikotoksin riskinin ciddiyetini gösterir."
  }
];

// ============================================================================
// 5. YEM HASAR TURLERI (8 KATEGORİ)
// ============================================================================

export const YEM_HASAR_TURLERI: YemHasarTuru[] = [
  {
    id: "hasar-aflatoksin",
    baslik: "Aflatoksinli Yem Kaynaklı Süt İneği Verim Kaybı ve Süt İtlafı",
    aciklama: "Yem fabrikasından veya tedarikçiden alınan karma yem/küspede yasal sınırın (5 ppb) üzerinde Aflatoksin B1 bulunması sonucu hayvanların karaciğer hasarına uğraması, süt veriminin düşmesi ve üretilen süte Aflatoksin M1 geçerek sütün toptancı/süt fabrikasınca imha edilmesi zararı.",
    belirtiler: [
      "Çiğ süt analizlerinde Aflatoksin M1 tespit edilerek sütün dökülmesi/reddedilmesi",
      "Sürü genelinde günlük süt veriminde ani %15-35 oranında düşüş",
      "Yem tüketiminde iştahsızlık ve rasyon seçme eğilimi",
      "Karaciğer yetmezliği bulguları (sarılık, kanda AST, GGT ve Bilirubin artışı)",
      "Bağışıklık baskılanması nedeniyle mastitis ve metritis vakalarında patlama"
    ],
    gerekliDeliller: [
      "Yem partisinden usulüne uygun alınmış akredite laboratuvar analiz raporu (Aflatoksin B1)",
      "Süt toplama merkezinin süt red/imha tutanağı ve süte ait Aflatoksin M1 analiz raporu",
      "Yem alım faturaları, irsaliyeleri ve yem çuval etiketleri (lot/parti no)",
      "Veteriner hekim sürü muayene ve kan biyokimya raporları (AST, GGT)",
      "İşletmenin geçmiş 3-6 aylık günlük süt döküm/fatura kayıtları"
    ],
    hesaplamaYontemi: "İmha edilen süt bedeli + Emsal verim kaybı farkı (günlük litre farkı x gün x süt fiyatı) + Hayvan başına uygulanan karaciğer destekleyici veteriner tedavi masrafları.",
    mevzuat: "5996 Sayılı Kanun m.24, 25; Türk Gıda Kodeksi Bulaşanlar Yönetmeliği; TBK m.219 (Ayıptan Doğan Sorumluluk)."
  },
  {
    id: "hasar-bozuk-silaj",
    baslik: "Küflü ve Bozuk Silaj Kaynaklı Hayvan Telefi ve Abort (Listerioz / Mikotoksikoz)",
    aciklama: "Yetersiz sıkıştırma, delik naylon veya aşırı rutubet nedeniyle bütrik asit fermantasyonuna uğramış, küflenmiş veya pH'sı 5.0'ın üzerine çıkmış silajın yedirilmesi neticesinde Listeria monocytogenes enfeksiyonu ve ölümcül mikotoksikozis gelişmesi.",
    belirtiler: [
      "Hayvanlarda tek taraflı yüz felci, kulak düşmesi, salya akıntısı ve daire çizerek yürüme (Listerioz / Daire Hastalığı)",
      "Gebe inek ve koyunlarda salgın boyutunda yavru atma (abort) ve yavru zarlarının atılamaması",
      "Şiddetli karın ağrısı, kanlı ishal ve yüksek ateş",
      "Kısa sürede koma ve %60-80 oranında mortalite"
    ],
    gerekliDeliller: [
      "Veteriner hekim nekropsi/otopsi tutanağı (beyin dokusunda mikroabseler, karaciğer nekrozu)",
      "Veteriner Kontrol Enstitüsü bakteriyolojik ve patolojik teşhis raporu (L. monocytogenes izolasyonu)",
      "Silaj çukuru/balyasından alınan numunenin pH, organik asit ve mikotoksin analiz raporu",
      "Silaj alım faturası veya fason üretim sözleşmesi",
      "Telef olan hayvanların kulak küpesi ve TÜRKVET ölüm düşüm kayıtları"
    ],
    hesaplamaYontemi: "Telef olan hayvanların karkas/canlı piyasa rayiç değeri + Atılan yavruların damızlık değer kaybı + Tedavi ve ilaç masrafları.",
    mevzuat: "6098 Sayılı TBK m.49, m.112; 5996 Sayılı Veteriner Hizmetleri, Bitki Sağlığı, Gıda ve Yem Kanunu m.26."
  },
  {
    id: "hasar-yabanci-madde",
    baslik: "Yabancı Madde Karışımı (Tel, Çivi, Metal Talaşı) ve Retikuloperitonit (RPT)",
    aciklama: "Satın alınan saman, yonca balyası veya fabrika yemine üretim ve paketleme esnasında tel, çivi, metal cıvata gibi delici yabancı maddelerin karışması sonucu hayvanların işkembesini (retikulum) delerek kalp zarı iltihabı (Travmatik Retikuloperikardit - TRP) ve ani telefe yol açması.",
    belirtiler: [
      "Hayvanın sırtını kamburlaştırması, inlemesi ve adım atmaktan kaçınması",
      "Rumen hareketlerinin tamamen durması ve hafif timpani (şişkinlik)",
      "Venöz dolgunluk (boyun juguler veninde genişleme ve nabız) ve kalp seslerinin derinden gelmesi",
      "Mecburi kesim veya septik peritonit nedeniyle ani ölüm"
    ],
    gerekliDeliller: [
      "Kesimhane veya veteriner hekim otopsi raporunda yabancı cismin fotoğraflanması ve delinen organ tespiti",
      "İçinden yabancı madde çıkan yem partisinin/balyalarının fotoğrafları ve keşif zaptı",
      "İşletmede kullanılan mıknatısların kontrol tutanağı",
      "Yem tedarik faturası ve teslim tesellüm tutanağı",
      "Mezbaha mecburi kesim karkas değerlendirme veya imha tutanağı"
    ],
    hesaplamaYontemi: "Hayvanın tam damızlık/sağmal değeri - (varsa mecburi kesim kavurma/et bedeli) + Tedavi masrafları.",
    mevzuat: "TBK m.219 (Ayıplı İfa), m.49 (Haksız Fiil); Yem Hijyeni Yönetmeliği m.8."
  },
  {
    id: "hasar-asidoz-ketoz",
    baslik: "Yanlış Rasyon ve Formülasyon Kaynaklı Akut Rumen Asidozu ve Ketozis",
    aciklama: "Yem fabrikasının tavsiye ettiği rasyon formülünün veya hatalı pelet yem içeriğinin aşırı fermente olabilir nişasta içermesi, kaba yem/etkin lif (peNDF) dengesinin gözetilmemesi sonucu rumen pH'sının 5.0'ın altına düşerek akut laktik asidoz ve sürünün toplu telefi veya laminitis ile sakatlanması.",
    belirtiler: [
      "Yemlemeden 12-24 saat sonra toplu yatma, inleme, diş gıcırdatma ve şiddetli dehidrasyon",
      "Sulu, köpüklü, gri-sarı renkli ve ekşi kokulu yoğun ishal",
      "Rumen sıvısı pH ölçümünde < 5.2 tespit edilmesi",
      "Ayaklarda tırnak yangısı (akut laminitis), tırnak dökülmesi ve ayağa kalkamama"
    ],
    gerekliDeliller: [
      "Yemin laboratuvar nişasta, şeker, NDF ve ADF analiz sonuçları",
      "İşletmede uygulanan rasyon reçetesi ve yem fabrikası teknik servis besleme tavsiye tutanağı",
      "Veteriner hekim rumen sıvısı analizi (pH ve mikroskopik protozoa muayenesi)",
      "Veteriner nekropsi tutanağında rumen papillalarında erime ve nekroz tespiti",
      "Hasta ve telef olan hayvanların TÜRKVET dökümü"
    ],
    hesaplamaYontemi: "Telef olan hayvanların tam rayici + Laminitis nedeniyle erken kasaplığa sevk edilen hayvanların damızlık değer kaybı + Verim düşüklüğü zararı.",
    mevzuat: "TBK m.112 (Gereği Gibi İfa Etmeme), HMK m.266 Bilirkişi İncelemesi."
  },
  {
    id: "hasar-iyonofor-zehirlenme",
    baslik: "İyonofor / Koksidiostatik (Salinomisin, Monensin) Zehirlenmesi (At ve Hassas Türler)",
    aciklama: "Sığır veya kanatlı yemlerinde koksidiyoz önleyici veya besi büyüme faktörü olarak kullanılan iyonofor antibiyotiklerin (monensin, salinomisin, lazalosid) üretim hattı bulaşması veya yanlış sevk sonucu at, eşek veya koyun yemine karışmasıyla gelişen ölümcül miyokardiyal toksikasyon.",
    belirtiler: [
      "Özellikle atlarda: Yem tüketimini takiben 24-48 saat içinde aşırı terleme, kolik sancısı ve sendeleyerek yürüme",
      "Kalp yetmezliği, aritmi ve miyoglobinüri (koyu kahverengi idrar)",
      "Arka bacaklarda felç ve kas titremeleri",
      "Kalp kası nekrozu sonucu ani ölüm (atlarda LD50 salinomisin için 0.6 mg/kg'dır)"
    ],
    gerekliDeliller: [
      "Yem fabrikası üretim bandı kayıtları ve şüpheli at yeminin HPLC iyonofor analiz raporu",
      "Atların veteriner hekim nekropsi raporunda çizgili kas ve kalp kası histopatolojik incelemesi",
      "Yarış atı/damızlık at kayıtları (TJK / Yüksek Komiserler Kurulu tescili)",
      "Yem satın alma faturası ve çuval etiketleri"
    ],
    hesaplamaYontemi: "Telef olan yarış veya damızlık atın TJK emsal yarış/damızlık değeri + Yapılan acil veteriner klinik müdahale masrafları.",
    mevzuat: "5996 Sayılı Kanun m.24; Hayvan Yemlerinde İstenmeyen Maddeler Tebliği; TBK m.49 ve m.219."
  },
  {
    id: "hasar-ure-zehirlenmesi",
    baslik: "Yemlik Üre / NPN Zehirlenmesi (Akut Amonyak Toksikasyonu)",
    aciklama: "Karma yem imalatında homojen karıştırılmayan veya yem formülünde mevzuat sınırını (%1.5) aşacak şekilde yüksek dozda üre kullanılan yemlerin tüketilmesi sonucu rumende aşırı amonyak açığa çıkması ve hayvanların dakikalar içinde boğulma benzeri belirtilerle ölmesi.",
    belirtiler: [
      "Yem tüketiminden 20-60 dakika sonra şiddetli huzursuzluk, kas seğirmeleri ve titreme",
      "Ağızdan ve burundan köpüklü salya akması, diş gıcırdatma ve böğürme",
      "İleri derecede karın şişkinliği (timpani), nefes darlığı ve tetanik kasılmalar",
      "1-2 saat içinde solunum yetmezliği ve kardiyak kollaps ile ani ölüm"
    ],
    gerekliDeliller: [
      "Yemin laboratuvar üre (NPN) ve ham protein kimyasal analiz raporu",
      "Nekropside rumen içeriği pH tespiti (pH > 7.5-8.0 amonyak zehirlenmesine işaret eder)",
      "Olay yeri jandarma/polis ve ilçe tarım hasar tespit tutanağı",
      "Yem çuval etiketinde üre beyanı olup olmadığının tespiti",
      "TÜRKVET hayvan ölüm kayıtları"
    ],
    hesaplamaYontemi: "Toplu ölen hayvanların piyasa canlı/damızlık rayiç bedeli + İmha masrafları.",
    mevzuat: "Yem Katkı Maddeleri Yönetmeliği; 5996 Sayılı Kanun m.26; TBK m.49 Haksız Fiil Tazminatı."
  },
  {
    id: "hasar-agir-metal",
    baslik: "Ağır Metal Kontaminasyonu (Kurşun, Kadmiyum, Arsenik)",
    aciklama: "Sanayi atıklarıyla kirlenmiş sulama suyuyla üretilen kaba yemler veya kalitesiz inorganik mineral katkılar (kireçtaşı, DCP) nedeniyle yeme karışan toksik ağır metallerin hayvan vücudunda birikerek kronik zehirlenme ve et/sütte kalıntı oluşturması.",
    belirtiler: [
      "Kronik kilo kaybı, zayıflama ve tüylerde dökülme",
      "Merkezi sinir sistemi bozuklukları, körlük ve inkoordinasyon (Kurşun)",
      "Böbrek yetmezliği ve anemi (Kadmiyum)",
      "Et ve süt numunelerinde yasal kalıntı limitlerinin katbekat üzerinde ağır metal tespiti"
    ],
    gerekliDeliller: [
      "Akredite laboratuvar ICP-MS ağır metal analiz raporları (yem, su, süt ve organ dokuları)",
      "İl/İlçe Tarım ve Orman Müdürlüğü ürün satış yasağı / karantina tutanağı",
      "Yem ve premiks tedarik faturaları",
      "Bilirkişi heyeti toprak/yem numune alma tutanağı"
    ],
    hesaplamaYontemi: "Gıda güvenliği nedeniyle imha edilen süt/et ürünleri zararı + Kalıcı hasar gören sürü damızlık değer kaybı.",
    mevzuat: "Gıda ve Yemlerde Bulaşanlar Yönetmeliği; Çevre Kanunu m.28; TBK m.49."
  },
  {
    id: "hasar-dusuk-protein",
    baslik: "Beyan Dışı Düşük Proteinli ve Hileli Karma Yem Satışı (Tağşiş / Ayıplı Mal)",
    aciklama: "Etiketinde örneğin %21 ham protein ve 2800 kcal/kg metabolik enerji beyan edilen süt veya besi yeminin laboratuvar analizinde fiilen %15-16 HP ve çok düşük enerji çıkması sonucu işletmenin öngörülen süt/canlı ağırlık artışına ulaşamaması ve maddi zarara uğraması.",
    belirtiler: [
      "Sürü rasyonunun eksiksiz verilmesine rağmen süt veriminin beklenen seviyeden %20-30 düşük kalması",
      "Besi danalarında günlük canlı ağırlık artışının (GCAA) 1.5 kg yerine 0.8-0.9 kg'da kalması",
      "Hayvanlarda zayıflama, kondisyon skoru kaybı ve tüy matlığı",
      "Aynı işletmede yem partisi değiştirildiğinde verimin hızla yükselmesi (deneme-yanılma tespiti)"
    ],
    gerekliDeliller: [
      "Yem partisinden noter veya İlçe Tarım marifetiyle alınmış şahit numunenin akredite Weende analiz raporu",
      "Yem çuval etiketi, ticari garanti beyannamesi ve faturalar",
      "İşletmenin kantar/tartım fişleri veya günlük süt teslim bordroları",
      "Emsal sürü rasyon verim simülasyonu ve zooteknist bilirkişi hesap cetveli"
    ],
    hesaplamaYontemi: "Eksik protein oranı nedeniyle ödenen fazla yem bedeli iadesi + Meydana gelen süt/besi ağırlık artışı mahrumiyet zararı (TBK m.227 seçimlik haklar ve tazminat).",
    mevzuat: "5996 Sayılı Kanun m.24 (Yem Güvenilirliği ve Etiketleme); TBK m.219-227 (Ayıptan Sorumluluk); TTK m.18."
  }
];

// ============================================================================
// 6. YEM ICTIHAT VERI TABANI (8 ADET KARAR)
// ============================================================================

export const YEM_ICTIHAT_DB: YemIctihat[] = [
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2021/4812",
    karar: "2022/1940",
    tarih: "15.03.2022",
    konu: "Aflatoksinli fabrika süt yemi nedeniyle çiğ sütte M1 tespiti, sütlerin imhası ve verim kaybı tazminatı",
    ozet: "Davacı süt üreticisinin davalı şirketten satın aldığı büyükbaş süt yeminin yedirilmesi sonucu üretilen çiğ sütte yasal limitin üzerinde aflatoksin M1 çıktığı, sütün sanayici tarafından dökülerek imha edildiği ve ineklerde verim düşüklüğü oluştuğu iddiasıyla açılan tazminat davasında; mahkemece akredite laboratuvar analiz raporu ile yemdeki Aflatoksin B1 oranı tespit edilmiş olup, illiyet bağının veteriner ve zooteknist bilirkişi raporuyla teyit edilmesi karşısında dökülen süt bedeli ile verim kaybı zararının imalatçı davalıdan tahsiline karar verilmesi usul ve kanuna uygundur.",
    anahtar: ["aflatoksin B1", "aflatoksin M1", "süt imhası", "ayıplı yem", "illiyet bağı", "üretici sorumluluğu"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2020/6120",
    karar: "2021/3455",
    tarih: "08.04.2021",
    konu: "Satın alınan bozuk ve küflü silaj nedeniyle büyükbaş hayvan telefi ve abort tazminatı",
    ozet: "Davacı işletmeye davalı satıcı tarafından teslim edilen mısır silajının bozuk ve küflü olduğu, silajın tüketilmesinin ardından hayvanlarda listeria enfeksiyonu ve toplu yavru atma olaylarının meydana geldiği sabit bulunmuştur. Veteriner Kontrol Enstitüsü raporunda silaj kaynaklı patojen izolasyonu yapıldığından, davalının ayıplı yem tesliminden kaynaklanan hayvan ölüm bedelleri ve yavru tazminatını ödemekle yükümlü olduğuna hükmedilmiştir.",
    anahtar: ["mısır silajı", "küflü yem", "listeria", "abort", "hayvan telefi", "ayıplı mal"]
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2019/3310",
    karar: "2020/2115",
    tarih: "18.06.2020",
    konu: "Fabrika süt yeminde etiket değerinden daha düşük ham protein tespit edilmesi (tağşiş) ve kâr mahrumiyeti",
    ozet: "Davacı ticari işletmenin yem fabrikasından satın aldığı süt yeminin etiketinde %21 ham protein taahhüt edilmesine rağmen, noter marifetiyle alınan şahit numunenin akredite laboratuvar analizinde fiilen %15.2 ham protein ihtiva ettiğinin anlaşılması üzerine; TBK ve TTK hükümleri uyarınca gizli ayıp kapsamında malın değerindeki eksiklik ile davacının rasyon eksikliğinden kaynaklanan süt verim kaybı farkının tazmin edilmesi gerektiği sonucuna varılmıştır.",
    anahtar: ["ham protein", "tağşiş", "etiket beyannamesi", "şahit numune", "gizli ayıp", "kâr mahrumiyeti"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2022/1105",
    karar: "2022/8820",
    tarih: "22.11.2022",
    konu: "Yem teknik sorumlusunun hatalı rasyon tavsiyesi sonucu laktik asidozdan toplu hayvan ölümü",
    ozet: "Davalı yem fabrikasının saha ziraat mühendisi/zooteknisti tarafından çiftlik için hazırlanan ve geçiş periyodu gözetilmeksizin yüksek nişastalı kesif yem içeren rasyon reçetesinin uygulanması neticesinde, davacının sürüsünde akut rumen laktik asidozu gelişerek 18 adet sağmal ineğin telef olduğu olayda; teknik kusurun davalı yem şirketinin istihdam ettiği uzmanda bulunduğu, TBK m.66 ve m.112 kapsamında kusursuz ifa yükümlülüğünün ihlal edildiği gerekçesiyle tazminat hükmü onanmıştır.",
    anahtar: ["hatalı rasyon", "akut asidoz", "teknik kusur", "zooteknist sorumluluğu", "TMR", "hayvan ölümü"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2018/7420",
    karar: "2019/5210",
    tarih: "12.06.2019",
    konu: "At yemine imalat hattı temizlenmemesi nedeniyle salinomisin (iyonofor) bulaşması ve safkan at telefi",
    ozet: "Davalı şirketin yem fabrikasında sığır besi yemi üretim bandından hemen sonra gerekli temizlik ve yıkama protokolü yapılmaksızın at yemi basıldığı, sığır yemindeki koksidiyostatik etken madde olan salinomisinin at yemine bulaştığı ve bu yemi tüketen davacıya ait 4 baş safkan İngiliz yarış atının kalp kası nekrozu nedeniyle telef olduğu Adli Tıp ve Üniversite bilirkişi heyetiyle kanıtlanmıştır. Yem üreticisinin ağır kusuru bulunduğu tespit edilerek atların damızlık ve yarış değeri tazminatına hükmedilmiştir.",
    anahtar: ["salinomisin", "iyonofor zehirlenmesi", "yarış atı", "çapraz bulaşma", "üretim hattı ayıbı", "kalp nekrozu"]
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2021/1850",
    karar: "2022/4112",
    tarih: "19.05.2022",
    konu: "Fabrika besi yemine aşırı dozda yemlik üre karıştırılması ve toplu amonyak toksikasyonu",
    ozet: "Davacı besicinin davalıdan aldığı fabrika besi yemi partisinde mevzuatta öngörülen %1.5 yasal sınırın çok üzerinde (%4.2 oranında) üre karıştırıldığı, homojen karışım yapılmadığı ve tüketimi müteakip saatler içinde hayvanların şiddetli amonyak zehirlenmesinden telef olduğu tespit edilmiştir. Mahkemenin, imalat hatası nedeniyle üreticinin 5996 Sayılı Kanun ve genel hükümler doğrultusunda zararı tazminle yükümlü olduğu yönündeki kararı onanmıştır.",
    anahtar: ["yemlik üre", "NPN zehirlenmesi", "amonyak intoksikasyonu", "besi danası", "imalat hatası", "homojenite"]
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2020/5540",
    karar: "2021/6920",
    tarih: "14.10.2021",
    konu: "Yem çuvallarında yüksek nem ve küflenme nedeniyle ayıplı mal teslimi ve yem bedeli iadesi",
    ozet: "Satın alınan 25 ton büyükbaş besi yemi çuvallarının açıldığında topaklanmış, nemli ve küflü olduğunun İlçe Tarım Müdürlüğü denetçileri marifetiyle tutanak altına alındığı, analizde nem oranının TSE standardı olan %13'ü aşarak %16.8 çıktığı anlaşılmıştır. Ayıbın imalat ve ambalajlama aşamasında meydana geldiği, davacının süresinde ayıp ihbarında bulunduğu kabul edilerek sözleşmeden dönme ve bedel iadesi kararı hukuka uygun bulunmuştur.",
    anahtar: ["yüksek nem", "küflü yem çuvalı", "ayıp ihbarı", "TSE 8998", "bedel iadesi", "topaklanma"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2022/3410",
    karar: "2023/1205",
    tarih: "09.02.2023",
    konu: "Kontamine hammadde kaynaklı süt aflatoksin cezası rücu davası",
    ozet: "Davacı entegre süt fabrikası, tedarik ettiği soya ve pamuk küspesinde yüksek aflatoksin bulunması nedeniyle ürettiği peynir ve süt ürünlerinde gıda kontrol denetiminde ceza uygulandığını ve ürünlerin imha edildiğini ileri sürerek hammadde satıcısına rücu etmiştir. Bilirkişi heyeti incelemesinde yem hammaddesinin teslim anında ayıplı olduğu, analiz raporunun gerçeği yansıtmadığı sabit görüldüğünden satıcının imha edilen nihai gıda ürünleri ve ödenen idari para cezalarından sorumlu olduğuna karar verilmiştir.",
    anahtar: ["rücu davası", "aflatoksin kontaminasyonu", "pamuk küspesi", "gıda cezası", "ayıplı hammadde", "idari para cezası"]
  }
];

// ============================================================================
// 7. YEM AI KNOWLEDGE BASE (15 DETAYLI MADDE)
// ============================================================================

export const YEM_AI_KNOWLEDGE: Record<string, YemAiKnowledgeItem> = {
  "rasyon-nasil-hesaplanir": {
    keywords: ["rasyon", "hesaplama", "formülasyon", "pearson karesi", "tmr", "kuru madde"],
    badge: "Rasyon Bilimi",
    answer: "Rasyon hesaplaması 5 temel adımda gerçekleştirilir: 1) Hayvanın canlı ağırlığı, verim düzeyi, gebelik durumu ve laktasyon evresi belirlenir. 2) NRC (2001) veya INRA tablolarından Kuru Madde (KM) tüketim kapasitesi, Ham Protein (HP), Metabolik Enerji (ME), NDF, ADF, Ca ve P gereksinimleri çıkarılır. 3) Kaba yem temeli oluşturulur; rumen sağlığı için toplam KM'nin en az %40-50'si kaliteli kaba yemden (yonca, mısır silajı) karşılanmalıdır. 4) Kaba yemlerden gelen besin maddeleri ihtiyaçtan düşülerek açık kalan enerji ve protein miktarı Pearson karesi veya doğrusal programlama (linear programming) yazılımları ile konsantre yem hammaddeleriyle (mısır, arpa, soya küspesi, pamuk küspesi vb.) dengelenir. 5) Kalsiyum, fosfor, tuz, sodyum bikarbonat ve vitamin-mineral premiksi eklenerek rasyon tamamlanır."
  },
  "kaba-kesif-orani-onemi": {
    keywords: ["kaba yem", "kesif yem", "oran", "peNDF", "asidoz", "geviş getirme"],
    badge: "Fizyoloji",
    answer: "Kaba/kesif yem oranı rumen fermantasyonunun kalbidir. İdeal bir süt ineği rasyonunda bu oran kuru madde bazında en az %45-50 kaba yem, en fazla %50-55 kesif yem olmalıdır. Kaba yemin partikül boyutu (etkin lif - peNDF) geviş getirmeyi tetikler; geviş getirme esnasında salgılanan tükürük günde 150-200 litreye kadar çıkar ve içeriğindeki bikarbonat rumeni doğal yolla tamponlar. Kaba yem oranı %40'ın altına düşerse rumen pH'sı 5.5'in altına inerek subakut rumen asidozu (SARA), laminitis, süt yağında düşüş (süt yağı depresyonu) ve abomazum deplasmanı meydana gelir."
  },
  "aflatoksin-nedir-limitler": {
    keywords: ["aflatoksin", "aflatoksin b1", "aflatoksin m1", "limit", "ppb", "toksin"],
    badge: "Mevzuat & Toksikoloji",
    answer: "Aflatoksinler, Aspergillus flavus ve Aspergillus parasiticus küf mantarları tarafından sıcak ve nemli ortamlarda üretilen son derece toksik ve kanserojen mikotoksinlerdir. Yem Mevzuatı gereğince: Süt veren hayvan karma yemlerinde Aflatoksin B1 üst sınırı 0.005 mg/kg'dır (5 ppb). Bu katı limitin sebebi, yenen B1'in karaciğerde hidroksillenerek %1-3 oranında süte Aflatoksin M1 olarak geçmesidir. Çiğ sütte M1 limiti ise 0.05 µg/kg'dır (50 ppt). Besi sığırı ve kanatlı yemlerinde sınır 20 ppb'dir. Sütte M1 tespit edilirse o süt kanunen dökülmek zorundadır."
  },
  "ndf-adf-anlami": {
    keywords: ["ndf", "adf", "van soest", "lif", "selüloz", "hemicellulose", "lignin"],
    badge: "Laboratuvar Analizi",
    answer: "Van Soest deterjan lif analiz sisteminde: 1) NDF (Nötral Deterjan Lif): Hemiselüloz, selüloz ve ligninden oluşur; bitki hücre çeperinin tamamını gösterir. NDF, yemin hacmini ve hayvanın tokluk hissini belirler. NDF yükseldikçe hayvanın yem tüketim kapasitesi azalır. 2) ADF (Asit Deterjan Lif): Selüloz ve ligninden oluşur; hemiselüloz ayrıştırılmıştır. ADF oranı yemin sindirilebilirliği ile ters orantılıdır; ADF ne kadar yüksekse yemin sindirilebilirliği ve enerji değeri o kadar düşüktür. Rasyonda minimum %28-30 NDF ve minimum %19-21 ADF bulunması rumen sağlığı için zorunludur."
  },
  "metabolik-enerji-hesabi": {
    keywords: ["metabolik enerji", "me", "hesaplama", "formül", "mcal", "weende"],
    badge: "Besin Değeri",
    answer: "Ruminantlarda Metabolik Enerji (ME), yemin içerdiği Ham Besin Maddeleri (Weende analizi) üzerinden TSE standart formülleriyle hesaplanır: ME (Mcal/kg KM) = [0.0388 x HP + 0.0795 x HY + 0.0416 x NÖM - 0.0105 x HS] x KM/100 formülasyonu veya sindirilebilirlik katsayıları (OMS) kullanılarak türetilir. Kaba yemlerde gaz üretim tekniği (Hohenheim Gaz Testi) ile 24 saatlik in-vitro fermantasyon gazı ve ham protein/yağ değerleri kullanılarak şu formülle bulunur: ME (MJ/kg KM) = 2.20 + 0.1357 x GP + 0.0057 x HP + 0.0286 x HY (MJ'den Mcal'e geçiş için 4.184'e bölünür)."
  },
  "silaj-kalitesi-degerlendirme": {
    keywords: ["silaj kalitesi", "flieg puanı", "ph", "laktik asit", "bütrik asit", "koku"],
    badge: "Yem Kalitesi",
    answer: "Mısır ve ot silajlarının kalitesi organoleptik ve kimyasal parametrelerle belirlenir: 1) pH Değeri: İdeal mısır silajında pH 3.8 - 4.2 arasında olmalıdır. pH > 4.8 ise fermantasyon yetersizdir. 2) Koku ve Renk: Zeytuni yeşil/sarı renkli, hoş ekşimsi meyvemsi kokulu olmalıdır. Kararmış (tütün kokulu) silaj aşırı ısınmış, tereyağı kokulu silaj ise zararlı bütrik asit fermantasyonuna uğramıştır. 3) Flieg Puanı: Kuru madde ve pH veya laktik/asetik/bütrik asit oranlarından hesaplanır; 81-100 arası 'Pekiyi', 61-80 'İyi', 41-60 'Orta', <40 'Kötü' kabul edilir. 4) NH3-N / Toplam Azot: %10'un altında olmalıdır (üzeri protein parçalanmasını gösterir)."
  },
  "rumen-asidozu-nedenleri": {
    keywords: ["rumen asidozu", "asidoz", "sara", "laktik asit", "tahıl", "nişasta"],
    badge: "Metabolik Hastalık",
    answer: "Rumen asidozu (akut veya subakut - SARA), rasyonda hızla parçalanabilen nişasta ve şekerin (arpa, buğday, mısır unları) aşırı miktarda verilmesi ve yetersiz kaba yem/etkin lif bulunması sonucu oluşur. Rumen bakterilerinden Streptococcus bovis hızla çoğalarak aşırı laktik asit üretir. Rumen pH'sı normal 6.2-6.8 aralığından 5.5'in altına (akutta < 5.0) düşer. Rumen mikroflorası ölür, laktik asit kana emilerek sistemik asidoza, karaciğer apselerine, böbrek yetmezliğine, akut laminitise (tırnak yangısı) ve ölüme yol açar."
  },
  "yem-analiz-raporu-okuma": {
    keywords: ["analiz raporu", "okuma", "kuru madde", "ham protein", "weende", "yorum"],
    badge: "Bilirkişi Tekniği",
    answer: "Bir yem analiz raporu incelenirken bilirkişinin dikkat etmesi gereken kritik basamaklar: 1) Analiz sonuçlarının 'Orijinal Maddede' mi yoksa 'Kuru Maddede (KM)' mi verildiğine mutlaka bakılmalıdır; karşılaştırmalar daima KM bazında yapılmalıdır. 2) Rutubet: Karma yemde > %13 ise bozulma riski vardır. 3) Ham Protein: Etiket beyanıyla tutarlı mı (Kjeldahl N x 6.25)? 4) Ham Selüloz ve NDF/ADF: Beklenenden yüksekse yeme kepek, saman veya kavuz gibi dolgu maddeleri tağşiş edilmiş olabilir. 5) Ham Kül: %8-10'u aşarsa yeme toprak, kum karışmış olabilir. 6) Mikotoksin panelinde Aflatoksin, Zearalenon ve DON limitleri kontrol edilmelidir."
  },
  "tmr-nedir": {
    keywords: ["tmr", "total mixed ration", "tam karışım rasyon", "mikser", "seçme"],
    badge: "Besleme Teknolojisi",
    answer: "TMR (Total Mixed Ration - Tam Karışım Rasyon), kaba ve kesif yemlerin, minerallerin, vitaminlerin ve sıvı yemlerin özel dikey veya yatay yem karma vagonlarında homojen bir şekilde karıştırılarak hayvanların önüne tek bir karışım halinde sunulmasıdır. Avantajları: İneğin lezzetli yemleri seçmesini (sorting) engeller, her lokmada dengeli kaba ve kesif yem almasını sağlar, rumen pH dalgalanmalarını minimuma indirir, süt verimini %5-10 artırır ve metabolik hastalıkları (asidoz, ketoz) minimize eder."
  },
  "bypass-protein-ne-demek": {
    keywords: ["bypass protein", "rup", "rdp", "korunmuş protein", "soya", "metiyonin"],
    badge: "Rumen Fizyolojisi",
    answer: "Bypass protein (Rumen Undegradable Protein - RUP), rumendeki mikroorganizmalar tarafından parçalanmadan (fermente olmadan) doğrudan abomazum ve ince bağırsağa geçen ve orada sindirilen yem proteinidir. Yüksek süt verimli ineklerde mikrobiyal protein sentezi hayvanın aminoasit ihtiyacını karşılamaya yetmez. Bu nedenle rasyondaki proteinin yaklaşık %35-40'ının bypass protein olması gerekir. Isıl işlem görmüş soya küspesi, mısır DDGS ve formaldehit veya ısıyla muamele edilmiş özel yemler yüksek bypass protein kaynağıdır."
  },
  "yem-maliyeti-nasil-dusurulur": {
    keywords: ["yem maliyeti", "tasarruf", "optimizasyon", "alternatif yem", "posa"],
    badge: "Çiftlik Ekonomisi",
    answer: "Hayvancılık işletme giderlerinin %65-75'ini yem oluşturur. Yem maliyetini düşürmenin bilimsel yolları: 1) Kendi kaba yemini (yonca, mısır silajı, fiğ) kaliteli üretmek; kaba yem kalitesi ne kadar yüksek olursa o kadar az pahalı fabrika yemi tüketilir. 2) Sanayi yan ürünlerini rasyona dahil etmek: Şeker pancarı posası silajı, bira posası, mısır glüteni, DDGS gibi ucuz yaş/kuru yan ürünler maliyeti %20-30 düşürür. 3) Sürüyü verim gruplarına ayırarak beslemek (yüksek, orta, düşük verim grupları); düşük verimli ineğe pahalı rasyon yedirmemek. 4) Yem seçilmesini engelleyerek yem zayiatını önlemek."
  },
  "kuru-madde-alimi-hesabi": {
    keywords: ["kuru madde alımı", "dmi", "tüketim", "hesaplama", "canlı ağırlık"],
    badge: "Rasyon Bilimi",
    answer: "Kuru Madde Alımı (KMA / DMI), bir hayvanın su hariç günde tükettiği toplam katı besin maddesi miktarıdır. Pratik hesaplama kuralları: 1) Süt sığırlarında: Canlı ağırlığın %3.5 - %4.0'ı kadardır. Formül: KMA (kg/gün) = [Canlı Ağırlık (kg) x 0.02] + [Süt Verimi (kg) / 3]. Örn: 650 kg bir inek 30 lt süt veriyorsa: (650 x 0.02) + (30 / 3) = 13 + 10 = 23 kg KM/gün. 2) Besi sığırlarında: Canlı ağırlığın %2.0 - %2.5'i kadardır. 3) Koyun ve keçilerde: Canlı ağırlığın %3.0 - %4.5'i kadardır. Rasyon hazırlandıktan sonra yemlerin rutubet oranına göre 'Orijinal Yem Tüketimi'ne çevrilir."
  },
  "mikotoksin-baglayici-nedir": {
    keywords: ["mikotoksin bağlayıcı", "bentonit", "zeolit", "mos", "aluminosilikat"],
    badge: "Yem Katkıları",
    answer: "Mikotoksin bağlayıcılar, yemdeki mikotoksinleri sindirim kanalında fiziksel veya biyokimyasal olarak tutarak kana emilmesini engelleyen ve dışkı yoluyla atılmasını sağlayan yem katkı maddeleridir. İki ana gruba ayrılır: 1) İnorganik bağlayıcılar (Bentonit, Zeolit, HSCAS): Tabakalı kil yapısıyla polar mikotoksinleri (özellikle Aflatoksin B1'i) %90+ başarıyla bağlar. 2) Organik bağlayıcılar (Maya hücre duvarı - Glukomannan, MOS): Apolar mikotoksinleri (Zearalenon, T-2, Okratoksin) bağlamada etkilidir. 3) Biyotransformasyon ajanları: Toksinin kimyasal yapısını parçalayan özel enzimler veya canlı maya suşlarıdır."
  },
  "mineral-vitamin-premiks": {
    keywords: ["premiks", "vitamin", "mineral", "iz element", "kalsiyum", "çinko"],
    badge: "Yem Katkıları",
    answer: "Premiksler, hayvanların temel hammaddelerden karşılayamadığı esansiyel mikro besin maddelerini sağlayan homojen taşıyıcılı konsantre karışımlardır. Bileşiminde: Vitamin A (epitel doku, görme), D3 (kalsiyum emilimi, kemik), E (antioksidan, bağışıklık, döl verimi); Makro mineraller (Ca, P, Mg, Na); İz elementler (Çinko-tırnak ve meme sağlığı, Bakır-kan ve pigmentasyon, Mangan-kemik ve döl verimi, İyot-tiroid, Selenyum-beyaz kas hastalığını önleme, Kobalt-B12 sentezi) yer alır. Rasyonlara genellikle %0.5-1.0 oranında katılır."
  },
  "yem-kaynakli-bilirkisi-raporu": {
    keywords: ["bilirkişi raporu", "rapor yazımı", "yem davası", "illiyet bağı", "hmk 279"],
    badge: "Bilirkişi Metodolojisi",
    answer: "Yem kaynaklı hasar ve tazminat davalarında bilirkişi raporu yazılırken şu sistematik izlenmelidir: 1) Giriş ve Görev: Mahkeme görevlendirmesi, dava konusu ve tarafların iddiaları özetlenir. 2) Maddi Deliller: Yem faturaları, etiketler, numune alma tutanakları ve akredite laboratuvar analiz raporları tarih sırasıyla listelenir. 3) Bilimsel İnceleme: Tespit edilen parametreler (aflatoksin, düşük protein, yüksek nem, üre vb.) resmi mevzuat (Yem Tebliği, TSE) ve NRC standartlarıyla kıyaslanır. 4) İlliyet Bağı: Hayvanlardaki klinik belirtiler veya ölüm nedeninin (veteriner nekropsi raporuyla teyitli) yendeki ayıp ile doğrudan nedensel bağı kurulur. 5) Zarar Hesabı: Telef hayvan rayici, dökülen süt miktarı veya verim kaybı TÜİK/UKON/USK emsal fiyatlarıyla kuruşu kuruşuna hesaplanır."
  }
};

// ============================================================================
// 8. YEM VE HAYVAN BESLEME REHBER ILKELERI (5 ILKE)
// ============================================================================

export const YEM_BESLEME_REHBER_ILKELERI: IlkeMadde[] = [
  {
    id: "yem-ilke-01",
    baslik: "Yem Analiz Raporunun Akredite Laboratuvardan Alınma Zorunluluğu",
    kaynak: "5996 Sayılı Kanun m.31 ve Yargıtay 3. Hukuk Dairesi Yerleşik İçtihatları",
    ozet: "Yemin ayıplı, bozuk veya zararlı olduğuna ilişkin iddialar sadece TÜRKAK akreditasyonuna sahip veya Tarım ve Orman Bakanlığı resmi laboratuvarlarınca düzenlenen analiz raporlarıyla ispatlanabilir.",
    detay: "Özel şahıs beyanları veya yetkisiz kurumların alelacele düzenlediği gayriresmi test sonuçları yargılamada hükme esas alınamaz. Analiz raporunda kullanılan test metodunun (HPLC, LC-MS/MS, ELISA, Kjeldahl vb.), ölçüm belirsizliğinin ve analiz tarihinin açıkça belirtilmesi şarttır. Şüpheli parametre mikotoksin ise resmi doğrulama metodu (kromatografik yöntemler) aranmalıdır.",
    kontrolListesi: [
      "Laboratuvarın TÜRKAK ISO 17025 akreditasyon sertifikası var mı?",
      "Rapor üzerinde test metodolojisi (TS EN, ISO, AOAC) açıkça yazılı mı?",
      "Numunenin mühür numarası ile rapordaki mühür numarası eşleşiyor mu?",
      "Sonuçlar kuru madde bazında mı yoksa orijinal maddede mi belirtilmiş?"
    ],
    ornekIhlal: "Bilirkişinin, dosyada yalnızca davacının kendi imkanlarıyla yaptırdığı ve numune alma tutanağı bulunmayan yetkisiz bir ziraat odası ön raporuna dayanarak yemin bozuk olduğuna karar vermesi.",
    dogruUygulama: "İlçe Tarım veya mahkeme keşfinde mühürlenerek Bakanlık onaylı Gıda ve Yem Kontrol Merkez Laboratuvarı'na gönderilen şahit numunenin akredite raporunu hükme esas almak."
  },
  {
    id: "yem-ilke-02",
    baslik: "Rasyon Değerlendirmesinde NRC / INRA Standartlarına Atıf Zorunluluğu",
    kaynak: "HMK m.279 ve Zootekni Bilimsel Metodolojisi",
    ozet: "Yanlış rasyon veya yetersiz besleme iddialarında bilirkişi, hayvanın fizyolojik ihtiyacını uluslararası kabul görmüş bilimsel normlara (NRC, INRA, ARC) dayandırmak zorundadır.",
    detay: "Subjektif görüşlerle 'bu hayvana bu yem az gelmiş' veya 'yem çok verilmiş' şeklinde rapor tanzim edilemez. Hayvanın canlı ağırlığı, laktasyon evresi ve verim seviyesine göre NRC tablosundan günlük Kuru Madde, Ham Protein, Metabolik Enerji, NDF, Ca ve P ihtiyaçları çıkarılmalı; işletmede uygulanan rasyon ile bu gereksinimler matematiksel olarak karşılaştırılmalıdır.",
    kontrolListesi: [
      "Hayvan grubu için geçerli güncel NRC veya INRA tablosuna atıf yapıldı mı?",
      "Kuru madde tüketim kapasitesi hayvanın canlı ağırlığına göre hesaplandı mı?",
      "Kaba/kesif yem oranı rumen fizyolojisi yönünden denetlendi mi?",
      "Rasyondaki kalsiyum/fosfor oranı (1.5:1 - 2:1) kontrol edildi mi?"
    ],
    ornekIhlal: "Hayvanın canlı ağırlığını ve süt verimini dikkate almadan, işletmede uygulanan rasyonun yetersiz olduğunu soyut ifadelerle beyan etmek.",
    dogruUygulama: "Raporda tablo halinde NRC besin madde gereksinimi ile işletmede verilen rasyonun besin madde arzını satır satır karşılaştırıp sapma yüzdesini belirlemek."
  },
  {
    id: "yem-ilke-03",
    baslik: "İlliyet Bağı Tespitinde Veteriner Hekim Nekropsi Raporu Gerekliliği",
    kaynak: "TBK m.49, m.50 ve Yargıtay 3. H.D. Kararları",
    ozet: "Yem sebebiyle hayvan telefi veya verim kaybı iddiasında, ölüm/hastalık ile tüketilen yem arasındaki nedensellik bağı (illiyet) veteriner nekropsi ve toksikoloji raporuyla kanıtlanmalıdır.",
    detay: "Yemin bozuk olması tek başına hayvanın o yemden öldüğünü ispatlamaya yetmez. Ölüm nedeni olarak salgın hastalık, zehirlenme, metabolik bozukluk veya enfeksiyon ayrımı yapılmalıdır. Bu ayrım ancak ölüm anında yapılmış detaylı veteriner hekim otopsi (nekropsi) tutanağı, iç organ patolojisi ve mide içeriği toksikoloji analiz sonuçlarıyla mümkündür.",
    kontrolListesi: [
      "Dosyada resmi veya serbest veteriner hekim tarafından düzenlenmiş nekropsi tutanağı var mı?",
      "Rumen sıvısı pH ölçümü ve mide muayene bulguları kaydedilmiş mi?",
      "Karaciğer, böbrek veya beyin dokusu patolojiye gönderilmiş mi?",
      "Ölüm sebebi ile yemde tespit edilen zararlı parametre örtüşüyor mu?"
    ],
    ornekIhlal: "Telef olan hayvanlar için hiçbir veteriner otopsisi yapılmadan ve gömüldükten aylar sonra, sadece yemin bozuk olduğu tespitine dayanarak tazminat hesabı yapmak.",
    dogruUygulama: "Veteriner Kontrol Enstitüsü nekropsi raporundaki ölüm sebebi bulguları ile yemdeki kontaminasyon türünü eşleştirerek illiyet bağını kesin olarak ortaya koymak."
  },
  {
    id: "yem-ilke-04",
    baslik: "Numune Alma Protokolü ve Şahit Numune Saklama Kuralı",
    kaynak: "Yem Hijyeni Yönetmeliği ve TSE Numune Alma Standartları (TS 7965 / ISO 6497)",
    ozet: "Yem numuneleri usulüne uygun olarak, partiyi temsil edecek şekilde sondalama yöntemiyle alınmalı; mühürlenmeli ve taraflara şahit numune bırakılmalıdır.",
    detay: "Çuvalın veya yığının sadece yüzeyinden rastgele alınan bir avuç numune yargılamada partiyi temsil etmez. TS 7965 standardına göre çuvalların karekökü kadar çuvaldan numune sondası ile alt, orta ve üst kısımlardan paçal numune alınmalı, dörde bölme yöntemiyle homojenleştirilmeli, en az 3 adet 1'er kg'lık torbaya mühürlenerek konulmalı; biri analize, biri satıcıya, biri de yediemine verilmelidir.",
    kontrolListesi: [
      "Numune alma tutanağında tarih, saat, parti no ve çuval adedi yazılı mı?",
      "Numune alma işlemi tarafların veya resmi denetçinin huzurunda yapıldı mı?",
      "Şahit numune uygun saklama koşullarında (kuru, serin) korundu mu?",
      "Analiz edilen numunenin torba mühür tutanağı dosyada mevcut mu?"
    ],
    ornekIhlal: "Çiftçinin kendi başına poşete koyup getirdiği ve partiyi temsil ettiği teyit edilemeyen yem numunesi sonucuna göre üreticiyi mahkûm etmek.",
    dogruUygulama: "Taraflar ve keşif heyeti huzurunda usulünce sondalanarak mühürlenen ve tutanak altına alınan numunenin analiz sonuçlarını esas almak."
  },
  {
    id: "yem-ilke-05",
    baslik: "Yem Etiket Beyannamesi ile Fiili Analiz Sonuçlarının Karşılaştırma Zorunluluğu",
    kaynak: "5996 Sayılı Kanun m.24 ve Türk Ticaret Kanunu m.18",
    ozet: "Yem fabrikasının torba üzerine diktiği etikette veya irsaliyede beyan ettiği garanti değerler ile fiili laboratuvar analiz sonuçları tek tek kıyaslanmalıdır.",
    detay: "Fabrika karma yemlerinde üretici etiketinde beyan ettiği Ham Protein, Ham Yağ, Ham Selüloz, Ham Kül, Kalsiyum, Fosfor, Sodyum ve Aflatoksin limitlerini sağlamakla kanunen yükümlüdür. Etiket değerleri ile analiz arasındaki farklar Yem Tebliği'nde belirtilen 'Tolerans Sınırları' (analitik ve üretim toleransı) dahilinde mi değil mi mutlaka denetlenmelidir. Toleransı aşan eksiklikler hileli/tağşişli mal kapsamındadır.",
    kontrolListesi: [
      "Yem çuval etiketi veya ambalaj üzerindeki matbu beyanname dosyada var mı?",
      "Laboratuvar ham protein, ham selüloz ve enerji sonuçları etiketle kıyaslandı mı?",
      "Meydana gelen sapma Yem Tebliği yasal tolerans limitlerini aşıyor mu?",
      "Eksik besin maddesi nedeniyle oluşan birim fiyat farkı hesaplandı mı?"
    ],
    ornekIhlal: "Yem analizinde proteinin %19 yerine %18 çıkması halinde, yönetmelikteki %1'lik analitik tolerans payını gözetmeksizin doğrudan ayıplı mal tespiti yapmak.",
    dogruUygulama: "Yasal tolerans paylarını dikkate alarak, toleransı aşan net eksiklik oranında malın değer kaybı ve buna bağlı verim mahrumiyetini belirlemek."
  }
];

// ============================================================================
// 9. YEM KONTROL LISTESI (3 ASAMA)
// ============================================================================

export const YEM_KONTROL_LISTESI: KontrolKategori[] = [
  {
    id: "kontrol-asama-1",
    asama: "Keşif Öncesi Hazırlık",
    baslik: "Dosya İnceleme ve Belge Toplama Aşaması",
    aciklama: "Mahkeme dosyasının, faturaların, analizlerin ve veteriner kayıtlarının keşif öncesinde titizlikle incelenmesi.",
    maddeler: [
      {
        id: "k1-m1",
        metin: "Dava dilekçesi, cevap dilekçesi, delil listeleri ve ihtilaf konusu yem partisine ait fatura ve sevk irsaliyelerinin incelenmesi.",
        mevzuat: "HMK m.266, m.279",
        onem: "kritik",
        aciklama: "Yemin cinsi, satın alma tarihi, parti/lot numarası ve teslim alınan miktar netleştirilmelidir."
      },
      {
        id: "k1-m2",
        metin: "Varsa daha önce alınmış resmi İlçe Tarım, Tarım Kredi veya özel laboratuvar analiz raporlarının incelenmesi.",
        mevzuat: "5996 Sayılı Kanun m.31",
        onem: "kritik",
        aciklama: "Raporlardaki parametrelerin şikayet konusu belirtilerle uyumu ve laboratuvarın akreditasyon durumu teyit edilir."
      },
      {
        id: "k1-m3",
        metin: "İşletmenin TÜRKVET hayvan varlığı listesi, ölüm/düşüm kayıtları ve veteriner hekim reçetelerinin temin edilmesi.",
        mevzuat: "Sığır Cinsi Hayvanların Tanımlanması Yönetmeliği",
        onem: "standart",
        aciklama: "Olay tarihindeki gerçek sürü mevcudu, hayvanların ırkı, yaşı ve laktasyon durumu belirlenir."
      },
      {
        id: "k1-m4",
        metin: "İşletmenin geçmişe dönük süt teslim bordroları, soğutma tankı kayıtları ve kantar fişlerinin incelenmesi.",
        mevzuat: "TBK m.50 (Zararın İspatı)",
        onem: "standart",
        aciklama: "Hasar öncesi baz süt verimi ile hasar dönemi arasındaki gerçek verim düşüşünün tespiti için zorunludur."
      },
      {
        id: "k1-m5",
        metin: "İhtilaf konusu hayvan türü ve verim grubu için geçerli güncel NRC/INRA rasyon standart tablolarının hazırlanması.",
        mevzuat: "Bilimsel Hayvan Besleme Normları",
        onem: "standart",
        aciklama: "Keşifte incelenecek rasyonun teknik karşılaştırması için referans veri seti hazır bulundurulmalıdır."
      }
    ]
  },
  {
    id: "kontrol-asama-2",
    asama: "Keşif ve Saha İncelemesi",
    baslik: "Olay Yeri, Yem Deposu ve Sürü Muayenesi",
    aciklama: "İşletmedeki yem stoklarının, silaj çukurlarının, TMR mikserinin ve hayvanların fiilen yerinde incelenmesi.",
    maddeler: [
      {
        id: "k2-m1",
        metin: "Yem deposunun fiziksel koşullarının (nem, havalandırma, çatı akıntısı, palet kullanımı, kemirgen varlığı) kontrolü.",
        mevzuat: "Yem Hijyeni Yönetmeliği m.6",
        onem: "kritik",
        aciklama: "Yemdeki bozulmanın fabrika kaynaklı mı yoksa çiftlikteki kötü depolama koşullarından mı kaynaklandığı ayırt edilir."
      },
      {
        id: "k2-m2",
        metin: "Şüpheli yem partisinden TS 7965 kurallarına uygun olarak numune sondasıyla numune alınması ve mühürlenmesi.",
        mevzuat: "TS 7965 / ISO 6497 Yem Numune Alma Standardı",
        onem: "kritik",
        aciklama: "Partiyi temsil eden homojen numune 3 nüsha mühürlenerek bir nüshası akredite laboratuvara sevk edilir."
      },
      {
        id: "k2-m3",
        metin: "Silaj çukuru/balyasının incelenmesi: pH ölçümü, koku, renk, küf tabakası kalınlığı ve sıkıştırma kalitesinin tespiti.",
        mevzuat: "Zootekni Silaj Muayene Standartları",
        onem: "standart",
        aciklama: "Silaj aynasında bozulma, küflenme veya fermantasyon kusuru olup olmadığı yerinde tespit edilir."
      },
      {
        id: "k2-m4",
        metin: "Yem karma vagonu (TMR mikseri) tartım sistemi, bıçak aşınması ve fiilen dağıtılan rasyonun partikül boyutu (Penn State Eleği) kontrolü.",
        mevzuat: "Penn State Kaba Yem Partikül Ayırıcı Metodu",
        onem: "standart",
        aciklama: "Rasyonun homojen karışıp karışmadığı ve etkin lif (peNDF) uzunluğunun yeterliliği sahada ölçülür."
      },
      {
        id: "k2-m5",
        metin: "Sürüdeki hayvanların genel klinik muayenesi: Vücut Kondisyon Skoru (VKS), dışkı kıvamı, geviş getirme oranı ve topallık kontrolü.",
        mevzuat: "Klinik Veteriner Teşhis Yöntemleri",
        onem: "kritik",
        aciklama: "Sürünün en az %50-60'ının dinlenme anında geviş getirip getirmediği ve asidoz/laminitis belirtileri gözlemlenir."
      }
    ]
  },
  {
    id: "kontrol-asama-3",
    asama: "Rapor Yazımı ve Hesaplama",
    baslik: "Laboratuvar Değerlendirmesi ve Maddi Zarar Hesabı",
    aciklama: "Analiz sonuçlarının mevzuatla karşılaştırılması, illiyet bağının kurulması ve HMK 279'a uygun net zarar hesabı.",
    maddeler: [
      {
        id: "k3-m1",
        metin: "Laboratuvardan gelen analiz sonuçlarının yem mevzuatı limitleri ve yasal tolerans payları ile karşılaştırılması.",
        mevzuat: "Yemlerde İstenmeyen Maddeler Tebliği & Yem Yönetmeliği",
        onem: "kritik",
        aciklama: "Yemdeki parametre aşımı (aflatoksin, nem, düşük protein vb.) tereddütsüz olarak ortaya konulur."
      },
      {
        id: "k3-m2",
        metin: "Yemdeki kusur ile hayvanlardaki semptomlar ve ölümler arasındaki illiyet bağının bilimsel temellendirilmesi.",
        mevzuat: "TBK m.49, m.112",
        onem: "kritik",
        aciklama: "Ölüm veya verim kaybının başka bir hastalıktan değil, kanıtlanan yem ayıbından kaynaklandığı gerekçelendirilir."
      },
      {
        id: "k3-m3",
        metin: "Zararın hesaplanması: Telef hayvan rayici, dökülen süt miktarı ve emsal verim kaybının resmi rayiçlerle kuruşlandırılması.",
        mevzuat: "HMK m.279, TBK m.50, m.51",
        onem: "kritik",
        aciklama: "TÜİK, UKON, USK ve Ticaret Borsası olay tarihindeki resmi fiyatları esas alınarak şeffaf hesap tablosu oluşturulur."
      },
      {
        id: "k3-m4",
        metin: "Kusur durumunun değerlendirilmesi: Üretici ayıbı, depolama kusuru ve yetiştirici ihmalinin (müterafik kusur) irdelenmesi.",
        mevzuat: "TBK m.52 (Zararın Azaltılması / Ortak Kusur)",
        onem: "standart",
        aciklama: "Yetiştiricinin bozuk olduğunu gördüğü yemi yedirmeye devam edip etmediği gibi hususlar takdiri mahkemeye bırakılarak belirtilir."
      }
    ]
  }
];

// ============================================================================
// 10. LABORATUVAR ANALIZ PARAMETRELERI (19 PARAMETRE)
// ============================================================================

export const LABORATUVAR_ANALIZ_PARAMETRELERI: LabAnaliz[] = [
  {
    parametre: "Kuru Madde",
    kisaltma: "KM",
    birim: "%",
    yontem: "Etüvde 103±2°C'de kurutma (TS 6328 / ISO 6496)",
    aciklama: "Yemin su hariç katı besin maddeleri oranıdır; tüm besin maddesi karşılaştırmaları KM bazında yapılır.",
    tipikAralik: "Karma yem: %86-89 | Kuru ot: %85-90 | Mısır silajı: %30-35"
  },
  {
    parametre: "Ham Protein",
    kisaltma: "HP",
    birim: "% (KM'de)",
    yontem: "Kjeldahl Metodu (Azot x 6.25) (TS 5808 / ISO 5983)",
    aciklama: "Yemdeki toplam azot miktarının 6.25 katsayısıyla çarpılmasıyla bulunan gerçek protein ve NPN toplamı.",
    tipikAralik: "Soya küspesi: %44-48 | Yonca: %16-20 | Arpa: %10-12 | Saman: %3-4"
  },
  {
    parametre: "Ham Yağ",
    kisaltma: "HY",
    birim: "% (KM'de)",
    yontem: "Soxhlet Ekstraksiyonu (Petrol Eteri) (TS 6582 / ISO 6492)",
    aciklama: "Eterde çözünen trigliseritler, serbest yağ asitleri ve lipid fraksiyonu; yemin konsantre enerji kaynağıdır.",
    tipikAralik: "Tam yağlı soya: %18-20 | DDGS: %9-11 | Mısır: %3.5-4.2 | Yonca: %1.8-2.5"
  },
  {
    parametre: "Ham Selüloz",
    kisaltma: "HS",
    birim: "% (KM'de)",
    yontem: "Weende Yöntemi (Asit ve alkali kaynatma) (TS 6420)",
    aciklama: "Asit ve alkaliye dirençli hücre çeperi lifleri; klasik Weende sisteminde kaba yem lif miktarını gösterir.",
    tipikAralik: "Buğday samanı: %38-42 | Yonca: %24-28 | Arpa: %4.5-6.0 | Mısır: %2.0-2.5"
  },
  {
    parametre: "Ham Kül",
    kisaltma: "HK",
    birim: "% (KM'de)",
    yontem: "Kül Fırınında 550°C'de yakma (TS 6527 / ISO 5984)",
    aciklama: "Organik maddelerin tamamen yanması sonucu kalan inorganik mineral kalıntısı; yüksekliği toprak bulaşıklığına işaret eder.",
    tipikAralik: "Yonca: %8-10 | Çayır otu: %7-9 | Tahıllar: %1.5-2.5 | Mermer tozu: %98-99"
  },
  {
    parametre: "Nötral Deterjan Lif",
    kisaltma: "NDF",
    birim: "% (KM'de)",
    yontem: "Van Soest Metodu - Nötral deterjan çözeltisi (TS 9620)",
    aciklama: "Bitki hücre çeperinin toplamı (Hemiselüloz + Selüloz + Lignin); hayvanın fiziki tokluk ve yem tüketim sınırını belirler.",
    tipikAralik: "Buğday samanı: %72-78 | Çayır otu: %55-62 | Yonca: %40-46 | Mısır silajı: %40-46"
  },
  {
    parametre: "Asit Deterjan Lif",
    kisaltma: "ADF",
    birim: "% (KM'de)",
    yontem: "Van Soest Metodu - Setiltrimetilamonyum bromürlü asit (TS 9620)",
    aciklama: "Selüloz ve lignin fraksiyonu; yemin sindirilebilirliği ile ters orantılıdır, ADF arttıkça sindirilebilirlik düşer.",
    tipikAralik: "Saman: %48-54 | Çayır otu: %35-40 | Yonca: %30-34 | Mısır silajı: %24-28"
  },
  {
    parametre: "Asit Deterjan Lignin",
    kisaltma: "ADL",
    birim: "% (KM'de)",
    yontem: "%72'lik Sülfürik Asit muamelesi (Van Soest)",
    aciklama: "Hücre çeperinin tamamen sindirilemeyen odunsu lignin kısmı; kaba yem kalitesini doğrudan sınırlar.",
    tipikAralik: "Saman: %8-11 | Olgun kuru ot: %6-8 | Kaliteli yonca: %3.5-5.0"
  },
  {
    parametre: "Nispi Yem Değeri",
    kisaltma: "NYD / RFV",
    birim: "İndeks (Birim yok)",
    yontem: "Hesaplama: RFV = (Kuru Madde Sindirilebilirliği x KMA) / 1.29",
    aciklama: "Kaba yemlerin kalitesini tam çiçeklenme dönemindeki yoncayı 100 baz alarak derecelendiren uluslararası endeks.",
    tipikAralik: "Başarılı Yonca: >150 (Başarılı) | 125-150 (İyi) | 100-124 (Orta) | Saman: 50-65"
  },
  {
    parametre: "Metabolize Olabilir Enerji",
    kisaltma: "ME",
    birim: "Mcal/kg KM",
    yontem: "Hesaplama (TSE formülleri / Hohenheim in vitro gaz testi)",
    aciklama: "Dışkı, idrar ve gazla atılan kayıplardan sonra hayvanın süt, et ve idame için kullanabildiği nete yakın enerji miktarı.",
    tipikAralik: "Dane mısır: 3.25-3.40 | Arpa: 2.90-3.05 | Yonca: 2.10-2.25 | Saman: 1.35-1.45"
  },
  {
    parametre: "Aflatoksin B1",
    kisaltma: "AFB1",
    birim: "mg/kg (ppm) / ppb",
    yontem: "HPLC-FLD / LC-MS/MS veya Immunoaffinity Kolon (TS EN ISO 17375)",
    aciklama: "Aspergillus mantarlarının ürettiği en güçlü kanserojen mikotoksin; süt hayvanı yemlerinde yasal üst sınır 0.005 mg/kg'dır (5 ppb).",
    tipikAralik: "Yasal sınır: Max 0.005 ppm (Süt) | Max 0.020 ppm (Besi/Kanatlı)"
  },
  {
    parametre: "Toplam Aflatoksin",
    kisaltma: "Top-AF",
    birim: "mg/kg (ppm) / ppb",
    yontem: "LC-MS/MS / HPLC (B1 + B2 + G1 + G2 toplamı)",
    aciklama: "Dört majör aflatoksin fraksiyonunun toplamıdır; sıcak ve nemli depolamada tahıllarda hızla artar.",
    tipikAralik: "Hammadde üst limiti: Max 0.020 - 0.040 ppm (20-40 ppb)"
  },
  {
    parametre: "Deoksinivalenol",
    kisaltma: "DON",
    birim: "mg/kg (ppm)",
    yontem: "HPLC-UV / LC-MS/MS (TS EN 15791)",
    aciklama: "Fusarium mantarı toksini (Vomitoksin); iştahsızlık, kusma, yem reddi ve bağışıklık çöküşüne neden olur.",
    tipikAralik: "Sığır yemi tavsiye sınırı: Max 5.0 mg/kg | Buzağı: Max 2.0 mg/kg"
  },
  {
    parametre: "Zearalenon",
    kisaltma: "ZEN",
    birim: "mg/kg (ppm)",
    yontem: "HPLC-FLD / LC-MS/MS (TS EN 15792)",
    aciklama: "Östrojenik mikotoksin; döl tutmama, ovaryum kistleri, meme büyümesi, vulvovajinit ve aborta yol açar.",
    tipikAralik: "Düve/Damızlık sığır yemi tavsiye sınırı: Max 0.5 mg/kg (500 ppb)"
  },
  {
    parametre: "Fumonisin",
    kisaltma: "FUM (B1+B2)",
    birim: "mg/kg (ppm)",
    yontem: "LC-MS/MS / HPLC-FLD (TS EN 16006)",
    aciklama: "Fusarium verticillioides kaynaklı; mısırda çok yaygındır, atlarda beyin nekrozu (ELEM), sığırda karaciğer hasarı yapar.",
    tipikAralik: "At yemi sınırı: Max 5.0 mg/kg | Yetişkin sığır: Max 50.0 mg/kg"
  },
  {
    parametre: "Silaj pH Değeri",
    kisaltma: "pH",
    birim: "pH birimi",
    yontem: "pH metre ile doğrudan sulu silaj ekstraktında elektrot ölçümü",
    aciklama: "Silajın fermantasyon asitliğini gösterir; pH 4.2'nin altı silajın iyi korunduğunu ve bozulmadığını gösterir.",
    tipikAralik: "İdeal Mısır Silajı: 3.8 - 4.2 | Ot Silajı: 4.2 - 4.6 | Bozuk: > 5.0"
  },
  {
    parametre: "Laktik Asit",
    kisaltma: "LA",
    birim: "% (KM'de)",
    yontem: "HPLC / Enzimatik Analiz / Gaz Kromatografisi",
    aciklama: "Silaj fermantasyonunda istenen ana organik asittir; pH'yı düşürerek yemin yıllarca bozulmadan kalmasını sağlar.",
    tipikAralik: "İyi fermente silaj: %4.0 - 8.0 (toplam asitlerin en az %65-70'i laktik asit olmalıdır)"
  },
  {
    parametre: "Bütrik Asit",
    kisaltma: "BA",
    birim: "% (KM'de)",
    yontem: "Gaz Kromatografisi (GC-FID) / HPLC",
    aciklama: "Clostridium bakterilerinin fermantasyonuyla oluşan istenmeyen zararlı asittir; silajda çürüme ve enerji kaybını gösterir.",
    tipikAralik: "İdeal Silaj: < %0.1 | Kuşkulu: %0.1 - 0.5 | Bozuk/Zararlı: > %0.5"
  },
  {
    parametre: "Amonyak Azotu / Toplam Azot",
    kisaltma: "NH3-N / TN",
    birim: "%",
    yontem: "Kjeldahl Damıtma Yöntemi (Magnezyum Oksit ile)",
    aciklama: "Silajda proteinlerin aşırı parçalanarak amonyağa dönüştüğünü gösteren bozulma göstergesi.",
    tipikAralik: "Çok İyi: < %8.0 | İyi: %8.0 - 10.0 | Orta: %10.0 - 15.0 | Bozuk: > %15.0"
  }
];

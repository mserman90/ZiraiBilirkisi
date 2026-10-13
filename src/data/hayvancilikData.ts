/**
 * Zirai Bilirkişi Portalı - Hayvancılık Veri Modülü
 * 02.01 BÜYÜKBAŞ, KÜÇÜKBAŞ, KANATLI HAYVAN YETİŞTİRİCİLİĞİ
 * 
 * 2024-2025 Türkiye piyasa rayiçleri, UKON, USK, TÜİK, TARSİM ve 
 * Yargıtay yerleşik içtihatlarına dayalı kapsamlı veri tabanı ve bilirkişi rehberi.
 */

import { IlkeMadde, KontrolKategori } from "../types";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BuyukbasIrk {
  irk: string;
  tip: "Süt" | "Et" | "Kombine";
  ortCanliAgirlik: number;
  karkasRandimani: number;
  gunlukSutVerimi?: number;
  laktasyonSuresi?: number;
  yillikSutVerimi?: number;
  ekonomikOmur: number;
  damizlikDegerMin: number;
  damizlikDegerMax: number;
  kasimFiyatiKg: number;
  gunlukYemMaliyeti: number;
  aciklama: string;
}

export interface KucukbasIrk {
  irk: string;
  tip: "Süt" | "Et" | "Yapağı" | "Kombine";
  hayvanTuru: "Koyun" | "Keçi";
  ortCanliAgirlik: number;
  karkasRandimani: number;
  gunlukSutVerimi?: number;
  yillikSutVerimi?: number;
  yillikYapagiVerimi?: number;
  ekonomikOmur: number;
  damizlikDegerMin: number;
  damizlikDegerMax: number;
  kasimFiyatiKg: number;
  gunlukYemMaliyeti: number;
  aciklama: string;
}

export interface KanatliTuru {
  tur: string;
  tip: "Et" | "Yumurta" | "Kombine";
  canliAgirlik: number;
  karkasRandimani: number;
  gunlukYumurtaVerimi?: number;
  yillikYumurtaVerimi?: number;
  ekonomikOmur: number; // ay cinsinden
  birimDeger: number;
  gunlukYemMaliyeti: number;
  aciklama: string;
}

export interface HayvanBirimFiyatlari {
  yil: string;
  kaynak: string;
  buyukbas: {
    canliKgBesi: number;
    canliKgKasaplikInek: number;
    karkasDanaKg: number;
    karkasInekKg: number;
    sutLt: number;
    damizlikGebeDuve: number;
    damizlikBoga: number;
    yavruBuzagi: number;
    dana7_10Ay: number;
    hamDeriAdet: number;
  };
  kucukbas: {
    canliKgKuzu: number;
    canliKgKoyun: number;
    canliKgOglak: number;
    canliKgKeci: number;
    karkasKuzuKg: number;
    karkasKoyunKg: number;
    karkasKeciKg: number;
    sutKoyunLt: number;
    sutKeciLt: number;
    damizlikKoyun: number;
    damizlikKoc: number;
    damizlikKeci: number;
    damizlikTeke: number;
    yavruKuzu: number;
    yavruOglak: number;
    deriKoyunAdet: number;
    yapagiKg: number;
    tiftikKg: number;
  };
  kanatli: {
    broilerCanliKg: number;
    broilerKarkasKg: number;
    yumurtaAdet: number;
    yumurtaTavuguYarka: number;
    cikmaTavukAdet: number;
    hindiCanliKg: number;
    hindiKarkasKg: number;
    kazCanliAdet: number;
    kazKarkasKg: number;
    ordekCanliAdet: number;
    bildircinCanliAdet: number;
    bildircinYumurtaAdet: number;
    gunlukCivcivBroiler: number;
    gunlukCivcivYumurta: number;
  };
}

export interface YemFiyatlari {
  arpa: number;
  bugday: number;
  misir: number;
  soyaKuspesi: number;
  aycicekKuspesi: number;
  yonca: number;
  silaj: number;
  kuspe: number;
  saman: number;
  korunga: number;
  ryegrassOtu: number;
  premiks: number;
  sutYemi: number;
  sutYemiYuksekVerim: number;
  besiYemi: number;
  besiBitirmeYemi: number;
  kuzuBuyutmeYemi: number;
  kuzuBaslangicYemi: number;
  kanatliYemi: number;
  broilerBaslangicYemi: number;
  yumurtaYemi: number;
}

export interface HayvanIctihat {
  daire: string;
  esas: string;
  karar: string;
  tarih: string;
  konu: string;
  ozet: string;
  anahtar: string[];
}

export interface HayvanAiKnowledgeItem {
  keywords: string[];
  answer: string;
  badge?: string;
}

export interface TelefNedeni {
  neden: string;
  nedenKodu?: string;
  aciklama: string;
  gerekliDeliller: string[];
}

// ============================================================================
// 1. BUYUKBAS_IRKLARI - Cattle Breed Database (2024-2025 Verileri)
// ============================================================================
/**
 * Türkiye'de yetiştiriciliği yapılan başlıca büyükbaş sığır ırkları,
 * verim yönleri, canlı ağırlıkları, randımanları ve 2024-2025 piyasa rayiçleri.
 */
export const BUYUKBAS_IRKLARI: BuyukbasIrk[] = [
  {
    irk: "Holstein (Siyah Alaca)",
    tip: "Süt",
    ortCanliAgirlik: 650,
    karkasRandimani: 54,
    gunlukSutVerimi: 28,
    laktasyonSuresi: 305,
    yillikSutVerimi: 8540,
    ekonomikOmur: 5.5,
    damizlikDegerMin: 95000,
    damizlikDegerMax: 140000,
    kasimFiyatiKg: 345,
    gunlukYemMaliyeti: 235,
    aciklama: "Dünya genelinde ve Türkiye entansif süt işletmelerinde en yaygın kültür ırkı. Yüksek süt potansiyeli sunar; sıcaklık stresine ve metabolik hastalıklara hassastır. Karkas randımanı et ırklarına nazaran düşüktür."
  },
  {
    irk: "Simental (Fleckvieh)",
    tip: "Kombine",
    ortCanliAgirlik: 720,
    karkasRandimani: 58,
    gunlukSutVerimi: 22,
    laktasyonSuresi: 305,
    yillikSutVerimi: 6710,
    ekonomikOmur: 6.5,
    damizlikDegerMin: 110000,
    damizlikDegerMax: 165000,
    kasimFiyatiKg: 375,
    gunlukYemMaliyeti: 245,
    aciklama: "Hem yüksek süt verimi hem de mükemmel et tutma ve karkas randımanı sağlayan kombine ırk. Adaptasyon yeteneği, meme sağlığı ve döl verimi yüksek olup Türkiye'de en çok talep gören ırktır."
  },
  {
    irk: "Montofon (Brown Swiss)",
    tip: "Kombine",
    ortCanliAgirlik: 660,
    karkasRandimani: 56,
    gunlukSutVerimi: 20,
    laktasyonSuresi: 305,
    yillikSutVerimi: 6100,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 100000,
    damizlikDegerMax: 150000,
    kasimFiyatiKg: 365,
    gunlukYemMaliyeti: 225,
    aciklama: "İsviçre kökenli, güçlü kemik yapısına sahip kombine ırk. Sütünün kuru madde ve kazein oranı yüksek olduğundan peynir sanayiinde değerlidir. Dağlık ve engebeli arazilere uyumu üstündür."
  },
  {
    irk: "Yerli Kara",
    tip: "Kombine",
    ortCanliAgirlik: 320,
    karkasRandimani: 48,
    gunlukSutVerimi: 6,
    laktasyonSuresi: 210,
    yillikSutVerimi: 1260,
    ekonomikOmur: 9.5,
    damizlikDegerMin: 45000,
    damizlikDegerMax: 65000,
    kasimFiyatiKg: 330,
    gunlukYemMaliyeti: 110,
    aciklama: "İç Anadolu bozkır koşullarına tam adapte olmuş yerli gen kaynağı. Olumsuz çevre şartlarına, kaba yem yetersizliklerine ve hastalıklara karşı direnci olağanüstüdür; verimi düşüktür."
  },
  {
    irk: "Doğu Anadolu Kırmızısı",
    tip: "Kombine",
    ortCanliAgirlik: 380,
    karkasRandimani: 50,
    gunlukSutVerimi: 7,
    laktasyonSuresi: 220,
    yillikSutVerimi: 1540,
    ekonomikOmur: 9.0,
    damizlikDegerMin: 50000,
    damizlikDegerMax: 75000,
    kasimFiyatiKg: 340,
    gunlukYemMaliyeti: 125,
    aciklama: "Doğu ve Güneydoğu Anadolu'nun sert kış şartlarına, yüksek rakımlı meralarına uyumlu yerli ırk. Yetersiz bakım koşullarında bile yaşama kabiliyetini korur."
  },
  {
    irk: "Jersey",
    tip: "Süt",
    ortCanliAgirlik: 430,
    karkasRandimani: 49,
    gunlukSutVerimi: 19,
    laktasyonSuresi: 305,
    yillikSutVerimi: 5795,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 85000,
    damizlikDegerMax: 130000,
    kasimFiyatiKg: 320,
    gunlukYemMaliyeti: 175,
    aciklama: "Küçük cüsseli, sarı-kahverengi sütçü ırk. Sütündeki çok yüksek yağ (%5.0-6.0) ve kuru madde oranı ile bilinir. Karadeniz kıyı kuşağında mera otlatmasına ve tereyağı üretimine elverişlidir."
  },
  {
    irk: "Angus",
    tip: "Et",
    ortCanliAgirlik: 750,
    karkasRandimani: 62,
    ekonomikOmur: 8.0,
    damizlikDegerMin: 120000,
    damizlikDegerMax: 175000,
    kasimFiyatiKg: 390,
    gunlukYemMaliyeti: 220,
    aciklama: "Dünyaca ünlü etçi ırk. Doğal boynuzsuzdur, döl verimi ve kolay doğum özelliği üstündür. İnce kemikli yapısı, yüksek karkas randımanı ve intramüsküler mermerleşmiş yağ dokusu ile et kalitesi zirvededir."
  },
  {
    irk: "Hereford",
    tip: "Et",
    ortCanliAgirlik: 760,
    karkasRandimani: 60,
    ekonomikOmur: 8.0,
    damizlikDegerMin: 115000,
    damizlikDegerMax: 165000,
    kasimFiyatiKg: 385,
    gunlukYemMaliyeti: 215,
    aciklama: "Mera yetiştiriciliğine ve yaygın besiye çok elverişli, sakin mizaçlı etçi sığır ırkı. Kırmızı gövdeli ve beyaz başlıdır; kaba yemleri ete dönüştürme kabiliyeti yüksektir."
  },
  {
    irk: "Charolais (Şarole)",
    tip: "Et",
    ortCanliAgirlik: 920,
    karkasRandimani: 64,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 130000,
    damizlikDegerMax: 190000,
    kasimFiyatiKg: 395,
    gunlukYemMaliyeti: 260,
    aciklama: "Fransa menşeili iri gövdeli etçi ırk. Hızlı canlı ağırlık artışı (günlük 1.4-1.8 kg) ve olağanüstü kas gelişimi sağlar. Ağır karkas ve düşük karkas yağı aranan işletmelerde tercih edilir."
  },
  {
    irk: "Limousin (Limuzin)",
    tip: "Et",
    ortCanliAgirlik: 830,
    karkasRandimani: 63,
    ekonomikOmur: 8.0,
    damizlikDegerMin: 125000,
    damizlikDegerMax: 185000,
    kasimFiyatiKg: 395,
    gunlukYemMaliyeti: 240,
    aciklama: "Et kalitesi, ince kemik yapısı ve yüksek birinci kalite et verimi ile bilinen etçi ırk. Doğum güçlüğü oranı düşüktür, randımanı ve kas dokusu kasaplık değerini artırır."
  }
];

// ============================================================================
// 2. KUCUKBAS_IRKLARI - Small Ruminant Breed Database (2024-2025 Verileri)
// ============================================================================
/**
 * Türkiye'de yetiştirilen başlıca koyun ve keçi ırkları, verim parametreleri,
 * canlı ağırlık, karkas randımanı ve rayiç değerleri.
 */
export const KUCUKBAS_IRKLARI: KucukbasIrk[] = [
  // Koyun Irkları
  {
    irk: "Merinos (Karacabey / Anadolu)",
    tip: "Kombine",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 65,
    karkasRandimani: 52,
    yillikSutVerimi: 80,
    yillikYapagiVerimi: 4.2,
    ekonomikOmur: 6.0,
    damizlikDegerMin: 12000,
    damizlikDegerMax: 20000,
    kasimFiyatiKg: 420,
    gunlukYemMaliyeti: 24,
    aciklama: "İnce yapağı ve kaliteli karkas eti üretimi için geliştirilmiş ince kuyruklu kültür ırkı. Besi kabiliyeti ve yemden yararlanma oranı yüksektir."
  },
  {
    irk: "Akkaraman",
    tip: "Kombine",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 55,
    karkasRandimani: 47,
    yillikSutVerimi: 60,
    yillikYapagiVerimi: 2.2,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 9000,
    damizlikDegerMax: 15000,
    kasimFiyatiKg: 390,
    gunlukYemMaliyeti: 18,
    aciklama: "Türkiye koyun varlığının en kalabalık yerli ırkı. Yağlı kuyruklu, kurak bozkır iklimine, yetersiz meraya ve uzun yürüyüşlere olağanüstü dayanıklıdır."
  },
  {
    irk: "İvesi (Awassi)",
    tip: "Süt",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 58,
    karkasRandimani: 48,
    gunlukSutVerimi: 1.2,
    yillikSutVerimi: 220,
    yillikYapagiVerimi: 2.0,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 14000,
    damizlikDegerMax: 24000,
    kasimFiyatiKg: 400,
    gunlukYemMaliyeti: 25,
    aciklama: "Güneydoğu Anadolu menşeili, dünyanın en yüksek süt verimli koyun ırklarından biridir. Yağlı kuyrukludur, sıcak iklime ve hastalıklara karşı güçlü adaptasyona sahiptir."
  },
  {
    irk: "Kıvırcık",
    tip: "Et",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 55,
    karkasRandimani: 50,
    yillikSutVerimi: 90,
    yillikYapagiVerimi: 2.0,
    ekonomikOmur: 6.5,
    damizlikDegerMin: 13000,
    damizlikDegerMax: 22000,
    kasimFiyatiKg: 450,
    gunlukYemMaliyeti: 22,
    aciklama: "Marmara ve Ege bölgesinde yaygın ince uzun kuyruklu ırk. Yağın kas aralarına dengeli dağılması sayesinde Türkiye'nin en lezzetli ve en yüksek fiyattan alıcı bulan kuzu etini üretir."
  },
  {
    irk: "Sakız",
    tip: "Süt",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 50,
    karkasRandimani: 46,
    gunlukSutVerimi: 1.5,
    yillikSutVerimi: 260,
    yillikYapagiVerimi: 2.2,
    ekonomikOmur: 6.0,
    damizlikDegerMin: 15000,
    damizlikDegerMax: 26000,
    kasimFiyatiKg: 410,
    gunlukYemMaliyeti: 26,
    aciklama: "Ege sahil kuşağı kökenli ince kuyruklu süt koyunu. Erken cinsel olgunluğa erişir, ikizlik ve üçüzlük doğum oranı (%180-220) ve süt verimi çok yüksektir; ağıl besisine uygundur."
  },
  {
    irk: "Karayaka",
    tip: "Et",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 52,
    karkasRandimani: 48,
    yillikSutVerimi: 50,
    yillikYapagiVerimi: 2.8,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 10000,
    damizlikDegerMax: 17000,
    kasimFiyatiKg: 430,
    gunlukYemMaliyeti: 20,
    aciklama: "Karadeniz kıyı ve dağlık bölgelerinde yetiştirilen ince kuyruklu yerli ırk. Eti yumuşak ve mermerleşmiş olup Tokat ve Sinop yöresi kebap ve karkas piyasasında primlidir."
  },
  {
    irk: "Morkaraman",
    tip: "Kombine",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 60,
    karkasRandimani: 46,
    yillikSutVerimi: 65,
    yillikYapagiVerimi: 2.3,
    ekonomikOmur: 7.5,
    damizlikDegerMin: 9500,
    damizlikDegerMax: 16000,
    kasimFiyatiKg: 395,
    gunlukYemMaliyeti: 19,
    aciklama: "Doğu Anadolu'nun yüksek rakımlı yaylalarına ve dondurucu kış şartlarına adapte olmuş iri cüsseli, kızıl-kahverengi yağlı kuyruklu yerli koyun ırkı."
  },
  {
    irk: "Dağlıç",
    tip: "Kombine",
    hayvanTuru: "Koyun",
    ortCanliAgirlik: 48,
    karkasRandimani: 45,
    yillikSutVerimi: 55,
    yillikYapagiVerimi: 2.0,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 8500,
    damizlikDegerMax: 14500,
    kasimFiyatiKg: 390,
    gunlukYemMaliyeti: 17,
    aciklama: "İç Ege ve Batı Anadolu geçit kuşağında yetiştirilen yuvarlak yağlı kuyruklu yerli ırk. Yetersiz çevre ve besleme koşullarında kanaatkârlığı ile bilinir."
  },

  // Keçi Irkları
  {
    irk: "Saanen",
    tip: "Süt",
    hayvanTuru: "Keçi",
    ortCanliAgirlik: 60,
    karkasRandimani: 48,
    gunlukSutVerimi: 2.8,
    yillikSutVerimi: 750,
    ekonomikOmur: 6.5,
    damizlikDegerMin: 13000,
    damizlikDegerMax: 24000,
    kasimFiyatiKg: 360,
    gunlukYemMaliyeti: 26,
    aciklama: "İsviçre kökenli dünyanın en yüksek süt verimli keçi ırkı. Beyaz renkli, uysal ve yüksek döl verimlidir (ikizlik %160-180). Entansif yarı-açık ağıl işletmelerinde yaygındır."
  },
  {
    irk: "Kilis",
    tip: "Süt",
    hayvanTuru: "Keçi",
    ortCanliAgirlik: 52,
    karkasRandimani: 46,
    gunlukSutVerimi: 1.8,
    yillikSutVerimi: 380,
    ekonomikOmur: 7.5,
    damizlikDegerMin: 11000,
    damizlikDegerMax: 19000,
    kasimFiyatiKg: 350,
    gunlukYemMaliyeti: 21,
    aciklama: "Kıl keçisi ile Halep keçisinin melezlenmesiyle ıslah edilmiş sütçü yerli ırk. Sıcak iklime, kurak meralara ve yetersiz şartlara karşı Saanen'den daha dayanıklıdır."
  },
  {
    irk: "Ankara (Tiftik Keçisi)",
    tip: "Yapağı",
    hayvanTuru: "Keçi",
    ortCanliAgirlik: 40,
    karkasRandimani: 42,
    yillikYapagiVerimi: 3.5,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 9000,
    damizlikDegerMax: 16000,
    kasimFiyatiKg: 330,
    gunlukYemMaliyeti: 18,
    aciklama: "İç Anadolu menşeili, dünya tekstil piyasasında tescilli tiftik (mohair) üreten özel keçi ırkı. Parlak, ipeksi ve elastik lifleri yüksek sanayi değerine sahiptir."
  },
  {
    irk: "Kıl Keçi (Kara Keçi)",
    tip: "Kombine",
    hayvanTuru: "Keçi",
    ortCanliAgirlik: 50,
    karkasRandimani: 45,
    gunlukSutVerimi: 0.8,
    yillikSutVerimi: 110,
    yillikYapagiVerimi: 0.6,
    ekonomikOmur: 8.5,
    damizlikDegerMin: 8000,
    damizlikDegerMax: 14000,
    kasimFiyatiKg: 340,
    gunlukYemMaliyeti: 16,
    aciklama: "Türkiye keçi varlığının büyük bölümünü oluşturan makilik ve dağlık alanlara tam uyumlu yerli ırk. Sarp arazilerde beslenme yeteneği ve hastalıklara direnci en üst düzeydedir."
  },
  {
    irk: "Maltız",
    tip: "Süt",
    hayvanTuru: "Keçi",
    ortCanliAgirlik: 46,
    karkasRandimani: 47,
    gunlukSutVerimi: 2.1,
    yillikSutVerimi: 450,
    ekonomikOmur: 7.0,
    damizlikDegerMin: 11500,
    damizlikDegerMax: 20000,
    kasimFiyatiKg: 350,
    gunlukYemMaliyeti: 22,
    aciklama: "Ege ve Marmara sahil bölgelerinde evcil aile işletmeciliğine uygun sütçü keçi ırkı. Uzun sarkık kulakları, sakin tabiatı ve düzenli laktasyonu ile bilinir."
  }
];

// ============================================================================
// 3. KANATLI_TURLERI - Poultry Types Database
// ============================================================================
/**
 * Türkiye kanatlı sektöründe ticari ve geleneksel yetiştiriciliği yapılan
 * etlik, yumurtacı ve alternatif kümes hayvanları türleri ve verim parametreleri.
 */
export const KANATLI_TURLERI: KanatliTuru[] = [
  {
    tur: "Broiler (Etlik Piliç)",
    tip: "Et",
    canliAgirlik: 2.6,
    karkasRandimani: 74,
    ekonomikOmur: 1.5, // 42-45 gün üretim döngüsü
    birimDeger: 90,
    gunlukYemMaliyeti: 3.8,
    aciklama: "Ross 308 / Cobb 500 genotipli hızlı büyüyen hibrit etlik piliç. 40-42 günlük besi periyodunda 1.5-1.6 yem dönüşüm oranı (FCR) ile 2.5-2.7 kg kesim ağırlığına ulaşır."
  },
  {
    tur: "Yumurta Tavuğu (Lohmann / Hy-Line)",
    tip: "Yumurta",
    canliAgirlik: 1.95,
    karkasRandimani: 62,
    gunlukYumurtaVerimi: 0.88,
    yillikYumurtaVerimi: 315,
    ekonomikOmur: 18.0, // 72-80 hafta
    birimDeger: 220, // 16-18 haftalık yumurtlama öncesi yarka bedeli
    gunlukYemMaliyeti: 1.65,
    aciklama: "Ticari kafesli veya serbest gezen (free-range) yumurta üretiminde kullanılan yüksek verimli hibrit hat. Pik üretimde %94-96 randımana ulaşır; ekonomik ömür bitiminde çıkma tavuk olarak satılır."
  },
  {
    tur: "Hindi (Kültür / Besi)",
    tip: "Et",
    canliAgirlik: 14.5,
    karkasRandimani: 81,
    ekonomikOmur: 5.0, // 20-22 hafta
    birimDeger: 1650,
    gunlukYemMaliyeti: 8.5,
    aciklama: "B.U.T. 6 gibi ticari beyaz hindi hibritleri. Erkeklerde 18-22 kg, dişilerde 10-12 kg kesim ağırlığına ulaşır. Göğüs eti randımanı ve karkas randımanı kanatlılar arasında en yüksektir."
  },
  {
    tur: "Kaz (Yerli / Linda)",
    tip: "Kombine",
    canliAgirlik: 5.5,
    karkasRandimani: 70,
    yillikYumurtaVerimi: 45,
    ekonomikOmur: 36.0,
    birimDeger: 1350,
    gunlukYemMaliyeti: 4.5,
    aciklama: "Kars ve Doğu Anadolu meralarında yaygın yetiştirilen, yağlı karkas eti, tüyü ve ciğeri yüksek ticari değere sahip geleneksel su kuşu türü."
  },
  {
    tur: "Ördek (Pekin)",
    tip: "Kombine",
    canliAgirlik: 3.3,
    karkasRandimani: 68,
    yillikYumurtaVerimi: 160,
    ekonomikOmur: 24.0,
    birimDeger: 480,
    gunlukYemMaliyeti: 3.2,
    aciklama: "Hızlı gelişim gösteren, 7-8 haftada 3.0 kg canlı ağırlığa ulaşabilen et ve yumurta amaçlı ticari ördek türü. Soğuğa ve suya karşı dayanıklıdır."
  },
  {
    tur: "Bıldırcın (Japon)",
    tip: "Kombine",
    canliAgirlik: 0.22,
    karkasRandimani: 72,
    gunlukYumurtaVerimi: 0.78,
    yillikYumurtaVerimi: 275,
    ekonomikOmur: 12.0,
    birimDeger: 65,
    gunlukYemMaliyeti: 0.45,
    aciklama: "Kısa generasyon aralığı (6 haftalıkken yumurtlamaya başlar) ve dar alanlarda yüksek yoğunluklu üretilebilmesi ile bilinen alternatif kanatlı türü."
  }
];

// ============================================================================
// 4. HAYVAN_BIRIM_FIYATLARI - Official Unit Prices (2024-2025 Rayiçleri)
// ============================================================================
/**
 * Tarım ve Orman Bakanlığı, UKON (Ulusal Kırmızı Et Konseyi), USK (Ulusal Süt Konseyi),
 * Damızlık Birlikleri ve Ticaret Borsaları 2024-2025 yılı resmi birim fiyat ve rayiçleri.
 */
export const HAYVAN_BIRIM_FIYATLARI: HayvanBirimFiyatlari = {
  yil: "2024-2025",
  kaynak: "UKON, USK, Tarım ve Orman Bakanlığı, Damızlık Birlikleri ve TZOB Piyasa Bültenleri",
  buyukbas: {
    canliKgBesi: 255,          // TL/kg canlı besi danası
    canliKgKasaplikInek: 205,   // TL/kg canlı reforme/reforme inek
    karkasDanaKg: 365,          // TL/kg yağsız dana karkas (UKON kombina ortalaması)
    karkasInekKg: 315,          // TL/kg inek karkas eti
    sutLt: 16.5,                // TL/litre soğutulmuş çiğ inek sütü (USK referans + kalite primleri)
    damizlikGebeDuve: 125000,   // TL/baş (1. sınıf kayıtlı gebe düve)
    damizlikBoga: 145000,       // TL/baş damızlık boğa
    yavruBuzagi: 32000,         // TL/baş (0-3 aylık buzağı)
    dana7_10Ay: 58000,          // TL/baş (besi materyali 7-10 aylık dana)
    hamDeriAdet: 650            // TL/adet büyükbaş ham sığır derisi
  },
  kucukbas: {
    canliKgKuzu: 265,           // TL/kg canlı toklu/kuzu
    canliKgKoyun: 195,          // TL/kg canlı anaç koyun
    canliKgOglak: 250,          // TL/kg canlı oğlak
    canliKgKeci: 180,           // TL/kg canlı keçi
    karkasKuzuKg: 425,          // TL/kg karkas kuzu eti (kasaplık)
    karkasKoyunKg: 340,         // TL/kg karkas koyun eti
    karkasKeciKg: 350,          // TL/kg karkas keçi eti
    sutKoyunLt: 34.0,           // TL/litre çiğ koyun sütü
    sutKeciLt: 28.0,            // TL/litre çiğ keçi sütü
    damizlikKoyun: 14500,       // TL/baş damızlık anaç koyun
    damizlikKoc: 22000,         // TL/baş damızlık koç
    damizlikKeci: 13500,        // TL/baş damızlık sağmal keçi
    damizlikTeke: 19500,        // TL/baş damızlık teke
    yavruKuzu: 6500,            // TL/baş (2-3 aylık sütten kesilmiş kuzu)
    yavruOglak: 5500,           // TL/baş (sütten kesilmiş oğlak)
    deriKoyunAdet: 110,         // TL/adet koyun/kuzu derisi
    yapagiKg: 18.5,             // TL/kg kirli merinos/yerli yapağı
    tiftikKg: 185.0             // TL/kg kaliteli tiftik (mohair)
  },
  kanatli: {
    broilerCanliKg: 34.5,       // TL/kg canlı etlik piliç
    broilerKarkasKg: 85.0,      // TL/kg bütün karkas piliç eti
    yumurtaAdet: 4.25,          // TL/adet L boy ticari yumurta ortalaması
    yumurtaTavuguYarka: 220,    // TL/adet 16-18 haftalık aşıları tam yumurtacı yarka
    cikmaTavukAdet: 45,         // TL/adet kesimlik çıkma tavuk
    hindiCanliKg: 115,          // TL/kg canlı besi hindisi
    hindiKarkasKg: 185,         // TL/kg karkas hindi eti
    kazCanliAdet: 1350,         // TL/adet canlı yetişkin kaz
    kazKarkasKg: 360,           // TL/kg karkas kaz eti
    ordekCanliAdet: 480,        // TL/adet canlı yetişkin ördek
    bildircinCanliAdet: 65,     // TL/adet kesimlik canlı bıldırcın
    bildircinYumurtaAdet: 2.2,  // TL/adet sofralık bıldırcın yumurtası
    gunlukCivcivBroiler: 18.5,  // TL/adet günlük etlik hibrit civciv
    gunlukCivcivYumurta: 26.0   // TL/adet günlük yumurtacı dişi civciv
  }
};

// ============================================================================
// 5. YEM_FIYATLARI - Feed Prices Database (TL/kg)
// ============================================================================
/**
 * 2024-2025 dönemi hammadde, kaba yem ve fabrika karma yem fiyatları (TL/kg).
 * Bilirkişi maliyet ve gelir kaybı hesaplamalarında esas alınacak referans fiyatlar.
 */
export const YEM_FIYATLARI: YemFiyatlari = {
  arpa: 8.20,              // TL/kg dane yemlik arpa
  bugday: 9.40,            // TL/kg dane yemlik buğday
  misir: 8.10,             // TL/kg dane sarı mısır
  soyaKuspesi: 20.50,      // TL/kg soya küspesi (%46 Ham Protein)
  aycicekKuspesi: 10.80,   // TL/kg ayçiçeği tohumu küspesi (%28-32 HP)
  yonca: 7.60,             // TL/kg kuru yonca otu balyası (1. kalite yeşil)
  silaj: 2.70,             // TL/kg mısır silajı (%30-33 KM)
  kuspe: 2.20,             // TL/kg yaş şeker pancarı küspesi
  saman: 2.80,             // TL/kg buğday sap samanı balyası
  korunga: 6.80,           // TL/kg balyalanmış kuru korunga otu
  ryegrassOtu: 5.50,       // TL/kg İtalyan çimi (Ryegrass) kuru otu
  premiks: 65.00,          // TL/kg standart vitamin-mineral karma premiksi
  sutYemi: 12.80,          // TL/kg 19 HP fabrika süt sığırı yemi (640 TL/50 kg çuval)
  sutYemiYuksekVerim: 14.20, // TL/kg 21 HP pik dönem süt yemi (710 TL/50 kg çuval)
  besiYemi: 11.60,         // TL/kg fabrika besi geliştirme yemi (580 TL/50 kg çuval)
  besiBitirmeYemi: 12.20,  // TL/kg fabrika besi bitirme yemi (610 TL/50 kg çuval)
  kuzuBuyutmeYemi: 13.50,  // TL/kg pelet kuzu büyütme yemi (675 TL/50 kg çuval)
  kuzuBaslangicYemi: 14.80,// TL/kg kuzu başlangıç yemi (740 TL/50 kg çuval)
  kanatliYemi: 17.50,      // TL/kg etlik piliç (broiler) bitirme pelet yemi
  broilerBaslangicYemi: 19.20, // TL/kg broiler granül başlangıç yemi
  yumurtaYemi: 13.60       // TL/kg yumurta tavuğu pik karma yemi (680 TL/50 kg çuval)
};

// ============================================================================
// 6. HAYVAN_ICTIHAT_DB - Supreme Court Decisions Database
// ============================================================================
/**
 * Hayvancılık tazminatları, TARSİM sigortası, elektrik çarpması, veteriner kusuru
 * ve zehirlenme uyuşmazlıklarına ilişkin emsal Yargıtay ilamları.
 */
export const HAYVAN_ICTIHAT_DB: HayvanIctihat[] = [
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2021/4812",
    karar: "2022/1945",
    tarih: "15.03.2022",
    konu: "Trafik kazasında büyükbaş hayvan telefi tazminatı, emsal piyasa değeri ve hurda tenzili",
    ozet: "Karayolunda meydana gelen trafik kazasında telef olan damızlık gebe düvenin tazminat hesabında; kaza tarihindeki piyasa rayiç değeri İlçe Tarım ve Orman Müdürlüğü ile Damızlık Sığır Yetiştiricileri Birliği verilerine göre tespit edilmeli, hayvanın acil kesimle etinden veya derisinden yararlanılmış ise elde edilen veya elde edilmesi mümkün olan hurda (kurtarma) bedeli tespit edilerek tazminattan mahsup edilmelidir. Başıboş bırakma sebebiyle hayvan sahibinin müterafik kusuru TBK m.52 uyarınca değerlendirilmelidir.",
    anahtar: ["trafik kazası", "büyükbaş", "hurda tenzili", "piyasa rayici", "müterafik kusur", "TBK 52"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2020/2941",
    karar: "2021/3382",
    tarih: "07.04.2021",
    konu: "Elektrik dağıtım hattı arızası ve kopması sonucu ahırda büyükbaş hayvanların akıma kapılarak ölümü",
    ozet: "Elektrik dağıtım şirketine ait nakil hattının bakımsızlık nedeniyle koparak mandıra çatısına temas etmesi sonucu 14 adet sağmal Holstein ineğin elektrik akımına kapılarak telef olduğu olayda; dağıtım şirketi TBK m.71 ve m.69 gereğince kusursuz (tehlike) sorumlusudur. Bilirkişi heyeti, hayvanların ölüm tarihindeki damızlık canlı değerinin yanında, laktasyon dönemine göre makul süre için mahrum kalınan süt gelirini de (yem ve bakım masrafları tenzil edilerek net gelir olarak) hesaplamalıdır.",
    anahtar: ["elektrik çarpması", "kusursuz sorumluluk", "dağıtım şirketi", "damızlık inek", "süt gelir kaybı", "TBK 71"]
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2019/3815",
    karar: "2021/1102",
    tarih: "18.02.2021",
    konu: "Tarımsal ilaçlama (pestisit) kaynaklı küçükbaş sürü telefi ve illiyet bağı tespiti",
    ozet: "Komşu pamuk tarlasında yapılan zirai ilaçlama sonrasında meradaki su kanalından su içen ve otlayan 62 adet Akkaraman koyunun telef olması iddiasıyla açılan davada; İlçe Tarım Müdürlüğü ve Veteriner Kontrol Enstitüsü toksikoloji laboratuvarı nekropsi raporu bulunmadan yalnızca tanık anlatımıyla illiyet bağı kurulamaz. Raporla zehirlenmenin kesinleşmesi halinde, telef olan anaç koyun ve sütten kesilmemiş kuzuların olay tarihindeki emsal pazar rayici üzerinden tazminat belirlenmelidir.",
    anahtar: ["tarımsal ilaçlama", "pestisit zehirlenmesi", "küçükbaş koyun", "illiyet bağı", "nekropsi", "laboratuvar raporu"]
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2022/1420",
    karar: "2023/2180",
    tarih: "24.05.2023",
    konu: "TARSİM Hayvan Hayat Sigortası kapsamında doğum felci ve peritonit hasarı eksper tespiti",
    ozet: "TARSİM Hayvan Hayat Sigortası poliçesiyle teminat altına alınan damızlık Simental ineğin doğum felci (hipokalsemi) ve akabinde gelişen peritonit sonucu ölümü vakasında; TARSİM Genel Şartları uyarınca sigortalının ihbar yükümlülüğünü süresinde yerine getirdiği, veteriner hekim raporunun mevcut olduğu durumlarda, mezbaha kesim tutanağı ve kemik/et kavurma kurtarma bedeli tenzil edilerek poliçe limitleri dâhilinde tazminat ödenmesi gerekir. Hayvanın kulak küpe no'sunun TÜRKVET kayıtlarıyla tam uyumlu olması zorunludur.",
    anahtar: ["TARSİM", "hayvan hayat sigortası", "eksper raporu", "TÜRKVET", "kulak küpesi", "kurtarma bedeli", "doğum felci"]
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2020/5610",
    karar: "2022/3419",
    tarih: "11.10.2022",
    konu: "Kanatlı etlik piliç (broiler) kümes yangını, dönem sonu canlı ağırlık ve yem masrafı tenzili",
    ozet: "35.000 adet etlik piliç kapasiteli kümeste elektrik panosu yangını sonucu 28 günlük 31.000 adet broilerin dumandan boğularak telef olması sebebiyle açılan tazminat davasında; henüz kesim yaşına (42 gün) gelmemiş piliçlerin tazminat hesabı kesim sonu fiyatı üzerinden doğrudan yapılamaz. 28. gündeki canlı ağırlık, harcanan kümülatif yem maliyeti, civciv alış bedeli ve genel giderler toplanarak veya dönem sonu satış hasılatından yapılmayan 14 günlük yem ve işletme giderleri tenzil edilerek zarar hesaplanmalıdır.",
    anahtar: ["broiler", "kümes yangını", "etlik piliç", "canlı ağırlık", "yapılmayan masraflar tenzili", "fcr yem hesabı"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2021/6105",
    karar: "2022/4510",
    tarih: "19.09.2022",
    konu: "Hayvan pazarından alınan belgesiz büyükbaşın sürüye Şap ve Brusella bulaştırması, 5996 SK sorumluluk",
    ozet: "Davalıdan satın alınan ve yurtiçi veteriner sağlık raporu ile sevk belgesi bulunmayan sığırın, davacının ari çiftliğindeki sürüye Brusella ve Şap hastalığı bulaştırması sonucu Tarım İlçe Müdürlüğü'nce karantina uygulanması ve mecburi kesime sevk edilen hayvanlar nedeniyle açılan davada; 5996 Sayılı Kanun ve TBK m.219 (ayıp) hükümleri uyarınca davalı kusurludur. Mecburi kesim bedeli ile damızlık değer farkı ve karantina süresince uğranılan süt kaybı teknik bilirkişi marifetiyle hesaplanmalıdır.",
    anahtar: ["5996 sayılı kanun", "bulaşıcı hastalık", "brusella", "şap", "mecburi kesim", "karantina zararı", "ayıplı hayvan"]
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2019/5540",
    karar: "2020/7112",
    tarih: "26.11.2020",
    konu: "Meyve bahçesinde gündüz çiçeklenme dönemi ilaçlama sonucu arı kovanlarının sönmesi",
    ozet: "Elma bahçesi sahibinin gündüz arıların uçuş yaptığı çiçeklenme döneminde neonikotinoid grubu insektisit uygulaması yapması sebebiyle 50 metre mesafedeki arılıktaki 90 kovan arının telef olması uyuşmazlığında; Zirai Mücadele ve Zirai Karantina Kanunu ile Arıcılık Yönetmeliği uyarınca çiçeklenme döneminde gündüz ilaçlama yapmak ağır kusurdur. Bilirkişi heyeti, sönen kovanların ana arı ve koloni bedelini ve o sezon elde edilecek ortalama bal, polen ve propolis gelir kaybını hesaplamalıdır.",
    anahtar: ["arıcılık", "kovan sönmesi", "çiçeklenme dönemi ilaçlama", "insektisit", "koloni tazminatı", "bal gelir kaybı"]
  },
  {
    daire: "Yargıtay 15. Hukuk Dairesi",
    esas: "2020/1204",
    karar: "2021/5890",
    tarih: "14.12.2021",
    konu: "Veteriner hekimin hatalı sezaryen ameliyatı ve sterilizasyon kusuru sonucu damızlık inek ölümü",
    ozet: "Doğum güçlüğü çeken yüksek vasıflı damızlık ineğe müdahale eden veteriner hekimin sahada yetersiz sterilizasyon ve hatalı dikiş tekniği uygulaması sebebiyle hayvanın peritonit ve septisemi sonucu ölmesi vakasında; veteriner hekim ile hayvan sahibi arasındaki ilişki vekâlet sözleşmesi (TBK m.502 vd.) niteliğindedir. Hekim, mesleğinin gerektirdiği en hafif kusurdan dahi sorumludur. Yüksek Ziraat Mühendisi ve Veteriner Hekim bilirkişilerce hayvanın damızlık değeri ve operasyon kusuru tespit edilerek hüküm kurulmalıdır.",
    anahtar: ["veteriner hatası", "malpraktis", "vekâlet sözleşmesi", "özen borcu", "damızlık inek", "sezaryen komplikasyonu"]
  }
];

// ============================================================================
// 7. HAYVAN_AI_KNOWLEDGE - AI Expert Knowledge Base
// ============================================================================
/**
 * Bilirkişi Asistanı AI modülü için hayvancılık hesaplama formülleri,
 * yasal mevzuat dayanakları ve uzmanlık bilgi tabanı.
 */
export const HAYVAN_AI_KNOWLEDGE: Record<string, HayvanAiKnowledgeItem> = {
  "karkas-randimani": {
    keywords: ["karkas", "randıman", "karkas randımanı", "soğuk karkas", "sıcak karkas", "hesaplama"],
    badge: "Teknik Tanım & Formül",
    answer: "Karkas Randımanı = (Karkas Ağırlığı / Kesim Öncesi Canlı Ağırlık) × 100 formülü ile hesaplanır. Kesim sonrasında iç organlar, deri, baş, ayaklar ve kan ayrıldıktan sonra geriye kalan gövdeye 'sıcak karkas', +4°C'de 24 saat soğutulduktan sonraki ağırlığa 'soğuk karkas' denir (soğuma firesi yaklaşık %1.5-2'dir). Türkiye standartlarında sığırlarda karkas randımanı kültür ırklarında (Simental, Şarole, Limuzin) %58-64, sütçü Holstein ırkında %52-55, yerli ırklarda %46-50'dir. Küçükbaşta kuzularda %48-52, koyunlarda %44-48, keçilerde %42-46'dır. Broiler piliçlerde ise randıman %72-76 mertebesindedir."
  },
  "telef-tazminat-hesabi": {
    keywords: ["telef", "tazminat", "ölüm", "kaza", "hurda tenzili", "kurtarma bedeli", "zarar"],
    badge: "Bilirkişi Metodolojisi",
    answer: "Hayvan telefinde tazminat hesabı 3 temel basamaktan oluşur: 1) Olay/kesim tarihindeki 'Rayiç Değerin Tespiti': İlçe Tarım ve Orman Müdürlüğü, Damızlık Birlikleri ve Ticaret Borsası verilerine göre hayvanın ırkı, yaşı, gebelik/laktasyon durumu ve canlı ağırlığı gözetilerek çıplak pazar değeri bulunur. 2) 'Kurtarma (Hurda) Bedelinin Mahsubu': Hayvan kaza veya olay sonrasında mundar olmadan acil mecburi kesime (mundar olmama şartıyla) sevk edilmiş ve eti/derisi değerlendirilmişse, mezbaha kesim tutanağı veya tartım fişiyle belirlenen bedel tenzil edilir. 3) 'Müterafik Kusur ve Masraf Tenzili': Hayvan sahibinin başıboş bırakma veya ihmal kusuru varsa (TBK m.52) oranında indirim yapılır. Formül: Net Zarar = (Piyasa Rayici + Varsa Verim Gelir Kaybı) - (Kurtarma/Et Bedeli) × (1 - Müterafik Kusur Oranı)."
  },
  "sut-inegi-amortisman": {
    keywords: ["amortisman", "süt ineği", "hurda değeri", "yıpranma", "faydalı ömür", "değer düşüşü"],
    badge: "Muhasebe & Değerleme",
    answer: "Süt sığırcılığında inekler biyolojik varlık olup amortismana tabidir. Bir sağmal ineğin ekonomik ve damızlık ömrü ortalama 5-6 yıldır (ortalama 4-5 laktasyon periyodu). Amortisman Hesabı: Yıllık Amortisman Payı = (İlk Damızlık Değeri - Hurda/Reforme Kasaplık Kesim Değeri) / Faydalı Ömür (Yıl). Örneğin; 120.000 TL'ye alınan damızlık düve 5 yıl sonra 650 kg canlı ağırlık ve %50 randımanla 325 kg karkas × 315 TL = 102.375 TL kasaplık değerine ulaşıyorsa, aradaki 17.625 TL'lik değer farkı 5 yıla bölünerek yıllık amortisman maliyeti bulunur. Yaş ilerledikçe ineğin damızlık değeri azalır, kasaplık değerine yaklaşır."
  },
  "damizlik-deger-tespiti": {
    keywords: ["damızlık", "değer tespiti", "soy kütüğü", "pedigri", "gebe düve", "birlik kaydı"],
    badge: "Yargıtay Kriteri",
    answer: "Damızlık değer tespiti yapılırken hayvanın sıradan bir kasaplık et hayvanı olmadığı gözetilmelidir. Yargıtay'ın yerleşik içtihatlarına göre damızlık vasfının kabulü için: 1) TÜRKVET ve Soy Kütüğü / Ön Soy Kütüğü (Damızlık Birliği) sistemine kayıtlı olması, 2) Irk özelliklerini taşıması ve suni tohumlama belgelerinin bulunması, 3) Yaş ve gebelik/doğum sayısı (en değerli dönem 1. veya 2. gebelikteki 24-36 aylık düve dönemidir), 4) Süt verim kayıtları ve ebeveyn süt/et indeksleri dikkate alınır. Damızlık hayvanın değeri, aynı yaştaki kasaplık karkas değerinden %30 ila %60 oranında daha yüksektir."
  },
  "tarsim-hayvan-sigortasi": {
    keywords: ["tarsim", "hayvan hayat sigortası", "poliçe", "eksper", "hasar ihbarı", "muafiyet"],
    badge: "Sigorta Hukuku",
    answer: "5363 Sayılı Tarım Sigortaları Kanunu kapsamında TARSİM Hayvan Hayat Sigortası; süt/besi sığırları, küçükbaş ve kümes hayvanlarında hastalıklar, doğum felci, cerrahi operasyonlar, zehirlenmeler ve doğal afet kaynaklı ölümleri teminat altına alır. Hasar halinde: 1) Sigortalı 24 saat içinde TARSİM ihbar hattına bildirimde bulunmalıdır, 2) TARSİM eksperi gelene kadar hayvanın küpesi ve leşi korunmalıdır, 3) Acil kesim gerekirse eksper onayı veya 2 resmi veteriner hekim raporuyla tutanak altına alınmalıdır, 4) Tazminat = (Poliçe Sigorta Bedeli veya Güncel Rayiçten düşük olanı) - (Kurtarma/Karkas Bedeli) - (Poliçe Muafiyet/Müşterek Sigorta Oranı [%10-20]) formülü ile ödenir."
  },
  "besi-danasi-maliyet": {
    keywords: ["besi", "besi danası", "canlı ağırlık artışı", "fcr", "rasyon maliyeti", "günlük masraf"],
    badge: "Besi Analizi",
    answer: "Besi danası maliyet hesabı şu parametrelerle yapılır: 1) Besi Materyali Alış Bedeli (Örn: 250 kg canlı ağırlıkta dana: ~58.000 TL), 2) Besi Süresi (Ortalama 210 gün), 3) Günlük Canlı Ağırlık Artışı (GCAA: 1.2 - 1.4 kg/gün), 4) Kesim Canlı Ağırlığı (Örn: 250 kg + [210 × 1.3 kg] = 523 kg), 5) Yem Dönüşüm Oranı (FCR: 6.5 - 7.5 kg karma yem / 1 kg canlı artış), 6) Günlük Yem Masrafı: 10-12 kg rasyon × ~13 TL/kg = 140-160 TL/gün, 7) Genel İdare, Veteriner-Aşı, İşçilik ve Finansman Payı (yem maliyetinin yaklaşık %15-20'si). Kesim geliri ile toplam maliyet arasındaki fark işletme brüt kârını verir."
  },
  "kucukbas-suru-degerleme": {
    keywords: ["küçükbaş", "sürü değerleme", "koyun", "koç", "kuzu", "sürü kompozisyonu"],
    badge: "Sürü Değerleme",
    answer: "Küçükbaş bir sürünün toptan değer tespitinde sürü yaş ve cinsiyet kompozisyonuna ayrılmalıdır: 1) Anaç Damızlık Koyun/Keçi (%60-65), 2) Damızlık Koç/Teke (%3-5; her 25-30 anaca 1 koç), 3) Toklu/Şişek (Genç dişi damızlık adayı, %15-20), 4) Kuzu/Oğlak (%20-30). Her grup için ayrı piyasa birim fiyatı uygulanır. Sürünün tekil perakende toplamından toptan satış indirimi (%5-10) yapılabilirken; tescilli damızlık, ari işletme veya elit sürü vasfı varsa %20-30 ilave damızlık primi uygulanır."
  },
  "kanatli-kumes-kapasite": {
    keywords: ["kümes", "kanatlı kapasitesi", "broiler", "yerleşim sıklığı", "havalandırma", "m2 tavuk"],
    badge: "Kapasite Standartları",
    answer: "Kanatlı kümeslerinde yasal kapasite yönetmeliklerle belirlenmiştir. Broiler (Etlik Piliç) Yetiştiriciliğinde: Taban alanı üzerinden yerleşim sıklığı azami 33-39 kg canlı ağırlık/m² (veya iyi havalandırmalı tünel sistemli kümeslerde 16-18 adet piliç/m²) kabul edilir. Örneğin 1.000 m² faydalı alana sahip modern bir etlik kümesin tek dönem kapasitesi 16.000 - 18.000 adettir. Yılda ortalama 5.5 - 6 dönem üretim yapılır. Yumurta Tavukçuluğunda serbest gezen sistemde (free-range) kapalı alanda azami 9 tavuk/m² ve açık alanda 4 m²/tavuk gezinti alanı şartı aranır."
  },
  "kacak-kesim-zarari": {
    keywords: ["kaçak kesim", "hırsızlık", "deri sakatat", "karkas kaybı", "cezai kesim"],
    badge: "Adli Veterinerlik",
    answer: "Çalınan veya kaçak kesilen hayvanlarda canlı hayvan bedelinin yanı sıra yan ürün kayıpları da hesaplanır. Sığırlarda canlı ağırlığın yaklaşık %52-58'i karkas et, %7-8'i ham deri, %15-18'i yenilebilir sakatat (karaciğer, akciğer, kalp, işkembe, kelle, ayaklar) ve iç yağdır. Kaçak kesimde etler kontrolsüz parçalandığı veya imha edildiği için zarar hesaplanırken: Hayvanın canlı rayiç bedeli + elde edilebilecek karkas et, sakatat ve deri değeri esas alınır; veterinerlik sağlık riski nedeniyle imha zorunluluğu varsa tam canlı hayvan piyasa bedeli hüküm altına alınır."
  },
  "hayvan-nakil-hasari": {
    keywords: ["nakil", "sevk hasarı", "taşıma", "morarma", "kondisyon kaybı", "kilo kaybı", "taşıyıcı"],
    badge: "Taşıma Hukuku (TTK)",
    answer: "Hayvan nakliyesi esnasında (kamyon devrilmesi, aşırı sıkışıklık, havalandırma yetersizliği, ani fren) oluşan zararlarda: 1) Canlı Ağırlık Kaybı (Nakil Firesi): Normal sevklerde mesafe ve süreye göre %3-6 fire normaldir; ancak uygunsuz sevk nedeniyle aşırı kondisyon kaybı veya susuzluktan ölümlerde eksper tartım farkı belirlenir. 2) Hematom ve Morarma (Karkas Değer Düşüklüğü): Düşme, sıkışma veya darbe sonucu karkasta oluşan yaygın kan oturması (hematomlu bölgeler) mezbahada veteriner hekimce tıraşlanıp imha edilir; bu miktar kadar et kaybı ve karkas sınıfı düşüşü (örneğin U sınıfından R veya O sınıfına düşüş) tazminata dahil edilir."
  },
  "brusella-tazminat": {
    keywords: ["brusella", "tüberküloz", "şap", "tazminatlı hastalık", "5996", "itlaf", "mecburi kesim"],
    badge: "Mevzuat Tazminatı",
    answer: "5996 Sayılı Kanun ve Hayvan Hastalıklarında Tazminat Yönetmeliği uyarınca; Bruselloz ve Tüberküloz ihbarı mecburi ve tazminatlı hastalıklardır. İlçe Tarım Müdürlüğü komisyonunca hayvanın yerel kıymet takdiri yapılır. Mecburi kesime gönderilen sığırların karkas et bedeli hayvan sahibine mezbaha tarafından ödenir; Bakanlık ise takdir edilen kıymet bedelinin %50'si ile %90'ı arasındaki farkı (tazminat desteklemesi) yetiştiriciye öder. Bilirkişi uyuşmazlığında, Bakanlıkça ödenen mecburi kesim tazminatı mahsup edilerek davalıdan talep edilebilecek net bakiye damızlık zararı hesaplanır."
  },
  "aricilik-bal-verimi": {
    keywords: ["arıcılık", "kovan", "bal verimi", "koloni", "oğul", "polen", "arılık tazminatı"],
    badge: "Arıcılık Hesap Cetveli",
    answer: "Arıcılık zararlarında (ayı saldırısı, yangın, pestisit zehirlenmesi, sel) zarar kalemi 3 unsurdan oluşur: 1) Kovan ve Petek Maddi Değeri: Boş fenni kovan (1.200 - 1.800 TL) + petek ve temel petek mum bedeli. 2) Canlı Koloni ve Ana Arı Değeri: Sağlıklı 8-10 çerçeveli arılı koloni (2.500 - 3.800 TL) + tescilli ana arı bedeli. 3) Mahrum Kalınan Sezonluk Bal/Ürün Geliri: Türkiye ortalamasında fenni kovanda yıllık süzme/petek bal verimi bölgeye göre 15 - 25 kg/kovandır. İlaçlama veya olay sezon başında gerçekleşmişse o yılın bal, polen (1-2 kg) ve propolis hasılatı net gelir olarak eklenir."
  },
  "yem-rasyonu-maliyet": {
    keywords: ["rasyon", "kaba yem", "kesif yem", "kuru madde", "günlük yem", "besleme maliyeti"],
    badge: "Zootekni & Besleme",
    answer: "Süt ve besi sığırlarında günlük kuru madde (KM) tüketimi canlı ağırlığın %3'ü ila %3.5'i kadardır (600 kg inek için yaklaşık 18-20 kg KM). Dengeli bir sağmal inek rasyonu: %50-60 Kaba Yem (15-20 kg mısır silajı, 3-5 kg kuru yonca, 1-2 kg saman) ve %40-50 Kesif Yem (8-10 kg fabrika süt yemi, 1-2 kg arpa ezmesi, mineral-vitamin) ihtiva eder. 2024-2025 fiyatlarıyla 25-28 litre süt veren bir kültür ırkı ineğin günlük toplam yem maliyeti 220 - 250 TL arasındadır. Bir litre sütün yem maliyeti yaklaşık 8.5 - 9.5 TL olup, USK çiğ süt fiyatı (16.5 TL) ile 1.5 parite dengesi hedeflenir."
  },
  "hayvan-rehin-haciz": {
    keywords: ["haciz", "rehin", "icra", "kıymet takdiri", "yediemin", "muhafaza", "İİK"],
    badge: "İcra & İflas Değerlemesi",
    answer: "İcra ve İflas Kanunu (İİK m.82, m.87) ve Taşınır Rehin Kanunu kapsamında hayvan haczinde bilirkişi; hayvanların kulak küpe numaralarını tek tek zapta geçirir, gebelik muayenesini, yaşını ve genel kondisyonunu belirler. Kıymet takdirinde o günkü ticaret borsası ve mezbaha toptan fiyatları esas alınır. Haczedilen hayvanların muhafazası (yediemin ücreti, günlük yemleme ve bakım giderleri, sağım yapılıyorsa süt gelirinin nemalandırılması) icra müdürlüğü gözetiminde hesaba katılır. Damızlık vasfı taşıyan süt hayvanlarında damızlık piyasa rayici, aksi halde canlı baskül kesim değeri takdir edilir."
  },
  "elektrik-carpmasi-tazminat": {
    keywords: ["elektrik çarpması", "akıma kapılma", "adım gerilimi", "otopsi", "dağıtım şirketi", "kaçak"],
    badge: "Bilirkişi Usulü",
    answer: "Hayvanların elektriğe karşı direnci insanlara göre çok düşüktür; 24-30 Volt gibi düşük gerilimler dahi dört ayak arasındaki 'adım gerilimi' sebebiyle kalbin durmasına ve ölüme yol açar. Bilirkişi incelemesinde: 1) Olay yeri elektrik dağıtım şirketinin iletim hattı, trafo veya kopuk tel durumu incelenmeli, 2) İlçe Tarım veya serbest veteriner hekimce düzenlenen 'elektrik çarpması sonucu asfiksi ve kalp durması' konulu ölüm tutanağı aranmalı, 3) Dış bakıda tırnaklarda, burun ucunda veya temas noktalarında yanık izleri fotoğraflanmalı, 4) Hayvanın canlı rayiç bedeli ile varsa gebe ise yavru ve laktasyondaki süt kaybı tespit edilmelidir."
  }
};

// ============================================================================
// 8. HAYVAN_DEGERLEME_REHBER_ILKELERI - Guide Principles for Valuation
// ============================================================================
/**
 * Bilirkişilik Kanunu, HMK ve Yargıtay standartları doğrultusunda hayvancılık
 * değerleme raporlarında uyulması zorunlu 4 temel rehber ilke.
 */
export const HAYVAN_DEGERLEME_REHBER_ILKELERI: IlkeMadde[] = [
  {
    id: "piyasa-rayici-emsal",
    baslik: "Piyasa Rayici ve Resmi Emsal Satış Araştırması Zorunluluğu",
    kaynak: "Yargıtay 3. HD 2021/4812 E., HMK m.266 & m.279, TBK m.50-51",
    ozet: "Telef olan veya değer takdiri gereken hayvanların bedeli soyut tahminlerle belirlenemez; resmi kurum ve birliklerin olay tarihindeki emsal satış verilerine dayandırılmalıdır.",
    detay: "Zirai bilirkişi, hayvanın değerini tespit ederken uyuşmazlığın gerçekleştiği tarihteki yerel İlçe Tarım ve Orman Müdürlüğü, Ticaret Borsası bültenleri, Damızlık Sığır/Koyun-Keçi Yetiştiricileri Birliği ve Ulusal Kırmızı Et Konseyi (UKON) resmi fiyat cetvellerini dosyaya kazandırmalıdır. Yalnızca tarafların beyanına veya internetteki ilan fiyatlarına dayanılarak değer takdir edilemez.",
    kontrolListesi: [
      "Olay tarihindeki İlçe Tarım ve Orman Müdürlüğü resmi rayiç fiyat yazısı dosyaya eklendi mi?",
      "Ticaret Borsası canlı baskül veya karkas kesim bültenleri incelendi mi?",
      "Damızlık birliklerinin gebe düve / damızlık koç resmi satış tarifesi dikkate alındı mı?",
      "Hesaplanan birim fiyatın gerekçesi raporda kaynaklarıyla birlikte açıklandı mı?"
    ],
    ornekIhlal: "“Mahallinde yapılan incelemede telef olan ineğin değeri takdiren 130.000 TL olarak kabul edilmiştir.” (Kaynak belirtilmeksizin soyut takdir - Bozma sebebi).",
    dogruUygulama: "“Olay tarihi olan Ekim 2024 itibarıyla Manisa İli Damızlık Sığır Yetiştiricileri Birliği ve UKON Ege Bölgesi resmi kombina karkas verileri incelenmiş; 2. laktasyondaki gebe Holştayn ineğin damızlık rayicinin 125.000 TL olduğu resmi belgelerle tespit edilmiştir.”"
  },
  {
    id: "irk-yas-damizlik-vasfi",
    baslik: "Irk, Yaş, Verim ve Damızlık Vasfını Birlikte Değerlendirme İlkesi",
    kaynak: "Yargıtay 3. HD 2020/2941 E., 5996 Sayılı Kanun, TÜRKVET Yönetmeliği",
    ozet: "Hayvanın sadece türü (sığır, koyun) üzerinden genel bir değer biçilemez; ırkı, yaşı, gebelik durumu, soy kütüğü kaydı ve süt/et verim kabiliyeti somut olarak gözetilmelidir.",
    detay: "Aynı türdeki bir hayvan etçi, sütçü, kombine veya yerli ırk olmasına göre 2-3 kat fiyat farkı gösterebilir. Buzağılama sayısı, laktasyon günü, tohumlama sertifikası, pedigri kaydı ve TÜRKVET kulak küpe verileri raporda tek tek dökümlenmeli; yaşlı veya reforme hayvan ile ilk gebeliğindeki yüksek verimli damızlık düve ayrımı yapılmalıdır.",
    kontrolListesi: [
      "Hayvanın TÜRKVET küpe sorgulama kaydı (ırk, yaş, cinsiyet, işletme hareketleri) dosyaya celbedildi mi?",
      "Soy kütüğü / ön soy kütüğü kayıtları ve damızlık sertifikası doğrulandı mı?",
      "Hayvanın gebe olup olmadığı ve kaçıncı laktasyonda bulunduğu değerlendirildi mi?",
      "Yaş ilerlemesine bağlı fizyolojik yıpranma veya amortisman hesabı yapıldı mı?"
    ],
    ornekIhlal: "“Telef olan 10 adet büyükbaş hayvan için baş başına ortalama 90.000 TL hesaplanmıştır.” (Irk, yaş ve damızlık ayrımı yapılmaksızın toptancı yaklaşım - Hatalı).",
    dogruUygulama: "“Telef olan 10 baştan 6 adedinin 3-4 yaşlarında safkan gebe Simental (tanesi 140.000 TL), 2 adedinin 6 yaşında süt verimi düşmüş Holstein (tanesi 85.000 TL), 2 adedinin ise 8 aylık besi danası (tanesi 55.000 TL) olduğu TÜRKVET kayıtlarıyla belirlenerek kademelendirilmiştir.”"
  },
  {
    id: "telef-hurda-mahsubu",
    baslik: "Telef Hesabında Hurda (Kurtarma / Kesim) Bedelinin Mahsubu İlkesi",
    kaynak: "Yargıtay 3. HD 2021/4812 E., TBK m.50, m.52, Sebepsiz Zenginleşme Yasağı",
    ozet: "Telef olan hayvan mecburi kesime sevk edilerek eti, sakatatı veya derisi ekonomik olarak değerlendirilmişse, elde edilen veya elde edilmesi mümkün olan meblağ tazminattan indirilir.",
    detay: "Zarar gören taraf haksız fiil veya kaza nedeniyle zarara uğrarken sebepsiz zenginleşemez. Yaralanan veya can çekişen hayvan veteriner hekim gözetiminde mezbahaya gönderilerek mundar olmadan kesilmişse, karkas et ve deri satışından elde edilen net kurtarma bedeli hayvanın olay tarihindeki çıplak piyasa değerinden mahsup edilmelidir.",
    kontrolListesi: [
      "Hayvanın olay anında derhal ölüp ölmediği (mundar olup olmadığı) araştırıldı mı?",
      "Mecburi kesim yapılmışsa resmi mezbaha kesim ve tartım makbuzu incelendi mi?",
      "Kesim bedelinden nakliye ve kesimhane masrafları düşüldü mü?",
      "Etin insan tüketimine uygun olmaması (imha tutanağı) halinde imha belgesi dosyaya eklendi mi?"
    ],
    ornekIhlal: "Mezbaha kesiminde 320 kg karkas eti 110.000 TL bedelle satılan hayvan için bu bedel mahsup edilmeksizin 135.000 TL tam canlı bedelinin davalıdan tahsiline karar verilmesi.",
    dogruUygulama: "“Hayvanın olay tarihindeki damızlık canlı değeri 130.000 TL olup, kaza sonrası mecburi kesimden elde edilen 310 kg soğuk karkas et ve deri satış hasılatı olan 108.500 TL mahsup edilmiş; bakiye gerçek zarar 21.500 TL olarak tespit edilmiştir.”"
  },
  {
    id: "otopsi-veteriner-zorunlulugu",
    baslik: "Veteriner Hekim Raporu ve Otopsi / Nekropsi Zorunluluğu İlkesi",
    kaynak: "Yargıtay 11. HD 2019/3815 E., 5996 Sayılı Kanun m.4, HMK m.282",
    ozet: "Ölüm nedeni, zehirlenme, salgın hastalık veya elektrik çarpması iddialarında resmi veteriner hekim otopsi (nekropsi) ve laboratuvar raporu olmadan illiyet bağı kurulamaz.",
    detay: "Zirai bilirkişi veya ziraat mühendisi tek başına hayvanın ölüm sebebini patolojik olarak teşhis edemez. Özellikle pestisit zehirlenmesi, elektrik akımı, bulaşıcı hastalık ve veteriner hekim malpraktis iddialarında İlçe Tarım ve Orman Müdürlüğü resmi veterinerlerince düzenlenen olay yeri inceleme tutanağı ve Veteriner Kontrol Enstitüsü toksikoloji/bakteriyoloji raporu bulunmalıdır.",
    kontrolListesi: [
      "Ölüm anından hemen sonra düzenlenmiş resmi veteriner hekim raporu var mı?",
      "Zehirlenme iddialarında iç organ ve yem/su numuneleri laboratuvara gönderilmiş mi?",
      "Elektrik çarpmasında adım gerilimi ve yanık izleri veteriner hekimce tespit edilmiş mi?",
      "Ziraat bilirkişisi raporunda ölüm sebebi ile davalının eylemi arasındaki illiyet bağı somut belgelere dayandırıldı mı?"
    ],
    ornekIhlal: "Laboratuvar tahlili ve otopsi raporu olmaksızın, salt davacının ve muhtarın beyanına dayanılarak 'koyunların zirai ilaçtan öldüğü' kanaatine varılması (Bozma sebebi).",
    dogruUygulama: "“Bornova Veteriner Kontrol Enstitüsü Müdürlüğü'nün 24.10.2024 tarihli Toksikoloji Raporunda koyunların karaciğer ve mide içeriğinde klorpirifos etken maddesi saptandığı, ölümün komşu parseldeki ilaçlama ile illiyet bağı içinde olduğu tespit edilmiştir.”"
  }
];

// ============================================================================
// 9. HAYVAN_KONTROL_LISTESI - Checklist for Livestock Expert Reports
// ============================================================================
/**
 * Bilirkişinin hayvancılık dosyalarında keşif öncesinden rapor teslimine kadar
 * aşama aşama takip etmesi gereken resmi usul ve teknik kontrol listesi.
 */
export const HAYVAN_KONTROL_LISTESI: KontrolKategori[] = [
  {
    id: "hayvan-kesif-oncesi",
    asama: "1. Aşama",
    baslik: "Keşif Öncesi Hazırlık ve Dosya İnceleme",
    aciklama: "Dava dosyasının kabulü, hayvan kimlik verilerinin taranması ve resmi piyasa fiyatlarının toplanması safhası.",
    maddeler: [
      {
        id: "ko1",
        metin: "Dava dilekçesi, delil listesi ve olay yeri kolluk/jandarma tespit tutanağı eksiksiz incelendi mi?",
        mevzuat: "HMK m.266, m.278",
        onem: "kritik",
        aciklama: "Olay tarihi, yeri, tarafların kusur iddiaları ve zabıt mümzilerinin tespitleri dosyadan çıkarılmalıdır."
      },
      {
        id: "ko2",
        metin: "Telef olan veya uyuşmazlığa konu hayvanların TÜRKVET kulak küpe listesi ve aşı kayıtları dosyaya celbedildi mi?",
        mevzuat: "5996 Sayılı Kanun m.7, TÜRKVET Yönetmeliği",
        onem: "kritik",
        aciklama: "Kayıtsız veya küpesiz hayvanlar için tazminat tespitinde aidiyet ve mülkiyet ispatı güçleşir."
      },
      {
        id: "ko3",
        metin: "Olay tarihi itibarıyla İlçe Tarım, Ticaret Borsası ve Damızlık Birliklerinden emsal fiyat cetvelleri temin edildi mi?",
        mevzuat: "Yargıtay 3. HD 2021/4812 E.",
        onem: "standart",
        aciklama: "Raporun tanzim tarihindeki değil, kesinlikle zarar/olay tarihindeki piyasa rayiçleri esas alınmalıdır."
      },
      {
        id: "ko4",
        metin: "Ölüm sebebi şüpheli ise dosyadaki veteriner otopsi raporu ve laboratuvar analiz sonuçları incelendi mi?",
        mevzuat: "HMK m.282, 5996 SK",
        onem: "kritik",
        aciklama: "Nekropsi raporu yoksa mahkemeden İlçe Tarım veya yetkili enstitüye müzekkere yazılması talep edilmelidir."
      }
    ]
  },
  {
    id: "hayvan-kesif-tespit",
    asama: "2. Aşama",
    baslik: "Keşif ve Yerinde Tespit Safhası",
    aciklama: "Ahır, ağıl veya kaza mahallinde yapılan fiziki sayım, ölçüm, sağlık durumu ve barınak incelemesi.",
    maddeler: [
      {
        id: "kt1",
        metin: "İşletmedeki mevcut canlı hayvanların kulak küpeleri TÜRKVET kayıtları ile karşılaştırılarak teker teker sayıldı mı?",
        mevzuat: "HMK m.279, m.280",
        onem: "kritik",
        aciklama: "Sürüdeki hayvan sayısı, yaş grupları, cinsiyetleri ve fiili mevcudiyet zapta geçirilmelidir."
      },
      {
        id: "kt2",
        metin: "Hayvanların ırkı, diş yapısına göre yaş tespiti, kondisyon skoru (BCS 1-5) ve damızlık özellikleri yerinde belirlendi mi?",
        mevzuat: "Zootekni Değerleme Standartları",
        onem: "standart",
        aciklama: "Beden kondisyonu, meme yapısı ve diş aşınması hayvanın gerçek verim ve pazar değerini doğrudan etkiler."
      },
      {
        id: "kt3",
        metin: "Barınak koşulları (havalandırma, altlık, yemlik, suluk, m2 başına düşen alan ve biyogüvenlik) incelendi mi?",
        mevzuat: "Hayvan Refahı Yönetmeliği",
        onem: "standart",
        aciklama: "Zararın barınak yetersizliğinden veya yetiştirici ihmalinden kaynaklanıp kaynaklanmadığı değerlendirilir."
      },
      {
        id: "kt4",
        metin: "Elektrik kaçağı, yangın veya zehirlenme mahallinde teknik ölçüm ve fiziki iz tespiti yapıldı mı?",
        mevzuat: "HMK m.280, TBK m.71",
        onem: "kritik",
        aciklama: "Kopuk iletken kablolar, panolar, yem tekneleri ve su yalaklarındaki elektrik gerilimi kontrol edilmelidir."
      },
      {
        id: "kt5",
        metin: "Keşif esnasında hayvanlar, barınak ve hasar izleri yüksek çözünürlüklü ve tarihli olarak fotoğraflandı/videoya alındı mı?",
        mevzuat: "Adalet Bakanlığı Bilirkişilik Standartları",
        onem: "standart",
        aciklama: "Görsel deliller rapora ek yapılmak üzere arşivlenmelidir."
      }
    ]
  },
  {
    id: "hayvan-rapor-yazim",
    asama: "3. Aşama",
    baslik: "Rapor Tanzimi ve Hesaplama Standartları",
    aciklama: "HMK 279 standartlarında objektif, denetime elverişli ve bilimsel gerekçeli rapor yazımı.",
    maddeler: [
      {
        id: "ry1",
        metin: "Birim fiyatlar resmi kaynaklara (UKON, USK, Birlikler, İlçe Tarım) dayandırılarak açıkça referans gösterildi mi?",
        mevzuat: "HMK m.279, 6754 SK m.3",
        onem: "kritik",
        aciklama: "Raporun her rakamsal verisi denetlenebilir resmi bir kaynağa ve tarihli belgeye dayandırılmalıdır."
      },
      {
        id: "ry2",
        metin: "Varsa mecburi kesim karkas/hurda bedeli, yapılmayan masraflar ve müterafik kusur indirimi matematiksel olarak yapıldı mı?",
        mevzuat: "TBK m.50, m.52",
        onem: "kritik",
        aciklama: "Kurtarma bedelinin tenzili ve gelir kaybında yapılmayan yem/bakım giderlerinin düşülmesi zorunludur."
      },
      {
        id: "ry3",
        metin: "Raporda 'davalı kusurludur', 'tazminat ödemelidir' gibi hâkimin yerine geçen hukuki nitelendirmelerden kaçınıldı mı?",
        mevzuat: "6754 SK m.3/2, HMK m.266",
        onem: "kritik",
        aciklama: "Yalnızca teknik ve maddi zarar tespiti yapılmalı; hukuki takdir ve hüküm mahkemeye bırakılmalıdır."
      },
      {
        id: "ry4",
        metin: "Rapora TÜRKVET çıktıları, resmi fiyat yazıları, fotoğraflar ve hesaplama tabloları ek yapıldı mı?",
        mevzuat: "HMK m.279/2",
        onem: "standart",
        aciklama: "Tüm ek belgeler numaralandırılarak raporun arkasına eklenmeli ve mahkeme kalemine sunulmalıdır."
      }
    ]
  }
];

// ============================================================================
// 10. TELEF_NEDENLERI - Death & Damage Cause Categories
// ============================================================================
/**
 * Hayvancılık tazminat davalarında en sık karşılaşılan telef ve hasar nedenleri,
 * teknik açıklamaları ve aranması gereken zorunlu deliller.
 */
export const TELEF_NEDENLERI: TelefNedeni[] = [
  {
    neden: "Trafik Kazası",
    nedenKodu: "TK",
    aciklama: "Karayolunda veya köy yolunda motorlu araç çarpması sonucu hayvanın ezilmesi, kemik kırıkları veya iç kanama nedeniyle ölümü.",
    gerekliDeliller: [
      "Kaza tespit tutanağı (Jandarma / Trafik Polisi)",
      "Olay yeri kaza fotoğrafları ve araç fren izi tutanağı",
      "TÜRKVET kulak küpesi ve hayvan kayıt belgesi",
      "Varsa mecburi kesim raporu veya imha tutanağı",
      "İlçe Tarım / Birlik olay tarihindeki emsal rayiç fiyat yazısı"
    ]
  },
  {
    neden: "Elektrik Çarpması",
    nedenKodu: "EC",
    aciklama: "Kopan iletim hatları, mandıra elektrik tesisatı kaçağı, trafo arızası veya nötr kopması nedeniyle adım gerilimine kapılarak ani kardiyak arrest ve asfiksi.",
    gerekliDeliller: [
      "Elektrik dağıtım şirketi (TEDAŞ/EDAŞ) arıza ve müdahale kayıtları",
      "Veteriner hekim nekropsi/ölüm tespit raporu (akım temas ve yanık bulguları)",
      "Elektrik Mühendisi bilirkişi tesisat inceleme ve gerilim ölçüm raporu",
      "Olay yeri ve enerji hattı fotoğrafları",
      "TÜRKVET hayvan varlığı dökümü"
    ]
  },
  {
    neden: "Zehirlenme (Pestisit / Toksik Madde)",
    nedenKodu: "ZH",
    aciklama: "Komşu arazide yapılan kimyasal zirai ilaçlama (insektisit/herbisit), fare zehiri, gübreli su veya zehirli bitki tüketimi sonucu akut intoksikasyon.",
    gerekliDeliller: [
      "Veteriner Kontrol Enstitüsü Toksikoloji Laboratuvarı analiz raporu (organ/mide içeriği)",
      "İlçe Tarım ve Orman Müdürlüğü hasar tespit tutanağı",
      "İlaçlama yapılan arazinin ilaçlama fatura, reçete ve etken madde bilgisi",
      "İçme suyu veya yem numunesi laboratuvar test sonuçları",
      "Görgü tanığı ve muhtarlık beyanları"
    ]
  },
  {
    neden: "Salgın ve Bulaşıcı Hastalık",
    nedenKodu: "SH",
    aciklama: "Şap, Bruselloz, Tüberküloz, Çiçek, Mavidil veya Kuş Gribi gibi ihbarı mecburi hastalıkların sürüye sirayeti ve karantina/itlaf süreci.",
    gerekliDeliller: [
      "İl/İlçe Tarım Müdürlüğü resmi karantina ve kordon kararı",
      "Veteriner Teşhis ve Analiz Enstitüsü resmi virolojik/bakteriyolojik raporu",
      "Tazminatlı itlaf veya mecburi kesim tutanakları",
      "Hayvan sevk raporu ve menşe şahadetnamesi (kaçak sevk iddialarında)",
      "Sürü aşı takip defteri ve TÜRKVET kayıtları"
    ]
  },
  {
    neden: "Yangın",
    nedenKodu: "YG",
    aciklama: "Ahır, ağıl veya kümes binalarında elektrik kontağı, baca tutuşması veya kundaklama sonucu çıkan yangında hayvanların yanarak veya dumandan boğularak (karbonmonoksit zehirlenmesi) telefi.",
    gerekliDeliller: [
      "İtfaiye yangın raporu (çıkış sebebi ve başlangıç noktası)",
      "Olay yeri inceleme ve yangın hasar ekspertiz raporu",
      "Telef olan karkasların sayım ve imha tutanağı (İlçe Tarım)",
      "İşletme kapasite raporu ve dönemlik sürü/kümes kayıtları",
      "Sigorta poliçesi (varsa yangın teminatı poliçesi)"
    ]
  },
  {
    neden: "Sel ve Doğal Afet",
    nedenKodu: "DA",
    aciklama: "Aşırı yağış sonucu dere taşması, sel basması, toprak kayması, çatı çökmesi (kar yükü) veya yıldırım düşmesi sonucu hayvanların telef olması.",
    gerekliDeliller: [
      "Meteoroloji Genel Müdürlüğü olağanüstü hava ve yağış durum raporu",
      "İl/İlçe Afet ve Acil Durum Müdürlüğü (AFAD) hasar tespit tutanağı",
      "İlçe Tarım Müdürlüğü tabii afet zarar ziyan tespit cetveli",
      "Yıldırım düşmesinde veteriner hekim dış bakı ve ölüm tutanağı",
      "Hasarlı tesis ve telef hayvan fotoğrafları"
    ]
  },
  {
    neden: "Yırtıcı Hayvan Saldırısı",
    nedenKodu: "YS",
    aciklama: "Merada otlayan veya ağıldaki küçükbaş/büyükbaş hayvanlara kurt, ayı veya başıboş sahipsiz köpek sürülerinin saldırması sonucu boğulma ve parçalanma.",
    gerekliDeliller: [
      "Veteriner hekim saldırı ve yara izi muayene raporu (diş ve pençe izleri)",
      "Kolluk kuvveti ve muhtar olay yeri tespit tutanağı",
      "Milli Parklar ve Doğa Koruma Şube Müdürlüğü tespit raporu (ayı/kurt vakalarında)",
      "Telef olan ve yaralanan hayvanların kulak küpe tespit listesi",
      "Çoban kusuru ve koruma köpeği mevcudiyeti incelemesi"
    ]
  },
  {
    neden: "Veteriner Hekim Hatası (Malpraktis)",
    nedenKodu: "VH",
    aciklama: "Doğum müdahalesi, sezaryen ameliyatı, yanlış aşı/ilaç enjeksiyonu, doz aşımı veya sterilizasyon eksikliği sonucu hayvanın ölümü veya kalıcı kısırlığı.",
    gerekliDeliller: [
      "Tedavi protokolü, reçete ve kullanılan ilaç/aşı ampulleri",
      "Bağımsız uzman veteriner hekim otopsi (nekropsi) ve patoloji raporu",
      "Veteriner Hekimler Odası bilirkişi / disiplin kurulu inceleme raporu",
      "Hayvanın önceki sağlık ve tohumlama kayıtları",
      "TBK m.502 vekâlet sözleşmesi kapsamındaki kusur tespit cetveli"
    ]
  },
  {
    neden: "Yem Kaynaklı (Asidoz / Küf / Yabancı Cisim)",
    nedenKodu: "YM",
    aciklama: "Bozuk veya mikotoksinli yem, ani rasyon değişikliğine bağlı akut rumen asidozu (şişme) veya yeme karışan tel/çivi nedeniyle retikuloperitonit (RPT).",
    gerekliDeliller: [
      "Şüpheli karma yem / silaj partisinin akredite laboratuvar analiz raporu (mikotoksin, aflatoksin)",
      "Veteriner hekim nekropsi raporu (rumen pH ölçümü, yabancı cisim teşhisi)",
      "Yem tedarik faturası ve irsaliyesi",
      "Yem partisinin parti/lot numarası ve etiket bilgisi",
      "İlçe Tarım yem denetim tutanağı"
    ]
  }
];

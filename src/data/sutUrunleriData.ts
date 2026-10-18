/**
 * SÜT VE SÜT ÜRÜNLERİ BİLİRKİŞİLİK VERİ VE METODOLOJİ VERİTABANI
 * Türk Gıda Kodeksi Çiğ Süt Tebliği, Peynir Tebliği, Fermente Süt Ürünleri Tebliği,
 * Ulusal Süt Konseyi (USK) standartları ve Yargıtay emsal içtihatlarına uygun formülasyonlar.
 */

export interface SutKaliteNormu {
  parametre: string;
  birim: string;
  standartAralik: string;
  min?: number;
  max?: number;
  yasalMevzuat: string;
  aciklama: string;
  hukukiSonuc: string;
}

export const TGK_CIG_SUT_NORMLARI: SutKaliteNormu[] = [
  {
    parametre: "Donma Noktası (Kriyoskopi)",
    birim: "°C",
    standartAralik: "-0.520 ile -0.550",
    min: -0.550,
    max: -0.520,
    yasalMevzuat: "TGK Çiğ Süt Tebliği Madde 5",
    aciklama: "Donma noktasının -0.520 °C'den daha yüksek olması (0 °C'ye yaklaşması) süte su katıldığının (tağşiş) kesin bilimsel kanıtıdır.",
    hukukiSonuc: "Tağşiş tespiti, katılan su oranında bedel tenzili veya haksız fiil tazminatı.",
  },
  {
    parametre: "Titrasyon Asitliği (Soxhlet-Henkel)",
    birim: "°SH",
    standartAralik: "6.0 - 7.5",
    min: 6.0,
    max: 7.5,
    yasalMevzuat: "TS 1018 Çiğ İnek Sütü Standardı",
    aciklama: "8.0 °SH üzerindeki asitlik bakteriyel çoğalma ve laktik asit fermantasyonu sonucu ekşimeyi gösterir; pastörizasyonda pıhtılaşır.",
    hukukiSonuc: "Sütün teknolojik vasfını yitirmesi sebebiyle kabul edilmeme ve imha/döküm haklılığı.",
  },
  {
    parametre: "pH Değeri",
    birim: "pH",
    standartAralik: "6.60 - 6.80",
    min: 6.60,
    max: 6.80,
    yasalMevzuat: "TGK Çiğ Süt Tebliği",
    aciklama: "pH'nın 6.50 altına düşmesi asitleşme, 6.90 üzerine çıkması ise mastitisli süt veya nötralizan (karbonat/kostik) ilavesini gösterir.",
    hukukiSonuc: "Nötralizan ilavesi tağşiş; düşük pH ise bozulma / ayıplı teslim olarak değerlendirilir.",
  },
  {
    parametre: "Süt Yağı",
    birim: "%",
    standartAralik: "Asgari % 3.50",
    min: 3.50,
    yasalMevzuat: "TGK Çiğ Süt Tebliği Ek-1",
    aciklama: "%3.50 altındaki yağ oranı ya ırk özelliği ya da sütten krema çekildiğini (yağ hırsızlığı/tağşiş) gösterir.",
    hukukiSonuc: "Krema çekilmişse tağşiş; sözleşmeye aykırı düşük yağda sözleşmesel cezai iskonto.",
  },
  {
    parametre: "Yağsız Kuru Madde (YKM)",
    birim: "%",
    standartAralik: "Asgari % 8.50",
    min: 8.50,
    yasalMevzuat: "TGK Çiğ Süt Tebliği Ek-1",
    aciklama: "Sütün sudan ve yağdan arındırılmış kuru maddesidir (protein, laktoz, mineraller). Su katıldığında düşer.",
    hukukiSonuc: "Su katma teyidi için donma noktası ile çapraz kontrol parametresidir.",
  },
  {
    parametre: "Somatik Hücre Sayısı (SHS)",
    birim: "hücre/ml",
    standartAralik: "Azami 500.000 (AB Standardı 400.000)",
    max: 500000,
    yasalMevzuat: "TGK Çiğ Süt Tebliği Madde 6",
    aciklama: "Memede mastitis (iltihap) varlığını gösterir. Peynir randımanını ve pıhtı kalitesini düşürür.",
    hukukiSonuc: "Kademeli fiyat iskontosu veya sanayi kabul ret şartı.",
  },
  {
    parametre: "Toplam Canlı Bakteri (TCB)",
    birim: "kob/ml",
    standartAralik: "Azami 100.000",
    max: 100000,
    yasalMevzuat: "TGK Çiğ Süt Tebliği Madde 6",
    aciklama: "Sağım hijyeni ve soğutma tankı performansının göstergesidir. 100.000 üzeri çiğ sütün soğuk zincirinin kırıldığını gösterir.",
    hukukiSonuc: "Soğuk zincir ihlali sebebiyle taşıyıcı veya depolayıcının sorumluluğu.",
  },
];

/**
 * MANDIRA MAMUL ÜRÜN RANDIMAN VE SÜT DÖNÜŞÜM ÇİZELGELERİ
 */
export interface UrunRandimani {
  id: string;
  urunAdi: string;
  kategori: "Peynir" | "Tereyağı" | "Fermente" | "Konsantre";
  sutIhtiyaciKg: number; // 1 kg mamul için gereken ortalama süt (kg)
  randimanMin: number;
  randimanMax: number;
  beklenenRandimanPct: number; // 100 kg sütten çıkan mamul kg
  tipikFirePct: number; // Normal teknolojik fire oranı
  yanUrun: string;
  aciklama: string;
}

export const MANDIRA_RANDIMAN_CETVELI: UrunRandimani[] = [
  {
    id: "beyaz_peynir",
    urunAdi: "Klasik Beyaz Peynir (Tam Yağlı)",
    kategori: "Peynir",
    sutIhtiyaciKg: 7.0,
    randimanMin: 6.5,
    randimanMax: 7.5,
    beklenenRandimanPct: 14.3, // 100 kg sütten 14.3 kg peynir
    tipikFirePct: 3.5,
    yanUrun: "Tatlı Peyniraltı Suyu (PAS) ve Lor Peyniri",
    aciklama: "Kültür, maya ve salamura olgunlaştırma evreleri dahil 1 kg tam yağlı klasik beyaz peynir için ortalama 7 kg inek sütü harcanır.",
  },
  {
    id: "taze_kasar",
    urunAdi: "Taze Kaşar Peyniri",
    kategori: "Peynir",
    sutIhtiyaciKg: 11.0,
    randimanMin: 10.5,
    randimanMax: 11.5,
    beklenenRandimanPct: 9.1, // 100 kg sütten 9.1 kg kaşar
    tipikFirePct: 4.0,
    yanUrun: "Yağlı Peyniraltı Suyu (Krema/Tereyağı ayrımı yapılabilir)",
    aciklama: "Haşlama ve yoğurma prosesi sebebiyle su kaybı yüksektir; 1 kg taze kaşar için 10.5 - 11.5 kg süt gerekir.",
  },
  {
    id: "eski_kasar",
    urunAdi: "Eski Kaşar (Olgunlaştırılmış - 6+ Ay)",
    kategori: "Peynir",
    sutIhtiyaciKg: 13.0,
    randimanMin: 12.0,
    randimanMax: 14.0,
    beklenenRandimanPct: 7.7,
    tipikFirePct: 8.5, // Uzun olgunlaşma firesi
    yanUrun: "Peyniraltı Suyu",
    aciklama: "Depolama ve olgunlaşma sürecindeki su kaybı (kuruma firesi) sebebiyle 1 kg için 12-14 kg süt gerektirir.",
  },
  {
    id: "tereyagi_sutten",
    urunAdi: "Köy/Mandıra Tereyağı (%82 Süt Yağı)",
    kategori: "Tereyağı",
    sutIhtiyaciKg: 21.0,
    randimanMin: 20.0,
    randimanMax: 23.0,
    beklenenRandimanPct: 4.75, // 100 kg %3.8 yağlı sütten ~4.75 kg tereyağı
    tipikFirePct: 2.0,
    yanUrun: "Yayıkaltı Suyu (Buttermilk)",
    aciklama: "Sütün kremasının separasyonu ve yayıkta işlenmesiyle elde edilir. 1 kg %82 yağlı tereyağı için ortalama 21 kg inek sütü gerekir.",
  },
  {
    id: "tereyagi_kremadan",
    urunAdi: "Tereyağı (%40 Yağlı Kremadan)",
    kategori: "Tereyağı",
    sutIhtiyaciKg: 2.3, // kg krema
    randimanMin: 2.1,
    randimanMax: 2.5,
    beklenenRandimanPct: 43.5, // 100 kg kremadan 43.5 kg tereyağı
    tipikFirePct: 2.5,
    yanUrun: "Yayıkaltı",
    aciklama: "Satın alınan %40 yağlı pastörize kremadan tereyağı üretiminde 1 kg tereyağı için ~2.3 kg krema sarf edilir.",
  },
  {
    id: "yogurt",
    urunAdi: "Homojenize / Tava Yoğurdu",
    kategori: "Fermente",
    sutIhtiyaciKg: 1.08,
    randimanMin: 1.05,
    randimanMax: 1.12,
    beklenenRandimanPct: 92.5,
    tipikFirePct: 7.5, // Buharlaşma firesi
    yanUrun: "Yok",
    aciklama: "Kuru madde konsantrasyonu veya sütün kaynatılarak uçurulması sonucu 1 kg yoğurt için 1.05 - 1.10 kg süt kullanılır.",
  },
  {
    id: "suzme_yogurt",
    urunAdi: "Süzme (Kese) Yoğurdu",
    kategori: "Fermente",
    sutIhtiyaciKg: 3.2,
    randimanMin: 3.0,
    randimanMax: 3.5,
    beklenenRandimanPct: 31.2,
    tipikFirePct: 4.0,
    yanUrun: "Yoğurtaltı Suyu (YAS)",
    aciklama: "Yoğurdun suyunun süzülmesiyle elde edilir. 1 kg süzme yoğurt için ortalama 3.2 kg süt harcanır.",
  },
  {
    id: "lor_peyniri",
    urunAdi: "Lor Peyniri (Peyniraltı Suyundan)",
    kategori: "Peynir",
    sutIhtiyaciKg: 30.0, // 1 kg lor için ~30 kg peyniraltı suyu veya peynir prosesi
    randimanMin: 25.0,
    randimanMax: 35.0,
    beklenenRandimanPct: 3.0, // 100 kg PAS'tan 3 kg lor
    tipikFirePct: 2.0,
    yanUrun: "Lordan artan deproteinize su",
    aciklama: "Peynir üretiminden arta kalan tatlı peyniraltı suyunun 85-90 °C'ye ısıtılmasıyla serum proteinlerinin çöktürülmesi yöntemidir.",
  },
];

/**
 * SÜT VE SÜT ÜRÜNLERİ TAĞŞİŞ VE HİLE TÜRLERİ
 */
export interface TagsisHileTuru {
  id: string;
  hileTuru: string;
  amac: string;
  tespitYontemi: string;
  saglikVeEkonomikEtki: string;
  cezaiVeHukukiYaptirim: string;
}

export const SUT_TAGSIS_DB: TagsisHileTuru[] = [
  {
    id: "su_katma",
    hileTuru: "Süte Su Katılması",
    amac: "Süt hacmini artırarak haksız tonaj kazancı sağlamak.",
    tespitYontemi: "Kriyoskopik Donma Noktası Cihazı (-0.520 °C eşik değeri) ve Refraktometrik YKM analizi.",
    saglikVeEkonomikEtki: "Sütün besin değeri (protein, kalsiyum) seyreltilir; alıcı sanayici ödediği paranın karşılığında su satın almış olur.",
    cezaiVeHukukiYaptirim: "5996 s.K. m. 41 tağşiş idari para cezası, TBK m. 52/55 haksız kazanç ve ayıp bedel indirimi.",
  },
  {
    id: "krema_cekmek",
    hileTuru: "Yağ Çekme (Krema Ayırma)",
    amac: "Çiğ sütün yağını separatörle alıp tereyağı olarak ayrı satmak, geriye kalan yağı alınmış sütü tam yağlı gibi satmak.",
    tespitYontemi: "Gerber Metodu ile bütirorometre yağ tayini (%3.50 altı çıkması).",
    saglikVeEkonomikEtki: "Peynir randımanını felce uğratır; peynir sert, elastikiyetsiz ve lezzetsiz olur.",
    cezaiVeHukukiYaptirim: "Sözleşmeye aykırılık sebebiyle yağ farkı tazminatı ve parti iadesi.",
  },
  {
    id: "notralizan_katma",
    hileTuru: "Nötralizan (Soda / Karbonat / Kostik) İlavesi",
    amac: "Ekşiyen, asitliği yükselen sütün asitliğini kimyasal baz ile düşürerek fabrikaya kabul ettirmek ve pastörizasyonda kesilmesini önlemek.",
    tespitYontemi: "Sülfürik asit ve rosolik asit testi ile alkali reaksiyon tespiti, kül analizinde yüksek alkalilik.",
    saglikVeEkonomikEtki: "Tüketici sağlığı için toksik risk; sütün doğal kalsiyum dengesi bozulur, peynir mayalanmaz.",
    cezaiVeHukukiYaptirim: "5996 s.K. kapsamında gıda güvenliğini tehlikeye sokma, TCK m. 185 ve m. 186 kamusal suç duyurusu.",
  },
  {
    id: "hidrojen_peroksit",
    hileTuru: "Hidrojen Peroksit (H2O2) İlavesi",
    amac: "Bakteri üremesini durdurarak soğutma sistemi olmayan sütü bozulmadan taşımak.",
    tespitYontemi: "Potasyum iyodür / nişasta reaktif testi ile peroksidaz enzim inaktivasyonunun tespiti.",
    saglikVeEkonomikEtki: "Sütteki vitaminleri (A, C, E) yok eder; mide ve bağırsak mukozasında tahriş yapar.",
    cezaiVeHukukiYaptirim: "Yasak koruyucu madde kullanımı cezası ve partinin derhal imhası.",
  },
  {
    id: "bitkisel_yag_katma",
    hileTuru: "Peynir ve Tereyağına Bitkisel Yağ (Palm / Margarin) Karıştırma",
    amac: "Değerli süt yağını çekip yerine ucuz bitkisel palm veya ayçiçek yağı emülsifiye ederek tereyağı veya kaşar üretmek.",
    tespitYontemi: "Gaz Kromatografisi (GC) ile Yağ Asitleri Kompozisyonu ve Sterol (Beta-sitosterol) analizi.",
    saglikVeEkonomikEtki: "Tüketiciyi dolandırma; taklit ve tağşişli gıda arzı.",
    cezaiVeHukukiYaptirim: "Ürünün piyasadan toplatılması, imhası, marka teşhiri ve 5996 sayılı Kanun adli para cezası.",
  },
  {
    id: "nisasta_jelatin",
    hileTuru: "Yoğurda Nişasta ve Jelatin İlavesi",
    amac: "Düşük kuru maddeli sütten yapılan yoğurdun kıvamını koyulaştırmak ve su salmasını önlemek.",
    tespitYontemi: "İyot-lugol çözeltisi ile mavi/mor renk testi (nişasta için); hidroksiprolin testi (jelatin için).",
    saglikVeEkonomikEtki: "Yoğurt standardına aykırı katkı kullanımı, tüketici aldatmacası.",
    cezaiVeHukukiYaptirim: "TGK Fermente Süt Ürünleri Tebliği ihlali, parti bedelinin iadesi.",
  },
];

/**
 * YARGITAY EMSAL İÇTİHATLARI (SÜT VE SÜT ÜRÜNLERİ)
 */
export interface SutIctihat {
  daire: string;
  esas: string;
  karar: string;
  tarih: string;
  konu: string;
  ozet: string;
  anahtar: string[];
}

export const SUT_ICTIHAT_DB: SutIctihat[] = [
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2021/3412",
    karar: "2022/1945",
    tarih: "14.04.2022",
    konu: "Çiğ Sütte Kriyoskopik Donma Noktası Analizi ile Su Katma Tağşişi ve Fiyat İskontosu",
    ozet: "Davacı mandıra işletmesi tarafından davalı süt üreticileri birliğinden teslim alınan çiğ süt partilerinden akredite laboratuvarda yapılan analizde donma noktasının -0.465 °C çıktığı ve %10.5 oranında su katıldığının teknik olarak kesinleştiği anlaşılmaktadır. Bilirkişi heyetince katılan su oranında teslim tutarından tenzilat yapılması ve boşa ödenen bedelin istirdadına karar verilmesi usul ve yasaya uygundur.",
    anahtar: ["kriyoskopi", "su katma", "donma noktası", "ayıp", "tenzilat"],
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2020/5118",
    karar: "2021/2874",
    tarih: "18.03.2021",
    konu: "Soğutucu Tanker Arızası Kaynaklı Sütün Ekşimesi (Titrasyon Asitliği Artışı) ve Döküm Zararı",
    ozet: "Davalı taşıyıcı firmanın frigofirik tankerinde seyir halindeyken soğutma ünitesinin devre dışı kaldığı, 12 saat boyunca sütün 18 °C ortam sıcaklığında kaldığı, fabrika kabul testinde asitliğin 9.8 °SH ölçülerek kazeinin pıhtılaştığı ve sütün imha tutanağı ile döküldüğü tespit edilmiştir. Bilirkişi raporundaki döküm litre bedeli ve imha masraflarının taşıyıcı kusurundan kaynaklandığı gerekçesiyle tazmini onanmıştır.",
    anahtar: ["soğuk zincir", "tanker arızası", "ekşime", "asitlik", "süt döküm"],
  },
  {
    daire: "Yargıtay 15. Hukuk Dairesi",
    esas: "2019/1890",
    karar: "2020/945",
    tarih: "22.10.2020",
    konu: "Fason Kaşar Peyniri Üretiminde Randıman Düşüklüğü ve Süt Fire Uyuşmazlığı",
    ozet: "Taraflar arasındaki fason kaşar üretim sözleşmesinde teslim edilen 100 ton sütten standart %9.1 randımanla en az 9.100 kg taze kaşar üretilmesi gerekirken davalı fabrikanın 7.200 kg teslim ettiği, 1.900 kg kaşar peyniri eksiği bulunduğu anlaşılmıştır. Bilirkişinin süt teknolojisi kurallarına göre hesapladığı kayıp ürün bedelinin tazminine ilişkin yerel mahkeme kararı yerindedir.",
    anahtar: ["fason üretim", "randıman", "kaşar", "fire", "eksik teslim"],
  },
  {
    daire: "Yargıtay 19. Hukuk Dairesi",
    esas: "2018/4220",
    karar: "2019/3110",
    tarih: "12.05.2019",
    konu: "Tereyağında Bitkisel Yağ (Sterol) Tağşişi Nedeniyle Ayıp ve Sözleşmeden Dönme",
    ozet: "Davacı marketler zincirine 'Geleneksel Yayık Tereyağı' adıyla teslim edilen ürünlerde Tarım Bakanlığı denetiminde beta-sitosterol pozitif çıkmış ve palm yağı karıştırıldığı saptanmıştır. Bilirkişi heyetinin ürünlerin insan tüketimine ve mevzuata uygun olmadığı, ayıbın gizli ayıp niteliğinde bulunduğu yönündeki raporu doğrultusunda tüm parti bedelinin faiziyle iadesi gerekir.",
    anahtar: ["tereyağı", "tağşiş", "sterol", "palm yağı", "gizli ayıp"],
  },
];

/**
 * KRİYOSKOPİK SU KATMA FORMÜLÜ (Hortvet Eşitliği)
 * % Su = (Referans Donma Noktası - Ölçülen Donma Noktası) / Referans Donma Noktası * 100
 * Standart Referans: -0.520 °C (Türk Gıda Kodeksi Eşik Değeri)
 */
export function calculateWaterAdulteration(
  measuredFreezingPoint: number,
  totalDeliveredLiters: number,
  milkLiterPrice: number,
  referencePoint: number = -0.520
): {
  waterPct: number;
  addedWaterLiters: number;
  pureMilkLiters: number;
  deductionAmountTL: number;
  isAdulterated: boolean;
  statusText: string;
} {
  // Eğer ölçülen donma noktası referanstan daha soğuksa (örn: -0.535), su katılmamıştır.
  if (measuredFreezingPoint <= referencePoint) {
    return {
      waterPct: 0,
      addedWaterLiters: 0,
      pureMilkLiters: totalDeliveredLiters,
      deductionAmountTL: 0,
      isAdulterated: false,
      statusText: `Ölçülen donma noktası (${measuredFreezingPoint} °C), TGK asgari eşik değeri olan ${referencePoint} °C'nin altında olup süte su katılmadığı (normal biyolojik aralıkta olduğu) tespit edilmiştir.`,
    };
  }

  // Su oranı hesaplama: örn: (-0.520 - (-0.442)) / -0.520 * 100 = 15.0%
  const diff = referencePoint - measuredFreezingPoint;
  const rawPct = (diff / referencePoint) * 100;
  const waterPct = Number(Math.min(100, Math.max(0, rawPct)).toFixed(2));

  const addedWaterLiters = Math.round(totalDeliveredLiters * (waterPct / 100));
  const pureMilkLiters = Math.max(0, totalDeliveredLiters - addedWaterLiters);
  const deductionAmountTL = Math.round(addedWaterLiters * milkLiterPrice);

  return {
    waterPct,
    addedWaterLiters,
    pureMilkLiters,
    deductionAmountTL,
    isAdulterated: true,
    statusText: `Ölçülen donma noktası (${measuredFreezingPoint} °C), TGK standardı olan ${referencePoint} °C'den 0 °C'ye doğru ${Math.abs(diff).toFixed(3)} °C yükselmiştir. Bu sapma Hortvet formülü uyarınca süte %${waterPct} oranında (toplam ${addedWaterLiters.toLocaleString("tr-TR")} Litre) haricen su katıldığını (tağşiş) kesinleştirmektedir.`,
  };
}

/**
 * MANDIRA RANDIMAN VE EKSİK ÜRÜN (FİRE) HESAPLAMA MOTORU
 */
export function calculateDairyYieldLoss(
  yieldItem: UrunRandimani,
  processedMilkKg: number,
  actualProducedKg: number,
  productUnitPriceTL: number
): {
  expectedProductKg: number;
  deficitKg: number;
  deficitPct: number;
  yieldLossAmountTL: number;
  isDeficitAbnormal: boolean;
  evaluationText: string;
} {
  // Beklenen üretim: İşlenen süt / 1 kg ürün için gereken süt
  const expectedProductKg = Number((processedMilkKg / yieldItem.sutIhtiyaciKg).toFixed(1));
  const deficitKg = Number(Math.max(0, expectedProductKg - actualProducedKg).toFixed(1));
  const deficitPct = expectedProductKg > 0 ? Number(((deficitKg / expectedProductKg) * 100).toFixed(1)) : 0;
  const yieldLossAmountTL = Math.round(deficitKg * productUnitPriceTL);

  // Normal teknolojik fire toleransı (örneğin %3-%4)
  const isDeficitAbnormal = deficitPct > yieldItem.tipikFirePct;

  let evaluationText = "";
  if (deficitKg <= 0) {
    evaluationText = `Gerçekleşen üretim (${actualProducedKg.toLocaleString("tr-TR")} kg), ${processedMilkKg.toLocaleString("tr-TR")} kg sütten beklenen normatif üretimi (${expectedProductKg.toLocaleString("tr-TR")} kg) tam olarak karşılamaktadır. Fire veya randıman kaybı bulunmamaktadır.`;
  } else if (!isDeficitAbnormal) {
    evaluationText = `Tespit edilen ${deficitKg.toLocaleString("tr-TR")} kg'lık (%${deficitPct}) eksiklik, süt teknolojisinde kabul edilebilir normal proses firesi (%${yieldItem.tipikFirePct}) sınırları dahilindedir. Hukuki ve teknik sorumluluk doğurmaz.`;
  } else {
    evaluationText = `Beklenen normatif üretim ${expectedProductKg.toLocaleString("tr-TR")} kg iken gerçekleşen üretim ${actualProducedKg.toLocaleString("tr-TR")} kg'da kalmış; ${deficitKg.toLocaleString("tr-TR")} kg (%${deficitPct}) anormal randıman açığı saptanmıştır. Bu kayıp teknolojik fire sınırını (%${yieldItem.tipikFirePct}) aşmakta olup toplam maddi karşılığı ₺${yieldLossAmountTL.toLocaleString("tr-TR")}'dir.`;
  }

  return {
    expectedProductKg,
    deficitKg,
    deficitPct,
    yieldLossAmountTL,
    isDeficitAbnormal,
    evaluationText,
  };
}

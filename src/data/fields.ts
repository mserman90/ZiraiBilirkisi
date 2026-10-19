/**
 * Bilirkişi Rapor Yazma Otomasyonu - Alan & Tasarım Sistemi Sabitleri
 * 
 * Kod Sabitleri:
 * - Ziraat: #15803D (yeşil)
 * - Gıda: #B45309 (amber)
 * - Hayvancılık: #0E7490 (petrol mavisi)
 * 
 * Durum Renkleri:
 * - Taslak: Nötr (#6B7280)
 * - İnceleniyor: Amber (#B45309)
 * - Tamamlandı: Yeşil (#15803D)
 * - Arşiv: Gri (#6B7280)
 */

export type UzmanlikAlani = "ziraat" | "gida" | "hayvancilik";

export type RaporDurumu = "taslak" | "inceleniyor" | "tamamlandi" | "arsiv";

export interface AlanTanimi {
  id: UzmanlikAlani;
  ad: string;
  renk: string; // Hex kodu
  bgOpacity12: string; // %12 opaklık arka plan
  aciklama: string;
}

export const ALAN_TANIMLARI: Record<UzmanlikAlani, AlanTanimi> = {
  ziraat: {
    id: "ziraat",
    ad: "Ziraat Mühendisliği",
    renk: "#15803D",
    bgOpacity12: "rgba(21, 128, 61, 0.12)",
    aciklama: "Tarla, bağ-bahçe, meyvecilik, sulama, kamulaştırma ve ecrimisil değerlemeleri",
  },
  gida: {
    id: "gida",
    ad: "Gıda Mühendisliği",
    renk: "#B45309",
    bgOpacity12: "rgba(180, 83, 9, 0.12)",
    aciklama: "Gıda güvenliği, mandıra & süt teknolojisi, fabrika zayiat ve kalite denetimi",
  },
  hayvancilik: {
    id: "hayvancilik",
    ad: "Zootekni & Veteriner",
    renk: "#0E7490",
    bgOpacity12: "rgba(14, 116, 144, 0.12)",
    aciklama: "Büyükbaş, küçükbaş, kanatlı yetiştiriciliği, yemler, telef ve zarar tespitleri",
  },
};

export interface DurumTanimi {
  id: RaporDurumu;
  ad: string;
  renk: string;
  bgRengi: string;
}

export const DURUM_TANIMLARI: Record<RaporDurumu, DurumTanimi> = {
  taslak: {
    id: "taslak",
    ad: "Taslak",
    renk: "#5A6B63",
    bgRengi: "#F1ECE1",
  },
  inceleniyor: {
    id: "inceleniyor",
    ad: "İnceleniyor",
    renk: "#B45309",
    bgRengi: "rgba(180, 83, 9, 0.12)",
  },
  tamamlandi: {
    id: "tamamlandi",
    ad: "Tamamlandı",
    renk: "#15803D",
    bgRengi: "rgba(21, 128, 61, 0.12)",
  },
  arsiv: {
    id: "arsiv",
    ad: "Arşiv",
    renk: "#6B7280",
    bgRengi: "#E5E7EB",
  },
};

export interface KontrolMaddesi {
  id: string;
  metin: string;
  tamamlandi: boolean;
}

export interface AdimVerisi {
  no: number;
  kod: string;
  kisaBaslik: string;
  tamBaslik: string;
  mevzuatDayanagi: string;
  nedenBuBolum: string;
  sikYapilanHatalar: string[];
  ornekIfade: string;
  kontroller: KontrolMaddesi[];
  varsayilanMetin: string;
}

export const YEDI_ADIM_TANIMLARI: AdimVerisi[] = [
  {
    no: 1,
    kod: "01",
    kisaBaslik: "Dosya Künyesi",
    tamBaslik: "Dosya Künyesi & Görevlendirme",
    mevzuatDayanagi: "HMK m. 279/2 — Bilirkişi raporunda tarafların kimlikleri, görevlendiren mahkeme ve dosya esas numarası açıkça gösterilmelidir.",
    nedenBuBolum:
      "Raporun resmî hüviyet kazanması, dava dosyasıyla şüpheye yer bırakmayacak şekilde eşleşmesi ve tarafların denetimine açık olması için mahkeme esas bilgileri, görevlendirme ara kararı tarihi ve keşif tarihi eksiksiz yer almalıdır.",
    sikYapilanHatalar: [
      "Görevlendirme ara karar tarihinin ve yetkilendirme kapsamının raporda belirtilmemesi",
      "Tarafların ad-soyad ve vekillerinin isimlerinin tensip zaptındaki şekliyle uyuşmaması",
      "Keşif tarihi ile rapor yazım tarihi arasındaki sürenin HMK 274'e aykırı uzaması durumunda gerekçe sunulmaması",
    ],
    ornekIfade:
      "T.C. Ankara 4. Asliye Hukuk Mahkemesi'nin 2024/184 Esas sayılı dava dosyasında verilen 14.03.2024 tarihli ara kararı uyarınca, dava konusu taşınmaz mahallinde 02.05.2024 tarihinde icra edilen adli keşfe iştirak edilmiş, mahkemece tevdi edilen görev kapsamında işbu rapor tanzim edilmiştir.",
    kontroller: [
      { id: "k1_1", metin: "Mahkeme adı, esas no ve karar tarihi doğru girildi", tamamlandi: true },
      { id: "k1_2", metin: "Davacı, davalı ve vekil bilgileri tensip zaptına uygun", tamamlandi: true },
      { id: "k1_3", metin: "Keşif tarihi ve keşfe katılan uzmanlık alanları yazıldı", tamamlandi: false },
      { id: "k1_4", metin: "Bilirkişilik uzmanlık sicil no ve oda sicili eklendi", tamamlandi: false },
    ],
    varsayilanMetin:
      "T.C. ANKARA 4. ASLİYE HUKUK MAHKEMESİ HÂKİMLİĞİ'NE\n\nESAS NO: 2024/184 Esas\nKEŞİF TARİHİ: 02.05.2024\nDAVACI: T.C. Karayolları Genel Müdürlüğü\nDAVALI: Mehmet YILMAZ ve Hissedarları\nDAVA KONUSU: 2942 sayılı Kamulaştırma Kanunu'nun 10. maddesi uyarınca kamulaştırma bedelinin tespiti ve taşınmazın idare adına tescili istemidir.",
  },
  {
    no: 2,
    kod: "02",
    kisaBaslik: "Dava Şablonu",
    tamBaslik: "Dava Türü & Şablon Seçimi",
    mevzuatDayanagi: "Yargıtay 5. HD & 8. HD Emsal İçtihatları — Dava konusuna uygun bilimsel değerleme yönteminin baştan belirlenmesi zorunludur.",
    nedenBuBolum:
      "Kamulaştırma, ecrimisil, zirai ürün hasarı veya hayvan telefi davalarında uygulanacak hukuki ve iktisadi esaslar tamamen farklıdır. Doğru şablon seçimi, raporun Yargıtay denetiminde usulden bozulmasını engeller.",
    sikYapilanHatalar: [
      "Tarım arazisinde arsa emsal karşılaştırması yapılması (Kamulaştırma Kanunu m. 11/f'ye açık aykırılık)",
      "Ecrimisil davasında geçmiş yılların münavebe gelirini cari yıl fiyatlarıyla peşinen hesaplamak",
      "Hayvancılık zarar tespitinde telef bedelinden karkas/deri hurda bedelinin mahsup edilmemesi",
    ],
    ornekIfade:
      "Uyuşmazlık, 2942 sayılı Kamulaştırma Kanunu m. 11/f bendi kapsamında tarım arazisi niteliğindeki taşınmazın net gelir metoduna göre kamulaştırma tarihindeki gerçek değerinin tespitine ilişkindir.",
    kontroller: [
      { id: "k2_1", metin: "Dava konusu ve talep sonucu tereddütsüz sınıflandırıldı", tamamlandi: true },
      { id: "k2_2", metin: "Uygulanacak kanun maddesi (Kamulaştırma m. 11, TMK 995 vb.) seçildi", tamamlandi: true },
      { id: "k2_3", metin: "Zirai / Hayvansal / Gıda alt uzmanlık şablonu yüklendi", tamamlandi: false },
    ],
    varsayilanMetin:
      "DAVA TÜRÜ VE UYUŞMAZLIK KAPSAMI:\nİşbu dava; 2942 sayılı Kamulaştırma Kanunu'nun 10. maddesi uyarınca idarece açılan kamulaştırma bedelinin tespiti ve taşınmazın yol vasfıyla tescili davasıdır. Değerleme, aynı kanunun 11. maddesinin 1. fıkrasının (f) bendi uyarınca 'arazilerde taşınmaz mal veya hakkın kamulaştırma tarihindeki mevkii ve şartlarına göre olduğu gibi kullanılması halinde getireceği net gelir' esasına dayandırılacaktır.",
  },
  {
    no: 3,
    kod: "03",
    kisaBaslik: "Keşif & Tespit",
    tamBaslik: "Keşif & Arazi/Tesis Tespiti",
    mevzuatDayanagi: "HMK m. 288 & 290 — Keşif tutanağında tespit edilen maddi vakıalar ile rapor içeriği birebir örtüşmelidir.",
    nedenBuBolum:
      "Bilirkişinin mahalli inceleme yapmadan masa başında rapor tanzim etmesi kesin bozma sebebidir. Keşif yerinde bizzat gözlemlenen toprak profili, eğim, sulama kaynağı, ürün durumu ve parsel sınırları somut delillerle belgelenmelidir.",
    sikYapilanHatalar: [
      "Keşif zaptında 'kuru tarla' yazıldığı halde raporda soyut beyanla 'sulu arazi' kabulü yapılması",
      "Taşınmazın üzerinde bulunan ağaçların tek tek yaş, taç yapısı ve verim durumunun sayılmaması",
      "Parselin kadastro paftası ve uydu ortofoto görüntüsü ile fiili durumunun karşılaştırılmaması",
    ],
    ornekIfade:
      "02.05.2024 tarihinde icra edilen mahallinde yapılan keşifte; dava konusu taşınmazın killi-tınlı bünyeli, taşsız, %2-3 meyilli, derin toprak profiline sahip olduğu, Devlet Su İşleri sulama kanalından motopompla sulanabilir 'I. Sınıf Sulu Tarım Arazisi' vasfında bulunduğu heyetimizce bizzat müşahede edilmiştir.",
    kontroller: [
      { id: "k3_1", metin: "Toprak yapısı, profil derinliği ve eğim fiziki olarak yazıldı", tamamlandi: true },
      { id: "k3_2", metin: "Sulama kaynağı resmi belgelere veya fiili tespite bağlandı", tamamlandi: false },
      { id: "k3_3", metin: "Münavebede yer alan ekili ürün durumu yerinde gözlemlendi", tamamlandi: false },
      { id: "k3_4", metin: "Yön bilgili keşif fotoğrafları dosyaya işlendi", tamamlandi: false },
    ],
    varsayilanMetin:
      "MAHALLİNDE YAPILAN KEŞİF VE TESPİTLER:\nDava konusu Ankara ili, Gölbaşı ilçesi, Karagedik Mahallesi 102 ada 14 parsel sayılı taşınmazın keşif günü yerinde yapılan incelemesinde:\n1. Toprak Yapısı: Killi-tınlı, derin profilli (80-100 cm), organik maddece orta, taşlılık ve çoraklık problemi bulunmayan tarım toprağıdır.\n2. Sulama Durumu: Parselin batı sınırından geçen drenaj ve sulama kanalından motopomp vasıtasıyla sulama imkânı mevcut olup fiilen sulu tarım yapılmaktadır.\n3. Eğim ve Konum: Parsel ortalama %2 hafif meyilli olup traktör ve biçerdöver işlemeciliğine elverişlidir.\n4. Fiili Durum: Keşif günü taşınmaz üzerinde 2. gelişim döneminde buğday ekili olduğu tespit edilmiştir.",
  },
  {
    no: 4,
    kod: "04",
    kisaBaslik: "Bilimsel Hesaplama",
    tamBaslik: "Bilimsel Metot & Hesaplama",
    mevzuatDayanagi: "Yargıtay Hukuk Genel Kurulu 2017/5-2315 E. — Resmi Tarım İlçe Müdürlüğü verileri ile kapitalizasyon faizi zorunlu bilimsel dayanaktır.",
    nedenBuBolum:
      "Yargıtay yerleşik içtihatlarına göre tarım arazisinin değeri; yörede uygulanan mutat münavebe ürünlerinin Tarım İlçe Müdürlüğü resmi dekar verim, brüt gelir ve üretim masrafları üzerinden hesaplanan net gelirin kapitalizasyon faizine bölünmesiyle bulunur.",
    sikYapilanHatalar: [
      "İlçe Tarım resmi maliyet cetveli yerine tarafların ibraz ettiği faturasız soyut verileri kullanmak",
      "Sulu tarım arazisinde %5 yerine %6 veya %7 gibi fahiş kapitalizasyon faizi uygulamak",
      "Masraf cetvelinde genel idare giderleri (%3) ve amortismanı düşmeden brüt gelir üzerinden hesaplama yapmak",
    ],
    ornekIfade:
      "Gölbaşı İlçe Tarım ve Orman Müdürlüğü'nün 2024 yılı resmi maliyet verilerine göre; Buğday + Mısır münavebesinde dekar başına yıllık ortalama net gelir 3.420,00 TL olarak gerçekleşmiş; yörenin özellikleri ve sulu tarım vasfı gereğince kapitalizasyon faizi %5 kabul edilerek metrekare yalın arazi değeri 68,40 TL/m² olarak hesaplanmıştır.",
    kontroller: [
      { id: "k4_1", metin: "İlçe Tarım Müdürlüğü resmi maliyet cetveli temin edildi ve tarihlendi", tamamlandi: true },
      { id: "k4_2", metin: "Mutat münavebe planı (ör. Buğday-Ayçiçeği veya Buğday-Mısır) gerekçelendirildi", tamamlandi: true },
      { id: "k4_3", metin: "Kapitalizasyon faizi gerekçesi Yargıtay oranlarına uygun (Sulu %5, Kuru %6)", tamamlandi: false },
      { id: "k4_4", metin: "Varsa ağaç ve yapı değerleri resmi Çevre Şehircilik birim fiyatlarıyla hesaplandı", tamamlandi: false },
    ],
    varsayilanMetin:
      "BİLİMSEL DEĞERLEME METODU VE HESAP TABLOSU:\nTaşınmazın sulu tarım arazisi niteliği dikkate alınarak, yörede mutat olarak uygulanan Buğday - Dane Mısır münavebe sistemi esas alınmıştır.\n\nİlçe Tarım ve Orman Müdürlüğü 2024 yılı resmi verileri:\n- Buğday: Verim 450 kg/da × 9,25 TL/kg = 4.162,50 TL (Masraf: 2.150,00 TL) -> Net Gelir: 2.012,50 TL/da\n- Mısır: Verim 1.200 kg/da × 7,10 TL/kg = 8.520,00 TL (Masraf: 4.250,00 TL) -> Net Gelir: 4.270,00 TL/da\n- 2 Yıllık Ortalama Net Gelir: (2.012,50 + 4.270,00) / 2 = 3.141,25 TL/da\n\nKapitalizasyon Faizi: Yargıtay 5. Hukuk Dairesi'nin yerleşik içtihatları doğrultusunda sulu arazi için %5 olarak kabul edilmiştir.\nBirim Değer: 3.141,25 / 0,05 = 62.825,00 TL/da -> 62,83 TL/m²",
  },
  {
    no: 5,
    kod: "05",
    kisaBaslik: "HMK 279 Denetimi",
    tamBaslik: "Yargıtay & HMK 279 Denetimi",
    mevzuatDayanagi: "HMK m. 279/1 — Bilirkişi, raporunda münhasıran hâkimin yetkisinde bulunan hukuki konularda görüş bildiremez.",
    nedenBuBolum:
      "Bilirkişi sadece teknik ve fiili durumları tespit etmekle yükümlüdür. Raporda 'davalı kusurludur', 'dava reddedilmelidir', 'hak düşürücü süre geçmiştir' gibi hukuki mütalaaların bulunması raporu sakatlar ve Yargıtay nezdinde bozma nedenidir.",
    sikYapilanHatalar: [
      "Raporda 'tarafların kusur oranları' veya 'haksız fiil sorumlusu' gibi hukuki hüküm cümleleri kurmak",
      "Mahsup yapılması gereken kurtarma/hurda veya ara ödemeleri teknik raporda göz ardı etmek",
      "Keşif zaptında itiraz edilmiş hususlara gerekçeli cevap vermemek",
    ],
    ornekIfade:
      "HMK m. 279 hükmü gereğince bilirkişi heyetimizce yalnızca teknik ve ziraat mühendisliği esaslarına ilişkin hesaplamalar yapılmış olup davanın kabulü veya reddine dair takdir münhasıran Yüce Mahkeme'ye aittir.",
    kontroller: [
      { id: "k5_1", metin: "HMK 279 yasaklı kelime taraması (kusur, hak düşürücü, hüküm vb.) yapıldı", tamamlandi: false },
      { id: "k5_2", metin: "Kurtarma/hurda veya önceki ödeme mahsubu açıkça gösterildi", tamamlandi: false },
      { id: "k5_3", metin: "Usta Bilirkişi Pre-flight 10 maddelik risk listesi doğrulandı", tamamlandi: false },
    ],
    varsayilanMetin:
      "HMK 279 VE YARGITAY DENETİM KRİTERLERİNE UYGUNLUK:\nİşbu raporda Hukuk Muhakemeleri Kanunu'nun 279. maddesi gereğince hukuki nitelendirme ve takdirden kaçınılmış, heyetimizin teknik ziraat uzmanlığı sınırları içinde kalınarak bilimsel verilere dayalı objektif hesaplama yapılmıştır. Raporun tanziminde Yargıtay 5. Hukuk Dairesi'nin yerleşik bozma ve onama kriterleri titizlikle gözetilmiştir.",
  },
  {
    no: 6,
    kod: "06",
    kisaBaslik: "Sonuç & Rapor",
    tamBaslik: "Sonuç & Nihai Rapor",
    mevzuatDayanagi: "HMK m. 280 — Bilirkişi, raporunu varsa ekleriyle birlikte mahkemeye sunar; sonuç net ve anlaşılır olmalıdır.",
    nedenBuBolum:
      "Hâkim ve taraflar nihai hesap tablosuna bakarak hüküm kurar. Bu bölümde hesaplanan kamulaştırma bedeli, ecrimisil veya zarar tutarı hiçbir tereddüde yer bırakmayacak biçimde rakam ve yazıyla özetlenir.",
    sikYapilanHatalar: [
      "Rakam ile yazı arasındaki bedel uyuşmazlığı (örneğin tabloda 150.000 TL yazarken sonuçta 105.000 TL kalması)",
      "Kamulaştırmasız el atma davalarında mülkiyetin idareye intikaline dair şerh notunun eklenmemesi",
      "Bilirkişi heyeti imzalarının eksik olması",
    ],
    ornekIfade:
      "Yukarıda arz ve izah edilen bilimsel gerekçeler ışığında; dava konusu taşınmazın kamulaştırma tarihi itibarıyla zemin bedelinin 1.256.600,00 TL (BirMilyonİkiYüzElliAltıBinAltıYüz Türk Lirası) olduğu sonucuna varılmıştır.",
    kontroller: [
      { id: "k6_1", metin: "Toplam bedel hem rakamla hem de yazıyla eksiksiz yazıldı", tamamlandi: false },
      { id: "k6_2", metin: "Zemin, ağaç, yapı ve münferit kalemler ayrı ayrı icmal edildi", tamamlandi: false },
      { id: "k6_3", metin: "Bilirkişi heyeti kaşe ve ıslak/elektronik imza bloğu tamamlandı", tamamlandi: false },
    ],
    varsayilanMetin:
      "SONUÇ VE KANAAT:\nDava dosyasında mevcut bilgi ve belgeler, mahallinde icra edilen keşif bulguları ve İlçe Tarım Müdürlüğü resmi verileri doğrultusunda yapılan bilimsel inceleme neticesinde:\n\n1. Taşınmazın Arazi Birim Değeri: 62,83 TL/m²\n2. Kamulaştırılan Alan (12.450 m²): 782.233,50 TL\n3. Üzerindeki Ağaçların Değeri: 45.000,00 TL\n4. TOPLAM KAMULAŞTIRMA BEDELİ: 827.233,50 TL\n(Yazı ile: SekizYüzYirmiYediBinİkiYüzOtuzÜç Türk Lirası Elli Kuruş)\n\nolduğu yönündeki ortak teknik kanaatimizi bildirir heyet raporumuz Yüce Mahkemenin takdirlerine saygıyla arz olunur.",
  },
  {
    no: 7,
    kod: "07",
    kisaBaslik: "UYAP & İtiraz",
    tamBaslik: "UYAP & İtiraz/Ek Rapor Yönetimi",
    mevzuatDayanagi: "HMK m. 281 — Tarafların itirazları doğrultusunda ek rapor tanzimi veya UYAP e-imzalı evrak ibrazı.",
    nedenBuBolum:
      "Hazırlanan raporun UYAP Bilişim Sistemi üzerinden mahkemeye e-imza ile hatasız iletilmesi ve tarafların dilekçelerinde ileri sürdükleri itirazlara tek tek bilimsel cevap verilmesi raporun yargılamadaki kesinliğini sağlar.",
    sikYapilanHatalar: [
      "Taraf itiraz dilekçelerindeki emsal veya münavebe iddialarını yanıtsız bırakmak",
      "Ek raporda önceki raporla çelişen yeni ve gerekçesiz değer üretmek",
      "UYAP editörü uyumsuz özel yazı tipleri ve bozuk tablolar kullanmak",
    ],
    ornekIfade:
      "Davalı vekilinin münavebe ürün verimlerinin düşük alındığına dair itirazı incelenmiş; heyetimizce kullanılan verilerin resmi ilçe tarım bültenine dayandığı, bu nedenle kök rapordaki tespitlerin aynen muhafaza edildiği mütalaa olunur.",
    kontroller: [
      { id: "k7_1", metin: "UYAP Doküman Editörü (.udf) ve PDF çıktısı kontrol edildi", tamamlandi: false },
      { id: "k7_2", metin: "Taraf itiraz dilekçeleri varsa madde madde gerekçelendirildi", tamamlandi: false },
      { id: "k7_3", metin: "Nihai rapor arşive kaldırıldı ve dijital kopyası saklandı", tamamlandi: false },
    ],
    varsayilanMetin:
      "TARAFLARIN İTİRAZLARININ DEĞERLENDİRİLMESİ:\nDavacı idare vekilinin ve davalı vekilinin dosyaya ibraz ettikleri itiraz dilekçeleri heyetimizce incelenmiştir:\n- Davacı vekilinin kapitalizasyon faizinin %6 olması gerektiği iddiası: Parselin su kaynağına bitişik olması ve fiilen sulanması sebebiyle Yargıtay 5. HD yerleşik kararları gereği %5 oranı yerindedir.\n- Davalı vekilinin ürün fiyatlarının serbest piyasaya göre düşük kaldığı iddiası: Kamulaştırma Kanunu m. 11 uyarınca resmi kurum verileri esas alınmak zorunda olup soyut piyasa fiyatları yasal dayanaktan yoksundur.\nBu itibarla kök raporumuzdaki kanaat ve hesaplamanın aynen korunduğunu bildiririz.",
  },
];

export interface RaporEki {
  id: string;
  ad: string;
  tur: "fotograf" | "tapu" | "kadastro" | "resmi_yazi" | "laboratuvar" | "diger";
  dosyaAdi: string;
  boyut: string;
  yuklemeTarihi: string;
  aciklama?: string;
  url?: string;
}

export interface BilirKisiProfili {
  adSoyad: string;
  unvan: string;
  uzmanlikAlani: UzmanlikAlani;
  sicilNo: string;
  odaSicilNo: string;
  adliYargiKomisyonu: string;
  eposta?: string;
  telefon?: string;
}

export const VARSAYILAN_UZMAN_PROFILI: BilirKisiProfili = {
  adSoyad: "Zir. Yük. Müh. Mert Bilirkişi",
  unvan: "Ziraat Yüksek Mühendisi & Tarımsal Değerleme Uzmanı",
  uzmanlikAlani: "ziraat",
  sicilNo: "06-1842",
  odaSicilNo: "TMMOB-ZMO-41920",
  adliYargiKomisyonu: "Ankara Adli Yargı İlk Derece Mahkemesi Adalet Komisyonu",
  eposta: "mert.bilirkisi@adalet.gov.tr",
  telefon: "0532 000 00 00",
};

export interface AiDegerlendirmeSonucu {
  skor: number;
  hmkUyumlu: boolean;
  yasakliKelimeVarMi: boolean;
  bulunanYasakliKelimeler: string[];
  gucluYonler: string[];
  gelistirmeOnerileri: string[];
  revizeOnerisi: string;
}

export interface BilirKisiRaporu {
  id: string;
  baslik: string;
  dosyaNo: string;
  mahkeme: string;
  alan: UzmanlikAlani;
  durum: RaporDurumu;
  davaTuru: string;
  kesifTarihi: string;
  sonGuncelleme: string;
  mevcutAdim: number;
  tamamlanmaYuzdesi: number;
  tarafBilgisi: string;
  ozet: string;
  bolumMetinleri: Record<number, string>;
  bolumKontrolleri: Record<number, KontrolMaddesi[]>;
  ekler?: RaporEki[];
}

export const ORNEK_RAPORLAR_LISTESI: BilirKisiRaporu[] = [
  {
    id: "rap-001",
    baslik: "Gölbaşı Karagedik 102/14 Parsel Yol Kamulaştırması",
    dosyaNo: "2024/184 E.",
    mahkeme: "Ankara 4. Asliye Hukuk Mahkemesi",
    alan: "ziraat",
    durum: "tamamlandi",
    davaTuru: "Kamulaştırma Bedel Tespiti (m. 10)",
    kesifTarihi: "02.05.2024",
    sonGuncelleme: "Bugün, 16:40",
    mevcutAdim: 6,
    tamamlanmaYuzdesi: 100,
    tarafBilgisi: "Karayolları GM / Mehmet Yılmaz ve Hissedarları",
    ozet: "I. Sınıf sulu tarla niteliğindeki 12.450 m² alanın net gelir kapitalizasyonu yöntemiyle toplam 827.233,50 TL kamulaştırma bedel tespiti.",
    bolumMetinleri: {
      1: YEDI_ADIM_TANIMLARI[0].varsayilanMetin,
      2: YEDI_ADIM_TANIMLARI[1].varsayilanMetin,
      3: YEDI_ADIM_TANIMLARI[2].varsayilanMetin,
      4: YEDI_ADIM_TANIMLARI[3].varsayilanMetin,
      5: YEDI_ADIM_TANIMLARI[4].varsayilanMetin,
      6: YEDI_ADIM_TANIMLARI[5].varsayilanMetin,
      7: YEDI_ADIM_TANIMLARI[6].varsayilanMetin,
    },
    bolumKontrolleri: {
      1: YEDI_ADIM_TANIMLARI[0].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      2: YEDI_ADIM_TANIMLARI[1].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      3: YEDI_ADIM_TANIMLARI[2].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      4: YEDI_ADIM_TANIMLARI[3].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      5: YEDI_ADIM_TANIMLARI[4].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      6: YEDI_ADIM_TANIMLARI[5].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      7: YEDI_ADIM_TANIMLARI[6].kontroller.map((k) => ({ ...k, tamamlandi: true })),
    },
  },
  {
    id: "rap-002",
    baslik: "Süt İşletmesi Hijyen & Randıman Bozulması Zayiat Raporu",
    dosyaNo: "2024/92 E.",
    mahkeme: "İzmir 2. Asliye Ticaret Mahkemesi",
    alan: "gida",
    durum: "inceleniyor",
    davaTuru: "Ayıplı Mal & Üretim Zayiat Tazminatı",
    kesifTarihi: "18.06.2024",
    sonGuncelleme: "Dün, 11:15",
    mevcutAdim: 4,
    tamamlanmaYuzdesi: 65,
    tarafBilgisi: "Ege Mandıra Ltd. / Soğutma Sistemleri A.Ş.",
    ozet: "Pastörizatör ve soğuk hava deposundaki teknik arıza sonucu bozulan 18.500 lt çiğ süt ve kaşar peyniri zayiat bedelinin hesabı.",
    bolumMetinleri: {
      1: "T.C. İZMİR 2. ASLİYE TİCARET MAHKEMESİ HÂKİMLİĞİ'NE\nESAS NO: 2024/92 E.\nDAVACI: Ege Mandıra Süt Ürünleri Ltd. Şti.\nDAVALI: Frigo Soğutma Sistemleri San. Tic. A.Ş.\nDAVA: Ayıplı makine teslimi nedeniyle uğranılan hammadde ve mamul zayiat tazminatı.",
      2: "UYUŞMAZLIK KAPSAMI: Türk Ticaret Kanunu m. 23 ve 6098 sayılı TBK m. 219 uyarınca soğutma tankındaki ısı dalgalanmasının süt protein yapısına etkisi ve toplam zayiat tutarı.",
      3: "MAHAL TESPİTİ: İşletmede 18.06.2024 tarihinde yapılan incelemede, tank içi sıcaklık kayıt grafikleri incelenmiş; pastörize sütün 4°C yerine 14°C'de 18 saat beklediği ve kesildiği doğrulanmıştır.",
      4: "BİLİMSEL ZAYİAT HESABI:\n- Çiğ Süt Zayiatı: 18.500 Litre × 16,50 TL/Lt = 305.250,00 TL\n- Bozulmuş Taze Kaşar: 1.200 kg × 240,00 TL/kg = 288.000,00 TL\n- İmha ve Nakliye Masrafı: 15.000,00 TL\nToplam Zayiat: 608.250,00 TL",
      5: "",
      6: "",
      7: "",
    },
    bolumKontrolleri: {
      1: YEDI_ADIM_TANIMLARI[0].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      2: YEDI_ADIM_TANIMLARI[1].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      3: YEDI_ADIM_TANIMLARI[2].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      4: YEDI_ADIM_TANIMLARI[3].kontroller.map((k) => ({ ...k, tamamlandi: false })),
      5: YEDI_ADIM_TANIMLARI[4].kontroller,
      6: YEDI_ADIM_TANIMLARI[5].kontroller,
      7: YEDI_ADIM_TANIMLARI[6].kontroller,
    },
  },
  {
    id: "rap-003",
    baslik: "Damızlık Süt İneği Elektrik Çarpması Telef Raporu",
    dosyaNo: "2024/312 E.",
    mahkeme: "Konya 1. Asliye Hukuk Mahkemesi",
    alan: "hayvancilik",
    durum: "taslak",
    davaTuru: "Haksız Fiil Hayvan Telefi & Verim Kaybı Tazminatı",
    kesifTarihi: "29.07.2024",
    sonGuncelleme: "3 gün önce",
    mevcutAdim: 2,
    tamamlanmaYuzdesi: 30,
    tarafBilgisi: "Ali Kara / Elektrik Dağıtım A.Ş.",
    ozet: "Ahır topraklama hattına yüksek voltaj kaçağı sonucu telef olan 4 baş Holstein ırkı gebe damızlık sığırın piyasa rayiç ve yoksun kalınan kâr hesabı.",
    bolumMetinleri: {
      1: "T.C. KONYA 1. ASLİYE HUKUK MAHKEMESİ HÂKİMLİĞİ'NE\nESAS NO: 2024/312 E.\nDAVACI: Ali Kara\nDAVALI: Meram Elektrik Dağıtım A.Ş.\nDAVA: Enerji nakil hattı kaçağı sebebiyle büyükbaş hayvan telefi tazminatı.",
      2: "DAVA ŞABLONU: 6098 sayılı Türk Borçlar Kanunu m. 49 (Haksız Fiil) ve m. 71 (Tehlike Sorumluluğu) kapsamında canlı hayvan rayiç değeri, gebe yavru kaybı ve laktasyon süt verim kaybı hesabı.",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
    },
    bolumKontrolleri: {
      1: YEDI_ADIM_TANIMLARI[0].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      2: YEDI_ADIM_TANIMLARI[1].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      3: YEDI_ADIM_TANIMLARI[2].kontroller,
      4: YEDI_ADIM_TANIMLARI[3].kontroller,
      5: YEDI_ADIM_TANIMLARI[4].kontroller,
      6: YEDI_ADIM_TANIMLARI[5].kontroller,
      7: YEDI_ADIM_TANIMLARI[6].kontroller,
    },
  },
  {
    id: "rap-004",
    baslik: "Ayvalık Zeytinlik Parseli Enerji Nakil İrtifak Hakkı",
    dosyaNo: "2023/450 E.",
    mahkeme: "Burhaniye 2. Asliye Hukuk Mahkemesi",
    alan: "ziraat",
    durum: "arsiv",
    davaTuru: "İrtifak Kamulaştırma Bedeli",
    kesifTarihi: "12.11.2023",
    sonGuncelleme: "15.01.2024",
    mevcutAdim: 7,
    tamamlanmaYuzdesi: 100,
    tarafBilgisi: "TEİAŞ / Fatma Demir",
    ozet: "Kapama zeytinlik parselinden geçen 380 kV yüksek gerilim hattı nedeniyle ağaç kesim bedeli ve zemin irtifak değer düşüklüğü tespiti.",
    bolumMetinleri: {
      1: "T.C. BURHANİYE 2. ASLİYE HUKUK MAHKEMESİ\nESAS NO: 2023/450 E.",
      2: "DAVA: 2942 sayılı Kanun m. 11/son irtifak hakkı tesisi.",
      3: "MAHAL TESPİTİ: 65-70 yaş grubu verimli Edremit yağlık zeytin ağaçları.",
      4: "HESAPLAMA: İrtifak sahasına isabet eden 18 adet zeytin ağacının kesim zararı ve %8 zemin değer azalışı hesabı.",
      5: "HMK 279 UYGUNLUK: Hukuki mütalaadan kaçınılmış, TEİAŞ kamulaştırma kriterleri esas alınmıştır.",
      6: "SONUÇ: Toplam 342.150,00 TL irtifak ve ağaç bedeli.",
      7: "UYAP İTİRAZ DEĞERLENDİRMESİ: Taraf itirazları karşılanmış, ek raporla hüküm kesinleşmiştir.",
    },
    bolumKontrolleri: {
      1: YEDI_ADIM_TANIMLARI[0].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      2: YEDI_ADIM_TANIMLARI[1].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      3: YEDI_ADIM_TANIMLARI[2].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      4: YEDI_ADIM_TANIMLARI[3].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      5: YEDI_ADIM_TANIMLARI[4].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      6: YEDI_ADIM_TANIMLARI[5].kontroller.map((k) => ({ ...k, tamamlandi: true })),
      7: YEDI_ADIM_TANIMLARI[6].kontroller.map((k) => ({ ...k, tamamlandi: true })),
    },
  },
];

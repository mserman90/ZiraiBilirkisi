/**
 * ZİRAAT BİLİRKİŞİ REHBERİ METODOLOJİ VE VERİTABANI
 * 
 * Kaynak Eserler:
 * 1. Ziraat Bilirkişi Rehberi - Filiz Berberoğlu Yenipınar (Aristo Yayınevi)
 * 2. Bilirkişi Rehberi - Doç. Dr. Z. Gökalp Mülayim & Doç. Dr. Turan Güneş (TMMOB Ziraat Mühendisleri Odası)
 * 3. Bilirkişilerin Uyacağı Rehber İlkeler ve Rapor Standartları (T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı)
 * 4. 2942 sayılı Kamulaştırma Kanunu (m. 10, 11, 12, 27) & HMK m. 266-287
 */

// ============================================================================
// 1. İTİRAZLARA CEVAP & EK RAPOR SENARYOLARI (ZMO EK-7 & Berberoğlu Yenipınar)
// ============================================================================

export interface ItirazSenaryosu {
  id: string;
  baslik: string;
  itirazEden: "Davacı / İdare" | "Davalı / Malik" | "Davacı / Malik" | "Her İki Taraf";
  ozetItiraz: string;
  mahkemeAraKarari: string;
  tarafIddialari: {
    davaciIddia: string;
    davaliIddia: string;
  };
  bilirkisiTeknikCevap: string;
  yargitayKriteri: string;
  secenekliTabloSablonu: {
    secenekA: { baslik: string; aciklama: string; katsayiCarpani: number };
    secenekB: { baslik: string; aciklama: string; katsayiCarpani: number };
    secenekC?: { baslik: string; aciklama: string; katsayiCarpani: number };
  };
}

export const ITIRAZ_SENARYOLARI_DB: ItirazSenaryosu[] = [
  {
    id: "kfo_itirazi",
    baslik: "Kapitalizasyon Faiz Oranı (KFO) İtirazı",
    itirazEden: "Her İki Taraf",
    ozetItiraz:
      "Davalı idare vekili KFO'nun %6-%7 olarak uygulanması gerektiğini; davacı malik vekili ise arazinin sulu ve çok verimli olması sebebiyle KFO'nun %3-%4 olması gerektiğini ileri sürmüştür.",
    mahkemeAraKarari:
      "Tarafların kapitalizasyon faiz oranına ve arazi vasfına yönelik teknik itirazlarının karşılanması, gerekçelendirilmesi ve seçenekli hesap tablosu tanzimi için dosyanın bilirkişi heyetine tevdiine karar verildi.",
    tarafIddialari: {
      davaciIddia:
        "Taşınmaz 1. sınıf sulu mutlak tarım arazisidir, sulama kanaletinden cazibe ile kesintisiz sulanmaktadır. Yargıtay 5. HD içtihatları gereğince sulu arazilerde KFO en fazla %4 (%0.04) olmalıdır. %5 KFO arazi değerini haksız yere düşürmektedir.",
      davaliIddia:
        "Bölgenin iklim koşulları, pazara uzaklığı ve toprak yapısı göz önüne alındığında arazide KFO %6 (%0.06) veya %7 (%0.07) olarak alınmalıdır. Kök rapordaki faiz oranı kamu zararına yol açmaktadır.",
    },
    bilirkisiTeknikCevap:
      "Yargıtay 5. Hukuk Dairesi'nin yerleşik ve istikrarlı kararları uyarınca; Türkiye genelinde sulu tarım arazilerinde kapitalizasyon faiz oranı %4 - %5; kuru tarım arazilerinde ise %5 - %7 aralığında kabul edilmektedir. Somut taşınmazın keşif tarihindeki sulama imkanları (cazibeli devlet sulama şebekesi), toprak profili derinliği (>90 cm) ve yöre ortalama verimi dikkate alındığında heyetimizce kök raporda takdir edilen %5 oranı ilmi normlara ve yargı içtihatlarına tam uygundur. Bununla birlikte Sayın Mahkemenin takdirine yardımcı olmak üzere kademeli hesap tablosu aşağıda sunulmuştur.",
    yargitayKriteri:
      "Yargıtay 5. HD 2021/8945 E., 2022/3120 K.: 'Sulu tarım arazilerinde kapitalizasyon faiz oranının %4 ila %5 arasında belirlenmesi zorunlu olup, somut gerekçe gösterilmeksizin oranın artırılması veya düşürülmesi bozma nedenidir.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyetimizin İlmi Kanaati - KFO %5.0)",
        aciklama: "Kök raporda yer alan sulu arazi normatif faiz oranı ile hesaplanan değer.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (Davacı Malik Talebi - KFO %4.0)",
        aciklama: "Mutlak sulu ve yüksek verimli tarım arazisi üst barem kabulü (KFO %4).",
        katsayiCarpani: 1.25,
      },
      secenekC: {
        baslik: "Seçenek 3 (Davalı İdare Savunması - KFO %6.0)",
        aciklama: "Kısmi sulu / riskli tarım bölgesi kabulü (KFO %6).",
        katsayiCarpani: 0.833,
      },
    },
  },
  {
    id: "munavebe_itirazi",
    baslik: "Münavebe (Ekim Nöbeti) ve Ürün Deseni İtirazı",
    itirazEden: "Davacı / İdare",
    ozetItiraz:
      "Davalı idare vekili, raporda münavebeye alınan 2. ürün danelik mısır veya sanayi domatesinin bölgede mutat olmadığını, münavebenin buğday-nadas şeklinde kuru tarım esasına göre düzenlenmesi gerektiğini iddia etmiştir.",
    mahkemeAraKarari:
      "Taşınmazın fiili sululuk durumu ve İlçe Tarım ve Orman Müdürlüğü resmi münavebe cetvelleri doğrultusunda idare itirazının karşılanması amacıyla ek rapor tanzimine.",
    tarafIddialari: {
      davaciIddia:
        "Taşınmazda fiilen 2. ürün mısır ve silaj üretimi yapılmaktadır. İlçe Tarım ÇKS kayıtları ve keşif tutanağı sululuğu doğrulamaktadır. Münavebe gerçeği yansıtmaktadır.",
      davaliIddia:
        "Bölgede su sıkıntısı yaşandığı, baraj doluluk oranının düşük olduğu, münavebeye 2. ürün mısır konulmasının afaki gelir artışına yol açtığı iddia edilmektedir.",
    },
    bilirkisiTeknikCevap:
      "Keşif günü zeminde yapılan incelemede; parselin Sulama Birliği açık kanalet şebekesi kapsamında olduğu, tarlada damlama/yağmurlama borularının kurulu bulunduğu, komşu parsellerde de fiilen 2. ürün mısır ziraati icra edildiği tutanakla tespit edilmiştir. İlçe Tarım ve Orman Müdürlüğü'nün dava yılına ait resmi yazısında da mezkur köyde sulu şartlarda 'Buğday + 2. Ürün Mısır / Ayçiçeği' münavebesinin yöre ekolojisine uygun mutat sistem olduğu bildirilmiştir. Dolayısıyla kuru tarım münavebesi uygulanması taşınmazın vasfıyla bağdaşmamaktadır. Ancak mahkemenin takdiri için tek ürünlü münavebe seçeneği de sunulmuştur.",
    yargitayKriteri:
      "Yargıtay 5. HD 2020/4512 E., 2021/1102 K.: 'Münavebeye alınacak ürünlerin o yörede genel olarak yetiştirilip yetiştirilmediği İlçe Tarım ve Orman Müdürlüğü'nden sorularak belirlenmeli, resmi veriler dışına çıkılmamalıdır.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyet Münavebesi: Buğday + 2. Ürün Mısır - Ayçiçeği)",
        aciklama: "Resmi ÇKS ve İlçe Tarım Sulu Münavebe Normu (Yıllık Net Gelir Bazı).",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (Alternatif Münavebe: Yalnızca 1. Ürün Buğday - Ayçiçeği)",
        aciklama: "2. ürünün hariç tutulduğu tek ekimli sulu münavebe modeli.",
        katsayiCarpani: 0.72,
      },
      secenekC: {
        baslik: "Seçenek 3 (İdarenin İddia Ettiği Kuru Münavebe: Buğday - Nadas/Nohut)",
        aciklama: "Arazinin kuru kabul edilmesi durumundaki farazi net gelir tablosu.",
        katsayiCarpani: 0.48,
      },
    },
  },
  {
    id: "masraf_itirazi",
    baslik: "Dekar Üretim Masrafları ve Tali Ürün (Saman) İtirazı",
    itirazEden: "Davacı / İdare",
    ozetItiraz:
      "İdare vekili, dekar üretim masraflarının aşırı düşük gösterildiğini, mazot, gübre ve hasat masraflarının gayrisafi üretim değerinin en az %60'ı olması gerektiğini, saman gelirinin hesaba dahil edilmemesi gerektiğini ileri sürmüştür.",
    mahkemeAraKarari:
      "Dekar masraf kalemlerinin İlçe Tarım verileriyle karşılaştırılması ve itirazın teknik olarak incelenmesi.",
    tarafIddialari: {
      davaciIddia:
        "Saman ve balya ziraatın ayrılmaz parçasıdır, bölgede buğday samanı yüksek talep görmekte olup net gelire eklenmesi zorunludur.",
      davaliIddia:
        "Masraf oranı %30-35 gibi düşük bir oranda kalmış, enflasyonist artışlar masrafa yansıtılmamıştır. Saman geliri hesaptan çıkarılmalıdır.",
    },
    bilirkisiTeknikCevap:
      "Bilirkişi heyetimiz kök raporda kendi takdiri masrafları değil, T.C. Tarım ve Orman Bakanlığı İlçe Tarım ve Orman Müdürlüğü'nün dava yılına ait onaylı 'Maliyet ve Verim Cetvelleri'ni birebir esas almıştır. Resmi cetvelde tohum, gübre, mazot, zirai mücadele, sulama işçiliği, hasat ve genel idare masrafları kalem kalem yer almaktadır. Yargıtay 5. HD içtihatlarına göre buğday tarımında saman tali ürün niteliğinde olup, bölgedeki hayvancılık yoğunluğu nedeniyle ekonomik bir değere sahiptir ve brüt gelire dahil edilmesi hukuki ve teknik bir zorunluluktur.",
    yargitayKriteri:
      "Yargıtay 5. HD 2019/6211 E., 2020/2841 K.: 'Tarımsal arazilerin kamulaştırma bedelinin tespitinde İlçe Tarım Müdürlüğü resmi maliyet cetvelinde yer alan verim, fiyat ve masraf kalemleri esas alınmalıdır. Tali ürün samanın gelire eklenmesi isabetlidir.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyet Raporu: İlçe Tarım Resmi Masraf Cetveli + Saman)",
        aciklama: "Resmi İlçe Tarım verileri ve saman gelirinin dahil olduğu hesap.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (Saman Geliri Hariç Tutulan Hesap)",
        aciklama: "Tali ürün samanın gelire eklenmediği alternatif model.",
        katsayiCarpani: 0.88,
      },
      secenekC: {
        baslik: "Seçenek 3 (Masraf Oranı %50 Alınarak Yapılan Hesap)",
        aciklama: "Gayrisafi üretim değerinin %50'si oranında masraf varsayımı.",
        katsayiCarpani: 0.81,
      },
    },
  },
  {
    id: "oda_itirazi",
    baslik: "Objektif Değer Artışı (ODA) İtirazı",
    itirazEden: "Her İki Taraf",
    ozetItiraz:
      "Davalı idare ODA'nın tamamen kaldırılmasını veya en fazla %5-10 verilmesini; davacı taraf ise parselin şehir merkezine 3 km mesafede olması sebebiyle ODA'nın en az %80-%100 olması gerektiğini iddia etmiştir.",
    mahkemeAraKarari:
      "Objektif değer artırıcı unsurların somut kriterlere dayandırılarak ayrı ayrı irdelenmesi ve ODA oranının kademelendirilmesi.",
    tarafIddialari: {
      davaciIddia:
        "Taşınmaz organize sanayi bölgesine 1 km, çevre yoluna 300 m mesafededir, hızla gelişen konut aksındadır. ODA %30 çok düşüktür.",
      davaliIddia:
        "Taşınmaz kadastro parselidir, tarım arazisidir, spekülatif beklentiler ODA olarak yansıtılamaz. ODA verilmesi yasal dayanaktan yoksundur.",
    },
    bilirkisiTeknikCevap:
      "2942 sayılı Kamulaştırma Kanunu m. 11/ı bendinde 'Bedelin tespitinde etkili olabilecek diğer objektif ölçüler' hükme bağlanmıştır. Heyetimizce parselin ana artere cephesi, ilçe merkezine fiili 3.5 km mesafesi, şekil ve geometrik topoğrafyası incelenmiş; spekülatif beklentilerden arındırılarak yalnızca tarımsal lojistik, pazara kolay erişim ve arazi bütünlüğü avantajları nedeniyle %20 oranında ODA takdir edilmiştir. Bu oran Yargıtay'ın benzer konumlardaki tarım parselleri için istikrar kazanan %15-%30 sınırları içerisindedir.",
    yargitayKriteri:
      "Yargıtay HGK 2018/5-201 E., 2019/340 K.: 'Objektif değer artışı uygulanırken taşınmazın konumu, geometrisi, anayola ve yerleşim merkezine yakınlığı somut olarak belirtilmeli, afaki ve gerekçesiz yüksek oranlardan kaçınılmalıdır.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyet Takdiri: %20 ODA)",
        aciklama: "Somut konum ve ulaşım kriterlerine dayalı gerekçeli oran.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (İdarenin Savunduğu Asgari Düzey: %5 ODA)",
        aciklama: "Yalnızca kadastro yoluna cephelilik esaslı asgari artış.",
        katsayiCarpani: 0.875,
      },
      secenekC: {
        baslik: "Seçenek 3 (Davacı Talebi Üst Sınır: %40 ODA)",
        aciklama: "Sanayi ve yerleşim baskısı altındaki üst sınır takdiri.",
        katsayiCarpani: 1.167,
      },
    },
  },
  {
    id: "agac_yas_itirazi",
    baslik: "Meyve Ağaçlarının Yaşı, Cinsi ve Kuruyan Ağaç Tazminatı İtirazı",
    itirazEden: "Davalı / Malik",
    ozetItiraz:
      "Malik vekili, tarladaki fıstık ve zeytin ağaçlarının 30-35 yaşında tam verim çağında olduğunu, heyetimizin ağaç birim değerlerini düşük takdir ettiğini, DSİ kanalı sızıntısı sonucu kuruyan 44 adet ağacın geleceğe dönük yoksun kalınan kârının da tazmin edilmesi gerektiğini bildirmiştir.",
    mahkemeAraKarari:
      "Ağaçların 4 devre (tesis, artış, normal mahsul, eksiliş) itibarıyla bilimsel değerleme yöntemlerine göre yeniden irdelenerek ek rapor düzenlenmesi.",
    tarafIddialari: {
      davaciIddia:
        "DSİ drenaj kanalı sebebiyle taban suyu yükselmiş, kök boğazı çürüklüğü oluşmuş ve 44 adet yetişkin fıstık ağacı tamamen kurumuştur. Ağaçların yeniden yetişmesi 15 yıl alacaktır.",
      davaliIddia:
        "Ağaçların bir kısmının zaten bakımsız olduğu, kurumanın bakım eksikliğinden kaynaklandığı, talep edilen ağaç bedellerinin fahiş olduğu savunulmaktadır.",
    },
    bilirkisiTeknikCevap:
      "TMMOB Ziraat Mühendisleri Odası Bilirkişilik Rehberi ve Prof. Dr. Gökalp Mülayim normlarına göre çok yıllık meyve ağaçları 4 hayat devresine ayrılır: Tesis Devresi (0-7 yaş), Artış Devresi (8-15 yaş), Normal Mahsul Devresi (16-50 yaş) ve Eksiliş Devresi (50+ yaş). Keşifte incelenen ağaçların gövde çevreleri (85-110 cm), taç gelişimleri ve sürgün yapıları 30-35 yaşlarında 'Normal Mahsul' evresinde olduklarını göstermektedir. Kuruyan ağaçlar için İl Tarım ve Orman Müdürlüğü'nün resmi ağaç cetvelindeki tam verim birim bedeli esas alınmış, tasarruf edilen budama/ilaçlama masrafları mahsup edilmiştir.",
    yargitayKriteri:
      "Yargıtay 5. HD 2021/3342 E., 2021/9850 K.: 'Meyve ağaçlarının kamulaştırma veya zarar tarihindeki yaşı, cinsi, kapalılık durumu ve maktu değerleri İl Tarım Müdürlüğü resmi verileriyle belirlenmelidir.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyet Hesabı: İl Tarım Resmi Ağaç Cetveli - 30-35 Yaş)",
        aciklama: "Normal mahsul devresi tam verim birim rayici ile hesaplama.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (Gelir Kapitalizasyonu Yöntemi: Ağaç Başına Yıllık Net Gelir/KFO)",
        aciklama: "Ağaç başına 25 kg verim ve kapitalizasyon faizi ile hesaplanan gelir değeri.",
        katsayiCarpani: 1.18,
      },
      secenekC: {
        baslik: "Seçenek 3 (Yalnızca Odun / Kereste Değeri)",
        aciklama: "Eksiliş devresi sonu yakacak odun ve kereste hurda değeri.",
        katsayiCarpani: 0.15,
      },
    },
  },
  {
    id: "arsa_arazi_itirazi",
    baslik: "Taşınmazın Arsa mı Arazi mi Olduğu İtirazı (1983/6122 s. BKK)",
    itirazEden: "Davacı / Malik",
    ozetItiraz:
      "Davacı malik, taşınmazın büyükşehir belediye sınırları içerisinde kaldığını, etrafında meskun binalar olduğunu, arsa vasfında kabul edilerek emsal satış yöntemiyle değerlendirilmesini talep etmiştir.",
    mahkemeAraKarari:
      "Taşınmazın imar durumu, belediye hizmetlerinden fiilen yararlanma derecesi ve 1983/6122 sayılı Bakanlar Kurulu Kararı kriterleri yönünden ek rapor alınmasına.",
    tarafIddialari: {
      davaciIddia:
        "Taşınmaz mahalleye dönüşen beldede yer almakta olup, elektrik, su, yol hizmeti vardır, çevresinde konutlar yükselmektedir. Arsa olarak m² birim fiyatı 1.500 TL olmalıdır.",
      davaliIddia:
        "Taşınmaz 1/1000 ölçekli uygulama imar planı dışındadır, kadastro parselidir, üzerinde fiilen tarım yapılmaktadır. 2942 s.K. m. 11/f gereği net gelir metoduna tabidir.",
    },
    bilirkisiTeknikCevap:
      "Bakanlar Kurulu'nun 28.02.1983 gün ve 1983/6122 sayılı kararı ve Yargıtay İçtihadı Birleştirme Büyük Genel Kurulu'nun 17.04.1998 gün ve 1996/3 E., 1998/1 K. sayılı kararı uyarınca; bir yerin arsa sayılabilmesi için belediye mücavir alanında 1/1000 ölçekli uygulama imar planı içine alınmış olması veya plan dışında ise belediye hizmetlerinden (yol, su, elektrik, çöp toplama, kanalizasyon) tam olarak yararlanan ve etrafı meskun alanla çevrili bulunması gerekir. İlgili Belediye İmar Müdürlüğü yazısına göre parsel 1/1000 ölçekli imar planı dışındadır, kadastro parselidir ve üzerinde tarımsal ziraat icra edilmektedir. Bu nedenle taşınmaz ARSA değil, TARIM ARAZİSİ niteliğindedir ve net gelir metodu uygulanması zorunludur.",
    yargitayKriteri:
      "Yargıtay İBK 1996/3 E., 1998/1 K.: '1/1000 ölçekli imar planı içinde olmayan, etrafı meskun binalarla çevrili bulunmayan ve fiilen tarımda kullanılan parseller kamulaştırma uygulamasında arsa sayılamaz.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyet Hükmü: Tarım Arazisi - Net Gelir Metodu)",
        aciklama: "2942 s.K. m. 11/f uyarınca tarımsal net gelir kapitalizasyonu.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (Mahkemenin Arsa Kabulü Halinde: Emsal Satış Yöntemi)",
        aciklama: "Çevre kadastro parselleri resmi emsal satış rayiçlerine göre arsa m² hesabı.",
        katsayiCarpani: 2.45,
      },
    },
  },
  {
    id: "kismi_kamulastirma_itirazi",
    baslik: "Kısmi Kamulaştırma ve Artık Parsel Değer Azalışı (2942 s.K. m. 12)",
    itirazEden: "Davalı / Malik",
    ozetItiraz:
      "Malik vekili, tarlasından otoyol geçmesi nedeniyle parselin ikiye bölündüğünü, kuzeyde kalan 1.200 m² ve güneyde kalan 850 m² parçaların geometrisinin bozulduğunu, traktör dönemeyecek hale geldiğini, değer kaybı tazminatı ödenmesi veya tamamının kamulaştırılması gerektiğini ileri sürmüştür.",
    mahkemeAraKarari:
      "2942 sayılı Kanun'un 12. maddesi çerçevesinde artık parsellerde değer düşüşü bulunup bulunmadığının, kalan parçaların ekonomik ziraate elverişli olup olmadığının ek raporda değerlendirilmesine.",
    tarafIddialari: {
      davaciIddia:
        "Kamulaştırılan alanın bedeli ödenmiştir, kalan parsellere servis yolu bırakılmıştır, artık parsellerde değer kaybı söz konusu değildir.",
      davaliIddia:
        "Taşınmaz bölünmüş, sulama kanalından kopmuş ve dar üçgen parçalara ayrılmıştır. Kalan parçalar kullanılamaz durumdadır.",
    },
    bilirkisiTeknikCevap:
      "2942 sayılı Kamulaştırma Kanunu m. 12 uyarınca kısmi kamulaştırmada arta kalan kısımda kamulaştırma sebebiyle değer azalışı veya artışı meydana gelirse bu fark bedele ilave edilir. Keşif krokisinde görüldüğü üzere otoyol hattı parseli ortadan bölmüş; kuzeyde kalan (A) parçası dar sivri üçgen forma dönüşerek mekanizasyon manevra kabiliyetini %60 yitirmiş; güneyde kalan (B) parçası ise DSİ kanalından kopmuştur. Heyetimizce (A) parçasında %25, (B) parçasında ise %15 değer azalışı hesaplanmıştır. Ayrıca 850 m²'lik parça 5403 sayılı Toprak Koruma Kanunu asgari tarımsal parsel büyüklüğünün altında kaldığından, malikin 12/3 maddesi uyarınca tamamının kamulaştırılmasını talep hakkı bulunduğu mütalaa edilmiştir.",
    yargitayKriteri:
      "Yargıtay 5. HD 2022/1145 E., 2022/6890 K.: 'Kısmi kamulaştırma sonucu arta kalan taşınmazın yüzölçümü, geometrik biçimi ve kullanım kısıtlılığı irdelenerek değer düşüklüğü oranı tespit edilmeli, ekonomik ziraate elverişsiz kalan kısımlar malikin talebi halinde tamamı kamulaştırılmalıdır.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Kamulaştırılan Alan + Artık Parsel Değer Azalışı)",
        aciklama: "Kamulaştırma bedeline artık alanlardaki %25 ve %15 değer kaybının eklenmesi.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (Taşınmazın Tamamının Kamulaştırılması Hali - m. 12/3)",
        aciklama: "Ekonomik tarıma elverişsiz hale gelen artık parsellerin de idarece devralınması.",
        katsayiCarpani: 1.42,
      },
    },
  },
  {
    id: "irtifak_ddo_itirazi",
    baslik: "İrtifak Değer Düşüklüğü Oranı (DDO) İtirazı",
    itirazEden: "Davacı / İdare",
    ozetItiraz:
      "İdare vekili, irtifak hakkının taşınmazın tarımsal vasfını etkilemediğini, çiftçinin altından tarım yapmaya devam edebildiğini, takdir edilen %6.5 DDO oranının çok yüksek olduğunu, oranın en fazla %1.5-%2 olması gerektiğini iddia etmiştir.",
    mahkemeAraKarari:
      "İrtifak koridorunun arazi üzerindeki fiili ve hukuki kısıtlılığının irdelenmesi amacıyla ek rapor istenmiştir.",
    tarafIddialari: {
      davaciIddia:
        "Telin geçtiği alanın genişliği bellidir, buğday veya pamuk ziraatine engel teşkil etmemektedir.",
      davaliIddia:
        "380 kV yüksek gerilim hattı altında manyetik alan oluşmakta, sulama fıskiyesi ve ilaçlama dronu çalıştırılamamakta, boylu meyve ağacı dikilememektedir.",
    },
    bilirkisiTeknikCevap:
      "Bilirkişi heyetimiz TMMOB ZMO İrtifak Değerleme Normları ve Yargıtay 5. HD'nin yerleşik formülünü uygulamıştır: DDO = (İrtifak Sahası × İrtifak Katsayısı) / Parsel Toplam Alanı. Hat parseli tam ortadan ikiye bölmekte olup pilon ayağı da tarlanın merkezindedir. Traktörün pilon etrafında manevra yapması esnasında oluşan iş gücü ve yakıt kaybı, tellerin sarkma sahasında emniyet gereği yüksek boylu zirai faaliyete izin verilmemesi hususları göz önüne alındığında %6.5 DDO oranı bilimsel ve hakkaniyete tam uygundur.",
    yargitayKriteri:
      "Yargıtay 5. HD 2021/1045 E., 2021/8790 K.: 'Enerji nakil hattının parseli bölüş şekli, direk yerinin konumu ve tarımsal kullanım sınırlılığı dikkate alınarak DDO belirlenmelidir. Matbu oranlar uygulanamaz.'",
    secenekliTabloSablonu: {
      secenekA: {
        baslik: "Seçenek 1 (Heyet Formülü: DDO %6.5)",
        aciklama: "Hattın parseli ortadan bölmesi ve pilon kısıtlılığına dayalı standart hesap.",
        katsayiCarpani: 1.0,
      },
      secenekB: {
        baslik: "Seçenek 2 (İdare Savunması: Sınırdan Geçiş Asgari DDO %3.0)",
        aciklama: "Kısıtlılığın asgari düzeyde kabul edildiği alternatif model.",
        katsayiCarpani: 0.462,
      },
      secenekC: {
        baslik: "Seçenek 3 (Meyve Bahçesi Kısıtlılığı Düşünülerek: DDO %12.0)",
        aciklama: "Gelecekte meyve bahçesi tesis edilmesinin engellenmesi durumu.",
        katsayiCarpani: 1.846,
      },
    },
  },
];

// ============================================================================
// 2. MEYVE AĞAÇLARI 4 DEVRE DEĞERLEME & KURUYAN AĞAÇ TAZMİNATI (ZMO & Berberoğlu)
// ============================================================================

export interface MeyveAgaciBilgi {
  id: string;
  ad: string;
  latinceAd: string;
  tesisDevresiYil: number; // Devre 1: 0 - X yaş
  artisDevresiYil: number; // Devre 2: X - Y yaş
  normalMahsulDevresiYil: number; // Devre 3: Y - Z yaş
  ekonomikOmur: number; // Devre 4 bitişi / toplam ömür
  ortalamaVerimKgAgac: number; // Normal mahsul devresinde
  urunFiyatiTLKg: number; // 2025/2026 ortalama fiyat
  yillikBakimMasrafiTLAgac: number;
  fidanBirimMaliyetiTL: number;
  odunHurdaKiymetiTL: number;
  dekarNormAdet: number; // Dekara tavsiye edilen standart ağaç adedi
  aciklama: string;
}

export const MEYVE_AGACLARI_DB: MeyveAgaciBilgi[] = [
  {
    id: "antep_fistigi",
    ad: "Antepfıstığı (Aşılı / Kapama)",
    latinceAd: "Pistacia vera L.",
    tesisDevresiYil: 7,
    artisDevresiYil: 15,
    normalMahsulDevresiYil: 55,
    ekonomikOmur: 80,
    ortalamaVerimKgAgac: 22,
    urunFiyatiTLKg: 380,
    yillikBakimMasrafiTLAgac: 450,
    fidanBirimMaliyetiTL: 350,
    odunHurdaKiymetiTL: 500,
    dekarNormAdet: 14,
    aciklama:
      "Periyodisite gösterir (var yılı / yok yılı ortalaması alınır). Tesis devresi uzundur. Kuruyan ağaçlarda kalan ekonomik ömür kaybı yüksektir.",
  },
  {
    id: "zeytin",
    ad: "Zeytin (Sofralık / Yağlık)",
    latinceAd: "Olea europaea L.",
    tesisDevresiYil: 5,
    artisDevresiYil: 12,
    normalMahsulDevresiYil: 70,
    ekonomikOmur: 120,
    ortalamaVerimKgAgac: 35,
    urunFiyatiTLKg: 85,
    yillikBakimMasrafiTLAgac: 320,
    fidanBirimMaliyetiTL: 250,
    odunHurdaKiymetiTL: 800,
    dekarNormAdet: 20,
    aciklama:
      "3573 sayılı Zeytinciliğin Islahı Kanunu gereği özel koruma altındadır. Normal mahsul devresi 70+ yıla kadar uzar; ömrü sonsuz kabul edilebilir.",
  },
  {
    id: "ceviz",
    ad: "Ceviz (Chandler / Fernor Aşılı)",
    latinceAd: "Juglans regia L.",
    tesisDevresiYil: 4,
    artisDevresiYil: 10,
    normalMahsulDevresiYil: 40,
    ekonomikOmur: 60,
    ortalamaVerimKgAgac: 40,
    urunFiyatiTLKg: 140,
    yillikBakimMasrafiTLAgac: 400,
    fidanBirimMaliyetiTL: 300,
    odunHurdaKiymetiTL: 2500,
    dekarNormAdet: 16,
    aciklama:
      "Gövdesi kıymetli mobilya kerestesi vasfında olduğundan eksiliş devresinde odun hurda değeri çok yüksektir.",
  },
  {
    id: "findik",
    ad: "Fındık (Ocak Formu)",
    latinceAd: "Corylus avellana L.",
    tesisDevresiYil: 4,
    artisDevresiYil: 8,
    normalMahsulDevresiYil: 35,
    ekonomikOmur: 50,
    ortalamaVerimKgAgac: 6, // Ocak başına
    urunFiyatiTLKg: 145,
    yillikBakimMasrafiTLAgac: 180,
    fidanBirimMaliyetiTL: 120,
    odunHurdaKiymetiTL: 150,
    dekarNormAdet: 55,
    aciklama: "Karadeniz sahil ve orta kol kuşağında ocak usulü yetiştirilir. Ocak başı 4-6 dal bulunur.",
  },
  {
    id: "elma",
    ad: "Elma (Yarı Bodur M9/MM106)",
    latinceAd: "Malus domestica Borkh.",
    tesisDevresiYil: 3,
    artisDevresiYil: 6,
    normalMahsulDevresiYil: 22,
    ekonomikOmur: 30,
    ortalamaVerimKgAgac: 45,
    urunFiyatiTLKg: 28,
    yillikBakimMasrafiTLAgac: 220,
    fidanBirimMaliyetiTL: 180,
    odunHurdaKiymetiTL: 120,
    dekarNormAdet: 80,
    aciklama: "Bodur ve yarı bodur anaçlarda tesis devresi kısa, birim alana düşen ağaç sayısı yüksektir.",
  },
  {
    id: "kiraz",
    ad: "Kiraz (0900 Ziraat / Regina)",
    latinceAd: "Prunus avium L.",
    tesisDevresiYil: 4,
    artisDevresiYil: 8,
    normalMahsulDevresiYil: 25,
    ekonomikOmur: 35,
    ortalamaVerimKgAgac: 35,
    urunFiyatiTLKg: 75,
    yillikBakimMasrafiTLAgac: 380,
    fidanBirimMaliyetiTL: 240,
    odunHurdaKiymetiTL: 350,
    dekarNormAdet: 30,
    aciklama: "İhracata yönelik yüksek katma değerli meyvedir. Yağmur çatlaması ve monilya riski vardır.",
  },
  {
    id: "seftali",
    ad: "Şeftali / Nektarin",
    latinceAd: "Prunus persica L.",
    tesisDevresiYil: 3,
    artisDevresiYil: 5,
    normalMahsulDevresiYil: 15,
    ekonomikOmur: 20,
    ortalamaVerimKgAgac: 50,
    urunFiyatiTLKg: 32,
    yillikBakimMasrafiTLAgac: 260,
    fidanBirimMaliyetiTL: 190,
    odunHurdaKiymetiTL: 100,
    dekarNormAdet: 40,
    aciklama: "Ekonomik ömrü kısa olan sert çekirdekli meyve türüdür. Erken verime yatar.",
  },
  {
    id: "kayisi",
    ad: "Kayısı (Malatya Hacıhaliloğlu / Şekerpare)",
    latinceAd: "Prunus armeniaca L.",
    tesisDevresiYil: 4,
    artisDevresiYil: 8,
    normalMahsulDevresiYil: 30,
    ekonomikOmur: 40,
    ortalamaVerimKgAgac: 60,
    urunFiyatiTLKg: 55,
    yillikBakimMasrafiTLAgac: 310,
    fidanBirimMaliyetiTL: 220,
    odunHurdaKiymetiTL: 250,
    dekarNormAdet: 25,
    aciklama: "İlkbahar geç donlarına karşı hassastır. Kuru kayısı randımanı 1/4 oranındadır.",
  },
  {
    id: "narenciye",
    ad: "Narenciye (Portakal / Limon / Mandalina)",
    latinceAd: "Citrus spp.",
    tesisDevresiYil: 4,
    artisDevresiYil: 8,
    normalMahsulDevresiYil: 30,
    ekonomikOmur: 40,
    ortalamaVerimKgAgac: 80,
    urunFiyatiTLKg: 22,
    yillikBakimMasrafiTLAgac: 290,
    fidanBirimMaliyetiTL: 200,
    odunHurdaKiymetiTL: 200,
    dekarNormAdet: 35,
    aciklama: "Akdeniz ve Ege sahil kuşağında yetişir. Kış donları zararına karşı hassastır.",
  },
  {
    id: "incir",
    ad: "İncir (Aydın Sarılop)",
    latinceAd: "Ficus carica L.",
    tesisDevresiYil: 4,
    artisDevresiYil: 8,
    normalMahsulDevresiYil: 35,
    ekonomikOmur: 50,
    ortalamaVerimKgAgac: 45,
    urunFiyatiTLKg: 120,
    yillikBakimMasrafiTLAgac: 240,
    fidanBirimMaliyetiTL: 200,
    odunHurdaKiymetiTL: 150,
    dekarNormAdet: 20,
    aciklama: "Kurutmalık kalitesi yüksek mikroklima ister. İlekleme masrafı mevcuttur.",
  },
  {
    id: "badem",
    ad: "Badem (Ferragnes / Ferraduel)",
    latinceAd: "Prunus dulcis Mill.",
    tesisDevresiYil: 3,
    artisDevresiYil: 7,
    normalMahsulDevresiYil: 25,
    ekonomikOmur: 35,
    ortalamaVerimKgAgac: 18,
    urunFiyatiTLKg: 160,
    yillikBakimMasrafiTLAgac: 220,
    fidanBirimMaliyetiTL: 220,
    odunHurdaKiymetiTL: 250,
    dekarNormAdet: 28,
    aciklama: "Geç çiçeklenen Fransız çeşitleri don riskini azaltır. Kıraç arazide de yetişir.",
  },
  {
    id: "kavak",
    ad: "Kavak / Okaliptüs (Meyvesiz Endüstriyel Ağaç)",
    latinceAd: "Populus x euramericana",
    tesisDevresiYil: 2,
    artisDevresiYil: 6,
    normalMahsulDevresiYil: 12,
    ekonomikOmur: 15,
    ortalamaVerimKgAgac: 0,
    urunFiyatiTLKg: 0,
    yillikBakimMasrafiTLAgac: 80,
    fidanBirimMaliyetiTL: 90,
    odunHurdaKiymetiTL: 1200, // Kereste ve lif-yonga hacmi
    dekarNormAdet: 50,
    aciklama:
      "Meyvesiz ağaçlarda gelir metodu uygulanmaz; yaşa göre birikimli hacim (m³) ve kereste/lif-yonga birim fiyatı üzerinden değer takdir edilir.",
  },
];

/**
 * 4 Devre Kuralına Göre Ağaç Değerleme ve Kuruyan/Kesilen Ağaç Tazminatı Hesabı
 */
export function hesaplaAgacTazminati(
  turId: string,
  yas: number,
  adet: number,
  zararDurumu: "tamamen_kurudu" | "kesildi" | "kismi_hasar" = "tamamen_kurudu",
  hasarOraniPct: number = 100
): {
  agacAdi: string;
  devre: "Tesis Devresi" | "Artış Devresi" | "Normal Mahsul Devresi" | "Eksiliş Devresi";
  kalanOmurYil: number;
  birimAgacDegeriTL: number;
  toplamBrutDegerTL: number;
  tasarrufEdilenMasrafTL: number;
  odunHurdaKiymetiTL: number;
  netTazminatTL: number;
  metodolojikAciklama: string;
} {
  const agac = MEYVE_AGACLARI_DB.find((a) => a.id === turId) || MEYVE_AGACLARI_DB[0];
  const clampedYas = Math.max(1, Math.min(yas, agac.ekonomikOmur));
  const kalanOmur = Math.max(0, agac.ekonomikOmur - clampedYas);

  let devre: "Tesis Devresi" | "Artış Devresi" | "Normal Mahsul Devresi" | "Eksiliş Devresi";
  let birimDeger = 0;
  let metodoloji = "";

  // Meyvesiz kavak/okaliptüs özel hesabı
  if (agac.id === "kavak") {
    devre = clampedYas <= 2 ? "Tesis Devresi" : clampedYas <= 6 ? "Artış Devresi" : "Normal Mahsul Devresi";
    // Yaşa göre kereste hacmi birikimi
    const hacimKatsayisi = Math.min(1.0, clampedYas / agac.ekonomikOmur);
    birimDeger = Math.round(agac.fidanBirimMaliyetiTL + agac.odunHurdaKiymetiTL * hacimKatsayisi);
    metodoloji = `Meyvesiz ağaçlarda kereste/lif-yonga hacmi artış eğrisi esas alınmış; ${clampedYas}. yaştaki gövde hacmine göre birikimli ağaç değeri ${birimDeger.toLocaleString("tr-TR")} TL olarak saptanmıştır.`;
  } else if (clampedYas <= agac.tesisDevresiYil) {
    // DEVRE 1: TESİS DEVRESİ (0 - tesisDevresiYil) -> Gelir metodu uygulanmaz! Birikimli maliyet esastır.
    devre = "Tesis Devresi";
    const birikimliMasraf =
      agac.fidanBirimMaliyetiTL +
      clampedYas * (agac.yillikBakimMasrafiTLAgac * 0.6) + // Gençlik bakım maliyeti
      150 * clampedYas; // Çukur açma, dikim, herek, çubuk
    birimDeger = Math.round(birikimliMasraf);
    metodoloji = `Tesis devresinde (${clampedYas}. yaş) ağaç henüz tam ekonomik verime yatmadığından ZMO kuralları gereği gelir metodu uygulanamaz. Fidan bedeli, dikim işçiliği ve ${clampedYas} yıllık birikimli bakım gideri toplanarak fidan yenileme maliyeti esas alınmıştır.`;
  } else if (clampedYas <= agac.artisDevresiYil) {
    // DEVRE 2: ARTIŞ DEVRESİ -> Verim her yıl artar
    devre = "Artış Devresi";
    const artisOrani = (clampedYas - agac.tesisDevresiYil) / (agac.artisDevresiYil - agac.tesisDevresiYil);
    const fiiliVerim = agac.ortalamaVerimKgAgac * (0.3 + 0.7 * artisOrani);
    const yillikNetGelir = Math.max(0, fiiliVerim * agac.urunFiyatiTLKg - agac.yillikBakimMasrafiTLAgac);
    // KFO %5 ile kapitalize edilir + genç ağaç potansiyeli
    const kapitalizeDeger = yillikNetGelir / 0.05;
    birimDeger = Math.round(Math.min(kapitalizeDeger, agac.fidanBirimMaliyetiTL * 10 + yillikNetGelir * 4));
    metodoloji = `Artış devresinde (${clampedYas}. yaş) verim her yıl yükselme trendindedir. Yıllık ortalama ${fiiliVerim.toFixed(1)} kg ürün ve ${yillikNetGelir.toLocaleString("tr-TR")} TL net gelir üzerinden kapitalize değer takdir edilmiştir.`;
  } else if (clampedYas <= agac.normalMahsulDevresiYil) {
    // DEVRE 3: NORMAL MAHSUL DEVRESİ -> Tam verim çağı
    devre = "Normal Mahsul Devresi";
    const yillikNetGelir = Math.max(
      0,
      agac.ortalamaVerimKgAgac * agac.urunFiyatiTLKg - agac.yillikBakimMasrafiTLAgac
    );
    // KFO %5 üzerinden yıllık safi hasılat kapitalizasyonu
    const kapitalizeBirim = yillikNetGelir / 0.05;
    birimDeger = Math.round(kapitalizeBirim / agac.dekarNormAdet); // Ağaç başına normalize edilmiş kapitalize rayiç
    metodoloji = `Normal mahsul devresinde (${clampedYas}. yaş) ağaç tam verim çağındadır. Dekar başına ${agac.dekarNormAdet} adet norm dikim sıklığında ağaç başına yıllık net gelir üzerinden kapitalizasyon faizi formülü uygulanmıştır.`;
  } else {
    // DEVRE 4: EKSİLİŞ DEVRESİ -> Yaşlılık dönemi, verim düşer, hurda odun değerine yaklaşır
    devre = "Eksiliş Devresi";
    const yaslilikKatsayisi = Math.max(
      0.15,
      (agac.ekonomikOmur - clampedYas) / (agac.ekonomikOmur - agac.normalMahsulDevresiYil)
    );
    const yillikNetGelir =
      Math.max(0, agac.ortalamaVerimKgAgac * agac.urunFiyatiTLKg - agac.yillikBakimMasrafiTLAgac) *
      yaslilikKatsayisi;
    birimDeger = Math.round(yillikNetGelir * 2.5 + agac.odunHurdaKiymetiTL);
    metodoloji = `Eksiliş devresinde (${clampedYas}. yaş) ağacın verimi biyolojik yaşlılık sebebiyle düşüşe geçmiştir. Kalan ekonomik ömrün getireceği sınırlı net gelir ile ağacın kesilmesi halinde elde edilecek yakacak/kereste odun değeri birlikte değerlendirilmiştir.`;
  }

  // Zarar / Tazminat Mahsupları
  const brutToplam = birimDeger * adet;
  // Kuruyan ağaçta yapılmaktan kurtulunan (tasarruf edilen) bakım masrafları: Kalan ömrün ilk 2 yılı
  const tasarrufEdilenMasraf =
    zararDurumu === "tamamen_kurudu"
      ? Math.round(agac.yillikBakimMasrafiTLAgac * adet * Math.min(2, kalanOmur))
      : 0;
  // Odun olarak satılabilecek gövde hurda değeri
  const odunKiymeti = Math.round(agac.odunHurdaKiymetiTL * adet);

  // Nihai Net Tazminat: Brüt Değer - Tasarruf Edilen Masraf + (Eğer odun teslim edilmemişse) veya - (Odun malikte kalmışsa mahsup)
  let netTazminat = 0;
  if (zararDurumu === "tamamen_kurudu") {
    // Odun malikçe yakacak olarak değerlendirildiğinden odun kıymeti zarardan mahsup edilir (TBK m. 52/55 kurtarma kuralı)
    netTazminat = Math.max(0, brutToplam - tasarrufEdilenMasraf - odunKiymeti);
  } else if (zararDurumu === "kesildi") {
    netTazminat = Math.max(0, brutToplam - odunKiymeti);
  } else {
    // Kısmi hasar (% oranında)
    netTazminat = Math.round(brutToplam * (hasarOraniPct / 100));
  }

  return {
    agacAdi: agac.ad,
    devre,
    kalanOmurYil: kalanOmur,
    birimAgacDegeriTL: birimDeger,
    toplamBrutDegerTL: brutToplam,
    tasarrufEdilenMasrafTL: tasarrufEdilenMasraf,
    odunHurdaKiymetiTL: odunKiymeti,
    netTazminatTL: netTazminat,
    metodolojikAciklama: metodoloji,
  };
}

// ============================================================================
// 3. ZİRAİ YAPI, SERA VE TESİS AMORTİSMAN CETVELİ (ZMO Tablo 1 & ÇŞB)
// ============================================================================

export interface ZiraiYapiBilgi {
  id: string;
  ad: string;
  kategori: "sera" | "barinak" | "depo_tesis" | "altyapi";
  birimMaliyetTLM2: number; // 2025/2026 ÇŞB yaklaşık birim maliyeti
  ekonomikOmurYil: number;
  yillikAmortismanPct: number; // Yıllık yıpranma oranı (%)
  azamiYipranmaPct: number; // Tavan yıpranma (en fazla %80-90)
  enkazHurdaOraniPct: number; // Enkaz / hurda malzeme kurtarma payı (%)
  aciklama: string;
}

export const ZIRAI_YAPI_TESIS_DB: ZiraiYapiBilgi[] = [
  {
    id: "cam_sera",
    ad: "Cam Sera (Galvaniz Çelik İskeletli, Isıtmalı)",
    kategori: "sera",
    birimMaliyetTLM2: 2400,
    ekonomikOmurYil: 25,
    yillikAmortismanPct: 4.0,
    azamiYipranmaPct: 80,
    enkazHurdaOraniPct: 15,
    aciklama:
      "Çelik galvaniz karkas, otomatik havalandırma, çift cam / polikarbonat kaplama ve ısıtma sistemli modern seralar.",
  },
  {
    id: "plastik_blok_sera",
    ad: "Plastik Blok Sera (Gotik / Tünel Polietilen Örtülü)",
    kategori: "sera",
    birimMaliyetTLM2: 1450,
    ekonomikOmurYil: 15,
    yillikAmortismanPct: 6.6,
    azamiYipranmaPct: 85,
    enkazHurdaOraniPct: 10,
    aciklama:
      "UV+IR katkılı PE plastik örtülü, damla sulama altyapısına haiz yaygın ticari sebze seraları.",
  },
  {
    id: "alcak_tunel_sera",
    ad: "Alçak Tünel / Malçlama Sistemi",
    kategori: "sera",
    birimMaliyetTLM2: 380,
    ekonomikOmurYil: 5,
    yillikAmortismanPct: 20.0,
    azamiYipranmaPct: 90,
    enkazHurdaOraniPct: 5,
    aciklama: "Erkenci sebzecilik ve çilek yetiştiriciliğinde kullanılan seyyar demir yaylı alçak tüneller.",
  },
  {
    id: "tas_tugla_ahir",
    ad: "Taş / Tuğla Duvarlı Zirai Ahır - Ağıl",
    kategori: "barinak",
    birimMaliyetTLM2: 3200,
    ekonomikOmurYil: 40,
    yillikAmortismanPct: 2.5,
    azamiYipranmaPct: 75,
    enkazHurdaOraniPct: 10,
    aciklama: "Kargir taş veya tuğla duvarlı, sac veya kiremit çatılı geleneksel hayvan barınakları.",
  },
  {
    id: "celik_prefabrik_ahir",
    ad: "Çelik Prefabrik Modern Ahır & Sağımhane",
    kategori: "barinak",
    birimMaliyetTLM2: 4800,
    ekonomikOmurYil: 30,
    yillikAmortismanPct: 3.3,
    azamiYipranmaPct: 75,
    enkazHurdaOraniPct: 20,
    aciklama:
      "Sandviç panel çatılı, çelik taşıyıcı kolonlu, otomatik gübre sıyırıcılı ve sağım üniteli endüstriyel barınak.",
  },
  {
    id: "samanlik_hangar",
    ad: "Samanlık / Yem Hangarı (Çelik / Ahşap Karkas)",
    kategori: "depo_tesis",
    birimMaliyetTLM2: 1850,
    ekonomikOmurYil: 30,
    yillikAmortismanPct: 3.3,
    azamiYipranmaPct: 80,
    enkazHurdaOraniPct: 12,
    aciklama: "Kaba yem, balya ve zirai aletlerin muhafaza edildiği sundurma ve kapalı hangarlar.",
  },
  {
    id: "silaj_cukuru",
    ad: "Silaj Çukuru (Betonarme Perdeli ve Tabanlı)",
    kategori: "depo_tesis",
    birimMaliyetTLM2: 1600,
    ekonomikOmurYil: 30,
    yillikAmortismanPct: 3.3,
    azamiYipranmaPct: 75,
    enkazHurdaOraniPct: 8,
    aciklama: "Mısır ve ot silajının fermente edildiği sızdırmaz beton yan duvarlı bunker silolar.",
  },
  {
    id: "derin_kuyu_trafo",
    ad: "Derin Kuyu Sondajı (150m) & Dalgıç Pompa & Trafo",
    kategori: "altyapi",
    birimMaliyetTLM2: 350000, // Adet / Paket maliyeti
    ekonomikOmurYil: 20,
    yillikAmortismanPct: 5.0,
    azamiYipranmaPct: 80,
    enkazHurdaOraniPct: 15,
    aciklama:
      "Çelik teçhiz borulu artezyen kuyusu, derin kuyu dalgıç pompası, elektrik panosu ve 50-100 kVA trafo tesisi.",
  },
  {
    id: "sulama_tesisati",
    ad: "Damla / Yağmurlama Sulama Tesisatı (Boru, Filtre, Gübreleme)",
    kategori: "altyapi",
    birimMaliyetTLM2: 550, // Dekar veya m² bazlı
    ekonomikOmurYil: 10,
    yillikAmortismanPct: 10.0,
    azamiYipranmaPct: 85,
    enkazHurdaOraniPct: 8,
    aciklama: "PE ana boru, lateral damlatıcı hatlar, hidrosiklon kum filtresi ve venturi gübre tankı.",
  },
  {
    id: "soguk_hava_deposu",
    ad: "Meyve / Süt Soğuk Hava Deposu (Poliüretan Panel)",
    kategori: "depo_tesis",
    birimMaliyetTLM2: 6500,
    ekonomikOmurYil: 25,
    yillikAmortismanPct: 4.0,
    azamiYipranmaPct: 75,
    enkazHurdaOraniPct: 18,
    aciklama: "10 cm kilitli sandviç panel, soğutma kompresörü, evaporatör ve nemlendirme otomasyonu.",
  },
  {
    id: "ihata_duvari_cit",
    ad: "İhata Duvarı / Tel Çit (Beton Direkli Galvanizli Örgü Tel)",
    kategori: "altyapi",
    birimMaliyetTLM2: 420, // Metretül (mtül)
    ekonomikOmurYil: 20,
    yillikAmortismanPct: 5.0,
    azamiYipranmaPct: 80,
    enkazHurdaOraniPct: 10,
    aciklama: "Eğimli kavelalı beton direkler, 3 sıra dikenli tel ve helezonik galvanizli kafes tel örgü.",
  },
];

/**
 * Zirai Yapı ve Tesis Amortisman & Yıpranma Değerleme Hesabı
 */
export function hesaplaZiraiYapiAmortisman(
  yapiId: string,
  alanM2VeyaAdet: number,
  yapiYasi: number
): {
  yapiAdi: string;
  yenidenInsaDegeriTL: number;
  yipranmaOraniPct: number;
  yipranmaTutariTL: number;
  yipranmisKiymetTL: number;
  enkazHurdaDegeriTL: number;
  netTazminatBedeliTL: number;
  mevzuatNotu: string;
} {
  const yapi = ZIRAI_YAPI_TESIS_DB.find((y) => y.id === yapiId) || ZIRAI_YAPI_TESIS_DB[0];
  const yenidenInsa = yapi.birimMaliyetTLM2 * alanM2VeyaAdet;

  // Yaşa göre hesaplanan amortisman (azami yıpranma tavanı ile sınırlı)
  const teorikYipranma = yapiYasi * yapi.yillikAmortismanPct;
  const fiiliYipranmaPct = Math.min(yapi.azamiYipranmaPct, Math.max(0, teorikYipranma));

  const yipranmaTutari = Math.round(yenidenInsa * (fiiliYipranmaPct / 100));
  const yipranmisKiymet = yenidenInsa - yipranmaTutari;
  const enkazHurdaDegeri = Math.round(yenidenInsa * (yapi.enkazHurdaOraniPct / 100));

  // Kamulaştırmada yapı bedeli = Yıpranmış Kıymet (enkaz malike bırakılırsa enkaz bedeli düşülebilir)
  const netTazminat = yipranmisKiymet;

  return {
    yapiAdi: yapi.ad,
    yenidenInsaDegeriTL: yenidenInsa,
    yipranmaOraniPct: Number(fiiliYipranmaPct.toFixed(1)),
    yipranmaTutariTL: yipranmaTutari,
    yipranmisKiymetTL: yipranmisKiymet,
    enkazHurdaDegeriTL: enkazHurdaDegeri,
    netTazminatBedeliTL: netTazminat,
    mevzuatNotu: `Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Yapı Yaklaşık Birim Maliyetleri ve TMMOB ZMO Amortisman Cetveli uyarınca; ${yapiYasi} yaşındaki tesis için %${fiiliYipranmaPct.toFixed(1)} yıpranma payı düşülerek değer tespit edilmiştir.`,
  };
}

// ============================================================================
// 4. KISMİ KAMULAŞTIRMA VE ARTIK PARSEL DEĞER AZALIŞI (2942 s.K. m. 12)
// ============================================================================

export interface KismiKamulastirmaParametreleri {
  parselToplamAlanM2: number;
  kamulastirilanAlanM2: number;
  m2RayicBedeliTL: number;
  artikParsel1AlanM2: number;
  artikParsel1DegerDususuPct: number; // %0 - %50
  artikParsel2AlanM2: number;
  artikParsel2DegerDususuPct: number; // %0 - %50
  artikParselEkonomikYararsizMi: boolean;
}

export function hesaplaKismiKamulastirma(params: KismiKamulastirmaParametreleri): {
  kamulastirmaBedeliTL: number;
  artik1DegerKaybiTL: number;
  artik2DegerKaybiTL: number;
  toplamDegerKaybiTL: number;
  toplamOdenecekTazminatTL: number;
  tamamKamulastirmaBedeliTL: number;
  kanuniHukukiTavsiye: string;
} {
  const kamulastirmaBedeli = params.kamulastirilanAlanM2 * params.m2RayicBedeliTL;
  const artik1DegerKaybi = Math.round(
    params.artikParsel1AlanM2 * params.m2RayicBedeliTL * (params.artikParsel1DegerDususuPct / 100)
  );
  const artik2DegerKaybi = Math.round(
    params.artikParsel2AlanM2 * params.m2RayicBedeliTL * (params.artikParsel2DegerDususuPct / 100)
  );
  const toplamDegerKaybi = artik1DegerKaybi + artik2DegerKaybi;
  const toplamOdenecek = kamulastirmaBedeli + toplamDegerKaybi;

  // Taşınmazın tamamının kamulaştırılması durumundaki bedel (m. 12/3)
  const tamamKamulastirma = params.parselToplamAlanM2 * params.m2RayicBedeliTL;

  let hukukiTavsiye = "";
  if (params.artikParselEkonomikYararsizMi) {
    hukukiTavsiye =
      "2942 sayılı Kamulaştırma Kanunu m. 12/3 uyarınca; kamulaştırmadan arta kalan parçalar geometrik açıdan biçimsizleştiğinden ve 5403 sayılı Toprak Koruma Kanunu asgari tarımsal arazi büyüklüğünün altında kalarak ekonomik tarıma elverişsiz hale geldiğinden, malikin tebligat tarihinden itibaren idareye başvurarak taşınmazın TAMAMININ KAMULAŞTIRILMASINI talep hakkı mevcuttur.";
  } else {
    hukukiTavsiye =
      "2942 sayılı Kamulaştırma Kanunu m. 12/2 uyarınca kısmi kamulaştırma neticesinde arta kalan parsellerde meydana gelen fonksiyonel değer azalışı kamulaştırma bedeline eklenerek malike tazmin edilmelidir.";
  }

  return {
    kamulastirmaBedeliTL: kamulastirmaBedeli,
    artik1DegerKaybiTL: artik1DegerKaybi,
    artik2DegerKaybiTL: artik2DegerKaybi,
    toplamDegerKaybiTL: toplamDegerKaybi,
    toplamOdenecekTazminatTL: toplamOdenecek,
    tamamKamulastirmaBedeliTL: tamamKamulastirma,
    kanuniHukukiTavsiye: hukukiTavsiye,
  };
}

// ============================================================================
// 5. ADALET BAKANLIĞI BİLİRKİŞİLİK DAİRE BAŞKANLIĞI 32 REHBER İLKE
// ============================================================================

export interface AdaletRehberIlke {
  no: number;
  baslik: string;
  kategori: "görev_yetki" | "kusur_hukuk_yasagi" | "bilimsel_metot" | "rapor_ve_celiski";
  ozetKural: string;
  tamMetin: string;
  pratikUygulamaNotu: string;
  onemliUyari?: string;
}

export const ADALET_BAKANLIGI_32_ILKE: AdaletRehberIlke[] = [
  {
    no: 1,
    baslik: "Temel ve Alt Uzmanlık Alanına Göre Görev Kabulü",
    kategori: "görev_yetki",
    ozetKural: "Bilirkişi sadece listeye kayıtlı olduğu temel ve alt uzmanlık alanında görev kabul etmelidir.",
    tamMetin:
      "Bilirkişinin, görevlendirildiği uzmanlık alanında çok iyi bilgi ve beceri sahibi olması gerektiğinden bilirkişi listelerine kayıt için başvururken temel ve alt uzmanlık alanı seçiminde bu hususa özellikle dikkat etmesi ve özen göstermesi gerekir.",
    pratikUygulamaNotu: "Ziraat mühendisi inşaat veya kadastro sınır ölçümü alanında tek başına imza atamaz; heyet halinde çalışmalıdır.",
  },
  {
    no: 2,
    baslik: "Bir Hafta İçinde Görevi İade Etme Zorunluluğu",
    kategori: "görev_yetki",
    ozetKural: "Uzmanlık alanı dışındaki görevler en geç 1 hafta içinde mahkemeye bildirilip iade edilmelidir.",
    tamMetin:
      "Bilirkişi, görevlendirildikten sonra yapacağı ön inceleme sonucunda konunun kendi uzmanlık alanına girmediğini tespit ettiğinde en geç bir hafta içinde görevlendirmeyi yapan mercie bildirmeli ve görevlendirmeyi kabul etmemelidir.",
    pratikUygulamaNotu: "Görevi süresi geçtikten sonra iade etmek sicilden çıkarılma yaptırımı doğurabilir.",
  },
  {
    no: 3,
    baslik: "Görev Alanı ve Sınırları Hakkında Yazılı Talimat İsteme",
    kategori: "görev_yetki",
    ozetKural: "Tereddüt halinde görevlendiren mahkemeden yazılı talimat istenmelidir.",
    tamMetin:
      "Bilirkişi, görev alanı ve sınırları hakkında tereddüte düşerse, bu tereddütün giderilmesini mutlaka kendisini görevlendiren merciden yazılı olarak istemeli ve görevlendiren merci tarafından verilen yazılı talimata göre incelemesini yapmalıdır.",
    pratikUygulamaNotu: "Ara kararda sorulmayan hususlarda kendiliğinden rapor genişletilemez.",
  },
  {
    no: 4,
    baslik: "Soruların Kapsam ve Sınırlarının Belirlenmesini Talep Etme",
    kategori: "görev_yetki",
    ozetKural: "Cevaplanması istenen somut soruların ara kararda açıkça belirtilmesi talep edilmelidir.",
    tamMetin:
      "Bilirkişi, görevlendirmenin mevzuat hükümlerine uygun olarak yapılmasını, kapsam ve sınırları ile cevaplaması istenen soruların sorulmasını mutlaka görevlendirmeyi yapan merciden talep etmelidir.",
    pratikUygulamaNotu: "'Dosyanın incelenerek rapor tanzimine' şeklindeki soyut görevlendirmelerde mahkemeden somut sorular istenmelidir.",
  },
  {
    no: 5,
    baslik: "Bölge Kurulu Yetki Çevresindeki Görevleri Kabul Zorunluluğu",
    kategori: "görev_yetki",
    ozetKural: "Yetki çevresindeki tüm il ve ilçelerden gelen görevler geçerli mazeret yoksa kabul edilmelidir.",
    tamMetin:
      "Bilirkişi, kayıtlı olduğu bilirkişilik bölge kurulunun yetki çevresindeki tüm il ve ilçelerden yapılan görevlendirmeleri geçerli bir mazereti bulunmadığı takdirde kabul etmek zorunda olup, bilirkişilik görevini kabulden kaçınmasının sicilden ve listeden çıkarılma yaptırımını gerektirebileceğini unutmamalıdır.",
    pratikUygulamaNotu: "Uzak ilçe gerekçesiyle görevi sebepsiz reddetmeyiniz.",
  },
  {
    no: 6,
    baslik: "UYAP Üzerinden Dosya İnceleme Yetkisi İsteme",
    kategori: "görev_yetki",
    ozetKural: "Fiziki dosya teslimi yerine UYAP Bilirkişi Portalı üzerinden dosya inceleme yetkisi talep edilmelidir.",
    tamMetin:
      "Bilirkişi, UYAP vasıtasıyla dosyanın incelenmesinin mümkün olduğu hallerde, zaman ve emek kaybını en aza indirmek amacıyla dosyanın veya belgenin fizikî olarak teslim edilmeksizin UYAP üzerinden kendisine dosya inceleme yetkisi verilmesini görevlendirmeyi yapan merciden talep etmelidir.",
    pratikUygulamaNotu: "UYAP Bilirkişi Portalında e-imzalı evrakları indirip güvenle inceleyebilirsiniz.",
  },
  {
    no: 7,
    baslik: "Azami Dikkat ve Özenle Tüm Soruları Cevaplama",
    kategori: "görev_yetki",
    ozetKural: "Rapor hak ve adaletin tecellisine hizmet edecek titizlikle tanzim edilmelidir.",
    tamMetin:
      "Bilirkişi, incelemesini yaparken hak ve adaletin gerçekleşmesinde hâkime yardımcı olacağından, bu sorumluluk bilinciyle azami dikkat ve özen göstererek kendisine sorulan tüm sorulara cevap verecek biçimde raporunu hazırlamalıdır.",
    pratikUygulamaNotu: "Ara karardaki her bir teknik soru ayrı başlık altında eksiksiz yanıtlanmalıdır.",
  },
  {
    no: 8,
    baslik: "Farklı Uzmanlık Alanından Ek Bilirkişi Talep Etme",
    kategori: "görev_yetki",
    ozetKural: "Disiplinlerarası konularda mahkemeden diğer uzmanlık alanından bilirkişi atanması talep edilmelidir.",
    tamMetin:
      "Bilirkişi, incelemekle görevli olduğu bir sorunun açıklığa kavuşturulması ya da saptanması için başka bir uzmanın bilgisine ve yardımına ihtiyaç duyabilir. Bu durumda, kendisini görevlendiren mercie başvurarak ihtiyaç duyduğu uzmanlık alanından da bilirkişi atamasını talep etmeli ve bu şekilde o uzmanın bilgisinden yararlanmalıdır.",
    pratikUygulamaNotu: "Örneğin tarım arazisinde hidrojeolojik kaynak tespiti için jeoloji mühendisi talep edilebilir.",
  },
  {
    no: 9,
    baslik: "Uzmanlık Dışı Konularda Belirleme ve Görüş Bildirmeme Yasağı",
    kategori: "kusur_hukuk_yasagi",
    ozetKural: "Bilirkişi uzmanlık alanı dışındaki hususlarda asla kesin belirleme yapamaz.",
    tamMetin:
      "Bilirkişi, görevlendirme konusu hakkında öncelikle geniş bir analiz yaparak uzmanlık alanına girmeyen, uyuşmazlığa ve sorunun çözümüne doğrudan etkili olmayan bir durum ile karşılaştığında raporunda kesinlikle bu konuda herhangi bir belirleme yapmamalı, görüş açıklamamalıdır.",
    pratikUygulamaNotu: "Ziraat bilirkişisi tapu tescilinin hukuki geçerliliği konusunda görüş bildiremez.",
  },
  {
    no: 10,
    baslik: "Görev ve Yetki Sınırlarının Dışına Çıkmama İlkesi",
    kategori: "görev_yetki",
    ozetKural: "Bilirkişi kendisine verilen sınırları aşamaz, tarafların talep etmediği konularda yorum yapamaz.",
    tamMetin:
      "Bilirkişinin görev alanı genelde kendi bilgi ve uzmanlık alanı, özelde ise sorulan sorular ile sınırlıdır. Bilirkişi, kendisine verilen görev ve yetkinin dışına çıkamaz.",
    pratikUygulamaNotu: "Dava konusu olmayan parseller hakkında re'sen inceleme yapmayınız.",
  },
  {
    no: 14,
    baslik: "Ölçümleri Bizzat Yapma Zorunluluğu",
    kategori: "bilimsel_metot",
    ozetKural: "Bilirkişi ölçümleri keşifte bizzat yapmalı, tarafların beyan ettiği ölçümleri esas almamalıdır.",
    tamMetin:
      "Bilirkişi, değerlendirmesinde kullanmak üzere ölçüm yapması gerektiğinde, bu ölçümleri bizzat yapmalı, tarafların verdikleri ölçümleri esas alarak değerlendirme yapmamalıdır. Hesaplama yaparken esas aldığı birim fiyatlara ve dayandığı kriterlere raporunda açıklamalı olarak yer vermelidir.",
    pratikUygulamaNotu: "Arazi eğimi, ağaç adedi ve sera alanını keşif esnasında heyetçe bizzat ölçüp tutanağa geçirin.",
  },
  {
    no: 15,
    baslik: "Takdiri Değerlendirmeleri Hâkime Bırakma",
    kategori: "kusur_hukuk_yasagi",
    ozetKural: "Bilirkişi olayı teknik olarak anlatmalı, takdir ve yorumu hâkime bırakmalıdır.",
    tamMetin:
      "Bilirkişi, raporunda kesinlikle takdiri değerlendirmelerde bulunmamalı, somut olayı tüm açıklığı ile raporunda anlattıktan sonra olayın yorumunu ve takdirini hâkime bırakmalıdır.",
    pratikUygulamaNotu: "'Müterafik kusur indirimi yapılmalıdır' denilemez; olgular sıralanıp takdir mahkemeye bırakılır.",
  },
  {
    no: 16,
    baslik: "Hukuki Nitelendirme ve Değerlendirme Yapma Yasağı (HMK 266 & 279)",
    kategori: "kusur_hukuk_yasagi",
    ozetKural: "Bilirkişi hukuki meselelerde değerlendirme yapamaz; hâkim yerine geçemez.",
    tamMetin:
      "Somut olayda özel veya teknik bilgiye gerek olup olmadığı ve bunların belirlenmesi hukuksal bir işlem olup hâkimin görevidir. Bu nedenle, bilirkişi, raporunu hazırlarken hukuki nitelendirme ve değerlendirmelerde bulunamaz.",
    pratikUygulamaNotu: "'Sözleşme feshedilmiştir', 'Haksız fiil gerçekleşmiştir', 'Zamanaşımı dolmuştur' gibi hukuki tabirler YASAKTIR.",
  },
  {
    no: 18,
    baslik: "Açık, Anlaşılır Türkçe ve Terim Açıklaması",
    kategori: "bilimsel_metot",
    ozetKural: "Teknik terimlerin Türkçe karşılıkları yazılmalı, sade ve anlaşılır üslup kullanılmalıdır.",
    tamMetin:
      "Bilirkişi raporu biçim, üslup ve dil bakımından görevlendirmeyi yapan merci ile tarafların anlayacağı nitelikte ve okunaklı olmalıdır. Bilirkişi teknik terim ve kavramların Türkçe karşılıklarını parantez içinde belirtmelidir.",
    pratikUygulamaNotu: "Örneğin 'Epinasti (bitki sürgünlerinin aşağı doğru kıvrılması)' şeklinde parantez içi açıklama yapınız.",
  },
  {
    no: 28,
    baslik: "KUSUR DAĞITIMI KESİN YASAĞI (Danıştay İDDK 2026/22)",
    kategori: "kusur_hukuk_yasagi",
    ozetKural: "Bilirkişi kusurluluk konusunda (asli/tali, kusursuz, yüzdelik oran) asla değerlendirme yapamaz!",
    tamMetin:
      "Kusurun tespiti normatif bir değerlendirmeyle mümkündür ve sadece hâkimin yetkisindedir. Bilirkişi münhasıran hâkimin yetkisinde olan kusurluluk konusunda (asli/tali kusurlu, kusursuz, yüzdelik kusur oranı) herhangi bir değerlendirme yapamaz. Aksi yöndeki tutum bilirkişilik görevinin sınırlarını aşmayı ve hâkimin yerine geçmeyi ifade eder. (Danıştay İDDK 07/01/2026 T., E:2025/2154, K:2026/22).",
    pratikUygulamaNotu: "Raporda %80 kusurlu veya asli kusurlu YAZMAYINIZ. Yalnızca teknik illiyet bağını ve şartname ihlalini belirtiniz.",
    onemliUyari: "Bilirkişinin kusur oranı yazması raporun iptaline ve disiplin soruşturmasına neden olur!",
  },
  {
    no: 29,
    baslik: "Çelişkili Raporların Giderilmesi Usulü",
    kategori: "rapor_ve_celiski",
    ozetKural: "Önceki çelişkili raporlardaki tespitler tartışılmalı, ayrılma gerekçesi bilimsel olarak gösterilmelidir.",
    tamMetin:
      "Bilirkişi, dosyada daha önce alınan bilirkişi raporları arasındaki çelişkinin giderilmesi için görevlendirilmişse; birbiriyle çelişen raporlardaki tespit ve değerlendirmelerden hangilerine katıldığını veya farklı bir görüş sunacak ise bunun nedenlerini tartışıp gerekçelendirerek raporunu düzenlemelidir.",
    pratikUygulamaNotu: "'İlk raporda KFO %3 alınarak hata yapılmıştır çünkü...' şeklinde bilimsel gerekçesi yazılmalıdır.",
  },
  {
    no: 30,
    baslik: "Ek Rapor Tanzim İlkeleri (HMK 281)",
    kategori: "rapor_ve_celiski",
    ozetKural: "Ek rapor, itirazları tam karşılamalı ve tekrar ek rapor alınmasına mahal vermeyecek nitelikte olmalıdır.",
    tamMetin:
      "Bilirkişi, dosyada ek rapor alınmak üzere görevlendirilmiş ise ek raporun alınma gerekçesi çerçevesinde soruna çözüm üretecek mahiyette ve tekrar ek rapor alınmasına mahal verilmeyecek nitelikte rapor düzenlemelidir.",
    pratikUygulamaNotu: "Tarafların her bir itirazına ayrı alt başlıkta yanıt verip seçenekli hesap tablosu sununuz.",
  },
  {
    no: 31,
    baslik: "Denetime Elverişli Gerekçe ('Neden ve Niçin' Sorusunu Cevapsız Bırakmama)",
    kategori: "bilimsel_metot",
    ozetKural: "Açıklanan her görüşün bilimsel ve matematiksel dayanağı raporda yer almalıdır.",
    tamMetin:
      "Bilirkişi, hazırlayacağı raporda ulaştığı sonuçların gerekçesini de açıklamakla yükümlüdür. Gerekçe keyfi açıklamaları önler ve yargısal denetimi sağlar. Raporun 'neden veya niçin' gibi soruları sordurmaması gerekir.",
    pratikUygulamaNotu: "Formüllerde kullanılan tüm rakamların hangi resmi kurum cetvelinden alındığı dipnotla belirtilmelidir.",
  },
  {
    no: 32,
    baslik: "Heyet Halinde Müzakere ve Muhalefet Şerhi (Karşı Oy) Usulü",
    kategori: "rapor_ve_celiski",
    ozetKural: "Kurul bilirkişileri birlikte müzakere etmeli; anlaşamayan üye karşı oyunu gerekçesiyle yazmalıdır.",
    tamMetin:
      "Bilirkişilerin kurul halinde görevlendirilmeleri halinde, bir araya gelerek toplantılar yapmak suretiyle müzakerelerde bulunmaları ve raporu birlikte hazırlamaları kurul halinde görevlendirmenin bir gereğidir. Kurul halinde görevlendirmelerde muhalefette kalan bilirkişi karşı oyunu belirten imzayı attıktan sonra ayrı bir rapor verebilir.",
    pratikUygulamaNotu: "Heyet üyeleri aynı raporda imza altına alır; mutabık kalınmayan kısım 'Karşı Oy Gerekçesi' olarak eklenir.",
  },
];

// ============================================================================
// 6. RESMİ MAHKEME EK RAPOR METNİ ÜRETİCİSİ (WORD & PDF UYUMLU)
// ============================================================================

export function generateEkRaporText(params: {
  mahkeme: string;
  dosyaNo: string;
  davaci: string;
  davaciVekili: string;
  davali: string;
  davaliVekili: string;
  davaKonusu: string;
  itirazSenaryoId: string;
  tarafItirazDilekceTarihi: string;
  araKararTarihi: string;
  kokRaporTarihi: string;
  kokRaporBedeliTL: number;
  secenek1BedeliTL: number;
  secenek2BedeliTL: number;
  secenek3BedeliTL?: number;
  ozelTeknikAciklama?: string;
  bilirkisiHeyeti: string[];
}): string {
  const senaryo =
    ITIRAZ_SENARYOLARI_DB.find((s) => s.id === params.itirazSenaryoId) || ITIRAZ_SENARYOLARI_DB[0];

  return `T.C.
${params.mahkeme.toUpperCase()} SAYIN HÂKİMLİĞİ'NE

DOSYA ESAS NO     : ${params.dosyaNo}
DAVACI            : ${params.davaci}
VEKİLİ            : ${params.davaciVekili || "-"}
DAVALI            : ${params.davali}
VEKİLİ            : ${params.davaliVekili || "-"}
DAVA KONUSU       : ${params.davaKonusu}
KÖK RAPOR TARİHİ  : ${params.kokRaporTarihi}
ARA KARAR TARİHİ  : ${params.araKararTarihi}
RAPORUN NEV'İ     : EK BİLİRKİŞİ RAPORU (Taraf İtirazlarının Karşılanması ve Seçenekli Hesap Cetveli)

I. MAHKEMENİN GÖREVLENDİRMESİ VE EK RAPORUN DÜZENLENME AMACI
Sayın Mahkemenizin ${params.araKararTarihi} tarihli duruşma ara kararı gereğince; taraf vekillerinin ${params.tarafItirazDilekceTarihi} havale tarihli itiraz dilekçelerinde ileri sürdükleri teknik ve usuli iddialar dosya kapsamı ile birlikte heyetimize tevdi edilmiş, dosya yeniden tetkik edilerek HMK m. 281 ve Adalet Bakanlığı Bilirkişilik Daire Başkanlığı Rehber İlkeleri m. 30 uyarınca itirazları karşılayan işbu Ek Rapor tanzim edilmiştir.

II. TARAFLARIN İTİRAZLARI VE İLERİ SÜRÜLEN İDDİALAR
1. Davacı Tarafın İddia ve İtirazları:
"${senaryo.tarafIddialari.davaciIddia}"

2. Davalı Tarafın İddia ve İtirazları:
"${senaryo.tarafIddialari.davaliIddia}"

III. BİLİRKİŞİ HEYETİMİZİN TEKNİK VE İLMİ DEĞERLENDİRMESİ
HMK m. 279 ve Adalet Bakanlığı Bilirkişilik Rehber İlkeleri m. 28 (Danıştay İDDK 2026/22 sayılı kararı) gereğince bilirkişi heyetimiz hukuki niteleme ve kusur değerlendirmesi yapmaksızın, salt ziraat mühendisliği teknik kriterleri ve Yargıtay yerleşik içtihatları çerçevesinde incelemesini yapmıştır:

1. İtiraz Konusu Hususların İrdelenmesi:
${senaryo.bilirkisiTeknikCevap}

${params.ozelTeknikAciklama ? `2. Somut Olaya Özgü Ek Teknik Tespitler:\n${params.ozelTeknikAciklama}\n` : ""}
3. Yargısal ve İlmi Dayanak:
${senaryo.yargitayKriteri}

IV. SEÇENEKLİ VE KADEMELİ HESAPLAMA TABLOSU
TMMOB Ziraat Mühendisleri Odası Bilirkişilik Standartları ve Adalet Bakanlığı İlke 30 uyarınca, tarafların sübuta ve takdire ilişkin iddiaları doğrultusunda Sayın Mahkemenin hüküm kurmasını kolaylaştırmak amacıyla seçenekli hesap tablosu aşağıda takdirlerinize arz olunmuştur:

+-----------------------------------------------------------------------------------------------------+
| HESAPLAMA SEÇENEKLERİ                                                | TOPLAM BEDEL (TL)            |
+-----------------------------------------------------------------------------------------------------+
| SEÇENEK 1 (KÖK RAPOR HEYET KANAATİ):                                |                              |
| ${senaryo.secenekliTabloSablonu.secenekA.baslik.padEnd(68)} | ₺ ${params.secenek1BedeliTL.toLocaleString("tr-TR").padStart(15)} |
| Açıklama: ${senaryo.secenekliTabloSablonu.secenekA.aciklama.slice(0, 60)}...                            |                              |
+-----------------------------------------------------------------------------------------------------+
| SEÇENEK 2 (İTİRAZ DOĞRULTUSUNDA ALTERNATİF HESAP):                  |                              |
| ${senaryo.secenekliTabloSablonu.secenekB.baslik.padEnd(68)} | ₺ ${params.secenek2BedeliTL.toLocaleString("tr-TR").padStart(15)} |
| Açıklama: ${senaryo.secenekliTabloSablonu.secenekB.aciklama.slice(0, 60)}...                            |                              |
+-----------------------------------------------------------------------------------------------------+
${
  params.secenek3BedeliTL
    ? `| SEÇENEK 3 (İKİNCİ ALTERNATİF / İDARE KRİTERİ):                       |                              |
| ${(senaryo.secenekliTabloSablonu.secenekC?.baslik || "Alternatif Kriter Hesabı").padEnd(68)} | ₺ ${params.secenek3BedeliTL.toLocaleString("tr-TR").padStart(15)} |
| Açıklama: ${(senaryo.secenekliTabloSablonu.secenekC?.aciklama || "Alternatif senaryo").slice(0, 60)}...                            |                              |
+-----------------------------------------------------------------------------------------------------+`
    : ""
}

V. NETİCE VE KANAAT
Yukarıda ayrıntılı teknik, ilmi ve yasal gerekçeleri açıklandığı üzere;
1. Tarafların kök rapora vaki itirazlarının heyetimizce incelendiği, kök raporda yer alan tespitlerin yöre tarımsal gerçeklerine ve resmi İlçe Tarım cetvellerine uygun olduğu,
2. Bununla birlikte tarafların farklı kabullerine göre seçenekli hesap tablosunun tanzim edildiği,
3. Delillerin takdiri, seçeneklerden hangisinin hükme esas alınacağı ve nihai hukuki karar yetkisi münhasıran Yüce Mahkemenize ait olmak üzere;

İşbu Ek Bilirkişi Raporu tarafımızdan 3 (üç) nüsha olarak tanzimle Sayın Mahkemenizin yüksek takdirlerine saygıyla arz olunur.

Tarih: ${new Date().toLocaleDateString("tr-TR")}

BİLİRKİŞİ HEYETİ:
${params.bilirkisiHeyeti.map((imza) => `${imza}\n(e-imzalıdır)`).join("\n\n")}
`;
}

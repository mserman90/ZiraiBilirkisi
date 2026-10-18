/**
 * RAPOR OTOMASYONU VERİ VE METODOLOJİ VERİTABANI
 * Adalet Bakanlığı Bilirkişilik Daire Başkanlığı Hukuk Mahkemeleri Rapor Şablonu,
 * HMK 266-287, 6754 sayılı Bilirkişilik Kanunu ve TMMOB Ziraat Mühendisleri Odası (ZMO)
 * Bilirkişilik Rehberi standartlarına uygun olarak hazırlanmıştır.
 */

export interface DavaTuruSablonu {
  id: string;
  alan: "tarim" | "hayvancilik" | "gida";
  ad: string;
  kisaltma: string;
  mahkemeTuru: string;
  kanunMaddesi: string;
  aciklama: string;
  varsayilanSorular: string[];
  kesifRehberi: {
    baslik: string;
    yapilacaklar: string[];
    gerekliBelgeler: string[];
    dikkatEdilecekler: string[];
  };
  ornekVeriler: {
    mahkeme: string;
    dosyaNo: string;
    davaci: string;
    davaciVekili: string;
    davali: string;
    davaliVekili: string;
    konu: string;
    parselIl: string;
    parselIlce: string;
    parselKoy: string;
    ada: string;
    parsel: string;
    alanM2: number;
    araziTipi: "sulu" | "kuru";
    kfo: number;
    odaPct: number;
    munavebe: {
      yil: number;
      urun: string;
      verim: number; // kg/da
      fiyat: number; // TL/kg
      masraf: number; // TL/da
    }[];
    // Hayvancılık / Telef / Gıda özel alanları
    hayvanTuru?: string;
    hayvanSayisi?: number;
    canliAgirlikKg?: number;
    canliKgFiyat?: number;
    damizlikVasıfFarki?: number;
    yoksunKalinanKar?: number;
    hurdaKurtarmaMahsubu?: number;
    gidaPartiMiktar?: number;
    gidaBirimMaliyet?: number;
    gidaAyipOraniPct?: number;
    gidaTGKParametre?: string;
    gidaAnalizDegeri?: string;
    gidaStandartDeger?: string;
    teknikIncelemeMetni: string;
  };
}

export const DAVA_TURLERI_DB: DavaTuruSablonu[] = [
  // ----------------------------------------------------
  // 01 TARIM: 2942 s.k. Kamulaştırma Bedel Tespiti
  // ----------------------------------------------------
  {
    id: "kamulastirma_tarla",
    alan: "tarim",
    ad: "2942 s.K. m. 11 Kamulaştırma Bedel Tespiti (Sulu / Kuru Arazi)",
    kisaltma: "Kamulaştırma Bedeli",
    mahkemeTuru: "Asliye Hukuk Mahkemesi",
    kanunMaddesi: "2942 sayılı Kamulaştırma Kanunu m. 10 ve 11/f, HMK m. 266",
    aciklama:
      "Tarımsal arazilerin kamulaştırma bedelinin 2942 sayılı Kanun m. 11/f gereği 'kamulaştırma tarihindeki mevki ve şartlara göre olduğu gibi kullanılması halinde getireceği net gelir' (Gelir Kapitalizasyonu) esasına göre hesaplanması.",
    varsayilanSorular: [
      "Dava konusu taşınmazın kamulaştırma tarihi itibarıyla vasıf ve mahiyetinin (sulu/kuru tarım arazisi) tespiti,",
      "Taşınmazın konumu, mevkii, imar durumu ve geometrik yapısının irdelenmesi,",
      "Bölgede mutat olarak uygulanan münavebe (ekim nöbeti) ürünlerinin belirlenmesi,",
      "İlçe Tarım ve Orman Müdürlüğü resmi cetvelleri doğrultusunda ortalama net gelirin ve kapitalizasyon faiz oranının tespiti,",
      "Varsa objektif değer artırıcı (ODA) unsurların gerekçeli olarak belirlenmesi ve m² birim değeri ile toplam kamulaştırma bedelinin hesaplanması.",
    ],
    kesifRehberi: {
      baslik: "Kamulaştırma Keşif ve Yer Tespiti Rehberi",
      yapilacaklar: [
        "Kadastro fen elemanı (harita mühendisi) ile zeminde parsel sınırlarını çakıştırın, sınır uyuşmazlığı olup olmadığını tutanağa geçirin.",
        "Arazinin toprak yapısını (killi-tınlı, derinlik, taşlılık oranı, profil) yerinde kazı/burgu ile inceleyin.",
        "Arazinin eğim derecesini (%0-2 düz, %3-8 dalgalı, >%12 meyilli) klinometre veya topoğrafik harita ile tespit edin.",
        "Sulama imkanlarını (devlet sulama kanalı, derin kuyu, akarsu, damlama/yağmurlama sistemi) fiilen yerinde görün, suyun yeterli ve sürekli olup olmadığını tutanağa yazın.",
        "Taşınmazın ana arterlere, il/ilçe merkezine, pazar yerlerine ve yerleşim alanına kuş uçuşu ve fiili yol mesafesini ölçün.",
        "Parsel üzerindeki mevcut ürün durumunu (ekili ürün, anız, nadas, çok yıllık tesis) fotoğraflayarak tutanağa geçirin.",
      ],
      gerekliBelgeler: [
        "Güncel Tapu Kaydı ve Takyidat Belgesi (İrtifak, haciz, ipotek şerhleri)",
        "Kadastro Çap Örneği ve Aplikasyon Krokisi",
        "İlçe Tarım ve Orman Müdürlüğü dava yılı resmi münavebe maliyet-verim-fiyat cetvelleri",
        "Mahalli Ticaret Borsası ve TMO ortalama bülten fiyatları",
        "Dava tarihi itibarıyla Belediye İmar Durum Yazısı",
      ],
      dikkatEdilecekler: [
        "2942 s.K. m. 11 uyarınca tarım arazilerinde EMSAL SATIŞ yöntemi kesinlikle uygulanamaz; NET GELİR METODU zorunludur.",
        "Kapitalizasyon faiz oranı keyfi belirlenemez: Sulu tarım arazilerinde %4 - %5 (0.04-0.05), kuru arazilerde %5 - %7 (0.05-0.07) aralığında bilimsel gerekçesiyle yazılmalıdır.",
        "Objektif Değer Artışı (ODA) afaki uygulanamaz; yol, pazar, yerleşim yeri gibi somut avantajlar tek tek puanlanarak yazılmalı ve genellikle %10 - %50 sınırını aşmamalıdır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Edirne 2. Asliye Hukuk Mahkemesi",
      dosyaNo: "2025/342 Esas",
      davaci: "T.C. Karayolları Genel Müdürlüğü (1. Bölge Müdürlüğü)",
      davaciVekili: "Av. Selin Kara",
      davali: "Ahmet Yılmaz ve Müşterekleri",
      davaliVekili: "Av. Mehmet Demir",
      konu: "2942 s.K. m. 10 Uyarınca Kamulaştırma Bedelinin Tespiti ve Tescili Talebi",
      parselIl: "Edirne",
      parselIlce: "Merkez",
      parselKoy: "Karaağaç",
      ada: "142",
      parsel: "18",
      alanM2: 12500,
      araziTipi: "sulu",
      kfo: 0.05,
      odaPct: 20,
      munavebe: [
        { yil: 1, urun: "Buğday (Sulu)", verim: 550, fiyat: 12.0, masraf: 3960 },
        { yil: 2, urun: "Mısır (2. Ürün)", verim: 1100, fiyat: 9.5, masraf: 6270 },
        { yil: 3, urun: "Ayçiçeği (Sulu)", verim: 320, fiyat: 22.0, masraf: 4224 },
      ],
      teknikIncelemeMetni:
        "Dava konusu Edirne İli, Merkez İlçesi, Karaağaç Köyü 142 ada 18 parsel sayılı taşınmazın yerinde yapılan keşfinde; düz-düze yakın (%1-2) eğimli, killi-tınlı derin toprak profiline haiz, Meriç Sulama Birliği kanaletinden cazibe ile fiilen sulanabilir 1. sınıf sulu mutlak tarım arazisi vasfında olduğu tespit edilmiştir. Taşınmazın Edirne-Karaağaç asfalt yoluna 250 m cephesi bulunmakta olup, ürün nakliyesi ve pazara arz imkanları tamdır.",
    },
  },

  // ----------------------------------------------------
  // 01 TARIM: İrtifak Hakkı & Boru/Enerji Nakil Hattı (DDO)
  // ----------------------------------------------------
  {
    id: "irtifak_hakki",
    alan: "tarim",
    ad: "İrtifak Hakkı ve Pilon / Direk Yeri Bedeli Hesabı (BOTAŞ / TEİAŞ)",
    kisaltma: "İrtifak Bedeli (DDO)",
    mahkemeTuru: "Asliye Hukuk Mahkemesi",
    kanunMaddesi: "2942 sayılı Kamulaştırma Kanunu m. 11/son, Yargıtay 5. HD Kararları",
    aciklama:
      "Arazinin üzerinden geçen enerji nakil hattı veya altından geçen boru hattı sebebiyle meydana gelen değer düşüklüğü oranının (DDO) ve pilon/direk yerlerinin mülkiyet kamulaştırma bedelinin tespiti.",
    varsayilanSorular: [
      "İrtifak tesis edilecek güzergahın parsel üzerindeki konumu ve yüzölçümünün tespiti,",
      "Taşınmazın mülkiyet birim değerinin net gelir metodu ile belirlenmesi,",
      "İrtifak hattının taşınmazın tarımsal kullanımına, mekanizasyonuna ve verimine getireceği geometrik ve fiili kısıtlılığın irdelenmesi,",
      "Yargıtay 5. HD içtihatları doğrultusunda Düşüş Değer Oranının (DDO) belirlenerek irtifak bedelinin hesaplanması.",
    ],
    kesifRehberi: {
      baslik: "İrtifak Hakkı Keşif Kılavuzu",
      yapilacaklar: [
        "İrtifak koridorunun parseli nereden böldüğünü (ortadan mı, kenardan mı geçtiğini) belirleyin. Ortadan geçen hatlar arazinin mekanizasyonunu (traktör dönüş çapı, ilaçlama, sulama boruları) ciddi oranda kısıtlar.",
        "Direk / pilon ayağının zemin kapladığı net alanı (mülkiyet kamulaştırması) ve güvenlik salınım koridorunu (irtifak şeridi) ayrı ayrı ölçün.",
        "Yüksek gerilim hattı altında boylu meyve ağacı (ceviz, kavak vb.) dikim yasağını ve sulama fıskiyesi sınırlamalarını değerlendirin.",
      ],
      gerekliBelgeler: [
        "TEİAŞ / BOTAŞ İrtifak Kamulaştırma Planı ve Koordinatlı Pafta",
        "İlçe Tarım Müdürlüğü Net Gelir Cetvelleri",
        "Tapu Takyidat Belgesi",
      ],
      dikkatEdilecekler: [
        "Yargıtay 5. HD yerleşik kararlarına göre irtifak hakkı bedeli kural olarak taşınmazın tamamının mülkiyet değerinin %35'ini, çok istisnai (araziyi ikiye bölen ve kullanımını felce uğratan) durumlarda ise %50'sini geçemez.",
        "Direk ayağı mülkiyet olarak kamulaştırılır (%100 bedel); irtifak sahası ise DDO oranı üzerinden hesaplanır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Tekirdağ 1. Asliye Hukuk Mahkemesi",
      dosyaNo: "2025/189 Esas",
      davaci: "TEİAŞ Genel Müdürlüğü",
      davaciVekili: "Av. Burak Öztürk",
      davali: "Mustafa Çelik",
      davaliVekili: "Av. Zeynep Aksoy",
      konu: "380 kV Enerji Nakil Hattı İrtifak ve Pilon Kamulaştırma Bedeli",
      parselIl: "Tekirdağ",
      parselIlce: "Süleymanpaşa",
      parselKoy: "Banarlı",
      ada: "205",
      parsel: "12",
      alanM2: 24000,
      araziTipi: "kuru",
      kfo: 0.06,
      odaPct: 15,
      munavebe: [
        { yil: 1, urun: "Buğday", verim: 420, fiyat: 11.5, masraf: 2898 },
        { yil: 2, urun: "Ayçiçeği", verim: 230, fiyat: 21.0, masraf: 2898 },
        { yil: 3, urun: "Kanola", verim: 290, fiyat: 18.0, masraf: 3132 },
      ],
      teknikIncelemeMetni:
        "Dava konusu parsel üzerinden geçen 380 kV ENH'nin parseli diyagonal olarak ikiye böldüğü, güzergah altında 1 adet pilon yerinin (35 m²) yer aldığı, toplam irtifak koridorunun 1.850 m² olduğu saptanmıştır. Yüksek gerilim hattı nedeniyle tarımsal mekanizasyon manevralarının zorlaşacağı, yüksek boylu tarım aletlerinin ve ilaçlama dronlarının çalışmasının kısıtlanacağı dikkate alınarak DDO oranı %6.5 olarak takdir edilmiştir.",
    },
  },

  // ----------------------------------------------------
  // 01 TARIM: Ecrimisil (Haksız İşgal 5 Yıllık Dönemsel Gelir)
  // ----------------------------------------------------
  {
    id: "ecrimisil_tarim",
    alan: "tarim",
    ad: "Ecrimisil (Tarımsal Haksız İşgal Tazminatı - Geriye Dönük 5 Yıl)",
    kisaltma: "Ecrimisil Hesabı",
    mahkemeTuru: "Asliye Hukuk Mahkemesi",
    kanunMaddesi: "Türk Medeni Kanunu m. 995, Yargıtay HGK 1999/3-736 K.",
    aciklama:
      "Kötüniyetli zilyedin taşınmazı haksız tasarruf etmesi nedeniyle hak sahibine ödemekle yükümlü olduğu en az kira bedeli veya arazinin elde edilmesi ihmal edilen net gelirinin (5 yıllık geriye dönük) hesabı.",
    varsayilanSorular: [
      "Dava konusu taşınmazın davalı tarafça fiilen hangi tarihten itibaren ve ne şekilde işgal/tasarruf edildiği,",
      "Taşınmazın geriye dönük 5 yıllık dava dönemindeki tarımsal vasfı ve ekilebilir ürün deseni,",
      "Dava konusu yıllara ait İlçe Tarım Müdürlüğü resmi verileriyle yıllık net gelirin belirlenmesi,",
      "Ecrimisil bedeline kademeli yasal faiz işletilmesi için her yılın tahakkuk eden net ecrimisil bedelinin ayrı ayrı gösterilmesi.",
    ],
    kesifRehberi: {
      baslik: "Tarımsal Ecrimisil Keşif Rehberi",
      yapilacaklar: [
        "İşgalin fiili sınırlarını GPS veya kroki ile belirleyin (parselin tamamı mı, bir kısmı mı işgal altında?).",
        "İşgalcinin arazide tarımsal üretim yapıp yapmadığını (buğday, mısır, bağ, sera vb.) veya arazinin boş bırakılıp bırakılmadığını tespit edin.",
        "İşgalci araziyi boş bıraksa dahi Yargıtay Hukuk Genel Kurulu'nun 'ihmal edilen semere' ilkesi gereği o bölgede araziden elde edilebilecek muhtemel net gelirin hesaplanacağını unutmayın.",
      ],
      gerekliBelgeler: [
        "Tapu kütüğü ve taraflar arası intikal kayıtları",
        "Geçmiş 5 yıla ait İlçe Tarım ve Orman Müdürlüğü münavebe maliyet cetvelleri",
        "Dönem sonları ÜFE / TÜFE oranları (güncelleme gerekirse)",
      ],
      dikkatEdilecekler: [
        "Bilirkişi raporda 'davalı haksız işgalcidir' veya 'işgal suçtur' gibi hukuki nitelemeler yapamaz. 'Taşınmazın davalı tarafından fiilen buğday ekilerek kullanıldığı görülmüştür' şeklinde teknik tespit yapar.",
        "5 yıllık süre geriye doğru hesaplanır; zamanaşımına uğramış dönemler varsa mahkemenin görevlendirme kararına sıkı sıkıya bağlı kalınır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Konya 3. Asliye Hukuk Mahkemesi",
      dosyaNo: "2025/512 Esas",
      davaci: "Fatma Güneş",
      davaciVekili: "Av. Hakan Yurt",
      davali: "Kemal Güneş",
      davaliVekili: "Av. Murat Keskin",
      konu: "Haksız İşgal Nedeniyle Ecrimisil Bedeli Talebi (2020-2024 Dönemi)",
      parselIl: "Konya",
      parselIlce: "Çumra",
      parselKoy: "İçeriçumra",
      ada: "318",
      parsel: "4",
      alanM2: 35000,
      araziTipi: "sulu",
      kfo: 0.05,
      odaPct: 0,
      munavebe: [
        { yil: 2020, urun: "Şeker Pancarı", verim: 6800, fiyat: 0.35, masraf: 1600 },
        { yil: 2021, urun: "Buğday (Sulu)", verim: 480, fiyat: 2.45, masraf: 780 },
        { yil: 2022, urun: "Mısır (Dane)", verim: 1250, fiyat: 5.7, masraf: 4200 },
        { yil: 2023, urun: "Şeker Pancarı", verim: 7100, fiyat: 1.85, masraf: 7800 },
        { yil: 2024, urun: "Buğday (Sulu)", verim: 520, fiyat: 9.8, masraf: 3200 },
      ],
      teknikIncelemeMetni:
        "Keşif mahallinde yapılan incelemede; taşınmazın Konya-Çumra ovasında derin profilli, killi-tınlı, DSİ Apa Barajı sulama sahasında sulu tarım arazisi olduğu görülmüştür. Parselin 2020-2024 yılları arasında davalı tarafından tasarruf edildiği, bölge münavebe sistemine uygun olarak sulu tarla ziraati icra edildiği saptanmıştır.",
    },
  },

  // ----------------------------------------------------
  // 01 TARIM: Tarımsal Ürün Zararı / Doğal Afet / Zirai İlaç Fitotoksite
  // ----------------------------------------------------
  {
    id: "tarimsal_zarar",
    alan: "tarim",
    ad: "Tarımsal Ürün Zararı / Doğal Afet / Fitotoksite Hasar Tespiti",
    kisaltma: "Ürün Hasar Tazminatı",
    mahkemeTuru: "Sulh Hukuk Mahkemesi (Değişik İş / Dava)",
    kanunMaddesi: "Türk Borçlar Kanunu m. 49, HMK m. 400 (Delil Tespiti)",
    aciklama:
      "Dolu, don, sel baskını veya komşu tarladan sürüklenen tarım ilacı (fitotoksite) neticesinde meydana gelen ürün kaybının ve tasarruf edilen masrafların mahsubu ile net teknik zararın hesabı.",
    varsayilanSorular: [
      "Zarara uğrayan parsel üzerindeki ürünün türü, gelişim evresi ve ekim alanı,",
      "Meydana gelen hasarın niteliği, fenolojik belirtileri ve nedenleri,",
      "Parseldeki hasar oranı (%) ve beklenen rekolte ile gerçekleşen verim arasındaki fark,",
      "Hasat edilmeyen kısım sebebiyle çiftçinin yapmaktan tasarruf ettiği (hasat, nakliye, çuvallama) masrafların mahsubu ile net teknik zarar tutarı.",
    ],
    kesifRehberi: {
      baslik: "Tarımsal Hasar ve Zarar Tespiti Keşif Rehberi",
      yapilacaklar: [
        "Keşfe derhal ve gecikmeksizin gidilmelidir (bitki fenolojisi hızla değişir, hasat edilirse delil kaybolur).",
        "Parselin farklı noktalarından köşegen veya zikzak metodu ile en az 10 farklı örnekleme noktasında sağlam ve zararlı bitkileri sayın.",
        "Fitotoksite iddialarında rüzgar yönünü, komşu parselde kullanılan herbisit/pestisit etken maddesini ve bitkideki kloroz, nekroz, epinasti belirtilerini fotoğraflayın.",
        "Tasarruf edilen masrafları mutlaka hesaplayın: Ürün zarar gördüğü için yapılmayan hasat işçiliği, biçerdöver ücreti, nakliye ve ambalaj masrafları zarardan düşülür.",
      ],
      gerekliBelgeler: [
        "Meteoroloji Genel Müdürlüğü keşif öncesi yağış, dolu, don ve rüzgar hızı bültenleri",
        "İlçe Tarım ve Orman Müdürlüğü Hasar Tespit Komisyonu Tutanağı (varsa)",
        "TARSİM Ekspertiz Raporu (varsa)",
        "İlçe Tarım resmi birim ürün fiyat cetveli",
      ],
      dikkatEdilecekler: [
        "HMK 279 gereğince 'davalı tarım ilacını rüzgarlı havada atarak kusurlu davranmıştır' YAZILAMAZ. 'Kullanılan aktif maddenin sürüklenme (drift) yoluyla komşu parseldeki bitkilerde fitotoksiteye yol açtığı ve üründe %45 verim kaybı oluşturduğu tespit edilmiştir' yazılmalıdır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Antalya 1. Sulh Hukuk Mahkemesi",
      dosyaNo: "2025/88 D.İş",
      davaci: "Mehmet Demir",
      davaciVekili: "Av. Canan Erdem",
      davali: "Korkuteli Tarım İşletmesi A.Ş.",
      davaliVekili: "Av. Serhat Ak",
      konu: "Zirai İlaç Sürüklenmesi (Drift) Kaynaklı Domates Ürün Hasarı Tespiti",
      parselIl: "Antalya",
      parselIlce: "Korkuteli",
      parselKoy: "Bozova",
      ada: "108",
      parsel: "23",
      alanM2: 18000,
      araziTipi: "sulu",
      kfo: 0.05,
      odaPct: 0,
      munavebe: [
        { yil: 2025, urun: "Sanayi Domatesi", verim: 8500, fiyat: 3.8, masraf: 18500 },
      ],
      teknikIncelemeMetni:
        "Yapılan keşif ve fenolojik incelemede; davacı parselinde sanayi domatesi ekili olduğu, bitkilerin çiçeklenme ve ilk meyve tutumu evresinde bulunduğu, batı yönündeki komşu buğday tarlasında kullanılan 2,4-D amin içerikli yabancı ot ilacının rüzgar etkisiyle parselin batıdan doğuya doğru ilk 60 metrelik bandına sürüklendiği (drift), bitkilerin tepe sürgünlerinde kıvrılma (epinasti), yapraklarda daralma ve çiçek dökülmesi şeklinde fitotoksik etki meydana getirdiği saptanmıştır.",
    },
  },

  // ----------------------------------------------------
  // 02 HAYVANCILIK: Canlı Hayvan Telefatı ve Tazminat Hesabı
  // ----------------------------------------------------
  {
    id: "hayvan_telef",
    alan: "hayvancilik",
    ad: "Canlı Hayvan Telefatı ve Zarar Tazminatı (Trafik, Elektrik, Zehirlenme)",
    kisaltma: "Hayvan Telefat Tazminatı",
    mahkemeTuru: "Asliye Hukuk / Tüketici Mahkemesi",
    kanunMaddesi: "Türk Borçlar Kanunu m. 49, 52 ve 55; Hayvan Sağlığı Zabıtası Mevzuatı",
    aciklama:
      "Trafik kazası, elektrik kaçağı, zehirlenme vb. sebeplerle telef olan damızlık, süt veya besi hayvanlarının piyasa rayici, yoksun kalınan ürün geliri ve TBK m. 52/55 uyarınca hurda (kurtarma) et bedelinin mahsubu.",
    varsayilanSorular: [
      "Telef olan veya zorunlu kesime sevk edilen hayvanların türü, ırkı, yaşı, cinsiyeti ve kulak küpe kayıtları,",
      "Hayvanların ölüm sebebi ile olay arasındaki illiyet bağının teknik değerlendirmesi,",
      "Olay tarihindeki canlı ağırlık, karkas randımanı ve mahalli canlı hayvan borsası birim rayiç bedelleri,",
      "Varsa yoksun kalınan kâr (gebelik, süt, yavru kaybı) ve zorunlu kesim neticesinde elde edilen hurda (kurtarma et/deri) bedelinin hesaplanarak mahsubu.",
    ],
    kesifRehberi: {
      baslik: "Hayvan Telefatı ve Zarar Keşif Kılavuzu",
      yapilacaklar: [
        "HAYBİS / TÜRKVET kulak küpe sistem kayıtlarını dosyadan inceleyin; hayvanların pasaport, aşı ve soykütüğü belgelerini doğrulayın.",
        "Ölüm nedenine dair resmi veteriner hekim otopsi/nekropsi raporunu mutlaka inceleyin (elektrik çarpmasında deri lezyonları, iç organ kanamaları vb.).",
        "Hayvanın gebe olup olmadığını, günlük süt verimini ve laktasyon evresini işletme kayıtlarından teyit edin.",
        "TBK 52/55 hurda et kuralı: Hayvan murdar olmadan acil/zorunlu kesime sevk edilip eti ve derisi ekonomik olarak değerlendirildiyse, bu kurtarma bedeli zarar tutarından MAHSUP EDİLMEK ZORUNDADIR.",
      ],
      gerekliBelgeler: [
        "İlçe Tarım ve Orman Müdürlüğü Veteriner Hekim Muayene ve Tespit Tutanağı",
        "TÜRKVET Kulak Küpe Düşüm Belgesi",
        "Olay Yeri İnceleme / Trafik Kazası / İtfaiye / Jandarma Tutanağı",
        "Ticaret Borsası Canlı Hayvan ve Karkas Et Günlük Fiyat Bülteni",
      ],
      dikkatEdilecekler: [
        "Bilirkişi 'elektrik dağıtım şirketi hatları izole etmediği için %100 kusurludur' YAZAMAZ. 'Olay yeri inceleme tutanağında nakil hattının koparak barınak çitine temas ettiği ve temas noktasında hayvanlarda elektroküsyon (elektrik çarpması) kaynaklı ölüm meydana geldiği teknik olarak saptanmıştır' yazmalıdır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Balıkesir 2. Asliye Hukuk Mahkemesi",
      dosyaNo: "2025/214 Esas",
      davaci: "Hasan Çetin (Çetin Süt Çiftliği)",
      davaciVekili: "Av. Levent Güler",
      davali: "Uludağ Elektrik Dağıtım A.Ş. (UEDAŞ)",
      davaliVekili: "Av. Ebru Şen",
      konu: "Elektrik Kaçağı Sebebiyle 4 Baş Damızlık Süt İneğinin Telefi Nedeniyle Maddi Tazminat",
      parselIl: "Balıkesir",
      parselIlce: "Altıeylül",
      parselKoy: "Köseler",
      ada: "102",
      parsel: "5",
      alanM2: 0,
      araziTipi: "sulu",
      kfo: 0.05,
      odaPct: 0,
      munavebe: [],
      hayvanTuru: "Siyah Alaca (Holstein) Süt İneği",
      hayvanSayisi: 4,
      canliAgirlikKg: 620,
      canliKgFiyat: 240, // TL/kg canlı
      damizlikVasıfFarki: 25000, // TL/baş yüksek genetik potansiyel
      yoksunKalinanKar: 32000, // 45 günlük laktasyon net kaybı
      hurdaKurtarmaMahsubu: 45000, // Kesimhane kombina hurda et bedeli (2 baş için)
      teknikIncelemeMetni:
        "Dosya kapsamındaki İlçe Tarım ve Orman Müdürlüğü nöbetçi veteriner hekim raporu ve jandarma tutanağı incelendiğinde; ahırın bitişiğindeki alçak gerilim direğindeki iletken telin kopması neticesinde metal yemlik demirlerine enerji intikal ettiği, temas eden 4 baş Holstein ırkı süt sığırının elektroküsyon (kalp durması) sonucu telef olduğu saptanmıştır. Hayvanların TÜRKVET kayıtlarında 2. ve 3. laktasyonda, yüksek verimli damızlık niteliğinde olduğu tespit edilmiştir.",
    },
  },

  // ----------------------------------------------------
  // 26 GIDA: Türk Gıda Kodeksi Uygunsuzluğu, Taklit/Tağşiş ve Bozulma
  // ----------------------------------------------------
  {
    id: "gida_ayip_tagsis",
    alan: "gida",
    ad: "Türk Gıda Kodeksi (TGK) Ayıp, Taklit-Tağşiş ve Bozulma Tespiti",
    kisaltma: "Gıda Güvenliği & Ayıp",
    mahkemeTuru: "Tüketici / Ticaret Mahkemesi",
    kanunMaddesi: "5996 sayılı Veteriner Hizmetleri, Bitki Sağlığı, Gıda ve Yem Kanunu, 6502 s.K.",
    aciklama:
      "Gıda maddelerinin (zeytinyağı, süt ürünleri, et, bal vb.) Türk Gıda Kodeksi tebliğlerine aykırılığı, taklit/tağşiş yapılması, soğuk zincir kırılması veya raf ömründen önce bozulması sebebiyle oluşan ekonomik ayıp ve zayiat hesabı.",
    varsayilanSorular: [
      "Uyuşmazlık konusu gıda maddesinin etiket bilgileri, parti/seri/lot numarası ve ambalaj durumu,",
      "Akredite gıda laboratuvarı muayene ve analiz raporlarının Türk Gıda Kodeksi mevzuatına göre irdelenmesi,",
      "Gıdada taklit/tağşiş, mikrobiyolojik üreme veya kimyasal bozulma bulunup bulunmadığı,",
      "Gıdanın insan tüketimine uygun olup olmadığı, imha edilmesinin gerekip gerekmediği ve oluşan teknik ayıp/zarar tutarı.",
    ],
    kesifRehberi: {
      baslik: "Gıda İncelemesi ve Ayıp Tespiti Rehberi",
      yapilacaklar: [
        "Numune alma tutanağını inceleyin: Numunenin Türk Gıda Kodeksi Numune Alma Usul ve Esaslarına göre şahit numuneli olarak alınıp alınmadığını kontrol edin.",
        "Laboratuvar raporunun TÜRKAK tarafından TS EN ISO/IEC 17025 standardına göre akredite bir laboratuvardan verilmiş olduğunu teyit edin.",
        "Gıda analiz sonuçlarını ilgili ürün tebliğiyle (örneğin TGK Zeytinyağı Tebliği veya TGK Fermente Süt Ürünleri Tebliği) parametre parametre kıyaslayın.",
        "Soğuk zincir iddialarında sıcaklık kayıt cihazı (datalogger) verilerini, frigofirik araç teslim tutanaklarını ve depo sıcaklık grafiklerini inceleyin.",
      ],
      gerekliBelgeler: [
        "TÜRKAK Akrediteli Laboratuvar Muayene ve Analiz Raporu",
        "Fatura, İrsaliye ve Parti/Lot Kabul Tutanağı",
        "İl/İlçe Tarım Gıda Kontrol Görevlisi Denetim Tutanağı",
        "İlgili Türk Gıda Kodeksi Ürün Tebliği",
      ],
      dikkatEdilecekler: [
        "Bilirkişi 'davalı firma hileli ve ayıplı mal satmıştır' YAZAMAZ. 'Laboratuvar analiz raporunda zeytinyağı numunesinde yağ asitleri etil esterleri (YEEE) değerinin ... mg/kg çıktığı, bu değerin TGK Zeytinyağı Tebliği'nde belirlenen azami ... sınırını aştığı ve ürüne tohum yağı/rafine yağ karıştırıldığı (tağşiş) teknik olarak saptanmıştır' yazmalıdır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "İzmir 3. Asliye Ticaret Mahkemesi",
      dosyaNo: "2025/441 Esas",
      davaci: "Ege Marketler Zinciri A.Ş.",
      davali: "Güneş Zeytinyağları Gıda San. Tic. Ltd. Şti.",
      davaciVekili: "Av. Deniz Çetin",
      davaliVekili: "Av. Ozan Parlak",
      konu: "TGK Zeytinyağı Tebliği'ne Aykırı Tağşişli Natürel Sızma Zeytinyağı Teslimi Nedeniyle Ayıp Bedeli",
      parselIl: "İzmir",
      parselIlce: "Bornova",
      parselKoy: "-",
      ada: "-",
      parsel: "-",
      alanM2: 0,
      araziTipi: "sulu",
      kfo: 0.05,
      odaPct: 0,
      munavebe: [],
      gidaPartiMiktar: 5000, // Litre
      gidaBirimMaliyet: 340, // TL/Litre
      gidaAyipOraniPct: 100, // Tamamen tüketime uygunsuz / imha
      gidaTGKParametre: "Delta-7-Stigmastenol & Mumsu Maddeler",
      gidaAnalizDegeri: "% 1.82 (Tohum Yağı Varlığı Pozitif)",
      gidaStandartDeger: "Azami % 0.5 (TGK Tebliğ No: 2017/26)",
      teknikIncelemeMetni:
        "T.C. Tarım ve Orman Bakanlığı İzmir Gıda Kontrol Laboratuvar Müdürlüğü'nün 2025/112 sayılı resmi muayene ve analiz raporu incelendiğinde; davacı tarafından satın alınan 5.000 Litre 'Natürel Sızma Zeytinyağı' parti/lotlu üründen usulüne uygun alınan numunede Delta-7-Stigmastenol değerinin %1.82 tespit edildiği, TGK Zeytinyağı Tebliği Madde 5 Ek-1 tablosuna göre bu oranın en fazla %0.50 olabileceği, mezkur oranın aşılması sebebiyle ürüne bitkisel tohum yağı (ayçiçek/kanola) karıştırıldığı (tağşiş) ve ürünün sızma zeytinyağı vasfını taşımadığı teknik olarak belirlenmiştir.",
    },
  },
];

/**
 * HMK 279 / 6754 s.K. m. 3/2 UYUM KONTROLÜ (HUKUKİ AŞIM & KUSUR LİNTERI)
 * Aday bilirkişilerin raporda kullanmaması gereken hukuki tabirler ve alternatif teknik ifadeler
 */
export interface HmkKural {
  yasakliKelime: string;
  kategori: "kusur" | "hukuki_nitelendirme" | "tazminat_hukmu" | "mulkiyet";
  uyariMesaji: string;
  onerilenTeknikIfade: string;
}

export const HMK_279_YASAKLI_KELIMELER: HmkKural[] = [
  {
    yasakliKelime: "kusurlu",
    kategori: "kusur",
    uyariMesaji: "Kusur dağıtımı ve kusur oranı belirleme yetkisi münhasıran hâkime aittir (HMK m. 279/4).",
    onerilenTeknikIfade:
      "'... eyleminin teknik kurallara aykırı olduğu ve teknik nedensellik bağı bulunduğu' veya '... tespit edilen fenolojik veriler neticesinde...' ifadesini kullanınız.",
  },
  {
    yasakliKelime: "kusurludur",
    kategori: "kusur",
    uyariMesaji: "Bilirkişi tarafın kusurlu olduğunu beyan edemez.",
    onerilenTeknikIfade:
      "'... teknik şartnamede belirtilen standartlara riayet edilmediği tespit edilmiştir.'",
  },
  {
    yasakliKelime: "tazminat ödemelidir",
    kategori: "tazminat_hukmu",
    uyariMesaji: "Bilirkişi hüküm kuramaz ve kimin kime tazminat ödeyeceğine karar veremez.",
    onerilenTeknikIfade:
      "'... hesaplanan teknik zarar tutarı ₺... olup, takdiri Sayın Mahkemenize aittir.'",
  },
  {
    yasakliKelime: "haklıdır",
    kategori: "hukuki_nitelendirme",
    uyariMesaji: "Tarafların haklı veya haksız olduğuna dair değerlendirme hâkimin takdirindedir.",
    onerilenTeknikIfade:
      "'Davacı tarafın iddialarındaki ürün kaybı teknik ve matematiksel verilerle örtüşmektedir.'",
  },
  {
    yasakliKelime: "haksızdır",
    kategori: "hukuki_nitelendirme",
    uyariMesaji: "Tarafın haksız olduğu yönündeki ifadeler bilirkişilik tarafsızlığına ve HMK 279'a aykırıdır.",
    onerilenTeknikIfade:
      "'Dosyadaki teknik belgeler ve keşif gözlemleri söz konusu beyanı doğrulamamaktadır.'",
  },
  {
    yasakliKelime: "haksız işgal etmiştir",
    kategori: "hukuki_nitelendirme",
    uyariMesaji: "İşgalin haksız olup olmadığı hukuki bir nitelemedir.",
    onerilenTeknikIfade:
      "'Taşınmazın davalı tarafından fiilen tasarruf edildiği / ekildiği tespit edilmiştir.'",
  },
  {
    yasakliKelime: "mülkiyeti davacıya aittir",
    kategori: "mulkiyet",
    uyariMesaji: "Mülkiyet ve zilyetlik hakkı belirlemesi yargısal bir tasarruftur.",
    onerilenTeknikIfade:
      "'Tapu kaydı beyan hanesinde ve dosya içeriğinde taşınmazın davacı adına tescilli olduğu görülmektedir.'",
  },
  {
    yasakliKelime: "ayıplı mal satmıştır",
    kategori: "hukuki_nitelendirme",
    uyariMesaji: "Ayıp kavramı hukuki bir nitelemedir; bilirkişi teknik standart sapmasını belirtmelidir.",
    onerilenTeknikIfade:
      "'Teslim edilen ürünün Türk Gıda Kodeksi ... Tebliği parametre sınırlarına uymadığı teknik olarak tespit edilmiştir.'",
  },
  {
    yasakliKelime: "sözleşmeye aykırı davranmıştır",
    kategori: "hukuki_nitelendirme",
    uyariMesaji: "Sözleşmenin ihlali hukuki yorum gerektirir.",
    onerilenTeknikIfade:
      "'Teslim edilen ürünün teknik şartnamede yer alan nem ve protein kriterlerini karşılamadığı saptanmıştır.'",
  },
  {
    yasakliKelime: "suçludur",
    kategori: "kusur",
    uyariMesaji: "Ceza hukuku terimleri hukuk ve değerleme raporlarında asla kullanılamaz.",
    onerilenTeknikIfade:
      "'... mevzuatta öngörülen teknik tedbirlerin alınmadığı gözlemlenmiştir.'",
  },
];

/**
 * Metin içindeki HMK 279 ihlallerini tespit eden tarayıcı
 */
export function scanHmkViolations(text: string): {
  found: HmkKural[];
  score: number;
  cleanTextSuggestion: string;
} {
  const lower = text.toLowerCase();
  const found: HmkKural[] = [];

  for (const kural of HMK_279_YASAKLI_KELIMELER) {
    if (lower.includes(kural.yasakliKelime)) {
      found.push(kural);
    }
  }

  // 100 üzerinden puanlama
  const deduction = found.length * 20;
  const score = Math.max(0, 100 - deduction);

  // Otomatik düzeltme önerisi oluştur
  let cleanTextSuggestion = text;
  for (const item of found) {
    const regex = new RegExp(item.yasakliKelime, "gi");
    cleanTextSuggestion = cleanTextSuggestion.replace(
      regex,
      `[DÜZELTME: ${item.onerilenTeknikIfade}]`
    );
  }

  return {
    found,
    score,
    cleanTextSuggestion,
  };
}

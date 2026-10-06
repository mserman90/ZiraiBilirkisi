import { TemelEgitimModul, ResmiDokuman, MevzuatLink } from "../types";

export const RESMI_KAYNAK_KUTUPHANESI: ResmiDokuman[] = [
  {
    id: "doc-1",
    baslik: "Bilirkişilik Temel Eğitimi Katılımcı El Kitabı",
    kurum: "T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı",
    tur: "Resmi Eğitim El Kitabı",
    sayfaSayisi: "140 Sayfa",
    url: "https://bilirkisilik.adalet.gov.tr/Resimler/SayfaDokuman/372020143342temelegitimkatilimci.pdf",
    aciklama: "Yargılama hukuku genel ilkeleri, bilirkişinin hak ve yükümlülükleri, etik kurallar ve rapor hazırlama metodolojisi."
  },
  {
    id: "doc-2",
    baslik: "Bilirkişiler İçin Kontrol Listesi (Checklist)",
    kurum: "T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı",
    tur: "Resmi Denetim Formu",
    sayfaSayisi: "4 Aşama / 17 Kriter",
    url: "https://bilirkisilik.adalet.gov.tr/Resimler/SayfaDokuman/14032022110908Bilirki%C5%9Filer%20i%C3%A7in%20Kontrol%20Listesi.pdf",
    aciklama: "Görevlendirme, keşif, raporlama ve teslim aşamalarında bilirkişilerin uyması zorunlu denetim listesi."
  },
  {
    id: "doc-3",
    baslik: "Bilirkişilik Temel Eğitimi Kaynak Kitabı",
    kurum: "T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı",
    tur: "Akademik & Uygulamalı Kaynak Kitap",
    sayfaSayisi: "280 Sayfa",
    url: "https://bilirkisilik.adalet.gov.tr/Resimler/SayfaDokuman/15052025204011Bilirkis%CC%A7ilik%20Temel%20E%C4%9Fitimi%20Kaynak%20Kitab%C4%B1.pdf",
    aciklama: "Teorik ve uygulamalı modüller, heyet çalışması, delil değerlendirmesi ve çelişkili raporların giderilmesi."
  },
  {
    id: "doc-4",
    baslik: "Bilirkişilerin Uyacağı Rehber İlkeler ve Rapor Standartları",
    kurum: "T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı",
    tur: "Yönerge & Rapor Standartları",
    sayfaSayisi: "Resmi Tebliğ",
    url: "https://rayp.adalet.gov.tr/resimler/494/dosya/bilirkisilerin-uyacagi-rehber-ilkeler-ve-bilirkisi-raporlarinda-bulunmasi-gereken-standartlar24-04-20265-22-pm.pdf",
    aciklama: "Bilirkişi raporlarının biçimsel standartları, bölümleri, font, sayfa numarası ve e-imza kuralları."
  },
  {
    id: "doc-5",
    baslik: "Temel ve Alt Uzmanlık Alanları ile Başvuru Kılavuzu",
    kurum: "T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı",
    tur: "Başvuru Kılavuzu",
    sayfaSayisi: "Güncel Başvuru Metni",
    url: "https://bilirkisilik.adalet.gov.tr/Resimler/SayfaDokuman/20260122151908585Bilirki%C5%9Filik%20Temel%20ve%20Alt%20Uzmanl%C4%B1k%20Alanlar%C4%B1%20ile%20Bilirki%C5%9Filerde%20Aranan%20Nitelikler.pdf",
    aciklama: "01 Tarım alt uzmanlık alanları, aranan 5 yıllık mesleki kıdem ve UYAP Portal başvuru adımları."
  }
];

export const ZIRAI_MEVZUAT_KUTUPHANESI: MevzuatLink[] = [
  {
    baslik: "6754 Sayılı Bilirkişilik Kanunu",
    kanunNo: "6754",
    maddeNo: "Tüm Kanun (m.1-18)",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6754&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Bilirkişilik temel ilkeleri, sicil, bölge kurulları, denetim ve yaptırımlar.",
    onemliFikra: "m.3/2: Bilirkişi raporunda hukuki nitelendirme ve değerlendirmelerde bulunamaz."
  },
  {
    baslik: "6100 Sayılı Hukuk Muhakemeleri Kanunu (HMK)",
    kanunNo: "6100",
    maddeNo: "m.266 - m.287",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Bilirkişi incelemesi, bilirkişinin atanması, yemini, keşif, rapor teslim süresi ve sorumluluk.",
    onemliFikra: "m.279: Hâkim tarafları dinledikten sonra bilirkişiye sorulacak teknik soruları belirler."
  },
  {
    baslik: "2942 Sayılı Kamulaştırma Kanunu",
    kanunNo: "2942",
    maddeNo: "m.10, m.11, m.12",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2942&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Tarımsal arazilerde net gelir metodu, kapitalizasyon faizi (KFO), irtifak ve kısmi kamulaştırma.",
    onemliFikra: "m.11/f: Arazilerde halihazır durumuna göre olduğu gibi kullanılması halinde getireceği net gelir esastır."
  },
  {
    baslik: "3402 Sayılı Kadastro Kanunu",
    kanunNo: "3402",
    maddeNo: "m.14, m.17",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=3402&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Zilyetlikle iktisap sınırları (sulu 40 da, kuru 100 da) ve imar-ihya şartları.",
    onemliFikra: "m.14: Belgesiz zilyetlikle aynı çalışma alanında sulu toprakta 40, kuru toprakta 100 dönüm aşılamaz."
  },
  {
    baslik: "5403 Sayılı Toprak Koruma ve Arazi Kullanımı Kanunu",
    kanunNo: "5403",
    maddeNo: "m.3/j, m.8",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5403&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Sulu ve kuru tarım arazisi tanımları, asgari tarımsal arazi büyüklüğü ve bölünemezlik kuralları.",
    onemliFikra: "m.3/j: Sulu tarım arazisi; su kaynağından alınarak yeterli ve kontrollü suyla sulanan arazilerdir."
  },
  {
    baslik: "4342 Sayılı Mera Kanunu",
    kanunNo: "4342",
    maddeNo: "m.3, m.4, m.13/5",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4342&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Mera, yaylak ve kışlakların korunması, özel mülkiyete geçirilememezlik, ot bedeli ve tecavüz tazminatı.",
    onemliFikra: "m.4: Meralar özel mülkiyete geçirilemez, zamanaşımı uygulanamaz, sınırları daraltılamaz."
  },
  {
    baslik: "7201 Sayılı Tebligat Kanunu",
    kanunNo: "7201",
    maddeNo: "m.7/a",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=7201&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Elektronik tebligat usulü ve tebliğ sayılma takvimi.",
    onemliFikra: "m.7/a: Elektronik tebligat, muhatabın adresine ulaştığı tarihi izleyen 5. günün sonunda tebliğ sayılır."
  },
  {
    baslik: "5237 Sayılı Türk Ceza Kanunu (TCK)",
    kanunNo: "5237",
    maddeNo: "m.276",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5237&MevzuatTur=1&MevzuatTertip=5",
    aciklama: "Gerçeğe aykırı bilirkişilik suçu ve hapis cezası yaptırımı.",
    onemliFikra: "m.276: Yargı mercileri nezdinde gerçeğe aykırı mütalaada bulunan bilirkişiye 1 ila 3 yıl hapis verilir."
  }
];

export const TEMEL_EGITIM_MODULLERI: TemelEgitimModul[] = [
  {
    id: "modul-1",
    no: 1,
    baslik: "Yargılama Hukukuna İlişkin Genel İlkeler ve Bilirkişilik",
    altBaslik: "6754 Sayılı Kanun, HMK, CMK ve İYUK Kapsamında Bilirkişilik Kurumu",
    sure: "6 Saat",
    ozet: "Yargılama hukukunun temel ilkeleri, hâkimin aydınlatma ödevi, ispat yükü, delil türleri ve teknik bilginin yargılamadaki yeri.",
    mevzuatMaddeleri: ["6754 SK m.1-3", "6100 SK HMK m.266-268", "HMK m.31 (Aydınlatma Ödevi)"],
    mevzuatLinkleri: [
      {
        baslik: "6754 SK m.3 - Bilirkişiliğin Temel İlkeleri",
        kanunNo: "6754",
        maddeNo: "m.3",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6754&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Bilirkişinin yetki sınırları ve hukuki değerlendirme yasağının kanuni dayanağı.",
        onemliFikra: "Bilirkişi raporunda çözümü uzmanlığı, özel veya teknik bilgiyi gerektiren hususlar dışında açıklama yapamaz; hukuki nitelendirme ve değerlendirmelerde bulunamaz."
      },
      {
        baslik: "HMK m.266 - Bilirkişiye Başvurulacak Haller",
        kanunNo: "6100",
        maddeNo: "m.266",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Çözümü hukuk dışında özel veya teknik bilgiyi gerektiren hallerde bilirkişiye başvurulur.",
        onemliFikra: "Genel bilgi veya tecrübeyle ya da hâkimlik mesleğinin gerektirdiği hukuki bilgiyle çözümlenmesi mümkün olan konularda bilirkişiye başvurulamaz."
      },
      {
        baslik: "HMK m.282 - Bilirkişi Raporunun Değeri",
        kanunNo: "6100",
        maddeNo: "m.282",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Hâkim, bilirkişinin oy ve görüşünü diğer delillerle birlikte serbestçe değerlendirir.",
        onemliFikra: "Hâkim, bilirkişi raporunu bağlayıcı saymaz; ancak aksi yönde karar verirken gerekçesini denetlenebilir şekilde açıklar."
      }
    ],
    konular: [
      {
        baslik: "1. Çözümü Özel ve Teknik Bilgiyi Gerektiren Haller",
        icerik: "Hâkimlik mesleğinin gerektirdiği genel hukuki bilgi ile çözümlenmesi mümkün olan konularda bilirkişiye başvurulamaz (HMK m.266). Yalnızca tıp, mühendislik, tarım, muhasebe gibi özel veya teknik uzmanlık alanlarında bilirkişi atanır.",
        onemliNot: "Hukuk öğrenimi görmüş kişiler, hukuk alanı dışında ayrı bir uzmanlığı bulunmadıkça bilirkişi olarak görevlendirilemez."
      },
      {
        baslik: "2. Hâkimin Bilirkişi Raporunu Takdiri (Delil Serbestisi)",
        icerik: "Bilirkişi raporu takdiri bir delildir ve hâkimi bağlamaz (HMK m.282). Ancak hâkim, bilirkişi raporunun aksine bir sonuca ulaşırsa bunun gerekçesini açık ve denetlenebilir şekilde kararında göstermek zorundadır.",
        onemliNot: "Bilirkişi raporları arasında çelişki varsa mahkeme çelişkiyi gidermeden karar veremez; ek rapor veya yeni heyet raporu almalıdır."
      }
    ],
    testSorulari: [
      {
        soru: "Aşağıdaki durumlardan hangisinde mahkemenin bilirkişiye başvurması 6754 sayılı Kanuna göre yasaktır?",
        secenekler: [
          "Sulu tarım arazisinin yıllık ortalama net gelirinin hesaplanması",
          "Davacının sözleşmeyi feshetmekte haklı olup olmadığının hukuki değerlendirmesi",
          "Dolu afeti sonrası buğday başaklarındaki hasar oranının tespiti",
          "Zeytin ağaçlarının ekonomik ömrü ve amortisman payının belirlenmesi"
        ],
        dogruCevapIndex: 1,
        aciklama: "6754 SK m.3 uyarınca hâkimlik mesleğinin gerektirdiği hukuki değerlendirmeler için bilirkişiye başvurulamaz."
      }
    ]
  },
  {
    id: "modul-2",
    no: 2,
    baslik: "Bilirkişinin Hakları, Yükümlülükleri ve Etik İlkeler",
    altBaslik: "Dürüstlük, Bağımsızlık, Tarafsızlık ve Sır Saklama Yükümlülüğü",
    sure: "6 Saat",
    ozet: "Bilirkişilik meslek etiği, menfaat çatışmalarının önlenmesi, sır saklama, görevi bizzat ifa etme ve tarafsızlık kuralları.",
    mevzuatMaddeleri: ["6754 SK m.12 (Etik İlkeler)", "HMK m.272 (Bilirkişinin Reddi)", "TCK m.258 (Göreve İlişkin Sırrın Açıklanması)"],
    mevzuatLinkleri: [
      {
        baslik: "6754 SK m.12 - Bilirkişinin Yükümlülükleri ve Etik",
        kanunNo: "6754",
        maddeNo: "m.12",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6754&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Dürüstlük, tarafsızlık, bizzat ifa ve mesleki özen yükümlülüğü.",
        onemliFikra: "Bilirkişi, görevini dürüstlük kuralları çerçevesinde bağımsız ve tarafsız olarak yerine getirir; taraflardan menfaat temin edemez."
      },
      {
        baslik: "HMK m.272 - Bilirkişinin Yasaklılığı ve Reddi",
        kanunNo: "6100",
        maddeNo: "m.272",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Hâkimler hakkındaki ret ve yasaklılık sebepleri bilirkişiler hakkında da geçerlidir.",
        onemliFikra: "Bilirkişi, taraflardan birinin yakını, vekili, ortağı veya husumetlisi ise davadan derhal çekinmelidir."
      },
      {
        baslik: "TCK m.258 - Göreve İlişkin Sırrın Açıklanması",
        kanunNo: "5237",
        maddeNo: "m.258",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5237&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "İnceleme sırasında öğrenilen bilgi ve belgelerin ifşa edilmesi suçtur.",
        onemliFikra: "Görevi dolayısıyla öğrendiği ve gizli kalması gereken bilgileri yetkisiz kişilere açıklayan bilirkişi hapis cezası ile cezalandırılır."
      }
    ],
    konular: [
      {
        baslik: "1. Bağımsızlık ve Tarafsızlık İlkesi",
        icerik: "Bilirkişi görevini yerine getirirken taraflardan, mahkemeden veya üçüncü kişilerden hiçbir telkin ve talimat alamaz. Tarafsızlığını şüpheye düşürecek her türlü davranış ve ilişkiden kaçınmalıdır.",
        onemliNot: "Keşif mahallinde taraflardan sadece birinin aracına binmek veya biriyle baş başa görüşmek tarafsızlığı zedeleyen ağır kusurdur."
      },
      {
        baslik: "2. Görevi Bizzat İfa ve Sır Saklama",
        icerik: "Bilirkişi, kendisine verilen görevi bizzat yerine getirmek zorundadır; görevini başkasına devredemez. İnceleme sırasında öğrendiği ticari ve kişisel sırları ömür boyu saklamakla yükümlüdür.",
        onemliNot: "Bilirkişi inceleme amacıyla teslim aldığı dosya evrakını ve numuneleri özenle korumalı, üçüncü şahıslarla paylaşmamalıdır."
      }
    ],
    testSorulari: [
      {
        soru: "Bilirkişi, keşif mahalline ulaşım konusunda nasıl hareket etmelidir?",
        secenekler: [
          "Davacının özel aracıyla keşif yerine gitmelidir",
          "Yalnızca mahkemenin tahsis ettiği keşif aracıyla veya bağımsız şekilde gitmelidir",
          "Davalı tarafın temin ettiği ticari taksi ile gitmelidir",
          "Taraflardan masrafı elden nakit alarak gitmelidir"
        ],
        dogruCevapIndex: 1,
        aciklama: "HMK ve etik kurallar uyarınca bilirkişi mahkeme heyetinin görevli aracıyla gitmeli, taraflarla münferit seyahat etmemelidir."
      }
    ]
  },
  {
    id: "modul-3",
    no: 3,
    baslik: "Delillerin Toplanması, İnceleme ve Keşif Metodolojisi",
    altBaslik: "Zirai İncelemeler, Fen Aplikasyonu ve Bilimsel Veri Toplama",
    sure: "6 Saat",
    ozet: "Keşif tutanağının tanzimi, fen bilirkişisi ile sınır tespiti, toprak ve bitki numuneleri alımı, stereoskopik hava fotoğrafları analizi.",
    mevzuatMaddeleri: ["HMK m.279-280 (Keşif ve İnceleme)", "3402 SK m.14-17 (Kadastro ve İmar-İhya)"],
    mevzuatLinkleri: [
      {
        baslik: "HMK m.279 - Bilirkişinin Açıklama Yapması & Taraf Dinleme Yasağı",
        kanunNo: "6100",
        maddeNo: "m.279",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Diğer taraf hazır bulunmaksızın taraflardan biri tek taraflı isticvap edilemez.",
        onemliFikra: "Bilirkişi, diğer taraf hazır olmaksızın taraflardan birinden bilgi alamaz ve inceleme yapamaz."
      },
      {
        baslik: "3402 SK m.14 - Zilyetlikle Taşınmaz Edinme Sınırları",
        kanunNo: "3402",
        maddeNo: "m.14",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=3402&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Belgesiz zilyetlikle aynı çalışma alanı içinde sulu 40 dekar, kuru 100 dekar sınırı.",
        onemliFikra: "Sulu veya kuru toprak ayrımı Toprak Koruma ve Arazi Kullanımı Kanunu hükümlerine göre yapılır."
      },
      {
        baslik: "3402 SK m.17 - İhya Edilen Taşınmaz Mallar",
        kanunNo: "3402",
        maddeNo: "m.17",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=3402&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Emek ve masrafla tarıma elverişli hale getirme şartları ve 20 yıllık süre kuralı.",
        onemliFikra: "Orman sayılmayan, kamu hizmetine tahsis edilmeyen araziden masraf ve emek sarfı ile ihya edilen yerler şartları varsa tespit edilir."
      }
    ],
    konular: [
      {
        baslik: "1. Keşif Mahallinde Taraf Eşitliği Standardı",
        icerik: "HMK m.279 gereğince bilirkişi diğer taraf hazır olmaksızın taraflardan birini dinleyemez ve soru soramaz. İncelemeler her iki tarafın veya vekillerinin huzurunda icra edilmelidir.",
        onemliNot: "Taraflardan biri keşfe mazeretsiz gelmemişse, usulüne uygun tebligat yapılmış olmak kaydıyla inceleme yapılabilir."
      },
      {
        baslik: "2. Zirai ve Kadastral Delil Toplama Kuralları",
        icerik: "Taşınmazın toprak derinliği, tekstürü, eğimi, sulama imkanları ve ürün deseni yerinde tespit edilmeli; tespitler renkli fotoğraflarla belgelenmelidir.",
        onemliNot: "İmar-ihya iddialarında Harita Genel Komutanlığı'ndan en az 3 farklı döneme ait (15-20-25 yıl) stereoskopik hava fotoğrafları getirtilip 3 boyutlu incelenmelidir."
      }
    ],
    testSorulari: [
      {
        soru: "Yargıtay 16. Hukuk Dairesi yerleşik içtihatlarına göre imar-ihya ve zilyetlik tespitinde hava fotoğrafları nasıl incelenmelidir?",
        secenekler: [
          "Yalnızca tespit yılına en yakın tek bir hava fotoğrafı üzerinden",
          "Dava tarihinden geriye doğru en az 3 farklı tarihe ait stereoskopik çift fotoğraflarla 3 boyutlu olarak",
          "Sadece internetteki standart uydu haritaları üzerinden",
          "Köylü tanıklarının beyanları esas alınarak fotoğrafa gerek duyulmadan"
        ],
        dogruCevapIndex: 1,
        aciklama: "Yargıtay yerleşik içtihatlarına göre geriye doğru 15, 20 ve 25 yıl öncesine ait 3 farklı stereoskopik hava fotoğrafı zorunludur."
      }
    ]
  },
  {
    id: "modul-4",
    no: 4,
    baslik: "Rapor Yazımı Metodolojisi ve Rapor Standartları",
    altBaslik: "Bakanlık Resmi Şablonu, Bilimsel Gerekçelendirme ve Dil Standardı",
    sure: "6 Saat",
    ozet: "Raporun ana bölümleri (Başlık, Görevlendirme, İnceleme, Bilimsel Değerlendirme, Sonuç), anlaşılır Türkçe kullanımı, matematiksel netlik.",
    mevzuatMaddeleri: ["Adalet Bakanlığı Rapor Standartları", "HMK m.281", "2942 SK m.11 (Değerleme İlkeleri)"],
    mevzuatLinkleri: [
      {
        baslik: "2942 SK m.11 - Kamulaştırma Bedel Tespiti Esasları",
        kanunNo: "2942",
        maddeNo: "m.11",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2942&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Arazilerde net gelir kapitalizasyonu, arsalarda emsal satış karşılaştırması kuralları.",
        onemliFikra: "Bilirkişi heyeti; arazinin cinsi, mesahası, objektif değer artışı ve emsal rayiçlerini raporda ayrı ayrı gösterir."
      },
      {
        baslik: "HMK m.281 - Bilirkişi Raporuna İtiraz ve Ek Rapor",
        kanunNo: "6100",
        maddeNo: "m.281",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Eksik ve müphem görülen hususlarda bilirkişiden ek rapor talep edilmesi.",
        onemliFikra: "Taraflar raporun tebliğinden itibaren iki hafta içinde itirazlarını bildirir; mahkeme gerekirse ek rapor düzenlettirir."
      },
      {
        baslik: "7201 SK m.7/a - Elektronik Tebligat Kuralı",
        kanunNo: "7201",
        maddeNo: "m.7/a",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=7201&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Bilirkişiye UETS üzerinden yapılan tebligatın tebliğ sayılma zamanı.",
        onemliFikra: "Elektronik tebligat, adrese ulaştığı tarihi izleyen 5. günün sonunda yapılmış sayılır."
      }
    ],
    konular: [
      {
        baslik: "1. Raporun Biçimsel ve Mantıksal Düzeni",
        icerik: "Rapor; Başlık ve Görevlendirme, Uyuşmazlığın Konusu, İnceleme ve Tespitler, Bilimsel ve Teknik Gerekçe, Sonuç ve Kanaat bölümlerinden oluşmalıdır. Sayfa numaraları ve ekler dizini eksiksiz olmalıdır.",
        onemliNot: "Hesaplama adımlarında formüller açıkça yazılmalı, atlama yapılmamalı ve yuvarlama farkları açıklanmalıdır."
      },
      {
        baslik: "2. HMK 279 Hukuki Dil Filtresi",
        icerik: "Bilirkişi raporu teknik bir belgedir. 'Dava kabul edilmelidir', 'davacı haklıdır', 'haksız işgal vardır' gibi hüküm cümleleri yazılamaz; sadece teknik veriler ve hesap sonuçları mahkemeye sunulur.",
        onemliNot: "Hâkim raporu okuduğunda teknik terimler nedeniyle tereddüde düşmemeli; terimlerin yanına kısa açıklamalar eklenmelidir."
      }
    ],
    testSorulari: [
      {
        soru: "Aşağıdaki ifadelerden hangisi bilirkişi raporunun 'Sonuç ve Kanaat' kısmına yazılmaya uygundur?",
        secenekler: [
          "Davalının davacıya 50.000 TL tazminat ödemesine karar verilmesi gerekir.",
          "Davacının davasının kabulü ile tapunun iptali adalet gereğidir.",
          "Dava konusu 10 da taşınmazın kamulaştırma bedeli teknik hesaplamalar neticesinde 740.000 TL olarak takdir edilmiştir.",
          "Davalı kusurlu bulunduğundan tüm masraflar davalıya yüklenmelidir."
        ],
        dogruCevapIndex: 2,
        aciklama: "Bilirkişi sadece teknik tespit ve bedel takdiri sunar; mahkemenin yerine hüküm veya vekâlet ücreti kararı veremez."
      }
    ]
  },
  {
    id: "modul-5",
    no: 5,
    baslik: "Bilirkişinin Hukuki ve Cezai Sorumluluğu",
    altBaslik: "TCK m.276 Gerçeğe Aykırı Bilirkişilik, Tazminat ve Disiplin Yaptırımları",
    sure: "6 Saat",
    ozet: "Bilirkişinin kasten veya ağır ihmalle gerçeğe aykırı mütalaada bulunması, rüşvet/menfaat temini, disiplin soruşturması ve sicilden silinme.",
    mevzuatMaddeleri: ["6754 SK m.13-14", "TCK m.276", "HMK m.285 (Devletin Rücu Hakkı)"],
    mevzuatLinkleri: [
      {
        baslik: "TCK m.276 - Gerçeğe Aykırı Bilirkişilik",
        kanunNo: "5237",
        maddeNo: "m.276",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5237&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Gerçeğe aykırı mütalaa verme suçu ve cezası.",
        onemliFikra: "Yargı mercileri veya yetkili kurul önünde gerçeğe aykırı mütalaada bulunan bilirkişiye 1 ila 3 yıl hapis cezası verilir."
      },
      {
        baslik: "6754 SK m.13 - Sicilden ve Listeden Çıkarılma",
        kanunNo: "6754",
        maddeNo: "m.13",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6754&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Raporu geciktirme, etik ihlal ve hukuki aşım durumlarında sicilden çıkarma.",
        onemliFikra: "Raporunu haklı gerekçe olmadan süresinde vermeyen ve geciktirmeyi alışkanlık haline getiren bilirkişi sicilden çıkarılır."
      },
      {
        baslik: "HMK m.285 - Hukuki Tazminat ve Rücu",
        kanunNo: "6100",
        maddeNo: "m.285",
        url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6100&MevzuatTur=1&MevzuatTertip=5",
        aciklama: "Bilirkişinin kusurlu eyleminden doğan zararlardan Devletin sorumluluğu ve rücu hakkı.",
        onemliFikra: "Bilirkişinin kasten veya ağır kusurla düzenlediği rapordan doğan zararlar Devletçe ödenir; ardından bilirkişiye rücu edilir."
      }
    ],
    konular: [
      {
        baslik: "1. Gerçeğe Aykırı Bilirkişilik Suçu (TCK m.276)",
        icerik: "Yargı mercileri veya yetkili kurullar nezdinde görevlendirilen bilirkişinin gerçeğe aykırı mütalaada bulunması halinde bir yıldan üç yıla kadar hapis cezası uygulanır.",
        onemliNot: "Basit hesap hatası suç oluşturmaz; ancak kasten maddi gerçeği gizlemek veya çarpıtmak ağır cezai yaptırıma tabidir."
      },
      {
        baslik: "2. Disiplin ve Sicilden Çıkarılma",
        icerik: "Raporunu süresi içinde teslim etmeyen, etik ilkelere aykırı davranan veya hukuki nitelendirme yasağını ısrarla ihlal eden bilirkişiler Bölge Bilirkişilik Kurulu kararıyla sicilden ve listeden çıkarılır.",
        onemliNot: "Bilirkişilik listesinden çıkarılan kişiler en az 3 yıl süreyle yeniden listeye başvuramaz."
      }
    ],
    testSorulari: [
      {
        soru: "Bilirkişinin gerçeğe aykırı rapor düzenlemesi sebebiyle zarar gören tarafların tazminat davası kime karşı açılır?",
        secenekler: [
          "Doğrudan bilirkişinin şahsına karşı",
          "Devlete (Hazineye) karşı açılır; Devlet ödediği tazminatı kusurlu bilirkişiye rücu eder",
          "Bilirkişiler Odasına karşı",
          "Davanın görüldüğü mahkeme hâkimine karşı"
        ],
        dogruCevapIndex: 1,
        aciklama: "HMK m.285 uyarınca tazminat davası Devlete karşı açılır; Devlet kusurlu bilirkişiye rücu eder."
      }
    ]
  }
];

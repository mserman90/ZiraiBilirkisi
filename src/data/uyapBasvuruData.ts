export type UzmanlikAlani = {
  kod: string;
  ad: string;
  altAlanlar: {
    kod: string;
    ad: string;
    arananNitelik: string;
  }[];
};

export const TARIM_UZMANLIK_ALANLARI: UzmanlikAlani[] = [
  {
    kod: "01",
    ad: "01 TARIM",
    altAlanlar: [
      {
        kod: "01.01",
        ad: "Tarla Bitkileri",
        arananNitelik: "Ziraat Fakültesi Tarla Bitkileri Bölümü veya Ziraat Mühendisliği lisans mezuniyeti, en az 5 yıl mesleki kıdem."
      },
      {
        kod: "01.02",
        ad: "Bahçe Bitkileri (Meyvecilik, Sebzecilik, Bağcılık)",
        arananNitelik: "Ziraat Fakültesi Bahçe Bitkileri Bölümü lisans mezuniyeti, meyve-bağ değerleme ve hasar tespitinde en az 5 yıl kıdem."
      },
      {
        kod: "01.03",
        ad: "Toprak Bilimi ve Bitki Besleme",
        arananNitelik: "Toprak bölümü mezuniyeti, toprak sınıflaması, analiz ve imar-ihya tespitinde en az 5 yıl deneyim."
      },
      {
        kod: "01.04",
        ad: "Tarımsal Yapılar ve Sulama",
        arananNitelik: "Tarımsal yapılar/sulama mezuniyeti veya sulu tarım arazisi tespiti ve drenaj konusunda en az 5 yıl kıdem."
      },
      {
        kod: "01.05",
        ad: "Tarımsal Ekonomi ve Zirai Değerleme",
        arananNitelik: "Tarım Ekonomisi veya Ziraat Mühendisliği mezuniyeti, 2942 SK kamulaştırma, net gelir ve ecrimisil hesabında 5 yıl kıdem."
      },
      {
        kod: "01.06",
        ad: "Bitki Koruma ve Zirai Mücadele",
        arananNitelik: "Bitki Koruma bölümü mezuniyeti, pestisit zararları, hastalık ve kimyasal fitotoksisite tespitinde 5 yıl kıdem."
      }
    ]
  },
  {
    kod: "04",
    ad: "04 ORMAN",
    altAlanlar: [
      {
        kod: "04.01",
        ad: "Orman Mühendisliği ve Orman Kadastrosu",
        arananNitelik: "Orman Fakültesi lisans mezuniyeti, 6831 SK ve 2/B uygulamalarında en az 5 yıl deneyim."
      }
    ]
  },
  {
    kod: "10",
    ad: "10 HARİTA VE KADASTRO",
    altAlanlar: [
      {
        kod: "10.01",
        ad: "Kadastro ve Fotogrametri / Uzaktan Algılama",
        arananNitelik: "Harita/Geomatik Mühendisliği lisans mezuniyeti, stereoskopik hava fotoğrafı ve sınır tespitinde en az 5 yıl kıdem."
      }
    ]
  }
];

export const UYAP_BASVURU_ADIMLARI = [
  {
    adim: 1,
    baslik: "Elektronik İmza (e-imza / m-imza) Temini",
    aciklama: "BTK onaylı Elektronik Sertifika Hizmet Sağlayıcılardan (TÜRKKEP, E-Tuğra, e-İmzatr vb.) veya GSM operatörlerinden mobil imza temin edilmesi.",
    uyari: "Bilirkişi Portala yalnızca e-imza veya mobil imza ile giriş yapılabilir."
  },
  {
    adim: 2,
    baslik: "UYAP Bilirkişi Portalına Giriş (bilirkisi.uyap.gov.tr)",
    aciklama: "Google Chrome tarayıcısı üzerinden Bilirkişi Portalına giriş yapılarak 'Başvuru Yap' -> 'Gerçek Bilirkişi Başvurusu' seçilir.",
    uyari: "Sistem Google Chrome tarafından optimize edilmiştir."
  },
  {
    adim: 3,
    baslik: "Adres ve İletişim Bilgileri Beyanı",
    aciklama: "Yerleşim yeri veya fiili mesleki faaliyetin yürütüldüğü il seçilir. Başvuru yapılacak Bilirkişilik Bölge Kurulu bu ile göre belirlenir.",
    uyari: "Seçilen ilin yetki çevresi dışındaki bölge kurullarına başvuru yapılamaz."
  },
  {
    adim: 4,
    baslik: "Banka Hesap (IBAN) Bilgileri",
    aciklama: "Bilirkişi ücret ve gider avanslarının yatırılacağı adınıza kayıtlı geçerli vadesiz TL IBAN numarası eklenir.",
    uyari: "Hesabın aktif olarak işaretlenmesi zorunludur."
  },
  {
    adim: 5,
    baslik: "Bölge Kurulu Başvuru İlanı Seçimi",
    aciklama: "Yetkili Bölge Bilirkişilik Kurulu (Örn: Ankara, İstanbul, İzmir, Adana vb.) ilan listesinden cari yıl ilanı seçilir.",
    uyari: "Birden fazla bölge kuruluna aynı anda başvuru yapılamaz."
  },
  {
    adim: 6,
    baslik: "Temel ve Alt Uzmanlık Alanı Seçimi (Kritik Sınır)",
    aciklama: "Bakanlık kuralı gereğince EN FAZLA 3 TEMEL UZMANLIK ALANI ve EN FAZLA 6 ALT UZMANLIK ALANI seçilebilir.",
    uyari: "Seçilen her alt uzmanlık alanı için en az 5 yıllık mesleki kıdem ve diploma belgelenmelidir."
  },
  {
    adim: 7,
    baslik: "UYAP Doküman Editörü (.UDF) ile Başvuru Dilekçesi İmzalama",
    aciklama: "Sistem tarafından üretilen başvuru formu bilgisayara indirilip UYAP Editör (UDE) ile açılır ve e-imza ile imzalanarak yüklenir.",
    uyari: "Word, PDF vb. formatta yüklenen başvuru dilekçeleri geçersiz sayılır; UDF formatı şarttır."
  },
  {
    adim: 8,
    baslik: "Evrakların ve Fotoğrafın Yüklenmesi",
    aciklama: "Diploma, oda kayıt belgesi, 5 yıllık hizmet dökümü, temel eğitim sertifikası ve 1024x768 px vesikalık fotoğraf sisteme eklenir.",
    uyari: "Evraklar tek tek seçilerek 'Evrak Gönder' butonu ile gönderilmelidir."
  }
];

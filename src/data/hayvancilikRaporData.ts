/**
 * 02 Hayvancılık & Zootekni & Yem & Mandıra Bilirkişilik Rapor Otomasyonu Veritabanı
 * T.C. Adalet Bakanlığı Bilirkişilik Daire Başkanlığı, HMK m. 279,
 * Yargıtay 3. ve 11. Hukuk Dairesi yerleşik içtihatları ve TMMOB Ziraat Mühendisleri Odası
 * Ziraat Bilirkişi Rehberi esaslarına tam uyumlu adli veri setleri.
 */

export interface HayvancilikVarlikItem {
  id: string;
  tur: "Büyükbaş" | "Küçükbaş" | "Kanatlı";
  irk: string;
  kulakKupeNo: string;
  yasAy: number;
  cinsiyet: "Dişi" | "Erkek";
  canliAgirlikKg: number;
  karkasRandimaniPct: number;
  miktarBas: number;
  durum: "telef" | "mecburi_kesim" | "yarali_tedavi" | "saglam_kiymet_takdiri";
  damizlikVasfi: boolean;
  damizlikFarkTl: number;
  gebelikDurumu: boolean;
  beklenenYavruTl: number;
  gunlukSutLt: number;
  canliKgRayicTl: number;
  karkasKgRayicTl: number;
  kurtarmaHurdaEtTl: number;
  tedaviMasrafiTl: number;
  tespitVeNotlar: string;
}

export interface HayvancilikDavaSablonu {
  id: string;
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
    il: string;
    ilce: string;
    koyMahalle: string;
    tesisAdaParsel: string;
    olayTarihi: string;
    davaTarihi: string;
    olayOzeti: string;
    varliklar: HayvancilikVarlikItem[];
    yoksunKalinanGun: number;
    cigSutLitreFiyatiTl: number;
    yemHasarMiktariTon?: number;
    yemBirimFiyatiTl?: number;
    tarsimMuafiyetPct?: number;
    muterafikKusurPct?: number;
    faizTuru: "yasal" | "avans_ticari";
    faizBaslangicTuru: "olay_tarihi" | "temerrut_tarihi" | "dava_tarihi";
    teknikIncelemeMetni: string;
  };
}

export const HAYVANCILIK_DAVA_SABLONLARI: HayvancilikDavaSablonu[] = [
  // -------------------------------------------------------------------------
  // 1. CANLI HAYVAN TELEFATI VE HAKSIZ FİİL TAZMİNATI (TBK m. 49 & 55)
  // -------------------------------------------------------------------------
  {
    id: "telef_haksiz_fiil",
    ad: "Canlı Hayvan Telefatı ve Maddi Tazminat (Trafik, Elektrik, Zehirlenme, Yırtıcı Saldırısı)",
    kisaltma: "Hayvan Telefatı Tazminatı",
    mahkemeTuru: "Asliye Hukuk Mahkemesi",
    kanunMaddesi: "6098 sayılı Türk Borçlar Kanunu m. 49, 50, 52, 55; 5996 s. Kanun",
    aciklama:
      "Elektrik çarpması, trafik kazası, zehirli ilaç atığı veya sahipsiz köpek/yırtıcı saldırısı sonucu telef olan veya acil kesime tabi tutulan büyükbaş/küçükbaş hayvanların piyasa rayici, yoksun kalınan süt/yavru kârı ve TBK m. 55 uyarınca hurda et bedelinin mahsubu.",
    varsayilanSorular: [
      "Olayda telef olan hayvanların kulak küpe (TÜRKVET) kayıtları, ırkı, yaşı ve damızlık niteliklerinin belirlenmesi,",
      "Ölüm sebebi ile davalı eylemi/tesisi arasındaki teknik illiyet bağının veteriner raporlarıyla tespiti,",
      "Olay tarihi itibarıyla mahalli Ticaret Borsası ve UKON canlı kg / karkas kg rayiç değerlerinin tespiti,",
      "Varsa gebelik, laktasyon ve süt kaybına ilişkin yoksun kalınan kârın hesaplanması,",
      "TBK m. 52/55 uyarınca zorunlu kesimden elde edilen hurda (kurtarma et/deri) bedelinin mahsup edilmesi.",
    ],
    kesifRehberi: {
      baslik: "Hayvan Telefatı Keşif ve Otopsi Denetim Kılavuzu",
      yapilacaklar: [
        "TÜRKVET / HAYBİS sisteminden kulak küpesi düşüm belgesini ve aşı kartlarını dosyadaki tutanaklarla karşılaştırın.",
        "Resmi İlçe Tarım veteriner hekiminin olay anındaki muayene ve otopsi/nekropsi zaptını inceleyin (elektrik lezyonları, iç kanama, zehirlenme bulguları).",
        "Hayvan murdar olmadan acil/zorunlu kesime sevk edilip kombina veya kasaba satıldıysa kesim makbuzunu ve karkas ağırlığını tutanağa geçirin.",
        "Ahırın iç ve dış tesisatını, çit güvenliğini ve komşu elektrik hatlarını yerinde fotoğraflayın.",
      ],
      gerekliBelgeler: [
        "İlçe Tarım ve Orman Müdürlüğü Veteriner Muayene ve Tespit Zaptı",
        "Jandarma / Polis Olay Yeri Görgü ve Tespit Tutanağı",
        "TÜRKVET Kulak Küpe Pasaport Kayıt Dökümü",
        "Mahalli Ticaret Borsası Canlı Hayvan ve Karkas Et Günlük Bülteni",
        "Varsa Kesimhane / Kombina Zorunlu Kesim Tartı ve Satış Faturası",
      ],
      dikkatEdilecekler: [
        "HMK m. 279 gereğince bilirkişi raporda 'davalı elektrik şirketi kusurludur' veya 'davacı müterafik kusurludur' gibi hukuki nitelemeler yapamaz. 'Direkteki izolatör kırığı sebebiyle kaçak akım oluştuğu teknik olarak saptanmıştır' şeklinde maddi tespit yazmalıdır.",
        "TBK m. 55 uyarınca hurda (kurtarma) et bedeli MUTLAKA düşülmelidir; aksi halde Yargıtay 3. Hukuk Dairesi kararı doğrudan bozar.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Balıkesir 2. Asliye Hukuk Mahkemesi",
      dosyaNo: "2025/318 Esas",
      davaci: "Kemal Öztürk (Öztürk Hayvancılık)",
      davaciVekili: "Av. Murat Aksoy",
      davali: "Uludağ Elektrik Dağıtım A.Ş. (UEDAŞ)",
      davaliVekili: "Av. Elif Çetin",
      konu: "Ahır Bitişiğindeki Elektrik Hattı Kopması Sebebiyle 4 Baş Damızlık Süt İneğinin Telefi Nedeniyle Maddi Tazminat Talebi",
      il: "Balıkesir",
      ilce: "Altıeylül",
      koyMahalle: "Köseler Mahallesi",
      tesisAdaParsel: "102 Ada, 5 Parsel",
      olayTarihi: "2025-04-12",
      davaTarihi: "2025-05-20",
      olayOzeti:
        "12.04.2025 tarihinde şiddetli rüzgar nedeniyle davalı kuruma ait alçak gerilim nakil hattının koparak davacıya ait yarı açık besi ve süt ahırının demir korkuluklarına temas ettiği, bu temas neticesinde suluk ve yemlik demirlerine 220V enerji iletildiği ve temas halindeki 4 baş damızlık Holstein ırkı süt sığırının elektroküsyon (akım çarpması) neticesinde telef olduğu tespit edilmiştir.",
      varliklar: [
        {
          id: "varlik_1",
          tur: "Büyükbaş",
          irk: "Holstein (Siyah Alaca)",
          kulakKupeNo: "TR100012345678",
          yasAy: 38,
          cinsiyet: "Dişi",
          canliAgirlikKg: 640,
          karkasRandimaniPct: 56,
          miktarBas: 2,
          durum: "telef",
          damizlikVasfi: true,
          damizlikFarkTl: 28000,
          gebelikDurumu: true,
          beklenenYavruTl: 32000,
          gunlukSutLt: 28,
          canliKgRayicTl: 245,
          karkasKgRayicTl: 430,
          kurtarmaHurdaEtTl: 0,
          tedaviMasrafiTl: 4500,
          tespitVeNotlar: "Elektroküsyon sonucu olay yerinde ex olmuştur. 6 aylık gebe ve 2. laktasyondadır.",
        },
        {
          id: "varlik_2",
          tur: "Büyükbaş",
          irk: "Holstein (Siyah Alaca)",
          kulakKupeNo: "TR100087654321",
          yasAy: 44,
          cinsiyet: "Dişi",
          canliAgirlikKg: 610,
          karkasRandimaniPct: 55,
          miktarBas: 2,
          durum: "mecburi_kesim",
          damizlikVasfi: true,
          damizlikFarkTl: 22000,
          gebelikDurumu: false,
          beklenenYavruTl: 0,
          gunlukSutLt: 24,
          canliKgRayicTl: 245,
          karkasKgRayicTl: 430,
          kurtarmaHurdaEtTl: 110000, // Kombina zorunlu kesim net bedeli
          tedaviMasrafiTl: 6000,
          tespitVeNotlar: "Akım çarpması sonrası felç gelişmiş, veteriner kararıyla kombina acil kesimine sevk edilmiştir.",
        },
      ],
      yoksunKalinanGun: 60,
      cigSutLitreFiyatiTl: 17.5,
      faizTuru: "yasal",
      faizBaslangicTuru: "olay_tarihi",
      teknikIncelemeMetni:
        "Dosya muhteviyatındaki İlçe Tarım ve Orman Müdürlüğü veteriner hekim muayene zaptı, TÜRKVET kayıtları ve Balıkesir Ticaret Borsası bültenleri birlikte tetkik edilmiştir. Olay tarihinde telef olan hayvanların pedigree kayıtlı, 2. ve 3. laktasyonda, süt verimi yüksek damızlık süt sığırı vasfında olduğu görülmüştür. Mecburi kesime sevk edilen 2 baş inekten elde edilen 110.000,00 TL kombina karkas satış bedeli TBK m. 55 gereğince hesaplanan brüt zarardan mahsup edilmiştir.",
    },
  },

  // -------------------------------------------------------------------------
  // 2. TARSİM HAYVAN HAYAT SİGORTASI HASAR TAZMİNATI (5363 s.K. & TTK m. 1409)
  // -------------------------------------------------------------------------
  {
    id: "tarsim_sigorta_hasar",
    ad: "TARSİM Hayvan Hayat Sigortası Hasar ve Poliçe Tazminatı Uyuşmazlığı",
    kisaltma: "TARSİM Sigorta Tazminatı",
    mahkemeTuru: "Asliye Ticaret / Tüketici Mahkemesi",
    kanunMaddesi: "5363 sayılı Tarım Sigortaları Kanunu; TTK m. 1409, 1425, 1427; Tarım Sigortaları Havuzu Genel Şartları",
    aciklama:
      "TARSİM Hayvan Hayat Sigortası poliçesi kapsamındaki ani hastalık, zehirlenme, şap, doğum komplikasyonu, yavru atma ve mecburi kesim hallerinde sigorta eksper raporu ile sigortalı talebi arasındaki uyuşmazlığın teknik denetimi.",
    varsayilanSorular: [
      "Hayvanın poliçe tanzim tarihi ve yürürlük süresi içerisinde poliçe teminatında olup olmadığı,",
      "Hasar ihbarının sözleşmede öngörülen yasal 24 saatlik süre içinde yapılıp yapılmadığı,",
      "Ölüm veya mecburi kesim nedeninin poliçe genel ve özel şartları kapsamına girip girmediği,",
      "Poliçede yer alan muafiyet ve müşterek sigorta oranlarının (%10 - %20) tenzili suretiyle net tazminat hesabı.",
    ],
    kesifRehberi: {
      baslik: "TARSİM Sigorta Ekspertiz ve Poliçe Denetim Rehberi",
      yapilacaklar: [
        "TARSİM poliçesi, zeyilnameleri ve poliçe özel şartlarını satır satır inceleyin.",
        "Ölüm nedeninin teminat harici hallerden (bulaşıcı hastalık ihbar yükümlülüğüne uyulmaması, kötü niyet vb.) olup olmadığını irdeleyin.",
        "Poliçedeki sigorta bedeli ile olay anındaki serbest piyasa rayicini karşılaştırın (Aşkın sigorta / Eksik sigorta kontrolü).",
        "Poliçede kararlaştırılan muafiyet (tenzili muafiyet) oranını net tazminattan kesin.",
      ],
      gerekliBelgeler: [
        "TARSİM Hayvan Hayat Sigortası Poliçesi ve Genel Şartlar Kitapçığı",
        "TARSİM Hasar Tespit ve Ekspertiz Raporu",
        "Veteriner Hekim Reçete, Teşhis ve Tedavi İlaç Faturaları",
        "TÜRKVET Düşüm ve Ölüm Bildirim Belgesi",
      ],
      dikkatEdilecekler: [
        "TARSİM uyuşmazlıklarında faiz başlangıcı olay tarihi değil, TTK m. 1427 uyarınca sigortacıya ihbar ve belgelerin tesliminden itibaren 30 günün dolduğu (temerrüt) tarihidir.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Konya 1. Asliye Ticaret Mahkemesi",
      dosyaNo: "2025/489 Esas",
      davaci: "Mustafa Demir (Demir Besi Çiftliği)",
      davaciVekili: "Av. Cengiz Yılmaz",
      davali: "Tarım Sigortaları Havuz İşletmesi A.Ş. (TARSİM)",
      davaliVekili: "Av. Hülya Kurt",
      konu: "Geniş Kapsamlı Hayvan Hayat Sigortası Kapsamında 3 Baş Besi Danasının Akut Şişme ve Solunum Yetmezliğinden Ölümü Nedeniyle Sigorta Bedeli Talebi",
      il: "Konya",
      ilce: "Karatay",
      koyMahalle: "İsmil Mahallesi",
      tesisAdaParsel: "214 Ada, 12 Parsel",
      olayTarihi: "2025-02-15",
      davaTarihi: "2025-04-10",
      olayOzeti:
        "15.02.2025 tarihinde davacıya ait besi işletmesinde barınan 3 baş Simental melezi besi danasında akut timpani (şişme) ve aspirasyon pnömonisi semptomları görülmüş, yapılan veteriner hekim acil müdahalesine rağmen hayvanlar ex olmuştur. TARSİM eksperi 'yemleme hatası ve ihmal' gerekçesiyle hasarı reddetmiş, davacı ise poliçede 'akut zehirlenme ve metabolik hastalıklar' klozu bulunduğunu beyan ederek dava açmıştır.",
      varliklar: [
        {
          id: "varlik_tarsim_1",
          tur: "Büyükbaş",
          irk: "Simental (Fleckvieh)",
          kulakKupeNo: "TR420045612345",
          yasAy: 16,
          cinsiyet: "Erkek",
          canliAgirlikKg: 520,
          karkasRandimaniPct: 58,
          miktarBas: 3,
          durum: "telef",
          damizlikVasfi: false,
          damizlikFarkTl: 0,
          gebelikDurumu: false,
          beklenenYavruTl: 0,
          gunlukSutLt: 0,
          canliKgRayicTl: 260,
          karkasKgRayicTl: 440,
          kurtarmaHurdaEtTl: 35000, // Sakatat ve kemik değerlendirme bedeli
          tedaviMasrafiTl: 7500,
          tespitVeNotlar: "Otopsi raporunda akut rumen timpanisi saptanmış olup poliçe özel şartlarında 'akut metabolik bozukluklar' teminata dahildir.",
        },
      ],
      yoksunKalinanGun: 0,
      cigSutLitreFiyatiTl: 0,
      tarsimMuafiyetPct: 15, // Poliçe gereği %15 tenzili muafiyet
      faizTuru: "yasal",
      faizBaslangicTuru: "temerrut_tarihi",
      teknikIncelemeMetni:
        "TARSİM poliçesi No: 2024-HHS-89412 incelendiğinde; hayvanların 'Geniş Kapsamlı Hayvan Hayat Sigortası' ile sigortalandığı, poliçe 4.3 maddesinde 'akut rumen asidozu ve timpani neticesi ölümlerin teminata dahil olduğu' açıkça yazılıdır. Eksper raporundaki ihmal iddiasını destekler somut bir kanıt bulunmayıp hayvan başına takdir edilen rayiç üzerinden %15 poliçe muafiyeti ve 35.000 TL kurtarma bedeli tenzil edilmiştir.",
    },
  },

  // -------------------------------------------------------------------------
  // 3. BOZUK / TOKSİNLİ YEM KAYNAKLI SÜRÜ HASARI VE VERİM KAYBI (02.05)
  // -------------------------------------------------------------------------
  {
    id: "yem_toksin_hasar",
    ad: "Bozuk / Aflatoksinli Yem Kaynaklı Sürü Telefatı ve Süt Verim Kaybı Tazminatı",
    kisaltma: "Yem Kaynaklı Zarar Davası",
    mahkemeTuru: "Asliye Ticaret / Asliye Hukuk Mahkemesi",
    kanunMaddesi: "5996 s. Veteriner Hizmetleri, Bitki Sağlığı, Gıda ve Yem Kanunu; 6098 s. TBK m. 49, 112, 114",
    aciklama:
      "Yem fabrikası veya tedarikçisinden satın alınan fabrika yeminde Türk Gıda/Yem Kodeksi limitlerini aşan aflatoksin, zearalenon, küf veya üre bulunması sebebiyle hayvanlarda meydana gelen toplu ölüm, yavru atma, karaciğer harabiyeti ve laktasyon süt verim kaybı tazminatı.",
    varsayilanSorular: [
      "Satın alınan yemin parti numarası, fatura ve sevk irsaliyeleri ile yem numunelerinin tespiti,",
      "Akredite laboratuvar analizinde aflatoksin B1 ve mikotoksin değerlerinin yasal limitleri (20 ppb) aşıp aşmadığı,",
      "Yem tüketimi ile hayvanlardaki klinik semptomlar ve nekropsi bulguları arasındaki illiyet bağı,",
      "Telef olan hayvan bedelleri, laktasyon boyunca yaşanan günlük süt verim kaybı ve imha edilen parti yem bedelinin hesabı.",
    ],
    kesifRehberi: {
      baslik: "Yem Kaynaklı Zarar ve Toksikoloji İnceleme Kılavuzu",
      yapilacaklar: [
        "Yem çuvallarından usulüne uygun (dörtleme yöntemiyle) şahit numune alınıp alınmadığını kontrol edin.",
        "Tarım Bakanlığı İl Kontrol Laboratuvarı analiz raporundaki HP (Ham Protein), Aflatoksin B1 ve nem oranlarını tabloya işleyin.",
        "Sürü kayıt defterinden yem verilmeden önceki günlük tank sütü ortalaması ile yem sonrası düşüş grafiğini çıkarın.",
        "Müterafik kusur araştırması: Ahırın havalandırması ve yem saklama deposunun rutubet durumu incelenmelidir.",
      ],
      gerekliBelgeler: [
        "Yem Satın Alma Faturası ve Etiket Beyannamesi",
        "İl Tarım ve Orman Müdürlüğü Akredite Laboratuvar Analiz Raporu",
        "Veteriner Hekim Tedavi Reçeteleri ve Karaciğer Nekropsi Raporu",
        "Süt Toplama Birliği / Mandıra Günlük Süt Teslim Müstahsil Makbuzları",
      ],
      dikkatEdilecekler: [
        "İlliyet bağının kesinleşmesi için laboratuvar raporunda yemdeki toksin ile hayvandaki klinik tablonun uyumlu olması şarttır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "İzmir 3. Asliye Ticaret Mahkemesi",
      dosyaNo: "2025/172 Esas",
      davaci: "Ege Damızlık Süt Sığırcılığı İşletmesi Ltd. Şti.",
      davaciVekili: "Av. Serkan Polat",
      davali: "Örnek Yem Sanayi ve Ticaret A.Ş.",
      davaliVekili: "Av. Banu Korkmaz",
      konu: "Ayıplı ve Yüksek Aflatoksinli 19 Protein Süt Yemi Nedeniyle 5 Baş İneğin Telefi, 40 Baş İnekte Süt Verim Kaybı ve Yem İmha Bedeli Talebi",
      il: "İzmir",
      ilce: "Tire",
      koyMahalle: "Gökçen Mahallesi",
      tesisAdaParsel: "305 Ada, 8 Parsel",
      olayTarihi: "2025-01-20",
      davaTarihi: "2025-03-05",
      olayOzeti:
        "Davacı işletme tarafından davalı fabrikadan 20 ton '19 Protein Süt Yemi' satın alınmıştır. Yemin verilmesini takip eden 5. günden itibaren hayvanlarda iştahsızlık, karaciğer yetmezliği, toplu süt veriminde %45 düşüş meydana gelmiş, 5 baş sağmal inek telef olmuştur. İzmir Gıda Kontrol Laboratuvarı analizinde yemdeki Aflatoksin B1 miktarının yasal sınır olan 20 ppb yerine 84.6 ppb çıktığı tespit edilmiştir.",
      varliklar: [
        {
          id: "varlik_yem_1",
          tur: "Büyükbaş",
          irk: "Holstein (Siyah Alaca)",
          kulakKupeNo: "TR350078945612",
          yasAy: 36,
          cinsiyet: "Dişi",
          canliAgirlikKg: 620,
          karkasRandimaniPct: 55,
          miktarBas: 5,
          durum: "telef",
          damizlikVasfi: true,
          damizlikFarkTl: 25000,
          gebelikDurumu: true,
          beklenenYavruTl: 30000,
          gunlukSutLt: 30,
          canliKgRayicTl: 250,
          karkasKgRayicTl: 435,
          kurtarmaHurdaEtTl: 0, // Toksinli et imha edildi
          tedaviMasrafiTl: 32000,
          tespitVeNotlar: "Karaciğer akut mikotoksikozis nekrozu. Etler imha tutanağı ile gömülmüştür.",
        },
      ],
      yoksunKalinanGun: 90, // 40 baş inekte 90 gün boyunca günlük 8 lt/baş süt düşüşü
      cigSutLitreFiyatiTl: 18.0,
      yemHasarMiktariTon: 15, // Kalan 15 ton bozuk yem imha edildi
      yemBirimFiyatiTl: 12500, // TL/ton
      faizTuru: "avans_ticari",
      faizBaslangicTuru: "temerrut_tarihi",
      teknikIncelemeMetni:
        "İzmir İl Gıda Kontrol Laboratuvarı'nın 25.01.2025 tarih ve 25-01429 sayılı muayene raporunda parti No: 401 olan süt yeminde 84.6 ± 7.2 ppb Aflatoksin B1 tespit edilmiştir. 5996 sayılı Kanun Yem Hijyeni Yönetmeliği Ek-1 sınır değerinin 4 katı toksin ihtiva ettiği açıktır. 5 baş telef olan damızlık inek bedeli, tedavi masrafları, kalan 15 ton imha edilen yem bedeli ve 40 baş inekte laktasyon boyunca kanıtlanan net süt kaybı ticari faiziyle birlikte hesaplanmıştır.",
    },
  },

  // -------------------------------------------------------------------------
  // 4. ÇİĞ SÜT AYIBI, SU KATMA (KRİYOSKOPİ) & MANDIRA ALACAK DAVASI (02.06)
  // -------------------------------------------------------------------------
  {
    id: "cig_sut_mandira_ayip",
    ad: "Çiğ Süt Teslimi, Su Katma (Kriyoskopi) ve Mandıra Alacak Uyuşmazlığı",
    kisaltma: "Çiğ Süt Kriyoskopi Uyuşmazlığı",
    mahkemeTuru: "Asliye Hukuk / Asliye Ticaret Mahkemesi",
    kanunMaddesi: "Türk Gıda Kodeksi Çiğ Süt Tebliği (Tebliğ No: 2019/35); 6102 s. TTK m. 9, 23",
    aciklama:
      "Süt toplama kooperatifi veya mandıra ile üretici arasındaki çiğ inek sütü teslimatında donma noktası (kriyoskopi) sapması neticesinde su katma hilesi, düşük yağ/protein oranı, ekşime ve sözleşmeye aykırılık kaynaklı hakediş kesintisi ve alacak tazminatı.",
    varsayilanSorular: [
      "Teslim edilen çiğ sütün donma noktası (°C), yağ oranı (%), protein (%) ve asitlik derecesinin tespiti,",
      "TGK standartlarına göre standart donma noktası olan -0.520 °C ila -0.530 °C'ye göre sütün su katma oranının hesaplanması,",
      "Su katılmak suretiyle haksız tahsil edilen süt bedelinin hesaplanarak mahsubu,",
      "Mandıra üretiminde işleme alınamayıp bozulan süt zayiat bedelinin tespiti.",
    ],
    kesifRehberi: {
      baslik: "Çiğ Süt Kriyoskopi ve Kalite Denetim Rehberi",
      yapilacaklar: [
        "Mandıra tankı kabul kriterleri ve kriyoskopi test cihazı (Termistör Kriyoskop) kalibrasyon belgelerini denetleyin.",
        "Su katma yüzdesi formülünü uygulayın: Su Oranı (%) = [(Standart Donma Derecesi - Numune Donma Derecesi) / Standart Donma Derecesi] * 100.",
        "Sözleşmedeki kalite prim ve ceza baremlerini inceleyin.",
      ],
      gerekliBelgeler: [
        "Çiğ Süt Alım-Satım Sözleşmesi",
        "Süt Toplama Tankı Günlük Kriyoskopi ve Yağ Ölçüm Fişleri",
        "Akredite Gıda Laboratuvarı Doğrulama Analizi",
        "Müstahsil Makbuzları ve Kesinti İcmalleri",
      ],
      dikkatEdilecekler: [
        "TGK Çiğ Süt Tebliği m. 5 gereğince çiğ inek sütünde donma noktası en yüksek -0.520 °C olabilir. Örneğin -0.440 °C çıkan sütte yaklaşık %15.38 oranında ilave su bulunmaktadır.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Kırklareli 1. Asliye Hukuk Mahkemesi",
      dosyaNo: "2025/104 Esas",
      davaci: "Trakya Süt ve Mandıra Ürünleri San. A.Ş.",
      davaciVekili: "Av. Nilgün Ergin",
      davali: "Güneş Süt Üreticileri Tarımsal Kalkınma Kooperatifi",
      davaliVekili: "Av. Turgut Çelik",
      konu: "Teslim Edilen Çiğ Sütlerde Kriyoskopi Testi ile %14.2 Oranında Su Katıldığının Saptanması Sebebiyle Yapılan Kesintinin Haklılığının Tespiti ve Tazminat",
      il: "Kırklareli",
      ilce: "Lüleburgaz",
      koyMahalle: "Ahmetbey Beldesi",
      tesisAdaParsel: "Mandıra Tesisleri",
      olayTarihi: "2025-03-01",
      davaTarihi: "2025-04-15",
      olayOzeti:
        "Davacı mandıra, davalı kooperatiften Mart 2025 dönemi boyunca günlük ortalama 12.000 litre çiğ inek sütü teslim almıştır. Yapılan numune testlerinde sütün donma noktasının -0.455 °C olarak ölçüldüğü, TGK referans değeri olan -0.530 °C'ye göre süte fiilen ortalama %14.15 oranında su ilave edildiği saptanmıştır. Mandıra 30 günlük dönemde ödediği bedelden su oranına tekabül eden 890.000 TL kesinti yapmış, uyuşmazlık mahkemeye intikal etmiştir.",
      varliklar: [],
      yoksunKalinanGun: 30,
      cigSutLitreFiyatiTl: 17.5,
      faizTuru: "avans_ticari",
      faizBaslangicTuru: "temerrut_tarihi",
      teknikIncelemeMetni:
        "Kırklareli Gıda Kontrol Laboratuvarı analiz tutanakları incelendiğinde; teslim edilen çiğ süt numunelerinin donma noktasının -0.455 °C olduğu ve bu değerin TGK Çiğ Süt Tebliği'nde belirlenen en yüksek sınır olan -0.520 °C'den anlamlı derecede yüksek olduğu görülmüştür. Prather-Babcock kriyoskopi formülü ile yapılan hesaplamada süt partisinin %14.15 oranında yabancı su içerdiği, mandıranın bu oranda yaptığı hakediş tenzilatının teknik ve adli olarak haklı olduğu tespit edilmiştir.",
    },
  },

  // -------------------------------------------------------------------------
  // 5. ÇİFTLİK İŞLETMESİ, TESİS VE SÜRÜ KIYMET TAKDİRİ (TMK m. 642, 699)
  // -------------------------------------------------------------------------
  {
    id: "ciftlik_suru_degerleme",
    ad: "Çiftlik İşletmesi, Tesis, Ahır ve Sürü Kıymet Takdiri (Miras Taksimi / İzale-i Şüyu)",
    kisaltma: "Çiftlik ve Sürü Değerlemesi",
    mahkemeTuru: "Sulh Hukuk Mahkemesi",
    kanunMaddesi: "4721 sayılı Türk Medeni Kanunu m. 642, 658, 699; 6754 sayılı Bilirkişilik Kanunu",
    aciklama:
      "Miras taksimi, ortaklığın giderilmesi (izale-i şüyu) veya şirket tasfiyesi davalarında hayvancılık işletmesinde bulunan damızlık sürü, genç hayvanlar, sağım üniteleri, süt soğutma tankları ve kaba yem stoklarının yerinde sayımı ve serbest piyasa rayiç tespiti.",
    varsayilanSorular: [
      "İşletmede fiilen mevcut büyükbaş/küçükbaş hayvanların ırk, yaş, cinsiyet ve verim durumlarına göre tek tek sayımı ve TÜRKVET doğrulaması,",
      "Sürü kompozisyonundaki hayvanların damızlık, kasaplık ve genç hayvan piyasa rayiç değerlerinin tespiti,",
      "İşletmede bulunan süt sağım sistemi, soğutma tankı ve yem karma makinelerinin amortisman ve piyasa kıymeti,",
      "Mevcut saman, yonca ve silaj stoklarının tonaj ve rayiç değerinin belirlenmesi.",
    ],
    kesifRehberi: {
      baslik: "Çiftlik ve Sürü Sayım & Kıymet Takdiri Rehberi",
      yapilacaklar: [
        "Ahır ve padokları tek tek dolaşarak fiziki sayım yapın; TÜRKVET listesi ile padoktaki hayvanları birebir eşleştirin.",
        "Sağmal ineklerin laktasyon durumunu ve gebelik kayıtlarını işletme bilgisayarından kontrol edin.",
        "Sabit tesis makinelerinin (sağım robotu/ünitesi, jeneratör, gübre sıyırıcı) marka, model, yıl ve çalışırlık durumunu tutanağa yazın.",
        "Yem deposundaki silaj çukuru ve balya stoklarını hacim formülleriyle (en × boy × yükseklik × yoğunluk) ölçün.",
      ],
      gerekliBelgeler: [
        "TÜRKVET İşletme Hayvan Varlığı Güncel Dökümü",
        "İşletme Demirbaş ve Makine Ekipman Faturaları",
        "İlçe Tarım Müdürlüğü 2025-2026 Hayvan Birim Fiyat Rayiç Cetveli",
        "Ticaret Borsası Yem Hammaddeleri Fiyat Bülteni",
      ],
      dikkatEdilecekler: [
        "Miras davalarında TMK m. 658 gereğince tarımsal işletmenin ekonomik bütünlüğü bozulmadan aynen taksim edilip edilemeyeceği mutlaka irdelenmelidir.",
      ],
    },
    ornekVeriler: {
      mahkeme: "Afyonkarahisar Sulh Hukuk Mahkemesi",
      dosyaNo: "2025/512 Esas",
      davaci: "Mehmet Çakır",
      davaciVekili: "Av. Hasan Doğan",
      davali: "Ali Çakır ve Müşterekleri",
      davaliVekili: "Av. Seda Arslan",
      konu: "Muris Vefatı Sonrası Kalan 80 Başlık Süt Sığırcılığı Çiftliğinde Ortaklığın Giderilmesi ve Kıymet Takdiri Talebi",
      il: "Afyonkarahisar",
      ilce: "Sandıklı",
      koyMahalle: "Kusura Köyü",
      tesisAdaParsel: "145 Ada, 22 Parsel",
      olayTarihi: "2025-01-10",
      davaTarihi: "2025-02-18",
      olayOzeti:
        "Mirasbırakan Hasan Çakır'ın vefatı neticesinde mirasçılar arasında intikal eden Sandıklı Kusura Köyü 145 ada 22 parselde kurulu modern süt sığırcılığı çiftliğinde bulunan canlı hayvan varlığı, makine ekipman ve yem stoklarının aynen taksiminin mümkün olup olmadığı ve açık artırmaya esas muhammen bedelinin tespiti talep edilmiştir.",
      varliklar: [
        {
          id: "varlik_ciftlik_1",
          tur: "Büyükbaş",
          irk: "Simental (Fleckvieh)",
          kulakKupeNo: "TR030011122233",
          yasAy: 40,
          cinsiyet: "Dişi",
          canliAgirlikKg: 650,
          karkasRandimaniPct: 57,
          miktarBas: 20,
          durum: "saglam_kiymet_takdiri",
          damizlikVasfi: true,
          damizlikFarkTl: 30000,
          gebelikDurumu: true,
          beklenenYavruTl: 35000,
          gunlukSutLt: 26,
          canliKgRayicTl: 255,
          karkasKgRayicTl: 440,
          kurtarmaHurdaEtTl: 0,
          tedaviMasrafiTl: 0,
          tespitVeNotlar: "20 baş sağmal Simental inek. Gebe ve yüksek damızlık vasfında.",
        },
        {
          id: "varlik_ciftlik_2",
          tur: "Büyükbaş",
          irk: "Holstein (Siyah Alaca)",
          kulakKupeNo: "TR030044455566",
          yasAy: 14,
          cinsiyet: "Dişi",
          canliAgirlikKg: 380,
          karkasRandimaniPct: 54,
          miktarBas: 15,
          durum: "saglam_kiymet_takdiri",
          damizlikVasfi: true,
          damizlikFarkTl: 18000,
          gebelikDurumu: false,
          beklenenYavruTl: 0,
          gunlukSutLt: 0,
          canliKgRayicTl: 255,
          karkasKgRayicTl: 440,
          kurtarmaHurdaEtTl: 0,
          tedaviMasrafiTl: 0,
          tespitVeNotlar: "15 baş damızlık adayı tohumlanmaya hazır düve.",
        },
      ],
      yoksunKalinanGun: 0,
      cigSutLitreFiyatiTl: 17.5,
      faizTuru: "yasal",
      faizBaslangicTuru: "dava_tarihi",
      teknikIncelemeMetni:
        "Keşif heyetimizce 145 ada 22 parsel sayılı taşınmaz üzerinde kurulu yarı açık serbest duraklı ahırda yapılan fiili sayımda; 20 baş sağmal Simental, 15 baş Holstein düve olmak üzere toplam 35 baş büyükbaş hayvanın TÜRKVET kulak küpeleriyle birebir uyumlu olduğu görülmüştür. Hayvanların kondisyon skorları 3.5-4.0 aralığında olup sağlıklı durumdadır. İşletmenin bölünerek mirasçılara paylaştırılması halinde ekonomik bütünlüğü bozulacağından TMK m. 699 gereğince sürü halinde satış suretiyle paraya çevrilmesi tavsiye olunur.",
    },
  },
];

// ---------------------------------------------------------------------------
// USTA BİLİRKİŞİ HAYVANCILIK NİHAİ DENETİM MOTORU (PRE-FLIGHT CHECKLIST)
// Yargıtay 3., 11., 13. Hukuk Daireleri En Çok Rastlanan 10 Bozma Riski
// ---------------------------------------------------------------------------

export interface HayvancilikPreFlightItem {
  id: string;
  siraNo: number;
  baslik: string;
  hukukiDayanak: string;
  aciklama: string;
  kontrolSorusu: string;
  agirlikPuan: number;
  otomatikKontrolKey: string;
}

export const HAYVANCILIK_PREFLIGHT_CHECKLIST: HayvancilikPreFlightItem[] = [
  {
    id: "check_1_turkvet",
    siraNo: 1,
    baslik: "TÜRKVET / HAYBİS Kulak Küpe Resmi Doğrulaması",
    hukukiDayanak: "5996 s.K. m. 7; Yargıtay 3. HD 2021/3421 E. 'Küpe Kaydı Olmayan Hayvana Tazminat Hükmedilemez'",
    aciklama:
      "Tazminata veya kıymet takdirine konu hayvanların Tarım ve Orman Bakanlığı TÜRKVET kayıt sisteminde davacı/borçlu adına kayıtlı olduğu teyit edilmelidir.",
    kontrolSorusu: "Raporda tüm hayvanların kulak küpe numaraları, pasaport kayıtları ve TÜRKVET dökümleri yer alıyor mu?",
    agirlikPuan: 12,
    otomatikKontrolKey: "turkvet_var_mi",
  },
  {
    id: "check_2_hmk279_kusur",
    siraNo: 2,
    baslik: "HMK m. 279 Tarafsızlık ve Hukuki Niteleme Yasağı (Kusur Kelimesi)",
    hukukiDayanak: "6100 sayılı HMK m. 279/2; 6754 s.K. m. 3/2; İBBK 1974/2",
    aciklama:
      "Bilirkişi hakimin yerine geçerek 'davalı %100 kusurludur', 'şirket asli kusurludur' yazamaz. Yalnızca maddi olguyu ve teknik illiyet bağını bildirmelidir.",
    kontrolSorusu: "Teknik raporda yasaklı kusur oranları (%100 kusur vb.) bulunuyor mu?",
    agirlikPuan: 12,
    otomatikKontrolKey: "hmk_kusur_yok_mu",
  },
  {
    id: "check_3_veteriner_otopsi",
    siraNo: 3,
    baslik: "Veteriner Hekim Otopsi / Nekropsi Raporuna Dayanma Zorunluluğu",
    hukukiDayanak: "Yargıtay 3. HD 2022/894 E. 'Ölüm Sebebi Veteriner Otopsisiyle İspatlanmalıdır'",
    aciklama:
      "Elektrik çarpması, zehirlenme, şap, enfeksiyon gibi ölüm sebeplerinde resmi veteriner nekropsi raporu olmadan afaki illiyet kurulamaz.",
    kontrolSorusu: "Ölüm nedenine dair resmi veteriner hekim raporu ve illiyet bağı belgelenmiş mi?",
    agirlikPuan: 10,
    otomatikKontrolKey: "veteriner_raporu_var_mi",
  },
  {
    id: "check_4_resmi_borsa_rayici",
    siraNo: 4,
    baslik: "Ticaret Borsası & UKON / USK Resmi Fiyat Esası",
    hukukiDayanak: "Yargıtay 3. HD 2020/5541 E. 'Mahalli Borsa ve İlçe Tarım Rayiçleri Esas Alınmalıdır'",
    aciklama:
      "Hayvan canlı ve karkas kg fiyatları serbest piyasa dedikodusuyla değil; olay tarihindeki resmi Ticaret Borsası bülteninden alınmalıdır.",
    kontrolSorusu: "Birim kg ve süt fiyatları resmi borsa bülteni veya Tarım Müdürlüğü cetveline dayandırıldı mı?",
    agirlikPuan: 10,
    otomatikKontrolKey: "resmi_rayic_var_mi",
  },
  {
    id: "check_5_tbk55_hurda_mahsubu",
    siraNo: 5,
    baslik: "TBK m. 52/55 Hurda (Kurtarma) Et/Deri Mahsubu (1 Numaralı Bozma Sebebi)",
    hukukiDayanak: "TBK m. 52 ve 55 Denkleştirme İlkesi; Yargıtay HGK 2019/3-412 E.",
    aciklama:
      "Zorunlu kesime sevk edilen veya murdar olmadan değerlendirilen hayvanların et ve deri kurtarma bedeli brüt zarardan kesinlikle tenzil edilmelidir.",
    kontrolSorusu: "Acil kesim veya paraya çevrilme durumunda hurda (kurtarma) bedeli mahsup edildi mi?",
    agirlikPuan: 12,
    otomatikKontrolKey: "hurda_mahsubu_tam_mi",
  },
  {
    id: "check_6_yoksun_kalinan_kar",
    siraNo: 6,
    baslik: "Yoksun Kalınan Kârda (Süt/Buzağı) Masrafların Arındırılması",
    hukukiDayanak: "TBK m. 114; Yargıtay 3. HD 2021/1190 E. 'Net Kâr Esastır, Brüt Gelir Hükmedilemez'",
    aciklama:
      "Süt ve buzağı kaybında brüt hasılat değil; yem, sağım, veteriner bakım masrafları düşüldükten sonraki NET KÂR esas alınmalıdır.",
    kontrolSorusu: "Yoksun kalınan süt geliri hesabında masraflar arındırılıp net kâr yazıldı mı?",
    agirlikPuan: 10,
    otomatikKontrolKey: "net_kar_kurali_uygun_mu",
  },
  {
    id: "check_7_tarsim_muafiyet",
    siraNo: 7,
    baslik: "TARSİM / Sigorta Poliçe Muafiyeti ve Özel Şartların Denetimi",
    hukukiDayanak: "5363 s.K. m. 12; TTK m. 1409 ve 1425",
    aciklama:
      "Sigorta davalarında poliçedeki tenzili muafiyet ve müşterek sigorta payı düşülmeden tam bedele hükmedilemez.",
    kontrolSorusu: "Sigorta uyuşmazlığında poliçe muafiyet oranı (%10-%20) hesaplamada tenzil edildi mi?",
    agirlikPuan: 8,
    otomatikKontrolKey: "sigorta_muafiyeti_incelendi_mi",
  },
  {
    id: "check_8_kesif_fotograflari",
    siraNo: 8,
    baslik: "Açıklamalı Keşif Fotoğrafları ve Ahır / Barınak Tespiti",
    hukukiDayanak: "HMK m. 288 ve 290 Keşif Zabtı Kuralları",
    aciklama:
      "Yargıtay, olay yeri fotoğrafı, kulak küpesi ve ahır tesisat görseli bulunmayan raporları 'yetersiz inceleme' sebebiyle bozmaktadır.",
    kontrolSorusu: "Rapora kulak küpesi, elektrik panosu veya ahır durumunu gösteren açıklamalı fotoğraflar eklendi mi?",
    agirlikPuan: 8,
    otomatikKontrolKey: "fotograf_ekli_mi",
  },
  {
    id: "check_9_heyet_gorev_dagilimi",
    siraNo: 9,
    baslik: "Heyet Kurulunda Zooteknist & Veteriner Görev Ayrımı",
    hukukiDayanak: "6754 sayılı Bilirkişilik Kanunu m. 3/3; HMK m. 267",
    aciklama:
      "Büyükbaş/küçükbaş telefat davalarında Ziraat Mühendisi (Zooteknist) verim ve rayiç hesabı yaparken, ölüm sebebini Veteriner Hekim belirlemelidir.",
    kontrolSorusu: "Bilirkişi kurulunda ziraat ve veteriner uzmanlık alanları açıkça belirtildi mi?",
    agirlikPuan: 8,
    otomatikKontrolKey: "heyet_uzmanligi_tam_mi",
  },
  {
    id: "check_10_faiz_tavsiyesi",
    siraNo: 10,
    baslik: "Doğru Faiz Türü (Yasal / Ticari Avans) ve Başlangıç Tarihi",
    hukukiDayanak: "3095 s.K. m. 1 ve 2; TTK m. 9; TBK m. 117",
    aciklama:
      "Haksız fiil telefatında olay tarihinden yasal faiz, mandıra süt tesliminde temerrüt tarihinden avans faizi tavsiye edilmelidir.",
    kontrolSorusu: "Uyuşmazlık türüne göre kanunen geçerli faiz türü ve başlangıç tarihi açıklandı mı?",
    agirlikPuan: 10,
    otomatikKontrolKey: "faiz_tavsiyesi_mevcut_mu",
  },
];

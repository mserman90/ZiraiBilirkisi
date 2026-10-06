import { KontrolKategori } from "../types";

export const RESMI_KONTROL_LISTESI: KontrolKategori[] = [
  {
    id: "gorevlendirme",
    asama: "1. Aşama",
    baslik: "Görevlendirme ve Kabul Safhası",
    aciklama: "Dosya teslim alınmadan ve göreve başlamadan önce yapılması gereken yasal incelemeler (6754 SK ve HMK).",
    maddeler: [
      {
        id: "g1",
        metin: "Görevlendirme konusu uzmanlık alanıma (01 Tarım - Ziraat Mühendisliği) uygun mudur?",
        mevzuat: "6754 SK m.3/1, HMK m.266",
        onem: "kritik",
        aciklama: "Uzmanlık alanı dışındaki konular (örneğin inşaat statiği, tapu kadastro sınır mülkiyeti) için derhal mahkemeye bildirim yapılmalıdır."
      },
      {
        id: "g2",
        metin: "Görevden çekinmeyi veya reddimi gerektirecek bir sebep (akrabalık, menfaat çatışması, husumet) var mı?",
        mevzuat: "HMK m.272, m.273, m.278",
        onem: "kritik",
        aciklama: "Taraflardan biriyle kan bağı veya hukuki uyuşmazlık bulunması halinde görev kabul edilemez."
      },
      {
        id: "g3",
        metin: "Mahkemece verilen süre yeterli midir? Ek süre talebi gerekiyor mu?",
        mevzuat: "HMK m.281, 6754 SK m.3/5",
        onem: "standart",
        aciklama: "Süre yetersizse süre dolmadan önce gerekçeli olarak ek süre talebinde bulunulmalıdır."
      },
      {
        id: "g4",
        metin: "Gider avansı ve keşif masrafları mahkeme veznesine yatırılmış mıdır?",
        mevzuat: "HMK m.324, 6754 SK m.12",
        onem: "standart",
        aciklama: "Masraflar yatırılmadan bizzat harcama yapılması veya taraflardan doğrudan ücret alınması yasaktır."
      }
    ]
  },
  {
    id: "kesif-inceleme",
    asama: "2. Aşama",
    baslik: "Dosya İnceleme & Keşif Safhası",
    aciklama: "Mahallinde yapılan inceleme, ölçüm ve delil toplama esnasında uyulması zorunlu usul kuralları.",
    maddeler: [
      {
        id: "k1",
        metin: "Keşif mahallinde her iki taraf da hazır bulundu mu veya usulüne uygun davet edildi mi?",
        mevzuat: "HMK m.279, m.280",
        onem: "kritik",
        aciklama: "Diğer taraf hazır olmaksızın taraflardan sadece birinin beyanı tek başına dinlenemez."
      },
      {
        id: "k2",
        metin: "Fen bilirkişisi ile birlikte kadastro paftası zemine sabit noktalardan aplike edilerek yer tespiti yapıldı mı?",
        mevzuat: "Ziraat Bilirkişi Rehberi s.50-51, HMK m.280",
        onem: "kritik",
        aciklama: "Uyuşmazlık konusu parselin yerinde sınırları kesin olarak belirlenmeli ve krokisi tanzim edilmelidir."
      },
      {
        id: "k3",
        metin: "Toprak yapısı, eğim (klizimetre/düzeç ile), taban suyu ve drenaj durumu yerinde incelendi mi?",
        mevzuat: "ZMO Bilirkişi Rehberi s.53-60",
        onem: "standart",
        aciklama: "Toprak derinliği, verim kabiliyeti ve toprak sınıfı (1-5. sınıf) gözlem çukurlarıyla tespit edilmelidir."
      },
      {
        id: "k4",
        metin: "Taşınmazın fotoğrafları değişik yönlerden çekilerek tutanağa ve dosya arasına eklendi mi?",
        mevzuat: "Adalet Bakanlığı Rehber İlkeler Standart 4",
        onem: "standart",
        aciklama: "Parselin genel görünümü, üzerindeki ürünler veya hasarlar tarihli ve renkli fotoğraflarla belgelenmelidir."
      },
      {
        id: "k5",
        metin: "Mera, orman veya kadastro uyuşmazlıklarında en az 3 farklı döneme ait (15-20-25 yıl) stereoskopik hava fotoğrafı istendi mi?",
        mevzuat: "Yargıtay 16. HD 2014/15312 E.",
        onem: "kritik",
        aciklama: "Tek bir hava fotoğrafı ile zilyetlik tespiti yapılamaz; stereoskopla 3 boyutlu inceleme zorunludur."
      }
    ]
  },
  {
    id: "rapor-yazim",
    asama: "3. Aşama",
    baslik: "Rapor Tanzim ve İçerik Standartları",
    aciklama: "Raporun dili, sistematik yapısı, bilimsel hesaplamaları ve hukuki sınırları (Bakanlık Standart Formu).",
    maddeler: [
      {
        id: "r1",
        metin: "Raporda 'kusurlu', 'haksız fiil', 'mülkiyet davacıya aittir' gibi hukuki nitelendirme içeren ifadelerden kaçınıldı mı?",
        mevzuat: "6754 SK m.3/2, HMK m.266",
        onem: "kritik",
        aciklama: "Bilirkişi hâkimin yerine geçip hukuki kanaat bildiremez; yalnızca teknik tespit dili kullanmalıdır."
      },
      {
        id: "r2",
        metin: "Hesaplama yöntemi açıklandı mı? (Gelir kapitalizasyonu, pazar değeri mukayesesi, maliyet metodu)",
        mevzuat: "2942 SK m.11, ZMO Rehberi s.22-47",
        onem: "kritik",
        aciklama: "KFO seçimi (sulu %4, kuru %5), brüt hasılat, üretim masrafları ve net gelir cetveli adım adım gösterilmelidir."
      },
      {
        id: "r3",
        metin: "Veri kaynakları resmi belgelere (İlçe Tarım cetvelleri, TARSİM, TÜİK Tarım-ÜFE, Borsa fiyatları) dayandırıldı mı?",
        mevzuat: "Yargıtay 5. HD 2021/1452 E.",
        onem: "kritik",
        aciklama: "Soyut rakamlar geçersizdir; ilgili kurumun resmi yazı tarihi ve sayı numarası belirtilmelidir."
      },
      {
        id: "r4",
        metin: "Mahkemenin sorduğu tüm sorular tek tek ve anlaşılır bir dille cevaplandırıldı mı?",
        mevzuat: "HMK m.281, Bakanlık Rapor Standardı",
        onem: "standart",
        aciklama: "Mahkemenin görevlendirme ara kararında yönelttiği hususların hiçbirisi yanıtsız bırakılmamalıdır."
      },
      {
        id: "r5",
        metin: "Tarafların iddia ve itirazları teknik açıdan değerlendirildi mi?",
        mevzuat: "ZMO Rehberi s.71-76",
        onem: "standart",
        aciklama: "Tarafların sunduğu emsal veya hasar iddiaları bilimsel verilerle tartışılmalı ve gerekçelendirilmelidir."
      }
    ]
  },
  {
    id: "teslim-imza",
    asama: "4. Aşama",
    baslik: "Nihai İnceleme, İmza ve Teslim Safhası",
    aciklama: "Raporun mahkemeye ve UYAP'a sunulmadan önceki biçimsel ve imza kontrolleri.",
    maddeler: [
      {
        id: "t1",
        metin: "Rapor sayfaları numaralandırıldı mı ve heyet üyelerinin tamamı tarafından paraflanıp imzalandı mı?",
        mevzuat: "HMK m.281, Bakanlık Rapor Standardı",
        onem: "kritik",
        aciklama: "Kurul halinde çalışan bilirkişilerde muhalif üye varsa muhalefet şerhi ve gerekçesi rapora dercedilmelidir."
      },
      {
        id: "t2",
        metin: "Rapor ekleri (kroki, hava fotoğrafları, maliyet cetvelleri, fotoğraflar) eksiksiz olarak eklendi mi?",
        mevzuat: "Adalet Bakanlığı Rapor Standartları",
        onem: "standart",
        aciklama: "Eklerin listesi rapor metninin sonunda tek tek numaralandırılarak belirtilmelidir."
      },
      {
        id: "t3",
        metin: "Rapor süresi içinde fiziki olarak mahkeme kalemine ve/veya UYAP Bilirkişi Portalı üzerinden e-imza ile sunuldu mu?",
        mevzuat: "HMK m.282, 6754 SK m.11",
        onem: "kritik",
        aciklama: "Süresi geçirilen raporlar için disiplin ve liste silinme yaptırımları uygulanabilmektedir."
      }
    ]
  }
];

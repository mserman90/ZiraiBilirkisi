import { CaprazRow, IlkeMadde } from "../types";

export const RESMI_ILKELER_STANDARTLAR: IlkeMadde[] = [
  {
    id: "hukuki-nitelendirme",
    baslik: "Hukuki Değerlendirme ve Nitelendirme Yasağı",
    kaynak: "6754 Sayılı Bilirkişilik Kanunu m.3/2-3, HMK m.266 & m.279",
    ozet: "Bilirkişi raporunda hukuki nitelendirme ve değerlendirmelerde bulunamaz. Hâkimlik mesleğinin gerektirdiği hukuki bilgiyle çözümlenebilecek konularda bilirkişiye başvurulamaz ve görüş bildirilemez.",
    detay: "Bilirkişi yalnızca çözümü uzmanlığı, özel veya teknik bilgiyi gerektiren konularda görüş bildirir. Kusur oranı, mülkiyetin kime ait olduğu, hak düşürücü sürenin dolup dolmadığı, zilyetliğin malik sıfatıyla sürdürülüp sürdürülmediği gibi hukuki terimler rapor sonucunda kesin hüküm gibi yazılamaz.",
    kontrolListesi: [
      "Raporda 'kusurludur', 'haksız fiil işlemiştir', 'suçtur' gibi ceza/hukuk terimleri var mı?",
      "Mülkiyet aidiyeti konusunda kesin yargı bildirildi mi? (Sadece 'fiili kullanım durumu' yazılmalı)",
      "Zaman aşımı veya hak düşürücü süre hesaplaması hâkime bırakıldı mı?",
      "Teknik veri ve gözlemler objektif ölçüm ve cetvellere dayandırıldı mı?"
    ],
    ornekIhlal: "“Davalı haksız ve kusurlu olarak komşu parsele tecavüz etmiş olup mülkiyet hakkını ihlal etmiştir.”",
    dogruUygulama: "“Fen bilirkişisinin krokisinde (A) harfi ile gösterilen 210 m² alanda davalının buğday ekimi yaptığı ve fiilen kullandığı teknik olarak tespit edilmiştir.”"
  },
  {
    id: "hava-fotograflari-kurali",
    baslik: "Hava Fotoğrafları ve Stereoskopik İnceleme Standardı (15-20-25 Yıl Kuralı)",
    kaynak: "Yargıtay 16. HD 2014/15312 E., 2017/4943 K. & Ziraat Bilirkişi Rehberi s.86",
    ozet: "Arazinin kadim niteliği, zilyetlik başlangıcı ve imar-ihyanın tamamlandığı tarih en az 3 farklı tarihe ait (15, 20 ve 25 yıl öncesi) stereoskopik hava fotoğrafları ile kanıtlanmalıdır.",
    detay: "Harita Genel Komutanlığı'ndan getirtilen stereoskopik çift hava fotoğrafları, jeodezi/fotogrametri uzmanı harita mühendisi ve ziraat mühendisi kurulu tarafından stereoskop aletiyle üç boyutlu incelenmeli; kadastro paftası ölçeği ile eşitlenerek çakıştırılmalıdır. Tek bir yıla ait fotoğraf hükme esas alınamaz.",
    kontrolListesi: [
      "En az 3 farklı döneme ait (15, 20 ve 25 yıl geriye) hava fotoğrafı incelendi mi?",
      "Stereoskop aletiyle 3 boyutlu ve çiftli bindirmeli fotoğraflar analiz edildi mi?",
      "Kadastro paftası ile hava fotoğrafı bilgisayar destekli örtüştürüldü mü?",
      "Fotoğrafta taşlık, kayalık, çalılık veya sürülü alan ayrımı net olarak gösterildi mi?"
    ],
    ornekIhlal: "Yalnızca 1984 tarihli tek bir hava fotoğrafı üzerinden inceleme yapılarak zilyetlik süresinin kabul edilmesi (Bozma nedeni).",
    dogruUygulama: "1985, 1995 ve 2005 yıllarına ait üç farklı stereoskopik hava fotoğrafı taranarak taşınmazın tarımsal niteliğinin başlangıç ve bitiş tarihlerinin krokide renklerle işaretlenmesi."
  },
  {
    id: "zilyetlik-alan-siniri",
    baslik: "Belgesiz Zilyetlikle İktisap Sınırı (Sulu 40 da, Kuru 100 da)",
    kaynak: "3402 Sayılı Kadastro Kanunu m.14 & 5403 Sayılı Kanun m.3/j",
    ozet: "Belgesiz zilyetlik yoluyla kazanılabilecek azami miktar aynı çalışma alanı içinde sulu toprakta 40 dönüm, kuru toprakta 100 dönüm ile sınırlıdır.",
    detay: "Zirai bilirkişi, dava konusu taşınmazın 5403 sayılı Kanunun 3/j maddesi uyarınca sulu tarım arazisi mi yoksa kuru tarım arazisi mi olduğunu kesin olarak tespit etmelidir. Sulu arazide 40 dönümü, kuru arazide 100 dönümü aşan kısımlar Hazine adına tescil edilmelidir.",
    kontrolListesi: [
      "Taşınmazın sulu/kuru ayrımı 5403 SK kriterlerine göre somut su kaynağı belirtilerek yapıldı mı?",
      "Zilyedin aynı çalışma alanındaki toplam edinim miktarı kontrol edildi mi?",
      "Sulu arazide 40 dekar, kuru arazide 100 dekar tavanı gözetildi mi?",
      "Taşınmazın bir kısmı sulu bir kısmı kuru ise her bölümün alanı ayrı hesaplandı mı?"
    ],
    ornekIhlal: "Sulu nitelikteki 65 dekarlık arazinin tamamının belgesiz zilyetlikle davacı adına tesciline onay verilmesi.",
    dogruUygulama: "Taşınmazın sulu tarım arazisi olduğu ve 40 dekarlık kısmının iktisap edilebileceği, bakiye 25 dekarlık kısmın sınır aşıldığı için Hazine uhdesinde kalması gerektiği teknik tespiti."
  },
  {
    id: "arsa-tarla-ayrimi",
    baslik: "Arsa ve Arazi (Tarla) Ayrımı Ölçütleri",
    kaynak: "Bakanlar Kurulu 1983/6122, Yargıtay İBBK 1983/3 E., 1983/4 K. & 1998/1 K.",
    ozet: "Taşınmazın belediye mücavir alanında bulunması veya belediye hizmetlerinden faydalanması tek başına arsa vasfı kazandırmaz. Uygulamalı imar planı ve iskân sahası şarttır.",
    detay: "İmar planında yer almayan bir taşınmazın arsa sayılabilmesi için değerlendirme tarihi itibariyle belediye sınırları içinde olmakla birlikte etrafının meskûn olması, belediye hizmetlerinden (yol, su, elektrik, çöp, kanalizasyon) fiilen yararlanması gerekir. Aksi halde tarla kabul edilip gelir kapitalizasyonu yöntemiyle değerlenir.",
    kontrolListesi: [
      "1/1000 ölçekli uygulama imar planı içinde mi, nazım imar planında mı?",
      "Parselin kadastro parseli mi yoksa imar parseli mi olduğu belirtildi mi?",
      "İmar parseli ise emsal kıyaslamasında %40 civarı DOP (Düzenleme Ortaklık Payı) hesabı yapıldı mı?",
      "Tarla vasfında ise resmi İlçe Tarım cetveli gelir metoduna göre KFO uygulandı mı?"
    ],
    ornekIhlal: "İmar planı bulunmayan ancak belediye mücavir alanındaki tarım arazisine emsal arsa satışı kıyaslamasıyla değer biçilmesi.",
    dogruUygulama: "Taşınmazın 1/1000'lik imar planı dışında kaldığı ve tarımsal faaliyetin sürdüğü tespit edilerek Gelir Kapitalizasyonu Yöntemiyle (KFO %4/5) değer tespiti yapılması."
  },
  {
    id: "kesif-ve-tarafsizlik",
    baslik: "Keşif Yeri Tespiti ve Taraf Eşitliği İlkesi",
    kaynak: "HMK m.279, m.280, m.281 & ZMO Bilirkişi Rehberi s.20-21",
    ozet: "Bilirkişi keşif mahallinde taraflardan sadece birini tek başına dinleyemez, iki taraf hazır bulunmaksızın tek taraflı bilgi alamaz. Tarafsızlık zedelenemez.",
    detay: "Keşif esnasında fen bilirkişisi paftayı zemine aplike ederek yer tespitini şüpheye yer bırakmayacak şekilde yapmalıdır. Ziraat bilirkişisi ölçüm aletleriyle (şerit metre, klizimetre, toprak burgusu) fiili durumu tutanağa bağlamalıdır.",
    kontrolListesi: [
      "Fen bilirkişisi paftayı zemine sabit noktalardan aplike etti mi?",
      "Her iki tarafın iddia ve savunmaları zapta ve keşfe eşit yansıtıldı mı?",
      "Gözlem çukurları ve toprak numuneleri taşınmaz başında usulünce alındı mı?",
      "Rapor hâkimin tayin ettiği yasal süre içinde mahkeme kalemine teslim edildi mi?"
    ],
    ornekIhlal: "Keşif sırasında davalı taraf hazır bulunmaksızın sadece davacının gösterdiği sınırlara göre rapor düzenlenmesi.",
    dogruUygulama: "Mahkeme heyeti, fen bilirkişisi ve her iki taraf huzurunda sınırların gezilerek paftaya uygunluğunun ortak tutanağa bağlanması."
  },
  {
    id: "irtifak-ve-deger-dusuklugu",
    baslik: "İrtifak Hakkı ve Enerji Nakil Hattı Değer Düşüklüğü Standardı",
    kaynak: "2942 SK m.11-12 & TMMOB İrtifak Değerleme Kurs Standartları",
    ozet: "İrtifak hakkı tesisinde kamulaştırma bedeli, irtifak alanı (İHY) ve taşınmazın tamamı (T) arasındaki oran ile değer düşüklüğü oranı (DDO) üzerinden hesaplanır.",
    detay: "Tel altı irtifak sahasında tarımsal faaliyetin devam edip edemeyeceği, yüksek boylu meyve ağaçlarına engel olup olmadığı incelenir. DDO formülü: (İHY x %50 veya %35) / Toplam Alan formülü ile bulunur ve direk yeri mülkiyet kamulaştırması ayrıca eklenir.",
    kontrolListesi: [
      "Direk dikilen alanın mülkiyeti tam kamulaştırma olarak ayrıldı mı?",
      "Tel geçiş sahasındaki irtifak genişliği (örn: 12-15 metre) krokiyle tespit edildi mi?",
      "Değer düşüklüğü oranı (DDO) matematiksel formülle gerekçelendirildi mi?",
      "İrtifakın tarımsal gelire olan somut etkisi açıklandı mı?"
    ],
    ornekIhlal: "Taşınmaz üzerinden geçen hat için soyut olarak '%10 değer kaybı takdir edilmiştir' denilerek formülsüz rakam yazılması.",
    dogruUygulama: "DDO = (İrtifak Alanı 305 m² x %50) / Toplam Alan 3.500 m² = %4,35 oranında değer düşüklüğü hesabı ve direk yeri zemin bedelinin ayrıca eklenmesi."
  }
];

export const UFE_RATES: Record<number, number> = {
  2022: 151.0,
  2023: 72.5,
  2024: 65.0,
  2025: 45.0,
  2026: 30.0,
};

export const ICTIHAT_DB = [
  {
    daire: "Yargıtay 5. Hukuk Dairesi",
    esas: "2021/1452 E., 2021/6899 K.",
    tarih: "12.05.2021",
    tag: "Kamulaştırma",
    konu: "Kamulaştırma, Sulu Tarım, KFO",
    metin: "Dava konusu taşınmazın sulu tarım arazisi niteliğinde olduğu anlaşıldığından, taşınmazın değeri belirlenirken gelir kapitalizasyonu yöntemine göre kapitalizasyon faiz oranının (KFO) %4 olarak alınması Yargıtay'ın yerleşik içtihatları gereğidir.",
  },
  {
    daire: "Yargıtay İçtihadı Birleştirme Kurulu",
    esas: "1983/3 E., 1983/4 K.",
    tarih: "28.02.1983",
    tag: "Arsa-Tarla Ayrımı",
    konu: "Arsa ve Arazi (Tarla) Ayrımı, Mücavir Alan",
    metin: "Bir taşınmazın belediye mücavir alan sınırları içerisinde kalması veya hizmetlerden faydalanması onun tek başına 'arsa' vasfında olduğunu göstermez. İmar planı kapsamına alınmış olması şarttır. Aksi halde tarımsal gelirine göre tescillenir.",
  },
  {
    daire: "Yargıtay 11. Hukuk Dairesi",
    esas: "2019/3314 E., 2020/5120 K.",
    tarih: "05.11.2020",
    tag: "TARSİM",
    konu: "TARSİM, Don Hasarı, Eksper Raporu",
    metin: "TARSİM sigorta poliçesi kapsamında meydana gelen don hasarında, eksperin düzenlediği tespit raporu kesin delil değildir. Mahkemece atanan ziraat mühendisi bilirkişi heyeti raporunun üstün tutulması hukuka uygundur.",
  },
  {
    daire: "Yargıtay 3. Hukuk Dairesi",
    esas: "2018/6541 E., 2019/1205 K.",
    tarih: "14.02.2019",
    tag: "Ecrimisil",
    konu: "Ecrimisil, ÜFE Endeksleme",
    metin: "Tarımsal arazilerde ecrimisil hesaplanırken, tahliye tarihinden geriye hesaplanacak ilk dönemin net geliri baz alınır. Takip eden yıllar için ilk bedele TÜİK Tarım-ÜFE oranları kademeli olarak eklenerek hesaplama yapılmalıdır.",
  },
];

export const DATA_DB: Record<string, { urun: string; verim: number; fiyat: number; masraf: number }[]> = {
  Edirne_2024: [
    { urun: "Buğday", verim: 450, fiyat: 9.5, masraf: 2100 },
    { urun: "Ayçiçeği", verim: 220, fiyat: 15.0, masraf: 1800 },
    { urun: "Kanola", verim: 310, fiyat: 13.2, masraf: 1950 },
  ],
  Edirne_2025: [
    { urun: "Buğday", verim: 480, fiyat: 12.0, masraf: 3000 },
    { urun: "Ayçiçeği", verim: 210, fiyat: 18.5, masraf: 2600 },
    { urun: "Mısır", verim: 1050, fiyat: 8.8, masraf: 4200 },
  ],
  Konya_2025: [
    { urun: "Buğday (Kuru)", verim: 280, fiyat: 11.5, masraf: 1800 },
    { urun: "Şeker Pancarı", verim: 7500, fiyat: 2.2, masraf: 8500 },
    { urun: "Arpa", verim: 320, fiyat: 9.8, masraf: 1650 },
  ],
  Adana_2025: [
    { urun: "Mısır (1. Ürün)", verim: 1200, fiyat: 8.5, masraf: 4500 },
    { urun: "Pamuk", verim: 450, fiyat: 25.0, masraf: 6000 },
    { urun: "Buğday", verim: 520, fiyat: 10.2, masraf: 2800 },
  ],
  Konya_2024: [
    { urun: "Buğday (Sulu)", verim: 620, fiyat: 10.0, masraf: 3400 },
    { urun: "Patates", verim: 4200, fiyat: 4.5, masraf: 9800 },
  ],
  Adana_2024: [
    { urun: "Mısır", verim: 1100, fiyat: 7.2, masraf: 3800 },
    { urun: "Pamuk", verim: 400, fiyat: 21.0, masraf: 5200 },
  ],
};

export const CAPRAZ_ILCE_LIST = [
  "Edirne Merkez",
  "Keşan",
  "Uzunköprü",
  "Konya Selçuklu",
  "Meram",
  "Karatay",
  "Adana Seyhan",
  "Çukurova",
  "Yüreğir",
] as const;

export const CAPRAZ_DB: Record<string, CaprazRow> = {
  "Edirne Merkez_2024_Buğday": { verim: 450, fiyat: 9.5, masraf: 2100, kaynak: "Edirne İlçe Tarım 2024 Maliyet Cetveli No: 2024/12" },
  "Edirne Merkez_2025_Buğday": { verim: 480, fiyat: 12.0, masraf: 3000, kaynak: "Edirne İlçe Tarım 2025/04 - Kesinleşmiş" },
  "Edirne Merkez_2023_Buğday": { verim: 420, fiyat: 7.8, masraf: 1750, kaynak: "Edirne İlçe Tarım 2023/11" },
  "Edirne Merkez_2024_Ayçiçeği": { verim: 220, fiyat: 15.0, masraf: 1800, kaynak: "Edirne İlçe Tarım 2024/12" },
  "Edirne Merkez_2025_Ayçiçeği": { verim: 210, fiyat: 18.5, masraf: 2600, kaynak: "Edirne İlçe Tarım 2025/04" },
  "Edirne Merkez_2024_Arpa": { verim: 380, fiyat: 8.2, masraf: 1650, kaynak: "Edirne İlçe Tarım 2024/12" },
  "Edirne Merkez_2025_Mısır": { verim: 1050, fiyat: 8.8, masraf: 4200, kaynak: "Edirne İlçe Tarım 2025/04" },
  "Keşan_2024_Buğday": { verim: 430, fiyat: 9.3, masraf: 2050, kaynak: "Keşan İlçe Tarım 2024/10" },
  "Keşan_2025_Buğday": { verim: 460, fiyat: 11.8, masraf: 2850, kaynak: "Keşan İlçe Tarım 2025/03" },
  "Keşan_2023_Buğday": { verim: 400, fiyat: 7.5, masraf: 1680, kaynak: "Keşan İlçe Tarım 2023/09" },
  "Keşan_2024_Ayçiçeği": { verim: 240, fiyat: 14.8, masraf: 1750, kaynak: "Keşan İlçe Tarım 2024/10" },
  "Keşan_2025_Ayçiçeği": { verim: 235, fiyat: 18.0, masraf: 2500, kaynak: "Keşan İlçe Tarım 2025/03" },
  "Uzunköprü_2024_Buğday": { verim: 445, fiyat: 9.4, masraf: 2080, kaynak: "Uzunköprü İlçe Tarım 2024/11" },
  "Uzunköprü_2025_Buğday": { verim: 470, fiyat: 11.9, masraf: 2950, kaynak: "Uzunköprü İlçe Tarım 2025/04" },
  "Uzunköprü_2024_Arpa": { verim: 360, fiyat: 8.0, masraf: 1600, kaynak: "Uzunköprü İlçe Tarım 2024/11" },
  "Konya Selçuklu_2024_Buğday": { verim: 260, fiyat: 10.2, masraf: 1650, kaynak: "Selçuklu İlçe Tarım 2024/08 Kuru Şartlar" },
  "Konya Selçuklu_2025_Buğday": { verim: 280, fiyat: 11.5, masraf: 1800, kaynak: "Selçuklu İlçe Tarım 2025/02 - Kuru Tarım" },
  "Konya Selçuklu_2023_Buğday": { verim: 240, fiyat: 9.0, masraf: 1450, kaynak: "Selçuklu İlçe Tarım 2023/07" },
  "Konya Selçuklu_2025_Arpa": { verim: 320, fiyat: 9.8, masraf: 1650, kaynak: "Selçuklu İlçe Tarım 2025/02" },
  "Konya Selçuklu_2025_Şeker Pancarı": { verim: 7500, fiyat: 2.2, masraf: 8500, kaynak: "Selçuklu İlçe Tarım 2025/02 Sulu" },
  "Konya Selçuklu_2024_Şeker Pancarı": { verim: 6800, fiyat: 1.9, masraf: 7200, kaynak: "Selçuklu İlçe Tarım 2024/08" },
  "Meram_2024_Buğday": { verim: 270, fiyat: 10.0, masraf: 1700, kaynak: "Meram İlçe Tarım 2024/08" },
  "Meram_2025_Buğday": { verim: 290, fiyat: 11.3, masraf: 1850, kaynak: "Meram İlçe Tarım 2025/02" },
  "Meram_2025_Mısır": { verim: 1150, fiyat: 8.2, masraf: 4100, kaynak: "Meram İlçe Tarım 2025/02 Sulu" },
  "Karatay_2024_Buğday": { verim: 250, fiyat: 10.1, masraf: 1620, kaynak: "Karatay İlçe Tarım 2024/08 Kuru" },
  "Karatay_2025_Buğday": { verim: 265, fiyat: 11.4, masraf: 1780, kaynak: "Karatay İlçe Tarım 2025/02" },
  "Karatay_2025_Arpa": { verim: 300, fiyat: 9.6, masraf: 1600, kaynak: "Karatay İlçe Tarım 2025/02" },
  "Adana Seyhan_2024_Buğday": { verim: 500, fiyat: 9.8, masraf: 2600, kaynak: "Seyhan İlçe Tarım 2024/06" },
  "Adana Seyhan_2025_Buğday": { verim: 520, fiyat: 10.2, masraf: 2800, kaynak: "Seyhan İlçe Tarım 2025/01" },
  "Adana Seyhan_2024_Mısır": { verim: 1100, fiyat: 7.2, masraf: 3800, kaynak: "Seyhan İlçe Tarım 2024/06" },
  "Adana Seyhan_2025_Mısır": { verim: 1200, fiyat: 8.5, masraf: 4500, kaynak: "Seyhan İlçe Tarım 2025/01 - 1.Ürün Sulu" },
  "Adana Seyhan_2024_Pamuk": { verim: 400, fiyat: 21.0, masraf: 5200, kaynak: "Seyhan İlçe Tarım 2024/06" },
  "Adana Seyhan_2025_Pamuk": { verim: 450, fiyat: 25.0, masraf: 6000, kaynak: "Seyhan İlçe Tarım 2025/01" },
  "Çukurova_2024_Buğday": { verim: 510, fiyat: 9.9, masraf: 2650, kaynak: "Çukurova İlçe Tarım 2024/06" },
  "Çukurova_2025_Buğday": { verim: 535, fiyat: 10.4, masraf: 2850, kaynak: "Çukurova İlçe Tarım 2025/01" },
  "Çukurova_2025_Pamuk": { verim: 470, fiyat: 24.5, masraf: 6100, kaynak: "Çukurova İlçe Tarım 2025/01" },
  "Çukurova_2024_Mısır": { verim: 1150, fiyat: 7.4, masraf: 3900, kaynak: "Çukurova İlçe Tarım 2024/06" },
  "Yüreğir_2024_Mısır": { verim: 1080, fiyat: 7.1, masraf: 3750, kaynak: "Yüreğir İlçe Tarım 2024/05" },
  "Yüreğir_2025_Mısır": { verim: 1180, fiyat: 8.3, masraf: 4400, kaynak: "Yüreğir İlçe Tarım 2025/01" },
  "Yüreğir_2025_Buğday": { verim: 515, fiyat: 10.1, masraf: 2750, kaynak: "Yüreğir İlçe Tarım 2025/01" },
  "Yüreğir_2024_Pamuk": { verim: 390, fiyat: 20.5, masraf: 5100, kaynak: "Yüreğir İlçe Tarım 2024/05" },
};

export const AI_QUICK_PROMPTS = [
  "Sulu arazide KFO kaç olmalı?",
  "HMK 279'a göre kusur yazabilir miyim?",
  "Ecrimisil hesabında hangi ÜFE?",
  "TARSİM'de bilirkişi mi üstün?",
  "Zeytin ağacı amortismanı nasıl?",
  "Arsa-tarla ayrımı kriteri nedir?",
];

export const AI_KNOWLEDGE: { keys: string[]; answer: string; badge: string }[] = [
  {
    keys: ["kfo", "kapitalizasyon", "sulu", "%4", "%5"],
    badge: "2942 SK md.11 • 5.HD",
    answer:
      "**Kapitalizasyon Faiz Oranı (KFO)** Yargıtay 5. Hukuk Dairesi yerleşik içtihadına göre net ve sabittir:\n\n• **Sulu tarım arazisi** → **%4** (0.04)\n• **Kuru tarım arazisi / susuz** → **%5** (0.05)\n• Meyve bahçesi (suluda) → %5 kabul edilebilir ama bilirkişi sulu niteliği ispatlamalı.\n\nHesap: `Çıplak Değer = Yıllık Net Gelir / KFO` → Üzerine **Objektif Değer Artışı (ODA)** eklenir. ODA için mahalle/konum rantı somutlaştırılmalı, soyut %20 yazma.",
  },
  {
    keys: ["hmk 279", "hmk279", "kusur", "hukuki", "mülkiyet", "yasak"],
    badge: "HMK 279 • HUKUKİ AŞIM",
    answer:
      "**HMK 279 kesinlikle yasaklıyor:** Bilirkişi **hukuki değerlendirme yapamaz.**\n\n❌ Yazılamaz: \"kusurlu\", \"kusur\", \"mülkiyet davacıya aittir\", \"haksız fiil\", \"suç\", \"kasıt\", \"aidiyet\", \"zilyetlik\"\n\n✅ Yazılır: Teknik tespit dili kullanın.\n• \"Kusurludur\" → \"Teknik talimatta dekara 500 gr önerilirken 1000 gr uygulanmış, doz aşımı tespit edilmiştir.\"\n• \"Mülkiyet davacıya aittir\" → \"Parsel üzerinde fiili kullanım ve ürün hasadı davacı tarafından yapılmaktadır.\"\n\nTarayıcım bu kelimeleri otomatik işaretliyor. \"AI ile Düzelt\" ile HMK-safe hale getirebilirsin.",
  },
  {
    keys: ["ecrimisil", "üfe", "ufe", "tahliye", "endeks"],
    badge: "3.HD • TÜİK Tarım-ÜFE",
    answer:
      "**Ecrimisil hesap kuralı (Yargıtay 3.HD 2019/1205):**\n\n1. İlk yıl (işgalin ilk yılı) için **TÜİK verim/fiyat/masraf cetvelinden net gelir** baz alınır. İlk yıl için ÜFE YOK.\n2. Sonraki her yıl: Önceki yılın bedeli × (1 + Önceki yılın Tarım-ÜFE /100)\n3. TÜİK oranları **kademeli** uygulanır, doğrudan 2024 ÜFE'si 2022'ye eklenmez.\n\nÖrnek: 2022 baz 50.000 TL, 2022 ÜFE %151 ise 2023 = 50.000×2.51 = 125.500 TL. Sihirbazım bunu otomatik yapıyor.",
  },
  {
    keys: ["tarsim", "don", "eksper", "sigorta", "kesin delil"],
    badge: "11.HD • TARSİM",
    answer:
      "**TARSİM don hasarı (Yargıtay 11.HD 2020/5120):** Eksper raporu **kesin delil DEĞİLDİR.**\n\n• Sigorta eksperi %80 hasar dedi diye bağlayıcı değil.\n• Mahkemece atanan **ziraat mühendisi bilirkişi heyeti raporu üstündür.**\n• Bilirkişi: Fenolojik dönem (çiçeklenme), meteoroloji verisi, parselde fiili sayım, komşu parsellerle karşılaştırma yapmalı.\n• Don hasarı % hesabı: zarar gören tomurcuk / toplam tomurcuk ×100",
  },
  {
    keys: ["amortisman", "ağaç", "zeytin", "elma", "şeftali", "ömür"],
    badge: "Ağaç Değerleme",
    answer:
      "**Meyveli ağaç amortismanı:**\n\n• Baz Değer = Yıllık Net Gelir / KFO (%5)\n• Ekonomik ömürler: **Zeytin 100 yıl, Elma 40 yıl, Şeftali 25 yıl, Ceviz 60 yıl**\n• Yıpranma = Baz × (Yaş / Ömür) — %90'da tavan.\n• Net = Baz - Yıpranma\n\nÖnemli: Çok yaşlı ağaçta kalan ömür hesabı ve bakım maliyeti düşülmeli. Genç fidanlarda henüz verimde değilse yatırım maliyeti yöntemi.",
  },
  {
    keys: ["arsa", "tarla", "mücavir", "imar", "İBBK"],
    badge: "İBBK 1983/4",
    answer:
      "**Arsa-Tarla ayrımı (İçtihadı Birleştirme 1983/4):**\n\n• Mücavir alanda olmak tek başına **arsa yapmaz.**\n• Belediye hizmetlerinden faydalanmak da yetmez.\n• **İmar planı içinde ve fiilen imar uygulaması görmüş** olmalı + tarımsal kullanım sona ermeli.\n• İmar planı yoksa → **Tarla vasfında**, gelir metoduyla değerlenir. Belediye vergisi arsa olsa da tarım bilirkişisi tarla kabul eder.",
  },
  {
    keys: ["hava fotoğrafı", "stereoskop", "15 20 25", "üç tarih", "harita genel"],
    badge: "Yargıtay 16.HD • Hava Fotoğrafı Kuralı",
    answer:
      "**Hava Fotoğrafları ve Stereoskopik İnceleme Standardı (Yargıtay 16.HD):**\n\n1. Tespit tarihinden geriye doğru **en az 3 farklı tarihe ait (15, 20 ve 25 yıl)** stereoskopik çift hava fotoğrafı Harita Genel Komutanlığı'ndan getirtilmelidir.\n2. Jeodezi/Fotogrametri mühendisi ve ziraat mühendisi heyeti fotoğrafları **stereoskop aletiyle 3 boyutlu** incelemelidir.\n3. Tek bir yıla ait fotoğrafla zilyetlik veya imar-ihya başlangıcı kararına varılamaz (Yargıtay bozma nedenidir).\n4. Kadastro paftası bilgisayar ortamında hava fotoğrafı ölçeğiyle eşitlenip çakıştırılmalıdır.",
  },
  {
    keys: ["40 dönüm", "100 dönüm", "zilyetlik sınırı", "belgesiz", "3402"],
    badge: "3402 SK md.14 • Zilyetlik Tavanı",
    answer:
      "**Belgesiz Zilyetlikle Taşınmaz Edinme Tavanı (3402 SK m.14):**\n\n• Aynı çalışma alanı içerisinde belgesiz zilyetlikle:\n  - **Sulu toprakta en fazla 40 dönüm**,\n  - **Kuru toprakta en fazla 100 dönüm** iktisap edilebilir.\n• 5403 sayılı Toprak Koruma Kanunu m.3/j uyarınca sulu tarım tespiti yapılmışsa 40 dekarı aşan kısım Hazine adına tescil edilmelidir.",
  },
  {
    keys: ["irtifak formülü", "ddo", "enerji nakil", "tel altı", "direk"],
    badge: "2942 SK m.11 • İrtifak Değerleme",
    answer:
      "**İrtifak Hakkı & Tel Altı Zarar Hesabı:**\n\n• **DDO (Değer Düşüklüğü Oranı)** = (İrtifak Alanı × %50 veya %35) / Toplam Alan\n• İrtifak Bedeli = DDO × Toplam Alan × m² Rayiç Bedeli\n• Direk dikilen alan varsa, o alan için mülkiyet kamulaştırma bedeli tam olarak ayrıca eklenir.\n• Parselin kullanım bütünlüğünün bozulup bozulmadığı, tarım makinelerine engel teşkil edip etmediği raporda açıklanmalıdır.",
  },
];

export function getAIAnswer(input: string): { text: string; badge: string } {
  const lower = input.toLowerCase();
  let best = AI_KNOWLEDGE[0];
  let score = 0;
  AI_KNOWLEDGE.forEach((k) => {
    const s = k.keys.reduce((acc, kw) => acc + (lower.includes(kw.toLowerCase()) ? 1 : 0), 0);
    if (s > score) {
      score = s;
      best = k;
    }
  });
  if (score === 0) {
    return {
      badge: "01 Tarım Asistan",
      text:
        "01 Tarım Bilirkişiliği kapsamındayım. Sorunuzu şöyle netleştirin: **KFO, HMK 279, ecrimisil ÜFE, TARSİM, amortisman, arsa-tarla ayrımı** konularında uzmanım.\n\nÖrneğin: \"2024 Adana sulu buğday net geliri ne almalıyım?\" derseniz veri arşivini kontrol ederim. Rapor taslağınız varsa HMK Tarayıcıya yapıştırın, AI ile düzelteyim.",
    };
  }
  return { text: best.answer, badge: best.badge };
}

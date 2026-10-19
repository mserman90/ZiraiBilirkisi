# Bilirkişi Rapor Yazma Çalışma Masası

> **Ziraat Mühendisleri, Gıda Mühendisleri ve Veteriner Hekimler için Adım Adım Resmî Bilirkişi Raporu Tanzim ve Otomasyon Çalışma Masası**

[![Canlı Demo](https://img.shields.io/badge/Canlı%20Uygulama-GitHub%20Pages-0F3D2E?style=for-the-badge&logo=github)](https://mserman90.github.io/ZiraiBilirkisi/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Mevzuat](https://img.shields.io/badge/Mevzuat-HMK%20m.279%20Uyumlu-B45309?style=for-the-badge)](https://www.mevzuat.gov.tr/)
[![Lisans](https://img.shields.io/badge/Lisans-MIT-2E7D32?style=for-the-badge)](LICENSE)

---

## 🏛️ Genel Bakış ve Vizyon

**Bilirkişi Rapor Yazma Çalışma Masası**, adli ve idari yargıda ilk kez bilirkişi raporu tanzim edecek ziraat mühendisi, gıda mühendisi ve veteriner hekimlere adım adım rehberlik eden resmî bir dijital çalışma masasıdır.

Uygulamanın temel amacı; bilirkişiyi karmaşık mevzuat ve usul kuralları arasında yalnız bırakmamak, Yargıtay’ın en sık bozma gerekçesi yaptığı usul ve esas hatalarını (HMK m. 279 hukuki nitelendirme yasağı, eksik veri, soyut kanaat) daha yazım aşamasında önlemek ve UYAP / mahkeme standartlarına %100 uyumlu resmî bilirkişi raporları üretmektir.

* **Duygu & Atmosfer:** Ciddi, güvenilir, sakin, "resmî evrak + eğitim el kitabı" karakteri.
* **Tasarım İmzası:** Kanun maddesi kenar çizgisi (3px dikey amber `#B45309` resmî belge kenar notu) ve Fraunces serif başlıklar.
* **Kullanıcı Odak Noktası:** 3 kolonlu çalışma masasında (`240px / 1fr / 360px`) ortadaki bölüm editörü; sağda öğretici kılavuz paneli, solda 7 adımlı akış kontrol listesi.

---

## 🚀 Canlı Erişim

Uygulama GitHub Pages üzerinden kesintisiz yayındadır:

🔗 **[https://mserman90.github.io/ZiraiBilirkisi/](https://mserman90.github.io/ZiraiBilirkisi/)**

---

## 🧩 Temel 8 Sistem Modülü

Uygulama, bilirkişilik sürecinin uçtan uca tüm aşamalarını kapsayan 8 ana modülden oluşur:

### 1. Hesap ve Uzman Profili (Erişim & Kimlik)
* **Bilirkişi Sicil ve Oda Yönetimi:** Adalet Bakanlığı Bilirkişilik Sicil Numarası, TMMOB Ziraat/Gıda Mühendisleri Odası / Veteriner Hekimler Odası Sicil No, bağlı bulunulan Adli Yargı İlk Derece Mahkemesi Adalet Komisyonu ve unvan bilgilerini yönetir.
* **Gizlilik ve Kurumsal Görünüm:** Tasarım kuralları gereği üst barda ham kullanıcı adı veya e-posta yazısı gösterilmez; yalnızca avatar simgesi üzerinden erişilir.
* **Rapor Entegrasyonu:** Profil bilgileri, oluşturulan tüm yeni raporlara ve dışa aktarılan Word belgelerindeki resmî imza bloklarına otomatik işlenir.

### 2. Rapor Sihirbazı (3 Kolonlu Çalışma Masası)
* Masaüstünde `240px / 1fr / 360px` asimetrik grid düzeni.
* Kullanıcı bir anda yalnızca tek bir bölüme odaklanır.
* Her adımda canlı karakter sayacı, HMK 279 kontrol uyarıları ve adım kontrol listesi.
* Mobil ve tablet cihazlarda yatay kaydırılabilir şerit, duyarlı akış ve sabit alt eylem çubuğu (`<768px`).

### 3. Öğretici Rehberlik & Yargıtay Standartları
* **Zorunlu Başlık:** Her adımın öğretici panelinde *"Neden bu bölüm?"* başlığı zorunludur; bilirkişiye mahkemenin o bölümden ne beklediğini öğretir.
* **Amber Kenar Notu (`KenarNotu`):** Kanun maddesi kenar çizgisiyle mevzuat gerekçeleri, Yargıtay Hukuk Daireleri içtihatları ve emsal kararlar sunulur.
* **Sık Yapılan Hatalar:** Raporun iadesine veya hükme esas alınmamasına yol açan somut örnekler ve doğru uygulama kalıpları gösterilir.

### 4. Yapay Zekâ (AI) Destekli Taslak ve Denetim Motoru
* **Taslak Yükle:** Dava türüne (kamulaştırma, ecrimisil, telef, ürün hasarı vb.) ve uzmanlık alanına göre mevzuata tam uyumlu örnek taslak metinleri tek tıkla editöre aktarır.
* **AI Değerlendir (HMK m. 279 Pre-Flight Denetimi):**
  * Bilirkişinin kaçınması gereken hüküm ve kusur ifadelerini (*"kusurludur"*, *"haksız fiil"*, *"dava reddedilmelidir"*, *"tazmin edilmelidir"*, *"ihlal etmiştir"*) anında tarar.
  * HMK m. 279 uyumluluk puanı (0-100) hesaplar.
  * Rapordaki güçlü yönleri ve riskli ifadeleri listeler.
  * Hâkimin yerine geçmeyen, teknik ve tarafsız revize önerisi üretir ve tek tıkla rapora uygulatır.

### 5. Rapor Deposu (Raporlarım Çalışma Alanı)
* **Durum & Alan Filtreleme:** Taslak, İnceleniyor, Tamamlandı ve Arşivlenmiş dosyalar arasında anlık filtreleme.
* **Uzmanlık Alanı Ayrımı:** 01 Ziraat, 02 Hayvancılık ve 03 Gıda kategorilerinde dosya yönetimi.
* **Hızlı Aksiyonlar:** Dosyayı açma, düzenleme, arşivleme, silme ve kart üzerinden doğrudan Word (.doc) belgesi olarak indirme.

### 6. Ek Yönetimi (`AttachmentManager`)
* Rapor eklerini resmî kategoriler altında toplar:
  * 📸 *Keşif Fotoğrafı* (arazi, bitki ve hayvan durumu)
  * 📜 *Tapu & Kadastro Belgesi* (kayıtlar ve mülkiyet durumu)
  * 🗺️ *Parsel & Pafta Krokisi* (uydu ve kadastro sınırları)
  * 🏛️ *Resmî Yazı & Maliyet Cetveli* (İlçe Tarım / TARSİM / TÜİK resmi yazıları)
  * 🧪 *Laboratuvar Analizi* (toprak, su, yem, süt tahlilleri)
* Ekleri boyut ve tarih bilgisiyle listeleme, önizleme ve Word çıktısında otomatik numaralandırma.

### 7. Mevzuat Kütüphanesi & Veri Arşivi
* 2 kolonlu bilgi-yoğun kütüphane düzeni.
* Emsal Bilirkişi Raporları (kök raporlar, ek raporlar, kademeli seçenekli hesap tabloları).
* Yargıtay Hukuk Genel Kurulu ve ilgili daire kararları (3. HD, 5. HD, 8. HD, 11. HD).
* TÜİK resmi dekar maliyetleri, kapitalizasyon faiz oranları (KFO), hayvan ırk veritabanı ve yem analiz parametreleri.

### 8. Dışa Aktarma & UYAP Uyumu
* **Word Uyumlu Belge (.doc):** Microsoft Word, LibreOffice ve UYAP ile tam uyumlu HTML/MSO UTF-8 biçiminde dosya üretir. Mahkeme anteti, dava tarafları, 7 adımın tamamı, ekler tablosu ve resmî bilirkişi imza bloğunu içerir.
* **Yazdır / PDF:** `window.print()` desteğiyle temiz, kenar boşlukları ayarlanmış yazıcı çıktısı veya PDF kaydı.

---

## 📋 7 Adımlı Resmî Rapor Yapısı

| Adım | Kod | Adım Başlığı | İçerik ve Mahkeme Beklentisi |
|:---:|:---:|---|---|
| **1** | `01. GÖREV` | **Görev & Dosya Bilgileri** | Görevlendiren mahkeme, esas/karar no, dosya konusu, bilirkişi heyeti ve görev tanımı. |
| **2** | `02. KEŞİF` | **Keşif & İnceleme Süreci** | Keşif tarihi, keşfe katılanlar, hava/arazi koşulları, uygulanan yöntem ve metodoloji. |
| **3** | `03. BULGU` | **Saha Bulguları & Tespitler** | Parsel sınırları, toprak yapısı, ekili ürün/hayvan mevcudu, sulama ve fiziksel durum. |
| **4** | `04. HESAP` | **Teknik Değerlendirme & Hesap** | Gelir kapitalizasyonu, münavebe planı, masraf cetvelleri, telef/zarar ve amortisman hesabı. |
| **5** | `05. MEVZUAT` | **Mevzuat & Standartlar** | 2942 s. Kamulaştırma K., HMK 279, Türk Gıda Kodeksi, NRC normları ve Yargıtay kriterleri. |
| **6** | `06. KANAAT` | **Sonuç & Kanaat** | Hüküm kurmadan, somut verilerle net teknik sonuç; Sayın Hâkimliğin takdirine saygıyla arz. |
| **7** | `07. EKLER` | **Ekler & İmzalar** | Fotoğraflar, resmi yazılar, analiz tutanakları, ek listesi ve e-imza / ıslak imza bloğu. |

---

## 🌾 Uzmanlık Alanları

### 01. Tarım ve Ziraat Mühendisliği
* **Kamulaştırma Bedel Tespiti (2942 s. K. m. 10):** Gelir metodu, münavebe ürünleri, dekar maliyeti, kapitalizasyon faiz oranı (%4-%6), objektif değer artışı (ODA) sınırları.
* **Ecrimisil (Haksız İşgal Tazminatı):** Emsal kira araştırması, tarımsal gelir esası, ÜFE artış oranları ve geçmiş 5 yıllık geriye dönük hesaplama.
* **Ürün ve Arazi Hasarı:** Zirai ilaç sürüklenmesi (drift), dolu/don afetleri, elektrik hattı yangını ve sulama suyu kesintisi zararları.
* **İcra ve Haciz Kıymet Takdiri:** Tarla, bağ, bahçe ve tarımsal işletme rayiç bedel tespiti.

### 02. Zootekni ve Hayvancılık
* **Büyükbaş, Küçükbaş ve Kanatlı Değerlemesi:** Irk, yaş, canlı ağırlık, karkas randımanı, damızlık değeri ve ekonomik ömür amortismanı.
* **Telef ve Zarar Tazminatı:** Trafik kazası, elektrik kaçağı, zehirlenme ve salgın hastalık kaynaklı hayvan ölümlerinde piyasa değeri, yoksun kalınan kâr ve hurda/kurtarma bedeli mahsubu.
* **Yemler ve Hayvan Besleme:** NRC / TÜBİTAK normlarında rasyon doğrulama, aflatoksin/mikotoksin zararı, küflü yem ve ham protein düşüklüğü uyuşmazlıkları.

### 03. Gıda Mühendisliği
* **Süt ve Mandıra Teknolojisi:** Soğuk zincir kırılması, asitlik (°SH) yükselmesi, antibiyotik kalıntısı, taşıma ve tank hasarları.
* **Gıda Kodeksi ve Raf Ömrü:** Tağşiş tespiti, mikrobiyolojik bozulma, etiket uyuşmazlığı ve imha tutanağı zararları.

---

## 🎨 Tasarım Sistemi İlkeleri

Bu proje resmî bir adli çalışma ortamıdır; bu nedenle katı görsel standartlara sahiptir:

* **Tipografi:**
  * Başlıklar: `Fraunces` (Serif 600, edebi ve resmî ciddiyet)
  * Gövde Metni: `Public Sans` (okunabilir, rahat 1.65 satır yüksekliği)
  * Kodlar ve Sayılar: `IBM Plex Mono` (karakter sayaçları, kanun maddeleri, hesap rakamları)
* **Renk Paleti (HSL):**
  * `--primary`: `#0F3D2E` (Orman Yeşili — güvenilir, adli, kurumsal)
  * `--background`: `#FBF9F3` (Sıcak kâğıt zemini)
  * `--accent`: `#B45309` (Amber — kanun maddesi dikey kenar çizgisi, ikazlar)
* **Tasarım Yasakları:** Glassmorphism, mor/mavi yapay zekâ gradyanları, parıldayan kart sınırları, göz yoran neon renkler yasaktır. Resmî belge sadeliği esastır.
* **Tema:** Gece ve Gündüz modları arasında tam geçiş desteği.

---

## 💻 Kurulum ve Geliştirme

Projeyi yerel makinenizde çalıştırmak için:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/mserman90/ZiraiBilirkisi.git

# 2. Proje dizinine geçin
cd ZiraiBilirkisi

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın
npm run dev

# 5. TypeScript denetimi ve üretim derlemesi
npm run lint
npm run build
```

Geliştirme sunucusu varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

---

## ⚖️ Yasal Uyarı

Bu yazılım, bilirkişilere teknik yöntem ve mevzuat sistematiği açısından yol göstermek amacıyla hazırlanmış bir çalışma aracıdır. Üretilen rapor taslakları ve hesaplama sonuçları bilirkişinin kendi mesleki bilgisi, vicdani kanaati ve mahallinde yapacağı fiili keşif bulgularıyla doğrulanmalı; 6754 sayılı Bilirkişilik Kanunu ve 6100 sayılı Hukuk Muhakemeleri Kanunu hükümleri uyarınca imzalanmalıdır.

---

© 2026 **Bilirkişi Rapor Yazma Çalışma Masası** — Adalet ve Bilim Hizmetinde.

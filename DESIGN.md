# DESIGN.md — Bilirkişi Rapor Yazma Otomasyonu

## Direction & Layout
- **Amaç ve Karakter:** İlk kez bilirkişi raporu tanzim edecek ziraat mühendisi, gıda mühendisi ve veteriner hekime adım adım rehberlik eden resmî çalışma masası. Duygu: Ciddi, güvenilir, sakin, "resmî evrak" hissi; korkutucu bir hukuk yazılımı yerine öğretici bir rehber el kitabı.
- **İlk Görsel Sinyal:** Koyu yeşil (`#0F3D2E`) dolgulu bir panel üzerinde raporun yapısını gösteren yedi adımlı şerit — ürünün "adım adım" vaadini ilk saniyede kanıtlar.
- **Belirleyici Görsel Fikir:** Kanun maddesi kenar çizgisi. Mevzuat alıntıları ve öğretici notlar, solunda 3px kalınlığında amber (`#B45309`) dikey çizgi bulunan "resmî belge kenar notu" kutusu içinde gösterilir. Bu uygulamanın öğretici karakterini taşıyan tekrar eden görsel imzadır.
- **Görsel Referans:** Resmî dosya + adli bilirkişilik eğitim el kitabı karakteri.
- **Odak Noktası:** Sihirbaz ekranında ortadaki bölüm editörü; sağda öğretici panel, solda adım listesi. Kullanıcı bir anda tek bir bölüme odaklanır.
- **Maksimum İçerik Genişliği:** 1200px (okuma yoğun / editör), 1440px (liste ve kütüphane).
- **Grid Düzeni:** Masaüstünde sihirbaz `240px / 1fr / 360px` üç kolon; liste ekranları 3'lü kart gridi; kütüphane 2 kolon.
- **Yoğunluk & Beyaz Alan:** Gövde metni rahat (1.7 satır yüksekliği), veri alanları sıkı. Bölüm arası 32px, kart arası 16px. Beyaz alan ritmi: Her bölüm başlığından önce 24px, ardından 12px nefes.
- **Breakpoints:**
  - `<768px`: Tek kolon; adım listesi yatay kaydırılabilir şerit, öğretici panel editörün altına iner, sabit alt eylem çubuğu (geri/ileri/kaydet).
  - `768–1024px`: İki kolon (editör + öğretici), adım şeridi en üstte.
  - `≥1280px`: Üç kolon tam düzen.
- **Do & Don't:**
  - *Yapılacak:* Amber kenar notu kutusu, alan renkli (ziraat/gıda/hayvancılık) küçük kare badge'ler, adım numarası için monospace rakamlar.
  - *Yapılacak:* Her öğretici panelde "Neden bu bölüm?" başlığı zorunlu.
  - *Yasak:* Mor/mavi gradyanlar, parlayan kart kenarlıkları, glassmorphism, robot/ampul ikonlarıyla dolu "AI ürünü" estetiği.
  - *Yasak:* Kırmızı-yeşil dışında durum rengi; kırmızıyı yalnızca hata/eksik uyarısı için kullan.
  - *Yasak:* Hero'da ortalanmış tek kolon; yasak: kullanıcıya e-posta/isim gösteren üst köşe profili (yalnızca avatar simgesi).

## Tokens
- **Renkler (HSL):**
  - `--primary`: `155 61% 15%` (`#0F3D2E`, orman yeşili) — birincil butonlar, üst bar, dolgu paneller.
  - `--primary-foreground`: `44 60% 97%` (`#FBF9F4`) — birincil üzerindeki metin.
  - `--background`: `44 33% 97%` (`#FBF9F3`) — sıcak kâğıt zemini (karanlık mod: `155 30% 6%` / `#07130D`).
  - `--card`: `0 0% 100%` (`#FFFFFF`) — kart ve editör yüzeyi (karanlık mod: `155 24% 10%` / `#0F2219`).
  - `--muted`: `44 25% 93%` (`#F1ECE1`), `--muted-foreground`: `160 8% 38%` (`#5A6B63`) — ikincil metin, etiket.
  - `--accent`: `32 95% 37%` (`#B45309`, amber) — kenar notu, "sık yapılan hata" vurgusu, uyarı ikonları.
  - `--border`: `42 24% 87%` (`#E4DCCB`), `--input`: aynı; `--ring`: `155 61% 15%`.
  - `--destructive`: `0 72% 45%` (`#DC2626`) — yalnızca hata ve eksik bölüm.
- **Alan Renkleri (Sabit):**
  - Ziraat: `#15803D` (%12 opaklıkta dolgu + koyu metin)
  - Gıda: `#B45309` (%12 opaklıkta dolgu + koyu metin)
  - Hayvancılık: `#0E7490` (%12 opaklıkta dolgu + koyu metin)
- **Durum Renkleri:**
  - Taslak: Nötr (`#5A6B63`, bg `#F1ECE1`)
  - İnceleniyor: Amber (`#B45309`, bg `%12` amber)
  - Tamamlandı: Yeşil (`#15803D`, bg `%12` yeşil)
  - Arşiv: Gri (`#6B7280`, bg `#E5E7EB`)
- **Denge Kuralı:** Amber vurgu ekranın %10’undan fazlasını kaplamaz; yeşil dolgu yalnızca üst bar ve hero panelinde.
- **Tipografi:**
  - Başlıklar: `Fraunces` 600 (serif, yüksek kontrast, resmî evrak karakteri). H1: 40/1.15, H2: 28/1.25, H3: 20/1.35.
  - Gövde: `Public Sans` 400/500. 16/1.7 gövde, 14/1.6 yardımcı metin, etiket 12/1.4 +0.02em letter-spacing.
  - Monospace: `IBM Plex Mono` 500 — adım numarası (01-07), dosya numarası, ölçüm değerleri.
  - Buton Metni: `Public Sans` 600, 14px.
  - Editör Textarea: `Public Sans` 15px / 1.75 (min 220px).
- **Spacing & Shapes:**
  - Ölçek: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
  - Yarıçap: Kart 12px, buton 8px, input 8px, badge 4px (keskin, resmî), avatar ikon butonu tam yuvarlak.
  - Buton Yüksekliği: 40px (sm: 32px, lg: 44px); ikon butonu: 40×40.
- **Elevation & Depth:**
  - Gölge Minimal: `0 1px 2px rgba(15, 61, 46, 0.06)`. Kartlar ağırlıklı olarak 1px `--border` ile ayrılır; sadece aktif/yapışkan öğeler hafif gölge alır.
  - Üst Bar: `border-b` + düz `--primary` dolgu; blur yok.
  - Editör ve Kenar Notu Kutuları: Düz renk + sol kenar çizgisi, gradyan yok.

## Shared Patterns & States
- **ÜstBar (AppShell):** `--primary` dolgu (`#0F3D2E`), sol tarafta ürün adı (Fraunces 600 20px), sağda navigasyon bağlantıları (Raporlarım / Kütüphane / Yeni Rapor) ve kullanıcı avatar ikonu. Yalnızca avatar/menü; e-posta ve kullanıcı adı gösterilmez.
- **AdımŞeridi:** 7 adım, numara mono + kısa etiket; aktif adım amber alt çizgi, tamamlanan adım yeşil daire. Mobilde yatay kaydırmalı.
- **KenarNotu:** 1px `--border`, 3px sol amber çizgi, `--muted` zemin, 12px iç boşluk; "Neden bu bölüm?", "Sık yapılan hatalar", "Örnek ifade" için kullanılır. Hata durumunda 3px sol kırmızı çizgi.
- **BölümEditörü:** Textarea (min 220px), karakter sayacı, "AI ile taslak oluştur" ikincil buton, altında "Kaydet" birincil butonu.
- **KontrolListesi:** Checkbox maddeleri; işaretlendiğinde üstü çizilir ve adım tamamlanma yüzdesi güncellenir.
- **RaporKartı:** Başlık, alan badge'i, durum badge'i, dosya no (mono), son güncelleme, üç nokta menüsü (aç / düzenle / arşivle / sil).
- **Badge:** 4px yarıçap, 12px metin, alan rengi %12 opaklıkta dolgu + koyu metin.
- **Durumlar (States):**
  - Yükleniyor: İskelet satırlar (skeleton rows).
  - Boş: Açıklayıcı boş durum + "İlk raporunuzu oluşturun" CTA.
  - Hata: Kırmızı kenar notu + "Yeniden dene".
  - Giriş Yok / Karşılama: Karşılama paneli + "Giriş yap" butonu (zorla yönlendirme yok).
- **Hareket (Motion):** 150ms ease-out, yalnızca hover renk geçişi, adım geçişinde 200ms opacity. Animasyonla içerik gizleme yok; ilk render’da tüm içerik görünür.
- **Erişilebilirlik:** Minimum 40px dokunma alanı, görünür ring odak halkası, ikon butonlarda aria-label, tüm form alanlarında `<label>` bağlantısı, hata metni alan altında.

## Media
- **Hero Görseli:** Karşılama ekranının hero panelinde tek bir gerçek fotoğraf kullanılır: Tarla/ürün incelemesini çağrıştıran, metin bindirmesiz, koyu yeşil tonlanmış geniş görsel (16:9, sağ %45'te, üzerine yazı binmez). Varlık yolu: `public/hero-saha-incelemesi.jpg`, `image_manifest.json` içinde kayıtlı.
- **Kütüphane Kartları:** Kütüphane kartlarında görsel yok; bilgi yoğunluğu kartın kendisidir.
- **İllüstrasyon Politikası:** Soyut gradyan veya SVG illüstrasyon yerine düz renk blokları tercih edilir.
- **Ek Belge Önizlemeleri:** Kullanıcının yüklediği gerçek dosyalardır; temsili görsel kullanılmaz.

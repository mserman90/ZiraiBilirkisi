import React, { useState, useMemo } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  Wand2,
  AlertTriangle,
  BookOpen,
  Copy,
  Building2,
  Scale,
  Calculator,
  ShieldCheck,
  FileCheck,
  Download,
  Printer,
  Sparkles,
  Paperclip,
  FileText,
} from "lucide-react";
import {
  BilirKisiRaporu,
  YEDI_ADIM_TANIMLARI,
  AdimVerisi,
  ALAN_TANIMLARI,
  ORNEK_RAPORLAR_LISTESI,
  RaporEki,
} from "../../data/fields";
import KenarNotu from "./KenarNotu";
import AdimSeridi from "./AdimSeridi";
import AttachmentManager from "./AttachmentManager";
import AiDegerlendirmeModal from "./AiDegerlendirmeModal";
import { exportReportToWord } from "../../utils/exportWord";

interface SihirbazViewProps {
  aktifRapor?: BilirKisiRaporu;
  onRaporKaydet?: (rapor: BilirKisiRaporu) => void;
  onGeriDon: () => void;
  showToast: (msg: string) => void;
}

export default function SihirbazView({
  aktifRapor = ORNEK_RAPORLAR_LISTESI[0],
  onRaporKaydet,
  onGeriDon,
  showToast,
}: SihirbazViewProps) {
  // Mevcut aktif adım (1 - 7)
  const [currentStep, setCurrentStep] = useState<number>(aktifRapor.mevcutAdim || 1);

  // Rapor durumları
  const [rapor, setRapor] = useState<BilirKisiRaporu>(aktifRapor);

  // AI Değerlendirme Modalı durumu
  const [aiDegerlendirmeAcik, setAiDegerlendirmeAcik] = useState(false);

  // Düzenlenen metinler her adım için
  const [bolumMetinleri, setBolumMetinleri] = useState<Record<number, string>>(
    aktifRapor.bolumMetinleri || {
      1: YEDI_ADIM_TANIMLARI[0].varsayilanMetin,
      2: YEDI_ADIM_TANIMLARI[1].varsayilanMetin,
      3: YEDI_ADIM_TANIMLARI[2].varsayilanMetin,
      4: YEDI_ADIM_TANIMLARI[3].varsayilanMetin,
      5: YEDI_ADIM_TANIMLARI[4].varsayilanMetin,
      6: YEDI_ADIM_TANIMLARI[5].varsayilanMetin,
      7: YEDI_ADIM_TANIMLARI[6].varsayilanMetin,
    }
  );

  // Kontrol listesi maddeleri her adım için
  const [bolumKontrolleri, setBolumKontrolleri] = useState(
    aktifRapor.bolumKontrolleri || {
      1: YEDI_ADIM_TANIMLARI[0].kontroller,
      2: YEDI_ADIM_TANIMLARI[1].kontroller,
      3: YEDI_ADIM_TANIMLARI[2].kontroller,
      4: YEDI_ADIM_TANIMLARI[3].kontroller,
      5: YEDI_ADIM_TANIMLARI[4].kontroller,
      6: YEDI_ADIM_TANIMLARI[5].kontroller,
      7: YEDI_ADIM_TANIMLARI[6].kontroller,
    }
  );

  // Ekler durumu
  const [ekler, setEkler] = useState<RaporEki[]>(aktifRapor.ekler || [
    {
      id: "ek-1",
      ad: "Keşif Günü Arazi Durumu ve Bitki Gelişimi Fotoğrafı",
      tur: "fotograf",
      dosyaAdi: "kesif_fotografi_01.jpg",
      boyut: "2.4 MB",
      yuklemeTarihi: aktifRapor.kesifTarihi || "02.05.2024",
      aciklama: "Kuzey-Doğu cephesinden çekilen parselin genel görünümü",
    },
    {
      id: "ek-2",
      ad: "Gölbaşı İlçe Tarım ve Orman Müdürlüğü 2024 Maliyet Cetveli",
      tur: "resmi_yazi",
      dosyaAdi: "ilce_tarim_maliyet_2024.pdf",
      boyut: "840 KB",
      yuklemeTarihi: "14.04.2024",
      aciklama: "Buğday ve mısır münavebe dekar verim ve masraf tablosu",
    },
  ]);

  // Aktif adım bilgisi
  const aktifAdimVerisi = useMemo(
    () => YEDI_ADIM_TANIMLARI.find((a) => a.no === currentStep) || YEDI_ADIM_TANIMLARI[0],
    [currentStep]
  );

  const mevcutMetin = bolumMetinleri[currentStep] || "";
  const mevcutKontroller = bolumKontrolleri[currentStep] || aktifAdimVerisi.kontroller;

  // Adım tamamlanma yüzdesi
  const tamamlananSayisi = mevcutKontroller.filter((k) => k.tamamlandi).length;
  const adimYuzdesi =
    mevcutKontroller.length > 0
      ? Math.round((tamamlananSayisi / mevcutKontroller.length) * 100)
      : 0;

  // Checkbox tıklama
  const handleKontrolToggle = (id: string) => {
    setBolumKontrolleri((prev) => {
      const guncel = (prev[currentStep] || []).map((k) =>
        k.id === id ? { ...k, tamamlandi: !k.tamamlandi } : k
      );
      return { ...prev, [currentStep]: guncel };
    });
  };

  // Metin değişikliği
  const handleMetinDegisimi = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBolumMetinleri((prev) => ({ ...prev, [currentStep]: val }));
  };

  // Örnek ifadeyi metne ekle
  const handleOrnekIfadeEkle = () => {
    const eklenecek = `\n\n${aktifAdimVerisi.ornekIfade}`;
    setBolumMetinleri((prev) => ({
      ...prev,
      [currentStep]: (prev[currentStep] || "") + eklenecek,
    }));
    showToast("Örnek ifade metne eklendi");
  };

  // AI ile taslak oluştur (HMK 279 uyumlu)
  const handleAiTaslakOlustur = () => {
    const taslak = aktifAdimVerisi.varsayilanMetin;
    setBolumMetinleri((prev) => ({ ...prev, [currentStep]: taslak }));
    showToast("Mevzuata uygun taslak metin yüklendi");
  };

  // AI Değerlendirmesini Uygula
  const handleAiRevizeUygula = (yeniMetin: string) => {
    setBolumMetinleri((prev) => ({ ...prev, [currentStep]: yeniMetin }));
  };

  // Ekler güncellendiğinde
  const handleEklerGuncelle = (yeniEkler: RaporEki[]) => {
    setEkler(yeniEkler);
    setRapor((prev) => ({ ...prev, ekler: yeniEkler }));
  };

  // Kaydet
  const handleKaydet = () => {
    const guncelRapor: BilirKisiRaporu = {
      ...rapor,
      mevcutAdim: currentStep,
      bolumMetinleri,
      bolumKontrolleri,
      ekler,
      sonGuncelleme: "Az önce",
    };
    setRapor(guncelRapor);
    if (onRaporKaydet) onRaporKaydet(guncelRapor);
    showToast("Bölüm başarıyla kaydedildi");
  };

  // Word Olarak İndir
  const handleWordIndir = () => {
    const guncelRapor: BilirKisiRaporu = {
      ...rapor,
      bolumMetinleri,
      bolumKontrolleri,
      ekler,
    };
    exportReportToWord(guncelRapor);
    showToast("Word uyumlu belge (.doc) hazırlandı ve indirildi");
  };

  // Yazdır / PDF
  const handleYazdir = () => {
    window.print();
  };

  // Adım geçişleri
  const handleSonraki = () => {
    handleKaydet();
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleOnceki = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const alanInfo = ALAN_TANIMLARI[rapor.alan];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 font-sans select-text">
      {/* Üst Bilgi Barı: Dosya Başlığı, Dışa Aktarma Butonları ve Kaydet */}
      <div className="resmi-kart p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGeriDon}
            className="w-9 h-9 rounded-[6px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--card-foreground))] cursor-pointer transition-colors"
            title="Dosyalarıma Dön"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`alan-badge-${rapor.alan}`}>
                {alanInfo.ad}
              </span>
              <span className="font-mono text-[12px] font-semibold text-[#0F3D2E] dark:text-emerald-400 bg-[hsl(var(--muted))] px-2 py-0.5 rounded-[4px]">
                {rapor.dosyaNo}
              </span>
            </div>
            <h2 className="font-serif font-semibold text-[17px] sm:text-[19px] leading-tight text-[hsl(var(--card-foreground))] m-0 mt-0.5 truncate max-w-xl">
              {rapor.baslik}
            </h2>
          </div>
        </div>

        {/* Dışa Aktarma & Kaydet Butonları */}
        <div className="flex items-center gap-2">
          {/* Word İndir */}
          <button
            type="button"
            onClick={handleWordIndir}
            className="btn-secondary h-10 px-3 text-[13px] flex items-center gap-1.5"
            title="Microsoft Word / LibreOffice Uyumlu Belge (.doc)"
          >
            <FileText className="w-4 h-4 text-[#0F3D2E] dark:text-emerald-400" />
            <span className="hidden sm:inline">Word İndir</span>
          </button>

          {/* Yazdır */}
          <button
            type="button"
            onClick={handleYazdir}
            className="btn-secondary h-10 px-3 text-[13px] flex items-center gap-1.5"
            title="Yazdır veya PDF Olarak Kaydet"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Yazdır</span>
          </button>

          {/* Kaydet */}
          <button
            type="button"
            onClick={handleKaydet}
            className="btn-primary touch-min"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Kaydet</span>
          </button>
        </div>
      </div>

      {/* Tablet & Mobil Adım Şeridi (Üstte gösterilir) */}
      <div className="xl:hidden resmi-kart p-2 mb-4">
        <AdimSeridi
          aktifAdim={currentStep}
          tamamlananAdimlar={[1, 2, 3, 4, 5, 6, 7].filter((n) => n < currentStep)}
          onAdimSec={(no) => setCurrentStep(no)}
        />
      </div>

      {/* 
        ÜÇ KOLONLU ÇALIŞMA DÜZENİ:
        - Masaüstü (≥1280px): 240px (Sol Adımlar) / 1fr (Editör - max 1200px) / 360px (Sağ Öğretici Panel)
        - Tablet (768-1024px): 2 Kolon (Editör + Öğretici)
        - Mobil (<768px): Tek Kolon (Editör, altında Öğretici)
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-[240px_1fr_360px] gap-6 items-start">
        {/* ========================================================= */}
        {/* SOL KOLON (240px): 7 Adımlı Liste (Masaüstünde)           */}
        {/* ========================================================= */}
        <aside className="hidden xl:block resmi-kart p-3 space-y-1 sticky top-18">
          <div className="px-3 py-2 border-b border-[hsl(var(--border))] mb-1 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[hsl(var(--muted-foreground))]">
              RAPOR ADIMLARI
            </span>
            <span className="text-[11px] font-mono text-[#0F3D2E] dark:text-emerald-400 font-semibold">
              Adım {currentStep}/7
            </span>
          </div>

          <nav aria-label="Raporlama Adım Listesi">
            <ul className="space-y-1">
              {YEDI_ADIM_TANIMLARI.map((adim) => {
                const isAktif = adim.no === currentStep;
                const isGecilmis = adim.no < currentStep;

                return (
                  <li key={adim.no}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(adim.no)}
                      className={`w-full text-left p-2.5 rounded-[6px] transition-colors duration-150 flex items-center justify-between group cursor-pointer ${
                        isAktif
                          ? "bg-[#0F3D2E] text-[#FBF9F4] font-medium"
                          : "text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono shrink-0 ${
                            isAktif
                              ? "bg-[#B45309] text-white font-bold"
                              : isGecilmis
                              ? "bg-[#15803D] text-white"
                              : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                          }`}
                        >
                          {isGecilmis ? (
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            adim.no
                          )}
                        </span>
                        <span className="text-[13px] leading-tight truncate">
                          {adim.kisaBaslik}
                        </span>
                      </div>

                      {/* Küçük İndikatör */}
                      {isAktif && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B45309] shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Dosya İlerleme Göstergesi */}
          <div className="pt-3 border-t border-[hsl(var(--border))] px-3 pb-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[hsl(var(--muted-foreground))] mb-1.5">
              <span>Bölüm Denetimi</span>
              <span className="font-semibold text-[hsl(var(--card-foreground))]">
                %{adimYuzdesi}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden border border-[hsl(var(--border))]">
              <div
                className="h-full bg-[#15803D] transition-all duration-300"
                style={{ width: `${adimYuzdesi}%` }}
              />
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* ORTA KOLON (1fr - max 1200px): Bölüm Editörü               */}
        {/* ========================================================= */}
        <main className="md:col-span-7 xl:col-span-1 space-y-5">
          {/* Bölüm Başlığı & Mevzuat Referansı */}
          <div className="resmi-kart p-5 space-y-3">
            <div className="flex items-center gap-2 text-[12px] font-mono text-[#B45309]">
              <span>ADIM {aktifAdimVerisi.kod} / 07</span>
              <span>•</span>
              <span className="truncate">{aktifAdimVerisi.tamBaslik}</span>
            </div>

            <h1 className="font-serif font-semibold text-2xl lg:text-[26px] leading-tight text-[hsl(var(--card-foreground))] m-0">
              {aktifAdimVerisi.tamBaslik}
            </h1>

            {/* Mevzuat Alıntı Kenar Çizgisi Kutusu */}
            <KenarNotu tip="mevzuat" baslik="Mevzuat Hükmü">
              {aktifAdimVerisi.mevzuatDayanagi}
            </KenarNotu>
          </div>

          {/* Editör Kartı */}
          <div className="resmi-kart p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[hsl(var(--border))] pb-3">
              <label
                htmlFor="bolum-editor"
                className="font-serif font-semibold text-[16px] text-[hsl(var(--card-foreground))]"
              >
                Rapor Metin Girişi
              </label>

              {/* Karakter Sayacı ve AI Butonları */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-[hsl(var(--muted-foreground))] mr-1">
                  {mevcutMetin.length} karakter
                </span>

                {/* AI ile Değerlendir Butonu */}
                <button
                  type="button"
                  onClick={() => setAiDegerlendirmeAcik(true)}
                  className="h-8 px-2.5 rounded-[6px] text-[12px] font-medium border border-[#0F3D2E]/40 bg-[#0F3D2E]/5 hover:bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-emerald-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Yazılan metni HMK 279 ve Yargıtay kriterlerine göre değerlendir"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Değerlendir</span>
                </button>

                {/* AI ile Taslak Oluştur İkincil Buton */}
                <button
                  type="button"
                  onClick={handleAiTaslakOlustur}
                  className="h-8 px-2.5 rounded-[6px] text-[12px] font-medium border border-[#B45309]/50 bg-amber-50/50 dark:bg-amber-950/20 text-[#B45309] hover:bg-amber-100/50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Taslak Yükle</span>
                </button>
              </div>
            </div>

            {/* Metin Giriş Alanı (Public Sans 15px / 1.75 line-height) */}
            <textarea
              id="bolum-editor"
              value={mevcutMetin}
              onChange={handleMetinDegisimi}
              placeholder="Resmî rapor metnini buraya giriniz veya sağdaki öğretici notlardan faydalanınız..."
              className="editor-textarea"
              rows={12}
            />

            {/* Alt Eylem Çubuğu: Geri, İleri, Kaydet */}
            <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
              <button
                type="button"
                onClick={handleOnceki}
                disabled={currentStep === 1}
                className="btn-secondary h-10 px-4 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Önceki Adım</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleKaydet}
                  className="btn-secondary h-10 px-4"
                >
                  <Save className="w-4 h-4" />
                  <span>Taslağı Kaydet</span>
                </button>

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={handleSonraki}
                    className="btn-primary h-10 px-5"
                  >
                    <span>Sonraki Adım</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleKaydet();
                      showToast("Nihai rapor tamamlandı ve arşive kaydedildi!");
                    }}
                    className="btn-primary h-10 px-5 bg-[#15803D] hover:bg-[#166534]"
                  >
                    <FileCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Raporu Onayla & Bitir</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ek Yönetimi Paneli (Rapor Ekleri & Saha Belgeleri) */}
          <div className="resmi-kart p-5">
            <AttachmentManager
              ekler={ekler}
              onEklerGuncelle={handleEklerGuncelle}
              showToast={showToast}
            />
          </div>
        </main>

        {/* ========================================================= */}
        {/* SAĞ KOLON (360px): Öğretici Panel                         */}
        {/* ========================================================= */}
        <aside className="md:col-span-5 xl:col-span-1 space-y-4">
          <div className="resmi-kart p-4 space-y-4 sticky top-18">
            {/* 1. ZORUNLU BAŞLIK: "Neden bu bölüm?" */}
            <div className="border-b border-[hsl(var(--border))] pb-2">
              <h2 className="font-serif font-semibold text-[17px] text-[#0F3D2E] dark:text-emerald-400 m-0">
                Neden bu bölüm?
              </h2>
              <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">
                Bilirkişi heyeti için öğretici mevzuat ve denetim el kitabı
              </p>
            </div>

            {/* Kenar Notu: Neden Bu Bölüm? */}
            <KenarNotu tip="ogretici" baslik="Gerekçe ve Amaç">
              {aktifAdimVerisi.nedenBuBolum}
            </KenarNotu>

            {/* Kenar Notu: Sık Yapılan Hatalar */}
            <KenarNotu tip="hata_uyari" baslik="Sık Yapılan Hatalar (Yargıtay Bozma)">
              <ul className="list-disc list-inside space-y-1.5 text-[13px]">
                {aktifAdimVerisi.sikYapilanHatalar.map((hata, idx) => (
                  <li key={idx} className="leading-snug">
                    {hata}
                  </li>
                ))}
              </ul>
            </KenarNotu>

            {/* Kenar Notu: Örnek İfade */}
            <div className="space-y-1.5">
              <KenarNotu tip="ornek_ifade" baslik="Örnek Rapor İfadesi">
                <p className="italic text-[13px] leading-relaxed">
                  "{aktifAdimVerisi.ornekIfade}"
                </p>
              </KenarNotu>
              <button
                type="button"
                onClick={handleOrnekIfadeEkle}
                className="w-full h-8 text-[12px] font-sans font-medium rounded-[4px] border border-[hsl(var(--border))] bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] text-[hsl(var(--card-foreground))] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Bu İfadeyi Raporuma Ekle</span>
              </button>
            </div>

            {/* Kontrol Listesi */}
            <div className="pt-3 border-t border-[hsl(var(--border))] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-[14px] text-[hsl(var(--card-foreground))]">
                  Adım Denetim Maddeleri
                </span>
                <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                  {tamamlananSayisi}/{mevcutKontroller.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {mevcutKontroller.map((kontrol) => (
                  <label
                    key={kontrol.id}
                    className={`flex items-start gap-2.5 p-2 rounded-[4px] text-[13px] leading-snug cursor-pointer transition-colors border ${
                      kontrol.tamamlandi
                        ? "bg-green-50/50 dark:bg-green-950/20 border-green-200/60 text-slate-500 line-through"
                        : "bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={kontrol.tamamlandi}
                      onChange={() => handleKontrolToggle(kontrol.id)}
                      className="mt-0.5 rounded-[3px] accent-[#15803D] cursor-pointer"
                    />
                    <span>{kontrol.metin}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* AI Değerlendirme Modalı */}
      {aiDegerlendirmeAcik && (
        <AiDegerlendirmeModal
          isOpen={aiDegerlendirmeAcik}
          onClose={() => setAiDegerlendirmeAcik(false)}
          bolumNo={currentStep}
          bolumBasligi={aktifAdimVerisi.tamBaslik}
          mevcutMetin={mevcutMetin}
          onMetinUygula={handleAiRevizeUygula}
          showToast={showToast}
        />
      )}

      {/* Mobil Sabit Alt Eylem Çubuğu (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] p-3 flex items-center justify-between gap-2 z-40 shadow-md">
        <button
          type="button"
          onClick={handleOnceki}
          disabled={currentStep === 1}
          className="btn-secondary h-10 px-3 text-[13px] disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>

        <button
          type="button"
          onClick={handleKaydet}
          className="btn-primary h-10 px-4 text-[13px]"
        >
          <Save className="w-4 h-4" />
          <span>Kaydet</span>
        </button>

        <button
          type="button"
          onClick={handleSonraki}
          disabled={currentStep === 7}
          className="btn-secondary h-10 px-3 text-[13px] disabled:opacity-40"
        >
          <span>İleri</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

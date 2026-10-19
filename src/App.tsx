import React, { useState, useEffect } from "react";
import ResmiUstBar, { AnaNavigasyon } from "./components/resmi/ResmiUstBar";
import RaporlarimView from "./components/resmi/RaporlarimView";
import SihirbazView from "./components/resmi/SihirbazView";
import KutuphaneView from "./components/resmi/KutuphaneView";
import PwaInstallModal from "./components/PwaInstallModal";
import HizliRehberModal from "./components/HizliRehberModal";
import CommandPaletteModal from "./components/CommandPaletteModal";
import {
  BilirKisiRaporu,
  ORNEK_RAPORLAR_LISTESI,
  YEDI_ADIM_TANIMLARI,
} from "./data/fields";
import { TabId } from "./types";

// Gelişmiş Alt Modüller (Kütüphane veya Arama üzerinden erişilebilir)
import RaporOtomasyonuView from "./components/RaporOtomasyonuView";
import HayvancilikRaporOtomasyonuView from "./components/HayvancilikRaporOtomasyonuView";
import TarimVeriArsiviView from "./components/TarimVeriArsiviView";
import IctihatAramaView from "./components/IctihatAramaView";
import HayvancilikView from "./components/HayvancilikView";
import YemlerBeslemeView from "./components/YemlerBeslemeView";
import SutUrunleriView from "./components/SutUrunleriView";
import NdviPanel from "./components/NdviPanel";

export default function App() {
  // Ana Navigasyon: "raporlarim" | "kutuphane" | "sihirbaz"
  const [aktifSayfa, setAktifSayfa] = useState<AnaNavigasyon>("raporlarim");

  // Aktif açılan veya düzenlenen bilirkişi raporu
  const [aktifRapor, setAktifRapor] = useState<BilirKisiRaporu>(ORNEK_RAPORLAR_LISTESI[0]);

  // Özel alt modül görünümü (Arama veya kütüphane üzerinden doğrudan araç açıldığında)
  const [altModulTab, setAltModulTab] = useState<TabId | null>(null);

  // Bildirim Toast'ı
  const [toast, setToast] = useState<string | null>(null);

  // Modallar
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [hizliRehberOpen, setHizliRehberOpen] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  // Tema Durumu: "dark" | "light" (Varsayılan Gece/Dark)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("zirai_theme");
      if (stored === "dark" || stored === "light") return stored;
      return "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("zirai_theme", "dark");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#07130d");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("zirai_theme", "light");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#0F3D2E");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      showToast(next === "dark" ? "Gece Modu Açıldı" : "Gündüz Modu Açıldı");
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // Klavye Kısayolları (Ctrl+K, F1, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "F1") {
        e.preventDefault();
        setHizliRehberOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Yeni Rapor Başlat
  const handleYeniRaporBaslat = () => {
    const yeniId = `rap-${Date.now().toString().slice(-4)}`;
    const yeniRapor: BilirKisiRaporu = {
      id: yeniId,
      baslik: "Yeni Bilirkişi Rapor Dosyası",
      dosyaNo: `${new Date().getFullYear()}/... Esas`,
      mahkeme: "Asliye Hukuk Mahkemesi",
      alan: "ziraat",
      durum: "taslak",
      davaTuru: "Kamulaştırma Bedel Tespiti (m. 10)",
      kesifTarihi: new Date().toLocaleDateString("tr-TR"),
      sonGuncelleme: "Yeni oluşturuldu",
      mevcutAdim: 1,
      tamamlanmaYuzdesi: 10,
      tarafBilgisi: "Davacı / Davalı",
      ozet: "Henüz keşif ve hesaplama verileri girilmedi.",
      bolumMetinleri: {
        1: YEDI_ADIM_TANIMLARI[0].varsayilanMetin,
        2: YEDI_ADIM_TANIMLARI[1].varsayilanMetin,
        3: YEDI_ADIM_TANIMLARI[2].varsayilanMetin,
        4: YEDI_ADIM_TANIMLARI[3].varsayilanMetin,
        5: YEDI_ADIM_TANIMLARI[4].varsayilanMetin,
        6: YEDI_ADIM_TANIMLARI[5].varsayilanMetin,
        7: YEDI_ADIM_TANIMLARI[6].varsayilanMetin,
      },
      bolumKontrolleri: {
        1: YEDI_ADIM_TANIMLARI[0].kontroller,
        2: YEDI_ADIM_TANIMLARI[1].kontroller,
        3: YEDI_ADIM_TANIMLARI[2].kontroller,
        4: YEDI_ADIM_TANIMLARI[3].kontroller,
        5: YEDI_ADIM_TANIMLARI[4].kontroller,
        6: YEDI_ADIM_TANIMLARI[5].kontroller,
        7: YEDI_ADIM_TANIMLARI[6].kontroller,
      },
    };
    setAktifRapor(yeniRapor);
    setAltModulTab(null);
    setAktifSayfa("sihirbaz");
    showToast("Yeni rapor taslağı başlatıldı");
  };

  // Mevcut Raporu Aç / Düzenle
  const handleRaporAc = (rapor: BilirKisiRaporu) => {
    setAktifRapor(rapor);
    setAltModulTab(null);
    setAktifSayfa("sihirbaz");
  };

  // Arama / Komut Paletinden Tab Seçildiğinde
  const handleSelectTab = (tab: TabId) => {
    if (tab === "hero" || tab === "raporOtomasyonu" || tab === "hayvancilikRaporOtomasyonu") {
      setAltModulTab(null);
      setAktifSayfa(tab === "hero" ? "raporlarim" : "sihirbaz");
    } else if (tab === "tarimRaporlar" || tab === "hayvancilikRaporlar" || tab === "ictihat") {
      setAltModulTab(null);
      setAktifSayfa("kutuphane");
    } else {
      setAltModulTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--card-foreground))] antialiased flex flex-col transition-colors duration-150">
      {/* 1. ÜST BAR (APPSHELL) */}
      <ResmiUstBar
        aktifSayfa={aktifSayfa}
        onSayfaDegistir={(sayfa) => {
          setAltModulTab(null);
          setAktifSayfa(sayfa);
        }}
        theme={theme}
        onThemeToggle={toggleTheme}
        onPwaClick={() => setShowInstallModal(true)}
        onRehberClick={() => setHizliRehberOpen(true)}
      />

      {/* 2. ANA İÇERİK ALANI */}
      <div className="flex-1 w-full pb-16">
        {/* Özel Bir Alt Modül Açıksa (Uydu, Yemler, Süt vb.) */}
        {altModulTab ? (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setAltModulTab(null)}
                className="btn-secondary h-9 px-3 text-[13px]"
              >
                ← Çalışma Tezgâhına Dön
              </button>
            </div>
            {altModulTab === "veriarsivi" && <TarimVeriArsiviView showToast={showToast} />}
            {altModulTab === "hayvancilik" && (
              <HayvancilikView showToast={showToast} onGoToWizard={() => setAktifSayfa("sihirbaz")} />
            )}
            {altModulTab === "yemlerBesleme" && (
              <YemlerBeslemeView showToast={showToast} onGoToWizard={() => setAktifSayfa("sihirbaz")} />
            )}
            {altModulTab === "sutTeknolojisi" && (
              <SutUrunleriView showToast={showToast} onGoToReportAutomation={() => setAktifSayfa("sihirbaz")} />
            )}
            {altModulTab === "uyduParsel" && (
              <NdviPanel
                parselInfo={{ il: "Ankara", ilce: "Gölbaşı", ada: "102", parsel: "14", urun: "Buğday" }}
                showToast={showToast}
              />
            )}
          </div>
        ) : (
          <>
            {/* SAYFA 1: RAPORLARIM (LİSTE EKRANI & HERO PANEL) */}
            {aktifSayfa === "raporlarim" && (
              <RaporlarimView
                onYeniRapor={handleYeniRaporBaslat}
                onRaporAc={handleRaporAc}
                onRaporDuzenle={handleRaporAc}
                onKutuphaneAc={() => setAktifSayfa("kutuphane")}
              />
            )}

            {/* SAYFA 2: SİHİRBAZ EKRANI (ÜÇ KOLONLU ÇALIŞMA TEZGÂHI) */}
            {aktifSayfa === "sihirbaz" && (
              <SihirbazView
                aktifRapor={aktifRapor}
                onRaporKaydet={(guncel) => setAktifRapor(guncel)}
                onGeriDon={() => setAktifSayfa("raporlarim")}
                showToast={showToast}
              />
            )}

            {/* SAYFA 3: KÜTÜPHANE EKRANI (2 KOLONLU BİLGİ YOĞUN EMSALLER) */}
            {aktifSayfa === "kutuphane" && (
              <KutuphaneView
                onYeniRaporBaslat={handleYeniRaporBaslat}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>

      {/* 3. MODALLAR VE DİYALOGLAR */}
      {commandPaletteOpen && (
        <CommandPaletteModal
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onSelectTab={handleSelectTab}
        />
      )}

      {hizliRehberOpen && (
        <HizliRehberModal
          isOpen={hizliRehberOpen}
          onClose={() => setHizliRehberOpen(false)}
          onSelectTab={handleSelectTab}
        />
      )}

      {showInstallModal && (
        <PwaInstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          deferredPrompt={null}
          onInstallPrompt={() => {
            showToast("Uygulama tarayıcıdan yüklenebilir");
            setShowInstallModal(false);
          }}
          isStandalone={false}
        />
      )}

      {/* 4. TOAST BİLDİRİMİ */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 resmi-kart bg-[#0F3D2E] text-[#FBF9F4] px-4 py-3 shadow-lg border border-white/20 flex items-center gap-2.5 text-[14px] font-sans font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-[#B45309]"></span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

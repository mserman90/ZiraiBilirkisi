import React, { useState } from "react";
import ResmiUstBar, { AnaNavigasyon } from "@/components/resmi/ResmiUstBar";
import RaporlarimView from "@/components/resmi/RaporlarimView";
import SihirbazView from "@/components/resmi/SihirbazView";
import KutuphaneView from "@/components/resmi/KutuphaneView";
import {
  BilirKisiRaporu,
  ORNEK_RAPORLAR_LISTESI,
  YEDI_ADIM_TANIMLARI,
} from "@/data/fields";
import { TabId } from "@/types";

// Alt Modüller
import TarimVeriArsiviView from "@/components/TarimVeriArsiviView";
import HayvancilikView from "@/components/HayvancilikView";
import YemlerBeslemeView from "@/components/YemlerBeslemeView";
import SutUrunleriView from "@/components/SutUrunleriView";
import NdviPanel from "@/components/NdviPanel";

interface IndexPageProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onPwaClick?: () => void;
  onRehberClick?: () => void;
  showToast: (msg: string) => void;
}

export default function IndexPage({
  theme,
  onThemeToggle,
  onPwaClick,
  onRehberClick,
  showToast,
}: IndexPageProps) {
  // Ana Navigasyon: "raporlarim" | "kutuphane" | "sihirbaz"
  const [aktifSayfa, setAktifSayfa] = useState<AnaNavigasyon>("raporlarim");

  // Aktif açılan veya düzenlenen bilirkişi raporu
  const [aktifRapor, setAktifRapor] = useState<BilirKisiRaporu>(ORNEK_RAPORLAR_LISTESI[0]);

  // Özel alt modül görünümü (Arama veya kütüphane üzerinden doğrudan araç açıldığında)
  const [altModulTab, setAltModulTab] = useState<TabId | null>(null);

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

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen">
      {/* 1. ÜST BAR (APPSHELL) */}
      <ResmiUstBar
        aktifSayfa={aktifSayfa}
        onSayfaDegistir={(sayfa) => {
          setAltModulTab(null);
          setAktifSayfa(sayfa);
        }}
        theme={theme}
        onThemeToggle={onThemeToggle}
        onPwaClick={onPwaClick}
        onRehberClick={onRehberClick}
      />

      {/* 2. ANA İÇERİK ALANI */}
      <main className="flex-1 w-full pb-16">
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
            {/* SAYFA 1: RAPORLARIM (LİSTE EKRANI & ASİMETRİK HERO PANEL) */}
            {aktifSayfa === "raporlarim" && (
              <RaporlarimView
                onYeniRapor={handleYeniRaporBaslat}
                onRaporAc={handleRaporAc}
                onRaporDuzenle={handleRaporAc}
                onKutuphaneAc={() => setAktifSayfa("kutuphane")}
              />
            )}

            {/* SAYFA 2: SİHİRBAZ EKRANI (ÜÇ KOLONLU ÇALIŞMA TEZGÂHI: 240px / 1fr / 360px) */}
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
      </main>
    </div>
  );
}

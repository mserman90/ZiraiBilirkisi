import React, { useState, useEffect } from "react";
import ResmiUstBar, { AnaNavigasyon } from "@/components/resmi/ResmiUstBar";
import RaporlarimView from "@/components/resmi/RaporlarimView";
import SihirbazView from "@/components/resmi/SihirbazView";
import KutuphaneView from "@/components/resmi/KutuphaneView";
import AuthModal from "@/components/resmi/AuthModal";
import {
  BilirKisiRaporu,
  ORNEK_RAPORLAR_LISTESI,
  YEDI_ADIM_TANIMLARI,
  BilirKisiProfili,
  VARSAYILAN_UZMAN_PROFILI,
} from "@/data/fields";
import { TabId } from "@/types";

// Alt Modüller
import TarimVeriArsiviView from "@/components/TarimVeriArsiviView";
import HayvancilikView from "@/components/HayvancilikView";
import YemlerBeslemeView from "@/components/YemlerBeslemeView";
import SutUrunleriView from "@/components/SutUrunleriView";
import NdviPanel from "@/components/NdviPanel";
import IctihatAramaView from "@/components/IctihatAramaView";

interface IndexPageProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onPwaClick?: () => void;
  onRehberClick?: () => void;
  showToast: (msg: string) => void;
  selectedTab?: TabId | null;
  onClearSelectedTab?: () => void;
}

export default function IndexPage({
  theme,
  onThemeToggle,
  onPwaClick,
  onRehberClick,
  showToast,
  selectedTab,
  onClearSelectedTab,
}: IndexPageProps) {
  // Ana Navigasyon: "raporlarim" | "kutuphane" | "sihirbaz"
  const [aktifSayfa, setAktifSayfa] = useState<AnaNavigasyon>("raporlarim");

  // Raporlar Listesi (Kalıcı State - localStorage)
  const [raporlar, setRaporlar] = useState<BilirKisiRaporu[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zirai_bilirkisi_raporlar");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return ORNEK_RAPORLAR_LISTESI;
  });

  // Aktif açılan veya düzenlenen bilirkişi raporu
  const [aktifRapor, setAktifRapor] = useState<BilirKisiRaporu>(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("zirai_bilirkisi_aktif_id");
      if (savedId) {
        const found = raporlar.find((r) => r.id === savedId);
        if (found) return found;
      }
    }
    return raporlar[0] || ORNEK_RAPORLAR_LISTESI[0];
  });

  // Bilirkişi Kullanıcı Profili (Hesap & Erişim)
  const [profil, setProfil] = useState<BilirKisiProfili>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zirai_bilirkisi_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return VARSAYILAN_UZMAN_PROFILI;
  });

  const [authModalAcik, setAuthModalAcik] = useState(false);

  // Özel alt modül görünümü (Arama, komut paleti veya kütüphane üzerinden doğrudan araç açıldığında)
  const [altModulTab, setAltModulTab] = useState<TabId | null>(null);

  // Dışarıdan veya CommandPalette'ten gelen sekme yönlendirmesi
  useEffect(() => {
    if (!selectedTab) return;
    if (
      selectedTab === "hero" ||
      selectedTab === "tarimRaporlar" ||
      selectedTab === "hayvancilikRaporlar"
    ) {
      setAktifSayfa("raporlarim");
      setAltModulTab(null);
    } else if (
      selectedTab === "sihirbaz" ||
      selectedTab === "raporOtomasyonu" ||
      selectedTab === "hayvancilikRaporOtomasyonu"
    ) {
      setAktifSayfa("sihirbaz");
      setAltModulTab(null);
    } else if (selectedTab === "ilkeler" || selectedTab === "teorik") {
      setAktifSayfa("kutuphane");
      setAltModulTab(null);
    } else if (
      selectedTab === "veriarsivi" ||
      selectedTab === "hayvancilik" ||
      selectedTab === "yemlerBesleme" ||
      selectedTab === "sutTeknolojisi" ||
      selectedTab === "uyduParsel" ||
      selectedTab === "ictihat"
    ) {
      setAltModulTab(selectedTab);
    }
    if (onClearSelectedTab) {
      onClearSelectedTab();
    }
  }, [selectedTab, onClearSelectedTab]);

  // Rapor Değişikliğini Kaydet ve Senkronize Et
  const handleRaporKaydet = (guncel: BilirKisiRaporu) => {
    setAktifRapor(guncel);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("zirai_bilirkisi_aktif_id", guncel.id);
      } catch {}
    }
    setRaporlar((prev) => {
      const exists = prev.some((r) => r.id === guncel.id);
      const updated = exists ? prev.map((r) => (r.id === guncel.id ? guncel : r)) : [guncel, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("zirai_bilirkisi_raporlar", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  // Yeni Rapor Başlat
  const handleYeniRaporBaslat = () => {
    const yeniId = `rap-${Date.now().toString().slice(-4)}`;
    const yeniRapor: BilirKisiRaporu = {
      id: yeniId,
      baslik: "Yeni Bilirkişi Rapor Dosyası",
      dosyaNo: `${new Date().getFullYear()}/... Esas`,
      mahkeme: profil.adliYargiKomisyonu ? `${profil.adliYargiKomisyonu.split(" ")[0]} Asliye Hukuk Mahkemesi` : "Asliye Hukuk Mahkemesi",
      alan: profil.uzmanlikAlani || "ziraat",
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
      ekler: [],
    };
    handleRaporKaydet(yeniRapor);
    setAltModulTab(null);
    setAktifSayfa("sihirbaz");
    showToast("Yeni rapor taslağı başlatıldı");
  };

  // Mevcut Raporu Aç / Düzenle
  const handleRaporAc = (rapor: BilirKisiRaporu) => {
    setAktifRapor(rapor);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("zirai_bilirkisi_aktif_id", rapor.id);
      } catch {}
    }
    setAltModulTab(null);
    setAktifSayfa("sihirbaz");
  };

  // Rapor Sil
  const handleRaporSil = (id: string) => {
    const updated = raporlar.filter((r) => r.id !== id);
    setRaporlar(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("zirai_bilirkisi_raporlar", JSON.stringify(updated));
      } catch {}
    }
    if (aktifRapor.id === id) {
      if (updated.length > 0) {
        setAktifRapor(updated[0]);
      } else {
        handleYeniRaporBaslat();
      }
    }
    showToast("Rapor dosyası silindi");
  };

  // Rapor Arşivle
  const handleRaporArsivle = (id: string) => {
    const updated = raporlar.map((r) => (r.id === id ? { ...r, durum: "arsiv" as const } : r));
    setRaporlar(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("zirai_bilirkisi_raporlar", JSON.stringify(updated));
      } catch {}
    }
    if (aktifRapor.id === id) {
      setAktifRapor((prev) => ({ ...prev, durum: "arsiv" }));
    }
    showToast("Rapor arşive kaldırıldı");
  };

  // Standart Modüller Arası Metin Aktarma Fonksiyonu
  const handleMetinAktarRaporBolumune = (
    metin: string,
    bolumNo: number = 4,
    toastMsg?: string
  ) => {
    const formatliMetin = `\n\n${metin.trim()}`;
    const guncelRapor: BilirKisiRaporu = {
      ...aktifRapor,
      bolumMetinleri: {
        ...aktifRapor.bolumMetinleri,
        [bolumNo]: aktifRapor.bolumMetinleri[bolumNo]
          ? `${aktifRapor.bolumMetinleri[bolumNo]}${formatliMetin}`
          : metin.trim(),
      },
      sonGuncelleme: "Yeni veri eklendi (şimdi)",
    };

    handleRaporKaydet(guncelRapor);
    setAltModulTab(null);
    setAktifSayfa("sihirbaz");
    showToast(toastMsg || `Veri Bilirkişi Raporu Adım ${bolumNo}'e başarıyla aktarıldı`);
  };

  // Tarım Veri Arşivi Net Gelir Aktarımı
  const handleTarimVeriAktar = ({
    netGelir,
    araziTipi,
    urunAdi,
  }: {
    netGelir: number;
    araziTipi: "sulu" | "kirac" | "kuru";
    urunAdi: string;
  }) => {
    const tip = araziTipi === "kuru" ? "kıraç" : araziTipi;
    const kfo = tip === "sulu" ? 4 : 5;
    const birimM2 = ((netGelir / 1000) / (kfo / 100)).toFixed(2);
    const paragraf = `[TÜİK VE RESMİ VERİ CETVELİ DEĞERLEMESİ]\n` +
      `${urunAdi} münavebe ürünü için TÜİK ve İlçe Tarım resmi cetvellerine göre tespit edilen dekar net geliri ₺${netGelir.toLocaleString("tr-TR")}/da olup, ` +
      `${tip} tarım arazisinde %${kfo} kapitalizasyon faiz oranıyla hesaplanan çıplak toprak m² birim değeri ₺${birimM2}/m² takdir olunmuştur.`;
    handleMetinAktarRaporBolumune(paragraf, 4, `${urunAdi} net gelir ve arazi değeri Adım 4'e aktarıldı`);
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
        onProfilClick={() => setAuthModalAcik(true)}
      />

      {/* 2. ANA İÇERİK ALANI */}
      <main className="flex-1 w-full pb-16">
        {altModulTab ? (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setAltModulTab(null)}
                className="btn-secondary h-9 px-3 text-[13px] cursor-pointer"
              >
                ← Çalışma Masasına Dön
              </button>
            </div>
            {altModulTab === "veriarsivi" && (
              <TarimVeriArsiviView
                showToast={showToast}
                onTransferToWizard={handleTarimVeriAktar}
              />
            )}
            {altModulTab === "hayvancilik" && (
              <HayvancilikView
                showToast={showToast}
                onGoToWizard={() => {
                  setAltModulTab(null);
                  setAktifSayfa("sihirbaz");
                }}
                onTransferToWizard={(metin) =>
                  handleMetinAktarRaporBolumune(
                    metin,
                    4,
                    "Hayvancılık değerleme/telef tespiti Rapor Adım 4'e aktarıldı"
                  )
                }
              />
            )}
            {altModulTab === "yemlerBesleme" && (
              <YemlerBeslemeView
                showToast={showToast}
                onGoToWizard={() => {
                  setAltModulTab(null);
                  setAktifSayfa("sihirbaz");
                }}
                onTransferToWizard={(metin) =>
                  handleMetinAktarRaporBolumune(
                    metin,
                    4,
                    "Yem analizi / rasyon dökümü Rapor Adım 4'e aktarıldı"
                  )
                }
              />
            )}
            {altModulTab === "sutTeknolojisi" && (
              <SutUrunleriView
                showToast={showToast}
                onGoToReportAutomation={() => {
                  setAltModulTab(null);
                  setAktifSayfa("sihirbaz");
                }}
                onTransferToWizard={(metin) =>
                  handleMetinAktarRaporBolumune(
                    metin,
                    4,
                    "Süt teknolojisi / randıman tespiti Rapor Adım 4'e aktarıldı"
                  )
                }
              />
            )}
            {altModulTab === "uyduParsel" && (
              <NdviPanel
                parselInfo={{ il: "Ankara", ilce: "Gölbaşı", ada: "102", parsel: "14", urun: "Buğday" }}
                showToast={showToast}
                onTransferNetGelir={(net) => {
                  const kfo = 5;
                  const birimM2 = ((net / 1000) / (kfo / 100)).toFixed(2);
                  const paragraf = `[UYDU / VEJETASYON NDVI İNCELEMESİ VE DEĞERLEMESİ]\n` +
                    `Keşfe konu taşınmazın çok yıllı Sentinel-2 NDVI vejetasyon eğrisi ve tepe fotosentez verimi doğrultusunda dekar başına net gelir ₺${net.toLocaleString("tr-TR")}/da olarak modellenmiş olup, %${kfo} kapitalizasyon faiz oranıyla hesaplanan çıplak toprak birim m² değeri ₺${birimM2}/m² olarak takdir olunmuştur.`;
                  handleMetinAktarRaporBolumune(paragraf, 4, "NDVI vejetasyon analizi Rapor Sihirbazı Adım 4'e aktarıldı");
                }}
              />
            )}
            {altModulTab === "ictihat" && (
              <IctihatAramaView
                showToast={showToast}
                onTransferToWizard={(metin) =>
                  handleMetinAktarRaporBolumune(
                    metin,
                    5,
                    "Yargıtay içtihadı Adım 5 (Mevzuat ve Hukuki Dayanaklar) bölümüne aktarıldı"
                  )
                }
              />
            )}
          </div>
        ) : (
          <>
            {/* SAYFA 1: RAPORLARIM (LİSTE EKRANI & ASİMETRİK HERO PANEL) */}
            {aktifSayfa === "raporlarim" && (
              <RaporlarimView
                raporlar={raporlar}
                onYeniRapor={handleYeniRaporBaslat}
                onRaporAc={handleRaporAc}
                onRaporDuzenle={handleRaporAc}
                onKutuphaneAc={() => setAktifSayfa("kutuphane")}
                onRaporSil={handleRaporSil}
                onRaporArsivle={handleRaporArsivle}
              />
            )}

            {/* SAYFA 2: SİHİRBAZ EKRANI (ÜÇ KOLONLU ÇALIŞMA MASASI: 240px / 1fr / 360px) */}
            {aktifSayfa === "sihirbaz" && (
              <SihirbazView
                aktifRapor={aktifRapor}
                onRaporKaydet={handleRaporKaydet}
                onGeriDon={() => setAktifSayfa("raporlarim")}
                showToast={showToast}
              />
            )}

            {/* SAYFA 3: KÜTÜPHANE EKRANI (2 KOLONLU BİLGİ YOĞUN EMSALLER & TÜİK VERİ ARŞİVİ) */}
            {aktifSayfa === "kutuphane" && (
              <KutuphaneView
                onYeniRaporBaslat={handleYeniRaporBaslat}
                showToast={showToast}
                onTransferToWizard={handleTarimVeriAktar}
                onEmsalAktar={(metin) =>
                  handleMetinAktarRaporBolumune(
                    metin,
                    5,
                    "Emsal karar metni Adım 5 (Mevzuat ve Hukuki Dayanaklar) bölümüne aktarıldı"
                  )
                }
              />
            )}
          </>
        )}
      </main>

      {/* 3. BİLİRKİŞİ PROFİLİ VE YETKİLENDİRME MODALI (HESAP & ERİŞİM) */}
      <AuthModal
        isOpen={authModalAcik}
        onClose={() => setAuthModalAcik(false)}
        profil={profil}
        onProfilKaydet={(yeni) => setProfil(yeni)}
        showToast={showToast}
      />
    </div>
  );
}

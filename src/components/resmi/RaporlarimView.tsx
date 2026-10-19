import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  FileText,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  User,
} from "lucide-react";
import {
  BilirKisiRaporu,
  ORNEK_RAPORLAR_LISTESI,
  UzmanlikAlani,
  ALAN_TANIMLARI,
} from "../../data/fields";
import RaporKarti from "./RaporKarti";
import ResmiHeroPanel from "./ResmiHeroPanel";
import KenarNotu from "./KenarNotu";

interface RaporlarimViewProps {
  onYeniRapor: () => void;
  onRaporAc: (rapor: BilirKisiRaporu) => void;
  onRaporDuzenle: (rapor: BilirKisiRaporu) => void;
  onKutuphaneAc: () => void;
}

export default function RaporlarimView({
  onYeniRapor,
  onRaporAc,
  onRaporDuzenle,
  onKutuphaneAc,
}: RaporlarimViewProps) {
  // Rapor listesi durumu
  const [raporlar, setRaporlar] = useState<BilirKisiRaporu[]>(ORNEK_RAPORLAR_LISTESI);
  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliAlan, setSeciliAlan] = useState<"hepsi" | UzmanlikAlani>("hepsi");
  const [seciliDurum, setSeciliDurum] = useState<string>("hepsi");

  // Örnek durum simülasyonları için state
  const [durumModu, setDurumModu] = useState<"normal" | "yukleniyor" | "bos" | "hata">("normal");

  // Filtreleme
  const filtrelenmisRaporlar = useMemo(() => {
    if (durumModu === "bos") return [];
    return raporlar.filter((r) => {
      const alanUygun = seciliAlan === "hepsi" || r.alan === seciliAlan;
      const durumUygun = seciliDurum === "hepsi" || r.durum === seciliDurum;
      const aramaUygun =
        aramaMetni === "" ||
        r.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        r.dosyaNo.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        r.mahkeme.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        r.ozet.toLowerCase().includes(aramaMetni.toLowerCase());
      return alanUygun && durumUygun && aramaUygun;
    });
  }, [raporlar, seciliAlan, seciliDurum, aramaMetni, durumModu]);

  const handleArsivle = (id: string) => {
    setRaporlar((prev) =>
      prev.map((r) => (r.id === id ? { ...r, durum: "arsiv" as const } : r))
    );
  };

  const handleSil = (id: string) => {
    if (confirm("Bu rapor taslağını silmek istediğinize emin misiniz?")) {
      setRaporlar((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Karşılama Ekranı: Koyu yeşil hero panel ve 16:9 saha görseli */}
      <ResmiHeroPanel
        onYeniRaporBaslat={onYeniRapor}
        onKutuphaneAc={onKutuphaneAc}
      />

      {/* 2. Raporlarım Başlık ve Hızlı Filtre Bölümü */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif font-semibold text-2xl text-[hsl(var(--card-foreground))] m-0">
            Kayıtlı Bilirkişi Dosyalarım
          </h2>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-1">
            HMK 279 standartlarında hazırlanan ziraat, gıda ve hayvancılık dava dosyalarınız.
          </p>
        </div>

        {/* Yeni Rapor Butonu */}
        <button
          type="button"
          onClick={onYeniRapor}
          className="btn-primary touch-min self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yeni Dosya Başlat</span>
        </button>
      </div>

      {/* 3. Arama ve Filtreleme Araç Çubuğu */}
      <div className="resmi-kart p-3 sm:p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Arama Inputu */}
        <div className="relative flex-1">
          <label htmlFor="rapor-arama" className="sr-only">
            Rapor, dosya no veya mahkeme ara
          </label>
          <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="rapor-arama"
            type="text"
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            placeholder="Dosya no (örn: 2024/184), mahkeme veya konu ara..."
            className="w-full h-10 pl-9 pr-4 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px] focus:outline-none focus:border-[#0F3D2E] text-[hsl(var(--card-foreground))]"
          />
        </div>

        {/* Alan Filtreleri (Ziraat / Gıda / Hayvancılık) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSeciliAlan("hepsi")}
            className={`h-9 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
              seciliAlan === "hepsi"
                ? "bg-[#0F3D2E] text-[#FBF9F4]"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"
            }`}
          >
            Tüm Alanlar ({raporlar.length})
          </button>

          {(["ziraat", "gida", "hayvancilik"] as UzmanlikAlani[]).map((alan) => (
            <button
              key={alan}
              type="button"
              onClick={() => setSeciliAlan(alan)}
              className={`h-9 px-3 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                seciliAlan === alan
                  ? "bg-[#0F3D2E] text-[#FBF9F4]"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"
              }`}
            >
              {ALAN_TANIMLARI[alan].ad.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Durum Görünümleri (States) */}

      {/* Yükleniyor Durumu: İskelet Satırlar */}
      {durumModu === "yukleniyor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="resmi-kart p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-24 h-5 iskelet-satir"></div>
                <div className="w-16 h-5 iskelet-satir"></div>
              </div>
              <div className="w-3/4 h-6 iskelet-satir"></div>
              <div className="w-full h-12 iskelet-satir"></div>
              <div className="pt-3 border-t border-[hsl(var(--border))] flex justify-between">
                <div className="w-28 h-4 iskelet-satir"></div>
                <div className="w-20 h-4 iskelet-satir"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hata Durumu: Kırmızı Kenar Notu + Yeniden Dene */}
      {durumModu === "hata" && (
        <div className="space-y-4 py-6">
          <KenarNotu tip="hata" baslik="Veri Yükleme Hatası">
            Dosya kayıtları mahkeme UYAP sunucusundan alınırken beklenmeyen bir bağlantı kesintisi oluştu. İnternet bağlantınızı kontrol edip lütfen yeniden deneyiniz.
          </KenarNotu>
          <button
            type="button"
            onClick={() => setDurumModu("normal")}
            className="btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Dene</span>
          </button>
        </div>
      )}

      {/* Boş Durum: Açıklayıcı Boş Durum + CTA */}
      {durumModu !== "yukleniyor" && durumModu !== "hata" && filtrelenmisRaporlar.length === 0 && (
        <div className="resmi-kart p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-semibold text-xl text-[hsl(var(--card-foreground))] m-0">
              Henüz Kayıtlı Rapor Bulunmuyor
            </h3>
            <p className="font-sans text-[14px] text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
              Arama kriterlerinize uygun dosya bulunamadı veya henüz bir bilirkişi raporu oluşturmadınız. 7 adımlı sihirbaz ile ilk dosyanızı hemen başlatabilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={onYeniRapor}
            className="btn-primary mt-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>İlk Raporunuzu Oluşturun</span>
          </button>
        </div>
      )}

      {/* 5. Normal Liste Görünümü: 3'lü Kart Gridi */}
      {durumModu === "normal" && filtrelenmisRaporlar.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrelenmisRaporlar.map((rapor) => (
            <RaporKarti
              key={rapor.id}
              rapor={rapor}
              onAc={onRaporAc}
              onDuzenle={onRaporDuzenle}
              onArsivle={handleArsivle}
              onSil={handleSil}
            />
          ))}
        </div>
      )}
    </div>
  );
}

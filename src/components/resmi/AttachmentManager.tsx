import React, { useState, useRef } from "react";
import {
  Paperclip,
  Upload,
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { RaporEki } from "../../data/fields";

interface AttachmentManagerProps {
  ekler: RaporEki[];
  onEklerGuncelle: (yeniEkler: RaporEki[]) => void;
  showToast: (msg: string) => void;
}

export default function AttachmentManager({
  ekler = [],
  onEklerGuncelle,
  showToast,
}: AttachmentManagerProps) {
  const [modalAcik, setModalAcik] = useState(false);
  const [seciliTur, setSeciliTur] = useState<RaporEki["tur"]>("fotograf");
  const [belgeAdi, setBelgeAdi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [yuklenenDosyaAdi, setYuklenenDosyaAdi] = useState("");
  const [yuklenenBoyut, setYuklenenBoyut] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya Seçildiğinde
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setYuklenenDosyaAdi(file.name);
      setYuklenenBoyut(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      if (!belgeAdi) {
        setBelgeAdi(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Yeni Ek Kaydet
  const handleEkEkle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!belgeAdi.trim()) {
      showToast("Lütfen bir belge adı giriniz");
      return;
    }

    const yeniEk: RaporEki = {
      id: `ek-${Date.now()}`,
      ad: belgeAdi.trim(),
      tur: seciliTur,
      dosyaAdi: yuklenenDosyaAdi || `${belgeAdi.toLowerCase().replace(/\s+/g, "_")}.pdf`,
      boyut: yuklenenBoyut || "1.42 MB",
      yuklemeTarihi: new Date().toLocaleDateString("tr-TR"),
      aciklama: aciklama.trim(),
    };

    onEklerGuncelle([...ekler, yeniEk]);
    setModalAcik(false);
    setBelgeAdi("");
    setAciklama("");
    setYuklenenDosyaAdi("");
    setYuklenenBoyut("");
    showToast("Belge rapora ek olarak kaydedildi");
  };

  // Ek Sil
  const handleEkSil = (id: string) => {
    onEklerGuncelle(ekler.filter((ek) => ek.id !== id));
    showToast("Ek rapordan kaldırıldı");
  };

  // Ek İndir
  const handleEkIndir = (ek: RaporEki) => {
    const dummyContent = `T.C. BİLİRKİŞİ RAPORU EK BELGESİ\n\nBelge Adı: ${ek.ad}\nTür: ${ek.tur.toUpperCase()}\nDosya: ${ek.dosyaAdi}\nYükleme Tarihi: ${ek.yuklemeTarihi}\nAçıklama: ${ek.aciklama || "Yok"}\n\nBu belge resmi bilirkişi raporunun ayrılmaz bir ekidir.`;
    const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = ek.dosyaAdi;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${ek.dosyaAdi} indirildi`);
  };

  const getTurBadge = (tur: RaporEki["tur"]) => {
    switch (tur) {
      case "fotograf":
        return <span className="alan-badge-hayvancilik text-[11px]">Keşif Fotoğrafı</span>;
      case "tapu":
        return <span className="alan-badge-ziraat text-[11px]">Tapu Kaydı</span>;
      case "kadastro":
        return <span className="alan-badge-gida text-[11px]">Kadastro Paftası</span>;
      case "resmi_yazi":
        return <span className="durum-badge-inceleniyor text-[11px]">Resmî Kurum Yazısı</span>;
      case "laboratuvar":
        return <span className="durum-badge-tamamlandi text-[11px]">Laboratuvar Analizi</span>;
      default:
        return <span className="durum-badge-taslak text-[11px]">Ek Belge</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Başlık ve Ekle Butonu */}
      <div className="flex items-center justify-between gap-2 border-b border-[hsl(var(--border))] pb-3">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-[#B45309]" />
          <h3 className="font-serif font-semibold text-[16px] text-[hsl(var(--card-foreground))] m-0">
            Rapor Ekleri & Saha Belgeleri
          </h3>
          <span className="font-mono text-[12px] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-[4px] text-[hsl(var(--muted-foreground))]">
            {ekler.length} Ek
          </span>
        </div>

        <button
          type="button"
          onClick={() => setModalAcik(true)}
          className="h-8 px-3 rounded-[6px] text-[12.5px] font-sans font-semibold bg-[#0F3D2E] text-[#FBF9F4] hover:bg-[#16533f] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Belge Ekle</span>
        </button>
      </div>

      {/* Ek Listesi */}
      {ekler.length === 0 ? (
        <div className="border border-dashed border-[hsl(var(--border))] rounded-[8px] p-6 text-center space-y-2 bg-[hsl(var(--muted))]/30">
          <Paperclip className="w-8 h-8 mx-auto text-[hsl(var(--muted-foreground))]" />
          <p className="text-[13.5px] font-sans text-[hsl(var(--muted-foreground))]">
            Henüz eklenmiş keşif fotoğrafı veya resmi belge bulunmuyor.
          </p>
          <button
            type="button"
            onClick={() => setModalAcik(true)}
            className="btn-secondary h-8 px-3 text-[12.5px] mt-1"
          >
            İlk Belgeyi Yükle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ekler.map((ek) => (
            <div
              key={ek.id}
              className="border border-[hsl(var(--border))] rounded-[6px] p-3 bg-[hsl(var(--card))] flex flex-col justify-between space-y-2 hover:border-[#0F3D2E]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  {getTurBadge(ek.tur)}
                  <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                    {ek.boyut}
                  </span>
                </div>
                <h4 className="font-serif font-semibold text-[14px] text-[hsl(var(--card-foreground))] m-0 truncate">
                  {ek.ad}
                </h4>
                {ek.aciklama && (
                  <p className="text-[12px] text-[hsl(var(--muted-foreground))] line-clamp-1 mt-0.5">
                    {ek.aciklama}
                  </p>
                )}
                <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] mt-1">
                  {ek.dosyaAdi} • {ek.yuklemeTarihi}
                </div>
              </div>

              <div className="pt-2 border-t border-[hsl(var(--border))] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleEkIndir(ek)}
                  className="text-[12px] text-[#0F3D2E] dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>İndir</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEkSil(ek.id)}
                  className="text-[12px] text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kaldır</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Belge Yükleme Modalı */}
      {modalAcik && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="resmi-kart bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <h3 className="font-serif font-semibold text-[18px] m-0">
                Yeni Rapor Eki Yükle
              </h3>
              <button
                type="button"
                onClick={() => setModalAcik(false)}
                className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEkEkle} className="space-y-4">
              {/* Belge Türü */}
              <div>
                <label className="block text-[13px] font-medium mb-1">
                  Belge Türü
                </label>
                <select
                  value={seciliTur}
                  onChange={(e) => setSeciliTur(e.target.value as RaporEki["tur"])}
                  className="w-full h-10 px-3 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
                >
                  <option value="fotograf">Keşif Fotoğrafı (Saha Tespiti)</option>
                  <option value="tapu">Tapu Senedi & Takyidat Belgesi</option>
                  <option value="kadastro">Kadastro Çapı & Harita Paftası</option>
                  <option value="resmi_yazi">İlçe Tarım / DSİ / Karayolları Resmî Yazısı</option>
                  <option value="laboratuvar">Toprak / Yem / Süt Laboratuvar Analiz Raporu</option>
                  <option value="diger">Diğer Hukuki / Teknik Belge</option>
                </select>
              </div>

              {/* Belge Adı */}
              <div>
                <label className="block text-[13px] font-medium mb-1">
                  Belge Başlığı
                </label>
                <input
                  type="text"
                  value={belgeAdi}
                  onChange={(e) => setBelgeAdi(e.target.value)}
                  placeholder="Örn: 102 Ada 14 Parsel Doğu Cephesi Keşif Fotoğrafı"
                  className="w-full h-10 px-3 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
                  required
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-[13px] font-medium mb-1">
                  Açıklama / Not
                </label>
                <textarea
                  value={aciklama}
                  onChange={(e) => setAciklama(e.target.value)}
                  placeholder="Fotoğrafın çekildiği yön, hava durumu veya belgenin rapordaki önemi..."
                  className="w-full h-20 p-2.5 text-[13.5px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
                />
              </div>

              {/* Dosya Seç */}
              <div>
                <label className="block text-[13px] font-medium mb-1">
                  Dosya Seçin
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full text-[13px] file:mr-3 file:py-2 file:px-3 file:rounded-[6px] file:border-0 file:bg-[#0F3D2E] file:text-[#FBF9F4] file:cursor-pointer"
                />
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => setModalAcik(false)}
                  className="btn-secondary h-10 px-4"
                >
                  İptal
                </button>
                <button type="submit" className="btn-primary h-10 px-5">
                  <Upload className="w-4 h-4" />
                  <span>Eki Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

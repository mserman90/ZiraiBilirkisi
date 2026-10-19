import React, { useState } from "react";
import { User, ShieldCheck, Save, X, Building2, Award, Mail, Phone } from "lucide-react";
import { BilirKisiProfili, UzmanlikAlani, VARSAYILAN_UZMAN_PROFILI } from "../../data/fields";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profil: BilirKisiProfili;
  onProfilKaydet: (yeniProfil: BilirKisiProfili) => void;
  showToast: (msg: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  profil,
  onProfilKaydet,
  showToast,
}: AuthModalProps) {
  const [formData, setFormData] = useState<BilirKisiProfili>(profil || VARSAYILAN_UZMAN_PROFILI);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfilKaydet(formData);
    localStorage.setItem("zirai_bilirkisi_user", JSON.stringify(formData));
    showToast("Bilirkişi uzmanlık profili güncellendi");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-text"
    >
      <div className="resmi-kart bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 w-full max-w-lg shadow-2xl space-y-5">
        {/* Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-[18px] m-0">
                Bilirkişi Uzman Profili & Yetkilendirme
              </h3>
              <p className="text-[12px] font-sans text-[hsl(var(--muted-foreground))] m-0">
                Resmî rapor imzalarında ve mahkeme künyesinde yer alacak bilgiler
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ad Soyad */}
          <div>
            <label className="block text-[13px] font-medium mb-1">
              Bilirkişi Adı & Soyadı
            </label>
            <input
              type="text"
              value={formData.adSoyad}
              onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
              className="w-full h-10 px-3 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
              required
            />
          </div>

          {/* Unvan */}
          <div>
            <label className="block text-[13px] font-medium mb-1">
              Mesleki Unvan
            </label>
            <input
              type="text"
              value={formData.unvan}
              onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
              placeholder="Örn: Ziraat Yüksek Mühendisi / Tarımsal Değerleme Uzmanı"
              className="w-full h-10 px-3 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
              required
            />
          </div>

          {/* Uzmanlık Alanı & Sicil No (2 Kolon) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium mb-1">
                Ana Uzmanlık Alanı
              </label>
              <select
                value={formData.uzmanlikAlani}
                onChange={(e) =>
                  setFormData({ ...formData, uzmanlikAlani: e.target.value as UzmanlikAlani })
                }
                className="w-full h-10 px-3 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
              >
                <option value="ziraat">01 Ziraat Mühendisliği</option>
                <option value="gida">26 Gıda Mühendisliği</option>
                <option value="hayvancilik">02 Zootekni & Veteriner</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1">
                Bilirkişilik Sicil No
              </label>
              <input
                type="text"
                value={formData.sicilNo}
                onChange={(e) => setFormData({ ...formData, sicilNo: e.target.value })}
                placeholder="Örn: 06-1842"
                className="w-full h-10 px-3 text-[14px] font-mono bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
                required
              />
            </div>
          </div>

          {/* Oda Sicil & Adli Yargı Komisyonu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium mb-1">
                Meslek Odası Sicil No
              </label>
              <input
                type="text"
                value={formData.odaSicilNo}
                onChange={(e) => setFormData({ ...formData, odaSicilNo: e.target.value })}
                placeholder="Örn: TMMOB-ZMO-41920"
                className="w-full h-10 px-3 text-[14px] font-mono bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1">
                Adli Yargı Komisyonu
              </label>
              <input
                type="text"
                value={formData.adliYargiKomisyonu}
                onChange={(e) =>
                  setFormData({ ...formData, adliYargiKomisyonu: e.target.value })
                }
                placeholder="Örn: Ankara Adli Yargı Komisyonu"
                className="w-full h-10 px-3 text-[14px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[8px]"
                required
              />
            </div>
          </div>

          {/* Alt Butonlar */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[hsl(var(--border))]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-10 px-4"
            >
              Vazgeç
            </button>
            <button type="submit" className="btn-primary h-10 px-5">
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Profili Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  BookOpen,
  Plus,
  User,
  Sun,
  Moon,
  Smartphone,
  HelpCircle,
  Menu,
  X,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

export type AnaNavigasyon = "raporlarim" | "kutuphane" | "sihirbaz";

interface ResmiUstBarProps {
  aktifSayfa: AnaNavigasyon;
  onSayfaDegistir: (sayfa: AnaNavigasyon) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onPwaClick?: () => void;
  onRehberClick?: () => void;
  onProfilClick?: () => void;
}

/**
 * ÜstBar (AppShell)
 * - --primary dolgu (#0F3D2E), border-b, blur yok
 * - Sol tarafta ürün adı (Fraunces 600, 20px)
 * - Sağda navigasyon bağlantıları: Raporlarım / Kütüphane / Yeni Rapor
 * - Yalnızca avatar simgesi butonu (Kullanıcı adı/e-posta gösterilmez!)
 */
export default function ResmiUstBar({
  aktifSayfa,
  onSayfaDegistir,
  theme,
  onThemeToggle,
  onPwaClick,
  onRehberClick,
  onProfilClick,
}: ResmiUstBarProps) {
  const [avatarMenuAcik, setAvatarMenuAcik] = useState(false);
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setAvatarMenuAcik(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="resmi-ustbar sticky top-0 z-50 w-full h-14 select-none">
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Sol: Ürün Adı */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSayfaDegistir("raporlarim")}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[#B45309] flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="font-serif font-bold text-[17px] leading-none">B</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-[19px] sm:text-[20px] leading-tight text-[#FBF9F4] tracking-tight group-hover:text-amber-200 transition-colors">
                Bilirkişi Rapor Masası
              </span>
              <span className="text-[10.5px] font-mono uppercase text-[#FBF9F4]/60 tracking-wider hidden sm:inline">
                T.C. HMK 279 ÇALIŞMA ORTAMI
              </span>
            </div>
          </button>
        </div>

        {/* Sağ: Navigasyon Bağlantıları & Avatar İkonu (Masaüstü) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Raporlarım */}
          <button
            type="button"
            onClick={() => onSayfaDegistir("raporlarim")}
            className={`h-10 px-3.5 rounded-[8px] text-[14px] font-sans font-semibold transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer ${
              aktifSayfa === "raporlarim"
                ? "bg-white/15 text-[#FBF9F4] border-b-2 border-[#B45309]"
                : "text-[#FBF9F4]/80 hover:text-[#FBF9F4] hover:bg-white/10"
            }`}
          >
            <FolderOpen className="w-4 h-4" aria-hidden="true" />
            <span>Raporlarım</span>
          </button>

          {/* Kütüphane */}
          <button
            type="button"
            onClick={() => onSayfaDegistir("kutuphane")}
            className={`h-10 px-3.5 rounded-[8px] text-[14px] font-sans font-semibold transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer ${
              aktifSayfa === "kutuphane"
                ? "bg-white/15 text-[#FBF9F4] border-b-2 border-[#B45309]"
                : "text-[#FBF9F4]/80 hover:text-[#FBF9F4] hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Kütüphane</span>
          </button>

          {/* Yeni Rapor */}
          <button
            type="button"
            onClick={() => onSayfaDegistir("sihirbaz")}
            className={`h-10 px-4 rounded-[8px] text-[14px] font-sans font-semibold transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer ${
              aktifSayfa === "sihirbaz"
                ? "bg-[#B45309] text-[#FBF9F4] border border-amber-500/50"
                : "bg-white/10 text-[#FBF9F4] hover:bg-[#B45309] border border-white/10"
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            <span>Yeni Rapor</span>
          </button>

          {/* Dikey Ayırıcı */}
          <div className="w-[1px] h-6 bg-white/20 mx-1" aria-hidden="true" />

          {/* Kullanıcı Avatar Simgesi (Yalnızca ikon, isim/e-posta gösterilmez) */}
          <div className="relative" ref={avatarRef}>
            <button
              type="button"
              onClick={() => setAvatarMenuAcik(!avatarMenuAcik)}
              aria-label="Kullanıcı Menüsü ve Ayarlar"
              aria-expanded={avatarMenuAcik}
              className="btn-icon-40 bg-white/10 hover:bg-white/20 text-[#FBF9F4] border border-white/20"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Avatar Açılır Menüsü */}
            {avatarMenuAcik && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 resmi-kart bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-lg p-2 z-50 border border-[hsl(var(--border))]"
              >
                <div className="px-3 py-2 border-b border-[hsl(var(--border))] mb-1">
                  <div className="text-[11px] font-mono uppercase text-[hsl(var(--muted-foreground))]">
                    UZMAN PROFİLİ
                  </div>
                  <div className="text-[13px] font-sans font-semibold text-[hsl(var(--card-foreground))]">
                    Bilirkişi Çalışma Alanı
                  </div>
                </div>

                {/* Bilirkişi Profili */}
                {onProfilClick && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onProfilClick();
                      setAvatarMenuAcik(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-sans rounded-[4px] hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-[#0F3D2E] dark:text-emerald-400" />
                    <span>Bilirkişi Kimlik & Sicil</span>
                  </button>
                )}

                {/* Tema Değiştir */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onThemeToggle();
                    setAvatarMenuAcik(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-sans rounded-[4px] hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{theme === "dark" ? "Gündüz Modu" : "Gece Modu"}</span>
                  </span>
                  <span className="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">
                    {theme === "dark" ? "Koyu" : "Açık"}
                  </span>
                </button>

                {/* PWA Kur */}
                {onPwaClick && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onPwaClick();
                      setAvatarMenuAcik(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-sans rounded-[4px] hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer text-left"
                  >
                    <Smartphone className="w-4 h-4 text-[#15803D]" />
                    <span>Masaüstü / Mobil Uygulama</span>
                  </button>
                )}

                {/* Kılavuz */}
                {onRehberClick && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onRehberClick();
                      setAvatarMenuAcik(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-sans rounded-[4px] hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-[#B45309]" />
                    <span>Bilirkişi Kılavuzu</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobil Menü Butonu */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onThemeToggle}
            aria-label="Tema Değiştir"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FBF9F4]"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobilMenuAcik(!mobilMenuAcik)}
            aria-label="Menüyü Aç/Kapat"
            className="w-10 h-10 rounded-[8px] bg-white/10 flex items-center justify-center text-[#FBF9F4]"
          >
            {mobilMenuAcik ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobil Açılır Menü */}
      {mobilMenuAcik && (
        <div className="md:hidden bg-[#0F3D2E] border-b border-white/20 px-4 py-3 space-y-2">
          <button
            type="button"
            onClick={() => {
              onSayfaDegistir("raporlarim");
              setMobilMenuAcik(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[14px] font-semibold text-left ${
              aktifSayfa === "raporlarim" ? "bg-white/20 text-white" : "text-white/80"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Raporlarım</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSayfaDegistir("kutuphane");
              setMobilMenuAcik(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[14px] font-semibold text-left ${
              aktifSayfa === "kutuphane" ? "bg-white/20 text-white" : "text-white/80"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kütüphane</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSayfaDegistir("sihirbaz");
              setMobilMenuAcik(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[14px] font-semibold text-left ${
              aktifSayfa === "sihirbaz" ? "bg-[#B45309] text-white" : "bg-white/10 text-white"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Rapor</span>
          </button>

          {onProfilClick && (
            <button
              type="button"
              onClick={() => {
                onProfilClick();
                setMobilMenuAcik(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[14px] font-semibold text-left bg-white/10 text-white"
            >
              <User className="w-4 h-4 text-emerald-300" />
              <span>Bilirkişi Kimlik & Sicil</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

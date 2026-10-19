import React, { useState, useEffect } from "react";
import IndexPage from "@/pages/Index";
import PwaInstallModal from "@/components/PwaInstallModal";
import HizliRehberModal from "@/components/HizliRehberModal";
import CommandPaletteModal from "@/components/CommandPaletteModal";
import { TabId } from "@/types";

/**
 * App.tsx — Router / Shell
 * Shadcn-UI & Tasarım Sistemi standartlarına göre yapılandırılmış kabuk.
 * Sayfa yönlendirmeleri, global diyaloglar ve toast bildirimlerini yönetir.
 */
export default function App() {
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

  // Klavye Kısayolları (Ctrl+K, F1)
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

  const handleSelectTab = (tab: TabId) => {
    // Komut paleti tab seçimlerini yönetir
    showToast(`${tab} modülü seçildi`);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--card-foreground))] antialiased flex flex-col transition-colors duration-150">
      {/* Ana Sayfa Giriş Noktası */}
      <IndexPage
        theme={theme}
        onThemeToggle={toggleTheme}
        onPwaClick={() => setShowInstallModal(true)}
        onRehberClick={() => setHizliRehberOpen(true)}
        showToast={showToast}
      />

      {/* Global Modallar */}
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

      {/* Toast Bildirimi */}
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

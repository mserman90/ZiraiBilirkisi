import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  X,
  FileCheck,
  Beef,
  Wheat,
  Milk,
  Wand2,
  Database,
  FileText,
  Satellite,
  MessageSquare,
  Camera,
  Microscope,
  Scale,
  ShieldCheck,
  BookOpen,
  Monitor,
  Home,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { TabId } from "../types";

export interface SearchItem {
  id: string;
  tabId: TabId;
  title: string;
  category: "Dava Raporları" | "01 Tarım" | "02 Hayvancılık" | "AI & Araçlar" | "Eğitim & Mevzuat";
  description: string;
  keywords: string[];
  badge?: string;
  icon: React.ReactNode;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Dava Raporu Otomasyonları
  {
    id: "oto-tarim",
    tabId: "raporOtomasyonu",
    title: "01 Tarım Adım Adım Rapor Otomasyonu",
    category: "Dava Raporları",
    description: "Kamulaştırma, ecrimisil, irtifak, zirai yapı ve meyve ağacı için 6 adımlı heyet raporu.",
    keywords: ["kamulaştırma", "ecrimisil", "rapor", "2942", "ağaç", "irtifak", "kısmı", "yapı", "otomasyon", "a4", "word", "uyap"],
    badge: "YÖNLENDİRMELİ",
    icon: <FileCheck size={18} className="text-emerald-400" />,
  },
  {
    id: "oto-hayvan",
    tabId: "hayvancilikRaporOtomasyonu",
    title: "02 Hayvancılık Rapor Otomasyonu",
    category: "Dava Raporları",
    description: "Hayvan telefi, haksız fiil, TARSİM hasarı, yem zehirlenmesi ve süt ayıbı heyet raporu.",
    keywords: ["hayvancılık", "telef", "elektrik", "tarsim", "zehirlenme", "yem", "mandıra", "süt", "kurtarma eti", "tbk 55", "karkas", "haciz"],
    badge: "YÖNLENDİRMELİ",
    icon: <Beef size={18} className="text-amber-400" />,
  },

  // 01 Tarım Modülleri
  {
    id: "tarim-sihirbaz",
    tabId: "sihirbaz",
    title: "01.05 Zirai Değerleme Sihirbazı",
    category: "01 Tarım",
    description: "Net gelir metodu, KFO (Kapitalizasyon faiz oranı), ODA katsayıları ve ecrimisil artış hesabı.",
    keywords: ["sihirbaz", "kfo", "net gelir", "kapitalizasyon", "münavebe", "oda", "çiftçi", "kamulaştırma bedeli"],
    badge: "KFO / ODA",
    icon: <Wand2 size={18} className="text-emerald-400" />,
  },
  {
    id: "tarim-veri",
    tabId: "veriarsivi",
    title: "Tarım Veri Arşivi (TÜİK & Tarım İlçe)",
    category: "01 Tarım",
    description: "81 il ve ilçeleri için resmi ürün verimleri, satış fiyatları ve dekar maliyet cetvelleri.",
    keywords: ["tüik", "veri", "arşiv", "fiyat", "verim", "maliyet", "çegf", "üfe", "buğday", "mısır", "arpa", "pamuk"],
    badge: "81 İL",
    icon: <Database size={18} className="text-emerald-400" />,
  },
  {
    id: "tarim-ornek",
    tabId: "tarimRaporlar",
    title: "Tarım Örnek Raporları Kütüphanesi",
    category: "01 Tarım",
    description: "Yargıtay 5. ve 3. Hukuk Dairesi onaylı emsal kamulaştırma ve ecrimisil raporları.",
    keywords: ["örnek", "emsal", "rapor", "metin", "şablon", "kamulaştırma örneği", "ecrimisil örneği"],
    badge: "İÇTİHATLI",
    icon: <FileText size={18} className="text-emerald-400" />,
  },

  // 02 Hayvancılık Modülleri
  {
    id: "hayvan-degerleme",
    tabId: "hayvancilik",
    title: "02.01 Hayvan Yetiştiriciliği & Telef Hesabı",
    category: "02 Hayvancılık",
    description: "29 büyükbaş/küçükbaş/kanatlı ırkı, karkas randımanı, amortisman ve hurda et mahsubu.",
    keywords: ["ırk", "büyükbaş", "küçükbaş", "kanatlı", "holstein", "simental", "merinos", "broiler", "telefat", "hurda mahsubu"],
    badge: "29 IRK",
    icon: <Beef size={18} className="text-amber-400" />,
  },
  {
    id: "hayvan-yem",
    tabId: "yemlerBesleme",
    title: "02.05 Yemler & Hayvan Besleme",
    category: "02 Hayvancılık",
    description: "NRC/TÜBİTAK TMR rasyon hesabı, yem analiz laboratuvar kontrolü ve mikotoksin/aflatoksin hasarı.",
    keywords: ["yem", "rasyon", "besleme", "aflatoksin", "silaj", "küspe", "protein", "kaba yem", "kesif yem", "toksin"],
    badge: "RASYON AI",
    icon: <Wheat size={18} className="text-emerald-400" />,
  },
  {
    id: "hayvan-sut",
    tabId: "sutTeknolojisi",
    title: "02.06 Süt Teknolojisi & Mandıra",
    category: "02 Hayvancılık",
    description: "Çiğ süt TGK kalite denetimi, su katılması (kriyoskopi), asitlik (SH), somatik hücre ve mandıra randımanı.",
    keywords: ["süt", "mandıra", "kriyoskopi", "donma noktası", "asitlik", "somatik hücre", "peynir randımanı", "usk"],
    badge: "TGK • KRİYOSKOPİ",
    icon: <Milk size={18} className="text-sky-400" />,
  },
  {
    id: "hayvan-ornek",
    tabId: "hayvancilikRaporlar",
    title: "Hayvancılık Örnek Raporları",
    category: "02 Hayvancılık",
    description: "Elektrik çarpması, trafik kazası, yem toksin ve mandıra alacak davaları tam metin raporları.",
    keywords: ["hayvancılık örneği", "telef örneği", "yem davası", "elektrik çarpması raporu"],
    badge: "İÇTİHATLI",
    icon: <FileCheck size={18} className="text-amber-400" />,
  },

  // AI & Saha Araçları
  {
    id: "arac-uydu",
    tabId: "uyduParsel",
    title: "Uydu Parsel AI & TKGM Kadastro Doğrulama",
    category: "AI & Araçlar",
    description: "Sentinel-2 L2A 10m NDVI analizi, Esri 0.5m uydu haritası ve TKGM ada/parsel sınır tespiti.",
    keywords: ["uydu", "parsel", "tkgm", "ada", "ndvi", "sentinel", "kadastro", "koordinat", "itrf96", "harita"],
    badge: "PREMIUM",
    icon: <Satellite size={18} className="text-sky-400" />,
  },
  {
    id: "arac-ai-asistan",
    tabId: "aiAsistan",
    title: "AI Saha Asistanı (Meta AI)",
    category: "AI & Araçlar",
    description: "Keşif esnasında sesli ve yazılı bilirkişilik mevzuat ve formül danışmanı.",
    keywords: ["ai", "asistan", "meta ai", "sesli", "soru", "mevzuat", "danışman", "chat"],
    badge: "SESLİ ASİSTAN",
    icon: <MessageSquare size={18} className="text-sky-400" />,
  },
  {
    id: "arac-foto",
    tabId: "fotoAnaliz",
    title: "Fotoğraf Analiz AI (Vision)",
    category: "AI & Araçlar",
    description: "Saha fotoğraflarından bitki fenolojisi, hastalık lezyonları ve zarar yüzdesi analizi.",
    keywords: ["fotoğraf", "vision", "görüntü", "hasar tespiti", "lezyon", "nekropsi", "bitki hastalığı"],
    badge: "VISION",
    icon: <Camera size={18} className="text-teal-400" />,
  },
  {
    id: "arac-tarayici",
    tabId: "tarayici",
    title: "HMK 279 Tarafsızlık & Kusur Tarayıcısı",
    category: "AI & Araçlar",
    description: "Rapor metnindeki yasaklı hukuki terimleri ('kusur', 'mülkiyet', 'kasıt') tespit eder.",
    keywords: ["hmk 279", "kusur", "yasaklı terim", "tarayıcı", "denetim", "tarafsızlık"],
    badge: "GÜVENLİK",
    icon: <Microscope size={18} className="text-purple-400" />,
  },
  {
    id: "arac-ictihat",
    tabId: "ictihat",
    title: "Resmi Yargıtay İçtihat Arama Motoru",
    category: "AI & Araçlar",
    description: "Yargıtay 3, 5, 8 ve 11. Hukuk Dairesi kararları, anahtar kelime ve konu filtreleme.",
    keywords: ["içtihat", "yargıtay", "karar", "hukuk dairesi", "emsal", "bozma gerekçesi"],
    badge: "YARGITAY DB",
    icon: <Scale size={18} className="text-amber-400" />,
  },

  // Eğitim & Standartlar
  {
    id: "egitim-ilkeler",
    tabId: "ilkeler",
    title: "Bilirkişilik Rehber İlkeleri & Standartlar",
    category: "Eğitim & Mevzuat",
    description: "Adalet Bakanlığı resmi bilirkişilik kılavuz ilkeleri, doğru ve yanlış örnek uygulamalar.",
    keywords: ["ilkeler", "standartlar", "rehber", "adalet bakanlığı", "etik", "hukuki sorumluluk"],
    badge: "RESMİ REHBER",
    icon: <ShieldCheck size={18} className="text-indigo-400" />,
  },
  {
    id: "egitim-teorik",
    tabId: "teorik",
    title: "Aday Bilirkişi Teorik Eğitim Modülleri",
    category: "Eğitim & Mevzuat",
    description: "5 ana ders modülü, interaktif bilgi testi ve sertifika sınav hazırlık sistemi.",
    keywords: ["teorik", "eğitim", "modül", "sınav", "ders", "aday", "test"],
    badge: "5 MODÜL",
    icon: <BookOpen size={18} className="text-indigo-400" />,
  },
  {
    id: "egitim-uyap",
    tabId: "uyap",
    title: "UYAP Bilirkişi Portal Başvuru Simülasyonu",
    category: "Eğitim & Mevzuat",
    description: "UYAP sistemi başvuru ekranları, belge yükleme ve uzmanlık alanı kayıt simülatörü.",
    keywords: ["uyap", "portal", "başvuru", "simülatör", "uzmanlık alanı", "sicil"],
    badge: "UYAP REHBERİ",
    icon: <Monitor size={18} className="text-indigo-400" />,
  },
];

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabId) => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectTab,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const categories = ["Tümü", "Dava Raporları", "01 Tarım", "02 Hayvancılık", "AI & Araçlar", "Eğitim & Mevzuat"];

  const filteredItems = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    return SEARCH_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "Tümü" || item.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!cleanQuery) return true;

      const titleMatch = item.title.toLowerCase().includes(cleanQuery);
      const descMatch = item.description.toLowerCase().includes(cleanQuery);
      const keywordMatch = item.keywords.some((k) => k.includes(cleanQuery));

      return titleMatch || descMatch || keywordMatch;
    });
  }, [query, selectedCategory]);

  // Klavye yön tuşları kontrolü
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex].tabId);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems]);

  const handleSelect = (tabId: TabId) => {
    onSelectTab(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-4 sm:mt-10 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arama Başlığı & Giriş Kutusu */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#131d31]">
          <Search size={22} className="text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Modül, dava türü, kanun maddesi veya formül arayın... (örn: kamulaştırma, telef, KFO)"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Kategori Filtre Butonları */}
        <div className="px-4 py-2 bg-[#0b1222] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-medium text-xs ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-xs"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Arama Sonuçları Listesi */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-white/5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Sparkles size={28} className="mx-auto text-slate-500" />
              <p className="font-semibold text-sm text-slate-300">Aramanıza uygun modül veya konu bulunamadı.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                "kamulaştırma", "telef", "rasyon", "uydu", "tüik", "ecrimisil" gibi kelimeleri deneyebilirsiniz.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.tabId)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition ${
                    isSelected
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-white"
                      : "hover:bg-white/5 text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-emerald-300 font-semibold border border-white/10 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden sm:inline">
                      {item.category}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-500"
                      }`}
                    >
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Alt Bilgi Çubuğu (Keyboard Shortcuts) */}
        <div className="px-5 py-3 bg-[#0b1222] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">↓</kbd>
              <span>Gezin</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">Enter</kbd>
              <span>Seç</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Sparkles size={13} />
            <span>Toplam {SEARCH_ITEMS.length} Uzmanlık Modülü</span>
          </div>
        </div>
      </div>
    </div>
  );
}

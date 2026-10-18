import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Satellite,
  Wand2,
  Beef,
  Wheat,
  Scale,
  Camera,
  MessageSquare,
  Microscope,
  Database,
  BookOpen,
  Monitor,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck,
  TrendingUp,
  Award,
  Milk,
} from "lucide-react";
import { TabId } from "../types";

interface HeroViewProps {
  onSelectTab: (tab: TabId) => void;
}

export default function HeroView({ onSelectTab }: HeroViewProps) {
  return (
    <div className="space-y-10 pb-12">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 md:p-12 shadow-2xl border border-emerald-500/20">
        {/* Arka plan ışık efektleri */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Adli Yargı Standartlarında Zirai & Hayvancılık Bilirkişilik Platformu</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Objektif, Yargıtay Uyumlu ve <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Yapay Zekâ Destekli
            </span>{" "}
            Bilirkişi Portalı
          </h1>

          <p className="text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
            6754 sayılı Bilirkişilik Kanunu ve HMK m.279 ilkeleriyle tam uyumlu; 
            <strong> 01 Tarım</strong> ve <strong>02 Hayvancılık</strong> uzmanlık alanlarında
            kamulaştırma, ecrimisil, telefat tazminatı, rasyon analizi ve uydu parsel doğrulamasını tek merkezde birleştirin.
          </p>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab("raporOtomasyonu")}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FileCheck size={18} />
              <span>01 Tarım Rapor Otomasyonu</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onSelectTab("hayvancilikRaporOtomasyonu")}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Beef size={18} />
              <span>02 Hayvancılık Rapor Otomasyonu</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onSelectTab("uyduParsel")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-sm transition"
            >
              <Satellite size={16} className="text-emerald-400" />
              <span>Uydu Parsel AI</span>
            </button>

            <button
              onClick={() => onSelectTab("hayvancilik")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-sm border border-amber-500/30 backdrop-blur-sm transition"
            >
              <Beef size={16} className="text-amber-400" />
              <span>02.01 Hayvancılık</span>
            </button>

            <button
              onClick={() => onSelectTab("yemlerBesleme")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-sm border border-emerald-500/30 backdrop-blur-sm transition"
            >
              <Wheat size={16} className="text-emerald-400" />
              <span>02.05 Yemler & Besleme</span>
            </button>

            <button
              onClick={() => onSelectTab("sutTeknolojisi")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-semibold text-sm border border-sky-500/30 backdrop-blur-sm transition"
            >
              <Milk size={16} className="text-sky-400" />
              <span>02.06 Süt & Mandıra</span>
            </button>
          </div>

          {/* İstatistik Göstergeleri */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">HMK 279 Tarafsızlık Denetimi</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-teal-300 font-mono">4 Katman</p>
              <p className="text-xs text-slate-400 mt-0.5">Uydu & Resmi Veri Çapraz Doğrulama</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-amber-400 font-mono">29 Irk / 31 Yem</p>
              <p className="text-xs text-slate-400 mt-0.5">02 Hayvancılık & Rasyon Kütüphanesi</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-sky-400 font-mono">2026</p>
              <p className="text-xs text-slate-400 mt-0.5">Güncel TÜİK, UKON & USK Rayiçleri</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UZMANLIK ALANLARI KARTLARI */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="text-emerald-600" size={24} />
              Bilirkişilik Uzmanlık Alanları
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Adalet Bakanlığı Bilirkişilik Daire Başkanlığı resmi kodlarına tam uyumlu modüller
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 01 TARIM KARTI */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                  <Wand2 size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                    KOD: 01 TARIM
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Zirai Değerleme & Arazi Analizi</h3>
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              2942 Sayılı Kamulaştırma Kanunu m.11 (Net Gelir & KFO), münavebe cetvelleri, ODA katsayıları, 
              Yargıtay 3. HD ecrimisil artış formülleri, zilyetlik ve irtifak hakkı değer düşüklüğü hesaplamaları.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => onSelectTab("sihirbaz")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 text-left transition group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">01.05 Zirai Değerleme</p>
                  <p className="text-[11px] text-slate-500">Kamulaştırma, Ecrimisil, Ağaç</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition" />
              </button>

              <button
                onClick={() => onSelectTab("veriarsivi")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 text-left transition group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Tarım Veri Arşivi</p>
                  <p className="text-[11px] text-slate-500">TÜİK ÇEGF & ÜFE</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition" />
              </button>

              <button
                onClick={() => onSelectTab("tarimRaporlar")}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition group"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">Örnek Raporlar</p>
                  <p className="text-[11px] text-emerald-700">İçtihatlı tam metinler</p>
                </div>
                <ArrowRight size={14} className="text-emerald-600 transition" />
              </button>
            </div>
          </div>

          {/* 02 HAYVANCILIK KARTI */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                  <Beef size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                    KOD: 02 HAYVANCILIK
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Hayvan Yetiştiriciliği & Besleme</h3>
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Büyükbaş, küçükbaş ve kanatlı canlı değerleme, telefat/hasar tazminatı, TBK m.52/55 mahsupları, 
              NRC/TÜBİTAK standartlarında TMR rasyon formülasyonu, aflatoksin/mikotoksin ve ayıp incelemeleri.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => onSelectTab("hayvancilik")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 text-left transition group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">02.01 Hayvancılık</p>
                  <p className="text-[11px] text-slate-500">29 Irk, telef tazminatı</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-600 transition" />
              </button>

              <button
                onClick={() => onSelectTab("yemlerBesleme")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 text-left transition group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">02.05 Yemler</p>
                  <p className="text-[11px] text-slate-500">Rasyon & analiz</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-600 transition" />
              </button>

              <button
                onClick={() => onSelectTab("hayvancilikRaporlar")}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-left transition group"
              >
                <div>
                  <p className="text-xs font-bold text-amber-950 group-hover:text-amber-800">Örnek Raporlar</p>
                  <p className="text-[11px] text-amber-700">Telef, zehirlenme, yem</p>
                </div>
                <ArrowRight size={14} className="text-amber-600 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ENTEGRE ARAÇLAR VE TEKNOLOJİ ALTYAPISI */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="text-sky-600" size={24} />
            Akıllı Saha & Laboratuvar Araçları
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Sahada ve duruşma salonunda saniyeler içinde teknik rapor oluşturan yapay zekâ motorları
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              id: "uyduParsel" as TabId,
              title: "Uydu Parsel AI",
              desc: "Esri 0.5m & Sentinel NDVI zaman serisi, TKGM entegrasyonu.",
              icon: <Satellite size={22} />,
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            },
            {
              id: "aiAsistan" as TabId,
              title: "AI Saha Asistanı",
              desc: "KFO, HMK 279, TARSİM ve yerel mevzuatla çevrimdışı çalışır.",
              icon: <MessageSquare size={22} />,
              color: "text-sky-600 bg-sky-50 border-sky-200",
            },
            {
              id: "fotoAnaliz" as TabId,
              title: "Fotoğraf Analiz AI",
              desc: "Vision motoruyla bitki evresi ve zarar yüzdesi tespiti.",
              icon: <Camera size={22} />,
              color: "text-teal-600 bg-teal-50 border-teal-200",
            },
            {
              id: "tarayici" as TabId,
              title: "HMK 279 Tarayıcı",
              desc: "Hukuki değerlendirme ve kusur yasağı ihlallerini denetler.",
              icon: <Microscope size={22} />,
              color: "text-purple-600 bg-purple-50 border-purple-200",
            },
            {
              id: "ictihat" as TabId,
              title: "İçtihat Arama",
              desc: "Yargıtay 3, 5 ve 11. Hukuk Daireleri emsal kararları.",
              icon: <Scale size={22} />,
              color: "text-amber-600 bg-amber-50 border-amber-200",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className="text-left bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition group flex flex-col justify-between"
            >
              <div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-3.5 transition group-hover:scale-105 ${item.color}`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-slate-800 transition">
                <span>Aracı Aç</span>
                <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. ADAY BİLİRKİŞİ EĞİTİMLERİ & YASAL UYGUNLUK */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 text-white border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              MEVZUAT & AKADEMİ
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Aday Bilirkişi Temel Eğitimi & UYAP Hazırlığı
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Adalet Bakanlığı 351 sayfalık resmi kılavuzu, 5 eğitim modülü, interaktif sınav simülatörü ve 
              UYAP uzmanlık alanı başvuru asistanı ile yetkinliğinizi tescilleyin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab("ilkeler")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition"
            >
              <ShieldCheck size={16} className="text-indigo-400" />
              <span>İlkeler & Standartlar</span>
            </button>

            <button
              onClick={() => onSelectTab("teorik")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition"
            >
              <BookOpen size={16} className="text-indigo-400" />
              <span>5 Eğitim Modülü</span>
            </button>

            <button
              onClick={() => onSelectTab("uyap")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
            >
              <Monitor size={16} />
              <span>UYAP Simülasyonu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

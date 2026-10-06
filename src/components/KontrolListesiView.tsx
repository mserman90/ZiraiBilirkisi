import React, { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCcw,
  Copy,
  Scale,
  Award,
  Sparkles,
  Info,
} from "lucide-react";
import { RESMI_KONTROL_LISTESI } from "../data/kontrolListesiData";

export default function KontrolListesiView({
  showToast,
  onGoToWizard,
}: {
  showToast: (msg: string) => void;
  onGoToWizard: () => void;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [sadeceKritik, setSadeceKritik] = useState(false);

  // Toplam ve tamamlanan hesaplama
  const tumMaddeler = RESMI_KONTROL_LISTESI.flatMap((k) => k.maddeler);
  const goruntulenenMaddeler = sadeceKritik
    ? tumMaddeler.filter((m) => m.onem === "kritik")
    : tumMaddeler;

  const toplamAdet = goruntulenenMaddeler.length;
  const tamamlananAdet = goruntulenenMaddeler.filter((m) => checkedItems[m.id]).length;
  const yuzde = toplamAdet ? Math.round((tamamlananAdet / toplamAdet) * 100) : 0;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sifirla = () => {
    setCheckedItems({});
    showToast("Kontrol listesi sıfırlandı");
  };

  const tumunuSec = () => {
    const all: Record<string, boolean> = {};
    tumMaddeler.forEach((m) => {
      all[m.id] = true;
    });
    setCheckedItems(all);
    showToast("Tüm maddeler onaylandı");
  };

  const kopyalaOzet = () => {
    const eksikler = tumMaddeler.filter((m) => !checkedItems[m.id]);
    const metin = `ADALET BAKANLIĞI BİLİRKİŞİ RAPORU KONTROL LİSTESİ SONUCU
Tarih: ${new Date().toLocaleDateString("tr-TR")}
Uygunluk Oranı: %${yuzde} (${tamamlananAdet}/${toplamAdet})
Durum: ${yuzde === 100 ? "MAHKEMEYE SUNULMAYA EKSİKSİZ UYGUN" : yuzde >= 80 ? "ÖNEMLİ ÖLÇÜDE UYGUN (Eksikleri kontrol ediniz)" : "EKSİK / REVİZYON GEREKLİ"}

${eksikler.length > 0 ? "Eksik Kalan / Denetlenmemiş Maddeler:\n" + eksikler.map((e) => `- [ ] ${e.metin} (${e.mevzuat})`).join("\n") : "Tüm denetim adımları eksiksiz tamamlanmıştır."}

Referans: 6754 sayılı Bilirkişilik Kanunu & HMK m.266-287 Standartları.`;

    navigator.clipboard.writeText(metin).then(() => {
      showToast("Denetim özeti panoya kopyalandı");
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-indigo-500/30 shadow-xl">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 tracking-wider mb-3">
              <ClipboardCheck size={14} /> ADALET BAKANLIĞI RESMİ RAPOR DENETİM STANDARDI
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Bilirkişiler İçin Rapor Denetim & Kontrol Listesi
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Mahkemeye veya UYAP sistemine rapor sunmadan önce görevlendirme, keşif, raporlama ve imza aşamalarındaki 17 resmi kriteri tek tek kontrol edin; rapor iptali ve iade riskini sıfırlayın.
            </p>
          </div>

          {/* İlerleme Göstergesi */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shrink-0 min-w-[200px]">
            <p className="text-[10px] font-bold tracking-widest text-indigo-200">UYGUNLUK PUANI</p>
            <p className={`text-4xl font-black mt-1 ${yuzde === 100 ? "text-emerald-400" : yuzde >= 75 ? "text-indigo-300" : "text-amber-400"}`}>
              %{yuzde}
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              {tamamlananAdet} / {toplamAdet} Madde Tamamlandı
            </p>
            <div className="mt-2.5 h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${yuzde === 100 ? "bg-emerald-400" : "bg-indigo-400"}`}
                style={{ width: `${yuzde}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aksiyon Barı */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSadeceKritik(!sadeceKritik)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              sadeceKritik
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {sadeceKritik ? "Tüm Maddeleri Göster" : "Sadece Kritik Maddeleri Göster (10)"}
          </button>
          <button
            onClick={tumunuSec}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
          >
            Tümünü Onayla
          </button>
          <button
            onClick={sifirla}
            className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-1 transition"
          >
            <RotateCcw size={12} /> Sıfırla
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={kopyalaOzet}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Copy size={13} /> Denetim Özetini Kopyala
          </button>
          <button
            onClick={onGoToWizard}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition flex items-center gap-1.5"
          >
            <FileText size={13} /> Rapor Sihirbazına Geç
          </button>
        </div>
      </div>

      {/* 4 Aşama Kartları */}
      <div className="space-y-6">
        {RESMI_KONTROL_LISTESI.map((kategori) => {
          const maddeler = sadeceKritik
            ? kategori.maddeler.filter((m) => m.onem === "kritik")
            : kategori.maddeler;

          if (maddeler.length === 0) return null;

          const katTamamlanan = maddeler.filter((m) => checkedItems[m.id]).length;
          const katYuzde = Math.round((katTamamlanan / maddeler.length) * 100);

          return (
            <div
              key={kategori.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Kategori Başlığı */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-900 text-white tracking-widest uppercase">
                    {kategori.asama}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{kategori.baslik}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{kategori.aciklama}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    {katTamamlanan}/{maddeler.length}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      katYuzde === 100
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    %{katYuzde}
                  </span>
                </div>
              </div>

              {/* Maddeler */}
              <div className="p-4 md:p-6 space-y-3">
                {maddeler.map((madde) => {
                  const isChecked = checkedItems[madde.id] || false;
                  return (
                    <div
                      key={madde.id}
                      onClick={() => toggleCheck(madde.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? "bg-emerald-50/50 border-emerald-300"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-xs font-bold ${isChecked ? "text-emerald-950" : "text-slate-900"}`}>
                            {madde.metin}
                          </p>
                          {madde.onem === "kritik" && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 tracking-wider">
                              KRİTİK
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {madde.mevzuat}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {madde.aciklama}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

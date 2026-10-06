import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Award,
  Clock,
  FileCheck,
  ChevronRight,
  Scale,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Download,
  Copy,
  Library,
  Bookmark,
  FileText,
  Search,
} from "lucide-react";
import {
  TEMEL_EGITIM_MODULLERI,
  RESMI_KAYNAK_KUTUPHANESI,
  ZIRAI_MEVZUAT_KUTUPHANESI,
} from "../data/temelEgitimData";
import { TemelEgitimModul, MevzuatLink, ResmiDokuman } from "../types";

export default function TemelEgitimView({
  showToast,
  onGoToWizard,
}: {
  showToast: (msg: string) => void;
  onGoToWizard: () => void;
}) {
  const [anaSekme, setAnaSekme] = useState<"moduller" | "kutuphane" | "mevzuat">("moduller");
  const [aktifModulIndex, setAktifModulIndex] = useState(0);
  const [cevaplar, setCevaplar] = useState<Record<string, number>>({});
  const [tamamlananModuller, setTamamlananModuller] = useState<Record<string, boolean>>({
    "modul-1": true,
  });
  const [mevzuatArama, setMevzuatArama] = useState("");

  const aktifModul: TemelEgitimModul = TEMEL_EGITIM_MODULLERI[aktifModulIndex];

  const handleCevapla = (soruIndex: number, secenekIndex: number) => {
    const key = `${aktifModul.id}-${soruIndex}`;
    setCevaplar((prev) => ({ ...prev, [key]: secenekIndex }));
    const soru = aktifModul.testSorulari[soruIndex];
    if (secenekIndex === soru.dogruCevapIndex) {
      showToast("Tebrikler, doğru cevap!");
      setTamamlananModuller((prev) => ({ ...prev, [aktifModul.id]: true }));
    } else {
      showToast("Yanlış seçenek. Açıklamayı okuyunuz.");
    }
  };

  const kopyalaMetin = (metin: string) => {
    navigator.clipboard.writeText(metin).then(() => {
      showToast("Metin panoya kopyalandı");
    });
  };

  const toplamModulSayisi = TEMEL_EGITIM_MODULLERI.length;
  const tamamlananSayisi = Object.keys(tamamlananModuller).length;
  const ilerlemeYuzdesi = Math.round((tamamlananSayisi / toplamModulSayisi) * 100);

  const filtrelenmisMevzuat = ZIRAI_MEVZUAT_KUTUPHANESI.filter(
    (m) =>
      m.baslik.toLowerCase().includes(mevzuatArama.toLowerCase()) ||
      m.kanunNo.includes(mevzuatArama) ||
      (m.aciklama && m.aciklama.toLowerCase().includes(mevzuatArama.toLowerCase())) ||
      (m.onemliFikra && m.onemliFikra.toLowerCase().includes(mevzuatArama.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-blue-500/30 shadow-xl">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-[40px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[11px] font-bold text-blue-300 tracking-wider mb-3">
              <BookOpen size={14} /> ADALET BAKANLIĞI BİLİRKİŞİLİK TEMEL EĞİTİMİ & RESMİ MEVZUAT KÜTÜPHANESİ
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Bilirkişilik Temel Eğitimi & Kaynak Kütüphanesi
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Katılımcı El Kitabı, Kaynak Kitap ve Rapor Standartları doğrultusunda 5 interaktif eğitim modülü; ilgili mevzuat maddelerine (mevzuat.gov.tr) doğrudan resmi bağlantılar ve indirilebilir doküman arşivi.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shrink-0 min-w-[200px]">
            <p className="text-[10px] font-bold tracking-widest text-blue-200">EĞİTİM İLERLEMESİ</p>
            <p className="text-4xl font-black text-white mt-1">%{ilerlemeYuzdesi}</p>
            <p className="text-[11px] text-slate-300 mt-1">
              {tamamlananSayisi} / {toplamModulSayisi} Modül Tamamlandı
            </p>
            <div className="mt-2.5 h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${ilerlemeYuzdesi}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Üst Sekmeler */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto max-w-xl">
        <button
          onClick={() => setAnaSekme("moduller")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            anaSekme === "moduller"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen size={14} /> 5 Eğitim Modülü & Sınav
        </button>
        <button
          onClick={() => setAnaSekme("mevzuat")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            anaSekme === "mevzuat"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Scale size={14} /> Doğrudan Mevzuat Bağlantıları
        </button>
        <button
          onClick={() => setAnaSekme("kutuphane")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            anaSekme === "kutuphane"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Library size={14} /> Resmi Doküman Kütüphanesi
        </button>
      </div>

      {/* 1. SEKME: 5 EĞİTİM MODÜLÜ */}
      {anaSekme === "moduller" && (
        <>
          {/* Modül Butonları */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {TEMEL_EGITIM_MODULLERI.map((m, idx) => {
              const aktif = idx === aktifModulIndex;
              const tamam = tamamlananModuller[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => setAktifModulIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between min-h-[90px] ${
                    aktif
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : tamam
                      ? "bg-white border-emerald-300 text-slate-800 hover:bg-slate-50"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${aktif ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                      Modül {m.no}
                    </span>
                    {tamam && <CheckCircle2 size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-[11px] font-bold line-clamp-2 mt-2 leading-snug">
                    {m.baslik}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Aktif Modül Detayı */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Sol: Ders Konuları & Mevzuat Linkleri */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    MODÜL {aktifModul.no} • {aktifModul.sure}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Kaynak: Adalet Bakanlığı El Kitabı s.1-140
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{aktifModul.baslik}</h3>
                <p className="text-xs text-slate-500 mt-1">{aktifModul.altBaslik}</p>
                <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {aktifModul.ozet}
                </p>
              </div>

              {/* Konu Başlıkları */}
              <div className="space-y-4">
                {aktifModul.konular.map((k, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 grid place-items-center text-[11px] font-bold">
                        {i + 1}
                      </span>
                      {k.baslik}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">
                      {k.icerik}
                    </p>
                    {k.onemliNot && (
                      <div className="ml-7 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                        <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <span><b>Dikkat:</b> {k.onemliNot}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* DOĞRUDAN MEVZUAT BAĞLANTILARI (Kullanıcının İstediği Doğrudan Linkler) */}
              <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-2 border-blue-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-blue-950 flex items-center gap-2">
                    <Scale size={16} className="text-blue-600" /> Bu Modülün İlgili Mevzuat Maddeleri (Doğrudan Linkler)
                  </h4>
                  <span className="text-[10px] text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded font-mono font-bold">
                    mevzuat.gov.tr
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Aşağıdaki kanun maddelerine tıklayarak T.C. Cumhurbaşkanlığı Mevzuat Bilgi Sistemi'ndeki resmi metinlere doğrudan ulaşabilirsiniz:
                </p>

                <div className="space-y-2.5 pt-1">
                  {aktifModul.mevzuatLinkleri.map((mlink, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-blue-200 p-3.5 space-y-1.5 shadow-sm hover:border-blue-400 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-600 text-white">
                            {mlink.kanunNo} SK
                          </span>
                          <span className="text-xs font-bold text-slate-900">{mlink.baslik}</span>
                        </div>
                        <a
                          href={mlink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition shrink-0"
                        >
                          Mevzuata Git <ExternalLink size={12} />
                        </a>
                      </div>
                      {mlink.onemliFikra && (
                        <p className="text-[11px] text-slate-700 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{mlink.onemliFikra}"
                        </p>
                      )}
                      {mlink.aciklama && (
                        <p className="text-[10px] text-slate-500">{mlink.aciklama}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: Sınav & İlerleme */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-blue-600" /> Modül Pekiştirme Sorusu
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  Soru 1/1
                </span>
              </div>

              {aktifModul.testSorulari.map((test, sIdx) => {
                const key = `${aktifModul.id}-${sIdx}`;
                const secilenIndex = cevaplar[key];
                const cevaplandi = secilenIndex !== undefined;
                const dogruMu = secilenIndex === test.dogruCevapIndex;

                return (
                  <div key={sIdx} className="space-y-3">
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {test.soru}
                    </p>

                    <div className="space-y-2">
                      {test.secenekler.map((sec, oIdx) => {
                        const secildi = secilenIndex === oIdx;
                        let stil = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                        if (cevaplandi) {
                          if (oIdx === test.dogruCevapIndex) {
                            stil = "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold";
                          } else if (secildi && !dogruMu) {
                            stil = "bg-rose-50 border-rose-300 text-rose-950 line-through";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={cevaplandi}
                            onClick={() => handleCevapla(sIdx, oIdx)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${stil}`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)})</span>
                            {sec}
                          </button>
                        );
                      })}
                    </div>

                    {cevaplandi && (
                      <div
                        className={`p-3 rounded-xl border text-xs leading-relaxed animate-[fadeIn_0.2s_ease] ${
                          dogruMu ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}
                      >
                        <p className="font-bold flex items-center gap-1 mb-1">
                          {dogruMu ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertCircle size={14} className="text-amber-600" />}
                          {dogruMu ? "Doğru Yanıt!" : "Açıklama:"}
                        </p>
                        <p className="text-[11px]">{test.aciklama}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (aktifModulIndex < TEMEL_EGITIM_MODULLERI.length - 1) {
                      setAktifModulIndex(aktifModulIndex + 1);
                    } else {
                      showToast("Tüm modülleri tamamladınız!");
                      onGoToWizard();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  {aktifModulIndex < TEMEL_EGITIM_MODULLERI.length - 1 ? (
                    <>Sonraki Modüle Geç <ChevronRight size={14} /></>
                  ) : (
                    <>Eğitimi Tamamla & Rapor Sihirbazına Git</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. SEKME: DOĞRUDAN MEVZUAT BAĞLANTILARI */}
      {anaSekme === "mevzuat" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Scale size={20} className="text-blue-600" /> Zirai Bilirkişilik Mevzuat Kütüphanesi
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                T.C. Cumhurbaşkanlığı Mevzuat Bilgi Sistemi (mevzuat.gov.tr) doğrudan resmi bağlantıları ve fıkra özetleri.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={mevzuatArama}
                onChange={(e) => setMevzuatArama(e.target.value)}
                placeholder="Kanun adı veya madde ara..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtrelenmisMevzuat.map((mev, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-600 text-white font-mono">
                      {mev.kanunNo} SK
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{mev.baslik}</h4>
                  </div>
                  <a
                    href={mev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold border border-slate-200 transition shrink-0"
                  >
                    Resmi Metin <ExternalLink size={11} />
                  </a>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {mev.aciklama}
                </p>

                {mev.onemliFikra && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-[11px] text-blue-950 font-medium">
                    <p className="font-bold text-blue-700 mb-0.5 text-[10px] tracking-wide">ÖNEMLİ HÜKÜM:</p>
                    {mev.onemliFikra}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEKME: RESMİ DOKÜMAN KÜTÜPHANESİ */}
      {anaSekme === "kutuphane" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Library size={20} className="text-indigo-600" /> Adalet Bakanlığı Resmi Doküman Arşivi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Bilirkişilik Daire Başkanlığı tarafından yayımlanan resmi el kitapları, yönergeler ve kılavuzlar.
            </p>
          </div>

          <div className="space-y-4">
            {RESMI_KAYNAK_KUTUPHANESI.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                      {doc.tur}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {doc.sayfaSayisi} • {doc.kurum}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{doc.baslik}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{doc.aciklama}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    Resmi PDF'i Aç <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => kopyalaMetin(doc.url)}
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-xs transition"
                    title="Bağlantıyı Kopyala"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

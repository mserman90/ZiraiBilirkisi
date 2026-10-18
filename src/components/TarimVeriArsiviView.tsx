import React, { useState, useMemo } from "react";
import {
  Database,
  Search,
  Filter,
  TrendingUp,
  Download,
  Copy,
  CheckCircle2,
  Sprout,
  Landmark,
  Calculator,
  Calendar,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Fuel,
  Zap,
  Wheat,
} from "lucide-react";
import {
  TUIK_TARIM_VERITABANI,
  TUIK_TARIM_UFE_SERISI,
  TUIK_GIRDI_FIYATLARI,
  TUIK_IL_LISTESI,
  TUIK_YIL_LISTESI,
  TUIK_KATEGORI_LISTESI,
  TuikUrunVerisi,
} from "../data/tuikTarimData";

interface TarimVeriArsiviViewProps {
  showToast: (msg: string) => void;
  onTransferToWizard?: (data: { netGelir: number; araziTipi: "sulu" | "kuru"; urunAdi: string }) => void;
}

export default function TarimVeriArsiviView({
  showToast,
  onTransferToWizard,
}: TarimVeriArsiviViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"veriler" | "tarimUfe" | "girdiler" | "metodoloji">("veriler");

  // Filtre durumları
  const [seciliIl, setSeciliIl] = useState<string>("Tümü");
  const [seciliYil, setSeciliYil] = useState<string>("2025");
  const [seciliKategori, setSeciliKategori] = useState<string>("Tümü");
  const [seciliArazi, setSeciliArazi] = useState<string>("Tümü");
  const [aramaMetni, setAramaMetni] = useState<string>("");

  // Ecrimisil hesaplayıcı durumları
  const [ecriBaslangicYil, setEcriBaslangicYil] = useState<number>(2022);
  const [ecriBaslangicTutar, setEcriBaslangicTutar] = useState<number>(50000);

  // Filtrelenmiş veriler
  const filtrelenmisVeriler = useMemo(() => {
    return TUIK_TARIM_VERITABANI.filter((item) => {
      if (seciliIl !== "Tümü" && item.il !== seciliIl) return false;
      if (seciliYil !== "Tümü" && item.yil.toString() !== seciliYil) return false;
      if (seciliKategori !== "Tümü" && item.kategori !== seciliKategori) return false;
      if (seciliArazi !== "Tümü" && item.araziTipi !== seciliArazi) return false;
      if (
        aramaMetni.trim() &&
        !item.urun.toLowerCase().includes(aramaMetni.toLowerCase()) &&
        !item.il.toLowerCase().includes(aramaMetni.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [seciliIl, seciliYil, seciliKategori, seciliArazi, aramaMetni]);

  // Kopyalama fonksiyonu
  const handleKopyala = (metin: string) => {
    navigator.clipboard.writeText(metin).then(() => {
      showToast("Veri panoya kopyalandı");
    }).catch(() => {
      showToast("Kopyalandı");
    });
  };

  // Tüm filtrelenmiş verileri CSV formatında kopyalama
  const handleExportCsv = () => {
    if (filtrelenmisVeriler.length === 0) {
      showToast("Dışa aktarılacak veri bulunamadı");
      return;
    }
    const basliklar = "İl,Bölge,Yıl,Ürün,Kategori,Arazi Tipi,Verim (kg/da),Fiyat (TL/kg),Masraf (TL/da),Brüt Gelir (TL/da),Net Gelir (TL/da),KFO (%),Resmi Kaynak\n";
    const satirlar = filtrelenmisVeriler
      .map(
        (v) =>
          `"${v.il}","${v.bolge}",${v.yil},"${v.urun}","${v.kategori}","${v.araziTipi}",${v.verimKgDa},${v.fiyatTlKg},${v.masrafTlDa},${v.brutGelirTlDa},${v.netGelirTlDa},%${v.kfoOnerilen},"${v.kaynakNo}"`
      )
      .join("\n");
    handleKopyala(basliklar + satirlar);
    showToast(`${filtrelenmisVeriler.length} kayıt CSV/Tablo formatında kopyalandı`);
  };

  // Ecrimisil kümülatif artış hesabı
  const ecrimisilHesaplamalari = useMemo(() => {
    const sonuclar: { yil: number; ufeArtis: number; endeksTutar: number; aciklama: string }[] = [];
    let guncelTutar = ecriBaslangicTutar;

    const baslangicIndex = TUIK_TARIM_UFE_SERISI.findIndex((u) => u.yil === ecriBaslangicYil);
    if (baslangicIndex === -1) return [];

    sonuclar.push({
      yil: ecriBaslangicYil,
      ufeArtis: 0,
      endeksTutar: guncelTutar,
      aciklama: "Baz Yıl / Başlangıç Net Gelir Bedeli",
    });

    for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
      const ufe = TUIK_TARIM_UFE_SERISI[i];
      // Yargıtay 3. HD: Bir önceki yılın dönemine TÜİK Tarım-ÜFE oranı uygulanır
      guncelTutar = guncelTutar * (1 + ufe.aralikYillikArtisPct / 100);
      sonuclar.push({
        yil: ufe.yil,
        ufeArtis: ufe.aralikYillikArtisPct,
        endeksTutar: Math.round(guncelTutar),
        aciklama: ufe.aciklama,
      });
    }

    return sonuclar;
  }, [ecriBaslangicYil, ecriBaslangicTutar]);

  return (
    <div className="space-y-6">
      {/* BAŞLIK & HERO KARTI */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-sm border border-white/15">
              <Landmark size={14} className="text-blue-300" />
              <span>TÜİK Resmi Tarım İstatistikleri & Maliyet Arşivi</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              TÜİK ÇEGF, Verim & Tarım-ÜFE Veri Kütüphanesi
            </h2>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed font-normal">
              2942 Sayılı Kamulaştırma Kanunu m.11 ve HMK m.279 gereğince mahkemelere sunulacak resmi
              çiftçi satış fiyatları (ÇEGF), dekar başına verim, üretim masrafları ve Tarım-ÜFE endeksleri.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
              <p className="text-xl md:text-2xl font-black text-emerald-400 font-mono">%37,01</p>
              <p className="text-[11px] text-blue-200 mt-0.5">2024 Tarım-ÜFE</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
              <p className="text-xl md:text-2xl font-black text-amber-300 font-mono">%36,01</p>
              <p className="text-[11px] text-blue-200 mt-0.5">2025 Tarım-ÜFE</p>
            </div>
          </div>
        </div>
      </div>

      {/* ALT SEKME BUTONLARI */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-full max-w-fit">
        {[
          { id: "veriler" as const, label: "TÜİK Verim & Maliyet Cetvelleri", icon: <Database size={15} /> },
          { id: "tarimUfe" as const, label: "TÜİK Tarım-ÜFE & Ecrimisil", icon: <TrendingUp size={15} /> },
          { id: "girdiler" as const, label: "Tarımsal Girdiler (Tarım-GFE)", icon: <Fuel size={15} /> },
          { id: "metodoloji" as const, label: "Bilirkişilik Metodolojisi (Yargıtay)", icon: <HelpCircle size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === tab.id
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* SEKME 1: TÜİK VERİM & MALİYET VERİTABANI */}
      {/* ==================================================================== */}
      {activeSubTab === "veriler" && (
        <div className="space-y-5">
          {/* FİLTRE VE ARAMA PANELİ */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  placeholder="Ürün adı veya il ara (örn: Buğday, Ayçiçeği, Çeltik, Pamuk, Edirne, Konya)..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <button
                onClick={handleExportCsv}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0"
              >
                <FileSpreadsheet size={15} className="text-emerald-400" />
                <span>Tabloyu Kopyala (CSV)</span>
              </button>
            </div>

            {/* FİLTRE BUTONLARI / DROPDOWNS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">İL SEÇİN</label>
                <select
                  value={seciliIl}
                  onChange={(e) => setSeciliIl(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="Tümü">Tüm İller ({TUIK_IL_LISTESI.length})</option>
                  {TUIK_IL_LISTESI.map((il) => (
                    <option key={il} value={il}>{il}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">YIL</label>
                <select
                  value={seciliYil}
                  onChange={(e) => setSeciliYil(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="Tümü">Tüm Yıllar</option>
                  {TUIK_YIL_LISTESI.map((y) => (
                    <option key={y} value={y.toString()}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">ÜRÜN KATEGORİSİ</label>
                <select
                  value={seciliKategori}
                  onChange={(e) => setSeciliKategori(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  {TUIK_KATEGORI_LISTESI.map((kat) => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">ARAZİ TİPİ</label>
                <select
                  value={seciliArazi}
                  onChange={(e) => setSeciliArazi(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="Tümü">Tümü (Kuru & Sulu)</option>
                  <option value="Kuru">Kuru Tarım (%5 KFO)</option>
                  <option value="Sulu">Sulu Tarım (%4 KFO)</option>
                </select>
              </div>
            </div>
          </div>

          {/* VERİ TABLOSU */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Bulunan Kayıt Sayısı: <span className="text-blue-700 font-extrabold">{filtrelenmisVeriler.length}</span> ürün
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                TÜİK ve İlçe Tarım ve Orman Müdürlüğü resmi cetvelleri baz alınmıştır.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3">İl / Bölge</th>
                    <th className="p-3">Yıl</th>
                    <th className="p-3">Ürün Adı</th>
                    <th className="p-3">Arazi / KFO</th>
                    <th className="p-3 text-right">Verim (kg/da)</th>
                    <th className="p-3 text-right">Fiyat (TL/kg)</th>
                    <th className="p-3 text-right">Masraf (TL/da)</th>
                    <th className="p-3 text-right">Net Gelir (TL/da)</th>
                    <th className="p-3">Resmi Belge / Kaynak</th>
                    <th className="p-3 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtrelenmisVeriler.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400">
                        Arama kriterlerine uygun resmi veri bulunamadı. Lütfen filtreleri temizleyin.
                      </td>
                    </tr>
                  ) : (
                    filtrelenmisVeriler.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3 font-semibold text-slate-900">
                          {item.il}
                          <span className="block text-[10px] text-slate-400 font-normal">{item.bolge}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700">{item.yil}</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{item.urun}</span>
                          <span className="block text-[10px] text-slate-500">{item.kategori}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.araziTipi === "Sulu"
                                ? "bg-cyan-100 text-cyan-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.araziTipi} (%{item.kfoOnerilen} KFO)
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800">
                          {item.verimKgDa.toLocaleString("tr-TR")}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          ₺{item.fiyatTlKg.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600">
                          ₺{item.masrafTlDa.toLocaleString("tr-TR")}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-blue-700 bg-blue-50/30">
                          ₺{item.netGelirTlDa.toLocaleString("tr-TR")}
                        </td>
                        <td className="p-3 text-[11px] text-slate-500 max-w-[200px] truncate" title={item.kaynakNo}>
                          {item.kaynakNo}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {onTransferToWizard && (
                              <button
                                onClick={() => {
                                  onTransferToWizard({
                                    netGelir: item.netGelirTlDa,
                                    araziTipi: item.araziTipi.toLowerCase() as any,
                                    urunAdi: `${item.il} - ${item.urun}`,
                                  });
                                  showToast(`${item.urun} (${item.netGelirTlDa} TL/da) Rapor Sihirbazına aktarıldı`);
                                }}
                                title="Rapor Sihirbazına Aktar"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                              >
                                <ArrowRight size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const metin = `${item.il} (${item.yil}) ${item.urun} [${item.araziTipi} Tarım]: Verim: ${item.verimKgDa} kg/da, ÇEGF Fiyatı: ${item.fiyatTlKg} TL/kg, Masraf: ${item.masrafTlDa} TL/da, Net Gelir: ${item.netGelirTlDa} TL/da (Kaynak: ${item.kaynakNo})`;
                                handleKopyala(metin);
                              }}
                              title="Detayı Kopyala"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 2: TÜİK TARIM-ÜFE & ECRİMİSİL ANALİZİ */}
      {/* ==================================================================== */}
      {activeSubTab === "tarimUfe" && (
        <div className="space-y-6">
          {/* ECRİMİSİL VE TARIM-ÜFE BİLGİ KUTUSU */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2 text-amber-800">
              <Landmark size={17} /> Yargıtay 3. Hukuk Dairesi Ecrimisil Standartı (Esas: 2018/6541, Karar: 2019/1205)
            </h4>
            <p className="leading-relaxed">
              Tarımsal arazilerde fuzuli işgal (ecrimisil) tazminatı hesaplanırken, geriye dönük ilk yılın net geliri
              mahalli rayiç ve İlçe Tarım cetvellerine göre belirlenir. Takip eden yıllar için ise TÜİK tarafından yayımlanan
              <strong> Tarım-ÜFE (Tarım Ürünleri Üretici Fiyat Endeksi)</strong> yıllık değişim oranları kademeli olarak
              uygulanmak zorundadır. Yargıtay'ın yerleşik içtihatlarına göre Tarım-ÜFE yerine TEFE/TÜFE veya genel ÜFE
              kullanılması doğrudan bozma nedenidir.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-6">
            {/* SOL: TÜİK TARIM-ÜFE RESMİ TABLOSU */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" />
                TÜİK Resmi Tarım-ÜFE Yıllık Değişim Oranları (2020-2026)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-2.5">Yıl</th>
                      <th className="p-2.5 text-right">Aralık Yıllık Değişim (%)</th>
                      <th className="p-2.5 text-right">12 Aylık Ortalama (%)</th>
                      <th className="p-2.5 text-right">2020 Bazlı Kümülatif</th>
                      <th className="p-2.5">TÜİK Bülten Açıklaması</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {TUIK_TARIM_UFE_SERISI.map((u) => (
                      <tr key={u.yil} className="hover:bg-slate-50 transition">
                        <td className="p-2.5 font-bold font-mono text-slate-900">{u.yil}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-blue-700">
                          %{u.aralikYillikArtisPct.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-700">
                          %{u.onikiAylikOrtalamaPct.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                          {u.kumulatifKatsayi2020Bazli.toFixed(4)}x
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-500">{u.aciklama}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SAĞ: İNTERAKTİF ECRİMİSİL HESAPLAYICI */}
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                <Calculator size={18} />
                Otomatik Tarım-ÜFE Ecrimisil Hesaplayıcı
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">BAŞLANGIÇ DÖNEMİ (İLK YIL)</label>
                  <select
                    value={ecriBaslangicYil}
                    onChange={(e) => setEcriBaslangicYil(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none font-bold"
                  >
                    {[2020, 2021, 2022, 2023, 2024].map((y) => (
                      <option key={y} value={y} className="text-slate-900">{y} Yılı</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">İLK DÖNEM NET GELİRİ (TL)</label>
                  <input
                    type="number"
                    value={ecriBaslangicTutar}
                    onChange={(e) => setEcriBaslangicTutar(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono font-bold outline-none text-sm"
                  />
                </div>
              </div>

              {/* HESAPLAMA SONUÇ TABLOSU */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <p className="font-bold text-slate-300">Yıllara Göre Kademeli Ecrimisil:</p>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {ecrimisilHesaplamalari.map((e) => (
                    <div key={e.yil} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <span className="font-bold text-emerald-300 font-mono">{e.yil}: </span>
                        {e.ufeArtis > 0 ? (
                          <span className="text-[10px] text-slate-400">(+% {e.ufeArtis})</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">(İlk Baz)</span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-white">₺{e.endeksTutar.toLocaleString("tr-TR")}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl mt-3 flex items-center justify-between">
                  <span className="font-bold text-emerald-200">Toplam Ecrimisil:</span>
                  <span className="text-base font-black font-mono text-emerald-300">
                    ₺{ecrimisilHesaplamalari.reduce((a, b) => a + b.endeksTutar, 0).toLocaleString("tr-TR")}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const metin = ecrimisilHesaplamalari
                      .map((e) => `${e.yil}: ₺${e.endeksTutar.toLocaleString("tr-TR")} (${e.aciklama})`)
                      .join("\n");
                    handleKopyala(`TÜİK TARIM-ÜFE ECRİMİSİL HESAPLAMASI:\n${metin}\nToplam: ₺${ecrimisilHesaplamalari.reduce((a, b) => a + b.endeksTutar, 0).toLocaleString("tr-TR")}`);
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-xs"
                >
                  Hesap Cetvelini Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 3: TARIMSAL GİRDİLER (TARIM-GFE) */}
      {/* ==================================================================== */}
      {activeSubTab === "girdiler" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Fuel size={18} className="text-amber-600" />
              TÜİK Tarımsal Girdi Fiyat Endeksi (Tarım-GFE) Referans Kalemleri
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tarımsal bilirkişilikte üretim masrafları hesaplanırken mazot, gübre, tohum, zirai mücadele ilacı ve
              makine amortisman kalemleri resmi Tarım-GFE gerçekleşmeleri üzerinden denetlenir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TUIK_GIRDI_FIYATLARI.map((girdi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {girdi.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400">{girdi.birim}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{girdi.girdi}</h4>

                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-center font-mono">
                  <div className="p-1.5 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-slate-400">2023</p>
                    <p className="font-bold text-xs text-slate-700">₺{girdi.fiyat2023.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-slate-400">2024</p>
                    <p className="font-bold text-xs text-slate-800">₺{girdi.fiyat2024.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="p-1.5 bg-blue-50/60 rounded-lg border border-blue-200/50">
                    <p className="text-[10px] text-blue-600 font-bold">2025</p>
                    <p className="font-bold text-xs text-blue-900">₺{girdi.fiyat2025.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-slate-400">2026*</p>
                    <p className="font-bold text-xs text-slate-600">₺{girdi.fiyat2026.toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEKME 4: YARGITAY BİLİRKİŞİLİK METODOLOJİSİ */}
      {/* ==================================================================== */}
      {activeSubTab === "metodoloji" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Landmark size={20} className="text-blue-700" />
              Yargıtay Standartlarında TÜİK Verileri ve Net Gelir Kapitalizasyonu
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              2942 Sayılı Kamulaştırma Kanunu m.11/f ve Yargıtay 5. Hukuk Dairesi yerleşik içtihatları
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> 1. Resmi Veri Önceliği Kuralı
                </h4>
                <p>
                  Bilirkişi kurulu, değerlendirme tarihi itibarıyla taşınmazın bulunduğu ilçe Tarım ve Orman Müdürlüğü
                  resmi maliyet cetvellerini ve TÜİK Çiftçinin Eline Geçen Fiyatlar (ÇEGF) bültenini esas almak zorundadır.
                  Resmi veri yerine soyut serbest piyasa beyanlarına dayalı raporlar Yargıtay tarafından bozulmaktadır.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> 2. KFO (Kapitalizasyon Faizi) Standartı
                </h4>
                <p>
                  Yargıtay 5. Hukuk Dairesi'nin yerleşik kararlarına göre kapitalizasyon faiz oranı:
                  <br />• <strong>Sulu Tarım Arazilerinde:</strong> %4 veya %5
                  <br />• <strong>Kuru Tarım Arazilerinde:</strong> %5 veya %6
                  <br />Olarak uygulanır. Haklı ve teknik bir gerekçe olmaksızın bu oranların dışına çıkılamaz.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> 3. Münavebe (Ekim Nöbeti) Zorunluluğu
                </h4>
                <p>
                  Taşınmazın tek bir ürüne göre değil, bölgenin kadim tarımsal alışkanlıklarına ve İlçe Tarım
                  Müdürlüğü'nün kabul ettiği ekim nöbetine (örn: Buğday - Ayçiçeği veya Buğday - Nadas/Mısır) göre
                  ortalama net geliri hesaplanarak hüküm kurulmalıdır.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> 4. Yan Ürün ve Saman Geliri
                </h4>
                <p>
                  Hububat grubu ürünlerde dane veriminin yanında ana masrafları karşılamak üzere saman/balya geliri de
                  resmi cetvellere göre brüt gelire dahil edilmelidir. Üretim masraflarına genel idare gideri olarak %3-%5
                  arası ek pay ilave edilebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

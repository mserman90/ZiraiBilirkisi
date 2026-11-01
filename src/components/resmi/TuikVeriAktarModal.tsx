import React, { useState, useMemo } from "react";
import {
  X,
  Database,
  Wheat,
  Beef,
  TrendingUp,
  Check,
  ExternalLink,
  Plus,
  ArrowRight,
  Globe,
} from "lucide-react";
import {
  TUIK_TARIM_VERITABANI,
  TUIK_IL_LISTESI,
  TUIK_HAYVANCILIK_VERITABANI,
  TUIK_TARIM_UFE_SERISI,
  TuikUrunVerisi,
  TuikHayvancilikVerisi,
} from "../../data/tuikTarimData";

interface TuikVeriAktarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMetinEkle: (eklenecekMetin: string) => void;
  showToast: (msg: string) => void;
}

export default function TuikVeriAktarModal({
  isOpen,
  onClose,
  onMetinEkle,
  showToast,
}: TuikVeriAktarModalProps) {
  const [aktifMod, setAktifMod] = useState<"bitkisel" | "hayvancilik" | "ecrimisil">("bitkisel");

  // Bitkisel seçimleri
  const [seciliIl, setSeciliIl] = useState<string>("Ankara");
  const [seciliUrunId, setSeciliUrunId] = useState<string>("");

  // Hayvancılık seçimleri
  const [seciliHayvanId, setSeciliHayvanId] = useState<string>(TUIK_HAYVANCILIK_VERITABANI[0].id);

  // Ecrimisil seçimleri
  const [ecriBaslangicYil, setEcriBaslangicYil] = useState<number>(2022);
  const [ecriBaslangicTutar, setEcriBaslangicTutar] = useState<number>(50000);

  // İle göre ürünler
  const ilUrunleri = useMemo(() => {
    const urunler = TUIK_TARIM_VERITABANI.filter((u) => u.il === seciliIl);
    return urunler.length > 0 ? urunler : TUIK_TARIM_VERITABANI.slice(0, 10);
  }, [seciliIl]);

  const aktifBitkiselUrun = useMemo(() => {
    return ilUrunleri.find((u) => u.id === seciliUrunId) || ilUrunleri[0];
  }, [ilUrunleri, seciliUrunId]);

  const aktifHayvan = useMemo(() => {
    return TUIK_HAYVANCILIK_VERITABANI.find((h) => h.id === seciliHayvanId) || TUIK_HAYVANCILIK_VERITABANI[0];
  }, [seciliHayvanId]);

  if (!isOpen) return null;

  // Bitkisel Paragraf Üretici
  const handleBitkiselAktar = () => {
    if (!aktifBitkiselUrun) return;
    const birimM2Degeri = ((aktifBitkiselUrun.netGelirTlDa / 1000) / (aktifBitkiselUrun.kfoOnerilen / 100)).toFixed(2);
    const metin = `\n\n[TÜİK VE İLÇE TARIM MÜDÜRLÜĞÜ RESMİ VERİ DEĞERLEMESİ]\n` +
      `Taşınmazın ${aktifBitkiselUrun.araziTipi.toLowerCase()} tarım arazisi vasfında olduğu ve bölgede mutat münavebe ürününün ${aktifBitkiselUrun.urun} olduğu tespit edilmiştir. ` +
      `TÜİK Çiftçinin Eline Geçen Fiyatlar (ÇEGF) ve resmi cetvellere göre ${aktifBitkiselUrun.yil} yılı ${aktifBitkiselUrun.urun} dekar verimi ${aktifBitkiselUrun.verimKgDa} kg/da, ` +
      `ortalama satış fiyatı ${aktifBitkiselUrun.fiyatTlKg.toFixed(2)} TL/kg, dekar masrafı ${aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")} TL/da ve dekar net geliri ${aktifBitkiselUrun.netGelirTlDa.toLocaleString("tr-TR")} TL/da olarak belirlenmiştir. ` +
      `Yargıtay 5. Hukuk Dairesi ilke kararları gereğince %${aktifBitkiselUrun.kfoOnerilen} kapitalizasyon faizi tatbikiyle taşınmazın çıplak toprak m² birim değeri ${birimM2Degeri} TL/m² takdir olunmuştur. (Kaynak: ${aktifBitkiselUrun.kaynakNo})`;

    onMetinEkle(metin);
    showToast(`${aktifBitkiselUrun.urun} resmi hesap paragrafı rapora eklendi`);
    onClose();
  };

  // Hayvancılık Paragraf Üretici
  const handleHayvancilikAktar = () => {
    if (!aktifHayvan) return;
    const metin = `\n\n[TÜİK VE RESMİ BORSA HAYVANCILIK KIYMET TAKDİRİ]\n` +
      `Dava konusu olayda incelenen ${aktifHayvan.tur.toLowerCase()} vasfındaki ${aktifHayvan.irk} ırkı hayvanın; ortalama canlı ağırlığının ${aktifHayvan.canliAgirlikKg} kg, ` +
      `karkas et randımanının %${aktifHayvan.karkasRandimaniPct} (yaklaşık ${aktifHayvan.karkasAgirligiKg} kg karkas) olduğu tespit edilmiştir. ` +
      `TÜİK ve Kırmızı Et Üreticileri Birliği resmi piyasa gerçekleşmelerine göre canlı kg fiyatı ${aktifHayvan.canliBirimFiyatTlKg} TL/kg, karkas kg fiyatı ${aktifHayvan.karkasEtFiyatiTlKg} TL/kg olup, ` +
      `birim hayvan rayiç değeri ${aktifHayvan.ortalamaBasDegeriTl.toLocaleString("tr-TR")} TL olarak takdir edilmiştir. (Kaynak: ${aktifHayvan.resmiKaynak})`;

    onMetinEkle(metin);
    showToast(`${aktifHayvan.irk} resmi rayiç paragrafı rapora eklendi`);
    onClose();
  };

  // Ecrimisil Paragraf Üretici
  const handleEcrimisilAktar = () => {
    const baslangicIndex = TUIK_TARIM_UFE_SERISI.findIndex((u) => u.yil === ecriBaslangicYil);
    if (baslangicIndex === -1) return;

    let satir = `\n\n[TÜİK TARIM-ÜFE KÜMÜLATİF ECRİMİSİL CETVELİ]\n` +
      `Yargıtay 3. Hukuk Dairesi yerleşik içtihatları gereğince ilk dönem belirlenen baz net gelir tutarına takip eden her yıl için TÜİK Tarım-ÜFE yıllık değişim oranı tatbik edilmiştir:\n`;

    let guncel = ecriBaslangicTutar;
    let toplam = guncel;
    satir += `• ${ecriBaslangicYil} Yılı (Baz Dönem): ${Math.round(guncel).toLocaleString("tr-TR")} TL\n`;

    for (let i = baslangicIndex + 1; i < TUIK_TARIM_UFE_SERISI.length; i++) {
      const ufe = TUIK_TARIM_UFE_SERISI[i];
      guncel = guncel * (1 + ufe.aralikYillikArtisPct / 100);
      toplam += guncel;
      satir += `• ${ufe.yil} Yılı (Tarım-ÜFE +%${ufe.aralikYillikArtisPct}): ${Math.round(guncel).toLocaleString("tr-TR")} TL\n`;
    }

    satir += `TOPLAM ECRİMİSİL TAZMİNATI: ${Math.round(toplam).toLocaleString("tr-TR")} TL (Kaynak: TÜİK data.tuik.gov.tr)`;

    onMetinEkle(satir);
    showToast("TÜİK Tarım-ÜFE ecrimisil cetveli rapora eklendi");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="resmi-kart bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[hsl(var(--border))] flex flex-col">
        {/* Üst Başlık */}
        <div className="p-4 sm:p-5 border-b border-[hsl(var(--border))] flex items-center justify-between bg-[#0F3D2E] text-[#FBF9F4] rounded-t-[8px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#B45309] text-white flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg text-white m-0">
                TÜİK Resmi Verisi Aktar (data.tuik.gov.tr)
              </h3>
              <p className="text-[12px] font-mono text-white/80 m-0">
                Resmi ÇEGF, Hayvancılık Rayici ve Tarım-ÜFE Hesaplamasını Rapora Ekle
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="p-3 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAktifMod("bitkisel")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
              aktifMod === "bitkisel"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            }`}
          >
            <Wheat className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bitkisel Verim & ÇEGF</span>
          </button>

          <button
            type="button"
            onClick={() => setAktifMod("hayvancilik")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
              aktifMod === "hayvancilik"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            }`}
          >
            <Beef className="w-3.5 h-3.5 text-amber-600" />
            <span>Hayvancılık & Telef Rayici</span>
          </button>

          <button
            type="button"
            onClick={() => setAktifMod("ecrimisil")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
              aktifMod === "ecrimisil"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#0F3D2E]" />
            <span>Tarım-ÜFE Ecrimisil</span>
          </button>
        </div>

        {/* Gövde */}
        <div className="p-5 space-y-4">
          {/* 1. BİTKİSEL MODU */}
          {aktifMod === "bitkisel" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                    İL SEÇİN
                  </label>
                  <select
                    value={seciliIl}
                    onChange={(e) => {
                      setSeciliIl(e.target.value);
                      setSeciliUrunId("");
                    }}
                    className="w-full h-9 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] font-medium"
                  >
                    {TUIK_IL_LISTESI.map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                    ÜRÜN SEÇİN
                  </label>
                  <select
                    value={seciliUrunId || (aktifBitkiselUrun ? aktifBitkiselUrun.id : "")}
                    onChange={(e) => setSeciliUrunId(e.target.value)}
                    className="w-full h-9 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] font-medium"
                  >
                    {ilUrunleri.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.urun} ({u.araziTipi} - {u.yil})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {aktifBitkiselUrun && (
                <div className="p-4 bg-[hsl(var(--muted))] rounded-[6px] border border-[hsl(var(--border))] space-y-3 font-mono text-[12px]">
                  <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-2">
                    <span className="font-serif font-bold text-[14px] text-[hsl(var(--card-foreground))]">
                      {aktifBitkiselUrun.il} — {aktifBitkiselUrun.urun}
                    </span>
                    <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-[4px] text-[11px]">
                      {aktifBitkiselUrun.araziTipi} Tarım (KFO %{aktifBitkiselUrun.kfoOnerilen})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px]">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Ort. Verim</span>
                      <strong className="text-[13px]">{aktifBitkiselUrun.verimKgDa} kg/da</strong>
                    </div>
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px]">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">ÇEGF Fiyatı</span>
                      <strong className="text-[13px]">₺{aktifBitkiselUrun.fiyatTlKg.toFixed(2)}/kg</strong>
                    </div>
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px]">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Dekar Masrafı</span>
                      <strong className="text-[13px]">₺{aktifBitkiselUrun.masrafTlDa.toLocaleString("tr-TR")}</strong>
                    </div>
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px] border border-[#0F3D2E]/30">
                      <span className="text-[10px] text-[#0F3D2E] dark:text-emerald-400 block font-bold">Net Gelir</span>
                      <strong className="text-[13px] text-[#0F3D2E] dark:text-emerald-400">
                        ₺{aktifBitkiselUrun.netGelirTlDa.toLocaleString("tr-TR")}
                      </strong>
                    </div>
                  </div>

                  <p className="font-sans text-[11.5px] text-[hsl(var(--muted-foreground))] pt-1 m-0">
                    Resmi Dayanak: {aktifBitkiselUrun.kaynakNo} • Yargıtay 5. HD Gelir Metodu Uyumlu
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. HAYVANCILIK MODU */}
          {aktifMod === "hayvancilik" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                  HAYVAN TÜRÜ VE IRKI SEÇİN
                </label>
                <select
                  value={seciliHayvanId}
                  onChange={(e) => setSeciliHayvanId(e.target.value)}
                  className="w-full h-9 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] font-medium"
                >
                  {TUIK_HAYVANCILIK_VERITABANI.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.tur}: {h.irk} ({h.kategori}) — Ortalama: ₺{h.ortalamaBasDegeriTl.toLocaleString("tr-TR")}
                    </option>
                  ))}
                </select>
              </div>

              {aktifHayvan && (
                <div className="p-4 bg-[hsl(var(--muted))] rounded-[6px] border border-[hsl(var(--border))] space-y-3 font-mono text-[12px]">
                  <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-2">
                    <span className="font-serif font-bold text-[14px] text-[hsl(var(--card-foreground))]">
                      {aktifHayvan.irk} ({aktifHayvan.tur})
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-[4px] text-[11px]">
                      {aktifHayvan.kategori}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px]">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Canlı Ağırlık</span>
                      <strong className="text-[13px]">{aktifHayvan.canliAgirlikKg} kg</strong>
                    </div>
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px]">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Karkas (%{aktifHayvan.karkasRandimaniPct})</span>
                      <strong className="text-[13px]">{aktifHayvan.karkasAgirligiKg} kg</strong>
                    </div>
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px]">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">Karkas Et Fiyatı</span>
                      <strong className="text-[13px]">₺{aktifHayvan.karkasEtFiyatiTlKg}/kg</strong>
                    </div>
                    <div className="p-2 bg-[hsl(var(--card))] rounded-[4px] border border-[#0F3D2E]/30">
                      <span className="text-[10px] text-[#0F3D2E] dark:text-emerald-400 block font-bold">Baş Rayici</span>
                      <strong className="text-[13px] text-[#0F3D2E] dark:text-emerald-400">
                        ₺{aktifHayvan.ortalamaBasDegeriTl.toLocaleString("tr-TR")}
                      </strong>
                    </div>
                  </div>

                  <p className="font-sans text-[11.5px] text-[hsl(var(--muted-foreground))] pt-1 m-0">
                    Kaynak: {aktifHayvan.resmiKaynak} • {aktifHayvan.aciklama}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 3. ECRİMİSİL MODU */}
          {aktifMod === "ecrimisil" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                    BAŞLANGIÇ YILI
                  </label>
                  <select
                    value={ecriBaslangicYil}
                    onChange={(e) => setEcriBaslangicYil(Number(e.target.value))}
                    className="w-full h-9 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] font-mono"
                  >
                    {TUIK_TARIM_UFE_SERISI.map((u) => (
                      <option key={u.yil} value={u.yil}>
                        {u.yil} (Tarım-ÜFE %{u.aralikYillikArtisPct})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[hsl(var(--muted-foreground))] mb-1">
                    İLK YIL TESPİT EDİLEN NET GELİR (TL)
                  </label>
                  <input
                    type="number"
                    value={ecriBaslangicTutar}
                    onChange={(e) => setEcriBaslangicTutar(Number(e.target.value))}
                    className="w-full h-9 px-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-[hsl(var(--muted))] rounded-[6px] font-mono text-[12px] space-y-1">
                <span className="text-[hsl(var(--muted-foreground))] block">
                  TÜİK Resmi Tarım-ÜFE serisiyle (2020-2026) kümülatif artış hesaplanır ve mahkemeye sunulacak tablo metin formatında rapora eklenir.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Alt Eylem Butonları */}
        <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--muted))]/50">
          <a
            href="https://data.tuik.gov.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-blue-600 hover:underline flex items-center gap-1 font-mono"
          >
            <span>data.tuik.gov.tr Portalında Ara</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-9 px-3 text-[12.5px]"
            >
              Vazgeç
            </button>

            <button
              type="button"
              onClick={() => {
                if (aktifMod === "bitkisel") handleBitkiselAktar();
                else if (aktifMod === "hayvancilik") handleHayvancilikAktar();
                else if (aktifMod === "ecrimisil") handleEcrimisilAktar();
              }}
              className="btn-primary h-9 px-4 text-[12.5px] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Rapora Aktar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

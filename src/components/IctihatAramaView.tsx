import React, { useState, useMemo } from "react";
import {
  Scale,
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Building2,
  Landmark,
  FileText,
  BookOpen,
  Filter,
  Sparkles,
  Gavel,
  ShieldCheck,
  Check,
  X,
  Share2,
  Layers,
} from "lucide-react";
import {
  RESMI_ICTIHAT_PORTALLARI,
  RESMI_ICTIHATLAR_DB,
  ResmiIctihat,
  ResmiIctihatPortali,
} from "../data/ictihatData";

interface IctihatAramaViewProps {
  showToast: (msg: string) => void;
}

export default function IctihatAramaView({ showToast }: IctihatAramaViewProps) {
  const [aramaMetni, setAramaMetni] = useState<string>("");
  const [seciliDaire, setSeciliDaire] = useState<string>("Tümü");
  const [seciliKategori, setSeciliKategori] = useState<string>("Tümü");
  const [seciliKararId, setSeciliKararId] = useState<string | null>(null);
  const [kopyalananId, setKopyalananId] = useState<string | null>(null);

  // Hızlı arama anahtar kelimeleri
  const hizliAramalar = [
    { etiket: "KFO %4 Sulu Tarım", sorgu: "sulu tarım KFO %4 kapitalizasyon" },
    { etiket: "TÜİK Tarım-ÜFE Ecrimisil", sorgu: "ecrimisil TÜİK tarım-üfe kademeli" },
    { etiket: "TARSİM Eksper İtirazı", sorgu: "TARSİM eksper raporu kesin delil değildir don hasarı" },
    { etiket: "Hayvan Telefi Hurda Mahsubu", sorgu: "hayvan telefi hurda et karkas mahsubu TBK 49" },
    { etiket: "Aflatoksinli Ayıplı Yem", sorgu: "aflatoksinli yem verim kaybı ayıplı mal imalatçı sorumluluğu" },
    { etiket: "İrtifak DDO Formülü", sorgu: "2942 irtifak değer düşüklüğü oranı DDO formülü" },
    { etiket: "15-20-25 Yıl Hava Fotoğrafı", sorgu: "kadastro zilyetlik 3 farklı tarih stereoskopik hava fotoğrafı" },
    { etiket: "Arsa-Tarla İBBK", sorgu: "arsa tarla ayrımı imar planı mücavir alan İBBK" },
    { etiket: "Sulu 40 da Tavanı", sorgu: "3402 14 sulu 40 dekar kuru 100 dekar zilyetlik tavanı" },
  ];

  // Daire filtre listesi
  const daireler = [
    "Tümü",
    "Yargıtay 5. Hukuk Dairesi",
    "Yargıtay 3. Hukuk Dairesi",
    "Yargıtay 11. Hukuk Dairesi",
    "Yargıtay 16. Hukuk Dairesi",
    "Yargıtay 8. Hukuk Dairesi",
    "Yargıtay İçtihadı Birleştirme Büyük Genel Kurulu",
  ];

  // Filtrelenmiş yerleşik kararlar
  const filtrelenmisKararlar = useMemo(() => {
    return RESMI_ICTIHATLAR_DB.filter((karar) => {
      // Daire filtresi
      if (seciliDaire !== "Tümü" && karar.daire !== seciliDaire) return false;

      // Kategori filtresi
      if (seciliKategori !== "Tümü" && karar.kategori !== seciliKategori) return false;

      // Arama metni
      if (aramaMetni.trim() !== "") {
        const q = aramaMetni.toLowerCase();
        const matchesKonu = karar.konu.toLowerCase().includes(q);
        const matchesOzet = karar.ozet.toLowerCase().includes(q);
        const matchesMetin = karar.metin.toLowerCase().includes(q);
        const matchesEsas = karar.esas.toLowerCase().includes(q);
        const matchesDaire = karar.daire.toLowerCase().includes(q);
        const matchesTag = karar.tag.toLowerCase().includes(q);
        const matchesLaw = karar.kanunMaddeleri.some((k) => k.toLowerCase().includes(q));
        return matchesKonu || matchesOzet || matchesMetin || matchesEsas || matchesDaire || matchesTag || matchesLaw;
      }

      return true;
    });
  }, [aramaMetni, seciliDaire, seciliKategori]);

  // Seçili detay kararı
  const aktifKarar = useMemo(() => {
    if (seciliKararId) {
      return RESMI_ICTIHATLAR_DB.find((k) => k.id === seciliKararId) || null;
    }
    return filtrelenmisKararlar.length > 0 ? filtrelenmisKararlar[0] : null;
  }, [seciliKararId, filtrelenmisKararlar]);

  // Resmi sitede arama başlatma
  const handleOpenOfficialSearch = (portal: ResmiIctihatPortali) => {
    const query = aramaMetni.trim() || "zirai bilirkişi emsal karar";
    const targetUrl = portal.searchUrlTemplate(query);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    showToast(`🏛️ ${portal.ad} sisteminde arama başlatıldı: "${query}"`);
  };

  // Kararı panoya kopyalama
  const handleCopyDecision = (karar: ResmiIctihat) => {
    const metin = `
${karar.daire}
Esas No  : ${karar.esas}
Karar No : ${karar.karar}
Tarih    : ${karar.tarih}
Konu     : ${karar.konu}
Yasal Dayanak: ${karar.kanunMaddeleri.join(", ")}

ÖZET / HÜKÜM:
${karar.ozet}

KARAR METNİ:
${karar.metin}

BİLİRKİŞİ İÇİN TEMEL İLKELER:
${karar.onemliIlkeler.map((i) => `• ${i}`).join("\n")}
Kaynak: Resmi Yargıtay Bilgi İşlem Merkezi (karararama.yargitay.gov.tr)
`.trim();

    navigator.clipboard.writeText(metin);
    setKopyalananId(karar.id);
    showToast(`📋 ${karar.daire} (${karar.esas}) kararı panoya kopyalandı.`);
    setTimeout(() => setKopyalananId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ÜST BAŞLIK VE RESMİ SİTELER TANITIMI */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-violet-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shadow-inner">
                <Scale size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/30 text-violet-200 border border-violet-400/40 uppercase tracking-wider">
                    RESMİ YARGI SİSTEMLERİ ENTEGRASYONU
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    CANLI ARAMA DESTEKLİ
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  Akıllı İçtihat Arama & Resmi Emsal Karar Motoru
                </h2>
                <p className="text-xs sm:text-sm text-violet-200/90">
                  T.C. Yargıtay, UYAP Emsal Karar, Danıştay ve Mevzuat Bilgi Sistemi üzerinden anlık canlı arama yapın; yerleşik zirai ve hayvancılık içtihatlarını inceleyin.
                </p>
              </div>
            </div>
          </div>

          {/* ARAMA VE SORGULAMA BARI */}
          <div className="pt-2">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-3.5 text-violet-300" />
                <input
                  type="text"
                  placeholder="İçtihat konusu, daire adı, kanun maddesi veya anahtar kelime yazın... (örn: sulu tarım KFO %4, aflatoksinli yem, ecrimisil ÜFE)"
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && RESMI_ICTIHAT_PORTALLARI[0]) {
                      handleOpenOfficialSearch(RESMI_ICTIHAT_PORTALLARI[0]);
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 text-white placeholder-violet-200/60 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white/20 transition border border-white/10"
                />
                {aramaMetni && (
                  <button
                    onClick={() => setAramaMetni("")}
                    className="absolute right-3.5 top-3.5 text-violet-300 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Doğrudan Yargıtay'da Canlı Ara Butonu */}
              <button
                onClick={() => handleOpenOfficialSearch(RESMI_ICTIHAT_PORTALLARI[0])}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-700/40 transition shrink-0"
              >
                <Landmark size={17} />
                <span>Resmi Yargıtay'da Ara</span>
                <ExternalLink size={14} />
              </button>

              {/* UYAP Emsal'de Ara Butonu */}
              <button
                onClick={() => handleOpenOfficialSearch(RESMI_ICTIHAT_PORTALLARI[1])}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-700/40 transition shrink-0"
              >
                <Building2 size={17} />
                <span>UYAP'ta Ara</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* HIZLI ARAMA ETİKETLERİ */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-violet-300 text-[11px] font-semibold flex items-center gap-1 mr-1">
              <Sparkles size={13} className="text-amber-400" />
              Sık Aranan Zirai Konular:
            </span>
            {hizliAramalar.map((h, i) => (
              <button
                key={i}
                onClick={() => setAramaMetni(h.sorgu)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-violet-100 border border-white/10 text-[11px] font-medium transition"
              >
                {h.etiket}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. RESMİ İÇTİHAT VE KARAR ARAMA PORTALLARI ŞERİDİ */}
      {/* ===================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Landmark size={18} className="text-violet-700" />
            Resmi Yargı ve Mevzuat Karar Arama Sistemleri
          </h3>
          <span className="text-xs text-slate-500">
            Arama sorgunuz doğrudan bu resmi portallarda açılır
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {RESMI_ICTIHAT_PORTALLARI.map((portal) => (
            <div
              key={portal.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    {portal.badge}
                  </span>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-violet-600 transition"
                    title="Ana Portala Git"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{portal.ad}</h4>
                <p className="text-[11px] text-slate-500">{portal.kurum}</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {portal.aciklama}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Ana Sayfaya Git
                </a>

                <button
                  onClick={() => handleOpenOfficialSearch(portal)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 transition"
                >
                  <span>"{aramaMetni ? aramaMetni.slice(0, 15) + "..." : "Sorguyu"}" Ara</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DOĞRULANMIŞ YERLEŞİK YARGITAY KARARLARI ARAMA & GÖRÜNTÜLEYİCİ */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SOL PANEL: LİSTE VE FİLTRELER (5 KOLON) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter size={14} className="text-violet-600" />
                Daire ve Kategori Filtreleri
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {filtrelenmisKararlar.length} Karar
              </span>
            </div>

            {/* Daire Seçici */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Yargıtay Dairesi:</label>
              <select
                value={seciliDaire}
                onChange={(e) => setSeciliDaire(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {daireler.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Kategori Butonları */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Tümü", "kamulastirma", "tarim", "hayvancilik", "yemler", "kadastro"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setSeciliKategori(kat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                    seciliKategori === kat
                      ? "bg-violet-600 border-violet-600 text-white font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {kat === "Tümü"
                    ? "Tümü"
                    : kat === "kamulastirma"
                    ? "Kamulaştırma"
                    : kat === "tarim"
                    ? "Tarım & Hasar"
                    : kat === "hayvancilik"
                    ? "Hayvancılık"
                    : kat === "yemler"
                    ? "Yemler"
                    : "Kadastro"}
                </button>
              ))}
            </div>
          </div>

          {/* KARAR LİSTESİ */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filtrelenmisKararlar.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                <AlertCircle size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-semibold">Arama kriterlerine uygun yerleşik karar bulunamadı.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Yukarıdaki "Resmi Yargıtay'da Ara" butonuna basarak doğrudan resmi Yargıtay portalında arama yapabilirsiniz.
                </p>
              </div>
            ) : (
              filtrelenmisKararlar.map((karar) => {
                const isSelected = aktifKarar?.id === karar.id;
                return (
                  <div
                    key={karar.id}
                    onClick={() => setSeciliKararId(karar.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                      isSelected
                        ? "bg-violet-50/80 border-violet-500 shadow-md ring-2 ring-violet-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                        {karar.tag}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-500">
                        {karar.tarih}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2 leading-snug">
                      {karar.daire} • {karar.esas} / {karar.karar}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {karar.konu}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2.5 mt-2 border-t border-slate-100 text-slate-400">
                      <span className="font-mono text-[11px] text-violet-700 font-semibold">
                        {karar.kanunMaddeleri.slice(0, 2).join(", ")}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        Detayı Gör →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SAĞ PANEL: SEÇİLİ KARAR DETAYI VE HMK GEREKÇE OLUŞTURUCU (7 KOLON) */}
        <div className="lg:col-span-7">
          {aktifKarar ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden space-y-0">
              {/* Karar Başlığı */}
              <div className="p-6 bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    {aktifKarar.tag}
                  </span>
                  <span className="text-xs font-mono text-violet-200">
                    Karar Tarihi: {aktifKarar.tarih}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mt-2 text-white">
                  {aktifKarar.daire}
                </h3>
                <p className="text-xs text-violet-200 font-mono mt-0.5">
                  Esas: <b>{aktifKarar.esas}</b> • Karar: <b>{aktifKarar.karar}</b>
                </p>

                {/* Aksiyon Butonları */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleCopyDecision(aktifKarar)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition shadow-sm"
                  >
                    {kopyalananId === aktifKarar.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{kopyalananId === aktifKarar.id ? "Kopyalandı!" : "Kararı Metne Kopyala"}</span>
                  </button>

                  <a
                    href={`https://www.google.com/search?q=site:karararama.yargitay.gov.tr+OR+site:yargitay.gov.tr+${encodeURIComponent(aktifKarar.daire + " " + aktifKarar.esas + " " + aktifKarar.karar)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition shadow-sm"
                  >
                    <ExternalLink size={14} />
                    <span>Resmi Yargıtay'da Doğrula</span>
                  </a>

                  <a
                    href={`https://www.google.com/search?q=site:emsal.uyap.gov.tr+${encodeURIComponent(aktifKarar.esas + " " + aktifKarar.karar)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                  >
                    <Building2 size={14} />
                    <span>UYAP'ta Sorgula</span>
                  </a>
                </div>
              </div>

              {/* Karar Gövdesi */}
              <div className="p-6 space-y-5 text-sm text-slate-700">
                {/* Konu & Yasal Dayanak */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                    Uyuşmazlık Konusu:
                  </span>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {aktifKarar.konu}
                  </p>
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[11px] text-slate-500 mr-1 font-medium">İlgili Mevzuat Maddeleri:</span>
                    {aktifKarar.kanunMaddeleri.map((madde, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                        {madde}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hüküm Özeti */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen size={15} className="text-violet-600" />
                    Yargıtay Emsal Karar Özeti:
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700 p-3 bg-violet-50/40 rounded-xl border border-violet-100">
                    {aktifKarar.ozet}
                  </p>
                </div>

                {/* Resmi Karar Gerekçe Metni */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Gavel size={15} className="text-violet-600" />
                    Resmi İlam Gerekçesi (İçtihat Metni):
                  </span>
                  <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-serif text-xs leading-relaxed border border-slate-800 whitespace-pre-line shadow-inner">
                    "{aktifKarar.metin}"
                  </div>
                </div>

                {/* Bilirkişiler İçin Temel İlkeler ve Bozma Sebepleri */}
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    Bilirkişi Raporlarında Kesinlikle Uyulması Gereken Yargıtay Standartları:
                  </span>
                  <ul className="text-xs space-y-1 text-slate-700">
                    {aktifKarar.onemliIlkeler.map((ilke, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                        <span>{ilke}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
              Lütfen sol listeden incelemek istediğiniz kararı seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

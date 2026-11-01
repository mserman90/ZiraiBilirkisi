import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Scale,
  Search,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  FolderOpen,
  Wheat,
  Beef,
  Milk,
  ExternalLink,
  Database,
  Globe,
  ArrowRight,
} from "lucide-react";
import { ALAN_TANIMLARI, UzmanlikAlani } from "../../data/fields";
import KenarNotu from "./KenarNotu";
import TarimVeriArsiviView from "../TarimVeriArsiviView";

interface KutuphaneViewProps {
  onYeniRaporBaslat: () => void;
  showToast: (msg: string) => void;
  onTransferToWizard?: (data: { netGelir: number; araziTipi: "sulu" | "kuru"; urunAdi: string }) => void;
  onEmsalAktar?: (metin: string) => void;
}

interface EmsalMetin {
  id: string;
  baslik: string;
  alan: UzmanlikAlani;
  kanun: string;
  ozet: string;
  tamMetin: string;
  anahtarKelimeler: string[];
}

const EMSAL_METINLER: EmsalMetin[] = [
  {
    id: "ems-01",
    baslik: "Sulu Tarım Arazisinde Net Gelir Kapitalizasyonu",
    alan: "ziraat",
    kanun: "2942 sayılı Kanun m. 11/f — Yargıtay 5. HD Emsali",
    ozet: "Tarla vasıflı taşınmazın mutat münavebeye (Buğday-Mısır) göre resmi ilçe tarım dekar maliyet cetveliyle değerleme ilkesi.",
    tamMetin:
      "Dava konusu taşınmazın sulu tarım arazisi niteliği haiz olduğu, bölgede mutat münavebe ürünlerinin Buğday ve İkinci Ürün Mısır olduğu tespit edilmiştir. Gölbaşı İlçe Tarım ve Orman Müdürlüğü'nün resmi 2024 yılı üretim masraf cetveline göre münavebe ürünlerinin net gelirleri toplanarak ikiye bölünmüş, yörenin iktisadi koşulları ve su temin kolaylığı gözetilerek %5 kapitalizasyon faizi tatbikiyle çıplak arazi birim değeri 62,83 TL/m² olarak hesaplanmıştır.",
    anahtarKelimeler: ["Kamulaştırma", "Sulu Tarla", "Kapitalizasyon Faizi", "Münavebe"],
  },
  {
    id: "ems-02",
    baslik: "Kapama Meyve Bahçesi ve Ağaç Değerleme Yöntemi",
    alan: "ziraat",
    kanun: "Kamulaştırma Kanunu m. 11 — Tarım ve Orman Bakanlığı Fidan/Ağaç Rayici",
    ozet: "Taşınmaz üzerindeki kapama ceviz/zeytin bahçesinde yaş, taç gelişimi ve yıllık ortalama ürün verimi üzerinden değer tespiti.",
    tamMetin:
      "Taşınmaz üzerinde dikili bulunan 140 adet Chandler cinsi ceviz ağaçlarının 8-10 yaş grubunda, tam verim çağında, taç teşekkülünün muntazam olduğu görülmüştür. Ağaçların kamulaştırma tarihindeki yaşlarına göre Tarım ve Orman İl Müdürlüğü resmi meyve ağaçları birim bedel cetveli ile mahallin objektif rayiçleri karşılaştırılarak her bir ağaç için 2.450,00 TL olmak üzere toplam ağaç değeri 343.000,00 TL olarak tespit olunmuştur.",
    anahtarKelimeler: ["Ağaç Değeri", "Ceviz", "Kapama Bahçe", "Birim Fiyat"],
  },
  {
    id: "ems-03",
    baslik: "Süt İşletmesi Bozulmuş Hammadde ve Zayiat Tazminatı",
    alan: "gida",
    kanun: "6098 sayılı TBK m. 219 — Türk Gıda Kodeksi Çiğ Süt Tebliği",
    ozet: "Soğutma sistemindeki arıza sebebiyle asitliği yükselen ve mikrobiyolojik yönden bozulan çiğ sütün imha ve zayiat hesabı.",
    tamMetin:
      "Tesis mahallinde yapılan denetimde, soğutma tankı veri kaydedici (datalogger) cihazından alınan ısı eğrileri incelenmiş; 18.500 litre çiğ sütün 14 saat süreyle +14°C sıcaklığa maruz kaldığı belirlenmiştir. Yapılan laboratuvar analizinde pH değerinin 5.2'ye düştüğü ve sütün kesilerek Türk Gıda Kodeksi standartlarına göre işlenemez ve satılamaz hale geldiği tespit edilmiş; Ulusal Süt Konseyi referans litre fiyatı esas alınarak toplam zarar hesaplanmıştır.",
    anahtarKelimeler: ["Çiğ Süt", "Zayiat", "Soğuk Zincir", "Gıda Kodeksi"],
  },
  {
    id: "ems-04",
    baslik: "Enerji Nakil Hattı Kaçağı ile Büyükbaş Hayvan Telefi",
    alan: "hayvancilik",
    kanun: "6098 sayılı TBK m. 71 — Yargıtay 3. HD Hayvan Telefi",
    ozet: "Elektrik akımına kapılarak telef olan gebe damızlık sığırların karkas hurda bedeli mahsubu ve yoksun kalınan kâr hesabı.",
    tamMetin:
      "İlçe Tarım Müdürlüğü veteriner hekimince tanzim edilen nekropsi raporunda, 4 baş Holstein ırkı gebe damızlık süt sığırının elektrik çarpması neticesinde kardiyak arrest sebebiyle telef olduğu saptanmıştır. Konya Ticaret Borsası ve Kırmızı Et Üreticileri Birliği verileriyle canlı hayvan piyasa rayici hesaplanmış; etinden ve derisinden faydalanılamadığı için hurda bedeli mahsubuna gidilmeksizin ve gebelik dönemine göre buzağı kaybı eklenerek nihai tazminat tutarı belirlenmiştir.",
    anahtarKelimeler: ["Hayvan Telefi", "Elektrik Çarpması", "Damızlık", "Yoksun Kalınan Kâr"],
  },
  {
    id: "ems-05",
    baslik: "İcra & Haciz Çiftçi Geçim Araçları Denetimi (İİK m. 82/4-5)",
    alan: "ziraat",
    kanun: "2004 sayılı İcra ve İflas Kanunu m. 82 — Haczedilmezlik Sınırı",
    ozet: "Borçlu çiftçinin ve ailesinin geçimi için zorunlu olan traktör, alet-edevat ve damızlık hayvanların haczedilmezlik analizi.",
    tamMetin:
      "İİK m. 82/4-5 hükümleri uyarınca; borçlunun işlettiği 45 dekar kuru tarım arazisinin münavebe ürünleri (arpa-nohut) ve bu üretimden elde edilen net gelir ile ailenin asgari geçim endeksi mukayese edilmiştir. 65 beygir gücündeki traktörün ve 2 baş sağmal ineğin borçlu çiftçinin ve ailesinin geçimini temin için vazgeçilmez nitelikte olduğu, haczedilmezlik şartlarını taşıdığı, buna karşılık atıl vaziyetteki ikinci römorkun haczedilebilir olduğu tespit edilmiştir.",
    anahtarKelimeler: ["İİK 82", "Haczedilmezlik", "Traktör", "Çiftçi Geçimi"],
  },
  {
    id: "ems-06",
    baslik: "HMK 279 Hukuki Mütalaa Yasağı ve Kusur İncelemesi",
    alan: "ziraat",
    kanun: "6100 sayılı HMK m. 279/1 — Yargıtay Hukuk Genel Kurulu",
    ozet: "Bilirkişinin tarafların kusur oranlarına ve hukuki sorumluluğuna girmeden teknik tespit yapma zorunluluğu.",
    tamMetin:
      "Yargıtay Hukuk Genel Kurulu'nun yerleşik kararları ve HMK m. 279/1 amir hükmü gereğince, teknik bilirkişi heyetimizce 'davalı kusurludur', 'illiyet bağı kopmuştur' veya 'dava reddedilmelidir' şeklinde hâkimin münhasır takdir yetkisindeki hukuki değerlendirmelerden imtina edilmiş; yalnızca taşkın suyun debisi, tarladaki mil tabakası ve ürün gelişim dönemine göre meydana gelen biyolojik verim kaybı yüzdesi belirlenmiştir.",
    anahtarKelimeler: ["HMK 279", "Kusur Yasağı", "Hukuki Mütalaa", "Bozma Sebebi"],
  },
];

export default function KutuphaneView({
  onYeniRaporBaslat,
  showToast,
  onTransferToWizard,
  onEmsalAktar,
}: KutuphaneViewProps) {
  const [anaSekme, setAnaSekme] = useState<"emsaller" | "tuik">("emsaller");
  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliAlan, setSeciliAlan] = useState<"hepsi" | UzmanlikAlani>("hepsi");
  const [kopyalananId, setKopyalananId] = useState<string | null>(null);

  const filtrelenmisMetinler = useMemo(() => {
    return EMSAL_METINLER.filter((item) => {
      const alanUygun = seciliAlan === "hepsi" || item.alan === seciliAlan;
      const aramaUygun =
        aramaMetni === "" ||
        item.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        item.kanun.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        item.ozet.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        item.tamMetin.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        item.anahtarKelimeler.some((k) =>
          k.toLowerCase().includes(aramaMetni.toLowerCase())
        );
      return alanUygun && aramaUygun;
    });
  }, [seciliAlan, aramaMetni]);

  const handleKopyala = (id: string, metin: string) => {
    navigator.clipboard.writeText(metin);
    setKopyalananId(id);
    showToast("Emsal metin panoya kopyalandı");
    setTimeout(() => setKopyalananId(null), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Üst Başlık & Ana Sekmeler */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#B45309] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>RESMÎ EMSAL & MEVZUAT KÜTÜPHANESİ</span>
          </div>
          <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-[hsl(var(--card-foreground))] m-0">
            Bilirkişi Bilgi & Mevzuat Kütüphanesi
          </h1>
          <p className="font-sans text-[14.5px] text-[hsl(var(--muted-foreground))] mt-1 max-w-3xl">
            Yargıtay denetiminden geçmiş emsal bilirkişi gerekçeleri ile TÜİK resmi veri tabanı,
            maliyet cetvelleri ve Tarım-ÜFE serileri.
          </p>
        </div>

        {/* Ana Sekme Seçici: Emsaller vs TÜİK Veri Portalı */}
        <div className="flex items-center gap-1.5 p-1 bg-[hsl(var(--muted))] rounded-[8px] border border-[hsl(var(--border))] shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setAnaSekme("emsaller")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
              anaSekme === "emsaller"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            }`}
          >
            <Scale className="w-4 h-4 text-[#0F3D2E] dark:text-emerald-400" />
            <span>1. Emsal Kararlar ({EMSAL_METINLER.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAnaSekme("tuik")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
              anaSekme === "tuik"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xs font-semibold"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            }`}
          >
            <Database className="w-4 h-4 text-[#B45309]" />
            <span>2. TÜİK Veri Arşivi & ÇEGF</span>
          </button>
        </div>
      </div>

      {/* SEKME 2 AKTİFSE: TÜİK VERİ ARŞİVİ BİLEŞENİ GÖSTERİLİR */}
      {anaSekme === "tuik" ? (
        <TarimVeriArsiviView
          showToast={showToast}
          onTransferToWizard={onTransferToWizard}
        />
      ) : (
        <>
          {/* TÜİK Doğrudan Erişim Bilgi Kartı */}
          <div className="resmi-kart p-4 mb-6 bg-[#0F3D2E]/5 dark:bg-[#0F3D2E]/20 border-[#0F3D2E]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] bg-[#0F3D2E] text-white flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-[15px] text-[hsl(var(--card-foreground))] m-0">
                  TÜİK ve Resmî Maliyet Veri Arşivi
                </h4>
                <p className="font-sans text-[12.5px] text-[hsl(var(--muted-foreground))] m-0">
                  81 ilin resmi bitkisel ürün verimleri, çiftçi satış fiyatları, Tarım-ÜFE ve girdi endekslerine tek tıkla ulaşın.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAnaSekme("tuik")}
              className="btn-primary h-8 px-3 text-[12px] font-semibold shrink-0"
            >
              Veri Arşivini İncele
            </button>
          </div>

          {/* Arama ve Filtreleme */}
          <div className="resmi-kart p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Arama Inputu */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                placeholder="Mevzuat maddesi, emsal karar veya anahtar kelime ara..."
                className="w-full h-10 pl-9 pr-4 text-[13.5px] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[6px] focus:outline-none focus:border-[#0F3D2E] text-[hsl(var(--card-foreground))]"
              />
            </div>

            {/* Alan Filtre Butonları */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSeciliAlan("hepsi")}
                className={`h-9 px-3 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                  seciliAlan === "hepsi"
                    ? "bg-[#0F3D2E] text-[#FBF9F4]"
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"
                }`}
              >
                Tüm Emsaller ({EMSAL_METINLER.length})
              </button>

              {(["ziraat", "gida", "hayvancilik"] as UzmanlikAlani[]).map((alan) => (
                <button
                  key={alan}
                  type="button"
                  onClick={() => setSeciliAlan(alan)}
                  className={`h-9 px-3 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                    seciliAlan === alan
                      ? "bg-[#0F3D2E] text-[#FBF9F4]"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]"
                  }`}
                >
                  {ALAN_TANIMLARI[alan].ad.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 2 Kolonlu Kütüphane Kart Gridi (Görselsiz, Bilgi Yoğun) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtrelenmisMetinler.map((item) => {
              const alanInfo = ALAN_TANIMLARI[item.alan];
              const isCopied = kopyalananId === item.id;

              return (
                <article
                  key={item.id}
                  className="resmi-kart p-5 flex flex-col justify-between space-y-4 hover:border-[#0F3D2E]/40 transition-colors"
                >
                  {/* Üst Bilgi ve Başlık */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`alan-badge-${item.alan}`}>
                        {alanInfo.ad}
                      </span>
                      <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-[4px]">
                        {item.kanun}
                      </span>
                    </div>

                    <h3 className="font-serif font-semibold text-[18px] sm:text-[19px] leading-[1.3] text-[hsl(var(--card-foreground))] m-0">
                      {item.baslik}
                    </h3>

                    <p className="font-sans text-[13.5px] leading-[1.6] text-[hsl(var(--muted-foreground))]">
                      {item.ozet}
                    </p>
                  </div>

                  {/* Kanun Maddesi Kenar Çizgisi Kutusu */}
                  <KenarNotu tip="ornek_ifade" baslik="Bilirkişi Rapor Metni">
                    <p className="italic text-[13px] leading-[1.7] text-[hsl(var(--card-foreground))]">
                      "{item.tamMetin}"
                    </p>
                  </KenarNotu>

                  {/* Alt Etiketler & Kopyalama Eylemi */}
                  <div className="pt-3 border-t border-[hsl(var(--border))] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {item.anahtarKelimeler.map((kelime, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-1.5 py-0.5 rounded-[3px]"
                        >
                          #{kelime}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleKopyala(item.id, item.tamMetin)}
                        className="h-8 px-3 rounded-[6px] text-[12px] font-sans font-semibold border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--card-foreground))] flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#15803D]" />
                            <span className="text-[#15803D]">Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>Metni Kopyala</span>
                          </>
                        )}
                      </button>

                      {onEmsalAktar && (
                        <button
                          type="button"
                          onClick={() => onEmsalAktar(`[EMSAL BİLİRKİŞİ RAPOR DAYANAĞI]\n${item.tamMetin}`)}
                          className="h-8 px-3 rounded-[6px] text-[12px] font-sans font-semibold bg-[#0F3D2E] hover:bg-[#15543F] text-white flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-xs"
                          title="Bu emsal metnini aktif raporun dayanak bölümüne aktar"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                          <span>Rapora Aktar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

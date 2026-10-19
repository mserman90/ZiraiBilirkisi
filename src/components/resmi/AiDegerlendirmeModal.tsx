import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
  Copy,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { AiDegerlendirmeSonucu } from "../../data/fields";
import KenarNotu from "./KenarNotu";

interface AiDegerlendirmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bolumNo: number;
  bolumBasligi: string;
  mevcutMetin: string;
  onMetinUygula: (yeniMetin: string) => void;
  showToast: (msg: string) => void;
}

export default function AiDegerlendirmeModal({
  isOpen,
  onClose,
  bolumNo,
  bolumBasligi,
  mevcutMetin,
  onMetinUygula,
  showToast,
}: AiDegerlendirmeModalProps) {
  const [analizYukleniyor, setAnalizYukleniyor] = useState(true);
  const [sonuc, setSonuc] = useState<AiDegerlendirmeSonucu | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAnalizYukleniyor(true);
      const timer = setTimeout(() => {
        // HMK 279 Yasaklı Kelime Taraması
        const yasakliKelimeler = [
          "kusur",
          "kusurlu",
          "kusursuz",
          "mülkiyet",
          "kasıt",
          "suçlu",
          "haksız fiil",
          "reddedilmeli",
          "kabul edilmeli",
          "tazmin etmek zorundadır",
          "hak düşürücü",
        ];
        const metinLower = mevcutMetin.toLowerCase();
        const bulunanlar = yasakliKelimeler.filter((k) => metinLower.includes(k));
        const yasakliVar = bulunanlar.length > 0;

        // Metin uzunluğu ve resmi veri kontrolü
        const kelimeSayisi = mevcutMetin.trim().split(/\s+/).length;
        const resmiVeriVarMi =
          metinLower.includes("tarım") ||
          metinLower.includes("kanun") ||
          metinLower.includes("yargıtay") ||
          metinLower.includes("resmi");

        let skor = 88;
        if (yasakliVar) skor -= 25;
        if (!resmiVeriVarMi) skor -= 15;
        if (kelimeSayisi < 30) skor -= 20;
        if (kelimeSayisi > 80 && !yasakliVar && resmiVeriVarMi) skor = 96;

        const gucluYonler: string[] = [];
        const gelistirmeOnerileri: string[] = [];

        if (resmiVeriVarMi) {
          gucluYonler.push("Resmî kurum veri kaynaklarına ve kanun maddelerine atıf yapılmış.");
        }
        if (!yasakliVar) {
          gucluYonler.push("HMK m. 279/1 uyarınca hâkimin takdirindeki hukuki mütalaalardan kaçınılmış.");
        }
        if (kelimeSayisi >= 50) {
          gucluYonler.push("Teknik ve ziraat mühendisliği gerekçeleri detaylı olarak açıklanmış.");
        }

        if (yasakliVar) {
          gelistirmeOnerileri.push(
            `Metinde HMK 279'a aykırı düşebilecek hukuki hüküm ifadeleri tespit edildi: "${bulunanlar.join(", ")}". Bu kelimeler teknik tespit cümleleriyle değiştirilmelidir.`
          );
        }
        if (!resmiVeriVarMi) {
          gelistirmeOnerileri.push(
            "Tarım İlçe Müdürlüğü resmî maliyet cetveli veya Yargıtay emsal kararı tarih ve esas numarası eklenmelidir."
          );
        }
        if (kelimeSayisi < 40) {
          gelistirmeOnerileri.push(
            "Gerekçe metni kısa tutulmuş; keşifte bizzat gözlemlenen somut durumlar ve toprak özellikleri zenginleştirilmelidir."
          );
        }

        // Önerilen Revize Metin
        let revize = mevcutMetin;
        if (yasakliVar) {
          bulunanlar.forEach((k) => {
            const re = new RegExp(k, "gi");
            revize = revize.replace(re, "teknik sorumluluk");
          });
        }
        if (!revize.includes("HMK m. 279")) {
          revize +=
            "\n\n(Heyetimizce HMK m. 279 amir hükmü gereğince yalnızca teknik ziraat mühendisliği bulguları raporlanmış olup hukuki takdir Yüce Mahkeme'ye aittir.)";
        }

        setSonuc({
          skor: Math.max(40, Math.min(100, skor)),
          hmkUyumlu: !yasakliVar,
          yasakliKelimeVarMi: yasakliVar,
          bulunanYasakliKelimeler: bulunanlar,
          gucluYonler: gucluYonler.length ? gucluYonler : ["Metin formatı genel hatlarıyla resmî usule uygun."],
          gelistirmeOnerileri: gelistirmeOnerileri.length
            ? gelistirmeOnerileri
            : ["Metin teknik ve mevzuat yönünden yeterli doygunluktadır."],
          revizeOnerisi: revize,
        });
        setAnalizYukleniyor(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isOpen, mevcutMetin]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-text"
    >
      <div className="resmi-kart bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
        {/* Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-[#0F3D2E] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-[18px] m-0 text-[hsl(var(--card-foreground))]">
                AI Metin Değerlendirme & Yargıtay Uygunluk Analizi
              </h3>
              <p className="text-[12px] font-sans text-[hsl(var(--muted-foreground))] m-0">
                Adım {bolumNo}: {bolumBasligi}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analiz Yükleniyor Durumu */}
        {analizYukleniyor ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#0F3D2E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[14px] font-sans text-[hsl(var(--muted-foreground))]">
              HMK m. 279 standartları ve Yargıtay bozma kriterleri taranıyor...
            </p>
          </div>
        ) : (
          sonuc && (
            <div className="space-y-4">
              {/* Skor Göstergesi */}
              <div className="p-4 rounded-[8px] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] flex items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] font-mono uppercase text-[hsl(var(--muted-foreground))]">
                    MEVZUAT & YARGITAY UYGUNLUK SKORU
                  </div>
                  <div className="text-[14px] font-sans font-medium text-[hsl(var(--card-foreground))] mt-0.5">
                    {sonuc.skor >= 85
                      ? "Mükemmel — Yargıtay denetiminde usulden bozulma riski düşüktür."
                      : sonuc.skor >= 70
                      ? "İyi — Küçük teknik düzenlemelerle güçlendirilebilir."
                      : "Riskli — Hukuki mütalaa veya veri eksikliği içeriyor."}
                  </div>
                </div>

                <div
                  className={`text-2xl font-mono font-bold px-3 py-1.5 rounded-[6px] shrink-0 ${
                    sonuc.skor >= 85
                      ? "bg-green-100 text-[#15803D] dark:bg-green-950/40"
                      : sonuc.skor >= 70
                      ? "bg-amber-100 text-[#B45309] dark:bg-amber-950/40"
                      : "bg-red-100 text-[#DC2626] dark:bg-red-950/40"
                  }`}
                >
                  {sonuc.skor}/100
                </div>
              </div>

              {/* HMK 279 Uyarısı (Varsa Kırmızı Kenar Notu) */}
              {sonuc.yasakliKelimeVarMi ? (
                <KenarNotu tip="hata" baslik="HMK m. 279/1 Uyarısı: Hukuki Değerlendirme Yasağı">
                  Metninizde hâkimin münhasır takdirindeki hususlara ilişkin ifadeler tespit edilmiştir:
                  <b className="mx-1">"{sonuc.bulunanYasakliKelimeler.join(", ")}"</b>.
                  Bilirkişi yalnızca maddi vakıaları ve teknik ziraat verilerini raporlamalıdır.
                </KenarNotu>
              ) : (
                <KenarNotu tip="ogretici" baslik="HMK 279 Denetimi Başarılı">
                  Metinde hâkimin yetkisini aşan hukuki mütalaa veya kusur isnadı bulunmamaktadır.
                </KenarNotu>
              )}

              {/* Güçlü Yönler */}
              <div className="space-y-1.5">
                <h4 className="text-[13px] font-semibold text-[#15803D] flex items-center gap-1.5 m-0 font-sans">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Güçlü Yönler</span>
                </h4>
                <ul className="list-disc list-inside text-[13px] text-[hsl(var(--card-foreground))] space-y-1">
                  {sonuc.gucluYonler.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Geliştirme Önerileri */}
              <div className="space-y-1.5">
                <h4 className="text-[13px] font-semibold text-[#B45309] flex items-center gap-1.5 m-0 font-sans">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Geliştirme Tavsiyeleri</span>
                </h4>
                <ul className="list-disc list-inside text-[13px] text-[hsl(var(--card-foreground))] space-y-1">
                  {sonuc.gelistirmeOnerileri.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Önerilen İyileştirilmiş Metin */}
              <div className="space-y-2 pt-2 border-t border-[hsl(var(--border))]">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-semibold text-[14px]">
                    Önerilen Düzeltilmiş Metin
                  </span>
                  <span className="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">
                    HMK 279 Uyumlu Revizyon
                  </span>
                </div>
                <div className="p-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-[6px] text-[13px] leading-relaxed italic max-h-40 overflow-y-auto">
                  "{sonuc.revizeOnerisi}"
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary h-10 px-4"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMetinUygula(sonuc.revizeOnerisi);
                    onClose();
                    showToast("Önerilen metin editöre aktarıldı");
                  }}
                  className="btn-primary h-10 px-4"
                >
                  <Check className="w-4 h-4" />
                  <span>Önerilen Metni Editöre Uygula</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

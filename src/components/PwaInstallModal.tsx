import React from "react";
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  WifiOff,
  Zap,
  ShieldCheck,
  Sparkles,
  Monitor,
} from "lucide-react";

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallPrompt: () => void;
  isStandalone: boolean;
}

export default function PwaInstallModal({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallPrompt,
  isStandalone,
}: PwaInstallModalProps) {
  if (!isOpen) return null;

  // Platform detection
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
      <div className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Smartphone size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                PROGRESSIVE WEB APP (PWA)
              </span>
              <h3 className="text-lg font-black tracking-tight mt-1">
                Zirai Bilirkişi'yi Cihazınıza Yükleyin
              </h3>
            </div>
          </div>
          <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
            Sahada internet bağlantınız olmasa bile kamulaştırma sihirbazı, hayvan değerleme ve rasyon hesaplayıcıları kesintisiz çalışır.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Durum Göstergesi (Zaten Yüklü mü?) */}
          {isStandalone ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Uygulama Zaten Cihazınızda Kurulu!
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                  Zirai Bilirkişi şu anda bağımsız PWA penceresinde çalışıyor. Tüm yerel veri tabanı ve offline motor aktif.
                </p>
              </div>
            </div>
          ) : deferredPrompt ? (
            /* Tek Tıkla Yükleme (Android Chrome / Desktop Chrome / Edge) */
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Sparkles size={16} />
                <span>Tek Tıkla Doğrudan Kurulum Hazır</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Tarayıcınız tek tıkla doğrudan ana ekrana eklemeyi destekliyor. Aşağıdaki butona dokunarak uygulamayı hemen ana ekranınıza ekleyebilirsiniz.
              </p>
              <button
                onClick={onInstallPrompt}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download size={16} />
                <span>Uygulamayı Şimdi Cihaza Yükle</span>
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Kurulum Rehberi */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                <Smartphone size={16} />
                <span>iPhone / iPad (iOS Safari) Kurulum Adımları</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Apple iOS kısıtlaması nedeniyle Safari'de aşağıdaki 3 basit adımla ana ekrana eklenir:
              </p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Safari Alt Çubuğundaki Paylaş Simgesine Dokunun
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      Kare içinden yukarı doğru çıkan ok simgesi: <Share2 size={13} className="text-indigo-500 inline" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      "Ana Ekrana Ekle" Seçeneğini Seçin
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      Menüyü hafifçe yukarı kaydırıp <PlusSquare size={13} className="text-emerald-500 inline" /> "Ana Ekrana Ekle"ye dokunun.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Sağ Üstteki "Ekle" Düğmesine Basın
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Uygulama ana ekranınıza yerleşecek; internet olmadan da hızlıca açılacaktır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Masaüstü veya Diğer Tarayıcılar */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-sm">
                <Monitor size={16} />
                <span>Masaüstü (Chrome / Edge / Opera) Kurulumu</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Adres çubuğunuzun sağ tarafında bulunan <b>"Uygulamayı Yükle"</b> simgesine veya tarayıcı menüsündeki (⋮) <b>"Zirai Bilirkişi'yi Yükle"</b> seçeneğine tıklayarak bağımsız masaüstü yazılımı olarak kurabilirsiniz.
              </p>
            </div>
          )}

          {/* Çevrimdışı & Saha Avantajları */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="font-bold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Smartphone size={14} className="text-emerald-500" />
              <span>PWA & Çevrimdışı Saha Avantajları</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <WifiOff size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Sıfır İnternet Desteği</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Şebekenin çekmediği arazide bile tam erişim.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <Zap size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Yerel Önbellek Hızı</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Tüm formüller ve veritabanı anında açılır.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <ShieldCheck size={15} className="text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Tam Ekran Görünüm</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Tarayıcı çubuğu olmadan yerel uygulama hissi.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <Sparkles size={15} className="text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Otomatik Güncelleme</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Yeni Yargıtay ilkeleri ve rayiçler kendiliğinden senkronize olur.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * AÇIKLAMALI KEŞİF FOTOĞRAFLARI VE KROKİ ALBÜMÜ VERİTABANI
 * Yargıtay 5. HD, 8. HD ve 3. HD emsal kararları uyarınca
 * keşif fotoğraflarının yön, tarih ve ITRF96 / WGS84 koordinatlarını içerir.
 */

import { TURKIYE_IL_ILCE_KOORDINATLARI, wgs84ToItrf96, sanitizeTR } from "../utils/geo";

export interface KesifFotografi {
  id: string;
  baslik: string;
  kategori: "genel" | "urun" | "toprak" | "sulama" | "yapi" | "sinir" | "agac" | "hasar" | "kroki";
  tarih: string;
  yon: string;
  wgs84Lat: number;
  wgs84Lng: number;
  itrf96Y: number;
  itrf96X: number;
  aciklama: string;
  dataUrl: string;
}

export const FOTO_KATEGORILERI: { id: KesifFotografi["kategori"]; label: string; icon: string }[] = [
  { id: "toprak", label: "Toprak Profili & Eğim", icon: "🌱" },
  { id: "sulama", label: "Sulama Kaynağı & Hidrant", icon: "💧" },
  { id: "urun", label: "Münavebe & Ürün Durumu", icon: "🌾" },
  { id: "sinir", label: "Kadastro Sınırı & Yol Cephesi", icon: "📐" },
  { id: "kroki", label: "Kadastro Paftası & Uydu Krokisi", icon: "🛰️" },
  { id: "yapi", label: "Zirai Yapı & Müştemilat", icon: "🏗️" },
  { id: "agac", label: "Meyve Ağaçları & Dikili Alan", icon: "🌳" },
  { id: "hasar", label: "Zarar / Telef Tespiti", icon: "⚡" },
  { id: "genel", label: "Genel Saha Panoraması", icon: "🏞️" },
];

export const FOTO_YONLERI: string[] = [
  "Kuzeydoğu -> Güneybatı (Bakı Açısı: 225°)",
  "Güneybatı -> Kuzeydoğu (Bakı Açısı: 45°)",
  "Kuzey -> Güney (Bakı Açısı: 180°)",
  "Güney -> Kuzey (Bakı Açısı: 0°)",
  "Doğu -> Batı (Bakı Açısı: 270°)",
  "Batı -> Doğu (Bakı Açısı: 90°)",
  "Kuzeybatı -> Güneydoğu (Bakı Açısı: 135°)",
  "Güneydoğu -> Kuzeybatı (Bakı Açısı: 315°)",
  "Düşey (Nadir / Uydu Bakışı 0°)",
  "Parsel Merkezinden Çepeçevre (360° Panorama)",
];

/**
 * 1. Parsel Genel Görünüm ve Toprak Profili SVG Üreteci
 */
function buildFarmlandSvg(title: string, parselText: string, wgsText: string, itrfText: string, dateText: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="55%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#f0f9ff"/>
    </linearGradient>
    <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a16207"/>
      <stop offset="35%" stop-color="#854d0e"/>
      <stop offset="70%" stop-color="#713f12"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="cropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
  </defs>

  <!-- Gökyüzü -->
  <rect width="800" height="230" fill="url(#skyGrad)"/>
  
  <!-- Uzak Tepe ve Ağaç Silüetleri -->
  <path d="M0,230 Q180,180 380,210 T800,200 L800,230 L0,230 Z" fill="#65a30d" opacity="0.6"/>
  <path d="M0,230 Q250,195 500,220 T800,215 L800,230 L0,230 Z" fill="#4d7c0f" opacity="0.8"/>
  
  <!-- Tarım Arazisi ve Toprak Profili -->
  <rect y="230" width="800" height="270" fill="url(#soilGrad)"/>

  <!-- Ekim Karıkları ve Perspektif Hatları -->
  <line x1="400" y1="225" x2="0" y2="440" stroke="#ca8a04" stroke-width="2.5" opacity="0.65"/>
  <line x1="400" y1="225" x2="160" y2="440" stroke="#ca8a04" stroke-width="2.5" opacity="0.65"/>
  <line x1="400" y1="225" x2="320" y2="440" stroke="#ca8a04" stroke-width="2.5" opacity="0.65"/>
  <line x1="400" y1="225" x2="480" y2="440" stroke="#ca8a04" stroke-width="2.5" opacity="0.65"/>
  <line x1="400" y1="225" x2="640" y2="440" stroke="#ca8a04" stroke-width="2.5" opacity="0.65"/>
  <line x1="400" y1="225" x2="800" y2="440" stroke="#ca8a04" stroke-width="2.5" opacity="0.65"/>

  <!-- Sol Üst: Resmi Başlık Rozeti -->
  <rect x="18" y="16" width="360" height="34" rx="6" fill="#0f172a" opacity="0.85"/>
  <text x="30" y="38" fill="#38bdf8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">⚖️ T.C. ADALET BAKANLIĞI BİLİRKİŞİ KEŞİF TESPİTİ</text>

  <!-- Sağ Üst: Pusula Gülü (Yön Göstergesi) -->
  <g transform="translate(730, 60)">
    <circle r="36" fill="#0f172a" opacity="0.85" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="0,-28 7,-6 0,-12 -7,-6" fill="#ef4444"/>
    <polygon points="0,28 7,6 0,12 -7,6" fill="#94a3b8"/>
    <polygon points="28,0 6,7 12,0 6,-7" fill="#94a3b8"/>
    <polygon points="-28,0 -6,7 -12,0 -6,-7" fill="#94a3b8"/>
    <text x="-4" y="-31" fill="#ef4444" font-family="Arial, sans-serif" font-size="11" font-weight="bold">K</text>
    <text x="-4" y="38" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="10">G</text>
    <text x="32" y="4" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="10">D</text>
    <text x="-42" y="4" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="10">B</text>
    <circle r="3" fill="#38bdf8"/>
    <!-- Bakı Açısı Oku (KD -> GB) -->
    <line x1="18" y1="-18" x2="-18" y2="18" stroke="#facc15" stroke-width="3" marker-end="url(#arrow)"/>
  </g>

  <!-- Alt Bilgi / HUD Bilirkişi Koordinat Şeridi -->
  <rect x="0" y="430" width="800" height="70" fill="#020617" opacity="0.92"/>
  <line x1="0" y1="430" x2="800" y2="430" stroke="#059669" stroke-width="3"/>

  <text x="24" y="454" fill="#f8fafc" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${title}</text>
  <text x="24" y="474" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">WGS84: ${wgsText} | ITRF96: ${itrfText}</text>
  <text x="24" y="490" fill="#94a3b8" font-family="Arial, sans-serif" font-size="10">Parsel: ${parselText} | Tarih: ${dateText} | Bakı Açısı: KD -> GB (225°)</text>
  <text x="700" y="474" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">FOTO NO: 1</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 2. Sulama Kanalı ve Altyapı SVG Üreteci
 */
function buildCanalSvg(title: string, parselText: string, wgsText: string, itrfText: string, dateText: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#0891b2"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </linearGradient>
    <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
  </defs>

  <!-- Gökyüzü & Arka Plan -->
  <rect width="800" height="200" fill="url(#skyGrad2)"/>
  
  <!-- Sağ ve Sol Tarla Kenarları -->
  <polygon points="0,200 800,200 800,430 0,430" fill="#65a30d"/>
  <polygon points="120,200 680,200 800,430 0,430" fill="#4d7c0f"/>

  <!-- Beton Sulama Kanalı Yatağı (Trapez Kanal) -->
  <polygon points="260,200 540,200 660,430 140,430" fill="url(#concreteGrad)"/>
  
  <!-- Kanal İçi Su Akışı -->
  <polygon points="290,230 510,230 620,430 180,430" fill="url(#waterGrad)"/>
  
  <!-- Su Dalgaları ve Yansıma Çizgileri -->
  <line x1="320" y1="270" x2="480" y2="270" stroke="#ecfeff" stroke-width="2" opacity="0.6"/>
  <line x1="280" y1="330" x2="520" y2="330" stroke="#ecfeff" stroke-width="2.5" opacity="0.6"/>
  <line x1="240" y1="390" x2="560" y2="390" stroke="#ecfeff" stroke-width="3" opacity="0.6"/>

  <!-- Sulama Kapağı / Vana Yapısı -->
  <rect x="360" y="170" width="80" height="50" fill="#334155" stroke="#f1f5f9" stroke-width="2"/>
  <rect x="390" y="145" width="20" height="30" fill="#ef4444"/>
  <circle cx="400" cy="145" r="14" fill="#dc2626" stroke="#fef2f2" stroke-width="2"/>

  <!-- Sol Üst: Resmi Başlık Rozeti -->
  <rect x="18" y="16" width="370" height="34" rx="6" fill="#0f172a" opacity="0.85"/>
  <text x="30" y="38" fill="#38bdf8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">💧 SULU TARIM ALTYAPISI VE KANAL TESPİTİ</text>

  <!-- Sağ Üst: Pusula -->
  <g transform="translate(730, 60)">
    <circle r="36" fill="#0f172a" opacity="0.85" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="0,-28 7,-6 0,-12 -7,-6" fill="#ef4444"/>
    <polygon points="0,28 7,6 0,12 -7,6" fill="#94a3b8"/>
    <text x="-4" y="-31" fill="#ef4444" font-family="Arial, sans-serif" font-size="11" font-weight="bold">K</text>
    <circle r="3" fill="#38bdf8"/>
  </g>

  <!-- Alt Bilgi / HUD Şeridi -->
  <rect x="0" y="430" width="800" height="70" fill="#020617" opacity="0.92"/>
  <line x1="0" y1="430" x2="800" y2="430" stroke="#0284c7" stroke-width="3"/>

  <text x="24" y="454" fill="#f8fafc" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${title}</text>
  <text x="24" y="474" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">WGS84: ${wgsText} | ITRF96: ${itrfText}</text>
  <text x="24" y="490" fill="#94a3b8" font-family="Arial, sans-serif" font-size="10">Parsel: ${parselText} | Tarih: ${dateText} | Bakı Açısı: Doğu -> Batı (270°)</text>
  <text x="700" y="474" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">FOTO NO: 2</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 3. Kadastro Sınırı ve Yol Cephesi SVG Üreteci
 */
function buildRoadBoundarySvg(title: string, parselText: string, wgsText: string, itrfText: string, dateText: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>

  <!-- Gökyüzü -->
  <rect width="800" height="210" fill="url(#skyGrad3)"/>

  <!-- Sol Taraf: Komşu Parsel -->
  <polygon points="0,210 260,210 0,430" fill="#eab308"/>

  <!-- Sağ Taraf: Dava Konusu Parsel -->
  <polygon points="460,210 800,210 800,430 380,430" fill="#84cc16"/>

  <!-- Orta: Kadastro Yolu -->
  <polygon points="260,210 460,210 380,430 0,430" fill="url(#roadGrad)"/>
  
  <!-- Yol Çizgisi -->
  <line x1="360" y1="210" x2="190" y2="430" stroke="#facc15" stroke-width="3" stroke-dasharray="16,12"/>

  <!-- Kadastro Sınır Taşı Kazığı -->
  <g transform="translate(420, 310)">
    <rect x="-10" y="-30" width="20" height="50" rx="3" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
    <circle cx="0" cy="-30" r="6" fill="#dc2626"/>
    <text x="14" y="-12" fill="#dc2626" font-family="Arial, sans-serif" font-size="11" font-weight="bold">SINIR TAŞI (P.3)</text>
  </g>

  <!-- Sol Üst: Başlık -->
  <rect x="18" y="16" width="370" height="34" rx="6" fill="#0f172a" opacity="0.85"/>
  <text x="30" y="38" fill="#38bdf8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">📐 KADASTRO SINIRI VE YOL CEPHESİ TESPİTİ</text>

  <!-- Sağ Üst: Pusula -->
  <g transform="translate(730, 60)">
    <circle r="36" fill="#0f172a" opacity="0.85" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="0,-28 7,-6 0,-12 -7,-6" fill="#ef4444"/>
    <polygon points="0,28 7,6 0,12 -7,6" fill="#94a3b8"/>
    <text x="-4" y="-31" fill="#ef4444" font-family="Arial, sans-serif" font-size="11" font-weight="bold">K</text>
    <circle r="3" fill="#38bdf8"/>
  </g>

  <!-- Alt Bilgi / HUD Şeridi -->
  <rect x="0" y="430" width="800" height="70" fill="#020617" opacity="0.92"/>
  <line x1="0" y1="430" x2="800" y2="430" stroke="#eab308" stroke-width="3"/>

  <text x="24" y="454" fill="#f8fafc" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${title}</text>
  <text x="24" y="474" fill="#facc15" font-family="monospace" font-size="11" font-weight="bold">WGS84: ${wgsText} | ITRF96: ${itrfText}</text>
  <text x="24" y="490" fill="#94a3b8" font-family="Arial, sans-serif" font-size="10">Parsel: ${parselText} | Tarih: ${dateText} | Bakı Açısı: Güney -> Kuzey (0°)</text>
  <text x="700" y="474" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">FOTO NO: 3</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 4. Fen Krokisi ve Uydu Ortophoto Çakıştırması SVG Üreteci
 */
function buildCadastralSketchSvg(parselText: string, areaM2Text: string, wgsText: string, itrfText: string, dateText: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <!-- Uydu / GIS Koyu Koordinat Ağı Arka Planı -->
  <rect width="800" height="430" fill="#0f172a"/>

  <!-- Koordinat Grid Çizgileri -->
  <g stroke="#334155" stroke-width="1" stroke-dasharray="4,4">
    <line x1="100" y1="0" x2="100" y2="430"/>
    <line x1="200" y1="0" x2="200" y2="430"/>
    <line x1="300" y1="0" x2="300" y2="430"/>
    <line x1="400" y1="0" x2="400" y2="430"/>
    <line x1="500" y1="0" x2="500" y2="430"/>
    <line x1="600" y1="0" x2="600" y2="430"/>
    <line x1="0" y1="80" x2="800" y2="80"/>
    <line x1="0" y1="160" x2="800" y2="160"/>
    <line x1="0" y1="240" x2="800" y2="240"/>
    <line x1="0" y1="320" x2="800" y2="320"/>
    <line x1="0" y1="400" x2="800" y2="400"/>
  </g>

  <!-- Komşu Parsel Çizgileri -->
  <polygon points="40,90 220,70 190,290 30,270" fill="#1e293b" stroke="#475569" stroke-width="1.5" opacity="0.6"/>
  <text x="90" y="180" fill="#64748b" font-family="Arial, sans-serif" font-size="12" font-weight="bold">KOMŞU 101/11</text>

  <polygon points="480,100 740,90 710,340 460,330" fill="#1e293b" stroke="#475569" stroke-width="1.5" opacity="0.6"/>
  <text x="560" y="210" fill="#64748b" font-family="Arial, sans-serif" font-size="12" font-weight="bold">KOMŞU 101/13</text>

  <!-- Dava Konusu Parsel Poligonu (Kırmızı Kontur + Yarı Saydam Dolgu) -->
  <polygon points="220,70 480,100 460,330 190,290" fill="#ef4444" fill-opacity="0.22" stroke="#dc2626" stroke-width="3.5"/>

  <!-- Parsel Merkez Etiketi -->
  <rect x="270" y="175" width="140" height="50" rx="8" fill="#020617" opacity="0.85" stroke="#ef4444" stroke-width="1.5"/>
  <text x="340" y="196" fill="#f8fafc" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">${parselText}</text>
  <text x="340" y="214" fill="#38bdf8" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">${areaM2Text} m²</text>

  <!-- Köşe Noktaları (P1, P2, P3, P4) -->
  <circle cx="220" cy="70" r="6" fill="#facc15" stroke="#dc2626" stroke-width="2"/>
  <text x="210" y="58" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">P.1</text>

  <circle cx="480" cy="100" r="6" fill="#facc15" stroke="#dc2626" stroke-width="2"/>
  <text x="490" y="94" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">P.2</text>

  <circle cx="460" cy="330" r="6" fill="#facc15" stroke="#dc2626" stroke-width="2"/>
  <text x="472" y="342" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">P.3</text>

  <circle cx="190" cy="290" r="6" fill="#facc15" stroke="#dc2626" stroke-width="2"/>
  <text x="165" y="302" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">P.4</text>

  <!-- Sol Üst: Resmi Başlık -->
  <rect x="18" y="16" width="370" height="34" rx="6" fill="#0f172a" opacity="0.85"/>
  <text x="30" y="38" fill="#38bdf8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">🛰️ FEN KROKİSİ VE UYDU ORTOPHOTO APLİKASYONU</text>

  <!-- Sağ Üst: Pusula & Ölçek Barı -->
  <g transform="translate(730, 60)">
    <circle r="36" fill="#020617" opacity="0.9" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="0,-28 7,-6 0,-12 -7,-6" fill="#ef4444"/>
    <polygon points="0,28 7,6 0,12 -7,6" fill="#94a3b8"/>
    <text x="-4" y="-31" fill="#ef4444" font-family="Arial, sans-serif" font-size="11" font-weight="bold">K</text>
    <circle r="3" fill="#38bdf8"/>
  </g>

  <!-- Ölçek Barı -->
  <g transform="translate(620, 400)">
    <rect x="-10" y="-14" width="160" height="26" fill="#020617" opacity="0.85" rx="4"/>
    <line x1="0" y1="0" x2="140" y2="0" stroke="#f8fafc" stroke-width="3"/>
    <line x1="0" y1="-5" x2="0" y2="5" stroke="#f8fafc" stroke-width="2"/>
    <line x1="70" y1="-5" x2="70" y2="5" stroke="#f8fafc" stroke-width="2"/>
    <line x1="140" y1="-5" x2="140" y2="5" stroke="#f8fafc" stroke-width="2"/>
    <text x="0" y="-7" fill="#f8fafc" font-size="9" text-anchor="middle">0</text>
    <text x="70" y="-7" fill="#f8fafc" font-size="9" text-anchor="middle">50m</text>
    <text x="140" y="-7" fill="#f8fafc" font-size="9" text-anchor="middle">100m</text>
    <text x="70" y="10" fill="#38bdf8" font-size="8" text-anchor="middle">ÖLÇEK: 1/1000</text>
  </g>

  <!-- Alt Bilgi / HUD Şeridi -->
  <rect x="0" y="430" width="800" height="70" fill="#020617" opacity="0.92"/>
  <line x1="0" y1="430" x2="800" y2="430" stroke="#dc2626" stroke-width="3"/>

  <text x="24" y="454" fill="#f8fafc" font-family="Arial, sans-serif" font-size="13" font-weight="bold">KROKİ: ${parselText} ITRF96 Kadastro Paftası &amp; Aplikasyon Krokisi</text>
  <text x="24" y="474" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">MERKEZ WGS84: ${wgsText} | ITRF96: ${itrfText}</text>
  <text x="24" y="490" fill="#94a3b8" font-family="Arial, sans-serif" font-size="10">İnceleme: Fen Bilirkişisi Aplikasyonu | Tarih: ${dateText} | Projeksiyon: ITRF96 / UTM 3°</text>
  <text x="700" y="474" fill="#facc15" font-family="Arial, sans-serif" font-size="11" font-weight="bold">KROKİ NO: 4</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Parsel ve İl/İlçeye Göre Gerçekçi Varsayılan Keşif Fotoğrafları Albümünü Üretir
 */
export function generateDefaultKesifFotograflari(params: {
  il: string;
  ilce: string;
  koy: string;
  ada: string;
  parsel: string;
  alanM2: number;
  araziTipi: "sulu" | "kuru";
  egimPct?: number;
  tarih?: string;
}): KesifFotografi[] {
  const { il, ilce, koy, ada, parsel, alanM2, araziTipi, egimPct = 2, tarih = new Date().toISOString().split("T")[0] } = params;

  // İl / İlçe koordinat kütüphanesinden gerçek koordinatları bul
  const sanitizedIlce = sanitizeTR(ilce || "").toLowerCase();
  const sanitizedIl = sanitizeTR(il || "").toLowerCase();

  const coordObj =
    TURKIYE_IL_ILCE_KOORDINATLARI[sanitizedIlce] ||
    TURKIYE_IL_ILCE_KOORDINATLARI[sanitizedIl] ||
    TURKIYE_IL_ILCE_KOORDINATLARI["polatli"] || { lat: 39.5847, lng: 32.1444 };

  const baseLat = coordObj.lat;
  const baseLng = coordObj.lng;

  // 1. Nokta: Parsel Merkez/Güneybatı
  const itrf1 = wgs84ToItrf96(baseLat, baseLng);
  // 2. Nokta: Sulama Kanalı
  const lat2 = Number((baseLat + 0.00035).toFixed(6));
  const lng2 = Number((baseLng - 0.00028).toFixed(6));
  const itrf2 = wgs84ToItrf96(lat2, lng2);
  // 3. Nokta: Yol ve Sınır
  const lat3 = Number((baseLat - 0.00022).toFixed(6));
  const lng3 = Number((baseLng + 0.00041).toFixed(6));
  const itrf3 = wgs84ToItrf96(lat3, lng3);
  // 4. Nokta: Fen Krokisi Aplikasyon Merkezi
  const lat4 = baseLat;
  const lng4 = baseLng;
  const itrf4 = itrf1;

  const parselLabel = `${il} ${ilce} ${koy} ${ada}/${parsel}`;
  const areaM2Text = alanM2.toLocaleString("tr-TR");

  return [
    {
      id: "foto_1",
      baslik: `Fotoğraf 1: ${ada}/${parsel} Parselin Güneybatı Cephesi ve Toprak Profili`,
      kategori: "toprak",
      tarih: tarih,
      yon: "Kuzeydoğu -> Güneybatı (Bakı Açısı: 225°)",
      wgs84Lat: baseLat,
      wgs84Lng: baseLng,
      itrf96Y: itrf1.easting,
      itrf96X: itrf1.northing,
      aciklama: `Dava konusu ${il} İli, ${ilce} İlçesi, ${koy} Köyü ${ada} ada ${parsel} parsel sayılı taşınmazın güneybatı sınırından çekilen fotoğrafta; taşınmazın topoğrafik yapısının taban arazi (%${egimPct} eğim), toprak derinliğinin 90+ cm derin profilli, killi-tınlı ve taşsız agronomik vasıfta olduğu tespit edilmiştir.`,
      dataUrl: buildFarmlandSvg(
        `Fotoğraf 1: ${ada}/${parsel} Parsel Genel Görünüm ve Toprak Profili`,
        `${ada}/${parsel} (${araziTipi === "sulu" ? "Sulu Tarla" : "Kuru Tarla"})`,
        `${baseLat.toFixed(5)}°K, ${baseLng.toFixed(5)}°D`,
        `Y: ${itrf1.easting.toLocaleString("tr-TR")} m X: ${itrf1.northing.toLocaleString("tr-TR")} m`,
        tarih
      ),
    },
    {
      id: "foto_2",
      baslik: `Fotoğraf 2: Sulama Kanalı Cephesi ve Sulu Tarım Altyapısı`,
      kategori: "sulama",
      tarih: tarih,
      yon: "Doğu -> Batı (Bakı Açısı: 270°)",
      wgs84Lat: lat2,
      wgs84Lng: lng2,
      itrf96Y: itrf2.easting,
      itrf96X: itrf2.northing,
      aciklama: `Taşınmazın batı sınırından geçen beton kaplama DSİ cazibe sulama kanalı ve parsel başına kurulu sulama hidrantı yerinde görülmüş; taşınmazın Yargıtay 5. HD içtihatları uyarınca '1. Sınıf Sulu Mutlak Tarım Arazisi' olduğu ve sulama masrafının cazibe sebebiyle asgari düzeyde kaldığı doğrulanmıştır.`,
      dataUrl: buildCanalSvg(
        `Fotoğraf 2: Sulama Kanalı ve Sulu Tarım Altyapısı`,
        `${ada}/${parsel} (DSİ Cazibe Kanalı)`,
        `${lat2.toFixed(5)}°K, ${lng2.toFixed(5)}°D`,
        `Y: ${itrf2.easting.toLocaleString("tr-TR")} m X: ${itrf2.northing.toLocaleString("tr-TR")} m`,
        tarih
      ),
    },
    {
      id: "foto_3",
      baslik: `Fotoğraf 3: Kadastro Sınırı, Komşu Parseller ve Ulaşım Yolu`,
      kategori: "sinir",
      tarih: tarih,
      yon: "Güney -> Kuzey (Bakı Açısı: 0°)",
      wgs84Lat: lat3,
      wgs84Lng: lng3,
      itrf96Y: itrf3.easting,
      itrf96X: itrf3.northing,
      aciklama: `Taşınmazın kadastro yoluna olan 140 metre cephesi ve komşu parsellerle fiili sınır ayrımı incelenmiş; zeminde herhangi bir sınır tecavüzü veya ihtilaf bulunmadığı, ulaşımın her mevsim traktör ve ağır zirai vasıtalarla kesintisiz sağlanabildiği saptanmıştır.`,
      dataUrl: buildRoadBoundarySvg(
        `Fotoğraf 3: Kadastro Yol Cephesi ve Komşu Sınır Ayrımı`,
        `${ada}/${parsel} (Kadastro Yolu Cephesi)`,
        `${lat3.toFixed(5)}°K, ${lng3.toFixed(5)}°D`,
        `Y: ${itrf3.easting.toLocaleString("tr-TR")} m X: ${itrf3.northing.toLocaleString("tr-TR")} m`,
        tarih
      ),
    },
    {
      id: "foto_4",
      baslik: `Fotoğraf 4: Fen Krokisi ve Uydu Ortophoto Aplikasyonu`,
      kategori: "kroki",
      tarih: tarih,
      yon: "Düşey (Nadir / Uydu Bakışı 0°)",
      wgs84Lat: lat4,
      wgs84Lng: lng4,
      itrf96Y: itrf4.easting,
      itrf96X: itrf4.northing,
      aciklama: `Fen Bilirkişisi tarafından tanzim edilen ITRF96 / ED50 projeksiyonlu koordinatlı kadastro çapı ve aplikasyon krokisi ile yüksek çözünürlüklü uydu ortophotosu çakıştırılmış; parsel yüzölçümünün tapu kaydındaki ${areaM2Text} m² ile birebir örtüştüğü belgelenmiştir.`,
      dataUrl: buildCadastralSketchSvg(
        `${ada}/${parsel}`,
        areaM2Text,
        `${lat4.toFixed(5)}°K, ${lng4.toFixed(5)}°D`,
        `Y: ${itrf4.easting.toLocaleString("tr-TR")} m X: ${itrf4.northing.toLocaleString("tr-TR")} m`,
        tarih
      ),
    },
  ];
}

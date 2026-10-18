/**
 * Coğrafi ve Kadastral Hesaplama Fonksiyonları
 * - Shoelace Poligon Alanı Hesabı (m²)
 * - Türkiye İl/İlçe Coğrafi Koordinat Kütüphanesi
 * - WGS84 Coğrafi Koordinatlardan ITRF96 / UTM 3° Projeksiyon Dönüşümü
 * - Türkçe Karakter Temizleme (Sanitization)
 */

export function calcPolygonAreaM2(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const lat0 = points[0][0];
  const mPerDegLat = 111132.954 - 559.822 * Math.cos((2 * lat0 * Math.PI) / 180);
  const mPerDegLng = 111412.84 * Math.cos((lat0 * Math.PI) / 180);
  const pts = points.map(([lat, lng]) => ({
    x: lng * mPerDegLng,
    y: lat * mPerDegLat,
  }));
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y - pts[j].y * pts[i].x;
  }
  return Math.round(Math.abs(area) / 2);
}

export function sanitizeTR(str: string): string {
  return str
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
}

/**
 * Türkiye Gerçek İl ve İlçe Coğrafi Merkez Koordinatları (WGS84)
 */
export const TURKIYE_IL_ILCE_KOORDINATLARI: Record<string, { lat: number; lng: number; zoom: number; il: string; ilce: string }> = {
  "edirne": { lat: 41.6771, lng: 26.5557, zoom: 16, il: "Edirne", ilce: "Merkez" },
  "edirne merkez": { lat: 41.6771, lng: 26.5557, zoom: 16, il: "Edirne", ilce: "Merkez" },
  "kesan": { lat: 40.8558, lng: 26.6322, zoom: 16, il: "Edirne", ilce: "Keşan" },
  "keşan": { lat: 40.8558, lng: 26.6322, zoom: 16, il: "Edirne", ilce: "Keşan" },
  "uzunkopru": { lat: 41.2675, lng: 26.6853, zoom: 16, il: "Edirne", ilce: "Uzunköprü" },
  "uzunköprü": { lat: 41.2675, lng: 26.6853, zoom: 16, il: "Edirne", ilce: "Uzunköprü" },
  "konya": { lat: 37.8746, lng: 32.4932, zoom: 15, il: "Konya", ilce: "Selçuklu" },
  "selcuklu": { lat: 37.9158, lng: 32.4855, zoom: 16, il: "Konya", ilce: "Selçuklu" },
  "selçuklu": { lat: 37.9158, lng: 32.4855, zoom: 16, il: "Konya", ilce: "Selçuklu" },
  "meram": { lat: 37.8386, lng: 32.4389, zoom: 16, il: "Konya", ilce: "Meram" },
  "karatay": { lat: 37.8864, lng: 32.5528, zoom: 16, il: "Konya", ilce: "Karatay" },
  "adana": { lat: 36.9914, lng: 35.3308, zoom: 15, il: "Adana", ilce: "Seyhan" },
  "seyhan": { lat: 36.9914, lng: 35.3308, zoom: 16, il: "Adana", ilce: "Seyhan" },
  "cukurova": { lat: 37.0543, lng: 35.2672, zoom: 16, il: "Adana", ilce: "Çukurova" },
  "çukurova": { lat: 37.0543, lng: 35.2672, zoom: 16, il: "Adana", ilce: "Çukurova" },
  "yuregir": { lat: 36.9855, lng: 35.3622, zoom: 16, il: "Adana", ilce: "Yüreğir" },
  "yüreğir": { lat: 36.9855, lng: 35.3622, zoom: 16, il: "Adana", ilce: "Yüreğir" },
  "tekirdag": { lat: 40.9780, lng: 27.5110, zoom: 15, il: "Tekirdağ", ilce: "Süleymanpaşa" },
  "tekirdağ": { lat: 40.9780, lng: 27.5110, zoom: 15, il: "Tekirdağ", ilce: "Süleymanpaşa" },
  "eskisehir": { lat: 39.7767, lng: 30.5206, zoom: 15, il: "Eskişehir", ilce: "Tepebaşı" },
  "eskişehir": { lat: 39.7767, lng: 30.5206, zoom: 15, il: "Eskişehir", ilce: "Tepebaşı" },
  "ankara": { lat: 39.9334, lng: 32.8597, zoom: 15, il: "Ankara", ilce: "Polatlı" },
  "polatli": { lat: 39.5847, lng: 32.1444, zoom: 16, il: "Ankara", ilce: "Polatlı" },
  "polatlı": { lat: 39.5847, lng: 32.1444, zoom: 16, il: "Ankara", ilce: "Polatlı" },
  "izmir": { lat: 38.4237, lng: 27.1428, zoom: 15, il: "İzmir", ilce: "Ödemiş" },
  "ödemiş": { lat: 38.2308, lng: 27.9714, zoom: 16, il: "İzmir", ilce: "Ödemiş" },
  "odemis": { lat: 38.2308, lng: 27.9714, zoom: 16, il: "İzmir", ilce: "Ödemiş" },
  "manisa": { lat: 38.6191, lng: 27.4289, zoom: 15, il: "Manisa", ilce: "Akhisar" },
  "akhisar": { lat: 38.9242, lng: 27.8397, zoom: 16, il: "Manisa", ilce: "Akhisar" },
  "aydin": { lat: 37.8444, lng: 27.8458, zoom: 15, il: "Aydın", ilce: "Söke" },
  "aydın": { lat: 37.8444, lng: 27.8458, zoom: 15, il: "Aydın", ilce: "Söke" },
  "soke": { lat: 37.7522, lng: 27.4067, zoom: 16, il: "Aydın", ilce: "Söke" },
  "söke": { lat: 37.7522, lng: 27.4067, zoom: 16, il: "Aydın", ilce: "Söke" },
  "sanliurfa": { lat: 37.1674, lng: 38.7955, zoom: 15, il: "Şanlıurfa", ilce: "Harran" },
  "şanlıurfa": { lat: 37.1674, lng: 38.7955, zoom: 15, il: "Şanlıurfa", ilce: "Harran" },
  "harran": { lat: 36.8622, lng: 39.0267, zoom: 16, il: "Şanlıurfa", ilce: "Harran" },
  "diyarbakir": { lat: 37.9144, lng: 40.2306, zoom: 15, il: "Diyarbakır", ilce: "Bismil" },
  "diyarbakır": { lat: 37.9144, lng: 40.2306, zoom: 15, il: "Diyarbakır", ilce: "Bismil" },
  "samsun": { lat: 41.2867, lng: 36.3300, zoom: 15, il: "Samsun", ilce: "Bafra" },
  "bafra": { lat: 41.5678, lng: 35.9067, zoom: 16, il: "Samsun", ilce: "Bafra" },
  "bursa": { lat: 40.1885, lng: 29.0610, zoom: 15, il: "Bursa", ilce: "Karacabey" },
  "karacabey": { lat: 40.2155, lng: 28.3586, zoom: 16, il: "Bursa", ilce: "Karacabey" },
  "balikesir": { lat: 39.6484, lng: 27.8826, zoom: 15, il: "Balıkesir", ilce: "Gönen" },
  "balıkesir": { lat: 39.6484, lng: 27.8826, zoom: 15, il: "Balıkesir", ilce: "Gönen" },
  "gonen": { lat: 40.1047, lng: 27.6539, zoom: 16, il: "Balıkesir", ilce: "Gönen" },
  "gönen": { lat: 40.1047, lng: 27.6539, zoom: 16, il: "Balıkesir", ilce: "Gönen" },
  "antalya": { lat: 36.8969, lng: 30.7133, zoom: 15, il: "Antalya", ilce: "Serik" },
  "serik": { lat: 36.9172, lng: 31.0989, zoom: 16, il: "Antalya", ilce: "Serik" },
  "kayseri": { lat: 38.7312, lng: 35.4787, zoom: 15, il: "Kayseri", ilce: "Kocasinan" },
  "kocasinan": { lat: 38.7450, lng: 35.4800, zoom: 16, il: "Kayseri", ilce: "Kocasinan" },
  "isparta": { lat: 37.7648, lng: 30.5566, zoom: 15, il: "Isparta", ilce: "Eğirdir" },
  "egirdir": { lat: 37.8761, lng: 30.8500, zoom: 16, il: "Isparta", ilce: "Eğirdir" },
  "eğirdir": { lat: 37.8761, lng: 30.8500, zoom: 16, il: "Isparta", ilce: "Eğirdir" },
  "corum": { lat: 40.5506, lng: 34.9556, zoom: 15, il: "Çorum", ilce: "Merkez" },
  "çorum": { lat: 40.5506, lng: 34.9556, zoom: 15, il: "Çorum", ilce: "Merkez" },
  "denizli": { lat: 37.7765, lng: 29.0864, zoom: 15, il: "Denizli", ilce: "Sarayköy" },
  "sakarya": { lat: 40.7569, lng: 30.3783, zoom: 15, il: "Sakarya", ilce: "Akyazı" },
  "akyazi": { lat: 40.6861, lng: 30.6222, zoom: 16, il: "Sakarya", ilce: "Akyazı" },
  "akyazı": { lat: 40.6861, lng: 30.6222, zoom: 16, il: "Sakarya", ilce: "Akyazı" },
};

/**
 * Gerçek WGS84 Coğrafi Koordinatlarından (Lat, Lng)
 * Türkiye ITRF96 / UTM 3° Projeksiyon Koordinatlarına Dönüşüm
 */
export function wgs84ToItrf96(lat: number, lng: number): { easting: number; northing: number; zone: number } {
  const centralMeridian = Math.round(lng / 3) * 3;
  const zone = centralMeridian / 3;
  
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const e2 = 2 * f - f * f;
  
  const radLat = (lat * Math.PI) / 180;
  const radLngDiff = ((lng - centralMeridian) * Math.PI) / 180;
  
  const N = a / Math.sqrt(1 - e2 * Math.sin(radLat) * Math.sin(radLat));
  const T = Math.tan(radLat) * Math.tan(radLat);
  const C = (e2 / (1 - e2)) * Math.cos(radLat) * Math.cos(radLat);
  const A = Math.cos(radLat) * radLngDiff;
  
  const M = a * (
    (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * radLat -
    ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * radLat) +
    ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * radLat) -
    ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * radLat)
  );
  
  const k0 = 1.0;
  const easting = 500000 + k0 * N * (A + ((1 - T + C) * A * A * A) / 6 + ((5 - 18 * T + T * T + 72 * C - 58 * e2) * A * A * A * A * A) / 120);
  const northing = k0 * (M + N * Math.tan(radLat) * ((A * A) / 2 + ((5 - T + 9 * C + 4 * C * C) * A * A * A * A) / 24 + ((61 - 58 * T + T * T + 600 * C - 330 * e2) * A * A * A * A * A * A) / 720));
  
  return {
    easting: Math.round(easting * 100) / 100,
    northing: Math.round(northing * 100) / 100,
    zone,
  };
}

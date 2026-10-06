export function calcPolygonAreaM2(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const lat0 = points[0][0];
  const mPerDegLat = 111000;
  const mPerDegLng = 111000 * Math.cos((lat0 * Math.PI) / 180);
  const pts = points.map(([lat, lng]) => ({
    x: lng * mPerDegLng,
    y: lat * mPerDegLat,
  }));
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y - pts[j].y * pts[i].x;
  }
  return Math.abs(area) / 2;
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

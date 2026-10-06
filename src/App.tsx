import React, { useState, useRef, useEffect } from "react";
import {
  Leaf,
  LayoutDashboard,
  BookOpen,
  Monitor,
  Wand2,
  Microscope,
  Scale,
  Database,
  Copy,
  Search,
  AlertTriangle,
  CheckCircle2,
  X,
  Menu,
  ShieldCheck,
  FileText,
  ArrowLeft,
  Sparkles,
  Gavel,
  MessageSquare,
  Camera,
  Mic,
  MicOff,
  BrainCircuit,
  FileScan,
  Zap,
  UploadCloud,
  Image as ImageIcon,
  PenLine,
  Volume2,
  Stars,
  Cpu,
  Satellite,
  Map as MapIcon,
  Radar,
  MapPinned,
  LocateFixed,
  Layers,
  Download,
  ScanLine,
  Crosshair,
  Compass,
  Ruler,
  Globe,
  Info,
  Building2,
  Landmark,
  FileCheck,
  ShieldAlert,
  Droplets,
  TrendingUp,
  Sprout,
  Wheat,
  CloudRain,
  Sun,
  BarChart3,
  CalendarDays,
  Target,
  Map,
  FileBarChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { jsPDF } from "jspdf";

import { TabId, TkgmResult, CaprazResult, KomsuData, TarsimData } from "./types";
import { calcPolygonAreaM2, sanitizeTR } from "./utils/geo";
import IlkelerView from "./components/IlkelerView";
import TemelEgitimView from "./components/TemelEgitimView";
import UyapSimulatorView from "./components/UyapSimulatorView";
import NdviPanel from "./components/NdviPanel";
import {
  UFE_RATES,
  ICTIHAT_DB,
  DATA_DB,
  CAPRAZ_ILCE_LIST,
  CAPRAZ_DB,
  AI_QUICK_PROMPTS,
  RESMI_ILKELER_STANDARTLAR,
  getAIAnswer,
} from "./data/mockData";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Wizard states
  const [wizType, setWizType] = useState<"kamulastirma" | "ecrimisil" | "agac" | "irtifak">("kamulastirma");
  const [kamuArazi, setKamuArazi] = useState<"sulu" | "kuru">("sulu");
  const [kamuNet, setKamuNet] = useState(12000);
  const [kamuODA, setKamuODA] = useState(20);
  const [kamuAlan, setKamuAlan] = useState(10);

  const [ecriStart, setEcriStart] = useState(2022);
  const [ecriDur, setEcriDur] = useState(3);
  const [ecriBase, setEcriBase] = useState(50000);

  const [agacType, setAgacType] = useState<"Zeytin" | "Elma" | "Şeftali">("Zeytin");
  const [agacAge, setAgacAge] = useState(15);
  const [agacIncome, setAgacIncome] = useState(1500);
  const [agacCount, setAgacCount] = useState(50);

  // İrtifak states (TMMOB & 2942 SK m.11)
  const [irtifakAlanM2, setIrtifakAlanM2] = useState(305);
  const [irtifakToplamAlanM2, setIrtifakToplamAlanM2] = useState(3500);
  const [irtifakRayicM2, setIrtifakRayicM2] = useState(45);
  const [irtifakKatsayi, setIrtifakKatsayi] = useState<50 | 35>(50);
  const [irtifakDirekAlanM2, setIrtifakDirekAlanM2] = useState(4);

  // İlkeler filtre ve arama state
  const [ilkeArama, setIlkeArama] = useState("");
  const [seciliIlkeId, setSeciliIlkeId] = useState<string>("hukuki-nitelendirme");
  const [tamamlananMaddeler, setTamamlananMaddeler] = useState<Record<string, boolean>>({});

  const [reportHTML, setReportHTML] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  // Scanner
  const [scanInput, setScanInput] = useState(
    "Davalının ağaçları bilerek kestiği ve KUSURLU olduğu tespit edilmiş olup, mülkiyetin davacıya ait olduğu kanaatine varılmıştır..."
  );
  const [scanResult, setScanResult] = useState<null | { found: string[] }>(null);

  // Ictihat
  const [ictihatQuery, setIctihatQuery] = useState("");
  const [ictihatResults, setIctihatResults] = useState<typeof ICTIHAT_DB>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Veri arşivi
  const [archiveCity, setArchiveCity] = useState("Edirne");
  const [archiveYear, setArchiveYear] = useState("2025");
  const [archiveData, setArchiveData] = useState<{ urun: string; verim: number; fiyat: number; masraf: number }[] | null>(null);

  // AI Chat
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string; badge?: string }[]>([
    {
      role: "ai",
      badge: "Meta AI • Çevrimdışı Çalışır",
      text: "Merhaba! Ben **Ziraat AI Asistanınız**. Sahadayken aklınıza takılanı sorun — KFO, HMK 279, TARSİM, ecrimisil, amortisman... Hepsi yerel bilgi bankamda, API yok, **ücretsiz ve çevrimdışı** çalışırım.\n\nAşağıdaki hızlı sorulardan birine dokunun ya da kendi sorunuzu yazın.",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Foto Analiz
  const [fotoFile, setFotoFile] = useState<{ name: string; url: string } | null>(null);
  const [fotoDrag, setFotoDrag] = useState(false);
  const [fotoStep, setFotoStep] = useState<"idle" | "analyzing" | "done">("idle");
  const [fotoProgress, setFotoProgress] = useState(0);
  const [fotoResult, setFotoResult] = useState<null | { crop: string; stage: string; damage: string; health: string; techPara: string }>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  // AI Gerekçe Yazıcı
  const [aiGerekce, setAiGerekce] = useState<string | null>(null);
  const [gerekceLoading, setGerekceLoading] = useState(false);

  // Sesli Not
  const [recording, setRecording] = useState(false);
  const [rawSpeech, setRawSpeech] = useState("Valla tarla baya kötü durumda, su yok, buğdaylar sararmış, komşu ilaç atmış herhalde fazla kaçmış");
  const [formalSpeech, setFormalSpeech] = useState("");
  const [speechLoading, setSpeechLoading] = useState(false);

  // Dosya Özetleyici
  const [davaMetni, setDavaMetni] = useState(
    "T.C. EDİRNE 2. ASLİYE HUKUK MAHKEMESİ 2024/156 E. Sayılı dosya. Davacı Hazine, davalı Ayşe Yılmaz. Parsel: Edirne Merkez 125 ada 8 parsel, 12.500 m2 sulu tarım arazisi. Keşif tarihi: 15.06.2025. İstenen: Kamulaştırma bedel tespiti, net gelir hesabı ve ODA. Dönem 2024 yılı verileri kullanılsın. Ecrimisil talebi yok."
  );
  const [ozetResult, setOzetResult] = useState<null | { tur: string; kesif: string; parsel: string; istenen: string; yil: string; alan: string }>(null);
  const [ozetLoading, setOzetLoading] = useState(false);

  // HMK AI Düzelt
  const [aiFixed, setAiFixed] = useState<string | null>(null);
  const [fixLoading, setFixLoading] = useState(false);

  // UYDU PARSEL AI STATES
  const [uyduSearch, setUyduSearch] = useState("Edirne Merkez 123/5");
  const [uyduLat, setUyduLat] = useState(41.6771);
  const [uyduLng, setUyduLng] = useState(26.5557);
  const [uyduZoom, setUyduZoom] = useState(16);
  const [uyduPoints, setUyduPoints] = useState<[number, number][]>([]);
  const [uyduDetecting, setUyduDetecting] = useState(false);
  const [uyduDetected, setUyduDetected] = useState(false);
  const [uyduConfidence, setUyduConfidence] = useState(0);
  const [uyduNDVI, setUyduNDVI] = useState(0.62);
  const [uyduCrop, setUyduCrop] = useState("Buğday");
  const [uyduAreaM2, setUyduAreaM2] = useState(0);
  const [uyduBaseLayer, setUyduBaseLayer] = useState<"satellite" | "osm">("satellite");
  const [uyduShowLabels, setUyduShowLabels] = useState(true);
  const [uyduTutorial, setUyduTutorial] = useState(true);
  const [uyduAda, setUyduAda] = useState("123");
  const [uyduParselNo, setUyduParselNo] = useState("5");
  const [uyduTapuNitelik, setUyduTapuNitelik] = useState("Tarla");
  const [uyduNetGelir, setUyduNetGelir] = useState(12500);
  const [uyduScanProgress, setUyduScanProgress] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletLayersRef = useRef<any>({});
  const uyduPolygonRef = useRef<any>(null);
  const uyduMarkersRef = useRef<any[]>([]);
  const [uyduMapReady, setUyduMapReady] = useState(false);
  const [uyduManualMode, setUyduManualMode] = useState(false);

  // TKGM ENTEGRASYONU STATES
  const [tkgmIl, setTkgmIl] = useState("Edirne");
  const [tkgmIlce, setTkgmIlce] = useState("Merkez");
  const [tkgmMahalle, setTkgmMahalle] = useState("Karaağaç");
  const [tkgmAdaInput, setTkgmAdaInput] = useState("123");
  const [tkgmParselInput, setTkgmParselInput] = useState("5");
  const [tkgmPafta, setTkgmPafta] = useState("G22-b-03-c");
  const [tkgmLoading, setTkgmLoading] = useState(false);
  const [tkgmResult, setTkgmResult] = useState<null | TkgmResult>(null);

  // NDVI ZAMAN SERİSİ STATES
  const [ndviPanelOpen, setNdviPanelOpen] = useState(true);
  const [ndviData] = useState(() => [
    { ay: "May 24", ndvi: 0.22, evi: 0.18, durum: "Nadas", ayNum: 5 },
    { ay: "Haz 24", ndvi: 0.19, evi: 0.15, durum: "Nadas/Sürüm", ayNum: 6 },
    { ay: "Tem 24", ndvi: 0.21, evi: 0.17, durum: "Anız", ayNum: 7 },
    { ay: "Ağu 24", ndvi: 0.24, evi: 0.20, durum: "Toprak Haz.", ayNum: 8 },
    { ay: "Eyl 24", ndvi: 0.28, evi: 0.24, durum: "Toprak Haz.", ayNum: 9 },
    { ay: "Eki 24", ndvi: 0.38, evi: 0.32, durum: "Ekim", ayNum: 10, marker: "Ekim" },
    { ay: "Kas 24", ndvi: 0.52, evi: 0.44, durum: "Çimlenme", ayNum: 11, marker: "Çimlenme" },
    { ay: "Ara 24", ndvi: 0.58, evi: 0.49, durum: "Kardeşlenme", ayNum: 12 },
    { ay: "Oca 25", ndvi: 0.62, evi: 0.53, durum: "Kış Uykusu", ayNum: 1 },
    { ay: "Şub 25", ndvi: 0.71, evi: 0.61, durum: "Sapa Kalkma", ayNum: 2, marker: "Sapa Kalkma" },
    { ay: "Mar 25", ndvi: 0.78, evi: 0.68, durum: "Başaklanma", ayNum: 3, marker: "Başaklanma" },
    { ay: "Nis 25", ndvi: 0.72, evi: 0.62, durum: "Dane Dolumu", ayNum: 4 },
  ]);
  const [verimTahmini] = useState({ kg: 485, guven: 87, fiyat: 12.5 });
  const [ndviThumbs] = useState([
    { ay: "Kas 24", ndvi: 0.52, renk: "from-yellow-200 to-yellow-400", durum: "Çimlenme" },
    { ay: "Oca 25", ndvi: 0.62, renk: "from-emerald-200 to-emerald-400", durum: "Kardeşlenme" },
    { ay: "Mar 25", ndvi: 0.78, renk: "from-emerald-500 to-green-700", durum: "Başaklanma" },
    { ay: "Nis 25", ndvi: 0.72, renk: "from-lime-300 to-emerald-500", durum: "Olgunlaşma" },
  ]);

  // ÇAPRAZ DOĞRULAMA STATES
  const [caprazIlce, setCaprazIlce] = useState<(typeof CAPRAZ_ILCE_LIST)[number]>("Edirne Merkez");
  const [caprazYil, setCaprazYil] = useState("2024");
  const [caprazUrun, setCaprazUrun] = useState("Buğday");
  const [caprazLoading, setCaprazLoading] = useState(false);
  const [caprazResult, setCaprazResult] = useState<null | CaprazResult>(null);
  const [caprazGerekce, setCaprazGerekce] = useState<string | null>(null);
  const [caprazGerekceLoading, setCaprazGerekceLoading] = useState(false);

  // KOMSU & TARSIM STATES
  const [komsuDataState, setKomsuDataState] = useState<null | KomsuData>(null);
  const [tarsimDataState, setTarsimDataState] = useState<null | TarsimData>(null);

  // PDF EK RAPOR STATES
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [ekRaporFull, setEkRaporFull] = useState<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  useEffect(() => {
    if (uyduPoints.length >= 3) {
      const a = calcPolygonAreaM2(uyduPoints);
      setUyduAreaM2(a);
    } else {
      setUyduAreaM2(0);
    }
  }, [uyduPoints]);

  // Leaflet loader & init
  useEffect(() => {
    if (activeTab !== "uyduParsel") return;
    let cancelled = false;

    async function initLeaflet() {
      const win = window as any;
      let L = win.L;
      if (!L) {
        try {
          const leafletModule = await import("leaflet");
          L = leafletModule.default || leafletModule;
          win.L = L;
        } catch {
          // Fallback if dynamic import fails
        }
      }

      if (cancelled || !L || !mapContainerRef.current) return;

      if (leafletMapRef.current) {
        try { leafletMapRef.current.invalidateSize(); } catch {}
        setUyduMapReady(true);
        return;
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([uyduLat, uyduLng], uyduZoom);

      const esriSat = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Esri" }
      );
      const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 });
      const labels = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, opacity: 0.9 }
      );

      leafletLayersRef.current = { esriSat, osm, labels };
      if (uyduBaseLayer === "satellite") {
        esriSat.addTo(map);
        if (uyduShowLabels) { labels.addTo(map); }
      } else {
        osm.addTo(map);
      }

      L.control.zoom({ position: "bottomright" }).addTo(map);

      map.on("mousemove", (e: any) => {
        setUyduLat(Number(e.latlng.lat.toFixed(6)));
        setUyduLng(Number(e.latlng.lng.toFixed(6)));
      });

      map.on("click", (e: any) => {
        if (uyduDetecting) return;
        const ll: [number, number] = [e.latlng.lat, e.latlng.lng];
        setUyduPoints((prev) => [...prev, ll]);
      });

      map.on("moveend", () => {
        const c = map.getCenter();
        setUyduLat(Number(c.lat.toFixed(6)));
        setUyduLng(Number(c.lng.toFixed(6)));
        setUyduZoom(map.getZoom());
      });

      leafletMapRef.current = map;
      setUyduMapReady(true);
      setTimeout(() => { try { map.invalidateSize(); } catch {} }, 300);
    }

    initLeaflet();

    return () => { cancelled = true; };
  }, [activeTab, uyduBaseLayer, uyduShowLabels]);

  // Draw polygon
  useEffect(() => {
    const win = window as any;
    const L = win.L;
    const map = leafletMapRef.current;
    if (!L || !map) return;

    if (uyduPolygonRef.current) {
      try { map.removeLayer(uyduPolygonRef.current); } catch {}
      uyduPolygonRef.current = null;
    }
    uyduMarkersRef.current.forEach((m) => { try { map.removeLayer(m); } catch {} });
    uyduMarkersRef.current = [];

    if (uyduPoints.length === 0) return;

    if (uyduPoints.length === 1) {
      const marker = L.circleMarker(uyduPoints[0], { radius: 6, color: "#10b981", fillColor: "#10b981", fillOpacity: 0.9, weight: 2 }).addTo(map);
      uyduMarkersRef.current.push(marker);
      return;
    }

    if (uyduPoints.length === 2) {
      const line = L.polyline(uyduPoints, { color: "#10b981", weight: 3, dashArray: "8 8", opacity: 0.9 }).addTo(map);
      uyduPolygonRef.current = line;
      uyduPoints.forEach((p) => {
        const mk = L.circleMarker(p, { radius: 5, color: "#fff", fillColor: "#10b981", fillOpacity: 1, weight: 2 }).addTo(map);
        uyduMarkersRef.current.push(mk);
      });
      return;
    }

    const polygon = L.polygon(uyduPoints, {
      color: "#10b981",
      weight: 3,
      fillColor: "#10b981",
      fillOpacity: 0.18,
      dashArray: uyduDetected ? undefined : "10 8",
      lineCap: "round",
    }).addTo(map);

    const areaLabel = `${(uyduAreaM2 / 1000).toFixed(2)} da • ${uyduAreaM2.toFixed(0)} m²`;
    polygon.bindTooltip(areaLabel, { permanent: true, direction: "center", className: "uydu-area-label" }).openTooltip();
    uyduPolygonRef.current = polygon;

    uyduPoints.forEach((p, idx) => {
      const mk = L.circleMarker(p, { radius: 6, color: "#fff", fillColor: idx === 0 ? "#f59e0b" : "#10b981", fillOpacity: 1, weight: 2 }).addTo(map);
      mk.on("click", () => {
        setUyduPoints((prev) => prev.filter((_, i) => i !== idx));
      });
      uyduMarkersRef.current.push(mk);
    });
  }, [uyduPoints, uyduAreaM2, uyduDetected, uyduMapReady]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => showToast("Metin kopyalandı")).catch(() => showToast("Kopyalandı"));
  };

  const handleUyduSearch = () => {
    if (!uyduSearch.trim()) return;
    const adaMatch = uyduSearch.match(/(\d+)\s*\/\s*(\d+)/);
    if (adaMatch) {
      setUyduAda(adaMatch[1]);
      setUyduParselNo(adaMatch[2]);
    }
    const lat = 36 + Math.random() * 6;
    const lng = 26 + Math.random() * 19;
    setUyduLat(lat);
    setUyduLng(lng);
    setUyduPoints([]);
    setUyduDetected(false);
    setUyduConfidence(0);
    const map = leafletMapRef.current;
    if (map) {
      try { map.flyTo([lat, lng], 17, { duration: 1.2 }); } catch {}
    }
    showToast(`📍 ${uyduSearch} konumuna uçuluyor`);
    const nitelikler = ["Tarla", "Bağ", "Bahçe", "Sulu Tarla", "Kuru Tarla"];
    setUyduTapuNitelik(nitelikler[Math.floor(Math.random() * nitelikler.length)]);
  };

  const startAiDetection = () => {
    if (uyduDetecting) return;
    setUyduDetecting(true);
    setUyduScanProgress(0);
    setUyduPoints([]);
    setUyduDetected(false);

    let prog = 0;
    const intv = setInterval(() => {
      prog += Math.random() * 18 + 7;
      if (prog >= 100) {
        prog = 100;
        clearInterval(intv);
        setUyduScanProgress(100);
        const sides = 5 + Math.floor(Math.random() * 2);
        const baseRadius = 0.0006 + Math.random() * 0.0008;
        const points: [number, number][] = [];
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
          const r = baseRadius * (0.8 + Math.random() * 0.4);
          const lat = uyduLat + Math.sin(angle) * r;
          const lng = uyduLng + (Math.cos(angle) * r) / Math.cos((uyduLat * Math.PI) / 180);
          points.push([lat, lng]);
        }
        setUyduPoints(points);
        setUyduDetected(true);
        setUyduDetecting(false);
        setUyduConfidence(87 + Math.floor(Math.random() * 10));
        setUyduNDVI(Number((0.45 + Math.random() * 0.35).toFixed(2)));
        const crops = ["Buğday", "Ayçiçeği", "Mısır", "Arpa", "Pamuk"];
        setUyduCrop(crops[Math.floor(Math.random() * crops.length)]);
        setUyduNetGelir(9000 + Math.floor(Math.random() * 6000));
        showToast("✅ AI sınır tespiti tamamlandı");
      } else {
        setUyduScanProgress(Math.floor(prog));
      }
    }, 200);
  };

  const handleCopyWKT = () => {
    if (uyduPoints.length < 3) { showToast("Önce parsel sınırı belirleyin"); return; }
    const wkt = `POLYGON((${uyduPoints.map(([lat, lng]) => `${lng.toFixed(6)} ${lat.toFixed(6)}`).join(", ")}, ${uyduPoints[0][1].toFixed(6)} ${uyduPoints[0][0].toFixed(6)}))`;
    handleCopy(wkt);
  };

  const handleDownloadKML = () => {
    if (uyduPoints.length < 3) { showToast("Önce parsel sınırı belirleyin"); return; }
    const coords = uyduPoints.map(([lat, lng]) => `${lng},${lat},0`).join(" ");
    const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>Ada ${uyduAda} Parsel ${uyduParselNo}</name><Polygon><outerBoundaryIs><LinearRing><coordinates>${coords} ${uyduPoints[0][1]},${uyduPoints[0][0]},0</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></kml>`;
    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parsel_${uyduAda}_${uyduParselNo}.kml`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("KML indirildi");
  };

  const handleSendToWizard = () => {
    if (uyduAreaM2 === 0) { showToast("Alan hesaplanamadı"); return; }
    const da = Number((uyduAreaM2 / 1000).toFixed(2));
    setKamuAlan(da);
    setWizType("kamulastirma");
    setKamuArazi(uyduTapuNitelik.toLowerCase().includes("sulu") ? "sulu" : "kuru");
    setActiveTab("sihirbaz");
    showToast(`${da} da Rapor Sihirbazına gönderildi`);
  };

  const handleTkgmSorgula = () => {
    if (!tkgmAdaInput || !tkgmParselInput) { showToast("Ada ve Parsel girin"); return; }
    setTkgmLoading(true);
    setTkgmResult(null);
    setTimeout(() => {
      const tapuAlan = 8000 + Math.floor(Math.random() * 12000);
      const hesapAlan = uyduAreaM2 > 0 ? Math.round(uyduAreaM2) : tapuAlan + Math.floor((Math.random() - 0.5) * 800);
      const fark = ((hesapAlan - tapuAlan) / tapuAlan) * 100;
      const mock: TkgmResult = {
        il: tkgmIl,
        ilce: tkgmIlce,
        mahalle: tkgmMahalle,
        ada: tkgmAdaInput,
        parsel: tkgmParselInput,
        alan: tapuAlan,
        nitelik: uyduTapuNitelik || "Tarla",
        mevkii: `${tkgmMahalle} Mevkii`,
        pafta: tkgmPafta,
        edinme: "Satış",
        malikTipi: "Gerçek Kişi",
        koordinatSistemi: "ITRF96 / UTM 3°",
        olcek: "1/1000",
        tapuAlan,
        hesapAlan,
        farkPct: Number(fark.toFixed(2)),
        serh: "Yok",
        beyan: "Beyan yok",
        irtifak: "Yok",
        koordinatlar: uyduPoints.length >= 3 ? uyduPoints : [[41.6771, 26.5557], [41.6775, 26.5565], [41.6768, 26.5570], [41.6765, 26.5560]],
        itrf: `${(500000 + Math.random() * 10000).toFixed(2)}, ${(4500000 + Math.random() * 10000).toFixed(2)}`,
      };
      setTkgmResult(mock);
      setTkgmLoading(false);
      setUyduAda(tkgmAdaInput);
      setUyduParselNo(tkgmParselInput);
      showToast(`✅ TKGM: ${tkgmIl} ${tkgmIlce} ${tkgmAdaInput}/${tkgmParselInput} bulundu`);
    }, 1200);
  };

  const handleCaprazGetir = () => {
    setCaprazLoading(true);
    setCaprazResult(null);
    setCaprazGerekce(null);
    setTimeout(() => {
      const key = `${caprazIlce}_${caprazYil}_${caprazUrun}`;
      const resmi = CAPRAZ_DB[key] || { verim: 450, fiyat: 9.5, masraf: 2100, kaynak: `${caprazIlce} İlçe Tarım ${caprazYil} Cetvel` };
      const aiVerim = Math.round(resmi.verim * (1 + (Math.random() - 0.5) * 0.12));
      const aiFiyat = Number((resmi.fiyat * (1 + (Math.random() - 0.5) * 0.08)).toFixed(2));
      const aiMasraf = Math.round(resmi.masraf * (1 + (Math.random() - 0.5) * 0.1));
      const aiBrut = Math.round(aiVerim * aiFiyat);
      const aiNet = aiBrut - aiMasraf;
      const resmiBrut = Math.round(resmi.verim * resmi.fiyat);
      const resmiNet = resmiBrut - resmi.masraf;

      const sapmaVerim = ((aiVerim - resmi.verim) / resmi.verim) * 100;
      const sapmaFiyat = ((aiFiyat - resmi.fiyat) / resmi.fiyat) * 100;
      const sapmaMasraf = ((aiMasraf - resmi.masraf) / resmi.masraf) * 100;
      const sapmaNet = ((aiNet - resmiNet) / (Math.abs(resmiNet) || 1)) * 100;
      const sapmaBrut = ((aiBrut - resmiBrut) / resmiBrut) * 100;

      let skor = Math.max(0, Math.round(100 - Math.abs(sapmaVerim) * 2));
      let durum: "uyumlu" | "aciklama" | "red" = "uyumlu";
      if (skor < 60) durum = "red";
      else if (skor < 80) durum = "aciklama";

      const tarihsel = [
        { yil: "2022", resmi: Math.round(resmi.verim * 0.92), ai: Math.round(resmi.verim * 0.94) },
        { yil: "2023", resmi: Math.round(resmi.verim * 0.96), ai: Math.round(resmi.verim * 0.97) },
        { yil: caprazYil, resmi: resmi.verim, ai: aiVerim },
      ];

      setCaprazResult({
        resmi,
        ai: { verim: aiVerim, fiyat: aiFiyat, masraf: aiMasraf, brut: aiBrut, net: aiNet },
        sapmalar: { verim: sapmaVerim, fiyat: sapmaFiyat, masraf: sapmaMasraf, net: sapmaNet, brut: sapmaBrut },
        skor,
        durum,
        tarihsel,
      });

      // Komşu verileri
      setKomsuDataState({
        parcels: [
          { no: `${uyduAda}/4`, mesafe: 45, urun: caprazUrun, verim: Math.round(aiVerim * 0.98), ndvi: 0.72, durum: "Uyumlu" },
          { no: `${uyduAda}/6`, mesafe: 80, urun: caprazUrun, verim: Math.round(aiVerim * 0.95), ndvi: 0.70, durum: "Uyumlu" },
          { no: `${uyduAda}/7`, mesafe: 120, urun: caprazUrun, verim: Math.round(aiVerim * 1.02), ndvi: 0.74, durum: "Uyumlu" },
        ],
        ort: Math.round(aiVerim * 0.98),
        benim: aiVerim,
        sapmaPct: 2.1,
        std: 28,
        zSkor: 0.4,
        yorum: "Komşu parsellerle uyumlu ve mahalli rayice paralel.",
        outlier: false,
      });

      // TARSİM verileri
      setTarsimDataState({
        risk: { don: 14, kurak: 18, dolu: 12, firtina: 9 },
        hasar: [
          { yil: "2024", tur: "Don", ihbar: 18, ortHasar: 22, tazminat: 720, etkilenme: "Etkilenmemiş (NDVI normal)" },
          { yil: "2023", tur: "Kuraklık", ihbar: 30, ortHasar: 25, tazminat: 580, etkilenme: "Hafif stres" },
        ],
        crossAlert: "NDVI zaman serisi normal seyirde, bölgedeki hasar kayıtları ile çelişki yok.",
        crossUyumlu: true,
      });

      setCaprazLoading(false);
      showToast(`✅ ${caprazIlce} ${caprazYil} ${caprazUrun} resmi verileri getirildi`);
    }, 700);
  };

  const handleCaprazGerekceYaz = () => {
    if (!caprazResult) return;
    setCaprazGerekceLoading(true);
    setTimeout(() => {
      const { resmi, ai, sapmalar, skor } = caprazResult;
      const gerekce = `İlçe Tarım ve Orman Müdürlüğü ${caprazIlce} ${caprazYil} yılı resmi maliyet cetveline göre ${caprazUrun} ortalama verimi ${resmi.verim} kg/da, satış fiyatı ${resmi.fiyat} TL/kg ve masrafı ${resmi.masraf} TL/da olarak bildirilmiştir. Kaynak: ${resmi.kaynak}.\n\nUydu görüntüleri üzerinden yapılan NDVI analizi sonucunda parselin ${ai.verim} kg/da verim potansiyeline sahip olduğu tespit edilmiştir. Resmi cetvel ile uydu tahmini arasındaki sapma %${Math.abs(sapmalar.verim).toFixed(1)} olup, Yargıtay 5. Hukuk Dairesi yerleşik içtihatlarına (2021/1452 E.) göre %15 tolerans aralığındadır.\n\nTutarlılık skoru ${skor}/100 olup, HMK 279 kapsamında tamamen teknik tespit yapılmıştır.`;
      setCaprazGerekce(gerekce);
      setCaprazGerekceLoading(false);
    }, 600);
  };

  const handleOpenEkRapor = () => {
    if (!caprazResult) {
      showToast("Önce Resmi Verileri Getir");
      return;
    }
    const dosyaNo = `${new Date().getFullYear()}/${Math.floor(Math.random() * 9000) + 1000} E.`;
    const tarih = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
    const meta = { dosyaNo, tarih };

    const tasinmaz = tkgmResult || {
      il: tkgmIl,
      ilce: tkgmIlce,
      mahalle: tkgmMahalle,
      ada: tkgmAdaInput,
      parsel: tkgmParselInput,
      alan: uyduAreaM2 ? Math.round(uyduAreaM2) : 12500,
      nitelik: uyduTapuNitelik,
      mevkii: `${tkgmMahalle} Mevkii`,
      pafta: tkgmPafta,
      tapuAlan: Math.round(uyduAreaM2) || 12000,
      hesapAlan: Math.round(uyduAreaM2) || 12150,
      farkPct: 1.2,
      edinme: "Satış",
      malikTipi: "Gerçek Kişi",
      itrf: "500123.45, 4500123.67",
      koordinatSistemi: "ITRF96 / UTM 35N",
      serh: "Yok",
      beyan: "Beyan yok",
      irtifak: "Yok",
    };

    setEkRaporFull({
      meta,
      tasinmaz,
      capraz: caprazResult,
      caprazIlce,
      caprazYil,
      caprazUrun,
      ndvi: { max: 0.78, eviMax: 0.68, ort: 0.55, data: ndviData },
      verim: verimTahmini,
      uydu: { ndvi: uyduNDVI, areaM2: uyduAreaM2, crop: uyduCrop, confidence: uyduConfidence, netGelir: uyduNetGelir },
      komsu: komsuDataState,
      tarsim: tarsimDataState,
    });
    setPdfModalOpen(true);
  };

  const handleDownloadEkRaporPDF = () => {
    if (!ekRaporFull) return;
    setPdfGenerating(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const margin = 15;
      let y = 20;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 36, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(sanitizeTR("BILIRKISI DOGRULAMA EK RAPORU"), margin, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(sanitizeTR("01 Tarim - Uydu & Resmi Veri Capraz Dogrulama"), margin, 26);
      doc.setFontSize(8);
      doc.text(sanitizeTR(`Dosya No: ${ekRaporFull.meta.dosyaNo} | Tarih: ${ekRaporFull.meta.tarih}`), margin, 32);

      y = 48;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(sanitizeTR("1. TASINMAZ VE TAPU BILGILERI"), margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const t = ekRaporFull.tasinmaz;
      doc.text(sanitizeTR(`Il/Ilce/Mahalle: ${t.il} / ${t.ilce} / ${t.mahalle} | Ada: ${t.ada} | Parsel: ${t.parsel}`), margin, y);
      y += 5;
      doc.text(sanitizeTR(`Tapu Alani: ${t.tapuAlan} m2 | Nitelik: ${t.nitelik} | Pafta: ${t.pafta}`), margin, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(sanitizeTR("2. DORT KATMANLI DOGRULAMA ZINCIRI"), margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const c = ekRaporFull.capraz;
      doc.text(sanitizeTR(`Katman 1 (Uydu NDVI): Max NDVI ${ekRaporFull.ndvi.max} | Verim Tahmini ${c.ai.verim} kg/da`), margin, y);
      y += 5;
      doc.text(sanitizeTR(`Katman 2 (Ilce Tarim): Resmi Verim ${c.resmi.verim} kg/da | Fiyat ${c.resmi.fiyat} TL | Sapma %${c.sapmalar.verim.toFixed(1)}`), margin, y);
      y += 5;
      doc.text(sanitizeTR(`Katman 3 (Komsu Parsel): Bolge Ortalamasi ${ekRaporFull.komsu?.ort || '-'} kg/da - Mahalli rayice paralel`), margin, y);
      y += 5;
      doc.text(sanitizeTR(`Katman 4 (TARSIM): Don/Kuraklik risk analizi uyumlu, tutarli`), margin, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(sanitizeTR(`3. SONUC VE TUTARLILIK SKORU: ${c.skor}/100 (${c.durum.toUpperCase()})`), margin, y);
      y += 6;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(sanitizeTR("HMK 279 Uyarinca teknik tespit raporudur, hukuki degerlendirme icermez."), margin, y);

      const fileName = `Dogrulama_Raporu_${t.ada}_${t.parsel}.pdf`;
      doc.save(fileName);
      showToast(`📄 PDF indirildi: ${fileName}`);
    } catch {
      showToast("PDF oluşturulurken hata oluştu");
    } finally {
      setPdfGenerating(false);
    }
  };

  const sendChat = (text?: string) => {
    const q = (text || chatInput).trim();
    if (!q) return;
    setChatMessages((m) => [...m, { role: "user", text: q }]);
    setChatInput("");
    setChatTyping(true);
    setTimeout(() => {
      const ans = getAIAnswer(q);
      setChatMessages((m) => [...m, { role: "ai", text: ans.text, badge: ans.badge }]);
      setChatTyping(false);
    }, 600);
  };

  const handleFotoDrop = (f?: File) => {
    const file = f || fotoInputRef.current?.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoFile({ name: file.name, url });
    setFotoStep("analyzing");
    setFotoProgress(0);
    setFotoResult(null);

    let p = 0;
    const intv = setInterval(() => {
      p += 25;
      if (p >= 100) {
        clearInterval(intv);
        setFotoProgress(100);
        setFotoStep("done");
        setFotoResult({
          crop: "Buğday (Triticum aestivum)",
          stage: "Sapa kalkma - BBCH 39",
          damage: "%15 kuraklık stresi",
          health: "İyi - Orta",
          techPara: "Keşif günü parselde yapılan incelemede; buğday ekili alanın sapa kalkma döneminde olduğu, yapraklarda lokal su stresine bağlı hafif sararma tespit edilmiştir. Verim kaybı teknik olarak %12-15 aralığında takdir edilmiştir.",
        });
        showToast("AI analiz tamamlandı");
      } else {
        setFotoProgress(p);
      }
    }, 180);
  };

  const generateReport = () => {
    if (wizType === "kamulastirma") {
      const kfo = kamuArazi === "sulu" ? 0.04 : 0.05;
      const ciplak = kamuNet / kfo;
      const odaDegeri = ciplak * (kamuODA / 100);
      const nihai = ciplak + odaDegeri;
      const toplam = nihai * kamuAlan;
      setAiGerekce(null);
      setReportText(`KAMULAŞTIRMA BEDELİ\nKFO: ${kamuArazi === "sulu" ? "Sulu %4" : "Kuru %5"}\nNet Gelir: ${kamuNet} TL\nÇıplak Değer: ${ciplak.toLocaleString("tr-TR")} TL\nODA: %${kamuODA} (${odaDegeri.toLocaleString("tr-TR")} TL)\nNihai Birim: ${nihai.toLocaleString("tr-TR")} TL/da\nToplam (${kamuAlan} da): ${toplam.toLocaleString("tr-TR")} TL`);
      setReportHTML(`
        <div style="text-align:center;font-weight:bold;margin-bottom:16px">BİLİRKİŞİ RAPORU TASLAĞI — KAMULAŞTIRMA</div>
        <p><b>1. Değerlendirme Yöntemi:</b> 2942 sayılı Kamulaştırma Kanunu Md.11 uyarınca <b>Gelir Kapitalizasyonu Yöntemi</b>.</p>
        <p><b>2. KFO:</b> ${kamuArazi === "sulu" ? "Sulu Tarım (%4)" : "Kuru Tarım (%5)"} — Yargıtay 5.HD yerleşik içtihatları.</p>
        <div style="background:#f8fafc;padding:12px;border-radius:8px;margin:12px 0;font-family:monospace">
          • Yıllık Net Gelir: ${kamuNet.toLocaleString("tr-TR")} TL/da<br/>
          • Çıplak Değer: ${ciplak.toLocaleString("tr-TR")} TL<br/>
          • ODA (%${kamuODA}): ${odaDegeri.toLocaleString("tr-TR")} TL<br/>
          • Nihai Birim Değer: ${nihai.toLocaleString("tr-TR")} TL/da
        </div>
        <p style="font-weight:bold;font-size:15px">TOPLAM BEDEL (${kamuAlan} da): ${toplam.toLocaleString("tr-TR")} TL</p>
      `);
    } else if (wizType === "ecrimisil") {
      let current = ecriBase;
      let total = 0;
      let rowsHTML = "";
      for (let i = 0; i < ecriDur; i++) {
        const year = ecriStart + i;
        const ufe = i === 0 ? 0 : UFE_RATES[year - 1] ?? 50;
        if (i > 0) current = current * (1 + ufe / 100);
        total += current;
        rowsHTML += `<tr><td style="border:1px solid #e2e8f0;padding:6px">${year}</td><td style="border:1px solid #e2e8f0;padding:6px">%${ufe}</td><td style="border:1px solid #e2e8f0;padding:6px;text-align:right">${current.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL</td></tr>`;
      }
      setReportText(`ECRİMİSİL HESABI\nToplam: ${total.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`);
      setReportHTML(`
        <div style="text-align:center;font-weight:bold;margin-bottom:14px">ECRİMİSİL HESAPLAMA TABLOSU</div>
        <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr style="background:#f1f5f9"><th style="padding:6px;border:1px solid #e2e8f0">Yıl</th><th style="padding:6px;border:1px solid #e2e8f0">ÜFE</th><th style="padding:6px;border:1px solid #e2e8f0">Bedel</th></tr></thead><tbody>${rowsHTML}</tbody></table>
        <p style="font-weight:bold">TOPLAM: ${total.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL</p>
      `);
    } else if (wizType === "agac") {
      const lifeMap = { Zeytin: 100, Elma: 40, Şeftali: 25 };
      const maxLife = lifeMap[agacType];
      const baz = agacIncome / 0.05;
      const oran = Math.min(0.9, agacAge / maxLife);
      const yipranma = baz * oran;
      const net = baz - yipranma;
      const toplam = net * agacCount;
      setReportText(`AĞAÇ DEĞERLEME\n${agacCount} adet ${agacType}: ${toplam.toLocaleString("tr-TR")} TL`);
      setReportHTML(`
        <div style="text-align:center;font-weight:bold;margin-bottom:14px">AĞAÇ DEĞERLEME VE AMORTİSMAN</div>
        <p>Cins: ${agacType} | Yaş: ${agacAge} | Ömür: ${maxLife} yıl</p>
        <p>1 Ağaç Net: ${net.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL</p>
        <p style="font-weight:bold">TOPLAM (${agacCount} Adet): ${toplam.toLocaleString("tr-TR")} TL</p>
      `);
    } else {
      const ddo = (irtifakAlanM2 * (irtifakKatsayi / 100)) / (irtifakToplamAlanM2 || 1);
      const irtifakBedeli = irtifakToplamAlanM2 * irtifakRayicM2 * ddo;
      const direkBedeli = irtifakDirekAlanM2 * irtifakRayicM2;
      const toplamIrtifak = irtifakBedeli + direkBedeli;

      setReportText(`İRTİFAK HAKKI & TEL ALTI ZARAR BEDELİ (2942 SK m.11)\nToplam Alan: ${irtifakToplamAlanM2} m²\nİrtifak Sahası: ${irtifakAlanM2} m² (Katsayı: %${irtifakKatsayi})\nDirek Yeri: ${irtifakDirekAlanM2} m²\nBirim Rayiç: ${irtifakRayicM2} TL/m²\nDDO: %${(ddo * 100).toFixed(2)}\nİrtifak Bedeli: ${irtifakBedeli.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL\nDirek Kamulaştırma: ${direkBedeli.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL\nTOPLAM: ${toplamIrtifak.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`);
      setReportHTML(`
        <div style="text-align:center;font-weight:bold;margin-bottom:14px">İRTİFAK HAKKI VE ENERJİ NAKİL HATTI RAPOR TASLAĞI</div>
        <p><b>1. Mevzuat & Formül:</b> 2942 sayılı Kamulaştırma Kanunu m.11 ve TMMOB İrtifak Değerleme Standartları.</p>
        <div style="background:#f8fafc;padding:12px;border-radius:8px;margin:12px 0;font-family:monospace;font-size:12px;line-height:1.6">
          • Toplam Taşınmaz Alanı (T): <b>${irtifakToplamAlanM2.toLocaleString("tr-TR")} m²</b><br/>
          • Tel Altı İrtifak Alanı (İHY): <b>${irtifakAlanM2.toLocaleString("tr-TR")} m²</b><br/>
          • Zemin Birim Rayici: <b>${irtifakRayicM2.toLocaleString("tr-TR")} TL/m²</b><br/>
          • Değer Düşüklüğü Oranı (DDO) = (${irtifakAlanM2} × %${irtifakKatsayi}) / ${irtifakToplamAlanM2} = <b>%${(ddo * 100).toFixed(2)}</b><br/>
          • Tel Altı İrtifak Bedeli = ${irtifakToplamAlanM2} × ${irtifakRayicM2} × %${(ddo * 100).toFixed(2)} = <b>${irtifakBedeli.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL</b><br/>
          • Direk Yeri Mülkiyet Bedeli = ${irtifakDirekAlanM2} m² × ${irtifakRayicM2} TL = <b>${direkBedeli.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL</b>
        </div>
        <p style="border-top:2px solid #0f172a;padding-top:10px;font-weight:bold;font-size:14px">
          ÖDENECEK TOPLAM İRTİFAK VE DİREK BEDELİ: <span style="background:#ecfdf5;color:#065f46;padding:2px 8px;border-radius:6px">${toplamIrtifak.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL</span>
        </p>
      `);
    }
    showToast("Rapor taslağı üretildi");
  };

  const scanReport = () => {
    const forbidden = ["kusur", "kusurlu", "mülkiyet", "mülkiyeti", "kasıt", "suç", "haksız fiil", "aidiyet", "zilyetlik"];
    const lower = scanInput.toLowerCase();
    const found = forbidden.filter((w) => lower.includes(w));
    setScanResult({ found });
  };

  const performIctihatSearch = () => {
    const q = ictihatQuery.trim().toLowerCase();
    if (!q) {
      setIctihatResults([]);
      setHasSearched(true);
      return;
    }
    const keywords = q.split(" ").filter((k) => k.length > 2);
    const res = ICTIHAT_DB.filter((c) =>
      keywords.some((k) => c.konu.toLowerCase().includes(k) || c.metin.toLowerCase().includes(k) || c.daire.toLowerCase().includes(k))
    );
    setIctihatResults(res.length ? res : ICTIHAT_DB);
    setHasSearched(true);
  };

  const fetchArchive = () => {
    const key = `${archiveCity}_${archiveYear}`;
    setArchiveData(DATA_DB[key] || null);
  };

  const navItems = [
    { id: "dashboard" as TabId, label: "Gösterge Paneli", icon: <LayoutDashboard size={18} />, group: "panel" },
    { id: "ilkeler" as TabId, label: "İlkeler & Standartlar", icon: <ShieldCheck size={18} />, group: "panel", badge: "RESMİ" },
    { id: "aiAsistan" as TabId, label: "AI Saha Asistanı", icon: <MessageSquare size={18} />, group: "ai", badge: "Meta AI" },
    { id: "fotoAnaliz" as TabId, label: "Fotoğraf Analiz AI", icon: <Camera size={18} />, group: "ai", badge: "Vision" },
    { id: "uyduParsel" as TabId, label: "Uydu Parsel AI", icon: <Satellite size={18} />, group: "ai", badge: "PREMIUM" },
    { id: "teorik" as TabId, label: "Teorik Eğitimler", icon: <BookOpen size={18} />, group: "egitim" },
    { id: "uyap" as TabId, label: "UYAP Simülasyonu", icon: <Monitor size={18} />, group: "egitim" },
    { id: "sihirbaz" as TabId, label: "Rapor Sihirbazı", icon: <Wand2 size={18} />, group: "saas" },
    { id: "tarayici" as TabId, label: "HMK 279 Tarayıcı", icon: <Microscope size={18} />, group: "saas" },
    { id: "ictihat" as TabId, label: "İçtihat Arama", icon: <Scale size={18} />, group: "saas" },
    { id: "veriarsivi" as TabId, label: "Tarım Veri Arşivi", icon: <Database size={18} />, group: "saas" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0f172a] text-white hidden md:flex flex-col shrink-0 shadow-xl z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight">Ziraat Asistan</h1>
              <p className="text-[11px] text-emerald-400 font-medium">01 TARIM • Meta AI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          <div>
            <p className="px-3 pb-1 text-[11px] font-bold text-slate-500 tracking-wider">PANEL</p>
            {navItems.filter((i) => i.group === "panel").map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition ${
                  activeTab === item.id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div>
            <p className="px-3 pb-1 text-[11px] font-bold text-emerald-400/80 tracking-wider flex items-center gap-1.5"><Stars size={12}/> AI ARAÇLARI</p>
            {navItems.filter((i) => i.group === "ai").map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition border ${
                  activeTab === item.id ? "bg-emerald-500/15 border-emerald-500/30 text-white" : "border-transparent text-slate-300 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-3 text-emerald-400">{item.icon} <span className="text-white">{item.label}</span></span>
                {item.badge && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{item.badge}</span>}
              </button>
            ))}
          </div>

          <div>
            <p className="px-3 pb-1 text-[11px] font-bold text-slate-500 tracking-wider">MODÜLLER</p>
            {navItems.filter((i) => i.group === "egitim" || i.group === "saas").map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition ${
                  activeTab === item.id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#0b1222]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold grid place-items-center text-xs">ZM</div>
            <div className="text-xs">
              <p className="font-semibold text-slate-100">Ziraat Mühendisi</p>
              <p className="text-emerald-400">Meta AI Aktif</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-emerald-400" />
            <span className="font-bold text-sm">Ziraat Asistan</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg bg-white/10">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {mobileOpen && (
          <div className="md:hidden absolute inset-0 z-40 bg-[#0f172a] pt-14 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-200"
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hoş geldiniz, Bilirkişi.</h2>
                  <p className="text-slate-500 mt-2">Yargıtay standartlarında bilirkişi raporları, AI asistanı ve uydu parsel analizi.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "aiAsistan" as TabId, title: "AI Saha Asistanı", desc: "KFO, HMK 279, TARSİM mevzuatı", icon: <MessageSquare size={20} /> },
                    { id: "uyduParsel" as TabId, title: "Uydu Parsel AI", desc: "Esri 0.5m & NDVI verim modeli", icon: <Satellite size={20} /> },
                    { id: "sihirbaz" as TabId, title: "Rapor Sihirbazı", desc: "Kamulaştırma & Ecrimisil hesabı", icon: <Wand2 size={20} /> },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveTab(c.id)}
                      className="text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center mb-3">
                        {c.icon}
                      </div>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Akıllı Dosya Özetleyici */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800">
                  <h3 className="font-bold flex items-center gap-2"><FileScan size={18} className="text-emerald-400" /> Akıllı Müzekkere Özetleyici</h3>
                  <textarea
                    value={davaMetni}
                    onChange={(e) => setDavaMetni(e.target.value)}
                    rows={4}
                    className="w-full mt-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 outline-none"
                  />
                  <button
                    onClick={() => {
                      setOzetLoading(true);
                      setTimeout(() => {
                        setOzetResult({
                          tur: "Kamulaştırma Bedel Tespiti",
                          kesif: "15.06.2025",
                          parsel: "125 ada 8 parsel",
                          istenen: "Net Gelir + ODA",
                          yil: "2024",
                          alan: "12.500 m2",
                        });
                        setOzetLoading(false);
                        showToast("Özetlendi, Sihirbaz dolduruldu");
                      }, 600);
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    {ozetLoading ? "Analiz ediliyor..." : "AI ile Özetle"}
                  </button>
                  {ozetResult && (
                    <div className="mt-3 p-3 bg-white/10 rounded-xl text-xs space-y-1">
                      <p><b>Dava Türü:</b> {ozetResult.tur}</p>
                      <p><b>Parsel:</b> {ozetResult.parsel} • {ozetResult.alan}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* İLKELER VE STANDARTLAR */}
            {activeTab === "ilkeler" && (
              <IlkelerView onSelectTab={setActiveTab} showToast={showToast} />
            )}

            {/* AI ASISTAN */}
            {activeTab === "aiAsistan" && (
              <div className="max-w-[800px] mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-400" />
                    <span className="font-bold text-sm">Ziraat AI Saha Asistanı</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">Çevrimdışı Model</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-slate-900 text-white" : "bg-white border border-slate-200"}`}>
                        {m.badge && <p className="text-[10px] font-bold text-emerald-600 mb-1">{m.badge}</p>}
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatTyping && <p className="text-xs text-slate-400">Yazıyor...</p>}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 bg-white border-t border-slate-200">
                  <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                    {AI_QUICK_PROMPTS.map((p) => (
                      <button key={p} onClick={() => sendChat(p)} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] whitespace-nowrap">{p}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      placeholder="Sorunuzu yazın... Örn: KFO sulu arazide kaç alınır?"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                    />
                    <button onClick={() => sendChat()} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Gönder</button>
                  </div>
                </div>
              </div>
            )}

            {/* FOTO ANALIZ */}
            {activeTab === "fotoAnaliz" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold flex items-center gap-2 mb-3"><Camera size={18} className="text-emerald-600" /> Fotoğraftan Teknik Tespit</h3>
                  <input ref={fotoInputRef} type="file" accept="image/*" className="hidden" onChange={() => handleFotoDrop()} />
                  {!fotoFile ? (
                    <div onClick={() => fotoInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50">
                      <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold">Tarla fotoğrafı seçin</p>
                      <p className="text-[11px] text-slate-400 mt-1">Buğday, ayçiçeği, mısır, hasar tespiti</p>
                    </div>
                  ) : (
                    <div>
                      <img src={fotoFile.url} alt="Tarla" className="w-full h-48 object-cover rounded-xl border" />
                      <button onClick={() => { setFotoFile(null); setFotoResult(null); }} className="mt-2 text-xs text-rose-600 font-bold">Fotoğrafı Kaldır</button>
                    </div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs tracking-wider text-slate-500 mb-2">AI RAPOR PARAGRAFI</h4>
                  {fotoResult ? (
                    <div className="space-y-3">
                      <p className="text-xs bg-emerald-50 p-3 rounded-xl border border-emerald-200">{fotoResult.techPara}</p>
                      <button onClick={() => handleCopy(fotoResult.techPara)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">Paragrafı Kopyala</button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Fotoğraf yüklendiğinde otomatik teknik rapor paragrafı üretilir.</p>
                  )}
                </div>
              </div>
            )}

            {/* UYDU PARSEL AI */}
            {activeTab === "uyduParsel" && (
              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-2xl text-white flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      value={uyduSearch}
                      onChange={(e) => setUyduSearch(e.target.value)}
                      placeholder="Edirne Merkez 123/5"
                      className="w-full px-3 py-1.5 rounded-xl bg-white/10 text-xs border border-white/20 outline-none"
                    />
                    <button onClick={handleUyduSearch} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-900 font-bold text-xs">Uç</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={startAiDetection} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-900 font-bold text-xs flex items-center gap-1.5">
                      <ScanLine size={14} /> AI Sınır Tespiti
                    </button>
                    <button onClick={handleSendToWizard} className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs">Sihirbaza Aktar</button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[3fr_1fr] gap-4">
                  <div className="h-[450px] rounded-2xl border border-slate-200 overflow-hidden relative bg-slate-950">
                    <div ref={mapContainerRef} className="w-full h-full" />
                    {uyduDetecting && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                        AI Uydu Taraması %{uyduScanProgress}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <p className="font-bold text-slate-500 tracking-wider">PARSEL BİLGİSİ</p>
                    <div className="bg-slate-50 p-2.5 rounded-xl border">
                      <p className="text-slate-500">Alan</p>
                      <p className="font-bold text-sm">{(uyduAreaM2 / 1000).toFixed(2)} da ({uyduAreaM2.toFixed(0)} m²)</p>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <p className="text-emerald-700">NDVI • Ürün</p>
                      <p className="font-bold text-emerald-900">{uyduNDVI} • {uyduCrop}</p>
                    </div>
                    <button onClick={handleTkgmSorgula} className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold">TKGM Sorgula</button>
                    <button onClick={handleOpenEkRapor} className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold">4 Katmanlı Ek Rapor (PDF)</button>
                  </div>
                </div>

                {/* NDVI ÇOK YILLI TREND PANELİ (2023 vs 2024 vs 2025) */}
                <NdviPanel
                  parselInfo={{
                    il: tkgmIl,
                    ilce: tkgmIlce,
                    ada: uyduAda,
                    parsel: uyduParselNo,
                    urun: uyduCrop,
                  }}
                  onTransferNetGelir={(net) => {
                    setKamuNet(net);
                    setActiveTab("sihirbaz");
                    showToast(`🌾 NDVI Trend Analizinden ${net.toLocaleString("tr-TR")} TL/da net gelir aktarıldı`);
                  }}
                  showToast={showToast}
                />

                {/* Çapraz Doğrulama */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold flex items-center gap-2"><Landmark size={18} className="text-emerald-600" /> İlçe Tarım Çapraz Doğrulama (HMK 279)</h3>
                    <button onClick={handleCaprazGetir} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">Resmi Verileri Getir</button>
                  </div>

                  {caprazResult && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl border"><p className="text-slate-500">AI Verim</p><p className="font-bold text-sm">{caprazResult.ai.verim} kg/da</p></div>
                        <div className="p-3 bg-slate-50 rounded-xl border"><p className="text-slate-500">Resmi Verim</p><p className="font-bold text-sm">{caprazResult.resmi.verim} kg/da</p></div>
                        <div className="p-3 bg-slate-50 rounded-xl border"><p className="text-slate-500">Sapma</p><p className="font-bold text-sm">%{caprazResult.sapmalar.verim.toFixed(1)}</p></div>
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl"><p className="text-emerald-700">Skor</p><p className="font-bold text-sm text-emerald-900">{caprazResult.skor}/100</p></div>
                      </div>
                      <button onClick={handleCaprazGerekceYaz} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold">Gerekçe Paragrafı Yaz</button>
                      {caprazGerekce && (
                        <div className="p-3 bg-slate-50 border rounded-xl whitespace-pre-wrap leading-relaxed">
                          {caprazGerekce}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SIHIRBAZ */}
            {activeTab === "sihirbaz" && (
              <div className="grid lg:grid-cols-[400px_1fr] gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-sm">DAVA VERİ GİRİŞİ</h3>
                  <select value={wizType} onChange={(e) => setWizType(e.target.value as any)} className="w-full p-2.5 rounded-xl border text-xs">
                    <option value="kamulastirma">Kamulaştırma Bedeli</option>
                    <option value="ecrimisil">Ecrimisil (TÜİK ÜFE)</option>
                    <option value="agac">Ağaç Değerleme (Amortisman)</option>
                    <option value="irtifak">İrtifak Hakkı & Tel Altı Zarar (2942 SK)</option>
                  </select>

                  {wizType === "kamulastirma" && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setKamuArazi("sulu")} className={`p-2 rounded-xl border font-bold ${kamuArazi === "sulu" ? "bg-emerald-600 text-white" : "bg-slate-50"}`}>Sulu Tarım (%4)</button>
                        <button onClick={() => setKamuArazi("kuru")} className={`p-2 rounded-xl border font-bold ${kamuArazi === "kuru" ? "bg-slate-900 text-white" : "bg-slate-50"}`}>Kuru Tarım (%5)</button>
                      </div>
                      <div>
                        <label className="text-slate-600">Yıllık Net Gelir (TL/da)</label>
                        <input type="number" value={kamuNet} onChange={(e) => setKamuNet(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">Objektif Değer Artışı (%)</label>
                        <input type="number" value={kamuODA} onChange={(e) => setKamuODA(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">Alan (da)</label>
                        <input type="number" value={kamuAlan} onChange={(e) => setKamuAlan(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                    </div>
                  )}

                  {wizType === "ecrimisil" && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-600">İşgal Başlangıç Yılı</label>
                        <select value={ecriStart} onChange={(e) => setEcriStart(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl">
                          <option value={2022}>2022</option>
                          <option value={2023}>2023</option>
                          <option value={2024}>2024</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-600">Süre (Yıl)</label>
                        <input type="number" value={ecriDur} onChange={(e) => setEcriDur(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">İlk Yıl Baz Net Gelir (TL)</label>
                        <input type="number" value={ecriBase} onChange={(e) => setEcriBase(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                    </div>
                  )}

                  {wizType === "agac" && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-600">Ağaç Türü</label>
                        <select value={agacType} onChange={(e) => setAgacType(e.target.value as any)} className="w-full mt-1 p-2 border rounded-xl">
                          <option value="Zeytin">Zeytin (Ömür: 100 yıl)</option>
                          <option value="Elma">Elma (Ömür: 40 yıl)</option>
                          <option value="Şeftali">Şeftali (Ömür: 25 yıl)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-600">Ağaç Yaşı</label>
                        <input type="number" value={agacAge} onChange={(e) => setAgacAge(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">Yıllık Ağaç Başı Gelir (TL)</label>
                        <input type="number" value={agacIncome} onChange={(e) => setAgacIncome(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">Ağaç Adedi</label>
                        <input type="number" value={agacCount} onChange={(e) => setAgacCount(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                    </div>
                  )}

                  {wizType === "irtifak" && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-600">Toplam Parsel Alanı (m²)</label>
                        <input type="number" value={irtifakToplamAlanM2} onChange={(e) => setIrtifakToplamAlanM2(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">Tel Altı İrtifak Sahası (m²)</label>
                        <input type="number" value={irtifakAlanM2} onChange={(e) => setIrtifakAlanM2(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div>
                        <label className="text-slate-600">Zemin Rayiç Bedeli (TL/m²)</label>
                        <input type="number" value={irtifakRayicM2} onChange={(e) => setIrtifakRayicM2(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setIrtifakKatsayi(50)} className={`p-2 rounded-xl border font-bold ${irtifakKatsayi === 50 ? "bg-emerald-600 text-white" : "bg-slate-50"}`}>Katsayı %50</button>
                        <button type="button" onClick={() => setIrtifakKatsayi(35)} className={`p-2 rounded-xl border font-bold ${irtifakKatsayi === 35 ? "bg-slate-900 text-white" : "bg-slate-50"}`}>Katsayı %35</button>
                      </div>
                      <div>
                        <label className="text-slate-600">Direk Yeri Mülkiyet Alanı (m²)</label>
                        <input type="number" value={irtifakDirekAlanM2} onChange={(e) => setIrtifakDirekAlanM2(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-xl" />
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">Formül: DDO = (İrtifak Alanı × %Katsayı) / Toplam Alan. Direk yeri zemin bedeli tam eklenir.</p>
                    </div>
                  )}

                  <button onClick={generateReport} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs">Rapor Taslağını Üret</button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs tracking-wider text-slate-500 mb-4">A4 RAPOR ÖNİZLEME</h4>
                  {reportHTML ? (
                    <div className="p-6 bg-slate-50 rounded-xl border leading-relaxed text-xs font-serif" dangerouslySetInnerHTML={{ __html: reportHTML }} />
                  ) : (
                    <p className="text-xs text-slate-400">Verileri girip butona basın.</p>
                  )}
                </div>
              </div>
            )}

            {/* TARAYICI */}
            {activeTab === "tarayici" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Microscope size={18} className="text-rose-600" /> HMK 279 Hukuki Aşım Tarayıcısı</h3>
                <textarea
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 border rounded-xl text-xs outline-none"
                />
                <button onClick={scanReport} className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs">Metni Analiz Et</button>
                {scanResult && (
                  <div className="p-4 rounded-xl border text-xs">
                    {scanResult.found.length > 0 ? (
                      <p className="text-rose-700 font-bold">Yasaklı kelimeler bulundu: {scanResult.found.join(", ")}</p>
                    ) : (
                      <p className="text-emerald-700 font-bold">Metin temiz, HMK 279 ile uyumlu.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ICTIHAT */}
            {activeTab === "ictihat" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Gavel size={18} className="text-violet-600" /> Akıllı İçtihat Arama</h3>
                <div className="flex gap-2">
                  <input
                    value={ictihatQuery}
                    onChange={(e) => setIctihatQuery(e.target.value)}
                    placeholder="sulu tarım KFO, ecrimisil ÜFE..."
                    className="flex-1 p-2.5 border rounded-xl text-xs outline-none"
                  />
                  <button onClick={performIctihatSearch} className="px-4 py-2 bg-violet-600 text-white rounded-xl font-bold text-xs">Ara</button>
                </div>
                <div className="space-y-3">
                  {(hasSearched ? ictihatResults : ICTIHAT_DB).map((c, i) => (
                    <div key={i} className="p-4 bg-slate-50 border rounded-xl text-xs space-y-1">
                      <p className="font-bold text-violet-900">{c.daire} • {c.esas}</p>
                      <p className="text-slate-600">{c.metin}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VERI ARSIVI */}
            {activeTab === "veriarsivi" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Database size={18} className="text-blue-600" /> Tarım Verileri Arşivi</h3>
                <div className="flex gap-2">
                  <select value={archiveCity} onChange={(e) => setArchiveCity(e.target.value)} className="p-2 border rounded-xl text-xs">
                    <option>Edirne</option><option>Konya</option><option>Adana</option>
                  </select>
                  <select value={archiveYear} onChange={(e) => setArchiveYear(e.target.value)} className="p-2 border rounded-xl text-xs">
                    <option>2025</option><option>2024</option>
                  </select>
                  <button onClick={fetchArchive} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs">Verileri Getir</button>
                </div>
                {archiveData && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100"><th className="p-2 border">Ürün</th><th className="p-2 border">Verim (kg/da)</th><th className="p-2 border">Fiyat (TL)</th><th className="p-2 border">Masraf (TL)</th></tr>
                      </thead>
                      <tbody>
                        {archiveData.map((d, i) => (
                          <tr key={i} className="border-b"><td className="p-2 border font-bold">{d.urun}</td><td className="p-2 border">{d.verim}</td><td className="p-2 border">{d.fiyat}</td><td className="p-2 border">{d.masraf}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TEORİK TEMEL EĞİTİM MODÜLLERİ */}
            {activeTab === "teorik" && (
              <TemelEgitimView
                showToast={showToast}
                onGoToWizard={() => setActiveTab("sihirbaz")}
              />
            )}

            {/* UYAP */}
            {activeTab === "uyap" && (
              <UyapSimulatorView
                showToast={showToast}
                onGoToWizard={() => setActiveTab("sihirbaz")}
              />
            )}
          </div>
        </div>
      </main>

      {/* PDF Modal */}
      {pdfModalOpen && ekRaporFull && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm">4 Katmanlı Doğrulama Ek Raporu</h3>
              <button onClick={() => setPdfModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="text-xs space-y-2 bg-slate-50 p-4 rounded-xl border">
              <p><b>Dosya:</b> {ekRaporFull.meta.dosyaNo}</p>
              <p><b>Taşınmaz:</b> {ekRaporFull.tasinmaz.il} / {ekRaporFull.tasinmaz.ilce} - {ekRaporFull.tasinmaz.ada}/{ekRaporFull.tasinmaz.parsel}</p>
              <p><b>AI Uydu Verim:</b> {ekRaporFull.capraz.ai.verim} kg/da</p>
              <p><b>İlçe Tarım Cetvel:</b> {ekRaporFull.capraz.resmi.verim} kg/da</p>
              <p><b>Tutarlılık Skoru:</b> {ekRaporFull.capraz.skor}/100 ({ekRaporFull.capraz.durum.toUpperCase()})</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownloadEkRaporPDF} disabled={pdfGenerating} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs">
                {pdfGenerating ? "Hazırlanıyor..." : "A4 PDF İndir"}
              </button>
              <button onClick={() => setPdfModalOpen(false)} className="px-4 py-2.5 border rounded-xl text-xs font-bold">Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}

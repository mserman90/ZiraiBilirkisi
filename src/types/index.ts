export type TabId = 
  | "dashboard" 
  | "ilkeler"
  | "teorik" 
  | "uyap" 
  | "sihirbaz" 
  | "tarayici" 
  | "ictihat" 
  | "veriarsivi" 
  | "aiAsistan" 
  | "fotoAnaliz" 
  | "uyduParsel";

export type IlkeMadde = {
  id: string;
  baslik: string;
  kaynak: string;
  ozet: string;
  detay: string;
  kontrolListesi: string[];
  ornekIhlal: string;
  dogruUygulama: string;
};

export type KontrolKategori = {
  id: string;
  asama: string;
  baslik: string;
  aciklama: string;
  maddeler: {
    id: string;
    metin: string;
    mevzuat: string;
    onem: "kritik" | "standart";
    aciklama: string;
  }[];
};

export type MevzuatLink = {
  baslik: string;
  kanunNo: string;
  maddeNo: string;
  url: string;
  aciklama?: string;
  onemliFikra?: string;
};

export type ResmiDokuman = {
  id: string;
  baslik: string;
  kurum: string;
  tur: string;
  sayfaSayisi: string;
  url: string;
  aciklama: string;
};

export type TemelEgitimModul = {
  id: string;
  no: number;
  baslik: string;
  altBaslik: string;
  sure: string;
  ozet: string;
  konular: {
    baslik: string;
    icerik: string;
    onemliNot?: string;
  }[];
  mevzuatMaddeleri: string[];
  mevzuatLinkleri: MevzuatLink[];
  testSorulari: {
    soru: string;
    secenekler: string[];
    dogruCevapIndex: number;
    aciklama: string;
  }[];
};

export type CaprazRow = {
  verim: number;
  fiyat: number;
  masraf: number;
  kaynak: string;
};

export type TkgmResult = {
  il: string;
  ilce: string;
  mahalle: string;
  ada: string;
  parsel: string;
  alan: number;
  nitelik: string;
  mevkii: string;
  pafta: string;
  edinme: string;
  malikTipi: string;
  koordinatSistemi: string;
  olcek: string;
  tapuAlan: number;
  hesapAlan: number;
  farkPct: number;
  serh: string;
  beyan: string;
  irtifak: string;
  koordinatlar: [number, number][];
  itrf: string;
};

export type CaprazResult = {
  resmi: { verim: number; fiyat: number; masraf: number; kaynak: string };
  ai: { verim: number; fiyat: number; masraf: number; brut: number; net: number };
  sapmalar: { verim: number; fiyat: number; masraf: number; net: number; brut: number };
  skor: number;
  durum: "uyumlu" | "aciklama" | "red";
  tarihsel: { yil: string; resmi: number; ai: number }[];
};

export type KomsuData = {
  parcels: { no: string; mesafe: number; urun: string; verim: number; ndvi: number; durum: string }[];
  ort: number;
  benim: number;
  sapmaPct: number;
  std: number;
  zSkor: number;
  yorum: string;
  outlier: boolean;
};

export type TarsimData = {
  risk: { don: number; kurak: number; dolu: number; firtina: number };
  hasar: { yil: string; tur: string; ihbar: number; ortHasar: number; tazminat: number; etkilenme: string }[];
  crossAlert: string;
  crossUyumlu: boolean;
  ndviDrop?: string;
};

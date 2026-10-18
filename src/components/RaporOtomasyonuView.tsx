import React, { useState, useMemo } from "react";
import {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Wheat,
  Beef,
  Sprout,
  Printer,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
  Layers,
  Gavel,
  FileCheck,
  Info,
  Percent,
  ShieldAlert,
  DollarSign,
  Check,
  Eye,
  X,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  FlaskConical,
  Activity,
  Microscope,
} from "lucide-react";
import {
  DAVA_TURLERI_DB,
  DavaTuruSablonu,
  HMK_279_YASAKLI_KELIMELER,
  scanHmkViolations,
} from "../data/raporOtomasyonuData";
import { TUIK_TARIM_VERITABANI } from "../data/tuikTarimData";

interface RaporOtomasyonuViewProps {
  showToast: (msg: string) => void;
  onGoToWizard?: () => void;
}

export default function RaporOtomasyonuView({
  showToast,
  onGoToWizard,
}: RaporOtomasyonuViewProps) {
  // Wizard adımları: 1 = Künye, 2 = Dava Türü & Şablon, 3 = Keşif & Tespit, 4 = Bilimsel Hesaplama, 5 = HMK 279 Denetim, 6 = Resmi Rapor
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Seçili dava şablonu (varsayılan: Kamulaştırma)
  const [selectedDavaId, setSelectedDavaId] = useState<string>("kamulastirma_tarla");
  const selectedDava = useMemo(
    () => DAVA_TURLERI_DB.find((d) => d.id === selectedDavaId) || DAVA_TURLERI_DB[0],
    [selectedDavaId]
  );

  // -------------------------------------------------------------------
  // ADIM 1: MAHKEME VE GÖREVLENDİRME KÜNYESİ
  // -------------------------------------------------------------------
  const [mahkemeAdi, setMahkemeAdi] = useState(selectedDava.ornekVeriler.mahkeme);
  const [dosyaNo, setDosyaNo] = useState(selectedDava.ornekVeriler.dosyaNo);
  const [davaci, setDavaci] = useState(selectedDava.ornekVeriler.davaci);
  const [davaciVekili, setDavaciVekili] = useState(selectedDava.ornekVeriler.davaciVekili);
  const [davali, setDavali] = useState(selectedDava.ornekVeriler.davali);
  const [davaliVekili, setDavaliVekili] = useState(selectedDava.ornekVeriler.davaliVekili);
  const [davaKonusu, setDavaKonusu] = useState(selectedDava.ornekVeriler.konu);
  const [bilirkisiAdi, setBilirkisiAdi] = useState("Zir. Yük. Müh. Ahmet YILMAZ");
  const [bilirkisiUnvan, setBilirkisiUnvan] = useState("Ziraat Yüksek Mühendisi / Tarım Ekonomisti");
  const [bilirkisiSicilNo, setBilirkisiSicilNo] = useState("06-2024-1184");
  const [kesifTarihi, setKesifTarihi] = useState(new Date().toISOString().split("T")[0]);
  const [raporTarihi, setRaporTarihi] = useState(new Date().toISOString().split("T")[0]);

  // Mahkemenin Teknik Soruları (Maddeler halinde)
  const [mahkemeSorulari, setMahkemeSorulari] = useState<string[]>(
    selectedDava.varsayilanSorular
  );
  const [yeniSoruInput, setYeniSoruInput] = useState("");

  // -------------------------------------------------------------------
  // ADIM 3: KEŞİF VE FİİLİ DURUM TESPİTLERİ
  // -------------------------------------------------------------------
  const [parselIl, setParselIl] = useState(selectedDava.ornekVeriler.parselIl);
  const [parselIlce, setParselIlce] = useState(selectedDava.ornekVeriler.parselIlce);
  const [parselKoy, setParselKoy] = useState(selectedDava.ornekVeriler.parselKoy);
  const [adaNo, setAdaNo] = useState(selectedDava.ornekVeriler.ada);
  const [parselNo, setParselNo] = useState(selectedDava.ornekVeriler.parsel);
  const [alanM2, setAlanM2] = useState<number>(selectedDava.ornekVeriler.alanM2);
  const [araziTipi, setAraziTipi] = useState<"sulu" | "kuru">(selectedDava.ornekVeriler.araziTipi);
  const [toprakOzelligi, setToprakOzelligi] = useState("Killi-tınlı, derin profilli, taşsız");
  const [egimPct, setEgimPct] = useState<number>(2);
  const [sulamaKaynagi, setSulamaKaynagi] = useState("DSİ Cazibe Kanalı & Derin Kuyu");
  const [fiiliDurumAciklamasi, setFiiliDurumAciklamasi] = useState(
    selectedDava.ornekVeriler.teknikIncelemeMetni
  );

  // -------------------------------------------------------------------
  // ADIM 4: BİLİMSEL METODOLOJİ VE HESAP PARAMETRELERİ
  // -------------------------------------------------------------------
  // Münavebe tablosu (Tarım için)
  const [munavebeList, setMunavebeList] = useState(selectedDava.ornekVeriler.munavebe);
  const [kfo, setKfo] = useState<number>(selectedDava.ornekVeriler.kfo);
  const [odaPct, setOdaPct] = useState<number>(selectedDava.ornekVeriler.odaPct);

  // Hayvancılık parametreleri
  const [hayvanTuru, setHayvanTuru] = useState(selectedDava.ornekVeriler.hayvanTuru || "Siyah Alaca (Holstein) Süt İneği");
  const [hayvanSayisi, setHayvanSayisi] = useState(selectedDava.ornekVeriler.hayvanSayisi || 4);
  const [canliAgirlikKg, setCanliAgirlikKg] = useState(selectedDava.ornekVeriler.canliAgirlikKg || 600);
  const [canliKgFiyat, setCanliKgFiyat] = useState(selectedDava.ornekVeriler.canliKgFiyat || 240);
  const [damizlikFark, setDamizlikFark] = useState(selectedDava.ornekVeriler.damizlikVasıfFarki || 20000);
  const [yoksunKar, setYoksunKar] = useState(selectedDava.ornekVeriler.yoksunKalinanKar || 30000);
  const [hurdaMahsup, setHurdaMahsup] = useState(selectedDava.ornekVeriler.hurdaKurtarmaMahsubu || 40000);

  // Gıda parametreleri
  const [gidaPartiMiktar, setGidaPartiMiktar] = useState(selectedDava.ornekVeriler.gidaPartiMiktar || 5000);
  const [gidaBirimMaliyet, setGidaBirimMaliyet] = useState(selectedDava.ornekVeriler.gidaBirimMaliyet || 300);
  const [gidaAyipOraniPct, setGidaAyipOraniPct] = useState(selectedDava.ornekVeriler.gidaAyipOraniPct || 100);
  const [gidaTGKParametre, setGidaTGKParametre] = useState(selectedDava.ornekVeriler.gidaTGKParametre || "Delta-7-Stigmastenol");
  const [gidaAnalizDegeri, setGidaAnalizDegeri] = useState(selectedDava.ornekVeriler.gidaAnalizDegeri || "% 1.82");
  const [gidaStandartDeger, setGidaStandartDeger] = useState(selectedDava.ornekVeriler.gidaStandartDeger || "Azami % 0.50 (TGK)");

  // -------------------------------------------------------------------
  // ADIM 5: HMK 279 KUSUR VE HUKUKİ AŞIM DENETİMİ
  // -------------------------------------------------------------------
  const [customKanaatMetni, setCustomKanaatMetni] = useState("");

  // Otomatik hesaplanan ortalama net gelir (TL/da)
  const ortalamaNetGelir = useMemo(() => {
    if (munavebeList.length === 0) return 0;
    const total = munavebeList.reduce((acc, row) => {
      const gsud = row.verim * row.fiyat;
      const net = Math.max(0, gsud - row.masraf);
      return acc + net;
    }, 0);
    return Math.round(total / munavebeList.length);
  }, [munavebeList]);

  // Çıplak m² birim değeri (Net Gelir / KFO / 1000)
  const ciplakM2Degeri = useMemo(() => {
    if (kfo <= 0) return 0;
    return Number(((ortalamaNetGelir / kfo) / 1000).toFixed(2));
  }, [ortalamaNetGelir, kfo]);

  // Nihai m² birim değeri (ODA dahil)
  const nihaiM2Degeri = useMemo(() => {
    return Number((ciplakM2Degeri * (1 + odaPct / 100)).toFixed(2));
  }, [ciplakM2Degeri, odaPct]);

  // Toplam Tarla / Taşınmaz Değeri
  const toplamAraziDegeri = useMemo(() => {
    return Math.round(nihaiM2Degeri * alanM2);
  }, [nihaiM2Degeri, alanM2]);

  // Hayvancılık toplam net tazminat
  const toplamHayvanTazminat = useMemo(() => {
    const anaBedel = hayvanSayisi * canliAgirlikKg * canliKgFiyat;
    const damizlikToplam = hayvanSayisi * damizlikFark;
    const brut = anaBedel + damizlikToplam + yoksunKar;
    return Math.max(0, brut - hurdaMahsup);
  }, [hayvanSayisi, canliAgirlikKg, canliKgFiyat, damizlikFark, yoksunKar, hurdaMahsup]);

  // Gıda toplam ayıp / zarar bedeli
  const toplamGidaZarari = useMemo(() => {
    const toplamMaliyet = gidaPartiMiktar * gidaBirimMaliyet;
    return Math.round(toplamMaliyet * (gidaAyipOraniPct / 100));
  }, [gidaPartiMiktar, gidaBirimMaliyet, gidaAyipOraniPct]);

  // Şablon değiştiğinde örnek verileri yükle
  const handleSelectDavaTuru = (davaId: string) => {
    setSelectedDavaId(davaId);
    const d = DAVA_TURLERI_DB.find((item) => item.id === davaId);
    if (!d) return;

    setMahkemeAdi(d.ornekVeriler.mahkeme);
    setDosyaNo(d.ornekVeriler.dosyaNo);
    setDavaci(d.ornekVeriler.davaci);
    setDavaciVekili(d.ornekVeriler.davaciVekili);
    setDavali(d.ornekVeriler.davali);
    setDavaliVekili(d.ornekVeriler.davaliVekili);
    setDavaKonusu(d.ornekVeriler.konu);
    setMahkemeSorulari(d.varsayilanSorular);

    setParselIl(d.ornekVeriler.parselIl);
    setParselIlce(d.ornekVeriler.parselIlce);
    setParselKoy(d.ornekVeriler.parselKoy);
    setAdaNo(d.ornekVeriler.ada);
    setParselNo(d.ornekVeriler.parsel);
    setAlanM2(d.ornekVeriler.alanM2);
    setAraziTipi(d.ornekVeriler.araziTipi);
    setFiiliDurumAciklamasi(d.ornekVeriler.teknikIncelemeMetni);

    setKfo(d.ornekVeriler.kfo);
    setOdaPct(d.ornekVeriler.odaPct);
    setMunavebeList(d.ornekVeriler.munavebe);

    if (d.ornekVeriler.hayvanTuru) setHayvanTuru(d.ornekVeriler.hayvanTuru);
    if (d.ornekVeriler.hayvanSayisi) setHayvanSayisi(d.ornekVeriler.hayvanSayisi);
    if (d.ornekVeriler.canliAgirlikKg) setCanliAgirlikKg(d.ornekVeriler.canliAgirlikKg);
    if (d.ornekVeriler.canliKgFiyat) setCanliKgFiyat(d.ornekVeriler.canliKgFiyat);
    if (d.ornekVeriler.damizlikVasıfFarki) setDamizlikFark(d.ornekVeriler.damizlikVasıfFarki);
    if (d.ornekVeriler.yoksunKalinanKar) setYoksunKar(d.ornekVeriler.yoksunKalinanKar);
    if (d.ornekVeriler.hurdaKurtarmaMahsubu) setHurdaMahsup(d.ornekVeriler.hurdaKurtarmaMahsubu);

    if (d.ornekVeriler.gidaPartiMiktar) setGidaPartiMiktar(d.ornekVeriler.gidaPartiMiktar);
    if (d.ornekVeriler.gidaBirimMaliyet) setGidaBirimMaliyet(d.ornekVeriler.gidaBirimMaliyet);
    if (d.ornekVeriler.gidaAyipOraniPct) setGidaAyipOraniPct(d.ornekVeriler.gidaAyipOraniPct);
    if (d.ornekVeriler.gidaTGKParametre) setGidaTGKParametre(d.ornekVeriler.gidaTGKParametre);
    if (d.ornekVeriler.gidaAnalizDegeri) setGidaAnalizDegeri(d.ornekVeriler.gidaAnalizDegeri);
    if (d.ornekVeriler.gidaStandartDeger) setGidaStandartDeger(d.ornekVeriler.gidaStandartDeger);

    showToast(`✅ ${d.ad} şablonu ve resmi soru kalıpları yüklendi`);
  };

  // Mahkeme teknik soru ekleme / silme
  const handleAddSoru = () => {
    if (!yeniSoruInput.trim()) return;
    setMahkemeSorulari([...mahkemeSorulari, yeniSoruInput.trim()]);
    setYeniSoruInput("");
    showToast("Soru eklendi");
  };

  const handleRemoveSoru = (idx: number) => {
    setMahkemeSorulari(mahkemeSorulari.filter((_, i) => i !== idx));
  };

  // Münavebe ürünü ekleme / silme
  const handleAddMunavebeRow = () => {
    const nextYil = munavebeList.length + 1;
    setMunavebeList([
      ...munavebeList,
      { yil: nextYil, urun: "Yeni Ürün", verim: 500, fiyat: 10.0, masraf: 3000 },
    ]);
  };

  const handleRemoveMunavebeRow = (index: number) => {
    setMunavebeList(munavebeList.filter((_, i) => i !== index));
  };

  const handleUpdateMunavebe = (index: number, field: string, val: any) => {
    const updated = [...munavebeList];
    (updated[index] as any)[field] = val;
    setMunavebeList(updated);
  };

  // Otomatik oluşturulan teknik kanaat metni (HMK 279 uyumlu)
  const generatedKanaatMetni = useMemo(() => {
    if (customKanaatMetni) return customKanaatMetni;

    if (selectedDava.alan === "tarim") {
      return `Sayın Mahkemenizin ara kararı ve tevdi ettiği teknik sorular doğrultusunda yapılan yerinde keşif, İlçe Tarım ve Orman Müdürlüğü resmi münavebe maliyet cetvelleri ile bilimsel ve yerleşik Yargıtay 5. HD içtihatları çerçevesinde;\n\n1. Dava konusu ${parselIl} İli, ${parselIlce} İlçesi, ${parselKoy} Köyü ${adaNo} ada ${parselNo} parsel sayılı taşınmazın ${araziTipi === "sulu" ? "1. sınıf sulu mutlak tarım arazisi" : "kuru tarım arazisi"} vasfında olduğu,\n2. Yıllık ortalama net gelirinin ₺${ortalamaNetGelir.toLocaleString("tr-TR")}/da, kapitalizasyon faiz oranının %${(kfo * 100).toFixed(0)} olduğu,\n3. Taşınmazın geometrik yapısı, ana yola cephesi ve ulaşım olanakları sebebiyle %${odaPct} objektif değer artışı (ODA) takdir edildiği,\n4. Taşınmazın m² çıplak birim değerinin ₺${ciplakM2Degeri.toFixed(2)}, ODA dahil m² birim değerinin ₺${nihaiM2Degeri.toFixed(2)} olduğu,\n5. Taşınmazın toplam kamulaştırma / mülkiyet değerinin ₺${toplamAraziDegeri.toLocaleString("tr-TR")} olarak hesaplandığı,\n\nHususları, HMK m. 279/4 gereğince takdiri Sayın Mahkemenize ait olmak üzere teknik kanaat olarak arz olunur.`;
    } else if (selectedDava.alan === "hayvancilik") {
      return `Sayın Mahkemenizin ara kararı uyarınca yapılan dosya ve kayıt incelemesinde;\n\n1. Olay günü meydana gelen elektrik kaçağı / telef hadisesinde 4 baş yüksek verimli damızlık Holstein ırkı ineğin telef olduğu,\n2. Hayvanların canlı ağırlık rayiç değerinin ₺${(hayvanSayisi * canliAgirlikKg * canliKgFiyat).toLocaleString("tr-TR")}, damızlık vasıf farkının ₺${(hayvanSayisi * damizlikFark).toLocaleString("tr-TR")} olduğu,\n3. Yoksun kalınan kâr tutarının ₺${yoksunKar.toLocaleString("tr-TR")} olduğu,\n4. TBK m. 52 ve 55 uyarınca kesimhaneden elde edilen hurda (kurtarma) et bedeli olan ₺${hurdaMahsup.toLocaleString("tr-TR")}'nin mahsup edildiği,\n5. Sonuç olarak davacı işletmenin net teknik zararının ₺${toplamHayvanTazminat.toLocaleString("tr-TR")} olarak hesaplandığı,\n\nHususları teknik kanaat olarak Sayın Mahkemenize saygıyla arz olunur.`;
    } else {
      return `Sayın Mahkemenizin ara kararı uyarınca akredite gıda laboratuvarı analiz raporları üzerinde yapılan incelemede;\n\n1. Teslim edilen ${gidaPartiMiktar.toLocaleString("tr-TR")} Litrelik natürel sızma zeytinyağı partisinden alınan şahit numunede ${gidaTGKParametre} değerinin ${gidaAnalizDegeri} tespit edildiği,\n2. Bu değerin Türk Gıda Kodeksi Zeytinyağı Tebliği'nde yer alan azami ${gidaStandartDeger} sınırını aştığı ve üründe tohum yağı tağşişi bulunduğu,\n3. Ürünün sızma zeytinyağı vasfını yitirdiği ve ayıp oranının %${gidaAyipOraniPct} olduğu,\n4. Toplam teknik ayıp zararının ₺${toplamGidaZarari.toLocaleString("tr-TR")} olduğu,\n\nHususları HMK m. 279/4 kapsamında teknik tespit olarak takdirlerinize sunulur.`;
    }
  }, [
    customKanaatMetni,
    selectedDava.alan,
    parselIl,
    parselIlce,
    parselKoy,
    adaNo,
    parselNo,
    araziTipi,
    ortalamaNetGelir,
    kfo,
    odaPct,
    ciplakM2Degeri,
    nihaiM2Degeri,
    toplamAraziDegeri,
    hayvanSayisi,
    canliAgirlikKg,
    canliKgFiyat,
    damizlikFark,
    yoksunKar,
    hurdaMahsup,
    toplamHayvanTazminat,
    gidaPartiMiktar,
    gidaTGKParametre,
    gidaAnalizDegeri,
    gidaStandartDeger,
    gidaAyipOraniPct,
    toplamGidaZarari,
  ]);

  // HMK 279 denetimi taraması
  const hmkScanResult = useMemo(() => {
    return scanHmkViolations(generatedKanaatMetni);
  }, [generatedKanaatMetni]);

  // HMK Düzeltme Butonu
  const handleApplyHmkFix = () => {
    setCustomKanaatMetni(hmkScanResult.cleanTextSuggestion);
    showToast("✅ HMK 279 ihlalleri teknik dile uyarlandı");
  };

  // -------------------------------------------------------------------
  // ADIM 6: ADALET BAKANLIĞI STANDART FORMATINDA RAPOR METNİ
  // -------------------------------------------------------------------
  const fullOfficialReportHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>BİLİRKİŞİ RAPORU - ${dosyaNo}</title>
<style>
  body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 25mm 20mm; }
  h1 { font-size: 14pt; text-align: center; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; }
  h2 { font-size: 12pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 3px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11pt; }
  th, td { border: 1px solid #444; padding: 6px 8px; text-align: left; }
  th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .bold { font-weight: bold; }
  .header-box { margin-bottom: 20px; }
  .signature-box { margin-top: 40px; text-align: right; }
</style>
</head>
<body>

<div class="header-box">
  <h1>T.C.<br>${mahkemeAdi.toUpperCase()}<br>SAYIN HAKİMLİĞİ'NE</h1>
</div>

<table>
  <tr><td class="bold" style="width: 28%;">DOSYA ESAS NO</td><td>: ${dosyaNo}</td></tr>
  <tr><td class="bold">DAVACI</td><td>: ${davaci}</td></tr>
  <tr><td class="bold">DAVACI VEKİLİ</td><td>: ${davaciVekili}</td></tr>
  <tr><td class="bold">DAVALI</td><td>: ${davali}</td></tr>
  <tr><td class="bold">DAVALI VEKİLİ</td><td>: ${davaliVekili}</td></tr>
  <tr><td class="bold">DAVA KONUSU</td><td>: ${davaKonusu}</td></tr>
  <tr><td class="bold">BİLİRKİŞİ</td><td>: ${bilirkisiAdi} (${bilirkisiUnvan}) - Sicil No: ${bilirkisiSicilNo}</td></tr>
  <tr><td class="bold">KEŞİF TARİHİ</td><td>: ${kesifTarihi}</td></tr>
  <tr><td class="bold">RAPOR TARİHİ</td><td>: ${raporTarihi}</td></tr>
</table>

<h2>I. İNCELEMENİN KONUSU VE KAPSAMI</h2>
<p>Sayın Mahkemenizin ${dosyaNo} sayılı dosyasında verilen ara kararı uyarınca; taraflar arasındaki uyuşmazlığın çözümü için bilirkişiliğimize tevdi edilen dosya içeriğindeki bilgi, belge, keşif tutanağı ve mahallinde yapılan gözlemler doğrultusunda ${davaKonusu} kapsamında teknik ve bilimsel inceleme yapılarak gerekçeli raporun tanzim edilmesidir.</p>

<h2>II. BİLİRKİŞİNİN CEVAPLAMASI GEREKEN TEKNİK SORULAR</h2>
<p>Sayın Mahkemenizce tarafımıza yöneltilen ve çözümü özel veya teknik bilgiyi gerektiren hususlar şunlardır:</p>
<ol>
  ${mahkemeSorulari.map((s) => `<li>${s}</li>`).join("")}
</ol>

<h2>III. DOSYA İNCELEMESİ VE DAYANAK RESMİ BELGELER</h2>
<p>Dosya münderecatında yer alan; tapu kayıtları, kadastro çap örneği, keşif tutanağı, ${parselIlce} İlçe Tarım ve Orman Müdürlüğü resmi münavebe maliyet cetvelleri, meteorolojik rasat bültenleri ve ilgili resmi kurum yazışmaları incelenerek değerlendirmeye esas alınmıştır.</p>

<h2>IV. MAHALLİNDE YAPILAN KEŞİF VE FİİLİ TESPİTLER</h2>
<p>${fiiliDurumAciklamasi}</p>
<table>
  <tr><th colspan="2">TAŞINMAZ / VARLIK TESPİT BİLGİLERİ</th></tr>
  <tr><td class="bold" style="width: 35%;">İli / İlçesi / Köyü</td><td>${parselIl} / ${parselIlce} / ${parselKoy}</td></tr>
  <tr><td class="bold">Ada / Parsel No</td><td>${adaNo} Ada / ${parselNo} Parsel</td></tr>
  <tr><td class="bold">Yüzölçümü</td><td>${alanM2.toLocaleString("tr-TR")} m² (${(alanM2 / 1000).toFixed(2)} da)</td></tr>
  <tr><td class="bold">Tarımsal Niteliği</td><td>${araziTipi === "sulu" ? "Sulu Mutlak Tarım Arazisi" : "Kuru Tarım Arazisi"}</td></tr>
  <tr><td class="bold">Toprak Profili ve Eğim</td><td>${toprakOzelligi} (Eğim: %${egimPct})</td></tr>
  <tr><td class="bold">Sulama Durumu</td><td>${sulamaKaynagi}</td></tr>
</table>

<h2>V. BİLİMSEL İNCELEME, METODOLOJİ VE MATEMATİKSEL HESAPLAMALAR</h2>
${
  selectedDava.alan === "tarim"
    ? `<p>2942 sayılı Kamulaştırma Kanunu'nun 11/f maddesi ve yerleşik Yargıtay 5. Hukuk Dairesi içtihatları gereğince tarım arazilerinin değerlemesinde 'Net Gelir Metodu' (Gelir Kapitalizasyonu) uygulanması yasal zorunluluktur. Bu yöntemde arazinin çıplak değeri formülü: <b>Değer (TL/da) = Yıllık Ortalama Net Gelir (R) / Kapitalizasyon Faiz Oranı (f)</b></p>
    
    <table>
      <thead>
        <tr>
          <th>Münavebe Yılı</th>
          <th>Münavebe Ürünü</th>
          <th>Ortalama Verim (kg/da)</th>
          <th>Satış Fiyatı (TL/kg)</th>
          <th>Gayrisafi Üretim Değeri (TL/da)</th>
          <th>Üretim Masrafı (TL/da)</th>
          <th>Net Gelir (TL/da)</th>
        </tr>
      </thead>
      <tbody>
        ${munavebeList
          .map((row) => {
            const gsud = row.verim * row.fiyat;
            const net = Math.max(0, gsud - row.masraf);
            return `<tr>
              <td class="text-center">${row.yil}. Yıl</td>
              <td>${row.urun}</td>
              <td class="text-right">${row.verim.toLocaleString("tr-TR")}</td>
              <td class="text-right">₺${row.fiyat.toFixed(2)}</td>
              <td class="text-right">₺${gsud.toLocaleString("tr-TR")}</td>
              <td class="text-right">₺${row.masraf.toLocaleString("tr-TR")}</td>
              <td class="text-right bold">₺${net.toLocaleString("tr-TR")}</td>
            </tr>`;
          })
          .join("")}
        <tr style="background-color: #fafafa;">
          <td colspan="6" class="bold text-right">YILLIK ORTALAMA NET GELİR (R):</td>
          <td class="bold text-right" style="color: #059669;">₺${ortalamaNetGelir.toLocaleString("tr-TR")} / da</td>
        </tr>
      </tbody>
    </table>

    <table>
      <tr><th colspan="2">GELİR KAPİTALİZASYONU DEĞERLEME ÖZETİ</th></tr>
      <tr><td class="bold" style="width: 50%;">Yıllık Ortalama Net Gelir (R)</td><td class="text-right">₺${ortalamaNetGelir.toLocaleString("tr-TR")} / da</td></tr>
      <tr><td class="bold">Kapitalizasyon Faiz Oranı (f)</td><td class="text-right">%${(kfo * 100).toFixed(0)} (${araziTipi === "sulu" ? "Sulu Arazi Normu %4-%5" : "Kuru Arazi Normu %5-%7"})</td></tr>
      <tr><td class="bold">Dekar Başına Çıplak Arazi Değeri (R / f)</td><td class="text-right">₺${((ortalamaNetGelir / kfo)).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} / da</td></tr>
      <tr><td class="bold">Çıplak Arazi m² Birim Değeri</td><td class="text-right">₺${ciplakM2Degeri.toFixed(2)} / m²</td></tr>
      <tr><td class="bold">Objektif Değer Artırıcı Unsurlar (ODA)</td><td class="text-right">+ %${odaPct} (Ulaşım, Yol Cephesi, Pazar Yakınlığı)</td></tr>
      <tr><td class="bold">Nihai Kamulaştırma m² Birim Değeri</td><td class="bold text-right" style="color: #059669;">₺${nihaiM2Degeri.toFixed(2)} / m²</td></tr>
      <tr style="background-color: #f0fdf4;"><td class="bold" style="font-size: 12pt;">TOPLAM TAŞINMAZ BEDELİ (${alanM2.toLocaleString("tr-TR")} m²)</td><td class="bold text-right" style="font-size: 13pt; color: #047857;">₺${toplamAraziDegeri.toLocaleString("tr-TR")}</td></tr>
    </table>`
    : selectedDava.alan === "hayvancilik"
    ? `<p>Türk Borçlar Kanunu'nun 49 ve 55. maddeleri uyarınca haksız fiilden doğan zararın belirlenmesinde hayvanların olay tarihindeki piyasa rayici, genetik ve damızlık özellikleri ile TBK m. 52/55 gereğince değerlendirilebilir hurda et bedelinin mahsubu dikkate alınmıştır.</p>
    <table>
      <tr><th colspan="2">HAYVAN TELEF VE ZARAR TAZMİNAT CETVELİ</th></tr>
      <tr><td class="bold" style="width: 50%;">Telef Olan Hayvan Cinsi / Irkı</td><td>${hayvanSayisi} Baş ${hayvanTuru}</td></tr>
      <tr><td class="bold">Ortalama Canlı Ağırlık</td><td>${canliAgirlikKg} kg/baş (Toplam: ${(hayvanSayisi * canliAgirlikKg).toLocaleString("tr-TR")} kg)</td></tr>
      <tr><td class="bold">Canlı Ağırlık Birim Rayici</td><td>₺${canliKgFiyat.toLocaleString("tr-TR")} / kg</td></tr>
      <tr><td class="bold">Hayvanların Piyasa Canlı Değeri</td><td class="text-right">₺${(hayvanSayisi * canliAgirlikKg * canliKgFiyat).toLocaleString("tr-TR")}</td></tr>
      <tr><td class="bold">Damızlık ve Soykütüğü Vasıf Değeri</td><td class="text-right">+ ₺${(hayvanSayisi * damizlikFark).toLocaleString("tr-TR")}</td></tr>
      <tr><td class="bold">Yoksun Kalınan Kâr (Laktasyon Süt / Yavru)</td><td class="text-right">+ ₺${yoksunKar.toLocaleString("tr-TR")}</td></tr>
      <tr><td class="bold">TBK m.52/55 Hurda (Kurtarma) Et Mahsubu</td><td class="text-right" style="color: #dc2626;">- ₺${hurdaMahsup.toLocaleString("tr-TR")}</td></tr>
      <tr style="background-color: #fef2f2;"><td class="bold" style="font-size: 12pt;">NET TEKNİK TAZMİNAT TUTARI</td><td class="bold text-right" style="font-size: 13pt; color: #b91c1c;">₺${toplamHayvanTazminat.toLocaleString("tr-TR")}</td></tr>
    </table>`
    : `<p>5996 sayılı Kanun ve ilgili Türk Gıda Kodeksi tebliğleri kapsamında yapılan incelemede, akredite laboratuvar test sonuçları gıda standartlarıyla karşılaştırılmıştır.</p>
    <table>
      <tr><th colspan="2">GIDA AYIP VE ZAYİAT HESAP CETVELİ</th></tr>
      <tr><td class="bold" style="width: 50%;">Uyuşmazlık Konusu Ürün Partisi</td><td>${gidaPartiMiktar.toLocaleString("tr-TR")} Litre / kg</td></tr>
      <tr><td class="bold">Birim Satış / Maliyet Bedeli</td><td>₺${gidaBirimMaliyet.toLocaleString("tr-TR")}</td></tr>
      <tr><td class="bold">Kritik Kalite Parametresi</td><td>${gidaTGKParametre}</td></tr>
      <tr><td class="bold">Tespit Edilen Fiili Analiz Değeri</td><td class="bold" style="color: #dc2626;">${gidaAnalizDegeri}</td></tr>
      <tr><td class="bold">Türk Gıda Kodeksi Yasal Sınırı</td><td>${gidaStandartDeger}</td></tr>
      <tr><td class="bold">Teknik Ayıp Oranı</td><td>%${gidaAyipOraniPct} (İmha / İade Zorunluluğu)</td></tr>
      <tr style="background-color: #fff7ed;"><td class="bold" style="font-size: 12pt;">HESAPLANAN AYIP VE ZAYİAT TUTARI</td><td class="bold text-right" style="font-size: 13pt; color: #c2410c;">₺${toplamGidaZarari.toLocaleString("tr-TR")}</td></tr>
    </table>`
}

<h2>VI. HMK 279 UYUMLU SONUÇ VE KANAAT</h2>
<p style="white-space: pre-line;">${generatedKanaatMetni}</p>

<h2>VII. İMZA VE EKLER LİSTESİ</h2>
<p>İşbu rapor 3 (üç) nüsha olarak tanzim edilmiş olup, bir nüshası ıslak imzalı/e-imzalı olarak dosyasında saklanmak üzere Sayın Mahkemenize saygıyla arz olunur.</p>

<p><b>Ekler:</b><br>
1. Mahallinde çekilen fotoğraflar ve uydu görüntüleri albümü<br>
2. İlçe Tarım ve Orman Müdürlüğü resmi münavebe maliyet cetveli onaylı örneği<br>
3. Kadastro çapı ve aplikasyon krokisi<br>
4. Bilirkişi yetki belgesi ve oda tescil belgesi</p>

<div class="signature-box">
  <p><b>${bilirkisiAdi}</b><br>
  ${bilirkisiUnvan}<br>
  Sicil No: ${bilirkisiSicilNo}<br>
  (e-İmzalıdır)</p>
</div>

</body>
</html>`;
  }, [
    dosyaNo,
    mahkemeAdi,
    davaci,
    davaciVekili,
    davali,
    davaliVekili,
    davaKonusu,
    bilirkisiAdi,
    bilirkisiUnvan,
    bilirkisiSicilNo,
    kesifTarihi,
    raporTarihi,
    mahkemeSorulari,
    fiiliDurumAciklamasi,
    parselIl,
    parselIlce,
    parselKoy,
    adaNo,
    parselNo,
    alanM2,
    araziTipi,
    toprakOzelligi,
    egimPct,
    sulamaKaynagi,
    selectedDava.alan,
    munavebeList,
    ortalamaNetGelir,
    kfo,
    ciplakM2Degeri,
    odaPct,
    nihaiM2Degeri,
    toplamAraziDegeri,
    hayvanSayisi,
    hayvanTuru,
    canliAgirlikKg,
    canliKgFiyat,
    damizlikFark,
    yoksunKar,
    hurdaMahsup,
    toplamHayvanTazminat,
    gidaPartiMiktar,
    gidaBirimMaliyet,
    gidaTGKParametre,
    gidaAnalizDegeri,
    gidaStandartDeger,
    gidaAyipOraniPct,
    toplamGidaZarari,
    generatedKanaatMetni,
  ]);

  // Word (.doc formatında HTML tabanlı) indirme
  const handleDownloadWordDoc = () => {
    const blob = new Blob(["\ufeff" + fullOfficialReportHtml], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bilirkisi_Raporu_${dosyaNo.replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📄 Word (.doc) raporu indirildi");
  };

  // Panoya Kopyalama
  const handleCopyReportText = () => {
    // Düz metin olarak panoya kopyala
    const plainText = fullOfficialReportHtml
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    navigator.clipboard.writeText(plainText).then(() => {
      showToast("📋 Rapor metni panoya kopyalandı");
    });
  };

  // Yazdır / PDF
  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Yazdırma penceresi açılamadı");
      return;
    }
    printWindow.document.write(fullOfficialReportHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* BAŞLIK & METODOLOJİ HERO BANNER */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Scale size={240} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              T.C. ADALET BAKANLIĞI STANDARTLARINDA
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30">
              HMK 266-287 & 6754 S.K.
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
              ZİRAAT • GIDA • HAYVANCILIK
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Adım Adım Bilirkişi Raporu Otomasyonu
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base max-w-3xl mt-1.5 leading-relaxed">
              İlk defa bilirkişi raporu yazacak meslektaşlarımız için gerçek rapor
              deneyimlerinden derlenen metodoloji, yasal soru şablonları, gelir
              kapitalizasyonu ve HMK 279 kusur denetimi ile donatılmış rehberli raporlama aracı.
            </p>
          </div>

          {/* Hızlı Başlangıç Butonları */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            {DAVA_TURLERI_DB.map((dava) => (
              <button
                key={dava.id}
                onClick={() => handleSelectDavaTuru(dava.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                  selectedDavaId === dava.id
                    ? "bg-white text-emerald-900 border-white shadow-md font-bold"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
              >
                {dava.alan === "tarim" ? (
                  <Sprout size={13} className="text-emerald-300" />
                ) : dava.alan === "hayvancilik" ? (
                  <Beef size={13} className="text-amber-300" />
                ) : (
                  <FlaskConical size={13} className="text-teal-300" />
                )}
                <span>{dava.kisaltma}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ADIM İLERLEME ÇUBUĞU (WIZARD STEPS) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { step: 1, title: "1. Mahkeme & Künye", icon: <FileText size={16} /> },
            { step: 2, title: "2. Dava & Şablon", icon: <BookOpen size={16} /> },
            { step: 3, title: "3. Keşif & Tespit", icon: <MapPin size={16} /> },
            { step: 4, title: "4. Bilimsel Hesap", icon: <Calculator size={16} /> },
            { step: 5, title: "5. HMK 279 Denetimi", icon: <ShieldAlert size={16} /> },
            { step: 6, title: "6. Resmi Rapor", icon: <FileCheck size={16} /> },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                currentStep === item.step
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : currentStep > item.step
                  ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] ${
                  currentStep === item.step
                    ? "bg-emerald-600 text-white"
                    : currentStep > item.step
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {currentStep > item.step ? <Check size={12} /> : item.step}
              </span>
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ADIM 1: MAHKEME VE GÖREVLENDİRME KÜNYESİ */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-emerald-600" />
                Adım 1: Mahkeme Görevlendirmesi ve Dosya Künyesi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                UYAP Bilirkişi Portalından gelen tensip/ara kararındaki bilgileri eksiksiz giriniz.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Adalet Bakanlığı Şablonu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mahkeme Adı
              </label>
              <input
                type="text"
                value={mahkemeAdi}
                onChange={(e) => setMahkemeAdi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dosya Esas No
              </label>
              <input
                type="text"
                value={dosyaNo}
                onChange={(e) => setDosyaNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dava Konusu
              </label>
              <input
                type="text"
                value={davaKonusu}
                onChange={(e) => setDavaKonusu(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Davacı Adı / Unvanı
              </label>
              <input
                type="text"
                value={davaci}
                onChange={(e) => setDavaci(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Davacı Vekili
              </label>
              <input
                type="text"
                value={davaciVekili}
                onChange={(e) => setDavaciVekili(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Davalı Adı / Unvanı
              </label>
              <input
                type="text"
                value={davali}
                onChange={(e) => setDavali(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Davalı Vekili
              </label>
              <input
                type="text"
                value={davaliVekili}
                onChange={(e) => setDavaliVekili(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bilirkişi Adı Soyadı
              </label>
              <input
                type="text"
                value={bilirkisiAdi}
                onChange={(e) => setBilirkisiAdi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bilirkişi Unvanı / Uzmanlık Alanı
              </label>
              <input
                type="text"
                value={bilirkisiUnvan}
                onChange={(e) => setBilirkisiUnvan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bilirkişilik Bölge Kurulu Sicil No
              </label>
              <input
                type="text"
                value={bilirkisiSicilNo}
                onChange={(e) => setBilirkisiSicilNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Keşif Tarihi
              </label>
              <input
                type="date"
                value={kesifTarihi}
                onChange={(e) => setKesifTarihi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Rapor Tanzim Tarihi
              </label>
              <input
                type="date"
                value={raporTarihi}
                onChange={(e) => setRaporTarihi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Mahkemenin Cevaplamasını İstediği Sorular */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Gavel size={14} className="text-emerald-600" />
                Mahkemenin Bilirkişiden Cevaplamasını İstediği Teknik Sorular
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                (HMK m. 273/1 gereği sadece bu sorulara odaklanılmalıdır)
              </span>
            </div>

            <div className="space-y-2">
              {mahkemeSorulari.map((soru, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    Soru {idx + 1}:
                  </span>
                  <span className="flex-1 text-slate-700 dark:text-slate-200">{soru}</span>
                  <button
                    onClick={() => handleRemoveSoru(idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Soruyu Sil"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Mahkemenin ara kararındaki yeni bir soruyu yazın..."
                value={yeniSoruInput}
                onChange={(e) => setYeniSoruInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSoru()}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
              <button
                onClick={handleAddSoru}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus size={14} /> Soru Ekle
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              Sonraki Adım: Dava Türü & Şablon <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 2: UZMANLIK ALANI & DAVA TÜRÜ ŞABLONU */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="text-emerald-600" />
              Adım 2: Uzmanlık Alanı ve Dava Türü Şablonu Seçimi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Raporunuzun yasal dayanağını ve metodolojisini belirleyin. Her şablon ilgili mevzuat ve yerleşik içtihatlara göre özel formüller içerir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAVA_TURLERI_DB.map((dava) => (
              <div
                key={dava.id}
                onClick={() => handleSelectDavaTuru(dava.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  selectedDavaId === dava.id
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        dava.alan === "tarim"
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                          : dava.alan === "hayvancilik"
                          ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300"
                          : "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300"
                      }`}
                    >
                      {dava.alan === "tarim"
                        ? "01 Tarım"
                        : dava.alan === "hayvancilik"
                        ? "02 Hayvancılık"
                        : "26 Gıda"}
                    </span>
                    {selectedDavaId === dava.id && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {dava.ad}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3">
                    {dava.aciklama}
                  </p>

                  <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-xl">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Yasal Dayanak:</span>{" "}
                    {dava.kanunMaddesi}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>{selectedDavaId === dava.id ? "Seçili Şablon" : "Şablonu Seç"}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              Sonraki Adım: Keşif & Fiili Durum <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 3: KEŞİF VE FİİLİ DURUM TESPİTİ REHBERİ */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="text-emerald-600" />
              Adım 3: Keşif ve Fiili Durum Tespiti Rehberi (Saha Eğitimi)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Bilirkişi keşifte arazinin/varlığın yerinde bizzat incelemesini yapmalı, fenolojik ve agronomik gözlemleri rapora aktarmalıdır.
            </p>
          </div>

          {/* Keşif Bilgi Kartı & Kontrol Listesi */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={15} className="text-amber-600" />
              {selectedDava.kesifRehberi.baslik}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  🔍 Sahada Mutlaka Yapılması Gerekenler:
                </p>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDava.kesifRehberi.yapilacaklar.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  ⚠️ Bilirkişinin Kaçınması Gereken Hatalar:
                </p>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDava.kesifRehberi.dikkatEdilecekler.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Saha Giriş Formu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                İl
              </label>
              <input
                type="text"
                value={parselIl}
                onChange={(e) => setParselIl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                İlçe
              </label>
              <input
                type="text"
                value={parselIlce}
                onChange={(e) => setParselIlce(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Köy / Mahalle
              </label>
              <input
                type="text"
                value={parselKoy}
                onChange={(e) => setParselKoy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ada / Parsel
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ada"
                  value={adaNo}
                  onChange={(e) => setAdaNo(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Parsel"
                  value={parselNo}
                  onChange={(e) => setParselNo(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Yüzölçümü (m²)
              </label>
              <input
                type="number"
                value={alanM2}
                onChange={(e) => setAlanM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tarımsal Vasıf
              </label>
              <select
                value={araziTipi}
                onChange={(e) => setAraziTipi(e.target.value as "sulu" | "kuru")}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="sulu">Sulu Mutlak Tarım Arazisi</option>
                <option value="kuru">Kuru Tarım Arazisi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Eğim (%)
              </label>
              <input
                type="number"
                value={egimPct}
                onChange={(e) => setEgimPct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sulama Kaynağı
              </label>
              <input
                type="text"
                value={sulamaKaynagi}
                onChange={(e) => setSulamaKaynagi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Toprak Profili & Agronomik Özellikler
            </label>
            <input
              type="text"
              value={toprakOzelligi}
              onChange={(e) => setToprakOzelligi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mahallinde Yapılan Keşif ve Fiili Durum Açıklaması (Rapordaki Metin)
            </label>
            <textarea
              rows={4}
              value={fiiliDurumAciklamasi}
              onChange={(e) => setFiiliDurumAciklamasi(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              Sonraki Adım: Bilimsel Hesaplama <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 4: BİLİMSEL İNCELEME & MATEMATİKSEL HESAPLAMA MOTORU */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="text-emerald-600" />
              Adım 4: Bilimsel Metodoloji ve Matematiksel Hesaplama Motoru
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedDava.alan === "tarim"
                ? "2942 s.K. m. 11/f gereği Net Gelir Kapitalizasyonu formülü ile hesaplama."
                : selectedDava.alan === "hayvancilik"
                ? "TBK m. 49, 52 ve 55 uyarınca Piyasa Rayici, Yoksun Kalınan Kâr ve Hurda Et Mahsubu."
                : "TGK standart sınırları, laboratuvar sapma derecesi ve ayıp zayiat hesabı."}
            </p>
          </div>

          {/* TARIM HESAPLAMA BÖLÜMÜ */}
          {selectedDava.alan === "tarim" && (
            <div className="space-y-5">
              {/* Münavebe Tablosu */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Wheat size={14} className="text-emerald-600" />
                    Bölgesel Münavebe (Ekim Nöbeti) Maliyet ve Net Gelir Cetveli
                  </h3>
                  <button
                    onClick={handleAddMunavebeRow}
                    className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1"
                  >
                    <Plus size={13} /> Münavebe Yılı Ekle
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3 text-center">Yıl</th>
                        <th className="p-3">Münavebe Ürünü</th>
                        <th className="p-3 text-right">Verim (kg/da)</th>
                        <th className="p-3 text-right">Satış Fiyatı (₺/kg)</th>
                        <th className="p-3 text-right">GSÜD (₺/da)</th>
                        <th className="p-3 text-right">Üretim Masrafı (₺/da)</th>
                        <th className="p-3 text-right">Net Gelir (₺/da)</th>
                        <th className="p-3 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {munavebeList.map((row, idx) => {
                        const gsud = row.verim * row.fiyat;
                        const net = Math.max(0, gsud - row.masraf);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-3 text-center font-bold text-slate-500">
                              {row.yil}. Yıl
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={row.urun}
                                onChange={(e) =>
                                  handleUpdateMunavebe(idx, "urun", e.target.value)
                                }
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                              />
                            </td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                value={row.verim}
                                onChange={(e) =>
                                  handleUpdateMunavebe(idx, "verim", Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                step="0.1"
                                value={row.fiyat}
                                onChange={(e) =>
                                  handleUpdateMunavebe(idx, "fiyat", Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                              ₺{gsud.toLocaleString("tr-TR")}
                            </td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                value={row.masraf}
                                onChange={(e) =>
                                  handleUpdateMunavebe(idx, "masraf", Number(e.target.value))
                                }
                                className="w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right text-xs"
                              />
                            </td>
                            <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                              ₺{net.toLocaleString("tr-TR")}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoveMunavebeRow(idx)}
                                className="text-slate-400 hover:text-red-500 p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-emerald-50/50 dark:bg-emerald-950/20 font-bold border-t border-slate-200 dark:border-slate-700">
                      <tr>
                        <td colSpan={6} className="p-3 text-right text-slate-800 dark:text-slate-200">
                          YILLIK ORTALAMA NET GELİR (R):
                        </td>
                        <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 text-sm">
                          ₺{ortalamaNetGelir.toLocaleString("tr-TR")} / da
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* KFO & ODA Seçicileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Kapitalizasyon Faiz Oranı (f)
                    </label>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      %{(kfo * 100).toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.04"
                    max="0.08"
                    step="0.005"
                    value={kfo}
                    onChange={(e) => setKfo(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sulu tarım arazilerinde yerleşik Yargıtay normu %4 - %5 (0.04-0.05); kuru arazilerde %5 - %7 (0.05-0.07)'dir.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Objektif Değer Artışı (ODA)
                    </label>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      +{odaPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={odaPct}
                    onChange={(e) => setOdaPct(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ana yola cephe, pazara yakınlık, geometrik düzgünlük gibi somut faktörlere dayanmalıdır.
                  </p>
                </div>
              </div>

              {/* Hesaplama Sonuç Kartı */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-slate-500/10 p-5 rounded-2xl border border-emerald-500/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Çıplak m² Değeri
                  </div>
                  <div className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">
                    ₺{ciplakM2Degeri.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Nihai m² Değeri (ODA Dahil)
                  </div>
                  <div className="text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    ₺{nihaiM2Degeri.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Parsel Yüzölçümü
                  </div>
                  <div className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">
                    {alanM2.toLocaleString("tr-TR")} m²
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Toplam Kamulaştırma Bedeli
                  </div>
                  <div className="text-lg md:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₺{toplamAraziDegeri.toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HAYVANCILIK HESAPLAMA BÖLÜMÜ */}
          {selectedDava.alan === "hayvancilik" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hayvan Sayısı (Baş)
                  </label>
                  <input
                    type="number"
                    value={hayvanSayisi}
                    onChange={(e) => setHayvanSayisi(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ortalama Canlı Ağırlık (kg/baş)
                  </label>
                  <input
                    type="number"
                    value={canliAgirlikKg}
                    onChange={(e) => setCanliAgirlikKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Canlı Kg Rayiç Fiyatı (₺/kg)
                  </label>
                  <input
                    type="number"
                    value={canliKgFiyat}
                    onChange={(e) => setCanliKgFiyat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Damızlık / Soykütüğü Farkı (₺/baş)
                  </label>
                  <input
                    type="number"
                    value={damizlikFark}
                    onChange={(e) => setDamizlikFark(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Yoksun Kalınan Kâr (Süt/Yavru) (₺)
                  </label>
                  <input
                    type="number"
                    value={yoksunKar}
                    onChange={(e) => setYoksunKar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                    TBK m.52/55 Hurda (Kurtarma) Et Mahsubu (₺)
                  </label>
                  <input
                    type="number"
                    value={hurdaMahsup}
                    onChange={(e) => setHurdaMahsup(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 text-xs font-medium text-red-700 dark:text-red-300"
                  />
                </div>
              </div>

              {/* Sonuç Kartı */}
              <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 p-5 rounded-2xl border border-amber-500/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Canlı Değer</div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                    ₺{(hayvanSayisi * canliAgirlikKg * canliKgFiyat).toLocaleString("tr-TR")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Damızlık + Kâr</div>
                  <div className="text-base font-bold text-amber-600 dark:text-amber-400">
                    + ₺{(hayvanSayisi * damizlikFark + yoksunKar).toLocaleString("tr-TR")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Hurda Mahsubu</div>
                  <div className="text-base font-bold text-red-600 dark:text-red-400">
                    - ₺{hurdaMahsup.toLocaleString("tr-TR")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Net Teknik Tazminat</div>
                  <div className="text-xl font-extrabold text-amber-700 dark:text-amber-400">
                    ₺{toplamHayvanTazminat.toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GIDA HESAPLAMA BÖLÜMÜ */}
          {selectedDava.alan === "gida" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parti Miktarı (Litre / kg)
                  </label>
                  <input
                    type="number"
                    value={gidaPartiMiktar}
                    onChange={(e) => setGidaPartiMiktar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Birim Satış / Maliyet Bedeli (₺)
                  </label>
                  <input
                    type="number"
                    value={gidaBirimMaliyet}
                    onChange={(e) => setGidaBirimMaliyet(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ayıp Oranı (%)
                  </label>
                  <input
                    type="number"
                    value={gidaAyipOraniPct}
                    onChange={(e) => setGidaAyipOraniPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kritik Kalite Parametresi
                  </label>
                  <input
                    type="text"
                    value={gidaTGKParametre}
                    onChange={(e) => setGidaTGKParametre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                    Tespit Edilen Fiili Analiz Değeri
                  </label>
                  <input
                    type="text"
                    value={gidaAnalizDegeri}
                    onChange={(e) => setGidaAnalizDegeri(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 text-xs font-medium text-red-700 dark:text-red-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Türk Gıda Kodeksi Yasal Sınırı
                  </label>
                  <input
                    type="text"
                    value={gidaStandartDeger}
                    onChange={(e) => setGidaStandartDeger(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Sonuç Kartı */}
              <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-slate-500/10 p-5 rounded-2xl border border-teal-500/30 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Toplam Parti Bedeli</div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                    ₺{(gidaPartiMiktar * gidaBirimMaliyet).toLocaleString("tr-TR")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Ayıp / Zayiat Oranı</div>
                  <div className="text-base font-bold text-amber-600 dark:text-amber-400">
                    %{gidaAyipOraniPct}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Hesaplanan Teknik Zarar</div>
                  <div className="text-xl font-extrabold text-teal-700 dark:text-teal-400">
                    ₺{toplamGidaZarari.toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              Sonraki Adım: HMK 279 Kusur Denetimi <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 5: HMK 279 HUKUKİ AŞIM VE KUSUR DENETİM MOTORU */}
      {currentStep === 5 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-emerald-600" />
              Adım 5: HMK m. 279/4 & 6754 s.K. m. 3/2 Kusur ve Hukuki Aşım Denetimi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "Bilirkişi, raporunda hâkim tarafından yapılması gereken hukuki nitelendirme ve değerlendirmelerde bulunamaz, kusur dağıtamaz."
            </p>
          </div>

          {/* Uyum Skoru Göstergesi */}
          <div
            className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
              hmkScanResult.score === 100
                ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                : "bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                  hmkScanResult.score === 100
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-red-600 text-white shadow-md shadow-red-500/20"
                }`}
              >
                {hmkScanResult.score}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {hmkScanResult.score === 100
                    ? "Mükemmel! Rapor HMK 279 Standartlarına Tam Uyumlu"
                    : `Dikkat! Raporda ${hmkScanResult.found.length} Adet Hukuki Aşım / Kusur İfadesi Tespit Edildi`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {hmkScanResult.score === 100
                    ? "Metinde hâkimin yetkisine giren herhangi bir hukuki yorum veya kusur belirlemesi bulunmamaktadır."
                    : "Aşağıdaki ifadeleri teknik tespit diliyle değiştiriniz veya 'Teknik Dille Temizle' butonunu kullanınız."}
                </p>
              </div>
            </div>

            {hmkScanResult.score < 100 && (
              <button
                onClick={handleApplyHmkFix}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
              >
                <Sparkles size={14} /> Teknik Dille Otomatik Temizle
              </button>
            )}
          </div>

          {/* Tespit Edilen İhlaller Listesi */}
          {hmkScanResult.found.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                Yasaklı Hukuki Terimler ve Teknik Alternatifleri
              </h4>
              <div className="space-y-2">
                {hmkScanResult.found.map((kural, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                        <AlertTriangle size={13} />
                        Yasaklı İfade: "{kural.yasakliKelime}"
                      </span>
                      <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-md">
                        {kural.kategori}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{kural.uyariMesaji}</p>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 font-medium">
                      <span className="font-bold">Önerilen Teknik İfade:</span> {kural.onerilenTeknikIfade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Düzenlenebilir Kanaat Metni */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Raporda Yer Alacak Sonuç ve Kanaat Metni (Düzenlenebilir)
            </label>
            <textarea
              rows={8}
              value={generatedKanaatMetni}
              onChange={(e) => setCustomKanaatMetni(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              Sonraki Adım: Resmi Rapor Çıktısı <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 6: RESMİ FORMATLI RAPOR ÖNİZLEME & ÇIKTI */}
      {currentStep === 6 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="text-emerald-600" />
                Adım 6: Resmi Şablonlu Bilirkişi Raporu ve İndirme Seçenekleri
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Adalet Bakanlığı Bilirkişilik Daire Başkanlığı standartlarına ve UYAP sistemine tam uyumlu nihai rapor çıktısı.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadWordDoc}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download size={14} /> Word (.doc) İndir
              </button>

              <button
                onClick={handlePrintReport}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Printer size={14} /> Yazdır / PDF
              </button>

              <button
                onClick={handleCopyReportText}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Copy size={14} /> Metni Kopyala
              </button>
            </div>
          </div>

          {/* Rapor Önizleme Kağıdı (A4 Doküman Görünümü) */}
          <div className="bg-slate-100 dark:bg-slate-950 p-4 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="max-w-4xl mx-auto bg-white text-slate-900 shadow-xl p-8 md:p-12 rounded-xl border border-slate-200 space-y-6 font-serif text-xs md:text-sm leading-relaxed">
              {/* Başlık */}
              <div className="text-center font-bold text-base md:text-lg border-b pb-4">
                T.C.<br />
                {mahkemeAdi.toUpperCase()}<br />
                SAYIN HAKİMLİĞİ'NE
              </div>

              {/* Künye Tablosu */}
              <div className="border border-slate-300 text-xs">
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DOSYA ESAS NO</span>
                  <span className="col-span-2">: {dosyaNo}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DAVACI & VEKİLİ</span>
                  <span className="col-span-2">: {davaci} ({davaciVekili})</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DAVALI & VEKİLİ</span>
                  <span className="col-span-2">: {davali} ({davaliVekili})</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">DAVA KONUSU</span>
                  <span className="col-span-2">: {davaKonusu}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 p-2">
                  <span className="font-bold">BİLİRKİŞİ</span>
                  <span className="col-span-2">: {bilirkisiAdi} - Sicil No: {bilirkisiSicilNo}</span>
                </div>
                <div className="grid grid-cols-3 p-2">
                  <span className="font-bold">KEŞİF / RAPOR TARİHİ</span>
                  <span className="col-span-2">: Keşif: {kesifTarihi} / Rapor: {raporTarihi}</span>
                </div>
              </div>

              {/* Bölüm I */}
              <div>
                <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1 mb-2">
                  I. İNCELEMENİN KONUSU VE KAPSAMI
                </h3>
                <p>
                  Sayın Mahkemenizin {dosyaNo} sayılı dosyasında verilen ara kararı uyarınca; {davaKonusu} kapsamında taşınmazın / varlığın mahallinde yapılan keşif ve dosyadaki resmi deliller çerçevesinde bilimsel değerleme yapılmasıdır.
                </p>
              </div>

              {/* Bölüm II */}
              <div>
                <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1 mb-2">
                  II. BİLİRKİŞİNİN CEVAPLAMASI GEREKEN TEKNİK SORULAR
                </h3>
                <ol className="list-decimal list-inside space-y-1">
                  {mahkemeSorulari.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              {/* Bölüm III */}
              <div>
                <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1 mb-2">
                  III. MAHALLİNDE YAPILAN KEŞİF VE FİİLİ TESPİTLER
                </h3>
                <p>{fiiliDurumAciklamasi}</p>
                <div className="mt-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                  <b>Konum:</b> {parselIl} / {parselIlce} / {parselKoy} | <b>Ada/Parsel:</b> {adaNo}/{parselNo} | <b>Alan:</b> {alanM2.toLocaleString("tr-TR")} m² | <b>Vasıf:</b> {araziTipi === "sulu" ? "Sulu Tarla" : "Kuru Tarla"} (Eğim: %{egimPct})
                </div>
              </div>

              {/* Bölüm IV */}
              <div>
                <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1 mb-2">
                  IV. BİLİMSEL İNCELEME VE MATEMATİKSEL DEĞERLEME
                </h3>
                {selectedDava.alan === "tarim" ? (
                  <div className="space-y-3">
                    <p className="text-xs">
                      2942 s.K. m. 11 uyarınca uygulanan Net Gelir Kapitalizasyonu sonucunda yıllık ortalama net gelir <b>₺{ortalamaNetGelir.toLocaleString("tr-TR")}/da</b>, kapitalizasyon faiz oranı <b>%{(kfo * 100).toFixed(0)}</b> ve objektif değer artışı <b>+{odaPct}%</b> olarak takdir edilmiştir.
                    </p>
                    <div className="p-3 bg-emerald-50 rounded border border-emerald-200 font-sans text-xs flex justify-between items-center">
                      <span>M² Birim Değeri: <b>₺{nihaiM2Degeri.toFixed(2)}</b></span>
                      <span className="font-bold text-emerald-800 text-sm">
                        TOPLAM BEDEL: ₺{toplamAraziDegeri.toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                ) : selectedDava.alan === "hayvancilik" ? (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 font-sans text-xs flex justify-between items-center">
                    <span>Telef + Kâr - Hurda Mahsubu</span>
                    <span className="font-bold text-amber-800 text-sm">
                      NET TEKNİK ZARAR: ₺{toplamHayvanTazminat.toLocaleString("tr-TR")}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-teal-50 rounded border border-teal-200 font-sans text-xs flex justify-between items-center">
                    <span>TGK Standardı Aşımı & Ayıp Oranı (%{gidaAyipOraniPct})</span>
                    <span className="font-bold text-teal-800 text-sm">
                      ZAYİAT BEDELİ: ₺{toplamGidaZarari.toLocaleString("tr-TR")}
                    </span>
                  </div>
                )}
              </div>

              {/* Bölüm V */}
              <div>
                <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1 mb-2">
                  V. HMK 279 UYUMLU SONUÇ VE KANAAT
                </h3>
                <p className="whitespace-pre-line">{generatedKanaatMetni}</p>
              </div>

              {/* İmza Bloğu */}
              <div className="pt-8 text-right font-sans text-xs">
                <p className="font-bold text-sm">{bilirkisiAdi}</p>
                <p className="text-slate-600">{bilirkisiUnvan}</p>
                <p className="text-slate-500">Bilirkişi Sicil No: {bilirkisiSicilNo}</p>
                <p className="text-emerald-700 font-bold mt-1">(e-İmzalıdır)</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Önceki Adım
            </button>
            <button
              onClick={() => {
                handleDownloadWordDoc();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Download size={14} /> Raporu Word Olarak İndir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

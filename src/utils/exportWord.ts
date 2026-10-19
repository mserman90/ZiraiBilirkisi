import { BilirKisiRaporu, BilirKisiProfili, YEDI_ADIM_TANIMLARI, VARSAYILAN_UZMAN_PROFILI } from "../data/fields";

/**
 * Bilirkişi Raporunu Word Uyumlu Belge (.doc) Olarak Dışa Aktarır
 * Microsoft Word ve UYAP UDF uyumlu HTML tabanlı MSO belgesi üretir.
 */
export function exportReportToWord(
  rapor: BilirKisiRaporu,
  profil: BilirKisiProfili = VARSAYILAN_UZMAN_PROFILI
): void {
  const dosyaAdiTemiz = (rapor.dosyaNo || "Rapor").replace(/[\/\\?%*:|"<>]/g, "_");
  const fileName = `Bilirkisi_Raporu_${dosyaAdiTemiz}.doc`;

  // 7 Adım İçeriklerinin Oluşturulması
  let bolumlerHtml = "";
  for (let i = 1; i <= 7; i++) {
    const adim = YEDI_ADIM_TANIMLARI.find((a) => a.no === i);
    const metin = rapor.bolumMetinleri?.[i] || adim?.varsayilanMetin || "";
    const paragraflar = metin
      .split("\n")
      .filter((p) => p.trim().length > 0)
      .map((p) => `<p style="margin: 6pt 0; text-indent: 1.25cm; text-align: justify; line-height: 1.5;">${escapeHtml(p)}</p>`)
      .join("");

    bolumlerHtml += `
      <div style="margin-top: 18pt; margin-bottom: 8pt;">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 13pt; font-weight: bold; color: #000000; margin-bottom: 4pt; border-bottom: 1pt solid #000000; padding-bottom: 2pt;">
          ${i}. ${adim?.tamBaslik.toUpperCase()}
        </h3>
        <div style="font-size: 11pt; font-family: 'Times New Roman', serif; color: #111111;">
          ${paragraflar || "<p style='font-style: italic; color: #666666;'>Bu bölüme ait metin girilmemiştir.</p>"}
        </div>
      </div>
    `;
  }

  // Ekler Listesi Tablosu
  let eklerHtml = "";
  if (rapor.ekler && rapor.ekler.length > 0) {
    const ekSatirlari = rapor.ekler
      .map(
        (ek, idx) => `
        <tr>
          <td style="border: 1pt solid #333333; padding: 4pt 6pt; font-size: 10pt; text-align: center;">Ek-${idx + 1}</td>
          <td style="border: 1pt solid #333333; padding: 4pt 6pt; font-size: 10pt; font-weight: bold;">${escapeHtml(ek.ad)}</td>
          <td style="border: 1pt solid #333333; padding: 4pt 6pt; font-size: 10pt;">${escapeHtml(ek.tur.toUpperCase())}</td>
          <td style="border: 1pt solid #333333; padding: 4pt 6pt; font-size: 10pt;">${escapeHtml(ek.dosyaAdi)} (${ek.boyut})</td>
        </tr>
      `
      )
      .join("");

    eklerHtml = `
      <div style="margin-top: 20pt; page-break-inside: avoid;">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 12pt; font-weight: bold; margin-bottom: 6pt;">
          RAPOR EKLERİ DİZELGESİ
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 4pt;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1pt solid #333333; padding: 4pt; font-size: 10pt; width: 12%;">Ek No</th>
              <th style="border: 1pt solid #333333; padding: 4pt; font-size: 10pt; width: 38%;">Belge Adı</th>
              <th style="border: 1pt solid #333333; padding: 4pt; font-size: 10pt; width: 20%;">Türü</th>
              <th style="border: 1pt solid #333333; padding: 4pt; font-size: 10pt; width: 30%;">Dosya Bilgisi</th>
            </tr>
          </thead>
          <tbody>
            ${ekSatirlari}
          </tbody>
        </table>
      </div>
    `;
  }

  // Word Uyumlu HTML Şablonu
  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(rapor.baslik)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: A4 portrait;
          margin: 2.5cm 2.0cm 2.5cm 2.5cm;
          mso-header-margin: 1.25cm;
          mso-footer-margin: 1.25cm;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000000;
        }
        h1, h2, h3, h4 {
          font-family: 'Times New Roman', serif;
        }
      </style>
    </head>
    <body style="font-family: 'Times New Roman', serif;">
      <!-- Mahkeme Başlığı -->
      <div style="text-align: center; margin-bottom: 16pt;">
        <h2 style="font-size: 14pt; font-weight: bold; margin: 0; text-transform: uppercase;">
          ${escapeHtml(rapor.mahkeme || "T.C. ASLİYE HUKUK MAHKEMESİ HÂKİMLİĞİ'NE")}
        </h2>
        <p style="font-size: 12pt; font-weight: bold; margin-top: 4pt;">
          ESAS NO: ${escapeHtml(rapor.dosyaNo)}
        </p>
      </div>

      <!-- Künye Tablosu -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16pt; font-size: 11pt;">
        <tr>
          <td style="width: 25%; font-weight: bold; padding: 3pt 0;">DAVACI</td>
          <td style="width: 3%;">:</td>
          <td style="width: 72%;">${escapeHtml(rapor.tarafBilgisi.split("/")[0]?.trim() || "Davacı")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 3pt 0;">DAVALI</td>
          <td>:</td>
          <td>${escapeHtml(rapor.tarafBilgisi.split("/")[1]?.trim() || "Davalı")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 3pt 0;">DAVA KONUSU</td>
          <td>:</td>
          <td>${escapeHtml(rapor.davaTuru)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 3pt 0;">KEŞİF TARİHİ</td>
          <td>:</td>
          <td>${escapeHtml(rapor.kesifTarihi)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 3pt 0;">RAPOR KONUSU</td>
          <td>:</td>
          <td>${escapeHtml(rapor.baslik)}</td>
        </tr>
      </table>

      <!-- 7 Adımlı Rapor Gövdesi -->
      ${bolumlerHtml}

      <!-- Ekler Dizelgesi -->
      ${eklerHtml}

      <!-- İmza Bloğu -->
      <div style="margin-top: 36pt; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%;"></td>
            <td style="width: 50%; text-align: center;">
              <p style="margin: 0; font-size: 11pt; font-weight: bold;">BİLİRKİŞİ HEYETİ / UZMANI</p>
              <p style="margin: 4pt 0 0 0; font-size: 11pt; font-weight: bold;">${escapeHtml(profil.adSoyad)}</p>
              <p style="margin: 2pt 0 0 0; font-size: 10pt; color: #333333;">${escapeHtml(profil.unvan)}</p>
              <p style="margin: 2pt 0 0 0; font-size: 10pt; color: #555555;">Sicil No: ${escapeHtml(profil.sicilNo)} • Oda No: ${escapeHtml(profil.odaSicilNo)}</p>
              <div style="height: 40pt;"></div>
              <p style="margin: 0; font-size: 10pt; color: #666666;">(e-İmzalıdır / Islak İmzalıdır)</p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  // Blob oluşturma ve tetikleme
  const blob = new Blob(["\ufeff", docHtml], {
    type: "application/msword;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

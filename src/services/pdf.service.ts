import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { IApplication, IMark } from '@/types/application';
import fs from 'fs';
import path from 'path';

async function fetchImageAsBase64(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('Failed to fetch image:', url, err);
    return null;
  }
}

function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return isNaN(age) ? 0 : age;
}

export class PdfService {
  static async generateApplicationPDF(application: IApplication): Promise<ArrayBuffer> {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [43, 53, 90]; // #2B355A

    // Fetch photo before drawing header
    let photoDataUrl: string | null = null;
    if (application.uploads?.photo) {
      photoDataUrl = await fetchImageAsBase64(application.uploads.photo);
    }

    // 1. Logo (Left Aligned)
    try {
      const logoPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo-black.png');
      if (fs.existsSync(logoPath)) {
        const logoBase64 = fs.readFileSync(logoPath).toString('base64');
        const logoDataUrl = `data:image/png;base64,${logoBase64}`;

        // Calculate aspect ratio to prevent squishing
        const imgProps = doc.getImageProperties(logoDataUrl);
        const logoHeight = 18;
        const logoWidth = (imgProps.width * logoHeight) / imgProps.height;
        const xPos = 14; // Left horizontally

        doc.addImage(logoDataUrl, xPos, 10, logoWidth, logoHeight);
      }
    } catch (err) {
      console.error('Failed to load local logo', err);
    }

    // Header - KMCT Branding (Left Aligned)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('KMCT COLLEGE OF PHARMACY', 14, 40);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Kalanthode, Kozhikode, Kerala - 673601', 14, 46);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Application for Admission', 14, 56);

    doc.setFontSize(12);
    doc.text('(B.Pharm / Pharm D)', 14, 62);

    // Photo at Right of Header Text
    if (photoDataUrl) {
      // Standard passport size is 35x45
      const photoWidth = 30;
      const photoHeight = 40;
      // Position it to the right, aligned with the start of the college name (y=32)
      doc.addImage(photoDataUrl, 160, 28, photoWidth, photoHeight);

      // Draw a thin border around the photo for a clean look
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.rect(160, 28, photoWidth, photoHeight);
    }

    // Thick Line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(14, 72, 196, 72);

    let currentY = 78;

    // Helper to draw section banners
    const drawSectionHeader = (title: string, yPos: number) => {
      doc.setFillColor(...primaryColor);
      doc.rect(14, yPos, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), 16, yPos + 5.5);
      return yPos + 8;
    };

    // 1. Personal Details
    currentY = drawSectionHeader('Personal Details', currentY);

    const pd = application.personalDetails;
    const pdBody = [
      [
        { content: 'Application Number', styles: { fontStyle: 'bold' as const } },
        application.applicationNumber,
      ],
      [{ content: 'Name of Applicant', styles: { fontStyle: 'bold' as const } }, pd.name],
      [
        { content: 'Date of Birth', styles: { fontStyle: 'bold' as const } },
        format(new Date(pd.dateOfBirth), 'PPP'),
      ],
      [
        { content: 'Age', styles: { fontStyle: 'bold' as const } },
        calculateAge(pd.dateOfBirth).toString(),
      ],
      [{ content: 'Gender', styles: { fontStyle: 'bold' as const } }, pd.gender],
      [{ content: 'Email Address', styles: { fontStyle: 'bold' as const } }, pd.email],
      [{ content: 'Religion / Caste', styles: { fontStyle: 'bold' as const } }, pd.religion],
      [{ content: "Father's Name", styles: { fontStyle: 'bold' as const } }, pd.fatherName],
      [{ content: "Mother's Name", styles: { fontStyle: 'bold' as const } }, pd.motherName],
      [
        { content: 'Annual Income', styles: { fontStyle: 'bold' as const } },
        `Rs. ${pd.annualIncome}`,
      ],
      [
        { content: 'Permanent Address', styles: { fontStyle: 'bold' as const } },
        pd.permanentAddress,
      ],
      [
        { content: 'Communication Address', styles: { fontStyle: 'bold' as const } },
        pd.communicationAddress,
      ],
    ];

    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      body: pdBody,
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // 2. Qualification Details
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    currentY = drawSectionHeader('Qualification Details', currentY);

    const q = application.qualification;
    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      body: [
        [
          { content: 'Course', styles: { fontStyle: 'bold' as const } },
          q.course,
          { content: 'Board / University', styles: { fontStyle: 'bold' as const } },
          q.board,
        ],
        [
          { content: 'Register Number', styles: { fontStyle: 'bold' as const } },
          q.registerNumber,
          { content: 'Year / Month of Passing', styles: { fontStyle: 'bold' as const } },
          `${q.year} / ${q.month}`,
        ],
      ],
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        cellPadding: 3,
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // 3. Marks Obtained
    if (application.marks && application.marks.length > 0) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }
      currentY = drawSectionHeader('Marks Obtained', currentY);

      let totalMaxMarks = 0;
      let totalSecuredMarks = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const marksBody: any[] = application.marks.map((m: IMark) => {
        const maxMarks = Number(m.maximumMarks) || 0;
        const securedMarks = Number(m.marksSecured) || 0;

        totalMaxMarks += maxMarks;
        totalSecuredMarks += securedMarks;

        const subjectPercentage =
          maxMarks > 0 ? ((securedMarks / maxMarks) * 100).toFixed(2) + '%' : '-';

        return [
          m.subjectName,
          m.maximumMarks?.toString() || '-',
          m.marksSecured?.toString() || '-',
          subjectPercentage,
        ];
      });

      if (totalMaxMarks > 0) {
        marksBody.push([
          { content: 'Total Marks', styles: { fontStyle: 'bold' as const } },
          { content: totalMaxMarks.toString(), styles: { fontStyle: 'bold' as const } },
          { content: totalSecuredMarks.toString(), styles: { fontStyle: 'bold' as const } },
          '',
        ]);

        const overallPercentage = ((totalSecuredMarks / totalMaxMarks) * 100).toFixed(2) + '%';

        marksBody.push([
          {
            content: 'Overall Percentage',
            colSpan: 3,
            styles: { fontStyle: 'bold' as const, halign: 'right' as const },
          },
          { content: overallPercentage, styles: { fontStyle: 'bold' as const } },
        ]);
      }

      autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        head: [['Subject', 'Maximum Marks', 'Marks Secured', 'Percentage']],
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        body: marksBody,
        styles: {
          fontSize: 10,
          textColor: [0, 0, 0],
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          cellPadding: 3,
        },
        margin: { left: 14, right: 14 },
      });
      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    }

    // 4. Bank Details
    if (
      application.bankDetails &&
      Object.keys(application.bankDetails).length > 0 &&
      application.bankDetails.bankName
    ) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }
      currentY = drawSectionHeader('Bank Details', currentY);

      const bd = application.bankDetails;
      autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        body: [
          [
            { content: 'Account Holder', styles: { fontStyle: 'bold' as const } },
            bd.accountHolderName || '-',
            { content: 'Bank Name', styles: { fontStyle: 'bold' as const } },
            bd.bankName || '-',
          ],
          [
            { content: 'Branch', styles: { fontStyle: 'bold' as const } },
            bd.branch || '-',
            { content: 'Account Number', styles: { fontStyle: 'bold' as const } },
            bd.accountNumber || '-',
          ],
          [
            { content: 'IFSC Code', styles: { fontStyle: 'bold' as const } },
            bd.ifscCode || '-',
            '',
            '',
          ],
        ],
        styles: {
          fontSize: 10,
          textColor: [0, 0, 0],
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          cellPadding: 3,
        },
        margin: { left: 14, right: 14 },
      });
      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    }

    // 5. Declaration
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    currentY = drawSectionHeader('Declaration', currentY);

    currentY += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    // In PDF, we might want to just show the text or use the text from the UI, but we'll stick to a generic one or the one they just updated.
    const declarationText = `I do hereby declare that the particulars given in the application are true to the best of my knowledge and belief.`;
    doc.text(declarationText, 14, currentY);
    currentY += 8;

    const dec = application.declaration;
    doc.text(`Place: ${dec.place}`, 14, currentY);
    doc.text(`Date: ${format(new Date(dec.date), 'PPP')}`, 14, currentY + 6);

    // Signature
    if (application.uploads?.signature) {
      const signatureDataUrl = await fetchImageAsBase64(application.uploads.signature);
      if (signatureDataUrl) {
        doc.addImage(signatureDataUrl, 140, currentY - 10, 40, 20);
        doc.setFont('helvetica', 'bold');
        doc.text('Applicant Signature', 140, currentY + 14);
      }
    }

    // Convert to ArrayBuffer
    return doc.output('arraybuffer');
  }
}

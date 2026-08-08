import { NextResponse } from 'next/server';
import { ApplicationService } from '@/services/application.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { IMark } from '@/types/application';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ applicationNumber: string }> },
) {
  try {
    const { applicationNumber } = await params;
    const decodedNumber = decodeURIComponent(applicationNumber);

    const application = await ApplicationService.getApplication(decodedNumber);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 },
      );
    }

    // Generate PDF
    const doc = new jsPDF();

    // Header - KMCT Branding
    doc.setFontSize(22);
    doc.setTextColor(20, 50, 100);
    doc.text('KMCT College of Allied Health Sciences', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Application for B.Pharm 2026-2027', 105, 28, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Application Number: ${application.applicationNumber}`, 105, 36, { align: 'center' });

    doc.line(14, 40, 196, 40);

    let currentY = 50;

    // 1. Personal Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('1. Personal Details', 14, currentY);
    currentY += 8;

    const pd = application.personalDetails;
    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      body: [
        ['Name', pd.name, 'Gender', pd.gender],
        ['Date of Birth', format(new Date(pd.dateOfBirth), 'PPP'), 'Religion', pd.religion],
        ['Email', pd.email, 'Annual Income', `Rs. ${pd.annualIncome}`],
        ["Father's Name", pd.fatherName, "Mother's Name", pd.motherName],
        [
          'Permanent Address',
          pd.permanentAddress,
          'Communication Address',
          pd.communicationAddress,
        ],
      ],
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // 2. Qualification Details
    doc.setFontSize(14);
    doc.text('2. Qualification Details', 14, currentY);
    currentY += 8;

    const q = application.qualification;
    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      body: [
        ['Course', q.course, 'Board / University', q.board],
        ['Register Number', q.registerNumber, 'Year / Month of Passing', `${q.year} / ${q.month}`],
      ],
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // 3. Marks Obtained
    if (application.marks && application.marks.length > 0) {
      doc.setFontSize(14);
      doc.text('3. Marks Obtained', 14, currentY);
      currentY += 8;

      const marksBody = application.marks.map((m: IMark) => [
        m.subjectName,
        m.maximumMarks?.toString() || '-',
        m.marksSecured?.toString() || '-',
        m.numberOfChances?.toString() || '-',
      ]);

      autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        head: [['Subject', 'Max Marks', 'Marks Secured', 'Chances']],
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        body: marksBody,
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });
      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }

    // New Page if needed
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    // 4. Bank Details
    if (
      application.bankDetails &&
      Object.keys(application.bankDetails).length > 0 &&
      application.bankDetails.bankName
    ) {
      doc.setFontSize(14);
      doc.text('4. Bank Details', 14, currentY);
      currentY += 8;

      const bd = application.bankDetails;
      autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        body: [
          ['Account Holder', bd.accountHolderName || '-', 'Bank Name', bd.bankName || '-'],
          ['Branch', bd.branch || '-', 'Account Number', bd.accountNumber || '-'],
          ['IFSC Code', bd.ifscCode || '-', '', ''],
        ],
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });
      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }

    // 5. Declaration
    doc.setFontSize(14);
    doc.text('5. Declaration', 14, currentY);
    currentY += 8;

    doc.setFontSize(10);
    const declarationText = `I hereby declare that the information furnished above is true and correct.`;
    doc.text(declarationText, 14, currentY);
    currentY += 8;

    const dec = application.declaration;
    doc.text(`Place: ${dec.place}`, 14, currentY);
    doc.text(`Date: ${format(new Date(dec.date), 'PPP')}`, 14, currentY + 6);

    // Convert to ArrayBuffer
    const pdfBuffer = doc.output('arraybuffer');

    // Return as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${decodedNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}

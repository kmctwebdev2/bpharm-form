import { NextResponse } from 'next/server';
import { verifyRecoveryToken } from '@/utils/token';
import { ApplicationService } from '@/services/application.service';
import { PdfService } from '@/services/pdf.service';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 },
      );
    }

    const applicationNumber = verifyRecoveryToken(token);

    if (!applicationNumber) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid or expired token' },
        { status: 401 },
      );
    }

    const application = await ApplicationService.getApplication(applicationNumber);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 },
      );
    }

    const pdfBuffer = await PdfService.generateApplicationPDF(application);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${applicationNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate recovered PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import { ApplicationService } from '@/services/application.service';
import { PdfService } from '@/services/pdf.service';
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

    const pdfBuffer = await PdfService.generateApplicationPDF(application);

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

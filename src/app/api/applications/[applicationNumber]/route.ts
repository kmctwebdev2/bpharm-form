import { NextResponse } from 'next/server';
import { ApplicationService } from '@/services/application.service';
import { apiResponse } from '@/lib/api-response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ applicationNumber: string }> },
) {
  try {
    const { applicationNumber } = await params;
    // Decode the URI component since it may contain spaces (e.g. Pharm D - 1001)
    const decodedNumber = decodeURIComponent(applicationNumber);

    const application = await ApplicationService.getApplication(decodedNumber);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 },
      );
    }

    return apiResponse.success(application, 'Application retrieved successfully');
  } catch (error) {
    return apiResponse.serverError(error, 'Failed to fetch application');
  }
}

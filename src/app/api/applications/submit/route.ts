import { apiResponse } from '@/lib/api-response';
import { ApplicationService } from '@/services/application.service';
import { applicationSchema } from '@/features/application/schemas/application.schema';
import { IApplication } from '@/types/application';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. Validate full payload using Zod
    const validationResult = applicationSchema.safeParse(payload);
    if (!validationResult.success) {
      return apiResponse.validationError(validationResult.error.format());
    }

    const applicationData = validationResult.data;

    // We extract the url for MongoDB
    const docToSave = {
      personalDetails: applicationData.personalDetails,
      qualification: {
        ...applicationData.qualification,
        certificate: applicationData.qualification.certificate?.url || undefined,
      },
      marks: applicationData.marks || [],
      bankDetails: applicationData.bankDetails,
      declaration: applicationData.declaration,
      uploads: {
        photo: applicationData.uploads.photo?.url,
        signature: applicationData.uploads.signature?.url,
        sslcCertificate: applicationData.uploads.sslcCertificate?.url,
        aadhaar: applicationData.uploads.aadhaar?.url || undefined,
      },
    };

    // 2. Call Service to handle Number Generation and DB Save
    const result = await ApplicationService.createApplication(
      docToSave as Omit<IApplication, 'applicationNumber' | 'sequence' | 'createdAt' | 'updatedAt'>,
    );

    // 3. Return Success Response
    return apiResponse.success(
      { applicationNumber: result.applicationNumber },
      'Application submitted successfully.',
      201,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Submission failed';
    return apiResponse.serverError(error, message);
  }
}

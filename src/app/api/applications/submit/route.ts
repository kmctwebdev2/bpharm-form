import { apiResponse } from '@/lib/api-response';
import { ApplicationService } from '@/services/application.service';
import { applicationSchema } from '@/features/application/schemas/application.schema';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 1. Extract JSON chunks
    const personalDetails = JSON.parse((formData.get('personalDetails') as string) || '{}');
    const qualificationData = JSON.parse((formData.get('qualification') as string) || '{}');
    const marks = JSON.parse((formData.get('marks') as string) || '[]');
    const bankDetails = JSON.parse((formData.get('bankDetails') as string) || '{}');
    const declaration = JSON.parse((formData.get('declaration') as string) || '{}');

    // 2. Extract Files
    const photo = formData.get('photo');
    const signature = formData.get('signature');
    const sslcCertificate = formData.get('sslcCertificate');
    const aadhaar = formData.get('aadhaar');
    const certificate = formData.get('certificate'); // optional

    // 3. Build Payload
    const payload = {
      personalDetails,
      qualification: {
        ...qualificationData,
        certificate: certificate ? certificate : undefined,
      },
      marks,
      bankDetails,
      declaration,
      uploads: {
        photo,
        signature,
        sslcCertificate,
        aadhaar,
      },
    };

    // 4. Validate full payload using Zod (including files!)
    const validationResult = applicationSchema.safeParse(payload);
    if (!validationResult.success) {
      return apiResponse.validationError(validationResult.error.format());
    }

    const applicationData = validationResult.data;

    // 5. Call Service to handle Upload, Number Generation, and DB Save
    const result = await ApplicationService.createApplication(
      applicationData as unknown as Omit<
        import('@/types/application').IApplication,
        'applicationNumber' | 'sequence' | 'uploads' | 'createdAt' | 'updatedAt'
      >,
      {
        photo: photo as File,
        signature: signature as File,
        sslcCertificate: sslcCertificate as File,
        aadhaar: aadhaar as File,
        certificate: certificate ? (certificate as File) : undefined,
      },
    );

    // 6. Return Success Response
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

import { NextResponse } from 'next/server';
import { ApplicationService } from '@/services/application.service';
import { generateRecoveryToken } from '@/utils/token';
import { z } from 'zod';

const recoverySchema = z.object({
  applicationNumber: z.string().trim().min(1, 'Application Number is required'),
  email: z.string().trim().email('Invalid email address format'),
  dateOfBirth: z.string().trim().min(1, 'Date of Birth is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = recoverySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const { applicationNumber, email, dateOfBirth } = validationResult.data;

    const result = await ApplicationService.verifyAndRecoverApplication(
      applicationNumber,
      email,
      dateOfBirth,
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to find an application with the provided details.',
        },
        { status: 404 }, // Not Found is appropriate
      );
    }

    const recoveryToken = generateRecoveryToken(result.applicationNumber);

    return NextResponse.json({
      success: true,
      data: {
        applicationNumber: result.applicationNumber,
        applicantName: result.applicantName,
        recoveryToken,
      },
    });
  } catch (error) {
    console.error('Failed to recover application:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while retrieving the application. Please try again.',
      },
      { status: 500 },
    );
  }
}

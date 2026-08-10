import { Readable } from 'stream';
import { IApplication } from '@/types/application';
import connectDB from '@/lib/mongodb';
import { Application } from '@/models/Application';
import { Counter } from '@/models/Counter';
import { cloudinary } from '@/lib/cloudinary';

export class ApplicationService {
  static async generateApplicationNumber(): Promise<{
    applicationNumber: string;
    sequence: number;
  }> {
    await connectDB();

    // Attempt to increment the counter
    let counter = await Counter.findOneAndUpdate(
      { _id: 'application_counter' },
      { $inc: { nextSequence: 1 } },
      { new: true },
    );

    // If it doesn't exist, create it with initial value 1001
    if (!counter) {
      try {
        counter = await Counter.create({ _id: 'application_counter', nextSequence: 1001 });
      } catch (error: unknown) {
        // If there was a race condition and it was created, try incrementing again
        if ((error as { code?: number }).code === 11000) {
          counter = await Counter.findOneAndUpdate(
            { _id: 'application_counter' },
            { $inc: { nextSequence: 1 } },
            { new: true },
          );
        } else {
          throw error;
        }
      }
    }

    if (!counter) {
      throw new Error('Failed to generate application number');
    }

    const sequence = counter.nextSequence;
    const applicationNumber = `Pharm D - ${sequence}`;

    return { applicationNumber, sequence };
  }

  /**
   * Uploads a single file to Cloudinary.
   */
  static async uploadToCloudinary(
    buffer: Buffer,
    folder: string,
  ): Promise<{ url: string; public_id: string; resource_type: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `application-temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          resource_type: 'auto', // Auto handles both images and PDFs
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              resource_type: result.resource_type,
            });
          }
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  /**
   * Orchestrates the complete submission flow: Generate Number -> Save to DB.
   * Files are now uploaded directly from the frontend to Cloudinary prior to submission.
   */
  static async createApplication(
    applicationData: Omit<
      IApplication,
      'applicationNumber' | 'sequence' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<{ applicationNumber: string }> {
    await connectDB();

    try {
      // 1. Generate Application Number
      const { applicationNumber, sequence } = await this.generateApplicationNumber();

      // 2. Save to MongoDB
      const docToSave = {
        ...applicationData,
        applicationNumber,
        sequence,
      };

      await Application.create(docToSave);

      return { applicationNumber };
    } catch (error) {
      throw new Error(`Failed to save application: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieves an application by its application number.
   */
  static async getApplication(applicationNumber: string): Promise<IApplication | null> {
    await connectDB();
    const application = await Application.findOne({ applicationNumber }).lean();
    return application as IApplication | null;
  }

  /**
   * Verifies and recovers an application securely.
   */
  static async verifyAndRecoverApplication(
    applicationNumber: string,
    email: string,
    dateOfBirthString: string,
  ): Promise<{ applicationNumber: string; applicantName: string } | null> {
    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    // Query only by application number and email.
    // DOB validation is done in JS to avoid timezone boundary issues.
    const application = await Application.findOne({
      applicationNumber: applicationNumber.trim(),
      'personalDetails.email': normalizedEmail,
    }).lean();

    if (!application) {
      return null;
    }

    // Safely normalize the MongoDB Date object to a YYYY-MM-DD calendar string
    // using the application's intended timezone context.
    const { normalizeDobForComparison } = await import('@/utils');
    const storedDobString = normalizeDobForComparison(application.personalDetails.dateOfBirth);

    if (storedDobString !== dateOfBirthString.trim()) {
      return null;
    }

    return {
      applicationNumber: application.applicationNumber,
      applicantName: application.personalDetails.name,
    };
  }
}

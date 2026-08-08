import { Readable } from 'stream';
import { IApplication } from '@/types/application';
import connectDB from '@/lib/mongodb';
import { Application } from '@/models/Application';
import { Counter } from '@/models/Counter';
import { cloudinary } from '@/lib/cloudinary';

export interface ApplicationFilesPayload {
  photo: File;
  signature: File;
  sslcCertificate: File;
  aadhaar: File;
  certificate?: File; // Qualification certificate
}

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
  private static async uploadToCloudinary(
    file: File,
    folder: string,
  ): Promise<{ url: string; public_id: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  /**
   * Uploads all files to Cloudinary sequentially as per requirements.
   * If any fails, it rejects immediately.
   */
  static async uploadApplicationFiles(files: ApplicationFilesPayload) {
    const uploadedAssets: { url: string; public_id: string }[] = [];

    try {
      // 1. Photo
      const photoResult = await this.uploadToCloudinary(files.photo, 'admissions/photos');
      uploadedAssets.push(photoResult);

      // 2. Signature
      const signatureResult = await this.uploadToCloudinary(
        files.signature,
        'admissions/signatures',
      );
      uploadedAssets.push(signatureResult);

      // 3. Documents
      const sslcResult = await this.uploadToCloudinary(
        files.sslcCertificate,
        'admissions/documents',
      );
      uploadedAssets.push(sslcResult);

      const aadhaarResult = await this.uploadToCloudinary(files.aadhaar, 'admissions/documents');
      uploadedAssets.push(aadhaarResult);

      let certResult;
      if (files.certificate) {
        certResult = await this.uploadToCloudinary(files.certificate, 'admissions/documents');
        uploadedAssets.push(certResult);
      }

      return {
        assets: uploadedAssets, // For rollback purposes
        urls: {
          photo: photoResult.url,
          signature: signatureResult.url,
          sslcCertificate: sslcResult.url,
          aadhaar: aadhaarResult.url,
          certificate: certResult?.url,
        },
      };
    } catch (error) {
      // If upload fails, rollback any successfully uploaded files in this batch
      await this.rollbackCloudinaryFiles(uploadedAssets.map((a) => a.public_id));
      throw new Error(`File upload failed: ${(error as Error).message}`);
    }
  }

  /**
   * Rolls back Cloudinary files using their public_ids.
   */
  static async rollbackCloudinaryFiles(publicIds: string[]) {
    for (const publicId of publicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error(`Failed to rollback Cloudinary file: ${publicId}`, err);
      }
    }
  }

  /**
   * Orchestrates the complete submission flow: Upload -> Generate Number -> Save to DB.
   */
  static async createApplication(
    applicationData: Omit<
      IApplication,
      'applicationNumber' | 'sequence' | 'uploads' | 'createdAt' | 'updatedAt'
    >,
    files: ApplicationFilesPayload,
  ): Promise<{ applicationNumber: string }> {
    await connectDB();

    // 1. Upload Files
    const uploadResult = await this.uploadApplicationFiles(files);

    try {
      // 2. Generate Application Number
      const { applicationNumber, sequence } = await this.generateApplicationNumber();

      // 3. Save to MongoDB
      const docToSave = {
        ...applicationData,
        applicationNumber,
        sequence,
        uploads: {
          photo: uploadResult.urls.photo,
          signature: uploadResult.urls.signature,
          sslcCertificate: uploadResult.urls.sslcCertificate,
          aadhaar: uploadResult.urls.aadhaar,
        },
      };

      // Add qualification certificate if present
      if (uploadResult.urls.certificate) {
        docToSave.qualification.certificate = uploadResult.urls.certificate;
      }

      await Application.create(docToSave);

      return { applicationNumber };
    } catch (error) {
      // 4. Rollback completely on DB/Counter failure
      await this.rollbackCloudinaryFiles(uploadResult.assets.map((a) => a.public_id));
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
}

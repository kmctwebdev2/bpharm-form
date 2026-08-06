import { z } from 'zod';

const allowedFormats = ['jpg', 'jpeg', 'png'] as const;

export const uploadMetadataSchema = z.object({
  publicId: z.string().min(1, 'Public ID is required'),
  url: z.string().url('Invalid URL format'),
  originalName: z.string().min(1, 'Original name is required'),
  size: z.number().positive('Size must be positive'),
  format: z.enum(allowedFormats, {
    message: 'Only JPG, JPEG, and PNG formats are allowed',
  }),
});

export const uploadsSchema = z.object({
  photo: uploadMetadataSchema,
  signature: uploadMetadataSchema,
  sslcCertificate: uploadMetadataSchema,
  aadhaar: uploadMetadataSchema,
  plusTwoCertificate: uploadMetadataSchema,
});

export type UploadMetadataInput = z.infer<typeof uploadMetadataSchema>;
export type UploadsInput = z.infer<typeof uploadsSchema>;

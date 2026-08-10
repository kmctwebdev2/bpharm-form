import { z } from 'zod';

export const uploadedFileSchema = (isOptional: boolean = false, requiredMessage?: string) => {
  const schema = z.object(
    {
      url: z.string().url('Invalid URL'),
      publicId: z.string().min(1, 'Public ID is required'),
      resourceType: z.string().min(1, 'Resource type is required'),
      name: z.string().min(1, 'File name is required'),
      size: z.number().min(1, 'File size is required'),
    },
    { message: requiredMessage },
  );

  return isOptional ? schema.nullish() : schema;
};

export const uploadsSchema = z.object({
  photo: uploadedFileSchema(false, 'Candidate Photo is required'),
  signature: uploadedFileSchema(false, 'Candidate Signature is required'),
  sslcCertificate: uploadedFileSchema(false, 'SSLC Certificate is required'),
  aadhaar: uploadedFileSchema(true),
});

export type UploadsInput = z.infer<typeof uploadsSchema>;

import { z } from 'zod';

export const uploadedFileSchema = (isOptional: boolean = false) => {
  const schema = z.object({
    url: z.string().url('Invalid URL'),
    publicId: z.string().min(1, 'Public ID is required'),
    resourceType: z.string().min(1, 'Resource type is required'),
    name: z.string().min(1, 'File name is required'),
    size: z.number().min(1, 'File size is required'),
  });

  return isOptional ? schema.optional() : schema;
};

export const uploadsSchema = z.object({
  photo: uploadedFileSchema(),
  signature: uploadedFileSchema(),
  sslcCertificate: uploadedFileSchema(),
  aadhaar: uploadedFileSchema(true),
});

export type UploadsInput = z.infer<typeof uploadsSchema>;

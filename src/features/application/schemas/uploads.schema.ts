import { z } from 'zod';
import { FILE_LIMITS, ACCEPTED_FILE_TYPES } from '../constants/file-limits';

const isBrowser = typeof window !== 'undefined';

const createFileSchema = (allowedTypes: string[], maxSize: number, typeErrorMessage: string) => {
  return z
    .any()
    .refine((file) => {
      // In SSR, we don't have File objects in the form yet, so we can pass or handle gracefully.
      // But actually, this schema only runs on client side during form submission/validation.
      if (!isBrowser) return true;
      if (!file) return false;
      return file instanceof File;
    }, 'File is required')
    .refine((file) => {
      if (!isBrowser || !file) return true;
      return allowedTypes.includes(file.type);
    }, typeErrorMessage)
    .refine(
      (file) => {
        if (!isBrowser || !file) return true;
        return file.size <= maxSize;
      },
      `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    );
};

export const uploadsSchema = z.object({
  photo: createFileSchema(
    ACCEPTED_FILE_TYPES.IMAGE,
    FILE_LIMITS.IMAGE_MAX_SIZE,
    'Photo must be a JPG, JPEG, or PNG image',
  ),
  signature: createFileSchema(
    ACCEPTED_FILE_TYPES.IMAGE,
    FILE_LIMITS.IMAGE_MAX_SIZE,
    'Signature must be a JPG, JPEG, or PNG image',
  ),
  sslcCertificate: createFileSchema(
    ACCEPTED_FILE_TYPES.PDF,
    FILE_LIMITS.SSLC_MAX_SIZE,
    'SSLC Certificate must be a PDF document',
  ),
  aadhaar: createFileSchema(
    ACCEPTED_FILE_TYPES.PDF,
    FILE_LIMITS.AADHAAR_MAX_SIZE,
    'Aadhaar Card must be a PDF document',
  ),
});

export type UploadsInput = z.infer<typeof uploadsSchema>;

import { z } from 'zod';
import { sanitizeString } from '@/utils';
import { uploadedFileSchema } from './uploads.schema';

export const qualificationSchema = z.object({
  course: z
    .string({ message: 'Course name is required' })
    .trim()
    .min(2, 'Course name is required')
    .max(100, 'Course name cannot exceed 100 characters')
    .transform(sanitizeString),
  board: z
    .string({ message: 'Board name is required' })
    .trim()
    .min(2, 'Board name is required')
    .max(150, 'Board name cannot exceed 150 characters')
    .transform(sanitizeString),
  registerNumber: z
    .string({ message: 'Register number is required' })
    .trim()
    .min(3, 'Register number is required')
    .max(50, 'Register number cannot exceed 50 characters')
    .transform(sanitizeString),
  year: z.coerce
    .number({ message: 'Year is required' })
    .int('Year must be an integer')
    .min(1950, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  month: z
    .string({ message: 'Month is required' })
    .min(3, 'Month is required')
    .max(20, 'Month cannot exceed 20 characters')
    .transform(sanitizeString),
  certificate: uploadedFileSchema(false, 'Certificate of Qualifying Examination is required'),
});

export type QualificationInput = z.infer<typeof qualificationSchema>;

import { z } from 'zod';
import { Gender } from '@/constants/enums';
import { sanitizeString, calculateAge } from '@/utils';

export const personalDetailsSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .transform(sanitizeString),
  gender: z.nativeEnum(Gender, { message: 'Gender is required' }),
  dateOfBirth: z.coerce
    .date({ message: 'Valid date of birth is required' })
    .refine((date) => calculateAge(date) >= 16, {
      message: 'Applicant must be at least 16 years old',
    }),
  email: z
    .string()
    .email('Invalid email address format')
    .transform((str) => str.toLowerCase().trim()),
  fatherName: z
    .string()
    .min(2, 'Father name must be at least 2 characters')
    .max(100, 'Father name cannot exceed 100 characters')
    .transform(sanitizeString),
  motherName: z
    .string()
    .min(2, 'Mother name must be at least 2 characters')
    .max(100, 'Mother name cannot exceed 100 characters')
    .transform(sanitizeString),
  religion: z
    .string()
    .min(2, 'Religion is required')
    .max(50, 'Religion cannot exceed 50 characters')
    .transform(sanitizeString),
  annualIncome: z.coerce
    .number()
    .positive('Annual income must be positive')
    .min(0, 'Annual income cannot be negative'),
  permanentAddress: z
    .string()
    .min(10, 'Permanent address must be at least 10 characters')
    .max(500, 'Permanent address cannot exceed 500 characters')
    .transform(sanitizeString),
  communicationAddress: z
    .string()
    .min(10, 'Communication address must be at least 10 characters')
    .max(500, 'Communication address cannot exceed 500 characters')
    .transform(sanitizeString),
});

export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>;

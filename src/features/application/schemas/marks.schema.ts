import { z } from 'zod';
import { Subject } from '@/constants/enums';

export const markSchema = z
  .object({
    subject: z.nativeEnum(Subject, { message: 'Subject is required' }),
    maximumMarks: z.number().int().positive('Maximum marks must be greater than 0'),
    obtainedMarks: z.number().int().min(0, 'Obtained marks cannot be negative'),
    numberOfChances: z.number().int().min(1, 'Number of chances must be at least 1'),
  })
  .refine((data) => data.obtainedMarks <= data.maximumMarks, {
    message: 'Obtained marks cannot be greater than maximum marks',
    path: ['obtainedMarks'],
  });

export const marksArraySchema = z.array(markSchema).min(1, 'At least one subject mark is required');

export type MarkInput = z.infer<typeof markSchema>;
export type MarksArrayInput = z.infer<typeof marksArraySchema>;

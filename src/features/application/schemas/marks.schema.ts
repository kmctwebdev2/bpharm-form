import { z } from 'zod';

export const markSchema = z
  .object({
    subjectCode: z.string(),
    subjectName: z.string(),
    maximumMarks: z.union([z.string(), z.number()]).optional(),
    marksSecured: z.union([z.string(), z.number()]).optional(),
    numberOfChances: z.union([z.string(), z.number()]).optional(),
  })
  .superRefine((data, ctx) => {
    const hasMax =
      data.maximumMarks !== '' && data.maximumMarks !== undefined && data.maximumMarks !== null;
    const hasSecured =
      data.marksSecured !== '' && data.marksSecured !== undefined && data.marksSecured !== null;
    const hasChances =
      data.numberOfChances !== '' &&
      data.numberOfChances !== undefined &&
      data.numberOfChances !== null;

    const hasMarks = hasMax || hasSecured;

    if (hasMarks) {
      const max = Number(data.maximumMarks);
      const secured = Number(data.marksSecured);
      const chances = Number(data.numberOfChances);

      if (!hasMax || isNaN(max) || max <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required positive number',
          path: ['maximumMarks'],
        });
      }
      if (!hasSecured || isNaN(secured) || secured < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required non-negative number',
          path: ['marksSecured'],
        });
      } else if (hasMax && secured > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cannot exceed max marks',
          path: ['marksSecured'],
        });
      }
      if (!hasChances || isNaN(chances) || chances < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Minimum 1',
          path: ['numberOfChances'],
        });
      }
    }
  });

export const marksArraySchema = z.array(markSchema).optional().default([]);

export type MarkInput = z.infer<typeof markSchema>;
export type MarksArrayInput = z.infer<typeof marksArraySchema>;

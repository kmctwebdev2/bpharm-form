import { z } from 'zod';

export const declarationSchema = z.object({
  accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the declaration before continuing.',
  }),
  place: z.string().trim().min(2, 'Place is required'),
  date: z.union([z.string(), z.date()]).refine((val) => val !== undefined && val !== null, {
    message: 'Date is required',
  }),
});

export type DeclarationInput = z.infer<typeof declarationSchema>;

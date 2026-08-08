import { z } from 'zod';

export const declarationSchema = z.object({
  accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the declaration before continuing.',
  }),
  place: z.string({ message: 'Place is required' }).trim().min(2, 'Place is required'),
  date: z.coerce.date({ message: 'Date is required' }),
});

export type DeclarationInput = z.infer<typeof declarationSchema>;

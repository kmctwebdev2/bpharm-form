import { z } from 'zod';
import { personalDetailsSchema } from './personal-details.schema';
import { qualificationSchema } from './qualification.schema';
import { marksArraySchema } from './marks.schema';
import { uploadsSchema } from './uploads.schema';
import { bankDetailsSchema } from './bank-details.schema';
import { declarationSchema } from './declaration.schema';

export const applicationSchema = z.object({
  personalDetails: personalDetailsSchema,
  qualification: qualificationSchema,
  marks: marksArraySchema,
  uploads: uploadsSchema,
  bankDetails: bankDetailsSchema,
  declaration: declarationSchema,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

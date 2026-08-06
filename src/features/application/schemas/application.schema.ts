import { z } from 'zod';
import { personalDetailsSchema } from './personal-details.schema';
import { qualificationSchema } from './qualification.schema';
import { marksArraySchema } from './marks.schema';
import { uploadsSchema } from './uploads.schema';

export const applicationSchema = z.object({
  personalDetails: personalDetailsSchema,
  qualification: qualificationSchema,
  marks: marksArraySchema,
  uploads: uploadsSchema,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

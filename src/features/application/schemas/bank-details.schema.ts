import { z } from 'zod';

export const bankDetailsSchema = z
  .object({
    accountHolderName: z.string().optional(),
    bankName: z.string().optional(),
    branch: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasAny = !!(
      data.accountHolderName ||
      data.bankName ||
      data.branch ||
      data.accountNumber ||
      data.ifscCode
    );

    if (hasAny) {
      if (!data.accountHolderName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account Holder Name is required',
          path: ['accountHolderName'],
        });
      }
      if (!data.bankName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bank Name is required',
          path: ['bankName'],
        });
      }
      if (!data.branch?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Branch is required',
          path: ['branch'],
        });
      }
      if (!data.accountNumber?.trim() || !/^\d+$/.test(data.accountNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account Number must contain only numbers',
          path: ['accountNumber'],
        });
      }
      if (!data.ifscCode?.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid IFSC format (e.g., SBIN0001234)',
          path: ['ifscCode'],
        });
      }
    }
  });

export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;

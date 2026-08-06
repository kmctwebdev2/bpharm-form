export const APPLICATION_CONSTANTS = {
  ADMISSION_START_SEQUENCE: 3000,
  ADMISSION_PREFIX: 'BPH',
  STATUS: {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  STEPS: [
    { id: 'personal', title: 'Personal Details' },
    { id: 'academic', title: 'Academic Details' },
    { id: 'documents', title: 'Document Upload' },
    { id: 'review', title: 'Review & Submit' },
  ],
} as const;

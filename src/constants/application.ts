export const APPLICATION_CONSTANTS = {
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

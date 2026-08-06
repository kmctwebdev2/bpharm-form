export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
  DOCUMENT_TYPES: {
    PHOTO: 'photo',
    SIGNATURE: 'signature',
    SSLC: 'sslc',
    PLUS_TWO: 'plus_two',
    TC: 'tc',
  },
} as const;

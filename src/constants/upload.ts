export const UPLOAD_CONSTANTS = {
  PHOTO_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SIGNATURE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  CERTIFICATE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png'] as const,
  DOCUMENT_TYPES: {
    PHOTO: 'photo',
    SIGNATURE: 'signature',
    SSLC: 'sslcCertificate',
    AADHAAR: 'aadhaar',
    PLUS_TWO: 'plusTwoCertificate',
  },
} as const;

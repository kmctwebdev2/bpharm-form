export const ROUTES = {
  HOME: '/',
  APPLY: '/apply',
  SUCCESS: '/success',
  DOWNLOAD: '/download',
  API: {
    APPLICATION: '/api/application',
    UPLOAD: '/api/upload',
    DOWNLOAD_PDF: (applicationNumber: string) =>
      `/api/applications/${encodeURIComponent(applicationNumber)}/pdf`,
  },
} as const;

import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export const apiResponse = {
  success<T>(data: T, message?: string, status = 200) {
    return NextResponse.json({ success: true, message, data }, { status });
  },

  error(message: string, status = 400, errors?: unknown) {
    return NextResponse.json({ success: false, message, errors }, { status });
  },

  validationError(errors: unknown, message = 'Validation Error') {
    return this.error(message, 422, errors);
  },

  notFound(message = 'Resource not found') {
    return this.error(message, 404);
  },

  serverError(error: unknown, message = 'Internal Server Error') {
    console.error('[API Error]:', error); // Log server errors
    return this.error(message, 500);
  },

  notImplemented(message = 'Not implemented') {
    return this.error(message, 501);
  },
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInYears, isValid, parseISO } from 'date-fns';

/**
 * Merge Tailwind classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date object or string into a standardized format
 */
export function formatDate(date: Date | string, formatString = 'dd/MM/yyyy'): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatString);
}

/**
 * Calculate age from a birth date
 * @param birthDate The date of birth
 * @returns The calculated age in years
 */
export function calculateAge(birthDate: Date | string): number {
  if (!birthDate) return 0;
  const dateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(dateObj)) return 0;
  return differenceInYears(new Date(), dateObj);
}

/**
 * Calculate percentage
 * @param max The maximum marks possible
 * @param obtained The marks obtained
 * @returns The calculated percentage rounded to 2 decimal places
 */
export function calculatePercentage(max: number, obtained: number): number {
  if (!max || max <= 0) return 0;
  const percentage = (obtained / max) * 100;
  return Number(percentage.toFixed(2));
}

/**
 * Calculate totals for a marks array
 * @param marks Array of mark objects containing maximumMarks and obtainedMarks
 * @returns Object with total maximum marks, total obtained marks, and overall percentage
 */
export function calculateTotals(marks: Array<{ maximumMarks: number; obtainedMarks: number }>): {
  totalMaximumMarks: number;
  totalObtainedMarks: number;
  overallPercentage: number;
} {
  if (!marks || marks.length === 0) {
    return { totalMaximumMarks: 0, totalObtainedMarks: 0, overallPercentage: 0 };
  }

  const totals = marks.reduce(
    (acc, curr) => {
      acc.totalMaximumMarks += Number(curr.maximumMarks) || 0;
      acc.totalObtainedMarks += Number(curr.obtainedMarks) || 0;
      return acc;
    },
    { totalMaximumMarks: 0, totalObtainedMarks: 0 },
  );

  return {
    ...totals,
    overallPercentage: calculatePercentage(totals.totalMaximumMarks, totals.totalObtainedMarks),
  };
}

/**
 * Sanitize a string by trimming and removing extra spaces
 * @param str The input string
 * @returns Sanitized string
 */
export function sanitizeString(str: string): string {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Sleep for a specified amount of time (useful for mocking delays)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format bytes to a human readable string
 * @param bytes The size in bytes
 * @param decimals Number of decimal places
 * @returns Human readable size string (e.g. "1.25 MB")
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate a unique application number
 */
export function generateApplicationNo(): string {
  const prefix = 'APP';
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${randomStr}`;
}

/**
 * Check if a file is a PDF
 */
export function isPdf(file: File | string): boolean {
  if (typeof file === 'string') {
    return file.toLowerCase().endsWith('.pdf');
  }
  return file.type === 'application/pdf';
}

/**
 * Check if a file is a valid image (jpg, jpeg, png)
 * @param file The file or filename string
 * @returns True if valid image type
 */
export function isValidImage(file: File | string): boolean {
  if (typeof file === 'string') {
    const ext = getFileExtension(file);
    return ['jpg', 'jpeg', 'png'].includes(ext);
  }
  return ['image/jpeg', 'image/png'].includes(file.type);
}

/**
 * Get file extension from filename or url
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const parts = filename.split('.');
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) return '';
  return parts.pop()?.toLowerCase() || '';
}

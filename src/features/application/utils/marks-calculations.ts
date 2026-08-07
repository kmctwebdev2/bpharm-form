import { MarkInput } from '../schemas/marks.schema';

export function calculatePercentage(
  secured: number | string | undefined,
  max: number | string | undefined,
): string {
  const s = Number(secured);
  const m = Number(max);
  if (isNaN(s) || isNaN(m) || m <= 0) return '';
  return ((s / m) * 100).toFixed(2);
}

export function calculateTotalMaximumMarks(marks: MarkInput[] | undefined): number {
  if (!marks) return 0;
  return marks.reduce((sum, mark) => sum + (Number(mark?.maximumMarks) || 0), 0);
}

export function calculateTotalMarksSecured(marks: MarkInput[] | undefined): number {
  if (!marks) return 0;
  return marks.reduce((sum, mark) => sum + (Number(mark?.marksSecured) || 0), 0);
}

export function calculateOverallPercentage(marks: MarkInput[] | undefined): string {
  const totalMax = calculateTotalMaximumMarks(marks);
  const totalSecured = calculateTotalMarksSecured(marks);

  if (totalMax <= 0) return '0.00';
  return ((totalSecured / totalMax) * 100).toFixed(2);
}

import React from 'react';
import { MarkInput } from '@/features/application/schemas/marks.schema';
import { calculatePercentage } from '@/features/application/utils/marks-calculations';

interface ReviewMarksTableProps {
  marks: MarkInput[];
}

export function ReviewMarksTable({ marks }: ReviewMarksTableProps) {
  // Filter out completely blank rows
  const filledMarks = marks.filter(
    (mark) =>
      (mark.maximumMarks !== undefined && mark.maximumMarks !== '') ||
      (mark.marksSecured !== undefined && mark.marksSecured !== '') ||
      (mark.numberOfChances !== undefined && mark.numberOfChances !== ''),
  );

  if (filledMarks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Marks obtained details not provided.</p>
    );
  }

  // Calculate totals for valid rows
  let totalMax = 0;
  let totalSecured = 0;

  filledMarks.forEach((mark) => {
    const max = Number(mark.maximumMarks);
    const secured = Number(mark.marksSecured);
    if (!isNaN(max)) totalMax += max;
    if (!isNaN(secured)) totalSecured += secured;
  });

  const overallPercentage = calculatePercentage(totalSecured, totalMax);

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Maximum</th>
              <th className="px-4 py-3 font-medium">Secured</th>
              <th className="px-4 py-3 font-medium">Percentage</th>
              <th className="px-4 py-3 font-medium">Chances</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filledMarks.map((mark, index) => {
              const rowPercentage = calculatePercentage(mark.marksSecured, mark.maximumMarks);
              return (
                <tr key={index} className="bg-card hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{mark.subjectName}</td>
                  <td className="px-4 py-3">{mark.maximumMarks || '-'}</td>
                  <td className="px-4 py-3">{mark.marksSecured || '-'}</td>
                  <td className="px-4 py-3">{rowPercentage ? `${rowPercentage}%` : '-'}</td>
                  <td className="px-4 py-3">{mark.numberOfChances || '-'}</td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-muted/50 font-semibold border-t-2">
              <td className="px-4 py-3 text-right">Total Marks</td>
              <td className="px-4 py-3">{totalMax > 0 ? totalMax : '-'}</td>
              <td className="px-4 py-3">{totalSecured > 0 ? totalSecured : '-'}</td>
              <td className="px-4 py-3 text-primary">
                {overallPercentage ? `${overallPercentage}%` : '-'}
              </td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

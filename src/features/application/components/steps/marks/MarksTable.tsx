import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SUBJECTS } from '@/features/application/constants/subjects';
import { MarksRow } from './MarksRow';
import {
  calculateTotalMaximumMarks,
  calculateTotalMarksSecured,
  calculateOverallPercentage,
} from '@/features/application/utils/marks-calculations';
import { Input } from '@/components/ui/input';

export function MarksTable() {
  const { control } = useFormContext();

  // Watch the entire array for total calculations
  const marks = useWatch({ control, name: 'marks' });

  const totalMax = calculateTotalMaximumMarks(marks);
  const totalSecured = calculateTotalMarksSecured(marks);
  const overallPercentage = calculateOverallPercentage(marks);

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Subject Name</th>
              <th className="px-4 py-3 font-medium">Maximum Marks</th>
              <th className="px-4 py-3 font-medium">Marks Secured</th>
              <th className="px-4 py-3 font-medium">Percentage</th>
              <th className="px-4 py-3 font-medium">No. of Chances</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {SUBJECTS.map((subject, index) => (
              <MarksRow key={subject.code} index={index} subjectName={subject.name} />
            ))}

            {/* Total Marks Row */}
            <tr className="bg-muted/30 font-medium">
              <td className="px-4 py-4 uppercase font-bold text-right">Total Marks</td>
              <td className="px-4 py-3">
                <Input
                  type="text"
                  readOnly
                  value={totalMax || ''}
                  placeholder="-"
                  className="bg-muted text-muted-foreground font-bold"
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  type="text"
                  readOnly
                  value={totalSecured || ''}
                  placeholder="-"
                  className="bg-muted text-muted-foreground font-bold"
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  type="text"
                  readOnly
                  value={overallPercentage !== '0.00' ? `${overallPercentage}%` : ''}
                  placeholder="-"
                  className="bg-muted text-muted-foreground font-bold"
                />
              </td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

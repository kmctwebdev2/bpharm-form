import React from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { ControlledNumberInput } from '@/components/form/ControlledNumberInput';
import { calculatePercentage } from '@/features/application/utils/marks-calculations';
import { Input } from '@/components/ui/input';

interface MarksRowProps {
  index: number;
  subjectName: string;
}

export function MarksRow({ index, subjectName }: MarksRowProps) {
  const { control } = useFormContext();

  // Watch only this specific row's fields for optimal re-rendering
  const rowData = useWatch({
    control,
    name: `marks.${index}`,
  });

  const max = rowData?.maximumMarks;
  const secured = rowData?.marksSecured;
  const percentage = calculatePercentage(secured, max);

  return (
    <tr className="bg-card">
      <td className="px-4 py-3 font-medium min-w-[150px]">
        {subjectName}
        <input type="hidden" {...control.register(`marks.${index}.subjectCode` as const)} />
        <input type="hidden" {...control.register(`marks.${index}.subjectName` as const)} />
      </td>
      <td className="px-4 py-3 align-top min-w-[120px]">
        <ControlledNumberInput
          name={`marks.${index}.maximumMarks`}
          hideLabel
          placeholder="Max"
          min={0}
        />
      </td>
      <td className="px-4 py-3 align-top min-w-[120px]">
        <ControlledNumberInput
          name={`marks.${index}.marksSecured`}
          hideLabel
          placeholder="Secured"
          min={0}
        />
      </td>
      <td className="px-4 py-3 align-top min-w-[120px]">
        <Input
          type="text"
          readOnly
          value={percentage ? `${percentage}%` : ''}
          placeholder="-"
          className="bg-muted text-muted-foreground"
        />
      </td>
      <td className="px-4 py-3 align-top min-w-[120px]">
        <ControlledNumberInput
          name={`marks.${index}.numberOfChances`}
          hideLabel
          placeholder="Total Attempts"
          min={1}
        />
      </td>
    </tr>
  );
}

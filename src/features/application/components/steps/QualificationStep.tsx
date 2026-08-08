'use client';

import React, { useMemo } from 'react';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledFileUpload } from '@/components/form/ControlledFileUpload';
import { ACCEPTED_FILE_TYPES } from '../../constants/file-limits';

export function QualificationStep() {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    return Array.from({ length: currentYear - 2000 + 1 }, (_, i) => {
      const year = (currentYear - i).toString();
      return { label: year, value: year };
    });
  }, [currentYear]);

  const months = useMemo(
    () => [
      { label: 'January', value: 'January' },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
      { label: 'April', value: 'April' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' },
    ],
    [],
  );

  const pdfAccept = ACCEPTED_FILE_TYPES.PDF.join(',');

  return (
    <div className="space-y-8">
      {/* Qualification Details */}
      <div>
        <h4 className="text-lg font-medium mb-4 pb-2 border-b">Plus Two Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ControlledInput
            name="qualification.course"
            label="Plus Two, Specify *"
            placeholder="Science, Commerce, etc."
          />
          <ControlledInput
            name="qualification.board"
            label="University or Board *"
            placeholder="Kerala HSE, CBSE, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <ControlledInput
              name="qualification.registerNumber"
              label="Plus Two Register Number *"
              placeholder="Enter register number"
            />
          </div>
          <ControlledSelect
            name="qualification.year"
            label="Year *"
            options={years}
            placeholder="Select year"
          />
          <ControlledSelect
            name="qualification.month"
            label="Month *"
            options={months}
            placeholder="Select month"
          />
        </div>
      </div>

      {/* Upload Certificate */}
      <div>
        <h4 className="text-lg font-medium mb-4 pb-2 border-b">Upload Certificate</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlledFileUpload
            name="qualification.certificate"
            label="Upload Certificate of Qualifying Examination (Plus Two) *"
            accept={pdfAccept}
            maxSizeLabel="5MB"
          />
        </div>
      </div>
    </div>
  );
}

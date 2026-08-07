import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { FormSection } from '@/components/form/FormSection';
import { SectionHeader } from '@/components/form/SectionHeader';
import { useApplicationStep } from '@/features/application/hooks/useApplicationStep';
import { ApplicationInput } from '@/features/application/schemas/application.schema';

import { ReviewCard } from '@/components/review/ReviewCard';
import { ReviewField } from '@/components/review/ReviewField';
import { ReviewImage } from '@/components/review/ReviewImage';
import { ReviewMarksTable } from '@/components/review/ReviewMarksTable';

export function ReviewStep() {
  const { getValues } = useFormContext<ApplicationInput>();
  const { goToStep } = useApplicationStep();

  const data = getValues();
  const personal = data.personalDetails;
  const uploads = data.uploads;
  const qualification = data.qualification;
  const marks = data.marks || [];
  const bank = data.bankDetails;
  const declaration = data.declaration;

  // Format date helper
  const formatDate = (dateValue: Date | string | undefined | null) => {
    if (!dateValue) return undefined;
    try {
      return format(new Date(dateValue), 'PPP');
    } catch {
      return String(dateValue);
    }
  };

  // Check if bank is empty
  const isBankEmpty =
    !bank?.accountHolderName &&
    !bank?.bankName &&
    !bank?.branch &&
    !bank?.accountNumber &&
    !bank?.ifscCode;

  // Check if marks are empty
  const isMarksEmpty = marks.every((m) => !m.maximumMarks && !m.marksSecured && !m.numberOfChances);

  return (
    <FormSection>
      <SectionHeader
        title="Review & Preview"
        description="Please verify all entered information before final submission"
      />

      <div className="space-y-6">
        {/* Personal Details */}
        <ReviewCard title="1. Personal Details" onEdit={() => goToStep(0)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReviewField label="Name" value={personal?.name} />
            <ReviewField label="Gender" value={personal?.gender} />
            <ReviewField label="Date of Birth" value={formatDate(personal?.dateOfBirth)} />
            <ReviewField label="Email" value={personal?.email} />
            <ReviewField label="Father's Name" value={personal?.fatherName} />
            <ReviewField label="Mother's Name" value={personal?.motherName} />
            <ReviewField label="Religion" value={personal?.religion} />
            <ReviewField label="Annual Income" value={personal?.annualIncome} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ReviewField label="Permanent Address" value={personal?.permanentAddress} />
            <ReviewField label="Communication Address" value={personal?.communicationAddress} />
          </div>
        </ReviewCard>

        {/* Uploaded Documents */}
        <ReviewCard title="2. Uploaded Documents" onEdit={() => goToStep(1)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ReviewImage label="Passport Photo" file={uploads?.photo} />
            <ReviewImage label="Signature" file={uploads?.signature} />
            <ReviewImage label="SSLC Certificate" file={uploads?.sslcCertificate} />
            <ReviewImage label="Aadhaar Card" file={uploads?.aadhaar} />
          </div>
        </ReviewCard>

        {/* Qualification Details */}
        <ReviewCard title="3. Qualification Details" onEdit={() => goToStep(2)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <ReviewField label="Course" value={qualification?.course} />
            <ReviewField label="Board / University" value={qualification?.board} />
            <ReviewField label="Register Number" value={qualification?.registerNumber} />
            <ReviewField label="Year of Passing" value={qualification?.year} />
            <ReviewField label="Month of Passing" value={qualification?.month} />
          </div>
          <div className="w-1/2 md:w-1/4">
            <ReviewImage label="Plus Two Certificate" file={qualification?.certificate} />
          </div>
        </ReviewCard>

        {/* Marks Obtained */}
        <ReviewCard
          title="4. Marks Obtained"
          onEdit={() => goToStep(3)}
          isEmpty={isMarksEmpty}
          emptyMessage="Marks obtained details not provided."
        >
          {!isMarksEmpty && <ReviewMarksTable marks={marks} />}
        </ReviewCard>

        {/* Bank Details */}
        <ReviewCard
          title="5. Bank Details"
          onEdit={() => goToStep(4)}
          isEmpty={isBankEmpty}
          emptyMessage="Bank details not provided."
        >
          {!isBankEmpty && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ReviewField label="Account Holder Name" value={bank?.accountHolderName} />
              <ReviewField label="Bank Name" value={bank?.bankName} />
              <ReviewField label="Branch" value={bank?.branch} />
              <ReviewField label="Account Number" value={bank?.accountNumber} />
              <ReviewField label="IFSC Code" value={bank?.ifscCode} />
            </div>
          )}
        </ReviewCard>

        {/* Declaration */}
        <ReviewCard title="6. Declaration" onEdit={() => goToStep(5)}>
          <div className="bg-muted p-4 rounded-md mb-6 flex items-center space-x-3 border">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <div
                className={`w-3 h-3 rounded-full ${declaration?.accepted ? 'bg-primary' : 'bg-destructive'}`}
              />
            </div>
            <p className="text-sm font-medium">
              {declaration?.accepted
                ? 'Declaration Accepted: I hereby declare that the information furnished above is true and correct.'
                : 'Declaration not accepted.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ReviewField label="Place" value={declaration?.place} />
            <ReviewField label="Date" value={formatDate(declaration?.date)} />
          </div>

          <div className="w-1/2 md:w-1/4">
            <ReviewImage label="Signature Preview" file={uploads?.signature} />
          </div>
        </ReviewCard>
      </div>
    </FormSection>
  );
}

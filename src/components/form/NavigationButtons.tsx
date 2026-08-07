import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApplicationStep } from '@/features/application/hooks/useApplicationStep';
import { useApplicationForm } from '@/features/application/hooks/useApplicationForm';
import { isFirstStep, isLastStep } from '@/features/application/utils/step-helpers';
import { Loader2 } from 'lucide-react';

export function NavigationButtons() {
  const { currentStep, totalSteps, next, previous } = useApplicationStep();
  const { trigger, getValues } = useApplicationForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstStep = isFirstStep(currentStep);
  const lastStep = isLastStep(currentStep, totalSteps);

  const handleSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) {
      alert('Please correct any validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = getValues();
      const formData = new FormData();

      // Separate certificate from qualification to append as File
      const { certificate, ...qualificationData } = data.qualification || {};

      // Append non-file data as JSON strings
      formData.append('personalDetails', JSON.stringify(data.personalDetails));
      formData.append('qualification', JSON.stringify(qualificationData));
      formData.append('marks', JSON.stringify(data.marks));
      formData.append('bankDetails', JSON.stringify(data.bankDetails));
      formData.append('declaration', JSON.stringify(data.declaration));

      // Append files directly to FormData
      if (data.uploads?.photo) formData.append('photo', data.uploads.photo);
      if (data.uploads?.signature) formData.append('signature', data.uploads.signature);
      if (data.uploads?.sslcCertificate)
        formData.append('sslcCertificate', data.uploads.sslcCertificate);
      if (data.uploads?.aadhaar) formData.append('aadhaar', data.uploads.aadhaar);
      if (certificate) {
        formData.append('certificate', certificate);
      }

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        body: formData, // Do NOT set Content-Type header, browser sets it automatically with boundary for FormData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(
          `Application submitted successfully!\nApplication Number: ${result.data.applicationNumber}`,
        );
        // Optionally redirect or reset form here
      } else {
        alert(`Submission failed: ${result.message || 'Unknown error'}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`An unexpected error occurred: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={previous}
        disabled={firstStep || isSubmitting}
        className="w-24"
      >
        Previous
      </Button>

      {lastStep ? (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-24 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
        </Button>
      ) : (
        <Button type="button" onClick={next} disabled={isSubmitting} className="w-24">
          Next
        </Button>
      )}
    </div>
  );
}

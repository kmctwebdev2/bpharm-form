'use client';

import React, { useState } from 'react';
import { useApplicationForm } from '../hooks/useApplicationForm';
import { FORM_STORAGE_KEY } from '../constants/form';
import { FormContainer } from '@/components/form/FormContainer';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { UploadsStep } from './steps/UploadsStep';
import { QualificationStep } from './steps/QualificationStep';
import { MarksStep } from './steps/MarksStep';
import { BankDetailsStep } from './steps/BankDetailsStep';
import { DeclarationStep } from './steps/DeclarationStep';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function ApplicationForm() {
  const { handleSubmit, getValues } = useApplicationForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = getValues();
      const formData = new FormData();

      const { certificate, ...qualificationData } = data.qualification || {};

      formData.append('personalDetails', JSON.stringify(data.personalDetails));
      formData.append('qualification', JSON.stringify(qualificationData));
      formData.append('marks', JSON.stringify(data.marks));
      formData.append('bankDetails', JSON.stringify(data.bankDetails));
      formData.append('declaration', JSON.stringify(data.declaration));

      if (data.uploads?.photo) formData.append('photo', data.uploads.photo);
      if (data.uploads?.signature) formData.append('signature', data.uploads.signature);
      if (data.uploads?.sslcCertificate)
        formData.append('sslcCertificate', data.uploads.sslcCertificate);
      if (data.uploads?.aadhaar) formData.append('aadhaar', data.uploads.aadhaar);
      if (certificate) formData.append('certificate', certificate);

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const appNum = result.data.applicationNumber;
        setApplicationNumber(appNum);
        setSubmitSuccess(true);
        toast.success('Application submitted successfully!', {
          description: `Application Number: ${appNum}`,
        });
        localStorage.removeItem(FORM_STORAGE_KEY);
      } else {
        toast.error('Application submission failed.', {
          description: result.message || 'Please try again.',
        });
      }
    } catch {
      toast.error('Application submission failed.', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && applicationNumber) {
    return (
      <FormContainer>
        <div className="bg-card shadow-sm border rounded-xl p-8 max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Application Submitted Successfully
            </h2>
            <p className="text-muted-foreground">
              Your application has been received and is being processed.
            </p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Application Number</p>
            <p className="text-xl font-bold">{applicationNumber}</p>
          </div>
          <a href={ROUTES.API.DOWNLOAD_PDF(applicationNumber)} download className="w-full">
            <Button type="button" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Application PDF
            </Button>
          </a>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <div className="bg-card shadow-sm border rounded-xl p-6 md:p-8 mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Application for B.Pharm 2026-2027
        </h1>
        <p className="text-muted-foreground mb-8">
          Please fill out all the required information below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Personal Details</h2>
            <PersonalDetailsStep />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Upload Section</h2>
            <UploadsStep />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Details of Qualification</h2>
            <QualificationStep />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Marks Obtained (Optional)</h2>
            <MarksStep />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Bank Details (Optional)</h2>
            <BankDetailsStep />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Declaration</h2>
            <DeclarationStep />
          </div>

          <div className="pt-6 border-t flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto md:px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </FormContainer>
  );
}

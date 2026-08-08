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
        <div className="bg-card shadow-lg border-0 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-primary leading-tight">
              Application Submitted Successfully
            </h2>
            <p className="text-muted-foreground">
              Your application has been received and is being processed.
            </p>
          </div>
          <div className="bg-[#EEF2F6] p-5 rounded-xl border border-[#EEF2F6]/50">
            <p className="text-sm font-medium text-muted-foreground mb-2">Application Number</p>
            <p className="text-2xl font-bold text-primary">{applicationNumber}</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <a href={ROUTES.API.DOWNLOAD_PDF(applicationNumber)} download className="w-full">
              <Button
                type="button"
                className="w-full py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              >
                <Download className="mr-2 h-5 w-5" /> Download Application PDF
              </Button>
            </a>
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base border-primary/20 text-primary hover:bg-primary/5 rounded-xl"
              onClick={() => window.location.reload()}
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </FormContainer>
    );
  }

  const onInvalid = () => {
    toast.error('Form Incomplete', {
      description: 'Please fill all the required fields correctly before submitting.',
    });
  };

  return (
    <FormContainer>
      <div className="bg-card shadow-lg border-0 rounded-2xl p-6 md:p-8 mb-8">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-lg font-bold bg-muted text-primary px-4 py-3 rounded-md">
              Personal Details
            </h2>
            <div className="px-1">
              <PersonalDetailsStep />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold bg-muted text-primary px-4 py-3 rounded-md">
              Upload Section
            </h2>
            <div className="px-1">
              <UploadsStep />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold bg-muted text-primary px-4 py-3 rounded-md">
              Details of Qualification
            </h2>
            <div className="px-1">
              <QualificationStep />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold bg-muted text-primary px-4 py-3 rounded-md">
              Marks Obtained (Optional)
            </h2>
            <div className="px-1">
              <MarksStep />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold bg-muted text-primary px-4 py-3 rounded-md">
              Bank Details (Optional)
            </h2>
            <div className="px-1">
              <BankDetailsStep />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold bg-muted text-primary px-4 py-3 rounded-md">
              Declaration
            </h2>
            <div className="px-1">
              <DeclarationStep />
            </div>
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

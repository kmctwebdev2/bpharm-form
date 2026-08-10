'use client';

import React, { useState } from 'react';
import { useApplicationFormContext } from '../hooks/useApplicationForm';
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
import { CheckCircle2, Download, Loader2, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { DEFAULT_MARKS } from '@/features/application/constants/subjects';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ApplicationForm() {
  const { form, clearDraft, resumeSaving, pendingUploads } = useApplicationFormContext();
  const { handleSubmit, getValues } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = getValues();
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  const handleClearForm = async () => {
    if (pendingUploads > 0) {
      toast.warning(
        'An upload is still in progress. Please wait for it to finish before clearing the form.',
      );
      setShowClearDialog(false);
      return;
    }

    setIsClearing(true);
    try {
      // 1. Gather all current Cloudinary assets from the draft
      const data = getValues();
      const filesToDelete: { publicId: string; resourceType: string }[] = [];

      if (data.uploads) {
        Object.values(data.uploads).forEach(
          (file: { publicId?: string; resourceType?: string } | null | undefined) => {
            if (file && file.publicId) {
              filesToDelete.push({
                publicId: file.publicId,
                resourceType: file.resourceType || 'auto',
              });
            }
          },
        );
      }

      // 2. Delete from Cloudinary if there are any files
      if (filesToDelete.length > 0) {
        const res = await fetch('/api/uploads/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: filesToDelete }),
        });

        if (res.status === 207) {
          toast.warning(
            'Form cleared, but some uploaded files could not be removed from Cloudinary.',
          );
        } else if (!res.ok) {
          toast.warning(
            'Form cleared, but uploaded files could not be fully removed from Cloudinary. Please contact support if necessary.',
          );
        }
      }

      // 3. Clear draft and form
      clearDraft();
      form.reset({
        marks: DEFAULT_MARKS,
        declaration: {
          date: new Date(),
        },
      });

      // 4. Clean up UI state
      setShowClearDialog(false);
      toast.success('Application form cleared successfully.');
      window.scrollTo(0, 0);

      // 5. Resume saving after resetting
      setTimeout(() => {
        resumeSaving();
      }, 100);
    } catch (error) {
      console.error('Clear form error:', error);
      toast.error('An unexpected error occurred while clearing the form.');
    } finally {
      setIsClearing(false);
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

          <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || pendingUploads > 0}
              onClick={() => setShowClearDialog(true)}
              className="w-full md:w-auto md:px-6 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
              size="lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Form
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || pendingUploads > 0}
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

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-[425px]" showCloseButton={!isClearing}>
          <DialogHeader>
            <DialogTitle>Clear Application Form?</DialogTitle>
            <DialogDescription>
              This will remove all entered information and uploaded files from this application
              draft. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              disabled={isClearing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleClearForm}
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Clearing...
                </>
              ) : (
                'Clear Form'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormContainer>
  );
}

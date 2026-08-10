'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '../schemas/application.schema';
import { ApplicationFormContext } from '../hooks/useApplicationForm';
import { useDraftPersistence } from '../hooks/useDraftPersistence';
import { DEFAULT_MARKS } from '@/features/application/constants/subjects';

interface ApplicationProviderProps {
  children: ReactNode;
}

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [isClient, setIsClient] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(applicationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      marks: DEFAULT_MARKS,
      qualification: {
        certificate: undefined,
      },
      declaration: {
        date: new Date(),
        accepted: undefined,
      },
      uploads: {
        photo: undefined,
        signature: undefined,
        sslcCertificate: undefined,
        aadhaar: undefined,
      },
    },
  });

  const { restoreDraft, clearDraft, resumeSaving } = useDraftPersistence(form);
  const [pendingUploads, setPendingUploads] = useState(0);

  const incrementUploads = () => setPendingUploads((prev) => prev + 1);
  const decrementUploads = () => setPendingUploads((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    restoreDraft();
  }, [restoreDraft]);

  // Prevent hydration mismatch by returning null until client-side mounts
  if (!isClient) return null;

  const contextValue = {
    form,
    clearDraft,
    resumeSaving,
    pendingUploads,
    incrementUploads,
    decrementUploads,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ApplicationFormContext.Provider value={contextValue as any}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RHFProvider {...(form as any)}>{children}</RHFProvider>
    </ApplicationFormContext.Provider>
  );
}

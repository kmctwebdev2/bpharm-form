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
      declaration: {
        date: new Date().toISOString(),
      },
    },
  });

  const { restoreDraft } = useDraftPersistence(form);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    restoreDraft();
  }, [restoreDraft]);

  // Prevent hydration mismatch by returning null until client-side mounts
  if (!isClient) return null;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ApplicationFormContext.Provider value={form as any}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RHFProvider {...(form as any)}>{children}</RHFProvider>
    </ApplicationFormContext.Provider>
  );
}

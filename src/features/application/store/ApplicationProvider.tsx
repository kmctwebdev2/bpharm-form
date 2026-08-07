'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '../schemas/application.schema';
import { ApplicationFormContext } from '../hooks/useApplicationForm';
import { ApplicationStepContext } from '../hooks/useApplicationStep';
import { useDraftPersistence } from '../hooks/useDraftPersistence';
import { DEFAULT_STEP } from '../constants/form';
import { calculateProgress } from '../utils/step-helpers';
import { APPLICATION_STEPS } from '@/features/application/constants/application-steps';

interface ApplicationProviderProps {
  children: ReactNode;
}

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [currentStep, setCurrentStep] = useState(DEFAULT_STEP);
  const [isClient, setIsClient] = useState(false);
  const totalSteps = APPLICATION_STEPS.length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(applicationSchema) as any,
    mode: 'onChange',
  });

  const { restoreDraft } = useDraftPersistence(form);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    restoreDraft();
  }, [restoreDraft]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps],
  );

  const next = useCallback(async () => {
    // Validate current step fields before moving next
    const currentStepConfig = APPLICATION_STEPS[currentStep];
    const fieldsToValidate = currentStepConfig.validationFields;

    let isValid = true;
    if (fieldsToValidate && fieldsToValidate.length > 0) {
      // TS ignores the dynamic path, so we cast to any for trigger
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isValid = await form.trigger(fieldsToValidate as any);
    }

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, form, totalSteps]);

  const previous = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const progress = calculateProgress(currentStep, totalSteps);

  const stepContextValue = {
    currentStep,
    totalSteps,
    next,
    previous,
    goToStep,
    progress,
  };

  // Prevent hydration mismatch by returning null until client-side mounts
  if (!isClient) return null;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ApplicationFormContext.Provider value={form as any}>
      <ApplicationStepContext.Provider value={stepContextValue}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RHFProvider {...(form as any)}>{children}</RHFProvider>
      </ApplicationStepContext.Provider>
    </ApplicationFormContext.Provider>
  );
}

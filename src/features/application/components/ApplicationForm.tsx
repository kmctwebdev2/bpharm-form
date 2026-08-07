'use client';

import React from 'react';
import { useApplicationStep } from '../hooks/useApplicationStep';
import { APPLICATION_STEPS } from '../constants/application-steps';
import { FormContainer } from '@/components/form/FormContainer';
import { Stepper } from '@/components/form/Stepper';
import { NavigationButtons } from '@/components/form/NavigationButtons';
import { StepHeader } from '@/components/form/StepHeader';
import { FormSection } from '@/components/form/FormSection';

export function ApplicationForm() {
  const { currentStep } = useApplicationStep();
  const stepConfig = APPLICATION_STEPS[currentStep];
  const StepComponent = stepConfig.component;

  return (
    <FormContainer>
      <div className="bg-card shadow-sm border rounded-xl p-6 md:p-8">
        <Stepper />
        <StepHeader title={stepConfig.title} description={stepConfig.description} />
        <FormSection>
          <form onSubmit={(e) => e.preventDefault()}>
            <StepComponent />
          </form>
        </FormSection>
        <NavigationButtons />
      </div>
    </FormContainer>
  );
}

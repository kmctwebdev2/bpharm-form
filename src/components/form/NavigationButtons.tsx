import React from 'react';
import { Button } from '@/components/ui/button';
import { useApplicationStep } from '@/features/application/hooks/useApplicationStep';
import { isFirstStep, isLastStep } from '@/features/application/utils/step-helpers';

export function NavigationButtons() {
  const { currentStep, totalSteps, next, previous } = useApplicationStep();

  const firstStep = isFirstStep(currentStep);
  const lastStep = isLastStep(currentStep, totalSteps);

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={previous}
        disabled={firstStep}
        className="w-24"
      >
        Previous
      </Button>

      {lastStep ? (
        <Button
          type="button"
          className="w-24 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled // Submit is disabled until Preview step logic is implemented
        >
          Submit
        </Button>
      ) : (
        <Button type="button" onClick={next} className="w-24">
          Next
        </Button>
      )}
    </div>
  );
}

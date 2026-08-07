import { createContext, useContext } from 'react';

interface StepContextValue {
  currentStep: number;
  totalSteps: number;
  next: () => void;
  previous: () => void;
  goToStep: (step: number) => void;
  progress: number;
}

export const ApplicationStepContext = createContext<StepContextValue | null>(null);

export function useApplicationStep() {
  const context = useContext(ApplicationStepContext);
  if (!context) {
    throw new Error('useApplicationStep must be used within an ApplicationProvider');
  }
  return context;
}

import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationInput } from '../schemas/application.schema';

export const ApplicationFormContext = createContext<UseFormReturn<ApplicationInput> | null>(null);

export function useApplicationForm() {
  const context = useContext(ApplicationFormContext);
  if (!context) {
    throw new Error('useApplicationForm must be used within an ApplicationProvider');
  }
  return context;
}

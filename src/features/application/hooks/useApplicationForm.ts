import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationInput } from '../schemas/application.schema';

export interface ApplicationFormContextType {
  form: UseFormReturn<ApplicationInput>;
  clearDraft: () => void;
  resumeSaving: () => void;
  pendingUploads: number;
  incrementUploads: () => void;
  decrementUploads: () => void;
}

export const ApplicationFormContext = createContext<ApplicationFormContextType | null>(null);

export function useApplicationForm() {
  const context = useContext(ApplicationFormContext);
  if (!context) {
    throw new Error('useApplicationForm must be used within an ApplicationProvider');
  }
  return context.form;
}

export function useApplicationFormContext() {
  const context = useContext(ApplicationFormContext);
  if (!context) {
    throw new Error('useApplicationFormContext must be used within an ApplicationProvider');
  }
  return context;
}

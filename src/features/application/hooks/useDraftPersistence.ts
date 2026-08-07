import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationInput } from '../schemas/application.schema';
import { FORM_STORAGE_KEY, FORM_VERSION } from '../constants/form';

interface DraftData {
  version: string;
  data: Partial<ApplicationInput>;
  timestamp: number;
}

export function useDraftPersistence(form: UseFormReturn<ApplicationInput>) {
  const isRestored = useRef(false);

  // Debounced save
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Don't save if we haven't restored the initial load yet
      if (!isRestored.current) return;

      const handler = setTimeout(() => {
        try {
          const draft: DraftData = {
            version: FORM_VERSION,
            data: value as Partial<ApplicationInput>,
            timestamp: Date.now(),
          };
          localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(draft));
        } catch (error) {
          console.error('Failed to save draft:', error);
        }
      }, 1000); // 1s debounce

      return () => clearTimeout(handler);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Restore draft
  const restoreDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const draft: DraftData = JSON.parse(saved);
        if (draft.version === FORM_VERSION && draft.data) {
          form.reset(draft.data as ApplicationInput);
        }
      }
    } catch (error) {
      console.error('Failed to restore draft:', error);
      localStorage.removeItem(FORM_STORAGE_KEY);
    } finally {
      isRestored.current = true;
    }
  }, [form]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  return { restoreDraft, clearDraft };
}

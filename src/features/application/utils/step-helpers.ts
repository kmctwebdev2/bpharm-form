/**
 * Calculates the progress percentage of the multi-step form.
 * @param currentStep The current 0-indexed step
 * @param totalSteps The total number of steps
 * @returns The progress percentage (0-100)
 */
export function calculateProgress(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 1) return 100;
  // Progress is calculated based on completed steps.
  // E.g., at step 0 out of 5, progress is 0%.
  // At step 4 (last step) out of 5, progress is 100%.
  const percentage = (currentStep / (totalSteps - 1)) * 100;
  return Math.min(Math.max(Math.round(percentage), 0), 100);
}

/**
 * Checks if the current step is the first step.
 */
export function isFirstStep(currentStep: number): boolean {
  return currentStep === 0;
}

/**
 * Checks if the current step is the last step.
 */
export function isLastStep(currentStep: number, totalSteps: number): boolean {
  return currentStep === totalSteps - 1;
}

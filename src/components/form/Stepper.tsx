import React from 'react';
import { useApplicationStep } from '@/features/application/hooks/useApplicationStep';
import { APPLICATION_STEPS } from '@/features/application/constants/application-steps';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Stepper() {
  const { currentStep, progress } = useApplicationStep();

  return (
    <div className="mb-8">
      {/* Mobile View: Compact Progress Bar */}
      <div className="md:hidden space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>
            Step {currentStep + 1} of {APPLICATION_STEPS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          {APPLICATION_STEPS[currentStep].title}
        </div>
      </div>

      {/* Desktop View: Full Stepper */}
      <div className="hidden md:flex items-center justify-between">
        {APPLICATION_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10 group">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-colors duration-300',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted bg-background text-muted-foreground',
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <div className="absolute top-12 text-center w-32 -ml-11">
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </div>

              {/* Connecting Line */}
              {index < APPLICATION_STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 relative -top-3">
                  <div className="absolute inset-0 bg-muted rounded-full" />
                  <div
                    className="absolute inset-0 bg-primary transition-all duration-300 rounded-full"
                    style={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Spacer for absolute positioned desktop labels */}
      <div className="hidden md:block h-8" />
    </div>
  );
}

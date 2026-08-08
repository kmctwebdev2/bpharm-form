import React, { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">{children}</div>
    </div>
  );
}

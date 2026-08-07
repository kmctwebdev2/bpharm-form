import React, { ReactNode } from 'react';

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

export function FormSection({ children, className = '' }: FormSectionProps) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}

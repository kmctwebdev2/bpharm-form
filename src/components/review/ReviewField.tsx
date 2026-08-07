import React from 'react';

interface ReviewFieldProps {
  label: string;
  value: string | number | undefined | null;
  className?: string;
}

export function ReviewField({ label, value, className = '' }: ReviewFieldProps) {
  // Hide the field completely if there's no valid value
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

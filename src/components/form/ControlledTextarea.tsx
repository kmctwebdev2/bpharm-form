import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ControlledTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
}

export function ControlledTextarea({ name, label, ...props }: ControlledTextareaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2 w-full">
          <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
            {label}
          </Label>
          <Textarea
            id={name}
            {...field}
            {...props}
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}

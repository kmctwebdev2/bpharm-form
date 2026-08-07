import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ControlledNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  hideLabel?: boolean;
}

export function ControlledNumberInput({
  name,
  label,
  hideLabel,
  ...props
}: ControlledNumberInputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {!hideLabel && label && (
            <Label htmlFor={name} className={`block mb-2 ${error ? 'text-destructive' : ''}`}>
              {label}
            </Label>
          )}
          <Input
            id={name}
            type="number"
            {...field}
            value={field.value ?? ''} // Ensure null/undefined converts to empty string
            {...props}
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {error && <p className="text-xs text-destructive mt-1 font-medium">{error.message}</p>}
        </div>
      )}
    />
  );
}

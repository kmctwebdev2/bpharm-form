import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ControlledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  uppercase?: boolean;
}

export function ControlledInput({
  name,
  label,
  uppercase,
  onChange,
  ...props
}: ControlledInputProps) {
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
          <Input
            id={name}
            {...field}
            {...props}
            onChange={(e) => {
              const value = uppercase ? e.target.value.toUpperCase() : e.target.value;
              field.onChange(value);
              if (onChange) onChange(e);
            }}
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}

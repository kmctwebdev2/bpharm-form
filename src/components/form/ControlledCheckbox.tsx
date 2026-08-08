import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ControlledCheckboxProps {
  name: string;
  label: string;
  description?: string;
}

export function ControlledCheckbox({ name, label, description }: ControlledCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <Checkbox id={name} checked={field.value ?? false} onCheckedChange={field.onChange} />
          <div className="space-y-1 leading-none">
            <Label htmlFor={name} className={`cursor-pointer ${error ? 'text-destructive' : ''}`}>
              {label}
            </Label>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive mt-2">{error.message}</p>}
          </div>
        </div>
      )}
    />
  );
}

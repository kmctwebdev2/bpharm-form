import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Option {
  value: string;
  label: string;
}

interface ControlledRadioGroupProps {
  name: string;
  label: string;
  options: Option[];
}

export function ControlledRadioGroup({ name, label, options }: ControlledRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-3">
          <Label className={error ? 'text-destructive' : 'text-sm font-medium text-foreground'}>
            {label.includes('*') ? (
              <>
                {label.split('*')[0]} <span className="text-destructive">*</span>
                {label.split('*')[1] && (
                  <span className="block text-xs font-normal text-muted-foreground mt-1">
                    {label.split('*')[1]}
                  </span>
                )}
              </>
            ) : (
              label
            )}
          </Label>
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value ?? ''}
            className="flex flex-col space-y-1"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                <Label htmlFor={`${name}-${option.value}`} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}

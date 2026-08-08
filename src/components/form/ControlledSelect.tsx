import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Option {
  value: string;
  label: string;
}

interface ControlledSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
}

export function ControlledSelect({ name, label, options, placeholder }: ControlledSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2 w-full">
          <Label
            htmlFor={name}
            className={error ? 'text-destructive' : 'text-sm font-medium text-foreground'}
          >
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
          <Select
            onValueChange={field.onChange}
            value={
              field.value !== undefined && field.value !== '' ? String(field.value) : 'Not Selected'
            }
          >
            <SelectTrigger
              id={name}
              className={error ? 'border-destructive focus:ring-destructive' : ''}
            >
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface ControlledFileUploadProps {
  name: string;
  label: string;
  accept?: string;
  maxSize?: number;
}

export function ControlledFileUpload({ name, label }: ControlledFileUploadProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <div className="space-y-2 w-full">
          <Label className={error ? 'text-destructive' : ''}>{label}</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground ${
              error ? 'border-destructive/50' : ''
            }`}
          >
            <p className="text-sm text-center">File upload component coming in next phase.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}

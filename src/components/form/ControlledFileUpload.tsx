import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileIcon, X, CheckCircle } from 'lucide-react';

interface ControlledFileUploadProps {
  name: string;
  label: string;
  accept: string;
  maxSizeLabel: string;
}

export function ControlledFileUpload({
  name,
  label,
  accept,
  maxSizeLabel,
}: ControlledFileUploadProps) {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const file = value as File | undefined;

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            onChange(selectedFile);
          }
        };

        const handleRemove = () => {
          onChange(undefined);
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        };

        return (
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

            <div
              className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors
                ${error ? 'border-destructive/50 bg-destructive/5' : 'border-muted-foreground/25 bg-muted/50 hover:bg-muted'}
                ${file ? 'border-primary/50 bg-primary/5' : ''}
              `}
            >
              <input
                type="file"
                ref={inputRef}
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                id={name}
              />

              {!file ? (
                <>
                  <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {accept
                      .replace(/image\//g, '')
                      .replace(/application\//g, '')
                      .toUpperCase()}{' '}
                    up to {maxSizeLabel}
                  </p>
                  <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                    Select File
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    {file?.type?.includes('image') ? (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <FileIcon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate max-w-[200px] mb-1">{file.name}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => inputRef.current?.click()}
                    >
                      Replace
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
                      <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive font-medium mt-2">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}

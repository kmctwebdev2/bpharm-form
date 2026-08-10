import React, { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileIcon, X, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // value is now the Cloudinary metadata object: { url, publicId, resourceType, name, size }
        const fileData = value as
          | {
              url: string;
              publicId: string;
              resourceType: string;
              name: string;
              size: number;
            }
          | undefined;

        const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFile = e.target.files?.[0];
          if (!selectedFile) return;

          setIsUploading(true);

          try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Optional: specify a folder, or let the backend default it.
            // formData.append('folder', 'admissions/documents');

            const res = await fetch('/api/uploads/cloudinary', {
              method: 'POST',
              body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
              throw new Error(json.message || 'Upload failed');
            }

            onChange(json.data);
            toast.success(`${selectedFile.name} uploaded successfully.`);
          } catch {
            toast.error('Unable to upload the file. Please try again.');
          } finally {
            setIsUploading(false);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }
        };

        const handleRemove = async () => {
          if (!fileData) {
            // Not uploaded yet, just clear (shouldn't be possible but defensive check)
            onChange(undefined);
            return;
          }

          setIsRemoving(true);

          try {
            const res = await fetch('/api/uploads/cloudinary', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                publicId: fileData.publicId,
                resourceType: fileData.resourceType,
              }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
              throw new Error(json.message || 'Deletion failed');
            }

            onChange(undefined);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          } catch {
            toast.error('Unable to remove the uploaded file. Please try again.');
          } finally {
            setIsRemoving(false);
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
                ${fileData ? 'border-primary/50 bg-primary/5' : ''}
                ${isUploading || isRemoving ? 'opacity-50 pointer-events-none' : ''}
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

              {isUploading ? (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-sm font-medium">Uploading...</p>
                </div>
              ) : !fileData ? (
                <>
                  <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Click to upload</p>
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
                    {fileData.resourceType === 'image' ||
                    fileData.name.match(/\.(jpg|jpeg|png)$/i) ? (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <FileIcon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate max-w-[200px] mb-1">{fileData.name}</p>
                  <p className="text-xs text-muted-foreground mb-4 text-green-600 font-semibold">
                    Uploaded
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemove}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Removing...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" /> Remove
                        </>
                      )}
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

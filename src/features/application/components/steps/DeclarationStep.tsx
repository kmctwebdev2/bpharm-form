import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { ControlledCheckbox } from '@/components/form/ControlledCheckbox';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { Label } from '@/components/ui/label';

export function DeclarationStep() {
  const { control } = useFormContext();
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  // Watch the signature file from the uploads step
  const signatureFile = useWatch({
    control,
    name: 'uploads.signature',
  });

  useEffect(() => {
    let objectUrl: string | null = null;
    if (signatureFile && signatureFile instanceof File) {
      objectUrl = URL.createObjectURL(signatureFile);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSignaturePreview(objectUrl);
    } else {
      setSignaturePreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [signatureFile]);

  return (
    <div className="space-y-6">
      <div className="shadow-none bg-transparent p-0">
        <CardContent className="space-y-6 p-0">
          <div className="rounded-md">
            <ControlledCheckbox
              name="declaration.accepted"
              label="I hereby declare that the information furnished above is true and correct to the best of my knowledge."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ControlledInput
              name="declaration.place"
              label="Place"
              placeholder="Enter your location"
            />
            <ControlledDatePicker name="declaration.date" label="Date" />
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-medium text-foreground">Signature Preview</Label>
            <div className="relative flex items-center justify-center w-48 h-24 bg-muted/50 border-2 border-dashed rounded-md overflow-hidden p-2">
              {signaturePreview ? (
                <Image
                  src={signaturePreview}
                  alt="Candidate Signature"
                  fill
                  className="object-contain"
                />
              ) : (
                <p className="text-xs text-muted-foreground">No signature uploaded.</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              This signature was uploaded in the Documents step.
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}

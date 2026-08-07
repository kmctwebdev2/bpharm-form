import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSection } from '@/components/form/FormSection';
import { SectionHeader } from '@/components/form/SectionHeader';

export function ReviewStep() {
  return (
    <FormSection>
      <SectionHeader
        title="Review & Preview"
        description="Verify all entered data before submission"
      />
      <Card>
        <CardHeader>
          <CardTitle>Review Your Application</CardTitle>
          <CardDescription>
            This is a placeholder for the final review step. In the next phase, this section will
            display a comprehensive summary of all your entered details, uploaded documents, and
            declarations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 bg-muted/50 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-sm font-medium">
              Review & Preview implementation coming in the next phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </FormSection>
  );
}

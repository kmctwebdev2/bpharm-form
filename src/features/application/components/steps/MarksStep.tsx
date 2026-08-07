import React from 'react';
import { MarksTable } from './marks/MarksTable';

export function MarksStep() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium mb-2">Marks Obtained (Optional)</h4>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your marks below. If you have not received your marks yet, you may skip this step.
        </p>
        <MarksTable />
      </div>
    </div>
  );
}

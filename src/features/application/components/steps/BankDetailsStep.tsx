import React from 'react';
import { ControlledInput } from '@/components/form/ControlledInput';

export function BankDetailsStep() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium mb-2">Bank Details (Optional)</h4>
        <p className="text-sm text-muted-foreground mb-6">
          Provide your bank account information. You may skip this step if you prefer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlledInput
            name="bankDetails.accountHolderName"
            label="Account Holder Name"
            placeholder="Full name as in bank"
          />
          <ControlledInput
            name="bankDetails.bankName"
            label="Bank Name"
            placeholder="e.g. State Bank of India"
          />
          <ControlledInput name="bankDetails.branch" label="Branch" placeholder="Branch name" />
          <ControlledInput
            name="bankDetails.accountNumber"
            label="Account Number"
            placeholder="Numbers only"
          />
          <ControlledInput
            name="bankDetails.ifscCode"
            label="IFSC Code"
            placeholder="e.g. SBIN0001234"
            uppercase
          />
        </div>
      </div>
    </div>
  );
}

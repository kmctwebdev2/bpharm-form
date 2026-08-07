'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledTextarea } from '@/components/form/ControlledTextarea';
import { ControlledRadioGroup } from '@/components/form/ControlledRadioGroup';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Gender } from '@/constants/enums';

export function PersonalDetailsStep() {
  const { setValue, control } = useFormContext();
  const [sameAsPermanent, setSameAsPermanent] = React.useState(false);

  const permanentAddress = useWatch({
    control,
    name: 'personalDetails.permanentAddress',
  });

  useEffect(() => {
    if (sameAsPermanent) {
      setValue('personalDetails.communicationAddress', permanentAddress || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [sameAsPermanent, permanentAddress, setValue]);

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlledInput
          name="personalDetails.name"
          label="Applicant Name *"
          placeholder="Enter full name"
        />
        <ControlledDatePicker name="personalDetails.dateOfBirth" label="Date of Birth *" />
        <ControlledInput
          name="personalDetails.email"
          label="Email Address *"
          type="email"
          placeholder="example@domain.com"
        />
        <ControlledInput
          name="personalDetails.religion"
          label="Religion *"
          placeholder="Enter religion"
        />
        <ControlledRadioGroup
          name="personalDetails.gender"
          label="Gender *"
          options={[
            { label: 'Male', value: Gender.MALE },
            { label: 'Female', value: Gender.FEMALE },
            { label: 'Other', value: Gender.OTHER },
          ]}
        />
      </div>

      <div className="border-t pt-6" />

      {/* Family & Income */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlledInput
          name="personalDetails.fatherName"
          label="Father's Name *"
          placeholder="Enter father's name"
        />
        <ControlledInput
          name="personalDetails.motherName"
          label="Mother's Name *"
          placeholder="Enter mother's name"
        />
        <ControlledInput
          name="personalDetails.annualIncome"
          label="Annual Income (₹) *"
          type="number"
          placeholder="Enter annual family income"
          min={0}
        />
      </div>

      <div className="border-t pt-6" />

      {/* Addresses */}
      <div className="space-y-6">
        <ControlledTextarea
          name="personalDetails.permanentAddress"
          label="Permanent Address *"
          placeholder="Enter complete permanent address"
          rows={3}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="same-address"
            checked={sameAsPermanent}
            onCheckedChange={(checked) => setSameAsPermanent(checked === true)}
          />
          <Label htmlFor="same-address" className="text-sm font-medium leading-none cursor-pointer">
            Communication Address same as Permanent Address
          </Label>
        </div>

        <ControlledTextarea
          name="personalDetails.communicationAddress"
          label="Communication Address *"
          placeholder="Enter complete communication address"
          rows={3}
          disabled={sameAsPermanent}
        />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { ControlledFileUpload } from '@/components/form/ControlledFileUpload';
import { ACCEPTED_FILE_TYPES } from '../../constants/file-limits';

export function UploadsStep() {
  const imageAccept = ACCEPTED_FILE_TYPES.IMAGE.join(',');
  const pdfAccept = ACCEPTED_FILE_TYPES.PDF.join(',');

  return (
    <div className="space-y-8">
      {/* Images Section */}
      <div>
        <h4 className="text-lg font-medium mb-4 pb-2 border-b">Photographs & Signatures</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlledFileUpload
            name="uploads.photo"
            label="Candidate Photo *"
            accept={imageAccept}
            maxSizeLabel="1MB"
          />
          <ControlledFileUpload
            name="uploads.signature"
            label="Candidate Signature *"
            accept={imageAccept}
            maxSizeLabel="1MB"
          />
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <h4 className="text-lg font-medium mb-4 pb-2 border-b">Certificates & Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlledFileUpload
            name="uploads.sslcCertificate"
            label="SSLC Certificate *"
            accept={pdfAccept}
            maxSizeLabel="5MB"
          />
          <ControlledFileUpload
            name="uploads.aadhaar"
            label="Aadhaar Card (Optional)"
            accept={pdfAccept}
            maxSizeLabel="2MB"
          />
        </div>
      </div>
    </div>
  );
}

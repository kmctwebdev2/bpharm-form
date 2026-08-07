import { ApplicationProvider } from '@/features/application/store/ApplicationProvider';
import { ApplicationForm } from '@/features/application/components/ApplicationForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for Admission | B.Pharm',
  description: 'Multi-step application form for B.Pharm admission.',
};

export default function ApplyPage() {
  return (
    <ApplicationProvider>
      <ApplicationForm />
    </ApplicationProvider>
  );
}

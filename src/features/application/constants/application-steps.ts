import { PersonalDetailsStep } from '../components/steps/PersonalDetailsStep';
import { QualificationStep } from '../components/steps/QualificationStep';
import { MarksStep } from '../components/steps/MarksStep';
import { UploadsStep } from '../components/steps/UploadsStep';
import { PreviewStep } from '../components/steps/PreviewStep';

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  validationFields?: string[];
}

export const APPLICATION_STEPS: StepConfig[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Basic information and communication details',
    component: PersonalDetailsStep,
    validationFields: ['personalDetails'], // Fields to validate before moving next
  },
  {
    id: 'qualification',
    title: 'Qualification',
    description: 'Academic details of previous study',
    component: QualificationStep,
    validationFields: ['qualification'],
  },
  {
    id: 'marks',
    title: 'Marks',
    description: 'Marks obtained in subjects',
    component: MarksStep,
    validationFields: ['marks'],
  },
  {
    id: 'uploads',
    title: 'Uploads',
    description: 'Upload required documents',
    component: UploadsStep,
    validationFields: ['uploads'],
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Review your application before submission',
    component: PreviewStep,
    validationFields: [], // Final step doesn't need to validate specific sub-fields on "Next", as it's "Submit"
  },
];

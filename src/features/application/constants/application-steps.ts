import { PersonalDetailsStep } from '../components/steps/PersonalDetailsStep';
import { QualificationStep } from '../components/steps/QualificationStep';
import { MarksStep } from '../components/steps/MarksStep';
import { UploadsStep } from '../components/steps/UploadsStep';
import { BankDetailsStep } from '../components/steps/BankDetailsStep';
import { DeclarationStep } from '../components/steps/DeclarationStep';

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  validationFields?: string[];
  isOptional?: boolean;
}

export const APPLICATION_STEPS: StepConfig[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Basic information and communication details',
    component: PersonalDetailsStep,
    validationFields: ['personalDetails'],
  },
  {
    id: 'uploads',
    title: 'Upload Documents',
    description: 'Upload required documents',
    component: UploadsStep,
    validationFields: ['uploads'],
  },
  {
    id: 'qualification',
    title: 'Qualification Details',
    description: 'Academic details of previous study',
    component: QualificationStep,
    validationFields: ['qualification'],
  },
  {
    id: 'marks',
    title: 'Marks Obtained',
    description: 'Marks obtained in subjects (Optional)',
    component: MarksStep,
    validationFields: ['marks'],
    isOptional: true,
  },
  {
    id: 'bank-details',
    title: 'Bank Details',
    description: 'Provide your bank account details (Optional)',
    component: BankDetailsStep,
    validationFields: [], // Will add fields when schema is defined
    isOptional: true,
  },
  {
    id: 'declaration',
    title: 'Declaration',
    description: 'Final confirmation and submission',
    component: DeclarationStep,
    validationFields: [],
  },
];

import { Gender, Subject } from '@/constants/enums';

/**
 * Represents personal details of the applicant.
 */
export interface PersonalDetails {
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  email: string;
  fatherName: string;
  motherName: string;
  religion: string;
  annualIncome: number;
  permanentAddress: string;
  communicationAddress: string;
}

/**
 * Represents academic qualification details.
 */
export interface Qualification {
  course: string;
  board: string;
  registerNumber: string;
  year: number;
  month: string;
}

/**
 * Represents marks for a single subject.
 */
export interface Mark {
  subject: Subject;
  maximumMarks: number;
  obtainedMarks: number;
  numberOfChances: number;
}

/**
 * Represents metadata of an uploaded file.
 */
export interface UploadMetadata {
  publicId: string;
  url: string;
  originalName: string;
  size: number;
  format: string;
}

/**
 * Represents the uploaded documents section.
 */
export interface Uploads {
  photo: UploadMetadata;
  signature: UploadMetadata;
  sslcCertificate: UploadMetadata;
  aadhaar: UploadMetadata;
  plusTwoCertificate: UploadMetadata;
}

/**
 * Represents the complete application form data.
 */
export interface Application {
  admissionNumber?: string;
  personalDetails: PersonalDetails;
  qualification: Qualification;
  marks: Mark[];
  uploads: Uploads;
}

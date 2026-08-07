import { Document } from 'mongoose';

export interface IPersonalDetails {
  name: string;
  gender: string;
  dateOfBirth: Date;
  email: string;
  fatherName: string;
  motherName: string;
  religion: string;
  annualIncome: number;
  permanentAddress: string;
  communicationAddress: string;
}

export interface IQualification {
  course: string;
  board: string;
  registerNumber: string;
  year: number;
  month: string;
  certificate?: string; // URL from Cloudinary
}

export interface IMark {
  subjectCode: string;
  subjectName: string;
  maximumMarks?: number;
  marksSecured?: number;
  numberOfChances?: number;
}

export interface IUploads {
  photo?: string;
  signature?: string;
  sslcCertificate?: string;
  aadhaar?: string;
}

export interface IBankDetails {
  accountHolderName?: string;
  bankName?: string;
  branch?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface IDeclaration {
  accepted: boolean;
  place: string;
  date: Date;
}

export interface IApplication extends Document {
  applicationNumber: string;
  sequence: number;
  personalDetails: IPersonalDetails;
  qualification: IQualification;
  marks: IMark[];
  uploads: IUploads;
  bankDetails?: IBankDetails;
  declaration: IDeclaration;
  createdAt: Date;
  updatedAt: Date;
}

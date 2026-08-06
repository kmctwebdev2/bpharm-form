import mongoose, { Schema, Document, Model } from 'mongoose';
import { Gender, Subject } from '@/constants/enums';

// Sub-schemas for better organization
const uploadMetadataSchema = new Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    format: { type: String, required: true },
  },
  { _id: false },
);

const markSchema = new Schema(
  {
    subject: { type: String, enum: Object.values(Subject), required: true },
    maximumMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    numberOfChances: { type: Number, required: true },
  },
  { _id: false },
);

// Main Application Interface
export interface IApplication extends Document {
  admissionNumber?: string;
  personalDetails: {
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
  };
  qualification: {
    course: string;
    board: string;
    registerNumber: string;
    year: number;
    month: string;
  };
  marks: Array<{
    subject: Subject;
    maximumMarks: number;
    obtainedMarks: number;
    numberOfChances: number;
  }>;
  uploads: {
    photo: { publicId: string; url: string; originalName: string; size: number; format: string };
    signature: {
      publicId: string;
      url: string;
      originalName: string;
      size: number;
      format: string;
    };
    sslcCertificate: {
      publicId: string;
      url: string;
      originalName: string;
      size: number;
      format: string;
    };
    aadhaar: { publicId: string; url: string; originalName: string; size: number; format: string };
    plusTwoCertificate: {
      publicId: string;
      url: string;
      originalName: string;
      size: number;
      format: string;
    };
  };
}

// Main Application Schema
const applicationSchema = new Schema<IApplication>(
  {
    admissionNumber: { type: String, unique: true, sparse: true },
    personalDetails: {
      name: { type: String, required: true, trim: true },
      gender: { type: String, enum: Object.values(Gender), required: true },
      dateOfBirth: { type: Date, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      fatherName: { type: String, required: true, trim: true },
      motherName: { type: String, required: true, trim: true },
      religion: { type: String, required: true, trim: true },
      annualIncome: { type: Number, required: true, min: 0 },
      permanentAddress: { type: String, required: true, trim: true },
      communicationAddress: { type: String, required: true, trim: true },
    },
    qualification: {
      course: { type: String, required: true, trim: true },
      board: { type: String, required: true, trim: true },
      registerNumber: { type: String, required: true, trim: true },
      year: { type: Number, required: true },
      month: { type: String, required: true, trim: true },
    },
    marks: {
      type: [markSchema],
      required: true,
    },
    uploads: {
      photo: { type: uploadMetadataSchema, required: true },
      signature: { type: uploadMetadataSchema, required: true },
      sslcCertificate: { type: uploadMetadataSchema, required: true },
      aadhaar: { type: uploadMetadataSchema, required: true },
      plusTwoCertificate: { type: uploadMetadataSchema, required: true },
    },
  },
  { timestamps: true },
);

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;

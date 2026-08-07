import mongoose, { Schema } from 'mongoose';
import { IApplication } from '@/types/application';

const PersonalDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    religion: { type: String, required: true },
    annualIncome: { type: Number, required: true },
    permanentAddress: { type: String, required: true },
    communicationAddress: { type: String, required: true },
  },
  { _id: false },
);

const QualificationSchema = new Schema(
  {
    course: { type: String, required: true },
    board: { type: String, required: true },
    registerNumber: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: String, required: true },
    certificate: { type: String },
  },
  { _id: false },
);

const MarkSchema = new Schema(
  {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    maximumMarks: { type: Number },
    marksSecured: { type: Number },
    numberOfChances: { type: Number },
  },
  { _id: false },
);

const UploadsSchema = new Schema(
  {
    photo: { type: String },
    signature: { type: String },
    sslcCertificate: { type: String },
    aadhaar: { type: String },
  },
  { _id: false },
);

const BankDetailsSchema = new Schema(
  {
    accountHolderName: { type: String },
    bankName: { type: String },
    branch: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
  },
  { _id: false },
);

const DeclarationSchema = new Schema(
  {
    accepted: { type: Boolean, required: true },
    place: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { _id: false },
);

const ApplicationSchema = new Schema<IApplication>(
  {
    applicationNumber: { type: String, required: true, unique: true, index: true },
    sequence: { type: Number, required: true, unique: true },
    personalDetails: { type: PersonalDetailsSchema, required: true },
    qualification: { type: QualificationSchema, required: true },
    marks: { type: [MarkSchema], default: [] },
    uploads: { type: UploadsSchema, required: true },
    bankDetails: { type: BankDetailsSchema },
    declaration: { type: DeclarationSchema, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
ApplicationSchema.index({ createdAt: -1 });

export const Application =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICounter extends Document<string> {
  _id: string;
  nextSequence: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    nextSequence: { type: Number, default: 1001 },
  },
  { _id: false, versionKey: false },
);

// Prevent mongoose from recompiling the model in development (HMR)
export const Counter =
  mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);

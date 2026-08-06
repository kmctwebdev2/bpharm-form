import mongoose, { Schema, Model } from 'mongoose';

export interface ICounter {
  _id: string;
  sequence: number;
}

const counterSchema = new Schema<ICounter>({
  _id: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    default: 3000,
  },
});

const Counter: Model<ICounter> =
  mongoose.models.Counter || mongoose.model<ICounter>('Counter', counterSchema);

export default Counter;

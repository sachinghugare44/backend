import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId?: mongoose.Types.ObjectId | null;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  receipt?: string;
  notes?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    paymentId: {
      type: String,
      default: null,
      trim: true
    },
    signature: {
      type: String,
      default: null,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    currency: {
      type: String,
      required: true,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },
    receipt: {
      type: String,
      default: null
    },
    notes: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);

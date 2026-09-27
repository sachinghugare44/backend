import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export interface CreateOrderInput {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface VerifySignatureInput {
  order_id: string;
  payment_id: string;
  signature: string;
}

const razorpay = new Razorpay({
  key_id: keyId || "",
  key_secret: keySecret || ""
});

export const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {}
}: CreateOrderInput) => {
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.");
  }

  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    notes
  });

  return order;
};

export const verifyRazorpaySignature = ({
  order_id,
  payment_id,
  signature
}: VerifySignatureInput) => {
  if (!keySecret) {
    throw new Error("Razorpay secret is missing");
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  return generatedSignature === signature;
};

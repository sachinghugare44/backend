import mongoose from "mongoose";

const userOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  userMobile: {
    type: String,
    required: false,
    index: true
  },
  otpCode: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userOtpSchema.index({ email: 1, otpCode: 1, used: 1 });

export default mongoose.model("UserOtp", userOtpSchema);

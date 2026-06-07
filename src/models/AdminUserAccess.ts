import mongoose from "mongoose";

const adminUserAccessSchema = new mongoose.Schema({
  userMobile: {
    type: String,
    required: true,
    index: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  finalMonthSubmit: {
    type: Boolean,
    required: true,
    default: false
  },
  monthStatus: {
    type: String,
    required: true,
    enum: ["regular-month", "non-regular-month"],
    default: "regular-month"
  },
  adminNote: {
    type: String,
    default: ""
  }
}, { timestamps: true });

adminUserAccessSchema.index({ userMobile: 1, year: 1, month: 1 }, { unique: true });

export default mongoose.model("AdminUserAccess", adminUserAccessSchema);

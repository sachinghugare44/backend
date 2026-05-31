import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userMobile: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent", "Leave", "Holiday", "WFH", "Half Day", "Other"]
  },
  note: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
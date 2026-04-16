import mongoose from "mongoose";

const studentDetailsSchema = new mongoose.Schema({
  stud_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  middle_name: { type: String },
  last_name: { type: String, required: true },
  mobile_no: { type: String, required: true },
  address: { type: String },
  date_addmission: { type: Date },
  birth_date: { type: Date },
  parent_name: { type: String },
  parent_mobile: { type: String },
  gender: { type: String },
  stud_batch: { type: String },
  section_std: { type: String },
  status: { type: String },
  updated_date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("StudentDetails", studentDetailsSchema);

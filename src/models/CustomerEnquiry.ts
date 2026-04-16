import mongoose from "mongoose";

const customerEnquirySchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  mobile_number: { type: String, required: true },
  enquiry_text: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model("CustomerEnquiry", customerEnquirySchema);

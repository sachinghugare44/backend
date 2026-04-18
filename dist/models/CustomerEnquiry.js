"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerEnquirySchema = new mongoose_1.default.Schema({
    customer_name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    enquiry_text: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("CustomerEnquiry", customerEnquirySchema);

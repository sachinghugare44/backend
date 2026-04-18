"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentDetailsSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("StudentDetails", studentDetailsSchema);

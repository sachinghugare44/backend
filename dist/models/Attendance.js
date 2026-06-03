"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const attendanceSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Attendance", attendanceSchema);

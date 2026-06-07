"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userOtpSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("UserOtp", userOtpSchema);

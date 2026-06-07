"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminUserAccessSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("AdminUserAccess", adminUserAccessSchema);

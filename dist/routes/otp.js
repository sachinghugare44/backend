"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = __importDefault(require("../models/User"));
const UserOtp_1 = __importDefault(require("../models/UserOtp"));
const router = express_1.default.Router();
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
function createTransporter() {
    if (!EMAIL_USER || !EMAIL_PASS) {
        throw new Error("Missing SMTP credentials: set EMAIL_USER and EMAIL_PASS in your environment.");
    }
    return nodemailer_1.default.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
}
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// Send OTP to registered user email
router.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, mobile } = req.body;
        if (!email && !mobile) {
            return res.status(400).json({ message: "Email or mobile is required to send OTP" });
        }
        let targetEmail;
        let targetMobile;
        if (email) {
            // simple email syntax validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            targetEmail = email;
            const user = yield User_1.default.findOne({ email });
            if (user)
                targetMobile = user.mobile;
        }
        else if (mobile) {
            const user = yield User_1.default.findOne({ mobile });
            if (!user) {
                return res.status(404).json({ message: "User not found by mobile" });
            }
            if (!user.email) {
                return res.status(400).json({ message: "User does not have an email address" });
            }
            targetEmail = user.email;
            targetMobile = user.mobile;
        }
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        yield UserOtp_1.default.create({
            email: targetEmail,
            userMobile: targetMobile,
            otpCode,
            expiresAt,
            used: false
        });
        const mailOptions = {
            from: EMAIL_FROM,
            to: targetEmail,
            subject: "Attendance OTP Code",
            text: `Your OTP code is ${otpCode}. It expires in 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otpCode}</strong>. It expires in 10 minutes.</p>`
        };
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to email" });
    }
    catch (error) {
        console.log("OTP send error", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
}));
// Verify OTP and return user info
router.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otpCode } = req.body;
        if (!email || !otpCode) {
            return res.status(400).json({ message: "Email and otpCode are required" });
        }
        const otpRecord = yield UserOtp_1.default.findOne({
            email,
            otpCode,
            used: false,
            expiresAt: { $gt: new Date() }
        });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        otpRecord.used = true;
        yield otpRecord.save();
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            // OTP valid but user not registered yet
            return res.status(200).json({ message: "OTP verified successfully", userExists: false, data: { email } });
        }
        res.status(200).json({ message: "OTP verified successfully", userExists: true, data: user });
    }
    catch (error) {
        console.log("OTP verify error", error);
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
}));
exports.default = router;

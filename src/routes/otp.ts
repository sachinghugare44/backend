import express from "express";
import nodemailer from "nodemailer";
import User from "../models/User";
import UserOtp from "../models/UserOtp";

const router = express.Router();

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

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to registered user email
router.post("/send", async (req, res) => {
  try {
    const { email, mobile } = req.body;
    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or mobile is required to send OTP" });
    }

    let targetEmail: string | undefined;
    let targetMobile: string | undefined;

    if (email) {
      // simple email syntax validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      targetEmail = email;
      const user = await User.findOne({ email });
      if (user) targetMobile = user.mobile;
    } else if (mobile) {
      const user = await User.findOne({ mobile });
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

    await UserOtp.create({
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

    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error: any) {
    console.log("OTP send error", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

// Verify OTP and return user info
router.post("/verify", async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ message: "Email and otpCode are required" });
    }

    const otpRecord = await UserOtp.findOne({
      email,
      otpCode,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ email });
    if (!user) {
      // OTP valid but user not registered yet
      return res.status(200).json({ message: "OTP verified successfully", userExists: false, data: { email } });
    }

    res.status(200).json({ message: "OTP verified successfully", userExists: true, data: user });
  } catch (error: any) {
    console.log("OTP verify error", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
});

export default router;

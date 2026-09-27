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
exports.verifyRazorpaySignature = exports.createRazorpayOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = new razorpay_1.default({
    key_id: keyId || "",
    key_secret: keySecret || ""
});
const createRazorpayOrder = (_a) => __awaiter(void 0, [_a], void 0, function* ({ amount, currency = "INR", receipt, notes = {} }) {
    if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.");
    }
    if (!amount || amount <= 0) {
        throw new Error("Amount must be greater than 0");
    }
    const order = yield razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes
    });
    return order;
});
exports.createRazorpayOrder = createRazorpayOrder;
const verifyRazorpaySignature = ({ order_id, payment_id, signature }) => {
    if (!keySecret) {
        throw new Error("Razorpay secret is missing");
    }
    const generatedSignature = crypto_1.default
        .createHmac("sha256", keySecret)
        .update(`${order_id}|${payment_id}`)
        .digest("hex");
    return generatedSignature === signature;
};
exports.verifyRazorpaySignature = verifyRazorpaySignature;

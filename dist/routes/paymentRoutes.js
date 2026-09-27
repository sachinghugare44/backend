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
const Payment_1 = __importDefault(require("../models/Payment"));
const paymentService_1 = require("../services/paymentService");
const router = express_1.default.Router();
router.post("/create-order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency = "INR", receipt, notes, userId } = req.body;
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount is required and must be greater than 0"
            });
        }
        const order = yield (0, paymentService_1.createRazorpayOrder)({
            amount: Number(amount),
            currency,
            receipt,
            notes
        });
        yield Payment_1.default.create({
            userId: userId || null,
            orderId: order.id,
            amount: Number(amount),
            currency: order.currency || currency,
            status: "created",
            receipt: order.receipt || receipt,
            notes: notes || {}
        });
        return res.status(200).json({
            message: "Razorpay order created successfully",
            data: order
        });
    }
    catch (error) {
        console.log("Create order error:", error);
        return res.status(500).json({
            message: "Error creating Razorpay order",
            error: error.message
        });
    }
}));
router.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, payment_id, signature, userId } = req.body;
        if (!order_id || !payment_id || !signature) {
            return res.status(400).json({
                message: "order_id, payment_id and signature are required"
            });
        }
        const isValid = (0, paymentService_1.verifyRazorpaySignature)({
            order_id,
            payment_id,
            signature
        });
        if (!isValid) {
            yield Payment_1.default.findOneAndUpdate({ orderId: order_id }, { status: "failed", paymentId: payment_id, signature }, { new: true });
            return res.status(400).json({
                message: "Payment verification failed",
                valid: false
            });
        }
        const payment = yield Payment_1.default.findOneAndUpdate({ orderId: order_id }, {
            paymentId: payment_id,
            signature,
            status: "paid",
            userId: userId || null
        }, { new: true });
        return res.status(200).json({
            message: "Payment verified successfully",
            valid: true,
            data: payment
        });
    }
    catch (error) {
        console.log("Verify payment error:", error);
        return res.status(500).json({
            message: "Error verifying payment",
            error: error.message
        });
    }
}));
exports.default = router;

import express from "express";
import Payment from "../models/Payment";
import {
  createRazorpayOrder,
  verifyRazorpaySignature
} from "../services/paymentService";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes, userId } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount is required and must be greater than 0"
      });
    }

    const order = await createRazorpayOrder({
      amount: Number(amount),
      currency,
      receipt,
      notes
    });

    await Payment.create({
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
  } catch (error: any) {
    console.log("Create order error:", error);
    return res.status(500).json({
      message: "Error creating Razorpay order",
      error: error.message
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { order_id, payment_id, signature, userId } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        message: "order_id, payment_id and signature are required"
      });
    }

    const isValid = verifyRazorpaySignature({
      order_id,
      payment_id,
      signature
    });

    if (!isValid) {
      await Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: "failed", paymentId: payment_id, signature },
        { new: true }
      );

      return res.status(400).json({
        message: "Payment verification failed",
        valid: false
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId: order_id },
      {
        paymentId: payment_id,
        signature,
        status: "paid",
        userId: userId || null
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Payment verified successfully",
      valid: true,
      data: payment
    });
  } catch (error: any) {
    console.log("Verify payment error:", error);
    return res.status(500).json({
      message: "Error verifying payment",
      error: error.message
    });
  }
});

export default router;

import express from "express";
import CustomerEnquiry from "../models/CustomerEnquiry";

const router = express.Router();

// Create customer enquiry
router.post("/", async (req, res) => {
  try {
    const { customer_name, mobile_number, enquiry_text } = req.body;
    const enquiry = new CustomerEnquiry({ customer_name, mobile_number, enquiry_text });
    const savedEnquiry = await enquiry.save();
    res.status(201).json({ message: "Customer enquiry created", data: savedEnquiry });
  } catch (error) {
    let errorMsg = "";
    if (error instanceof Error) {
      errorMsg = error.message;
    } else {
      errorMsg = String(error);
    }
    res.status(500).json({ message: "Error creating enquiry", error: errorMsg });
  }
});

// Get all customer enquiries
router.get("/", async (req, res) => {
  try {
    const enquiries = await CustomerEnquiry.find();
    res.status(200).json({ message: "Customer enquiries fetched", data: enquiries });
  } catch (error) {
    let errorMsg = "";
    if (error instanceof Error) {
      errorMsg = error.message;
    } else {
      errorMsg = String(error);
    }
    res.status(500).json({ message: "Error fetching enquiries", error: errorMsg });
  }
});

export default router;

import express from "express";
import StudentDetails from "../models/StudentDetails";

const router = express.Router();

// Create student details
//
router.post("/", async (req, res) => {
  try {
    const student = new StudentDetails(req.body);
    const savedStudent = await student.save();
    res.status(201).json({ message: "Student details created", data: savedStudent });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating student details", error: error.message });
  }
});

// Get all student details (with optional filters)
router.get("/", async (req, res) => {
  try {
    const filter = { ...req.query };
    const students = await StudentDetails.find(filter);
    res.status(200).json({ message: "Student details fetched", data: students });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching student details", error: error.message });
  }
});

// Get student details by stud_id
router.get("/:stud_id", async (req, res) => {
  try {
    const student = await StudentDetails.findOne({ stud_id: req.params.stud_id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student details fetched", data: student });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching student details", error: error.message });
  }
});

export default router;

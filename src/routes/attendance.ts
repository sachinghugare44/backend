import express from "express";
import Attendance from "../models/Attendance";

const router = express.Router();

// Mark attendance for a user (by mobile)
router.post("/mark", async (req, res) => {
  try {
    const { userMobile, date, status, note } = req.body;
    if (!userMobile || !date || !status) {
      return res.status(400).json({ message: "userMobile, date, and status are required" });
    }
    // Upsert: update if exists, else create
    const attendance = await Attendance.findOneAndUpdate(
      { userMobile, date: new Date(date) },
      { status, note },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: "Attendance marked", data: attendance });
  } catch (error: any) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
});

// Get attendance history for a user by month
router.get("/history/:userMobile/:year/:month", async (req, res) => {
  try {
    const { userMobile, year, month } = req.params;
    if (!userMobile || !year || !month) {
      return res.status(400).json({ message: "userMobile, year, and month are required" });
    }
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    const records = await Attendance.find({
      userMobile,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });
    res.status(200).json({ message: "Attendance history fetched", data: records });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching attendance history", error: error.message });
  }
});

export default router;

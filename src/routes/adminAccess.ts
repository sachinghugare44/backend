import express from "express";
import AdminUserAccess from "../models/AdminUserAccess";

const router = express.Router();

// Create or update admin access record for a user's month
router.post("/", async (req, res) => {
  try {
    const { userMobile, year, month, finalMonthSubmit, monthStatus, adminNote } = req.body;
    if (!userMobile || !year || !month) {
      return res.status(400).json({ message: "userMobile, year, and month are required" });
    }

    const record = await AdminUserAccess.findOneAndUpdate(
      { userMobile, year, month },
      {
        finalMonthSubmit: Boolean(finalMonthSubmit),
        monthStatus: monthStatus || "regular-month",
        adminNote: adminNote || ""
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Admin access record saved", data: record });
  } catch (error: any) {
    res.status(500).json({ message: "Error saving admin access record", error: error.message });
  }
});

// Get admin access record for a specific user/month
router.get("/:userMobile/:year/:month", async (req, res) => {
  try {
    const { userMobile, year, month } = req.params;
    if (!userMobile || !year || !month) {
      return res.status(400).json({ message: "userMobile, year, and month are required" });
    }

    const record = await AdminUserAccess.findOne({
      userMobile,
      year: Number(year),
      month: Number(month)
    });

    if (!record) {
      return res.status(404).json({ message: "Admin access record not found" });
    }

    res.status(200).json({ message: "Admin access record fetched", data: record });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching admin access record", error: error.message });
  }
});

// Update finalMonthSubmit status for a specific user/month
router.patch("/:userMobile/:year/:month/finalsubmit", async (req, res) => {
  try {
    const { userMobile, year, month } = req.params;
    const { finalMonthSubmit } = req.body;

    if (finalMonthSubmit === undefined) {
      return res.status(400).json({ message: "finalMonthSubmit is required" });
    }

    const record = await AdminUserAccess.findOneAndUpdate(
      { userMobile, year: Number(year), month: Number(month) },
      { finalMonthSubmit: Boolean(finalMonthSubmit) },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Admin access record not found" });
    }

    res.status(200).json({ message: "Final submit status updated", data: record });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating final submit status", error: error.message });
  }
});

// Update monthStatus for a specific user/month
router.patch("/:userMobile/:year/:month/status", async (req, res) => {
  try {
    const { userMobile, year, month } = req.params;
    const { monthStatus } = req.body;

    if (!monthStatus || !["regular-month", "non-regular-month"].includes(monthStatus)) {
      return res.status(400).json({ message: "monthStatus must be 'regular-month' or 'non-regular-month'" });
    }

    const record = await AdminUserAccess.findOneAndUpdate(
      { userMobile, year: Number(year), month: Number(month) },
      { monthStatus },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Admin access record not found" });
    }

    res.status(200).json({ message: "Month status updated", data: record });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating month status", error: error.message });
  }
});

// List admin access records for a user
router.get("/user/:userMobile", async (req, res) => {
  try {
    const { userMobile } = req.params;
    const records = await AdminUserAccess.find({ userMobile }).sort({ year: 1, month: 1 });
    res.status(200).json({ message: "Admin access records fetched", data: records });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching admin access records", error: error.message });
  }
});

export default router;

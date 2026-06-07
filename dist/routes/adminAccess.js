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
const AdminUserAccess_1 = __importDefault(require("../models/AdminUserAccess"));
const router = express_1.default.Router();
// Create or update admin access record for a user's month
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile, year, month, finalMonthSubmit, monthStatus, adminNote } = req.body;
        if (!userMobile || !year || !month) {
            return res.status(400).json({ message: "userMobile, year, and month are required" });
        }
        const record = yield AdminUserAccess_1.default.findOneAndUpdate({ userMobile, year, month }, {
            finalMonthSubmit: Boolean(finalMonthSubmit),
            monthStatus: monthStatus || "regular-month",
            adminNote: adminNote || ""
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.status(200).json({ message: "Admin access record saved", data: record });
    }
    catch (error) {
        res.status(500).json({ message: "Error saving admin access record", error: error.message });
    }
}));
// Get admin access record for a specific user/month
router.get("/:userMobile/:year/:month", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile, year, month } = req.params;
        if (!userMobile || !year || !month) {
            return res.status(400).json({ message: "userMobile, year, and month are required" });
        }
        const record = yield AdminUserAccess_1.default.findOne({
            userMobile,
            year: Number(year),
            month: Number(month)
        });
        if (!record) {
            return res.status(404).json({ message: "Admin access record not found" });
        }
        res.status(200).json({ message: "Admin access record fetched", data: record });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching admin access record", error: error.message });
    }
}));
// Update finalMonthSubmit status for a specific user/month
router.patch("/:userMobile/:year/:month/finalsubmit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile, year, month } = req.params;
        const { finalMonthSubmit } = req.body;
        if (finalMonthSubmit === undefined) {
            return res.status(400).json({ message: "finalMonthSubmit is required" });
        }
        const record = yield AdminUserAccess_1.default.findOneAndUpdate({ userMobile, year: Number(year), month: Number(month) }, { finalMonthSubmit: Boolean(finalMonthSubmit) }, { new: true });
        if (!record) {
            return res.status(404).json({ message: "Admin access record not found" });
        }
        res.status(200).json({ message: "Final submit status updated", data: record });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating final submit status", error: error.message });
    }
}));
// Update monthStatus for a specific user/month
router.patch("/:userMobile/:year/:month/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile, year, month } = req.params;
        const { monthStatus } = req.body;
        if (!monthStatus || !["regular-month", "non-regular-month"].includes(monthStatus)) {
            return res.status(400).json({ message: "monthStatus must be 'regular-month' or 'non-regular-month'" });
        }
        const record = yield AdminUserAccess_1.default.findOneAndUpdate({ userMobile, year: Number(year), month: Number(month) }, { monthStatus }, { new: true });
        if (!record) {
            return res.status(404).json({ message: "Admin access record not found" });
        }
        res.status(200).json({ message: "Month status updated", data: record });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating month status", error: error.message });
    }
}));
// List admin access records for a user
router.get("/user/:userMobile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile } = req.params;
        const records = yield AdminUserAccess_1.default.find({ userMobile }).sort({ year: 1, month: 1 });
        res.status(200).json({ message: "Admin access records fetched", data: records });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching admin access records", error: error.message });
    }
}));
exports.default = router;

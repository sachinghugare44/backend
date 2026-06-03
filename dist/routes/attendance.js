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
const Attendance_1 = __importDefault(require("../models/Attendance"));
const router = express_1.default.Router();
// Mark attendance for a user (by mobile)
router.post("/mark", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile, date, status, note } = req.body;
        if (!userMobile || !date || !status) {
            return res.status(400).json({ message: "userMobile, date, and status are required" });
        }
        // Upsert: update if exists, else create
        const attendance = yield Attendance_1.default.findOneAndUpdate({ userMobile, date: new Date(date) }, { status, note }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.status(200).json({ message: "Attendance marked", data: attendance });
    }
    catch (error) {
        res.status(500).json({ message: "Error marking attendance", error: error.message });
    }
}));
// Get attendance history for a user by month
router.get("/history/:userMobile/:year/:month", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMobile, year, month } = req.params;
        if (!userMobile || !year || !month) {
            return res.status(400).json({ message: "userMobile, year, and month are required" });
        }
        const start = new Date(Number(year), Number(month) - 1, 1);
        const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
        const records = yield Attendance_1.default.find({
            userMobile,
            date: { $gte: start, $lte: end }
        }).sort({ date: 1 });
        res.status(200).json({ message: "Attendance history fetched", data: records });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching attendance history", error: error.message });
    }
}));
exports.default = router;

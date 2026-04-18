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
const StudentDetails_1 = __importDefault(require("../models/StudentDetails"));
const router = express_1.default.Router();
// Create student details
//
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = new StudentDetails_1.default(req.body);
        const savedStudent = yield student.save();
        res.status(201).json({ message: "Student details created", data: savedStudent });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating student details", error: error.message });
    }
}));
// Get all student details (with optional filters)
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = Object.assign({}, req.query);
        const students = yield StudentDetails_1.default.find(filter);
        res.status(200).json({ message: "Student details fetched", data: students });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student details", error: error.message });
    }
}));
// Get student details by stud_id
router.get("/:stud_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = yield StudentDetails_1.default.findOne({ stud_id: req.params.stud_id });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student details fetched", data: student });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student details", error: error.message });
    }
}));
exports.default = router;

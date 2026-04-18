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
const CustomerEnquiry_1 = __importDefault(require("../models/CustomerEnquiry"));
const router = express_1.default.Router();
// Create customer enquiry
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_name, mobile_number, enquiry_text } = req.body;
        const enquiry = new CustomerEnquiry_1.default({ customer_name, mobile_number, enquiry_text });
        const savedEnquiry = yield enquiry.save();
        res.status(201).json({ message: "Customer enquiry created", data: savedEnquiry });
    }
    catch (error) {
        let errorMsg = "";
        if (error instanceof Error) {
            errorMsg = error.message;
        }
        else {
            errorMsg = String(error);
        }
        res.status(500).json({ message: "Error creating enquiry", error: errorMsg });
    }
}));
// Get all customer enquiries
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enquiries = yield CustomerEnquiry_1.default.find();
        res.status(200).json({ message: "Customer enquiries fetched", data: enquiries });
    }
    catch (error) {
        let errorMsg = "";
        if (error instanceof Error) {
            errorMsg = error.message;
        }
        else {
            errorMsg = String(error);
        }
        res.status(500).json({ message: "Error fetching enquiries", error: errorMsg });
    }
}));
exports.default = router;

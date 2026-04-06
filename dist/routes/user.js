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
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, mobile } = req.body;
        const newUser = new User_1.default({
            name,
            email,
            password,
            mobile
        });
        console.log("Creating new user...", newUser);
        const savedUser = yield newUser.save();
        console.log("User created:", savedUser);
        res.status(201).json({
            message: "User created successfully",
            data: savedUser
        });
    }
    catch (error) {
        console.log("ERROR 👉", error); // 👈 add this
        res.status(500).json({
            message: "Error creating user",
            error: error.message // 👈 enable this
        });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });
    }
    catch (error) {
        console.log("ERROR 👉", error);
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
}));
exports.default = router;

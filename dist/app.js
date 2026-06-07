"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const studentDetails_1 = __importDefault(require("./routes/studentDetails"));
const customerEnquiry_1 = __importDefault(require("./routes/customerEnquiry"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const adminAccess_1 = __importDefault(require("./routes/adminAccess"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/user", user_1.default);
app.use("/student-details", studentDetails_1.default);
app.use("/customer-enquiry", customerEnquiry_1.default);
app.use("/attendance", attendance_1.default);
app.use("/admin-access", adminAccess_1.default);
// Test API
app.get("/", (req, res) => {
    res.send("API is working but good 🚀");
});
const PORT = process.env.PORT || 5000;
// DB Connection
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.log("DB Error ❌", err);
});

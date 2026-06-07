import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import studentDetailsRoutes from "./routes/studentDetails";
import customerEnquiryRoutes from "./routes/customerEnquiry";
import attendanceRoutes from "./routes/attendance";
import adminAccessRoutes from "./routes/adminAccess";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/student-details", studentDetailsRoutes);
app.use("/customer-enquiry", customerEnquiryRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/admin-access", adminAccessRoutes);

// Test API
app.get("/", (req, res) => {
  res.send("API is working but good 🚀");
});

const PORT = process.env.PORT || 5000;

// DB Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.log("DB Error ❌", err);
  });


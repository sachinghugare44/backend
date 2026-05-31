import express from "express";
import User from "../models/User";

const router = express.Router();
//user registration POST /api/users
// User registration POST /api/users
router.post("/", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if mobile already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        message: "Mobile number already registered"
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      mobile
    });
    console.log("Creating new user...", newUser);
    const savedUser = await newUser.save();
    console.log("User created:", savedUser);
    res.status(201).json({
      message: "User created successfully",
      data: savedUser
    });
  } catch (error: any) {
    console.log("ERROR 👉", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
});

// User login/validation POST /user/login
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      console.log("Mobile or password missing in request body", mobile, password  );
      return res.status(400).json({ message: "Mobile and password are required" });
    }
    const user = await User.findOne({ mobile });
    if (!user) {
            console.log("Mobile or password missing in request body", mobile, password  );

      return res.status(404).json({ message: "User not registered" });
    }
    if (user.password !== password) {
      console.log("Invalid password for mobile:", mobile);
      return res.status(401).json({ message: "Invalid password" });
    } 
    res.status(200).json({ message: "Login successful", data: user });
    console.log("Login successful for mobile:", user);
  } catch (error: any) {
    console.log("ERROR 👉", error);
    res.status(500).json({
      message: "Error validating user",
      error: error.message
    });
  }
});

//user fetching GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "Users fetched successfully",
      data: users
    });
    

  } catch (error: any) {
    console.log("ERROR 👉", error);

    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
});
router.get("/mobile/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: user
    });
  } catch (error: any) {
    console.log("ERROR 👉", error);
    res.status(500).json({
      message: "Error fetching user by mobile",
      error: error.message
    });
  }
});
export default router;
// Get user details by mobile (unique)

import express from "express";
import User from "../models/User";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      mobile
    });
console.log("Creating new user...",newUser);
    const savedUser = await newUser.save();
    console.log("User created:", savedUser);
    res.status(201).json({
      message: "User created successfully",
      data: savedUser
    });

  } catch (error: any) {
  console.log("ERROR 👉", error); // 👈 add this

  res.status(500).json({
    message: "Error creating user",
    error: error.message // 👈 enable this
  });
}
});


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
export default router;
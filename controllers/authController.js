import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //1. if the inputs are invalid
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "The credential are not completed" });
    }

    const user = await User.findOne({ username }).select("password");

    //checking of the user exist or not
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //matching the password
    const isMatch = await bcrypt.compare(password, user.password);

    //if the password is not matched
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    //Generating the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //login successful
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    //this will be the first check if the data is empty
    if (!name || !username || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //checking if the user already exist
    const existUser = await User.findOne({ username });

    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    //creating the new user and then storing the data in the database

    const newUser = new User({
      name: name,
      username: username,
      password: password,
    });

    await newUser.save();

    res.status(201).json({ message: "User Registerd" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

//this is for the forgot password 
const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide your username" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set expire
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset URL (example)
    const resetUrl = `${req.protocol}://${req.get(
      "host",
    )}/api/auth/reset-password/${resetToken}`;

    // Send response (replace with actual email later)
    res.status(200).json({
      message: "Password reset link generated",
      resetUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Phase 9: Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // token from URL
    const { password } = req.body; // new password

    if (!password) {
      return res.status(400).json({ message: "Please provide a new password" });
    }

    // Hash the incoming token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    user.password = password;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { registerUser, loginUser, getMe, forgotPassword, resetPassword };

import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authmiddleware.js";
const router = express.Router();

//this is for the register route
router.post("/register", registerUser);
//this is for the login route
router.post("/login", loginUser);

router.get("/me", protect, getMe);

//this is for the forgot password route
router.post("/forgot-password", forgotPassword);

//this is for the reset passward route
router.put("/reset-password/:token", resetPassword);

export default router;

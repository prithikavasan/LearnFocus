import express from "express";
import { 
  register, 
  login, 
  googleAuth, 
  forgotPassword, 
  resetPassword 
} from "../controllers/authController.js";

const router = express.Router();

// Registration
router.post("/register", register);

// Login
router.post("/login", login);

// Google OAuth login/signup
router.post("/google", googleAuth);

// Forgot Password - send reset link to email
router.post("/forgot-password", forgotPassword);

// Reset Password - set new password using token
router.put("/reset-password/:token", resetPassword);

export default router;

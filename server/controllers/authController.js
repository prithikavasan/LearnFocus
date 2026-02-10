import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/* ============================
   🔹 NORMAL REGISTER
============================ */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role !== role) {
        return res.status(400).json({
          message: `This email is already registered as ${existingUser.role}. You cannot register as ${role}.`,
        });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password,
      role,
      authProvider: "local",
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   🔹 NORMAL LOGIN
============================ */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.authProvider === "google") {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: `This email is registered as ${user.role}. You cannot log in as ${role}.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   🔹 GOOGLE AUTH
============================ */
export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      if (user.role !== role) {
        return res.status(400).json({
          message: `This email is already registered as ${user.role}. You cannot log in as ${role}.`,
        });
      }
    } else {
      user = await User.create({
        name,
        email,
        role,
        authProvider: "google",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Google authentication successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   🔹 FORGOT PASSWORD
============================ */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Google accounts cannot reset password. Use Google Sign In.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      You requested a password reset.
      Click the link below to reset your password:
      
      ${resetUrl}

      This link will expire in 1 hour.
    `;

    await sendEmail(user.email, "Password Reset Request", message);

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
    message: "Email failed",
    error: error.message,
  });
  }
};

/* ============================
   🔹 RESET PASSWORD
============================ */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // ✅ JUST SET PASSWORD — model hook will hash it
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

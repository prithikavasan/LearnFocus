import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null, // 👈 Google users won’t have password
    },

    role: {
      type: String,
      enum: ["student", "mentor"],
      default: "student",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    learningGoal: {
      type: String,
      default: "",
    },

    streak: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String], // array of selected skills
      default: [],
    },

    // 🔹 Fields for Forgot / Reset Password
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔹 Pre-save hook to hash password if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export default mongoose.model("User", userSchema);

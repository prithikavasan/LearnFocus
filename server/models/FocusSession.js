import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ENDED"],
      default: "ACTIVE",
    },

    mobileConnected: {
      type: Boolean,
      default: false,
    },

    violations: {
      type: Number,
      default: 0,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    endTime: {
      type: Date,
    },
    duration: {
    type: Number, // seconds
    default: 1500, // 25 minutes
  },
  },
  { timestamps: true }
);

export default mongoose.model("FocusSession", focusSessionSchema);

import mongoose from "mongoose";
import crypto from "crypto";

/* ================= STUDENT SUBDOCUMENT ================= */
const studentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isMuted: {
      type: Boolean,
      default: false,
    },

    isInactive: {
      type: Boolean,
      default: false,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ================= TOPIC ================= */
const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ================= COURSE ================= */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    topics: [topicSchema],
    completed: { type: Boolean, default: false },
  },
  
  { timestamps: true }
);

/* ================= TASK ================= */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    isOptional: {
      type: Boolean,
      default: false,
    },
 completed: { type: Boolean, default: false },
    studentOverrides: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        extendedDeadline: Date,
      },
    ],
  },
  { timestamps: true }
);

/* ================= MATERIAL ================= */
const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ================= MAIN ROOM SCHEMA ================= */
const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    roomCode: {
      type: String,
      unique: true,
      uppercase: true,
      required: true,
      index: true,
      default: () =>
        crypto.randomBytes(4).toString("hex").toUpperCase(),
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      default: 50,
      min: 1,
    },

    /* ================= COURSES ================= */
    courses: [courseSchema],

    /* ================= TASKS ================= */
    tasks: [taskSchema],

    /* ================= FOCUS SETTINGS ================= */
    focusSettings: {
      sessionDuration: {
        type: Number,
        default: 25,
        min: 5,
      },

      breakDuration: {
        type: Number,
        default: 5,
        min: 1,
      },

      mandatorySessionsPerDay: {
        type: Number,
        default: 1,
        min: 0,
      },

      maxDistractions: {
        type: Number,
        default: 3,
        min: 0,
      },

      mobileSyncRequired: {
        type: Boolean,
        default: false,
      },
    },

    /* ================= COMMUNICATION ================= */
    communication: {
      groupChatEnabled: {
        type: Boolean,
        default: true,
      },

      quietHoursStart: {
        type: String,
        default: "",
      },

      quietHoursEnd: {
        type: String,
        default: "",
      },
    },

    /* ================= LIVE SESSION ================= */
    liveSessions: [
  {
    meetingLink: { type: String, trim: true, default: "" },
    isRecordingEnabled: { type: Boolean, default: false },
    recurringDays: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
  }
],

    /* ================= MATERIALS ================= */
    materials: [materialSchema],

    /* ================= STUDENTS ================= */
    students: [studentSchema],

    /* ================= ROOM RULES ================= */
    rules: {
      allowLateJoin: {
        type: Boolean,
        default: true,
      },

      requireMentorApproval: {
        type: Boolean,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ================= PRE SAVE VALIDATION ================= */
roomSchema.pre("save", function () {
  if (this.startTime && this.endTime) {
    if (this.endTime <= this.startTime) {
      throw new Error("End time must be after start time");
    }
  }
});



/* ================= EXPORT ================= */
export default mongoose.model("Room", roomSchema);

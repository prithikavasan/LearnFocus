import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedLessons: [
      {
        moduleIndex: Number,
        lessonIndex: Number,
      },
    ],

    completedModules: [
      {
        moduleIndex: Number,
      },
    ],

    isCourseCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourseProgress", courseProgressSchema);

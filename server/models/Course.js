import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
   modules: [
  {
    title: { type: String, required: true },
    description: { type: String },

    lessons: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: ["text", "video", "pdf", "link"],
          default: "text",
        },
        content: {
  type: String,
  default: ""   // ✅ content can be added later
}

      },
    ],
  },
],

    status: { type: String, enum: ["draft", "published"], default: "draft" },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    thumbnail: { type: String }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);

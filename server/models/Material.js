import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["pdf","video","link","code"], required: true },
    url: { type: String, required: true },
    skill: { type: String, required: true },   // "dsa", "react", etc.
    topic: { type: String, required: true },   // "Arrays", "Hooks", etc.
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);

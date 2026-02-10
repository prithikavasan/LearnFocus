import mongoose from "mongoose";

const suggestedMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["video","article","practice"], required: true },
    url: { type: String, required: true },
    skill: { type: String, required: true },
    topic: { type: String, required: true },
    triggerCondition: { type: String, default: "topicNotCompleted" },
  },
  { timestamps: true }
);

export default mongoose.model("SuggestedMaterial", suggestedMaterialSchema);

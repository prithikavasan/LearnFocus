import express from "express";
import Material from "../models/Material.js";
import SuggestedMaterial from "../models/SuggestedMaterial.js";
const router = express.Router();

// Upload instructor material
router.post("/materials", async (req, res) => {
  const { title, type, url, skill, topic, uploadedBy } = req.body;
  try {
    const material = new Material({ title, type, url, skill, topic, uploadedBy });
    await material.save();
    res.json({ message: "Material uploaded successfully", material });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload material" });
  }
});

// Get materials for a skill/topic
router.get("/materials/:skill/:topic", async (req, res) => {
  const { skill, topic } = req.params;
  try {
    const instructorMaterials = await Material.find({ skill, topic });
    res.json({ instructorMaterials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/suggested-materials", async (req, res) => {
  const { title, type, url, skill, topic, triggerCondition } = req.body;
  try {
    const suggested = new SuggestedMaterial({
      title,
      type,
      url,
      skill,
      topic,
      triggerCondition,
    });

    await suggested.save();
    res.json({ message: "Suggested material uploaded successfully", suggested });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload suggested material" });
  }
});

// Optional: GET suggested materials for a skill/topic
router.get("/suggested-materials/:skill/:topic", async (req, res) => {
  const { skill, topic } = req.params;
  try {
    const suggestedMaterials = await SuggestedMaterial.find({ skill, topic });
    res.json({ suggestedMaterials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;

// server/routes/courseSuggestions.js
import express from "express";
import fetch from "node-fetch";
const router = express.Router();

router.post("/ai-suggest", async (req, res) => {
  const { category } = req.body;

  // Use Hugging Face free model
  const HF_API = "https://api-inference.huggingface.co/models/gpt2"; // example
  const headers = { Authorization: `Bearer ${process.env.HF_API_KEY}` };

  const prompt = `Suggest 3 modules and 3 lessons for a ${category} course, include lesson description and optional YouTube link`;

  const response = await fetch(HF_API, {
    method: "POST",
    headers,
    body: JSON.stringify({ inputs: prompt }),
  });

  const data = await response.json();
  res.json(data);
});

export default router;

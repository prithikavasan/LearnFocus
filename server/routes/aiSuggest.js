// server/routes/aiSuggest.js
import express from "express";
import 'dotenv/config';
import { InferenceClient } from "@huggingface/inference";

const router = express.Router();

// Initialize Hugging Face client
const client = new InferenceClient(process.env.HF_API_KEY);

router.post("/", async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  try {
    // Send instruction to the AI model
    const response = await client.chatCompletion({
      model: "zai-org/GLM-4.7-Flash:novita",
      messages: [
        {
          role: "user",
          content: `
Return ONLY valid JSON.
No explanation, no markdown.

Schema:
[
  {
    "moduleTitle": "Module name",
    "lessons": [
      {
        "title": "Lesson title",
        "description": "Short description",
        "youtube": "",
        "assessment": [
          { "type": "question", "question": "..." }
        ]
      }
    ]
  }
]

Create a ${category} course.
          `,
        },
      ],
      temperature: 0.2,
    });

    const aiText = response.choices[0].message.content;

    // Try to extract JSON safely
    const jsonMatch = aiText.match(/\[.*\]/s);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid AI JSON output" });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;

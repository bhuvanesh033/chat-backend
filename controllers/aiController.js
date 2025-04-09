// controllers/aiController.js
const axios = require('axios');

exports.askAI = async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenRouter AI error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Something went wrong" });
  }
};

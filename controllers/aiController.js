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

exports.smartSuggestions = async (req, res) => {
    try {
      const messageText = req.body.message;
  
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You're a helpful assistant suggesting 2-3 quick replies to a message in a chat. Keep responses short and casual."
            },
            {
              role: "user",
              content: `Suggest 2-3 smart replies to: "${messageText}"`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const suggestions = response.data.choices[0].message.content.split('\n').filter(Boolean);
      res.json({ suggestions });
    } catch (error) {
      console.error("AI smartSuggestions error:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || "Something went wrong" });
    }
  };
  
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post("/", async (req, res) => {
  const question = req.body.question;

  const systemPrompt = `
You are a helpful finance and loan advisor chatbot. Only answer questions related to loans, banking, or personal finance.
If the question is outside these topics, politely decline to answer.
Answer in a short, clear, professional style.
  `;

  try {
    const result = await model.generateContent([
      { role: "system", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: question }] }
    ]);
    const answer = result.response.text();
    res.json({ answer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ answer: "Sorry, there was an error processing your question." });
  }
});

module.exports = router;

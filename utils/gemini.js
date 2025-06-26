const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });


module.exports = async function generateAnalysis(banks) {
  const prompt = `Compare the following loans and show remarks and pros/cons for each and dont add star marks and all make it clean and tabulated:
${banks.map((b, i) => `${i + 1}. ${b.name} - ${b.type} - ₹${b.amount} - ${b.tenure} months`).join('\n')}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
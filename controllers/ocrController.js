const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const { extractWithGemini, generateGeminiPrompt } = require("../services/geminiService");
const { compareRegimes } = require("../services/taxService");

// Helper: remove ```json ... ``` if Gemini adds code formatting
const cleanJsonResponse = (rawText) => {
  return rawText
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();
};

exports.processDocument = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = path.join(__dirname, "../", req.file.path);
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = "";

    // 📄 Handle PDF
    if (ext === ".pdf") {
      const pdfBuffer = fs.readFileSync(filePath);
      try {
        const textData = await pdfParse(pdfBuffer);
        extractedText = textData.text;
      } catch (err) {
        return res.status(400).send("Invalid or scanned PDF. Try uploading a clear image or another PDF.");
      }
    }
    // 🖼️ Handle Images
    else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      const imageBuffer = fs.readFileSync(filePath);
      const result = await tesseract.recognize(imageBuffer, "eng");
      extractedText = result.data.text;
    }
    else {
      return res.status(400).send("Unsupported file type.");
    }

    // ✨ Process with Gemini
    const prompt = generateGeminiPrompt(extractedText);
    const rawResponse = await extractWithGemini(prompt);
    const cleanedJson = cleanJsonResponse(rawResponse);

    const data = JSON.parse(cleanedJson);
    const result = compareRegimes(data);
    const validate = req.session?.validate || [];

    res.render("result", { result, data, validate,showform : true });

  } catch (error) {
    console.error("Processing Error:", error);
    res.status(500).send("Something went wrong while processing your document.");
  }
};

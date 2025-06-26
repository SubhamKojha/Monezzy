const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.generateGeminiPrompt = (text) => `
You are an intelligent tax assistant. Extract the following fields from this OCR text of Form 16:

"""
${text}
"""

Return the result as **valid minified JSON** like:
{
  "name": "John Doe",
  "pan": "ABCDE1234F",
  "dob": "1990-05-15",
  "address": "123 Street, City, PIN",
  "employerName": "ABC Pvt Ltd",
  "employerPan": "AAAAA1111A",
  "employerTan": "MUMA12345B",
  "employerAddress": "456 Business Road, Mumbai",
  "assessmentYear": "2024-25",
  "employmentPeriod": "01-Apr-2023 to 31-Mar-2024",
  "basicSalary": 600000,
  "hraReceived": 200000,
  "specialAllowance": 200000,
  "grossSalary": 1000000,
  "exemptHRA": 120000,
  "exemptLTA": 30000,
  "gratuity": 0,
  "netSalary": 850000,
  "stdDeduction": 50000,
  "sec80C": 150000,
  "sec80D": 25000,
  "sec80E": 0,
  "sec80G": 0,
  "sec80TTA": 0,
  "sec80CCD1B": 50000,
  "totalDeductions": 225000,
  "totalIncomeAfterDeductions": 625000,
  "taxableIncome": 625000,
  "taxPayable": 41600,
  "rebate87A": 0,
  "relief89": 0,
  "totalTDS": 48000,
  "quarterlyTDS": [
    {"quarter": "Q1", "amount": 12000, "bsr": "1234567", "challan": "00123"},
    {"quarter": "Q2", "amount": 12000, "bsr": "1234567", "challan": "00124"},
    {"quarter": "Q3", "amount": 12000, "bsr": "1234567", "challan": "00125"},
    {"quarter": "Q4", "amount": 12000, "bsr": "1234567", "challan": "00126"}
  ],
  "regime": "old"
}

Fields to extract:

### Basic Information
- name
- pan
- dob
- address

### Employer Info
- employerName
- employerPan
- employerTan
- employerAddress
- assessmentYear
- employmentPeriod

### Salary Structure
- basicSalary
- hraReceived
- specialAllowance
- grossSalary

### Exemptions (u/s 10)
- exemptHRA
- exemptLTA
- gratuity (if applicable)

### Net Salary
- netSalary
- stdDeduction (Rs. 50,000 if not found)

### Deductions under Chapter VI-A
- sec80C
- sec80D
- sec80E
- sec80G
- sec80TTA
- sec80CCD1B
- totalDeductions

### Tax Computation
- totalIncomeAfterDeductions
- taxableIncome
- taxPayable
- rebate87A
- relief89

### TDS Info
- totalTDS
- quarterlyTDS (with quarter, amount, bsr, challan)

### Regime
- regime (default to "old" if not specified)

If a field is not found, set it to 0 (for numbers) or "" (for text).  
Return ONLY the raw JSON with no markdown or extra output.
`;


exports.extractWithGemini = async (prompt) => {
  const result = await model.generateContent(prompt);
  //console.log(result.response.candidates?.[0]?.content?.parts?.[0]?.text)
  return result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
};

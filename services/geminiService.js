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
  "name": "Jane Smith",
  "pan": "XYZAB9876Z",
  "dob": "1985-08-22",
  "adhar": "9999 8888 7777",
  "mobile": "9876543210",
  
  "basicSalary": 550000,
  "hraReceived": 180000,
  "specialAllowance": 150000,
  "grossSalary": 880000,
  
  "17(1)": 650000,
  "17(2)": 120000,
  "17(3)": 30000,
  "89A": 15000,
  
  "D1": 40000,
  "87A": 12500,
  "D3": 27500,
  "D4": 1100,
  "D5": 28600,
  "D6": 2000,
  
  "234A": 1200,
  "234B": 800,
  "234C": 500,
  "234F": 1000,
  
  "TotalTax": 31300,
  "TotalTaxesPaid": 35000,
  "Amountpayable": 0,
  "Refund": 3700,
  
  "exemptHRA": 100000,
  "exemptLTA": 25000,
  "gratuity": 0,
  
  "netSalary": 780000,
  "stdDeduction": 50000,
  
  "sec80C": 140000,
  "sec80D": 30000,
  "sec80E": 0,
  "sec80G": 0,
  "sec80TTA": 0,
  "sec80CCD1B": 50000,
  "totalDeductions": 220000,
  
  "totalIncomeAfterDeductions": 660000,
  "taxableIncome": 660000,
  "taxPayable": 40000,
  "rebate87A": 12500,
  "relief89": 2000,
  
  "totalTDS": 36000,
  "quarterlyTDS": [
    {
      "quarter": "Q1",
      "amount": 9000,
      "bsr": "1234567",
      "challan": "11111"
    },
    {
      "quarter": "Q2",
      "amount": 9000,
      "bsr": "1234568",
      "challan": "22222"
    },
    {
      "quarter": "Q3",
      "amount": 9000,
      "bsr": "1234569",
      "challan": "33333"
    },
    {
      "quarter": "Q4",
      "amount": 9000,
      "bsr": "1234570",
      "challan": "44444"
    }
  ],
  
  "regime": "old"
}

Fields to extract:

### Basic Information
- name
- pan
- dob
- adhar
- mobile

### Salary Structure
- basicSalary
- hraReceived
- specialAllowance
- grossSalary
- 17(1)
- 17(2)
- 17(3)
- 89A
- 89A
- D1: Tax payable on total income
- 87A
- D3: Tax after Rebate
- D4: Health and education Cess @ 4% on D3
- D5: Total Tax and Cess
- D6: Relief u/s 89
- 234A
- 234B
- 234C
- 234F
- TotalTax
- TotalTaxesPaid
- Amountpayable
- Refund

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
  console.log(result.response.candidates?.[0]?.content?.parts?.[0]?.text)
  return result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
};

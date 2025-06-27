const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });


module.exports = async function generateAnalysis(banks) {
 const prompt = `Generate a loan comparison table for the following banks in the format below. Only provide data for these columns, do not add any commentary or disclaimers, and do not use star marks. Fill missing or approximate data logically if needed.

Columns:
Bank, Type, Amount, Tenure, EMI, Total Repayment, Interest Rate, Processing Fee, Prepayment Charges, Pros, Cons

Loans:
${banks.map((b, i) => 
  `${i + 1}. ${b.name} - ${b.type} - ₹${b.amount} - ${b.tenure} months - Interest Rate: ${b.interestRate || 'estimate 10%'} - Processing Fee: ${b.processingFee || '₹500 approx'} - Prepayment Charges: ${b.prepaymentCharges || '2% approx'}`
).join('\n')}
`;
}
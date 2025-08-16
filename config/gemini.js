require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const client = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = { client };

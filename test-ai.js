import { GoogleGenerativeAI } from "@google/generative-ai";

// Key from firebase.ts
const apiKey = "AIzaSyAF5rs3cJFs_E6S7ouibqs7B2fgVRDLzc0";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        console.log("Testing API Key...");
        const result = await model.generateContent("Explain what is 5+5");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("API Error:", e.message);
    }
}

run();

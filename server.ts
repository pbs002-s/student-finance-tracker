import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client on server side
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Exchange rates endpoint (live fetch with fallback cache)
let cachedRates: Record<string, number> = {
  BDT: 1,
  USD: 0.0083,
  EUR: 0.0076,
  GBP: 0.0064,
  JPY: 1.28,
  INR: 0.71,
  CAD: 0.0113,
  AUD: 0.0125,
  SGD: 0.0111,
  AED: 0.0305,
  SAR: 0.0311,
  MYR: 0.0366,
  CNY: 0.0601,
  KRW: 11.45,
  BTC: 0.00000012,
  ETH: 0.0000031,
};
let lastFetchTime = 0;

app.get("/api/rates", async (req, res) => {
  const now = Date.now();
  // Refresh cache every hour if possible
  if (now - lastFetchTime > 3600000) {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/BDT");
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates) {
          cachedRates = {
            ...cachedRates,
            ...data.rates,
            BDT: 1,
          };
          lastFetchTime = now;
        }
      }
    } catch (err) {
      console.warn("Using fallback exchange rates:", err);
    }
  }
  res.json({ success: true, base: "BDT", rates: cachedRates, updatedAt: new Date(lastFetchTime || now).toISOString() });
});

// Finance AI endpoint
app.post("/api/roxi/chat", async (req, res) => {
  try {
    const { message, context, userLanguage } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response when API key is not configured
      const fallbackReplies = [
        "Based on your transactions, keeping daily expenses under your budget limit will help you save steadily every month.",
        "Remember to track all your small cash expenses regularly to keep your monthly balance accurate.",
        "Your current budget limit is looking healthy. Let me know if you need any specific budget or loan calculations!",
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ reply: randomReply, isFallback: true });
    }

    const systemInstruction = `
You are Finance AI, a helpful, polite, and clear AI Financial Assistant inside the personal finance application.
You assist users with budget tracking, expense categorization, savings advice, loan EMI estimates, and financial planning.

CHARACTER & TONE:
- Professional, friendly, calm, and clear.
- Provide simple, direct, and actionable advice without unnecessary slang or jargon.
- Speak in the language requested by the user (English, Bangla, or Banglish).
- Use clear formatting with bullet points and numbers for calculations or financial breakdowns.

USER CONTEXT:
${context ? JSON.stringify(context, null, 2) : "No context provided."}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    const reply = response.text || "I am here to help answer your financial and budgeting questions!";
    return res.json({ reply, success: true });
  } catch (error: any) {
    console.error("Error in Finance AI route:", error);
    return res.status(500).json({
      error: "Unable to process AI request.",
      details: error?.message || "Unknown error",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Roxi Finance server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

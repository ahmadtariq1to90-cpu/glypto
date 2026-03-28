import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OpenRouter API Route
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, systemInstruction, model = "google/gemini-2.0-flash-lite-001" } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured in the environment." });
    }

    try {
      // Check if it's an image generation request (heuristic based on model or prompt)
      const isImageRequest = model.includes("dall-e") || prompt.toLowerCase().includes("generate an image") || prompt.toLowerCase().includes("cartoon character portrait");
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "Glypto Tools",
        },
        body: JSON.stringify({
          model: isImageRequest ? "openai/gpt-4o" : model, // Use a powerful model for image prompts if needed
          messages: [
            { role: "system", content: systemInstruction || "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          // Some OpenRouter models might support image generation via specific parameters or tools, 
          // but standard chat completions don't. 
          // For true image generation, we'd need a dedicated image generation API.
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "OpenRouter API Error");
      }

      res.json({ text: data.choices[0].message.content });
    } catch (error: any) {
      console.error("OpenRouter Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

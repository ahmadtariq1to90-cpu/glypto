import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OpenRouter API Route
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, systemInstruction, model = "google/gemini-2.0-flash-lite-001" } = req.body;
    
    // Use environment variable if available, otherwise fallback to the provided key
    const apiKey = process.env.OPENROUTER_API_KEY || "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";

    if (!apiKey || apiKey === "YOUR_OPENROUTER_API_KEY") {
      return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured. Please add it to your environment secrets." });
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API Error (${response.status}):`, errorText);
        return res.status(response.status).json({ error: `OpenRouter API Error: ${errorText}` });
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "OpenRouter API Error");
      }

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        console.error("Invalid OpenRouter response structure:", data);
        throw new Error("Invalid response from OpenRouter API.");
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
    
    // Catch-all for development to handle SPA routing on reload
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // If it's an API route, let it pass through
        if (url.startsWith("/api")) {
          return next();
        }
        // For everything else, Vite's middleware handles it, 
        // but this ensures we always fall back to index.html for SPA routes
        const template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
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

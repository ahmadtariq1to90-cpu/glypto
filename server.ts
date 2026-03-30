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
    const { prompt, systemInstruction, model = "google/gemini-2.0-flash-001" } = req.body;
    
    // Use the correct key provided by the user
    const apiKey = "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";

    try {
      console.log(`Generating with model: ${model}`);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ais-dev-bwvrysfgbvwyku7csbwmon-570040145977.asia-southeast1.run.app",
          "X-Title": "ProToolix",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemInstruction || "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse OpenRouter response:", responseText);
        return res.status(500).json({ error: `Invalid JSON from OpenRouter: ${responseText.substring(0, 100)}` });
      }

      if (!response.ok) {
        console.error(`OpenRouter API Error (${response.status}):`, data);
        const errorMsg = data.error?.message || data.error || `OpenRouter Error ${response.status}: ${response.statusText}`;
        return res.status(response.status).json({ error: errorMsg });
      }

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        console.error("Invalid OpenRouter response structure:", data);
        return res.status(500).json({ error: "No response choices returned from AI." });
      }

      res.json({ text: data.choices[0].message.content });
    } catch (error: any) {
      console.error("Server-side OpenRouter Error:", error);
      res.status(500).json({ error: `Server Error: ${error.message}` });
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

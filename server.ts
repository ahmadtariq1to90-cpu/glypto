import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { generateAIContent } from "./src/lib/ai-service.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OpenRouter API Route
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, systemInstruction, model = "google/gemini-2.0-flash-001" } = req.body;
    
    try {
      console.log(`Generating with model: ${model}`);
      const text = await generateAIContent(prompt, systemInstruction, model);
      res.json({ text });
    } catch (error: any) {
      console.error("Server-side AI Generation Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error during AI generation" });
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

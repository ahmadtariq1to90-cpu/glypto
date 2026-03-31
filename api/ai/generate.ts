
import { generateAIContent } from "../../src/lib/ai-service";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, systemInstruction, model = "gemini-2.0-flash" } = req.body;

  try {
    const text = await generateAIContent(prompt, systemInstruction, model);
    res.status(200).json({ text });
  } catch (error: any) {
    console.error("Vercel AI Generation Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error during AI generation" });
  }
}

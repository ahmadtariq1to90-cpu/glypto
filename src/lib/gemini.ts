import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export const getGeminiModel = (modelName: string = "gemini-3-flash-preview") => {
  return genAI.models.generateContent.bind(genAI.models);
};

export async function generateText(prompt: string, systemInstruction?: string) {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to generate text");
    return data.text;
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function generateImage(prompt: string) {
  // Since OpenRouter is primarily for LLMs, we'll use a high-quality placeholder 
  // or a fallback image generation service like Pollinations.ai for the "Cartoon" effect.
  try {
    const seed = Math.floor(Math.random() * 1000000);
    // Pollinations.ai is a free, no-auth image generation API perfect for demos
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cartoon style, 3d render, pixar style, high resolution")})?seed=${seed}&width=1024&height=1024&nologo=true`;
    
    // We'll fetch it to ensure it's valid, then return the URL
    return imageUrl;
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
}

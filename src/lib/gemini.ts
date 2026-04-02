import { GoogleGenAI } from "@google/genai";

export const chatModel = "gemini-2.0-flash";
export const imageModel = "gemini-2.5-flash-image";

// Initialize Gemini AI
// We use import.meta.env for Vite to expose it to the client
// If you want to hardcode the key (not recommended), put it here:
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function generateText(prompt: string, systemInstruction?: string, imageBase64?: string, mimeType?: string) {
  try {
    if (!ai) {
      throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
    }

    const parts: any[] = [{ text: prompt }];
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: chatModel,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: systemInstruction || "You are a helpful assistant.",
      },
    });
    
    if (!response.text) {
      throw new Error("Empty response from Gemini AI.");
    }
    return response.text;
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function generateChatResponse(prompt: string, history: any[] = []) {
  // For simplicity, we use the same generateText logic for chat as well
  return generateText(prompt, "You are OneAI, a helpful and versatile AI assistant. You provide clear, concise, and accurate information.");
}

export async function generateImage(prompt: string): Promise<string> {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No image data returned from Gemini.");
    } catch (error: any) {
      console.error("Gemini Image Generation Error:", error);
      // Fallback to picsum if Gemini fails (e.g. safety filters or quota)
      return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;
    }
  }

  // Fallback to picsum if no API key
  return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const chatModel = "gemini-3-flash-preview";
export const imageModel = "gemini-2.5-flash-image";

export async function generateChatResponse(prompt: string, history: { role: string, parts: { text: string }[] }[] = []) {
  const chat = ai.chats.create({
    model: chatModel,
    config: {
      systemInstruction: "You are OneAI, a helpful and versatile AI assistant. You provide clear, concise, and accurate information.",
    },
  });

  // If there's history, we'd need to handle it, but for simple chat:
  const response = await chat.sendMessage({ message: prompt });
  return response.text;
}

export async function generateImage(prompt: string) {
  const response = await ai.models.generateContent({
    model: imageModel,
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

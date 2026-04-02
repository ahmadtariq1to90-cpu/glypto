import { GoogleGenAI } from "@google/genai";

export const chatModel = "google/gemini-2.0-flash-001";
export const imageModel = "openai/gpt-4o";

// Initialize Gemini AI
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function generateText(prompt: string, systemInstruction?: string, imageBase64?: string, mimeType?: string) {
  try {
    // If it's a Gemini model AND we have a Gemini API key, use the native SDK directly in the frontend
    if (ai && (chatModel.startsWith("gemini-") || chatModel.includes("google/gemini"))) {
      const modelName = chatModel.includes("/") ? chatModel.split("/")[1] : chatModel;
      
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
        model: modelName,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: systemInstruction || "You are a helpful assistant.",
        },
      });
      
      if (!response.text) {
        throw new Error("Empty response from Gemini AI.");
      }
      return response.text;
    }

    // Fallback to backend proxy for other models (like GPT-4o via OpenRouter)
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        model: chatModel,
      }),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      let errorMessage = `AI Service Error (${response.status})`;
      
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.error("Backend Error Data:", errorData);
        // If errorData.error is an object, try to get its message
        if (typeof errorData.error === 'object' && errorData.error !== null) {
          errorMessage = errorData.error.message || JSON.stringify(errorData.error);
        } else {
          errorMessage = errorData.error || errorMessage;
        }
      } else {
        const text = await response.text();
        console.error("Backend Error Text:", text);
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response from server:", text);
      throw new Error("Invalid response format from server.");
    }

    const data = await response.json();
    if (!data || !data.text) {
      throw new Error("Empty response from AI service.");
    }
    
    return data.text;
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

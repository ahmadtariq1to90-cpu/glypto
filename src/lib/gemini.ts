// OpenRouter API Configuration
const OPENROUTER_API_KEY = "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".trim();

// Using a guaranteed FREE model as primary to avoid "User not found" / "No credits" issues
export const chatModel = "meta-llama/llama-3.1-8b-instruct:free";
export const fallbackModel = "google/gemini-flash-1.5";
export const imageModel = "openai/gpt-4o";

export async function generateText(prompt: string, systemInstruction?: string, imageBase64?: string, mimeType?: string) {
  const tryModel = async (modelName: string) => {
    const messages: any[] = [];
    
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }

    if (imageBase64 && mimeType) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      messages.push({ role: "user", content: prompt });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter Error (${modelName}):`, errorText);
      let errorMessage = `OpenRouter Error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorData.error || errorMessage;
      } catch (e) {
        // Not JSON
      }
      
      if (response.status === 401 || errorMessage.toLowerCase().includes("user not found") || errorMessage.toLowerCase().includes("invalid api key")) {
        throw new Error("AUTH_ERROR");
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from AI service.");
    }

    return data.choices[0].message.content;
  };

  try {
    return await tryModel(chatModel);
  } catch (error: any) {
    if (error.message === "AUTH_ERROR") {
      throw new Error(`AI Service Account Issue: OpenRouter is not accepting the API key. Please ensure you have clicked 'Create' in OpenRouter and copied the key correctly. Current key starts with: ${OPENROUTER_API_KEY.slice(0, 10)}...`);
    }
    
    console.warn(`Primary model (${chatModel}) failed, trying fallback (${fallbackModel})...`);
    try {
      return await tryModel(fallbackModel);
    } catch (fallbackError: any) {
      console.error("AI Generation Error (Fallback also failed):", fallbackError);
      throw fallbackError;
    }
  }
}

export async function generateChatResponse(prompt: string, history: any[] = []) {
  return generateText(prompt, "You are OneAI, a helpful and versatile AI assistant. You provide clear, concise, and accurate information.");
}

export async function generateImage(prompt: string): Promise<string> {
  // Fallback to picsum for image generation as OpenRouter is primarily for LLMs
  // and DALL-E/Imagen via OpenRouter might be expensive or require different parameters
  return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;
}

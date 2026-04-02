// OpenRouter API Configuration
const OPENROUTER_API_KEY = "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";
export const chatModel = "google/gemini-2.0-flash-001";
export const fallbackModel = "google/gemini-flash-1.5";
export const imageModel = "openai/gpt-4o";

export async function generateText(prompt: string, systemInstruction?: string, imageBase64?: string, mimeType?: string) {
  const tryModel = async (modelName: string) => {
    const messages: any[] = [
      { role: "system", content: systemInstruction || "You are a helpful assistant." }
    ];

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
        "HTTP-Referer": window.location.origin || "https://protoolix.com",
        "X-Title": "ProToolix AI Tools",
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
      
      if (errorMessage.toLowerCase().includes("user not found")) {
        throw new Error("USER_NOT_FOUND");
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
    if (error.message === "USER_NOT_FOUND") {
      throw new Error("AI Service Account Issue: The API key might be invalid or the account was not found. Please check your OpenRouter account.");
    }
    
    console.warn(`Primary model (${chatModel}) failed, trying fallback (${fallbackModel})...`);
    try {
      return await tryModel(fallbackModel);
    } catch (fallbackError: any) {
      if (fallbackError.message === "USER_NOT_FOUND") {
        throw new Error("AI Service Account Issue: The API key might be invalid or the account was not found. Please check your OpenRouter account.");
      }
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

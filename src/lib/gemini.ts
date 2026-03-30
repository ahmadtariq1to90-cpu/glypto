export const chatModel = "google/gemini-2.0-flash-lite-001";
export const imageModel = "openai/gpt-4o";

export async function generateText(prompt: string, systemInstruction?: string) {
  try {
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
      let errorMessage = "AI Service Error";
      
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        // If errorData.error is an object, try to get its message
        if (typeof errorData.error === 'object' && errorData.error !== null) {
          errorMessage = errorData.error.message || JSON.stringify(errorData.error);
        } else {
          errorMessage = errorData.error || errorMessage;
        }
      } else {
        errorMessage = await response.text() || errorMessage;
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

export async function generateImage(prompt: string) {
  // OpenRouter doesn't directly return image bytes in the same way.
  // This would require a dedicated image generation API or a model that supports it.
  // For now, we'll try to use the same proxy if the server handles it.
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Generate a detailed image prompt for: ${prompt}. Then describe the image.`,
        systemInstruction: "You are an image generation assistant.",
        model: imageModel,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate image prompt: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format from server for image prompt.");
    }

    const data = await response.json();
    // Since we don't have a direct image generator, we return a placeholder or 
    // we'd need to implement a real image generation route in server.ts
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw error;
  }
}

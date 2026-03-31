
export async function generateAIContent(prompt: string, systemInstruction?: string, model: string = "google/gemini-2.0-flash-001") {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured in the environment.");
  }

  // Ensure model name is correct for OpenRouter
  let openRouterModel = model;
  if (model === "gemini-2.0-flash") {
    openRouterModel = "google/gemini-2.0-flash-001";
  }

  console.log(`Calling OpenRouter with model: ${openRouterModel}`);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://protoolix.vercel.app/",
      "X-Title": "ProToolix AI Tools",
    },
    body: JSON.stringify({
      model: openRouterModel,
      messages: [
        { role: "system", content: systemInstruction || "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const responseText = await response.text();
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Invalid JSON from OpenRouter: ${responseText.substring(0, 100)}`);
  }

  if (!response.ok) {
    const errorMsg = data.error?.message || data.error || `OpenRouter Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
    throw new Error("No response choices returned from AI.");
  }

  return data.choices[0].message.content;
}

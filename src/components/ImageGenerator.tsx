import React, { useState } from "react";
import { Button } from "./ui/Button";
import { ImageIcon, Loader2, Download, Sparkles, RefreshCw, Wand2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          },
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setResult(imageUrl);
      } else {
        throw new Error("No image was generated. Please try a different prompt.");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "Failed to generate image. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200">
          <ImageIcon className="h-10 w-10" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">AI Image Generator</h2>
        <p className="text-zinc-500 font-medium max-w-lg mx-auto">
          Describe what you want to see, and our AI will bring it to life in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl space-y-6 shadow-xl border-white/40">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Your Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with flying cars and neon lights, digital art style..."
                className="w-full h-40 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-medium resize-none transition-all"
              />
            </div>

            <Button 
              onClick={generateImage} 
              disabled={loading || !prompt.trim()}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Masterpiece...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["Cyberpunk", "Oil Painting", "3D Render", "Minimalist"].map((style) => (
              <button
                key={style}
                onClick={() => setPrompt(prev => prev + (prev ? ", " : "") + style)}
                className="p-4 rounded-2xl bg-white border border-zinc-100 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-sm font-bold text-zinc-600 text-left group"
              >
                <div className="flex items-center justify-between">
                  {style}
                  <Wand2 className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-4 rounded-[2.5rem] bg-white shadow-2xl border-white/40 sticky top-24"
              >
                <div className="relative group overflow-hidden rounded-[2rem]">
                  <img 
                    src={result} 
                    alt="AI Generated" 
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button onClick={downloadImage} className="rounded-xl bg-white text-zinc-900 hover:bg-zinc-100">
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => setResult(null)} variant="outline" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-xs font-medium text-zinc-400 italic">"{prompt}"</p>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-[2.5rem] bg-zinc-50/50 border-dashed border-2 border-zinc-200 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-zinc-200/50">
                  <ImageIcon className="h-12 w-12 text-zinc-200" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-zinc-900">Ready to Visualize?</h4>
                  <p className="text-zinc-400 font-medium max-w-xs mx-auto">
                    Your generated image will appear here. Be specific with your prompt for better results!
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

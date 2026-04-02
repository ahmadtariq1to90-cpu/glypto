import React, { useState } from "react";
import { cn, downloadAsDoc } from "../lib/utils";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Copy, Check, Sparkles, Download } from "lucide-react";
import { motion } from "motion/react";

export function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Engaging");
  const [length, setLength] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFriendlyErrorMessage = (error: any) => {
    const message = error.message || String(error);
    console.error("Caption Generation Error:", error);

    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return "You've reached the limit for now. Please wait a moment before trying again.";
    }
    if (message.toLowerCase().includes("api key") || message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("not configured")) {
      return "AI Service is not properly configured. Please add your OPENROUTER_API_KEY or GEMINI_API_KEY to the environment secrets.";
    }
    if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
      return "Connection lost. Please check your internet and try again.";
    }
    // If it's a 500 but we have a specific message, show it
    if (message.length > 10 && !message.includes("500") && !message.includes("Internal Server Error")) {
      return message;
    }
    if (message.includes("500") || message.toLowerCase().includes("server error")) {
      return "Our AI is currently taking a short break. Please try again in a few seconds.";
    }
    return message;
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate captions.");
      return;
    }
    setError(null);
    setLoading(true);
    setCaptions([]);
    try {
      const prompt = `Generate 5 SEO-optimized, highly engaging, and ${tone} captions for ${platform}.
      
      Topic: "${topic}"
      Desired Length: ${length}
      
      Instructions:
      - Use relevant keywords for SEO.
      - Include trending hashtags and appropriate emojis.
      - Each caption should be unique.
      - Length should be ${length === "Short" ? "under 100 characters" : length === "Medium" ? "between 100-250 characters" : "over 250 characters"}.
      - Format: Return ONLY the 5 captions, each starting with its number (e.g., "1. [Caption text]").
      - Do not include any introductory or concluding text.`;

      const result = await generateText(prompt, "You are a social media expert and SEO specialist. You always provide high-quality, SEO-optimized captions.");
      
      if (!result) {
        throw new Error("The AI returned an empty response. Please try again.");
      }

      // More robust parsing: split by lines and look for numbered items
      const lines = result.split("\n")
        .map(l => l.trim())
        .filter(l => l && /^\d+[\.\)]/.test(l));

      if (lines.length === 0) {
        // Fallback: if no numbered lines, just split by newlines and take non-empty ones
        const fallbackLines = result.split("\n")
          .map(l => l.trim())
          .filter(l => l.length > 20); // Assume a caption is at least 20 chars
        
        if (fallbackLines.length > 0) {
          setCaptions(fallbackLines.slice(0, 5));
        } else {
          // If even fallback fails, maybe the AI returned one big block
          if (result.length > 50) {
            setCaptions([result]);
          } else {
            throw new Error("Invalid response format from AI. Please try again.");
          }
        }
      } else {
        setCaptions(lines.map(l => l.replace(/^\d+[\.\)]\s*/, "").trim()).slice(0, 5));
      }
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadAll = () => {
    const content = captions.map((c, i) => `Caption ${i + 1}:\n${c}\n`).join("\n---\n\n");
    downloadAsDoc(content, `Captions-${topic.slice(0, 20)}`);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6 shadow-xl shadow-indigo-50/30 border-white/40">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">What's your post about?</label>
            <div className={cn(
              "relative rounded-2xl border transition-all duration-300 group bg-zinc-50/30",
              error ? "border-red-300 ring-4 ring-red-500/5" : "border-zinc-100 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30"
            )}>
              <textarea
                className="w-full p-4 rounded-2xl bg-transparent outline-none min-h-[120px] text-base font-medium placeholder:text-zinc-300"
                placeholder="e.g. A beautiful sunset at the beach with friends..."
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (e.target.value.trim()) setError(null);
                }}
              />
              {error && (
                <p className="absolute -bottom-6 left-1 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{error}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Platform</label>
              <div className="flex flex-wrap gap-2">
                {["Instagram", "Twitter", "LinkedIn", "TikTok"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border-2",
                      platform === p 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-105" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-indigo-300 hover:text-indigo-600 hover:scale-[1.02]"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Tone</label>
              <div className="flex flex-wrap gap-2">
                {["Engaging", "Professional", "Funny", "Minimalist"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border-2",
                      tone === t 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-105" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-indigo-300 hover:text-indigo-600 hover:scale-[1.02]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Caption Length</label>
              <div className="flex gap-2">
                {["Short", "Medium", "Long"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                      length === l 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-indigo-300 hover:text-indigo-600"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full py-8 text-lg font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 border-none"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Crafting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Generate Captions</span>
            </div>
          )}
        </Button>
      </div>

      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between px-2">
            <div className="h-4 w-32 bg-zinc-200 rounded-full" />
            <div className="h-6 w-24 bg-zinc-100 rounded-full" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl space-y-4 border-zinc-100/50">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-zinc-100 rounded-lg" />
                  <div className="h-4 w-[90%] bg-zinc-100 rounded-lg" />
                  <div className="h-4 w-[40%] bg-zinc-50 rounded-lg" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-3 w-16 bg-zinc-50 rounded-full" />
                  <div className="h-3 w-16 bg-zinc-50 rounded-full" />
                </div>
                <div className="absolute top-6 right-6 h-10 w-10 bg-zinc-50 rounded-xl border border-zinc-100/50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {captions.length > 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold font-display tracking-tight text-zinc-900">Generated Results</h3>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadAll}
                className="rounded-xl h-9 font-bold text-xs border-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download DOC
              </Button>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">5 Variations</span>
            </div>
          </div>
          <div className="grid gap-4">
            {captions.map((caption, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl relative group hover:border-indigo-300 transition-all"
              >
                <p className="text-zinc-600 text-sm leading-relaxed pr-12 font-medium">{caption}</p>
                <button
                  onClick={() => copyToClipboard(caption, i)}
                  className="absolute top-6 right-6 p-2 rounded-lg bg-zinc-50 hover:bg-indigo-600 text-zinc-400 hover:text-white transition-all border border-zinc-100 shadow-sm"
                >
                  {copiedIndex === i ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

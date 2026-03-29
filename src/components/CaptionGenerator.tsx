import React, { useState } from "react";
import { cn } from "../lib/utils.ts";
import { generateText } from "../lib/gemini.ts";
import { Button } from "./ui/Button.tsx";
import { Loader2, Copy, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Engaging");
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFriendlyErrorMessage = (error: any) => {
    const message = error.message || String(error);
    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return "You've reached the limit for now. Please wait a moment before trying again.";
    }
    if (message.includes("500") || message.toLowerCase().includes("server error")) {
      return "Our AI is currently taking a short break. Please try again in a few seconds.";
    }
    if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("missing")) {
      return "It looks like some information is missing. Please check your input and try again.";
    }
    if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
      return "Connection lost. Please check your internet and try again.";
    }
    return "Something went wrong while generating. Please try again.";
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
      const prompt = `Generate 5 catchy and ${tone} ${platform} captions for the topic: "${topic}". Include relevant hashtags and emojis. Return each caption on a new line starting with a number.`;
      const result = await generateText(prompt, "You are a social media expert.");
      const lines = result.split("\n").filter(l => l.trim() && /^\d/.test(l));
      if (lines.length === 0) throw new Error("Invalid response format from AI");
      setCaptions(lines.map(l => l.replace(/^\d+\.\s*/, "").trim()));
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
                      "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
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
                      "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
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
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">5 Variations</span>
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

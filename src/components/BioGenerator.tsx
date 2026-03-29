import React, { useState } from "react";
import { cn } from "../lib/utils";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Copy, Check, Sparkles, Instagram } from "lucide-react";
import { motion } from "motion/react";

export function BioGenerator() {
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [bios, setBios] = useState<string[]>([]);
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
    if (!keywords.trim()) {
      setError("Please enter some keywords about yourself.");
      return;
    }
    setError(null);
    setLoading(true);
    setBios([]);
    try {
      const prompt = `Generate 5 creative and catchy Instagram bios based on these keywords: "${keywords}". 
      Tone: ${tone}. 
      Include emojis and keep each bio under 150 characters. 
      Return each bio on a new line starting with a number.`;
      
      const result = await generateText(prompt, "You are a social media branding expert.");
      const lines = result.split("\n").filter(l => l.trim() && /^\d/.test(l));
      if (lines.length === 0) throw new Error("Invalid response format from AI");
      setBios(lines.map(l => l.replace(/^\d+\.\s*/, "").trim()));
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

  const tones = ["Professional", "Funny", "Minimalist", "Aesthetic", "Witty"];

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 bg-pink-100 rounded-[2rem] mb-2 shadow-inner">
          <Instagram className="h-10 w-10 text-pink-600" />
        </div>
        <h2 className="text-5xl font-black font-display tracking-tight premium-gradient-text">Instagram Bio Generator</h2>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">Stand out from the crowd with a professional, creative, or funny bio tailored to your personality.</p>
      </div>

      <div className="glass-card p-12 rounded-[3rem] shadow-2xl shadow-pink-50/50 space-y-10 border-white/40">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">About You / Your Brand</label>
            <textarea
              className={cn(
                "w-full p-6 rounded-3xl border bg-zinc-50/50 outline-none transition-all min-h-[200px] text-xl font-medium placeholder:text-zinc-300",
                error ? "border-red-300 ring-8 ring-red-500/5" : "border-zinc-100 focus:ring-8 focus:ring-pink-500/5 focus:border-pink-500/50"
              )}
              placeholder="e.g. Photographer, Traveler, Coffee Lover, Tech Enthusiast"
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
                if (e.target.value.trim()) setError(null);
              }}
            />
            {error && (
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider animate-in fade-in slide-in-from-top-1 ml-2">{error}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Select Tone</label>
            <div className="grid grid-cols-2 gap-4">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "px-6 py-4 rounded-2xl text-sm font-bold transition-all border-2",
                    tone === t 
                      ? "bg-pink-600 text-white border-pink-600 shadow-xl shadow-pink-200 scale-105" 
                      : "bg-white text-zinc-500 border-zinc-100 hover:border-pink-200 hover:text-pink-600"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || !keywords}
          className="w-full py-10 text-2xl font-black rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 hover:scale-[1.02] transition-all shadow-2xl shadow-pink-200/50 border-none"
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="animate-spin h-8 w-8" />
              <span>Crafting Masterpieces...</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Sparkles className="h-8 w-8" />
              <span>Generate 5 Premium Bios</span>
            </div>
          )}
        </Button>
      </div>

      {loading && (
        <div className="grid gap-6 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between border-zinc-100/50">
              <div className="space-y-3 w-full pr-12">
                <div className="h-5 w-full bg-zinc-100 rounded-full" />
                <div className="h-5 w-2/3 bg-zinc-50 rounded-full" />
              </div>
              <div className="h-14 w-14 bg-zinc-50 rounded-2xl shrink-0 border border-zinc-100/50" />
            </div>
          ))}
        </div>
      )}

      {bios.length > 0 && !loading && (
        <div className="grid gap-6">
          {bios.map((bio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-[2rem] flex items-center justify-between group hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500"
            >
              <p className="text-zinc-700 text-xl font-medium leading-relaxed pr-8">{bio}</p>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 rounded-2xl hover:bg-pink-600 text-pink-600 hover:text-white p-4 h-14 w-14 border border-pink-100 hover:border-pink-600 transition-all shadow-sm hover:shadow-xl hover:shadow-pink-200"
                onClick={() => copyToClipboard(bio, index)}
              >
                {copiedIndex === index ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

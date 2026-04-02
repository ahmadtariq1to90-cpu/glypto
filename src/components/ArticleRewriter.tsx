import React, { useState } from "react";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Copy, Check, Sparkles, FileText, Download } from "lucide-react";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import { cn, downloadAsDoc } from "../lib/utils";

export function ArticleRewriter() {
  const [text, setText] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriendlyErrorMessage = (error: any) => {
    const message = error.message || String(error);
    console.error("Article Rewrite Error:", error);

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

  const handleRewrite = async () => {
    if (!text.trim()) {
      setError("Please enter some text to rewrite.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const prompt = `Rewrite the following article in a ${tone} tone, making it more engaging and clear while preserving the original meaning:
      
      "${text}"`;
      
      const result = await generateText(prompt, "You are an expert editor and content rewriter.");
      setRewritten(result);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadAsDoc(rewritten, `Rewritten-${tone}`);
  };

  const tones = [
    { id: "professional", label: "Professional", icon: "💼" },
    { id: "casual", label: "Casual", icon: "☕" },
    { id: "creative", label: "Creative", icon: "🎨" },
    { id: "academic", label: "Academic", icon: "🎓" },
    { id: "persuasive", label: "Persuasive", icon: "📢" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card p-6 md:p-8 rounded-3xl shadow-xl shadow-emerald-50/30 space-y-6 border-white/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-xl shadow-inner">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold font-display tracking-tight text-zinc-900">Original Content</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Select Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                      tone === t.id 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100 scale-105" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-emerald-300 hover:text-emerald-600 hover:scale-[1.02]"
                    )}
                  >
                    <span className="mr-2">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Paste Article</label>
              <div className={cn(
                "relative rounded-2xl border transition-all duration-300 bg-zinc-50/30",
                error ? "border-red-300 ring-4 ring-red-500/5" : "border-zinc-100 focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-500/30"
              )}>
                <textarea
                  className="w-full p-4 rounded-2xl bg-transparent outline-none min-h-[250px] text-sm text-zinc-700 leading-relaxed font-medium placeholder:text-zinc-300"
                  placeholder="Paste your article or text here..."
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (e.target.value.trim()) setError(null);
                  }}
                />
                {error && (
                  <p className="absolute -bottom-6 left-1 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{error}</p>
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleRewrite} 
            disabled={loading}
            className="w-full py-8 text-lg font-black rounded-2xl bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 border-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Polishing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Rewrite Article</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[500px] bg-white shadow-xl border-white/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold font-display tracking-tight text-zinc-900">Rewritten Version</h3>
            </div>
            {rewritten && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl text-zinc-600 hover:bg-zinc-50 font-bold px-4 h-9 border-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download DOC
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl text-emerald-600 hover:bg-emerald-50 font-bold px-4 h-9 border border-emerald-100"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 w-full bg-zinc-100 rounded-full" />
                <div className="h-4 w-full bg-zinc-100 rounded-full" />
                <div className="h-4 w-5/6 bg-zinc-100 rounded-full" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-zinc-50 rounded-full" />
                <div className="h-4 w-4/5 bg-zinc-50 rounded-full" />
                <div className="h-4 w-full bg-zinc-50 rounded-full" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-zinc-100 rounded-full" />
                <div className="h-4 w-full bg-zinc-100 rounded-full" />
                <div className="h-4 w-2/3 bg-zinc-100 rounded-full" />
              </div>
              <div className="pt-4 flex justify-end">
                <div className="h-10 w-24 bg-zinc-50 rounded-xl" />
              </div>
            </div>
          ) : rewritten ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-700 leading-relaxed font-medium"
            >
              <Markdown>{rewritten}</Markdown>
            </motion.div>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center text-zinc-400 text-center p-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FileText className="h-8 w-8 text-emerald-200" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-2">No Content Yet</h4>
              <p className="max-w-xs mx-auto text-sm font-medium text-zinc-400 leading-relaxed">Your rewritten article will appear here once you click the button.</p>
            </div>
          )}
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/30 rounded-bl-[4rem] -z-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50/10 rounded-tr-[3rem] -z-10" />
        </div>
      </div>
    </div>
  );
}

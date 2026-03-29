import React, { useState } from "react";
import { 
  ImageIcon, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Loader2, 
  Share2,
  Maximize2,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateImage } from "../../lib/gemini";
import { cn } from "../../lib/utils";

export function ImageGen() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Image generation error:", error);
      alert("An error occurred while generating the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `oneai-gen-${Date.now()}.png`;
    link.click();
  };

  const examplePrompts = [
    "A futuristic cyberpunk city with neon lights and flying cars",
    "A cute fluffy cat wearing a space suit on the moon",
    "A minimalist landscape of snow-capped mountains at sunset",
    "A vibrant 3D render of a floating island with waterfalls",
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            <Sparkles className="h-3 w-3" />
            AI Image Studio
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Turn your words into <br />
            <span className="premium-gradient-text">stunning visuals</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-medium max-w-xl">
            Describe what you want to see, and our advanced AI will bring it to life in seconds.
          </p>
        </div>
        <div className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Model</span>
            <span className="text-sm font-bold text-white">Gemini 2.5 Flash Image</span>
          </div>
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Zap className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest px-1">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with neon lights..."
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none min-h-[120px]"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest px-1">
                Try an example
              </label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-[11px] font-medium text-zinc-400 hover:text-white transition-all"
                  >
                    {p.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl",
                prompt.trim() && !isLoading 
                  ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/20 hover:scale-[1.02]" 
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          <div className="p-6 glass-card rounded-3xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Advanced Settings</p>
              <p className="text-xs text-zinc-500">Aspect ratio, style, and more coming soon.</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7">
          <div className="aspect-square glass-card rounded-[3rem] border border-white/5 overflow-hidden flex items-center justify-center relative group">
            {isLoading ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-indigo-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold text-white">Generating Magic...</p>
                  <p className="text-sm text-zinc-500">This usually takes 5-10 seconds.</p>
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all hover:scale-110"
                    title="View Fullscreen"
                  >
                    <Maximize2 className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all hover:scale-110"
                    title="Download Image"
                  >
                    <Download className="h-6 w-6" />
                  </button>
                  <button 
                    className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all hover:scale-110"
                    title="Share"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 opacity-40">
                <div className="w-24 h-24 bg-zinc-800 rounded-[2rem] flex items-center justify-center text-zinc-600">
                  <ImageIcon className="h-12 w-12" />
                </div>
                <p className="text-lg font-medium text-zinc-500">Your masterpiece will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && generatedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 md:p-12"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={generatedImage}
              alt="Generated Fullscreen"
              className="max-w-full max-h-full rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

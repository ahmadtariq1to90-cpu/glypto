import React, { useState } from "react";
import { generateImage } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Upload, Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

export function ImageToCartoon() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState("3D Pixar");

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = `A high-quality ${style} style cartoon character portrait based on a person's photo. Vibrant colors, soft lighting, expressive features, digital art style.`;
      const imageUrl = await generateImage(prompt);
      setResult(imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const styles = ["3D Pixar", "Anime", "Comic Book", "Sketch", "Cyberpunk"];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 bg-purple-100 rounded-[2rem] mb-2 shadow-inner">
          <ImageIcon className="h-10 w-10 text-purple-600" />
        </div>
        <h2 className="text-5xl font-black font-display tracking-tight premium-gradient-text">Image to Cartoon</h2>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">Transform your photos into stunning cartoon characters using advanced AI technology.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-10">
          <div className="glass-card p-10 rounded-[3rem] shadow-2xl shadow-purple-50/50 space-y-10 border-white/40">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">1. Upload Photo</label>
                <div 
                  className="aspect-video glass-card rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:border-purple-500 transition-all cursor-pointer overflow-hidden relative group shadow-inner bg-zinc-50/30"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {image ? (
                    <>
                      <img src={image} className="w-full h-full object-cover" alt="Original" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                        <p className="text-white text-lg font-black tracking-widest uppercase">Change Photo</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-12 group-hover:scale-105 transition-transform duration-500">
                      <div className="w-24 h-24 bg-purple-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-200/50">
                        <Upload className="h-10 w-10 text-purple-600" />
                      </div>
                      <p className="text-zinc-600 text-xl font-bold">Click or drag to upload</p>
                      <p className="text-sm text-zinc-400 mt-2 font-medium tracking-wide">Supports JPG, PNG, WEBP</p>
                    </div>
                  )}
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleUpload} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">2. Choose Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-4 py-4 rounded-2xl text-xs font-black transition-all border-2 ${
                        style === s 
                          ? "bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-200 scale-105" 
                          : "bg-white text-zinc-500 border-zinc-100 hover:border-purple-300 hover:text-purple-600"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              className="w-full py-10 text-2xl font-black rounded-[2rem] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:scale-[1.02] transition-all shadow-2xl shadow-purple-200/50 border-none" 
              disabled={!image || loading}
              onClick={handleConvert}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="animate-spin h-8 w-8" />
                  <span>Cartoonizing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Sparkles className="h-8 w-8" />
                  <span>Convert to Cartoon</span>
                </div>
              )}
            </Button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-3xl flex items-center gap-4 shadow-xl shadow-red-100/50"
              >
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="glass-card p-6 rounded-[3.5rem] min-h-[600px] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border-white/60">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 animate-pulse">
                <div className="w-full aspect-square bg-zinc-100 rounded-[2.5rem] mb-8 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="w-full space-y-6">
                  <div className="h-10 w-1/2 bg-zinc-100 rounded-xl mx-auto" />
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-zinc-50 rounded-full mx-auto" />
                    <div className="h-4 w-1/2 bg-zinc-50 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            ) : result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group h-full flex flex-col"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden aspect-square bg-zinc-50 shadow-inner border border-zinc-100">
                  <img src={result} className="w-full h-full object-cover" alt="Cartoon" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
                    <Button 
                      variant="secondary" 
                      className="rounded-2xl py-6 px-8 text-lg font-black shadow-2xl"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = result;
                        link.download = 'cartoon.png';
                        link.click();
                      }}
                    >
                      <Download className="mr-3 h-6 w-6" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="mt-8 p-8 bg-purple-50 rounded-[2rem] border border-purple-100 shadow-inner">
                  <h4 className="font-black text-purple-900 text-xl mb-2">Success!</h4>
                  <p className="text-lg text-purple-800 leading-relaxed font-medium">Your photo has been transformed into a {style} masterpiece.</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 text-center p-12">
                <div className="w-32 h-32 bg-purple-50 rounded-[3rem] flex items-center justify-center mb-8 animate-pulse shadow-inner">
                  <ImageIcon className="h-12 w-12 text-purple-200" />
                </div>
                <h4 className="text-2xl font-black text-zinc-900 mb-4">Your Cartoon Result</h4>
                <p className="max-w-xs mx-auto text-lg font-medium text-zinc-400">Upload a photo and choose a style to see the magic happen here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, RefreshCw, QrCode, Lock, ArrowLeftRight, Eraser, LayoutGrid, Search, Camera, Upload, Download, Loader2, Sparkles, Wand2, X, Image as ImageIcon, AlertCircle, Play } from "lucide-react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "motion/react";
import { removeBackground } from "@imgly/background-removal";
import QRCode from "qrcode";
import { cn } from "../lib/utils";
import { canUseTool, incrementToolUsage } from "../lib/usage";
import { Button } from "./ui/Button";
import { AdBanner } from "./AdBanner";

export function SimpleTools({ type, onLimitReached }: { type: string, onLimitReached: (toolId: string) => void }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === "bg-remover") {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target?.result as string);
          setProcessedImage(null);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveBackground = async () => {
      if (!image) return;

      // Check Usage Limit
      if (!canUseTool("bg-remover")) {
        onLimitReached("bg-remover");
        return;
      }

      setLoading(true);
      try {
        const blob = await removeBackground(image);
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
        incrementToolUsage("bg-remover");
      } catch (error) {
        console.error("Background removal failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const downloadImage = () => {
      if (!processedImage) return;
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "protoolix-bg-removed.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40 overflow-hidden">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 text-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-50">
          <ImageIcon className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">AI Background Remover</h3>
          <p className="text-zinc-500 font-medium text-sm md:text-base max-w-sm mx-auto leading-relaxed">Instantly remove backgrounds from your images using advanced AI technology.</p>
        </div>

        <div className="space-y-6">
          {!image ? (
            <label className="block">
              <div className="p-12 md:p-16 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 md:h-10 md:w-10 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-indigo-600 transition-colors">Upload Image</p>
                  <p className="text-[10px] text-zinc-300 font-medium">PNG, JPG or WEBP (Max 5MB)</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative group rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-zinc-100 border border-zinc-200 min-h-[200px] md:min-h-[300px] flex items-center justify-center">
                <img 
                  src={processedImage || image} 
                  alt="Preview" 
                  className="max-w-full max-h-[400px] object-contain"
                />
                <button 
                  onClick={() => { setImage(null); setProcessedImage(null); }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-zinc-400 hover:text-red-500 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!processedImage ? (
                  <Button 
                    onClick={handleRemoveBackground} 
                    disabled={loading}
                    className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base md:text-lg font-bold shadow-lg shadow-indigo-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Remove Background
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={downloadImage}
                    className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-base md:text-lg font-bold shadow-lg shadow-emerald-100"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download PNG
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 md:h-14 rounded-xl md:rounded-2xl border-zinc-200 font-bold px-8"
                >
                  Change Image
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* Individual Tool Page: (B) Below result */}
        <AdBanner type="result" />
      </div>
    );
  }

  if (type === "pass-gen") {
    const generatePass = () => {
      // Check Usage Limit
      if (!canUseTool("pass-gen")) {
        onLimitReached("pass-gen");
        return;
      }

      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let pass = "";
      for (let i = 0; i < 16; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setResult(pass);
      incrementToolUsage("pass-gen");
    };

    return (
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40 overflow-hidden">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 text-orange-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-orange-50">
          <Lock className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">Password Generator</h3>
          <p className="text-zinc-500 font-medium text-sm md:text-base max-w-sm mx-auto leading-relaxed">Generate ultra-secure, random passwords to keep your accounts safe.</p>
        </div>

        <Button 
          onClick={generatePass} 
          className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-orange-600 hover:bg-orange-700 text-base md:text-lg font-bold shadow-lg shadow-orange-100"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate Password
        </Button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 md:p-6 bg-zinc-50 rounded-2xl md:rounded-[2rem] border border-zinc-100 flex flex-col sm:flex-row items-center justify-between shadow-inner gap-4"
          >
            <code className="text-base md:text-2xl font-mono font-black text-indigo-600 tracking-wider break-all text-center sm:text-left">{result}</code>
            <button onClick={() => handleCopy(result)} className="p-2.5 md:p-3 bg-white rounded-xl shadow-md hover:text-indigo-600 transition-all active:scale-90 shrink-0">
              {copied ? <Check className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" /> : <Copy className="h-5 w-5 md:h-6 md:w-6 text-zinc-400" />}
            </button>
          </motion.div>
        )}
        {/* Individual Tool Page: (B) Below result */}
        <AdBanner type="result" />
      </div>
    );
  }

  if (type === "logo") {
    const [loading, setLoading] = useState(false);
    const [ideas, setIdeas] = useState<string[]>([]);

    const generateIdeas = () => {
      if (!input) return;

      // Check Usage Limit
      if (!canUseTool("logo")) {
        onLimitReached("logo");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setIdeas([
          `${input} Modern`,
          `${input} Minimal`,
          `${input} Tech`,
          `${input} Creative`,
          `${input} Pulse`,
          `${input} Zen`
        ]);
        setLoading(false);
        incrementToolUsage("logo");
      }, 1500);
    };

    return (
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40 overflow-hidden">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-900 text-white rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <LayoutGrid className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">Logo Idea Maker</h3>
          <p className="text-zinc-500 font-medium text-sm md:text-base max-w-sm mx-auto leading-relaxed">Enter your brand name to generate modern, professional logo concepts.</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your Brand Name..."
            className="w-full h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-bold text-base md:text-lg transition-all shadow-inner"
          />
          <Button 
            onClick={generateIdeas} 
            disabled={loading || !input}
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-base md:text-lg font-bold shadow-lg"
          >
            {loading ? <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" /> : "Generate Concepts"}
          </Button>
        </div>

        {ideas.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
            {ideas.map((idea, i) => (
              <div key={i} className="p-4 md:p-6 bg-white rounded-2xl md:rounded-[2rem] border border-zinc-100 shadow-xl flex flex-col items-center justify-center gap-3 md:gap-4 group hover:scale-105 transition-all cursor-pointer overflow-hidden">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-900 font-black text-xl md:text-2xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {idea.charAt(0)}
                </div>
                <p className="font-black uppercase tracking-widest text-[9px] md:text-[10px] text-zinc-400 group-hover:text-indigo-600 transition-colors truncate w-full px-1">{idea}</p>
              </div>
            ))}
          </div>
        )}
        {/* Individual Tool Page: (B) Below result */}
        <AdBanner type="result" />
      </div>
    );
  }

  return null;
}

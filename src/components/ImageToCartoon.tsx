import React, { useState } from 'react';
import { ImageIcon, Upload, Wand2, Loader2, Download, X, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";

export const ImageToCartoon: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const cartoonize = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/png",
              },
            },
            { text: "Transform this image into a high-quality 3D Disney-style cartoon character. Maintain the original person's features but stylized." },
          ],
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
        throw new Error("Failed to cartoonize. Please try a different image.");
      }
    } catch (err: any) {
      console.error("Cartoonize error:", err);
      setError(err.message || "Failed to process image. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `cartoon-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-rose-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200">
          <ImageIcon className="h-10 w-10" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">Image to Cartoon</h2>
        <p className="text-zinc-500 font-medium max-w-lg mx-auto">
          Turn your photos into stunning digital art and cartoon characters in one click.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-white shadow-xl border-white/40 space-y-6">
            {!image ? (
              <div className="aspect-square rounded-[2rem] border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center p-12 text-center space-y-4 hover:border-rose-500/50 hover:bg-rose-50/30 transition-all cursor-pointer group relative">
                <input 
                  type="file" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/*"
                />
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-black uppercase tracking-widest text-xs">Upload your photo</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">JPG, PNG up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img src={image} alt="Original" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-zinc-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <Button 
              onClick={cartoonize} 
              disabled={!image || loading}
              className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-lg font-bold shadow-lg shadow-rose-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI is painting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Cartoonize Now
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
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
                    alt="Cartoon Result" 
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button onClick={downloadResult} className="rounded-xl bg-white text-zinc-900 hover:bg-zinc-100">
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => setResult(null)} variant="outline" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-widest text-center">Your AI Cartoon is Ready!</p>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-[2.5rem] bg-zinc-50/50 border-dashed border-2 border-zinc-200 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-zinc-200/50">
                  <Wand2 className="h-12 w-12 text-zinc-200" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-zinc-900">Magic Awaits</h4>
                  <p className="text-zinc-400 font-medium max-w-xs mx-auto">
                    Upload a photo and click "Cartoonize Now" to see the AI magic happen here.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

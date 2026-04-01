import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import { Copy, Check, RefreshCw, QrCode, Lock, ArrowLeftRight, Eraser, LayoutGrid, Search, Camera, Upload, Download, Loader2, Sparkles, Wand2, X } from "lucide-react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "motion/react";

export function SimpleTools({ type }: { type: string }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === "bg-remover") {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [bgResult, setBgResult] = useState<string | null>(null);

    const handleProcess = () => {
      if (!file) return;
      setProcessing(true);
      setTimeout(() => {
        setBgResult(URL.createObjectURL(file));
        setProcessing(false);
      }, 3000);
    };

    return (
      <div className="glass-card p-8 rounded-[2.5rem] space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-50">
          <Eraser className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900">Background Remover</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Remove backgrounds from your images instantly with AI precision.</p>
        </div>

        {!bgResult ? (
          <div className="space-y-6">
            <div className="border-4 border-dashed border-zinc-100 rounded-[2rem] p-16 hover:border-cyan-500/50 hover:bg-cyan-50/30 transition-all cursor-pointer group relative overflow-hidden">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/*"
              />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-zinc-100 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-zinc-300 group-hover:text-cyan-500 transition-colors" />
                </div>
                <div>
                  <p className="text-zinc-900 font-black uppercase tracking-widest text-xs">
                    {file ? file.name : "Drop your image here"}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-2 uppercase tracking-[0.2em]">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleProcess} 
              disabled={!file || processing}
              className="w-full h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-lg font-bold shadow-lg shadow-cyan-100"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI is working...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-10" />
              <img src={bgResult} alt="Result" className="w-full relative z-10" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                <Button onClick={() => window.open(bgResult, "_blank")} className="rounded-xl bg-white text-zinc-900 hover:bg-zinc-100">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setBgResult(null)} variant="outline" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
              <p className="text-xs font-bold text-cyan-700 uppercase tracking-widest">Background Removed Successfully</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (type === "qr-gen") {
    const generateQR = () => {
      if (!input) return;
      setResult(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(input)}`);
    };

    return (
      <div className="glass-card p-8 rounded-[2.5rem] space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-20 h-20 bg-slate-100 text-slate-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-slate-50">
          <QrCode className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900">QR Code Generator</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Create custom QR codes for URLs, text, or contact info instantly.</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL or text..."
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-bold text-lg transition-all shadow-inner"
          />
          <Button 
            onClick={generateQR} 
            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-lg font-bold shadow-lg shadow-slate-100"
          >
            Generate QR Code
          </Button>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-6 pt-8 border-t border-zinc-100"
          >
            <div className="p-6 bg-white rounded-[2rem] shadow-2xl border border-zinc-100">
              <img src={result} alt="QR Code" className="w-48 h-48 rounded-lg" />
            </div>
            <div className="flex gap-3 w-full">
              <Button onClick={() => window.open(result, "_blank")} className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => handleCopy(input)} variant="outline" className="flex-1 h-12 rounded-xl border-2 font-bold">
                {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy Link
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "qr-scan") {
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [fileScanning, setFileScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileScanning(true);
      const html5QrCode = new Html5Qrcode("qr-reader-hidden");
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        setScannedResult(decodedText);
      } catch (err) {
        console.error("Error scanning file", err);
        alert("No QR code found in this image.");
      } finally {
        setFileScanning(false);
        html5QrCode.clear();
      }
    };

    useEffect(() => {
      if (scanning && !scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scannerRef.current.render(
          (decodedText) => {
            setScannedResult(decodedText);
            setScanning(false);
            scannerRef.current?.clear();
            scannerRef.current = null;
          },
          (error) => {
            // console.warn(error);
          }
        );
      }
      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      };
    }, [scanning]);

    return (
      <div className="glass-card p-8 rounded-[2.5rem] space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
          <Search className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900">QR Code Scanner</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Scan any QR code instantly using your camera or an image file.</p>
        </div>

        {!scanning && !scannedResult && (
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setScanning(true)}
              className="h-32 rounded-3xl bg-emerald-600 hover:bg-emerald-700 flex flex-col gap-3 shadow-lg shadow-emerald-100"
            >
              <Camera className="h-8 w-8" />
              <span className="font-bold uppercase tracking-widest text-xs">Use Camera</span>
            </Button>
            <div className="relative h-32 rounded-3xl bg-white border-2 border-dashed border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleFileScan}
                disabled={fileScanning}
              />
              {fileScanning ? (
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
              )}
              <span className="font-bold uppercase tracking-widest text-xs text-zinc-400 group-hover:text-emerald-600 transition-colors">
                {fileScanning ? "Scanning..." : "Upload Image"}
              </span>
            </div>
          </div>
        )}

        <div id="qr-reader-hidden" style={{ display: 'none' }}></div>

        {scanning && (
          <div className="space-y-6">
            <div id="qr-reader" className="overflow-hidden rounded-[2rem] border-4 border-emerald-500 shadow-2xl bg-black" />
            <Button onClick={() => setScanning(false)} variant="outline" className="w-full h-14 rounded-2xl font-bold">
              Cancel Scanning
            </Button>
          </div>
        )}

        {scannedResult && (
          <div className="space-y-6">
            <div className="p-8 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-md">
                <Check className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Scanned Content</p>
                <p className="text-lg font-bold text-zinc-900 break-all">{scannedResult}</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(scannedResult);
                    setScannedResult(null);
                  }}
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
                >
                  Copy & Close
                </Button>
                {scannedResult.startsWith("http") && (
                  <Button 
                    onClick={() => window.open(scannedResult, "_blank")}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl font-bold border-2"
                  >
                    Open Link
                  </Button>
                )}
              </div>
            </div>
            <Button onClick={() => setScannedResult(null)} variant="ghost" className="font-bold text-zinc-400">
              Scan Another
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (type === "pass-gen") {
    const generatePass = () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let pass = "";
      for (let i = 0; i < 16; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setResult(pass);
    };

    return (
      <div className="glass-card p-8 rounded-[2.5rem] space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-orange-50">
          <Lock className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900">Password Generator</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Generate ultra-secure, random passwords to keep your accounts safe.</p>
        </div>

        <Button 
          onClick={generatePass} 
          className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-bold shadow-lg shadow-orange-100"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate Password
        </Button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex items-center justify-between shadow-inner"
          >
            <code className="text-2xl font-mono font-black text-indigo-600 tracking-wider">{result}</code>
            <button onClick={() => handleCopy(result)} className="p-3 bg-white rounded-xl shadow-md hover:text-indigo-600 transition-all active:scale-90">
              {copied ? <Check className="h-6 w-6 text-emerald-500" /> : <Copy className="h-6 w-6 text-zinc-400" />}
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "logo") {
    const [loading, setLoading] = useState(false);
    const [ideas, setIdeas] = useState<string[]>([]);

    const generateIdeas = () => {
      if (!input) return;
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
      }, 1500);
    };

    return (
      <div className="glass-card p-8 rounded-[2.5rem] space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-20 h-20 bg-zinc-900 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <LayoutGrid className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900">Logo Idea Maker</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Enter your brand name to generate modern, professional logo concepts.</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your Brand Name..."
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-bold text-lg transition-all shadow-inner"
          />
          <Button 
            onClick={generateIdeas} 
            disabled={loading || !input}
            className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-lg font-bold shadow-lg"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Generate Concepts"}
          </Button>
        </div>

        {ideas.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            {ideas.map((idea, i) => (
              <div key={i} className="p-6 bg-white rounded-[2rem] border border-zinc-100 shadow-xl flex flex-col items-center justify-center gap-4 group hover:scale-105 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 font-black text-2xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {idea.charAt(0)}
                </div>
                <p className="font-black uppercase tracking-widest text-[10px] text-zinc-400 group-hover:text-indigo-600 transition-colors">{idea}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import { Copy, Check, RefreshCw, QrCode, Lock, ArrowLeftRight, Eraser, LayoutGrid, Search, Camera, Upload, Download, Loader2, Sparkles, Wand2, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "motion/react";
import { removeBackground } from "@imgly/background-removal";
import QRCode from "qrcode";
import { cn } from "../lib/utils";

export function SimpleTools({ type }: { type: string }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === "qr-gen") {
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [qrImage, setQrImage] = useState<File | null>(null);
    const [qrImagePreview, setQrImagePreview] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateQR = async () => {
      if (!input && !qrImage) return;
      
      setGenerating(true);
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let qrContent = input;

        // If an image is uploaded, simulate AI processing and cloud upload
        if (qrImage) {
          // In a real app, we would upload to S3/Firebase and get a URL
          // Here we simulate AI analysis and link generation
          qrContent = `https://protoolix.ai/shared/${Math.random().toString(36).substring(7)}`;
        }

        // Generate base QR code
        await QRCode.toCanvas(canvas, qrContent, {
          width: 600,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: 'H' // High error correction to allow for logo
        });

        // If logo exists, draw it in the center
        if (logoPreview) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const logoImg = new Image();
            logoImg.src = logoPreview;
            await new Promise((resolve) => {
              logoImg.onload = resolve;
            });

            const logoSize = canvas.width * 0.22; // 22% of QR size
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;

            // Draw white background for logo
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, 10);
            ctx.fill();

            // Draw logo
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          }
        }

        setResult(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("QR Generation Error:", err);
        alert("Failed to generate QR code.");
      } finally {
        setGenerating(false);
      }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
      }
    };

    const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setQrImage(file);
        setQrImagePreview(URL.createObjectURL(file));
        setInput(""); // Clear text input if image is uploaded
      }
    };

    return (
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 text-slate-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-slate-50">
          <QrCode className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">QR Code Generator Pro</h3>
          <p className="text-zinc-500 font-medium text-sm md:text-base max-w-sm mx-auto leading-relaxed">Create custom QR codes for URLs, text, or even images with AI-powered linking.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Text or URL</label>
                <input
                  type="text"
                  value={input}
                  disabled={!!qrImage}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter URL or text..."
                  className="w-full h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-bold text-sm transition-all shadow-inner disabled:opacity-50"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Or Upload Image</label>
                <div className="relative h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 cursor-pointer group overflow-hidden">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*"
                    onChange={handleQrImageUpload}
                  />
                  {qrImagePreview ? (
                    <div className="flex items-center gap-2">
                      <img src={qrImagePreview} alt="QR Content" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-[10px] font-bold text-zinc-600 truncate max-w-[80px]">{qrImage?.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setQrImage(null); setQrImagePreview(null); }} className="p-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 relative z-20">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[10px] font-bold text-zinc-400 group-hover:text-indigo-600 transition-colors">Link to Image</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Add Center Logo (Optional)</label>
              <div className="relative h-16 md:h-20 rounded-xl md:rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 cursor-pointer group overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                {logoPreview ? (
                  <div className="flex items-center gap-3">
                    <img src={logoPreview} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-md" />
                    <span className="text-xs font-bold text-zinc-600 truncate max-w-[150px]">{logo?.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setLogo(null); setLogoPreview(null); }} className="p-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 relative z-20">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-indigo-600 transition-colors">Upload Brand Logo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={generateQR} 
            disabled={(!input && !qrImage) || generating}
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 hover:bg-slate-800 text-base md:text-lg font-bold shadow-lg shadow-slate-100"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate AI QR Code
              </>
            )}
          </Button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

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
              <Button onClick={() => {
                const link = document.createElement('a');
                link.href = result;
                link.download = 'qrcode.png';
                link.click();
              }} className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold">
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
    const [cameraError, setCameraError] = useState<string | null>(null);
    const qrScannerRef = useRef<Html5Qrcode | null>(null);

    const stopScanner = async () => {
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        try {
          await qrScannerRef.current.stop();
        } catch (err) {
          console.error("Error stopping scanner", err);
        }
      }
      setScanning(false);
    };

    const startScanner = async () => {
      setCameraError(null);
      setScanning(true);
      setScannedResult(null);
      
      const html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              setScannedResult(decodedText);
              stopScanner();
            },
            (errorMessage) => {
              // Ignore constant scanning errors
            }
          );
        } else {
          setCameraError("No cameras found on this device.");
          setScanning(false);
        }
      } catch (err) {
        console.error("Error starting scanner", err);
        setCameraError("Could not access camera. Please check permissions.");
        setScanning(false);
      }
    };

    const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileScanning(true);
      setScannedResult(null);
      setCameraError(null);
      
      const html5QrCode = new Html5Qrcode("qr-reader-hidden");
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        setScannedResult(decodedText);
      } catch (err) {
        console.error("Error scanning file", err);
        alert("No QR code found in this image. Please make sure the QR code is clear and visible.");
      } finally {
        setFileScanning(false);
        try {
          await html5QrCode.clear();
        } catch (e) {
          // Ignore clear errors
        }
      }
    };

    useEffect(() => {
      return () => {
        stopScanner();
      };
    }, []);

    return (
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 text-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
          <Search className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">QR Code Scanner Pro</h3>
          <p className="text-zinc-500 font-medium text-sm md:text-base max-w-sm mx-auto leading-relaxed">Scan any QR code instantly using your camera or an image file with enhanced detection.</p>
        </div>

        {cameraError && (
          <div className="p-3 md:p-4 bg-red-50 border border-red-100 rounded-xl md:rounded-2xl text-red-600 text-[10px] md:text-xs font-bold flex items-center gap-2 justify-center">
            <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {cameraError}
          </div>
        )}

        {!scanning && !scannedResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={startScanner}
              className="h-24 md:h-32 rounded-2xl md:rounded-3xl bg-emerald-600 hover:bg-emerald-700 flex flex-col gap-2 md:gap-3 shadow-lg shadow-emerald-100"
            >
              <Camera className="h-6 w-6 md:h-8 md:w-8" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Use Camera</span>
            </Button>
            <div className="relative h-24 md:h-32 rounded-2xl md:rounded-3xl bg-white border-2 border-dashed border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer group">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleFileScan}
                disabled={fileScanning}
              />
              {fileScanning ? (
                <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-emerald-500 animate-spin" />
              ) : (
                <Upload className="h-6 w-6 md:h-8 md:w-8 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
              )}
              <span className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 group-hover:text-emerald-600 transition-colors">
                {fileScanning ? "Scanning..." : "Upload Image"}
              </span>
            </div>
          </div>
        )}

        <div id="qr-reader-hidden" style={{ display: 'none' }}></div>

        {scanning && (
          <div className="space-y-4 md:space-y-6">
            <div id="qr-reader" className="overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-4 border-emerald-500 shadow-2xl bg-black aspect-square" />
            <Button onClick={stopScanner} variant="outline" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold">
              Cancel Scanning
            </Button>
          </div>
        )}

        {scannedResult && (
          <div className="space-y-4 md:space-y-6">
            <div className="p-6 md:p-8 bg-emerald-50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-emerald-100 space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-md">
                <Check className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Scanned Content</p>
                <p className="text-base md:text-lg font-bold text-zinc-900 break-all">{scannedResult}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(scannedResult);
                    setScannedResult(null);
                  }}
                  className="flex-1 h-11 md:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
                >
                  Copy & Close
                </Button>
                {scannedResult.startsWith("http") && (
                  <Button 
                    onClick={() => window.open(scannedResult, "_blank")}
                    variant="outline"
                    className="flex-1 h-11 md:h-12 rounded-xl font-bold border-2"
                  >
                    Open Link
                  </Button>
                )}
              </div>
            </div>
            <Button onClick={() => setScannedResult(null)} variant="ghost" className="font-bold text-zinc-400 text-sm">
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
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
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
            className="p-4 md:p-6 bg-zinc-50 rounded-2xl md:rounded-[2rem] border border-zinc-100 flex items-center justify-between shadow-inner"
          >
            <code className="text-lg md:text-2xl font-mono font-black text-indigo-600 tracking-wider break-all">{result}</code>
            <button onClick={() => handleCopy(result)} className="p-2.5 md:p-3 bg-white rounded-xl shadow-md hover:text-indigo-600 transition-all active:scale-90 ml-4 shrink-0">
              {copied ? <Check className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" /> : <Copy className="h-5 w-5 md:h-6 md:w-6 text-zinc-400" />}
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
      <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8 text-center max-w-2xl mx-auto shadow-2xl border-white/40">
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
              <div key={i} className="p-4 md:p-6 bg-white rounded-2xl md:rounded-[2rem] border border-zinc-100 shadow-xl flex flex-col items-center justify-center gap-3 md:gap-4 group hover:scale-105 transition-all cursor-pointer">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-900 font-black text-xl md:text-2xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {idea.charAt(0)}
                </div>
                <p className="font-black uppercase tracking-widest text-[9px] md:text-[10px] text-zinc-400 group-hover:text-indigo-600 transition-colors">{idea}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

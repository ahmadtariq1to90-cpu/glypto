import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Copy, Check, RefreshCw, QrCode, Lock, ArrowLeftRight, Eraser, LayoutGrid } from "lucide-react";

export function SimpleTools({ type }: { type: string }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === "bg-remover") {
    return (
      <div className="glass-card p-8 rounded-3xl space-y-6 text-center">
        <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto">
          <Eraser className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Background Remover</h3>
          <p className="text-zinc-500 text-sm">Upload an image to remove its background instantly using AI.</p>
        </div>
        <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 hover:border-indigo-500 transition-colors cursor-pointer">
          <p className="text-zinc-400 font-medium">Click or drag to upload image</p>
          <p className="text-[10px] text-zinc-400 mt-2 uppercase tracking-widest">Supports JPG, PNG, WEBP</p>
        </div>
        <Button className="w-full h-12 rounded-xl bg-cyan-600 hover:bg-cyan-700">Process Image</Button>
      </div>
    );
  }

  if (type === "qr-gen") {
    const generateQR = () => {
      if (!input) return;
      setResult(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(input)}`);
    };

    return (
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL or text..."
            className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-medium"
          />
          <Button onClick={generateQR} className="w-full h-12 rounded-xl bg-slate-700 hover:bg-slate-800">Generate QR Code</Button>
        </div>
        {result && (
          <div className="flex flex-col items-center space-y-4 pt-4 border-t border-zinc-100">
            <img src={result} alt="QR Code" className="w-48 h-48 rounded-lg shadow-md" />
            <Button variant="outline" onClick={() => window.open(result, "_blank")} className="rounded-xl">Download QR</Button>
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
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <Button onClick={generatePass} className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Secure Password
        </Button>
        {result && (
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
            <code className="text-lg font-mono font-bold text-indigo-600">{result}</code>
            <button onClick={handleCopy} className="text-zinc-400 hover:text-indigo-600 transition-colors">
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (type === "unit-conv") {
    const [from, setFrom] = useState("km");
    const [to, setTo] = useState("mi");
    
    const convert = () => {
      const val = parseFloat(input);
      if (isNaN(val)) return;
      let res = 0;
      if (from === "km" && to === "mi") res = val * 0.621371;
      if (from === "mi" && to === "km") res = val / 0.621371;
      setResult(res.toFixed(2));
    };

    return (
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Value"
            className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-medium"
          />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 outline-none font-medium">
            <option value="km">KM</option>
            <option value="mi">MI</option>
          </select>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 outline-none font-medium">
            <option value="mi">MI</option>
            <option value="km">KM</option>
          </select>
        </div>
        <Button onClick={convert} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700">Convert</Button>
        {result && (
          <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-2xl font-black text-emerald-700">{result} {to}</p>
          </div>
        )}
      </div>
    );
  }

  if (type === "logo") {
    return (
      <div className="glass-card p-8 rounded-3xl space-y-6 text-center">
        <div className="w-16 h-16 bg-zinc-100 text-zinc-600 rounded-2xl flex items-center justify-center mx-auto">
          <LayoutGrid className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Logo Maker</h3>
          <p className="text-zinc-500 text-sm">Enter your brand name to generate modern logo ideas.</p>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Brand Name..."
          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none font-medium"
        />
        <Button className="w-full h-12 rounded-xl bg-zinc-900">Generate Ideas</Button>
      </div>
    );
  }

  return null;
}

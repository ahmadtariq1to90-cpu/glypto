import React, { useState } from "react";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Copy, Check, Sparkles, FileText, Download, Send, Wand2, Mail, Play, AlertCircle } from "lucide-react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn, downloadAsTxt } from "../lib/utils";
import { canUseTool, incrementToolUsage } from "../lib/usage";
import { AdBanner } from "./AdBanner";

interface TextToolProps {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  secondaryInputLabel?: string;
  secondaryInputPlaceholder?: string;
  systemInstruction: string;
  promptPrefix: string;
  icon: React.ElementType;
  color: string;
  onLimitReached: (toolId: string) => void;
}

export function TextTool({ 
  id, 
  name, 
  description, 
  placeholder, 
  secondaryInputLabel,
  secondaryInputPlaceholder,
  systemInstruction, 
  promptPrefix, 
  icon: Icon, 
  color,
  onLimitReached
}: TextToolProps) {
  const [input, setInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please provide some input first.");
      return;
    }

    // Check Usage Limit
    if (!canUseTool(id)) {
      onLimitReached(id);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      let prompt = `${promptPrefix}\n\nInput: ${input}`;
      if (secondaryInput.trim()) {
        prompt += `\n\nAdditional Context/Subject: ${secondaryInput}`;
      }
      const response = await generateText(prompt, systemInstruction);
      setResult(response);
      incrementToolUsage(id);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating content.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadAsTxt(result, `${id}-result`);
  };

  const handleOpenEmail = () => {
    // Try to extract subject and body from the result
    // Usually AI returns "Subject: ..." and "Body: ..."
    const subjectMatch = result.match(/Subject:\s*(.*)/i);
    const bodyMatch = result.split(/Body:/i)[1] || result;
    
    const subject = subjectMatch ? subjectMatch[1].trim() : (secondaryInput || "No Subject");
    const body = bodyMatch.trim();
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-4 pb-20">
      <div className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto">
        <div className={cn("w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl animate-float-premium", color)}>
          <Icon className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-text-main leading-tight">
            {name}
          </h2>
          <p className="text-text-muted font-medium text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
        <div className="space-y-6 md:space-y-8">
          <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border-white/40 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={cn("p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-inner", color.replace('bg-', 'bg-').replace('500', '50'))}>
                <Send className={cn("h-5 w-5 md:h-6 md:w-6", color.replace('bg-', 'text-'))} />
              </div>
              <h3 className="text-lg md:text-xl font-black font-display tracking-tight text-text-main">Input Details</h3>
            </div>

            <div className="space-y-6">
              {secondaryInputLabel && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">{secondaryInputLabel}</label>
                  <input
                    type="text"
                    placeholder={secondaryInputPlaceholder}
                    value={secondaryInput}
                    onChange={(e) => setSecondaryInput(e.target.value)}
                    className="w-full h-12 md:h-14 px-6 rounded-xl md:rounded-2xl bg-bg-card/50 border border-border-main focus:border-indigo-500/50 outline-none transition-all font-bold text-sm md:text-base text-text-main"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Main Content</label>
                <div className={cn(
                  "relative rounded-2xl md:rounded-[2rem] border-2 transition-all duration-500 bg-bg-card/50",
                  error ? "border-red-500/50 ring-8 ring-red-500/5" : "border-border-main focus-within:border-indigo-500/50 focus-within:ring-8 focus-within:ring-indigo-500/5"
                )}>
                  <textarea
                    className="w-full p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-transparent outline-none min-h-[200px] md:min-h-[250px] text-sm md:text-base text-text-main leading-relaxed font-medium placeholder:text-text-muted resize-none"
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (e.target.value.trim()) setError(null);
                    }}
                  />
                  {error && (
                    <p className="absolute -bottom-6 md:-bottom-8 left-4 text-[10px] md:text-xs font-black text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-2">{error}</p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className={cn("w-full py-6 md:py-10 text-lg md:text-xl font-black rounded-2xl md:rounded-[2rem] transition-all shadow-2xl border-none", color, "hover:opacity-90 active:scale-95")}
            >
              {loading ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <Loader2 className="animate-spin h-5 w-5 md:h-6 md:w-6" />
                  <span>AI IS THINKING...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 md:gap-3">
                  <Wand2 className="h-5 w-5 md:h-6 md:w-6" />
                  <span>GENERATE CONTENT</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] min-h-[400px] md:min-h-[500px] bg-bg-card shadow-xl border-white/40 relative overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={cn("p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-inner", color.replace('bg-', 'bg-').replace('500', '50'))}>
                  <Sparkles className={cn("h-5 w-5 md:h-6 md:w-6", color.replace('bg-', 'text-'))} />
                </div>
                <h3 className="text-lg md:text-xl font-black font-display tracking-tight text-text-main">AI Result</h3>
              </div>
              {result && (
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-grow sm:flex-none rounded-xl md:rounded-2xl text-text-muted hover:bg-bg-main font-black px-4 md:px-6 h-10 md:h-12 border-2 text-[9px] md:text-[10px] uppercase tracking-widest"
                    onClick={handleDownload}
                  >
                    <Download className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-grow sm:flex-none rounded-xl md:rounded-2xl text-indigo-500 hover:bg-indigo-500/10 font-black px-4 md:px-6 h-10 md:h-12 border border-indigo-500/20 text-[9px] md:text-[10px] uppercase tracking-widest"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" /> : <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />}
                    {copied ? "COPIED" : "COPY"}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-x-hidden">
              {loading ? (
                <div className="space-y-8 md:space-y-10 animate-pulse p-2 md:p-4">
                  <div className="space-y-4">
                    <div className="h-5 w-full bg-border-main rounded-full" />
                    <div className="h-5 w-full bg-border-main rounded-full" />
                    <div className="h-5 w-4/5 bg-border-main rounded-full" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-5 w-full bg-border-main/50 rounded-full" />
                    <div className="h-5 w-3/4 bg-border-main/50 rounded-full" />
                    <div className="h-5 w-full bg-border-main/50 rounded-full" />
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6 md:space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose dark:prose-invert prose-indigo max-w-none text-text-main leading-relaxed font-medium p-2 md:p-4 break-words overflow-x-hidden"
                  >
                    <Markdown>{result}</Markdown>
                  </motion.div>

                  {/* Tool Result Ad */}
                  <div className="ad-result py-8 flex justify-center border-t border-border-main mt-8">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
                      <p className="text-text-muted text-[10px] uppercase tracking-widest font-black">Advertisement</p>
                      <AdBanner className="w-full flex justify-center" />
                    </div>
                  </div>

                  {id === 'email-writer' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 md:p-6"
                    >
                      <Button 
                        onClick={handleOpenEmail}
                        className="w-full h-14 md:h-16 rounded-2xl md:rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-sm md:text-base uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                      >
                        <Mail className="h-5 w-5 md:h-6 md:w-6" />
                        Open in Email Client
                      </Button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-muted text-center p-6 md:p-12 space-y-6 md:space-y-8">
                  <div className={cn("w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] flex items-center justify-center opacity-20 shadow-inner", color)}>
                    <FileText className="h-10 w-10 md:h-12 md:w-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl md:text-2xl font-black font-display text-text-main">Ready to Create</h4>
                    <p className="max-w-xs mx-auto text-xs md:text-sm font-medium text-text-muted leading-relaxed">
                      Your AI-generated content will appear here in beautiful markdown format.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className={cn("absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 rounded-bl-[4rem] md:rounded-bl-[6rem] -z-10 opacity-5", color)} />
            <div className={cn("absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 rounded-tr-[3rem] md:rounded-tr-[4rem] -z-10 opacity-5", color)} />
          </div>

          {/* Persistent Tool Bottom Ad */}
          <div className="mt-12 py-8 border-t border-border-main flex flex-col items-center gap-4">
            <p className="text-text-muted text-[10px] uppercase tracking-widest font-black">Advertisement</p>
            <AdBanner />
          </div>
        </div>
      </div>
    </div>
  );
}

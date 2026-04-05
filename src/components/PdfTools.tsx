import React, { useState } from 'react';
import { FileText, Merge, Scissors, Upload, Download, Loader2, X, FilePlus, Trash2, Play, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from "motion/react";
import { canUseTool, incrementToolUsage } from "../lib/usage";
import { AdBanner } from "./AdBanner";

export const PdfTools: React.FC<{ onLimitReached: (toolId: string) => void }> = ({ onLimitReached }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      setResult(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;

    // Check Usage Limit
    if (!canUseTool("pdf-merger")) {
      onLimitReached("pdf-merger");
      return;
    }

    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
      incrementToolUsage("pdf-merger");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Failed to merge PDFs. Please ensure all files are valid PDF documents.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `merged-${Date.now()}.pdf`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <FileText className="h-10 w-10" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-text-main">PDF Merge & Tools</h2>
        <p className="text-text-muted font-medium max-w-lg mx-auto">
          Combine multiple PDF documents into a single professional file in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-bg-card shadow-xl border-border-main space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-main">Selected Files</h3>
                <span className="text-[10px] font-black text-blue-600 bg-blue-500/10 px-2 py-1 rounded-md uppercase tracking-widest">
                  {files.length} Files
                </span>
              </div>

              <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 md:p-4 bg-bg-main rounded-xl md:rounded-2xl border border-border-main flex items-center justify-between group gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-bg-card rounded-lg md:rounded-xl flex items-center justify-center shadow-sm shrink-0">
                          <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs md:text-sm font-bold text-text-main truncate">{file.name}</p>
                          <p className="text-[9px] md:text-[10px] text-text-muted font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-2 text-text-muted hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <label className="block">
                  <div className="p-6 md:p-8 rounded-xl md:rounded-2xl border-2 border-dashed border-border-main hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 md:gap-3 group">
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-card rounded-lg md:rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <FilePlus className="h-5 w-5 md:h-6 md:w-6 text-text-muted group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-blue-600 transition-colors">Add More PDFs</p>
                  </div>
                </label>
              </div>
            </div>

            <Button 
              onClick={mergePdfs} 
              disabled={files.length < 2 || loading}
              className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-base md:text-lg font-bold shadow-lg shadow-blue-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Merge className="mr-2 h-5 w-5" />
                  Merge All PDFs
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-bg-card shadow-2xl border-border-main sticky top-24 text-center space-y-4 md:space-y-6"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                  <Download className="h-8 w-8 md:h-12 md:w-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl md:text-2xl font-black text-text-main">Merge Complete!</h4>
                  <p className="text-xs md:text-sm text-text-muted font-medium">Your documents have been successfully combined.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={downloadResult} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-base md:text-lg font-bold shadow-lg shadow-emerald-100">
                    Download PDF
                  </Button>
                  <Button onClick={() => setResult(null)} variant="ghost" className="font-bold text-text-muted text-sm">
                    Start Over
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-bg-card border-dashed border-2 border-border-main flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 min-h-[300px] md:min-h-[500px]">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-bg-main rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
                  <Merge className="h-8 w-8 md:h-12 md:w-12 text-text-muted opacity-20" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg md:text-xl font-bold text-text-main">Ready to Merge?</h4>
                  <p className="text-xs md:text-sm text-text-muted font-medium max-w-xs mx-auto">
                    Upload at least two PDF files to combine them into a single document.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Individual Tool Page: (B) Below result */}
      <AdBanner />
    </div>
  );
};

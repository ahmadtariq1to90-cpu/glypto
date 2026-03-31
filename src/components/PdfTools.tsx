import React, { useState } from 'react';
import { FileText, Merge, Scissors, Upload, Download, Loader2, X, FilePlus, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from "motion/react";

export const PdfTools: React.FC = () => {
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
        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
          <FileText className="h-10 w-10" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">PDF Merge & Tools</h2>
        <p className="text-zinc-500 font-medium max-w-lg mx-auto">
          Combine multiple PDF documents into a single professional file in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-white shadow-xl border-white/40 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900">Selected Files</h3>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">
                  {files.length} Files
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-zinc-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <label className="block">
                  <div className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group">
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <FilePlus className="h-6 w-6 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-blue-600 transition-colors">Add More PDFs</p>
                  </div>
                </label>
              </div>
            </div>

            <Button 
              onClick={mergePdfs} 
              disabled={files.length < 2 || loading}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Merging Documents...
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
                className="glass-card p-8 rounded-[2.5rem] bg-white shadow-2xl border-white/40 sticky top-24 text-center space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
                  <Download className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-zinc-900">Merge Complete!</h4>
                  <p className="text-zinc-500 font-medium">Your documents have been successfully combined into one PDF.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={downloadResult} className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg font-bold shadow-lg shadow-emerald-100">
                    Download Merged PDF
                  </Button>
                  <Button onClick={() => setResult(null)} variant="ghost" className="font-bold text-zinc-400">
                    Start Over
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-[2.5rem] bg-zinc-50/50 border-dashed border-2 border-zinc-200 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-zinc-200/50">
                  <Merge className="h-12 w-12 text-zinc-200" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-zinc-900">Ready to Merge?</h4>
                  <p className="text-zinc-400 font-medium max-w-xs mx-auto">
                    Upload at least two PDF files to combine them into a single document.
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

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "./ui/Button";
import { FileText, Plus, Scissors, Download, Loader2, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

export function PdfTools() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [pageRange, setPageRange] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (mode === "split") {
        setFiles([e.target.files[0]]);
      } else {
        setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      link.click();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const splitPdf = async () => {
    if (files.length !== 1 || !pageRange) return;
    setLoading(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      // Parse range like "1-3, 5, 7-10"
      const pagesToExtract: number[] = [];
      const parts = pageRange.split(",");
      for (const part of parts) {
        const range = part.trim().split("-");
        if (range.length === 2) {
          const start = parseInt(range[0]) - 1;
          const end = parseInt(range[1]) - 1;
          for (let i = start; i <= end; i++) {
            if (i >= 0 && i < pdf.getPageCount()) pagesToExtract.push(i);
          }
        } else {
          const page = parseInt(range[0]) - 1;
          if (page >= 0 && page < pdf.getPageCount()) pagesToExtract.push(page);
        }
      }

      if (pagesToExtract.length === 0) throw new Error("Invalid page range");

      const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `split_${file.name}`;
      link.click();
    } catch (error: any) {
      alert(error.message || "Failed to split PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 bg-indigo-100 rounded-[2rem] mb-2 shadow-inner">
          <FileText className="h-10 w-10 text-indigo-600" />
        </div>
        <h2 className="text-5xl font-black font-display tracking-tight premium-gradient-text">PDF Merge & Split</h2>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">Professional tools to manage your PDF documents with ease and precision.</p>
      </div>

      <div className="flex justify-center gap-6 p-2 bg-zinc-100/50 rounded-[2.5rem] w-fit mx-auto border border-zinc-200/50 backdrop-blur-sm shadow-inner">
        <button 
          onClick={() => { setMode("merge"); setFiles([]); }}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-[2rem] text-lg font-black transition-all duration-500",
            mode === "merge" 
              ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 scale-105" 
              : "text-zinc-500 hover:text-indigo-600"
          )}
        >
          <Plus className="h-6 w-6" />
          Merge PDFs
        </button>
        <button 
          onClick={() => { setMode("split"); setFiles([]); }}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-[2rem] text-lg font-black transition-all duration-500",
            mode === "split" 
              ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 scale-105" 
              : "text-zinc-500 hover:text-indigo-600"
          )}
        >
          <Scissors className="h-6 w-6" />
          Split PDF
        </button>
      </div>

      <div className="glass-card p-12 rounded-[3rem] shadow-2xl shadow-indigo-50/50 space-y-10 border-white/40">
        <input
          id="pdf-upload"
          type="file"
          className="hidden"
          accept="application/pdf"
          multiple={mode === "merge"}
          onChange={handleFileChange}
        />
        
        <div 
          className="cursor-pointer py-20 rounded-[2.5rem] border-4 border-dashed border-zinc-100 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-500 group relative overflow-hidden"
          onClick={() => document.getElementById('pdf-upload')?.click()}
        >
          <div className="relative z-10 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200/50 group-hover:scale-110 transition-transform duration-500">
              <FileText className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-zinc-700">Click to upload PDF files</p>
              <p className="text-lg text-zinc-400 font-medium">
                {mode === "merge" ? "Select multiple files to merge them" : "Select a file to split it"}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/0 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-8 bg-zinc-50/50 border border-zinc-100 rounded-[2.5rem]">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-zinc-100 rounded-2xl h-16 w-16" />
                  <div className="space-y-3">
                    <div className="h-5 w-64 bg-zinc-100 rounded-lg" />
                    <div className="h-4 w-32 bg-zinc-50 rounded-lg" />
                  </div>
                </div>
                <div className="h-12 w-12 bg-zinc-50 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : files.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Selected Files ({files.length})</h3>
              <button 
                onClick={() => setFiles([])}
                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid gap-4">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-zinc-50/50 border border-zinc-100 rounded-3xl group hover:border-indigo-200 hover:bg-white transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-zinc-700 truncate max-w-[300px]">{file.name}</span>
                      <span className="text-sm text-zinc-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(i)}
                    className="p-3 hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-all rounded-2xl border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
            
            {mode === "merge" && files.length >= 2 && (
              <Button 
                className="w-full py-10 text-2xl font-black rounded-[2rem] bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-200/50 border-none" 
                onClick={mergePdfs} 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8" />
                    <span>Merging Documents...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Download className="h-8 w-8" />
                    <span>Merge and Download</span>
                  </div>
                )}
              </Button>
            )}

            {mode === "split" && files.length === 1 && (
              <div className="space-y-8 p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 shadow-inner">
                <div className="space-y-4">
                  <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Page Range to Extract</label>
                  <input
                    className="w-full p-6 rounded-3xl border border-indigo-100 bg-white outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-xl font-bold placeholder:text-zinc-300 shadow-sm"
                    placeholder="e.g. 1-3, 5, 7-10"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                  />
                  <p className="text-sm text-indigo-400 font-bold ml-2">Example: 1-3 (extracts pages 1 to 3)</p>
                </div>
                <Button 
                  className="w-full py-10 text-2xl font-black rounded-[2rem] bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-200/50 border-none" 
                  onClick={splitPdf} 
                  disabled={loading || !pageRange}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Loader2 className="animate-spin h-8 w-8" />
                      <span>Splitting Document...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Scissors className="h-8 w-8" />
                      <span>Split and Download</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

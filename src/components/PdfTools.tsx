import React from 'react';
import { FileText, Merge, Scissors } from 'lucide-react';
import { Button } from './ui/Button';

export const PdfTools: React.FC = () => {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">PDF Merge & Tools</h2>
          <p className="text-zinc-500">Manage your PDF documents with ease.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-zinc-100 hover:border-blue-500/20 transition-all space-y-4">
          <Merge className="h-8 w-8 text-blue-500" />
          <h3 className="text-lg font-bold">Merge PDFs</h3>
          <p className="text-sm text-zinc-500">Combine multiple PDF files into a single document.</p>
          <Button className="w-full bg-blue-500 hover:bg-blue-600">Select Files</Button>
        </div>
        <div className="p-6 rounded-3xl border border-zinc-100 hover:border-blue-500/20 transition-all space-y-4">
          <Scissors className="h-8 w-8 text-blue-500" />
          <h3 className="text-lg font-bold">Split PDF</h3>
          <p className="text-sm text-zinc-500">Extract pages from your PDF or split it into multiple files.</p>
          <Button className="w-full bg-blue-500 hover:bg-blue-600">Select File</Button>
        </div>
      </div>
    </div>
  );
};

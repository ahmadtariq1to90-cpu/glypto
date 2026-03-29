import React, { useState } from 'react';
import { ImageIcon, Upload, Wand2 } from 'lucide-react';
import { Button } from './ui/Button';

export const ImageToCartoon: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
          <ImageIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Image to Cartoon</h2>
          <p className="text-zinc-500">Transform your photos into digital art.</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <div className="aspect-square rounded-[2rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 text-center space-y-4 hover:border-rose-500/20 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
            <Upload className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="font-bold">Upload an image</p>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">JPG, PNG up to 10MB</p>
          </div>
        </div>

        <Button className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-lg">
          <Wand2 className="h-5 w-5 mr-2" />
          Cartoonize Now
        </Button>
      </div>
    </div>
  );
};

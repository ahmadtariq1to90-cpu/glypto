import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Play, Clock, X } from "lucide-react";
import { Button } from "./ui/Button";

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  toolName: string;
}

export function UsageLimitModal({ isOpen, onClose, onWatchAd, toolName }: UsageLimitModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md glass-card p-10 rounded-[3rem] text-center space-y-8 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto shadow-inner">
            <AlertCircle className="h-10 w-10" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black font-display tracking-tight text-text-main">Limit Reached</h2>
            <p className="text-text-muted font-medium leading-relaxed">
              You have used <span className="text-indigo-500 font-bold">{toolName}</span> 5 times today. 
              Unlock more uses instantly by supporting us with a quick ad.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full rounded-2xl h-16 bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] border-none animate-glow"
              onClick={onWatchAd}
            >
              <Play className="h-5 w-5 mr-2 fill-current" />
              Watch Ad to Unlock
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-2xl h-16 border-border-main text-text-muted hover:bg-bg-card"
              onClick={onClose}
            >
              <Clock className="h-5 w-5 mr-2" />
              Wait 24 Hours
            </Button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-text-muted hover:text-text-main transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

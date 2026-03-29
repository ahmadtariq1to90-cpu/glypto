import React from "react";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isNew?: boolean;
  onClick?: () => void;
}

export function ToolCard({ name, description, icon: Icon, color, isNew, onClick }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="glass-card p-6 rounded-3xl cursor-pointer group relative overflow-hidden flex flex-col h-full border border-white/5 hover:border-white/10 transition-all"
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20",
        color
      )} />

      <div className="flex items-start justify-between mb-6">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
          color
        )}>
          <Icon className="h-6 w-6" />
        </div>
        {isNew && (
          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
            New
          </span>
        )}
      </div>

      <div className="flex-grow space-y-2">
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
          {name}
          <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI Powered</span>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 overflow-hidden">
              <img 
                src={`https://i.pravatar.cc/100?u=${name}${i}`} 
                alt="User" 
                className="w-full h-full object-cover grayscale opacity-50"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

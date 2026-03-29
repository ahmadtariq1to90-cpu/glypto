import React from "react";
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText, 
  Code, 
  Zap, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { ToolView } from "../../types";

interface BentoGridProps {
  onNavigate: (view: ToolView) => void;
}

export function BentoGrid({ onNavigate }: BentoGridProps) {
  const items = [
    {
      id: "chat",
      title: "AI Chat Assistant",
      description: "Chat with our most advanced AI model for writing, coding, and brainstorming.",
      icon: MessageSquare,
      color: "bg-indigo-500",
      className: "md:col-span-2 md:row-span-2",
      image: "https://picsum.photos/seed/chat/800/600",
    },
    {
      id: "image-gen",
      title: "Image Generation",
      description: "Create stunning visuals from text prompts in seconds.",
      icon: ImageIcon,
      color: "bg-purple-500",
      className: "md:col-span-1 md:row-span-2",
      image: "https://picsum.photos/seed/image/600/800",
    },
    {
      id: "writing",
      title: "AI Writing",
      description: "Generate articles, emails, and social media posts.",
      icon: FileText,
      color: "bg-emerald-500",
      className: "md:col-span-1 md:row-span-1",
      disabled: true,
    },
    {
      id: "coding",
      title: "Code Helper",
      description: "Debug and generate code in any language.",
      icon: Code,
      color: "bg-amber-500",
      className: "md:col-span-1 md:row-span-1",
      disabled: true,
    },
    {
      id: "audio",
      title: "Audio & Speech",
      description: "Text-to-speech and voice cloning tools.",
      icon: Music,
      color: "bg-rose-500",
      className: "md:col-span-1 md:row-span-1",
      disabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => !item.disabled && onNavigate(item.id as ToolView)}
          className={cn(
            "glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5 hover:border-white/10 transition-all relative flex flex-col",
            item.className,
            item.disabled && "opacity-60 cursor-not-allowed grayscale"
          )}
        >
          {item.image && (
            <div className="absolute inset-0 z-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex items-start justify-between mb-auto">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                item.color
              )}>
                <item.icon className="h-6 w-6" />
              </div>
              {item.disabled ? (
                <span className="px-2 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Soon</span>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="space-y-2 mt-6">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[240px]">
                {item.description}
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          {!item.disabled && (
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

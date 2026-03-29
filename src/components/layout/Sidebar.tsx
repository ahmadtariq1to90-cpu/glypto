import React from "react";
import { 
  LayoutGrid, 
  MessageSquare, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Settings, 
  HelpCircle, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ToolView } from "../../types";

interface SidebarProps {
  currentView: ToolView;
  onNavigate: (view: ToolView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ currentView, onNavigate, isCollapsed, setIsCollapsed }: SidebarProps) {
  const navItems = [
    { id: "home", name: "Dashboard", icon: LayoutGrid },
    { id: "chat", name: "AI Chat", icon: MessageSquare },
    { id: "image-gen", name: "Image Gen", icon: ImageIcon },
    { id: "audio", name: "Audio", icon: Music, disabled: true },
    { id: "video", name: "Video", icon: Video, disabled: true },
  ];

  const bottomItems = [
    { id: "settings", name: "Settings", icon: Settings, disabled: true },
    { id: "help", name: "Help", icon: HelpCircle, disabled: true },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-zinc-950 border-r border-white/5 transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold font-display tracking-tight text-white">OneAI</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => onNavigate(item.id as ToolView)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
              currentView === item.id 
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
              item.disabled && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
              currentView === item.id ? "text-indigo-400" : "text-zinc-400"
            )} />
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.name}</span>
            )}
            {item.disabled && !isCollapsed && (
              <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase font-bold">Soon</span>
            )}
            {currentView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        {!isCollapsed && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Pro Plan</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">Get unlimited access to all AI models.</p>
            <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        )}

        {bottomItems.map((item) => (
          <button
            key={item.id}
            disabled={item.disabled}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all opacity-50 cursor-not-allowed"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.name}</span>
            )}
          </button>
        ))}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-100 transition-all mt-2"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span className="font-medium text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

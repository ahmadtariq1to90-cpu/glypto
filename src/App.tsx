/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  FileUser, 
  RefreshCw, 
  Image as ImageIcon, 
  FileText, 
  Instagram,
  ArrowLeft,
  Zap,
  Shield,
  Mail,
  ExternalLink,
  ChevronRight,
  WifiOff,
  AlertCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tool, ToolView } from "./types";
import { CaptionGenerator } from "./components/CaptionGenerator";
import { ResumeBuilder } from "./components/ResumeBuilder";
import { ArticleRewriter } from "./components/ArticleRewriter";
import { ImageToCartoon } from "./components/ImageToCartoon";
import { PdfTools } from "./components/PdfTools";
import { BioGenerator } from "./components/BioGenerator";
import { FeedbackForm } from "./components/FeedbackForm";
import { Button } from "./components/ui/Button";
import { cn } from "./lib/utils";

const TOOLS: Tool[] = [
  {
    id: "caption",
    name: "AI Caption Generator",
    description: "Elevate your social presence with AI-crafted captions that drive engagement. Tailored for Instagram, Twitter, and LinkedIn with perfect hashtags and tone.",
    icon: MessageSquare,
    category: "Social",
    color: "bg-indigo-500"
  },
  {
    id: "resume",
    name: "AI Resume Builder",
    description: "Transform your career path with a professional resume. Our AI analyzes industry standards to generate high-impact bullet points and summaries that get you noticed.",
    icon: FileUser,
    category: "Productivity",
    color: "bg-emerald-500"
  },
  {
    id: "rewrite",
    name: "Article Rewriter",
    description: "Breathe new life into your content. Instantly rewrite articles to be unique, engaging, and plagiarism-free while maintaining the original core message.",
    icon: RefreshCw,
    category: "Content",
    color: "bg-amber-500"
  },
  {
    id: "cartoon",
    name: "Image to Cartoon",
    description: "Turn your portraits into stunning digital art. Our advanced AI styles your photos into high-quality cartoons, perfect for unique avatars and social media profiles.",
    icon: ImageIcon,
    category: "Design",
    color: "bg-rose-500"
  },
  {
    id: "pdf",
    name: "PDF Merge & Tools",
    description: "The ultimate PDF utility belt. Merge multiple documents, split pages, and manage your files with lightning speed and zero quality loss.",
    icon: FileText,
    category: "Productivity",
    color: "bg-blue-500"
  },
  {
    id: "bio",
    name: "Instagram Bio Generator",
    description: "Make a powerful first impression. Generate creative, catchy, and personality-driven bios that reflect your brand and attract new followers instantly.",
    icon: Instagram,
    category: "Social",
    color: "bg-pink-500"
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ToolView>("home");
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [socialBarKey, setSocialBarKey] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [adBlockEnabled, setAdBlockEnabled] = useState(false);
  const [showAdBlockMsg, setShowAdBlockMsg] = useState(false);

  // Adsterra Direct Link (Recommended for Popunder control)
  // IMPORTANT: Replace this URL with your actual Adsterra Direct Link URL
  // If you put a .js URL here, it will NOT open a new tab correctly.
  const POPUNDER_URL = "https://www.highrevenuenetwork.com/YOUR_DIRECT_LINK_HERE";

  // Detect Ad Blocker
  useEffect(() => {
    const checkAdBlock = async () => {
      try {
        const response = await fetch("https://pl29003205.profitablecpmratenetwork.com/88/a1/ee/88a1ee9665c441b7575bda546e234b4b.js", {
          method: "HEAD",
          mode: "no-cors",
        });
        setAdBlockEnabled(false);
      } catch (error) {
        setAdBlockEnabled(true);
        setShowAdBlockMsg(true);
      }
    };
    checkAdBlock();
  }, []);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Social Bar Manager: Re-shows after 10-20 seconds if closed
  useEffect(() => {
    const scriptId = "adsterra-social-bar";
    
    const loadSocialBar = () => {
      if (document.getElementById(scriptId)) return;
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "https://pl29003352.profitablecpmratenetwork.com/d8/f1/23/d8f123d4048f9e356ef303a430f8b020.js";
      document.body.appendChild(script);
    };

    loadSocialBar();

    // Observer to detect when the ad is closed/removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && (node.className.includes('social-bar') || node.id.includes('adsterra'))) {
            const randomDelay = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
            console.log(`Ad closed, re-scheduling in ${randomDelay / 1000}s...`);
            setTimeout(() => {
              const oldScript = document.getElementById(scriptId);
              if (oldScript) oldScript.remove();
              setSocialBarKey(prev => prev + 1); // Force re-render
            }, randomDelay);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [socialBarKey]);

  const triggerPopunder = () => {
    // IMPORTANT: For the "Click-to-Unlock" logic to work, you MUST use an Adsterra DIRECT LINK.
    // If you use a Script URL (ending in .js), the browser will just show the code (as seen in your screenshot).
    
    if (POPUNDER_URL.includes(".js")) {
      console.warn("You are using a Script URL instead of a Direct Link. Injecting as script instead of opening tab.");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = POPUNDER_URL;
      document.body.appendChild(script);
    } else if (POPUNDER_URL !== "https://www.highrevenuenetwork.com/YOUR_DIRECT_LINK_HERE") {
      // This is the correct way for a Direct Link
      window.open(POPUNDER_URL, '_blank');
    } else {
      console.error("Please set your Adsterra Direct Link in App.tsx");
    }
  };

  const handleAction = (id: string, action: () => void) => {
    if (unlockedIds.has(id)) {
      action();
    } else {
      triggerPopunder();
      setUnlockedIds(prev => new Set(prev).add(id));
      // Optional: Show a small toast or message to click again
    }
  };

  const handleNavigate = (view: ToolView) => {
    // If navigating back to home, show an ad
    if (view === "home" && currentView !== "home") {
      triggerPopunder();
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderTool = () => {
    if (currentView === "all-tools") {
      return (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-zinc-900">All AI Tools</h2>
            <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto font-medium">Browse our complete collection of advanced AI-powered tools designed to supercharge your workflow.</p>
          </div>
          <div className="tool-grid pt-4">
            {TOOLS.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-3xl cursor-pointer group hover:border-indigo-500/20 transition-all"
                onClick={() => handleAction(`all-${tool.id}`, () => handleNavigate(tool.id as ToolView))}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm transition-transform duration-500 group-hover:scale-110", tool.color)}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex items-center text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  Launch Tool
                  <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    switch (currentView) {
      case "caption": return <CaptionGenerator />;
      case "resume": return <ResumeBuilder />;
      case "rewrite": return <ArticleRewriter />;
      case "cartoon": return <ImageToCartoon />;
      case "pdf": return <PdfTools />;
      case "bio": return <BioGenerator />;
      default: return null;
    }
  };

  const activeTool = TOOLS.find(t => t.id === currentView);

  if (isOffline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 glass-card p-12 rounded-[40px]"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto">
            <WifiOff className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black font-display tracking-tight text-zinc-900">You're Offline</h1>
            <p className="text-zinc-500 font-medium leading-relaxed">
              It looks like you've lost your connection. Glypto requires an active internet connection to power our AI tools.
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full rounded-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold"
          >
            Try Reconnecting
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* AdBlock Warning */}
      <AnimatePresence>
        {showAdBlockMsg && adBlockEnabled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-600 text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-bold tracking-wide uppercase">
                  Ad Blocker Detected: Please consider disabling it to support Glypto's free AI tools.
                </p>
              </div>
              <button 
                onClick={() => setShowAdBlockMsg(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mesh Background Blobs */}
      <div className="mesh-bg pointer-events-none opacity-50">
        <div className="mesh-blob w-[500px] h-[500px] bg-indigo-200 top-[-100px] left-[-100px]" />
        <div className="mesh-blob w-[400px] h-[400px] bg-purple-200 top-[20%] right-[-100px] [animation-delay:2s]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleAction("nav-logo", () => handleNavigate("home"))}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight">Glypto</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <button onClick={() => handleAction("nav-tools", () => handleNavigate("all-tools"))} className="text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors">Tools</button>
              <button onClick={() => handleAction("nav-about", () => {})} className="text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors">About</button>
            </nav>
            <Button size="sm" className="rounded-full px-5 h-9 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:scale-105" onClick={() => handleAction("nav-get-started", () => handleNavigate("all-tools"))}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 md:py-16 w-full">
        <AnimatePresence mode="wait">
          {currentView === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 md:space-y-24"
            >
              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-4xl mx-auto px-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 animate-in fade-in slide-in-from-bottom-2">
                  <Sparkles className="h-3 w-3" />
                  Welcome to Glypto
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-zinc-900 leading-[1.1]">
                  AI Tools for the <br />
                  <span className="premium-gradient-text">Modern Creator</span>
                </h1>
                <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
                  Supercharge your content with our suite of advanced AI micro-tools. Professional results in seconds.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Button 
                    size="lg" 
                    className="rounded-full px-7 h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-105 border-none"
                    onClick={() => handleAction("hero-explore", () => handleNavigate("all-tools"))}
                  >
                    Explore All Tools
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-7 h-12 text-sm font-bold border-zinc-200 hover:bg-white transition-all" onClick={() => handleAction("hero-demo", () => {})}>
                    Watch Demo
                  </Button>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold font-display">Popular Tools</h2>
                </div>
                
                <div className="tool-grid">
                  {TOOLS.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -4 }}
                      className="glass-card p-6 rounded-3xl cursor-pointer group hover:border-indigo-500/20 transition-all relative overflow-hidden"
                      onClick={() => handleAction(`popular-${tool.id}`, () => handleNavigate(tool.id as ToolView))}
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm", tool.color)}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-indigo-600 font-bold text-xs uppercase tracking-wider">
                        Try Now
                        <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Ad Placeholder */}
              <div className="w-full h-24 bg-zinc-50 rounded-3xl flex items-center justify-center border border-zinc-100 border-dashed">
                <div className="text-center">
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black mb-1">Advertisement</p>
                  <p className="text-zinc-500 text-sm font-medium">Your Ad Here - Boost Your Traffic</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tool"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => handleAction("back-button", () => handleNavigate(currentView === "all-tools" ? "home" : "all-tools"))}
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-bold uppercase tracking-wider group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  {currentView === "all-tools" ? "Back to Home" : "All Tools"}
                </button>
                {currentView !== "all-tools" && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">{activeTool?.category}</span>
                  </div>
                )}
              </div>

              {currentView !== "all-tools" && (
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-zinc-900">{activeTool?.name}</h1>
                  <p className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl">{activeTool?.description}</p>
                </div>
              )}

              <div className="min-h-[400px]">
                {renderTool()}
              </div>

              {currentView !== "all-tools" && activeTool && (
                <FeedbackForm toolName={activeTool.name} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/40 py-10 md:py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg font-black font-display tracking-tighter">Glypto</span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm leading-relaxed font-medium">
                Empowering the next generation of creators with advanced AI micro-tools. Professional results, simplified.
              </p>
              <div className="space-y-3 pt-1" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="Glypto" />
                <div className="flex items-center gap-3 text-zinc-500 hover:text-indigo-600 transition-colors cursor-pointer group" onClick={() => handleAction("footer-contact", () => window.location.href = "mailto:support@glypto.com")}>
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 transition-all shadow-sm">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Contact Us</span>
                    <span className="text-xs font-bold">support@glypto.com</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[Shield, Zap, ExternalLink].map((Icon, i) => (
                    <div key={i} className="w-9 h-9 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-indigo-600 transition-all cursor-pointer shadow-sm">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-[10px] text-zinc-900 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-xs text-zinc-500 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-all-tools", () => handleNavigate("all-tools"))}>All Tools</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-api", () => {})}>API Docs</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-updates", () => {})}>Updates</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-[10px] text-zinc-900 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-xs text-zinc-500 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-about", () => {})}>About</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-privacy", () => {})}>Privacy</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-terms", () => {})}>Terms</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-support", () => {})}>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-zinc-100 gap-4">
            <p className="text-zinc-400 text-[10px] font-medium">© 2026 Glypto. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-security", () => {})}>Security</span>
              <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-status", () => {})}>Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

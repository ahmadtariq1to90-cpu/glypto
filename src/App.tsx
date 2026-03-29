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
import { StaticPage } from "./components/StaticPage";
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
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // Adsterra Direct Link (Recommended for Popunder control)
  // IMPORTANT: Replace this URL with your actual Adsterra Direct Link URL
  // If you put a .js URL here, it will NOT open a new tab correctly.
  const POPUNDER_URL = "https://www.profitablecpmratenetwork.com/f9m4007n?key=3f639659b925b42d6a78964347716335";

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
      // Remove existing script if any
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = `https://pl29003352.profitablecpmratenetwork.com/d8/f1/23/d8f123d4048f9e356ef303a430f8b020.js?t=${Date.now()}`;
      document.body.appendChild(script);
    };

    loadSocialBar();

    // Observer to detect when the ad is closed/removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && (
            node.className.includes('social-bar') || 
            node.id.includes('adsterra') ||
            node.getAttribute('data-social-bar') === 'true'
          )) {
            const randomDelay = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
            console.log(`Ad closed, re-scheduling in ${randomDelay / 1000}s...`);
            setTimeout(() => {
              setSocialBarKey(prev => prev + 1); // Force re-run effect
            }, randomDelay);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [socialBarKey]);

  // Floating Button Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerPopunder = () => {
    // IMPORTANT: For the "Click-to-Unlock" logic to work, you MUST use an Adsterra DIRECT LINK.
    // If you use a Script URL (ending in .js), the browser will just show the code (as seen in your screenshot).
    
    if (POPUNDER_URL.includes(".js")) {
      console.warn("You are using a Script URL instead of a Direct Link. Injecting as script instead of opening tab.");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = POPUNDER_URL;
      document.body.appendChild(script);
    } else if (POPUNDER_URL && !POPUNDER_URL.includes("YOUR_DIRECT_LINK_HERE")) {
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

    if (["about", "privacy", "terms", "contact", "support"].includes(currentView)) {
      return (
        <StaticPage 
          type={currentView as any} 
          onBack={() => handleNavigate("home")} 
        />
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
              <button onClick={() => handleAction("nav-about", () => handleNavigate("about"))} className="text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors">About</button>
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
                    className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 border-none animate-glow"
                    onClick={() => handleAction("hero-explore", () => handleNavigate("all-tools"))}
                  >
                    Start for Free
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
      <footer className="glass-card border-t border-white/40 py-10 md:py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-4 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-xl font-black font-display tracking-tighter">Glypto</span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm leading-relaxed font-medium">
                Empowering the next generation of creators with advanced AI micro-tools. Professional results, simplified.
              </p>
              <div className="space-y-4 pt-2" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="Glypto" />
                <div className="flex items-center gap-3 text-zinc-500 hover:text-indigo-600 transition-colors cursor-pointer group" onClick={() => handleAction("footer-contact", () => handleNavigate("contact"))}>
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 transition-all shadow-sm">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contact Us</span>
                    <span className="text-sm font-bold">support@glypto.com</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-[11px] text-zinc-900 uppercase tracking-widest">Social & Design</h4>
              <ul className="space-y-3 text-sm text-zinc-500 font-medium">
                {TOOLS.filter(t => t.category === "Social" || t.category === "Design").map(tool => (
                  <li key={tool.id} className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction(`footer-tool-${tool.id}`, () => handleNavigate(tool.id as any))}>
                    {tool.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-[11px] text-zinc-900 uppercase tracking-widest">Productivity</h4>
              <ul className="space-y-3 text-sm text-zinc-500 font-medium">
                {TOOLS.filter(t => t.category === "Productivity").map(tool => (
                  <li key={tool.id} className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction(`footer-tool-${tool.id}`, () => handleNavigate(tool.id as any))}>
                    {tool.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-[11px] text-zinc-900 uppercase tracking-widest">Content</h4>
              <ul className="space-y-3 text-sm text-zinc-500 font-medium">
                {TOOLS.filter(t => t.category === "Content").map(tool => (
                  <li key={tool.id} className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction(`footer-tool-${tool.id}`, () => handleNavigate(tool.id as any))}>
                    {tool.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-[11px] text-zinc-900 uppercase tracking-widest">Company</h4>
              <ul className="space-y-3 text-sm text-zinc-500 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-about", () => handleNavigate("about"))}>About</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-privacy", () => handleNavigate("privacy"))}>Privacy</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-terms", () => handleNavigate("terms"))}>Terms</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => handleAction("footer-support", () => handleNavigate("support"))}>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-100 gap-4">
            <p className="text-zinc-400 text-[11px] font-medium">© 2026 Glypto. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Start Button */}
      <AnimatePresence>
        {showFloatingButton && currentView === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_30px_rgba(79,70,229,0.6)] border-none animate-glow"
              onClick={() => handleAction("floating-start", () => handleNavigate("all-tools"))}
            >
              Start for Free
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

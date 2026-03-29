/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  Routes, 
  Route, 
  useNavigate, 
  useLocation,
  Link,
  Navigate
} from "react-router-dom";
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
  X,
  Menu,
  QrCode,
  Lock,
  ArrowLeftRight,
  Eraser,
  Search,
  LayoutGrid,
  Facebook,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tool, ToolView } from "./types";
import { CaptionGenerator } from "./components/CaptionGenerator.tsx";
import { ResumeBuilder } from "./components/ResumeBuilder.tsx";
import { ArticleRewriter } from "./components/ArticleRewriter.tsx";
import { ImageToCartoon } from "./components/ImageToCartoon.tsx";
import { PdfTools } from "./components/PdfTools.tsx";
import { BioGenerator } from "./components/BioGenerator.tsx";
import { FeedbackForm } from "./components/FeedbackForm.tsx";
import { StaticPage } from "./components/StaticPage.tsx";
import { Button } from "./components/ui/Button.tsx";
import { SimpleTools } from "./components/SimpleTools.tsx";
import { cn } from "./lib/utils";

const TOOLS: Tool[] = [
  {
    id: "caption",
    name: "AI Caption Generator",
    description: "Elevate your social presence with AI-crafted captions that drive engagement. Tailored for Instagram, Twitter, and LinkedIn with perfect hashtags and tone.",
    icon: MessageSquare,
    category: "Social",
    color: "bg-indigo-500",
    image: "https://picsum.photos/seed/caption/600/400"
  },
  {
    id: "resume",
    name: "AI Resume Builder",
    description: "Transform your career path with a professional resume. Our AI analyzes industry standards to generate high-impact bullet points and summaries that get you noticed.",
    icon: FileUser,
    category: "Productivity",
    color: "bg-emerald-500",
    image: "https://picsum.photos/seed/resume/600/400"
  },
  {
    id: "rewrite",
    name: "Article Rewriter",
    description: "Breathe new life into your content. Instantly rewrite articles to be unique, engaging, and plagiarism-free while maintaining the original core message.",
    icon: RefreshCw,
    category: "Content",
    color: "bg-amber-500",
    image: "https://picsum.photos/seed/rewrite/600/400"
  },
  {
    id: "cartoon",
    name: "Image to Cartoon",
    description: "Turn your portraits into stunning digital art. Our advanced AI styles your photos into high-quality cartoons, perfect for unique avatars and social media profiles.",
    icon: ImageIcon,
    category: "Design",
    color: "bg-rose-500",
    image: "https://picsum.photos/seed/cartoon/600/400"
  },
  {
    id: "pdf",
    name: "PDF Merge & Tools",
    description: "The ultimate PDF utility belt. Merge multiple documents, split pages, and manage your files with lightning speed and zero quality loss.",
    icon: FileText,
    category: "Productivity",
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/pdf/600/400"
  },
  {
    id: "bio",
    name: "Instagram Bio Generator",
    description: "Make a powerful first impression. Generate creative, catchy, and personality-driven bios that reflect your brand and attract new followers instantly.",
    icon: Instagram,
    category: "Social",
    color: "bg-pink-500",
    image: "https://picsum.photos/seed/bio/600/400"
  },
  {
    id: "bg-remover",
    name: "Background Remover",
    description: "Remove image backgrounds instantly with AI precision. Perfect for product photos, profile pictures, and clean design assets.",
    icon: Eraser,
    category: "Design",
    color: "bg-cyan-500",
    image: "https://picsum.photos/seed/bgrem/600/400"
  },
  {
    id: "qr-gen",
    name: "QR Code Generator",
    description: "Create custom QR codes for URLs, text, or contact info. High-quality, scan-ready codes for your marketing and personal needs.",
    icon: QrCode,
    category: "Utility",
    color: "bg-slate-700",
    image: "https://picsum.photos/seed/qrcode/600/400"
  },
  {
    id: "pass-gen",
    name: "Password Generator",
    description: "Generate ultra-secure, random passwords to protect your digital life. Customizable length and complexity for maximum security.",
    icon: Lock,
    category: "Productivity",
    color: "bg-orange-500",
    image: "https://picsum.photos/seed/password/600/400"
  },
  {
    id: "unit-conv",
    name: "Unit Converter",
    description: "Quickly convert between length, weight, temperature, and more. A simple, fast tool for your daily calculations.",
    icon: ArrowLeftRight,
    category: "Productivity",
    color: "bg-emerald-600",
    image: "https://picsum.photos/seed/unit/600/400"
  },
  {
    id: "tweet",
    name: "Tweet Generator",
    description: "Craft viral-worthy tweets in seconds. Our AI understands trends and brevity to help you stand out on X/Twitter.",
    icon: MessageSquare,
    category: "Social",
    color: "bg-sky-500",
    image: "https://picsum.photos/seed/tweet/600/400"
  },
  {
    id: "email",
    name: "AI Email Writer",
    description: "Write professional emails for any occasion. From cold outreach to follow-ups, our AI ensures your tone is perfect and your message is clear.",
    icon: Mail,
    category: "Content",
    color: "bg-indigo-400",
    image: "https://picsum.photos/seed/email/600/400"
  },
  {
    id: "logo",
    name: "Simple Logo Maker",
    description: "Generate clean, modern logo ideas for your brand. A quick tool to spark inspiration for your next project's visual identity.",
    icon: LayoutGrid,
    category: "Design",
    color: "bg-zinc-800",
    image: "https://picsum.photos/seed/logo/600/400"
  }
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [socialBarKey, setSocialBarKey] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [adBlockEnabled, setAdBlockEnabled] = useState(false);
  const [showAdBlockMsg, setShowAdBlockMsg] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentView = location.pathname.split("/")[1] || "home";

  const categories = ["Social", "Productivity", "Content", "Design", "Utility"];
  const categoryDescriptions: Record<string, string> = {
    Social: "Boost your social media presence with AI-powered engagement tools.",
    Productivity: "Streamline your workflow and get more done in less time.",
    Content: "Transform your writing and content creation process with advanced AI.",
    Design: "Unleash your creativity with AI-driven visual and design tools.",
    Utility: "Essential daily tools for quick tasks and simple calculations."
  };

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
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsFooterInView(rect.top < window.innerHeight);
      }
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

  const handleNavigate = (view: string) => {
    // If navigating back to home, show an ad
    if (view === "home" && currentView !== "home") {
      triggerPopunder();
    }
    const path = view === "home" ? "/" : `/${view}`;
    navigate(path);
    window.scrollTo(0, 0);
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderAllTools = () => {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-zinc-900">All AI Tools</h2>
          <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto font-medium">Browse our complete collection of advanced AI-powered tools designed to supercharge your workflow.</p>
          
          <div className="max-w-md mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="tool-grid pt-4">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-3xl cursor-pointer group hover:border-indigo-500/20 transition-all"
                onClick={() => handleAction(`all-${tool.id}`, () => handleNavigate(tool.id))}
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
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 mx-auto">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-zinc-500 font-bold">No tools found matching "{searchQuery}"</p>
            <Button variant="ghost" onClick={() => setSearchQuery("")} className="text-indigo-600 font-bold">Clear Search</Button>
          </div>
        )}
      </div>
    );
  };

  const renderTool = (view: string) => {
    if (["about", "privacy", "terms", "contact", "support", "blog"].includes(view)) {
      return (
        <StaticPage 
          type={view as any} 
          onBack={() => handleNavigate("home")} 
        />
      );
    }

    if (["bg-remover", "qr-gen", "pass-gen", "unit-conv", "logo"].includes(view)) {
      return <SimpleTools type={view as any} />;
    }

    switch (view) {
      case "caption":
      case "tweet":
        return <CaptionGenerator />;
      case "resume": return <ResumeBuilder />;
      case "rewrite":
      case "email":
        return <ArticleRewriter />;
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

          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center z-50 relative rounded-xl hover:bg-zinc-100/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="relative w-6 h-5">
              <motion.span 
                animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-0 left-0 w-full h-0.5 bg-zinc-900 rounded-full block"
              />
              <motion.span 
                animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[9px] left-0 w-full h-0.5 bg-zinc-900 rounded-full block"
              />
              <motion.span 
                animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 rounded-full block"
              />
            </div>
          </button>
        </div>

      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-14 bg-white z-[60] overflow-y-auto"
          >
            <div className="px-6 py-12 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Navigation</p>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("all-tools"); }} className="block w-full text-left text-2xl font-black text-zinc-900 hover:text-indigo-600 transition-colors">All Tools</button>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("about"); }} className="block w-full text-left text-2xl font-black text-zinc-900 hover:text-indigo-600 transition-colors">About Us</button>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("blog"); }} className="block w-full text-left text-2xl font-black text-zinc-900 hover:text-indigo-600 transition-colors">Blog</button>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("contact"); }} className="block w-full text-left text-2xl font-black text-zinc-900 hover:text-indigo-600 transition-colors">Contact</button>
              </div>
              
              <div className="pt-8 border-t border-zinc-100">
                <Button className="w-full rounded-2xl h-14 bg-indigo-600 text-lg font-bold" onClick={() => { setIsMenuOpen(false); handleNavigate("all-tools"); }}>Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 md:py-16 w-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
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
                <div className="space-y-24">
                  {categories.map((category) => {
                    const categoryTools = TOOLS.filter(t => t.category === category);
                    const isCarousel = categoryTools.length > 3;

                    return (
                      <div key={category} className="space-y-12">
                        <div className="text-center space-y-3 max-w-2xl mx-auto">
                          <h2 className="text-3xl font-black font-display tracking-tight text-zinc-900">{category} Tools</h2>
                          <p className="text-zinc-500 font-medium text-sm">{categoryDescriptions[category]}</p>
                        </div>

                        <div className={cn(
                          "relative",
                          isCarousel ? "overflow-hidden pb-4" : ""
                        )}>
                          <motion.div 
                            className={cn(
                              "flex gap-6",
                              isCarousel ? "w-max" : "grid grid-cols-1 md:grid-cols-3"
                            )}
                            animate={isCarousel ? {
                              x: [0, -100 * (categoryTools.length - 3) + "%"],
                            } : {}}
                            transition={isCarousel ? {
                              duration: categoryTools.length * 5,
                              repeat: Infinity,
                              ease: "linear",
                              repeatType: "mirror"
                            } : {}}
                          >
                            {categoryTools.map((tool) => (
                              <motion.div
                                key={tool.id}
                                whileHover={{ y: -8 }}
                                className={cn(
                                  "glass-card p-8 rounded-[2.5rem] cursor-pointer group hover:border-indigo-500/20 transition-all relative overflow-hidden flex flex-col",
                                  isCarousel ? "w-[320px]" : "w-full"
                                )}
                                onClick={() => handleAction(`popular-${tool.id}`, () => handleNavigate(tool.id))}
                              >
                                <div className="flex-grow space-y-4">
                                  <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-100 mb-4">
                                    <img 
                                      src={tool.image} 
                                      alt={tool.name} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg", tool.color)}>
                                    <tool.icon className="h-6 w-6" />
                                  </div>
                                  <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                                    {tool.description}
                                  </p>
                                </div>
                                <div className="pt-8 flex justify-center">
                                  <Button className="w-full max-w-[200px] rounded-xl h-11 bg-zinc-900 group-hover:bg-indigo-600 transition-colors font-bold text-xs uppercase tracking-widest">
                                    Try Now
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* About Section (SEO Optimized) */}
                <section className="py-24 border-t border-zinc-100">
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                        Our Story
                      </div>
                      <h2 className="text-4xl font-black font-display tracking-tight text-zinc-900 leading-tight">
                        Empowering Creativity with <br />
                        <span className="premium-gradient-text">Advanced AI Technology</span>
                      </h2>
                      <p className="text-zinc-500 font-medium leading-relaxed">
                        Glypto is a leading provider of free AI micro-tools designed to simplify complex digital tasks. Our mission is to democratize artificial intelligence, making professional-grade content creation accessible to everyone—from social media influencers to business professionals.
                      </p>
                      <p className="text-zinc-500 font-medium leading-relaxed">
                        Founded in 2026, we've helped millions of users generate high-quality captions, build professional resumes, and transform images with just a few clicks. Our platform is built on privacy, speed, and intuitive design, ensuring you get the best results without the steep learning curve.
                      </p>
                      <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-indigo-600">10M+</p>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Users Served</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-indigo-600">50+</p>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI Tools</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="aspect-square bg-indigo-600 rounded-[3rem] rotate-3 absolute inset-0 opacity-10" />
                      <div className="aspect-square bg-white border border-zinc-100 rounded-[3rem] shadow-2xl relative z-10 flex items-center justify-center p-12">
                        <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto">
                            <Sparkles className="h-12 w-12" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-2xl font-black text-zinc-900 tracking-tight">The Glypto Advantage</p>
                            <p className="text-sm text-zinc-500 font-medium">Privacy-first, lightning-fast, and 100% free AI tools for everyone.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Ad Placeholder */}
                <div className="w-full h-24 bg-zinc-50 rounded-3xl flex items-center justify-center border border-zinc-100 border-dashed">
                  <div className="text-center">
                    <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-black mb-1">Advertisement</p>
                    <p className="text-zinc-500 text-sm font-medium">Your Ad Here - Boost Your Traffic</p>
                  </div>
                </div>
              </motion.div>
            } />
            <Route path="/all-tools" element={renderAllTools()} />
            <Route path="/:toolId" element={
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleAction("back-button", () => handleNavigate("all-tools"))}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-bold uppercase tracking-wider group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    All Tools
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {TOOLS.find(t => t.id === location.pathname.split("/")[1])?.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-zinc-900">
                    {TOOLS.find(t => t.id === location.pathname.split("/")[1])?.name}
                  </h1>
                  <p className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl">
                    {TOOLS.find(t => t.id === location.pathname.split("/")[1])?.description}
                  </p>
                </div>

                <div className="min-h-[400px]">
                  {renderTool(location.pathname.split("/")[1])}
                </div>

                <FeedbackForm toolName={TOOLS.find(t => t.id === location.pathname.split("/")[1])?.name || ""} />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-16 md:py-24 mt-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="col-span-1 md:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black font-display tracking-tighter">Glypto</span>
              </div>
              <p className="text-zinc-400 max-w-sm text-lg leading-relaxed font-medium">
                The world's most advanced AI micro-tools platform. Empowering creators to build the future, one tool at a time.
              </p>
              
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Github, label: "Github" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Facebook, label: "Facebook" }
                ].map((social) => (
                  <button 
                    key={social.label}
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-indigo-500 transition-all group"
                  >
                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="font-black text-xs text-zinc-500 uppercase tracking-[0.2em]">Tools</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("all-tools")}>All Tools</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("caption")}>Caption Generator</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("resume")}>Resume Builder</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("rewrite")}>Article Rewriter</li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-xs text-zinc-500 uppercase tracking-[0.2em]">Company</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("about")}>About Us</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("blog")}>Our Blog</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("contact")}>Contact</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("support")}>Support</li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-xs text-zinc-500 uppercase tracking-[0.2em]">Legal</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("privacy")}>Privacy Policy</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("terms")}>Terms of Service</li>
                  <li className="text-zinc-400 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("cookies")}>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-16 mt-16 border-t border-zinc-900 gap-8">
            <p className="text-zinc-500 text-sm font-bold">© 2026 Glypto. Crafted with ❤️ for creators.</p>
            <div className="flex items-center gap-8 text-sm font-bold text-zinc-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                System Status: Operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Start Button */}
      <AnimatePresence>
        {showFloatingButton && !isFooterInView && location.pathname === "/" && (
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

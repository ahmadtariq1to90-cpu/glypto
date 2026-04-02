/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
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
  Github,
  ArrowRight,
  Heart,
  Sun,
  Moon,
  ChevronUp,
  ArrowUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tool, ToolView } from "./types";
import { Button } from "./components/ui/Button";
import { cn } from "./lib/utils";
import { ChatBot } from "./components/ChatBot";
import { TextTool } from "./components/TextTool";

// Lazy load components for performance
const PdfTools = lazy(() => import("./components/PdfTools").then(m => ({ default: m.PdfTools })));
const StaticPage = lazy(() => import("./components/StaticPage").then(m => ({ default: m.StaticPage })));
const SimpleTools = lazy(() => import("./components/SimpleTools").then(m => ({ default: m.SimpleTools })));

const TOOLS: Tool[] = [
  {
    id: "caption-gen",
    name: "AI Caption Generator",
    description: "Elevate your social presence with AI-crafted captions that drive engagement. Tailored for Instagram, Twitter, and LinkedIn with perfect hashtags and tone.",
    icon: MessageSquare,
    category: "Social",
    color: "bg-indigo-500",
    image: "https://picsum.photos/seed/caption/600/400"
  },
  {
    id: "article-rewrite",
    name: "AI Article Rewriter",
    description: "Breathe new life into your content. Instantly rewrite articles to be unique, engaging, and plagiarism-free while maintaining the original core message.",
    icon: RefreshCw,
    category: "Content",
    color: "bg-amber-500",
    image: "https://picsum.photos/seed/rewrite/600/400"
  },
  {
    id: "article-gen",
    name: "AI Article Generator",
    description: "Generate high-quality, SEO-optimized articles in seconds. Perfect for bloggers and content marketers looking to rank higher on Google search results with unique content.",
    icon: FileText,
    category: "Content",
    color: "bg-indigo-500",
    image: "https://picsum.photos/seed/article/600/400"
  },
  {
    id: "seo-meta",
    name: "SEO Meta Generator",
    description: "Create compelling meta titles and descriptions that improve your click-through rate (CTR) and search engine visibility for better Google rankings and traffic.",
    icon: Search,
    category: "Marketing",
    color: "bg-emerald-500",
    image: "https://picsum.photos/seed/seo/600/400"
  },
  {
    id: "email-writer",
    name: "AI Email Writer",
    description: "Draft professional emails for business, outreach, or personal use. Ensure your tone is perfect and your message is clear, persuasive, and effective.",
    icon: Mail,
    category: "Productivity",
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/email/600/400"
  },
  {
    id: "code-explainer",
    name: "AI Code Explainer",
    description: "Understand complex code snippets instantly. Our AI breaks down programming logic into simple, easy-to-understand explanations for any programming language.",
    icon: Zap,
    category: "Development",
    color: "bg-amber-500",
    image: "https://picsum.photos/seed/code/600/400"
  },
  {
    id: "yt-script",
    name: "YouTube Script Writer",
    description: "Create engaging scripts for your YouTube videos. From catchy intros to compelling calls-to-action, boost your channel's growth and viewer engagement.",
    icon: MessageSquare,
    category: "Social",
    color: "bg-rose-500",
    image: "https://picsum.photos/seed/yt/600/400"
  },
  {
    id: "product-desc",
    name: "Product Description",
    description: "Write persuasive product descriptions that sell. Ideal for e-commerce stores like Shopify, Amazon, and Etsy to increase conversion rates and sales.",
    icon: LayoutGrid,
    category: "Marketing",
    color: "bg-pink-500",
    image: "https://picsum.photos/seed/product/600/400"
  },
  {
    id: "grammar-fix",
    name: "Grammar & Tone Fixer",
    description: "Polish your writing to perfection. Fix grammar errors and adjust the tone of your text to sound professional, friendly, or authoritative for any audience.",
    icon: Sparkles,
    category: "Content",
    color: "bg-cyan-500",
    image: "https://picsum.photos/seed/grammar/600/400"
  },
  {
    id: "summarizer",
    name: "AI Text Summarizer",
    description: "Condense long articles or documents into concise summaries. Save time while capturing all the essential information from any text source instantly.",
    icon: FileText,
    category: "Productivity",
    color: "bg-orange-500",
    image: "https://picsum.photos/seed/summary/600/400"
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post Creator",
    description: "Craft professional and engaging LinkedIn posts that build your personal brand and connect with industry leaders and potential employers effectively.",
    icon: Linkedin,
    category: "Social",
    color: "bg-sky-600",
    image: "https://picsum.photos/seed/linkedin/600/400"
  },
  {
    id: "bio-gen",
    name: "AI Bio Generator",
    description: "Make a powerful first impression. Generate creative, catchy, and personality-driven bios for Instagram, Twitter, and TikTok to attract more followers.",
    icon: Instagram,
    category: "Social",
    color: "bg-fuchsia-500",
    image: "https://picsum.photos/seed/bio/600/400"
  },
  {
    id: "qr-gen",
    name: "AI QR Generator",
    description: "Create custom, high-quality QR codes for URLs, text, or images. Add your brand logo for a professional look and track engagement.",
    icon: QrCode,
    category: "Utility",
    color: "bg-slate-600",
    image: "https://picsum.photos/seed/qr/600/400"
  },
  {
    id: "qr-scan",
    name: "QR Code Scanner",
    description: "Instantly scan and decode any QR code using your camera or by uploading an image. Fast, secure, and works with all standard QR formats.",
    icon: Search,
    category: "Utility",
    color: "bg-emerald-600",
    image: "https://picsum.photos/seed/scan/600/400"
  },
  {
    id: "pass-gen",
    name: "Password Generator",
    description: "Generate ultra-secure, random passwords to protect your online accounts. Customize length and complexity for maximum security.",
    icon: Lock,
    category: "Utility",
    color: "bg-orange-500",
    image: "https://picsum.photos/seed/pass/600/400"
  },
  {
    id: "logo",
    name: "Logo Idea Maker",
    description: "Get instant creative inspiration for your brand. Generate modern and professional logo concepts based on your business name and industry.",
    icon: LayoutGrid,
    category: "Design",
    color: "bg-zinc-900",
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
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
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const renderAllTools = () => {
    return (
      <div className="space-y-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <LayoutGrid className="h-3 w-3" />
            Explore our Ecosystem
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight text-text-main leading-[0.95]">
            All AI <span className="premium-gradient-text italic">Tools</span>
          </h2>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            Browse our complete collection of advanced AI-powered tools designed to supercharge your workflow.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-bg-card border border-border-main rounded-2xl focus:border-indigo-500/50 outline-none transition-all font-medium text-text-main placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 pt-4 px-4">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" 
                    : "bg-bg-card text-text-muted border-border-main hover:border-indigo-500/50 hover:text-indigo-500"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="tool-grid pt-8 px-4">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12 }}
                className="glass-card p-10 rounded-[3rem] cursor-pointer group flex flex-col relative overflow-hidden"
                onClick={() => handleAction(`all-${tool.id}`, () => handleNavigate(tool.id))}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", tool.color)}>
                  <tool.icon className="h-7 w-7" />
                </div>
                <div className="flex-grow space-y-4">
                  <h3 className="text-2xl font-black font-display text-text-main group-hover:text-indigo-500 transition-colors">{tool.name}</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-6">
                  <div className="flex items-center text-indigo-500 font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                    Launch Tool
                    <ChevronRight className="h-3 w-3 ml-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-8">
            <div className="w-24 h-24 bg-bg-card rounded-[2rem] flex items-center justify-center text-text-muted mx-auto border border-border-main">
              <Search className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black font-display text-text-main">No matches found</p>
              <p className="text-text-muted font-medium">Try searching for something else like "PDF" or "Resume"</p>
            </div>
            <Button variant="ghost" onClick={() => setSearchQuery("")} className="text-indigo-500 font-black uppercase tracking-widest text-xs">Clear Search</Button>
          </div>
        )}
      </div>
    );
  };

  const renderTool = (view: string) => {
    return (
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        {(() => {
          if (["about", "privacy", "terms", "contact", "support", "blog"].includes(view)) {
            return (
              <StaticPage 
                type={view as any} 
                onBack={() => handleNavigate("home")} 
              />
            );
          }

          if (["bg-remover", "qr-gen", "qr-scan", "pass-gen", "logo"].includes(view)) {
            return <SimpleTools type={view as any} />;
          }

          const tool = TOOLS.find(t => t.id === view);
          
          switch (view) {
            case "caption-gen":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="What is your post about? (e.g., a beautiful sunset at the beach)..."
                  systemInstruction="You are a social media expert. Generate 5 engaging, catchy captions for the user's post. Include relevant hashtags and emojis. Provide variations for different platforms if applicable."
                  promptPrefix="Generate 5 creative social media captions for the following topic. Include hashtags and emojis."
                />
              );
            case "article-rewrite":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Paste the article or text you want to rewrite..."
                  systemInstruction="You are an expert editor. Rewrite the provided text to be unique, engaging, and professional while maintaining the original meaning. Ensure it is plagiarism-free."
                  promptPrefix="Rewrite the following text to be more engaging and unique while keeping the core message intact."
                />
              );
            case "article-gen":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Enter a topic or outline for your article..."
                  systemInstruction="You are an expert SEO content writer. Generate high-quality, engaging, and SEO-optimized articles based on the user's topic. Use proper headings, bullet points, and a professional yet engaging tone."
                  promptPrefix="Generate a comprehensive, SEO-optimized article about the following topic. Include a catchy title and structured content with H2 and H3 tags."
                />
              );
            case "seo-meta":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Enter your page content or URL description..."
                  systemInstruction="You are an SEO specialist. Generate compelling meta titles (max 60 chars) and meta descriptions (max 160 chars) that are optimized for search engines and high click-through rates."
                  promptPrefix="Generate 3 variations of SEO meta titles and descriptions for the following content. Make them catchy and relevant."
                />
              );
            case "email-writer":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Describe the purpose of the email, recipient, and key points..."
                  systemInstruction="You are a professional business communicator. Write clear, concise, and effective emails tailored to the user's specific context and desired tone."
                  promptPrefix="Write a professional email based on these details. Provide a subject line and the email body."
                />
              );
            case "code-explainer":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Paste the code snippet you want explained..."
                  systemInstruction="You are a senior software engineer and mentor. Explain code snippets in simple terms, breaking down the logic, functions, and potential edge cases."
                  promptPrefix="Explain the following code snippet in detail but in a way that is easy to understand for a beginner."
                />
              );
            case "yt-script":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="What is your video about? Mention key points or style..."
                  systemInstruction="You are a successful YouTube scriptwriter. Create engaging scripts with hooks, transitions, and clear calls to action that keep viewers watching."
                  promptPrefix="Write a YouTube video script for the following topic. Include an intro, main points, and an outro."
                />
              );
            case "product-desc":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Enter product name and key features..."
                  systemInstruction="You are an expert e-commerce copywriter. Write persuasive product descriptions that highlight benefits, solve problems, and drive sales."
                  promptPrefix="Generate a persuasive product description for the following item. Focus on benefits and emotional appeal."
                />
              );
            case "grammar-fix":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Paste the text you want to fix or improve..."
                  systemInstruction="You are a professional editor. Fix grammar, spelling, and punctuation errors while improving the overall flow and clarity of the text."
                  promptPrefix="Fix the grammar and improve the tone of the following text. Provide the corrected version and a brief summary of changes."
                />
              );
            case "summarizer":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Paste the long text or article you want to summarize..."
                  systemInstruction="You are an expert at information synthesis. Create concise, accurate summaries that capture all key points without losing the core message."
                  promptPrefix="Summarize the following text into a few concise paragraphs or bullet points."
                />
              );
            case "linkedin-post":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="What do you want to share on LinkedIn? (e.g., achievement, insight)..."
                  systemInstruction="You are a thought leader on LinkedIn. Write professional, engaging posts that encourage discussion and build authority in your niche."
                  promptPrefix="Create an engaging LinkedIn post based on the following input. Use appropriate spacing and relevant hashtags."
                />
              );
            case "bio-gen":
              return (
                <TextTool 
                  {...tool!}
                  placeholder="Tell us about yourself, your interests, or your brand..."
                  systemInstruction="You are a social media branding expert. Generate creative, catchy, and personality-driven bios that fit the constraints of platforms like Instagram or Twitter."
                  promptPrefix="Generate 5 creative social media bio variations based on the following information."
                />
              );
            case "pdf": return <PdfTools />;
            default: return null;
          }
        })()}
      </Suspense>
    );
  };

  const activeTool = TOOLS.find(t => t.id === currentView);

  if (isOffline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main px-6 relative overflow-hidden">
        <div className="mesh-bg">
          <div className="mesh-blob w-[600px] h-[600px] bg-indigo-500/10 top-[-200px] left-[-200px] animate-float-premium" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-10 glass-card p-16 rounded-[4rem] relative z-10"
        >
          <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto shadow-[0_0_60px_rgba(79,70,229,0.1)]">
            <WifiOff className="h-10 w-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black font-display tracking-tight text-text-main leading-tight">Connection Lost</h1>
            <p className="text-text-muted font-medium leading-relaxed">
              ProToolix requires an active internet connection to power our next-gen AI tools. Please check your network and try again.
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full rounded-2xl h-16 bg-indigo-600 hover:bg-indigo-700 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105"
          >
            Try Reconnecting
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* AdBlock Warning - Premium Minimalist */}
      <AnimatePresence>
        {showAdBlockMsg && adBlockEnabled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-600/10 backdrop-blur-md border-b border-indigo-500/20 text-indigo-600 dark:text-indigo-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                <p className="text-[10px] font-black tracking-[0.2em] uppercase">
                  Ad Blocker Detected: Support ProToolix's free AI tools by disabling it.
                </p>
              </div>
              <button 
                onClick={() => setShowAdBlockMsg(false)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-text-main" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optimized Mesh Background Blobs */}
      <div className="mesh-bg">
        <div className="mesh-blob w-[600px] h-[600px] bg-indigo-500/5 top-[-200px] left-[-200px] animate-float-premium" />
        <div className="mesh-blob w-[500px] h-[500px] bg-purple-500/5 top-[20%] right-[-200px] [animation-delay:2s] animate-float-premium" />
        <div className="mesh-blob w-[400px] h-[400px] bg-blue-500/5 bottom-[-100px] left-[20%] [animation-delay:4s] animate-float-premium" />
      </div>

      {/* Navigation - Ultra Smooth Glass */}
      <header className="sticky top-0 z-50 glass-card border-b border-border-main backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleAction("nav-logo", () => handleNavigate("home"))}
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-all duration-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black font-display tracking-tight premium-gradient-text">ProToolix</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              <button onClick={() => handleAction("nav-tools", () => handleNavigate("all-tools"))} className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Tools</button>
              <button onClick={() => handleAction("nav-about", () => handleNavigate("about"))} className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">About</button>
              <button onClick={() => handleAction("nav-blog", () => handleNavigate("blog"))} className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Blog</button>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-bg-card border border-border-main text-text-main hover:border-indigo-500/50 transition-all"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Button size="sm" className="rounded-full px-6 h-10 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl transition-all hover:scale-105" onClick={() => handleAction("nav-get-started", () => handleNavigate("all-tools"))}>Get Started</Button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-bg-card border border-border-main text-text-main"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center z-50 relative rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-5">
                <motion.span 
                  animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-text-main rounded-full block"
                />
                <motion.span 
                  animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[9px] left-0 w-full h-0.5 bg-text-main rounded-full block"
                />
                <motion.span 
                  animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-text-main rounded-full block"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Premium Dark Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-2xl z-[60] overflow-y-auto"
          >
            <div className="px-8 py-16 space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Navigation</p>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("all-tools"); }} className="block w-full text-left text-4xl font-black font-display text-white hover:text-indigo-500 transition-colors">All Tools</button>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("about"); }} className="block w-full text-left text-4xl font-black font-display text-white hover:text-indigo-500 transition-colors">About Us</button>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("blog"); }} className="block w-full text-left text-4xl font-black font-display text-white hover:text-indigo-500 transition-colors">Blog</button>
                <button onClick={() => { setIsMenuOpen(false); handleNavigate("contact"); }} className="block w-full text-left text-4xl font-black font-display text-white hover:text-indigo-500 transition-colors">Contact</button>
              </div>
              
              <div className="pt-12 border-t border-white/5">
                <Button className="w-full rounded-2xl h-16 bg-indigo-600 text-lg font-black uppercase tracking-widest" onClick={() => { setIsMenuOpen(false); handleNavigate("all-tools"); }}>Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 md:py-16 w-full">
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          }>
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12 md:space-y-24"
              >
                {/* Hero Section */}
                <div className="text-center space-y-8 max-w-5xl mx-auto px-4 pt-12 md:pt-24 relative">
                  <h1 className="text-5xl md:text-8xl font-black font-display tracking-tight text-text-main leading-[0.95] mb-8">
                    AI Tools for the <br />
                    <span className="premium-gradient-text">Modern Creator</span>
                  </h1>
                  <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
                    Experience the next generation of content creation with ProToolix. A suite of ultra-smooth, professional AI micro-tools designed to supercharge your workflow.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-8">
                    <Button 
                      size="lg" 
                      className="rounded-full px-12 h-16 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 border-none"
                      onClick={() => handleAction("hero-explore", () => handleNavigate("all-tools"))}
                    >
                      Explore All Tools
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="rounded-full px-12 h-16 text-base font-bold border-border-main text-text-muted hover:bg-bg-card transition-all"
                      onClick={() => {
                        const aboutSection = document.getElementById('about-section');
                        if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Our Story
                    </Button>
                  </div>
                </div>

                {/* Featured Tools Grid - Homepage Optimized */}
                <div className="space-y-32">
                  <section className="space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                      <div className="space-y-4 max-w-2xl">
                        <div className="text-indigo-500 font-mono text-xs tracking-widest uppercase">Featured / Ecosystem</div>
                        <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-text-main">Popular Tools</h2>
                        <p className="text-text-muted font-medium text-lg leading-relaxed">Our most loved AI-powered tools, handpicked to help you get started instantly.</p>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-indigo-500 hover:text-indigo-600 font-bold p-0 h-auto flex items-center gap-2 group"
                        onClick={() => handleNavigate("all-tools")}
                      >
                        View All Tools <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                      {TOOLS.slice(0, 6).map((tool) => (
                        <motion.div
                          key={tool.id}
                          whileHover={{ y: -12 }}
                          className="glass-card p-8 rounded-[3rem] cursor-pointer group hover:border-indigo-500/30 transition-all relative overflow-hidden flex flex-col h-full"
                          onClick={() => handleAction(`featured-${tool.id}`, () => handleNavigate(tool.id))}
                        >
                          <div className="flex-grow space-y-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl transition-transform group-hover:scale-110 duration-500", tool.color)}>
                              <tool.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-black text-text-main group-hover:text-indigo-500 transition-colors tracking-tight">{tool.name}</h3>
                            <p className="text-text-muted text-base leading-relaxed line-clamp-3 font-medium">
                              {tool.description}
                            </p>
                          </div>
                          <div className="pt-10">
                            <Button className="w-full rounded-2xl h-14 bg-bg-card text-text-main border border-border-main hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all font-black text-xs uppercase tracking-[0.2em]">
                              Launch Tool
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* About Section */}
                <section id="about-section" className="py-32 border-t border-border-main">
                  <div className="grid md:grid-cols-2 gap-20 items-center px-4">
                    <div className="space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Our Story
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight text-text-main leading-[0.95]">
                        Empowering <br />
                        <span className="premium-gradient-text">Next-Gen Creators</span>
                      </h2>
                      <p className="text-text-muted font-medium text-lg leading-relaxed">
                        ProToolix is a premium ecosystem of AI micro-tools designed for the modern digital landscape. We believe that professional-grade AI should be fluid, intuitive, and accessible to everyone.
                      </p>
                      <p className="text-text-muted/80 font-medium leading-relaxed">
                        Since our inception, we've focused on one thing: performance. Every tool in our suite is optimized for speed and accuracy, ensuring you stay in your creative flow.
                      </p>
                      <div className="grid grid-cols-2 gap-12 pt-8">
                        <div className="space-y-2">
                          <p className="text-4xl font-black text-text-main">10M+</p>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Global Users</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-4xl font-black text-text-main">50+</p>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Premium Tools</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Ad Placeholder */}
                <div className="w-full h-24 bg-bg-card rounded-3xl flex items-center justify-center border border-border-main border-dashed">
                  <div className="text-center">
                    <p className="text-text-muted text-[10px] uppercase tracking-widest font-black mb-1">Advertisement</p>
                    <p className="text-text-muted/60 text-sm font-medium">Your Ad Here - Boost Your Traffic</p>
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
                    className="flex items-center gap-2 text-text-muted hover:text-indigo-500 transition-colors text-sm font-bold uppercase tracking-wider group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    All Tools
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                      {TOOLS.find(t => t.id === location.pathname.split("/")[1])?.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-text-main">
                    {TOOLS.find(t => t.id === location.pathname.split("/")[1])?.name}
                  </h1>
                  <p className="text-text-muted text-base md:text-lg font-medium max-w-2xl">
                    {TOOLS.find(t => t.id === location.pathname.split("/")[1])?.description}
                  </p>
                </div>

                <div className="min-h-[400px]">
                  {renderTool(location.pathname.split("/")[1])}
                </div>
              </motion.div>
            } />
          </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-20 md:py-32 mt-32 relative overflow-hidden border-t border-zinc-900/50">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
            <div className="col-span-1 md:col-span-5 space-y-10">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleNavigate("home")}>
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-7 w-7" />
                </div>
                <span className="text-3xl font-black font-display tracking-tighter text-text-main">PROTOOLIX</span>
              </div>
              <p className="text-text-muted max-w-sm text-lg leading-relaxed font-medium">
                The world's most advanced AI micro-tools ecosystem. Designed for creators who demand speed, precision, and ultra-smooth performance.
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
                    className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-500 hover:text-white hover:border-indigo-500/50 transition-all group backdrop-blur-xl"
                  >
                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-8">
                <h4 className="font-black text-xs text-white uppercase tracking-[0.3em]">Platform</h4>
                <ul className="space-y-5 text-sm font-bold">
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("all-tools")}>All Tools</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("article-gen")}>Article Generator</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("seo-meta")}>SEO Meta Gen</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("email-writer")}>Email Writer</li>
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="font-black text-xs text-white uppercase tracking-[0.3em]">Company</h4>
                <ul className="space-y-5 text-sm font-bold">
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("about")}>About Us</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("blog")}>Our Blog</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("contact")}>Contact</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("support")}>Support</li>
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="font-black text-xs text-white uppercase tracking-[0.3em]">Legal</h4>
                <ul className="space-y-5 text-sm font-bold">
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("privacy")}>Privacy Policy</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("terms")}>Terms of Service</li>
                  <li className="text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => handleNavigate("cookies")}>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-20 mt-20 border-t border-zinc-900/50 gap-10">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 PROTOOLIX AI. ALL RIGHTS RESERVED.</p>
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
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 md:right-24 z-40 w-12 h-12 bg-bg-card border border-border-main rounded-2xl flex items-center justify-center text-text-main shadow-2xl hover:border-indigo-500/50 hover:text-indigo-500 transition-all group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Support */}
      <ChatBot />
    </div>
  );
}

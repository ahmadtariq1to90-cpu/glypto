import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Mail,
  Heart,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-text-main transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-xl border-b border-border-main">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black font-display tracking-tight premium-gradient-text">ProToolix</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Home</Link>
            <Link to="/all-tools" className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Tools</Link>
            <Link to="/blog" className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">Blog</Link>
            <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-indigo-500 transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-bg-card border border-border-main text-text-main hover:border-indigo-500/50 transition-all"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button 
              size="sm" 
              className="hidden md:flex rounded-full px-6 h-10 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => navigate("/all-tools")}
            >
              Get Started
            </Button>
            <button 
              className="md:hidden p-2 text-text-main"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-bg-card border-b border-border-main overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">Home</Link>
                <Link to="/ai-tools" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">AI Tools</Link>
                <Link to="/pdf-tools" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">PDF Tools</Link>
                <Link to="/image-tools" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">Image Tools</Link>
                <Link to="/all-tools" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">All Tools</Link>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">Blog</Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-text-main">About</Link>
                <Button className="w-full bg-indigo-600 text-white" onClick={() => { setIsMenuOpen(false); navigate("/all-tools"); }}>Get Started</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-card border-t border-border-main pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black font-display tracking-tight premium-gradient-text">ProToolix</span>
              </Link>
              <p className="text-text-muted max-w-md leading-relaxed font-medium">
                The world's most advanced AI-powered tools platform. We help you create, optimize, and scale your content with the power of artificial intelligence.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <a href="https://wa.me/yournumber" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-bg-main border border-border-main flex items-center justify-center text-text-muted hover:text-emerald-500 transition-colors shadow-sm">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a href="mailto:support@protoolix.com" className="w-10 h-10 rounded-xl bg-bg-main border border-border-main flex items-center justify-center text-text-muted hover:text-indigo-500 transition-colors shadow-sm">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span>support@protoolix.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-main mb-6">Categories</h4>
              <ul className="space-y-4">
                <li><Link to="/ai-tools" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">AI Tools</Link></li>
                <li><Link to="/pdf-tools" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">PDF Tools</Link></li>
                <li><Link to="/image-tools" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Image Tools</Link></li>
                <li><Link to="/all-tools?category=Content" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Content Tools</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-main mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/all-tools" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">All Tools</Link></li>
                <li><Link to="/blog" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Blog</Link></li>
                <li><Link to="/about" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-main mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-sm text-text-muted hover:text-indigo-500 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-text-muted font-medium">
              © 2026 ProToolix. All rights reserved.
            </p>
            <p className="text-xs text-text-muted font-medium flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for creators everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

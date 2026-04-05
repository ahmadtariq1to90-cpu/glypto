import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  LayoutGrid, 
  Search, 
  ChevronRight, 
  Zap, 
  Shield, 
  ArrowRight,
  MessageSquare,
  FileText,
  ImageIcon,
  Code,
  Mail,
  Lock
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO";
import { cn } from "../lib/utils";

const TOOLS = [
  { id: "caption-gen", name: "AI Caption Generator", description: "Generate engaging captions for Instagram, TikTok, and LinkedIn.", icon: MessageSquare, category: "Social", color: "bg-indigo-500" },
  { id: "article-rewrite", name: "AI Article Rewriter", description: "Rewrite articles to be unique and plagiarism-free.", icon: FileText, category: "Content", color: "bg-amber-500" },
  { id: "article-gen", name: "AI Article Generator", description: "Create high-quality, SEO-optimized articles in seconds.", icon: FileText, category: "Content", color: "bg-indigo-500" },
  { id: "seo-meta", name: "SEO Meta Generator", description: "Create compelling meta titles and descriptions.", icon: Search, category: "Marketing", color: "bg-emerald-500" },
  { id: "email-writer", name: "AI Email Writer", description: "Draft professional emails for any purpose.", icon: Mail, category: "Productivity", color: "bg-blue-500" },
  { id: "code-explainer", name: "AI Code Explainer", description: "Understand complex code snippets instantly.", icon: Code, category: "Development", color: "bg-amber-500" },
  { id: "yt-script", name: "YouTube Script Writer", description: "Create engaging scripts for your videos.", icon: MessageSquare, category: "Social", color: "bg-rose-500" },
  { id: "product-desc", name: "Product Description", description: "Write persuasive product descriptions that sell.", icon: LayoutGrid, category: "Marketing", color: "bg-pink-500" },
  { id: "grammar-fix", name: "Grammar & Tone Fixer", description: "Polish your writing to perfection.", icon: Sparkles, category: "Content", color: "bg-cyan-500" },
  { id: "summarizer", name: "AI Text Summarizer", description: "Condense long articles into concise summaries.", icon: FileText, category: "Productivity", color: "bg-orange-500" },
  { id: "linkedin-post", name: "LinkedIn Post Creator", description: "Craft professional LinkedIn posts.", icon: Sparkles, category: "Social", color: "bg-sky-600" },
  { id: "bio-gen", name: "AI Bio Generator", description: "Generate creative bios for social media.", icon: Sparkles, category: "Social", color: "bg-fuchsia-500" },
  { id: "pass-gen", name: "Password Generator", description: "Generate ultra-secure, random passwords.", icon: Lock, category: "Utility", color: "bg-orange-500" },
  { id: "logo", name: "Logo Idea Maker", description: "Get creative inspiration for your brand.", icon: LayoutGrid, category: "Design", color: "bg-zinc-900" },
  { id: "pdf", name: "PDF Merger", description: "Combine multiple PDF documents into one.", icon: FileText, category: "Utility", color: "bg-red-500" },
  { id: "bg-remover", name: "AI Background Remover", description: "Remove backgrounds from images instantly.", icon: ImageIcon, category: "Design", color: "bg-purple-500" }
];

export const AllTools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["Social", "Productivity", "Content", "Marketing", "Design", "Development", "Utility"];

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-24">
      <SEO 
        title="All AI Tools - ProToolix Free Online Toolkit" 
        description="Browse our complete collection of free AI-powered tools. From content writing to image processing, find everything you need at ProToolix." 
      />

      {/* Header */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
        >
          <LayoutGrid className="h-3 w-3" />
          Explore our Ecosystem
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-text-main leading-[0.95]">
          All AI <span className="premium-gradient-text italic">Tools</span>
        </h1>
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

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 pt-4">
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
      </section>

      {/* Tool Grid */}
      {filteredTools.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -12 }}
            >
              <Link 
                to={`/${tool.id}`}
                className="glass-card p-10 rounded-[3rem] group flex flex-col h-full"
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
              </Link>
            </motion.div>
          ))}
        </section>
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

import React, { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { 
  Sparkles, 
  LayoutGrid, 
  ChevronRight, 
  Zap, 
  Shield, 
  MessageSquare,
  FileText,
  ImageIcon,
  Code,
  Mail,
  Lock,
  Search
} from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";
import { cn } from "../lib/utils";

const TOOLS = [
  { id: "caption-gen", name: "AI Caption Generator", description: "Generate engaging captions for Instagram, TikTok, and LinkedIn.", icon: MessageSquare, category: "ai-tools", color: "bg-indigo-500" },
  { id: "article-rewrite", name: "AI Article Rewriter", description: "Rewrite articles to be unique and plagiarism-free.", icon: FileText, category: "ai-tools", color: "bg-amber-500" },
  { id: "article-gen", name: "AI Article Generator", description: "Create high-quality, SEO-optimized articles in seconds.", icon: FileText, category: "ai-tools", color: "bg-indigo-500" },
  { id: "seo-meta", name: "SEO Meta Generator", description: "Create compelling meta titles and descriptions.", icon: Search, category: "ai-tools", color: "bg-emerald-500" },
  { id: "email-writer", name: "AI Email Writer", description: "Draft professional emails for any purpose.", icon: Mail, category: "ai-tools", color: "bg-blue-500" },
  { id: "code-explainer", name: "AI Code Explainer", description: "Understand complex code snippets instantly.", icon: Code, category: "ai-tools", color: "bg-amber-500" },
  { id: "yt-script", name: "YouTube Script Writer", description: "Create engaging scripts for your videos.", icon: MessageSquare, category: "ai-tools", color: "bg-rose-500" },
  { id: "product-desc", name: "Product Description", description: "Write persuasive product descriptions that sell.", icon: LayoutGrid, category: "ai-tools", color: "bg-pink-500" },
  { id: "grammar-fix", name: "Grammar & Tone Fixer", description: "Polish your writing to perfection.", icon: Sparkles, category: "ai-tools", color: "bg-cyan-500" },
  { id: "summarizer", name: "AI Text Summarizer", description: "Condense long articles into concise summaries.", icon: FileText, category: "ai-tools", color: "bg-orange-500" },
  { id: "linkedin-post", name: "LinkedIn Post Creator", description: "Craft professional LinkedIn posts.", icon: Sparkles, category: "ai-tools", color: "bg-sky-600" },
  { id: "bio-gen", name: "AI Bio Generator", description: "Generate creative bios for social media.", icon: Sparkles, category: "ai-tools", color: "bg-fuchsia-500" },
  { id: "pass-gen", name: "Password Generator", description: "Generate ultra-secure, random passwords.", icon: Lock, category: "ai-tools", color: "bg-orange-500" },
  { id: "logo", name: "Logo Idea Maker", description: "Get creative inspiration for your brand.", icon: LayoutGrid, category: "ai-tools", color: "bg-ai-tools" },
  { id: "pdf", name: "PDF Merger", description: "Combine multiple PDF documents into one.", icon: FileText, category: "pdf-tools", color: "bg-red-500" },
  { id: "bg-remover", name: "AI Background Remover", description: "Remove backgrounds from images instantly.", icon: ImageIcon, category: "image-tools", color: "bg-purple-500" }
];

const CATEGORIES = {
  "pdf-tools": {
    title: "Free Online PDF Tools",
    description: "Manage your PDF documents with our powerful, free online PDF tools. Merge, split, and convert PDFs without sign-up.",
    icon: FileText,
    seoTitle: "Best Free Online PDF Tools - No Sign-up Required | ProToolix",
    seoDesc: "Access the best free online PDF tools at ProToolix. Merge PDFs, convert images to PDF, and manage your documents efficiently without any registration."
  },
  "image-tools": {
    title: "Free Online Image Tools",
    description: "Optimize and edit your images with our AI-powered image tools. Remove backgrounds and enhance photos for free.",
    icon: ImageIcon,
    seoTitle: "Free Online Image Tools - AI Background Remover & More | ProToolix",
    seoDesc: "Use our free online image tools to remove backgrounds, compress images, and enhance your photos instantly with AI technology."
  },
  "ai-tools": {
    title: "Advanced AI Tools Online",
    description: "Supercharge your productivity with our suite of advanced AI tools. Generate articles, captions, and code explanations instantly.",
    icon: Sparkles,
    seoTitle: "Top AI Tools Online - Free AI Content & Code Generators | ProToolix",
    seoDesc: "Explore the best AI tools online for free. Generate SEO articles, social media captions, and professional emails with ProToolix AI."
  }
};

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => tool.category === categoryId);
  }, [categoryId]);

  if (!category) {
    return <Navigate to="/all-tools" replace />;
  }

  const Icon = category.icon;

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-24">
      <SEO 
        title={category.seoTitle}
        description={category.seoDesc}
      />

      {/* Header */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
        >
          <Icon className="h-3 w-3" />
          {category.title}
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-text-main leading-[1.1] py-2">
          {category.title.split(' ').slice(0, -1).join(' ')} <span className="premium-gradient-text italic">{category.title.split(' ').pop()}</span>
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          {category.description}
        </p>
      </section>

      {/* Tool Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
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
                  Use Tool
                  <ChevronRight className="h-3 w-3 ml-2" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* SEO Content Section */}
      <section className="glass-card p-12 md:p-20 rounded-[4rem] space-y-12">
        <div className="prose prose-indigo dark:prose-invert max-w-none prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tight prose-p:text-text-muted prose-p:text-lg prose-p:leading-relaxed prose-li:text-text-muted prose-li:text-lg">
          <h2>Why Use ProToolix {category.title}?</h2>
          <p>In today's fast-paced digital world, having access to reliable <strong>{category.title.toLowerCase()}</strong> is essential. Whether you're a student working on an assignment, a professional managing business documents, or a creator looking to optimize your content, ProToolix provides the perfect solution.</p>
          
          <h3>100% Free and No Sign-up Required</h3>
          <p>We believe that high-quality tools should be accessible to everyone. That's why all our <strong>online tools</strong> are completely free to use. Unlike other platforms, we don't require you to create an account or provide your email address. Just visit the site, choose your tool, and get your work done instantly.</p>
          
          <h3>Privacy and Security First</h3>
          <p>Your privacy is our top priority. When you use our <strong>PDF tools</strong> or <strong>image tools</strong>, your files are processed securely. We do not store any of your data on our servers, ensuring that your sensitive information remains private.</p>
          
          <h3>AI-Powered Efficiency</h3>
          <p>Our <strong>AI tools</strong> leverage the latest technology to provide superior results. From generating SEO-friendly articles to removing backgrounds from images with precision, our AI-powered toolkit is designed to save you time and effort.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 pt-8 border-t border-border-main">
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-black">Lightning Fast</h4>
            <p className="text-text-muted font-medium">Get results in seconds with our optimized processing engine.</p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Shield className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-black">Secure & Private</h4>
            <p className="text-text-muted font-medium">Your data is never stored and remains 100% private.</p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-black">AI Enhanced</h4>
            <p className="text-text-muted font-medium">Superior results powered by cutting-edge AI models.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

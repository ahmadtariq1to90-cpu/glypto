import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Zap, 
  Search, 
  ArrowRight, 
  Star, 
  Shield, 
  Cpu, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Layout as LayoutIcon 
} from "lucide-react";
import { SEO } from "../components/SEO";

const CATEGORIES = [
  { id: "ai", name: "AI Tools", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "text", name: "Text Tools", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "image", name: "Image Tools", icon: ImageIcon, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "pdf", name: "PDF Tools", icon: LayoutIcon, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "dev", name: "Developer Tools", icon: Code, color: "text-orange-500", bg: "bg-orange-500/10" },
];

const POPULAR_TOOLS = [
  { id: "caption-gen", name: "AI Caption Generator", desc: "Generate viral captions for Instagram, TikTok, and more.", category: "ai" },
  { id: "article-rewriter", name: "AI Article Rewriter", desc: "Rewrite articles and essays with high-quality AI.", category: "ai" },
  { id: "word-counter", name: "Word Counter", desc: "Count words, characters, and reading time instantly.", category: "text" },
  { id: "image-compressor", name: "Image Compressor", desc: "Reduce image size without losing quality.", category: "image" },
];

export function Home() {
  return (
    <div className="space-y-20 pb-20">
      <SEO 
        title="ProToolix - Free AI-Powered Online Tools for Everyone"
        description="Access 50+ free online tools for AI content generation, text processing, image optimization, PDF management, and development. Fast, secure, and easy to use."
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-medium mb-6 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
              Over 50+ Free Tools Available
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8">
              Unlock the Power of <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI-Driven Productivity
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              ProToolix provides professional-grade tools for content creators, developers, and students. 
              Generate, convert, and optimize your workflow in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/all-tools"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                Explore All Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/blog"
                className="w-full sm:w-auto px-8 py-4 bg-bg-card text-text-main border border-border-main rounded-2xl font-semibold hover:opacity-80 transition-all"
              >
                Read Our Blog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for a tool (e.g., 'Caption Generator', 'PDF to Word')..."
            className="w-full pl-16 pr-6 py-6 bg-bg-card border border-border-main rounded-3xl text-lg shadow-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-text-main"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-main mb-4">Browse by Category</h2>
          <p className="text-text-muted">Find exactly what you need with our organized categories.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/all-tools?category=${cat.id}`}
              className="group p-6 bg-bg-card border border-border-main rounded-3xl hover:border-indigo-500 transition-all text-center"
            >
              <div className={`w-14 h-14 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-text-main">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-2">Popular Tools</h2>
            <p className="text-text-muted">The most used tools by our community.</p>
          </div>
          <Link to="/all-tools" className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              to={`/${tool.id}`}
              className="group p-6 bg-bg-card border border-border-main rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{tool.name}</h3>
              <p className="text-text-muted text-sm mb-4">{tool.desc}</p>
              <span className="text-xs font-medium px-2 py-1 bg-bg-main text-text-muted rounded-lg uppercase tracking-wider">
                {tool.category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-bg-card rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 border border-border-main">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-4">Professional Quality</h3>
              <p className="text-text-muted">
                We use the latest AI models and algorithms to ensure the highest quality output for every tool.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-bg-card rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 border border-border-main">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-4">Privacy First</h3>
              <p className="text-text-muted">
                Your data is processed securely and never stored. We respect your privacy and data ownership.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-bg-card rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 border border-border-main">
                <Zap className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-4">Lightning Fast</h3>
              <p className="text-text-muted">
                Optimized for speed, our tools provide instant results so you can stay productive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to boost your productivity?
            </h2>
            <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of users who trust ProToolix for their daily tasks. 
              No registration required, 100% free forever.
            </p>
            <Link
              to="/all-tools"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl"
            >
              Start Using Tools
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

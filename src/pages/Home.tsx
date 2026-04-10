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
  { id: "ai-tools", name: "AI Tools", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10", path: "/ai-tools" },
  { id: "pdf-tools", name: "PDF Tools", icon: LayoutIcon, color: "text-red-500", bg: "bg-red-500/10", path: "/pdf-tools" },
  { id: "image-tools", name: "Image Tools", icon: ImageIcon, color: "text-green-500", bg: "bg-green-500/10", path: "/image-tools" },
  { id: "text", name: "Text Tools", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", path: "/all-tools?category=Content" },
  { id: "dev", name: "Developer Tools", icon: Code, color: "text-orange-500", bg: "bg-orange-500/10", path: "/all-tools?category=Development" },
];

const POPULAR_TOOLS = [
  { id: "caption-gen", name: "AI Caption Generator", desc: "Generate viral captions for Instagram, TikTok, and more.", category: "AI Tools" },
  { id: "pdf", name: "PDF Merger", desc: "Combine multiple PDF documents into one easily.", category: "PDF Tools" },
  { id: "bg-remover", name: "AI Background Remover", desc: "Remove backgrounds from images instantly with AI.", category: "Image Tools" },
  { id: "article-gen", name: "AI Article Generator", desc: "Create high-quality, SEO-optimized articles in seconds.", category: "AI Tools" },
];

export function Home() {
  return (
    <div className="space-y-20 pb-20">
      <SEO 
        title="ProToolix - Best Free Online Tools: AI, PDF, Image & More"
        description="Discover the best free online tools at ProToolix. Access AI content generators, PDF tools, image optimizers, and developer utilities without sign-up. 100% free and secure."
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
              100% Free Online Tools - No Sign-up Required
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-text-main mb-8 leading-[1.1]">
              The Ultimate Hub for <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                Free Online Tools
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              ProToolix offers a comprehensive suite of <strong>AI tools</strong>, <strong>PDF tools</strong>, and <strong>image tools</strong> designed to simplify your digital life. No registration, no hidden fees—just pure productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/all-tools"
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25"
              >
                Try Tools Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/ai-tools"
                className="w-full sm:w-auto px-10 py-5 bg-bg-card text-text-main border-2 border-border-main rounded-2xl font-black uppercase tracking-widest text-sm hover:border-indigo-500 transition-all"
              >
                Explore AI Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-text-main mb-4 tracking-tight">Browse Tool <span className="text-indigo-600">Categories</span></h2>
          <p className="text-text-muted text-lg font-medium">Find the perfect tool for your specific needs.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.path}
              className="group p-8 bg-bg-card border-2 border-border-main rounded-[2.5rem] hover:border-indigo-500 transition-all text-center shadow-lg hover:shadow-indigo-500/10"
            >
              <div className={`w-16 h-16 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-text-main mb-2">{cat.name}</h3>
              <div className="text-indigo-500 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                View Tools
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-text-main mb-2 tracking-tight">Popular <span className="text-indigo-600">Free Tools</span></h2>
            <p className="text-text-muted text-lg font-medium">The most trusted tools by millions of users worldwide.</p>
          </div>
          <Link to="/all-tools" className="px-8 py-3 bg-indigo-500/10 text-indigo-600 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all">
            View All Tools
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {POPULAR_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              to={`/${tool.id}`}
              className="group p-10 bg-bg-card border-2 border-border-main rounded-[3rem] hover:border-indigo-500 transition-all shadow-xl hover:shadow-indigo-500/20 flex flex-col"
            >
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-text-main mb-3 leading-tight">{tool.name}</h3>
              <p className="text-text-muted text-sm mb-6 font-medium leading-relaxed flex-grow">{tool.desc}</p>
              <div className="flex items-center justify-between pt-6 border-t border-border-main">
                <span className="text-[10px] font-black px-3 py-1 bg-bg-main text-indigo-500 rounded-full uppercase tracking-widest border border-indigo-500/20">
                  {tool.category}
                </span>
                <div className="text-indigo-500 group-hover:translate-x-2 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Massive SEO Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border-main">
        <div className="glass-card p-12 md:p-24 rounded-[4rem] space-y-16">
          <div className="prose prose-indigo dark:prose-invert max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:tracking-tight prose-h3:text-2xl prose-h3:font-black prose-p:text-text-muted prose-p:text-lg prose-p:leading-relaxed prose-strong:text-text-main">
            <h2 className="text-center mb-12">The Ultimate Guide to <span className="text-indigo-600">Free Online Tools</span> at ProToolix</h2>
            
            <p>Welcome to ProToolix, your premier destination for high-quality, <strong>free online tools</strong>. In an era where digital efficiency is paramount, we provide a comprehensive suite of applications designed to help you manage your documents, optimize your content, and leverage the power of artificial intelligence—all without spending a dime or dealing with tedious sign-up processes.</p>

            <h3>Why Choose ProToolix for Your Digital Needs?</h3>
            <p>At ProToolix, we understand that productivity shouldn't come with a price tag. Our platform is built on the foundation of accessibility and user privacy. Whether you're looking for <strong>PDF tools</strong>, <strong>image tools</strong>, or advanced <strong>AI tools</strong>, we have everything you need in one convenient location. Our tools are optimized for speed, ensuring that you get professional results in seconds.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
              <div>
                <h3>Powerful PDF Tools for Every Task</h3>
                <p>Managing PDF documents can be a challenge without the right software. ProToolix offers a variety of <strong>PDF tools</strong> that make document management a breeze. You can merge multiple PDF files into a single document, split large PDFs into smaller parts, and even convert images to PDF format. Our <strong>online PDF tools</strong> are designed to maintain the highest quality while ensuring your data remains secure and private.</p>
                <ul>
                  <li><strong>PDF Merger:</strong> Combine reports, essays, and documents instantly.</li>
                  <li><strong>Image to PDF:</strong> Convert JPG, PNG, and WebP images to professional PDF files.</li>
                  <li><strong>PDF Optimizer:</strong> Reduce file sizes for easier sharing via email.</li>
                </ul>
              </div>
              <div>
                <h3>Advanced AI Tools to Boost Creativity</h3>
                <p>Artificial Intelligence is transforming the way we create content. Our <strong>AI tools</strong> are at the forefront of this revolution, providing you with the power to generate high-quality text, code, and social media content. From our <strong>AI Article Generator</strong> to our <strong>AI Caption Generator</strong>, we help you overcome writer's block and produce engaging content that resonates with your audience.</p>
                <ul>
                  <li><strong>AI Content Writer:</strong> Generate SEO-optimized blog posts and articles.</li>
                  <li><strong>AI Code Explainer:</strong> Understand complex code snippets with ease.</li>
                  <li><strong>AI Summarizer:</strong> Condense long texts into key takeaways.</li>
                </ul>
              </div>
            </div>

            <h3>Optimizing Your Visuals with Image Tools</h3>
            <p>Visual content is more important than ever. Our <strong>image tools</strong> are designed to help you edit and optimize your photos for the web. Use our <strong>AI Background Remover</strong> to create professional product photos or use our image compressor to ensure your website loads lightning fast. All our image processing happens in real-time, providing you with instant downloads of your optimized files.</p>

            <h3>The ProToolix Advantage: No Sign-up, No Hassle</h3>
            <p>One of the biggest barriers to using online tools is the requirement to create an account. At ProToolix, we've removed that barrier. You can use any of our <strong>free online tools</strong> without providing an email address or creating a password. This not only saves you time but also protects your privacy. We don't track your usage or store your files, making us one of the most secure platforms for <strong>online document management</strong> and <strong>AI content generation</strong>.</p>

            <h3>Internal Linking and Navigation</h3>
            <p>We've made it easy to navigate our extensive collection of tools. You can browse by category, such as <Link to="/pdf-tools" className="text-indigo-600 font-bold">PDF Tools</Link>, <Link to="/image-tools" className="text-indigo-600 font-bold">Image Tools</Link>, and <Link to="/ai-tools" className="text-indigo-600 font-bold">AI Tools</Link>. Additionally, our <Link to="/blog" className="text-indigo-600 font-bold">Blog</Link> provides valuable insights and tutorials on how to get the most out of our platform. Learn <Link to="/blog/how-to-convert-image-to-pdf" className="text-indigo-600 font-bold">how to convert image to PDF</Link> or discover the <Link to="/blog/top-ai-tools-online-2026" className="text-indigo-600 font-bold">top AI tools of 2026</Link>.</p>

            <h3>Conclusion: Your Partner in Digital Productivity</h3>
            <p>ProToolix is more than just a collection of tools; it's your partner in digital success. We are constantly updating our platform with new features and tools to meet the evolving needs of our community. Whether you're a student, a freelancer, or a business professional, ProToolix is here to provide you with the <strong>best free online tools</strong> available today. Start exploring our toolkit now and experience the difference that AI-driven productivity can make.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to Transform Your <br /> <span className="italic">Workflow?</span>
            </h2>
            <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Join millions of users who trust ProToolix for their daily <strong>AI, PDF, and Image</strong> tasks. 100% free, forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/all-tools"
                className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-all shadow-2xl"
              >
                Use Tools Now
              </Link>
              <Link
                to="/blog"
                className="w-full sm:w-auto px-12 py-6 bg-indigo-500/20 text-white border-2 border-white/30 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
              >
                Read SEO Tips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

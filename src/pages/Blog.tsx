import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  ChevronRight, 
  Search,
  LayoutGrid,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
import { BLOG_POSTS } from "../data/blogData";
import { SEO } from "../components/SEO";
import { Button } from "../components/ui/Button";

export const Blog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-24">
      <SEO 
        title="ProToolix Blog - AI Tips, SEO Strategies, and Productivity Hacks" 
        description="Read the latest articles on AI-powered tools, SEO optimization, and productivity tips from the ProToolix team." 
      />

      {/* Blog Header */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
        >
          <LayoutGrid className="h-3 w-3" />
          ProToolix Insights
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-text-main leading-[0.95]">
          The ProToolix <span className="premium-gradient-text italic">Blog</span>
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          Stay ahead of the curve with our latest insights on AI, SEO, and productivity.
        </p>
      </section>

      {/* Featured Post */}
      {BLOG_POSTS.length > 0 && (
        <section className="relative group cursor-pointer" onClick={() => navigate(`/blog/${BLOG_POSTS[0].id}`)}>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative glass-card rounded-[3rem] overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden">
              <img 
                src={BLOG_POSTS[0].image} 
                alt={BLOG_POSTS[0].title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">{BLOG_POSTS[0].category}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {BLOG_POSTS[0].date}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-text-main group-hover:text-indigo-500 transition-colors">
                {BLOG_POSTS[0].title}
              </h2>
              <p className="text-text-muted font-medium leading-relaxed line-clamp-3">
                {BLOG_POSTS[0].excerpt}
              </p>
              <div className="pt-4">
                <Button className="rounded-full px-8 h-12 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest">
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.slice(1).map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="glass-card rounded-[2.5rem] overflow-hidden group flex flex-col">
            <div className="aspect-video overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 flex flex-col flex-grow space-y-4">
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-indigo-500">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="text-xl font-black font-display tracking-tight text-text-main group-hover:text-indigo-500 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-text-muted font-medium leading-relaxed line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="pt-4 flex items-center text-indigo-500 font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                Read More
                <ChevronRight className="h-3 w-3 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-indigo-600 text-white text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight relative z-10">Subscribe to our <span className="italic">Newsletter</span></h2>
        <p className="text-indigo-100 text-lg font-medium max-w-xl mx-auto relative z-10">Get the latest AI tips and productivity hacks delivered straight to your inbox every week.</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
          <input 
            type="email" 
            placeholder="Enter your email..." 
            className="flex-grow px-6 py-4 rounded-2xl bg-white/10 border border-white/20 outline-none focus:bg-white/20 transition-all placeholder:text-indigo-200 font-medium"
          />
          <Button className="rounded-2xl h-14 px-8 bg-white text-indigo-600 hover:bg-zinc-100 font-black uppercase tracking-widest text-xs">Subscribe</Button>
        </div>
      </section>
    </div>
  );
};

import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  ChevronRight, 
  Sparkles,
  LayoutGrid,
  ArrowRight,
  Share2,
  Twitter,
  Linkedin,
  Facebook
} from "lucide-react";
import { motion } from "motion/react";
import { BLOG_POSTS } from "../data/blogData";
import { SEO } from "../components/SEO";
import { Button } from "../components/ui/Button";

export const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-black">Post Not Found</h1>
        <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-4xl mx-auto space-y-16">
      <SEO 
        title={post.title} 
        description={post.excerpt} 
      />

      {/* Post Header */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/blog" className="p-2 rounded-xl bg-bg-card border border-border-main hover:text-indigo-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">{post.category}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-text-main leading-[1.1] py-2">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 pt-4 border-t border-border-main">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500">
            <User className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black uppercase tracking-widest text-text-main">{post.author}</p>
            <p className="text-xs text-text-muted font-medium">ProToolix Staff Writer</p>
          </div>
        </div>
      </section>

      {/* Post Image */}
      <section className="rounded-[3rem] overflow-hidden aspect-video relative group">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      </section>

      {/* Post Content */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-text-muted prose-p:font-medium prose-strong:text-text-main prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div className="pt-12 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Share this article:</span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-bg-card border border-border-main flex items-center justify-center text-text-muted hover:text-indigo-500 transition-colors"><Twitter className="h-4 w-4" /></button>
                <button className="w-10 h-10 rounded-xl bg-bg-card border border-border-main flex items-center justify-center text-text-muted hover:text-indigo-500 transition-colors"><Linkedin className="h-4 w-4" /></button>
                <button className="w-10 h-10 rounded-xl bg-bg-card border border-border-main flex items-center justify-center text-text-muted hover:text-indigo-500 transition-colors"><Facebook className="h-4 w-4" /></button>
              </div>
            </div>
            <Link to="/all-tools" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-500 hover:translate-x-2 transition-transform">
              Try ProToolix AI <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <aside className="space-y-12">
          <div className="glass-card p-8 rounded-[2.5rem] space-y-6 sticky top-24">
            <h3 className="text-xl font-black font-display tracking-tight">Recent Posts</h3>
            <div className="space-y-6">
              {BLOG_POSTS.filter(p => p.id !== postId).slice(0, 3).map((p) => (
                <Link key={p.id} to={`/blog/${p.id}`} className="block space-y-2 group">
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">{p.date}</p>
                  <h4 className="text-sm font-bold text-text-main group-hover:text-indigo-500 transition-colors line-clamp-2">{p.title}</h4>
                </Link>
              ))}
            </div>
            <div className="pt-6 border-t border-border-main">
              <Button className="w-full bg-indigo-600 text-white rounded-2xl h-12" onClick={() => navigate("/blog")}>View All Posts</Button>
            </div>
          </div>
        </aside>
      </section>

      {/* Related Articles Section */}
      <section className="space-y-12 pt-12 border-t border-border-main">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black font-display tracking-tight">More from the Blog</h2>
          <Link to="/blog" className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2 hover:translate-x-2 transition-transform">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.filter(p => p.id !== postId).slice(0, 2).map((p) => (
            <Link key={p.id} to={`/blog/${p.id}`} className="glass-card p-8 rounded-[2.5rem] group flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="w-full md:w-2/3 space-y-3 flex flex-col justify-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">{p.category}</p>
                <h3 className="text-lg font-black font-display tracking-tight group-hover:text-indigo-500 transition-colors line-clamp-2">{p.title}</h3>
                <p className="text-xs text-text-muted font-medium line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

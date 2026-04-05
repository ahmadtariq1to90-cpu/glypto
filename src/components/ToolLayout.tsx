import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageSquare, HelpCircle, CheckCircle2, Zap } from "lucide-react";
import { Button } from "./ui/Button";
import { SEO } from "./SEO";
import { ToolSEOContent } from "../data/toolsContent";
import Markdown from "react-markdown";
import { AdBanner } from "./AdBanner";
import { Link } from "react-router-dom";
import { Tool } from "../types";

interface ToolLayoutProps {
  tool: Tool;
  content: ToolSEOContent;
  children: React.ReactNode;
  relatedTools: Tool[];
  onBack: () => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  tool, 
  content, 
  children, 
  relatedTools,
  onBack 
}) => {
  const shareUrl = window.location.href;
  const shareText = `Check out this amazing AI tool: ${tool.name} on Protoolix!`;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
    }
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <SEO 
        title={content.metaTitle} 
        description={content.metaDescription} 
        canonical={`https://protoolix.com/${content.slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-indigo-500 transition-colors font-bold uppercase tracking-widest text-xs mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </button>

        {/* Tool Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-6xl font-black font-display tracking-tight text-text-main mb-4 md:mb-6 leading-tight break-words">
            {content.h1}
          </h1>
          <p className="text-lg md:text-xl text-text-muted font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            {content.introduction}
          </p>
        </div>

        {/* Tool Interface */}
        <div className="mb-12 md:mb-20 overflow-x-hidden">
          {children}
        </div>

        {/* SEO Content Section */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-20">
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* How to Use */}
            <section className="glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/40 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-text-main mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                  <Zap className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                How to Use {tool.name}
              </h2>
              <div className="space-y-4 md:space-y-6">
                {content.howToUse.map((step, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-indigo-500/20 text-xs md:text-base">
                      {i + 1}
                    </div>
                    <p className="text-text-muted font-medium text-base md:text-lg leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed Content */}
            <section className="prose prose-indigo dark:prose-invert max-w-none glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/40 shadow-xl overflow-x-hidden break-words">
              <Markdown>{content.detailedContent}</Markdown>
            </section>

            {/* FAQs */}
            <section className="glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/40 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-text-main mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                  <HelpCircle className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 md:space-y-6">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="p-4 md:p-6 bg-bg-card/50 rounded-2xl border border-border-main space-y-2">
                    <h3 className="font-black text-text-main text-base md:text-lg">{faq.question}</h3>
                    <p className="text-text-muted font-medium leading-relaxed text-sm md:text-base">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 md:space-y-8">
            {/* Benefits */}
            <section className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/40 shadow-xl bg-indigo-600 text-white">
              <h2 className="text-xl md:text-2xl font-black font-display tracking-tight mb-4 md:mb-6">Key Benefits</h2>
              <div className="space-y-3 md:space-y-4">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-indigo-200 shrink-0 mt-1" />
                    <p className="font-bold text-indigo-50 leading-relaxed text-sm md:text-base">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Share Buttons */}
            <section className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-xl">
              <h2 className="text-xl font-black font-display tracking-tight text-text-main mb-6 flex items-center gap-3">
                <Share2 className="h-5 w-5 text-indigo-500" />
                Share this Tool
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleShare("facebook")} className="rounded-xl border-border-main hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                  <Facebook className="h-4 w-4 mr-2" /> Facebook
                </Button>
                <Button variant="outline" onClick={() => handleShare("twitter")} className="rounded-xl border-border-main hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200">
                  <Twitter className="h-4 w-4 mr-2" /> Twitter
                </Button>
                <Button variant="outline" onClick={() => handleShare("linkedin")} className="rounded-xl border-border-main hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                  <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                </Button>
                <Button variant="outline" onClick={() => handleShare("whatsapp")} className="rounded-xl border-border-main hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                  <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                </Button>
              </div>
            </section>

            {/* Ad Banner */}
            <div className="py-4">
              <AdBanner />
            </div>

            {/* Related Tools */}
            <section className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-xl">
              <h2 className="text-xl font-black font-display tracking-tight text-text-main mb-6">Try More Tools</h2>
              <div className="space-y-4">
                {relatedTools.map((t) => (
                  <Link 
                    key={t.id} 
                    to={`/${t.slug}`}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-bg-card border border-transparent hover:border-border-main transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <t.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-text-main text-sm group-hover:text-indigo-500 transition-colors">{t.name}</h3>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{t.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

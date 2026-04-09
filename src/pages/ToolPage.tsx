import React, { Suspense, lazy } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Shield, 
  Sparkles,
  ChevronRight,
  LayoutGrid
} from "lucide-react";
import { motion } from "motion/react";
import { TOOL_SEO_CONTENT } from "../data/toolContent";
import { SEO } from "../components/SEO";
import { Button } from "../components/ui/Button";
import { TextTool } from "../components/TextTool";
import { SimpleTools } from "../components/SimpleTools";
import { PdfTools } from "../components/PdfTools";

// Define the tools list to match App.tsx
const TOOLS = [
  { id: "caption-gen", name: "AI Caption Generator", color: "bg-indigo-500" },
  { id: "article-rewrite", name: "AI Article Rewriter", color: "bg-amber-500" },
  { id: "article-gen", name: "AI Article Generator", color: "bg-indigo-500" },
  { id: "seo-meta", name: "SEO Meta Generator", color: "bg-emerald-500" },
  { id: "email-writer", name: "AI Email Writer", color: "bg-blue-500" },
  { id: "code-explainer", name: "AI Code Explainer", color: "bg-amber-500" },
  { id: "yt-script", name: "YouTube Script Writer", color: "bg-rose-500" },
  { id: "product-desc", name: "Product Description", color: "bg-pink-500" },
  { id: "grammar-fix", name: "Grammar & Tone Fixer", color: "bg-cyan-500" },
  { id: "summarizer", name: "AI Text Summarizer", color: "bg-orange-500" },
  { id: "linkedin-post", name: "LinkedIn Post Creator", color: "bg-sky-600" },
  { id: "bio-gen", name: "AI Bio Generator", color: "bg-fuchsia-500" },
  { id: "pass-gen", name: "Password Generator", color: "bg-orange-500" },
  { id: "logo", name: "Logo Idea Maker", color: "bg-zinc-900" },
  { id: "pdf", name: "PDF Merger", color: "bg-red-500" },
  { id: "bg-remover", name: "AI Background Remover", color: "bg-purple-500" }
];

export const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const tool = TOOLS.find(t => t.id === toolId);
  const seoContent = TOOL_SEO_CONTENT[toolId || ""] || {
    title: tool?.name || "AI Tool",
    description: `Use our free ${tool?.name} to optimize your workflow with AI.`,
    longContent: `<p>Welcome to the ${tool?.name} page. Use this tool to enhance your productivity.</p>`,
    features: ["Fast and secure", "AI-powered", "Free to use"],
    benefits: ["Save time", "Improve quality"],
    faqs: []
  };

  if (!tool) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-black">Tool Not Found</h1>
        <Button onClick={() => navigate("/all-tools")}>View All Tools</Button>
      </div>
    );
  }

  const renderToolComponent = () => {
    if (["bg-remover", "pass-gen", "logo"].includes(toolId!)) {
      return <SimpleTools type={toolId as any} onLimitReached={() => {}} />;
    }
    if (toolId === "pdf") {
      return <PdfTools onLimitReached={() => {}} />;
    }

    // Default to TextTool for most AI tools
    return (
      <TextTool 
        id={tool.id}
        name={tool.name}
        description={seoContent.description}
        icon={Sparkles as any}
        color={tool.color}
        onLimitReached={() => {}}
        placeholder="Enter your text here..."
        systemInstruction={`You are an AI assistant helping with ${tool.name}.`}
        promptPrefix={`Please help me with ${tool.name}: `}
      />
    );
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoContent.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const relatedTools = TOOLS
    .filter(t => t.id !== toolId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-16">
      <SEO 
        title={seoContent.title} 
        description={seoContent.description} 
        schema={faqSchema}
      />

      {/* Tool Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/all-tools" className="p-2 rounded-xl bg-bg-card border border-border-main hover:text-indigo-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center text-white shadow-lg`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight">{tool.name}</h1>
          </div>
        </div>

        <Suspense fallback={<div className="flex items-center justify-center h-[500px]"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
          {renderToolComponent()}
        </Suspense>
      </section>

      {/* SEO Content Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-12 border-t border-border-main">
        <div className="lg:col-span-2 space-y-12">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-text-muted prose-p:font-medium prose-strong:text-text-main" dangerouslySetInnerHTML={{ __html: seoContent.longContent }} />
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black font-display tracking-tight">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seoContent.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-bg-card border border-border-main">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-text-muted">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black font-display tracking-tight">Benefits of Using ProToolix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seoContent.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                  <Zap className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-text-muted">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-12">
          <div className="glass-card p-8 rounded-[2.5rem] space-y-6 sticky top-24">
            <h3 className="text-xl font-black font-display tracking-tight">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {seoContent.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Question</span>
                  </div>
                  <p className="font-bold text-text-main">{faq.question}</p>
                  <p className="text-sm text-text-muted font-medium leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-border-main">
              <Button className="w-full bg-indigo-600 text-white rounded-2xl h-12" onClick={() => navigate("/contact")}>Still have questions?</Button>
            </div>
          </div>
        </aside>
      </section>

      {/* Related Tools Section */}
      <section className="space-y-12 pt-12 border-t border-border-main">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black font-display tracking-tight">Explore More Tools</h2>
          <Link to="/all-tools" className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2 hover:translate-x-2 transition-transform">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTools.map((t) => (
            <Link key={t.id} to={`/${t.id}`} className="glass-card p-8 rounded-[2.5rem] group">
              <div className={`w-12 h-12 rounded-xl ${t.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black font-display tracking-tight mb-2 group-hover:text-indigo-500 transition-colors">{t.name}</h3>
              <p className="text-sm text-text-muted font-medium line-clamp-2">Advanced AI-powered tool for your daily productivity needs.</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

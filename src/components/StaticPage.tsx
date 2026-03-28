import React from "react";
import { 
  Shield, 
  Zap, 
  Mail, 
  Info, 
  FileText, 
  HelpCircle, 
  ArrowLeft,
  CheckCircle2,
  Globe,
  Lock,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

interface StaticPageProps {
  type: "about" | "privacy" | "terms" | "contact" | "support";
  onBack: () => void;
}

export function StaticPage({ type, onBack }: StaticPageProps) {
  const content = {
    about: {
      title: "About Glypto",
      subtitle: "Empowering the next generation of creators.",
      icon: Info,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      body: (
        <div className="space-y-8">
          <p className="text-lg text-zinc-600 leading-relaxed font-medium">
            Glypto was founded with a simple mission: to make advanced AI technology accessible to everyone. We believe that tools shouldn't be complicated—they should be intuitive, fast, and powerful.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm">
              <Zap className="h-6 w-6 text-amber-500 mb-4" />
              <h4 className="font-bold text-zinc-900 mb-2">Lightning Fast</h4>
              <p className="text-sm text-zinc-500">Our tools are optimized for speed, delivering professional results in seconds.</p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm">
              <Shield className="h-6 w-6 text-emerald-500 mb-4" />
              <h4 className="font-bold text-zinc-900 mb-2">Privacy First</h4>
              <p className="text-sm text-zinc-500">We don't store your personal data or the content you generate. Your privacy is our priority.</p>
            </div>
          </div>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Your data is yours. We keep it that way.",
      icon: Lock,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      body: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">1. Data Collection</h4>
            <p className="text-zinc-600 leading-relaxed">We do not collect personal information unless you explicitly provide it. Our AI tools process data in real-time and do not store your inputs or outputs on our servers.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">2. Cookies</h4>
            <p className="text-zinc-600 leading-relaxed">We use essential cookies to ensure the website functions correctly and to remember your preferences (like theme settings).</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">3. Third-Party Services</h4>
            <p className="text-zinc-600 leading-relaxed">We use trusted third-party services for analytics and advertising to keep our tools free for everyone. These services may collect anonymous usage data.</p>
          </div>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Simple rules for a better experience.",
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-50",
      body: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">1. Usage Agreement</h4>
            <p className="text-zinc-600 leading-relaxed">By using Glypto, you agree to use our tools responsibly and not for any illegal or harmful activities.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">2. Intellectual Property</h4>
            <p className="text-zinc-600 leading-relaxed">The content you generate using our tools is yours. However, the Glypto brand, logo, and website code are protected by copyright.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">3. Disclaimer</h4>
            <p className="text-zinc-600 leading-relaxed">While we strive for accuracy, AI-generated content should be reviewed by a human. Glypto is not responsible for any errors or omissions in the output.</p>
          </div>
        </div>
      )
    },
    contact: {
      title: "Contact Us",
      subtitle: "We're here to help you succeed.",
      icon: Mail,
      color: "text-rose-600",
      bg: "bg-rose-50",
      body: (
        <div className="space-y-8">
          <div className="p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-rose-50/50 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">Email Support</h4>
                <p className="text-sm text-zinc-500">Response time: within 24 hours</p>
              </div>
            </div>
            <p className="text-lg font-bold text-zinc-700">support@glypto.com</p>
            <Button className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold" onClick={() => window.location.href = "mailto:support@glypto.com"}>
              Send Message
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 text-center">
              <Globe className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Support</p>
            </div>
            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 text-center">
              <MessageSquare className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">24/7 Monitoring</p>
            </div>
          </div>
        </div>
      )
    },
    support: {
      title: "Help & Support",
      subtitle: "Find answers and get assistance.",
      icon: HelpCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      body: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-zinc-900">Frequently Asked Questions</h4>
            <div className="space-y-3">
              {[
                { q: "Is Glypto free to use?", a: "Yes! All our basic tools are free. We use ads to keep the service running." },
                { q: "Do I need an account?", a: "No account is required. You can start using our tools immediately." },
                { q: "How accurate is the AI?", a: "Our AI uses state-of-the-art models, but we always recommend a quick human review." }
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm space-y-2">
                  <p className="font-bold text-zinc-900">{faq.q}</p>
                  <p className="text-sm text-zinc-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white text-center space-y-4">
            <h4 className="text-xl font-bold">Still need help?</h4>
            <p className="text-blue-100 text-sm">Our support team is ready to assist you with any questions or issues.</p>
            <Button variant="secondary" className="w-full h-12 rounded-xl font-bold" onClick={() => onBack()}>
              Contact Support
            </Button>
          </div>
        </div>
      )
    }
  };

  const page = content[type];
  const Icon = page.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-bold uppercase tracking-wider group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner", page.bg, page.color)}>
            <Icon className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black font-display tracking-tight text-zinc-900">{page.title}</h1>
            <p className="text-lg text-zinc-500 font-medium">{page.subtitle}</p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-zinc-100/50 border-white/40">
          {page.body}
        </div>
      </div>
    </motion.div>
  );
}

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

function ContactSection({ onBack }: { onBack: () => void }) {
  const [formState, setFormState] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => {
      setFormState('sent');
    }, 1500);
  };

  if (formState === 'sent') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-zinc-900">Thanks for reaching out!</h3>
          <p className="text-zinc-500 font-medium">We've received your message and will get back to you within 24 hours.</p>
        </div>
        <Button 
          onClick={() => setFormState('idle')}
          className="rounded-xl px-8 h-12 bg-zinc-900 hover:bg-zinc-800 font-bold"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {/* FAQs Section */}
      <div className="space-y-6">
        <h4 className="text-xl font-black text-zinc-900 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          Common Questions
        </h4>
        <div className="grid gap-4">
          {[
            { q: "How can I report a bug?", a: "You can use the form below or the feedback button on each tool page." },
            { q: "Is my data safe?", a: "Absolutely. We don't store any of your inputs or generated content." },
            { q: "Can I request a new tool?", a: "Yes! We love hearing suggestions. Use the form below to let us know." }
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
              <p className="font-bold text-zinc-900 text-sm">{faq.q}</p>
              <p className="text-sm text-zinc-500 font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="space-y-6 pt-6 border-t border-zinc-100">
        {!showForm ? (
          <div className="text-center py-8 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-black text-zinc-900">Need more help?</h4>
              <p className="text-sm text-zinc-500 font-medium">Our support team is ready to assist you with any specific inquiries.</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="rounded-2xl px-10 h-14 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100"
            >
              Contact Support
            </Button>
          </div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Your Name"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                <input 
                  required
                  type="email" 
                  placeholder="your@email.com"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Message</label>
              <textarea 
                required
                rows={4}
                placeholder="How can we help you?"
                className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium resize-none"
              />
            </div>
            <Button 
              type="submit"
              disabled={formState === 'sending'}
              className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold shadow-lg shadow-rose-100 transition-all hover:scale-[1.02]"
            >
              {formState === 'sending' ? 'Sending...' : 'Send Message'}
            </Button>
          </motion.form>
        )}
      </div>
    </div>
  );
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
      body: <ContactSection onBack={onBack} />
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

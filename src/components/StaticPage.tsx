import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Shield, FileText, Info, Mail, HelpCircle, Cookie, Send, CheckCircle2, Bug, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "./SEO";
import { Button } from "./ui/Button";

interface StaticPageProps {
  type: "about" | "privacy" | "terms" | "contact" | "support" | "cookies" | "contact-form";
  onBack?: () => void;
}

const CONTENT = {
  about: {
    title: "About ProToolix",
    icon: Info,
    description: "Learn more about our mission and the team behind ProToolix.",
    content: `
      <p>ProToolix is a comprehensive platform dedicated to providing high-quality, free online tools for everyone. Our mission is to simplify complex tasks and boost productivity through intuitive, AI-powered solutions.</p>
      <h2>Our Story</h2>
      <p>Founded in 2024, ProToolix started with a simple idea: professional-grade tools shouldn't be locked behind expensive subscriptions. We've built a suite of over 50 tools ranging from AI content generators to advanced PDF editors, all accessible for free.</p>
      <h2>Why Choose Us?</h2>
      <ul>
        <li><strong>AI-Powered:</strong> We leverage the latest AI models to provide superior results.</li>
        <li><strong>Privacy First:</strong> Your data is processed securely and never stored on our servers.</li>
        <li><strong>100% Free:</strong> No hidden costs, no subscriptions, just free tools.</li>
        <li><strong>Fast & Reliable:</strong> Optimized for speed and performance.</li>
      </ul>
    `
  },
  privacy: {
    title: "Privacy Policy",
    icon: Shield,
    description: "How we protect your data and respect your privacy.",
    content: `
      <p>At ProToolix, we take your privacy seriously. This policy outlines how we handle your data when you use our services.</p>
      <h2>Data Collection</h2>
      <p>We do not collect or store any personal data you process through our tools. All processing happens in real-time, and your files are deleted immediately after the task is complete.</p>
      <h2>Cookies</h2>
      <p>We use essential cookies to improve your experience and remember your preferences (like dark mode). We also use third-party analytics to understand how our site is used.</p>
      <h2>Third-Party Services</h2>
      <p>We may use third-party services like Google Analytics and AdSense. These services have their own privacy policies.</p>
    `
  },
  terms: {
    title: "Terms of Service",
    icon: FileText,
    description: "The rules and guidelines for using ProToolix.",
    content: `
      <p>By using ProToolix, you agree to comply with these terms of service.</p>
      <h2>Usage Guidelines</h2>
      <p>Our tools are provided for personal and professional use. You agree not to use our services for any illegal or harmful activities.</p>
      <h2>Disclaimer</h2>
      <p>ProToolix is provided "as is" without any warranties. We are not responsible for any data loss or damages resulting from the use of our tools.</p>
      <h2>Changes to Terms</h2>
      <p>We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of the new terms.</p>
    `
  },
  cookies: {
    title: "Cookie Policy",
    icon: Cookie,
    description: "How we use cookies to enhance your experience.",
    content: `
      <p>This Cookie Policy explains how ProToolix uses cookies and similar technologies to recognize you when you visit our website.</p>
      <h2>What are cookies?</h2>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
      <h2>Why do we use cookies?</h2>
      <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
        <li><strong>Preference Cookies:</strong> Used to remember your settings like dark mode.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
      </ul>
      <h2>How can I control cookies?</h2>
      <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.</p>
    `
  },
  contact: {
    title: "Contact Us & Support - ProToolix Help Center",
    icon: Mail,
    description: "Get in touch with the ProToolix team for support, bug reports, or tool suggestions. We're here to help you optimize your workflow.",
    content: `
      <p>Welcome to the ProToolix Help Center. We are committed to providing the best free online tools and support for our community. If you have questions, feedback, or need assistance, you're in the right place.</p>
      <h2>Frequently Asked Questions (FAQ)</h2>
      <ul>
        <li><strong>Is ProToolix really free?</strong> Yes, all our AI-powered tools are 100% free to use with no hidden costs or subscriptions.</li>
        <li><strong>Do I need to create an account?</strong> No, you can use all our tools without any registration or sign-up. We value your time and privacy.</li>
        <li><strong>Is my data safe?</strong> Absolutely. We process all data securely and do not store your files or text on our servers.</li>
        <li><strong>How do I report a bug?</strong> Use the contact form below and select "Report a Bug" to let us know.</li>
        <li><strong>Can I suggest a new tool?</strong> We love hearing from our users! Send us your ideas through the contact form.</li>
      </ul>
      <h2>Our Support Mission</h2>
      <p>Our goal is to democratize access to advanced AI technology. By providing free, high-quality tools without the barrier of sign-ups, we help creators, students, and professionals worldwide stay productive.</p>
    `
  },
  "contact-form": {
    title: "Contact Form - Get Support from ProToolix",
    icon: MessageSquare,
    description: "Send a message to the ProToolix team. We respond to all inquiries regarding our free online tools and services.",
    content: ""
  },
  support: {
    title: "Help & Support Center - ProToolix Free AI Tools",
    icon: HelpCircle,
    description: "Find help and support for all ProToolix tools. Learn how to use our AI generators, PDF tools, and image optimizers for free.",
    content: `
      <p>Need help with a specific tool? Our support center provides guides and answers to help you get the most out of ProToolix.</p>
      <h2>How to Use ProToolix Tools</h2>
      <p>All our tools are designed to be intuitive. Simply select a tool from our homepage, follow the on-screen instructions, and get your results instantly. No sign-up is ever required.</p>
      <h2>Troubleshooting Common Issues</h2>
      <ul>
        <li><strong>Tool not loading:</strong> Try refreshing your browser or clearing your cache.</li>
        <li><strong>Slow processing:</strong> Large files may take a few extra seconds. Ensure you have a stable internet connection.</li>
        <li><strong>Browser compatibility:</strong> ProToolix works best on modern browsers like Chrome, Firefox, and Safari.</li>
      </ul>
    `
  }
};

export function StaticPage({ type }: StaticPageProps) {
  const data = CONTENT[type];
  const Icon = data.icon;
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "bug">("contact");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO 
        title={`${data.title} - ProToolix`}
        description={data.description}
      />
      
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card border border-border-main rounded-[2.5rem] p-8 md:p-12 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main">{data.title}</h1>
            <p className="text-text-muted">{data.description}</p>
          </div>
        </div>

        {type === "contact" ? (
          <div className="space-y-12">
            <div 
              className="prose prose-indigo dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-p:text-text-muted prose-li:text-text-muted"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
            <div className="pt-8 border-t border-border-main text-center">
              <Button 
                onClick={() => navigate("/contact/form")}
                className="h-14 px-12 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-700 transition-all"
              >
                Contact Now
              </Button>
            </div>
          </div>
        ) : type === "contact-form" ? (
          <div className="space-y-8">
            <div className="flex p-1 bg-bg-main rounded-2xl border border-border-main">
              <button 
                onClick={() => setActiveTab("contact")}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all ${activeTab === "contact" ? "bg-indigo-600 text-white shadow-lg" : "text-text-muted hover:text-text-main"}`}
              >
                <MessageSquare className="w-4 h-4" />
                Contact Form
              </button>
              <button 
                onClick={() => setActiveTab("bug")}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all ${activeTab === "bug" ? "bg-red-600 text-white shadow-lg" : "text-text-muted hover:text-text-main"}`}
              >
                <Bug className="w-4 h-4" />
                Report a Bug
              </button>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-text-main">Submission Received!</h2>
                <p className="text-text-muted">Thank you for your {activeTab === "contact" ? "message" : "report"}. We'll get back to you soon.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-xl bg-bg-main border border-border-main focus:border-indigo-500 outline-none transition-all text-text-main"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full h-12 px-4 rounded-xl bg-bg-main border border-border-main focus:border-indigo-500 outline-none transition-all text-text-main"
                    />
                  </div>
                </div>
                {activeTab === "bug" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main">Tool Name (Where the bug occurred)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Word Counter"
                      className="w-full h-12 px-4 rounded-xl bg-bg-main border border-border-main focus:border-indigo-500 outline-none transition-all text-text-main"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder={activeTab === "contact" ? "How can we help?" : "Describe the bug briefly"}
                    className="w-full h-12 px-4 rounded-xl bg-bg-main border border-border-main focus:border-indigo-500 outline-none transition-all text-text-main"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">Message / Bug Details</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder={activeTab === "contact" ? "Tell us more about your inquiry..." : "Please provide steps to reproduce the bug..."}
                    className="w-full p-4 rounded-xl bg-bg-main border border-border-main focus:border-indigo-500 outline-none transition-all resize-none text-text-main"
                  />
                </div>
                <Button type="submit" className={`w-full h-14 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${activeTab === "bug" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                  <Send className="w-5 h-5" />
                  {activeTab === "contact" ? "Send Message" : "Submit Bug Report"}
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div 
            className="prose prose-indigo dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-p:text-text-muted prose-li:text-text-muted"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        )}
      </motion.div>
    </div>
  );
}

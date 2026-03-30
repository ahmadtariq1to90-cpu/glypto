import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";

interface Message {
  role: "user" | "bot";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm the ProToolix assistant. How can I help you explore our AI tools today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const systemInstruction = `You are the official AI assistant for ProToolix (formerly Glypto). 
          Your goal is to help users understand and use the website's AI tools.
          
          RULES:
          1. Answer ONLY questions related to ProToolix, its tools, and how to use the website.
          2. If a user asks an unrelated or general question (e.g., "What is the capital of France?", "Tell me a joke", "How are you?"), politely decline and redirect them to ProToolix tools.
          3. Be professional, helpful, and concise.
          4. ProToolix tools include: AI Caption Generator, AI Resume Builder, Article Rewriter, Image to Cartoon, PDF Tools, Instagram Bio Generator, Background Remover, QR Code Generator, Password Generator, Unit Converter, Tweet Generator, AI Email Writer, and Simple Logo Maker.
          5. If asked about the rebranding, explain that Glypto is now ProToolix, offering a more premium and optimized experience.
          
          Example of declining: "I'm sorry, but I can only assist with questions related to ProToolix and our AI tools. How can I help you with our productivity suite today?"`;

      const response = await generateText(userMessage, systemInstruction);

      setMessages(prev => [...prev, { role: "bot", content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error: any) {
      console.error("ChatBot Error:", error);
      const errorMessage = error.message || String(error);
      setMessages(prev => [...prev, { role: "bot", content: `Error: ${errorMessage}. Please try again later.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[280px] sm:w-[320px] md:w-[380px] h-[400px] md:h-[450px] glass-card rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl border-indigo-500/20"
          >
            {/* Header */}
            <div className="p-3 md:p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </div>
                <div>
                  <p className="font-black text-[10px] md:text-xs tracking-tight">ProToolix AI</p>
                  <p className="text-[7px] md:text-[8px] font-bold opacity-80 uppercase tracking-widest">Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-3 md:p-4 space-y-3 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-bg-card text-text-main border border-border-main rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-card text-text-muted p-4 rounded-2xl rounded-tl-none border border-border-main">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-main bg-bg-card/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about our tools..."
                  className="w-full pl-4 pr-12 py-3 bg-bg-main border border-border-main rounded-xl focus:border-indigo-500 outline-none transition-all text-sm font-medium text-text-main"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:bg-indigo-700 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}

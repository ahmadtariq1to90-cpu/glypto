import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles,
  Zap,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { generateChatResponse } from "../../lib/gemini";
import { cn } from "../../lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hello! I'm OneAI. How can I help you today? I can help with writing, coding, brainstorming, or just chatting.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateChatResponse(input);
      const botMessage: Message = {
        role: "bot",
        content: response || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "bot",
        content: "An error occurred while generating a response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        content: "Chat cleared. How else can I help you?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto glass-card rounded-[2rem] overflow-hidden border border-white/5">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">OneAI Chat</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
          title="Clear Chat"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white shadow-sm",
              msg.role === "user" ? "bg-indigo-600" : "bg-zinc-800"
            )}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={cn(
              "max-w-[80%] space-y-2",
              msg.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "p-4 rounded-2xl relative group",
                msg.role === "user" 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-zinc-800/50 text-zinc-100 rounded-tl-none border border-white/5"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                
                {msg.role === "bot" && (
                  <button 
                    onClick={() => copyToClipboard(msg.content, idx)}
                    className="absolute -right-10 top-0 p-2 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copiedId === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white bg-zinc-800 shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-2xl rounded-tl-none border border-white/5">
              <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-zinc-900/30">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask OneAI anything..."
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none min-h-[60px] max-h-[200px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-3 bottom-3 p-2.5 rounded-xl transition-all shadow-lg",
              input.trim() && !isLoading 
                ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/20" 
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <Zap className="h-3 w-3 text-amber-500" />
              Gemini 3 Flash
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Pro Features
            </div>
          </div>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Shift + Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}

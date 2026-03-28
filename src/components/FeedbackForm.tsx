import React, { useState } from "react";
import { MessageSquare, Star, Send, X, Bug, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

interface FeedbackFormProps {
  toolName: string;
}

export function FeedbackForm({ toolName }: FeedbackFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"suggestion" | "bug" | "rating">("rating");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend
    console.log("Feedback submitted:", { toolName, type, rating, message });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setMessage("");
      setRating(0);
    }, 2000);
  };

  return (
    <div className="mt-12 border-t border-zinc-100 pt-12">
      {!isOpen ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900">How's your experience?</h3>
            <p className="text-sm text-zinc-500 font-medium">Help us improve {toolName} with your feedback.</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full px-6 h-10 text-xs font-bold border-zinc-200 hover:bg-white transition-all"
            onClick={() => setIsOpen(true)}
          >
            Give Feedback
          </Button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-[32px] max-w-2xl mx-auto relative overflow-hidden"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto">
                <Send className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900">Thank You!</h3>
                <p className="text-zinc-500 font-medium">Your feedback helps us make Glypto better for everyone.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-900">Feedback for {toolName}</h3>
                
                <div className="flex gap-2">
                  {[
                    { id: "rating", icon: Star, label: "Rate" },
                    { id: "suggestion", icon: Lightbulb, label: "Suggest" },
                    { id: "bug", icon: Bug, label: "Report Bug" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id as any)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border",
                        type === item.id 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {type === "rating" && (
                <div className="space-y-3 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Your Rating</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          className={cn(
                            "h-8 w-8 transition-colors",
                            star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  {type === "bug" ? "Describe the issue" : type === "suggestion" ? "Your suggestion" : "Additional comments"}
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more..."
                  className="w-full min-h-[120px] p-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>

              <Button type="submit" className="w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100">
                Submit Feedback
              </Button>
            </form>
          )}
        </motion.div>
      )}
    </div>
  );
}

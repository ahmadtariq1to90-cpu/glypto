import React, { useState } from 'react';
import { Send, Star, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';

interface FeedbackFormProps {
  toolName: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ toolName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Send className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold">Thank You!</h3>
        <p className="text-zinc-500">Your feedback helps us improve {toolName}.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-3xl space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-bold">Feedback for {toolName}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-2 rounded-lg transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-zinc-200 hover:text-zinc-300'}`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-500 outline-none min-h-[100px]"
            placeholder="How can we make this tool better?"
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold">
          Submit Feedback
        </Button>
      </form>
    </div>
  );
};

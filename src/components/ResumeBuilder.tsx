import React, { useState } from "react";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Download, Sparkles, FileUser } from "lucide-react";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function ResumeBuilder() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    skills: "",
    education: ""
  });
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFriendlyErrorMessage = (error: any) => {
    const message = error.message || String(error);
    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return "You've reached the limit for now. Please wait a moment before trying again.";
    }
    if (message.includes("500") || message.toLowerCase().includes("server error")) {
      return "Our AI is currently taking a short break. Please try again in a few seconds.";
    }
    if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("missing")) {
      return "It looks like some information is missing. Please check your input and try again.";
    }
    if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
      return "Connection lost. Please check your internet and try again.";
    }
    return "Something went wrong while generating. Please try again.";
  };

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.role.trim()) newErrors.role = "Target role is required";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setResume("");
    try {
      const prompt = `Create a professional resume for ${formData.name} who is a ${formData.role}. 
      Experience: ${formData.experience}
      Skills: ${formData.skills}
      Education: ${formData.education}
      Format it in clean Markdown with sections for Summary, Experience, Skills, and Education. Use professional headers and bullet points.`;
      
      const result = await generateText(prompt, "You are a professional resume writer and career coach.");
      setResume(result);
    } catch (err: any) {
      setErrors({ general: getFriendlyErrorMessage(err) });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 md:p-8 rounded-3xl shadow-xl shadow-indigo-50/30 space-y-6 border-white/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-xl shadow-inner">
              <FileUser className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold font-display tracking-tight text-zinc-900">Resume Details</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className={cn(
                "relative rounded-xl border transition-all duration-300 bg-zinc-50/30",
                errors.name ? "border-red-300 ring-4 ring-red-500/5" : "border-zinc-100 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30"
              )}>
                <input
                  className="w-full p-3.5 rounded-xl bg-transparent outline-none font-bold text-base placeholder:text-zinc-300"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (e.target.value.trim()) setErrors(prev => ({...prev, name: ""}));
                  }}
                />
              </div>
              {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1 ml-1">{errors.name}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Target Role</label>
              <div className={cn(
                "relative rounded-xl border transition-all duration-300 bg-zinc-50/30",
                errors.role ? "border-red-300 ring-4 ring-red-500/5" : "border-zinc-100 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30"
              )}>
                <input
                  className="w-full p-3.5 rounded-xl bg-transparent outline-none font-bold text-base placeholder:text-zinc-300"
                  placeholder="Senior Frontend Engineer"
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({...formData, role: e.target.value});
                    if (e.target.value.trim()) setErrors(prev => ({...prev, role: ""}));
                  }}
                />
              </div>
              {errors.role && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1 ml-1">{errors.role}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Experience Summary</label>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30 transition-all">
                <textarea
                  className="w-full p-3.5 rounded-xl bg-transparent outline-none min-h-[100px] text-sm font-medium leading-relaxed placeholder:text-zinc-300"
                  placeholder="Describe your key roles and achievements..."
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Skills</label>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30 transition-all">
                <textarea
                  className="w-full p-3.5 rounded-xl bg-transparent outline-none min-h-[80px] text-sm font-medium leading-relaxed placeholder:text-zinc-300"
                  placeholder="React, Node.js, TypeScript, AWS..."
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full py-8 text-lg font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 border-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Building...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Generate Resume</span>
              </div>
            )}
          </Button>
          {errors.general && (
            <p className="text-xs font-bold text-red-500 text-center uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{errors.general}</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="glass-card p-8 md:p-12 rounded-3xl min-h-[600px] bg-white shadow-xl border-white/40 relative overflow-hidden">
          {loading ? (
            <div className="space-y-10 animate-pulse">
              <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                <div className="space-y-3">
                  <div className="h-10 w-64 bg-zinc-100 rounded-xl" />
                  <div className="h-4 w-40 bg-zinc-50 rounded-lg" />
                </div>
                <div className="h-14 w-14 bg-zinc-100 rounded-2xl" />
              </div>
              
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-5 w-32 bg-zinc-100 rounded-lg" />
                    <div className="space-y-3">
                      <div className="h-3.5 w-full bg-zinc-50 rounded-full" />
                      <div className="h-3.5 w-[95%] bg-zinc-50 rounded-full" />
                      <div className="h-3.5 w-[85%] bg-zinc-50 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 flex gap-4">
                <div className="h-12 w-36 bg-zinc-100 rounded-2xl" />
                <div className="h-12 w-36 bg-zinc-100 rounded-2xl" />
              </div>
            </div>
          ) : resume ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-zinc prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:font-black prose-h1:text-3xl prose-h1:text-indigo-600 prose-h2:text-xl prose-h2:border-b prose-h2:border-zinc-100 prose-h2:pb-2 prose-h2:mt-8 prose-p:text-zinc-600 prose-p:leading-relaxed font-medium"
            >
              <Markdown>{resume}</Markdown>
              <div className="mt-12 flex justify-end gap-4 print:hidden">
                <Button variant="outline" size="sm" className="rounded-xl px-6 h-10 font-bold border hover:bg-zinc-50" onClick={() => window.print()}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button size="sm" className="rounded-xl px-6 h-10 font-bold bg-zinc-900 hover:bg-zinc-800" onClick={() => setResume("")}>
                  Start Over
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-zinc-400 text-center p-8">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FileUser className="h-10 w-10 text-indigo-200" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-2">Ready to Build</h4>
              <p className="max-w-xs mx-auto text-sm font-medium text-zinc-400 leading-relaxed">Fill in your details on the left and our AI will craft a professional resume for you.</p>
            </div>
          )}
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/30 rounded-bl-[6rem] -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50/10 rounded-tr-[4rem] -z-10" />
        </div>
      </div>
    </div>
  );
}

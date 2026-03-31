import React, { useState, useRef, useEffect } from "react";
import { generateText } from "../lib/gemini";
import { Button } from "./ui/Button";
import { Loader2, Download, Sparkles, FileUser, Upload, ChevronLeft, Check, Palette, Eye } from "lucide-react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type TemplateId = string;

interface Template {
  id: TemplateId;
  name: string;
  description: string;
  fields: string[];
  color: string;
  previewUrl: string;
  examples: {
    name: string;
    role: string;
    image: string;
  }[];
}

const BUILTIN_TEMPLATES: Template[] = [
  {
    id: "elite",
    name: "Elite Modern",
    description: "A sleek, high-impact design for modern professionals.",
    fields: [
      "Full Name", "Target Role", "Email", "Phone", "Location", "LinkedIn", 
      "Professional Summary", "Work Experience", "Education", "Key Skills", "Languages"
    ],
    color: "#0ea5e9",
    previewUrl: "https://i.ibb.co/0jFDYCkC/images-3.png",
    examples: [
      { name: "Alex Rivera", role: "Senior Software Engineer", image: "https://i.ibb.co/0jFDYCkC/images-3.png" },
      { name: "Sarah Chen", role: "Product Designer", image: "https://i.ibb.co/0jFDYCkC/images-3.png" }
    ]
  },
  {
    id: "bakchos",
    name: "Bakchos Professional",
    description: "A comprehensive layout for experienced executives.",
    fields: [
      "Full Name", "Current Position", "Email", "Phone", "Location", 
      "Summary", "Core Competencies", "Professional Experience", "Academic Background", "Certifications"
    ],
    color: "#10b981",
    previewUrl: "https://i.ibb.co/rK2vQzrj/bakchos.png",
    examples: [
      { name: "James Wilson", role: "Chief Operations Officer", image: "https://i.ibb.co/rK2vQzrj/bakchos.png" },
      { name: "Maria Garcia", role: "Marketing Director", image: "https://i.ibb.co/rK2vQzrj/bakchos.png" }
    ]
  },
  {
    id: "skill-focused",
    name: "Skill Focused",
    description: "Highlights your technical expertise and key achievements.",
    fields: [
      "Full Name", "Headline", "Email", "Phone", "Location", 
      "Technical Skills", "Soft Skills", "Experience", "Education", "Projects", "Achievements"
    ],
    color: "#f59e0b",
    previewUrl: "https://i.ibb.co/7JyhWwWS/images-2.png",
    examples: [
      { name: "David Kim", role: "Full Stack Developer", image: "https://i.ibb.co/7JyhWwWS/images-2.png" },
      { name: "Elena Rossi", role: "Data Scientist", image: "https://i.ibb.co/7JyhWwWS/images-2.png" }
    ]
  }
];

export function ResumeBuilder() {
  const [step, setStep] = useState<"select" | "fill" | "preview">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customColor, setCustomColor] = useState("#4f46e5");
  const [loading, setLoading] = useState(false);
  const [resumeMarkdown, setResumeMarkdown] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<Template | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCustomColor(template.color);
    // Initialize form data with empty strings for all fields
    const initialData: Record<string, string> = {};
    template.fields.forEach(field => initialData[field] = "");
    setFormData(initialData);
    setStep("fill");
  };

  const renderResumeContent = () => {
    if (!selectedTemplate) return null;

    if (selectedTemplate.id === "elite") {
      return (
        <div className="p-12 md:p-16 flex flex-col h-full">
          <div className="border-b-4 pb-10 mb-10" style={{ borderColor: customColor }}>
            <h1 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase leading-none mb-4">
              {formData["Full Name"] || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm font-black uppercase tracking-widest text-zinc-500">
              <span style={{ color: customColor }}>{formData["Target Role"] || "Professional Title"}</span>
              {formData["Email"] && <span>• {formData["Email"]}</span>}
              {formData["Phone"] && <span>• {formData["Phone"]}</span>}
              {formData["Location"] && <span>• {formData["Location"]}</span>}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-12 flex-grow">
            <div className="col-span-8 space-y-12">
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: customColor }}>Professional Summary</h2>
                <p className="text-zinc-600 leading-relaxed font-medium">{formData["Professional Summary"] || "Enter your summary..."}</p>
              </section>
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: customColor }}>Work Experience</h2>
                <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Work Experience"] || "Enter your experience..."}</div>
              </section>
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: customColor }}>Education</h2>
                <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Education"] || "Enter your education..."}</div>
              </section>
            </div>
            <div className="col-span-4 space-y-12 border-l pl-12 border-zinc-100">
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: customColor }}>Key Skills</h2>
                <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Key Skills"] || "Enter your skills..."}</div>
              </section>
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: customColor }}>Languages</h2>
                <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Languages"] || "Enter languages..."}</div>
              </section>
              {formData["LinkedIn"] && (
                <section className="space-y-4">
                  <h2 className="text-lg font-black uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: customColor }}>LinkedIn</h2>
                  <div className="text-zinc-600 leading-relaxed font-medium break-all">{formData["LinkedIn"]}</div>
                </section>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate.id === "bakchos") {
      return (
        <div className="p-12 md:p-16 space-y-12">
          <div className="text-center space-y-4 border-b-8 pb-12" style={{ borderColor: customColor }}>
            <h1 className="text-7xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
              {formData["Full Name"] || "Your Name"}
            </h1>
            <p className="text-2xl font-black tracking-[0.3em] text-zinc-400 uppercase">
              {formData["Current Position"] || "Current Position"}
            </p>
            <div className="flex justify-center gap-8 text-xs font-black uppercase tracking-widest text-zinc-500">
              {formData["Email"] && <span>{formData["Email"]}</span>}
              {formData["Phone"] && <span>{formData["Phone"]}</span>}
              {formData["Location"] && <span>{formData["Location"]}</span>}
            </div>
          </div>
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-center py-2 bg-zinc-50 rounded-xl" style={{ color: customColor }}>Summary</h2>
            <p className="text-zinc-600 leading-relaxed font-medium text-center max-w-3xl mx-auto">{formData["Summary"] || "Enter your summary..."}</p>
          </section>
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-center py-2 bg-zinc-50 rounded-xl" style={{ color: customColor }}>Core Competencies</h2>
            <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap text-center">{formData["Core Competencies"] || "Enter competencies..."}</div>
          </section>
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-center py-2 bg-zinc-50 rounded-xl" style={{ color: customColor }}>Professional Experience</h2>
            <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Professional Experience"] || "Enter experience..."}</div>
          </section>
          <div className="grid grid-cols-2 gap-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-[0.4em] text-center py-2 bg-zinc-50 rounded-xl" style={{ color: customColor }}>Academic</h2>
              <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap text-center">{formData["Academic Background"] || "Enter background..."}</div>
            </section>
            <section className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-[0.4em] text-center py-2 bg-zinc-50 rounded-xl" style={{ color: customColor }}>Certifications</h2>
              <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap text-center">{formData["Certifications"] || "Enter certifications..."}</div>
            </section>
          </div>
        </div>
      );
    }

    if (selectedTemplate.id === "skill-focused") {
      return (
        <div className="p-12 md:p-16 space-y-12">
          <div className="flex justify-between items-start border-b-2 pb-10" style={{ borderColor: customColor }}>
            <div className="space-y-2">
              <h1 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
                {formData["Full Name"] || "Your Name"}
              </h1>
              <p className="text-xl font-black text-indigo-600 uppercase tracking-widest">
                {formData["Headline"] || "Professional Headline"}
              </p>
            </div>
            <div className="text-right text-xs font-black uppercase tracking-widest text-zinc-500 space-y-1">
              {formData["Email"] && <p>{formData["Email"]}</p>}
              {formData["Phone"] && <p>{formData["Phone"]}</p>}
              {formData["Location"] && <p>{formData["Location"]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <section className="space-y-6 p-8 bg-zinc-50 rounded-[2rem]">
              <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: customColor }}>Technical Skills</h2>
              <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Technical Skills"] || "Enter technical skills..."}</div>
            </section>
            <section className="space-y-6 p-8 bg-zinc-50 rounded-[2rem]">
              <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: customColor }}>Soft Skills</h2>
              <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Soft Skills"] || "Enter soft skills..."}</div>
            </section>
          </div>
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter border-l-8 pl-6" style={{ borderColor: customColor }}>Experience</h2>
            <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Experience"] || "Enter experience..."}</div>
          </section>
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter border-l-8 pl-6" style={{ borderColor: customColor }}>Projects</h2>
            <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Projects"] || "Enter projects..."}</div>
          </section>
          <div className="grid grid-cols-2 gap-12">
            <section className="space-y-6">
              <h2 className="text-lg font-black uppercase tracking-widest border-l-8 pl-6" style={{ borderColor: customColor }}>Education</h2>
              <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Education"] || "Enter education..."}</div>
            </section>
            <section className="space-y-6">
              <h2 className="text-lg font-black uppercase tracking-widest border-l-8 pl-6" style={{ borderColor: customColor }}>Achievements</h2>
              <div className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{formData["Achievements"] || "Enter achievements..."}</div>
            </section>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const mimeType = file.type;

        const prompt = "Analyze this resume template image. Identify all the distinct sections and fields that a user would need to fill in (e.g., Name, Experience, Skills, etc.). Return ONLY a comma-separated list of field names.";
        const result = await generateText(prompt, "You are a resume template analyzer.", base64, mimeType);
        
        const identifiedFields = result.split(",").map(f => f.trim()).filter(f => f.length > 0);
        
        const customTemplate: Template = {
          id: "custom",
          name: "Uploaded Template",
          description: "Custom template analyzed by AI.",
          fields: identifiedFields.length > 0 ? identifiedFields : ["Full Name", "Summary", "Experience", "Skills", "Education"],
          color: "#4f46e5",
          previewUrl: reader.result as string,
          examples: []
        };

        handleTemplateSelect(customTemplate);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload Error:", err);
      setErrors({ general: "Failed to analyze template. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    const isFormEmpty = Object.values(formData).every(v => !v.trim());
    if (isFormEmpty) {
      setErrors({ general: "Please fill in at least one field to generate your resume." });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const details = Object.entries(formData)
        .map(([field, value]) => `${field}: ${value}`)
        .join("\n");

      const prompt = `Create a professional resume based on these details:
      ${details}
      
      The template style is: ${selectedTemplate?.name}.
      Format it in clean Markdown with professional headers and bullet points. 
      Ensure it reflects the structure of the selected template.`;
      
      const result = await generateText(prompt, "You are a professional resume writer and career coach.");
      setResumeMarkdown(result);
      setStep("preview");
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to generate resume." });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData["Full Name"] || "Resume"}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black font-display tracking-tight text-zinc-900">Choose a Template</h2>
              <p className="text-zinc-500 font-medium max-w-lg mx-auto">Select a professionally designed template or upload your own to get started.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {BUILTIN_TEMPLATES.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ y: -16, scale: 1.04 }}
                  onMouseEnter={() => setHoveredTemplate(template)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className="glass-card overflow-hidden rounded-[3rem] border-white/40 shadow-2xl group cursor-pointer bg-white"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-[1/1.414] relative overflow-hidden bg-white p-4">
                    <img 
                      src={template.previewUrl} 
                      alt={template.name}
                      className="w-full h-full object-contain transition-all duration-700 group-hover:brightness-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Button className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black uppercase tracking-[0.3em] text-[11px] px-10 py-7 shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                        Select Template
                      </Button>
                    </div>
                  </div>
                  <div className="p-10 space-y-6 bg-gradient-to-b from-white to-zinc-50/80">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-2xl text-zinc-900 tracking-tighter">{template.name}</h3>
                      <div className="w-5 h-5 rounded-full shadow-inner border-2 border-white" style={{ backgroundColor: template.color }} />
                    </div>
                    <p className="text-xs text-zinc-500 font-bold leading-relaxed uppercase tracking-wide opacity-80">{template.description}</p>
                    
                    <div className="space-y-3 pt-4 border-t border-zinc-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Example Resumes</p>
                      <div className="flex gap-2">
                        {template.examples.map((example, i) => (
                          <div key={i} className="flex-1 group/example relative">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm transition-all group-hover/example:shadow-md">
                              <img 
                                src={example.image} 
                                alt={example.name}
                                className="w-full h-full object-cover grayscale group-hover/example:grayscale-0 transition-all"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="mt-2">
                              <p className="text-[10px] font-bold text-zinc-900 truncate">{example.name}</p>
                              <p className="text-[8px] font-medium text-zinc-400 truncate uppercase">{example.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <div className="glass-card rounded-3xl border-2 border-dashed border-zinc-200 h-full flex flex-col items-center justify-center p-8 text-center space-y-4 group-hover:border-indigo-500 group-hover:bg-indigo-50/30 transition-all">
                  {uploading ? (
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                  ) : (
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-indigo-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900">Upload Template</h3>
                    <p className="text-sm text-zinc-500 font-medium">Upload an image of a resume you like, and our AI will analyze it.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "fill" && selectedTemplate && (
          <motion.div 
            key="fill"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-5 gap-8 items-start"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 md:p-8 rounded-3xl shadow-xl space-y-6 border-white/40">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStep("select")}
                    className="rounded-xl font-bold -ml-2"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-zinc-400" />
                    <input 
                      type="color" 
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-xl shadow-inner">
                    <FileUser className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold font-display tracking-tight text-zinc-900">Enter Your Details</h3>
                </div>

                <div className="space-y-5 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                        {field} {["LinkedIn", "Languages", "Achievements", "Projects", "Location"].includes(field) && <span className="text-zinc-300 font-medium lowercase">(Optional)</span>}
                      </label>
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/30 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/30 transition-all">
                        {field.toLowerCase().includes("experience") || field.toLowerCase().includes("summary") || field.toLowerCase().includes("about") ? (
                          <textarea
                            className="w-full p-3.5 rounded-xl bg-transparent outline-none min-h-[100px] text-sm font-medium leading-relaxed placeholder:text-zinc-300"
                            placeholder={`Enter your ${field.toLowerCase()}...`}
                            value={formData[field] || ""}
                            onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                          />
                        ) : (
                          <input
                            className="w-full p-3.5 rounded-xl bg-transparent outline-none font-bold text-base placeholder:text-zinc-300"
                            placeholder={`Enter your ${field.toLowerCase()}`}
                            value={formData[field] || ""}
                            onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="w-full py-8 text-lg font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 border-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>Crafting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Resume</span>
                    </div>
                  )}
                </Button>
                {errors.general && (
                  <p className="text-xs font-bold text-red-500 text-center uppercase tracking-wider">{errors.general}</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 sticky top-24">
              <div className="glass-card p-4 rounded-3xl bg-zinc-50/50 shadow-xl border-white/40 overflow-hidden">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Preview</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{selectedTemplate.name}</span>
                </div>
                
                <div className="relative origin-top scale-[0.45] md:scale-[0.55] lg:scale-[0.65] xl:scale-[0.75] -mb-[55%] md:-mb-[45%] lg:-mb-[35%] xl:-mb-[25%] pointer-events-none select-none shadow-2xl">
                  <div 
                    className="bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-zinc-100 antialiased mx-auto"
                    style={{ minHeight: "297mm", width: "210mm", imageRendering: "auto" }}
                  >
                    {renderResumeContent()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "preview" && (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep("fill")}
                className="rounded-xl font-bold w-full sm:w-auto"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Edit Details
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={downloadPDF}
                  disabled={loading}
                  className="rounded-xl font-bold border-2 w-full sm:w-auto"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Download PDF
                </Button>
                <Button 
                  onClick={() => setStep("select")}
                  className="rounded-xl font-bold bg-zinc-900 hover:bg-zinc-800 w-full sm:w-auto"
                >
                  New Resume
                </Button>
              </div>
            </div>

            <div 
              ref={resumeRef}
              className="bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-zinc-100 max-w-4xl mx-auto antialiased"
              style={{ minHeight: "297mm", width: "210mm", imageRendering: "auto" }}
            >
              {renderResumeContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredTemplate && step === "select" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-12 right-12 z-[200] hidden lg:block pointer-events-none"
          >
            <div className="bg-white p-10 rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.5)] border border-white/80 w-[650px] overflow-hidden">
              <div className="aspect-[1/1.414] rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl bg-white border border-zinc-100">
                <img 
                  src={hoveredTemplate.previewUrl} 
                  alt={hoveredTemplate.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] text-indigo-500">Ultra HD Preview</p>
                </div>
                <h4 className="text-4xl font-black text-zinc-900 leading-tight tracking-tighter">{hoveredTemplate.name}</h4>
                <p className="text-base text-zinc-500 font-bold leading-relaxed uppercase tracking-wide opacity-70">{hoveredTemplate.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

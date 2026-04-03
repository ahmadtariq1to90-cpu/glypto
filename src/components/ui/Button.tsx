import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  className, 
  variant = "primary", 
  size = "md", 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] border-none",
    secondary: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl dark:bg-white dark:text-black dark:hover:bg-zinc-200",
    outline: "border-2 border-border-main bg-transparent hover:bg-bg-card text-text-main hover:border-indigo-500/50",
    ghost: "hover:bg-indigo-500/10 text-text-muted hover:text-indigo-500",
    link: "bg-transparent text-indigo-500 hover:text-indigo-600 p-0 h-auto",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] font-black uppercase tracking-widest",
    md: "px-6 py-3 text-xs font-black uppercase tracking-widest",
    lg: "px-10 py-4 text-sm font-black uppercase tracking-widest",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

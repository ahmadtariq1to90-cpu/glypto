import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "Social" | "Productivity" | "Content" | "Design";
  color: string;
}

export type ToolView = "home" | string;
